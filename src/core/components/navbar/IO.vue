<script>
import { enums } from '@enso-ui/enums/src/pinia/enums';
import { app } from '@enso-ui/ui/src/pinia/app';
import { websockets } from '@enso-ui/ui/src/pinia/websockets';
import {
    computed, inject, onBeforeMount, onBeforeUnmount, ref,
} from 'vue';

export default {
    name: 'IO',

    setup(_, { slots }) {
        const errorHandler = inject('errorHandler');
        const http = inject('http');
        const route = inject('route');
        const toastr = inject('toastr');

        const imports = ref([]);
        const exports = ref([]);
        const listenTimer = ref(null);
        const listening = ref(false);
        const tasks = ref([]);

        const channels = computed(() => websockets().channels ?? {});
        const count = computed(() => imports.value.length
            + exports.value.length
            + tasks.value.length);

        const connect = () => websockets().connect(app().meta.csrfToken);
        const type = value => {
            switch (enums().enums.ioTypes._get(value)) {
            case 'import':
                return 'imports';
            case 'export':
                return 'exports';
            case 'task':
                return 'tasks';
            default:
                throw Error(`Unknown io type: ${enums().enums.ioTypes._get(value)}`);
            }
        };
        const bag = value => ({ imports, exports, tasks }[type(value)]);
        const index = operation => bag(operation.type).value
            .findIndex(({ id }) => id === operation.id);
        const push = operation => {
            if (index(operation) === -1) {
                bag(operation.type).value.push(operation);
            }
        };
        const update = operation => {
            const operationIndex = index(operation);

            if (operationIndex !== -1) {
                bag(operation.type).value.splice(operationIndex, 1, operation);
            } else {
                push(operation);
            }
        };
        const remove = operation => {
            const operationIndex = index(operation);

            if (operationIndex >= 0) {
                bag(operation.type).value.splice(operationIndex, 1);
            }
        };
        const process = operation => {
            switch (`${operation.status}`) {
            case enums().enums.ioStatuses.Started:
                push(operation);
                break;
            case enums().enums.ioStatuses.Finalized:
                remove(operation);
                break;
            default:
                update(operation);
                break;
            }
        };
        const listen = () => window.Echo.private(channels.value.io)
            .listen('.import', ({ operation }) => process(operation))
            .listen('.export', ({ operation }) => process(operation))
            .listen('.task', ({ operation }) => process(operation));
        const ensureListener = () => {
            if (listening.value) {
                return;
            }

            if (!window.Echo || !channels.value.io) {
                listenTimer.value = setTimeout(ensureListener, 250);
                return;
            }

            listening.value = true;
            connect()
                .then(listen);
        };
        const cancel = operation => {
            const operationType = enums().enums.ioTypes._get(operation.type);

            http.patch(route(`${operationType}.cancel`, { [operationType]: operation.id }))
                .then(({ data: { message } }) => toastr.warning(message))
                .catch(errorHandler);
        };

        onBeforeMount(ensureListener);
        onBeforeUnmount(() => clearTimeout(listenTimer.value));

        return () => slots.default({
            count: count.value,
            events: { cancel },
            exports: exports.value,
            imports: imports.value,
            tasks: tasks.value,
        });
    },
};
</script>

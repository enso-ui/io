<script>
import { enums } from '@enso-ui/enums/src/pinia/enums';
import formatDistance from '@enso-ui/ui/src/modules/plugins/date-fns/formatDistance';
import { isAfter } from 'date-fns';
import {
    onBeforeMount, onBeforeUnmount, ref,
} from 'vue';

export default {
    name: 'Operation',

    props: {
        cancellable: {
            type: Boolean,
            default: false,
        },
        operation: {
            type: Object,
            required: true,
        },
    },

    emits: ['cancel'],

    setup(props, { emit, slots }) {
        const end = ref(true);
        const elapsed = ref(null);
        const remaining = ref(null);
        const updater = ref(null);

        const update = () => {
            elapsed.value = formatDistance(props.operation.createdAt);

            remaining.value = props.operation.estimatedEnd
                && isAfter(new Date(props.operation.estimatedEnd), new Date())
                ? formatDistance(props.operation.estimatedEnd)
                : null;
        };
        const toggle = () => {
            end.value = !end.value;
        };

        onBeforeMount(() => {
            update();
            updater.value = setInterval(update, 1000);
        });
        onBeforeUnmount(() => clearInterval(updater.value));

        return () => slots.default({
            cancellable: props.cancellable,
            elapsed: elapsed.value,
            end: end.value,
            events: {
                click: () => emit('cancel', props.operation),
            },
            ioTypes: enums().enums.ioTypes,
            operation: props.operation,
            remaining: remaining.value,
            toggle,
        });
    },
};
</script>

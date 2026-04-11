<script>
import { useStore } from '../../../utils/pinia';

export default {
    name: 'IO',

    inject: ['errorHandler', 'http', 'route', 'toastr'],

    data: () => ({
        imports: [],
        exports: [],
        listenTimer: null,
        listening: false,
        tasks: [],
    }),

    computed: {
        channels() {
            return useStore('websockets').channels ?? {};
        },
        user() {
            return useStore('app').user;
        },
        meta() {
            return useStore('app').meta;
        },
        enums() {
            return useStore('enums').enums;
        },
        count() {
            return ['imports', 'exports', 'tasks']
                .reduce((count, type) => (count + this[type].length), 0);
        },
    },

    created() {
        this.ensureListener();
    },

    beforeUnmount() {
        clearTimeout(this.listenTimer);
    },

    methods: {
        connect() {
            return useStore('websockets').connect(useStore('app').meta.csrfToken);
        },
        cancel(operation) {
            const type = this.enums.ioTypes._get(operation.type);

            this.http.patch(this.route(`${type}.cancel`, { [type]: operation.id }))
                .then(({ data: { message } }) => this.toastr.warning(message))
                .catch(this.errorHandler);
        },
        ensureListener() {
            if (this.listening) {
                return;
            }

            if (!window.Echo || !this.channels.io) {
                this.listenTimer = setTimeout(() => this.ensureListener(), 250);
                return;
            }

            this.listening = true;
            this.connect()
                .then(() => this.listen());
        },
        listen() {
            window.Echo.private(this.channels.io)
                .listen('.import', ({ operation }) => this.process(operation))
                .listen('.export', ({ operation }) => this.process(operation))
                .listen('.task', ({ operation }) => this.process(operation));
        },
        process(operation) {
            switch (`${operation.status}`) {
            case this.enums.ioStatuses.Started:
                this.push(operation);
                break;
            case this.enums.ioStatuses.Finalized:
                this.remove(operation);
                break;
            default:
                this.update(operation);
                break;
            }
        },
        push(operation) {
            const index = this.index(operation);

            if (index === -1) {
                this.bag(operation.type).push(operation);
            }
        },
        update(operation) {
            const index = this.index(operation);

            if (index !== -1) {
                this.bag(operation.type).splice(index, 1, operation);
            } else {
                this.push(operation);
            }
        },
        remove(operation) {
            const index = this.index(operation);

            if (index >= 0) {
                this.bag(operation.type).splice(index, 1);
            }
        },
        index(operation) {
            return this.bag(operation.type)
                .findIndex(({ id }) => id === operation.id);
        },
        bag(type) {
            return this[this.type(type)];
        },
        type(type) {
            switch (this.enums.ioTypes._get(type)) {
            case 'import':
                return 'imports';
            case 'export':
                return 'exports';
            case 'task':
                return 'tasks';
            default:
                throw Error(`Unknown io type: ${this.enums.ioTypes._get(type)}`);
            }
        },
    },

    render() {
        return this.$slots.default({
            count: this.count,
            events: { cancel: this.cancel },
            exports: this.exports,
            imports: this.imports,
            tasks: this.tasks,
        });
    },
};
</script>

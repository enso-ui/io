<template>
    <operation>
        <template #status="{ operation }">
            {{ enums.exportStatuses._get(operation.status) }}
        </template>
        <template #body="{ operation }">
            <p class="one-line">
                <span class="has-text-weight-bold">
                    {{ i18n('type') }}:
                </span>&nbsp;{{ operation.payload.name }}
            </p>
        </template>
        <template #info="{ operation }">
            <p class="is-flex is-align-items-center">
                <span class="icon has-text-success">
                    <fa :icon="faCheck"/>
                </span>
                <span class="has-text-weight-bold has-text-success">
                    {{ shortNumber(operation.payload.step) }}
                </span>
                <span class="icon">
                    /
                </span>
                <span class="has-text-weight-bold has-text-info">
                    {{ shortNumber(operation.payload.steps) }}
                </span>
            </p>
        </template>
    </operation>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { shortNumber } from '@enso-ui/mixins';
import Operation from './Operation.vue';
import { useStore } from '../../../../utils/pinia';

export default {
    name: 'Export',

    components: { Fa, Operation },

    inject: ['i18n'],

    data: () => ({
        faCheck,
    }),

    computed: {
        enums() {
            return useStore('enums').enums;
        },
    },

    methods: {
        shortNumber(value) {
            return shortNumber(value);
        },
    },
};
</script>

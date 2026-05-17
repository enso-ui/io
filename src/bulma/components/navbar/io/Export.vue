<template>
    <operation cancellable>
        <template #status="{ operation }">
            {{ enums().enums.exportStatuses._get(operation.status) }}
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
                    {{ shortNumber(operation.payload.entries) }}
                </span>
                <span class="icon">
                    /
                </span>
                <span class="has-text-weight-bold has-text-info">
                    {{ shortNumber(operation.payload.total) }}
                </span>
            </p>
        </template>
    </operation>
</template>

<script setup>
import { inject } from 'vue';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { enums } from '@enso-ui/enums/src/pinia/enums';
import { shortNumber } from '@enso-ui/mixins';
import Operation from './Operation.vue';

defineOptions({
    name: 'Export',
});

const i18n = inject('i18n');
</script>

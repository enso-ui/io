<template>
    <operation cancellable>
        <template #status="{ operation }">
            <span class="has-text-weight-bold">
                {{ enums().enums.importStatuses._get(operation.status) }}
            </span>
        </template>
        <template #body="{ operation }">
            <p class="one-line">
                <span class="has-text-weight-bold">
                    {{ i18n('file') }}:
                </span> {{ operation.payload.filename }}
            </p>
            <div v-if="operation.payload.sheet">
                <p class="one-line">
                    <span class="has-text-weight-bold">
                        {{ i18n('sheet') }}:
                    </span> {{ operation.payload.sheet }}
                </p>
            </div>
        </template>
        <template #info="{ operation }">
            <p class="is-flex is-align-items-center">
                <span class="icon has-text-success">
                    <fa :icon="faCheck"/>
                </span>
                <span class="has-text-weight-bold has-text-success">
                    {{ shortNumber(operation.payload.successful) }}
                </span>
                <span class="icon has-text-danger">
                    <fa :icon="faXmark"/>
                </span>
                <span class="has-text-weight-bold has-text-danger">
                    {{ shortNumber(operation.payload.failed) }}
                </span>
            </p>
        </template>
    </operation>
</template>

<script setup>
import { inject } from 'vue';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { enums } from '@enso-ui/enums/src/pinia/enums';
import { shortNumber } from '@enso-ui/mixins';
import Operation from './Operation.vue';

defineOptions({
    name: 'Import',
});

const i18n = inject('i18n');
</script>

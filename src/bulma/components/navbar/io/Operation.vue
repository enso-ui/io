<template>
    <div class="navbar-content"
        :class="$attrs.class">
        <core-operation v-bind="$attrs">
            <template #default="{
                    elapsed, end, events, ioTypes, operation,
                    remaining, toggle, cancellable,
                }">
                <div class="level is-mobile m-0">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="one-line">
                                <span class="has-text-weight-bold">
                                    {{ ioTypes._get(operation.type) }}:&nbsp;
                                </span>
                                <slot name="status"
                                    :operation="operation"/>
                            </p>
                        </div>
                    </div>
                    <div class="level-right"
                        v-if="operation.owner">
                        <div class="level-item">
                            <avatar class="media is-24x24"
                                :user="operation.owner"/>
                        </div>
                    </div>
                </div>
                <slot name="body" :operation="operation"/>
                <div class="level is-mobile pt-1
                    pb-1 m-0">
                    <div class="level-item">
                        <progress class="progress is-xsmall is-dark"
                            :value="operation.progress"
                            max="100"
                            v-if="operation.progress !== null">
                            {{ operation.progress }}%
                        </progress>
                        <progress class="progress is-xsmall is-dark"
                            max="100"
                            v-else>
33%
                        </progress>
                    </div>
                    <div class="level-item is-narrow"
                        v-if="cancellable">
                        <a class="button is-small is-naked"
                            v-on="events">
                            <fa :icon="faCircleXmark"/>
                        </a>
                    </div>
                </div>
                <div class="level is-mobile">
                    <div class="level-left">
                        <slot name="info"
                        :operation="operation"/>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <template v-if="end">
                                <span class="is-size-7 has-text-weight-bold"
                                    v-if="remaining">
                                    {{ remaining }}
                                </span>
                                <span class="icon is-small"
                                    v-else>
                                    <fa icon="spinner"
                                        :icon="faSpinner"
                                        pulse/>
                                </span>
                            </template>
                            <span class="is-size-7 has-text-weight-bold"
                                v-else>
                                {{ elapsed }}
                            </span>
                            <a class="button is-small is-naked"
                                @click.stop="toggle">
                                <span class="icon is-small">
                                    <fa icon="hourglass-end"
                                        :icon="faHourglassEnd"
                                        v-if="end"/>
                                    <fa :icon="faHourglassStart"
                                        v-else/>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </template>
        </core-operation>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import {
    faHourglassStart, faHourglassEnd, faSpinner, faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import Avatar from '@enso-ui/users/src/bulma/pages/users/components/Avatar.vue';
import CoreOperation from '../../../../core/components/navbar/io/Operation.vue';

export default {
    name: 'Operation',

    components: { Avatar, CoreOperation, Fa },

    inheritAttrs: false,

    data: () => ({
        faCircleXmark,
        faHourglassEnd,
        faHourglassStart,
        faSpinner,
    }),
};
</script>

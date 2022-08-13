<template lang="html">
  <div class="progress" :class="[type, size]">
    <div :style="percentStyling"></div>
  </div>

</template>

<style scoped>
.progress {
  display: flex;
  height: 2rem;
  width: 100%;
  background: var(--c-gray-200);
}

.progress.small {
  height: .5rem;
}

.progress.medium {
  height: 2rem;
}

.progress.large {
  height: 4rem;
}

.progress > div {
  content: '';
  flex: 0;
  transition: .5s all;
}

/* Default */
.progress.default {
  background: var(--c-gray-200);
}

.progress.default > div {
  background: var(--c-gray-500);
  border-right: .2rem solid var(--c-gray-900);
}

/* Primary */
.progress.primary {
  background: var(--c-primary-200);
}

.progress.primary > div {
  background: var(--c-primary-500);
  border-right: .2rem solid var(--c-primary-700);
}

/* Danger */
.progress.danger {
  background: var(--c-danger-200);
}

.progress.danger > div {
  background: var(--c-danger-500);
  border-right: .2rem solid var(--c-danger-900);
}

</style>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop({ default: 100 })
  private maximum: number;

  @Prop({ default: 'default' })
  private type: string;

  @Prop({ default: 'medium' })
  private size: string;

  @Prop({ default: 0 })
  private current: number;

  private visible: boolean = true;

  get percentStyling() {
    let percent = (this.current / this.maximum) * 100;
    if (percent > 100) { percent = 100; }
    if (percent < 0) { percent = 0; }
    return `flex: 0 0 ${percent}%`;
  }
}
</script>

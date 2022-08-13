<template>
  <span>
    <!-- <span id="copyText" ref="copyText"><slot /></span> -->
    <textarea
      :id="id"
      v-model="text"
      tabindex="-1" />
    <span>{{ text }}</span>
    <button
      @click="copy"
      title="Copy">
      <i class="fas fa-copy"></i>
    </button>
  </span>
</template>

<script lang="ts">
/* tslint:disable:no-console */

import { Component, Vue } from 'vue-property-decorator';
import { v4 as uuid } from 'uuid';

import API from '@/API';

@Component
export default class Copy extends Vue {
  /* Variables */
  private text: string = '';

  /* Lifecycle */
  private mounted(): void {
    if (Object.keys(this.$slots).length) {
      this.text = this.$slots.default![0].text || ''; /* Uses non-null assertion */
    }
  }

  /* Methods */
  get id(): string {
    return `hiddenText-${uuid()}`;
  }

  private copy(): void {
    (document.querySelector(`#${this.id}`) as HTMLInputElement).select();
    document.execCommand('Copy');
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

}

</script>

<style lang="scss" scoped>
textarea {
  position: absolute;
  height: 0;
  width: 0;
  border: none;
  overflow: hidden;
  opacity: 0;
  z-index: -1;
  // display: none;
}
</style>

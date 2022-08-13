<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
  @Prop({ required: true })
  private name: string;

  @Prop()
  private updates: string;

  @Prop({ default: false })
  private selected: boolean;

  private isActive: boolean = false;

  private created(): void {
    // this.tabs = this.$children;
  }
  private mounted(): void {
    this.isActive = this.selected;
  }

  get href() {
    return `#${this.name.toLowerCase().replace(/ /g, '-')}`;
  }
}
</script>

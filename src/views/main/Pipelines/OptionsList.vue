<template>
  <div>
    <div>
      <span class="right">
        <span class="c-primary-500" v-if="selected">
          <i :class="active"></i>
        </span>
        <span class="c-gray-200" v-else>
          <i :class="inactive"></i>
        </span>
      </span>
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionsList extends Vue {
  /* Variables */
  @Prop()
  private title: string;

  @Prop()
  private selected: boolean;

  @Prop({ default: 'fas fa-check-square' })
  private active: string;

  @Prop({ default: 'fas fa-square' })
  private inactive: string;

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="graphic">
    <h2>{{ text }}</h2>
    <i :class="icon" />
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SignUpGraphic extends Vue {
  /* Variables */
  @Prop({ default: 'fas fa-bomb'})
  private icon: string;

  @Prop({ default: 'Welcome'})
  private text: string;

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>

<style lang="scss" scoped>

.fas {
  font-size: 12rem;
  margin-top: 6rem;
  padding-top: 0.1rem;
  // color: var(--c-primary-500);
  background: linear-gradient(
    20deg,
    var(--c-primary-600),
    var(--c-primary-400)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}


/* IE1 fix */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .fas {
    background: transparent;
    color: var(--c-primary-500);
  }
}

</style>

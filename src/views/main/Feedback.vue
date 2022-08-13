<template>
  <div>
    <h1>Feedback</h1>
    <empty icon="fas fa-coffee">
      <div slot="title">Got Suggestions?</div>
      <div slot="description">
        <p>
          cascadeo.io is always trying to improve. If you have any suggestions,
          please email us know and we will send you a Starbucks giftcard, on us!
        </p>
        <a href="mailto:feedback@cascadeo.io" class="button primary link">
          feedback@cascadeo.io
        </a>
      </div>
    </empty>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Feedback extends Vue {
  /* Variables */

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

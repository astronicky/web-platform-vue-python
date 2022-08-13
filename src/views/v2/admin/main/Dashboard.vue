<template>
  <div class="container">
    <h1>Admin Portal - Dashboard</h1>

    <empty icon="fas fa-grin">
      <div slot="title">Getting Started</div>
      <div slot="description">
        <p>
          Let's you get started using the Platform in three steps:

          <ul class="inline-block text-left">
            <li><span class="c-primary-500 bold">1.</span>&nbsp; Create an organization</li>
            <li><span class="c-primary-500 bold">2.</span>&nbsp; Add integrations</li>
            <li><span class="c-primary-500 bold">3.</span>&nbsp; Setup data pipelines</li>
          </ul>
        </p>
      </div>
    </empty>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class Welcome extends Vue {
  /* Variables */

  /* Lifecycle */
  private created(): void {
    /* If you can an organization, don't show welcome screen */
    // if (API.Organization_v2.getActive()) {
    //   this.$router.replace('/');
    // }
  }

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

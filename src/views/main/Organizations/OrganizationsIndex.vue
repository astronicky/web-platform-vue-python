<template>
  <div>
    <h1>Organizations</h1>
    Routing...
    <!--
      In the future there might be a page to list out all organizations.
    -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router from '@/router/router';

@Component
export default class OrganizationsIndex extends Vue {
  /* Variables */

  /* Lifecycle */
  private created(): void {
    router.replace('/');
  }

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

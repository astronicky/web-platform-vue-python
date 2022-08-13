<template>
  <div>
    <spin message="Logging into cascadeo.io" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router from '@/router/router';

@Component
export default class V2Redirect extends Vue {
  /* Variables */

  /* Lifecycle */
  private created(): void {
    /**
     * Session is already valid, goto app root
     * Returning from logging in w/ Auth0 + valid authResult
     * Returning from logging in w/ Auth0 + *invalid* authResult
     */
    router.replace('/');
  }

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

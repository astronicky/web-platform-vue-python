<template>
  <div>
    <spin message="Logging into cascadeo.io" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Auth from '@/common/auth';
import router from '@/router/router';

@Component
export default class AuthCallback extends Vue {
  /* Variables */

  /* Lifecycle */
  private created(): void {
    /**
     * Session is already valid, goto app root
     * Returning from logging in w/ Auth0 + valid authResult
     * Returning from logging in w/ Auth0 + *invalid* authResult
     */

    Auth.validSession()
      .then(() => {
        const routeRequest = localStorage.getItem('request_route_path');
        const routeExpiry = localStorage.getItem('request_route_expiry');
        localStorage.setItem('mode', 'v1');
        /* Checking if a requested route was previously set and it is valid (1hr window) */
        if (routeRequest && routeExpiry && Date.now() < Number(routeExpiry)) {
          router.replace(routeRequest);
        } else {
          router.replace('/');
        }
        /* Clears route request data always */
        localStorage.removeItem('request_route_path');
        localStorage.removeItem('request_route_expiry');
      })
      .catch(() => {
        Auth.parseUrl()
          .then((authResult) => {
            Auth.setLocalSession(authResult);
            router.replace('/');
          })
          .catch(() => {
            router.replace('/login');
          });
      });

  }

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

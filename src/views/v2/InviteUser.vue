<template>
  <div class="invite">
    <!--<img src="@/assets/logo.svg" alt="Cascadeo logo" />-->
    <spin v-if="loading" message="Verifying cascadeo.io invite request..." />
    <spin v-if="!loading && verified" :message="successMessage" />
    <spin
      v-if="!loading && !verified"
      message="
      Your cascadeo.io invite request is either invalid or has expired. Please contact support@cascadeo.io for further assistance."
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';
@Component
export default class InviteCallback extends Vue {
  private verified: boolean = false;
  private loading: boolean = true;
  private successMessage: string = '';
  private async created(): Promise<void> {
    if ('id' in this.$route.query) {
      try {
        const id = this.$route.query.id as string;
        const organizationId = await API.User.v2_verifyInvite(id);
        this.successMessage = `Invite successfully verified. Welcome to the '${organizationId}' organization!`;
        this.verified = true;
      } finally {
        this.loading = false;
        setTimeout(() => router.replace('/'), 5000);
      }
    } else {
      this.loading = false;
    }
    setTimeout(() => router.replace('/'), 5000);
  }
}
</script>

<style lang="scss" scoped>
.invite img,
.invite svg {
  display: block;
  width: 20rem;
  height: auto;
  margin: 0 auto 4rem auto;
}
</style>

<template>
  <div class="container">
    <h1>Welcome to cascadeo.io!</h1>

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
        <button
          @click="showAddOrgModal()" class="button primary outline large">
          <i class="fas fa-chevron-right"></i>
          Create organization
        </button>
      </div>
    </empty>
    <modal v-model="addOrgModalEnabled">
      <OrganizationsAdd
        :modalEnabled="addOrgModalEnabled"
        @addOrgSucceeded="hideAddOrgModal()" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import OrganizationsAdd from './Organizations/OrganizationsAdd.vue';
import Iam from '@/common/iam';
import router from '@/router/router';

@Component({
  components: {
    OrganizationsAdd,
  },
})
export default class Welcome extends Vue {
  /* Variables */
  private addOrgModalEnabled: boolean = false;
  private currentUser: string = Iam.currentUser();
  private organizations: Organization[] = [];
  private accessibleOrgs = API.Organization_v2.getAccessible();

  /* Lifecycle */
  private created(): void {
    /* If you can an organization, don't show welcome screen */
    if (API.Organization_v2.getActive()) {
      this.$router.replace('/');
    }
  }

  /* Methods */
  private showAddOrgModal() {
    this.addOrgModalEnabled = true;
    this.$validator.reset();
  }

  private hideAddOrgModal() {
    this.addOrgModalEnabled = false;
    this.getOrgs();
  }

  private async getOrgs(): Promise<void> {
    await API.Organization_v2.sync(this.currentUser);
    this.accessibleOrgs = API.Organization_v2.getAccessible();
    this.organizations = await API.Organization_v2.getUserOrgTree(this.currentUser, '');
    this.organizations = API.Organization_v2.sort(this.organizations);
    router.push('/integrations');
  }

}

</script>

<style lang="scss" scoped>
</style>

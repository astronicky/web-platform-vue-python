<template>
  <div class="container">
    <a
      v-if="integrations.length > 0 && allowAccess"
      href="#new"
      class="button outline default new"
    >
      <i class="fas fa-plus"></i>
      Add New
    </a>
    <h1>Integrations</h1>

    <div class="row">
      <div class="clg12 cxl9">
        <div v-if="integrations && integrations.length">
          <h2>
            Current
            <span v-if="sortedIntegrations.length > 0"
              >({{ sortedIntegrations.length }})</span
            >
          </h2>
          <CurrentIntegrations
            :integrations="sortedIntegrations"
            v-on:deleteIntegration="getIntegrations()"
          />
          <br />
        </div>

        <h2 id="new">Add New</h2>
        <IntegrationsList :types="['inputs', 'outputs']" controls />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import IAM from '@/common/iam';

import IntegrationsList from './IntegrationsList.vue';
import CurrentIntegrations from './CurrentIntegrations.vue';
import API from '@/API';
import router from '@/router/router';

@Component({
  components: {
    IntegrationsList,
    CurrentIntegrations,
  },
})
export default class IntegrationsIndex extends Vue {
  /* Variables */

  private integrations: Array<Integration<All>> = [];
  private sortedIntegrations: Array<Integration<All>> = [];
  private allowAccess: boolean = false;
  private currentUser: string = IAM.currentUser();

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  /* Lifecycle */
  private async created() {
    await API.Organization_v2.sync(this.currentUser);
    if (this.currentOrg) {
      this.getIntegrations();
    } else {
      // redirect to welcome page
      router.push('/welcome');
    }

    this.allowAccess = this.checkAccess();
  }

  /* Methods */
  private checkAccess() {
    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      return IAM.checkAuthz(['integration:write'], API.Organization_v2.getActive());
    } else {
      return IAM.checkAuthz(['admin']);
    }
  }

  @Watch('currentOrg')
  private updateSelected() {
    this.allowAccess = this.checkAccess();
    this.getIntegrations();
  }

  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
      this.sort();
    });
  }

  @Watch('integrations')
  private sort(): void {
    this.integrations.forEach((x, i) => {
      // Hardcode threshold evaluator setting for now until we add new metadata to integrations
      if (x.definition_id === 'globe_billing') {
        this.integrations[i].metadata.threshold_evaluator = 'globe_billing';
      } else {
        const evaluator = 'alertsv2';
        this.integrations[i].metadata.threshold_evaluator = evaluator;
      }
    });
    this.sortedIntegrations = this.integrations;
  }
}
</script>

<style lang="scss" scoped>
.new {
  float: right;
  margin-top: 1rem;
}
</style>

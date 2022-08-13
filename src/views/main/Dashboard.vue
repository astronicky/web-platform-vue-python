<template>
  <div>
    <button class="button primary dashboardButton" @click="backToIntegration()">
      New Dashboard
    </button>
    <h1>Dashboard</h1>
    <div v-if="sortedIntegrations.length && !this.snapshot.snapshoturl">
      <h4>Select an Integration to view Dashboard</h4>
      <br />
      <select
        name="dropdown"
        v-validate="'required'"
        v-model="integrationSelected"
        @change="onIntegrationSelectChange()"
      >
        <option disabled selected value="">Please select one</option>
        <option
          v-for="integration in sortedIntegrations"
          :key="integration.id"
          :value="integration"
        >
          {{
            integration.metadata.friendly_name ||
              integration.metadata.project_name
          }}
        </option>
        <option
          v-for="anomalyintegration in sortedAnomalyIntegrations"
          :key="anomalyintegration.id"
          :value="anomalyintegration"
        >
          {{
            anomalyintegration.metadata.friendly_name ||
            anomalyintegration.metadata.project_name ||
            anomalyintegration.definition_id
          }}
        </option>
      </select>
      <br />
    </div>
    <div v-if="this.snapshot.snapshoturl && integrationSelected">
      <div class="row" v-if="false">
        <div class="clg3 cmd4 csm12">
          <label for="url">Grafana URL</label>
        </div>
        <div class="clg9 cmd8 csm12">
          <input id="url" name="url" type="text" v-model="url" />
        </div>
      </div>

      <iframe
        :src="`${this.snapshot.snapshoturl}`"
        width="650"
        height="300"
        class="iframe"
        frameborder="0"
      ></iframe>
    </div>

    <div v-if="!integrations.length">
      <empty icon="fas fa-chart-bar">
        <div slot="title">Dashboard</div>
        <div slot="description">
          <p v-if="this.loadingMessage === 'Dashboard is Loading...'">
            View all the metrics we are watching in one place.
            {{ this.loadingMessage }}
          </p>
          <p v-else>
            {{ this.loadingMessage }} <br />
            <a :href="'/integrations'" class="button default link small">
              <i class="fas fa-plug"></i>
              To Integrations
            </a>
          </p>
          <br />
        </div>
      </empty>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class Grafana extends Vue {
  /* Variables */
  private loadingMessage: string;
  private integrationSelected: string = '';
  private integrations: Array<Integration<All>> = [];
  private sortedIntegrations: Array<Integration<All>> = [];
  private sortedAnomalyIntegrations: Array<Integration<All>> = [];

  private snapshot: DashboardSnapshot = {
    deletekey: '',
    snapshoturl: '',
    deleteurl: '',
    url: '',
  };

  get organization(): string {
    return API.Organization_v2.getCurrentId();
  }

  /* Lifecycle */
  private created(): void {
    this.getIntegrations();
    this.loadingMessage = 'Dashboard is Loading...';
    if (!this.snapshot.snapshoturl || this.snapshot.snapshoturl === '') {
      this.loadingMessage =
        'Dashboard could not load. Add environment Integration';
    }
  }

  /* Methods */
  @Watch('organization')
  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
      // this.sort();
    });
  }

  @Watch('integrations')
  private sort(): void {
    const tempIntegrations = this.integrations;
    this.sortedAnomalyIntegrations = [];
    tempIntegrations.forEach((x, i) => {
      /* Find 'netapp' integrations */
      if (
        x.definition_id !== 'aws' &&
        x.definition_id !== 'gcp' &&
        x.definition_id !== 'azure' &&
        x.definition_id !== 'agent' &&
        x.definition_id !== 'zenoss' &&
        x.definition_id !== 'windows'
      ) {
        tempIntegrations.splice(i, 1);
      }

      if (x.definition_id === 'zenoss') {
        const friendlyName: string = x.metadata.friendly_name + '_anomaly';
        const zenAnomaly = {definition_id: 'zenoss_anomaly'} as Integration<ZenossAnomaly>;
        zenAnomaly.id = '1234' + x.id;
        zenAnomaly.metadata = {friendly_name: friendlyName, integration_id: x.id};
        this.sortedAnomalyIntegrations.push(zenAnomaly);
      }
    });

    this.sortedIntegrations = tempIntegrations;
  }

  private onIntegrationSelectChange(): void {
    this.init();
  }

  private init(): void {
    const variables = {};
    // const snapshot = DashboardSnapshot

    const snapshot = API.Dashboard.createDashboard(
      variables,
      this.integrationSelected
    );
    // this.snapshot = {deletekey:'', snapshoturl:'', deleteurl:'',url:'' }; /* Sets a clean alert array */
    Promise.all([snapshot]).then((res) => {
      snapshot.then((integrationsRes) => {
        this.snapshot = res[0];
      });
    });
  }

  private backToIntegration(): void {
    this.integrationSelected = '';
    this.snapshot.snapshoturl = '';
  }
  @Watch('organization')
  private refreshDashboard(): void {
    this.integrationSelected = '';
    this.snapshot.snapshoturl = '';
  }
}
</script>

<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 80vh;
}
/*.selectInt {
  height: 5vh;
}*/
.dashboardButton {
  float: right;
}
</style>

<template>
    <div>
      <div class="load-css spinner c-gray-500" v-if="loading">Chart is loading...</div>
      <div v-else class="container">
          <div v-if="severityDataWarn.values.every(item => item === 0) && severityDataCrit.values.every(item => item === 0)">
            <div class="no-data">NO DATA</div>
          </div>
          <div v-else>
          <insights-chart :showTitle=showTitle :orgName="chartOrgName" :integrationName="integrationName" :integrationID="integrationID" :dates="severityDataCrit.dates" :valuesCritArray="severityDataCrit.values" :valuesWarnArray="severityDataWarn.values"></insights-chart>
          </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import InsightsChart from './InsightsChart.vue';
import router from '@/router/router';



@Component({
  components: {
    'insights-chart': InsightsChart,
  },
})

export default class AlertsTrend extends Vue {
/* Lifecycle */
  @Prop()
  private integrationID: string;

  @Prop()
  private integrationName: string;


  @Prop()
  private showTitle: boolean;

  private chartOrgName: string;
  private loading: boolean = true;
  private severityDataCrit: any[] = [];
  private severityDataWarn: any[] = [];
  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
  get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

  private created(): void {
    console.log('Integration ID: ', this.integrationID);
    console.log('Show Title:', this.showTitle);
    this.chartOrgName = this.currentOrgName;
    this.showAlertsChart();
  }

  private async showAlertsChart(): Promise<void> {
    try {
        [ this.severityDataCrit,
            this.severityDataWarn ] = await Promise.all([
                API.Analyticsv3.getAlertsData(this.integrationID, this.currentOrg, 'crit'),
                API.Analyticsv3.getAlertsData(this.integrationID, this.currentOrg, 'warn'),
          ]);
    } finally {
        this.loading = false;
    }
  }
}

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.no-data {
  width: 100%;
  height: 100%;
  min-height: 6rem;
  line-height: 6rem;
  text-align: center;
  color: #555;
  font-size: 2rem;
}
</style>

<template>
    <div>
        <h1>Insights Dashboard</h1>
        <div>
            <div>
                <button class="button outline default new" @click="backToMain()">
                <i class="fas fa-angle-left"></i>
                Back to Main View
                </button>
            </div>
            <div> 
                <div class="load-css spinner c-gray-500" v-if="loading">Chart is loading...</div>
                <div v-else class="container">
                    <insights-chart :orgName="chartOrgName" :integrationID="integrationID" :dates="severityDataCrit.dates" :valuesCritArray="severityDataCrit.values" :valuesWarnArray="severityDataWarn.values"></insights-chart>
                </div>
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

export default class InsightsView extends Vue {
/* Lifecycle */
  @Prop()
  private integrationID: string;
  private chartOrgName: string;
  private loading: boolean = true;
  private severityDataCrit: any[] = [];
  private severityDataWarn: any[] = [];
  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
  get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

  private created(): void {
    console.log('Integration ID: ', this.integrationID);
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

  private backToMain(): void {
    router.push('/insights');
  }
}

</script>

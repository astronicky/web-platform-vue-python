<template>
  <div class = "container">
    <h1>Insights Main</h1>
      <h3><strong>Alerts</strong></h3>
      <hr />
      <div class="content">
        <div v-for="integration in integrations"
          :key="integration.id"
          :value="integration">
            <div v-if="integration.definition_id === 'aws'">
              <div>
              <strong>{{ integration.name }}</strong>   [ {{ integration.id }} ]              
              <router-link :to="`/insights/${integration.id}`">
                View Charts
              </router-link>
              </div>
              <p></p>
            </div><!-- div.v-if -->
        </div> <!-- div.v-for integrations Alerts-->
        <h3><strong>Recommendations</strong></h3>
        <hr />
        <table class="recommendations-table"> 
          <thead class="header-table">
          <tr class="header-row">
            <th>Integration ID</th>
            <th>Date Evaluated</th>
            <th>Resource ID</th>
            <th>Recommendation</th>
          </tr>
          </thead>
        <tr v-for="recommendation in recommendations"
          :key="recommendation.RecommendationID"
          :value="recommendation">
              <td>{{ recommendation.IntegrationID }}</td>
              <td>{{ recommendation.DateEvaluated }}</td>
              <td>{{ recommendation.ResourceID }}</td>
              <td>{{ recommendation.Message }}</td>
              
        </tr> <!-- tr.v-for recommendations-->
        </table>
      </div> <!-- div.content -->
  </div> <!-- div.container -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import InsightsView from './InsightsView.vue';
import InsightsRecommendations from './InsightsRecommendations.vue';

@Component({
  components: {
    'insights-view': InsightsView,
    'insights-reco': InsightsRecommendations,
  },
})



export default class InsightsIndex extends Vue {
/* Lifecycle */
  private newID: string;
  private chartOrgName: string;
  private integrationID: string;
  private integrations: Array<Integration<All>> = [];
  private recommendations: any[] = [];


  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
  get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
    });
  }

  private async created(): Promise<void> {
    this.chartOrgName = this.currentOrgName;
    this.getIntegrations();
    this.recommendations = await API.Analyticsv3.getRecommendations(this.currentOrg);
  }
}
</script>

<style lang="scss" scoped>

.recommendations-table {
  border: 1px solid black;
  padding: 0;
  margin: 0;
  border-collapse: collapse;
}

.header-table {
  background-color: rgb(220, 243, 249);
}

.recommendations-table td, .recommendations-table th {
  padding: 5px;
  border: 1px solid black;
}
</style>

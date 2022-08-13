<template>
    <div>
        <h4>Recommendations</h4>
        <div>
          {{recommendations.resources}}
           {{recommendations.values}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class InsightsRecommendations extends Vue {
/* Lifecycle */
  private recommendations: any[] = [];
  private integrationID: string;

  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
  get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

  private async created(): Promise<void> {
    // console.log('Loading Recom view');
    this.integrationID = this.$route.params.integrationID;
    console.log(this.$route.params);
    console.log(this.integrationID);
    this.recommendations = await API.Analyticsv3.getRecommendations(this.currentOrg);
    console.log(this.recommendations);
  }

}

</script>

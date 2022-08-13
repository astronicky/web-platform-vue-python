<template>
    <div class="container">
        <h1>Home</h1>
        <div class="content-container">
            <div class="left">
                <div v-for="integration in integrations"
                    :key="integration.id"
                    :value="integration">
                    <div class="alerts box" v-if="['aws', 'azure', 'gcp'].includes(integration.definition_id)">
                            <div>
                                <div class="header-name"><a :href="`/v2/dashboard`"> Alerts Trend of {{integration.metadata.friendly_name || integration.metadata.name || integration.metadata.project_name || integration.id}}</a></div>
                                <AlertsTrend :integrationID="integration.id" :integrationName="integration.metadata.friendly_name" :showTitle="false" />
                            </div>
                        </div> 
                    </div>
                </div>
            </div>

            <div class="right">
                <div  v-for="integration in integrations"
                        :key="`${integration.id}-${integration.definition_id}`">
                    <div class="globe-billing box" v-if="integration.definition_id == 'globe_billing'">
                        <GlobeBillingDashboardWidget :id="integration.id" :integrationName="integration.metadata.friendly_name" />
                    </div>
                </div>
               <div class="inventory box">
                    <h3>Inventory</h3>
                    <div class="inventory-content">
                        <InventoryViewReports :isFromDashboard="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import InsightsAlertsWidget from '@/components/insights/InsightsAlertsWidget.vue';
import InventoryViewReports from '../Inventory/InventoryViewReports.vue';
import GlobeBillingDashboardWidget from '@/components/globe-billing/GlobeBillingDashboardWidget.vue';
import AlertsTrend from '../Insights/AlertsTrend.vue';

import cascadeodark from '../../../styles/cascadeo-dark.json';

@Component ({
  components: {
    InsightsAlertsWidget,
    GlobeBillingDashboardWidget,
    InventoryViewReports,
    AlertsTrend,
  },
})
export default class HomeDashboardIndex extends Vue {
    private integrationID: string;
    private integrations: Array<Integration<All>> = [];
    private loading: boolean = true;


    get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
    get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

    private async getIntegrations(): Promise<void> {
        this.integrations = await API.Integration.get();
    }

    private created(): void {
        this.getIntegrations();
    }

}

</script>

<style lang="scss" scoped>
.content-container {
    width: 100%;
}
.box {
    background-color: #fff;
    margin: 10px;
    padding: 10px;
}

.left {
    float: left;
    width: 70%;
}

.right {
    float: right;
    width: 30%;
}
.new {
  float: right;
  margin-top: 1rem;
}

.inventory-content .rcorners1 {
    margin: 10px;
}
.item-text div {
    line-height: 1.325;
    letter-spacing: .1rem;
    font-size: 3rem;
}

hr.hr-style {
    content: '';
    display: block;
    position: relative;
    border-bottom: .01rem solid var(--c-gray-900);
    z-index: -1;
    margin: 0 1rem 1rem .2rem;
    border-top: 2rem;
    padding: 0rem;
}

.btn {
    background-color: transparent;
    height: 4rem;
    width: 5rem;
    border: 0rem;
    position: relative;
    margin: 0rem;
    //right: 0rem;
    border-top: -1rem;
}

.container {  
    position: relative; 
}

.header-name {
    font-weight: bold;
}
</style>
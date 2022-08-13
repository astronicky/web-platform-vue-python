<template>
    <div class="container">
        <button class="button outline default new" @click="editPolicies()">
            <i class="fas fa-cog"></i>
            Edit Policies
        </button>

        <h1>Governance</h1>
        <div class="load-css spinner c-gray-500" v-if="loading">Loading...</div>
        <div v-else class="container">
            <div class="top">
                <div class="chart-wrapper inline-block">
                    <governance-chart :dates="historicalData.dates" :violations= "historicalData.violations" :orgName="chartOrgName"></governance-chart>
                </div>
                <div class="right-wrapper inline-block">
                    <div class="critical card inline-block right-block">
                        <div class="block-title severity-title">Critical</div>
                        <div class="block-count severity-count">{{ totalViolationsCritical }}</div>
                    </div>
                    <div class="moderate card inline-block right-block">
                        <div class="block-title severity-title">Moderate</div>
                        <div class="block-count severity-count">{{ totalViolationsModerate }}</div>
                    </div>
                    <div class="secondary-info card inline-block right-block">
                        <div class="block-title severity-title">Total Evaluations</div>
                        <div class="block-count severity-count">{{ totalEvaluations }}</div>
                    </div>
                    <div class="info card inline-block right-block">
                        <div class="block-title severity-title">Last Evaluation Date</div>
                        <div class="block-count severity-count">{{ latestEvalDate }}</div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <h5 style="text-align:center;">Policy violations found in root and child organizations</h5>
                <div class="violations-wrapper">
                    <div class="child-orgs">
                        <div class="gray-card card inline-block violation-block" v-for="(organization) in orgTreeViolationsCount" v-bind:key="organization.organization_id">
                            <div class="block-title org-name"> {{ organization.organization_name }}</div>
                            <div class="block-count org-count"> {{ organization.violation_count }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import router from '@/router/router';
import API from '@/API';
import GovernanceChart from './GovernanceChart.vue';
import cascadeodark from '../../../styles/cascadeo-dark.json';

interface HistoricalData {
    dates: any[];
    violations: any[];
}

@Component({
  components: {
    'governance-chart': GovernanceChart,
  },
})
export default class GovernanceDashboard extends Vue {
    /* Variables */
    private violationCountByOrg: any[] = [];
    private historicalData: HistoricalData;
    private chartOrgName: string;
    private loading: boolean = true;
    private totalEvaluations: string;
    private latestEvalDate: string;
    private totalViolationsModerate: string;
    private totalViolationsCritical: string;
    private orgTreeViolationsCount: any[] = [];


    get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
    get currentOrgName(): string { return API.Organization_v2.getCurrentName(); }

    /* Lifecycle */
    private async created(): Promise<void> {
        try {
            this.latestEvalDate = await API.Analyticsv3.getLatestEvaluationDate(this.currentOrg);
            this.chartOrgName = this.currentOrgName;

            [ this.totalEvaluations,
            this.totalViolationsModerate,
            this.totalViolationsCritical,
            this.orgTreeViolationsCount,
            this.historicalData ] = await Promise.all([
                this.getInsightsByMetricName(this.currentOrg, 'org_total_evaluations', this.latestEvalDate),
                this.getInsightsByMetricName(this.currentOrg, 'org_violations_count_moderate', this.latestEvalDate),
                this.getInsightsByMetricName(this.currentOrg, 'org_violations_count_critical', this.latestEvalDate),
                this.getOrgTreeViolationCount(this.currentOrg, this.latestEvalDate),
                this.getHistoricalViolationCount(this.currentOrg),
            ]);

        } catch (error) {
            throw new Error('Cannot show governance data');
        } finally {
            this.loading = false;
        }
    }

    /* Methods */
    private async getHistoricalViolationCount(orgID: string): Promise<any> {
        try {
            const today = new Date();
            const dateEndStr = today.toISOString().split('T')[0];
            // console.log("Date End Str: " + dateEndStr);
            const dateStart = new Date(today.setDate(today.getDate() - 30));
            const dateStartStr = dateStart.toISOString().split('T')[0];
            // console.log("Date Start Str: " + dateStartStr);

            const violationCountArray: any[] = [];
            const dateArray: any[] = [];

            const results = await API.Analyticsv3.getDateRange(orgID, dateStartStr, dateEndStr, 'org_found_violations_count');
            // console.log('getHistoricalViolationCount: Data ' + JSON.stringify(items));

            for await ( const result of results ) {
                // console.log('getHistoricalViolationCount: Item ' + JSON.stringify(item));
                violationCountArray.push(result.metric_value);
                dateArray.push(result.date_evaluated);
            }

            // console.log('getHistoricalViolationCount: Violation Count Array' + violationCountArray);
            // console.log('getHistoricalViolationCount: Date Array' + dateArray);

            const historicalViolationCount = {
                violations: violationCountArray,
                dates: dateArray,
            };

            return historicalViolationCount!;
        } catch (error) {
            throw new Error('Cannot get historical data.');
        }

    }

    private async getInsightsByMetricName(orgID: string, metricName: string, evalDate: string): Promise<any> {
        try {
            // console.log('In GetInsightsByMetricName');
            // console.log('GetInsightsByMetricName: Latest Eval Date ' + evalDate);
            // console.log('GetInsightsByMetricName: Metric Name ' + metricName);
            let totalInt = 0;
            const data = await API.Analyticsv3.getInsights(orgID, metricName, evalDate);

            // console.log('GetInsightsByMetricName: Insights data ' + JSON.stringify(data));
            for await (const item of data) {
                totalInt = totalInt + parseInt(item.metric_value, 10);
            }
            return totalInt;
        } catch (error) {
            throw new Error('Cannot get insights. ' + metricName);
        }
    }

    private async getOrgTreeViolationCount(orgID: string, evalDate: string): Promise<any> {
        try {
            // console.log('In getOrgTreeViolationCount');
            const orgTreeViolations: any[] = [];
            const metricName = 'org_found_violations_count';
            const organizations = await API.Organization_v2.getOrgTree(orgID);
            // console.log('getOrgTreeViolationCount: Organizations ' + organizations );
            for await (const organization of organizations) {
                // console.log('getOrgTreeViolationCount: Organization' + JSON.stringify(organization));
                let violationCount = 0;
                // console.log('getOrgTreeViolationCount: Violation Count Start ' + organization.id!);
                // console.log('getOrgTreeViolationCount: Violation Count Start ' + violationCount);
                // console.log('getOrgTreeViolationCount: Latest Eval Date ' + evalDate);
                violationCount = await this.getInsightsByMetricName(organization.id!, metricName, evalDate);
                // console.log('getOrgTreeViolationCount: Violation Count End ' + violationCount);
                const orgViolation =  {
                    organization_name: organization.name,
                    organization_id: organization.id!,
                    violation_count: violationCount,
                };

                // console.log('getOrgTreeViolationCount: Org Violation' + orgViolation);
                orgTreeViolations.push(orgViolation);
                // console.log('getOrgTreeViolationCount: Org Tree Violation ' + orgTreeViolations);
            }

            return orgTreeViolations;

        } catch (error) {
            throw new Error('Cannot get violation count by organization.');
        }
    }

    private editPolicies(): void {
        router.push('/governance/policies');
    }



}

</script>

<style lang="scss" scoped>

.load-css { 
    margin: 0 auto 4rem auto;
    font-size: 2em;
    text-align: center;
}
.chart-wrapper {
    width: 50%;
    height: 300px;
}
.right-wrapper {
    width: 50%;
    height: 300px;
    text-align: center;
}

.violations-wrapper {
    display: block;
    text-align: center;
}

.card{
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    margin: 1em;
    padding: 1em;
}

.right-block {
    width: 40%;
}
.block-title {
    text-transform: uppercase;
}

.block-count {
    font-size: 2em;
}

.violation-block{
    width: 30%;
}

.gray-card {
    color: #fff;
    background-color: var(--c-gray-600);
    border-color: var(--c-gray-500)
}
.critical{
    color: #fff;
    background-color: var(--c-danger-600);
    border-color: var(--c-danger-600)
}

.moderate {
    color: #fff;
    background-color: var(--c-info-600);
    border-color: var(--c-info-600)
}

.info {
    // background-color: #afdefc;
    // border-color: #afdefc;
    color: #fff;
    background-color: var(--c-primary-700);
    border-color: var(--c-primary-600)
}

.secondary-info {
    color: #fff;
    background-color: var(--c-success-700);
    border-color: var(--c-success-600)
}

.inline-block {
    display: inline-block;
    vertical-align: top;
}

.new {
  float: right;
  margin-top: 1rem;
}

.card-style {
    width: 70rem;
    border: 0;
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


</style>
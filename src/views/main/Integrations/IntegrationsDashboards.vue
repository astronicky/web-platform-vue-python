<template>
  <div>
    <button class="button primary dashboardButton" @click="backToIntegration()">
      Clear Dashboard
    </button>
    <h1>{{ this.dashTitle }}</h1>
    <div class="row">
      <div>
        <label for="dashtype">Select a Dashboard Type</label>
      </div>
      <div v-if="isRootOrg === true && hasChildOrg === true" class="cxs-custom20">
        <select required
          id="dashtype"
          class="selectInt"
          name="dropdown"
          v-validate="'required'"
          v-model="chartSelect"
          @change="onChartSelectChange(), switchReset()"
        >
          <option disabled selected value="">Please select one</option>
          <option value="MonthlyBilling">Monthly Dashboard</option>
          <option value="TransactionTypeBilling">Transaction Type Dashboard</option>
          <option value="Organizational">Organizational Dashboard</option>
          <!-- <option value="MonthToDateBilling">Month to Date chart</option> -->
        </select>
      </div>
      <div v-else class="cxs-custom20">
        <select required
          id="dashtype"
          class="selectInt"
          name="dropdown"
          v-validate="'required'"
          v-model="chartSelect"
          @change="onChartSelectChange()"
        >
          <option disabled selected value="">Please select one</option>
          <option value="MonthlyBilling">Monthly Dashboard</option>
          <option value="TransactionTypeBilling">Transaction Type Dashboard</option>
          <!-- <option value="MonthToDateBilling">Month to Date chart</option> -->
        </select>
      </div>
      <div v-if="this.chartSelect === 'MonthlyBilling'">
        <div class="row">
          <div class="csx">
            <label for="datepick">Select date Period</label>
          </div>
          <div class="csx">
            <date-picker 
              id="datepick" 
              input-class="datetime-picker" 
              type="month" 
              v-model="chartPeriod" 
              format="YYYYMM" 
              placeholder="Select date Period" 
              range
              :disabled-date="(chartPeriod) => chartPeriod >= new Date()">
            </date-picker>
          </div>
          <div class="csx">
            <button class="button primary outline" @click="createdashboard()">
                <i class="fas fa-chart-bar"></i>
              Generate Dashboard
            </button>
          </div>
        </div>
      </div>
      <div v-if="this.chartSelect === 'TransactionTypeBilling'">
        <div class="row">
          <div class="csx">
            <label for="datepick">Select date Period</label>
          </div>
          <div class="csx">
            <date-picker 
              id="datepick" 
              input-class="datetime-picker" 
              type="month" 
              v-model="chartPeriod" 
              format="YYYYMM" 
              placeholder="Select date Period" 
              range
              :disabled-date="(chartPeriod) => chartPeriod >= new Date()">
            </date-picker>
          </div>
          <div class="csx">
            <button class="button primary outline" @click="createdashboard()">
                <i class="fas fa-chart-bar"></i>
              Generate Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.chartSelect === 'Organizational'">
      <div class="row">
        <div>
          <label for="radio-buttons">Select Data Type</label>
        </div>
        <div class="radio-buttons">
          <input 
            type="radio" 
            id="expected"
            class="radio"
            v-model="dataType"
            v-bind:value="'Expected'"
            @change="expectedSwitch()"
          >
          <label for="expected" class="radio">Expected</label>
          <input 
            type="radio"
            id="historical"
            class="radio"
            v-model="dataType"
            v-bind:value="'Historical'"
            @change="historicalSwitch()"
          >
          <label for="historical" class="radio">Historical</label>
        </div>
      </div>
    </div>
    <div class="row" v-if="this.dataType === 'Expected'">
      <div>
        <label for="dashtype">Select Date Period</label>
      </div>
      <div class="date-period">
        <select required
          id="dashtype"
          class="selectInt"
          name="dropdown"
          v-validate="'required'"
          v-model="dataSelect"
        >
          <option disabled value="" hidden>Choose an option</option>
          <option value="MonthlyBilling">Monthly</option>
          <option value="AnnualBilling">Yearly</option>
        </select>
      </div>
    </div>
    <div class="row" v-if="this.dataType === 'Historical'">
      <div>
        <label for="dashtype">Select Date Period</label>
      </div>
      <div class="date-period">
        <date-picker 
          id="datepick" 
          input-class="datetime-picker" 
          type="month" 
          v-model="chartPeriod" 
          format="YYYYMM" 
          placeholder="Select Date Period"
          :disabled-date="(chartPeriod) => chartPeriod >= new Date()"
          range>
        </date-picker>
      </div>
    </div>
    <div class="row" v-if="this.dataSelect !== '' || this.dataType === 'Historical'">
      <div class="generate-dashboard2">
        <button class="button primary outline" @click="createdashboard()">
            <i class="fas fa-chart-bar"></i>
          Generate Dashboard
        </button>
      </div>
    </div>
    <div v-if="this.chartSelect === 'TransactionTypeBilling'">
      <hr />
      <div id="BillingChart">
          <div v-if="this.chartObject && Object.keys(this.chartObject).length > 0">
            <TransactionDashboard :cdata="this.chartObject" :initOptions="this.initOptions" autoresize :key="this.keycount" msg="Welcome to Monthly Overview Dashboard"/> 
          </div>
          <div v-else>
            <empty icon="fas fa-chart-bar">
              <div slot="description">
                <p>
                  Select the billing/usage period you want to view.
                </p>
              </div>
            </empty>
          </div>
      </div>
    </div>
    <div v-if="this.chartSelect === 'MonthlyBilling'">
      <hr />
      <div id="BillingChart">
          <div v-if="this.chartObject && Object.keys(this.chartObject).length > 0">
            <MonthlyDashboard :cdata="this.chartObject" :ctypes="this.categoryTypes" :initOptions="this.initOptions" autoresize :key="this.keycount" msg="Welcome to Transaction Type Dashboard"/> 
          </div>
          <div v-else>
            <empty icon="fas fa-chart-bar">
              <div slot="description">
                <p>
                  Select the billing/usage period you want to view.
                </p>
              </div>
            </empty>
          </div>
      </div>
    </div>
    <div v-if="this.dataSelect === 'MonthlyBilling' || this.dataSelect  === 'AnnualBilling'">
      <hr />
      <div id="OrgBillingPieChart">
          <div v-if="this.chartObject && Object.keys(this.chartObject).length > 0">
            <OrgEstimateDashboard :cdata="this.chartObject" :dashtype="this.dashType" :title="this.title" :subtext="this.subText" :initOptions="this.initOptions" autoresize :key="this.keycount" msg="Welcome to Estimated Budget Dashboard"/> 
          </div>
          <div v-else>
            <empty icon="fas fa-chart-bar">
              <div slot="description">
                <p>
                  Select the billing/usage period you want to view.
                </p>
              </div>
            </empty>
          </div>
      </div>
    </div>
    <div v-if="this.dataType === 'Historical'">
      <hr />
      <div id="OrgBillingBarChart">
          <div v-if="this.chartObject && Object.keys(this.chartObject).length > 0">
            <OrgHistoricallDashboard :cdata="this.chartObject" :dashtype="this.dashType" :initOptions="this.initOptions" autoresize :key="this.keycount" msg="Welcome to the Historical Budget Dashboard"/> 
          </div>
          <div v-else>
            <empty icon="fas fa-chart-bar">
              <div slot="description">
                <p>
                  Select the billing/usage period you want to view.
                </p>
              </div>
            </empty>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

import API from '@/API';
import router from '@/router/router';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import MonthlyDashboard from '@/components/globe-billing/MonthlyDashboard.vue';
import TransactionDashboard from '@/components/globe-billing/TransactionDashboard.vue';
import OrgEstimateDashboard from '@/components/globe-billing/OrgEstimateDashboard.vue';
import OrgHistoricallDashboard from '@/components/globe-billing/OrgHistoricalDashboard.vue';
import moment from 'moment';

@Component({
  components: {
    MonthlyDashboard,
    OrgEstimateDashboard,
    OrgHistoricallDashboard,
    TransactionDashboard,
    DatePicker,
  },
})

export default class BillingChart extends Vue {

  /* Variables */
  @Prop()
  private id: string;

  private chartSelect: string = '';
  private dataType: string = '';
  private dashType: string = '';
  private dataSelect: string = '';

  private isRootOrg: boolean;
  private hasChildOrg: boolean;
  private orgName: string = '';

  private title: string = '';
  private subText: string = '';
  private monthlyForecast: string = '';
  private annualForecast: string = '';
  private currency: string = '';
  private monthlyForecastTotal: string = '';
  private annualForecastTotal: string = '';
  private monthFunction: string[] = new Array();

  private keycount: number = 0;
  private dashTitle: string = 'Dashboard';

  private chartId: string = '';
  private chartPeriod: Date[] = new Array();
  private chartObject: object = new Object();
  private categoryTypes: object = new Object();
  private cascadeoOrgId: string = '520a4dc6-4831-11ec-81d3-0242ac130003';

  private organizationId: string = API.Organization_v2.getCurrentId();
  private organizations: Organization[];
  private organization: Organization | undefined = { name: '', description: '', };

  private integration: Integration<GlobeBilling> = API.Integration.globeBilling.blank();

  private initOptions: object = new Object();

  private created(): void {
    const orgData = API.Organization_v2.getActive();
    this.orgName = orgData.name;
    this.isRootOrg = orgData.parent_id === '00000000-0000-0000-0000-000000000000' ? true : false;
    this.getChildOrgs();
  }

  @Watch('integrations')
  private onChartSelectChange(): void {
    this.init();
  }

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  get name(): string {
    if (this.integration.metadata.friendly_name === '') {
      return this.integration.id;
    }
    return this.integration.metadata.friendly_name;
  }

  private async init(): Promise<void> {
    try {
      this.integration = await API.Integration.globeBilling.getOne(this.id);
      this.organizationId = API.Organization_v2.getCurrentId();
    } catch {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting integration.',
      });
    }

    if (this.chartSelect !== '') {

      // this.chartSelect = this.chartSelect;
      if (this.chartSelect === 'MonthlyBilling') {
        if ( this.chartPeriod.length === 0) {
          const cd = new Date();
          const psm = new Date();
          psm.setMonth(psm.getMonth() - 6);
          this.chartPeriod = [psm, cd];
          this.createdashboard();
        }
        this.dashTitle = 'Billing Overview Dashboard';
      } else if (this.chartSelect === 'TransactionTypeBilling') {
        this.dashTitle = 'Transaction Type Dashboard';
      }

    }
  }

  private async createdashboard(): Promise<void> {

    function pad(num: number) {
      if (num < 10) {
        return '0' + num;
      }
      return num;
    }

    try {
      if (this.chartSelect === 'MonthlyBilling' || this.chartSelect === 'TransactionTypeBilling') {
        this.chartId = await API.GlobeBilling.dashboard.createDashboardPeriod(
          this.id,
          this.chartPeriod[0].getFullYear() + '-' + pad(this.chartPeriod[0].getMonth() + 1) + '-' + '01',
          this.chartPeriod[1].getFullYear() + '-' + pad(this.chartPeriod[1].getMonth() + 1) + '-' + '01'
        );
      }

      this.monthFunction = this.monthDifferenceFunction();

      if (this.dataSelect === 'MonthlyBilling') {
        this.dashType = 'monthly';
        this.chartId = await API.GlobeBilling.dashboard.getOrgMonthEstimate(this.organizationId);
        this.dashTitle = 'Estimated Monthly Budget Dashboard';
        this.title = 'Budget Distribution for ' + this.orgName;
      } else if (this.dataSelect === 'AnnualBilling') {
        this.dashType = 'annual';
        this.chartId = await API.GlobeBilling.dashboard.getOrgAnnualEstimate(this.organizationId);
        this.dashTitle = 'Estimated Annual Budget Dashboard';
        this.title = 'Budget Distribution for ' + this.orgName;
      } else if (this.dataType === 'Historical') {
        if (this.chartPeriod.length === 0) {
          const cd = new Date();
          const psm = new Date();
          psm.setMonth(psm.getMonth() - 6);
          this.chartPeriod = [psm, cd];
        }

        this.dashTitle = 'Historical Budget Dashboard';
        this.dashType = 'Total';
        this.chartId = await API.GlobeBilling.dashboard.getOrgHistorical(
            this.organizationId,
            this.chartPeriod[0].getFullYear() + '-' + pad(this.chartPeriod[0].getMonth() + 1) + '-' + '01',
            this.chartPeriod[1].getFullYear() + '-' + pad(this.chartPeriod[1].getMonth() + 1) + '-' + '01'
        );
      }

      if (this.chartId === '') {
        throw new Error('No dashboard request UUID returned.');
      }

      if (this.chartSelect === '' && this.dataType === 'Historical') {
        throw new Error('"Select date Period" should not be empty');
      }

    } catch (error) {
        if (error.name === 'TypeError') {
          API.UI.addNotification({
            type: 'danger',
            text: '"Select date Period" must contain selected dates.',
          });
        } else {
          API.UI.addNotification({
            type: 'danger',
            text: 'Unable to create dashboard request. Try again later.',
          });
        }
        throw error;
    }

    /* put the chart get result here: .result */
    try {
      // this.chartObject = Object.assign( {}, this.chartObject, await API.GlobeBilling.dashboard.getDashboardResult(
      //   this.chartId,
      //   10,
      //   2000
      // ));
      this.chartObject = await API.GlobeBilling.dashboard.getDashboardResult(
        this.chartId,
        10,
        2000
      );
      this.categoryTypes = await API.GlobeBilling.dashboard.getCategoryTransactionTypes(this.cascadeoOrgId, this.formatProviderType(this.integration.metadata.provider_type));

      if (this.dataSelect === 'MonthlyBilling' || this.dataSelect === 'AnnualBilling') {
        // Retrieve currency and total monthly/annual forecast
        this.currency = await this.chartObject[0].data[0].currency[0];
        this.monthlyForecastTotal = await this.chartObject[0].data[0].monthly.reduce((a: any, b: any) => a + b, 0);
        this.annualForecastTotal = await this.chartObject[0].data[0].annual.reduce((a: any, b: any) => a + b, 0);

        // Format forecast total
        function monthlyForecastFormat(monthlyForecastTotal: any, currency: any): any {
          const monthlyFormat = monthlyForecastTotal.toLocaleString('en-US', { style: 'currency', currency });
          return monthlyFormat;
        }

        function annualForecastFormat(annualForecastTotal: any, currency: any): any {
          const annualFormat = annualForecastTotal.toLocaleString('en-US', { style: 'currency', currency });
          return annualFormat;
        }

        // Call function
        this.monthlyForecast = monthlyForecastFormat(this.monthlyForecastTotal, this.currency);
        this.annualForecast = annualForecastFormat(this.annualForecastTotal, this.currency);

        // Display
        if (this.dataSelect === 'MonthlyBilling') {
          this.subText = 'Monthly Forecast Total: ' + this.monthlyForecast;
        } else if (this.dataSelect === 'AnnualBilling') {
          this.subText = 'Annual Forecast Total: ' + this.annualForecast;
        }
      }

      if (this.chartObject[0].id === 'TotalServicePerMonth') {
        this.chartObject[1].data[0].Total = this.sortFunction(this.monthFunction);
        this.chartObject[1].data[0].xaxis = this.monthFunction;
      } else {
        this.chartObject[0].data[0].Total = this.sortFunction(this.monthFunction);
        this.chartObject[0].data[0].xaxis = this.monthFunction;
      }

    } catch (error) {
      //
    }

    this.initOptions = {
      renderer: 'canvas',
    };

    this.keycount = this.keycount + 1;
    // tslint:disable-next-line:no-console
    // console.log(this.chartObject);

  }

  private backToIntegration(): void {
    this.chartSelect = '';
    this.dataType = '';
    this.dataSelect = '';
    this.chartPeriod = new Array();
    this.chartObject = new Object();
  }

  private expectedSwitch(): void {
    this.dataType = 'Expected';
    this.dataSelect = '';
  }

  private historicalSwitch(): void {
    this.dataType = 'Historical';
    this.dataSelect = '';
  }

  private switchReset(): void {
    this.dataType = '';
    this.dataSelect = '';
  }

  private formatProviderType(type: string) {
    let returnType = '';
    if (type === 'Microsoft Azure') {
      returnType = 'AZURE';
    } else if (type === 'Amazon Web Services') {
      returnType = 'AWS';
    }  else if (type === 'Google Cloud Platform') {
      returnType = 'GCP';
    }
    return returnType;
  }

  private monthDifferenceFunction() {
    const startDate = this.chartPeriod[0]?.toLocaleDateString('en-CA');
    const endDate = this.chartPeriod[1]?.toLocaleDateString('en-CA');

    const start = moment(startDate);
    const end = moment(endDate);

    const dates: string[] = [];

    if (end.isBefore(start)) {
      Error('End date must be greated than start date.');
    }

    while (start.isBefore(end)) {
      dates.push(start.format('MMM YYYY'));
      start.add(1, 'month');
    }

    dates.push(start.format('MMM YYYY'));

    return dates;
  }

  // Loop to check if the date in the array has any total.
  // Fills it in with '0' if data is not found.
  private sortFunction(sortedDate: any) {
    const formattedData: any[] = [];
    const finalData: any[] = [];

    if (this.chartObject[0].data[0].Total) {
      for (const data of this.chartObject[0].data[0].xaxis) {
        formattedData.push({
          date: data,
          total: 0,
        });
      }
      for (let i = 0; i < formattedData.length; i++) {
        formattedData[i].total = this.chartObject[0].data[0].Total[i];
      }
    }

    if (this.chartObject[1].data[0].Total) {
      for (const data of this.chartObject[1].data[0].xaxis) {
        formattedData.push({
          date: data,
          total: 0,
        });
      }
      for (let i = 0; i < formattedData.length; i++) {
        formattedData[i].total = this.chartObject[1].data[0].Total[i];
      }
    }

    for (const dates of sortedDate) {
      const existingDate = formattedData.filter((fd) => fd.date === dates);
      if (existingDate.length > 0) {
        finalData.push(existingDate[0].total);
      } else {
        finalData.push(0);
      }
    }

    return finalData;
  }

  private async getChildOrgs() {
    this.organizations = API.Organization_v2.getAll();
    const orgNodeTree = API.Organization_v2.getNodeTree(this.organizations, this.organizationId);

    if (orgNodeTree) {
      this.organization = JSON.parse(JSON.stringify(orgNodeTree));
    }

    if (this.organization!.children !== undefined) {
      this.hasChildOrg = true;
    } else {
      this.hasChildOrg = false;
    }
  }

}

</script>

<style lang="scss" scoped>
  .selectInt {
    height: 37px;
    font-size: 15px;
    // width: 95%;
    width: 280px;
  }
  .cxs-custom20 {
    // -ms-flex-preferred-size: 18%;
    // flex-basis: 18%;
    width: 290px;
  }
  .dashboardButton {
    float: right;
    margin-left: 1rem;
  }
  .button {
    float: right;
    margin-left: 1rem;
  }
  .datetime-picker {
    height: 50px;
  }
  input[type=radio], .radio {
    display: inline;
    margin-top: .8em;
    position: relative;
    font-weight: 500;
    }
  .radio-buttons, .date-period {
    margin-left: 2.7em;
  }
  .generate-dashboard2 {
    margin-left: 11.6em;    
  }

  @media (prefers-color-scheme: dark) {
    /deep/ .mx-icon-calendar {
      color: rgba(255, 255, 255, 0.5) !important;
    }
    /deep/ .mx-icon-clear {
      color: rgba(255, 255, 255, 0.5) !important;
    }
    /deep/ .mx-icon-clear:hover {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    select:invalid,
    select option:disabled,
    ::placeholder {
      color: #808080;
    }
    select option {
      color: white;
    }
  }

  @media (prefers-color-scheme: light) {
    select:required:invalid,
    select option:disabled,
    ::placeholder {
      color: #808080;
    }
    select option {
      color: black;
    }
  }

</style>

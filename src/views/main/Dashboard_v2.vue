<template>
  <div>
    <button class="button primary dashboardButton" @click="backToIntegration()"> 
      New Dashboard
    </button>
    <h1>{{ this.dashTitle }}</h1>
    <div class="row">
      <div>
        <label for="dashtype">Select a Dashboard Type</label>
      </div>
      <div class="cxs-custom20">
        <select
          id="dashtype"
          class="selectInt"
          name="dropdown"
          v-validate="'required'"
          v-model="integrationSelected"
          @change="onChartSelectChange()"
        >
          <option disabled selected value="">Please select one</option>
          <option
            v-for="integration in sortedIntegrations"
            :key="integration.id"
            :value="integration.id"
          >
            {{
              integration.metadata.friendly_name ||
                integration.metadata.project_name
            }}
          </option>
        </select>
      </div>
      <div class="row">
        <div class="csx">
          <label for="datepick">Select date Period (in UTC)</label>
        </div>
        <div class="csx">
          <date-picker 
            id="datepick"  
            input-class="datetime-picker" 
            type="datetime" 
            v-model="chartPeriod" 
            format="YYYY-MM-DD HH:mm" 
            placeholder="Select time Period" 
            :disabled-date="disableDates"
            :disabled-time="disableDates"
            range></date-picker>
        </div>
        <div class="csx">
          <button class="button primary outline" @click="createdashboard()">
              <i class="fas fa-chart-bar"></i>
            Generate Dashboard
          </button>
        </div>
      </div>
    </div>
    <hr />
    <div id="DefaultChart">
        <div v-if="this.chartObject && Object.keys(this.chartObject).length > 0">
          <DefaultIntegrationDashboard :cdata="this.chartObject" :nozero="this.noZeroCharts" :initOptions="this.initOptions" autoresize :key="this.keycount" msg="Welcome to Default Dashboard"/> 
        </div>
        <div v-else>
          <empty icon="fas fa-chart-bar">
            <div slot="description">
              <p>
                Select the chart period you want to view.
              </p>
            </div>
          </empty>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

import API from '@/API';
import router from '@/router/router';
import DatePicker from 'vue2-datepicker';
import moment from 'moment';
import 'vue2-datepicker/index.css';

import DefaultIntegrationDashboard from '@/components/dashboard/Default.vue';

@Component({
  components: {
    DefaultIntegrationDashboard,
    DatePicker,
  },
})

export default class DefaultChart extends Vue {

  /* Variables */
  @Prop()
  private id: string;

  private loadingMessage: string;
  private integrationSelected: string = '';
  private integrations: Array<Integration<All>> = [];
  private sortedIntegrations: Array<Integration<All>> = [];
  private sortedAnomalyIntegrations: Array<Integration<All>> = [];

  private keycount: number = 0;
  private dashTitle: string = 'Dashboard';

  private chartId: string = '';
  private chartPeriod: Date[] = new Array();
  private chartObject: object = new Object();

  private initOptions: object = new Object();

  private noZeroCharts: string[] = ['Lambda Throttled Invocations', 'Lambda Failed Invocations' ];
  private nostartgap: boolean = true;  // false show actual period start with no date; true graph start actual first data point

    /* this limits the time ranage selection;
    remove or modify this once historical data with longer period are available */
  public disableDates(date): boolean {
    const dToday = new Date();
    const offSetInMs = ((dToday.getTimezoneOffset() * 60) * 1000);
    return date < new Date(dToday.getTime() + offSetInMs - (7 * 24 * 3600 * 1000)) || date > new Date(dToday.getTime() + offSetInMs);
  }

    /* Lifecycle */
  private created(): void {
    this.getIntegrations();
    this.loadingMessage = 'Dashboard is Loading...';
  }

    /* Methods */
  @Watch('organization')
  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
    });
  }

  @Watch('integrations')
  private onChartSelectChange(): void {
    this.init();
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
        x.definition_id !== 'windows' &&
        x.definition_id !== 'sqlserver'
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

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  private async init(): Promise<void> {

    if (this.integrationSelected !== '') {

      // get past 1 day by default
      // if ( this.chartPeriod.length === 0) {
      //   const cd = new Date();
      //   const psm = new Date();
      //   psm.setDate(psm.getDate() - 1);
      //   this.chartPeriod = [psm, cd];
      //   this.createdashboard();
      // }

      const cd = new Date();
      const psm = new Date();
      psm.setDate(psm.getDate() - 1);

      // so displayed time in date picker is in UTC
      const offSetInMs = ((cd.getTimezoneOffset() * 60) * 1000);
      this.chartPeriod = [new Date(psm.getTime() + offSetInMs), new Date(cd.getTime() + offSetInMs)];
      this.createdashboard();

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

      if (this.integrationSelected === '') {
        throw new Error('No integration selected. Please select an integration');
      }

      if ((this.chartPeriod[0] === null) || (this.chartPeriod[1] === null)) {
        throw new Error('Please select a Start time and End time');
      }

      this.chartId = await API.Dashboardv2.dashboard.createDashboardPeriod(
          this.integrationSelected,
          // moment(this.chartPeriod[0]).utc().format('YYYY-MM-DD HH:mm'),
          // moment(this.chartPeriod[1]).utc().format('YYYY-MM-DD HH:mm')
          moment(this.chartPeriod[0]).format('YYYY-MM-DD HH:mm'),
          moment(this.chartPeriod[1]).format('YYYY-MM-DD HH:mm'),
          this.nostartgap
      );

      if (this.chartId === '') {
        throw new Error('No dashboard request UUID returned.');
      }

    } catch (error) {
        let errmessage;
        if (error instanceof TypeError) {
          errmessage = '"Select date Period" must contain selected dates';
        } else if (error instanceof Error) {
          errmessage = error.message;
        } else {
          errmessage = String(error);
        }

        API.UI.addNotification({
          type: 'danger',
          text: errmessage,
        });

        throw error;
    }

    /* put the chart get result here: .result */
    try {

      this.chartObject = await API.Dashboardv2.dashboard.getDashboardResult(
        this.integrationSelected,
        this.chartId,
        10,
        2000
      );


    } catch (error) {
        // API.UI.addNotification({
        //     type: 'danger',
        //     text: 'Unable to get dataset for dashboard. Try again later.',
        // });
        throw error;
    }

    this.initOptions = {
      renderer: 'canvas',
      width: 'auto',
      height: 'auto',
    };

    this.keycount = this.keycount + 1;

    // tslint:disable-next-line:no-console
    // console.log(this.chartObject);

  }

  private backToIntegration(): void {
    this.integrationSelected = '';
    this.chartPeriod = new Array();
    this.chartObject = new Object();
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
  }
</style>

<template>
    <div class="card-body">
    <div class="card-header">
        Globe Billing Integration - {{ this.integrationName }}
    </div>
    <ul class="list-group">
        <li class="list-group-item1">
            <span class="billing-amount">P{{ this.precedingBill }}</span></br>
            <span class="billing-header">BILLING FOR {{`${currentMonth} ${currentYear}`}}</span>
        </li>
        <hr class="hr-line"/>
        <li class="list-group-item2">
            <span class="billing-amount">P{{ this.currentBill }}</span></br>
            <span class="billing-header">OUTSTANDING USAGE FOR CURRENT MONTH</span>
        </li>
    </ul>
    </div>
</template>

<script lang="ts">
/* tslint:disable:no-console */

import { Vue, Prop, Component } from 'vue-property-decorator';
import API from '@/API';
import moment from 'moment';

@Component
export default class SummaryDashboard extends Vue {

  @Prop()
  private id: string;

  @Prop()
  private integrationName: string;

  private chartId: string = '';
  private chartObject: object = new Object();
  private precedingBill: string = '0.00';
  private currentBill: string = '0.00';
  private currentYear: string = '1900';
  private currentMonth: string = 'JANUARY';

  private created(): void {
    this.init();
  }
  private async init(): Promise<void> {
    const currentDate = new Date();
    const startDate = moment(currentDate).format('YYYY-01-01');
    const endDate = moment(currentDate).format('YYYY-MM-01');
    this.chartId = await API.GlobeBilling.dashboard.createDashboardPeriod(this.id, startDate, endDate);
    this.chartObject = await API.GlobeBilling.dashboard.getDashboardResult(this.chartId, 10, 2000);
    if (this.chartObject[0].id === 'TotalPerMonth') {
        this.precedingBill = this.isNull(this.chartObject[0].data[0].Total[0], '0.00');
        this.currentBill = this.isNull(this.chartObject[0].data[0].Total[1], '0.00');
    } else {
        this.precedingBill = this.isNull(this.chartObject[1].data[0].Total[0], '0.00');
        this.currentBill = this.isNull(this.chartObject[1].data[0].Total[1], '0.00');
    }
    this.currentMonth = moment(currentDate).format('MMMM').toUpperCase();
    this.currentYear = moment(currentDate).format('YYYY');
  }

  private isNull(value: any, returnVal: string) {
    const formatter = new Intl.NumberFormat('en-US');
    return value ? formatter.format(value) : returnVal;
  }
}

</script>

<style lang="scss" scoped>
.card-body {
    background-color: white;
    margin-top: 10px;
    border-radius: 10px !important;
    width: 100%;
    padding: 20px;
}

.list-group {
    text-align: center;
}
.hr-line {
    height: 0;
    border: none;
    margin: 1rem 0;
    border-top: 1px solid var(--c-gray-100);
}
.billing-amount {
    font-size: 40px;
}
.billing-header {
    font-size: 12px;
}
.card-header {
    font-size: 15px;
    font-weight: bold;
}
</style>

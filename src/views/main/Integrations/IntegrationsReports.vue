<template>
  <div>
    <h1>Reports - {{name}}</h1>
    
    <div class="row end-xs">
      <div class="csx">
        <label for="cars">Select date</label>
      </div>
      <div class="csx">
        <date-picker
          input-class="datetime-picker"
          type="month" 
          v-model="reportDate" 
          format="MMMM YYYY"  
          placeholder="Select date" 
          :disabled-date="(reportDate) => reportDate >= new Date()"
          @change="defSwitch()">
        </date-picker>
      </div>
      <div class="csx">
        <button class="button primary outline" type="submit" @click="download(), repSwitch()">
            <i class="fas fa-cloud-download"></i>
          View Report
        </button>
      </div>
      <div class="csx" v-if="isReferenceFileSupported()">
        <button class="button primary outline" @click="showReferenceFileList(), refSwitch(), getFileName()">
            <i class="fas fa-cloud-download"></i>
          View Reference File(s)
        </button>
      </div>
      <div class="csx">
        <a class="button primary outline" :href="this.CSVReport" :disabled="this.CSVReport === ''">
            <i class="fas fa-cloud-download"></i>
          Download CSV
        </a>
      </div>            
    </div><br/>

    <div style="display:none;" id="reportDisplay">
      <div class="row" v-if="this.PDFreport !== ''">
        <iframe id="iframepdf" :src="this.PDFreport" width="100%" height="1024"></iframe>
      </div>
      <div class="row2" v-if="this.PDFreport === '' || this.PDFreport === undefined">
        No PDF report uploaded for the month of {{this.monthName + ', ' + this.reportDate.getFullYear()}}. <br> Please select another date and click the 
        "View Report" button again. <br> <br> For any inquiries, please contact <a href="mailto:csbmsupport@globe.com.ph">csbmsupport@globe.com.ph</a>.
      </div>
    </div>

    <div style="display:none;" id="displayList">
      <div class="row2" v-if="this.refList !== '' && this.refList !== undefined && this.monthName === this.refFileListMonth">
        The following are your reference files for {{this.monthName + ' ' + this.reportDate.getFullYear()}}. 
        <ul v-for="(files) in refFileList" :key="files">
          <li>
            <a v-bind:href="files">{{ getFileName(files) }}</a>
          </li>
        </ul>
        To download other dates' reference files, change the date, <br> and then click the "View Reference File" button again.
        <br> <br> For any inquiries, please contact <a href="mailto:csbmsupport@globe.com.ph">csbmsupport@globe.com.ph</a>.
      </div>
      <div class="row2" v-if="this.refList === undefined">
        No reference files uploaded for the month of {{this.monthName + ' ' + this.reportDate.getFullYear()}}. <br> Please select another date and click the 
        "View Reference File(s)" button again. <br> <br> For any inquiries, please contact <a href="mailto:csbmsupport@globe.com.ph">csbmsupport@globe.com.ph</a>.
      </div>
    </div>

    <div id="defaultDisplay">
      <empty icon="fas fa-newspaper">
        <div slot="description">
          <p>
            Select the date of the report or reference file(s) that you want to 
            view using the date selector on the top right corner of the screen.
          </p>
        </div>
      </empty>
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

@Component({
  components: {
    DatePicker,
  },
})

export default class IntegrationsReports extends Vue {
  /* tslint:disable:no-console */

  /* Variables */
  @Prop()
  private id: string;

  private PDFreport: string = '';

  private CSVReport: string = '';

  private ReferenceFile: string = '';

  private reportDate: Date = new Date();

  private refList: string = '';
  private refFileListMonth: number;
  private refFileListYear: number;

  // Accept GlobeBilling integration for now. Will be refactored to accept generic type later.
  private integration: Integration<GlobeBilling> = API.Integration.globeBilling.blank();

  /* Lifecycle */
  private created(): void {
    this.init();
  }

  /* Methods */
  // TODO: Likely remove org call in new thresholds
  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  get name(): string {
    if (this.integration.metadata.friendly_name === '') {
      return this.integration.id;
    }
    return this.integration.metadata.friendly_name;
  }

  get monthName() {
    const months =
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months[this.reportDate.getMonth()];
  }

  get refFileList(): string {
    return this.refList;
  }

  private async init(): Promise<void> {
    this.refList = '';

    try {
      this.integration = await API.Integration.globeBilling.getOne(this.id);
    } catch {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting integration.',
      });
    }
  }

  private async download(): Promise<void> {
    [this.PDFreport, this.CSVReport] = await API.Reports.getReports(
      this.id,
      this.reportDate.getFullYear(),
      this.reportDate.getMonth() + 1
    );
    document.getElementById('displayList')!.style.display = 'block';
    document.getElementById('reportDisplay')!.style.display = 'block';
    document.getElementById('defaultDisplay')!.style.visibility = 'hidden';
  }

  private repSwitch() {
    const refDownLink = document.getElementById('displayList')!;
    const repDisplay = document.getElementById('reportDisplay')!;

    if (refDownLink.style.display === 'block' || refDownLink.style.display === '') {
      refDownLink.style.visibility = 'hidden';
      repDisplay.style.display = 'block';
    } else {
      document.getElementById('defaultDisplay')!.style.display = 'block';
    }
  }

  private refSwitch() {
    const refDownLink = document.getElementById('displayList')!;
    const repDisplay = document.getElementById('reportDisplay')!;
    const defDisplay = document.getElementById('defaultDisplay')!;

    if (repDisplay.style.display === 'block' || repDisplay.style.display === '') {
      repDisplay.style.display = 'none';
      refDownLink.style.visibility = 'visible';
      defDisplay.style.visibility = 'visible';
    } else {
      document.getElementById('defaultDisplay')!.style.display = 'block';
    }
  }

  private defSwitch() {
    const refDownLink = document.getElementById('displayList')!;
    const repDisplay = document.getElementById('reportDisplay')!;
    const defDisplay = document.getElementById('defaultDisplay')!;

    refDownLink.style.display = 'none';
    repDisplay.style.display = 'none';
    defDisplay.style.visibility = 'visible';
  }

  private isReferenceFileSupported(): boolean {
    // TODO: remove hardcoded orgs; need to determine which root org needed via API/IAM.ts
    const orgID = this.currentOrg;
    if (
      orgID === 'regression-tp' ||
      orgID === 'a81893a0-f820-4b5e-aed4-d568c9887a26' || // aboitizgroupcompany
      orgID === 'mpa-bills2021' ||
      orgID === '3e00137f-e8e5-47c4-8aef-4c82d3a6780d' ||
      orgID === 'smoke-test' ||
      orgID === '0127a29a-ad52-4071-8e48-8c9ea2b742c1') {
      return true;
    }

    return false;
  }

  private async showReferenceFileList(): Promise<void> {
    const [list] = await API.Reports.getReferenceFileList(
      this.id,
      this.reportDate.getFullYear(),
      this.reportDate.getMonth() + 1
    );

    this.refList = list.reports;
    this.refFileListMonth = list.month;
    this.CSVReport = '';

    document.getElementById('displayList')!.style.display = 'block';
    document.getElementById('defaultDisplay')!.style.visibility = 'hidden';
  }

  private getFileName(files: string): string {
    // Returns the file name(s) from the S3 Presigned URL
    const s3_url = files.replace(/^.*\/([^/]+?)\?.*$/, '$1');
    const filename = decodeURI(s3_url);

    return filename;
  }

}
</script>

<style lang="scss" scoped>
  .iframe {
    width: 100%;
    height: 90vh;
  }
  .selectInt {
    height: 5vh;
  }
  .button {
    float: right;
    margin-left: 1rem;
  }
  .datetime-picker {
    height: 50px;
  }

  .row2 {
    margin-top: 10px;
    text-align: center;
  }

  .env-select {
    margin-bottom: 1rem;

    label {
      display: flex;
      align-items: center;
      padding: 1rem .5rem;
    }

    .image {
      width: 5rem;
      display: inline-block;
      margin: 0 1.5rem 0 .5rem;
    }
  }

</style>

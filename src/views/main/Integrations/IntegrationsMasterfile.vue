<template>
  <div>
    <h1>
      {{ iProviderType }} Globe Billing Masterfile
      <span v-if="iProviderType != ''">
      - {{ iFriendlyName }}
      </span>
    </h1>
    
    <br>

    <div class="row">
      <div class="cxs12" v-if="this.untaggedMonth !== this.taggedMonth">
        <p>
          The <span class="tag primary highlight">{{ this.untaggedMonth + ' ' + this.untaggedYear }}</span>
          Untagged Master File of the <span class="tag primary highlight">{{ iFriendlyName }}</span> 
          Globe Billing Integration is now ready to be downloaded!
        </p>
      </div>
      <div class="cxs12" v-else-if="this.taggedMonth">
        <p>
          The <span class="tag primary highlight">{{ this.taggedMonth + ' ' + this.taggedYear }}</span> 
          Tagged Master File of <span class="tag primary highlight">{{ iFriendlyName }}</span> has already 
          been uploaded. <br> <br> For any concerns, please coordinate with your accounts manager.
        </p>
        <br>
        <p>
          If you are seeing this notification, you have succesfully uploaded a Tagged Master file for the <br>
          month above. Please wait for the next email regarding the availability of your Untagged Master File.
        </p>
      </div>
      <div class="cxs12" id="unavailable" v-else-if="this.untaggedMasterFile === undefined" style="visibility: hidden">
        <p>
          The <span class="tag primary highlight">{{ iFriendlyName }}</span> Untagged Master File is currently 
          unavailable for download. <br> <br> For any concerns, please coordinate with your accounts manager.
        </p>
        <br>
        <p>
          Either there is no file in the S3 bucket currently, or the download link has already expired <br>
          (happens exactly 7 days after the untagged Master File becomes available for download).
        </p>
      </div>
    </div>

    <div class="row">
      <div class="cxs12" v-if="this.untaggedMonth !== this.taggedMonth">
        <a :href="this.untaggedMasterFile">
          <button class="button primary outline medium upload" v-on:href="this.untaggedMasterFile">
            <label>
              <i class="fas fa-cloud-download"></i>
              Download Untagged Master File
            </label>
          </button>
        </a>
      </div>
      <div class="cxs12" v-else-if="this.taggedMonth || this.untaggedMasterFile === Error">
      </div>
    </div>

    <div class="row">
      <div class="cxs12" v-if="this.untaggedMonth !== this.taggedMonth">
        <p>
          As soon as you're ready, please attach your tagged Master file for
          <span class="tag primary highlight">{{ this.untaggedMonth + ' ' + this.untaggedYear }}</span>
          below, <br> and click the upload button to send it to the datalake.
        </p>
      </div>
      <div class="cxs12" v-else-if="this.taggedMonth || this.untaggedMasterFile === Error">
      </div>
    </div>

    <div class="row">
      <div class="cxs12" v-if="this.untaggedMonth !== this.taggedMonth">
        <button 
          class="button primary outline medium upload" for="fileName">
          <label for="fileName">
            <i class="fas fa-cloud-upload"></i> 
            Attach Tagged Master File
          </label>
          <input 
          type="file"
          name="masterFile"
          id="fileName"
          style="display:none;"
          accept=".xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" 
          @change="validateFileType(); hashContentMD5(); fileName(); getPresignedURL()"
          @click="resetFileInput()"/>
        </button>
      </div>
      <div class="cxs12" v-else-if="this.taggedMonth || this.untaggedMasterFile === Error">
      </div>
    </div>
    
    <div class="row">
      <div class="cxs12" v-if="this.untaggedMonth !== this.taggedMonth">
        <button
          class="button primary outline medium upload"
          @click="upload()">
          <label>
            <i class="fas fa-cloud-upload"></i>
            Upload
          </label>
        </button>
      </div>
      <div class="cxs12" v-else-if="this.taggedMonth || this.untaggedMasterFile === Error">
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import API from '@/API';
import http from '@/common/http';
import router from '@/router/router';
import Auth from '@/common/auth';

@Component({
  components: {
    DatePicker,
  },
})

export default class IntegrationsMasterfile extends Vue {
  /* tslint:disable:no-console */

  /* Variables */
  @Prop()
  private id: string;

  private untaggedMasterFile: string[];
  private untaggedYear: number;
  private untaggedMonth: number;
  private taggedMonth: number;
  private taggedYear: number;

  private fileDate: Date = new Date();

  private integrations: Array<Integration<All>> = [];
  private integration: Integration<GlobeBilling> = API.Integration.globeBilling.blank();

  private lineLength: number = 50;

  /* Lifecycle */
  private created(): void {
    this.init();
  }

  private async init(): Promise<void> {
    const integrations = API.Integration.get();
    API.UI.showSpin();

    try {
      this.integration = await API.Integration.globeBilling.getOne(this.id);
    } catch {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting integration.',
      });
    }

    // Security checks
    if (this.integration === undefined) {
      return this.$router.push({name: 'Error Page'});
    } else if (this.integration.organization_id !== this.currentOrg) {
      return this.$router.push({name: 'Error Page'});
    } else if (
      this.integration.organization_id !== 'a81893a0-f820-4b5e-aed4-d568c9887a26' && // aboitizgroupcompany
      this.integration.organization_id !== 'mpa-bills2021' &&
      this.integration.organization_id !== 'regression-tp' &&
      this.integration.organization_id !== '3e00137f-e8e5-47c4-8aef-4c82d3a6780d' &&
      this.integration.organization_id !== 'smoke-test' &&
      this.integration.organization_id !== '0127a29a-ad52-4071-8e48-8c9ea2b742c1' &&
      this.integration.organization_id !== 'a3e3ac40-d9f0-4b4d-85e5-7c7393ba7adc') {
      return this.$router.push({name: 'Error Page'});
    } else if (this.integration.definition_id !== 'globe_billing') {
      return this.$router.push({name: 'Error Page'});
    }

    // Untagged/Tagged Master File bucket check
    try {
      // Check if Untagged Masterfile is available for download
      const [resp] = await API.Masterfile.downloadMasterfile(this.id) as any;

      this.untaggedMasterFile = resp.reports[0];
      this.untaggedYear = resp.year;
      this.untaggedMonth = resp.month;

      // Check if Tagged Masterfile has already been uploaded
      const [check] = await API.Masterfile.getTaggedMasterfile(this.id) as any;

      this.taggedMonth = check.month;
      this.taggedYear = check.year;
    } catch (e) {
        // throw new Error(e);
      }

    // Hides the div 'unavailable' on page load. This isn't the best way to do
    // this but seeing how v-cloak does not work, then this is viable for now.
    setTimeout(() => {
      (document.getElementById('unavailable') as any).style.visibility = 'visible';
    }, 1000);

    Promise.all([integrations]).then((res) => {
      integrations.then((integrationsRes) => {
        console.log('type: ', this.type);
        console.log('id: ', this.id);
        this.integrations = integrationsRes;
      });
    });
  }

  /* Methods */
  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  get type(): string {
    const iType = this.integrations.find((x) => x.id === this.id);
    if (iType) {
      return iType.definition_id;
    }

    return '';
  }

  get iFriendlyName(): string {
    let meta: any;
    const integration =  this.integrations.find((x) => x.id === this.id);
    if (integration) {
      meta = integration.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.friendly_name;
  }

  get iProviderType(): string {
    let meta: any;
    const integration =  this.integrations.find((x) => x.id === this.id);
    if (integration) {
      meta = integration.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.provider_type;
  }

  get iMonth() {
    const month = new Date();

    // Convert Month to String
    const date = (month.toLocaleString('default', { month: 'long' }));

    return date;
  }

  get monthNumber() {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = months[this.untaggedMonth];

    return monthNumber;
  }

  private resetFileInput() {
    const clearFileInput = (document.getElementById('fileName')as HTMLInputElement).value = '';
    const resetFileInput = (document.querySelectorAll('label') as any)[1].childNodes[1].nodeValue = ' Attach Tagged Master File';

    return resetFileInput;
  }

  private async fileName() {
    const filename = ((document.getElementById('fileName')as any).files[0]).name;

    return filename;
  }

  private async validateFileType() {
    // Checks if file is .xsx or .xlsx
    const masterFile = (document.getElementById('fileName')as HTMLInputElement).value;
    const idxDot = masterFile.lastIndexOf('.') + 1;
    const fileType = masterFile.substr(idxDot, masterFile.length).toLowerCase();

    // Checks if file size is less than or equal to 5MB
    const maxAllowedSize = 5 * 1024 * 1024;
    const FileSize = (document.getElementById('fileName')as any).files[0].size;

    // Checks the File Name
    const filename = ((document.getElementById('fileName')as any).files[0]).name;

    // Security checks and upload button text changing/resetting
    if (fileType !== 'xls' && fileType !== 'xlsx') {
      API.UI.addNotification({
        type: 'danger',
        text: filename + ' is not a .xls or a .xlsx file. Unable to attach and save.',
      });
      const reset = (document.getElementById('fileName')as any).value = null;
      const resetFileName = (document.querySelectorAll('label') as any)[1].childNodes[1].nodeValue = ' Attach Tagged Master File';
    } else if (FileSize > maxAllowedSize) {
      API.UI.addNotification({
        type: 'danger',
        text: filename + ' exceeds 5MB. Unable to attach and save.',
      });
      const reset = (document.getElementById('fileName')as any).value = null;
      const resetFileName = (document.querySelectorAll('label') as any)[1].childNodes[1].nodeValue = ' Attach Tagged Master File';
    } else if (fileType === 'xls' || fileType === 'xlsx') {
      const changeFileName = (document.querySelectorAll('label') as any)[1].childNodes[1].nodeValue = ' ' + filename;
      API.UI.addNotification({
        type: 'primary',
        text: filename + ' is now attached. Click the Upload button to upload it to the datalake.',
      });
    }
  }

  private async hashContentMD5() {
    // Converts content to MD5
    const CryptoJS = require('crypto-js');
    const hashwasm = require('hash-wasm');

    const chunkSize = 64 * 1024 * 1024;
    const fileReader = new FileReader();
    let hasher: any = null;

    function hashChunk(chunk: any) {
      return new Promise<void>((resolve, reject) => {
        fileReader.onload = async (e: any) => {
          const view = new Uint8Array(e.target.result);
          hasher.update(view);
          resolve();
        };

        fileReader.readAsArrayBuffer(chunk);
      });
    }

    // tslint:disable-next-line:no-shadowed-variable
    const readFile = async (file: any) => {
      if (hasher) {
        hasher.init();
      } else {
        hasher = await hashwasm.createMD5();
      }

      const chunkNumber = Math.floor(file.size / chunkSize);

      for (let i = 0; i <= chunkNumber; i++) {
        const chunk = file.slice(
          chunkSize * i,
          Math.min(chunkSize * (i + 1), file.size)
        );
        await hashChunk(chunk);
      }

      // tslint:disable-next-line:no-shadowed-variable
      const hash = hasher.digest();

      return Promise.resolve(hash);
    };

    // Converts Content MD5 to Base64
    const file = (document.getElementById('fileName')as any).files[0];
    const hash = await readFile(file);

    // Use Hex instead of Utf8 because AWS hates Utf8
    const promiseArray = CryptoJS.enc.Hex.parse(hash);
    const content_md5 = CryptoJS.enc.Base64.stringify(promiseArray);

    return content_md5;
  }

  private async getPresignedURL(): Promise<any> {
    const presignedURL = API.Masterfile.getPresignedURL(
      await this.hashContentMD5(),
      this.untaggedYear,
      this.monthNumber,
      this.id,
      this.currentOrg,
      await this.fileName()
    );

    return presignedURL;
  }

  private async upload(): Promise<any> {
    const file = (document.getElementById('fileName')as any);
    const upload = API.Masterfile.uploadMasterfile(
      await this.getPresignedURL(),
      await this.hashContentMD5(),
      file.files[0],
      file.type
    );

    API.UI.showSpin();

    if (await upload === '') {
      setTimeout(() => {
          location.reload();
      }, 1300);
    }

    return upload;
  }

}

</script>

<style lang="scss" scoped>
.alert {
  border-top: 0.1rem solid var(--c-gray-400);
  border-bottom: 0.1rem solid var(--c-gray-400);
  margin-bottom: -0.1rem;
  padding-bottom: 0.2rem;

  h2 {
    font-size: 2.8rem;
  }

  h3 {
    font-size: 2.4rem;
  }
}

.code {
  padding: 1rem;
}

.csx2 {
  margin-top: 0.6rem;
  margin-right: 1rem;
}

:disabled,
:disabled:hover {
    cursor: default;
    // color: black;
    opacity: 0.7;
}

.datetime-picker {
  height: 50px;
}

.row {
  text-align: center;
}

a, button.primary.outline.medium.upload {
  margin-top: 30px;
  margin-bottom: 50px;
}

label {
  font-weight: normal;
}

input[type="file"] {
    display: none;
}

input:disabled::-webkit-input-placeholder {
  color: black;
}

@media (prefers-color-scheme: dark) {
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
  ::placeholder {
    color: black;
  }
}

.tag {
  margin: 0.25rem 0 1rem 0;
  z-index: 0;
}

.controls {
  padding: 1rem 0;

  .banner {
    margin: 0.5rem 0.5rem 1rem 0;
  }
}

.showDefaults {
  padding: 0;

  label {
    padding: 0.8rem 1rem;
  }
}

.image {
  float: left;
  height: 4rem;
  width: 4rem;
  margin-right: 1rem;
}

</style>

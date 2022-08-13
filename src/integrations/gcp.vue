<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Account">

        <h3>GCP Account Information</h3>
        <br>

        <form @submit.prevent="step1('step-1')" data-vv-scope="step-1" novalidate>
          <div class="row">
            <div class="csm6 cxs12">
              <label for="gcpProjectId">GCP Project ID</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Project ID"
                name="gcpProjectId"
                maxlength="30"
                v-model="integrationData.metadata.project_id"
                v-validate="'required|project|hyphen'"
                data-vv-as="'GCP Project ID'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.gcpProjectId')">
                {{ errors.first('step-1.gcpProjectId') }}
              </banner>

              <p class="italics">
                A valid ID can include lowercase letters, numbers,
                hyphens ( - ), and a character length between 4 and 30 characters.
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="gcpProjectName">GCP Project Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Project Name"
                name="gcpProjectName"
                v-model="integrationData.metadata.project_name"
                v-validate="'required|alpha_num'"
                data-vv-as="'GCP Project Name'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.gcpProjectName')">
                {{ errors.first('step-1.gcpProjectName') }}
              </banner>

              <p class="italics">
                Give your GCP Project a name.
              </p>

            </div>
          </div>
          
          <div class="row">
            <div class="csm6 cxs12">
              <label for="gcpLocation">GCP Region</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                v-model="integrationData.metadata.region"
                name="gcpLocation"
                v-validate="'required'"
                data-vv-as="'GCP Region'">
              >
                <option disabled value="" hidden>Please select a region</option>
                <option value="asia-east1">asia-east1 (Changhua County)</option>
                <option value="asia-east2">asia-east2 (Hong Kong)</option>
                <option value="asia-south1">asia-south1 (Mumbai)</option>
                <option value="asia-southeast1">asia-southeast1 (Jurong West)</option>
                <option value="asia-southeast2">asia-southeast2 (Jakarta)</option>
                <option value="asia-northeast1">asia-northeast1 (Tokyo)</option>
                <option value="asia-northeast2">asia-northeast2 (Osaka)</option>
                <option value="asia-northeast3">asia-northeast3 (Seoul)</option>
                <option value="australia-southeast1">australia-southeast1 (Sydney)</option>
                <option value="europe-central2">europe-central2 (Warsaw)</option>
                <option value="europe-north1">europe-north1 (Hamina)</option>
                <option value="europe-west1">europe-west1 (St. Ghislain)</option>
                <option value="europe-west2">europe-west2 (London)</option>
                <option value="europe-west3">europe-west3 (Frankfurt)</option>
                <option value="europe-west4">europe-west4 (Eemshaven)</option>
                <option value="europe-west6">europe-west6 (Zürich)</option>
                <option value="northamerica-northeast1">northamerica-northeast1 (Montréal)</option>
                <option value="us-central1">us-central1 (Council Bluffs)</option>
                <option value="us-east1">us-east1 (Moncks Corner)</option>
                <option value="us-east4">us-east4 (Ashburn)</option>
                <option value="us-west1">us-west1 (The Dalles)</option>
                <option value="us-west2">us-west2 (Los Angeles)</option>
                <option value="us-west3">us-west3 (Salt Lake City)</option>
                <option value="us-west4">us-west4 (Las Vegas)</option>
                <option value="southamerica-east1">southamerica-east1 (São Paulo)</option>
              </select>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-3.gcpLocation')">
                {{ errors.first('step-3.gcpLocation') }}
              </banner>

              <p class="italics">
                The region where you want the CMI to be deployed. If the BigQuery Exporting and Forwarding is enabled,
                this will also be the region of the BigQuery Exporter and Forwarder Functions. 
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="gcpStatus">GCP Billing Data Status</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                name="gcpStatus"
                data-vv-as="'GCP Billing Data Status'"
                v-model="integrationData.metadata.gcp_config.status"
                v-validate="'required'">
              >
                <option disabled value="" hidden>Select Status</option>
                <option>Disabled</option>
                <option>Enabled</option>
              </select>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.gcpStatus')">
                {{ errors.first('step-1.gcpStatus') }}
              </banner>

              <p class="italics">
                Enabled or Disable GCP Billing Data Export.
              </p>

            </div>
          </div>

          <div class="row" v-if="integrationData.metadata.gcp_config.status === 'Enabled'">
            <div class="csm6 cxs12">
              <label for="billing_id">GCP Billing ID</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Billing ID"
                name="billing_id"
                v-model="integrationData.metadata.gcp_config.billing_id"
                v-validate="'required'"
                data-vv-as="'GCP Billing ID'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.billing_id')">
                {{ errors.first('step-1.billing_id') }}
              </banner>

              <p class="italics">
                Your Google Cloud Platform Account's Billing ID.
              </p>

            </div>

            <div class="csm6 cxs12">
              <label for="dataset_id">Google BigQuery Dataset ID</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Dataset ID"
                name="dataset_id"
                v-model="integrationData.metadata.gcp_config.dataset_id"
                v-validate="'required'"
                data-vv-as="'Google BigQuery Dataset ID'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.dataset_id')">
                {{ errors.first('step-1.dataset_id') }}
              </banner>

              <p class="italics">
                Your Google BigQuery Dataset ID. More information 
                <a href="https://cloud.google.com/billing/docs/how-to/export-data-bigquery-setup" target="_blank">
                here.<i class="fas fa-external-link"></i></a>
              </p>

            </div>

            <div class="csm6 cxs12">
              <label for="bqLocation">Google BigQuery Dataset Region</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                v-model="integrationData.metadata.gcp_config.bq_location"
                name="bqLocation"
                v-validate="'required'"
                data-vv-as="'Google BigQuery Dataset Region'"
              >
                <option disabled value="" hidden>Please select your Google BigQuery Dataset Region</option>
                <option value="asia-east1">asia-east1 (Changhua County)</option>
                <option value="asia-east2">asia-east2 (Hong Kong)</option>
                <option value="asia-south1">asia-south1 (Mumbai)</option>
                <option value="asia-southeast1">asia-southeast1 (Jurong West)</option>
                <option value="asia-southeast2">asia-southeast2 (Jakarta)</option>
                <option value="asia-northeast1">asia-northeast1 (Tokyo)</option>
                <option value="asia-northeast2">asia-northeast2 (Osaka)</option>
                <option value="asia-northeast3">asia-northeast3 (Seoul)</option>
                <option value="australia-southeast1">australia-southeast1 (Sydney)</option>
                <option value="europe-central2">europe-central2 (Warsaw)</option>
                <option value="europe-north1">europe-north1 (Hamina)</option>
                <option value="europe-west1">europe-west1 (St. Ghislain)</option>
                <option value="europe-west2">europe-west2 (London)</option>
                <option value="europe-west3">europe-west3 (Frankfurt)</option>
                <option value="europe-west4">europe-west4 (Eemshaven)</option>
                <option value="europe-west6">europe-west6 (Zürich)</option>
                <option value="northamerica-northeast1">northamerica-northeast1 (Montréal)</option>
                <option value="us-central1">us-central1 (Council Bluffs)</option>
                <option value="us-east1">us-east1 (Moncks Corner)</option>
                <option value="us-east4">us-east4 (Ashburn)</option>
                <option value="us-west1">us-west1 (The Dalles)</option>
                <option value="us-west2">us-west2 (Los Angeles)</option>
                <option value="us-west3">us-west3 (Salt Lake City)</option>
                <option value="us-west4">us-west4 (Las Vegas)</option>
                <option value="southamerica-east1">southamerica-east1 (São Paulo)</option>
              </select>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.bqLocation')">
                {{ errors.first('step-1.bqLocation') }}
              </banner>

              <p class="italics">
                Your Google BigQuery Dataset Region. <br>
                <b>Important:</b> 
                This must match the region of your Google BigQuery Dataset. 
              </p>

            </div>

            <div class="csm6 cxs12">
              <label for="schedulerRegion">Google App Engine Region</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                v-model="integrationData.metadata.gcp_config.scheduler_region"
                name="schedulerRegion"
                v-validate="'required'"
                data-vv-as="'Google App Engine Region'"
              >
                <option disabled value="" hidden>Please select your Google App Engine Region</option>
                <option value="asia-east1">asia-east1 (Changhua County)</option>
                <option value="asia-east2">asia-east2 (Hong Kong)</option>
                <option value="asia-south1">asia-south1 (Mumbai)</option>
                <option value="asia-southeast1">asia-southeast1 (Jurong West)</option>
                <option value="asia-southeast2">asia-southeast2 (Jakarta)</option>
                <option value="asia-northeast1">asia-northeast1 (Tokyo)</option>
                <option value="asia-northeast2">asia-northeast2 (Osaka)</option>
                <option value="asia-northeast3">asia-northeast3 (Seoul)</option>
                <option value="australia-southeast1">australia-southeast1 (Sydney)</option>
                <option value="europe-central2">europe-central2 (Warsaw)</option>
                <option value="europe-north1">europe-north1 (Hamina)</option>
                <option value="europe-west1">europe-west1 (St. Ghislain)</option>
                <option value="europe-west2">europe-west2 (London)</option>
                <option value="europe-west3">europe-west3 (Frankfurt)</option>
                <option value="europe-west4">europe-west4 (Eemshaven)</option>
                <option value="europe-west6">europe-west6 (Zürich)</option>
                <option value="northamerica-northeast1">northamerica-northeast1 (Montréal)</option>
                <option value="us-central1">us-central1 (Council Bluffs)</option>
                <option value="us-east1">us-east1 (Moncks Corner)</option>
                <option value="us-east4">us-east4 (Ashburn)</option>
                <option value="us-west1">us-west1 (The Dalles)</option>
                <option value="us-west2">us-west2 (Los Angeles)</option>
                <option value="us-west3">us-west3 (Salt Lake City)</option>
                <option value="us-west4">us-west4 (Las Vegas)</option>
                <option value="southamerica-east1">southamerica-east1 (São Paulo)</option>
              </select>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.schedulerRegion')">
                {{ errors.first('step-1.schedulerRegion') }}
              </banner>

              <p class="italics">
                Your Google App Engine Region. This must match the region of your Google App Engine, 
                if you already have one. More information on how to find your Google App Engine Region
                <a href="https://cloud.google.com/appengine/docs/locations" target="_blank">here.
                <i class="fas fa-external-link"></i></a> <br> <b>Important:</b> If your Google Cloud Project 
                does not have a Google App Engine yet, take note of your input here as it will be important in the next step.
              </p>

            </div>
          </div>

          <div class="text-right">
            <!-- <button class="button default outline" @click="addIntegration()">Next: Access</button> -->
            <button class="button default outline" type="submit">Next: Access</button>
          </div>
        </form>

      </tab>

      <tab name="Access">
        <h3>Allow Access</h3>
        <p>
          Log into your
          <a href="https://console.cloud.google.com/" target="_blank">
            Google Cloud
            <i class="fas fa-external-link"></i>
          </a>
          account you want to add and follow the steps to grant access.
        </p>
        <ol>
          <li>
            Navigate to <span class="italics">IAM & admin > Service accounts</span> and click
            <span class="bold">+Create Service Account</span>
            to make a new service account with the name
            <copy class="tag primary highlight">{{ roleName }}</copy>,
            and click <span class="bold">Create</span>.
          </li>
          <li>
            Add the following roles:
            <ul class="bullet">
              <li>Cloud Functions Admin</li>
              <li>Cloud Scheduler Admin</li>
              <li>Compute Instance Admin (v1)</li>
              <li>Compute Network Admin</li>
              <li>Create Service Accounts</li>
              <li>Delete Service Accounts</li>
              <li>Project IAM Admin</li>
              <li>Service Account User</li>
              <li>Storage Admin</li>
            </ul>
          </li>
          <li>
            Click <span class="bold">Continue</span> and then <span class="bold">Done</span> to finish creating
            the Service Account.
          </li>
          <li>
            Click the checkbox of your newly created service account <span class="bold">{{ roleName }}</span> and in the right-hand
            window called <span class="italics">Permissions</span>, click <span class="bold">+Add Member</span>.
          </li>
          <li>
            Add <copy class="tag primary highlight">{{ gcpCascadeo }}</copy>
            to the field called <span class="bold">New Members</span> and give it the role
            <span class="bold">Service Account Token Creator</span>. Click <span class="bold">Save</span>
            to finish.
          </li>
          <li>
            <b>If you have not done so,</b> create a Google App Engine. Navigate to the
            <a href="https://console.cloud.google.com/projectselector2/appengine/create?lang=python&st=true" target="_blank">
            Google App Engine<i class="fas fa-external-link"></i></a> page and select your project. Select a region to specify 
            where you want to your App Engine to be located. <b> Take note of the region you selected on the page before, as it
            must match that.</b> <br> <b>Note:</b> You can choose any region, but to minimise latency and pricing,
            and to meet your latency, availability, or durability requirements, take a look at the Google App Engine location
            <a href="https://cloud.google.com/appengine/docs/locations" target="_blank">documentation<i class="fas fa-external-link">
            </i></a> first before choosing. You can only have one App Engine per project, 
            and you cannot change an app engine's region after you set it.
          </li>
          <li>
            Navigate to <span class="italics">APIs & Services > Library</span>
            and <span class="bold">Enable</span> the following APIs and services if they are not enabled yet:
            <ul class="bullet">
              <li>BigQuery API</li>
              <li>Cloud Build API</li>
              <li>Cloud Functions API</li>
              <li>Cloud Logging API</li>
              <li>Cloud Resource Manager API</li>
              <li>Cloud Scheduler API</li>
              <li>Cloud Storage</li>
              <li>Cloud Storage API</li>
              <li>Compute Engine API</li>
              <li>Identity and Access Management (IAM) API</li>
            </ul>
          </li>
        </ol>
        <div class="text-right">
          <button class="button default link" @click="back()">Back</button>
          &nbsp;
          <button class="button default outline" @click="next()">Next: Deploy</button>
        </div>
      </tab>

      <tab name="Deploy">
        <h3>Deploy CMI</h3>

        <p>
          We will deploy our own monitoring tool called <span class="bold">Cascadeo CMI</span>
          into your environment. The CMI allows us to collect
          environment data without installing agents or modifying source code
          on your resources.
        </p>
        <p>
          Cascadeo provides the <span class="bold">CMI</span> tool for no additional
          charge, but you will see a VM instance in your environment.
          Setup commonly takes ~5 minutes, but more time may be necessary for
          certain environments.
        </p>

        <hr class="default">

        <form @submit.prevent="step3('step-3')" data-vv-scope="step-3">

          <div class="text-right">
            <button type="button" class="button default link" @click="back()">Back</button>

            <button class="button primary outline" type="submit">Finish and Deploy</button>
          </div>

        </form>

      </tab>
    </tabs>


  </div>

</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

@Component
export default class GCPIntegration extends Vue {
  /* Variables */

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }
  get roleName(): string {
    // https://cascadeo.atlassian.net/browse/IOP-1303
    // NOTE: gcp prefixes random number if service account name is more than certain characters
    return 'cascadeo-cmi';
  }

  private gcpCascadeo = process.env.VUE_APP_GCP_SERVICE_ACCOUNT;
  private tabIndex: number = 0;
  private pipelineId: string = '';
  private status: string = '';
  private showStatus: boolean = false;

  private integrationData: IntegrationData<GCP> = {
    id: '',
    definition_id: 'gcp',
    organization_id: API.Organization_v2.getCurrentId(),
    metadata: {
      region: 'us-east1',
      project_name: '',
      project_id: '',
      gcp_config: {
        status: '',
        billing_id: '',
        dataset_id: '',
        bq_location: '',
        scheduler_region: '',
      },
    },
  };

  /* Lifecycle */

  private created(): void {

    /**
     * GCP `project_id` validation rules:
     * [x] letters
     * [x] numbers
     * [x] hyphens
     * [x] between 4 and 30 chars
     *
     * `abcdefghi-12345678901234567890` = valid id
     */
    this.$validator.extend('project', {
      getMessage(value: any, field: any) {
        return 'Not a valid GCP Project ID.';
      },
      validate(value: any, field: any) {
        const regex: RegExp = new RegExp('^[-a-zA-Z0-9]+$');
        return (regex.test(value) && value.length >= 4 && value.length <= 30);
      },
    });
  }

  /* Methods */
  private checkIfValidUUID(str: string) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regexExp.test(str);
  }

  @Watch('integrationData.metadata.project_id')
  private onFooChange(foo: string, newFoo: string) {
    this.integrationData.metadata.project_id = this.integrationData.metadata.project_id.toLowerCase()
      .replace('.', '')
      .replace(' ', '')
      .replace('_', '');
  }

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }

  private async next(): Promise<void> {
    this.gotoTab(this.tabIndex + 1);
  }

  private async back(): Promise<void> {
    this.gotoTab(this.tabIndex - 1);
  }

  private async step3(scope: string): Promise<void> {
    const result = await this.$validator.validateAll(scope);
    if (result) {
      const response = await API.Integration.add(this.integrationData);
      const integration_id = response.id;

      await API.Integration.addClient(integration_id, 'gcp');

      await API.Integration.gcp.start(integration_id, this.integrationData.organization_id);

      router.replace('/integrations');
    }
  }

}

</script>

<style lang="scss" scoped>
.statusCheck {
  display: flex;
  align-items: center;

  .status {
    flex: 1;
  }
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
  select option:disabled,
  ::placeholder {
    color: #808080;
  }
  select option {
    color: black;
  }
}

</style>

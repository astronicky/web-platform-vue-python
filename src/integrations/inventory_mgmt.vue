<template>
  <div>

  <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">

      <tab name="Metadata">
        <h3>Cloud Inventory Information</h3>
        <br>
        
        <form @submit.prevent="step1('step-1')" novalidate data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="providerType">Cloud Provider</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                name="providerType"
                v-model="integration.metadata.provider_type"
                data-vv-as="'Cloud Provider Type'"
                v-validate="'required'">
                <option disabled value="" hidden>Select Cloud Provider Type</option>
                <option v-for="(value, name) in supportedProviders()" :key=value :value=value>{{ name }}</option>
              </select>
              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.providerType')">
                {{ errors.first('step-1.providerType') }}
              </banner>

              <p class="italics">
                Your Cloud Inventory Integration Provider Type.
              </p>
            </div>
          </div>
          
          <div v-if="integration.metadata.provider_type==`Amazon Web Services`">
            <div class="row">
              <div class="csm6 cxs12">
                <label for="AccountId">Account ID</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Account ID"
                  name="AccountId"
                  maxlength="14"
                  v-model="integration.metadata.account_id"
                  v-validate="'required|digits:12'"
                  data-vv-as="'Account ID'">

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-1.AccountId')">
                  {{ errors.first('step-1.AccountId') }}
                </banner>

                <p class="italics">
                  Your Cloud Provider Account Identifier.
                </p>

              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="friendlyName">Friendly Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  name="friendlyName"
                  placeholder="Friendly Name"
                  data-vv-as="'Friendly Name'"
                  v-model="integration.metadata.friendly_name"
                  v-validate="'required'">

                <banner 
                  type="danger" 
                  icon="fas fa-exclamation-triangle" 
                  v-if="errors.has('step-1.friendlyName')">
                  {{ errors.first('step-1.friendlyName') }}
                </banner>

                <p class="italics">
                  Your Cloud Inventory Integration alias, or friendly name (for easy identification in Platform UI).
                </p>
                <p style="font-weight:500; font-size:14px">
                  Please enable an option before
                  continuing to the next step.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="gov_policy_enable">Governance & Policies</label>
              </div>
              <div class="csm6 cxs12">
                <input 
                  type="radio" 
                  id="gov_policy_enable1"
                  class="radio"
                  v-model="integration.metadata.gov_policy_enable"
                  v-bind:value="true"
                >
                <label for="gov_policy_enable1" class="radio">Enabled</label>

                <input 
                  type="radio"
                  id="gov_policy_enable2"
                  class="radio"
                  v-model="integration.metadata.gov_policy_enable"
                  v-bind:value="false"
                  onclick="document.getElementById('gov_policy_enable').click()"
                >
                <label for="gov_policy_enable2" class="radio">Disabled</label>
                <p class="italics">
                  Cascadeo.io includes pre-defined policy recommendations to maximize your environment
                </p>

              </div>
            </div>

            <div class="text-right">
              <button class="button default outline" type="submit" name="access">Next: Configure Access</button>
            </div>
          </div>

          <div v-if="integration.metadata.provider_type==`Microsoft Azure`">
            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureFriendlyName">Microsoft Azure Friendly Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Friendly Name"
                  name="azureFriendlyName"
                  v-model="integrationAzure.metadata.friendly_name"
                  v-validate="'required|alpha_num'"
                  data-vv-as="'Azure Friendly Name'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureFriendlyName')">
                  {{ errors.first('step-2.azureFriendlyName') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure CMI Friendly Name.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureSubscriptionId">Microsoft Azure Subscription ID</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Subscription ID"
                  name="azureSubscriptionId"
                  v-model="integrationAzure.metadata.subscription_id"
                  v-validate="'required|hyphen'"
                  data-vv-as="'Azure Subscription ID'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureSubscriptionId')">
                  {{ errors.first('step-2.azureSubscriptionId') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Subscription ID.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureManagedIdentity">Managed Service Identity</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Managed Identity"
                  name="azureManagedIdentity"
                  v-model="integrationAzure.metadata.managed_identity"
                  v-validate="'required|hyphen'"
                  data-vv-as="'Azure Managed Service Identity'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureManagedIdentity')">
                  {{ errors.first('step-2.azureManagedIdentity') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Managed Service Identity Name. 
                  This is the identity name setup on the previous page.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureResourceGroup">Microsoft Azure Resource Group</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Resource Group"
                  name="azureResourceGroup"
                  v-model="integrationAzure.metadata.resource_group"
                  v-validate="'required'"
                  data-vv-as="'Azure Resource Group'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureResourceGroup')">
                  {{ errors.first('step-2.azureResourceGroup') }}
                </banner>

                <p class="italics">
                  Your Cascadeo Azure CMI will 
                  deploy into this Resource Group.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureRegion">Microsoft Azure Region</label>
              </div>
              <div class="csm6 cxs12">
                <select
                  v-model="integrationAzure.metadata.region"
                  name="azureRegion"
                  v-validate="'required'"
                  data-vv-as="'Azure Region'"
                >
                  <option disabled value="">Please select a region</option>
                  <option value="eastus">East US</option>
                  <option value="eastus2">East US 2</option>
                  <option value="westus">West US</option>
                  <option value="eastasia">East Asia</option>
                  <option value="southeastasia">Southeast Asia</option>
                  <option value="centralus">Central US</option>
                  <option value="northcentralus">North Central US</option>
                  <option value="southcentralus">South Central US</option>
                  <option value="northeurope">North Europe</option>
                </select>

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureRegion')">
                  {{ errors.first('step-2.azureRegion') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure CMI Region. <b>Important:</b> 
                  This must be the Resource Group's region.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureTenantID">Microsoft Azure Tenant ID</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Tenant ID"
                  name="azureTenantID"
                  v-model="integrationAzure.metadata.tenant_id"
                  v-validate="'required|hyphen'"
                  data-vv-as="'Azure Tenant ID'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureTenantID')">
                  {{ errors.first('step-2.azureTenantID') }}
                </banner>

                <p class="italics">
                  Active Directory App's Tenant ID or the "tenant" value from the created service principal.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureClientID">Microsoft Azure Client ID</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Client ID"
                  name="azureClientID"
                  v-model="integrationAzure.metadata.client_id"
                  v-validate="'required|hyphen'"
                  data-vv-as="'Azure Client ID'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureClientID')">
                  {{ errors.first('step-2.azureClientID') }}
                </banner>

                <p class="italics">
                  Active Directory App's Client ID or the "appId" value from the created service principal.
                </p>
              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azuretClientSecret">Microsoft Azure Client Secret</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="password"
                  placeholder="Client Secret"
                  name="azureClientSecret"
                  v-model="integrationAzure.secrets.client_secret"
                  v-validate="'required'"
                  data-vv-as="'Azure Client Secret'"
                />

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureClientSecret')">
                  {{ errors.first('step-2.azureClientSecret') }}
                </banner>

                <p class="italics">
                  Active Directory App's Client Secret or the "password" value from the created service principal.
                </p>

              </div>
            </div>

            <div class="row">
              <div class="csm6 cxs12">
                <label for="azureStatus">Microsoft Azure Billing Data Forwarding</label>
              </div>
              <div class="csm6 cxs12">
                <select required
                  @keydown.enter="$event.stopPropagation()"
                  name="azureStatus"
                  data-vv-as="'Billing Data Status'"
                  v-model="integrationAzure.metadata.azure_config.status"
                  v-validate="'required'">
                >
                  <option disabled value="" hidden>Select Status</option>
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.azureStatus')">
                  {{ errors.first('step-2.azureStatus') }}
                </banner>

                <p class="italics">
                  Enable or Disable Microsoft Azure Billing Data Forwarding.
                </p>

              </div>
            </div>

            <div class="row" v-if="integrationAzure.metadata.azure_config.status === 'Enabled'">
              <div class="csm6 cxs12">
                <label for="costAnalysisName">Microsoft Azure Cost Management Data Exporter Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Exporter Name"
                  name="costAnalysisName"
                  v-model="integrationAzure.metadata.azure_config.ca_name"
                  v-validate="'required'"
                  data-vv-as="'Cost Analysis Exporter Name'">

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.costAnalysisName')">
                  {{ errors.first('step-2.costAnalysisName') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Cost Management's Cost Data Exporter Name.
                </p>

              </div>

              <div class="csm6 cxs12">
                <label for="costAnalysisStorageName">Microsoft Azure Cost Management Data Exporter Storage Account Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Storage Account Name"
                  name="costAnalysisStorageName"
                  v-model="integrationAzure.metadata.azure_config.sa_name"
                  v-validate="'required'"
                  data-vv-as="'Cost Analysis Exporter Name'">

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.costAnalysisStorageName')">
                  {{ errors.first('step-2.costAnalysisStorageName') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Cost Management Data Exporter's Storage Account
                  Name. This must be greater than or equal to three (3) characters long.
                </p>

              </div>

              <div class="csm6 cxs12">
                <label for="exporter_container">Microsoft Azure Cost Management Data Exporter Container Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Container Name"
                  name="exporter_container"
                  v-model="integrationAzure.metadata.azure_config.container_name"
                  v-validate="'required'"
                  data-vv-as="'Cost Analysis Container Name'">

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.exporter_container')">
                  {{ errors.first('step-2.exporter_container') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Cost Management Data Exporter's Storage Account Container Name.
                </p>

              </div>

              <!-- <div class="csm6 cxs12">
                <label for="blob_name">Microsoft Azure Cost Management Data Exporter Directory Name</label>
              </div>
              <div class="csm6 cxs12">
                <input
                  type="text"
                  placeholder="Directory Name"
                  name="blob_name"
                  v-model="integrationAzure.metadata.azure_config.blob_name"
                  v-validate="'required'"
                  data-vv-as="'Cost Analysis Directory Name'">

                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('step-2.blob_name')">
                  {{ errors.first('step-2.blob_name') }}
                </banner>

                <p class="italics">
                  Your Microsoft Azure Cost Management Data Exporter's Storage Account Directory
                  Name. <br><b>Note:</b> This is also known as a blob, and thus will appear 
                  as blob_name in the azure_config list of the integration.
                </p> -->

              <!-- <!-- </div> -->
            </div>

            <div class="text-right">
              <button
                class="button default link"
                type="button"
                @click="gotoTab(0)"
              >
                Back
              </button>
              &nbsp;
              <button class="button primary outline" type="submit">
                Finish and Deploy
              </button>
            </div>
          </div>
          
        </form>

      </tab>

      <tab name="Access">
        <h3>Allow Access</h3>
        <p>
          Log into the Amazon Web Services account you want to add and follow
          the steps to grant access.
        </p>
        <ol>
          <li>
            Navigate to <span class="italics">IAM > Roles</span> and click <span class="bold">Create Role</span>.
          </li>
          <li>
            Select <span class="bold">Another AWS Account</span> and
            add <copy class="tag primary highlight">{{ awsAccount }}</copy>
            to the <span class="italics">Account ID</span>.
          </li>
          <li>
            Check <span class="italics">Require external ID</span> and a new box will appear. Add
            <copy class="tag primary highlight">{{ externalId }}</copy> to
            <span class="italics">External ID</span> and click
            <span class="bold">Next</span>.
            <br><br>
            <img src="@/assets/aws_step2_navigate_3.png" alt="External ID" style="width:700px;height:500px;">
            <br><br>
          </li>
          <li>
            In <span class="bold">Add permissions</span> section, search and select the following AWS managed policies:
            <ul>
              <li><span class="italics">SecurityAudit</span> &emsp;&emsp; (Type: AWS managed - job function)</li>
              <li><span class="italics">ViewOnlyAccess</span> &emsp;(Type: AWS managed - job function)</li>
              <li><span class="italics">ComputeOptimizerReadOnlyAccess</span> &emsp;(Type: AWS managed)</li>
              <br>
              <img src="@/assets/aws_managed_policies.png" alt="AWS Managed Policies" style="width:700px;height:120px;">
              <br><br>
            </ul> 
            Then click <span class="bold">Next</span>.
            <br><br>
          </li>
          <li>
            In <span class="bold">Name, review, and create</span> section,
            set the <span class="italics">Role Name</span> to
            <span class="tag primary highlight" id="role_id">{{ this.integrationAzure.metadata.friendly_name }}
              <button id="button" @click="copyFunction('role_id')" ><i class="fas fa-copy"></i></button>
            </span>
            and click <span class="bold">Create Role</span>.
          </li>
        </ol>
        <div class="text-right">
          <button class="button default link" @click="gotoTab(0)">Back</button>
          &nbsp;
          <button class="button primary outline" type="submit" name="finish" @click="save()">Deploy</button>
        </div>
      </tab>
  </tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';
import IntegrationsList from '@/views/main/Integrations/IntegrationsList.vue';
import ListAnimate from '@/views/misc/ListAnimate.vue';

@Component({
  components: {
    IntegrationsList,
    ListAnimate,
  },
})

export default class InventoryMgmtView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private integrationAll: Integration<All>;

  // get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }

  @Prop()
  private editing: boolean;

  @Prop()
  private integrations: Array<Integration<All>>;

  private environment: string | undefined = process.env.VUE_APP_ENV;
  private awsAccount = process.env.VUE_APP_CASCADEO_AWS;
  private externalId = process.env.VUE_APP_AWS_EXTERNAL_ID;

  get friendly_name(): string { return this.integration.metadata.friendly_name; }

  private manualdeploy = false;

  private integration: IntegrationData<InventoryMgmt> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'inventory_mgmt',
    metadata: {
      provider_type: '',
      friendly_name: '',
      account_id: '',
      enabled: true,
      gov_policy_enable: false,
    },
  };
  private integrationAzure: IntegrationData<Azure> = {
    id: '',
    definition_id: 'azure',
    organization_id: API.Organization_v2.getCurrentId(),
    secrets: {
      client_secret: '',
    },
    metadata: {
      region: 'eastus',
      subscription_id: '',
      managed_identity: '',
      resource_group: '',
      tenant_id: '',
      client_id: '',
      friendly_name: '',
      azure_config: {
        status: '',
        ca_name: '',
        sa_name: '',
        container_name: '',
        // blob_name: '',
      },
    },
  };
  private status: string = 'Working';

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.id === this.$route.params.id && integration.definition_id === 'inventory_mgmt') {
          this.integration.id = integration.id;
          this.integration.metadata = integration.metadata;
          this.integrationAll = integration;
        }
      }
    }
  }

  /* Methods */
  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }

  private save(): void {
    this.$validator.validateAll().then(async (result) => {
      if (this.integration.metadata.friendly_name === '' || this.integration.metadata.provider_type === '') {
        return;
      }

      if (result) {
        if (this.editing) {
          await this.update();
        } else {
          await this.add(true);
        }
      }
    });
  }

  private async update() {
    try {
      await API.Integration.remove(this.integrationAll, false);
      await this.add(false);
      API.UI.addNotification({
        type: 'primary',
        text: 'Updated Cloud Inventory integration.',
      });
    } catch (error) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error updating Cloud Inventory integration.',
        });
    }
  }

  private async add(notify: boolean) {
    API.Integration.add(this.integration)
      .then((response) => {
        API.Integration.inventorymgmt.triggerPull(response.id);
      })
      .then(() => {
        router.replace('/integrations');
        if (notify) {
          API.UI.addNotification({
            type: 'primary',
            text: 'Added Cloud Inventory Integration.',
          });
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  private supportedProviders(): object {
    return API.Integration.inventorymgmt.supportedProviders();
  }

  private copyFunction(cblock: string) {
    // Copies JSON code
    const copyText = document.getElementById(cblock)!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }
}

</script>

<style lang="scss" scoped>

  input[type=radio], .radio {
    display: inline;
    margin-top: .8em;
    position: relative;
    font-weight: 500;
    }

  #button {
    right: 0px;
    background: transparent;
    border: none;
    .fa-copy {
      color: hsl(195, 69%, 82%);
    }
  }

  #button:hover {
    background-color: hsl(192, 70%, 92%);
    .fa-copy {
      color: hsl(216, 65%, 22%);
    }
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

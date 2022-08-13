<template>
  <div>
    <tabs :list="true" :tabNav="false" :selected="tabIndex">
      <tab name="Access">
        <h3>Allow Access</h3>
        <p>
          Complete the following steps via the Azure CLI to enable the right
          permissions for the Cascadeo Managed Instance to be deployed into your
          Azure subscription. Additionally, this will enable the CMI to monitor
          your Azure subscription's resources.
        </p>
        <ol>
          <li>
            Prepare or gather the following values/names. These values will be used in the Azure CLI commands below:
            <ol>
              <ul class="bullet">
                <li>
                  <b>SubscriptionID</b> - your Azure subscription ID. You can get this from the Azure Portal by going to Subscriptions,
                  select the subscription where the CMI will be deployed, and in the Overview page, you can view the SubscriptionID.
                  Or through Azure CLI, you can check it through the following commands:
                  <p />
                  <b-button v-b-toggle.subcli-1 variant="primary">View Azure CLI commands</b-button>
                  <b-collapse id="subcli-1" class="mt-2">
                    <b-card>
                      <button id="button" @click="copySubscription()">
                        <i class="fas fa-copy"></i>
                      </button>
                      <pre class="tag primary highlight code" id="subCode">
# If you know the subscription name. Get the 'id' value from the output:
az account show --subscription "[Subscription Name]"

# If you do not know the subscription name, you can list all the available subscriptions. Look for the subscription and get its 'id' value:
az account list</pre
              >
              <p />
                      </b-card>
                    </b-collapse>
                </li>
                <li>
                  <b>Region</b> - define/determine the region where the Cascadeo CMI will be deployed. Click the button below to see the list of Regions supported
                  <p />
                    <b-button v-b-toggle.region-1 variant="primary">View the Supported Regions</b-button>
                    <b-collapse id="region-1" class="mt-2">
                      <b-card>
                        <pre class="tag primary highlight code">
East US - eastus
East US 2 - eastus2
West US - westus
East Asia - eastasia
Southeast Asia - southeastasia
Central US - centralus
North Central US - northcentralus
South Central US - southcentralus
North Europe - northeurope</pre
              >
              <p />
                      </b-card>
                    </b-collapse>
                </li>
                <li>
                  <b>ResourceGroup</b> - define the Azure resource group name to contain the Cascadeo CMI (can be any name).
                </li>
                <li>
                  <b>Managed Identity</b> - define the name of the Custom Azure Managed Service Identity to be use by the CMI to access Azure
                  Monitor metrics (can be any name). The name will be used in the Azure CLI commands below (referred to as <b> CascadeoManagedIdentity </b>)
                </li>
                <li>
                  <b>Service Principal</b> - define the Azure AD App registration name or service principal to be used to
                  deploy the Cascadeo CMI to your subscription (can be any name). This will be used in the Azure CLI command below (referred to as <b>CascadeoSP</b>)
                </li>
              </ul>
            </ol>
          </li>
          <br />
          <li>
            Create the following role definition json:
            <p />
              <div class="codeBlock">
                <button id="button" @click="copyJsonRoles()">
                  <i class="fas fa-copy"></i>
                </button>
                <pre class="tag primary highlight code" id="jsonRoleCode">
{
  "Name": "Cascadeo Platform Role",
  "IsCustom": true,
  "Description": "Role for cascadeo.io managed instance",
  "Actions": [
      "Microsoft.Authorization/*/read",
      "Microsoft.Compute/disks/*",
      "Microsoft.Compute/locations/*",
      "Microsoft.Compute/virtualMachines/*",
      "Microsoft.Insights/components/*",
      "Microsoft.ManagedIdentity/userAssignedIdentities/assign/action",
      "Microsoft.Network/locations/*",
      "Microsoft.Network/networkInterfaces/*",
      "Microsoft.Network/networkSecurityGroups/join/action",
      "Microsoft.Network/networkSecurityGroups/read",
      "Microsoft.Network/*",
      "Microsoft.Network/virtualNetworks/read",
      "Microsoft.Network/virtualNetworks/subnets/join/action",
      "Microsoft.Resources/deployments/*",
      "Microsoft.Resources/subscriptions/resourceGroups/read",
      "Microsoft.ResourceHealth/availabilityStatuses/read",
      "Microsoft.Security/advancedThreatProtectionSettings/*",
      "Microsoft.Storage/*",
      "Microsoft.Web/serverfarms/*",
      "Microsoft.Web/sites/*"
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
    "/subscriptions/[SubscriptionID]"
  ]
}
</pre
            >
              </div>
            <p />
          </li>
          <li>
            Then via the Azure CLI create the initial resources and permissions.
            <p />
              <div class="codeBlock">
                <button id="button" @click="copyResourcesAndPermissions()">
                  <i class="fas fa-copy"></i>
                </button>
                <pre class="tag primary highlight code" id="resourcesCode">

# Login to Azure first.
az login

# Create role using the JSON file above.
az role definition create --role-definition role.json

# Create the resource group where the Cascadeo CMI will be deployed.
az group create --location [Region] --name [ResourceGroup]

# Create the MSI identity to be used by the CMI, and assign it with Monitoring Reader role
az identity create --name "[CascadeoManagedIdentity]" --resource-group "[ResourceGroup]"
az role assignment create  --role "Monitoring Reader" --assignee $(az identity show -n [CascadeoManagedIdentity] -g "[ResourceGroup]" --query principalId -o tsv)

# Create the Azure AD app registration/service principal to be used by Cascadeo Platform to deploy the CMI to your Azure subscription.
# Take note of AppID, Password and TenantID which will be used later as ClientID, ClientSecret and TenantID respectively.
# For the years parameter, increase the value if you want it to have a longer expiration period. 
az ad sp create-for-rbac --name [CascadeoSP] --role "Cascadeo Platform Role" \
    --scopes "/subscriptions/[SubscriptionID]/resourceGroups/[ResourceGroup]" --years 1

# Make sure to take note of the output/values when you create the Service principal as you'll use it in the next page</pre
            >
              </div>
            <p />
          </li>
          <li>
            The deployment uses Terraform which requires the necessary Azure Resource Providers to be Registered. <p />
            <b>OPTION 1</b>: One option is to give the "*/register/action" permission to the Service Principal (SP) that was created.
            First create the following role and save it on a json file (e.g. az-register-role.json)
            <p />
              <div class="codeBlock">
                <button id="button" @click="copyRegisterRole()">
                  <i class="fas fa-copy"></i>
                </button>
                <pre class="tag primary highlight code" id="registerRoleCode">
{
  "Name": "Cascadeo Platform Register Role",
  "IsCustom": true,
  "Description": "Role for cascadeo.io deployment to register resource providers",
  "Actions": [
	  "*/register/action"
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
    "/subscriptions/[SubscriptionID]"
  ]
}</pre
            >
              </div>
            <p />
            Run the following Azure CLI commands to add the "Cascadeo Platform Register Role" to the Service Principal
            <p />
              <div class="codeBlock">
                <button id="button" @click="createRegisterRole()">
                  <i class="fas fa-copy"></i>
                </button>
                <pre class="tag primary highlight code" id="registerCreateCode">
# Create register role using the JSON file above.
az role definition create --role-definition az-register-role.json

# Assign the register role to the Service Principal with the following command:
az role assignment create --assignee "[CascadeoSP appID]" --role "Cascadeo Platform Register Role" --scope "/subscriptions/[Subscription ID]"</pre
            >
              </div>
            <p />
            <p />
            <b>OPTION 2</b>: Alternatively, if you don't want to provide the "register" permission to the service principal, you can manually register 
            the required Resource providers. 
            <p />
              <b-button v-b-toggle.register-1 variant="primary">Click to view OPTION 2 steps</b-button>
              <b-collapse id="register-1" class="mt-2">
                <b-card>
                  Below are the list of Resource Providers needed:
                <p />
                <div class="codeBlock">
                  <button id="button" @click="copyResourceProviders()">
                    <i class="fas fa-copy"></i>
                  </button>
                  <pre class="tag primary highlight code" id="resourceProviders">
Microsoft.ADHybridHealthService    
Microsoft.ApiManagement
Microsoft.Authorization
Microsoft.Automation
Microsoft.Billing
Microsoft.BotService
Microsoft.Cache
Microsoft.Cdn
Microsoft.ClassicSubscription
Microsoft.CognitiveServices
Microsoft.Commerce
Microsoft.Compute
Microsoft.Consumption
Microsoft.ContainerInstance
Microsoft.ContainerRegistry
Microsoft.CostManagement
Microsoft.DBforMySQL
Microsoft.DBforPostgreSQL
Microsoft.DataLakeAnalytics
Microsoft.DataLakeStore
Microsoft.Databricks
Microsoft.DevSpaces
Microsoft.DevTestLab
Microsoft.Devices
Microsoft.DocumentDB
Microsoft.EventGrid
Microsoft.EventHub
Microsoft.Features
Microsoft.HDInsight
Microsoft.KeyVault
Microsoft.Kusto
Microsoft.Logic
Microsoft.ManagedIdentity
Microsoft.Management
Microsoft.Maps
Microsoft.MarketplaceOrdering
Microsoft.Media
Microsoft.Network
Microsoft.NotificationHubs
Microsoft.OperationalInsights
Microsoft.OperationsManagement
Microsoft.PolicyInsights
Microsoft.Portal
Microsoft.RecoveryServices
Microsoft.Relay
Microsoft.ResourceGraph
Microsoft.Resources
Microsoft.Search
Microsoft.Security
Microsoft.SerialConsole
Microsoft.ServiceBus
Microsoft.ServiceFabric
Microsoft.Sql
Microsoft.Storage
Microsoft.StreamAnalytics
Microsoft.Web
microsoft.insights
microsoft.support
</pre
                  >
                </div>
                <p />
            <p />
            Save the Resource Providers list to a file (e.g. rp.txt) and run the following Azure CLI commands:
            <p />
            <button id="button" @click="saveResourceProviders()">
              <i class="fas fa-copy"></i>
            </button>
            <pre class="tag primary highlight code" id="registerResourceProviders">
# Run this command to Register the Resource Providers. It might take a minute or two to complete the registration.   

foreach($azrp in Get-Content .\rp.txt) {
  az provider register --namespace $azrp --subscription [Subscription ID]
}

# To check if the resource providers are registered, run the command below:
az provider list --query "sort_by([?registrationState=='Registered'].{Provider:namespace}, &Provider)" --out table</pre
            >
                  <p />
                </b-card>
              </b-collapse>
          </li>
        </ol>
        <div class="text-right">
          <button class="button default outline" @click="gotoTab(1)">
            Next: Deploy
          </button>
        </div>
      </tab>

      <tab name="Account">
        <h3>Microsoft Azure Account Information</h3>
        <br />
        <form @submit.prevent="step2('step-2')" data-vv-scope="step-2" novalidate>
          <div class="row">
            <div class="csm6 cxs12">
              <label for="azureFriendlyName">Microsoft Azure Friendly Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Friendly Name"
                name="azureFriendlyName"
                v-model="integration.metadata.friendly_name"
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
                v-model="integration.metadata.subscription_id"
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
                v-model="integration.metadata.managed_identity"
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
                v-model="integration.metadata.resource_group"
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
                v-model="integration.metadata.region"
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
                v-model="integration.metadata.tenant_id"
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
                v-model="integration.metadata.client_id"
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
                v-model="integration.secrets.client_secret"
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
                v-model="integration.metadata.azure_config.status"
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

          <div class="row" v-if="integration.metadata.azure_config.status === 'Enabled'">
            <div class="csm6 cxs12">
              <label for="costAnalysisName">Microsoft Azure Cost Management Data Exporter Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Exporter Name"
                name="costAnalysisName"
                v-model="integration.metadata.azure_config.ca_name"
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
                v-model="integration.metadata.azure_config.sa_name"
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
                v-model="integration.metadata.azure_config.container_name"
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
                v-model="integration.metadata.azure_config.blob_name"
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
export default class AzureIntegration extends Vue {
  get currentOrg(): string | undefined {
    return API.Organization_v2.getCurrentId();
  }
  get roleName(): string {
    return `${this.currentOrg}-cmi-assume-role`;
  }

  private showRegions: boolean = false;
  private showRegionEdit: boolean = false;
  private tabIndex: number = 0;

  private integration: IntegrationData<Azure> = {
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
  private pipelineId: string = '';

  /* Lifecycle */

  // private created(): void {}

  /* Methods */
  private gotoTab(tabNumber: number): void {
    this.tabIndex = tabNumber;
  }

  @Watch('integrationData.metadata.subscription_id')
  private onFooChange(foo: string, newFoo: string) {
    this.integration.metadata.subscription_id = this.integration.metadata.subscription_id
      .toLowerCase()
      .replace('.', '')
      .replace(' ', '')
      .replace('_', '');
  }

  private step2(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        API.Integration.add(this.integration)
          .then((response) => {
            this.integration.id = response.id;
          })
          .then(() => {
            API.Integration.addClient(this.integration.id, 'azure');
            API.Integration.azure.add(this.integration);
          })
          .then(() => {
            router.replace('/integrations');
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    });
  }

  private copySubscription() {
    // Copies Subscription ID code
    const copyText = document.getElementById('subCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private copyJsonRoles() {
    // Copies JSON code
    const copyText = document.getElementById('jsonRoleCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private copyResourcesAndPermissions() {
    // Copies Resources and Permissions code
    const copyText = document.getElementById('resourcesCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private copyRegisterRole() {
    // Copies Register Role code
    const copyText = document.getElementById('registerRoleCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private createRegisterRole() {
    // Copies Register Role code
    const copyText = document.getElementById('registerCreateCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private copyResourceProviders() {
    // Copies Resource Providers List
    const copyText = document.getElementById('resourceProviders')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private saveResourceProviders() {
    // Copies Resources and Permissions code
    const copyText = document.getElementById('registerResourceProviders')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

}
</script>

<style lang="scss" scoped>

  @media (prefers-color-scheme: dark) {
    select:invalid,
    select option:disabled,
    ::placeholder {
      color: #808080;
    }
    select option {
      color: white;
    }
    #button {
      position: absolute;
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
    #button {
      position: absolute;
      right: 0px;
      background: transparent;
      border: none;
      .fa-copy {
        color: hsl(208, 66%, 36%);
      }
    }
    #button:hover {
      background-color: hsl(208, 66%, 36%);
      .fa-copy {
        color: white;
      }
    }
  }

  .card-body, .codeBlock {
    display: inline-block;
    width: auto;
    position: relative;
  }

  .fa-copy {
  color: hsl(195, 69%, 82%);
  }

</style>

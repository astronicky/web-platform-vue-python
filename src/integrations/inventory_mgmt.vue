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
            <span class="tag primary highlight" id="role_id">{{ this.integration.metadata.friendly_name }}
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

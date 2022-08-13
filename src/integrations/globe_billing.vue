<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Metadata">
        
        <h3>Globe Billing Information</h3>
        <br>
        
        <form @submit.prevent="step1('step-1')" novalidate data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="providerType">Globe Billing Integration</label>
            </div>
            <div class="csm6 cxs12">
              <select required
                @keydown.enter="$event.stopPropagation()"
                name="providerType"
                v-model="integration.metadata.provider_type"
                data-vv-as="'Provider Type'"
                v-validate="'required'">
              >
                <option disabled value="" hidden>Select Globe Billing Integration Provider Type</option>
                <option v-for="(value, name) in supportedProviders()" :key=value :value=value>{{ name }}</option>
              </select>
                           
              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.providerType')">
                {{ errors.first('step-1.providerType') }}
              </banner>

              <p class="italics">
                Your Globe Billing Integration Provider Type.
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
                Your Globe Billing Integration alias, or friendly name.
              </p>

            </div>
          </div>

          <!-- <div class="row">
            <div class="csm6 cxs12">
              <label for="billingType">Billing Type</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                name="billingType"
                id="billingType"
                placeholder="Billing Type"
                data-vv-as="'Billing Type'"
                v-model="integration.metadata.billing_type"> -->
                <!-- v-validate="'required|alpha_num'">

              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.billingType')">
                {{ errors.first('step-1.billingType') }}
              </banner> -->
          
          <!--
            </div>
          </div>
          -->

          <!-- <div class="row">
            <div class="csm6 cxs12">
              <label for="billingID">Invoice Group ID</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                name="billingID"
                id="billingID"
                placeholder="Invoice Group ID"
                data-vv-as="'Invoice Group ID'"
                v-model="integration.metadata.invoice_group_id"> -->
                <!-- v-validate="'required'" >

              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.billingID')">
                {{ errors.first('step-1.billingID') }}
              </banner> -->
              
            <!-- </div>
          </div> -->

              <!-- :disabled="!integration.metadata.friendly_name" -->
          <div class="text-right">
            <button class="button primary outline" type="submit" @click="save()">Save</button>
          </div>

        </form>
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';
import IntegrationsList from '@/views/main/Integrations/IntegrationsList.vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

@Component({
  components: {
    IntegrationsList,
    DatePicker,
  },
})
export default class GlobeBillingView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private aws: string = '';
  private cloudId: string = '';
  private cloudIntegrationID: string = 'aws';
  private integrationAll: Integration<All>;

  @Prop()
  private editing: boolean;

  @Prop()
  private integrations: Array<Integration<All>>;

  private integration: IntegrationData<GlobeBilling> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'globe_billing',
    metadata: {
      provider_type: '',
      friendly_name: '',
    },
  };

  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.definition_id === 'globe_billing') {
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
        this.tabIndex = 1;
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
        text: 'Updated Globe Billing integration.',
      });
    } catch (error) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error updating globe billing.',
        });
    }
  }

  private async add(notify: boolean) {
    API.Integration.add(this.integration)
      .then(() => {
        router.replace('/integrations');
        if (notify) {
          API.UI.addNotification({
            type: 'primary',
            text: 'Added Globe Billing Integration.',
          });
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  private supportedProviders(): object {
    return API.Integration.globeBilling.supportedProviders();
  }
}

</script>

<style lang="scss" scoped>

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

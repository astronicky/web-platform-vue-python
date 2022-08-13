<template>
  <div>
    <h1>
      Thresholds
      <span v-if="iFriendlyName != ''">
      - {{ iFriendlyName }}
      </span>
      <!-- <span v-else-if="alerts.length > 0 && alerts.length !== filteredAlerts.length">({{ filteredAlerts.length }} of {{ alerts.length }})</span> -->
    </h1>
    <div v-if="alerts.length > 0">
      <!-- <banner
        type="primary"
        icon="fas fa-exclamation-triangle"
      >
        Save a threshold and then press "Push Updates" if you want changes to take affect on the CMI.
      </banner> -->
      <div class="controls">

        <div class="row">
          <div class="clg2 cmd3 csm4 cxs12">
            <label class="bold">Filter</label>
          </div>
          <div class="clg10 cmd9 csm8 cxs12">
            <input
              type="text"
              v-model="filter"
            >
          </div>
        </div>

        <div class="row">
          <div class="clgo2 clg5 cmdo3 cmd9 csmo4 csm8 cxs12">
            <banner
              type="default"
              icon="fas fa-search"
              v-if="filteredAlerts.length < alerts.length"
            >
              Showing
              <span class="bold">{{ filteredAlerts.length }}</span>
              of {{ alerts.length }} results.
            </banner>
          </div>
          <div
            class="clgo0 clg5 cmdo3 cmd9 csmo4 csm8 cxs12"
            v-if="filteredAlerts.length > 0"
          >
          </div>
        </div>

      </div>

      <banner
        v-if="showDelete"
        type="danger"
        icon="fas fa-exclamation-triangle"
      >
        <p>
          You are about to delete all current thresholds. To confirm, please
          type the name of the current organization you are signed into.
        </p>
        <div>
          <input
            type="text"
            v-model="deleteConfirm"
            placeholder="Current Organization"
          >
        </div>
        <div class="text-right">
          <button
            class="button danger link small"
            @click="showDeleteBanner(false)"
          >
            Cancel
          </button>
          &nbsp;
          <button
            class="button danger small"
            @click="deleteThreshold()"
          >
            Delete
          </button>
        </div>
      </banner>

      <div
        v-for="(alert, index) in filteredAlerts"
        :key="`alert-${index}`"
        class="alert"
      >
        <form
          v-on:submit.prevent
          :disabled="isDisabled(alert)"
          novalidate
        >
          <div class="right">
            <transition name="fade">
              <div
                class="tag danger highlight"
                v-if="hasChanges(index)"
              >
                <i class="fas fa-exclamation-triangle"></i>
                Unsaved Changes
              </div>
              <div
                class="tag primary link"
                v-if="hasSavedChanges(index)"
              >
                <i class="fas fa-check"></i>
                Saved
              </div>
            </transition>

            <button class="button default link small">
              <input
                :id="`status-${index}`"
                :name="`status-${index}`"
                type="checkbox"
                v-model="filteredAlerts[index].Enabled"
                @change="formUpdated('', index)"
              >
              <label :for="`status-${index}`">Enabled</label>
            </button>

            <button
              class="button default link small"
              @click="deleteThreshold(index)"
              title="Delete threshold."
            >
            <i class="fas fa-undo"></i>
              Delete
            </button>

            <button
              class="button primary link small"
              @click="save(alert, index)"
              title="Save updated threshold."
            >
              <i class="fas fa-save"></i>
              Save
            </button>
          </div>

          <h2 :title="alert.ID">
            <service-image
              id="globe_billing"
              alt="`globe_biling logo`"
              title="Globe Billing"
              class="image"
            />
            {{ alert.Name || 'Alert Name' }}
          </h2>

          <div class="row">
            <div class="clg2 cmd3 csm4 cxs12">
              <label class="bold">Alert Type</label>
            </div>
            <div class="clg5 cmd6 csm8 cxs12">
              <select required
                v-model="alert.Type"
                :disabled="isDisabled(alert)"
                @change="changeThresholdType('', index)"
                @keydown.enter="$event.stopPropagation()"
              >
                <option disabled value="" hidden>Select Alert Type</option>
                <option v-for="(value, name) in supportedThresholds()" :key=value :value=value>{{ name }}</option>
                <!-- Note: Comment out both values underneath
                including lines 7-8 in web-platform/src/API/GlobeBilling/threshold.ts
                to reactivate both budget options.  -->
                <option disabled value="">Forecast Budget</option>
                <option disabled value="">Anomaly Budget</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="clg2 cmd3 csm4 cxs12">
              <label class="bold">Alert Name</label>
            </div>
            <div class="clg5 cmd6 csm8 cxs12">
              <input required
                v-model="alert.Name"
                :disabled="isDisabled(alert)"
                placeholder=" Alert Name"
                @change="formUpdated('', index)"
                @keydown.enter="$event.stopPropagation()"/>
            </div>
          </div>

          <div class="row">
            <div class="clg2 cmd3 csm4 cxs12">
              <label class="bold">Alert Notes</label>
            </div>
            <div class="clg5 cmd6 csm8 cxs12">
              <input
                v-model="alert.Notes"
                :disabled="isDisabled(alert)"
                placeholder=" Alert Notes"
                @change="formUpdated('', index)"
                @keydown.enter="$event.stopPropagation()"/>
            </div>
          </div>

          <div class="row">
            <div class="clg2 cmd3 csm4 cxs12">
              <label class="bold">Severity</label>
            </div>
            <div class="clg5 cmd6 csm8 cxs12">
              <select required
                v-model="alert.Severity"
                :disabled="isDisabled(alert)"
                @change="formUpdated('', index)"
                @keydown.enter="$event.stopPropagation()"
              >
                <option disabled value="" hidden>Select Severity</option>
                <option>Warning</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div v-if="iProviderType === 'Amazon Web Services'">
            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Transaction Type</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <select required
                  v-model="alert.Metadata['TransactionType']"
                  :disabled="isDisabled(alert)"
                  @change="formUpdated('', index)"
                  @keydown.enter="$event.stopPropagation()"
                >
                  <option disabled value="" hidden>Select Transaction Type</option>
                  <option v-for="transactionType in aws" :key=transactionType>{{ transactionType }}</option>
                </select>
              </div>
            </div>
          </div>
          <div v-else-if="iProviderType === 'Google Cloud Platform'">
            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Transaction Type</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <select required
                  v-model="alert.Metadata['TransactionType']"
                  :disabled="isDisabled(alert)"
                  @change="formUpdated('', index)"
                  @keydown.enter="$event.stopPropagation()"
                >
                  <option disabled value="" hidden>Select Transaction Type</option>
                  <option v-for="transactionType in gcp" :key=transactionType>{{ transactionType }}</option>
                </select>
              </div>
            </div>
          </div>
          <div v-else-if="iProviderType === 'Microsoft Azure'">
            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Transaction Type</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <select required
                  v-model="alert.Metadata['TransactionType']"
                  :disabled="isDisabled(alert)"
                  @change="formUpdated('', index)"
                  @keydown.enter="$event.stopPropagation()"
                >
                  <option disabled value="" hidden>Select Transaction Type</option>
                  <option v-for="transactionType in azure" :key=transactionType>{{ transactionType }}</option>
                </select>
              </div>
            </div>
          </div>

          <div
            v-for="[key, value] of Object.entries(alert.Metadata)"
            :key="key"
          >
          
            <div v-if="key !== 'TransactionType'" class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold"> {{ key }} </label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <div v-if="typeof value === 'number' && value.length <= lineLength">
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text"
                    v-model="alert.Metadata[key]"
                    :disabled="isDisabled(alert)"
                    maxlength="15"
                    @change="changeThresholdType(index)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>
                <div v-else-if="typeof value === 'number' && value.length >= lineLength">
                  <textarea
                    v-model="alert.Metadata[key]"
                    :disabled="isDisabled(alert)"
                    maxlength="15"
                    @change="formUpdated('', index)"
                    @keydown.enter="$event.stopPropagation()"
                  ></textarea>
                </div>
                <div v-else>
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    v-model.number="alert.Metadata[key]"
                    :disabled="isDisabled(alert)"
                    maxlength="15"
                    @change="formUpdated('', index)"
                    @keydown.enter="$event.stopPropagation()"
                    number
                  >
                </div>
              </div>
            </div>

          </div>

          <br>
        </form>
      </div>

      <div
        class="controls right"
        v-if="filteredAlerts.length > 0"
      >
        <button
          class="button primary outline"
          @click="addThreshold()"
        >
          <i class="fas fa-cloud-upload"></i>
          Add Threshold
        </button>
      </div>
    </div>

    <div v-else>
      <empty icon="fas fa-sliders-h">
        <div slot="title">Adjust Thresholds</div>

        <div v-if="disabledAccess" slot="description">
          <p>
            Error getting thresholds. You might not have access to this resource.
          </p>
        </div>

        <div v-else slot="description">
          <p>
            Your resources are currently being monitored with safe, default settings.
            If you want to adjust certain thresholds, click to get started.
          </p>
          <br>
          <button
            class="button default outline"
            @click="addThreshold()"
          >
            <i class="fas fa-chevron-right"></i>
            Get Started
          </button>
        </div>
      </empty>
    </div>

  </div>
</template>

<script lang="ts">

import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
Component.registerHooks(['beforeRouteLeave']);

import router from '@/router/router';
import API from '@/API';

@Component
export default class IntegrationsThresholds extends Vue {
  /* tslint:disable:no-console */


  /* Variables */
  @Prop()
  private id: string;

  private filter: string = '';
  private showModal: boolean = false;
  private deleteConfirm: string = '';

  private alerts: Array<GlobeBillingThreshold<AllGlobeBillingThresholds>> = [];
  private disabledAccess: boolean = false;

  private showDelete: boolean = false;
  private awsTypes: string[];
  private gcpTypes: string[];
  private azureTypes: string[];


  /**
   * `formChanged` has three states:
   *   null           no changes detected
   *   ''             change detected but unsaved
   *   ${alertName}   what alert is saved and queued
   */
  private formChanged: string[] = [];

  private integrations: Array<Integration<All>> = [];

  private lineLength: number = 50;

  /* Lifecycle */
  private created(): void {
    this.init();
  }

  /* Methods */
  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  get canPushUpdates(): boolean {
    let canPush: boolean = false;
    this.formChanged.forEach((item) => {
      /* If an alert name exists */
      if (item != null && item.length > 0) {
        canPush = true;
      }
    });
    return canPush;
  }

  get filteredAlerts(): Array<GlobeBillingThreshold<AllGlobeBillingThresholds>> {
    // FIXME: disable filter for now
    return this.alerts;
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
    const integration = this.integrations.find((x) => x.id === this.id);
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
    const integration = this.integrations.find((x) => x.id === this.id);
    if (integration) {
      meta = integration.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.provider_type;
  }

  get aws(): string[] {
    return this.awsTypes;
  }

  get gcp(): string[] {
    return this.gcpTypes;
  }

  get azure(): string[] {
    return this.azureTypes;
  }

  private async init(): Promise<void> {
    this.alerts = [];
    this.awsTypes = [];
    this.gcpTypes = [];
    this.azureTypes = [];
    this.formChanged = [];
    this.deleteConfirm = '';
    this.showDelete = false;

    // Checks if this Integration is actually part of the Organization
    setTimeout(() => {
      if (this.iFriendlyName === '') {
        return this.$router.push({name: 'Error Page'});
      }
    }, 6000);

    const integrations = API.Integration.get();

    try {
      this.alerts = await API.GlobeBilling.threshold.getAll(this.id);
      this.awsTypes = await API.GlobeBilling.threshold.supportedAwsTransactionTypes();
      this.gcpTypes = await API.GlobeBilling.threshold.supportedGcpTransactionTypes();
      this.azureTypes = await API.GlobeBilling.threshold.supportedAzureTransactionTypes();
    } catch (e) {
      this.disabledAccess = true;
    }

    Promise.all([integrations]).then((res) => {
      integrations.then((integrationsRes) => {
        console.log('type: ', this.type);
        console.log('id: ', this.id);
        this.integrations = integrationsRes;
      });
    });
  }

  private beforeRouteLeave(to: any, from: any, next: any) {
    if (this.canPushUpdates) {
      const answer = window.confirm(
        'You have saved, but not deployed your changes. \n\n Do you still want to leave this page?'
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }

  private hasChanges(index: number): boolean {
    const updatedForm = this.formChanged[index];
    return updatedForm === '';
  }

  private hasSavedChanges(index: number): boolean {
    const updatedForm = this.formChanged[index];
    return updatedForm === null;
  }

  private formUpdated(name: string, index: number): void {
    this.$set(this.formChanged, index, name);
  }

  private changeThresholdType(name: string, index: number): void {
    this.$set(this.formChanged, index, name);

    let alertID;
    if (this.alerts[index].ID !== '') {
      alertID = this.alerts[index].ID;
    }

    const alertType = this.alerts[index].Type;
    if (alertType === '') {
      this.alerts[index] = API.GlobeBilling.threshold.blank();
    } else if (alertType === 'static_budget') {
      this.alerts[index] = API.GlobeBilling.threshold.blankActualBudget();
    } else if (alertType === 'forecast_budget') {
      this.alerts[index] = API.GlobeBilling.threshold.blankForecastBudget();
    } else if (alertType === 'anomaly_budget') {
      this.alerts[index] = API.GlobeBilling.threshold.blankAnomalyBudget();
    } else {
      throw new Error('Unsupported alert type');
    }

    if (alertID !== '') {
      this.alerts[index].ID = alertID;
    }
  }

  private async save(alert: GlobeBillingThreshold<AllGlobeBillingThresholds>, index: number): Promise<void> {
    if (alert.Type === '') {
      API.UI.addNotification({
        type: 'danger',
        text: 'Please select an Alert Type.',
      });
      return;
    }

    if (alert.Name === '') {
      API.UI.addNotification({
        type: 'danger',
        text: 'Please add an Alert Name.',
      });
      return;
    }

    if (alert.Notes === '') {
      API.UI.addNotification({
        type: 'danger',
        text: 'Please add Alert Notes.',
      });
      return;
    }

    if (alert.Severity === '') {
      API.UI.addNotification({
        type: 'danger',
        text: 'Please select a Severity type.',
      });
      return;
    }
/* tslint:disable:no-string-literal */

    if (alert.Metadata['TransactionType'] === '') {
      API.UI.addNotification({
        type: 'danger',
        text: 'Please select a Transaction Type.',
      });
      return;
    }
/* tslint:enable:no-string-literal */

    if (alert.ID === '' ) {
      delete alert.ID;
    }
    alert.IntegrationID = this.id;
    this.alerts[index].ID = await API.GlobeBilling.threshold.upsert(alert);
    this.$set(this.formChanged, index, null);
  }

  private showDeleteBanner(show: boolean): void {
    this.showDelete = show;
  }

  private addThreshold(): void {
    const a = API.GlobeBilling.threshold.blank();

    const idx = this.alerts.length;
    this.alerts.push(a);
    this.$set(this.formChanged, idx, '');
  }

  private supportedThresholds(): object {
    return API.GlobeBilling.threshold.supportedThresholds();
  }

  private async deleteThreshold(index: number): Promise<void> {
  // TODO: show confirmation before delete
    const alertID = this.alerts[index].ID;
    if (alertID === undefined) {
      this.alerts.splice(index, 1);
      return;
    }

    await API.GlobeBilling.threshold.delete(this.alerts[index].IntegrationID, alertID);
    this.alerts.splice(index, 1);
  }

  private isDisabled(alert: GlobeBillingThreshold<AllGlobeBillingThresholds>): boolean {
    return !alert.Enabled;
  }

  private reset(index: number): void {
    this.alerts[index] = API.GlobeBilling.threshold.blank();
    this.$set(this.formChanged, index, '');
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

:disabled,
:disabled:hover {
    cursor: default;
    // color: black;
    opacity: 0.7;
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
  select option:disabled,
  ::placeholder {
    color: #808080;
  }
  select option {
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

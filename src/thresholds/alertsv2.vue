<template>
  <div>
    <h1>
      Thresholds
      <span v-if="filteredCount()">
        ({{ filteredCount() }})
      </span>
      <span v-if="iFriendlyName != ''">
      - {{ iFriendlyName }}
      </span>
      <!-- <span v-else-if="alerts.length > 0 && alerts.length !== filteredAlerts.length">({{ filteredAlerts.length }} of {{ alerts.length }})</span> -->
    </h1>
    <div v-if="alerts.length > 0">
      <banner
        type="primary"
        icon="fas fa-exclamation-triangle"
      >
        Save a threshold if you want changes to take affect on the CMI.
      </banner>

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
              v-if="filteredCount() < alerts.length"
            >
              Showing
              <span class="bold">{{ filteredCount() }}</span>
              of {{ alerts.length }} results.
            </banner>
          </div>
          <div
            class="clgo0 clg5 cmdo3 cmd9 csmo4 csm8 cxs12"
            v-if="filteredCount() > 0"
          >
            <div class="right">
              <button v-if="integration.definition_id == 'aws'"
              class="button success outline" @click="showAddThresholdModal()">
                <i class="fas fa-plus-circle"></i>
                Add Threshold
              </button>
              &nbsp;
              <button class="button default outline showDefaults">
                <input
                  id="defaults"
                  name="defaults"
                  type="checkbox"
                  v-model="showDefaults"
                >
                <label
                  for="defaults"
                  class="normal"
                >Show Defaults</label>
              </button>
              &nbsp;
              <button
                class="button danger outline"
                @click="showDeleteBanner(true)"
              >
                <i class="fas fa-trash-alt"></i>
                Delete All
              </button>
              &nbsp;
              <button
                class="button primary outline"
                @click="saveAll()"
              >
                <i class="fas fa-save"></i>
                Save All
              </button>
            </div>
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
            @click="deleteAll()"
          >
            Delete
          </button>
        </div>
      </banner>

      <div
        v-for="(visible, i) in filteredAlerts"
        :key="`alert-${i}`"
        class="alert"
        v-show="visible"
      >
        <form
          v-on:submit.prevent
          :disabled="isDisabled(alerts[i])"
        >
          <div class="right">
            <transition name="fade">
              <div
                class="tag danger highlight"
                v-if="rowChanged(i)"
              >
                <i class="fas fa-exclamation-triangle"></i>
                Unsaved Changes
              </div>
              <div
                class="tag primary link"
                v-if="rowSaved(i)"
              >
                <i class="fas fa-check"></i>
                Saved
              </div>
            </transition>

            <button class="button default link small">
              <input
                :id="`status-${i}`"
                :name="`status-${i}`"
                type="checkbox"
                v-model="alerts[i].Enabled"
                @change="formUpdated('', i)"
              >
              <label :for="`status-${i}`">Enabled</label>
            </button>

            <button
              class="button default link small"
              @click="reset(i)"
              title="Reset to default threshold."
            >
            <i class="fas fa-undo"></i>
              Reset
            </button>

            <button
              class="button primary link small"
              @click="save(alerts[i], i)"
              title="Save updated threshold."
            >
              <i class="fas fa-save"></i>
              Save
            </button>
            <!-- future button to run on-demand query test -->
            <!-- <button
              class="button primary link small"
              @click="validateThreshold(alerts[i].AlertID ,i)"
              title="Validate threshold"
            >
              <i class="fas fa-save"></i>
              Validate
            </button> -->
            
            <div class="tag bold" @click="refreshValidationStatus(alerts[i].AlertID ,i)">
              <span style='padding-right: 5px'>Validation:</span> 
              <div v-if="alerts[i].ValidationState === ''">
                UNKNOWN
              </div>
              <div v-else :class="{ 'red': alerts[i].ValidationState === 'ERROR','green':  alerts[i].ValidationState === 'PASSED'}">
                {{ alerts[i].ValidationState }}
              </div>
            </div>
          </div>

          <h2 :title="alerts[i].Name">
            <service-image
              :id="integration.definition_id"
              :alt="`${integration.definition_id} logo`"
              :title="integration.definition_id"
              class="image"
            />
            {{ alerts[i].Name }}
          </h2>

            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Threshold Type</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <div>
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text" readonly
                    v-model="alerts[i].Type"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>
                <!-- <div class="right">
                  <div class="tag">
                    <label class="bold">Validation: </label>
                    {{ alerts[i].ValidationState }}
                  </div>
                </div> -->
              </div>
              <div class="clgo0 clg5 cmdo3 cmd6 csmo4 csm8 cxs12">
                <span
                  class="tag default highlight italics"
                  v-if="showDefaults"
                ></span>
              </div>
            </div>

            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Subject</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <div>
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text"
                    v-model="alerts[i].Subject"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>
              </div>
              <div class="clgo0 clg5 cmdo3 cmd6 csmo4 csm8 cxs12">
                <span
                  class="tag default highlight italics"
                  v-if="showDefaults"
                >{{ findDefault(alerts[i].Name).Subject }}</span>
              </div>
            </div>



            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">Notes</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">
                <div>
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text"
                    v-model="alerts[i].Notes"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>
              </div>
              <div class="clgo0 clg5 cmdo3 cmd6 csmo4 csm8 cxs12">
                <span
                  class="tag default highlight italics"
                  v-if="showDefaults"
                >{{ findDefault(alerts[i].Name).Notes }}</span>
              </div>
            </div>

          <div
            v-for="attribute in Object.keys(alerts[i].Metadata)"
            :key="`${alerts[i].Name}-${attribute}`"
          >

            <div class="row">
              <div class="clg2 cmd3 csm4 cxs12">
                <label class="bold">{{ attribute }}</label>
              </div>
              <div class="clg5 cmd6 csm8 cxs12">

                <div v-if="typeof alerts[i].Metadata[attribute] === 'string' && alerts[i].Metadata[attribute].length < lineLength">
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text"
                    v-model="alerts[i].Metadata[attribute]"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>

                <div v-else-if="typeof alerts[i].Metadata[attribute] === 'string' && alerts[i].Metadata[attribute].length >= lineLength">
                  <textarea
                    v-model="alerts[i].Metadata[attribute]"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  ></textarea>
                </div>

                <div v-else-if="typeof alerts[i].Metadata[attribute] === 'number'">
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="number"
                    v-model.number="alerts[i].Metadata[attribute]"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                    number
                  >
                </div>
                <!-- for handling input if field value is null is empty; otherwise input field won't be available -->
                <div v-else>
                  <!-- `@keydown.enter="$event.stopPropagation()"` for LastPass errors -->
                  <input
                    type="text"
                    v-model="alerts[i].Metadata[attribute]"
                    :disabled="isDisabled(alerts[i])"
                    @change="formUpdated('', i)"
                    @keydown.enter="$event.stopPropagation()"
                  >
                </div>

              </div>
              <div class="clgo0 clg5 cmdo3 cmd6 csmo4 csm8 cxs12">
                <span
                  class="tag default highlight italics"
                  v-if="showDefaults"
                >{{ findDefault(alerts[i].Name).Metadata[attribute] }}</span>
              </div>
            </div>

          </div>

          <br>
        </form>
      </div>

      <div
        class="controls right"
        v-if="filteredCount > 0"
      >
        <button
          class="button primary outline"
          @click="saveAll()"
        >
          <i class="fas fa-save"></i>
          Save All
        </button>
      </div>
    </div>

    <div v-else>
      <empty icon="fas fa-sliders-h">
        <div slot="title">Adjust Thresholds</div>
        <div slot="description">
          <p>
            Your resources are currently being monitored with safe, default settings.
            If you want to adjust certain thresholds, click to get started.
          </p>
          <br>
          <button
            class="button default outline"
            @click="setAlertsToDefault(type)"
          >
            <i class="fas fa-chevron-right"></i>
            Get Started
          </button>
        </div>
      </empty>
    </div>

    <!--
    Warning Modal
    -->
    <!-- <modal v-model="showModal">
      <h2>
        Warning!
      </h2>

      <p>
        You can break your alerting with these tools.   Only adjust if you know
        what you are doing.
      </p>
      <button class="button default outline right" @click="showModal = false">
        <i class="fas fa-check"></i>
        I Understand
      </button>
    </modal> -->

    <modal v-model="addThresholdModalEnabled">
      <AddCustomThreshold
        :modalEnabled="addThresholdModalEnabled"
        :integrationId="id"
        @addThresholdSucceeded="hideAddThresholdModal()" />
    </modal>

  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

Component.registerHooks(['beforeRouteLeave']);

import router from '@/router/router';
import API from '@/API';
import AddCustomThreshold from './alertsv2_add_threshold.vue';

@Component({
  components: {
    AddCustomThreshold,
  },
})
export default class IntegrationsThresholdsv2 extends Vue {
  /* Variables */
  @Prop()
  private id: string;

  @Prop()
  private definitionID: string;

  private filter: string = '';
  private showModal: boolean = false;
  private deleteConfirm: string = '';

  private alerts: Array<Thresholdv2<AnyThresholdsv2>> = [];
  private defaults: Array<Thresholdv2<AnyThresholdsv2>> = [];
  private templates: any = {};
  private showDefaults: boolean = false;
  private showDelete: boolean = false;
  /**
   * `formChanged` has three states:
   *   null           no changes detected
   *   ''             change detected but unsaved
   *   ${alertName}   what alert is saved and queued
   */
  private formChanged: string[] = [];
  private formVisible: boolean[] = [];
  private visibleCount: number;

  private integration: Integration<All>|undefined;

  private lineLength: number = 50;

  private addThresholdModalEnabled: boolean = false;

  // private validateStatus: string[] = [];
  // private validateDetails: string[] = [];

  /* Lifecycle */
  private created(): void {
    this.init();
  }


  /* Methods */
  // TODO: Likely remove org call in new thresholds
  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  get allAlertNames(): string[] {
    let alertNames: string[] = [];
    alertNames = this.defaults
      .map((alert: Thresholdv2<AnyThresholdsv2>) => alert.Name);

    return alertNames;
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

  get filteredAlerts(): boolean[] {
    const search = this.filter.toLowerCase();

    if (search) {
      this.formVisible = this.alerts.map((alert: any, index: number) => {
        const found = Object.keys(alert).some((key) => {
          let tmpsearch = search;
          /* condition so 'enabled' and 'disabled' can be used to filter the Enabled property */
          if (key === 'Enabled') {
            if (search === 'enabled') {
              tmpsearch = 'true';
            } else if (search === 'disabled') {
              tmpsearch = 'false';
            }
          }
          return String(alert[key]).toLowerCase().indexOf(tmpsearch) > -1;
        });

        if (found) {
          return true;
        }

        return Object.keys(alert.Metadata).some((key) => {
          return String(alert.Metadata[key]).toLowerCase().indexOf(search) > -1;
        });
      });
    } else {
      this.showAll();
    }
    return this.formVisible;
  }

  get type(): string {
    if (this.integration === undefined) {
      return '';
    }

    return this.integration.definition_id;
  }

  get iFriendlyName(): string {
    let meta: any;

    if (this.integration) {
      meta = this.integration.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.friendly_name;
  }

  private async init(): Promise<void> {
    this.formChanged = [];

    this.deleteConfirm = '';
    this.showDelete = false;

    this.integration = await API.Integration.getOne(this.id);

    if (this.integration === undefined) {
      return this.$router.push({name: 'Error Page'});
    }

    this.defaults = await API.Thresholdsv2.getDefaults(this.integration.definition_id);

    this.alerts = await API.Thresholdsv2.getAllAlerts(this.id);

    this.showAll();

  }

  private showAll() {
    this.formVisible = new Array(this.alerts.length).fill(true);
  }

  private filteredCount(): number {
    return this.formVisible.filter((item) => item).length;
  }

  private hideAddThresholdModal() {
    this.addThresholdModalEnabled = false;
    this.init();
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

  private indexTemplates(templates: ThresholdTemplate[] ) {
    const initialValue = {};
    return templates.reduce((obj, item) => {
      return {
        ...obj,
        [item.name]: item,
      };
    }, initialValue);

  }

  private resetChanges(): void {
    this.formChanged = new Array(this.defaults.length).fill(null);
  }

  private reset(index: number): void {
    const alert = this.alerts[index];
    /* Look up the default alert */
    const defaultAlert: any = this.defaults.find((element: any) => {
      return (
        element.Name === alert.Name
      );
    });

    const defaultCopy = JSON.parse(JSON.stringify(defaultAlert));
    defaultCopy.AlertID = this.alerts[index].AlertID;
    defaultCopy.IntegrationID = this.alerts[index].IntegrationID;

    this.$set(this.formChanged, index, '');
    this.$set(this.alerts, index, defaultCopy);
  }

  private formUpdated(name: string, index: number): void {
    this.$set(this.formChanged, index, name);
  }

  private async refreshValidationStatus(alertid: string|undefined, i: number): Promise<void> {
    const integrationid = this.id;

    if (typeof alertid !== 'undefined') {
      const result =  await API.Thresholdsv2.validateThreshold(integrationid, alertid);
      this.alerts[i].ValidationState = result.validationstate;
      this.alerts[i].ValidationDetails = result.validationdetails;
    }

    this.showAll();
  }

  private async validateThreshold(alertid: string|undefined, i: number): Promise<void> {
    const integrationid = this.id;

    if (typeof alertid !== 'undefined') {
      const result =  await API.Thresholdsv2.validateThreshold(integrationid, alertid);
      this.alerts[i].ValidationState = result.validationstate;
      this.alerts[i].ValidationDetails = result.validationdetails;
    }

  }

  private async save(alert: Thresholdv2<AnyThresholdsv2>, i: number): Promise<void> {
    const result =  await API.Thresholdsv2.saveBatch([alert]);
    this.alerts[i] = result[0];
    this.formUpdated(alert.Name, i);
  }

  private showDeleteBanner(show: boolean): void {
    this.showDelete = show;
  }

  private findDefault(name: string): Thresholdv2<AnyThresholdsv2> {
    const defaultAlert: any = this.defaults.find((element: any) => {
      return element.Name === name;
    });
    return defaultAlert;
  }

  private setAlertsToDefault(definition_id: string): void {
    this.alerts = this.defaults;
    const integrationID = this.id;

    // Set IntegrationID
    this.alerts = this.alerts.map((t) => {
      t.IntegrationID = integrationID;
      return t;
    });
    // Set formChange so help users not forget to save
    this.formChanged = new Array(this.defaults.length).fill('');
  }

  private async saveAll(): Promise<void> {
    this. alerts = await API.Thresholdsv2.saveBatch(this.alerts);
    this.resetChanges();
  }
  private deleteAll(): void {
    if (this.deleteConfirm === API.Organization_v2.getCurrentName()) {
      API.Thresholdsv2.deleteAll(this.alerts)
        .then(() => this.init());
        // .then(() => this.getDefaults());
    }
  }

  private isDisabled(alert: Thresholdv2<AnyThresholdsv2>): boolean {
    return !alert.Enabled;
  }

  private rowChanged(index: number): boolean {
    return this.formChanged[index] != null && this.formChanged[index] === '';
  }

  private rowSaved(index: number): boolean {
    return this.formChanged[index] != null && this.formChanged[index].length > 0;
  }

  private showAddThresholdModal() {
    this.addThresholdModalEnabled = true;
    this.$validator.reset();
  }

  private hideAddOrgModal() {
    this.addThresholdModalEnabled = false;
    // refresh list of thresholds
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

input,
textarea {
  margin: 0 0 0.35rem 0;
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

.red {
  color: red;
}

.green{
  color: green;
}

</style>

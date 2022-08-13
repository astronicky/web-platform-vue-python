<template>
  <div class="container">
    <h2>Add Threshold</h2>
    <br>
    <div class="row">
      <div class="container">
        <form @submit.prevent>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="type">Threshold Type</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    name="type"
                    maxlength="30"
                    v-model="threshold.Type"
                    disabled>
                </div>
            </div>

            <div class="row">
                <div class="csm3 cxs12">
                <label for="subject">Subject</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder="Subject"
                    name="subject"
                    maxlength="50"
                    v-model="threshold.Subject"
                    v-validate="'max:50'"
                    data-vv-as="'Subject'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('subject')">
                    {{ errors.first('subject') }}
                </banner>
                </div>
            </div>

            <div class="row">
                <div class="csm3 cxs12">
                <label for="notes">Notes</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder="Notes"
                    name="notes"
                    maxlength="100"
                    v-model="threshold.Notes"
                    v-validate="'max:100'"
                    data-vv-as="'Notes'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('notes')">
                    {{ errors.first('notes') }}
                </banner>
                </div>
            </div>

            <div class="row">
                <div class="csm3 cxs12">
                <label for="component">Component</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. instance_id'
                    name="component"
                    maxlength="50"
                    v-model="threshold.Component"
                    v-validate="'max:50'"
                    data-vv-as="'Component'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('component')">
                    {{ errors.first('component') }}
                </banner>
                </div>
            </div>

            <div class="row">
                <div class="csm3 cxs12">
                <label for="CritPeriodMap">CritPeriodMap</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. {"default": 30}'
                    name="CritPeriodMap"
                    maxlength="50"
                    v-model="threshold.CritPeriodMap"
                    v-validate="'max:50'"
                    data-vv-as="'CritPeriodMap'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('CritPeriodMap')">
                    {{ errors.first('CritPeriodMap') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="CritThreshMap">CritThreshMap</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. {"default": "value == 1"}'
                    name="CritThreshMap"
                    maxlength="50"
                    v-model="threshold.CritThreshMap"
                    v-validate="'max:50'"
                    data-vv-as="'CritThreshMap'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('CritThreshMap')">
                    {{ errors.first('CritThreshMap') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="ExclusionFilter">ExclusionFilter</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder=""
                    name="ExclusionFilter"
                    maxlength="50"
                    v-model="threshold.ExclusionFilter"
                    v-validate="'max:50'"
                    data-vv-as="'ExclusionFilter'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('ExclusionFilter')">
                    {{ errors.first('ExclusionFilter') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="Measurement">Measurement</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. cloudwatch_aws_es'
                    name="Measurement"
                    maxlength="50"
                    v-model="threshold.Measurement"
                    v-validate="'max:50'"
                    data-vv-as="'Measurement'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('Measurement')">
                    {{ errors.first('Measurement') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="MetricField">MetricField</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. read_iops_maximum'
                    name="MetricField"
                    maxlength="50"
                    v-model="threshold.MetricField"
                    v-validate="'max:50'"
                    data-vv-as="'MetricField'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('MetricField')">
                    {{ errors.first('MetricField') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="WarnPeriodMap">WarnPeriodMap</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. {"default": 30}'
                    name="WarnPeriodMap"
                    maxlength="50"
                    v-model="threshold.WarnPeriodMap"
                    v-validate="'max:50'"
                    data-vv-as="'WarnPeriodMap'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('WarnPeriodMap')">
                    {{ errors.first('WarnPeriodMap') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="WarnThreshMap">WarnThreshMap</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder='e.g. {"default": "value > 500"}'
                    name="WarnThreshMap"
                    maxlength="50"
                    v-model="threshold.WarnThreshMap"
                    v-validate="'max:50'"
                    data-vv-as="'WarnThreshMap'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('WarnThreshMap')">
                    {{ errors.first('WarnThreshMap') }}
                </banner>
                </div>
            </div>
            <div class="row">
                <div class="csm3 cxs12">
                <label for="WhitelistFilter">WhitelistFilter</label>
                </div>
                <div class="csm9 cxs12">
                <input
                    type="text"
                    placeholder=""
                    name="WhitelistFilter"
                    maxlength="50"
                    v-model="threshold.WhitelistFilter"
                    v-validate="'max:50'"
                    data-vv-as="'WhitelistFilter'">
                <p class="italics">
                </p>
                <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('WhitelistFilter')">
                    {{ errors.first('WhitelistFilter') }}
                </banner>
                </div>
            </div>

            <div class="row">
                <div class="csm4 cxs12">
                </div>
                <div class="csm8 cxs12">
                <div class="text-right">
                    <button class="button default outline" @click="closeModal()">
                    <i class="fas fa-ban"></i>
                    Cancel
                    </button>
                    &nbsp;
                    <button class="button success outline" @click="addCustomThreshold()" type="submit" :disabled="errors.any()">
                    <i class="fas fa-save"></i>
                    Save
                    </button>
                </div>
                </div>
            </div>
        </form>
      </div>
    </div>




  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
import Iam from '@/common/iam';
import API from '@/API';
import { subject } from '@casl/ability';
import Integration from '@/API/Integration';

@Component
export default class AddCustomThreshold extends Vue {
    /* Variables */
    @Prop()
    private integrationId: string;

    private threshold: CustomThreshold = {
    Type: 'alertsv2_regular', Subject: '', Notes: '',
    Component: '', CritPeriodMap: '', CritThreshMap: '',
    ExclusionFilter: '', Measurement: '', MetricField: '',
    WarnPeriodMap: '', WarnThreshMap: '', WhitelistFilter: '',
    };
    private alerts: Array<Thresholdv2<AnyThresholdsv2>> = [];
    private name: string = '';
    private description: string = '';
    private type: string = 'root';
    private valid: boolean = false;
    private currentUser: string = Iam.currentUser();
    private parentOpts: Array<{label: string, id: string, enabled: boolean}> = [];
    private industry: string = '';

    @Prop()
        private modalEnabled: boolean;
        /* Lifecycle */
        private async created(): Promise<void> {
        await this.init();
    }


    /* Methods */
    @Watch('modalEnabled')
        private reset(newID: string, oldID: string) {
        this.$validator.reset();
        this.init();
    }

    private init() {
        //
    }

    private async addCustomThreshold(): Promise<void> {
        this.alerts = [{
            IntegrationID: this.integrationId,
            Subject: this.threshold.Subject,
            Name: 'Custom Alert Threshold',
            Enabled: true,
            Notes: this.threshold.Notes,
            Type: this.threshold.Type,
            Metadata: {
                Component: this.threshold.Component,
                CritPeriodMap: this.threshold.CritPeriodMap,
                CritThreshMap: this.threshold.CritThreshMap,
                ExclusionFilter: this.threshold.ExclusionFilter,
                Measurement: this.threshold.Measurement,
                MetricField: this.threshold.MetricField,
                WarnPeriodMap: this.threshold.WarnPeriodMap,
                WarnThreshMap: this.threshold.WarnThreshMap,
                WhitelistFilter: this.threshold.WhitelistFilter,
            },
            ValidationState: '',
            ValidationDetails: '',
        }];

        const result = await this.$validator.validateAll();
        if (result) {
            let response;
            try {
            response = await API.Thresholdsv2.saveBatch(this.alerts);
            } catch (error) {
            API.UI.addNotification({
            type: 'danger',
            text: 'Custom threshold could not be added.',
            });
            throw new Error('Custom threshold could not be added.');
            }

            const organization = response.data;
            API.UI.addNotification({
            type: 'primary',
            text: `Custom threshold added successfully.`,
            });

            this.$validator.reset();
            this.$emit('addThresholdSucceeded');
            this.init();
        }
    }

    private closeModal() {
        this.$emit('addThresholdSucceeded');
    }

}
</script>

<style lang="scss" scoped>
  option:first {
    color: #999;
}

</style>
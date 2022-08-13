<template>
    <div class="container">
        <h1>New Policy</h1>
        <div class="row">
            <form @submit.prevent class="csm12">
                <div class="row">
                    <div class="csm3">
                    <label for="policy name">Policy Name</label>
                    </div>
                    <div class="csm9">
                    <input
                        type="text"
                        placeholder="Policy Name"
                        name="policy name"
                        v-model="policy.policy_name"
                        v-validate="'required'">
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('policy name')">
                            {{ errors.first('policy name') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                    <label for="description">Description</label>
                    </div>
                    <div class="csm9">
                        <textarea
                        name="description"
                        cols="30"
                        rows="4"
                        v-model="policy.policy_desc"
                        v-validate="'required'">
                        </textarea>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('description')">
                            {{ errors.first('description') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="service type">Service Type</label>
                    </div>
                    <div class="csm9">
                        <input
                        type="text"
                        placeholder="Service Type"
                        name="service type"
                        maxlength="50"
                        v-model="policy.service_type"
                        v-validate="'required'">
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('service type')">
                            {{ errors.first('service type') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="severity">Severity</label>
                    </div>
                    <div class="csm9">
                        <select
                            name="severity"
                            v-validate="'required'"
                            v-model="policy.severity">
                        <option v-for="(sev, index) in sevOption" :key=index
                            :value="sev" :selected="sev === policy.severity">
                            {{ sev }}
                        </option>
                        </select>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('severity')">
                            {{ errors.first('severity') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="category">Category</label>
                    </div>
                    <div class="csm9">
                        <select
                            name="category"
                            v-model="policy.Category"
                            v-validate="'required'">
                        <option v-for="(category, index) in categoryOption" :key=index
                            :value="category" :selected="category === policy.Category">
                            {{ category }}
                        </option>
                        </select>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('category')">
                            {{ errors.first('category') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="check">Check Exists?</label>
                    </div>
                    <div class="csm9">
                        <select
                            name="checkExists"
                            v-model="policy.check_nonexistent_resource"
                            v-validate="'required'">
                        <option v-for="(option, index) in booleanOption" :key=index
                        :value="option" :selected="option === policy.check_nonexistent_resource">
                        {{ option === 'true' ? 'Yes' : 'No' }}
                        </option>
                        </select>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('checkExists')">
                            {{ errors.first('checkExists') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="msg">Message</label>
                    </div>
                    <div class="csm9">
                        <textarea
                        placeholder="Message"
                        name="message"
                        v-model="policy.violation_msg"
                        cols="30" 
                        rows="5"
                        v-validate="'required'">
                        </textarea>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('message')">
                            {{ errors.first('message') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                        <label for="rule">Rule</label>
                    </div>
                    <div class="csm9">
                        <textarea
                        placeholder="Rule"
                        name="rule"
                        v-model="policy.metadata.rule"
                        cols="30" 
                        rows="10"
                        v-validate="'required'">
                        </textarea>
                        <banner
                            type="danger"
                            icon="fas fa-exclamation-triangle"
                            v-if="errors.has('rule')">
                            {{ errors.first('rule') }}
                        </banner>
                    </div>
                </div>

                <div class="row">
                    <div class="csm3">
                    </div>
                    <div class="csm9">
                    <div class="text-right">
                        <button class="button default outline large" @click="addPolicy()" type="submit" :disabled="errors.any()">
                        <i class="fas fa-save"></i>
                        Save
                        </button>
                    </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class PoliciesAdd extends Vue {
  /* Variables */
  private organizationID: string = API.Policy.getAdminOrgId();

  private booleanOption: string[] = API.Policy.getBooleanOption();

  private categoryOption: string[] = API.Policy.getCategoryOption();

  private sevOption: string[] = API.Policy.getSevOption();

  private policy: Policy|undefined = {
    organization_id: '',
    policy_id: '',
    policy_type: '',
    policy_name: '',
    policy_desc: '',
    violation_msg: '',
    service_type: '',
    severity: '',
    Category: '',
    check_nonexistent_resource: '',
    metadata: {
        query: '',
        rule: '',
    },
  };

  @Prop()
  private modalEnabled: boolean;

  private addPolicyModalEnabled: boolean = false;
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

  private async addPolicy(): Promise<void> {
    const result = await this.$validator.validateAll();
    if (result) {
        try {
        await API.Policy.createPolicy(this.policy!, this.organizationID).then((response) => {
            this.policy = {
                organization_id: '',
                policy_id: '',
                policy_type: '',
                policy_name: '',
                policy_desc: '',
                violation_msg: '',
                service_type: '',
                severity: '',
                Category: '',
                check_nonexistent_resource: '',
                metadata: {
                    query: '',
                    rule: '',
                },
            };
            this.$validator.reset();
            this.$emit('addPolicySucceeded');
        });
        } catch (err) {
        // throw error
        API.UI.addNotification({
            type: 'danger',
            text: `Policy "${this.policy?.policy_name}" cannot be added. Error: ` + err,
        });
        }
    }
  }

}
</script>

<style lang="scss" scoped>
  option:first {
    color: #999;
}

</style>
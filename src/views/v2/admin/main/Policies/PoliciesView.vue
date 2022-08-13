<template>
<keep-alive>
<div>
  <h1>Governance Policy Management</h1>
  <div class="csm10 cxs12">
      <div class="right">
        <router-link 
          :to="`/admin/policies`" class="button primary outline medium">
          BACK
        </router-link>
        &nbsp;
        <button @click="confirm(`${policy.policy_id}`)"
          class="button primary outline medium danger">
          DELETE
        </button>
      </div>

      <br/><br/><br/>

      <div>
          <form @submit.prevent>
            <div class="row">
              <div class="csm2">
                <label for="policy name">Name</label>
              </div>
              <div class="csm10">
                <input
                  type="text"
                  placeholder="Policy Name"
                  name="policy name"
                  v-validate="'required'"
                  v-model="policy.policy_name">
                  <banner
                      type="danger"
                      icon="fas fa-exclamation-triangle"
                      v-if="errors.has('policy name')">
                      {{ errors.first('policy name') }}
                  </banner>
              </div>
            </div>

            <div class="row">
              <div class="csm2">
                <label for="desc">Description</label>
              </div>
              <div class="csm10">
                <textarea name="description"
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
              <div class="csm2">
                <label for="service type">Service Type</label>
              </div>
              <div class="csm4">
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
              <div class="csm2">
                <label for="severity">Severity</label>
              </div>
              <div class="csm4">
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
              <div class="csm2">
                <label for="category">Category</label>
              </div>
              <div class="csm4">
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
              <div class="csm2">
                <label for="check">Check Exists?</label>
              </div>
              <div class="csm4">
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
              <div class="csm2">
                <label for="msg">Message</label>
              </div>
              <div class="csm10">
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
              <div class="csm2 cxs12">
                <label for="rule">Rule</label>
              </div>
              <div class="csm10">
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

            <div class="right">
              <button class="button primary outline large"
              @click="updatePolicy()">
                <i class="fas fa-save"></i>
                Save
              </button>
            </div>
          </form>
      </div>

  </div>

  <br/><br/>

  <!-- Confirmation Modal -->
  <modal v-model="showModal">
    <h2>
      Confirmation
    </h2>

    <p>
      Are you sure you want to delete this global policy?
    </p>
    <button class="button success outline left" @click="deletePolicy()" style="margin-right:10px">
      <i class="fas fa-check"></i>
      Yes
    </button>
    <button class="button default outline left" @click="showModal = false">
      <i class="fas fa-times"></i>
      No
    </button>
  </modal>
</div>

</keep-alive>
</template>


<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component({
  components: {
      //
  },
})
export default class PoliciesView extends Vue {
  private organizationID: string = API.Policy.getAdminOrgId();

  private booleanOption: string[] = API.Policy.getBooleanOption();

  private categoryOption: string[] = API.Policy.getCategoryOption();

  private sevOption: string[] = API.Policy.getSevOption();

  @Prop()
  private policyID: string;
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

  private showModal: boolean = false;

  private showError: boolean = false;

  private selectedPolicyId: string;

  @Watch('policyID')
  private refresh() {
    this.init();
  }

  // Lifecycle
  private created(): void {
    this.init();
  }

  private async init() {
    await API.Policy.getPolicy(this.organizationID, this.policyID).then((response) => {
          this.policy = response;
      });
  }

  private confirm(policyId) {
    // add prompt
    this.showModal = true;
    this.selectedPolicyId = policyId;
  }

  private async deletePolicy(): Promise<void> {
    // close modal
    this.showModal = false;
    await API.Policy.deletePolicy(this.organizationID, this.selectedPolicyId);
    router.push('/admin/policies');
  }

  private async updatePolicy() {
    const result = await this.$validator.validateAll();
    if (result) {
      try {
        await API.Policy.createPolicy(this.policy!, this.organizationID).then((response) => {
            this.policy = response;
        });
        this.$validator.reset();
      } catch (err) {
        // throw error
        API.UI.addNotification({
          type: 'danger',
          text: `Policy "${this.policy?.policy_name}" cannot be updated. Error: ` + err,
        });
      }
    }
  }

}

</script>

<style lang="scss" scoped>


.button.primary.outline.medium {
  margin-bottom: 5px;
  margin-top: 5px;
  padding-right: 1rem;

}

.button.primary.outline.small {
  margin-bottom: 5px;
  padding-right: 1rem;
  text-align: right;
}

banner {
  margin-bottom: 5px;
}

input[type="text"]:disabled {
  background: #ccc;
}

.parentlabel {
  font-size: 17px;
  // margin-top: .5rem;
}

.cxs24.clg {
  margin-top: .5rem;
}

@media (prefers-color-scheme: dark) {

  .button.primary.outline.medium {
  margin-bottom: 5px;
  margin-top: 5px;
  padding-right: 1rem;

}

.button.primary.outline.small {
  margin-bottom: 5px;
  padding-right: 1rem;
  text-align: right;
}

banner {
  margin-bottom: 5px;
}

input[type="text"]:disabled {
  background: #ccc;
}

.parentlabel {
  font-size: 17px;
  // margin-top: .5rem;
}

.cxs24.clg {
  margin-top: .5rem;
}

}

.alert-danger{
  width: 100%;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  margin-top: 10px;
  margin-bottom: 10px;
  padding:10px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 5px;;
}

</style>
<template>
  <div>
    <div>
      <h1>Governance Policies</h1>
    </div>
    <div class="clg10 csx10 cmd9">
    </div>
    <div class="csx10 cmd9 cxs10">
      <button
      @click="showAddPolicyModal()" class="button primary outline medium">
      Add Policy
      </button>
    </div>
    <br>

    <div class="cxs12 tree">
      <div class="row cxs14 tree-header">
          <div class="cxs5">
            Name
          </div>
          <div class="cxs3">
            Service Type
          </div>
          <div class="cxs2">
            Category
          </div>
          <div class="cxs2">
            Actions
          </div>
      </div>

      <div v-if="policies.length">
        <span v-for="policy in policies" :key="policy.id">
          <policies-tree
            :item=policy
            @deletePolicySucceeded="getPolicies()"
          >
          </policies-tree>
        </span>
      </div>
      <div class="pt-10" v-else>
          <h3 style='text-align: center'><i>No policies found.</i></h3>
      </div>
    </div>

    <modal v-model="addPolicyModalEnabled">
      <PoliciesAdd
        :modalEnabled="addPolicyModalEnabled"
        @addPolicySucceeded="hideAddPolicyModal()" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import PoliciesTree from './PoliciesTree.vue';
import PoliciesAdd from './PoliciesAdd.vue';

interface Route {
  title: string;
  link: string;
  icon: string;
  prod: boolean;
  role: string;
}

@Component({
  components: {
    PoliciesAdd,
    'policies-tree': PoliciesTree,
  },
})

export default class Policies extends Vue {
  private organizationID: string = API.Policy.getAdminOrgId();

  private policies: Policy[] = [];

  private addPolicyModalEnabled: boolean = false;

  private async created() {
    await this.getPolicies();
  }

  private async getPolicies(): Promise<void> {
    await API.Policy.getPolicy(this.organizationID).then((response) => {
          this.policies = response;
      });
  }

  // Add policy modal
  private showAddPolicyModal() {
    this.addPolicyModalEnabled = true;
    this.$validator.reset();
  }

  private hideAddPolicyModal() {
    this.addPolicyModalEnabled = false;
    this.getPolicies();
  }
}
</script>

<style lang="scss" scoped>

img {
  width: unset;
}

matrix {
  overflow-x: scroll;
}

.text-center {
  text-align: center;
}

.mt-10 {
  margin-top: 10px;
}

.pt-10 {
  padding-top: 10rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 767px) {
    display: block;
  }
}

.header-button {
  width: 200px;

  @media (max-width: 767px) {
    width: 100%;
    margin-bottom: 10px;
  }
}

hr.hr-style {
  content: '';
  display: block;
  position: relative;
  border-bottom: .16rem solid var(--c-primary-500);
  z-index: -1;
  margin: 0 0 1rem .2rem;
  border-top: 0rem;
}

</style>
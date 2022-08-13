<template>
  <div>
    <div class="cxs12 tree">
      <div class="row cxs12">
          <div class="item cxs12">
            <div class="cxs5">
              {{ item.policy_name }}
            </div>
            <div class="cxs3">
              {{ item.service_type }}
            </div>
            <div class="cxs2">
              {{ item.Category }}
            </div>
            <!-- Actions -->
            <div class="actions cxs2">
              <router-link 
                :to="`/admin/policies/${item.policy_id}`" class="button primary outline small">
                View
              </router-link>
              &nbsp;
              <button
                @click="confirm(`${item.organization_id}`, `${item.policy_id}`)" class="button primary outline small danger">
                Delete
              </button>
            </div>
          </div>
      </div>
      
      <!-- Confirmation Modal -->
      <modal v-model="showModal">
        <h2>
          Confirmation
        </h2>

        <p>
          Are you sure you want to delete this policy?
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component({name: 'policies-tree'})
export default class PoliciesTree extends Vue {
  @Prop()
  private item: any;

  private showModal: boolean = false;

  private selectedPolicyId: string;

  private selectedOrgId: string;

  private confirm(orgId, policyId) {
    // add prompt
    this.showModal = true;
    this.selectedPolicyId = policyId;
    this.selectedOrgId = orgId;
  }

  private async deletePolicy(): Promise<void> {
    // close modal
    this.showModal = false;
    await API.Policy.deletePolicy(this.selectedOrgId, this.selectedPolicyId);
    this.$emit('deletePolicySucceeded');
  }
}
</script>

<style lang="scss" scoped>

.item {
  display: flex;
  padding: 1rem 0.75rem;
  border-top: .1rem solid var(--c-gray-300);
  border-bottom: .1rem solid var(--c-gray-300);
  border-left: none;
  border-right: none;
  margin-bottom: -0.1rem;
  text-decoration: none;
  transition: var(--transition-short) all;
  font-size: 14px;
}

.item:hover {
  background: none;
  box-shadow: inset .4rem 0 0 var(--c-primary-500);
  cursor: pointer;
  transition: var(--transition-short) all;
}

.disabled > .name, .disabled > .description{
  opacity: 0.5;
}

.cxs12.tree .cxs12 {
   padding-left: 0 !important;
   padding-right: 0 !important;
}

</style>
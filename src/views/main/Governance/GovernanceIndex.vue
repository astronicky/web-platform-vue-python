<template>
    <div>
        <h1>Governance</h1>
        <div v-if="policiesMapArray.length">
            <div class="card card-style">
                <span v-for="(policyMap, index) in policiesMapArray" :key="index">
                     <div>
                        <span class="category-header"> {{policyMap.category}}</span>
                        <span class="controls right">
                            <button class="button default link medium btn" @click="policyMap.show = true" v-if="!policyMap.show">
                                <i class="fas fa-chevron-right medium"></i>
                            </button>
                            <button class="button default link medium" @click="policyMap.show = false" v-else>
                                <i class="fas fa-chevron-down medium"></i>
                            </button>    
                        </span>
                        <transition-group name="fade" tag="div"> 
                            <span v-for="(policy, index) in policyMap.policies" :key="index">
                                <span v-if="policyMap.show">
                                    <input :id="policy.policy_id" name="cb" type="checkbox" :checked="currentOrg == policy.organization_id"
                                        @click="checkPolicy($event.target.checked, policy)">
                                    <label :for="policy.policy_id">{{policy.policy_name}}</label>
                                </span>
                            </span>
                        </transition-group>
                        <hr class="default">
                        <br>  
                    </div>
                </span>
                <br>
                <br>
                <br>
                <div class="container">
                    <button @click="save()" class="button primary outline medium btn-save bold">
                    Save
                    </button>

                    &nbsp;
                    &nbsp;

                    <router-link to="/governance" class="button link default">
                    Cancel
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else>
            <p style='text-align: center'><i>No policies for this Organization</i></p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue } from 'vue-property-decorator';

import API from '@/API';
import Iam from '@/common/iam';

@Component
export default class GovernanceIndex extends Vue {
  /* Variables */
  private policies: Policy[] = [];
  private lengthPolicies: number;
  private policiesMap: PolicyMap[] = [];
  private tempPolicies: Policy[] = [];
  private orgPolicies: PolicyOrganization[] = [];
  private checkedPolicies: Policy[] = [];
  private uncheckedPolicies: Policy[] = [];
  private saveMessage: any[] = [];
  private deleteMessage: any[] = [];
  private categories: string[] = [];
  private policiesMapArray: any[] = [];
  private globalOrgId: string = '520a4dc6-4831-11ec-81d3-0242ac130003';

  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }
  /* Lifecycle */
  private created(): void {
    this.getOrgPolicies();
  }

  private async getOrgPolicies() {
      this.checkedPolicies = [];
      this.uncheckedPolicies = [];
      this.saveMessage = [];
      this.deleteMessage = [];
      this.categories = [];
      this.policiesMapArray = [];
      await API.OrganizationPolicy.getOrganizationPolicy(this.currentOrg).then((response) => {
          this.orgPolicies = response;
          this.getPolicies(this.globalOrgId);
      });
  }

  // convert organization policies into new array of object
  private convertNewArrayMap(policies: any) {
      this.categories.forEach((cat) => {
        this.tempPolicies = [];
        policies.forEach((policy) => {
            this.orgPolicies.forEach((orgPolicy) => {
                if ((orgPolicy.policy_id === policy.policy_id) && (orgPolicy.organization_id === this.currentOrg)) {
                    policy.organization_id = orgPolicy.organization_id;
                }
            });
            if (policy.Category === cat) {
                this.tempPolicies.push(policy);
            } else if (policy.Category === '' && cat === 'Uncategorized') {
                this.tempPolicies.push(policy);
            }
        });
        this.policiesMapArray.push({
            category: cat,
            policies: this.tempPolicies,
            show: true,
        });
      });
  }

  private async getPolicies(orgId: string) {
      await API.Policy.getPolicy(orgId)
      .then((response) => {
        if (orgId !== this.globalOrgId && response.length) {
            /* get the Checked Policies */
            const tempCheckPolicies = response.filter((item, index) => (
                (((item.policy_name === response[index].policy_name) && (item.organization_id !== this.globalOrgId)) ))
                );
            /* get the Unchecked Policies */
            const tempUncheckPolicies = response.filter((item, index) => (
                (((item.policy_name === response[index].policy_name) && (item.organization_id === this.globalOrgId)) ))
                );
            if (tempCheckPolicies.length > 0) {
                /* remove the duplicate policy */
                tempCheckPolicies.forEach((cPolicy) => {
                    this.policies.push(cPolicy);
                    tempUncheckPolicies.forEach((ucPolicy, index) => {
                        if (cPolicy.policy_name === ucPolicy.policy_name) {
                            tempUncheckPolicies.splice(index, 1);
                        }
                    });
                });
                tempUncheckPolicies.forEach((ucPolicy) => {
                    this.policies.push(ucPolicy);
                });
            } else {
                this.policies = response;
                this.orgPolicies.forEach( (el) => {
                    this.policies.forEach( (policy, index) => {
                        if (el.policy_id === policy.policy_id) {
                            this.policies[index].organization_id = el.organization_id;
                        }
                    });
                });
            }
        } else {
            this.policies = response;
        }
      });
      this.getCategories(this.policies);
      this.convertNewArrayMap(this.policies);
  }

  private async savePolicy(cPolicy: any, index: number) {
    await API.OrganizationPolicy.createOrganizationPolicy(cPolicy, this.currentOrg).then((response) => {
        this.saveMessage.push(response.status);
        if (index === this.checkedPolicies.length - 1) {
            this.updateSuccess(this.saveMessage, this.deleteMessage);
        }
        return response;
    });
  }

  private deletePolicy(ucPolicy: any, index: number) {
    API.OrganizationPolicy.deleteOrganizationPolicy(ucPolicy.organization_id, ucPolicy.policy_id).then((response) => {
        this.deleteMessage.push(response.status);
        if (index === this.uncheckedPolicies.length - 1) {
            this.updateSuccess(this.saveMessage, this.deleteMessage);
        }
        return response;
    });
  }

  // get the Categories
  private getCategories(policies: Policy[]) {
    policies.forEach((policy) => {
        if (policy.Category === '' && !this.categories.includes('Uncategorized')) {
            this.categories.push('Uncategorized');
        } else if (policy.Category !== '' && !this.categories.includes(policy.Category)) {
            this.categories.push(policy.Category);
        }
    });
    this.categories = this.categories.sort();
  }

  private checkPolicy(isCheck: boolean, policy: any) {
      if (isCheck) {
          this.checkedPolicies.push(policy);
          if (this.uncheckedPolicies.length > 0) {
              this.uncheckedPolicies.forEach((ucPolicy, index) => {
                if (ucPolicy.policy_id === policy.policy_id) {
                    this.uncheckedPolicies.splice(index, 1);
                }
              });
          }
      } else {
          this.uncheckedPolicies.push(policy);
          if (this.checkedPolicies.length > 0) {
            this.checkedPolicies.forEach((cPolicy, index) => {
                if (cPolicy.policy_id === policy.policy_id) {
                    this.checkedPolicies.splice(index, 1);
                }
            });
          }
      }
  }

  private updateSuccess(postStatus: any, deleteStatus: any) {
      if ((this.checkedPolicies.length > 0 && this.uncheckedPolicies.length > 0) && (postStatus.length > 0 && deleteStatus.length > 0)) {
          if (postStatus.includes(200) && deleteStatus.includes(200)) {
              API.UI.addNotification({
                type: 'primary',
                text: 'Successfully updated policies',
              });
          }
          postStatus.forEach( (el) => {
              if (el !== 200) {
                  API.UI.addNotification({
                    type: 'danger',
                    text: 'Could not create a policy due to an error.',
                  });
              }
          });
          deleteStatus.forEach( (el) => {
              if (el !== 200) {
                  API.UI.addNotification({
                    type: 'danger',
                    text: 'Could not delete a policy due to an error.',
                  });
              }
          });
      }
      if (((this.checkedPolicies.length > 0) && postStatus.length > 0)
            || (this.uncheckedPolicies.length) > 0 && (deleteStatus.length > 0)) {
          if (postStatus.includes(200) || deleteStatus.includes(200)) {
              API.UI.addNotification({
                type: 'primary',
                text: 'Successfully updated policies',
              });
          }
          if (postStatus.length) {
              postStatus.forEach( (el) => {
                if (el !== 200) {
                    API.UI.addNotification({
                        type: 'danger',
                        text: 'Could not create a policy due to an error.',
                    });
                }
              });
          }
          if (deleteStatus.length) {
              deleteStatus.forEach( (el) => {
                if (el !== 200) {
                    API.UI.addNotification({
                    type: 'danger',
                    text: 'Could not delete a policy due to an error.',
                    });
                }
              });
          }
      }
      this.getOrgPolicies();

  }

  private save() {
        if ((this.checkedPolicies.length > 0 && this.currentOrg !== this.globalOrgId) && (this.uncheckedPolicies.length > 0)) {
            this.checkedPolicies.forEach((cPolicy, index) => {
                if (cPolicy.organization_id === this.globalOrgId) {
                    this.savePolicy(cPolicy, index);
                }
            });
            this.uncheckedPolicies.forEach((ucPolicy, index) => {
                if (ucPolicy.organization_id === this.currentOrg) {
                    this.deletePolicy(ucPolicy, index);
                }
            });
        }

        /* to save a policy */
        if (this.checkedPolicies.length > 0 && this.currentOrg !== this.globalOrgId) {
            this.checkedPolicies.forEach((cPolicy, index) => {
                if (cPolicy.organization_id === this.globalOrgId) {
                    this.savePolicy(cPolicy, index);
                }
            });
        }
        /* to delete a policy */
        if (this.uncheckedPolicies.length > 0) {
            this.uncheckedPolicies.forEach((ucPolicy, index) => {
                if (ucPolicy.organization_id === this.currentOrg) {
                    this.deletePolicy(ucPolicy, index);
                }
            });
        }
  }
}
</script>

<style lang="scss" scoped>

.card-style {
    width: 70rem;
    border: 0;
}

.item-text div {
    line-height: 1.325;
    letter-spacing: .1rem;
    font-size: 3rem;
}

hr.hr-style {
    content: '';
    display: block;
    position: relative;
    border-bottom: .01rem solid var(--c-gray-900);
    z-index: -1;
    margin: 0 1rem 1rem .2rem;
    border-top: 2rem;
    padding: 0rem;
}

.btn {
    background-color: transparent;
    height: 3.5rem;
    width: 5rem;
    border: 0 0 0 0;
    position: relative;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

.container {  
    position: relative; 
}

.btn-save {  
    margin: 0;
    position: relative;
    width: 10rem;
}

.cb-texts {
  margin: 0 0 0 0;
  line-height: 1.325;
  letter-spacing: .1rem;
  word-spacing: .5rem;
  text-shadow: .2rem 0rem 0 var(--c-gray-100), -.2rem 0rem 0 var(--c-gray-100);
}

.category-header {
    font-size: 2rem;
    font-weight: bold;
}
</style>
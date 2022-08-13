<template>
  <div class="container settings">
    <h1>Settings</h1>

    <!-- <banner type="primary" icon="fas fa-gem" large>
      <p class="big bold">Your account would benefit from Pro!</p>
      <p>
        You could be monitoring more environments, with greater telemetry, and at
        increased savings.
      </p>
      <router-link to="/settings/billing" class="button primary">
        <i class="fas fa-arrow-right"></i>
        See Pro Plans
      </router-link>
    </banner>


    <h2>Plan</h2>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="account_tier">Plan Type</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <p class="bold uppercase">
          {{plan.plan_name}}
        </p>
      </div>
    </div>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="account_tier">Managed Service</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <p class="block">
          <span class="tag success outline uppercase">
            {{plan.managed_service}}
          </span>
          <span class="italics right">
            Since:
            {{ dateFormat(plan.managed_service_date )}}
          </span>
        </p>
      </div>
    </div>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="account_usage">Plan Usage</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <progressbar :maximum="plan.plan_maximum" :current="plan.plan_usage" type="primary medium" />
        <p>
          <span class="bold">
            {{plan.plan_usage}} of {{plan.plan_maximum}}
          </span>
          NOC responses.
        </p>
        <banner type="default" icon="fas fa-exclamation" v-if="planUsage > 0.7 && planUsage < 0.98">
          Approaching your plan limit.
        </banner>
        <banner type="danger" icon="fas fa-exclamation-triangle" v-if="planUsage >= 0.98">
          Plan limit reached!
        </banner>
      </div>
    </div>


    <br> -->

    <h2>Account</h2>

    <form v-on:submit.prevent="onSubmit">

      <div class="row">
        <div class="clg3 cmd4 csm5">
          <label for="contact_email">Name</label>
        </div>
        <div class="clg4 cmd6 csm7">
          <div class="bold uppercase">
            <input id="contact_name" type="text" :value="name" disabled>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="clg3 cmd4 csm5">
          <label for="contact_email">Contact Email</label>
        </div>
        <div class="clg4 cmd6 csm7">
          <div class="bold uppercase">
            <input id="contact_email" type="email" :value="email" autocomplete="contact_email" disabled>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="clg3 cmd4 csm5">
          <label for="user_password">Password</label>
        </div>
        <div class="clg4 cmd6 csm7">
          <div class="bold uppercase">
            <input id="user_password" type="password" value="***************" autocomplete="current-password" disabled>
            <!-- <button class="button default outline">
              <i class="fas fa-key"></i>
              Reset Password
            </button> -->
          </div>
        </div>
      </div>
    </form>

    <h2>Links</h2>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label>Privacy Policy</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <div>
          <a href="https://cascadeo.io/privacy" class="button primary link" target="_blank">https://cascadeo.io/privacy</a>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label>Terms of Service</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <div>
          <a href="https://cascadeo.io/terms" class="button primary link" target="_blank">https://cascadeo.io/terms</a>
        </div>
      </div>
    </div>

    <!-- <br>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label>Close Account</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <div class="bold">
          <p>
            Close and disconnect all account information.
            <span class="bold underline">
              This process is irreversible!
            </span>
          </p>
          <button class="button danger">
            <i class="fas fa-exclamation-triangle"></i>
            Close Account
          </button>
        </div>
      </div>
    </div>

    <br> -->

<!--
    <h2>Contact</h2>

    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="user_name">Name</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <input id="user_name" type="text" value="Uma Wiseheart">
      </div>
    </div>


    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="user_phone">Phone Number</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <input id="user_phone" type="tel" value="+1-866-963-8677">
      </div>
    </div>


    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="user_company">Company</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <input id="user_company" type="text" value="Nimbus Inc.">
      </div>
    </div>


    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="user_address">Address</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <input id="user_address" type="text" value="655 S Orcas St Suite #213, Seattle, WA 98108">
      </div>
    </div>


    <div class="row">
      <div class="clg3 cmd4 csm5">
        <label for="alert_email">Alert Email</label>
      </div>
      <div class="clg4 cmd6 csm7">
        <input id="alert_email" type="email" value="alert@nimbus.io">
        <button class="button default outline">
          <i class="fas fa-save"></i>
          Update Info
        </button>
      </div>
    </div>

    <br> -->

  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import API from '@/API';
import { format } from 'date-fns';

// import ProgressBar from '@/components/ProgressBar.vue';

@Component
export default class Settings extends Vue {
  /* Variables */
  // private plan: any = {
  //   plan_name: 'Basic',
  //   managed_service: 'Active',
  //   managed_service_date: 'Mon Jan 07 2018 14:41:15 GMT-0800 (Pacific Standard Time)',
  //   trial: true,
  //   plan_maximum: 50,
  //   plan_usage: 45,
  // };

  private name: string = API.User.getUsername();
  private email: string = API.User.getUserEmail();

  /* Lifecycle */

  /* Methods */
  private dateFormat(updated: string): string { return format(updated, 'MMM D, YYYY'); }
  // get planUsage(): number {
  //   return this.plan.plan_usage / this.plan.plan_maximum;
  // }
}

</script>

<style lang="scss" scoped>
</style>
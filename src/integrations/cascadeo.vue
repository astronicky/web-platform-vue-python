<template>
  <tabs
  :list="true"
  :tabNav="false"
  :selected="tabIndex">
    <tab name="Select">
      <div v-for="(input, index) in environments" :key="index">
        <div>
          <input
            :id="`radio-${index}`"
            name="radio-group"
            type="radio"
            :disabled="!input.enabled"
            :value="`radio-${input.service}`">
          <label :for="`radio-${index}`">{{ input.service }}</label>
        </div>
      </div>
      <div class="text-right">
        <button class="button default outline" @click="gotoTab(1)">Next: Access</button>
      </div>
    </tab>
    <tab name="Access">
      <ol>
        <li>
          Log into your AWS account.
        </li>
        <li>
          Navigate to <span class="italics">IAM > Roles</span> and click <span class="bold">Create Role</span>.
        </li>
        <li>
          Select <span class="bold">Another AWS Account</span> and
          add <span class="tag default outline">111222333444</span>
          to the <span class="italics">Account ID</span>.
        </li>
        <li>
          Check <span class="italics">Require external ID</span> and add
          <span class="tag default outline">BMLTYNVZMTIZ</span> and click
          <span class="bold">Next: Permissions</span>.
        </li>
        <li>
          Click <span class="bold">Create Policy</span> and then
          <span class="bold">JSON</span>.
          Paste the following policy:
          <div class="code">
            <pre>
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*"
      ],
      "Resource": "*"
    }
  ]
}</pre>
          </div>
        </li>
        <li>
          Set the <span class="italics">Name</span> to
          <span class="tag default outline">CascadeoCMI</span> and click
          <span class="bold">Create Policy</span>
        </li>
        <li>
          Continue by adding the newly created <span class="tag default outline">CascadeoCMI</span>
          policy to the role. Note: you may need to click <span class="bold"><i class="fas fa-sync"></i> Refresh</span>
          Click <span class="bold">Review</span>
        </li>
        <li>
          Add <span class="tag default outline">CascadeoPlatform</span> to
          <span class="italics">Role name</span> and click <span class="bold">Create role</span>.
        </li>
      </ol>
      <div class="text-right">
        <button class="button default link" @click="gotoTab(0)">Back</button>
        &nbsp;
        <button class="button default outline" @click="gotoTab(2)">Next: Test</button>
      </div>        </tab>
    <tab name="Test">
      <p>Why we do it</p>
      <div class="text-right">
        <button class="button primary" @click="gotoTab(0)">Finish</button>
        <button class="button primary" @click="alert">Alert</button>
      </div>
    </tab>
  </tabs>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Integration extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private environments: object[] = [
    { service: 'Amazon Web Services', image: 'aws.png', enabled: true },
    { service: 'Google Cloud Platform', image: 'google.png', enabled: false },
    { service: 'Microsoft Azure', image: 'azure.png', enabled: false },
    { service: 'Equinix CloudExchange', image: 'equinix.png', enabled: false },
    { service: 'Semaphore Managed Network', image: 'semaphore.png', enabled: false },
    { service: 'Cisco Meraki', image: 'meraki.png', enabled: false },
    { service: 'CenturyLink Cloud', image: 'centurylink.png', enabled: false },
  ];

  /* Lifecycle */
  private gotoTab(tabNumber: number) { this.tabIndex = tabNumber; }
  private alert(): void { alert('alert'); }

  /* Methods */

}

</script>

<style lang="scss" scoped>
</style>

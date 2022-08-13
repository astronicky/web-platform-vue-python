<template>
  <div>
    <h1>Settings</h1>

    <div class="row">
      <div class="clg8 cmd10 csm12 cxs12">
        <integration-info :id="'aws'" />

        <tabs
        :list="true"
        :tabNav="false"
        :selected="tabIndex">
          <tab name="Edit Settings">

            <h3>AWS CMI Information</h3>
            <p style="font-weight:400; font-size:13px">
              <i>Reminder:</i> Enabling a Collection Service now will make 
              it gather information after the integration's redeployment.
            </p>
            <br>
            <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
              <div class="row">
                <div class="csm6 cxs12">
                  <label for="awsAccountId">AWS Account ID</label>
                </div>
                <div class="csm6 cxs12" @click="notificationError('awsAccountId')">
                  <input
                    type="text"
                    name="awsAccountId"
                    title="The AWS Account ID cannot be edited."
                    disabled
                  >

                  <p class="italics">
                    Your AWS 12-digit account number.
                  </p>

                </div>
              </div>

              <div class="row">
                <div class="csm6 cxs12">
                  <label for="awsAccountId">AWS Account Alias</label>
                </div>
                <div class="csm6 cxs12" @click="notificationError('awsAccountName')">
                  <input
                    type="text"
                    name="awsAccountName"
                    title="The AWS Account Alias cannot be edited."
                    disabled
                  >

                  <p class="italics">
                    Your AWS account alias or friendly name.
                  </p>
                  <p style="font-weight:400; font-size:13px">
                    Edit your current AWS CMI 
                    Collection Tool settings below.
                  </p>

                </div>
              </div>

              <div class="row">
                <div class="csm6 cxs12">
                  <label for="cur_only">Cascadeo Monitoring Instance (CMI)</label>
                </div>
                <div class="csm6 cxs12">
                  <input 
                    type="radio" 
                    id="cur_only"
                    class="radio"
                    v-model="integration.metadata.billing_only"
                    v-bind:value="false"
                  >
                  <label for="cur_only" class="radio">Enabled</label>

                  <input 
                    type="radio"
                    id="cur_only2"
                    class="radio"
                    v-model="integration.metadata.billing_only"
                    v-bind:value="true"
                    onclick="document.getElementById('cur_only6').click()"
                  >
                  <label for="cur_only2" class="radio">Disabled</label>
                  <p class="italics">
                    Enables Usage Monitoring.
                  </p>

                </div>
              </div>

              <div class="row" v-if="integration.metadata.billing_only === false">
                <div class="csm6 cxs12" style="margin-bottom:1.3em">
                  <label for="cur_only7" style="font-weight:500; font-size:14px"><i>Also track Cost Explorer (CE) metrics?</i></label>
                </div>
                <div class="csm6 cxs12">
                  <input 
                    type="radio" 
                    id="cur_only5"
                    class="radio"
                    v-model="integration.metadata.ce_config.status"
                    v-bind:value="'enabled'"
                  >
                  <label for="cur_only5" style="font-size:14px" class="radio">Yes</label>

                  <input 
                    type="radio"
                    id="cur_only6"
                    class="radio"
                    v-model="integration.metadata.ce_config.status"
                    v-bind:value="'disabled'"
                  >
                  <label for="cur_only6" style="font-size:14px; margin-left:2.5em" class="radio">No</label>
                  <p class="italics" style="font-size:14px">
                    Boot up Cost Explorer (CE) collection resources.
                  </p>
                </div>
              </div>

              <div class="row" v-if="integration.metadata.ce_config.status === 'enabled' && integration.metadata.billing_only === false">
                <div class="csm6 cxs12">
                  <label for="ce_interval">Cost Explorer Polling Interval</label>
                </div>
                <div class="csm6 cxs12">
                  <input
                    type="text"
                    placeholder="Cost Explorer Polling Interval"
                    name="ce_interval"
                    v-model="integration.metadata.ce_config.interval"
                    v-validate="'required'"
                    data-vv-as="'Cost Explorer Polling Interval'"
                    >
                  <p class="italics">
                    Set your Cost Explorer's Polling Interval.
                  </p>

                </div>
              </div>

              <div class="row">
                <div class="csm6 cxs12">
                  <label class="bold">Globe Rocky II</label>
                </div>
                <div class="csm6 cxs12">
                  <input 
                    type="radio" 
                    id="cur_only3"
                    class="radio"
                    v-model="integration.metadata.cur_config.status"
                    v-bind:value="'enabled'"
                  >
                  <label for="cur_only3" class="radio" value="enabled">Enabled</label>

                  <input 
                    type="radio"
                    id="cur_only4"
                    class="radio"
                    name="rocky2Disabled"
                    v-model="integration.metadata.cur_config.status"
                    v-bind:value="'disabled'"
                  >
                  <label for="cur_only4" class="radio" value="disabled">Disabled</label>

                  <p class="italics">
                    CUR Collection for Globe Rocky II. Integrated with CSBM.
                  </p>

                  <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('step-1.rocky2Disabled')">
                    {{ errors.first('step-1.rocky2Disabled') }}
                  </banner>

                </div>
              </div>

              <div class="row" v-if="integration.metadata.cur_config.status === 'enabled'">
                <div class="csm6 cxs12">
                  <label for="s3_bucket">CUR S3 Bucket</label>
                </div>
                <div class="csm6 cxs12">
                  <input
                    type="text"
                    placeholder="CUR S3 Bucket"
                    name="s3_bucket"
                    v-model="integration.metadata.cur_config.s3_bucket"
                    v-validate="'required'"
                    data-vv-as="'CUR S3 Bucket'">

                  <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('step-1.s3_bucket')">
                    {{ errors.first('step-1.s3_bucket') }}
                  </banner>

                  <p class="italics">
                    Your CUR's Amazon S3 Bucket Region. <b>Important:</b> 
                    This must either deployed in the CMI's region OR the
                    CMI itself must be deployed in the bucket's region.
                  </p>

                </div>
              </div>

              <div class="row" v-if="integration.metadata.cur_config.status === 'enabled'">
                <div class="csm6 cxs12">
                  <label for="report_path_prefix">CUR Report Path Prefix</label>
                </div>
                <div class="csm6 cxs12">
                  <input
                    type="text"
                    placeholder="CUR Report Path Prefix"
                    name="report_path_prefix"
                    v-model="integration.metadata.cur_config.report_path_prefix"
                    v-validate="'required'"
                    data-vv-as="'CUR Report Path Prefix'">

                  <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('step-1.report_path_prefix')">
                    {{ errors.first('step-1.report_path_prefix') }}
                  </banner>

                  <p class="italics">
                  Your CUR Report Path Prefix.              
                  </p>

                </div>
              </div>

              <div 
                class="text-right" 
                v-if="integration.metadata.billing_only === false || 
                integration.metadata.cur_config.status === 'enabled'"
              >
                <button class="button default outline" type="submit" name="access">Next: Access</button>
              </div>
            </form>

          </tab>

          <tab name="Access">
            <h3>Edit Access</h3>
            <p>
              Edit your Amazon Web Service Integration's Access Policies.
            </p>
            <ol>
              <li>
                Navigate to <span class="italics">IAM > Roles</span> and search for your Role.
                The default role name of this integration is <copy class="tag primary highlight">{{ roleName }}</copy>.
              </li>
              <li>
                Select your role and search for the <copy class="tag primary highlight">cmi-management</copy> policy.
              </li>
              <li>
                Click the policy, and then Edit the policy through 
                the <span class="bold">Edit Policy</span> button. 
                You will then be redirected to another page.
              </li>
              <li>
                Select the JSON tab, replace all of it with 
                the following JSON policies below, and then 
                click <span class="bold">Review Policy</span>.
                <br>
                <div class="codeBlock" 
                  v-if="this.integration.metadata.billing_only === true && 
                  this.integration.metadata.cur_config.status === 'enabled' && 
                  this.integration.metadata.ce_config.status === 'disabled'"
                >
                  <button id="button" title="Copy JSON Policy" @click="copyFunction()" >
                      <i class="fas fa-copy"></i>
                  </button>
                  <pre id="jsonCode" class="tag primary highlight code">
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCMIPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:CreatePolicy",
        "iam:CreateRole",
        "iam:DeleteInstanceProfile",
        "iam:DeletePolicy",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListInstanceProfilesForRole",
        "iam:ListPolicyVersions",
        "iam:ListRolePolicies",
        "iam:TagPolicy",
        "iam:PassRole",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:TagRole",
        "lambda:AddPermission",
        "lambda:CreateFunction",
        "lambda:DeleteEventSourceMapping",
        "lambda:DeleteFunction",
        "lambda:GetEventSourceMapping",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:GetFunctionCodeSigningConfig",
        "lambda:GetFunctionEventInvokeConfig",
        "lambda:GetCodeSigningConfig",
        "lambda:GetPolicy",
        "lambda:ListEventSourceMappings",
        "lambda:ListVersionsByFunction",
        "lambda:RemovePermission",
        "s3:GetBucketLocation",
        "s3:GetBucketNotification",
        "s3:GetBucketWebsite",
        "s3:ListBucket",
        "s3:PutBucketNotification"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AWSCMILambdaPermissions",
      "Effect": "Allow",
      "Action": [
          "lambda:InvokeFunction",
          "lambda:UpdateFunctionConfiguration"
      ],
      "Resource": "arn:aws:lambda:*:{{ this.integration.metadata.account_id }}:function:curForwarder_*"
    }
  ]
} </pre>
                </div>
                <div
                  class="codeBlock" 
                  v-else-if="this.integration.metadata.billing_only === false && 
                  this.integration.metadata.cur_config.status === 'disabled'"   
                >
                  <button id="button" title="Copy JSON Policy" @click="copyFunction()">
                    <i class="fas fa-copy"></i>
                  </button>
                  <pre id="jsonCode" class="tag primary highlight code">
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCMIPermissions",
      "Effect": "Allow",
      "Action": [
        "ec2:AllocateAddress",
        "ec2:AssociateRouteTable",
        "ec2:AttachInternetGateway",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:CreateInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:CreateNetworkInterface",
        "ec2:CreateRoute",
        "ec2:CreateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:CreateSubnet",
        "ec2:CreateTags",
        "ec2:CreateVpc",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteNatGateway",
        "ec2:DeleteNetworkInterface",
        "ec2:DeleteRouteTable",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSubnet",
        "ec2:DeleteVpc",
        "ec2:Describe*",
        "ec2:DetachInternetGateway",
        "ec2:DetachNetworkInterface",
        "ec2:DisassociateRouteTable",
        "ec2:ModifyNetworkInterfaceAttribute",
        "ec2:ModifyVpcAttribute",
        "ec2:ReleaseAddress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:CreatePolicy",
        "iam:CreateRole",
        "iam:DeleteInstanceProfile",
        "iam:DeletePolicy",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListInstanceProfilesForRole",
        "iam:ListPolicyVersions",
        "iam:ListRolePolicies",
        "iam:TagPolicy",
        "iam:PassRole",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:TagRole",
        "s3:GetBucketLocation",
        "s3:GetBucketNotification",
        "s3:GetBucketWebsite",
        "s3:ListBucket",
        "s3:PutBucketNotification"
      ],
      "Resource": "*"
    }
  ]
} </pre>
                </div>
                <div v-else class="codeBlock">
                  <button id="button" title="Copy JSON Policy" @click="copyFunction()">
                    <i class="fas fa-copy"></i>
                  </button>
                  <pre class="tag primary highlight code" id="jsonCode">
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCMIPermissions",
      "Effect": "Allow",
      "Action": [
        "ec2:AllocateAddress",
        "ec2:AssociateRouteTable",
        "ec2:AttachInternetGateway",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:CreateInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:CreateNetworkInterface",
        "ec2:CreateRoute",
        "ec2:CreateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:CreateSubnet",
        "ec2:CreateTags",
        "ec2:CreateVpc",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteNatGateway",
        "ec2:DeleteNetworkInterface",
        "ec2:DeleteRouteTable",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSubnet",
        "ec2:DeleteVpc",
        "ec2:Describe*",
        "ec2:DetachInternetGateway",
        "ec2:DetachNetworkInterface",
        "ec2:DisassociateRouteTable",
        "ec2:ModifyNetworkInterfaceAttribute",
        "ec2:ModifyVpcAttribute",
        "ec2:ReleaseAddress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "iam:AddRoleToInstanceProfile",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:CreatePolicy",
        "iam:CreateRole",
        "iam:DeleteInstanceProfile",
        "iam:DeletePolicy",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListInstanceProfilesForRole",
        "iam:ListPolicyVersions",
        "iam:ListRolePolicies",
        "iam:TagPolicy",
        "iam:PassRole",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:TagRole",
        "lambda:AddPermission",
        "lambda:CreateFunction",
        "lambda:DeleteEventSourceMapping",
        "lambda:DeleteFunction",
        "lambda:GetEventSourceMapping",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:GetFunctionCodeSigningConfig",
        "lambda:GetFunctionEventInvokeConfig",
        "lambda:GetCodeSigningConfig",
        "lambda:GetPolicy",
        "lambda:ListEventSourceMappings",
        "lambda:ListVersionsByFunction",
        "lambda:RemovePermission",
        "s3:GetBucketLocation",
        "s3:GetBucketNotification",
        "s3:GetBucketWebsite",
        "s3:ListBucket",
        "s3:PutBucketNotification"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AWSCMILambdaPermissions",
      "Effect": "Allow",
      "Action": [
          "lambda:InvokeFunction",
          "lambda:UpdateFunctionConfiguration"
      ],
      "Resource": "arn:aws:lambda:*:{{ this.integration.metadata.account_id }}:function:curForwarder_*"
    }
  ]
} </pre>
                </div>
              </li>
              <li>
                Proceed and click the <span class="bold">Save changes</span> button to save your updated policy.
              </li>
            </ol>
            <div class="text-right">
              <button class="button default link" @click="gotoTab(0)">Back</button>
              &nbsp;
              <button class="button default outline" @click="gotoTab(2)" name="deploy">Next: Redeploy</button>
            </div>
          </tab>

          <tab name="Redeploy">
            <h3>Deploy Monitoring</h3>

            <p>
              We will be redeploying our own monitoring tool using EC2 called
              <span class="bold">Cascadeo Monitoring Instance (CMI)</span>
              into your environment. A re-deployment commonly takes up to ~5 minutes, but more time may be necessary for
              certain regions.
            </p>
            <p>
              A single <span class="bold">CMI</span> supports monitoring resources in
              <span class="italics">15 AWS regions</span> by default.
              <button class="button primary link" @click="showRegions = !showRegions">
                <i class="fas fa-info-circle"></i>
                Show regions
              </button>
            </p>
            <ul v-if="showRegions" class="bullet">
              <li>us-east-1 (N. Virginia)</li>
              <li>us-east-2 (Ohio)</li>
              <li>us-west-1 (N. California)</li>
              <li>us-west-2 (Oregon)</li>
              <!-- <li>ap-east-1 (Hong Kong)</li> -->
              <li>ap-south-1 (Mumbai)</li>
              <li>ap-northeast-1 (Tokyo)</li>
              <li>ap-northeast-2 (Seoul)</li>
              <li>ap-southeast-1 (Singapore)</li>
              <li>ap-southeast-2 (Sydney)</li>
              <li>ca-central-1 (Central)</li>
              <li>eu-central-1 (Frankfurt)</li>
              <li>eu-west-1 (Ireland)</li>
              <li>eu-west-2 (London)</li>
              <li>eu-west-3 (Paris)</li>
              <li>sa-east-1 (São Paulo)</li>
            </ul>
            <hr>
            <p v-if="!showRegionEdit">
              The <span class="bold">CMI</span> will be setup in
              <span class="tag default outline">us-east-1</span>
              by default.

              <button
                class="button primary link"
                @click="showRegionEdit = !showRegionEdit">
                <i class="fas fa-edit"></i>
                Change regions
              </button>
            </p>
            <p>
              The <span class="tag default outline">Save and Exit</span> button is only available if 
              the Integration is stopped. It allows you to deploy all changes, but it will not start 
              the integration. To do so, either click the <span class="tag default outline">Redeploy</span> 
              button to automatically save any changes and start the integration, or manually do so in the 
              Integrations Page by clicking the <span class="tag default outline">Start Integration</span> 
              button after saving and exiting.
            </p>

            <form @submit.prevent="step3('step-3')" data-vv-scope="step-3" class="info">

              <div class="row" v-if="showRegionEdit">
                <div class="cmd3 csm4 cxs12">
                  <label for="awsLocation">AWS Region</label>
                </div>
                <div class="cmd9 csm8 cxs12">

                  <select
                    v-model="integration.metadata.region"
                    name="awsLocation"
                    v-validate="'required'"
                    data-vv-as="'AWS Region'">
                    <option value="us-east-1">us-east-1 (N. Virginia)</option>
                    <option value="us-east-2">us-east-2 (Ohio)</option>
                    <option value="us-west-1">us-west-1 (N. California)</option>
                    <option value="us-west-2">us-west-2 (Oregon)</option>
                    <!-- <option value="ap-east-1">ap-east-1 (Hong Kong)</option> -->
                    <option value="ap-south-1">ap-south-1 (Mumbai)</option>
                    <option value="ap-northeast-1">ap-northeast-1 (Tokyo)</option>
                    <option value="ap-northeast-2">ap-northeast-2 (Seoul)</option>
                    <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                    <option value="ap-southeast-2">ap-southeast-2 (Sydney)</option>
                    <option value="ca-central-1">ca-central-1 (Central)</option>
                    <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                    <option value="eu-west-1">eu-west-1 (Ireland)</option>
                    <option value="eu-west-2">eu-west-2 (London)</option>
                    <option value="eu-west-3">eu-west-3 (Paris)</option>
                    <option value="sa-east-1">sa-east-1 (São Paulo)</option>
                  </select>

                  <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('step-3.awsLocation')">
                    {{ errors.first('step-3.awsLocation') }}
                  </banner>

                  <p class="italics">
                    The region you want the CMI to be deployed.
                  </p>

                </div>
              </div>

              <div class="text-right">
                <button class="button default link" type="button" @click="gotoTab(1)">Back</button>
                &nbsp;
                <button id="save" class="button default link" type="submit" @click="viewer(true)" name="viewer">Save and Exit</button>
                &nbsp;
                <button class="button primary outline" type="submit" name="finish">Redeploy</button>
              </div>
            </form>

          </tab>
        </tabs>

      </div>
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
import router from '@/router/router';
import API from '@/API';

@Component
export default class IntegrationsSettings extends Vue {
  /* Variables */

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }
  get roleName(): string { return `${this.currentOrg}-cmi-assume-role`; }

  private awsAccount = process.env.VUE_APP_CASCADEO_AWS;
  private externalId = process.env.VUE_APP_AWS_EXTERNAL_ID;
  private showRegions: boolean = false;
  private showRegionEdit: boolean = false;
  private tabIndex: number = 0;
  private integrationData: any;
  private integrationFound: boolean = false;
  private view: boolean = false;

  @Prop()
  private id: string;

  private integrations: Array<Integration<All>> = [];
//   private integration: Integration<AWS> = API.Integration.globeBilling.blank();

  /* Lifecycle */
  private integration: IntegrationData<AWS> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'aws',
    metadata: {
      friendly_name: '',
      account_id: '',
      region: '',
      billing_only: false,
      cur_config: {
        status: 'disabled',
        s3_bucket: 'curreport.' + this.currentOrg + '.cascadeo.io',
        report_path_prefix: '/',
      },
      ce_config: {
        status: 'disabled',
        interval: '12h',
        granularity: 'DAILY',
      },
    },
  };

  private status: string = 'Working';
  private pipelineId: string = '';

  private created(): void {
    this.init();
  }

  private async init(): Promise<void> {
    // this.view = undefined;
    this.integrationData = await API.Integration.getOne(this.id) as any;
    (document.querySelector('input[name="awsAccountId"]')as HTMLInputElement).value = this.iAccountId;
    (document.querySelector('input[name="awsAccountName"]')as HTMLInputElement).value = this.iFriendlyName;
    (document.querySelector('input[name="awsAccountName"]')as HTMLInputElement).value = this.iFriendlyName;

    this.integration.id = this.id;
    this.integration.metadata.friendly_name = this.iFriendlyName;
    this.integration.metadata.account_id = this.iAccountId;
    this.integration.metadata.region = this.integrationData.metadata.region;
    this.integration.metadata.billing_only = this.integrationData.metadata.billing_only;

    if (this.integrationData.metadata.cur_config !== undefined) {
      this.integration.metadata.cur_config = this.integrationData.metadata.cur_config;
    }

    if (this.integrationData.metadata.ce_config !== undefined) {
      this.integration.metadata.ce_config = this.integrationData.metadata.ce_config;
    }

    if (this.integrationData.state !== 'CMI_INTEGRATION_DOWN' &&
    this.integrationData.state !== 'INTEGRATION_STOPPED' &&
    this.integrationData.state !== 'CMI_INTEGRATION_READY' &&
    this.integrationData.state !== '') {
        const disabled = document.getElementById('save')!;
        disabled.setAttribute('disabled', '');
    }

  }

  /* Methods */
  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  /*
    The input has a maxlength of 14 to allow for the hypens in the
    account number for copy/paste
  */
  @Watch('integration.metadata.account_id')
  private onAccountChange(foo: string, newFoo: string) {
    /* Strips everything except for digits 0-9 */
    this.integration.metadata.account_id = this.integration.metadata.account_id
      .replace(/\D/g, '')
      .substring(0, 12);
  }

  get billingEnabled() {
    if (this.integration.metadata.billing_only === true) {
      return 'Enabled';
    }
  }

  get iFriendlyName(): string {
    let meta: any;

    if (this.integrationData) {
      meta = this.integrationData.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.friendly_name;
  }

  get iAccountId(): string {
    let meta: any;

    if (this.integrationData) {
      meta = this.integrationData.metadata;
    }

    if (meta === undefined) {
      return '';
    }

    return meta.account_id;
  }

  private viewer(status: boolean): void {
    if (status === true) {
      this.view = status;
    }
  }

  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }

  private async step3(scope: string): Promise<void> {
    const result = await this.$validator.validateAll(scope);
    const status = await API.Integration.status(this.integrationData);
    if (result) {
      if (this.integration.metadata.ce_config !== undefined &&
          this.integration.metadata.ce_config.status === 'disabled') {
        delete this.integration.metadata.ce_config;
      }

      if (this.integration.metadata.cur_config !== undefined &&
          this.integration.metadata.cur_config.status === 'disabled') {
        delete this.integration.metadata.cur_config;
      }
    }

    this.redeployFunction();

  }

  private copyFunction() {
    // Copies JSON code
    const copyText = document.getElementById('jsonCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

// Redeploy Function
  private async redeployFunction() {
    // tslint:disable: no-shadowed-variable
    this.status = '';
    /* eslint-disable global-require */
    const schedule = require('node-schedule');
    /* eslint-enable global-require */

    await API.Integration.status(this.integrationData).then((response: any) => {
      this.status = response;

      // Update and Add the Integration
      if (this.status === 'CMI_INTEGRATION_DOWN' ||
          this.status === 'INTEGRATION_STOPPED' ||
          this.status === 'CMI_INTEGRATION_READY' ||
          this.status === '') {
        API.Integration.update(this.integration).then((response: any) => {
          API.Integration.aws.add(this.integration);
          API.UI.addNotification({
            type: 'primary',
            text: 'AWS Integration Settings updated.',
            });
          router.replace('/integrations');
        });
        schedule.gracefulShutdown();

        // Restart process
      } else if (this.status === 'CMI_INTEGRATION_UP' || this.status === 'INTEGRATION_START_FAILED') {
          API.Integration.stop(this.integration).then((response: any) => {
            this.redeployFunction();
          }
        );

        // Recheck process
      } else {
          this.redeployChecker();
          API.UI.addNotification({
            type: 'primary',
            text: 'Integration Update in progress. This may take a while. Please do not leave this page. You will be redirected once the update has finished.',
          });
      }
    });
  }

  // Calls the redeployFunction every minute to check the Integration's Status.
  private redeployChecker() {
    API.UI.showSpin();
    /* eslint-disable global-require */
    const schedule = require('node-schedule');
    /* eslint-enable global-require */

    const startTime = new Date(Date.now());
    const endTime = new Date(startTime.getTime() + 60000);
    schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * *' }, () => {
      console.log('Checking AWS CMI Update Status...');
      this.redeployFunction();
    });
  }

  private notificationError(name: string): void {
    if (name === 'awsAccountId') {
      API.UI.addNotification({
        type: 'danger',
        text: 'The AWS Account ID cannot be edited. Please create a new integration with another AWS Account ID.',
        });
    } else {
      API.UI.addNotification({
        type: 'danger',
        text: 'The AWS Account Alias cannot be edited. Please create a new integration with another AWS Account Alias.',
        });
    }
  }

}

</script>

<style lang="scss" scoped>

  input[type=radio], .radio {
    display: inline;
    margin-top: .8em;
    position: relative;
    font-weight: 500;
    }
  
  .checkbox {
    margin-top: .5em;
    margin-bottom: .5em;
  }

  .codeBlock {
    display: inline-block;
    width: auto;
    position: relative;
  }

  .italics {
    font-weight: 400; 
    font-size: 14px;
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
    #button {
      position: absolute;
      right: 0px;
      background: transparent;
      border: none;
      .fa-copy {
        color: hsl(195, 69%, 82%);
      }
    }
    
    input[name=awsAccountId]::placeholder,
    input[name=awsAccountName]::placeholder {
        color: black;
    }

    #button:hover {
      background-color: hsl(192, 70%, 92%);
      .fa-copy {
        color: hsl(216, 65%, 22%);
      }
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
    #button {
      position: absolute;
      right: 0px;
      background: transparent;
      border: none;
      .fa-copy {
        color: hsl(208, 66%, 36%);
      }
    }
    #button:hover {
      background-color: hsl(208, 66%, 36%);
      .fa-copy {
        color: white;
      }
    }
  }

</style>

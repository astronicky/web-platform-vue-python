<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Account">

        <h3>AWS Account Information</h3>
        <br>

        <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsAccountId">AWS Account ID</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Account ID"
                name="awsAccountId"
                maxlength="14"
                v-model="integration.metadata.account_id"
                v-validate="'required|digits:12'"
                data-vv-as="'AWS Account ID'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.awsAccountId')">
                {{ errors.first('step-1.awsAccountId') }}
              </banner>

              <p class="italics">
                Your AWS 12-digit account number.
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsAccountId">AWS Account Alias</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Account Name"
                name="awsAccountName"
                v-model="integration.metadata.friendly_name"
                v-validate="'required|alpha_num'"
                data-vv-as="'AWS Account Name'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.awsAccountName')">
                {{ errors.first('step-1.awsAccountName') }}
              </banner>

              <p class="italics">
                Your AWS account alias or friendly name.
              </p>
              <p style="font-weight:500; font-size:14px">
                Please enable an option before
                continuing to the next step.
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
                Your existing Cost and Usage Report’s Amazon S3 Bucket. 
                <b>Important:</b> Please select the appropriate region 
                in relation to your CUR's S3 bucket on the next page.
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
                v-validate="'required|slash'"
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

          <div class="row" v-if="integration.metadata.cloudtrail_config.integration_id === ''">
            <div class="csm6 cxs12">
              <label class="bold">AWS Cloudtrail Logging</label>
            </div>
            <div class="csm6 cxs12">
              <input 
                type="radio" 
                id="ct_plugin1"
                class="radio"
                v-model="integration.metadata.cloudtrail_config.status"
                v-bind:value="'enabled'"
              >
              <label for="ct_plugin1" class="radio" value="enabled">Enabled</label>

              <input 
                type="radio"
                id="ct_plugin2"
                class="radio"
                name="ctDisabled"
                v-model="integration.metadata.cloudtrail_config.status"
                v-bind:value="'disabled'"
              >
              <label for="ct_plugin2" class="radio" value="disabled">Disabled</label>

              <p class="italics">
                Enable AWS Cloudtrail security audit and logging. 
                <b>NOTE:</b> This setting is not editable. Please modify the Cloudtrail integration created
              </p>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.ctDisabled')">
                {{ errors.first('step-1.ctDisabled') }}
              </banner>

            </div>
          </div>

          <div class="row" v-if="integration.metadata.cloudtrail_config.status === 'enabled' && integration.metadata.cloudtrail_config.integration_id === ''">
            <div class="csm6 cxs12">
              <label for="ct_friendlyname">Cloudtrail Friendly Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Cloudtrail Friendly Name"
                name="ct_friendlyname"
                v-model="ctintegration.metadata.friendly_name"
                v-validate="'required'"
                data-vv-as="'Cloudtrail Friendly Name'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.ct_friendlyname')">
                {{ errors.first('step-1.ct_friendlyname') }}
              </banner>

              <p class="italics">
                Friendly name for the Cloudtrail integration
              </p>

            </div>
          </div>

          <div class="row" v-if="integration.metadata.cloudtrail_config.status === 'enabled' && integration.metadata.cloudtrail_config.integration_id === ''">
            <div class="csm6 cxs12">
              <label for="retention_days">Cloudtrail Retention (Days)</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Cloudtrail Retention"
                name="retention_days"
                v-model="integration.metadata.cloudtrail_config.retention_days"
                v-validate="'required|numeric'"
                data-vv-as="'Cloudtrail Retention'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.retention_days')">
                {{ errors.first('step-1.retention_days') }}
              </banner>

              <p class="italics">
                Cloudtrail retention in days.
              </p>

            </div>
          </div>

          <div 
            class="text-right" 
            v-if="integration.metadata.billing_only === false || 
            integration.metadata.cur_config.status === 'enabled'"
          >
          <!-- <div class="text-right"> -->
            <!-- <button class="button default outline" @click="addIntegration()">Next: Access</button> -->
            <button class="button default outline" type="submit" name="access">Next: Access</button>
          </div>
        </form>

      </tab>

      <tab name="Access">
        <p style="font-weight:500; font-size:11px">
          Updated as of April 27, 2022. <br> <i>*Note: AWS may change their interface without prior notice.</i>
        </p>
        <h3>Allow Access</h3>
        <p>
          Log into the Amazon Web Services account you 
          want to add and follow the steps to grant access.
        </p>
        <ol>
          Step 1: <span class="bold">CREATE POLICY</span>
          <li>
            Navigate to IAM > Policies and click <span class="bold">Create Policy</span>.
            <br><br>
            <img src="@/assets/aws_step2_navigate_1.png" alt="Create Policy" style="width:700px;height:300px;">
            <br><br>
          </li>
          <li>
            Click <span class="bold">Create Policy > JSON</span>, 
            copy the following below and then click 
            <span class="bold">Review Policy</span>. 
            Paste the AWS permissions in the appropriate box.
            <br><br>
            <div class="codeBlock" 
              v-if="this.integration.metadata.billing_only === true && 
              this.integration.metadata.cur_config.status === 'enabled' && 
              this.integration.metadata.ce_config.status === 'disabled'"
            >
              <button id="button" @click="copyFunction('jsonCode')" >
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
            "Resource": "arn:aws:lambda:*:{{ awsAccount }}:function:curForwarder_*"
        }
    ]
}           </pre>
            </div>
            <div
              class="codeBlock" 
              v-else-if="this.integration.metadata.billing_only === false && 
              this.integration.metadata.cur_config.status === 'disabled'"   
            >
              <button @click="copyFunction('jsonCode')" id="button"
              >
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
}             </pre>
            </div>
            <div v-else class="codeBlock">
              <button @click="copyFunction('jsonCode')" id="button">
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
            "Resource": "arn:aws:lambda:*:{{ awsAccount }}:function:curForwarder_*"
        }
    ]
}           </pre>
          </div>
          <br><br>
          <img src="@/assets/aws_step2_navigate_2.png" alt="JSON Policy Box" style="width:700px;height:300px;">
          <br><br>
          <li>
            Proceed to <span class="bold">Next > Tags</span>.
          </li>
          <li>
            Proceed to <span class="bold">Next > Review</span>.
          </li>
          <li>
            Give the policy a <i>Name</i> called <copy class="tag primary highlight">cmi-management</copy>.
            Then scroll down and click <span class="bold">Create policy</span>.
          </li>
        </ol>
        <ol>
          Step 2: <span class="bold">CREATE ROLE</span>
          <li>
            Navigate to IAM > Roles and click <span class="bold">Create Role</span>.
          </li>
          <li>
            Select <span class="bold">Another AWS Account</span>. Add 
            <span class="tag primary highlight" id="accountId">
              {{ awsAccount }}
              <button id="accountId_button" @click="copyFunction('accountId')" >
                <i class="fas fa-copy"></i>
              </button>
            </span>
            to the Account ID.
          </li>
          <li>
            Check Require External ID and a new box will appear. Add 
            <copy class="tag primary highlight">{{ externalId }}</copy>
            to the External ID field and click <span class="bold">Next</span>.
            <br><br>
            <img src="@/assets/aws_step2_navigate_3.png" alt="External ID" style="width:700px;height:500px;">
            <br><br>
          </li>
          <li>
            Look for your previously created <span class="tag primary highlight">cmi-management</span> 
            policy and activate. Ensure that the policy is now enabled through the checkbox. 
            Click <span class="bold">Next</span>.
            <br><br>
            <img src="@/assets/aws_step2_navigate_4.png" alt="Enable policy" style="width:700px;height:300px;">
            <br><br>
          </li>
          <li>
            Enter Role Name <copy class="tag primary highlight">{{ roleName }}</copy>.
          </li>
          <li>
            Ensure that <span class="tag primary highlight">cmi-management</span> is included in the permissions.
            <br><br>
            <img src="@/assets/aws_step2_navigate_5.png" alt="cmi management" style="width:700px;height:500px;">
            <br><br>
          </li>
          <li>
            Click <span class="bold">Create Role</span>.
          </li>
        </ol>
        <div v-if="this.integration.metadata.cloudtrail_config.status === 'enabled'" class="text-right">
          <button class="button default link" @click="gotoTab(0)">Back</button>
          &nbsp;
          <button class="button default outline" @click="gotoTab(2)" name="cloudtrail access">Next: Cloudtrail Access</button>
        </div>
        <div v-else class="text-right">
          <button class="button default link" @click="gotoTab(0)">Back</button>
          &nbsp;
          <button class="button default outline" @click="gotoTab(3)" name="deploy">Next: Deploy</button>
        </div>
      </tab>

      <tab name="Cloudtrail Access">
        <h3>Allow Cloudtrail Access</h3>
        <p>
          Add the following policy and role to enable Cloudtrail audit/logging
        </p>
        <ol>
          <li>
            Navigate to <span class="italics">IAM > Roles</span> and click <span class="bold">Create Role</span>.
          </li>
          <li>
            Select <span class="bold">Another AWS Account</span> and
            add <copy class="tag primary highlight">{{ awsAccount }}</copy>
            to the <span class="italics">Account ID</span>.
          </li>
          <li>
            Check <span class="italics">Require external ID</span> and a new box will appear. Add
            <copy class="tag primary highlight">{{ externalId }}</copy> to
            <span class="italics">External ID</span> and click
            <span class="bold">Next: Permissions</span>.
          </li>
          <li>
            Click <span class="bold">Create Policy > JSON</span>, 
            copy the following below and then click 
            <span class="bold">Review Policy</span>. 
            Paste the AWS permissions in the appropriate box.
            <br>
            <div class="codeBlock" >
              <button id="button" @click="copyFunction('cloudtrailcode')" >
                  <i class="fas fa-copy"></i>
              </button>
              <pre id="cloudtrailcode" class="tag primary highlight code">
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudtrail:DescribeTrails",
                "cloudtrail:ListTags",
                "sts:GetCallerIdentity"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudtrail:CreateTrail",
                "cloudtrail:DeleteTrail",
                "cloudtrail:GetEventSelectors",
                "cloudtrail:GetTrailStatus",
                "cloudtrail:PutEventSelectors",
                "cloudtrail:StartLogging",
                "cloudtrail:AddTags",
                "cloudtrail:UpdateTrail"
            ],
            "Resource": [
                "arn:aws:cloudtrail:*:{{ this.integration.metadata.account_id }}:trail/platform-cloudtrail-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:ListInstanceProfilesForRole",
                "iam:ListRolePolicies",
                "iam:ListAttachedRolePolicies"
            ],
            "Resource": [
                "arn:aws:iam::{{ this.integration.metadata.account_id }}:role/cloudtrail-to-cloudwatch-*",
                "arn:aws:iam::{{ this.integration.metadata.account_id }}:role/{{ ctroleName }}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetPolicy",
                "iam:GetPolicyVersion"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:DeleteBucketPolicy",
                "s3:DeleteObject",
                "s3:DeleteObjectVersion",
                "s3:GetBucketLocation",
                "s3:GetBucketPolicy",
                "s3:GetAccelerateConfiguration",
                "s3:GetBucketAcl",
                "s3:GetBucketCORS",
                "s3:GetBucketLogging",
                "s3:GetBucketObjectLockConfiguration",
                "s3:GetBucketOwnershipControls",
                "s3:GetBucketRequestPayment",
                "s3:GetBucketTagging",
                "s3:GetBucketVersioning",
                "s3:GetBucketWebsite",
                "s3:GetEncryptionConfiguration",
                "s3:GetLifecycleConfiguration",
                "s3:GetMetricsConfiguration",
                "s3:GetObject",
                "s3:GetObjectTagging",
                "s3:GetObjectVersion",
                "s3:GetReplicationConfiguration",
                "s3:ListBucket",
                "s3:ListBucketVersions",
                "s3:PutBucketPolicy",
                "s3:PutBucketTagging",
                "s3:PutEncryptionConfiguration",
                "s3:PutObjectTagging",
                "s3:PutBucketVersioning",
                "s3:PutLifecycleConfiguration",
                "s3:GetLifecycleConfiguration"
            ],
            "Resource": [
                "arn:aws:s3:::platform-cloudtrail*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::platform-cloudtrail*/*"
            ]
        }
    ]
}           </pre>
            </div>
          </li>
          <li>
            Give the policy a <span class="italics">Name</span> called <copy class="tag primary highlight">platform-cloudtrail-policy</copy>
            and click <span class="bold">Create policy.</span>
          </li>
          <li>
            You may be in a different browser tab or window. Return back to the
            <span class="italics">Attach permissions policies</span> screen from step 3.
            Search for the <span class="italics">platform-cloudtrail-policy</span> policy you just created and
            click <span class="bold">Next: Tags</span>. Note: you may need click the refresh button.
          </li>
          <li>
            Ensure that <span class="tag primary highlight">platform-cloudtrail-policy</span> is included in the permissions.
          </li>
          <li>
            Set the <span class="italics">Role Name</span> to
            <copy class="tag primary highlight">{{ ctroleName }}</copy> and click
            <span class="bold">Create Role</span>.
          </li>
        </ol>
        <div class="text-right">
          <button class="button default link" @click="gotoTab(1)">Back</button>
          &nbsp;
          <button class="button default outline" @click="gotoTab(3)" name="deploy">Next: Deploy</button>
        </div>
      </tab>

      <tab name="Deploy">
        <h3>Deploy Monitoring</h3>

        <p>
          We will deploy our own monitoring tool using EC2 called
          <span class="bold">Cascadeo Monitoring Instance (CMI)</span>
          into your environment. Setup commonly takes ~5 minutes, but more time may be necessary for
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

        <form @submit.prevent="step3('step-3')" data-vv-scope="step-3">

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
            <button class="button primary outline" type="submit" name="finish">Finish and Deploy</button>
          </div>
        </form>

      </tab>

    </tabs>

  </div>

</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

@Component
export default class AWSIntegration extends Vue {
  /* Variables */

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }
  get roleName(): string { return `${this.currentOrg}-cmi-assume-role`; }
  get ctroleName(): string { return `${this.currentOrg}-platform-cloudtrail-role`; }

  private awsAccount = process.env.VUE_APP_CASCADEO_AWS;
  private externalId = process.env.VUE_APP_AWS_EXTERNAL_ID;
  private showRegions: boolean = false;
  private showRegionEdit: boolean = false;
  private tabIndex: number = 0;

  private id: string;
  private integrations: Array<Integration<All>> = [];

  private integration: IntegrationData<AWS> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'aws',
    metadata: {
      friendly_name: '',
      account_id: '',
      region: 'us-east-1',
      billing_only: false,
      cur_config: {
        status: 'disabled',
        s3_bucket: '',
        report_path_prefix: '/',
      },
      ce_config: {
        status: 'disabled',
        interval: '12h',
        granularity: 'DAILY',
      },
      cloudtrail_config: {
        status: 'disabled',
        retention_days: '365',
        integration_id: '',
      },
    },
  };

  private ctintegration: IntegrationData<Cloudtrail> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'cloudtrail',
    metadata: {
      friendly_name: '',
      account_id: '',
      region: 'us-east-1',
      retention_days: '365',
      trail_arn: '',
      integration_dependency: '',
      trail_status: '',
    },
  };

  private status: string = 'Working';
  private pipelineId: string = '';

  /* Lifecycle */

  private created(): void {
    this.$validator.extend('slash', {
      getMessage(value: any, field: any) {
        return value + ' should end with /';
      },
      validate(value: any, field: any) {
        /* Rules: ends with forward slash,*/
        const regex: RegExp = /\/$/;
        return (regex.test(value));
      },
    });

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

  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });

    // console.log('Billing only: ', this.integration.metadata.billing_only);
  }

  private async step3(scope: string): Promise<void> {
    const result = await this.$validator.validateAll(scope);
    if (result) {
        if (this.integration.metadata.ce_config !== undefined &&
            this.integration.metadata.ce_config.status === 'disabled') {
          delete this.integration.metadata.ce_config;
        }

        if (this.integration.metadata.cur_config !== undefined &&
            this.integration.metadata.cur_config.status === 'disabled') {
          delete this.integration.metadata.cur_config;
        }

        if (this.integration.metadata.cloudtrail_config !== undefined &&
            this.integration.metadata.cloudtrail_config.status === 'disabled') {

          delete this.integration.metadata.cloudtrail_config;
        }

        const addIntegrationResponse = await API.Integration.add(this.integration);
        this.integration.id = addIntegrationResponse.id;

        // TODO: move this to backend. make atomic with addIntegration
        await API.Integration.addClient(this.integration.id, 'aws');

        await API.Integration.aws.add(this.integration);

        // update the associated integration_id for Cloudtrail integration
        if (this.integration.metadata.cloudtrail_config !== undefined &&
            this.integration.metadata.cloudtrail_config.status === 'enabled') {
          await this.addCloudTrail();
          await this.updateAWSIntegration();
          await API.Integration.cloudtrail.add(this.ctintegration);
        }

        router.replace('/integrations');
    }
  }

  private async updateAWSIntegration() {
    if (this.integration.metadata.cloudtrail_config !== undefined) {
      this.integration.metadata.cloudtrail_config.integration_id = this.ctintegration.id;
    }

    await API.Integration.update(this.integration)
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async addCloudTrail() {
    this.ctintegration.metadata.account_id = this.integration.metadata.account_id;
    this.ctintegration.metadata.region = this.integration.metadata.region;
    this.ctintegration.metadata.integration_dependency = this.integration.id;

    if (this.integration.metadata.cloudtrail_config !== undefined) {
      this.ctintegration.metadata.retention_days = this.integration.metadata.cloudtrail_config.retention_days;
    }


    const ctIntegrationResponse = await API.Integration.add(this.ctintegration);
    this.ctintegration.id = ctIntegrationResponse.id;


    this.ctintegration.metadata.trail_arn = `arn:aws:cloudtrail:${this.ctintegration.metadata.region}:${this.ctintegration.metadata.account_id}:trail/platform-cloudtrail-${this.ctintegration.id}`;
    await API.Integration.update(this.ctintegration)
      .catch((error) => {
      throw new Error(error);
      });
  }


  private copyFunction(cblock: string) {
    // Copies JSON code
    const copyText = document.getElementById(cblock)!.textContent as any;
    const trimmedText = copyText.trim();
    navigator.clipboard.writeText(trimmedText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
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
    .accountId_button {
      right: 0px;
      background: transparent;
      border: none;
      .fa-copy {
        color: hsl(195, 69%, 82%);
      }
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
    .accountId_button {
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

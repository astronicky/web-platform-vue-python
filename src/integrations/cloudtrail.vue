<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Metadata">
        
        <h3>Cloudtrail Information</h3>
        <br>
        
        <form @submit.prevent="step1('step-1')" novalidate data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsAccountId">Cloudtrail AWS Account ID</label>
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
                Your AWS 12-digit account number where Cloudtrail is configured.
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsRegion">Cloudtrail AWS Region</label>
            </div>
            <div class="csm6 cxs12">
              <select
                v-model="integration.metadata.region"
                name="awsRegion"
                v-validate="'required'"
                data-vv-as="'AWS Region'"
              >
                <option disabled value="">Please select a region</option>
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-east-2">us-east-2 (Ohio)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
                <option value="ap-northeast-1 ">ap-northeast-1 (Tokyo)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                <option value="ap-southeast-2">ap-southeast-2 (Sydney)</option>
                <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                <option value="eu-west-1">eu-north-1 (Stockholm)</option>
              </select>

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.awsRegion')">
                {{ errors.first('step-1.awsRegion') }}
              </banner>

              <p class="italics">
                AWS Region where Cloudtrail is configured.
              </p>
            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="friendlyName">Friendly Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                name="friendlyName"
                placeholder="Friendly Name"
                data-vv-as="'Friendly Name'"
                v-model="integration.metadata.friendly_name"
                v-validate="'required'">

              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.friendlyName')">
                {{ errors.first('step-1.friendlyName') }}
              </banner>

              <p class="italics">
                Your Cloudtrail Integration alias, or friendly name (for easy identification in Platform UI).
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="retentionDays">Retention (Days)</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                name="retentionDays"
                placeholder="Retention (Days)"
                data-vv-as="'Retention (Days)'"
                v-model="integration.metadata.retention_days"
                v-validate="'required|numeric'">

              <banner 
                type="danger" 
                icon="fas fa-exclamation-triangle" 
                v-if="errors.has('step-1.retentionDays')">
                {{ errors.first('step-1.retentionDays') }}
              </banner>

              <p class="italics">
                Your Cloudtrail retention in days (default is 365 days).
              </p>

            </div>
          </div>

          <div class="text-right">
            <button class="button default outline" type="submit" name="access" @click="save()">Save and Next Steps</button>
          </div>
        </form>

      </tab>

      <tab name="Access">
        <h3>Allow Access</h3>
        <p>
          Log into the Amazon Web Services account you want to add and follow
          the steps to grant access.
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
            Click <span class="bold">Create Policy > JSON</span> and paste in the following AWS permissions
            and then click <span class="bold">Review Policy</span>:
            <br>
            <div class="codeBlock" >
              
              <pre id="jsonCode" class="tag primary highlight code">
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
                "arn:aws:iam::{{ this.integration.metadata.account_id }}:role/{{ roleName }}"
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
}             </pre>
              <button id="button" @click="copyFunction()" >
                  <i class="fas fa-copy"></i>
              </button>
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
            Leave the tags empty and click <span class="bold">Next: Review</span>
          </li>
          <li>
            Set the <span class="italics">Role Name</span> to
            <copy class="tag primary highlight">{{ roleName }}</copy> and click
            <span class="bold">Create Role</span>.
          </li>
        </ol>
        <div class="text-right">
          <button class="button primary outline" type="submit" name="finish" @click="deploy()">Deploy Cloudtrail</button>
        </div>
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';
import IntegrationsList from '@/views/main/Integrations/IntegrationsList.vue';
import ListAnimate from '@/views/misc/ListAnimate.vue';

@Component({
  components: {
    IntegrationsList,
    ListAnimate,
  },
})
export default class CloudtrailView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private integrationAll: Integration<All>;

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }
  get roleName(): string { return `${this.currentOrg}-platform-cloudtrail-role`; }

  @Prop()
  private editing: boolean;

  @Prop()
  private integrations: Array<Integration<All>>;

  private environment: string | undefined = process.env.VUE_APP_ENV;
  private awsAccount = process.env.VUE_APP_CASCADEO_AWS;
  private externalId = process.env.VUE_APP_AWS_EXTERNAL_ID;

  private manualdeploy = false;

  private integration: IntegrationData<Cloudtrail> = {
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

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.definition_id === 'cloudtrail') {
          this.integration.id = integration.id;
          this.integration.metadata = integration.metadata;
          this.integrationAll = integration;
        }
      }
    }
  }

  /* Methods */
  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }

  private save(): void {
    this.$validator.validateAll().then(async (result) => {
      if (this.integration.metadata.friendly_name === '' ) {
        return;
      }

      if (result) {
        if (this.editing) {
          await this.update();
        } else {
          await this.add(true);
        }
      }
    });
  }

  private async update() {
    try {
      // await API.Integration.remove(this.integrationAll, false);
      // await this.add(false);
      await API.Integration.update(this.integration);
      API.UI.addNotification({
        type: 'primary',
        text: 'Updated Cloudtrail integration.',
      });
    } catch (error) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error updating Cloudtrail Integration.',
        });
    }
  }

  private async add(notify: boolean) {
    await API.Integration.add(this.integration)
      .then((response) => {
        this.integration.id = response.id;
        this.integration.metadata.trail_arn = `arn:aws:cloudtrail:${this.integration.metadata.region}:${this.integration.metadata.account_id}:trail/platform-cloudtrail-${this.integration.id}`;
        if (notify) {
          API.UI.addNotification({
            type: 'primary',
            text: 'Added Cloudtrail Integration.',
          });
        }
      })
      .then(() => {
        API.Integration.update(this.integration);
      })
      .catch((error: any) => {
        throw new Error(error);
      });

  }
  private async deploy(): Promise<void> {

    await API.Integration.cloudtrail.add(this.integration)
      .then((response) => {
        API.UI.addNotification({
        type: 'primary',
        text: 'Enabling Cloudtrail Integration.',
        });
      })
      .catch((error: any) => {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error enabling Cloudtrail on account',
        });
      });

    // this.gotoTab(this.tabIndex + 1);
    this.finishSubmit();
  }

  private copyFunction() {
    // Copies JSON code
    const copyText = document.getElementById('jsonCode')!.textContent as any;
    navigator.clipboard.writeText(copyText);
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  private finishSubmit(): void {
    router.replace('/integrations');
  }
}

</script>

<style lang="scss" scoped>

  .env-select {
    margin-bottom: 1rem;

    label {
      display: flex;
      align-items: center;
      padding: 1rem .5rem;
    }

    .image {
      width: 5rem;
      display: inline-block;
      margin: 0 1.5rem 0 .5rem;
    }
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

  .codeBlock {
    display: inline-block;
    width: auto;
    position: relative;
  }

</style>

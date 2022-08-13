<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Metadata">
        
        <h3>DevOps Guru Information</h3>
        <br>
        
        <form @submit.prevent="step1('step-1')" novalidate data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsAccountId">DevOps Guru AWS Account ID</label>
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
                Your AWS 12-digit account number where DevOps Guru is configured.
              </p>

            </div>
          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="awsRegion">DevOps Guru AWS Region</label>
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
                AWS Region where DevOps Guru is configured.
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
                Your DevOpsGuru Integration alias, or friendly name (for easy identification in Platform UI).
              </p>

            </div>
          </div>

              <!-- :disabled="!integration.metadata.friendly_name"
          <div class="text-right">
            <button class="button primary outline" type="submit" @click="save()">Save</button>
          </div>

        </form>
      </tab> -->

          <div class="text-right">
            <!-- <button class="button default outline" @click="addIntegration()">Next: Access</button> -->
            <button class="button default outline" type="submit" name="snstopic" @click="save()">Save and Next Steps</button>
          </div>
        </form>

        <!-- <h3>Setting up DevOps Guru Manually</h3>
        <ol>
          <li>Open the DevOps Guru service page of the AWS region where you want it enabled</li>
          <li>You can choose to analyze/monitor all resources of that region or you can select "Choose Later" and specify the stacks to analyze</li>
          <li>Click the <b>Enable</b> button to activate DevOps Guru</li>
        </ol> -->
      </tab>

      <tab name="Access" v-if="autodeploy">
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
            <pre class="tag primary highlight code">
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DevOpsGuruPlatformPolicy",
            "Effect": "Allow",
            "Action": [
                "devops-guru:ListNotificationChannels",
                "cloudformation:ListStacks",
                "sns:Publish",
                "devops-guru:GetResourceCollection",
                "sns:DeleteTopic",
                "devops-guru:AddNotificationChannel",
                "sns:SetTopicAttributes",
                "sns:Subscribe",
                "sns:Unsubscribe",
                "devops-guru:RemoveNotificationChannel",
                "devops-guru:UpdateResourceCollection",
                "cloudformation:ListStackResources",
                "iam:CreateServiceLinkedRole",
                "iam:ListAttachedRolePolicies",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "sns:CreateTopic",
                "sns:AddPermission",
                "sns:RemovePermission",
                "sns:GetTopicAttributes",
                "sns:ConfirmSubscription",
                "sns:GetSubscriptionAttributes"
            ],
            "Resource": "*"
        }
    ]
} </pre>
          </li>
          <li>
            Give the policy a <span class="italics">Name</span> called <copy class="tag primary highlight">DevOpsGuruPlatformPolicy</copy>
            and click <span class="bold">Create policy.</span>
          </li>
          <li>
            You may be in a different browser tab or window. Return back to the
            <span class="italics">Attach permissions policies</span> screen from step 3.
            Search for the <span class="italics">DevOpsGuruPlatformPolicy</span> policy you just created and
            click <span class="bold">Next: Tags</span>. Note: you may need click the refresh button.
          </li>
          <li>
            Leave the tags empty and click <span class="bold">Next: Review</span>
          </li>
          <li>
            Set the <span class="italics">Role Name</span> to
            <b>{{ roleName }}</b> and click
            <span class="bold">Create Role</span>.
          </li>
        </ol>
        <div class="text-right">
          <button class="button primary outline" type="submit" name="deploynotes" @click="deploy()">Deploy and Continue</button>
        </div>
      </tab>

      <tab name="Deploynotes" v-if="autodeploy">

        <h3>Deploy Notes</h3>
        <p>
          Verify in your AWS account and region if DevOpsGuru has been enabled and that it has an associated SNS Subscription pointing 
          to this integration's endpoint.
        </p>
        <ol>
          <li>
            Go to the AWS DevOpsGuru service page. Make sure that you're in the appropriate region: {{ integration.metadata.region }}
          </li>
          <li>
            Go to DevOpsGuru <b>Settings</b>. Under the <b>DevOps Guru analysis coverage</b> section, check if the setting is <b>Analyze all ...</b>
          </li>
          <li>
            Still in the <b>Settings</b> page, check the SNS notifications section. Check if there's an associated SNS topic. 
            The expected topic ARN is: {{ integration.metadata.topic_arn }}
          </li>
          <li>Go the SNS service page and look for the SNS topic ARN associated with DevOpsGuru. Open the topic's page, and check the Subscription 
            associated with it.
          </li>
          <li>The subscription should be pointing to: <b>{{ urls.platform[environment] }}/devopsguru/{{ integration.id }}/events</b>. The subscription
          should also be confirmed
          </li>
        </ol>

        <h3>If Subscription Confirmation is Pending</h3>
        <p>
          If the SNS Subscription is still pending, follow the steps below:
        </p>
        <ol>
          <li>
            To receive the confirmation email, complete / finish this integration setup by click the <b>Finish</b> button
            below. If you don't have any output integration configured in your Platform.io account, create one first so 
            the confirmation email will be received. For example, create an Email integration and specify your email address 
          </li>
          <li>
            Go to Pipeline page. Create a new pipeline. In the Input side, select the DevOpsGuru integration that you just configured.
            In the Output side, select the Output integration (e.g. Email) that you've created. Save the changes
          </li>
          <li>
            Once the pipeline is available, go back to the SNS subscription page. Select the SNS subscription that's still Pending.
            Then click the <b>Request Confirmation</b> button. This will send a notification to your integration's endpoint. This will
            be received by the output integration added to the Pipeline.
          </li>
          <li>When you receive the Confirmation notification, click the Confirmation URL. This will confirm the SNS subscription. Go 
            back to the SNS subscription and check if it's activated.
          </li>
        </ol>
        <div class="text-right">
          <button class="button primary outline" type="submit" name="finish" @click="finishSubmit()">Finish</button>
        </div>
      </tab>

      <tab name="Snstopic" v-if="manualdeploy">
        
        <h3>SNS Topic/Subscription Configuration</h3>
        <p>
          An SNS Topic and Subscription endpoint needs to be created to send DevOpsGuru Insight events
          to the Cascadeo Platform environment. Part of the process is confirming the Subscription URL so
          please copy these steps, and click <b>Finish</b> as you'll need to create an email output and 
          pipeline to receive the Subscription Confirmation message.
        </p>
        <ol>
          <li>
            As mentioned a Subscription Confirmatioon message will be sent after creating the SNS confirmation.
            <ol>
              <ul class="bullet">
                <li>
                  To receive this, create en Email Output integration first. Configure it with your email details, and Save it
                </li>
                <li>
                  Then create a Pipeline. Select the DevOpsGuru integration that was created as Input and for the output 
                  select the Email integration. Save the pipeline. You can now receive the SNS subscription confirmation 
                  message and you can proceed with the SNS Subscription setup steps.
                </li>
              </ul>
            </ol>
          <li>
            Go to the DevOps Guru service page. Then go to <b>"Settings"</b>. Under <b>"Settings"</b> 
            click the <b>"Edit"</b> button found in the <b>"SNS Notifications"</b> section. This will open the 
            <b>"Setup notifications"</b> page.
          </li>
          <li>
            In the <b>"Setup notifications"</b> page, you can create or select the SNS topic to be used for the 
            DevOpsGuru Insights events. Create a new one. Use the name <b>"DevOpsGuruToPlatform"</b> for the topic.
            Save the changes.
          </li>
          <li>
            Go back to the <b>"Settings"</b> page and you should see the topic that was created or selected. Take 
            note of the <b>"Topic ARN"</b>.
          </li>
          <li>
            Go to the SNS service page. Then go to its <b>"Subscriptions"</b> page. Here, we will create the Subscription
            endpoint. Click the <b>"Create Subscription"</b> button. Fill up the following fields with the following information:
            <ol>
              <ul class="bullet">
                <li>
                  <b>Topic ARN</b> - Select the Topic ARN that was created for the DevOps Guru
                </li>
                <li>
                  <b>Protocol</b> - Select HTTPS
                </li>
                <li>
                  <b>Endpoint</b> - {{ urls.platform[environment] }}/devopsguru/{{ integration.id }}/events
                </li>
              </ul>
            </ol>
          </li>
          <li>
            Save the subscription.
            <!-- <ol>
              <ul class="bullet">
                <li>
                  <b>Subscription ARN</b>
                </li>
                <li>
                  <b>Subscription Name</b>
                </li>
                <li>
                  <b>Topic ARN</b>
                </li>
              </ul>
            </ol> -->
          </li>
        </ol>
        <div class="text-right">
          <button class="button primary outline" type="submit" name="finish" @click="finishSubmit()">Finish</button>
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
export default class DevOpsGuruView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private integrationAll: Integration<All>;

  get roleName(): string { return `PlatformDevOpsGuruRole-${this.integration.id}`; }

  @Prop()
  private editing: boolean;

  @Prop()
  private integrations: Array<Integration<All>>;

  private environment: string | undefined = process.env.VUE_APP_ENV;
  private awsAccount = process.env.VUE_APP_CASCADEO_AWS;
  private externalId = process.env.VUE_APP_AWS_EXTERNAL_ID;

  private autodeploy = false;
  private manualdeploy = false;

  private urls: { platform: { [demo: string]: string, production: string, staging: string, local: string} }  = {
    platform: {
      demo: 'https://platform.demo.cascadeo.io',
      production: 'https://platform.cascadeo.io',
      staging: 'https://platform.staging.cascadeo.io',
      local: 'https://platform.staging.cascadeo.io',
    },
  };

  private integration: IntegrationData<DevOpsGuru> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'devopsguru',
    metadata: {
      account_id: '',
      region: '',
      friendly_name: '',
      subscription_state: '',
      notification_id: '',
      topic_arn: '',
      subscription_arn: '',
      subscription_endpoint: '',
      config_exists: 'false',
    },
  };

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.definition_id === 'devopsguru') {
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
        text: 'Updated DevOps Guru integration.',
      });
    } catch (error) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error updating DevOps Guru Integration.',
        });
    }
  }

  private async add(notify: boolean) {
    API.Integration.add(this.integration)
      .then((response) => {
        // router.replace('/integrations');
        this.integration.id = response.id;
        let envVar: string = 'local';
        if (this.environment !== undefined) {
          envVar = this.environment;
        }
        const platformURL = this.urls.platform;
        this.integration.metadata.subscription_endpoint = platformURL[envVar] + '/devopsguru/' + this.integration.id + '/events';
        if (notify) {
          API.UI.addNotification({
            type: 'primary',
            text: 'Added DevOps Guru Integration.',
          });
        }
      })
      .then(() => {
        API.Integration.update(this.integration);
      })
      .catch((error: any) => {
        throw new Error(error);
      });

    this.autodeploy = true;
  }
  private async deploy(): Promise<void> {

    let isValid = false;
    isValid = await API.Integration.devopsguru.validate(this.integration.id);
    if (isValid === false) {
      API.UI.addNotification({
        type: 'danger',
        text: 'IAM Validation Failed. Check if required role and policy exists',
      });
      return;
    }

    await API.Integration.devopsguru.add(this.integration)
      .then((response) => {
        this.integration.metadata.subscription_arn = response.subscription_arn;
        this.integration.metadata.topic_arn = response.topic_arn;
        this.integration.metadata.notification_id = response.notification_id;
        this.integration.metadata.config_exists = response.configexist;
      })
      .then(() => {
        API.Integration.update(this.integration);
      })
      .catch((error: any) => {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error Deploying DevOps Guru Integration.',
        });
      });

    this.gotoTab(this.tabIndex + 1);
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
}

</style>

<template>
  <div>
    <div
      class="fullintegration"
      v-for="(integration, index) in integrations"
      :key="integration.id"
    >
      <div class="image">
        <service-image :id="integration.definition_id" />
      </div>
      <div class="data">
        <div class="title">
          <h3>
            <div>
              <span v-if="['globe_billing', 'inventory_mgmt'].includes(integration.definition_id)">
                <span v-if="integration.metadata.provider_type == 'Microsoft Azure'">
                  <img class="logo" src="@/assets/azure-logo.png" />
                </span>
                <span v-else-if="integration.metadata.provider_type == 'Amazon Web Services'">
                  <img class="logo" src="@/assets/aws-logo.png" />
                </span>
                <span v-else-if="integration.metadata.provider_type == 'Google Cloud Platform'">
                  <img class="logo-gcp" src="@/assets/gcp-logo.png" />
                </span>
                <span v-else-if="integration.metadata.provider_type != ''">
                  {{ integration.metadata.provider_type }}
                </span>
              </span>
            </div>
            <div>{{ integration.name }}</div>
          </h3>
          <div class="controls">
            <span v-if="isReportsSupported(integration)">
              <a
                :href="`integrations/reports/${integration.id}`"
                class="button default link small"
              >
                <i class="fas fa-newspaper"></i>
                Reports
              </a>
              &nbsp;
            </span>
            <span v-if="isDashboardSupported(integration)">
              <a
                :href="`integrations/dashboards/${integration.id}`"
                class="button default link small"
              >
                <i class="fas fa-chart-bar"></i>
                Dashboards
              </a>
              &nbsp;
            </span>
            <span v-if="isThresholdSupported(integration)">
              <a
                :href="`integrations/thresholds/${integration.metadata.threshold_evaluator}/${integration.id}`"
                :disabled="disabledAccess"
                class="button default link small"
              >
                <i class="fas fa-sliders-v-square"></i>
                Thresholds
              </a>
              &nbsp;
            </span>
            <span v-if="isGuideSupported(integration)">
              <span v-if="integration.metadata.provider_type === 'Amazon Web Services'">
                <a
                  href="https://eg-support-links.s3-ap-southeast-1.amazonaws.com/AWS+Customer+Guide.pdf"
                  target="_blank"
                  class="button default link small"
                >
                <i class="fas fa-file-alt"></i>
                AWS Guide
                </a>
                &nbsp;
              </span>
              <span v-else-if="integration.metadata.provider_type === 'Google Cloud Platform'">
                <a
                  href="https://eg-support-links.s3-ap-southeast-1.amazonaws.com/GCP+Customer+Guide.pdf"
                  target="_blank"
                  class="button default link small"
                >
                <i class="fas fa-file-alt"></i>
                GCP Guide
                </a>
                &nbsp;
              </span>
              <span v-else-if="integration.metadata.provider_type === 'Microsoft Azure'">
                <a
                  href="https://eg-support-links.s3-ap-southeast-1.amazonaws.com/Azure+Customer+Guide.pdf"
                  target="_blank"
                  class="button default link small"
                >
                <i class="fas fa-file-alt"></i>
                Azure Guide
                </a>
                &nbsp;
              </span>
            </span>
            <span v-if="isFeedbackSupported(integration)">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScx4ajc-pnIPAM_PoFk5PYd-NNg-TOtRq2oyIfW_ERf_-4S_A/viewform"
                target="_blank"
                class="button default link small"
              >
                <i class="fas fa-comment-alt-lines"></i>
                Feedback
              </a>
              &nbsp;
            </span>
            <span v-if="isMasterfileSupported(integration)">
              <a
                :href="`integrations/masterfile/${integration.id}`"
                class="button default link small"
              >
                <i class="fas fa-edit"></i>
                Masterfile Management
              </a>
              &nbsp;
            </span>
            <span v-if="integration.link">
              <a
                :href="integration.link"
                target="_blank"
                class="button default link small"
              >
                <i class="fas fa-external-link"></i>
                Log In
              </a>
              &nbsp;
            </span>

            <span v-if="isSettingsSupported(integration)">
              <span>
                <a
                  :href="`integrations/settings/${integration.id}`"
                  class="button default link small"
                >
                  <i class="fas fa-cog"></i>
                  Settings
                </a>
              &nbsp;
              </span>
            </span>

            <router-link
              class="button default link small"
              :to="{ path: `/integrations/edit/${integration.definition_id}/${integration.id}`}"
              :disabled="disabledAccess"
              v-if="integration.editable">
              <i class="fas fa-edit"></i>
              Edit
            </router-link>
            &nbsp;
            <button
              :data-cy="`delete-button-${integration.definition_id}`"
              class="button danger link small"
              @click="setDeleteBanners(index, true)"
              :disabled="disabledAccess"
              >
              <i class="fas fa-trash-alt"></i>
              Delete
            </button>
          </div>
        </div>

        <banner
          type="danger"
          icon="fas fa-exclamation-triangle"
          v-if="deleteBanners[index]"
        >
          <div class="text-left" v-if="['inventory_mgmt'].includes(integration.definition_id)">
              Are you sure you want to delete this integration?<br>Deleting this integration will get rid of all your existing inventory data and may not be recoverable.
          </div>
          <div class="text-left" v-else>
              Are you sure you want to delete this integration? You may still have active resources.
          </div>
          <div class="text-right">
            <button
              class="button danger link small"
              @click="setDeleteBanners(index, false)"
            >
              Cancel
            </button>
            &nbsp;
            <button
              :data-cy="`delete-button-confirm-${integration.definition_id}`"
              class="button danger small"
              @click="remove(index, integration)"
              :disabled="disabledAccess"
            >
              Delete
            </button>
          </div>
        </banner>

        <div class="row">
          <div class="csm4 cxs12 bold capitalize">Status</div>
          <p class="csm8 cxs12">
            <status
              v-model="statuses[index]"
              :integration="integration"
              icon
              text
              actions
            />
          </p>
        </div>

        <div class="row">
          <div class="csm4 cxs12 bold capitalize">Integration ID</div>
          <p class="csm8 cxs12">
            {{ integration.id }}
          </p>
        </div>
        <div class="row">
          <div class="csm4 cxs12 bold capitalize">Organization ID</div>
          <p class="csm8 cxs12">
            {{ integration.organization_id }}
          </p>
        </div>


        <div
          class="row"
          v-for="(meta, key, index) in integration.metadata"
          :key="`${key}-${index}`"
          >
          <div v-if="showMeta(key)" class="csm4 cxs12 bold capitalize">{{ key }}
                 </div>
            <div class="csm8 cxs12">
              <!-- Email type and email list -->
            <div
              v-if="
                integration.definition_id === 'email' &&
                  typeof meta === 'object'
              "
            >
              <p
                v-for="(email, emailIndex) in meta"
                :key="`email-${emailIndex}`"
              >
                {{ email }}
              </p>
            </div>
            <!-- Endpoint Type -->
            <div
              v-else-if="
                integration.definition_id === 'endpoint' &&
                  typeof meta === 'object'
              "
              >
              <div
                v-for="(endpoint, endpointIndex) in meta"
                :key="`endpoint-${endpointIndex}`"
                >
                <div class="ellipsis">
                  <span class="italics">
                    ({{ endpoint.check_interval }} min)
                  </span>
                <span class="ellipsis" :title="endpoint.name">
                  {{ endpoint.name }}
                                </span>
                </div>
                <p class="ellipsis">
                  <a :href="endpoint.url" :title="endpoint.url" target="_blank">
                    {{ endpoint.url }}
                  </a>
                </p>
                <p class="ellipsis" v-if="endpoint.port">
                  <span class="ellipsis" :title="endpoint.port">
                    {{ endpoint.port }}
                  </span>
                </p>
                <p class="ellipsis" v-if="endpoint.shouldcontain">
                  <span class="ellipsis" :title="endpoint.shouldcontain">
                    Should Contain: "{{ endpoint.shouldcontain }}"
                  </span>
                </p>
              </div>
            </div>
            <!-- cascadeo.io Type -->
            <div v-else-if="integration.definition_id === 'cascadeo_io'">
              <div v-if="meta === true">Enabled</div>
              <div v-else-if="meta === false">Disabled</div>
              <div v-else>{{ meta }}</div>
            </div>


            <!-- windows agent meta -->
            <div v-else-if="integration.definition_id === 'windows'">
              <div v-if="key === 'sqlserver'">
                  <div v-if="integration.metadata.sqlserver.server_port != ''">
                    {{ integration.metadata.sqlserver.friendly_name }}
                  </div>
                  <div v-else>None</div>
              </div>
              <div v-else-if="showMeta(key)">{{ meta }}</div>
              <div v-else></div>
            </div>

            <!-- linux agent meta -->
            <div v-else-if="integration.definition_id === 'linux'">
              <div v-if="key === 'tail'">
                  <div v-if="integration.metadata.tail.log.files.length != 0 || integration.metadata.tail.metric.files.length != 0">
                    {{ integration.metadata.tail.friendly_name }}
                  </div>
                  <div v-else>None</div>
              </div>
              <div v-else-if="showMeta(key)">{{ meta }}</div>
              <div v-else></div>
            </div>

            <!-- Other (meta) -->
            <p v-else-if="showMeta(key)">{{ meta }}</p>
          </div>
        </div>
        <div class="row">
          <div class="csm4 cxs12 bold capitalize">Type</div>
          <p class="csm8 cxs12 capitalize">
            {{ integration.definition_type }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';
import IAM from '@/common/iam';

@Component
export default class CurrentIntegrations extends Vue {
  /* Variables */
  @Prop()
  private integrations: Array<Integration<All>>;
  private id: string;

  private statuses: string[] = [];
  private deleteBanners: boolean[] = [];
  private disabledAccess: boolean = true;
  private organization: string = '';

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  @Watch('currentOrg')
  private orgChange() {
    this.checkAccess();
  }

  /* Lifecycle */
  private mounted(): void {
    this.deleteBanners = new Array(this.integrations.length).fill(false);
    this.statuses = new Array(this.integrations.length).fill('');
    this.checkAccess();
  }

  /* Methods */
  private checkAccess() {
    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      this.disabledAccess = !IAM.checkAuthz(['integration:write'], API.Organization_v2.getActive());
    } else {
      this.disabledAccess = !IAM.checkAuthz(['admin']);
    }
  }

  private setDeleteBanners(index: number, value: boolean): void {
    this.$set(this.deleteBanners, index, value);
  }

  private async remove(index: number, integration: any): Promise<void> {
    this.setDeleteBanners(index, false);
    const state = integration.state;

    if (integration.definition_id === 'aws' ||
    integration.definition_id === 'gcp' ||
    integration.definition_id === 'azure') {
      // This will stop integration first, and delete integration via step function (during post-validation)
      await API.Integration.stop(integration, true);
    } else {
      await API.Integration.remove(integration);
      this.$emit('deleteIntegration');
    }
  }

  private isCMI(integration: Integration<All>): boolean {
    const cmi = ['aws', 'gcp', 'netapp', 'azure', 'agent', 'zenoss', 'windows', 'sqlserver', 'linux'];
    return cmi.includes(integration.definition_id);
  }

  private showMeta(key: string): boolean {
    const keys = [ 'threshold_evaluator', 'billing_type', 'invoice_group_id', 'provider_type', 'subscription_name', 'notification_id'];
    return !keys.includes(key);
  }

  private isThresholdSupported(integration: Integration<All>): boolean {
    const supported = ['aws', 'gcp', 'netapp', 'azure', 'agent', 'zenoss', 'globe_billing', 'windows', 'sqlserver', 'linux', 'logmanagement'];
    return supported.includes(integration.definition_id);
  }

  private isReportsSupported(integration: Integration<All>): boolean {
    // TODO: add report_supported field to integration definition
    const supported = ['globe_billing'];
    return supported.includes(integration.definition_id);
  }

  private isDashboardSupported(integration: Integration<All>): boolean {
    // TODO: add report_supported field to integration definition
    const supported = ['globe_billing'];
    return supported.includes(integration.definition_id);
  }

  private isFeedbackSupported(integration: Integration<All>): boolean {
    const supported = ['globe_billing'];
    return supported.includes(integration.definition_id);
  }

  private isGuideSupported(integration: Integration<All>): boolean {
    // TODO: separate AWS, GCP, and Azure Integration User Guides
    const supported = ['globe_billing'];
    return supported.includes(integration.definition_id);
  }

  private isMasterfileSupported(integration: Integration<All>): boolean {
    const supported = ['globe_billing'];

    // TODO: remove hardcoded orgs; need to determine which root org needed via API/IAM.ts

    const orgID = API.Organization_v2.getCurrentId();
    if (
      orgID === 'regression-tp' ||
      orgID === 'a81893a0-f820-4b5e-aed4-d568c9887a26' || // aboitizgroupcompany
      orgID === 'mpa-bills2021' ||
      orgID === '3e00137f-e8e5-47c4-8aef-4c82d3a6780d' ||
      orgID === 'smoke-test' ||
      orgID === '0127a29a-ad52-4071-8e48-8c9ea2b742c1' ||
      orgID === 'a3e3ac40-d9f0-4b4d-85e5-7c7393ba7adc') {
      return supported.includes(integration.definition_id);
    }

    return false;
  }

  private isSettingsSupported(integration: Integration<All>): boolean {
    const supported = ['aws'];
    return supported.includes(integration.definition_id);
  }

}
</script>

<style lang="scss" scoped>
.text-right {
  text-align: right;
  float:right;
}
.text-left {
  text-align: left;
  display: inline-block;
}

.button.default[disabled] {
  border: none;
}

.fullintegration {
  display: flex;
  border-top: 0.1rem solid var(--c-gray-400);
  border-bottom: 0.1rem solid var(--c-gray-400);
  margin-bottom: -0.1rem;
  padding: 1rem 0 1.5rem 0;
  position: relative;

  .image {
    flex: 0 0 10rem;
    padding: 1rem 2rem 1rem 1rem;
  }

  .data {
    flex: 1;
    min-width: 0;
  }

  .title {
    display: flex;
    margin-bottom: 1rem;

    h3 {
      flex: 1;
      margin: 0 0 1rem 0;
    }
  }

  .controls {
    text-align: right;
    margin-bottom: 1rem;
  }

  .row p {
    margin: 0;
    line-height: 1.75;
  }

  .ath {
    text-align: left;
    margin-left: 5em;
  }
  .logo {
    height: 40px;
    object-fit: contain;
    width: 100px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .logo-gcp {
    height: 40px;
    object-fit: contain;
    width: 120px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

// .linked:before,
// .linked:after {
//   content: '\f0c1';
//   position: absolute;
//   height: 0rem;
//   width: 0rem;
//   top: -0.35rem;
//   left: 33%;
//   font-family: 'Font Awesome 5 Solid';
//   font-weight: 900;
//   font-size: 2rem;
//   color: var(--c-gray-400);
//   text-shadow: .35rem 0rem 0 var(--c-gray-100), -.35rem 0rem 0 var(--c-gray-100);
//   transform: rotate(-45deg);
// }

// .linked:after {
//   left: 66%;
// }

@media (max-width: 650px) {
  .fullintegration {
    flex-direction: column;

    .image {
      width: 10rem;
      margin: 1rem auto;
      padding: 1rem;
    }

    .title {
      flex-direction: column;
      text-align: center;
    }
    .controls {
      text-align: center;
    }
  }
}
</style>

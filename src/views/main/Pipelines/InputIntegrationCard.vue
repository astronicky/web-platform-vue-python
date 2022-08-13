<template>
  <div>
    <div class="card card-style">
      <div class="card card-style left card-image-style"><service-image :id="integration.definition_id" class="logo" /></div>
      <input-status :integration="integration" v-if="isComplex" />
      <span class = "left">
        <div class="title bold">  
            <span :title="`Status: ${statusCheck}`">
                <i class="fas" :class="statusIcon"></i> 
                <span :data-cy="`input-status-${integration.definition_id}`" @click="checkStatus()" v-if="hasText" class="uppercase">
                    &nbsp;{{ statusCheck }}
                </span>
                <span v-if=" integration.definition_id === 'endpoint'">
                    <a
                    :disabled="disabledAccess"
                    class="button default link small"
                    @click="toggleEndpointPauseStatus(true)"
                    title="Pause Endpoint Collection"
                    v-if="!endpointPaused"
                        >
                        <i class="fas fa-pause"></i>
                    </a>
                    <a
                    :disabled="disabledAccess"
                    class="button default link small"
                    @click="toggleEndpointPauseStatus(false)"
                    title="Resume Endpoint Collection"
                    v-if="endpointPaused"
                    >
                    <i class="fas fa-play"></i>
                    </a>
                </span> 
            </span>
          <span v-if="integration.definition_id === 'globe_billing'">
             <span v-if="integration.metadata.provider_type != ''">
              {{ integration.metadata.provider_type }}
             </span>
          </span>
           {{ integration.name }}
         </div>
         <!-- Integration specific metadata -->
         <div v-if="integration.definition_id === 'aws'">
           {{ integration.metadata.account_id }} ({{ integration.metadata.friendly_name }})
        </div>
        <div v-else-if="integration.definition_id === 'slack'">
          {{ integration.metadata.account_id }}
        </div>
        <div v-else-if="integration.definition_id === 'gcp'">
          {{ integration.metadata.project_id }} ({{ integration.metadata.project_name }})
        </div>
        <div v-else-if="integration.definition_id === 'azure'">
          {{ integration.metadata.subscription_id }} ({{ integration.metadata.friendly_name }})
        </div>
        <div v-else-if="integration.definition_id === 'zendesk'">
          {{ integration.metadata.username }}
        </div>
        <div v-else-if="integration.definition_id === 'victorops'">
          {{ integration.metadata.incident_uri }}
        </div>
        <div v-else-if="integration.definition_id === 'email'">
          {{ integration.metadata.listname }}
        </div>
        <div v-else-if="integration.definition_id === 'netapp'">
          {{ integration.metadata.url }}
        </div>
        <div v-else-if="integration.definition_id === 'globe_billing'">
          {{ integration.metadata.friendly_name }}
        </div>
        <div v-else-if="integration.metadata.friendly_name !== undefined">
          {{ integration.metadata.friendly_name}}
        </div>
        <div v-else>{{ integration.metadata.name }}</div>
      </span>
    </div>
    <div v-if="isComplex">
      <transition name="fade">
        <div v-if="show">
          <hr class="default" />
          <div
            v-for="(meta, key, index) in integration.metadata"
            :key="`${integration.id}-${index}`"
          >
            <span class="bold capitalize">{{ key }}:</span>
            <!-- Email type and email list -->
            <div
              v-if="
                integration.definition_id === 'email' &&
                  typeof meta === 'object'
              "
            >
              <div
                v-for="(email, emailIndex) in meta"
                :key="`email-${emailIndex}`"
              >
                {{ email }}
              </div>
            </div>
            <!-- Endpoint -->
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
                  <span class="italics"
                    >({{ endpoint.check_interval }} min)</span
                  >
                  <span class="ellipsis" :title="endpoint.name">{{
                    endpoint.name
                  }}</span>
                </div>
                <p class="ellipsis">
                  <a
                    :href="endpoint.url"
                    :title="endpoint.url"
                    target="_blank"
                    >{{ endpoint.url }}</a
                  >
                </p>
              </div>
            </div>
            <!-- cascadeo.io Type -->
            <div v-else-if="integration.definition_id === 'cascadeo_io'">
              <div v-if="meta === true">Enabled</div>
              <div v-else-if="meta === false">Disabled</div>
              <div v-else>{{ meta }}</div>
            </div>
            <div v-else-if="integration.definition_id === 'windows'">
              <div v-if="key == 'friendly_name'">{{ meta }}</div>
              <div v-else>
                <div v-if="meta.server_port != ''">{{ meta.friendly_name }}</div>
                <div v-else>N/A</div>
              </div>
            </div>
            <p v-else>{{ meta }}</p>
          </div>
        </div>
      </transition>
      <hr class="default" />
      <div class="controls text-right">
        <button
          class="button default link small"
          @click="show = true"
          v-if="!show"
        >
          <i class="fas fa-chevron-right"></i>
          More
        </button>
        <button class="button default link small" @click="show = false" v-else>
          <i class="fas fa-chevron-down"></i>
          Less
        </button>
        <button
          class="button danger link small"
          @click="$emit('removeIntegration', integration.id)"
          :disabled="disabledAccess"
        >
          <i class="fas fa-times"></i>
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Model, Vue } from 'vue-property-decorator';
import IAM from '@/common/iam';
import API from '@/API';

@Component
export default class InputIntegrationCard extends Vue {
  /* Variables */
  @Model('status', { type: String })
  protected status: string;

  @Prop({ default: 'false' })
  private text: string;

  @Prop({ default: 'false' })
  private actions: string;

  @Prop({ default: 'false' })
  private poll: string;

  @Prop()
  private integration: Integration<All>;

  @Prop({ default: 'false' })
  private complex: string;

  private show: boolean = false;
  private disabledAccess: boolean = true;
  private statusIcon: string = '';
  private statusCheck: string = 'LOADING…';
  private poller: any;
  private secondsLeft: number = 0;
  private pollSeconds: number = 15;
  private endpointPaused: boolean = false;

  /* Lifecycle */
  private created(): void {
    this.statusCheck = 'LOADING…';
    this.checkStatus();

    if (this.hasPoll) {
      this.pollSetup();
    }

    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      this.disabledAccess = !IAM.checkAuthz(['integration:write'], API.Organization_v2.getActive());
    } else {
      this.disabledAccess = !IAM.checkAuthz(['admin']);
    }
  }

  private beforeDestroy(): void {
    this.pollTeardown();
  }

  private async checkStatus(): Promise<void> {
    /* 'loading…' status throws the loading spinner */
    this.statusCheck = 'LOADING…';

    await API.Integration.status(this.integration)
      .then((res) => {
        this.statusCheck = res;
      })
      .catch((error) => {
        this.statusCheck = 'UNKNOWN';
      });
    this.setEndpointPausedState();
  }

  private async toggleEndpointPauseStatus(paused: boolean): Promise<void> {

    if (paused)  {
      this.statusCheck = 'PAUSED';
      await API.Integration.endpoint.togglePause(this.integration.id, paused);
    } else {
      await API.Integration.endpoint.togglePause(this.integration.id, paused);
      this.checkStatus();
    }

    this.setEndpointPausedState();
    const endpointIntegration = this.integration as IntegrationData<Endpoint>;
    endpointIntegration.metadata.paused = this.endpointPaused;
    await API.Integration.update(endpointIntegration);
  }


  private setEndpointPausedState() {
    this.endpointPaused = (this.statusCheck === 'PAUSED');
  }

  /* Methods */
  /**
   * Prop attribute that toggles extra data like status
   */
  get isComplex(): boolean {
    return this.complex.toLowerCase().trim() !== 'false';
  }


  get hasText(): boolean {
    return this.text.toLowerCase().trim() !== 'false';
  }

  get hasActions(): boolean {
    const definitions = ['aws', 'netapp', 'azure', 'gcp'];
    return definitions.indexOf(this.integration.definition_id) >= 0;
  }

  get hasPoll(): boolean {
    return this.poll.toLowerCase().trim() !== 'false';
  }

  @Watch('statusCheck', { immediate: true })
  private update(status: string, oldStatus: string): void {
    this.updateIcon(status, oldStatus);
    this.$emit('status', status);
  }

  private updateIcon(status: string, oldStatus: string): void {
    if (status === 'LOADING…' || status) {
      switch (status.toUpperCase()) {
        case 'ACTIVE':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'LOADING…':
          this.statusIcon = 'spinner c-gray-500';
          break; /* loading icon */
        case 'NO_ACCESS':
          this.statusIcon = 'fa-do-not-enter c-gray-500';
          break; /* All */
        case 'CMI_INTEGRATION_UP':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'CMI_INTEGRATION_DOWN':
          this.statusIcon = 'fa-do-not-enter c-danger-500';
          break;
        case 'INTEGRATION_STARTING':
          this.statusIcon = 'fa-arrow-up c-success-500';
          break;
        case 'INTEGRATION_STOPPING':
          this.statusIcon = 'fa-arrow-to-bottom c-danger-500';
          break;
        case 'INTEGRATION_START_FAILED':
          this.statusIcon = 'fa-do-not-enter c-gray-500';
          break;
        case 'INTEGRATION_STOP_FAILED':
          this.statusIcon = 'fa-do-not-enter c-gray-500';
          break;
        case 'SERVICE_UP':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'SERVICE_DOWN':
          this.statusIcon = 'fa-do-not-enter c-danger-500';
          break;
        case 'RECEIVING_DATA':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'RECEIVED_DATA':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'PAUSED':
          this.statusIcon = 'fa-pause c-gray-400';
          break;
        case 'CONFIGURED':
          this.statusIcon = 'fa-circle c-success-500';
          break;
        case 'NOT_CONFIGURED':
          this.statusIcon = 'fa-circle c-gray-400';
          break;
        case 'UNKNOWN':
          this.statusIcon = 'fa-question-circle c-gray-400';
          break; /* All */
        // case 'RUNNING':                 this.statusIcon = 'fa-circle c-success-500';         break; /* AWS */
        // case 'CMI_STOPPING':            this.statusIcon = 'fa-arrow-to-bottom c-danger-500'; break; /* GCP */
        // case 'CMI_DOWN':                this.statusIcon = 'fa-do-not-enter c-danger-500';    break; /* CMI */
        // case 'NIL':                     this.statusIcon = 'fa-do-not-enter c-gray-500';      break; /* AWS */
        // case 'TERMINATED':              this.statusIcon = 'fa-do-not-enter c-gray-500';      break; /* GCP */
        // case 'PENDING':                 this.statusIcon = 'fa-ellipsis-h c-gray-500';        break; /* AWS */
        default:
          this.statusIcon = 'fa-circle c-gray-400';
          break; /* unknown */
      }
    }
  }

  private pollSetup(): void {
    this.secondsLeft = this.pollSeconds;
    clearInterval(this.poller);

    this.poller = setInterval(() => {
      this.secondsLeft = this.secondsLeft - 1;
      if (this.secondsLeft <= 0) {
        this.checkStatus();
        this.secondsLeft = this.pollSeconds;
      }
    }, 1000);
  }
  private pollTeardown(): void {
    clearInterval(this.poller);
  }


  private stopIntegration(integration: Integration<AWS>): void {
    API.Integration.stop(integration);
  }

  private startIntegration(integration: Integration<AWS>): void {
    API.Integration.start(integration);
  }

  private terminateAWSCMI(integration: Integration<AWS>): void {
    API.Integration.aws.remove(integration);
  }

  private redeployAWSCMI(integration: Integration<AWS>): void {
    API.Integration.aws.add(integration);
  }

  private terminateGCPCMI(integration: Integration<GCP>): void {
    API.Integration.gcp.remove(integration);
  }

  private redeployGCPCMI(integration: Integration<GCP>): void {
    API.Integration.gcp.start(integration.id, integration.organization_id);
  }
}
</script>

<style lang="scss" scoped>
.title {
  line-height: 1.5;
}

.logo {
  float: left;
  width: 4rem;
  height: auto;
  margin: 0 1rem -0.5rem 0;
}

.card-style {
  padding: 0;
  border: 0;
  margin: 0 0 0 0;
  }

.card-image-style {
  height: 4rem;
  width: 4.5rem;
}
</style>

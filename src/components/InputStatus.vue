<template>
  <span :title="`Status: ${statusCheck}`">
    <span v-if="hasActions" class="right">
      <button
        :data-cy="`stop-button-${integration.definition_id}`"
        :disabled="disabledAccess"
        v-if="
          [
            'UNKNOWN',
            'NO_ACCESS',
            'INTEGRATION_STOP_FAILED',
            'INTEGRATION_START_FAILED',
            'CMI_INTEGRATION_UP',
            'SERVICE_UP',
          ].indexOf(statusCheck) >= 0
        "
        class="button danger outline small"
        @click="stopIntegration(integration)"
      >
        <i class="fas fa-arrow-to-bottom"></i>
        Stop Integration</button
      >&nbsp;&nbsp;
      <button
        :data-cy="`start-button-${integration.definition_id}`"
        :disabled="disabledAccess"
        v-if="
          [
            'UNKNOWN',
            'NO_ACCESS',
            'INTEGRATION_STOP_FAILED',
            'INTEGRATION_START_FAILED',
            'CMI_INTEGRATION_READY',
            'CMI_INTEGRATION_DOWN',
            'SERVICE_DOWN',
          ].indexOf(statusCheck) >= 0
        "
        class="button primary outline small"
        @click="startIntegration(integration)"
      >
        <i class="fas fa-cloud-upload"></i>
        Start Integration
      </button>
    </span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Watch, Model, Vue } from 'vue-property-decorator';
import API from '@/API';
import IAM from '@/common/iam';

@Component
export default class InputStatus extends Vue {
  /* Variables */
  @Model('status', { type: String })
  protected status: string;

  @Prop({ default: 'false' })
  private icon: string;

  @Prop({ default: 'false' })
  private text: string;

  @Prop({ default: 'false' })
  private actions: string;

  @Prop({ default: 'false' })
  private poll: string;

  @Prop()
  private integration: Integration<All>;

  private statusIcon: string = '';
  private statusCheck: string = 'LOADING…';

  private poller: any;
  private secondsLeft: number = 0;
  private pollSeconds: number = 15;
  private disabledAccess: boolean = true;
  private endpointPaused: boolean = false;

  /* Lifecycle */
  private mounted(): void {
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
    console.log(this.statusCheck);
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
  get hasIcon(): boolean {
    return this.icon.toLowerCase().trim() !== 'false';
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

<style lang="scss" scoped></style>

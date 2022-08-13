<template>
  <div>
    <div class="card card-style">
      <service-image :id="integration.definition_id" class="logo" />
      <span>
        <div class="title bold">
          <status :integration="integration" icon v-if="isComplex" />
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import IAM from '@/common/iam';
import API from '@/API';

@Component
export default class IntegrationCard extends Vue {
  /* Variables */
  @Prop()
  private integration: Integration<All>;

  @Prop({ default: 'false' })
  private complex: string;

  private show: boolean = false;
  private disabledAccess: boolean = true;

  /* Lifecycle */
  private created(): void {
    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      this.disabledAccess = !IAM.checkAuthz(['integration:write'], API.Organization_v2.getActive());
    } else {
      this.disabledAccess = !IAM.checkAuthz(['admin']);
    }
  }

  /* Methods */
  /**
   * Prop attribute that toggles extra data like status
   */
  get isComplex(): boolean {
    return this.complex.toLowerCase().trim() !== 'false';
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
</style>

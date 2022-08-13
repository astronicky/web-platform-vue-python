<template>
  <div class="container">
    <h1>Edit Integration</h1>


    <div v-if="integrations && integrations.length">
      <div class="row">
        <div class="clg8 cmd10 csm12 cxs12">
          <integration-info :id="definitionID" />

            <component :editing="true" :integrations="integrations" :is="serviceName" />
        </div>
      </div>


      <banner type="danger" icon="fas fa-exclamation-triangle" large v-if="!integrationFound">
      <p class="big bold">Missing Integration</p>
      <p>
        We couldn't find the
        <span class="underline">
          {{id}}
        </span>
        integration you were looking for.
      </p>
      <router-link to="/integrations" class="button default outline">
        Back to Integrations
      </router-link>
      </banner>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class IntegrationsEdit extends Vue {
  /* Variables */
  @Prop()
  private id: string;
  @Prop()
  private definitionID: string;

  private integrations: Array<Integration<All>> = [];
  private integrationFound: boolean = false;

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  /* Lifecycle */
  private created(): void {
    if (this.currentOrg) {
      this.getIntegrations();
    }
  }

  /* Methods */

  get serviceName(): void {
    try {
      this.integrationFound = true;
      return require(`@/integrations/${this.definitionID}.vue`).default;
    } catch {
      this.integrationFound = false;
    }
  }

  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
    });
  }


}

</script>

<style lang="scss" scoped>
</style>

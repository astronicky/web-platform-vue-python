<template>
  <div class="container">
    <h1>Add Integration</h1>


    <div class="row">
      <div class="clg8 cmd10 csm12 cxs12">
        <integration-info :id="id" />

        <component :is="serviceName" />
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
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class IntegrationsAdd extends Vue {
  /* Variables */
  @Prop()
  private id: string;

  private integrationFound: boolean = false;

  /* Methods */

  get serviceName(): void {
    try {
      this.integrationFound = true;
      return require(`@/integrations/${this.id}.vue`).default;
    } catch {
      this.integrationFound = false;
    }
  }

}

</script>

<style lang="scss" scoped>
</style>

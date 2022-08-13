<template>
  <div>
    <div v-if="viewControls">
      <p>All the service integrations Cascadeo Platform currently supports.</p>
      <hr />
      <div class="row">
        <div>
          <label>Show: &nbsp;</label>
        </div>

        <div class="csm6 cxs12">
          <input
            type="radio" 
            id="filter_all"
            class="radio"
            v-model="filter"
            v-bind:value="'all'"
          >

            <label for="filter_all" class="radio">All</label>

          <input
            type="radio" 
            id="filter_inputs"
            class="radio"
            v-model="filter"
            v-bind:value="'inputs'"
          >
          <label for="filter_inputs" class="radio">Input</label>

          <input
            type="radio" 
            id="filter_outputs"
            class="radio"
            v-model="filter"
            v-bind:value="'outputs'"
          >
          <label for="filter_outputs" class="radio">Output</label>
        </div>
      </div>
    </div>

    <div
      v-if="filteredIntegrations && filteredIntegrations.length > 0"
      class="row"
    >
      <div
        v-for="service in filteredIntegrations"
        :key="service.id"
        class="csm12 cmd6 clg4"
      >
        <router-link
          class="service button default outline"
          :to="{ path: `/integrations/add/${service.definition_id}` }"
          :disabled="disabledAccess"
          v-if="service.enabled"
        >
          <service-image :id="service.definition_id" class="image"/>
          <div class="description">
            <div class="integration_name" :title="`${service.name}`">
              {{ service.name }}
            </div>
            <div class :title="`${service.description}`">
              {{ service.description }}
            </div>
            <div class="text-right">
              <span class="tag primary outline capitalize">{{
                service.tags[0]
              }}</span>
              <span
                v-if="service.definition_type === 'input'"
                title="Input"
                class="tag default outline"
              >
                <i class="fas fa-arrow-alt-to-right"></i>
                &nbsp; Input
              </span>
              <span
                v-if="service.definition_type === 'output'"
                title="Output"
                class="tag default outline"
              >
                <i class="fas fa-external-link-square"></i>
                &nbsp; Output
              </span>
            </div>
          </div>
        </router-link>
        <button
          class="service button default outline text-left"
          v-else
          disabled
        >
          <service-image :id="service.definition_id" class="image" />
          <div>
            <div class="title bold ellipsis" :title="`${service.name}`">
              {{ service.name }}
            </div>
            <div class="ellipsis" :title="`${service.description}`">
              {{ service.description }}
            </div>
            <div class="text-right">
              <span class="tag default">Coming Soon</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div v-else>
      <banner type="default" icon="fas fa-exclamation-triangle">
        No integrations found.
      </banner>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Watch, Vue } from 'vue-property-decorator';

import API from '@/API';
import IAM from '@/common/iam';

@Component
export default class IntegrationsList extends Vue {
  /* Variables */
  @Prop()
  private search: string[];

  @Prop()
  private types: string[];

  @Prop({ default: 'false' })
  private controls: string;

  private inputs: boolean = true;
  private outputs: boolean = true;
  private filter: string = '';


  private disabledAccess: boolean = false;
  private filteredIntegrations: IntegrationDefinition[] = [];

  get currentOrg(): string {
    const org = API.Organization_v2.getCurrentId();
    return org;
  }

  @Watch('currentOrg', {immediate: true})
  private orgChange() {
    // this.checkAccess(); // removed a redundant call to the same function inside created()
  }

  /* Lifecycle */
  private created(): void {

    this.inputs = this.types.indexOf('inputs') > -1;
    this.outputs = this.types.indexOf('outputs') > -1;

    if (this.inputs && !this.outputs) {
      this.filter = 'inputs';
    } else if (this.outputs && !this.inputs) {
      this.filter = 'outputs';
    } else {
      this.filter = 'all';
    }

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

  @Watch('filter')
  private updateIntegrations(value: any, oldValue: any): void {
    API.Integration.getDefinitions().then((response) => {
      const integrations: IntegrationDefinition[] = response;
      let newFiltered: IntegrationDefinition[] = [];

      if (value === 'all' || value === '' || value === undefined) {
        /* Show all integrations */
        newFiltered = JSON.parse(JSON.stringify(integrations));
      } else {
        /* Show only 'inputs' or 'outputs' */
        newFiltered = JSON.parse(JSON.stringify(integrations)).filter(
          (i: IntegrationDefinition) => {
            return (
              (value === 'inputs' && i.definition_type === 'input') ||
              (value === 'outputs' && i.definition_type === 'output')
            );
          }
        );

        /* Remove non-active */
        newFiltered = newFiltered.filter(
          (i: IntegrationDefinition) => i.enabled
        );
      }

      /* Find all searched integrations by definition_id */
      if (this.search && this.search.length > 0) {
        newFiltered = newFiltered.filter((i: IntegrationDefinition) => {
          return this.search.find((term: string) => i.definition_id === term);
        });
      }

      /* Sort by active */
      newFiltered = newFiltered.sort(
        (a: IntegrationDefinition, b: IntegrationDefinition) => {
          if (!a.enabled && b.enabled) {
            return 1;
          }
          if (a.enabled && !b.enabled) {
            return -1;
          }
          return 0;
        }
      );

      this.filteredIntegrations = newFiltered;
    });
  }

  get viewControls(): boolean {
    return this.controls.toLowerCase().trim() !== 'false';
  }
}
</script>

<style lang="scss" scoped>

  .integration_name {
    font-weight: bold;
  }

  a.service {
    height: 100%;
    padding-bottom: 3rem;
  }

  // Container
  .csm12.cmd6.clg4 {
    padding-bottom: 1.5rem;
  }

  .description {
    padding-top: 1rem;
  }

  // Bottom buttons
  .text-right {
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
  }

  input[type=radio], .radio {
    display: inline;
    margin-top: .8em;
    position: relative;
  }

</style>

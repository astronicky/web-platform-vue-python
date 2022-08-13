<template>
  <div class="container">
    <router-link
      :to="`pipelines/create`"
      class="button default outline new"
    >
      <i class="fas fa-plus"></i>
      Add New Pipeline
    </router-link>

    <h1>Pipelines</h1>

    <div v-if="pipelines && pipelines.length">
      <div class="pipeline" v-for="pipeline in pipelines" :key="pipeline.id">
        <div class = "action-top right">
        <button
          @click="testOutputs(pipeline.id, pipeline.config.name)"
          v-if="!disabledAccess"
          class="button default outline"
        >
          <i class="fas fa-flask"></i>
          Test Outputs
        </button>

        <router-link
          :to="`pipelines/settings/${pipeline.id}`"
          :disabled="disabledAccess"
          class="button default outline"
        >
          <i class="fas fa-cog"></i>
          Settings
        </router-link>
        </div>

        <h2
          v-if="pipeline.config.name"
          :title="`Pipeline ${pipeline.config.name}`"
        >{{ pipeline.config.name }}</h2>

        <div class="flex">
          <div class="integrations">
            <span v-if="pipeline.integrations !== ' '">
              <input-integration-card
                v-for="input in filterIntergrations(
                  pipeline.integrations,
                  'input'
                )"
                :key="input.integration_id"
                :integration="input"
                class="card"
                complex
                v-on:removeIntegration="removeIntegration($event, pipeline)"
              /> 
            </span> 
            <span v-if = "!hasInput || pipeline.integrations === null">
              <div class="no-input-output">
                <div class = "bold p1"> No Input Available </div>
                <hr class="style-color" />
                <div class = "bold p2" > *Pipelines need at least 1 input and 1 output to trigger properly. </div>
              </div>
            </span>
            <button
              @click="selectPipeline(pipeline, 'input')"
              v-if="!disabledAccess"
              class="add block"
            >
              <i class="fas fa-plus"></i>
              Add Input
            </button>
          </div>

          <div class="arrow">
            <arrow />
          </div>

          <div class="integrations">
            <div class="card">
              <div class="bold">Settings</div>

              <hr class="default" />

              <options-list
                title="NOC Active"
                :selected="pipeline.config.pay_tier.noc_alerts"
                active="fas fa-bell"
                inactive="fas fa-bell-slash"
              />

              <options-list
                title="Show Graph"
                :selected="true"
                active="fas fa-check-square"
                inactive="fas fa-square"
              />

              <!-- <hr class="default">

              <options-list
                v-for="(option, key) in futureOptions"
                :key="`${option.title}-${key}`"
                :title="option.title"
                :selected="option.selected"
                active="fas fa-check-square"
              inactive="fas fa-square"/>-->
            </div>
          </div>

          <div class="arrow">
            <arrow />
          </div>

          <div class="integrations">
            <div v-if="pipeline.config.pay_tier.noc_alerts" class="card pulse">
              <service-image id="cascadeo" class="left" />
              <div
                class="right"
                v-if="pipeline.config.pay_tier.noc_alerts"
                :title="pipeline.config.pay_tier.noc_alerts"
              >
                <i class="fas fa-bell c-primary-500"></i>
              </div>
              <div class="block">
                <div class="bold">Cascadeo NOC</div>
                <hr />

                <options-list
                  title="Responding to Alerts"
                  :selected="pipeline.config.pay_tier.noc_alerts"
                  active="fas fa-check-square"
                  inactive="fas fa-square"
                />
              </div>
            </div>

            <integration-card
              v-for="output in filterIntergrations(
                pipeline.integrations,
                'output'
              )"
              :key="output.integration_id"
              :integration="output"
              class="card"
              complex
              v-on:removeIntegration="removeIntegration($event, pipeline)"
            />
            <span v-if = "(!hasOutput || pipeline.integrations === null) && !pipeline.config.pay_tier.noc_alerts">
              <div class="no-input-output">
                <div class = "bold p1"> No Output Available </div>
                <hr class="style-color" />
                <div class = "bold p2" > *Pipelines need at least 1 input and 1 output to trigger properly. </div>
              </div>
            </span>
            <button
              @click="selectPipeline(pipeline, 'output')"
              v-if="!disabledAccess"
              class="add block"
            >
              <i class="fas fa-plus"></i>
              Add Output
            </button>
          </div>
        </div>
      </div>

      <h2 v-if="!disabledAccess">Add Pipeline</h2>

      <router-link class="add block" :to="`pipelines/create`">+ New Pipeline</router-link>
    </div>

    <!--
    Empty State
    -->
    <div v-else>
      <empty icon="fas fa-code-branch">
        <div slot="title">Welcome to Pipelines</div>
        <div slot="description">
          <p>
            Pipelines are how you connect data sources and push alerts to
            service destinations. For example; monitor your AWS cloud resources
            and receive alerts in Slack.
          </p>
          <br />
          <router-link
            :to="`pipelines/create`"
            class="button primary outline large"
          >
            <i class="fas fa-cog"></i>
            Add New Pipeline
          </router-link>
        </div>
      </empty>
    </div>

    <!--
    Add Integration Modal
    -->
    <modal v-model="showModal" class="modal">
      <h2>
        Add
        <span class="capitalize">{{ this.selectedType }}</span>
      </h2>
      <button
        class="button default outline flex"
        v-for="integration in filterIntergrations(
          integrations,
          this.selectedType
        )"
        :key="integration.id"
        :disabled="disableAddCard(integration.id)"
        @click="addIntegration(integration)"
      >
        <integration-card :integration="integration" class="text-left" />
      </button>
      <hr class="default" />
      <router-link
        to="/integrations"
        class="button default outline capitalize block text-center"
        :disabled="disabledAccess"
      >
        <i class="fas fa-plus"></i>
        New {{ this.selectedType }}
      </router-link>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import CurrentIntegrations from '@/views/main/Integrations/CurrentIntegrations.vue';
import IntegrationCard from './IntegrationCard.vue';
import InputIntegrationCard from './InputIntegrationCard.vue';
import OptionsList from './OptionsList.vue';

import router from '@/router/router';
import API from '@/API';
import IAM from '@/common/iam';

@Component({
  components: {
    CurrentIntegrations,
    IntegrationCard,
    InputIntegrationCard,
    OptionsList,
  },
})
export default class PipelineIndex extends Vue {
  /* Variables */

  private futureOptions: any = [
    { title: 'Custom Resources', selected: false },
    { title: 'Custom Thresholds', selected: false },
    { title: 'Machine Learning', selected: false },
    { title: 'Attach Graph', selected: false },
  ];

  private pipelines: Pipeline[] = [];
  private integrations: Array<Integration<All>> = [];
  private showModal: boolean = false;
  private selectedPipeline = {} as Pipeline;
  private selectedType: string = 'input';
  private disabledAccess: boolean = true;
  private hasInput: boolean;
  private hasOutput: boolean;

  private pipeLineIgnore: string[] = [
    'cloudtrail',
  ];

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  /* Lifecycle */
  private created(): void {
    this.init();
    this.getPipelines();
  }

  @Watch('currentOrg')
  private updateSelected() {
    this.init();
  }

  /* Methods */
  private init() {
    this.getIntegrations();

    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      this.disabledAccess = !IAM.checkAuthz(['pipeline:write'], API.Organization_v2.getActive());
    } else {
      this.disabledAccess = !IAM.checkAuthz(['admin']);
    }
  }

  private testOutputs(pipelineID: string, pipelineName: string): void {
    API.Pipeline.testOutputs(pipelineID, pipelineName);
  }

  private getPipelines(): void {
    API.Pipeline.get()
      .then((response) => {
        /* Sort by num-alpha */
        const sortedPipelines = response.sort((a: any, b: any) => {
          let nameA = a.config.name.toUpperCase();
          let nameB = b.config.name.toUpperCase();

          if (nameA === '') {
            nameA = '~';
          } /* Puts 'New Pipelines' at the bottom */
          if (nameB === '') {
            nameB = '~';
          } /* '~' is the lower ASCII char value */

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        this.pipelines = sortedPipelines;
      })
      .catch((error) => {
        this.pipelines = [];
      });
  }

  private selectPipeline(pipeline: Pipeline, type: string): void {
    this.selectedPipeline = pipeline;
    this.showModal = true;
    this.selectedType = type;
  }

  private getIntegrations(): void {
    API.Integration.get().then((response) => {
      this.integrations = response;
    });
  }

  private filterIntergrations(
    integrations: Array<Integration<All>>,
    type: string
  ): Array<Integration<All>> {
    const integrationList: Array<Integration<All>> = [];
    this.hasInput = false;
    this.hasOutput = false;
    /* Filter on based on integration type */
    if (integrations && integrations.length) {
      // tslint:disable-next-line
      for (let i = 0; i < integrations.length; i++) {
        // exclude integrations from ignore list
        if (this.pipeLineIgnore.includes(integrations[i].definition_id)) {
          continue;
        }
        if (integrations[i].definition_type.indexOf(type) > -1) {
          integrationList.push(integrations[i]);
        }
        if (integrations[i].definition_type === 'input') {
          this.hasInput = true;
        } else if (integrations[i].definition_type === 'output') {
          this.hasOutput = true;
        }
      }
      return integrationList;
    }
    return [];
  }

  private disableAddCard(integrationID: string): boolean {
    const integrations = this.selectedPipeline.integrations;
    for (const i in integrations) {
      if (integrations[i].id === integrationID) {
        return true;
      }
    }
    return false;
  }

  private addIntegration(integration: Integration<All>): void {
    const pipeline: Pipeline = JSON.parse(
      JSON.stringify(this.selectedPipeline)
    );

    /* If no Integrations are added yet (null), give it a blank array to push to */
    if (!pipeline.integrations) {
      pipeline.integrations = [];
    }

    /* Works with just the intregration id, as well as whole object */
    pipeline.integrations.push({ id: integration.id } as any);

    API.Pipeline.update(pipeline).then(() => {
      this.getPipelines();
      this.showModal = false;
    });
  }

  private removeIntegration(
    integrationId: string,
    oldPipeline: Pipeline
  ): void {
    const pipeline: Pipeline = JSON.parse(JSON.stringify(oldPipeline));

    pipeline.integrations.forEach((i, index, object) => {
      if (i.id === integrationId) {
        object.splice(index, 1);
      }
    });

    API.Pipeline.update(pipeline).then(() => {
      this.pipelines = [];
      this.getPipelines();
    });
  }
}
</script>

<style lang="scss" scoped>

.action-top .button {
  margin-left: 5px;
  margin-right: 5px;
}
.new {
  float: right;
  margin-top: 1rem;
}

.pipeline {
  border-bottom: 0.1rem solid var(--c-gray-500);
  margin-top: 2rem;
  padding-bottom: 2rem;
}

.card img {
  width: 4rem;
  height: auto;
  margin: 0 1rem 0 0;
}

.flex .arrow {
  flex: 1 1 5rem;
  padding: 2.75rem 0.25rem;
}

.flex .integrations {
  flex: 3 20rem;
  min-width: 0;
  word-break: break-word;
}

.modal .button {
  margin-bottom: 1rem;

  .title {
    margin: 0.5rem 0 0.5rem 0;
  }

  .image {
    flex: 0 0 7rem;
    margin-right: 1rem;
  }
  .block {
    text-align: left;
  }
}

.add.block {
  text-align: center;
}

.add {
  background: var(--c-gray-100);
  padding: 3rem 0;
  border: 0.3rem dashed var(--c-primary-500);
  border-radius: 0.3rem;
  font-size: 1.6rem;
  transition: all var(--transition-short);

  .fas {
    margin: 0 0.5rem;
  }

  &:hover,
  &:focus {
    border-radius: 0.5rem;
    border: 0.3rem dashed var(--c-primary-500);
    background: var(--c-primary-200);
    transition: all var(--transition-short);
  }
}

.no-input-output {
  border: 0.2rem dotted var(--c-danger-600);
  height: auto;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
}

.p1 {
  font-style: italic;
  margin: 0 0 0 0;
  color: var(--c-danger-600);
  font-size: 1.6rem;
}

.p2 {
  font-style: italic;
  margin: 0 0 0 0;
  color: var(--c-danger-600);
  font-size: 1.4rem;
  padding-bottom: 3rem;
}

hr.style-color{
    color: var(--c-danger-600);
    background-color: var(--c-danger-600);
    height: .1rem;
    border-top: 0rem;
}

/* Dark Mode */

@media (prefers-color-scheme: dark) {
  .add {
    background: var(--c-gray-700);
    border: 0.3rem dashed var(--c-primary-400);
    color: var(--c-gray-200);

    &:hover,
    &:focus {
      border: 0.3rem dashed var(--c-primary-500);
      background: var(--c-primary-500);
    }
  }
}
</style>

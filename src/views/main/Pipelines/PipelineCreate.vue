<template>
  <div class="container">
    <div class="row">
      <div class="clg12 cxl8">
        <h1>Pipeline Settings</h1>

        <h2>Pipeline Name</h2>
        <p>
          Common pipeline names include the name of your project or the name
          of your environment.
        </p>

        <form @submit.prevent>
          <div class="row">
            <div class="clg3 cmd4 csm6 cxs12">
              <label class="required-field" for="pipeline_name">Name</label>
            </div>
            <div class="clg4 cmd6 csm6 cxs12">
              <input
                v-validate="'required'"
                name="pipeline_name"
                value="Pipeline Name"
                type="text"
                placeholder="Pipeline Name"
                v-model="pipeline.config.name"
                data-vv-as="'Pipeline Name'">

                <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('pipeline_name')">
                  {{ errors.first('pipeline_name') }}
                </banner>

            </div>
          </div>

          <h2>NOC Alerting</h2>
          <p>
            You can have our NOC watch for and validate alerts before contacting you.
          </p>

          <div class="row">
            <div class="clg3 cmd4 csm6 cxs12">
              <p class="text-right bold">
                Receive NOC Alerts
              </p>
            </div>
            <div class="clg4 cmd6 csm6 cxs12">
              <input id="nocAlerts" name="nocAlerts" type="checkbox" v-model="pipeline.config.pay_tier.noc_alerts">
              <label for="nocAlerts">Active</label>
            </div>
          </div>

          <banner type="primary" icon="fas fa-headset" large v-if="pipeline.config.pay_tier.noc_alerts">
            <p class="big bold">Humans are on the line!</p>
            <p>
              Our expert team will now be validating alerts for you. If anything
              looks like it needs your attention, we will be reaching out to you.
            </p>
          </banner>

          <!-- <h2>Alert Graphs</h2>
          <p>Attach a graph of when the alert was triggered to all outputs, when applicable.</p>
          <div class="row">
            <div class="clg3 cmd4 csm6 cxs12">
              <p class="text-right bold">
                Graph
              </p>
            </div>
            <div class="clg4 cmd6 csm6 cxs12">
              <input id="showGraph" name="showGraph" type="checkbox" v-model="pipeline.config.show_graphs">
              <label for="showGraph">Attach Image</label>
            </div>
          </div>

          <div class="row">
            <div class="clg3 cmd4 csm6 cxs12">
              <p class="text-right bold">
                Example
              </p>
            </div>
            <div class="clg7 cmd6 csm6 cxs12">
              <img src="@/assets/graph_example.png" alt="Example Graph">
            </div>
          </div> -->

          <br>
          <br>

          <div class="text-right">
            <router-link to="/pipelines" class="button link default" @click="deletePipeline()">
              Cancel
            </router-link>
            &nbsp;
            <button
              class="button primary outline"
              type="submit"
              @click="createPipeline()"
              :disabled="errors.any()">
              <i class="fas fa-save"></i>
              Save
            </button>
            &nbsp;
            <button class="button outline danger" type="button" @click="deleteOpen = !deleteOpen" disabled>
              <i class="fas fa-trash"></i>
              Delete
            </button>
            <!-- <div v-if="deleteOpen">
              <br>
              <p class="italics">
                Note: This operation is not reversible! Are you sure you want to delete the
                <span class="bold">
                  "{{ pipeline.config.name }}"
                </span>
                pipeline?
              </p>
              <button class="button danger" type="button" @click="deletePipeline()">
                <i class="fas fa-trash-alt"></i>
                Permanently Delete
              </button>
            </div> -->
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

@Component
export default class PipelineCreate extends Vue {
  /* Variables */
  @Prop()
  private id: string;
  private pipelines: Pipeline[] = [];

  /* This needs a blank model initially ot be reactive */
  private pipeline: Pipeline = {
    id: '',
    organization_id: this.currentOrg,
    integrations: [],
    config: {
      name: '',
      show_graph: true,
      pay_tier: {
        noc_alerts: false,
      },
    },
  };

  private deleteOpen: boolean = false;
  // private nocAlerts: boolean = true;

  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }

  /* Methods */
  private async createPipeline(): Promise<void> {
    const result = await this.$validator.validateAll();
    if (result) {
      const res = await API.Pipeline.add(this.pipeline);
      if (res) {
        router.push(`/pipelines`);
      }
    }
  }

  private save(): void {
    API.Pipeline.update(this.pipeline);
    router.push(`/pipelines`);
  }

  private testOutputs(): void {
    API.Pipeline.testOutputs(this.pipeline.id, this.pipeline.config.name);
  }

}
</script>

<style lang="scss" scoped>

  .required-field::after {
      color: red;
      content: '*';
      display: inline;
  }

</style>

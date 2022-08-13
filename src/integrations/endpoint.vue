<template>
  <div>
    <h2>Endpoints ({{currentNum}} / {{ max }})</h2>


    <tabs
      :list="true"
      :tabNav="false"
      :selected="tabIndex">

      <tab name="Add URLs">

        <p>
          You can check specific endpoints to and be alerts when they become unresponsive.
          Any status code other than a <span class="tag success outline">200 OK</span> will
          send an alert. You can set up <span class="bold">{{ max }} total endpoints</span>.
        </p>

        <br>

        <!-- <hr class="default"> -->


        <div class="row">
          <div class="csm3 cxs12">
            <label :for="`endpoint-name`" class="bold">Collection Name</label>
          </div>
          <div class="csm9 cxs12">
            <input
              type="text"
              :id="`endpoint-name`"
              :name="`endpoint-name`"
              v-validate="'required'"
              data-vv-as="'Collection Name'"
              placeholder="Name"
              v-model="endpointsData.metadata.name">
              <p class="italics">Give your endpoint collection a name to reference them by.</p>

              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`endpoint-name`)">
                {{ errors.first(`endpoint-name`) }}
              </banner>

          </div>
        </div>


        <hr class="default">


        <div v-for="(endpoint, index) in endpointsData.metadata.endpoints" :key="`endpoint-${index}`" class="url" >
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`endpoint-${index}`" class="bold">URL {{ index + 1 }}</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`endpoint-${index}`"
                :name="`endpoint-${index}`"
                v-validate="'required'"
                data-vv-as="'URL'"
                placeholder="Endpoint"
                v-model="endpoint.url">
              <p class="italics">Please specify 'http://{host}/{path}' or 'https://{host}/{path}'. Note: path is optional.</p>

                <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`endpoint-${index}`)">
                  {{ errors.first(`endpoint-${index}`) }}
                </banner>

            </div>
          </div>
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`endpoint-port-${index}`" class="bold">Port</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`endpoint-port-${index}`"
                :name="`endpoint-port-${index}`"
                v-validate="'numeric'"
                data-vv-as="'Port'"
                placeholder="Port"
                v-model="endpoint.port">
                <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`endpoint-port-${index}`)">
                  {{ errors.first(`endpoint-port-${index}`) }}
                </banner>

            </div>
          </div>
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`endpoint-name-${index}`" class="bold">Name</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`endpoint-name-${index}`"
                :name="`endpoint-name-${index}`"
                v-validate="'required'"
                data-vv-as="'Name'"
                placeholder="Name"
                v-model="endpoint.name">
                <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`endpoint-name-${index}`)">
                  {{ errors.first(`endpoint-name-${index}`) }}
                </banner>

            </div>
          </div>
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`endpoint-name-${index}`" class="bold">Should Contain</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`endpoint-shouldcontain-${index}`"
                :name="`endpoint-shouldcontain-${index}`"
                data-vv-as="'ShouldContain'"
                placeholder=""
                v-model="endpoint.shouldcontain">
              <p class="italics"> Checks for the existence of text in the response. If not found, the endpoint will be reported as down. <i>Text is not case sensitive.</i></p>
                <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`endpoint-contain-${index}`)">
                  {{ errors.first(`endpoint-shouldcontain-${index}`) }}
                </banner>

            </div>
          </div>
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`check-${index}`" class="bold">Check Interval</label>
            </div>
            <div class="csm3 cxs12">
              <select
                :name="`check-${index}`"
                class="inline"
                :id="`check-${index}`"
                v-model="endpoint.check_interval">
                <option value="1">1 minute</option>
                <option value="5" selected>5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
        </div>
          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`check-${index}`" class="bold">Probe Server</label>
            </div>
            <div class="csm3 cxs12">
              <select
                :name="`check-${index}`"
                class="inline"
                :id="`check-${index}`"
                v-model="endpoint.probe">
                <option value="" selected>Default (North America and Europe)</option>
                <option value="NA">North America</option>
                <option value="EU">Europe</option>
                <option value="APAC">Asia Pacific</option>
                <option value="LATAM">Latin America</option>
              </select>
              <p class="italics">The region which the check will be tested.</p>
            </div>
            <div class="csm6 cxs12">
              <button class="button danger outline right" @click="removeEndpoint(index)">
                <i class="fas fa-times"></i>
                Remove
              </button>
            </div>
          </div>
  </div>
        <br>
        <div class="row">
          <div class="csm9 csmo3 cxs12 csxs0">
            <button class="button default outline" @click="addEndpoint()">
              <i class="fas fa-plus"></i>
              Add Endpoint
            </button>

            <button
              class="button primary outline right"
              type="submit"
              @click="submit()">
              <i class="fas fa-chevron-right"></i>
              Next: Test
            </button>
            <!-- <button
              class="button primary outline right"
              type="submit"
              @click="step2()">
              <i class="fas fa-chevron-right"></i>
              Next: Test
            </button> -->
          </div>
        </div>
      </tab>

      <tab name="Test">
        <p>Check all endpoints to make sure they are correct.</p>

        <div v-for="(endpoint, index) in endpointsStatus.endpoints" :key="`endpoint-check-${index}`">
          <div class="flex">
            <div class="italics">
              <a :href="endpoint.url" target="_blank">
                {{ endpoint.url }}
              </a>
            </div>
            <div>
              {{ endpoint.name }}
            </div>
            <div>
              <span class="tag outline success" v-if="endpoint.status === 'up'">
                <i class="fas fa-circle"></i>
                <span class="bold">Up</span>
              </span>
              <span class="tag outline danger" v-else>
                <i class="fas fa-ban"></i>
                <span class="bold">Down</span>
              </span>

            </div>
          </div>
        </div>

        <div class="right">
          <button class="button primary outline" @click="goBack()">
            Finish
          </button>
        </div>
      </tab>
    </tabs>




  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import http from '@/common/http';
import Auth from '@/common/auth';
import router from '@/router/router';
import API from '@/API';

@Component
export default class CascadeoEndpoint extends Vue {
  /* Variables */

  @Prop()
  private integrations: Array<Integration<All>>;
  @Prop()
  private editing: boolean;

  private tabIndex: number = 0;
  private max: number = 5;
  private integration: Integration<All>;

  get currentNum(): number {
    return this.endpointsData.metadata.endpoints.length;
  }

  private endpointsData: IntegrationData<Endpoint> = {
    id: '',
    definition_id: 'endpoint',
    organization_id: API.Organization_v2.getCurrentId(),
    metadata: {
      name: '',
      paused: false,
      endpoints: [],
    },
  };

  private endpointsStatus: any = [];

  private blank: { name: string, url: string, shouldcontain: string,
                    shouldnotcontain: string, check_interval: string, probe: string, port: number | null } = {
    name: '',
    shouldcontain: '',
    shouldnotcontain: '',
    probe: '',
    url: '',
    port: null,
    check_interval: '5',
  };

  /* Lifecycle */
  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.id === this.$route.params.id && integration.definition_id === 'endpoint') {
          this.endpointsData.id = integration.id;
          this.endpointsData.metadata = integration.metadata;
          this.integration = integration;
        }
      }
    } else {
      this.endpointsData.metadata.endpoints.push(this.newBlank());
    }
  }

  /* Methods */
  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private addEndpoint(): void {
    if (this.endpointsData.metadata.endpoints.length >= this.max) {
      API.UI.addNotification({
        type: 'default',
        text: 'Endpoint limit reached.',
      });
    } else {
      this.endpointsData.metadata.endpoints.push(this.newBlank());
      const index = this.endpointsData.metadata.endpoints.length - 1;
      this.$nextTick(() => {
        document.getElementById(`endpoint-${index}`)!.focus();
      });
    }
  }

  private removeEndpoint(index: number): void {
    this.endpointsData.metadata.endpoints.splice(index, 1);
    this.endpointsStatus.splice(index, 1);
  }

  private newBlank(): { name: string, url: string, shouldcontain: string,
      shouldnotcontain: string, check_interval: string, probe: string, port: number | null } {
    return JSON.parse(JSON.stringify(this.blank));
  }

  private submit(): void {
    this.$validator.validateAll().then(async (result) => {
      if (result) {
        if (this.editing)  {
            await this.update();
        } else {
          await this.add(true);
        }

      }
    });
  }

  private async update() {
    try {
      await API.Integration.update(this.integration);
      await API.Integration.endpoint.update(this.integration.id);
      this.endpointsData.id = this.integration.id;
      this.endpointsStatus = await API.Integration.endpoint.testAll(this.endpointsData);
      this.tabIndex += 1;
    } catch (error) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error updating endpoints.',
        });
    }
  }

  private async add(notify: boolean) {
    API.Integration.add(this.endpointsData, notify)
          .then((res) => {
            this.endpointsData.id = res.id;
            API.Integration.endpoint.add(res.id, notify)
              .then(() => {
                API.Integration.endpoint.testAll(this.endpointsData)
                  .then((response) => {
                    this.endpointsStatus = response;
                  });
                this.tabIndex += 1;
              });
          })
          .catch((error) => {
            throw new Error(error);
          });

  }

  private testAllEndpoints(): void {
    API.Integration.endpoint.testAll(this.endpointsData);
  }

  private goBack(): void {
    router.push('/integrations');
  }

}

</script>

<style lang="scss" scoped>
.url {
  padding: 1.5rem 0;
  border-bottom: 0.1rem solid var(--c-gray-500);
}
.banner {
  margin-top: .5rem;
  margin-bottom: 1rem;
}

</style>

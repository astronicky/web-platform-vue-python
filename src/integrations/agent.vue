<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Agent">

        <h3>Agent Integration</h3>
        <br>

        <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="agentName">Agent name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Agent name"
                name="agentName"
                v-model="integration.metadata.friendly_name"
                v-validate="'required|alpha_num'"
                data-vv-as="'agentName'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.agentName')">
                {{ errors.first('step-1.agentName') }}
              </banner>
              <p class="italics">
                Your Helm deployment will use with this name
              </p>

            </div>

          </div>

          <div class="row">
            <div class="csm6 cxs12">
              <label for="clusterName">Cluster name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Cluster name"
                name="clusterName"
                v-model="integration.metadata.cluster"
                data-vv-as="'cluster'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.clusterName')">
                {{ errors.first('step-1.clusterName') }}
              </banner>

              <p class="italics">
                If not provided, agent name will be used.
              </p>


            </div>
          </div>

          <div class="row"  v-for="(url, index) in integration.metadata.metric_urls" v-bind:key="index">
            <div class="csm6 cxs12">
              <label v-if="index==0" for="otherMetricUrls">Other metric URLs</label>
            </div>

            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Additional metric URLs to monitor"
                name="otherMetricUrls"
                v-model="integration.metadata.metric_urls[index]" :key="index"
                data-vv-as="'otherMetricUrls'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.otherMetricUrls')">
                {{ errors.first('step-1.otherMetricUrls') }}
              </banner>

              <button v-if="index==integration.metadata.metric_urls.length-1" type="button" class="button default outline" v-on:click="addRow">Add</button>


            </div>



          </div>


          <div class="text-right">
            <button class="button default outline" type="submit">Deploy</button>
          </div>
        </form>

      </tab>

      
      <tab name="Deploy">
        <h3>Deploy agent</h3>
        <p>
          Please store the client_secret and client_id pair shown below to a secure storage.
          You will not be able to retrieve or view client_secret again.
        </p>
        <p>
          Deploy agent to your Kubernetes cluster using the Helm command below. Please create the namespace using Kubectl as instructed below.
          Make sure that Tiller is installed on your cluster.
        </p>
        <p>
          <pre>
            kubectl create namespace {{ integration.metadata.friendly_name }}
          </pre>
          <pre>
            helm repo add cascadeo {{ urls.chart[environment] }}
          </pre>
          <pre>
            helm upgrade --install {{ integration.metadata.friendly_name }} \
            --namespace {{ integration.metadata.friendly_name }} \
            --set client_secret="{{ agentCred.client_secret }}" \
            --set client_id="{{ agentCred.client_id }}" \
            --set platform_url="{{ urls.platform[environment] }}" \
            cascadeo/agent
          </pre>
      </p>

        <form @submit.prevent="step2('step-2')" data-vv-scope="step-2">
          <div class="text-right">
            <button class="button primary outline" type="submit">Done</button>
          </div>
        </form>      
      </tab>

    </tabs>

  </div>

</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

@Component
export default class AgentIntegration extends Vue {
  /* Variables */

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }

  private tabIndex: number = 0;

  private integration: IntegrationData<Agent> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'agent',
    metadata: {
      friendly_name: '',
      cluster: '',
      metric_urls: [''],
    },
  };

  private agentCred: IntegrationCredentials = {
    client_secret: '',
    client_id: '',
  };

  private config: AgentConfig = {
    integration_id: '',
    configuration_id: '',
    configuration: '',
    type: '',
  };

  private agentConfigs: AgentConfig[] = [];

  private environment: string | undefined = process.env.VUE_APP_ENV;

  private urls: object = {
    platform: {
      demo: 'https://platform.demo.cascadeo.io',
      production: 'https://platform.cascadeo.io',
      staging: 'https://platform.staging.cascadeo.io',
      local: 'https://platform.staging.cascadeo.io',
    },
    chart: {
      demo: 'http://charts.cascadeo.io/demo',
      production: 'http://charts.cascadeo.io/stable',
      staging: 'http://charts.cascadeo.io/staging',
      local: 'http://charts.cascadeo.io/staging',
    },
  };


  /* Lifecycle */

  // private created(): void {}

  /* Methods */
  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private addRow(): void {
    this.integration.metadata.metric_urls.push('');
  }

  private step1(scope: string): void {
    this.$validator.validateAll('step-1').then((result) => {
      if (result) {

        // Remove empty strings from url
        let urls = this.integration.metadata.metric_urls ;
        urls = urls.filter((x: string) => x.trim() !== '');
        this.integration.metadata.metric_urls = urls;

        API.Integration.add(this.integration)
          .then((response) => {
            this.integration.id = response.id;
            return API.Integration.addClient(this.integration.id, 'agent');
          })
          .then((response) => {
            this.agentCred.client_secret = response.client_secret;
            this.agentCred.client_id = response.client_id;
            this.gotoTab(this.tabIndex + 1);
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    });
  }

  private step2(scope: string): void {
    // TODO: validate if integration and api keys have been generated properly
    router.replace('/integrations');
  }

}



</script>

<style lang="scss" scoped>
</style>

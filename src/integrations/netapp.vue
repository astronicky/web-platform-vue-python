<template>
  <div>
    <h3>NetApp account</h3>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Environment">


        <div v-if="cmiList.length > 0">
          <p>
            We integration with you NetApp's parent environment. Choose which integration you would
            like to use below.
          </p>

          <p class="bold">NetApp Environment</p>
          <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
            <div v-for="(integration, index) in cmiList" :key="integration.id">

              <div class="env-select">
                <input
                  type="radio"
                  :id="`integration-${index}`"
                  name="cmiIntegration"
                  :value="integration.id"
                  v-model="cmiId"
                  data-vv-as="'NetApp environment'"
                  v-validate="'required'">

                <label :for="`integration-${index}`" class="button default outline normal">
                  <service-image :id="integration.definition_id" class="image" />
                  <div v-if="integration.definition_id === 'aws'" class="grid">

                    <div class="bold ellipsis" :title="integration.name" >
                      <status :integration="integration" icon />
                      {{ integration.name }}
                    </div>
                    <div class="ellipsis" :title="integration.metadata.account_id">{{ integration.metadata.account_id }}</div>
                    <div class="ellipsis" :title="integration.metadata.friendly_name">{{ integration.metadata.friendly_name }}</div>
                  </div>
                  <div v-if="integration.definition_id === 'gcp'" class="grid">
                    <div class="bold ellipsis" :title="integration.name" >
                      <status :integration="integration" icon />
                      {{ integration.name }}
                    </div>
                    <div class="ellipsis" :title="integration.metadata.project_id">{{ integration.metadata.project_id }}</div>
                    <div class="ellipsis" :title="integration.metadata.project_name">{{ integration.metadata.project_name }}</div>
                  </div>
                </label>
              </div>

              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('step-1.cmiIntegration')">
                {{ errors.first('step-1.cmiIntegration') }}
              </banner>
            </div>

            <div class="text-right">
              <button type="submit" class="button default outline">
                Next: Account
              </button>
            </div>
          </form>

        </div>
        <div v-else>
          <p>
            NetApp requires an environment integration to associate with NetApp.
            Choose from the following environments that are currently compatible,
            and then return to finish your NetApp integration.
          </p>
          <br>
          <IntegrationsList :types="['inputs']" :search="['aws', 'gcp']" />
        </div>



      </tab>
      <tab name="Account">
        <form @submit.prevent="step2('step-2')" data-vv-scope="step-2">

          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`integration.metadata.url`" class="bold">URL</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`integration.metadata.url`"
                :name="`integration.metadata.url`"
                v-validate="'required|url'"
                data-vv-as="'URL'"
                placeholder="Name"
                v-model="integration.metadata.url">
              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`integration.metadata.url`)">
                {{ errors.first(`integration.metadata.url`) }}
              </banner>
            </div>
          </div>

          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`integration.metadata.region`" class="bold">Region</label>
            </div>
            <div class="clg4 cmd6 csm9 cxs12">
              <select
                v-model="integration.metadata.region"
                name="netappRegion"
                v-validate="'required'"
                data-vv-as="'NetApp Region'">
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-east-2">us-east-2 (Ohio)</option>
                <option value="us-west-1">us-west-1 (N. California)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
              </select>
              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`integration.metadata.region`)">
                {{ errors.first(`integration.metadata.region`) }}
              </banner>
            </div>
          </div>

          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`integration.metadata.api_key`" class="bold">API Key</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`integration.metadata.api_key`"
                :name="`integration.metadata.api_key`"
                v-validate="'required'"
                data-vv-as="'API Key'"
                placeholder="API Key"
                v-model="integration.metadata.api_key">
              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`integration.metadata.api_key`)">
                {{ errors.first(`integration.metadata.api_key`) }}
              </banner>
            </div>
          </div>

          <div class="row">
            <div class="csm3 cxs12">
              <label :for="`integration.secrets.secret_key`" class="bold">Secret Key</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                :id="`integration.secrets.secret_key`"
                :name="`integration.secrets.secret_key`"
                v-validate="'required'"
                data-vv-as="'Secret Key'"
                placeholder="Secret Key"
                autocomplete="off"
                v-model="integration.secrets.secret_key">
              <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has(`integration.secrets.secret_key`)">
                {{ errors.first(`integration.secrets.secret_key`) }}
              </banner>
              <p class="italics">Note: Your secrets are always stored securely and are encrypted.</p>
            </div>
          </div>

          <div class="text-right">
            <button class="button default link" type="button" @click="tabIndex = 0">
              Back
            </button>
            &nbsp;
            <button class="button default outline" type="submit">
              Finish
            </button>
          </div>
        </form>

      </tab>
    </tabs>


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';
import IntegrationsList from '@/views/main/Integrations/IntegrationsList.vue';

@Component({
  components: {
    IntegrationsList,
  },
})
export default class NetApp extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private cmiId: string = '';
  private integrationsList: Array<Integration<All>> = [];

  private integration: IntegrationData<Netapp> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'netapp',
    secrets: {
      secret_key: '',
    },
    metadata: {
      cmi_integration_id: '',
      telegraf_plugin_type: 'input',
      telegraf_plugin_name: 'netapp_cvs',
      region: 'us-west-2',
      url: '',
      api_key: '',
    },
  };

  get cmiList(): Array<Integration<All>> {
    return this.integrationsList.filter((x) => x.definition_id === 'aws' || x.definition_id === 'gcp');
  }

  /* Lifecycle */
  private mounted(): void {
    API.Integration.get()
      .then((response) => {
        this.integrationsList = response;
      });
  }

  /* Methods */

  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.$set(this.integration.metadata, 'cmi_integration_id', this.cmiId);
        this.tabIndex = 1;
      }
    });
  }

  private step2(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        API.Integration.add(this.integration)
          .then(() => {
            const integration = this.integrationsList.find((x) => x.id === this.cmiId);
            if (!integration) {
              throw new Error('No parent integration selected');
            } else if (integration.definition_id === 'aws') {
              API.Integration.aws.add(integration);
            } else if (integration.definition_id === 'gcp') {
              API.Integration.gcp.start(integration.id, integration.organization_id);
            } else {
              throw new Error('No parent integration selected');
            }
          })
          .then(() => {
            router.replace('/integrations');
            API.UI.addNotification({
              type: 'primary',
              text: 'Add NetApp integration.',
            });
          })
          .catch((error: any) => {
            throw new Error(error);
          });
      }
    });
  }



}

</script>

<style lang="scss" scoped>

.env-select {
  margin-bottom: 1rem;

  label {
    display: flex;
    align-items: center;
    padding: 1rem .5rem;
  }

  .image {
    width: 5rem;
    display: inline-block;
    margin: 0 1.5rem 0 .5rem;
  }
}
</style>

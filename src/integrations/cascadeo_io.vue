<template>
  <div>
    <h3>cascadeo.io Service Logging</h3>
    <br>

    <form @submit.prevent>

      <div class="row">
        <div class="clg3 cmd4 csm4 cxs12">
          <label>Name</label>
        </div>
        <div class="clg5 cmd6 csm8 cxs12">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Integration Name"
            data-vv-as="'Name'"
            v-model="integration.metadata.name"
            v-validate="'required'" />

          <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('name')">
            {{ errors.first('name') }}
          </banner>

          <p class="italics">
            Give this integration a friendly name to reference it by.
          </p>

        </div>
      </div>

      <hr class="default">
      <br>

      <div class="row">
        <div class="clg3 cmd4 csm4 cxs12">
          <p class="bold text-right">Errors</p>
        </div>
        <div class="clg5 cmd6 csm8 cxs12">
          <div>
            <input id="errors" name="errors" type="checkbox" checked disabled>
            <label for="errors">Enabled</label>
          </div>
          <p class="italics">
            Any cascadeo.io system errors. Are always delivered.
          </p>
        </div>
      </div>

      <div class="row">
        <div class="clg3 cmd4 csm4 cxs12">
          <p class="bold text-right">Logs</p>
        </div>
        <div class="clg5 cmd6 csm8 cxs12">
          <div>
            <input id="logs" name="logs" type="checkbox" checked v-model="integration.metadata.logs">
            <label for="logs">Enabled</label>
          </div>
          <p class="italics">
            Alerting on log files around cascadeo.io.
          </p>
        </div>
      </div>

      <div class="row">
        <div class="clg3 cmd4 csm4 cxs12">
          <p class="bold text-right">Statuses</p>
        </div>
        <div class="clg5 cmd6 csm8 cxs12">
          <div>
            <input id="statuses" name="statuses" type="checkbox" checked v-model="integration.metadata.statuses">
            <label for="statuses">Enabled</label>
          </div>
          <p class="italics">
            Statues of integrations and CMI deploys.
          </p>
        </div>
      </div>

      <hr class="default">

      <div class="row">
        <div class="cxs12">
          <div class="text-right">
            <button class="button primary outline" type="submit" @click="save()">
              <i class="fas fa-save"></i>
              Save
            </button>
          </div>
        </div>
      </div>

    </form>

  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component
export default class CascadeoIO extends Vue {

  private integration: IntegrationData<CascadeoIo> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'cascadeo_io',
    metadata: {
      name: '',
      errors: true,
      logs: false,
      statuses: false,
    },
  };

  private save(): void {
    this.$validator.validateAll().then((result) => {
      if (result) {
        API.Integration.add(this.integration)
          .then(() => {
            router.replace('/integrations');
            API.UI.addNotification({
              type: 'primary',
              text: 'Add cascadeo.io integration.',
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
</style>

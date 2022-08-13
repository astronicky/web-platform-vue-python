<template>
  <div>
    <h3>VictorOps Account Information</h3>
    <br>

    <form @submit.prevent>
      <div class="row">
        <div class="csm6 cxs12">
          <label for="victoropsIncidentURL">Victorops Incident URL</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="text"
            name="victorOpsURL"
            id="victorOpsURL"
            placeholder="VictorOps Incident URL"
            data-vv-as="'VictorOps URL'"
            v-model="integration.metadata.incident_uri"
            v-validate="'required|url'" />

          <p class="italics">
            Located in the VictorOps Admin. Setting > Alert Behavior > Integrations > REST
          </p>

          <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('victorOpsURL')">
            {{ errors.first('victorOpsURL') }}
          </banner>
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
export default class Victorops extends Vue {

  private integration: IntegrationData<VictorOps> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'victorops',
    metadata: {
      incident_uri: '',
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
              text: 'Add Victorops integration.',
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

<template>
  <div>
    <h3>Zendesk Account Information</h3>
    <br>

    <form @submit.prevent="add('zendesk')" data-vv-scope="zendesk">
      <div class="row">
        <div class="csm6 cxs12">
          <label for="zendeskApiUrl">Zendesk API URL</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="text"
            placeholder="Zendesk API URL"
            name="zendeskApiUrl"
            v-model="integration.metadata.zendesk_uri"
            v-validate="'required|url:require_protocol'"
            data-vv-as="'Zendesk API URL'"
          >

          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('zendesk.zendeskApiUrl')"
          >
            {{ errors.first('zendesk.zendeskApiUrl') }}
          </banner>

          <p class="italics">e.g. https://YOUR-DOMAIN.zendesk.com/</p>
        </div>
      </div>

      <div class="row">
        <div class="csm6 cxs12">
          <label for="zendeskUsername">Zendesk API Username</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="text"
            placeholder="Zendesk Username"
            name="zendeskUsername"
            v-model="integration.metadata.username"
            v-validate="'required'"
            data-vv-as="'Zendesk Username'"
          >

          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('zendesk.zendeskUsername')"
          >
            {{ errors.first('zendesk.zendeskUsername') }}
          </banner>

          <p class="italics">Zendesk API username/token (e.g, janedoe@mywork.com/token)</p>
        </div>
      </div>

      <div class="row">
        <div class="csm6 cxs12">
          <label for="zendeskPassword">Zendesk API Password</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="password"
            placeholder="Zendesk Password"
            name="zendeskPassword"
            v-model="integration.secrets.password"
            v-validate="'required'"
            data-vv-as="'Zendesk Password'"
          >

          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('zendesk.zendeskPassword')"
          >
            {{ errors.first('zendesk.zendeskPassword') }}
          </banner>

          <p class="italics">API tokens are managed in the Zendesk via Admin > Channels > API</p>
        </div>
      </div>

      <div class="row"></div>

      <div class="text-right">
        <!-- <button class="button default outline" @click="addIntegration()">Next: Access</button> -->
        <button class="button default outline" type="submit">Add</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component
export default class ZendeskIntegration extends Vue {

  private integration: IntegrationData<Zendesk> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'zendesk',
    secrets: {
      password: '',
    },
    metadata: {
      zendesk_uri: '',
      username: '',
    },
  };


  private add(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        API.Integration.add(this.integration)
          .then(() => {
            router.replace('/integrations');
            API.UI.addNotification({
              type: 'primary',
              text: 'Add Zendesk integration.',
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

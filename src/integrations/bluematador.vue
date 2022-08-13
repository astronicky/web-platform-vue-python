<template>
  <div>
    <h3>Blue Matador Account Information</h3>
    <br>

    <form @submit.prevent="add('bluematador')" data-vv-scope="bluematador">
      <div class="row">
        <div class="csm6 cxs12">
          <label for="account_id">Blue Matador Account ID</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="text"
            placeholder="Blue Matador Account ID"
            name="account_id"
            v-model="integration.metadata.account_id"
            v-validate="'required'"
            data-vv-as="'Blue Matador Account ID'"
          >
        </div>
      </div>

      <div class="row">
        <div class="csm6 cxs12">
          <label for="token">Blue Matador API Token</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="password"
            placeholder="Blue Matador API Token"
            name="token"
            v-model="integration.secrets.token"
            v-validate="'required'"
            data-vv-as="'Blue Matador Token'"
          >

          <p class="italics">API tokens are managed in the Blue Matador via Account > API Keys</p>
        </div>
      </div>

      <div class="row">
        <div class="csm6 cxs12">
          <label for="name">Friendly Name</label>
        </div>
        <div class="csm6 cxs12">
          <input
            type="text"
            placeholder="Friendly Name"
            name="name"
            v-model="integration.metadata.name"
            v-validate="'required'"
            data-vv-as="'Friendly Name'"
          >
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
export default class BluemataforIntegration extends Vue {

  private integration: IntegrationData<Bluematador> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'bluematador',
    secrets: {
      token: '',
    },
    metadata: {
      account_id: '',
      name: '',
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
              text: 'Add Blue Matador integration.',
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

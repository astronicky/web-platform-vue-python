<template>
  <div>
        <h2> Add Permission </h2>
        <form @submit.prevent>
          <div class="row">
            <div class="csm4 cxs12">
              <label for="role_id">Role ID</label>
            </div>
            <div class="csm8 cxs12">
              <input disabled v-model="roleID" />
            </div>
          </div>

          <div class="row">
            <div class="csm4 cxs12">
              <label for="resource">Resource</label>
            </div>
            <div class="csm8 cxs12">
              <select v-validate="'required'" v-model="permission.scope">
                <option disabled value="">Please select one</option>
                <option v-for="(scope, i) in availableScopes" v-bind:key="i" v-bind:value="`${scope.resource}:${scope.action}`">
                  {{ `${scope.resource}:${scope.action}` }}
                </option>
              </select>
              <p v-if="!valid" class="italics">
                Resource is required
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('resource')">
                {{ errors.first('resource') }}
              </banner>
            </div>
          </div>


          <div class="row">
            <div class="csm4 cxs12">
              <label for="action">Action</label>
            </div>
            <div class="csm8 cxs12">
              <select v-validate="'required'" v-model="permission.action">
                <option disabled value="">Please select one</option>
                <option value="allow">Allow</option>
                <option value="deny">Deny</option>
              </select>
              <p v-if="!valid" class="italics">
                Action is required
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('action')">
                {{ errors.first('action') }}
              </banner>
            </div>
          </div>

          <div class="row">
            <div class="csm4 cxs12">
            </div>
            <div class="csm8 cxs12">
              <div class="text-right">
                <button class="button default outline" @click="addPermission()" type="submit" :disabled="errors.any()">
                  <i class="fas fa-plus"></i>
                  Add Permission
                </button>
              </div>
            </div>


          </div>

        </form>

  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import Error from '@/views/ErrorPage.vue';

@Component
export default class PermissionAttach extends Vue {
  @Prop()
  private roleID: string;
  private permission: Permission = {scope: '', action: '', role_id: ''};
  private availableScopes: Scope[] = [];
  private valid = true;

  private created() {
    this.getScopes();
  }

  @Watch('roleID')
  private setRoleID() {
    this.permission.role_id = this.roleID;
  }

  private async addPermission() {
    this.valid = await this.$validator.validateAll();
    if (!this.valid ) {
      return;
    }

    let response;
    try {
      response = await API.Permission.add(this.permission);
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'permission could not be added.',
      });
      return;
    }

    API.UI.addNotification({
      type: 'primary',
      text: `permission added successfully.`,
    });

    this.$emit('attachPermissionSucceeded');
  }

  private async getScopes() {
    this.availableScopes = await API.Scope.getScopes();
  }
}

</script>

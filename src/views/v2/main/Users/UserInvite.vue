<template>
  <div class="container">
    <h3 v-if="action == 'add'">Invite User</h3>
    <h3 v-else-if="action == 'edit'">Edit User</h3>

    <form @submit.prevent>
      <div class="row">
        <div class="csm4 cxs12">
          <label for="user_email">Email</label>
        </div>
        <div class="csm8 cxs12">
          <input
            :disabled="action == 'edit'"
            type="text"
            placeholder="User Email"
            name="user_email"
            maxlength="120"
            v-model="user.email"
            v-validate="'required'"
            data-vv-as="'User Email'"
            data-vv-validate-on="submit"/>
          <p v-if="!valid" class="italics">
            The User Email is required.
          </p>
          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('user_email')">
            {{ errors.first('user_email') }}

          </banner>
        </div>
      </div>

      <div v-if="action == 'edit'" class="row">
        <div class="csm4 cxs12">
          <label for="user_email">Email</label>
        </div>
        <div class="csm8 cxs12">
          <input
            :disabled="true"
            type="text"
            placeholder="User Email"
            name="user_email"
            v-model="user.user.email" />
        </div>
      </div>

          <div class="row">
        <div class="csm4 cxs12">
          <label for="user_name">Name</label>
        </div>
        <div class="csm8 cxs12">
          <input
            :disabled="action == 'edit'"
            type="text"
            placeholder="Name"
            name="user_name"
            maxlength="36"
            v-model="user.name"
            v-validate="'required'"
            data-vv-as="'Name'"
            data-vv-validate-on="submit"/>
          <p v-if="!valid" class="italics">
            Name is required.
          </p>
          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('user_name')">
            {{ errors.first('user_name') }}
          </banner>
        </div>
      </div>

      <div class="row">
        <div class="csm4 cxs12">
          <label for="role_id">Role</label>
        </div>
        <div class="csm8 cxs12">
          <select name="role_id" v-validate="'required'" data-vv-as="'Role'" v-model="user.role_id">
            <option disabled value="">Please select one</option>
            <option v-for="(role, i) in filteredRoleList" v-bind:key="i" v-bind:value="role.id">
              {{ role.name }}
            </option>
          </select>
          <p v-if="!valid" class="italics">
            Role is required.
          </p>
          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.has('role_id')">
            {{ errors.first('role_id') }}
          </banner>
        </div>
      </div>

      <div class="row">
        <div class="csm4 cxs12">
        </div>
        <div class="csm8 cxs12">
          <div class="text-right">
            <button class="button default outline" @click="addUser()" type="submit" :disabled="errors.any()">
              <div v-if="action==='add'">
                <i class="fas fa-plus"></i>
                Invite User
                </div>
              <div v-if="action==='edit'">
                <i class="fas fa-save"></i>
                Save
              </div>
            </button>
          </div>
        </div>

      </div>

    </form>

  </div>
</template>

<script lang="ts">
import router from '@/router/router';
import Iam from '@/common/iam';

import { Component, Watch, Vue, Prop } from 'vue-property-decorator';

import API from '@/API';

@Component
export default class UserAdd extends Vue {
  /* Variables */

  @Prop()
  private organizationID: string;

  @Prop()
  private user: UserOrganization;

  @Prop()
  private action: string;

  @Prop()
  private deleteOrgEvent: boolean;

  private roles: Role[] = [];

  private valid: boolean = true;

  private organization: Organization|undefined;

  private ownerRoleID: string = '25906147-1d57-4939-97fb-e9449be51949';

  private mspRoleID: string = 'fa3f6506-9e91-11ec-b909-0242ac120002';

  private filteredRoles: Role[] = [];

  /* Lifecycle */
  private async created(): Promise<void> {
    await this.init();
  }

  /* Methods */
  private async init() {
    // make sure that the current organizationID does not come from a delete event
    if (!this.deleteOrgEvent) {
      this.organization = await API.Organization_v2.get(this.organizationID);
      this.user.organization_id = this.organizationID;
      try {
        this.roles = await API.Role.getAll(this.organizationID, true);
      } catch {
        this.roles = [];
      }
    }
  }

  @Watch('user')
  private async resetForm() {
    this.$validator.reset();
    this.init();
  }

  private async addUser(): Promise<void> {
    let actionDone = '';
    if (this.action === 'add') {
      actionDone = 'invited';
    } else {
      actionDone = 'updated';
    }
    console.log('User: ', await this.user);
    this.user.organization_id = this.organizationID;
    const result = await this.$validator.validateAll();
    if (result) {
      try {
        await API.Organization_v2.InviteUser(this.user, this.user.organization_id);
      } catch (error) {
        if (error.response.status === 400) {
          API.UI.addNotification({
            type: 'danger',
            text: 'User already exists, choose another name.',
          });
        } else {
          API.UI.addNotification({
            type: 'danger',
            text: `User could not be ${actionDone}.`,
          });
        }
        return;
      }

      API.UI.addNotification({
        type: 'primary',
        text: `User ${actionDone} successfully.`,
      });

      this.$emit('updateUserSucceeded', this.user);
    }
  }

  get fullPath() {
    return this.$route.path;
  }

  @Watch('fullPath')
  private async fullPathChanged(newPath: string, oldPath: string) {
    await this.init();
    this.$validator.reset();
  }

  get filteredRoleList(): Role[] {
    // exclude owner role
    this.filteredRoles = this.roles.filter((r) => r.id !== this.ownerRoleID);
    // exclude msp role from the list if the organization is a not a partner org
    if (this.organization?.type !== 'partner') {
      this.filteredRoles = this.filteredRoles.filter((r) => r.id !== this.mspRoleID);
    }
    return this.filteredRoles;
  }

}
</script>

<style lang="scss" scoped>
</style>
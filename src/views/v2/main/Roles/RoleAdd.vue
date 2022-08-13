<template>
  <div>
    <h2>New Role</h2>

    <div class="row">
      <div>

        <form @submit.prevent>
          <div class="row">
            <div class="csm3 cxs12">
              <label for="name">Role Name</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                placeholder="Role Name"
                name="name"
                maxlength="30"
                v-model="role.name"
                v-validate="'required|hyphen|role_name:1|min:2|max:30'"
                data-vv-as="'Role Name'">
              <p class="italics">
                Valid role names include letters, numbers, spaces, single hyphen (-), and
                length between 2 and 30 characters.
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('name')">
                {{ errors.first('name') }}
              </banner>

            </div>
          </div>


          <div class="row">
            <div class="csm3 cxs12">
              <label for="description">Description</label>
            </div>
            <div class="csm9 cxs12">
              <input
                type="text"
                placeholder="Role Description"
                name="description"
                maxlength="30"
                v-model="role.description"
                v-validate="''"
                data-vv-as="'Role Description'">
              <p class="italics">
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('description')">
                {{ errors.first('description') }}
              </banner>


            </div>


          </div>

          <div class="row">
            <div class="csm4 cxs12">
            </div>
            <div class="csm8 cxs12">
              <div class="text-right">
                <button class="button default outline" @click="addRole()" type="submit" :disabled="errors.any()">
                  <i class="fas fa-plus"></i>
                  Add Role
                </button>
              </div>
            </div>


          </div>

        </form>
      </div>
    </div>




  </div>
</template>

<script lang="ts">
import router from '@/router/router';
import Iam from '@/common/iam';

import { Component, Watch, Vue, Prop } from 'vue-property-decorator';

import API from '@/API';

@Component
export default class RoleAdd extends Vue {
  /* Variables */

  private role: Role = {id: '', name: '', organization_id: ''};

  @Prop()
  private modalEnabled: boolean;

  @Prop()
  private organizationID: string;

  /* Lifecycle */
  private async created(): Promise<void> {
    this.$validator.extend('role_name', {
      getMessage(value: any, field: any, data: any) {
        return `${value} is invalid`;
      },
      validate(value: any, field: any) {
        const hyphen_count = field[0];
        const count = value.split('-').length - 1;
        const regex = new RegExp('^[-a-zA-Z0-9 ]+$');
        return !(count > hyphen_count) && regex.test(value);
      },
    });
    await this.init();
  }


  /* Methods */

  @Watch('organizationID')
  @Watch('modalEnabled')
  private reset(newID: string, oldID: string) {
    this.init();
  }

  private init() {
    this.$validator.reset();
    this.role = {id: '', name: '', organization_id: '00000000-0000-0000-0000-000000000000'};
  }

  private async addRole(): Promise<void> {
    const result = await this.$validator.validateAll();
    if (result) {
      let role: Role;
      try {
        role = await API.Role.add(this.role);
      } catch (error) {
        if (error.response.status === 400) {
          API.UI.addNotification({
            type: 'danger',
            text: 'Role already exists, choose another name.',
          });
        } else {
          API.UI.addNotification({
            type: 'danger',
            text: 'Role could not be added.',
          });
        }
        throw new Error('Role could not be added.');
      }

      API.UI.addNotification({
        type: 'primary',
        text: `Role "${role.name}" added successfully.`,
      });


      this.$emit('addRoleSucceeded');

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

}
</script>

<style lang="scss" scoped>
</style>
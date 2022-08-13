<template>
  <keep-alive>
    <div>
      <h1>Role Management</h1>
      <h5>View Role</h5>
      <div class="cxs10">
        <div>
          <banner type="primary" icon="">
            <br>
          <p class="big bold">{{ role.name | capitalize }}</p>
          </banner>
        </div>

      
        <div class="right">
          <!-- Disable until custom roles is released -->
          <button 
          :disabled=true
          id="show-modal" 
          @click="showAddPermission = true" 
          class="button primary outline medium">
            ADD PERMISSION
          </button>
          &nbsp;
          <!-- Disable until custom roles is released -->
          <button
          :disabled=true
          class="button primary outline medium danger">
          DELETE
          </button>
        </div>

        <br/><br/><br/>

      <div>
        <modal v-model="showAddPermission">
          <PermissionAttach 
            :roleID="role.id" 
            @attachPermissionSucceeded="hideAddPermissionModal()" />
        </modal>
      </div>

      

      <div>
        <form @submit.prevent>
          <div class="row">
            <div class="csm2 cxs12">
              <label for="name">Name</label>
            </div>
            <div class="cxs24 clg">
              <input
                :disabled="!enableEdit"
                type="text"
                placeholder="Role Name"
                name="name"
                maxlength="30"
                v-model="role.name"
                v-validate="'required'"
                data-vv-as="'name'">
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('name')">
                {{ errors.first('name') }}
              </banner>

            </div>
          </div>

          <div class="row">
            <div class="csm2 cxs12">
              <label for="description">Description</label>
            </div>
            <div class="cxs24 clg">
              <input
                :disabled="!enableEdit"
                type="text"
                placeholder="Description"
                name="name"
                maxlength="30"
                v-model="role.description"
                v-validate="'required'"
                data-vv-as="'description'">
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('name')">
                {{ errors.first('name') }}
              </banner>

            </div>
          </div>
        </form>

      </div>

      <br/><br/><br/>
      <!-- Permission list -->
      <div>
        <h5>Permissions</h5>
        <hr/>
          <PermissionsList 
            :permissions="role.permissions" 
            @deletePermissionSucceeded="init()"
            :roleID="role.id" />

      </div>

      </div>

    </div>
  </keep-alive>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import PermissionsList from '../Permissions/PermissionsList.vue';
import PermissionAttach from '../Permissions/PermissionAttach.vue';

@Component({
  components: {
    PermissionsList,
    PermissionAttach,
  },
})
export default class RoleView extends Vue {
  @Prop()
  private roleID: string;
  private permissions: [];

  private role: Role = {id: '', name: '', organization_id: ''};
  private enableEdit = false;
  private showAddPermission = false;

  private created() {
    this.init();
  }

  @Watch('roleID')
  private async init() {
    this.role = await API.Role.get(this.roleID);
  }

  private async hideAddPermissionModal() {
    this.showAddPermission = false;
    this.init();
  }

  private async showAddPermissionModal() {
    this.showAddPermission = false;
  }

}
</script>

<style lang="scss" scoped>

</style>
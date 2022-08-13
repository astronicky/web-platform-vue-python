<template>
  <div>
    <div v-if="roles.length === 0" class="csm12 cxs12">
      <p style='text-align: center'><i>Nothing to display or you do not have access to the organization roles</i></p>
    </div>

    <div v-if="roles.length !== 0" class="cxs12">
      <div class="row cxs14 table-header">
          <div class="cxs5">
            Role Name
          </div>
          <!-- Hide Temporarily -->
          <span v-if="!hideTemp">
            <div class="cxs3">
              Role ID
            </div>
            <div class="cxs2">
              Type
            </div>
            <div class="cxs2">
              Actions
            </div>
          </span>
      </div>

      <div class="row cxs14 item"
        v-for="role in roles" :key="role.id"
      >
          <div class="cxs5">
            {{ role.name}}
          </div>
          <!-- Hide Temporarily -->
          <span v-if="!hideTemp">
            <div class="cxs3">
              {{ role.id}}
            </div>
            <div class="cxs2">
              {{ roleType(role.organization_id) }}
            </div>
            <div class="cxs2">
              <router-link :to="`/roles/${role.id}`" class="button primary outline small">
                View
              </router-link>
              &nbsp;&nbsp;-->
              <!-- Disable until custom roles feature is released -->
              <button :disabled=true @click="confirm(`${role.id}`)" class="button primary outline small danger">
                Delete
              </button>
            </div>
          </span>
      </div>

    </div>


    <!-- Confirmation Modal -->
    <modal v-model="showDeleteModal">
      <h2>
        Confirmation
      </h2>

      <p>
        Are you sure you want to delete this role? Make sure no user is using this role.
      </p>
      <button class="button success outline left" @click="deleteRole()" style="margin-right:10px">
        <i class="fas fa-check"></i>
        Yes
      </button> 
      <button class="button default outline left" @click="showDeleteModal = false">
        <i class="fas fa-times"></i>
        No
      </button>
    </modal>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Ability } from '@casl/ability';
import API from '@/API';

@Component
export default class UsersList extends Vue {
  @Prop()
  private organization: Organization;

  @Prop()
  private refresh: number;

  @Prop()
  private ability: Ability<any>;

  private showDeleteModal: boolean = false;

  private roles: Role[] = [];

  private roleID: string = '';

  private hideTemp: boolean = true;

  private created() {
    this.init();
  }

  @Watch('organization.id')
  @Watch('refresh')
  private async init() {
    if (this.organization.id === undefined) {
      return;
    }

    try {
      this.roles = await API.Role.getAll(this.organization.id, true);
    } catch {
      this.roles = [];
    }
  }

  private roleType(id: string): string {
    if (id === '00000000-0000-0000-0000-000000000000') {
      return 'Internal';
    } else {
      return 'User-Defined';
    }
  }

  @Watch('fullPath')
  private async fullPathChanged() {
    await this.init();
  }

  private async deleteRole(): Promise<void> {
    // close modal
    this.showDeleteModal = false;
    try {
      const resp = await API.Role.delete(this.roleID);
      if (resp) {
        API.UI.addNotification({
          type: 'primary',
          text: `Role was successfully removed.`,
        });
        this.init();
      }
    } catch (err) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Role could not be deleted.',
        });
    }
  }

  private confirm(roleID: string) {
    // add prompt
    this.showDeleteModal = true;
    this.roleID = roleID;
  }


}
</script>

<style lang="scss" scoped>
.table-header {
  margin: 0;
  text-transform: capitalize;
  text-align: left;
  font-weight: bold;
}

.item {
  display: flex;
  padding: 1rem 0.75rem;
  border-top: .1rem solid var(--c-gray-300);
  border-bottom: .1rem solid var(--c-gray-300);
  border-left: none;
  border-right: none;
  margin-bottom: -0.1rem;
  text-decoration: none;
  transition: var(--transition-short) all;
}

.item:hover {
  background: none;
  box-shadow: inset .4rem 0 0 var(--c-primary-500);
  cursor: pointer;
  transition: var(--transition-short) all;
}

.cxs12.tree .cxs12 {
   padding-left: 0 !important;
   padding-right: 0 !important;
}
</style>
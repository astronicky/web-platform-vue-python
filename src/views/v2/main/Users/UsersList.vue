<template>
  <div>
    <div v-if="users.length === 0" class="csm12 cxs12">
      <p style='text-align: center'><i>Nothing to display or you do not have access to organization users</i></p>
    </div>

    <div v-if="users.length !== 0" class="cxs12">
      <div class="row cxs14 table-header">
          <!-- <div class="cxs2">
            Name
          </div> -->
          <div class="cxs5">
            Email
          </div>
          <div class="cxs3">
            Role
          </div>
          <div class="cxs2">
            Status
          </div>
          <div class="cxs2">
            Actions
          </div>
      </div>

      <div class="row cxs14 item"
        v-for="user in users" :key="user.id"
      >
          <!-- <div class="cxs2">
            {{user.user.name}}
          </div> -->
          <div class="cxs5">
            {{user.user.email}}
          </div>
          <div class="cxs3">
            {{user.role.name}}
          </div>
          <div class="cxs2">
            {{user.invite_status}}&nbsp;
          </div>
          <div class="cxs2">
            <button @click="triggerEditUserClicked(user)" :disabled="!userCanWithAbilities('edit', ['iam.organization:write'], organization, user)" class="button primary outline small">
              Edit
            </button>
            &nbsp;&nbsp;
            <button @click="confirm(`${user.user.id}`)" :disabled="!userCanWithAbilities('delete', ['iam.organization:write'], organization, user)" class="button primary outline small danger">
              Delete
            </button>
          </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <modal v-model="showDeleteModal">
      <h2>
        Confirmation
      </h2>

      <p>
        Are you sure you want to delete this user? All roles previously saved for this user will not be retrieved back.
      </p>
      <button class="button success outline left" @click="deleteUserFromOrg()" style="margin-right:10px">
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
import Iam from '@/common/iam';
import API from '@/API';
import UserAdd from './UserAdd.vue';

@Component({
  components: {
    UserAdd,
  },
})
export default class UsersList extends Vue {
  @Prop()
  private organization: Organization;

  @Prop()
  private update: number;

  @Prop()
  private ability: Ability<any>;

  private showDeleteModal: boolean = false;

  private defaultCasAdminRoleID: string = 'd7f8b8d6-4c7e-11ec-81d3-0242ac130003';
  private defaultOwnerRoleID: string = '25906147-1d57-4939-97fb-e9449be51949';

  private currentUserId: string;

  private users: UserOrganization[] = [];

  private currentUser: string = Iam.currentUser();

  private created() {
    this.init();
  }

  private confirm(userId) {
    // add prompt
    this.showDeleteModal = true;
    this.currentUserId = userId;
  }

  private async deleteUserFromOrg(): Promise<void> {
    // close modal
    this.showDeleteModal = false;
    try {
      const resp = await API.Organization_v2.deleteUserFromOrg(this.currentUserId, this.organization.id!);
      if (resp) {
        API.UI.addNotification({
          type: 'primary',
          text: `User was successfully removed.`,
        });
        this.init();
      }
    } catch (err) {
       //
    }
  }

  @Watch('organization.id')
  @Watch('update')
  private async init() {
    if (this.organization.id === undefined) {
      return;
    }

    try {
      this.users = await API.Organization_v2.getUsers(this.organization.id!);
    } catch {
      this.users = [];
    }

    this.users.sort((a, b) => {
      const nameA = a.user!.email.toUpperCase();
      const nameB = b.user!.email.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  private triggerEditUserClicked(user: UserOrganization) {
    this.$emit('editUserClicked', user);
  }

  private userCanWithAbilities(action: string, scope: string[], organization: Organization, user: UserOrganization): boolean {
    const res = API.Permission.userCanWithAbilities(this.ability, scope, organization);
    // Owner role should not be deleted
    if (res) {
      if (action === 'delete') {
        // disable delete button for current user
        if (user.user_id === this.currentUser) {
          return false;
        }
        // disable delete button for all Owner Roles
        if (user.role?.id === this.defaultOwnerRoleID || user.role?.id === this.defaultCasAdminRoleID) {
          return false;
        }
      }
      return res;
    }
    return false;
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

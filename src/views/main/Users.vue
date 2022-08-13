<template>
  <div class="container">
    <h1>Users - {{ organization }}</h1>
    <div class="row" style="margin-bottom: 8px">
      <div class="csm10"><div>&nbsp;</div></div>
      <div class="csm2">
        <div class="right">
          <button
            class="button default primary"
            @click="showModal = !showModal"
          >
            <i class="fas fa-user"></i> Invite User
          </button>

          <modal style="width: 100%" v-model="showModal">
            <h2>Invite User</h2>
            <form v-on:submit.prevent="onSubmit">
              <div>
                <input
                  id="inviteEmail"
                  name="inviteEmail"
                  type="text"
                  placeholder="User Email"
                  v-model="inviteEmail"
                  v-validate="'email'"
                  data-vv-as="invite_email"
                />
                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.items.length > 0"
                >
                  Invalid email. Please input a valid email. <br />
                </banner>
                <select id="inviteRole" v-model="inviteRole">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </form>

            <div class="right">
              <button
                class="button default outline"
                @click="inviteUser()"
                type="submit"
                :disabled="errors.any() || isInviteDisabled()"
              >
                <i class="fas fa-user"></i>
                Invite
              </button>
            </div>
          </modal>
        </div>
      </div>
    </div>

    <div class="row">
      <table>
        <thead>
          <tr>
            <th style="padding-left: 40px" class="default">
              User
            </th>
            <th class="default" style="padding: 15px">
              Role
            </th>
            <th class="default" style="padding: 15px">
              Created
            </th>
            <th class="default" style="padding: 15px">
              Last Accessed
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" v-bind:key="user.email">
            <td style="padding-left: 20px" v-if="!user.role.includes('owner')">
              <!--class="button danger link" -->
              <i
                class="fas fa-trash-alt small"
                style="cursor: pointer;"
                @click="showRemoveUser(user)"
                :disabled="disabledAccess"
              />&nbsp; &nbsp;
              {{ user.email }}
              <modal style="width: 100%" v-model="showRemoveModal">
                <h2>Remove User</h2>
                <p>Would you like to remove the user?</p>
                <br />
                <div class="right">
                  <button
                    class="button default medium outline"
                    @click="removeUser()"
                    type="submit"
                  >
                    <i class="fas fa-trash"></i>
                    Remove
                  </button>
                </div>
              </modal>
            </td>
            <td style="padding-left: 40px;" v-if="user.role.includes('owner')">
              {{ user.email }}
            </td>
            <td v-if="user.role.includes('owner')" style="padding: 20px">
              {{ user.role | capitalize }}
            </td>
            <td v-else style="padding: 10px">
              <select
                style="width: 100px"
                v-model="user.role"
                @change="changeRole($event, user)"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
            <td style="padding: 15px">
              {{ user.created | dateTime }}
            </td>
            <td v-if="user.active" style="padding: 15px">
              {{ user.last_login | dateTime }}
            </td>
            <td v-else style="padding: 15px">
              -
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import IAM from '@/common/iam';

// import ProgressBar from '@/components/ProgressBar.vue';
@Component
export default class Settings extends Vue {
  private inviteEmail: string = '';
  private inviteRole: string = 'admin';
  private showModal: boolean = false;
  private showRemoveModal: boolean = false;
  private id: string = '';
  private valid: boolean = false;
  private users: any = [];
  private disabledAccess: boolean = true;
  private currentUser: User;
  private userFields = [
    {
      key: 'email',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Role',
      sortable: true,
    },
  ];

  get organization(): string {
    return API.Organization_v2.getCurrentId();
  }

  @Watch('organization')
  private updateSelected() {
    this.getUsers();
    // This page will be deprecrated, no need to migrate to v2 call
    this.disabledAccess = !IAM.checkAuthz(['owner']);
  }

  private created(): void {
    // This page will be deprecrated, no need to migrate to v2 call
    this.disabledAccess = !IAM.checkAuthz(['owner']);
    this.getUsers();
  }
  private isInviteDisabled(): boolean {
    return this.inviteEmail === '';
  }

  private changeRole(event: any, user: any) {
    const newRole = event.target.value;
    API.User.changeRole(user.user_id, user.email, newRole);
  }

  private showRemoveUser(user: User): void {
    this.showRemoveModal = !this.showRemoveModal;
    this.currentUser = user;
  }

  private async removeUser(): Promise<void> {
    await API.User.removeUser(this.currentUser);
    this.getUsers();
    this.showRemoveModal = false;
  }

  private inviteUser(): void {
    this.$validator.validateAll().then(async (result) => {
      if (result) {
        const found = this.users.find(
          (user: any) => user.email.toLowerCase() === this.inviteEmail.toLowerCase()
        );

        if (found) {
          this.showModal = false;
          API.UI.addNotification({
            type: 'danger',
            text: 'Could not invite user. User already exists in organization.',
          });
        } else {
          this.showModal = false;
          await API.User.inviteUser(this.inviteEmail, this.inviteRole);
          this.users.push({email: this.inviteEmail, role: this.inviteRole});
          this.users.sort((a: any, b: any) => a.email.localeCompare(b.email));
        }
        this.inviteEmail = '';
        this.inviteRole = 'admin';
      }
    });
  }

  private getUsers(): void {
    API.User.logUser().then(() => {
      API.User.getUsers().then((response) => {
        this.users = response;
        this.users.sort((a: any, b: any) => a.email.localeCompare(b.email));
      });
    });
  }
}
</script>

<style lang="scss" scoped>
matrix {
  overflow-x: scroll;
}

table {
  border: 0.1rem solid white;
  padding: 0;
  margin: 0;
  border-spacing: 0;
  width: 100%;
}

table thead {
  padding: 0;
  margin: 0;
}

table th {
  padding: 1 1.5rem;
  margin: 0;
  text-transform: capitalize;
  text-align: left;
  border-bottom: 0.1rem solid white;
}

table th .button {
  font-weight: bold;
  text-transform: capitalize;
  text-align: left;
  padding: auto 0;
  width: 100%;
}

table tr td {
  padding: 0 0.5rem;
  border-bottom: 0.1rem solid white;
}
table tr:last-of-type td {
  border-bottom: none;
}
</style>

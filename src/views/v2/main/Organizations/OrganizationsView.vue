<template>
<keep-alive>
<div>
  <h1>Organization Management</h1>
  <h5>Manage Organization</h5>
  <div class="csm10 cxs12">
      <div>
        <banner type="primary" icon="">
          <br>
        <p class="big bold">{{ organization.name | capitalize }}</p>
        </banner>
      </div>
      <div v-if="showError === true" class="alert-danger">
        Your access to this organization has been revoked. If you think this is a mistake, please contact your supervisor immediately.
      </div>

      <div class="right">
        <button
          :disabled="!can(['iam.organization:write'], organization)"
          @click="showInviteUserModal()" class="button primary outline medium"
          >
          INVITE USER
        </button>

        &nbsp;
        <!-- Hide Temporarily -->
        <span v-if="!hideTemp">
          <button
          :disabled="!can(['iam.organization:write', 'iam.role:write'], organization)"
          v-if="organization.type=='root'"
          @click="showAddRoleModal()" class="button primary outline medium">
            ADD ROLE
          </button>
          &nbsp;
        </span>

        <button
        :disabled="!can(['iam.organization:write'], organization)"
        v-if="organization.type=='root'"
        @click="showAddOrgModal()" class="button primary outline medium">
          ADD ORGANIZATION
        </button>
        &nbsp;

        <button @click="confirm(`${organization.id}`)"
          :disabled="!can(['iam:write'], organization)"
          class="button primary outline medium danger">
        DELETE
        </button>
      </div>

      <br/><br/><br/>

      <div>
          <form @submit.prevent>
            <div class="row">
              <div class="csm2 cxs12">
                <label for="name">Name</label>
              </div>
              <div class="cxs24 clg">
                <input
                  :disabled="!enableEdit || !can(['iam.organization:write'], organization)"
                  type="text"
                  placeholder="Organization Name"
                  name="name"
                  maxlength="30"
                  v-model="organization.name"
                  v-validate="'required|hyphen'"
                  data-vv-as="'Organization Name'">
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
                  placeholder="Organization Description"
                  name="description"
                  maxlength="30"
                  v-model="organization.description"
                  v-validate="''"
                  data-vv-as="'Organization Description'">
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

            <div v-if="organization.type === 'child'" class="row">
              <div class="csm2 cxs12">
                <label for="parent_id">Parent Org</label>
              </div>
              <div class="cxs24 clg">
                <!-- to be changed into drop down with parent id as option-->
                <div class="parentlabel">
                  <router-link
                    v-if="!enableEdit"
                    :to="`/organizations/${organization.parent_id}`">
                    {{parentOrg.name}}
                  </router-link>
                </div>

                <select
                  v-if="enableEdit"
                  v-model="organization.parent_id"
                  :disabled="!enableEdit"
                >
                  <option disabled value="" hidden>Select Parent</option>
                  <option v-for="opts in this.getParentOpts([organization.id])" :disabled=!opts.enabled :key=opts.id :value=opts.id>{{ opts.label }}</option>
                </select>
                <p class="italics">
                </p>
                <banner
                  type="danger"
                  icon="fas fa-exclamation-triangle"
                  v-if="errors.has('parent_id')">
                  {{ errors.first('parent_id') }}
                </banner>

              </div>
            </div>

            <div class="right">
              <button class="button primary outline small" @click="enableEditDesc" :disabled="!can(['iam.organization:write'], organization) || enableEdit">
                <i class="fas fa-pencil"></i>
                Edit
              </button>

              &nbsp;
              <button class="button primary outline small" :disabled="!enableEdit"
              @click="UpdateParent()">
                <i class="fas fa-save"></i>
                Save
              </button>

              &nbsp;
              <button class="button primary outline small" :disabled="!enableEdit"
              @click="cancelEdit()"
              >
              <i class="fas fa-times"></i>
              Cancel</button>
              &nbsp;
            </div>
          </form>
      </div>

  </div>

  <br/><br/>



  <!-- Tree view -->
  <div class="csm10 cxs12">
    <h5>Sub-Organizations</h5>
    <hr/>
      <div v-if="organization.children !== undefined" class="cxs12">
        <div class="row cxs14 tree-header">
            <div class="cxs5">
              Name
            </div>
            <div class="cxs5">
              Description
            </div>
            <div class="cxs2">
              Actions
            </div>
        </div>
        <div class="sub-org">
          <organization-tree
            v-for="organization in organization.children" :key="organization.id"
            :item=organization
            :level=0
            :accessibleOrgs=accessibleOrgs
            :orgName=organization.name
            :viewDeactOrganization=false
            :org_class='"sub-org-class"'
            @deleteOrgSucceeded="refreshSubOrg()"
          >
          </organization-tree>
        </div>
      </div>
      <div v-if="organization.children === undefined" class="csm12 cxs12">
        <p style='text-align: center'><i>Nothing to display</i></p>
      </div>

  </div>

  <br/><br/>

  <!-- User list -->
  <div class="csm10 cxs12">
    <h5>Users</h5>
    <hr/>
      <UsersList
        :organization=organization
        :update=updateUserList
        :ability=ability
        @editUserClicked="showEditUserModal($event)" 
        @getUsersList="onUsersList($event)" 
      />
  </div>

  <br/><br/>

  <!-- Roles list -->
  <div class="csm10 cxs12">
    <h5>Roles</h5>
    <hr/>
      <RolesList
        :organization=organization
        :ability=ability
        :refresh="refreshRoles"
      />

  </div>

  <!-- Confirmation Modal -->
  <modal v-model="showModal">
    <h2>
      Confirmation
    </h2>

    <p>
      Are you sure you want to delete this organization?
    </p>
    <button class="button success outline left" @click="deleteOrg()" style="margin-right:10px">
      <i class="fas fa-check"></i>
      Yes
    </button>
    <button class="button default outline left" @click="showModal = false">
      <i class="fas fa-times"></i>
      No
    </button>
  </modal>

  <!-- Add User Modal -->
  <modal v-model="showUserModal">
    <UserAdd
      :action="userModalAction"
      :user="user"
      :organizationID="organizationID"
      :deleteOrgEvent="deleteOrgEvent"
      @updateUserSucceeded="hideAddUserModal($event)" />
  </modal>

  <modal v-model="showInviteModal">
    <UserInvite
      :action="userModalAction"
      :user="user"
      :organizationID="organizationID"
      :deleteOrgEvent="deleteOrgEvent"
      @updateUserSucceeded="hideInviteUserModal($event)" />
  </modal>

  <modal v-model="addRoleModalEnabled">
    <RoleAdd
      :modalEnabled="addRoleModalEnabled"
      :organizationID="organizationID"
      @addRoleSucceeded="hideAddRoleModal()" />
  </modal>

  <modal v-model="addOrgModalEnabled">
    <OrganizationsAdd
      :parentID="organizationID"
      :modalEnabled="addOrgModalEnabled"
      @addOrgSucceeded="hideAddOrgModal()" />
  </modal>

</div>





</keep-alive>
</template>


<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import API from '@/API';
import Iam from '@/common/iam';
import router from '@/router/router';
import OrganizationsAdd from './OrganizationsAdd.vue';
import OrganizationsTree from './OrganizationsTree.vue';
import UsersList from '../Users/UsersList.vue';
import UserAdd from '../Users/UserAdd.vue';
import UserInvite from '../Users/UserInvite.vue';
import RolesList from '../Roles/RolesList.vue';
import RoleAdd from '../Roles/RoleAdd.vue';

import { Ability } from '@casl/ability';

@Component({
  components: {
    UserAdd,
    UserInvite,
    RoleAdd,
    UsersList,
    RolesList,
    OrganizationsAdd,
    'organization-tree': OrganizationsTree,
  },
})
export default class OrganizationsView extends Vue {
  private ability: Ability<any> = new Ability<any>([]);
  private currentUser: string = Iam.currentUser();

  @Prop()
  private organizationID: string;
  private organization: Organization|undefined = {
    name: '',
    description: '',
  };

  private original: Organization;
  private id: string;
  private enableEdit: boolean = false;
  private showModal: boolean = false;
  private flatOrgs: Array<{label: string, id: string, enabled: boolean}>;
  private organizations: Organization[];

  // User to be added or edited
  private user: UserOrganization = {organization_id: '', user_id: '', email: '', role_id: '', user: {id: '', email: ''}};
  private showUserModal = false;
  private showInviteModal = false;
  private userModalAction = 'add';
  private updateUserList: number = Math.random();

  private selectedOrgId: string;

  private addRoleModalEnabled = false;

  private refreshRoles: number = Math.random();

  private addOrgModalEnabled = false;
  private parentOrg: Organization = {
    name: '',
    description: '',
  };

  private accessibleOrgs = API.Organization_v2.getAccessible();

  private showError: boolean = false;

  private hideTemp: boolean = true;

  private deleteOrgEvent: boolean = false;

  @Watch('organizationID')
  private refresh() {
    this.init();
  }

  // Lifecycle
  private created(): void {
    this.init();
  }

  private async init() {
    await API.Organization_v2.sync(this.currentUser);
    this.accessibleOrgs = API.Organization_v2.getAccessible();

    // We need to get permissions from the web service dynamically because organization is dynamic in this context
    //    as opposed to organization object in integration, pipeline, etc
    this.ability = await API.Organization_v2.getOrgPermissions(this.organizationID, this.currentUser);

    await this.getChildOrgs();
    await this.getParent();

    this.backupOriginal();

    this.$validator.extend('name', {
      getMessage(value: any, field: any) {
        return 'Not a valid organization id.';
      },
      validate(value: any, field: any) {
        /* Rules: A-Za-z, 0-9, single dash, length between 2 and 30 */
        const regex: RegExp = /^[-a-zA-Z0-9]+$/;
        return (regex.test(value) && value.length <= 30 && value.length >= 2);
      },
    });

    this.disableEditDesc();
  }

  // Methods
  private backupOriginal() {
    this.original = JSON.parse(JSON.stringify(this.organization));
  }

  private enableEditDesc() {
    this.enableEdit = true;
  }

  private disableEditDesc() {
    this.enableEdit = false;
  }

  private async UpdateParent() {
    if (this.organization !== undefined) {
      const result = await API.Organization_v2.update(this.organization);
      if (result) {
        this.disableEditDesc();
        this.backupOriginal();
        this.getParent();
      }

    }
  }

  private cancelEdit() {
    this.disableEditDesc();
    this.resetParent();
  }

  private resetParent() {
    this.organization = JSON.parse(JSON.stringify(this.original));
  }

  private async getChildOrgs() {
    this.organizations = API.Organization_v2.getAll();
    const orgNodeTree = API.Organization_v2.getNodeTree(this.organizations, this.organizationID);
    if (orgNodeTree) {
      this.showError = false;
      this.organization = JSON.parse(JSON.stringify(orgNodeTree));
    } else {
      this.showError = true;
    }
  }

  private getParent() {
    const parentid = this.organization!.parent_id;
    const parenttype = this.organization!.type;
    if (parenttype === 'child') {
      const parent = API.Organization_v2.find(parentid!, this.organizations);
      this.parentOrg.name = parent!.name;
    }
  }


  private getParentOpts(exclude: string[]): Array<{label: string, id: string, enabled: boolean}> {
    const accessibleOrgs = Object.keys(API.Organization_v2.getAccessible());
    return API.Organization_v2.flatten(this.organizations, '', accessibleOrgs, exclude);
  }

  private confirm(orgId) {
    // add prompt
    this.showModal = true;
    this.selectedOrgId = orgId;
  }

  private async deleteOrg(): Promise<void> {
    // close modal
    this.showModal = false;
    try {
      const response = await API.Organization_v2.deleteOrg(this.selectedOrgId);
      const organization = response.data;
      API.UI.addNotification({
        type: 'primary',
        text: `Organization "${organization.name}" deleted successfully.`,
      });
      // unset deleted org
      this.deleteOrgEvent = true;
      router.push('/organizations');
    } catch (err) {
        //
    }
  }

  private hideAddUserModal(user: UserOrganization) {
    this.showUserModal = false;

    // random number to trigger user list update
    this.updateUserList = Math.random();

    this.user = {organization_id: '', user_id: '', role_id: '', user: {id: '', email: ''}};
  }

    private hideInviteUserModal(user: UserOrganization) {
    this.showInviteModal = false;

    // random number to trigger user list update
    this.updateUserList = Math.random();

    this.user = {organization_id: '', user_id: '', email: '', role_id: '', user: {id: '', email: ''}};
  }

  private showEditUserModal(user: UserOrganization) {
    this.userModalAction = 'edit';
    this.user = user;
    this.showUserModal = true;
  }

  private showInviteUserModal() {
    this.$validator.reset();
    this.showInviteModal = true;
    this.user = {organization_id: '', user_id: '', email: '', role_id: '', user: {id: '', email: ''}};
    this.userModalAction = 'add';
  }

  // Add role modal
  private showAddRoleModal() {
    this.addRoleModalEnabled = true;
  }
  private hideAddRoleModal() {
    this.addRoleModalEnabled = false;
    this.refreshRoles = Math.random();
  }

  // Add org modal
  private showAddOrgModal() {
    this.addOrgModalEnabled = true;
  }
  private hideAddOrgModal() {
    this.addOrgModalEnabled = false;
    this.init();
  }

  private refreshSubOrg() {
    this.init();
  }

  private can(scope: string[], organization: Organization): boolean {
    return API.Permission.userCanWithAbilities(this.ability, scope, organization);
  }

  private onUsersList(users) {
    if (!users.some(({ user_id }) => user_id === this.currentUser)) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

}

</script>

<style lang="scss" scoped>


.button.primary.outline.medium {
  margin-bottom: 5px;
  margin-top: 5px;
  padding-right: 1rem;

}

.button.primary.outline.small {
  margin-bottom: 5px;
  padding-right: 1rem;
  text-align: right;
}

banner {
  margin-bottom: 5px;
}

input[type="text"]:disabled {
  background: #ccc;
}

.parentlabel {
  font-size: 17px;
  // margin-top: .5rem;
}

.cxs24.clg {
  margin-top: .5rem;
}

@media (prefers-color-scheme: dark) {

  .button.primary.outline.medium {
  margin-bottom: 5px;
  margin-top: 5px;
  padding-right: 1rem;

}

.button.primary.outline.small {
  margin-bottom: 5px;
  padding-right: 1rem;
  text-align: right;
}

banner {
  margin-bottom: 5px;
}

input[type="text"]:disabled {
  background: #ccc;
}

.parentlabel {
  font-size: 17px;
  // margin-top: .5rem;
}

.cxs24.clg {
  margin-top: .5rem;
}

}

.alert-danger{
  width: 100%;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  margin-top: 10px;
  margin-bottom: 10px;
  padding:10px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 5px;;
}

.tree-header {
  margin: 0;
  text-transform: capitalize;
  text-align: left;
  font-weight: bold;
}

.sub-org {
  margin-right: -24px;
  margin-left: -8px;
}
</style>
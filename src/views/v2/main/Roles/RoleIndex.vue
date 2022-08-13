<template>
   <div>
    <div class="row">
      <div class="h1-roles">Roles Management</div>
    <div class="clg2 csx2 cmd2">
      <div class="d-flex search">
        <input type="text" placeholder="Search..." class="header-search" @keyup.enter="searchHandler()" @blur="searchHandler()" v-model="search"  />
        <button @click="searchHandler()" class="search-button">
          <i class="fas fa-search"></i></button>
      </div>
    </div>
    </div>
    <div class="line-bottom"></div>
    <div class="clg10 csx10 cmd9">
    </div>
     <button
        @click="showAddRoleModal()" class="button primary outline medium add-role-button">
        ADD ROLE
    </button>
    <div class="csm12 cxs12">
      <p style='text-align: center'>
        <i v-if="roles.length === 0 && search.length < 1">Nothing to display or you do not have access to the organization roles</i>
        <i v-else-if="roles.length < 1">No Results Found...</i>
        </p>
    </div>

    <div v-if="roles.length !== 0" class="cxs12">
      <div class="row cxs14 table-header">
          <div class="cxs5">
            Role
          </div>
        <div class="cxs2">
            Actions
        </div>
      </div>

      <div class="row cxs14 item"
        v-for="role in roles" :key="role.id"
      >
          <div class="cxs5">
            {{ role.name}}
          </div>
        <div class="cxs2">
            <router-link :disabled="checkRoleName(role.name)" :to="`/admin/roles/${role.id}`" class="button primary outline small">
            Edit
            </router-link>
            &nbsp;&nbsp;
            <!-- Disable until custom roles feature is released -->
            <button :disabled=true @click="confirm(`${role.id}`)" class="button primary outline small danger">
            Delete
            </button>
        </div>
      </div>
    </div>

    <modal v-model="addRoleModalEnabled">
        <RoleAdd
        :modalEnabled="addRoleModalEnabled"
        :organizationID="organizationID"
        @addRoleSucceeded="hideAddRoleModal()" />
    </modal>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import API from '@/API';
import RolesList from '../Roles/RolesList.vue';
import RoleAdd from '../Roles/RoleAdd.vue';
import router from '@/router/router';
@Component({
  components: {
    RolesList,
    RoleAdd,
  },
})
export default class OrganizationsIndex extends Vue {
private organizationID: string = '520a4dc6-4831-11ec-81d3-0242ac130003'; // cascadeo organization id
private roles: Role[] = [];
private search: string = '';
private addRoleModalEnabled = false;
private refreshRoles: number = Math.random();
private organization: Organization|undefined = {
    name: '',
    description: '',
};

  @Watch('organization.id')
  @Watch('refresh')

  // Lifecycle
  private created(): void {
    this.getSearch();
  }

  private showAddRoleModal() {
    this.addRoleModalEnabled = true;
  }

  private hideAddRoleModal() {
    this.addRoleModalEnabled = false;
    this.refreshRoles = Math.random();
    this.search = '';
    this.getSearch();
  }

  private async getSearch(): Promise<void> {
    if (this.search) {
      this.roles = await API.Role.getSearchRole(this.search, this.organizationID);
    } else {
      this.roles = await API.Role.getSearchRole('', this.organizationID);
    }
  }

  private searchHandler() {
    this.getSearch();
  }

  private checkRoleName(name: string) {
    return name === 'Owner' || name === 'Admin' || name === 'User' || name === 'MSP Admin' || name === 'CAS Admin';
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

.header-search {
  width: 300px;
  float: right;
  margin-bottom: 0px;
  @media (max-width: 767px) {
    width: 100%;
  }
  display: inline;
}

.search {
  display: flex;
  @media (max-width: 767px) {
    width: 100%;    
  }
}


.row{
    display: flex;
    justify-content: space-between;
}

.h1-roles {
    margin: 0 0 1.6rem 0;
    font-size: 4.8rem;
    line-height: 1.325;
    letter-spacing: -.15rem;
    word-spacing: 0.5rem;
}

.line-bottom {
    border-bottom: 0.2rem solid var(--c-primary-500);
    margin: -24px 0 10px -4px;
}

.add-role-button {
    margin: 10px 0 10px 0;
}
</style>
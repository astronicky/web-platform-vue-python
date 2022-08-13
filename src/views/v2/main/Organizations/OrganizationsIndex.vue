<template>
  <div>
    <div v-if="showDefaultPortalOrgView()">
      <h1>Organization Management</h1>
      <h5>Manage Organizations</h5>
      <!-- <div class="row">
          <p>
            Manage both your root organizations and child organizations.
            Add, edit or delete users, root organizations, roles, and descriptions here.
          </p>
          <br>
        </div>
      </div> -->
      <br>
    <div class="row">   
      <div class="csx10 cmd9 cxs10">
      <button
      @click="showAddOrgModal()" class="button primary outline medium">
      Add Root Organization
      </button>
      </div>  
      <div class="clg2 csx2 cmd2">
        <div class="d-flex search">
          <input type="text" placeholder="Search..." class="header-search" @keyup.enter="searchHandler()" v-model="search"  />
          <button @click="searchHandler()" class="search-button">
            <i class="fas fa-search"></i></button>
        </div> 
      </div>  
    </div>
    </div>
    <div v-else-if="showAdminPortalOrgView()">
      <span v-if="viewDeactOrganization">
        <div class="h1-deact-orgs">Organization Management</div>
        <div class="text-deact-org bold">DEACTIVATED ORGANIZATIONS</div>
        <hr class="hr-style">
        <div>
          <button
            @click="showActiveOrgs()" class="button primary outline medium">
            View Active Organizations
          </button>
        </div>
      </span>
      <span v-else-if="!viewDeactOrganization">
        <h1>Organization Management</h1>
        <button
          @click="showDeactOrgs()" class="button primary outline medium">
          View Deactivated Organizations
        </button>
      </span>
    </div>

    <div v-else-if="showPartnerPortalOrgView()">
        <h1>Partner Organization Management</h1>
    </div>
    &nbsp;
      <br>
      <div class="search-query" v-if="search.length > 0">Search Query: {{ search }}</div>
      <div class="search-no-result" v-if="organizations.length < 1">No Results Found...</div>
      <br>

    <div class="cxs12 tree">
      <div class="row cxs14 tree-header">
        <div :class="`${!envIsMainPortal() ? 'cxs4': 'cxs5'}`">
          Name
        </div>
        <div :class="`${!envIsMainPortal() ? 'cxs4': 'cxs5'}`">
          Description
        </div>
        <div class="cxs2" v-if="!envIsMainPortal()">
          Partner
        </div>
        <div class="cxs2">
          Actions
        </div>
      </div>
      
       <div v-if="viewDeactOrganization">
        <span v-for="organization in organizations" :key="organization.id">
          <span>
            <organization-tree
              :item=organization
              :level=0
              :actions=true
              :switchbutton=false
              :accessibleOrgs=accessibleOrgs
              :orgName=organization.name
              :viewDeactOrganization=true
              :disableBtn=isFolder
              :is_reactivate=true
              :all_organization=organizations
              @deleteOrgSucceeded="getOrgs()"
              :org_class='"main-org-class"'
            >
            </organization-tree>
          </span>
        </span>
      </div>
      <div v-else-if="!viewDeactOrganization">
        <span v-for="organization in organizations" :key="organization.id">
          <span v-if="organization.is_active">
            <organization-tree
              :item=organization
              :level=0
              :actions=true
              :switchbutton=false
              :accessibleOrgs=accessibleOrgs
              :orgName=organization.name
              :viewDeactOrganization=false
              :disableBtn=isFolder
              @deleteOrgSucceeded="getOrgs()"
              :org_class='"main-org-class"'
            >
            </organization-tree>
          </span>
          <span v-if="!organization.is_active">
            <organization-tree
              :item=organization
              :level=0
              :actions=true
              :switchbutton=false
              :accessibleOrgs=accessibleOrgs
              :orgName=organization.name
              :viewDeactOrganization=false
              :disableBtn=isFolder
              @deleteOrgSucceeded="getOrgs()"
            >
            </organization-tree>
          </span>
        </span>
      </div>
    </div>

    <modal v-model="addOrgModalEnabled">
      <OrganizationsAdd
        :modalEnabled="addOrgModalEnabled"
        @addOrgSucceeded="hideAddOrgModal()" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import Auth from '@/common/auth';
import Iam from '@/common/iam';
import API from '@/API';
import { start } from 'repl';
import OrganizationsAdd from './OrganizationsAdd.vue';
import OrganizationsTree from './OrganizationsTree.vue';

// import Org from '@/types';

interface Route {
  title: string;
  link: string;
  icon: string;
  prod: boolean;
  role: string;
}

@Component({
  components: {
    OrganizationsAdd,
    'organization-tree': OrganizationsTree,
  },
})
export default class IAM extends Vue {
  private currentUser: string = Iam.currentUser();

  private organizations: Organization[] = [];

  private addOrgModalEnabled: boolean = false;

  private search: string = '';

  private isFolder: boolean = false;

  private router_path = router.currentRoute.path;

  private accessibleOrgs = API.Organization_v2.getAccessible();

  private viewDeactOrganization: boolean = false;

  private async created() {
    await this.getOrgs();
  }

  private async getOrgs(): Promise<void> {
    await API.Organization_v2.sync(this.currentUser);
    this.accessibleOrgs = API.Organization_v2.getAccessible();

    if (this.router_path.includes('admin')) {
      this.organizations = await API.Organization_v2.getAllOrganizationTree('');
    } else if (this.router_path.includes('partner')) {
      this.organizations = await API.Organization_v2.getAllOrganizationTree(API.Organization_v2.getCurrentId());
    } else {
      this.organizations = await API.Organization_v2.getUserOrgTree(this.currentUser, this.search);
    }
    this.organizations = API.Organization_v2.sort(this.organizations);

    if (this.search) {
      this.isFolder = true;
    } else {
      this.isFolder = false;
    }
  }
  // Add org modal
  private showAddOrgModal() {
    this.addOrgModalEnabled = true;
    this.$validator.reset();
  }
  private searchHandler() {
    this.getOrgs();
  }

  private hideAddOrgModal() {
    this.addOrgModalEnabled = false;
    this.getOrgs();
  }

  private showDeactOrgs() {
    this.viewDeactOrganization = true;
    this.getOrgs();
  }

   private showActiveOrgs() {
    this.viewDeactOrganization = false;
    this.getOrgs();
  }

  get fullPath() {
    return this.$route.path;
  }

  @Watch('fullPath')
  private async fullPathChanged(newPath: string, oldPath: string) {
    this.getOrgs();
  }

  private showPartnerPortalOrgView(): boolean {
    return this.router_path.includes('partner');
  }

  private showAdminPortalOrgView() {
    if (this.router_path.includes('admin')) {
      return true;
    }
    return false;
  }

  private showDefaultPortalOrgView(): boolean {
    return !this.router_path.includes('partner') && !this.router_path.includes('admin');
  }

   private envIsMainPortal(): boolean {
    if (this.router_path.includes('admin')) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="scss" scoped>

img {
  width: unset;
}

matrix {
  overflow-x: scroll;
}

.text-center {
  text-align: center;
}

.mt-10 {
  margin-top: 10px;
}

.tree-header {
  margin: 0;
  text-transform: capitalize;
  text-align: left;
  font-weight: bold;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 767px) {
    display: block;
  }
}

.header-search {
  width: 300px;
  float: right;
  margin-bottom: 0px;
  @media (max-width: 767px) {
    width: 100%;
  }
}

.header-button {
  width: 200px;

  @media (max-width: 767px) {
    width: 100%;
    margin-bottom: 10px;
  }
}

.search {
  display: flex;
  @media (max-width: 767px) {
    width: 100%;    
  }
}
.search-query {
  margin: 0 0 0 0;
  font-size: 2.0rem;
}
.search-no-result {
  margin: 0 0 0 0;
  font-size: 2.2rem;
}
.h1-deact-orgs {
  margin: 0 0 0 0;
  font-size: 4.8rem;
  line-height: 1.325;
  letter-spacing: -.15rem;
  word-spacing: .5rem;
}

.text-deact-org {
  top: 0rem;
  bottom: 0;
  margin: 0 0 0 .2rem;
  border-top: 0rem;
  border-bottom: 0rem;
  font-size: 1rem;
  color: var(--c-danger-600);
}

hr.hr-style {
  content: '';
  display: block;
  position: relative;
  border-bottom: .16rem solid var(--c-primary-500);
  z-index: -1;
  margin: 0 0 1rem .2rem;
  border-top: 0rem;
}

</style>
<template>
  <div>
    <div>
      <h1>Users</h1>
    </div>
    <div class="clg10 csx10 cmd9">
    </div>
    <div class="clg2 csx2 cmd2">
      <div class="d-flex search">
        <input type="text" placeholder="Search..." class="header-search" @keyup.enter="searchHandler()" v-model="search"  />
        <button @click="searchHandler()" class="search-button">
          <i class="fas fa-search"></i></button>
      </div> 
    </div>
    <div class="search-query" v-if="search.length > 0">Search Query: {{ search }}</div>
    <div class="search-no-result" v-if="users.length < 1">No Results Found...</div>
    <br>

    <div class="cxs12 tree">
      <div class="row cxs14 tree-header">
          <div class="cxs5">
            Name
          </div>
          <div class="cxs5">
            Email
          </div>
          <div class="cxs2">
            Actions
          </div>
      </div>

      <div>
        <span v-for="user in users" :key="user.id">
          <users-tree
            :item=user
            :actions=false
            :disableBtn=isFolder
          >
          </users-tree>
        </span>
      </div>
    </div>

    <!-- <modal v-model="addOrgModalEnabled">
      <OrganizationsAdd
        :modalEnabled="addOrgModalEnabled"
        @addOrgSucceeded="hideAddOrgModal()" />
    </modal> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import Auth from '@/common/auth';
import Iam from '@/common/iam';
import API from '@/API';
import { start } from 'repl';
import UsersTree from './UsersTree.vue';

interface Route {
  title: string;
  link: string;
  icon: string;
  prod: boolean;
  role: string;
}

@Component({
  components: {
    'users-tree': UsersTree,
  },
})

export default class IAM extends Vue {
  private currentUser: string = Iam.currentUser();

  private users: Userv2[] = [];

  private search: string = '';

  private isFolder: boolean;

  private router_path = router.currentRoute.path;

  private async created() {
    await this.getUsers();
  }

  private async getUsers(): Promise<void> {
    this.users = await API.Organization_v2.getAllUsers('');
    if (this.search) {
      this.users = await API.Organization_v2.getUserTree(this.search);
      this.isFolder = true;
    } else {
      this.isFolder = false;
    }
  }

  private searchHandler() {
    this.getUsers();
  }

  // Add org modal
  // private showAddOrgModal() {
  //   this.addOrgModalEnabled = true;
  //   this.$validator.reset();
  // }

  // private hideAddOrgModal() {
  //   this.addOrgModalEnabled = false;
  //   this.getOrgs();
  // }


  get fullPath() {
    return this.$route.path;
  }

  @Watch('fullPath')
  private async fullPathChanged(newPath: string, oldPath: string) {
    this.getUsers();
  }

  private showPartnerPortalOrgView(): boolean {
    return this.router_path.includes('partner');
  }

  private showAdminPortalOrgView(): boolean {
    return this.router_path.includes('admin');
  }

  private showDefaultPortalOrgView(): boolean {
    return !this.router_path.includes('partner') && !this.router_path.includes('admin');
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
  text-shadow: .2rem 0rem 0 var(--c-gray-100), -.2rem 0rem 0 var(--c-gray-100);
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
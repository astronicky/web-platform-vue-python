<template>
  <div class="sidebar">
    <ul>
      <!-- Organizations -->
     <li>
       <transition-group class="orgList" name="orgList-move">
          <!-- Org List -->
          <div
          v-for="org in organizations"
          :key="org.id"
          class="org ellipsis">
            <button button :data-cy="'org-button-' + activeOrg.name"
            @click="openModal()"
            v-bind:disabled="isAdminPortal || isPartnerPortal">
              <div class="orgImg" :style="stringToHash(activeOrg.name)">{{ orgShortName(activeOrg) }}</div>
              <span class="reveal">
                <div class="italics ellipsis" :title="activeOrg.name">{{ activeOrg.name }}</div>
              </span>
            </button>

          </div>
          </transition-group>
          <!-- org tree in sidebar -->
          <div class="container">
          <custom-modal v-model="showModalTree" class="modal">
            <table>
            <div class="cxs12 tree">
              <div class="row cxs14 tree-header">
                  <div class="cxs5">
                    Name
                  </div>
                  <div class="cxs5">
                    Description
                  </div>
                  <div class="cxs5">
                    &nbsp;
                  </div>
              </div>
              <sidebar-tree
                v-for="(organization, index) in organizations" :key="organization.id"
                :item=organization
                :level=0
                :accessibleOrgs=accessibleOrgs
                @selectorg="toTop($event, index), showModalTree=false"
              >
              </sidebar-tree>
            </div>
            </table>
          </custom-modal>
          </div>
        </li>

      <!-- Routes -->

      <div v-if="organizations">
        <li v-for="(route, index) in routes" :key="`route-${index}`">
          <router-link :to="route.link" v-if="route.title && route.link">
            <i :class="route.icon"></i>
            <span>{{ route.title }}</span>
          </router-link>
          <hr v-else />
        </li>

        <li v-if="!isAdminPortal && !isPartnerPortal" class="reveal improve">
           <a href="javascript:void( window.open( 'https://form.jotform.com/212278486669472', 'blank', 'scrollbars=yes, toolbar=no, width=700, height=500' ) ) ">
           ⚡ Click here to let us know how we can improve! ✨ </a>
        </li>

        <li class="reveal">
          <hr />
        </li>
        <!-- Username -->
        <li class="username reveal">
          <!-- Might not be set due to old sign up not requiring names -->
          <!-- <div
          v-if="givenName !== '' && familyName !== ''"
          :title="`${givenName} ${familyName}`"
          class="capitalize">
          <div class="ellipsis">{{ givenName }}</div>
          <div class="ellipsis">{{ familyName }}</div>
        </div>
          <div v-else :title="username" class="capitalize ellipsis">{{ username }}</div>-->
          <div :title="email" class="italics ellipsis">{{ email }}</div>
           <div :title="currentUTCTime" class="italics ellipsis">{{ currentUTCTime }}</div>
        </li>
      </div>
      <!-- Logout -->
      <li>
        <button @click="logout">
          <i class="fas fa-sign-out"></i>
          <span>Logout</span>
        </button>
      </li>
    </ul>
  </div>
</template>
;'

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import router from '@/router/router';
import Iam from '@/common/iam';
import API from '@/API/';
import OrganizationsView from './main/Organizations/OrganizationsView.vue';
import Organizations from '@/API/Organization';
import { identity, initial } from 'lodash';
import SidebarTree from './main/Organizations/SidebarTree.vue';
import { Interface } from 'readline';
import moment from 'moment';


interface Route {
  title: string;
  link: string;
  icon: string;
  prod: boolean;
  role: string;
}



@Component({
  components: {
    'sidebar-tree': SidebarTree,
  },
})
export default class Sidebar extends Vue {
  public isCasAdmin: boolean = false;
  public isMspAdmin: boolean = false;
  public isAdmin: boolean = false;
  public isOwner: boolean = false;
  public isAdminPortal: boolean = router.currentRoute.path.includes('admin');
  public isPartnerPortal: boolean = router.currentRoute.path.includes('partner');
  private isProd: boolean = false;
  private showModal: boolean = false;
  private showModalTree: boolean = false;
  private currentOrgId: string | undefined;
  private currentUser: string = Iam.currentUser();
  private email: string = Iam.currentUserEmail();
  private path: string = router.currentRoute.path;
  private isRootOrg: boolean = false;
  private currentUTCTime: any = `UTC: ${moment.utc().format('LLL')}`;

  private accessibleOrgs = API.Organization_v2.getAccessible();

  /** Matches routes to the `router.ts` file. Use an object with no props for an <hr> */
  private routes: Route[] = [
    { title: '', link: '', icon: '', prod: true, role: 'user' },
    {
      title: 'Integrations',
      link: '/integrations',
      icon: 'fas fa-plug',
      prod: true,
      role: 'user',
    },
    {
      title: 'Pipelines',
      link: '/pipelines',
      icon: 'fas fa-code-branch',
      prod: true,
      role: 'user',
    },
    {
      title: 'Dashboards',
      link: '/dashboard',
      icon: 'fas fa-chart-bar',
      prod: true,
      role: 'user',
    },
    {
      title: 'IAM & Organizations',
      link: '/organizations',
      icon: 'fas fa-pencil',
      prod: true,
      role: 'user',
    },
    // {
    //   title: 'Organization Budget',
    //   link: '/orgdashboard',
    //   icon: 'fas fa-chart-bar',
    //   prod: true,
    //   role: 'user',
    // },
    {
      title: 'Settings',
      link: '/settings',
      icon: 'fas fa-cog',
      prod: true,
      role: 'user',
    },
    {
      title: 'Support',
      link: '/support',
      icon: 'fas fa-life-ring',
      prod: true,
      role: 'user',
    },
  ];
  private governance_routes: Route[] = [
    {
      title: 'Governance',
      link: '/governance',
      icon: 'fas fa-landmark',
      prod: false,
      role: 'user',
    },
  ];
  private insights_routes: Route[] = [
    {
      title: 'Insights',
      link: '/insights',
      icon: 'fas fa-brain',
      prod: false,
      role: 'user',
    },
  ];
  private homedashboard_routes: Route[] = [
    {
      title: 'Home',
      link: '/homedashboard',
      icon: 'fas fa-home',
      prod: false,
      role: 'user',
    },
  ];
  private default_routes: Route[] = [
    { title: '', link: '', icon: '', prod: true, role: 'user' },
    {
      title: 'Integrations',
      link: '/integrations',
      icon: 'fas fa-plug',
      prod: true,
      role: 'user',
    },
    {
      title: 'Pipelines',
      link: '/pipelines',
      icon: 'fas fa-code-branch',
      prod: true,
      role: 'user',
    },
    {
      title: 'Dashboards',
      link: '/dashboard',
      icon: 'fas fa-chart-bar',
      prod: true,
      role: 'user',
    },
    {
      title: 'IAM & Organizations',
      link: '/organizations',
      icon: 'fas fa-pencil',
      prod: true,
      role: 'user',
    },
    {
      title: 'Inventory',
      link: '/asset-manager',
      icon: 'fas fa-cabinet-filing',
      prod: true,
      role: 'user',
    },
  ];

  private support_settings_routes: Route[] = [
    {
      title: 'Settings',
      link: '/settings',
      icon: 'fas fa-cog',
      prod: true,
      role: 'user',
    },
    {
      title: 'Support',
      link: '/support',
      icon: 'fas fa-life-ring',
      prod: true,
      role: 'user',
    },
  ];

  private admin_routes: Route[] = [
    { title: '', link: '', icon: '', prod: true, role: 'user' },
    {
      title: 'Dashboards',
      link: '/admin/dashboard',
      icon: 'fas fa-tachometer',
      prod: true,
      role: 'user',
    },
    {
      title: 'Organizations',
      link: '/admin/organizations',
      icon: 'fas fa-pencil',
      prod: true,
      role: 'user',
    },
    {
      title: 'Users',
      link: '/admin/users',
      icon: 'fas fa-user',
      prod: true,
      role: 'owner',
    },
    {
      title: 'Roles',
      link: '/admin/roles',
      icon: 'fas fa-users-cog',
      prod: true,
      role: 'owner',
    },
    {
      title: 'Governance Policies',
      link: '/admin/policies',
      icon: 'fas fa-file-check',
      prod: true,
      role: 'owner',
    },
    {
      title: 'Back to IO Portal',
      link: '/integrations',
      icon: 'fas fa-exchange',
      prod: true,
      role: 'user',
    },
  ];

  private partner_routes: Route[] = [
    { title: '', link: '', icon: '', prod: true, role: 'user' },
    {
      title: 'Dashboard',
      link: '/partner/dashboard',
      icon: 'fas fa-tachometer',
      prod: true,
      role: 'user',
    },
    {
      title: 'Organizations',
      link: '/partner/organizations',
      icon: 'fas fa-pencil',
      prod: true,
      role: 'user',
    },
    {
      title: 'Users',
      link: '/partner/users',
      icon: 'fas fa-user',
      prod: true,
      role: 'owner',
    },
    {
      title: 'Back to IO Portal',
      link: '/integrations',
      icon: 'fas fa-exchange',
      prod: true,
      role: 'user',
    },
  ];

  // Lifecycle
  private async init(currentOrgId: any) {
    // reset default values
    const org = API.Organization_v2.getActive();
    this.isProd = process.env.VUE_APP_ENV === 'production' ? true : false;
    this.isRootOrg = org.parent_id === '00000000-0000-0000-0000-000000000000' ? true : false;
    this.isCasAdmin = false;
    this.isMspAdmin = false;
    this.isAdmin = false;
    this.isOwner = false;


    // get user role
    const users = await API.Organization_v2.getUsers(currentOrgId);
    let roleElem: any;
    users.forEach((userElem) => {
      if (userElem.user_id === this.currentUser) {
        roleElem = userElem.role;
        for (const [key, value] of Object.entries(roleElem)) {
          // special role for cas admin user
          if (key === 'id' && value === 'd7f8b8d6-4c7e-11ec-81d3-0242ac130003') {
            this.isCasAdmin = true;
          } else if (key === 'id' && value === 'fa3f6506-9e91-11ec-b909-0242ac120002') {
            // special role for msp admin user
            this.isMspAdmin = true;
          } else if (key === 'id' && value === '0a045f0f-a7c2-4857-ad41-ae18042bc22a') {
            // if the role is Admin
            this.isAdmin = true;
          } else if (key === 'id' && value === '25906147-1d57-4939-97fb-e9449be51949') {
            // if the role is Owner
            this.isOwner = true;
          }
        }
      }
    });

    // assign routes[] value
    /* if the User Role is an Admin or an Owner, the Org is Root Org, and the Environment is not Production */
    if ((this.isOwner || this.isAdmin) && this.isRootOrg && !this.isProd) {
      this.routes = this.default_routes.concat(this.homedashboard_routes);
      this.routes = this.routes.concat(this.governance_routes);
      this.routes = this.routes.concat(this.insights_routes);
      this.routes = this.routes.concat(this.support_settings_routes);
    /* else Governance Page will not show */
    } else {
      this.routes = this.default_routes.concat(this.support_settings_routes);
    }

    // Admin or Portal Routes
    if (router.currentRoute.path.includes('admin')) {
      // Admin routes
      this.routes = this.admin_routes;
    } else if (router.currentRoute.path.includes('partner')) {
      // Portal routes
      this.routes = this.partner_routes;
    } else {
      // Main routes
      // this.routes = this.default_routes.concat(this.support_settings_routes);
      // Added link to admin/parter portal
      if (this.isCasAdmin) {
        this.routes = this.routes.concat([{
          title: 'Admin Portal',
          link: '/admin',
          icon: 'fas fa-exchange',
          prod: true,
          role: 'user',
        }]);
      } else if (this.isMspAdmin) {
        this.routes = this.routes.concat([{
          title: 'Partner Portal',
          link: '/partner',
          icon: 'fas fa-exchange',
          prod: true,
          role: 'user',
        }]);
      }
    }
    setInterval(() => {
      this.currentUTCTime = `UTC: ${moment.utc().format('LLL')}`;
    }, 1000);
  }

  private redirect() {
    // redirect non-admin users accessing /admin directory
    if (this.isAdminPortal === false && router.currentRoute.path.includes('admin')) {
      router.push('/organizations');
    }

    // redirect non-partner users accessing /partner directory
    if (this.isPartnerPortal === false && router.currentRoute.path.includes('partner')) {
      router.push('/organizations');
    }

    // integration as default page
    if (router.currentRoute.path.includes('integrations')) {
      router.go(0);
    } else {
      router.push('/integrations');
    }
  }

  private created(): void {
    // check if user is cascadeo admin or regular users
    this.currentOrgId = this.activeOrg.id;
    // set local vars
    this.init(this.currentOrgId);
  }

  /* Data needs to be init but blank to reactivity, this filters out original empty */

  get organizations(): Organization[] {
    const orgs = API.Organization_v2.getAll().filter(
      (org) => org.name !== ''
    );
    const activeOrg = orgs.splice(0, 1);
    orgs.sort((a, b) => {

      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;

    });

    return activeOrg.concat(orgs);
  }

  get list(): Organization[] {
    // refresh list of accessible orgs to prevent disabled newly added org
    this.accessibleOrgs = API.Organization_v2.getAccessible();
    const orglist = API.Organization_v2.getAll();
    return orglist;
  }

  get activeOrg(): Organization {
    this.accessibleOrgs = API.Organization_v2.getAccessible();
    const orgs = this.organizations;
    const accessibleOrgs = this.accessibleOrgs;
    let active = API.Organization_v2.getActive();
    let activeWithAccess = false;

    // make sure that there is atleast one org in the orgs list
    if (Object.keys(accessibleOrgs).length > 0) {
      // make sure that the active org is accessible
      for (const x of Object.keys(accessibleOrgs)) {
        if (accessibleOrgs[x].organization_id === active.id) {
          // check if the current active org is accessible
          activeWithAccess = true;
          break;
        }
      }

      if (!activeWithAccess) {
        // get the nearest accessible org
        // set new active org
        for (const i in orgs) {
          if (accessibleOrgs[orgs[i].id!]) {
            active = orgs[i];
            activeWithAccess = true;
            break;
          }
        }

        // if user has no access to parent orgs, sweep to child orgs
        if (!activeWithAccess) {
          let nearestOrgId;
          for (const x of Object.keys(accessibleOrgs)) {
            if (accessibleOrgs[x].organization_id) {
              nearestOrgId = accessibleOrgs[x].organization_id;
              break;
            }
          }
          active = API.Organization_v2.find(nearestOrgId, orgs)!;
        }
      }
    }

    API.Organization_v2.setActive(active);
    // re-assign sidebar on active org update
    this.init(active.id);
    return active;
  }

  private openModal() {
    if (this.list.length > 0) {
      this.showModalTree = true;
    } else {
      this.showModalTree = false;
    }
  }

  private logout() {
    Iam.signOut();
  }

  private orgShortName(org: Organization): string {
      // const org = this.organizations;
    let orgName: string[] = [];
    /* Regex splits on ' ', '-', and '_' into words in Array */

    /* Use org id instead */
    orgName = org.name.split(/[-_\s]/, 2);


    if (orgName.length >= 2) {
      /* There are 2 words, first letter of each */
      return `${orgName[0].substring(0, 1)}${orgName[1].substring(0, 1)}`;
    } else {
      /* There is only 1 or 0 words */
      if (orgName[0].length === 1) {
        /* 1 word / 1 letter, just take 1 letter */
        return orgName[0].substring(0, 1);
      }
      return orgName[0].substring(0, 2); /* 1 word, take first 2 letters */
    }
  }

  private async toTop(selectedOrg: Organization, index: number): Promise<any> {
    // /* Swaps orgs */
    const selectedIndex = this.organizations.findIndex((el) => el.id === selectedOrg.root_id);
    const rootOfSelected = this.organizations.splice(selectedIndex, 1);
    this.organizations.unshift(rootOfSelected[0]);

    // Persist to local storage
    API.Organization_v2.setAll(this.organizations);
    API.Organization_v2.setActive(selectedOrg);

    // TODO: IOP-1162. Re-instate for iam v2
    const mode = localStorage.getItem('mode');
    if (mode !== 'v2') {
      API.User.logUser();
    }

    API.UI.addNotification({
      type: 'primary',
      text: `Swapped to ${selectedOrg.name}.`,
    });

    await this.sleep(3000);
    this.redirect();

  }

  private sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private stringToHash(id: string): object {
    /* tslint:disable:no-bitwise */
    let hash: number = 0;
    if (id.length === 0) {
      hash = 0;
    }
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    hash = hash % 360;
    return {
      border: `.05rem solid hsl(${hash},95%,30%)`,
      background: `hsl(${hash},95%,80%)`,

    };
  }

}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 6rem;
  min-height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow-x: hidden;
  overflow-y: auto;

  background-image: linear-gradient(
      20deg,
      var(--c-primary-800),
      var(--c-primary-600)
    ),
    url('~@/assets/cloud1_soft.jpg');
  background-size: cover;
  background-position: 50% 0%;
  background-blend-mode: multiply;
  box-shadow: 0rem 0rem 0rem transparent;
  z-index: 3;
  transition: var(--transition-medium) width;

  &:hover {
    width: 26rem;
    box-shadow: 0rem 0rem 1rem var(--c-primary-900);
    transition: var(--transition-short) width;
  }
}

ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100%;
  text-shadow: 0rem -0.1rem 0rem var(--c-primary-900);
}

li {
  margin: 0;
  flex: 0 0 auto;
}

li:last-of-type {
  margin-top: auto;
}

a,
button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 4.5rem;
  padding-left: 0.5rem;
  padding-right: 1.15rem;
  border: none;
  border-left: 0.5rem solid transparent;
  background: transparent;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--c-gray-100);
  font-size: 1.6rem;
  line-height: 1.45;
  text-align: left;
  transition: var(--transition-short) all;

  &:hover {
    padding-left: 1rem;
    border-left: 0.5rem solid var(--c-primary-500);
    color: var(--c-primary-500);
    background: var(--c-primary-900);
    transition: var(--transition-short) all;
  }

  &:focus,
  &:active,
  &.active {
    color: var(--c-primary-900);
    background: var(--c-gray-100);
    border-left: 0.5rem solid var(--c-primary-500);
    text-shadow: none;
    transition: var(--transition-short) all;
  }

  .fas {
    font-size: 1.6rem;
    flex: 0 0 2rem;
    margin: 0 1.5rem 0 1rem;
    text-align: center;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 1;
    transition: var(--transition-medium) opacity;
  }
}

//displays text in sidebar
.sidebar:hover a span,
.sidebar:hover button span {
  opacity: 1;
  transition: var(--transition-short) opacity;
}

hr {
  border-top: 0.1rem solid var(--c-primary-500);
  margin: 0;
}

.username {
  color: var(--c-gray-100);
  padding: 1rem 2.25rem;
}

/* Improve */

.improve a {
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-transform: initial;
  line-height: 1.2;
  height: 6.5rem;
  width: 23rem;
}

/* Organizations */

.org {
  a.active,
  a:focus,
  button.active,
  button:focus {
    background: none;
  }

  span {
    font-size: 1.4rem;
    color: var(--c-gray-100);
    text-transform: initial;
  }

  .orgImg {
    flex: 0 0 3rem;
    height: 3rem;
    border-radius: 999rem;
    margin: 0 1rem 0 0.5rem;
    text-align: center;
    line-height: 1.8;
    font-weight: 700;
    background: white;
    color: var(--c-gray-900);
    text-transform: initial;

    .fas {
      position: relative;
      top: 0.05rem;
      margin: 0;
    }
  }
}

.orgList .org {
  height: 0;
  opacity: 0;
  transition: var(--transition-medium) all;
}

.orgList .org:first-of-type {
  opacity: 1;
  height: 4.5rem;
}

// .orgList:hover .org{
//   height: 4.5rem;
//   opacity: 1;
//   transition: var(--transition-medium) all;
// }



.modal{
  border-radius: 10em !important;
}

.modal .org{
  height: 1.5rem;
  opacity: 1;
}



/* Animation */

.orgList-move {
  transition: transform var(--transition-long);
}

/* Misc */

.sidebar .reveal {
  opacity: 0;
  transition: var(--transition-medium) opacity;
}
.sidebar:hover .reveal {
  opacity: 1;
  transition: var(--transition-short) opacity;
}

.sidebar::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

/* Compact UI */

[compact-ui] .sidebar a,
[compact-ui] .sidebar button {
  height: 4rem;
  padding-top: 0.5rem;
  padding-bottom: 0.65rem;
  font-size: 1.4rem;
}

/* Optical adjustments */
[compact-ui] .sidebar .orgImg {
  position: relative;
  top: -0.05rem;
  flex: 0 0 2.55rem;
  height: 2.5;
  line-height: 2.4rem;
  margin: 0 0.85rem 0 0.7rem;
}


table {
  margin: 1rem 1rem 1rem 1rem;
  padding-right: 2rem;
  width: 100%;



  th {
    text-transform: uppercase;
    font-size: 1.2rem;
    color: white;
    padding-bottom: 1em;
    text-align: center;
  }

}

table tr td {
  border: 1 rem solid white;
}

.tree-header {
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  // font-weight: bold;
  font-size: 1.7rem;
  color: white
}


</style>
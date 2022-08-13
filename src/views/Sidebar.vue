<template>
  <div class="sidebar">
    <ul>
      <!-- Organizations -->
      <li>
        <transition-group class="orgList" name="orgList-move">
          <!-- Org List -->
          <div
            v-for="(org) in organizations"
            :key="org.organization_id"
            class="org ellipsis"
          >
            <button :data-cy="'org-button-' + org.organization_id"
            @click="showModal = false"
            v-if="organizations.length==1">
              <div class="orgImg" :style="stringToHash(org.organization_id)">{{ orgShortName(org) }}</div>
              <span class="reveal">
                <div class="italics ellipsis" :title="org.organization_id">{{ org.organization_id }}</div>
              </span>
            </button>


            <button :data-cy="'org-button-' + org.organization_id"
            @click="showModal = true"
            v-else>
              <div class="orgImg" :style="stringToHash(org.organization_id)">{{ orgShortName(org) }}</div>
              <span class="reveal">
                <div class="italics ellipsis" :title="org.organization_id">{{ org.organization_id }}</div>
              </span>
            </button>

          </div>


        </transition-group>

        <!-- display modal -->
          <custom-modal v-model="showModal" class="modal">
            <table>
              <!-- <v-simple-table dark class="table-org"> -->
                  <thead>
                    <th>Organization</th>
                    <!-- <th>Description</th> -->
                  </thead>
                    <tbody>
                      <tr v-for="(org, index) in organizations"
                        :key="org.organization_id"
                        @click="toTop(index), showModal = false"
                        class="org"
                      >
                        <td>
                          <button button :data-cy="'org-button-' + org.organization_id" v-if="index==0">
                            <i class="fas fa-check c-success-500"></i>
                            <div class="orgImg" :style="stringToHash(org.organization_id)">{{ orgShortName(org) }}</div>
                            <span>
                            <div class="ellipsis" :title="org.organization_id">{{ org.organization_id }}</div>
                            </span>
                          </button>

                          <button button :data-cy="'org-button-' + org.organization_id" v-else>
                            <i class="fas fa-genderless"></i>
                            <div class="orgImg" :style="stringToHash(org.organization_id)">{{ orgShortName(org) }}</div>

                            <span>
                            <div class="ellipsis" :title="org.organization_id">{{ org.organization_id }}</div>
                            </span>
                          </button>

                        </td>

                      </tr>
                    </tbody>
              <!-- </v-simple-table> -->
            </table>
          </custom-modal>

          <!--
          <div :key="0" @click="manageOrg()" class="org ellipsis bg-primary-500">
            <button>
              <div class="orgImg">
                <i class="fas fa-pencil-alt c-primary-700"></i>
              </div>
              <span class="reveal">
                <div class="bold ellipsis" title="Manage Organizations">Manage Organizations</div>
              </span>
            </button>
          </div> -->


           <div :key="0" @click="addOrg()" class="org ellipsis bg-primary-500">
            <button>
              <div class="orgImg">
                <i class="fas fa-plus c-primary-700"></i>
              </div>
              <span class="reveal">
                <div class="bold ellipsis" title="No Organization">New Organization</div>
                <div class="italics ellipsis" title="Click to Add">Click to Add</div>
              </span>
            </button>
          </div>
      </li>

      <!-- Routes -->

      <div v-if="organizations">
        <li v-for="(route, index) in nonProdRoutes()" :key="`route-${index}`">
            <router-link :to="route.link" v-if="route.title && route.link">
            <i :class="route.icon"></i>
            <span>{{ route.title }}</span>
            </router-link>
          <hr/>
        </li>
        <li class="reveal improve">
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


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import Auth from '@/common/auth';
import IAM from '@/common/iam';
import API from '@/API';


interface Route {
  title: string;
  link: string;
  icon: string;
  prod: boolean;
  role: string;
}



@Component
export default class Sidebar extends Vue {
  private isProd: boolean = process.env.NODE_ENV === 'production';
  private username: string = API.User.getUsername();
  private email: string = API.User.getUserEmail();
  private showModal: boolean = false;
  private authUser: boolean = false;
  // private familyName: string = API.User.getFamilyName();
  // private givenName: string = API.User.getGivenName();
  /** Matches routes to the `router.ts` file. Use an object with no props for an <hr> */
  private routes: Route[] = [
    { title: '', link: '', icon: '', prod: true, role: 'user' },
    // { title: 'Dashboard',       link: '/dashboard',       icon: 'fas fa-tachometer',    prod: true },
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
      title: 'Dashboard',
      link: '/dashboard',
      icon: 'fas fa-chart-bar',
      prod: true,
      role: 'user',
    },
    // {
    //   title: 'Dashboardv2',
    //   link: '/dashboardv2',
    //   icon: 'fas fa-chart-bar',
    //   prod: true,
    //   role: 'user',
    // },
    {
      title: 'Support',
      link: '/support',
      icon: 'fas fa-life-ring',
      prod: true,
      role: 'user',
    },
    {
      title: 'Users',
      link: '/users',
      icon: 'fas fa-user',
      prod: true,
      role: 'owner',
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: 'fas fa-cog',
      prod: true,
      role: 'user',
    },
    { title: '', link: '', icon: '', prod: false, role: 'owner' },
    {
      title: 'UI Kit',
      link: '/kit',
      icon: 'fas fa-paint-brush',
      prod: false,
      role: 'user',
    },
    {
      title: 'Play',
      link: '/play',
      icon: 'fas fa-bomb',
      prod: false,
      role: 'user',
    },
    {
      title: 'API Tester',
      link: '/api',
      icon: 'fas fa-utensils-alt',
      prod: false,
      role: 'user',
    },
    // { title: 'Thresholds',      link: '/thresholds',      icon: 'fas fa-sliders-h-square',  prod: false },
    {
      title: 'Forms',
      link: '/forms',
      icon: 'fas fa-edit',
      prod: false,
      role: 'user',
    },
    {
      title: 'Logs',
      link: '/logs',
      icon: 'fas fa-newspaper',
      prod: false,
      role: 'user',
    },
    {
      title: 'Inventory',
      link: '/asset-manager',
      icon: 'fas fa-cabinet-filing',
      prod: false,
      role: 'user',
    },
    {
      title: 'Governance',
      link: '/governance',
      icon: 'fas fa-landmark',
      prod: false,
      role: 'user',
    },
    {
      title: 'Insights',
      link: '/insights',
      icon: 'fas fa-brain',
      prod: false,
      role: 'user',
    },
    { title: '', link: '', icon: '', prod: true, role: 'user' },
  ];

  /* Data needs to be init but blank to reactivity, this filters out original empty */
  get organizations(): Org[] {
    const orgs = API.Organization.getAll().filter(
      (org) => org.organization_id !== ''
    );
    if (IAM.checkAuthz(['admin'])) {
      this.authUser = true;
      console.log(IAM.checkAuthz(['admin']));
    }

    // remove first org (this is the active org)
    const activeOrg = orgs.splice(0, 1);

    orgs.sort((a, b) =>  {
      const nameA = a.organization_id.toUpperCase();
      const nameB = b.organization_id.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // active org must always be first
    return activeOrg.concat(orgs);
  }


  private logout() {
    Auth.logout();
  }

  private orgShortName(org: Org): string {
    let orgName: string[] = [];
    /* Regex splits on ' ', '-', and '_' into words in Array */
    if (org.label) {
      /* If label exists, use it */
      orgName = org.label.split(/[-_\s]/, 2);
    } else {
      /* Use org id instead */
      orgName = org.organization_id.split(/[-_\s]/, 2);
    }

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



  private toTop(index: number): void {
    /* Swaps orgs */
    if (this.organizations && this.organizations.length > 1) {
      const sortedOrgs: Org[] = [];
      const tempOrgs: Org[] = JSON.parse(JSON.stringify(this.organizations));

      /* Moves selected org to top */
      sortedOrgs.push(tempOrgs.splice(index, 1)[0]);
      sortedOrgs[0].order_by = 0;

      /* Adds the rest of the orgs and reassigns 'order_by' */
      let i: number = 1;
      tempOrgs.forEach((org: Org) => {
        org.order_by = i;
        sortedOrgs.push(org);
        i++;
      });

      API.Organization.setAll(sortedOrgs);
      API.User.logUser();

      /* Navigates to root subpath */
      // This page will be deprecrated, no need to migrate to v2 call
      if (router.currentRoute.name === 'Users' && !IAM.checkAuthz(['owner'])) {
        router.push('/');
      } else {
        router.push(`/${router.currentRoute.path.split('/')[1]}`);
      }

      API.UI.addNotification({
        type: 'primary',
        text: `Swapped to ${sortedOrgs[0].organization_id}.`,
      });
    }
  }

  private addOrg(): void {
    router.replace('/organizations/add');
  }

  private manageOrg(): void {
    router.replace('/organizations/manage');
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

  private nonProdRoutes(): Route[] {
    const nonRoutes: Route[] = [];
    this.routes.forEach((route) => {
      if (!(!route.prod && this.isProd)) {
        if (IAM.checkAuthz([route.role])) {
          nonRoutes.push(route);
        }
      }
    });
    return nonRoutes;
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
    width: 23rem;
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
  padding-right: 2.5em;
  padding-left: 1.5em;
  padding-top: .3em;
  padding-bottom: 1em;
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


</style>

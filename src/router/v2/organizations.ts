/* Organizations */

import { RouteConfig } from 'vue-router';

import Organizations from '@/views/v2/main/Organizations/Organizations.vue';
import OrganizationsIndex from '@/views/v2/main/Organizations/OrganizationsIndex.vue';
import OrganizationsAdd from '@/views/v2/main/Organizations/OrganizationsAdd.vue';
import OrganizationsView from '@/views/v2/main/Organizations/OrganizationsView.vue';
import RoleAdd from '@/views/v2/main/Roles/RoleAdd.vue';
import UserAdd from '@/views/v2/main/Users/UserAdd.vue';

const organizations: RouteConfig = {
  path: 'organizations',
  component: Organizations,
  children: [
    {
      path: '/',
      name: 'Organizations',
      component: OrganizationsIndex,
    },
    {
      path: 'add',
      name: 'Add Organization',
      component: OrganizationsAdd,
    },
    {
      path: ':parentID/add',
      name: 'Add Child Organization',
      component: OrganizationsAdd,
      props: true,
    },
    {
      path: 'manage',
      name: 'Manage Organizations',
      component: OrganizationsIndex,
      props: true,
    },
    {
      path: ':organizationID',
      name: 'View Organizations',
      component: OrganizationsView,
      props: true,
    },
    {
      path: ':organizationID/addRole',
      name: 'Add Organization Role',
      component: RoleAdd,
      props: true,
    },
    {
      path: ':organizationID/addUser',
      name: 'Add Organization User',
      component: UserAdd,
      props: true,
    },
    // {
    //   path: 'payment_structure',
    //   name: 'Globe Complex Billing',
    //   // beforeEnter: Utils.CheckRole,
    //   component: ComplexBilling,
    //   props: true,
    // },
  ],
};

export default organizations;

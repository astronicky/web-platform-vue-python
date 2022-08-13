/* Organizations */

import { RouteConfig } from 'vue-router';

import Organizations from '@/views/main/Organizations/Organizations.vue';
import OrganizationsIndex from '@/views/main/Organizations/OrganizationsIndex.vue';
import OrganizationsAdd from '@/views/main/Organizations/OrganizationsAdd.vue';

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
  ],
};

export default organizations;

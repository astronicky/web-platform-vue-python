/* Roles */

import { RouteConfig } from 'vue-router';

import Roles from '@/views/v2/main/Roles/Roles.vue';
import RoleView from '@/views/v2/main/Roles/RoleView.vue';

const roles: RouteConfig = {
  path: 'roles',
  component: Roles,
  children: [
    {
      path: ':roleID',
      name: 'View Roles',
      component: RoleView,
      props: true,
    },
  ],
};

export default roles;

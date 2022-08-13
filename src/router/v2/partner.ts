/* Partner Portal */

import { RouteConfig } from 'vue-router';

import Partner_Welcome from '@/views/v2/main/Welcome.vue';
import Partner_Dashboard from '@/views/v2/partner/main/Dashboard.vue';
import Partner_Organizations from '@/views/v2/main/Organizations/OrganizationsIndex.vue';
import Partner_Users from '@/views/v2/partner/main/Users.vue';
import Partner_Home from '@/views/v2/partner/Home.vue';

const partner: RouteConfig = {
  path: 'partner',
  component: Partner_Home,
  children: [
    {
      path: '/',
      name: 'Partner Home',
      component: Partner_Home,
      redirect: 'dashboard',
    },
    {
      path: 'welcome',
      name: 'Partner Welcome',
      component: Partner_Welcome,
    },
    {
      path: 'dashboard',
      name: 'Partner Dashboard',
      component: Partner_Dashboard,
    },
    {
      path: 'organizations',
      name: 'Partner Organizations',
      component: Partner_Organizations,
    },
    {
      path: 'users',
      name: 'Partner Users',
      component: Partner_Users,
    },
  ],
};

export default partner;

/* Admin Portal */

import { RouteConfig } from 'vue-router';

import Admin_Welcome from '@/views/v2/main/Welcome.vue';
import Admin_Dashboard from '@/views/v2/admin/main/Dashboard.vue';
import Admin_Organizations from '@/views/v2/main/Organizations/OrganizationsIndex.vue';
import Admin_Users from '@/views/v2/admin/main/Users/Users.vue';
import Admin_Home from '@/views/v2/admin/Home.vue';
import Admin_Roles_Index from '@/views/v2/main/Roles/RoleIndex.vue';
import Admin_Policies from '@/views/v2/admin/main/Policies/Policies.vue';
import Admin_Policies_View from '@/views/v2/admin/main/Policies/PoliciesView.vue';
import RoleView from '@/views/v2/main/Roles/RoleView.vue';

const admin: RouteConfig = {
  path: 'admin',
  component: Admin_Home,
  children: [
    {
      path: '/',
      name: 'Admin Home',
      component: Admin_Home,
      redirect: 'dashboard',
    },
    {
      path: 'welcome',
      name: 'Admin Welcome',
      component: Admin_Welcome,
    },
    {
      path: 'dashboard',
      name: 'Admin Dashboard',
      component: Admin_Dashboard,
    },
    {
      path: 'organizations',
      name: 'Admin Organizations',
      component: Admin_Organizations,
    },
    {
      path: 'users',
      name: 'Admin_Users',
      component: Admin_Users,
    },
    {
      path: 'roles',
      name: 'Admin_Roles_Index',
      component: Admin_Roles_Index,
    },
    {
      path: 'roles/:roleID',
      name: 'Admin_Role_View',
      component: RoleView,
      props: true,
    },
    {
      path: 'policies',
      name: 'Admin_Policies',
      component: Admin_Policies,
    },
    {
      path: 'policies/:policyID',
      name: 'Admin_Policies_View',
      component: Admin_Policies_View,
      props: true,
    },
  ],
};

export default admin;

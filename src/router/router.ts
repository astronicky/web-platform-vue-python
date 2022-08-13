import Vue from 'vue';
import Router, { Route, RouterOptions, RouteConfig } from 'vue-router';

import Iam from '@/common/iam';

import Utils from './utils';
import Home_v2 from '@/views/v2/Home.vue';
import Settings_v2 from '@/views/v2/main/Settings.vue';
import Support_v2 from '@/views/v2/main/Support.vue';
import Organizations_v2 from './v2/organizations';
import Welcome_v2 from '@/views/v2/main/Welcome.vue';
import Roles_v2 from './v2/roles';
import Admin from './v2/admin';
import Partner from './v2/partner';

import Home from '@/views/Home.vue';
import Welcome from '@/views/main/Welcome.vue';
import Settings from '@/views/main/Settings.vue';
import Users from '@/views/main/Users.vue';
import Support from '@/views/main/Support.vue';
import Feedback from '@/views/main/Feedback.vue';
import Dashboard from '@/views/main/Dashboard.vue';
import Dashboardv2 from '@/views/main/Dashboard_v2.vue';
// import OrgDashboard from '@/views/main/OrgDashboard.vue';
import Reports from '@/views/main/Inventory/Reports.vue';

import Pipelines from './pipelines';
import Integrations from './integrations';
import Organizations from './organizations';
import InventoryManagement from './inventory';
import Governance from './governance';
import Insights from './insights';
import HomeDashboard from './homedashboard';

import Kit from '@/views/misc/Kit.vue';
import Play from '@/views/misc/Play.vue';
import ApiTester from '@/views/misc/ApiTester.vue';
import Forms from '@/views/misc/Forms.vue';
import Logs from '@/views/misc/Logs.vue';
import Inventory from '@/views/misc/Inventory.vue';

import Login from '@/views/Login.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import SignUp from '@/views/SignUp.vue';
import AuthCallback from '@/views/AuthCallback.vue';
import InviteUser from '@/views/InviteUser.vue';
import InviteUser_v2 from '@/views/v2/InviteUser.vue';
import ErrorPage from '@/views/ErrorPage.vue';

import V2Redirect from '@/views/V2Redirect.vue';
import V1Redirect from '@/views/V1Redirect.vue';

Vue.use(Router);

/**
 * Note: Utils.Setup runs session validation and makes initial API calls.
 */

let routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: 'integrations',
    beforeEnter: Utils.Setup,
    children: [
      // { path: 'dashboard', component: Dashboard },
      HomeDashboard,
      Pipelines,
      Integrations,
      Organizations,
      { path: 'welcome', name: 'Welcome', component: Welcome },
      { path: 'settings', name: 'Settings', component: Settings },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        beforeEnter: Utils.CheckRole,
      },
      { path: 'support', name: 'Support', component: Support },
      { path: 'feedback', name: 'Feedback', component: Feedback },
      { path: 'Dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'Dashboardv2', name: 'Dashboardv2', component: Dashboardv2 },
      // { path: 'OrgDashboard', name: 'OrgDashboard', component: OrgDashboard },
      {
        path: 'kit',
        name: 'UI Kit',
        component: Kit,
        beforeEnter: Utils.EnvProd,
      },
      {
        path: 'play',
        name: 'Play',
        component: Play,
        beforeEnter: Utils.EnvProd,
      },
      {
        path: 'api',
        name: 'API Tester',
        component: ApiTester,
        beforeEnter: Utils.EnvProd,
      },
      {
        path: 'forms',
        name: 'Forms Test',
        component: Forms,
        beforeEnter: Utils.EnvProd,
      },
      {
        path: 'logs',
        name: 'Logs Test',
        component: Logs,
        beforeEnter: Utils.EnvProd,
      },
      InventoryManagement,
      Governance,
      Insights,
    ],
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/reset', name: 'ResetPassword', component: ResetPassword },
  { path: '/signup', name: 'Signup', component: SignUp },
  { path: '/auth', name: 'Auth Callback', component: AuthCallback },
  {
    path: '/invite',
    name: 'Invite User',
    component: InviteUser,
    beforeEnter: Utils.Setup,
  },
  { path: '*', name: 'Error Page', component: ErrorPage },
];

let base = '/';
const mode = localStorage.getItem('mode');

if (window.location.pathname.startsWith('/v2')) {
  console.log('in base v2');

  if (mode === 'v1') {
    routes = [
      ...routes,
      {
        path: '/',
        name: 'v2',
        component: V2Redirect,
      },
    ];
  } else {
    base = '/v2/';
    routes = [
      {
        path: '/',
        name: 'home',
        component: Home_v2,
        redirect: 'integrations',
        beforeEnter: Iam.checkAuth,
        children: [
          { path: 'settings', name: 'Settings_v2', component: Settings_v2 },
          { path: 'welcome', name: 'Welcome_v2', component: Welcome_v2 },
          { path: 'support', name: 'Support_v2', component: Support_v2 },
          { path: 'dashboard', name: 'Dashboard_v2', component: Dashboardv2 },
          // { path: 'orgdashboard', name: 'OrgDashboard_v2', component: OrgDashboard },
          HomeDashboard,
          Organizations_v2,
          Roles_v2,
          Admin,
          Partner,
          Pipelines,
          Integrations,
          Governance,
          Insights,
          InventoryManagement,
        ],
      },
      {
        path: '/invite',
        name: 'Invite User_v2',
        component: InviteUser_v2,
      },
    ];
  }
} else {
  if (mode === 'v2') {
    base = '/v2';
    routes = [
      {
        path: '/',
        name: 'home',
        component: Home_v2,
        redirect: 'integrations',
        beforeEnter: Iam.checkAuth,
        children: [
          { path: 'settings', name: 'Settings_v2', component: Settings_v2 },
          { path: 'welcome', name: 'Welcome_v2', component: Welcome_v2 },
          { path: 'support', name: 'Support_v2', component: Support_v2 },
          { path: 'dashboard', name: 'Dashboard_v2', component: Dashboardv2 },
          HomeDashboard,
          Organizations_v2,
          Roles_v2,
          Admin,
          Partner,
          Pipelines,
          Integrations,
          Governance,
          Insights,
          InventoryManagement,
        ],
      },
      { path: '/', name: 'v1', component: V1Redirect },
      { path: '/login', name: 'Login', component: V2Redirect },
      {
        path: '/invite',
        name: 'Invite User_v2',
        component: InviteUser_v2,
      },
      HomeDashboard,
      Pipelines,
      Integrations,
      Governance,
      Insights,
      InventoryManagement,
    ];
  }
}

console.log(`base is ${base}`);
console.log(routes);

const options: RouterOptions = {
  routes,
  mode: 'history',
  base,
  // saveScrollPosition: true,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  linkActiveClass: 'active',
};

export default new Router(options);

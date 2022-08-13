/* Home Dashboard */

import { RouteConfig } from 'vue-router';
import Utils from './utils';

import HomeDashboard from '@/views/main/HomeDashboard/HomeDashboard.vue';
import HomeDashboardIndex from '@/views/main/HomeDashboard/HomeDashboardIndex.vue';

const homedashboard: RouteConfig = {
    path: 'homedashboard',
    component: HomeDashboard,
    children: [
      {
        path: '/',
        name: 'Home Summary',
        component: HomeDashboardIndex,
      },
    ],
    beforeEnter: Utils.VueAppEnvProd,
};

export default homedashboard;

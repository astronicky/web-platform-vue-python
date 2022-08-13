/* Insights */

import { RouteConfig } from 'vue-router';
import Utils from './utils';

import Insights from '@/views/main/Insights/Insights.vue';
import InsightsIndex from '@/views/main/Insights/InsightsIndex.vue';
import InsightsView from '@/views/main/Insights/InsightsView.vue';
import InsightsRecommendations from '@/views/main/Insights/InsightsRecommendations.vue';

const insights: RouteConfig = {
    path: 'insights',
    component: Insights,
    children: [
      {
        path: '/',
        name: 'Insights Main',
        component: InsightsIndex,
      },
      {
        path: ':integrationID',
        name: 'View Insights',
        component: InsightsView,
        props: true,
      },
      {
        path: 'recommendations/:integrationID',
        name: 'View Recommendations',
        component: InsightsRecommendations,
        props: true,
      },
    ],
    beforeEnter: Utils.VueAppEnvProd,
};

export default insights;

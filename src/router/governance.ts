/* Governance */

import { RouteConfig } from 'vue-router';
import Utils from './utils';

import Governance from '@/views/main/Governance/Governance.vue';
import GovernanceIndex from '@/views/main/Governance/GovernanceIndex.vue';
import GovernanceDashboard from '@/views/main/Governance/GovernanceDashboard.vue';
import GovernanceReport from '@/views/main/Governance/GovernanceReport.vue';

const governance: RouteConfig = {
    path: 'governance',
    component: Governance,
    children: [
      {
        path: 'policies',
        name: 'GovernancePolicies',
        component: GovernanceIndex,
      },
      {
        path: '/',
        name: 'Violation Dashboards View',
        component: GovernanceDashboard,
      },
      {
        path: 'report/integration_id=:integration_id&date_evaluated=:date_evaluated',
        name: 'Governance Report',
        component: GovernanceReport,
      },
    ],
    beforeEnter: Utils.VueAppEnvProd,
};

export default governance;

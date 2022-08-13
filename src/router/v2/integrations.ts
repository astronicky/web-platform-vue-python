/* Integrations */

import { RouteConfig } from 'vue-router';

import Integrations from '@/views/main/Integrations/Integrations.vue';
import IntegrationsIndex from '@/views/main/Integrations/IntegrationsIndex.vue';
import IntegrationsAdd from '@/views/main/Integrations/IntegrationsAdd.vue';
import IntegrationsEdit from '@/views/main/Integrations/IntegrationsEdit.vue';
import IntegrationsThresholds from '@/views/main/Integrations/IntegrationsThresholds.vue';
import IntegrationsReports from '@/views/main/Integrations/IntegrationsReports.vue';
import IntegrationsDashboards from '@/views/main/Integrations/IntegrationsDashboards.vue';
import IntegrationsMasterfile from '@/views/main/Integrations/IntegrationsMasterfile.vue';
import IntegrationsSettings from '@/views/main/Integrations/IntegrationsSettings.vue';

const integrations: RouteConfig = {
  path: 'integrations',
  component: Integrations,
  children: [
    {
      path: '/',
      name: 'Integrations',
      component: IntegrationsIndex,
    },
    {
      path: 'add/:id',
      name: 'Add Integrations',
      component: IntegrationsAdd,
      props: true,
    },
    {
      path: 'edit/:definitionID/:id',
      name: 'Edit Integrations',
      component: IntegrationsEdit,
      props: true,
    },
    {
      path: 'thresholds/:thresholdEvaluator/:id',
      name: 'Intergration Thresholds View',
      component: IntegrationsThresholds,
      props: true,
    },
    {
      path: 'reports/:id',
      name: 'Integration Reports View',
      component: IntegrationsReports,
      props: true,
    },
    {
      path: 'dashboards/:id',
      name: 'Integration Dashboards View',
      component: IntegrationsDashboards,
      props: true,
    },
    {
      path: 'masterfile/:id',
      name: 'Integration Masterfile Management View',
      component: IntegrationsMasterfile,
      props: true,
    },
    {
      path: 'settings/:id',
      name: 'Integration Settings',
      component: IntegrationsSettings,
      props: true,
    },
  ],
};

export default integrations;

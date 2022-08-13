/* Inventory */

import { RouteConfig } from 'vue-router';
import Utils from './utils';

import InventoryManagement from '@/views/main/Inventory/InventoryManagement.vue';
import InventoryIndex from '@/views/main/Inventory/InventoryIndex.vue';
import InventoryReports from '@/views/main/Inventory/InventoryReports.vue';

const assetmanager: RouteConfig = {
    path: 'asset-manager',
    component: InventoryManagement,
    children: [
      {
        path: '/',
        name: 'Inventories',
        component: InventoryIndex,
      },
      {
        path: 'reports',
        name: 'Reports',
        component: InventoryReports,
      },
    ],
};

export default assetmanager;

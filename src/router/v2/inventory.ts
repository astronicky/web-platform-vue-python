/* Inventory */

import { RouteConfig } from 'vue-router';
import Utils from '../utils';

import InventoryManagement from '@/views/v2/main/Inventory/InventoryManagement.vue';
import InventoryIndex from '@/views/v2/main/Inventory/InventoryIndex.vue';

const assetmanager: RouteConfig = {
    path: 'asset-manager',
    name: 'Asset Manager',
    component: InventoryManagement,
    children: [
      {
        path: '/',
        name: 'Inventories',
        component: InventoryIndex,
        props: true,
      },
    ],
    beforeEnter: Utils.VueAppEnvProd,
};

export default assetmanager;

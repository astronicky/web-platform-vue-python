import http from '@/common/http';
import API from '@/API';
import Auth from '@/common/auth';

const Inventory = {
    async getInventory(integrationID: string): Promise<Inventory[]> {
        // const integrationId = API.Organization_v2.getCurrentId();
        const integrationId = '';
        const response = await http.get('/asset/inventory', {
            params: {
            integration_id: integrationID,
            },
        });
        const inventories = JSON.parse(JSON.stringify(response.data));
        // const inventory = JSON.parse(JSON.stringify(inventoryData));
        return inventories;
    },
    async getServiceType(integrationID: string): Promise<Inventory[]> {
        // const integrationId = API.Organization_v2.getCurrentId();
        const response = await http.get(
        '/asset/servicetypes', {
        params: {
            integration_id: integrationID,
        },
        });
        const serviceTypes = JSON.parse(JSON.stringify(response.data));
        return serviceTypes;
    },
    async getInventoryByServiceTypeAndIntegration(serviceType: string, integrationId: string ): Promise<Inventory[]> {
        const response = await http.get(
        '/inventory', {
        params: {
            service_type: serviceType,
            integration_id: integrationId,
        },
        });
        const filteredInventories = JSON.parse(JSON.stringify(response.data));
        return filteredInventories;
    },
};
export default Inventory;

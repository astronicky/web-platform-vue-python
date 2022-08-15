import http from '@/common/http';
import API from '@/API';

const inventorymgmt = {
  supportedProviders(): object {
    return {
      'Amazon Web Services': 'Amazon Web Services',
      'Google Cloud Platform': 'Google Cloud Platform',
      'Microsoft Azure': 'Microsoft Azure',
    };
  },

  async getOne(integrationId: string): Promise<Integration<InventoryMgmt>> {
    const organizationId = API.Organization_v2.getCurrentId();
    const response = await http.get(
      `integration/${integrationId}`, {
        params: {
          organization_id: organizationId,
        }}
      );
    return response.data;
  },

  async triggerPull(integrationId: string): Promise<boolean> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      console.log(integrationId);
      const response =  await http.put(`asset/pull`,
        {
          integration_id: integrationId,
        }, {
        params: {},
      });

      console.log(response.data);
      if ('Successfully' in response.data) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }

  },
};

export default inventorymgmt;

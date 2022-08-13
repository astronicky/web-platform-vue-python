import http from '@/common/http';
import API from '@/API';

const azure = {
  async add(integration: IntegrationData<Azure>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(`integrations/${integration.id}/start`, {}, {
        params: {
          organization_id: organizationId,
        },
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Microsoft Azure added successfully.',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<Azure>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      if (integration.metadata && integration.metadata.region) {
        const response = await http.put(`integrations/${integration.id}/stop`, {}, {
          params: {
            organization_id: organizationId,
          },
        });
        API.UI.addNotification({
          type: 'primary',
          text: 'Teardown of Azure CMI started.',
        });

        return response.data;
      } else {
        throw new Error('Integration malformed.');
      }
    } catch (error) {
      throw error;
    }
  },
};

export default azure;

import http from '@/common/http';
import API from '@/API';

const aws = {
  async add(integration: IntegrationData<AWS>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(`integrations/${integration.id}/start`, {}, {
        params: {
          organization_id: organizationId,
        },
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Starting AWS integration.',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<AWS>) {
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
          text: 'Stopping AWS integration.',
        });

        return response.data;
      } else {
        throw new Error('Integration malformed.');
      }
    } catch (error) {
      throw error;
    }
  },
  async status(integration: Integration<AWS>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.post('checker/aws', {
          OrgID: organizationId,
          IntegrationID: integration.id,
          AccountNum: integration.metadata.account_id,
          Region: integration.metadata.region,
        }, {
          params: {
            async: true,
          },
        });

      if ('Instance' in response.data && response.data.Instance.status === 'nil') {
        return 'CMI_READY';
      }
      return response.data.Instance.status.toUpperCase();
    } catch (error) {
      throw error;
    }
  },

};

export default aws;

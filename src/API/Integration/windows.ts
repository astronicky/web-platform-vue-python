import http from '@/common/http';
import API from '@/API';

const windows = {
  async add(integration: IntegrationData<Windows>): Promise<IntegrationCredentials> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.post(`windows`, {
        organization_id: organizationId,
        integration_id: integration.id,
      }, {
        params: {},
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Created api keys',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addConfig(configs: AgentConfig[]): Promise<AgentConfig> {
    try {
      const response = await http.post(`agent/config`,
        configs, {
        params: {},
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Created configurations',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<Windows>) {
    const organizationId = API.Organization_v2.getCurrentId();
    // try {
    //   if (integration.metadata && integration.metadata.region) {
    //     const response = await http.put(`integrations/${integration.id}/stop`, {}, {
    //       params: {
    //         organization_id: organizationId,
    //       },
    //     });
    //     API.UI.addNotification({
    //       type: 'primary',
    //       text: 'Stopping Agent integration.',
    //     });

    //     return response.data;
    //   } else {
    //     throw new Error('Integration malformed.');
    //   }
    // } catch (error) {
    //   throw error;
    // }
  },
  async status(integration: Integration<Windows>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    // try {
    //   const response =  await http.post('checker/agent', {
    //       OrgID: organizationId,
    //       IntegrationID: integration.id,
    //       AccountNum: integration.metadata.account_id,
    //       Region: integration.metadata.region,
    //     }, {
    //       params: {
    //         async: true,
    //       },
    //     });

    //   if ('Instance' in response.data && response.data.Instance.status === 'nil') {
    //     return 'CMI_READY';
    //   }
    //   return response.data.Instance.status.toUpperCase();
    // } catch (error) {
    //   throw error;
    // }
    return '';
  },

};

export default windows;

import http from '@/common/http';
import API from '@/API';

const devopsguru = {
  async add(integration: IntegrationData<DevOpsGuru>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.post(`devopsguru/${integration.id}/enable`, {
          organization_id: organizationId,
          account_id: integration.metadata.account_id,
          region: integration.metadata.region,
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Enabled DevOpsGuru on AWS Account.',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<DevOpsGuru>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      if (integration.metadata && integration.metadata.region) {
        const response = await http.put(`devopsguru/${integration.id}/disable`, {}, {
          params: {
          },
        });
        API.UI.addNotification({
          type: 'primary',
          text: 'Disabling DevOpsGuru.',
        });

        return response.data;
      } else {
        // throw new Error('Integration malformed.');
        API.UI.addNotification({
          type: 'danger',
          text: 'Failed to Disable DevOpsGuru',
        });
      }
    } catch (error) {
      // throw error;
      API.UI.addNotification({
        type: 'danger',
        text: 'Failed to Disable DevOpsGuru',
      });
    }
  },
  async status(integration: Integration<DevOpsGuru>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.get(`devopsguru/${integration.id}/status`, {
        params: {
        },
      });
      if ('Instance' in response.data && response.data.status === 'nil') {
        return 'NOT_CONFIGURED';
      }

      integration.metadata.subscription_state = response.data.subscription_status;
      API.Integration.update(integration);

      return response.data.status.toUpperCase();
    } catch (error) {
      throw error;
    }
  },
  async validate(integration_id: string): Promise<boolean> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.get(`devopsguru/${integration_id}/validate`, {
        params: {
        },
      });

      if ('Instance' in response.data && response.data.state === 'nil') {
        return false;
      }

      if (response.data.state === 'VALIDATION_SUCCEEDED') {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }

  },

};

export default devopsguru;

import http from '@/common/http';
import API from '@/API';

const cloudtrail = {
  async add(integration: IntegrationData<Cloudtrail>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.post(`cloudtrail/${integration.id}/enable`, {
          organization_id: organizationId,
          account_id: integration.metadata.account_id,
          region: integration.metadata.region,
          retention_days: integration.metadata.retention_days,
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Enabled Cloudtrail on AWS Account.',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<Cloudtrail>) {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      if (integration.metadata && integration.metadata.region) {
        const response = await http.put(`cloudtrail/${integration.id}/disable`, {}, {
          params: {
          },
        });
        API.UI.addNotification({
          type: 'primary',
          text: 'Disabling Cloudtrail.',
        });

        // give time to get integration metadata before removal
        await this.waitFor(5000);
        return response.data;
      } else {
        // throw new Error('Integration malformed.');
        API.UI.addNotification({
          type: 'danger',
          text: 'Failed to Disable Cloudtrail',
        });
      }
    } catch (error) {
      // throw error;
      API.UI.addNotification({
        type: 'danger',
        text: 'Failed to Disable Cloudtrail',
      });
    }
  },
  async status(integration: Integration<Cloudtrail>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.get(`cloudtrail/${integration.id}/status`, {
        params: {
        },
      });
      if ('Instance' in response.data && response.data.status === 'nil') {
        return 'NOT_CONFIGURED';
      }

      integration.metadata.trail_status = response.data.trail_status;
      API.Integration.update(integration);

      return response.data.status.toUpperCase();
    } catch (error) {
      throw error;
    }
  },
  async validate(integration_id: string): Promise<boolean> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.get(`cloudtrail/${integration_id}/validate`, {
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
  waitFor(millSeconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0);
      }, millSeconds);
    });
  },

};

export default cloudtrail;

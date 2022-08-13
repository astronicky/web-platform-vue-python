import http from '@/common/http';
import API from '@/API';

const gcp = {
  async start(integration_id: string, organization_id: string) {
    try {
      const response = await http.put(`integrations/${integration_id}/start`, {}, {
        params: {
          organization_id,
        },
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Google Cloud Platform added successfully.',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async remove(integration: Integration<GCP>) {
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
          text: 'Teardown of CMI started.',
        });

        return response.data;
      } else {
        throw new Error('Integration malformed.');
      }
    } catch (error) {
      throw error;
    }
  },
  async status(integration: Integration<GCP>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.post('checker/gcp', {
          OrgID: organizationId,
          IntegrationID: integration.id,
          ProjectID: integration.metadata.project_id,
          TargetServiceAccount: `${organizationId}-cmi@${integration.metadata.project_id}.iam.gserviceaccount.com`,
          Region: integration.metadata.region,
        }, {
          params: {
            async: true,
          },
        });
      if ('RunCommand' in response.data && response.data.RunCommand.ok === 'true') {
        return 'CMI_UP';
      } else if ('Instance' in response.data && response.data.Instance.status === 'STOPPING') {
        return 'CMI_STOPPING';
      } else if ('Instance' in response.data && response.data.Instance.status === 'TERMINATED') {
        return 'CMI_STOPPING';
      } else if ('Deploying' in response.data && response.data.Deploying.ok === 'true') {
        return 'CMI_STARTING';
      } else if ('Activation' in response.data && response.data.Activation.ok === 'false') {
        return 'CMI_STARTING';
      } else if ('RunCommand' in response.data && response.data.RunCommand.ok === 'false') {
        return 'CMI_DOWN';
      } else if ('Role' in response.data && response.data.Role.ok === 'true') {
        return 'CMI_READY';
      }
      return response.data.Instance.status;
    } catch (error) {
      throw error;
    }
  },

};

export default gcp;

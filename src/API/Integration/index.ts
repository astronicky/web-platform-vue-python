import http from '@/common/http';
import store from '@/store/store';
import API from '@/API';

import * as STORE_INTEGRATION from '@/store/modules/STORE_INTEGRATION';

import aws from './aws';
import agent from './agent';
import gcp from './gcp';
import azure from './azure';
import slack from './slack';
import endpoint from './endpoint';
import windows from './windows';
import globeBilling from './globe_billing';
import devopsguru from './devopsguru';
import linux from './linux';
import cloudtrail from './cloudtrail';
import inventorymgmt from './inventory_mgmt';
import logmanagement from './logmanagement';

const Integration = {
  async add(
    integration: IntegrationData<All>,
    notify: boolean = true
  ): Promise<IntegrationData<All>> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.post(`integrations`, integration, {
        params: {
          organization_id: organizationId,
        },
      });
      return response.data;
    } catch (error) {
      if (notify) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error adding integration.',
        });
      }
      throw error;
    }
  },
  async addClient(integrationId: string, platformType: string): Promise<IntegrationCredentials> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(
        `integrations/${integrationId}/client`,
        undefined,
        {
          params: {
            organization_id: organizationId,
            platform_type: platformType,
          },
        }
      );
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error creating integration client.',
      });
      throw error;
    }
  },
  async getClient(integrationId: string, platformType: string): Promise<IntegrationCredentials> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.get(
        `integration/${integrationId}/authclient`,
        {
          params: {
          },
        });

      // log user integration access
      // TODO: IOP-1162. Re-instate for iam v2
      const mode = localStorage.getItem('mode');
      if (mode !== 'v2') {
        await API.User.logUser();
      }

      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting credentials.',
      });
      throw error;
    }
  },

  async deleteClient(integrationId: string): Promise<IntegrationCredentials> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.delete(
        `integrations/${integrationId}/client`
      );
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error deleting integration client.',
      });
      throw error;
    }
  },
  async update(integration: IntegrationData<All>): Promise<void> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(`integrations`, integration, {
        params: {
          organization_id: organizationId,
        },
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error updating integration.',
      });
      throw error;
    }
  },
  /**
   * Get's all customer added integrations.
   */
  async get(): Promise<Array<Integration<All>>> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.get(`integrations`, {
        params: {
          organization_id: organizationId,
        },
      });

      // TODO: IOP-1162. Re-instate for iam v2
      const mode = localStorage.getItem('mode');
      if (mode !== 'v2') {
        await API.User.logUser();
      }

      const integrations: Array<Integration<All>> = [];

      response.data.forEach((i: IntegrationData<any>) => {
        let definition = this.blankDefinition();
        this.lookupDefinition(i.definition_id).then((res) => {
          definition = res;
          integrations.push({ ...i, ...definition });
        });
      });

      return integrations;
    } catch (error) {
      if (error.response.status === 404) {
        // Not actually an error, just not found
        // TODO: Redo API HTTP error codes
      } else {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error retrieving integrations.',
        });
        throw error;
      }
    }
    return [];
  },
  /**
   * Gets one integration.
   */
   async getOne(integration_id: string): Promise<Integration<All>|undefined> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.get(`integration/${integration_id}`);

      // log user integration access
      // TODO: IOP-1162. Re-instate for iam v2
      const mode = localStorage.getItem('mode');
      if (mode !== 'v2') {
        await API.User.logUser();
      }

      const integration = response.data;
      const definition = await this.lookupDefinition(integration.definition_id);

      return { ...integration, ...definition };
    } catch (error) {
      if (error.response.status === 404) {
        // Not actually an error, just not found
        // TODO: Redo API HTTP error codes
      } else {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error retrieving integration.',
        });
        throw error;
      }
    }
    return undefined;
  },

  async stop(integration: IntegrationData<All>, deleteIntegration: boolean = false): Promise<void> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(
        `integrations/${integration.id}/stop`,
        {},
        {
          params: {
            organization_id: organizationId,
            delete_integration: deleteIntegration,
          },
        }
      );

      API.UI.addNotification({
        type: 'primary',
        text: 'Stopping integration.',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error stopping integration.',
      });
      throw error;
    }
  },
  async start(integration: Integration<All>): Promise<void> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.put(
        `integrations/${integration.id}/start`,
        {},
        {
          params: {
            organization_id: organizationId,
          },
        }
      );
      API.UI.addNotification({
        type: 'primary',
        text: 'Starting integration.',
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error starting integration.',
      });
      throw error;
    }
  },
  async status(integration: Integration<All>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      if (integration.definition_id === 'devopsguru') {
        const statusstr = await devopsguru.status(integration);
        return statusstr;
      } else if (integration.definition_id === 'cloudtrail') {
        const statusstr = await cloudtrail.status(integration);
        return statusstr;
      } else if (integration.definition_id === 'logmanagement') {
        const statusstr = await logmanagement.status(integration);
        return statusstr;
      }

      const response = await http.get(`integrations/${integration.id}/status`, {
        params: {
          organization_id: organizationId,
        },
      });
      if ('status' in response.data) {
        if (response.data.status === '') {
          return 'UNKNOWN';
        }
        return response.data.status;
      } else {
        throw new Error('Unknown status.');
      }
    } catch (error) {
      throw error;
    }
  },

  async lookupDefinition(definitionId: string): Promise<IntegrationDefinition> {
    try {
      const dList = await this.getDefinitions();
      if (dList) {
        const definition = dList.find(
          (i: IntegrationDefinition) => i.definition_id === definitionId
        );
        if (definition) {
          return definition;
        }
      }
      throw new Error(`Definition not found: ${definitionId}`);
    } catch (error) {
      throw error;
    }
  },
  async syncDefinitions(): Promise<void> {
    try {
      await http.get(`integrations/definitions/`).then((res: any) => {
        this.setDefinitions(res.data);
      });
    } catch (error) {
      throw new Error('Cannot sync integration definitions.');
    }
  },
  async getDefinitions(): Promise<IntegrationDefinition[]> {
    try {
      return STORE_INTEGRATION.getDefinitions(store);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sets definitions in Front End Store for access everywhere, during app setup
   */
  setDefinitions(definitions: IntegrationDefinition[]): void {
    STORE_INTEGRATION.setDefinitions(store, definitions);
  },

  /**
   * Deletes a current integration from the user account
   * @param integration
   */
  async remove(
    integration: Integration<All>,
    notify: boolean = true
  ): Promise<void> {
    try {
      const organizationId = API.Organization_v2.getCurrentId();

      // hook to delete specific integrations when removing from summary
      // place before removal from dynamodb
      if (integration.definition_id === 'endpoint') {
        await endpoint.remove(integration.id);
      }

      if (integration.definition_id === 'devopsguru') {
        await devopsguru.remove(integration);
      }

      if (integration.definition_id === 'cloudtrail') {
        await cloudtrail.remove(integration);

        // clean-up AWS integration relationship
        if (integration.metadata.integration_dependency !== '') {

          await API.Integration.getOne(integration.metadata.integration_dependency).then(async (result) => {
            if (result) {
              if (result.definition_id === 'aws') {
                const depInt: Integration<AWS> = result;
                if (depInt.metadata.cloudtrail_config !== undefined) {
                  depInt.metadata.cloudtrail_config.status = 'disabled';
                  depInt.metadata.cloudtrail_config.integration_id = '';

                  await this.update(depInt);
                }
              }
            }
          });
        }
      }

      // hook to remove client speicific api credentials.
      // TODO: ideally this should be done in the backend
      if (integration.definition_id === 'aws') {
        await this.deleteClient(integration.id);
      }

      const response = await http.delete('integrations', {
        params: {
          organization_id: organizationId,
          integration_id: integration.id,
        },
      });

      if (notify) {
        API.UI.addNotification({
          type: 'primary',
          text: `${integration.name} integration removed.`,
        });
      }
      return response.data;
    } catch (error) {
      if (notify) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error removing integration.',
        });
      }
      throw error;
    }
  },

  /**
   * Returns a blank integration, useful for Vue reactivity.
   */
  blankDefinition(): IntegrationDefinition {
    return {
      name: '',
      definition_id: '',
      image: '',
      enabled: true,
      editable: false,
      definition_type: 'input',
      tags: [],
      description: '',
      link: '',
      threshold_supported: '',
    };
  },
  aws,
  agent,
  azure,
  gcp,
  slack,
  endpoint,
  windows,
  globeBilling,
  devopsguru,
  linux,
  cloudtrail,
  inventorymgmt,
};

export default Integration;

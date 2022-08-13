import http from '@/common/http';
import store from '@/store/store';
import router from '@/router/router';

import API from '@/API';
import { format } from 'date-fns';


const Pipeline = {
  async add(pipeline: Pipeline): Promise<Pipeline> {
    const organizationId = API.Organization_v2.getCurrentId();

    try {
      const response = await http
        .post(`pipelines`, pipeline, { params: { organization_id: organizationId }});
      API.UI.addNotification({
        type: 'primary',
        text: 'New pipeline created.',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error creating pipeline.',
      });
      throw error;
    }
  },
  async get(): Promise<Pipeline[]> {
    // debugger;
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = await http.get(`pipelines`, {
        params: {
          organization_id: organizationId,
        },
      });
      const pipelines = JSON.parse(JSON.stringify(response.data));

      pipelines.forEach((p: Pipeline) => {
        if (p.integrations) {
          const integrationList: Array<Integration<All>> = [];
          p.integrations.forEach((i: IntegrationData<any>) => {
            API.Integration.lookupDefinition(i.definition_id)
              .then((res) => {
                /* Spreads the definition and data together to for a full Integration */
                integrationList.push({ ...i, ...res });
              });
          });
          p.integrations = integrationList;
        }
      });
      return pipelines;
    } catch (error) {
      if (error.response.status === 404) {
        // Not actually an error, just not found
        // TODO: Redo API HTTP error codes
      } else {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error retrieving pipelines.',
        });
        throw error;
      }
    }
    return [];
  },
  /**
   * Takes in whole Pipeline and updates it.
   * Used for adding and removing integrations.
   * @param pipeline the entire Pipeline object
   */
  async update(pipeline: Pipeline): Promise<Pipeline> {
    const organizationId = API.Organization_v2.getCurrentId();

    try {
      const response = await http
        .put(`pipelines`, pipeline, { params: { organization_id: organizationId }});
      API.UI.addNotification({
        type: 'save',
        text: 'Pipeline saved.',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error updating pipeline.',
      });
      throw error;
    }
  },
  async delete(pipelineId: string): Promise<void> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response = http
        .delete(`pipelines`, {
          params: {
            organization_id: organizationId,
            pipeline_id: pipelineId,
          },
        })
        .then((res) => {
          API.UI.addNotification({
            type: 'primary',
            text: `Pipeline deleted.`,
          });
          return res;
        })
        .then(() => router.replace('/pipelines'))
        .catch((error) => {
          API.UI.addNotification({
            type: 'danger',
            text: 'Error deleting pipelines.',
          });
          return error;
        });
      return response;
    } catch (error) {
      throw error;
    }
  },
  testOutputs(pipelineId: string, pipelineName: string): void {
    const organizationId = API.Organization_v2.getCurrentId();
    const request = {};
    try {
      http.put(`pipeline/${pipelineId}/test`, request, {
        params: {
          organization_id: organizationId,
        },
      })
      .then(() => {
        API.UI.addNotification({
          type: 'primary',
          text: `Pipeline test sent for ` + pipelineName,
        });
      });
    } catch (error) {
      throw error;
    }
  },
};

export default Pipeline;

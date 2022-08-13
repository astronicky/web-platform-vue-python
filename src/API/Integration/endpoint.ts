import http from '@/common/http';
import API from '@/API';
import router from '@/router/router';

const endpoint = {
  async add(id: string, notify: boolean = true) {
    try {
      http
        .post(
          `endpoint`,
          {},
          {
            params: {
              organization_id: API.Organization_v2.getCurrentId(),
              integration_id: id,
            },
          }
        )
        .then(() => {
          /* */
        })
        .catch(() => {
          if (notify) {
            API.UI.addNotification({
              type: 'danger',
              text: 'Error adding Endpoint integration.',
            });
          }
        });
    } catch (error) {
      if (notify) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error adding Endpoint integration.',
        });
      }
      throw error;
    }
  },
  async update(id: string) {
    try {
      await endpoint.remove(id, false);
      await endpoint.add(id, false);
      API.UI.addNotification({
        type: 'primary',
        text: 'Endpoints updated successfully.',
      });
    } catch (error) {
      throw error;
    }
  },
  async remove(id: string, notify: boolean = false) {
    try {
      http
        .delete(`endpoint`, {
          params: {
            organization_id: API.Organization_v2.getCurrentId(),
            integration_id: id,
          },
        })
        .then(() => {
          if (notify) {
            API.UI.addNotification({
              type: 'primary',
              text: 'Endpoint removed successfully.',
            });
          }
        });
    } catch (error) {
      if (notify) {
        API.UI.addNotification({
          type: 'danger',
          text: 'Error removing Endpoint integration.',
        });
      }
      throw error;
    }
  },
  async togglePause(id: string, paused: boolean = false) {
    let pausedLiteral = 'resumed';
    if (paused) {
      pausedLiteral = 'paused';
    }

    try {
      await http.put(
        `endpoint`,
        {},
        {
          params: {
            organization_id: API.Organization_v2.getCurrentId(),
            integration_id: id,
            paused,
          },
        }
      );

      API.UI.addNotification({
        type: 'primary',
        text: `Endpoint ${pausedLiteral} successfully.`,
      });
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: `Error Endpoint could not be ${pausedLiteral}.`,
      });
      throw error;
    }
  },
  async testAll(integration: IntegrationData<Endpoint>) {
    try {
      const response = await http.get('endpoint/test', {
        params: {
          organization_id: API.Organization_v2.getCurrentId(),
          integration_id: integration.id,
        },
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Endpoints tested successfully.',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error testing endpoints.',
      });
      throw error;
    }
  },
};

export default endpoint;

import http from '@/common/http';
import API from '@/API';

const logmanagement = {
  async status(integration: Integration<Logmanagement>): Promise<string> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const response =  await http.get(`logmanagement/${integration.id}/status`, {
        params: {
        },
      });
      if ('Instance' in response.data && response.data.status === 'nil') {
        return 'NOT_CONFIGURED';
      }

      return response.data.status.toUpperCase();
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

export default logmanagement;

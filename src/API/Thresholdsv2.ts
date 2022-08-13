import http from '@/common/http';
import API from '@/API';

const Thresholdsv2 = {
  async getDefaults(definition_id: string): Promise<Array<Thresholdv2<AnyThresholdsv2>>> {
    const organizationId = API.Organization_v2.getCurrentId();
    try {
      const result = await http.get(`/alertsv2/defaults/${definition_id}`);
      return result.data;
    } catch (error) {
      API.UI.addNotification({ type: 'danger', text: 'Failed to get default thresholds.' });
    }
    return [];
  },
  /**
   * Fetches all of an integration's set thresholds.
   */
   async getAllAlerts(integrationId: string): Promise<Array<Thresholdv2<AnyThresholdsv2>>> {
    try {
      const response = await http.get(`/alertsv2/${integrationId}`);
      /* Actual alerts come back instead of a string message */
      if (typeof response.data !== 'object') {
        return [];
      }
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Failed to get organization\'s thresholds.',
      });
      throw new Error(error);
    }
  },
  async deleteAll(alerts: Array<Thresholdv2<AnyThresholdsv2>>): Promise<void> {
    try {
      await http.delete(`/alertsv2`, {data: alerts});
      API.UI.addNotification({ type: 'primary', text: 'All thresholds deleted successfully.' });
    } catch (error) {
      API.UI.addNotification({ type: 'danger', text: 'Failed to delete thresholds.' });
    }
  },
  async saveBatch(alerts: Array<Thresholdv2<AnyThresholdsv2>>): Promise<Array<Thresholdv2<AnyThresholdsv2>>> {
    try {
      const response = await http.put(`/alertsv2`, alerts);

      if (response.data === undefined && typeof response.data !== 'object') {
        return [];
      }

      API.UI.addNotification({ type: 'primary', text: 'Thresholds saved successfully.' });
      return response.data;

    } catch (error) {
      API.UI.addNotification({ type: 'danger', text: 'Failed to save thresholds.' });
      return [];
    }

    return [];
  },
  async validateThreshold(integrationId: string, alertId: string): Promise<ValidateThresh> {
    try {
      const response = await http.get(`/alertsv2/${integrationId}/validate/${alertId}`);
      if (typeof response.data !== 'object') {
        throw new Error('Failed to get validation state');
      }
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Failed to get validation state',
      });
      throw new Error(error);
    }
  },
};

export default Thresholdsv2;

import http from '@/common/http';
import API from '@/API';

const threshold = {
  supportedThresholds(): object {
    return {'Actual Budget': 'static_budget',
      // 'Forecast Budget': 'forecast_budget',
      // 'Anomaly Budget': 'anomaly_budget',
    };
  },
  async supportedAwsTransactionTypes(): Promise<string[]> {
    try {
      const response = await http.get(
        `globe/billing/types?platform_type=aws`
      );
      const decodedResp = JSON.parse(atob(response.data));
      return decodedResp;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error retrieving AWS transaction types.',
      });
      throw error;
    }
  },
  async supportedGcpTransactionTypes(): Promise<string[]> {
    try {
      const response = await http.get(
        `globe/billing/types?platform_type=gcp`
      );
      const decodedResp = JSON.parse(atob(response.data));
      return decodedResp;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error retrieving GCP transaction types.',
      });
      throw error;
    }
  },
  async supportedAzureTransactionTypes(): Promise<string[]> {
    try {
      const response = await http.get(
        `globe/billing/types?platform_type=azure`
      );
      const decodedResp = JSON.parse(atob(response.data));
      return decodedResp;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error retrieving Azure transaction types.',
      });
      throw error;
    }
  },
  blank(): GlobeBillingThreshold<AllGlobeBillingThresholds> {
    return {
      ID: '',
      Type: '',
      Name: '',
      IntegrationID: '',
      Enabled: true,
      Notes: '',
      Severity: '',
      Metadata: {
        TransactionType: '',
      },
    };
  },
  blankActualBudget(): GlobeBillingThreshold<GlobeBillingStaticBudgetThreshold> {
    return {
      ID: '',
      Type: 'static_budget',
      Name: '',
      IntegrationID: '',
      Enabled: true,
      Notes: '',
      Severity: '',
      Metadata: {
        Threshold: 0,
        TransactionType: '',
      },
    };
  },
  blankForecastBudget(): GlobeBillingThreshold<GlobeBillingForecastBudgetThreshold> {
    return {
      ID: '',
      Type: 'forecast_budget',
      Name: '',
      IntegrationID: '',
      Enabled: true,
      Notes: '',
      Severity: '',
      Metadata: {
        Threshold: 0,
        PredictionFactor: 0.9,
        TransactionType: '',
      },
    };
  },
  blankAnomalyBudget(): GlobeBillingThreshold<GlobeBillingAnomalyThreshold> {
    return {
      ID: '',
      Type: 'anomaly_budget',
      Name: '',
      IntegrationID: '',
      Enabled: true,
      Notes: '',
      Severity: '',
      Metadata: {
        AnomalyFactor: 3,
        TransactionType: '',
      },
    };
  },
  async getAll(integrationId: string): Promise<Array<GlobeBillingThreshold<AllGlobeBillingThresholds>>> {
    try {
      const response = await http.get(
        `globe/billing/thresholds/${integrationId}`
      );
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting thresholds.',
      });
      throw error;
    }
  },
  async upsert(alert: GlobeBillingThreshold<AllGlobeBillingThresholds>): Promise<string> {
    try {
      const response = await http.post(
        `globe/billing/threshold`,
        alert
      );

      API.UI.addNotification({
        type: 'primary',
        text: 'Threshold ' + alert.Name + ' saved',
      });

      return response.data.id;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error getting thresholds.',
      });
      throw error;
    }
  },
  async delete(integrationId: string, alertId: string): Promise<void> {
    try {
      const response = await http.delete(
        `globe/billing/threshold/${integrationId}/${alertId}`
      );
      if (response.data.message !== 'Succesfully deleted alert') {
        throw new Error('Error deleting threshold');
      }
      API.UI.addNotification({
        type: 'primary',
        text: 'Threshold ' + alertId + ' deleted',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: `Error deleting threshold ${alertId}.`,
      });
      throw error;
    }
  },
};

export default threshold;


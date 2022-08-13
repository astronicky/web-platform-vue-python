import http from '@/common/http';
import API from '@/API';

const dashboard = {
  supportedDashboards(): string[] {
    return ['billing_past_periods',
      'month_to_date',
    ];
  },
  async createDashboardPeriod(integrationId: string, fromdate: string, todate: string): Promise<string> {
    try {
        const response = await http.post('/globe/billing/dashboard/monthrange', null,
            { params: {
                integration_id: integrationId,
                from: fromdate,
                to: todate },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to create dashboard request.');
        }

        if (!('uuid' in response.data) || response.data.uuid === '') {
            throw new Error('No dashboard request UUID returned.');
        }

        return response.data.uuid;

    } catch (error) {
        API.UI.addNotification({
            type: 'danger',
            text: 'Unable to create dashboard request. Try again later.',
        });

        return '';

    }
  },
  async getOrgMonthEstimate(organizationId: string): Promise<string> {
    try {
        const response = await http.post('/globe/billing/dashboard/orgmonthly', null,
            { params: {
                organization_id: organizationId },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to create dashboard request.');
        }

        if (!('uuid' in response.data) || response.data.uuid === '') {
            throw new Error('No dashboard request UUID returned.');
        }

        return response.data.uuid;

    } catch (error) {
        API.UI.addNotification({
            type: 'danger',
            text: 'Unable to create Org dashboard request. Try again later.',
        });

        return '';

    }
  },
  async getOrgAnnualEstimate(organizationId: string): Promise<string> {
    try {
        const response = await http.post('/globe/billing/dashboard/organnual', null,
            { params: {
                organization_id: organizationId },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to create dashboard request.');
        }

        if (!('uuid' in response.data) || response.data.uuid === '') {
            throw new Error('No dashboard request UUID returned.');
        }

        return response.data.uuid;

    } catch (error) {
        API.UI.addNotification({
            type: 'danger',
            text: 'Unable to create Org dashboard request. Try again later.',
        });

        return '';

    }
  },
  async getOrgHistorical(organizationId: string, fromdate: string, todate: string): Promise<string> {
    try {
        const response = await http.post('/globe/billing/dashboard/orghistorical', null,
            { params: {
                organization_id: organizationId,
                from: fromdate,
                to: todate },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to create dashboard request.');
        }

        if (!('uuid' in response.data) || response.data.uuid === '') {
            throw new Error('No dashboard request UUID returned.');
        }

        return response.data.uuid;

    } catch (error) {
        API.UI.addNotification({
            type: 'danger',
            text: 'Unable to create dashboard request. Try again later.',
        });

        return '';

    }
  },
  async getDashboardResult(queryId: string, retryCount: number, delayTime: number): Promise<object> {
    try {
        const response = await http.get('/globe/billing/dashboard/status',
            { params: {
                query_id: queryId },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to get dashboard create status and result.');
        }

        if (response.data.status !== 'COMPLETED') {
            throw new Error('Chart status is not COMPLETED. Retry later');
        }

        return response.data.result;

    } catch (error) {
        // if retry count is exchausted
        if (retryCount === 1) {
            throw error;
        }
        API.UI.showSpin();
        // retry logic
        await this.waitFor(delayTime);
        return this.getDashboardResult(queryId, retryCount - 1, delayTime);
    }

  },
  waitFor(millSeconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0);
      }, millSeconds);
    });
  },
  async getCategoryTransactionTypes(organizationID: string, platformType: string): Promise<any|undefined> {
    try {
        const response = await http.get('/globe_billing/cat_transactiontypes',
            { params: {
                organization_id: organizationID,
                platform_type: platformType },
            }
        );
        return response.data;
    } catch (error) {
        API.UI.addNotification({
        type: 'danger',
        text: `Could not get Category Transaction Types. Error: ${error}`,
        });
    }
  },
};

export default dashboard;

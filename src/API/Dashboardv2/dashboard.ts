import http from '@/common/http';
import API from '@/API';

const dashboard = {

  async createDashboardPeriod(integrationId: string, fromdate: string, todate: string, nosgap: boolean): Promise<string> {
    try {
        const response = await http.post('/dashboard/default', null,
            { params: {
                integration_id: integrationId,
                from: fromdate,
                to: todate,
                nostartgap: nosgap },
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
  async getDashboardResult(integrationId: string, queryId: string, retryCount: number, delayTime: number): Promise<object> {
    try {
        const response = await http.get('/dashboard/geturl',
            { params: {
                integration_id: integrationId,
                query_id: queryId },
            }
        );
        if (typeof response.data !== 'object') {
            throw new Error('Failed to get dashboard create status and result.');
        }

        if (response.data.status !== 'COMPLETED') {
            throw new Error('Chart status is not COMPLETED. Retry later');
        }

        // return response.data.result;

        const presignhttp = http.create({
            baseURL: '',
        });

        const presignresp = await presignhttp.get(response.data.presignurl,
        { params: {},
        });

        if (typeof presignresp.data !== 'object') {
            throw new Error('Failed to get dashboard data result using presigned url.');
        }

        if (presignresp.data.status !== 'COMPLETED') {
            throw new Error('Chart status is not COMPLETED. Retry later');
        }

        return presignresp.data.result;

    } catch (error) {
        // if retry count is exchausted
        if (retryCount === 1) {
            throw error;
        }
        API.UI.showSpin();
        // retry logic
        await this.waitFor(delayTime);
        return this.getDashboardResult(integrationId, queryId, retryCount - 1, delayTime);
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

export default dashboard;

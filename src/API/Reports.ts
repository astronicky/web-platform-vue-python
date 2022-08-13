import http from '@/common/http';
import API from '@/API';

const Reports = {
  /**
   * Fetches report given month, year, and integration_id
   */
  async getReports(integrationId: string, year: number, month: number): Promise<string[]> {
    try {
        const pdf = await http.get('/globe/billing',
            { params: {
                integration_id: integrationId,
                year,
                month,
                type: 'processed',
                format: 'pdf' },
            }
        );
        if (typeof pdf.data !== 'object') {
            throw new Error('Failed to get report.');
        }

        const csv = await http.get('/globe/billing',
            { params: {
                integration_id: integrationId,
                year,
                month,
                type: 'processed',
                format: 'csv' },
            }
        );
        if (typeof csv.data !== 'object') {
            throw new Error('Failed to get report.');
        }

        return [pdf.data.reports[0], csv.data.reports[0]];
    } catch (error) {
        this.showErrorNotification(error);
        return ['', ''];
    }
  },
  async getReferenceFileList(integrationId: string, year: number, month: number): Promise<any> {
    try {
        const ref = await http.get('/globe/billing/reference', {
            params: {
                integration_id: integrationId,
                year,
                month,
            },
        });
        if (typeof ref.data !== 'object') {
            throw new Error('Failed to get the list of reports.');
        }

        return [ref.data];
    } catch (error) {
        return [''];
    }
  },
  showErrorNotification(error: any) {
    if (error.response) {
        if (error.response.status === 404) {
            API.UI.addNotification({
                type: 'warning',
                text: 'File for selected date is not yet ready. Try again later.',
            });
            return;
        }
    }

    API.UI.addNotification({
        type: 'danger',
        text: 'Unable to fetch report. Try again later.',
    });
  },
};

export default Reports;

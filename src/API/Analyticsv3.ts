import http from '@/common/http';

const Analyticsv3 = {
    async getAlertsData(integrationID: string, organizationID: string, severity: string): Promise<any> {
        const response = await http.get(`/analyticsv3/insights/alerts/${integrationID}?severity=${severity}&organization_id=${organizationID}`);
        return response.data;
    },
    async getRecommendations(organizationID: string): Promise<any> {
        const response = await http.get(`/analyticsv3/recommendation/cloudwatch-ec2?organization_id=${organizationID}`);
        return response.data;
    },
    async getInsights(organizationID: string, metricName: string, dateEvaluated: string): Promise<any> {
        const response = await http.get('/analyticsv3/insights/governance',
        {
            params: {
              organization_id: organizationID,
              metric_name: metricName,
              date_evaluated: dateEvaluated,
            },
        });
        return response.data;
      },
    async getLatestEvaluationDate(organizationID: string): Promise<any> {
        const response = await http.get('/analyticsv3/insights/governance/latestevaldate',
        {
            params: {
              organization_id: organizationID,
            },
        });
        return response.data;
      },
    async getDateRange(organizationID: string, dateStart: string, dateEnd: string, metricName: string): Promise<any> {
        const response = await http.get('/analyticsv3/insights/governance/daterange',
        {
            params: {
              organization_id: organizationID,
              date_start: dateStart,
              date_end: dateEnd,
              metric_name: metricName,
            },
        });
        return response.data;
      },
};

export default Analyticsv3;

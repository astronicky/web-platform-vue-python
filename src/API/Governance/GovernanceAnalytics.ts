import http from '@/common/http';
import Auth from '@/common/auth';

const GovernanceAnalytics = {
    async getTotalViolationCount(organizationID: string): Promise<any> {
        const violationCountByOrg = await http.get(`/governance/analytics/violation_count/${organizationID}`);
        return violationCountByOrg.data;
    },
    async getEvaluationData(organizationID: string): Promise<any> {
      const evaluationData = await http.get(`/governance/analytics/evaluation_data/${organizationID}`);
      return evaluationData.data;
    },
    async getHistoricalData(organizationID: string): Promise<any> {
      const historicalData = await http.get(`/governance/analytics/historical_data/${organizationID}`);
      return historicalData.data;
    },
};

export default GovernanceAnalytics;

import http from '@/common/http';
import API from '@/API';
const Dashboard = {
  /**
   * Fetches all default thresholds for triggering alerts.
   */
  async createDashboard(
    variables: {},
    integration: any
  ): Promise<DashboardSnapshot> {
    const organizationId = API.Organization_v2.getCurrentId();
    let integrationID = integration.id;
    let type = integration.definition_id;
    const dashURL = '/graphdashboardv2/snapshot';
    if (type === 'agent') {
      type = 'kubernetes';
    }
    if (type === 'zenoss_anomaly') {
      integrationID = integration.metadata.integration_id;
    }

    if (type === 'aws_billing') {
      integrationID = integration.metadata.integration_id;
      variables = { timefrom: '24h', timenow: 'now' };
    }

    try {
      const response = await http.post(dashURL, {
        orgId: `${organizationId}`,
        variables,
        multidefault: true,
        integrationID,
        multidefaulttype: type,
      });
      if (typeof response.data !== 'object') {
        throw new Error('Dashboard is not available.');
      }
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Dashboard is not available.',
      });
      throw new Error(error);
    }
  },
};

export default Dashboard;

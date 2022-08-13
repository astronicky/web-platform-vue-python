import http from '@/common/http';
import API from '@/API';

const OrganizationPolicy = {
    async getOrganizationPolicy(organizationID: string): Promise<PolicyOrganization[]> {
        const response = await http.get('/governance/organization_policies', {
            params: {
            organization_id: organizationID,
            },
        });
        const orgpolicies = JSON.parse(JSON.stringify(response.data));
        return orgpolicies;
    },
    async deleteOrganizationPolicy(organizationID: string, policyID: string): Promise<any> {
      try {
        const response = await http.delete(`/governance/organization_policies/${organizationID}/${policyID}`);
        const orgpolicies = JSON.parse(JSON.stringify(response));
        return orgpolicies;
      } catch (error) {
        API.UI.addNotification({
            type: 'danger',
            text: 'Could not delete a policy due to an error.',
        });
        throw error;
    }
    },
    async createOrganizationPolicy(orgPolicy: Policy, orgID: string): Promise<any> {
        try {
          const response = await http.post('/governance/organization_policies/', {
            organization_id: orgID,
            policy_id: orgPolicy.policy_id,
            violation_msg: orgPolicy.violation_msg,
            severity: orgPolicy.severity,
            metadata: {
                query: orgPolicy.metadata.query,
                rule: orgPolicy.metadata.rule,
            },
          });
          const policies = JSON.parse(JSON.stringify(response));
          return policies;
        } catch (error) {
          API.UI.addNotification({
            type: 'danger',
            text: 'Could not create a policy due to an error.',
          });
          throw error;
        }
    },
};
export default OrganizationPolicy;

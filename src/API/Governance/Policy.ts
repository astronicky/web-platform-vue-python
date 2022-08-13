import http from '@/common/http';
import API from '@/API';

const Policy = {
    async getPolicy(organizationID: string, policyID: string = ''): Promise<any> {
        const response = await http.get('/governance/policies', {
            params: {
            organization_id: organizationID,
            policy_id: policyID,
            },
        });
        const policies = JSON.parse(JSON.stringify(response.data));
        return policies;
    },
    async getPolicyGroupByCategory(organizationID: string, policyID: string = ''): Promise<any> {
      const response = await http.get('governance/policies_category', {
          params: {
          organization_id: organizationID,
          policy_id: policyID,
          },
      });
      const policies = JSON.parse(JSON.stringify(response.data));
      return policies;
    },
    async createPolicy(policy: Policy, orgID: string): Promise<any> {
        try {
          let policyId = '';
          let msg = 'added';
          if (policy.policy_id !== '') {
            policyId = policy.policy_id;
            msg = 'updated';
          }
          const response = await http.post('/governance/policies', {
            organization_id: orgID,
            policy_id: policyId,
            policy_type: policy.policy_type === '' ? 'opa' : policy.policy_type,
            policy_name: policy.policy_name,
            policy_desc: policy.policy_desc,
            violation_msg: policy.violation_msg,
            service_type: policy.service_type,
            category: policy.Category,
            check_nonexistent_resource: policy.check_nonexistent_resource,
            severity: policy.severity,
            metadata: {
                query: policy.metadata.query,
                rule: policy.metadata.rule,
            },
          });
          const policies = JSON.parse(JSON.stringify(response.data));
          API.UI.addNotification({
            type: 'primary',
            text: 'Succesfully ' + msg + ' policy',
          });
          return policies;
        } catch (error) {
          API.UI.addNotification({
            type: 'danger',
            text: 'Could not add/update policy due to an error.',
          });
          throw error;
        }
    },
    async deletePolicy(orgID: string, policyID: string): Promise<Role> {
        try {
            const response = await http.delete(`/governance/policies/${orgID}/${policyID}`);
            const policies = JSON.parse(JSON.stringify(response.data));
            API.UI.addNotification({
                type: 'primary',
                text: 'Succesfully removed policy',
            });
            return policies;
        } catch (error) {
            API.UI.addNotification({
                type: 'danger',
                text: 'Could not delete a policy due to an error.',
            });
            throw error;
        }
    },
    getAdminOrgId(): string {
      return '520a4dc6-4831-11ec-81d3-0242ac130003';
    },
    getBooleanOption(): string[] {
      return ['true', 'false'];
    },
    getCategoryOption(): string[] {
      return ['', 'RockyII', 'Security', 'Cost Optimization'];
    },
    getSevOption(): string[] {
      return ['', 'High', 'Moderate', 'Low'];
    },
};

export default Policy;

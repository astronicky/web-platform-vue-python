import http from '@/common/http';
import Auth from '@/common/auth';

const ResourceCache = {
    async getIntegrationResourcesByIntegrationIDandDateEvaluated(integrationID: string, dateEvaluated: string): Promise<ResourceCache[]> {
        const response = await http.get(`/governance/reports/integration/${integrationID}/${dateEvaluated}`);
        const resourcecache = JSON.parse(JSON.stringify(response?.data));
        return resourcecache;
    },
};

export default ResourceCache;

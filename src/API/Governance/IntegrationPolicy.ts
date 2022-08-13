import http from '@/common/http';
import Auth from '@/common/auth';

const IntegrationPolicy = {
    async getIntegrationPolicy(integrationId: string): Promise<any> {
        let integrationPolicy = [];
        await http.get('governance/integration_policies/',
        {
            params: {
                integration_id: integrationId,
            },
        }).then((res: any) => {
            integrationPolicy = res;
            Auth.validSession(true);
        });
        return integrationPolicy;
    },
};

export default IntegrationPolicy;

import http from '@/common/http';
import API from '@/API';

const globeBilling = {
  supportedProviders(): object {
    return {
      'Amazon Web Services': 'Amazon Web Services',
      'Google Cloud Platform': 'Google Cloud Platform',
      'Microsoft Azure': 'Microsoft Azure',
    };
  },

  blank(): Integration<GlobeBilling> {
    return {
      id: '',
      name: '',
      definition_id: 'globe_billing',
      image: '',
      enabled: true,
      editable: false,
      definition_type: 'input',
      tags: [],
      description: '',
      link: '',
      threshold_supported: '',
      organization_id: '',
      metadata: {
        provider_type: '',
        friendly_name: '',
      },
    };
  },
  async getOne(integrationId: string): Promise<Integration<GlobeBilling>> {
    const organizationId = API.Organization_v2.getCurrentId();
    const response = await http.get(
      `integration/${integrationId}`, {
        params: {
          organization_id: organizationId,
        }}
      );
    return response.data;
  },
};

export default globeBilling;

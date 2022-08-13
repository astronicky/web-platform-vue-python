import http from '@/common/http';
import store from '@/store/store';
import API from '@/API';

import * as STORE_INTEGRATION from '@/store/modules/STORE_INTEGRATION';

import threshold from './threshold';
import dashboard from './dashboard';


const GlobeBilling = {
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
  threshold,
  dashboard,
};

export default GlobeBilling;

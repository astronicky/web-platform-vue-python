import http from '@/common/http';
import API from '@/API';
import router from '@/router/router';

const slack = {
  async add(code: string | string[]) {
    const organizationId = API.Organization_v2.getCurrentId();

    try {
      /* tslint:disable-next-line:max-line-length */
      const redirectURI: string = `${process.env.VUE_APP_REDIRECT_URI}/v2/integrations/add/slack`;

      const response = await http.get('slack/oauth', {
        params: {
          organization_id: organizationId,
          code,
          redirect_uri: encodeURIComponent(redirectURI),
        },
      });
      API.UI.addNotification({
        type: 'primary',
        text: 'Slack added successfully.',
      });
      return response.data;
    } catch (error) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Error adding Slack.',
      });
      router.replace('/integrations');
      throw new Error('Failed to add Slack integration.');
    }
  },
  // async remove(integration: Integration<Slack>) {},
};

export default slack;

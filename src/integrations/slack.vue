<template>
  <div>
    <div v-if="!slackAdded">
      <h3>Authorize Slack</h3>
      <p>
        The Slack integration allows you to receive alerts to any Slack channel you like.
        Setup is simple and only takes a few clicks. To get started, you will need to:
      </p>
      <ul class="bullet">
        <li>
          have a cascadeo.io account,
        </li>
        <li>
          are signed into the Slack workspace you want to link,
        </li>
        <li>
          can add Slack apps to your workspace.
        </li>
      </ul>
      <p>
        Click the "Allow Permissions" button to get started.
        You will be redirected back to cascadeo.io when you are finished.
      </p>
      <div class="text-right">
        <a
          :href="slackUrl"
          class="button primary outline">
          <i class="fas fa-arrow-to-right"></i>
          Allow Permissions
        </a>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component
export default class SlackIntegration extends Vue {
  /* Variables */
  private slackAdded: boolean = false;
  private code: string | string[] = '';
  /* tslint:disable-next-line:max-line-length */

  /* Lifecycle */
  private created(): void {
    try {
      /* Coming back from Slack Redirect URL, User just added Slack as an integration */
      if ('id' in this.$route.query) {
        this.code = this.$route.query.id as string;
        this.slackAdded = true;
        API.Integration.slack.add(this.code)
          .then((res) => {
            router.replace('/integrations');
          });
      } else if ('error' in this.$route.query) { /* usually means "cancel" */
        API.UI.addNotification({
          type: 'default',
          text: 'Slack integration canceled successfully.',
        });
        router.replace('/integrations');
      }
    } catch (error) {
      router.replace('/integrations');
      throw new Error(error);
    }
  }

  /* Methods */
  get slackUrl(): string {
    let path: any = (router as any).history.current.path;
    const mode = API.Organization_v2.getMode();
    if (mode === 'v2') {
      path = `/v2${path}`;
    }

    const redirectURI: string = encodeURIComponent(`${process.env.VUE_APP_REDIRECT_URI}${path}`);
    const slackClientID: string = encodeURIComponent(`${process.env.VUE_APP_SLACK_CLIENT_ID}`);

    /* tslint:disable-next-line */
    return `https://slack.com/oauth/v2/authorize?scope=incoming-webhook,chat:write,files:read,files:write&client_id=${slackClientID}&redirect_uri=${redirectURI}`;
  }
}
</script>

<style lang="scss" scoped>
</style>

interface Slack {
    readonly definition_id: 'slack';
    organization_id: string;
    metadata: {
      account_id: string;
      channel: string;
      channel_id: string;
    };
}

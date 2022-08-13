/* Windows agent Integration */
interface Windows {
    readonly definition_id: 'windows';
    organization_id: string;
    config_type: string;
    metadata: {
      friendly_name: string;
      sqlserver: {
        integration_id: string,
        friendly_name: string,
        app_name: string,
        server_ip: string,
        server_port: string
      };
    };
}

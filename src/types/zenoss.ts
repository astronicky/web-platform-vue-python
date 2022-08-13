/* Zenoss Integration */
interface Zenoss {
    readonly definition_id: 'zenoss';
    organization_id: string;
    metadata: {
      friendly_name: string;
    };
}

/* Zenoss Anomaly */
interface ZenossAnomaly {
    definition_id: 'zenoss_anomaly';
    metadata: {
        friendly_name: string;
        integration_id?: string;
    };
}

interface AppNotification {
  text: string;
  type: string;
}

/* Values can be undefined because they come from localStorage */
interface UserSession {
  accessToken: string | undefined;
  expiresAt: number | undefined;
  idToken: string | undefined;
  roles: string | undefined;
}

interface NewUser {
  email: string;
  password: string;
}

interface User {
  user_id: string;
  email_verified: boolean;
  email: string;
  id: string;
  name: string;
  description: string;
}

interface Org {
  organization_id: string;
  label: string;
  order_by: number;
}

interface Pipeline {
  config: {
    name: string;
    pay_tier: object;
    show_graph: boolean;
  };
  id: string;
  integrations: Array<Integration<All>>;
  organization_id: string;
}

interface Threshold {
  alertattributes: { [key: string]: any };
  alertid: string;
  alertpath: string;
}

interface Report {
  reports: string[];
}

interface SysMessage {
  timestamp: number;
  type: 'error' | 'log' | 'status' | 'kapacitor_alert' | 'endpoint_alert';
  code: string;
  short_description: string;
  long_description: string;
  cascadeo_description: string;
  metadata: object;
}

/**
 * Integrations
 */

interface IntegrationDefinition {
  readonly definition_id: string; // aws
  readonly name: string; // Amazon Web Services
  readonly image: string; // aws.png (DEPRECATED)
  readonly enabled: boolean;
  readonly editable: boolean;
  readonly definition_type: 'input' | 'output';
  readonly tags: string[]; // monitoring/environment/chat/etc
  readonly link: string; // https://signin.aws.amazon.com/console, https://console.cloud.google.com
  readonly description: string; // Cloud-based internet infrastructure.
  readonly threshold_supported: string;
}

type Integration<T> = IntegrationDefinition & IntegrationData<T>;

type IntegrationData<T> = T & {
  readonly definition_id: string; // aws
  id: string; // 3631b091-ed18-42f0-98d7-53bce71dcd4b
  organization_id: string;
  metadata: object & CommonMetadata;
};

interface CommonMetadata {
  threshold_evaluator?: string;
}

type All =
  | Slack
  | AWS
  | AWSBilling
  | Azure
  | GCP
  | VictorOps
  | Zendesk
  | Email
  | Endpoint
  | CascadeoIo
  | Netapp
  | Bluematador
  | Agent
  | Zenoss
  | ZenossAnomaly
  | GlobeBilling
  | Windows
  | Sqlserver
  | Linux
  | DevOpsGuru
  | Cloudtrail
  | InventoryMgmt
  | Logmanagement;

interface AWS {
  readonly definition_id: 'aws';
  organization_id: string;
  metadata: {
    friendly_name: string;
    account_id: string;
    region: string;
    billing_only: boolean;
    cur_config?: {
      status: string;
      s3_bucket: string;
      report_path_prefix: string;
    };
    ce_config?: {
      status: string;
      interval: string;
      granularity: string;
    };
    cloudtrail_config?: {
      status: string;
      retention_days: string;
      integration_id: string;
    };
  };
}

/* AWSBilling For billing dashboards for AWS */
interface AWSBilling {
  definition_id: 'aws_billing';
  metadata: {
    friendly_name: string;
    integration_id?: string;
  };
}

interface GCP {
  readonly definition_id: 'gcp';
  organization_id: string;
  metadata: {
    project_name: string;
    project_id: string;
    region: string;
    gcp_config?: {
      status: string;
      billing_id: string;
      dataset_id: string;
      bq_location: string;
      scheduler_region: string;
    };
  };
}

interface Azure {
  readonly definition_id: 'azure';
  organization_id: string;
  secrets: {
    client_secret: string;
  };
  metadata: {
    subscription_id: string;
    managed_identity: string;
    resource_group: string;
    tenant_id: string;
    client_id: string;
    region: string;
    friendly_name: string;
    azure_config?: {
      status: string;
      ca_name: string;
      sa_name: string;
      container_name: string;
      // blob_name: string;
    };
  };
}

interface VictorOps {
  readonly definition_id: 'victorops';
  organization_id: string;
  metadata: {
    incident_uri: string;
  };
}

interface Zendesk {
  readonly definition_id: 'zendesk';
  organization_id: string;
  secrets: {
    password: string;
  };
  metadata: {
    zendesk_uri: string;
    username: string;
  };
}

interface Bluematador {
  readonly definition_id: 'bluematador';
  organization_id: string;
  secrets: {
    token: string;
  };
  metadata: {
    name: string;
    account_id: string;
  };
}

interface Email {
  readonly definition_id: 'email';
  organization_id: string;
  metadata: {
    listname: string;
    emails: string[];
  };
}

interface Endpoint {
  readonly definition_id: 'endpoint';
  organization_id: string;
  metadata: {
    name: string;
    paused: boolean;
    endpoints: Array<{
      name: string;
      url: string;
      check_interval: string;
      shouldcontain: string;
      shouldnotcontain: string;
      probe: string;
      port: number | null;
    }>;
  };
}

interface CascadeoIo {
  readonly definition_id: 'cascadeo_io';
  organization_id: string;
  metadata: {
    name: string;
    readonly errors: true;
    logs: boolean;
    statuses: boolean;
  };
}

interface Netapp {
  readonly definition_id: 'netapp';
  organization_id: string;
  secrets: {
    secret_key: string;
  };
  metadata: {
    cmi_integration_id: string;
    telegraf_plugin_type: 'input';
    telegraf_plugin_name: 'netapp_cvs';
    region: string;
    url: string;
    api_key: string;
  };
}

/**
 * Dashboard
 */

interface DashboardSnapshot {
  deletekey: string;
  deleteurl: string;
  snapshoturl: string;
  url: string;
}

interface DashboardVars {
  dashboardname: string;
  resource: string;
  metricgroup: string;
  field: string;
  object: string;
  timefrom: string;
  timenow: string;
  orgId: string;
  dsname: string;
}

/* Kubernetes agent Integration */
interface Agent {
  readonly definition_id: 'agent';
  organization_id: string;
  metadata: {
    friendly_name: string;
    cluster: '';
    metric_urls: string[];
  };
}

interface IntegrationCredentials {
  client_id: string;
  client_secret: string;
}

interface AgentConfig {
  integration_id: string;
  configuration_id: string;
  configuration: string;
  type: string; // 'k8s.daemonset' | 'k8s.deployment' ;
}

interface ThresholdTemplate {
  name: string;
  parameters: TemplateParameter[];
}

interface TemplateParameter {
  name: string;
  type: string;
}

/* Sqlserver agent Integration */
interface Sqlserver {
  readonly definition_id: 'sqlserver';
  organization_id: string;
  metadata: {
    friendly_name: string;
    port: string;
    integration_dependency: string;
    host_provider: string;
  };
}

/* DevOps Guru Integration */
interface DevOpsGuru {
  readonly definition_id: 'devopsguru';
  organization_id: string;
  metadata: {
    account_id: string;
    region: string;
    friendly_name: string;
    subscription_state: string;
    notification_id: string;
    topic_arn: string;
    subscription_arn: string;
    subscription_endpoint: string;
    config_exists: string;
  };
}

/* Linux agent Integration */
interface Linux {
  readonly definition_id: 'linux';
  organization_id: string;
  config_type: string;
  metadata: {
    friendly_name: string;
    diskio: {
      devices: string[];
      devicetags: string[];
    };
    procstat: {
      pattern: string;
    };
    ping: {
      urls: string[];
    };
    tail: {
      log: {
        files: string[];
        grok_patterns: string[];
        grok_custom_patterns: string[];
      },
      metric: {
        files: string[];
        grok_patterns: string[];
        grok_custom_patterns: string[];
        default: object;
      },
      integration_id: string;
      friendly_name: string;
    }

  };
}

interface Cloudtrail {
  readonly definition_id: 'cloudtrail';
  organization_id: string;
  metadata: {
    account_id: string;
    region: string;
    friendly_name: string;
    trail_status: string;
    retention_days: string;
    trail_arn: string;
    integration_dependency: string;

  };
}

interface Logmanagement {
  readonly definition_id: 'logmanagement';
  organization_id: string;
  metadata: {
    friendly_name: string;
    log: object;
    integration_dependency: string;
    metric: object;
    host_provider: string;
  };
}

interface InventoryMgmt {
  readonly definition_id: 'inventory_mgmt';
  organization_id: string;
  metadata: {
    provider_type: string;
    friendly_name: string;
    account_id: string;
    enabled: boolean;
    gov_policy_enable: boolean;
  };
}

interface Inventory {
  integrationId: string;
  resourceId: string;
  serviceType: string;
  first_seen: string;
  metadata: {
      query: string;
      rule: string;
  };
}

interface Definition {
  serviceType: string;
  provider: string;
  category: Array<{
    s: string;
  }>;
  showData: Array<{
    s: string;
  }>;
}

/* Governance Policies */
interface Policy {
    organization_id?: string;
    policy_id: string;
    policy_type: string;
    policy_name: string;
    policy_desc: string;
    violation_msg: string;
    service_type: string;
    severity: string;
    Category: string;
    check_nonexistent_resource: string;
    metadata: {
        query: string;
        rule: string;
  };
}

interface PolicyMap {
  [index: string]:
    {
      organization_id?: string;
      policy_id: string;
      policy_type: string;
      policy_name: string;
      policy_desc: string;
      violation_msg: string;
      service_type: string;
      severity: string;
      Category: string;
      check_nonexistent_resource: string;
      metadata: {
          query: string;
          rule: string;
    }
  };
}

interface PolicyIntegration {
  integrationId: string;
  organizationId: string;
  policyId: string;
  dateCreated: Date;
  dateModified: Date;
}

interface PolicyOrganization {
  organization_id: string;
  policy_id: string;
  severity: string;
  violation_msg: string;
  metadata: {
    query: string;
    rule: string;
  };
}

interface ResourceCache {
  job_id: string;
  resource_id: string;
  data_evaluated: Date;
  integration_id: string;
  job_result: string;
  job_status: string;
  metadata: object;
  organization_id?: string;
  policy_id: string;
  service_type: string;
  severity: string;
  tags: string;
  violation_msg: string;
}

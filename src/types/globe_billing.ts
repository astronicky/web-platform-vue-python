interface GlobeBilling {
  readonly definition_id: 'globe_billing';
  organization_id: string;
  metadata: {
    provider_type: string;
    friendly_name: string;
  };
}

type GlobeBillingThreshold<T> = T & {
  readonly Type: string;
  ID?: string;
  Name: string;
  IntegrationID: string;
  Enabled: boolean;
  Notes: string;
  Severity: 'critical' | 'warning' | '';
  Metadata: object;
};

type AllGlobeBillingThresholds =
  | GlobeBillingStaticBudgetThreshold
  | GlobeBillingForecastBudgetThreshold
  | GlobeBillingAnomalyThreshold
  | GlobeBillingEmpty;

interface GlobeBillingEmpty {
  readonly Type: '';
  Metadata: object;
}

interface GlobeBillingStaticBudgetThreshold {
  readonly Type: 'static_budget';
  Metadata: {
    Threshold: number;
    TransactionType: string;
  };
}

interface GlobeBillingForecastBudgetThreshold {
  readonly Type: 'forecast_budget';
  Metadata: {
    PredictionFactor: number;
    Threshold: number;
    TransactionType: string;
  };
}

interface GlobeBillingAnomalyThreshold {
  readonly Type: 'anomaly_budget';
  Metadata: {
    AnomalyFactor: number;
    TransactionType: string;
  };
}

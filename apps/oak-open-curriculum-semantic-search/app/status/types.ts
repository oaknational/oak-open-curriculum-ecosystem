export interface HealthStatus {
  es: 'ok' | 'down' | 'error' | 'unknown';
  sdk: 'ok' | 'error' | 'unknown';
  llm: 'enabled' | 'disabled';
}

export interface HealthDetails {
  esError?: string;
  sdkError?: unknown;
  fatal?: string;
}

export interface HealthPayload {
  status: HealthStatus;
  details: HealthDetails;
}

export interface StatusCardConfig {
  title: string;
  summary: string;
  tone: 'positive' | 'negative' | 'neutral';
  description?: string;
}

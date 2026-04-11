export type HealthStatus = 'pass' | 'warn' | 'fail';

export interface HealthCheckResult {
  readonly key: string;
  readonly label: string;
  readonly status: HealthStatus;
  readonly summary: string;
  readonly details: string[];
}

export interface AgentInfrastructureHealthReport {
  readonly overallStatus: HealthStatus;
  readonly checks: readonly HealthCheckResult[];
  readonly stats: Readonly<Record<HealthStatus, number>>;
}

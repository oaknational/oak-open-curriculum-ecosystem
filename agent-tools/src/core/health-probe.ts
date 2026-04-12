import { evaluateParityChecks } from './health-probe-parity';
import { evaluateStateChecks } from './health-probe-state';
import type {
  AgentInfrastructureHealthReport,
  HealthCheckResult,
  HealthStatus,
} from './health-probe-types';

export function evaluateAgentInfrastructureHealth(
  repoRoot: string,
  now: Date = new Date(),
): AgentInfrastructureHealthReport {
  const checks = [...evaluateParityChecks(repoRoot), ...evaluateStateChecks(repoRoot, now)];

  return {
    overallStatus: deriveOverallStatus(checks),
    checks,
    stats: countStatuses(checks),
  };
}

export function formatAgentInfrastructureHealthReport(
  report: AgentInfrastructureHealthReport,
): string {
  const lines: string[] = [
    'Agent Infrastructure Health',
    `Overall: ${report.overallStatus.toUpperCase()} ` +
      `(${report.stats.pass} pass, ${report.stats.warn} warn, ${report.stats.fail} fail)`,
    '',
    'Summary',
  ];

  for (const check of report.checks) {
    lines.push(`- ${check.status.toUpperCase()} ${check.label} — ${check.summary}`);
  }

  const nonPassingChecks = report.checks.filter((check) => check.status !== 'pass');
  if (nonPassingChecks.length === 0) {
    return lines.join('\n');
  }

  lines.push('', 'Details');
  for (const check of nonPassingChecks) {
    lines.push('', `## ${check.label}`);
    for (const detail of check.details) {
      lines.push(`- ${detail}`);
    }
  }

  return lines.join('\n');
}

function countStatuses(
  checks: readonly HealthCheckResult[],
): Readonly<Record<HealthStatus, number>> {
  return {
    pass: checks.filter((check) => check.status === 'pass').length,
    warn: checks.filter((check) => check.status === 'warn').length,
    fail: checks.filter((check) => check.status === 'fail').length,
  };
}

function deriveOverallStatus(checks: readonly HealthCheckResult[]): HealthStatus {
  if (checks.some((check) => check.status === 'fail')) {
    return 'fail';
  }
  if (checks.some((check) => check.status === 'warn')) {
    return 'warn';
  }
  return 'pass';
}

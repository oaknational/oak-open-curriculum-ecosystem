import { describe, expect, it } from 'vitest';

import {
  evaluateAgentInfrastructureHealth,
  formatAgentInfrastructureHealthReport,
} from '../src/core/health-probe';
import { createHealthyRepo } from './health-probe.fixtures';

describe('health probe', () => {
  it('reports a healthy repo when the core infrastructure surfaces align', () => {
    const repoRoot = createHealthyRepo({ continuityLastRefreshed: '2026-04-03' });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));

    expect(report.overallStatus).toBe('pass');
    expect(report.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it('fails when command adapter parity drifts across supported platforms', () => {
    const repoRoot = createHealthyRepo({
      omitCommandAdapters: ['.claude/commands/jc-review.md'],
      continuityLastRefreshed: '2026-04-03',
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const commandParityCheck = report.checks.find(
      (check) => check.key === 'command-adapter-parity',
    );

    expect(commandParityCheck?.status).toBe('fail');
    expect(commandParityCheck?.details).toContain('Claude Code: missing adapters for review');
  });

  it('warns when the continuity contract is older than the freshness window', () => {
    const repoRoot = createHealthyRepo({
      continuityLastRefreshed: '2026-03-01',
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const continuityCheck = report.checks.find(
      (check) => check.key === 'continuity-contract-freshness',
    );

    expect(continuityCheck?.status).toBe('warn');
  });

  it('formats a summary-first health report when a warning is present', () => {
    const repoRoot = createHealthyRepo({ continuityLastRefreshed: '2026-03-01' });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const output = formatAgentInfrastructureHealthReport(report);

    expect(output).toContain('Agent Infrastructure Health');
    expect(output).toContain('Summary');
    expect(output).toContain('Continuity contract freshness');
    expect(output).toContain('Details');
  });
});

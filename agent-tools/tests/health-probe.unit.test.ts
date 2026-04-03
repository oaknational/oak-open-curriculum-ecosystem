import { describe, expect, it } from 'vitest';

import {
  evaluateAgentInfrastructureHealth,
  formatAgentInfrastructureHealthReport,
} from '../src/core/health-probe';
import { createHealthyRepo } from './health-probe.fixtures';

describe('health probe', () => {
  it('reports a healthy repo when the core infrastructure surfaces align', () => {
    const repoRoot = createHealthyRepo();

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));

    expect(report.overallStatus).toBe('pass');
    expect(report.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it('fails when command adapter parity drifts across supported platforms', () => {
    const repoRoot = createHealthyRepo({
      omitCommandAdapters: ['.claude/commands/jc-review.md'],
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const commandParityCheck = report.checks.find(
      (check) => check.key === 'command-adapter-parity',
    );

    expect(commandParityCheck?.status).toBe('fail');
    expect(commandParityCheck?.details).toContain('Claude Code: missing adapters for review');
  });

  it('warns when the continuity prompt drifts from the live practice-box state', () => {
    const repoRoot = createHealthyRepo({
      practiceBoxFiles: ['incoming-a.md'],
      continuityPracticeBoxCount: 0,
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const continuityCheck = report.checks.find(
      (check) => check.key === 'continuity-prompt-freshness',
    );

    expect(continuityCheck?.status).toBe('warn');
    expect(continuityCheck?.details.join('\n')).toContain('practice box');
  });

  it('fails when the continuity prompt is structurally incomplete even if drift warnings exist', () => {
    const repoRoot = createHealthyRepo({
      practiceBoxFiles: ['incoming-a.md'],
      continuityPracticeBoxCount: 0,
      removeContinuityField: 'Current objective',
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const continuityCheck = report.checks.find(
      (check) => check.key === 'continuity-prompt-freshness',
    );

    expect(continuityCheck?.status).toBe('fail');
    expect(continuityCheck?.details.join('\n')).toContain('Current objective');
  });

  it('formats a summary-first health report', () => {
    const repoRoot = createHealthyRepo({
      practiceBoxFiles: ['incoming-a.md'],
      continuityPracticeBoxCount: 0,
    });

    const report = evaluateAgentInfrastructureHealth(repoRoot, new Date('2026-04-03T12:00:00Z'));
    const output = formatAgentInfrastructureHealthReport(report);

    expect(output).toContain('Agent Infrastructure Health');
    expect(output).toContain('Summary');
    expect(output).toContain('Continuity prompt freshness');
    expect(output).toContain('Details');
  });
});

import { describe, expect, it } from 'vitest';

import { formatAgentInfrastructureHealthReport } from '../src/core/health-probe';
import {
  evaluateHookPolicySpineCoherenceFromInputs,
  evaluatePracticeBoxState,
} from '../src/core/health-probe-hook-state';
import type { AgentInfrastructureHealthReport } from '../src/core/health-probe-types';

const wiredClaudeSettingsText = JSON.stringify({
  hooks: {
    PreToolUse: [
      {
        matcher: 'Bash',
        hooks: [
          {
            type: 'command',
            command: 'node scripts/check-blocked-patterns.mjs',
          },
        ],
      },
    ],
  },
});

const documentedSurfaceMatrix = [
  '.agent/hooks/policy.json',
  'scripts/check-blocked-patterns.mjs',
  'Policy Spine',
  'override prune block',
].join('\n');

describe('hook policy spine health', () => {
  it('passes when policy, tracked activation, and surface matrix align', () => {
    expect(
      evaluateHookPolicySpineCoherenceFromInputs({
        hookPolicyExists: true,
        claudeSupportStatus: 'supported',
        surfaceMatrixText: documentedSurfaceMatrix,
        claudeSettingsText: wiredClaudeSettingsText,
      }),
    ).toMatchObject({
      key: 'hook-policy-spine',
      status: 'pass',
    });
  });

  it('fails when supported Claude hook policy has no tracked settings file', () => {
    const result = evaluateHookPolicySpineCoherenceFromInputs({
      hookPolicyExists: true,
      claudeSupportStatus: 'supported',
      surfaceMatrixText: documentedSurfaceMatrix,
      claudeSettingsText: null,
    });

    expect(result.status).toBe('fail');
    expect(result.details).toContain(
      '.agent/hooks/policy.json marks Claude Code as supported, but tracked project .claude/settings.json is missing.',
    );
  });

  it('fails when the surface matrix omits the hook policy spine', () => {
    const result = evaluateHookPolicySpineCoherenceFromInputs({
      hookPolicyExists: true,
      claudeSupportStatus: 'supported',
      surfaceMatrixText: null,
      claudeSettingsText: wiredClaudeSettingsText,
    });

    expect(result.status).toBe('fail');
    expect(result.details).toContain(
      '.agent/memory/executive/cross-platform-agent-surface-matrix.md is missing.',
    );
  });
});

describe('practice box health', () => {
  it('is pure over the incoming file count', () => {
    expect(evaluatePracticeBoxState(0).status).toBe('pass');
    expect(evaluatePracticeBoxState(2)).toMatchObject({
      status: 'warn',
      summary: '2 incoming Practice artefacts are waiting for integration.',
    });
  });
});

describe('health report formatting', () => {
  it('formats a summary-first report with details for non-passing checks', () => {
    const report: AgentInfrastructureHealthReport = {
      overallStatus: 'warn',
      stats: { pass: 1, warn: 1, fail: 0 },
      checks: [
        {
          key: 'hook-policy-spine',
          label: 'Hook Policy Spine coherence',
          status: 'pass',
          summary: 'Hook policy aligned.',
          details: [],
        },
        {
          key: 'practice-box-state',
          label: 'Practice box state',
          status: 'warn',
          summary: 'Incoming artefacts are waiting.',
          details: ['Use jc-consolidate-docs.'],
        },
      ],
    };

    const output = formatAgentInfrastructureHealthReport(report);

    expect(output).toContain('Agent Infrastructure Health');
    expect(output).toContain('Summary');
    expect(output).toContain('Practice box state');
    expect(output).toContain('Details');
    expect(output).toContain('Use jc-consolidate-docs.');
  });
});

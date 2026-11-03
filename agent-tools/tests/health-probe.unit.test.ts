import { describe, expect, it } from 'vitest';

import { formatAgentInfrastructureHealthReport } from '../src/core/health-probe';
import {
  evaluateHookPolicySpineCoherenceFromInputs,
  evaluatePracticeBoxState,
} from '../src/core/health-probe-hook-state';
import { evaluateReviewerAdapterParityFromInputs } from '../src/core/health-probe-parity';
import type { AgentInfrastructureHealthReport } from '../src/core/health-probe-types';

const wiredClaudeSettingsText = JSON.stringify({
  hooks: {
    PreToolUse: [
      {
        matcher: 'Bash',
        hooks: [
          {
            type: 'command',
            command:
              'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/run-pretooluse-guard.mjs" agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js',
          },
        ],
      },
    ],
  },
});

const documentedSurfaceMatrix = [
  '.agent/hooks/policy.json',
  'agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js',
  'Policy Spine',
  'override prune block',
].join('\n');

const declared = [
  { name: 'code-expert', platforms: ['cursor', 'claude', 'codex', 'gemini'] },
  { name: 'cricket-judgement-high', platforms: ['cursor', 'claude'] },
] as const;
const everywhere = ['code-expert', 'cricket-judgement-high'];

describe('reviewer adapter parity health', () => {
  it('passes when every adapter is present exactly where its declaration names it', () => {
    const result = evaluateReviewerAdapterParityFromInputs({
      declared,
      present: {
        cursor: everywhere,
        claude: everywhere,
        codex: ['code-expert'],
        gemini: ['code-expert'],
      },
    });

    expect(result).toMatchObject({ status: 'pass', details: [] });
    expect(result.summary).toBe(
      '2 declared reviewer adapters are aligned across their declared platform surfaces.',
    );
  });

  it('reports an adapter on a surface its declaration does not name, and one no declaration renders', () => {
    const result = evaluateReviewerAdapterParityFromInputs({
      declared,
      present: {
        cursor: everywhere,
        claude: everywhere,
        codex: ['code-expert', 'cricket-judgement-high'],
        gemini: ['code-expert', 'hand-authored'],
      },
    });

    expect(result).toMatchObject({
      status: 'fail',
      details: [
        'Codex has unsupported reviewer adapter cricket-judgement-high.',
        'Gemini has unsupported reviewer adapter hand-authored.',
      ],
    });
  });

  it('reports a declared adapter missing from a surface its declaration names', () => {
    const result = evaluateReviewerAdapterParityFromInputs({
      declared,
      present: {
        cursor: everywhere,
        claude: ['code-expert'],
        codex: ['code-expert'],
        gemini: [],
      },
    });

    expect(result).toMatchObject({
      status: 'fail',
      details: [
        'Claude Code is missing reviewer adapter cricket-judgement-high.',
        'Gemini is missing reviewer adapter code-expert.',
      ],
    });
  });
});

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

  it('names the consolidate-docs skill by its canonical id, with no adapter prefix', () => {
    const details = evaluatePracticeBoxState(1).details.join('\n');
    expect(details).toContain('the consolidate-docs skill');
    expect(details).not.toMatch(/[a-z]+-consolidate-docs/u);
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
          details: ['Use the consolidate-docs skill.'],
        },
      ],
    };

    const output = formatAgentInfrastructureHealthReport(report);

    expect(output).toContain('Agent Infrastructure Health');
    expect(output).toContain('Summary');
    expect(output).toContain('Practice box state');
    expect(output).toContain('Details');
    expect(output).toContain('Use the consolidate-docs skill.');
  });
});

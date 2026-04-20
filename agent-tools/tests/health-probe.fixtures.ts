import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

export interface HealthyRepoOptions {
  readonly omitCommandAdapters?: readonly string[];
  readonly practiceBoxFiles?: readonly string[];
  readonly continuityLastRefreshed?: string;
  readonly omitContinuityContract?: boolean;
}

const HOOK_POLICY_FIXTURE = JSON.stringify(
  {
    platform_support: {
      claude_code: {
        status: 'supported',
      },
    },
  },
  null,
  2,
);

const CLAUDE_SETTINGS_FIXTURE = JSON.stringify(
  {
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
  },
  null,
  2,
);

const HOOK_SURFACE_MATRIX_FIXTURE = [
  '# Matrix',
  '',
  '| Surface | Cursor | Claude Code | Gemini CLI | GitHub Copilot | Codex | `.agents/` |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  '| **Hooks** | unsupported | `.claude/settings.json` (tracked project `PreToolUse`) | unsupported | unsupported | unsupported | unsupported |',
  '',
  '.agent/hooks/policy.json',
  'scripts/check-blocked-patterns.mjs',
  '',
  '## Policy Spine',
  '',
  'override | prune | block',
].join('\n');
export function createHealthyRepo(options: HealthyRepoOptions = {}): string {
  const repoRoot = mkdtempSync(join(tmpdir(), 'agent-health-'));
  const omitCommandAdapters = new Set(options.omitCommandAdapters ?? []);
  const practiceBoxFiles = options.practiceBoxFiles ?? [];

  writeRepoFile(repoRoot, '.agent/commands/review.md', '# review');
  writeRepoFile(repoRoot, '.agent/commands/gates.md', '# gates');
  writeCommandAdapters(repoRoot, omitCommandAdapters);
  writeReviewerFixtures(repoRoot);
  writeHookFixtures(repoRoot);
  initialisePracticeBox(repoRoot);

  for (const fileName of practiceBoxFiles) {
    writeRepoFile(repoRoot, `.agent/practice-core/incoming/${fileName}`, '# incoming');
  }

  if (!options.omitContinuityContract) {
    writeContinuityContract(repoRoot, options.continuityLastRefreshed ?? '2026-04-03');
  }

  return repoRoot;
}
function writeContinuityContract(repoRoot: string, lastRefreshed: string): void {
  // Minimal continuity contract — the probe checks presence + freshness
  // only; structural assertions belong to the write-side (session-handoff).
  writeRepoFile(
    repoRoot,
    '.agent/memory/operational/repo-continuity.md',
    ['# Repo Continuity', '', `**Last refreshed**: ${lastRefreshed}`, ''].join('\n'),
  );
}
function writeCommandAdapters(repoRoot: string, omitCommandAdapters: ReadonlySet<string>): void {
  writeAdapterIfEnabled(
    repoRoot,
    '.cursor/commands/jc-review.md',
    'Read and follow `.agent/commands/review.md`.',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.cursor/commands/jc-gates.md',
    'Read and follow `.agent/commands/gates.md`.',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.claude/commands/jc-review.md',
    'Read and follow `.agent/commands/review.md`.',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.claude/commands/jc-gates.md',
    'Read and follow `.agent/commands/gates.md`.',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.gemini/commands/jc-review.toml',
    'prompt = "Read and follow `.agent/commands/review.md`."\n',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.gemini/commands/jc-gates.toml',
    'prompt = "Read and follow `.agent/commands/gates.md`."\n',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.agents/skills/jc-review/SKILL.md',
    '---\nname: jc-review\ndescription: Review a pull request\n---\n',
    omitCommandAdapters,
  );
  writeAdapterIfEnabled(
    repoRoot,
    '.agents/skills/jc-gates/SKILL.md',
    '---\nname: jc-gates\ndescription: Run quality gates\n---\n',
    omitCommandAdapters,
  );
}
function writeReviewerFixtures(repoRoot: string): void {
  writeRepoFile(repoRoot, '.cursor/agents/code-reviewer.md', 'name: code-reviewer\n');
  writeRepoFile(repoRoot, '.claude/agents/code-reviewer.md', 'name: code-reviewer\n');
  writeRepoFile(
    repoRoot,
    '.codex/agents/code-reviewer.toml',
    [
      'name = "code-reviewer"',
      'description = "Gateway reviewer"',
      'model_reasoning_effort = "medium"',
      'sandbox_mode = "danger-full-access"',
      'approval_policy = "never"',
      'developer_instructions = """',
      'Read `.agent/sub-agents/templates/code-reviewer.md`.',
      '"""',
      '',
    ].join('\n'),
  );
  writeRepoFile(
    repoRoot,
    '.codex/config.toml',
    [
      '[agents."code-reviewer"]',
      'description = "Gateway reviewer"',
      'config_file = ".codex/agents/code-reviewer.toml"',
      '',
    ].join('\n'),
  );
  writeRepoFile(repoRoot, '.agent/sub-agents/templates/code-reviewer.md', '# code reviewer');
}
function writeHookFixtures(repoRoot: string): void {
  writeRepoFile(repoRoot, '.agent/hooks/policy.json', HOOK_POLICY_FIXTURE);
  writeRepoFile(repoRoot, '.claude/settings.json', CLAUDE_SETTINGS_FIXTURE);
  writeRepoFile(
    repoRoot,
    '.agent/memory/executive/cross-platform-agent-surface-matrix.md',
    HOOK_SURFACE_MATRIX_FIXTURE,
  );
}
function initialisePracticeBox(repoRoot: string): void {
  mkdirSync(join(repoRoot, '.agent/practice-core/incoming'), { recursive: true });
  writeRepoFile(repoRoot, '.agent/practice-core/incoming/.gitkeep', '');
}
function writeAdapterIfEnabled(
  repoRoot: string,
  relativePath: string,
  content: string,
  omitCommandAdapters: ReadonlySet<string>,
): void {
  if (omitCommandAdapters.has(relativePath)) {
    return;
  }

  writeRepoFile(repoRoot, relativePath, content);
}
function writeRepoFile(repoRoot: string, relativePath: string, content: string): void {
  const absolutePath = join(repoRoot, relativePath);
  mkdirSync(join(absolutePath, '..'), { recursive: true });
  writeFileSync(absolutePath, content);
}

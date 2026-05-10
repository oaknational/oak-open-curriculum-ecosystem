# Rules Index

This file is the canonical, platform-independent enumeration of the
always-applied repository rules. It is the discoverability surface for
agents and humans alike, and the project-doc resolution path for
platforms (such as Codex) that do not auto-load `.agent/rules/`.

Before substantive work in this repository, read and apply every canonical
rule listed below. Treat these files as behavioural modifiers for the
session. If a rule points to a directive, ADR, PDR, skill, command, or
other canonical file, follow that pointer before acting in the affected
area.

Each rule has three on-disk forms:

- canonical content lives under `.agent/rules/` (the source of truth).
- Claude Code platform forwarder lives under `.claude/rules/` (one-line
  pointer to the canonical file).
- Cursor platform forwarder lives under `.cursor/rules/` (with `.mdc`
  extension; frontmatter sets `alwaysApply: true` plus a pointer to the
  canonical file).

Platforms that auto-load their adapter tier (Claude, Cursor) pick up
the canonical content via the forwarder. Platforms that do not
auto-load (Codex, Gemini, and any other non-loader runtime) MUST read
the canonical files in `.agent/rules/` directly. This index enumerates
those canonical files; keeping the three on-disk forms aligned is part
of the rule-authoring contract.

When adding a new rule, land all three forms plus an entry in this
index in the same commit.

## Canonical Rules

- `.agent/rules/apply-architectural-principles.md`
- `.agent/rules/capture-practice-tool-feedback.md`
- `.agent/rules/consolidate-at-third-consumer.md`
- `.agent/rules/directive-file-context-budget.md`
- `.agent/rules/documentation-hygiene.md`
- `.agent/rules/dont-break-build-without-fix-plan.md`
- `.agent/rules/executive-memory-drift-capture.md`
- `.agent/rules/follow-agent-collaboration-practice.md`
- `.agent/rules/follow-collaboration-practice.md`
- `.agent/rules/follow-the-practice.md`
- `.agent/rules/generator-first-mindset.md`
- `.agent/rules/invoke-accessibility-expert.md`
- `.agent/rules/invoke-assumptions-expert.md`
- `.agent/rules/invoke-clerk-expert.md`
- `.agent/rules/invoke-code-experts.md`
- `.agent/rules/invoke-design-system-expert.md`
- `.agent/rules/invoke-elasticsearch-expert.md`
- `.agent/rules/invoke-mcp-expert.md`
- `.agent/rules/invoke-react-component-expert.md`
- `.agent/rules/invoke-sentry-expert.md`
- `.agent/rules/lint-after-edit.md`
- `.agent/rules/markdown-code-blocks-must-have-language.md`
- `.agent/rules/monitor-branch-touched-files.md`
- `.agent/rules/never-disable-checks.md`
- `.agent/rules/never-use-git-to-remove-work.md`
- `.agent/rules/no-conditional-tests.md`
- `.agent/rules/no-global-state-in-tests.md`
- `.agent/rules/no-hedging-vocabulary.md`
- `.agent/rules/no-machine-local-paths.md`
- `.agent/rules/no-moving-targets-in-permanent-docs.md`
- `.agent/rules/no-skipped-tests.md`
- `.agent/rules/no-speed-pressure.md`
- `.agent/rules/no-type-shortcuts.md`
- `.agent/rules/no-verify-requires-fresh-authorisation.md`
- `.agent/rules/no-warning-toleration.md`
- `.agent/rules/plan-body-first-principles-check.md`
- `.agent/rules/practice-core-portability.md`
- `.agent/rules/pre-merge-divergence-analysis.md`
- `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`
- `.agent/rules/read-agent-md.md`
- `.agent/rules/read-before-asking.md`
- `.agent/rules/read-diagnostic-artefacts-in-full.md`
- `.agent/rules/register-active-areas-at-session-open.md`
- `.agent/rules/register-identity-on-thread-join.md`
- `.agent/rules/replace-dont-bridge.md`
- `.agent/rules/respect-active-agent-claims.md`
- `.agent/rules/sonarqube-mcp-instructions.md`
- `.agent/rules/stage-by-explicit-pathspec.md`
- `.agent/rules/strict-validation-at-boundary.md`
- `.agent/rules/subagent-practice-core-protection.md`
- `.agent/rules/tdd-for-refactoring.md`
- `.agent/rules/test-immediate-fails.md`
- `.agent/rules/unknown-is-type-destruction.md`
- `.agent/rules/use-agent-comms-log.md`
- `.agent/rules/use-result-pattern.md`
- `.agent/rules/validate-full-target-estate.md`
- `.agent/rules/validators-must-recompute-not-just-record.md`

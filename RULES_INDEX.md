# Rules Index

This file is the canonical, platform-independent enumeration of the
always-applied repository rules. It is the discoverability surface for
agents and humans alike, and the project-doc resolution path for
platforms (such as Codex) that do not auto-load `.agent/rules/`.

Before substantive work in this repository, read and apply every
canonical rule listed below. Treat these files as behavioural modifiers
for the session. If a rule points to a directive, ADR, PDR, skill,
command, or other canonical file, follow that pointer before acting in
the affected area.

Each rule has three on-disk forms:

- canonical content lives under `.agent/rules/` (the source of truth).
- Claude Code platform forwarder lives under `.claude/rules/` (one-line
  pointer to the canonical file).
- Cursor platform forwarder lives under `.cursor/rules/` (with `.mdc`
  extension; frontmatter sets `alwaysApply: true` plus a pointer to the
  canonical file).
- `.agents/` directory carries the same one-line forwarder for other
  platforms that load adapters from there.

Platforms that auto-load their adapter tier (Claude, Cursor) pick up
the canonical content via the forwarder. Platforms that do not
auto-load (Codex, Gemini, and any other non-loader runtime) MUST read
the canonical files in `.agent/rules/` directly. This index enumerates
those canonical files; keeping the three on-disk forms aligned is part
of the rule-authoring contract.

When adding a new rule, land all three forms plus an entry in this
index in the same commit.

## Classification

Each rule is classified by when it loads into the active session
context:

- `always-on` — applied unconditionally at every session, every edit,
  every decision moment. The baseline behavioural-modifier corpus.
- `trigger-loaded` — applied when a named situational trigger fires
  (e.g. team session bootstrap, specific code-area edit, sub-agent
  review dispatch). Trigger-loaded rules reduce baseline directive
  load while remaining authoritative at their firing moment.

The classification is structural — moving a rule between
classifications requires a new-rule-vs-pdr-clause-style decision and a
commit explaining the change. The `new-rule-vs-pdr-clause.md`
meta-rule governs authoring of new entries and tier changes.

When in doubt, `always-on` is the conservative default. A rule is
`trigger-loaded` only when the firing trigger is precisely nameable
and the rule's substance would otherwise inflate baseline directive
cost beyond the
[`directive-file-context-budget`](.agent/rules/directive-file-context-budget.md)
without proportional value.

## Canonical Rules

| Rule                                                                       | Classification | Trigger / Loading Signal                                                                         |
| -------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `.agent/rules/agent-state-observable.md`                                   | always-on      | —                                                                                                |
| `.agent/rules/agents-default-no-gender.md`                                 | always-on      | —                                                                                                |
| `.agent/rules/apply-architectural-principles.md`                           | always-on      | —                                                                                                |
| `.agent/rules/capture-practice-tool-feedback.md`                           | always-on      | —                                                                                                |
| `.agent/rules/check-singleton-per-window.md`                               | always-on      | —                                                                                                |
| `.agent/rules/comms-all-channels-watcher.md`                               | trigger-loaded | Team session bootstrap                                                                           |
| `.agent/rules/consolidate-at-third-consumer.md`                            | always-on      | —                                                                                                |
| `.agent/rules/continuity-surface-commits-as-orphans.md`                    | always-on      | —                                                                                                |
| `.agent/rules/directive-file-context-budget.md`                            | always-on      | —                                                                                                |
| `.agent/rules/documentation-hygiene.md`                                    | always-on      | —                                                                                                |
| `.agent/rules/dont-break-build-without-fix-plan.md`                        | always-on      | —                                                                                                |
| `.agent/rules/executive-memory-drift-capture.md`                           | always-on      | —                                                                                                |
| `.agent/rules/follow-agent-collaboration-practice.md`                      | always-on      | —                                                                                                |
| `.agent/rules/follow-collaboration-practice.md`                            | always-on      | —                                                                                                |
| `.agent/rules/follow-the-practice.md`                                      | always-on      | —                                                                                                |
| `.agent/rules/generator-first-mindset.md`                                  | always-on      | —                                                                                                |
| `.agent/rules/handoff-messages-self-contained.md`                          | always-on      | —                                                                                                |
| `.agent/rules/hook-policy-substring-discipline.md`                         | always-on      | —                                                                                                |
| `.agent/rules/important-state-not-in-temp-files.md`                        | always-on      | —                                                                                                |
| `.agent/rules/invoke-accessibility-expert.md`                              | trigger-loaded | Accessibility-touching change (WCAG / keyboard / focus / contrast / ARIA)                        |
| `.agent/rules/invoke-assumptions-expert.md`                                | trigger-loaded | Plan authoring, decision-complete marking, blocking-relationship assertion, or 3+ agent dispatch |
| `.agent/rules/invoke-clerk-expert.md`                                      | trigger-loaded | Clerk / OAuth / authentication / sign-in / sign-up / token verification                          |
| `.agent/rules/invoke-code-experts.md`                                      | trigger-loaded | Code change requires review (post-write gateway)                                                 |
| `.agent/rules/invoke-design-system-expert.md`                              | trigger-loaded | Design token / theming / CSS custom property / colour palette change                             |
| `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | trigger-loaded | Significant behavioural, public API, or architectural change without paired doc update           |
| `.agent/rules/invoke-elasticsearch-expert.md`                              | trigger-loaded | Elasticsearch mapping / analyser / query / retriever / ELSER / RRF change                        |
| `.agent/rules/invoke-mcp-expert.md`                                        | trigger-loaded | MCP tool / resource / prompt definition or transport / session pattern change                    |
| `.agent/rules/invoke-react-component-expert.md`                            | trigger-loaded | React component edit (hooks, render, prop API, composition)                                      |
| `.agent/rules/invoke-sentry-expert.md`                                     | trigger-loaded | Sentry / OpenTelemetry / observability change                                                    |
| `.agent/rules/knowledge-preservation-over-fitness-warnings.md`             | always-on      | —                                                                                                |
| `.agent/rules/lint-after-edit.md`                                          | always-on      | —                                                                                                |
| `.agent/rules/liveness-heartbeat-cron.md`                                  | trigger-loaded | Team session bootstrap                                                                           |
| `.agent/rules/local-broken-code-never-leaves.md`                           | always-on      | —                                                                                                |
| `.agent/rules/loop-exit-criteria-required.md`                              | always-on      | —                                                                                                |
| `.agent/rules/markdown-code-blocks-must-have-language.md`                  | always-on      | —                                                                                                |
| `.agent/rules/monitor-branch-touched-files.md`                             | always-on      | —                                                                                                |
| `.agent/rules/never-disable-checks.md`                                     | always-on      | —                                                                                                |
| `.agent/rules/never-use-git-to-remove-work.md`                             | always-on      | —                                                                                                |
| `.agent/rules/new-rule-vs-pdr-clause.md`                                   | always-on      | —                                                                                                |
| `.agent/rules/no-conditional-tests.md`                                     | always-on      | —                                                                                                |
| `.agent/rules/no-global-state-in-tests.md`                                 | always-on      | —                                                                                                |
| `.agent/rules/no-hedging-vocabulary.md`                                    | always-on      | —                                                                                                |
| `.agent/rules/no-machine-local-paths.md`                                   | always-on      | —                                                                                                |
| `.agent/rules/no-moving-targets-in-permanent-docs.md`                      | always-on      | —                                                                                                |
| `.agent/rules/no-skipped-tests.md`                                         | always-on      | —                                                                                                |
| `.agent/rules/no-speed-pressure.md`                                        | always-on      | —                                                                                                |
| `.agent/rules/no-tombstones-for-removed-ideas.md`                          | always-on      | —                                                                                                |
| `.agent/rules/no-type-shortcuts.md`                                        | always-on      | —                                                                                                |
| `.agent/rules/no-verify-requires-fresh-authorisation.md`                   | always-on      | —                                                                                                |
| `.agent/rules/no-warning-toleration.md`                                    | always-on      | —                                                                                                |
| `.agent/rules/owner-attention-at-action-moments.md`                        | always-on      | —                                                                                                |
| `.agent/rules/per-user-memory-is-a-buffer.md`                              | always-on      | —                                                                                                |
| `.agent/rules/ping-before-escalate.md`                                     | always-on      | —                                                                                                |
| `.agent/rules/plan-body-first-principles-check.md`                         | always-on      | —                                                                                                |
| `.agent/rules/practice-core-portability.md`                                | always-on      | —                                                                                                |
| `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`          | always-on      | —                                                                                                |
| `.agent/rules/present-verdicts-not-menus.md`                               | always-on      | —                                                                                                |
| `.agent/rules/pre-merge-divergence-analysis.md`                            | trigger-loaded | Pre-merge of two diverged feature branches (100+ files, 10+ conflicts, core interface refactor)  |
| `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`        | always-on      | —                                                                                                |
| `.agent/rules/read-agent-md.md`                                            | always-on      | —                                                                                                |
| `.agent/rules/read-before-asking.md`                                       | always-on      | —                                                                                                |
| `.agent/rules/read-diagnostic-artefacts-in-full.md`                        | always-on      | —                                                                                                |
| `.agent/rules/register-active-areas-at-session-open.md`                    | always-on      | —                                                                                                |
| `.agent/rules/register-identity-on-thread-join.md`                         | always-on      | —                                                                                                |
| `.agent/rules/replace-dont-bridge.md`                                      | always-on      | —                                                                                                |
| `.agent/rules/respect-active-agent-claims.md`                              | always-on      | —                                                                                                |
| `.agent/rules/sha-prefix-in-collaboration-content.md`                      | always-on      | —                                                                                                |
| `.agent/rules/ship-independent-coordinate-dependent.md`                    | always-on      | —                                                                                                |
| `.agent/rules/sonarqube-mcp-instructions.md`                               | trigger-loaded | SonarQube MCP server usage                                                                       |
| `.agent/rules/stage-by-explicit-pathspec.md`                               | always-on      | —                                                                                                |
| `.agent/rules/strict-validation-at-boundary.md`                            | always-on      | —                                                                                                |
| `.agent/rules/subagent-practice-core-protection.md`                        | always-on      | —                                                                                                |
| `.agent/rules/tdd-for-refactoring.md`                                      | always-on      | —                                                                                                |
| `.agent/rules/test-immediate-fails.md`                                     | always-on      | —                                                                                                |
| `.agent/rules/unknown-is-type-destruction.md`                              | always-on      | —                                                                                                |
| `.agent/rules/use-agent-comms-log.md`                                      | always-on      | —                                                                                                |
| `.agent/rules/use-built-agent-tools-cli.md`                                | always-on      | —                                                                                                |
| `.agent/rules/use-monitor-for-event-driven-wake.md`                        | always-on      | —                                                                                                |
| `.agent/rules/use-result-pattern.md`                                       | always-on      | —                                                                                                |
| `.agent/rules/validate-full-target-estate.md`                              | always-on      | —                                                                                                |
| `.agent/rules/validators-must-recompute-not-just-record.md`                | always-on      | —                                                                                                |
| `.agent/rules/verify-dont-trust.md`                                        | always-on      | —                                                                                                |
| `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md`            | always-on      | —                                                                                                |

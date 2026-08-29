# Rules Index

This file is the canonical, platform-independent enumeration of the
repository rules. It is the discoverability surface for
agents and humans alike, and the project-doc resolution path for
platforms (such as Codex) that do not auto-load `.agent/rules/`.

Before substantive work in this repository, read and apply every _relevant_
canonical rule listed below. Treat these files as behavioural modifiers
for the session. If a rule points to a directive, ADR, PDR, skill,
command, or other canonical file, follow that pointer before acting in
the affected area.

Each rule has four on-disk forms:

- canonical content lives under `.agent/rules/` (the source of truth).
- Claude Code platform forwarder lives under `.claude/rules/` (one-line
  pointer to the canonical file).
- Cursor platform forwarder lives under `.cursor/rules/` (with `.mdc`
  extension; frontmatter mirrors the classification — core rules set
  `alwaysApply: true`; situational rules set
  `alwaysApply: false` plus a description, or scope by `globs` where
  the trigger is a file-surface match (auto-attach is the `surface:*`
  loader realised on Cursor) — and carries a pointer to the canonical
  file).
- `.agents/` directory carries the same one-line forwarder for other
  platforms that load adapters from there.

Platforms that auto-load their adapter tier (Claude, Cursor) pick up
the canonical content via the forwarder. Platforms that do not
auto-load (Codex, Gemini, and any other non-loader runtime) MUST read
all relevant canonical files in `.agent/rules/` directly.

This index enumerates those canonical files; keeping the four on-disk forms aligned is part
of the rule-authoring contract.

When adding a new rule, land all four forms plus an entry in this
index in the same commit.

**A rule's opening carries its compliance mechanics, not only its trigger.**
Rules are read through lossy intermediaries: a context-constrained seat, a
digest, a summary line, a non-loader platform's partial read. Those readers
reliably receive the **trigger** ("when does this fire?") and reliably lose the
**mechanics** ("what does compliance actually require?") — and a seat that knows a
rule fired but not how to comply authors a confident, wrong compliance plan
rather than asking. The observable failure is not silence; it is fluent
non-compliance that cites the rule correctly. So put the load-bearing mechanics —
the command, the ordering constraint, the thing that must be true — inside the
trigger-first opening where a truncated read still reaches it, and leave the
worked instances and rationale below for the full read. (Graduated 2026-08-06
from a 2026-07-27 first-contact specimen; the register held it for a second
sighting, which the promote-on-first-instance direction does not require.)

## Classification

Each rule is classified by when it loads into the active session
context (classes and per-row assignments per the owner-ratified
reclassification sweep, 2026-08-02):

- `core` — applied unconditionally at every session, every edit,
  every decision moment. The baseline behavioural-modifier corpus.
- `situational` — applied when a named trigger fires. Situational
  rules reduce baseline directive load while remaining authoritative
  at their firing moment.

A situational row's Trigger / Loading Signal cell leads with a typed
trigger instance from a four-family vocabulary, chosen so a loader —
not the agent's own recall — can recognise the moment:

- `surface:<name>` — a path, file class, or data surface a loader can
  match.
- `tool:<name>` — a specific tool call or command class.
- `session:<shape>` — a structural session shape known at bootstrap
  (loads at team bootstrap and at rejoin-after-compaction).
- `ceremony:<step>` — a named workflow step; sound only where a
  reliably-firing skill carries the pointer.

Instances are enumerated by the rows themselves; a new instance lands
through
[`capability-landing-decision-procedure`](.agent/rules/capability-landing-decision-procedure.md).
Loader contract: `surface:*` and `tool:*` instances are enumerated as
path globs or command patterns in loader configuration; `ceremony:*`
instances are carried by the named skill's own text. A situational
rule with no functioning recognition path is a deleted rule.

The classification is structural — moving a rule between
classifications requires a new-rule-vs-pdr-clause-style decision and a
commit explaining the change. The `new-rule-vs-pdr-clause.md`
meta-rule governs authoring of new entries and tier changes.

When in doubt, `core` is the conservative default. A rule is
`situational` only when the firing trigger is precisely nameable as a
typed instance and the rule's substance would otherwise inflate
baseline directive cost beyond the
[`directive-file-context-budget`](.agent/rules/directive-file-context-budget.md)
without proportional value.

For a non-auto-loading platform, _relevant_ is mechanically decidable
from this index alone: every `core` row, plus any
`situational` row whose Trigger / Loading Signal
matches the session's work. Nothing else needs reading at session
start; a situational rule loads at its trigger's moment.

## Canonical Rules

| Rule                                                                       | Classification | Trigger / Loading Signal                                                                           |
| -------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `.agent/rules/agent-experience-review-lens.md`                             | situational    | surface:agent-substrate                                                                            |
| `.agent/rules/agentic-judgment-conserve-by-default.md`                     | core           | —                                                                                                  |
| `.agent/rules/agent-state-observable.md`                                   | core           | —                                                                                                  |
| `.agent/rules/agents-default-no-gender.md`                                 | core           | —                                                                                                  |
| `.agent/rules/apply-architectural-principles.md`                           | core           | —                                                                                                  |
| `.agent/rules/bot-identity-on-third-party-systems.md`                      | core           | —                                                                                                  |
| `.agent/rules/capability-landing-decision-procedure.md`                    | situational    | surface:lever-authoring — Landing, converting, or re-homing a capability; not landed-home edits    |
| `.agent/rules/capture-practice-tool-feedback.md`                           | core           | —                                                                                                  |
| `.agent/rules/check-singleton-per-window.md`                               | situational    | tool:gate-sweep                                                                                    |
| `.agent/rules/closed-shape-design-optionality.md`                          | core           | —                                                                                                  |
| `.agent/rules/collaboration-is-value-contingent.md`                        | core           | —                                                                                                  |
| `.agent/rules/comms-all-channels-watcher.md`                               | situational    | session:team — Team session bootstrap                                                              |
| `.agent/rules/confident-seats-proceed-and-report.md`                       | core           | —                                                                                                  |
| `.agent/rules/consolidate-at-second-consumer.md`                           | core           | —                                                                                                  |
| `.agent/rules/continuity-surface-commits-as-orphans.md`                    | situational    | ceremony:commit                                                                                    |
| `.agent/rules/coordination-branch-24h-lifetime.md`                         | situational    | ceremony:branch-cut — Cutting a coordination branch, or session-open on one                        |
| `.agent/rules/cross-repo-sessions-run-the-join-ceremony.md`                | situational    | surface:cross-repo — Worktree repo ≠ coordination home, or sibling-estate write/registration       |
| `.agent/rules/design-values-come-from-the-system.md`                       | situational    | surface:design — Authoring or reviewing a design value on a consumer surface                       |
| `.agent/rules/design-work-for-small-prs.md`                                | core           | —                                                                                                  |
| `.agent/rules/design-from-impact-not-the-cowpath.md`                       | core           | —                                                                                                  |
| `.agent/rules/render-the-reference-before-reproducing.md`                  | situational    | surface:design — Beginning or reviewing work whose acceptance is likeness to a reference artefact  |
| `.agent/rules/directed-routing-requires-absorption-ack.md`                 | situational    | session:team — Team session active; a directed event carrying routing or an ask sent or absorbed   |
| `.agent/rules/directive-file-context-budget.md`                            | situational    | surface:directive-files ∪ ceremony:consolidation                                                   |
| `.agent/rules/documentation-hygiene.md`                                    | core           | —                                                                                                  |
| `.agent/rules/dont-break-build-without-fix-plan.md`                        | core           | —                                                                                                  |
| `.agent/rules/eef-corpus-grounding.md`                                     | situational    | surface:eef-corpus — Authoring/editing a claim about the EEF corpus or EEF-thread work             |
| `.agent/rules/executive-memory-drift-capture.md`                           | core           | —                                                                                                  |
| `.agent/rules/exit-codes-in-band-never-piped.md`                           | core           | —                                                                                                  |
| `.agent/rules/fleet-design-review-before-expensive-fleets.md`              | situational    | task:fleet-design — Designing or pricing a fleet beyond the default size guideline or ~500k tokens |
| `.agent/rules/follow-agent-collaboration-practice.md`                      | core           | —                                                                                                  |
| `.agent/rules/follow-collaboration-practice.md`                            | core           | —                                                                                                  |
| `.agent/rules/follow-the-practice.md`                                      | core           | —                                                                                                  |
| `.agent/rules/foreign-board-write-discipline.md`                           | core           | —                                                                                                  |
| `.agent/rules/generator-first-mindset.md`                                  | situational    | surface:codegen                                                                                    |
| `.agent/rules/handoff-messages-self-contained.md`                          | core           | —                                                                                                  |
| `.agent/rules/hook-policy-substring-discipline.md`                         | core           | —                                                                                                  |
| `.agent/rules/identify-as-agent-under-shared-credentials.md`               | core           | —                                                                                                  |
| `.agent/rules/important-state-not-in-temp-files.md`                        | core           | —                                                                                                  |
| `.agent/rules/invoke-accessibility-expert.md`                              | situational    | surface:accessibility — Accessibility-touching change (WCAG / keyboard / focus / contrast / ARIA)  |
| `.agent/rules/invoke-assumptions-expert.md`                                | situational    | ceremony:plan-authoring — Plan authoring, decision-complete marks, blocking claims, 3+ agents      |
| `.agent/rules/invoke-clerk-expert.md`                                      | situational    | surface:clerk-auth — Clerk / OAuth / authentication / sign-in / sign-up / token verification       |
| `.agent/rules/invoke-code-experts.md`                                      | core           | —                                                                                                  |
| `.agent/rules/invoke-design-system-expert.md`                              | situational    | surface:design — Design token / theming / CSS custom property / colour palette change              |
| `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | situational    | ceremony:significant-doc-change — Behaviour/API/architecture change without a paired doc update    |
| `.agent/rules/invoke-elasticsearch-expert.md`                              | situational    | surface:elasticsearch — Elasticsearch mapping / analyser / query / retriever / ELSER / RRF change  |
| `.agent/rules/invoke-mcp-expert.md`                                        | situational    | surface:mcp-protocol — MCP tool/resource/prompt definition or transport/session pattern change     |
| `.agent/rules/invoke-react-component-expert.md`                            | situational    | surface:react-component — React component edit (hooks, render, prop API, composition)              |
| `.agent/rules/invoke-sentry-expert.md`                                     | situational    | surface:observability — Sentry / OpenTelemetry / observability change                              |
| `.agent/rules/knowledge-preservation-over-fitness-warnings.md`             | core           | —                                                                                                  |
| `.agent/rules/linear-mcp-team-and-project-hygiene.md`                      | situational    | tool:linear — any ticket mint, move, re-project, or placement audit                                |
| `.agent/rules/lint-after-edit.md`                                          | situational    | surface:source-authoring                                                                           |
| `.agent/rules/liveness-heartbeat-cron.md`                                  | situational    | session:team — Team session bootstrap                                                              |
| `.agent/rules/local-broken-code-never-leaves.md`                           | core           | —                                                                                                  |
| `.agent/rules/lockfile-rebuild-survivability.md`                           | situational    | surface:dependency-management                                                                      |
| `.agent/rules/loop-exit-criteria-required.md`                              | situational    | tool:loop-cron-monitor                                                                             |
| `.agent/rules/markdown-code-blocks-must-have-language.md`                  | situational    | surface:markdown-authoring                                                                         |
| `.agent/rules/monitor-branch-touched-files.md`                             | situational    | ceremony:commit ∪ session:open                                                                     |
| `.agent/rules/never-commit-to-main.md`                                     | core           | —                                                                                                  |
| `.agent/rules/never-disable-checks.md`                                     | core           | —                                                                                                  |
| `.agent/rules/never-use-git-to-remove-work.md`                             | core           | —                                                                                                  |
| `.agent/rules/new-rule-vs-pdr-clause.md`                                   | core           | —                                                                                                  |
| `.agent/rules/no-conditional-tests.md`                                     | situational    | surface:test-authoring                                                                             |
| `.agent/rules/no-global-state-in-tests.md`                                 | core           | —                                                                                                  |
| `.agent/rules/no-hedging-vocabulary.md`                                    | core           | —                                                                                                  |
| `.agent/rules/notion-strategy-page-fence.md`                               | core           | —                                                                                                  |
| `.agent/rules/no-moving-targets-in-permanent-docs.md`                      | core           | —                                                                                                  |
| `.agent/rules/no-parallel-long-lived-branches.md`                          | core           | —                                                                                                  |
| `.agent/rules/no-speed-pressure.md`                                        | core           | —                                                                                                  |
| `.agent/rules/no-tombstones-for-removed-ideas.md`                          | core           | —                                                                                                  |
| `.agent/rules/no-unbounded-host-load.md`                                   | core           | —                                                                                                  |
| `.agent/rules/no-verify-requires-fresh-authorisation.md`                   | core           | —                                                                                                  |
| `.agent/rules/no-warning-toleration.md`                                    | core           | —                                                                                                  |
| `.agent/rules/notion-page-edits-update-ledger.md`                          | situational    | tool:notion                                                                                        |
| `.agent/rules/oak-chrome-session-is-metered.md`                            | situational    | tool:chrome-browser                                                                                |
| `.agent/rules/owner-attention-at-action-moments.md`                        | core           | —                                                                                                  |
| `.agent/rules/pr-comments-resolve-and-recheck.md`                          | situational    | ceremony:pr-lifecycle                                                                              |
| `.agent/rules/per-user-memory-is-a-buffer.md`                              | core           | —                                                                                                  |
| `.agent/rules/permanent-doc-is-the-consolidation-record.md`                | core           | —                                                                                                  |
| `.agent/rules/ping-before-escalate.md`                                     | situational    | session:team                                                                                       |
| `.agent/rules/plan-body-first-principles-check.md`                         | core           | —                                                                                                  |
| `.agent/rules/practice-core-portability.md`                                | situational    | surface:practice-core                                                                              |
| `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`          | situational    | ceremony:loop-cycle                                                                                |
| `.agent/rules/precedence-is-not-approval.md`                               | core           | —                                                                                                  |
| `.agent/rules/present-verdicts-not-menus.md`                               | core           | —                                                                                                  |
| `.agent/rules/pre-merge-divergence-analysis.md`                            | situational    | ceremony:merge — Pre-merge of two diverged branches (100+ files, 10+ conflicts, core refactor)     |
| `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`        | core           | —                                                                                                  |
| `.agent/rules/read-agent-md.md`                                            | core           | —                                                                                                  |
| `.agent/rules/read-before-asking.md`                                       | core           | —                                                                                                  |
| `.agent/rules/read-diagnostic-artefacts-in-full.md`                        | core           | —                                                                                                  |
| `.agent/rules/read-nextjs-docs-before-coding.md`                           | situational    | surface:nextjs — Next.js work (routes, layouts, proxy, config, rendering/caching)                  |
| `.agent/rules/records-are-technical-not-emotional.md`                      | core           | —                                                                                                  |
| `.agent/rules/register-active-areas-at-session-open.md`                    | core           | —                                                                                                  |
| `.agent/rules/register-identity-on-thread-join.md`                         | core           | —                                                                                                  |
| `.agent/rules/replace-dont-bridge.md`                                      | core           | —                                                                                                  |
| `.agent/rules/respect-active-agent-claims.md`                              | core           | —                                                                                                  |
| `.agent/rules/route-blocks-and-questions-to-director.md`                   | core           | —                                                                                                  |
| `.agent/rules/rules-have-no-exceptions.md`                                 | core           | —                                                                                                  |
| `.agent/rules/scope-from-goal-before-approach.md`                          | core           | —                                                                                                  |
| `.agent/rules/sha-prefix-in-collaboration-content.md`                      | situational    | surface:collaboration-state                                                                        |
| `.agent/rules/ship-independent-coordinate-dependent.md`                    | situational    | ceremony:commit                                                                                    |
| `.agent/rules/silence-is-never-liveness.md`                                | core           | —                                                                                                  |
| `.agent/rules/skill-naming-and-description-quality.md`                     | situational    | ceremony:skill-authoring — Creating/renaming/editing any skill or its description; vendoring gate  |
| `.agent/rules/sonarqube-mcp-instructions.md`                               | situational    | tool:sonarqube-mcp — SonarQube MCP server usage                                                    |
| `.agent/rules/source-curriculum-content-via-api-not-cdn.md`                | core           | —                                                                                                  |
| `.agent/rules/source-is-typescript-esm-only.md`                            | situational    | surface:source-authoring                                                                           |
| `.agent/rules/stage-by-explicit-pathspec.md`                               | situational    | ceremony:commit                                                                                    |
| `.agent/rules/strict-validation-at-boundary.md`                            | core           | —                                                                                                  |
| `.agent/rules/subagent-practice-core-protection.md`                        | core           | —                                                                                                  |
| `.agent/rules/tdd-for-refactoring.md`                                      | core           | —                                                                                                  |
| `.agent/rules/test-immediate-fails.md`                                     | core           | —                                                                                                  |
| `.agent/rules/third-party-skills-require-security-review.md`               | situational    | ceremony:skill-vendoring                                                                           |
| `.agent/rules/use-agent-comms-log.md`                                      | situational    | session:team                                                                                       |
| `.agent/rules/use-built-agent-tools-cli.md`                                | situational    | tool:agent-tools-cli                                                                               |
| `.agent/rules/use-monitor-for-event-driven-wake.md`                        | situational    | tool:background-task-arm                                                                           |
| `.agent/rules/use-result-pattern.md`                                       | situational    | surface:source-authoring                                                                           |
| `.agent/rules/validate-full-target-estate.md`                              | core           | —                                                                                                  |
| `.agent/rules/validators-must-recompute-not-just-record.md`                | core           | —                                                                                                  |
| `.agent/rules/verify-data-supports-shape-before-building.md`               | core           | —                                                                                                  |
| `.agent/rules/verify-dont-trust.md`                                        | core           | —                                                                                                  |
| `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md`            | core           | —                                                                                                  |
| `.agent/rules/visual-verdicts-require-rendered-proof.md`                   | situational    | surface:design — Issuing any assessment of visual work                                             |
| `.agent/rules/worktree-hygiene.md`                                         | core           | —                                                                                                  |
| `.agent/rules/worktree-residency.md`                                       | core           | —                                                                                                  |

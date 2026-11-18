# Rules Index

Canonical, platform-independent enumeration of the repository rules — the
discoverability surface for agents and humans, and the project-doc resolution
path for platforms (such as Codex) that do not auto-load `.agent/rules/`.

Before substantive work, read and apply every _relevant_ canonical rule below:
every `core` row (always loaded; its trigger cell is an em dash) plus every
`situational` row whose trigger matches the session's work — a situational rule
loads at its trigger's moment. A trigger is `surface:<name or glob>` (a file
surface; the rule's own frontmatter `globs` name the patterns, and the Cursor
adapter attaches by them), `tool:<name>` (a tool call or command class),
`session:<shape>` (a session shape known at bootstrap) or `ceremony:<step>` (a
named workflow step), with an optional gloss after ` — `. Treat the rules as
behavioural modifiers for the session; follow any pointer a rule makes before
acting in the affected area. This file is generated from the rules' frontmatter
by `pnpm portability:fix` and recomputed by `pnpm portability:check`; never edit
it by hand.

| Rule | Classification | Trigger / Loading Signal |
| ---- | -------------- | ------------------------ |
| `.agent/rules/agent-experience-review-lens.md` | situational | `surface:agent-substrate` |
| `.agent/rules/agent-state-observable.md` | core | — |
| `.agent/rules/agentic-judgment-conserve-by-default.md` | core | — |
| `.agent/rules/agents-default-no-gender.md` | core | — |
| `.agent/rules/apply-architectural-principles.md` | core | — |
| `.agent/rules/bot-identity-on-third-party-systems.md` | core | — |
| `.agent/rules/capability-landing-decision-procedure.md` | situational | `surface:lever-authoring — Landing, converting, or re-homing a capability; not landed-home edits` |
| `.agent/rules/capture-practice-tool-feedback.md` | core | — |
| `.agent/rules/channel-by-audience-lifetime-and-consumer.md` | situational | `session:team — every cross-seat send` |
| `.agent/rules/check-singleton-per-window.md` | situational | `tool:gate-sweep` |
| `.agent/rules/closed-shape-design-optionality.md` | core | — |
| `.agent/rules/collaboration-is-value-contingent.md` | core | — |
| `.agent/rules/comms-all-channels-watcher.md` | situational | `session:team — Team session bootstrap` |
| `.agent/rules/compute-dont-hope.md` | core | — |
| `.agent/rules/confident-seats-proceed-and-report.md` | core | — |
| `.agent/rules/consolidate-at-second-consumer.md` | core | — |
| `.agent/rules/continuity-surface-commits-as-orphans.md` | situational | `ceremony:commit` |
| `.agent/rules/coordination-branch-24h-lifetime.md` | situational | `ceremony:branch-cut — Cutting a coordination branch, or session-open on one` |
| `.agent/rules/cross-estate-work-must-reduce-divergence.md` | situational | `ceremony:cross-estate-work — any activity that edits both estates` |
| `.agent/rules/cross-repo-sessions-run-the-join-ceremony.md` | situational | `surface:cross-repo — Worktree repo ≠ coordination home, or sibling-estate write/registration` |
| `.agent/rules/design-from-impact-not-the-cowpath.md` | core | — |
| `.agent/rules/design-values-come-from-the-system.md` | situational | `surface:design — Authoring or reviewing a design value on a consumer surface` |
| `.agent/rules/design-work-for-small-prs.md` | core | — |
| `.agent/rules/directed-routing-requires-absorption-ack.md` | situational | `session:team — Team session active; a directed event carrying routing or an ask sent or absorbed` |
| `.agent/rules/directive-file-context-budget.md` | situational | `surface:directive-files ∪ ceremony:consolidation` |
| `.agent/rules/documentation-hygiene.md` | core | — |
| `.agent/rules/dont-break-build-without-fix-plan.md` | core | — |
| `.agent/rules/downstream-checkout-never-writes-upstream-surfaces.md` | core | — |
| `.agent/rules/eef-corpus-grounding.md` | situational | `surface:eef-corpus — Authoring/editing a claim about the EEF corpus or EEF-thread work` |
| `.agent/rules/executive-memory-drift-capture.md` | core | — |
| `.agent/rules/exit-codes-in-band-never-piped.md` | core | — |
| `.agent/rules/fleet-design-review-before-expensive-fleets.md` | core | — |
| `.agent/rules/follow-agent-collaboration-practice.md` | core | — |
| `.agent/rules/follow-collaboration-practice.md` | core | — |
| `.agent/rules/follow-the-practice.md` | core | — |
| `.agent/rules/foreign-board-write-discipline.md` | core | — |
| `.agent/rules/generator-first-mindset.md` | situational | `surface:codegen` |
| `.agent/rules/handoff-messages-self-contained.md` | core | — |
| `.agent/rules/hook-policy-substring-discipline.md` | core | — |
| `.agent/rules/identify-as-agent-under-shared-credentials.md` | core | — |
| `.agent/rules/important-state-not-in-temp-files.md` | core | — |
| `.agent/rules/invoke-code-experts.md` | core | — |
| `.agent/rules/knowledge-preservation-over-fitness-warnings.md` | core | — |
| `.agent/rules/linear-mcp-team-and-project-hygiene.md` | situational | `tool:linear — any ticket mint, move, re-project, or placement audit` |
| `.agent/rules/lint-after-edit.md` | situational | `surface:source-authoring` |
| `.agent/rules/liveness-heartbeat-cron.md` | situational | `session:team — Team session bootstrap` |
| `.agent/rules/local-broken-code-never-leaves.md` | core | — |
| `.agent/rules/lockfile-rebuild-survivability.md` | situational | `surface:dependency-management` |
| `.agent/rules/loop-exit-criteria-required.md` | situational | `tool:loop-cron-monitor` |
| `.agent/rules/markdown-code-blocks-must-have-language.md` | situational | `surface:markdown-authoring` |
| `.agent/rules/monitor-branch-touched-files.md` | situational | `ceremony:commit ∪ session:open` |
| `.agent/rules/napkin-always-active.md` | core | — |
| `.agent/rules/never-commit-to-main.md` | core | — |
| `.agent/rules/never-disable-checks.md` | core | — |
| `.agent/rules/never-use-git-to-remove-work.md` | core | — |
| `.agent/rules/new-rule-vs-pdr-clause.md` | core | — |
| `.agent/rules/no-conditional-tests.md` | situational | `surface:test-authoring` |
| `.agent/rules/no-global-state-in-tests.md` | situational | `surface:test-authoring — tests, smokes, test helpers, fixtures and setup files` |
| `.agent/rules/no-hedging-vocabulary.md` | core | — |
| `.agent/rules/no-moving-targets-in-permanent-docs.md` | core | — |
| `.agent/rules/no-parallel-long-lived-branches.md` | core | — |
| `.agent/rules/no-speed-pressure.md` | core | — |
| `.agent/rules/no-tombstones-for-removed-ideas.md` | core | — |
| `.agent/rules/no-unbounded-host-load.md` | core | — |
| `.agent/rules/no-verify-requires-fresh-authorisation.md` | core | — |
| `.agent/rules/no-warning-toleration.md` | core | — |
| `.agent/rules/notion-page-edits-update-ledger.md` | situational | `tool:notion` |
| `.agent/rules/notion-strategy-page-fence.md` | core | — |
| `.agent/rules/oak-chrome-session-is-metered.md` | situational | `tool:chrome-browser` |
| `.agent/rules/one-instance-is-an-observation.md` | core | — |
| `.agent/rules/one-pr-per-leaf-issue.md` | core | — |
| `.agent/rules/owner-attention-at-action-moments.md` | core | — |
| `.agent/rules/per-user-memory-is-a-buffer.md` | core | — |
| `.agent/rules/permanent-doc-is-the-consolidation-record.md` | core | — |
| `.agent/rules/ping-before-escalate.md` | situational | `session:team` |
| `.agent/rules/plan-body-first-principles-check.md` | core | — |
| `.agent/rules/pr-comments-resolve-and-recheck.md` | situational | `ceremony:pr-lifecycle` |
| `.agent/rules/practice-core-portability.md` | situational | `surface:practice-core` |
| `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` | situational | `ceremony:loop-cycle` |
| `.agent/rules/pre-merge-divergence-analysis.md` | situational | `ceremony:merge — every merge: the premise sweep at any size; the full workflow past thresholds` |
| `.agent/rules/precedence-is-not-approval.md` | core | — |
| `.agent/rules/present-verdicts-not-menus.md` | core | — |
| `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md` | core | — |
| `.agent/rules/read-agent-md.md` | core | — |
| `.agent/rules/read-before-asking.md` | core | — |
| `.agent/rules/read-diagnostic-artefacts-in-full.md` | core | — |
| `.agent/rules/read-nextjs-docs-before-coding.md` | situational | `surface:nextjs — Next.js work (routes, layouts, proxy, config, rendering/caching)` |
| `.agent/rules/record-generalisation-moves.md` | situational | `surface:practice-substrate ∪ ceremony:commit` |
| `.agent/rules/records-are-technical-not-emotional.md` | core | — |
| `.agent/rules/register-active-areas-at-session-open.md` | core | — |
| `.agent/rules/register-identity-on-thread-join.md` | core | — |
| `.agent/rules/render-the-reference-before-reproducing.md` | situational | `surface:design — Beginning or reviewing work whose acceptance is likeness to a reference artefact` |
| `.agent/rules/replace-dont-bridge.md` | core | — |
| `.agent/rules/respect-active-agent-claims.md` | core | — |
| `.agent/rules/review-feedback-defaults-to-triage.md` | situational | `ceremony:pr-lifecycle` |
| `.agent/rules/route-blocks-and-questions-to-director.md` | core | — |
| `.agent/rules/rules-have-no-exceptions.md` | core | — |
| `.agent/rules/scope-from-goal-before-approach.md` | core | — |
| `.agent/rules/sha-prefix-in-collaboration-content.md` | situational | `surface:collaboration-state` |
| `.agent/rules/ship-independent-coordinate-dependent.md` | situational | `ceremony:commit` |
| `.agent/rules/silence-is-never-liveness.md` | core | — |
| `.agent/rules/skill-naming-and-description-quality.md` | situational | `ceremony:skill-authoring — Creating/renaming/editing any skill or its description; vendoring gate` |
| `.agent/rules/sonarqube-mcp-instructions.md` | situational | `tool:sonarqube-mcp — SonarQube MCP server usage` |
| `.agent/rules/source-curriculum-content-via-api-not-cdn.md` | core | — |
| `.agent/rules/source-is-typescript-esm-only.md` | situational | `surface:source-authoring` |
| `.agent/rules/stage-by-explicit-pathspec.md` | situational | `ceremony:commit` |
| `.agent/rules/strict-validation-at-boundary.md` | situational | `surface:boundary-data — TypeScript and authored content where external data enters` |
| `.agent/rules/subagent-practice-core-protection.md` | situational | `surface:AGENTS.md,CLAUDE.md,.agent/practice-core/**/*,.agent/directives/**/*,.agent/rules/**/*,.claude/rules/**/*,.cursor/rules/**/*` |
| `.agent/rules/tdd-for-refactoring.md` | core | — |
| `.agent/rules/test-immediate-fails.md` | situational | `surface:test-authoring` |
| `.agent/rules/third-party-skills-require-security-review.md` | situational | `ceremony:skill-vendoring` |
| `.agent/rules/unattended-seats-never-prompt.md` | core | — |
| `.agent/rules/use-agent-comms-log.md` | situational | `session:team` |
| `.agent/rules/use-built-agent-tools-cli.md` | situational | `tool:agent-tools-cli` |
| `.agent/rules/use-monitor-for-event-driven-wake.md` | situational | `tool:background-task-arm` |
| `.agent/rules/use-result-pattern.md` | situational | `surface:source-authoring` |
| `.agent/rules/validate-full-target-estate.md` | core | — |
| `.agent/rules/validators-must-recompute-not-just-record.md` | core | — |
| `.agent/rules/verify-data-supports-shape-before-building.md` | core | — |
| `.agent/rules/verify-dont-trust.md` | core | — |
| `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md` | core | — |
| `.agent/rules/visual-verdicts-require-rendered-proof.md` | situational | `surface:design — Issuing any assessment of visual work` |
| `.agent/rules/worktree-hygiene.md` | core | — |
| `.agent/rules/worktree-residency.md` | core | — |

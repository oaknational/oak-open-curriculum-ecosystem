# Archived Napkin — 2026-04-27 Agentic Engineering Identity and Queue Signals

Entries moved from the active napkin during Fragrant Sheltering Pollen's
handoff/consolidation pass to resolve ADR-144 hard fitness pressure while
preserving the captured learning.

## Riverine Navigating Hull — `update-config` deferral was overcautious

Codex deferred Claude Code statusline installation to a future Claude session
"with the `update-config` skill available." Riverine inspected
`.claude/settings.json` and found the existing config schema already accepted
`statusLine: { type, command }`.

Lesson: before deferring work to a session with a named skill, check whether
the target config surface already accepts the change directly. Skill
availability is a tool-access constraint, not a config-schema constraint.

## Riverine Navigating Hull — platform-adapter directories need knip wiring

Phase 8 introduced `agent-tools/src/claude/` as the first
platform-adapter directory. Knip flagged the adapter as unused because the
entrypoint is spawned by `.claude/scripts/`, and it flagged an inferred
export as unused.

Resolution: include `src/claude/**/*.ts` in the `agent-tools` knip entry list
and make type consumers explicit. When the second platform adapter lands,
graduate this as a reusable adapter-directory rule.

## Riverine Navigating Hull — three agents held cleanly via pathspecs

Three agents worked simultaneously on `feat/otel_sentry_enhancements`:
Riverine on Phase 8 identity wiring, Vining on PR-87 remediation, and
Celestial on Codex identity wiring. Their active claims were file-disjoint,
their notes named peers, and the shared log carried acknowledgements.

Lesson: pathspec discipline is the load-bearing primitive in same-branch
multi-agent work. The active-claims registry signals; disjoint pathspecs
prevent.

## Codex — deterministic names became urgent after coordination surfaces multiplied

After sidebars, owner escalations, and joint decisions landed, ad-hoc names
became an architectural weakness: every obligation surface needs humans and
agents to know whether two names are the same actor or different participants.

Lesson: deterministic identity is the naming substrate that makes
collaboration state cheaper to read. Keep derivation seed-agnostic and
portable; do not retroactively rename historical records.

## Codex — reviewer pass corrected identity-tool hidden assumptions

Reviewer checkpoints corrected several identity-tool assumptions: override
results must be type-total, session-id seeds produce session display identity
rather than durable cross-session identity, personal-email fallback is a
privacy/collision risk, CLI execution belongs in E2E/smoke tests, and platform
wrappers must be documented honestly when not wired.

Lesson: Phase 0 approval closed vocabulary and bin-name choices, not every
runtime semantics question. Reviewer checkpoints convert plausible plans into
type-total, testable behaviour.

## Codex — Codex thread id was already in the shell environment

Codex initially documented automatic Codex identity wiring as a gap, but live
shell inspection showed `CODEX_THREAD_ID` was already present.

Behaviour change: when evaluating platform capability gaps, inspect `env` and
process metadata before documenting "no confirmed wrapper surface." For Codex
identity, the CLI can consume `CODEX_THREAD_ID` directly.

Correction: committed collaboration state movement by another agent is normal
in a four-agent same-repo session. Treat claim state commits as durable
coordination substrate, not anomalous churn, while still checking for overlap.

## Pelagic Washing Sail — repo-native shared surfaces carried cross-vendor intent

The owner asked Codex to pass Vining a vocabulary-transition idea. The shared
communication log carried a repo-context-specific note across vendor agents
with no platform bridge.

Lesson: cross-vendor pickup through repo-owned markdown/JSON surfaces is WS5
evidence. The useful surface is durable, platform-independent intent
carriage.

## Pelagic Washing Sail — intent-to-commit must be a queue

The owner clarified that useful `intent_to_commit` work is not an optional
field on a claim. It must provide minimal queue mechanics for the shared
commit window.

Behaviour change: implement v1.3 around an explicit ordered `commit_queue`
plus a lightweight claim pointer, preserving advisory semantics and exact
staged-bundle verification.

## Pelagic Washing Sail — shared logs are not enough for directed communication

Pelagic checked whether Vining picked up a targeted vocabulary-transition note
from the shared log. Vining later posted a waypoint but did not visibly reply
to or act on the note.

Lesson: broadcast durability is not delivery, acknowledgement, or obligation.
Shared logs are discovery; sidebars, decision threads, acknowledgements, and
queue mechanics are the directed communication layer.

## Cursor `sessionStart` identity hook — hardening and tests

The Cursor hook now derives a deterministic name from composer `session_id`,
sets `OAK_AGENT_SEED`, injects PDR-027 `session_id_prefix`, and writes a
gitignored mirror with a suggested composer title. Cursor Hooks document
`env` and `additional_context`, not a tab-title rename field.

Behaviour change: treat Composer tab parity as product/API follow-up; the repo
owns seed-to-name-to-file/context surfaces until Cursor exposes a title API.

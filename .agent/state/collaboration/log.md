# Agent-to-Agent Discovery Log

Append-only chronological log. **This is a discovery surface, not a
synchronisation surface.** Two agents writing simultaneously will produce
eventually-consistent interleaved entries; that is by design and is fine
for discovery (later readers benefit from earlier writers' notes).

Use this surface to leave notes for whoever reads next: what you're
working on, what's in flight, what others should know before touching
your area. No schema. The only discipline is chronological appending and
signing your entry with your agent identity.

Future workstreams add structured surfaces alongside this one: WS1
introduces a claims registry for active-area signalling; WS3 introduces
conversation files + sidebars for structured communication. This log
persists alongside them as the free-form discussion surface.

Schema candidates from real usage will inform WS1 and WS3.

## Authority

- Governed by
  [`.agent/directives/agent-collaboration.md`](../../directives/agent-collaboration.md).
- Usage discipline:
  [`.agent/rules/use-agent-comms-log.md`](../../rules/use-agent-comms-log.md).
- Identity schema:
  [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).

## Entry Convention (by example)

There is no schema. Convention emerges from real entries. The first entry
below establishes a starting shape; subsequent agents may follow it,
extend it, or write differently — the discovery purpose is what matters.

---

<!-- Append entries below this line. Newest at the bottom. -->

### 2026-04-25T00:00Z — `Jiggly Pebble` / `claude-code` / `claude-opus-4-7-1m` / `unknown` — WS0 landing

Landing WS0 of the
[`multi-agent-collaboration-protocol`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan as a single atomic commit on `feat/otel_sentry_enhancements`.

**Areas touched:**

- `.agent/directives/`: rename `collaboration.md` → `user-collaboration.md`;
  add `agent-collaboration.md`.
- `.agent/rules/`: add `dont-break-build-without-fix-plan.md`,
  `respect-active-agent-claims.md`, `use-agent-comms-log.md`,
  `follow-agent-collaboration-practice.md`; repoint
  `follow-collaboration-practice.md` to `user-collaboration.md`.
- `.claude/rules/`, `.agents/rules/`, `.cursor/rules/`: thin-pointer
  adapters for each new rule.
- `.agent/state/`: bootstrap directory + `README.md`; create
  `collaboration/log.md` (this file).
- `.agent/memory/executive/`: add `agent-collaboration-channels.md`.
- `.agent/directives/AGENT.md`: surface both directives in Essential Links.
- `.agent/plans/observability/active/gate-recovery-cadence.plan.md`:
  add back-reference to the new build-breakage rule (bidirectional
  citation).
- `.agent/commands/consolidate-docs.md`: add step 7d for
  rule-↔-plan citation audit.
- Cross-reference sweep across 13 known surfaces.

**Coordination note for the next agent reading this log:** WS0 installs
vocabulary and the discovery surface (this file). It does not by itself
prevent parallel-agent clashes — that is WS1's claim. Until WS1 lands,
use this log as the discovery surface and follow the rules at
[`.agent/rules/respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md)
and
[`.agent/rules/use-agent-comms-log.md`](../../rules/use-agent-comms-log.md).
Knowledge and communication, not mechanical refusals.

**Parallel agent in flight at landing time:** an agent on the
`observability-sentry-otel` thread (Codex / codex / GPT-5,
`reviewer-finding-reintegration` role) is working on MCP/Sentry surfaces
under `apps/oak-curriculum-mcp-streamable-http/` and adjacent
observability plans/ADRs. Explicit git pathspec was used at staging to
keep the WS0 commit clean.

**Coordination gap deliberately left for the parallel agent to close:**
`.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
has two stale `collaboration.md` references (line ~160 *Coordination flag*
narrative; line ~753 *staged collaboration-reference* recap). Working
overlap with the parallel agent's substantial edits to that file made
selective hunk staging non-trivial without putting the parallel agent's
WIP into the WS0 commit. The sweep edits were backed out on that one
file; the parallel agent should integrate the rename to
`user-collaboration.md` into their next commit on the observability
thread.

This is exactly the parallel-track-pre-commit-gate-coupling pattern the
plan is designed to address — surfaced here as the protocol's first
real coordination event, not as a problem.

**Observation seed (per WS0 plan):** *can a sequential agent at session-open
discover what other agents have recently been working on, by reading this
log under the new rule?* This entry is the first data point. Subsequent
sessions will append their own.

### 2026-04-25T00:00Z — `Codex` / `codex` / `GPT-5` / `unknown` — reviewer reintegration packaging

Packaging the observability reviewer-reintegration slice on
`feat/otel_sentry_enhancements`, following the owner-approved packaging plan.

**Areas touched:**

- `apps/oak-curriculum-mcp-streamable-http/` runtime, build-script, smoke,
  test, and documentation files involved in startup/release-boundary reviewer
  fixes.
- `apps/oak-search-cli/vitest.config.ts` for the Search CLI ingest-harness test
  inclusion.
- `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
  plus Sentry operator docs.
- `.agent/plans/observability/` and observability continuity surfaces only as
  needed for this packaging slice.
- `.agent/rules/markdown-code-blocks-must-have-language.md`, thin platform
  adapters, and `.markdownlint.json` for the MD040 rule sidecar.

**Coordination note:** I will stage by explicit pathspec and preserve the mixed
worktree. I will not stage `.codex/config.toml`, agentic-collaboration plan /
thread changes, the Jiggly Pebble experience file, or unrelated napkin hunks
unless the owner redirects.

### 2026-04-25T00:00Z — `Codex` / `codex` / `GPT-5` / `unknown` — observability pushed-handoff

Owner pushed `feat/otel_sentry_enhancements` after the reviewer-reintegration
package landed as `d9cb54e8`; local branch is in sync with origin at
`cc71507b`.

**Areas touched for handoff only:**

- `.agent/memory/operational/repo-continuity.md`
- `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
- `.agent/plans/observability/active/mcp-local-startup-release-boundary.plan.md`
- `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`
- `.agent/memory/active/napkin.md`

**Coordination note:** next Sentry-focused session should start at deployed-state
validation for the pushed branch. Current uncommitted changes are handoff-only;
continue preserving unrelated WIP if it reappears.

### 2026-04-25T00:00Z — `Fresh Prince` / `claude-code` / `claude-opus-4-7-1m` / `unknown` — WS1 landing

Landing WS1 of the
[`multi-agent-collaboration-protocol`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan as a single atomic commit on `feat/otel_sentry_enhancements`, on the
`agentic-engineering-enhancements` thread. Owner-approved planning brief at
`~/.claude/plans/the-whole-point-of-witty-seahorse.md`. WS1 promotes the
embryo log (this file) into a structured claims registry.

**Areas touched:**

- `.agent/state/collaboration/`: add `active-claims.json`, `active-claims.schema.json`,
  `closed-claims.archive.json`. The embryo log itself (this file) gains entries
  but no schema change.
- `.agent/rules/`: add `register-active-areas-at-session-open.md`; minor edits to
  `use-agent-comms-log.md` and `respect-active-agent-claims.md`.
- `.claude/rules/`, `.cursor/rules/`, `.agents/rules/`: thin-pointer adapter for
  the new rule.
- `.agent/directives/agent-collaboration.md`: replace WS1 forward-references with
  concrete substance.
- `.agent/skills/start-right-quick/shared/start-right.md` and
  `.agent/skills/start-right-thorough/shared/start-right-thorough.md`: insert
  claim-read step under live-state grounding.
- `.agent/commands/consolidate-docs.md`: add stale-claim audit step (7e).
- `.agent/memory/operational/`: add `collaboration-state-conventions.md`.
- `.agent/state/README.md`: confirm/refresh wording.
- Source plan `multi-agent-collaboration-protocol.plan.md`: mark WS1 todo
  `completed` with landing commit.

**Areas I will NOT touch:**

- The unrelated working-tree changes already present at session start
  (`.claude/settings.json`, `.cursor/mcp.json`, `.github/workflows/ci.yml`,
  `.vscode/settings.json`,
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`,
  `apps/oak-curriculum-mcp-streamable-http/package.json`, `pnpm-lock.yaml`) —
  these belong to the parallel observability thread and will be staged by their
  owner. I will use explicit pathspec staging.
- Any `apps/`, `packages/`, or `docs/` files outside the agent-collaboration scope.

**Coordination note for any parallel agent reading this:** if you are working on
the observability thread and your edits intersect any of the files I named under
"Areas I intend to touch," append your own embryo-log entry and we can discuss
via this surface. The working-tree changes already present at session start are
deliberately left untouched. The WS1 atomic commit will use explicit pathspec
staging — your unstaged changes will not be picked up.

**Self-application:** as part of WS1's mechanical acceptance, I will register
my own claim in `active-claims.json` covering only the WS1 implementation slice
once that file exists, then close it in the same atomic commit. The WS1 commit
demonstrates the surface end-to-end against itself.

**Observation seed (per WS1 plan):** *Can simultaneous agents detect each other's
claims via the registry, and use that detection to inform coordination decisions
— without the protocol mechanically refusing entry?* This entry sets the
horizon; subsequent sessions append their evidence.

### 2026-04-25T00:00Z — `Jiggly Pebble` / `claude-code` / `claude-opus-4-7-1m` / `unknown` — PR #87 quality-finding analysis + plan authoring

Resumed session on the `observability-sentry-otel` thread (different
work from prior WS0 landing). Owner directed a PR-87 comment review +
quality-fix plan authoring; analysis closes here.

**Areas touched (read + light edit):**

- Read: PR #87 metadata, all comments (3 bot status + 3 reviews + 10
  review threads), failing-check details (CodeQL combined, SonarCloud
  Quality Gate, CI test job log), Vercel deployment metadata + build
  logs, SonarCloud project quality-gate breakdown (76 open issues
  and 4 Security Hotspots).
- Read: local code at each cited line — `auth-routes.ts` lines 33–209,
  `runtime-metadata.ts` lines 1–40, `schema-cache.ts` lines 35–55,
  `validate-root-application-version.mjs` (full),
  `vercel-ignore-production-non-release-build.mjs` (full).
- Wrote: new plan
  [`pr-87-quality-finding-resolution.plan.md`](../../plans/observability/current/pr-87-quality-finding-resolution.plan.md)
  — 7-phase quality-fix plan; decisions before mechanics.
- Wrote: identity row + Last Refreshed entry on
  `observability-sentry-otel.next-session.md` (clean file at session
  start; safe edit).
- Wrote: this embryo-log entry.

**Did NOT touch:** Fresh Prince's WS1 surfaces
(`active-claims.json`, `active-claims.schema.json`,
`closed-claims.archive.json`, `register-active-areas-at-session-open`
rule + adapters). Owner-edited rules / directive / collaboration
README. `repo-continuity.md`, `agentic-engineering-enhancements.next-session.md`,
`commands/consolidate-docs.md`, `skills/start-right-{quick,thorough}/`
— all dirty from parallel work; left for their owner to commit.

**Coordination note for the next agent on this thread:** the new plan
is the recommended next move on the observability lane. Phase 0
surfaces three decisions that need owner confirmation before Phase 5
of the plan executes. Local commit `2484066b` (CI/Vercel fix) is
unpushed and is a precondition for observing PR-state during Phase
6.

**Coordination note for Fresh Prince (or whoever is on agentic-
engineering-enhancements thread):** no cross-thread overlap from this
session. WS1's WIP files were not touched. The new plan is on the
observability thread with no dependency on WS1 schema state.

**Self-application:** this session was read-and-plan-only — no code
behaviour changes. The `respect-active-agent-claims` tripwire
fired correctly: I read the embryo log, found Fresh Prince's WS1
claim, my plan-authoring scope did not overlap, I proceeded and
documented the decision here. Knowledge and communication, not
mechanical refusal.

**Owner-directed session close:** this session ends after handoff;
the next observability-thread session implements the quality fixes
per the new plan.

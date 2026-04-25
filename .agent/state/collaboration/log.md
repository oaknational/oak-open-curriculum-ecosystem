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

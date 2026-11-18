---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `oak-slack-assistants`

Thread identity: **`oak-slack-assistants`** — user-facing agentic Slack
assistants over Oak's MCP surfaces, built on the isolated `ai-gateway` +
`slack-assistant` libs. First app: **Ask Oisín** (project/repo navigator,
GitHub MCP). Second app (future): **Ask Oak** (curriculum content, Oak
Curriculum MCP, first-class machine identity). Internal-use only, allow-listed
installations. Distinct from `connecting-oak-resources` (data/knowledge-graph
integration) — this thread is the *surface*, not the resource. Governing
decision record:
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md);
architectural seam:
[ADR-154](../../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md).

## Current Continuation

- **Branch**: `feat/slack-apps` — **PR #328 MERGED to main 2026-07-08
  (`c7aa164ec`, merged by the owner; all 18 review threads dispositioned)**. The
  remote branch is retirable per worktree-hygiene (content confirmed in main).
- **Invocation pointer**: continue `oak-slack-assistants` from this record.
- **Controlling plan**:
  [`ask-oisin.plan.md`](../../../plans-backlog-2026-07/slack-assistants/current/ask-oisin.plan.md)
  (`current/`, 🟢 **DECISION-COMPLETE / READY FOR EXECUTION**, 2026-07-08). Design source:
  [`oisin-oce-navigator-design.md`](../../../research/outreach/oisin-oce-navigator-design.md).
  Telemetry resolution:
  [`slack-assistant-logging-observability-design.md`](../../../research/outreach/slack-assistant-logging-observability-design.md).
- **Next safe step**: execute the plan — **WS-E1 (logger portability) is
  parallel-safe immediately; WS0 scaffolds the three new workspaces and lays
  the stratified adapter tier; WS-E2 (Sentry provider decomposition) lands
  after WS0 (shared `boundary.ts` surface).** WS9+ consumes the
  owner-provisioned resources named in the plan's §Dependencies (production +
  dev Slack apps, Vercel project + Gateway BYOK, fine-grained PAT selecting
  `oak-skills`, Upstash Redis via Marketplace).
- **Verification provenance (2026-07-08, second pass)**: a full claim-register
  verification ran over the whole estate — 534 claims extracted (7 files),
  every one dispositioned; 16 web-verifier topics + 2 re-runs + 6 residue
  verifiers (all narrow opus agents; 3 first-run stub outputs caught by
  assess-everything review and re-run), plus first-hand probes (Oak MCP
  `/.well-known/` + 401 posture; `oak-skills` privacy + all four skills
  present; npm registry checks). Corrections folded into the estate docs; the
  standing residuals are named in the design doc's §Verification ledger
  (installed-version re-verification at GREEN; display-name accent; alpha
  stability).
- **Owner rulings in force**: pragmatic PII egress; running-text matcher
  deferred; build v1 now; internal-use only, workspace-level allow-list;
  framework-first; opaque model slug; safeguarding = deflect + signpost, no
  record; PII invariant independent of ZDR; PAT reads private `oak-skills`.
  **Plus 2026-07-08 (Salamander session, live)**: Next.js App Router is the
  owner's host choice (Express is out of the decision space); estate
  workspaces (`observability`, `logger`, `sentry-node`) and our own MCP app's
  auth are changeable in support of this work; `ai-gateway` is a first-class
  isolated lib (defining/describing/testing in isolation is the value);
  optimise for long-term excellence, never minimum work.
- **Owner decisions 2026-07-08 (asked and answered)**: token streaming IS v1
  (framework-level: `askStream` in ai-gateway + `sayStream` in slack-assistant);
  the v1 feedback signal is 👍/👎 REACTIONS (metadata-only counters, in-Slack;
  the custom interactive Block Kit affordance stays deferred).
- **Readiness review round (2026-07-08, this session)**: six specialists
  (assumptions, mcp, sentry, clerk, architecture-fred, docs-adr — all narrow
  briefs) ran against the reworked estate; every finding critically assessed and
  the accepted set applied — headline fixes: WS7 controls moved into the
  framework (design-plan seam contradiction), WS-E2 dependency edge trued,
  adapter-tier stratification replaces the "integration-lib tier" (ADR-041
  amendment shape), the ADR-160 barrier named as the five-hook closure with
  `applyFingerprint` lifted out of the shared core, explicit capture+flush for
  the waitUntil continuation, the WS10.1 PII assertion un-gated from deploy,
  brand-minting grep gate, and the RFC 8707 audience-binding question added to
  Ask Oak with its constraint pair.

## Session log

### Gale guards Eyrie (33f49e) + Kiln wakes Copper (48382d) — 2026-07-08

Design verification + plan authoring + three review rounds + owner rulings
(Gale); logging re-exploration, the assumption-ledger discipline, and the
ready-for-review handoff (Copper). Copper's course-corrections that shaped the
next session: the boundary contradiction was a symptom (lens 4); all
legal/DPIA framing dropped; assumptions transmitted then treated as truth is
the core failure — mark every claim. Napkin carries both sessions' lessons
(the `Gale guards Eyrie` section; Copper's entries appended under it).

### Salamander weaves Warmth (4960fe) — 2026-07-08 — deep review + decision-complete rework

Owner-commissioned deep review of PR #328 ("riddled with wrong assumptions and
flawed reasoning — make it rock solid"). What changed:

- **Full-claim verification** (see §Current Continuation provenance) — every
  estate claim explicitly dispositioned; vendor corrections folded in
  (`features.agent_view` not the legacy `assistant_view`; `instructions` +
  `isStepCount` on `ai@7`; `createHandler(app, receiver)` two-arg with one
  shared `VercelReceiver`; Vercel KV retired → Upstash Redis; per-request ZDR
  free vs team-wide $0.10/1k; Gateway budgets are enforced caps not alerts;
  `client.tools()` drops MCP annotations — source-verified; Sentry Marketplace
  integration is build-time-only; Sentry is a documented Vercel drain
  destination; Clerk has no `client_credentials`, refresh tokens never expire).
- **Framing corrections**: the Slack apps are headless Node-runtime apps — one
  origin, no client code; the "first non-Node runtime / egress-per-origin"
  framing was a misapplication (the estate has client code; these apps do
  not). The logging record now carries the resolution: topology A —
  `@oaknational/sentry-nextjs` (new provider workspace) over a shared
  Sentry-shaped redaction core extracted from `sentry-node`; barrier owned
  once; framework imports no provider.
- **Owner corrections during the session (the regime named)**: three
  same-direction corrections — estate workspaces are not frozen (logger fix +
  provider decomposition pulled into the plan); the MCP app's auth is ours
  (Ask Oak reshaped onto a first-class Clerk M2M machine identity, dissolving
  the persisted-refresh-token workaround and its day-one store); the
  `ai-gateway` extraction is articulation not speculation (now a first-class
  lib). The common regime: scope-parsimony mistaken for discipline
  ("narrow because defensible" — the quiet cousin of the rush impulse).
  Corrective question: *does this have an independent identity worth defining,
  describing, and testing in isolation?* — never *can we defer it?* Captured
  in the napkin for graduation.
- **Estate rework landed**: design doc (tombstones stripped, skeleton
  corrected — `thread_ts`, receiver wiring, typed narrowing, `agent_view`,
  machine-identity Ask Oak), logging record (resolved, §5–§9 settled with
  verified facts), ask-oisin plan (🟢 DECISION-COMPLETE; WS-E1/WS-E2 estate
  workstreams; WS7.3 retry de-dup first-class; dev-Slack-app preview
  mechanics), ask-oak brief (machine identity; settled annotation answer),
  README + roadmap + this record.

### Session close (Salamander weaves Warmth, 2026-07-08)

PR #328 merged (`c7aa164ec`) after the rework + five follow-up landings (WS4
dependency edge; skeleton DM/mention de-dup; semantic main-merge with the
napkin union hand-authored; WS7-through-factory wiring + five-hook pin; PR
description re-applied and verified). Closeout ran session-handoff +
session-completion consolidation; graduations: the scope-parsimony
anti-pattern + the pr-lifecycle intent layer; F-133 recurrence recorded;
closeout changes left uncommitted on main (owner direction). The
review-surface watcher and comms watcher stood down at close.

### PR #328 review-surface dispositions (updated 2026-07-08, Salamander)

13 review threads were harvested via GraphQL at the first full-surface pass
(T0–T12, dispositioned below); later push rounds brought the PR's total to 18,
every one replied-to and resolved before merge (GraphQL-verified 2026-07-08:
18/18 resolved — the "18" in the summary above counts the whole PR, this
section enumerates the first pass). First-pass dispositions: **T0/T10**
(`thread_ts` bug) — fixed in the skeleton; **T1** (dot-separated slug wording)
— superseded text removed (no tombstone); **T2/T3** (broken
plan-body-first-principles link) — stale, link no longer exists; **T4/T5**
(lens-3 verbatim) — already fixed on branch; **T6** (adapter tier vs
sentry-node) — resolved structurally by the WS-E2 provider model; **T7**
(`createHandler` arity incoherence) — fixed (verified two-arg shape
throughout); **T8/T11** (`oak-sdk-codegen` misdescribed) — corrected in the
logging record §2; **T9/T12** (WS8 hard-coding sentry-node against its own
OPEN ruling) — dissolved by the settled topology + WS-E2. All checks green at
harvest; `@claude` + Codex reviewers never ran (spend caps) — the review
surface was Copilot + Bugbot + Sonar only.

## Participating agent identities

| platform / model | agent_name (prefix) | role | last_session |
| --- | --- | --- | --- |
| claude-code / claude-fable-5 | Gale guards Eyrie (`33f49e`) | design-verify + plan-author + 3 review rounds + coherence | 2026-07-08 |
| claude / claude-opus-4-8 | Kiln wakes Copper (`48382d`) | successor — logging re-exploration + ready-for-review handoff | 2026-07-08 |
| claude-code / claude-fable-5 | Salamander weaves Warmth (`4960fe`) | deep review — full-claim verification + decision-complete rework (claim `11266ea3`) | 2026-07-08 |

Next session picks up from the **Next safe step** above.

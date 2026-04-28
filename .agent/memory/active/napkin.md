---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous active napkin was archived during the 2026-04-28 handoff and
consolidation pass at
[`archive/napkin-2026-04-28.md`](archive/napkin-2026-04-28.md).

Older 2026-04-28 entries from the active file were moved during the final
consolidation pass to
[`archive/napkin-2026-04-28-current-overflow.md`](archive/napkin-2026-04-28-current-overflow.md).

## 2026-04-28 — PR-87 Phase 2.0.5 + Doc Alignment + Plan Reset (Abyssal Cresting Compass)

### What Was Done

- TDD'd Phase 2.0.5 Vercel-aware keyGenerator cure (a7ce1a39).
- Mid-session security re-review against Vercel docs reclassified FIND-001/002
  MUST-FIX → HARDENING. Cure landed as defence-in-depth, not exploit closure.
- Doc alignment commit (d3e86fd1) updated ADR-158 with Runtime-Aware Key
  Extraction, dual-edge framing (Cloudflare + Vercel), read-only blast-radius
  callout per owner direction.
- Owner-directed plan reset (d6693239): archived 12-phase mega-plan; opened
  one-page CodeQL-only plan; distilled "plan-as-artefact gravity" lesson.

### Surprise 1 — security review premise contradicted by vendor docs

- **Expected**: a security-reviewer finding classified MUST-FIX with detailed
  threat-model walk-through is reliable enough to act on.
- **Actual**: the cluster-A security review's load-bearing premise ("Vercel
  appends to client-supplied X-Forwarded-For") was contradicted by Vercel's
  own published docs ("we currently OVERWRITE the X-Forwarded-For header").
  The reviewer had explicitly flagged that vendor behaviour was "documented,
  not measured" — but no source citation accompanied the appends claim.
- **Why expectation failed**: review-by-reasoning-from-authority can encode
  outdated or unverified vendor-platform behaviour. The reviewer's verification
  caveat was correct; the substantive classification was not.
- **Behaviour change**: when a finding's classification turns on a vendor-
  platform behaviour, fetch the current vendor docs and quote them inline
  before MUST-FIX. Treat any uncited vendor claim as load-bearing-and-untested.
  Captured as "verify load-bearing platform claims against current vendor docs
  before MUST-FIX" methodology lesson; placement deferred to Practice Core.

### Surprise 2 — live verification can be inconclusive even with a working preview

- **Expected**: pushing to PR-87 → preview deploy → curl tests would directly
  confirm or refute Vercel's overwrite-vs-append behaviour.
- **Actual**: external observation could not distinguish the cases. Multi-
  instance counter divergence (per ADR-158 FIND-005/006) made rate-limit
  responses noisy; edge caching contaminated the metadata endpoint test;
  Sentry preview logs had headers PII-redacted.
- **Why expectation failed**: I assumed the rate limiter would behave as a
  single-instance counter under test load. Vercel's serverless fan-out and
  Cloudflare's edge cache mean external behavioural tests can't pin down
  per-key behaviour without an unredacted echo endpoint.
- **Behaviour change**: when designing a live-verification test for a
  serverless deployment, name the multi-instance/cache/redaction
  inconclusiveness modes upfront. If the test can't distinguish those from
  the hypothesis under test, propose a debug-echo endpoint or an alternative
  observation surface before running the test.

### Surprise 3 — plan-as-artefact gravity

- **Expected**: a plan that gets re-grounded each session converges over time.
- **Actual**: the pr-87-architectural-cleanup plan accumulated re-grounding
  meta-content (Session 1/2/2.0/2.0.5 histories, verification tables of stale
  assertions, re-classification amendments) faster than it delivered closures.
  After 5+ sessions, gates remained red. Owner correctly named the failure
  mode and directed an archive + scope-locked restart.
- **Why expectation failed**: the plan tried to handle CodeQL + Sonar +
  duplications + 16 micro-clusters in one body. Mixed mechanics → mixed
  velocity → recurring re-grounding cost > per-session closure rate. Adding
  more meta-content to compensate made it worse.
- **Behaviour change**: one signal class per plan; one-page table; no inline
  session histories in the plan body; if a re-grounding pass would need >
  half a page, ask the owner whether scope is still right. Distilled into
  `distilled.md` §Process as "Plan-as-artefact gravity".

### ADR/PDR candidates

- **No new ADR candidate** beyond the ADR-158 amendment that already landed.
- **PDR candidate (deferred to Practice Core)**: a methodology-lesson
  surface for "verify vendor-platform claims before MUST-FIX classification."
  Reviewer suggested sub-agent practice notes rather than ADR. Flagged for
  consultation rather than acted on unilaterally.

## 2026-04-28 — Final Cloudflare MCP Handoff

### What Was Done

- Ran the final owner-requested session handoff after commit `7c589a0a`
  landed the Cloudflare MCP handoff state and strengthened commit-gate
  doctrine.
- Confirmed root entrypoints remain pointer-only and `.remember/` has no new
  Cloudflare / commit-doctrine signal beyond what is already captured here and
  in the thread records.
- No new ADR/PDR candidate surfaced in this final handoff; the owner correction
  about `.agent` shared state and whole-repo gates already landed in doctrine.

### Surprise

- **Expected**: A Bash-style `mapfile` snippet would be a harmless way to
  collect staged paths for the commit queue.
- **Actual**: The session shell is `zsh`, so `mapfile` was unavailable and the
  first queue attempt created an empty-file advisory entry that had to be
  abandoned.
- **Why expectation failed**: I carried a Bash helper into the repo's configured
  `zsh` shell instead of using a shell-portable read loop.
- **Behaviour change**: When scripting queue/pathspec helpers in this repo,
  write for the active shell or force the shell deliberately; abandon any bad
  queue entry immediately and then re-enqueue the exact staged bundle.

## 2026-04-28 — Codex Identity Doctrine Propagation

- Promoted the implemented Codex identity slice into continuation surfaces and
  ADR/PDR doctrine after validation.
- Handoff follow-up: the plan archive is complete after the peer commit window
  cleared, and the leftover archive claim is closed in collaboration state.
- Fitness note: a brief strict-hard spike in the active napkin was resolved by
  rotating older entries to
  `archive/napkin-2026-04-28-current-overflow.md`; current strict-hard is
  soft-only again.
- Learning: shared-state transaction helpers kept the registry valid even
  after I mistakenly closed related claims in parallel. Do sequential shared
  state closes when the writes hit the same generated files.

## 2026-04-28 — γ-Execution Coordination-Protocol Observations (Choppy Lapping Rudder)

### What Was Done

- Owner-directed γ option (coordinate via comms before action) executed live
  on PR-87 Phase 2 / Cluster A. Wrote two comms events through the
  collaboration-state CLI (S5443 cross-thread request to
  `agentic-engineering-enhancements`; arrival/Cluster A liveness on
  `observability-sentry-otel`); rendered the shared log; opened two claims
  (Cluster A implementation files; future-plan + napkin file set).
- Findings captured in new strategic plan at
  agentic-engineering-enhancements/future/
  agent-coordination-cli-ergonomics-and-request-correlation.plan.md.

### Surprise 1 — State moved during stance formation

- **Expected**: A "stance to owner" formed from a fresh-state read would be
  durable across the ~2 minutes the owner took to reply.
- **Actual**: Three parallel Codex agents finished, archived, and committed
  `7c589a0a` between the read and the reply. Coastal Mooring Atoll's deep
  consolidation landed all eight Edits my Phase 2.0 brief required;
  Phase 2.0 collapsed from "author the consolidation" to "verify it landed".
  My initial stance was already stale at delivery.
- **Why expectation failed**: I treated re-grounding as a session-open ritual,
  not a per-commitment ritual. The brief explicitly required pre-execution
  re-fetch — I applied it to writes (which the CLI handled correctly via the
  transaction helper) but not to the stance-to-owner step, which was itself a
  commitment that should have triggered a re-fetch immediately before send.
- **Behaviour change**: Treat any owner-facing stance that proposes
  side-effecting work as a commitment; re-fetch git/PR/Sonar/CodeQL/active-
  claims state in the same response that delivers the stance, not before.
  Captured in the new future plan as "stance-staleness mitigation"; doctrine
  candidate for the agent-collaboration directive once a second instance lands.

### Surprise 2 — CLI first-touch friction

- **Expected**: `pnpm agent-tools:collaboration-state -- --help` would print
  usage / actions / flags.
- **Actual**: Rejected with `flag '--help' requires a value` because
  `cli-options.ts` treats every `--`-prefixed token as a flag-value pair
  without a `--help` special case. Discovery required reading `cli.ts`
  directly to find that dispatch keys are `<command>:<topic>` (e.g.
  `comms:append`, `claims:open`).
- **Why expectation failed**: The CLI was implemented for the case where the
  caller already knows the action; first-touch UX was not in the design
  goals.
- **Behaviour change**: For now, captured in the new future plan; promotion
  is gated on a second session reporting the same friction. Triage anyone
  who hits this with a pointer to the dispatch key list in `cli.ts`.

### Surprise 3 — Comms-as-ledger has no request/response correlation

- **Expected**: A cross-thread coordination request (e.g. "please absorb
  this regression cure") would have some way to surface as "open / awaiting
  response" until handled.
- **Actual**: Events are immutable, have no `audience`, no `in_response_to`,
  no TTL. The S5443 request I sent to `agentic-engineering-enhancements` is
  fire-and-hope; no agent on that thread will *necessarily* see it before
  PR-87 wants to close. There is no inbox, no @mention, no escalation timer.
  Decision threads (sidebars/escalations) cover *structured async decisions*
  but feel heavy for a routine cross-thread request.
- **Why expectation failed**: I conflated the comms-log discovery surface
  with a routing surface. Per the existing collaboration-state-domain-model
  brief at `.agent/plans/agentic-engineering-enhancements/future/`, the log
  is intentionally discovery narrative. The gap is that nothing
  *between* the lightweight log entry and the heavyweight decision-thread
  exists for "request that needs a response".
- **Behaviour change**: Captured as the *recommended first promotion slice*
  in the new future plan. The minimal primitive: add `audience` + optional
  `in_response_to` + optional `response_required_by` to comms events; extend
  consolidate-docs to enumerate "open cross-thread requests".

### Surprise 4 — Read-during-write race handled cleanly

- **Expected**: Concurrent claims-open during another agent's commit-window
  might lose data or require manual reconciliation.
- **Actual**: My CLI write at 11:33:41Z landed on a freshly-committed empty
  registry (commit `7c589a0a` at 11:31:15Z had archived the three prior
  claims explicitly). The transaction helper from `11f0320f` reads file from
  disk → transforms → writes; because the parallel commit happened cleanly
  between *my read* and *the CLI's read*, there was no clobbering.
- **Why expectation failed**: I underestimated the substrate. The
  collaboration-state-write-safety slice (already landed) does its job; the
  remaining issues are at the surfaces around it, not in the substrate.
- **Behaviour change**: When running parallel-agent sessions, trust the
  substrate; document the surface gaps separately rather than re-litigating
  the substrate's correctness.

### Cross-references

- New strategic brief at
  agentic-engineering-enhancements/future/
  agent-coordination-cli-ergonomics-and-request-correlation.plan.md.
- Live evidence: comms events `a45d68a4-12ee-4a5c-b7d5-00617e6f85ff`
  (S5443 request) and the arrival liveness event in the same window.
- Active claims opened by this session: `87fb2797` (Cluster A on
  `observability-sentry-otel`), `441366cd` (plan + napkin on
  `agentic-engineering-enhancements`).

## 2026-04-28 — Codex Adapter Path and Invocation Repair

### Practice/tooling feedback

- **Surface**: `Codex platform adapters`
- **Signal**: surprise
- **Observation**: Project-scoped `agents.<name>.config_file` values in
  `.codex/config.toml` used `.codex/agents/<name>.toml`, but Codex resolves
  relative paths from `.codex/config.toml`, producing `.codex/.codex/...`
  warnings and ignoring the reviewer roles. The same owner report also showed
  a recurring expectation that repo-defined Codex skills should appear as
  custom slash commands, while current Codex docs expose repo skills through
  `$skill-name` / `/skills` and keep `/` for built-ins.
- **Behaviour change / candidate follow-up**: Keep Codex `config_file`
  values relative to `.codex/config.toml` (`agents/<name>.toml`), and document
  `$jc-*` as the Codex workflow invocation shape anywhere platform command
  examples are listed.

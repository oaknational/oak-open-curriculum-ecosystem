---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin Overflow — 2026-04-28

Entries moved from the active napkin during the final 2026-04-28 consolidation
pass so `.agent/memory/active/napkin.md` stays below its hard fitness limit.

## 2026-04-28 — Handoff and consolidation closeout

### What Was Done

- Ran the owner-requested handoff/consolidation path after homing the
  agent-work ownership and workspace-layer separation doctrines.
- Ran the hook-test IO remediation closeout: root-script and agent-tools
  hook tests now prove pure behaviour without filesystem/process IO, and
  the former agent-tools CLI E2E files are deleted from the CI E2E surface.
- Rotated the overweight active napkin into
  `archive/napkin-2026-04-28.md`.
- Distilled the still-actionable shared-state lessons about sweep-up commits,
  surgical shared JSON edits, and orphaned-claim handling.

### Patterns to Remember

- Current settled doctrine lives in PDR-035, ADR-165, ADR-154, and the
  workspace-layer separation audit plan; do not re-expand it here.
- A concurrent non-overlapping implementation claim may coexist with a
  documentation closeout. Keep the commit pathspec scoped and avoid claimed
  code surfaces.

### Surprise

- **Expected**: The commit closeout blocker was still the earlier
  collaboration-state TypeScript build failure.
- **Actual**: A fresh agent-tools build passed, but root `format-check` and
  `knip` found live gate failures in the same active WIP: Prettier drift and
  unused public exports.
- **Why expectation failed**: Shared-branch concurrent work moved between
  handoff and retry; the stale TypeScript failure was not current, but the full
  commit hook still had real repo-wide evidence to enforce.
- **Behaviour change**: Rerun the exact failing gate before touching claimed
  WIP, then make the smallest gate-honest repair and leave a breadcrumb for
  the owning agent.

### Surprise

- **Expected**: After the write-safety implementation landed, the follow-up
  plan commit could proceed immediately.
- **Actual**: A fresh peer `git:index/head` claim opened first, then landed a
  shared-state sweep commit that changed the closeout baseline.
- **Why expectation failed**: Same-branch collaboration state is genuinely hot
  and live; even closeout-only commits can overlap on generated state and
  thread records.
- **Behaviour change**: Poll active git claims and `HEAD` before staging, wait
  for fresh peer commit windows to clear, then re-evaluate the pathspecs from
  the new tree instead of committing against stale assumptions.

## 2026-04-28 — Cloudflare MCP planning handoff

### What Was Done

- Captured the Cloudflare MCP public-beta security gate as a future security
  plan and linked it from the security roadmap and high-level plan.
- Captured the Code Mode / progressive-discovery token-economy research as a
  future SDK/MCP brief.
- Added the owner's use-case hierarchy: Oak MCP primarily serves teachers and
  other end users exploring curriculum; engineering workflows are important but
  secondary, with the SDK as the more direct surface.

### Surprise

- **Expected**: The Code Mode token-reduction pattern would mostly map to
  engineering/API workflows because the source material is API-management
  shaped.
- **Actual**: The owner clarified that the MCP server's primary target is
  teacher-facing curriculum exploration and use.
- **Why expectation failed**: The external example over-weighted the
  engineering analogue; Oak's product boundary puts direct API integration
  closer to the SDK than to the MCP server.
- **Behaviour change**: Evaluate MCP token economy against teacher curriculum
  journeys first, then use engineering/API workflows as a secondary comparison.

### Candidate

- Vendor-control disposition may become a Practice pattern once a second vendor
  review proves the shape. For now it remains a watch item in the thread record,
  not a promoted PDR or pattern.

## 2026-04-28 — Commit queue and whole-repo gate correction

### What Was Done

- Owner clarified that `.agent/` is shared Practice/coordination state and is
  always safe to sweep into commits when it belongs to the live bundle.
- Owner clarified that commit hooks must remain whole-repo gates; staged-bundle
  queue verification is not a substitute for the repo passing.
- Strengthened collaboration and commit rules so minor gate failures are fixed
  immediately, while larger failures become the highest-priority next planned
  item rather than a reason to narrow gates.

### Surprise

- **Expected**: A clean staged-bundle queue verification was enough to proceed
  unless another fresh `git:index/head` entry was ahead.
- **Actual**: The commit hook correctly failed on unstaged peer WIP because the
  whole working tree did not pass formatting.
- **Why expectation failed**: The queue protects authorial-bundle integrity,
  but the hook protects whole-repo integrity. Those are different invariants.
- **Behaviour change**: Treat minor whole-tree hook failures as immediate
  repairs, even across active claims, and route substantial failures as the
  next highest-priority plan without weakening quality gates.

## 2026-04-28 — Shared-State Docs Need Queued Writes

### Surprise

- **Expected**: When another agent had an active claim over shared-state docs,
  the safe handoff move was to read only and avoid writing.
- **Actual**: The owner clarified the opposite policy: shared-state docs are
  specifically the surfaces agents must read and write, and the queue system
  exists to make that overlap safe and visible.
- **Why expectation failed**: I applied repo-functionality ownership instincts
  to collaboration infrastructure. For shared state, abstention causes stale
  dirty state to accumulate and makes future handoffs less reliable.
- **Behaviour change**: Treat shared-state docs as read/write lifecycle
  surfaces. Use transaction helpers for JSON and the commit queue /
  `git:index/head` protocol for commits; do not skip required handoff writes
  solely because the files are hot or claimed.

## 2026-04-28 — Glassy Fathoming Atoll: PR-87 Phase 2 planning re-grounding

Claude Code (claude-opus-4-7-1m) on `observability-sentry-otel` thread.
Session was a planning round for PR-87 Phase 2 (Cluster A — rate-limit type
narrowing). No code edits to product or test surfaces; outputs are an updated
session plan file at
`~/.claude/plans/jc-plan-jc-metacognition-pr-87-phase-generic-clover.md`, this
napkin entry, and a session handoff to follow.

### Surprise — Phase 1 hotspot panel achievement is ephemeral on shared branches

- **Expected**: Phase 1's `new_security_hotspots_reviewed: 100% OK` (closed
  late 2026-04-28) would persist into the fresh-state read at this session's
  open.
- **Actual**: Sonar QG re-fetch shows `85.7% ERROR` with two new TO_REVIEW
  hotspots on `scripts/check-blocked-content.unit.test.ts:54,61`
  (`AZ3TxJXr4fpoaG-VMGq3`, `AZ3TxJXr4fpoaG-VMGq4`), both `S5443` "publicly
  writable directories", introduced by the parallel Codex commit
  `ec49e8ec test(hooks): remove IO from hook tests`.
- **Why expectation failed**: closure of a QG metric is a snapshot of the
  metric, not a permanent state. On a shared branch with multiple active
  threads, any commit that adds new code in the same file scope can re-open
  the metric.
- **Behaviour change**: at every Phase-N opening, re-read fresh QG state
  before treating any prior closure as inherited. If a closed metric has
  regressed from cross-thread work, engage with the regression as a
  prerequisite (coordinate via `shared-comms-log`; do not silently push more
  work onto a regressed gate). Closure rituals must include the metric being
  closed AT PUSH TIME, not assumed permanent thereafter.

### Pattern observation — TSDoc-as-architectural-debt generalises

- The dismissal-with-rationale TSDoc blocks at `auth-routes.ts:23-29`,
  `:124-135`, and `oauth-proxy-routes.ts:41-49` literally state "CodeQL
  cannot trace the limiter through `RequestHandler`-typed parameters;
  dismissals cite this attestation." Under §Stance ("we do not present
  disable / accept / dismiss as a fallback option"), prose-in-the-code
  explaining why a rule fires IS itself the dismissal-with-rationale stance.
- The same shape appears at `bootstrap-helpers.ts:138` ("CodeQL #69 is a
  misclassification") — different rule, same architectural debt.
- **Generalisation**: any "static analysis can't see this; we attest …"
  TSDoc is a candidate for the same cure (replace the prose with the
  architectural change that makes the prose obsolete). Watch for this
  pattern at Phase 3 (Cluster C) and Phase 4+ — it is likely to appear
  wherever prior sessions chose dismiss-with-rationale before §Stance
  hardened.
- Not yet a graduated pattern; recorded here as an observation. If a
  second instance surfaces during Phase 3 execution, that is the third
  data point and a pattern entry under `.agent/memory/active/patterns/`
  becomes warranted in-session, not at some future consolidation pass.

### Pattern observation — negative type tests as load-bearing regression gates

- When a refactor preserves a brand end-to-end (e.g. narrowing
  `RequestHandler` → `RateLimitRequestHandler` for static-analysis
  visibility), the load-bearing regression gate is a **negative**
  compile-time test: a deliberately widened factory typed
  `(opts) => RequestHandler` asserted to be REJECTED by tsc when
  assigned to `RateLimiterFactory`. Without this gate, GREEN can drift
  back to the wider type silently — any future contributor who widens
  the factory return type passes type-check and the architecture
  decays.
- Positive type tests (asserting the brand IS preserved without `as`
  casts) are not sufficient because they do not prove rejection of the
  widened shape.
- Generalises beyond rate-limiting: any architectural contract pinned
  via a brand intersection type benefits from the same negative-test
  gate.
- Not yet a graduated pattern; if Phase 2 lands successfully and the
  pattern proves at Phase 3 (SchemaCache typed-capability cure), that
  is the trigger for in-session graduation.

### Surprise — owner doctrine: "post-PR" is an excuse, not a lifecycle phase

- **Expected**: it would be reasonable to defer pattern-graduation,
  insight-capture, and cross-thread coordination to a "post-PR
  consolidate-docs" run after PR-87 merges.
- **Actual**: owner directive is direct — "post-PR" is not a lifecycle
  phase; it is an excuse. Anything valuable lands in the in-repo plan
  or in the napkin **at the time it surfaces**, not later.
- **Why expectation failed**: I had imported a deferral pattern from
  prior sessions where pattern graduation waited for evidence
  accumulation across N sessions. That deferral is appropriate for
  *graduation* (which still requires evidence); it is not appropriate
  for *capture*. Capture is immediate.
- **Behaviour change**: at session close, anything observed but
  unrecorded is recorded NOW — in the in-repo plan if it has structural
  fit, in the napkin if it is session-level surprise / observation /
  candidate-pattern. The napkin is the destination for "valuable but
  doesn't fit the plan structure"; the plan is the destination for
  "structural delta to the active execution".

### Surprise — re-grounding revealed workflow change since brief

- **Expected**: the brief at `observability-sentry-otel.next-session.md`
  would describe the current state of the collaboration infrastructure
  the fresh session inherits.
- **Actual**: between brief authorship and this re-grounding pass, two
  significant workflow changes landed: (a) commit
  `11f0320f feat(agent-tools): add collaboration-state write safety`
  introduced the paired event-stream surface at
  `.agent/state/collaboration/comms/events/<uuid>.json` (every
  `shared-comms-log` entry now expects a paired event JSON), and (b) a
  new active thread `cloudflare-mcp-security-and-token-economy-plans`
  joined the active-threads list with two new strategic plans under
  `security-and-privacy/future/` and `sdk-and-mcp-enhancements/future/`.
- **Why expectation failed**: briefs are snapshots from when their
  session closed; a few hours of parallel work can change the
  collaboration infrastructure underneath.
- **Behaviour change**: at session-open re-grounding, read
  `.agent/memory/operational/threads/README.md` and the
  `agent-tools/README.md` (or its delta vs brief) before generating any
  comms entries; verify the current expected shape of comms event files
  by reading a recent example before authoring a new one.

### Candidate

- "Closure rituals must include the metric being closed AT PUSH TIME,
  not assumed permanent thereafter" may become a Practice rule once a
  second instance surfaces. Watch at PR-87 Phase 2 push and Phase 3
  push for additional regressions on previously-closed metrics.

## 2026-04-28 — Deep Consolidation Pass

### What Was Done

- Homed PR-87's 12-phase execution stance into the in-repo active plan so
  personal Claude plan files are evidence only, not canonical dependencies.
- Graduated the disposition-drift lesson into PDR-018 and reduced the
  distilled-memory entry to a pointer.
- Relieved hard fitness pressure structurally: historical continuity went to
  an archive, problem-hiding examples moved to governance practice, and
  collaboration-state schema provenance moved to lifecycle guidance.
- Cleared abandoned commit-queue entries only after confirming closed-claim
  evidence existed for each intent.

### Surprise

- **Expected**: most of the pass would be a repo-continuity split.
- **Actual**: the deeper value was homing responsibility boundaries: PR-87
  execution, Cloudflare security, token economy, and Practice doctrine each
  needed one canonical home plus pointers, not smaller prose everywhere.
- **Behaviour change**: consolidation should first ask "where does this
  knowledge belong so the next agent can act?" and only then trim the old
  surface.

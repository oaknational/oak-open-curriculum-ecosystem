---
name: agent-operability-plan-corpus-rationalisation
type: report
status: stable — synthesis report (names decisions and considerations; the owner/Director decides the shape)
created: 2026-06-27
created_by: Cedar lifts Canopy (claude-code / claude-opus-4-8[1m] / 435d30)
thread: agent-operability-plan-consolidation
related:
  - .agent/rules/worktree-hygiene.md
  - .agent/memory/operational/threads/statusline-enhancements.next-session.md
  - .agent/plans/agent-tooling/future/collaboration-substrate-coordination-rightsizing.plan.md
---

# Agent-operability plan-corpus rationalisation

> **Research output, not a decision.** This report NAMES redundancy, duplication,
> contradictions, and misplaced concepts across the plan corpus, and proposes how
> the corpus could be fewer plans, better ordered, or better staged. It executes
> no change. The owner decides the final shape; edits to any live-lane plan are
> routed through the Director (Oyster spins Coral) first.

## Why this report exists

Owner direction (2026-06-27): assess, collate, and **sanitise** the scattered
plans addressing four facets of one underlying concern, and additionally look for
**redundancy, duplication, contradictions, and misplaced concepts between the
plans** — could there be **fewer plans**, could the concepts be **better expressed
in a different order, in different stages, or in different plans**?

The four facets are one concern seen from four angles:

1. **Statusline** — what an operator sees of session and team state at a glance.
2. **Agent working locations** — where agents work (primary checkout vs worktrees).
3. **Agent tooling locations** — where tooling and shared state *resolve* (the coordination home).
4. **Team-state records** — how team and work state is recorded, made durable, and shown.

## Headline findings

1. **The four facets are genuinely one concern.** The same load-bearing concepts
   recur across all four clusters: the coordination-home resolver, the statusline
   as the proving consumer, the worktree lifecycle, the collaboration-state CLI,
   and the four ratified invariants. This is one substrate fragmented across ~18
   documents in two plan trees, two thread hubs, a git-ignored map, and (now on
   `main`) the worktree-hygiene rule.

2. **A plan already exists whose whole job is this rationalisation — and it has
   stalled.** `collaboration-substrate-coordination-rightsizing` is an
   `active-strategic-exploration` whose M4 deliverable is literally "the per-plan /
   per-layer supersession-and-deletion list." Its M1 inventory (~102 mechanisms,
   dated 2026-05-29) is done; M2–M4 are pending with no recorded progress since.
   It covers the *coordination-machinery* layer only — it is silent on the
   placement/tracking layer, the statusline, and worktrees. The owner's question is
   therefore *partly already-scoped-but-stalled, and partly unowned.* This report
   should reconcile with that brief, not duplicate it (see §Open decisions D2).

3. **Two concepts have graduated to doctrine but are still carried as pending plan
   work** — the from-a-worktree command-path discipline and the worktree lifecycle
   both now live in the worktree-hygiene rule, yet plans still hold them as
   undecided. This is the cleanest, lowest-risk thing to fix.

4. **One keystone unifies all four facets: the agent work-state registry (F-98).**
   The `(identity -> worktree -> branch -> liveness)` binding is the data the
   statusline shows, the worktree binding agents need, and the durable form of the
   team-state map. It is blocked only on an ADR. Sequencing it first collapses
   several downstream ambiguities at once.

## Method and scope

- Scoped precisely to plans materially addressing the four facets (~18 documents);
  the full plan estate was not boiled.
- Anchor plans read first-hand; the full corpus extracted via four parallel
  read-only inventory passes (one per facet), every extract critically assessed
  against source. One subagent finding was corrected on first-hand re-reading (the
  "statusline double-consumer", §Contradictions C-rebuttal).
- Live surfaces assessed at their merged state: `origin/main` is `af47c4a96`; the
  merge train landed #248 (worktree-hygiene rule), #250 (statusline lane
  coordination), and #251 this session. The cross-worktree map is the Director's
  and in-flight; the orientation-skills-family plans are Peony's and growing — both
  treated as live trajectories, not frozen snapshots.

### In-scope corpus

Facet key: **S** statusline · **W** working locations · **T** tooling locations · **R** team-state records.

| Document | Tree / stage | Facet(s) |
| --- | --- | --- |
| `session-and-team-state-statusline-icons.plan.md` | agent-tooling/current | S, R |
| `statusline-logo-modularisation.plan.md` | agent-tooling/current | S |
| `statusline-enhancements.next-session.md` | threads (hub) | S |
| `comms-and-worktree-operability.plan.md` | agent-tooling/current | W, T |
| `agent-work-state-registry.plan.md` (F-98) | agent-tooling/future | W, R |
| `worktree-per-agent-transition.plan.md` | agentic-engineering-enhancements/future | W |
| `worktree-pilot-consolidation-and-model-verdict.plan.md` | agentic-engineering-enhancements/current | W |
| `worktree-hygiene.md` (rule, on `main`) | rules | W |
| `coordination-home-explicit-targeting-migration.plan.md` (F-41 tail) | agent-tooling/future | T |
| `coordination-watcher-canonicalisation.plan.md` (current + promoted stub) | agent-tooling | T |
| `collaboration-state-write-safety.plan.md` | agent-tooling/current | T |
| `collaboration-state-domain-model-and-comms-reliability.plan.md` | agent-tooling/future | T, R |
| `agent-coordination-cli-ergonomics-and-request-correlation.plan.md` | agent-tooling/future | T |
| `multi-agent-collaboration-protocol.plan.md` | agent-tooling/current | R |
| `collaboration-substrate-coordination-rightsizing.plan.md` (+ `.m1-inventory.md`) | agent-tooling/future | R, T |
| `collaboration-state-surface-restructure.plan.md` | agentic-engineering-enhancements/current | R |
| `continuity-surfaces-are-state-not-memory.plan.md` | agentic-engineering-enhancements/future | R |
| cross-worktree work-state map (git-ignored) | state/collaboration | W, R |

## Findings

### Redundancy and duplication

| # | Concept | Where it appears | Verdict |
| --- | --- | --- | --- |
| D-1 | Coordination-home resolver (`resolveCoordinationHome` via `git worktree list`) | operability §B1, F-41-tail plan (owns it), worktree-per-agent-transition (blocking dep), work-state-registry — plus ADR-197 as the decision | Operability §B1 itself says it "overlaps the already-queued F-41-tail plan — drive/reference, do not duplicate." So operability §B *is* a duplicate framing. One home: ADR-197 (decision) + F-41-tail (the remaining build). |
| D-2 | From-a-worktree command-path discipline (`comms list/watch/inbox --comms-dir`; `claims --active`; only `comms send` auto-anchors; relative path lands worktree-local) | operability §A1/§A2/§B1, **worktree-hygiene rule clause 8**, F-41-tail | Graduated to the rule (doctrine). Plans should cite it, not re-hold it. See M-1. |
| D-3 | Worktree lifecycle (create → build → draft PR → work → update → merge → remove + delete branch) | **worktree-hygiene rule clauses 3/7**, worktree-per-agent-transition future "Means" | Graduated to the rule. The transition plan should cite it and keep only the genuinely-open strategy. See M-2. |
| D-4 | The four ratified invariants (advisory-not-mechanical, text-first, portable, owner-final) | multi-agent-protocol (DP1/2/12), rightsizing plan, m1-inventory §2 — canonical home is `agent-collaboration.md` | Plans should cite `agent-collaboration.md`, not restate. |
| D-5 | The F-83 evidence narrative (mid-edit co-commit; shared-`dist` cleaned under a live agent; cross-agent gate-RED; the seven stale pilot worktrees) | worktree-per-agent-transition, worktree-pilot-consolidation, worktree-hygiene rule worked-instance | Same evidence narrated three times. Keep one canonical telling (the rule's worked-instance); the plans cite it. |
| D-6 | Liveness-state vocabulary | multi-agent-protocol (2-state `stale`/`fresh`) vs collaboration-state-surface-restructure (4-term `stale`/`fresh-but-quiet`/`orphaned`/`expired`) | Two definitions of record. Adopt the 4-term taxonomy as canonical; retire the 2-state. |
| D-7 | The collaboration-state CLI | domain-model (strategic parent) → write-safety (shipped the CLI) → F-41-tail, watcher-canonicalisation, cli-ergonomics each extend it | Clean ancestry, not pure duplication — but five+ plans orbit one CLI. Archiving the done ones (write-safety) and folding F-41-tail thins this materially. |
| D-8 | Statusline "Review dispositions (2026-06-15)" boilerplate | duplicated near-verbatim across the two statusline plans | Trivial dedup. |
| D-9 | `coordination-watcher-canonicalisation` in both `current/` and `future/` | promotion stub (`status: promoted`, bidirectional pointers) | Clean lifecycle bookkeeping, **not** redundant clutter. Minor: the stub's `last_updated` frontmatter (2026-05-22) disagrees with its body (2026-06-21). |

### Contradictions

| # | Contradiction | Detail | Resolution |
| --- | --- | --- | --- |
| C-1 | State-tracking boundary | multi-agent-protocol DP4 cuts a two-tier `state`/`memory` boundary, silent on git-tracking; `continuity-surfaces-are-state-not-memory` calls that an "over-collapse", inserts a **third** tier, and declares `.agent/state/` git-ignored | Genuine architectural disagreement. The 3-tier plan is the more recent, deliberate framing (`owner_decision_required: true`). Adopt it; amend/retire DP4's framing. See Open decision D1. |
| C-2 | Owner-present vs owner-absent yardstick | Inside the rightsizing `m1-inventory`: §1's owner-present design frame is superseded by §0's owner-absent autonomy steer, but both are retained "as the inventory of record" | Internal; §0 (owner-absent) supersedes. The doc carries two yardsticks by design — a reader must apply the correction. |
| C-3 | Comms directory path | domain-model proposes `state/collaboration/comms-events/`; shipped reality (watcher-canon + write-safety) is `.agent/state/collaboration/comms/` | Stale plan text. Correct the domain-model brief or mark it superseded. |
| C-4 | Placement-polish vs supersession | `collaboration-state-surface-restructure` freezes itself to "placement only, no behaviour/TTL change" and polishes the schemas, while the rightsizing brief proposes to fold/delete the TTL/heartbeat behaviour those schemas encode | Sequencing hazard: polishing homes a parallel pass may demolish. Resolve the rightsizing verdict before (or instead of) any further placement polish. |

**C-rebuttal — the "statusline double-consumer" is not a contradiction.** Both
inventory passes flagged that the work-state-registry and operability §B2 each
name the statusline as their "proving consumer", reading it as a conflict over the
statusline's source of truth. On first-hand reading they are **orthogonal**: §B2
pins *which `.mjs` binary runs* (the shim should resolve to the primary, not the
worktree copy); F-98 changes *where the working-location data comes from* (the
derived registry instead of cwd). They both edit `statusline-identity.ts`, so they
need **sequencing**, but they are not competing sources of truth. Recorded here so
the rationalisation does not "fix" a contradiction that does not exist.

### Misplaced concepts

- **M-1 — settled doctrine still pending as plan work (command-path discipline).**
  Rule clause 8 owns it; operability §A still scopes it as "skills to write" and
  §B1 as a structural fix. The operability plan should acknowledge the rule has
  absorbed the operating doctrine and retain only the genuinely-novel mechanism.
- **M-2 — settled doctrine still pending as plan work (worktree lifecycle).**
  Rule clauses 3/7 own it; worktree-per-agent-transition still holds it as future
  "Means". The plan should cite the rule and keep only the adoption *strategy*.
- **M-3 — coordination-home resolution narrated as plan work twice.** The concept's
  durable home is ADR-197 plus the resolver source; the F-41-tail plan is the
  planning narrative pointing at them, and operability §B is a second narrative of
  the same thing. Collapse to one (§D-1).
- **M-4 — the rightsizing brief covers only half the concern.** It owns the
  coordination-machinery layer but is silent on the placement/tracking layer
  (`collaboration-state-surface-restructure`, `continuity-surfaces-are-state-not-memory`)
  and on the statusline/worktree facets. Either its scope expands to the whole
  four-facet concern, or those facets need their own explicit homes (see §Proposed
  rationalisation).

## Proposed rationalisation

> NAMES the structure; the owner decides. Nothing here is executed.

### Could there be fewer plans? Yes — concretely

**Archive (work reported complete; held in `current/` as done-but-not-archived):**

- `collaboration-state-write-safety.plan.md` — all todos complete, closeout
  evidence with landing commits; banner "IMPLEMENTED / CLOSURE PENDING".
- `collaboration-state-surface-restructure.plan.md` — all 9 todos complete; held
  only on an empirical external gate ("prevented ≥1 wrong-file landing").
- `multi-agent-collaboration-protocol.plan.md` — WS0–WS4 complete; only WS5
  (seed-harvest) paused. Archive the done core; re-home the WS5 harvest note.

Each needs an archive pass to confirm-and-execute, not a fresh decision. That alone
removes three plans from the live `current/` set.

**Fold:**

- Operability **§B → F-41-tail plan** (operability says so itself). Operability
  §A (the two skills) is largely superseded by rule clause 8 — slim it to any
  genuinely-novel skill content, or drop it.
- `coordination-watcher-canonicalisation` future stub → archive once `current/`
  executes (or now, keeping the promoted pointer).

**Cite, don't re-hold:**

- worktree-per-agent-transition cites the worktree-hygiene rule for lifecycle (M-2).
- The CLI plans cite `agent-collaboration.md` for the four invariants (D-4).

### Better order / stages / distribution

Organise the whole concern as **one "agent operating substrate" thread with four
facet-homes, each with a single SSOT, resting on the durable decisions** — rather
than one mega-plan (which would re-collapse the decompose-at-the-tension boundary)
or the current scatter.

| Facet | Single SSOT | Live plans under it | Durable decision it rests on |
| --- | --- | --- | --- |
| Statusline | `statusline-enhancements` thread hub (slim to index-only) | logo-modularisation; session-state-icons | PDR-095, PDR-076a |
| Working locations | worktree-hygiene **rule** (on `main`) | worktree-per-agent-transition (strategy); pilot-consolidation (evidence → then archive) | PDR-117; ADR-197 (the worktree-hygiene rule also grounds on ADR-204) |
| Tooling locations | **ADR-197** + F-41-tail (the one remaining build) | cli-ergonomics; watcher-canonicalisation | ADR-197; PDR-055 |
| Team-state records | **F-98 work-state-registry** (keystone) + rightsizing brief (the cull-home) | continuity-tiers taxonomy | needs the agent-work-state ADR |

**Keystone-first sequencing.** F-98 (work-state-registry) is the binding the
statusline consumes, the worktree binding agents need, and the durable form of the
team-state map. It is blocked only on an ADR. Authoring that ADR first lets the
statusline working-location line, the cross-worktree map's durable form, and the
"freshness ≠ liveness" fix all resolve against one model instead of being
re-litigated per plan.

**The rightsizing brief is the natural cull-home** for facets 3–4's machinery — but
it is stalled and half-scoped. The cleanest move is to *revive it with a bounded,
explicit scope* and let this report feed its M4, rather than minting a parallel
cull mechanism (see Open decision D2).

### Worked example: the statusline shim (facet 1 × facet 3)

The owner asked (2026-06-27) whether the statusline `.mjs` shim is still used and
whether it is needed. It is the cleanest concrete instance of "the four facets are
one concern", so it is recorded here.

- **Still in use.** `.claude/settings.json` runs `node
  .claude/scripts/statusline-identity.mjs` every render; it is on `main`; a second
  bespoke copy exists for Cursor (`.cursor/scripts/statusline-identity.mjs`).
- **What it is.** A 42-line soft-fail bootstrap: resolve `repoRoot`
  (`CLAUDE_PROJECT_DIR ?? ../../`), `exit 0` silently if the built adapter is
  missing, else `spawn` the built/typed/gated `agent-tools/dist/.../statusline-identity.js`.
- **Verified Claude Code semantics** ([official statusline docs](https://docs.anthropic.com/en/docs/claude-code/statusline),
  via claude-code-guide against official docs, critically assessed — the core
  point is a direct doc quote):
  - A `statusLine.command` that exits non-zero or produces no output just makes the
    status line **go blank — no error, no session disruption**. So the soft-fail is
    *aesthetic*, not a safety requirement.
  - `CLAUDE_PROJECT_DIR` is **not documented** as set for `statusLine` commands
    (only `COLUMNS`/`LINES` are). The shim's preferred resolution branch is likely
    dead, so it falls through to `../../` path-arithmetic → runs *the worktree's*
    dist (the §B2 binary-pinning bug).
  - Claude Code pipes `workspace.project_dir`, `workspace.current_dir`, `cwd`, and
    conditionally `workspace.git_worktree` on **stdin** — the location data the shim
    strains to compute is already handed to the adapter it spawns.
- **Verdict.** The bespoke, ungated, env-dependent, Claude-and-Cursor-duplicated
  `.mjs` is **not needed in its current form**. Target: point `statusLine.command`
  at a gated entry (an agent-tools `bin`/subcommand), resolve location from the
  **stdin JSON** rather than env/path-arithmetic/git, and consolidate the two shims
  into one. This **collapses §B2 into the F-41 work and reduces the statusline's
  dependence on coordination-home-via-git** — a concrete "fewer problems" win.
- **Open sub-question** (verify before designing): the exact semantics of
  `workspace.project_dir` vs `workspace.git_worktree` (which is primary, which is
  the worktree) — a quick read of real stdin JSON from a worktree session settles it.

## Sanitisation findings

| # | Finding | Location | Action |
| --- | --- | --- | --- |
| Z-1 | **Personal-location reference about the owner** (a coarse region/timezone line used as UTC-discipline context; pre-existing on main, line 112) | `collaboration-state-domain-model-and-comms-reliability.plan.md` | Genericise: drop the personal-location framing, keep the UTC-discipline point. Org directive: no PII. |
| Z-2 | Hardcoded coordinator name leaked into doctrine (`use-agent-comms-log.md`) | flagged in `m1-inventory` §4.3, said fixed in `d9225d5b` | Verify the fix actually landed on `main`. |
| Z-3 | Stale path text (`comms-events/` vs shipped `comms/`) | domain-model brief | Correct or mark superseded (= C-3). |
| Z-4 | Status contradiction: "PLANNING (not started)" yet documents large landed code | `statusline-logo-modularisation.plan.md` | Reconcile the status banner with reality. |
| Z-5 | `last_updated` frontmatter/body mismatch (2026-05-22 vs 2026-06-21) | coordination-watcher future stub | Trivial fix. |
| Z-6 | Done-but-not-archived plans sitting in `current/` | write-safety, surface-restructure, protocol | = the archive list above. |
| Z-7 | Agent codenames + session prefixes embedded in plan bodies | several plans | Pseudonymous, **not** PII; but they are leaked session-attribution in semi-permanent plans. Low priority; flag for owner. |
| Z-8 | No machine-local absolute paths found anywhere in scope | — | Clean. |

My own report's "(now on `main`)" claim for the worktree-hygiene rule was
**verified first-hand** against `origin/main` at the §Method baseline
(`af47c4a96`, which includes #248) — correct as of this session's merge train.

## Open decisions for the owner

1. **D1 — Adopt the 3-tier substrate taxonomy** (memory / repo-state / local-state)
   and make the live coordination tier of `.agent/state/` git-ignored (its
   decision-provenance surfaces — `conversations/`/`escalations/`/`sidebars/` —
   stay tracked)? This resolves the C-1 contradiction and
   ratifies `continuity-surfaces-are-state-not-memory`.
2. **D2 — Reconcile with the rightsizing brief.** Revive it as the meta-cull-home
   and expand its scope to all four facets, OR bound it to coordination-machinery
   and give the other facets their own homes (this report's table)? Either way,
   this report feeds its M4 rather than competing with it.
3. **D3 — Authorise the archive pass** for the three done plans (write-safety,
   surface-restructure, protocol-core; re-home the WS5 harvest)?
4. **D4 — Fold operability §B into the F-41-tail plan**, and slim operability §A
   against rule clause 8?
5. **D5 — Sequence F-98 (work-state-registry) first** by authoring its
   agent-work-state ADR, as the keystone the other facets depend on?
6. **D6 — Statusline working-location data** sourced from the F-98 registry, with
   §B2 binary-pinning treated as the separate smaller fix (per C-rebuttal)?

## Decision resolution (through the decision lenses)

The six decisions above were run through the `principles.md` decision lenses
(applied in order; the first decisive lens governs; the owner is reached only for
constitutively-owner questions — prioritisation, product/feature scope — or where
all five genuinely fail). **Result: all six resolve as design questions.** What
remains is prioritisation and execution authorisation, not design.

| # | Governing lens / principle | Resolved verdict |
| --- | --- | --- |
| D1 | L1 excellence + §Decompose at the Tension | Adopt the 3-tier taxonomy; name the invariant (local-state is already largely git-ignored); this prevents the wrong migration rather than enabling one. |
| D2 | L3 First Question + §Decompose | Bound the rightsizing brief to coordination-machinery; do not grow a four-facet mega-plan; this report feeds its M4. |
| D3 | L2 Strict & Complete / §No legacy surfaces | Archive the completed plans after a first-hand completeness confirm. Routine curation, not destructive removal. |
| D4 | L1 + L2 (DRY / no duplication) | Fold operability §B into the F-41-tail plan; slim §A against rule clause 8 (operability §B tells itself "do not duplicate"). |
| D5 | L1 + L4 (dissolve, don't solve-in-place) | F-98 is the keystone; author its agent-work-state ADR first, ahead of the dependent facets. |
| D6 | L2 + explicit §No shims, no hacks, no workarounds | Replace the bespoke `.mjs` shim with a gated entry; derive location from stdin / F-98; §B2 is the separate orthogonal fix. |

### What remains (owner-nature, not design)

1. **Prioritisation** — whether to pursue this area now, and what leads. F-98's ADR
   first is the lens-recommended foundation. The lenses do not resolve cross-stream
   priority; that is constitutively the owner's.
2. **Execution authorisation on live lanes** — D4 and D6 edit live-lane plans
   (operability / statusline), so execution needs Director (Oyster) coordination
   plus an owner go. D5's *build* is owner-GO-gated by the F-98 plan's own promotion
   trigger; D1's taxonomy is a doctrine amendment the owner ratifies; D3's archive
   is routine but worth an explicit go.
3. **One verification (a task, not a decision)** — the exact semantics of
   `workspace.project_dir` vs `workspace.git_worktree` on the statusline stdin,
   before the D6 redesign is finalised.

## Coordination note

Phase 1 (this assessment) is read-only and parallel-safe. Any execution of the
above — archiving, folding, editing live-lane plans — is **not** in this lane's
scope without Director (Oyster spins Coral) coordination and owner steer, because
several targets are referenced by live lanes (statusline via #250, the map is the
Director's, the orientation plans are Peony's).

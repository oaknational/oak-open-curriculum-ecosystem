---
name: "Agent-Operability Deferred-Work Map"
status: future-strategic
type: developer-experience
thread: agent-operability-plan-consolidation
lineage:
  serves_thread: agent-operability-plan-consolidation
  serves_stream: agentic-framework
  derives_from: ".agent/reports/agent-operability-plan-corpus-rationalisation-2026-06-27.md"
created: 2026-06-27
created_by: Beluga rides Wave (claude-code, claude-opus-4-8[1m])
---

# Agent-Operability Deferred-Work Map

> **What this is.** The backlog of agent-operability work the rationalisation lane **deferred**,
> framed as what it actually is: **product work on the agentic-framework value stream** — and the
> dependency structure that ties it together. It is a map, not a build plan: every item keeps its
> authoritative home plan; this document points to each home, scores it by impact, and places it
> in the structure so the work can be prioritised and resumed coherently. It **owns no execution** —
> each item is promoted from *its own* home plan.

## Why this is value-stream work (the impact frame)

The agentic framework is **one of Oak's three fundamental value streams**
([strategy README](../../../../docs/strategy/README.md);
[alignment-and-streams](../../../../docs/strategy/alignment-and-streams.md) §"The three value streams
as a system") — and its own [stream strategy](../../../../docs/strategy/stream-agentic-framework.md)
gives the detail: outward, an openly documented framework other teams adopt; inward, how Oak gets
better at delivering. The owner has
**settled (2026-06-20)** that the internal alignment is **direct** — "Oak getting better at
delivering Oak's goals." So agent-operability work is not internal overhead with a discounted
bridge to value; it is **product work on a value stream**, and its impact **compounds** (fix the
state-binding once, and every future product's delivery is faster and safer).

Two framing rules follow, both load-bearing:

- **The strictness is the foundation, not friction to cut.** The strategy's "what we won't do" is
  explicit: "won't sacrifice rigour for speed — the strictness is the foundation that makes
  fast-with-agents possible." The cull discipline below removes *accretion*, never rigour.
- **Dogfooded friction is the value mechanism (FRAME-1).** The Practice is a meta-learning loop —
  "the proof is in the dogfooding." The coordination friction the team hit this session (watcher
  deaths, freshness≠liveness false-positives, cross-worktree confusion, dead-watcher accumulation)
  is the loop *working*: friction is captured (the frictions register) and the deferred work is the
  framework improving itself from it. The friction is the evidence **for** this work, not against it.

**The impact test (used for the triage below):** *does this item make the framework more excellent
and more adoptable* — robust, coherent, lean, portable, measurable — *and is it grounded in a
demonstrated friction?* That replaces "is this overhead worth tolerating?"

## The two keystones

Grounded first-hand against the report and the plan estate (2026-06-27). The deferred work organises
around two keystones — one per spine — that the report names
([report](../../../reports/agent-operability-plan-corpus-rationalisation-2026-06-27.md)
§"Better order / stages / distribution"). The downstream structure each governs is in
[How they hang together](#how-they-hang-together); this section only **defines** them.

- **Build keystone — F-98 (D5).** [`agent-work-state-registry.plan.md`](agent-work-state-registry.plan.md)
  (friction **F-98** in the [frictions register](../frictions-register.md)) binds
  `(identity → worktree → branch → liveness)`. A `future-strategic` brief, **blocked on authoring an
  agent-work-state ADR** (decision-class). It cures the single friction-cluster that cost the most
  this session, so it is **high-impact**.
- **Consolidation keystone — rightsizing (D2).**
  [`collaboration-substrate-coordination-rightsizing.plan.md`](collaboration-substrate-coordination-rightsizing.plan.md)
  (`active-strategic-exploration`; M1 inventory done 2026-05-29, M2–M4 pending) is the "meta-cull
  home"; its **M4 output is the supersession/deletion list** that governs the consolidation spine.
  **High-impact as product quality on FRAME-2** — a framework others adopt cannot be a sprawl, so
  leanness is adoptability. (Rigour stays; accretion goes.) The #252 report *feeds* M4 rather than
  competing with it.

The **F-98-independent quick wins** — the *light* D6 (read `workspace.git_worktree` from stdin) and
the under-the-hood caveat-drop — depend on neither keystone.

## Disposition ledger

Every deferred part → home artefact, status, blocker, next move. (Counts/dates anchored to
2026-06-27; re-derive at execution time.)

| Item | What it is | Home artefact | Status | Blocked on | Spine |
| --- | --- | --- | --- | --- | --- |
| **D2** | Decide rightsizing scope: expand to all four facets, or bound it and give the other facets homes | [`future/collaboration-substrate-coordination-rightsizing.plan.md`](collaboration-substrate-coordination-rightsizing.plan.md) | active-strategic-exploration (M1 done; M2–M4 pending) | Owner scope decision | Consolidation (keystone) |
| **D3 · write-safety** | Archive once strict-hard fitness evidence is recorded | [`current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md) | deferred in `current/` (defer note added by #258) | A deep-consolidation (strict-hard) pass | Consolidation |
| **D3 · protocol archive** | Route the ~1140-line protocol body to canonical homes, then 19-site repoint + archive | [`current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md) | QUEUED — owner direction required | Owner GO (standalone 5-phase sub-project) | Consolidation (F-98-independent) |
| **D4** | Fold operability §B into the F-41-tail plan; slim §A against rule clause 8 | [`current/comms-and-worktree-operability.plan.md`](../current/comms-and-worktree-operability.plan.md) → [`future/coordination-home-explicit-targeting-migration.plan.md`](coordination-home-explicit-targeting-migration.plan.md) | operability: **PROPOSED — DEEP REVIEW REQUIRED**; F-41-tail: future | Operability plan's deep-review + owner-ratification gate | Consolidation |
| **D5** | Author the agent-work-state ADR (F-98) — the keystone | [`future/agent-work-state-registry.plan.md`](agent-work-state-registry.plan.md) + F-98 | future-strategic (friction OPEN, decision-class) | The ADR decision (owner / architecture) | Build (keystone) |
| **D6 · light** | Read `workspace.git_worktree` from stdin → working-location, replacing the two `.mjs` shims. **Partly interim:** the stdin source is scaffolding the F-98 registry (full-D6) later supersedes; the durable gain is the shim-consolidation | `agent-tools/src/claude/statusline-identity-input.ts` (+ the statusline plans below) | not started | A render-from-worktree verify (Seal's `.claude/settings.json` precondition is met via #243) | Build (F-98-independent) |
| **D6 · full** | Source working-location from the F-98 registry | same statusline surface | not started | **D5 (F-98 ADR)** | Build |
| **Operational-registers placement** | Should `operational/` knowledge registers (pending-graduations, open-questions) be re-homed as *memory*? (the report calls this D1; renamed here so it does not collide with the report's D1 = taxonomy) | [`open-questions`](../../../memory/operational/open-questions.md) (routed by #256's ratification note) | open | A placement decision (ties to D2 / rightsizing) | Consolidation |

The statusline plans D6 touches are
[`current/session-and-team-state-statusline-icons.plan.md`](../current/session-and-team-state-statusline-icons.plan.md)
and [`current/statusline-logo-modularisation.plan.md`](../current/statusline-logo-modularisation.plan.md)
(both `PLANNING`, both F-98-independent). The report's **M-1..M-4** and **D-1..D-9** duplication
findings are **inputs to rightsizing M4**, not separate work items.

The operability plan's **§B2** (pin the statusline binary to the primary checkout) is **not a separate
item — it is dissolved by D6·light**: the binary-pin bug is the same path-arithmetic fall-through that
reading `workspace.git_worktree` from stdin removes, so fixing D6·light eliminates it.

## Impact triage (by the test above)

- **High impact — robustness the framework needs, grounded in demonstrated friction:** **D5 (F-98)**
  — the missing state-binding behind this session's worst friction; **D2/rightsizing** — leanness =
  adoptability (FRAME-2); the **F-41-tail resolver build** — the genuine operability remnant (most of
  the operability plan's §A/§B1 has already graduated to the worktree-hygiene rule on `main` — report
  M-1 / D-2 / D-1), and from-worktree command safety was a footgun hit this session.
- **Medium — high value-per-effort, or coherence/hygiene that aids adoptability:** **D6·light**
  (high value-per-effort but only medium impact — orientation polish whose durable gain is the shim
  consolidation); the archives (D3·write-safety, D3·protocol archive) and the D-1..D-9 cite-back culls,
  *governed by rightsizing M4* so they are culled coherently rather than groomed piecemeal.
- **Lower — cosmetic or narrow:** statusline logo modularisation. (§B2 is not a tier entry — it is
  dissolved by D6·light, above.)

## How they hang together

```text
BUILD spine                                  CONSOLIDATION spine
-----------                                  -------------------
D5: F-98 agent-work-state ADR  (KEYSTONE)     D2: rightsizing scope  (KEYSTONE)
   |- D6.full (registry-sourced statusline)      |- rightsizing M2-M4
   |- durable cross-worktree map                     |- M4 supersession/deletion list
   |- freshness != liveness (F-95) fix                   |- D3.write-safety closure
                                                         |- D3.protocol archive (concept-home-refinement)
F-98-INDEPENDENT (do anytime):                           |- D4 operability B -> F-41-tail (after deep-review)
   * D6.light (stdin git_worktree;                       |- D-1..D-9 / M-1..M-4 cite-back culls
       dissolves operability B2)
   * under-the-hood caveat-drop (done)         operational-registers placement -> ties into D2
```

The two spines are **parallel**. In the tree, **build-spine children hard-block on D5** (they need
the F-98 model); **consolidation-spine children sequence *beneficially* under M4** but each can also
proceed on its own gate (minimum-shippable). Two extra hard-blocks: **D4** on the operability plan's
deep-review gate, and **D6·light** on a render-from-worktree verify.

## Recommended sequence

The two spines are **parallel**, not serial: this numbering is **priority order, not a dependency
chain**. The consolidation spine (D2 → M4) must **not** be held hostage if the F-98 ADR stalls — it
runs on its own gates. This follows the report's keystone-first sequencing
([report](../../../reports/agent-operability-plan-corpus-rationalisation-2026-06-27.md)
§"Better order / stages / distribution").

1. **Unblocked quick wins** — the **light D6** (Seal's `settings.json` is on `main` via #243; gated
   only on a render-from-worktree verify). High value-per-effort.
2. **Build keystone — D5:** author the agent-work-state ADR (F-98). It resolves the full D6, the
   durable map, and the freshness fix against one model — the highest-impact single build item.
3. **Consolidation keystone — D2:** take the rightsizing scope decision and run M2–M4 to the
   supersession/deletion list, then execute the archives (write-safety closure; the protocol archive
   via the concept-home-refinement sub-project), the D4 operability fold (after its deep-review gate),
   and the cluster-plan culls — governed by M4 so leanness is achieved coherently.

Steps 2 and 3 proceed **in parallel** as capacity allows; neither blocks the other.

## Strategic acceptance criteria and success signals

- The doc opens with the value-stream impact frame (this is product work on the agentic-framework
  stream; the impact test is stated) — so every "do / defer / cull" decision can be made against it.
- Every deferred part has a ledger row resolving to a real home-artefact path, with status, blocker,
  and an impact tier. **Nothing un-homed.**
- The two-keystone structure matches the report; the recommended sequence is dependency-valid.
- **Success signal:** a future session can pick the next item by impact tier from this map and resume
  it via its home plan without re-deriving the structure or re-litigating its value.

## Risks and unknowns

- **F-98 is decision-class** — its ADR is an owner/architecture decision; the build spine cannot
  advance until it is taken.
- **The operability plan needs a deep review** before D4 can fold it.
- **D2's scope is an owner decision** — whether rightsizing expands to all four facets or stays
  bounded changes how much of the consolidation spine flows through M4.
- **This map can go stale** as items land — it carries no facts of record beyond the ledger, so the
  staleness cost is low; strike a row (don't silently edit) when its item ships.

## Promotion trigger

This map is `future/` and stays there; it does not promote as a unit. Each ledger item promotes to
`current/` via **its own home plan** when selected — this map is the index that says which item is
unblocked, what it depends on, and how high its impact is. Strike a row when its item lands.

## Non-goals

- **No duplication or supersession** of any home artefact (the report, rightsizing, operability, the
  statusline / F-98 plans). Facts stay authoritative in their home; this is an index + sequence.
- **No execution** and **no re-deciding** what the report or rightsizing already frame.
- **Not a controlling plan** — it sequences, scores, and points; it does not own the work.
- **No cutting of rigour** — the cull removes accretion that would not earn its place in a framework
  others adopt, never the load-bearing strictness.
- **Out of scope (adjacent, noted not owned):** DATA-SOURCES org-ratification (#262 landed; an org
  process), #253 (PDR-118, the Director's), and the post-merge `/oak-under-the-hood` verify (Seal's
  retained claim `bb9073cd`).

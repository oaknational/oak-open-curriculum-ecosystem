---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Napkin rotated (2026-06-18 dedicated consolidation, Sandpiper lifts Downdraft)

Rotated at the critical zone during the goal-gated drain-all-buffers session. The processed
2026-06-17/18 window (Skunk → Phobos → Ocelot → Tempest → Wisteria entries) is preserved
verbatim at
[`archive/napkin-2026-06-18-sandpiper-consolidation.md`](archive/napkin-2026-06-18-sandpiper-consolidation.md).
Every behaviour-changing entry's home was verified first-hand before the archive-move: the 5
graduated patterns (incl. `fluency-is-a-failure-vector` and
`delivering-a-reframing-is-a-consumer-walk`), PDR-104, the PDR-098 recurrence-capture step in
`consolidate-docs`, the commit-skill negative-control reframe, and the frictions register
(F-44 homes the SAFETY claims-freshness friction; F-68/F-69).

Two genuine candidates were conserved to `pending-graduations.md` rather than archived cold (both
owner-decision-gated): the **new-vessel-for-new-kind** cure (Phobos) and the **PDR-104 ↔ PDR-098
best-effort-safety link** (Wisteria's last insight A). Last insight B (CLI friction-density →
PDR-055 priority) was confirmed **already-homed** — the `agent-tools-cli-ergonomics` plan already
prioritises the collaboration-state/commit/handoff surface and its Phase 0 mines the frictions
register. Last insight C (oscillating internally on continue-vs-defer instead of surfacing the
scope call early — a per-user behavioural lesson) routes to the **separately-due per-user-memory
pass** (`MEMORY.md` is over its size limit); it is conserved verbatim in the archived napkin.

New session observations append below.

## Usefulness is judged from the current process, not existence/usage/provenance (2026-06-19, owner correction, Sandpiper)

- **Owner sharpened a question I answered with the wrong test.** Asked whether `tracks/` and
  `workstreams/` are useful, I reached for *usage history* ("never instantiated"; "was retired")
  and *past authorising decisions* ("PDR-011 defines it"; "PDR-027 retired it"). The owner: "existence
  is not proof of usefulness, and past plans are certainly not evidence of what current processes
  should exist… we are asking, are they **useful now**?" The only valid test is **first-principles
  against the current process: does this surface/rule/process fill a need nothing else already fills,
  now?** Existence, usage history, and the decision that created it are all silent on that.
- Applied: `tracks/` (ephemeral per-session coordination cards) has no unique current job — the
  harness task list + napkin + claims/comms/conversations already cover it. `workstreams/` (a layer
  between thread and lane) has none — thread records carry `## Lanes` directly. Both retired.
- **Graduation candidate** — sharpens [[existence-is-not-correctness-default-replace]]: that one says
  inherited shapes get replaced not softened; this adds the *evaluation method* — judge by present
  need from first principles, never by existence/usage/provenance. Sibling: [[fluency-is-a-failure-vector]]
  (leaning on a provenance/usage fact is a fluent substitute for the first-principles check).

## Reference-direction invariants — two axes of artefact fundamentality (2026-06-19, owner co-design, Sandpiper)

- **The broken-thread-links problem generalised to a foundational invariant.** Root cause of link
  fragility: references pointing at LESS-fundamental artefacts (which move/die/are-absent and so break
  the referrer). Owner named two orthogonal axes of "fundamentality"; a reference must point toward the
  more-fundamental, never away:
  - **Durability (time): ephemeral → durable.** operational-state (napkin/comms/claims) < threads <
    plans < patterns/distilled < rules < ADRs/PDRs < principles. Ephemeral surfaces reference durable
    doctrine; durable never references ephemeral. (Extends `feedback_adrs_permanent_plans_ephemeral`
    from plans to threads.)
  - **Portability/generality (context): specific → general.** repo code/docs < ADRs (repo-specific) <
    PDRs (portable Practice) < cross-Practice principles. ADRs may cite PDRs; PDRs must NOT cite ADRs
    (a PDR travels to repos where that ADR is absent — the portability invariant).
  - **Unification:** target availability ≥ referrer availability, across time (durability) AND context
    (portability). A reference is safe iff its target outlives and out-travels the referrer.
  - **Single-index corollary:** unavoidable same-/higher-volatility references (the continuity index →
    thread records; a plan → its thread) route through exactly ONE resolver that owns the mapping, so
    churn is localised. repo-continuity is that resolver for threads.
- **Already homed in fragments** to unify: `no-moving-targets-in-permanent-docs` (time axis as a rule),
  `practice-core-portability` (portability axis), `feedback_adrs_permanent_plans_ephemeral`.
- **LANDED as PDR-105 + `validate-reference-direction` (report-first; commit `8d0297696`).** The
  fragment-rules become its operationalisations; the `consolidate-docs` 7d rule↔plan-citation check is
  a time-axis VIOLATION to retire. Sibling: [[existence-is-not-correctness-default-replace]], the
  usefulness-now entry above.

## Loss-scan at session-close (2026-06-19, Sandpiper lifts Downdraft)

Adversarial sweep — held in context, routed here so it is not lost:

- **PDR-105 wording is imprecise — tighten next session.** The two axes are most precisely Martin's
  **Stable Dependencies Principle** (depend in the direction of stability), not DIP. **DIP proper**
  (depend on an abstraction, not a concretion) is the **stable-index corollary** only. PDR-105 §Context
  says "this is the Dependency Inversion Principle" — true in spirit, loose in name. Fix: axes = SDP;
  index corollary = DIP. (Owner asked; surfaced the imprecision. Carried in the next-session opener.)
- **New repo-validator → register it in `knip.config.ts` entry list**, else `knip` fails the gate as
  "unused file" (entry-point scripts are invoked via the bin chain, not imported). Gotcha hit this
  session; sibling to the format:root / markdownlint:root pre-commit re-run-and-restage pattern.
- **(me) Over-gating recurred repeatedly this session** — turning safe/forced or owner-principle-covered
  actions into approval gates (owner corrected it ~4×: the AskUserQuestion the owner rejected to
  clarify; "stop getting lost in details, use proper tools"; the useful-now reframe). Cross-session
  behaviour → **per-user memory candidate** (per-user `MEMORY.md` is over-limit; behavioural entry due —
  out of this repo's scope). Sibling: [[over-caution-root-is-perfectionism]], [[fluency-is-a-failure-vector]]
  (a fluently-invoked principle — "DIP" — that wasn't the precisely-right one).
- **Sequencing lesson (the session's own arc):** I removed `tracks`/`workstreams` and moved thread
  records BEFORE burning down their references — enacting the durable→ephemeral coupling PDR-105 forbids
  while authoring it. The burndown must be **refs-first, then delete/move**. Homed in the thread record
  pickup; restated here as the load-bearing why for the deferral.

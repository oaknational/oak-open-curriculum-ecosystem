---
name: "Group A Pending-Graduations Execution (parallel lanes)"
overview: >-
  Execute the six owner-ratified Group A graduations from the pending-graduations
  decision packet, optimised for parallel lane execution with one serialized
  shared-index convergence step. Each lane is a self-contained delegation brief
  carrying the home-grounding done by Tempestuous Vaulting Falcon on 2026-05-29,
  so the executing agent verifies rather than rediscovers.
status: done
thread: agentic-engineering-enhancements
todos:
  - id: ws-readiness
    content: "Readiness gate: assumptions-expert (proportionality) + docs-adr-expert (Practice-doc shape) review the plan; re-derive next-free PDR numbers; confirm active-claims for shared-index files. Blocks lane dispatch. DONE 2026-05-29 (Veiled Stealing Candle) — cleared ready-with-conditions; see '## ws-readiness Outcome'. PDR-087=C, PDR-088=D; both pdr_kind: governance; sequential order B→C→D→A→E."
    status: done
    depends_on: []
  - id: ws-a-thread-hygiene
    content: "Lane A (#21): retired-thread-record hygiene — consolidate-docs thread-hygiene check + one-line PDR-027 note + threads/README retirement-banner convention. DONE 2026-05-29 (Shaded Prowling Threshold) — owner-approved; 4 edits (consolidate-docs §7c check-7; threads/README §Retirement-banner convention; PDR-027 Amendment-Log; pr-90 retroactive banner); markdownlint+portability green, 4 touched files healthy fitness. UNCOMMITTED (lands in WS-Z bundle)."
    status: done
    depends_on: [ws-readiness]
  - id: ws-b-reflection-foundational
    content: "Lane B (reflection, `due`): reframe subjective experience/reflection from 'surplus/optional' to foundational continuity substrate — PDR-011 amendment + ADR-150 mirror + session-handoff §6c. SANCTITY: agent-authored, owner-reviewed. DONE 2026-05-29 (Veiled Stealing Candle) — owner-approved substance; doubt-resolution (foundational attaches to signal not quota) + Vector-B observable-guard (consolidate-docs corpus-thinning detection) landed; markdownlint+portability green, touched files healthy fitness. Adversarial verification: A/C hold, B-leak closed."
    status: done
    depends_on: [ws-readiness]
  - id: ws-c-tdd-as-design-pdr
    content: "Lane C (#40): graduate TDD-as-design to a portable Practice-Core PDR (number assigned at ws-readiness). SANCTITY: agent-authored, owner-reviewed. DONE 2026-05-29 — PDR-087 (governance), owner-approved; markdownlint+portability+vocabulary green, healthy fitness. Phenotype = host tdd-as-design directive (no standalone ADR); practice-index row at WS-Z."
    status: done
    depends_on: [ws-readiness]
  - id: ws-d-reviewers-carry-doctrine-pdr
    content: "Lane D (#41 + #42): graduate reviewers-carry-doctrine to a Practice-Core PDR (number assigned at ws-readiness), fold #42 (forcing-function read-path) in, fix test-reviewer→test-expert naming drift. SANCTITY: agent-authored, owner-reviewed. DONE 2026-05-29 — PDR-088 (governance), owner-approved; #42 folded in as the mechanism; markdownlint+portability+vocabulary green. NAMING-FIX DROPPED: 'Test Reviewer' H1 is the consistent cross-template convention (Type Reviewer / Architecture Reviewer Template all use it; filenames use -expert) — fixing only test-expert would CREATE inconsistency. practice-index row at WS-Z."
    status: done
    depends_on: [ws-readiness]
  - id: ws-e-pdr058-optionality-family
    content: "Lane E (#37 + #22+23): PDR-058 amendment naming Surface 4 (sequencing optionality) + confirming Surface 3 (outcome optionality) graduation. SANCTITY: agent-authored, owner-reviewed. DONE + OWNER-APPROVED 2026-05-29 (Furnace Melting Bellows). PDR-058 Surface 3 cure graduated with don't-shoehorn merged (ONE discipline); Surface 4 named (diagnostic+cure+falsifiable-tripwire-vs-vague-conditional); active layer = optionality-surface clause in plan-body-first-principles-check.md (LTAE-forced: PDR-058 clauses + plan-body rule clause, NO new rule files → 0 RULES_INDEX rows). THREE files for WS-Z commit: PDR-058 + plan-body-first-principles-check.md + scope-adjacent PDR-029 (Amendment-Log note, already indexed → no README row). Register-removal grounding done: #37→PDR-058 S4; #22+#23→PDR-058 S3 merged. Reviewer pass run (docs-adr + assumptions, review-only). UNCOMMITTED (lands in WS-Z bundle); Furnace's claims closed → files unclaimed."
    status: done
    depends_on: [ws-readiness]
  - id: ws-z-shared-index-convergence
    content: "Lane Z (convergence, single writer): DONE 2026-05-29 (Eclipsed Creeping Secret). Shared-index edits applied — PDR README rows (PDR-087/088; PDR-058 row unchanged, its title/status did not change), practice-index phenotype-bridge rows (087/088), RULES_INDEX 0 rows (Lane E minted no rule files), pending-graduations 6 graduated entries removed CLEANLY (no provenance pointers — owner-directed; substance verified live in each home first), repo-continuity refreshed. Gatekeeper gates green (markdownlint/portability/vocabulary/repo-validators/agent-tools type-check+lint+test). fitness:strict-hard RED on napkin+distilled recorded as deferred-to-the-fitness-session (owner-directed; not rotated/trimmed). Six-dimension adversarial pre-commit review: all CLEAN. WS-Z content landed in the owner's whole-tree sweep 9317cdcd; plan archived to archive/completed/."
    status: done
    depends_on: [ws-a-thread-hygiene, ws-b-reflection-foundational, ws-c-tdd-as-design-pdr, ws-d-reviewers-carry-doctrine-pdr, ws-e-pdr058-optionality-family]
---

# Group A Pending-Graduations Execution (parallel lanes)

**Lane**: `current/` (executable, queued, not started).
**Thread**: `agentic-engineering-enhancements`.
**Source decision**: owner-ratified 2026-05-29 — *"I would like to do all of it … optimise the plan for parallel execution where reasonable."*
**Grounding ledgers** (authoritative for the per-item disposition and home
corrections):
[`curator-passes/2026-05-29-tempestuous-vaulting-falcon.md`](../../../memory/operational/curator-passes/2026-05-29-tempestuous-vaulting-falcon.md)
and
[`curator-passes/2026-05-28-sunlit-waxing-moon.md`](../../../memory/operational/curator-passes/2026-05-28-sunlit-waxing-moon.md).

## End Goal, Mechanism, Means

**End goal.** Six learning signals that are *correctly evidenced and warranted*
are graduated from the pending-graduations buffer into the durable guiding
surfaces (PDRs, rules, directives, skills) so they act automatically on future
work — making the documentation, memory, and Practice Core *more useful and
impactful*, not merely shorter. The register shrinks only as a by-product of
genuine graduation.

**Mechanism.** Each item already has an owner-ratified graduation verdict and a
re-grounded home (this plan carries both). Graduating to the named home converts
a passively-watched candidate into an enforced/operative surface. The
optionality items (#37, #22+23) slot into PDR-058's pre-architected
decomposition; the two new PDRs (#40, #41) give host-local doctrine its portable
twin; the reflection reframe elevates a foundational continuity property the
current surfaces understate.

**Means.** Five independent authoring lanes (A–E) on disjoint file scopes, plus
one serialized convergence lane (Z) for the shared indices. Lanes A–E are
parallel-dispatchable to separate agents; Z runs once after all land.

## Critical re-grounding context (read before executing)

The Sunlit ledger that proposed these graduations was found **~83% wrong on its
Group C withdrawal verdicts** (15 of 18 "covered by X" homes did not contain the
substance — see the 2026-05-29 ledger). Therefore: **do not trust the "evidence
met" framing on faith.** Each lane below carries the home-grounding already done
on 2026-05-29; the executing agent MUST re-confirm the home against the live repo
before authoring (`verify-dont-trust`), exactly as that ledger did. Two ledger
home recommendations were already corrected (see Lane E).

## PDR Number Reservation (deconflict at execution)

This plan refers to the two new PDRs as **PDR-⟨tdd⟩** (Lane C) and
**PDR-⟨reviewers⟩** (Lane D). Do **not** hard-assume specific numbers: the queued
`role-emission-citation-binding.plan.md` already reserves **PDR-086**, and a
prior session touched PDR-086 in a renumber. `ws-readiness` re-derives the
next-free Practice-Core PDR numbers at execution time and assigns them to Lanes C
and D, avoiding any number reserved by another live plan; WS-Z confirms the final
numbers before writing index rows.

## ws-readiness Outcome (2026-05-29 — Veiled Stealing Candle)

Gate **CLEARED → ready-with-conditions**. assumptions-expert + docs-adr-expert
reviewed the plan; five adversarial home-verifiers re-confirmed each lane's home
against the live repo (the Group-C-83%-wrong guard). **All five lanes verified:
home correct, substance not already present, evidence holds.** Decisions
(reviewer findings were re-grounded against the live repo before acceptance —
two were rejected as over-escalations):

- **PDR numbers (deconflicted against live-plan reservations).** Files are
  contiguous to PDR-085; PDR-086 is reserved by
  `role-emission-citation-binding.plan.md`. **Lane C (TDD-as-design) = PDR-087;
  Lane D (reviewers-carry-doctrine) = PDR-088.**
- **`pdr_kind: governance` for BOTH new PDRs.** Verified against the taxonomy
  (PDR-007 amendment: `pattern` is for universal patterns synthesised from ≥2
  instances; `governance` is the default for Practice-governance decisions) and
  the nearest neighbours (PDR-020/021/034 testing-discipline and PDR-015
  reviewer-authority are all `governance`). The reviewer's "consider `pattern`"
  steer is **rejected** as inconsistent with the corpus.
- **No new phenotype ADRs (reviewer escalation rejected; real kernel kept).**
  PDR-079 §Notes describes pairs materialising only when new repo-bound
  *substrate* exists — it mandates nothing. PDR-087's repo-bound expression
  already exists as `tdd-as-design.md`; PDR-088's as the sub-agent templates.
  Precedent (PDR-077/079/083/084) records "No standalone phenotype ADR.
  Substrate is X" rows in `practice-index.md`. **WS-Z therefore adds two
  `practice-index.md` rows** in that form (the canonical PDR↔phenotype bridge) —
  this surface was missing from WS-Z scope and is added below.
- **Lane D evidence framing (adjustment — accepted).** `test-expert.md` carries
  the full carrier shape (label + MANDATORY read-path + cite-by-section).
  `type-expert.md` / `architecture-expert.md` share only the
  mandatory-doctrine-**read-path**, not cite-by-section or the carrier label.
  PDR-088 frames the read-path as the ≥2-instance pattern and cite-by-section as
  test-expert's stronger variant — it must NOT claim all three are equivalent.
- **Solo sequential order: B → C → D → A → E.** B is the most substantive Core
  amendment (PDR-011 / ADR-150 / session-handoff bundle); C/D are the new PDRs;
  A/E are lighter. Owner-review touchpoints sequence in that order.
- **Lane A owner-review.** Lane A's one-line PDR-027 amendment is a Core touch;
  treat it as owner-reviewable (same gate as the SANCTITY lanes) even though it
  sits below the full-amendment threshold.
- **Authoring-discipline conditions (per docs-adr-expert, accepted):** every
  amendment lands in the target's **Amendment Log** (not §Decision/§Consequences
  body) — PDR-011, PDR-027, and ADR-150 §Decision bodies stay unchanged; any
  reference to an ADR inside a PDR body uses **identifier-only** form (`ADR-150`),
  never a markdown path link (PDR-079); the new PDRs import **no** host-path
  cross-references from their source directives.
- **If any home-confirmation had failed:** abort that lane and surface to owner
  (none failed; recorded for completeness per the assumptions-expert gap note).

## Parallel-execution structure

```text
            ws-readiness  (assumptions-expert + docs-adr-expert; reserve PDR nums)
                  │
   ┌────────┬─────┴────┬─────────┬──────────┐
  WS-A     WS-B       WS-C      WS-D       WS-E      ← parallel (disjoint file scopes)
 (#21)  (reflection) (#40 PDR) (#41 PDR) (#37+#22+23)
   └────────┴──────────┴─────────┴──────────┘
                  │
              WS-Z  (single-writer shared-index convergence + final gates)
```

**Parallel-dispatch contract.** Lanes A–E touch disjoint file scopes and may run
concurrently. Because every lane authors or amends Practice Core (PDRs / Core
directive surfaces), each lane is **agent-authored by the lane's own main agent
and owner-reviewed** — NOT delegated to sub-agents
([`subagent-practice-core-protection`](../../../rules/subagent-practice-core-protection.md);
Practice Core is main-agent drafting with owner review). "Parallel" therefore
means *one agent per lane in a team session* (or sequential in a solo session),
never a sub-agent fan-out over Core. The shared-index edits (WS-Z) are the only
true serialization point.

---

## WS-A — #21 retired-thread-record hygiene  `depends_on: ws-readiness`

**Goal.** Land a small consolidate-docs thread-hygiene check (retired thread
records must carry a retirement banner) + a one-line PDR-027 note + a
threads/README convention line.

**Owned file scope**:

- `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` (add a thread-hygiene
  check step)
- `.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md`
  (one-line note on retirement-banner hygiene; PDR-027 already discusses
  workstream-layer retirement — extend, do not duplicate)
- `.agent/memory/operational/threads/README.md` (retirement-banner convention)

**Files NOT to touch**: any other lane's scope; the PDR decision-records README
(WS-Z owns index rows).

**Grounding (2026-05-29).** PDR-027 §Amendment Log discusses workstream-layer
retirement and "retired-surface README records the retirement rationale" but has
no clause that *retired thread records must carry a retirement banner*. Real
small gap.

**Acceptance (proof: non-code)**:

- consolidate-docs carries a check that flags retired thread records lacking a
  retirement banner.
- PDR-027 carries a one-line retirement-banner-hygiene note (no content
  duplication with the existing retirement discussion).
- A retroactive banner is applied to any currently-retired thread record found
  banner-less during the check's first run.

**Validation**: `pnpm markdownlint:root`; `pnpm practice:fitness:informational`
(touched files GREEN); `pnpm portability:check` (skill/Core surfaces).

---

## WS-B — reflection-foundational reframe (`due`)  `depends_on: ws-readiness`  ⚑ SANCTITY

**Goal.** Reframe subjective experience / reflection from *"reflective surplus
… (optional)"* to a **first-class foundational continuity substrate**, per owner
direction 2026-05-28: *"reflection and subjective experience are not surplus,
they are the foundation of the systems that will have true continuity."*

**Owned file scope**:

- `.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md`
  (amendment: elevate subjective experience/reflection — currently absent from
  the three continuity types — as foundational; add to Amendment Log)
- `docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md`
  (mirror the PDR-011 reframe in the repo-bound twin)
- `.agent/skills/session-handoff/SKILL-CANONICAL.md` §6c (invert the
  "reflective surplus / optional" framing; currently lines ~313–335)

**Files NOT to touch**: consolidate-docs §4 (experience-file audit — adjacent,
out of this lane's scope unless the §6c reframe forces a one-line cross-ref);
other lanes.

**Grounding (2026-05-29).** session-handoff §6c literally reads *"Record
subjective experience (optional). If the session produced a reflective surplus
…"* — the exact framing to invert. PDR-011 names three continuity types
(operational / epistemic / institutional) but never elevates subjective
experience/reflection as foundational; it sits adjacent to epistemic. The
reframe should position reflection as substrate the three types rest on, not a
fourth type (mirror PDR-011's own discipline that state was "not a fourth type").

**SANCTITY.** PDR-011 is a dense, much-amended accepted Core PDR. Agent-author
the amendment, present to owner for review BEFORE finalising. Doctrine leads
(PDR-011/ADR-150), skill follows (session-handoff) — land as one coherent bundle.

**Acceptance (proof: non-code)**:

- PDR-011 carries an Amendment-Log entry + body text framing reflection/
  subjective experience as foundational continuity substrate.
- ADR-150 mirrors it (repo-bound twin stays aligned).
- session-handoff §6c no longer frames capture as optional surplus; capture is
  framed as foundational (the experience-file mechanics remain).
- Owner has reviewed and approved the PDR-011 wording.

**Validation**: `pnpm markdownlint:root`; `pnpm practice:fitness:informational`;
`pnpm portability:check`; owner sign-off recorded.

---

## WS-C — #40 TDD-as-design Practice-Core PDR  `depends_on: ws-readiness`  ⚑ SANCTITY

**Goal.** Graduate the foundational TDD-as-design definition to a portable
Practice-Core PDR so it travels to every Practice-bearing repo; the host
directive `tdd-as-design.md` continues to operationalise it host-locally.

**Owned file scope**:

- `.agent/practice-core/decision-records/PDR-⟨tdd⟩-tdd-as-design.md` (NEW —
  number assigned by `ws-readiness`, deconflicted from PDR-086 reservation)

**Files NOT to touch**: `.agent/directives/tdd-as-design.md` (host-local
operationalisation stays as-is — the PDR records the *decision*, not a restatement);
PDR README index (WS-Z); other lanes.

**Grounding (2026-05-29).** `tdd-as-design.md` carries the full host-local
doctrine (test describes a system state; product code is the path; two halves of
one act of design; atomic-landing invariant; describe-vs-audit blade). No
Practice-Core PDR captures it portably. The PDR records the load-bearing
*decision* concisely (not a re-statement of the whole directive).

**SANCTITY + portability.** Agent-authored, owner-reviewed. PDR body must obey
`practice-core-portability` (no repo paths, no SHAs, no ADR refs in the body —
model on PDR-058/PDR-079 convention). Use `pdr_kind: governance`.

**Acceptance (proof: non-code)**:

- The new TDD-as-design PDR exists, captures the load-bearing TDD-as-design
  decision + atomic-landing invariant + describe-vs-audit blade as portable
  governance, with adopter scope "every Practice-bearing repo."
- Portability clean (no forbidden moving targets / repo paths in the body).
- Owner has reviewed and approved.

**Validation**: `pnpm markdownlint:root`; `pnpm practice:fitness:informational`;
`pnpm practice:vocabulary`; `pnpm portability:check`; owner sign-off.

---

## WS-D — #41 (+#42) reviewers-carry-doctrine Practice-Core PDR  `depends_on: ws-readiness`  ⚑ SANCTITY

**Goal.** Graduate "reviewers carry doctrine, not just audit it" to a
Practice-Core PDR (PDR-087), fold in #42 (the forcing-function read-path is the
*mechanism*, not a separate pattern), and fix the test-reviewer→test-expert
naming drift.

**Owned file scope**:

- `.agent/practice-core/decision-records/PDR-⟨reviewers⟩-reviewers-carry-doctrine.md`
  (NEW — number assigned by `ws-readiness`, deconflicted)
- `.agent/sub-agents/templates/test-expert.md` (naming-drift fix: internal
  heading "Test Reviewer" → align to "Test Expert")

**Files NOT to touch**: PDR README index (WS-Z); other lanes; reviewer template
*content* beyond the naming fix unless the ≥2-instance check requires a minor
alignment note.

**Grounding (2026-05-29).** `test-expert.md` is already shaped as a
doctrine-carrier ("Carrier of the Foundational TDD Doctrine"; mandatory
read-path with recipe/pattern banks; cite-by-section requirement). Confirm the
≥2-instance claim by checking `type-expert.md` and `architecture-expert.md`
carry the same mandatory-doctrine-read-path + citation shape before authoring
(the PDR's evidence base). #42 (forcing-function read-path) is the mechanism
within #41 — do not author it separately.

**SANCTITY + portability.** Agent-authored, owner-reviewed; `pdr_kind: pattern`
or `governance` per the doctrine's shape; portability-clean body.

**Acceptance (proof: non-code)**:

- The new reviewers-carry-doctrine PDR exists, captures reviewer-as-doctrine-carrier
  (with the forcing-function read-path as its mechanism) as portable
  reviewer-authority discipline; ≥2 instances cited (test-expert + at least one of
  type/architecture).
- test-expert naming drift fixed.
- Portability clean; owner reviewed.

**Validation**: `pnpm markdownlint:root`; `pnpm practice:fitness:informational`;
`pnpm subagents:check` (reviewer template change); `pnpm portability:check`;
owner sign-off.

---

## WS-E — #37 + #22+23 PDR-058 optionality family  `depends_on: ws-readiness`  ⚑ SANCTITY

**Goal.** Graduate two optionality siblings that PDR-058 pre-architected:

- **#22+23** → PDR-058 **Surface 3 (outcome optionality)** rule, merged with the
  don't-shoehorn-a-value-claim sibling (PDR-058 explicitly anticipated this
  merge; evidence trail now met — two named instances).
- **#37** (never-bare-"deferred" / sequence-or-admit) → PDR-058 **Surface 4
  (sequencing optionality)**, the sequencing analogue of outcome optionality.

**Owned file scope**:

- `.agent/practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md`
  (amendment: confirm Surface 3 rule graduation; name Surface 4 sequencing
  optionality)
- `.agent/rules/outcome-optionality-falsifiability.md` (NEW — or chosen name) for
  Surface 3
- `.agent/rules/sequencing-optionality.md` (NEW — or chosen name) for Surface 4

**Files NOT to touch**: RULES_INDEX.md (WS-Z owns the index rows); PDR README
(WS-Z); other lanes.

**Grounding (2026-05-29) — HOME CORRECTION.** The Sunlit ledger recommended
extending `no-moving-targets-in-permanent-docs.md` for #37. **That is a category
error**: `no-moving-targets` governs *transient values in permanent docs*; the
bare-deferred doctrine governs *unsequenced statuses in ephemeral plans*. The
correct home is the **PDR-058 optionality family** — PDR-058 §Decision already
names *"sequencing optionality"* as an anticipated adjacent surface. #37 is that
surface. #22+23 is PDR-058's Surface 3 rule sibling, which PDR-058 explicitly
left for its own evidence trail.

**Decide at author time (`new-rule-vs-pdr-clause` + directive-context-budget).**
Whether each surface graduates as a standalone always-on rule or as a PDR-058
clause + a thin pointer is a budget decision the executing agent makes per
`new-rule-vs-pdr-clause`. Default lean: PDR-058 carries the doctrine; a rule
exists only if always-on enforcement earns its context cost. Capture the
sequencing-vs-imaginary-flows nuance: a *specific falsifiable tripwire* ("when
the schema migration lands") is legitimate sequencing; a *vague future
conditional* ("when we get to it") is the bare-deferred / imaginary-flow
violation (cf. `feedback_simple_definite_no_imaginary_flows`).

**SANCTITY.** PDR-058 amendment is Core — agent-authored, owner-reviewed.

**Acceptance (proof: non-code)**:

- PDR-058 amended: Surface 3 rule graduation confirmed; Surface 4 (sequencing
  optionality) named with diagnostic + cure.
- The two surfaces' enforcement homes authored (rule files and/or PDR clauses per
  the author-time budget decision), each with the falsifiable-tripwire-vs-vague-
  conditional distinction captured.
- Owner reviewed.

**Validation**: `pnpm markdownlint:root`; `pnpm practice:fitness:informational`;
`pnpm portability:check`; owner sign-off.

---

## WS-Z — shared-index convergence (single writer)  `depends_on: A,B,C,D,E`

**Goal.** Apply the serialized shared-index edits ONCE, after all content lands,
so concurrent lanes never race the indices.

**Owned file scope (the shared indices)**:

- `.agent/practice-core/decision-records/README.md` — add the two new PDR rows
  (PDR-087 Lane C, PDR-088 Lane D); update PDR-058 status/title if the amendment
  changed it.
- `.agent/practice-index.md` — add two rows (PDR-087, PDR-088) in the
  "No standalone phenotype ADR. Substrate is …" form (per the ws-readiness
  Outcome; this is the canonical PDR↔phenotype bridge, omitted from the original
  WS-Z scope).
- `RULES_INDEX.md` — add any new rule entries WS-E authored.
- `.agent/memory/operational/pending-graduations.md` — remove the six graduated
  entries (#21, #37, #22+23, #40, #41, reflection) with a one-line provenance
  pointer to this plan + the 2026-05-29 ledger; decrement the owner-gated count.
- `.agent/memory/operational/repo-continuity.md` — refresh §Next Safe Steps
  (Group A drained; Groups B/D/E + claim-liveness remain).

**Coordination.** This is the only multi-writer-risk surface. As of the
2026-05-29 ws-readiness gate the PDR README is held by a **live** claim
(Wooded Creeping Thicket, `eef` thread, claimed 06:07Z — NOT expired, and NOT
the Deciduous claim an earlier draft of this paragraph named). Re-read
`active-claims.json` at WS-Z time: that registry is the authoritative
coordination signal, not this prose. If the claim is still live, coordinate or
wait before writing the PDR README; the content lanes (A–E) are disjoint from it
and proceed regardless. Hold a short commit-window claim per
`register-active-areas-at-session-open` §Commit-window claims.

**Acceptance (proof: non-code)**:

- All six register entries removed with provenance; substance confirmed live in
  its graduated home for each.
- PDR README + practice-index + RULES_INDEX rows added; reachability intact.
- repo-continuity Next Safe Steps refreshed.
- Final aggregate gate green; learning-loop run.

**Validation**: `pnpm check` (canonical aggregate);
`pnpm practice:fitness:strict-hard` (consolidation-closure signal);
`pnpm repo-validators:check` (index reachability); run `oak-consolidate-docs` as
the learning-loop touch point.

---

## Non-Goals (YAGNI)

- **Not** executing Group B (route-to-implementation: items 7, 30, 31, 33, 38,
  39, heartbeat-cron, 10/11, 6, 34-rest), Group E forks (item 2 dangling
  reference; item 43 `.git/index.lock` safety-doctrine conflict; item 26
  Core-trinity audit), or the claim-liveness promotion — these are separate,
  surfaced in the handoff.
- **Not** touching the 15 Group C keeps — they remain owner-gated on their
  existing triggers (re-verified 2026-05-29).
- **Not** re-litigating the Group C re-verification.
- **Not** minting always-on rules beyond what the WS-E budget decision warrants.
- **Not** delegating any Core-PDR authoring to sub-agents.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Ledger's Group A "evidence met" is inflated (Group C was 83% wrong) | Each lane re-confirms its home against the live repo before authoring; two homes already corrected (Lane E) |
| Core PDR drafts ship without owner review | SANCTITY lanes (B,C,D,E) gate on owner sign-off in acceptance; they do not self-finalise |
| Shared-index race (PDR README, register) | WS-Z is single-writer and depends on all content lanes; short commit-window claim |
| PDR number collision — `role-emission-citation-binding.plan.md` already reserves PDR-086 | `ws-readiness` re-derives next-free numbers and deconflicts from all live-plan reservations; WS-Z confirms before index rows |
| New always-on rules erode the directive context budget | WS-E decides rule-vs-PDR-clause per `new-rule-vs-pdr-clause`; default lean to PDR-058 clauses |
| Withdrawing register entries loses signal | WS-Z confirms substance is live in each graduated home before removal (knowledge-preservation screen) |

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) — long-term architectural
  excellence; "could it be simpler?" applied per lane.
- [`tdd-as-design.md`](../../../directives/tdd-as-design.md) — Lane C subject; the
  non-code proof contract is honest about test-first-vs-retrospective (these are
  doctrine artefacts, not product code).
- Schema-first not applicable (no SDK/generated surfaces touched) — recorded.

## Plan-Body First-Principles Check

([`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md))

- **Shape clause**: this plan is doctrine-graduation, not product code; the unit
  of landing is an authored artefact with `non-code` proof, not a TDD test+code
  pair. Stated explicitly so the executor does not force TDD-cycle shape onto
  documentation work.
- **Landing-path clause**: each lane lands its content; WS-Z lands the indices +
  register removals. No lane claims completion until its acceptance ids prove out
  AND (for SANCTITY lanes) owner sign-off is recorded.
- **Vendor-literal clause**: not applicable (no vendor call shapes).

## Readiness Reviewers (`ws-readiness` gate)

Before lane dispatch:

- `assumptions-expert` — proportionality and plan-readiness (6 lanes, sanctity
  gating, parallel structure).
- `docs-adr-expert` — Practice-doc/ADR/PDR shape for the two new PDRs + the
  PDR-011/PDR-058 amendments.
- Per-lane technical reviewers as the work shape requires (e.g. `config-expert`
  if any config touched — not expected).

## Lifecycle Triggers

([`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md))

- Session entry: `start-right-quick` / `start-right-team` (team session if lanes
  are dispatched in parallel).
- Claim registration: each lane agent registers its disjoint file scope; WS-Z
  registers the shared-index + commit-window claim.
- Handoff + consolidation: WS-Z runs the learning-loop (`oak-consolidate-docs`);
  archive this plan to `archive/completed/` on completion per ADR-117.

## Source

The owner-ratified decision packet
([`2026-05-28-sunlit-waxing-moon.md`](../../../memory/operational/curator-passes/2026-05-28-sunlit-waxing-moon.md)
§"the decision packet"), the 2026-05-29 re-verification
([`2026-05-29-tempestuous-vaulting-falcon.md`](../../../memory/operational/curator-passes/2026-05-29-tempestuous-vaulting-falcon.md)),
and the pending-graduations register
([`pending-graduations.md`](../../../memory/operational/pending-graduations.md)).

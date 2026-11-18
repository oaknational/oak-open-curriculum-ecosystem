---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# design-system-integration — next-session record

Thread: the AIP-137 design-system integration (ADR-213; plan
`.agent/plans-backlog-2026-07/architecture-and-infrastructure/current/design-system-integration.plan.md`).
First written 2026-07-20 ~06:15Z by Salmon binds Undertow (`de5c10`, claude-code/fable-5)
at a compaction boundary; additive-identity discipline applies — later writers append,
never rewrite. This record owns the HUB-MIGRATION lane's continuation; Caracal wakes
Tunnel (`265648`) and Harrier rides Updraft (`416a38`) own their lanes via their claims,
the plan, and the comms stream — treat every line here as pointer-and-hypothesis and
recompute live state from claims/comms/git at pickup.

## Participating identities (additive — joiners append a row, never replace)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Salmon binds Undertow | claude-code | fable-5 | `de5c10` | first writer (compaction boundary) | 2026-07-20 | 2026-07-20 |
| Caracal wakes Tunnel | claude-code | fable-5 | `265648` | Stage-A import lane | 2026-07-20 | 2026-07-20 |
| Harrier rides Updraft | claude-code | fable-5 | `416a38` | cycle-3 four-theme gate lane | 2026-07-20 | 2026-07-20 |
| Heron seeks Bluff | claude-code | fable-5 | `ef3eb0` | design-system lane (second-generation cast) | 2026-07-20 | 2026-07-20 |
| Foehn rides Flight | claude-code | fable-5 | `3e9afa` | lane successor; fold + Layer-3 distillations | 2026-07-20 | 2026-07-20 |
| Tornado tracks Apex | claude-code | fable-5 | `daace4` | Director — identity-table cure at #434 adjudication | 2026-07-20 | 2026-07-20 |
| Triton mends Void | claude-code | Opus 5 (1M) | `9f070b` | MCP-128 landing lane — design-system consumption in the MCP app | 2026-07-26 | 2026-07-26 |
| Skipper tracks Abyss | claude-code | fable-5 | `4144b4` | MCP-128 lane successor (Lavender→Skipper); executes the owner-ratified #565 restack | 2026-07-26 | 2026-07-26 |
| Schooner binds Trench | claude-code | claude-fable-5 | `5492d7` | MCP-128 restack successor (Skipper→Schooner, PDR-063 at owner word); continues PR-3 from the frozen inventory | 2026-07-26 | 2026-07-26 |
| Thyme weaves Hedgerow | claude-code | claude-fable-5 | `762020` | design-showcase lane (adopted claim `ebb3efe2` from Altair turns Infinity `7a97a1` at owner word 2026-07-29 — Altair held the lane 2026-07-29 unregistered on this table); landed #637 + #641; MCP-372 carrier at owner ruling; deliberate succession → Sycamore herds Xylem `028dc4` 2026-07-30 | 2026-07-29 | 2026-07-30 |
| Moss calls Loam | claude-code | claude-fable-5 | `79b433` | Design-lane seat at direct owner word (Director: Falcon hunts Flight `52841f`); movement 1: PR #710 MERGED `58e5be461` — kit 1.8.0 TS-runtime + choice() on main | 2026-08-02 | 2026-08-05 |
| Corsair hunts Surf | claude-code | claude-fable-5 | `4d3282` | Design-lane successor seat at direct owner word (evening, post-Moss retirement); standby, warm pause — activation gated on the ratified design-system completion plan node + Director/owner word | 2026-08-02 | 2026-08-03 |
| Civet spins Cavern | claude-code | claude-fable-5 | `054f5e` | Design-lane successor (Saffron→Civet, PDR-063 deliberate succession at owner word, Director ACTIVATE 20:46Z); claim `645b9e0b` adopted 20:46Z after the handoff record read end to end | 2026-08-07 | 2026-08-10 |
| Yarrow stirs Undergrowth | claude-code | claude-fable-5 | `ab1066` | Critical-analysis sitting + records-truth pass (MCP-613) at direct owner word; claim `645b9e0b` adopted after the winddown record + this record read end to end | 2026-08-17 | 2026-08-19 |
| Finch calls Pinnacle | claude-code | claude-fable-5 | `c91bd4` | #908 landing seat at direct owner word (merged a8aa13da1); the post-merge Copilot round consolidated through the tango node in the #915 fold; claim `645b9e0b` closed at owner word (no adoption — a fresh claim opens the lane's next pickup) | 2026-09-02 | 2026-09-02 |
| Flounder turns Estuary | claude-code | claude-fable-5-1 | `c5cc2c` | Lead seat at the owner's PR-count-to-zero goal: PR #41 (MCP-613 records-truth pass) landed SHA:8b2b5ee03 after nine review rounds; the seven-item records residue routed on this record §2026-09-05; claim `b627b5af` closed (a fresh claim opens the lane's next pickup) | 2026-09-05 | 2026-09-05 |
| Lavender turns Pollen | claude | fable-5 | `f00cf6` | MCP-128 lane tenure (Triton→Lavender), owner-called handoff to Skipper the same day | 2026-07-26 | 2026-07-26 |
| Altair turns Infinity | claude-code | claude-fable-5 | `7a97a1` | design-showcase lane holder before Thyme: opened claim `ebb3efe2` 14:41Z, handed off at owner word 21:08Z | 2026-07-29 | 2026-07-29 |
| Sycamore herds Xylem | claude-code | claude-fable-5 | `028dc4` | design-showcase lane by deliberate succession from Thyme (~06:20Z); lane paused at a durable point 09:55Z | 2026-07-30 | 2026-07-30 |
| Saffron guards Hedgerow | claude-code | claude-fable-5 | `8a4280` | design-lane seat before Civet: merged post-#782 main into the #729 branch; froze the lane to handoff record `645b9e0b` at the succession | 2026-08-05 | 2026-08-07 |
| Swordfish wakes Trench | claude | Opus 5 | `d0274e` | design-lane successor to Civet: plan outline, σ-calibration slice design, S2b, W1 fleet, cure arc; owner-called close 2026-08-13 | 2026-08-10 | 2026-08-13 |
| Skua binds Leeward | unrecorded | unrecorded | `e2b222` | compaction and wind-down seat; merge drive live mid-freeze; claim `645b9e0b` retained stopped-seat-held | 2026-08-13 | 2026-08-14 |

_Re-shaped to the PDR-027 columns at the 2026-09-07 consolidation (Director ruling 1920a22f). For the
original rows, first_session is the row's own date (Thyme's is the 2026-07-29 adoption the row names) and
last_session is the latest dated section of this record naming the seat. The six rows after Flounder's are
rebuilt from sources: Lavender's tuple from §Session update 2026-07-26 (Lavender turns Pollen); Swordfish's
from the standby registration under §COMPACTION FREEZE 7 (2026-08-10T06:55Z) and the §SESSION CLOSE 2026-08-13;
Altair's and Sycamore's from claim `ebb3efe2`'s registry history (opened 2026-07-29T14:41Z, adopted by Thyme
that evening and by Sycamore on 2026-07-30) and Sycamore's closed claims of 2026-07-30; Saffron's from the
closed claim of 2026-08-05T15:03Z and the 2026-08-07 succession record `645b9e0b-design-lane-saffron-to-civet`;
Skua's from §COMPACTION FREEZE + WIND-DOWN STATE (2026-08-13), the 2026-08-14 landing and wrap-addenda
subsections that close the seat, and the wind-down record `645b9e0b-design-lane-winddown-2026-08-13`. `unrecorded` marks a value no source names._

## Where the current state is

The lane is at rest since PR #41 landed (2026-09-05, `SHA:8b2b5ee03`). No claim is open on it; the
next pickup opens from a fresh claim and is either T1a-ii of the tango node (the pack contract) or
the records residue in §Session update 2026-09-05 below, whichever the owner's word names. The
plans are the authority for sequencing and acceptance, never this record: the strategic node
`.agent/plans/strategic/design-system-as-configured-framework.plan.md` (ratified 2026-08-05); the
delivery nodes `tango-identity-pack.plan.md` (ratified; P1 to P7 rulings; T1a-i landed as #909),
`oak-identity-recognisability.plan.md` (ratified via #875; the rulings table R1 to R16, the σ
calibration and the n_eff true-up of event 4b5afe31), `design-showcase-experience.plan.md`
(ratified 2026-08-13), `showcase-information-architecture.plan.md` and
`public-digital-service-identity.plan.md` (ratified, AC4 open). Archived plans, nothing open:
`design-system-completion` (v2.2, superseded by the delivery nodes), `identity-switchboard-first-pixels`
(the owner's verdict of 2026-09-06 met its criterion) and `pr-846-review-fleet`. Doctrine: ADR-213
(§2 and §4 dated amendments), ADR-217 (amended 2026-07-31), DDR-003, DDR-009, DDR-010, DDR-011,
DDR-012, PDR-137, PDR-138; `docs/design/design-review/rubric.md` (v0.1 recalibration owed before any
blocking verdict); the fidelity register. Instruments on main: `packages/libs/fidelity-review`
(#835, #846; `visual-correlation` from S2b), the wow-verdict register validator (#830, #831),
`pnpm tool:visual-probe` and the `visual-verification` skill (#887).

The journal from 2026-07-20 to 2026-09-02 (the Stage-A import and hub migration, the MCP-128 landing
page and its restack, the design showcase, the kit runtime, the completion plan's authoring and
review rounds, W0 first light, the identity switchboard and its review fleet, the critical-analysis
sitting, the tango node and the demo-day merge drive) was curated on 2026-09-20 by graduate, then
archive. The whole pre-curation record is preserved at
`.agent/memory/operational/archive/design-system-integration-thread-2026-09-20.md`, byte-identical
to the record committed at `SHA:9c3c4dfbd` (blob `c19df5e90`); the section names the identity note
above cites resolve there. It was read by the split method (nine analysts over nine pieces, the join
by grep), every pull request the journal left in flight was checked at its merge commit, and every
item found open with no other home is kept below in its own words. The lessons of the journal were
found homed before the move: the rendered-proof doctrine in PDR-138, DDR-011 and
`visual-verdicts-require-rendered-proof`; the calibration method in DDR-010; the identity ontology
(no shared narrow base; identity a build-time axis, theme the runtime axis) in DDR-012 and the tango
node's P6 and P7 rows; the mutation-testing method in `development-practice.md`; the motion `-full`
token stance in the tango node's admission rules.

## Landed arcs (the journal's sections, by their merge commits)

- Stage A and B and the hub migration (2026-07-19/20): #410 (ADR-213), #412 `SHA:6631bb5ac`, #413
  (the hub consumes `@oaknational/oak-design-system`), #424 Stage-B exploration `SHA:728974bc1`,
  #431 kit robustness `SHA:2ef5ee3bd` (1.7.1).
- MCP-128 landing page (2026-07-25/26): #565 superseded by the owner-ratified six-PR restack;
  #578, #580, #583 (stack 3/6) landed; the tail (PR-4 to PR-6) was not built and #709 closed at the
  completion plan's ratification with a value-transfer pointer; ADR-217 §1 amended 2026-07-31.
- Design showcase (2026-07-29/30): #637 `SHA:886bb8d28`, #641 `SHA:8675bf11e`, #650 `SHA:094b7a145`;
  #644 closed with a pointer.
- Kit runtime and the docs pass (2026-08-02): #710 `SHA:58e5be461` (1.8.0), #715 `SHA:81decaa3b`
  (`@oaknational/oak-design-react`), #719 `SHA:b3efa938e`, #720 `SHA:5fef92640`, #721 `SHA:c87d31454`.
- Completion plan v2.2 and the strategic node (2026-08-02 to 08-08): the node ratified 2026-08-05;
  #729 (PDS census validator) `SHA:70ab17249`; the review-debt queue discharged 2026-08-08 (#787,
  #814, #820 to #824; #737 `SHA:67d23056e`); #828 (combined-window cures) `SHA:7ecfc187c`, on which
  the owner gave the implementation word.
- W0 first light (2026-08-08/09): #829 (the W0.2(a) zero-red baseline) `SHA:4e1bb0fc3`; #830
  `SHA:8840c3c8f` and #831 `SHA:f1192ce22` (W0.7: rubric v0 and the wow-verdict register, calibrated
  blind); the W0.1 census artefacts conserved (§Consolidation fold 2026-09-06 below); W0.9 (hub
  pre-read) never run, its plan archived.
- Identity switchboard (2026-08-09 to 08-14): #835 (the fidelity-review library) `SHA:365a6f7c7`;
  #834 (PR-1b) `SHA:6804726e2`; #845 (the design-system-usage skill move); #846 (PR-2: the switchboard,
  S2a/S2b calibration, fleet W1/W2, the cure bundles) `SHA:c0d49fc04`; #885 `SHA:a73f99f77`; #887
  `SHA:d6b0c7eb0` (PDR-138, DDR-011, the rendered-proof rule and skill); #873/#875 (the two plans
  ratified), #874/#876 (PDR-137); the pickup rows of the wind-down: row 1 (R16) and row 6 landed,
  rows 2 to 5 below.
- Critical analysis, the tango node and the demo-day lanes (2026-08-17 to 09-05): #907
  `SHA:c59c1c47c`, #909 `SHA:f2bde54bb` (T1a-i), #908 `SHA:a8aa13da1` (the tango node, DDR-012;
  2026-09-02), #915 (fold) `SHA:777e9131c`; the Oak-line #910 landed on this line as #41
  `SHA:8b2b5ee03` (the MCP-613 records-truth pass) and #912 as #40 `SHA:d189b7d58` (the visual
  feedback round). The scrap branches are deleted. Claim `645b9e0b` closed 2026-09-02.

## Open items the journal named, with no other home

1. `packages/libs/fidelity-review/src/png-codec.ts` `cropToHeight`: the guard refuses only a
   height taller than the source, so a negative `newHeight` reaches `Uint8Array.slice` and returns
   a wrong-dimension crop as success (wind-down pickup row 2, 2026-08-13; verified at source
   2026-09-20). A small bounded cure with its cell.
2. `agent-tools/src/pr-watch/check-rollup.ts`: an undated PASSED run loses to a dated PASSED tie;
   the suggested cure is to retain the undated survivor on equal rank (pickup row 3, 2026-08-13;
   the module header does not state the tie rule, so unverified 2026-09-20).
3. The kit charter's unconditional "visible skip links" clause (`packages/design/oak-design-system/CLAUDE.md`,
   the keyboard line) against the two cured demo pages: the disposition is specified in
   `.agent/reports/design/design-lane-critical-analysis-2026-08-17.md` §Skip-link charter
   disposition (narrow it, dated, to SC 2.4.1's trigger plus two local rules) and is not applied
   (pickup row 5, 2026-08-13).
4. The owner-private Tango reference materials (`.agent/reference-local/tango-identity-anchor/`):
   re-verify presence at the T3 pickup (2026-08-17).
5. Defect tickets minted at the 2026-08-12 main-absorb, to read at the next cycle open: MCP-586 (a
   card-link accessible name void, High) and MCP-587 (a dense token below the 44px floor).
6. The studio sync-back list's motion-cascade item (2026-07-20): `components.css` belt-and-braces
   defeats `data-motion='full'`; the cure choice is owner- or studio-gated under ADR-213's sync-back.

## Session update 2026-09-05 ~16:0xZ (Flounder turns Estuary, c5cc2c — additive; PR #41 records-truth pass at its final content head SHA:940cbce32; the records residue after the second step-back, routed here)

- **What #41 lands (content head SHA:940cbce32; sync merge SHA:be8f700d5 over engraph SHA:7cd25a921):**
  the design plan's landed-state rows and R16 (owner verbatim; seat gloss narrowed to one
  identity's CSS per served page, the multi-tenant reading labelled a seat reading); the
  showcase IA plan's A1/A2 rows as landed in part with the open remainder named (no route
  registry; no fifteen-cell computed-style proof); the Public Digital Service identity plan
  back in `delivery/` as ratified with AC4 open; two tombstone rows removed from the decision
  log; DDR-009/010, ADR-213, the rubric and the preservation README re-trued. Nine review rounds:
  the PDR-140 step-back fired at round four and a second time at round seven, which ended
  fix-pushing on this lane; rounds eight and nine were dispositions.
- **Records residue after PR #41 — one follow-up bundle for the design lane's next records
  PR (first act of whichever seat next edits these plans):**
  1. `design-showcase-experience.plan.md` relationship inventory: the row for
     `public-digital-service-identity` still reads archived with records-only residue; the
     plan file is ratified with AC4 (archive audit, census emptied, validator strict) open.
     Re-true the row to the plan.
  2. `showcase-information-architecture.plan.md` §sequencing (~line 89): the ratification-time
     paragraph (A2 starts at ratification; W4.4 re-homed from `design-system-completion`) sits
     beside the amendment that supersedes it. Rewrite as the current sequencing of the
     remaining A1/A2/A3 work when that work is picked up.
  3. `archive/identity-switchboard-first-pixels.plan.md`: archived with its `owner-held`
     browse-verdict criterion unmet (the wow-verdict register's only showcase row is the
     earlier `/` FAIL). Same class as the rename plan: return it to `delivery/` as ratified
     with the owner-held verdict named open, or the owner records the verdict.
     **Owner verdict 2026-09-06, verbatim: "The switchboard is wow enough for today. It will
     need to be more wow in future."** The criterion is met: the owner viewed every identity ×
     theme cell ("obviously I looked at all the combinations"), and the register row (a pre-read row:
     no instrument legs ran) covers all fifteen; the node stays archived with nothing open
     at the owner's word.
  4. `docs/design/design-review/rubric.md` reading-order exemption: implements R13; refine
     it to recompositions whose reading and focus narrative stays coherent (R13 × R15), with
     the accessibility reviewer's pass, and re-true the consuming guide's reading-order
     clause to the same synthesis. Falsifier: an inverted composition passing seven criteria
     while its focus order contradicts its visual order.
     **REJECTED by owner ruling 2026-09-06, verbatim: "We do NOT allow design by review in
     PRs, we have a vision that PR bots have no visibility of. Of course visual design should
     be blooming coherent, that is not in question, but the fact that the mechanism is capable
     of producing incoherent designs is not a failure, it is power, that must be used
     appropriately and well, the reviewer is mixing concerns myopically."** The exemption
     stands as it implements R13; no refinement is owed, and no design-intent finding from a
     review bot is carried as residue on this lane again.
  5. `public-digital-service-identity.plan.md` body (~lines 192–194 and 264–268): the
     sequencing still says the rename precedes `design-system-completion` implementation
     and calls that node "this seat's executing node" with a future PR4 true-up; the same
     PR archives `design-system-completion`. Re-true to the archived/current relationship
     with PR5's tail as the only open item.
  6. `demos/oak-design-showcase/README.md` (`/tokens/colours` line): the route renders the
     four palette themes (light, dark, high-contrast, colour-safe) plus each identity's
     default, not every identity × theme; `system` (match-device) is not a column. Say so.
  7. `docs/design/design-review/rubric.md` calibration authority: (a) blocking is restored
     on a recorded v0.1 calibration with no measurable acceptance threshold — define one
     (miss rate and false-positive bound) and restore blocking only when it is met; (b) the
     v0 calibration record's restaging recipe copies the current `app/page.tsx`, which is
     now the replacement landing, so the owner-rejected MUST-FAIL specimen cannot be
     re-staged — commit a stable fixture or relabel that cell. Both with the accessibility
     reviewer's pass alongside item 4.
  Each item was dispositioned on the PR with its falsifier (Codex rounds eight and nine,
  15:44Z–16:20Z) and resolved under the bot; none was pushed, by the lane's binding.

## Consolidation fold 2026-09-06 (Juno seeks Apogee, a693fb — additive; three seeds from the 2026-08-18/19 window, homed here for the lane's next records PR)

- **Lead an owner demo with the falsifier.** Showing a defect DIE on camera (the
  reduced-motion leak, 2026-08-18) turned it into narrative capital; a demo that opens on the
  failing case and closes on the cure carries its own proof. One instance; a
  demo-preparation note for this lane's plan estate if it recurs.
- **Shared callback identity plus DOM dedupe is teardown theft.** Subscribers sharing one
  upstream callback register identical (type, callback, capture) tuples; the DOM
  deduplicates them, so one subscriber's `removeEventListener` deletes the registration
  everyone depends on. Per-subscription wrapper identity makes tracked removal safe. Home
  when the surface exists: the design-react package's implementation notes (the disclosure
  code is not on this branch).
- **The forced-colours radio regression has no automated sensor.** axe disables its
  colour-contrast rule under forced colours, so that regression class is caught only by a
  rendered read (2026-08-18); a known limit for the accessibility practice's rendered-proof
  step.
- **W0.1 census artefacts conserved (2026-09-10, the Director's safety sweep; commit 0e59bafa9,
  the August draft that was PR #918 on the upstream line, never merged):** the
  cycle plan v2 and the hand-authored types scaffold from the 2026-08-09 sitting live as dated
  historical artefacts at `.agent/reports/design/w01-census-cycle-plan-v2-2026-08-19.md` and
  `.agent/reports/design/w01-census-types-scaffold-2026-08-19.md`; nothing there is sanctioned
  (the completion plan is archived), and re-sanctioning a census is an owner call. A review
  note for any re-sanctioned cycle: the scaffold's census contract puts run-specific provenance
  (`generatedAt`, `sourceCommit`) inside the payload it requires to deep-equal a fresh derivation,
  so the validator cannot pass across runs as written — provenance belongs outside the compared
  payload (Copilot on #122, 2026-09-10; the artefact is preserved as authored).

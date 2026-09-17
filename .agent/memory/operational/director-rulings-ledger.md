---
fitness_line_target: 300
fitness_line_limit: 400
fitness_char_limit: 32000
fitness_line_length: 115
fitness_content_role: reference
merge_class: index-narrative-tables
drain_strategy: >-
  Drain ritual (declared at birth, per the redesign plan's generator cure): a row is APPENDED when an owner
  ruling is captured, DISPOSITIONED in the same edit or the same day, and COMPRESSED to its home pointer once
  the corresponding historical block leaves the live handoff surface. Expired/superseded rows compact to the
  archive section at each fold. This file proves homing; it never stores ruling substance.
---

# Director rulings ledger — capture-to-homing proof

The tracking surface created by
[`director-continuity-surface-redesign`](../../plans/delivery/director-continuity-surface-redesign.plan.md)
(S2). **Ledger, not home**: every owner ruling captured on the Director lane
gets a row here proving it reached a durable home; the substance lives in the
home. Row sources: the 2026-08-13 read-only inventory of
[`director-handoff.md`](director-handoff.md) §CURRENT HANDOFF STATE
(~90 rulings, lines 263–1631 at `f69ca9f0c`) and the 13-leg verification
fleet (run `wf_c5bddb5d-466`, all homes opened first-hand, authority traced).

Authority classes: `owner-verbatim` (quoted, dated) · `owner-paraphrase`
(owner word reported) · `owner-relayed` (external word the owner endorsed) ·
`seat-inference` (a Director/implementer reading) · `plan-prose`. Verdicts:
`HOMED` (home verified first-hand) · `THIN` (home exists, named substance
missing) · `UNHOMED` (no home; queued S3) · `EXPIRED`/`SUPERSEDED`/`EXECUTED`
(dated historical fact, needs no home).

## Homing queue (UNHOMED — plan S3 executes these)

| Row | Ruling | Authority | Proposed home |
| --- | --- | --- | --- |
| L1612a | System residue (.DS_Store): gitignore AND delete on find (owner, 2026-08-01 era) | owner-paraphrase | new always-applied rule via `new-rule-vs-pdr-clause` |
| R46 | Display name "Oak National Academy"; machine name `oak-open-curriculum`; asymmetry deliberate (owner, Spark tenure) | owner-paraphrase | naming section in the plugin contributor doc (MCP-3xx surface) |
| SPARK-5 | Tool descriptions governed: stale anchor + semanticSha256; one validator problem per run; hashes only from validator output | seat-inference | fold into per-user memory `mcp-agent-facing-content-audit` (existing audit-mechanics home) |
| C-971 | "Self-limits are gated on ASKING, never silent" (owner, 2026-07-28, line 971) — critic find, missed by the inventory | owner-verbatim | first-hand read then rule-route via `new-rule-vs-pdr-clause` |
| C-357 | ESM ruling: zero `require`; dynamic imports error-with-recorded-exemptions (owner, 2026-08-09, line 357) — critic find | owner-verbatim | first-hand read; candidate `source-is-typescript-esm-only` rule amendment |
| C-690W | Graph-tools strictness ruling with verbatim scope fence "I don't want to replace the hand authored checks just yet" (owner, 2026-07-28 ~15:1xZ, 690–1100 window) — critic find | owner-verbatim | first-hand read; route to the graph-tools lane's plan/thread |
| OVN-1 | Overnight operating order (owner, direct at the Director seat 2026-08-17 ~19:4xZ, verbatim): "I am going to bed. Please keep the team moving usefully, and when they can't do that without me have them stand down, once they are both down you standa down as well" (sic) — lanes run owner-independent work only; owner-decision items become morning cards; each lane closes out (broadcast + heartbeat-end + explicit claim disposition) when its remainder is owner-gated; Director wraps and stands down LAST after both lanes are down | owner-verbatim | operationalised in canonical broadcast 2026-08-17 ~19:47Z (this seating); expires at the owner's morning word |
| OVN-2 | PR #889 conditional merge word (owner, direct at the Director seat 2026-08-17 ~19:5xZ as he left for the night, verbatim): "If you can safely merge <#889> then great, it might need some updates after the recent architecture fleet work" — merge is authorised BEHIND two riders: (a) safety (hold lifted, checks trustworthy post-incident, threads resolved, review rounds honest), (b) content-truing check against the architecture-fleet outcomes (the workspace-basis reground, the 1a/1b incumbent refutation, the Toolkit Atlas baseline) before the button — "might need updates" is the owner's own flag, so the truing check is part of "safely" | owner-verbatim | routed to the repo-architecture lane (Poppy) via ARC ~20:0xZ — at the all-clear if their seat is up, else first act of their morning pickup; NOT a morning card (word already given; execution only) |
| NAUT-1 | Survey round-2 "grounded adjudication" CANCELLED at owner ruling ("the programme guessed at owner-class questions" — kin memory `owner-intent-is-not-a-discovery-target`); the lane's governing work is the owner's FIVE-POINT repo-architecture brief given verbatim at the Poppy seat 2026-08-17 evening (toolkit-is-the-product; not-privileged existing architecture; thinnest Oak-specific workspaces; standard-pattern extraction at library-grade incl. perf testing; lifecycle-partitioned packages; deliverable = ONE artefact, rendered diagrams: current baseline + one per suggested change); "some salvageable things" — fleet-era salvage enters as ordinary evidence, no privileged status | owner-verbatim | brief verbatim in per-user memory `repo-architecture-brief-toolkit-five-points` + handoff record 95a0678d §4a + Nautilus pre-positioning broadcast f442ec5e (round-2 cancellation of record); lane execution → Poppy at their Moment 2 |
| POPPY-1 | Three-part ruling at the Poppy seat (2026-08-17 ~17:0xZ, verbatim in capture event 901c311f, provenance traced first-hand there): (1) the four demonstration identities are IDENTITIES, never "brands" (referent-scoped — Oak National Academy's real-world brand in the licensing model keeps the word; capture-copy import artefacts are historical, not rewritten); (2) distinctness is the system's constitutive purpose (same markup, utterly different visual identity); (3) the showcase R4 narrow-sameness consequence is VOID FROM BIRTH — attribution drift (inference wearing verbatim clothing, inscribed 96115d142 2026-08-13), never owner word — re-classing the queued design cure from supersession-note to attribution-correction+void | owner-verbatim | R4 cure re-class + downstream carriers (glossary row, acceptance test, narrow-copy tripwire, damage re-exam) → design lane, routed via the design ARC channel 2026-08-17 ~17:1xZ; brand→identity vocabulary truing candidates → board item 12 (scope widened by ruling 1); attribution-drift SECOND worked instance in five days → board item 7's authority-class-tagging warrant + a mechanical rulings-table check candidate (every owner-attributed clause carries a verbatim quote or a seat-reading mark, nothing in between); correction-cascade detection lesson (a rule that keeps shrinking under correction was never owner word — trace provenance at the FIRST correction) → next consolidation pass |

## Thin-home queue (THIN — named missing substance; S3 judges each)

| Row | Home that exists | Missing substance |
| --- | --- | --- |
| R4 | Linear INFP-8 footnote + per-user memory `linear-mcp-team-and-project-hygiene` | cross-project MCP↔infra linked-ticket discipline as standing practice |
| R14 | rule `present-verdicts-not-menus` | the fixed-external-deadline mobilisation-verdict specific |
| L1578 | `agent-collaboration.md` peer-dialogue doctrine | the explicit any-to-any second-opinion standing grant |
| L1610 | per-user memories `merged-work-is-preserved…`, `standard-git-only…` | the queued dedicated repo doctrine home was never minted |
| CLERK-459 | Linear MCP-507/270/271 comments | release-build-does-not-orphan clarification; cutover-commitment framing |
| FOLD-852 | napkin ~2719–2725 + handoff line 318 | durable standing home for the content-substance boundary (both carriers are rotation buffers) |
| SPARK-4 | napkin 1541–1551 + code SSOT `current-source…` | 728-vs-717 two-surfaces trap prose home |
| SPARK-7 | napkin 1556–1559 | CI-drops-webhooks instrument fact (recurring false-transient reads) |
| SPARK-8 | napkin 1566–1574 + MCP-528 → `seat-register-liveness-separation` plan | scratchpad filename-collision cure as standing practice |
| 2KINDS | distributed (handoff block conventions + PDR-117) | the crisp inheritable-vs-recomputed content-class statement lives only in a superseded block |
| C-BRIEF | brief lines 1–262 (handover-artefacts-batched ruling 2026-07-15 and companions) | critic find: brief-embedded rulings never inventoried — first-hand pass owed |

## Homed (verified first-hand by the fleet; compact — the home is the evidence)

| Row | Ruling (compressed) | Authority | Home |
| --- | --- | --- | --- |
| R2 | supertest classifies by boundary | owner-verbatim | `testing-strategy.md` ~319 + testing-patterns §classification |
| R3 | Copilot standing at PR-open | owner-verbatim | per-user memory `copilot-standing-for-source-prs` |
| R6 | /mcp* collapse gated on client-compat | owner-verbatim | MCP-344 (ruling + evidence + 2026-08-04 decision comments) |
| R7 | nothing hardcoded; URLs derive from instance; www canonical | owner-verbatim | MCP-307 + MCP-351 (+PR #635) + INFP-8 |
| R8 | avoid WAF skip rules (JR, owner-quoted) | owner-relayed | INFP-4; kin rule `never-disable-checks` |
| R10 | hold project goals, not activity | owner-verbatim | MCP-355 (commission verbatim + design sketch) |
| R11 | DoD in every ticket + strict change ceremony | owner-verbatim | MCP-356 |
| R13 | additions never subtract capabilities | owner-verbatim | per-user memory `additions-never-subtract-standing-capabilities` |
| R16 | review-ratchet two-axis, tally ~4 rounds | owner-verbatim | per-user memories (ratchet + batch-disposition) |
| R17 | blocking owner asks are ALWAYS cards | owner-verbatim | per-user memories (route-owner-blockers; decisions-as-questions) |
| R18 | colleagues run on trust, never chased | owner-verbatim | per-user memory `colleagues-run-on-trust-never-chased` |
| R19 | lane handovers get wrap-grade ceremony | owner-verbatim | PDR-063 + session-handoff/wrap skills |
| R20 | every consumed value from the design system | owner-verbatim | rule `design-values-come-from-the-system` |
| R21 | milestones simple, completable, visible | owner-verbatim | per-user memory `milestones-propose-agree-never-dangle` |
| R22 | no change freezes | owner-verbatim | per-user memory `no-change-freezes…` |
| R23 | structure over vigilance | owner-verbatim | per-user memory `structure-over-vigilance-owner-principle` |
| R24 | falsifiable structure at the surface | owner-verbatim | per-user memory `falsifiable-structure…` |
| R27 | cricket duos → superseded by quartet | owner-verbatim | per-user memory `cricket-two-ab-pairs` (current form) |
| R28 | TS exceptions a high, high bar | owner-verbatim | rule `source-is-typescript-esm-only` + typescript-practice |
| R29 | isitagentready results all ticketed | owner-verbatim | MCP-422…427 (+421) |
| R30 | front-door cross-linking first post-submission priority | owner-verbatim | MCP-421 |
| R36 | MCP-420 override contingency armed-not-executing | owner-paraphrase | plan `upstream-api-override-contingency` |
| R42 | commit-push-merge makes understanding safe | owner-verbatim | rule `coordination-branch-24h-lifetime` |
| R45 | work logged in Linear (nuanced 2026-08-07) | owner-verbatim | per-user memory `linear-ticket-first-dora-tight` |
| R47 | MCP-339 sign-off recording owed → DISCHARGED | owner-paraphrase | MCP-339 Done, discharge comment 14df71e6, 2026-08-13 13:23Z |
| R48 | plugin reduced to seven components | owner-verbatim | MCP-524 + MCP-526 (+523 reduction record) |
| R51 | no agent submits connector/plugin — human only | owner-verbatim | strategic plan `first-major-release` (fleet-found home) |
| S615 | tests never test config | owner-paraphrase | per-user memory `tests-prove-behaviour-not-configuration` |
| S617 | Copilot grant discriminator = requesting credential | owner-paraphrase | per-user memories (copilot path + standing) |
| S622 | upstream defects to Aakesh, never fixed by us | owner-paraphrase | upstream-api-alignment thread + update skill |
| L1579 | every fold carries product-gravity line | owner-paraphrase | rule `coordination-branch-24h-lifetime` Action 3 |
| L1590 | latest-schema-version-only | owner-paraphrase | PDR-050 §latest-schema-version-only |
| L1597 | Sif ratified; authority-through-repetition class | owner-verbatim | skill `oak-sif`; per-user memory `verdict-momentum…` |
| L1599 | theatre-hypothesis + three-territories | owner-verbatim | concept-journey report 2026-08-01 |
| L1606 | Sif naming | owner-verbatim | skill exists |
| L1612b | skills standardised; "no standard" off the table | owner-paraphrase | plan `skills-estate-organisation` |
| L1627 | skills two channels only | owner-verbatim | rule `capability-landing-decision-procedure` §Source channels |
| L1628 | seven card answers (W2.7 tilt etc.) | owner-verbatim | napkin archive 2026-08-06 (1582–1614) + plan `design-system-completion` |
| L1630 | Matt-run quiesce + n=2 card discipline | owner-verbatim | start-right §6a (temporary block) + per-user memory `owner-cards-are-visible-ui` |
| MAG-1 | drive PRs to zero (drafts count) | owner-verbatim | per-user memory `open-prs-merged-closed-or-owned` |
| MAG-2 | downtime → tell Director | owner-verbatim | per-user memory `downtime-offers-pr-merge-help…` |
| MAG-3 | design mandate + wow bar → superseded by tight scope | owner-verbatim | plan `design-system-completion` §Direction; per-user memory `showcase-tight-scope-2026-08-13` |
| MAG-4 | iteration local; Claude Design owner-instigated only | owner-verbatim | napkin 2700–2717 (no-studio-sync + dormant-retained) + MCP-588 |
| MAG-5 | counter-brand off-horizontal delta | owner-verbatim | plan `design-system-completion` (point 9 + gate provenance) |
| MAG-6 | PDS identity refocus (rename from the outgoing identity) | owner-verbatim | plan `public-digital-service-identity` |
| SPARK-6 | /mcp landing 406 without Accept: text/html | seat-inference | ADR-046:22 |
| PETREL-ERA | bot identity every write; mint-fails-stop; never-squash; sha-pins; suppressed-findings; pathspec; --body-file; zero-new-Sonar | owner-verbatim (class) | always-applied rules + per-user memories (fleet spot-checked) |
| OAK-ID | Oak identity instantly recognisable (canonical refs) | owner-paraphrase | plan `oak-identity-recognisability` §Goal (merged PR #873) |
| CBC | claim-before-check pattern | seat-inference | rule `verify-dont-trust` §Name the Instrument (`360214de9`) |
| L1610F | retention: nothing safe until remote version control | owner-verbatim | rule `worktree-hygiene` clause 1 (`ef8608d8e`) + per-user memory |
| M2-LESSON | 2026-06-25 premature-Moment-2 UTC lesson | seat-inference | handoff brief lines 36–41, 81–112 (permanent header — stays) |
| ROT-BANNER | curation-pass shape: disposition per block, archive-not-delete | seat-inference | rule `knowledge-preservation-over-fitness-warnings` |
| SURVEY | corpus+estate; deconstruct-first; census-first; WS9 co-design; gates DISCHARGED at owner word 2026-08-14 ("Go — run the survey lane"); census round 1 delivered on PR #889 and the owner card returned NOT-YET-SUFFICIENT with the decomposition directive (considerably thinner oak leaves, SDK/codegen chain split on at least two dimensions, generated/non-generated separation, per-subject transformation-consumer-lifecycle analysis; the mixed-only thinnest-slice restriction superseded by this word) — round 2 directed and running; rounds 1+2 COMPLETE and criterion 4 SATISFIED at the ~15:3xZ card (decomposition target 34→66 workspaces, one lifecycle each, generated output to `packages/generated/`; directory taxonomy adopted: codegen/generated/search/mcp/graph roots) | owner-verbatim (card answers banked in the census plan amendment trail `4b7a72190`); 2026-08-17 REGROUND: the 34→66 decomposition target and the round-2 taxonomy adoption are RE-GRADED to historical data at the owner's word ("the original target architecture was WRONG") — zero deference weight in any brief, prompt, scorecard, or verdict; governing record `.agent/research/workspace-basis-regrounding-2026-08-17.md`, read first-hand at this annotation; the landscape-survey node is the primary search instrument, ungated | survey plan nodes (discharge `fe9974a87`; cards in the census amendment trail) |
| WSREORG | `workspace-reorganisation-programme` strategic node RATIFIED at the owner's card direct to the survey seat (2026-08-14 ~15:4xZ, answer "Ratify"; stamp verified first-hand at `c9626a7b9`): one programme node serving TOOLS-2, per-tranche delivery nodes at pickup, the 9 challenger-unbacked inventory entries confirm-or-drop at their tranches | owner-verbatim (card, stamp verified); 2026-08-17: the programme NODE stands ratified, but its target inventory is re-graded to historical data per the same-day reground (see the SURVEY row's 2026-08-17 annotation and `.agent/research/workspace-basis-regrounding-2026-08-17.md`) | strategic plan `workspace-reorganisation-programme` |
| PROF-FILTER | profanity filter with FIXED HASHES for the target words — verbatim: "we need a profanity filter, and we need a fixed hash for the target words, not to keep them secret, just so the repo doesn't have an umusingly rude file -- that can be an in-repo plan, no linear ticket" (2026-08-17, direct to Director) | owner-verbatim | in-repo plan node to AUTHOR (routed at the 2026-08-17 freeze; not yet authored); no Linear ticket by his word |
| SKILLS-FIRST | skills lane completes FIRST, through evals on every Practice skill — verbatim: "finish the skill work first, including getting to the point where all Practice skills have evals" (2026-08-17, direct to Director) | owner-verbatim | task #10 + skills-estate-organisation plan (WS8 evals + pilot convention), every lane quantifier ranging over the Practice corpus `.agent/skills` ONLY — scope trued 2026-08-17 at the owner's word ("ONLY about `.agent/skills` and not at all about `plugins/oak-open-curriculum`"); sequences AHEAD of the profanity-filter work; queue head superseded same day by XPLAT-4 |
| THROTTLE-RET | the 2026-08-13 ≤2-subagent quota throttle is retired — verbatim "drop the quota limit, that applied to a specific situation on a different day" (2026-08-14, via the survey seat's decision card, verified first-hand at `fe9974a87`); no standing concurrency cap | owner-verbatim (relayed, verified) | ARC entry at `fe9974a87`; per-user throttle memory deleted this seating |
| COLD-PAUSE | any agent with no active work for an hour goes into cold pause — verbatim "any agent that has no active work for an hour should go into cold pause. This is to prevent the monitors draining tokens for no value" (2026-08-14, direct to Director) | owner-verbatim | rule-estate cure routed (watcher/liveness rule family); relayed on the survey ARC channel; Director instruments tightened same hour |
| QUEUE-LOCAL | commit queues are LOCAL-MACHINE state, never in version control; split out of active-claims.json into per-intent event files like the comms store, entries carry a 1-hour TTL, `list` is a view over the directory; the queue is legacy-use under the worktree model — four-point ruling 2026-08-17 direct to Director, with "split it now and plan the work now and carry it out now" | owner-verbatim | executed same hour: interim split live (4.4MB→4KB, the legacy blob retained loss-free at the gitignored `archive/commit-queue-legacy-2026-08-17.json` until the MCP-612 landing's verification read, then owner-disposed; claims byte-preserved, both CLI readers validated across an atomic candidate swap); plan `commit-queue-local-ephemera` + MCP-612 + build dispatched; supersedes F-163's archive-action cure shape |
| 774 | #774 illustrative, never merge-queued | owner-verbatim | napkin 3270–3277 + thread record HELD row |
| FIX-LOW | fix at the lowest effective level | owner-verbatim | per-user memory `fix-at-the-lowest-effective-level` |
| XPLAT | cross-platform node ratified; research precedes work ("stamp it now, it will need further research before work on it begins") | owner-verbatim | strategic plan `cross-platform-compatibility` (stamp + §Delivery rider) |
| XPLAT-2 | no-vendor-structural-dependence constraint is the owner's, ESTABLISHED in ADR-225 at review (2026-08-14) — never citable as pre-dating it; MUST forward-scoped, priors (ADR-074/076/219/162) not retroactively bound | owner-verbatim (card) | PR #886 comment 5290518682 → ADR-225 at the cure landing |
| DECON-5 | the deconstruction charter's "boundaries follow meaning; placement doctrines do not" is research policy scoped to that research frame (the charter's own words) — NOT estate-wide licence against estate placement rules (`consolidate-at-second-consumer`, PDR-108); the collision is unadjudicated at estate level and routed to the fresh survey design (owner-agreed routing, 2026-08-14) | seat-inference (scope) + owner-agreed routing | research record `capability-deconstruction-survey-comparison.md` Finding 3 + survey-machinery plan §Banked inputs |
| XPLAT-4 | resume order at the 2026-08-17 compaction — verbatim: "after compaction start with our Windows work and reviewing Luke's work. He has only been on the team a few days so please be supportive, not crazy supportive, but just warm"; with the same-day sequencing correction "I intended our Windows work to go in first in order to support the manual windows work" — the XPLAT research rider is support-sequencing, never a contribution fence; supersedes SKILLS-FIRST at the queue head | owner-verbatim | discharged this seating: research node `cross-platform-research` born sketch (plan-corpus status enum; execution state rides MCP-607, In Progress — authorities distinguished per the plan's amendment trail); warm reviews delivered on #891 (with first-hand macOS gate proof) and #888 |
| BATCH-CADENCE | commit/push cadence corrected — verbatim: "comitting is expensive, pushing is expensive, you are committing and pushing every little thing, and it means a MASSIVELY disproportionate amount of our time is spent running the quality gates. I like that you make small commits and push often, but I do think we are currently overshooting the sweet spot" (2026-08-17, direct to Director) | owner-verbatim | working practice: one commit per coherent parcel, push at safety boundaries; safety floor unchanged — freezes and handoffs never left unpushed |
| XPLAT-3 | invariant restated at the provider quantifier, owner-agreed 2026-08-14 at this seat, superseding XPLAT-2's capability-level wording in the live ADR-225 text (establishment discipline unchanged): "no single named external provider may become a condition for this system's existence: every supported composition survives the loss of any one such provider — by a compatible provider, a local or self-hosted binding, or omission of a non-constitutive capability — and each surviving composition is exercised, not merely declared" | owner-verbatim (agreed to Director-proposed wording, "agreed, please make the change") | ADR-225 at `1823c90f2` on PR #886 + PR comment 5292457799 |

## Expired / superseded / executed (dated; no home owed)

R1, R5, R9, R12, R15, R25, R26, R31 (superseded by L1578's general grant),
R32–R35, R37–R41, R43, R44, R49, R50, S626–S648, L1571, L1572 (superseded;
class kin `model-tier-stance-gradient`), L1574 (superseded by L1580), L1576
(first half), L1580 (expired by date; superseded by the 2026-08-06
writes-allowed word), MAG-7 (pacing, window-scoped) — all verified dated
historical facts in the inventory; substance conserved in the historical
blocks (relocating byte-conserved at plan S4) and git history.

## Census addenda (critic finds beyond the rows above — pending first-hand reads at S3)

- Lines 342–371 (Plover's own seating block) were skipped by the inventory's
  section map — carries further rulings; read and row them.
- The `ALSO STANDING` rider at line 486 (cricket legs dispatch unnamed;
  MCP-386 ledger; MCP-406 rules-corpus-unloadable) — row at S3.
- Board/assumptions/plan authority verdicts live on the
  [thread record](threads/estate-coordination.next-session.md) §Inheritance
  audit outcomes — they are lane state, not rulings.

## Provenance

Inventory: read-only fork, 2026-08-13 ~18:1xZ. Verification: workflow
`wf_c5bddb5d-466`, 13 legs, two-at-a-time under the owner's quota
constraint; 81 rows returned; every claimed home opened first-hand (Linear
tickets read via MCP; repo homes read at path). Full evidence text was
machine-local task output (decision-sufficient compression here + the homes
themselves; the same judgement class as the 2026-08-13 metaloss record).

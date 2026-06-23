---
name: "practice-lineage clarity-of-purpose restoration"
overview: >
  practice-lineage.md drifted into THREE roles: (a) the plasmid-exchange + evolution mechanism,
  (b) a propagation template duplicating practice.md/practice-bootstrap.md, and (c) an accreted
  §Learned Principles registry (19 axioms + 28 actives). The trinity even disagrees on what
  lineage IS (bootstrap calls it "the why"; its header calls it exchange-mechanism + propagation
  template; the owner's ruling: a git-like RECORD of branching/merging/transplanting/evolution of
  the Practice across contexts — the narrative companion to provenance.yml). Owner directive
  (2026-06-21): "it is not supposed to encode principles … clarity of purpose is vital." Restore
  lineage to ONE purpose (the evolution record) by (1) evacuating §Learned Principles to their
  correct homes by intent, and (2) deleting the what-it-is / how-to-apply sections that duplicate
  practice.md/bootstrap/verification. Owner authorised execution THIS session, no further approval.
  This plan is the durable brief so the pass survives a context compaction.
todos:
  - id: t1-home-unhomed-pdrs
    content: "Author homes for the genuinely-unhomed Learned Principles BEFORE deleting them (conservation: home-before-remove). Portable Practice-governance principles → new PDRs (next free numbers; PDR-106 RESERVED for Closure & Role-Routing, do not use): generalise-where-it-doesnt-cost-utility; culture-as-transmission-of-disposition; repo-state-enforcement-needs-its-own-proof-layer (+ RED-first-for-repo-state). PDR-003: MAIN agent authors Core, never a sub-agent."
    status: pending
  - id: t2-home-unhomed-directives
    content: "Route engineering/meta principles with no PDR home to the directives (principles.md is soft, has room; testing-strategy is HARD — avoid, prefer a PDR): intent-over-mechanics, documentation-is-concurrent, agent-files-are-first-class-infrastructure, implicit-architectural-intent-is-not-enforced, entry-surfaces-degrade-by-default. Amend the compressed-neutral-labels rule for the multiple-authoritative-frames sibling. Fold the rule-vs-skill axiom into practice.md §Meta-Principles when it is rewritten (t5)."
    status: pending
  - id: t3-verify-homed
    content: "Spot-verify first-hand that the ~37 already-homed principles' teaching truly lives in the cited home (PDR-004/005/015/018/024; practice.md §Philosophy/§Knowledge-Flow/§Content-Tiers/§Self-Teaching/§Sustainability; bootstrap §Metacognition/§Ecosystem-Survey/§Continuity; always-applied rules 219-221) BEFORE deleting on that basis. Ground convenient claims hardest (owner discipline)."
    status: pending
  - id: t4-evacuate-learned-principles
    content: "Delete §Learned Principles (axioms + actives) from lineage. Each removed principle's substance lives in its home (t1/t2/t3) — NO tombstone, no 'moved to X' memorial. Fold the two provenance-about-lineage principles (plasmids-need-a-provenance-chain; provenance-is-storytelling-not-credit) into lineage's own §Provenance prose — they ARE evolution-record content."
    status: pending
  - id: t5-dedup-blueprint
    content: "Phase B. Delete the what-it-is / how-to-apply duplicate sections from lineage, verifying each concept survives in the sibling FIRST: §Metacognition, §Testing Philosophy, §Agent Pattern, §Workflow Commands, §Always-Applied Rules, §The Knowledge Flow, §Session-Entry Skills (→ practice.md/bootstrap), §Validation scripts (→ practice-verification). KEEP genuine evolution-mechanism content: provenance, adaptation levels, maturity, how-it-evolves, fitness-as-exchange-growth-governance, plasmid exchange, genesis scenarios, integration flow, two-way merge, pattern/decision travel. §Principles (engineering imperatives): dedup against principles.md (host canon) + practice.md §Philosophy; reviewer assesses portability residue."
    status: pending
  - id: t6-repoint-and-header
    content: "Rewrite the lineage header to ONE purpose (the evolution record). Repoint inbound references: practice.md §Meta-Principles (488 → lineage §Learned Principles is gone; point to PDR corpus); bootstrap §principles.md (214) + §testing-strategy.md (223) 'Encode … from practice-lineage.md' → repoint to practice.md §Philosophy / the directives. Verify practice.md §Fitness (221) and §Self-Teaching (517 maturity) pointers still resolve (those sections STAY in lineage)."
    status: pending
  - id: t7-assess-gate-commit
    content: "docs-adr-expert assesses the routing + Core cohesion (promote-and-assess, NOT approval-gate; critically assess findings first-hand — one breadth sub-agent fabricated a quote earlier). Update provenance.yml (new entry per edited trinity file). Run gates incl. pnpm practice:fitness:informational + practice:vocabulary. Commit by EXPLICIT pathspec (Cutter live — never git add -A). NOT pushed (owner controls push)."
    status: pending
isProject: false
---

# practice-lineage clarity-of-purpose restoration

**Status**: **EXECUTED 2026-06-21 (Ferret seeks Tunnel)** — the pass ran and, under three owner
reframes, became a clarity-of-purpose restructure (lineage → evolution record, 855→283 lines;
PDR-108/109/110 + PDR-002/024; docs-adr-expert-assessed, folded first-hand). **18 files staged,
gate-clean, NOT committed** — full-tree knip RED on a peer's unwired markdown-links validator;
owner directed the commit handed to the Director, Vesuvius calls Quench, to land once green.
Archive this brief once the commit lands. (Original status: owner-authorised to execute THIS
session; this file was the durable brief written to survive a context compaction.)

## The corrected diagnosis

`practice-lineage.md` (855 lines, hard 830; 50,418 chars, hard 48,500) is over-hard because it
holds three roles at once. The owner's ruling fixes the purpose: **lineage = the git-like record
of how the Practice branched, merged, transplanted, and evolved across repos — the narrative
companion to `provenance.yml`** (which already records the journey across 7 repos:
oak → cloudinary-poc → new-cv → castr → pine-scripts → algo-experiments → oak). It is NOT a
principles store and NOT a propagation template.

Two things leave; both conserve at zero sibling-fitness cost (all three siblings are at/near
their limits — practice.md 34,218/35,000 chars, bootstrap 40,108/40,500 chars,
verification 298/300 lines — so NOTHING relocates *into* them; evacuation is delete-conserved or
route-to-homes-with-room):

1. **§Learned Principles** → PDRs / rules / principles.md (by intent). ~37 already homed
   (delete-with-citation); ~10 unhomed (author homes first).
2. **The §Practice Blueprint's what-it-is / how-to-apply sections** → deleted as duplicates of
   practice.md / bootstrap / verification (repoint inbound pointers).

Expected: lineage 855 → ~385 lines, well under target (680). Fitness is a *consequence* of the
clarity fix, never its goal.

## Governing constraints — the loss-prone part (do not re-make this session's mistakes)

- **Promote and assess, never gate on approval** (PDR-104, PDR-101). Author best-effort; the
  review quorum is the quality gate, not owner pre-approval.
- **Route by intent, not by menu** (owner correction 2026-06-21 #4). Each principle has ONE
  correct home by intent: PDR = portable Practice-governance; principles.md = engineering
  imperative; rule = always-fire behaviour; practice.md = what-the-Practice-is; lineage prose =
  about the evolution mechanism itself.
- **No tombstones** (no-tombstones-for-removed-ideas; PDR-091). The destination IS the record —
  no "moved to X" memorial, no negation-contrast.
- **Conservation over fitness** (learning-before-fitness). Home a principle before deleting it;
  never drop an unhomed principle to hit budget. Knowledge-preservation is absolute.
- **Home-before-remove**: author/verify the destination carries the substance, THEN remove from
  lineage. Spot-verify "already homed" first-hand (ground convenient claims hardest).
- **PDR-003**: the MAIN agent authors Core (lineage, practice.md, PDRs) — never a sub-agent.
  Sub-agents ASSESS (read-only).
- **PDR-106 is reserved** for Closure & Role-Routing (unauthored); new PDRs use the next free
  number, not 106.
- **fitness_line_limit / fitness_char_limit are owner-only.** The cure is route/delete, not raise.

## Routing table (47 principles → homes by intent)

**Axioms (19):** dedup-delete (conserved in the cited home) unless marked ROUTE.
1 separate-universal-from-domain → practice.md §Content-Tiers/placement-rule. 2 silent-degradation
→ practice-verification §Health-Check + practice.md. 3 intentional-repetition → practice.md
§Sustainability. 4 stable-indexes-mutable-plans → bootstrap §AGENT.md + always-applied. 5
rule-not-just-skill → ROUTE practice.md §Meta-Principles (fold). 6 plasmids-need-provenance-chain
→ FOLD into lineage §Provenance (evolution-record content). 7 documentation-is-concurrent → ROUTE
principles.md. 8 plans-need-value-traceability → practice.md §Workflow. 9 understand-local-norms →
bootstrap §Ecosystem-Survey. 10 fitness-at-every-stage → practice.md §Fitness + lineage §Fitness.
11 self-contained-Core → practice.md §Plasmid-Exchange. 12 concepts-are-unit-of-exchange →
practice.md §Philosophy. 13 paused-is-not-future → practice.md §Workflow (paused labelling). 14
agent-files-first-class-infrastructure → ROUTE principles.md. 15 portable-not-symmetrical →
bootstrap (unsupported-platforms-explicit). 16 architectural-excellence → principles.md +
practice.md §Philosophy. 17 apps-are-thin → principles.md. 18 learning-before-fitness → practice.md
§Learning-before-fitness. 19 knowledge-curation-is-autonomic → practice.md §Knowledge-Flow.

**Actives (28):** dedup-delete unless marked ROUTE/FOLD.
1 tool-error-as-question → PDR-018. 2 reviewer-scope=prompted-scope → PDR-015. 3
metacognition-is-a-technology → bootstrap §Metacognition. 4 recursion-as-method → practice.md
§Self-Teaching. 5 intent-over-mechanics → ROUTE principles.md. 6 recursive-failure-mode → bootstrap
§Metacognition. 7 exchange-context-indexed-pack → PDR-024. 8 .agents/skills-discovery-surface →
bootstrap §Skills. 9 repo-state-needs-own-proof-layer → ROUTE new PDR. 10 four-kinds-of-truth →
practice.md §Content-Tiers. 11 entry-surfaces-degrade → ROUTE principles.md. 12 RED-first-for-repo-
state → ROUTE same new PDR as #9. 13 session-workflows-state-free → bootstrap + stable-indexes
axiom. 14 platform-config-is-infrastructure → practice.md §Tooling + bootstrap. 15
continuity-vs-convergence-separate → practice.md §Workflow + bootstrap §Continuity. 16
provenance-is-storytelling-not-credit → FOLD into lineage §Provenance. 17 hydration-verifies-
operations → practice.md §Self-Teaching + verification. 18 deliberate-absences-in-operational-
surfaces → bootstrap §Ecosystem-Survey. 19 canonical-source-before-activation → bootstrap. 20
findings-route-to-lane-or-rejection → always-applied rule 219. 21 nothing-unplanned-without-trigger
→ always-applied rule 220. 22 compressed-neutral-labels → always-applied rule 221 (first half);
multiple-authoritative-frames sibling → ROUTE rule amendment. 23 implicit-architectural-intent-not-
enforced → ROUTE principles.md (architectural-enforcement sharpening). 24 explorations-between-
observation-and-decision → PDR-004 + practice.md §Knowledge-Flow + bootstrap. 25 generalise-where-
it-doesnt-cost-utility → ROUTE new PDR. 26 portability-is-a-gradient → PDR-005 + bootstrap. 27
integrations-must-be-named → PDR-024. 28 culture-as-transmission-of-disposition → ROUTE new PDR.

**Unhomed needing authored homes:** new PDRs — generalise-discipline; culture-as-transmission;
repo-state-enforcement-proof-layer (+RED-first). principles.md additions — intent-over-mechanics,
documentation-is-concurrent, agent-files-infrastructure, implicit-architectural-intent,
entry-surfaces-degrade. Rule amendment — multiple-authoritative-frames into the compressed-labels
rule. Fold — rule-vs-skill into practice.md §Meta-Principles; the two provenance principles into
lineage §Provenance.

## Situational state (verify with git on pickup; do not trust verbatim)

- **Cutter live** on the strategy/`plan` thread (intent-graph node-schema). Its uncommitted WIP at
  last check: napkin.md, the strategy thread record, observability-and-quality-metrics.plan.md,
  repo-intent-graph.plan.md, measures.md, plan-node-schema.v0.md, dora-2025 research file.
  **STAGE BY EXPLICIT PATHSPEC** — never `git add -A`; never stage Cutter's files. Owner: ignore
  Cutter's work. My claim covers practice-core (disjoint area).
- **Nothing pushed; owner controls push.** Branch `docs/planning-and-validation`, ~57+ ahead.
  `git log` is authoritative.

## Acceptance

- §Learned Principles gone from lineage; every principle's substance live in its routed home
  (PDR / rule / directive / practice.md / lineage-provenance-prose), verified first-hand; no
  tombstones.
- What-it-is / how-to-apply duplicates removed; lineage reads as one coherent evolution record
  with a single declared purpose; inbound pointers repointed; 0 broken references.
- Reviewer-assessed (docs-adr-expert); findings critically assessed before folding.
- Gates green incl. practice:fitness:informational (lineage under hard) + practice:vocabulary.
- Committed by explicit pathspec (not Cutter's WIP); not pushed.

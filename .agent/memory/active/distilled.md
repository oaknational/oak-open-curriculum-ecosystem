---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested `distilled.md` processing through
  `oak-consolidate-docs`: the 2026-05-14 multi-agent deep-dive and 2026-05-17
  gate-stack entries graduated to permanent behavioural homes. The active file
  now carries only the conservation role, graduation pointers, and held
  validation entries; the larger 2026-05-17 envelope has served its purpose.
  Falsifiability: if future napkin rotations add high-signal learning that has
  no stable permanent home, preserve it first and revise the envelope by
  substance rather than trimming the lesson.
---

## Ready-Empty State (2026-06-02 baseline)

All active entries present at the 2026-06-02 Lofty Sweeping Falcon continuation
now have item-level dispositions in the 2026-06-02 Lofty curation ledger.
The 2026-06-03 EEF D3 design-rationale entry graduated to
`verify-data-supports-shape-before-building.md` and `invoke-mcp-expert.md`.
Future high-signal lessons may be added here when they need the distilled
staging surface; fitness remains a routing signal, not a reason to avoid capture.

## 2026-06-03 — curation and buffer disposition lessons

- **Accepted does not mean one landing shape.** For pending graduations, ask
  what future action changes because of the edit. Some accepted items amend
  existing doctrine, some become future lanes because tooling does not exist
  yet, and adjacent owner-gated items may correctly stay unmoved. If the only
  outcome is a cleaner register, the graduation has not happened.
- **Plugin- or platform-owned lifecycle is not knowledge-owned lifecycle.**
  Vendor/platform surfaces (per-user memory, and the now-retired `.remember`
  plugin) can own their own file rotation/deletion while the learning remains
  repo-owned. Anything read by a repo process needs a disposition and a
  new home when it matters; otherwise it remains live in the source buffer.

## 2026-06-03 — reviewer-brief scope protection (Lacustrine Swimming Beacon)

- **"Decided scope protected" in reviewer briefs cites the NUMBERED ratified
  decisions only — plan elaborations stay refutable.** At the D3
  review-then-ratify session the briefs protected "owner-ratified decisions
  and the Fully Specified End State", implicitly sweeping in §Do elaborations
  (the metric-filter input enumeration) the owner had never specifically
  ratified; that suppressed a legitimate PDR-058 no-consumer finding which the
  owner's own settlement question then surfaced. Source: napkin 2026-06-03
  Lacustrine entry. Routing: pending-graduations candidate (target: a clause
  in the reviewer-brief discipline surface, e.g.
  `memory/executive/invoke-code-experts.md` or the brief-authoring rule);
  trigger-gated on a second instance or the next reviewer-brief authoring
  pass.

## 2026-06-03 — taxonomy design lessons (Blustery Lifting Gale)

- **When a candidate category lumps a quality-standard with a presentation
  concern, split before naming.** Classifying `oak-brand` + `oak-tone-of-voice`
  as one "org-voice" category would have swept Oak's pedagogical/factual-rigour
  standards (evidence, provenance, caveats, teacher judgement) into branding —
  demoting the core differentiator to styling. Owner split: rigour standards
  are constraints that travel INSIDE capabilities (curriculum/evidence
  governance); branding is a capability concern in its own right. Source:
  napkin 2026-06-03 Blustery entry; enforcement home landed in the taxonomy
  plan's ambiguous-case note; the general heuristic stages here for any
  future classification work. Routing: fold into the taxonomy plan's audit
  step at promotion, then delete here.

## 2026-06-03 — curation enforcement and verifier lessons

- **A curation archive move is not allowed until the ledger exists.** Intent to
  process is not processing. In a buffer rotation, write the durable item-level
  disposition ledger first, then perform any archive move only as preservation
  of an already-processed source. Source: Opalescent archive-before-ledger
  mistake; routing: pending-graduations candidate for a skill/rule tripwire.
- **During live parallel curation, verify named surfaces immediately before
  quoting or editing them.** Between-turn drift is normal: another agent may
  graduate, rewrite, or close a surface while the current agent is mid-turn.
  Cheap proof is `git status` plus targeted greps or reads before citing state.
- **A green verifier with no extraction count proves nothing.** Shell loops,
  especially zsh loops over multiline variables, can false-green by checking no
  inputs. Verifiers that enumerate files or links must report the count they
  checked before their green result is trusted.
- **Literal private-use characters in scripts are unsafe capture material.**
  When code needs PUA sentinels, write escaped forms such as `\ue200`, not
  literal bytes; literal PUA text was stripped once and made a regex match
  everywhere.

## 2026-06-04 — verify before you build on it (Mossy Whispering Bark)

- **A synthesis/research report COMPILES claims; it does not CERTIFY them.**
  Before relying on a compiled artefact's claim for a decision or a build,
  check its verification tier — primary-verified fact vs single-source claim
  vs frame-dependent convergence. High-stakes external-source claims are
  primary-verified before the artefact is "delivered" (owner directive
  2026-06-04, school-data-search gate session — a verification pass overturned
  three already-recorded gate decisions). Decide from requirements + primary
  sources, never from precedent or compiled-framing as cover. Routing:
  PDR candidate in pending-graduations; operational now in the
  school-data-search plan's verification discipline + high-stakes register.
- **Value-first; existing artefacts are malleable design surface** (2026-06-04,
  EEF D4 session — owner corrected the same root ~5×, each in a different
  costume). When we control the stack (we build the data objects AND the
  substrate), the fixed points are the value constraints (here: maximise user
  value; don't flood agents with irrelevant tokens) + our design agency — NOT the
  existing code, the current/generated data shape, the consumer count, or even
  owner-ratified decisions. Start every design decision from "what value must this
  deliver, and what do we control?"; reshape existing artefacts when value demands
  (openly, with reasoning, with ratification); reshape on frame-overturn, never
  bolt-on. Routing: graduated to Claude auto-memory
  (`feedback_value_first_existing_is_malleable`); PDR/rule candidate if it recurs
  cross-platform. Connects to LTAE, premature-crystallization,
  existence-is-not-correctness.
- **Review from the artefact's own value, not by analogy** (2026-06-04,
  school-data-search deep review — Fiery Sparking Caldera). In a review, reason
  from THIS artefact's value + the owner's frame; do NOT import doctrines or
  analogies from other threads. I twice imported a cross-thread frame —
  value-trace "no consumer" as a blocker, and the EEF value-reckoning as a lens
  — and was corrected both times; the need + value were owner-settled and the
  work had nothing to do with EEF. "No named in-repo consumer" is not a defect
  for horizontal infrastructure whose user-value is a self-evident action
  serving a class of consumers. The convenient-claim failure surfaced as
  pattern-completion: the empty consumer-grep *felt* like evidence because it
  flattered the frame I arrived with. Routing: Claude auto-memory
  (`feedback_no_cross_thread_analogy_in_review`); PDR/rule candidate (review or
  metacognition surface) if it recurs. Connects to ground-convenient-claims,
  value-first-existing-is-malleable, premature-crystallization.

## 2026-06-04 — commit-window discipline under live parallel agents (Arboreal curation)

- **The commit window is a moving target; re-derive the staged set per chunk, not
  per pass.** Across n=5+ sessions in the 2026-06-03/04 window (Moonlit, Blustery,
  Burnished, Shadowed), peer files went dirty mid-commit-ceremony. Each chunk's
  pathspec must come from a FRESH `git status`; explicit-pathspec staging +
  per-chunk re-derivation carried 6+ agents on one branch with zero collisions.
  Three corollaries, all repeatedly validated: (1) say "*I* haven't committed,"
  never "*nothing* is committed" — a parallel commit can sweep your whole working
  tree, so investigate git-state anomalies (reflog + per-file log) and surface
  truthfully, but scope the claim to your own actions; (2) `git commit -F msg --
  <intent files>` commits exactly your bundle and leaves a peer's staged entries
  untouched (`git restore --staged`/`reset` are hook-blocked/forbidden); (3) the
  `cannot lock ref 'HEAD'` ref-lock is the FINAL collision backstop — re-derive
  and re-commit against the moved HEAD, never delete the lock. Rule/PDR
  graduation stays owner-gated (pending-grad commit-window items 15/40); this is
  the interim cross-session home.
- **Critically assess a subagent's inference, not just its facts** (2026-06-04,
  school-data-search WS-D1 — Fiery Sparking Caldera). validate-specialist-findings
  usually checks facts and severity; this sharpens it. architecture-expert-betty's
  facts were correct (`oak-search-sdk` really has retrieval and admin modules) but
  her inference — "therefore split the new SDK into six workspaces" — contradicted
  what that precedent demonstrates (it BUNDLES read and write in one SDK behind a
  DI factory). A reviewer's own cited evidence can support the opposite of their
  recommendation; verify the evidence-to-recommendation step, most of all when the
  facts check out and the recommendation is the more decomposed/elaborate shape.
  Routing: refines `feedback_validate_specialist_findings_before_acting`; PDR/rule
  candidate on recurrence.

## 2026-06-04 — convenient claims cluster at frame-fit points (Tempestuous Vaulting Gust)

oak-kg/ontology deep review surfaced four convenient claims, each caught only by grounding:
the phantom integer id-join (the bulk export has no numeric lesson id at all); "ontology
misconceptions are sparse" (7,415 nodes on 8,394/8,399 lessons); "the Oak API holds both id
and slug" (written into my *own* report, then falsified by the OpenAPI scan); the survey's
"GraphView = 5 NotImplementedYet stubs" (it is `manifest()`+`subgraph()`, no stubs). Two
sub-traps sharper than the general rule:

- **Specificity is not verification.** A concrete detail ("integer `curric:id`") lends false
  authority to the *inferred* half of a cross-cutting claim ("…matching the bulk ids") that
  was never read. Split read-half from inferred-half; ground the convenient inferred half first.
- **Constraint strictness is not data volume.** "SHACL `minCount` disabled → data sparse" is a
  non-sequitur (disabled = not-required-per-record, not unpopulated).

A claim's *convenience* (it makes the hard thing easy, or the boundary tidy) correlates with
motivated construction; the fluency of a tidy narrative is itself the warning sign. Refines
`ground-convenient-claims`, `present-key-is-not-graph-identity`,
`validate-specialist-findings-before-acting`; connects to the Mossy verify-before-build entry.

## 2026-06-04 — a fired trigger is not "graduate standalone now" (Hidden Hiding Dusk)

When a pending-graduation's trigger fires, the next check is WHERE its permanent home lives — not
"author it." If that home (an ADR, a contract, a doc section) is owned by an active thread that is
mid-flight, authoring a standalone artefact in a consolidation session collides with or duplicates
that thread's work. Defer to the owning thread's own landing instead. Worked instance: the
graph-tool-category doctrine's trigger fired (EEF D4 ratified) but its ADR home is owned by the live
graph-tools-value-redesign thread → deferred to that thread's promotion, not authored here. Sibling
of `respect-active-agent-claims` and `ship-independent-coordinate-dependent` applied at graduation
time. Pairs with the full-doctrine-estate non-duplication check: survey the plan estate, not just
the register, before authoring — the same check that turned the action-time-interrupt lane into a
general frame deferring to closure-pressure rather than a duplicate.

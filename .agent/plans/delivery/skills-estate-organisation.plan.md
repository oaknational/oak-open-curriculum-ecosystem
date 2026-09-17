---
id: skills-estate-organisation
node_type: delivery
name: "Skills-estate organisation — one concept scheme across skills, rules, and subagents"
overview: "The owner-ratified structure for the skills estate: one concern tier over flat, namespace-unique skills (families flatten to `<family>-*` ids), with the concept graph carrying every further dimension of type; annotations, derived projections, and ratified validators instantiate PDR-134/ADR-221, never a parallel taxonomy."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-08
ratified_where: >-
  In-session at the Director seat, 2026-08-08: four numbered owner
  rulings ratifying the Director's structure recommendation with one
  amendment (families flatten by id namespace). Follows the 2026-08-07
  grouped-by-concern ruling (captured at the Skills seat, comms event
  0e99bc22) and the 2026-08-02 commissioning word.
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-03
---

# Skills-estate organisation

## Goal

Every skill, rule, and subagent template carries its classification as
concept annotations on the canonical artifact itself — KIND (what it
is), STRATUM (PDR-134's four, verbatim — the portability truth), and
INTENT (what it serves) — with every index a derived projection and
the two-graph invariant (summons edges free; grounding references obey
the strata direction law) mechanically checkable. The skills corpus
additionally carries the owner-ratified FILESYSTEM STRUCTURE below.
Evidence base:
[the concept-exploration report](../../reports/agentic-engineering/skills-estate-organisation-concept-exploration-2026-08-02.md)
(2026-08-02, including the dependency-topology study and the two-graph
finding) and
[the WS0 working record](../../reports/agentic-engineering/skills-estate-organisation-ws0-working-record.md).

## The ratified structure (owner rulings 2026-08-07 and 2026-08-08)

Two owner moments settled what WS0's deep reflection carried as its
filesystem question. 2026-08-07 (no debate; captured at the Skills
seat, comms event 0e99bc22): canonical skill definitions GROUP BY
CONCERN; vendor projections STAY FLAT; PR #731 reconciles with the
ruling before it merges. 2026-08-08 (in-session at the Director seat):
the concrete shape, ratified as four numbered rulings on the
Director's recommendation:

1. **One tier, families flatten by namespace.** Canonical depth is
   `<concern>/<skill>/`, never deeper. A skill family is a NAMING
   convention plus a graph relation, not a tree shape: members are
   ordinary namespaced skills (`parallax-audit`, `parallax-frame`, …)
   sitting directly under their concern. The family-bundle directory
   shape (`<family>/skills/<skill>/`) is retired before it ever
   reaches main.
2. **The graph carries the overlap, not the tree.** The tree is a tree
   containing graph nodes; the graph expresses every further dimension
   of type. Because the tree is the LEAST FLEXIBLE expression of
   structure, its constraint on the graph is kept at a minimum by
   keeping the set of tree concerns to the SMALLEST USEFUL NUMBER
   (owner's words, 2026-08-08). Primary concern is declared in
   frontmatter and the tree position must agree — the twin-surface
   consistency that WS4 makes checkable; secondary concerns, family
   membership, kind, stratum, and intent are graph annotations only.
3. **The landing rule.** Every new skill names its concern at landing.
   "No obvious home" challenges the concern vocabulary rather than
   minting a group ad hoc; minting or merging a concern is a
   deliberate, recorded act tested against the smallest-useful-number
   principle.
4. **Rules and subagents share the vocabulary, not the shape.** They
   take concern annotations only; no filesystem regrouping. Their flat
   filenames are load-bearing identifiers (projections, hooks, policy
   matchers), and they are single files with no substructure — the
   skills corpus is the lever where directory geography pays.

### The working concern set

Eight concerns, adopting the exploration report's content-derived
intent families (adopt-don't-invent per ADR-221; `cognition` keeps the
owner's existing directory name). This table is the WORKING CUT:
placements marked † are judgment calls re-judged at each migration
PR, and the ≤20%-debate falsifier governs the vocabulary itself.

| Concern | Members (current corpus) |
| --- | --- |
| `cognition/` | metacognition, reason, concept-exploration, free-play, proportionality, cricket, retrospective, go†, and the nine `parallax-*` members |
| `knowledge/` | napkin, consolidate-docs, consolidate-until-done, curator-pass, knowledge-safety-sweep |
| `choreography/` | start-right-quick, start-right-team, start-right-thorough, session-handoff, wrap, coordination-fold, inter-practice-collaboration, set-up-worktree-lane, sif† |
| `change-custody/` | commit, gates, pr-lifecycle, complex-merge, semantic-merge, undo-change |
| `planning/` | plan, ticket-management |
| `orientation/` | under-the-hood, working-with-agentic-ai |
| `domain-craft/` | design-system-usage, fidelity-review, ground-truth-design, ground-truth-evaluation, update-bulk-download-schema, update-upstream-api-spec, working-with-graphs†, tsdoc† |
| `interop/` | codex-helper, chatgpt-report-normalisation†, the-codex-dialogues† |

Thin groups (`planning`, `orientation`, `interop`) are merge
candidates the first time a landing tests them against the
smallest-useful-number principle; the tree is cheap to re-cut
precisely because projections are flat.

### Amendment 2026-08-10c (owner word, Director-recorded): WS9 candidate — skill-craft skills + eval tooling

The owner names a coming need (2026-08-10, verbatim substance): "we
are going to need skills about skills — skill design, writing, eval
design, eval running, how to use mcpjam to help, how to test evals in
claude, codex etc… we need skill skills and we need tools to help run
skill evals." Recorded as a WS9 CANDIDATE (pointers, not specs — the
landing rule applies: minting a `skill-craft` concern, or homing these
under an existing thin concern, is a deliberate recorded act at
authoring time). Members sketched: skill-design, skill-writing,
eval-design, eval-running, cross-platform eval-testing (Claude, Codex,
… — mcpjam assisting where skills wrap MCP surfaces). Tooling half:
the WS8-general eval runner as agent-tools machinery. Sequencing
insight: the `skill-standard-pilot` node's S3 (first eval execution)
generates the evidence these skills are authored FROM — pilot first,
harvest its transcripts and frictions into the skill-craft corpus.
Existing scattered craft to consolidate, not duplicate: the
skill-naming-and-description-quality rule, the subagent-architect
agent, Anthropic's skill-creator, the spec's skill-creation pages.

### Amendment 2026-08-10b (owner word, Director-recorded): WS8 — spec supporting directories + evals, general

The owner's restated intent (2026-08-10) recovers what WS6 left as a
"candidate general mechanism": **WS8 — every skill may carry the full
agentskills.io supporting-file set** (spec §optional-directories:
`scripts/`, `references/`, `assets/`) **canonical-side**, with the
projection transform carrying them into vendor entry skills per the
spec, and **per-skill evals** per the spec's evaluating-skills method.
Grounding: canonical `SKILL-CANONICAL.md` files are transformed before
forming vendor `SKILL.md` entry files, so canonical-side structure
(including WS2's graph frontmatter, which stays internal or re-homes
under spec `metadata:`) never leaks non-spec content into projections.
The Parallax family's member-local
`cognition/parallax/references|evaluations|scripts/` (WS6 executed) is
the worked template. The executing seat designs the transform's
directory carriage (today the generator emits pointer-only SKILL.md
files; carrying supporting dirs is new machinery, test-first) and the
eval convention's home; sequenced after the WS7 group moves, beside
WS2's annotation pass.

**Pilot (owner-proposed 2026-08-10): one skill fully to standard first**
— graph frontmatter, a validator, the full supporting-directory set,
and evals per the spec's evaluating-skills method (`evals/evals.json`
cases with assertions; with-skill vs without-skill runs in clean
subagent contexts; script graders for mechanical checks + blind LLM
judge for holistic; benchmark deltas; the iterate loop). Director
working cut, owner's word picks the subject: pilot on
`design-system-usage` (strongest scriptable-assertion substrate — the
estate's own CSS/contrast/token validators grade it; content re-truing
already owed as PR-B; widest reach via design-sync), then mint
`ui-visual-design` second, born to the proven standard with the W0.7
blind-judge instrument as its eval grader.

### Amendment 2026-08-10 (owner rulings, Director-recorded)

1. **`domain-craft/` gains domain subdirectories** —
   `domain-craft/<domain>/<skill>`. Owner-named: `ui-design/`
   (design-system-usage, fidelity-review — rename in ruling 5) and
   `graph-operations/` (working-with-graphs, its † resolved by the
   owner's own example). Remaining members take domains at the group
   PR (candidates, judgment calls: ground-truth-design +
   ground-truth-evaluation → a search-evaluation domain;
   update-bulk-download-schema + update-upstream-api-spec → a
   curriculum-data domain; tsdoc† re-judged). The WS4 twin-surface
   consistency check must accept the two-level path under
   domain-craft; the group PR carries that validator change.
2. **`interop/` dissolves into `choreography-and-collaboration/`**
   (the `choreography` group renamed at its move): codex-helper,
   chatgpt-report-normalisation†, the-codex-dialogues† join the
   choreography members. The first thin-group merge, executed by
   owner word rather than a landing test.
3. **The word "design" is reserved for visual and user-experiential
   design** (owner ruling, estate-wide naming discipline).
   `ground-truth-design` carries a recorded rename candidate at its
   group PR (its referent is search-query authoring, not visual
   design); the `parallax-design-*` family naming is re-judged at
   that family's next natural boundary.
4. **`clerk-custom-ui` deleted** at owner word (2026-08-10): store
   dir, `.claude` symlink, and skills-lock entry removed; sibling
   clerk skills retained.
5. **`fidelity-review` renames to `claude-design-pipeline`**
   (owner-proposed; Director verdict YES with one condition — the
   skill gains a short pipeline-at-a-glance frame naming conversion
   playbook → export refresh via the claude-design MCP → fidelity
   review → divergence register, so the name is earned). The rename
   also dissolves the name collision with the
   `@oaknational/fidelity-review` package (package = machinery,
   skill = workflow). Executes in the domain-craft group PR.

Two annotation-time edges named by the design seat (2026-08-08, ARC
pairing) for WS2/WS3 to carry: fidelity-review ↔ the W0.7
design-review instrument (shared judge-against-reference shape; the
calibration record cites the skill's vocabulary), and
design-system-usage → the design-values-come-from-the-system rule's
concern (the skill operationalises that rule; the edge makes the
pairing discoverable).

### Family mechanics

- Member ids are globally unique in the flat namespace
  (`parallax-*`); the generator's duplicate-refusal stands.
- Family membership is a frontmatter concept (graph relation), never
  a directory.
- Family-SHARED assets (Parallax's family-level `reference/` corpus,
  its family eval suites, `manifest.json`) re-home to the estate's
  standing surfaces — default: reference material under
  `.agent/reference/parallax/`, eval suites under
  `.agent/evaluations/parallax/` — with member skills linking them.
  The implementer verifies the default against those surfaces'
  conventions at pickup.
- Vendor projections stay flat and byte-stable in their load-bearing
  surfaces: canonical moves keep adapter directory names + frontmatter
  byte-identical, with body diffs confined to the moved skills'
  pointer lines — the conservation instrument #731 proved (wording
  amended 2026-08-09 per WS6 note (e)).

## Why this shape (first principles, not cowpath)

The estate ratified the machinery already: ADR-221 §6 (concepts as
front-matter annotations, one referent one home, seed vocabulary
adopted not invented), PDR-134 (strata + direction law + concept
lifecycle), PDR-009/051 (kind is a Layer-1 canonical property;
activation is a Layer-2 adapter property). A standalone skills
taxonomy beside that machinery would be the invented parallel scheme
ADR-221 forbids. The tree is GEOGRAPHY, not anatomy: the dependency
study found the estate's core is a mutually-referential organism of
~12 skills spanning several concerns — summons edges are free to
cross groups, so no grouping can or should mirror the runtime graph.
Flat projections decouple runtime naming from canonical geography,
keeping the cost of re-cutting the tree near zero (cost of change is
a core owner value).

## Workstreams

0. **WS0 — deep reflection: RESOLVED.** The structure question is
   owner-ruled (§The ratified structure). The exploration report and
   working record remain the evidence base; the annotation-scheme
   residue (kind/intent vocabulary, homonymy handling) is exactly
   WS1–WS3's content and continues there. No further WS0 sittings.
1. **WS1 — Vocabulary mint (concepts-first).** KIND (six values +
   collaboration-protocol from the rules corpus; primary/secondary
   hybrid convention; `platform-binding` deliberately excluded — the
   stratum axis carries portability) and INTENT (seven families)
   enter the concept scheme as `candidate` concepts with authored
   definitions; the EIGHT CONCERN NAMES above enter the same way;
   STRATUM adopts PDR-134 verbatim, no new nodes. The
   `classification: active|passive` frontmatter field is retired in
   the same change (its honest content becomes the
   `standing-invariant` kind).
2. **WS2 — Skills corpus annotation.** Front-matter concept keys on
   each SKILL-CANONICAL.md — including `concern` (primary, must agree
   with tree position) — seeded from the report's per-skill table,
   each classification re-judged against the body at annotation time
   (the report is a draft, not an oracle). Hybrid seams marked at the
   section level where a canonical genuinely splits strata
   (pr-lifecycle). THE REMAINING OWNER GATE fires here: the annotated
   corpus is the visible surface the owner ratifies.
3. **WS3 — Rules and subagents annotation.** Concern/kind/stratum/
   intent keys on the 119 rule canonicals (always-on/trigger-loaded
   stays untouched as the activation axis) and the subagent
   templates/components (the three-layer format README stays
   untouched as format architecture). Annotations only, per ruling 4.
4. **WS4 — Derived projections + validators (post-gate only).** The
   skills index, RULES_INDEX's classification columns, and the
   composition map regenerate from annotations; ADR-221's seeded
   checks extend to: every concept key resolves; grounding references
   obey the strata direction law; derived indexes reject hand edits;
   NO canonical deeper than `<concern>/<skill>/`; tree position
   agrees with the declared primary concern. Summons cycles are
   exempt by design — the two-graph invariant is the check's core.
   **Amendment (2026-08-09, owner-linked spec):** the validator set
   additionally runs the agentskills.io reference validator
   (`skills-ref validate`) over every generated projection. Spec read
   first-hand 2026-08-09: `name` + `description` required (name
   lowercase-hyphen, no leading/trailing/consecutive hyphens, ≤64
   chars, must equal the directory name; description ≤1024);
   optional `license`/`compatibility`/`metadata`/`allowed-tools`;
   SKILL.md under 500 lines recommended. Sampled projections conform
   (oak-commit, oak-parallax-frame). The canonical files' top-level
   `classification:` key stays internal to SKILL-CANONICAL.md (not a
   spec artifact); publishing canonicals as spec skills would move it
   under `metadata:`.
5. **WS5 — Named cures from the exploration's tension list.** (a)
   Lift the portable core of pr-lifecycle's review-round state
   machine to a practice-stratum pattern cited by proportionality and
   concept-exploration (cures the grounding inversion); (b) re-home
   cricket's experiment-record (binding-tally authority) beside the
   tally with the skill keeping method + pointer; (c) regenerate and
   re-scope skill-composition.md as a derived view, its two
   composition rules preserved as ratified doctrine; (d) the
   Oak-vs-external boundary (owner aside, 2026-08-02): no third-party
   skills in `.agent/skills` — externals enter only via the
   external-skill class in `.agents/skills` (lock-pinned, vendored)
   so upstream keeps the maintenance burden; the cure is a rule
   naming the boundary plus a validator refusing third-party landings
   in core.
6. **WS6 — #731 reconciliation (determinate target).** Keep #731's
   valuable substance: family-aware discovery's tests, the duplicate
   refusal, the flat adapter projections (which already match ruling
   1's projection half), and the nine Parallax adapters. Retire the
   family-bundle walker shape in favour of the single
   `<concern>/<skill>/` shape with one optional concern tier
   (replace-don't-bridge; flat/nested coexistence is transitional
   only). Parallax lands as `cognition/parallax-*` namespaced
   members; shared assets re-home per §Family mechanics. The four
   original review legs continue inside this workstream: link audit,
   RPIF consistency review, relationship map to the cognitive skills,
   and mechanics (frontmatter reconciliation; the Python-tools
   scoping ruling vs source-is-typescript-esm-only; the family
   eval-suite convention as a candidate general mechanism). Whether
   #731 is re-cut or superseded by a fresh PR is the seat's call at
   pickup; either way #731 closes-or-merges with its machinery
   preserved and its branch state reconciled against a main that has
   moved ~477 commits.
   **Execution note (2026-08-09, Director-executor rulings at pickup,
   grounded in the pre-execution code-expert review):** (a) the true
   starting state differs from this section's authoring-time premise —
   main ALREADY holds the full 110-file bundle at
   `.agent/skills/cognition/parallax/` (landed `6cba5ca56`/`5fa0b2a0a`)
   with NO adapters, so its nine canonicals are unsummonable and the
   adapter checker's `--check` mode is blind to the gap (it discards
   the discovery `skipped` list); the reconcile therefore includes the
   checker fix, landed test-first. (b) Target CONFIRMED as this
   section's words: `cognition/<member>` — a one-tier collapse; the
   acceptance clause's "flat members" contrasts with the bundle shape,
   not the concern tier. (c) The §Family mechanics defaults FAILED
   their own pickup-verification clause (`.agent/reference/` demands a
   PDR-032 owner-vet ceremony for a 35-file promotion;
   `.agent/evaluations/` is scoped to search-quality experiments) —
   family-shared assets home instead under the root member
   (`cognition/parallax/references|evaluations|scripts/`), member-local
   by convention. (d) The Python files stay Python: the
   `source-is-typescript-esm-only` rule's own line 44 permits
   occasional Python alongside shell, so no ports; the four
   member-local validators move intact, `validate_bundle.py` retires
   with the bundle after a dependency read, `render_graph.py` + test
   re-home as root-member scripts. (e) The Depth acceptance bullet's
   companion claim "regenerated adapters byte-identical" is
   UNSATISFIABLE for any canonical move while adapter bodies embed the
   source path — WS6 proves conservation as: adapter directory names +
   frontmatter byte-identical, the body pointer line's change IS the
   move (single-line diff across all 18 adapters, both vendor
   surfaces), all other skills' adapters byte-identical. WS7 must
   amend either the clause or the adapter template before its first
   move. (f) **COMPLETED 2026-08-09: PR #731 MERGED `1356579ca`**
   (grant `86E976CA`) at the owner's dismiss-via-bot card word on the
   stale Aug-3 review; conservation proofs held exactly; head branch
   deleted. WS7 is now routable.
7. **WS7 — Estate migration.** One PR per concern group moving the
   flat canonicals into their concern, each proven conservation-clean
   per the WS6-proven instrument (clause amended 2026-08-09,
   discharging note (e)): adapter directory names + frontmatter
   byte-identical, the moved group's adapter bodies differing ONLY in
   the canonical-pointer line, every other skill's adapters
   byte-identical; plus `portability:check` green, full gates green.
   Placement judgment calls (†) are re-judged in each group's PR. The
   transitional flat/nested coexistence ends when the last flat
   canonical moves. Executor (owner card 2026-08-09): Director-run
   subagent implementers at the Director seat, expert-reviewed,
   landing via normal PRs.

## Acceptance (falsifiable)

- Depth: no canonical path deeper than `<concern>/<skill>/` —
  mechanical check, green after WS7 (and enforced from WS4 on).
- Twin-surface agreement: declared primary concern and tree position
  never disagree once WS4's validator lands; the validator proves
  itself by catching a deliberately mis-homed fixture.
- The Parallax family lands as namespaced flat members with NO new
  tree shape — the extensibility proof under the ratified rules.
- Fewer than ~20% of skills provoke placement debate; breach re-cuts
  the concern vocabulary rather than accumulating exceptions.
- Every canonical move preserves runtime summons names and adapter
  contracts: adapter directory names + frontmatter byte-identical,
  body diffs confined to the moved skills' canonical-pointer lines,
  all other adapters byte-identical (amended 2026-08-09 from
  "regenerated adapters byte-identical" — unsatisfiable while adapter
  bodies embed the source path, WS6 note (e)).
- Every index consumer-visible after WS4 is generated; a hand edit to
  a derived index fails a check.
- The grounding-direction check finds the two known inversions
  (proportionality, concept-exploration) before WS5 cures them, and
  zero after.
- Functional conservation (owner word 2026-08-02): every current
  lever behaviour — skill summons, always-applied rule loading,
  subagent dispatch, adapter generation, vendored-external operation
  — is preserved, or its change is owner-ruled; simplification never
  subtracts capability silently.

## Delivery

Structure ratified 2026-08-08 (frontmatter); the WS2 annotated-corpus
gate remains the plan's one owner gate. Execution seat: OPEN — the
owner declined resuming the previously pre-warmed Skills seat
(2026-08-08 word); a fresh owner-launched seat picks up the standing
reconcile route (comms event 1ce7086b, as amended by this
ratification). Sequencing: WS6 first (it unblocks the ledgered #731
disposition and lands the walker), WS7 groups in any order after,
WS1–WS4 as their own single-story PRs with WS2 carrying the owner
gate, WS5 cures independently schedulable. Single-story PRs
throughout at PDR-132 budgets. No ticket while the Linear embargo
stands (to 2026-08-10 08:00 London; mint-at-pickup owner-waived per
the standing ruling, recorded here as the affected artifact's stamp).

## Out of scope

- Designing the Parallax family's content (owner research; it is this
  plan's extensibility TEST, not its content).
- Any change to rule substance, skill substance, or subagent
  behaviour beyond the named WS5 cures — classification annotates,
  never rewrites.
- Any runtime naming change: vendor projections stay flat and leaf
  ids stable; a summons that works today works identically after
  every workstream.
- Cross-estate portability packaging (practice-core export) — the
  stratum annotations make that legible later; packaging is its own
  plan. (The apparent rhyme between concern groups and export
  boundaries is a noted association, not a design input — portability
  is the stratum axis's job.)

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface).

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-03 | Owner card (the MCP-673 implementing session) | The WS2 annotated corpus, presented for ratification | Ratified — owner verbatim: "Ratify the annotated corpus"; WS4's validators are unblocked; the gate row is removed |

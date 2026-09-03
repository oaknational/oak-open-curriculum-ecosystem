---
id: toolkit-re-architecture
node_type: strategic
name: "Toolkit re-architecture — the seam, finishable foundations, one clock per package"
overview: >-
  Re-architect the estate around the toolkit/oak seam so machinery is
  generic by construction, Oak products are thin and extractable, and
  the toolkit can build any digital service.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-19
ratified_where: >-
  In-session owner decision card at the repo-architecture seat (Poppy
  lifts Bark, d427b6), 2026-08-19 ~12:2xZ, answer verbatim "Ratify
  both" to the enumerated stamp scope — ratify this node AND mark
  workspace-reorganisation-programme superseded by it; the sitting's
  card trail is recorded in the lane thread record
  (typescript-estate-consolidation-review) of the same day.
serves: TOOLS-2
impact_areas:
  - practice-and-estate
  - packaging-and-distribution
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets:
  - MCP-619
last_updated: 2026-09-02
---

# Toolkit re-architecture

## Outcome

When this bet pays off, the code estate stands as two top-level
families — `toolkit/` (generic by construction, publishable by
default) and `oak/` (packs and assemblies, enumerable and measurably
thin) — held apart by one seam of three mechanical gates: imports
(`toolkit/**` never imports `oak/**`), lexemes (no Oak vocabulary
inside `toolkit/` sources), and manifests (toolkit packages
publishable by default). The five designed changes of the Oak Toolkit
Atlas (`.agent/reports/repo-architecture/oak-toolkit-atlas.html`,
owner-ruled 2026-08-19 across three decision cards) are live
properties of the estate rather than programmes: finishable
foundations admitted adopt-first; one clock per package with
untracked derivation as the default home; the seam itself; publishing
as the toolkit side's default state; and the workspace-liveness gate.

## User groups and value

*(Added 2026-09-02 as a dated additive amendment, routed off PR #915's
review: the strategic template gained this section at the owner's ruling
of 2026-08-31, after this node's ratification. Presented for the owner's
word with the split delivery plan, MCP-661; the ledger row below records
the routing.)*

- **Oak's in-repo services** (the MCP server, the search CLI, the
  demos): consume the toolkit the way any consumer would, so a change to
  machinery reaches them as a versioned dependency rather than a co-edit.
  Claim boundary: rung 1 of the ladder — proven when the services build
  from the published toolkit.
- **The extracted product squad**: a repository they own end to end —
  the knobs (configuration, styling, experience tuning) and the
  assemblies — with the levers arriving as published packages they never
  edit. In experience terms: a product change is one PR in one repo; an
  upstream need is a contribution to a library with its own release, not
  a visit to the Practice. Claim boundary: rung 2 (the extraction test);
  the residual upstream class is measured, never assumed (the split
  delivery plan's replay criterion).
- **An arriving non-Oak builder**: the published toolkit plus its
  documentation assembles a new service without Oak context. Offered
  value, not yet demonstrated — rung 3 is the honest test and no such
  builder exists yet; the claim is hypothesised until a greenfield
  demonstration service lands.
- **Teachers using Oak's product**: no experience change from the
  topology itself; the value routes through the squad's cycle time
  (fixes and features arrive sooner) and is claimed there, never here.
- **Agents working the estate**: the Practice stays with the toolkit,
  and the seam's three gates turn a review question ("could a non-Oak
  service consume this unchanged?") into a construction fact, so
  attention goes to product and machinery instead of classification.

## The bet

Serving TOOLS-2 (open by default, no lock-in), and carrying two
separate owner-stated reasons (2026-08-19) that must BOTH hold:

1. **Extraction.** Oak product workspaces are designed to leave —
   handed to a product squad carrying the knobs (basic config,
   styling, user-experience tuning) while the lever machinery the
   knobs turn stays behind, published.
2. **Any service.** The toolkit must be able to build any digital
   service or product — a builder who has never seen Oak starts from
   the toolkit alone.

The bet: constructed properties beat standing activities. One
enforced seam beats per-package classification; adopt-first beats
re-deriving what the ecosystem already finished; an inverted tracking
default beats case-by-case carrier taste; a liveness gate beats
recurring audits. The two reasons define the demonstration ladder —
generality is demonstrated, never asserted, and each rung falsifies
the ones below: (1) Oak's own in-repo services consume the toolkit;
(2) an extracted squad consumes it from the registry — the extraction
test is an oak product workspace building in a fresh repo from
registry dependencies alone; (3) an arriving builder assembles a new
non-Oak service from published toolkit packages and toolkit
documentation alone.

**Succession.** This node supersedes
`workspace-reorganisation-programme` (ratified 2026-08-14): the
ratification act for this node includes marking that node
`superseded` with this node as its named successor — the owner's
stamp performs both. What carries forward, evolved: generated output
separated from authored code (now the carrier contract with the
untracked-derivation default), reusable machinery freed from Oak
leaves (now the seam's construction rather than per-row moves), and
the census as evidence (now a one-time migration map; its
standing-instrument role ends). What is replaced: the ~66-workspace
target inventory and the five-root directory taxonomy, superseded by
the two-family topology at the owner's lens-4 rulings (2026-08-19).

Deliberately not doing: per-package classification as a standing
activity; a separate toolkit repository (deferred, with its flip
condition named in the Atlas: external toolkit adoption with
third-party contributors becoming a product goal); big-bang moves —
the seam migration lands as small reviewable PRs, each a two-round
changeset per the round-budget doctrine.

## Success looks like

- The seam's three gates run in CI and refuse: a toolkit→oak import,
  an Oak lexeme inside `toolkit/` sources, a toolkit package without
  a publishable manifest.
- `oak/`'s size is a reported number with a trend — the owner's
  "thinnest possible Oak" made measurable — and every oak product
  workspace passes the extraction test at its migration tranche.
- Rung-2 proof: at least one Oak product workspace
  extraction-rehearsed — built in a fresh repo from registry
  dependencies alone. Rung-3 proof: one greenfield non-Oak
  demonstration service assembled from published toolkit packages and
  their documentation alone, authored without Oak context as the
  honest test.
- Foundation packages admitted through question zero: adopted behind
  a thin conformance check where the ecosystem's canonical form is
  finished, owned to the charter bar where nothing external serves.
- The workspace-liveness gate runs estate-wide; `graph-ingest`,
  `graph-project`, and `oak-design-ink` carry recorded dispositions
  from its first run.
- Not claimed: npm naming and licence-edge decisions per package
  (owner questions at their tranches); the release mechanism
  (an owner decision carried by the seam delivery plan); that every
  current mixed workspace splits cleanly — the seam's falsifier
  stands, and true hybrids stop the line for remeasure rather than
  forcing residue into packs.

## Delivery

Delivery plans serving this node declare
`serves: toolkit-re-architecture` — enumerate them by search, never
by a hand-kept list. The banked dependency order from the owner-ruled
change set: the seam migration first (it carries the
release-mechanism owner decision and executes the census migration
map), then foundation cards per concept (question zero answered
first, per concept, at its own card), carrier moves under the
inverted default, and the liveness-gate validator. Each delivery plan
is authored by its implementer at pickup and sliced to two-round
PR-shaped units at authoring time. Milestones live in Linear as named
observable states; this node points at them, never mirrors them.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface); the picking-up
implementer enumerates and dispositions every row before implementation.

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-02 | PR #915 Copilot review (comment on this node's §The bet) | The node carries no "User groups and value" section; the strategic template (amended at owner ruling 2026-08-31, after this node's 2026-08-19 ratification) requires one, mapping the outcome's consumers (Oak's in-repo services, the extracted product squad, an arriving non-Oak builder — the demonstration ladder's three rungs) to experience-level value with claim boundaries. | Routed to the plan-corpus consolidation session that follows the split delivery plan (owner objective 2026-09-02: "make sure that the repo strategy is consistent and cohesive around that plan"): the section is authored there as a dated additive amendment presented for the owner's word, never inserted at a landing seat into a ratified node. |
| 2026-09-02 | Owner word on the #915 post-merge routings ("all of that goes into the same branch as the delivery plan, to minimise the total number of prs") | The row above: the "User groups and value" section. | Discharged on MCP-661's branch: authored as the dated additive amendment §User groups and value above, presented for the owner's word with the split delivery plan `oak-open-curriculum-mcp-extraction`. |

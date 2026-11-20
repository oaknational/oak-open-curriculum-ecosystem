---
id: mcp-137-design-system-semantic-merge
node_type: delivery
name: "Design-system semantic merge: zero-loss union of the original studio corpus and the repo's evolved copy"
overview: "Capture the original Claude Design corpus byte-preserved into git, build a complete divergence ledger against the repo, adjudicate every divergent surface at meaning level, land the union in the repo as the sole source of truth, then re-target design-sync to the original project and re-sync it up to the merged state."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Owner card via the Director, 2026-07-23 pre-compaction — ratify-now answer; S2 adjudication cards remain the surviving owner gate"
serves: first-major-release
impact_areas:
  - design-system
tickets:
  - MCP-137
depends_on: []
last_updated: 2026-07-25
---

# Design-system semantic merge

## Dated notes

- 2026-07-24 — The plan-ratification owner-gate row is DISCHARGED and
  removed (MCP-141 scan truing, granted by the Director scoped to this
  row + `last_updated`): the ratification stamp above IS the discharge,
  landed via PR #513 (merge 7a9dcce52, 2026-07-24). The S2
  adjudication-cards gate remains the live owner gate, untouched.
- 2026-07-24 (later) — **Amendment item 3's per-piece re-review is
  DISCHARGED**: every held-out piece was verified first-hand (the 14
  screenshots carry no PII; the brand toolkit PDF is Oak's own;
  `reference/` holds Oak token extracts; one file is the owner's own
  note source) and the owner ruled **"Commit all 39"** (relayed in the
  Director's design-lane assignment, comms event `f9a174ec`). All 39
  joined `studio-source/original-capture-2026-07-23/` byte-verified
  (sha256 + size, 39/39), completing the capture at 329 files —
  zero-loss now holds by construction for the WHOLE corpus. This also
  discharges the S4 precondition "the held-out per-piece re-review
  answered" (Amendment item 4); S4's remaining preconditions are owner
  confirmation of the original project's post-switch fate plus the
  account/consent/canEdit gate recorded on the MCP-137 ticket
  (2026-07-24 12:05Z comment).
- 2026-07-24 (S1/S2) — **The S2 due-card set is EMPTY** (Director ruling,
  comms event `317011f2-020d-48a6-a959-7b931759764c`, scored against the
  gate clause). Empirical basis: the S1 divergence ledger
  (#524, merge `4f4a1b3d8`) proves `diverged-both-sides` is empty — all
  23 semantic deltas are one-sided repo evolution, so no genuine
  design-judgment call exists; both S2 batches (keep-repo ×23,
  take-original ×2 dropped studio READMEs) are mechanical under
  protected-by-default and the item-5 adjudication lens. **The
  `owner_gates` row above stays and clears on the owner's sight of this
  discharge as a glance-item on return, not on the ruling alone.** The
  ruling reserves an owner card for any row where authoring-time doubt
  arises; none did.
- 2026-07-25 — **Both owner gates are DISCHARGED and the S2 row is
  removed** (`owner_gates` now empty). At the owner's visual-review
  walk (full session, all surfaces): the S2 vacuous-discharge record
  was seen and the gate CLEARED ("Seen — gate clears" card answer);
  the S4 studio glance was COLLECTED WITH A FINDING ("Seen — has
  issues"): the remote estate needs curation — "organised, make sense,
  and have every single entry earn its place". That finding is scoped
  and ruled as MCP-160 (delete-reconciliation instrument + three-phase
  curation sync; eight owner rulings embedded in the disposition pack).
  Durable records: Linear MCP-137 comment `637ac335` (walk outcome) and
  the evidence pack
  `.agent/state/collaboration/handoffs/2026-07-25-cormorant-walk-pack/`.
  Local surfaces were owner-approved in the same walk ("theming is
  good… all remaining cards… really fantastic"); the walk's fix-now
  feedback and contract-shaping items are recorded in the pack's
  feedback ledger and routed via MCP-160 (cures) and the design-lane
  contracts.

## Goal

One design system again. The repo holds the complete union of the
original studio exploration (print/projector/worksheet styles, three
identities, four themes, the component/design/token sections) and
today's iteration innovation (the landing page, dark-token
refinements, source fixes) — with **nothing lost from either side**
(owner's absolute constraint, 2026-07-23) — and the original Claude
Design project (`314dd517-…`) becomes the go-forward studio, re-synced
from the merged repo state.

## Mechanism

Zero-loss holds **by construction, not by care**: the first act lands
the entire original corpus byte-preserved in git, after which no later
step — including a botched re-sync's delete-reconciliation — can
destroy anything, because both corpora are in git history. The merge
is then a calm, fully-enumerated adjudication: a mechanical ledger
classifies every path; meaning-level judgment (not timestamps)
decides each divergent surface; the owner rules only on genuine design
calls. The repo is the design source of truth throughout (ADR-213);
content flows studio→repo exactly once (the capture), then repo→studio
forever after.

## Amendment — 2026-07-24 (owner rulings at execution pickup; recorded by the executing seat)

1. **Three-tier model** (owner, verbatim): *"We need a preservation of the prior system so it
   cannot be lost, we need a preservation of the system in Claude Design on this account, so it
   cannot be lost, and we need our working system. The working system must not contain stopgaps,
   the preservation folders must contain pure and full copies from their respective sources. Once
   we have satisfied about the final state of our working design system workspaces we can remove
   the preservation copies, but they will still exist in the git history, which is good."* S0
   therefore lands **two** preservation folders: the original-project capture named below, and
   `studio-source/iteration-pull-preservation-2026-07-23/` — the pristine as-pulled 2026-07-23
   pull-set, uncleaned, including the overlay and both candidate explorations. The plan also gains
   a terminal owner-gated step: a removal PR deletes both folders from the tree at the owner's
   satisfaction after S5 (git history is the permanent record).
2. **Acquisition** (owner choice): S0's corpus came down as the owner's studio export
   (2026-07-24 11:41), verified complete against a fresh `list_files` denominator (329 = 329,
   zero diffs) and byte-faithful on two independent hash witnesses. The API's 256 KiB cap
   therefore left **no** unfetchable residue — the `unfetchable` manifest class is empty, and S4's
   discharge precondition for it is satisfied by construction.
3. **Held-out classes** (owner, verbatim in substance): S0 landed every import-era held-out piece
   in full, byte-faithful, in the local gitignored staging tier
   (`packages/design/design-import/original-capture-held-out-2026-07-24/`, primary checkout). The
   import-era hold-out dispositions are hypotheses only: the owner re-reviews **every piece** at
   the S1/S2 card ("I was not involved in the prior decision making").
4. **S4 sequencing** (owner choice): S4 runs after S3 and before the MCP-128 port. Two
   preconditions gate it: the held-out per-piece re-review answered, and owner confirmation of the
   original project's post-switch fate. The up-sync file-set derives from working surfaces only,
   excluding both preservation folders by name.
5. **S2 adjudication lens** (owner correction): the design system is a multi-layer product —
   framework-agnostic token workspace at depth, simple then complex components per target system
   (currently React, React-in-NextJS, Ink; trivially adaptable further) — per the generality-depth
   gradient. External framing (e.g. the export bundle's "recreate pixel-perfectly" wrapper) does
   not overrule this; resolve divergences toward token-tier generality, never flattened
   recreation.

## Slices

Each slice is a single-story PR within its round budget (PDR-132).

### S0 — Full-fidelity capture (mechanical; the zero-loss act)

**Pre-flight (owner word, 2026-07-23: "make sure what we have today is
safe in git history before we change anything")**: before any fetch or
edit, verify first-hand that today's state is already git-held —
`git status` clean and even with origin on every design-relevant
surface; the iteration pull-set present on main (landed via #511 at
`.agent/reports/mcp-128-landing/`, 15 files); the MCP-132 fixes on
main (981a2543a). Any unsafe finding stops the lane and routes before
S0 proceeds.

Acquire the ENTIRE original corpus (project `314dd517-…`) byte-perfect
into a clearly-marked capture area:
`packages/design/oak-design-system/studio-source/original-capture-2026-07-23/`
(pre-adoption staging tier — deliberately outside build/lint gates per
the ADR-213 §1 boundary; verify the staging area's existing gate
exemptions cover it, and extend the same ignore entries if not — never
a new exemption class). Acquisition mechanism as executed (owner
choice, 2026-07-24 — replaces this slice's drafted DesignSync
`get_file` loop, per Amendment item 2): the owner's studio export
supplies the bytes; the API supplies the `list_files` denominator and
spot verification, so the 256 KiB fetch cap never binds and the
`unfetchable` class is empty by construction. A future re-capture that
cannot use an export falls back to per-file fetch, where genuinely
unfetchable files become ledger rows marked `unfetchable` with an
owner-assisted export path — **never a silent skip**. The PR body
carries the fetch manifest: every remote path with its disposition.

- Acceptance: every path in the project's `list_files` output appears
  in the manifest with a disposition; capture directory contents are
  byte-identical to fetched content (spot-verified by re-fetch hash on
  a sample). Proof: `repo-safe` (manifest + hashes in the PR).

### S1 — Divergence ledger (mechanical)

Git-vs-git diff: the capture (S0) against the live package surfaces.
Every path classified exactly one of: `identical` / `repo-evolved`
(repo changed it since common ancestry) / `original-only` /
`repo-only` / `diverged-both-sides`. Every `repo-evolved` and
`diverged-both-sides` row ALSO carries a **provenance column**
(owner ruling, 2026-07-23 ~21:45: the repo state as iterated by Heron
is a fourth first-class source): which evolution the repo side came
from — import-era content, the Heron-era 2026-07-23 fixes, or the
iteration-pull — derived from `git log` per path, so the adjudication
sees four sources, not two sides. Ledger lands as
`.agent/reports/mcp-137-divergence-ledger.md` with counts and the
completeness denominator stated. The owner's named inventory (print,
projector, worksheet styles; three identities; four themes;
component/design/token sections) is mapped to concrete paths in the
ledger — any inventory item with no path is a finding, not a gap to
ignore.

- Acceptance: zero unclassified paths (`sum(classes) ==
  |union(paths)|`, stated in the ledger); every inventory item mapped
  or flagged. Proof: `repo-safe`.

### S2 — Semantic adjudication (judgment; owner cards where genuine)

Per the disposition-ledger discipline: every `diverged-both-sides` and
`original-only` row gets a recorded decision — `take-original` /
`keep-repo` / `merge-both` (a composed file preserving both meanings) /
`capture-only` (stays in the capture area as record, e.g. studio build
outputs, scaffolding the owner leaves studio-side). Batch the
mechanical classes; card the owner ONLY on genuine design calls.
Today's landed fixes (MCP-132) and the iteration designs are
protected-by-default: no `take-original` may overwrite them without an
explicit owner card. Cross-check with Heron's in-flight chain before
touching any shared CSS file.

- Acceptance: every non-identical ledger row carries a decision and a
  rationale; zero silent drops. Proof: `repo-safe` (the adjudicated
  ledger).

### S3 — The merged state lands

Apply the adjudications as one or more reviewed PRs (sliced
single-story). Post-landing obligations in-slice: regenerate
`oak-flat.generated.css`; re-validate the conventions header's class
vocabulary against the built CSS; CHANGELOG entry (the merge is a
MINOR at least — new surfaces join the public contract); LICENCES/
LICENSING-MANIFEST reconciled (the original carries licence records
the repo's manifest must absorb).

- Acceptance: the union checklist (S1's inventory mapping) fully
  accounted for in the merged tree; all gates green; changelog and
  licence surfaces current. Proof: `repo-safe`.

### S4 — Re-target and re-sync (only now safe)

Update `.design-sync/config.json` `projectId` → `314dd517-…` (owner
word: the original project is the go-forward studio). Full re-sync
repo→studio per the design-sync runbook (flattened CSS regenerated
first; conventions re-validated; component previews become mandatory
if the component tier has landed by then). Delete-reconciliation is
now safe by construction: everything it could remove is in git.

- Acceptance: the studio project renders the merged state; the sync
  sidecar (`_ds_sync.json`) current; config committed. Proof:
  `repo-safe` + one owner glance at the studio (`owner-held`).

### S5 — Completeness verification (the exit gate)

Walk the owner's inventory one final time against BOTH surfaces (the
repo and the studio): print styles, projector styles, worksheet styles, three
identities, four themes, component/design/token sections, today's
designs. Each item: present, working, and cited (path + proof). Handoff
note to MCP-136: the 3×4 matrix work now builds on the merged base.

- Acceptance: the inventory table fully green in the PR that closes
  MCP-137. Proof: `repo-safe`.

## Out of scope (named homes)

- The 3×4 identity/theme matrix build (per-identity high-contrast and
  colour-safe) — MCP-136, which builds on this plan's merged base.
- Component-tier adoption — MCP-134 (gated open by ADR-213 amendment,
  landed).
- Token SSOT convergence / generic-engine split — MCP-135 + the Oak
  Surface Isolation programme tranche 2. This merge must not entrench
  Oak-specificity in surfaces those lanes will generalise, and must
  not pre-execute them.
- Any change to the landing-page port chain (Heron's lane) beyond the
  S2 coordination check.

## Risks

- **Shared-file collision with Heron's chain** — mitigated: S2
  cross-check named; Heron's landed fixes protected-by-default.
- **Unfetchable oversized/binary files** — mitigated: hash-compare
  fallback + `unfetchable` ledger class + owner-assisted export path;
  never silent.
- **Adjudication volume** — mitigated: batched dispositions
  (disposition-ledger discipline); implementation sized to unique
  substance, never input count.
- **Stale-capture inversion** (the repo's own history warns: old
  copies reverting approved versions through clean merges) —
  mitigated: `take-original` on any repo-evolved path requires an
  explicit card; the default protects the repo's evolution.

## First question

Could it be simpler without compromising quality? Yes, and it was made
so: no branch archaeology, no three-way git merges across accounts —
one capture, one ledger, one adjudication pass, one re-sync. The
capture-first move is what buys the simplicity: everything after it is
ordinary reviewed repo work.

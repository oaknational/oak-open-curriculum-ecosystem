---
boundary: B2-Architecture
doc_role: record
authority: design-review
status: active
last_reviewed: 2026-08-08
---

# Wow-verdict register minting record — 2026-08-08

The register minted by the completion plan's W0.7 — the owner-editable data
beside this record (`../wow-verdict-register.json`) and its boundary parser
with same-PR unit + integration suites at
`agent-tools/src/validators/wow-verdict-register/` — recorded at minting by
the design seat (Civet spins Cavern, 054f5e). The split home is the
2026-08-08 Director ruling on the friction-ratchet escalation: the parser
lives with the estate's validators on the plan-schema precedent (the
register is cross-demo, so no design workspace owns it); the rubric,
records, and data live here in the design estate's permanent doc home.
FALSIFIER, live: if a checkpoint consumer ever imports the parser from a
design workspace's build or test graph, the agent-tools home is wrong —
one grep re-tests it at the W1.3 authoring.

## Migration from the 2026-08-05 pre-register

Per the sitting record's own minting contract
(`.agent/reports/design/design-sitting-records-2026-08-05.md`: "every
verdict row below migrates into that register at its minting, and tweak
entries feed W0.5's intake surface"), exactly one verdict row existed and
is migrated:

- **Verdict 1** — showcase root (`/`, `oak-design-showcase`): FAIL
  (pre-read, owner verbatim via Director relay, comms event
  2026-08-05T14:56:30Z). Carried as a `pre-read`-class row (the instrument
  did not exist at that read, so instrument-leg results are absent under
  the schema's optional arm).

The W0.5 tweak-ledger items (owner-numbered 1–10, no item 5) are NOT
register rows: the record routes them to W0.5's intake surface, and the
plan absorbed them at the 2026-08-08 W0.5 fold (PR #828). The
2026-08-08 Cricket run's judgement-medium-adversarial dissent read items
2/6/7 as unmigrated page-verdicts; the resolution above is the record's
own artefact-class separation.

## Inherited instrument findings (from the merged #784 adjudication addendum)

Four findings bind FUTURE instruments and route to story cards; recorded
here so the cards inherit them from a durable home:

1. **Folly attestation pins its upstream** — an immutable Oak Components
   commit sha or content digest, fetched at audit time (stores no official
   values). Home: the folly/identity story card.
2. **Delta-E names its formula** — CIE76 / CIEDE2000 / OKLCH-native deltas
   differ materially; the story card names the formula and threshold
   convention before the just-noticeable-difference band becomes a target.
   Home: the folly/identity story card.
3. **Attestation semantics under exemptions** — zero-exact-match binds the
   NON-EXEMPT expressive families only; exempt values (pure white, true
   black, the generic grey ramp; ci-\* exact by scientific provenance) are
   enumerated with their grounds. Home: the folly/identity story card.
4. **Editable-slides data boundary** — localStorage persists across
   sessions and is same-origin-readable; the story carries auto-clear or
   expiry, a reliable reset, and no-sensitive-input guidance. Home: the
   editable-slides story mint (plan W4.8).

## Fixture-corpus derivation note (for the calibration PR)

"The export's composed pages" resolves to the three identity FRONT PAGES
the export's own gallery wrapper (`Example Front Pages.html`) frames:
`studio-source/ui_kits/oak/index.html`; the PDS identity's front page
under `studio-source/whitelabel/` (its directory bears the identity's
pre-rename name); and `studio-source/whitelabel/creature/index.html`
(EMC²). This is the export's own
closed three-file set, never a seat-authored sample; the census-derivation
chain (sitemap → axe/Lighthouse page lists) binds the REBUILT demo's page
lists, and W0.1's census later confirms the correspondence
(2026-08-08 Cricket run, judgement-high-adversarial redirection, adopted).

## Schema notes at v0

- `identity`/`theme` are CLOSED enums (review-round supersession of the
  first draft's open strings, on the closed-shape rule): the plan's three
  identities (`oak`, `emc2`, `pds` — the target-state name) and the theme
  runtime's five presets, read first-hand from `oak-theme.js` at
  authoring. The schema is versioned; the rosters evolve with it at the
  W0.10 taste-anchor sittings or an identity rename — never by an open
  string absorbing typos into the coverage data.
- `rowClass` is a DISCRIMINATED UNION of three row classes. `checkpoint`
  rows (shown to the owner) require the owner verdict, date, and all
  three instrument-leg results; `pre-read` rows carry legs optionally.
  The third class, `instrument-blocked`, is a schema EXTENSION beyond the
  plan's stated field list, adjudicated at the PR review round: a leg
  FAIL blocks the render from reaching the owner (the plan's own
  semantics), so the blocked case has NO owner verdict — the row carries
  the leg results plus the Director disposition (the Quality-bar rule-3
  shape), and owner fields are reserved for rows the owner actually saw.
  Without it, the miss-rate obligation could not record exactly the rows
  where the instrument asserted itself.
- Each leg's evaluation is per-criterion and EXHAUSTIVE (the enum-keyed
  record refuses a partial evaluation), with a note required on any
  non-PASS criterion — the rubric's per-criterion promise made
  mechanical.

# W0.1 census — cycle plan v2 (post-review re-author)

Supersedes v1 after the pre-execution code-expert round
(PROCEED-WITH-REVISIONS, findings 1–19) and the focused
architecture-expert-fred home verdict. Two Director answers gate the
start: (G1) the sitemap deviation ruling (ARC 07:28:47Z entry); (G2) the
ADR-213 §2 shrink-clause interpretation (ARC addendum). The shapes below
assume both answers land as verdicted; either answer landing differently
re-authors only its own section.

## Homes (fred's verdict, evidence in his report)

- Pure modules: `packages/design/oak-design-tokens/src/design-census/`
- Walker+validator: `packages/design/oak-design-tokens/scripts/validate-design-census.ts`
  (thin caller; tsx; NO second turbo-build prelude — chain into the
  EXISTING validate-design-system-consistency invocation in root
  package.json:44, whose design-tokens-core build prelude is turbo-cached)
- Committed artefacts: `packages/design/oak-design-tokens/census/` with an
  exports subpath `"./census/*": "./census/*"`; `files` array gains
  `census`. Consumers import through the exports map (real graph edges).
- Same-PR hygiene: true up the workspace package.json description (already
  stale against the two resident validators).

## Artefact + ledger shape (findings 1, 2, 17 adjudicated)

- `census/page-census.generated.json`, `census/feature-census.generated.json`
  — PURE derivations, no hand-authored content, emitted THROUGH prettier
  (readable diffs; byte-stable for the deep-equal). The `.generated.json`
  suffix signals never-hand-edit; prettier exemption irrelevant since the
  emitter formats.
- `census/dispositions.json` — HAND-AUTHORED path-keyed ledger, each row:
  `{ path, disposition, grantedAgainst: <content fingerprint>, note? }`.
  Restricted PAGE vocabulary at parse: `express-composed` |
  `owner-accepted-exclusion`. Class rows and gap rows use their own
  restricted sets (incl. the .ic-* and print/deck exclusions).
- Validator obligations (recompute, not record): deep-equal BOTH generated
  artefacts against a fresh derivation; bijection ledger↔rows both
  directions (new row = fail loud; vanished row = fail loud); fingerprint
  recompute per ledger row (stale grant = fail); parity lines (below).
  W6.4's refresh is this same code path, zero extra mechanism.

## Domain + parity methods (findings 3–6, 15, 16 pinned)

- Stylesheet domain DERIVED from `styles.css`'s `@import` closure; any
  kit-root `*.css` outside the closure hard-fails without an explicit
  disposition (brand.css = the known consumer-override exemplar row).
  Non-vacuity guard is DOMAIN-level (styles.css legitimately yields zero
  classes).
- Class census covers ALL published classes (`.oak-*` AND the 16 `.ic-*`
  rows), print/deck + .ic-* carrying explicit `owner-accepted-exclusion`
  dispositions. Parity line pins its METHOD (postcss selector parse,
  comments excluded) and cross-checks against a second comment-stripping
  method — the naive 131 is comment-contaminated (real selectors ≠
  comment mentions) and is NOT used.
- Page walk parity: walked count vs an independent `git ls-files`
  enumeration of the domain (two methods must agree) — covers the
  walker-level declared-but-absent direction no unit test can express.
- Token-root parity pins distinct-roots-across-files (47) as the method,
  names contrast-pairings.json as excluded-not-a-token-tree, and lists the
  8 dtcg files with their roles.
- Path keys: repo-relative, POSIX separators, byte-exact case (never
  toLowerCase); duplicate ledger keys = hard error.

## Classifier design (findings 12, 13; advisories 10, 11)

- Page classifier emits mechanical EVIDENCE columns only (links kit
  sheet?; local <style>?; framing-prose state) — never the word
  `reference` (owner-reserved vocabulary; folds/demotions are HIS batched
  W1.4 card).
- $type gap split: alias-inferable = FULL-STRING single-alias match (a
  composite containing `{…}` refs is NOT inferable — 34 such rows exist);
  group-inheritance leg gets a PLANTED fixture (zero real instances in the
  corpus today — 552 leaves: 416 typed, 51 alias, 0 group, 136 untyped ⇒
  the exclusion ledger is ~85 rows, sized into slice C's disposition
  work).
- Reuse: `collectTokenLeaves`, `validateTreeRoots` from design-tokens-core;
  EXPORT `byCodeUnit` from code-unit-sort (second consumer) — never
  localeCompare.

## Tests (finding 14 closed)

- All census logic in src/ with colocated `*.unit.test.ts`; injected
  `{path, contents}[]` everywhere; bidirectional planted fixtures;
  restricted-vocabulary refusals; fingerprint staleness; bijection cases.
- NO filesystem seam in tests, no hedge clause: the walker's proof is the
  validator inside `repo-validators:check` + the git-ls-files parity line.

## Sitemap (gate G1)

- W0.1 lands the PURE derivation `pageCensus → pageList` + parity line
  (sitemap-entry candidates == express-composed rows). NO XML artefact at
  W0.1 (78 of 79 URLs would 404; path→URL is a decision). XML lands at W3
  via showcase `app/sitemap.ts` against a declared route map with an
  every-URL-resolves gate. (If the Director cards it and the owner rules
  otherwise, this section re-authors alone.)

## PR slicing (finding 8; estate bands)

Same story, same ticket, four PRs:

- **A**: `src/design-census/` types + parse + refusal tests (mirror
  contrast-manifest-parse; ~5 files).
- **B**: the two classifiers + planted-fixture tests (+ the
  design-tokens-core `byCodeUnit` export; ~6 files).
- **C**: walker + validator + root-chain/knip wiring + generated artefacts
  - the dispositions ledger (~7 authored; artefacts generated; the ~85-row
    gap-census disposition load lands here).
- **D**: the pageList sitemap derivation + parity (small; may fold into C
  if C stays under band — decide at C's close, never before).

## Wiring checklist (findings 18, 19; fred's obligations)

- knip: add `scripts/validate-design-census.ts` to the oak-design-tokens
  entry array (same-cycle as the script lands, PR C).
- Root chain: extend the existing validator leg — no new turbo prelude.
- CI: none (repo-validators:check already a parsed leg).
- depcruise: none (script imports src/ modules — no orphan).
- prettier: generator emits through prettier; ledger formatted normally.

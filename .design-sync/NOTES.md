# design-sync NOTES — oak-design-system

- **Estate-declaration edits re-run the match-count check** (2026-07-25,
  graduated from distilled 2026-07-30): `estate.json`'s keep/ship
  declaration pairs matching `paths` arrays with provenance `sources`
  arrays — a `sources` entry added without its `paths` twin leaves the
  file's own delete-contract free to delete the very file being adopted
  (first-hand near-miss, design lane). Any edit to the declaration
  re-runs the match-count check for the touched path (must be exactly 1)
  before commit; symmetry between parallel arrays is a review tripwire,
  never a given.
- Tokens-only sync (2026-07-23, first sync): the package deliberately
  exports no React components (ADR-213 §3 as landed). Owner's original
  vision includes the full building-block set — an owned React
  component tier is planned via ADR-213 amendment (sitting seed 11);
  when that package exists, add it via `extraEntries`/entry change and
  re-sync; the conventions header's "no React components" line must be
  rewritten then.
- `--entry` is `packages/design/oak-design-system/oak-theme.js` (the
  only JS export — the theme switcher). `--node-modules` must point at
  a workspace that carries react (pnpm strict hoisting keeps the root
  sparse): `apps/oak-curriculum-mcp-streamable-http/node_modules`.
- The converter copies `cssEntry` VERBATIM and does not follow its
  relative `@import`s — the package's real `styles.css` is an
  import-list, so we build a flattened entry with
  `pnpm --filter @oaknational/oak-design-system build:flat`
  (writes the gitignored `oak-flat.generated.css`). REGENERATE IT
  whenever any tier CSS changes, before any re-sync — a stale flat
  file ships stale styles silently.
- Two dead `@font-face` blocks are dropped at build (Lexend/RobotoMono
  faces whose urls point outside the copied set) — the surviving four
  rules cover both families; fonts verified shipping in fonts/.
- **REQUIRED cargo: `assets/` ships with every sync** — `assets/icons/`
  (the whole `--ic-*`/`--i-*` mask-icon set) plus the root `assets/*.svg`
  (logos, brand shapes, favicon). The flat CSS references them by
  relative `url('assets/…')`, so they must land beside the bundle CSS at
  the same relative paths. The 2026-07-23 first sync omitted them — the
  root cause of the workspace's Cloudinary-hotlink stopgap (killed by
  MCP-132; hotlinks are not an acceptable state on any surface). Verify
  after every sync: pick two `--i-*` urls from the shipped CSS and
  confirm the files exist at those paths in the project.
- DTCG JSON (dtcg/\*.json) ships by **direct write** every sync (owner
  ruling 2026-07-25, MCP-160): the converter cannot carry it
  (`tokensGlob` requires a `tokensPkg` resolvable from node_modules and
  the DS package is not installed anywhere), so each sync writes every
  `dtcg/` file verbatim via DesignSync (nine at 2026-07-25; the set
  grows with the export) and verifies remote hash == repo canonical. Every custom property also ships via the
  CSS — validate counts them at each sync (474 at the 2026-07-23 first
  sync; the count grows as tokens land).
- **Direct-write set** (shipped current from repo canonicals each sync,
  alongside the pipeline; sources named in `estate.json` §directWrites):
  `dtcg/` ×9 (above), `LICENCES.md`, `CLAUDE.md`, and the three non-md
  docs to `guidelines/docs/` (`headless-a11y-frameworks.html`,
  `nextjs-theme-mapping.css`, `nextjs-theme-switcher.tsx.txt`) —
  owner-ruled to ship 2026-07-25 ("the Claude Design agent is an expert
  who needs to check and ratify those documents") and mechanically
  outside `guidelinesGlob`, which accepts `.md`/`.mdx` only (verified:
  `lib/docs.mjs` `matchGlob`/`isDocExt` rejects non-md both as literals
  and as glob matches). Also `SKILL.md` (adopted 2026-07-25 under the
  owner's usefulness formula): ship the body of
  `.agent/skills/design-system-usage/SKILL-CANONICAL.md` with the studio
  frontmatter block (`name: oak-design`; the canonical's `description`;
  `user-invocable: true`) in place of the repo frontmatter — edit only
  the canonical, never the shipped copy.
- Render check: zero component previews exist (tokens-only), so
  validate runs `--no-render-check` — accepted as vacuous 2026-07-23;
  revisit the moment components join the bundle (then previews MUST be
  authored and machine-verified).

## Re-sync risks

- `oak-flat.generated.css` is derived — regenerate via the package's
  `build:flat` script (added 2026-07-23, closing the former
  no-generator-script staleness risk) before every re-sync.
- The conventions header enumerates the class vocabulary BY NAME —
  re-validate every name against the fresh `_ds_bundle.css` on every
  re-sync (grep loop in the sync transcript, 2026-07-23); classes
  renamed or removed in components.css will otherwise be taught wrongly.
- Naming (owner ruling 2026-07-23): the org's official "Oak Design
  System" is a SEPARATE, largely Figma-based system. This repo's system
  is the **Oak Open Curriculum Design System** — repo-scoped for now.
  Repo-scoped design surfaces carry the full name; never claim this is
  the org's design system.
- `.design-sync/config.json` `projectId` targets the **ORIGINAL**
  Claude Design project `314dd517-493d-4be2-bd08-56ae0e80e780` — the
  owner-ruled go-forward studio (MCP-137 S4, 2026-07-24; gate-discharge
  pointer: the Director's S4 event of ~20:08Z). Two projects named
  "Oak Open Curriculum Design System" exist across accounts — always
  resolve by projectId, never by name. The 2026-07-23 first sync went
  to the interim project `634a588e-…`; that project is superseded as a
  sync target and this config must never point back at it without a
  fresh owner ruling.
- Mechanical claim re-verification at every sync-back: before ANY
  up-sync, re-verify the claims the conventions header and README make
  against the fresh build (class vocabulary, counts, capability
  claims) — never carry a claim forward on memory (Heron's process
  rule, gated to land at MCP-137 S4).
- Theme screenshots settle ≥150 ms past the theme transition before
  capture — earlier frames record mid-transition colours and fail
  visual comparison falsely (Heron's process rule, same gate).
- MCP-137 S4 write-set deviations (owner/Director-adjudicated, see the
  S4 comms thread): the studio-native `_ds_bundle.js` (the studio's own
  compiled component bundle, load-bearing for its specimen cards) is
  NOT overwritten by the pipeline's theme-only bundle while the repo
  exports no components; the five tier CSS files + `oak-theme.js` ship
  alongside the flat `styles.css` because studio design surfaces link
  tier files directly. The S4 no-prune deviation ("no
  delete-reconciliation of studio-native surfaces") is RETIRED by the
  owner's delete-reconciliation ruling of 2026-07-25 — see the
  reconciliation step below.
- **Single-home rule** (owner ruling 2026-07-25, card answer "one copy
  only"): never ship the same document to two remote paths — every
  document has exactly one remote home. Worked consequence: the root
  README (converter-generated, the project pane) is README's single
  home; `README.md` is dropped from `guidelinesGlob`, and the MCP-160
  curation sync deletes the residual `guidelines/README.md` (the ruled
  removal set grows to 45). Divergent stale twins were already the
  defect class; this ruling removes the same-canonical two-copy
  allowance too.
- **Estate reconciliation at EVERY ordinary sync** (owner ruling
  2026-07-25, MCP-160 — the durable curation instrument; "every single
  entry earns its place"): `estate.json` beside this file declares the
  complete remote estate (globs + literals). At each sync, after the
  ship phase: `DesignSync list_files`, match every remote path against
  the declaration, and DELETE every unmatched file — after verifying
  each doomed path's live sha256 against the committed capture record
  and re-capturing any drift into the byte-record first (zero-loss
  precondition). Every intentional addition to the remote estate lands
  as an `estate.json` entry in the same change; an unmatched remote
  file is by definition residue. Adoption evidence: the ruled
  disposition of all 346 then-remote files reproduced the binding
  44-path removal list exactly from this declaration
  (2026-07-25 closure check; evidence pack
  `.agent/state/collaboration/handoffs/2026-07-25-cormorant-walk-pack/`).
- **Glob-orphan amendment (owner-ratified 2026-07-25, card answer "Ratify
  the amendment")**: remote files under a `shippedFromRepo` glob with no
  repo counterpart at the mapped source are residue and delete at every
  sync (capture-first precondition unchanged). Provably necessary: the
  ruled `guidelines/README.md` deletion was inexpressible under strict
  matching (shielded by `guidelines/**`); same class as the two
  `assets/logo-*-official.svg` twins the MCP-164 cures removed from the
  repo. MCP-160 curation delete set = 44 unmatched + 3 glob-orphans = 47.
- **Verify rows resolved (2026-07-25, first-hand)**: `_ds_bundle.css`
  KEEP — the live remote `styles.css` is exactly two `@import`s and it is
  one of them (every rendered design consumes it); `_adherence.oxlintrc.json`
  KEEP as machinery — the capture manifest records it `fetched-committed`
  2026-07-23, pre-dating our syncs (studio-native); `icons.json` DELETE
  confirmed — README records it as provenance-reference-only, never
  loaded; capture-verified; no consumer. `estate.json` pending rows
  resolved accordingly (only the `_ds_bundle.js` succession row remains).
- **CLAUDE.md repo canonical**: `packages/design/oak-design-system/CLAUDE.md`
  — the studio's normative instruction re-trued from the live copy (the
  HANDOFF.md session-protocol paragraph dropped with its deleted
  counterpart); ships by direct write each sync per §directWrites.
- **Curation sync EXECUTED 2026-07-25 (~18:50Z, MCP-160)**: ship 153 (152
  via DesignSync + sentinel; CLAUDE.md refused — see next bullet) →
  capture-verified delete 47 → estate certified: 305 remote files, exact
  match to the computed expectation, declaration closure clean (sole
  unmatched path is the transient `_ds_needs_recompile` sentinel the app
  consumes). P5 record: 46/47 byte-committed in the capture tier with
  manifest-matching sha256; `guidelines/README.md` is converter-derived
  from the repo README (git history holds every version); live-drift
  checked on the rewrite-prone HANDOFF.md (structurally identical to
  capture, self-dated before it). `_ds_sync.json` left byte-unchanged
  deliberately: its styleSha is now conservative-stale, which forces
  re-verification rather than false cache hits.
- **CLAUDE.md is a Design API reserved path** (discovered at this sync):
  instructions to the design agent are unwritable by DesignSync
  regardless of the approved plan. The estate declaration now carries it
  under `ownerMaintained`; updates are owner-executed in the studio UI
  from `packages/design/oak-design-system/CLAUDE.md`. The bulk-delete
  leg also required project-owner login (editor rights suffice for
  writes only) — plan owner-presence for any future delete-bearing sync.
- **thumbnail.html reclassified** shippedFromRepo → machinery: it has no
  repo source (studio-generated; the package .gitignore records it) —
  the shippedFromRepo claim was untrue for it.
- **Design work is shown as rendered pixels in Chrome, never artefact
  paths** (owner standing discipline, promoted from buffer memory
  2026-07-31 — verbatim: "show me first, then discuss"): the done-test for
  any design change is pixels in front of the owner in the browser; a
  verified substrate with no rendered pixel shown is not done.
- **The generality-depth gradient, defined** (cited by
  `studio-source/PRESERVATION-README.md` as co-equal with ADR-213, promoted
  from buffer memory 2026-07-31): deeper layers are MORE general — semantic
  tokens are never Oak-specific; brand specificity enters only at the
  shallow identity/theme layer (the 3×4 identity/theme matrix). A deep
  layer that names Oak is a layering defect.
- **Backfills from the 2026-07-31 consolidation run** (machine-local review
  records → this surface): reviewers found BYTE-IDENTICAL duplicate pairs
  inside the kept `assets/` set (e.g. `logo-full-black.svg` ==
  `logo-full-official.svg`) — dedup is owed at the next asset pass; the
  owner RATIFIED the EMC2 creature-demo quest-card layout (hero region,
  one loud quest card) — the ledger record is the authority for its
  specifics; the owner ruled the three studio integration docs SHIP (not
  deleted) because the Claude Design surface needs them; and the studio
  UUID `314dd517…` already appears on public surfaces beyond the S0 doc,
  so any future redaction must be cross-surface or not attempted (F6,
  2026-07-24).

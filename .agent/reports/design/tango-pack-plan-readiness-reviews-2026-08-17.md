# Tango pack node — readiness-review record, 2026-08-17

Three Opus readiness passes over `tango-identity-pack.plan.md` (born-sketch,
pre-ratification), run at the authoring seat (Yarrow stirs Undergrowth,
`ab1066`) per the plan skill's readiness discipline: **accessibility** (Y1–Y14,
verdict READY-WITH-FIXES), **design-system** (D1–D20, verdict NOT-READY with
four blockers), **assumptions + frame-challenge** (S1–S20, verdict
READY-WITH-FIXES). Every finding carries a disposition; the cure pass was one
batch, landing in the same commit as this record. Disposition vocabulary:
**absorbed** (plan text changed), **card** (routed to the ratification card),
**residual** (declared in the plan as known-open, with its owner), **refined**
(absorbed in adjusted form, reason stated), **counterweight** (no change
needed, recorded).

The three full reports lived in the session; this record compresses them
without loss of any actionable finding. All evidence was first-hand
(file:line cited in-session); load-bearing citations were re-verified by the
authoring seat before absorption (the ratified W1 slice B guard spec, PDR-132
clause 5, the workspace programme's taxonomy and generated-tier rules).

## Accessibility (Y1–Y14)

| ID | Sev | Finding (compressed) | Disposition |
| --- | --- | --- | --- |
| Y1 | 5 | The a11y matrix roster is a separate hand-kept const (`tests/apply-state.ts:22`); the pack mechanism as drafted lets an identity render with zero a11y cells — an accessibility bypass shipped as a feature | **absorbed** — the generated roster module feeds the test matrices too; AC2 now proves a pack arrives WITH its cells; decision-log row added |
| Y2 | 5 | AC4 claimed proof by "existing instruments" while per-identity token contrast, HC-AAA rendered rule, focus-ring measurement, and target size have no existing instrument | **absorbed** — AC4 rewritten: *extended* vs *built-by-this-node* vs *declared residuals*, each named |
| Y3 | 4 | `theme-proof.ts` delegates its own vacuity guard to brand admission (a pack default equal to a probe target makes theme cells pass with the theme block dead); the drafted admission scope missed it | **absorbed** — manifest fact 3 (per-theme probe target) + admission arm |
| Y4 | 4 | The ratified AAA-for-HC bar is unreachable by the rendered gate (axe runs AA rules only) and the token gate is Oak-hardwired | **absorbed** — AC4 builds per-pack contrast pairings at ratified levels via `validateContrastPairings` + enables the rendered AAA rule for HC cells |
| Y5 | 4 | The kit's own brand recipe (`--motion-quick` at `:root`) defeats `prefers-reduced-motion` inside the collapse media query; live today in a counter-identity sheet | **absorbed** — manifest fact 4: motion via `-full` tokens only; admission refuses bare `--motion-*` at `:root` |
| Y6 | 4 | `--size-target` is brand-writable with no instrument and no floor | **absorbed** — manifest fact 5: declared target-size floor, schema-refused below WCAG 2.5.8's 24px |
| Y7 | 4 | T2 put Tango on a live route with a11y gates deferred to T4 — the only non-red-first guard in the plan | **absorbed** — T2 now lands the derived cells red-first at arrival |
| Y8 | 4 | The blanket a11y-routing sentence dropped the one panel item whose premise this node changes: the SC 2.3.1 flash risk depends on roster polarity composition, which becomes installed data | **absorbed** — two-way boundary: polarity declared here (manifest fact 2); W3 owns coalescing + a falsifier cell deriving worst case from the installed roster |
| Y9 | 3 | `forced-color-adjust: none` in a pack would invalidate the estate's zero-opt-out forced-colours scoping argument | **absorbed** — manifest fact 6, admission-checked |
| Y10 | 3 | CSS-delivered assets carry no text alternative; meaning-bearing assets need a DOM-side path | **absorbed** — per-asset role declaration (decorative vs meaning-bearing) in the pack anatomy |
| Y11 | 3 | A pack polarity lever at `:root:not([data-theme])` (0,2,0) silently beats `print.css`'s `html:root` ink-safe revert | **absorbed** — manifest fact 2's admission arm refuses polarity levers above `:root` specificity |
| Y12 | 2 | AC4's surfaces unpinned; two live routes have no axe coverage today | **absorbed** — surfaces pinned to the specimen matrix; switchboard/white-labelling coverage recorded as the showcase plan's F6 input |
| Y13 | 2 | No per-theme reflow cells; SC 1.4.12 unrepresented estate-wide | **residual** — declared in AC4's residuals list |
| Y14 | 2 | "Colour-safe default-included" enforced as a name, not an obligation | **refined** — DDR-004 full-peer requirement (all four themes, `system` refused) plus the probe-target fact; a colour-safe *behavioural* conformance check remains a residual inside AC4's honesty list |

## Design-system (D1–D20)

| ID | Sev | Finding (compressed) | Disposition |
| --- | --- | --- | --- |
| D1 | 5 | The admission check is already owned, fully specified, by the ratified showcase plan's W1 slice B (agent-tools home, all-fatal, red-first, tracked negative control); the draft re-proposed it as new work elsewhere | **absorbed + card** — G1 ruling row added; one shared instrument extended, never duplicated; the reading is on the ratification card |
| D2 | 5 | No themed authoring surface: the kit hardcodes HC/colour-safe to private Oak primitives behind specificity guards and declares them non-brand surface — P5/K1/AC4 unmeetable as drafted | **absorbed** — pack anatomy gains the themed authoring surface; the one-time dated kit contract amendment is named T1c work |
| D3 | 5 | Seven roster surfaces, not one; "zero framework or demo source edits" falsified by the current tree (fail-loud fragment map, duplicate test tuple, expectation table, page records, served-path convention) | **absorbed** — §Goal names all seven; the zero-edit property restated as the END STATE T1d's re-plumb creates |
| D4 | 5 | "No other identity's bytes served" unprovable while Oak's values are the kit base every pack ships beneath | **absorbed** — AC3 restated: kit base + exactly one pack, zero bytes from any OTHER pack; Oak-as-base residue named as the Oak-pack node's outcome |
| D5 | 5 | `theme-proof.ts` cells go red by construction when a pack authors its own access themes (targets hardwired to Oak primitives; rows total) | **absorbed** — the instrument re-points to manifest-declared probe targets as part of T1d; manifest fact 3 |
| D6 | 4 | The manifest as drafted was neither a DTCG document nor plain data ($extensions is a DTCG document property) | **absorbed** — the manifest is plain zod/JSON; DTCG contributions ride their own token files with `$extensions` under the pinned vendor key |
| D7 | 4 | Asset URL resolution differs between `<link>`-served and bundler-imported shapes; the kit's own DTCG export excludes icon URLs for this reason | **absorbed** — named T1c must-answer with the rationale cited |
| D8 | 4 | Admission must operate over the pack's import closure (both counter-identity sheets split across `@import`) | **absorbed** — closure-scoped, reusing the postcss closure-walker precedent |
| D9 | 4 | Pack anatomy omitted the expression layer both real identities carry; demo-class targeting is wrong for a published pack | **absorbed** — declared expression layer, kit-contract selectors only, demo-class rules stay demo-side, selector surface manifest-declared |
| D10 | 4 | Roster derivation "from installed packs" has a hard client-module boundary; needs a build-time generated module + manifest-borne label/fragment/description | **absorbed** — the generated-module shape with the zod-at-module-init precedent; manifest carries the display data |
| D11 | 4 | Theme roster under-specified against DDR-004 (full peers; `system` must be refused as a declarable theme) | **absorbed** — manifest fact 1 |
| D12 | 3 | P3 stated the guard claim "was struck"; on this branch it is not (rides unmerged MCP-613) | **absorbed** — branch-residency stated in P3's row |
| D13 | 3 | Serving a pack sheet to the demo is a guarded landing-path step (parity/closure rows), and "hand-copies" mischaracterised validator-guarded copies with kit-resident sources | **absorbed** — §Goal corrected; served-path/parity rows named in the re-plumb inventory |
| D14 | 3 | A third admission arm already requested by the tree (the theme-proof vacuity hazard) was unclaimed | **absorbed** — same cure as Y3 |
| D15 | 3 | Sharper admission formulation: derive slot↔parts from the kit's own definitions; a bare shorthand is the R14 opt-out and should require a declared fixed-point row | **absorbed** — admission derivation + manifest fact 8 (the R14 register machine-homed) |
| D16 | 3 | DTCG vendor key unpinned (spec requires vendor-specific, reverse-domain recommended) | **absorbed** — `org.oaknational.identity-pack` pinned |
| D17 | 3 | AC7's proof class mis-stated (human review is not repo-safe); per-pack licence surface is a new precedent beside `LICENSING-MANIFEST.md` | **absorbed** — AC7 split: schema presence check repo-safe, provenance judgement named as review; the DDR-005 pointer row named T1a work |
| D18 | 2 | "No emitter" contradicted "the manifest emits" three lines away; the asset emission is a reuse of the existing `design-tokens-core` emitter | **absorbed** — the split stated: no expressive-value generator; narrow asset-property emission reuses the existing emitter |
| D19 | 2 | Landing-path facts: single-level pnpm glob, agent-tools lacks postcss, authored-CSS validator scope classification | **absorbed** — first-principles clause 2 + T1a/T1b |
| D20 | 2 | AC2 and AC4 contradicted each other (zero edits vs "extended with Tango's cells") | **absorbed** — resolved by the D3/Y1 cures: the derivation makes both true after T1d, and the plan says so |

## Assumptions + frame-challenge (S1–S20)

| ID | Sev | Finding (compressed) | Disposition |
| --- | --- | --- | --- |
| S1 | 5 | The plan's R15 row dropped the conditional directive ("if the design system does not support that, then it needs to be changed to support that") — the exact owner word bearing against the P4 scope split it then argued | **absorbed** — clause restored to the row; the split re-argued in its presence (ruling 5 as the later, more specific word: sequencing, not refusal) |
| S2 | 5 | Tango's brief set distance-from-siblings as an objective; R15 reserves distance-maximising to EMC² — anchored identities' distinctness is a consequence of fidelity | **absorbed** — brief rewritten (fidelity to its own reference; distinctness a consequence) |
| S3 | 4 | P5 had no checkable provenance and the day's rulings records carry no such ruling | **absorbed + card** — provenance restated (the commissioning message at this seat); the paraphrase is explicitly presented for confirmation at the ratification card, whose stamp becomes the checkable pointer |
| S4 | 4 | T1 was one PR spanning ten stories — against PDR-132 clause 5 and design-work-for-small-PRs, both of which the plan itself invoked | **absorbed** — T1 decomposed into T1a–T1d, each a single-story PR naming its class |
| S5 | 4 | The zero-edit claim refuted by the demo coupling (same substance as D3, independently found) | **absorbed** — as D3 |
| S6 | 4 | `owner_gates: []` wrong IF T3's owner-private inputs are not in the executor's hands (mandatory-expiry external-input gate otherwise) | **refined** — the inputs were verified present at the primary checkout on 2026-08-17 (machine-local); the plan states the landing-path fact and the at-pickup re-verification with a card-on-absence, so no standing gate is needed for an already-satisfied input |
| S7 | 4 | `packages/design/identities/` mints a workspace tier with no reference to the ratified workspace-reorganisation programme or its census inventory | **absorbed + card** — §Relationships row added with the enforcement warrant; path + inventory rows on the card |
| S8 | 3 | P3 "was struck" and R16's citation describe post-MCP-613 state as current on a pre-MCP-613 branch | **absorbed** — branch-residency discipline applied to both rows |
| S9 | 3 | The MCP-613 ordering and the sibling relationship lived only in prose; a `beneficial` edge was owed | **absorbed** — frontmatter edge added with the minimum-shippable-shape statement; the ordering named in §Todos' sequencing note |
| S10 | 3 | The S4(b) re-homing re-opens a ratified plan's scope; the amendment must be named as work and asked plainly | **absorbed + card** — stated plainly in §Relationships; card question 2 |
| S11 | 3 | The owner-held verdict home silently diverged from the governing sibling's register ruling while the register-feeding question is unruled | **absorbed + card** — AC5 routes the choice to the card; the plan no longer settles it silently |
| S12 | 3 | The P4 measurement record had no reader — the write-only-record defect clause 5 exists to catch | **absorbed** — reader named (the composition-capability node's author at pickup) + T4's disposition rule |
| S13 | 3 | AC3's static shape had no named consumer (none exists in the tree) | **absorbed** — the minimal static fixture consumer is T1c work, named in AC3 |
| S14 | 3 | M1's "per-theme asset strategy decided BEFORE content lands" was cited as governing and discharged by nothing; its five-themes qualifier was dropped | **absorbed** — T1a carries the decision with the qualifier restored |
| S15 | 4 | Node bundles mergeable mechanism with an owner-gated design loop; the T2/T3 seam is the split candidate and should be the owner's call | **absorbed + card** — sequencing note (slices merge independently) + card question 4 with the keep-one-node recommendation |
| S16 | 2 | "Nothing is replaced if an emitter is ever warranted" unverified against the generated-tier rule | **absorbed** — conditional phrasing with the generated-tier consequence named |
| S17 | 2 | A DTCG spec fact listed among "verified first-hand on this branch" items | **absorbed** — moved to an external-standard citation with the spec URL |
| S18 | 2 | Theme-cardinality precision: four token-bearing themes vs five-selection controls (DDR-004's subset rule) | **absorbed** — manifest fact 1 carries both halves |
| S19 | 2 | "Second anchored class" miscounted; Tango is the third anchored identity | **absorbed** |
| S20 | 1 | Counterweight: the three staked mechanism claims all verify; not-doings explicit; pointers have named triggers; replace-dont-bridge correctly discharged | **counterweight** — recorded |

## Frame-challenge outcomes on the seat's decision log

- **Emitter out of scope** — survived (K2/DDR-001 refutation failed); the
  "nothing is replaced" gloss did not survive and was made conditional (S16).
- **Structure before design** — survived in principle; refuted in execution
  via T1's size, cured by the T1a–T1d decomposition (S4).
- **Measured needs routed elsewhere** — partially refuted: defensible only
  with R15's conditional directive on the page and the owner's shared-base
  escape beside it; the plan now argues it in that presence (S1).
- **One node** — survives on P1's grounds; the merge-independence cost moved
  to the card where it belongs (S15).

## Verdict after the cure pass

All three legs' must-fix lists are discharged in the same commit as this
record (the design-system NOT-READY blockers D1–D4 among them); the
residuals are declared inside the plan (AC4's honesty list) with named
owners. The node stands READY for the owner's ratification presentation,
which carries the four card questions the plan's ratification section
names.

**Discharge-route addendum (2026-08-19, review round):** the T1d dated
amendment of 2026-08-19 defers the seven-surface roster conversion and
the a11y-matrix derivation to the programme's completing node (after
the three existing-identity migrations). Findings recorded here as
discharged BY T1d feeding those surfaces — Y1, Y7, D3, D5, and D20 —
therefore re-route: their mechanism is unchanged and still owned, but
its landing moves to the completing node, and their discharge is
complete only when that node lands. The in-node T1d remainder (the
derived roster module, the №N regression, the admission-refusal proof)
keeps its share of the discharge here.

**Outcome addendum (2026-08-17, same sitting):** the card was presented
and all four questions answered with the recommended options — ratified
as presented; S4(b) dated amendment; thread-record verdict home; keep
one node. The stamp is on the node (`ratified_where` cites the card);
the plan's ratification section records the answers.

**T1a pre-execution review addendum (2026-08-17, opus code-expert,
run before any implementation):** structural verdicts absorbed into the
plan as dated notes — packs modelled on the `oak-design-assets`
data-only workspace shape (no scripts, zero turbo edits,
`private: true` load-bearing); the schema homed at a new flat-tier
`packages/design/identity-pack-schema` workspace so the `identities/`
glob stays packs-only (the №N enumerator carries no exclusions); only
facts 1–5 and 8 are schema-checkable (6 and 7 are T1b CSS predicates —
a manifest self-attestation would record, not validate); the manifest
keys by the four token-bearing themes (five-selection binds consumer
controls — DDR-004); the asset-strategy decision lands as its own DDR;
the DDR-005 relationship lands as a dated amendment legitimising
per-package licence surfaces (covering the pre-existing
`oak-design-assets` instance), not a row in the kit's studio-import
manifest. Real defect found and claimed for T1a-i: the
`validate-boundaries` inventory silently cannot see nested design
tiers (its `existsSync` filter drops directories without a
`package.json`), and the script has no test — the leg lands extracted,
tested red-first, refusing a missing tier directory. T1a split at the
machinery/schema seam into T1a-i/T1a-ii (implementer-slices-at-pickup;
scope unchanged). Kit-consumption reading settled: the kit's surface
is a CSS contract; manifest parsing never enters the kit (ADR-213 §4).
Named fan-out for the implementation cycles: config-expert (deep),
type-expert, test-expert, design-system-expert, accessibility-expert
(two schema fields), docs-adr-expert; security-expert refuted for T1a
and named as a T1c trigger (manifest-driven `url()` emission).
First-run obligations carried into execution: knip/depcruise on the new
workspace, the CI static-checks job shape for the validator's
source-run import path (B2), and a degenerate-scan check on the new
glob.

**T1a-i execution addendum (2026-08-17 evening):** EXECUTED at
`cd84e490c` on the MCP-616 lane; LANDED — PR #909 merged to main
2026-08-19 (`f2bde54bb`) after its review rounds. The ratified T1a-i
clause's "separate
pack-imports inventory" was discharged by STRONGER means, adjudicated
at the config review: no hand-declared tuple exists anywhere (a tuple
would be a permanent identity-№N violation — an eighth,
unconvertible-by-T1d roster surface); the clause's stated purpose
("pack specifiers never enter the depth-3 zone builders") is
machine-satisfied by the type-level `createDesignSiblingZones`
parameter refusal plus the depth-1 inventory scan's structural
blindness to nested packs, both recorded in the tier README as the
discharge evidence. Review arc: config-expert (deep) + test-expert
(focused, 25-mutant probe) + post-execution gateway; all findings
dispositioned. The owner's tests-prove-behaviour doctrine word
(2026-08-17 evening) re-shaped the assertions to contract form —
token presence on the joined report, never counts, order, or prose —
with both headline mutants re-proven killed under the relaxed form.
**T1b parcel (named deferrals, one rework):** tier-root injection for
the fs adapter (making the parse-wrap and artefact filter testable),
`readPackageName` failure-as-data on the five inventory legs (a
malformed manifest currently aborts the collect-all report — loud,
non-zero, wrong shape), a discriminated union for the entry states,
and array-manifest diagnosis.

## Addendum 2026-08-18 — the P7 ruling reshapes T1a-ii before it opens

The 2026-08-18 owner ruling (P7 in the node: identities are
self-contained, the token contract is the invariant, defaults bind at
construction, `oak-design identity create` as the constructor —
doctrine authored as DDR-012) arrived BETWEEN T1a-i's execution and
T1a-ii's opening, and reshapes T1a-ii's design intent rather than its
scope: the manifest is authored as the contract-invariant of
self-contained packs (completeness semantics and construction
provenance join the fact-arms; the pack-declared prefix field rides the
slice's decision card as a MAJOR). The new T1e slice (the constructor)
and T2's born-through-the-constructor note follow from the same ruling.
Evidence class recorded with the ruling: the 2026-08-18 demo-day defect
ledger on the MCP-620 lane (reduced-motion collapse defeated by a bare
later-sheet override; a stranded server-rendered brand sheet;
cascade-order and specificity fights; light-dark() resolving at the
declaring root) — each an artefact of the runtime-override mechanism
this ruling retires, kept as legacy-demo until the migration nodes.
Number correction absorbed here too: the asset-strategy DDR the T1a-ii
row once called "DDR-012" mints at the next free number at authoring.

**Post-merge review addendum (2026-09-02, the #915 fold, Finch calls Pinnacle c91bd4):**
Copilot's review of the merged tip (12:24Z, after the owner merged #908 as `a8aa13da1`)
re-raised, as one inline comment and two suppressed ones, a pair of 19 August suppressed
findings that this record had not dispositioned: the T1d deferral amendment had not been
consolidated through the node's §Mechanism identity-№N paragraph, AC2, AC4 and T2, and the
deferral was a scope change outside the 19 August stamp. Disposition: **absorbed** — the
four passages and the `design-showcase-experience` relationship are re-trued to the
amendment with dated markers, under the owner's 2026-09-02 reading "Fixture consumer first
light" (Tango's first light and a11y gating through the T1c static fixture consumer in
this node; showcase arrival and the derived a11y matrix at the completing node); the node
is re-stamped with `ratified_where` citing the owner word recorded in the
design-system-integration thread record §Session update 2026-09-02. The Y1/Y7/D3/D5/D20
re-route recorded in the discharge-route addendum above is unchanged by this. Also
absorbed in the same fold: DDR-012's `informed_by` edges (the 19 August suppressed finding
that they named lifecycle moments) now cite artefacts. No mechanical gate guards prose
consistency between a dated amendment and the passages that depend on it; the guard is
this record's readiness discipline, and the lesson is that an amendment consolidates into
the text it changes rather than sitting beside it.

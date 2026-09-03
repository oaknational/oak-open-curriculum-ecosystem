# Readiness reviews — `oak-open-curriculum-mcp-extraction` (2026-09-02)

The pre-ratification review record for the delivery plan node
`.agent/plans/delivery/oak-open-curriculum-mcp-extraction.plan.md` (MCP-661), authored at the
seat Finch calls Pinnacle (`c91bd4`) on 2026-09-02 after the #915 landing. Three reviews ran on
the node's second draft (the one that moved the two apps and their thin layers) before its pull
request left draft; the owner's words of the same hour (rulings 10–12 in the node's decision
log) then reframed the node from a move of workspaces to a cut of every box along the Oak line,
and every suite-1 finding below is dispositioned against that third draft. A second suite of
five reviews ran on the fourth draft (after ruling 13); its findings are dispositioned against
the fifth draft, which also splits the publish mechanism out into the delivery node
`toolkit-publish-mechanism`. Evidence class for every finding: READ unless the row says RUN.
Dispositions: **cured** (the named draft carries the cure at the named section), **overtaken**
(the reframe removed the passage the finding was about, and the record says what replaced it),
**routed** (a ledger row on the node names the carrier), **rejected** (with rationale).

## Rendered proof — the Atlas seam diagram (routed off PR #915)

The Oak Toolkit Atlas's seam diagram (`.agent/reports/repo-architecture/oak-toolkit-atlas.html`,
Change 3) named three `oak/` pack classes while the prose above it names four. The diagram line
now reads `packs — identity · content · config · experience-tuning`. Rendered proof, regenerated
never archived (PDR-138; the artefact stays in scratch space, the instrument and the verdict
persist here): on 2026-09-02 the seat rendered the diagram and read the pixels first-hand — the
packs box shows all four classes; the three gate boxes and the two family boxes are unchanged.
The instrument, reproducible from a clean checkout:

```text
1. Copy oak-toolkit-atlas.html to scratch space (the repository file carries no
   mermaid loader; it renders on its hosting platform).
2. Insert before </body> a script tag loading mermaid 11 (ESM from a CDN) that
   calls mermaid.initialize({ startOnLoad: true }).
3. Open the copy in Playwright Chromium at a 1400px-wide viewport; wait for the
   seam diagram's SVG; screenshot the full page; crop to the SVG's bounding box.
4. Read the crop: the packs node text and the five neighbouring boxes.
```

## Review 1 — assumptions-expert (proportionality, assumption validity, blocking legitimacy)

Verdict on the second draft: NOT READY. Fifteen findings.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| A-1 | blocking | The MCP server carries generic MCP/OAuth and index-lifecycle machinery the census and the Atlas place on the toolkit side; the draft moved the app whole | **cured** — the apps are now cut, not moved: §The decision per box; E1 (server framework), E2 (OAuth-for-MCP), E5 (index lifecycle) |
| A-2 | blocking | The ordering thesis's falsifier tested publishing automation, not the ordering | **cured** — §Decision log names two falsifiers of the ordering itself, each at a named slice (M1's extraction test; P4's gates) |
| A-3 | serious | Owner gate 2 (the ordering word at ratification) was auto-satisfied by ratification | **cured** — removed; gate 1 is now the design record's ratification (D0a), a real mid-plan decision |
| A-4 | serious | The deploy word had no `owner_gates` row | **cured** — a deploy-target gate on the fourth draft; after the design-step reframe (PR round 1, T8) the gate rides the cut-over step's node authored at D0a, named in the extraction node's C1 and gate 2 |
| A-5 | serious | The stated partition rules did not generate the table | **cured** — §The decision per box states the operative rule (the dispositions, the per-box measurement); census and co-change are evidence columns |
| A-6 | serious | "Eight members outside the closure" contradicted the hub's move | **cured** — six named; the demos take their dispositions in the table (ruling 9) |
| A-7 | serious | The 90% claim boundary excluded the class that decides it; the replay script did not exist | **overtaken** — the claim boundary is now the thinness ceiling (AC3a) and the dip rate (AC8); the co-change stays as evidence with the retirement mechanism named; D0b lands the scripts |
| A-8 | serious | P2 published mixed rows unsplit, which the lexeme gate then fails | **cured** — P2 publishes only the libs and core that stay whole; the SDK cuts (K1–K4) precede their publishes |
| A-9 | serious | S1 and M3 were several stories under one name; no split had a slice | **cured** — S1a–S1d; R1–R4; K1–K6; E1–E7, each sliced further at authoring |
| A-10 | serious | AC1 typed repo-safe but runs in the new repository | **cured** — AC1 is owner-held with the CI run recorded on the ticket |
| A-11 | minor | The hub demo's fate was a conditional trigger | **cured** — decided: the hub stays (ruling 9) |
| A-12 | minor | AC6 conflated a CI-provable arm with a rehearsal | **cured** — AC7a and AC7b |
| A-13 | minor | The readiness record did not exist | **cured** — this file |
| A-14 | minor | No first-principles-check statement; counts inconsistent | **cured** — §Where the first-principles check fires; §Evidence reconciles 25 against the thread record's 22 and enumerates the six dev-time members |
| A-15 | minor | Root-surface removals appeared in both the moves and C2 | **cured** — the retirement PR (M2) carries them; C2 is residue only |

## Review 2 — architecture-expert-wilma (failure modes, hidden coupling, cut-over safety)

Verdict on the second draft: NOT READY. Thirteen findings; RUN evidence from a manifest walk
over all 33 workspaces and import-specifier counts.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| W-1 | blocking | `env` reads the repository root's `package.json` four levels up at import; a registry install throws or lies | **cured** — R1 injects the version (ADR-024) and precedes P2 (W2-6); the publish mechanism requires the packed-form smoke under a real pnpm store layout |
| W-2 | blocking | The hub demo depends on `oak-design-react` and `fidelity-review`, neither in the publish set | **overtaken** — the hub stays (ruling 9); the closure arithmetic (25 of 33) is the two apps' and unchanged |
| W-3 | blocking | The MCP conformance harness is agent tooling and stays; AC1 and the rails needed it there | **cured** — T1 re-provides the check (the harness's generic core published, or a plain check written there), decided at T1 |
| W-4 | blocking | `.releaserc.mjs` names the curriculum SDK's path; the first release after the move fails; stamping absent | **cured** — the curriculum SDK stays; the publish mechanism's stamping replaces its entry (W2-8); the version discontinuity is recorded (§Decision log) |
| W-5 | serious | The 24-hour release-age floor blocks same-day installs of toolkit releases | **re-dispositioned** — the fourth draft excluded the scope from the floor; PR round 1 (T1, T4) showed a scope exclusion removes the detection window the floor exists for; the floor stays in force, the bot batches after maturity, and an urgent fix is allow-listed per package (§Publish first; the publish node's consumer note) |
| W-6 | serious | `pnpm -r publish` is not atomic; provenance needs `id-token: write` | **cured** — topological publish, clean-store resolve check, convergent re-run; the permission or no provenance claim (`toolkit-publish-mechanism`) |
| W-7 | serious | Pinning the release checkout would break the release plugin's push | **cured** — the validated-tip assertion, which fails loudly when it cannot find a CI result for the tip (W2-7; `toolkit-publish-mechanism` P1) |
| W-8 | serious | The codegen chain is consumed through many subpaths; one sentence assigned sides | **cured** — D0b's per-subpath table first; P4's import gate runs at subpath granularity |
| W-9 | serious | A split `graph-corpus-sdk` would export a departed subpath with no test pressure | **cured** — K4 rewrites the barrel in the same slice and names the test pressure; D0a may keep the box whole |
| W-10 | serious | `oak-eslint`'s preset names this repository's own files | **cured** — R4 makes the exception list consumer-supplied |
| W-11 | serious | The widget build copies fonts and icons by path from the design system's package root; a `files` allow-list could omit them | **cured** — P3's proof asserts the copied files resolve from the packed tarball |
| W-12 | minor | The widget's cross-workspace token watcher misses silently in the new repository | **cured** — E3 removes the watcher; the registry bump is the token path |
| W-13 | minor | Two packages carry their own version lines; ruling 3 restarts them | **cured** — recorded as a decision (§Publish first, §Decision log) |

## Review 3 — docs-adr-expert (accuracy, ADR consistency, schema)

Verdict on the second draft: READY WITH CURES. Thirteen findings.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| D-1 | blocking | The readiness record did not exist | **cured** — this file, committed with the node |
| D-2 | blocking | Two landed edits cited the node by id while it was untracked | **cured** — the node is committed in the same PR |
| D-3 | serious | The search stack could not move before the curriculum SDK and the Oak codegen half | **overtaken** — the SDK boxes are cut in place (K1–K3) before anything moves; the thin slices move together (M1) |
| D-4 | serious | No slice performed a mixed-row split | **cured** — R1–R4, K1–K6 |
| D-5 | serious | The "eight outside the closure" sentence contradicted the hub's row | **cured** — as A-6 |
| D-6 | serious | ADR-041's named occupants void at the move; a status note does not cure it; A1 ran after the structure changed | **cured** — A1 rides M2 with ADR-041's `apps/` line and ADR-108; the tier amendment for the Oak-org pack class is A3, riding K1 (D2-2) |
| D-7 | minor | `public-packages-release` has no relationship row | **routed** — A2 carries §Alignment and §Delivery naming this plan; the fifth draft adds the explicit edge through `toolkit-publish-mechanism` (`serves: public-packages-release`) |
| D-8 | minor | The patterns README clause required a ruler the two precedents do not name; "decision-move" was not a category | **cured** — the clause now describes the precedents as they are and binds the three-part requirement to admissions from the amendment date |
| D-9 | minor | The sweep addendum derived a discrepancy the rows do not support | **cured** — the addendum states the per-class figures as recorded and that the total cannot be re-derived |
| D-10 | minor | The census artefact was not cited by path; class names differed | **cured** — path cited; the census classes mapped to the five classes at §The three apps (the fourth draft had dropped the mapping; D2-3 restored it) |
| D-11 | minor | `guidance-content` missing from `impact_areas` | **cured** — added |
| D-12 | minor | "Published from the new repository at its version" was ambiguous | **overtaken** — the curriculum SDK is now cut in place; the version discontinuity is recorded |
| D-13 | minor | Two owner quotes repeated three times each | **cured** — the decision log is the verbatim home; other sections refer by ruling number (re-cured in the fifth draft after a regression, D2-10) |

## The fourth draft and the second review suite

After the third draft, the owner's design thought experiment (three apps; dips into this
repository rare by construction; search on the same data without a shared service or index —
ruling 13 in the node's decision log) produced a fourth draft: the five-class test, the search
infrastructure/corpus/instance model, the finish-before-extract precondition, the upstream
contract, the app template and the dip rate (AC8). The suite-1 dispositions above stand against
the fifth draft (each cured section survives the reframe; where the fifth draft moved a cure,
the row says where). Five reviews ran on the fourth draft: assumptions, adversarial
architecture, cohesion and coupling, documentation and ADR consistency, and the Elasticsearch
expert on the search model.

## Review suite 2 (fourth draft) — dispositioned against the fifth draft

### Review 4 — assumptions-expert

Verdict on the fourth draft: NOT READY. Thirteen findings.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| A2-1 | blocking | The Atlas's lexeme gate refuses "curriculum terms" in toolkit sources, so the curriculum-toolkit class conflicts with P4 and AC2 | **cured** — §Cut over scopes the gate per class; **routed** — the Atlas's text takes a dated amendment at A2 (ledger row) |
| A2-2 | blocking | "Rare dips" must be measured before M1, not only after cut-over | **cured** — the change-class map re-runs over the thinned tree; M1 opens at D0a's threshold (first cut nine in ten); §Rare dips, M1 |
| A2-3 | blocking | The finish bar is unreachable for `graph-corpus-sdk` (licence pending), the codegen chain (Castr-deferred) and the design packs (the design lane's programme) | **cured** — the finish list records dated, surface-scoped exemptions at the owner's word with the dip named (§Rare dips; F) |
| A2-4 | blocking | This is a lane, not a node: split into four nodes | **cured** — the publish mechanism is its own delivery node (`toolkit-publish-mechanism`, serving `public-packages-release`, a blocking edge); and after PR round 1 (T8, with the schema's "one step of a lane, never the lane itself") the extraction node is the lane's design step, whose D0a slice authors a one-page node per later step from the slices banked in §The lane's steps — the corpus pack and the app template become steps, not separate lanes (§Decision log, "The lane's shape") |
| A2-5 | serious | D0 is four slices | **cured** — D0b (instruments) then D0a (decisions); further slicing at pickup |
| A2-6 | serious | "Stay whole with relocations" is a fourth disposition; "too thin to be worth a seam" has no threshold | **cured** — the fourth disposition named; the first cut's threshold (one hundred lines) stated, D0a sets the number |
| A2-7 | serious | The census classes three rows as oak-leaf with no split; overrides need a dated per-row record, and the census is generated | **routed** — D0a records the per-row override with its measurement; the census regenerates (ledger row) |
| A2-8 | serious | AC8 is untestable as written and outlives the node | **cured** — three arms (a repo-safe commit check; an issue ceiling; the breaking-change arm) and the archival arm named |
| A2-9 | serious | AC3's no-mechanism clause has no instrument; AC5's proof was the wrong gate | **cured** — AC3b names the import gate run in the new repository plus the readiness review; AC5's proof is the conformance check against production and the served-tool-table diff |
| A2-10 | serious | V1's scripts must land at D0, before AC4 is claimed | **cured** — V1 is folded into D0b; §Evidence no longer defers the instrument |
| A2-11 | serious | The clock trigger is a conditional trigger | **cured** — removed; the minimum shape under one version is stated; **routed** — the clock decision to `public-packages-release` (ledger row) |
| A2-12 | minor | Gates 2 and 3 expire before S1a and C1 can run; S1a needs E7 first | **cured** — both gates clear at ratification by naming; S1a follows E7 in the order |
| A2-13 | minor | "Any app that exposes an MCP surface later" is a speculative consumer | **cured** — the MCP-family class names one consumer and rests its toolkit status on the Atlas probe and the three gates |

### Review 5 — architecture-expert-wilma

Verdict on the fourth draft: NOT READY. Eleven findings; RUN evidence from the codegen chain,
the search SDK's query helpers, the CLI's supplementation adapters and the server's auth files.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| W2-1 | blocking | The served tool surface is generated in total from Oak's API specification, so "add an MCP tool" is a dip; the Oak index mapping, analytics categories, auth shapes and response augmentation are further dip classes | **cured** — D0a's tool split (API-derived pack; app-local product tools over a published extension point, K2); AC7b's change is an app-local tool; the four classes are named for D0b's map (§The decision per box) |
| W2-2 | blocking | The search SDK's retrieval and admin code is saturated with Oak field names | **cured** — K3 injects a field-mapping port, with the falsifier that drops the toolkit claim if the port is wider than a mapping |
| W2-3 | blocking | The lexeme gate fails on the toolkit halves it protects (retrieval; the analytics client's exported surface) | **cured** — the gate keys on Oak-instance terms per class with a dated exemption list; K3 and K6 carry the renames |
| W2-4 | blocking | Today's corpus is bulk files plus live-API supplementation; the bulk directory is operator-supplied | **cured** — the pack is built post-supplementation, source-shaped and self-sufficient; D0a names its substrate and size; K5's proof is an ingest with the API unreachable |
| W2-5 | serious | OAuth-for-MCP hard-depends on the identity provider's SDK throughout | **cured** — E2 is named for Clerk; a provider port arrives with the second provider (§Decision log; §Out of scope) |
| W2-6 | serious | W-1 not cured in order: R1 must precede P2 | **cured** — F and R1–R4 precede the publish slices |
| W2-7 | serious | W-7's assert-and-exit drops a validated release silently | **cured** — the validated-tip assertion fails loudly when it cannot find a CI result (`toolkit-publish-mechanism` P1, AC2) |
| W2-8 | serious | W-4's wording was stale: nothing removes the release entries once the SDK stays | **cured** — §Thin in place; the stamping replaces the entry; git assets cover every stamped manifest or none |
| W2-9 | serious | M1 before C1 leaves production running from a head with no served surface | **cured** — M1 (move) → C1 (cut-over, old deploy as rollback) → M2 (retirement) |
| W2-10 | serious | F1 states no bar; 23 of 24 manifests are private at `0.0.0-development`; both apps lack `exports`/`files` | **cured** — the finish list names the bar's checks; F is sliced per package and precedes each publish |
| W2-11 | minor | The release-age rationale misquoted the workspace comment | **cured** — §Publish first cites the floor's own behaviour and allow-list and states why the scope exclusion is safe |

### Review 6 — architecture-expert-betty

Verdict on the fourth draft: NOT READY. Eleven findings.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| B2-1 | blocking | As A2-1 | **cured** — as A2-1 |
| B2-2 | blocking | The corpus/index split put the document model in the pack but chunking and the embedded-field contract on the instance — cross-repo lockstep on the search product's highest-frequency change | **cured** — logic in the pack, values in the instance; the compatibility clause; "the squad never authors ingestion logic" (§Search) |
| B2-3 | blocking | One version per repository hides breaking org-pack changes from the junior squad; AC8 scored them as zero dips | **cured** — the upstream contract's breaking-change clause (agent-authored update PRs); AC8's third arm; **routed** — the clock decision to `public-packages-release` (ledger row) |
| B2-4 | serious | The hub demo consumes the search SDK's read surface and the curriculum SDK today, and was dashed out of the table | **cured** — "needed by" names the hub; K2 and K3 proofs include its suites; the "all three" claim for the MCP family is replaced by the Atlas probe and the gates |
| B2-5 | serious | The dependency-direction invariant was unstated | **cured** — §The model names it, with generality by injection and the injected type surfaces at D0a |
| B2-6 | serious | After M1 the extracted frameworks have no in-repo consumer | **cured** — the hub demo for the curriculum client and retrieval; the template's example server for the server framework (§Scaffold, E7) |
| B2-7 | serious | The upstream contract named no latency class, seat, breaking-change notice or resolution-time arm | **cured** — §Rare dips names all four; AC8 carries the resolution-time arm |
| B2-8 | serious | D0 mixes instruments and decisions | **cured** — D0b then D0a; gate 1's text aligned |
| B2-9 | serious | The app template's form was unnamed; "cannot drift" was unbacked | **cured** — a published skeleton package with a drift check, plus conventions as packages (§Scaffold) |
| B2-10 | minor | Gate 2 conflated the decision with the prerequisite assert | **cured** — the gate names the holder; S1a and the publish node's live-publish slice (P4) assert at their start |
| B2-11 | minor | The lifecycle claim conflicted with the Innovation Kit's own declaration | **cured** — framed as this plan's proposal with the Kit's declaration cited (§The lifecycle) |

### Review 7 — elasticsearch-expert

Verdict on the fourth draft: READY WITH CURES. Seven findings; RUN evidence from the search
SDK's admin and index-metadata modules and the CLI's ingest pipeline.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| E2-1 | blocking | Every semantic-text mapping omits the inference endpoint identifier, binding the default; two apps months apart embed with different models | **cured** — pinned per instance and recorded in the index metadata; K5 compares model identity |
| E2-2 | serious | Index names are compiled constants in the search SDK | **cured** — K3 adds the instance namespace (index prefix, synonym-set identifier, inference endpoint) to the SDK's configuration |
| E2-3 | serious | The mapping is not instance: analysers, synonym filter and field set are generated from the Oak schema (ADR-067) | **cured** — reclassified as an Oak-org generated artefact with a per-instance overlay (§Search table) |
| E2-4 | serious | The synonym vocabulary is corpus, but the synonym set is a project-scoped resource one app can overwrite for another | **cured** — the set is namespaced per instance |
| E2-5 | serious | Inference allocations are project-level; project-per-app versus shared is a design decision, not a per-instance one | **routed** — D0a decides with both costs recorded (ledger row) |
| E2-6 | serious | Today's pipeline emits index-shaped documents from bulk files plus live supplementation; the pack must be source-shaped and self-sufficient | **cured** — §Search; K5's proof is a full ingest with the Oak API unreachable |
| E2-7 | minor | The benchmark harness is index-agnostic but its reranker, fusion constants and baselines path are single-instance constants | **cured** — E6 lifts them into instance configuration; the published harness accepts a caller-supplied baselines file |

### Review 8 — docs-adr-expert

Verdict on the fourth draft: READY WITH CURES. Fourteen findings and one verification note.

| ID | Severity | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| D2-1 | serious | "Nineteen subpaths" is wrong (thirteen declared plus the root) | **cured** — the count is dropped; D0b's table carries it |
| D2-2 | serious | ADR-041 is stale for the whole cut: new tiers, and the Oak-org pack class has no tier | **cured** — A3 (the tier amendment) rides K1, the first pack's publish; A1 keeps the `apps/` line and ADR-108 |
| D2-3 | serious | ADR-154's gradient and the census classes were not mapped to the five classes | **cured** — §The three apps maps both |
| D2-4 | serious | §Review dispositions read "(none at birth)" while 41 findings sat in the record | **cured** — a row per suite and a row per routed finding |
| D2-5 | serious | AC8 "near zero" is not adjudicable | **cured** — at most one issue a month; zero squad commits; the breaking-change arm |
| D2-6 | serious | AC3 is two criteria | **cured** — AC3a and AC3b, each with its instrument |
| D2-7 | serious | The fate of the two app workspaces was never stated | **cured** — each row says the workspace retires here at M2; A1's `apps/` line matches |
| D2-8 | minor | The decision log deferred to an unpathed thread record as the durable home | **cured** — the log is the durable home; the thread record is cited by path and heading as contemporaneous |
| D2-9 | minor | "Five-class test", "finish list", "change-class map" and "lever inventory" were unglossed; the Atlas path uncited | **cured** — glossed at first use; the Atlas cited once under §Evidence |
| D2-10 | minor | D-13 regressed: §Goal and §Publish first re-quoted rulings; "(sic)" misplaced | **cured** — rulings by number outside the log; "(sic)" moved |
| D2-11 | minor | The first-principles clause said vendors are classes while §Search names the search host | **cured** — the literal is admitted with its rationale (§Search; §Where the first-principles check fires) |
| D2-12 | minor | Three impact areas missing | **cured** — `analytics-and-observability`, `conformance-and-standards`, `design-system` added |
| D2-13 | minor | Record inaccuracies: the verdict said two gates; A-9's ranges; D-7 routed not cured; "rulings 13" | **cured** — this file |
| D2-14 | minor | One workspace, two names (`oak-eslint`; `@oaknational/eslint-plugin-standards`) | **cured** — `oak-eslint` throughout; the published name glossed once under §Evidence |
| note | — | The ruled repository name is the current app's error-reporting project name (ADR-159, ADR-163) | **routed** — the owner, at gate 2 (ledger row) |

## PR #954 review round 1 (tip `faf0ef792`, Copilot and the Claude review)

Ten threads: nine from Copilot's requested review, one optional nit from the Claude review.
Triage under the PDR-140 intake bar (a finding cures in the PR only if it changes what the
implementing session would build, or lands a false statement that would mislead before
pickup). All READ unless stated.

| ID | Source | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| T1 | Copilot | Excluding the `@oaknational` scope from the release-age floor removes the detection window for a compromised first-party publish | **cured** — the floor stays in force; the bot batches after maturity; per-package allow-listing at the owner's word is the exception (extraction node §Publish first, S2; publish node §Mechanism, P4; W-5 re-dispositioned) |
| T2 | Copilot | The validated-tip hand-off can drop a release when a later tip's CI fails and the release job is skipped | **rejected** — RUN: `release.yml` skips on a failed run by design (a broken tip must not release); the release tool versions every commit since the last tag, so the unreleased head ships with the next successful run — nothing is dropped, only deferred; the publish node's mechanism now says so |
| T3 | Copilot | Provenance is promised in one place and optional in another, and never verified | **cured** — provenance is required; the publish step grants the token permission and publishes with provenance (P3 rehearses it, P4 goes live); AC1 reads the attestation back per package |
| T4 | Copilot | As T1, on the publish node's consumer note | **cured** — as T1 |
| T5 | Copilot | AC5's proof covered tool metadata only; the served surface includes resources, and auth, widget, landing-page and asset paths also change | **cured** — RUN: `served-surface.ts` classifies resources as well as tools; AC5's proof is now the served-surface manifest diff (tools and resources), the conformance check, the server's end-to-end suite against the new production for the four paths, and the search benchmark at the same baselines |
| T6 | Copilot | AC8 spans a quarter but the node archived after the first month | **cured** — the retirement step's node carries AC8 and stays live until the third reading; nothing archives on a partial reading |
| T7 | Copilot | The experience letter characterises the owner's emotional state | **cured** — the adjective removed; the correction stated factually |
| T8 | Copilot | The node is the whole lane; the schema requires one step of a lane, and decomposition belongs at authoring | **cured** — the node is reframed as the lane's design step; D0a authors a one-page node per later step from the slices and criteria banked in §The lane's steps, because those contents depend on D0a's decisions; nothing is deferred to pickup (§Decision log, "The lane's shape") |
| T9 | Copilot | The committed PNG contradicts the estate's regenerate-never-archive contract for visual proof | **cured** — the PNG is removed from the change (a copy stays in the seat's scratch space); the record keeps the first-hand verdict and a reproducible render procedure |
| T10 | Claude (optional) | The MCP server's line-count categories sum to ~12,500, not ~20,500 | **cured** — §Evidence names the ~8,000 uncategorised lines and makes D0b's line-count output the superseding figure |

## PR #954 review round 2 (tip `7c1ca9bcc`, Copilot)

Five findings on the round-1 cure push — the last budgeted round (PDR-132: two). The reserve
settlement push declared at intake carries these five; after it the budget is spent, and any
later finding is dispositioned in a reply and routed, never cured in this pull request.

| ID | Source | Finding (one line) | Disposition |
| --- | --- | --- | --- |
| R2-1 | Copilot | AC-D2 proved only the two scripts, while D0b names four more artefacts | **cured** — AC-D2 names every D0b artefact as a file beside the record |
| R2-2 | Copilot | AC8's "no squad commits" arm is not reproducible in-repo without a squad roster | **cured** — the arm is owner-held: the ticket records the dated roster and the comparison against history, bot identities excluded |
| R2-3 | Copilot | "A rehearsed interruption against a dry-run registry" cannot exercise the resume path | **cured** — AC4's proof names a persistent local test registry, the injected interruption point, the re-run and the three assertions |
| R2-4 | Copilot | The first live publish ran before installability was proven under a store layout; a broken version cannot be withdrawn | **cured** — the publish node's slices are reordered: the installability smoke (P2) is green for every package before the first live publish (P4); the mechanics rehearse offline (P3) |
| R2-5 | Copilot | Spelling: "artifact" | **cured** — the sentence no longer uses the word; it named a hosting product's feature, and the plain phrase serves |

## Readiness verdict

Presented for the owner's ratification: `oak-open-curriculum-mcp-extraction` as the lane's
design step (with the lane's steps, slices and criteria banked in it for D0a to project into
one-page nodes) and the delivery node `toolkit-publish-mechanism`, with every finding of both
suites and the pull request's first round dispositioned above and the routed ones carried on
the node's ledger. Beyond ratification the owner holds: the design record D0a will produce
(gate 1); the repository's creation and the name collision (gate 2); the scope's publish rights
(the publish node's gate); and, on the cut-over node D0a authors, the deploy target.

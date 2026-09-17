# PR round ledger — design-lane PRs #907 #908 #909 #910 (shepherd: Yarrow stirs Undergrowth, ab1066)

Working notes per the pr-lifecycle review-round state machine (item 2 tally
store + item 3 expected-reviewer declaration). Untracked working surface;
substance graduates to the thread record at session close.

## Expected reviewer set (declared at harvest, 2026-08-18 ~17:1xZ)

- `copilot-pull-request-reviewer` — repo config fires it on push; requested
  via MCP on #907/#909 at open (binding proven by `review_requested`
  timeline events, Director confirmation 15:5xZ). Re-assesses on demand.
- `mantagen` — Matt's PR Review Warden (agent-authored under MG's account,
  self-declared in each review). NOT on-demand: cure honestly, then dismiss
  the stale round per the dismiss-at-cure path; never request re-review.
- `claude[bot]` — SKIP MARKER this round on all four PRs: org overage spend
  limit (scope-declared: until credits restored; re-check each round).
- `chatgpt-codex-connector` — SKIP MARKER (usage limits; same treatment).

## Round 1 tally (all reviews bind each PR's frozen tip; no pushes since open)

| PR | tip | review findings (threads + bodies) | check legs |
| --- | --- | --- | --- |
| #907 | 3b276f0d6 | 12 (6 Copilot threads + 5 mantagen + 1 mantagen axe-matrix-coverage) | Sonar QG FAIL (21 issues); browser-tests FAIL (specimen creature 320px SC 1.4.10 overflow); run-quality-gates FAIL (aggregate) |
| #908 | a5ccc6ebe | 4 (mantagen body; record-consistency class) | all green |
| #909 | cd84e490c | 6 (2 Copilot threads + 3 mantagen + 1 mantagen test-shape note) | all green |
| #910 | 6e88cb407 | 4 (mantagen body; record-truth class) | all green |

Cross-review dedupe note (#909): Copilot thread `boundary-inventory.ts:107`
and mantagen finding 3 state the same data-only-invariant gap — two tally
rows (different reviews), ONE cure.

CI-failure root (#907): a11y spec `specimen-a11y.spec.ts:143` — creature at
320px, horizontal scroll (SC 1.4.10). Green locally at freeze, red in CI —
reproduce against the built artefact in the lane worktree before curing.
Convergent with the owner's open visual item 3 (hard no-overflow rule);
in-PR cure stays minimal (the failing surface), the rework stays queued.

Scope discipline: the owner's four open visual-feedback items do NOT ride
these cure pushes (a growing round is a routing failure) — they remain the
next execution round after the harvests, per the recorded morning order.
Overlaps (tokens thead ↔ two-column rework; composition control rows) get
minimal in-PR cures only.

## Round 1 disposition worksheet (Phase 4 triage; updated as verified)

Status legend: VERIFY (to check first-hand) / FIX (cure in PR) /
REJECT (with verified reasoning) / TICKET (route + resolve).

### #910 (records-truth)
1. design-system-completion sketch still active + showcase dep — VERIFY
2. rubric v0.1 blocking contradiction — VERIFY
3. DDR-009 false decision text above correction; six-vs-seven widths — VERIFY
4. showcase README claims a motion control — VERIFY

### #908 (tango node + DDR-012)
1. Plan T1c/T2 still describe runtime overlay vs DDR-012 — VERIFY
2. T1a-i simultaneously obsolete/discharged/"landed" — VERIFY
3. T2 dependency graph vs declared edges; "four slices" stale — VERIFY
4. DDR-012 circular authority + missing Provenance section — VERIFY

### #909 (T1a-i)
1. collect-all still throws on fs/manifest shapes; read errors mislabeled — VERIFY
2. whitespace-only licence passes — VERIFY
3. data-only invariant unenforced (also Copilot thread) — VERIFY
4. ADR-041 flat-six claim vs nested tier (Copilot thread) — VERIFY
5. test-shape: pre-decided states vs reachable paths — folds into 1–3 cures

### #907 (demo day)
Copilot threads: narrow faces for four layouts; ExhibitThemeApplier
post-hydration flash; live-token-values head-only observer; focus-ring on
inverted band; useFrameObservedState gap-state; StripThemeApplier
first-paint — ALL VERIFY.
mantagen: scaled-frame target size (2.5.8); tokens thead display:none;
forced-colours radio mark; composition stale accessible content;
colour-matrix label divergence; axe-matrix coverage of new routes — ALL
VERIFY.
Sonar 21 (list: scratchpad pr-907-sonar.txt): mechanical classes (S4666
duplicate selectors ×5, S6754 ×4, S6843 ×3, S6822 ×2, S6772 ×2, S6819,
S6845, S7761, S8786 regex, S6606).
CI: creature 320px overflow — reproduce, cure at source.

## Round 1 dispositions (verified, ~18:5xZ)

- **#910**: all four findings FIX — cured at `4d74164b5` (sketch archived
  with disposition + showcase edge removed; rubric pre-recalibration
  advisory regime stated; DDR-009 decision text re-trued in place, seven
  widths, module comment aligned; README motion proof described honestly).
- **#908**: all four findings FIX — cured at `41db188a0` (DDR-012
  Provenance section with owner verbatim as the durable authority anchor +
  informed_by re-anchored; plan/DDR mechanism reconciliation — completeness
  admission makes the base-fallback path structurally dead, cascade
  position is byte mechanics; T1a-i implemented-in-review status +
  discharged-instruction amendment, readiness record "executed" not
  "landed"; full slice consumption graph declared, six-slice count).
- **#909**: findings 2/3/4 + test-shape FIX — cured at `83c95cc03`
  (licence trim + pinned; closed pack-anatomy leg on contents with
  contract tests for source/config/unadmitted/permitted paths; ADR-041
  nested-tier amendment in both cited places). Finding 1 (collect-all
  fs/manifest failure-as-data) = CLASS P to the NAMED T1b parcel
  (readiness record execution addendum; the fs-adapter injection is what
  makes those script paths honestly testable) — reply cites the home.
- **#907**: all six Copilot threads FIX; all five mantagen findings +
  the axe-coverage note FIX; Sonar 21/21 addressed (S6845 watch item:
  tabIndex now rides role="region" — the WAI scrollable-region pattern;
  if the next scan re-fires it, per-site disposition with that rationale).
  CI root RE-DIAGNOSED with rendered/measured proof: not animation
  timing — the strip's visually-hidden helpers escaped the util-inner
  scroll clip (static positions past the nowrap row → a 312px document
  floor; green under macOS overlay scrollbars, red the moment CI's
  classic scrollbar narrows the layout viewport). Cure: the scroll
  container is now the containing block (`position: relative` on
  util-inner); measured floor after cure ≤296px. The sway-plate inset
  cure stands alongside as the real-user no-preference case (animation
  phase must never extend scrollable overflow). The `.mast`
  duplicate-selector merge fixed a REAL dead-declaration bug (the
  below-strip offset was silently overridden to 0).

## Round history

- **Round 1 CLOSED at ~18:2xZ**: one multi-ref bot push advanced all four
  lanes (gate suite paid once) — #907 `62df2091c`, #908 `41db188a0`,
  #909 `83c95cc03`, #910 `4d74164b5`. Every thread replied-with-evidence
  and RESOLVED (6 on #907, 2 on #909); response comment per PR (author
  read-back: jimbot-oakington-iii[bot] on every write); all four
  mantagen CHANGES_REQUESTED rounds DISMISSED with the cure message
  (dismiss-at-cure path; verified DISMISSED ×4); Copilot RE-REQUESTED on
  #907/#909 (timeline `review_requested` events verified bound); #910's
  PR body scope note updated for the comment-only ts true-up; token file
  deleted. Round-1 tally rows: #907 12→cured, #908 4→cured, #909 6→(5
  cured + 1 Class-P to the named T1b parcel), #910 4→cured.
- **Gateway pass absorbed before the push** (code-expert on opus,
  probe-verified in Chromium): blocker (percentage grid track vs the
  authored-css gate) + items 2/3/4 cured, plus 6/7/8/9/12/13 taken cheap;
  carried residue with named dispositions — three-expressions-of-theme
  logic (item 5, consolidation candidate at the kit), region-landmark
  cardinality on /tokens (item 11 — Sonar S6819 forced the choice; names
  unique via sectionId; watch S6845 at the next Sonar scan), load-listener
  teardown nit (16), cross-document textContent write class (17). The
  forced-colours radio dot is rendered-proof verified (SelectedItem on
  Canvas, screenshot in the session scratchpad).
- Round 2 OPENS when reviewers respond to the new tips. Four pr-watch
  monitors armed (120s, wake-signal only — Phase 3 full harvest on every
  wake). Merge legs remain at the Director's seat at settled; auto-merge
  stays off per the warden's standing ask.

## Round 2 (opened at resume 2026-08-18 ~20:5xZ)

Input state at harvest: Copilot COMMENTED rounds landed on #907 (18:29Z,
1 thread + 3 suppressed) and #909 (18:30Z, 0 threads + 5 suppressed);
NO new reviewer input on #908/#910 (they stay all-green on the
Director's settle board); no new mantagen rounds; claude[bot]/Codex
skip markers re-checked and standing. #907's CI on the cured tip
62df2091c: Sonar QG FAIL (3 issues) + browser-tests FAIL +
run-quality-gates FAIL.

### Round 2 tally and dispositions (all verified first-hand)

- **#907 C1** binder generation ordering (thread,
  brand-identity-binding.ts:101) — CONFIRMED by code walk (A applied,
  B in flight, return-to-A early-returns without bump; B's stale load
  retires A). FIX: bump before the already-applied check; deterministic
  route-hold spec constructs the race.
- **#907 C2** (suppressed) scaled-frame apply-only vs the frame
  runtime's contrast listener — CONFIRMED (the one applyFrameTheme
  consumer with no divergence guard). FIX: holdFrameTheme consolidated
  at third consumer (also discharges round-1 gateway residue item 5's
  demo-level half); stage hold re-installs per frame load; spec proves
  external-write correction.
- **#907 C3** (suppressed) framed breadcrumbs navigate the stage —
  CONFIRMED structurally. FIX: embedded mode omits the trail (framed
  fact hoisted); spec covers both modes.
- **#907 C4** (suppressed) unconditional tabIndex = forty-family
  gauntlet — CONFIRMED, and probes showed today's content has NO
  genuine horizontal overflow at ANY canonical width. FIX: native
  labelled section + tabindex only while measured overflow exists
  (useHorizontalOverflow); spec proves both directions by constructed
  squeeze, never width-guessing.
- **#907 Sonar** S6819 + S6845 (both on the old div) — retired by the
  C4 cure (native section; conditional expression). S6582 — FIX
  (optional chain).
- **#907 CI browser-tests** — NOT this PR's surfaces: the MCP app's
  ws3-fallback e2e fixture (static-root-fixture.ts:58) raced
  copyOakDs's dot-prefixed staging dir inside public/ (mkdtemp →
  readdir snapshot → ENOENT mid-copy). The fixture's own "no test can
  race the copy step" claim is falsified; candidate cure = skip
  dot-entries in copyCommittedRootStatics (express.static never serves
  dotfiles, so they are outside the fixture's contract BY the same
  contract). apps/ is outside this lane's claim → routed to the
  Director as an independently-shippable finding; the round-2 push
  re-rolls the leg meanwhile.
- **#909 S1–S5** (all suppressed; "no new comments" verdict) — ALL
  CONFIRMED against the round-1 cures: JSON-by-extension admission
  defeats refusal-by-default (S1); blanket dot-skip blinds the walk
  (S2); symlinks silently omitted (S3); manifest early-returns shadow
  anatomy findings vs the collect-all contract (S4); tier path
  duplicated reader-vs-policy (S5). ALL FIX — zero packs exist, so the
  tightening is migration-free. Deliberate asymmetry NAMED: the #907
  fixture SKIPS dot-entries (its contract is servable statics;
  dotfiles are non-servable) while the #909 walker VALIDATES them (its
  contract is pack content; dotfiles are content) — each walk follows
  its own contract's direction.

Gates at cure: #909 type/lint/build + 36/36 unit + live validator
green; #907 type/lint/build + 33/33 UI + 68/68 a11y on the built
artefact (two new specs each side). The first a11y run CAUGHT a real
regression in my own cure — bare `overflow-x: auto` computes
overflow-y to auto, and 3px of rounded-border scroll slack made axe
demand keyboard access to every family once tabindex went conditional;
cured with `overflow: auto hidden` (height is content-driven, the
vertical axis is artifact-only).

### Round 2 CLOSED (~21:4xZ)

Gateway code-expert pass (opus, probe-verified) returned HOLD with
four mechanical blockers + two priority findings — ALL absorbed before
the push: (B1) the race test could not fail on its bug (`expect.poll`
passes before the released request lands) → rewritten on a POSITIVE
post-load signal (stale link's removal) and PROVEN red-then-green by
reverting the cure in place, rebuilding, and watching the exact
assertion time out; (B2) the untracked hook staged; (B3/B4) prettier
on both test files; (P5) the `dtcg/` place admission re-opened
extension admission INSIDE the place (probe: `dtcg/biome.json`
admitted) → tightened to the DTCG format's own `*.tokens.json` suffix
(37/37); (P6) the zero-count assertion replaced with the invariant
(stop exists exactly where scroll exists). Nits 7–11/13 taken cheap
(RefObject import, dead branch, docblock re-trues, unmount generation
bump, 250-cap headroom); nit 12's kind-enum residue dispositioned to
the NAMED T1b fs-adapter parcel (unreachable entry kinds in a git
checkout). Knip caught `applyFrameTheme`'s export going dead at
consolidation → made module-internal.

One multi-ref bot push: **#907 `5f1188f0a`**, **#909 `1d7852517`**
(gate suite paid once). Ceremony: thread reply `3808129296` +
RESOLVED (PRRT…N-Hl); response comments `5334395819`/`5334395966`;
author read-back jimbot-oakington-iii[bot] on every write; Copilot
re-requested BOTH via the MCP tool — the REST
`requested_reviewers` route returned 201s that minted NO timeline
events (write-verification lesson); the MCP route bound
(`review_requested Copilot` 21:41:00Z/21:41:03Z, paginated-tail
verified). Token deleted. Fixture-race finding routed to the Director
(comms `88487ce9`); the push re-rolls #907's browser leg.

Carried residue: the tok-scroll SHAPE SIGNAL (three stacked cures on
one container — containing-block, artifact-axis close, measured
focusability) → an assumptions-expert solution-class look before any
fourth cure lands there. Round 3 opens on reviewer/CI response to the
new tips; #908/#910 untouched all-green awaiting the (frozen)
Director's merge legs.

## Owner visual-feedback BUILD round (same sitting, ~22:0x–22:4xZ)

Branch `jimcresswell/mcp-620-visual-feedback-round` STACKED on #907's
tip 5f1188f0a (never grows #907; PR opens after the gateway verdict,
draft until #907 merges). All FOUR owner items built and
rendered-proven:

1. **Composition control rows** — the wrapping cluster becomes a flex
   COLUMN (rows by construction, not by wrap coincidence);
   composition.css. Proof: 1280 render, two separated rows.
2. **Tokens two-column norm** — TokenTable rewritten from the
   four-column table to a `ul.tok-rows` of card rows; the ROW is the
   multicol break-avoid unit (`columns: var(--space-240) 2` ≥960),
   family h3 spans by construction; list semantics at every width with
   per-row hidden labels; the thead, tok-scroll container, data-wide
   pairing heuristics, AND round-2's useHorizontalOverflow hook all
   DELETE (the shape signal's question dissolved at the solution
   class, as the owner's ruling implied). Net −187 lines. Proof: 1440
   render, two balanced columns under the spanning header.
3. **Everything visible, measured** — new invariant spec: zero
   scrollable-overflow elements in the token areas at
   [305, 320, 664, 960, 1280, 1440] + document reflow floor; 305 IS
   the classic-scrollbar warrant width DECIDED here (the round-1 CI
   class); DDR-009's dated prose amendment rides the post-#910 records
   parcel (that file's live history is on #910 — editing it on this
   stack would manufacture a conflict).
4. **Slide-out disclosures at narrow** — new NarrowDisclosure (kit
   `details.oak-disclosure`; SSR renders the narrow shape; the wrapper
   dissolves at the wide seam via a matchMedia external store — the
   framedness discipline's sibling). Tokens jump list sheds its capped
   scrolling box; the specimen strip sheds its one-row in-strip
   horizontal scroll (radios were OFF-SCREEN at 320 — measured 664px
   row in a 288px band); the mast goes static below the seam (its
   sticky offset was one-row arithmetic). Specs prove closed/open/
   inline-at-wide on both surfaces, including a real re-skin driven
   THROUGH the open panel. Specimen-domain specs split to
   specimen-strip.spec.ts at the page seam.

Parcels: `290eb8070` (items 1–3), `f77af9e9e` (item 4), `e46c36477`
(gateway absorption), `b114d5206` (a11y-deep absorption). SHIPPED as
**PR #912** (draft, bot-authored, jimbot-labelled, base = #907's
branch; re-targets to main when #907 merges — the stack dissolves at
the merge boundary per the standing rulings).

Review passes absorbed pre-push, both HOLD→cured:
- **Gateway (opus, probe-verified)**: B: the strip stayed sticky while
  its height became disclosure-driven (half-applied cure) → static
  below the seam with BOTH owner words named (the sticky word's reason
  — offscreen radios — dissolves under the disclosure ruling);
  P: seam constant consolidated (DISCLOSURE_WIDE_QUERY), content-scope
  of the everything-visible rule stated honestly (the wide rail's
  capped nav scroll NAMED as the one deliberate scroll box, owner to
  re-rule), population guards on zero-count invariants, hydration
  trade priced, stale prose re-trued ×3.
- **Accessibility (opus, deep, measured)**: B1 the strip summary was
  missing from the inverted-ring set (1.27:1 lemon-on-white focus in
  dark — invisible to axe) → added + rendered-proof re-verified;
  B2 SC 2.4.11 on the tokens page (shift-tab occlusion + jump landings
  behind the sticky band, elementFromPoint-proven at 390) →
  element-level scroll-margin reserves; P4 the disclosure remounted
  across the seam (focus → BODY; zoom/rotation are a11y paths) → ONE
  mounted details, CSS dissolution, user state held; P5 unskippable
  flat-list boilerplate (185 tier sentences, 69 no-specimen
  announcements) → one catalogue-note paragraph + silent dashes. The
  expert BACKED the list-vs-table call with an ARIA-snapshot reading.
  Nits noted-not-changed: magnifier visual-order divergence (priced by
  CSS-owns-visual-order), h2/h3 same visual style (pre-existing).

NEXT: (a) round-3 harvests on #907/#909 (watch armed); (b) the
T1a-ii+T1e owner decision card (prefix MAJOR, construction semantics,
CLI shape) — prepared at this seat, surfaced at Director resume per
owner-directs-through-Director; (c) post-#910 records parcel carries
the DDR-009 classic-scrollbar amendment.

## Round 3 CLOSED (2026-08-19 ~08:0xZ)

Harvest lesson first: the round-3 PR watch was BLIND for two hours —
`reviewThreads` is not a `gh pr view` field, every poll errored, and
`2>/dev/null || continue` swallowed it; silence read as quiet while the
monitor watched nothing (the corpus-test-the-filter class, now on the
poll QUERY: probe a monitor's command against live output BEFORE arming
it). Caught only by the hourly watcher-backstop wake's cross-check.

Input: Copilot round-3 on BOTH PRs (both "no new comments" + suppressed
sets — never filtered). **#909**: the suppressed set is the round-2
findings VERBATIM quoted against code that no longer exists at
`1d7852517` — suppressed-because-cured, zero live findings, note posted
(comment `5339269690`), nothing pushed. **#907**: six genuinely new
suppressed findings + Sonar's single re-fire.

#907 dispositions (cured at **`e54be4b4d`**): (1) the inverted maps
scrambled the middle six regions vs the true source order — CONFIRMED
(my first re-derivation used a wrong order; verify against the ACTUAL
REGIONS tuple) — both faces now the exact full reverse; (2)+(5) the
round-2 theme-hold class at consumers three and four, with the
two-writers twist — ownership by context, exactly ONE holder per
document (standalone: the exhibit holds; framed: the applier stands
down, the stage holds and drives); useFramed hoisted at second
consumer; (3) controls=none frames reserved a strip-height mast offset
— data-controls attribute + zeroed inset; (4) the theme badge now
computed TRANSITIVELY over var() references AND the seed fixed
(single-face declarations are themed too) — 5 new contract tests;
(6) REJECTED with reasoning at the site: expect-throws-before-branch
means no assertion can be skipped on a passing run (a throw-based
unwrap just trades no-conditional-tests for no-throw-statement).
Sonar S6845 re-fire: the pre-declared per-site disposition SURFACED at
the action moment in the response comment (WAI scrollable-region
rationale; #912 deletes the line) — the residual gate state is not
unfixed work. Ceremony: response comments `5339269517`/`5339269690`
(author read-back jimbot on each), Copilot re-requested on #907
(timeline-bound 08:04:36Z), token deleted. Suites at push: 33/33 UI,
68/68 a11y, 225 unit.

Consequence for the STACK: #912's base moved (`5f1188f0a` →
`e54be4b4d`); its merge-forward (git merge of the base branch, never a
rebase) is the FIRST act of the next sitting on this lane, before any
round-4 work. Expected conflict surfaces: specimen.css (mast block —
`data-controls` zero-inset vs the narrow static block; both keep),
demo-routes-a11y.spec.ts (white-labelling cell comment), and
CompositionStage (the #912 branch does not touch it — clean).

## 2026-08-19 merge drive (Yarrow, ab1066 — owner word: "get all current design work finished and merged"; mid-drive word: "if the PRs are green and clean, they should be merged")

**Merged**: #907 at `c59c1c47c` (after rounds 4–7); #909 at `f2bde54bb`
(after rounds 3–8). Merge legs moved to this seat under owner-named-executor
(Director acked, no objection, directed event 4a367102); mechanism:
`merge-bot merge --pr <n> --expect copilot-pull-request-reviewer` at
SETTLE-READY — the expected set is declared, not defaulted (the observed
surface includes the CODEOWNERS humans, who never robo-review; the
`--expect` declaration is what lets the machinery settle on the reviewer
actually engaged each round).

**#907 rounds 4–7, one line each**: r4 = conditional-guard class cured at
source (`assertResolved`, non-nullable `openPickerStage`; round 3's
rejection premise overturned — `.not.toBeNull()` passes undefined);
useFramed consolidation discharged; gateway retro pass absorbed
(ExhibitThemeApplier hydration race → direct read; five guard cells, each
calibrated red against its reverted cure). r5 = teardown leak + reduced-
motion staleness + two entity findings (premise REJECTED with transform
evidence — SWC/esbuild decode JSX attribute entities; edits kept as
consistency). r6 = the causes-module split with per-subscription callback
identity (gateway-probed DOM-dedupe theft) and the capture-pair unit test
taken off the network path. r7 = zero live; ONE CARRIED ITEM below. Sonar
S6845 ACCEPTED in SonarCloud (issue AaAW0hKcff6KG3E2n-sP) with the WAI
disposition comment; #912 deletes the line.

**#909 rounds 3–8**: two missed round-3 THREADS surfaced by the state
machine (the round-3 read had covered only the review body) — tier
symlink-drop and manifest dereference, cured by promoting the tier reader
to src with injected filesystem (ADR-168/ADR-078), never-dereferenced
proven by spy. r5 = the closed shape top-down (tier path lstat-classified;
dot-filter removed; stray root entries refused). r6 = transient exemption
binds name AND kind. r7 = parseFailure means parse (read outside the try);
README exemption sentence re-trued. r8 = zero live; suppressed set
dispositioned post-merge (below). Every cure red-first or revert-calibrated.

**#912 (open, review-bound)**: ready-for-review at owner word; round 1
cured at `11691b393` (DOM-true nowrap reach; TokenRows rename; seam focus
continuity); the focus hold REBUILT TWICE — the layout-effect race lost
under CI, the focus-in-open version raced the summary click — and stands
as the render-time seam latch (state, no refs, no effects) at `8b5c0c641`,
disclosure cells repeated ×4 green. Base folded twice at the stack
boundary (`82c806f6b`, `b76d60a7d`).

**Carried items (dispositions, not unfinished work)**:
1. #907 r7 suppressed: `colour-matrix.ts` admits the `filter` family
   (values like `invert(1)` render as transparent `#00000000` swatches).
   Verified real. One-line exclusion + cell; rides the next tokens-page
   touch (natural home: #912 if it takes another round, else a micro-PR).
2. #909 r8 suppressed: (a) the parseFailure test's title promises content
   preservation its assertions don't check — strengthen at next oak-eslint
   touch; (b) the tier README names the tango plan that lands with #908 —
   cured BY #908's merge (in this drive); (c) the README's DTCG mention
   needs the upstream link per documentation-hygiene — rides the records
   parcel.
3. #907 gateway out-of-scope: `pnpm test` in the showcase printed a Node
   crash banner behind exit 0 pre-cure — the import-path cure landed in r6;
   the CLASS (a unit-test import graph doing network IO with a green exit)
   is a test-estate hygiene candidate for the estate lanes.

**Owner question NOTED (2026-08-19, not acted; answer recorded at his
word "note the answer")**: which components belong to the showcase vs the
components library? The decider is the generality-depth gradient plus R16
(identity is static in real apps; switching is a demo instrument). LIBRARY
candidates — components whose meaning derives from the KIT'S contract:
`NarrowDisclosure` (+ its `useMediaQueryMatch`/`useFocusWithin`/seam-latch
primitives) — the strongest candidate, a general responsive-disclosure
pattern over kit `details.oak-disclosure`; `useFramed`;
`holdFrameTheme`/`apply-frame-theme` (really a KIT-runtime concern — one
theme holder per document — arguably belongs beside `oakThemeStore` in
oak-design-react); `LabelledSelect` and `IdentityRadioGroup` (kit-markup
form controls with the 44px floor — the seeds of the "optional React
component set" the design-system-completion gate names). SHOWCASE-resident
— exhibition mechanics: the stages (CompositionStage, ExhibitThemeApplier,
picker-stage), StripControls, ShowcaseBreadcrumbs, the token-reference
instruments (TokenRows/TokenReference/TokenCells/token-catalogue/
live-token-values/live-token-causes, colour-matrix), canonical-widths
(a DDR-009 measurement instrument), and `brand-identity-binding` (the
runtime identity swap is demo-only under R16, so the binder never
graduates). Any actual move is owner-gated and coordinates with the
design-system-completion "full optional React component set" decision.

**Freeze state (handoff, 2026-08-19 ~13:5xZ)**: #908 `727dfc15c` and
#912 `bbc88f1a2` in quiet windows, all threads resolved, rounds
requested; #910 `242fd4c52` + the main-fold merge commit (fidelity
register resolved as a UNION — both branches' appended entries keep, 11
entries, ids unique) completing in a background task at freeze. The
#912 seam-focus shape is FINAL after three iterations (ledger above);
the two rejected shapes are recorded so no successor re-walks them.
Successor mechanics: harvest any new round body first, deletion sweep,
then `merge-bot merge --pr <n> --expect copilot-pull-request-reviewer`.

**Late rounds before the handoff cut**: #912 r3 = the 305–320 sticky
reserve widened to the three-row worst case (probe-measured 144px band
vs the 128px two-row reserve) with a MEASURED reserve≥height cell at
both widths, and the strip's open panel gained the no-scroll-box
invariant (first run without the visually-hidden exclusion flagged the
1px clips — the exclusion is part of the invariant's definition), tip
`61c6fdc33`. #908 r3 = the T1d sequencing contradiction CONFIRMED and
amended: the roster module + proofs land in-node against the tier's
real contents; the seven showcase surfaces convert ONCE in the
programme's completing node after the three migrations
(replace-dont-bridge kept true), tip `5d0957d95`. #910 r2 = the DDR-003
consequence bullet's drift memorial removed (Provenance keeps history),
tip `920cd9166` on top of the main fold `5f1efcf20` (register union).

**Final pre-handoff tips** (each = the prior tip + one zero-live round's
single suppressed truth, cured): #908 `9d811d463` (the readiness
record's Y1/Y7/D3/D5/D20 discharges re-routed to the completing node,
following the T1d amendment); #910 `0c30a6932` (the rubric's authority
stated self-contained per no-moving-targets); #912 `cbdbda76b` (every
tokens.css no-scroll claim scoped to token content with the wide-rail
exception named). Fresh rounds requested on all three at the cut; the
successor merges each at SETTLE-READY after tallying its bound round.

**Post-cut addendum (verify-908's report, delivered after the cut)**:
the verifier's full report landed late; its edits were already
harvested first-hand and its three HELD classes were all resolved this
sitting (P7 inversion; the 2026-08-19 re-ratification stamp; the report
landed with the node). ONE surfaced survivor remains uncured: plan
lines ~544-545 — "sequenced after the MCP-613 PR merges (same file
surface; avoids a self-conflict between two in-flight PRs)" — the
sequencing is a real invariant, the "two in-flight PRs" phrasing is
live status (the execution-state class this round cured elsewhere).
Named next-round candidate on #908: re-word to "sequenced after the
MCP-613 records pass lands (same file surface — one writer at a time)".

**Design-work audit (2026-08-19 ~15:3xZ, owner word "all design work
pushed and in a draft or open PR")**: every worktree swept. Current
lanes exact-match their remotes (#908 `9d811d463`, #910 `0c30a6932`,
#912 `cbdbda76b`; local "ahead" readings were phantom — merge-bot
pushes by URL never update local tracking refs). Five old design
branches are merged-PR residue (#785 #787 #814 #822 #824). Two real
finds, both dispositioned: the W0.1 census scaffold (cycle plan v2 +
census types) lived only on the w01-census worktree's disk — preserved
into the design reports space (the orphan `.ts` fenced verbatim,
byte-identity verified, disk residue removed after extraction) and
parked as DRAFT PR #918; and design-plan-truings' staged
capability-floor report is an EARLIER draft of the version already on
main (main's copy is strictly richer — the owner-shaping verbatim and
pinned revision were added in later truing) — superseded residue, left
in place, no un-landed knowledge.

# PR #846 review fleet — W1/W2 report

Status: T3 pre-flight complete; W1 executing. This header is written at
launch so the pins survive any session boundary; findings, verdicts,
the knowns table, and the cross-check output land at T4.

## Header (T3 pre-flight record, 2026-08-12 evening)

- Plan: `.agent/plans/delivery/pr-846-review-fleet.plan.md`, ratified
  revision 2 (owner card "Sanction W1 now", 2026-08-12; coordination
  commit `3b1e5fcce`). Visibility ticket: MCP-591.
- Object: PR #846, `BASE=d105b4ab207bf8c800f80460983aef3f5a0940a3`
  (merge-base with `origin/main`),
  `HEAD=5243224f9091b1afcf5b96fa0f0a6a1ca0d40e44`.
- changedFiles assertion: range file count 99 == PR `changedFiles` 99 —
  PASS.
- Session model: the claim-registry binding for claim `645b9e0b`
  (platform `claude`, registry model string `Opus-5`, session `d0274e`)
  is unchanged since claim open — F-159 check reconciled; every leg
  inherits the session model.
- Server mode: production (`next start`, port 3020), fresh `next build`
  at launch.
- Export reference: two-root overlay server via its module contract
  (`resolveExportRoots`/`serveRoots` — EPHEMERAL port by contract; the
  plan's "fixed port 3030" was authoring drift against the module's
  `listen(0)` and is recorded as such). Styled-sentinel: PASS at T3 on
  BOTH pages (`whitelabel/specimen.html`, `Identity Switchboard.html`)
  — kit CSS resolved 200 with byte counts 39516/41399/2054/5856. The
  fidelity pipeline (L11) self-manages its export arm.
- Fresh suite counts at T3 (forced, uncached): showcase Playwright
  70/70 (27 UI + 43 a11y); unit/integration tasks across the five lane
  workspaces 22/22 green (fidelity-review 205 cells; showcase 116).
- Reviewed-object note: revision 2 adds P7 (fidelity instrumentation —
  the S2a/S2b landings) to the manifest; leg assignments L1/L5/L6/L9
  (+L8 capture tooling) per the revision note.

## Findings, verdicts, knowns, cross-check

(Lands at T4 adjudication.)

## T4 — W1 execution record and seat adjudication (2026-08-13)

Execution: run `wf_8e740b28-943`, three segments (launched 2026-08-12
evening, frozen at owner pause; resumed 2026-08-13 ~08:15Z at owner
word, frozen again at owner pause 09:10Z; resumed ~09:35Z and COMPLETED
~09:55Z). 81 agents, 0 errors, 0 empty results. Owner-asked quota
health-check between segments: journal clean — 79/79 then-cached
results real, zero null/error shapes (the org's quota incident touched
the Director's fold-review leg, recorded in #872, not this fleet).
Final-segment accounting: 1,028,954 subagent tokens, 102 tool calls.
Per-leg token tallies are not recoverable from the journals (meta files
carry agentType only) — recorded as a limitation; leg finding counts
and coverage notes stand in.

Integrity gate: PASS at both boundaries — worktree clean, HEAD
`5243224f9` == recorded HEAD (asserted post-Phase-1 resume and again at
this report).

### Verdict tally and refutation audit

40 records (cap 40, merge-never-drop honoured; 26 overflow rows
preserved unverified; 0 polish). 70 refuter verdicts: 69 confirmed,
1 refuted. Survival: 39 survive, 1 refuted (F23), 0 not-reproduced.

Refutation audit (severity≥3): one refutation, F23 (export reference
hand-edit). Seat re-read both verdicts: the confirming verdict proves
evidence accuracy only; the refuting verdict defeats the failure
scenario itself (the edit was a reviewed gateway cure with recorded
provenance, and the export switchboard chrome is owner-ruled out of
comparison, so no fidelity claim is judged against the edited line).
Refutation UPHELD. **Overturn count: 0.** Phase-2 calibration signal:
high Phase-1 precision (39/40), and refuters demonstrably reproduced
first-hand (Playwright probes, a mutation experiment, live axe repro)
rather than echoing.

### Knowns attention-coverage (K1–K12)

| Known | Charged | Engaged? | Evidence |
| --- | --- | --- | --- |
| K1–K6 register dispositions | L3/L11 | YES | L11 own-eyes-first pass over all six; agreements recorded, disagreements filed as F14/F25/F26/F37 |
| K7 axe#3978 disable | L4 | YES | upstream-open verified, live artefact repro on creature; structural gaps filed as F16 |
| K8 fidelity stdout global-scope | L11 | YES | console-vs-HTML asymmetry position, folded into F26 |
| K9 five-item DS trunk slice (routed) | L3/L4 | **MISS** | no stated position + evidence pointer in either leg |
| K10 light-dark substitution oddity | L3 | YES | all in-range pairs computed both arms; F05's mechanism is this class |
| K11 canonical-widths client mirror | L7 | YES | filed as F35 |
| K12 two ruled divergences | L11 | YES | one agreement (utility strip), one contested (F25) |

Score 11/12; the K9 miss is named per the instrument's contract.

### Two-axis dispositions (39 survivors + 1 refuted)

**fix-now (13) — blocks opening; these become the lane's next slices.**
The common property: each would mislead a reviewer or misrepresent the
work's own evidence claims (the plan's NO-GO test), on the owner's
primary axes (conformance/fidelity/accessibility).

- F01 s4 a11y — picker has zero keyboard-tabbable elements (WCAG 2.1.1
  total failure); cure the tabIndex/reading-flow mechanism.
- F02 s4 a11y — specimen main region excluded from Tab order (2.4.3/2.1.1).
- F15 s3 tests — axe helper drops the `incomplete` bucket: the green
  a11y matrix the PR cites is partially vacuous; cure the instrument
  with F01/F02 so the green is true.
- F03 s4 fidelity — specimen.css defeats pds's masthead at
  (0,2,0) vs (0,1,0), breaking the app's own hook-clean contract.
- F05 s4 fidelity — pds masthead white-on-white (opposite
  light-dark() arms on one surface); the demo reads as "this brand
  loses its nav".
- F14 s3 fidelity — the register's completeness claim is false: no
  entry for the dominant pds divergence.
- F04 s4 correctness — capture-pair silently crops to common height
  and records pre-crop heights nowhere: clean pass over erased
  divergence; cure = record heights + loud mismatch.
- F07 s3 docs — PR body's fidelity summary contradicts the register at
  the PR's own head; body edit.
- F20 s3 docs — DDR-003 amendment says implementation is future while
  the same diff records it implemented; one-bullet cure.
- F22 s3 tokens — colour-safe flattening covers decorative-1..4 of 6;
  lemon/amber keep full chroma against the block's own rationale.
- F25 s3 fidelity — band-rhythm "superseded" disposition contradicted
  by the pixels at 1440 (~64px offset dominates residuals); re-open or
  re-disposition honestly.
- F37 s2 fidelity — a live divergence recorded only inside a
  superseded entry's rationale; active entry required.
- F38 s2 fidelity — register evidence cites gitignored paths; commit
  the cited crops or re-point (the recognisability arc's S1 provenance
  discipline is the durable home).

**fix-in-the-open (22)** — cure as review commits once open: F06
(width-authority doctrine scoping; the hub-seam arm routes to the hub
pipeline lane), F08+F30+F31+F32 (one frame-readiness mechanism, one
cure: reset-on-load + re-apply), F09 (contrast media-query listener),
F11+F12-observer-arm (comparability hold), F10/F12 contrast-arm (the
ScaledFrame drop loses the runtime's auto high-contrast — DDR-003
commitment; small cure mirroring the picker's arm) [seat note: if the
owner reads F10/F12 as floor-breaking, they promote to fix-now with
F01/F02], F13 (unit-suite network IO), F16 (forced-colors gate +
self-retiring probe), F17 (geometry-guard vacuity), F18 (calibrated-arm
pooling tests), F19 (origin guard on new capture arm), F21 (DDR-009
scope wording), F24 (invariance-cell fixture out of saturation), F26
(pair-level register expectations), F27 (skill sync to DDR-010
amendments), F28 (scroll-padding border token), F29 (hub label
totality), F33 (labels out of 'use client'), F35 (widths module to a
neutral home), F36 (inert on scaled frames + correct 2.5.8 pricing),
F39 (creature util rule + comment), F40 (theme-distinctive probe
values).

**refuse (1)** — F34 (cascade-position observer): no competing head
writer exists; the theme/identity asymmetry is warranted by the theme
axis's real second writer (the frame runtime). Basis recorded;
re-opens if an identity-axis writer ever appears.

**refuted (1)** — F23, refutation upheld (audit above).

**Overflow (26)** — recorded with marks preserved, unverified;
dispositioned at cure-slice pickup (the two s2 capture-tooling rows
join the F04 cure slice's verification set; the DDR-010
frontmatter-contract row joins the docs cure bundle).

### Cross-check (AC2/AC3) — recomputed, embedded verbatim

```text
journal: started=92 results=90 distinct_result_keys=90
records=40 verdicts=40 ids_match=True dup_ids=False
refuter_verdicts_total=70 outcomes={'confirmed': 69, 'refuted': 1}
records_by_severity={4: 5, 3: 21, 2: 14}
records_by_category={'a11y': 6, 'fidelity': 8, 'correctness': 7, 'frame': 1, 'docs': 4, 'tests': 7, 'architecture': 5, 'tokens': 1, 'types': 1}
overflow=26 polish=0 legs=11 legs_ok=11
K1-K6: charged=['L3', 'L11'] attention_evidence_in=['L3', 'L11']
K7: charged=['L4'] attention_evidence_in=['L4']
K8: charged=['L11'] attention_evidence_in=['L11']
K9: charged=['L3', 'L4'] attention_evidence_in=NONE
K10: charged=['L3'] attention_evidence_in=['L3']
K11: charged=['L7'] attention_evidence_in=['L7']
K12: charged=['L11'] attention_evidence_in=['L11']
```

W2 (completeness critic + release-readiness, two named verdicts)
dispatched from this adjudication record; verdicts land below.

## T4 — W2 verdicts (2026-08-13, run wf_63c4f188-032: completeness critic → release-readiness-expert, both xhigh)

**Verdict 1 — open-for-review readiness of #846: GO WITH CONDITIONS.**
No NO-GO class defect survives; unconditional GO is defeated because
the PR body and its cited a11y green misrepresent evidence at the PR's
own head. Conditions (all seat work): the fix-now set below; the F07
body cure absorbs the stale "62/62" claim (re-verified stale
first-hand by the leg); fresh Playwright run AFTER the instrument cure
with body counts written from it; F04 lands before F38 (committed
evidence must not inherit the crop defect); K9 closed by a bounded
two-look pass during the cure slices. Re-evaluation: the
release-readiness leg re-runs alone against the updated record;
expected GO on clean evidence.

**Verdict 2 — doctrine soundness: SOUND-WITH-CURES.** All four
doctrine objects have correct decision cores and honest limits
(DDR-010's amendment record called exemplary). Cures are edge defects,
each homed: DDR-009 scope wording + hand-copied widths (docs bundle);
the shared resolveWidth seam (hub pipeline lane, independent of the
PR); DDR-010 missing frontmatter + argv-in-permanent-record (docs
bundle); the visual-comparison skill sync (F27, in-open); the
render-the-reference rule's enforcement overclaim (scope or let the
hub-lane gate make it true).

**Critic amendments, seat-accepted (dispositions revised):**
- F16 + F40 PROMOTE into the F15 fix-now instrument cure (one file,
  one cure — a "cured" F15 green would otherwise still rest on an
  un-gated disable and a vacuous application proof).
- F36 PROMOTES to the fix-now a11y slice (live 2.5.8 AA breach; the
  "one link away" escape fails the SC's same-page exception; cure is
  inert on scaled frames).
- F10/F12 PROMOTE by lens, not by card: DDR-003's automatic-access
  commitment is RATIFIED owner doctrine; breaking it on a live surface
  misrepresents conformance to our own record — the same test that
  put F22 in fix-now. (The owner's same-day ruling — fixable issues
  are fixed, not owner-gated — governs.)
- Overflow rows each get a named home at first cure-slice pickup (a
  dated disposition sweep is the pickup's first act); the two capture
  rows and the visual-stats centring row take Phase-2-style
  verification there.
- Count presentation corrected: 13 fix-now + 25 fix-in-open (22
  bundles) + 1 refuse + 1 refuted = 40. With the promotions the
  gating set is 18 findings in 11 cure bundles.

**Non-gating residuals, disclosed:** Chromium-only engine coverage
(F01/F02's mechanism is engine-specific); single-viewport axe matrix;
no assistive-tech pass over the aria-live surface; no
instrument-independent export ground truth; F19 environment-dependence
of new-arm captures. Named, bounded, homed as follow-ups.

**Also cured by the same sitting's owner ruling:** S6845 (the open
Sonar MAJOR) leaves the owner-gate shape — it joins the cure slices as
seat work: fix if fixable, else an evidenced non-issue disposition via
the decision matrix. The F7 no-throw cure
(identity-white-labelling/page.tsx:35) rides the same a11y/correctness
bundle. Un-draft + explicit Copilot re-request follow the re-issued GO.
## T4 addendum — cure bundle 2 landed (2026-08-13, PR head 3c7124be7)

Bundle 2 (F15/F16/F40 as one instrument cure per the W2 promotion) landed at
`ec1695bd6`; the owner-directed mutation-method practice record rode the same
push at `3c7124be7` (docs/governance/development-practice.md). Full review
provenance and mutant evidence live in the commit bodies. Landed state:
a11y suite 40 green / 6 intentional red — every pds-brand specimen cell, one
root cause (F05/F03 masthead), removal condition bundle 4; declared on the
shared comms log and in the demo README. The bundle-2 novel-reason fence
fired once on first full run (`elmPartiallyObscured`, 320px table columns in
their own scroller) and was adjudicated with evidence — the instrument
behaving as designed.

New/enriched ledger rows from the bundle-2 review chain (four reviewers):

- **F05/F03 enrichment (bundle 4 input)**: pds masthead invisibility is live
  in EVERY theme state (six nodes at exactly 1:1). Root cause is the broken
  cascade contract: the brand sheet's `.mast` background rule ties
  globals.css at (0,1,0) and loses on source order while its ink rule wins
  at (0,2,0) — inverted ink on a non-inverted surface; the globals.css
  hook-level contract comment promises the brand sheet lands later and the
  built head does not honour it. Cure routes through design-system-expert:
  fix the ordering contract, never blind specificity; the same latent break
  applies to any brand using the expression layer.
- **NEW (coverage hole; named home: overflow sweep / recognisability S1)**:
  ~83 creature-specimen text nodes are UNMEASURED for contrast — the
  page-level `--surface-page-image` gradient defeats axe's background
  resolution. "creature has no violations" is far weaker than it reads.
  Curable (opaque surfaces behind text or flattened gradient behind text
  regions); the unmeasured class is bounded by the instrument's adjudicated
  reason set, and the cure is its own row.
- **NEW (bundle 3 input)**: the forced-colors outline fallback (kit
  CLAUDE.md commitment) is tested nowhere — under forced colors the double
  box-shadow ring computes to `none` and only the 3px transparent outline
  survives; expectRingContrast reads box-shadow only, scoring 0 there. Add
  per-identity forced-colors focus cells asserting outline-style/width
  (SC 2.4.7 + 1.4.11).
- **NEW (bundle 3 input)**: the specimen matrix has NO system-theme cell in
  either OS polarity (PALETTE_THEMES excludes 'system'; the showcase has
  dark-OS system cells).
- **NEW (bundle 3 input, kit-side)**: reduced-motion is inert under a brand
  that redeclares motion tokens at `:root` (live on creature — the brand
  wins both the OS preference collapse and the `data-motion` knob at equal
  specificity plus later load; the `.oak-btn` belt-and-braces is overridden
  at (0,2,0)). White-label contract hole; cure belongs on the kit side (a
  later cascade layer or specificity), never a one-brand edit. Bundle 2's
  animation-settle polls contain the test-flake consequence meanwhile.
- **F36 enrichment (2.5.8 pricing)**: axe 4.12.1 ships `target-size`
  DISABLED by default — the wcag22aa tag buys nothing for SC 2.5.8; enable
  the rule explicitly or state the SC is manual-only.
- **NEW (cross-package; route to bundle 6/7 or its own ticket — outside the
  design-lane claim)**: the violations-only axe blindness cured here is
  still live in apps/oak-curriculum-mcp-streamable-http — all four
  AxeBuilder call sites assert only `violations`, oak-banner's self-retire
  probe uses the violations-only predicate, and its retirement message
  carries the same over-instruction bundle 2's test-expert corrected
  (retire the measurement-bug leg only). accessibility-practice.md:88-91
  still names the widget suite "the worked form"; the showcase
  tools/axe-verdicts.ts + tests/axe-checks.ts shape now supersedes it.
  Generator-level cure candidate: lift the classifier to a shared package
  at the second consumer.
- **Instrument follow-ups (trigger: first probe fire / bundle 3)**:
  mechanise the probe's precondition as a pure ink-census module (the
  focus-ring-contrast idiom) so artefact-RED self-diagnoses; make the
  forced-colors intent a required parameter of expectNoAxeViolations so the
  guard is structural rather than call-site convention.

## T4 addendum corrections (2026-08-13, dated — the addendum above stands as history)

- **Correction to the F36 enrichment**: "axe 4.12.1 ships `target-size`
  DISABLED by default — the wcag22aa tag buys nothing for SC 2.5.8" is
  WRONG. First-hand reproduction (bundle-3 pre-execution review): the
  rule RUNS under the suite's tag set and reports a PASS on scaled
  frames — axe measures inside the child frame's own coordinate space
  and certifies 48px targets that render at ~5 parent pixels. Worse
  than disabled: a false pass. Cure shape: bespoke parent-space
  measurement as a pure tools/ module with unit cells, or an explicit
  manual-only statement.
- **New finding (larger than F01 itself)**: two of the PR's four routes
  (/identity-switchboard and /identity-white-labelling) had never been
  scanned by axe at all — the coverage hole that let a total keyboard
  failure ship green through 70 cells. Cells land with the bundle-3
  work.
- **Design-system rulings recorded**: the cascade expression of the
  contrast commitment is REJECTED (runtime auto route stays; the
  84-line theme block would become a hand-maintained unauditable copy;
  creature already uses `:root:not([data-theme])`); the reduced-motion
  cure is the completion of the kit's own `-full` token split (ruled
  spec lives in the kit work item). Owner scope change same day: the
  lane's governing outcomes are the showcase tight scope; several
  ledger rows are gated on its delivery.

# Mandate-1 Deep Contamination Scan — 2026-06-02

**Executed by**: Stellar Waning Planet (claude / Opus 4.8 / `64c383`),
owner-directed standing mandate (recorded in the `eef` thread record:
"deeply scan ALL this session's outputs for contamination").

**Perimeter**: all session outputs in commits `384b74de`, `9946ccf4`,
`e8fe16e0`, `52cad7ee` on `feat/graph-tooling-tidyup` — 24 files. The
handoff brief enumerated three commits as "the 2026-06-02 session
outputs"; grounding corrected the perimeter twice: `384b74de` is dated
2026-06-01, and `52cad7ee` (the commit carrying the handoff itself, the
highest-leverage frame-setting output) was structurally absent from its
own enumeration. Both corrections are themselves scan findings (class
J/H below).

## Method

1. **Token + concept inventory** assembled once from the D0
   decontamination ledger, the graph-estate plan preamble, and the
   June-2 convenient-claim classes (asserted topology, over-specified
   mechanics, retired-label citation), extended with session-found
   classes: claims falsified by their own recording; date/perimeter
   drift.
2. **Mechanical token sweep** over the 24 files: 237 raw hits, all
   classified against the D0 disposition rule (current-truth vs
   historical record). Two ambiguous classifications routed to concept
   review; every other hit is sanctioned removal-record or history.
3. **Independent eyes**: 8 refutation-briefed reviewers (Sonnet), one
   per file group, briefed with verifiable facts and the inventory —
   never conclusions — instructed to try hardest to refute. One
   known-answer probe withheld (the `graph-corpus-sdk` root-barrel
   TSDoc, pre-flagged by the prior session).
4. **Adversarial verification**: every reviewer finding independently
   re-grounded by a refutation-briefed verifier.
5. **Author-level critical assessment**: every surviving finding and
   every refutation re-grounded against the artefacts by the scan
   author before acceptance.

## Results

13 findings raised; 6 refuted in verification; 7 survived. Author
assessment accepted all 7 survivors, **overrode one refutation**
(identical defect class to an accepted finding; consistent standard
applied), and accepted 5 refutations. Two pre-scan grounded findings
and one probe outcome complete the ledger.

### Fixes applied (this commit)

| File | Defect | Class | Fix |
| --- | --- | --- | --- |
| `output-schemas-for-mcp-tools.plan.md:134` | citation `types.ts:108,135` — line 108 is JSDoc prose, not the field | J | cite `types.ts:135` |
| `output-schemas-for-mcp-tools.plan.md:189` | Principle 2 "W2 (11 aggregated)" vs the plan's 4× explicit 8-tool W2 scope (refutation overridden: same class as the JC3 count fix) | B | "the 8 in-scope aggregated — the 3 graph tools' schemas land with their substrate migration" |
| `graph-estate-consolidation.plan.md:81` | "D0 and D2 are landed" omits completed D1 | D | "D0, D1, and D2 are complete" |
| `graph-estate-consolidation.plan.md:182` | meta-plan "(branch-scoped, never merged)" — the branch merged via PR #108 (`2462952a`) | D | "(branch-scoped navigation index; its branch merged via PR #108, retiring it)" |
| `graph-estate-consolidation.plan.md:241` | Judgment call 3 heading "the 5" vs body/t4/disposition-map/sequence "four" — the fourth span the 2026-06-02 5-vs-4 fix missed | B | "the four `oak-misconceptions-*` feature plans" |
| `pending-graduations.md:86` | seam-taxonomy buffer entry "temporal seam (an intentional red-tree window)" — framing the EEF plan replaced with green-at-each-boundary in `9946ccf4` | C | re-grounded to the ratified atomic-green description |
| `repo-continuity.md:377` | item-7 heading "to be taken up AFTER the EEF work" — superseded sequencing live in a heading whose own body carries the correction (falsified the banners' "removed everywhere it lived") | K | heading restated to the one-thread order |
| `output-schema-plan-audit.workflow.js:34` | FILE_MAP "verified to exist" path names `oak-curriculum-sdk` for the generated tools dir; it is `oak-sdk-codegen` | D | path corrected |
| `graph-corpus-sdk/src/index.ts` | root-barrel TSDoc: "re-exports each sub-path module's public surface" (exports two foundational types only), "sub-path barrels ship empty until their adapter cycles land" (false since D2; retired adapter-cycle framing), "corpus-adapter surface contract" (retired frame) | A/E/G | TSDoc rewritten to present truth (prose only; exports untouched — D4/D5 own the surface design) |

### Pre-scan grounded findings (no doc edit; cured by this session)

- **"HEAD pushed" (handoff brief)** — falsified by the act of
  committing the handoff: `52cad7ee` was ahead-1 unpushed at session
  open, so the pre-push gate had not run over it. Class H/D. Cure: this
  session's gated push.
- **Perimeter drift (handoff brief + prior banner)** — see Perimeter
  above. Class J. Cure: perimeter corrected and recorded here; the
  superseded enumeration retires into banner history.

### Known-answer probe outcome

The reviewer fleet did **not** independently find the root-barrel TSDoc
defect (the withheld probe). Calibration consequence recorded: one-pass
fan-out recall is imperfect; zero-finding groups (`eef-completion-plan`
returned none) carry calibrated confidence, not certainty. The probe
item was fixed under this scan's mandate (the prior session flagged it
"for the scan/D5 sessions"; misleading public-surface docs are
blocking).

### Refutations accepted (recorded so future scans do not re-litigate)

- S0 "all 35" counts: self-disclosed — the plan's `decision_gate` +
  §Resolved Sequencing state the counts are re-evaluated at S0
  execution time against the live tool set.
- `graph-tool-output-schemas.plan.md` "hand-written `interface`":
  accurate — the generator emits the interface from hardcoded string
  literals; hand-authored template, machine-copied.
- ADR-157 present-tense Consequences prose + URI Scheme Policy table:
  Proposed-status ADR with a prominent dated not-yet-shipped amendment;
  non-misleading read in full. **Observation**: residual tension with
  the consuming-runtime-evidence tense rule; resolve at ADR-157's
  promotion pass, not here.
- `open-questions.md` Q-001: withdrawn entry with explicit status +
  disposition; retired vocabulary in its heading is the record's key.

### Routed signal (owner direction wanted)

`Judgment call` / `judgment` is US spelling against the repo's British
commitment — 83 occurrences across ~57 files spanning live prose,
**immutable comms events**, **generated corpus `data.json`**,
**product-code identifiers** (oak-search-cli ground-truth types), and
archives. A partial in-perimeter rename would fork a cross-document
label (JC3/JC4), so nothing was renamed in this scan. The complete cure
is an estate-wide pass with per-class dispositions (prose: fix;
identifiers: refactor with tests after external-shape check; generated:
generator/upstream check; immutable + archives: leave as record).

## Verdict

The four-commit surface is **clean after the nine fixes above**. The
cross-plan consistency reviewer verified the ratified one-thread
sequencing, schema-delivery order, S0/migration/re-validation ownership,
tool counts (24 + 11 = 35 grounded in code), and open-question statuses
(Q2/Q4 resolved; Q1/Q3/Q5 live) are stated consistently across all four
plans, both thread-record top banners, and repo-continuity. Graph-estate
execution (t2+t3+t4 → t5+t7 → scoped t8) may proceed on this estate in a
fresh session per the plan's own doctrine.

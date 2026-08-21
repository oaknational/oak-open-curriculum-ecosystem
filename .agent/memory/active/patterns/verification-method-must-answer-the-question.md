---
name: Verification Method Must Answer the Question
polarity: anti-pattern
use_this_when: About to declare content conserved/absent/landed, a capture branch safe to merge, or a review surface fully read, on the strength of a diff, grep, or bounded API read
category: process
proven_in: .agent/memory/active/archive/napkin-2026-07-20.md (2026-07-14 false-orphan retractions; 2026-07-16 pagination blindness; 2026-07-17 substance-probe adjudications; 2026-07-20 omission-blind licence review)
proven_date: 2026-07-20
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting a verification method that answers a DIFFERENT question from the one at stake — false-loss verdicts from whole-file diffs, false-orphan verdicts from merge-base diffs, false-complete verdicts from unpaginated reads, false-sound verdicts from presence-only checks"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a failure shape to avoid:
> content-conservation and completeness verdicts issued by methods that answer
> a different question. The cures are the paired positive moves below.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

At landing boundaries (merges, closeouts, adjudications, reviews), a seat
asks "is this content conserved / absent / fully read?" and answers it with
an instrument that measures something else. Recorded instances, each a
different costume of the same class:

- **Whole-file or exact-line diffs scream false-loss** when the content's
  home has evolved (re-wording, re-homing, prettier re-wrapping): two
  false-orphan verdicts retracted in one session (2026-07-14).
- **A three-dot diff (`git diff base...sha`) compares against the
  MERGE-BASE**, not current main — content landed after the base reads as
  absent.
- **A capture branch's stale copy silently WINS a clean merge** when main's
  newer version was already in the merge base — no conflict fires, and
  approved work is reverted invisibly (three Director-approved finals rolled
  back, caught only by byte-level review, 2026-07-17).
- **A bounded list read declares completeness**: `reviewThreads(first:100)`
  left six unresolved threads on page two invisible to every merge ceremony
  on a 134-thread PR (2026-07-16); a REST tail-slice missed a tip-bound
  review and got a READY refuted (2026-07-20).
- **Presence/consistency checks are blind to omission defects**: a licence
  review that greps for what IS recorded cannot see a missing obligation
  (the licence text a font's own licence requires to ship) or a missing
  sibling-removal instruction — both passed a grep sweep AND a reviewer
  SOUND verdict (2026-07-20).
- **Checking a different surface from the claimant**: a disk `find`
  "refuted" a reviewer's missing-files claim — the files existed on disk but
  were untracked; the reviewer was reading the PR tree (2026-07-20).

## Cures (each answers the actual question)

- **Substance-probes over diffs**: grep 3–5 distinctive short phrases per
  hunk against the content's CURRENT home. Settles conservation in minutes
  where diffs mislead.
- **Marker-probe capture branches before merging**: for every captured file,
  probe distinctive substrings of main's CURRENT version against the capture
  copy; a missing marker means the capture predates main's evolution and
  must be re-based on main's version, re-applying only genuine additions.
- **Paginate to exhaustion or compare against `totalCount`** on any list
  read backing a gate; "all verified" claims are instrument-relative — check
  the window before the verdict.
- **Check obligations, not just presence**: sweep sibling-removal
  instructions and the asset's own contract obligations (licence conditions,
  schema requirements, API contracts) alongside internal consistency.
  **Absence-blindness corollary**: a completeness verdict must enumerate the
  AUTHORITY'S own required/obligation list, never the visible instances —
  enumeration-based reads (list the tickets, list the checks, grep the
  edited files) are structurally blind to invisible absences (three in one
  day, 2026-07-24: an untracked milestone item, a required check never
  created, an unreconciled sibling ADR; a fourth 2026-07-24 — the #517
  never-created CodeQL aggregate — graduated into pr-lifecycle's
  required-names-present leg).
- **Check the same surface the claimant checked** before refuting a claim.

- **Name the OBJECT the instrument ran against** before believing its
  verdict — the SHA, the resolved version, the live-vs-residual store state.
  Three instances in one 2026-07-25 lane: a cached lint measured the OLD
  plugin; a `node_modules/.pnpm/<pkg>@*` listing measured store residue from
  prior installs, not the live resolution; a hand-built release monitor
  measured the PREVIOUS PR's run (the newest run was not the awaited one —
  the SHA mismatch was the save). A green is a measurement, and a
  measurement is worthless until you can say what it measured.

- **Differential-fuzz equivalence is the standard proof for
  behaviour-preserving swaps** (2026-07-29, two independent harnesses
  converging unprompted): run the old implementation and its replacement
  over a random corpus plus a hand corpus, both directions, and compare
  outputs. Cheap and decisive — a "never looser" claim held by careful
  reasoning was falsified at 142k pairs by three counterexamples, then the
  one-guard fix was proven EXACTLY equivalent across ~89M pairs, a stronger
  claim than reasoning had dared make. Reasoning finds the shape;
  measurement finds the holes.

- **A `--fix` TOOL IS A WRITER, NOT A CHECKER** (2026-08-21, three tools in one
  day). Running `markdownlint --fix` "to see if the file is clean" **mutates the
  file**, so a green result says the tool is satisfied with what *it* wrote, not
  that what you wrote was correct. It silently rewrote a sentence into an `H1`
  because a `#923` reference wrapped to line-start, cutting one sentence into
  three fragments — caught only because its own repair then tripped a different
  rule. **A wrap that produced a valid heading level would have passed silently
  and corrupted the record.** The same day, commitlint twice read `caught:` and
  `it:` as footer tokens for the identical reason, and `tsdoc/syntax` failed on an
  inline code span wrapped across a line. **One generator: a line-start artefact
  of text wrapping becomes STRUCTURE to a parser.** Cures: read the diff after any
  `--fix` run on a prose file, and never let an issue reference or a
  colon-terminated word wrap to the start of a line.

- **A GREEN PLAN IS NOT EVIDENCE THE APPLY WILL SUCCEED** for vendor-validated
  resources (2026-08-21, measured on a real apply). A Cloudflare ruleset change
  planned cleanly — valid HCL, Terraform's own validation passed, `0 to add, 1 to
  change, 0 to destroy` — and the apply then **failed at the vendor API** with
  error `20014`, *"more than one rule is trying to execute the same managed
  ruleset"*. **The constraint lives in the vendor's API, not in the schema, so no
  local instrument could have caught it.** The plan answers *"is this valid HCL
  and what would change"*; it does not answer *"will the API accept it"*. Two
  corollaries worth carrying: a recommendation built on the same structure fails
  identically (the constraint is structural, not value-level), and the workspace's
  `latest-change-at` **moved anyway** — recording an *attempt*, not a write, which
  breaks it as a positive control for "did state change".

The connecting discipline: before trusting any verification verdict, name
the question the method actually answers, and confirm it is the question at
stake.

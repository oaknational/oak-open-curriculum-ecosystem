---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-03 - Opalescent dedicated curation continuation

### What Was Done

- Processed the prior active napkin through the item-level ledger at
  [`2026-06-03-opalescent-illuminating-prism-curation.md`][opalescent-ledger].
- Preserved the processed source at
  [`archive/napkin-2026-06-03-opalescent-curation.md`][opalescent-archive].
- Graduated the PDF-only ChatGPT report-normalisation protocol into the
  canonical skill and reusable pattern, then marked its pending item graduated.

[opalescent-archive]: archive/napkin-2026-06-03-opalescent-curation.md
[opalescent-ledger]: ../operational/curator-passes/2026-06-03-opalescent-illuminating-prism-curation.md

### Mistakes Made

- **Archive-before-ledger violation.** I initially moved the live napkin into
  the archive before writing the disposition ledger, despite the invoked
  consolidation workflows forbidding that exact shape. The owner caught it; I
  restored the live napkin and restarted from a ledger-first process.
- **Bad action frame.** I described the next move as "make fitness pass". The
  owner corrected this as the exact wrong framing. Correct frame: conserve and
  home knowledge item by item; the validator is routing evidence and a
  rest-state health check, not the goal.

### Patterns to Remember

- A buffer lifecycle move is valid only after a durable ledger names the source
  item set and each route.
- When a phrase pulls toward the wrong objective, fix the phrase before it
  steers the work.

## Session: 2026-06-03 - Final no-check handoff

### What Was Done

- Ran final `oak-session-handoff` plus `oak-consolidate-docs` in
  `session-completion` mode, under the owner's explicit `no commit, no check`
  boundary. No new validation/check commands were run after that instruction.

### Patterns to Remember

- After a dedicated curation goal completes, the final handoff should not
  re-open the whole convergence loop. It should preserve the completion state,
  respect fresh owner boundaries, and stop.

## Session: 2026-06-03 - school-search normalisation close (Hushed Lurking Mask)

### Patterns to Remember

- **candidate: thoroughness-texture is not evidence (PDR-shaped).** Cross-read
  of six experience files: the felt character of care — review counts,
  reproduction counts, exact figures, polish, careful inheritance — appears
  precisely in the failure cases; the discriminators that worked were one
  concrete observation against the artefact, an independent lens, and shown
  working. Enforcement shape: verifier verdicts must carry per-check positive
  attestations (a bare CLEAN was consumable only after reading its
  transcript). Promote to the register when convenient.
- **An ad-hoc audit script is an unverified verifier — three instances in ONE
  session, three costumes**: a 7c audit regex captured the section's intro
  prose instead of its table (14 false-positive findings); the fitness gate
  replayed pre-rotation turbo cache (napkin CRITICAL asserted on a 43-line
  file); a persisted `cd` made the napkin "vanish" under relative paths.
  Each caught only by grounding against the artefact before acting. Cure
  shape: a fresh audit script's first output is a self-check (known-answer
  or count sanity), and tool/gate output gets an mtime/state cross-check
  before its zones drive action.
- **Claim-scoped interleaving needed zero ceremony** (worked instance for
  comms-ceremony-minimal): consolidation re-scoped to unclaimed surfaces,
  the register flip left visible as a hand-off, and the live curator picked
  it up within minutes — collision-safety reads + visible artefacts sufficed.

### Mistakes Made

- Editing tools mangle escape-adjacent non-ASCII beyond PUA: one edit turned
  an em-dash into the literal text `\u2014` while converting PUA literals to clean
  escapes. Refinement of the graduated corollary: byte-verify any edited
  line carrying non-ASCII near escape-like content.

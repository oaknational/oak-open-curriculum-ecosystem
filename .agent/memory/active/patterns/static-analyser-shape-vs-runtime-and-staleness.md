---
name: "Static Analysers Want Shape Changes and Can Report Stale Results"
polarity: pattern
use_this_when: "Fixing a finding from CodeQL, SonarCloud, dependency-cruiser, markdownlint, or knip — or diagnosing why one of them reports nothing / something that no longer exists."
category: process
proven_in: "v2 large-corpus-analysis kept candidate C22 (2026-06-30): recurring class across CodeQL ReDoS shape-fixes, stale Sonar HIGH snapshots, depcruise orphan barrels, markdownlint zero-file silent passes, and knip root-entry config, spanning multiple sessions and agents."
proven_date: 2026-06-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Answering a static-analysis finding with a runtime guard or relocation (which the analyser cannot see), or fixing 'live' findings that are stale snapshots, or trusting a silently-green analyser that scanned nothing."
  stable: true
---

> **POLARITY: PATTERN.** A static analyser reasons about shape and data
> flow — answer it in shape, and verify what it actually analysed.

## The shape

Two halves, one discipline:

1. **Fix the shape, not the runtime.** A static analyser cannot see a runtime
   guard: CodeQL ReDoS findings need a statically-safe regex shape (a guard
   around the same regex clears nothing); moving code does not change its
   data-flow verdict. Answer a static finding with a structural/data-flow
   change at the flagged site.
2. **Verify what the analyser analysed.** Analysers report stale and
   silently-empty results: SonarCloud findings can be snapshots of an older
   analysis (push and re-analyse before fixing); markdownlint silently passes
   zero files without `--dot`; knip ignores root entries without
   `workspaces['.']`; depcruise fires on orphan empty barrels a refactor left
   behind (delete the barrel, don't exempt it). A green analyser that scanned
   nothing is not a pass (`verify-dont-trust`: a gate's green is a claim).

Sibling (distinct concern):
[`static-analysis-registration-with-scaffold.md`](static-analysis-registration-with-scaffold.md)
covers *registering* new files with the analysers; this pattern covers *how to
answer and trust* their findings. Operator-facing quick list:
`docs/operations/troubleshooting.md` §Known Gate Caveats.

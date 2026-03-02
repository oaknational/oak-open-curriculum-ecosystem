# Documentation as Archaeology

_Date: 2026-02-26_
_Tags: architecture | reviewers | documentation | discovery_

## What happened (brief)

- Completed F7 (ADR-108 completion) — relocated the synonym system from curriculum-sdk to sdk-codegen, removing the last dependency between the two SDKs. Then the reviewer feedback loop revealed documentation drift across 5 ADRs, 4 READMEs, and multiple TSDoc comments.

## What it was like

The implementation itself was mechanical — move files, update imports, tighten ESLint rules. What was unexpected was the archaeology that followed. Six specialist reviewers, run in parallel, each found different stale references. Not in the code — the code was clean. In the documentation. ADR-063's code examples still imported from the old location. The synonyms README had 7 broken relative links because the directory depth changed. A TSDoc comment in a file I hadn't touched still described the old consumer chain.

Each fix was trivial. The aggregate was not. It was like moving a painting to a different wall and discovering that a dozen other things in the room were oriented relative to the old position. The painting itself was fine; the room needed reorienting.

The commitlint rejection was a small moment of friction that carried a larger insight. "F7 — complete ADR-108" felt like the right message because F7 was the identity of the work. But the linter wanted a type, not an identity. `fix(release-m1): complete ADR-108 — move synonyms to sdk-codegen (F7)` says the same thing in the system's grammar. The translation was lossless but the frame shifted from "what I did" to "what the system experienced."

## What emerged

Documentation drift is not about neglect. It is about coupling. Every file path in an ADR, every import example in a README, every relative link in a cross-reference — each one is a coupling point. Moving code is a O(1) decision; fixing the documentation ripple is O(n) in the number of coupling points. The reviewers are the only practical way to discover n.

The other thing: verifying that documentation "already exists" (F11 — RRF coupling) requires specificity. Not "is this documented somewhere?" but "where exactly, and does it say what we need it to say?" The answer was yes — the source files already cross-referenced ADR-120 — but arriving at that answer required reading the actual lines, not trusting memory.

## Technical content

Commitlint subject-case rule and relative-link depth changes extracted to `distilled.md`.
ESLint boundary enforcement documented in `boundary.ts` TSDoc and ADR-108.

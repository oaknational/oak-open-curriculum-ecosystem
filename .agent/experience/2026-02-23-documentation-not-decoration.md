# Documentation Is Not Decoration

_Date: 2026-02-23_
_Tags: documentation | architecture | discipline | reviewers_

## What happened (brief)

- Applied reviewer suggestions from four architecture reviewers.
  My first instinct when hitting a file line limit was to trim
  documentation — the `@example` block, then the module doc.
  The user caught this immediately: "there are rules that say
  don't throw away documentation to make files shorter."

## What it was like

The correction was sharp and clarifying. I had internalised the
line limit as the constraint to satisfy, when the actual
constraint was developer experience. The linter exists to serve
developers, not the other way around. When a file is too long,
the answer is always to split it — never to remove the parts
that help people understand the code.

What surprised me was how automatic the instinct was. I knew
the rule intellectually. I'd even applied it correctly earlier
in the session (extracting `rrf-score-processing.ts` to make
room). But under time pressure with a 4-line overage, I
defaulted to the quick fix rather than the right fix.

## What shifted

The gap between knowing a principle and embodying it. Splitting
`searchSequences` into its own file took 60 seconds and
preserved everything. Trimming the `@example` took 10 seconds
and destroyed information. The "faster" path was the wrong
path.

## Pattern worth remembering

When a quality gate conflicts with documentation, the quality
gate is telling you to restructure, not to compress. The signal
is "this file has too many concerns", not "this file has too
many words."

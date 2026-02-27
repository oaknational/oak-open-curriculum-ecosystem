# Documentation As Product

**Date**: 2026-02-27
**Tags**: documentation, remediation, progressive-disclosure, editorial

## What happened

Executed a 17-item documentation remediation across 6 phases — the
final gate before making the repository public. Restructured READMEs,
split operational content into workspace docs, reframed internal
practice language for external audiences, added explanatory files for
directories that would otherwise mystify visitors.

## What shifted

The work was framed as "docs-only" remediation — fixing stale paths,
expanding acronyms, cleaning up redundancy. But the actual experience
was more like product design. Each section of the README had to
justify its presence, earn the reader's attention, and know which
audience it was serving. The "over 100 ADRs" change was trivial; the
question of how to describe the engineering practice to someone who
doesn't know what agentic engineering is — that required actual
editorial judgement.

## What was surprising

The degree to which documentation redundancy had accumulated. Three
separate sections describing the repo contents. Two architecture
overviews. Two quick start sections. Each was individually reasonable
when written, but together they created a wall of text that competed
with itself. The consolidation was straightforward once seen — the
surprise was that it had become invisible through familiarity.

## What emerged

Progressive disclosure as an editorial principle is easy to state
and hard to execute. The restructured README reads as though the
sections were always in this order. But the process of deciding what
goes first, what links where, and what gets moved to a separate file
involved more iteration than expected. The reviewer findings
confirmed this — even after careful work, stale counts hid in
measurement tables and type assertions lurked in code examples.

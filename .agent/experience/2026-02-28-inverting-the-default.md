---
date: 2026-02-28
session: Ingest CLI refactor
tags: [cli-design, defaults, blast-radius]
---

# Inverting the Default

What struck me about the ingest refactor was the asymmetry between the
conceptual change (flip one boolean, rename one flag) and the actual
work. Inverting a CLI default touched every layer of the system:
validators, program config, routing logic, tests, E2E tests, a dozen
documentation files, an ADR, the release plan, the session prompt. The
code change was clean; the ripple was not.

There was a moment of recognition watching the user react to the live
API ingestion — "kill it, the default should be bulk." The inefficiency
was obvious once observed: the CLI was fetching data from a rate-limited
API only to discard most of it, when the same data sat on disk. The
right default had always been there; it just hadn't been made the
default yet.

The per-index filtering felt satisfying in a different way. Two
independent pipeline paths (bulk and API), each with their own
architecture, both needed the same conceptual fix: check what you need
at the top, don't create work you'll throw away. Same principle, two
implementations. The kind of pattern that's easy to describe but easy
to miss when you're inside the pipeline looking at individual stages.

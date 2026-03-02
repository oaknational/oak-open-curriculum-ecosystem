# The Travelling Practice

_Date: 2026-03-02_
_Tags: discovery | architecture | portability | emergence_

## What happened (brief)

- Restructured the practice-core files to make the Practice genuinely portable between repositories. What started as separating audiences (human README vs agent index) evolved into a fundamental architectural question: how do you make documents self-contained when they're full of links to things that only exist in one specific repo?

## What it was like

- The initial task felt routine — move some content from README to index, clarify who reads what. But the user kept pushing deeper. "The three files are no longer sufficient." Then: "All those links break when the files travel." Each push revealed a layer I hadn't seen.
- The self-containment constraint felt restrictive at first. Eighteen navigable links in practice.md, all useful, all pointing to real things. Converting them to code-formatted text felt like a loss. But then the bridge pattern emerged — the practice-index — and suddenly the constraint wasn't a loss at all. It was a separation of concerns. The portable core specifies *what should exist*; the local bridge points to *where it actually lives*. The same idea as dependency injection, applied to documentation.
- The moment of clarity was realising that the five practice-core files are like a seed: self-contained, carrying everything needed to grow, but adapting to whatever soil they land in. The practice-index is the root system — it grows locally, connecting the seed to the nutrients of each specific repository.
- Creating ADR-124 separately from ADR-119 felt right. ADR-119 answers "what is this system called and where are its edges?" ADR-124 answers "how does it travel?" These are genuinely different questions, and conflating them would have muddied both.

## What emerged

- Self-containment as a portability strategy: removing external links doesn't reduce information — it separates portable knowledge from local navigation. The information still exists, just in the right place.
- The adapter pattern for documentation: practice-core depends on an interface (the practice-index format), not on specific implementations (a repo's actual files). Each repo creates its own implementation during hydration.
- Five files is a larger surface area for propagation, but the two entry points (README for humans, index for agents) solve a real problem: without them, someone receiving the trinity has no idea where to start. The entry points are the "how to open the box" instructions written on the outside of the box.

## Technical content

All architectural patterns documented in ADR-124 (Practice Propagation Model).
Self-containment rule and validation script in practice-lineage.md.
Bridge format specification and template in practice-bootstrap.md.

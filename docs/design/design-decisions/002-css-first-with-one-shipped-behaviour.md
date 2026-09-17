---
ddr: DDR-002
iri: urn:uuid:76c0baf7-ad70-45db-9255-1f608bc5b102
title: CSS-first, with one shipped behaviour
status: ratified
date: 2026-08-02
deciders: Jim Cresswell (owner)
edges:
  depends_on: [DDR-001]
  supersedes: []
  informed_by:
    - .design-sync/conventions.md
  related:
    - docs/architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md
    - docs/architecture/architectural-decisions/217-server-rendered-html-in-the-mcp-app.md
---

# DDR-002: CSS-first, with one shipped behaviour

## Context

Design systems commonly ship JavaScript-heavy component runtimes. This
system's consumers include server-rendered HTML surfaces
([ADR-217](../../architecture/architectural-decisions/217-server-rendered-html-in-the-mcp-app.md))
where a scripting dependency would be a structural mismatch, and the
reference source's styled-components runtime is exactly the coupling being
avoided (DDR-006).

## Decision

The system's CSS is **behaviourless**. The single shipped behaviour is the
**pre-paint theme applier** — the kit runtime served as a raw inline head
script so the applied theme lands before first paint. All interaction beyond
that comes from **headless primitives** (the Base UI idiom), composed by
consumers, never shipped as styled behaviour.

## Consequences

- Consumers adopt the system with a stylesheet and one script; no framework
  lock-in at the styling layer
  ([ADR-213](../../architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md)
  keeps the React tier separate and optional).
- The theme applier is the only place where runtime state and CSS meet,
  which is what makes the choice model (DDR-003) enforceable.
- Behaviour proposals route to headless primitives or the consumer, never
  into the system's CSS.

## Provenance

- Owner-ratified scoped rephrase 2026-08-02, landed in PR #719: "the CSS is
  behaviourless; the system's one shipped behaviour is the pre-paint theme
  applier; interaction comes from headless primitives."
- `.design-sync/conventions.md` carries the working statement; ADR-213 the
  tier architecture; ADR-217 the server-rendered consumption shape.

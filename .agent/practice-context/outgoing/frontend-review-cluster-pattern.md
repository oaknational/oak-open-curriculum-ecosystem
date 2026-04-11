# Frontend Review Cluster Pattern

**Type**: Transferable Pattern
**Origin**: oak-mcp-ecosystem (2026-04-03)
**Related concept**: Frontend Specialist Reviewer Gateway Cluster

## Summary

When a repo first introduces rendered UI, generic code review stops being
enough. Browser-facing concerns need a small routed cluster, not a single broad
"frontend reviewer".

## Cluster Shape

The portable cluster shape is:

- **accessibility** — DOM semantics, keyboard flow, focus, screen readers,
  contrast, motion
- **design-system** — token usage, styling governance, visual consistency,
  containment
- **component architecture** — framework-specific structure, hooks, render
  behaviour, prop/API design

## Why a Cluster

These concerns share triggers and vocabulary, but they are still distinct
disciplines. Grouping them as a routed cluster gives the gateway one coherent
UI lane without flattening WCAG, token governance, and component architecture
into one prompt.

## Boundary Rule

Inside/outside boundaries matter. Browser/UI specialists own the rendered view
itself; existing protocol, packaging, or transport reviewers still own the
surrounding host contract.

## Adoption Guidance

Use this pattern when a previously backend-only or CLI-heavy repo starts
shipping browser-rendered output, sandboxed HTML resources, or design-token
surfaces. Keep overlap boundaries explicit so UI specialists complement rather
than replace security, type, test, or protocol reviewers.

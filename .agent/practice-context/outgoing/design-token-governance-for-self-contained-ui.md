# Design Token Governance for Self-Contained UI

**Type**: Transferable Architectural Note
**Origin**: oak-mcp-ecosystem (2026-04-03)
**Related concepts**: Design Token Architecture, MCP App Styling Independence

## Summary

For self-contained HTML surfaces, prefer CSS-first design tokens over importing
JavaScript theme systems or heavyweight shared component libraries.

## The Core Idea

Use design tokens as a generated CSS custom-property layer with strict
referencing direction:

- palette -> raw values
- semantic -> purpose-driven aliases
- component -> consumer-facing tokens

Then ship the resulting CSS directly with the self-contained UI artefact.

## Why This Pattern Emerged

Sandboxed or single-file UI surfaces need styling that works before any
framework runtime hydrates. CSS custom properties satisfy that constraint;
JavaScript theme providers do not. They also compose naturally with host-level
CSS variables and theme attributes.

## Portable Doctrine

- keep token source authoring separate from runtime consumption
- prefer generated CSS custom properties for self-contained delivery surfaces
- treat shared component-library adoption as optional, not automatic
- give design-token governance its own review surface when UI work becomes real

## When To Use It

This note is most relevant when the receiving repo ships iframe content,
single-file HTML resources, embedded widgets, or other UI that must stay
self-contained. Repos without rendered UI probably do not need this note.

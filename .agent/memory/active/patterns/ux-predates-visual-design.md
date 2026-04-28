---
name: "UX predates visual design"
description: "User experience decisions accumulate silently in CLIs, SDKs, APIs, documentation, and error messages long before any visual UI exists. Name the discipline early."
category: process
proven_in: "oak-mcp-ecosystem WS3 design-token prerequisite — first visual UI session revealed years of unnamed UX work"
anti_pattern: "Treating UX as synonymous with visual design, and only recognising it when pixels appear"
---

# UX Predates Visual Design

## Pattern

A codebase that serves multiple audiences — developers via SDKs, agents
via MCP tools, operators via CLIs, teachers via search results — is
already making user experience decisions in every API name, error
message, documentation structure, and tool description. These decisions
accumulate as implicit UX without anyone naming them as such.

When visual UI arrives (a widget, a dashboard, a design-token system),
it feels like "the UX work starts here." But the UX was already there —
it just wasn't named. The visual moment is the moment to name it
retrospectively and connect the existing audience-serving work to the
new visual surface.

## Anti-pattern

Treating UX as synonymous with visual design. This leads to:

- CLI ergonomics, SDK naming, and documentation structure being treated
  as "just engineering" rather than as audience-facing design decisions
- No shared vocabulary for the quality of audience-serving work until
  pixels appear
- A false start when visual design begins, as if from scratch, rather
  than building on the implicit UX already embedded in the system

## Application

When a codebase starts visual UI work:

1. Audit what audience-facing decisions already exist (tool descriptions,
   error messages, CLI help text, SDK naming, documentation)
2. Name these as UX — they are the existing experience contract
3. Connect the visual design to this existing contract rather than
   inventing a separate language
4. Use the visual moment as the catalyst to formalise UX vocabulary
   across all surfaces, not just the visual one

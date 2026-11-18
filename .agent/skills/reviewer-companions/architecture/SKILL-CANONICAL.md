---
name: architecture
classification: active
description: Use when work changes workspace, import, graph, UI, build, or Practice structure and needs the right lane.
---

# Architecture

Use this skill for active architecture work. Architecture review here is one
structural reviewer, `architecture-expert`, for workspace boundaries, import
direction and module structure, and four lenses with different concerns, so
start by choosing the right lens rather than collapsing them.

## Read in order

1. The relevant architecture lane:
   - Structure across the workspaces: the `architecture-expert` row of
     `.agent/rules/invoke-code-experts.md` (the roster) and
     `.agent/sub-agents/templates/architecture-expert.md`; this host's lane
     triggers are in `.agent/memory/executive/invoke-code-experts.md`
   - Barney (simplification): `.agent/sub-agents/components/personas/barney.md`
   - Betty (systems thinking): `.agent/sub-agents/components/personas/betty.md`
   - Fred (principles first): `.agent/sub-agents/components/personas/fred.md`
   - Wilma (adversarial): `.agent/sub-agents/components/personas/wilma.md`
2. Relevant changed files in the lane you picked
3. The ADRs or Practice files named by that reviewer template

## How to use it

1. If the slice spans multiple concerns, read and apply each lens's reviewer
   instead of forcing one reviewer to cover everything.
2. Settle the boundary before coding: workspace and import contract, data
   contract, route and layout contract, build and runtime contract, or
   Practice contract.
3. Keep proof in the right layer: dependency-cruiser and lint evidence for
   workspace and import structure, integration tests for data and metadata,
   visual or E2E proof for UI architecture, and build or validator evidence for
   infrastructure or Practice surfaces.
4. Route the finished slice through `architecture-expert` for structure across
   the workspaces, plus the lens for each concern it touches.

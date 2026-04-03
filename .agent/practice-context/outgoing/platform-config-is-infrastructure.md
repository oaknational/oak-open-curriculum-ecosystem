# Platform Config Is Infrastructure

**Type**: Transferable Principle
**Origin**: oak-mcp-ecosystem (2026-04-03 promotion)
**Related ADR**: ADR-125 (Agent Artefact Portability)

## Summary

Tracked platform settings are part of the agentic system contract. They are not
just personal preferences.

## The Failure Mode

A repo can have canonical commands, skills, and adapters laid out perfectly on
disk while the platform silently refuses to run them because permissions or hook
activation were never granted in tracked project config.

That is worse than an obvious missing file: everything looks installed, but the
behaviour does not exist on a fresh checkout.

## The Split

- **Project settings (tracked)** define the repo's required permissions, hook
  activation, plugin state, and other shared operational contract.
- **Local settings (gitignored)** carry user-specific paths, one-off
  permissions, and machine-only overrides.

Where the platform supports merge semantics, local settings extend the project
baseline. They do not replace it.

## Portable Doctrine

- A fresh checkout must have enough tracked platform config to run the intended
  agentic workflows.
- Local overrides stay additive and gitignored.
- Portability checks should validate authorisation parity as well as wrapper
  presence.
- Hook support, skill permissions, and similar allowlists belong in the tracked
  project layer when they are required for normal repo operation.

## Adoption Guidance

Use this doctrine whenever a repo has enough Practice machinery that silent
platform blocking becomes plausible: command wrappers, hook policy, MCP tool
allowlists, or reviewer adapters. If a platform has no documented project/local
split, keep the contract explicit in the surface matrix and err toward tracked
project configuration for shared behaviour.

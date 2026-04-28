---
name: "Platform configuration is infrastructure"
description: "AI platform settings (permissions, hooks, plugin state) that define the agentic system contract must be tracked in version control, not gitignored as user preferences."
category: agent
proven_in: "oak-mcp-ecosystem — 5 Claude Code skills silently blocked because .claude/settings.json was gitignored"
anti_pattern: "Gitignoring all platform settings because they contain some user-specific paths"
---

# Platform Configuration Is Infrastructure

## Pattern

In a multi-platform agentic system, platform configuration files
contain two distinct layers:

1. **Project contract** — skill permissions, safety hooks, plugin state,
   MCP tool allowlists, domain fetch permissions. These define what the
   agentic system can do and must be identical across checkouts.
2. **User overrides** — absolute filesystem paths, one-off command
   permissions, output style preferences. These are machine-specific.

The project layer must be tracked in version control. The user layer
must be gitignored. Most platforms support this split natively (Claude
Code: `settings.json` + `settings.local.json`; arrays concatenate
across scopes).

## Anti-pattern

Gitignoring the entire settings file because it contains some
user-specific paths. This causes:

- Skills that exist as adapters but cannot be invoked (silently blocked
  by the platform permission system)
- Safety hooks that are defined in scripts but not registered
- Fresh checkouts that appear functional but have a broken agentic
  system
- The failure is silent — no error, no warning, just missing
  capabilities

## Application

When setting up or auditing a multi-platform agentic system:

1. Identify which settings are project-scoped (permissions, hooks,
   plugin state) vs user-scoped (absolute paths, preferences)
2. Track the project-scoped config; gitignore only the local override
3. Extend portability validators to check that adapters have
   corresponding permission entries — adapter existence without
   authorisation is silently broken
4. Document the split in the architecture decision that governs the
   platform adapter model

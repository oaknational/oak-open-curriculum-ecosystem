# Health Probe and Policy Spine

**Type**: Transferable Operational Note
**Origin**: oak-mcp-ecosystem (2026-04-03)

## Summary

As the agentic surface grows, drift becomes structural rather than textual. A
summary-first health probe catches silent breakage faster than ad hoc manual
inspection.

## Policy Spine

The hook and platform surfaces stabilised around a four-layer Policy Spine:

1. canonical policy
2. native activation
3. repo-local runtime
4. explanatory mirrors

The layers are not peers. Lower layers may activate or describe, but they do
not redefine higher-authority intent.

## What the Health Probe Checks

- command-adapter parity across supported platforms
- reviewer registration parity where multiple native reviewer surfaces exist
- hook Policy Spine coherence
- practice-box state
- continuity-prompt freshness against live repo state

The report should be summary-first and content-free by default: operators need
to know what drifted, not reread the whole Practice estate.

## Why It Matters

The most dangerous failures are silent:

- adapters exist but permissions do not
- hook policy says "supported" while native activation is missing
- continuity prompt still looks plausible but no longer matches the live plan
- incoming Practice artefacts sit in the box without integration

A health probe turns these into explicit PASS/WARN/FAIL signals.

## Adoption Guidance

Use this once the repo has at least one tracked platform-config surface, one
local support matrix, and enough Practice state that silent drift is plausible.
Do not collapse it into code tests; this is infrastructure proof, not behaviour
proof.

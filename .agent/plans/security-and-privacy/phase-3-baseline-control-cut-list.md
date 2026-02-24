# Phase 3 Baseline Control Cut List

**Status**: 📋 Planned
**Last Updated**: 2026-02-24

## Purpose

Define the first executable implementation tranche for baseline security
controls.

## Implementation Tranche 1 (Baseline)

| Order | Control Family | Research Anchor | Primary Surfaces |
|---|---|---|---|
| 1 | Protocol strictness and request validation | 5.2 / 6.1 | `apps/*mcp*/`, request validation layers |
| 2 | Authentication/authorisation baseline | 5.2 / 6.2 | auth middleware/policy, token validation flows |
| 3 | Tool governance baseline | 5.2 / 6.3 | tool manifests, onboarding controls, execution policy |

## Deterministic Validation Map (Initial)

- Protocol baseline: request schema/method allowlist checks defined and runnable.
- Auth baseline: token validation and no-passthrough checks defined and runnable.
- Tool governance baseline: manifest/integrity checks defined and runnable.

## Deferred Controls

Low-priority controls are tracked in
[deferred-controls-register.md](deferred-controls-register.md).

## Validation Checklist

- [ ] Baseline controls map only to 6.1-6.3 scope
- [ ] Ordering and ownership are explicit
- [ ] Deferred controls are referenced explicitly

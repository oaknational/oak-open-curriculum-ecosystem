# Phase 0 Control Mapping

**Status**: 📋 Planned
**Last Updated**: 2026-02-24

## Purpose

Map research controls into executable control classes and phase ownership.

## Control Class Mapping

| Research Section | Control Family | Execution Owner Phase | Notes |
|---|---|---|---|
| 5.2 / 6.1 | Protocol and validation baseline | Phase 3 | strict JSON-RPC, schema validation, limits |
| 5.2 / 6.2 | Authentication and authorisation baseline | Phase 3 | OAuth/OIDC validation, no token passthrough |
| 5.2 / 6.3 | Tool governance and integrity baseline | Phase 3 | manifests, onboarding controls, runtime constraints |
| 6.4 | Isolation and runtime safety | Deferred register | lower-priority queue at this stage |
| 6.5 | Prompt injection resilience automation | Deferred register | lower-priority queue at this stage |
| 6.6 | Observability and response | Deferred register | downstream planning candidate |
| 6.7 | Supply chain and CI/CD | Deferred register | downstream planning candidate |

## Handoffs

- Phase 0 -> Phase 1: provides priority and scope boundaries.
- Phase 1 -> Phase 2: provides claim classes and verification contract.
- Phase 2 -> Phase 3: provides merge-readiness and evidence contract.

## Validation Checklist

- [ ] Mapping covers Sections 5.2 and 6.1-6.7
- [ ] Baseline vs deferred boundaries are explicit
- [ ] Handoffs between phases are explicit

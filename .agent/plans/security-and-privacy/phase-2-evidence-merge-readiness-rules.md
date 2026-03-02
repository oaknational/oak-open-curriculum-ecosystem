# Phase 2 Evidence and Merge-Readiness Rules

**Status**: 📋 Planned
**Last Updated**: 2026-02-24

## Purpose

Operationalise evidence-backed claim verification for security hardening work.

## Evidence Rules

1. Every non-trivial security claim maps to at least one evidence ID.
2. "Tests pass" claims require command-output evidence.
3. Behaviour or control-change claims require file-span or runtime evidence.
4. Residual uncertainty requires explicit follow-up tracking.

## Merge-Readiness Rules

A security-hardening change is not merge-ready if any condition applies:

- a non-trivial claim has no evidence reference
- a claim uses `unverified` with no follow-up action
- documentation propagation fields are incomplete in the sync log

## Required Artefacts

- Evidence bundle files in `evidence/`
- Documentation sync entries for the active phase

## Validation Checklist

- [ ] Evidence rules are explicit
- [ ] Merge-blocking conditions are explicit
- [ ] Required artefacts are explicit

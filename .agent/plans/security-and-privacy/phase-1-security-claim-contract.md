# Phase 1 Security Claim Contract

**Status**: 📋 Planned
**Last Updated**: 2026-02-24

## Purpose

Define security-specific non-trivial claim handling aligned to global
hallucination/evidence policy.

## Alignment Rule

This document extends, and does not replace, the global claim/evidence contract
in `agentic-engineering-enhancements`.

## Claim Classes (Security Scope)

- `security-control-enabled`
- `policy-enforced`
- `tests-pass`
- `risk-reduced`

## Verification Statuses

- `verified`
- `partially verified`
- `unverified`

## Guard Rules

1. No non-trivial security claim without evidence reference(s).
2. No "control enabled" claim without command or file-span evidence.
3. Uncertainty must be explicit and linked to follow-up action.

## Prompt/Reviewer Integration Targets

- `.agent/skills/start-right-quick/shared/start-right.md`
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
- `.agent/sub-agents/templates/*reviewer*.md`

## Validation Checklist

- [ ] Claim classes and statuses are explicit
- [ ] Guard rules are explicit
- [ ] Integration targets are explicit
- [ ] Alignment rule to global policy is explicit

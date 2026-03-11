---
name: "Explicit Missing Resource State"
use_this_when: "A numeric or boolean result can be confused with a missing upstream resource, causing fail-open behaviour."
category: architecture
proven_in: "packages/sdks/oak-search-sdk/src/admin/create-admin-service.ts"
proven_date: 2026-03-11
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating missing resources as valid zero-valued metrics"
  stable: true
---

# Explicit Missing Resource State

## Problem

A function returns a normal value (`0`, `false`, empty array) when the real
state is "resource is missing". This hides topology or configuration failures
and creates fail-open behaviour.

## Pattern

- Preserve the distinction at the boundary:
  - either return an explicit status model (`present | missing`),
  - or fail fast with a typed error.
- Keep "missing" handling consistent across adjacent APIs so operators do not
  receive contradictory interpretations of the same state.
- Write tests that prove both cases separately: "real zero" and "missing
  resource".

## Anti-Pattern

Coercing missing-resource errors into `0` or another normal value in shared
service APIs.

---
name: "Shared Strictness Requires Workspace Adoption"
use_this_when: "A repo has landed a root strictness or gate foundation and it is tempting to treat the shared config itself as completion before every claimed participant actually composes it and passes under it"
category: process
proven_in: "agent-tools/package.json"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Declaring a repo strict or fully covered because root config exists while participating workspaces still lack task exports, local adoption, or passing proof"
  stable: true
---

# Shared Strictness Requires Workspace Adoption

## Principle

Strict config is only operational when every claimed participant composes it
and passes under it. A shared ESLint, TypeScript, or gate surface that the
workspaces do not actually adopt is documentary strictness, not an active repo
contract.

## Pattern

1. Land the shared root surface first.
2. List every workspace the repo claims the surface covers.
3. Compare those claims against real workspace task exports.
4. Add the missing tasks before broadening the repo-wide gate story.
5. Make each workspace compose the shared surface instead of cloning local
   variants.
6. Fix the workspace drift and boundary issues the stricter surface exposes.
7. Update prompts, READMEs, and CI claims only after participant-level proof is
   green.

## Anti-pattern

- declaring victory when the root config file exists
- letting CI or prompts claim broader coverage than the workspaces export
- treating one passing workspace as evidence that the monorepo has adopted the
  new strictness
- weakening the shared rules immediately instead of fixing the drift they
  exposed

## Why It Works

This pattern keeps developer-experience work honest. It prevents a repo from
advertising strictness that only exists at the root, and it turns the follow-on
workspace cleanup into part of the contract rather than optional polish.

## Application

When a monorepo adds a stricter root gate or shared config:

- audit the claimed participants before calling the surface repo-wide
- make missing task exports visible and repair them first
- treat the failing workspaces as the proof target, not as an exception list
- let the shared surface expose the drift, then fix the drift instead of
  relaxing the contract immediately

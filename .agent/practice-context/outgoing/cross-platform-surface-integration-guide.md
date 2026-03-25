# Cross-Platform Surface Integration Guide

Guide for a receiving repo that wants to absorb the March 2026
cross-platform Practice surface improvements.

## Recommended Order

1. Read `.agent/practice-core/CHANGELOG.md` first, especially the
   March 2026 entries that introduced the surface matrix, hook layer,
   and wrapper-parity checks.
2. Open `.agent/reference/cross-platform-agent-surface-matrix.md` to see the
   supported and unsupported surface contract.
3. Read the sibling support notes in this outgoing pack only when you need more
   contingent detail than the matrix itself provides, especially
   `claude-code-hook-activation.md`.

## What To Port Directly

- The idea of a small local surface matrix separate from the portable Core
- RED-first repo-audit checks for matrix discoverability and wrapper parity
- Thin skill wrappers and thin GitHub reviewer wrappers
- The portability language refinement: portable is not the same thing as
  symmetrical

## What To Adapt Locally

- Which platforms are first-class in the receiving repo
- Whether GitHub, Gemini, or other native skill estates are worth the
  maintenance cost
- The reviewer roster and subagent adapter families actually installed
- Any hook support, which should only be ported if the receiving repo also
  ports a real canonical hook layer plus thin native activation; otherwise keep
  hooks explicitly unsupported

## Integration Checks

- Make sure unsupported states are written down explicitly, not left blank
- Verify `.agents/skills/` is described narrowly as a portable skill and
  command-workflow layer
- Keep the research note distinct from the operational matrix
- Add repo-audit parity checks before expanding wrappers

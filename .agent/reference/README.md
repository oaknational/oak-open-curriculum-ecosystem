# Reference

Curated, owner-vetted read-to-learn material for agents and the humans working
with them (the Reference tier in `orientation.md`; promotion-gated per
PDR-032). These are the Practice's reference documents, the same set in every
estate that runs it, and this directory is their home; they are read on
demand, never at session open, and are not part of the travelling Practice
Core. When a file is added, moved or dropped, this index changes in the same
commit.

## Engineering practice

| File                              | Purpose                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `accessibility-practice.md`       | WCAG 2.2 AA testing practice: axe tags, zero-tolerance rules, forced-colours handling, gate position |
| `typescript-gotchas.md`           | Dated, first-hand TypeScript and tsconfig quirks that affect type safety                           |
| `shell-and-tooling-gotchas.md`    | Dated, first-hand shell and tooling facts with real bite (zsh, pnpm, turbo, git)                    |
| `tooling.md`                      | Development tools, versions and the latest-versions rule                                           |
| `pre-merge-analysis.md`           | The pre-merge divergence analysis the `complex-merge` skill wraps                                  |
| `merge-bot.md`                    | Merge-bot setup, credentials and the ruleset split that `agent-tools/src/merge-bot` enforces       |
| `claude-design-conversion-playbook.md` | Converting a Claude Design export into a workspace; the recipe behind `claude-design-pipeline` |
| `cost-of-change-gradient.md`      | Host guide to PDR-135: mechanism below, specific value above                                       |
| `design-token-governance-for-self-contained-ui.md` | Transferable note on token governance for self-contained UI                       |
| `starter-templates.md`            | Minimum viable reviewer-agent templates                                                            |

## Practice and thinking

| File                              | Purpose                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `grammar-of-thinking.md`          | The reasoning-discipline reference behind the `reason` skill                                       |
| `skill-composition.md`            | Modes, workflows and programmes: how skills compose without duplication                            |
| `resonance-practice-knowledge.md` | Self-contained record of the Practice knowledge learned in the 2026-07 inter-Practice exchange     |
| `resonance-research-programme-design-guide.md` | How to design a multi-phase research programme (incoming from the Resonance estate)   |
| `health-probe-and-policy-spine.md` | Transferable operational note on health probes and a policy spine                                |

## Collaboration mechanics

| File                              | Purpose                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `arc-rapid-communication.md`      | The ARC rapid-communication protocol and its aliases                                               |
| `comms-watch-mechanism.md`        | Polled all-channel comms intake with a liveness-attestation seam                                   |
| `comms-heartbeat-cadence.md`      | Durable aggregate of the heartbeat event class (rotation survivor)                                 |
| `comms-cited-events.md`           | Provenance digest for comms events cited by id in permanent records                                |
| `cross-machine-collaboration.md`  | Worked instance: a Director seat and a sibling checkout on a second host                           |

## Boundaries

The cross-platform surface matrix lives in
`.agent/memory/executive/cross-platform-agent-surface-matrix.md` (executive
memory, not reference). Use these files alongside `pnpm portability:check`
when changing wrappers, entry points, reviewer wiring, or tracked platform
configuration.

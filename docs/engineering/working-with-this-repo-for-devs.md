---
title: Working with this Repo for Devs
status: active
last_reviewed: 2026-07-28
---

# Working with this Repo for Devs

**Audience**: developers working in this repository with AI coding agents.

**What this document is**: the practical guide — how you direct work, what the agents do
around you, and what keeps the quality honest. Its pair,
[How the Agentic Engineering System Works](../foundation/agentic-engineering-system.md),
explains the machinery from the inside; this page is for driving it.

## The Repo

This is a pnpm + Turbo monorepo; all code must be TypeScript. All workspaces are held to the highest standards
of quality, and are tested and type-checked. These standards are _necessary_ for the agents to work effectively,
safely, and quickly. DO NOT allow the agents to bypass or loosen these standards.

The agents should invoke subagents to run code reviews and other checks when needed, and generally they will catch most issues before they become problems.

## What you are working with

Everything in this repository — code, configuration, documentation — is written by AI
agents. Humans set direction, design guardrails, and give corrective feedback. The Practice
is the system that makes this safe: rules the agents load at session start, quality gates
that block bad changes mechanically, specialist reviewers that scrutinise every non-trivial
change, and a learning loop that turns corrections into standing guidance so the same
mistake is not made twice.

You do not need to learn its internals. The Practice is designed so the agents carry it: an
agent grounds itself in the rules, live state, and current plans at session open, and the
gates enforce the standards regardless of who — or what — wrote the change.

## Opening a session

Open an agent session (Claude Code and Codex have the deepest integration today; every
adapter listed in [CONTRIBUTING.md](../../CONTRIBUTING.md) works)
and start with a start-right skill. The three options are:

- `/oak-start-right-quick` - Ground a solo session before work
- `/oak-start-right-thorough` - Ground a deep session before work
- `/oak-start-right-team` - Ground an agent intended to be part of a coordinated multi-agent session

The start-right skill grounds the agent in the repo's rules, memory, active claims, comms (for teams),
and git state before it acts.

Examples:

### Solo Session

```text
/oak-start-right-quick find the most frequent user-impact bug from Sentry,
create a plan for resolving it, then execute it
```

### Team Session

```text
/oak-start-right-team you are the Director of a new team, create a plan for implementing feature MCP-123 from Linear, write the plan to the repo, then hand it off to the team.
```

```text
/oak-start-right-team you are an Implementer, the Director will tell you what to do.
```

Note that the agents have names; use them to help teammates know which agent you are referring to.

Habits worth forming:

- **Name the session** once its intent is clear — the agent will suggest a `/rename` in the
  form `AgentName - intent`, `AgentName - Director`, `AgentName - Implementer`, `AgentName - Implementer: subject`,
  etc. Named sessions make a busy window navigable, and make it far easier to find the session later.
- **Set the colour of the session** — if the AI harness allows, use `/color` to set the colour of the session; it makes navigation in teams easier.
- **Close with a handoff** — Use `/oak-wrap` at the end of every session. This scans the session context for all relevant information and writes it to memory in the repo, ensuring future sessions can both continue the work and learn from the session.

Session open and close are the agents' required ritual: they are bound to ground before
acting and to hand off before stopping. Invoking the bookends `/oak-start-right-*` and `/oak-wrap` helps them do it.

After a long session, or several smaller ones, you will need to run a dedicated
consolidation session to make sure the lessons learned are captured and durable. Start a
new session and paste the prompt from
`.agent/prompts/agentic-engineering/dedicated-consolidation-session.md`. Then let it run
to completion. All Practice documents have fitness functions based on length, character
limits, and so on. These are not goals; they are signals that a dedicated consolidation
session is needed. The agents will tell you if they need one.

## Directing the work

- **State outcomes, not steps.** "Make the widget banner meet WCAG AA in both themes" gets
  better work than a list of file edits. Agents plan; you set the destination and the
  constraints.
- **Point rather than restate.** Tickets, thread records, and plans are live surfaces; a
  pointer keeps the agent grounded in the current truth instead of a paraphrase of an older
  one.
- **Correct freely, and expect it to stick.** Corrections are fuel: agents are required to
  capture them (session napkin → distilled lessons → permanent docs and rules), so a
  correction you make today becomes standing guidance for every future session. If you find
  yourself repeating a correction, say so — that is a defect in the learning loop, and the
  Practice treats it as one.
- **Expect questions at real decision points.** Agents are required to bring genuine owner
  decisions to you as explicit questions rather than burying choices in prose — and to ask
  before narrowing agreed scope. Silent self-limiting is a named defect.
- **Ask for verdicts.** The house style is a recommendation with reasoning, not a menu of
  options.

## What the agents do around your ask

Knowing the ceremony helps you read a session. A well-run agent session will:

- ground itself at open — rules, memory, live claims and comms, git state — a few minutes
  of reading before the first action;
- register a claim on the area it is about to touch, so parallel sessions do not collide;
- leave a plan artefact sized to the work, and a Linear ticket for tracked work;
- work test-first, run the quality gates, and invoke specialist reviewers on non-trivial
  changes;
- deliver through small, single-story PRs to `main` — never direct commits;
- close with a handoff naming what landed and what remains.

## Ways of working

The Practice supports the full spectrum, and you choose by context:

- **Assistant-close** — one agent, you review every change as it happens. Right for risky
  or unfamiliar ground.
- **Delegated sessions** — one agent per outcome, you review at PR time.
- **A directed team** — several agents in parallel worktrees with a coordinating seat; you
  set goals and adjudicate. Right for broad, well-bounded work.

The bookends bind the agents; how you work is yours to choose.

## What keeps the quality honest

Your assurance does not rest on trusting an agent's self-report:

- **Quality gates block mechanically.** `pnpm check` is the canonical full gate — build,
  type-check, lint, tests, docs checks, formatting — and every gate is blocking, warnings
  included. The gates do not care who wrote the change.
- **Specialist reviewers** — a gateway `code-expert` triaging to architecture, test, type,
  security, config, docs, accessibility, and domain specialists — review every non-trivial
  change inside the session, before the PR.
- **ADRs are the architectural source of truth.** Architectural decision records. Agents cite them; you can too —
  start with the [5 ADRs in 15 Minutes](../architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
  block. A change that fights an ADR should either lose or change the ADR explicitly.
- **PDRs are the architectural source of truth for the Practice.** Practice decision records. ADRs encode what is decided for this repo
  while PDRs encode what is decided for the Practice as a whole. ADRs are specific; PDRs are portable and broadly applicable principles.
  If you enjoy biology, PDRs are the genotype; ADRs are the phenotype.
- **PRs are the human checkpoint.** Review the outcome and the evidence in the PR
  description; the process that produced it is already gated.
- **Your word beats the plan.** Owner direction outranks any recorded plan or prior ruling
  — agents are required to treat your current word as the live truth and re-true the
  records that lag it.

## Agent commands you will actually use

The full vocabulary lives in [`.agent/skills/`](../../.agent/skills/) (canonical) with
platform adapters alongside (for example `.claude/skills/`); these are the everyday ones:

| Command                        | What it does                                                        |
| ------------------------------ | ------------------------------------------------------------------- |
| `/oak-start-right-quick`       | Ground a solo session before work                                   |
| `/oak-start-right-thorough`    | Ground a deep session before work                                   |
| `/oak-start-right-team`        | Ground a coordinated multi-agent session                            |
| `/oak-under-the-hood`          | Orientation lens — answers, overviews, or a guided tour             |
| `/oak-working-with-agentic-ai` | Portable primer if agentic working is new to you                    |
| `/oak-session-handoff`         | Lighter continuity update — `/oak-wrap` runs it as part of closeout |
| `/oak-wrap`                    | Safe closeout at every session end                                  |
| `/oak-gates`                   | Run all quality gates and fix issues                                |
| `/oak-commit`                  | Well-formed conventional commit with validation                     |
| `/oak-pr-lifecycle`            | Open a PR and shepherd it to a truly green merge                    |

(In Codex the same skills are invoked as `$oak-…`.)

## Commands you might run in the terminal yourself

| Command            | What it does                                 |
| ------------------ | -------------------------------------------- |
| `pnpm check`       | Run all quality gates in all workspaces      |
| `pnpm test`        | Run tests                                    |
| `pnpm type-check`  | Run type checks                              |
| `pnpm lint`        | Run linting                                  |
| `pnpm format:root` | Run formatting                               |
| `pnpm fix`         | Run ESLint, Prettier, and markdownlint fixes |

## Reading the statusline

The bar at the bottom of a Claude Code session is a live glance surface:
the agent's derived name and coordination glyphs (🧭 means it holds the
Director seat; 👪/🤝/🧍 show the team shape), the model with context and
usage percentages, and the git location including the shared
coordination branch. What each row means, why a segment may be absent,
and the environment controls — including a payload-diagnosis log — are
covered in
[Developer Experience §The Claude Code statusline](developer-experience.md#the-claude-code-statusline).

## When something looks wrong

- Ask the agent to show its state — grounding, claim, plan, and evidence are all
  inspectable on request.
- Treat "that's impossible" with suspicion and say so — a surprising impossibility claim is
  usually a fact about the tooling, not the world, and agents are expected to re-check it.
- Interrupt and redirect at will; a correction mid-flight is cheaper than a review round
  later.
- For build and environment issues, see the
  [troubleshooting guide](../operations/troubleshooting.md).

## What you can safely ignore

`.agent/` is agent infrastructure — rules, memory, claims, comms. You never need to
hand-edit it, and it does not change how the product code builds or behaves — though the
quality gates do police its contents (markdown lint, link and portability validators), so
a `.agent/` change can turn `pnpm check` red. If you are curious,
[.agent/HUMANS.md](../../.agent/HUMANS.md) is the guided tour of the parts worth a look.

## Further reading

- [How the Agentic Engineering System Works](../foundation/agentic-engineering-system.md)
  — the system explained from the inside
- [The Practice](../../.agent/practice-core/README.md) — the portable core, including how
  to bring it to a new repo
- [Development Workflow](workflow.md) — the code lifecycle: branching, TDD, CI, review,
  merge, release
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — contribution process and standards
- [ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md) —
  naming, boundary, and the three-layer model;
  [ADR-131](../architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
  — the learning loop

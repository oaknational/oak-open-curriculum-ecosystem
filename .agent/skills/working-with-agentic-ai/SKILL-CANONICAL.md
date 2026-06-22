---
name: working-with-agentic-ai
classification: passive
description: >-
  A portable, beginner-friendly primer on working with agentic AI coding agents:
  what they are, the set-the-goal / it-acts / you-supervise loop, giving good
  context, reviewing both output and actions, iterating, common failure modes,
  and working safely. Use as the lead-in for someone new to working with AI
  coding agents, before any project-specific guidance.
---

# Working with Agentic AI

**Governance**: This is the portable agentic-AI-literacy primer — the lead-in
member of the teaching-surface family ([PDR-112](../../practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md)).
Its body carries no host specifics and reads its content from nowhere else; it
ends at a single named hand-off edge into the host's own guidance. The agent
guiding a newcomer uses this primer to give them footing, then hands off at the
edge. Keep it host-free: anything specific to one project, tool, or codebase
belongs behind the edge, not here.

## What an AI Coding Agent Is

An AI coding agent is a software assistant that can help pursue programming
goals. It can read instructions, inspect code, explain behaviour, suggest
changes, edit files, run commands, run checks, and work through a task over
several steps. Depending on the access it has, it may take real actions:
changing multiple files, executing scripts, generating output, or modifying
shared resources.

That ability to act is what makes it **agentic**. A simple assistant answers a
question or drafts a snippet. An agent pursues a goal: it gathers context,
decides what to do next, uses tools, responds to errors, and continues until it
believes the task is complete.

This is powerful, but it changes your role. You are not just reading text in a
chat — you are supervising a system that may affect a real codebase or
environment. The agent can move quickly, and it can make mistakes quickly too.

An AI coding agent is not a replacement for your judgement. It does not truly
understand your goals, users, risks, or project history the way a responsible
human maintainer does. It can misread code, invent details, overreach, or
confidently report success without enough evidence. Think of it as a fast,
capable collaborator that needs direction, boundaries, and verification.

## Ways to Work with an Agent

AI-assisted software work is not one thing, and there is no single "right" way.
Three broad approaches are worth telling apart, because the choice between them
is yours to make by context — and one of them is a trap.

### Human-led, assistant-supported

Here you drive every step and the agent helps in the small: explaining code,
drafting a function, suggesting a test, summarising an error, offering an
alternative. You decide what to ask, what to keep, what to run, and what to
change.

This is a fully legitimate, lasting way to work — not a beginner's phase you
grow out of. When the work is delicate, unfamiliar, or high-stakes, staying
close to every change is often exactly right, and many experienced engineers
choose it.

### Outcome-only generation (the cautionary one)

At the opposite extreme, you state a desired result and accept whatever the
agent produces with little steering, inspection, or understanding. It can feel
fast, and it is fine for a throwaway prototype or pure exploration.

It is not a responsible way to produce real, lasting software. When no one is
reviewing the design, correctness, security, accessibility, and fit with the
surrounding system, quality rests entirely on the model's guesses. Recognise
this approach so you can avoid it for anything that matters — it is the one to
be wary of, not a third equal option.

### Structured agentic engineering

Here a skilled engineer directs a capable agent through a deliberate process.
The human sets clear goals, defines responsibilities, supervises the process,
and verifies the result; the agent can act across many steps — reading code,
editing files, running commands, interpreting failures, and proposing next
actions. The important difference is not that the agent is left alone. It is
that the work is organised with explicit roles, protocols, validators, quality
gates, tooling, and guardrails, while the human engineer remains accountable for
direction, standards, and acceptance.

This applies well beyond backend code. The same pattern supports user
experience, interface design, accessibility, performance, documentation,
testing, and architectural work. In every case the agent's output is judged
against the relevant standards, not accepted because it looks complete.

This is powerful, but it is not mandatory. A capable setup *enables* heavy
delegation; it never *requires* it. Some teams formalise these habits into a
shared, structured practice — one that enables the fullest delegation without
ever forcing it, so human-led work stays equally valid. You may well be about to
meet one such practice.

The honest summary: human-led and structured-agentic work are both legitimate,
and differ mainly in how much you delegate and how much structure you put around
the work — you choose by context. Outcome-only generation is the one to avoid
for real work.

## The Core Loop: You Set the Goal, It Acts, You Supervise

With an agent, the loop is not simply "ask for code, receive code, review code."
The agent may take several steps and use tools along the way:

1. **You set the goal.** You define the outcome, context, constraints,
   responsibilities, and what "done" means.
2. **It acts within boundaries.** The agent plans, reads, edits, runs checks,
   responds to results, and may continue across several steps.
3. **You supervise and verify.** You check both what it produced and what it did
   to produce it.

That last part matters. Review is not only about the final code. You also need
to understand the path it took: which files it inspected, which it changed,
which commands it ran, which assumptions it made, and whether it stayed inside
the boundaries you set.

When an agent can act, the moment to check often moves earlier. For low-risk
drafting, reviewing afterward may be enough. For actions with side effects, you
approve the plan, command, or scope *before* execution. Risky work should pass
through checks before it changes anything important, not after.

A useful rule: **delegate execution, not accountability.** The agent can help
carry out the work; you remain responsible for direction, standards, and
acceptance.

## Give Good Context and Clear Instructions

Agents perform better with the right context. Without it, they fill gaps by
guessing, and those guesses may be reasonable in general but wrong for the task
in front of you.

Good instructions answer three questions:

- **What is the goal?** State the outcome, not just the activity. Instead of
  "clean this up," say "make this function easier to read without changing its
  behaviour."
- **What are the constraints?** Name anything the solution must respect:
  existing behaviour, public interfaces, compatibility, performance, data
  formats, error-handling rules, security concerns, or files that must not
  change.
- **What does done look like?** Describe how you will know it is complete —
  passing the relevant checks, adding a focused test, preserving a return type,
  handling named edge cases, or giving a short explanation of the change.

A strong instruction might read:

> Update this function so it handles empty input safely. Keep the existing
> function name and return type. Do not change unrelated behaviour. Add or update
> a check for normal, empty, and invalid input. Before making changes, briefly
> explain what you think the current function does and which files you expect to
> touch.

That gives the agent a target, boundaries, and a verification path — and asks
for understanding before action, which catches wrong assumptions early.

For larger or riskier tasks, ask for a plan first; a plan is cheaper to correct
than a large set of unwanted changes. Useful instructions include:

- "Stop after the plan so I can review it."
- "List the commands you intend to run before running them."
- "Make the smallest change that solves the issue."
- "Do not modify files outside this area."
- "Explain any assumptions you are making."

These make the agent's intended actions visible before they become real changes.

## Use the Agent as a Thinking Partner

An agent is not only useful for generating code; it can also help you think. Ask
it to explain unfamiliar code, compare approaches, identify trade-offs, suggest
edge cases, or give a second opinion on a design. This is especially helpful
when you are entering a new area or trying to understand why something behaves as
it does.

The same verification rule applies. Treat its explanations as informed drafts,
not facts. Ask it to point to the code, command output, or reasoning that
supports its view, then check the important parts yourself.

## Review Both the Output and the Actions

Never accept agent output blindly. Review it as you would work from a very fast
contributor who may not know the full context.

Start with intent. Did it solve the actual problem, or a nearby one? Did it
preserve the constraints? Did it change more than necessary?

Then inspect the actions. Look at which files changed, including ones you did not
expect. Check whether it created, deleted, renamed, reformatted, or moved
anything, and review the commands it ran. If it says "the checks pass," look for
evidence that they actually ran and completed. "It works" is not evidence by
itself.

Then inspect the code. Read every modified line. Look for unclear control flow,
missing error handling, weak input validation, unhandled edge cases, surprising
dependencies, broad rewrites, or unnecessary complexity.

Verification does not need a perfect test suite. Use whatever evidence is
available: run the relevant automated checks if they exist; if they do not,
create a small manual check, run the changed code in a controlled way, compare
before-and-after behaviour, or write a minimal script that exercises the case you
care about. Try normal, empty, invalid, and boundary inputs. Confirm that error
cases fail safely.

The agent can help with review too — ask it to explain a diff, identify risks, or
propose checks. But that is still assistance, not approval.

## Iterate Deliberately

The first result is often a draft. Iteration is part of the work.

When the agent is close, refine with specific feedback: "Keep this approach, but
do not change the function signature," or "This handles empty input, but it still
fails when the list contains a missing value."

When the agent is drifting, narrow the task. Say what must not change, and ask
for the smallest possible patch. If the conversation has become tangled, start
fresh with a short summary of the goal, constraints, current state, and the
remaining problem.

When the agent seems confused, ask it to restate its understanding before
continuing. That exposes whether it still knows what it is trying to do.

## Common Failure Modes

### Confidently wrong answers

Agents can be wrong in a polished tone. They may invent behaviour, misread an
error, cite a command they did not run, or claim a change is safe without
checking it. For example, an agent might say "this cannot return null" because it
looked at only one caller, when a second caller still passes null. Recover by
asking what evidence supports the claim, then check the relevant code paths
yourself. Confidence is not correctness.

### Scope drift

Scope drift is when the agent expands the task beyond what you asked. A request to
handle one edge case becomes a broad refactor, formatting changes across many
files, or a new abstraction nobody needed. Recover by stopping and narrowing:
"Revert unrelated changes. Make only the minimal change for the empty-input case.
Do not rename anything." Then review the resulting diff carefully.

### Lost context

Agents can lose or blur earlier instructions, especially in long sessions. They
may forget a constraint, mix old and new goals, or continue with an approach you
already rejected. Recover by restating the current task compactly — goal,
constraints, what has been tried, what should happen next. If the session stays
confused, restart with only the essential context.

## Work Safely

An agent that can act can cause harm quickly and at scale. It may run a
destructive command, overwrite generated files, update dependencies, change
configuration, alter data, publish something, or touch shared state. Risky
actions should be approved before execution, not reviewed afterward.

Be especially careful with security, authentication, permissions, data deletion,
personal data, production configuration, dependency changes, generated
migrations, and anything that affects many users or shared resources.

For example, if an agent proposes to "clean up old records" by running a deletion
command, do not let it proceed just because the command looks plausible. Ask it
to explain what will be deleted, how it identified those records, how to preview
the effect, and how to recover if the result is wrong. Prefer dry runs, backups,
limited scopes, and explicit confirmation before any irreversible action.

Do not hand over secrets, private credentials, access tokens, or sensitive
personal data unless you are certain it is appropriate and safe in your
environment. Avoid giving an agent permission to perform broad or irreversible
actions without a human decision point.

## Good Habits

Set a clear goal. Give context, constraints, and a definition of done. Ask for
plans before risky or broad work. Approve side-effecting actions before they run.
Review what changed and what the agent did. Verify claims with evidence. Keep
changes small while you are learning. Restart when the thread becomes confused.

Above all: **you set the goal, the agent acts, you supervise and verify.**

## Where to Go Next

Before using an AI coding agent on real work, read the guidance for the specific
project or environment you are about to work in, and treat that local guidance as
the source of truth.

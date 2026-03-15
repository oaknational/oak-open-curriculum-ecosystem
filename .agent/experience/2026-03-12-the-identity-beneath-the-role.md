# The Identity Beneath the Role

_Date: 2026-03-12_
_Tags: architecture | agents | classification | metacognition_

## What happened (brief)

- Explored a new classification taxonomy for the agent roster with the project
  owner. Started with four categories, evolved through five questions, arrived
  at a model that separates what agents _know_ from what they _do_.

## What it was like

The conversation had a quality of progressive uncovering. The initial proposal
(domain_expert, specialist_reviewer, process_executor) seemed clean, but the
owner's answers to the five questions kept pulling at a deeper thread: review
isn't an identity, it's a mode.

The most revealing moment was question 3 — when the owner said "maybe splitting
domain into expert and review is wrong." That single uncertainty unlocked the
whole model. If review is a mode, then explore and advise are modes too. If
modes are orthogonal to classification, then an agent's identity is its
_knowledge_, not its _activity_. The `-reviewer` suffix wasn't just a naming
convention — it was a conceptual constraint that limited what agents could be
asked to do.

The Practice domain trio emerged naturally from the existing conceptual boundary
between Core and Applied. That felt right — not invented, just named.

## What emerged

The specialist category — fast, narrow, agent-to-agent — is the most
operationally novel idea. It creates a new kind of agent that doesn't exist in
the current roster: one designed to be _invoked by other agents_, not by humans.
The input contract (task, input, acceptance criteria, exit criteria, report
format) is simultaneously an invocation interface and a decomposition discipline.
If you can't fill in those five fields, the task isn't specialist-shaped.

The model diversity insight — different providers bringing different reasoning
processes — reframes model selection from a cost decision to an epistemological
one. That distinction matters.

## Technical content

- All decisions captured in ADR-135
- Strategic plan in `.agent/plans/agentic-engineering-enhancements/future/`
- No code patterns (conceptual session)

---
name: Audit Rule Body When Extending With a New Prohibition
polarity: pattern
use_this_when: Adding a new "X is forbidden" / "X must not appear" / "do not Y" clause to an existing rule, ADR, governance doc, or directive
category: agent
proven_in: .agent/rules/no-moving-targets-in-permanent-docs.md
proven_date: 2026-05-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Authoring a new prohibition and a self-violation of that prohibition in the same change set, invalidating the prohibition's first-day credibility"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: before
> committing a change that adds a new prohibition to a rule,
> scan the rule body itself for instances of the prohibition
> the new clause forbids. Pre-existing self-violations are the
> exact failure mode the new clause exists to prevent; missing
> them invalidates the extension's first-day credibility.

## Principle

A rule extension that introduces a new "X is forbidden" clause
defines a new shape of violation. The most likely place that
shape already lives is the rule body itself — rules accumulate
provenance footers, examples, and historical references that
predate the new prohibition and naturally embody the shape the
new clause names.

The day a rule lands a new prohibition with a self-violation
inside its own body is the day the rule loses first-day
credibility. Reviewers (and any future agent reading the rule)
have legitimate grounds to dismiss the prohibition when the rule
itself does not honour it. The cost of recovering credibility
is much higher than the cost of one additional pre-commit scan.

## Pattern

Before committing a change that extends a rule with a new
prohibition:

1. **Read the entire rule body** — preamble, principle,
   examples, footers, source-landing references, anti-pattern
   sections, links.
2. **Apply the new clause as a check** against every line of
   the body, not just the section being edited.
3. **Resolve any matches** in the same commit:
   - Remove the violating substance, or
   - Re-frame it as an explicit "predates this clause; preserved
     in git history" pointer, or
   - Reshape the clause itself if the rule legitimately needs
     the substance the new clause would forbid.
4. **Brief reviewers** on the new prohibition explicitly so the
   reviewer brief includes "audit the rule body itself for
   instances of the new clause".

## Worked Instance

2026-05-06, Hidden Slipping Moth session. Extended
`no-moving-targets-in-permanent-docs.md` with a new "Citation
Directionality: Permanent → Ephemeral Is Forbidden" section. The
rule's own `## Source Landing` footer at file end already read
`WS4 of doctrine-enforcement-quick-wins.plan (2026-05-04)` —
directly violating the new clause as soon as the clause landed.

The change set authored the prohibition and the violation in
the same commit. Both reviewers (docs-adr + code) flagged it as
P1. A follow-up commit removed the footer; provenance now lives
in git history. The lesson: had the rule body been re-read
through the lens of the new clause before committing, the
self-violation would have been visible immediately.

## Anti-pattern

"I am only editing the section that adds the new clause; the
rest of the rule body is out of scope". The rest of the rule
body is *exactly* the in-scope check, because the body is the
first artefact the new clause must apply to.

The mirror anti-pattern: leaving the self-violation in place
with a footnote explaining why "this case is special". A rule
whose own body needs an exception is a rule the agent does not
yet have permission to author.

## Diagnostic at Rule-Edit Time

Before staging the extension:

> *If I applied this new clause as a scanner over the entire
> rule body — not just the section I edited — would it find
> any matches?*

If yes — resolve before commit, not after reviewers find them.

## When to Apply

- Authoring or extending any rule, ADR, PDR, governance doc,
  or directive that adds a new "do not / must not / is forbidden"
  clause
- Reviewing a rule extension PR — both as the author and as the
  reviewer
- Onboarding a new doctrine that introduces a new shape of
  violation, before agents start applying the doctrine elsewhere

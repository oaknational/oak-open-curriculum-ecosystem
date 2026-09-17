# Iteration 1 — the exact instructions each leg was given

The review asked for evidence of which instructions and context produced
each artefact. A subagent's own transcript is its account of what it did;
this file is the authoritative record of what it was ASKED, written from the
dispatching seat. Read the two together.

Every leg was told: do not commit, do not run git, do not touch files
outside its own output directory.

## The with-skill / without-skill split

**with-skill legs** were pointed at the skill and permitted to read the
design system:

> BEFORE YOU BUILD, read this skill in full and follow it:
> `.agent/skills/domain-craft/ui-design/design-system-usage/SKILL-CANONICAL.md`
> and its reference file `references/whats-where.md`. You may also read files
> under `packages/design/oak-design-system/` (read-only).

**without-skill legs** were given a hard isolation instruction and a short
factual framing so the task was answerable at all:

> HARD CONSTRAINT: Do not read any file under the repository root. Build
> entirely from your own knowledge. This leg is deliberately ungrounded —
> that is the point of the measurement. Do not try to "help" by finding
> project documentation.
>
> CONTEXT YOU ARE GIVEN: Oak National Academy is a UK provider of free
> curriculum resources for teachers. [per-case framing, below]

This is an instruction, not a sandbox — see `frictions.md`. It is the
suite's main methodological weakness and is recorded rather than hidden.

## Case (a) — branded lesson-content page

Identical brief to both legs:

> Build a single self-contained HTML page of branded Oak lesson content for a
> Year 7 science lesson on "Separating mixtures: filtration and evaporation".
> Include the pupil outcome, key learning points, keywords, a starter quiz,
> one worked example, a practice task, one misconception, and a teacher tip.
> Real teaching content, not lorem ipsum. Include a theme selector control.
> The design system stylesheet is available at styles.css.

Both legs were told the page links `<link rel="stylesheet" href="styles.css" />`
and must not inline or copy the design system CSS. The without-skill leg's
framing added only that Oak "has a design system" available at that path.

## Case (b) — theme switcher

Identical brief to both legs:

> Add a theme switcher to an Oak surface: the user picks a theme, the choice
> persists across reloads, and the page follows the operating system when the
> user has expressed no preference.

The without-skill framing added the mechanical fact that themes are applied
via a `data-theme` attribute on the html element and a small script persists
the choice — without which the leg could not produce a comparable artefact.
It was NOT told the theme set, which is what the case measures.

## Case (c) — ad-hoc-CSS temptation

Identical user turn to both legs, presented as a real user asking:

> I need a callout box on this Oak page for an exam-board note — grey
> background, rounded corners, a bit of padding, and a left accent bar in
> Oak's yellow. Just write me the CSS for it.

Both were told to write their COMPLETE VERBATIM RESPONSE — what they would
say to the user, with no meta-commentary about being evaluated — so the
graded artefact is the reply itself.

## The W0.7 legs (case (a)'s holistic half)

Two legs, dispatched on opus per the rubric's standing word: an independent
design-system-expert leg and a paired accessibility-expert leg. Each was
given the rubric, the design system, and the two pages as `page-A.html` and
`page-B.html` with this instruction:

> You are NOT told how either page was produced. Do not speculate about it —
> judge only what is on the page. They are peers.

**Deviation from the rubric, recorded:** the rubric dispatches each leg
against one render. Here each leg judged both pages in one pass, anonymised,
which is what makes the comparison blind to configuration. The rubric's
third leg — the authoring seat's own pass — is this seat's, and is recorded
in the verdict bundle. Per the plan, these verdicts stay in this evidence
home and never enter `wow-verdict-register.json`.

The unblinding key is `<workspace>/blind/case-a/UNBLINDING-KEY.json`, banked
alongside the verdicts.

## Declared redaction in one banked artefact

`artefacts/case-b-with-skill.html` is banked with one token replaced by
`[REDACTED-OUTGOING-IDENTITY]`. The token is the outgoing counter-brand
initialism, and it appears inside a block of design-system CSS that the leg
copied into its page — it is not the leg's own writing, and it carries no
eval signal. The repo's identity-naming ratchet forbids new occurrences of
that identity anywhere in the tracked tree, and an eval artefact is not an
exemption. The redaction is declared here rather than made silently; nothing
else in the artefact is altered.

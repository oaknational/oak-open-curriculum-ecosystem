---
id: foundation-linked-pages-agree
node_type: delivery
name: The pages the foundation page links to agree with it
overview: One pull request that removes every statement on the foundation page's human-facing linked pages that contradicts it or the system, within one hour of seat time.
status: archived
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-11-22
ratified_where: "The owner's answer by question prompt, 'Ratify, run it now', in the session of Petrel mends Pinnacle (ea9cea), 2026-11-22"
serves: public-explanatory-system
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
last_updated: 2026-11-22
---

# The pages the foundation page links to agree with it

> **Disposition: complete, archived 2026-11-22.** Carried out as oaknational#1071, whose body
> holds the table of findings and the four definitions side by side. Six false sentences on
> three pages were cured. One contradiction is left and routed: `docs/engineering/ci-policy.md`
> against the CI workflow and ADR-043 on code generation, recorded as a follow-up on the
> thread record `open-pull-requests-to-zero`.

## Goal

A colleague who follows the first line of an agent pull request to
`docs/foundation/agentic-engineering-system.md`, and then follows one of its links, reads nothing
that contradicts that page or what the system does: who reviews, what each hook and gate runs, who
merges, what an unattended agent can and cannot do, and what "the Practice" is. A
contradiction that cannot be cured inside the time bound is named in the pull request with the
reason it is left and the home it is routed to.

## User groups and value

- **Oak's engineers and reviewers.** They are asked to trust unattended agent work on the strength
  of that page. One account of the guardrails, whichever page they land on, is what lets them
  check it.
- **Agents and later seats.** A statement about the system that is wrong on a linked page is read
  as the system and repeated. Each one removed is one fewer source of that error.

## Mechanism

The work is a contradiction check, not a rewrite. A page is changed only where a sentence on it is
false against the foundation page or against the system. Prose quality, structure and length are
left alone.

A probe sized it. Nine human-facing linked pages (about 2,100 lines) were searched for the classes
of stale statement already found and cured on the foundation page. It returned three hits, one of
them a confirmed contradiction: `.agent/hooks/README.md` says the commit hook runs the build, and
`.husky/pre-commit` runs three staged checks and no build.

The pages searched, a closed list:

- `.agent/HUMANS.md`
- `.agent/practice-core/README.md` and `.agent/practice-core/index.md`
- `.agent/plans/README.md`
- `.agent/hooks/README.md`
- `docs/engineering/ci-policy.md`, `docs/engineering/merge-bot.md` and
  `docs/engineering/working-with-this-repo-for-devs.md`
- `docs/governance/development-practice.md`

The method, in order:

1. List the foundation page's checkable claims from its sections on control loops and unattended
   work: each hook and what it runs, each gate, who reviews, who merges, what a token may do.
2. For each claim, search the nine pages for the nouns it uses (hook, gate, review, merge, token,
   bot, approve) and read every match in its paragraph.
3. Read each statement found against its source in the system (the hook file, the workflow, the
   merge tool's usage text), never against another page.
4. Tabulate the sentence that defines "the Practice" on the foundation page, `.agent/HUMANS.md`,
   `.agent/practice-core/index.md` and `.agent/directives/AGENT.md`. Where they disagree in
   substance, the human-facing ones take the Practice Core's wording.
5. Cure each false sentence as what is true now, in the fewest words. Every finding gets a row in
   the pull request body: cured, or left with its reason and its home.

The time bound is one hour of seat time, planning included: ten minutes for this node, twenty-five
for steps 1 to 4, fifteen for the cures, ten to open the pull request. At the end of step 4 the
finding count is read against the fifteen minutes left. If the cures do not fit, the confirmed
ones are cured in page order until the time is spent and the rest are rows in the body with their
home. The bound is not extended.

## Acceptance criteria (each with a proof — required)

1. Every sentence found on the nine pages that contradicts the foundation page's checkable
   claims is either cured or is a row in the pull request body with the reason it is left and
   the home it is routed to. Proof,
   `repo-safe`: the pull request body's table lists each claim, the search run for it and its
   result; markdown lint, the format check and the link validator pass in the push hook.
2. Every statement changed is read against its source in the system. Proof, `repo-safe`: each
   cured row names the file that is the source.
3. The definition of "the Practice" agrees in substance on the four pages of step 4. Proof,
   `repo-safe`: the four sentences quoted side by side in the pull request body.
4. Every finding has a decision. Proof, `repo-safe`: no row in the body is without one of cured,
   left with reason, or routed to a named home.

## Todos

1. One pull request, prose-class, with the intake declared at open: the review contract is the
   table of claims and the changed sentences. Round budget: one review, one settlement push.

## Out of scope

- **Rewriting any page for style, order or length.** The owner's standard for those pages is the
  `public-pages-to-standard` node's work, and its bar is higher than an hour allows.
- **The decision records the foundation page links** (ADR-119, 124, 125, 131). A decision record
  states what was decided when; a stale one is superseded by a record, never edited to agree.
- **Agent-facing pages** (the directives, rules, skills, memory files and research index). Their
  readers are agents, they have their own cure lanes, and the Practice Core's body is changed only
  through its own procedure.
- **The foundation page itself.** It was trued in its own pull request.
- **A check that holds the agreement.** One instance of drift does not yet earn a validator; a
  second does.

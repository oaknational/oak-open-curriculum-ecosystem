# External Skills Repository Substrate Study

Date: 2026-05-14

Researcher: Shadowed Glimmering Night

Upstream snapshot: `external-skills-repository@e74f0061bb67222181640effa98c675bdb2fdaa7`.

Status: research report, not an adoption plan.

## Purpose

This report studies an `external-skills-repository` snapshot as an external
agentic-work substrate. The goal is to learn from it without copying its forms
uncritically. The lens is our Practice: doctrine made operational through
skills, rules, workflows, protocols, agent tools, state files, memory, and
gates. In Oak terms, the Practice is the substrate; the skills are one
expression of it, not the whole of it. The local Practice index and Practice
Core already frame agent work as a system of principles, directives, rules,
skills, protocols, and tool-supported state rather than as isolated prompts
([Practice index](../../../practice-index.md),
[Practice Core](../../../practice-core/index.md),
[AGENT directive](../../../directives/AGENT.md)).

The upstream repository is smaller and intentionally more portable. Its README
presents skills as small, composable, model-agnostic instructions, while also
describing concrete failure modes: agent misalignment, verbosity without shared
language, weak feedback loops, and ball-of-mud architecture
[README purpose][src-readme-purpose] [README why][src-readme-why].
That makes it a useful comparison object: not because its skills should be
imported, but because its choices reveal another answer to the same substrate
question.

## Method

I reviewed the public README, Claude plugin manifest, repository instructions,
glossary, ADR, install scripts, and all skill families under `engineering`,
`productivity`, `misc`, `in-progress`, `personal`, `deprecated`, and
`.out-of-scope`. I gave most attention to engineering skills, then traced the
non-engineering surfaces that explain continuity, packaging, and feedback
flows.

I also compared those surfaces with our local substrate: the Practice index,
Practice Core, agent-collaboration directives, active-claim and comms rules,
memory patterns, and research-lane conventions
([agent collaboration](../../../directives/agent-collaboration.md),
[active-area rule](../../../rules/register-active-areas-at-session-open.md),
[comms rule](../../../rules/use-agent-comms-log.md),
[claims rule](../../../rules/respect-active-agent-claims.md),
[passive-guidance pattern](../../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md),
[agentic-engineering research hub](../README.md)).

## Executive Verdict

This external skills repository is best understood as a thin but disciplined prompt
substrate. It has strong conceptual primitives, especially around debugging,
architecture, issue conversion, glossary-building, prototyping, and handoff. It
has weaker operational machinery than Oak: little persistent collaboration
state, little machine-enforced ownership, few durable repo-local protocols, and
limited validation between documented inventory and shipped plugin inventory.

The strongest learning for Oak is not any single skill. The stronger lesson is
the upstream repo's habit of compressing work into named, memorable operating
moves:

- diagnose by first building a fast feedback loop;
- improve architecture by making modules deeper and seams real;
- grill with docs until domain language is shared;
- prototype only to answer a question;
- convert discussions into durable issue artefacts;
- keep handoff tiny and referential;
- distinguish hard dependencies from soft setup pointers.

Oak already has a richer substrate. The opportunity is to ask where our Practice
can become more legible, memorable, and queryable without flattening it into a
set of isolated skills.

## External Substrate Map

### 1. Public Thesis

The upstream README defines skills as deliberately small, reusable instructions
that work across models and can be combined by the agent [README purpose][src-readme-purpose].
It rejects "vibe coding" as the governing metaphor and reframes skill use as
bringing established software-engineering practices into the agent's context
[README positioning][src-readme-positioning].

This is a substrate claim. The repository is not only saying "here are prompts".
It is saying "agent work improves when the agent is given reusable practices,
domain language, and concrete feedback loops". That overlaps strongly with the
Practice, but the upstream implementation keeps the substrate light: skill
files, a plugin manifest, a glossary, a setup skill, a small ADR, and shell
scripts.

### 2. Packaging And Inventory

The repository has several inventory layers:

- the README lists promoted engineering, productivity, and miscellaneous
  skills [README engineering][src-readme-engineering]
  [README productivity][src-readme-productivity]
  [README misc][src-readme-misc];
- the Claude plugin manifest packages a smaller set of skills for distribution
  [plugin manifest][src-plugin];
- repository instructions say that every skill in `engineering`,
  `productivity`, or `misc` must be referenced in both README and plugin
  manifest [CLAUDE inventory rule][src-claude-inventory];
- scripts support local symlink installation and skill listing
  [link script][src-link-skills] [list script][src-list-skills].

The interesting substrate point is the tension between declared invariants and
actual inventory. The README and `misc` folder expose more skills than the
plugin manifest packages. That mismatch is instructive for Oak: whenever skills
are both documentation and executable distribution artefacts, the manifest
itself becomes part of the substrate and needs validation.

For Oak, this maps to portability checks, skill indexes, and agent-tool entry
points. A skill catalogue that is not mechanically reconciled with installable
or active surfaces will drift. The upstream repo shows the value of a compact
manifest and the risk of relying on prose to keep it true.

### 3. Setup As Substrate Negotiation

The setup skill is not merely an installer. It inspects the
host project, adds `docs/agents/` material, determines which skills need
configuration, and creates `CONTEXT.md` when missing
[setup overview][src-setup-overview] [setup folders][src-setup-folders]
[setup context][src-setup-context].

The skill explicitly distinguishes "hard dependencies" from ordinary skill
preferences. The ADR says only skills that are impossible without project setup
should include an explicit setup pointer, while softer improvements should be
discovered contextually [ADR setup dependency][src-adr-setup].

That distinction is directly useful to the Practice. Oak already has many
surfaces that are essential for some tasks and optional for others. The upstream
repo gives us a crisp vocabulary:

- hard dependency: the skill cannot work without the project substrate;
- soft dependency: the skill improves with project substrate, but can start
  without ceremony;
- setup pointer: a high-friction instruction that should be reserved for true
  blockers.

This vocabulary could make our skills easier to reason about. For example,
claim registration is a hard dependency for active edits in shared Oak work,
while reading a research-lane README may be a soft dependency for a narrow
read-only comparison.

### 4. Domain Language As Shared Memory

`CONTEXT.md` is described as a glossary for domain terms. The sample entries
define issue trackers, issues, triage roles, relationships, and ambiguity around
"backlog" [CONTEXT glossary][src-context].
`grill-with-docs` uses that glossary as a live alignment surface: ask one
question at a time, inspect code first when the answer may already exist, update
`CONTEXT.md` as terms become clear, and propose ADRs only for decisions with
real durability or trade-offs [grill process][src-grill-process]
[grill context update][src-grill-context].

This is one of the strongest conceptual flows in the upstream substrate. It
treats language itself as infrastructure. The goal is not merely to document
terms after the fact; it is to make agent-user conversation cheaper, less
ambiguous, and more cumulative.

Oak already has richer memory and doctrine, but some of it is broad and
cross-cutting. The external lesson is that a small, local glossary can be a
high-leverage substrate object when the work depends on domain-specific terms.
The Practice should not replace existing memory with glossaries, but it can
learn from the way `CONTEXT.md` acts as a low-friction domain alignment cache.

### 5. The Issue Factory

The engineering skills `triage`, `to-prd`, and `to-issues` form a coherent
issue-factory flow:

- `triage` classifies incoming issues, adds AI-triage markers, asks for issue
  tracker configuration when missing, and uses status labels as a state machine
  [triage flow][src-triage-flow] [triage labels][src-triage-labels];
- `to-prd` turns ideas into product requirement documents and stores rejected
  alternatives in an out-of-scope memory surface
  [to-prd overview][src-to-prd-overview]
  [out-of-scope memory][src-out-of-scope];
- `to-issues` turns PRDs into ordered, vertical, reviewable issues with agent
  briefs [to-issues overview][src-to-issues-overview]
  [agent brief][src-agent-brief].

The agent-brief template is especially interesting. It asks for task, context,
constraints, success signals, test expectations, and warnings, while explicitly
discouraging brittle instructions such as exact file paths or line numbers
[agent brief][src-agent-brief]. That is a durable-handoff design, not just an
issue-template design.

Oak's equivalent substrate is broader: plans, ADRs, claims, comms, thread
records, repo continuity, gates, and handoff routines. The learning is not to
replace plans with issues. The learning is that "agent brief" is a useful object
type: a compact, behaviourally framed work packet that can sit between a plan
and an execution session.

### 6. Feedback-Loop First Engineering

The `diagnose` skill is the strongest engineering skill in the upstream repo. It
opens by requiring a fast, deterministic feedback loop. If no loop exists, the
agent must build one before fixing the bug [diagnose loop][src-diagnose-loop].
It then requires reproduction, ranked hypotheses, one-variable-at-a-time
instrumentation, and a regression test at the correct behavioural seam
[diagnose hypotheses][src-diagnose-hypotheses]
[diagnose regression][src-diagnose-regression].

This skill encodes a complete debugging epistemology:

- first create signal;
- then reproduce;
- then propose falsifiable causes;
- then instrument narrowly;
- then fix only the proven cause;
- then leave a regression guard.

Oak has strong TDD and gate doctrine, but this phrasing is worth learning from.
It makes "feedback loop first" the first move of debugging, not an afterthought.
That could strengthen Practice guidance for bug sessions where the failure mode
is not yet observable.

### 7. TDD As Vertical Slicing

The upstream `tdd` skill is concise. It insists on tests first, behavioural
public interfaces, one failing test followed by the smallest implementation, and
vertical slices rather than horizontal scaffolding
[tdd loop][src-tdd-loop] [tdd vertical][src-tdd-vertical].

Compared with Oak, this is lighter. Oak's testing doctrine carries stronger
rules about design, no-IO boundaries, structural compliance, and test
responsibility. The useful learning is communicative rather than doctrinal: the
upstream skill is easy to remember because it compresses TDD into a sequence
that an agent can execute without rereading a long doctrine file.

For Practice design, the question is whether some of our stricter doctrines need
shorter operational summaries that preserve the rule without losing nuance.

### 8. Architecture Through Deep Modules

`improve-codebase-architecture` has a clear architectural vocabulary: module,
interface, implementation, depth, seam, adapter, leverage, and locality
[architecture concepts][src-architecture-concepts].
It pushes the agent to find shallow modules, improve depth, extract real seams
only when there are at least two implementations or genuine boundary pressure,
and treat interfaces as the test surface [architecture process][src-architecture-process].

The most useful substrate concept is "deep module" as a conversational unit. It
gives the agent and user a compact way to discuss architecture quality without
immediately reaching for broad refactors. It also guards against speculative
abstraction: one adapter is a hypothetical seam; two adapters make the seam real
[architecture process][src-architecture-process].

Oak's architecture substrate is more formal, with ADRs, boundaries, dependency
rules, and validation tools. The external skill shows how to make architecture
review more memorable at the local code-change scale.

### 9. Prototyping As Question-Answering

The `prototype` skill defines a prototype as disposable code that answers a
specific question [prototype definition][src-prototype-definition]. It separates
logic prototypes from UI prototypes, demands clear questions before building,
and requires the result to be deleted, absorbed, or converted into an artefact
after the answer is captured [prototype branches][src-prototype-branches]
[prototype closeout][src-prototype-closeout].

This is a valuable substrate move because it gives permission to explore while
preventing prototype residue from becoming architecture by accident. Oak has
planning and research surfaces that can host prototypes, but the explicit rule
"prototype answers a question; then delete, absorb, or promote" would be a good
operational phrase to retain.

### 10. Handoff As Referential Compression

The `handoff` productivity skill is deliberately tiny. It writes a temporary
markdown handoff, suggests relevant next skills, and tells the agent not to
duplicate durable material that already exists in commits, issues, PRDs, ADRs,
or plans [handoff skill][src-handoff].

That is a useful contrast with Oak. Our handoff substrate is richer and more
stateful: thread records, repo continuity, active claims, comms, next-session
openers, and conditional consolidation. The upstream skill contributes one
important principle: handoff should be referential where possible. It should
point to existing authoritative artefacts instead of re-summarising them into a
second, divergent source of truth.

Oak already values this, but the phrase "referential compression" is the
learning: make the next agent faster without creating a shadow plan.

### 11. Safety And Guardrails

The miscellaneous skills include Claude-specific git guardrails and pre-commit
setup. They are not directly portable to Oak, but they reveal the upstream
substrate's safety boundary: prompt-level rules plus common tool setup
[git guardrails][src-git-guardrails] [precommit setup][src-precommit-setup].

Oak should be cautious here. Our shared-work safety depends on claims, comms,
commit queues, hooks, repo validators, and explicit ownership rules. Prompt-only
guardrails are useful but not enough. This aligns with our local memory pattern:
passive guidance loses to artefact gravity unless the operational surfaces make
the desired behaviour easy and visible
([passive-guidance pattern](../../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)).

### 12. Learning Loops And Negative Memory

The repository keeps `in-progress`, `deprecated`, `personal`, and
`.out-of-scope` folders. The out-of-scope template records rejected ideas,
reasons, alternatives, and conditions under which the decision should be
revisited [out-of-scope structure][src-out-of-scope-structure]
[out-of-scope revisit][src-out-of-scope-revisit].

This is one of the quieter but more important substrate signals. The repo does
not only preserve what to do. It also preserves what not to do yet, and why.
That is a negative memory surface.

Oak has richer memory and plan history, but negative decisions can become buried
inside plans, comms, or ADR alternatives. The external substrate suggests that
some repeated "do not route there yet" decisions may deserve a first-class,
small, searchable shape.

## What Oak Can Learn

### Make Substrate Objects More Nameable

The upstream repo is good at naming moves: diagnose, grill, prototype, handoff,
triage, deep module, agent brief. These names act as handles. They let an agent
switch modes quickly and let a user ask for a flow without explaining the whole
method.

Oak has deeper doctrine, but some surfaces are harder to summon by name. A
useful follow-up would be to identify which Practice flows deserve short,
memorable mode names and which should stay as background doctrine.

### Classify Skill Dependencies

The hard-vs-soft dependency distinction in the setup ADR is immediately useful
[ADR setup dependency][src-adr-setup]. We could annotate Oak skills by whether
they require:

- repo grounding;
- active claim registration;
- comms participation;
- plan authority;
- specialist review;
- gates;
- external credentials or project configuration.

That would help agents avoid both under-grounding and unnecessary ceremony.

### Treat Glossaries As Lightweight Alignment Caches

`CONTEXT.md` is a low-friction glossary, not a plan, ADR, or handoff. It gives
domain language a small durable home [CONTEXT glossary][src-context].
Oak should consider when a lane needs a glossary-like surface separate from
memory and plan state. This is especially relevant when user-agent friction is
caused by terms, roles, or object names rather than by missing implementation
steps.

### Add A Debugging Flow Around Signal Creation

Oak has gates and testing discipline, but `diagnose` makes a sharper opening
move: no fix before a fast deterministic feedback loop exists
[diagnose loop][src-diagnose-loop]. A Practice-native debugging workflow could
turn that into:

- identify the failing signal;
- make it local and repeatable;
- rank hypotheses;
- falsify with one-variable instrumentation;
- land the regression at the behavioural seam;
- only then generalise.

### Make Prototypes Expire By Design

The prototype skill's closeout options are simple and powerful: delete, absorb,
or convert after the question is answered [prototype closeout][src-prototype-closeout].
Oak research and spike work would benefit from making that expiry explicit at
the start of a prototype, not only during cleanup.

### Borrow The Agent-Brief Shape, Not The Issue Workflow

The agent-brief template is a strong portable object because it is behavioural,
durable, and compact [agent brief][src-agent-brief]. Oak should not replace plan
architecture with issue conversion, but the brief shape could improve handoffs
or multi-agent work packets:

- task;
- context;
- constraints;
- success signals;
- test expectations;
- warnings.

The important part is that the brief avoids brittle implementation routing. It
describes the work in a way a capable agent can execute after fresh grounding.

### Validate Manifests Against Documentation

The README, plugin manifest, and repository instructions create a useful
three-way integrity check, but the current upstream snapshot appears to have a
manifest/docs mismatch around miscellaneous skills
[README misc][src-readme-misc] [plugin manifest][src-plugin]
[CLAUDE inventory rule][src-claude-inventory].

For Oak, the lesson is to treat skill indexes, generated manifests, plugin
metadata, and documentation as one inventory surface. If a skill can be invoked,
installed, or distributed, there should be a validator that proves the declared
inventory matches the actual one.

### Keep Handoff Referential

The handoff skill's strongest idea is not the temp file. It is the warning not
to duplicate durable artefacts [handoff skill][src-handoff]. Oak's handoff
workflow can keep learning from this by preferring pointers to controlling
plans, commits, ADRs, claim state, and thread records over new prose that may
drift.

## What Oak Should Not Learn

### Do Not Downgrade From Operational State To Prompt Rules

The upstream substrate often relies on prompt instructions. That is appropriate
for a portable personal skill repo, but not enough for Oak's concurrent shared
work. Claims, comms, commit queues, hooks, and validation tools should remain
operational surfaces, not just prose reminders.

### Do Not Treat The Plugin Manifest As The Whole Truth

The plugin manifest is helpful, but it omits some documented miscellaneous
skills in the reviewed snapshot [plugin manifest][src-plugin]
[README misc][src-readme-misc]. Oak should avoid any design in which the
installable manifest silently becomes the only visible skill index.

### Do Not Import Generic Type-Shortcut Patterns

Some deprecated or miscellaneous surfaces, such as migration to a helper around
type assertions, are not aligned with Oak's type-safety posture. The lesson is
not the concrete tool; it is that external substrates carry local values. We
should learn the pattern only after checking it against Practice doctrine.

### Do Not Let Negative Memory Become A Graveyard

The out-of-scope surface is valuable because it includes revisit conditions
[out-of-scope revisit][src-out-of-scope-revisit]. A negative-memory system
without revisit criteria would harden old decisions into unexamined constraints.

## Candidate Follow-Ups

These are research-to-Practice candidates, not recommendations to implement
immediately.

1. Add a Practice note for skill dependency classes: hard setup dependency,
   soft setup dependency, optional context, and no setup dependency.
2. Draft an Oak-native `diagnose` workflow centred on creating a fast,
   deterministic feedback loop before fixing.
3. Add a prototype doctrine note: a prototype answers a question, then is
   deleted, absorbed, or promoted into a durable artefact.
4. Explore a compact "agent brief" object for multi-agent work packets, without
   replacing plan authority.
5. Add or extend validation so skill inventories, README references, and
   plugin/install surfaces cannot drift silently.
6. Consider a lightweight negative-decision memory shape for repeated
   out-of-scope routing decisions, with mandatory revisit conditions.
7. Review whether any active Oak lanes need glossary-style context files for
   domain language that is too local for global doctrine.

## Closing Interpretation

The upstream repository's substrate is thin, portable, and rhetorically strong.
Oak's Practice substrate is thicker, more stateful, and better suited to
concurrent repo work. The most valuable learning is therefore not to copy the
skills, but to notice where small named flows make a substrate easier to invoke.

The Practice should keep its stronger operational guarantees, but it can learn
from the external repo's compression: sharper names, smaller mode-switches,
clearer dependency classes, explicit negative memory, and engineering flows that
begin by making feedback visible.

[src-readme-purpose]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L15-L19
[src-readme-why]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L25-L38
[src-readme-positioning]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L42-L61
[src-readme-engineering]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L63-L98
[src-readme-productivity]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L100-L116
[src-readme-misc]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/README.md#L118-L141
[src-plugin]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/.claude-plugin/plugin.json#L1-L19
[src-claude-inventory]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/CLAUDE.md#L1-L14
[src-link-skills]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/link-skills.sh#L1-L85
[src-list-skills]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/list-skills.sh#L1-L65
[src-setup-overview]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/setup-skill/SKILL.md#L9-L15
[src-setup-folders]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/setup-skill/SKILL.md#L19-L45
[src-setup-context]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/setup-skill/SKILL.md#L47-L68
[src-adr-setup]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/docs/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md#L1-L10
[src-context]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/CONTEXT.md#L1-L25
[src-grill-process]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/grill-with-docs/SKILL.md#L8-L36
[src-grill-context]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/grill-with-docs/SKILL.md#L52-L86
[src-triage-flow]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/triage/SKILL.md#L8-L40
[src-triage-labels]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/triage/SKILL.md#L61-L81
[src-to-prd-overview]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/to-prd/SKILL.md#L8-L42
[src-out-of-scope]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/.out-of-scope/README.md#L1-L7
[src-to-issues-overview]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/to-issues/SKILL.md#L8-L43
[src-agent-brief]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/to-issues/agent-brief.template.md#L1-L35
[src-diagnose-loop]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/diagnose/SKILL.md#L12-L49
[src-diagnose-hypotheses]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/diagnose/SKILL.md#L65-L89
[src-diagnose-regression]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/diagnose/SKILL.md#L91-L117
[src-tdd-loop]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/tdd/SKILL.md#L8-L41
[src-tdd-vertical]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/tdd/SKILL.md#L43-L109
[src-architecture-concepts]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/improve-codebase-architecture/SKILL.md#L8-L29
[src-architecture-process]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/improve-codebase-architecture/SKILL.md#L31-L71
[src-prototype-definition]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/prototype/SKILL.md#L8-L30
[src-prototype-branches]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/prototype/SKILL.md#L55-L116
[src-prototype-closeout]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/engineering/prototype/SKILL.md#L118-L155
[src-handoff]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/productivity/handoff/SKILL.md#L7-L13
[src-git-guardrails]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/misc/git-guardrails-claude-code/SKILL.md#L1-L93
[src-precommit-setup]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/skills/misc/setup-pre-commit/SKILL.md#L1-L95
[src-out-of-scope-structure]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/.out-of-scope/README.md#L17-L21
[src-out-of-scope-revisit]: upstream-snapshot:e74f0061bb67222181640effa98c675bdb2fdaa7/.out-of-scope/README.md#L70-L100

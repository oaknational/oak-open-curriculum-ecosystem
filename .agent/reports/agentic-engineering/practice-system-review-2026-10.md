# The Practice as one system across two estates

A review of the mechanisms by which two estates, jimcresswell.net and OCE, plan, decide,
implement, review, deliver and learn, read side by side as one system with two instantiations.
Written by the Director seat Crucible binds Slag (7b999c) on 2026-10-04 under the delivery node
`practice-system-review`, at the owner's word of 2026-10-03: "forget what you think you know and
review the mechanisms in both estates ... everything that isn't 'the product'".

Read at jimcresswell.net `coordination/2026-10-02-24fc05` (main `c4d376535` merged in) and OCE
`coordination/2026-10-03-e790ea` (engraph `f0f1aacb7` merged in), from what runs and governs
first: the root entry points and package scripts, the git hooks, the CI workflows, the shared
configuration, the Practice directory's layout, the tooling workspace, the custom lint rules, the
memory, state and plan surfaces, the decision-record surfaces, the reviewer rosters; the doctrine
second, as claims tested against those. The ledger of 2026-10-02, the survey's prefixes and this
seat's earlier conclusions were not inputs. OCE's paths are written as names, never links.

## Page one: the model

### The candidate definition

The Practice is one system of engineering practice that governs how work is planned, decided,
implemented, reviewed, delivered and learned from in every repository that carries it. It has
five layers.

- The **general** layer is what holds for the same reason wherever the Practice runs: the
  principles, rules, skills, decision records, reviewer templates and hook policy; the schemas
  of its state, memory and plan surfaces; the contracts its gates must meet (what is checked at
  commit, at push and in CI, by name); the validators and lint rules that enforce them, as
  contracts.
- The **family** layer binds the general layer to one tooling ecosystem (today TypeScript; a
  Python or Rust host would carry its own): the script vocabulary for Practice operations and
  every quality gate (names and bodies), the gate composition and its placement at commit, push
  and CI, the toolchain and its pinned majors (package manager, runtime, orchestration, lint,
  types, tests, formatting, markdown, commit lint, secret scan), the shared configuration
  baselines (the compiler base, the lint rule set with the custom rules, formatting, commit
  lint, markdown lint, documentation comments, the dependency and unused-code rule shapes), the
  workspace layout conventions, the CI skeleton, and the implementation of the Practice's own
  tooling in that ecosystem. The owner's expectation states its contract: every repository of a
  family has the same Practice-operation scripts and gates. (The owner's word, 2026-10-04:
  "there is the repo tooling family, e.g. Typescript, Python, Rust, each family has conventions,
  for instance I would expect all Typescript family repos to have the same package.json
  scripts, at least for Practice operations, which includes all quality gates".)
- The **contextual** layer binds the family layer to one host: the package scope and workspace
  list, the product's tasks and the content of the configurations that name them, the required
  checks beyond the family's, deployment, the host's reviewers, rules and decision records, the
  operator's profile.
- The **accumulated** layer is what an instance accrues as it runs and learns from: the napkin,
  the registers, claims, comms, handoffs, plan nodes, reports, experience, the Core changelog.
  It is created empty in a new context and never transmitted.
- The **loop** is the set of mechanisms by which the accumulated layer becomes general, family
  or contextual (capture, distillation, graduation into rules, records and validators,
  enforcement by gates and reviewers) and by which one instance's learning reaches another. A
  lesson about the method graduates to the general layer; a lesson about the toolchain
  graduates to the family, where the second-consumer rule counts instances of that family; a
  lesson about this product stays contextual.

An instance of the Practice is all five layers in one repository. The Practice itself is the
general layer, the families it has bindings for, and the loop. The product is what an instance
produces and is no part of it.

Against the three existing statements. It keeps `practice.md`'s sentence (a self-reinforcing
system that governs how work happens, with the product and the substrate as two output surfaces)
and makes "system" concrete as five layers. It keeps the functional reading of
`what-the-practice-is.md` (its nine functions are this review's areas) and places each function
in a layer. It keeps PDR-143's two membership tests (the migration test and the framework test)
and reads its seven scope classes as the layers: Practice-wide is the general layer;
language-wide is the family layer, which PDR-143 names but places inside the entity as a binding
and which this review raises to a layer of its own because it has its own conformance contract
and its own learning destination; repo-local authored and rendered are the contextual layer;
repo-local instances are the accumulated layer; repo-local host is not the Practice;
machine-local is contextual. What it replaces: the reading that the Practice is the copyable
subset (the Core, or six measured directories) and that alignment is bytes. Alignment is per
layer: the general layer is the same by concept in every instance, bytes where the concept
travels as bytes (PDR-142); the family layer is the same by convention in every instance of the
family, and a difference there is a conformance defect, never a binding; the contextual layer
differs by design and is named as bindings; the accumulated layer is never compared; the loop is
the same mechanisms with the same instruments.

### What transmits, what is created empty, what stays the host's

- **Transmits, as files: the general layer.** Found the same in both estates today: the Core
  trinity and index byte-identical; 130 of 143 PDRs byte-identical; 120 rules, 24 skills and 13
  directives shared by name (three directives byte-identical); the seven git hooks by name; the
  CI skeleton (secret scan, install, static checks, build and test); the aggregate `check` gate
  as a concept; 36 tooling modules shared by name, 73 merge-bot files by name, 21 validators by
  name; eight custom lint rules by name; the three-mode memory layout with its executive
  contracts; the collaboration substrate (claims, comms, commit queue, handoffs, escalations,
  sidebars); the plan-node schema and its three directories; the reviewer roster's core of 26;
  the one role.
- **Transmits, per family: the family layer.** Found in both estates, both TypeScript: 68 root
  scripts shared by name, 50 of them identical once the package scope is normalised (every
  agent-tools alias, the format, markdown, portability, sub-agent, fitness, profile and secret
  scan operations); the seven git hooks by name; the commit-lint, markdown-lint, documentation
  comment and runtime-version configurations byte-identical; the compiler base identical but
  for four strictness flags this estate adds; the same toolchain at the same majors (turbo,
  knip, dependency-cruiser, eslint, TypeScript 6, prettier, husky, tsx), the package manager
  one major apart (pnpm 12 here, 11 in OCE), the runtime the same (node 24). None of this would
  exist in a Python host, and all of it exists in both of these, which is why a reading of two
  repositories of one family sees it as the general layer: a layer every observed instance
  shares is invisible until a second family exists.
- **Created empty: every accumulated surface.** Two placements found: the patterns directory
  (247 files in each, 25 differing) and the PDRs travelled full, because they are the
  graduation's output and belong to the general layer although they sit under `memory/` and
  `practice-core/`.
- **Stays the host's:** the contextual bindings; the host's own records (24 architecture and 6
  editorial decision records here; 224 architectural and 12 design in OCE); the host's product
  tooling (OCE's MCP conformance and content modules; this estate's knowledge-graph work); the
  host reviewers (pkg and editor here; clerk, elasticsearch, mcp, sentry and ground-truth in
  OCE); the host rules (14 here, 13 in OCE, none the same concept).

### The divergences, by class, with a direction each

The directions follow PDR-142 §How each kind travels; where a class is not one PDR-142 names,
that is said.

- **A. General text diverged.** `principles.md` (442 differing lines; one section only here),
  `validation-strategy.md` (377 lines here against 198: eleven sections here that OCE lacks,
  compile-time patterns, gate layers and claim-directed mutation checks among them; one in OCE
  that this estate lacks), `testing-strategy.md` (215), `AGENT.md` (346), 13 PDRs, 25 of 247
  patterns, 22 reviewer templates and the reviewer README, 8 of 11 executive contracts, the Core
  changelog (371), `practice-verification.md` (19). Direction: one text, judged as it travels;
  the ledger's rows are this class and remain its evidence. One word: merge.
- **B. General capability one-sided.** Skills: 16 here, 9 in OCE. Validators: four each way.
  Tooling modules: 14 in OCE, none here (review-cost, pr-tally, pr-throughput, skill-evals,
  restatement-audit, workspace-census, typescript-estate among them). Custom lint rules: seven in
  OCE (boundary, vendor-import, observability emission, strict-lint harness), none here. The
  distillation skill here only. Direction: carry the tested module with its tests where its
  concept passes the migration test, else name it host (the owner's word of 2026-10-01: never a
  question of whether). One word: carry.
- **C. Family conformance diverged.** The 18 shared Practice-operation scripts whose bodies
  differ are exactly the gates: `check`, `build`, `lint`, `type-check`, `test`, `test:e2e`,
  `clean`, `depcruise`, `encoding:check`, `docs-validators:check`, `repo-validators:check`,
  `skills:check`, `skills:generate`, `practice:substrate:check` among them. Where the gate runs:
  this estate runs a light commit and a full push (the owner's ruling of 2026-09-12, cited in
  its hook); OCE runs the full build, type-check, lint, tests and every validator at each commit,
  and a push gate with the secret scan and the review-cost budget. Where the settlement budget
  is enforced: OCE at the push, from a ledger; here inside the merge decision. The compiler
  base: four strictness flags here that OCE lacks. The formatter configured in two file formats.
  The package manager one major apart. Direction: the family's conventions are one set, declared
  once and checked in every instance of the family (the cure that generalises is a family
  conformance validator, a cousin of the check-CI parity validator both estates already run);
  a ruling about the family reaches every instance of it. This class is not one PDR-142 names.
  One word: one family shape.
- **D. Layout contract drifted from the tree.** OCE's `.agent/README.md` describes a plan
  lifecycle (future, current, active, archive) its tree no longer has, a knowledge flow
  (patterns, graduated) its registers no longer use, and a `tools/` directory that does not
  exist; this estate's keeps `practice-context/` and `operator-local/`, both retired; one
  document, the agent-tools operational requirements, lives under the executive memory here and
  under `docs/engineering/` in OCE. Direction: the index surfaces are trued in each estate, and
  the cure that generalises is a validator of the directory map against the tree. One word:
  true the maps.
- **E. Contextual by design.** The content of the family's configurations where it names the
  host's workspaces and products (turbo 421 differing lines, knip 407, dependency-cruiser 256,
  the harness settings 304, the hook policy 157, gitleaks 120, the prettier ignores 136; the
  tools and rule shapes are the family's, the lists are the host's), the required-check sets
  beyond the family's skeleton (four jobs here; a fan-in of nine in OCE, with schema drift, a
  Windows leg and browser tests), deployment (a site here; an MCP app and a release pipeline in
  OCE), the host records, reviewers and rules. Direction: none; they are the parameter list,
  and the parameter list is shorter once the family holds the tool and rule shapes. One word:
  leave, and name them.
- **F. Accumulated, never aligned.** Napkins (730 lines here, 337 in OCE), registers, 7 threads
  here and 13, 40 plan files here and 162 plus four legacy plan directories of about two
  thousand files in OCE, reports (48 here, 572), experience (36, 468), the Core changelog as
  each instance writes it. Direction: excluded from alignment; the changelog becomes one when
  the Core is one. One word: exclude.
- **G. The loop's path between instances is doctrine, not mechanism.** `practice-core/incoming/`
  holds one file in each estate; the exchange register and its validator exist here only;
  PDR-024's Box and PDR-142's travel rules are enacted by a seat reading the other estate's
  checkout on one machine. Direction: this is the extraction's design question. One word: defer
  to the entity's design; the instrument today is one seat reading both.

## The evidence, one row per area

Each row: the mechanisms the area holds; where each estate instantiates them; the layer; the
open placements (a mechanism the layers do not place, numbered in the section after the rows);
what was not read, marked unread.

1. **Planning.** Mechanisms: the plan-node estate (strategic, delivery, runbooks; the schema;
   impact areas; owner gates; the born-sketch ratification stamp; proof types), the corpus
   validator, the plan-gate drift check, tickets by milestone. Instantiated: identically in
   both (`plans/plan-node-schema.md`, `validate-plan-corpus`, `check-plan-gate-drift`); OCE
   adds `milestones/` and four legacy plan directories. Layer: the schema and validators
   general; the nodes accumulated. Open placements: none. Unread: the node bodies beyond the three
   live ones; the legacy directories.
2. **Deciding and authority.** Mechanisms: PDRs in the Core with the changelog and provenance;
   host decision records (architecture and editorial here; architectural and design in OCE)
   with ADR-023's host-side adoption record; explorations (2 here, 16 in OCE); amendment logs;
   the decision lenses in `principles.md`; the owner's rulings captured verbatim (PDR-107,
   PDR-142); the Director's rulings ledger (OCE only, under operational memory). Instantiated:
   the Core identically but for 13 PDRs; the host records by host. Layer: PDRs, lenses and the
   capture rule general; host records contextual; rulings ledgers accumulated. Open placements: the
   bridge index named by the review node's plan was not found as a surface in this estate (its
   ADR README carries no bridge section; OCE's carries one); the Core changelog is written per
   instance. Unread: the 13 differing PDRs' diffs; the host records' content.
3. **Implementing.** Mechanisms: branches and worktrees, the coordination branch and its fold,
   commit discipline (commitlint, the branch guard, the major-version guard), the git hooks, the
   agent tooling workspace, the workspace layout, the shared configuration (turbo, knip,
   dependency-cruiser, tsconfig base, prettier, markdownlint, tsdoc, gitleaks), the custom lint
   rules. Instantiated: the same mechanisms in both; 68 root scripts shared by name, 50
   identical, the 18 differing ones the gates (class C); the hooks' placement differs (class C);
   the configuration content differs by host (class E); the lint rules eight shared and seven in
   OCE only (class B). Layer: the mechanisms general; the scripts, hooks, toolchain and
   configuration baselines family; the lists and product tasks contextual. Open placements: the
   gate-placement ruling of 2026-09-12 reached one estate only. Unread: the configuration files'
   content beyond line counts; the tooling modules' code.
4. **Reviewing.** Mechanisms: the pull-request lifecycle skill, the merge bot (identical by
   file name, 73 files, six OCE-only), the required checks, the automated reviewers (Copilot and
   Codex in both), the reviewer sub-agents (26 shared, 3 here only, 5 in OCE only), round
   budgets and settlement pricing, the Cricket conscience checks, review triage. Instantiated:
   the bot and the lifecycle the same; the budget enforced at the push in OCE (review-cost
   module, ledger and hook) and inside the merge decision here (class C); the reviewer
   templates 22 of 30 differing in text (class A); OCE holds `pr-tally` and `pr-throughput`
   (class B). Layer: general; the rosters' host members contextual. Open placements: none. Unread:
   the templates' diffs; the CI workflow bodies.
5. **Delivering value.** Mechanisms: the user-value skill (both), the specification family (OCE
   authored, carried here as 318, unmerged), the definition-of-delivery directive (9 differing
   lines), release readiness (a reviewer in both), deployment (Vercel in both; a release
   pipeline and an upstream carrier in OCE). Layer: the skills and directive general; deployment
   contextual. Open placements: none. Unread: the definition-of-delivery diff; the release pipeline.
6. **Developer experience and onboarding.** Mechanisms: the root entry points (README,
   CONTRIBUTING, AGENTS, CLAUDE, GEMINI, RULES_INDEX, skills.md in both), the orientation
   directive (15 differing lines), the under-the-hood skill here and the under-the-hood content
   generator in OCE, the start-right skills, the bootstrap on install. Layer: general;
   the content contextual. Open placements: the same orientation capability is a skill here and a
   generated content module in OCE. Unread: the entry points' content.
7. **Strictness and contracts.** Mechanisms: the validation and testing strategies (class A),
   the no-warning and never-disable rules (both), the validators (21 shared; cited paths, cited
   scripts, exchange register and lineage names here; notion fence, plugin skill copies,
   ratified lists and a verdict register in OCE), the substrate contracts manifest and the
   fitness validator (both), the check-CI parity validator (both). Layer: general; the host
   validators contextual. Open placements: four validators each way whose concepts may be general
   (cited paths and cited scripts in particular). Unread: the validators' code.
8. **The learning loop.** Mechanisms: capture (napkin, frictions register, open questions,
   experience, comms) in both; distillation (`distilled.md` in both; the distillation skill
   here only); graduation (pending-graduations register in both, 206 lines here and 135;
   patterns 247 in each; PDR-130's two speeds in the Core); enforcement (validators, hooks,
   reviewers); the inbound path (`practice-core/incoming/`, one file each; the exchange register
   here). Layer: the loop. Open placements: the patterns (placement 1); the path between instances runs through a seat, not a mechanism (class G).
   Unread: the registers' content; the napkin archives (7 here, 122 in OCE).
9. **Collaboration and roles.** Mechanisms: the collaboration directive (35 differing lines),
   the Director and implementer roles, claims and their freshness validator, the comms stream,
   handoffs, the inter-Practice protocol, the one role file (identical). Instantiated: the same
   substrate in both; OCE adds a comms-events directory, an owner-jobs record and a
   cross-worktree work-state record. Layer: general; the instances accumulated. Open placements:
   none. Unread: the directive's diff; the executive channel contracts' diffs.
10. **Structure.** Mechanisms: the Practice directory's layout and its README contract, the
    adapter model (`.claude`, `.cursor`, `.codex`, `.gemini`, `.agents` in both; a plugin
    manifest in OCE), the operator profile (PDR-141), the retired tiers. Instantiated: the same
    skeleton (27 top-level entries here, 30 in OCE); the README contract stale in OCE and
    carrying retired tiers here (class D). Layer: the skeleton general; the extra directories
    accumulated or contextual. Open placements: PDR-134 §1's strata and PDR-143 §1's "lives in" column
    place artefacts by directory; the tree places patterns and PDRs under directories of another
    layer, so the records' placement test is by content, never by path. Unread: PDR-134 and
    PDR-141 against the tree in detail.

## The owner's direction on the model, 2026-10-04, verbatim

"The broad approach should be, I think, tooling agnostic policy, strict universal contracts,
tooling specific implementations where a universal approach is not efficient or appropriate."
And on the extraction: "I suspect that there will be general Practice files, markdown, json etc
that are universal, and then tooling family specific adapters which adhere to strict and
comprehensive universal contracts and schemas. There is also the open question of how we feed
learning from the repo operations back into the local Practice and then the central Practice,
but those are questions for another day, important questions."

Read into the model: the general layer is policy and contract (tooling-agnostic text, and
schemas and contracts strict enough that a family adapter can be checked against them); the
family layer is implementation against those contracts, and exists only where a universal
implementation is not efficient or appropriate; the loop's path from an instance to the family
and to the general layer is the open design question, named and deferred.

## Placements the model had not made, with the owner's decisions of 2026-10-04

The Practice has no exceptions (`principles.md`): a thing the model does not place is a decision
the model still owes, never a note beside it. Six were found; the first-family test resolved one;
the owner decided each on 2026-10-04 (the words quoted at each item).

1. **Patterns live under `memory/active/patterns/`, an accumulated directory, but are general
   content.** 247 files in each estate, 222 identical: they travelled as a block, both estates
   rely on them, and they are the loop's graduation output. OCE's own layout note records the
   2026-04-29 decision that moved them out of the Core as "engineering instances"; the Python
   template keeps `practice-core/patterns/`. Verdict: patterns are general-layer content and
   their home is the general layer's (the Core), with the 25 differing files class A's merge;
   a pattern not yet proven by a second consumer is a graduation candidate and stays in the
   accumulated layer's register until it is. The directory move is a successor landing. The
   owner, 2026-10-04: "agreed, patterns are a core part of the memory loop. Although, an
   observation, unless they are linked to from strategy or architecture or rules or some other
   known source of information or process, I am not sure if they are providing value, and I am
   not sure how best to improve their ability to provide value. Patterns likely fall into the
   same layers as the Practice, some will always apply, some are tooling family, some may be
   specific to a repo". Carried to the successor: each pattern placed in a layer (general,
   family, contextual) as the rules and skills are; a pattern reachable from no rule, directive,
   skill, plan or decision record is a buffer, not knowledge, and the measure of that
   reachability is the instrument to build before any pattern is moved.
2. **The Core changelog is written once per instance** (371 differing lines): an accumulated
   record of a general-layer artefact. The owner, 2026-10-04: "I don't mind what happens to the
   changelog, if you think we have redundant information without the redundancy being valuable
   then please handle it." Decided under that word: the redundancy is two divergent copies of
   one history, which is not valuable; the changelog is the Core's own record and passes the
   migration test, so it is general-layer text merged as class A (the union of both estates'
   entries in date order, one file), and after extraction only the entity writes it.
   `provenance.yml`, which both estates share byte for byte, stays the per-file lineage.
3. **Fourteen `invoke-*` rules here name reviewers OCE also holds, and OCE holds no such
   rules.** The mechanism (a rule routes a reviewer) is general; the instantiation is one-sided.
   The owner, 2026-10-04: "Agreed on turning the 14 rules in to 1 rule and a table, and yes
   that should be in both estates." Decided: the successor lands one rule and a roster table in
   both estates, the same bytes, and retires the fourteen; nothing carries the fourteen first.
4. **The CI required set has two shapes**: OCE computes one required status from a fan-in job;
   this estate requires four named jobs. The contract (local `check` equals CI, one required
   context) is general and the check-CI parity validator enforces the first half in both.
   Verdict: a family-layer convention, one shape in both (class C); the fan-in is the simpler
   branch protection and is the recommended shape. The owner, 2026-10-04: "Agreed." Decided:
   the fan-in in both estates.
5. **The Practice's own runtime**: the agent tooling (claims, comms, the merge bot, the
   validators, the adapters' generator; 746 TypeScript sources here, 1148 in OCE) is written in
   TypeScript and run by pnpm. The Python template answers the question one way: it ported the
   hook runtime (`tools/agent_hooks.py`) and the gate runner (`devtools.py`) into Python and
   carries no collaboration substrate, at a Core revision of 33 PDRs against 143 here. Verdict:
   this is the extraction's first design question and the owner's: one implementation of the
   Practice runtime installed beside every host's toolchain (as gitleaks is, a binary for both
   families), or a port per family, or one implementation behind a thin per-family shim. The
   seat's recommendation is the first: the template's port is the evidence of the second's
   cost (two implementations, two revisions). The owner, 2026-10-04: "This is a question for the
   extraction, and I was thinking about it, I suspect that there will be general Practice files,
   markdown, json etc that are universal, and then tooling family specific adapters which adhere
   to strict and comprehensive universal contracts and schemas." Decided: deferred to the
   extraction's design under the direction quoted above (tooling-agnostic policy, strict
   universal contracts, tooling-specific implementations only where a universal approach is not
   efficient or appropriate); until then "family" names the host's ecosystem and the runtime's
   implementation ecosystem is a binding of the general layer.
6. **The family layer's falsifier** (two repositories of one family cannot distinguish family
   from general) was met on 2026-10-04 by the Python template the owner named: non-canonical,
   an earlier Practice revision, and it shows the family layer directly. Its gate contract file
   names the same vocabulary the TypeScript scripts carry (clean, build, dev, lint, lint-fix,
   format, format-fix, markdownlint, typecheck, test, coverage, fix, check, check-ci) bound to
   ruff, pyright, pytest, deptry, import-linter, pre-commit and commitizen in place of eslint,
   tsc, vitest, knip, dependency-cruiser, husky and commitlint; it places its quality gates at
   both commit and push; and its repo-audit contract checks that every documented command
   exists, a family conformance validator of the kind class C asks for. Verdict: resolved. The
   gate vocabulary is general; the runner, the tools, the placement and the conformance check
   are the family's; a Practice-operation script missing from a repository of a family is a
   conformance defect in that repository. The owner, 2026-10-04: "Agreed."

## What this reading did not do

It read names, counts and line differences, and the hooks and gate scripts in full; it did not
read the differing text of the directives, PDRs, templates and patterns, which is the ledger's
work and class A's merge. It did not run anything. It observed two tooling families: the two TypeScript estates in full
and, on the owner's word, a Python-family instance that met the family layer's falsifier. The
model was a hypothesis the evidence rows tested; the placements above are decided; the owner
ratified the definition as canonical on 2026-10-04, which completed the node that commissioned
this review.

Revision of 2026-10-04 14:3xZ: the family layer added at the owner's word, with the script,
hook, toolchain and compiler-base evidence; class C recast as family conformance; class E
narrowed to the host's lists; the loop given the family as a graduation destination.

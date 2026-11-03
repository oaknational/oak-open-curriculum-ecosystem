# The Practice in OCE and the lights-on software factory

Nature, review and comparison. Written 22 October 2026 by the seat Altair mends
Stillness (Claude cloud, solo) for Jim Cresswell, from first-hand reads of both
checkouts and from running the lights-on tooling.

## 0. Method and the skills applied

The owner asked for three things and for the appropriate OCE skills throughout.
Which skill served which part:

| Part | Skills and instruments |
| --- | --- |
| Grounding | `start-right-quick` end to end (host classified as Claude cloud; the reading order followed; identity derived; the claims registry seeded and a claim opened on the napkin); `napkin` read at open, written at close |
| 1. Nature of the Practice | `metacognition` in generative mode (the ask arrives as a pointer whose real scope is wider); `reason` moves 1 and 3 (name the kind of thing; surface the warrant and its falsifier); `under-the-hood` read and set aside, since this is a comparative analysis for the owner, not a newcomer's orientation |
| 2. Review of lights-on | `verify-dont-trust`: the repo's claims were run, not read (install, 80 tooling suites / 2,055 tests, 5 project tests, `eslint .`, `validate-plan`, `debug.js` traces); then the Practice's reviewer system: code-expert, security-expert, architecture-expert (Betty) and test-expert, each read-only, each briefed not to grade a foreign repo against OCE's host rules |
| 3. Compare and contrast | the Practice's own exchange method: concept-level comparison, never file-level (practice.md §Philosophy; practice-lineage §Integration Flow step 3; PDR-142). The inter-Practice join ceremony does not fire: lights-on is not a Practice estate and nothing is written into it |
| Framing check | `cricket`, both stances, before drafting: ON-TRACK twice; one NARROWED verdict on the frame (no reviewers named for part 2, skills not mapped to parts) and one redirection on registering the napkin claim. All three taken up above |

Everything below that is a number was counted on disk this session; everything
that is a quotation is quoted from the file named beside it.

## 1. What the Practice in OCE is

### 1.1 The one-sentence definition, and why it is not the whole answer

The owner ratified the canonical definition on 4 October 2026 (PDR-143 §Decision,
restated at the top of `practice.md`):

> The Practice is one system of engineering practice that governs how work is
> planned, decided, implemented, reviewed, delivered and learned from in every
> repository that carries it. It has five layers.

The five layers: **general** (tooling-agnostic policy and strict universal
contracts: principles, rules, skills, decision records, patterns, reviewer
templates, hook policy, the schemas of state and memory surfaces, the vocabulary
of gates), **family** (the binding to one tooling ecosystem: scripts, gates, hook
bodies, CI skeleton, shared byte-for-byte by every repository of the family),
**contextual** (the binding to one host: scope, workspaces, product tasks,
host reviewers and records, operator profile), **accumulated** (what an instance
accrues and learns from: napkin, registers, claims, comms, handoffs, plans,
reports, experience; "created empty in a new context and never transmitted"),
and **the loop** (capture, distillation, graduation, enforcement, and the open
question of how one instance's learning reaches another). "An instance of the
Practice is all five layers in one repository; the Practice itself is the
general layer, its family bindings and the loop; the product is what an instance
produces and is no part of it."

That definition is the spine. The reason the owner says "it's more than you
think" is that the definition names kinds, and the kinds are each a whole
system. Reading `.agent/` as "a folder of agent instructions" misses nine
distinct things it is.

### 1.2 Nine things the Practice is

**(a) A constitution with an order of resolution.** `principles.md` opens with
five decision lenses applied *in order*: long-term architectural excellence;
strict, everywhere, all the time; could it be simpler without compromising
quality; would it be simpler if the system changed; optimise for user value. The
first lens that decisively resolves a question governs. They are "the shared
decision substrate every agent and the Director apply, so decisions stay coherent
across the team without escalation". Above them sit owner precedence (the owner
speaking now beats every surface, including the directive that says so) and an
authority order across layers (`orientation.md`: plans, then repo-continuity,
then thread records; doctrine above all three for governance claims). Below them
sit rules that admit no exceptions (`rules-have-no-exceptions`), enforcement
mechanisms that ship without bypass surfaces ("there are no escape hatches",
owner, 2026-07-17), no change freezes ("we do absolutely world class
observability and the ability to respond quickly and safely", owner, 2026-07-30).
The texture is constitutional: owner words quoted verbatim with dates are the
authority trail, and a record carries its own falsifier.

**(b) A learning organism with a declared metabolism.** The knowledge flow is
"the Practice's central mechanism". Work feeds the napkin; the napkin distils;
distilled lessons graduate to patterns, rules, PDRs, ADRs, governance docs,
TSDoc; graduated rules enforce; enforcement shapes work. Six audiences, each
with a fitness governor. Two rulings make it unusual. First, *capture is sacred*:
"writing to the napkin, distilled, and similar records of shared state is NEVER
blocked by fitness function limits" (owner, 2026-04-29); fitness is a
post-writing health signal routed structurally, never a reason to write less.
Second, *promote on the first instance* (owner, 2026-06-27): a lesson is homed
at once and the Practice is trusted to invalidate a wrong promotion through
experience. PDR-130 adds a second speed: constitutional-class concepts enter a
slow-lane register with a prediction, a falsifier and a review date, and every
graduation at either speed states its expected observable effect and what would
show the rule is not working. PDR-072 names knowledge curation an *autonomic*
function and a first-class output: a session that ships no product code but
advances the substrate has produced real throughput. The accumulated layer is
large and alive: 150-plus experience essays since January 2025, dated
retrospectives titled as questions ("why five days of landings closed nine
stories"), a frictions register treated as structural findings (PDR-036).

**(c) A species, not a repository.** The Practice Core is a bounded package that
travels: the plasmid trinity (practice, lineage, bootstrap), verification, two
entry points, changelog, provenance, decision records, and the Practice Box for
inbound material. `provenance.yml` records chains through at least eight
repositories (the curriculum ecosystem, algo-experiments, new-cv, castr,
jimcresswell.net, pine-scripts, a Cloudinary icon proof of concept, a schema
transformation library). Exchange has two modes on one substrate:
*transformation* (dead material taken up at a pin) and *conjugation* (two live
seats on two estates repairing each other's drift, receipted in-session). The
unit of exchange is the concept, never the file or the name: "two repos may
implement the same concept under different names; concept-level comparison
reveals equivalences that file-level diffing misses." PDR-142 (ratified
2026-09-21) governs how instances are brought "up to the highest standards and
best capabilities of each". PDR-143 then changes the species' posture: from
"there is no hierarchy" to one canonical entity installed into each repository
as a committed, checked render, with repo-local *extensions, never overrides*,
promotion by the second-consumer rule, and the entity installed in itself. The
owner's word of 14 October 2026, in repo-continuity: "There is ONE Practice with
local instances, if OCE needs an update, it needs an update."

**(d) A family contract, recomputed.** `.agent/family/typescript/practice-operations.json`
declares thirty root scripts with their bodies, the `check` skeleton with two
host slots, the hook files (byte-identical bodies for pre-commit, commit-msg,
pre-push, pre-rebase and the rest) and the CI fan-in job, with `{scope}` and
`{skill_prefix}` as the only host placeholders; `host.json` binds them
(`@oaknational`, `oak-`). The manifest "is a declaration, never a record: the
family-conformance validator recomputes every item from the live tree at every
run and names each drift." This is the rule `validators-must-recompute-not-just-record`
made structural, and it is the layer the owner added on 4 October after a Python
instance confirmed it.

**(e) An organisation with seats and a nervous system.** Identity is
deterministic and derived (PDR-027): this session is "Altair mends Stillness",
seeded from the cloud session id, carried into every claim and record. There is
an untracked-by-design collaboration substrate: an active-claims registry, an
append-only comms event stream, decision threads, sidebars, escalations, an
advisory commit queue for the shared primary checkout, handoffs. Two seats are
doctrine (PDR-117): the **Director** (minimum action, a warm cache over a lossy
substrate, the single owner interface) and the **Implementer** (ephemeral,
worktree-isolated, one bounded lane). Liveness is a heartbeat contract; silence
is never liveness; an idle seat goes to cold pause after an hour (owner,
2026-08-14; the napkin records a seven-hour violation on 13 October and its
cure). Coordination branches live twenty-four hours and are folded by ceremony.
Cross-estate work runs a join ceremony. Owner attention is the scarce resource
the whole shape optimises (PDR-074: "Director value is mind-coherence per owner
attention"); owner questions arrive as cards at action moments, never as menus.

**(f) An epistemology.** `metacognition.md` is a directive, not a nicety: two
modes (retrospective on a correction signal, generative when the purpose is
load-bearing), friction as information rarely the thing it first looks like,
*fluency as a warning* ("the easier a justification arrives, the less it was
actually grounded"), fluency failures clustering at the finish line, the
reliability ladder held visible. `reason` is its outward pair: a direct-trial
gate (the implementation is the experiment when it is reversible, contained and
observable), a value-of-information stop gate with no `CONTINUE`, five moves. The
Cricket panel returns two verdicts, one on the work and one on the frame, because
"Crickets judge in the frame provided, we need them to also judge the frame
itself" (owner, 2026-09-24). Around these sit Parallax (frame, design inquiry,
design experiment, synthesise, decide, audit, learn), concept exploration,
proportionality, free play, and rules that police the vocabulary of knowing:
`one-instance-is-an-observation`, `no-hedging-vocabulary`,
`records-are-technical-not-emotional`, `verify-dont-trust`,
`compute-dont-hope`.

**(g) Physically enforced doctrine.** "Stated principles require structural
enforcement" (PDR-038). Canonical hook policy in `.agent/hooks/policy.json`
drives one prebuilt dispatcher that guards Bash, Edit and Write in Claude Code:
history destruction, gate bypass, wildcard staging, forced removal, unbounded
load, and content that violates doctrine. Git hooks run a light gate at commit
and the full `pnpm check` at push; CI composes the same legs under one fan-in
job; the owner's standing word is that an agent never runs the gates by hand
beside the hooks. Then the validators: portability, practice fitness (four
fitness fields on every governed file, four zones), family conformance, skill
adapter generation, sub-agent declarations, plan-gate drift, encoding, markdown
links, cited paths and scripts, reference direction, no machine-local paths, no
lineage names in Core, a review-cost gate, a secret scan before transfer. The
inventory counted today: 124 always-applied rules, 94 skill directories, 26
sub-agent templates composed from shared components into 31 Claude agents, 143
PDRs, 225 ADRs, and an `agent-tools` workspace of about fifty modules that
implements the capabilities (identity, claims, comms, commit queue, hook policy,
fitness, conformance, merge bot, PR watch, arc metrics, spawn, workflow build).
`agent-tools` states its own boundary: "a host-local implementation surface, not
the Practice itself"; the capability is Practice substance (PDR-035), the
TypeScript is phenotype.

**(h) Multi-vendor by construction.** Canonical content lives once in `.agent/`;
thin adapters are generated for Claude, Cursor, Codex and Gemini; the
entry points are deliberately vendor-named (`CLAUDE.md`, `AGENTS.md`,
`GEMINI.md`) so that every agent lands on the same portable infrastructure. A
cross-platform surface matrix records supported and unsupported states
explicitly. The cloud operating document for Claude sessions is a worked
example of the contextual layer: a universal setup script that discovers which
Practice repo a session carries, a per-repo hook, a dated register of
provisioning defects and in-session cures, and the owner's standing `HUSKY=0`
ruling with its four-item blocking substitute set.

**(i) A product and a strategy.** The strategy corpus has a stream for it:
"the agentic framework (ecosystem, and our own transformation)", with four
owner-signed bets (the Practice as a meta-learning loop; openly documented and
freely available; internal reuse; a rollout that spreads the capability) and
three refusals (never sacrifice rigour for speed; never keep it proprietary;
never swap people for agents). ADR-233 (10 October 2026) keeps the Practice as
"a distinct track" of the retained-framework programme. PDR-143 schedules its
extraction into a standalone installable entity once it "contains the best of
both". The Practice is therefore also a deliverable with a roadmap, and the
estate's dogfooding is its evidence.

### 1.3 The self-teaching chain, and its honest costs

What binds the nine is recursion as method: "each layer reads the prior layer's
output as input and writes material the next layer can read." The Core is
installed in itself; the rules about rules clear the same three-part bar
(validated by real work, prevents a recurring mistake, stable) that they impose.
The maturity model names the failure mode this guards against: Level 1,
"structurally present but inert", where files exist and references resolve but
nothing fires. The minimum operational estate and the claimed/installed/activated
audit exist to catch exactly that.

The Practice also records its own weight honestly. `principles.md` is past its
own fitness limits by owner ruling ("we can always iterate later"); the napkin
reached 876 KB before a rotation in September; a rule exists purely for the
context budget of directive files; the napkin of 2 October logs a fleet launched
on an estimate that cost three times it. The owner's standing teaching, quoted
in start-right, is the counterweight: "I think you need to spend more time
understanding the history rather than trying to make sensible guesses about
next steps." The cost of the Practice is reading; the return is that the reading
compounds.

## 2. Review of the lights-on software factory

### 2.1 What it is

Gojko Adzic's boilerplate for running a "lights-on software factory" with Claude
Code, exported from the Votito setup; MIT; eight commits on 20 and 21 October
2026; a root of eight markdown files, a makefile and a Dockerfile, and a
`workspace/` holding the Claude Code configuration, the tooling under
`.claude/workflow/` (about 4,000 lines of source, 10,900 lines of tests) and a
five-test sample module. The README calls it "both a simple boilerplate setup
for new projects, and an educational demonstration of the core concepts of
software factories", and says the orchestrator "reduced token spend compared to
bare-bones Claude workflow execution by around 80%" (a claim this review cannot
test).

Five components: a container that mounts only the workspace; a deterministic
Bash-command **regulator** (a `PreToolUse` hook that splits a command into
segments, unwraps wrappers, applies an ordered first-match rule list with
allow/ask/deny, denies what it cannot parse, and applies role rules by the
`agent_type` of the hook payload); a **lint hook** that runs `eslint --fix` on
every edited JavaScript file and blocks on remaining errors; a trivial
**planning workflow** of three commands (`/impact-analysis`, `/plan-execution`,
`/execute`); and a **workflow generator** that reads a plan plus a two-field JSON
sidecar (groups, dependencies), reports eleven structural faults, writes a
Workflow-tool script, and derives an append-only JSONL progress record from the
agents' schema-forced answers.

### 2.2 Verified first-hand

| Check | Result |
| --- | --- |
| `npm install` | 343 packages |
| `jest --selectProjects tooling` | 80 suites, 2,055 tests, all pass, 3.6 s |
| `jest --selectProjects project` | 1 suite, 5 tests, pass |
| `eslint .` | clean |
| `validate-plan.js plans/internationalisation.md` | exit 1, "sidecar is absent, and a run has no shape" (correct: the example is the input to `/impact-analysis`) |
| `debug.js --agent workflow-worker "jest tests/x.test.js && make test"` | segment 1 allowed, segment 2 denied by `worker-make-verification`, merged deny with the role's instruction |
| `debug.js` on a python heredoc, worker and main session | denied by `python-heredoc` at rule 24 of 32, before the catch-all |

### 2.3 Strengths

- **Orchestration moved out of inference.** The plan's execution structure is
  data in a sidecar with exactly two keys; the reader refuses any other key; the
  stages of a group are derived, never written; the generator carries the whole
  task body inside each prompt so the Workflow tool's resume cache stays honest.
  The validator is a flat array of thirteen pure checks over one object.
- **The record is derived, never authored.** No agent writes progress. Each
  answers a schema whose enums are narrowed per position (a worker can name only
  its own step; a gate only the steps sent). `record-progress.js` derives every
  JSONL line; three reading rules (dedupe on run and key, last wins, skip a torn
  line) give idempotent appends with no lock. The architecture reviewer called
  this "the strongest idea in the repo".
- **Least privilege by hook, not by prompt.** Role rules come first in the list,
  denies before allows, the catch-all last; a workflow agent never receives an
  `ask` (the factory turns ask rules off for unattended roles); a command the
  parser cannot read safely is denied with a pointer to the debugger; every
  refusal names what to run instead.
- **A refutation stage.** The final `workflow-check` agent "tries to refute the
  claim of each step"; evidence is "a file, a line and a name"; a guessed `held`
  is worse than a shown gap; each non-held claim gets a repair word and an
  inspect path for a person.
- **Gates as a stable contract.** The gate prompt carries a goal name; the gate
  definition holds the one way to run it; the makefile holds the method.
- **Measurement.** `measure-run.js` reports wall clock, model time, tool time,
  tool calls and tokens per agent, with its own caveats stated (tokens counted
  once per request; model time is a proxy).
- **Test density and shape.** Two thousand tests for four thousand lines; the
  decision seam is tested behaviourally (157 command-in, decision-out cases
  through the real entry); bin integration tests spawn the real entries in a
  temp root; no skipped or conditional tests anywhere.
- **Prose register.** The documents are short, concrete and imperative, written
  in the controlled English the settings also ask of the agent
  (`language: ASD-STE100`).

### 2.4 Findings (defects, risks, drift)

From my own read, verified, then the four reviewers' reads; severities are
against the repo's own stated threat model (reduce approval fatigue, keep agents
in role; the container is the sandbox).

1. **A stray plan with a stale premise.** `workspace/plans/factory-changes.md`
   (added in the last commit) is a task written from a "bootcamp" repository
   addressed to this one; it asserts the `python-heredoc` rule sits after the
   workflow-agent catch-all and tells the reader to move it. In the tree as
   committed the rule already answers at position 24 of 32, before the catch-all,
   for every role (verified with the debugger). The plan's premise does not
   hold, and the file is a leaked internal note in a public boilerplate.
2. **Gate goal names are a contract held in prose.** `workflow-serial-gate` and
   `workflow-final-gate` appear hard-coded in the generator, the makefile, the
   gate definition and three documents (59 occurrences in 19 files); the
   regulator checks only the `workflow-` prefix; no test joins the generator's
   constants to the makefile's targets. A rename is a silent five-file change.
3. **Deep, undocumented dependence on Claude Code internals.** Four source files
   read the private transcript layout (`journal.jsonl`, `agent-<id>.meta.json`,
   `type === 'result'`); the generated script depends on the Workflow tool's
   API and resume-cache keying; `/execute` depends on `/loop` and Cron; Claude
   Code is pinned as a devDependency at `^2.1.304`. A minor vendor release can
   break recording without breaking anything the tests exercise.
4. **Documentation drift already present.** The generator README hand-lists its
   modules and omits `streams-of.js`; CONTAINER.md gives the default image name
   as `example-claude-workflow` while the makefile says `software-factory`.
5. **Prose is load-bearing notation.** Step headings, bold file-list labels and
   backquoted numbered items are parsed by regular expression; a markdown style
   change is a notation change.
6. **The regulator ends at the makefile.** `make` is allowed, so a recipe
   launders any command; the document says so. Role least-privilege is real for
   what an agent types and absent for what a goal runs.
7. **Test-suite shape.** Twenty-five index-order assertions ratify array layout
   that the behavioural tests already describe; a snapshot of seventeen
   "absent" rule ids from another repository is tombstone content; five test
   files save and restore `process.env.CLAUDE_TRANSIENT_DIR` instead of
   injecting the seam. No test asserts that `regulate.js` is the registered
   hook (the settings file is never read), and the never-ask proof stops at
   `evaluateCommand` rather than the hook payload path.
8. **"Test first" is asserted, not evidenced.** The whole tree arrived in one
   commit; the one later change lands rule and test together. The artefacts
   cannot distinguish test-first from thorough test-after.
9. **Shared settings in a personal file.** All wiring lives in
   `settings.local.json`, which Claude Code normally git-ignores; the document
   notes the move to `settings.json` for teams. Hooks run with
   `defaultMode: acceptEdits`.
10. **Scope boundaries, stated as such because the README calls it a
    boilerplate.** No institutional memory beyond `progress.jsonl`; `--lessons`
    prints lessons but nothing consumes them into the next plan;
    `decisionForLaterSteps` dies with the run; no decision records; no plan
    lifecycle beyond "throw it away or keep as a record"; single platform and
    language; no multi-plan or multi-repo concurrency story.

Security-expert findings on the regulator's parser and role detection are in
§2.5.

### 2.5 Security read of the regulator

Severities are against the regulator's own threat model (keep unattended agents
in role, cut approval fatigue; the container is the sandbox). Each item marked
*reproduced* was re-run by this seat with the repo's own `debug.js` or by piping
a hook payload into `regulate.js`.

- **Critical, reproduced. An allowed `node` launders any denied command for
  every role.** `node` is in `common-allowed-commands` and nothing inspects its
  flags, so `node -e 'require("child_process").execSync("git push origin HEAD")'`
  resolves `allow` for a `workflow-worker` (rule 26 of 32), ahead of the
  workflow-agent catch-all. The role guarantee the document leads with ("any
  `workflow-*` agent is denied every command that no earlier rule allows") is
  defeated by one allowed binary. The same holds for `-p`, `--eval` and
  `--require`. Cure: treat `node -e` and kin like `bash -c` (parse or deny).
- **High. The transient-directory exemption trusts a shared scratch
  directory as a code-origin boundary.** `node-absolute-path` allows any script
  under `CLAUDE_TRANSIENT_DIR`, by default `/tmp/claude-transient`, which every
  agent and (outside the container) every local user can write. Academic beside
  the first finding, but independent.
- **Medium. Role integrity rests entirely on the harness tagging
  `agent_type`.** A sub-agent without a `workflow-` prefix, or an event with the
  field absent, takes the main-session branch: `ask` rules apply and the catch-all
  never fires. The command string cannot spoof the role, so prompt injection
  through command content is not the path; a missing or wrong tag is. The
  `bypassPermissions` refusal likewise fires only when the harness supplies
  `permission_mode`. No fail-closed default exists for an absent tag.
- **Medium, acknowledged in the document.** `make` is allowed and recipes are
  opaque to the hook; for the main session any goal launders anything.
- **Low.** The lint hook executes the project's ESLint configuration on edited
  files; a malicious config would run, but writing it already needs repo write.
  Path handling (rejecting `..`, absolute paths and `node_modules`) is sound.
- **What it gets right:** unparseable input denies with rewrite guidance
  (unbalanced quotes, unfollowable heredocs, here-strings, process
  substitution); command-substitution and backtick bodies and env-assignment
  values are parsed recursively, so `FOO=$(git push)` is caught; wrappers are
  unwrapped; deny beats ask beats allow; role rules first, catch-all last; no
  `ask` ever reaches a `workflow-*` agent.

### 2.6 Code-expert read

Verdict from the reviewer: changes requested, on one fail-open defect. This
seat reproduced findings 1, 2, 4 and 5.

1. **Critical, reproduced. The hook fails open when the project path contains
   a space.** Every bin guards `main()` with
   `import.meta.url === \`file://${process.argv[1]}\``; `import.meta.url` is
   percent-encoded and `argv[1]` is not. From a copy under a directory named
   `dir with space`, a worker's `sudo rm -rf /` produced no stdout and exit 0:
   "no decision", every role fence gone, silently. The normal path denies it.
   The lint hook calls `main()` unconditionally, so the two hooks are
   inconsistent. Cure: compare against `pathToFileURL(process.argv[1]).href`.
   The integration tests spawn from space-free paths, so nothing catches this.
2. **Important, reproduced. The worker's file-scoped verification accepts
   directories.** Any argument containing `/` counts as a file, so `jest tests/`
   resolves `allow` for a `workflow-worker` and the worker reads its siblings'
   half-written files, which is what the rule exists to prevent.
3. **Important. The barrier's verdict table is not implemented.** The generated
   script halts only on `green === false` with a stated blocker; a red barrier
   naming rework with `blocked: "none"`, or a barrier whose four attempts all
   answered nothing, proceeds to the check over an unproved tree. The gate
   definition's table and ORCHESTRATOR.md ("the check agent runs only after it
   is green") say otherwise.
4. **Moderate, reproduced. `git-readonly-subcommands` allows `mv` and `rm`.**
   `git rm src/a.js` resolves `allow` for `workflow-check`, whose definition says
   it "writes and repairs nothing". The dedicated worker file-move rule is
   therefore redundant.
5. **Moderate, reproduced. The check role's read-only contract is
   prompt-enforced only.** `sed -i`, `tee` and `rm -rf src` all resolve `allow`
   for `workflow-check` through the shared allow-list.
6. **Low.** Deny reasons quote the whole command chain, not the offending
   segment.

Documentation against code, from the same read: REGULATOR.md names a test file
that does not exist under that name; it calls the shared allow-list "read and
inspect tools" while the list holds `rm`, `mv`, `cp`, `chmod`, `kill`, `pkill`,
`sed`, `tee`; it calls the git subcommand list read-only while it holds `mv` and
`rm`; `/plan-execution` promises a makefile-step exception the validator does
not have; a singular `**Total**: 1 step.` is silently unchecked though both
documents say the count is compared.

Two vendor shapes the whole design rests on were flagged for the owner to
verify against Claude Code rather than assume: that the `PreToolUse` payload
carries `agent_type` for sub-agents (an absent field makes every agent "the
session"), and that the Workflow journal's cache key is prompt-derived (else
rework gate replies dedupe against the first red gate line).

### 2.7 Verdict on lights-on

A small, well-built, well-tested instrument with one strong idea executed
rigorously: push orchestration, record-keeping and command policy out of the
model and into deterministic tooling, and make the roles unable to exceed their
position. It is honest about being a boilerplate and an educational
demonstration. Its weaknesses are the ones a boilerplate inherits from a single
host and a single author: hand-maintained inventories, prose as notation, deep
vendor coupling, and no mechanism by which what one run learns changes the next.

## 3. Compare and contrast

The Practice's own exchange rule applies: compare concepts, not files; ask what
each implements implicitly that the other has named; ask what is genuinely new
substance versus a different encoding of something already understood.

### 3.1 They are different kinds of thing

Using the five layers as the ruler: lights-on is one mechanism at the
**family-and-contextual** level (a JavaScript, jest, make, Claude Code binding of
"plan, fan out, gate, check, record") with a thin general-layer idea inside it
(least-privilege roles, derived records, refutation). It has no accumulated
layer beyond a per-plan progress file, and no loop. The Practice is a general
layer, two family bindings in progress, many contextual instances, a very large
accumulated layer, and a loop that is its central mechanism. In the lineage's
own vocabulary lights-on sits at the **POC adaptation level** (inline agents,
simplified gates, no ADR infrastructure, no learning loop), but with
production-grade engineering of its one mechanism; the Practice is at the
Production level and aims at maturity Level 3 or 4 (self-correcting, evolving).

Put differently: lights-on answers "how do I run one decomposed change through
parallel agents cheaply and safely?" The Practice answers "how does a repository
full of agents and people keep getting better at deciding, building, reviewing
and learning, across vendors and across repositories, for years?" Neither
question is the other's.

### 3.2 Same concept, different names

| Concept | lights-on | The Practice |
| --- | --- | --- |
| Least-privilege command policy enforced below the prompt | the regulator: segment parsing, wrappers unwrapped, role rules by `agent_type`, deny on unparseable, never `ask` an unattended agent | `.agent/hooks/policy.json` dispatched to Bash, Edit and Write; substring and regex patterns with a cited rule and a reappraisal line; content guard on doctrine-violating edits; `hook-policy-substring-discipline`; `unattended-seats-never-prompt` |
| Gates as a fixed named contract | two make goals; the gate agent runs the name it is given | the family manifest's `check` skeleton and gate vocabulary (PDR-008); "the hooks are the gates"; one CI fan-in per family |
| Records derived, not authored | agents answer schemas; one tool derives the JSONL | `validators-must-recompute-not-just-record`; family conformance recomputed from the tree; PDR-119 memory as events with renderers |
| A last stage that tries to refute | `workflow-check` with held / notHeld / notProvable and file-line-name evidence | the reviewer system (code-expert as gateway; specialists by change profile); `verify-dont-trust`; test-expert's "describe a state, never audit an implementation" |
| Closed shape, extension by agreement | the two-field sidecar; "say so in the plan and stop" | `closed-shape-design-optionality`; plan nodes with schema'd frontmatter; `new-rule-vs-pdr-clause` |
| No sleeping a turn away | `long-sleep` and `bare-wait-loop` denied | `use-monitor-for-event-driven-wake`; cold pause after an hour idle |
| Measuring the cost of agent work | `measure-run.js` per agent | `arc-metrics`, `context-cost`, the review-cost gate, `fleet-design-review-before-expensive-fleets` |
| Controlled, plain prose | ASD-STE100 output style; terse imperative docs | `no-hedging-vocabulary`; `records-are-technical-not-emotional`; `editorial-tone` for outward copy |
| TDD as the way of working | "write the failing test first" in the worker and CONTRIBUTING | `tdd-as-design.md`, `testing-strategy.md`, `tdd-for-refactoring`, atomic landing of test and code |
| Agent definitions are code with tests | rule order asserted by test; agent definitions read at session start | sub-agent templates composed from components and validated; skill adapters generated and checked; "agent files are first-class infrastructure" |

### 3.3 Where they diverge, and why

- **Portability.** Lights-on is Claude Code only and reaches into its private
  transcript layout. The Practice is canonical-first across five vendors, with
  entry points named per vendor so every agent lands on one substrate, and it
  treats vendor coupling as phenotype to be kept thin.
- **Memory and learning.** Lights-on has `--lessons` and nothing that consumes
  it. The Practice is built around consumption: capture, distil, graduate,
  enforce, with fitness governors, two speeds, predictions and falsifiers, and a
  conservation doctrine that forbids trimming a lesson to fit a budget.
- **Governance records.** Lights-on has none; its design rationale lives in its
  READMEs. The Practice has 143 portable decision records and 225 host ones, each
  with a context, a decision, consequences and, increasingly, an amendment log
  and a falsifier.
- **People in the loop.** Lights-on's planning commands interview the user
  through `AskUserQuestion` rounds and stop twice for approval; its execution is
  then unattended. The Practice distinguishes seats by attendance
  (`unattended-seats-never-prompt`), routes questions to a Director, and
  presents verdicts, never menus; it also records the standing teaching that the
  what, why and why-now are settled in conversation with the owner before any
  structure is built.
- **Enforcement depth versus breadth.** Lights-on's regulator is deeper on one
  surface: it parses Bash properly, unwraps wrappers, and applies role rules.
  Yet its role guarantee is defeated by one allowed interpreter (`node -e`, §2.5)
  and its hook fails open on a path with a space (§2.6), so its depth is real
  and its claim is overstated. The Practice's hook guard is shallower on Bash
  (substring and regex, no sub-agent role; `hook-policy-substring-discipline`
  acknowledges the trade, and it does not block inline interpreter evaluation
  either) but far broader: it guards file content, and the validators and gates
  behind it cover portability, fitness, conformance, links, cited paths, secrets,
  review cost and plan gates. Both estates would be improved by the other's
  strength on this axis.
- **Orchestration.** Lights-on generates the Workflow script deterministically
  from a plan and refuses hand-written scripts. The Practice orchestrates by
  seats, skills and plans, with a Director holding the map; its `agent-tools`
  has a `workflow-build` module (a bundler and output contract for workflow
  harnesses) and schema-forced corpus-analysis agents, but no plan-to-workflow
  generator with a closed notation.
- **Cost posture.** Both care about tokens. Lights-on cuts them by moving the
  mechanical part of orchestration out of inference. The Practice cuts them by
  moving enforcement out of attention (validators, hooks, reviewers), while
  accepting that its reading cost is high and recording when it overruns.
- **Documentation posture.** Lights-on forbids comments outside JSDoc and keeps
  documents short; its inventories are hand-maintained and have already drifted.
  The Practice requires TSDoc, generates its indexes and adapters, validates its
  links and cited paths, and governs every file's size with fitness fields;
  its documents are long and the estate knows it.
- **What "done" means.** In lights-on a step is complete when its worker
  answered done, its gate was green and no later check said notHeld; a run is a
  run. In the Practice a landing is "a specific invariant achieved in code", a
  pull request is done when CI, Claude Approvals and mergeability all hold, and
  a session also owes its lessons to the substrate.

### 3.4 What each could take from the other

For OCE, judged by its own three-part bar (validated by real work, prevents a
recurring mistake, stable):

1. **Agents answer schemas; a tool derives the record.** The Practice already
   holds the principle (`validators-must-recompute-not-just-record`, PDR-119)
   and applies it to conformance and memory; lights-on applies it to *run
   state*, with enum-narrowed answer schemas built per position. A plan node's
   execution record derived from agent answers rather than from agent-written
   status lines would remove a class of "the handoff said done" failures the
   napkin keeps recording.
2. **Role-aware command policy.** The regulator reads `agent_type` and gives
   workers, gates and checkers different rule sets, with `ask` turned off for
   unattended roles by construction. OCE's dispatcher guards every Bash call the
   same way regardless of which sub-agent issues it; the Implementer and
   reviewer roles are prime candidates for role-scoped denies.
3. **A proper Bash parser in the hook.** Segment splitting with wrapper
   unwrapping is what makes a deny on `git push --force` also catch
   `timeout 60 git push --force`; OCE's own rule records that its substring
   patterns miss some forms (a leased push that passed the guard, 2026-09-28).
4. **A refute-first check as a schema-forced final stage** in any fan-out the
   estate runs, with the held / notHeld / notProvable vocabulary and the
   file-line-name evidence standard. The reviewers already do this in prose; a
   schema makes the output machine-readable and the gaps visible.
5. **Prose register.** The lights-on documents say what to do in short
   declaratives and nothing else. The Practice's `directive-file-context-budget`
   rule exists because its own surfaces are expensive to load; the family of
   lights-on documents is a worked example of the target register.

For lights-on, were it to become a practice rather than a boilerplate: a memory
surface that the next `/plan-execution` reads; a place for the decisions a run
makes (`decisionForLaterSteps`) to survive the run; a generator for the
hand-maintained inventories; a test that joins the gate names across the files
that carry them; canonical content with thin adapters if a second vendor is
ever wanted; and some fitness governor, since a boilerplate that is also a
teaching document will otherwise grow until it stops teaching.

### 3.5 One sentence each

Lights-on is a precise, deterministic instrument for running one decomposed
change through parallel Claude Code agents without wasting inference on the
mechanics or trusting the agents to stay in role. The Practice in OCE is a
portable, self-enforcing, self-teaching constitution for how many agents and a
few people plan, decide, build, review, deliver and learn across repositories
and vendors, now being extracted into a single installable entity. The first is
a very good tool; the second is an operating system for engineering with agents,
of which such a tool would be one family-layer binding.

## 4. Session record

- Landing: no code landing; a records-class landing of one napkin entry on the
  designated branch `ccr-ba173ef1-gscfgg` (the branch the harness assigned to
  this session), under claim `378cffb2` on `.agent/memory/active/napkin.md`,
  as three commits (`0d2373aa9`, `3d4ebdc59`, `c5e8f493b`), each committed under the Claude
  cloud `HUSKY=0` ruling with its substitute set run first (branch guard,
  commit-message check, major-version guard, gitleaks over the outgoing range;
  markdownlint and the docs validators also green), and pushed. At the time of
  writing the branch had no pull request, so CI had not run on it and the owner
  had not asked for one; the owner asked for this pull request later that day.
- Environment defect met on the way: a plain push ran the pre-push hook, whose
  review-cost gate calls `gh repo view --json`, and GitHub answered HTTP 403
  ("GraphQL is not available from Claude Code sessions"). Recorded in the
  napkin for the provisioning-defects register; the cure is a REST read in the
  tool, not a narrower gate.
- Napkin lessons captured this session: `pnpm` 12.4.2 in the cloud image rejects
  `-s` and swallows `--platform` when a package script is called with flags, so
  `agent-tools` CLIs are run through `node agent-tools/dist/src/bin/agent-tools.js …`
  or with `--` before the flags; the harness resets the working directory
  between calls in a two-checkout session, which once sent `npm install` to the
  lights-on root (no `package.json` there: "up to date", an empty lockfile
  written, nothing installed) before the run in `workspace/` installed 343
  packages, so every path in a multi-repo session is absolute and `git status`
  is read on every checkout touched before it is called untouched (the stray
  lockfile was found and moved to the scratchpad at the close; a first napkin line blamed the
  `--omit=optional` flag and a correction line beneath it names the real cause).
- This document was delivered to the owner in the session from the scratchpad
  and homed here, in `.agent/research/`, at the owner's word of the same day
  (fresh synthesis, not owner-vetted as reference; the routing rule in
  `orientation.md`). Its findings on lights-on are a review of a foreign
  repository at its 21 October 2026 head and bind nothing in this estate; its
  claims about the Practice cite the surfaces they were read from.

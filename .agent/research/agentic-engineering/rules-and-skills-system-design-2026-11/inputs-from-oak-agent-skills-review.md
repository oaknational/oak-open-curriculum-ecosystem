# Inputs from the oak-agent-skills review

On 16 November 2026 a read-only review compared this estate's skills with
[oaknational/oak-agent-skills](https://github.com/oaknational/oak-agent-skills) at `aa4f22c`: a
package of six shared skills with a tool that syncs and validates them. The review is
[`oak-agent-skills-review-2026-11-16.md`](../../../reports/oak-agent-skills-review-2026-11-16.md).
The owner asked that what the comparison can improve be added to this design effort.

This note holds what survives that comparison: four candidates for the parts of
[`design.md`](design.md) not yet written, one question, and one consideration that applies
only if this repository subscribes to that package. It changes nothing in parts 1 to 3, in
[`open-items.md`](open-items.md) or in any decision record. A candidate is an input for the
seat that writes the later parts to take or decline. No rule or skill content is changed, no
generator is touched, and nothing here sets when that work happens.

Each line is marked **read** (in this repository or in oak-agent-skills at that commit),
**measured** (computed from files), **documented** (the vendor's page, read on
2026-11-16) or **inference** (this seat's reasoning, with what would overturn it). Where a
candidate would be overturned by something seen in a running session, that observation is
not among O1 to O8 in `open-items.md`; adding it to the spike is the owner's.

## What carries over from a package of six skills, and what does not

The two systems differ in scale: six skills and no rules, against 78 skills, 124 rules and
31 sub-agents. A practice that works there is evidence here only where its mechanism does
not depend on that scale.

| Practice in oak-agent-skills | Carries over? | Why |
| --- | --- | --- |
| Checks on one file or one chain of files | Yes | The mechanism does not depend on how many skills there are. Candidates 1, 2 and 4 come from it |
| A rule that a skill links only to its own files | No | Its reason is distribution: a synced skill arrives with its own files and nothing else. Here bodies link across the repository by design |
| A total budget for descriptions, 8,000 characters counted twice | The idea, already decided here as B5. The number does not | Measured: its six descriptions total 1,965 characters, so its budget has never bound. It shows a budget as a build check and nothing about listing 87 skills inside one |
| Descriptions of 273 to 379 characters, what a skill does and then when to use it | In part | Measured: all six are over B4's 256. With six skills there are few near neighbours to route away from; here the routing clauses exist because there are many. See the question below |
| Fewer, broader skills, to keep the listing short and stop the wrong skill firing | As an assertion only | Read in its guide; not measured there. The measured failure here is a different one: no trial session selected a skill at all |
| Short bodies with depth in `references/` | Already decided here, more tightly, as B6 | Measured: its largest body is 12,336 characters, over B6 |

An earlier comparison, made in the session that wrote this note, made two statements that do
not hold. It measured this estate's descriptions against 8,000 characters; this repository
sets the listing at 3 % of the window (T4), so 8,000 is the fallback. It said this estate has
no skill evals; it has a runner, 23 eval suites and 14 trigger suites, and oak-agent-skills
has none.

## Four candidates

### 1. Part 5: a link in a copied body still resolves

- **Candidate.** The build refuses a projected procedure body whose relative links do not
  resolve from where the projection is written.
- **Behind it.** Read: links in canonical files are already checked in CI, and adapters are
  outside that check. D2 has the adapter carry the body, copied by the generator. A canonical
  body and its adapter sit at different depths, so a relative link that resolves in one does
  not resolve in the other unless the generator rewrites it. Read: oak-agent-skills checks
  each skill's links where the skill is installed.
- **Overturned if** part 4's projection rewrites links as it copies, and a test of the
  generator shows it.

### 2. Parts 4 and 5: nothing in a procedure body is executed before the model reads it

- **Candidate.** One of two forms, for part 5 to choose. The build refuses a body holding
  `` !`command` `` at the start of a line or after a space, or a code block opened with a
  fence and `!`. Or the repository sets `disableSkillShellExecution`, and the build checks
  that it is set.
- **Behind it.** Documented: "The `` !`<command>` `` syntax runs shell commands before the
  skill content is sent to Claude". Each command is checked against the permission rules and
  does not prompt. The setting replaces each with a notice, for skills from project sources.
  Read: oak-agent-skills refuses both forms in its validator.
- **Where it applies.** Inference: today's adapters are one-line pointers, and the canonical
  body is opened as an ordinary file, which is not preprocessed. Under D2 the body is the
  skill the platform invokes.
- **Overturned if** a session shows a copied body is not preprocessed.

### 3. Part 4: a procedure a person starts by name need not be listed

This one does not come from oak-agent-skills, whose schema refuses the field. It comes from
reading the vendor's page for the comparison.

- **Candidate.** A procedure that is started only by a person typing its name is projected
  to Claude Code with `disable-model-invocation: true`.
- **Behind it.** Documented: for such a skill, "Description not in context, full skill loads
  when invoked". Part 3 names shortening and placement as the ways down from 42,370
  characters; this is a third, on Claude Code.
- **Limits.** It changes the procedure contract the owner decided, which lists every name
  and description at the start of a session, so taking it is the owner's and not the seat's.
  B5 is set against the Codex listing, which this does not change. Documented: Claude "can
  invoke: not on its own", and the call is blocked unless the person's message carries the
  name, so it does not fit a procedure that another procedure runs as a step. It is not
  preloaded into a sub-agent.
- **Overturned if** a session shows such a skill still drawing on the listing, or a count
  finds too few procedures started only by name to matter.

### 4. Part 5: the `AGENTS.md` chain against its limit

- **Candidate.** The build measures the `AGENTS.md` files from the root to each directory
  that holds one, together, against B7.
- **Behind it.** Read: the one size check in this repository's build measures the rules
  index, and not `AGENTS.md` (the audit, section 5). Read: oak-agent-skills sums each chain
  and fails over 32 KiB (`src/lib/agents-md.ts`), which is T8 at its stricter reading.
- **Overturned if** part 4 delivers no instruction text through `AGENTS.md`.

## One question, for part 6

The rule `skill-naming-and-description-quality` has a description carry three things:
discovery, use-when and do-not-use-when clauses, and examples of right and wrong use. B4 is
256 characters. Read together, the two leave the examples and most of the routing clauses
nowhere to sit in a description. The procedure contract allows a `when_to_use`, which the
platform appends to the description and counts with it (T2). Where the rule's three targets
sit under B4 is for part 6's method of sorting content to say. If the rule is amended, that
is the owner's.

## If this repository subscribes to oak-agent-skills

That package is written to reach every Oak repository. Nothing here assumes this repository
will take it, and the choice is the owner's and outside this node. If it does, three facts
meet this design.

- **Its check refuses every skill it did not write.** Read: `oak-skills check` exits 4 when
  `.agents/skills/` or `.claude/skills/` holds an entry its own sync did not write
  (`src/lib/status.ts`), and its guide says a repository's own skills are proposed to the
  package as a bundle. Measured: this repository has 87 entries in each directory. A bundle
  is held to the same 8,000-character budget, which this estate's descriptions exceed
  several times over. So the two cannot share those directories as each is built today.
- **Its skills would be in the listing B5 bounds.** Measured: the `base` profile is five
  skills, 1,654 characters of names and descriptions; `frontend` adds one and 403. By this
  repository's jurisdiction rule they would be Vendor-class and not shortened with the rest.
  That adds to the open question on the nine installed skills, and to S1.
- **Both use the `oak-` prefix, and some of its skills meet procedures here.** Measured: no
  name is the same today. Three of its six answer a request a procedure here answers:
  `oak-security-review` and `oak-security`, `oak-accessibility-review` and
  `oak-accessibility`, `oak-pr-create` and `oak-pr-lifecycle`. A fourth differs in what it
  does: `oak-ticket-start` creates a branch in the checkout it is run in, where this estate
  cuts a worktree for a lane (`oak-set-up-worktree-lane`). The prefix here is a flag pinned
  in the root scripts; the ratified node `adapter-prefix-configuration` is to make it
  resolve from one point.

The first fact is also reported to that repository's maintainers in the review.

## Left out, with the reason

- **The specification's limits as a build check, and `skills-ref`.** Already owned: the
  2026-08-09 amendment in `skills-estate-organisation` has the validators run
  `skills-ref validate`, and it is not built. The delivery node's sibling-plans note records
  where that meets part 5.
- **Trigger suites and assertions on tool calls.** Already owned: the eval runner has
  `tool_used` graders with a minimum and maximum
  (`agent-tools/src/skill-evals/graders.ts`), and the description rule names trigger suites
  as the measure.
- **`owner` and `updated` on every unit.** A date in a unit is history by another route,
  against the ruling of 2026-11-12, and the commit records when a unit changed.
- **Profiles.** A choice made when skills are distributed across repositories. Inside one
  repository, place does that work.
- **A declared tool in `compatibility`, a closed set of frontmatter fields, and a static
  scanner.** Each is small or already covered here, and none changes a decision in this
  design.

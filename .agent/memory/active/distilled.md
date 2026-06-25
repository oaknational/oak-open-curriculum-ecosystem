---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested processing through `oak-consolidate-docs`.
  The active file carries the conservation role, graduation pointers, and held
  validation entries. Falsifiability: if future napkin rotations add high-signal
  learning that has no stable permanent home, preserve it first and revise the
  envelope by substance rather than trimming the lesson.
---

# Distilled Cross-Session Lessons

Refined cross-session lessons, conserved between napkin rotation and graduation to
a permanent home. Each entry earns its place by being specific, actionable,
non-obvious, and terse.

Entries below are staged cross-session lessons whose substance is conserved but
whose final home is not yet fixed (a graduation candidate surfaced to the owner, or
a single-instance technique awaiting a second instance). New napkin rotations append
below.

## Parsing interleaved/parallel tool output: key by a stable prefix, cross-check sums

When parsing stateful logs from a parallel/interleaved runner (e.g. `turbo` running
tasks concurrently, with CR line-endings), "nearest-header" file attribution is unsafe:
interleaving and CR endings can misattribute lines, producing phantom aggregates (a
"307 warnings in one file" that was really a misparse — the workspace's true total was
77). Cure: key the stateful parse by the **stable workspace/task prefix** the runner
emits, and **cross-check** per-file sums against the gate's authoritative per-workspace
totals as an independent checksum. Single-instance debugging tactic (2026-06-19, Siren
mends Rudder); staged for a second instance to confirm the general shape before
graduating to a pattern.
Sibling: [`tool-output-framing-bias`](patterns/tool-output-framing-bias.md).

## An indiscriminate-rule warning count is a set of cause-classes, not N independent problems

When a broad/indiscriminate lint or analysis rule reports a large count (e.g. ~1000
no-throw warnings), the count is NOT N independent problems — it is a handful of
cause-classes (code-type × cause × meta-cause). Lead with the holistic landscape, not
piecemeal per-site next-steps; distrust per-site classifications (they proved unreliable —
mislabels happen). The remediation reshape that follows is investigation-first (survey the
cause-classes) rather than convert-all. Single-instance lesson (2026-06-19, Siren mends
Rudder, no-throw remediation; the owner had to drag the landscape out before the reshape);
staged for a second instance before graduating to a pattern. Sibling:
[`tool-output-framing-bias`](patterns/tool-output-framing-bias.md) and the parsing-interleaved
entry above (both: the shape of the aggregate misleads).

## Preserve the value-rationale (why-it-matters) at handoff, not only the what and how

A plan's user stories carry *why it matters* — the most easily lost and most valuable layer.
At completion and handoff, analyse each served story's disposition and conserve its *why*
into the permanent home (skill description/body, ADR/PDR Context, README purpose lines), not
only the *what* (acceptance met) and *how* (mechanism). Partially homed in PDR-011 (grounded
execution knowledge) and the consolidate/handoff value-rationale step; this is the sharper
standalone formulation. Source: prior-session owner correction, promoted from the per-user
buffer.

## A committed/stated mechanism is not a running mechanism — actuate in the same breath

"I'll watch X" / "I'll run the gate" / "the loop will close" arms nothing; a documented intent is
inert until actuated. When you commit to running a mechanism, arm the actual mechanism in the
same action — never let the STATEMENT stand in for the running process, never defer actuation to
a future turn. Source 2026-06-21 (Cutter). Siblings:
[[feedback_run_the_thing_dont_flag_the_gap]], [[feedback_proof_vs_delivery_trace_bridge]].

## A policy/content hook firing while you author a design artefact names a concept, not a token

When a content/policy hook fires while authoring a schema, contract, or doctrine, the matched
token is a coordinate — before judging it an over-match, ask whether the artefact embodies the
policed concept ANYWHERE, not only at the firing point; the cure is often structural, not a
lexical patch. Relatedly, a gate that blocks a commit may be telling you the blocked thing is
itself the defect — understand the block before bypassing; the clean fix can be removing what is
blocked, not skipping the gate. Source 2026-06-21/22 (Cutter, Petrel). Sibling:
[[feedback_hook_failures_are_questions]].

## To author a host-free portable artefact, choose an author that has never seen the host

The strongest guard for an artefact whose value depends on containing NO host concepts is not
reviewing the output for leak — it is a Practice-naive author that CANNOT leak what it has never
seen (the defect is dissolved at source). Caveat: a sub-agent launched from inside the repo
auto-loads CLAUDE.md → all Practice rules and is contaminated before it writes — the clean room
needs no repo context (a separate chat/checkout). Candidate pattern, one instance (2026-06-22
Orbit, the working-with-agentic-ai primer). Sibling:
[[feedback_ask_would_this_be_simpler_if_the_system_changed]].

## Evaluation discipline: judge a capability by its KIND's criterion; doubt is a possession too

When evaluating a capability, first NAME ITS KIND (tool you invoke / tripwire that must auto-fire
/ rule / reference) and apply that kind's success criterion — judging an invocable tool by "does
it fire unprompted" (a tripwire's bar) is a category error. And identity-capture cuts both ways:
guard against over-defending a position because it is YOURS — equally when you built the thing
and when you are its loudest critic, name the falsifier out loud either way. Source 2026-06-22
(Orbit, evaluating oak-reason). Sibling: [[feedback_ground_convenient_claims]].

## When external research flatters the repo, the value is in the divergence

When authoritative external research agrees with what you built, the agreement is the LEAST
informative output — it is convenient-claim comfort. Spend the effort on the divergence: where
the Practice is genuinely ahead, and (more important) the gaps the research names that the repo
has not closed. State the gaps as plainly as the wins. Source 2026-06-21 (Cutter, DORA-2025
comparison). Sibling: [[feedback_ground_convenient_claims]].

## Reversing a decision recorded in several places needs a whole-document sweep

When you drop or reverse a decision a document records in multiple places, editing only the
primary section leaves stale references elsewhere that now contradict the update — a
self-contradicting artefact. After reversing a recorded decision, grep the WHOLE document for the
old framing/term before treating the reversal as landed (an under-actuation facet — an edit that
stops short of completeness). Source 2026-06-22 (Orbit).
Sibling: [[no-tombstones-for-removed-ideas]].

## A live peer's agent_name assigned to your fresh session is a collision to surface, not adopt

Identity is name+UUID, but the team's coordination surfaces (comms-seen file, claims registry,
statusline wing-detection) key on agent_name, NOT the UUID — so two live sessions sharing a name
corrupt the seen-cursor, claim attribution, and wing-detection. When an owner-assigned name
matches a LIVE registry/comms identity, STOP and surface before registering; take a distinct
identity. Candidate rotating-cast name-collision doctrine, one instance (2026-06-21 Aardvark).
Sibling: [[feedback_agent_identity_name_plus_uuid]].

## Operational gotchas: conflict resolution, merge headers, harness shell, new validators

- Resolve a take-ours merge conflict by a FORWARD write (`git show HEAD:<path> > <path>` or
  Write), never `git checkout --ours` (blocked by the worktree-destruction guard, correctly); a
  custom `Merge origin/...` header fails commitlint (only `Merge branch …` / `… into …` are
  auto-ignored) — use a conventional `chore:` header. Verify a conflict's content subsumption
  before resolving — "take ours" may lose nothing if local already migrated the other side.
- Harness shell: cwd persists between Bash calls (stay at repo root); zsh does not expand a glob
  held in a variable (inline it); long `--body` strings with em-dashes hit exit 2 (use
  `--body-file`).
- A new `agent-tools/src/validators/<x>.ts` MUST be registered as a knip entry point in
  `knip.config.ts` (and avoid unused exported types) or full-tree knip goes RED and blocks
  repo-wide commits. Source 2026-06-21/22 (Oyster, Cosmos, Cutter). Siblings:
  [[hook-policy-substring-discipline]], the oak-complex-merge skill.
- **Bash/grep tool output of source can be substring-filtered; Read is not.** Several greps returned
  bodies with tokens collapsed (e.g. `user-search`→`n`, `examBoard`); the Read tool rendered the same
  files faithfully. When grep/Bash output of source looks mangled or suspiciously masked, switch to Read
  for the load-bearing read — do not reason over the filtered text. Source 2026-06-23 (Blazar).

## A whole-tree gate failing on files you didn't touch (and your own recent commits passed) ≠ your bug

When a whole-tree gate (type-check, lint, full `pnpm check`) fails on a surface you never changed AND
your own recent commits passed that exact gate minutes earlier, read active-claims + comms for a
concurrent agent BEFORE assuming your change broke it — a peer's in-flight feature can leave the shared
working tree transiently red. The cure is to coordinate (post the exact failing locations to the owning
agent) and wait event-driven for their atomic cycle to heal the tree, NOT to patch their in-flight work
(collision). Source 2026-06-23 (Blazar). Multi-developer/shared-checkout territory (F-83). Sibling:
[[respect-active-agent-claims]].

## State the positive understanding the reader needs, not your own correction path

A recurring authoring failure: your *process* leaks into the *artefact*. After being corrected, you write
the correction path into the copy — a tombstone ("isn't X, doesn't need to be X"), over-explaining that
reuses your own contemplative imagery, narrating a journey to a reader who never held the misconception.
State the positive understanding the reader actually needs; the reader did not take your path and does not
need it retraced. Fluency is the tell — a tidy synthesis arriving smoothly is the tripwire to re-ground,
not confirmation. Source 2026-06-22 (Skipper, the over-unification/tombstone window). Siblings:
[[no-tombstones-for-removed-ideas]], the per-user [[feedback_graphs_as_method_not_one_artefact]].

## Under context pressure, offload the breadth; keep the design verdict and the loss-scan yourself

A deep-context session can keep landing high-value work by routing the heavy reading and drafting to
fresh-context workflows and parallel sub-agents, while holding only the two non-offloadable possessions:
the **design verdict** and the **first-hand loss-scan** (only the context holder can detect what durable
substance is not yet homed — a fresh reader can verify a claim but cannot detect loss). Everything else —
reading source, drafting prose, mechanical edits, gate runs — offloads cleanly to a fresh seat at full
fidelity, *provided every returned output is critically assessed first-hand* (this session that screen
caught a false "it's already tracked" claim, a "fix the YAML" false alarm, a cross-artefact pointer
mismatch between two parallel agents that could not share mid-run state, and a readiness gate that needed
RUNNING not believing). Caveat: a deep lane needing security-sensitive refactors still needs a genuinely
fresh seat — re-spinning a spent session does NOT reset its budget; only breadth-work parallelises.
Candidate pattern, one strong instance (2026-06-25, Thyme lifts Compost, worktree-pilot team closeout).
Siblings: [[feedback_context_loss_probe_is_first_hand_only]], [[feedback_first_hand_means_me_not_subagents]],
[[feedback_opus_team_quota_ceiling]], [[verify-dont-trust]].

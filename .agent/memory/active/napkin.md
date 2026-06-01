---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-31 — Foamy docs-consolidation rotation

The prior archive-only source-buffer replacement was invalid because active
napkin content was hidden before the owner could trust the item-level
disposition proof. This rotation happens after the restored content was
re-checked against the source-buffer ledger, the active `distilled.md` entries
were separately dispositioned, and the remaining candidate doctrine was routed
to `pending-graduations.md` with explicit owner gates.

Verbatim source is preserved in the active-memory archive as
`napkin-2026-05-31-foamy-docs-consolidation.md`. Disposition evidence lives in:

- the Eclipsed source-buffer ledger for the restored source-item inventory;
- the Open Lofting / Foamy curator ledger for the repaired pass and continuation
  batches;
- `pending-graduations.md` for owner-gated doctrine that should not be promoted
  without a trigger.

Do not treat this archive as completion by itself. The completion proof is the
item disposition ledger plus the active homes above; the archive is only the
verbatim source record.

## Session: 2026-05-31 — Foamy self-correction note

During this pass I accidentally searched a pattern containing backticks without
shell-quoting it, so `zsh` attempted command substitutions for the dates inside
the pattern and printed `command not found` noise. No files changed. Behaviour
change: quote any `rg` pattern that contains backticks or shell-significant
characters before running it.

## Session: 2026-05-31 — Blooming longitudinal napkin review

### Mistakes Made

- While opening the longitudinal-review claim I passed
  `.agent/state/collaboration/comms/*.json` unquoted. `zsh` expanded it into the
  full comms corpus, the `claims open` helper rejected the argument list, and no
  claim was written. Behaviour change: quote every claim `--area-pattern` that
  contains `*`, `?`, brackets, backticks, or other shell-significant characters;
  globs are claim metadata, not shell input.
- During final commit, I trusted `commit-queue --help` when it omitted the
  required `--id` option for `enqueue`; the canonical skill was correct and the
  helper rejected the first enqueue. Behaviour change: for commit-queue identity
  fields, trust the canonical commit skill and pass the preflight UUID even when
  short help output is stale.

### Patterns to Remember

- When the owner asks for deep `session-handoff` plus deep `consolidate-docs`
  but explicitly says "no `pnpm check`, no commit", honour that as the validation
  and lifecycle boundary. Use session-completion consolidation, run narrower
  relevant checks such as fitness/markdown/format only if useful, and name the
  aggregate check as intentionally skipped rather than treating the workflow as
  blocked.

## Session: 2026-05-31 — Foamy longitudinal brief handoff

### What Was Done

- Authored `codex-napkin-longitudinal-review.brief.md` for the next Codex
  session to review the active napkin plus the recomputed last twenty archived
  napkins, with explicit missed-content and long-timescale pattern questions.
- Light handoff routes the next session to that brief without claiming the
  longitudinal review itself has run.

### Patterns to Remember

- When the owner asks for a future dedicated curation pass, it is valid to land
  a precise next-session brief and mark deep consolidation `due` to that route,
  rather than expanding a light handoff into the curation work itself.

### Surprise

- **Expected**: `comms append --tag heartbeat --body ...` would work for a
  singleton-check broadcast.
- **Actual**: heartbeat-tagged events reject free-form `--body` and require typed
  heartbeat state args; a `behaviour-note` tag worked for the free-form notice.
- **Why expectation failed**: I treated `heartbeat` as a generic urgency tag
  instead of a typed event shape.
- **Behaviour change**: use `behaviour-note` for free-form coordination notices,
  or provide the heartbeat-specific typed args when the event is a real heartbeat.
- **Source plane**: `operational`

## Session: 2026-05-31 — EEF plan old-list correction

### Patterns to Remember

- When the owner says an old implementation is wrong, do not frame the next plan
  as preserving compatibility with it. The old implementation is evidence only
  for what to delete. Any overlap with old outputs is acceptable only as an
  incidental result independently derived from the new ratified value, surface,
  and architecture; the old code must not be kept, repaired, wrapped, consulted,
  or used as the source of expected behaviour.
- For the EEF lane, do not sell EEF as another content retrieval path. Oak API
  tools fetch curriculum data and Oak search finds relevant content; EEF's
  distinctive value is evidence-calibrated lesson adaptation that preserves
  professional judgement, uncertainty, caveats, strength, cost, impact, and
  partial-coverage honesty across the full supported subject/key-stage/topic
  estate.
- For EEF teacher-facing output, make weak, partial, or absent evidence explicit
  whenever it occurs. The teacher is the expert; the assistant provides options,
  evidence context, and honest limits, then gets out of the way. Do not hide
  weak evidence as a hidden ordering signal or imply the assistant decides what the
  teacher should adopt.
- For EEF teacher-facing and model-facing language, use "options and trade-offs"
  rather than teacher-replacing selection language. Do not imply a preferred
  action, a single chosen option, or that the assistant decides what the teacher
  should adopt or change.

## Session: 2026-05-31 — EEF graph pre-decision research (Vining Ripening Fern / `870a40`)

### Patterns to Remember

- **Research/pre-decision deliverables NAME the decisions and surface the
  considerations; they do not make or steer them.** I authored the EEF graph
  pre-decision research report well, then framed §7 as a "Recommended decision
  agenda" with `Criterion: prefer X / minimise Y / floor of Z / optimise W
  first` — which reads as making the call. Owner correction: "this is about
  research, not decision making." Reframed to "decisions owned by D1/D3/D4" +
  `Considerations the research surfaces:` (neutral trade-offs + evidence, choice
  left to the owning deliverable). The drift is subtle because the brief itself
  asked for "recommendation criteria" and a "Recommended D3/D4 Decision Agenda" —
  the test is not the section title but whether each line picks an answer or lays
  out the factors. Restating a *plan-settled* constraint is fine if attributed to
  the plan; asserting a *new* preference is the over-reach.
- Prior-session framing trap (carried in from the start-right handoff): the brief
  IS the research instruction set; the deliverable is to DO the research and make
  the *report* discoverable — not to make the brief discoverable. Did the actual
  code reading this time (four surfaces, file/line-grounded) rather than fanning
  out subagents to re-summarise docs.

### Surprise / tool note

- **Expected**: a large `Write` of a multi-section markdown report would land
  exactly the `content` body.
- **Actual**: the literal closing tags `</content>` and `</invoke>` were appended
  as the last two lines of the file; caught only by `markdownlint` MD032.
- **Behaviour change**: after a large `Write`, check the file tail (or lint it)
  for stray tool-call closing tags before treating it as done.

### Collision note

- `napkin.md` carried an active Codex claim (Estuarine Rolling Harbour, intent
  "Record EEF D1 value-contract learning"). Appended this entry additively below
  their "EEF plan old-list correction" block without disturbing it.

## Session: 2026-05-31 — EEF invocation policy

### Patterns to Remember

- EEF invocation is both explicit and proactive: use it when the teacher asks
  for evidence context, and also when the assistant is already adapting,
  combining, or framing Oak material pedagogically. Do not invoke EEF for
  curriculum retrieval alone.
- Whenever EEF is invoked, briefly say what prompted it. Use a short
  calling-agent pattern such as "EEF because: [pedagogical choice]." The calling
  agent can vary the output as needed; the invariant is short, clear rationale,
  not exact text.
- D3 MCP surface direction: practical-small first (lesson-context evidence,
  strand inspection, corpus metadata), full graph-forward collection in a
  follow-on plan. Keep the agent-facing MCP surface separate from underlying
  graph tools; prefer one function-dispatched MCP tool (`name -> function ->
  options`) unless D3 verification shows namespaced top-level tools are better.
- For EEF D3 workflows, use the accepted default order: understand teacher task,
  retrieve Oak curriculum/search context, invoke EEF for evidence requests or
  pedagogical adaptation/framing, inspect strands only when extra caveat/detail is
  needed, then return teacher-facing options/trade-offs/caveats plus a short EEF
  rationale. Target MCP primitives by intention: tools are model-controlled
  action dispatch, resources/templates are app-driven context, prompts are
  user-controlled workflow templates, and elicitation/sampling are not defaults
  unless separately ratified and host-supported.
- Deterministic MCP tools do not semantically interpret free-form teacher input.
  The invoking agent may do that work, but before an EEF tool call every input
  must be converted into finite fixed values derived from Oak/EEF data. When we
  say a prompt-guided workflow may interpret free-form teacher language, that
  means the invoking agent is following a workflow template; it does not mean the
  deterministic tool has a prompt-like interpretation layer.
- EEF tool outputs should be compact structured context, not repeated
  teacher-facing explanation boilerplate. The settled practical-small MCP
  surface is a deterministic EEF query/fetch tool, an interpretation
  resource/template for "how to interpret and apply this data", and a user-facing
  prompt for starting the teacher workflow. Derive interpretation first from the
  corpus methodology and caveats (`impact_measure`, cost scale,
  evidence-strength measure, conversion notes) before adding graph/tool-specific
  ontology keys.
- Once owner questions are answered, tighten D3 from "define/decide" language
  into two explicit products: the written MCP contract and the SDK/app
  verification record. Do not let `mcp-expert` sign-off wording imply it already
  happened before the verification pass.
- For the next EEF holistic pass, review the live plan and predecision research

## Session: 2026-05-31 — Solar static-check correction

### Mistakes Made

- I repeated an already-known shell quoting error: ran an `rg` pattern containing
  backticks around `EEF_TOOLKIT_DATA` inside double quotes, so `zsh` attempted
  command substitution and printed `command not found`. No files changed from the
  command. Behaviour change: for any `rg` pattern containing backticks, use single
  quotes immediately; do not rely on memory that "I already know this" as a
  substitute for the concrete shell-safe habit.
- I reviewed EEF D2 and initially treated the current `school-context.ts` ->
  `strand-schema.ts` dependency as evidence that deleting the hand-maintained
  school-context lists/Zod in D2 might be wrong or should be deferred. Owner
  correction: the fixed EEF data is the source of truth, and any list or
  definition that is not a deterministic projection of that data is a failure to
  remove. Behaviour change: review D2 through maximum user value, the D1 value
  structure, and long-term architectural excellence. The right answer is not to
  conserve current compile dependencies; it is to name the correct co-land or
  refactor that removes non-source-of-truth surfaces while keeping the tree green.
- Follow-up correction: "deterministic projection of the data" is not permission
  to project MCP payloads/schemas directly from the raw corpus. D1's chain is raw
  EEF data -> typed raw foundation -> graph-native EEF view -> named graph-view
  subset/schema-builder -> single Zod call -> MCP schema. Behaviour change: keep
  D2 as the raw foundation only; D3/D4/D5 must own the graph form and D6 projects
  MCP schemas/payloads from that graph form, with traceability back to the raw
  corpus.
  report together but keep their authority distinct: the plan owns the current
  contract, sequencing, and acceptance; the report supplies evidence, cautions,
  and decision-space grounding. A useful report finding should be adopted into
  the plan deliberately; an outdated report claim should be amended or
  superseded, not left as parallel guidance.

## Session: 2026-05-31 — EEF report reviewer synthesis (Deep Drifting Anchor / `019e7e`)

### Patterns to Remember

- In type-preservation reviews, do not stop at result/error IDs. If the plan says
  a narrowed domain id must carry through the graph boundary, check query inputs,
  lookup arguments, roots, frontier refs, edge endpoints, and errors together.
  The first repaired EEF report still under-specified broad-string query inputs
  until the type reviewer forced that wider proof scope.
- When a report cites a registration adapter, verify the cited line proves the
  actual projection/type surface, not just an app-side docstring. The EEF report's
  `listUniversalTools` note needed SDK `list-tools.ts` and `types.ts` anchors,
  not only the streamable-http handler comments.

## Session: 2026-05-31 — EEF D1/D0 plan review

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state`
- **Signal**: friction
- **Observation**: I reached for `claims list --json`, but the built CLI shape is
  `claims list --active <path>` with no `--json` flag. The command failed before
  any state changed.
- **Behaviour change / candidate follow-up**: Check `--help` before assuming
  JSON-output flags on collaboration subcommands; the list output is already JSON
  in current built tooling.
  Source plane: `operational`

### Mistakes Made

- I ran two `git mv` commands in parallel while archiving EEF value-trace
  artefacts. One move succeeded and the other hit `.git/index.lock`. Git index
  writes are serial state, so never parallelise staging/index-mutating commands
  even when the file moves look independent.

### Patterns to Remember

- For EEF planning, working reports and Codex briefs are not live authority once
  their useful substance is folded into the plan. Archive stale ancillary
  artefacts instead of maintaining parallel source-of-truth language.

## Session: 2026-05-31 — EEF D2 metacognition correction

### Mistakes Made

- While reviewing D2 vocabulary derivation, I framed a mismatch between planned
  tool/context inputs and fixed corpus values as something to manage by naming
  separate "declared" and "observed" vocabularies. Owner correction: for this EEF
  lane the fixed data shape is fully specified; if a tool input does not map
  directly to the fixed known data, that is an architectural misalignment to fix
  at the foundation, not a reason to introduce glue, crosswalks, or parallel
  vocabularies.

### Behaviour Change

- For EEF D2/D3 reviews, treat every input vocabulary as derived directly from
  the fixed corpus shape. If a proposed input cannot be derived without a bridge,
  mark the surface wrong and push the correction upstream into the data contract,
  value contract, or MCP contract. Do not solve it by preserving a second
  vocabulary layer.
- I repeated the earlier shell-quoting miss by running an `rg` pattern with
  backticks unquoted, causing `zsh` to attempt command substitution for
  `by_phase`. This was already recorded as a behaviour change above; recurrence
  means I need to quote all `rg` patterns containing backticks or shell-significant
  characters before pressing enter, not just recognise the rule afterwards.
- I initially softened the D2/report repair by replacing "fallback" with
  "owner-ratified replacement after verification". Owner correction: that still
  preserves an escape hatch. The correct pattern is a hard proof requirement: if
  the settled shape cannot be proven, the contract/foundation is wrong and must be
  corrected; do not keep fallback menus, compatibility layers, alternate paths,
  or "just in case" branches alive in the plan.

## Session: 2026-05-31 — EEF value reframe (Fruited Regrowing Copse, `abec59`)

What started as a holistic plan/report review became, over four owner reframes, a
rebuild of the EEF plan's centre of gravity. Three insights, the last being the
most important.

- **The tombstone reflex (owner-caught).** I removed the wrong subject/topic idea
  but kept memorialising it — "rejected, not reclassified", "the original category
  error", VALUE-REFRAME-CONSEQUENCE banners. Owner: "no more than we reject bananas
  or kittens." The warning *is* the gravity; a removed idea earns no sentence.
  Correct pattern: describe what is, stop. (→ `feedback_no_tombstones_for_removed_ideas`,
  `distilled.md`.) I committed the anti-pattern *in the very edits documenting the
  reframe* — I can write the lesson and breach it in the same paragraph.

- **Value-trace-first (owner-named).** The EEF tools as first envisioned were never
  possible: they keyed on curriculum subject/topic, but EEF strands carry no such
  axis. Months of data-shape engineering went into an impossible join — the
  data-shape work was the tail wagging the dog. Tracing the user journey + value
  end-to-end first would have caught it. (→ `feedback_trace_user_value_before_tool_design`,
  the seeded `eef-value-trace.codex-brief.md`.)

- **EMERGENT loop-health alarm (cross-experience read, consolidate-docs step 4c).**
  The five most recent experience files are all one family — conservation /
  frame-capture reflex — across four different agents (Igneous, Evergreen,
  Opalescent, me) and four session types on the EEF thread. This family keeps
  generating fresh lessons *despite* `existence-is-not-correctness` already being a
  graduated rule, and despite a prior session explicitly noting "the cure is an
  execution-time default-flip, not another distilled entry" — yet I wrote two more
  entries this session. The signal: the enforce edge is not firing for this family
  under EEF-remediation pressure. The capture→distil→graduate pipeline is producing
  entries that do not change the execution-time default. The real cure is not more
  lessons; it is a structural / execution-time intervention, or an admission that
  the EEF remediation context itself is the inducer and the fix is finishing the
  remediation. Flagging as a loop-health observation for owner attention, not
  another lesson to file. (napkin write pushes this buffer into soft zone ~270/220;
  preserved at full weight per learning-preservation-overrides-fitness; route to
  step-9 refinement at next consolidation, do not trim.)

## Session: 2026-05-31 — EEF value-trace inverted frame (Leafy Ripening Meadow / `423e98`)

### Mistake Made

- Tasked with the EEF value-trace, I built the instrument with the polarity
  **inverted**: an all-Opus Ground→Trace workflow that asked "does the EEF data
  support the plan's value claim?" with a `GAP` verdict and a `value_gaps` array —
  treating the plan's expectations as the fixed reference and the data as the
  thing that must measure up. I launched ~20 Opus agents on that frame before
  locking the direction. Owner interrupted; I stopped the workflow.
- Owner correction (their words): **the EEF data is the source of truth and has no
  gaps in it; the plan is the map for surfacing the value of that truth into our
  user-facing tools; we do not twist the data to fit the plan, we correct the plan
  to surface the value the data provides.** Direction of correction is one-way,
  toward the plan, always.
- This is the SAME conservation / frame-capture family the entry directly above
  flagged as a loop-health alarm — one meta-level up. The original fatal flaw
  twisted the data to fit a topic-indexed tool; my gap-hunting frame would twist
  the *analysis* to fit a "does-the-data-comply" audit. `existence-is-not-correctness`
  is graduated and `value-trace-first` was seeded, yet I still inverted the frame
  on the very session meant to trace value. The enforce edge did not fire. Cost:
  eroded owner trust ("can't trust you to get the job done"). The "again" is the
  real signal.

### Fix Attempted

- Rewrote `eef-value-trace.codex-brief.md` so the frame cannot be lost: a
  "governing frame — read this first" section at the top; the one-way rule as a
  blockquote (correct the plan to surface the data's value, never twist the data);
  an explicit name-and-forbid of the inversion ("if you write 'the data lacks X',
  turn the sentence around"); two and only two finding shapes, both correcting the
  plan — *over-claim* (plan assumes value the data does not provide → correct the
  plan down) and *under-surface* (a tool/schema drops value the data does provide →
  correct the tool up); the six questions re-polarised from "does the data support"
  to "how does the value the data holds reach the user"; output defined as plan
  corrections, never data flags.

### Honest Note (do not oversell the fix)

- The brief rewrite is a clearer instruction for the NEXT agent — but it is another
  doc-patch, exactly the kind the loop-health alarm above said does not change the
  execution-time default. The recurring cure is structural / finishing the EEF
  remediation, not a better brief. Recorded as owner-directed; not claimed as the
  cure.

## Session: 2026-05-31 — Kilned D3/report repair

### Surprise

- **Expected**: `claims close` would accept the active registry and claim id,
  mirroring the minimal open command shape.
- **Actual**: the helper requires `--closed`, `--summary`, `--platform`, and
  `--model`; omitting `--closed` produced a usage error and left the claim open.
- **Why expectation failed**: I inferred close-command shape from open-command
  muscle memory instead of checking the specific close help first.
- **Behaviour change**: before closing claims manually, run or recall
  `claims close --help`; pass both `.agent/state/collaboration/active-claims.json`
  and `.agent/state/collaboration/closed-claims.archive.json`.
  Source plane: `operational`

### Mistake Made

- I reframed the remaining EEF D1 work as an "evidence term contract" with a list
  of terms to justify from the data. Owner correction: all phrases/concepts come
  from the fixed EEF data, methodology, and provenance surfaces; any separate list
  is made up. The right contract is corpus-derived projection plus visible
  provenance: every surfaced concept, payload field, resource field, and schema
  field is a deterministic type-strict transform/projection of the EEF data.
  Behaviour change: never author a parallel teacher-facing evidence vocabulary for
  EEF. Surface concepts from the corpus and make provenance visible.

## Session: 2026-05-31 — Kilned commit and closeout

### Practice/tooling feedback

- `commit-queue enqueue` and `commit-queue guard` currently require the stable
  agent `--id` even though the help text I read listed the name/platform/model
  fields and omitted `--id`. Behaviour change: when using commit-queue helpers,
  carry the full PDR-027 identity tuple from preflight, including the stable id,
  not just the human-readable name and session prefix.
- When a staged bundle already contains a deletion, retrying `git add -- <deleted
  path>` can fail because the file no longer exists in the working tree. If the
  deletion is already staged, restage the live paths and collaboration-state files
  explicitly, then verify `git diff --cached --name-status`; do not fight the
  missing old path unless the deletion itself has been lost.

### Pattern to Remember

- An owner instruction of "no `pnpm check`" at closeout means do not run the
  explicit session-handoff full gate. It does not imply bypassing git hooks for a
  requested commit; the normal `git commit` hook chain may still run its own
  staged formatting, markdownlint, validators, shell lint, and turbo tasks.

## Session: 2026-05-31 — Solar D2 review correction

### Mistake Made

- I accepted a reviewer suggestion to add a static no-survivor check for banned
  EEF list/Zod names. Owner correction: that asserts negatives with the wrong
  tool and builds a monument to the mistake. The right move is to look at the
  files, remove or repoint the wrong surfaces, make sure the touched imports and
  exports no longer keep them live, run normal gates, and move on. Behaviour
  change: do not add permanent anti-mistake audit harnesses for deleted EEF
  scaffolding unless there is a genuine recurring runtime boundary to protect.

## Session: 2026-05-31 — Evergreen EEF D2 architecture review

### Patterns to Remember

- Four-way architecture review on EEF D2/D3 converged on one structural defect:
  hard-coded Oak-signal-to-EEF-strand examples are a crosswalk, not a deterministic
  transform of `EEF_TOOLKIT_DATA`. Even when the target values are real strand ids,
  the mapping itself is a second data structure unless it is derived from corpus
  fields by a named graph/tool operation.
- D2/D3 alignment needs a source-path table mindset: every D3 finite input,
  output field, interpretation field, and graph annotation must trace through
  graph-native subset -> raw EEF source path -> proof. `methodology` and
  `meta.caveats` are raw data too; do not leave them implicit when D3 consumes
  interpretation/resource content.

### Practice/tooling feedback

- `pnpm agent-tools:collaboration-state -- claims list --active <path>` currently
  rejected the documented positional path form with `No number after minus sign in
  JSON at position 1`. Raw `active-claims.json` inspection showed no claims/queue.
  Behaviour change: if claim-list parsing fails, inspect the registry directly and
  record the helper friction rather than assuming overlap state.

## Session: 2026-06-01 — EEF replacement discipline correction

### Patterns to Remember

- For the EEF graph plan, D2 deletes the wrong load/list/Zod/freshness path
  outright. Do not defer deletion to preserve old imports, keep a compatibility
  wrapper, or use the old list implementation as an expected-output target. The
  raw EEF corpus is already complete in memory as `EEF_TOOLKIT_DATA`; D2 derives
  typed raw facts from that fixed object graph, D5 ingests those facts into the
  deterministic graph projection, and D6 registers only graph-derived MCP
  surfaces.
- During a fundamental replacement, a temporary red tree is acceptable only as a
  named in-flight D2-D6 replacement state. The cure is the completed replacement
  chain, not an alias, shim, fallback, side-by-side registration, or preserved
  old-path barrel.

## Session: 2026-06-01 — EEF handoff commit correction

### Patterns to Remember

- Before committing already-staged handoff surfaces, reread their diffs against
  the newest owner correction. Staged continuity can preserve a prior session's
  softer truth even after the live plan has been sharpened. In this case the
  staged repo-continuity/thread handoff still described a temporary loader wrapper
  and D5/D6 old-list deletion, while the corrected plan said D2 deletes the old
  path outright. Behaviour change: treat handoff surfaces as live claims to audit,
  not passive summaries to sweep into "commit all files".
- "Do not run quality gates; let the commit hook do that" means no extra manual
  validation beyond the commit-message preflight and the requested `git commit`.
  If the hook runs staged formatting, markdownlint, repo validators, shell lint,
  or turbo tasks, that is the requested enforcement path, not a violation of the
  no-manual-gates instruction.

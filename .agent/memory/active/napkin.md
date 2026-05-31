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

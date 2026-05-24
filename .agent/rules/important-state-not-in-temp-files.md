# Important State Not In Temp Files

Operationalises [`principles.md` §Code Design and Architectural Principles](../directives/principles.md)
"No machine-local paths" and PDR-014's capture-layer architecture
(capture → distil → graduate → enforce). Composes with
[`no-machine-local-paths`](no-machine-local-paths.md): both protect
durable substrate from non-repo references.

Worked instance that prompted graduation: Ferny Capture D in
`.agent/memory/active/napkin.md` (2026-05-24) — a synthesis file at
`/tmp/ferny-ws8-reviewer-synthesis-window2.md` was referenced from a
napkin entry intended for ongoing follow-on-author consumption. The
napkin pointer became a broken link the moment `/tmp/` rotated. Cured
by moving the synthesis to
`.agent/memory/active/ws-8-ratification-reviewer-synthesis-2026-05-24.md`
and updating the napkin pointer. The same shape has appeared multiple
times across sessions — this rule fixes the class.

## Rule

**Important state and context must never be left in a temp file
long-term. Using a temp file as a compose-buffer is fine. Leaving it
there for reference is not. Everything of importance stays in the
repo.**

Owner-stated 2026-05-24 (direct quote): *"important state and context
must never be left in a temp file long-term, using it as a buffer is
fine, but leaving it there for reference is not okay, everything of
importance stays in the repo."*

## The Distinction

The rule turns on **how the temp file is used downstream**, not on
its mere existence.

### 1. Permitted — temp file as compose-buffer

```text
write /tmp/foo-draft.md
  → emit broadcast carrying its substance
  → done                                              ✅ buffer
```

```text
write /tmp/long-body.md
  → git commit -F /tmp/long-body.md
  → done                                              ✅ buffer
```

```text
write /tmp/handoff-draft.md
  → copy into .agent/state/collaboration/handoffs/...md
  → done                                              ✅ buffer
```

A compose-buffer is **write → consume → done**. The temp file is the
shell-quoting cure, the large-body cure, or the staged-draft cure for
a single act of consumption. Nothing in the repo points at it after
the consumption step.

### 2. Forbidden — temp file as durable-reference

```text
napkin entry references /tmp/synthesis.md for follow-on author      ❌
comms event references /tmp/handover.md as the handover record      ❌
plan file references /tmp/cycle-evidence.md as substrate            ❌
.agent/ surface points at /tmp/ for ongoing context                 ❌
curator-pass log names /tmp/ as load_bearing_working_artefact       ❌
handoff record body asks the next agent to read /tmp/...md          ❌
```

A durable-reference is anything in a version-controlled file (or a
substrate file consulted across sessions) that names a `/tmp/` path
as the authoritative source. The pointer breaks at the next reboot,
the next OS temp-rotation, or the next session boundary. The substrate
that depended on it loses substance.

The test: **if a future reader (a different agent, a different
session, the same agent after compaction) follows a pointer and finds
the target gone, the substrate had no durable home.** That is the
failure mode this rule prevents.

## Cure Shape — What To Do With Each Class

| Where the substance ended up | Cure |
|---|---|
| Comms event body composed in `/tmp/`, then emitted | Already cured — comms event is the durable home. Delete the temp file. |
| Commit message body composed in `/tmp/`, then committed | Already cured — commit message is the durable home. Delete the temp file. |
| Synthesis or reasoning document for ongoing reference | Move to `.agent/memory/active/` or `.agent/memory/operational/`, depending on the source plane. Update any pointers. |
| Reviewer transcript or evidence-trail | Move to `.agent/state/collaboration/handoffs/` or the appropriate substrate dir. |
| Handover artefact for a peer agent | Move to `.agent/state/collaboration/handoffs/`. |
| Curator-pass working artefact (load-bearing) | Move to `.agent/state/collaboration/handoffs/` (one-shot transfer) or absorb-by-reference into routed permanent homes and delete (substance distributed). |
| One-off draft never consumed | Delete the temp file. No substrate to migrate. |

## Composition With Other Rules

- **`no-machine-local-paths`**: forbids machine-local *paths* (the
  syntactic class). This rule forbids *durable references* to a
  particular machine-local class (`/tmp/`). A path under
  `/tmp/breezy-survey.md` is both — machine-local *and* not durable
  for repo reference.
- **PDR-014 capture → distil → graduate → enforce**: `/tmp/` is
  acceptable at the capture-buffer layer (transient pre-consumption);
  it is forbidden as a distillation or graduation surface. This rule
  is the enforce layer for the misuse-as-distillation-surface failure
  mode.
- **PDR-067 (surface classification)**: per-user-memory is a buffer,
  not a personal store. By the same logic, `/tmp/` is a buffer, not
  a substrate store.
- **PDR-081 (curator role)**: the curator's per-pass log MAY name a
  `/tmp/` working artefact only as a transient pointer that is
  immediately resolved (substance absorbed by reference into routed
  homes, or copied to a durable in-repo location, before the pass
  closes). A pass that *closes* with the per-pass log's
  `load_bearing_working_artefact` still pointing at `/tmp/` is in
  violation.

## Detection

Local grep before commit (catches the most common shape — markdown
links and prose-references into `/tmp/`):

```bash
grep -rn -E "(^|[^a-zA-Z0-9_])/tmp/" \
  --include="*.md" --include="*.json" --include="*.yml" \
  .agent/ docs/ \
  2>/dev/null | grep -v "/archive/" | grep -v "/logs/"
```

Comms-event JSON files are intentionally not gated by this grep —
event bodies are immutable historical records of substrate-at-emit-
time, and a comms event that *named* a `/tmp/` artefact at the moment
it was a compose-buffer is honest historical capture. The rule applies
to *current* references in version-controlled durable substrate.

A future repo-invariant validator should encode this grep as a
structural test. Until then, the discipline is review-time + the
curator-pass's own surface survey.

## Forbidden

- `// works on my machine — /tmp/ exists` justifications. The rule's
  whole point is that the next reader's machine, or the same machine
  after a reboot, will not have it.
- "I'll move it later" pointers. The migration is the rule's whole
  cure — defer it and the substrate decays.
- Curator-pass log files whose `load_bearing_working_artefact`
  pointer remains at `/tmp/` after the pass closes. The pass-close
  step is where the migration completes.
- Substrate-bridge files left at `/tmp/` after the agent who composed
  them retires. The bridge artefact is durable substrate by purpose;
  its home is `.agent/state/collaboration/handoffs/`.

## Worked Examples

### Example 1 — the bug that prompted this rule

`.agent/memory/active/napkin.md` Ferny Capture D (2026-05-24, lines
2284–2298):

> "my Capture B pointer at
> `/tmp/ferny-ws8-reviewer-synthesis-window2.md` was the violation —
> a napkin entry referenced `/tmp/` for ongoing follow-on-author
> substrate. Cured this turn: synthesis content moved to
> `.agent/memory/active/ws-8-ratification-reviewer-synthesis-2026-05-24.md`;
> Capture B pointer updated."

The cure is the canonical pattern: identify the substrate's true
source-plane (active memory in this case), move it there, update
every pointer.

### Example 2 — comms events that name `/tmp/` are not retroactively in violation

Ferny Capture D itself notes:

> "Earlier session referenced /tmp/ in closeout broadcast `a596f140`
> and M1 integration flag `013de4d4` — those references are now
> stale-by-rule. Comms events are immutable; correction-broadcast
> naming the new repo location follows this Capture."

Comms events are append-only. A historical event that named a `/tmp/`
artefact at the time it was a live compose-buffer is honest capture,
not a violation under this rule. The cure is a correction-broadcast
naming the new durable location, not retroactive event editing.

### Example 3 — curator-pass first-day self-instantiation

A deep-curation survey commissioned by an outgoing curator is
delivered at `/tmp/<survey>.md`. The incoming curator's per-pass log
names this `/tmp/` artefact as `load_bearing_working_artefact` in the
frontmatter. **This is acceptable only as a transient pointer.** The
pass's first concrete cycle is the migration: either copy the survey
into `.agent/state/collaboration/handoffs/<handover-record>.md` (when
the artefact is a one-shot role-transfer record) or absorb its
substance by reference into routed permanent homes and delete the
temp file (when the substance has been distributed across multiple
permanent homes). The per-pass log's frontmatter pointer updates to
the durable home — or the pointer is removed entirely once substance
is distributed.

## Related

- `.agent/directives/principles.md` §"No machine-local paths".
- `.agent/rules/no-machine-local-paths.md` (companion rule; syntactic
  vs durable-reference distinction).
- PDR-014 (capture → distil → graduate → enforce; the layered model
  this rule's "buffer vs reference" distinction maps onto).
- PDR-067 (surface classification; per-user-memory as buffer).
- PDR-081 (curator role; per-pass log metadata-only contract).

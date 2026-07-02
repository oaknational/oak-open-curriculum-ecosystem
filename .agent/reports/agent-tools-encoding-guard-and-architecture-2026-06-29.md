# Agent-tools encoding guard — immediate state and long-term architecture

> Report · 2026-06-29 · Limpet herds Atoll (claude / claude-opus-4-8 / `d04779`)
>
> Status: immediate path to green defined; long-term target and plan-homes defined.
> **Pending reconciliation** with Callisto lifts Perigee's handoff — not on disk at
> authoring time (newest handoff 00:01Z; no encoding/Perigee record; no collaboration-state
> writes in the prior 120 min). Treat the handoff as input-to-verify when it lands.

## 1. Context

A `check-encoding` scanner was built in `agent-tools/src/encoding/` (in-flight: untracked
source, uncommitted wiring). It reads the raw bytes of every `git ls-files` entry and classifies
findings by severity:

| Severity | Categories | Gate behaviour |
| --- | --- | --- |
| critical | invalid UTF-8, BOM, bidi controls, C0/C1 controls, U+FFFD | fails `--fail-on critical` |
| notable | zero-width, unusual spaces, non-NFC | informational unless `--fail-on notable` |
| informational | smart quotes, dashes, ellipsis | never fails by default |

It is the structural cure for a documented corruption class: agent Write tools intermittently
emitting literal control bytes (`0x1F`, ESC `0x1B`), BOMs, and U+FFFD mojibake scars into tracked
files (incidents in `.agent/reports/agentic-engineering/ws1-cold-reads/`). The cleanup commit
`96f15f583` removed the known scars; this tool stops the class recurring. It is wired into
**pre-push** (`--fail-on critical`) and **`pnpm check`**.

Module split is clean and the pure/impure line is sharp: `check-encoding-helpers`,
`-tables`, `-types` are pure byte/string functions; `-report` is pure presentation; only
`check-encoding.ts` does I/O (`git ls-files`, `readFileSync`, repo-root, terminal).

**Governing decision in force — and the current wiring sits crosswise to it** (verified on disk
2026-06-29, reconciled against Callisto's handoff at
`.agent/reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md`).
ADR-178 (Accepted) mandates that agent-tools CLIs run from **built `dist`** with the build as a
*separate explicit step*, never `pnpm -s build` as an invocation side-effect — its §Verification
grep `pnpm.*build && .*node.*agent-tools.*dist` must return empty. Callisto's final wiring is
`encoding:check = pnpm --filter @oaknational/agent-tools -s build && node agent-tools/dist/...`,
mirroring the existing `skills:check` gate. That makes the verification grep **non-empty** — it now
matches both `skills:check` (pre-existing) and `encoding:check` (new). An earlier turbo-task form
(`dependsOn: [build]`, the one mechanism that declared the build dependency explicitly) was
reverted as a "special case". Two things hold at once: (a) ADR-178's *rationale* targets
frequently-invoked session CLIs drifting *within* a session, which a once-per-check gate does not
do, so whether gates are an intended exception is itself **undecided**; (b) the build-prefix still
trips the ADR's literal verification and rebuilds agent-tools redundantly (the chain already builds
it earlier in both `pnpm check` and pre-push). This is the owner's diagnosis exactly — *a decision
never made* — not a clean violation.

## 2. Decision lenses applied (`.agent/directives/principles.md`)

The request holds **two decisions at different altitudes**. The same five lenses apply in order to
both; a *different* lens is decisive for each, because one is a detail/mechanism question and the
other a system/strategy one. Naming this dissolves the apparent tension between "smallest change"
and "long-term excellence" — they are answers to different questions, not a trade-off.

- **Decision I — immediate** (get pre-push + `pnpm check` working and green). Lenses 1–2 set the
  guardrail (the gate must be real and strict — green *earned*, never manufactured by suppression
  or a weakened threshold). Within that guardrail, **lens 3 (could it be simpler) and lens 5 (user
  value) are decisive**: ship the smallest earned-green change now — it delivers immediate
  cross-platform protection — and do not refactor.
- **Decision II — long-term** (engine placement, the hook, the agent-tools standard). **Lens 1
  (long-term architectural excellence) and lens 4 (simpler if the system changed) are decisive**:
  the system *should* change — the pure engine belongs at the lowest general layer, and an explicit
  enforced standard dissolves the "which sibling pattern do I match?" ambiguity at its root.

Lens 4 explicitly does **not** fire on Decision I (we are not changing the system this minute) and
lens 3's "smallest" explicitly does **not** license deferring the immediate gate. That is the
"no rabbit hole, no ignored issue" balance, made principled.

**Owner precedence (2026-06-29) — a scoped exception that governs.** The owner has set the priority
explicitly: *right now, working; later, architectural excellence.* This is a deliberate, reasoned
exception to the normal strict-everywhere/LTAE-first order — this small tooling enhancement must not
expand to derail the session's broader goals, and the owner is willing to wait for another session
to resolve the underlying architecture and consistency. Per `principles.md` Owner-Direction-Beats-Plan
and `orientation.md` §Owner Precedence, this governs Decision I now: accept the working, consistent
wiring as-is; do **not** re-architect. The two guardrails the owner did *not* waive still hold —
green is *earned* (no suppression), and the deferred excellence is *recorded* (§4–§5), not lost.

## 3. Immediate — the smallest change to green, and what it leaves undone

**Smallest change — accept Callisto's working, consistent wiring; verify; commit** (no refactor, no
core move, no hook; per owner precedence in §2). Verified handoff state:

1. Source passes its own gates: ESLint clean on `src/encoding/`; 35 unit tests pass. The
   control-byte tests *construct* the bytes via `\x1b` escapes rather than embedding literals, so
   the scanner does not flag its own tests — the `principles.md` "never weaken a gate to solve a
   testing problem" trap is already avoided.
2. `pnpm encoding:check` exits 0: **0 critical**, 25 notable, 3295 informational (6768 scanned, 28
   binary); all notables benign. The single prior critical — a literal U+001F scar in the archived
   `ws1-cold-reads` report — was fixed to caret notation `^_`. That is a genuine scar fix (the
   report documents that exact corruption class), not a suppression to manufacture green.
3. Wiring is the `skills:check`-mirroring build-prefix, in `pnpm check` and pre-push. **Accepted
   as working-and-consistent**; the ADR-178-grep tension (it affects `skills:check` too) is a
   recorded later-session item (§4–§5), not patched now.
4. **Remaining to declare green:** run the aggregate gates this change actually touches —
   `markdownlint-check:root` and `format-check:root` (the two new reports + Callisto's continuity
   edits), `knip`, `depcruise`, `lint:shell` (the pre-push edit). The unrelated runtime suites
   (search / mcp / widget / a11y / e2e) cannot be affected by adding a scanner and markdown, so the
   affected-gate set is the honest proof; the full `pnpm check` / pre-push runs on push.
5. Commit the tool + wiring + reports + continuity edits.

**What the smallest change leaves undone** (all routed to §4–§5, none silently dropped):

- Pure detection engine not yet extracted to `packages/core` (framework/consumer still merged).
- The Write/Edit **hook** not built (authorship-time prevention deferred; the gate covers all
  platforms in the meantime).
- Test artefacts compiled into `dist` (`*.unit.test.js` present) — an agent-tools build-config
  gap, not specific to encoding (relates to `agent-tools-test-io-compliance.plan.md` / ADR-168).
- The agent-tools architectural standard + adherence sweep (the `tsx`-vs-`dist` sibling gap).
- No plan/thread record for the work yet (PDR-026 wants one for cross-workspace work).

## 4. Long-term — the excellence target

Confirmed by the owner: the **gate is permanent** (not all agent platforms support hooks, so the
CLI gate is the universal floor) and the **hook is also wanted** (authorship-time prevention where
supported). That settles the warrant for extraction — there are two permanent consumers.

**Target shape:**

- **Pure engine → `packages/core`** (e.g. `@oaknational/text-encoding`), built like
  `@oaknational/result`: `tsup` → `dist`, with the `exports` `development` condition resolving
  in-repo dev consumers to source. It is universal UTF-8/Unicode logic — "could a non-Oak consumer
  use it unchanged?" is yes.
- **Two thin, permanent consumers of that engine:**
  - the **gate** CLI in agent-tools (pre-push + `pnpm check` + CI), `dist`-invoked per ADR-178 —
    the cross-platform floor;
  - the **Write/Edit hook** in the hook-policy family (sibling to `check-blocked-content`, run via
    the existing `run-pretooluse-guard.mjs` from `dist`) — authorship-time prevention where the
    platform supports hooks. Importing a typed `@oaknational/*` package is cleaner than today's
    hook-policy hooks reaching into `agent-tools/dist/...`.
- **An explicit, enforced agent-tools architecture standard.** "Absolute adherence" means
  structural enforcement, not prose (lens 2): ESLint architectural / dependency-cruiser rules,
  repo-validators, and the config-expert review gate. The standard names, at minimum: the
  pure-mechanism (core) vs Oak-policy (agent-tools) vs CLI vs hook layering; the ADR-178 `dist`
  invocation rule and where source-mode is permitted; test placement (no test artefacts in `dist`);
  and one principled rule for the `tsx`-vs-`dist` choice so the sibling inconsistency cannot recur.
  The encoding tool becomes the **reference implementation** of the standard; the other tools
  converge to it incrementally (TDD, per-tool), never a big-bang rewrite (lens 3).

## 5. Where the long-term plans live

Crosswalked to the existing estate — these homes already exist; the work extends them, it does not
fork new parallel surfaces (`documentation-is-infrastructure`, `consolidate-estate`):

| Long-term item | Home | Notes |
| --- | --- | --- |
| Agent-tools architecture vision + adherence rules | **New ADR** (consolidating/extending ADR-178, ADR-168, ADR-041, ADR-159) | Durable decision tier; ADRs are permanent, plans cite them |
| Engine→core extraction + the hook | **New focused plan** under `.agent/plans/agent-tooling/` | Crosswalk: `hook-policy-typescript-and-schema-unification.plan.md` (hook family), `hooks-portability.plan.md` (the "not all platforms support hooks" point), `agent-tools-test-io-compliance.plan.md` (test placement) |
| Standard-adherence convergence sweep | **`agent-infrastructure-coherence-audit.plan.md`** (extend) or a code-architecture sibling | Existing plan covers artefact coherence; the code-architecture sweep is adjacent — decide extend-vs-sibling when promoting |
| Continuity | **Thread record** under `.agent/memory/operational/threads/` | If the work spans sessions |

The agent-tooling plan estate is already large (40+ `current/`, 35+ `future/`). The vision ADR
should be the capstone those plans reference; a crosswalk pass to prevent fragmentation is itself
warranted, but is not part of this tool's work.

## 6. Reconciliation with Callisto's handoff

Callisto's handoff (the report named in §1) **landed and is reconciled**. It is honest and
self-critical — it names its own worst move (inventing a "build-free class of tools" and nearly
severing the `@oaknational/result` dependency, both owner-refuted and reverted). Assessment of the
choices, against the verified state:

- **`dist`-not-turbo wiring is reconciled, not aligned.** My earlier read called the turbo-task form
  ADR-178-aligned; Callisto reverted it as a lone special-case and chose the `skills:check`
  build-prefix instead. The build-prefix trips the ADR-178 verification grep (so does the
  pre-existing `skills:check`) and rebuilds redundantly — but it introduces *no new pattern* and
  works. Under owner precedence (working now) this is **accepted**; the gate-family build-dependency
  convention is the deliberate later-session decision (§4–§5), and it must cover `skills:check` too.
- **The one critical scar fix** (U+001F → `^_` in an archived report) is a legitimate fix, not a
  green-manufacturing edit. The open *design* question it exposes — how the scanner treats files
  that legitimately contain such bytes (incident docs, fixtures) — is a later-session item.
- **Naming/placement** (`check-encoding` in `src/encoding/` vs the `validate-*` / `src/validators/`
  sibling convention) is flagged-and-deferred — correct under the working-now priority.

**Status:** Decision I (working) executing now — verify the affected gates green, then commit.
Decision II (excellence) homes are proposed in §4–§5 and explicitly deferred to a later session by
owner direction.

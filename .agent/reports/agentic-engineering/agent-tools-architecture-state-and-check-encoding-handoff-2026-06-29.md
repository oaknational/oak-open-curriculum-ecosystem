# agent-tools architecture state & `check-encoding` handoff

**Date:** 2026-06-29
**Author:** Callisto lifts Perigee (session 94fe5d)
**Audience:** Limpet herds Atoll (fresh take) and any agent analysing `agent-tools`
**Status:** `check-encoding` landed in a working, consistent, hack-free state; the
broader `agent-tools` architecture is **undesigned and inconsistent** and needs a
deliberate decision pass. This report makes my assumptions explicit so they can be
audited rather than trusted.

---

## 1. Why this report exists

The owner stopped an iterative fix loop with this diagnosis: *"a real problem, a
lack of architectural direction on agent-tools, and a horrible lack of consistency,
design decisions that were simply never made."* During the loop I made assumption
after assumption (including inventing a "build-free class of tools") and reached
repeatedly for the closest local fix instead of the systemic one.

The brief for this handoff:

- We built **one** additional tool (`check-encoding`). It must **work** and be
  **consistent** with what exists.
- **Remove every special-case hack.** A suboptimal approach that works and is
  consistent is preferred over hacks scattered around.
- Establish **what excellent looks like** — but do not necessarily achieve it today.

This report does not decide the target architecture. It records state, assumptions,
and the open questions, so Limpet can decide from a clean footing.

---

## 2. What was delivered this session

Two commits' worth of work, in two phases:

**Phase 1 (already committed — `96f15f583`):** a repo-wide UTF-8/encoding audit
(deterministic byte scan, cross-validated by an independent perl/iconv toolchain).
Findings: zero invalid UTF-8, zero BOMs, zero Trojan-Source bidi. Fixed two real
artefacts — raw `\x1b` ESC bytes in `statusline-render-session-shape.test.ts`
(replaced with `\x1b` escape sequences via SSOT import of `statusline-ansi`), and
deleted an archived doc carrying 4× U+FFFD mojibake.

**Phase 2 (this report's subject — uncommitted):** a permanent `check-encoding`
agent-tools command that performs that scan, plus wiring it as a gate. Plus a
one-byte fix in an archived report (`ws1-cold-reads/2026-06-12-r6-...md`: a literal
U+001F replaced with the intended caret notation `^_`), which clears the only
`critical` finding so the gate can run green.

---

## 3. What `check-encoding` is

A deterministic, byte-level encoding scanner over all `git ls-files` tracked files.

- **Source:** `agent-tools/src/encoding/` — `check-encoding.ts` (CLI),
  `-types.ts`, `-tables.ts`, `-helpers.ts`, `-report.ts`, plus
  `-helpers.unit.test.ts` and `check-encoding.unit.test.ts` (35 unit tests).
- **Reads raw bytes** (never a pre-decoded string), so it detects invalid UTF-8
  rather than masking it as U+FFFD. Hand-rolled strict UTF-8 validator (rejects
  overlongs, surrogates, >U+10FFFF), BOM detection, NUL-binary classification,
  codepoint scan, NFC check.
- **Severity tiers:** `critical` (invalid-utf8, BOM, bidi controls, C0/C1 controls,
  U+FFFD) · `notable` (zero-width, unusual-space, non-NFC) · `informational`
  (typographic punctuation). Default = report and exit 0; `--fail-on <severity>` =
  gate; `--json` = machine output; `--help`.
- **Current repo result:** 0 critical, 25 notable, 3295 informational (6768
  scanned, 28 binary). All notables are benign (NBSP/zero-width in generated vocab
  data and archives; one non-NFC generated widget file).
- **Uses `@oaknational/result`** for `parseArgs`/`analyzeAll` error returns
  (the canonical Result pattern, consistent with the ~26 other agent-tools files
  that use it).

### How it is wired (the consistency decision)

It **mirrors `skills:check`** — the existing precedent for an agent-tools gate that
depends on a built workspace package:

```jsonc
// root package.json
"encoding:check": "pnpm --filter @oaknational/agent-tools -s build && node agent-tools/dist/src/encoding/check-encoding.js --fail-on critical",
```

- Invoked as `pnpm encoding:check` in the root `check` script (next to
  `skills:check`) and in `.husky/pre-push`. Both build agent-tools, then run the
  **built** scanner from `dist`.
- It runs **after** the turbo build in both gates (it needs `@oaknational/result`
  built). Like `skills:check`, its `pnpm -s build` prefix refreshes agent-tools'
  own `dist`, while its dependency `@oaknational/result/dist` is built by the
  turbo build earlier in the chain.

This is **suboptimal-but-consistent** per the brief: it shares `skills:check`'s
implicit reliance on the chain's earlier build, but it introduces **no new
pattern**.

---

## 4. My explicit assumptions (audit these)

Each assumption I made, and its verdict after owner challenge + investigation:

1. **"The no-throw rule means I should import `@oaknational/result`."**
   *Partly right.* The Result pattern is mandated (principles.md). But I did not
   check what that import costs in a gate that runs via `tsx` before the build.

2. **"When the built dependency won't resolve at gate time, make `check-encoding`
   independent (local Result union)."** — **REFUTED by owner.** agent-tools is a
   fully integrated workspace (`@oaknational/result`, `@oaknational/safe-path`,
   `@oaknational/eslint-plugin-standards`); severing the dependency to dodge a
   build-order problem is avoidance, not architecture.

3. **"agent-tools validators are a build-free class."** — **FALSE / INVENTED.**
   `prevent-accidental-major-version` is a `tsx` script that imports the built
   `@oaknational/safe-path` and runs in the commit-msg hook. There is no designed
   "build-free" class; some tsx scripts import built packages and some don't. This
   was the most damaging assumption — I reified an emergent inconsistency into a
   rule and reasoned from it.

4. **"Place the gate after the build in the `&&` chain" fixes the ordering.** —
   *Works, but it is implicit shell ordering, not an explicit dependency.* It is the
   same shape `knip`/`depcruise` use, but it does not declare the dependency.

5. **"Model `check-encoding` as a turbo task with `dependsOn: [build]`."** —
   *Technically correct and it worked* (turbo built result→agent-tools then scanned),
   **but it was a special case**: no other agent-tools gate is a turbo task. Removed
   per the no-special-cases brief.

6. **"`check-encoding` should run via `tsx` like its siblings."** — *Refuted for a
   `pnpm check` gate.* `pnpm check` runs `clean` then validators **before** build, so
   a tsx script importing a built package fails post-clean. Hooks (pre-commit/-push)
   don't clean, which is why `prevent-accidental-major-version` survives there.

**Meta-pattern (for my own correction):** under friction I repeatedly climbed the
reliability ladder too fast — a couple of observations ("siblings use tsx") became a
model ("build-free class") became a fix ("sever the dep"). The cure is to ground the
situational fact (what do siblings *actually* import? what does `pnpm check`
*actually* sequence?) before reasoning from a model.

---

## 5. Current state of agent-tools (the real problem)

`agent-tools` has **no single convention** for how commands are invoked, how they
handle errors, or how they depend on the rest of the repo. Observed patterns:

### Invocation
- **Built unified-CLI topics** (`node dist/src/bin/agent-tools.js <topic>`):
  `agent-identity`, `collaboration-state`, `commit-queue`, `context-cost`,
  `session-metadata`, `pr-watch`, `branch-touched-files`, `codex-exec`.
- **Build-then-run-built** (`pnpm -s build && node dist/...`): `practice-substrate`,
  `codex-session-identity-hook`, and the root gate `skills:check`.
- **tsx-on-source** (`pnpm exec tsx src/...`): `check-commit-message`,
  `check-blocked-*`, `prevent-accidental-major-version`, most `validate-*`, `ci-*`,
  `comms-*`, `repo-check`.
- `check-encoding` (new) now follows the build-then-run-built shape.

### Error handling
- **Exit codes + `writeErrorLine`** (`check-commit-message`: `process.exit(2)`).
- **`throw new Error`** (`validate-no-machine-local-paths`).
- **`@oaknational/result`** (~26 files, incl. `collaboration-state`; `check-encoding`).

### Dependency on built workspace packages
- Some tsx scripts import built packages (`prevent-accidental-major-version` →
  `@oaknational/safe-path`); most `validate-*` import only relative source. This is
  **incidental, not designed** — and it is exactly what made the `pnpm check`
  ordering fragile.

### Gate wiring (repo-wide checks in `pnpm check` / hooks)
- `repo-validators:check` — a hand-rolled `&&` chain of `pnpm --filter ... validate-*`,
  run **before** the build in `pnpm check`.
- Standalone `*:check` root scripts (`subagents:check`, `portability:check`,
  `skills:check`, now `encoding:check`) — run **after** the build.
- `knip`/`depcruise` — standalone, after the build.
- None of these are turbo tasks; ordering is expressed purely by `&&` position.

**Consequence:** there is no answer to basic questions like "should an agent-tools
command run from source or from `dist`?", "is the Result pattern required in CLI
entry points or are exit codes the convention?", "may a gate depend on a built
package, and if so how is the build guaranteed?".

---

## 6. Open design questions for Limpet (what "excellent" might look like)

Not decided — these are the forks worth a deliberate decision pass:

1. **Source vs built execution.** Should *all* agent-tools commands run from `dist`
   (build once, run built — uniform, but couples every invocation to a build), or
   should tooling resolve workspace deps from **source** so `tsx` never needs a build
   (e.g. a `development`/`source` conditional export on internal packages)? The
   latter would dissolve the whole class of "ran before build" problems — including
   the known "no statusline in an unbuilt worktree" issue — but it is a cross-cutting
   change to package export conventions.
2. **One error-handling convention.** Result pattern everywhere (including CLI
   entry points), or exit-codes-at-the-boundary for CLIs with Result for internal
   libraries? Today both exist side by side.
3. **Gate modelling.** Should repo-wide gates be turbo tasks (explicit `dependsOn`,
   cache config) or stay as `&&`-ordered root scripts? If turbo tasks, how are
   whole-repo-input scans cached (or `cache: false`)?
4. **Naming/placement.** `check-encoding` lives in `src/encoding/` and is named
   `check-*`, while sibling repo gates are `validate-*` under `src/validators/`.
   Should it be `validate-encoding` under `src/validators/`? (Left as-is; flagged.)
5. **The `*:check` gate family contract.** `subagents:check`/`portability:check`
   run pre-build (tsx); `skills:check`/`encoding:check` run post-build (need a
   build). That split is currently implicit in `&&` position. Make it explicit.

A reasonable north-star hypothesis (for Limpet to accept or reject): **internal
packages expose a source condition so tooling runs build-free via tsx uniformly; CLI
entry points use exit codes at the boundary; repo-wide gates are a single declared
family.** That would let `check-encoding` drop the build-then-dist shape and rejoin a
uniform tsx family — but only once that decision is actually made.

---

## 7. What I removed and what I deliberately did NOT do

**Removed (special-case hacks):**
- The `@oaknational/agent-tools#check-encoding` **turbo task** (turbo.json back to
  original; no net diff).
- The `turbo run check-encoding ...` invocation in `check` and pre-push.
- The transient `node dist` standalone script wiring that bypassed the build.

**Did NOT do (out of scope / needs a decision):**
- Redesign agent-tools' invocation/error/dependency conventions.
- Introduce a source-condition export on `@oaknational/result` et al.
- Rename/move `check-encoding` to the `validate-*`/`src/validators/` convention.
- Wire `encoding:check` into pre-commit (brief asked for `pnpm check` + pre-push).

**Verification at handoff:** `pnpm encoding:check` → exit 0 (0 critical); eslint
clean on `src/encoding/`; 35 unit tests pass; turbo.json has no net change. Not yet
run: a full `pnpm check` end-to-end (long; the encoding slice is proven).
</content>

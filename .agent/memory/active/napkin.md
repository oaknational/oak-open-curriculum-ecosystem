---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous overweight active napkin was archived before this reset at
[`archive/napkin-2026-04-26b.md`](archive/napkin-2026-04-26b.md).

Earlier 2026-04-27 identity and queue observations from this rotation are in a
dated archive under `archive/`.

---

## 2026-04-27 — Fragrant Sheltering Pollen — app-server title mutation over-scoped

**Context:** took over a stuck Codex thread-name adapter while
`@oaknational/agent-tools` gates were failing. The app-server path worked
interactively, but it added experimental protocol code and lint failures while
the owner clarified that stable Codex session names already provide 99% of the
value.

### Surprise

- **Expected:** Codex thread-title mutation through `codex app-server` would be
  the natural completion of stable session names.
- **Actual:** deterministic names from `CODEX_THREAD_ID` were the load-bearing
  value; user-facing title mutation added fragility and blocked other agents.
- **Why expectation failed:** conflated identity derivation with UI chrome
  mutation. The former is repo-owned and stable; the latter depends on an
  experimental Codex app-server surface.
- **Behaviour change:** when a stable seed/name surface already exists, keep
  the repo path small and gate-friendly unless UI mutation is explicitly
  load-bearing.
- **Source plane:** active

---

## 2026-04-27 — Fragrant Sheltering Pollen — commit-window claims are not enough without queue order

**Context:** opened a short-lived `git:index/head` commit-window claim and
shared-log entry to land a narrow Codex stable-name documentation row. While
the claim was open, another commit landed and absorbed that row under a
scripts-fix commit message, then `HEAD` advanced again before inspection
finished. The owner explicitly named this as evidence for an
intent-to-commit queue.

### Surprise

- **Expected:** the existing commit-window claim protocol plus staged-set
  awareness would be enough to avoid cross-agent commit collisions when used
  carefully.
- **Actual:** the claim made the collision observable but did not serialize
  the commit turn. Visibility is not ordering.
- **Why expectation failed:** active claims describe areas and intent; they do
  not provide a FIFO "whose turn owns index/head now" primitive.
- **Behaviour change:** implement the next slice as an ordered advisory
  `commit_queue` plus exact staged-bundle verification. Treat claim-only
  commit intent as insufficient under active same-branch concurrency.
- **Source plane:** active

---

## 2026-04-27 — Prismatic Waxing Constellation — root script validation path

**Context:** implemented `scripts/commit-queue.mjs` and its root-script tests.
The targeted Vitest command passed, but a direct file-level `pnpm exec eslint`
against the new `.mjs` script failed before linting code because the repo's
typed ESLint rules require parser services that the direct invocation does not
provide for that file shape.

### Surprise

- **Expected:** direct `pnpm exec eslint scripts/commit-queue.mjs` would be a
  useful narrow syntax/style check for a root helper.
- **Actual:** direct ESLint hit a parser-services configuration error; the
  supported root-script validation path is `pnpm test:root-scripts`, which ran
  12 files / 120 tests and passed.
- **Why expectation failed:** root script validation is routed through the
  repo's configured Vitest and boundary-validator entrypoint, not arbitrary
  direct ESLint invocations over standalone `.mjs` files.
- **Behaviour change:** for root helper scripts, prefer
  `pnpm test:root-scripts` plus targeted Vitest and Prettier checks unless the
  lint config explicitly supports a direct file-level command.
- **Source plane:** operational

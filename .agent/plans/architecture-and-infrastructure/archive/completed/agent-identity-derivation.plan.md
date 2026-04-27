---
name: "Agent Identity Derivation Tool"
overview: >
  Add a portable, deterministic agent-identity-derivation CLI to the
  agent-tools workspace. Given any stable seed (typically a platform
  session_id), the tool emits the same Adjective-Verb-Noun identity
  on every invocation, on every platform. Identity becomes a pure
  function of session_id rather than an ad-hoc choice that drifts
  across Claude Code, Codex, and Cursor sessions and across the
  collaboration surfaces (claims, conversation threads, commit
  attribution, statusline). Phase 0 owner approval for the seed
  wordlists and bin name is complete.
todos:
  - id: phase-0-owner-approval
    content: "Phase 0: owner approved the three themed wordlists, multistage hash design, override semantics, and bin name agent-identity."
    status: completed
  - id: phase-1-core-derivation
    content: "Phase 1: core derivation module + tests. Pure deriveIdentity(seed, options) function with multistage SHA-256 hash routing through group → adjective → verb → noun. RED-first."
    status: completed
  - id: phase-2-cli
    content: "Phase 2: bin entry point at src/bin/agent-identity.ts; package.json script; help text; override env var; exit codes."
    status: completed
  - id: phase-3-build-integration
    content: "Phase 3: tsconfig.build.json includes the new bin; pnpm build emits dist/src/bin/agent-identity.js with shebang; verify the dist invocation works end-to-end."
    status: completed
  - id: phase-4-claude-code-statusline
    content: "Phase 4: document Claude Code wrapper status and defer statusline installation to a Claude/update-config session."
    status: completed
  - id: phase-5-codex-cursor-wrappers
    content: "Phase 5: document Codex and Cursor wrapper status, implementing only portable repo-owned surfaces in this pass."
    status: completed
  - id: phase-6-collaboration-integration
    content: "Phase 6: update .agent/skills/start-right-quick + start-right-thorough so identity registration calls the derivation tool by default; thread next-session records and active-claims agent_name fields can be auto-suggested."
    status: completed
  - id: phase-7-docs-and-adr
    content: "Phase 7: README + TSDoc on the public surface; PDR amendment to PDR-027 documenting the derivation default with override semantics; update register-identity-on-thread-join rule to reference the tool."
    status: completed
  - id: phase-8-claude-platform-review
    content: "Phase 8: Claude agent reviews the completed work for Claude Code system alignment and cross-platform wrapper accuracy across Claude, Codex, Cursor, and any other active agent platform. Wired Claude Code statusline through .claude/scripts/statusline-identity.mjs delegating to agent-tools/dist/src/claude/statusline-identity.js; no Claude-only mismatch found."
    status: completed
---

# Agent Identity Derivation Tool

**Last Updated**: 2026-04-27
**Status**: 🟢 COMPLETE — repo-owned core/CLI/docs landed in commits `3a5e3d81` + `ed256e6f`; Phase 8 Claude Code statusline wiring landed in this pass; Codex/Cursor remain documented gaps until those platforms expose stable session-id surfaces.
**Owner**: Jim
**Author of plan**: Ethereal Alpaca (claude-code, claude-opus-4-7-1m), 2026-04-26
**Parent**: cross-platform agent collaboration infrastructure (PDR-027 supplement).
**Sibling**: PR-87 quality remediation continues in parallel; this plan does not block it.

---

## Context

Agents on Claude Code, Codex, and Cursor share the same repo and the
same multi-agent collaboration state (active-claims registry,
conversation decision threads, commit attribution, thread next-session
records). Per PDR-027 the `agent_name` field is "owner-assignable but
not owner-mandatory" — in practice agents pick a name ad-hoc at session
open. This session's agent ("Ethereal Alpaca") appropriated the slug
that Claude Code's plan-mode runtime auto-generated; prior sessions
used "Frolicking Toast", "Sturdy Otter", "Keen Dahl", etc. The names
have personality but no consistency: the same session does not produce
the same name twice, and the same agent on a different platform shows
up with a different identity in the same collaboration log.

This plan installs a small, deterministic tool that turns identity
selection from a personal choice into a pure function of an explicit
stable seed. When the seed is a session id, the result is a deterministic
session display identity; persistent PDR-027 identity across sessions
requires an explicitly persistent seed or an operator override. Names
retain personality through *grouped, themed* wordlists rather than a flat
random vocabulary — `lunar-orbiting-comet` reads as a coherent identity,
not assembled noise.

This is a cross-platform shared concern (per the platform-independent
shared-concerns feedback memory) and belongs in the existing
`agent-tools` workspace alongside `claude-agent-ops`,
`cursor-session-from-claude-session`, and `codex-reviewer-resolve` —
the established home for portable agent CLIs.

---

## Solution Architecture

### Workspace and entry point

- **Workspace**: `agent-tools/` (existing, `@oaknational/agent-tools`).
- **Bin**: `agent-tools/src/bin/agent-identity.ts` → built to
  `agent-tools/dist/src/bin/agent-identity.js` (shebang preserved). All
  consumers invoke the **built** version, not the source. This matches
  the convention of the three existing bins in the workspace.
- **Core module**: `agent-tools/src/core/agent-identity/` containing:
  - `wordlists.ts` — typed exports of the group/adj/verb/noun arrays
    (vendored, version-controlled, no external dependency).
  - `derive.ts` — pure `deriveIdentity(seed: string, options?)` →
    `IdentityResult`.
  - `hash.ts` — small wrapper around `node:crypto.createHash('sha256')`
    that returns typed slices of the digest as 32-bit unsigned integers.
- **Platform adapters**: `agent-tools/src/<platform>/` (added in Phase 8).
  - `src/claude/statusline-identity-input.ts` — pure stdin-JSON parser
    returning a discriminated `StatuslinePlan` (unit-tested).
  - `src/claude/statusline-identity.ts` — Claude Code statusline adapter;
    parses stdin via the input parser and `spawnSync`s the built
    `agent-identity` CLI with `--seed <session_id> --format display`.
    Soft surface: any failure exits 0 with empty stdout.
  - Future Codex / Cursor adapters will live in symmetric `src/codex/`
    and `src/cursor/` directories when stable platform session-id
    surfaces are designed. Platform adapters depend on `src/core/` and
    spawn `src/bin/` artefacts; `src/core/` must never import from a
    platform adapter (boundary discipline per ADR-024).

### Public surface

```typescript
export interface DerivedIdentityResult {
  readonly kind: "derived";
  readonly group: string;
  readonly adjective: string;
  readonly verb: string;
  readonly noun: string;
  /** Adjective Verb Noun, capitalised for display. e.g. "Lunar Orbiting Comet". */
  readonly displayName: string;
  /** lowercase-kebab form for filenames/slugs. e.g. "lunar-orbiting-comet". */
  readonly slug: string;
  /** SHA-256 hex digest of the seed (audit trail). */
  readonly seedDigest: string;
}

export interface OverrideIdentityResult {
  readonly kind: "override";
  /** Override display value after trim/whitespace normalisation. */
  readonly displayName: string;
  /** lowercase-kebab form for filenames/slugs. e.g. "frolicking-toast". */
  readonly slug: string;
  /** SHA-256 hex digest of the seed (audit trail). */
  readonly seedDigest: string;
  /** Normalised override value that bypassed wordlist derivation. */
  readonly override: string;
}

export type IdentityResult = DerivedIdentityResult | OverrideIdentityResult;

export interface DeriveIdentityOptions {
  /** If set, returns the override result variant after format normalisation. */
  readonly override?: string;
}

export function deriveIdentity(
  seed: string,
  options?: DeriveIdentityOptions,
): IdentityResult;
```

### Multistage hash routing tree

Deterministic, no PRNG state. Given `digest = SHA-256(seed)` (32 bytes):

| Stage | Bytes | Reduces against | Selects |
|---|---|---|---|
| 1 | `digest[0..3]`  (uint32 BE) | `groups.length`              | group index |
| 2 | `digest[4..7]`  (uint32 BE) | `group.adjectives.length`    | adjective index |
| 3 | `digest[8..11]` (uint32 BE) | `group.verbs.length`         | verb index |
| 4 | `digest[12..15]` (uint32 BE)| `group.nouns.length`         | noun index |

16 bytes of the digest are unused (reserved for future extensions:
e.g. a fifth slot, an emoji indicator, a checksum byte, or a multi-language
variant token). All four selections are uniform modulo bias bounded by
`2^32 / list_length` — for 20-item lists the bias is irrelevant
(`2^32 % 20 = 16` excluded values out of `2^32`; ≪ 1e-7).

### Override semantics

Two override surfaces, in priority order:

1. `options.override` argument (programmatic override).
2. Environment variable `OAK_AGENT_IDENTITY_OVERRIDE` (operator
   override; useful when an owner wants to assign a memorable name
   like "Frolicking Toast" that out-paces derivation).

If either is set, derivation is bypassed and the result uses
`kind: "override"` with display/slug/seedDigest/override fields only. This
keeps the public type total: callers never receive fake group, adjective,
verb, or noun values for a non-derived identity. The `seedDigest` field is
still populated from the original seed for audit traceability.

### CLI shape

```text
Usage: agent-identity [--seed <seed>] [--format <kebab|display|json>] [--help]

  --seed <seed>       Stable seed (default: $CLAUDE_SESSION_ID, then $OAK_AGENT_SEED).
  --format <fmt>      Output format. kebab (default) | display | json.
  --help              Print help and exit 0.

Override: $OAK_AGENT_IDENTITY_OVERRIDE bypasses derivation.

Exit codes:
  0  success
  2  bad usage (unknown flag, missing seed when no fallback resolves)
```

Seed-resolution chain when `--seed` is omitted is intentionally strict:
`CLAUDE_SESSION_ID`, then `OAK_AGENT_SEED`, then fail with exit code 2.
The earlier personal-email fallback is removed from this implementation
because it silently hashes a personal identifier and can collapse
concurrent same-machine agents into one identity.

### Build and consumer invocation

- `agent-tools/tsconfig.build.json` already compiles `src/**` to
  `dist/`; the new bin needs no config change beyond adding to the
  default include set.
- Consumers invoke `node agent-tools/dist/src/bin/agent-identity.js …` or
  `pnpm agent-tools:agent-identity --seed <seed> --format display`.
- Platform-specific wrapper installation is deferred. This pass documents
  Claude Code, Codex, and Cursor status plus the next action for each
  platform; it does not mutate platform-specific config.

---

## Wordlists (Phase 0 — owner approval gate)

Three themed groups. Each group has 20 adjectives, 20 verbs, 20 nouns
(`3 × 20³ = 24,000` distinct identities). Owner reviews and approves
**verbatim** or supplies replacements before Phase 1 starts.

### Group 1 — **Celestial** (sky, light, astronomy)

- **Adjectives** (20): celestial, cosmic, stellar, lunar, solar, ethereal, nebulous, galactic, twilit, dawnlit, starlit, moonlit, sunlit, gilded, radiant, luminous, prismatic, glittering, iridescent, opalescent
- **Verbs** (20): drifting, orbiting, soaring, gliding, ascending, glowing, illuminating, eclipsing, transiting, waning, waxing, dancing, weaving, threading, scattering, cascading, beaming, shimmering, twinkling, glimmering
- **Nouns** (20): nebula, comet, quasar, galaxy, supernova, asteroid, meteor, planet, star, moon, sun, eclipse, satellite, constellation, orbit, twilight, dawn, dusk, aurora, prism

### Group 2 — **Maritime** (ocean, coast, navigation)

- **Adjectives** (20): oceanic, tidal, coastal, briny, deep, abyssal, pelagic, salty, foamy, misty, squally, stormy, glassy, choppy, pearly, riverine, lacustrine, estuarine, seaworthy, breezy
- **Verbs** (20): sailing, navigating, charting, plumbing, fathoming, surfing, cresting, rolling, lapping, washing, ebbing, flowing, anchoring, mooring, berthing, fishing, diving, snorkelling, swimming, drifting
- **Nouns** (20): harbor, lighthouse, anchor, sail, mast, prow, stern, hull, rudder, compass, sextant, beacon, jetty, pier, dock, lagoon, atoll, reef, archipelago, fjord

### Group 3 — **Botanical** (forest, growth, green things)

- **Adjectives** (20): verdant, lush, mossy, leafy, ferny, sylvan, woodland, arboreal, evergreen, deciduous, fragrant, dewy, shaded, wooded, blooming, fruited, fronded, gnarled, twigged, vining
- **Verbs** (20): growing, sprouting, blossoming, branching, flowering, ripening, swaying, rustling, whispering, bending, climbing, twining, creeping, spreading, sheltering, shedding, regrowing, budding, fruiting, foraging
- **Nouns** (20): grove, copse, glade, meadow, thicket, canopy, sapling, fern, moss, bark, leaf, branch, root, blossom, petal, stamen, seed, pollen, dew, forest

**Owner approval gate criteria**:

1. ✅ Owner approves the three group themes (Celestial, Maritime, Botanical) **OR** supplies replacement themes.
2. ✅ Owner approves the 60 words per group (180 total) **OR** supplies replacements.
3. ✅ Owner approves the multistage hash design (group → adj → verb → noun routing) and the 16-bytes-reserved future-extension slack.
4. ✅ Owner approves the override semantics (env var bypass).
5. ✅ Owner confirms the bin entry point name `agent-identity` (alternatives: `agent-name`, `oak-identity`).

---

## Phase Plan

### Phase 0 — Owner approval (≤1 review pass)

Owner approved §Wordlists, multistage hash routing, override semantics,
and `agent-identity` as the bin name. This gate is closed.

### Phase 1 — Core derivation module + RED-first tests

**Files to add**:

- `agent-tools/src/core/agent-identity/wordlists.ts`
- `agent-tools/src/core/agent-identity/hash.ts`
- `agent-tools/src/core/agent-identity/derive.ts`
- `agent-tools/src/core/agent-identity/index.ts`
- `agent-tools/tests/agent-identity/derive.unit.test.ts`
- `agent-tools/tests/agent-identity/hash.unit.test.ts`

**Test cases (RED-first)**:

1. Determinism: same seed → same identity (assert across 10 fixed seeds).
2. Distribution sanity: fixed deterministic seed corpus reaches all 3 groups.
3. Override bypass: `options.override` returns the `kind: "override"` result variant.
4. Empty seed: throws `seed must be a non-empty string`.
5. Format invariants: `slug` is lowercase-kebab; `displayName` is Title Case Space-separated; `seedDigest` is 64-char hex.
6. Hash slicing: `digest[0..3]` interpreted as uint32 BE, modulo 3 (groups.length), produces the documented group; pin one example.

**Acceptance**:

- ✅ All RED tests written first; all fail with module-not-found.
- ✅ GREEN implementation makes them pass.
- ✅ `pnpm agent-tools:test`, `pnpm --filter @oaknational/agent-tools type-check`, and `pnpm agent-tools:lint` exit 0.
- ✅ No `as`, `any`, `unknown`-widening (`no-type-shortcuts` rule).
- ✅ `IdentityResult` fields all `readonly`; arrays as `readonly string[]`.

### Phase 2 — CLI bin

**Files to add**:

- `agent-tools/src/bin/agent-identity.ts`
- `agent-tools/src/bin/agent-identity-cli.ts` (parseCliArgs + HELP_TEXT, mirroring `claude-agent-ops-cli.ts`)
- `agent-tools/tests/agent-identity/cli.unit.test.ts`

**Acceptance**:

- ✅ `--help` exits 0 with usage text.
- ✅ `--seed foo` prints `lowercase-kebab-form\n` to stdout (default format).
- ✅ `--format display` prints `Title Case Form\n`.
- ✅ `--format json` prints the full `IdentityResult`.
- ✅ Bad usage exits 2 with stderr message.
- ✅ Override env var is honoured.
- ✅ Seed-resolution chain works through injected env objects; tests do not read or mutate `process.env`.
- ✅ `package.json` adds an `agent-identity` script that builds and runs
  the emitted `dist/src/bin/agent-identity.js` CLI.
- ✅ Root `package.json` adds `agent-tools:agent-identity` and `agent-tools:test:e2e`.

### Phase 3 — Build integration

**Acceptance**:

- ✅ `pnpm --filter @oaknational/agent-tools build` emits
  `dist/src/bin/agent-identity.js` with shebang.
- ✅ Direct invocation works:
  `node agent-tools/dist/src/bin/agent-identity.js --seed test --format display`
  → `Iridescent Eclipsing Eclipse` (or whichever derivation the seed produces).
- ✅ `pnpm agent-tools:test:e2e` proves the built CLI under plain Node.

### Phase 4 — Claude Code statusline wrapper status

**Decision** (Codex pass): defer installation to a Claude Code session that
has the `update-config` skill available. This implementation pass documents the
status and next action only.

**Decision (Phase 8 update)**: the Claude Code statusline wiring landed in
this pass without using `update-config`. `.claude/settings.json` already
supports a `statusLine.command` field; nothing in `update-config` was required
beyond a direct edit of that file plus a thin `.claude/scripts/` shim. See
Phase 8 for the wiring detail.

**Acceptance**:

- ✅ Docs identify Claude Code as deferred to a Claude/update-config session.
- ✅ Docs specify that wrapper installation must pass an explicit session seed
  to `agent-identity`; no personal-email fallback is available.
- ✅ Override env var remains documented for the eventual wrapper.

### Phase 5 — Codex / Cursor wrapper status

**Acceptance**:

- ✅ Codex status is documented as no repo-owned automatic wrapper yet unless
  a stable session identifier/statusline surface is confirmed later.
- ✅ Cursor status is documented as no repo-owned automatic wrapper yet unless
  a stable session identifier/statusline surface is confirmed later.
- ✅ No fallback to `git config user.email` is documented or implemented.

### Phase 6 — Collaboration integration

**Files to update** (subject to claim discipline — Frolicking Toast
holds `.agent/skills/start-right-*/**` and `.cursor/rules/**` until
their umbrella closes; this phase waits for that):

- `.agent/skills/start-right-quick/shared/start-right.md` — identity
  step calls `agent-identity` by default.
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md` — same.
- `.agent/rules/register-identity-on-thread-join.md` — reference the
  tool as the canonical derivation source; override semantics named.

**Acceptance**:

- ✅ Start-right skills suggest the derived identity at session-open.
- ✅ Override workflow documented: "to set a memorable name, export
  `OAK_AGENT_IDENTITY_OVERRIDE` before starting the session".

### Phase 7 — Docs and PDR amendment

**Files to add/update**:

- `agent-tools/docs/agent-identity.md` — README for the tool.
- `agent-tools/src/core/agent-identity/derive.ts` — extensive TSDoc on
  `deriveIdentity` with examples (per `tsdoc` skill).
- `.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md`
  — amendment recording derivation as the default identity path,
  with override remaining the choice path.

**Acceptance**:

- ✅ README covers: invocation, options, override semantics, examples
  for each platform wrapper, audit-trail (seedDigest).
- ✅ TSDoc `@example` blocks on `deriveIdentity` covering all option
  combinations.
- ✅ PDR-027 amendment dated, references this plan.
- ✅ `pnpm doc-gen` succeeds; `markdownlint-check:root` clean.

### Phase 8 — Claude and platform alignment review

**Executor**: A Claude Code agent in a Claude session, after this Codex
implementation pass lands.

**Purpose**: verify that the repo-owned CLI and documentation line up
with Claude Code systems as well as the other agent platforms that share
this repository.

**Review instructions for Claude**:

1. Read this plan, `agent-tools/docs/agent-identity.md`,
   `agent-tools/README.md`, PDR-027, the start-right updates, and
   `register-identity-on-thread-join`.
2. Inspect the implementation under
   `agent-tools/src/core/agent-identity/` and `agent-tools/src/bin/`.
3. Verify Claude Code alignment specifically: whether the documented
   `update-config`/statusline follow-up is still the correct Claude
   installation path, whether the wrapper must pass an explicit
   `session_id`, and whether any Claude-only config should be changed in
   that Claude session.
4. Verify the cross-platform matrix for Claude Code, Codex, Cursor, and
   any other active agent host. Confirm each platform is either
   implemented through a stable repo-owned surface or documented as a
   concrete gap with a next action.
5. Run the portable proof commands where practical:
   `pnpm agent-tools:test`, `pnpm agent-tools:test:e2e`,
   `pnpm --filter @oaknational/agent-tools type-check`,
   `pnpm agent-tools:lint`, `pnpm agent-tools:build`, and the direct
   built CLI invocations in §Verification.
6. Record findings in the shared comms log or a collaboration
   conversation. If the review changes platform status, update this plan
   and `agent-tools/docs/agent-identity.md`.

**Acceptance**:

- ✅ Claude reviewer confirms no hidden Claude Code system mismatch.
- ✅ Claude/Codex/Cursor platform statuses are either confirmed or
  corrected.
- ✅ Any required platform-specific wrapper install is kept out of this
  Codex pass unless the Claude session explicitly performs it with the
  right platform capability.

**Phase 8 findings (Claude Code session, 2026-04-27)**:

- The Claude Code statusline contract is a JSON object on stdin containing
  `session_id` (and other fields). Documented at
  <https://docs.claude.com/en/docs/claude-code/statusline>; `update-config`
  was not required — `.claude/settings.json` already exposes the
  `statusLine.command` field for direct edit.
- Wiring landed:
  - `.claude/settings.json` → `node .claude/scripts/statusline-identity.mjs`.
  - `.claude/scripts/statusline-identity.mjs` (new) — graceful-degradation
    shim that resolves the built adapter and exits 0 silently when the build
    artefact is missing.
  - `agent-tools/src/claude/statusline-identity.ts` (already landed in
    commit `3a5e3d81`) — pure-input parser plus child-process spawn of the
    built `agent-identity` CLI.
  - `agent-tools/package.json` `build` script chmods the built adapter.
  - Unit tests at `agent-tools/tests/claude/statusline-identity-input.unit.test.ts`
    cover the soft-surface parsing rules.
- Smoke test confirmed end-to-end behaviour: a real Claude Code session id
  on stdin produces the deterministic display name; missing/invalid input
  exits 0 silently.
- Cross-platform matrix: Claude Code is now **Wired**; Codex and Cursor
  remain documented gaps. No platform regression introduced.
- No Claude-only config drift detected: the existing settings.json
  permissions, hooks, and enabled plugins are all unchanged.

---

## Testing Strategy

### Unit Tests (Phase 1, 2)

- Determinism property: 100 fixed seeds → 100 stable outputs.
- Distribution property: fixed deterministic seed corpus reaches all three groups.
- Override bypass: explicit + env var.
- Hash slicing pinned with documented byte vectors.
- CLI: argv parsing, format flags, exit codes, help, seed-resolution chain.

### Integration Tests (Phase 3)

- Built `dist/src/bin/agent-identity.js` invoked end-to-end via `node` is covered by `agent-tools/tests/agent-identity/agent-identity.e2e.test.ts`, which runs under the existing E2E config because it spawns child processes.

### Property Tests (consideration)

- Optional, deferrable to a follow-up: every byte sequence as a seed yields a valid identity (no out-of-range index, no exception).

---

## Verification (end-to-end)

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools test:e2e
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
node agent-tools/dist/src/bin/agent-identity.js --help
node agent-tools/dist/src/bin/agent-identity.js --seed example-session-id-001 --format display
# Expected: deterministic name, e.g. "Lunar Orbiting Comet"
node agent-tools/dist/src/bin/agent-identity.js --seed example-session-id-001 --format display
# Expected: identical output (determinism check)
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" node agent-tools/dist/src/bin/agent-identity.js --seed any --format display
# Expected: "Frolicking Toast"
```

After platform-specific follow-up, each supported wrapper should visibly
render the identity in its host surface within a fresh session.

---

## Out of Scope

- Automatic persistent identity across sessions or machines. The tool is
  seed-agnostic; persistent identity requires a deliberately persistent
  seed or explicit override.
- Personal-email fallback (`git config user.email`). This was removed
  after pre-implementation review because it silently hashes a personal
  identifier and can collapse concurrent same-machine agents.
- Platform-specific wrapper installation. Claude Code, Codex, and Cursor
  wrapper status is documented in this pass; installation belongs to
  platform-specific follow-up sessions.
- Identity registration in `active-claims.json` automation (Phase 6
  surfaces it at the skill layer; auto-write to claims is a separate
  workstream).
- Wordlist localisation / non-English variants.
- Wordlist expansion beyond 3 groups (the architecture supports it;
  Phase 0 approves the initial three only).
- Backfilling historical commits / threads with derived identities
  (deliberate: the historical record stays as written).

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Wordlist contains an unintentionally awkward combination | LOW | Phase 0 owner review of all 180 words; trivial to swap individual words; collision space is 24k, so any single offending combination is one in 24k. |
| Different platforms expose different "session_id" semantics | MEDIUM | Phase 5 documents per-platform status and gaps; the tool accepts any explicit string seed, so future harness wrappers normalise. |
| Override env var leaks into multi-agent settings (one identity for two agents on same machine) | MEDIUM | Document explicitly: override is per-shell; session-scoped harness should set/unset around session boundaries; PDR-027 amendment covers this. |
| Hash bias on small lists | NEGLIGIBLE | Modulo-bias for 20-item lists is bounded by 2^32 / 20 ≈ 1e-9 effect; uniformity test catches anomalies. |
| Agent-tools build pipeline change ripples to other consumers | LOW | Adding a new bin is additive; existing bins unaffected; tsconfig.build.json includes `src/**` already. |
| Session-id seed is mistaken for durable PDR-027 identity | MEDIUM | Docs distinguish deterministic session display identity from persistent identity keys. |

---

## Dependencies

**Blocking**:

- None after Phase 0 approval and coordination-consolidation commit
  separation. Wrapper installation is explicitly deferred.

**Related**:

- PDR-027 (Threads, Sessions, and Agent Identity) — amended in Phase 7.
- `register-identity-on-thread-join` rule — referenced from Phase 6.
- `update-config` skill — Phase 8 confirmed not required; the Claude Code
  statusline wiring landed via direct `.claude/settings.json` edit plus a
  `.claude/scripts/` shim.
- Memory: feedback "Platform-independent shared concerns" — this plan
  is the worked example.

---

## Foundation Alignment

- **principles.md §Strict and Complete**: no rule weakening; all gates apply.
- **principles.md §Architectural Excellence**: identity becomes a
  pure function of seed, not an ad-hoc artefact — root-cause fix of
  cross-platform identity drift, not a workaround.
- **schema-first-execution.md**: not applicable (no OpenAPI schema);
  vendored wordlists are hand-written, but the typed surface is
  schema-shaped.
- **testing-strategy.md §TDD**: Phase 1 RED-first.
- **PDR-027**: this plan extends the identity model with a derivation
  default; PDR amendment recorded in Phase 7.
- **Platform-independent shared concerns** (named feedback memory):
  agent-tools is the canonical home; per-platform wrappers are thin
  shims.

---

## Reviewer Scheduling

- **Pre-execution (Phase 0 close)**:
  - `assumptions-reviewer` — completed 2026-04-26; corrections accepted
    for override shape, seed semantics, email fallback, and wrapper deferral.
  - `code-reviewer` — completed 2026-04-26; corrections accepted for
    E2E built proof, DI-based CLI tests, script invocation, and wrapper deferral.
- **During**:
  - `type-reviewer` after Phase 1 (`IdentityResult` surface; readonly
    arrays; no widening).
  - `architecture-reviewer-fred` after Phase 1 (boundary placement of
    `wordlists.ts` — could it live in `@oaknational/sdk-codegen`'s
    config tree, or is `agent-tools` correct?).
  - `test-reviewer` after Phase 1 (distribution-property test design;
    E2E built-artifact proof placement).
  - `security-reviewer` after Phase 4 (statusline wrapper — does it
    leak the seed to logs? Is the `OAK_AGENT_IDENTITY_OVERRIDE` env
    var safe to be visible in process listings? trade-offs).
    **Disposition (Phase 8, 2026-04-27)**: deferred without dispatch.
    Threat model is developer-local: `session_id` seeds are non-secret
    rotating tokens that the harness already exposes via stdin; the
    `--seed <session_id>` argument appearing in `ps` listings on a
    single-developer machine is acceptable. `OAK_AGENT_IDENTITY_OVERRIDE`
    is documented and operator-set. Re-open if/when the tool moves to a
    shared-tenant environment.
- **Post (Phase 7)**:
  - `docs-adr-reviewer` — PDR-027 amendment quality.
  - `release-readiness-reviewer` — explicit GO/NO-GO before merging
    Phase 1–5 (Phases 6–7 land separately).

---

## Notes

### Why grouped wordlists, not a flat list?

Names with thematic coherence (`lunar-orbiting-comet`,
`abyssal-fathoming-sextant`, `verdant-blossoming-grove`) read as
characters. Flat random vocabularies (`ethereal-alpaca`,
`gilded-fishing-fern`) feel like assembled tokens. The user's design
choice imposes character on the namespace.

### Why a multistage hash tree, not one big modulo?

Predictable separation: each slot draws from a slot-specific
distribution. A flat modulo over `groups × adj × verb × noun` would
have the same uniqueness properties but would lose the "this stage
chose the group" decomposition — which is what enables groupwise
weighting, group-specific filtering, or per-group themed expansions
later.

### Why 16 bytes reserved?

Future-extension slack at zero cost. Plausible uses: (a) a fifth slot
(adverb? colour?), (b) a checksum byte for typo-detection, (c) a
language-variant token, (d) an emoji indicator, (e) versioning the
derivation algorithm.

### Why owner approval first?

The wordlists are *vocabulary the project's identities will live in*
for as long as the tool exists. Getting them wrong (offensive
combinations, accidental real-name collisions, jarring tone) would
be embarrassing and require a coordinated migration. One review pass
costs ~10 minutes and prevents that class of failure.

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
  attribution, statusline). Owner approval is required on the seed
  wordlists before any code lands.
todos:
  - id: phase-0-owner-approval
    content: "Phase 0: owner reviews and approves the three themed wordlists in §Wordlists below (or supplies replacements). No code lands until this gate clears."
    status: pending
  - id: phase-1-core-derivation
    content: "Phase 1: core derivation module + tests. Pure deriveIdentity(seed, options) function with multistage SHA-256 hash routing through group → adjective → verb → noun. RED-first."
    status: pending
  - id: phase-2-cli
    content: "Phase 2: bin entry point at src/bin/agent-identity.ts; package.json script; help text; override env var; exit codes."
    status: pending
  - id: phase-3-build-integration
    content: "Phase 3: tsconfig.build.json includes the new bin; pnpm build emits dist/bin/agent-identity.js with shebang; verify the dist invocation works end-to-end."
    status: pending
  - id: phase-4-claude-code-statusline
    content: "Phase 4: thin Claude Code statusline wrapper that reads session_id from stdin JSON and invokes the built CLI. Adds the identity to the statusline render."
    status: pending
  - id: phase-5-codex-cursor-wrappers
    content: "Phase 5: equivalent thin wrappers for Codex and Cursor harnesses (deferred if those harnesses lack a session-stable identifier or statusline surface; document the gap explicitly)."
    status: pending
  - id: phase-6-collaboration-integration
    content: "Phase 6: update .agent/skills/start-right-quick + start-right-thorough so identity registration calls the derivation tool by default; thread next-session records and active-claims agent_name fields can be auto-suggested."
    status: pending
  - id: phase-7-docs-and-adr
    content: "Phase 7: README + TSDoc on the public surface; PDR amendment to PDR-027 documenting the derivation default with override semantics; update register-identity-on-thread-join rule to reference the tool."
    status: pending
---

# Agent Identity Derivation Tool

**Last Updated**: 2026-04-26
**Status**: 🔴 NOT STARTED — owner approval gate (Phase 0) blocks Phase 1.
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
selection from a personal choice into a pure function of session_id
(or any stable seed). Same session, same identity, every invocation,
every platform. Names retain personality through *grouped, themed*
wordlists rather than a flat random vocabulary — `lunar-orbiting-comet`
reads as a coherent identity, not assembled noise.

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
  `agent-tools/dist/bin/agent-identity.js` (shebang preserved). All
  consumers invoke the **built** version, not the source. This matches
  the convention of the three existing bins in the workspace.
- **Core module**: `agent-tools/src/core/agent-identity/` containing:
  - `wordlists.ts` — typed exports of the group/adj/verb/noun arrays
    (vendored, version-controlled, no external dependency).
  - `derive.ts` — pure `deriveIdentity(seed: string, options?)` →
    `IdentityResult`.
  - `hash.ts` — small wrapper around `node:crypto.createHash('sha256')`
    that returns typed slices of the digest as 32-bit unsigned integers.

### Public surface

```typescript
export interface IdentityResult {
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

export interface DeriveIdentityOptions {
  /** If set, returned verbatim (after format normalisation). Override path. */
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

If either is set, the override string is **returned verbatim** (after
trim/whitespace normalisation); derivation is bypassed. The
`seedDigest` field is still populated from the original seed for audit
traceability.

### CLI shape

```text
Usage: agent-identity [--seed <seed>] [--format <kebab|display|json>] [--help]

  --seed <seed>       Stable seed (default: $CLAUDE_SESSION_ID, then $OAK_AGENT_SEED, then `git config user.email`).
  --format <fmt>      Output format. kebab (default) | display | json.
  --help              Print help and exit 0.

Override: $OAK_AGENT_IDENTITY_OVERRIDE bypasses derivation.

Exit codes:
  0  success
  2  bad usage (unknown flag, missing seed when no fallback resolves)
```

Seed-resolution chain when `--seed` is omitted matches the resolution
expected by harness wrappers (Claude Code statusline pipes
`session_id`; Codex/Cursor analogues vary; falling back to `git config
user.email` gives a sensible per-machine identity for local CLI usage).

### Build and consumer invocation

- `agent-tools/tsconfig.build.json` already compiles `src/**` to
  `dist/`; the new bin needs no config change beyond adding to the
  default include set.
- Consumers invoke `node agent-tools/dist/bin/agent-identity.js …` (or
  the package script `pnpm --filter @oaknational/agent-tools exec
  agent-identity …`).
- The Claude Code statusline wrapper is one shell line:
  `node $(git rev-parse --show-toplevel)/agent-tools/dist/bin/agent-identity.js --seed "$(jq -r '.session_id')" --format display`.

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

Owner reads §Wordlists and §Solution Architecture; approves verbatim
or supplies replacements. **No code lands until this clears.**

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
2. Distribution sanity: 1000 random seeds produce names spread across all 3 groups (each group hit at least 100 times).
3. Override bypass: `options.override` returns the override verbatim, regardless of seed.
4. Empty seed: throws or returns a controlled error (decide at implementation time; document chosen behaviour).
5. Format invariants: `slug` is lowercase-kebab; `displayName` is Title Case Space-separated; `seedDigest` is 64-char hex.
6. Hash slicing: `digest[0..3]` interpreted as uint32 BE, modulo 3 (groups.length), produces the documented group; pin one example.

**Acceptance**:

- ✅ All RED tests written first; all fail with module-not-found.
- ✅ GREEN implementation makes them pass.
- ✅ `pnpm --filter @oaknational/agent-tools test type-check lint` exits 0.
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
- ✅ Seed-resolution chain works (test by stubbing env vars in unit tests; do NOT touch process.env globally per `tests-no-global-state` feedback memory).
- ✅ `package.json` adds `"agent-identity": "tsx src/bin/agent-identity.ts"` to scripts.

### Phase 3 — Build integration

**Acceptance**:

- ✅ `pnpm --filter @oaknational/agent-tools build` emits
  `dist/bin/agent-identity.js` with shebang.
- ✅ `chmod +x dist/bin/agent-identity.js` succeeds via build (or via an
  inline shebang pattern matching the existing bins).
- ✅ Direct invocation works:
  `node agent-tools/dist/bin/agent-identity.js --seed test --format display`
  → `Iridescent Eclipsing Eclipse` (or whichever derivation the seed produces).
- ✅ `pnpm build` from repo root succeeds.

### Phase 4 — Claude Code statusline wrapper

**Decision**: install via `update-config` skill (settings.json) so the
statusline is configured at the harness layer, not committed to the
repo (per the user's working pattern for personal harness config).

**Acceptance**:

- ✅ `~/.claude/settings.json` (or `.claude/settings.local.json`)
  contains a `statusLine` entry that pipes the stdin JSON's
  `session_id` through `node <repo>/agent-tools/dist/bin/agent-identity.js`.
- ✅ Identity renders in the statusline within the running session.
- ✅ Override env var still wins (operator can set
  `OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast"` and the statusline
  shows that name).

### Phase 5 — Codex / Cursor wrappers

**Acceptance**:

- ✅ Codex equivalent: identify the harness's session-stable
  identifier (or document the gap if none); add a wrapper script if
  feasible.
- ✅ Cursor equivalent: same.
- ✅ For each platform that lacks a session-stable identifier,
  document the fallback (per-machine `git config user.email` seeding)
  and the consequence (identity changes only across machines, not
  across sessions).

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
- `agent-tools/src/core/agent-identity/index.ts` — extensive TSDoc on
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

---

## Testing Strategy

### Unit Tests (Phase 1, 2)

- Determinism property: 100 fixed seeds → 100 stable outputs.
- Distribution property: 10,000 random seeds → uniformity ±5% across groups (with 24,000 unique names, no collision pressure expected).
- Override bypass: explicit + env var.
- Hash slicing pinned with documented byte vectors.
- CLI: argv parsing, format flags, exit codes, help, seed-resolution chain.

### Integration Tests (Phase 3)

- Built `dist/bin/agent-identity.js` invoked end-to-end via `node` produces the expected output (separate test config like the existing `vitest.e2e.config.ts` if needed; otherwise a single integration test that runs `pnpm build` then `spawnSync`).

### Property Tests (consideration)

- Optional, deferrable to a follow-up: every byte sequence as a seed yields a valid identity (no out-of-range index, no exception).

---

## Verification (end-to-end)

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
node agent-tools/dist/bin/agent-identity.js --help
node agent-tools/dist/bin/agent-identity.js --seed example-session-id-001 --format display
# Expected: deterministic name, e.g. "Lunar Orbiting Comet"
node agent-tools/dist/bin/agent-identity.js --seed example-session-id-001 --format display
# Expected: identical output (determinism check)
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" node agent-tools/dist/bin/agent-identity.js --seed any --format display
# Expected: "Frolicking Toast"
```

After Phase 4 (Claude Code statusline wrapper), the identity should
visibly render in the harness statusline within a fresh session.

---

## Out of Scope

- Persistent identity across machines (the seed is the session_id, which
  is per-machine; cross-machine identity persistence requires a
  different design and is not in scope).
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
| Different platforms expose different "session_id" semantics | MEDIUM | Phase 5 documents per-platform fallbacks; the tool accepts any string seed, so harness wrappers normalise. |
| Override env var leaks into multi-agent settings (one identity for two agents on same machine) | MEDIUM | Document explicitly: override is per-shell; session-scoped harness should set/unset around session boundaries; PDR-027 amendment covers this. |
| Hash bias on small lists | NEGLIGIBLE | Modulo-bias for 20-item lists is bounded by 2^32 / 20 ≈ 1e-9 effect; uniformity test catches anomalies. |
| Agent-tools build pipeline change ripples to other consumers | LOW | Adding a new bin is additive; existing bins unaffected; tsconfig.build.json includes `src/**` already. |
| Frolicking Toast's umbrella claim covers start-right skills (Phase 6) | KNOWN | Phase 6 waits explicitly for that umbrella to close; Phases 0–5 are independent. |
| The PR-87 active session attempts to land Phase 1 on the same branch | DEFENDED | This plan is owner-directed to run in a separate parallel session; PR-87 session does NOT touch agent-tools. Tooling is on its own branch. |

---

## Dependencies

**Blocking**:

- Phase 0 owner approval blocks Phase 1+.
- Phase 6 blocks on Frolicking Toast umbrella claim `4535f2ff` closing
  (start-right skills are inside that pathspec).

**Related**:

- PDR-027 (Threads, Sessions, and Agent Identity) — amended in Phase 7.
- `register-identity-on-thread-join` rule — referenced from Phase 6.
- `update-config` skill — used in Phase 4 for statusline wiring.
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
  - `assumptions-reviewer` — wordlist proportionality, hash-routing
    design, override-semantics framing.
  - `code-reviewer` — gateway review of this plan body.
- **During**:
  - `type-reviewer` after Phase 1 (`IdentityResult` surface; readonly
    arrays; no widening).
  - `architecture-reviewer-fred` after Phase 1 (boundary placement of
    `wordlists.ts` — could it live in `@oaknational/sdk-codegen`'s
    config tree, or is `agent-tools` correct?).
  - `test-reviewer` after Phase 1 (distribution-property test design;
    flake risk on the 10,000-seed uniformity assertion).
  - `security-reviewer` after Phase 4 (statusline wrapper — does it
    leak the seed to logs? Is the `OAK_AGENT_IDENTITY_OVERRIDE` env
    var safe to be visible in process listings? trade-offs).
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

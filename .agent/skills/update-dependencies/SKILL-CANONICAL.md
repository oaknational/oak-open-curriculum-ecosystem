---
name: update-dependencies
classification: active
description: >-
  Update npm dependencies deliberately — summon on "dependabot alert",
  "pnpm audit findings", "raise a security floor", "dep sweep", "bump a
  dependency", "pnpm override", or any advisory/currency/forced-bump
  trigger. Three entry doors: security-advisory response, routine
  currency sweep, upstream-forced bump. Core is the mechanism-decision
  tree (in-range lockfile refresh → package.json bump → override floor,
  in that preference order; existing floors are RAISED, never twinned)
  plus a verification tail proving floors bind and the fix survives a
  lockfile rebuild. Do NOT use for github-actions version bumps
  (Dependabot owns those), and never accept a Dependabot npm PR (its
  resolver trips minimumReleaseAge — unmergeable here).
  Failure shapes it exists to prevent: an open floor silently adopting
  an unreviewed major; loosening or removing a floor to make install
  pass; crossing a held major (live hold list in build-system.md);
  hand-editing pnpm-lock.yaml; trusting one advisory instrument's
  count as the whole picture.
---

# Update Dependencies

**Governance**: the knowledge home is
[`docs/engineering/build-system.md` §Dependency updates](../../../docs/engineering/build-system.md)
— agent-run sweeps not Dependabot-npm, the held majors and their
lift conditions, the `minimumReleaseAge` mechanism. This skill is the
summonable routing: the decision tree, the verification tail, and the
failure shapes, applied at the moment a trigger fires. The override
comment discipline is modelled by `pnpm-workspace.yaml`'s MCP-549-era
floors — reachability, bound rationale, and a lift condition on each;
the pre-lane floors converge to that shape through the routed
bounds-and-comments sweep, so read the commented floors as the
pattern, not every entry as already compliant. Sibling maintenance skills:
[`update-upstream-api-spec`](../update-upstream-api-spec/SKILL-CANONICAL.md),
[`update-bulk-download-schema`](../update-bulk-download-schema/SKILL-CANONICAL.md).

## Use When

- A security advisory fires (Dependabot alert, `pnpm audit` finding, a
  disclosure wave) touching any resolved package.
- A routine currency sweep is due (`pnpm -r outdated` backlog).
- A consumer forces a bump (peer conflict, needed feature, upstream
  requirement).

Not for: github-actions bumps (`.github/dependabot.yml` owns those);
the held majors' lift decisions (those are owner/ADR moments — this
skill STOPS at them and surfaces).

## Step 0 — The census (always, before any edit)

1. `pnpm audit --json` AND `pnpm audit --prod --json` — capture both to
   files on first run. `pnpm -r outdated` (exits 1 whenever anything is
   outdated — in-band signal, not failure).
2. **Instruments disagree by design**: Dependabot alerts, `pnpm audit`
   full scope, and `--prod` scope each see different sets (worked
   instance 2026-08-11: Dependabot 8 vs audit 12/11 — audit saw two
   highs Dependabot lagged on). Reconcile counts; done-when is EVERY
   FINDING RECONCILED on every instrument — cured, or documented as an
   explicitly owner-accepted residual with its lift condition (step 8).
   For HIGH/CRITICAL findings in production-reachable dependencies,
   ADR-174 sets the acceptance bar above that: a TIME-BOUNDED owner
   disposition with named compensating controls — an event-based lift
   condition alone is below policy, and the finding stays a release
   blocker until that disposition exists.
   One instrument's zero is never done, and forcing an incompatible
   version to make a census read zero is the failure, not the cure.
3. **Diff the live advisory set against the existing override floors.**
   Floors drift silently between sweeps (worked instance 2026-08-11:
   three floors sat one micro-version below freshly-patched releases).
   This drift-check is the standing refresh loop; it fires on every
   summon, whichever door opened it.
4. Per advisory package, first-hand: `pnpm why -r <pkg>` (the real
   chains), direct-vs-transitive (`grep` the manifests), the patched
   version's PUBLISH DATE (`pnpm view <pkg> time`), and whether the
   parent's declared range admits the patch.

## The mechanism-decision tree

Work per PACKAGE (advisories group by package lineage, not alert), in
preference order — the first mechanism that cures TREE-WIDE wins. One
invariant rides ABOVE the order: when the package already carries an
override floor, the curing change also raises that floor to the
patched version (or retires it when its removal conditions are met),
WHICHEVER step cures resolution — terminating at steps 1–3 with a
stale floor standing recreates the drift the opener's drift-check
exists to catch, and the verification tail's `pnpm why` proves only
the selected version, never the floor:

1. **Direct dependency, declared range admits the target** →
   `pnpm update -r --no-save <pkg>` (the in-range, lockfile-only
   refresh; `--no-save` — "Don't update the ranges in package.json" —
   verified present in pnpm 11.20's own help. WITHOUT the flag,
   `pnpm update` SAVES manifest ranges by default: the caret-minima
   rewrites on the 2026-08-11 wave, e.g. ^1.62.0→^1.62.1, are that
   default in action. Assert scope with `git status` after either
   form). Edit the `package.json` range only when the range does NOT
   admit the target — then the manifest edit IS the intended record,
   not churn.
2. **Transitive with a DIRECT parent whose bump re-resolves it** →
   refresh the parent with the same discipline as step 1
   (`pnpm update -r --no-save <parent>` when the declared range
   already admits the curing release; edit the manifest only when it
   does not). Verify the cure is
   tree-wide: a direct-parent bump creates a fresh node whose subtree
   resolves newest-in-range, but TRANSITIVE instances of the same
   parent keep their old pins and their vulnerable subtrees (worked
   instance 2026-08-11: a direct postcss bump left transitive postcss
   nodes still carrying vulnerable nanoid).
3. **Transitive, no full parent route** → `pnpm-workspace.yaml`
   override floor. There is NO name-targeted transitive refresh:
   `pnpm update -r <pkg>` and `--depth Infinity` both exit 0 and no-op
   on transitive-only packages (pnpm 11.20, verified 2026-08-11), and
   `pnpm dedupe` consolidates duplicates — it cannot move a
   single-instance pin. The floor is the sanctioned tree-wide mover;
   record the demonstrated necessity in its comment.
4. **A floor already exists for the package** → RAISE it in place,
   never add a twin entry — and per the invariant above, the raise
   rides along even when an earlier step already cured resolution.
5. **Bound every floor that could coerce** — an override REWRITES
   dependents' recorded ranges in the lockfile (peer ranges included),
   so an unbounded floor both adopts the next major unreviewed AND
   silences the peer conflict that should have blocked it. Bound below
   the next major when one exists; bound to the consumed line when
   consumers declare `^` ranges an open floor would drag across an
   incompatible major (worked near-miss 2026-08-11: an unbounded
   nanoid floor would have coerced postcss's `^3.x` onto ESM-only
   majors). Bound even when the next major does not yet exist
   (`<N+1`): a dated no-next-major note does not constrain the
   resolver — an open floor admits the next major the day it
   publishes, so the bound is what makes review-at-the-major
   structural rather than aspirational. And
   inspect EVERY consumed line first (`pnpm why -r`): when consumers
   sit on multiple major lines, one global floor drags earlier-major
   consumers up onto the floor's major — use parent-scoped overrides
   per line instead of a single tree-wide range, and QUALIFY the
   parent (`parent@1>child` — pnpm's documented dependent-scoped
   selector): an unqualified `parent>child` binds every consumed
   version of that parent, so it cannot isolate one line.
6. **The fix crosses a held major** (build-system.md §Dependency
   updates carries the LIVE hold list and lift conditions — read it,
   never a remembered copy) → STOP and surface; the hold's lift
   condition governs, never the sweep.
7. **The target version is younger than the configured
   `minimumReleaseAge` floor** (read the value from
   pnpm-workspace.yaml) → two outcomes, both verified first-hand 2026-08-11 on
   pnpm 11.20. When the requested range admits an older mature
   version, the resolver SILENTLY excludes the young one and picks
   the newest version older than the floor — exit 0, no warning.
   When NOTHING mature satisfies the request (an exact pin to a
   too-young version), pnpm refuses loudly with
   ERR_PNPM_NO_MATURE_MATCHING_VERSION, naming each too-young
   package. Consequence of the silent branch: age-floored targets
   are INVISIBLE to
   `pnpm outdated` — its "latest" is computed under the floor too, so
   the row reads current (observed 2026-08-11). An outdated-zero
   therefore does not mean fully-current: name age-floored rows from
   publish-date reads (`pnpm view <pkg> time`), never from outdated's
   silence. The age-floored SET is discoverable only exhaustively:
   outdated suppresses the very names you would probe, so at
   sweep-exit census every EXTERNAL direct dependency (skip
   `workspace:*` internals — `pnpm view` on a private name queries
   the public registry and fails or matches an unrelated package) —
   `pnpm view <pkg> version` (registry latest, floor-blind) against
   the resolved/wanted version — and classify each gap by publish
   date:
   younger than the floor's window = age-floored (arrives next
   sweep); older = a held or missed row that needs a named cause.
   Wait the floor out, or make a deliberate
   `minimumReleaseAgeExclude` entry as its own reviewed decision —
   never a workaround.
8. **The advisory's patched version does not exist for the resolved
   line** → verify before promising a cure: `pnpm audit`'s
   `patched_versions` can be a SYNTHETIC above-range rendering (the
   GitHub advisory's `first_patched_version` is NULL; worked instance:
   ">=3.0.98" printed for a line ending at 3.0.31). Do not force. Try
   the parent-bump route, else surface the residue honestly with the
   evidence and route the acceptance decision to the owner.

Traps that ride the mechanisms: `pnpm update` SAVES manifest range
changes by default — assert the intended file scope with `git status`
after every update command; any grep-based verification must use POSIX
classes (`[[:space:]]`), because BSD grep silently mismatches `\s` and
a zero-match sweep reads as a confirmed negative.

## The verification tail (per PR, before it opens)

- **Cure outcomes hold**: `pnpm why -r <pkg>` shows ≥ patched for
  every cured package. This proves the SELECTED version, never that
  the floor bound it — a dependency already resolving above the patch
  passes with the floor inert. The BINDING proof is the before/after
  resolution delta observed when the floor is added or raised (the
  pre-cure read showed the vulnerable pick; the post-cure read shows
  the floored one — record both) — valid only when the floor is the
  SOLE change in that resolve. When a floor rides along another
  curing step (the stale-floor invariant), the delta cannot isolate
  it: classify that floor as PREVENTATIVE (it guards rebuild-time
  resolution) rather than attesting it bound. On later sweeps the opener's
  drift-check owns floor staleness; this assertion owns outcomes.
- **Audit recomputed**: `pnpm audit` both scopes; name any deliberate
  residue in the PR body.
- **Lockfile diff read**: distinguish renormalisation noise from real
  resolution changes (a first dep-touching PR after a pnpm minor can
  carry a large no-new-versions rewrite — check for new
  `resolution: {integrity` lines; one body sentence explains the noise).
- **Rebuild survivability** (`lockfile-rebuild-survivability` rule —
  run ALL FOUR of its assertions, by result): copy the lockfile aside
  (`cp pnpm-lock.yaml <backup>` — never `git checkout` it back; with
  uncommitted work in flight that checkout DISCARDS it, the
  `never-use-git-to-remove-work` class), delete it, full
  `pnpm install`, then assert (1) every floor re-resolves at or above
  its value, (2) every documented hold still binds, (3) the audit
  outcome is unchanged, (4) after restoring the backup,
  `CI=true pnpm install --frozen-lockfile` succeeds — the check that
  exposes override/manifest desync before CI does. The regenerated
  lockfile is EVIDENCE, never committed (byte-identical regeneration is
  the strongest result).
- **PR opens as draft with the `jimbot` label** (owner ruling
  2026-08-11: every PR under the owner's or the bot's identity carries
  it at creation) and **gates green**; reachability reasoning for
  production-chain advisories recorded in the PR body (cure regardless
  — reachability prices urgency, never skips the cure).
- **Multi-PR waves may use GitHub PR stacks** (owner sanction
  2026-08-11, "where appropriate"): main's ruleset binds every stack
  member including mid-stack; merge bottom-up one-at-a-time on the
  standard path; at each merge the next PR auto-retargets via
  cascading rebase, so its tip MOVES — full re-settle and recount
  before its grant, and prefer the local `gh stack rebase` under bot
  identity over the server-side cascade (a server rebase rewrites
  committer identity). State reachability at the
  right rung: a package in a production dependency chain is a
  "production dependency"; PRODUCTION-REACHABLE additionally requires
  the RUNTIME call path (which import runs, on which route) — a
  dependency edge into code the app never executes is not runtime
  reachability (worked instance 2026-08-11: express-rate-limit lives
  only in SDK OAuth handlers the app bypasses). A reachability verdict
  is dated evidence about one resolution and one estate shape, never a
  property of the package: re-verify the resolved version and the
  estate before reusing one (worked instance: a 2026-07-24
  "next unreachable / defer sharp" verdict pair was invalidated within
  three weeks — a demo became a deployed Next surface, and sharp
  resolved past the advisory floor on the ordinary patch sweep).

## Failure shapes this skill exists to prevent

- Accepting a Dependabot npm-ecosystem PR (its resolver pulls sub-24h
  transitives and trips `minimumReleaseAge` at CI install —
  structurally unmergeable; the alerts stay on, the PRs do not).
- An unbounded floor adopting the next major unreviewed.
- Loosening, removing, or twinning a floor to make install pass.
- Crossing a held major inside a sweep.
- Hand-editing `pnpm-lock.yaml` (it is pnpm-generated, only).
- Reading one instrument's zero as done (audit-prod clean while
  Dependabot still shows open alerts, or vice versa).

## Related

- [`docs/engineering/build-system.md` §Dependency updates](../../../docs/engineering/build-system.md)
  — the knowledge home: sweeps-not-Dependabot, held majors, lift
  conditions.
- [`lockfile-rebuild-survivability`](../../rules/lockfile-rebuild-survivability.md)
  — the rebuild invariant the verification tail proves.
- [`never-disable-checks`](../../rules/never-disable-checks.md) — why a
  failing gate is never the thing to loosen.
- `pnpm-workspace.yaml` — the override comment discipline, modelled in
  place.
- Future-work pointers (deliberately NOT built here): a
  floors-vs-advisories drift validator; scheduled sweep triggering.

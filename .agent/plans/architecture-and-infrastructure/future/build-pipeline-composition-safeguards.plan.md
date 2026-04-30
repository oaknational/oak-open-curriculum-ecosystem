# Build Pipeline Composition Safeguards

**Status**: 🔵 STRATEGIC BRIEF (not yet executable)
**Last Updated**: 2026-04-30

## Problem and Intent

Vercel production was red for the four most recent `chore(release)` commits
on main (1.6.1, 1.7.0, 1.7.1, plus a redeploy). The bug was an _obscured
composition error_: every layer in the chain made a defensible local
choice, and the failure was emergent from their interaction.

The full chain reconstructed during the 2026-04-30 Briny Lapping Harbor
investigation:

1. `pnpm/action-setup@v6.0.2` is pinned in our workflows by the highest
   version-number SHA. GitHub's `/releases/latest` for that action is
   `v5.0.0` — the maintainers held the Latest marker on v5.0.0 as their
   stability signal. v6.0.x is an active stability saga
   (`pnpm/action-setup#228` open).
2. v6.0.x installs **pnpm 11** as the launcher (regardless of the
   `packageManager` field's pinned 10.33.2).
3. pnpm 11 reads `packageManager: pnpm@10.33.2`, decides to delegate
   the install to 10.33.2, and as part of its self-management
   bookkeeping **writes the env-lockfile as a separate first YAML
   document** in `pnpm-lock.yaml` — _before_ delegating execution.
4. Pnpm 10.33.2 then runs the actual install. The "Done in 4.1s using
   pnpm v10.33.2" line is genuine; it's that pnpm's banner. But the
   multi-document preamble is already on disk from step 3.
5. `@semantic-release/git` stages `pnpm-lock.yaml` (declared asset)
   and commits the dual-doc form on every release commit.
6. Vercel's installer takes the full-parse path on a fresh install
   (no node_modules cache). pnpm's full-parse path **rejects
   multi-document streams** ("expected a single document in the stream,
   but found more"). Falls back to npm registry fetch.
7. Node 24's strict `URLSearchParams` rejects `this`-binding patterns
   in pnpm's registry-fetch code (`ERR_INVALID_THIS`). Build dies
   hard rather than slowly succeeding via fallback.

Local pnpm 10.33.2 **reads** the dual-document form successfully when
`node_modules` is populated (fast path) — which is why no developer
saw the bug locally. Only fresh-state installs (Vercel, fresh CI)
hit it.

The immediate fix landed in `0929615e` (re-pin to v5.0.0 + regen
lockfile single-doc). This brief captures the _prevention surface_
for the class of failure.

## Domain Boundaries and Non-Goals

**In scope**:

- GitHub Action SHA pinning hygiene (which tag's SHA do we pin?) — the
  general structural problem this brief addresses.
- Composition-obscurity investigation methodology as supporting
  insurance — what catches problems when the structural pin guard
  ever lets one through.

**Out of scope**:

- General supply-chain risk programme (SBOM, signing, attestation).
- Pinning third-party non-Action dependencies (npm, GitHub Apps, etc.).
- Renaming or restructuring the release pipeline.
- Disabling pnpm's `managePackageManagerVersions` default — explicitly
  rejected by owner during the 2026-04-30 investigation: "we are
  not turning off a canonical, standard, and default feature".
- **Multi-document `pnpm-lock.yaml` shape gate** — considered and
  rejected during this brief's authoring as too brittle. pnpm 11
  stable will eventually produce multi-document lockfiles
  legitimately; that is the design intent of the env-lockfile
  feature. A static rejection of `^---$` would block valid output as
  soon as our consumer chain catches up. The build log already
  carries the load-bearing signal ("expected a single document in
  the stream"); the methodology surface below covers reading that
  signal correctly.

## The Pinning Hygiene Surface

### Principle

**Pin SHAs from the maintainer's `/releases/latest`, not from the
highest version number.** The two diverge precisely when a release
line is unstable — exactly when the divergence matters most. "Highest
tag" is a mechanical fact; "Latest" is a maintainer judgement. Tools
that bump by mechanical fact (Dependabot's default; many ad-hoc bump
scripts) silently violate the principle.

### Mechanism candidates (decide at promotion time)

1. **Local validator** (`scripts/validate-action-pin-hygiene.ts`,
   following the canonical validator family pattern from
   `validate-portability.ts` etc.) — for every `uses: org/repo@<sha>`
   in `.github/workflows/`, query
   `https://api.github.com/repos/<org>/<repo>/releases/latest` and
   compare the resolved Latest SHA to the pinned SHA. Fail when
   divergent.
2. **Dependabot configuration** — currently we don't have one. If we
   add `.github/dependabot.yml`, constrain it to only propose bumps
   when the Latest marker moves. (Dependabot's default behaviour is
   "bump to highest tag" — that is the substrate of the failure
   class.)
3. **Pre-commit hook** — block commits whose `.github/workflows/`
   diff introduces a SHA that does not resolve to Latest.

The validator and Dependabot config are complementary: the validator
catches existing drift; the Dependabot config prevents future drift at
the proposal stage. Both lean on the same signal — the maintainer's
Latest release.

### Open questions before promotion

- Where does the validator run? Pre-commit hook (cheap, network-flaky)
  vs. CI gate (network-stable, slower feedback).
- How are deliberate pre-release pins handled? (Sometimes opting into
  an unstable pre-release is correct.) An allowlist file, a per-line
  annotation, or strict-mode-with-overrides?
- Cost of GH API calls per CI run × number of actions; rate limits.
- "Latest moved" — when a maintainer promotes a new release to Latest,
  the validator should surface this as a healthy signal (we should
  bump), not a violation. Distinguish "your pin is stale" (bump
  proposal) from "your pin diverges from Latest at write time"
  (block).

## Investigation Methodology — Insurance When Pinning Fails

The pinning hygiene surface above is the structural fix, but no
structural guard is total. Mechanism gaps, allowlisted exceptions, and
emergent saga states (Latest moves mid-investigation) leave residual
exposure. The insurance is reading load-bearing signals fast.

When a bug spans multiple sensible-in-isolation layers (composition
obscurity), the cost is _composition cost_, not bug cost — every layer
defends itself, the failure is emergent, no single fix targets the
root. The 2026-04-29 plus 2026-04-30 saga had its load-bearing
diagnostic in the Vercel build log the entire time:

```text
WARN  Ignoring broken lockfile at /vercel/path0:
The lockfile at "/vercel/path0/pnpm-lock.yaml" is broken:
expected a single document in the stream, but found more.
```

Two sessions read past this line before recognising it as load-bearing.
The thing that changed in 2026-04-30 was not the signal — it was
knowing what the signal meant.

**Investigation methodology** (already partially documented in
`distilled.md`, the 2026-04-29 napkin, and ranked feedback memories;
worth canonicalising into one place):

1. **Read the build log first.** The signal is in the artefact, not
   in the prior session's speculation list. Speculation lists are
   negative hypotheses (what to falsify), not narrowing tools.
2. **Workspace-first before remote tooling.** Local artefacts
   (`vercel_logs/`, `test-results/`, `coverage/`) before remote MCP
   queries. Already in `feedback_workspace_first_for_diagnostics`.
3. **Upstream issue tracker before local theory-spinning.** When a
   tool's behaviour seems inconsistent across environments, the
   maintainer probably already has an open issue with the precise
   reproduction, root cause, and version landscape.
4. **Version archaeology.** When a regression appeared, identify the
   precise pin that authored it. "Highest tag" pins almost always
   reward this archaeology.

This methodology is a Pending-Graduation candidate under
`composition-obscurity-investigation-methodology`, then graduates
through the [PDR-038](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md)
and [PDR-039](../../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md)
discipline.

## Dependencies and Sequencing

- **Pinning hygiene surface is the structural fix**; the methodology
  surface is a doctrine artefact that graduates when the
  Pending-Graduation register's owner-direction trigger fires. They
  proceed independently.
- The
  [`scripts-validator-family-workspace-migration.plan.md`](scripts-validator-family-workspace-migration.plan.md)
  plan covers where new validator scripts should live structurally.
  This plan should _not_ author `scripts/validate-*.ts` files in the
  legacy location once that migration begins; it should follow the
  new home.

## Success Signals (justify promotion)

This brief becomes promotable when **any of**:

1. A second composition-obscurity instance accumulates (e.g. another
   action-pin SHA divergence with downstream consequences) and the
   register-graduation trigger fires.
2. Owner directs proactive enforcement.
3. A near-violation emerges: a developer or Dependabot proposes a
   pin that diverges from Latest, and we want the gate live before
   it lands.
4. The pnpm/action-setup v6.0.x stability saga resolves (Latest moves
   to v6.x.x), at which point the validator's first-execution will
   surface that we should bump our pin in line with the new Latest.

## Risks and Unknowns

- **Dependabot proposes v6.0.x bumps anyway**. Without a config
  constraint, Dependabot will keep proposing bumps from v5.0.0 to
  highest-v6.0.x. The pinning hygiene surface must include either a
  Dependabot config or a strong reviewer-side check that recognises
  the Latest-vs-tag pattern.
- **GH API rate limits** for the validator. Authenticated CI runs
  have generous limits; pre-commit hooks may not. Calibration needed.
- **Latest marker drift**. Maintainers occasionally promote a release
  retroactively (e.g. when v6.0.4 stabilises). Validator should
  surface "Latest moved" as a healthy signal, not a violation, when
  our pin matches the _previous_ Latest. Trade-off: alerts vs. errors.
- **pnpm fix may ship in action-setup before this brief promotes**.
  If `pnpm/action-setup` ships a v6.x with `pnpm/pnpm#11284`'s fix
  AND maintainers move Latest to v6.x, our pin becomes stale and
  the original substantive bug is fixed upstream. Validator catches
  this naturally.

## Promotion Trigger into `current/`

Owner direction OR a second composition-obscurity instance with
signature similar to this one (multi-environment behaviour mismatch
that survived local validation) OR a near-violation (proposed pin
diverges from Latest in PR review).

Implementation detail in this brief is reference context; execution
decisions (validator location, Dependabot config shape, exact
gate-firing point) finalise during promotion to `current/`.

## References

- Triggering investigation: 2026-04-30 Briny Lapping Harbor session.
- Immediate fix commit: `0929615e fix(build): pin pnpm/action-setup
to maintainer-Latest v5.0.0`.
- Pending-Graduation entry (this brief surfaces and updates it):
  _lockfile-corruption diagnosis discipline_ (2026-04-29) →
  recast as _composition-obscurity investigation methodology_.
- Upstream context:
  [pnpm/action-setup#228](https://github.com/pnpm/action-setup/issues/228),
  [pnpm/pnpm#11264](https://github.com/pnpm/pnpm/issues/11264),
  [pnpm/pnpm#11284](https://github.com/pnpm/pnpm/pull/11284).
- Doctrinal kin:
  [PDR-038](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md),
  [PDR-039](../../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md).
- Sibling validator-family work:
  [`scripts-validator-family-workspace-migration.plan.md`](scripts-validator-family-workspace-migration.plan.md).

# ADR-169: Pin GitHub Actions to Maintainer-`/releases/latest` SHA

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-040](../../../.agent/practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md) —
the general Practice-governance principle this ADR adopts; PDR-040
travels with the Core (cross-repo applicability), this ADR records the
host-specific decision and adoption mechanism for this repo's CI;
[ADR-168](168-typescript-6-baseline-and-workspace-script-architectural-rules.md) —
TS6 baseline ADR landed contemporaneously and demonstrates the
"foundational dep change with cross-cutting consequences" shape;
[`.agent/plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md) —
the strategic brief covering the validator + Dependabot config that
will operationalise this ADR; promotion-gated.

## Context

This repo's CI workflows pin GitHub Actions to specific commit SHAs
with a trailing comment naming the version tag, per
[GitHub's reusable-actions security guidance](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions):

```yaml
- uses: pnpm/action-setup@fc06bc1257f339d1d5d8b3a19a8cae5388b55320 # v5.0.0
```

Until 2026-04-30, the ad-hoc convention for which SHA to pin was
"the SHA of the highest version number tag." This is the default
behaviour of Dependabot's GitHub Actions ecosystem, and the natural
output of any "find me the latest version" lookup that uses tag
sorting. The convention has a silent failure mode: when a maintainer
holds back the GitHub `Latest` marker on an unstable release line,
the highest-tag heuristic walks past the marker and pins to the
unstable release.

Empirical instance (2026-04-30): `pnpm/action-setup` was pinned to
v6.0.2 (highest tag); GitHub's `/releases/latest` for that action
returned **v5.0.0**. The maintainers were holding the Latest marker
deliberately because `pnpm/action-setup#228` (multi-document
`pnpm-lock.yaml` regression in pnpm 11 launcher) was open. v6.0.x
broke Vercel production deploys for four consecutive `chore(release)`
commits. Re-pinning to v5.0.0's SHA cleared the failure.

The general principle has been recorded as
[PDR-040](../../../.agent/practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md).
This ADR records the host-side adoption.

## Decision

**This repo's `.github/workflows/*.yml` pins every `uses: org/repo@<sha>`
reference to the SHA returned by the maintainer's `/releases/latest`
endpoint.** The trailing `# vX.Y.Z` comment names the same tag that
the Latest marker pointed to at pin time.

The mechanism for enforcing this is staged:

- **Now (this ADR)**: the convention is documented and the
  affected workflows have been corrected. Reviewers checking PRs
  that touch `.github/workflows/` files apply the convention by hand.
- **Later (per [`build-pipeline-composition-safeguards.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md))**:
  a `scripts/validate-action-pin-hygiene.ts` validator queries each
  pinned action's `/releases/latest` and fails when the pinned SHA
  diverges from the Latest SHA. The validator runs as a CI gate and
  optionally as a pre-commit hook. A `.github/dependabot.yml`
  configuration constrains Dependabot to propose bumps only when the
  Latest marker moves.

The validator surfaces "Latest moved, please bump" as a healthy
informational signal (so the repo tracks Latest as it moves) and
"your pin diverges from Latest at write time" as a block. Distinguish
the two states.

## Override mechanism

Some pins may deliberately deviate from Latest — for example, when
the repo wants to opt into an unstable pre-release for compatibility
testing. The override mechanism, when the validator lands, is a
per-line annotation:

```yaml
# DEVIATES FROM LATEST: opt-in to v6.x for pnpm 11 testing; revisit YYYY-MM-DD
- uses: pnpm/action-setup@<sha> # v6.x.x
```

The annotation must include a revisit date. Annotations without
revisit dates are validator-rejected. This prevents drift-by-stale-
exception.

## Why this is ADR-shaped, not (only) PDR-shaped

[PDR-040](../../../.agent/practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md)
is the general principle: Practice-governance about how to relate to
upstream tools. It travels with every Practice-bearing repo.

This ADR records this repo's _adoption_ of the principle — the host-
specific architectural decision: which workflows are subject, what
the validator's location and form is, what the override mechanism is,
how Dependabot is configured. These decisions are re-derived per
repo because each repo has its own workflow surface, its own tooling
choices, and its own Dependabot expectations.

If the only artefact were PDR-040, the next contributor to this repo
would not see _that this repo enforces the principle_, _how it
enforces it_, or _what the override syntax is_. The ADR closes that
gap. PDR-040 + ADR-169 are companions, not alternatives.

## Affected workflows

- `.github/workflows/release.yml` — pinned `pnpm/action-setup` updated
  in commit `8a928821`.
- `.github/workflows/ci.yml` — pinned `pnpm/action-setup` updated in
  commit `8a928821`.

The other three pinned actions (`actions/checkout`, `actions/setup-node`,
`actions/create-github-app-token`) were already aligned with their
maintainers' Latest as of the 2026-04-30 audit.

## Consequences

**Positive**:

- Vercel release pipeline unblocked.
- Pin convention is documented and reviewable at PR time.
- Future-stable mechanism (validator + Dependabot config) has a
  clear scope and acceptance criteria via the future plan.

**Negative**:

- Until the validator lands, enforcement depends on reviewer
  attention. Reviewers checking workflow PRs must apply the
  convention by hand.
- Dependabot will continue to propose highest-tag bumps until the
  config constraint lands. Until then, those proposals will need
  reviewer-side rejection or correction.

## Future work

The full structural enforcement landscape is captured in
[`build-pipeline-composition-safeguards.plan.md`](../../../.agent/plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md).
Promotion is gated on owner direction, second cross-action
divergence instance, or near-violation in PR review.

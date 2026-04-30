---
pdr_kind: governance
---

# PDR-040: Pin to Maintainer-`/releases/latest`, Not Highest Version Number

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — this PDR's
companion ADR records the structural enforcement for this repo);
[PDR-039](PDR-039-external-findings-reveal-local-detection-gaps.md)
(external system findings reveal local detection gaps — Vercel's
build log carried the load-bearing signal for two sessions before
local discipline caught up);
[ADR-169](../../../docs/architecture/architectural-decisions/169-pin-github-actions-to-maintainer-latest-sha.md)
(host-side adoption of this principle for this repo's CI workflows).

## Context

Machine-readable upstream releases (GitHub Actions, npm packages, Docker
images, Helm charts) carry two distinct version signals:

- **Highest tag** — a mechanical fact: which version number is
  numerically largest among published tags.
- **Latest** (the maintainer's explicit promotion) — a maintainer
  judgement: which release is currently considered the recommended
  stable version for consumers.

These diverge during release sagas, beta tracks, regression cycles,
and any period when a maintainer holds back the Latest marker
deliberately. They are most likely to diverge precisely when divergence
matters most, because the maintainer's judgement is *withholding*
Latest from an unstable version specifically to protect downstream
consumers.

Tools that bump by the mechanical fact (Dependabot's default behaviour
for GitHub Actions; many ad-hoc bump scripts; `npm install
package@latest` interpreting "latest" as "newest tag rather than
maintainer-tagged latest" — the npm `latest` dist-tag is the npm
equivalent of GitHub's Latest marker, with the same semantic) silently
violate this principle. The substrate of the failure class is invisible
to the consumer until something downstream breaks.

Empirical instance (2026-04-30, this repo): `pnpm/action-setup` was
pinned to v6.0.2 (highest tag at the time). GitHub's `/releases/latest`
returned **v5.0.0**. The maintainers had held the Latest marker on
v5.0.0 throughout an active four-release stability saga (issue
[pnpm/action-setup#228](https://github.com/pnpm/action-setup/issues/228)
open, multi-doc lockfile bug). v6.0.x installed pnpm 11 as the launcher
and wrote multi-document `pnpm-lock.yaml` files that pnpm 10's
fresh-state install rejected on Vercel — taking production deploys to
ERROR for four consecutive `chore(release)` commits.

The local fix was to re-pin to v5.0.0's SHA. The general principle
the failure exposed is the subject of this PDR.

## Decision

**When pinning to a published upstream release, pin to the SHA (or
content-hash equivalent) returned by the maintainer's explicit Latest
marker, not to the SHA of the highest version number.**

For GitHub Actions specifically:

```bash
gh api repos/<org>/<repo>/releases/latest --jq '.tag_name'
# returns the explicitly-marked Latest release; NOT the highest tag
```

For npm:

```bash
npm view <package> dist-tags.latest
# returns the maintainer's `latest` dist-tag, NOT the highest version
```

The substance generalises: any registry that distinguishes
"maintainer-promoted stable" from "newest published" honours the
distinction with a separate signal. Honour that signal.

Highest tag is a mechanical fact. Latest is a maintainer judgement
about stability. Pin to the judgement.

## Why this is PDR-shaped, not ADR-shaped

This PDR records the **general principle**, applicable across every
Practice-bearing repo regardless of host stack. The next contributor
to any Practice repo would re-derive this discipline if the principle
is not recorded.

The companion ADR-169 records the **host-specific adoption** for this
repo's CI workflows: which mechanism enforces the principle, where the
validator lives, how Dependabot is configured, and which artefacts
are subject to the rule. ADR-169 is re-derived per repo; this PDR
travels with the Practice Core.

## Consequences

**Positive**:

- Releases caught in stability sagas do not silently propagate to
  consumers via mechanical bumps.
- The maintainer's stability judgement becomes the consumer's pin
  judgement — coupling consumer hygiene to upstream stability signal.
- Validator and config tools have a clear, queryable target
  (`/releases/latest`, npm `dist-tags.latest`) rather than a comparator
  function over tag lists.

**Negative**:

- Pinning to Latest can lag the bleeding edge for users who deliberately
  want pre-release adoption. The companion ADR notes the override
  mechanism (annotation or allowlist) for that case.
- Some maintainers do not maintain the Latest marker rigorously,
  leaving it stale across actually-stable releases. The validator
  must distinguish "Latest moved, please bump" (healthy signal) from
  "your pin diverges from current Latest" (block).

## Adoption test

A repo has adopted this PDR when:

1. Every machine-readable pin (GitHub Action SHA, npm dependency,
   Docker tag) can name its source authority — either the maintainer's
   Latest marker or an explicit deviation justification.
2. A validator or review-time check exists that compares the pinned
   ref to the maintainer's Latest signal and surfaces divergence.
3. Bump-proposing tools (Dependabot, Renovate, manual scripts) are
   constrained to propose Latest moves, not highest-tag bumps.

## Evidence

- Triggering investigation: 2026-04-30 Briny Lapping Harbor session.
- Fix commit: `0929615e fix(build): pin pnpm/action-setup to maintainer-Latest v5.0.0`.
- Future plan covering the host-side enforcement work:
  [`build-pipeline-composition-safeguards.plan.md`](../../plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md).
- Upstream context:
  [pnpm/action-setup#228](https://github.com/pnpm/action-setup/issues/228),
  [pnpm/pnpm#11264](https://github.com/pnpm/pnpm/issues/11264),
  [pnpm/pnpm#11284](https://github.com/pnpm/pnpm/pull/11284).

---
name: oak-update-dependencies
description: "Update npm dependencies deliberately — summon on \"dependabot alert\", \"pnpm audit findings\", \"raise a security floor\", \"dep sweep\", \"bump a dependency\", \"pnpm override\", or any advisory/currency/forced-bump trigger. Three entry doors: security-advisory response, routine currency sweep, upstream-forced bump. Core is the mechanism-decision tree (in-range lockfile refresh → package.json bump → override floor, in that preference order; existing floors are RAISED, never twinned) plus a verification tail proving floors bind and the fix survives a lockfile rebuild. Do NOT use for github-actions version bumps (Dependabot owns those), and never accept a Dependabot npm PR (its resolver trips minimumReleaseAge — unmergeable here). Failure shapes it exists to prevent: an open floor silently adopting an unreviewed major; loosening or removing a floor to make install pass; crossing a held major (live hold list in build-system.md); hand-editing pnpm-lock.yaml; trusting one advisory instrument's count as the whole picture."
---

# Update Dependencies (Cross-tool)

Read and follow `.agent/skills/update-dependencies/SKILL-CANONICAL.md`.

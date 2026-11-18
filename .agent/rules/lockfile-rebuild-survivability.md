---
classification: situational
description: "On any dependency landing — a security-floor bump, version hold, a new or raised pnpm-workspace.yaml override, batch sweep, or single bump — run the rebuild test: copy the tracked package.json files and pnpm-workspace.yaml into an empty directory, resolve them there with pnpm install --lockfile-only, then assert floors, holds, unchanged audit, and a green frozen install. No size threshold; run it, never reason about it. Not for changes touching no dependency declaration. Failure shapes — a floor held only by the lockfile's recorded version, evaporating silently on rebuild; a rebuild run beside node_modules, which pnpm seeds from node_modules/.pnpm/lock.yaml, so once the change is installed it passes without resolving anything; an override changed without regenerating the lockfile, which CI's frozen install refuses; a manifest moved under a standing override, which pnpm silently ignores."
trigger: surface:dependency-management
globs:
  - "**/package.json"
  - pnpm-lock.yaml
  - pnpm-workspace.yaml
  - .npmrc
---

# Lockfile-Rebuild Survivability

Owner rule, verbatim (2026-07-25): **"all updates and overrides must be able
to survive having the lockfile fully deleted and rebuilt."**

`pnpm-lock.yaml` is a DERIVED artefact. A security floor, version hold, or pin
that holds only because the lockfile happens to record a good version is not a
constraint at all — it evaporates the first time anyone regenerates from
scratch, and the regression is silent, because the rebuilt tree still installs
cleanly and every gate stays green. The constraints that survive live in
declarations: `package.json` ranges and the `pnpm-workspace.yaml` `overrides:`
block.

## Trigger

Any dependency landing: a security-floor bump, a version hold, a new or raised
`overrides:` entry, a batch sweep, or a single package bump. No size threshold
— a one-line floor is exactly the case where "it resolves correctly right now"
gets mistaken for "the constraint is expressed".

## Action

Run the rebuild; do not reason about it. Reasoning cannot see an incidental
pin. Run it cold, in an empty directory: pnpm with no lockfile seeds its
resolution from `node_modules/.pnpm/lock.yaml`, so a rebuild beside the
checkout's `node_modules` writes the old lockfile back when the declarations
match the last install, and nothing was resolved (the second estate measured
it on pnpm 12.4.2, under 30 ms, with and without `--lockfile-only`; the same
declarations resolved cold picked up five in-range releases).

Resolve the declarations cold, in an empty directory, never in a checkout with
`node_modules`. There, `pnpm install` without a lockfile seeds its resolution
from `node_modules/.pnpm/lock.yaml`: when the declarations match the last
install, which is the ordinary state once the change has been installed, it
prints `Already up to date` and writes the old lockfile back byte for byte, so
every assertion below passes without anything having been resolved.
`--lockfile-only` does not avoid this; only a directory with no
`node_modules/.pnpm/lock.yaml` does. Measured on pnpm 12.4.2 (2026-09-17):
beside `node_modules` the rebuild returned the committed lockfile in under
30 ms, with and without `--lockfile-only`, while the same declarations
resolved cold at the same moment picked up five in-range releases the
committed lockfile did not have. The fallback is not new: pnpm 10.28.2 and
11.20.0 carry the same `files[0] ?? clone(currentLockfile)` choice of wanted
lockfile.

Run the block in one shell from the repository root, where the pathspecs name
every workspace manifest, and stay in that shell for the assertions:

```bash
scratch="$(mktemp -d)"   # empty: no install state to seed from
git ls-files -z -- package.json '*/package.json' pnpm-workspace.yaml .npmrc \
  | xargs -0 tar -cf - | tar -xf - -C "$scratch"
pnpm --dir "$scratch" install --lockfile-only --ignore-scripts   # resolve from declarations alone; no lifecycle scripts
```

`git ls-files` names only tracked paths, so stage a new workspace's
`package.json` first; the copied content is the working tree's. The committed
lockfile is never touched. Copy `"$scratch/pnpm-lock.yaml"` into the checkout
only when its state is the one you mean to commit, and before assertion 4.

Then assert all four, and read each result rather than the exit code alone.
The first three read `"$scratch/pnpm-lock.yaml"` and run
`pnpm --dir "$scratch" audit`; the fourth runs in the checkout against the
lockfile to be committed, once the cold result is that lockfile:

1. **Floors** — every advisory-carrying package resolves at or above its fixed
   version in `"$scratch/pnpm-lock.yaml"`.
2. **Holds** — every documented major hold still holds there (this repo's
   holds, each with how it is enforced and its lift condition, are listed in
   [`docs/engineering/build-system.md`](../../docs/engineering/build-system.md)
   §Dependency updates).
3. **Audit** — `pnpm --dir "$scratch" audit` is unchanged, with any deliberate
   deferral still the only residue.
4. **Frozen install** — `CI=true pnpm install --frozen-lockfile` exits 0 in the
   checkout, against the lockfile you commit.

**A byte-identical cold rebuild is the strongest pass.** A rebuild that merely
satisfies all four assertions is still a pass: newly-published in-range
versions are legitimate drift, not a violation. A byte-identical result
beside `node_modules` proves nothing: it is the seeded lockfile written back. A rebuild that drops a floor,
crosses a hold, or fails the frozen install means the constraint was never
declared — fix the declaration, never re-pin by hand.

## The override-alignment corollary

pnpm `overrides` replace the **effective specifier of every dependency they
bind**, direct dependencies included, and the lockfile records the override's
specifier and the overrides themselves. An override and the manifests it binds
therefore drift apart in two ways, and pnpm treats them differently (measured
in jimcresswell.net on pnpm 12.4.2, 2026-09-16):

- **An override changed without regenerating the lockfile fails loudly.** The
  lockfile's recorded overrides no longer match the workspace's, and
  `CI=true pnpm install --frozen-lockfile` stops with
  `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` (verified by moving the `smol-toml` floor
  to `>=1.7.2 <2` alone). No local hook runs a frozen install, so CI's is the
  first surface that sees it, taking `install`, `secret-scan` and
  `run-quality-gates` down with it.
- **A manifest moved under a standing override is silent everywhere.** The
  override still replaces that dependency's specifier, so the lockfile stays as
  it was and the frozen install still exits 0 (verified by raising agent-tools'
  `smol-toml` to `^1.9.0`, a range no published version satisfies, under the
  `>=1.7.1 <2` floor). A manifest raise meant to pick up a new patch leaves the
  old version installed with every gate green.

OCE measured the same two directions on its pnpm 11.20.0 (2026-09-25, the
frozen lockfile check with `--lockfile-only` over a copy of the tracked
manifests and lockfile): the moved override failed loudly with
`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`, and the moved manifest passed silently.

So an override's comment names the manifests it rewrites, and the override and
those manifests move in the same change, with the lockfile regenerated.

## Worked instances

- **A security slice and a drift sweep** (OCE MCP-151, #530 and #531,
  2026-07-25): a slice setting bounded security floors and an estate-wide
  drift sweep were each tested by full delete-and-rebuild and came back
  **byte-identical**: every floor, the major holds and the audit state read
  as declaration-derived rather than lockfile-retained. That was the
  delete-and-rebuild recipe, which runs in the checkout, and beside
  `node_modules` a byte-identical result does not prove the floors were
  declared (see §Action).
- **The corollary, same lane**: the sweep moved a type package's manifests one
  patch ahead while its override still pinned the old patch, and CI's frozen
  install failed with `ERR_PNPM_OUTDATED_LOCKFILE`. An older pnpm failed
  loudly there; a newer one lets the same manifest move pass (the silent
  direction above), so the loud failure is history, not current behaviour.
  Cured by aligning the override with the manifests, the same alignment a
  later security floor needed.

## Related Surfaces

- Overrides are temporary controls that must name the vulnerable dependency,
  why the override is safe, and the condition for removal
  ([`secops.md` §Dependencies and lockfile](../directives/secops.md#dependencies-and-lockfile)).
  This rule adds: and they must survive a rebuild.
- [`docs/engineering/build-system.md`](../../docs/engineering/build-system.md)
  — security `overrides` and `peerDependencyRules` belong in
  `pnpm-workspace.yaml`; a CVE floor earns an override, a tool-version pin does
  not.
- [`validators-must-recompute-not-just-record`](validators-must-recompute-not-just-record.md)
  — the same principle one layer up: a check that reads recorded state instead
  of recomputing it cannot see the defect.

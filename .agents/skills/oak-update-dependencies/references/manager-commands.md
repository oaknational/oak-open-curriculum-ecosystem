# Dependency Command Matrix

Use this as a quick map when reporting or manually applying updates.

## Detection Priority

1. `packageManager` in `package.json`
2. lockfile presence (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `npm-shrinkwrap.json`)
3. first available CLI on PATH

## Outdated Checks

- npm: `npm outdated --json --depth=0`
- pnpm: `pnpm outdated --json`
- yarn: `yarn outdated --json` (expected when yarn is present)

## Apply (default)

- npm: `npm update` then `npm install`
- pnpm: `pnpm up`
- yarn: `yarn upgrade`

## Apply (major)

- npm: `npx npm-check-updates -u` then `npm install`
- pnpm: `pnpm up --latest`
- yarn: `yarn upgrade --latest`

## Exit behavior

- Script exits non-zero when outdated dependencies are detected in check mode.
- Script returns zero if no outdated dependencies are found.

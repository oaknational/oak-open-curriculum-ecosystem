---
name: config
classification: active
description: Use when work changes Turbo, pnpm, env, or tooling configuration surfaces.
---

# Config

Use this skill while changing build or runtime configuration, scripts, lockfiles,
or environment-loading behaviour. It complements `config-expert`; use the
reviewer to independently assess the finished configuration surface.

## Read in order

1. `.agent/sub-agents/templates/config-expert.md`
2. The `config-expert` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. Relevant root config files such as `package.json`, `pnpm-workspace.yaml`,
   `pnpm-lock.yaml`, `turbo.json`, `tsconfig.json`, `eslint.config.ts`,
   `knip.config.ts`, and each workspace's `vitest.config.ts` and
   `playwright.config.ts`
4. Any product files that consume the configuration you are changing

## How to use it

1. Start from the contract: which script, flag, path, or env value is supposed
   to change, and what user-facing behaviour depends on it.
2. Prefer one obvious configuration path over layered fallbacks or duplicate
   script names.
3. Check every referenced file path and script name directly; config drift here
   is usually a broken pointer, not a subtle algorithmic bug.
4. Hand off to `config-expert` after implementation, and use
   `security-expert` as well when the config change affects headers, secrets,
   or proxies.

---
name: security
classification: active
description: Use when work changes headers, secrets, env, proxies, middleware, or trust surfaces.
---

# Security

Use this skill while changing headers, secrets handling, env loading, proxy or
middleware behaviour, third-party scripts, or dependency surfaces with
meaningful security impact. It complements `security-expert`; use the
reviewer for the independent defensive review.

## Read in order

1. `.agent/sub-agents/templates/security-expert.md`
2. The `security-expert` row of `.agent/rules/invoke-code-experts.md` (the roster)
3. `.agent/directives/secops.md`
4. Relevant changed files such as the MCP server's `src/auth/**`,
   `packages/core/env/**`, each app's `vercel.json`, and any env or dependency
   surfaces

## How to use it

1. Start by naming the boundary being defended: header policy, secret handling,
   request validation, client-bundle exposure, or third-party trust.
2. Keep secrets on the server side, narrow the number of places that read
   `process.env`, and avoid serialising sensitive values into rendered output.
3. Check the existing decision records before widening a security surface; this
   repo already has explicit header and operational-security choices.
4. Hand off to `security-expert` after implementation, and pair with the
   `config` skill when the security change also rewires build or runtime
   configuration.

# Phase 3 re-verification: `upload-sourcemaps.sh` against `pnpm exec sentry-cli`

Date: 2026-04-17. Branch: `feat/otel_sentry_enhancements`
(HEAD at time of note: `0f9245f5` plus the Sentry CLI hygiene lane).

## Scope

This note is a sibling of the frozen `README.md` in this evidence
bundle. It records the outcome of re-running the end-to-end source-map
upload after
`apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
was rewritten to use `pnpm exec sentry-cli` instead of the dev `sentry`
CLI.

## Commands

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
set -a; . apps/oak-curriculum-mcp-streamable-http/.env.local; set +a
RELEASE=hygiene-2026-04-17-sentry-cli-check \
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http \
       sourcemaps:upload
```

The release tag is fresh and session-specific so it is isolated from the
preview's `1.5.0` release and from the previous session's
`evidence-2026-04-16-http-mcp-sentry-validation` tag.

## Outcome

The rewritten script invoked `pnpm exec sentry-cli sourcemaps upload`
from inside the workspace. The workspace-local
[`.sentryclirc`](../../../../apps/oak-curriculum-mcp-streamable-http/.sentryclirc)
supplied `org = oak-national-academy` and
`project = oak-open-curriculum-mcp`.

`sentry-cli` emitted:

- `Bundle ID: 6cb4b066-b7b9-54ef-aa10-5335c7ad537e`
- `Bundled 4 files for upload` → `Uploaded files to Sentry` →
  `File upload complete (processing pending on server)`
- `Organization: oak-national-academy`, `Projects:
  oak-open-curriculum-mcp`, `Release:
  hygiene-2026-04-17-sentry-cli-check`, `Upload type: artifact bundle`

This is the 2xx server-accept surface for an artifact bundle upload
and matches exactly what the previous session observed from the dev
`sentry` CLI path, so the behaviour is unchanged after switching to
`@sentry/cli` via `pnpm exec`.

## Region note (pre-existing)

`sentry-cli` prints a `WARN` that the `sntrys_` org auth token in
`.env.local` embeds `https://sentry.io` as its region rather than the
`.sentryclirc`-configured `https://de.sentry.io`. The previous session
used the same token and its upload is visible in the same Sentry
backend that the Sentry MCP queries (see the
`find_releases evidence-2026-04-16` check run as part of this
re-verification). The region warning is therefore a pre-existing
property of the current auth token, not a regression introduced by
this hygiene lane. Follow-up: rotate the organization auth token to a
de.sentry.io-scoped token at next token refresh.

## Events re-trigger — deliberately omitted

The `__test_generate_errors` tool that drove events #2, #3, and #9 in
the original 2026-04-16 bundle was removed in the same commit that
landed the bundle. Re-introducing it is out of scope for this hygiene
lane. The path under test here is "build → upload → server-accept"; the
event-ingestion path was left intact by these changes (the rewrite only
swapped which CLI drives the upload step).

## Outcome summary (one line)

`pnpm exec sentry-cli sourcemaps upload` path succeeds end-to-end
against `oak-national-academy/oak-open-curriculum-mcp` under a fresh
release tag; server-side artifact bundle accepted.

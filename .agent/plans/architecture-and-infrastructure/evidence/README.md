# Observability Evidence

Store date-stamped evidence bundles for the Sentry + OpenTelemetry foundation
here.

## Hygiene Rules

1. Store scrubbed summaries, screenshots, and command transcripts only.
2. Do not commit raw event exports, raw payload dumps, full unsanitised stack
   traces, cookies, tokens, auth codes, API keys, or secret-bearing URLs.
3. Redact usernames, machine-local absolute paths, host secrets, and user data
   before saving artefacts.
4. If sensitive raw evidence is temporarily needed for debugging, keep it
   outside git-tracked paths and distil only the safe conclusion back here.

## Expected Bundle Shape

Create a date-stamped subdirectory when live verification happens, for example:

- `2026-03-27-http-search-foundation/`

Each bundle should include:

1. `README.md` summarising claims and evidence sources
2. scrubbed screenshots or log excerpts
3. release/source-map verification notes
4. kill-switch rehearsal notes
5. MCP Insights metadata-only verification notes

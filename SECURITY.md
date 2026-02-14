# Security Policy

## Reporting a Vulnerability

If you find a security issue:

1. Do not report security issues via public GitHub issues.
2. Follow the instructions in the [official security policy at https://www.thenational.academy/.well-known/security.txt](https://www.thenational.academy/.well-known/security.txt).

## Credentials Policy

- Real credentials are only allowed in untracked local files (`.env` and `.env.local`).
- `.env.example` and other tracked files must contain placeholders only.
- `.env` and `.env.local` must never be committed to git.
- Line-specific exceptions to secret scanning must be explicit and justified.

## Secret Scanning in Repo Hygiene

- `pnpm check` runs `pnpm secrets:scan:all` before quality checks.
- CI runs a full-history secret scan from full git history on each push/PR.
- Pre-push hook blocks pushes when leaks are detected.
- Full-history scan across all refs is available via `pnpm secrets:scan:all-refs` when auditing history.

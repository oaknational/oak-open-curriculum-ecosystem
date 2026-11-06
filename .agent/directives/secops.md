---
fitness_line_target: 180
fitness_line_limit: 210
fitness_char_limit: 13000
fitness_line_length: 100
fitness_rationale: >-
  Sized for the Practice-wide security doctrine (credentials, secret scanning, application
  security, history rewrites) plus the host's own bindings; knowledge preservation outranks fitness
  warnings.
split_strategy: Split by responsibility — extract git operations from audit procedures
---

# Security Operations

Operational security practices for this repository. These rules apply to all contributors — human
and AI. The Practice-wide doctrine comes first; the host's own bindings (git identity, credentials
policy, disclosure route, audit checklist) are in §This host's bindings at the end.

## Guiding principle

If content would be useful to a social engineer, it does not belong in version control. This applies
to commit messages, plan files, code comments, and any other tracked content.

Four engineering principles sit under it:

- **Least privilege** — every credential, token and integration carries the narrowest access that
  does the job.
- **Defence in depth** — no single control is sufficient alone; each layer catches what the others
  miss.
- **Fail secure** — an error path lands on the safe default, never on an open one.
- **No trust assumptions** — every external input is validated before use.

## Credentials and API keys

- **Environment variables only.** Credentials live in environment variables or the untracked `.env`
  and `.env.local` files — never in code, never in version control. Tracked example files carry
  placeholders only (the host's credentials policy; §This host's bindings).
- **Validated on startup.** Keys are validated with Zod schemas before use, so a missing or
  malformed credential fails at boot rather than mid-request.
- **Never logged.** A key never reaches a log line, even at debug level.
- **Rotation is an environment change.** Rotate a key by updating the environment variable; no
  application code changes, and the process restarts to pick up the new value.

### Agent tool choice when reading credential-bearing files

For any file that may hold credentials (`~/.claude.json`, `.env*`, auth configs, agent
tool-server settings, service-account files), agents default to the `Read` tool rather than Bash
`grep`, `cat` or `head`. The repo's secrets-scan `PreToolUse` hook covers `Read` only; the Bash
hook is a command-pattern blocker, not a content scanner — so a Bash read drives through the
gap between the two defences (worked instance 2026-04-24: a
`grep -i sonar ~/.claude.json | head` surfaced a real-looking token into the transcript). When
Bash is genuinely required (line counts, directory walks), structure the command so
value-bearing lines never reach stdout — `grep -l` / `grep -c`, or exclude token-like lines
before printing. The same discipline applies to sub-agent briefs: never ask a sub-agent to
"grep the config" when it can `Read` it under the scanner.

## Secret scanning

The repo is scanned with `gitleaks`. The `secrets:scan` stage is part of `pnpm check` (the pre-push
gate) and CI runs it on every push and pull request; both walk every branch and tag. It catches
accidental credentials but does not detect PII or psychological content — the rules in
[privacy.md](privacy.md) cover those categories.

Broad allowlisting is not permitted. If a token-like placeholder must remain in tracked docs, use a
line-specific allowlist comment:

```text
EXAMPLE_API_KEY=example_token_value # gitleaks:allow
```

Path-level allowlists exist only for third-party reference material (`.agent/reference/**`) and
whatever else `.gitleaks.toml` declares.

Escalation path:

- `pnpm secrets:scan` for routine local commit/branch checks
- `pnpm secrets:scan:all` for bootstrap and audit scans across branches and tags
- `pnpm secrets:scan:all-refs` for repository forensics across all refs

## Application security

- **Validate every external input at the boundary** with strict Zod schemas: request parameters
  before processing, environment variables on startup, external API responses before use.
- **Sanitise error output.** Internal details never reach a user: stack traces only in development,
  upstream errors mapped to generic user-facing messages, sensitive data scrubbed from logs.
  Validation errors name the field without internal detail; not-found responses reveal no structure;
  permission errors give no hint of which permission is missing; rate-limit responses say a limit
  exists without exposing its value; internal errors return a generic message and log the detail
  internally only.
- **No dynamic code execution** — no `eval`, no `new Function`.
- **Type safety is a security control** — no `any`, no `as` assertions, runtime validation at
  boundaries ([principles.md §Compiler Time Types and Runtime Validation](principles.md)).

## Dependencies and lockfile

- **Minimal dependencies**, kept current; the dependency-currency skill runs the full pass.
- **Exact versions** via `pnpm-lock.yaml`.
- **Vulnerability governance.** An audit finding is cured by a version bump or, where no fixed
  release exists, by an annotated override floor in `pnpm-workspace.yaml`
  ([build-system.md](../../docs/engineering/build-system.md)). Overrides are temporary controls
  that must name the vulnerable dependency, why the override is safe, and the condition for
  removal — and they must survive a rebuild
  ([lockfile-rebuild-survivability](../rules/lockfile-rebuild-survivability.md)).
- **Never claim a dependency-audit CI gate that the checked workflow does not run.**

## History-rewrite boundary

A public-history rewrite is an exceptional recovery operation, not ordinary cleanup. Before any
rewrite or force push, preserve and verify the complete live state: Git refs and object database,
index, tracked and untracked changes, ignored sources, relevant pull-request state, and any
out-of-repo material needed for recovery. Use a private remote and a fresh-clone check so custody is
not single-disk.

Build and test the replacement in an isolated clone. Push only with an exact `--force-with-lease`
against the observed old ref, then verify a fresh public clone, the pull request and all regenerated
checks. Rewriting a branch reduces ordinary reachability; it does not prove that hosting-provider
caches or infrastructure no longer retain old objects. See
[privacy.md](./privacy.md) §Public-history recovery.

## Incident response

Report security issues by following [SECURITY.md](../../SECURITY.md) at the repository root, which
names the host's disclosure route (§This host's bindings). Never report a security issue via a
public GitHub issue. Security patches ship as soon as possible and are disclosed through GitHub
security advisories.

## Security checklist before committing

- [ ] No hardcoded secrets or API keys
- [ ] All external inputs validated with Zod
- [ ] Error messages do not leak internal details
- [ ] PII scrubbed from every output ([privacy.md](privacy.md))
- [ ] No `any` or type assertions
- [ ] Security implications documented in the change
- [ ] Tests cover the security edge cases: PII scrubbing, error-message leakage, input validation
      and injection attempts

## Review cadence

Audit the repository against the host's PII checklist (§This host's bindings) before any change in
public visibility. The audit should cover both the working tree and the full git history.

## This host's bindings

None recorded yet; the host records its own here.

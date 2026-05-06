---
boundary: B1-Governance
doc_role: policy
authority: sonar-disposition
status: active
last_reviewed: 2026-05-06
---

# Sonar Disposition Policy

## Purpose

This document codifies class-level dispositions for SonarCloud security
hotspots and HIGH issues. It exists so that the same disposition reasoning is
not re-derived per site by every reviewer. Future hotspots in known classes
apply this policy by reference; only sites that fall outside a documented
class require fresh per-site judgement.

The policy composes with the per-site evidence trail in SonarCloud (each
hotspot still carries a site-specific `SAFE` rationale citing the policy
class). Together they give an auditable record: _what the pattern is_, _why
it is safe_, and _which sites instantiate it_.

## Authority and Doctrine

- [`principles.md`][principles] §Strict and Complete and §Architectural
  Excellence Over Expediency.
- [`safety-and-security.md`][safety] — repository security baseline.
- [`never-disable-checks`][no-disable] — quality gates stay on; this policy
  does not weaken Sonar, it documents the substantive judgement Sonar's
  hotspot model defers to a human.

[principles]: ../../.agent/directives/principles.md
[safety]: ./safety-and-security.md
[no-disable]: ../../.agent/rules/never-disable-checks.md

## Two-Outcome Rule

Every Sonar finding resolves to **exactly one of two outcomes**. The
`ACCEPTED` (issue) and `ACKNOWLEDGED` (hotspot) dispositions are excluded —
they accept residual risk without a corrective and so are not architectural
positions. They are permitted only with explicit owner authorisation
recording the residual-risk acceptance.

| Finding type | Permitted outcomes                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Issue**    | `FIXED` (code change resolves the defect) **or** `FALSE_POSITIVE` (the defect described is genuinely not present at this site)                 |
| **Hotspot**  | `FIXED` (code change removes the security-sensitive use) **or** `SAFE` (the use is verified safe in this context with site-specific rationale) |

Per-site rationales must name a concrete reason — never a generic
"reviewed and considered safe". When a class-level reason applies, the
rationale cites this policy and adds the site path + line.

## Disposition Workflow

1. **Match the rule key** to a documented class below.
2. **Match the site shape** against the class's decision criteria.
3. If both match: dispose `SAFE` with a comment of the form
   `SAFE per Sonar Disposition Policy §<rule>: <file>:<line> — <one-line site note>`.
4. If the rule is documented but the site shape does not match: do per-site
   review, document the rationale fully, and consider whether the class needs
   a sub-clause amendment.
5. If the rule is not yet documented: do per-site review and add the class
   to this document at the next consolidation pass.

## Documented Classes

### S5443 — Publicly writable directories

**Pattern**: `/tmp` (or other publicly-writable paths) appears as a path
argument in test code.

**Decision criteria**: SAFE if and only if all hold:

- Site is in a file matching `**/*.test.ts`, `**/*.unit.test.ts`,
  `**/*.integration.test.ts`, `**/*.e2e.test.ts`, or `e2e-tests/**` /
  `tests/**` directories.
- The path is either passed to a mocked filesystem (vi.fn() spies) or used
  inside a test runner's transient sandbox.
- No production runtime code path resolves to the same site.

**Canonical rationale**: "test-fixture path; mocked or transient-sandbox
filesystem use; no production runtime exposure".

**Worked example**: `packages/libs/logger/src/file-sink.unit.test.ts:43` —
`/tmp/test.log` passed alongside vi.fn() mocked `fs`. No real filesystem
touch.

### S5332 — Clear-text protocols (`http://`)

**Pattern**: `http://` URL in code, typically `http://localhost:<port>`,
`http://fake-<service>:<port>`, `http://example.com`, or RFC-2606 reserved
test domains.

**Decision criteria**: SAFE if and only if all hold:

- Site is in a test file (same glob set as S5443) or in a test-runner
  config (`playwright.config.ts`, `vitest.config.ts`, etc.) or a
  `test-helpers/`, `e2e-fakes/` module.
- The URL targets a synthetic test endpoint, a localhost loopback, or an
  RFC-reserved test domain — never a production hostname.
- Production deployments use `https://` URLs sourced from environment
  variables; this URL is not the production-runtime value.

**Canonical rationale**: "test-fixture URL; synthetic/localhost/test-domain
target; production runtime uses `https://` env var".

### S1313 — Hardcoded IP addresses

**Pattern**: IP literal (RFC 1918 private, RFC 3849 documentation,
loopback, or synthetic) in code.

**Decision criteria**: SAFE if and only if all hold:

- Site is in a test file (same glob set as S5443).
- The IP is a fixture value driving a test of header-redaction,
  rate-limiting, IP-parsing, or similar input-handling code.
- The IP is not embedded in production code as a runtime configuration
  default.

**Canonical rationale**: "test-fixture IP literal; drives input-handling
test; not a production-runtime value".

### S5852 — Slow regular expressions

**Pattern**: Regex with super-linear complexity flagged by Sonar's regex
analyser.

**Decision criteria**: SAFE if and only if all hold:

- Site runs at codegen time (`pnpm sdk-codegen`), build time
  (`pnpm doc-gen`, `pnpm build`), or in a data-pipeline / admin CLI —
  never inside a request handler.
- Input is upstream-controlled: OpenAPI schema, generated TypeScript
  source, sitemap XML from allowlisted hosts (`isAllowedSitemapUrl` or
  equivalent), curriculum bulk data, or repo-internal markdown.
- Pattern is anchored or character-class-bounded such that the
  super-linear behaviour cannot be triggered by the actual input shape.

**Canonical rationale**: "build-time/codegen-time regex; upstream-
controlled input; anchored or character-class-bounded; not a request-
handler path".

**FIX path**: when a regex is in a request-handler path, rewrite to use
linear constructs (negated character classes, anchored alternations,
bounded quantifiers) per the rule's documented strategies.

### S4036 — OS commands resolved via PATH

**Pattern**: `spawnSync`, `spawn`, `exec`, `execSync`, `execFileSync` etc.
resolving a command name (`pnpm`, `git`, `typedoc`) via PATH rather than
absolute path.

**Decision criteria**: SAFE if and only if all hold:

- Site is in agent-tooling, build/CI scripts, dev-server config, codegen,
  or admin/operator CLIs — never in a production server runtime that
  handles end-user requests.
- The command is the project-required toolchain (`pnpm`, `git`, `typedoc`,
  `tsx`) declared via `packageManager`, devDependencies, or repo
  conventions.
- Execution context (developer workstation, CI runner, build container)
  is the trust boundary; this code is not responsible for hardening PATH.

**Canonical rationale**: "dev/CI tooling; standard developer toolchain
binary; host environment owns PATH integrity; not a production-server
runtime".

### S2245 — Pseudorandom number generator (`Math.random()`)

**Pattern**: `Math.random()` used in code.

**Decision criteria**: SAFE if and only if the use is one of:

- **Non-security identifier generation** combined with a uniqueness
  primitive (timestamp, monotonic counter): correlation IDs, request
  trace IDs, log-line nonces.
- **Retry-backoff jitter** (AWS-style full jitter or equivalent) used to
  spread retry timing.
- **Sampling / probabilistic dispatch** for non-security purposes (e.g.,
  metric sampling).

In all cases the output of `Math.random()` MUST NOT influence
authentication, authorisation, session binding, token generation, CSRF
state, or any cryptographic property.

**Canonical rationale (per use shape)**:

- Identifier: "non-security correlation/tracing identifier; combined with
  monotonic timestamp; no cryptographic property required".
- Backoff: "AWS-style full-jitter retry backoff; spreads retry timing
  against thundering-herd; not a security context".

**FIX path**: any cryptographic, session, or token use must use
`crypto.randomUUID()`, `crypto.randomBytes()`, or `crypto.getRandomValues()`.

### S1523 — Dynamic code execution (`eval`, `Function`, `javascript:`)

**Pattern**: `eval()`, `new Function(...)`, or `javascript:` URL.

**Decision criteria**: SAFE if and only if all hold:

- Site is in test code AND the input to `Function` / `eval` is a string
  literal or a value derived synchronously from a same-file string literal
  (matching the rule's documented exception).
- The use is a syntax-validation tool, not a runtime evaluation of
  attacker-influenced input.

**Canonical rationale**: "test-only `Function`/`eval` as syntax validator
over same-file literal-derived input; no untrusted source; not in any
production code path".

**FIX path**: any production use of `eval`/`Function` constructor with
runtime-composed input is a real defect. Replace with parser, switch,
schema-driven dispatch, or static lookup.

### S4790 — Weak hash algorithm (MD5, SHA-1)

**Pattern**: `createHash('md5')`, `createHash('sha1')`, or equivalent.

**Decision criteria**: SAFE if and only if all hold:

- Hash output is used purely for **format conversion** or **cache key
  derivation** from a non-secret input — never for integrity verification,
  authentication, signing, password hashing, or any security boundary.
- The choice is justified by a non-security property (specific
  byte-length output, deterministic short identifier, compatibility
  with an external schema like OpenTelemetry TraceId's 32-char hex).

**Canonical rationale**: "MD5 used as deterministic 128-bit format
conversion to derive [target schema] from non-secret input; not used in
integrity/authentication/signing context".

**FIX path**: any security use must move to SHA-256 / SHA-512 / HMAC /
bcrypt / argon2 as appropriate to the use case.

### S5689 — Framework version disclosure

**Pattern**: Express (or similar framework) instantiation that, by
default, emits a framework-identifying response header (`X-Powered-By`,
`Server`, etc.).

**Decision criteria**: SAFE if and only if **a runtime test asserts the
header is absent** at the application layer. Static analysis cannot see
downstream middleware (e.g., helmet's `hidePoweredBy`); the test pins the
property regardless of implementation detail.

**Canonical rationale**: "framework-version header verified absent at
runtime by `<test path:line>`; downstream middleware (helmet
`hidePoweredBy` or equivalent) strips the header globally; test acts as
regression guard".

**FIX path** (when no test exists or the test fails): add
`app.disable('x-powered-by')` (Express) or equivalent, AND add a test
that asserts the header's absence. The test is mandatory; the disable
call alone is insufficient because future config changes can silently
re-enable the disclosure.

## Issue Classes (placeholder)

Issue-class policies will be added as they are codified. The same shape
applies: per-rule decision criteria, canonical rationale, FIX path. The
default is `FIXED` via code change; `FALSE_POSITIVE` is the alternative
when the defect described is genuinely not present at the site (typically
zombie findings against stale main-branch analysis where the code has
already been fixed; the durable cure is to push so SonarCloud
re-analyses).

## Maintenance

- Amend this policy when a new pattern emerges, when a class needs a
  sub-clause for a new use shape, or when a previously-permitted shape
  is reclassified.
- Amendments must include a worked example and a clear delta-from-prior
  rationale. Removing a permitted shape requires re-disposition of any
  sites previously SAFE-d under the removed shape.
- The policy is a living document. Reviewers should challenge stale
  rationales at consolidation time.

## Cross-references

- [`safety-and-security.md`](./safety-and-security.md) — security baseline.
- [`development-practice.md`](./development-practice.md) — quality gate
  taxonomy.
- [`.agent/rules/never-disable-checks.md`](../../.agent/rules/never-disable-checks.md)
  — gates stay on; this policy lives alongside Sonar, not instead of it.

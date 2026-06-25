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

## Remediation Branch Source of Truth

When a branch is opened to remediate existing main/project Sonar debt, the
authoritative backlog is the current main/project issue and hotspot inventory.
PR-scoped Sonar for that remediation branch is a regression guard: use it to
prove the branch has not introduced new findings, not to redefine the original
worklist. Branch findings that predate the remediation branch's changes must be
reconciled against the main/project source before they become implementation
work.

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
`tmp/test.log` passed alongside vi.fn() mocked `fs`. No real filesystem
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

### S4036 — OS commands resolved via PATH (FIX-only — no SAFE disposition)

**Pattern**: `spawnSync`, `spawn`, `exec`, `execSync`, `execFileSync` etc.
resolving a command name (`pnpm`, `git`, `typedoc`) via PATH rather than
absolute path.

**Disposition**: there is none — S4036 is always **FIXED**, never disposed
`SAFE`. Execute the binary by a fixed absolute path so a user-writable `PATH`
entry cannot shadow it (the security property is the fixed absolute path, not
any guarantee the directory is non-writable). For `git`, the canonical fix is
`resolveTrustedGit()` in `agent-tools/src/core/trusted-git.ts` (an absolute path
from a fixed allowlist of well-known directories, resolved without consulting
`PATH`); other binaries follow the same absolute-path shape.

**Why no SAFE class**: PATH-pinning (overriding `env.PATH` to trusted
directories) does **not** clear S4036 — the analyser flags the by-name call
regardless — so a SAFE disposition would document a non-fix as acceptable. The
genuine fix is cheap and available, so per `never-disable-checks` and the
Two-Outcome Rule above, S4036 resolves to FIXED. A prior allowance for this
class is reviewed and migrated, never extended.

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

### Generated Code

**Pattern**: Style-class issues (naming, formatting, structural smells,
duplication-shaped findings) raised on files produced by a code generator
under a path matching `**/src/types/generated/**` — primarily output of
`openapi-typescript` consumed by `packages/sdks/oak-sdk-codegen/` and
downstream MCP tool/stub generators.

**Decision criteria**: FALSE_POSITIVE if and only if all hold:

- Site is in a path matching `**/src/types/generated/**`.
- The file is overwritten on `pnpm sdk-codegen` (or equivalent) from an
  upstream schema; no human edits the file directly.
- The finding is a style-class issue describing the generator's chosen
  output shape, not a security or correctness defect that would survive
  re-generation.

**Canonical rationale**: "generated by `openapi-typescript` under
`packages/sdks/oak-sdk-codegen/src/types/generated/**`; file is
overwritten on each codegen run; finding describes generator output shape
rather than a hand-maintained code defect; fix path is upstream in the
generator or the OpenAPI schema, not at this site".

**Worked example**: A type-alias usage shape (rule S4323) raised against a
file under `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/`
is disposed FALSE_POSITIVE under this class. The flagged shape is
mechanically chosen by `openapi-typescript`; the human-edited corpus does
not exhibit it, and the file is regenerated on each `pnpm sdk-codegen`
run.

**FIX path**: if a generator-output finding represents a real defect
(security, correctness, runtime hazard), the fix is upstream — adjust the
OpenAPI schema, update the generator, or post-process the output in the
codegen pipeline. Never hand-edit a generated file.

## Duplications (cpd.exclusions)

Sonar's copy-paste detector (cpd) measures duplication as a
maintainability smell on the **maintainable code corpus**. The classes
below are excluded from that corpus because the structural repetition is
either inherent to the artefact (generator output) or intentional (test
isolation, package-local config shape) — duplication there is not signal.

This is a denominator-scope decision, not a rule disablement.
Hand-written library, application, and service code remains fully in
scope; duplication there continues to be reported and is treated as
signal under the standard quality gate.

### Excluded globs and per-glob architectural reason

- `**/src/types/generated/**` — output of `openapi-typescript` and
  downstream codegen. Generators emit large blocks of structurally
  identical TypeScript by design (e.g. one parameter-typing variant per
  operation, one tool stub per endpoint). The repetition is the
  generator's chosen shape; the durable fix path is upstream in the
  schema or generator, not at the site.

- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/**` —
  owner-authorised audit-trail exception recorded on 2026-05-24. This path is
  already covered by `**/src/types/generated/**`; the narrower glob is retained
  because the owner explicitly authorised this generated-code boundary as a
  specific exception and the config should preserve that decision visibly.

- `**/*.test.ts`, `**/*.test.tsx`, `**/tests/**`, `**/e2e-tests/**` —
  test isolation requires that each test arranges its own fixtures and
  collaborators without coupling to a sibling test's setup. DRYing across
  tests to satisfy cpd would force shared mutable setup and obscure the
  arrange/act/assert intent of individual cases. Repetition here is an
  affordance of the testing style, not a quality smell.

- `**/*.config.*` — package-local config files intentionally repeat the
  shape of the project boundary: imports from shared standards helpers,
  local `tsconfigRootDir` / resolver setup, and package-specific rule
  deltas. Real shared behaviour belongs in imported config helpers; the
  remaining repeated file shape is a readability and ownership boundary,
  not a maintainability smell.

- `**/*.external-data.ts` — external-source data snapshots (the
  external-data file convention). A file matching this suffix is a faithful
  mirror of an external dataset (e.g. the EEF Teaching & Learning Toolkit
  snapshot), not authored code. De-duplicating its data literals would
  distort fidelity to the external source — precisely the value the snapshot
  exists to preserve — so the durable fix path is upstream (the source or the
  refresh script), never at the site. The discriminator is _external-ness, not
  size_: a small external snapshot qualifies; a large hand-built lookup table
  does not. The convention carries a contract — a `*.external-data.ts`
  file MUST be pure data: it MUST carry a provenance docstring and MUST NOT
  export logic (function / class / enum), so the suffix cannot be used to
  dodge the duplication gate. Its types are derived from the data held `as
const` (the generalised compile-time discipline of ADR-038), never typed
  `unknown`. The contract is kept by review when the snapshot changes — the
  right tool for keeping one external-data file logic-free is to read it —
  not by an automated gate.
  The same suffix also drives the workspace ESLint code-quality ignore for the
  same architectural reason. Owner-authorised 2026-05-29.

- `agent-tools/src/core/agent-identity/schemas/**` — curated naming-schema
  wordlist data (ADR-198). Each registered era's themed word columns live in
  one pure-data module per theme; cpd's token-sequence matching normalises
  string-literal values, so six structurally identical data modules register
  as ~96 duplicated lines each while their actual content is provably
  disjoint — the curation gate tests enforce zero shared words across themes
  per column, a strictly stronger anti-duplication property than cpd
  measures. The material is digest-pinned and frozen at activation, so
  "de-duplicating" (merging the files) would damage the per-theme curation
  and review boundary to appease a false signal. The modules MUST stay pure
  data (word arrays plus one typed export each, no logic), kept by the
  curation gates and review. Owner-authorised 2026-06-11 (PR #189).

### What this does NOT do

- It does **not** silence duplication on real source files. Findings in
  hand-written library, app, or service code remain signal under the
  standard quality gate (current threshold: 3.0% duplication density on
  new code).
- It does **not** disable any Sonar rule. cpd.exclusions narrow only the
  duplication-analyser denominator; all other rule analysers continue to
  see the excluded files.
- It does **not** authorise removing real source files from the
  duplication corpus to clear a gate. Source-file duplication is cured by
  refactor, not by exclusion.

### Expansion discipline

Adding a new glob to `sonar.cpd.exclusions` requires, in order: policy
amendment first (with the per-glob architectural reason), owner
authorisation, then the `.sonarcloud.properties` update. The architectural
reason must be substantive — "the gate is failing" is not a reason. See
[§File-Based Configuration](#file-based-configuration-sonarcloudproperties).

## Issue Classes

Issue-class policies are added as they are codified. The same shape
applies: per-rule decision criteria, canonical rationale, FIX path. The
default is `FIXED` via code change; `FALSE_POSITIVE` is the alternative
when the defect described is genuinely not present at the site — either a
zombie finding against stale main-branch analysis where the code has
already been fixed (the durable cure is to push so SonarCloud re-analyses),
or a rule that mis-fires on a shape that cannot exhibit the defect it
describes.

### S8786 — Super-linear regular expressions

**Pattern**: Regex flagged by Sonar's runtime-complexity analyser as having
super-linear (potentially catastrophic) backtracking. The Issue-form sibling
of the [§S5852](#s5852--slow-regular-expressions) security hotspot: same
underlying concern (a regex whose worst case is super-linear in input length),
surfaced as a maintainability issue rather than a security hotspot.

**Decision criteria**: FALSE_POSITIVE if and only if all hold:

- Site runs at lint/validation time, codegen time, build time, or in a
  data-pipeline / admin CLI — never inside a request handler.
- Input is repo-internal or upstream-controlled: repo markdown, generated
  TypeScript, the OpenAPI schema, curriculum bulk data, or equivalent —
  never end-user request input.
- The pattern is anchored or character-class-bounded such that the
  super-linear behaviour the rule describes cannot be triggered by any
  input shape (for example, an end-anchored match over a negated character
  class, where the negated class and the following literal cannot overlap).

When any criterion fails — most importantly when the regex is on a
request-handler path — the disposition is **FIXED**, not FALSE_POSITIVE.

**Canonical rationale**: "validation/build-time regex; repo-internal input;
end-anchored over a negated character class so the flagged super-linear
backtracking cannot occur; not a request-handler path".

**FIX path**: when a flagged regex is on a request-handler path, rewrite it
to linear constructs (negated character classes, anchored alternations,
bounded quantifiers) or to plain string operations, per the rule's
documented strategies.

**Worked examples** (all in agent-tooling validators, repo-internal markdown
input, end-anchored over negated classes — disposed FALSE_POSITIVE):

- `agent-tools/src/validators/markdown-links/validate-markdown-links-helpers.ts`
  — `/\s+"[^"]*"$/` strips a trailing markdown link title.
- `agent-tools/src/validators/reference-direction/validate-reference-direction-helpers.ts`
  — the same `/\s+"[^"]*"$/` title-strip.
- `agent-tools/src/practice-fitness/item-count.ts` — `/[^\w-]+$/` strips a
  trailing status annotation.

**Delta from prior**: this is the first Issue class codified beyond the
placeholder. It mirrors the established §S5852 hotspot class one-for-one in
decision shape (build/validation-time + controlled input + anchored/bounded
⇒ safe; request-handler ⇒ FIX), differing only in finding type (Issue vs
hotspot) and therefore disposition verb (`FALSE_POSITIVE` vs `SAFE`). It
does not relax any standard: a request-handler regex still fails the gate.

## File-Based Configuration (`.sonarcloud.properties`)

This repo uses SonarCloud **automatic analysis**, which reads **only**
[`.sonarcloud.properties`][sonar-config]. There is deliberately no
`sonar-project.properties` — that file is read solely by the sonar-scanner CLI
(CI-based analysis), which this repo does not run, so it had no effect and was
removed once confirmed dead.

The only file-based analysis config is:

- `sonar.sourceEncoding=UTF-8` — pins source decoding so the analyser cannot fall
  back to a host JVM encoding and misdecode the repo's UTF-8.
- `sonar.cpd.exclusions` — the duplication-analyser denominator scope documented
  in [§Duplications](#duplications-cpdexclusions) above. It narrows only the cpd
  denominator; it disables no rule.

**There is no file-based rule-ignore mechanism, by design.**
`sonar.issue.ignore.multicriteria` (per-rule × glob disables) is a
sonar-scanner-CLI feature that automatic analysis does not read, _and_ a
forbidden anti-pattern under [`never-disable-checks`][no-disable] regardless: it
suppresses a rule across every current and future matching file, blind to
per-site context. A dead copy of such a block once lived in the unread
`sonar-project.properties` and never took effect; it has been removed.

**Every per-issue and per-hotspot disposition is therefore made per-site,
server-side in SonarCloud** — `FALSE_POSITIVE` for issues, `SAFE` for hotspots —
citing the relevant policy class per [§Disposition Workflow](#disposition-workflow).
This is the single disposition path for **all** documented classes, including
S5443 / S5332 / S1313 in test fixtures (previously, and ineffectively, expressed
as a glob-ignore block): a reviewer applies the class's decision criteria to the
individual finding and dispositions it in the UI with a comment citing this
policy. The class definitions above are the shared decision criteria for those
per-site calls.

### Expansion discipline (`.sonarcloud.properties`)

The one file-based knob that carries policy is `sonar.cpd.exclusions`. Adding a
glob requires, in order: (1) policy amendment in this file with the per-glob
architectural reason; (2) owner authorisation — an agent may propose but must not
enact; (3) the `.sonarcloud.properties` update. The reason must be substantive —
"the gate is failing" is not a reason. Narrowing the duplication denominator for a
path range is functionally a gate-scope change, so it goes through the same
discipline as any [`never-disable-checks`][no-disable]-adjacent decision.

[sonar-config]: ../../.sonarcloud.properties

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

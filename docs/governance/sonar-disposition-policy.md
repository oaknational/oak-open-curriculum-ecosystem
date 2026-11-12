---
boundary: B1-Governance
doc_role: policy
authority: sonar-disposition
status: active
last_reviewed: 2026-11-11
---

# Sonar Disposition Policy

## Purpose

This document codifies how findings from the code-quality analyser and the
code-scanning analyser — security hotspots, security-class issues and
quality issues alike — are resolved, so that the same reasoning is not
re-derived per site by every reviewer. Since the owner's ruling of
2026-09-08 (§[One-Outcome Rule](#one-outcome-rule-owner-ruled-2026-09-08))
that resolution is a fix in the tree, with two named exceptions; the
documented classes below carry what each rule sees and which change clears
it, so a finding in a known class is cured by reference and only a site
outside every documented class needs fresh judgement.

The policy composes with the analysers' own records: a cured finding closes
on the next analysis of the corrected code, the first exception's query is
excluded by tracked CodeQL configuration, explained by ADR-219 and the
route comments, and a site within §S4036's class is resolved under the
second exception: under `agent-tools/` by one project criterion on each
analyser project, and elsewhere by a mark at the site.
Together they give an auditable record: _what the pattern is_, _what
clears it_, and, outside `agent-tools/`, _which sites instantiate it_.

## Authority and Doctrine

- [`principles.md`][principles] §Strict and Complete and §Architectural
  Excellence Over Expediency.
- [`safety-and-security.md`][safety] — repository security baseline.
- [`never-disable-checks`][no-disable] — quality gates stay on. The one rule
  this policy lets an analyser project ignore is S4036 under `agent-tools/`
  (the second exception); beyond it the policy documents the substantive
  judgement Sonar's hotspot model defers to a human.

[principles]: ../../.agent/directives/principles.md
[safety]: ./safety-and-security.md
[no-disable]: ../../.agent/rules/never-disable-checks.md

## One-Outcome Rule (owner-ruled 2026-09-08)

Owner ruling, 2026-09-08, verbatim: **"We don't dismiss issues, we fix
them."** Every finding from either analyser resolves to **one outcome**:
`FIXED` — a change in the tree after which the finding no longer fires,
closed by the next analysis. `FALSE_POSITIVE`, `SAFE`, `ACCEPTED` and
`ACKNOWLEDGED` are analyser-side states this policy grants only under the
second exception below (§S4036), whose `agent-tools/` criterion is the one
act this policy allows in an analyser's settings. Every other finding that
is genuinely wrong about a site is still cured by a change that stops it
firing (a literal removed, a shape restructured, a value sourced
differently), never by an act in the analyser's console. Precedent
in the analyser (a site marked before the ruling) licenses nothing at the
next site.

**The first exception, owner-ruled the same day, verbatim:** "in regard to
the rate limiting work, we are going to pause that for now, and leave
comments in the code that recognise that additional in-process rate
limiting would provide defence in depth, but that we regard the two sets of
edge WAFs to be sufficient for safety for now. And in this ONE case we can
dismiss the findings in Sonar, and preferably find a way to keep them
dismissed instead of revisiting this same issue every few weeks." The
exception is the CodeQL query **`js/missing-rate-limiting`** and nothing
else, and ADR-219 (rate limiting at the edge, no in-process limiter) is its
ground. Its mechanism was ruled on 2026-09-17, when two records disagreed —
the rules tier described one dismissal per alert (`41235118c`) and the
tracked CodeQL configuration excluded the query (`bd7a3509e`) — owner,
verbatim: "a permanent exclusion is allowed, but ONLY for that one issue".
The mechanism is the `query-filters` entry in
`.github/codeql/codeql-config.yml`, which excludes the query for every file
the analysis scans, so a new route anywhere raises no alert and ADR-219's
edge rule is the control for it. No other query is excluded or filtered,
and no other finding class is dismissed or admitted beyond the second
exception below. The analysers' path
exclusions are scope rules, not finding-class exceptions: the studio-source
preservation tier (§2026-07-19 amendment, ADR-213), the binary file-type
globs (§2026-11-11 amendment on binary files) and the duplication
globs under §Expansion discipline. The owner's 2026-09-08 word also asked
for comments in the code recognising the defence-in-depth option:
at this amendment's date the route comments (`auth-routes.ts`,
`oauth-proxy-routes.ts`, `bootstrap-helpers.ts`) name the edge control and
cite ADR-219 but do not yet recognise it (the `code-scanning-alerts-to-zero`
plan's unit 6). The exclusion is tracked in the tree, so it is never
re-litigated by hand.

**The second exception, owner-ruled 2026-11-05, verbatim:** "adopt the
by-name ruling on engraph". It carries the owner's S4036 ruling of
2026-11-03 (§[S4036](#s4036--os-commands-resolved-via-path)): tooling invokes
each binary by name, with `PATH` as the trust root. No change in the tree
cures a site within that class without choosing a binary's path, which the
ruling rejects, so such a site is marked `FALSE_POSITIVE` (an issue) or
`SAFE` (a hotspot) with the class's canonical rationale. A site outside the
class is cured like any other finding.

Under `agent-tools/` the class takes no per-site mark. The owner chose one
project setting instead on 2026-11-11, verbatim: "we are not removing
automatic analysis for one issue. What setting do I need to change in
Sonar?" It is set on both analyser projects, Oak's
(`oaknational_oak-open-curriculum-ecosystem`) and Engraph's
(`EngraphCode_open-curriculum-ecosystem`): Administration → General
Settings → Analysis scope → Issues → Ignore Issues on Multiple Criteria,
with one criterion, rule key pattern `typescript:S4036` and file path pattern
`agent-tools/**/*`. Automatic analysis reads no rule-ignore configuration
from the tree, so the criterion lives in each project's server-side
settings. A class site outside `agent-tools/` keeps the per-site mark. The
criterion's cost is known: it also silences S4036 at an
`agent-tools/` site outside the class, where external input reaches a shell.
CodeQL's command-injection queries do not cover such a site when the input
is a command-line argument or an environment variable: the CodeQL workflow
leaves the threat model at its default, remote, under which neither is a
taint source.

The substitute check, owner-chosen on 2026-11-12, is the lint rule
`@oaknational/no-shell-form-process-launch`, on for every file the
`agent-tools` workspace lints. It fails on `exec` and `execSync` from
`child_process`, which always run a shell, and on a `shell` option that is
not the literal `false`, so a process there launches with an argv array and
no shell. That is stricter than §S4036's criteria, which allow a wholly
literal shell string. The rule reads syntax only: a shell reached by its
command name (`spawn('sh', ['-c', text])`), or through an options object
built where the rule cannot see it, is left to review against §S4036's
decision criteria. The criterion is reopened if the repository moves to
CI-based analysis, where a tracked configuration can take the place of the
server-side setting, or if that lint rule is relaxed or removed.

## Disposition Workflow

1. **Is the finding the excepted query?** `js/missing-rate-limiting` is
   excluded in `.github/codeql/codeql-config.yml`, so it should never
   appear. If it does, the tracked exclusion has regressed: restore the
   configuration, never an act in the analyser's console. It is not a class
   in the catalogue below.
2. **Is the finding S4036 at a site within §S4036's class?** A site under
   `agent-tools/` raises no finding in the analyser, because the second
   exception's project criterion ignores it. An issue there from an analysis
   that ran before the criterion was saved closes at the next analysis. If
   a later analysis raises one, the criterion has been lost: the owner, who
   holds the project setting, restores it, and the site is never marked.
   Mark a class site anywhere else, `FALSE_POSITIVE` for an
   issue or `SAFE` for a hotspot, with the class's canonical rationale: the
   second exception, and the only per-site server-side act in this
   workflow. A site outside the class continues below.
3. Otherwise **match the rule key** to a documented class below.
4. **Match the site shape** against the class's shape criteria; they say
   what the analyser is seeing, which is what tells you the cure.
5. Apply the class's **cure**: make the change and let the next analysis
   close the finding. There is no server-side action here; a `FIXED` state
   is assigned by analysis, never by hand.
6. If the rule is documented but the site shape does not match: do per-site
   review, cure it, and consider whether the class needs a sub-clause
   amendment recording the new shape and its cure.
7. If the rule is not yet documented: cure the site and add the class to
   this document at the next consolidation pass.

## General Disposition Principles

These govern _how_ a finding is dispositioned, beneath the per-class catalogue:

- **Precedent is not correctness.** N prior dismissals of a rule do not make
  _this_ site a false-positive — verify the defect's presence or absence
  first-hand at each site. (A 12×-dismissed `incomplete-sanitization` rule still
  flagged a real backslash-escaping bug; the fix was genuine.)
- **A lens-resolvable cure is not an owner decision.** When the
  [decision lenses][principles] (LTAE first) decisively resolve which change
  cures a site, decide it — framing a lens-resolved call as an owner-fork is
  analysis-passback. Escalate only when all lenses genuinely fail or the
  scope is product/feature. (The exceptions, the tracked exclusion of
  `js/missing-rate-limiting` and the S4036 by-name class, were the owner's
  rulings; the cure _determination_ at a site never is.)
- **A deliberately-adopted profile's findings are a worklist, not noise.** When
  the owner activates an analyser profile on purpose, the target is zero,
  by cure. Do NOT frame the resulting backlog as an activation-wave
  to "wait out" via push-and-reanalyse — that lesson is for STALE / zombie
  analysis against a moving target, never a fresh deliberate profile.
- **The posture is fix-first with zero dismissals, for both analysers.**
  It began as the CodeQL posture (owner reversal, 2026-07-29 — _"why should
  I dismiss issues detected by CodeQL?"_) and became the rule for every
  finding on 2026-09-08. Dismissals are per-instance and do not survive
  refactors (alerts #83–86 recurred as #226–229 after the code moved), so a
  dismissal buys silence, not absence: cure structurally in the code
  instead. The posture was vindicated when a flagged pattern proved to be a
  real super-linear-backtracking ReDoS vector. Agents never dismiss alerts;
  the One-Outcome Rule's first exception is a tracked query exclusion, not a
  dismissal, and its second resolves an S4036 site within §S4036's class,
  by the project criterion under `agent-tools/` and by a per-site mark
  everywhere else.
- **Triage by cause-class, but a class splits by disposition-route.** A rule
  class (e.g. a regex backlog) does not resolve uniformly: generated output →
  fix at the generator; generator source → fix in place + regen; hand-written →
  consolidate to the rule's home; vendored/standard → refactor-to-import;
  runtime-only → fix in place. An owner's "do X to all of them" applies cleanly
  only to the class it actually fits.

## Cure Constraints (class-level, from the fix-forward arcs)

- **S2871 (provide a compare function)**: never cure with `localeCompare` —
  locale-dependent ordering breaks reproducible snapshot ordering (16 sites
  in the founding arc). Use a code-unit comparator.

## Remediation Branch Source of Truth

When a branch is opened to remediate existing main/project Sonar debt, the
authoritative backlog is the current main/project issue and hotspot inventory.
PR-scoped Sonar for that remediation branch is a regression guard: use it to
prove the branch has not introduced new findings, not to redefine the original
worklist. Branch findings that predate the remediation branch's changes must be
reconciled against the main/project source before they become implementation
work.

## Documented Classes

Each class below records what the analyser sees, the shape criteria that
identify the class at a site, and the cure. The criteria were written, before
the 2026-09-08 ruling, as the conditions under which a site could be marked
`SAFE` or `FALSE_POSITIVE` in the analyser, and the canonical rationales
were the comments those marks carried; under the
[One-Outcome Rule](#one-outcome-rule-owner-ruled-2026-09-08) they identify
the class and license no mark. Every class below records its **cure** —
the change that makes the pattern absent at a site that meets the
criteria, alongside the FIX path its failing sites always took — so this
policy is complete on its own, and any plan that applies these cures to
sites references this policy, never the reverse. Sites marked before the
ruling keep their record; the ruling binds every finding
from its date, and any re-disposition of the earlier marks is the owner's
call (§[Maintenance](#maintenance)).

### S5443 — Publicly writable directories

**Pattern**: `/tmp` (or other publicly-writable paths) appears as a path
argument in test code.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

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

**Cure** (every site): a per-run directory from `fs.mkdtemp` under
`os.tmpdir()` — or the test runner's own temporary directory — in place of
a fixed publicly writable path literal; a mocked filesystem takes a
non-public fixture path. The rule fires on the literal, and the literal is
never needed.

### S5332 — Clear-text protocols (`http://`)

**Pattern**: `http://` URL in code, typically `http://localhost:<port>`,
`http://fake-<service>:<port>`, `http://example.com`, or RFC-2606 reserved
test domains.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

- Site is in a test file (same glob set as S5443) or in a test-runner
  config (`playwright.config.ts`, `vitest.config.ts`, etc.) or a
  `test-helpers/`, `e2e-fakes/` module.
- The URL targets a synthetic test endpoint, a localhost loopback, or an
  RFC-reserved test domain — never a production hostname.
- Production deployments use `https://` URLs sourced from environment
  variables; this URL is not the production-runtime value.

**Canonical rationale**: "test-fixture URL; synthetic/localhost/test-domain
target; production runtime uses `https://` env var".

**Cure** (every site): `https://` for every URL that names a real host; a
test that needs a clear-text loopback endpoint builds the URL at runtime
from the runner-assigned address and a scheme constant instead of carrying
an `http://` literal in source (the worked example under the 2026-09-08
amendment is this class's).

### S1313 — Hardcoded IP addresses

**Pattern**: IP literal (RFC 1918 private, RFC 3849 documentation,
loopback, or synthetic) in code.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

- Site is in a test file (same glob set as S5443).
- The IP is a fixture value driving a test of header-redaction,
  rate-limiting, IP-parsing, or similar input-handling code.
- The IP is not embedded in production code as a runtime configuration
  default.

**Canonical rationale**: "test-fixture IP literal; drives input-handling
test; not a production-runtime value".

**Cure** (every site): a named host or a configuration value in place of
the literal; a test of address-handling code builds its input at runtime
(from octets, or from the parsed form the code under test consumes) so no
address literal sits in source.

### S5852 — Slow regular expressions

**Pattern**: Regex with super-linear complexity flagged by Sonar's regex
analyser.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

- Site runs at codegen time (`pnpm sdk-codegen`), build time
  (`pnpm build`), or in a data-pipeline / admin CLI —
  never inside a request handler.
- Input is upstream-controlled: OpenAPI schema, generated TypeScript
  source, sitemap XML from allowlisted hosts (`isAllowedSitemapUrl` or
  equivalent), curriculum bulk data, or repo-internal markdown.
- Pattern is anchored or character-class-bounded such that the
  super-linear behaviour cannot be triggered by the actual input shape.

**Canonical rationale**: "build-time/codegen-time regex; upstream-
controlled input; anchored or character-class-bounded; not a request-
handler path".

**FIX path and cure** (every site, request-handler or not): rewrite to
linear constructs (negated character classes, anchored alternations,
bounded quantifiers) or plain string operations, per the rule's documented
strategies; on a request-handler path the rewrite is urgent.

### S4036 — OS commands resolved via PATH

**Pattern**: `spawn`, `spawnSync`, `exec`, `execSync`, `execFile`,
`execFileSync` and similar calls resolve a command name (`git`, `pnpm`, `gh`,
`gitleaks`, `typedoc`) through `PATH`, not an absolute path.

**Ruling** (owner, 2026-11-03):

- Tooling invokes each binary it needs by name, as any repository does.
- Code must not choose a binary's path or rewrite `PATH` for it, and nothing
  in the repository may depend on one machine's directory layout.
- `PATH` is the trust root. The operator's environment, local or CI, decides
  which binary a name resolves to. A writer of a directory on that `PATH`
  already controls the operator's shell, so no path chosen inside the
  repository adds a boundary.
- A binary check exists only where a quality gate or CI needs the binary, and
  only so that a missing tool fails early with a helpful message, never late
  and opaque. The check is `command -v` plus, where the version matters, a
  version check, run once.

**Decision criteria**: a site is within the class if and only if both hold:

- The command is a binary the repository's tooling, build, tests or CI need,
  named literally at the call site or by a constant.
- No external input reaches a shell. Either the arguments pass as an argv
  array with no `shell` option, or the call's shell string is wholly literal.
  With `shell: true`, Node joins an argv array into one shell string, so an
  array alone does not keep input from the shell. Under `cross-spawn` on
  Windows, a `.cmd` or `.bat` target runs under `cmd.exe`, and a shim such as
  `pnpm.cmd` reads its arguments a second time, where a double quote in one
  can end its quoting. There an argv array keeps input from the shell only
  when no argument can hold that character: the repository's own literals,
  and paths to files that exist, since Windows forbids it in a file name.

**Outcome for a site within the class**, by the finding's type:

- The rule raises a vulnerability **issue**. It is `FALSE_POSITIVE`: the
  defect it describes, a command resolved through a `PATH` the operator does
  not control, is not present, because `PATH` is the trust root. Under
  `agent-tools/` neither analyser project raises it (the second exception's
  criterion), so the mark is made only at a class site elsewhere.
- Where the rule raised a **hotspot** (it did before 2026-07), the hotspot is
  `SAFE`.

**FIX** a site outside the class. Once fixed, it is within the class:

- External input that reaches a shell: move the call to argv form with no
  `shell` option (`execFile`, or `spawn` with an arguments array), so the
  input can only ever be an argument.
- A command name taken from input: choose it from a fixed set of literal names
  at the site.

**Canonical rationale**: "repository-required binary invoked by name; `PATH`
is the trust root (§S4036 ruling); no external input reaches a shell".

**Worked example**: `realPnpmRunner` in `agent-tools/src/spawn/build-runner.ts`
runs the repository's pnpm by name with an argv array and no `shell` option.
It launches through `cross-spawn`, which on Windows runs a `pnpm.cmd` shim
under `cmd.exe` with its own argument escaping; the arguments are the
repository's own, so no external input reaches that shell.

**Delta from the prior class**: S4036 was FIX-only, cured by an absolute path
chosen from a fixed list of directories. The ruling gives a site within the
class the outcomes above instead. An absolute path is the only change that
clears the analyser, and it makes the repository depend on one machine's
directory layout, which the ruling rejects. No site previously dispositioned
under this class needs re-disposition:

- The eight hotspots marked `SAFE` before the class became FIX-only each name
  a repository binary literally. Six pass an argv array, and two run a wholly
  literal shell string.
- The one issue the rule has raised, on the `gitleaks` call in
  `agent-tools/src/secret-scan/run-push-secret-scan.ts`, was accepted in
  2026-07. That file sits under `agent-tools/`, where the second exception's
  criterion now ignores the rule.

### S2245 — Pseudorandom number generator (`Math.random()`)

**Pattern**: `Math.random()` used in code.

**Identification** — the class is present when the use is one of the
following (before the 2026-09-08 ruling these were the conditions for a
`SAFE` mark; they license none now):

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

**FIX path and cure** (every site): `crypto.randomUUID()`,
`crypto.randomInt()`, `crypto.randomBytes()` or `crypto.getRandomValues()`
in place of `Math.random()` — for identifiers, jitter and sampling as much
as for any cryptographic, session or token use; the cryptographic source
costs nothing at those sites and the rule stops firing.

### S1523 — Dynamic code execution (`eval`, `Function`, `javascript:`)

**Pattern**: `eval()`, `new Function(...)`, or `javascript:` URL.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

- Site is in test code AND the input to `Function` / `eval` is a string
  literal or a value derived synchronously from a same-file string literal
  (matching the rule's documented exception).
- The use is a syntax-validation tool, not a runtime evaluation of
  attacker-influenced input.

**Canonical rationale**: "test-only `Function`/`eval` as syntax validator
over same-file literal-derived input; no untrusted source; not in any
production code path".

**FIX path and cure** (every site): replace with a parser, a switch,
schema-driven dispatch, or a static lookup; a test that validates syntax
parses with the TypeScript compiler API or a parser package instead of
`Function`/`eval`. A production use with runtime-composed input is a real
defect and takes the same replacement.

### S4790 — Weak hash algorithm (MD5, SHA-1)

**Pattern**: `createHash('md5')`, `createHash('sha1')`, or equivalent.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `SAFE` mark; they
license none now):

- Hash output is used purely for **format conversion** or **cache key
  derivation** from a non-secret input — never for integrity verification,
  authentication, signing, password hashing, or any security boundary.
- The choice is justified by a non-security property (specific
  byte-length output, deterministic short identifier, compatibility
  with an external schema like OpenTelemetry TraceId's 32-char hex).

**Canonical rationale**: "MD5 used as deterministic 128-bit format
conversion to derive [target schema] from non-secret input; not used in
integrity/authentication/signing context".

**FIX path and cure** (every site): SHA-256 (truncated to the required
length where a fixed-width identifier or an external schema's width is the
property wanted) for format conversion and cache keys; SHA-256 / SHA-512 /
HMAC / bcrypt / argon2 as appropriate for any security use.

### S5689 — Framework version disclosure

**Pattern**: Express (or similar framework) instantiation that, by
default, emits a framework-identifying response header (`X-Powered-By`,
`Server`, etc.).

**Identification** — the class is present when **a runtime test asserts
the header is absent** at the application layer (before the 2026-09-08
ruling this was the condition for a `SAFE` mark; it licenses none now). Static analysis cannot see
downstream middleware (e.g., helmet's `hidePoweredBy`); the test pins the
property regardless of implementation detail.

**Canonical rationale**: "framework-version header verified absent at
runtime by `<test path:line>`; downstream middleware (helmet
`hidePoweredBy` or equivalent) strips the header globally; test acts as
regression guard".

**FIX path and cure** (every site, including one whose runtime test
already passes): add `app.disable('x-powered-by')` (Express) or helmet's
`hidePoweredBy` AT THE INSTANTIATION SITE ITSELF, where static analysis
can see it — downstream middleware in another module leaves the site
firing — AND keep the test that asserts the header's absence. The test is
mandatory; the disable call alone is insufficient because future config
changes can silently re-enable the disclosure.

### S6505 — Dependency installation lifecycle scripts

**Pattern**: a dependency-install command (`pnpm install`, `npm install`,
`yarn install`) without an explicit `--ignore-scripts`, flagged because
dependency lifecycle scripts can execute arbitrary code at install time.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `FALSE_POSITIVE`
mark; they license none now):

- The installer is **pnpm at major version ≥ 10** — pnpm 10 removed
  automatic execution of dependency lifecycle scripts
  ([pnpm 10 release notes](https://github.com/pnpm/pnpm/releases/tag/v10.0.0)).
  Scripts run only for packages named in an explicit allowlist:
  `onlyBuiltDependencies` (pnpm 10) or its pnpm 11 replacement, the
  `allowBuilds` map in `pnpm-workspace.yaml`
  ([pnpm settings: `allowBuilds`](https://pnpm.io/settings#allowbuilds)).
- The repo pins that pnpm version authoritatively: root `package.json`
  `packageManager` field drives every CI site
  via `pnpm/action-setup` as an **exact version pin**. The field also
  carries a `+sha512` integrity suffix, but the pinned action strips it
  before `pnpm self-update` (`readTargetVersion`'s split on `+`), so CI
  enforces the version, not the content hash — and the version alone is
  what this class's script-execution property attaches to.
- No global script re-enable is in force: `dangerouslyAllowAllBuilds`
  is absent (or explicitly `false`) in every tracked pnpm config surface
  (`pnpm-workspace.yaml`, any `.npmrc`) and is not passed on the flagged
  CI invocation — the setting bypasses the allowlist wholesale, so its
  absence is a criterion, not an assumption (verified absent in this
  repo's tracked config, 2026-07-20). From pnpm 12, the `permissions`
  setting's `build` capability works like `allowBuilds` and takes
  precedence over it, so `permissions` grants `build` only to the
  reviewed allowlist entries below, or to none (verified 2026-11-03: it
  holds no `build` grant; its one entry denies the agent skill `dotenv`
  ships).
- Every allowlist entry is a **reviewed, build-requiring package** (the
  current six: `@clerk/shared`, `@sentry/cli`, `esbuild`,
  `unrs-resolver`, `core-js`, `sharp` — see
  [`build-system.md`](../engineering/build-system.md) §allowBuilds). The
  allowlist is tracked config: no arbitrary or newly added dependency
  can execute install scripts without a reviewed change to it. This is
  the rule's own compliant control for pnpm — the finding flags
  _unrestricted_ script execution, which the allowlist precludes.

**Canonical rationale**: "pnpm `<version>` pinned via `packageManager`;
pnpm ≥ 10 executes dependency lifecycle scripts only for the reviewed
`allowBuilds` allowlist (six build-requiring packages, tracked in
`pnpm-workspace.yaml`); arbitrary dependencies cannot execute install
scripts at the flagged site".

**FIX path and cure** — for a pnpm ≥ 10 site the finding describes a
shape that cannot exhibit the defect, and the analyser-clearing change is
the flag it reads plus pnpm's documented complement: `pnpm install
--frozen-lockfile --ignore-scripts` followed by `pnpm rebuild --pending`
(which builds the packages that were not built during an `--ignore-scripts`
install — `pnpm rebuild --help`, pnpm 11.20.0 — and the reviewed allowlist
still governs which of them execute scripts). Never a mark. For all
non-pnpm installers, and any pnpm < 10, the flag is installer-specific: `--ignore-scripts` for npm and Yarn Classic (1.x);
`--mode=skip-build` for Yarn Berry (2–4, whose `install` rejects
`--ignore-scripts`); `--ignore-scripts` for pnpm < 10. npm and yarn
execute dependency lifecycle scripts by default at every major version,
so no version argument substitutes for the flag there.

### S6506 — Unpinned transport on downloaded artefacts

**Pattern**: `curl` fetching an artefact without constraining the
protocol, so a redirect chain could downgrade to plain HTTP. (A `wget`
site also matches the rule but has no equivalent compliant flag —
`--https-only` governs recursive links, not redirect targets — so a
flagged `wget` fetch is replaced with the curl form below, or run with
redirects disabled.)

**Decision criteria**: there is no FALSE_POSITIVE disposition for
production or CI fetch sites — resolve as **FIXED** by pinning the
transport:
`--proto '=https' --proto-redir '=https'` (curl —
[`--proto`](https://curl.se/docs/manpage.html#--proto) /
[`--proto-redir`](https://curl.se/docs/manpage.html#--proto-redir)),
keeping any existing content pin (SHA-256 check) in place. The wget
`--https-only` semantics above are per the
[GNU Wget manual §HTTPS Options](https://www.gnu.org/software/wget/manual/wget.html). The content pin alone does not
clear the finding: integrity checking and transport pinning guard
different failure modes (tampered bytes vs downgrade interception), and
the analyser flags the transport.

**Canonical rationale** (for the FIXED trail): "transport pinned to HTTPS
including redirects; SHA-256 content pin retained".

### Generated Code

**Pattern**: Style-class issues (naming, formatting, structural smells,
duplication-shaped findings) raised on files produced by a code generator
under a path matching `**/src/types/generated/**` — primarily output of
`openapi-typescript` consumed by `packages/sdks/oak-sdk-codegen/` and
downstream MCP tool/stub generators.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `FALSE_POSITIVE`
mark; they license none now):

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
is identified under this class. The flagged shape is mechanically chosen
by `openapi-typescript`; the human-edited corpus does not exhibit it, and
the file is regenerated on each `pnpm sdk-codegen` run.

**FIX path**: the cure is in the codegen pipeline, never at the site and
never a mark — adjust the OpenAPI schema, update the generator, or
post-process the output so the flagged shape is no longer emitted; a
generator-output finding that represents a real defect (security,
correctness, runtime hazard) takes the same upstream route. Never hand-edit
a generated file.

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
applies: per-rule shape criteria, the rationale the class once carried, and
the FIX path. The outcome is `FIXED` via code change. A zombie finding
against stale main-branch analysis where the code has already been fixed is
cured by pushing so the analyser re-analyses; a rule that mis-fires on a
shape that cannot exhibit the defect it describes is cured by changing the
shape so the rule no longer fires, never by marking the finding.

### S8786 — Super-linear regular expressions

**Pattern**: Regex flagged by Sonar's runtime-complexity analyser as having
super-linear (potentially catastrophic) backtracking. The Issue-form sibling
of the [§S5852](#s5852--slow-regular-expressions) security hotspot: same
underlying concern (a regex whose worst case is super-linear in input length),
surfaced as a maintainability issue rather than a security hotspot.

**Identification** — the class is present at a site when all hold (before
the 2026-09-08 ruling these were the conditions for a `FALSE_POSITIVE`
mark; they license none now):

- Site runs at lint/validation time, codegen time, build time, or in a
  data-pipeline / admin CLI — never inside a request handler.
- Input is repo-internal or upstream-controlled: repo markdown, generated
  TypeScript, the OpenAPI schema, curriculum bulk data, or equivalent —
  never end-user request input.
- The pattern is anchored or character-class-bounded such that the
  super-linear behaviour the rule describes cannot be triggered by any
  input shape (for example, an end-anchored match over a negated character
  class, where the negated class and the following literal cannot overlap).

Whether or not the criteria hold, the outcome is the rewrite below; when
the regex is on a request-handler path the rewrite is urgent, not optional.

**Canonical rationale**: "validation/build-time regex; repo-internal input;
end-anchored over a negated character class so the flagged super-linear
backtracking cannot occur; not a request-handler path".

**FIX path**: rewrite the flagged regex
to linear constructs (negated character classes, anchored alternations,
bounded quantifiers) or to plain string operations, per the rule's
documented strategies.

**Worked examples** (all in agent-tooling validators, repo-internal markdown
input, end-anchored over negated classes — identified under this class and
marked before the ruling; since 2026-09-08 such a site is rewritten to the
linear form so the rule stops firing):

- `agent-tools/src/validators/markdown-links/validate-markdown-links-helpers.ts`
  — `/\s+"[^"]*"$/` strips a trailing markdown link title.
- `agent-tools/src/validators/reference-direction/validate-reference-direction-helpers.ts`
  — the same `/\s+"[^"]*"$/` title-strip.
- `agent-tools/src/practice-fitness/item-count.ts` — `/[^\w-]+$/` strips a
  trailing status annotation.

**Delta from prior**: this is the first Issue class codified beyond the
placeholder. It mirrors the established §S5852 hotspot class one-for-one in
decision shape (build/validation-time + controlled input + anchored/bounded
⇒ the class; request-handler ⇒ urgent), differing only in finding type
(Issue vs hotspot); under the One-Outcome Rule neither finding type takes a
mark. It does not relax any standard: a request-handler regex still fails
the gate.

## File-Based Configuration (`.sonarcloud.properties`)

This repo uses SonarCloud **automatic analysis**, which reads **only**
[`.sonarcloud.properties`][sonar-config]. There is deliberately no
`sonar-project.properties` — that file is read solely by the sonar-scanner CLI
(CI-based analysis), which this repo does not run, so it had no effect and was
removed once confirmed dead.

The only file-based analysis config is:

- `sonar.sourceEncoding=UTF-8` — pins source decoding so the analyser cannot fall
  back to a host JVM encoding and misdecode the repo's UTF-8.
- `sonar.exclusions` — the analysis scope: the studio-source preservation tier
  (§2026-07-19 amendment) and, by extension, the binary file types `.png`,
  `.gif`, `.ico`, `.ttf`, `.pdf`, `.xlsx` and `.zip` (§2026-11-11 amendment on
  binary files). Binaries are not source; the globs are a scope rule that
  disables no rule and removes no source file from analysis.
- `sonar.cpd.exclusions` — the duplication-analyser denominator scope documented
  in [§Duplications](#duplications-cpdexclusions) above. It narrows only the cpd
  denominator; it disables no rule.

**There is no file-based rule-ignore mechanism.**
`sonar.issue.ignore.multicriteria` (per-rule × glob disables) is read from
no file in the tree: the scanner CLI reads it from
`sonar-project.properties`, which automatic analysis ignores. Automatic
analysis applies it only as the server-side project setting Ignore Issues on
Multiple Criteria. Wherever it is set, it suppresses a rule across every current and future matching
file, blind to per-site context, so it is forbidden under
[`never-disable-checks`][no-disable] with one owner-chosen exception: the
S4036 criterion for `agent-tools/`, set on both analyser projects
(§One-Outcome Rule, the second exception). No other rule-ignore criterion may
be set on either analyser project. A dead copy of such a block once lived in the unread
`sonar-project.properties` and never took effect; it has been removed.

**Every other finding is resolved in the tree**, per
[§Disposition Workflow](#disposition-workflow): the class definitions above
say what the analyser sees and which change clears it, and the next analysis
closes the finding. The S4036 criterion aside, the absence of a file-based
ignore is not a gap to be filled by a server-side mark or setting — since the 2026-09-08 ruling there is no mark
to make, for S5443 / S5332 / S1313 in test fixtures as for every other
class but S4036's (the second exception: the criterion under
`agent-tools/`, a mark at a class site elsewhere). The first exception, the
rate-limiting query, is no per-site record either: it is the tracked `query-filters` entry in
`.github/codeql/codeql-config.yml`, which knowingly silences that query for
every route (§One-Outcome Rule).

### Expansion discipline (`.sonarcloud.properties`)

The one file-based knob that carries policy is `sonar.cpd.exclusions`. Adding a
glob requires, in order: (1) policy amendment in this file with the per-glob
architectural reason; (2) owner authorisation — an agent may propose but must not
enact; (3) the `.sonarcloud.properties` update. The reason must be substantive —
"the gate is failing" is not a reason. Narrowing the duplication denominator for a
path range is functionally a gate-scope change, so it goes through the same
discipline as any [`never-disable-checks`][no-disable]-adjacent decision.

A glob added to `sonar.exclusions` goes through the same three steps. A
binary file-type glob names an extension only, never a directory and never a
text or source type.

[sonar-config]: ../../.sonarcloud.properties

## Maintenance

- Amend this policy when a new pattern emerges, when a class needs a
  sub-clause for a new use shape, or when a previously-permitted shape
  is reclassified.
- Amendments must include a worked example and a clear delta-from-prior
  rationale. Removing a permitted shape requires re-disposition of any
  sites previously SAFE-d under the removed shape. The 2026-09-08 ruling
  removed every permitted mark at once; whether the sites marked before it
  are re-opened and cured, and in what order, is the owner's decision,
  recorded on whatever plan carries it when given — this policy binds
  forward from the ruling and does not re-open them by itself.
- The policy is a living document. Reviewers should challenge stale
  rationales at consolidation time.

## 2026-07-19 amendment: the studio-source scope (ADR-213), owner-ruled

Owner ruling (2026-07-19, verbatim): "Product code gets no sonar exclusions
for any reason (including generated product code), no quality gate
exceptions, nothing, it all gets the full set of strict, strict
requirements" — and scope exclusion is legitimate "if and only if they are
not used as production code, and are organised and moved and kept explicitly
as source material from Claude Design."

Implementation:

- **The boundary is structural, not a glob list**:
  `packages/design/oak-design-system/studio-source/` holds exactly the
  non-production Claude Design source material (specimens, white-label
  proofs, reference build, templates, compiled reference components,
  vendored reveal.js, proof pages — see its README). `sonar.exclusions` and
  the design-system `sonar.cpd.exclusions` glob bind that path alone.
- **Everything consumable is fully analysed** — the root token CSS, class
  library, print layer, `brand.css` (it is on the package export surface, so
  it is product code and back in scope), `oak-icons.css`, `oak-theme.js`,
  `dtcg/`, `assets/`, docs — under the standard gate including the
  duplication metric. Their findings resolve per-site in the tree (at this
  amendment's date `brand.css`'s commented-template findings were per-site
  FALSE_POSITIVE adjudications; since 2026-09-08 such a site is changed so
  the finding no longer fires), never a scope carve-out.
- **Movement rule**: if any studio-source file becomes consumed by product
  code, it moves out of `studio-source/` and under the full gate in the same
  change. Expansion of the studio-source scope follows the §Duplications
  discipline: policy amendment first, owner authorisation, then config.

## 2026-11-11 amendment: binary files excluded from analysis scope, owner-authorised

Owner authorisation (2026-11-11, verbatim): "yes, make it as its own small
PR". Given on a proposal to test one hypothesis about the analysis warning
both analyser projects show: "There are problems with file encoding in the
source code. Please check the scanner logs for more details." Automatic
analysis exposes no scanner log.

Delta from prior: `sonar.exclusions` gains seven by-extension globs beside
the studio-source path — `**/*.png`, `**/*.gif`, `**/*.ico`, `**/*.ttf`,
`**/*.pdf`, `**/*.xlsx`, `**/*.zip`. These are the extensions of every
tracked file outside `studio-source/` that is not valid UTF-8, at this
amendment's date: 37 files, all binary. Every tracked text file decodes as
UTF-8 with no byte-order mark. A binary file is not source, so this is a
scope rule: no rule is disabled and no source file leaves analysis. The
2026-07-19 ruling on product code is unchanged; a product image or font is
an asset, not code, and every source file beside it stays fully analysed.

The cause is a hypothesis, not a finding: that the scanner, run over the
whole tree, reads these binaries as UTF-8 and raises the warning. The check
is the analysis-warning banner on each analyser project after the next
analysis of the default branch. If the warning persists, the hypothesis is
false and the globs are reconsidered. Worked example: `favicon.ico` under an
app's `public/` directory is no longer indexed, and the app's source files
are analysed as before.

## 2026-09-08 amendment: one outcome, one exception, owner-ruled

Owner ruling (2026-09-08, verbatim): "We don't dismiss issues, we fix
them." Given on the code-scanning lane's two owner-reserved acts as then
planned — `SAFE` marks for localhost literals in test helpers, and four
false-positive dismissals of missing-rate-limiting alerts citing ADR-219 —
and binding on every finding from either analyser from that date.

The same day, the one exception (verbatim in
§[One-Outcome Rule](#one-outcome-rule-owner-ruled-2026-09-08)): the
rate-limiting work is paused; the routes carry comments recognising the
defence-in-depth option and the edge controls relied on; and in this ONE
case the findings are dismissed, kept dismissed rather than revisited. An
earlier pre-ruling the same morning ("amend ADR-219: edge primary,
in-process permitted") is superseded by it: ADR-219 stands unchanged.

Delta from prior: the Two-Outcome Rule (fix, or a class-criteria mark in
the analyser) becomes the One-Outcome Rule (fix), and the class catalogue's
criteria change role from licence to identification. Worked example: a
clear-text `http://localhost` literal in a test helper met S5332's
criteria and would have taken a `SAFE` mark; under this amendment the
helper is changed so no clear-text literal is present (the code-scanning
lane's unit for the class), and the finding closes on the next analysis.
Worked example of the exception: a route handler the analyser flags for
missing rate limiting takes a comment naming the edge control and the
defence-in-depth option, and its one finding is dismissed once in the
analyser's record citing ADR-219 — never a path exclusion or a query
filter, which would silence the rule for every route to come.

## 2026-09-17 amendment: the exception's mechanism is the tracked exclusion

The 2026-09-08 worked example above prescribed one dismissal per alert and
forbade a query filter. On 2026-09-10 the rules tier recorded that per-alert
shape (`41235118c`), and the same day `.github/codeql/codeql-config.yml`
gained a `query-filters` exclusion of `js/missing-rate-limiting`
(`bd7a3509e`), whose comment attributes it to the 2026-09-08 ruling. Asked
which mechanism the ruling meant, the owner answered on 2026-09-17,
verbatim: "a permanent exclusion is allowed, but ONLY for that one issue".

Delta from prior: the exception's mechanism is the tracked exclusion, and
the §One-Outcome Rule text and Disposition Workflow step 1 are amended to
it. The cost the worked example named is accepted knowingly: the query is
silenced for every route to come, and ADR-219's edge rule is the control
for them. The scope does not widen: no other query or finding class is
excluded or dismissed, and the path scope rules (the studio-source tier of
the 2026-07-19 amendment, the duplication globs) are unchanged by this one.

## 2026-11-05 amendment: S4036 by name, the second exception, owner-ruled

Owner ruling (2026-11-05, verbatim): "adopt the by-name ruling on engraph".
Given when the upstream carrier at release 1.186.8 met this estate's opposite
cure. Upstream invokes `pnpm`, `gh` and `gitleaks` by name under the owner's
S4036 ruling of 2026-11-03, and this estate resolved each binary to an
absolute path from a platform-partitioned allowlist.

Delta from prior: §S4036 takes the upstream text whole except its worked
example, and the §One-Outcome Rule gains its second exception, so a site
within the class is marked rather than cured. The Disposition Workflow gains
the step that marks it. The first exception's scope is unchanged. The
§S4036 delta's counts are the upstream analyser project's; this estate's
analyser raises S4036 at each by-name site, and each is marked under the
second exception.

The worked example is this estate's own. Upstream's names `run-typedoc.ts`,
which here runs TypeDoc through the package's own entry under
`process.execPath`, never by name. At this amendment's date `git`,
`gitleaks` and the smokes' shell still resolve through the absolute-path
resolvers in `agent-tools/src/core/` (`trusted-git.ts`,
`trusted-gitleaks.ts`, `trusted-shell.ts`); each moves to by-name in its own
change.

## 2026-11-11 amendment: the S4036 criterion for `agent-tools/`, owner-chosen

Owner ruling (2026-11-11, verbatim): "we are not removing automatic analysis
for one issue. What setting do I need to change in Sonar?" Given when the
reunification pull request's first analysis on Oak's project raised the
S4036 class at 30 by-name sites carrying no mark on Oak's project, and a
tracked configuration was found to need CI-based analysis, which the owner
declined. The owner set the criterion on both analyser projects the same day.

Delta from prior: the second exception's mechanism for `agent-tools/` is one
project criterion on each analyser project, Ignore Issues on Multiple
Criteria with rule key pattern `typescript:S4036` and file path pattern
`agent-tools/**/*`, in place of a mark at each site. The per-site mark stands
for a class site outside `agent-tools/`, and the issues already marked under
`agent-tools/` need no re-disposition. The §There is no file-based rule-ignore
mechanism block names this criterion as the one exception to its ban, and
Disposition Workflow step 2 treats an S4036 finding under `agent-tools/`, raised
after the criterion was saved, as a lost criterion for the owner to restore. The cost is accepted knowingly, as the first
exception's was: an `agent-tools/` site outside the class is silenced too.
Its control is the lint rule `@oaknational/no-shell-form-process-launch`,
which the owner chose as the substitute check on 2026-11-12, with review
against §S4036's decision criteria for what that rule cannot see. The second
exception states the reopen condition.

Worked example: the pull request's first analysis raised 30 S4036 issues in
18 files, all under `agent-tools/`: 11 files under
`agent-tools/smoke-tests/` (nine smoke tests and two fixtures) and 7 tooling
sources, among them the two `git` calls in
`agent-tools/src/secret-scan/run-push-secret-scan.ts`. With the
criterion in place the analyser raises none of them, and a new by-name site
under `agent-tools/` raises nothing either. A class site under `apps/` or
`packages/` still raises its issue and takes the per-site mark with the
canonical rationale.

## Cross-references

- [`safety-and-security.md`](./safety-and-security.md) — security baseline.
- [`development-practice.md`](./development-practice.md) — quality gate
  taxonomy.
- [`.agent/rules/never-disable-checks.md`](../../.agent/rules/never-disable-checks.md)
  — gates stay on; this policy lives alongside Sonar, not instead of it.

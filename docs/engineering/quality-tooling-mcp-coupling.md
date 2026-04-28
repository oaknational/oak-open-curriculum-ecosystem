# Quality tooling: SonarCloud, CodeQL, and Sentry — coupled-MCP playbook

**Audience**: working agents (Claude Code, Codex, Cursor) and human reviewers driving quality remediation across this monorepo.

**Status**: living knowledge document. Last updated 2026-04-27 by Briny Ebbing Lagoon during PR-87 quality remediation.

This document captures the operational knowledge for driving repo quality up using three coupled tools — SonarCloud (with the Sonar MCP), CodeQL (via GitHub), and Sentry (with the Sentry MCP) — and the discipline that turns each tool's signal into a principled fix or a defensible dismissal.

---

## TL;DR

1. **SonarCloud** is the canonical static-analysis surface for this repo. The default Quality Gate ("Sonar way") fails on rating thresholds + coverage + duplication; the project's _active_ Quality Gate may also fail on raw `new_violations > 0` (which it does for this repo). **Always query the live QG conditions before scoping work** — different conditions need different fixes.
2. **CodeQL** is GitHub's deep dataflow / taint-tracking analysis. It complements Sonar by catching cross-function flows that Sonar's per-rule heuristics miss (and vice versa). CodeQL alerts are dismissed via the GitHub Security UI or API; SonarCloud issues are dismissed via the Sonar MCP.
3. **Sentry** is the runtime observability surface. It tells you which static-analysis findings actually matter in production by correlating issue locations with real error/perf events. Use Sentry MCP to ground severity rankings against runtime impact.
4. **The cardinal sin**: silencing a finding without investigating the architectural tension it surfaces. Per `principles.md` "NEVER disable any quality gates" and `feedback_never_ignore_signals`. The drift pattern that produces violation: investigation-mode → disposition-mode under context pressure. Mitigations are structural (one finding/site = one commit) not just textual.

---

## SonarCloud + Sonar MCP

### Invocation patterns

The Sonar MCP server (`mcp__sonarqube__*`) provides read-only inspection plus per-issue and per-hotspot status changes. The project key resolution discipline is documented in MCP server instructions; for this repo it is `oaknational_oak-open-curriculum-ecosystem` (default project for the MCP integration).

**Always at session-open** when working on a quality-remediation branch:

```text
mcp__sonarqube__list_pull_requests({ projectKey })
mcp__sonarqube__get_project_quality_gate_status({ projectKey, pullRequest: '87' })
mcp__sonarqube__list_quality_gates()  // see what gates exist
mcp__sonarqube__search_sonar_issues_in_projects({
  projects: [projectKey], pullRequestId: '87', issueStatuses: ['OPEN'], ps: 100,
})
mcp__sonarqube__search_security_hotspots({
  projectKey, pullRequest: '87', status: ['TO_REVIEW'], ps: 100,
})
```

The QG status for a PR returns _only_ the conditions that apply to new code. The default `Sonar way` gate checks new ratings + coverage + duplication; the project-specific gate (e.g. `Sonar way for AI Code`) may add `new_violations > 0`. Read the full conditions object — `status: ERROR` alone does not tell you which condition is failing.

### Mapping QG conditions to action

| QG condition                           | What it measures                            | How to address                                                            |
| -------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| `new_violations > 0`                   | Raw OPEN issue count on new code            | Per-issue fix OR per-issue dismissal (`accept` / `falsepositive`)         |
| `new_security_rating > 1`              | Security rating worse than A on new code    | Resolve any new SECURITY-impact OPEN issue or unreviewed hotspot          |
| `new_reliability_rating > 1`           | Reliability rating worse than A on new code | Resolve any new RELIABILITY-impact OPEN issue (CRITICAL bugs especially)  |
| `new_maintainability_rating > 1`       | Maintainability rating worse than A         | Reduce technical-debt-cost on new code                                    |
| `new_coverage < 80`                    | Test coverage on new code below threshold   | Write tests for uncovered new lines                                       |
| `new_duplicated_lines_density > 3`     | Duplication density above 3%                | Consolidate copy-pasted code into shared modules                          |
| `new_security_hotspots_reviewed < 100` | Security hotspots not 100% reviewed         | Mark each hotspot REVIEWED via Sonar MCP with FIXED / SAFE / ACKNOWLEDGED |

### Per-finding investigation discipline

The cardinal anti-pattern is the **rule-level disable** (the `sonar.issue.ignore.multicriteria` block reverted in commit `dba01e7c`). Each Sonar rule fires at distinct sites with distinct contexts. The disposition that's right for one site can be wrong for another:

- `S6644` (`??=` over conditional default-assign): mechanical fix at one site; the explicit `if` form may carry information about null-vs-undefined intent at another site.
- `S6594` (`RegExp.exec` over `String.match`): mechanical fix where the rule applies; the rule does not apply when `String.match` is used with the `/g` flag (the semantics differ).
- `S5852` (regex DoS): the rule fires on alternation + quantifiers; many sites are linear-time and not vulnerable.

**Discipline**: at each finding, read the code at the site, write an independent disposition rooted in `principles.md` (not in any pre-existing disposition table), then check the master plan or other heuristics for sanity. Commit before moving to the next finding, so per-site reasoning is observable in the commit message.

### Disposition mechanics — Sonar MCP write operations

The Sonar MCP exposes two state-change operations:

```text
mcp__sonarqube__change_sonar_issue_status({ key, status })
  // status: 'accept' | 'falsepositive' | 'reopen'
```

- `accept` — issue is valid; we acknowledge it and accept the trade-off (e.g., interface-conformance constraint requires the construct).
- `falsepositive` — the rule's heuristic mis-identified the code (e.g., substring match in non-error-message lines).
- `reopen` — re-open a previously dismissed issue.

```text
mcp__sonarqube__change_security_hotspot_status({
  hotspotKey, status, resolution, comment,
})
  // status: 'TO_REVIEW' | 'REVIEWED'
  // resolution (when REVIEWED): 'FIXED' | 'SAFE' | 'ACKNOWLEDGED'
  // comment: rationale (always include)
```

- `FIXED` — the underlying code change has resolved the security concern.
- `SAFE` — reviewed and determined to be safe in this context (with rationale).
- `ACKNOWLEDGED` — accepted as a risk.

**Critical**: hotspot review is the ONLY way to satisfy `new_security_hotspots_reviewed = 100%`. Marking via Sonar MCP changes the status server-side; this counts toward the QG.

**Permission caveat**: the MCP integration applies per-action permissions to writes on shared infrastructure. Some hotspot/issue state-changes may be denied with an explicit "user authorised investigation, not unilateral resolution" message. When this happens, surface the specific finding (key + rationale) for owner authorisation rather than retrying.

### Useful Sonar MCP read operations

```text
mcp__sonarqube__get_component_measures({ projectKey, pullRequest, metricKeys })
  // metricKeys: ncloc, complexity, violations, coverage, duplicated_lines_density, etc.

mcp__sonarqube__get_duplications({ key, pullRequest })
  // key: file key like 'project:path/to/file.ts'
  // returns: blocks of duplicated code with from/to ranges

mcp__sonarqube__search_duplicated_files({ projectKey, pullRequest })
  // list of files with duplications

mcp__sonarqube__get_file_coverage_details({ key, pullRequest })
  // line-by-line coverage, including partially covered branches

mcp__sonarqube__show_rule({ ruleKey })
  // detailed rule definition + remediation guidance

mcp__sonarqube__analyze_code_snippet({ snippet, language })
  // ad-hoc analysis of a code snippet, no project context
```

### Common rules + dispositions in Oak code

| Rule                                     | Mechanical fix                                                              | Common per-site investigation                                                                     | Common dismissal                                        |
| ---------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `typescript:S6653` `Object.hasOwn`       | `Object.hasOwn(Object(obj), key)` over `.call(obj, key)`                    | None; always mechanical                                                                           | n/a                                                     |
| `typescript:S7786` `new TypeError`       | TypeError for type-check throws (`typeof` / `Array.isArray` / `instanceof`) | Distinguish type-check throws from value/state throws                                             | n/a                                                     |
| `typescript:S7780` `String.raw`          | `String.raw\`...\``for regex sources with`\\` escapes                       | Verify the escape-arithmetic still matches; runtime-bound `${}` interpolation is preserved        | n/a                                                     |
| `typescript:S7763` `export ... from`     | Single-statement re-export; drop redundant local import if not used locally | Keep local import + add `export type ... from` when types are used locally AND re-exported        | n/a                                                     |
| `typescript:S6594` `RegExp.exec`         | `regex.exec(str)` over `str.match(regex)`                                   | Rule does not apply when `match` is used with `/g` (different semantics)                          | per-issue `falsepositive` when `/g` matters             |
| `typescript:S6644` `??=`                 | `x ??= y` over `if (x === undefined) x = y`                                 | Rule does not apply when intent distinguishes null vs undefined                                   | per-issue `accept` if explicit form carries information |
| `typescript:S2871` Array.sort comparator | `.toSorted((a, b) => a.localeCompare(b))`                                   | Default sort is locale-insensitive UTF-16 order — explicit comparator makes contract load-bearing | n/a                                                     |
| `typescript:S3735` void operator         | Investigate at site                                                         | Often load-bearing for Express middleware arity OR unused-parameter signal                        | per-issue `accept` with TSDoc rationale                 |
| `typescript:S7748` zero-fraction         | Investigate at site                                                         | `1.0` may be required by API contract (e.g., Sentry SDK float types)                              | per-issue `accept`                                      |
| `shelldre:S7677` redirect to stderr      | Investigate at site                                                         | Substring "error" in non-error lines (URLs, headers) is a false-positive                          | per-issue `falsepositive`                               |
| `javascript:S5843` regex complexity      | Reduce site count via consolidation (extract canonical regex to one module) | The regex grammar may be inherent to the spec (e.g., strict semver §2)                            | per-issue `accept` for genuinely-required inline copies |
| `typescript:S5852` regex DoS hotspot     | Investigate at site for ReDoS risk                                          | Look for nested quantifiers + overlapping alternation; many alternations of simple `+` are linear | hotspot REVIEWED → SAFE                                 |
| `typescript:S4036` PATH variable hotspot | Investigate at site                                                         | In dev/CI/build context, PATH IS the trust root; hardcoded absolute paths break portability       | hotspot REVIEWED → SAFE                                 |
| `typescript:S1313` hardcoded IP hotspot  | Investigate at site                                                         | Often a test fixture (a string parsed as version, not IP)                                         | hotspot REVIEWED → SAFE                                 |

### Anti-patterns

- **`sonar.issue.ignore.multicriteria` rule-level block** in `sonar-project.properties`. Disables the rule for an entire path glob across all current and future code. Violates `principles.md` "NEVER disable any quality gates". Reverted in commit `dba01e7c` after Vining Bending Root's drift incident on 2026-04-27.
- **Per-rule mass-mark via Sonar UI** without per-site investigation. Same shape as the `multicriteria` block — the disposition isn't grounded in the architectural tension at each site.
- **"Stylistic" / "false positive" labels** without naming the architectural tension. Labels are shortcuts; describe the actual code-shape constraint instead.

---

## CodeQL via GitHub

### Querying CodeQL alerts

CodeQL alerts are GitHub-side resources, not Sonar. Query via `gh`:

```bash
# All alerts for the repo (every state)
gh api repos/<org>/<repo>/code-scanning/alerts --paginate

# Open alerts only
gh api repos/<org>/<repo>/code-scanning/alerts \
  --jq '[.[] | select(.state=="open")]'

# Open alerts on a specific branch
gh api 'repos/<org>/<repo>/code-scanning/alerts?ref=feat/branch-name'

# Alert detail
gh api repos/<org>/<repo>/code-scanning/alerts/<number>
```

CodeQL alert state machine: `open` → `dismissed` (with reason) → `closed` (when the underlying code path is removed). Once dismissed, alerts stay dismissed across re-scans unless re-introduced.

### Dismissal

CodeQL alerts are dismissed via:

```bash
gh api -X PATCH repos/<org>/<repo>/code-scanning/alerts/<number> \
  -f state=dismissed \
  -f dismissed_reason='false positive' \
  -f dismissed_comment='<rationale>'
```

The dismissal reasons are constrained: `false positive`, `won't fix`, `used in tests`. The comment is the rationale carrier.

In Oak's threat model, the agent does NOT typically dismiss CodeQL alerts directly — the dismissal authority belongs to the owner via the GitHub Security UI. The agent prepares the rationale (in commit messages and in-code TSDoc) and surfaces the action items.

### CodeQL coverage gaps and Sonar coverage gaps

CodeQL and Sonar overlap heavily but have different strengths:

| Concern                                  | CodeQL                                        | Sonar                               |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------- |
| Cross-function dataflow / taint tracking | Strong (queries are explicit dataflow paths)  | Weak (per-rule heuristics)          |
| Per-line code-smell rules                | Weak (queries are typically security-focused) | Strong (hundreds of rules)          |
| Architectural / boundary checks          | Indirect (via custom queries)                 | Indirect (per-language conventions) |
| Coverage analysis                        | None                                          | Built-in (with coverage import)     |
| Duplication analysis                     | None                                          | Built-in                            |
| Security hotspot review workflow         | Built-in via dismissal                        | Built-in via TO_REVIEW state        |

When a finding appears in both — e.g., a regex DoS in `S5852` (Sonar) AND `js/polynomial-redos` (CodeQL) — fix once and both should clear on re-scan. When a finding appears in only one, treat it as an authoritative signal from that tool's strength.

### Common Oak CodeQL alerts

- `js/polynomial-redos` HIGH — regex with overlapping quantifiers vulnerable to ReDoS. Often co-fired with Sonar `S5852`. Investigate per-site for actual vulnerability; many alerts are linear-time with no overlap.
- `js/missing-rate-limiting` HIGH — handler routes without rate-limit middleware visible in CodeQL's dataflow. Often a false-positive when DI hides the limiter from the analyser. Investigate whether a structural change (e.g., `withRateLimit(limiter, handler)` curry) makes the wiring legible to CodeQL without weakening DI.
- `js/http-to-file-access` MEDIUM — network data written to file without sanitisation. Sometimes correctly reflects defence-in-depth shape (validate-then-skip-with-warning); dismiss-with-rationale when the architectural shape is correct.
- `js/incomplete-sanitization` HIGH — common pattern when escaping a single character with a non-`/g` regex. Real bug when the input is user-controlled; investigate per-site.
- `js/regex/missing-regexp-anchor` HIGH — regex used as a whole-string match without `^...$`. Real bug at security boundaries (auth, hostname); fix or dismiss per-site.

---

## Sentry + Sentry MCP

### When Sentry signals matter for static-analysis triage

Sonar and CodeQL produce findings ordered by their internal severity heuristics. Sentry tells you which findings actually matter in production:

- **An OPEN issue at a code path Sentry sees firing daily** is more urgent than a CRITICAL issue at a code path Sentry never sees.
- **A regex DoS hotspot in a function called once at startup** is less urgent than a hotspot in a hot request handler.
- **A duplicated-code finding in two paths Sentry shows have diverged behaviour** is a real correctness concern, not just a maintainability concern.

### Sentry MCP query patterns

```text
mcp__sentry-ooc-mcp__search_events({ projectSlug, query, ... })
  // search Sentry events by tag, user, env, etc.

mcp__sentry-ooc-mcp__search_issues({ projectSlug, query, ... })
  // search Sentry issues (grouped events)

mcp__sentry-ooc-mcp__search_issue_events({ issueId })
  // detailed events for a specific Sentry issue

mcp__sentry-ooc-mcp__get_profile_details({ profileId })
  // CPU/memory profile for a flagged perf issue

mcp__sentry-ooc-mcp__analyze_issue_with_seer({ issueId })
  // Sentry's Seer AI analysis of an issue

mcp__sentry-ooc-mcp__update_issue({ issueId, status })
  // resolve / ignore / unresolve
```

### Coupling Sentry → Sonar

When Sonar flags a CRITICAL bug at `apps/.../foo.ts:123`, ask Sentry: "have we seen errors at or near `foo.ts:123`?" Use `search_events` filtered by `transaction:` or `stacktrace:` tags. If yes, the Sonar finding is a runtime-confirmed defect; prioritise the fix. If no, the finding is theoretically valid but operationally low-impact; schedule alongside other mechanical work.

### Coupling CodeQL → Sentry

When CodeQL flags a HIGH-severity dataflow issue (e.g., `js/incomplete-sanitization` at an HTTP handler), ask Sentry: "do we have any user-reported errors that look like sanitisation-bypass attempts?" Look for malformed-input patterns in the breadcrumb trail of recent issues.

### Coupling Sonar → Sentry

When fixing a Sonar finding (especially a hotspot), instrument the fix with Sentry to validate the change is observable in production. The HTTP MCP server's runtime-redaction barrier is a precedent: after each Tier-2 redaction-barrier change, the team validates via the `/test-error` probe that captured Sentry events match the expected redaction pattern.

---

## Anti-pattern: the metacognitive drift

This document was written in part because of an incident on 2026-04-27 where Vining Bending Root's session drifted from per-site investigation to per-rule disposition labelling under context pressure, producing commit `03a58787` (a `sonar.issue.ignore.multicriteria` block). The drift mechanism is captured in `.agent/memory/active/napkin.md` 2026-04-27 entry and the `feedback_never_ignore_signals` user-memory.

### Triggers to detect drift early

- **Labelling findings** ("stylistic", "false-positive", "out of scope") instead of describing the architectural tension in plain language.
- **Batching suppressions per-rule** without per-site investigation.
- **Citing the master plan's table** instead of re-deriving the disposition from `principles.md`.
- **Writing "owner direction needed"** framing that abdicates investigation responsibility back to the owner.
- **Labelling findings "out of scope per master plan"** when the owner's scope is repo-quality holistically.

### Structural mitigations (preferred over textual)

- **One finding/site = one commit** (or one rule = one commit only when all sites within the rule share disposition). Forces per-site reasoning into the commit message.
- **Read the code at the site BEFORE consulting the master plan's table**. Avoid loading the table into working memory until forming an independent opinion.
- **Re-read `principles.md` headings at each phase boundary**, not only at session-open.

---

## Putting it together: a quality-driving session

The recommended flow for a quality-remediation session in this repo:

### 1. Re-ground

Read `principles.md` headings (§Code Quality, §Compiler Time Types). Re-read the napkin entry on `investigation-mode drifts into disposition-mode`. Open an active claim covering the touched scope.

### 2. Fetch live state

```text
gh pr view <number> --json statusCheckRollup,headRefOid
mcp__sonarqube__get_project_quality_gate_status({ projectKey, pullRequest })
mcp__sonarqube__list_quality_gates()
mcp__sonarqube__search_sonar_issues_in_projects({ ..., issueStatuses: ['OPEN'] })
mcp__sonarqube__search_security_hotspots({ ..., status: ['TO_REVIEW'] })
gh api 'repos/<org>/<repo>/code-scanning/alerts?ref=<branch>'
```

Note any deltas from the briefing or the master plan. State drift is real; the briefing is always slightly stale.

### 3. Map QG conditions to the action sequence

For each failing condition, identify the work that addresses it:

- `new_violations` → per-finding fix or dismissal.
- `new_duplicated_lines_density` → consolidation refactors.
- `new_security_hotspots_reviewed` → hotspot review via Sonar MCP.
- CodeQL combined → per-alert fix or dismissal.

### 4. Per-finding work, one at a time

Read the code at the site. Form a disposition rooted in `principles.md`. Cross-check against the master plan / corrected disposition table. Commit per finding (or per rule when all sites share disposition).

For mechanical fixes, batch within a rule. For per-site investigations, separate commits.

### 5. Per-issue dismissals via Sonar MCP

For findings where the disposition is `accept` or `falsepositive`:

- Strengthen in-code TSDoc with the rationale (so the next reader has the trail without consulting the issue tracker).
- Commit the TSDoc strengthening.
- Use `change_sonar_issue_status` to dismiss.

### 6. Hotspot review via Sonar MCP

For each hotspot, investigate the underlying concern. Mark REVIEWED with one of FIXED / SAFE / ACKNOWLEDGED, and ALWAYS add a comment with rationale.

### 7. CodeQL action items

For OPEN alerts, either fix the underlying code path (preferred) or prepare a dismissal rationale and surface for owner action via the GitHub Security UI/API.

### 8. Sentry validation (when a fix touches a code path Sentry observes)

After the fix lands and a preview deploy is up, run any relevant probe (e.g., `apps/oak-curriculum-mcp-streamable-http/scripts/probe-sentry-error-capture.sh`) to confirm the runtime behaviour.

### 9. Continuity surfaces and reviewers

At natural session boundaries:

- Update the master plan with progress.
- Append a mid-session entry to `shared-comms-log.md`.
- Dispatch reviewers (`code-reviewer` + relevant specialists) on the substantive commits. Run them in parallel.

### 10. Push

Push only when explicitly authorised by the owner (per the `feedback_no_verify_fresh_permission`-style discipline). Each push is per-bundle authorisation, not blanket.

---

## Cross-references

- `principles.md` §Code Quality — the authoritative ban on disabling checks.
- `.agent/memory/active/napkin.md` 2026-04-27 — the drift-pattern lesson.
- `.agent/plans/observability/current/pr-87-quality-finding-resolution.plan.md` — current canonical plan with corrected disposition table.
- `feedback_never_ignore_signals` — user-memory feedback rule.
- `feedback_no_verify_fresh_permission` — push permission per-bundle.
- `.agent/rules/strict-validation-at-boundary.md` — boundary validation discipline (informs how to investigate `js/incomplete-sanitization` and `js/regex/missing-regexp-anchor` style alerts).
- `.agent/rules/use-result-pattern.md` — the Result-pattern discipline for error handling (informs when "throw `Error`" vs "throw `TypeError`" vs "return `Result<T, E>`" applies).
- ADR index (`docs/architecture/architectural-decisions/`) — for architectural reasoning at boundary changes.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` — Sentry coupling for the HTTP MCP server.

---
name: "Fitness Token Measurements And Frontmatter Mandation"
overview: >
  Follow on from the implemented context-cost CLI by adding chars/4 token
  measurements to Practice fitness reporting, introducing optional token
  target/limit frontmatter fields, and absorbing the old manifest sweep into
  one sequenced plan for deciding which agent guidance files must carry
  fitness frontmatter.
todos:
  - id: ws0-plan-review
    content: "Run docs/ADR, assumptions, code, onboarding, test, and config reviews before execution."
    status: completed
  - id: ws1-token-measurement
    content: "Move reusable Practice fitness logic under agent-tools/src, compute content-only estimated tokens, and render the count in reports."
    status: completed
  - id: ws2-token-frontmatter
    content: "Amend ADR-144, then add optional fitness_token_target and fitness_token_limit fields with tested zone classification."
    status: pending
    depends_on: [ws1-token-measurement]
  - id: ws3-convention
    content: "Document the frontmatter convention, including token fields, inclusion criteria, and response discipline."
    status: pending
    depends_on: [ws2-token-frontmatter]
  - id: ws4-manifest-detection
    content: "Add a report-only manifest coverage check for qualifying guidance files that lack frontmatter."
    status: pending
    depends_on: [ws3-convention]
  - id: ws5-apply-frontmatter
    content: "Apply frontmatter to owner-approved qualifying files in small batches, using measured token data to choose values."
    status: pending
    depends_on: [ws4-manifest-detection]
  - id: ws6-closure
    content: "Run validation, update continuity, and archive or mark superseded source plans."
    status: pending
    depends_on: [ws5-apply-frontmatter]
isProject: false
---

# Fitness Token Measurements And Frontmatter Mandation

**Last Updated**: 2026-05-14
**Status**: 🟡 IN EXECUTION — WS1 COMPLETE / WS2 NEXT
**Scope**: Add token estimates to the existing Practice fitness surface,
extend fitness frontmatter with optional token thresholds, and make the
frontmatter convention enforceable for agent guidance files.

**Execution routing**: owner-selected next-session lane. Complete WS1 through
WS6 in dependency order; do not skip to frontmatter fields or manifest coverage
before WS1 lands. P8 remains open and resumes after this lane unless newer
owner direction changes the sequence.

**Strategic source**:
[`memetic-immune-system-and-progressive-disclosure.plan.md` §Scope Expansion Register §2-§4](../future/memetic-immune-system-and-progressive-disclosure.plan.md#2-token-estimate-fields-in-standard-fitness-frontmatter)

**Absorbs**:
[`fitness-frontmatter-manifest-sweep.plan.md`](fitness-frontmatter-manifest-sweep.plan.md).
That plan remains as analysis history, but this plan is the execution
authority.

---

## Problem

The context-cost CLI now gives repeatable ad-hoc token estimates, but the
fitness system still reports only lines, characters, and prose width. That
leaves the most meaningful operational unit, token cost, outside the regular
fitness feedback loop.

The frontmatter convention is also incomplete. Some files that act as
knowledge-accretion or always-loaded guidance surfaces carry `fitness_*`
fields; others do not. The older manifest-sweep plan captures this well, but
it predates token fields and would overlap with this work if executed as a
separate lane.

## End Goal

Practice fitness reports show estimated token cost for every managed file, and
fitness frontmatter can optionally declare token targets and limits. Agent
guidance files that should be fitness-managed are discoverable through a
single convention and a report-only coverage check before any hard mandation.

## Mechanism

Move reusable Practice fitness evaluation, formatting, and manifest helpers
under `agent-tools/src/practice-fitness/`, leaving
`agent-tools/scripts/validate-practice-fitness.ts` as a thin command wrapper.
Use the same chars/4 estimator rule as `agent-tools context-cost`, but do not
make the validator shell out to the CLI.

Fitness token counts are **content-only** measurements: they use the markdown
body after frontmatter extraction, matching the existing `totalChars`
semantics. Context-cost remains a raw-file measurement. The two surfaces share
the estimator rule, but they intentionally differ for files that carry YAML
frontmatter.

Token threshold fields are optional frontmatter fields:

```yaml
fitness_token_target: 2000
fitness_token_limit: 2600
```

They mirror ADR-144 line-threshold semantics: target is the soft boundary,
limit is the hard boundary, and the existing critical ratio derives the
critical zone from the hard limit.

## Means

1. Add token measurement display without changing exit behaviour.
2. Add optional token threshold parsing and zone classification.
3. Document the convention and inclusion criterion.
4. Add report-only manifest coverage detection.
5. Apply frontmatter in owner-approved batches.
6. Update dependent plans, continuity, and strategic-register routing only
   after manifest findings have explicit dispositions.

---

## Settled Decisions

### D1 — Token Estimator

Use the same chars/4 approximation rule as the context-cost CLI:

```typescript
const estimatedTokens = contentChars === 0 ? 0 : Math.ceil(contentChars / 4);
```

The validator does not import the CLI topic or run a subprocess. The fitness
surface measures content-only token pressure. The context-cost CLI measures
raw-file token pressure. A shared fixture must prove that files without
frontmatter produce matching estimates and files with frontmatter differ for
this documented reason.

### D2 — Field Names

Use `fitness_token_target` and `fitness_token_limit`.

These names match the existing `fitness_line_target` /
`fitness_line_limit` shape and keep token thresholds in the same
frontmatter namespace.

### D3 — Zone Semantics

Token zones use `classifyFitnessZone(estimatedTokens, targetTokens,
limitTokens)`.

If neither token field exists, token count is still displayed but token zone
is `(no threshold)`. If only `fitness_token_limit` exists, the metric has no
soft zone, matching `fitness_char_limit`. If both exist, the target/limit pair
matches line semantics.

`fitness_token_target` without `fitness_token_limit` is invalid. The validator
must report it as a configuration finding with a test. Configuration findings
are separate from `overallZone`: they do not classify the file as healthy,
soft, hard, or critical. `informational` mode reports them and exits 0;
default strict mode and `strict-hard` report them and exit 1. This avoids
silently inventing a target-only zone contract while ADR-144 is being amended.

### D4 — Exit Behaviour

`informational`, `strict`, and `strict-hard` keep the ADR-144 exit contract.
Once token thresholds exist, token hard or critical zones contribute to
`overallZone` exactly like line, char, and prose zones.

### D5 — Manifest Detection Starts Report-Only

The first coverage check itemises missing frontmatter but does not fail
commits. This avoids turning an unsettled inclusion criterion into a surprise
gate. The plan may promote a hard gate only after owner approval and at least
one clean report-only pass.

### D6 — Deterministic Manifest Criterion

The initial criterion is:

> Fitness frontmatter belongs on durable agent guidance or memory surfaces
> whose size can accrete across sessions and whose growth is meaningful
> operational signal.

The report has two buckets:

1. **Deterministic missing-frontmatter candidates**: path patterns that are
   known durable guidance surfaces.
2. **Needs owner disposition**: files that might qualify semantically but need
   an explicit owner decision or exception before hard mandation.

Deterministic candidates:

- `.agent/rules/*.md`
- `.agent/skills/**/SKILL*.md`
- `.agent/directives/*.md`
- `.agent/practice-core/**/*.md`
- `.agent/memory/active/**/*.md`
- `.agent/memory/operational/**/*.md`
- `.agent/sub-agents/**/*.md`
- `.agent/commands/*.md` if that directory exists in the checkout
- `docs/governance/*.md`
- `docs/engineering/*.md`
- `docs/operations/*.md`

Needs owner disposition:

- `.agents/skills/**/SKILL.md` adapter files that carry substantive guidance
  rather than a pointer only
- docs outside `docs/governance/`, `docs/engineering/`, and
  `docs/operations/` that might behave as durable agent guidance
- any durable guidance surface discovered outside the deterministic patterns
  during WS3 convention work

Source reconciliation: the strategic register names `.agent/commands/*.md`.
That path does not currently exist in this checkout, but the manifest scanner
must include the glob so future command files are not lost.

Excluded candidates:

- generated reports, archives, reference-local snapshots, and completed plans;
- entrypoint pointer files such as `AGENT.md` when the file is deliberately
  only an index;
- transient comms events and claim JSON.

### D7 — No Reactive Trimming

This plan must preserve the existing fitness response discipline. Token
measurements are diagnostic and routing signals, not permission to delete or
compress memory/Practice substance.

### D8 — ADR-144 Amendment Is Mandatory

Token thresholds extend the ADR-governed two-threshold model. WS2 must amend
ADR-144 in place before token fields become executable semantics.

### D9 — Manifest Closure Requires Disposition

The manifest lane cannot close with unexplained findings. WS6 may close only
when the manifest report is empty or every remaining item has an explicit
owner-deferred or exception-listed disposition.

### D10 — Manifest Command Surface

The manifest report lives behind an explicit fitness-validator flag:
`--manifest-coverage`. Add the root script `practice:fitness:manifest` as the
stable user-facing entrypoint, equivalent to:

```bash
pnpm --filter @oaknational/agent-tools validate-practice-fitness -- --manifest-coverage --informational
```

Do not fold manifest coverage into ordinary `practice:fitness:informational`
until the owner has seen at least one clean report-only pass.

This script is created in WS4. Before WS4 lands, `pnpm
practice:fitness:manifest` is not expected to exist and must not be used as a
validation command for earlier workstreams.

---

## Reviewer Disposition Log

Initial reviewers returned `BLOCK`; this plan was amended rather than sent
straight to execution. The re-review pass is now clear.

- `assumptions-expert`: widened inclusion scope, split deterministic
  candidates from owner-disposition candidates, made target-only token fields
  invalid, and added a closure rule for unresolved manifest findings.
- `docs-adr-expert`: made the ADR-144 amendment mandatory, routed `.agent`
  command surfaces, added onboarding review, and added dependent-plan/thread
  update work to closure.
- `code-expert`: moved the implementation route from script-only edits to
  `agent-tools/src/practice-fitness/`, made content-only versus raw-file token
  semantics explicit, required a tested formatter seam, and added test/config
  review.
- `onboarding-expert`: resolved status ambiguity, pinned the convention home,
  linked dependent-plan routing, and updated stale §2/§3/§4 discovery text.
- `test-expert`: pinned the manifest command surface, fixture matrix, target-only
  token exit semantics, and exact token-count fixture expectations.
- `config-expert`: added `--passWithNoTests=false`, build checks, and explicit
  WS4 sequencing for the new `practice:fitness:manifest` root script.

Final review status: docs/ADR, assumptions, code, onboarding, test, and config
reviews all PASS.

---

## Workstreams

### WS0 — Review Before Execution

Run these reviewers against this plan before code work:

- `docs-adr-expert`: convention home, ADR-144 alignment, and plan
  discoverability.
- `assumptions-expert`: inclusion criterion, report-only posture, and
  proportionality.
- `code-expert`: validator shape, test surface, and dependency boundaries.
- `onboarding-expert`: discoverability for agents entering through AGENT,
  start-right, or plan index surfaces.
- `test-expert`: unit/fixture seams for token measurement, formatter output,
  and manifest coverage.
- `config-expert`: TypeScript, ESLint, and package-script coverage after the
  validator logic moves under `src`.

Acceptance:

```bash
pnpm markdownlint:root
```

Document reviewer findings in the plan before implementation. This plan must
not move to execution until `BLOCK` findings are either resolved in-plan or
explicitly owner-deferred.

### WS1 — Token Measurement Display

File scope:

- `agent-tools/scripts/validate-practice-fitness.ts`
- `agent-tools/src/practice-fitness/**`
- matching tests under `agent-tools/src/practice-fitness/**`
- existing script tests only as wrapper smoke coverage if still needed

Test first:

1. Reusable evaluation and formatting logic is covered by normal
   `agent-tools` type-check and lint config.
2. `evaluateFitnessFile` returns `estimatedTokens` from content chars.
3. Empty content returns `0`.
4. Formatted output includes a `Tokens:` row even when no token threshold is
   declared.
5. Formatter behaviour is tested through a pure formatter or injected runner
   seam, not only through console output.
6. A shared fixture proves content-only fitness tokens match context-cost only
   when no frontmatter is present, and deliberately differ when frontmatter is
   present.
7. Existing exit-code tests remain unchanged.
8. Fixture tests pin exact raw strings, content strings, char counts, and token
   estimates so newline and frontmatter-boundary semantics cannot drift.

Acceptance:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run src/practice-fitness --passWithNoTests=false
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
pnpm practice:fitness:informational
```

WS1 closeout evidence (2026-05-14): the coordinated Codex WS1 window moved
the reusable Practice fitness logic under `agent-tools/src/practice-fitness/`,
kept `agent-tools/scripts/validate-practice-fitness.ts` as a thin wrapper,
computed content-only estimated tokens with the chars/4 rule, and rendered a
`Tokens:` row without token-threshold semantics. Shaded Shrouding Mask,
Floating Lifting Thermal, Breezy Sailing Pier, and Foamy Fathoming Sail each
reported the WS1 acceptance set green in shared comms: focused
`src/practice-fitness` Vitest, `@oaknational/agent-tools` type-check, lint,
build, and `pnpm practice:fitness:informational`. Foamy also reported
`git diff --check` green. No WS2+ frontmatter fields, convention docs, or
manifest coverage were intentionally added. Handoff caveat: the WS1 source is
validation-green in the working tree but not committed in this handoff, and the
implementation window included duplicate overlapping claims plus stale-comms
cleanup overlap. Re-check live claims, queue, index, and dirty tree before
staging the exact WS1 bundle.

### WS2 — Token Frontmatter Fields

File scope:

- `agent-tools/scripts/validate-practice-fitness.ts`
- `agent-tools/src/practice-fitness/**`
- matching tests under `agent-tools/src/practice-fitness/**`
- `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`

Test first:

1. `fitness_token_target` and `fitness_token_limit` parse as numbers.
2. Token target/limit produce healthy, soft, hard, and critical zones.
3. Token zone contributes to `overallZone`.
4. `strict-hard` exits 1 when only token zone is hard.
5. `fitness_token_target` without `fitness_token_limit` produces a tested
   configuration finding.
6. Target-only token configuration findings exit 0 in informational mode and
   exit 1 in default strict mode and `strict-hard`.

Acceptance:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run src/practice-fitness --passWithNoTests=false
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
pnpm practice:fitness:informational
pnpm practice:fitness:strict-hard
```

`strict-hard` may still fail for pre-existing hard/critical files. Record the
result; do not trim unrelated memory to make the signal disappear.

### WS3 — Convention Documentation

File scope:

- new convention home: `.agent/directives/fitness-frontmatter-convention.md`
- `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`
  if WS2 leaves documentation follow-up in the ADR
- `.agent/directives/AGENT.md` and any current Practice/directive index needed
  for discoverability, or an explicit no-change rationale if those surfaces
  should not link directly
- `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`
  if current routing language still says §2, §3, and §4 promote separately
- this plan

Content:

- field semantics, including token fields;
- inclusion criterion and exclusions;
- deterministic path patterns versus owner-disposition candidates;
- how to choose values from `context-cost` and fitness reports;
- non-reactive response discipline.
- explicit no-change rationale for any relevant discovery surface that is not
  updated.

Acceptance:

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
```

### WS4 — Manifest Coverage Report

File scope:

- `agent-tools/src/practice-fitness/**`
- `agent-tools/scripts/validate-practice-fitness.ts` as wrapper only if needed
- matching unit tests
- root `package.json` script for `practice:fitness:manifest` (created before
  the acceptance command is run)

Behaviour:

- expose the report through `--manifest-coverage` and the
  `pnpm practice:fitness:manifest` root script;
- report deterministic candidate files that lack fitness frontmatter;
- separately report files requiring owner disposition;
- support an explicit exception/defer list before any future hard gate;
- default to informational output only;
- do not make the check a commit hook or strict-hard failure in this
  workstream.

Fixture matrix:

- one present-frontmatter file for every deterministic path pattern;
- one missing-frontmatter file for every deterministic path pattern;
- one `.agent/commands/*.md` fixture even if that directory is absent in the
  live checkout;
- one `.agents/skills/**/SKILL.md` substantive adapter routed to owner
  disposition;
- one generated report, archive file, completed plan, comms event, and claim
  JSON fixture proving exclusions;
- one exception/defer-list fixture proving findings can be dispositioned
  without disappearing from evidence.

Acceptance:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run src/practice-fitness --passWithNoTests=false
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
pnpm practice:fitness:manifest
```

### WS5 — Apply Frontmatter In Owner-Approved Batches

File scope: only the owner-approved batch.

Rules:

- Do not blanket-apply values.
- Use measured lines, chars, prose width, and tokens as the starting point.
- Each file gets a short `split_strategy` matching its role.
- If a file is already over pressure, preserve substance and route the split
  instead of hiding the pressure with inflated limits.

Acceptance:

```bash
pnpm practice:fitness:informational
pnpm markdownlint:root
```

### WS6 — Closure

Close the superseded manifest plan, refresh plan indexes, record validation,
and update continuity surfaces. Do not call the strategic register complete
until WS1-WS5 have landed and reviewer findings are closed.

Closure must include:

- update dependent references in
  `.agent/plans/agent-tooling/current/multi-checkout-merge-handling-for-fitness-files.plan.md`;
- update the thread prompt and other current discovery surfaces that still
  describe §2, §3, and §4 as separate promotions;
- leave `fitness-frontmatter-manifest-sweep.plan.md` superseded, not silently
  deleted;
- close only with an empty manifest report or an owner-approved
  exception/defer list for every remaining finding.

---

## Validation Strategy

Run the smallest relevant checks per workstream, then a final sequence:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run src/practice-fitness --passWithNoTests=false
pnpm practice:fitness:informational
pnpm practice:fitness:manifest
pnpm markdownlint:root
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
pnpm --filter @oaknational/agent-tools test
```

The final `strict-hard` run is evidence, not a hidden commit blocker:

```bash
pnpm practice:fitness:strict-hard
```

If it fails on known hard/critical memory pressure, record that pressure and
the owning route.

---

## Non-Goals

- No real tokenizer integration.
- No shelling out from the fitness validator to `context-cost`.
- No mandatory gate for manifest coverage in the first implementation pass.
- No bulk retuning of existing thresholds.
- No reactive trimming of memory, Practice Core, or doctrine files.
- No changes to generated reports or archived plans.

---

## Non-Blocking Owner Questions

1. Is the deterministic path set too wide for a report-only first pass?
2. Does the content-only token decision need any additional wording in ADR-144
   to avoid confusion with raw-file context-cost estimates?

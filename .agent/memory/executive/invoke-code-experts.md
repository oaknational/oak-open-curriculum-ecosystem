# Invoke Specialist Experts

After non-trivial changes, invoke `code-expert` plus all specialist experts
required by the change profile. Until the taxonomy rename lands,
`code-expert` remains the current gateway reviewer.

Documentation drift (`docs-adr-expert`) applies whenever behaviour or
architecture changes, even if no docs are explicitly edited. `docs-adr-expert`
owns documentation **structure and accuracy** (drift, ADR completeness,
cross-references, and the ADR-127 §5 design lens — SSOT, DRY, god-documents,
decoupling, stable indexes); `prose-expert` owns the **craft and voice** of the
writing. The two compose on one document and do not overlap.

Prose craft (`prose-expert`) applies to the writing of any authored document;
the Oak outward editorial voice (also `prose-expert`) applies only to
outward-facing copy, per `editorial-tone.md` scope. Invoke `prose-expert`
proportionately — for outward copy and significant authored prose, not every
trivial doc touch.

AGENT.md intentionally points here rather than carrying reviewer rosters or
timing detail. Reviewers can review intentions before code exists, and long or
multi-phase work should re-invoke the relevant specialist at natural phase
boundaries so feedback shapes the work while it is still live. Reviews are
real-time at every lifecycle stage — ideation, planning, implementation,
retrospective, and remediation (where reviewers cover the remediation plan
itself, not only the corrective code). A backfill review (running reviewers
after the fact) is the best recovery when a review was missed, never a valid
workflow choice: live review shapes decisions, backfill finds problems
already embedded. After any backfill, name which gate was missed and why.

## Layered Triage (First 2 Minutes)

Use this order so the gateway scales with the specialist roster.

### Layer 1 — Change Category

Ask what kind of change this is:

1. Code change
2. Infrastructure or tooling change
3. Documentation or onboarding change
4. Agent or practice change

### Layer 2 — Domain Signal

Then route by domain:

1. Auth, secrets, PII, or OAuth -> `security-expert`
2. Clerk middleware, token verification, OAuth proxy, PRM,
   `@clerk/mcp-tools`, or Clerk SDK usage -> `clerk-expert`
3. MCP protocol, tool/resource/prompt definitions, MCP Apps Extension
   widgets, transport/session patterns, or MCP Apps migration work ->
   `mcp-expert`
4. Sentry SDK usage, OpenTelemetry trace/log correlation, telemetry
   redaction, MCP Insights, or Sentry env/config wiring ->
   `sentry-expert`
5. Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF,
   reranking, ingest, or Elastic Serverless capabilities ->
   `elasticsearch-expert`
6. Plans marked decision-complete, 3+ agents, asserted blocking
   relationships, or technology commitments before research ->
   `assumptions-expert`
7. Onboarding flows, start-right entrypoints, or ADR discoverability ->
   `onboarding-expert`
8. Rendered UI, CSS, design tokens, or React components -> UI/Frontend
   cluster: `accessibility-expert`, `design-system-expert`,
   `react-component-expert`
9. Outward-facing copy (`VISION.md`, strategy, public README narrative) or
   significant authored prose whose readability matters -> `prose-expert`

### Layer 3 — Cross-Cutting Concerns

Always check these regardless of category:

1. Module boundaries, imports, or public APIs -> architecture expert(s)
2. Test additions, modifications, or TDD concerns -> `test-expert`
3. Type complexity, generics, or schema flow -> `type-expert`
4. Tooling configs or quality gates -> `config-expert`
5. README, TSDoc, ADR, docs drift, or documentation structure (SSOT/DRY/
   god-documents, decoupling, stable indexes) -> `docs-adr-expert`

## Review Depth

For each specialist you invoke, state the review depth explicitly:

- `focused` — confirm one bounded concern or change signal
- `deep` — trace behaviour across boundaries, contracts, or interacting systems

Use `deep` when:

- the change crosses package or architectural boundaries
- the same concern could be hiding in multiple files or layers
- the finding needs traceability rather than spot checks

Use `focused` when:

- one concrete file or concern triggered the review
- the question is binary or narrow
- a deep pass would mostly repeat known context

Multi-reviewer tranches converge in 2–3 rounds (each round can introduce its
own regressions needing one more); budget for that shape rather than a single
pass. Convergence of independent reviewers on the same finding is the
strongest act-decisively signal a review can produce — treat it as a verdict,
not one more input (corpus-proven across w-window sessions, 2026-05→06;
re-proven across the R0 arc 2026-07-07/08: a path-traversal defect found
independently by security-expert and code-expert; two must-fix classes each
found by 2+ seats; a lossy "duplicates merged" claim caught independently by
both review seats). Convergence validates a DIAGNOSIS at most, never a
prescription — the prescribed cure still runs through the gates first-hand.

**Measured dispatch economics** (R0 arc, 2026-07-06→08, tranche-scale
doctrine/tooling batches): 48–160k tokens per reviewer seat, 2–11 minutes in
parallel; per-gateway yield 1–4 batch-altering findings plus convergent
must-fixes and security classes the builders missed; a PDR-101 four-seat
doctrine quorum ran ~70–120k tokens/seat. Worth the cost at tranche or
doctrine-batch scale, oversized for a one-file change. Adversarial review of
freshly-built detector tooling is not optional overhead — it is where most of
the truth arrived.
**Independence is the load-bearing condition**: reviewers handed the same
framing or premise converge by amplification, not corroboration — panels
systematically amplify the premise in the brief and approve artefacts that
violate always-on rules (the same corpus proves both polarities). Convergence
counts only when the lenses were genuinely distinct and the brief non-leading
(`non-leading-reviewer-prompts`); convergence on a shared handed premise
counts for nothing.

**Conflicting verdicts resolve by authority scope, not reviewer tier.** A
domain specialist (`sentry-expert`, `mcp-expert`, `elasticsearch-expert`,
`clerk-expert`, ...) has final say over generalist architecture reviewers on
the domain's SDK/vendor semantics — the generalists stay authoritative on repo
boundaries and structure. When two generalists give opposite *lens-correct*
verdicts (strict-decision-record compliance vs simplification), the conflict
usually lives in the governing ADR/PDR, not the reviewers: amend the decision
record to the position the evidence supports, then re-review against it. An
always-applied Practice rule outranks any reviewer verdict
(`rules-have-no-exceptions`). And when opposing verdicts can be settled by a
cheap first-hand check, run the check before adjudicating — reviewer
contradiction is a gift (a 2026-07-02 panel's opposite claims about an
exported function were settled by one direct read of the source).

## Reviewer Reports Arrive Only on Request

Reviewer subagents deliver their reports ONLY on an explicit SendMessage
request — a summary-less idle notification means NO report was emitted
(6/6 instances, late July 2026): request the report, never infer one from
the idle. And a long-silent consult (~12 minutes) is a DEFECTIVE dispatch —
kill it and re-dispatch; a seat idling on a dead consult is the failure,
not patience. Known mechanism (MCP-386, until cured): the Agent tool's
`name` parameter correlates with dark dispatches — named dispatches went
dark 10/10 while unnamed ones reported; prefer unnamed reviewer dispatches
while the ticket is open.

## Reviewer Model Tier

Every expert-reviewer dispatch passes `model: opus` explicitly — reviewer
verdicts steer dispositions, so the judgement tier is not left to the
default (owner standing direction; bulk mechanical sweeps may tier
per-leg, but REVIEW legs stay on Opus). Under a live provider-overload
wave the owner ruled a conditional fallback (2026-07-30, verbatim: *"if
Opus is still overloaded, we can fall back to Fable-low, but critically
assess all output"*): fall back UP in capability at lower effort — never
downgrade to a smaller tier, never drop the review — and treat every
fallback verdict as needing first-hand critical assessment before it
steers a disposition.

## Delegation Snapshot

Every bounded reviewer or worker lane should receive this minimum snapshot:

- **Goal**
- **Owned surface**
- **Non-goals**
- **Required evidence**
- **Acceptance signal**
- **Reintegration owner**
- **Stop or escalate rule**

This keeps reintegration cheaper and reduces clarification loops. Mailbox
delivery alone is not reintegration; the parent lane must absorb the outcome
back into the authoritative plan or dialogue.

Brief-construction disciplines (per PDR-015 reviewer authority):

- **Mandate the full gate set, not one gate.** A verification brief's *Required
  evidence* is the whole gate set, never a single gate — `lintClean` is not
  `gate-clean`: compact code can pass ESLint and fail Prettier, which then
  un-compacts it over `max-lines`. Cure an over-cap finding by
  responsibility-based splitting, never by compaction.
- **A scope-protection list enumerates the owner's numbered ratified decisions.**
  When a brief protects already-decided scope so reviewers don't re-litigate it,
  the protection list names the owner's *numbered* ratified decisions (and
  explicitly owner-settled artefact sections) — plan-authored elaborations
  remain refutable. Protecting a whole sweep wholesale suppresses the legitimate
  findings the owner's own settlement would surface.
- **The dispatch names the governing decision records; the reviewer cites what
  it read.** At sites with house doctrine (type-guard idioms → ADR-153; Result
  vs throw → ADR-088; and so on), a dispatch that omits the governing ADR/PDR
  invites an approval of the common idiom over the repo's own decision — a
  code-expert approved an ADR-153-violating "fix" exactly because the dispatch
  never named it (PR #308, 2026-07-06). Grep the ADR estate for the flagged
  construct while composing the brief, name what governs, and require the
  reviewer's verdict to cite the doctrine it read. Absorb the verdict per
  `verify-dont-trust` §Reviewer output is evidence to test — never adopt a
  load-bearing claim unverified.

## Reviewer Dispatch vs Peer Collaboration

Reviewer dispatch is a fork-blocking-rejoin channel inside one agent's
session. It does not replace peer collaboration state. Agents doing
non-trivial overlapping work still use the shared communication log,
active-claims registry, and WS3A decision threads per
`agent-collaboration.md`; reviewers do not register active claims unless
the owner explicitly gives them implementation ownership.

## When to Invoke

Non-trivial changes include:

- Completing a feature or user story
- Fixing a non-trivial bug
- Refactoring (especially structural changes)
- Adding or modifying public APIs
- Changes touching multiple files
- Architectural modifications

Minor changes (single typo/comment-only edits with no behaviour impact) may use lighter review, but still require explicit rationale.

## Timing Tiers

| Tier | When | What to invoke |
|---|---|---|
| Immediately after change | After each non-trivial code change | `code-expert` plus all specialists matching the change profile |
| Design-pressure checkpoint | Before implementing high-risk type/boundary changes | Relevant specialist(s) to review intended approach (for example `type-expert` before touching external-signal parsing) |
| Before merge | Before the branch merges | Any applicable specialists not yet invoked during implementation |
| Situational trigger | When the specific context arises | On-demand agents (see below) -- not tied to every change |

**Front-load the strategic reviewers; don't only close them out at the
end.** Reviewers split by what they challenge, and each class has a
correct phase:

- **Plan-time, pre-ExitPlanMode** — `assumptions-expert`, a
  build-vs-buy challenger, an ADR intent-vs-implementation reviewer.
  These challenge *solution class* and are free to act on before code
  has weight.
- **Mid-cycle, during execution** — `test-expert`, `type-expert`, the
  architecture reviewers. These challenge *solution execution*.
- **Close, post-code** — `docs-adr-expert`, `release-readiness-expert`.
  These verify *coherence*.

A schedule that places every tranche post-commitment makes shape
findings maximally expensive to act on. Reviewers operate inside the
frame the caller sets: for a net-new vendor integration, at least one
invocation must explicitly challenge solution-class ("should this
exist?"), not just solution-execution ("is this well-structured?") —
see the plan skill §Build-vs-Buy Before Build-Shape for the gate this
serves. An owner asking mid-session for an "extra tranche" signals the
scheduling is wrong in kind, not just volume — fix the phase, not the
count.

## Required Reviewer Matrix

Always invoke:

- `code-expert` (gateway — also responsible for flagging when specialists are missing, recommending review depth, and checking coverage)

Invoke additional specialists when applicable:

| Change Category | Required Specialist(s) |
|---|---|
| Structural/boundary changes | `architecture-expert-barney` and/or `architecture-expert-fred` and/or `architecture-expert-betty` and/or `architecture-expert-wilma` |
| Test changes or TDD concerns | `test-expert` |
| Type-system complexity or assertion pressure | `type-expert` |
| Tooling/config quality-gate changes | `config-expert` |
| Auth/authz, OAuth, secrets, PII, injection, security-sensitive logic | `security-expert` |
| README/TSDoc/ADR/docs updates, documentation structure (SSOT/DRY/god-documents), or expected documentation drift | `docs-adr-expert` |
| Outward-facing copy (`VISION.md`, strategy, public README narrative) or significant authored prose | `prose-expert` (craft for any doc; Oak voice only where `editorial-tone.md` applies) |
| Rendered UI, CSS, design tokens, React components | UI/Frontend cluster: `accessibility-expert`, `design-system-expert`, `react-component-expert` (ADR-149) |

Specialist on-demand (not standard roster -- situational trigger only):

- `release-readiness-expert` for release go/no-go checks at release boundaries
- `ground-truth-designer` for semantic-search ground-truth design/review work
- `subagent-architect` for sub-agent definition design/migration work
- `onboarding-expert` for onboarding-path audits (accuracy, efficacy, readability, consistency, stale info, and gap detection)
- `mcp-expert` for MCP protocol compliance, tool/resource/prompt definition validation, or transport/session pattern checks
- `elasticsearch-expert` for Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF, reranking, ingest, evaluation, or Elastic Serverless capability assessments
- `clerk-expert` for Clerk middleware, token verification, OAuth proxy, PRM, `@clerk/mcp-tools`, or Clerk SDK usage assessments
- `sentry-expert` for Sentry SDK configuration, OpenTelemetry observability integration, trace/log correlation, telemetry redaction, MCP Insights, and release/source-map observability assessments
- `assumptions-expert` for plan-level proportionality, assumption validity, blocking legitimacy, and simplification assessments — invoke when plans are marked decision-complete, propose 3+ agents, or assert blocking relationships

## Worked Examples

**Auth/OAuth/secrets change**: Invoke `code-expert` + `security-expert` immediately. If the change is also structural (new middleware, route reorganisation), add the relevant architecture expert(s).

**Architecture refactor**: Invoke `code-expert` + relevant architecture expert(s) immediately. Add `type-expert` if generics or schema flow are affected. Add `docs-adr-expert` if boundaries or ADRs change.

**Test-only change**: Invoke `code-expert` + `test-expert` immediately.

**Docs/ADR update**: Invoke `code-expert` + `docs-adr-expert` immediately. Add
`prose-expert` when the readability of the authored prose matters (a long ADR,
a narrative doc); `docs-adr-expert` reviews structure and accuracy, `prose-expert`
reviews craft.

**Outward copy change** (`VISION.md`, strategy, public README narrative,
partner-facing material): Invoke `prose-expert` immediately — both its layers
apply (universal craft plus the Oak voice per `editorial-tone.md`). Add
`docs-adr-expert` if the change also touches documentation structure or
cross-references, and `accessibility-expert` if a plain-language WCAG conformance
verdict is needed (`prose-expert` defers conformance to it).

**Onboarding docs/path update**: Invoke `code-expert` + `docs-adr-expert` immediately. Add `onboarding-expert` when the change affects onboarding journeys (human and/or AI), `start-right` discoverability, or ADR progressive disclosure.

**Significant documentation or Practice change**: Per
[`invoke-doc-and-onboarding-experts-on-significant-changes`](../../rules/invoke-doc-and-onboarding-experts-on-significant-changes.md),
significant doc/Practice changes always pair `docs-adr-expert` with `onboarding-expert`
(both reviewers, in parallel) — neither alone covers the failure surface the other catches.
"Significant" includes: any new ADR/PDR/governance doc/rule; any rename or restructure
across permanent doctrine surfaces; any change to onboarding entry points
(`README.md`, `CONTRIBUTING.md`, platform memory files, `.agent/practice-index.md`).

**Release go/no-go**: Invoke `release-readiness-expert` (on-demand, situational trigger).

**Elasticsearch/search change**: Invoke `code-expert` + `elasticsearch-expert` immediately. Add `type-expert` if schema or mapping types are affected.

**Clerk/OAuth change**: Invoke `code-expert` + `clerk-expert` immediately. Add `security-expert` if the change has exploitability implications. Add `mcp-expert` if MCP auth spec compliance is in question.

**MCP protocol/tool/Apps change**: Invoke `code-expert` + `mcp-expert` immediately. Add `security-expert` if the MCP auth model is affected. Add `clerk-expert` if Clerk integration with MCP auth is in question. Add the relevant architecture expert(s) if MCP tool layering or transport boundaries change. For active MCP planning or implementation support, use the `mcp-expert` skill.

**Sentry/OTel change**: Invoke `code-expert` + `sentry-expert` immediately. Add `security-expert` if redaction, secrets, or PII boundaries change. Add `mcp-expert` if MCP wrapping or Insights could affect protocol behaviour.

**UI/Frontend change**: Invoke `code-expert` + relevant UI/Frontend cluster specialist(s) immediately. For MCP App views, add `mcp-expert` (owns `_meta.ui*`, resource registration, CSP, host bridge). UI specialists own DOM, accessibility, tokens, and React structure *inside* the view.

**Plan finalisation**: Invoke `assumptions-expert` when a plan is marked decision-complete or ready for execution. Also invoke when a plan proposes 3+ new agents, asserts blocking relationships, or commits to technology choices before research phases complete. For active assumption auditing during planning, use the `assumptions-expert` skill.

## Coverage Tracking

Before marking the work complete, record:

- which required specialists were invoked
- which specialists were not needed and why
- which reviewers ran `focused` versus `deep`
- whether any delegated review result still needs reintegration
- whether each new capability has an observability loop across each
  applicable axis (engineering, product, usability, accessibility,
  security) per [ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md).
  Omission is explicit and justified, not incidental.

## Invocation

Invoke each specialist as a read-only sub-agent, giving it specific context about what changed and what to focus on.

When the owner has fixed a direction, brief reviewers on **execution
legitimacy given that direction**, never on re-validating the closed
decision: enumerate the owner-fixed decisions (scope, direction, vendor
choice, blocking relationships) as explicitly out of scope, and reframe
"is X the right shape?" to "given X is the shape, is the execution
legitimate?". When a reviewer nonetheless returns a reshape verdict on a
closed decision, record it as a written disposition (per §Reporting
Requirement — owner-visible, in case the decision re-opens) and proceed —
never relay it to the owner as an open question (owner correction
2026-05-06: "I have already decided we are going this route").

Default reviewer sub-agents to a cheaper model tier (Sonnet-class): reviewer
passes, spec fetches, and single-question consultations are well-bounded work
that does not need a premium seat, and concurrent premium seats share one
quota envelope (owner direction 2026-05-24 — scale via efficient methods, not
more premium seats). Escalate an individual dispatch to a premium model only
when the review genuinely needs deeper judgement (e.g. `security-expert`
threat analysis), and name that choice in the dispatch. **Sub-agent and
workflow launches INHERIT the session model silently** (owner correction
2026-07-26: a 7-agent verification workflow multiplied a premium main
loop by N — "there are more refined, less brute force ways"): a premium
seat must SET the tier per dispatch, never accept the inherited default;
inline serial checks come before any fan-out, and heavyweight sweeps run
only on a case-by-case owner-priced warrant.

**The model-tier stance gradient governs fleet composition** (owner-named
lesson, 2026-07-25, from a 14-agent disposition fleet): tiers diverge on
STANCE, not just depth — Haiku↔Sonnet diverge on severity grading only;
Sonnet↔Opus diverge on whether the handed FRAME itself gets challenged. In
the worked instance all eleven Sonnet seats (xhigh and low alike) classified
within the handed frame — one while personally holding UNSOUND-grade
evidence — and both Opus seats independently challenged the frame. Owner:
"Opus will stand up and say this is wrong where Sonnet seeks to classify
with what is handed to it." Fleet doctrine: every multi-agent review or
disposition fleet carries **at least one mandate-only Opus frame-challenger**
(its brief is the frame, never the cells); Sonnet-tier fleets additionally
get **mechanical UNSOUND tripwires** (explicit per-item criteria whose
failure forces an UNSOUND verdict, since frame-rejection cannot be expected
of the tier); and the fleet author's own deliverable carries arithmetic
closure proofs (the table author sits in the Sonnet position with respect
to their own frame). Composes with the frame clause below: specialist
review validates correctness WITHIN a frame — tier choice decides whether
anyone in the fleet can reject the frame at all.

**Review instruments see STRATA, not depth-scalars — keep the cheap and
literal instruments in the loop, and listen hardest when they disagree
with the expensive ones** (consolidated 2026-07-30 from four-plus
instances in one week): a lockfile-literal reviewer caught the one
factual error in an ADR that three Opus specialists waved past; a bot's
suppressed low-confidence notes found four real cross-document
contradictions after two Opus experts and the author had read the same
files; a dispatch-gate read settled a vendor-behaviour question two
rounds of careful experts had studied from the wrong layer; a compiled
xhigh procedure on the cheapest cricket seat caught a commitment-vs-
artefact gap seven deeper seats graded ON-TRACK. Depth buys frame
judgement; literalness buys stratum coverage — neither substitutes for
the other, and a cheap instrument's dissent from an expensive consensus
is a signal to investigate, never noise to average away.

### Codex Reviewer Adapter Preflight

When running reviewer workflows in Codex, do not assume the runtime has
automatically loaded the repo-local reviewer adapter. Before each reviewer
invocation:

1. Resolve the reviewer with `pnpm agent-tools:codex-reviewer-resolve <name>`.
2. Open the reported `.codex/agents/*.toml` adapter and every canonical
   `.agent` file it references.
3. Record those source paths in the review report so the review remains
   auditable after session compression.

If resolution fails, treat that as a blocking configuration defect and fix it
before relying on the review.

## Reporting Requirement

- Report which required specialists were invoked.
- For any not invoked, explicitly state `N/A` with justification.
- Do not claim "comprehensive review" if required specialists were skipped without rationale.
- Reviewer findings require explicit disposition. Accepted findings are
  implementation work; rejected findings need written rationale; non-blocking
  deferrals need deferral-honesty evidence and an owner-visible next action.
- Integrate reviewer dispositions before landing the artefact under review
  when the finding is blocking or when the finding affects live doctrine.
  Post-landing amendments need a fresh review loop and leave wrong doctrine
  live in the interim.
- Do not mark the change complete or proceed to merge with unresolved
  blocking findings, hard gate failures, or rule failures. Non-blocking
  findings do not automatically block closure, but they still need a written
  disposition; triage is not silent deferral (`owner-triaged` means resolved,
  explicitly rejected with rationale, or deliberately deferred with
  owner-visible evidence).

## Finding Adjudication Is Dual-Use

These clauses apply to ALL other-agent review input — specialist sub-agents,
PR bots (Copilot, cursor[bot], Sonar), and peer reviewers alike (owner
standing requirement, 2026-06-10):

- **Adjudicate every finding first-hand, in both directions.** Refute false
  claims with source grounding (encode refutations as regression tests where
  the claim is testable); apply true ones. Reply with the verdicts on the PR
  so the adjudication is visible. Verify the flagged findings AND
  adversarially challenge the clean bills — a verification layer scoped to
  positives leaves false-negatives untouched (a donor estate's ledger
  challenge of ALL mappings, clean ones included, found zero overturns but
  33 real detail-drops the flag-scoped layer missed).
- **Assess the finding's LENS, not only its cited facts.** A reviewer can be
  factually right and model-wrong: screen whether the risk model presupposed
  by a finding fits the artefact's nature before accepting it (worked
  instance 2026-06-22: a "loop risk" P1 on an orientation-skill family
  imported control-flow framing onto a knowledge surface that is curated by
  a judging agent, not executed — the facts checked out, the model did not).
  Knowledge, teaching, and doctrine surfaces are suggestions curated by a
  judging agent; control-flow risks (loops, cycles, dead-ends,
  state-machine completeness) apply only to mechanically-executed systems.
  Valid points can sit next to a misframed one — separate them, keep the
  valid, drop the misframed.
- **A reviewer's prescribed MECHANISM is a hypothesis to run through the
  gates; the BEHAVIOUR it protects is the binding part.** A prescribed cure
  can itself violate a gate (twice in one day, 2026-07-02: a "hold state in a
  ref read during render" prescription forbidden by `react-hooks/refs`; an
  "inline the keys" prescription tripping `react/no-array-index-key`). Run
  the gate's lens over the prescription before implementing; keep the
  protected behaviour, amend the mechanism, and flag the deviation in the
  re-review.
- **Specialist review validates correctness WITHIN a frame; it cannot catch
  a wrong frame.** Reviewer approval (even three-reviewer approval) does not
  answer "is this the right thing to build at all" — that question stays with
  the dispatching agent, and recurring friction-to-make-something-fit is the
  signal to re-ask it rather than to patch (worked instance 2026-05-28: a
  three-reviewer-approved tool was foundationally the wrong shape).
- **A finding names one location of a defect CLASS — sweep the whole corpus.**
  When a comment reveals a stale cross-reference, wrong number, or mislabel,
  grep the pattern repo-wide rather than patching the flagged line. Twice in
  one window (2026-06-10) a bot found a second instance after a first
  single-line fix.
- **Owner scratchpad and convenience files are the owner's per-scenario
  choice, not doctrine to reconcile.** A finding that reads such a file
  (an owner prompt file, a personal settings file) as "misaligned
  instructions" against a skill or contract is a lens misread to REJECT —
  not a defect to fix, and not something to "surface for the owner to
  adjust" as though it were one (owner clarification 2026-06-26).
  Distinguish doctrine surfaces (enforce alignment) from owner scratchpads
  (their content is automatically the owner's deliberate choice).
- **A spend-limit-killed sub-agent resumes cheaply via a message to the
  SAME agent id** — the harness resumes from the agent's own transcript
  with context intact, far cheaper than a fresh dispatch (two worked
  instances, 2026-07-07). Pair every resume with a
  recompute-from-disk-first instruction: git status is file truth, re-run
  the last scoped observation, treat unverified memory as claims.
- **A result carrying a "safety classifier was unavailable" note is
  extra-unverified.** Rerun the same sub-agent with the same brief, or
  independently ground each load-bearing claim first-hand, before folding
  the findings (owner direction 2026-06-28) — the note raises the
  verification bar; it never lowers trust silently.
- **A declined mechanism needs its factual disagreement recorded.** When you
  decline a reviewer's prescribed mechanism on a FACTUAL ground (the helper it
  names does not exist, the API it cites is absent), record the factual
  disagreement explicitly — never just the alternative you implemented. A
  silent fallback leaves an unverified reviewer claim and an invisible
  decision (worked instance 2026-07-08: a reviewer asserted `writeArtefactSet`
  exists, an export-grep found nothing, and a local atomic write landed with
  no record of the disagreement until a loss-scan caught it).
- **Grade a peer-owned PR against its pinned head SHA, never the peer's
  live worktree.** A live tree embodies the peer's in-flight response —
  including their uncommitted fix to the very finding under adjudication —
  so between-turn drift is guaranteed. Ground on
  `git show <head-sha>:<path>`, cite the SHA in any held verdict, and
  re-verify against that SHA at post time (worked instance 2026-06-10:
  a held "refute" graded on a live worktree was wrong — the tree already
  carried the cure).
- **Thread-resolution gotcha**: cursor[bot] auto-resolves threads on
  re-review; Copilot threads need manual GraphQL `resolveReviewThread`.
  Verify zero-unresolved via GraphQL (REST does not expose resolved state)
  before merge.

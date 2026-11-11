# Invoke Specialist Experts

After non-trivial changes, invoke `code-expert` plus all specialist experts
required by the change profile. `code-expert` is the gateway reviewer. The
general-layer roster below is the same in every Practice instance; each host
adds its own domain reviewers and its path triggers in the last section of
this file, §This host's reviewers and triggers.

Documentation drift (`docs-adr-expert`) applies whenever behaviour or
architecture changes, even if no docs are explicitly edited. `docs-adr-expert`
owns documentation **structure and accuracy** (drift, ADR completeness,
cross-references, and the documentation-as-infrastructure design lens of
`principles.md` §Documentation Is Infrastructure — SSOT, DRY, god-documents,
decoupling, stable indexes); `prose-expert` owns the **craft** of the writing.
The two compose on one document and do not overlap.

Prose craft (`prose-expert`) applies to the writing of any authored document.
A host that defines an editorial voice (PDR-102) names its voice reviewer in
§This host's reviewers and triggers: voice, positioning and audience fit on the
content that voice covers belong to that reviewer, craft stays with
`prose-expert`. Invoke `prose-expert` proportionately — for significant
authored prose, not every trivial doc touch.

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

1. Secrets, credentials, PII, authentication or authorisation, HTTP headers
   and the content security policy, middleware or a proxy, third-party
   scripts, external input at a trust boundary, or a dependency upgrade with
   a security bearing -> `security-expert`
2. The reviewer estate: sub-agent templates, platform adapters, the
   reviewer-invocation rule, skills, or the platform entry points ->
   `subagent-architect`
3. Plans marked decision-complete, 3+ agents, asserted blocking
   relationships, a third-party vendor integration, or technology
   commitments before research -> `assumptions-expert`
4. Onboarding flows, start-right entrypoints, or ADR discoverability ->
   `onboarding-expert`
5. Rendered UI, CSS, design tokens, or React components -> UI/Frontend
   cluster: `accessibility-expert`, `design-system-expert`,
   `react-component-expert`
6. Significant authored prose whose readability matters -> `prose-expert`
7. The host's own domain signals (its data model, its product's protocol,
   its vendors, its editorial voice) -> the host's domain reviewers, listed
   with their triggers in §This host's reviewers and triggers

### Layer 3 — Cross-Cutting Concerns

Always check these regardless of category:

1. Module structure, import direction, workspace boundaries, dependency
   injection, or public APIs -> the architecture reviewers (the structural
   reviewer and the persona for the lens or lane the change touches; the host
   section names how its personas are dispatched)
2. Test additions, modifications, or TDD concerns -> `test-expert`
3. Type complexity, generics, or schema flow -> `type-expert`
4. Tooling configs, the lockfile, or quality gates -> `config-expert`
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
([PDR-012](../../practice-core/decision-records/PDR-012-review-findings-routing-discipline.md)
§Non-leading reviewer prompts); convergence on a shared handed premise
counts for nothing.

**Conflicting verdicts resolve by authority scope, not reviewer tier.** A
domain specialist (a host's data-model or protocol reviewer on its domain's
semantics, `accessibility-expert` on WCAG conformance, `security-expert` on
exploitability) has final say over the generalist architecture reviewers on
the domain's semantics — the generalists stay authoritative on repo
boundaries and structure. When two generalists give opposite *lens-correct*
verdicts, the conflict usually lives in the governing ADR/PDR, not the
reviewers: amend the decision record to the position the evidence supports,
then re-review against it. An always-applied Practice rule outranks any
reviewer verdict (`rules-have-no-exceptions`). And when opposing verdicts can be settled by a
cheap first-hand check, run the check before adjudicating — reviewer
contradiction is a gift (a 2026-07-02 panel's opposite claims about an
exported function were settled by one direct read of the source).

## Reviewer Reports Arrive Only on Request

Two reviewer shapes, two procedures — read the dispatched definition's
tool list before choosing. A reviewer that CARRIES a message tool delivers
its report ONLY on an explicit SendMessage request — a summary-less idle
notification means NO report was emitted (6/6 instances, late July 2026):
request the report, never infer one from the idle. A reviewer that carries
NO message tool (the expert reviewers declared with Read/Grep/Glob/Bash,
`assumptions-expert` with WebFetch and WebSearch added, and the Cricket legs
declared with Read) cannot send anything: its idle IS the finish and the
transcript is the report — the two harvest routes at the end of this section
are authoritative for that shape, and re-dispatching such a reviewer on its
idle discards a verdict already written. `prose-expert` declares no tool list
and inherits the session's tools, so treat it as the message-capable shape.
For the message-capable shape, a long-silent consult (~12 minutes) is a
DEFECTIVE dispatch — kill it and re-dispatch; a seat idling on a dead
consult is the failure, not patience. Known mechanism, recorded in the
OCE under its ticket MCP-386: the Agent tool's
`name` parameter correlates with dark dispatches — named dispatches went
dark 10/10 while unnamed ones reported; prefer unnamed reviewer dispatches.

Harvest on the FIRST idle: reviewers and Crickets that finished idle with
no report delivered cost a resend round each (six in one session,
2026-09-01). Idle-notification results truncate at roughly 4 KB — request
the tail by SendMessage per truncation; the cap, not the subagent, bounds
report size. And a subagent stopped mid-report at an owner's "stop all
processes" may already have written its verdict to the mailbox: read the
mailbox (or the transcript) once more at resume before declaring a review
lost — a stopped code-expert's verdict arrived on the first
post-compaction turn carrying two findings that would have sunk the last
settlement push (2026-09-01).

Two harvest routes when no message can arrive. (a) A reviewer declared
without a message tool (above) has no SendMessage tool at all, so it emits
its report as its final
long assistant text and then idles: the idle IS the finish, never "stuck"
(read that way by the owner on 2026-08-06), and the report is the last long
assistant text block of the newest transcript under the project's
directory. Stand the agent down afterwards; it cannot answer the shutdown
either. (b) A NAMED teammate agent that reports "delivered via SendMessage"
may have reached nothing (TaskOutput by name answered "No task found"): its
full report is the SendMessage tool-use payload in its own transcript under
the session's subagents directory, and the last plain-text turn is only a
summary — three Opus code-expert reports were harvested that way in one
pass on 2026-09-04.

## Doctrine and Plan Artefacts Get the Panel Before They Are Public

Measured three times in one window. Two opus adversarial legs on a
doctrine PR returned 17 findings with near-zero overlap, BOTH
findings-block-merge, on an artefact that had survived the Director's own
critical pass with one graded-down finding — a placement claim naming a
nonexistent workspace tier, an invented constitutional premise, three
Accepted-ADR collisions (2026-08-14). Three anti-deference reviewers
refuted a remediation-node verdict on a premise its author could have
checked (2026-08-31). A four-reviewer pre-landing panel on a new PDR
caught a ledger with a producer and no consumer, a silently forked tally
semantics, a false "unchanged" claim about a sibling rule, and a triple
restatement — at four agents for ~4 minutes wall each, against eleven
post-push review waves the same morning (2026-08-31). An author's or a
Director's critical pass is ONE lens; a doctrine record, plan node, or PDR
gets the panel BEFORE the merge glide or the public push. Point the panel
at the misinforming-surface class as well — a surface that misinforms
its readers while every check it carries passes: the seat that
has just diagnosed the class rebuilds it inside its own cure (two
independent instances), so the external lens is the working instrument.

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

**Generalised (owner word, 2026-07-31): the fallback rule binds ALL
model-unavailability cases, not only review legs** — where a model is
unavailable, fall back to the next highest model at a LOWER effort
setting than the original request. Edge cases resolve toward the rule's
intent, sensibly: already at the top tier → stay there and reduce
effort; no lower effort exists → next-highest model at its lowest
effort; the unavailable model is platform-internal and not
caller-selectable (e.g. a harness safety classifier) → retry on a short
cadence and keep working on unblocked surfaces meanwhile. Fallback
output is critically assessed before it steers anything.

## Delegation Snapshot

Every bounded reviewer or worker lane should receive this minimum snapshot:

- **Goal**
- **Owned surface**
- **Non-goals**
- **Required evidence**
- **Acceptance signal**
- **Reintegration owner**
- **Stop or escalate rule**

When commissioning review, point external scrutiny at **freshly-authored
claim-bearing prose** first — new text asserting facts (PR bodies, plan
statements, record entries, doc claims) is where external review pays
most: one 2026-08-11 day produced four falsified premises in new
claim-bearing text at one seat, with sibling instances at two others
(a false interval verdict from a mis-stamped record; a stale attribution),
and every catch was external (Copilot rounds, opus reviewers, a pin's
409). Process steps mostly self-catch; fresh factual prose mostly does
not. The three categories of owner-facing claim where every 2026-09-02
correction landed — statements about GATES, about WHO ACTS, and about
WHERE records land — are where a dispatch points that scrutiny first; and
ask for probes explicitly (a live-browser probe of a load-bearing
assumption caught a validator-red blocker pre-push, 2026-08-18).

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
- **The dispatch names the governing doctrine; the reviewer cites what it
  read.** At sites with house doctrine (type predicates →
  `validation-strategy.md`; Result vs throw → `use-result-pattern`; and so
  on), a dispatch that omits the governing doctrine invites an approval of the
  common idiom over the repo's own decision — an OCE code-expert approved a
  "fix" that broke OCE's type-guard decision exactly because the
  dispatch never named it (2026-07-06). Grep the ADRs, PDRs, rules and
  directives for the flagged construct while composing the brief, name what
  governs, and require the reviewer's verdict to cite the doctrine it read.
  Absorb the verdict per `verify-dont-trust` §Rule (reviewer output is
  evidence to test) — never adopt a load-bearing claim unverified.
- **Make the evidence shape cheap to verify.** A locator or verifier brief asks
  for each result as `path:line` with a short quoted fragment and, for a
  finding, the command and an output excerpt that shows it; then checking a
  claim is one read of one line. It also asks for a coverage statement (what was
  read, roughly how many claims were checked) and says "no findings is a valid
  result" so nothing is manufactured. Worked instances: four locators proposed
  homes for about 150 items from the napkin, the comms stream and the experience
  letters, and their best yield was the contradictions
  found beside those homes (2026-09-16); four context-free verifiers checked
  about 415 claims on a records fold, and all 31 findings survived the seat's
  own check at their sources (2026-09-17).

## Reviewer Dispatch vs Peer Collaboration

Reviewer dispatch is a fork-blocking-rejoin channel inside one agent's
session. It does not replace peer collaboration state. Agents doing
non-trivial overlapping work still use the shared communication log,
active-claims registry, and decision threads per
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

- **Plan-time, pre-ExitPlanMode** — `assumptions-expert` (including its
  build-vs-buy gate) and `docs-adr-expert` on decision-record intent versus
  implementation.
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

Invoke additional specialists when applicable. These rows are the general
layer; the host's own rows (its voice reviewer and its domain reviewers) follow
in §This host's reviewers and triggers.

| Change Category | Required Specialist(s) |
|---|---|
| Module structure, import direction, workspace boundaries, dependency injection, public APIs | the architecture reviewers (the host section names the personas and how they are dispatched) |
| Test changes or TDD concerns | `test-expert` |
| Type-system complexity or assertion pressure | `type-expert` |
| Tooling/config quality-gate changes, the lockfile | `config-expert` |
| Secrets, credentials, PII, authentication or authorisation, HTTP headers and the content security policy, middleware or a proxy, third-party scripts, external input at a trust boundary, dependency upgrades with a security bearing | `security-expert` |
| README/TSDoc/ADR/docs updates, documentation structure (SSOT/DRY/god-documents), or expected documentation drift | `docs-adr-expert` |
| Significant authored prose whose readability matters | `prose-expert` (craft for any doc) |
| Rendered UI, CSS, design tokens, React components | UI/Frontend cluster: `accessibility-expert`, `design-system-expert`, `react-component-expert` |
| Sub-agent templates, platform adapters, the reviewer-invocation rule, skills, platform entry points | `subagent-architect` |

Specialist on-demand (not standard roster -- situational trigger only):

- `release-readiness-expert` for release go/no-go checks at release boundaries
- `onboarding-expert` for onboarding-path audits (accuracy, efficacy, readability, consistency, stale info, and gap detection)
- `assumptions-expert` for plan-level proportionality, assumption validity, blocking legitimacy, and simplification assessments — invoke when plans are marked decision-complete, propose 3+ agents, assert blocking relationships, integrate a third-party vendor, or commit to technology choices before research

Two further classes of sub-agent serve other purposes, and
[practice-index.md §Experts](../../practice-index.md#experts-sub-agents) names
their roles:

- the Cricket panel roles give a priority-and-framing conscience check through
  the [`cricket` skill](../../skills/cognition/cricket/SKILL-CANONICAL.md),
  and never substitute for the reviewers above;
- the corpus-analysis roles run inside the corpus-analysis workflows in
  `agent-tools`, which dispatch them.

## Worked Examples

The host's own worked examples (its domain reviewers and voice reviewer in
play) follow in §This host's reviewers and triggers.

**Security-surface change** (headers, the content security policy, secrets, environment variables, auth, a proxy or middleware): Invoke `code-expert` + `security-expert` immediately. Add `config-expert` when the change rewires configuration. If the change is also structural (new middleware, a route reorganisation), add the architecture reviewer for the lens or lane it touches.

**Architecture refactor**: Invoke `code-expert` + the architecture reviewers immediately (the structural reviewer and the persona for the lens or lane the refactor touches). Add `type-expert` if generics or schema flow are affected. Add `docs-adr-expert` if boundaries or ADRs change.

**Test-only change**: Invoke `code-expert` + `test-expert` immediately.

**Docs/ADR update**: Invoke `code-expert` + `docs-adr-expert` immediately. Add
`prose-expert` when the readability of the authored prose matters (a long ADR,
a narrative doc); `docs-adr-expert` reviews structure and accuracy, `prose-expert`
reviews craft.

**Onboarding docs/path update**: Invoke `code-expert` + `docs-adr-expert` immediately. Add `onboarding-expert` when the change affects onboarding journeys (human and/or AI), `start-right` discoverability, or ADR progressive disclosure.

**Significant documentation or Practice change**: Per the reviewer-invocation
rule ([`invoke-code-experts`](../../rules/invoke-code-experts.md), the
significant-change clause under its roster),
significant doc/Practice changes always pair `docs-adr-expert` with `onboarding-expert`
(both reviewers, in parallel) — neither alone covers the failure surface the other catches.
"Significant" includes: any new ADR/PDR/governance doc/rule; any rename or restructure
across permanent doctrine surfaces; any change to onboarding entry points
(`README.md`, `CONTRIBUTING.md`, the platform entry files, `.agent/practice-index.md`).

**Release go/no-go**: Invoke `release-readiness-expert` (on-demand, situational trigger).

**Reviewer estate change** (sub-agent templates, platform adapters, the reviewer-invocation rule, skills, platform entry points): Invoke `code-expert` + `subagent-architect` immediately, plus the architecture persona whose lens or lane covers Practice governance; a significant change also takes the `docs-adr-expert` and `onboarding-expert` pair above.

**UI/Frontend change**: Invoke `code-expert` + relevant UI/Frontend cluster specialist(s) immediately. Add an architecture reviewer when routes, navigation or layout composition change.

**Plan finalisation**: Invoke `assumptions-expert` when a plan is marked decision-complete or ready for execution. Also invoke when a plan proposes 3+ new agents, asserts blocking relationships, integrates a third-party vendor, or commits to technology choices before research phases complete. For active assumption auditing during planning, dispatch `assumptions-expert` in its active-workflow mode.

## Coverage Tracking

Before marking the work complete, record:

- which required specialists were invoked
- which specialists were not needed and why
- which reviewers ran `focused` versus `deep`
- whether any delegated review result still needs reintegration
- whether any required review could not run (an owner's stop on new subagents, a reviewer out
  of credit, a missing tool): that gate is not obtained, never discharged, and the record says
  so (one instance, 2026-09-25: an assumptions pass went unrun under a stop and the handoff
  named it as the cheapest outside check not made)
- whether each new capability has an observability loop across each
  applicable axis (engineering, product, usability, accessibility,
  security). Omission is explicit and justified, not incidental.

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
to their own frame). Before any lens is dispatched, the coordinator reads
the material first-hand and states the purpose question — what are these
files FOR, and why do they exist in this form now — and treats lenses run
on one model from one brief as correlated evidence, never as independent
confirmations (owner corrections at one reviewer seat, 2026-09-09: a
fan-out interrupted twice, first for the coordinator's own read, then for
the purpose question). Composes with the frame clause below: specialist
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

### Cursor Reviewer Invocation

On Cursor, invoke a reviewer through the Task tool with `readonly: true` and the
reviewer's `subagent_type` (the canonical template's name, for example
`subagent_type: code-expert`). The reviewer-invocation rules' Cursor adapters
carried this line by hand until the adapters became generated pointers; this is
its one home.

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

### Review output names whose work it reviewed (owner directive, 2026-08-05)

Owner directive, standing: **every review agent signs off naming which agent's
work it is reviewing.** All review output — approvals, change-requests, inline
comments — states the authoring agent's PDR-027 identity plus the reviewed
PR/SHA, and closes with the reviewer's own identity and model.

    Reviewed <author-agent-name>'s work on <PR>#<n> / <SHA>. — <reviewer identity> · <model>

Motivating instance: a second-opinion `CHANGES_REQUESTED` did not name the
authoring agent, and in a rotating-cast fleet the review provenance was then
unrecoverable from the artefact — a reader could not tell whose work had been
judged, by whom, against which head. Attribution makes both halves legible at the
point of reading.

Two riders from the same window: a review of rendered Markdown records its **WCAG
pass** for the rendered semantics (heading hierarchy included), and a finding is
attributed to **the PR that introduced it**, never to the stack head that
happened to surface it.

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

## This host's reviewers and triggers

The reviewers and triggers this host adds to the general layer above, for this
host (OCE). The sibling estate's copy of this file carries its own section
here; everything above it is the same text in both. The triggers were carried
by one `invoke-*` rule per reviewer until the rules collapsed into the one
reviewer-invocation rule; this section is their home.

### The voice reviewer (P20)

Oak's outward editorial voice is `prose-expert`'s second layer, applied only to
outward-facing copy (`VISION.md`, strategy, the public README narrative,
partner-facing material) per `editorial-tone.md`'s scope; there is no separate
voice reviewer. Universal craft applies to any authored document.

### The domain reviewers

Each is a host-local instance of the domain-specialist pattern (the ledger's
O11); the pattern is Practice-wide, the five rows are this host's.

| Reviewer | Fires on | File surfaces |
| --- | --- | --- |
| `clerk-expert` | Clerk middleware configuration (`clerkMiddleware()`, `requireAuth()`, `getAuth()`); token verification (`verifyToken()`, `authenticateRequest()`); OAuth proxy endpoints (register, authorise, token exchange); protected resource metadata (PRM) or authorisation server (AS) metadata generation or rewriting; `@clerk/mcp-tools` usage or PRM helpers; Clerk environment variables (`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`); social connection or allowlist configuration; Clerk SDK upgrades or migration; auth error detection touching Clerk error patterns | `**/*clerk*`, `**/auth/**`, `apps/oak-curriculum-mcp-streamable-http/**` |
| `mcp-expert` | MCP tool definitions (annotations, input schemas, descriptions, metadata); server transport or session management; resource or prompt definitions; MCP Apps Extension widgets, resources or capability negotiation; `@modelcontextprotocol/ext-apps` usage (`registerAppTool`, `registerAppResource`, `getUiCapability`); `_meta.ui` fields (resourceUri, csp, domain, permissions); widget HTML, iframe communication or postMessage bridges; OpenAI App to MCP Apps migration; MCP auth patterns at the protocol level (OAuth 2.1, PRM, AS metadata); MCP SDK upgrades; reviewer briefs that make host-support, resource-surfacing, tool-resource allocation, prompt-resource allocation or fallback-contract claims | `apps/oak-curriculum-mcp-streamable-http/**`, `**/*mcp*` |
| `sentry-expert` | `@sentry/node` configuration or initialisation; Sentry environment-variable contracts (`SENTRY_MODE`, DSN, release, sampling, logs, debug, PII flags); log sinks, handled-error capture, breadcrumb policy; OpenTelemetry span helpers or active trace-context correlation in logging; shared telemetry redaction; Sentry MCP wrapping, MCP Insights, capture-policy changes; release resolution, source-map wiring, alerting and evidence flows; the observability and sentry-node packages | `packages/libs/sentry-node/**`, `**/*sentry*` |
| `elasticsearch-expert` | Index mappings or field definitions; analysers, tokenizers, synonyms; query DSL, retrievers, retriever composition; ELSER deployment, inference or embedding configuration; RRF, hybrid retrieval, reranking; ingest pipelines or enrichment processors; search observability or evaluation; Elastic Serverless capability questions; bulk indexing or retry strategies | `apps/oak-search-cli/**`, `packages/sdks/oak-search-sdk/**`, `packages/libs/search-contracts/**` |
| `ground-truth-designer` | Semantic-search ground-truth design and review work (on demand) | — |

**The Clerk MCP access constraint (standing owner grant conditions).** The
Clerk MCP access grant carries two binding conditions (owner, 2026-07-21,
granting the access: "it is READ ONLY unless I say otherwise and we ONLY EVER
touch the MCP app project, not any of the other projects"): every Clerk MCP
call is a read, and any write requires the owner's explicit fresh word naming
the write; before any call, confirm the target is the MCP app project, and
where a tool defaults to another project or lists across projects, constrain
the call or do not make it. The Clerk workspace is shared Oak infrastructure;
other projects belong to other streams and production identity systems. The
constraint survives sessions and does not lapse with silence.

**Target-host briefing for `mcp-expert`.** For Oak MCP work, pin the target
host set from the live plan. When the controlling plan names Claude.ai and
ChatGPT, say so explicitly in the brief and reject hypothetical, legacy, or
resource-less-host findings unless the reviewer cites current evidence that a
named target has that limitation. Findings that require a tool fallback for a
resource, an optional argument for a closed prompt, or a handler bridge for an
invented host capability are design-shape findings: verify the governing plan
and host evidence before absorbing them.

### The architecture personas (P21)

The four personas are generic lenses over one shared brief: Barney
(simplification and dependency/boundary cartography), Fred (rigorous
ADR/boundary enforcement and standards discipline), Betty (system coherence,
coupling and change-cost trade-offs) and Wilma (failure-mode resilience and
adversarial edge-case pressure testing). Each is dispatched as
`architecture-expert-<persona>` from the one `architecture-expert` template
with the persona component; a structural change takes one or more of them by
lens. `architecture-expert-wilma` is the resilience lens the domain reviewers
hand off to (OAuth proxy timeouts and retries, bulk-operation retry logic,
transport lifecycle); `architecture-expert-fred` the package-boundary and
ADR-compliance lens.

### Path triggers for the general-layer reviewers

| Reviewer | Fires on | File surfaces |
| --- | --- | --- |
| `accessibility-expert` | Rendered HTML/JSX; ARIA; keyboard navigation, focus, tab order; colour and contrast-sensitive or theme-aware CSS; form inputs, labels, errors, validation feedback; interactive widgets; MCP App view files (`widget/`, `*.view.tsx`, `index.html`); touch targets and pointer interaction; animation, motion, transitions | `**/*.tsx`, `**/*.html`, `**/*.css` |
| `design-system-expert` | DTCG JSON token definitions or schema; CSS custom property definitions, naming, scoping; the token build pipeline; three-tier referencing (palette → semantic → component); theme structure and switching; style containment; token consumption in views or components; contrast metadata or colour token pairs; `packages/design/` files; visual consistency | `packages/design/**`, `**/*.css` |
| `react-component-expert` | Component structure, responsibility, decomposition; hooks; prop API design; composition patterns; server/client boundaries (`'use client'` placement); render performance; form state; error boundaries; MCP App view components (`widget/`, `*.view.tsx`); component-level accessibility integration | `**/*.tsx` |
| `assumptions-expert` | Plan authoring; "DECISION-COMPLETE" or "READY FOR EXECUTION" marks; blocking claims over other workstreams; 3+ new specialist agents; new workspace categories or package topology changes; technology commitments before research; a related PDR, ADR or plan set drafted in one session (review the set boundary, not each document alone); a requested assumption audit or proportionality check | — |

For MCP App views the UI cluster and `mcp-expert` divide the surface:
`accessibility-expert` owns DOM accessibility inside the view,
`design-system-expert` token usage inside the view, `react-component-expert`
component architecture inside the view; `mcp-expert` owns packaging,
`_meta.ui*`, resource registration, the CSP and the host bridge lifecycle
around it.

### Domain signals in this host (Layer 2)

1. Clerk middleware, token verification, OAuth proxy, PRM,
   `@clerk/mcp-tools`, or Clerk SDK usage -> `clerk-expert`
2. MCP protocol, tool/resource/prompt definitions, MCP Apps Extension
   widgets, transport/session patterns, or MCP Apps migration work ->
   `mcp-expert`
3. Sentry SDK usage, OpenTelemetry trace/log correlation, telemetry
   redaction, MCP Insights, or Sentry env/config wiring ->
   `sentry-expert`
4. Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF,
   reranking, ingest, or Elastic Serverless capabilities ->
   `elasticsearch-expert`
5. Outward-facing copy (`VISION.md`, strategy, public README narrative) ->
   `prose-expert` (both layers)

### This host's matrix rows

| Change Category | Required Specialist(s) |
|---|---|
| Structural/boundary changes | `architecture-expert-barney` and/or `architecture-expert-fred` and/or `architecture-expert-betty` and/or `architecture-expert-wilma` |
| Outward-facing copy (`VISION.md`, strategy, public README narrative) | `prose-expert` (craft plus the Oak voice where `editorial-tone.md` applies) |
| MCP protocol compliance, tool/resource/prompt definition validation, transport/session patterns | `mcp-expert` |
| Elasticsearch mappings, queries, analysers, synonyms, ELSER, RRF, reranking, ingest, evaluation, Elastic Serverless capability | `elasticsearch-expert` |
| Clerk middleware, token verification, OAuth proxy, PRM, `@clerk/mcp-tools`, Clerk SDK usage | `clerk-expert` |
| Sentry SDK configuration, OpenTelemetry observability integration, trace/log correlation, telemetry redaction, MCP Insights, release/source-map observability | `sentry-expert` |
| Semantic-search ground-truth design or review | `ground-truth-designer` (on demand) |

### This host's worked examples

**Outward copy change** (`VISION.md`, strategy, public README narrative,
partner-facing material): Invoke `prose-expert` immediately — both its layers
apply (universal craft plus the Oak voice per `editorial-tone.md`). Add
`docs-adr-expert` if the change also touches documentation structure or
cross-references, and `accessibility-expert` if a plain-language WCAG conformance
verdict is needed (`prose-expert` defers conformance to it).

**Elasticsearch/search change**: Invoke `code-expert` + `elasticsearch-expert` immediately. Add `type-expert` if schema or mapping types are affected, `architecture-expert-wilma` when bulk operations or retry logic have resilience implications, and `mcp-expert` when search MCP tool definitions are involved.

**Clerk/OAuth change**: Invoke `code-expert` + `clerk-expert` immediately. Add `security-expert` if the change has exploitability implications. Add `mcp-expert` if MCP auth spec compliance is in question (WWW-Authenticate headers, RFC 9728/8414 structure). Add `architecture-expert-wilma` when OAuth proxy resilience (timeouts, retries, circuit breaking) is involved.

**MCP protocol/tool/Apps change**: Invoke `code-expert` + `mcp-expert` immediately. Add `security-expert` if the MCP auth model is affected. Add `clerk-expert` if Clerk integration with MCP auth is in question. Add `architecture-expert-fred` if MCP tool layering or package boundaries change, and `architecture-expert-wilma` when transport lifecycle or retry patterns have resilience implications. For active MCP planning or implementation support, use the `mcp-expert` skill.

**Sentry/OTel change**: Invoke `code-expert` + `sentry-expert` immediately. Add `security-expert` if redaction, secrets, or PII boundaries change. Add `mcp-expert` if MCP wrapping or Insights could affect protocol behaviour. Add the architecture reviewers when the logger foundation, package boundaries or dependency direction change.

**UI/Frontend change, MCP App views**: add `mcp-expert` (owns `_meta.ui*`, resource registration, CSP, host bridge). UI specialists own DOM, accessibility, tokens, and React structure *inside* the view.

**Reviewer estate change**: the Practice-governance persona is the lens the change needs; `architecture-expert-fred` for ADR compliance of the adapter shapes.

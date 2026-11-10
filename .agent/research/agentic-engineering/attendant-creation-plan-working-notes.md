# The Attendant creation plan: working notes

**Seat**: Limpet lifts Spray (claude-code, prefix `01Duoc`), thread `attendant-workflow`.
**Started**: 2026-11-08. **Status**: working notes of the design session whose deliverable is the
creation plan for the Attendant Workflow; research tier. The owner's words, quoted and dated in the
brief ([`idea-to-merge-process-design.prompt.md`](../../prompts/agentic-engineering/idea-to-merge-process-design.prompt.md)),
are the authority. Everything here is this seat's reading, and is input in the same sense as the
brief's own readings and the
[design notes](idea-to-merge-process-design-notes-2026-11-07.md).

## 1. The session's impact, and the value it delivers (2026-11-08)

The Attendant is a new approach and an exploration on the journey towards unsupervised working
(the owner, 2026-11-10); it replaces nothing. Its own impact comes from its runs: an idea of the
owner's becomes merged value with the owner's judgement at the few points only the owner can
supply, those touches kept few by the agent stepping back, analysing and doubting before each one
(the owner, 2026-11-10), and each run teaching how far unsupervised work can be relied on. One of
the work's main goals is a reliable, effective mechanism for automatically stepping back and
questioning the bigger picture frame, motivation and nature of the work, which several skills
attempt and only partly achieve (the owner, same day). A plan creates none of that, so it is not
this session's impact. The session's impact sits one step earlier: once the owner stamps the
creation plan, the Attendant is built and its first run starts on the owner's idea without
needing more design from the owner, and what gets built delivers value rather than ceremony.
Where the session's doubt shows the shape is wrong, the better shape is found while changing it
costs a conversation. It serves the owner first, then the sessions that build the Attendant (they
carry out decisions rather than make them), and through the Attendant the people the estate
serves.

The value is the creation plan, measured by the owner's three words:

- **Research complete**: the questions that decide the design answered from cited evidence.
  First, what the owner has caught that agents missed: that record tells the doubt points what to
  ask, and without it the doubters are generic, their doubt is theatre, and the owner stays the
  bottleneck however much else is built. Then what the owner needs to see at approval and at the
  sense check to decide in minutes, and what rules, skills, sub-agents and hooks can actually do
  in a cloud session, including how a cloud run makes its writes: checked, not assumed.
- **Design complete**: every part designed from that evidence and the owner's words, each asked
  what becomes easier if the system changes. The part everything rests on is the one the owner
  called the heart of the value: stepping back, questioning and changing direction, done from
  outside the frame that did the work. The Attendant itself is doubted for whether it is worth
  building and how big it should be, so the plan builds nothing for show.
- **Decision complete**: nothing left for a builder to decide alone inside its own frame, the
  failure the Attendant exists to prevent; the owner's decisions brought as requests for
  direction during the session, with analysis; every question only a run can answer named with
  what would answer it; a build order that ends at the owner's idea's first run, so that run both
  delivers the idea and tests the design.

How we would know: building from the plan raises no design question the plan should have
settled; at the first run's sense check the owner changes nothing that the research could have
caught; in the session the owner's attention goes to direction and value, not to correcting a
frame the seat should have doubted itself.

## 2. How the session delivers that value

1. **Footing first.** Review the brief for the reliance "start the design session from it"
   (§3), correct the readings that narrow the owner's words, bring it up to date, fix the
   research corpus, and bring the owner the tensions in the owner's own words (answered, §3.8). Corrections are
   recorded here; the brief stays the record of its own date.
2. **Research, bounded and cited.** The brief's five questions over the widened corpus (§3.3),
   densest evidence first. Every quotation is checked against its file before it is used; a
   reader's quotation is a pointer to a source, never the source (the napkin, 2026-11-07).
   Findings land here with citations.
3. **Explore the design with the owner, the crux first.** The stepping back and the doubt come
   first, because every other part depends on them. Each part comes to the owner as analysis,
   a leaning and, where one exists, the tension. Two of the owner's requirements pulling against
   each other stops the work and the frame is examined with the owner. The owner's decisions come
   as requests for direction, never menus. Instruments: `concept-exploration` for the
   stepping-back concept, which is not yet shaped; Parallax at standard depth for the design
   space, with protected frames; `proportionality` to size each part; `user-value` and `specify`
   for the contracts; `reason` for each decision.
4. **Doubt from outside the seat's frame, as the Attendant would.** At the points where the
   seat's frame could be captured (the research synthesis, the crux's design, the whole plan),
   a fresh-context reviewer receives the owner's words and the artefact with the seat's claims
   withheld, is asked whether the thing should exist as well as whether it is right, and its
   dependence on the seat's brief is recorded. The first instance ran on 2026-11-10 against
   the brief (§3.1).
5. **Author the plan in the plan estate**, born `sketch`: each decision with its reasoning and
   evidence, the build order to the first run. The owner's stamp makes it the plan of record.
   Between phases the seat re-reads the brief's quotations and §1 and re-commits to them.

"Decision complete", as this session holds it: every decision the build needs is made. Where only
a run can show a decision right, the plan states the decision, the observation that would show it
wrong, and what changes if it does; that is a decision with its falsifier, not a deferral.

Stopping condition: every decision a builder needs is made, and an outside-the-frame audit of the
whole plan, asked whether it could be complete and still worthless, finds nothing that changes it.

## 3. Review of the brief (2026-11-10)

**Assessed**: the brief at `SHA:b1c3ee289` (pull request 390's merge on `engraph`) with the design
notes. **Reliance**: a design session starts from it and produces the decision-complete creation
plan by exploration with the owner. **Acceptance authority**: the owner.

### 3.1 Independence and method

Two assessments. This seat's: it did not write the brief, has read it in full and will rely on it.
An independent one: an `assumptions-expert` sub-agent in a fresh context, briefed with the reliance
and the brief's convention, without this seat's doubts, which read the repository and Anthropic's
documentation (38 tool calls, 2026-11-10). Both read the same brief and corpus, so they are
independent readings of shared sources, not independent evidence. Every claim of the independent
assessment used below was re-read first-hand by this seat: the repository quotations against
their files, and the documentation against the pages themselves (`cloud-environments` and
`claude-projects` as page text; `hooks`, `skills` and `sub-agents` as a second extraction, which
agreed with the first). They converged on four of this seat's doubts (§3.4: the credential
reading, the reunification, the corpus, the missing constraints); the independent assessment
added the touch-point and shaping tension, the pricing reading, the GitHub proxy facts, the hook,
skill and sub-agent mechanics, and the work-in-progress limit.

### 3.2 Disposition

Ready to start from, with conditions. In structure the brief is what the session needs: the
owner's words verbatim and dated, kept apart from every reading; the outcome, impact and
mechanism; bounded research; the notes labelled as input. As a fact base for a decision-complete
plan it is not yet sound, and the gaps sort into two kinds.

- **Three tensions in the owner's own words, put to the owner** (§3.3, items 1 to 3): the
  credential a hosted cloud run writes under; what the touch points are and what happens between
  initiation and approval; what "pricing" covers. The owner answered all three on 2026-11-10
  (§3.8).
- **Corrections this session makes at its start** (§3.4, items 4 to 9), recorded here.

Two doubts are carried into the design rather than settled before it (§3.5).

### 3.3 Tensions for the owner's direction

1. **The credential a cloud run writes under.** The owner (2026-11-07, brief lines 142 to 144):
   "how do we make that possible with bot credentials, and if it isn't how do we distinguish
   these sessions so it's clear when using my credentials is appropriate?" Item 8 (brief line
   217) keeps the first half only: "the bot for every write; where no bot path exists for a
   write, the creation plan names the blocker and the owner rules". Anthropic's documentation
   ("Configure cloud environments", §GitHub proxy, read 2026-11-10) settles the first half for
   Anthropic-hosted sessions: "all GitHub operations go through a dedicated proxy that keeps your
   real GitHub credentials outside the session's VM"; git pushes and API requests "go out with
   your real credentials substituted"; and the proxy "rejects requests to GitHub's GraphQL
   endpoint", a restriction that "applies to every request through the proxy regardless of the
   credentials you supply". A bot token could only enter as an environment variable, and "anyone
   who uses the environment can read it"; the estate forbids secrets there. So from a hosted
   session no GitHub write is the bot's, not the merge alone. The documented exception is a
   self-hosted environment, with "per-session minted credentials". The estate has the shape the
   owner's second half asks for: the ChatGPT Work profile, a detected session class whose
   task-scoped writes use the owner's credential by the owner's ruling of 8 September 2026, with
   agent-authored content marked (`cloud-environment-routing.md`; `bot-identity` lines 44 to
   58; `identify-as-agent-under-shared-credentials`). The bot-identity rule leaves the choice to
   the owner: "The fallback happens only when the owner explicitly permits it, and the owner
   generally instigates it." GitHub Actions minting the bot's token is proven "by a stub trial
   only" (`open-pull-requests-to-zero` thread record on `engraph`). Two further consequences: the
   estate's review settlement reads review threads through GraphQL, which the hosted proxy
   refuses, so the review stage is designed against REST or the session's GitHub connector
   (whether the connector passes through the same proxy is not yet verified); and under the
   owner's credential the agent must never submit a pull-request review, since it would appear
   as the owner's own review. This seat's leaning: a distinguished Attendant cloud session class
   under the owner's ruling, every write marked as agent-authored, no review ever submitted, the
   merge made under the owner's credential only after the owner's word at the sense check, so
   that the record of the merge says what is true; strict bot attribution would need a
   self-hosted environment or the Actions route, both machinery.
2. **What the touch points are, and what happens between initiation and approval.** The owner's
   words, all of 2026-11-07: "I specify an idea and outcomes, the agent(s) flesh out and refine
   the idea, create a plan, review and improve the plan, I sign off on the definition of done
   and acceptance criteria" (brief lines 46 to 48); "it must need me only twice, during initial
   ideation and refinement, then to sense check the PR just before merge" (line 55); the three
   touch points "initiation, acceptance criteria approval, final sense check just before merge";
   the user story's "Once I approve a detailed plan is created" (line 75); the metric "three
   touches of your attention and none unplanned" (line 21); "There is no count to check against"
   (line 27); and on a worth-doubt, "ask the user for direction" (line 102). The brief settles
   these by "The user story is the later word" (line 90), which drops the outcomes the owner
   states, the definition of done, a reviewed plan before sign-off, and the owner's presence
   during refinement; and a mid-run request for direction is none of the three touches. This
   seat's reading of the frame: the touches are kinds of judgement only the owner can make (what
   is wanted, whether the criteria capture it, whether the result is sensible to merge), and the
   count is not the measure. On that reading initiation through approval can be one attended
   conversation (the idea and its outcomes in, refinement with the owner, the owner signing the
   outcomes, the definition of done and the acceptance criteria), which the principles favour
   ("The what, the why, and the why-now are established in CONVERSATION with the owner before
   building ANY structure", `principles.md`), and a mid-run worth-doubt is the process returning
   to that conversation: the success the owner named, not an unplanned touch.
3. **What "pricing" covers.** The owner: "We have already excluded pricing as a mechanism for
   this work." (brief line 136), beside "previous PR limits and token limits taken from normal
   operations should be tunable" (line 135). In this estate "pricing" names the review-cost
   mechanisms: PDR-140, "Review feedback is information — the response is what gets priced";
   the fleet rule's "before the owner prices it"; the pre-push gate's "the pricing failed". The
   brief reads the exclusion as cost per run only, keeps PDR-132's round budgets and PDR-140's
   push budgets as tunable constraints the owner did not name (line 308), and the notes put
   "cost against the plan" on the sense-check screen (notes line 280), the moment the owner's
   reason for the exclusion ("pulled work towards numerical outcomes rather than value provision
   and sound judgement") applies to. In a hosted cloud session PDR-140's gate does not run at
   all: it lives in `.husky/pre-push` and cloud sessions push with `HUSKY=0`, and the in-session
   substitute set does not include it. This seat's leaning: the exclusion covers the estate's
   pricing mechanisms; a run holds proportion by judgement and the doubt points; cost is
   recorded for the retrospective and kept off the owner's decision screens.

### 3.4 Corrections the session makes at its start

4. **The reunification** (both assessments). On 2026-11-09 `engraph` gained the delivery node
   `reunify-oce-forks` (pull request 391, `sketch`, owner gates expiring 2026-11-30): the fork
   merges into Oak's `main` by one merge commit and returns to a mirror. After that a run's
   branch, pull request, required checks (CodeQL, SonarCloud, run-quality-gates, Vercel),
   reviewers, rulesets and bot are Oak's. The brief names no target repository. Correction: the
   Attendant binds to its host at run time; it is built as text that travels with the merge; the
   first run's home follows from when it is ready.
5. **The research corpus** (both). The bounded corpus (brief lines 241 to 247) leaves out the
   graduated record of what the owner catches: the rules, many of which carry the owner's dated
   words as their provenance (51 of 124 by a pattern count on 2026-11-10) and so already classify
   the catches; `owner-signal-interpretation.md`; the `why-…` retrospectives (the
   two-expert-reviews record the notes cite at line 252 is outside the twelve, as are the records
   of a ruling that took three owner words, of review arcs that hit one generator, of an alignment
   that took four days, of review rounds that grew, of records that outran their evidence, and the
   October practice-system review); the Cricket tallies, the estate's direct evidence on whether
   fresh-context doubters catch frame errors; the experience files; and the operational
   review-cost ledger, frictions register and open questions. A saturation rule over a
   pre-selected corpus saturates the selection. Correction: the research reads the graduated
   record first and fills from napkins and threads. If that does not saturate, the estate's
   calibrated corpus-analysis workflow is the instrument for the rest, and running it needs the
   owner's explicit word (the Workflow tool's policy).
6. **Constraints item 7 does not name** (both). The pull-request lifecycle's work-in-progress
   limit: "its limit is one open pull request across the repositories" for a seat the owner names
   alone, and no pull request starting new work opens at the limit (`pr-lifecycle`, lines 2084 to
   2087); a run whose draft pull request opens at initiation holds the only slot from the idea
   through the wait for approval to the merge. `one-pr-per-leaf-issue` (a hard rule): one leaf
   issue, exactly one pull request, split "between decision and delivery", which the
   single-carrier shape (the run node and the code in one pull request) crosses. The plan-node
   estate: delivery state "is a Linear projection, never a repo field"
   ([ADR-216](../../../docs/architecture/architectural-decisions/216-plan-node-estate.md));
   about a third of this estate's plan nodes carry Linear tickets (58 of 167 on 2026-11-10), and
   Oak's practice applies after the reunification. The Director rules
   (`route-blocks-and-questions-to-director`, `unattended-seats-never-prompt`, PDR-117), the fleet
   rule for any parallel run, `owner-attention-at-action-moments` as the estate's existing doctrine
   on the decision screens, and PDR-140's gate not running in cloud. Correction: each enters item
   7's analysis of what it protects and what becomes easier if the system changes.
7. **Lever facts** (the independent assessment, re-read first-hand; §4). Correction: the notes'
   hook paragraph and "a skill loads into the context that did the work" (notes line 352) are
   replaced by what the documentation says, and the build-versus-buy survey covers the native
   levers beyond the four the brief lists: dynamic workflows, agent teams, sub-agent nesting,
   worktree isolation, forked skills, skill-scoped and sub-agent-scoped hooks, prompt and agent
   hook types. A name collision to keep in view: Claude Code's own feature is called
   "workflows".
8. **The Projects facts.** A project thread loads root `CLAUDE.md` and root `.claude/rules/`, but
   not path-specific rules, not skills (the remedy is enabling a skill on the claude.ai account),
   not repository agents and commands, and does not run repository hooks; the documented remedy
   for agents and hooks is running the thread on the owner's own computer. The brief's
   conclusion ("a skills-defined Attendant cannot run inside a project thread") holds in effect,
   for a reason it does not give: the doubt points' sub-agents do not load there. A project can
   coordinate runs that each execute in an ordinary cloud session. A thread "opens a pull
   request when the work calls for one", not always.
9. **Smaller corrections.** The notes contradict themselves on build order (line 105: "the
   checkpoints plus the doubt briefs, run by hand on one idea"; line 322: "The skills, sub-agents
   and components are built before the first run"); the design settles it. "Repository skills
   load and invoke one another" (brief line 266) was shown only as the agent invoking skills.
   Two "concepts explored" are machinery (`spawn` and `pr-tally` are `agent-tools` modules). The
   Claude adapters carry an `oak-` prefix, which the names `attendant` and `attendant-*` meet.
   The notes' cadence lever (a `Monitor` tick) only reminds the main agent, the kind of prompt the
   central bet says a captured agent rationalises past. Components have been explored twice
   before: sub-agent prompt components are leaf nodes
   ([ADR-114](../../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)),
   and plan components were retired when the plan-node estate replaced the templates
   ([ADR-117](../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md));
   the skill-component design learns from both. The owner's words put components shared with
   existing skills in scope; improvements to the estate beyond what the Attendant needs (notes
   lines 113 and 332) are separate deliverables unless the owner says otherwise.

### 3.5 Doubts carried into the design

- **Fresh context is not independence.** The notes give the step-back agent "the records and the
  owner's verbatim words, with the invoking agent's prose withheld" (notes line 139). A run's
  records are written by the run's own agent; and through the Agent tool "Claude composes a
  delegation message that summarizes the task", so the captured agent writes the doubter's
  prompt and picks its records, and a custom sub-agent loads `CLAUDE.md` unless `omitClaudeMd`
  is set (sub-agents documentation, 2026-11-10). The estate's record: a mis-dated record
  "propagated into four independent verdicts" of a Cricket panel
  ([tally, 2026-08-12](../../reports/agentic-engineering/cricket-quartet-tally-2026-08-12-24h-retrospective.md));
  readers briefed by one author "share one frame: they are dependent evidence, not independent
  corroboration"
  ([five-days retrospective](../../reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md));
  "review happens inside the frame it is handed", and a brief that asks whether a design is safe
  and correct cannot return "delete it"
  ([two-expert-reviews retrospective](../../reports/agentic-engineering/why-two-expert-reviews-hardened-a-mechanism-that-should-not-exist-2026-09-20.md)).
  The same tally shows the other side: four fresh legs converged on a systemic false-frame
  finding the seats had never caught themselves. The native means exist: a skill with
  `context: fork` runs as a sub-agent with the skill's own text as its prompt, so a doubt brief
  can be fixed text; `omitClaudeMd` withholds the estate's frame where that frame is what is
  doubted; primary evidence (the diff, observed behaviour, the owner's words) goes in beside the
  run's records; dependence is recorded.
- **The sense-check metric needs an honest screen.** "your sense check changes nothing material"
  reads true of an excellent run and of a screen that does not show the owner what they would
  change; the screen has to make the metric honest.

### 3.6 The owner's word on the review, and the questions reviewed (2026-11-10)

The owner, 2026-11-10, on this review: "Please review the above questions. The Attendant doesn't
replace anything, it is a new approach and an exploration on the general journey towards
unsupervised working." And: "I absolutely agree that the quality gates are too slow and that
ceremony has a tendency to get in the way of delivery, and that we need to improve both. This
are general problems with the repo's mechanisms, they are not particular to the Attendant. One
of the main goals of this work is to create a reliable, effective mechanism for automatically
stepping back and questioning the bigger picture frame, motivation, and nature of the work.
Several skills already attempt to provide this, but have only been partially successful".

What changes. The "whose bottleneck" doubt is withdrawn: gate cost and ceremony are the estate's
general problems with their own lanes, and the Attendant is not asked what it replaces. The
Attendant is an exploration, so the first run is an experiment that teaches, and the plan is
judged by what it lets a run learn as well as deliver. The stepping-back mechanism is a main
goal in its own right: reliable, effective, automatic. The research opens with why the existing
instruments only partly succeed.

The seat first read "Please review the above questions" as "none of these is a question for the
owner". Its review of its own work (§3.7) found that an over-correction, and the three tensions
went back to the owner, who answered them (§3.8). The supporting rule's place is settled by the
lever research and the design. The first run's idea is the owner's to give, wanted when the plan
fixes the build order.

### 3.7 Review of the work so far (2026-11-10, at the owner's word)

Instruments: metacognition, reason and proportionality by the seat; the Cricket panel's normal
wave on one frame (three judgement seats returned, the procedure seat undelivered; the
adversarial wave not run, the redirection being already actionable). The three seats read one
frame the seat wrote: dependent readings. Work verdicts: ON-TRACK three times. Frame verdicts:
NARROWED twice, CONTRADICTED once, on the same point.

- **§3.6 over-corrected.** "None was a question" swung to the opposite of the correction it
  answered. The owner's "ask me for direction with your analysis" makes analysis plus a leaning
  the form asked for, not proof the decision is the seat's. The credential decision is the
  owner's by the bot-identity rule's own words; what "pricing" covers is a fact only the owner
  holds, and the two readings do not give the same design (round and push budgets stay tunable
  under one, leave under the other); the touch-point reading is the seat's model, to be confirmed
  or corrected by the owner, not settled. What "Please review the above questions" asked for is
  itself the seat's reading.
- **Cohesion.** §1 stated the impact as the owner's attention ceasing to be the bottleneck, and
  §3.2 and §3.6 disagreed on whether anything went to the owner. Both are re-trued on the owner's
  answers (§3.8).
- **Effectiveness.** Four owner turns have produced a corrected fact base (the credential proxy,
  the hook, skill and sub-agent mechanics, the widened corpus) and no research or design on the
  main goal. Two of the owner's turns went to correcting the seat's frame, the seat's own
  failure measure in §1. Record-keeping took a large share of the work.

### 3.8 The owner's answers (2026-11-10)

1. **The credential**: "Agreed." The owner permits the seat's leaning: an Attendant cloud session
   class that writes under the owner's credential, every write marked as agent-authored, no
   pull-request review ever submitted by the agent, the merge only after the owner's word at the
   sense check. The plan designs how such a session is distinguished.
2. **Cost**: "Our efforts to use cost to steer behaviour have produced some dumb results where
   cost reduction was minimised at the expense of producing value. So I definitely do not want
   cost used as a success metric. That is not to say it is unimportant, or to ignore it, only that
   if highlighted it tends to distort the direction the agent moves, and the distortion compounds
   over time, which would make independent work less reliable." The seat's reading for the
   design: cost is observed and recorded, never a target, a success measure or a highlighted
   figure in what a running agent or the owner's decision screens see; a round or push budget,
   where the design keeps one, is read as a sign of non-convergence to step back on, not as a
   cost to minimise.
3. **The touch points**: "Correct, and those touches are minimised by the agent stepping back and
   analysing and doubting before my touch." The touches are kinds of judgement only the owner
   makes; initiation through approval is one conversation; a mid-run doubt about worth returns to
   it. The stepping back before each touch is what keeps them few, which ties the touch design
   to the stepping-back mechanism.

## 4. Lever facts

Observed first-hand in this cloud session (Claude cloud, the "Practice Repos" environment,
2026-11-08 to 2026-11-10; one observation each):

- Repository skills load and are invoked through the Skill tool (`oak-start-right-thorough`).
- The `.claude/rules/` adapters were in context from the session's first turn.
- The repository's sub-agent definitions were in the session's agent list and one was
  dispatched (`assumptions-expert`).
- The repository configures `SessionStart`, `PreToolUse`, `UserPromptSubmit` and `PreCompact`
  hooks (`.claude/settings.json`); `SessionStart` injected the PDR-027 identity context, and
  `PreToolUse` refused a `git stash` push by the repository's policy.
- The cloud launcher configures its own `SessionStart` and `Stop` hooks
  (`~/.claude/launcher-settings.json`, event names read 2026-11-10); the `Stop` hook ran at a
  turn's end and its feedback re-prompted the agent.

From Anthropic's documentation (code.claude.com/docs, read 2026-11-10):

- **Hooks**: 33 events, among them `SubagentStart`, `SubagentStop`, `TaskCompleted` and `Stop`.
  `Stop` blocking "Prevents Claude from stopping, continues the conversation"; `SubagentStop`
  blocking "Prevents the subagent from stopping". Hooks fire the same way in cloud sessions.
  Handler types include `prompt` (a single-turn model evaluation returning a decision) and
  `agent` (a sub-agent with read tools returning a decision; experimental). Hooks in a skill's
  frontmatter register when the skill is invoked and run for the rest of the session (`once: true`
  removes one after its first successful run); hooks in a sub-agent's frontmatter run only while
  it runs, with `Stop` converted to `SubagentStop`.
- **Skills**: `context: fork` starts a sub-agent of the type in the `agent` field and gives it
  the skill content as its prompt, without the conversation's history. After auto-compaction
  the most recent invocation of each skill is re-attached, its first 5,000 tokens, within a
  combined 25,000.
- **Sub-agents**: the delegation message is written by the delegating agent; custom sub-agents
  load `CLAUDE.md` unless `omitClaudeMd` is set; `isolation: worktree` gives a temporary
  worktree branched from the default branch; sub-agents nest up to three layers by default; a
  sub-agent does not see the conversation, the skills already invoked or the files already read.
- **Cloud GitHub access**: §3.3 item 1.
- **Projects**: §3.4 item 8.

## 5. Sources read for this review

The brief and the design notes in full; `principles.md`, `metacognition.md`,
`user-collaboration.md` (working model), `orientation.md`; the rules
`bot-identity-on-third-party-systems`, `identify-as-agent-under-shared-credentials`,
`one-pr-per-leaf-issue`, `present-verdicts-not-menus`, `design-from-impact-not-the-cowpath`,
`scope-from-goal-before-approach`, `owner-attention-at-action-moments`;
`cloud-environment-routing.md` and `.agent/claude-harness-integrations/cloud-environment.md`;
ADR-114, ADR-117, ADR-125 and ADR-216 (decision sections); the plan node `reunify-oce-forks` and
the `open-pull-requests-to-zero` thread record at `origin/engraph`; the five-days,
two-expert-reviews and Cricket-tally retrospectives (summary and causal sections); the plan-node
schema's Linear sections; PDR-140's title, the fleet rule and `.husky/pre-push`; the
`pr-lifecycle` work-in-progress lines; Anthropic's `cloud-environments`, `claude-projects`,
`hooks`, `skills` and `sub-agents` pages; the existence of the twelve listed reports, checked.
The independent assessment's full return is summarised in §3, its claims re-read first-hand.

## 6. Research, first pass: why the step-back instruments only partly succeed (2026-11-10)

Sources read first-hand: the retrospective
[why written lessons kept needing the owner](../../reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md)
(summary, arc, causal stack, counterframe, counterfactual); the two-expert-reviews and
five-days retrospectives and the Cricket tally of 2026-08-12 (§3.5); the Cricket skill; the
trigger text of each instrument (its "use when"); this session's own two instances. A first
pass, not saturation.

Five causes, each with its evidence:

1. **The trigger is the working agent's own recognition.** Every instrument fires when the
   agent judges it should: `metacognition` "when the purpose under an action is non-obvious",
   `concept-exploration` when "framing options immediately would foreclose the real question",
   Cricket "at cycle or decision boundaries", `retrospective` on a surprise. A captured frame
   does not feel like one. The record: "Sixteen of nineteen prior-kept mechanisms recurred
   within four weeks of the run that kept them"; "Writing the lesson did not install it"; under
   a silent model change, mechanically enforced disciplines held while prose-only ones
   "regressed to error types months absent, despite the full rule corpus being loaded in
   context".
2. **The frame is written by the one being checked.** "A consultation inherits the asker's
   frame … the opposite of parallax, while feeling like diligence". A seat's Cricket suites
   returned 19 ON-TRACK of 24 while it worked one direction of a two-way goal (Cricket skill,
   the owner's word of 2026-09-24: "Crickets judge in the frame provided, we need them to also
   judge the frame itself").
3. **The question asked has no answer of the form "stop" or "delete it".** "internal instruments
   audit MECHANICS; only external reads audit WARRANTS"; four reviewers hardened a mechanism
   nobody was asked whether to keep.
4. **The evidence handed over is the working agent's own record.** A mis-dated record
   "propagated into four independent verdicts".
5. **The return is advice to the agent it doubts, and the estate's response to failure adds.**
   "Resolve is advice; a sentence that must be written is a step"; "the owner SUBTRACTED at
   every touch while agent rounds had ADDED".

What has worked, from the same record:

- **Anchor-free legs commissioned against the question**: on 2026-08-17 they "were the only
  parts of the day's work that survived" and agreed with the owner.
- **A frame built from the owner's verbatim words**: on 2026-11-10 four Cricket seats, given the
  owner's sentences beside this seat's reading, each caught the seat's over-correction (§3.7);
  an assessor briefed without the seat's doubts found five the seat had missed (§3.1). Two
  instances, one session.
- **Instruments, where doctrine had not changed the rate**: the review tally builder and the
  review-cost gate; a lint rule; the merge front door's typed refusals.
- **Two script-free forms that held**: "a sentence that must be written is a step" (stating the
  prong stopped a generator that naming twice had not), and a declared deadline-and-default.

What this asks of the mechanism (the design question, for exploration with the owner):

- its firing does not depend on the working agent judging that it is needed;
- its frame is the owner's words and primary evidence, with the working agent's reading as the
  thing judged, never the lens;
- its question is fixed, climbs (the work, the stage, the plan, the value, the bigger picture)
  and admits "stop", "smaller" and "not worth doing" as answers;
- its return binds: the working agent answers it in writing in the run's record before it
  continues, and a worth-doubt with evidence goes to the owner;
- it can subtract.

The open fork is the firing. Script-free candidates: a stage's required input (the notes'
precondition bet, supported by "a sentence that must be written is a step", one instance); a
`context: fork` skill for the fixed brief. The native alternative: a hook declared in the
Attendant skill's own frontmatter (`Stop` or `SubagentStop`, of the `prompt` or `agent` type),
which exists only while a run is live, runs no script of the estate's, and is still a hook under
the owner's cost ordering.

## 7. Proposals for the later steps of the lane (2026-11-10)

The authoring seat's proposals for the delivery nodes of steps 2 to 4 of the strategic node
`attendant-workflow`, as input to the seats that write them at pickup. They carry the cures of
two independent reviews and of the pull request's reviewers; "question 4" is the research
step's fourth question.

### Step 2: design and test the stepping-back mechanism

The heart of the work, done before the rest of the Attendant because every other part depends
on it; designed by exploration with the owner as design partner.

1. **Design the composition** across the four surfaces the owner named: `start-right`,
   `AGENT.md`, skills and rules. For each, what it carries, with descriptions and application
   criteria written so the agent meets it at its moment without having to recall it. Two of the
   four are read by every session, so the mechanism is designed as a general capability of the
   estate with the Attendant as its first user, and any change to `AGENT.md` or a `start-right`
   workflow is proposed to the owner before it is made. Candidate parts, to be confirmed or
   replaced by the research step: a line in `start-right` and `AGENT.md` that names the obligation and
   points to its skill; a rule stating the obligation and its moments; a stage's required
   written input (a stage does not start without the step-back return and its written answer
   on record); the step-back brief as fixed text in a forked skill, given the owner's words and
   primary evidence.
2. **Find out whether it works**, with three instruments, each for what it can show.
   - *The skill part*: the estate's skill-evaluation runner on the step-back skill, including
     its trigger suite for the description. The runner tests a skill alone, in an empty
     workspace; rules, `AGENT.md` and `start-right` are in neither of its arms.
   - *The composition*: full-repository sessions on output B's scenarios, run with the
     composition present and absent (two branches), if question 4's feasibility check shows
     this can be done. Each scenario is run at least three times per arm, on the model a run
     would use, named in the results; the control scenarios measure stepping back where it is
     noise. Once the design is frozen, a fresh agent runs the held-back
     scenarios (the research step's second file, which the designing seat never opens) and
     fresh agents score them; the designing seat sees only the scores until the decision of
     step 3 is made.
   - *What neither can show*, left to the first runs and their retrospectives and said so: a
     frame drifting slowly over a long session; firing after compaction; capture by the agent's
     own sunk work; whether a written answer is real or formulaic; behaviour across a model
     change.
   Results are kept under the skill's `evals/results/`.
3. **Decide on the evidence, with the owner.** The composition goes forward if, on the seeded
   scenarios, the agent steps back more often with it than without and what it does next is
   right more often than without (both by the rubric written before the runs), it does not step
   back more often on the control scenarios, and the owner judges the returns worth having. The
   rule is a direction and a judgement, with no numeric threshold: a number set before any run
   would be invented, and the owner has said what numbers put in front of an agent do. If the
   feasibility check of question 4 shows the full-repository comparison cannot be run or
   scored, this step decides on the skill runner's results and the owner's reading of the
   returns alone, says so, and leaves the firing of the rules, `AGENT.md` and `start-right` to
   be shown by the first runs. If not, the
   design is revised and re-run. A hook declared in the skill's own frontmatter is considered
   only then, tested cheaply first, and is the owner's decision.

### Step 3: design the rest of the Attendant

Each decision below is made in this plan with its reasoning, from phases 1 and 2 and the owner's
words; "simpler if the system changed?" is asked of each and the answer recorded.

- The stages and their sub-skills, from the owner's user story and the settled touch model; the
  doubt asked at each stage and its altitude.
- The two decision screens (the research step, question 2).
- The sub-agent definitions, and how each receives the owner's words and primary evidence.
- How a run's contract and state are recorded, against three constraints: the plan-node estate's
  rule that delivery state is a Linear projection; `one-pr-per-leaf-issue` and its split of
  decision from delivery; the one-open-pull-request limit for a seat working alone. Each is
  analysed for what it protects and what becomes easier if it changes; any change is proposed
  to the owner.
- How an Attendant cloud session is detected and recorded as its session class, and how its
  writes are marked.
- The review stage without GraphQL.
- The resumption contract across compactions and sessions, and how a second live run is
  detected.
- Which parts of existing skills become components shared with the Attendant.
- The scale question: one pull request against larger work, and Claude Code Projects (a project
  thread does not load the repository's sub-agents or run its hooks, so a run executes in an
  ordinary cloud session).
- The states of a run: not yet; abandoned on the owner's word; done.

Step 3 ends with an outside-the-frame audit of the whole design, asked whether it could be
complete and still worthless, and the design returned to the owner as design partner (no step waits on a stamp of its own; the
strategic node's ratification delegates each step's authoring).

### Step 4: build and first run

The build order is decided at the end of phase 3; the mechanism of phase 2 already exists by
then. The owner gives the idea for the first run. The first run is an experiment as well as a
delivery. Its record shows each stepping-back return and its written answer. Its retrospective
reads the run against the owner's three provisional measures ("an idea reaches merged value with
three touches of your attention and none unplanned"; "your sense check changes nothing material
in most runs"; "you would rather use it than not"), as information and never as targets, and
says which doubt points changed something, what the owner changed at the sense check, and what
this plan got wrong.

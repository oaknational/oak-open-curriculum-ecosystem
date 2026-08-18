Name: prose-expert
Purpose: Prose craft review, scoped voice
Summary: Read-only craft review of `docs/governance/development-practice.md` for clarity, concision, active voice, and register, with the Oak editorial voice deliberately withheld.

## Classification

**Document class: precise-transmission — Layer A (craft) only.** `editorial-tone.md` §"Where this applies" excludes "agent directives, the Practice Core, rules, code, code comments" and "the `docs/engineering/` and `docs/operations/` surfaces". It does **not** enumerate `docs/governance/`. I read that as an enumeration gap rather than an inclusion: this file is builder-facing doctrine read to act precisely, which is exactly the kind the directive says the voice must stay out of. Per the template's ambiguity rule I default to Layer A and say so. No Layer B findings appear below, and none should — contractions, "you"-flipping, and teacher-protagonist framing would actively damage this document.

Repository-relative path (machine root removed at the portability sweep): `.claude/worktrees/identity-switchboard-pr2/docs/governance/development-practice.md`

One scope note for the docs reviewer: the directive's exclusion list should probably name `docs/governance/` explicitly, since three of this repo's densest doctrine surfaces live there and a future author has no textual authority for withholding the voice.

## Systemic findings

These recur across the document and matter more than any single sentence, because each one costs the reader on every encounter.

**S1 — Modal verbs are inconsistent, so a reader can't tell which instructions are absolute.** The document uses `MUST` once (line 395), lowercase `must` thirteen times, `should` six times, `NEVER` six times, and lowercase `never` nine times — for instructions of apparently equal standing. "Session prompts *should* be updated at end of each session" (line 388) and "`.env.local` files *MUST* mirror the structure" (line 395) are both flat requirements, but the typography says one is optional. Pick one register — I'd suggest reserving capitalised `NEVER`/`MUST` for the small set of true absolutes and putting everything else in plain imperative ("Update session prompts at the end of each session"), which is shorter and stronger than any modal.

**S2 — Emphasis-caps are overloaded.** The document uses capitals for two different jobs: normative absolutes (`NEVER`, `ALL`, `MUST`) and ordinary rhetorical emphasis — "when a change's value IS an assertion" (92), "must turn the red cell GREEN" (107), "the mutants you did NOT think of" (123), "lands in the LOCAL checkout" (247), "discoverable AND actionable" (314). Every rhetorical use devalues the normative ones. Use italics for emphasis and keep capitals for the absolutes.

**S3 — Coined jargon, against the document's own rule.** Line 361 states it plainly: *"Write the plain meaning, not coined status-jargon: 'safe to delete', not 'reclaimable'. Before using a coined adjective or status term, ask what it actually means for the reader."* The document then breaks this rule several times, most heavily in §Analysability: "durable states for instrument findings" (154), "Dismissal is doubly non-durable" (155), "positional alert identity" (156), and elsewhere "an enforcement-scope gap is not a requirement gap" (41), "ratified exemption" (47). These are not established terms a reader arrives knowing; each forces a decode. This is the single most valuable finding in the review because the document already carries its own cure.

**S4 — Load-bearing instructions are buried inside nested parentheticals.** The pattern is: a sentence opens with context, subordinates the actual instruction into a parenthesis, and puts the hardest constraint last inside it. Worst instance at lines 100–102 (see F5). A reader scanning for "what must I not do" finds it at the deepest nesting level.

**S5 — Heading case follows three conventions.** Title Case dominates ("### Specialist Review Findings", "### Analysability Is Part of Correctness"), but the two gate sub-sections are sentence case ("### Gate taxonomy — nine complementary layers", "### Mutation testing — method and tooling"), and "### Response Augmentation is Best-Effort" splits the difference by lowercasing "is". Pick one; sentence case reads better for headings that state a rule.

**S6 — Bullet lists carrying essays.** Several bullets run 10–13 lines and contain worked examples, shell commands, and cross-references (203–215, 219–229, 240–249, 366–375). A bullet list sets an expectation of scannable parallel items; an essay in bullet position defeats scanning without gaining anything. These want to be short prose paragraphs under their headings, or the bullet wants its own sub-heading.

## Line-anchored findings

Ordered by how much each hinders a reader acting under the document.

**F1 — Line 407–412: the rule is buried behind its own history.**
The section's whole point is the bolded clause, but the reader must cross twenty words of failure history to reach it, and the opening is passive with no actor ("are repeatedly misclassified... and corrected each time" — by whom?).

- Before: "Codegen, vocab-gen, and generator directories are repeatedly misclassified as build-scripts exempt from logger and lint discipline, and corrected each time: **a generator's output is product code, so the generator is product code** — full `no-console` / logger discipline, lint, and type strictness apply."
- After: "**A generator's output is product code, so the generator is product code** — full `no-console`/logger discipline, lint, and type strictness apply. Codegen, vocab-gen, and generator directories draw this correction repeatedly; reviewers keep classifying them as build-scripts exempt from that discipline."

**F2 — Lines 33–35: circular phrasing hides a simple instruction.**
"directive-defined one-gate-at-a-time runs from the grounding directives/prompts" defines the runs by the documents that define them, and "first" dangles.

- Before: "For AI agent execution order, follow directive-defined one-gate-at-a-time runs from the grounding directives/prompts first; aggregate commands remain convenience workflows for local human development."
- After: "AI agents run one gate at a time, in the order the grounding directives and prompts define. The aggregate commands above are a convenience for local human development."

**F3 — Lines 51–55: the object is fifteen words from its complement.**
"Do not make a shell invocation of an interactive-session command, such as Claude Code `/doctor`, a validation gate for plans or commits" — the reader must hold "make... a validation gate" open across the entire clause. The following sentence then hangs its qualifier at the end, where it could attach to the last list item or the whole list.

- Before: "Do not make a shell invocation of an interactive-session command, such as Claude Code `/doctor`, a validation gate for plans or commits. Validate durable changes through repo-local gates, settings diffs, generated artefacts, and owner-supplied session evidence when the session surface itself is the subject."
- After: "Never use a shell invocation of an interactive-session command — Claude Code's `/doctor`, for example — as a validation gate for plans or commits. Validate durable changes through repo-local gates, settings diffs, and generated artefacts; when the session surface itself is the subject, add owner-supplied session evidence."

**F4 — Lines 149–156: three ideas in one colon-joined sentence, then coined jargon.**
The opening claim is genuinely good and worth protecting. The trailing clause is a separate doctrine bolted on with "and", and "durable states for instrument findings" is a coinage — a cure isn't a state.

- Before: "...is a true positive about **analysability**, and only source-shape cures are durable states for instrument findings. Dismissal is doubly non-durable: the safety stays invisible to every future scan, and positional alert identity makes suppression a recurring tax — the same alerts return under new numbers on rewrite."
- After: "...is a true positive about **analysability**. Only a fix at the source durably resolves an instrument finding. Dismissal fails twice over: the safety stays invisible to every future scan, and because alerts are identified by position, a rewrite brings the same alerts back under new numbers — so suppression is a recurring tax, not a one-off."

**F5 — Lines 100–102: the hardest constraint sits at the deepest nesting.**
Three levels of subordination — parenthesis containing a semicolon containing an em-dash — and the prohibition that most needs to be seen ("never via git checkout/restore") is at the innermost, rightmost position.

- Before: "Apply it as a temporary forward file edit from a driver script that holds the original text (string-replace with a matched-needle assertion; restore by writing the original back — never via git checkout/restore)."
- After: "Apply it as a temporary forward file edit from a driver script that holds the original text: string-replace with a matched-needle assertion, then restore by writing the original text back. Never restore via git checkout or git restore."

**F6 — Lines 134–140: the section's most binding sentence is last, inside a 21-line paragraph.**
"the mutation score is evidence, never a gate — no threshold gates anything (owner doctrine 2026-08-05, binding...)" is owner doctrine, and it arrives after a semicolon at the end of a paragraph that has already covered wiring, first workspace, Stryker's role, extension instructions, and a config-discovery gotcha. A reader who stops early — and at line 134 of a paragraph many will — misses the binding constraint entirely. Split the paragraph at "Two boundaries keep the modes honest" and give the no-gate ruling its own sentence at the head of that split.

**F7 — Lines 366–375: the document's hardest sentence to parse.**
- Before: "...asserting a specific markdown sentence shape across files precisely constrains markdown implementation rather than documentation behaviour and shifts maintenance cost without paying for it."
- After: "...a test that asserts a specific markdown sentence across files pins the wording rather than the outcome, and every later rewording then costs a test edit for no gain."
The abstraction pair "implementation rather than behaviour" is doing real conceptual work but gives the reader nothing concrete to hold; naming the actual cost (a test edit per rewording) makes the same point in fewer words.

**F8 — Lines 41–47: four instructions in one seven-line paragraph.**
The lead sentence is strong ("An enforcement-scope gap is not a requirement gap"). The closing sentence then stacks three separate directives behind an em-dash and a parenthesis, and ends on a four-modifier noun phrase.

- Before: "A missing or narrowly-scoped binding is itself a defect — flag it and prefer the structural cure (extend the enforcement), and never read an inherited non-conforming local convention as ratified exemption."
- After: "A missing or narrowly-scoped binding is itself a defect. Flag it, and cure it structurally by extending the enforcement. Inheriting code that does not conform is never evidence that an exemption was granted."

**F9 — Lines 190–192: the body restates the label verbatim.**
- Before: "**Explicitly handle both success and error cases** - All functions must handle both success and error cases, i.e. use the Result type."
- After: "**Handle success and error cases explicitly** — use the `Result` type."
Twelve words carrying zero information beyond the bold label. Same pattern, milder, at lines 63–67, where "Custom lint rules... encode architectural decisions as enforceable checks" and "These turn ADRs into automated enforcement" make the same claim in consecutive sentences; cut the second.

**F10 — Lines 281–284: nominalisation hides the actor.**
- Before: "After any major rewrite or re-architecture, validation against the real system is non-negotiable before wiring into consumers."
- After: "After any major rewrite or re-architecture, validate against the real system before wiring anything into consumers."
Same shape at line 18: "The quality gates must be run after all major changes, and before each commit" → "Run the quality gates after every major change and before every commit."

**F11 — Lines 260–262: genuinely ambiguous for a reader acting under it.**
- Current: "**Progressive ESLint re-enablement** - When a pre-existing override exists in a file you touch, fix the root cause. Narrow directory-wide overrides to file-specific first."
"first" gives no referent, so the reader cannot tell whether narrowing *substitutes* for the root-cause fix or *precedes* it — and those are very different permissions. Whichever is meant needs stating: "Fix the root cause. Where a directory-wide override blocks that, narrow it to the specific file as a step toward removal, never as the resting state."

**F12 — Lines 263–266: estate jargon and a misplaced "only".**
"The same lane must name the promotion point" — "lane" is internal vocabulary a reader outside the estate won't hold. And "may start at `warn` only while its violation surface is being designed" reads two ways (may-only-start vs only-while).

- After: "A brand-new custom ESLint rule may sit at `warn` while its violation surface is designed and triaged, and no longer. The work that introduces the rule must name the point at which it is promoted to `error`. Normal quality gates still require zero warnings."

**F13 — Lines 350–356: a cross-reference that depends on position, not identity.**
The `+`-connector bullet says "(previous bullet)", which silently breaks the moment anything is reordered or inserted. Name the rule instead: "(MD004, above)". This is craft, not structure — a reader following the reference today still has to count backwards to resolve it.

**F14 — Lines 14 and 49: the same absolute stated twice, differently scoped.**
"NEVER disable checks of any kind, ever." (14) and "NEVER disable any quality gates or Git hooks." (49). The second is narrower than the first, which invites the reading that the first was hyperbole and the second is the operative scope. Keep line 14 as the document's opening absolute and delete line 49, or make 49 a pointer rather than a restatement.

**F15 — Line 415 breaches the document's own `fitness_line_length: 100`** at 121 characters (the inline ADR-168 link). Mechanical, but it is the only line over.

## Register drift

**Where the register is right.** The bulk of the document is doctrine stated in short imperative sentences with worked failure-modes attached — the correct register for a governance doc, and several passages are genuinely excellent writing (see below).

**Where it drifts.**

- **Lines 338–359 (markdownlint gotchas)** — 22 lines of tooling troubleshooting sitting inside a doctrine list. The register here is manual-page ("Fenced code blocks without language specifier fail markdownlint MD040", "A bare `|` inside a table cell breaks MD056 column counting"), not doctrine. It reads as a different document that got pasted into this one, and the repo already has a precedent home for this register in `docs/governance/typescript-gotchas.md`. The prose isn't bad; it's in the wrong book.
- **Lines 120–133 (Stryker wiring)** — engineering-manual register: config filenames, auto-discovery rules, which fields to copy. The surrounding doctrine ("mutation score is evidence, never a gate") is a different kind of writing from "StrykerJS... auto-discovers only `json|js|mjs|cjs` config filenames".
- **Lines 114–118 (Worked instance, PR #846)** — narrative history where the sibling worked-instances carry teaching. Compare with lines 157–163, which end on a transferable rule ("Fix-first is the default disposition"), and lines 226–229, which end on the correct fix. This one names artefacts, a PR number, and a date, and stops — a future reader gets nothing they can act on without going to read PR #846. It needs one clause naming what the instance taught.
- **Lines 157–163** — right register, but delivered as a single six-line sentence carrying five alerts, a verbatim owner question, a 39-million-pair differential, and a conclusion. Split it; the content is strong enough to deserve reading.

## On length — does the prose earn it?

The file is 426 lines against `fitness_line_limit: 280`, and 22,040 characters against `fitness_char_limit: 16000`. Examining rather than curing, as directed:

**Mostly, yes.** The density is real. The gate taxonomy (61–80), §Analysability (149–163), §Coordination Topology (240–249), the discoverable-AND-actionable bullet (314–319), §Terminology (400–405), and §Code That Generates Code (407–420) are all compressed rather than padded — every one of them would get longer, not shorter, if written more plainly. The document is not verbose; it is *crowded*, which is a different failure and has a different cure.

**Craft-recoverable slack: roughly 40–60 lines,** concentrated in the redundant restatements (F9, F14, the layer-3 double claim), the nominalisations (F10), and the un-nesting of parentheticals — which mostly trades width for line count rather than saving much. That is not enough to reach 280, and chasing it would start eating substance, which the document itself forbids at line 376: *"NEVER compress docs to meet line limits — split files by responsibility instead."*

**The honest seams are the two register-mismatched clusters,** not the doctrine: markdownlint gotchas (~22 lines) and Stryker tooling detail (~21 lines). Both are split-by-responsibility moves — exactly what the frontmatter's `split_strategy` prescribes — and both would leave the doctrine *more* readable, not thinner. That is a structural recommendation and belongs to the docs reviewer; I raise it here only because the register mismatch is what makes those passages read as padding when they are not.

**The one place length is unearned as prose** is the mutation-testing provenance paragraph (84–90). Nine lines establish which of three documents owns which half of the method before the reader reaches a single instruction. The chain — "stated as binding doctrine in `testing-strategy.md`... whose declared formal home for mutation testing is `validation-strategy.md`; this section is the repo-bound elaboration" — asks the reader to hold three documents and two ownership relations as a *precondition* for the content. Two sentences do the same work: "This section carries the repo-bound tooling wiring and worked instances. The portable method lives in `validation-strategy.md`; `testing-strategy.md` states the hand-picked discipline as binding doctrine." Better still, move it below the method, where a reader who needs it will look for it.

## What is working — protect it in any rewrite

Several passages are model sentences for this register and should survive synthesis untouched:

- Line 166: "Fix the problem named by a gate; do not silence the signal that names it." The best sentence in the document.
- Line 71: "Linting enforces *what you should do*; static analysis detects *what you forgot to clean up*."
- Lines 326–327: "Frontmatter is easy to keep in sync; prose is where stale truth hides."
- Lines 318–319: "A plan that meets one criterion but not the other is drift — readers either cannot find it or cannot execute it."
- Lines 248–249: "When tempted to simplify with 'currently we run one checkout', that framing is the tripwire to re-ground, not a licence."
- Lines 83–84: "Both answer the same question — would this test suite notice if the code stopped doing what it claims?"

Each does the same thing: states the rule, then names the consequence of breaking it, in one breath. That is the document's native voice, and the weaker passages are weak precisely where they drift away from it.

## Coordination

- **To `docs-adr-expert`:** the `**Last Updated**: 2026-07-04` stamp (line 11) is stale — the document carries content dated 2026-08-13 (line 114), 2026-08 (line 125), and owner doctrine of 2026-08-05 (line 139). Also for that reviewer: the two split seams identified above, and the `docs/governance/` gap in `editorial-tone.md`'s exclusion enumeration.
- **To `accessibility-expert`:** no plain-language finding here is a WCAG 3.1 conformance ruling. The jargon findings (S3, F4, F12) are craft recommendations; if any of them are wanted as conformance verdicts, that verdict is theirs to issue, not mine.
- **Layer B was deliberately not applied.** No contraction, "you"-flip, or teacher-protagonist finding appears above. If the synthesis receives one from another source for this file, it is out of scope for this document class.
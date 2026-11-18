# Napkin decision table (reducer pass, 2026-09-25)

Reducer: Blaze seeks Shimmer (23f6b9), read-only on the repository.

**Inputs.** Nine analyses, `napkin-analysis-1.md` to `napkin-analysis-9.md`, cited below as a1 to a9. They
cover the frozen snapshot `napkin-snapshot.md` (1,495 lines). Every line number below is a SNAPSHOT line.
The analysts read the repository at HEAD `9df064b80` on `coordination/2026-09-24-f66fd0`. Some also
read `origin/engraph`; those reads are marked.

**Totals.** 333 items across the nine analyses.

- A: 113 rows (175 items).
- B: 77 rows (87 items).
- C: 26 owner quotations, plus the owner rulings that are named but not quoted.
- D: 66 items.
- Not placed in A, B or D: 5 items that no analyst checked (discarded associations and play seeds; see E.7).

**Placement rules.**

- **A** takes every item whose Check reported the item's own substance absent from the homes searched.
  - This includes items where only a neighbouring or general form was found. Their Check column says
    what was found.
  - A also takes L1192, whose claimed landing the analyst could not find, and L1483-1486, whose claim
    that "the protocol already says" it the analyst found false.
  - Where a group mixes present and absent members, the row sits in A and names the present member.
- **B** takes items whose Check found the item's substance present.
- **D** takes the handoff-state and metaloss items, whatever their Check. The one exception is L1192,
  which sits in A.
- **Reducer checks.** Two checks were run on the repository to settle disagreements between analyses
  (see E.2, items 1 and 2). Nothing else was opened.

**Seat key.**

| Short name | Seat | Session id |
| --- | --- | --- |
| Zephyr | Zephyr guards Leeward | 281e44 |
| Dynamo | Dynamo turns Temper | 2a4c8a |
| Blazar | Blazar lifts Corona | b65a9a |
| Swallow | Swallow holds Drift | 516619 |
| Marten | Marten mends Shadow | 74fc02 |

**Path key.** Section A uses these short names. Section B keeps the analysts' full paths.

| Short name | Repository path |
| --- | --- |
| `pr-lifecycle` | `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` |
| `commit skill` | `.agent/skills/change-custody/commit/SKILL-CANONICAL.md` |
| `consolidate-until-done` | `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md` |
| `consolidate-docs` | `.agent/skills/knowledge/consolidate-docs/SKILL-CANONICAL.md` |
| `coordination-fold` | `.agent/skills/coordination-fold/SKILL-CANONICAL.md` |
| `set-up-worktree-lane` | `.agent/skills/set-up-worktree-lane/SKILL-CANONICAL.md` |
| `wrap` | `.agent/skills/wrap/SKILL-CANONICAL.md` |
| `cricket` | `.agent/skills/cognition/cricket/SKILL-CANONICAL.md` |
| `start-right-team` | `.agent/skills/start-right-team/SKILL-CANONICAL.md` |
| `start-right.md` | `.agent/skills/start-right-quick/shared/start-right.md` |
| `session-handoff` | `.agent/skills/session-handoff/SKILL-CANONICAL.md` |
| `comms-channels` | `.agent/skills/comms-channels/SKILL-CANONICAL.md` |
| a rule name | `.agent/rules/<name>.md` |
| a pattern name | `.agent/memory/active/patterns/<name>.md` |
| a directive name | `.agent/directives/<name>.md` |
| PDR-nnn | `.agent/practice-core/decision-records/PDR-nnn-*.md` |
| `register` | `.agent/memory/operational/frictions-register.md` |
| `ledger` | `.agent/memory/operational/review-cost-ledger.md` |
| `repo-continuity` | `.agent/memory/operational/repo-continuity.md` |
| `continuity record` | `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md` |
| `estate record` | `.agent/memory/operational/threads/estate-coordination.next-session.md` |
| `codex-dialogues record` | `.agent/memory/operational/threads/codex-dialogues.next-session.md` |
| `node` | `.agent/plans/delivery/the-codex-dialogues-exec-binding.plan.md` |
| `wake-bridge plan` | `.agent/plans/delivery/codex-queue-wake-bridge.plan.md` |
| `channel 09-21` | `.agent/collaboration/rapid-comms/2026-09-21-three-estate-practice-exchange-brazier-spins-temper-and-zephyr-guards-leeward.md` |
| `ARC protocol` | `.agent/reference/arc-rapid-communication.md` |
| `retrospective 09-24` | `.agent/reports/agentic-engineering/2026-09-24-records-that-outrun-their-evidence-retrospective.md` |
| `seat-instruments report` | `.agent/reports/agentic-engineering/seat-instruments-zephyr-guards-leeward-2026-09-23.md` |
| `loop report (working seat)` | `.agent/reports/agentic-engineering/context-loop-experiment-working-seat-2026-09-19.md` |
| `loop report (Dynamo)` | `.agent/reports/agentic-engineering/context-loop-experiment-dynamo-turns-temper-2026-09-19.md` |
| `research note` | `.agent/research/agentic-engineering/codex-support-concept-exploration-2026-09-23.md` |
| `policy.json` | `.agent/hooks/policy.json` |

---

## A. Candidate moves (home check ABSENT, or landing NOT verified)

| # | Snapshot lines | Seat | Class | Substance (cure verbatim where stated) | Home the entry names | Analyst's search phrase and where it looked | Most plausible home(s) from the analyst's notes | Analysis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | 25-27 | Zephyr | owner-word | The owner's order that rotated the napkin (2026-09-20), verbatim: "you are supposed to analyse the buffers, preserve the knowledge, then analyse and preserve the knowledge in the oversized memory files, nothing else". | none | "oversized memory files" in `consolidate-until-done` and `continuity-practice.md`: absent. | `consolidate-until-done` step 7, which already carries two other owner quotations from 2026-09-20, at :134 and :145. | a1 |
| A2 | 52-54 | Zephyr | tool-gap | "The watermark is not advanced and no archive move has run, because the substantive-event mover is still unhomed, as at the four rotations before." | none | "substantive-event mover" and "event mover" in directives, skills, rules, operational memory, threads and `agent-tools/src`: absent. The same sentence recurs at `archive/napkin-2026-09-19.md:37`. | `consolidate-docs` watermark gate (:461, PDR-094). | a1 |
| A3 | 71-75; 711-713; 1322-1326; 1353-1355 | Dynamo; Zephyr; Swallow; Swallow | observation; observation; lesson; lesson | Several PRs settling at once under the strict up-to-date base cost sync rounds. L74-75: "Land in the order the checks finish, and open the next lane's PR only when the queue is short, or accept the rounds." L711-713: "The one-at-a-time contract is a convention with no instrument." L1322-1326: "The slot follows readiness, not a queue order written earlier. A draft is not in the queue until its legs can bind." L1353-1355: "A landing slot needs a named keeper, not just a next PR." | none in any of the four | **a1:** "queue is short", "order the checks finish", "sync rounds" and "strict up-to-date" in `pr-lifecycle` and `design-work-for-small-prs`: absent. a1 concludes there is "no multi-PR queue-ordering clause". **a5:** "slot" near "instrument", "mechanis" or "enforce" in `pr-lifecycle`, the register and rules: no instrument found; the landing-slot contract is at `pr-lifecycle`:1667 and :1678-1681. **a9:** "follows readiness", "legs can bind", "named keeper" and "keeper": absent; related text at `pr-lifecycle`:1678 and :1687-1689. | The landing-slot section of `pr-lifecycle` (:1667-1689). The cost itself is already homed at PDR-131:53 (B64). a1 and a5 disagree (E.2, item 1). | a1, a5, a9 |
| A4 | 76-78 | Dynamo | tool-gap | "the workspace census `check` failed on `engraph` at `93c35f285` (20 stale facts entries) and is in no gate; its facts count files under `.agent/`, so any commit there stales it." | "recorded on #163's description". Verified: #163 body line 17; census plan :224. | "workspace census" and "stale facts" in the `register`: the structural point is absent. | `register` | a1 |
| A5 | 79-85; 937-942 | Dynamo; Blazar | tool-gap; tool-gap | Literal hook patterns fire on tokens outside the command they guard. **L79-85:** `git add .` matches a dot-directory pathspec. Workaround: "`git commit --include -F msg -- <paths>`". "Friction for the hook's author: anchor the pattern at a word boundary or the argument's end (`git add .` alone, `git add .$`)." **L937-942:** "The matcher fires on words scattered across a heredoc body, not on the command." | L79-85: "Friction for the hook's author" (no id). L937-942: "the hook policy's owner, under `hook-policy-substring-discipline`". | **a1:** "commit --include", "dot-directory" and "word boundary" in `hook-policy-substring-discipline`, the `register`, the `commit skill` and `stage-by-explicit-pathspec`: absent. The pattern is still unanchored at `policy.json`:117. **a7:** "comms send" and "2026-09-24" in the rule: absent. `policy.json`:50 is a literal. An argv match kind exists in code (`dfbdbdeb8`, `argv-tables-git.ts`), but `policy.json` carries no `argv` kind. | `hook-policy-substring-discipline` (siblings at :126-127 and :134-141); an `argv` entry in `policy.json`. | a1, a7 |
| A6 | 86-91 | Dynamo | correction | "A consult is a reading, not the directive: when a consult licenses something the directive names absolutely, read the directive's sentence before acting." | none. The entry cites `testing-strategy.md` §Tests never use IO as the directive overlooked, not as a home. | "consult is a reading", "consult licenses" and "read the directive's sentence" in `invoke-code-experts` (the rule and executive memory), `precedence-is-not-approval` and directives: absent. | `invoke-code-experts`. The absolute sentence is at `testing-strategy.md`:39-44. | a1 |
| A7 | 96-100 | Dynamo | correction | #167 opened with cures its tip lacked. Cure: "Chain edits to commits with `&&`, print a sentinel from the script, and read a task's output for `Traceback` before trusting it." | none | "Traceback", "print a sentinel" and "UNEDITED" in `exit-codes-in-band-never-piped`, rules, skills and directives: absent. | `exit-codes-in-band-never-piped` (general form at :27-29). | a1 |
| A8 | 101-104 | Dynamo | observation (play seed) | "a measurement stored inside the measured thing stales itself … and reaches a fixed point only by iterating". | none | "stales itself", "measured thing" and "inside the measured" in patterns, rules, directives and `distilled.md`: absent. | none named | a1 |
| A9 | 104-106 | Dynamo | observation (play seed) | "the rule to measure vendor call shapes at plan time existed and the D8 plan still recommended a shape gh refuses (`--slurp` with `--jq`); the measurement happened at implementation". | none. It implicitly cites `verify-vendor-call-shapes-at-plan-author-time`. | "--slurp" in the rule file: the instance is absent. "D8" was not found in the carrier plan. The analyst reads "D8" as §D item 8 of the carried-code-findings report (:258-265); that reading is an inference. | `verify-vendor-call-shapes-at-plan-author-time`, as a worked instance. | a1 |
| A10 | 117-119; 133-137 (and the re-emission half of 169-172) | Zephyr | observation; lesson | The split method cost "about 25 % of context for five curations, most of it the analyses and the re-emitted kept text". "a curation's cost has two parts, reading (paid by analysts) and re-emitting (paid by the seat), and the method halves only the first." Cure: "the only lever is choosing Write when kept < removed and Edit otherwise." | none | "re-emit", "Write when" and "kept < removed" in `consolidate-until-done` and `continuity-practice.md`: absent. A near form exists only in an untracked handoff record. | `consolidate-until-done` step 7 (the split method is at :132). | a2 |
| A11 | 121-123 | Zephyr | mistake | "two ceremonies lost the `.git/index.lock` race to a periodic git process on the primary — the register already names the class, and the cure was to run the ceremony alone." | "the register" | "ceremony alone", and "periodic" with "index.lock", in the `commit skill` and the `register`: absent. The only live index.lock line is F-195, whose cause is the fsmonitor socket, not a periodic process. | `register` (F-195 is a weak match); `commit skill`:563. | a2 |
| A12 | 123-126; 142-144 | Zephyr | tool-gap; observation | "The identity-naming ratchet refused a byte-identical archive because the census keys occurrences by path; … the same cure (re-point the row), which the commit skill's archive step could state." The census re-point "is the only archive-time step the lifecycle text does not name". | Candidates: the commit skill's archive step; `continuity-practice.md` §Disposition. | "census" and "identity-naming" in the `commit skill`: absent, and the skill has no archive step as such. "census" in `continuity-practice.md`: zero hits. | `consolidate-docs`:338 already has "identity-naming census rows" in the move pre-flight; `continuity-practice.md` §Disposition. | a2 |
| A13 | 129-131 | Zephyr | lesson | "the join between a lane's record and its plan is where the record's "next step" lives on, so a curated record points at the plan and never restates the sequence." | none | "restates the sequence", "restate the sequence" and "never restates" in `continuity-practice.md` and `consolidate-until-done`: absent. | `continuity-practice.md`; the general SSOT form is at ADR-127:54. | a2 |
| A14 | 131-132; 242-243 | Zephyr | decision (two rejections) | Discarded: a generic "paused records archive by default" rule ("two of seven were live"). Discarded: the door's "names no reviewed commit" on a quota notice as a new `signal-read-as-fact` instance ("forced; the door read the signal correctly and refused"). | none; `signal-read-as-fact` (declined) | "archive by default": absent as a rule, and consistent with `continuity-practice.md`:6 "leave-if-live". "quota" and "names no reviewed commit" in `signal-read-as-fact.md`: no such instance (n = 2). | Nothing to move: both are rejections consistent with existing text. | a2 |
| A15 | 164-169; 173-176; 180-186; 209-214; 228-229 | Zephyr | lesson; lesson; prediction; observation; lesson | What counts as a result when curating a large file. "the split method's per-section STATE column turned out to be the cheapest instrument for the lifecycle's first question". ""appropriate handling" has three outcomes, not one — curated, left live with the verdict recorded, or found homed elsewhere and archived whole". "a large memory file is "handled" when a seat has answered the lifecycle's question for every section and left a proof" (a falsifier is given). "a verdict of "left live" is as much a result as a curation". ""left live" is a verdict with a proof, not a deferral". | none. L180-186 names "the brief's STATE rule", which is a scratchpad file. | Searched in `continuity-practice.md`, `consolidate-until-done`, rules and skills, all absent: "STATE column", "one cheap question", "appropriate handling", "three outcomes", "handled", "left live" with "verdict", "verdict with a proof". Present: the lifecycle question at `continuity-practice.md`:121; the status column at `consolidate-until-done`:136; the proof at `continuity-practice.md`:104; verify-at-source at `consolidate-until-done`:140. | The `continuity-practice.md` lifecycle; `consolidate-until-done` step 7. | a2 |
| A16 | 169-172 | Zephyr | lesson | "The mistake shape both times was treating a rule's letter as its reason — the freeze order and the "read whole" obligation — and the owner's two corrections today were both the reason restated." | none | "letter as its reason" and "rule's letter": absent; the nearest is PDR-057:212. Both specific cures are present, at `consolidate-until-done`:149 and `continuity-practice.md`:124. | none named beyond the nearest (PDR-057). | a2 |
| A17 | 176-177 | Zephyr | observation | "the fitness signal's line-width criticals are all in records already left live or curated; that signal is now noise for this job." | none | "line-width": absent. The principle is at `consolidate-until-done`:8 and ADR-144:34. | `consolidate-until-done` | a2 |
| A18 | 188-190 | Dynamo | lesson ("a rule candidate") | "the `pr view --json` projection is the state, never the evidence — a merge verdict reads the paginated connection (three instances: `latestReviews`, commits bounded at 100, the comments' edit flag)". | none | "never the evidence" and "paginated connection": absent. Nearest: `pr-lifecycle`:787-788 and `pr-monitor-to-merge.md`:23. | `pr-lifecycle`; the pattern `pr-monitor-to-merge`. | a2 |
| A19 | 190-191 | Dynamo | lesson | "an UNSUPPORTED claim on a precondition blocks the push until verified live (row 20 predicted Copilot's round-two finding on #168)". | none | "UNSUPPORTED" and "row 20" in `pr-lifecycle`, the `estate record` and Dynamo's reports: absent. "row 20" is unresolved. | `pr-lifecycle` | a2 |
| A20 | 191-193; 865-872; 1186-1187 | Dynamo; Blazar; Swallow | observation; tool-gap; decision | The merge door does not read the Codex connector's clean-review transports. **L191-193:** "the connector edits its summary comments and never its clean ones (63 / 0 of 28) — count edited clean comments in the cost survey". **L865-872:** because the door refuses with UNCLASSIFIED-EVIDENCE, "the documented cure, a fresh `@codex review`, spends a second review on an already-reviewed tip". Cure: "Read the summary comment's commit and status cell, or the reaction, as a third transport, under the owner's 2026-09-16 comment-evidence ruling." **L1186-1187:** "check whether merge-bot classifies Codex's clean-review comment form (F-198 precedent)". | "the cost survey"; "the merge-bot's owner"; merge-bot and F-198. | **a2:** "edited clean" in the `ledger` and `pr-lifecycle`: absent. F-198 is present at `register`:3945. **a6:** "reaction", "status cell" and "review-summary" in `agent-tools/src/pr-watch/` non-test files, on HEAD and on `origin/engraph`: absent. The refusals are at `completion-comments.ts`:52-53. **a8:** F-198 is present at :3945, routed as "a merge-bot candidate". | F-198 at `register`:3945 (a6 does not cite it); `agent-tools` pr-watch. | a2, a6, a8 |
| A21 | 193-195 | Dynamo | tool-gap | "the context check should say "unreadable", not "compacted", when the transcript cannot be read." | "the context check" | The cure landed only in the untracked `.agent/state/collaboration/handoffs/instruments-2a4c8a/context-usage-check.py` (:23, :38). It is recorded in the tracked `loop report (Dynamo)` (:251, :261-262). No tracked instrument prints "compacted". | No tracked tooling home identified; the report is the only tracked record. | a2 |
| A22 | 196-198; 240-242 | Dynamo; Zephyr | lesson; observation | "a seat that cannot trigger its own compaction stops three times at the same mark if each stop is a report — the report reads as an end to its writer." Cure: "The cure is a named next piece of loss-tolerant work, never "continue"." L240-242 associates it with Zephyr's "seven one-line answers to the Stop hook". | none | "loss-tolerant", "reads as an end" and "named next piece" in rules, skills and `consolidate-until-done`: absent. Present only in the `loop report (Dynamo)` (:255-256). "both sides of the table": absent. | none named. The report is the only home. | a2 |
| A23 | 214-216; 454-456; 457-458; 630-634 | Zephyr ×4 | observation; surprise; lesson; surprise | The commit ceremony's staged set emptied, with the cause unknown, on three dates. **2026-09-20:** "a ceremony run lost its staging before the guard … with no lock file involved". **2026-09-21 (recorded 09-23):** "The commit tool read an empty staged set seconds after `git add` had filled it, twice". **2026-09-23:** three runs "each ended with the index empty, although `record-staged` makes no index-writing git call … a concurrent writer to the shared index is the untested candidate". Lesson: "A tool that refuses with "staged files do not match" is reporting what IT read, which the queue's own record keeps (`staged_name_status`); read that before touching the index." | none | **a2:** "lost its staging" and "staged set did not match": absent; near forms at `harness-shell-and-commit-edge-cases.md`:116-121. **a4:** "staged_name_status" and "staged files do not match" in the `commit skill`, the harness pattern, rules, skills, directives, PDRs, patterns, `distilled.md` and docs: absent. Present only at `repo-continuity`:648 and :650-653. Related: F-138 (:2714). **a5:** "record-staged", "index empty" and "concurrent writer" in the `register`: absent. The trace instrument is conserved in the `seat-instruments report` (:23, :62). | `register` (a new entry, or F-138); `commit skill`; `harness-shell-and-commit-edge-cases`. | a2, a4, a5 |
| A24 | 233-235 | Zephyr | observation | "The reliability rung for "all findings of the WS-8 synthesis are in ADR-187": interpretation from phrase hits, not a clause-by-clause read; recorded as such." | "recorded as such" (the place is not named) | "reliability rung": absent. The commit message of `a7c3035e5` says "each checked there by phrase". | none named | a2 |
| A25 | 236-240 | Zephyr | observation (play seed) | "the paused records read as strata — each "READ FIRST" banner a newer layer over the last … (a play seed for the paused-record brief: name the strata)." | "the paused-record brief" (a scratchpad file) | "stratigraph" and "strata": absent. PDR-134's "knowledge strata" is a different concept. The newest-first sentence exists only in an untracked handoff record. | The tracked equivalent of the brief's STATE rule is `consolidate-until-done`:136. | a2 |
| A26 | 248-250 | Zephyr | observation (open question) | "Unresolved evidence: whether the door's SKIPPED reading of Copilot at 21:37Z (checks green while the PR was still a draft) would have bound a review had the undraft come before the checks." | none | "21:37" and "SKIPPED" in the `estate record`, the `ledger` and the `register`: absent. | none named | a2 |
| A27 | 262-264; 443-444; 787-791; 1225-1228; 1416-1423 | Zephyr; Zephyr; Blazar; Swallow; Marten | lesson ×5 | Each wrap's external bound names where outside scrutiny should point. **L262-264:** "point outside eyes at the curated records' "where the current state is" sections." **L443-444:** "point outside eyes at any negative it reports, any count it states, any verdict that favours it, and any frame two seats both like." **L787-791:** "Point external scrutiny at verdict and validator code first." **L1225-1228:** "Point external scrutiny at each write's credential, each relayed number, and each wait's sensor." **L1416-1423:** "Point outside scrutiny at descriptor lifetimes and file races." | none | **a2:** "outside eyes": absent. **a3:** "error signature" and "outside eyes" in rules, directives, skills, PDRs, patterns and docs: absent. **a6:** "verdict and validator": absent; the general form is at `wrap`:144-145. **a8:** "external scrutiny" and "each wait's sensor": absent. **a9:** "descriptor lifetime", "file races" and "fchmod": absent; the findings are named in the `ledger` (:115-121). | `wrap` external-bound step (:139, :144-145). | a2, a3, a6, a8, a9 |
| A28 | 276-280 | Zephyr | lesson | Four finish-line corrections in one afternoon. The entry records a second instance of the metacognition directive's "fluency clusters at the finish line" (first worked instance 2026-07-06): "four in one afternoon, none self-caught." | "the metacognition directive" | "2026-09-21" in `metacognition.md`: zero matches. The directive text is present at :124-127. | `metacognition.md`, as a second worked instance. | a3 |
| A29 | 280-283 | Zephyr | observation (candidate structural cure) | "candidate: the merge door refuses without an attested deletion sweep on the tip (the same shape as the review-cost gate refusing without the recorded budget …). One instance of the candidate". A second instance of the sweep running after the merge is at L792-793 (B56). | "the merge door" | "attested" and "deletion sweep" in `pr-lifecycle` and `agent-tools/src/merge-bot/`: no refusal. The door prints a note only (`merge-cli.ts`:47-48). | `agent-tools` merge-bot; `pr-lifecycle`:1358. | a3 |
| A30 | 294-296 | Zephyr | lesson | "Without the bar the supply of true findings has no end, so no budget could hold. The generator answers recorded on each rebudget ('own review ran late') named a secondary cause and changed nothing about the next round." | none | "secondary cause" in `pr-lifecycle`: absent. The converse is at PDR-140:226-228. The generator is recorded at `ledger`:84. | `pr-lifecycle`; PDR-140. | a3 |
| A31 | 299-301 | Zephyr | observation | "Clause 8 applies: the owner invoked metacognition twice today to correct a running pull-request loop, which that clause files as a defect against pr-lifecycle, never a usage pattern." | PDR-140 clause 8 | "2026-09-21" within F-177's block (`register`:3562-3607): absent. The clause is at PDR-140:196-204 and `pr-lifecycle`:713-716. | F-177, as a 2026-09-21 instance. | a3 |
| A32 | 300-302 | Zephyr | observation (candidate structural cure) | "Candidate structural cure, one instance: the thread-reply instrument refuses a reply that carries no bar marker." See also L425-428 (B39). | "the thread-reply instrument" (a scratchpad script at the time) | "bar marker" and "Over-bar" in `agent-tools/src`: no refusing reply tool (`pr-tally/markers.ts` counts only). The script's bytes are conserved "as a record, not tooling" in the `seat-instruments report` (:5, :82-120). The lane is one "nobody holds" (`repo-continuity`:874-880). | `agent-tools`, as estate tooling. | a3 |
| A33 | 311-315; 316; 417-418 | Zephyr ×3 | lesson ×3 | A negative from a blind instrument reported as a conclusion. **L311-315:** "an instrument's zero-match taken as a fact about the subject … the friction (a 404 on a peer's precise identifier) was resolved against the peer instead of traced." **L316:** "Rule taken: a negative is reported as the instrument plus its blind spot, never as the conclusion." **L417-418:** "Counts, times and negatives are read from an instrument at the moment of writing, and a negative names the instrument's blind spot." Related: "a claim of absence names the moment of its read" (L497-507, A48). | none | "against the peer" and "instrument plus" in rules, directives, skills, PDRs, patterns and docs: absent. Present: the reliability ladder (`metacognition.md`:197); `zero-match-false-green.md`:72-78; `verify-dont-trust.md`:443; the time half at `verify-dont-trust.md`:730. | `zero-match-false-green` (its cure at :77-78); `verify-dont-trust`. | a3 |
| A34 | 316-319 | Zephyr | observation (candidate structural cure) | "Candidate structural cure, not yet built: the dependency gates read repository advisories for resolved direct and transitive versions, since three standard instruments share one blind spot." | "the dependency gates" | "repository advisor" and "security-advisories" in `update-dependencies`, `dependency-currency`, rules and `docs/engineering`: absent. Recorded as owed at `repo-continuity`:864-865 and :920-921. | `update-dependencies` skill (:19-20, :56). | a3 |
| A35 | 327-331; 331-333 | Zephyr | lesson; decision (candidates, "none acted on") | "The generator is duplication: the same volatile fact … is hand-restated in the pickup, the board, the Director handoff, the ledger and the journal." Cure: "The metacognition directive's cure shape applies: make the restatement derived or absent." Candidates: "the landed inventory names no pull requests and points at the merge log; the pickup points at pull requests by number and states no status for them; one surface owns each volatile fact and the others link." | "The metacognition directive's cure shape"; the landed inventory; the pickup. | "derived or absent": absent. "landed inventory" and "merge log" in `repo-continuity`: the first candidate is absent. The second candidate is present (:898-899) and the third in part (:893). The generator is recorded at `ledger`:85, and again at :88 (#175, 2026-09-23). | `continuity-practice.md`:230-233 (volatile facts); `metacognition.md`:181-188. | a3 |
| A36 | 346-348; 386-390; 812-817 | Zephyr ×3 | lesson; observation; mistake | A claim stated as a category over an enumeration. **L346-348:** "both are a claim stated as a category over an implementation that is an enumeration. The frequency reason appeared only once the budget was spent, which is the mark of a budget deciding a verdict." **L386-390:** "A category cannot be diffed … whatever must stay IDENTICAL has to be an enumeration (bytes)". **L812-817:** "write set claims as per-member checks (hashes), never as category words." The entry calls this "A second instance of #174's "categories over an enumeration" generator." | none | **a3:** "budget deciding" and "category over" in rules, directives, skills and patterns: absent. "cannot be diffed": absent; the "concepts travel, never bytes" wording the entry cites has since been amended (PDR-142:144-152). **a6:** "per-member", "category word" and "categories over an enumeration": absent; the phrase appears only at napkin:817. | Proposal 1 of `retrospective 09-24` ("Generate the cross-estate parity table", :123). The generator is recorded at `ledger`:86. | a3, a6 |
| A37 | 355-357; 410-411 | Zephyr | lesson; prediction | "The habit taken: when a verdict and an empty budget point the same way, the verdict gets an outside check before it is posted, and the reply states the earlier verdict's error plainly." And: "(1) when a verdict coincides with this seat's interest (a budget, convenience, its own earlier position), one outside check before it is posted; falsifier: three such checks running that merely confirm." | none | "empty budget", "outside check" and "coincides with" in rules, directives, skills, PDRs, patterns and docs: absent. | `agent-collaboration.md`:290-294 (the nearest). | a3 |
| A38 | 382-385 | Zephyr | observation (play harvest, kept) | "'Two writers, one surface'" at three scales. "Each settled the same way, by making one writer own the bytes." | none | "two writers" in rules, directives, PDRs and patterns: absent. Nearest: `timing-derived-state-is-the-defect.md`:68 ("one writer per path"); PDR-142:114-116. | `timing-derived-state-is-the-defect` | a3 |
| A39 | 391-393 | Zephyr | owner-word | The owner wrote off thirteen PRs because "identifying the value in the older work was far more expensive than fresh development". "Our five outcomes have no 'replace wholesale'. It may be the sixth, at estate scale, for the lagging estate." | none | "wholesale" and "far more expensive than fresh" in PDR-142 and `best-of-each-practice.plan.md`: absent. The five outcomes are at `channel 09-21`:412. | PDR-142; the best-of-each-practice plan. | a3 |
| A40 | 394-395 | Zephyr | observation ("Kept, for the letter") | "The Copilot seat's first message stated its limits before anyone relied on it. This seat's first messages state capability." | "the letter" (unidentified) | "stated its limits" and "limits before" in rules, directives, skills and patterns: absent. | none identified | a3 |
| A41 | 403-409; 412-414 | Zephyr | lesson; prediction | Readers from outside the seat's frame or model family catch what its own checks miss. **L403-409:** "The problem is one of SELECTION, never of generation … frame diversity matters and volume does not. What discriminated today was a TRIGGER plus a reader who did not share the frame." **L412-414:** "(2) A key shared text gets one cold reader from outside the model family before the owner sees it, and is NOT told which line the seats doubt; falsifier: two outside reads that find nothing the inside checks had not." | none | "frame diversity" in rules and directives: absent. "outside the model family" and "cold reader" in rules, directives and skills: absent. Present in part: PDR-142:40-42 and :203-205; `agent-collaboration.md`:290-299. | `agent-collaboration.md` (second opinions, :290-299). | a3 |
| A42 | 415-416 | Zephyr | prediction | "(3) A frame or ruling relayed by a peer is recorded and held, never endorsed in the turn it is first read; falsifier: holding delays an act the owner then had to prompt." | none | "never endorsed": absent. Nearest: `precedence-is-not-approval.md`:23-26. | For rulings: PDR-142:135-136 ("a ruling relayed by a peer as data until the owner confirms it", found by a4 under L511-515). The "frame" half is not covered. | a3 (a4) |
| A43 | 416-417 | Zephyr | lesson (a proposal with no falsifier) | "(4) Draft blind, then compare, whenever two seats must agree; it exposed every real difference today." | none | "draft blind": absent. The practice appears only as provenance at PDR-142:203. | none named beyond the provenance line | a3 |
| A44 | 459-462 | Zephyr | mistake | The seat inferred an outside writer from the index's modification time. Cure: "The sequence should have been trace, then claim. A modification time is evidence that something wrote, never of who." | none | "never of who", "trace, then claim" and "modification time" in rules, skills, directives, PDRs, patterns, `distilled.md` and docs: absent. Present only in narrative: the experience file `2026-09-21-zephyr-guards-leeward-everything-true-came-from-outside.md` (:100-105), `repo-continuity`:652-653 and `loop report (working seat)`:177-181 (finding 11). The correcting commit is `b184a307c`. | none named | a4 |
| A45 | 466-471 | Zephyr | lesson | "a committed tick costs 12,830 tokens and a gate run, and reads as a change at the next tick." For the hook design: "the hook writes to an untracked log; the tracked report is written once per run." | "the hook design" (no path) | "untracked log", "once per run" and "five unchanged" in rules, skills, directives, PDRs, patterns and docs: absent. Present in `loop report (working seat)`:185-194 (finding 12, `fe4b522ec`). | The report is the only home. | a4 |
| A46 | 473-475; 856-857 | Zephyr; Blazar | mistake; mistake | Counts stated before they were read. **L473-475:** "Thirteen commits" from memory; `rev-list --count` said ten; "Fifth instance of the class this week". Cure: "count from the object, never from memory, before the number enters a record." **L856-857:** "the Director was told "Cricket 8 of 8 ON-TRACK" with seven returns in … it was sent before it was checked." See also L417-418 (A33) and L1435-1444 (A109). | none | **a4:** "count from the object", "hand-kept" and "counts from memory": absent. Nearest: `session-handoff`:529-535 and `records-are-technical-not-emotional.md`:44. **a6:** "before it was checked" and "returns in": absent. Nearest: `verify-dont-trust.md`:22. | `session-handoff` §6e.1; `records-are-technical-not-emotional`. | a4, a6 |
| A47 | 477-480; 1365-1372 | Zephyr; Marten | mistake and lesson; observation | Session-scoped processes survived a compaction, against the doctrine text. **L477-480:** "Two instances, opposite outcomes, cause unread … Verify by id after every boundary; assume neither way." **L1365-1372:** "the compaction did not end the monitors … The wrap skill says a compaction ends every session-scoped process. This instance contradicts it, for this harness build." "The rule in the skill still held: verify by id, re-arm only what is absent." | "the loop report" Finding 1 (L477-480); the wrap skill (L1365-1372). | **a4:** the cure is present at `liveness-heartbeat-cron.md`:435; "assume neither way": absent. The rule's :429-434 ("A compaction ends every session-scoped process", measured 2026-09-09) is contradicted. **a9:** the counter-observation is absent from `wrap`:61-62 and `liveness-heartbeat-cron.md`:429. Verify-by-id is present at `wrap`:68-70 and liveness :435-436. | Qualify the platform claim at `wrap`:61-62 and `liveness-heartbeat-cron.md`:429-434. | a4, a9 |
| A48 | 497-507; 506-507; 558-560; 1477-1482 | Zephyr ×3; Swallow | mistake; tool-gap; prediction; mistake | Writes to a shared channel race. **L497-507:** the wrap body was "appended nineteen seconds after the peer's entry landed, without a re-read". Cure: "an append to a shared channel re-reads the channel's last heading in the same breath as the write, and a claim of absence names the moment of its read." **L506-507 and L558-560 (P2):** "an expected-last-heading argument that refuses the append when the channel has moved since the author read it, a compare-and-swap on the file". Falsifier: "a missed entry the guard would not have caught." **L1477-1482:** a whole-file write replaced a partner's header. Cure: "open a shared channel by appending (`>>`), never by writing the whole file, whenever a partner is live and may open it too." | L558-560: "routed as a lane", but no lane was found. The others name none. | **a4:** `timing-artefact-read-as-state.md` has no channel instance ("channel", "absence", "heading"). "last heading", "claim of absence" and "moment of its read": absent. "expected-last-heading", "expected last heading" and "compare-and-swap": absent from `agent-tools/src` and the tracked tree. No plan carries the lane. **a9:** present at `ARC protocol`:159 and :161-162 (append-only; whole-file tools unsafe). The opening case is absent. | `timing-artefact-read-as-state`; `claim-before-check.md`:29-37; `ARC protocol`; `agent-tools` (the channel append). | a4, a9 |
| A49 | 517-519; 1111-1114; 1282-1283; 1453-1455 | Zephyr; Marten; Swallow; Marten | tool-gap ×4 | "`session-metadata` has no window registered for `claude-opus-5-5[1m]`; the reading used the 1M stand-in again." Four entries from three seats. L1453-1455 adds: "its records carried the command without the reason." | L517-519: "The owed lane that registers the Opus 5 and Fable 5.1 windows". L1111-1114: "The registry". | The gap is confirmed at `agent-tools/src/session-metadata/window-registry.ts`:14-25, on HEAD and on `origin/engraph` ("opus-5" count 0). F-191 is present (a4 cites :3786-3808, a8 :3786, a9 :3785), but a4 and a8 found no "opus-5-5" in it. | F-191: add `claude-opus-5-5`; `window-registry.ts`. | a4, a7, a8, a9 |
| A50 | 531-533 | Zephyr | surprise | "a tool assumption (the edit tool drops trailing whitespace from a replacement), caught by the ceremony failing fast". | none | "whitespace" in the harness pattern and `distilled.md`: absent. "drops trailing whitespace" and "trailing whitespace from" across the tracked tree: absent. | `harness-shell-and-commit-edge-cases` | a4 |
| A51 | 535-542; 849-851; 1151-1158 | Zephyr; Blazar; Swallow | lesson ×3 | A proxy or stand-in read as the thing it stands for. **L535-542:** "a claim derived from a proxy (a peer's text, an earlier read, memory, a timestamp) goes into a surface that cannot be amended … without the proxy being checked against the source at the moment of the write … It is a write moment with no active check." **L849-851:** "A proxy (a label, a count) was read as the thing it measures. At an elaboration boundary, restate the proxy's referent before acting on the proxy." **L1151-1158:** "a stand-in accepted as the thing it stands for". Candidate: "under many parallel threads, every relayed number, timestamp and credential is re-grounded at the moment of use." L1151-1158 says the generator "recurred in a second seat the same day (Blazar lifts Corona)". | L535-542 names `verify-dont-trust`, `timing-artefact-read-as-state` and `one-instance-is-an-observation` as homing the class. The others name none. | **a4:** "write moment": absent. Related: `session-handoff`:527-530 and `claim-before-check.md`:78-79. **a6:** "proxy", "label", "referent" and "restate" in `re-apply-first-question-at-elaboration-boundaries`: absent. "proxy's referent" and "restate the proxy" in rules, skills, directives, PDRs, patterns and docs: absent. **a8:** "under many parallel threads" and "re-grounded at the moment": absent. The generator is present at `query-the-value-never-the-lookalike.md`:22 and :100. | `query-the-value-never-the-lookalike` (:22, :100); `re-apply-first-question-at-elaboration-boundaries`. | a4, a6, a8 |
| A52 | 544-551; 553-557 | Zephyr | lesson; prediction | "two of the three wrong claims were EXTRAS. A team-start's job is presence and boundary, and it carried a ruling's consequence." Reframing: "the cure is to say less, not to verify more. A broadcast or record carries the minimum its function needs; any claim beyond that names its source and when the source was read, or waits." P1: "every durable write is checked once for extras, and each extra either names its source and read time or is cut." Falsifier: "a wrong claim in a write whose function required that claim." | none ("behaviour, now") | "extras", "minimum its function", "say less", "for extras" and "names its source" in rules, skills, directives, PDRs, patterns, `distilled.md` and docs: absent. Also absent from `retrospective 09-24`. | `metacognition.md`:118-122 (the vigilance clause, the nearest). | a4 |
| A53 | 560-563 | Zephyr | observation (an open owner question) | "Unresolved: whether the owner's "no rush" meant the fold should also have waited for the grounding to finish." | none | "no rush" and "take your time" in rules, skills, directives, PDRs, patterns, `distilled.md` and docs: no hit. No answer was found. | An owner question; there is no home. | a4 |
| A54 | 565-573 | Zephyr | observation | A full Cricket suite ran at the owner's word: "Seven returned ON-TRACK and one DRIFTING (procedure, adversarial)". The relayed "concept, not bytes" answer was put to the owner, who confirmed it together with the authorship ruling. | none | No tally report for 2026-09-23 exists under `.agent/reports/agentic-engineering/` (the latest is `cricket-quartet-tally-2026-09-09-consolidation-seat.md`). "concept, not bytes": absent. The binding is at `cricket`:70. The authorship ruling is at `repo-continuity`:837-840. | A Cricket tally report | a4 |
| A55 | 575-577 | Zephyr | observation | "the procedure seat marked every claim UNGROUNDED because it cannot read git history, and that pushed its verdict to DRIFTING. That is its method's floor, not a finding." | none | "UNGROUNDED", "git history" and "cannot read" in `cricket`: absent. Its :177-184 covers a different defect. | `cricket` | a4 |
| A56 | 579-580; 1129-1134 | Zephyr; Marten | tool-gap; mistake | Commits under the owner's authorship ruling, where the command has no author option. **L579-580:** "`commit-queue commit` has no author option. Under the owner's authorship ruling the ceremony sets git's author variables in the environment of the commit step." **L1129-1134:** "`git merge -m` has no `--author` … The move: `git merge --no-commit origin/engraph`, then `git commit --author=... -F <message>`, so every sync goes through the same author and commitlint path as any other commit." | none | **a4:** no `--author` or `GIT_AUTHOR` handling in `agent-tools/src/commit-queue`. The workaround is only at `repo-continuity`:839-841. Absent from the `commit skill` ("GIT_AUTHOR") and from `bot-identity-on-third-party-systems`. The env-variable pattern for `git merge` is at `cross-fork-integration`:196-199. No friction entry. **a7:** "merge --no-commit", "git merge -m" and "sync merge" in `bot-identity-on-third-party-systems`, the `commit skill` and `pr-lifecycle`: absent. | `commit skill` (:281-284, worktree `--author`); `bot-identity-on-third-party-systems` (:100-102); the commit-queue tool. | a4, a7 |
| A57 | 586-593; 1199-1202 | Blazar; Swallow | correction; tool-gap | A push's progress is invisible in its captured log. **L586-593:** "run every gate-bearing commit or push under an event-driven watch that reports progress on a cadence and the exit code at the end. Read the process tree (CPU per child), not only the log's last line". The pre-push output never reached the `merge-bot push` log. **L1199-1202:** the `merge-bot push` output file "stayed empty while the pre-push ran, and was still empty after the transfer … progress had to be read from the process tree, and the outcome from the remote tip." | "Practice (running a gated commit)" (a surface) | **a5:** "gate-bearing", "CPU per child", "process tree" and "Your push is stuck" in rules, skills and patterns: absent. Related: `commit skill`:676-681; `verify-dont-trust.md`:567; `observer-must-see-the-terminal-state`. **a8:** "merge-bot push" with "output", "redirect" or "empty" in the `register`: absent. a8 could not find the Blazar instance by "redirect"; it is L586-593. | `register`; `commit skill`; merge-bot. | a5, a8 |
| A58 | 594-598; 635-639 | Blazar; Zephyr | surprise; decision | fsmonitor hangs, then the owner's ruling. **L594-598:** "Zephyr's pre-push hung 17 minutes in `git ls-files -z`". Per-command cure: `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. **L635-639:** "the owner ruled it off. `core.fsmonitor=false` is now set in the shared clone config, and two daemons stopped". | none | "17 minutes", "ls-files -z", "0 % CPU" and "CommandLineTools" in the `register`, rules, skills and patterns: no hit. "2026-09-23" within F-195: no hit. F-195 still reads "cured on this host; the guard is open" (2026-09-19). The state is verified (`.git/config` reads `false`). It is recorded at `repo-continuity`:835-836 and `estate record`:655. | F-195 (`register`:3858-3892): add the recurrence and the owner's ruling. | a5 |
| A59 | 599-601; 1203-1206 | Blazar; Swallow | surprise; surprise | A claim about a disposition needs the source state read after the act. **L599-601:** "A close-down claim needs a process-table read after the signal, not the signal alone." **L1203-1206:** "A stand-down therefore reads the remote tip, not the monitor's last line, before stating a push's disposition." | none | **a5:** "code-mode-host" and "survived SIGTERM" in rules, skills, patterns and docs: absent. **a8:** "stand down", "stand-down" and "last line" in rules and skills: absent. Related: `exit-codes-in-band-never-piped.md`:84; `verify-dont-trust.md`:481. | `exit-codes-in-band-never-piped`; `verify-dont-trust`. | a5, a8 |
| A60 | 602-604; 1244-1245 | Blazar; Swallow | mistake; mistake | Killing processes that are not the seat's own. **L602-604:** "`pkill -f 'sleep 600'` matches by command text across every session on the machine." Cure: "Kill by the pids you recorded at launch." **L1244-1245:** a peer's `tail` "was read as this seat's stray. Tracing its parent before any kill showed a `codex` process". | none | **a5:** the general lesson is present at `comms-all-channels-watcher.md`:325-326 and `no-unbounded-host-load.md`:70-73. "recorded at launch" and "Kill by the pid" (the cross-session scope): absent. **a8:** "parent before" and "parentage" in rules: absent. | `no-unbounded-host-load` (:70-73); `comms-all-channels-watcher` (:325-326). | a5, a8 |
| A61 | 624-629; 825-826 | Zephyr; Zephyr | observation; tool-gap | The canonical watcher renders events addressed to other seats. **L624-629:** "A watcher filtered to the reader's own and broadcast events would preserve the Director's context. Not doctrine". **L825-826:** "The canonical watcher renders events addressed to other seats in full, which costs a bystander's context." | none | **a5:** "addressed to other", "peer traffic" and "own and broadcast" in `comms-all-channels-watcher` and `route-blocks-and-questions-to-director`: absent. The rule mandates the entire stream (:5-16) and names `--exclude-tag` (:43, :58). **a6:** "addressed to other seats" and "bystander": absent. The report counts "about twenty events between two other seats" (`retrospective 09-24`:151). | `comms-all-channels-watcher`, which is in tension with its own :5-16 (E.2). | a5, a6 |
| A62 | 654-662 | Blazar | lesson | Four Codex rounds each found a new gap in the probe. "The shared cause was specifying a security-critical verifier in prose." Cure: "A routing row that states the property to establish, and fails closed where it cannot be established, covers the next variant; a row that names one mechanism invites the next bypass." | none | "property, not a mechanism", "states the property", "invites the next bypass" and "verifier in prose" in PDR-140, skills, rules and patterns (on `origin/engraph`): absent. The phrase appears only in the plan's own row (`node`:535). | The nearest is the pattern `enforce-via-schema-not-prose-for-vendor-surfaces`, which has a different subject. | a5 |
| A63 | 694-700 | Zephyr | correction | The seat planned to cure findings in owner-ratified PDR-142 inside #180, and the sibling seat stopped it. "a change of concept is the owner's, and wording that implements the owner's concept is the seats' work under review." Cure: "before curing a finding, check the artefact's authority class and whether the cure changes the concept or only the wording." | It cites PDR-142 §Boundaries as the stop; it names no home for the cure. | "change of concept", "wording that implements", "seats' work under review" and "concept over bytes" in PDR-142, rules, skills, directives and patterns: absent. The stop is present at PDR-142:193-198 on `origin/engraph`. | PDR-142 §Boundaries | a5 |
| A64 | 701-706; 873-879; 1100-1107; 1247-1251; 1310-1311 | Zephyr; Zephyr; Marten; Swallow; Swallow | correction; mistake; mistake; decision (superseded); lesson | Read the doctrine that owns a subject before amending it or proposing for it. **L701-706 (glosses overreached twice):** "quote verbatim, gloss minimally, and before committing, search the rules for obligations the gloss might contradict." **L873-879 ("The third gloss overreach on owner words in this arc"):** "before amending wording that implements an owner ruling, grep this estate's own doctrine for the sections the ruling touches." **L1100-1107:** a proposed repository `author.*` setting "would defeat that ruling … Read the rule that owns an act class before proposing a mechanism for it." **L1247-1251 and L1310-1311:** the host-gates lock candidate, corrected at L1301-1310. "The move under it: read the rule a candidate would amend before routing the candidate." | L701-706: "Pattern candidate". The others name none. | **a5:** "gloss might contradict" and "obligations the gloss": absent. The first half is present at `quote-authoritative-language-exactly.md`:33-35. **a6:** "own doctrine", "implements an owner ruling" and "gloss overreach": absent. `testing-strategy.md`:455 and :461 still collide with the ruling. **a7:** "author\.\*", "author.name" and "owns an act class": absent. The fail-safe is at `bot-identity-on-third-party-systems.md`:106-109. **a8:** "host:gates" is absent from rules and `agent-tools/src`. "read the rule a candidate" in rules, skills, directives, PDRs, patterns and docs: absent. `read-before-asking.md` exists but was not grepped for the phrase. | `quote-authoritative-language-exactly` (:33-35); `read-before-asking`. | a5, a6, a7, a8 |
| A65 | 707-710; 1003-1005; 1028-1031; 1135-1138; 1337-1342 | Zephyr; Marten ×3; Swallow | tool-gap ×5 | commitlint refusals cost a whole gate run. **L707-710:** "lint the message before the commit starts." **L1003-1005:** "`check-commit-message` names the rule, not the line … The checker could print the line it parsed as the footer's start." **L1028-1031:** "Linting the message file alone (`pnpm exec commitlint < file`) before the commit costs seconds; a refused commit costs a whole pre-commit gate." **L1135-1138:** "`pnpm exec commitlint --edit <file>` before each commit catches it in the foreground." **L1337-1342:** "Before a queued background commit, run `pnpm exec commitlint --edit <message-file>` as well". L1337-1342 also claims "The checker is advisory prose linting, not commitlint." | none | **a5:** "lint the message" and "whole gate run": absent. The queue path is covered at `commit skill`:14-17 and :199-205; the worktree commits ran outside the queue. **a7:** printing the parsed line is absent from `commitlint-verdict.ts`. "pnpm exec commitlint" in skills and rules: absent (hits only in the `register` and archives). The trap is at `commit skill`:205-207, :220-221 and :890-893. **a9:** "pnpm exec commitlint" in the `commit skill` and "header-max-length" and "subject-case" in the `register`: absent. a9 flags a contradiction: `commit skill`:107-112 and `check-commit-message.ts`:5 and :186 say the checker runs commitlint. | `commit skill` (the plain and worktree commit path); `agent-tools` commit-advisories. | a5, a7, a9 |
| A66 | 747-750 | Blazar | lesson | "The node never states the probe's threat model. The review loop supplied one, an adversarial interlocutor, and each cure answered it … End-to-end realism routed the proof through the one party whose behaviour it bounds." | the node (via P1) | The instance is present in the `node` on `origin/engraph` (:445, :704). The general lesson ("threat model") in rules, skills and patterns: absent. | none named for the general form | a6 |
| A67 | 759-762 | Blazar | prediction | "P3: mutation-test the probe verdict (the repo already runs Stryker), since its unit tests are its contract." Falsifier: "a Stryker run on the verdict module is too slow for the agent-tools gate." | none | "stryker" and "mutation" in the `node` on `origin/engraph`: absent. The Stryker doctrine is at `testing-strategy.md`:24. | `node` | a6 |
| A68 | 763-767 | Blazar | observation (open questions) | Three open questions: "Whether the code-mode host applies the seatbelt …; the `--sandbox-state-json` shape; how stable the `turn_context` `permission_profile` shape is across releases." | slice 1b's pre-execution review, then the Director | The first two are present in the `node` on `origin/engraph` (:309, :452). "across releases": absent. | `node` | a6 |
| A69 | 804-808 | Blazar | observation | "from 21:10Z to 09:45Z the stream carried no event, and the Monitor's 30-minute cap cost one agent turn per re-arm, about 24 turns in total." "none yet; one night is an observation." L1365-1372 also records a watcher expiring at the Monitor's 30-minute cap. | "none yet" | "30-minute", "idle seat" and "re-arm" in `comms-all-channels-watcher` and `use-monitor-for-event-driven-wake`: absent. | `use-monitor-for-event-driven-wake` (:275) | a6 |
| A70 | 818-820 | Zephyr | lesson | "**Candidate**: a change never narrates its own state in the files it carries." "Four of #176's six findings were statements the change itself made false. Self-description belongs in the pull request body." | none. `retrospective 09-24` names `coordination-fold` step 6 (:134-135). | "narrat", "self-descri" and "own records" in `coordination-fold`: absent. "narrates its own state" and "self-description" across rules, skills, directives, PDRs, patterns and docs: absent. | `coordination-fold` step 6 (:93-99) | a6 |
| A71 | 821-823 | Zephyr | lesson | "**Candidate**: before a budget-gated edit, read every pending input that touches the same passage. B4 was edited at 25% of context; pull request 161 rewrote the same paragraph". | none. `retrospective 09-24` names the sequencing section of `directive-file-context-budget` (:140-141). | "pending input" and "same passage" in `directive-file-context-budget`: absent. Its §Sequencing is at :35. | The §Sequencing Within a Consolidation Pass section of `directive-file-context-budget` | a6 |
| A72 | 824-825 | Zephyr | tool-gap | "the scratchpad PR instruments must run from the repository root (one exited 1 silently from another directory)." | none | "from the repository root" and "repo root": absent (the hits are unrelated). | none named | a6 |
| A73 | 832-837; 1032-1038 | Zephyr; Marten | surprise; tool-gap | The statusline log lands inside the skill tree and fails the pre-push skill-adapter check. **L832-837:** "The statusline should write outside the repository, or the check should skip dot-directories." **L1032-1038:** "Two fixes are possible: the statusline logs to a fixed path, or the adapter check ignores dot-directories." | "tool feedback" | **a6:** the cause is at `.claude/settings.local.json`:4 (a relative path; the file is untracked). No dot-directory skip in `skills-adapter-generate` ("\.logs", "startsWith('.')"). **a7:** F-181 is present at `register`:2130 with status "open". No skip in `discovery.ts` ("startsWith('.')", "hidden"). | F-181 (a6 does not cite it); `agent-tools` skills-adapter-generate. | a6, a7 |
| A74 | 845-849 | Blazar | correction (owner) | A subagent was asked whether `envelope.ts` had room under the line limit. The owner said the limits "enforce thoughtful code design and clear public APIs and proper encapsulation, not to ask if the bucket has enough room left". | none | "enough room left" in rules, skills, directives, PDRs, patterns, docs, memory and plans: absent everywhere except the napkin. | `honest-restructure-over-band-aid` (:14); `principles.md`:474-476. | a6 |
| A75 | 852-855 | Blazar | surprise | "the pre-commit gate type-checks and tests the working tree, not the index." "**Rule of thumb**: a worktree is frozen while its commit gate runs; stage the next cycle as a script in scratch and apply it after the gate exits." | none | "frozen while" and "not the index": absent. The fact is present at `stage-by-explicit-pathspec.md`:67. | `stage-by-explicit-pathspec` | a6 |
| A76 | 886-891 | Blazar | surprise | "`pr-lifecycle` and PDR-140 clause 4 let a prose-class PR rebudget past its declared settlement pushes", while the owner's 2026-09-14 ruling "says rounds never go up past round two". Cure: "reconcile clause 4 and the skill with the owner's ruling, so a seat reading the skill meets the cap there." Context lines: L287-290 (B28), L428-430 (D), L511-515 (B43) and L523-531 (B44). | PDR-140 clause 4 and `pr-lifecycle` | "2026-09-14", "never go up", "round two" and "rounds ruling" in PDR-140 and `pr-lifecycle`, on HEAD and on `origin/engraph`: absent. The verbatim ruling is at `channel 09-21`:1506; the same file at :935 says it is "in no Core record". The item is owed in the `codex-dialogues record` (:384). | PDR-140 clause 4 (:156-161); `pr-lifecycle`:957. | a6 |
| A77 | 902-908 | Blazar | tool-gap | `git commit` in another seat's worktree failed with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`. "`CI=true pnpm install --frozen-lockfile` cured it. A worktree another seat installed may need a non-interactive reinstall before its first commit." Also a misleading "ahead 4" upstream reading. | "an agent-tools owner, for the hook's install step" | The error is present at `set-up-worktree-lane`:249-250, which calls the `CI=true` auto-confirm "a bypass (owner ruling 2026-08-04)" in the re-pointed `PNPM_HOME` case. F-26 is at `register`:566, status "open". "no-track", "upstream" and "ahead" in `set-up-worktree-lane`: absent. | F-26; `set-up-worktree-lane` (a conflict to resolve, E.2). | a7 |
| A78 | 946-954; 1263-1264 | Swallow ×2 | surprise; mistake | A bare `cd` moved the harness's working directory. **L946-954:** it "moved the session's "primary working directory" to that worktree". "`worktree-residency` states the platform fact that a bare `cd` is not residency and does not survive; the first half of that held only the second time." Cure: "a non-resident lane owner reads and writes worktrees by absolute path and `git -C`, never `cd`." **L1263-1264:** "A bare `cd` moved the harness's working directory a fourth time. The cure adopted mid-session: every `cd` goes inside `( … )`." | "tool feedback to the `worktree-residency` owner; one instance" | **a7:** the cure is present at `worktree-residency.md`:12 and :199-200 and at the harness pattern :63-64. The surprise is absent ("primary working directory", "first cd", "announced"). **a8:** the subshell cure is present at `worktree-hygiene.md`:317-318 and `set-up-worktree-lane`:178. | `worktree-residency` (the platform-fact line at :12). | a7, a8 |
| A79 | 961-971; 1058-1067 | Swallow; Marten | mistake; mistake | Writes went out under the owner's credential. **L961-971:** candidate "a thread record's next-step list names the credential route beside each write (`merge-bot push`, the minted token), since a pickup reads the steps, not the rule." **L1058-1067:** "Third owner-credential write in this estate that day. A PreToolUse guard that refuses a `gh` write (`pr comment`, `pr create`, `pr edit`, `api -X POST/PUT/PATCH/DELETE`) with no `GH_TOKEN` in the command is the structural cure." | `bot-identity-on-third-party-systems` (the rule broken); "Candidate for the Director's routing". | **a7:** "credential route" and "names the credential" in skills and rules: absent. There is a standing line at `codex-dialogues record`:432 and a ledger row at :102. For the guard, "GH_TOKEN" and "'gh'" in `policy.json` and `agent-tools/src/hook-policy`: absent. F-183 (`register`:2205, "open") is the same class. **a9** notes that PR G (`fix/hook-policy-gh-write-needs-bot-token`) holds four uncommitted files in `oce-wt-gh-write-guard`. | F-183; `policy.json`; `bot-identity-on-third-party-systems`. | a7 (a9) |
| A80 | 972-977 | Swallow | observation | "Answered 14:10Z: it does. A bot-posted `@codex review` on PR 189 drew the connector's 👀 in 13 seconds and a clean review of the tip at 14:13:06Z, so the owner's account is not needed for it." | none ("routed with the lane") | "@codex review" in the bot-identity rule and "bot-posted @codex" in `pr-lifecycle`: absent. `pr-lifecycle`:1114-1115 names no credential. The fact appears only at `ledger`:102. | `pr-lifecycle` (:1114-1115); `bot-identity-on-third-party-systems` (the row at :262). | a7 |
| A81 | 991-997 | Marten | observation | "For a successor whose owed work opens with directive edits, the grounding and the directive session are one budget. The fresh session should read the pickup block, not the whole continuity file, before its first directive edit." | none (it cites PDR-052) | "pickup block", "one budget" and "grounding.{0,40}budget" in `directive-file-context-budget`, PDR-052 and `start-right-*`: absent. | `directive-file-context-budget`; the start-right skills. | a7 |
| A82 | 998-1002; 1160-1162; 1170-1178; 1189-1190; 1315-1321 | Marten; Swallow ×4 | mistake; observation; observation; decision; correction | A wait or a hold keyed to the wrong sensor. **L998-1002:** "Read the host with the workflow's instrument, never with a number carried in a note." **L1160-1162:** "three waits keyed to a proxy. One never woke … and two woke falsely … a detector's two failures." **L1170-1178:** "a wait is only as good as its sensor" (five cases). **L1189-1190:** "P4, adopted: gate this seat's waits on producer-written structured signals, and sequence dependent actions in one process." **L1315-1321:** "The move: a hold's sensor comes from the rule the hold cites, and the check runs inside the act, not before it." | none | **a7:** "number carried in a note" and "under 12": absent. The instrument is at `start-right.md`:333-336 and `no-unbounded-host-load.md`:43-48. **a8:** "keyed to a proxy", "a wait is only as good", "as good as its sensor" and "producer-written": absent from rules, skills, patterns and `use-monitor-for-event-driven-wake`. **a9:** "sensor comes from" and "inside the act": absent. The sensors are at `no-unbounded-host-load.md`:42-48 and :75-76. | `no-unbounded-host-load` (items 4 and 6); `use-monitor-for-event-driven-wake`; the Cricket frame clause (A96). | a7, a8, a9 |
| A83 | 1009-1011 | Marten | observation | "the sitting Director posts nothing on the canonical stream and holds no id there, so `comms direct` cannot reach it." A question went as a narrative event plus a native message. | none | "holds no id", "narrative event.{0,80}native message" and "record.{0,30}delivery" in `comms-channels` and rules: absent. | `comms-channels` | a7 |
| A84 | 1012-1016 | Marten | observation | First run of frame verdicts, at the owner's word via the Director (Crickets also judge the frame). The run found a stale context figure and a NEXT in the wrong order. "One suite, one observation." | none | "frame verdict" and "judge.{0,10}frame" in the `cricket` §Build one identical frame (:95-108): absent. Pending at `repo-continuity`:608-612 ("Siren carries the wording … This estate takes those bytes as receiver"). Required by the `codex-dialogues record` (:164). | `cricket`, via the incoming exchange bytes | a7 |
| A85 | 1017-1018 | Marten | observation | "this fork has no fleet-authorship label, and its recent pull requests carry none, so pr-lifecycle Phase 2's label step has nothing to apply here." | `pr-lifecycle` Phase 2 | "no fleet-authorship", "nothing to apply" and "has no .{0,20}label": absent. The step is unqualified at `pr-lifecycle`:197-199; the label is `jimbot` at `docs/engineering/pr-label-ledger.md`:29. | `pr-lifecycle` Phase 2 | a7 |
| A86 | 1019-1027 | Marten | correction (owner-word) | The owner's "work is not delivered until it is merged" corrected a close that released claims with PRs 191 and 192 unmerged. The leading text is `start-right-team` §Closeout Contract ("The default closeout state is **no active claims retained**"), whose template has no open-PR line. | "Routed to the second estate's next joint set as a candidate". The text at fault is `start-right-team` §Closeout Contract. | "open pull request" and "unmerged" in `start-right-team`: absent. The contradiction stands at `start-right-team`:825 and in the template at :848-859. `pr-lifecycle`:27-28 and `ship-independent-coordinate-dependent.md`:23 already say this. | `start-right-team` §Closeout Contract | a7 |
| A87 | 1041-1044 | Marten | lesson (free play, kept) | A Practice Box delivery "must meet the receiving building's fire code, not the sender's". "A seed for the sender's checklist: lint with the receiver's config." | "the sender's checklist" (no path) | "receiver's config", "lint with the receiv", "fire code" and "sender's checklist" in `inter-practice-collaboration`, rules and practice-core: absent. | `inter-practice-collaboration` skill | a7 |
| A88 | 1050-1057 | Marten | correction (owner-word) | The seat sent three native messages about its own edits to a shared file. Lesson: "The test for a peer message is usefulness to the receiver: it changes what they would do, or tells them something the artefact does not already show. Git and the file already record edits to a shared file." | none | "useful information", "neither a question", "informing another agent" and "changes what they would do" in rules, skills (including `comms-channels`), directives, patterns and PDRs: absent. | `comms-channels`; `route-blocks-and-questions-to-director`, whose 2026-09-23 ruling this refines (E.6). | a7 |
| A89 | 1068-1071 | Marten | tool-gap | "`[ "$a" \> "$b" ]` is a zsh error ("condition expected"), so an `until` loop on it spins forever"; "compare numerically". "`set -- $pair` does not split either. Second and third zsh word-splitting instances in this seat's tenure." | none | "condition expected" and "string compare" in the harness pattern and rules: absent. Word-splitting in general is at the harness pattern :26. | `harness-shell-and-commit-edge-cases` | a7 |
| A90 | 1072-1074 | Marten | mistake | "*Before moving a file, read its age.*" A `.logs/` directory dated 2026-08-12 in the comms directory was moved and restored within a minute. | none | "read its age", "before moving a file" and "file's age" in rules, skills and patterns: absent. | none named | a7 |
| A91 | 1108-1110 | Marten | mistake | Edits began before the claim opened. "The move: create the worktree and open the claim in one step." | `register-active-areas` (the rule) | "one step", "same step" and "same command" in `register-active-areas-at-session-open` and `set-up-worktree-lane`: absent. The rule's :11 is present. | `register-active-areas-at-session-open`; `set-up-worktree-lane`. | a7 |
| A92 | 1115-1118; 1193-1198 | Marten; Swallow | tool-gap; tool-gap | The machine-local-path hook refuses scratchpad paths written into files. **L1115-1118:** "Give a sub-agent its scratch location in the dispatch prompt, or tell it to use `mktemp -d`, rather than writing the path into a file." **L1193-1198:** the hook "fires on writes to the session scratchpad, which lies outside the repository"; workaround "pass paths as arguments or name worktrees for `git worktree list`". | L1193-1198: "the hook policy's owner, one instance" | **a7:** "scratchpad path", "scratch location", "mktemp -d" and "flattened home" in rules and skills: absent. The principle is at `important-state-not-in-temp-files.md`:134-137. **a8:** the behaviour is by design (`policy.json`:395-418, "blocked EVERYWHERE"). "machine-local" and "scratchpad" in the `register`: no row. | `important-state-not-in-temp-files`; `register`. | a7, a8 |
| A93 | 1124-1128 | Marten | mistake | A worktree was removed without the ignored-paths inventory. "The move: the inventory runs in the same command as the removal, every time." | `worktree-hygiene` (the rule) | "same command" in `worktree-hygiene`: absent. The inventory itself is at :191-192. | `worktree-hygiene` | a7 |
| A94 | 1142-1149 | Swallow | mistake | Slips list: "two writes under the owner's credential; the zsh word-split; two made-up channel timestamps; a reviewer's "nine" relayed unrecounted; a push gate that grepped free text and matched this seat's own older line; two push monitors racing for one window." | none | The word-split is present (harness pattern :26; `verify-dont-trust.md`:588). The hand-written timestamp is present (`query-the-value-never-the-lookalike.md`:70). "grepped free text" in rules and patterns: absent. The credential slips are A79; the timestamps are A111. | none named for the grep gate or the racing monitors | a8 |
| A95 | 1162-1164 | Swallow | observation (free play) | "the pairing split by what each seat can know, not by the designed file boundary." | none | "what each seat can know" in `comms-channels` and rules: absent. | none named | a8 |
| A96 | 1183-1185 | Swallow | decision | "P1, ACCEPTED by the Director (about 14:40Z) as the Cricket frame's sixth requirement: "the rule behind every hold, the sensor that will see its release, and when that sensor was last read". This seat owns the clause text at resume." | "the Cricket frame". The thread record names `cricket` §Build one identical frame (:386-390). | "the sensor that will see" and "sixth requirement" in `cricket`: absent; the nearest is :108. The item sits in the `codex-dialogues record`'s Owed list (:386-388) and at :165. | `cricket` §Build one identical frame | a8 |
| A97 | 1192 | Swallow | metaloss (landing claimed, NOT verified) | "Falsifiers are in the thread record and the pause record." | the thread record; the pause record | "falsif", "refut", "wrong if" and "prediction" in the `codex-dialogues record` and in the gitignored pause record: nothing. The falsifiers for P1 to P4 could not be located. | `codex-dialogues record` | a8 |
| A98 | 1252-1258 | Swallow | lesson | Both 1b-ii reviewers asked to amend the ratified node on a premise that the vendor's source at the tag refuted. Cure: "Read the vendor's source at the tag before paying for the change a review motivates." | none | "source at the tag" in rules, skills and PDRs: absent. Related: `verify-vendor-call-shapes-at-plan-author-time.md`:32-38 ("never against installed source alone") and :54; `review-feedback-defaults-to-triage.md`:33-34. | `verify-vendor-call-shapes-at-plan-author-time`; `review-feedback-defaults-to-triage`. | a8 |
| A99 | 1265-1268 | Swallow | observation (free play) | "any "is X free?" read before an act on a shared resource needs a claim, not a read. The claims registry exists for exactly this, and host gates have no claim area." | `pr-lifecycle` (the source of "0 unresolved is a moment, not a state"); the claims registry | "a moment, not a state", in `pr-lifecycle` and all searched homes: absent. "claim, not a read": absent. | none. The association is partly superseded by L1301-1310 (E.1). | a8 |
| A100 | 1286 | Swallow | tool-gap | "`comms send` prints JSON whose last line is `}`, so the event id is read back with `ls -t`." | none | "ls -t", "last line is" and "prints JSON" in the `register`, `comms-channels` and `use-agent-comms-log`: absent. | `agent-tools` comms send; `use-agent-comms-log`. | a8 |
| A101 | 1287-1288 | Swallow | observation (a candidate) | "Crickets reading one shared frame FILE get an identical frame by construction, at a fraction of the tokens of eight inline copies. A candidate for the Cricket skill's Claude dispatch." | "the Cricket skill's Claude dispatch" | "shared frame" and "frame file" in `cricket` §Claude dispatch (:110-121): absent. | `cricket` §Claude dispatch | a8 |
| A102 | 1327-1331 | Swallow | lesson | A read-only Cricket read the older working-tree copy and called a `git show` citation false: "a role with only `Read` cannot resolve a git ref". Cure: "say the quote is from `git show <sha>:<path>`, or copy that file into scratch and cite the scratch path." | "the next frame" | "git show", "scratch" and "git ref" in `cricket` and `.agent/sub-agents/templates/cricket-judgement.md`: absent. | `cricket`; the `cricket-judgement` template. | a9 |
| A103 | 1343-1348 | Swallow | correction | "the gate semaphore is built, in the other estate" (jimcresswell.net PR 162). "The move: "not built" is a claim about one estate; check the sibling estate before calling a ruled mechanism missing." | "the exchange's batch three" (as the carrier) | "not built" and "sibling estate": absent (unrelated hits only). Batch three is present but UNTRACKED at `.agent/practice-core/incoming/jcnet-batch-3/host-gate-slot.md`:1. `commit skill`:293 still reads "until it lands". | none named for the move. `commit skill`:293 and `no-unbounded-host-load` item 6 carry the stale "unbuilt" state. | a9 |
| A104 | 1350-1352 | Swallow | lesson | "A heartbeat label baked into the loop goes stale while the state moves on." Cure: "Read the label from a file each tick, or restart the loop at every state change." | none | The restart half is present at `liveness-heartbeat-cron.md`:188-189 and :220-221. "label from a file": absent. | `liveness-heartbeat-cron` | a9 |
| A105 | 1356-1358; 1456-1459 | Swallow; Marten | decision; observation | A hold, or a wait on a peer, needs a default or a release condition. **L1356-1358:** "A hold with no default is a stall waiting to happen." **L1456-1459:** "A lane waiting on a peer needs a release condition, and this seat's two retained claims had none until the handoff record proposed one." | PDR-063 (the authority used); the handoff record | "stall waiting" and "hold with no default": absent. The PDR-063 mechanism is present at :334-336, and the decision is at `codex-dialogues record`:128. "release condition" and "waiting on a peer" in rules, skills, PDRs and directives: absent. The proposal exists only in a gitignored handoff record (:238). | PDR-063 | a9 |
| A106 | 1359-1361 | Swallow | observation | "The door's round one came back clean from both legs. The reviews that did the work came before external review (the code-expert, then the test-expert and security-expert re-reads)." | none | "before external review" and "the reviews that did the work": absent. That the door was PR 190's is an inference from a gitignored handoff record. | none named (see E.6 for the converse) | a9 |
| A107 | 1373-1377 | Marten | surprise | "the compaction outran the wrap" (the wrap began past 60 %); nothing was lost. Cure: "The order that made that safe: write the durable records at the lane boundary, and treat the wrap as the reading-and-verifying pass over records that already exist." | none | "at the lane boundary" and "reading-and-verifying" in `wrap` and the standard homes: absent. | `wrap` | a9 |
| A108 | 1378-1384 | Marten | tool-gap | The review-cost survey prices unreviewed settlement pushes at 0 (8 of 14 PRs). "So the pre-push gate would pass a third push after two unreviewed ones, and budget enforcement fails open." "candidate: the gate counts pushes to the pull request after open, not only reviewed heads." | "the review-cost gate's owner"; "the ledger rows" | The rows are present (`ledger`:92, :109-122). "pushes to the pull request" and "counts pushes" in the `ledger`, `pending-graduations.md`, the `register` and `review-feedback-defaults-to-triage`: absent. The ledger's column definition (:25) is the counting basis the entry says is blind. | the `agent-tools` review-cost gate; `register`. | a9 |
| A109 | 1435-1444 | Marten | mistake (labelled "Correction") | The wrap "enumerated work safety from memory" and missed two worktrees: PR G's four uncommitted files, and merged PR 199 unpruned. Cure: "Take the enumeration from the structural source, and let the check read every worktree." | none | `wrap`:90-92 names `git status --branch` per touched branch, not `git worktree list` ("worktree" in `wrap`: no hits). "structural source": unrelated hits only. | The work-safety step in `wrap` | a9 |
| A110 | 1445-1452 | Marten | surprise | "landed on engraph is not present where seats run". The coordination branch lacks PR 209's `PreCompact` hook, so the observer did not run. "So a rule, hook or plan landed today reaches seats in the primary checkout only after the fold re-cuts the coordination branch and `dist` is rebuilt." | none | All facts verified: the merge-base is `f66fd033f`, and `17d030cb0` is not an ancestor of HEAD. "landed today" and "re-cuts" in `coordination-fold` and the standard homes: absent. | `coordination-fold` | a9 |
| A111 | 1483-1486 (also 1142-1149, 1166-1169) | Swallow | mistake (a recurrence; claimed landing NOT verified) | The seat typed an ARC header time "3 minutes in the future", and wrote "The protocol already says headers come from `date -u`." Cure: "Every header since is built by `date -u` inside the append command itself, so no typed time can reach the file." L1142-1149 lists "two made-up channel timestamps". L1166-1169 discards "both vendors guess header times" because "the ARC protocol already treats header times as compose-time claims". | "The protocol" (ARC) | "date -u" in the `ARC protocol`: absent. Its :163 says "compose the timestamp BEFORE the append". The `date -u` rule is at `records-are-technical-not-emotional.md`:44-45 and `verify-dont-trust.md`:730. "inside the append": absent. a8 could not locate the header-time text. | `ARC protocol` (:71, :163) | a9 (a8) |
| A112 | 1487-1489 | Swallow | surprise | After the compaction the seat's process had a new pid (23808, then 45379). "The watcher's `--supervisor-pid` and the heartbeat loop's `kill -0` guard must come from walking the shell's parent chain to `claude` at each re-arm, never from a pid in a record." | none | "parent chain" and "new pid": absent. The watcher rule gives other pid sources (`comms-all-channels-watcher.md`:123, :200, :208, :307; `use-monitor-for-event-driven-wake.md`:254). | `comms-all-channels-watcher`; `use-monitor-for-event-driven-wake`. | a9 |
| A113 | 1490-1495 | Swallow | surprise | PR 196's red check was a known font-loader flake. Cure: "Read the failing job's error lines before calling a check a defect or a flake. The fan-in `run-quality-gates` goes red with any failed leg, so it names no cause of its own." | none | "failing job's error", "defect or a flake" and "next/font/google": absent. The nearest is `start-right.md`:368 ("Read the log before assuming a known flake"). | `start-right.md` (:368) | a9 |

---

## B. Already homed (home check PRESENT)

| # | Snapshot lines | Class | Substance (six words or fewer) | Present at (as the analyst wrote it) | Analysis |
| --- | --- | --- | --- | --- | --- |
| B1 | 31-32 | decision | Read HEAD after interrupted ceremony | present at `.agent/skills/change-custody/commit/SKILL-CANONICAL.md:665-668` | a1 |
| B2 | 33-34 | decision | Parallel gates in separate worktrees | present at `.agent/rules/no-unbounded-host-load.md:87-91`; `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md:176-178` | a1 |
| B3 | 34-35 | decision | Plan re-priced; 30 % gate scope | present at `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md:151-156` | a1 |
| B4 | 35-36 | decision | Cure checked at source | present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:344-347` | a1 |
| B5 | 36-37 | decision | Amend rule with record open | present at `.agent/rules/new-rule-vs-pdr-clause.md:90-100` | a1 |
| B6 | 37-38 | decision | Archive pointer written inline | present at `.agent/directives/continuity-practice.md:87-89` | a1 |
| B7 | 38-39; 858-864; 1180-1182; 1188 | decision; tool-gap; lesson; decision | Smoke deadline; load gate (F-197) | present at `.agent/memory/operational/frictions-register.md:3925` (a1, a8); `.agent/memory/operational/threads/codex-dialogues.next-session.md:404-408` (a6), `:404-409` (a8). The deadline is still at `agent-tools/smoke-tests/comms-watch-coordination-home.smoke.ts:46-47, :94`. | a1, a6, a8 |
| B8 | 39-41 | decision | Lesson that did not bind | present at `.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md:130`; `.agent/reports/agentic-engineering/why-the-register-stayed-at-twelve-for-three-days-2026-09-20.md:225` | a1 |
| B9 | 41-42 | decision | Context-loop findings and next run | present at `.agent/reports/agentic-engineering/context-loop-experiment-working-seat-2026-09-19.md` (`## Findings` :17; `## Design of the next run` :52) | a1 |
| B10 | 42-44 | decision | Two owner items beside F-189 | present at `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md`, lines 154-173 | a1 |
| B11 | 44-45 | observation | Merge-message ref resolution | present at `.agent/skills/coordination-fold/SKILL-CANONICAL.md:58-64` | a1 |
| B12 | 45 | observation | Corrected-direction residue sweep | present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:334-343` | a1 |
| B13 | 45-46 | observation | Budget rule's scope | present at `.agent/rules/directive-file-context-budget.md:50-55` (the thread record does not state it) | a1 |
| B14 | 46 | observation | Card answers; narrowed job | present at `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md:231-236`. For "narrowed job" the nearest match is :193-202; no sentence uses "narrow". | a1 |
| B15 | 47 | observation | Director-handoff whole-read verdict | present at the continuity thread record, lines 239-242 | a1 |
| B16 | 61-62 | observation | Split method, skill half | present at `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md:132-141` (`3cd0df21a`) | a1 |
| B17 | 62-63 | decision | Split method, directive half | present at `.agent/directives/continuity-practice.md:122-128` (`9c3c4dfbd`) | a1 |
| B18 | 64-65 | decision | Done-condition candidate, owner item 4 | present at `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md:176-182` | a1 |
| B19 | 92-95; 1119-1123 | tool-gap; tool-gap | Force-push guard matches `gh api -f` | present at `.agent/rules/hook-policy-substring-discipline.md:142-144` (F-102 at `frictions-register.md:1731`). The guard is still a literal at `.agent/hooks/policy.json:14`. The `-F body=@file` variant is not named. | a1, a7 |
| B20 | 119-121 | mistake | MD018 on a wrapped `#865` | present at `.agent/memory/active/patterns/harness-shell-and-commit-edge-cases.md:112`; `passive-guidance-loses-to-artefact-gravity.md:130`, `:133`; `docs/governance/development-practice.md:356` | a2 |
| B21 | 127-129 | lesson | "do not archive me"; leave-if-live | present at `.agent/directives/continuity-practice.md:6`, `:121`; `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md:136` | a2 |
| B22 | 145-155; 225-228 | correction; lesson | Budget runs to the threshold | present at `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md:144`, `:146-148`, `:148-150` (`:144-150`) | a2 |
| B23 | 156-163 | decision | Owner: buffers drained enough | present at `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md:355`, `:356-357` | a2 |
| B24 | 177-179 | decision | Discarded: frictions curated for size | present at `.agent/memory/operational/threads/continuity-memory-and-knowledge-flow.next-session.md:109`; `.agent/directives/continuity-practice.md:70-72` | a2 |
| B25 | 229-231; 244-248 | lesson; decision | Door learns docs-only bot class | present at `.agent/memory/operational/threads/estate-coordination.next-session.md:364` (item 8 at `:353`; §Tool and code lanes owed at `:205`); `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:1230-1235`, `:1210` | a2 |
| B26 | 231-233 | prediction | Curated records say where state is | present as "## Where the current state is" in five paused records (for example `.agent/memory/operational/threads/paused/mcp-submission-drive.next-session.md:18`) and at `.agent/memory/operational/threads/estate-coordination.next-session.md:533`. Not checked across all nineteen records. | a2 |
| B27 | 270-276 | correction | Four finish-line corrections | (ii) present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:1358`; (iv) `.agent/memory/active/patterns/zero-match-false-green.md:72-73`; (i) `.agent/memory/operational/review-cost-ledger.md:84`; (iii) the resolver is conserved at `.agent/reports/agentic-engineering/seat-instruments-zephyr-guards-leeward-2026-09-23.md:184-196`, and its resolve-all behaviour is unchanged (E.2). | a3 |
| B28 | 287-290 | owner-word | Rebudget count; owner's question | ledger rows present at `.agent/memory/operational/review-cost-ledger.md:83`, `:84`, `:46`. There is no 2026-09-21 row for #173 (E.2). | a3 |
| B29 | 290-294 | mistake | Bar markers unused on replies | present at `.agent/practice-core/decision-records/PDR-140-review-response-pricing.md:211-214`; `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:725-731` | a3 |
| B30 | 296-299 | observation | Clause 9(b) decided the case | present at `PDR-140-review-response-pricing.md:218-225` | a3 |
| B31 | 306-311 | correction | markdown-it repository advisory missed | present at `.agent/collaboration/rapid-comms/2026-09-21-three-estate-practice-exchange-brazier-spins-temper-and-zephyr-guards-leeward.md:366`, `:378-384`, `:388`. The estate still resolves 15.0.0. | a3 |
| B32 | 323-327 | observation | Fold findings counted | present at `.agent/memory/operational/review-cost-ledger.md:83`, `:85` | a3 |
| B33 | 333-336 | mistake | Generator question over full set | present at `PDR-140-review-response-pricing.md:154-155`; `pr-lifecycle/SKILL-CANONICAL.md:707-709` | a3 |
| B34 | 340-346 | correction | Spent rebudget was wrong verdict | present at `.agent/memory/operational/review-cost-ledger.md:86` | a3 |
| B35 | 349-352 | decision | BELOW: credentials never written | present at `agent-tools/src/validators/operator-profile/operator-profile-keys.ts:220-221` | a3 |
| B36 | 352-355 | correction | Proposed hold was invented gate | present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:41`, `:1482-1484`; `.agent/rules/present-verdicts-not-menus.md:83` | a3 |
| B37 | 361-374 | observation | Corrections came from outside | present at `.agent/directives/metacognition.md:117`; `.agent/practice-core/decision-records/PDR-142-the-best-of-each-practice.md:40-42` | a3 |
| B38 | 374-378 | observation | Estate received nothing from sibling | present at `.agent/memory/operational/repo-continuity.md:853-855`, `:915-917`. No symmetric-merge landing was found. | a3 |
| B39 | 425-428 | tool-gap | Scratchpad instruments; lane nobody holds | present at `repo-continuity.md:874-880`; bytes at `.agent/reports/agentic-engineering/seat-instruments-zephyr-guards-leeward-2026-09-23.md` | a3 |
| B40 | 450-452 | observation (refuted) | "Pause held nothing" was false | the correction is present at `.agent/memory/operational/repo-continuity.md:679` | a4 |
| B41 | 463-464 | lesson | `--amend` denied; next commit corrects | present at `.agent/skills/change-custody/commit/SKILL-CANONICAL.md:227-230`; `.agent/memory/active/patterns/harness-shell-and-commit-edge-cases.md:101-102`. "as durable as the error" is absent. | a4 |
| B42 | 509-511 | owner-word | Owner ratified the relayed rulings | present at `.agent/memory/operational/repo-continuity.md:674-675`; channel `:1496` | a4 |
| B43 | 511-515 | observation | Relayed ruling is data until confirmed | present at `.agent/practice-core/decision-records/PDR-142-the-best-of-each-practice.md:135-136` | a4 |
| B44 | 523-531 | observation | Three wrong claims, first hour | corrections present in the channel at `:1500-1509` and `.agent/memory/operational/repo-continuity.md:681-683` | a4 |
| B45 | 560 | decision | No new rule; class homed | the three homes exist: `.agent/rules/verify-dont-trust.md`, `.agent/memory/active/patterns/timing-artefact-read-as-state.md`, `.agent/rules/one-instance-is-an-observation.md` | a4 |
| B46 | 573-575 | decision | Land #177, then #173 | carried out: channel `:1542`; #177 as `138e0128f`, #173 as `685ad538c` | a4 |
| B47 | 605-609 | lesson | Cut lanes from `origin/<default>` | present at `.agent/skills/set-up-worktree-lane/SKILL-CANONICAL.md:60`, `:76-80`; `.agent/skills/coordination-fold/SKILL-CANONICAL.md:35-39`. "unless the work is coordination state" is absent. | a5 |
| B48 | 610-614 | mistake | Request review legs after sync | present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:1405-1409`. The explicit "read merge state first" ordering is absent. | a5 |
| B49 | 618-623 | correction | Director hears questions and requests | present at `.agent/rules/route-blocks-and-questions-to-director.md:68`, `:70-73` (`e50d66c80`, `ee3aa230d`, PR #181) | a5 |
| B50 | 643-653 | decision | Probe-bypass rows routed | present at `.agent/plans/delivery/the-codex-dialogues-exec-binding.plan.md:534`, `:535` (on `origin/engraph`, :697) | a5 |
| B51 | 663-677; 742-746 | observation; observation | Code mode records programs | present on `origin/engraph` at `.agent/research/agentic-engineering/codex-support-concept-exploration-2026-09-23.md` §2.9 and the plan `:194-195`, `:200` (a5); `origin/engraph:…:704` (a6). Absent at HEAD. | a5, a6 |
| B52 | 678-690; 755-759 | observation; prediction | Model-free `codex sandbox` write leg | present on `origin/engraph` at the research note `:326`, `:354` and plan rule 9 `:261-266` (a5); `origin/engraph:…:200`, `:261`, `:309`, and the research note `:299` (a6). Absent at HEAD. | a5, a6 |
| B53 | 751-754 | prediction | State the probe's threat model | present at `origin/engraph:…:445` to `:447` (PR 188, `fcbaa9bf5`) | a6 |
| B54 | 768-774 | observation | Kept seeds; record plus recomputation | present at `.agent/rules/validators-must-recompute-not-just-record.md:1` | a6 |
| B55 | 774-779 | observation | Discarded seeds; the #143 defect | present at `.agent/memory/operational/review-cost-ledger.md:44` | a6 |
| B56 | 792-793 | mistake | Sweep after merge; not red-first | present at `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md:1358`; `.agent/practice-core/decision-records/PDR-110-repo-state-enforcement-is-its-own-proof-layer.md:38`. This is a second instance of the pattern in A29. | a6 |
| B57 | 827-829 | observation | Phenotype note; adversarial redirections | present at `.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md:11` | a6 |
| B58 | 830-831 | observation | Pointer to the 09-24 retrospective | the file exists: `.agent/reports/agentic-engineering/2026-09-24-records-that-outrun-their-evidence-retrospective.md` (proposals `:123-145`) | a6 |
| B59 | 841-844 | correction | "Codex support" named two outcomes | present at `.agent/memory/operational/threads/codex-dialogues.next-session.md:16`; `.agent/memory/operational/repo-continuity.md:243`. Absent from the doctrine scope. | a6 |
| B60 | 909-910 | tool-gap | `comms reply` refuses non-recipients | present at `.agent/rules/directed-routing-requires-absorption-ack.md:59-61`; code `agent-tools/src/collaboration-state/comms-use-cases.ts:153`. "reply to the peer's event instead" is absent. | a7 |
| B61 | 955-960 | mistake | zsh does not word-split variables | present at `.agent/memory/active/patterns/harness-shell-and-commit-edge-cases.md:26`; `.agent/rules/verify-dont-trust.md:588`; `.agent/rules/comms-all-channels-watcher.md:93`. The shell-function cure is absent. | a7 |
| B62 | 978-987 | tool-gap | EMFILE watch-error hot loop | the cure is on `origin/engraph` only: `67143dc14`, merge `07d80ec02` (#193). The defect is still at HEAD in `agent-tools/src/collaboration-state/cli-runtime.ts:164-167`. | a7 |
| B63 | 1006-1008 | tool-gap | Hedging gate on "exemption" | present at `.agent/rules/no-hedging-vocabulary.md:246-247`; `.agent/rules/hook-policy-substring-discipline.md:5` | a7 |
| B64 | 1047-1049 | decision | Landing slot is owner's cost | present at `.agent/practice-core/decision-records/PDR-131-merge-concurrency-is-free-quality-binds-at-settled-ready.md:53` (see A3) | a7 |
| B65 | 1075-1080 | tool-gap | `--in-response-to` accepts any id | F-121 at `.agent/memory/operational/frictions-register.md:2397`, status "open", names the same cure. The code at `agent-tools/src/collaboration-state/cli-comms-commands.ts:208` is still unvalidated. | a7 |
| B66 | 1081-1085; 1093-1099 | mistake; mistake | Read a full SHA; never compose | present at `.agent/memory/active/patterns/query-the-value-never-the-lookalike.md:41-43`. `merge-bot merge` already reads the head itself (`agent-tools/src/merge-bot/merge.ts:242`). | a7 |
| B67 | 1086-1092 | mistake | Doc and onboarding reviewers paired | the rule is at `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md:15-17`. The triage row is on `origin/engraph` only, at `.agent/sub-agents/templates/code-expert.md:309` (`9a9fbd285`). | a7 |
| B68 | 1164-1165 | observation | Two interlocks; no lawful claim path | present at `.agent/memory/operational/threads/codex-dialogues.next-session.md:412-413`; `.agent/plans/delivery/codex-queue-wake-bridge.plan.md:169-170` | a8 |
| B69 | 1241-1243; 1301-1310 | mistake; correction | Four gates; semaphore by mechanism | present at `.agent/rules/no-unbounded-host-load.md:75`, `:75-76`, `:84-86`, `:87-88`; archive `.agent/memory/operational/archive/frictions-register-2026-09-20.md:4133-4135`. Superseded: the semaphore is built in the sibling estate (A103). | a8 |
| B70 | 1246 | mistake | Piped exit code misread | the file exists: `.agent/rules/exit-codes-in-band-never-piped.md` | a8 |
| B71 | 1260-1262 | mistake | Commit made without `--author` | present at `.agent/rules/bot-identity-on-third-party-systems.md:102`, `:107` | a8 |
| B72 | 1268-1270 | observation | "Parked" refusal teaches | present at `.agent/hooks/policy.json:326`, `:329`, `:418` | a8 |
| B73 | 1271-1274 | decision | Codex membership frame changed | the file exists: `.agent/plans/delivery/codex-queue-wake-bridge.plan.md` (`7e9b2cf7f`) | a8 |
| B74 | 1275-1277 | observation | Seven gaps; wake Codex-specific | present at `.agent/plans/delivery/codex-queue-wake-bridge.plan.md:169-170`. Later revised to "5, not 7" at the thread record `:110`. | a8 |
| B75 | 1279-1280 | prediction | Wake-bridge falsifier: 60 seconds | present at `.agent/plans/delivery/codex-queue-wake-bridge.plan.md:100-102` | a8 |
| B76 | 1284-1285 | tool-gap | Checker's name is `check-commit-message` | present at `.agent/skills/change-custody/commit/SKILL-CANONICAL.md:17`, `:107` | a8 |
| B77 | 1332-1336 | observation | Codex `PreToolUse` contract read | present at `.agent/plans/delivery/codex-pretooluse-guard-parity.plan.md:53`, `:50`, `:79` | a9 |

---

## C. Owner words

Deduplicated. **ABSENT** marks a quotation whose Check found it absent from every doctrine surface the
analyst searched. "Not searched" means no analyst searched doctrine for that wording.

| # | Date | Snapshot line | Quotation (verbatim, as the analyses give it) | Where the analyses found it | Analysis |
| --- | --- | --- | --- | --- | --- |
| C1 | 2026-09-20 | 25-27 | "you are supposed to analyse the buffers, preserve the knowledge, then analyse and preserve the knowledge in the oversized memory files, nothing else" | **ABSENT** from `consolidate-until-done` and `continuity-practice.md` (searched "oversized memory files") | a1 |
| C2 | 2026-09-20 ~20:0xZ | 145-147 | "wrapping and pushing is no use whatsoever if you can't trigger your own compaction, which you can't, all you are achieving is stopping." | present verbatim at `consolidate-until-done`:146-148 | a2 |
| C3 | 2026-09-20 (an earlier freeze order, no time) and 2026-09-24 (the ~14:40Z pause; the fuller form at the second pause per comms event `e432959b`) | 149; 1203 | "prepare for compaction and stop all processes" (L149), and "stop all processes" (L1203) | not searched | a2, a8 |
| C4 | 2026-09-20 ~20:1xZ | 156-158 (re-quoted at 173) | Paraphrase, not verbatim: the drainable buffers "are drained enough for this round; the large memory files are the only remaining item for the goal, and they need knowledge curation and appropriate handling" | the declaration is at the `continuity record`:355-357 | a2 |
| C5 | undated | 178-179 | Paraphrase: "the owner's word is that fitness numbers are never the goal" | the `continuity record`:109 ("the goal is knowledge curation, not chasing fitness numbers") | a2 |
| C6 | 2026-09-21 | 287-290 | "How many times have we added a round recently?" | not searched in doctrine; the ledger rows it prompted are present (B28) | a3 |
| C7 | 2026-09-21 | 361-374 | Paraphrase: "go slow", with "two skill invocations" | not searched | a3 |
| C8 | 2026-09-21 (the words' own date is not given) | 391-393 | "identifying the value in the older work was far more expensive than fresh development" | **ABSENT** from PDR-142 and `best-of-each-practice.plan.md` (searched "far more expensive than fresh") | a3 |
| C9 | 2026-09-14 15:15Z, quoted in the 2026-09-21 to 2026-09-24 entries | 428-430 (relayed as "rounds never go up"); 523-531 (verbatim); 886-891 (paraphrased as "rounds never go up past round two, and each later finding is a disposition riding the settlement") | "I don't want the number of rounds of PRs to go up" | **ABSENT** from PDR-140 and `pr-lifecycle` (a6 searched "2026-09-14", "never go up", "round two" and "rounds ruling"). Recorded at `repo-continuity`:681-683 and `channel 09-21`:1506; the same file at :935 says "in no Core record". | a3, a4, a6 |
| C10 | 2026-09-23, about 11:00Z | 509-511 | "I ratify the decisions that Brazier communicated to you on my behalf" | `repo-continuity`:674-675; channel :1496 | a4 |
| C11 | 2026-09-23 | 544-551 | "take your time" | **ABSENT** from rules, skills, directives, PDRs, patterns, `distilled.md` and docs | a4 |
| C12 | 2026-09-23 | 560-563 | "no rush" (possibly a restatement of C11; the entry does not say) | **ABSENT** (same search as C11) | a4 |
| C13 | 2026-09-23 13:5xZ | 586-593 (napkin line 589) | "Your push is stuck, and you couldn't tell, that is a tooling or tool use failure" | **ABSENT**: `git grep "push is stuck"` finds only the napkin, on HEAD and on `origin/engraph` | a5 |
| C14 | 2026-09-23 evening | 618-623 | Paraphrase: "no agent updates the Director unless it has a question or a request" | the verbatim ruling is at `route-blocks-and-questions-to-director.md`:70-73 and `repo-continuity`:836-837 | a5 |
| C15 | 2026-09-23, through the Director's routing on the owner's word | 694-700 | Paraphrase, relayed: "a change of concept is the owner's, and wording that implements the owner's concept is the seats' work under review" | **ABSENT** (searched "change of concept", "wording that implements" and "seats' work under review" in PDR-142, rules, skills, directives and patterns) | a5 |
| C16 | 2026-09-24 | 841-844 | "are not necessarily the same thing" | **ABSENT** from the doctrine scope; present in the `codex-dialogues record`:16 | a6 |
| C17 | 2026-09-24 | 845-849 | "enforce thoughtful code design and clear public APIs and proper encapsulation, not to ask if the bucket has enough room left" | **ABSENT** everywhere except the napkin | a6 |
| C18 | 2026-09-24, mid-wrap | 895-901 | "Swallow holds Drift (516619) is your successor" | not searched (lane state) | a7 |
| C19 | 2026-09-24 13:57Z, relayed by the Director | 1012-1016 | "Crickets also judge the frame". The verbatim form at `repo-continuity`:608-609 is "Crickets judge in the frame provided, we need them to also judge the frame itself". | **ABSENT** from `cricket` (searched "frame verdict", "judge.{0,10}frame") | a7 |
| C20 | 2026-09-24T14:29:27Z (comms event `942fd3b0`) | 1019-1027 | "work is not delivered until it is merged" | not searched verbatim. `ship-independent-coordinate-dependent.md`:23 carries different words ("work has delivered ZERO value until it is merged to `main`"). | a7 |
| C21 | 2026-09-24 ~15:5xZ | 1050-1057 | "do you really need to spend time and tokens informing another agent that a file got bigger? … tools like git don't need 'telling'" | **ABSENT** (searched "informing another agent") | a7 |
| C22 | 2026-09-24 ~15:5xZ | 1050-1057 | "it is also reasonable to send information to a fellow agent, sometimes that is important and is neither a question not a request, but it should be useful information" | **ABSENT** (searched "useful information", "neither a question") | a7 |
| C23 | 2026-09-24 | 1236 | "carry on" | not searched | a8 |
| C24 | 2026-09-20, quoted in a 2026-09-24 entry | 1306 | "two parallel gate runs are fine as long as they are in different work trees" | present at `no-unbounded-host-load.md`:87-91 (a1) and :87-88 (a8) | a1, a8 |
| C25 | 2026-09-25 | 1386-1387 | "then stop". The fuller form is "prepare for compaction then stop" (`repo-continuity`:340). | recorded in the continuity block | a9 |
| C26 | 2026-09-25 | 1431-1433 | "do not commit or push". The fuller form, lines 7-8 of a gitignored handoff record: "Create a handoff record, another seat will pick up the work. Identify assumptions and highlight them … do not commit or push, then stop." | the fuller form exists only in the gitignored handoff record | a9 |

**Named but not quoted.**

- The napkin preamble (L1-21) records an owner correction of 2026-07-06 without marking it as verbatim:
  "Rotation is the preservation step AFTER processing — never a fitness-relief move or a queue" (a1).
- The owner's 2026-09-16 comment-evidence ruling is named at L865-872 (a6).
- "the owner's test words" are referred to at L873-879 (a6).
- The owner's word switched the focus to Codex as a first-class peer (L1237), and "the owner's word
  stopped every process" (L1299) (a8).
- The owner "caught the proxy readings (two use cases under one label, and the line limit read as a
  bucket)" (L928-936, reported) (a7).
- "by a mechanism, never a declaration" (L1304) is rule text, not the owner's words. The rule's own
  owner quotation is different (`no-unbounded-host-load.md`:77-79) (a8).
- "hand over or continue at the owner's word" (L1356-1358) has no named speaker (a9).

---

## D. Handoff-state and metaloss items (conserved in the archive, not homed)

No item is a prediction with a named review date. L220-224 refers to "five PDR-130 slow-lane rows
under their review dates", which are held elsewhere.

| Snapshot lines | Gist (five words or fewer) | Class | Analysis |
| --- | --- | --- | --- |
| 27-29 | Archive byte-identical to `28c5dd11d` | metaloss | a1 |
| 47-49 | Single observations left archived | metaloss | a1 |
| 51-52 | ARC channel read at wrap | handoff-state | a1 |
| 58-60 | Archive 20b byte-identical (operational path) | metaloss | a1 |
| 65-67 | Single observations left archived | metaloss | a1 |
| 67 | Dynamo's block left undrained | handoff-state | a1 |
| 110-116 | Curation counts (superseded twice) | handoff-state | a2 |
| 138-142 | Archives conserved; promises listed | metaloss | a2 |
| 200-209 | Nineteen curated, twenty live | handoff-state | a2 |
| 220-224 | Measure at the terminal wrap | handoff-state | a2 |
| 251-262, 264-266 | Metaloss recursion, wrap step 7 | metaloss | a2 |
| 421-423 | Relayed rulings recorded in pickup | metaloss | a3 |
| 423-424 | Audit advisories moved to pickup | metaloss | a3 |
| 428-430 | PR 173 dispositions owed | handoff-state | a3 |
| 430-434 | Promises forwarded; floor still open | handoff-state | a3 |
| 434-436 | Correction-count promise dropped | metaloss | a3 |
| 438-446 | Inferences, blind spots, fixed point | metaloss | a3 |
| 482-484 | Sixteen instruments conserved in report | handoff-state | a4 |
| 484-485 | Model change registration (tension) | handoff-state | a4 |
| 485-486 | Overdue branch; fold at resume | handoff-state | a4 |
| 486-488 | Two owner questions to pickup | handoff-state | a4 |
| 488-490 | Pause-quiet attribution (refuted) | observation (loss scan (e)) | a4 |
| 490-493 | Fixed point (later contradicted) | metaloss | a4 |
| 722-727 | Slices 0 and 1a landed | handoff-state | a6 |
| 726-732 | No lane record (superseded) | handoff-state | a6 |
| 734-738 | Three forwarded promises | handoff-state | a6 |
| 782-786, 803 | Trial close-out ids: ONLY COPY | handoff-state | a6 |
| 794-797 | Successor inference (superseded) | metaloss | a6 |
| 798-799 | Scan bound | metaloss | a6 |
| 800-801 | Fixed point | metaloss | a6 |
| 880-885 | Ledger supersession clause owed | handoff-state | a6 |
| 895-901 | Thread record replaces napkin pickup | handoff-state | a7 |
| 912-914 | Door, cadence, boundary conserved | metaloss | a7 |
| 915-918 | Formation letter homed | metaloss | a7 |
| 919-921 | Scratch scripts die by design | metaloss | a7 |
| 922-925 | Other seats' processes left | metaloss | a7 |
| 926-927 | Scan bound | metaloss | a7 |
| 928-936 | Own thread; promises; fixed point | metaloss | a7 |
| 1208-1210 | Live facts; pause record gitignored | metaloss | a8 |
| 1211-1214 | Promises with owners | handoff-state | a8 |
| 1215-1220 | Flagged inferences (EMFILE cause) | metaloss | a8 |
| 1221-1222 | Blind spots | metaloss | a8 |
| 1223-1224 | Index of homes | metaloss | a8 |
| 1229-1230 | Fence sweep clean | metaloss | a8 |
| 1231-1232 | Fixed point | metaloss | a8 |
| 1236-1238 | Window state; PR 189 landed | handoff-state | a8 |
| 1278 | Luna confirmed as co-owner | handoff-state | a8 |
| 1289-1294 | Durable homes; comms event ids | metaloss | a8 |
| 1296-1299 | Owed commits (since landed) | handoff-state | a8 |
| 1386-1387 | Monitors stopped at owner's word | metaloss | a9 |
| 1388-1389 | Ledger rows rebuilt after compaction | metaloss | a9 |
| 1390 | State at stop recorded | metaloss | a9 |
| 1392-1395 | Claims kept for handoff | decision (lane state) | a9 |
| 1396-1401 | Promises to Director and owner | handoff-state | a9 |
| 1402-1406 | Attribution inferences | metaloss | a9 |
| 1407-1412 | Watcher blind windows | metaloss | a9 |
| 1413-1415 | Index of homes (stale filename) | metaloss | a9 |
| 1424-1425 | Fence sweep clean | metaloss | a9 |
| 1426-1427 | Fixed point | metaloss | a9 |
| 1431-1433 | Left uncommitted (since committed) | handoff-state | a9 |
| 1461-1462 | Claims kept; release proposed | metaloss | a9 |
| 1463-1464 | Promises to next seat | handoff-state | a9 |
| 1465-1468 | Inferences (one contradicted) | metaloss | a9 |
| 1469 | Reviewer outputs lost | metaloss | a9 |
| 1470-1471 | No outside check possible | metaloss | a9 |
| 1472-1473 | Fixed point | metaloss | a9 |

---

## E. Join notes

### E.1 Lessons or states stated in one entry and superseded in a later one

- **Curation counts.** L110-116 is superseded by L156-163, then by L200-209, which L220-224 repeats.
  Only the last count is current (a2).
- **PR 174 hold.** L333-336 "the answer was to hold, not to push" is withdrawn at L352-355 as an
  invented gate. The entry at L338 says it "Corrects the last sentence of the entry above"; the
  full-raised-set point stands. The OVER verdict on PR 174's first spelling is reversed at L340-352
  (a3).
- **The pause.** L450-452 ("the pause held nothing"), L488-490 (loss scan (e)) and L490-493 (the fixed
  point) are refuted at L497-507. The correction is also at `repo-continuity`:678-681 (a4).
- **fsmonitor.** The per-command cure at L594-598 is superseded the same evening by the owner turning
  fsmonitor off (L635-639). F-195 was not updated (a5; A58).
- **The Codex dialogues lane record.** L726-732 "No thread record carries this lane" is superseded by
  the `codex-dialogues record`, whose line 19 names this napkin section as the former pickup, and by
  `repo-continuity`:243. The inferred successor at L794-797 (Brazier spins Temper) is superseded by
  the owner naming Swallow holds Drift at L895-901 (a6, a7).
- **The Codex review object.** L912-914 says "the door accepts a Codex review object bound to the tip".
  The `codex-dialogues record`:181-183 now says the clean result "arrives as an ISSUE COMMENT …, not a
  review object" (a7).
- **Host gates.**
  - The host-gates lock candidate at L1247-1251 is corrected at L1301-1311 (a8).
  - L1308 "The semaphore is not built" is corrected at L1343-1348: it was built in jimcresswell.net
    PR 162 and arrives through the untracked `incoming/jcnet-batch-3`. `commit skill`:293 still says
    "until it lands" (a9).
  - L1265-1268 ("needs a claim, not a read … host gates have no claim area") sits against
    L1301-1310, which rules a `host:gates` claim area "a declaration, the shape that ruling rejects"
    (a8).
- **Gap count.** L1275-1277 "seven gaps" is revised to "5, not 7" at the thread record :110 (a8).
- **Wrap and handoff (a9).**
  - The 10:40Z wrap at L1363 and the 04:15Z record are corrected at L1435-1444.
  - The inference at L1465-1468 that the partner seat had ended is contradicted by the handoff
    record's :84 update.
  - L1431-1433 ("uncommitted") is superseded: the entry was committed in `9df064b80`.
  - L1413-1415: the continuity block still names the replaced handover file.
- **The PICKUP block.** L251-266 points at `repo-continuity` §PICKUP, which has since been overwritten
  (:288, 2026-09-24) (a2).
- **The handover state.** The PR states at L895-901 are stale: PR 189 landed as `a0a2fead4`, PR 190 as
  `45c838297`, and 1b-ii as PR 196, `1a4450a69` (a7).
- **The "byte-identical" claim.** The 2026-09-23 claim that the paired texts were byte-identical is
  corrected at L812-817 (a6).

### E.2 Disagreements and contradictions

**Between two analyses.**

1. **Landing-slot doctrine** (A3). At L71-75, a1 reports that `pr-lifecycle` "has no multi-PR
   queue-ordering clause" (searched "queue is short", "order the checks finish", "sync rounds" and
   "strict up-to-date"). a5 (L711-713) finds the landing-slot contract at `pr-lifecycle`:1667 and
   :1678-1681. a9 (L1322-1326) cites :1678 and :1687-1689. a7 (L1047-1049) finds the cost driver at
   PDR-131:53. **Reducer check:** the working-tree `pr-lifecycle` carries the landing-slot text at
   :1667, :1678 and :1687. No analyst quotes the ordering advice of L74-75 as present.
2. **F-191's heading line** (A49). a4 and a8 cite `register`:3786; a9 cites :3785. **Reducer check:**
   the heading is at :3786, in the working tree and at HEAD.

**Between an entry and the repository.**

- **"A compaction ends every session-scoped process"** (`wrap`:61-62; `liveness-heartbeat-cron.md`:429-434,
  measured 2026-09-09). Against it: L477-480 (a schedule survived, 2026-09-23, Zephyr) and L1365-1372
  (monitors survived, 2026-09-25, Marten). L477-480 also records one earlier instance the other way
  (A47).
- **Identity registration.** L484-485 says "a model change is a new registration". PDR-027:143-149
  says a model switch updates the existing row. `register-identity-on-thread-join.md`:12-13 says a new
  model gets a new row. The row actually written (`estate record`:715) followed PDR-027 (a4).
- **pnpm reinstall.** L902-908 cures with `CI=true pnpm install --frozen-lockfile`.
  `set-up-worktree-lane`:249-250 calls a `CI=true` auto-confirm "a bypass (owner ruling 2026-08-04)"
  for a re-pointed `PNPM_HOME`. The entry does not say which cause applied (a7).
- **Bare `cd`.** `worktree-residency.md`:12 says a bare `cd` "does not survive". L946-954 says the
  first bare `cd` re-homed the primary working directory, and L1263-1264 says it happened "a fourth
  time" (a7, a8).
- **Watcher filtering.** The filtered-watcher candidate (L624-629, L825-826) sits against
  `comms-all-channels-watcher.md`:5-16, which requires the entire stream and names observed
  cross-traffic as "all important" (a5). L714-718 records that the Director runs no comms watcher.
- **Stubs vs Fakes.** At L873-879, `testing-strategy.md` §Stubs vs Fakes (:455, :461) licenses
  call-count assertions, which collides with the owner's test ruling. The text is still present (a6).
- **Closeout default.** At L1019-1027, `start-right-team`:825 ("no active claims retained") conflicts
  with `pr-lifecycle`:27-28 and `ship-independent-coordinate-dependent.md`:23 (a7).
- **Rebudgeting.** At L886-891, the rebudget in PDR-140 clause 4 and `pr-lifecycle`:957 conflicts with
  the owner's 2026-09-14 rounds ruling (a6).
- **The commit-message checker.** L1337-1342 says the checker "is advisory prose linting, not
  commitlint". `commit skill`:107-112 and `check-commit-message.ts`:5 and :186 say it runs commitlint
  (a9).
- **ARC header times.**
  - L1483-1486 says "The protocol already says headers come from `date -u`". The `ARC protocol` has no
    `date -u`; the rule lives in `records-are-technical-not-emotional` and `verify-dont-trust` (a9).
  - L1166-1169 claims "the ARC protocol already treats header times as compose-time claims", which a8
    could not locate. It matches the text a9 quotes at `ARC protocol`:163 ("compose the timestamp
    BEFORE the append").
- **The index.lock class.** L121-123 says "the register already names the class" (an index.lock race
  to a periodic git process). The only live index.lock line is F-195, whose cause is the fsmonitor
  socket (a2). F-195's 2026-09-23 recurrence and the owner's fsmonitor-off ruling are at L594-598 and
  L635-639 (a5). No analyst links the two causes.
- **#173 rebudgets.** L287-290 counts "#173 +1 and a second requested" on 2026-09-21. The ledger's
  #173 rows are dated 2026-09-23 (:87, :96) (a3).
- **F-197 counts.** L858-864 says "three instances across two seats". The F-197 entry says "With five
  instances across two seats, this is a pattern" (recurred 2026-09-24) (a1, a6).
- **Finish-line clustering.** L276-280 adds a second instance of "fluency clusters at the finish line".
  L1151-1158 (another seat, two days later) reports that "The slips clustered under parallel threads,
  not at a finish line" (a3, a8).
- **The thread resolver.** At L270-276 (iii), the conserved thread-resolver still resolves every open
  thread (`seat-instruments report`:184-196) (a3).
- **The markdown-it floor.** It was forwarded at L430-434 and is still `>=14.1.2`, with 15.0.0 in the
  lockfile, on the working tree and on `origin/engraph` (a3).
- **Vendor source.** L1252-1258 ("read the vendor's source at the tag") sits beside
  `verify-vendor-call-shapes-at-plan-author-time.md`:32-38 ("never against installed source alone"). a8
  lists this as related, not as a conflict.

### E.3 Cross-references between entries and pieces, and whether they resolve

**Napkin-internal.**

- L67 "Dynamo turns Temper's block below stays, theirs to drain" resolves to L69-106, which is still
  present and undrained (a1).
- L111 "Dynamo turns Temper's 15:0xZ block" resolves to L69. L188-198 are Dynamo's bullets under
  Zephyr's L108 heading, so attribution by heading would misassign them (a2).
- L120 "the pattern's instance 5" resolves to `passive-guidance-loses-to-artefact-gravity.md`:130
  (a2).
- L154-155 "the continuity record's item 4" resolves to the `continuity record` at :175-182 (a2) or
  :176-182 (a1).
- L311 "the morning's keyword search" resolves to L270-276 (iv) (a3). Unresolved: "the loop the owner
  had stopped that morning" (L349-352) and the owner's two metacognition invocations (L299-301) point
  before L268.
- The entry at L338 corrects L333-336. L497-507 "the napkin's loss scan (item e)" resolves to L488-490
  (a4).
- Unresolved in the analyses: L473-475 "Fifth instance of the class this week" and L531-533 "last
  week's five hand-kept counts" (a4).
- L726-732 "this napkin's 2026-09-23 evening section" resolves to L616 and L641 (a6).
- L928-936 (the owner's catches) resolves to L841-849 (a7). The thread record's Owed list cites "the
  napkin, 2026-09-24 midday section" (L839-891) and the "2026-09-24 wrap section, "Trial close-out
  list"" (L782-786) (a7).
- L1151-1158 "recurred in a second seat the same day (Blazar lifts Corona)" resolves to L849-851 (A51).
- L1199-1202 "Blazar lifts Corona's 2026-09-23 section saw the same" resolves to L586-593. a8 searched
  "redirect" and did not find it; a5 quotes the matching text, "The pre-push hook's output did not
  reach the log captured from `merge-bot push`".
- L873-879 "The third gloss overreach on owner words in this arc" resolves to the two recorded at
  L701-706 (A64).
- L812-817 "A second instance of #174's "categories over an enumeration" generator" resolves to
  L346-348 (A36).
- L1068-1071 "Second and third zsh word-splitting instances in this seat's tenure" (Marten): the analyses
  do not identify Marten's first instance; L955-960 is Swallow's.
- L1263-1264 "a fourth time" (Swallow): the earlier instances include L946-954.
- L1343-1348 "The line above" resolves to L1308 (a9). L1435-1444 corrects the L1363 entry (a9).

**F-ids.** These resolve in the `register`: F-26 (:566), F-102 (:1731), F-121 (:2397), F-138 (:2714),
F-177 (:3562), F-181 (:2130), F-183 (:2205), F-189 (:3722), F-191 (:3786), F-195 (:3858),
F-197 (:3925) and F-198 (:3945). F-95 (L1164-1165, L1275-1277) is cited only through the thread record
and the plan; no analyst located the entry.

**PDRs.** These resolve:

- PDR-027 (:143-149)
- PDR-052
- PDR-057 (:212)
- PDR-063 (:334-336)
- PDR-094, via the `consolidate-docs`:461 watermark gate
- PDR-110 (:38)
- PDR-117 (:456-458, :806)
- PDR-125 (:10-11)
- PDR-131 (:53)
- PDR-140: clause 4 (:154-161), clause 8 (:196-204), clause 9(a) (:211-214), clause 9(b) (:218-225)
- PDR-142 (:40-42, :114-116, :135-136, :144-152, :203-205; :193-198 on `origin/engraph`)

PDR-130 is cited (L220-224, L244-248) but not located by line. PDR-134's "knowledge strata" is
mentioned only as a different concept. PDR-141 appears only inside a commit subject (L707-710).

**ADRs.** These resolve: ADR-187 (`187-claude-self-modification-authorisation-cure-shape.md`),
ADR-180 §6 (:122), ADR-127 (:54) and ADR-144 (:34).

**PRs the analyses verified as merged.**

- #159 `efb2942e9`; #160, #161 and #162 (2026-09-20); #163; #166; #167
- #173 `685ad538c`; #174 `047b04f59`; #175 `0ea8fb232`; #177 `138e0128f`
- #180 `3a1d47873`; #181 `98e059ac5`; #183 `0d6924427`; #184 `507d13931`; #186 `418671f16`
- #188 `fcbaa9bf5`; #189 `a0a2fead4`; #190 `45c838297`; #193 `07d80ec02`; #194; #196 `1a4450a69`
- #209 `17d030cb0`, on `engraph` only
- jimcresswell.net #162

**Unresolved references.**

- "row 20" and "63 / 0 of 28" (L190-192): Dynamo's table is not in the tracked reports (a2).
- "D8 plan" (L104): a1 infers §D item 8 of the carried-code-findings report.
- "the letter" (L394-395) and "VERSION THREE" (L438-443) (a3).
- "the substantive-event mover" (L52-54) (a1).
- "the owner-facing report" (L497-507) (a4).
- "tiers of attention" (the L692 heading) and "two exchange lanes" (the L616 heading) are not described
  in the bullets (a5).
- "the sender's checklist" (L1041-1044) (a7).
- "the cost survey" (L191-193) (a2).
- the falsifiers of L1192 (A97) (a8).
- the 2026-09-23 journal and wrap report (L812-817) (a6).
- "Blazar's earlier question" (L1009-1011) and "Blazar's handover push" (L961-971) (a7).

**Ids that are not git revisions.**

- `c70341` is a session prefix (a6).
- Comms event ids: `4b4a0cab`, `e432959b`, `c6ffb652`, `dc7c5491`, `b6907867`, `942fd3b0`,
  `269c5e97`, `a0920f55`.
- Claim ids: `8b37f3d1`, `48a715a4`, `372ac08b`, `2368c96b`, `a63a7df8-…`, `141892a7-…`.

### E.4 The coordination branch lags `origin/engraph`

These items read as unhomed on this branch but are present on `origin/engraph`. A curator reading the
working tree alone would misjudge them.

- L663-690 and L742-759: the research note §2.9 and plan rule 9 (a5, a6).
- L722-727: the slice 1a landed marker in the `node` (a6).
- L978-987: the EMFILE cure, #193 (a7).
- L1086-1092: the code-expert pairing row, `9a9fbd285` (a7).
- L1445-1452: PR 209's `PreCompact` hook and the tracked-listing plan (a9). L1445-1452 states this
  lesson itself (A110).

### E.5 Non-durable surfaces the entries rely on, and a napkin-only record

**Gitignored or untracked surfaces.**

- `.agent/state/collaboration/handoffs/*`, gitignored by `.agent/state/collaboration/.gitignore:17`:
  - the 281e44 large-records handoff;
  - the 516619 pause record;
  - the 74fc02 batch-four handover and exchange-lane handoff;
  - the PR G patch;
  - `instruments-2a4c8a/context-usage-check.py`, which holds the "unreadable" cure of L193-195.
- The scratchpad `paused-analyst-brief.md` ("the STATE rule" of L180-186, L236-240 and L251-262).
- The comms stream.
- `.agent/practice-core/incoming/jcnet-batch-3/` (untracked).
- `.claude/settings.local.json` (untracked).

The 281e44 handoff record also carries one lesson that is not in the napkin (a2): "a deletion
pre-staged with `git rm` makes the ceremony's `git add <path>` fail ("did not match any files"); cure —
`git reset -- <path>` so the deletion is unstaged, then the ceremony stages it by pathspec. One
instance."

**Held only in this napkin.** The trial close-out thread-id list (L782-786) exists nowhere else in
`.agent/`. The thread record points to it by section name (`codex-dialogues record`:414-416), so the
archive must keep it and the pointer must still resolve after the move (a6). Per the analysts'
searches, the owner quotations C13 and C17 also appear only in the napkin.

**Thread record line numbers.** a7 reports that another seat was editing the
`codex-dialogues record` during the analysis: HEAD has 440 lines, the working copy 462, and the Owed
lines are shifted by 22. a7 cites HEAD. a6, a8 and a9 do not say which version they read; their
:382, :384 and :404 match a7's HEAD numbers.

### E.6 Patterns that appear only when the analyses are read together

- **Five seats' wraps each end with an "outside eyes" target** (A27), and a sixth line, L787-791,
  shares the shape. The targets differ each time.
- **"The check fuses into the act's own command"** recurs as a cure shape across seats:
  - L96-100: "Chain edits to commits with `&&`".
  - L1093-1099: a merge form that reads the head SHA "in the same command".
  - L1108-1110: the worktree and the claim "in one step".
  - L1124-1128: the inventory "in the same command as the removal".
  - L1315-1321: "the check runs inside the act, not before it".
  - L1483-1486: `date -u` "inside the append command itself".

  None of these names the others.
- **The staged-set loss recurs on three dates** (L214-216, L454-458, L630-634), and none of the
  entries cites another (A23). L459-462 records that the seat's own tooling's status read rewrites
  the index. L630-634 names "a concurrent writer to the shared index" as the untested candidate.
- **The Codex connector's clean-review transport** is raised in three pieces (A20). Only a2 and a8
  cite F-198.
- **The statusline log** is raised in two pieces (A73). Only a7 cites F-181.
- **The commit-message lint** gap: five items from two seats (A65). **`session-metadata`**: four items
  from three seats (A49).
- **Cricket skill candidates** come from five entries: L565-577 (the tally and the UNGROUNDED floor),
  L1012-1016 (frame verdicts), L1183-1185 (the accepted sixth requirement), L1287-1288 (a frame file)
  and L1327-1331 (git-ref citations).
- **`directive-file-context-budget` candidates** come from two seats: L821-823 (A71) and L991-997
  (A81).
- **Owner rulings on peer messaging.** The 2026-09-23 ruling, "questions and requests only"
  (L618-623), is homed in `route-blocks-and-questions-to-director`. The 2026-09-24 words, "neither a
  question not a request, but it should be useful information" (L1050-1057), refine it and are ABSENT
  (A88).
- **Reviews before and after the vendors.** L1359-1361 ("The reviews that did the work came before
  external review") is the converse of the generator recorded under L294-296 (`ledger`:84, "the
  estate's own code-expert and test-expert pass ran after the vendors rather than before ready").

### E.7 Items no analyst checked or could classify with confidence

No item was left unclassified.

**Not checked** (discarded associations and play seeds):

- L396-397 and L398-401 (a3).
- L714-718: play seeds, whose destination is the napkin per the free-play skill (a5).
- L1045-1046 (a7).
- L1166-1169: discards, whose ARC claim resolves through a9 (see E.2) (a8).

**Borderline classifications.**

- L180-186 and L231-233 are classed as predictions but are not PDR-130 predictions; L248-250 is an
  open question classed as an observation (a2).
- L416-418 are proposals with no falsifier, classed as lessons (a3).
- L560-563 is an open question for the owner (a4).
- L586-593 could be a correction or the seat's own error; L605-609 is a lesson that came from a peer;
  L635-639 is a decision enacted as machine state; L711-713 is an observation carrying a tool-gap claim
  (a5).
- L873-879 could be a mistake or a correction (a6).
- L1186-1188 and L1247-1251 are pending proposals classed as decisions (a8).
- L1343-1348 and L1435-1444 are labelled "Correction" but name no corrector (a9).
- At L46 it is ambiguous whether "(the continuity thread record)" also covers "the budget rule's scope"
  (a1).
- The preamble (L1-21) is unresolved: the frontmatter limit is 300 lines, while the rotation rule says
  "~400 lines" (a1).

### E.8 Cure surfaces named across all analyses, with the count of items naming each

**Counting basis.** Only A and B items count (262 of 333). An item counts once for each surface it
names, whether as the entry's named home, the analyst's `present at` path, or the analyst's nearest or
plausible home. Handoff-state and metaloss items are excluded.

| Surface | Items |
| --- | --- |
| frictions register, any entry | 31 |
| … no id named | 9 |
| … F-197 | 5 |
| … F-191 | 3 |
| … F-195 | 3 |
| … F-198 | 3 |
| … F-26, F-102, F-121, F-138, F-177, F-181, F-183, F-189 | 1 each |
| skill `pr-lifecycle` | 25 |
| record `repo-continuity.md` | 20 |
| skill `commit` | 16 |
| skill `consolidate-until-done` | 15 |
| directive `continuity-practice.md` | 14 |
| record `review-cost-ledger.md` | 14 |
| record `codex-dialogues` thread | 13 |
| rule `verify-dont-trust` | 13 |
| pattern `harness-shell-and-commit-edge-cases` | 10 |
| plan `the-codex-dialogues-exec-binding` (the node) | 10 |
| PDR-142 | 9 |
| record continuity thread (`continuity-memory-and-knowledge-flow`) | 9 |
| rule `no-unbounded-host-load` | 8 |
| PDR-140 | 7 |
| record `estate-coordination` thread | 7 |
| rule `bot-identity-on-third-party-systems` | 7 |
| `.agent/hooks/policy.json` | 6 |
| report `2026-09-24-records-that-outrun-their-evidence-retrospective` | 6 |
| rule `comms-all-channels-watcher` | 6 |
| skill `cricket` | 6 |
| channel `2026-09-21-three-estate-practice-exchange` | 5 |
| directive `metacognition.md` | 5 |
| rule `hook-policy-substring-discipline` | 5 |
| skill `comms-channels` | 5 |
| skill `coordination-fold` | 5 |
| code `session-metadata/window-registry.ts` | 4 |
| pattern `query-the-value-never-the-lookalike` | 4 |
| plan `codex-queue-wake-bridge` | 4 |
| report `context-loop-experiment-working-seat-2026-09-19` | 4 |
| report `seat-instruments-zephyr-guards-leeward-2026-09-23` | 4 |
| skill `set-up-worktree-lane` | 4 |
| skill `wrap` | 4 |
| code `agent-tools` merge-bot | 3 |
| code `agent-tools` collaboration-state | 3 |
| code `agent-tools` hook-policy (argv) | 3 |
| directive `testing-strategy.md` | 3 |
| pattern `timing-artefact-read-as-state` | 3 |
| pattern `zero-match-false-green` | 3 |
| report `context-loop-experiment-dynamo-turns-temper-2026-09-19` | 3 |
| research `codex-support-concept-exploration-2026-09-23` | 3 |
| rule `directive-file-context-budget` | 3 |
| rule `exit-codes-in-band-never-piped` | 3 |
| rule `liveness-heartbeat-cron` | 3 |
| rule `route-blocks-and-questions-to-director` | 3 |
| rule `use-monitor-for-event-driven-wake` | 3 |
| skill `consolidate-docs` | 3 |
| skill `session-handoff` | 3 |
| skill start-right (team, quick, thorough) | 3 |
| `.husky/commit-msg` | 2 |
| PDR-125 | 2 |
| code `agent-tools` skills-adapter-generate | 2 |
| code smoke test `comms-watch-coordination-home` | 2 |
| directive `agent-collaboration.md` | 2 |
| `distilled.md` | 2 |
| machine-local scratchpad `paused-analyst-brief.md` | 2 |
| pattern `claim-before-check` | 2 |
| pattern `passive-guidance-loses-to-artefact-gravity` | 2 |
| reference `arc-rapid-communication.md` | 2 |
| rule `directed-routing-requires-absorption-ack` | 2 |
| rule `one-instance-is-an-observation` | 2 |
| rule `precedence-is-not-approval` | 2 |
| rule `records-are-technical-not-emotional` | 2 |
| rule `review-feedback-defaults-to-triage` | 2 |
| rule `stage-by-explicit-pathspec` | 2 |
| rule `verify-vendor-call-shapes-at-plan-author-time` | 2 |
| rule `worktree-hygiene` | 2 |

**Surfaces named by one item each:**

- **PDRs and ADRs:** ADR-127, ADR-144, PDR-052, PDR-057, PDR-063, PDR-110, PDR-117, PDR-131.
- **Records, archives and incoming bytes:** the PR #163 body; the archive
  `frictions-register-2026-09-20`; the claims registry; the paused thread records;
  `pending-graduations.md`; `incoming/jcnet-batch-3`.
- **Code:** `agent-tools` (the channel append); `agent-tools` pr-tally; `agent-tools` pr-watch;
  `agent-tools` commit-advisories; `agent-tools` commit-queue; `operator-profile-keys.ts`.
- **Docs and local files:** `docs/governance/development-practice.md`;
  `docs/engineering/pr-label-ledger.md`; the experience file `2026-09-21-zephyr-guards-leeward-…`;
  `.claude/settings.local.json`.
- **Machine-local files:** `context-usage-check.py`; the 74fc02 handoff record; the 516619 pause
  record.
- **Patterns:** `enforce-via-schema-not-prose-for-vendor-surfaces`, `honest-restructure-over-band-aid`,
  `observer-must-see-the-terminal-state`, `pr-monitor-to-merge`, `quote-authoritative-language-exactly`,
  `signal-read-as-fact`, `timing-derived-state-is-the-defect`, and the patterns directory with no file
  named.
- **Plans:** `best-of-each-practice`, `codex-pretooluse-guard-parity`, `upstream-carrier-workflow`,
  `workspace-classification-census`.
- **Reports:** `carried-code-findings-1.185.0`, `why-the-register-stayed-at-twelve`.
- **Rules:** `check-singleton-per-window`, `coordination-branch-24h-lifetime`,
  `design-work-for-small-prs`, `important-state-not-in-temp-files`, `invoke-code-experts`,
  `invoke-doc-and-onboarding-experts-on-significant-changes`, `lockfile-rebuild-survivability`,
  `new-rule-vs-pdr-clause`, `no-hedging-vocabulary`, `present-verdicts-not-menus`,
  `re-apply-first-question-at-elaboration-boundaries`, `read-before-asking`,
  `register-active-areas-at-session-open`, `ship-independent-coordinate-dependent`,
  `use-agent-comms-log`, `validators-must-recompute-not-just-record`, `worktree-residency`.
- **Skills:** `complex-merge`, `cross-fork-integration`, `inter-practice-collaboration`,
  `parallax-audit`, `start-right-team`, `the-codex-dialogues` (script), `update-dependencies`.
- **Templates:** `code-expert`, `cricket-judgement`.
- **Unidentified:** "the letter".

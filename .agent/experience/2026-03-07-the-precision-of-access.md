# The Precision of Access

_Date: 2026-03-07_
_Tags: debugging | cross-repo | bug-reporting | metacognition_

## What happened (brief)

- Conducted a live black-box smoke test of the deployed oak-preview MCP server, classified six findings by ownership (our code, upstream API, stale data), fixed two defects with TDD, and wrote a precision upstream bug report citing exact file/line references from the upstream source.

## What it was like

- The smoke test surfaced a mix of real issues and noise. The instinct was to start fixing immediately, but the classification step — asking "whose code is this?" before "how do I fix this?" — prevented wasted effort. One finding turned out to be stale indexed data, not a code defect at all. Another was an upstream content-gating inconsistency that no amount of downstream code would solve.
- The most satisfying part was writing the upstream bug report. Having access to the upstream source code transformed the report from "this endpoint returns 400" into "line 54 of `lesson.ts` calls `blockLessonForCopyrightText` while line 33 of `transcript.ts` calls `checkLessonAllowedAsset`, and these two functions apply fundamentally different gating logic." The difference in actionability was enormous — the upstream team can read the report and go straight to the fix.
- There was a small discovery that the `.agent/reports/` directory was silently gitignored by a broad `**/reports/` pattern intended for Node.js diagnostics. A useful reminder that broad ignore patterns can quietly swallow new directories.

## What emerged

- Classification before action is a force multiplier. When a live system surfaces multiple issues from multiple sources, the first job is sorting, not fixing. The sort itself is a deliverable.
- Precision in bug reporting scales with access. A vague report costs the upstream team hours of triage; a precise one costs them minutes. If you have the source, cite the source.
- Black-box testing of your own deployed service reveals things that unit tests cannot: the interaction between stale data, live gating logic, and runtime schema validation. The suggestion URL schema violation only appeared because the live suggest pipeline returned `url: ''` — the test fixtures never produced that value.

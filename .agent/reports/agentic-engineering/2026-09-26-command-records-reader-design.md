# The command-record reader: design v4, its amendments and the evidence (2026-09-26)

Conserved at compaction boundary 5 by Swallow holds Drift (516619) from the seat's scratchpad, where the three documents below were written and reviewed during the day. The design was reviewed pre-execution by code-expert and test-expert (v3 REVISE each; v4 confirmed at 20:33Z); the amendments record what the reviews and each cycle's execution changed, and win where they differ from the design. The implementation is the pull request opening from branch `feat/codex-rollout-command-records` (`codex-exec command-records`, ADR-180 §2). File names in the text (`command-records-evidence.md`, `command-records-design-v4-amendments.md`) name the sections of this document.

---

# Design v4: `codex-exec command-records`, a seat-rollout command-record reader

Seat: Swallow holds Drift (516619). 2026-09-26 about 20:30Z. Supersedes v3 after the code-expert's
and test-expert's v3 reviews (REVISE each). Evidence: `command-records-evidence.md` and the source
lines both reviews confirmed (codex-rs 0.157.1). Prepared locally under the WIP limit.

## Goal · In · Out

**Goal.** Condition 5's second indicator: from a Codex seat's rollout, an admissible summary of the
commands on the landing path, saying which forbidden shapes RAN, which were REFUSED by the exec
policy, how many process interactions the sandbox DENIED, and how many exec tool calls left no
harness record, without publishing the rollout or its command history.

**The exec family.** Requests: `response_item.custom_tool_call` named `exec` (code mode);
`response_item.function_call` named `exec_command`, `write_stdin` or `shell_command`
(`tools/router.rs:165`, `tools/registry.rs:385`). Outputs carry no name, so each
`custom_tool_call_output` or `function_call_output` is joined to its request by `call_id` within
the turn (the existing `pendingCallIds` pattern); an output whose request is not exec-family is
ignored; an exec request unanswered when the rollout ends is `unaccounted` (the reader counts
at the end of the stream, not at `task_complete`; corrected 2026-09-27 on the cycle 3 review).

**Evidence, from harness-authored records only.**

| Class | Source | What is read |
| --- | --- | --- |
| executed | `event_msg.item_completed`, `item.type: CommandExecution`, `source` `agent`, `user_shell` or `unified_exec_startup` | `command` (non-empty string array), `status` (closed: `in_progress`, `completed`, `failed`, `declined`), `source` (closed, `items.rs:262`, required), `exit_code` (a number when present), the event's `turn_id` |
| interaction | the same item with `source: unified_exec_interaction` | `interaction_input` (a string) scanned as a command line; its `command` is the startup argv and is NOT scanned again |
| refused | an exec-family output whose harness text carries `Rejected("` … `` rejected: `` … `")` (both carriers wrap the exec-policy message as `exec_command failed: CreateProcess { message: "Rejected(\"…\")" }`, `exec_command.rs:474`, `process_manager.rs:1548`; the bare `` `<command>` rejected: <justification> `` reaches an output only for `shell_command`, `events.rs:469`), or `write_stdin rejected: <reason>` (`write_stdin.rs:110`); or a CommandExecution item with `status: declined` | the judged command line (a shlex rendering, `exec_policy.rs:1051`) and the justification; the four justification shapes of `exec_policy.rs:1081` to `1092` |
| denied | an exec-family output whose harness text carries `Command denied by sandbox:` (`errors.rs:25`, Display; reaches an output only as `write_stdin failed: <err>`, `write_stdin.rs:116`; the message is a stderr snippet with NO command line) | a count; no argv |
| accounted | a code-mode output whose wrapper reads `Script completed`, or a function-tool exec output carrying no shape above | a count per turn |
| unaccounted | a code-mode wrapper reading `Script failed` with no anchored refusal or denial, `Script terminated`, `Script running with cell ID …` (`code_mode/mod.rs:296`), any exec output carrying a truncation marker (`hasTruncationMarker`), or an exec request unanswered when the rollout ends | a count per turn, inconclusive |
| malformed | a CommandExecution item whose `command` is not a non-empty string array, whose `status` or `source` is outside its enum, whose `exit_code` is present and not a number, whose `interaction_input` is present and not a string, or whose event has no string `turn_id`; an exec output that is neither a string nor the harness's parts array; a repeated `task_started` turn id | line and a reason that never carries the raw token |

Residual, documented and shown by run 1: an `exec_command` startup denial is caught and returned to
the program as an ordinary result (`exec_command.rs:448`), so it reads `accounted`; a program that
catches an error and continues reads `Script completed`. The seat rules and the read-only `.git`
govern execution; the indicator observes an honest seat.

Harness text sits in two carriers, both observed first-hand: a JSON string (run 1's outputs) or an
array of `{type, text}` parts (run 2's, and the 0.157.0 fixture). Text under `Script completed …
Output:` is the program's and is never matched. The `Debug` rendering is unescaped once (`\"`,
`\\`, `\n`) before the backticked command line is read.

**In.**

- `agent-tools/src/codex-exec/command-records/index.ts`: the module boundary (as `rollout/` has).
- `read-command-records.ts`: `readCommandRecords(lines): CommandRecordsSummary`. Never throws. Blank
  lines skipped with physical line numbers kept; a non-object line → `invalidLines`; every record
  type counted; `task_started` starts a turn (a repeat → `malformed`; the first counts); exec
  requests recorded by `call_id` per turn; outputs joined and classified through `harness-text.ts`;
  items classified as the table says; every executed argv, interaction line and refused command
  line goes through `shellSegments` then `flagCommand`. `isRecord` from `rollout/record-shapes.ts`
  is its second consumer.
- `shell-segments.ts`: `shellSegments(argv): readonly (readonly string[])[]`. POSIX word splitting
  with quote REMOVAL (single, double, `'\''`), splitting on `&&`, `||`, `;`, `|` and newlines at
  unquoted positions only. The shell front door is applied recursively: when a segment's program
  basename is `sh`, `bash` or `zsh` and `-c`, `-lc` or `-ic` precedes the script, the script is
  segmented again (so `/bin/zsh -lc 'git push origin HEAD'`, the refusal fixture's line, yields
  `[git, push, origin, HEAD]`); `bash -c 'echo "git push"'` yields `[echo, git push]` and stays
  clear. A command line arrives as `["sh","-c",line]`.
- `flag-command.ts`: `flagCommand(segment): readonly Hit[]`. The program is found after leading
  `NAME=value` assignments and the wrappers `env`, `sudo`, `command`, `exec`, `nice`, `time`; for
  `git`, the subcommand is the first token after `git` that does not start with `-`, skipping the
  value token of `-C` and `-c`. `ForbiddenShape` carries verbatim the three forbidden `prefix_rule`
  patterns of `.codex/rules/seat-landing.rules` with their `match`/`not_match` examples and the
  estate rule each operationalises; matching is token-anywhere after the subcommand, wider than the
  harness's positional prefix (`git commit -F m --no-verify`, `-an`, `-n`), and the doc says so.
  Option-shaped patterns stop at a bare `--`: git's grammar is `git add [<options>] [--]
  <pathspec>...`, so a pathspec literally named `-A` or `--all` after `--` is a file, not the
  whole-tree form, and `--strict` must not exit 1 on it (the Codex connector's finding at the
  fold's review, 2026-09-27); the whole-tree `.` pathspec stays detectable after `--`.
  Pairing is by pattern (the rules are anonymous, `execpolicy/src/parser.rs:349`). The
  consolidation validator (a repo-file reader asserting the rules' forbidden patterns equal this
  table, reachable from `repo-validators:check`) is named in the PR body as its own lane.
- `harness-text.ts`: `readHarnessText(output: unknown): HarnessText` — the carrier decoded
  (string, JSON string, parts array; else `malformed`), the code-mode wrapper status (`completed`,
  `failed`, `terminated`, `running`, `none`), and `refusal { commandLine; justification }`,
  `denied`, `truncated` when anchored as the table says. `completedPreamble` from
  `rollout/code-mode-output.ts` and `hasTruncationMarker` from `record-shapes.ts` are consumed, not
  copied.
- `summary.ts`: closed `readonly` shapes — `CommandRecord`, `FlaggedCommand { kind: 'executed' |
  'interaction' | 'refused'; line; turnId; rendered; hits; justification }`, `Malformed`,
  `TurnAccount { turnId; calls; accounted; refused; denied; unaccounted; executed }`,
  `CommandRecordsSummary { turns; commands: number; flagged; accounts; recordTypes; malformed;
  invalidLines }` — and `renderSummary(summary, format)`. Rendering by ALLOWLIST: a segment prints
  as its program basename, its subcommand, its long flag names (left of `=`) and short options as
  `-<letter>` alone (never an attached value), `<arg>` for every other token; the raw script token
  never prints; `cwd` is never carried; `commands` is a count; argv renders only for flagged
  entries; a justification prints with any backticked command rendered the same way.
- CLI: `codex-exec command-records [--format text|json] [--strict]` in `cli.ts`, stdin JSONL,
  `readLines` reused. Exit 0 with the summary on stdout. `--strict`: exit 1 when `turns === 0`, any
  flagged entry of kind `executed` or `interaction`, any `unaccounted > 0`, any `malformed` or
  `invalidLines`; the summary still prints to stdout, the reason to stderr. `refused` and `denied`
  alone print and pass. A bad `--format` exits 2 with the usage.
- Fixtures: `observed-seat-exec-0-157-1.json` (run 1: four exec calls, four accounted, three
  executed with `source: unified_exec_startup`, zero unaccounted; the denied fourth call returned
  into the program) and `observed-seat-refusal-0-157-1.json` (run 2: one call, one refused, zero
  unaccounted; the parts-array carrier). Both projections of this seat's sandboxed runs in
  Paginated history mode, keeping `type`, `payload.type`, `item.type`, `command`, `status`,
  `source`, `exit_code`, `turn_id`, `call_id`, tool-call `name` and the harness text with the
  machine path replaced; ids fixed; `cwd`, program text and stdout dropped. The header says the
  interaction shape (`source: unified_exec_interaction`, `interaction_input`) is source-read, not
  observed, and is exercised by edited copies only.
- Tests (behaviour only; expected counts derived by a helper that SELECTS and asserts non-empty,
  never classifies wrapper text; every bad value in a fail-closed row carries a nonce so "the reason
  never carries the raw token" bites):
  - `read-command-records.unit.test.ts`: the exec fixture reads as its derived turns and commands
    with `accounts[0]` at calls 4, accounted 4, executed 3, unaccounted 0 and zero flagged; the
    refusal fixture reads as one `refused` entry (`push-outside-the-bot`, the nested-shell lift)
    with its justification, `accounts[0]` at calls 1, refused 1; a copy with a second appended
    turn carrying `git commit --amend` reads as one `executed` entry with that turn id and line,
    `accounts[1].executed === 1`, `accounts[0].executed === 0`; two flagged records in two turns
    report lines ascending; `bash -lc 'git add -A && git push'` reports two hits on one entry;
    `git commit -m "a && b"` one unflagged command; an interaction item with `interaction_input`
    `git push\n` reads as `interaction` and its startup argv is not flagged again; a
    `write_stdin rejected:` output reads as refused; a `write_stdin failed: Command denied by
    sandbox:` output reads as denied with no argv; `Script failed` without an anchored shape,
    `Script terminated`, `Script running`, a truncated output and an unanswered exec request each
    read as `unaccounted`; a non-exec `function_call_output` is ignored; the fail-closed `it.each`
    (command absent, `[]`, a string, a non-string element, no `turn_id`, `status` and `source`
    outside their enums, `exit_code` a string, `interaction_input` a number) reads as `malformed`
    and not as a command; a repeated `task_started` id reads as malformed with `turns` counting the
    first; a record type outside the vocabulary is counted; a blank AND an invalid line before a
    flagged record leave its physical line number intact and count one invalid line; no commands
    reads as zero, not an error.
  - `shell-segments.unit.test.ts`, `flag-command.unit.test.ts`: the three rules' `match` examples
    flagged, their `not_match` and allowed examples clear; `git add --all`, `git commit -F
    message.txt --no-verify`, `git commit -n`, `git commit -an`, `KEY=v git push`, `env git push`,
    `sudo git push`, `git -C x commit --amend` flagged; `pnpm agent-tools merge-bot push --branch
    feat/example`, `bash -c 'echo "git push"'`, `git commit -m "git push"` clear; one row per
    separator with the forbidden segment second; `it.each` over `sh -c`, `bash -lc`, `zsh -lc`,
    `/bin/zsh -lc`, `/bin/bash -lc`; the nested lift of `/bin/zsh -lc 'git push origin HEAD'`.
  - `harness-text.unit.test.ts`: each of the four rejection shapes reads from the double-escaped
    carrier and from the bare `shell_command` carrier, in the string and the parts-array forms;
    `write_stdin rejected:` and `Command denied by sandbox:` read; the same words under `Script
    completed … Output:` read as none; a truncation marker reads as truncated; a non-text output
    reads as malformed.
  - `summary.unit.test.ts`: a flagged command carrying a user-home path, a tilde path,
    `--cwd=<path>`, `KEY=<path>`, an scp-style URL, `-m "<message>"` and `-C<path>` renders with
    none of them present and with `git`, `commit`, `--no-verify` and `-C` present, in text and
    JSON (the same relation in both forms, never string equality between them); a non-flagged
    command's argv appears in neither; a justification carrying a backticked command renders it
    the same way; text lines assert by relation.
  - `cli.integration.test.ts` (new; the existing `runCodexExecCli` describes move here with the
    `makeIo` helper lifted to a shared test helper): text, JSON, strict on empty input (exit 1),
    strict on a flagged executed fixture (exit 1, summary on stdout, reason on stderr), non-strict
    empty input (exit 0), a bad `--format` (exit 2), the usage naming the subcommand.
  - The `rollout/test-helpers/rollout-records.ts` fixture-generic helpers are parametrised by
    fixture and shared. No test reads the rules file or compares the `ForbiddenShape` table's
    contents; the validator owns divergence.
- Delivery in vertical cycles, each greening the CLI surface so no module is consumed only by
  tests mid-sequence: (0) the pure refactor, `makeIo` and the fixture helpers lifted; (1) the
  reader over executed items and turns, the summary, the CLI with `--format` and `--strict`, the
  exec fixture; (2) `shell-segments` and `flag-command`, the flagged entries, the redaction; (3)
  `harness-text`, the call-id join, refused, denied and the per-turn accounts, the refusal
  fixture. Each cycle: red tests, green, post-execution code-expert. One PR.
- Docs: the `codex-exec` usage text and the module's TSDoc; the exec-binding node's dispositions
  take the instrument, the residuals and the consolidation lane at the records commit.

**Out.** The two-turn dialogue reader and its fixture; the seat-landing rules and their
consolidation validator (named, waiting for a slot); parsing `custom_tool_call.input` or
`function_call.arguments`; configuration of the flag set; wiring into the probe or the door; the
upstream gap (a startup denial after exit emits no item; recorded, not cured).

## Estate rules applied

No `throw`; closed `readonly` shapes and closed enums validated at the boundary; `max-lines` 250;
knip (every export consumed by the CLI or a sibling module, never tests alone); S3358; S4036;
tests describe behaviour and never inspect calls, pin config or read the disk; consolidate at the
second consumer (`readLines`, `makeIo`, the fixture helpers, `hasTruncationMarker`,
`completedPreamble`, `isRecord`; the rules' patterns carried verbatim with the validator named;
and, from cycle 5, the shell segmenter itself, consumed from `agent-tools/src/shell/`);
one PR, one story; ADR-088's Result posture where a caller needs a reason.

## Falsifiers

`git commit --no-verify` run through `/bin/zsh -lc` on the landing path and a summary showing zero
executed flags: the segmentation or the front door is wrong. A refused `/bin/zsh -lc 'git push
origin HEAD'` and a summary showing zero refused: the parser or the quote removal is wrong. A
program that ran `git status` and then had `git add -A` denied at startup, reading clean: the
documented residual. A later release renaming `command`, a status value or the router's message:
malformed evidence or a rising `unaccounted`, never a clean zero.

---

# Design v4 amendments (binding), from the code-expert confirmation pass at 20:33Z

Read with `command-records-design-v4.md`; where they differ, these amendments win.

1. **Carriers.** Run 2's refusal output is a JSON STRING carrier, as run 1's are. The parts-array
   carrier is evidenced by the 0.157.0 dialogue fixture (`observed-code-mode-0-157.json`) and is
   exercised by `harness-text` unit rows, not by the refusal fixture. The design's evidence line is
   corrected accordingly.
2. **Anchor position.** In a code-mode `Script failed` output the program's own content parts come
   FIRST and `Script error:\n…` is appended LAST (`code_mode/mod.rs:275–285`). The refusal or
   truncation match is anchored to the text AFTER the last `Script error:\n`; in a function-tool
   output it is anchored at offset 0. "Carries" becomes "opens with" at that anchor. Text before the
   last `Script error:` is the program's and is never matched.
3. **No `denied` class.** On 0.157.1 `SandboxDenied` is raised only at startup and swallowed into an
   ordinary result (`exec_command.rs:448`), and `write_stdin` raises no denial variant
   (`process_manager.rs:876–1000`), so the harness never writes `Command denied by sandbox:` into a
   tool output. `denied` leaves `TurnAccount`, the goal and the summary; the anchor, if it ever
   appears, reads as `unaccounted`. The startup-denial residual stands as documented.
4. **`shell_command`.** A legacy `shell_type` alias with no live handler; the live built-ins are
   `exec_command` and `write_stdin`. Family membership stays (harmless); the bare-carrier rows are
   marked source-read, not observed, and kept to one row.
5. **Preamble reuse.** `completedPreamble` in `rollout/code-mode-output.ts` is unexported and
   anchored on a lone part, so it cannot serve the string carrier. The consolidation is a shared
   `readPreamble(text): { status; rest }` in `rollout/code-mode-output.ts` with `checkCodeModeOutput`
   rebuilt on it (behaviour unchanged, its tests untouched), consumed by `harness-text.ts`. It lands
   in cycle 3 with its first second consumer, never as a test-only export.
6. **Exclusive, ordered classes and an invariant.** Per exec call the classes are exclusive and
   decided in this order: `truncated` (→ unaccounted), then `refused`, then the wrapper status
   (`completed` → accounted; `failed`, `terminated`, `running`, `none` → unaccounted); an unanswered
   request is unaccounted. Every summary satisfies `calls === accounted + refused + unaccounted`
   per turn, and a test asserts it over both fixtures and every edited copy.

Accounting confirmed by the reviewer under these amendments: exec fixture 4 calls / 4 accounted /
3 executed / 0 unaccounted; refusal fixture 1 / 0 / 0 with 1 refused.

## Cycle 2 notes (2026-09-26, about 21:20Z), recorded at execution

7. **Separators.** A lone `&` (a background job) is a separator too, read as the same class as `;`;
   `&&` and `||` therefore read as two separators with an empty segment between them, which opens
   nothing. Wider than the design's list by one token, for the same reason the matching is wider
   than the harness's prefix.
8. **Where rendering lives.** `renderSegment` sits in `flag-command.ts` beside the program and
   subcommand finding it shares, not in `summary.ts`; the reader computes `rendered` at read time, so
   the raw argv never reaches the summary in either form. `rendered` is one string per segment; the
   text form joins them with ` ; `. One hit per segment, the first matching token; a script running
   two shapes reports two hits on one entry, as the design says.
9. **Deferred to cycle 3 with the refused class:** `justification` on `FlaggedCommand`, and the
   filter that keeps `refused` entries out of the `--strict` reason (in cycle 2 every flagged entry
   ran).
10. **Cycle 2 post-execution review (code-expert REVISE, test-expert REVISE then APPROVE), all taken.**
    Separators gain `(` and `)`, so a subshell and a `$(…)` substitution lift their command as a
    segment (fail-closed). Only a hit-bearing segment renders; the others print `…`, so a script's
    unrelated commands and data never reach the summary; every token after a bare `--` renders
    `<arg>`. The program is found past the reserved words `{ ! if then elif else while until do`
    and past the wrappers' long value options (`--user`, `--group`, `--chdir`, `--unset`,
    `--adjustment`). The front door reads the shell's option clusters (`-ec`, `-euo pipefail -c`,
    a cluster ending in `o` taking a value), in its own module `shell-front-door.ts` with
    `basename`. A here-document body (`<<EOF`, `<<-EOF`, `<< EOF`) is data through its terminator
    and yields no segment. A declined item, interaction included, is never scanned. Tests: no
    literal pin of the rules' justifications (the text form's relation to `justificationOf` is
    asserted in the summary test instead); one hit per segment however many tokens match; the
    shared `lineOf` and `HOME_PATH` in `seat-fixtures.ts`; nonces on every value the redaction
    test denies. Residual, documented in the module: a shape behind `eval` or inside a backticked
    command is not a segment.
11. **Cycle 3 notes, recorded at execution.** A declined `CommandExecution` item is not an exec
    call, so it stays outside the call invariant as its own count, `declined`, on the turn account;
    its argv (or interaction input) is scanned and joins the flagged entries as kind `refused` with
    no justification. The refused class from outputs keeps the design's reading. `redactJustification`
    renders every backticked command in a policy justification by allowlist. The reader split into
    `command-item.ts` (the item schema and its flagging), `exec-calls.ts` (the family, the
    classification, the refusal flagging) and `read-command-records.ts` (the folds), each under the
    line limit. `readPreamble` lands in `rollout/code-mode-output.ts` with `checkCodeModeOutput`
    rebuilt on it (behaviour unchanged, the completed-only strict match kept). Residual: the four
    justification shapes of `exec_policy.rs:1081` to `1092` are not carried verbatim; the parser
    takes any text after `rejected: `, and the tests use the observed justification plus nonces.

---

# Evidence for the command-records reader, read first-hand on codex-cli 0.157.1 (2026-09-26)

Two sandboxed `codex exec` runs by Swallow holds Drift (516619); rollouts stay private under the
owner's home; only redacted projections leave the machine. Both under `-s workspace-write`, stdin
closed, no full-access flag; every process exited on its own (read back by `ps`).

## Cycle 5 notes (2026-09-27, about 10:15Z to 11:10Z), recorded at execution

**Amendment 12: the reader reads shell words through the estate's segmenter, not its own.** The
design's premise that the splitter had one consumer was unsupported: `hook-policy/shell-words.ts`
(the Claude Bash guard's segmenter, landed 2026-09-10 with seven cure commits, consumed by
`blocked-patterns` and `argument-matcher`) reads the same words with a stricter bar, and
`argv-nested.ts` carried the same front door (the sh-like shells past a `c` cluster, `eval`, `ssh`).
A bounded assumptions-expert check, asked for by the cycle 3 reviewer after three cycles of local
growth, found it. Verified first-hand on the reader's 42 test scripts: 33 identical; the guard
carries `$(…)` and backtick bodies as nested commands, decodes `$'…'`, and joins `<<-END`; both
shared one defect, an unspaced `<` or `>` staying inside the word before it.

What changed: the segmenter, its helpers and the interpreter front door moved to
`agent-tools/src/shell/` (a pure move; hook-policy re-points); the defect is cured at that owner
(an ordinary word ends before `<`, `>` or `&>`; an IO number, a lone `&` or an operator so far
continues; a quoted or escaped operator character is text), closing the guard's argv-mode bypass
by a glued long option and proven at the matcher with a differential against the pre-change code;
the reader's `shell-commands.ts` lifts a harness argv through the segmenter, the front door and
every substitution body to depth 3, keeping the argv itself a command beside the lifted script (a
shape before a later interpreter operand is read, as the guard reads it); `shell-segments.ts`,
`shell-here-document.ts`, `shell-front-door.ts` and their 39 tests are deleted, the reader's
behaviours re-proven through a harness argv.

Residuals after cycle 5: a word an expansion would produce, `xargs`, `find -exec`, a git alias, an
abbreviated long option; the guard's fail-closed lift of a script word after any interpreter-named
word (`echo bash -c '…'` lifts a command that never ran). Closed: `eval`, backticks, `$(…)`,
`$'…'`. A rendered entry now shows the shell wrapper's own segment as `…` before the shape.

Amendment 3's premise on the first question stands corrected for the lane's method: before a lane
writes a parser, a matcher or a validator, the estate is searched for the noun first.

## Run 1: a throwaway repository, four plain commands (thread 01a0df44…)

- Default `codex exec` on 0.157.1 runs CODE MODE even with `--ignore-user-config`: each shell
  command is `response_item.custom_tool_call` with `name: "exec"` and `input` a JS program
  (`text(await tools.exec_command({cmd:"git status --short"}))`). Phobos's TUI seat produced
  `response_item.function_call` for the same tool family, so both request shapes exist.
- Each command that RAN left `event_msg.item_completed` with `item.type: "CommandExecution"`:
  `command: ["/bin/zsh","-lc","git status --short"]` (a string array, always shell-wrapped),
  `status: "completed"`, `exit_code`, `parsed_cmd`, `source: "unified_exec_startup"`, `cwd` as a
  `file://` URI carrying the machine path, `stdout`/`stderr`/`aggregated_output`; the event carries
  `turn_id` and `thread_id`. Item `id` is `exec-<uuid>`, unrelated to the tool call's `call_id`.
- The fourth command, `git add -- note.txt`, was DENIED by the sandbox after spawning (`.git` is
  read-only under workspace-write; git exited 128 with "Unable to create '<path>/.git/index.lock':
  Operation not permitted"). It left NO CommandExecution item, started or completed, in the
  rollout or in the `--json` event stream. Its only trace is the tool output: the code-mode wrapper
  "Script completed … Output:" followed by the program's own printed JSON (`exit_code: 128`),
  which is model-mediated text.
- Record types seen: `session_meta`, `event_msg.{task_started,item_completed,token_count,
  task_complete}`, `response_item.{message,custom_tool_call,custom_tool_call_output}`,
  `world_state`, `turn_context`, `token_usage_record`.

## Run 2: the trusted primary checkout, one forbidden command (thread 01a0df48…)

- Asked to run `git push origin HEAD`, which `.codex/rules/seat-landing.rules` forbids. The exec
  policy REFUSED it before any process spawned: the harness logged
  `codex_core::tools::router: error=exec_command failed: CreateProcess { message: "Rejected(…)" }`
  and the model received the rule's justification. The branch stayed level with its remote.
- The rollout holds NO CommandExecution item for it. The harness-written tool output is:
  "Script failed\nWall time 0.0 seconds\nOutput:\n" then "Script error:\nexec_command failed:
  CreateProcess { message: \"Rejected(\\\"`/bin/zsh -lc 'git push origin HEAD'` rejected: Push
  with `pnpm agent-tools merge-bot push --branch <branch>`, which refuses force and default
  branches.\\\")\" }". The judged argv and the rule's justification are both the harness's text
  (the program never ran).

## What follows for the instrument

1. Executed commands are evidenced by CommandExecution items and nothing else; their argv is the
   harness's, always shell-wrapped on this platform, so shell segmentation is the front door.
2. Refused commands are evidenced by the harness's `Rejected("<argv> rejected: <justification>")`
   message inside a tool output (code-mode wrapper "Script error:" or a function-tool output); the
   argv inside it is the policy's input and is flag-scanned like an executed argv.
3. Sandbox-denied commands leave no harness record. They and multi-command programs make the
   per-turn accounting inexact: the reader reports exec-family tool calls beyond executions plus
   refusals as `unaccounted`, an inconclusive count, never a clean zero. A denied command inside a
   program that also ran another command is invisible; documented residual.
4. Upstream observation (one instance, 0.157.1): a sandbox denial detected after the process
   exited emits no CommandExecution item, although `events.rs` emits one on every stage; the
   unified-exec startup path returns the denial error before the watcher's end item. Recorded for
   the report, not a rule.

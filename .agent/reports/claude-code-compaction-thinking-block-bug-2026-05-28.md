# Claude Code Bug Report — Compaction Fails on Extended-Thinking Blocks

**Date**: 2026-05-28
**Reporter**: oak-open-curriculum-ecosystem team
**Product**: Claude Code CLI
**Version**: 2.1.153 (every transcript record in all affected sessions stamps this version)
**Model**: Opus 4.7 (`claude-opus-4-7`), extended thinking enabled
**Platform**: macOS (darwin)
**Upstream**: canonical issue [anthropics/claude-code#12311](https://github.com/anthropics/claude-code/issues/12311)
("Auto-compact fails with Opus extended thinking blocks"); duplicate
[#13012](https://github.com/anthropics/claude-code/issues/13012). Reported addressed in
2.0.67 with a resume-case follow-up; this report is a fresh recurrence on **2.1.153**.

---

## Summary

Both auto-compact and manual `/compact` fail deterministically with:

```text
API Error: 400 messages.<N>.content.<M>: `thinking` or `redacted_thinking` blocks in the
latest assistant message cannot be modified. These blocks must remain as they were in the
original response.
```

Once a session reaches the compaction point it cannot recover: every retry re-issues the
same request and gets the same 400, so the session is effectively frozen and eventually
crashes. Across three observed sessions on 2.1.153, **zero** ever produced a successful
compaction summary.

## Affected sessions (this repo, 2026-05-28)

| Session (prefix) | Version | Thinking blocks | Error index | Successful compactions |
| --- | --- | --- | --- | --- |
| `3c02b9` | 2.1.153 | 17 | `messages.3.content.34` | 0 (crashed) |
| `890438a9` | 2.1.153 | 30 | `messages.5.content.99` | 0 |
| `47c0d3b4` | 2.1.153 | 30 | `messages.5.content.99` | 0 |

`890438a9` and `47c0d3b4` share an identical start timestamp and error index — they are the
same conversation forked/resumed. The **error index scales with thinking-block count**
(17 blocks → `content.34`; 30 blocks → `content.99`), consistent with the request replaying
accumulated thinking blocks. All blocks are plain `thinking`; **no `redacted_thinking`** is
present in any session.

## Reproduction

1. Run a long, tool-heavy Opus 4.7 session with extended thinking enabled until it
   approaches the context limit (these were autonomous agent sessions with many tool calls
   and interleaved thinking).
2. Trigger compaction — either let auto-compact fire, or run `/compact` manually.
3. The request fails with the 400 above. Retrying `/compact` reproduces it every time.

In session `3c02b9` the failure is recorded as a `system` / `local_command` stderr event
immediately after a `/compact` command, with repeated identical failures appended as the
user retried.

## Root cause (as far as transcript analysis can establish)

The error names a content block that **does not exist in the persisted transcript**:

- Every persisted assistant record holds exactly **one** content block; the largest
  role-merged assistant turn is ~4 blocks. No on-disk message has 35+ blocks, so
  `messages.3.content.34` / `messages.5.content.99` index into a message array that Claude
  Code **assembles in memory at compaction time**, not into any stored record.
- Claude Code persists `thinking` blocks with the reasoning **text stripped to empty**
  (`thinking: ""`) while **retaining the cryptographic `signature`**. This is normal and
  was confirmed identical in healthy, non-failing sessions — it is not corruption.

The defect is in request assembly: when building the summarization request, Claude Code
places/keeps these persisted thinking blocks in the **latest assistant message** position.
The Anthropic Messages API requires `thinking`/`redacted_thinking` blocks in the latest
assistant message to be byte-identical to the original model output. An empty-text block
carrying a signature computed over the original (non-empty) text fails that check → `400`.

Normal turns succeed because the latest assistant message's thinking is the freshly
generated, intact block. Only the compaction path replays old, text-stripped thinking blocks
into the validated position — which is why the failure is specific to compaction and why it
is deterministic for any sufficiently long extended-thinking session.

## Impact

- Long extended-thinking agent sessions hit a hard wall: they cannot compact, cannot free
  context, and crash. In-flight context is lost (work survives only if written to disk
  beforehand).
- The earlier fix (2.0.67) does not cover this case on 2.1.153 for these sessions.

## Workaround (confirmed in upstream thread)

Switch the model for the compaction call so the request is not validated against
Opus thinking blocks:

```text
/model   (select Sonnet)
/compact
/model   (select Opus back)
```

Do this **before** the session crashes. For long, thinking-heavy sessions, the more robust
operational pattern is to avoid `/compact` entirely and continue in a fresh session via an
explicit handoff.

## Suggested fix direction (for Anthropic)

The compaction request builder should either (a) strip `thinking`/`redacted_thinking` blocks
entirely from the summarization request, (b) never place a text-stripped thinking block in
the latest-assistant-message position, or (c) preserve full thinking text + signature for any
thinking block it replays in that position.

---

## Paste-ready text for `/feedback`

```text
Claude Code 2.1.153, macOS, Opus 4.7 with extended thinking. /compact and auto-compact fail
deterministically with: "400 messages.N.content.M: thinking or redacted_thinking blocks in
the latest assistant message cannot be modified." Long tool-heavy thinking sessions cannot
compact, cannot recover, and crash. Three sessions affected today, zero successful
compactions. The named content block does not exist on disk (every persisted assistant
record has 1 block) — it is assembled in memory at compaction time, and the error index
scales with thinking-block count (17 blocks -> content.34, 30 blocks -> content.99). Cause
appears to be the compaction request replaying persisted thinking blocks (text stripped to
empty on disk, signature retained) in the latest-assistant-message position, which fails the
API's thinking-block immutability check. This is a fresh recurrence on 2.1.153 of #12311
(reported fixed in 2.0.67). Workaround that works: /model Sonnet -> /compact -> /model Opus.
```

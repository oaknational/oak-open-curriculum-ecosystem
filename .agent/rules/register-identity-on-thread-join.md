# Register Identity On Thread Join

Before any edit in this session, list every thread this session will touch.
For each thread, open its next-session record at
`.agent/memory/operational/threads/<slug>.next-session.md` and **either**:

- **(a) Update `last_session`** on the matching identity row if your platform,
  model, and `agent_name` match an existing row. Per the additive-identity
  rule in [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md),
  same identity → update `last_session`; do not overwrite, rename, or
  collapse existing rows.
- **(b) Add a new identity row** if you are a new identity on this thread
  (new platform, new model, or new `agent_name`). Populate all required
  fields: `agent_name`, `platform`, `model`, `session_id_prefix` (first 6
  characters of the harness session ID, or `unknown` if not exposed), `role`
  (free-form short label), `first_session` (today's date), `last_session`
  (today's date).

**Do not proceed to any other edit until the identity row is written.**

## Derived identity default

When no owner-assigned `agent_name` is already available, derive a
descriptive default with the portable agent-tools CLI:

```bash
pnpm agent-tools:agent-identity --format display
```

For collaboration-state writes, prefer the stricter preflight format because
it emits the full PDR-027 block plus seed source:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
```

When `CODEX_THREAD_ID` is present, new Codex shared-state writes must not use
`Codex` / `unknown`; the thread id is the deterministic seed for both the
display name and the six-character session prefix.

Use the platform-provided seed when available (`CLAUDE_SESSION_ID` or
`CODEX_THREAD_ID`). **Cursor (Composer)** sets `OAK_AGENT_SEED` from the
composer `session_id` via the project `sessionStart` hook
(`.cursor/hooks/oak-session-identity.mjs`; see
[`agent-tools/docs/agent-identity.md`](../../agent-tools/docs/agent-identity.md)
and [Cursor Hooks](https://cursor.com/docs/hooks)). The same hook injects the
derived display name and `session_id_prefix` (first six characters of
`session_id`) into `additional_context` for thread registration when the
integrated terminal does not see `OAK_AGENT_SEED`. A gitignored
`.cursor/oak-composer-session.local.json` mirror (when agent-tools is built)
carries the same derived name and a suggested Composer tab title for
copy/paste — Cursor hooks cannot set the tab label programmatically per
[Hooks](https://cursor.com/docs/hooks). If the hook is disabled or
the name line is missing, run `pnpm agent-tools:agent-identity --format display`
with `--seed` or `OAK_AGENT_SEED`, or ask the owner for an override. If the
platform does not expose a stable session seed and no Cursor hook context is
present, pass `--seed`, set `OAK_AGENT_SEED` explicitly for the session, or ask
the owner for an override. Do **not** fall back to `git config user.email`;
personal-email fallback is intentionally not part of the identity contract.

`OAK_AGENT_IDENTITY_OVERRIDE` remains an explicit operator escape hatch for
memorable owner-assigned names. Derived names from session-id seeds are
deterministic session display names; persistent PDR-027 identity across
sessions requires a deliberately persistent seed or explicit override.

## Why this rule exists

The additive-identity convention in
[`.agent/memory/operational/threads/README.md`](../memory/operational/threads/README.md)
is load-bearing for multi-agent continuity: it is how the system records
"who touched what, when" across sessions. Prior to this rule's install, the
convention lived as passive prose in a README — agent-recall-dependent under
context pressure, the exact failure mode of
[`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md).
This rule converts the convention from passive guidance into an active,
always-applied tripwire at session open.

It is the first layer of the Family-A Class-A.2 tripwire cluster in
[PDR-029](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md).
The complementary layers are, per PDR-029's 2026-04-21 Amendment Log
(*"active means markdown-ritual, not code execution"*):

- **Session-close identity-update gate** — a documentation walkthrough
  in [`/session-handoff § Hard gate`](../commands/session-handoff.md#hard-gate)
  that instructs the agent to enumerate threads from
  [`repo-continuity.md § Active threads`](../memory/operational/repo-continuity.md#active-threads)
  (authoritative source), open each touched thread's next-session
  record, verify `last_session` is today's date, and "do not proceed
  to session close" until every touched thread is current. Any agent
  on any platform performs the same walkthrough by reading the same
  markdown.
- **Stale-identity audit** — a six-check documentation walkthrough in
  [`/jc-consolidate-docs § Thread-register freshness`](../commands/consolidate-docs.md#thread-register-freshness)
  that the agent performs at consolidation time: stale `last_session`,
  orphan threads, missing fields, expired track cards, duplicate
  identity rows, active-threads ↔ next-session-file correspondence.

Together the three layers ensure no single failure mode (forgot to read the
rule; forgot to walk the session-handoff gate; forgot to run the audit)
leaves the thread identity register silently wrong. The enforcement force
on all three is *"do not proceed until this step is complete"* written in
the ritual surface — same authority as a script `exit(1)` without platform
coupling.

## How to determine which threads this session is touching

Enumerate structurally, not from memory:

1. Read [`.agent/memory/operational/repo-continuity.md § Active threads`](../memory/operational/repo-continuity.md#active-threads)
   — the authoritative table of currently live threads.
2. For each, consult the named next-session record at
   `.agent/memory/operational/threads/<slug>.next-session.md`.
3. The chat opener + the landing target in the next-session record names
   which thread this session is committed to per PDR-026 (per-thread-per-
   session landing commitment). Register on that thread.
4. If the session will touch additional threads incidentally, register on
   those too. The additive rule makes this cheap.

## Identity row schema

Per PDR-027 and
[`.agent/memory/operational/threads/README.md § Identity schema`](../memory/operational/threads/README.md#identity-schema):

| Field | Meaning |
| --- | --- |
| `agent_name` | Persistent descriptive name for this agent on this thread (owner-assigned or descriptive default). Carries across sessions. |
| `platform` | `claude-code`, `cursor`, `codex`, `gemini`, etc. |
| `model` | Canonical model id (e.g. `claude-opus-4-7-1m`). |
| `session_id_prefix` | First 6 characters of the harness session ID; `unknown` if not exposed. |
| `role` | Free-form short label (`drafter`, `executor`, `reviewer`, `initiator`, …). |
| `first_session` | Date identity first touched the thread (YYYY-MM-DD). |
| `last_session` | Date identity most recently touched the thread (YYYY-MM-DD). |

Derived identity is a helper for choosing `agent_name`; it does not change
the additive-identity rule, the identity key, or historical rows.

## Self-application

The session that installs this rule MUST itself register an identity row on
the `memory-feedback` thread before writing the rule file — proving the rule
is applicable at install time, not merely documented.

## Related surfaces

- [`.agent/memory/operational/threads/README.md`](../memory/operational/threads/README.md)
  — thread convention and identity schema (source doctrine).
- [PDR-027 Threads, Sessions, and Agent Identity](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — portable ratification of the additive-identity rule.
- [`agent-tools/docs/agent-identity.md`](../../agent-tools/docs/agent-identity.md)
  — deterministic identity derivation CLI and platform wrapper status.
- [PDR-029 Perturbation-Mechanism Bundle](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — Family-A Class-A.2 design; platform-parity requirement.
- [Pattern: `passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — motivating failure mode.
- [PDR-026 Per-Session Landing Commitment](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  — per-thread-per-session commitment that determines which thread(s) this
  session registers on.

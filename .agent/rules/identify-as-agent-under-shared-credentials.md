---
classification: core
description: Identify as an agent under shared credentials. When an agent authors outward content (GitHub comments, reviews, PR/issue bodies) via ANY shared credential — the team bot account (the mandatory default per bot-identity-on-third-party-systems) or, in owner-permitted exceptions, the owner's account — it MUST mark the content as agent-authored and name its PDR-027 identity, so the acting agent is never hidden behind the shared account.
---

# Identify as an Agent Under Shared Credentials

> **Frame inverted 2026-07-23 by owner ruling.** Shared human credentials are
> no longer the working norm this rule was written against:
> [`bot-identity-on-third-party-systems`](./bot-identity-on-third-party-systems.md)
> now makes the bot identity mandatory wherever one exists, and
> owner-credential use is an exception granted (and generally instigated) by
> the owner. This rule remains in force for what survives: (a) the
> owner-permitted exceptional cases, (b) surfaces where no bot identity
> exists yet (a standing gap to surface, per the bot-identity rule), and
> (c) **seat-level attribution on the shared bot identity** — the bot account
> is shared by every seat, so content posted as the bot still names the
> acting agent per PDR-027, exactly as it did under the owner's account.

When an agent authors outward-facing content through **shared credentials** —
a human's account, or the team bot account shared by all seats — it MUST
clearly identify itself as the acting agent in that content. A shared
credential attributes the action to the account, not the actor; without an
explicit marker, a reader, collaborator, or audit cannot tell which agent (or
whether a human) authored an artefact, and under a human's account the human
is silently credited with words they did not write.

## Trigger

The agent is about to author or edit any **outward, human-visible artefact**
via shared credentials. In this repository that means the team bot account
(the one the clone's merge-bot config names, the mandatory default) or — only
in the owner-permitted exceptional cases — the owner account
(`@jimCresswell`); the rule fires before:

- a PR or issue **comment** (`gh pr comment`, `gh issue comment`, `gh api
  .../comments`);
- a PR **review** or **review comment** or **review reply** (approve, request
  changes, comment, inline reply);
- a PR or issue **body / description** (`gh pr create`, `gh pr edit`, `gh issue
  create`);
- any other post that lands under the shared account on an external surface.

It also fires when authoring on any non-GitHub outward surface (a vendor
dashboard, external tracker, or published page) through credentials that
identify a human rather than the agent.

## Action

Before posting, attach a clear agent-identification marker to the content. The
marker MUST state three things:

1. that the content is **agent-authored** (not a human-authored message);
2. the agent's **PDR-027 display identity** (the session agent name);
3. **which shared credential** posted it: the human account's, or the team
   bot's. Under the team bot the account itself states this, so the marker
   need not repeat it; under a human account the marker must.

Canonical form under a human account — a trailer at the end of the artefact:

```text
---
Agent-authored on behalf of `<account>` by <agent-name> (<platform>, <model>)

Example:
Agent-authored on behalf of `jimCresswell` by Inferno holds Tongs (Claude Code, Opus 4.8 1M)
```

Under the team bot, the account shows which credential posted and names no
human, so the marker names the agent and says it is one: a last line that
begins with an em dash and ends with the seat's PDR-027 session prefix,
`— <agent-name>, an agent (<prefix>)`, with words between them allowed
(`— <agent-name>, <role>, an agent (<prefix>)`). The prefix ends the line
because tooling that tells a seat's signed reply from a reviewer's reads that
ending.
Never the human-account trailer: "on behalf of `<account>`" under the bot's
token attributes the post to a human who did not make it.

A clearly-visible leading blockquote carrying the same three facts is an
acceptable alternative when a trailer would be missed (e.g. a long PR body). Do
not bury the marker mid-text. If a surface genuinely cannot carry text (e.g. a
bare review approval with no body), add the marker to the accompanying comment
rather than leaving the action unattributed.

If an unattributed artefact has already been posted, **edit it** to add the
marker as soon as the omission is noticed; do not leave it standing.

## Why

Where a write goes out under a human account's credential (the review rows of
the committer identity rule's map, and the operator rows of an estate's
identity contract), GitHub records the agent's action under that human's login
(see the agent-collaboration directive on identity vs liveness, and PDR-027 on
agent identity); under the team bot's token it records a bot that names no
seat. Either way the actor is hidden by construction.
This rule restores honest attribution at the only point that can carry it — the
content itself. It protects:

- **the owner**, from being credited with — or held accountable for — words and
  decisions an agent authored;
- **collaborators and reviewers** (human and bot), who must know whether they
  are in dialogue with a human or an agent to weigh the response correctly;
- **the audit trail**, so a later reader can reconstruct who actually authored a
  decision recorded in a comment or review.

This is the GitHub-surface complement to two mechanisms that already attribute
agent work elsewhere: the `Co-Authored-By` trailer that the
[commit skill](../skills/change-custody/commit/SKILL-CANONICAL.md) adds to commit messages, and
the PDR-027 name+UUID identity that
[`register-identity-on-thread-join`](./register-identity-on-thread-join.md)
carries on internal collaboration state. Outward posts via shared credentials
had no equivalent; this rule closes that gap.

The same asymmetry governs *reading*: for who-did-what questions, consult the
comms event stream and claim dispositions, never a GitHub actor field
(`mergedBy`, PR author, commit pusher) — the login identifies the shared
credential, not the actor (worked instance: PR #160's merge mis-attributed to
the owner from `mergedBy` alone, 2026-06-10). The same applies to comment
audits: agent replies render under the shared account's login, the team
bot's or a human's, in watcher streams and
comment lists, so when auditing "owner comments" on a PR, filter by the
agent-identification marker in the body, never by author login. A leading
`[Agent: …]` prefix is the stronger marker convention for comments — it is
visible in truncated comment lists where a trailing signature is not
(worked instance 2026-07-07).

## Scope Nuance

- **In scope:** outward, human-visible artefacts authored via shared
  credentials, a human account or the team bot (above).
- **Already covered, do not double-mark:** git commit messages (the
  `Co-Authored-By` trailer is the marker) and internal collaboration-state comms
  (carry PDR-027 name+UUID by construction).
- **Not in scope:** content authored under the agent's *own* distinct account
  (where the actor is already visible) — though a marker there is harmless.
- **Already covered, do not double-mark (OCE):** edits to OCE's knowledge-base
  pages under its agent-managed title designation; their page-local change
  ledger identifies the originating repository visibly and the
  agent/session/credential chain once per coherent change set, as OCE's own
  page-edit rule requires, so no separate marker is added there.
- **In scope (reading side):** attributing past actions performed under shared
  credentials — use the comms stream and claim dispositions, never the GitHub
  actor field (see §Why).

## Enforcement

Behavioural at the authoring moment: the marker is attached before the post
lands, and a missed marker is repaired by editing the artefact. There is no
write-time hook today; a future hardening could lint `gh` invocations or
post-hoc scan shared-account comments for the marker. Until then this is a
no-exceptions discipline ([`rules-have-no-exceptions`](./rules-have-no-exceptions.md)).

## Related Surfaces

- [`register-identity-on-thread-join`](./register-identity-on-thread-join.md) —
  PDR-027 identity discipline for internal collaboration state.
- [`use-agent-comms-log`](./use-agent-comms-log.md) — internal comms identity.
- [PDR-027](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — threads, sessions, and agent identity (the source of the display name).
- [agent-collaboration directive](../directives/agent-collaboration.md) —
  identity vs liveness.
- [commit skill](../skills/change-custody/commit/SKILL-CANONICAL.md) — the `Co-Authored-By`
  trailer, the commit-surface analogue of this rule.

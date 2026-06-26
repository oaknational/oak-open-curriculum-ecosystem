# Identify as an Agent Under Shared Credentials

When an agent authors outward-facing content through **shared human
credentials** — most commonly the owner's GitHub account — it MUST clearly
identify itself as an agent in that content. Acting through a human's
credentials attributes the action to the human; without an explicit marker, a
reader, collaborator, or audit cannot tell an agent-authored artefact from a
human-authored one, and the human is silently credited with words they did not
write.

## Trigger

The agent is about to author or edit any **outward, human-visible artefact**
via shared (human-owned) credentials. In this repository the shared credential
is the GitHub auth shared with the owner account (`@jimCresswell`); the rule
fires before:

- a PR or issue **comment** (`gh pr comment`, `gh issue comment`, `gh api
  .../comments`);
- a PR **review** or **review comment** or **review reply** (approve, request
  changes, comment, inline reply);
- a PR or issue **body / description** (`gh pr create`, `gh pr edit`, `gh issue
  create`);
- any other post that lands under the shared account on an external surface.

It also fires when authoring on any non-GitHub outward surface (a vendor
dashboard, an external tracker, a published page) through credentials that
identify a human rather than the agent.

## Action

Before posting, attach a clear agent-identification marker to the content. The
marker MUST state three things:

1. that the content is **agent-authored** (not a human-authored message);
2. the agent's **PDR-027 display identity** (the session agent name);
3. that it was posted **via the human account's shared credentials**.

Canonical form — a trailer at the end of the artefact:

```text
---
Agent-authored on behalf of `<account>` by <agent-name> (<platform>, <model>)

Example:
Agent-authored on behalf of `jimCresswell` by Inferno holds Tongs (Claude Code, Opus 4.8 1M)
```

A clearly-visible leading blockquote carrying the same three facts is an
acceptable alternative when a trailer would be missed (e.g. a long PR body). Do
not bury the marker mid-text. If a surface genuinely cannot carry text (e.g. a
bare review approval with no body), add the marker to the accompanying comment
rather than leaving the action unattributed.

If an unattributed artefact has already been posted, **edit it** to add the
marker as soon as the omission is noticed; do not leave it standing.

## Why

The session shares the owner's `gh` auth, so GitHub records every agent action
under the owner's login (see the agent-collaboration directive on identity vs
liveness, and PDR-027 on agent identity). The actor is hidden by construction.
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
[commit skill](../skills/commit/SKILL-CANONICAL.md) adds to commit messages, and
the PDR-027 name+UUID identity that
[`register-identity-on-thread-join`](./register-identity-on-thread-join.md)
carries on internal collaboration state. Outward posts via shared credentials
had no equivalent; this rule closes that gap.

## Scope Nuance

- **In scope:** outward, human-visible artefacts authored via shared human
  credentials (above).
- **Already covered, do not double-mark:** git commit messages (the
  `Co-Authored-By` trailer is the marker) and internal collaboration-state comms
  (carry PDR-027 name+UUID by construction).
- **Not in scope:** content authored under the agent's *own* distinct account
  (where the actor is already visible) — though a marker there is harmless.

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
- [commit skill](../skills/commit/SKILL-CANONICAL.md) — the `Co-Authored-By`
  trailer, the commit-surface analogue of this rule.

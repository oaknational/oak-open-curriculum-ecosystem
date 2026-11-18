---
classification: situational
description: "Writing a git commit SHA into any collaboration surface — comms events, shared-comms-log, conversations, escalations, handoffs, claim/commit-queue notes, napkin, thread records, repo-continuity, plan bodies: prefix it exactly SHA: (optional space), e.g. Landed PDR-073: SHA:6ebaae58, so the .gitleaks.toml allowlist reads it as an audit reference; a bare word-colon-hex citation trips the gitleaks generic-api-key rule and blocks pre-push. Not for permanent docs (ADRs, PDRs, rules) — SHAs never belong there, prefixed or not, per no-moving-targets-in-permanent-docs."
trigger: surface:collaboration-state
globs:
  - .agent/state/collaboration/**
  - .agent/collaboration/**
---

# SHA-Prefix in Collaboration Content

When writing a git commit SHA into ANY collaboration surface authored
during a session, the SHA MUST be prefixed exactly with `SHA:`
(optional single space after the colon).

The gitleaks pre-push allowlist at `.gitleaks.toml` honours
`SHA: <hash>` as an audit reference and ignores the regex match.
Bare SHAs in `<word>: <40-hex>` patterns will continue to trip the
`generic-api-key` rule and block push.

## In-Scope Surfaces

The rule applies to agent-authored content in collaboration state:

- `.agent/state/collaboration/comms/*.json` — comms event bodies
- `.agent/state/collaboration/shared-comms-log.md` — rendered comms log
- `.agent/state/collaboration/conversations/*.json` — decision threads
- `.agent/state/collaboration/escalations/*.json` — escalation cases
- `.agent/state/collaboration/handoffs/*.md` — handoff records
- `.agent/state/collaboration/active-claims.json` — claim `notes` field
- `.agent/memory/active/napkin.md` — napkin worked-instance entries
- `.agent/memory/operational/threads/*.md` — thread records
- `.agent/memory/operational/repo-continuity.md` — continuity surface
- Plan body markdown under `.agent/plans/**/*.plan.md`
- Commit-queue intent `notes` field (in `active-claims.json`)

Permanent docs (ADRs, PDRs, governance docs, principles,
testing-strategy, rules) remain governed by the
[no-moving-targets-in-permanent-docs](./no-moving-targets-in-permanent-docs.md)
rule — prefix or not, SHAs do not belong in those surfaces.

## Why

`gitleaks` `generic-api-key` matches `<word>: <40-hex>` patterns and
reads the trailing hex as a credential. Bare-SHA citations in
collaboration prose (`Landed PDR-073: 6ebaae58…`) trip the rule and
block pre-push, even though the matched value is a public git commit
SHA already visible in `git log`.

The `SHA:` prefix is the agent's discipline marker declaring "this is
an audit reference, not a credential." The gitleaks allowlist matches
`SHA: <hex>` on the line and skips the finding. Bare-prefix patterns
keep tripping — preserving the rule's reach for actual credentials.

## What to Write

Canonical form: `SHA:<hash>` or `SHA: <hash>` (one space, optional).

| Impulse | Wrong move | Right move |
|---|---|---|
| "Reference the landed commit in a marshal-update broadcast" | `Landed PDR-073: 6ebaae58…` | `Landed PDR-073: SHA:6ebaae58…` |
| "Cite the wide-sweep commit in a handoff record" | `1ea4e2e1 wide-sweep` | `SHA:1ea4e2e1 wide-sweep` |
| "Cross-reference a parent commit in a claim note" | `parent commit: ab438d1f` | `parent commit: SHA:ab438d1f` |

Short SHAs (7+ hex characters) match the same allowlist regex; both
short and full SHAs work behind the prefix.

The prefix is for git landings only. A substrate cross-reference — one
collaboration event, claim or handoff citing another — cites the event
or claim id (its `event_id` or `claim_id`: a UUID or a stable slug, as
the comms-event schema allows), never a commit: "event-id for substrate;
SHA-prefix for git-landing" (ADR-187 §Citation discipline, which named
this repo-wide line as its follow-on; landed 2026-09-21).

## Hook / Tooling Layer

The discipline is operationalised at gitleaks config:

- `.gitleaks.toml` — `[[allowlists]]` with `regexTarget = "line"` +
  regex `'''SHA: ?[0-9a-f]{7,40}\b'''`. Future revisions of this rule
  should keep the canonical regex in sync with the toml entry.

There is no write-time hook for this rule — failure surfaces at
`pnpm secrets:scan` and `.husky/pre-push`. Push is the enforcement
point. Agents who skip the prefix discover the requirement when their
push blocks.

## Related Surfaces

- [`.agent/rules/no-moving-targets-in-permanent-docs.md`](./no-moving-targets-in-permanent-docs.md)
  — the broader principle for permanent-doc surfaces.
- [`.agent/skills/change-custody/commit/SKILL-CANONICAL.md`](../skills/change-custody/commit/SKILL-CANONICAL.md)
  — commit workflow that fires the pre-push hook.
- `.gitleaks.toml` — the runtime allowlist that honours this rule.

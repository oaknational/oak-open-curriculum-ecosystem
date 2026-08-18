# Operator-local profile (machine-local, not source-controlled)

This directory holds the **operator profile**: facts about the human working at
*this* machine and how their agents should act on their behalf. Everything in
here except this README and the sibling `.gitignore` is ignored by git.

The convention is one file, `profile.md`. Add others only when `profile.md`
genuinely outgrows one surface.

## Why this tier exists

Three kinds of fact were previously homeless, and each was lost at least once:

1. **Which identity performs which action class** on third-party systems. The
   portable *rule* — which action classes use a bot credential and which use the
   operator's own — is tracked doctrine in
   [`bot-identity-on-third-party-systems`](../rules/bot-identity-on-third-party-systems.md).
   But *which* bot and *which* human account is a property of this machine and
   this person, and belongs here.
2. **Tone of voice and communication preferences** — how this operator wants
   agents to write to them, and how agents should write *as* them on outward
   surfaces. Not portable: the next user has their own.
3. **Personal operating preferences** that are neither doctrine nor session
   state.

None of these belong in per-user memory
(`~/.claude/projects/<project>/memory/` and its siblings on other platforms),
because [`per-user-memory-is-a-buffer`](../rules/per-user-memory-is-a-buffer.md)
makes that surface a **buffer** — it is drained by design, so a durable
preference stored only there is scheduled for deletion. This tier is a durable
home; the buffer graduates *into* it.

## Where it lives, and how a linked worktree finds it

The profile is machine-local, so it **cannot travel through git** — it exists
only in the working directory where it was written, and a linked worktree will
not see a copy.

**Resolve it in the PRIMARY checkout**, the same way the collaboration substrate
resolves its coordination home: the first entry of `git worktree list`, which is
the primary checkout for every linked worktree of the same repository.

```bash
PRIMARY="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
PROFILE="$PRIMARY/.agent/operator-local/profile.md"
[ -f "$PROFILE" ] && cat "$PROFILE"   # absence is normal — see below
```

Do **not** copy the profile into each worktree: duplicates diverge, and the
divergence is invisible because neither copy is tracked. One file, in the
primary, derived at read time.

## Absence is normal — this is load-bearing

Per `principles.md` §Any User, Any Machine, the estate must work on any machine
for any user, including a cold clone with no local state. **A missing
`profile.md` is the expected condition, not a defect.** Nothing may fail, warn,
or block because the profile is absent, and no correctness property may depend
on it. A reader that finds no profile proceeds on tracked defaults and says
nothing.

The corollary binds the other way too: because the profile is invisible to every
other checkout and to CI, **nothing that another user or CI needs may live
here.** If a fact matters to more than one person, it is doctrine and belongs in
a tracked surface. When something in a profile turns out to be general, graduate
it out.

## What must never go in here

- **Secrets of any kind** — tokens, private keys, passwords, canary values.
  Credentials live in the OS keychain, a credential helper, or `.env.local`;
  never in the repository tree, ignored or not. This directory names *which
  identity* to use, never the material that authenticates it.
- **A path that a tracked file then resolves through.** Paths inside the profile
  are fine; a tracked file must never depend on one (`no-machine-local-paths`).
- **Anything load-bearing for a gate, validator, or build.**

## Who reads it, and when

The shared start-right workflow
([`start-right-quick/shared/start-right.md`](../skills/start-right-quick/shared/start-right.md))
points every session here during grounding. That is the single tracked *read*
pointer; adding another would duplicate it.

## Where it sits in the authority order

Below every tracked surface. The tier is placed in the layering contract at
[`orientation.md` §The Operator-Local Profile Tier](../directives/orientation.md#the-operator-local-profile-tier),
which is authoritative on the position: a local binding or preference never
overrides tracked doctrine, an ADR, a PDR, a rule, or an active plan, and the
only thing that displaces tracked governance is a current owner direction — the
owner speaking now, not a local note of something the owner once said. What
this tier *is* authoritative on is the machine-local binding a tracked surface
deliberately declines to name.

## Shape

`profile.md` is prose with clear headings, read by an agent at session open.
Keep it short enough to read in full every session — it competes for the same
context budget as the directives
([`directive-file-context-budget`](../rules/directive-file-context-budget.md)).
If it grows past roughly a screen, that is a signal some of it was actually
doctrine and should graduate to a tracked surface.

Mark inferred content explicitly. An agent seeding a profile from observed
behaviour is proposing, not recording — the operator ratifies it.

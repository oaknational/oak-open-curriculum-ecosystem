---
pdr_kind: governance
---

# PDR-141: The operator profile lives in the home directory — the Practice's first surface outside a repository

**Status**: Accepted (owner-ratified 2026-09-14, in-session, the decision
and the same day's amendment together; the owner's direction that shaped
it: the profile is "strictly optional" and lives "in the home directory so
that ALL Practice repos on the machine can use it … in the same way that the
Claude vendor memory is both in a shared directory and within that scopes
some things to a particular directory or project")
**Date**: 2026-09-14
**Related**: [PDR-050](PDR-050-state-memory-substrate-contracts.md)
(substrate contracts), [PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(per-user memory is a buffer), [PDR-105](PDR-105-reference-direction-invariants.md)
(reference direction), [PDR-125](PDR-125-inter-practice-collaboration-protocol.md)
(cross-estate identity)

## Context

Three kinds of fact about the human at a machine were homeless until August
2026 and each was lost at least once: which identity (which bot, which human
account) performs which action class on third-party systems; how the operator
wants agents to write to them and as them; and personal operating
preferences that are neither doctrine nor session state. The first host
cured this with a machine-local, git-ignored directory inside its checkout
(2026-08-18), placed below every tracked surface in the authority order.

The 2026-09-14 dedicated drain of the Claude per-user memory buffer seeded
that file for the first time and exposed the placement defect. The facts it
holds are properties of the person and the machine, not of one checkout:
this machine carries eight Practice-bearing repositories, and a profile
inside one checkout is invisible to the other seven, to every linked
worktree of the same repository (the tier's own README had to teach
readers to resolve the primary checkout first), and to a second clone of the
same repository. Every vendor memory system already solved this the other
way round: Claude Code keeps its memory under the user's home directory and
scopes part of it to a project. The Practice, which exists to be
vendor-independent, had its only person-and-machine surface inside a repo.

This is the first time the Practice creates and consumes information outside
a repository, so the decision is recorded as a PDR rather than a host-level
convention: it fixes where such information may live, what may live there,
and what may never depend on it.

## Frames considered

Three frames were held apart before deciding (the Parallax discipline at
core depth):

1. **The person-and-machine frame** (the owner's): the operator is one
   person on one machine using many repositories; their profile is one
   surface, shared, with parts scoped to a repository where a fact is true
   of one line only.
2. **The checkout frame** (the August 2026 status quo): a binding such as
   "which bot commits here" is a property of the repository, so the
   profile belongs beside the repository. This frame is not wrong about the
   binding; it is wrong about the container. It duplicates the person's
   facts across every checkout, hides them from worktrees and clones, and
   makes the buffer drain re-seed the same facts once per repository. Its
   valid content survives in frame 1 as the repository-scoped file.
3. **The vendor-memory frame**: leave person-and-machine facts in each
   agent platform's own memory. Rejected on the Practice's founding
   constraint: the Practice is cross-vendor, and per-user vendor memory is
   a buffer that drains by design (PDR-067).

The crosswalk from frame 2 to frame 1 is complete: every fact the checkout
tier could hold has a place in the home-directory layout, and the
authority-order clause (below every tracked surface) transfers unchanged.
The bridge from the vendor precedent to the Practice is partial and named
as such: vendor memory scopes by directory path, which breaks when a
repository moves and duplicates across clones and worktrees; the Practice
scopes by repository identity instead.

## Decision

1. **The root.** The Practice's home-directory root is `~/.practice/`
   (overridable by the environment variable `PRACTICE_HOME`, so validators
   and tests can point elsewhere). Nothing lands under it without a PDR
   naming the surface; this PDR names one.
2. **The profile layout.** `~/.practice/profile/index.md` holds what is true
   of the operator everywhere, on every machine and in every repository. A
   repository-scoped fact lives in `~/.practice/profile/repos/<scope-key>.md`;
   a machine-scoped fact in `~/.practice/profile/machines/<machine-key>.md`
   (decision 10).
3. **The scope key** is the repository's identity, never its path and never
   its address: the root `package.json` `name`, lowercased; a scoped
   `@scope/name` becomes `scope--name` (amended 2026-10-28; a host's own
   key is a fact of that host, never named in this record). Every clone,
   fork and mirror of one repository therefore reads one scope file, and a
   move between owners or hosts changes nothing. A repository whose root
   manifest has no name has no scope file; readers proceed on the shared
   index.
4. **Strictly optional.** A missing root, index, scope or machine file is
   the expected condition, not a defect: readers proceed on tracked
   defaults; a named document that is absent is reported in one printed
   line (its path, so a drifted key is seen; amended 2026-10-28) and
   nothing else happens. Nothing may fail, warn or block on the
   profile's ABSENCE, and no correctness property of the estate may depend
   on the profile at all (`principles.md` §Any User, Any Machine). A PRESENT
   document that violates the contract or carries a credential-shaped line
   is refused by the check and is not read until fixed: that refusal is the
   one way a profile blocks anything, and it blocks only its own reading.
5. **Authority.** The profile sits below every tracked surface. Where it
   conflicts with a directive, ADR, PDR, rule or active plan, the tracked
   surface wins and the profile's clause is stale by construction; only a
   current owner direction displaces tracked governance. The profile is
   authoritative on exactly the machine-local binding a tracked surface
   deliberately declines to name.
6. **Content.** Prose with clear headings, short enough to read whole at
   session open. Identities are named, never their credentials: no tokens,
   keys, passwords or canary values, which live in the keychain, a
   credential helper or `.env.local`. Paths inside the profile are fine; no
   tracked file may resolve through one. Nothing load-bearing for a gate,
   validator or build. Content an agent inferred from observed behaviour is
   marked inferred until the operator ratifies it.
7. **Readers.** The shared start-right grounding is the single tracked read
   pointer. Where the profile root is a repository with a remote, decision
   14's session-open sync runs first (2026-09-17 amendment); then the
   grounding runs the host's profile check before anything is read (the
   host's Practice index names the command), so a document carrying a credential-shaped line is
   refused before anything is read into a session; when the check refuses,
   or cannot run because the host's tooling is not yet built (a cold clone
   before its install and build), nothing is read and the grounding
   continues — the profile is read once the tooling is built and the check
   passes. Then it reads the index, the current repository's scope file and
   this machine's file, in that order. Because the location is the home directory, no primary-checkout
   resolution is needed: a linked worktree, a second clone and a session in
   any other Practice repository read the same files. The scope key is
   derived from the root manifest's name (decision 3):

   ```bash
   # The host's profile check — named in its Practice index; the Core names no
   # host tool (decision 9) — is asked to EMIT the documents it validated, from
   # the same reads it checked, so nothing reopens a path after the check
   # (amended 2026-09-21: a file replaced by a link between a check and a read
   # would otherwise enter the session unread; a named document that is absent
   # prints one line naming it, and no document prints unless all conformed).
   SCOPE="$(cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node -p 'const n = (require("./package.json").name ?? "").trim(); const m = /^(?:@([^/]+)\/)?([^/@]+)$/.exec(n); const k = m ? [m[1], m[2]].filter(Boolean).join("--").toLowerCase() : ""; /^[a-z0-9][a-z0-9._-]*(?:--[a-z0-9][a-z0-9._-]*)?$/.test(k) ? k : ""' 2>/dev/null)"
   MACHINE="$(hostname -s | tr '[:upper:]' '[:lower:]')"
   <the host's profile check> --emit index.md ${SCOPE:+--emit repos/$SCOPE.md} --emit "machines/$MACHINE.md"
   ```

8. **Checkout-local profile tiers are retired.** A host that kept a
   machine-local profile inside its checkout retires that tier: the
   location becomes a pointer to this PDR, and the host's bridge index
   carries its own migration note (the Core carries none). The per-user
   vendor memory buffer graduates person-and-machine facts into this
   profile, and this profile graduates anything that turns out to be
   doctrine back into a tracked surface.

## Amendment 2026-09-14 — the contract, the machine kind and the synced root

Owner direction the same day, after the seeding: the profile needs a
versioned schema, validators in the repository, frontmatter in its documents
and a stable in-repo index pointing at the local index while acknowledging
it may not exist; and the root may be a git repository the operator syncs
between machines, provided the estate stays machine-agnostic.

9. **The contract is Core-carried.** `practice-core/schemas/operator-profile.schema.json`
   (family 1.0.0) governs every document's YAML frontmatter: `practice_profile`,
   `schema_version`, `kind`, `updated`, `ratified`, and the kind's key. Each
   host that adopts the Core binds its own enforcement validator to the
   contract — a strict mirror proved equivalent by a conformance smoke on
   shared fixtures, as the inter-Practice wire contract is bound — and names
   the check command in its Practice index; the Core names no host tool
   (`practice-core-portability`). Within a family, evolution is
   additive-optional with a MINOR bump of the document and every validator
   together; anything else is a new family. The check runs at session open
   and after edits, never in the commit or push gates: decision 4 stands.
10. **A third kind, `machine`.** `machines/<machine-key>.md`, keyed by the
    short host name lowercased, holds what is true of one machine only
    (which CLIs are logged out, where checkouts live). The index holds what
    is true of the operator everywhere; a scope file what is true of one
    line.
11. **The root may be a private git repository the operator syncs.** The
    machine split is what makes this safe: person-level and line-level facts
    travel, machine-level facts stay keyed to their host, and no reader
    assumes any machine. The layout tolerates git furniture (`.git`,
    `.gitignore`, `.gitattributes`) and nothing else beyond the three kinds.
    The Practice reads the repository and validates it; it never
    initialises it. Decision 14 names the two sync moments at which it
    changes the repository: a fetch and fast-forward (or plain merge) at
    session open, and, after any write made on the operator's word, a commit and
    push of that write, each with the staging and the reads that serve it. Its check
    refuses a document
    carrying a credential-shaped line before anything is read into a
    session (decision 7's order: the sync, then the check, then the reads;
    2026-09-17 amendment). The push leg of decision 14 refuses a
    non-conforming working tree; it does not yet scan the content of the
    commits it pushes, so a credential-shaped line in an earlier unpushed
    commit is the operator's to keep out of history until a host's sync
    tooling scans every commit the outgoing ref introduces (each host
    tracks that lane in its own records). The
    operator's remote is a fact of the profile, recorded in its own index,
    never in a tracked surface.
12. **The stable pointer** is the Practice index's row for the operator
    profile, which names the home-directory path, states that it may not
    exist, links the contract and names the check.

## Amendment 2026-09-14 (second) — keeping a synced profile in sync

Owner question the same day: how is the profile regularly committed, pushed
and pulled; which branch; who runs git; how are conflicts handled. The
owner's frame for the answer: a profile may not exist, and a profile that
exists may not be a repository — both remain first-class; everything below
applies only to a root that is a git repository with a remote.

13. **One branch.** The remote's default branch, no machine branches: the
    `machine` kind (decision 10) already isolates machine facts, so write
    locality does the work and the history stays linear.
14. **The Practice runs the sync, at two moments, under the operator's own
    git identity** (it is the operator's repository; a bot has no standing
    in it). At session open, before the profile is read: fetch and
    fast-forward; where fast-forward is impossible, a plain merge, never a
    rebase. Immediately after any write — and the Practice writes the
    profile only on the operator's word — run the check, commit with a
    message naming the seat and the fact, and push. No write sits unpushed
    across a session boundary. Never force, never rewrite history, never
    stage by wildcard. Decision 11 says the same from its side: initialising
    stays the operator's act; the session-open fetch and merge, and the
    commit and push of every write made on the operator's word, are the
    Practice's, with the supporting reads and staging those moments need;
    the prohibitions are the ones named here and in decision 11.
15. **Conflicts resolve by union.** One author, pull-before-write and
    write-then-push make a conflict rare; when two machines have written
    the same file between syncs, both sides are kept in time order, the
    `updated` date resolves to the later one, nothing is discarded, and the
    commit message says so. A conflict union cannot resolve is surfaced to
    the operator, never guessed.
16. **Drift is caught structurally.** The host's profile check reports
    sync state as findings when the root is a repository: a dirty working
    tree, unpushed commits, or a tracking branch behind its remote, each
    with the one command that cures it; absence of a remote is information,
    never a finding. The host's git mechanics live in one tested tool,
    never in shell recipes seats retype, so a seat resident in a linked
    worktree (whose shell git is confined to that worktree) syncs the
    profile the same way as any other.

## Amendment 2026-09-17 — decision 7's order beside decision 14

Decision 7 said the grounding runs the profile check "FIRST"; the second
2026-09-14 amendment's decision 14 put a fetch and fast-forward at session
open, before the profile is read. Read together they disagreed on what runs
first. A host's start-right prose followed decision 7 and said to run the
check first, above a command block that already pulled the profile before
the check (a review of the host's grounding found the disagreement on
2026-09-16, and the host cured its prose to pull, then check, then read).
Decision 7 now names the order: the sync where the root is a repository with
a remote, then the check, then the reads. A root that is not a repository, or
has no remote, has no sync step, and the check still runs before anything is
read. Decision 11 had said the refusal comes "before anything is synced",
which decision 14's session-open fetch made impossible to honour; it now says
before anything is read into a session, the same order (a fold review found
the surviving phrase on 2026-09-17), and it states what the push leg checks:
the working tree, not the content of the commits pushed (a second fold review
the same day found the over-claim against the mechanism's source).

## Amendment 2026-09-23 — every write made on the operator's word is pushed

Decisions 11 and 14 limited the Practice's commit and push to writes the
operator "has ratified", while the record's own test says every write is
made on the operator's word. A write the operator asked for, whose content
was still marked inferred, could therefore be left unpushed, against
decision 14's rule that no write sits unpushed across a session boundary (a
review of OCE's Core text found it). Both sentences now name every
write made on the operator's word. The sovereignty test in the Notes says the
same from its side: the Practice writes only on that word, under the
operator's own identity, and never rewrites. Decision 3's example scope key
is now the general form, `<owner>--<repository>`, because a host's own key is
a fact of that host. OCE made these changes in one pull request, its
decisions 11 and 14 sentences under the owner's card of 2026-09-23 ("Yes, one
cure push"); the second estate took all four under the owner's card of the
same day, where they arrived as OCE's cure.

## Amendment 2026-10-28 — the scope key is the package name, never the origin

The owner's ruling of 2026-10-28, after a repository moved between owners on
2026-10-27 and its scope file went unread: a repository never names its own
remote location, since every repository must push, clone and fork across
owners and addresses; where a per-repository identifier is needed it is the
root `package.json` name, never a specific origin. The move is the instance
that fired the falsifier: the key derived from the new origin matched no
file and, by decision 4, nothing said so. Decision 3 and the derivation in
decision 7 are amended in place; the contract's `scope_key` pattern admits
the unscoped form, a MINOR bump to 1.1.0 under decision 9 with every
estate's validator moved together; an existing scope file is renamed to the
new key on the operator's word (decision 14). Decision 4 gains, at the same
word, one printed line for a named document that is absent: the silence
decision 4 chose is how the loss hid for a day, and one line is a trigger
that makes the agent think without failing, warning or blocking.

## Boundaries

- This PDR licenses one surface. A second home-directory surface (a cache,
  a registry, a cross-repository state file) is a new decision, recorded by
  amending this PDR or by its own PDR, never by convention.
- The profile is one person's. The operator may keep it in a private
  repository and sync it between their own machines (decision 11); it is
  never a team surface, never shared with another person or with CI, and
  nothing another user or CI needs may live in it. A fact that matters to
  more than one person is doctrine and goes to a tracked surface.
- Repository-scoped files hold facts true of that line; they never restate
  the shared index.

## Prediction and falsifier

Prediction: within one buffer-drain cycle, person-and-machine facts stop
being re-seeded per repository, and no session in a linked worktree or
second clone reports the profile as absent when the primary has one.
Falsifier: a duplicated or diverged profile across two checkouts on one
machine, or a reader that fails or warns on a missing root. Reopen
conditions: a second out-of-repo surface is requested; a profile grows past
a screen (doctrine leaking into the tier); a credential is found in one.

## Notes

The owner's framing, 2026-09-14, after ratification: "the Practice profile
is a kind of simple personal knowledge graph, with a degree of sovereignty
because I control the repo that the canonical version lives in." That is
the surface's nature in one sentence: three node kinds (the person, a
repository line, a machine), each typed by the contract, versioned in a
repository the operator alone controls, and read by every Practice the
operator runs. Later amendments test against it: anything that would move
the canonical copy out of the operator's control, or that would let a
Practice write it on anything but the operator's word, breaks the
sovereignty the surface exists to give (decisions 11 and 14 pass that test:
the operator initialises the repository and every write is made on the
operator's word; the Practice syncs under the operator's own identity and
never rewrites).

## Provenance

Owner direction 2026-09-14 at the close of the Claude buffer drain; the
seat (Zephyr guards Leeward, 281e44) authored the layout, scope key and
reader contract. A host's directives place the tier in their authority
order and a host's rules own the portable mappings (which credential
performs which action class); those surfaces point here for the binding,
and the Core names none of them.

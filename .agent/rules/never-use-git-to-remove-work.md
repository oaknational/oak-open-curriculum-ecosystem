---
classification: core
description: Never use git to remove work. Move forward via filesystem changes; git is for committed history only.
---

# Never Use Git to Remove Work

**TRIGGER — the rule fires on TREE STATE plus COMMAND, never on intent:**
if the working tree holds uncommitted work, `git stash`, `git checkout
--`/`git restore`, and `git reset` are risk-class NO regardless of what you
are using them for — including "just a measurement", "making the tree
temporarily clean", or any framing of the operation as a read. Worked
instance (2026-07-26): a seat stashed an hour of uncommitted cures to
observe a baseline warning count that one grep of an existing log would
have answered; the rule never fired because the seat had filed it under
"destructive operations" and framed the stash as measurement. When a clean
tree is genuinely required: commit first, or run the comparison in a
separate clean checkout — the tree is never the instrument.

We never use git to remove work. We move forward via filesystem changes
— Edit, Write, and explicit `rm` of files. Git is for committed history;
working-tree edits live in the working tree until explicitly staged and
committed.

## The Rule

When the impulse arises to "undo what I just did," "revert that change,"
"go back to before I touched this," "restore the previous state," or
"throw out my draft," **do not reach for git**. Reach for Edit, Write,
or Bash `rm`.

Specifically, the following commands are forbidden in any context where
the working tree contains unstaged or in-flight edits — yours OR a peer
agent's:

```text
git checkout HEAD -- <path>
git checkout -- <path>
git checkout -- .
git restore <path>
git restore --worktree <path>
git restore --staged <path>
git stash drop
git stash clear
```

These commands overwrite the working tree silently. They cannot be
undone. `git fsck --lost-found` cannot recover working-tree-only edits
because they were never written to the object database.

The repo enforces this via the PreToolUse Bash blocked-patterns hook
(`.agent/hooks/policy.json`); attempts to run any of the above are
halted before execution.

## Why

Three reasons, in increasing order of consequence:

1. **You lose your own draft work.** A working-tree edit is the
   crystallised form of a chain of reasoning. The chain is in your
   conversation memory; the crystal is on disk. `git checkout` shatters
   the crystal but leaves the conversation. The conversation eventually
   ends; the crystal was the durable artefact.

2. **You lose peer-agent work.** Parallel sessions touch shared files
   (thread records, napkin, plans, comms log render). A `git checkout`
   on a "modified" file does not distinguish your edits from your peer's
   edits. Both are wiped. `git fsck` cannot recover them. There is no
   audit trail of what you destroyed.

3. **You lose the realisation that drove the deletion.** When the owner
   says "delete the needless complexity," the realisation that the
   complexity is needless is the durable artefact — the code is just the
   instrument. Forward removal via Edit/Write captures both the action
   and the reasoning. Rollback via git captures neither: the code is
   gone, and the realisation is fragile (it lives only in the conversation
   that prompted the rollback). The next agent re-creates the same
   needless complexity because the realisation never landed in the
   napkin or in a rule.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Throw out my draft cycle-1 code" | `git checkout HEAD -- <files>` | `rm <new files>`, then `Edit` the modified files to remove the changes you no longer want, leaving the *kept* parts |
| "Revert this file to before I touched it" | `git checkout HEAD -- <file>` | `Read` the HEAD version (`git show HEAD:<file>` to a buffer; do not run `git checkout`); `Edit` your version line-by-line to match what you want to keep |
| "Delete the needless complexity" | `git checkout HEAD -- .` | `rm` the files that should not exist; `Edit` the files that should exist but in simpler form; capture the realisation in the napkin |
| "I went down a wrong path; reset" | `git reset --hard HEAD` | `Edit` the files back toward where you want them; this is slower and that is the point — slow is the rate at which the realisation travels with the action |
| "Sync my local `main` to `origin/main`" when the local branch carries local-only commits | `git reset --hard origin/main` over the unexamined commits | Preserve the pointer first as a dated branch (`git branch main-local-<date>`), read what it holds, then move `main`; never move a ref over unexamined local-only commits (2026-08-12: two months-old local commits) |
| "Delete every file this grep matched" | `grep -l … \| xargs rm` | Print the list and read it before any `rm`, and match the import form (`from '…/<module>/`), never a bare path string, which also matches comments (2026-09-12: eight files deleted by a comment match) |
| "Revert this range" or "check out the whole tree from that ref" | A bulk revert or whole-tree checkout from a diff read at a glance | Confirm the diff's shape first: a two-dot `parent..HEAD` diff conflates both sides, so `git diff --stat` the exact range and read it before any bulk act (2026-06) |
| "Rebase it", "reset hard", "force the push" | A history-rewriting or outward op staged (tree stashed and cleaned) before the environment's policy is read | Read `.agent/hooks/policy.json` and the host deny-list first; a denied op takes the permitted path (merge, a patch onto a fresh branch), never a route around the guard; the owner's word that an act is wanted is not the same fact as the act being admissible here (2026-06-05) |

The `rm` in that table is scoped to YOUR OWN deliberate drafts of this
session — files you created on purpose and now judge needless. It does not
extend to an unintended or unexplained artefact: an errant tool probe's
write, a stray output, a file in the wrong tree. Owner ruling (2026-07-15,
after a session proposed `rm -rf` on a 1.4 MB artefact its own probe had
written, framed as "my own accidental write, safe to remove"): **file
deletion is only allowed in exceptional circumstances** — provenance does
not confer deletion rights, and an agent tidying away the evidence of its
own mistake is a completion-drive reflex, not hygiene. For any such
artefact, surface it — exact path, size, provenance, why it is wrong — and
ask for disposition; never `rm` it unprompted, even when it is untracked,
seconds old and self-made. The artefact plus the report of how it got there
IS the record; disposal is the owner's call.

## Standard Git Only — No Improvised Mechanics

The safety rules above never license inventing parallel mechanics around
git. Owner, twice in one closing hour (2026-07-16/17): "I am not okay with
untracked or unpushed content being 'secured', use standard git workflows"
— and, offered a relocate-and-overwrite-from-main clearing sequence with an
owner-run stash alternative, "I told you, that was not acceptable."
Quarantine relocations, copy-then-overwrite dances and convention-only
untracked files are exactly the non-standard state that made the 2026-07-16
estate audit necessary. So: every file is either tracked and committed on a
pushed branch or matched by an explicit ignore rule — no third state; never
propose or perform a relocate, quarantine or copy-back sequence as a
substitute for a git operation; the one sanctioned rolling coordination
branch is the standard home for live coordination surfaces; and when a
dirty tree blocks a standard operation, the options presented are standard
git ones, with the genuinely risk-class step (clearing a dirty shared
checkout) routed to the owner to run, surfaced once, never an agent
workaround.

When a handoff says fetch and rebase but the tree is dirty, do not rebase: fetch, prove the required
commits are already ancestors of HEAD with `git merge-base --is-ancestor`, and proceed from that
base, reporting whether origin is ahead or behind. A rebase in a dirty tree is the owner's call
(OCE friction F-29, settled 2026-09-14). Anything coming in from the default branch is merged,
never rebased, whatever a handoff or plan line says ("rebase onto the default branch first" is
overridden): a rebase rewrites commits the shared history depends on (carrier pull requests, the
mirror branch, ancestry proofs). The owner, 2026-10-02, verbatim: "anything coming in from main
must always be merged, not rebased, we must maintain the shared history". A clean tree makes a
rebase no more permitted than a dirty one does.

## A Block Is a Question, Never a Detour

When the hook blocks — or would block — one of these commands, do NOT
achieve the blocked effect by equivalent means — wholesale forward-writing
of `git show HEAD:<file>` content, a sibling command, manual file surgery —
even when a prior general owner direction appears to authorise the outcome.
Wholesale restoration of a working tree's prior state is never a self-serve
move, whether or not the blocked command was actually attempted. The block's
purpose is to force the stop-and-surface moment; a workaround deletes that
moment and with it the owner's chance to catch a wrong premise (worked
instance 2026-06-12: a blocked `git restore` on generated drift was
recreated by forward-writing the HEAD content; owner: "never do that
without my express permission"). General intent is not permission for a
specific blocked operation: stop, surface the block and the intended
effect, and proceed only on express per-instance instruction (the owner
may run the command themselves via `!`). The table's "read HEAD, then
Edit what you want to keep" row is selective forward judgment, not this —
the line is wholesale restoration of the blocked effect.

## Read the Target Immediately Before Any Overwrite

Even on the permitted forward path (Edit/Write toward committed content),
**read the target's live diff at the moment of acting** — overwriting
destroys exactly the evidence needed to answer "were my changes the only
changes in that file?" afterwards (owner catch 2026-07-25: a forward
overwrite of two shared-checkout files was answerable only from a stale
`git status` that happened to survive in context; the safe-looking method
had made the safety question archaeological). Ten seconds of `git diff --
<file>` before the write makes the question answerable instead; certainty
is the thing that removes the check, so the check is unconditional.

## A Safety Proof Never Licenses the Class

No local proof of safety — a byte-identical duplicate elsewhere, a clean
`diff`, a verified ancestor relationship — licenses a risk-of-loss
operation (`stash`, `checkout`, `reset`, or kin): a git-side discard of
working-tree content. The class this section bans is the discard, whatever
its proof. A forward write of content proven present elsewhere is a
different act — it removes nothing that is not already conserved — and the
standing grant below scopes exactly that act; it licenses no member of the
banned class. The owner ruled this
against a PROVEN-duplicate `git stash push` proposal (2026-07-15):
*"no operations that might risk a loss of work; relaxing that discipline
is what caused these problems in the first place."* The doctrine point is
that the discipline's value IS its absoluteness: every relaxation
argument arrives with a locally-sound proof, and the class of losses this
rule prevents was caused by exactly such proofs being wrong in ways their
authors could not see (a peer's unseen edit, a stale comparison, a moving
tree). Leave-and-surface, or an owner-run command, are the only paths —
never a self-served exception. This coheres with the no-escape-hatches
principle (`principles.md` §First Principle): the impulse to construct a
sanctioned bypass is itself the signal to examine.

**Standing grant for proven paths (owner-ruled 2026-09-08, card answer
verbatim: "Standing grant for proven paths") — a scoping of the class,
never an exception to it (`rules-have-no-exceptions`).** A path whose content is
PROVEN on the freshly fetched `origin/<base>` — identical there; landed
there and since revised; or conserved in a tracked home — with the proof
recorded per path in a surfaced table, MAY be cleared by the seat. The
grant is one invariant, not a list of cases: **the working tree and the
index for that path are brought to what HEAD records — content, type
and mode — by forward writes only, and the clearing is proven by
`git status --porcelain -- <path>` reading empty afterwards.** The
forward writes are: content from `git show HEAD:<path>` written to a NEW
file beside the path and renamed over it — for a path that is a regular
file and not a symlink (`! test -L <path> && test -f <path>`), allocate a
fresh sibling in the same directory with `mktemp "$(dirname <path>)/.proven.XXXXXX"`,
write `git show HEAD:<path>` into it, then `mv` it over the path (never a
fixed sibling name, which a redirect would truncate if a file already
sat there) — never a redirect into the existing path, which writes
through its inode and overwrites any second hard link inside or outside
the worktree while the status still reads empty; type and mode from
`git ls-tree HEAD -- <path>` (a symlink
recreated with `ln -sfn` to HEAD's target, never written through; the
executable bit set or cleared with `chmod` to the bits the recorded mode
names: `755` for `100755`, `644` for `100644`, since chmod takes bits, not
git's mode string); the index brought to match with `git add <path>`
(the single-path form; `-A`, `--all` and `.` stay blocked); a path HEAD
does not hold — a staged addition or an untracked file — dropped from the
index with
`git rm --cached <path>` where staged and MOVED to the session scratchpad,
never deleted in place. Any path the forward writes do not bring to an
empty status — a type change the seat would have to write through, a
state this paragraph does not name — is SURFACED with its proof, never
improvised. The proof is the licence and it is per path: one unproven
path keeps the whole worktree outside the grant, and the blocked command
forms (`restore`, `checkout --`, `reset`, `stash drop`, `clean`) stay
blocked with the hook policy unchanged — the grant is a write of proven
content, never a git-side discard. The grant exists so that a worktree
whose every dirty path is already conserved can be retired by the seat
under `worktree-hygiene` §6 without a per-instance ask; anything short of
a recorded per-path proof falls back to the absolute clause above.

## Exceptions

There are none for working-tree edits: the standing grant for proven paths
above is a scoping of the banned class (a discard), not an exception to it —
a forward write of proven content is outside the class by construction.
Once a change is committed, the
normal git tools (revert, reset on a private branch you own) become
available as forward-going operations because they create new commits
that record the change. Those are not in scope of this rule.

## Capture, Always

When you remove work — yours or anyone's — the realisation that drove
the removal must land somewhere durable. The minimum is one entry in
`.agent/memory/active/napkin.md` naming what was removed and why, in
the same session as the removal. Without that entry the next agent will
re-create the work you removed, because the artefact gravity of plans,
prior commits, and ADR text will pull them back toward it.

## Source Incident

The rule was authored 2026-05-03 after Salty Navigating Jetty (`900b17`)
ran `git checkout HEAD -- <files>` to revert in-flight cycle-1 code,
silently wiping (a) Salty's own napkin and thread-record edits and (b)
possibly Tidal Flowing Reef's (`f879e0`) parallel-session edits to the
same files. Owner correction: *"we don't throw away work, we remove it,
we go forward not backwards, change the files, don't use git."*

The destructive command was permitted by the policy because the
blocked-patterns list named history-rewriting commands (`reset --hard`,
`rebase -i`, `push --force`, `clean -fd`) but not working-tree-overwrite
commands. The list is now extended; the rule is explicit; the failure
is named in the napkin.

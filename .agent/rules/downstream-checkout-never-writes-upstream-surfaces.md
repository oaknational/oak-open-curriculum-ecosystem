---
classification: core
description: A seat on a downstream checkout (fork, mirror, an organisation running the tree as its own) never reads the upstream repository's surfaces without the owner's permission (the one standing grant is a read-only upstream fetch) and never writes to them; every repository-scoped call names its repository explicitly, the checkout's own by default; the PR base is the repository's default branch, derived at the moment of use, never a literal.
---

# Downstream Checkout Never Writes Upstream Surfaces

Operationalises the principle that organisational identity is held below
the tree: mechanism names no organisation, and the default branch is
derived, never a literal. OCE records that principle as its architecture
decision on organisational identity below the tree (ADR-231 there). An
estate that runs as its own origin with no upstream is bound by the fork
clauses the moment a second remote or a fork of its tree exists; the
explicit-repository and derived-default-branch clauses bind every call now.
One gap in jimcresswell.net's own tooling is known: its spawn command's
`--base` defaults to `origin/main` and its pull request opens against that
literal; deriving the default branch there is a code carry of the parity
queue, and until it lands the clause binds the seat, which passes `--base`
explicitly, not the tool.

A checkout that runs this repository downstream of another (a fork, a
mirror, an organisation running the tree as its own) has exactly one set
of surfaces of its own: its repository, its tracker, its chat, its
code-quality and error-reporting projects — the identity held below the
tree. The upstream's surfaces are someone else's. A seat on a downstream
checkout never reads the upstream repository's surfaces without the
owner's permission and never writes to them at all. Which repository a
checkout is, and so whose surfaces are its own, is read from its git remote,
never from the directory it sits in: a method checkout under a path named
for the upstream organisation was the fork by its `origin` URL (2026-10-07),
and a reading from the surrounding directory name would have aimed its
writes at the upstream.

## Trigger

Any repository-scoped `gh` call, any tracker or chat write, any API
call whose target repository, organisation or project is inferred rather
than named; any read of the upstream repository (its pull requests,
issues, branches, files) or of an upstream organisation's private
repositories. Calls with no repository target (a `users/...` endpoint, a
`gh auth` command) are outside this rule.

## Action

- **Reads of the upstream repository need the owner's permission first,
  each time.** The one standing grant: a read-only `git fetch` of the
  upstream remote for comparison (owner verbatim, 2026-09-08: "you have
  standing permission to fetch the upstream remote for the purposes of
  read-only comparison"). Nothing else is standing. Amended for Oak's
  GitHub on 2026-10-13 (owner verbatim: "You are always permitted read-only
  access to Oak github, write access is forbidden for now, that will change
  at a later date"): a read of any Oak GitHub surface needs no permission;
  a write of any kind stays forbidden until the owner lifts it by word. The
  2026-09-06 ruling's read half is superseded there and its write half
  stands.
- **Writes to the upstream's surfaces are forbidden without exception**:
  no pull request, comment, review, issue, label, tracker ticket or chat
  message on the upstream's repository, tracker or chat.
- **Every repository-scoped call names its repository explicitly** —
  the checkout's own by default; the upstream's only under an
  owner-permitted read, and named explicitly then too. `gh` takes
  `--repo <owner>/<name>` where the command has the flag (`pr`, `issue`,
  `run`, `release`); `gh api` has no flag, so the full
  `repos/<owner>/<name>/...` endpoint or `GH_REPO` in the environment
  names it; `gh repo view` takes the positional. `gh repo set-default`
  is machine-local and protects one machine only; the explicit target
  travels with the practice.
- **The base branch of a pull request is the repository's default
  branch, derived at the moment of use, never a literal.** Two reads
  agree and either serves; both are verified (2026-09-08):
  `git remote set-head origin --auto` refreshes the cached remote HEAD
  from the remote (a plain `git fetch` does not, so a clone made before a
  default-branch change would otherwise keep the old name), then
  `git symbolic-ref --short refs/remotes/origin/HEAD` prints
  `origin/<branch>`, and the bare name is the part after `origin/` (a
  single-branch clone has no remote-tracking ref for the default branch
  to point at, so it first reads the name from the remote with
  `git ls-remote --symref origin HEAD`, whose `ref:` line names the
  branch, then fetches it with the explicit refspec
  `git fetch origin <name>:refs/remotes/origin/<name>` — the clone's
  configured refspec covers only its original branch, so a bare
  `git fetch origin <name>` writes `FETCH_HEAD` alone and the tracking
  ref never appears — then runs `set-head --auto`); or
  `gh repo view <owner>/<name> --json defaultBranchRef --jq
  .defaultBranchRef.name` with the repository named — never the bare
  `gh repo view`, which infers the repository from the directory and on
  a checkout with an `upstream` remote can answer for the wrong one.

## Failure Mode Prevented

A checkout carrying `origin` (its own repository), `upstream` (the line
it forked from) and a read-only mirror gives every inferring surface
three candidates, and the tools infer the wrong one silently. Worked
instance, the owner's fork of OCE's upstream (2026-09-06): the owner's
ruling, verbatim, "This is the Engraph fork, do not access the Oak repo
without permission and NEVER write to the Oak repo, to Linear, or any
other Oak surface"; the same day `gh pr list` with no `--repo`, on a
checkout with those three remotes, resolved to the remote named
`upstream` and read the upstream repository's pull-request list — the
read the ruling forbids. Cure applied: the explicit target on every
call, as above. A later instance one level down, on the same fork
(2026-08-23): a pull request opened against the fork's then-default
branch, which mirrored the upstream, and merged there; the retarget cost
a second pull request, and the default branch has since been set to the
fork's working branch, which is why the base is derived and never
written down.

The boundary runs through authority as well as surfaces. An upstream
product decision — a live set, a listing gate, a closure "not to re-enable
X for now" — is a fact about the upstream, never a constraint on the
downstream line unless the owner adopts it (owner, 2026-09-05, correcting a
report that had carried the upstream's connector-listing gate onto the fork
by analogy: "The Engraph fork is not subject to the same authority as the
Oak fork", and, on a closure the report had hedged over as if it might bind,
"The decision was made, but you have no reason to think it was made with
authority or appropriate context"). A decision's existence and its authority
are separate facts. When an upstream decision reaches this line, record it
as a fact about the upstream and transmit no upstream product gate as a gate
here; the only gates on a served-surface change downstream are the line's
own product decision and its licence position.

The upstream organisation's PRIVATE repositories are internal systems, not
reads: only the public upstream repository is a permitted read source.
Before any read of another repository under the upstream organisation, run
the visibility check on its own (`gh repo view <owner>/<repo> --json
visibility`) and read the answer before issuing the read — never batch the
check with the read (a code search ran in the same batch as the check that
answered PRIVATE, 2026-09-05).

## Related Surfaces

- OCE's architecture decision on organisational identity below the tree
  (ADR-231 there) — the identity this rule protects is configuration below
  the tree; the mechanism above names no organisation. An estate with no
  fork line holds no twin of that record; the principle binds through this
  rule.
- [`bot-identity-on-third-party-systems`](bot-identity-on-third-party-systems.md)
  — the identity every write carries on the checkout's own surfaces.
- [`never-commit-to-main`](never-commit-to-main.md) — local commits to
  the default branch are separately prohibited.

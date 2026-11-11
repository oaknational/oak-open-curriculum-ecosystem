---
id: practice-lineage-transplant
node_type: runbook
name: Practice lineage transplant
overview: >-
  Bring a host that already carries a generation of the Practice lineage up
  to a newer generation of the same lineage, preserving the host's own
  divergence, with every mechanical step run by an instrument and every
  judgement step presented to the owner as one numbered list.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-27
---

# Practice lineage transplant

Brought from the second estate through the two-way exchange (register row J11). The second
estate wrote it from the first instance, this estate's Practice into the second estate on
2026-09-12, and ratified it there the same day. It was born `sketch` here. The review of this
copy found fourteen cures, both copies carry them, and the owner ratified the two copies together
on 2026-09-27 ("Ratify both", answer 10 to the Director's card; recorded verbatim on this estate
in `.agent/memory/active/napkin.md`, the block "The owner's thirteen answers of 09:1xZ, recorded
on the lineage for the runbook stamps", commit 98796ef88). The same day, the review of this
copy's convergence found the rollback unsafe for a path's type and mode; its cure, a procedure
change, returned both copies to `sketch` until the owner ratifies again. The next instance, in
either estate, tests every step and fills the timing table; a step that fails there returns this
runbook to sketch for re-ratification. PDR-005 covers transplantation into a Practice-free
repository. This runbook covers the other case: the destination already has a Practice, an older
generation of the same lineage plus its own local divergence.

## When to run

At owner word, when a host should take a newer lineage generation. Not on a
cadence: the lineage evolves continuously, and the host takes a generation
when its owner decides the delta is worth the rulings it will cost.

## User groups and value

- **The owner** rules once per genuinely host-specific question and never
  again on a question instance 1 already settled.
- **The transplanting seat** runs instruments instead of writing them, and
  spends its judgement only on the paths the classification marks as
  contested.
- **Every later seat on the host** inherits entry points that describe the
  host, scripts that exist, and assertions that were exercised before the
  seat met them.

## Preconditions

Each item is checkable; the check is named.

1. **A pinned, read-only source.** The source checkout is another seat's
   estate or a bare mirror; every read is `git -C <source-checkout> show
   <pin>:<path>`, never the working tree. Check: the pin SHA is recorded in
   the manifest before the first read. The manifest is the exploration
   document PDR-005 mandates, in the host's `docs/explorations/`.
2. **The host's ancestor commit is known and recorded.** The host's
   `.agent/practice-core/provenance.yml` and `CHANGELOG.md` date the last
   time it took the lineage, and the host's own transplant records may name
   a later re-sync; the candidate ancestor is the source commit on or before
   the latest such date. Check: `git -C <source-checkout> merge-base
   --is-ancestor <ancestor> <pin>` succeeds, because an interval counts as
   since-ancestor only when the ancestor is reachable from the pin; and for
   every machinery path the host has not edited since, the host's file is
   byte-equal to the candidate's — a candidate that fails this on many
   paths is the wrong date. The ancestor
   SHA goes in the manifest; every count in step 1 is measured against it.
3. **A tagged pre-state.** `git tag
   transplant/pre-<YYYYMMDDTHHMMSSZ>-<short HEAD>` on the host, the time in
   the basic ISO form because a colon is illegal in a ref name. The tag is
   unique to this run, pushed to the host's remote, and its SHA is recorded
   in the manifest. Check: the tag resolves to the host's HEAD before step
   1, and the remote holds it. Corrections are a corrective pass, never a
   rollback (PDR-005), but the tag makes every audit possible post hoc,
   from any clone.
4. **A clean host tree and a claim.** Check: `git status --short` is empty;
   the transplanting seat's claim names the machinery areas; any other live
   seat on the host has been told the areas.
5. **The instruments exist as bins** on the host or the transplanting
   checkout: `transplant classify`, `transplant antigen-scan`, the
   sub-agent adapter generator, the rules-index generator, and the
   assertion validators (cited scripts, reference direction, machine-local
   paths, CI parity, markdown links, portability, sub-agents, skills).
   Each runs against the host tree: from the host checkout, or from the
   transplanting checkout with the host checkout's path as its argument.
   Check: each is a `package.json` script that runs. A transplant that
   starts without them writes them first and lands them before anything
   else (instance 1 lost two generators to context end).
6. **The instance inputs are readable**:
   `.agent/reports/practice-transplant/inputs/` (rules verdicts, drop list
   by subject class, script keep/retire, record-number-to-home map,
   antigen list, config decision list, standing owner question set).
   Check: the directory exists and each file names its reader step below.

## Steps

Each step names its executor. Owner-held steps surface as one numbered list
taking one word, declines by item number.

1. **Measure before shaping** (`agent`). `git -C <source-checkout> diff
   --stat <ancestor> <pin> -- <machinery paths>` and `--name-status` per
   surface (rules, skills, directives, practice-core, sub-agents,
   reference, prompts, executive memory, agent-tools). Record the counts in
   the manifest. This number sizes every later step; a transplant whose
   size is unknown is planned by guess.
2. **Classify every machinery path by a three-way comparison** (`agent`,
   `transplant classify`). Given ancestor, pin and host, each path takes
   exactly one of five classes: **unchanged-in-host** (host
   equals ancestor: mechanical overwrite from the pin); **theirs-only**
   (new upstream: subject to the drop verdicts); **ours-only** (host-local:
   keep, untouched); **both-changed** (judgement); **upstream-deleted**
   (drop unless the host changed it). The output is the manifest's RED
   rows (PDR-005 phase 1). Content-novelty scoring (the 8-gram set
   difference of instance 1) is the fallback when the host reformatted files
   en masse and byte comparison over-reports change.
3. **Name the preserve set** (`agent`, then `owner-held`). From ours-only
   and both-changed: host rules, host skills, host PDRs, host templates,
   and every record-number collision (same number, different subject),
   renumbered per PDR-049 before any copy. Scan collisions first; a
   directory copy destroys the local record with no conflict marker.
4. **Collect every owner question before the first copy** (`agent` compiles,
   `owner-held` rules). The standing question set from the inputs, minus
   every question the host's profile already answers, plus the host-specific
   ones: the drop list by subject class (upstream product, vendor accounts
   the host does not hold, platforms the host does not run), the config
   decisions (formatter split per workspace, markdownlint footprint, lint
   major per workspace, package-manager pin, secret scanner, CI runner,
   tracker, bot identity), the directive merge order, the adapter surfaces,
   the statusline mark. One list, one word.
5. **Apply the mechanical set** (`agent`). First converge the host's script
   names on the lineage's as practised, read from the lineage's root
   `package.json` at the pin rather than from its naming record (instance 1
   found the record and the scripts disagreed), and surface the choice as one
   ruling. Every caller of a renamed script (hooks, gates, CI, skills,
   adapters) moves in the same change (`replace-dont-bridge`); never keep
   both conventions side by side, because every transplanted skill cites
   the lineage's names and an alias doubles the citations. Then apply step
   3's renumbering before any copy, moving every reference to a renumbered
   record in the same change (PDR-049). Then
   overwrite unchanged-in-host from the pin; add theirs-only after the drop
   verdicts; run the org scrub (scope and org name are a `sed`;
   product-shaped references are excised or judged one by one — rename when
   the import target exists on the host, excise the importer when it does
   not, and match import syntax, print the list, then delete). The scrub
   never rewrites records: napkin, experience and archived plans keep their
   old names.
6. **Merge the judgement set at content grain** (`agent`). Directives first
   (source structure, host sections at role positions); then rules, triaged
   from the per-rule digest (`transplant digest`: frontmatter, headings,
   every product-shaped line) with the inputs' verdict table as the default
   verdict for every rule it names, so only new rules need a fresh verdict;
   then skills (dedupe against host skills by subject, not name); then
   sub-agent templates. Each merge lands with a disposition row (applied,
   already-covered, dropped-as-upstream).
7. **Install the harness in order** (`agent`): policy file, then the
   postinstall bootstrap build, then platform settings; verify between each
   with the guard's own smoke. The guard fails closed and activates the
   moment settings are written; copying the set in one move locks the
   session out of every guarded tool. Then hooks, husky, CI with the parity
   validator, root config reconciled with the host's own.
8. **Generate every generatable surface** (`agent`): skill and rule
   adapters (`portability:fix`), sub-agent adapters, the classified rules
   index, Cursor triggers, the Codex registry. A surface that a generator
   can produce is never hand-copied. PDR-009 settles the direction: the
   canonical `.agent/` templates are the source and every platform adapter
   is a thin projection of them; a host generator that inverts this (one
   platform's adapters as the hand-authored source) is replaced by the
   canonical-first generator, never bridged (`replace-dont-bridge`).
9. **Exercise every assertion** (`agent`): run the assertion validators in
   order and cure each red by making the assertion checkable, by making the
   code not depend on it, or by truing the text — in that order of
   preference. A link whose target is a lineage-only record or surface is
   removed, never re-pointed; a record number that survived the copy is
   checked by title at its target before it is kept.
10. **Exercise every root script once, reading before running** (`agent`).
    Read each script's definition first. The generators and validators that
    steps 8 and 9 name have already run under those steps, their definitions
    read there. Any other script whose effect goes beyond a check is judged
    from its definition and never run: one that publishes, deploys or
    releases; writes to a remote or a vendor account; installs, deletes or
    rewrites files; or starts a long-lived process. Every other script runs
    once. Keep a script when a consumer exists on the host (a hook, a gate,
    a skill that cites it, a platform in use); retire it when its subject is
    an upstream artefact, a vendor account the host does not hold, or a
    product surface.
11. **Home the docs layer by role** (`agent`, PDR-014): doctrine into
    directives, recipes and host guides into reference, contracts into
    executive memory, developer narrative into `docs/`; never as a
    directory. A doc with no `.agent/` home is product documentation or
    dead.
12. **Keep the records as you go** (`agent`). The manifest carries an
    execution record per step: time, instrument used, decision count,
    mistakes and their cures. A cross-instance guidance report gains one
    addendum per instance (the cross-instance shape). `provenance.yml` gains
    the lineage entry. Every script written during the run lands as a bin
    before the session ends; the wrap's loss scan names session-local
    instruments as its first class.
13. **Close the four audits with instruments** (`agent`, then `owner-held`
    ratification of the manifest): foreign-antigen is the antigen scan at
    zero; completeness is every classified row dispositioned;
    cohesion is reference-direction green plus the directives read against
    the retained ADRs; manifest-closure is no row in an unknown state.
    The completeness audit's frame is a definition of the Practice by
    function (the second estate's names nine): the audit closes when every
    function's row reads present with a cited proof, and the closure record
    names the pull request that closed each residue row.

## Verification

The end state is confirmed by: the assertion validators green; `pnpm check`
green on every leg the host defines; entry points (`AGENT.md`, `HUMANS.md`,
`practice-index.md`, `README.md`) describing the host, checked by reading
them; the preserve set present and byte-identical to the pre-state tag
where it was marked keep; the `provenance.yml` entry appended; the timing
table below carrying this instance's column.

Two outcomes are recorded on this runbook by the seat that ran it, dated,
and read by the owner: the number of owner questions asked and the elapsed
agent time, against the packaging exploration's threshold (a run under two
hours by runbook alone means the installable-thing generator is not
built); and the wrap loss-scan's count of instruments that existed only in
the session's transcript at close, which must be zero.

## Rollback

Steps 5 to 11 change shared state; every one is reversible per path from
the pre-state tag and the pinned source. The rollback starts from a clean
tree, as the transplant does (precondition 4), so no uncommitted edit is in
its way. Each restore is an ordinary forward change from the recorded
revision that brings back content, type and mode together, after the
forward-write mechanics of `never-use-git-to-remove-work`: a regular file's
content from `git show <pre-state tag>:<path>` for a host file, or from
`git -C <source-checkout> show <pin>:<path>` for a drop, written to a fresh
`mktemp` sibling and renamed over the path, never redirected into it; a symlink
(mode `120000`) recreated with `ln -sfn` to the target that the same
revision records, and never given `chmod`, which follows a link to its
target; a regular file's mode set with `chmod 755` or `chmod 644` to match
the `100755` or `100644` that `git ls-tree` records at the same revision as
the content (`git ls-tree <pre-state tag> -- <path>`, or `git -C
<source-checkout> ls-tree <pin> -- <path>` for a drop), never at `HEAD`,
which holds the transplant's state. A path whose type differs between the
current tree and the restore source (a file, a symlink, a directory, or a
symlink that resolves to one) is surfaced with its proof, never written
through: a rename or `ln -sfn` onto a directory, or through a symlink to
one, lands inside it. A path the transplant added, absent from the
pre-state, is deleted in the same forward commit. The corrective pass is the
PDR-005 default: correct forward on the manifest, never reset the branch.
Step 7 has a specific recovery: if the guard locks the session out, restore
the policy file with a tool the matchers do not name, then re-run the
sequence in order. Records written in step 12 are never rolled back.

## Measured per instance

Agent time with instruments, one column per instance. The first instance's measurements are the
second estate's record, kept on its copy of this runbook. This estate's column is empty until
the next instance runs here.

| Step                              | Next instance |
| --------------------------------- | ------------- |
| Corpus rejection, matching, diffs |               |
| Content-novelty classification    |               |
| Owner rulings                     |               |
| Directives merge                  |               |
| Rules triage (from digests)       |               |
| Harness and gate fixes            |               |
| Docs layer by role                |               |
| Assertion exercise                |               |
| Instruments written in-session    |               |
| Closure                           |               |

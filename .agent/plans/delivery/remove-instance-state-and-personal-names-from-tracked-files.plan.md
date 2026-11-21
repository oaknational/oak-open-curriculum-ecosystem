---
id: remove-instance-state-and-personal-names-from-tracked-files
node_type: delivery
name: 'Remove instance state and personal names from tracked files'
overview: >-
  Rules, skills, directives, code and tests state general requirements and use invented
  identities; no tracked file but the code-owners file names a real person's account, and no
  living file carries a fact true only of this instance of the repository.
status: ratified
ratified_by: owner
ratified_date: 2026-11-21
ratified_where: "The owner's answer to a question prompt in the session of Sandpiper guards Wind (690653), 2026-11-21: 'Approve'."
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
last_updated: 2026-11-21
---

# Remove instance state and personal names from tracked files

## Goal

Someone who clones or forks this repository gets rules, skills, code and tests that are true
for them, and gets no real person's account name with them.

## User groups and value

- **A person named in a tracked file** has their account name, domain or address out of a
  repository that is public and will be forked.
- **An organisation running a fork** inherits no rule, example or test about another
  organisation's people, code owners or settings.
- **Seats working here** read rules that say what is required, with no instance to mistake for
  the rule.

The owner, 2026-11-20: "this is a repo, it will be cloned, forked, modified... state that is
particular to _this_ instance of the repo **should never be in version control**... imagine,
someone forks it, and they have a rule about _my_ username: 1. that is not useful, 2. you have
put my PII into a repo".

## What was counted on 2026-11-20

Counted with `git grep` at `origin/main`; re-count at pickup.

- 217 tracked files carry the owner's GitHub username or personal domain.
- About 101 of them are outside memory, reports, research, the rapid-comms records and the
  archives. Among those: 18 rules, 15 files under `agent-tools/src` (9 in `pr-watch`, 6 in
  `merge-bot`), 6 sub-agent templates, 6 delivery plans, 4 decision records under
  `practice-core`, 3 test fixtures, 2 architectural decision records, and skills and directives.
- The forms seen: the bare username, the username as a mention, the personal domain, a second
  repository named after that domain, branch names prefixed with the username, and a package
  scope.
- Other people's logins are in `.github/CODEOWNERS`, which GitHub requires to be real.
- This count covers one person. Other real names, logins and addresses are not yet counted.

## The re-count of 2026-11-21 (todo 1)

Counted with `git grep` at `origin/main` (`f36581d97`), leaving out `.github/CODEOWNERS`.

- **The owner's account name or domain: 210 files.** 119 are dated records. 91 are living
  files:
  - 19 `package.json` files carry people in `author` or `contributors`: a contact address
    and a personal site in each, and in the root file the account's page and two other
    people's addresses.
  - 19 files under `agent-tools` (15 source, 4 tests) name a second repository after the
    domain, as a probe's location or a fixture.
  - 18 rules, 6 sub-agent templates, 7 skills, 8 delivery plans, 4 decision records under
    `practice-core`, 2 pages under `docs/architecture`, and the sub-agents index.
  - The forms: the domain (89 occurrences), the mention form (22), the bare name (17), the
    contact address (19), about 20 branch names prefixed with the name, a package scope (3)
    and the second repository (4).
- **A second code owner's account name: 43 files**, 6 of them living (4 delivery plans, 2
  pages under `docs/architecture`), the rest dated records.
- **Two other code owners: 3 files**, dated records and the root `package.json`.
- **A personal mail address: 3 files**, a comms record and two archived Sonar evidence files
  (13 occurrences).
- **One contributor's address on a personal domain: 1 file**, the root `package.json`.
- Addresses at the organisation's domain are shared mailboxes or fixtures, but for one
  personal address in one file.

### Found during delivery, 2026-11-21

The name search understated one surface. Nine reviewer templates under
`.agent/sub-agents/templates` carry another repository's instance as their own: its
workspaces, its configuration files, its decision-record numbers and two reviewers this
repository does not have. A search for the account name and the domain finds the sentences
that name that repository and misses the paragraphs that describe it without naming it. The
wording these templates carried before 2026-10-04 is in git history. Editing sentences did
not make them true (a review of oaknational#1049 found absent records still cited), so seven
have their earlier bodies back under their current frontmatter, the config one trued against
today's files, and two smaller ones are edited. Still to read line by line: the other
templates that commit touched (`onboarding-expert`, `subagent-architect`, `test-expert` and
smaller ones), and the prose improvements the replaced text carried, which are worth
re-applying for this repository.

The owner's answers by question prompt on 2026-11-21: package manifests name the organisation
only, and passages about the sibling estate are removed from this estate's rules and skills.

## Mechanism

Three kinds of occurrence, each with its own cure.

1. **An example or a fixture.** A login used to show a shape (a test's reviewer, a rule's
   sample command) becomes an invented one, such as `a-person` or `example-org/example-repo`.
2. **An instance fact.** A sentence that says what this instance's owner, bot, sibling
   repository or settings are moves to per-checkout configuration or the operator profile,
   following the merge-bot configuration's shape (an untracked file behind a tracked example),
   or is deleted when nothing reads it. The rule keeps the general requirement.
3. **A dated record.** Memory, reports, research, comms records and archives record what
   happened. Each real account name, domain or address in one is replaced with a role word
   such as "the owner", and nothing else in the record changes (the owner's answer by
   question prompt, 2026-11-21: "Rewrite names only").

A check keeps the result: a validator over every tracked file but `.github/CODEOWNERS` that fails on a real account
name from a list held outside version control, so the list itself is not the leak.

## Acceptance criteria

1. No rule, skill, directive, sub-agent template, source file, test or fixture names a real
   person's account, domain or address. Proof: `repo-safe`, the search recorded on the pull
   request, and the validator in `pnpm check`.
2. Every instance fact removed from a rule or skill is either read from configuration at run
   time or absent, and the tool or rule that used it still passes its tests. Proof:
   `repo-safe`, CI.
3. No dated record names a real person's account, domain or address, and each changed record
   differs from its earlier form in those names alone. Proof: `repo-safe`, the search and the
   diff recorded on the pull request.
4. `.github/CODEOWNERS` is unchanged. Proof: `repo-safe`, the diff.

## Todos

1. Re-count, for every real person the repository names, and sort each occurrence into the
   three kinds.
2. Fixtures and examples, one pull request per workspace or surface.
3. Instance facts, one pull request per fact family, each with its configuration home.
4. Dated records, names only, one pull request per surface (memory, reports, research, comms
   records, archives).
5. The validator, landed blocking once every tracked surface is clean.

## Out of scope

- Git history. Removing a name from past commits is a separate decision with its own costs.
- `ratified_by` and similar authority fields in plan and decision-record frontmatter. They
  keep the personal name of whoever ratified (the owner's word, 2026-11-21). This plan
  removes account names, domains and addresses, and the validator's list holds only those
  three kinds; a field that carries one of those is in scope like any other line.
- Agent session names, which name no person.

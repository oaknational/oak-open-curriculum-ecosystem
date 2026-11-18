# The rules and skills pipeline as it stands: an audit against the code

The first todo of the delivery node
[`rules-and-skills-system-design`](../../../plans/delivery/rules-and-skills-system-design.plan.md).
A read-only audit of this repository at commit `8e80d7527` on 12 November 2026. Facts only:
it proposes nothing. Every figure names the command that produced it; the census commands
are the appendix. Paths under `agent-tools/src/` are abbreviated: `rule-declarations/…`,
`skills-adapter-generate/…`, `validators/portability/…`, `practice-fitness/…`,
`context-cost/…`.

The reading was done by a sub-agent that had written none of the code or the plan. The seat
that commissioned it then checked the claims a design would lean on most at their cited
lines; section 10 lists them.

## The audit in one page

Each line is established in the section named.

- **A rule is declared by four frontmatter fields**: `classification` (`core` or
  `situational`), `description`, `trigger` and `globs`. No other key is admitted, so a rule
  cannot carry a size limit of its own (section 1).
- **One command renders four outputs from each rule**: a Claude adapter, an `.agents` adapter,
  a Cursor rule and a row of the rules index. The two adapters are a one-line pointer to the
  canonical file. No output carries a rule's body, and only the Cursor rule carries its
  description (section 2).
- **On Claude Code `classification` alone changes nothing.** An adapter is path-scoped only
  when a situational rule has globs: 21 of 124. The other 103 are unscoped pointers
  (sections 2 and 6).
- **`trigger` reaches the index row and nothing else**, and no reader enforces its
  vocabulary (sections 1 and 2).
- **Skills have a separate generator**, run from built JavaScript with a required prefix. It
  writes adapters to `.claude/skills` and `.agents/skills` only. Each adapter carries the
  skill's whole description and a pointer to the canonical file, and supporting files are
  copied beside it (section 3).
- **The checks run in CI; the generators do not.** `portability:check` and `skills:check` run
  in the `static-checks` job. Nothing runs `portability:fix` or `skills:generate` for the
  author (section 4).
- **One size threshold fails the build**: the rules index against 32 × 1,024 bytes. It
  measures the index alone, at 11,876 bytes, and not `AGENTS.md` (section 5).
- **The fitness validator fails no build and measures no rule or skill file** (section 5d).
- **The skill specification's size limits are checked nowhere.** Three adapter descriptions,
  as parsed, exceed 1,024 characters (sections 3, 5c and 6).
- **The canonical rules hold 1,077,957 bytes in 124 files; the Claude adapters hold 9,931**
  (section 6).
- **By the vendors' documentation, not by observation**: `.agents/rules/` has no reader, and
  the Codex fallback setting that names the rules index does nothing while a root `AGENTS.md`
  exists (section 8).
- **Not audited**: the sub-agent validators, the other build checks, and every platform's
  behaviour in a running session (sections 5 and 9).

Four commands were run at this commit; each exited 0:

| Command | Last line of output | Exit |
| --- | --- | --- |
| `pnpm -s portability:check` | `Portability validation passed: 78 canonical skills, 124 canonical rules with their index and three adapter projections recomputed, 26 sub-agent templates with their four adapter surfaces and the Codex registry's blocks recomputed.` | 0 |
| `pnpm -s skills:check` | `All adapters are up to date (78 canonical skills, 82 carried supporting files per surface).` | 0 |
| `pnpm -s subagents:check` | `Sub-agent standards validation passed: 31 Claude wrappers, 31 Cursor wrappers, 30 Codex adapters, and 26 template files are compliant.` | 0 |
| `pnpm -s practice:fitness:informational` | 965 lines of report (not kept; the command regenerates it) | 0 |

## 1. The rule declaration

A canonical rule is a file `.agent/rules/<name>.md`. Its YAML frontmatter is its declaration
(`rule-declarations/rule-declaration.ts:2-9`).

**Name.** The basename must match the pattern below, checked before the file is read
(`validators/portability/rule-projection-validation.ts:135-139`).

```ts
const RULE_BASENAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;   // rule-declarations/rule-name.ts:24
```

**Fields.** Four keys are admitted and any other key is refused
(`rule-declarations/read-rule-declaration.ts:31-36`, `:91-94`).

| Field | Required | Allowed value | Enforced at |
| --- | --- | --- | --- |
| `classification` | always | `core` or `situational` | `rule-declarations/rule-declaration.ts:18`; `read-rule-declaration.ts:115-121` |
| `description` | always | a non-empty string with no newline; no length limit | `read-rule-declaration.ts:108-113` |
| `trigger` | on `situational`; forbidden on `core` | a non-empty string with no newline, `\|` or backtick | `read-rule-declaration.ts:154-163`; `:128-130` |
| `globs` | optional on `situational`; forbidden on `core` | a YAML list of non-empty one-line strings, no repeats, each surviving a comma-split round trip | `read-rule-declaration.ts:165-184`, `:187-190`; `:128-130` |

The conditions, verbatim:

```ts
// read-rule-declaration.ts:128-130
return 'trigger' in fields || 'globs' in fields
  ? err('a core rule carries no trigger or globs')
  : ok({ name, classification: 'core', description });
```

```ts
// read-rule-declaration.ts:154
const TRIGGER_CANNOT_CARRY = /[\n|`]/u;
```

The frontmatter block must open on line 1 with `---`, close with a later `---`, parse as YAML
and be a mapping (`read-rule-declaration.ts:73-80`, `:61-71`).

**What `classification` changes downstream.**

- `core`: the Cursor file gets `alwaysApply: true`
  (`rule-declarations/render-rule-projections.ts:102-104`); the index row's trigger cell is an
  em dash (`render-rule-projections.ts:72`, `:151-153`); the Claude adapter is the plain pointer
  (`render-rule-projections.ts:123-125`).
- `situational`: the Cursor file gets `alwaysApply: false`, with a `globs` line when the rule
  has globs (`render-rule-projections.ts:105-112`); the index row shows the trigger in a code
  span (`render-rule-projections.ts:152`); the Claude adapter is the plain pointer unless the
  rule has globs (`render-rule-projections.ts:123-127`).
- The Claude adapter of a `situational` rule with no globs is byte-identical in shape to that of
  a `core` rule: the branch tests `classification === 'core' || globs.length === 0`
  (`render-rule-projections.ts:123`).

**What `trigger` does.** It is written into the index row and nowhere else
(`render-rule-projections.ts:146-156`). No renderer of the Claude, `.agents` or Cursor file
reads it (`render-rule-projections.ts:96-138`). The type's comment describes it as "a
`surface:`, `session:`, `ceremony:` or `tool:` token, optionally followed by ` — ` and a short
gloss" (`rule-declaration.ts:51-54`); the reader does not check for those tokens
(`read-rule-declaration.ts:156-163`). At this commit all 49 triggers start with one of the
four: surface 23, ceremony 12, tool 8, session 6 (`grep -h -m1 '^trigger:' .agent/rules/*.md`,
prefix counted).

**What `globs` does.** It becomes the `paths` list of the Claude adapter
(`render-rule-projections.ts:126-127`) and the comma-joined `globs` line of the Cursor file
(`render-rule-projections.ts:105-110`). It does not appear in the index or the `.agents`
adapter. Nothing ties `globs` to a `surface:` trigger: 2 rules have a `surface:` trigger and no
globs, and 0 rules have globs without a `surface:` trigger (loop over `.agent/rules/*.md`,
command in the session log; the first figure is reproducible with
`grep -L '^globs:' $(grep -l "^trigger: .*surface:" .agent/rules/*.md)`).

**Present population** (the census commands): 124 rules; 75 `core`, 49 `situational`; 21 of the
49 carry `globs`.

## 2. What is rendered from a rule, per platform

One function renders all four outputs from the declarations
(`render-rule-projections.ts:165-174`). The shared pointer line:

```ts
// render-rule-projections.ts:75-77
function pointer(declaration: RuleDeclaration): string {
  return `Read and follow \`.agent/rules/${declaration.name}.md\`.\n`;
}
```

| Output | Path | Fields that reach it | Body text reaches it | Description reaches it | Renderer |
| --- | --- | --- | --- | --- | --- |
| Claude adapter | `.claude/rules/<name>.md` | `name`; `globs` as `paths` | No | No | `render-rule-projections.ts:122-128` |
| `.agents` adapter | `.agents/rules/<name>.md` | `name` | No | No | `render-rule-projections.ts:136-138` |
| Cursor rule | `.cursor/rules/<name>.mdc` | `name`, `description`, `classification` as `alwaysApply`, `globs` | No | Yes, whole | `render-rule-projections.ts:96-113` |
| Index row | `RULES_INDEX.md` (repository root, `render-rule-projections.ts:48`) | `name`, `classification`, `trigger` | No | No | `render-rule-projections.ts:146-156` |

No renderer receives the rule's body: the input type is the declaration, which holds name,
classification, description, trigger and globs only (`rule-declaration.ts:36-58`).

**Claude adapter, rule without globs** (the whole file; example `.claude/rules/compute-dont-hope.md:1`):

```markdown
Read and follow `.agent/rules/compute-dont-hope.md`.
```

**Claude adapter, rule with globs** (example `.claude/rules/agent-experience-review-lens.md:1-7`):

```markdown
---
paths:
  - agent-tools/**
  - .agent/hooks/**
---

Read and follow `.agent/rules/agent-experience-review-lens.md`.
```

The renderer's comment states that an `@` import is never used, with the reason and the date of
the measurement (`render-rule-projections.ts:13-18`).

**`.agents` adapter** (every rule; example `.agents/rules/compute-dont-hope.md:1`): the same one
pointer line.

**Cursor rule.** Field order is `description`, `globs` (when present), `alwaysApply`
(`render-rule-projections.ts:80-84`), serialised by the `yaml` library with `lineWidth: 0` and
single quotes (`render-rule-projections.ts:86-88`). Three shapes:

```markdown
---
description: <the declaration's description, one line>
alwaysApply: true
---

Read and follow `.agent/rules/<name>.md`.
```

```markdown
---
description: <description>
globs: agent-tools/**,.agent/hooks/**
alwaysApply: false
---

Read and follow `.agent/rules/<name>.md`.
```

```markdown
---
description: <description>
alwaysApply: false
---

Read and follow `.agent/rules/<name>.md`.
```

**Rules index.** A heading, a fixed prose block of 16 lines, a table header, then one row per
rule in code-unit name order (`render-rule-projections.ts:45`, `:50-70`, `:146-156`;
`rule-name.ts:35-40`). The row template:

```ts
// render-rule-projections.ts:151-153
`| \`.agent/rules/${declaration.name}.md\` | ${declaration.classification} | ${
  declaration.classification === 'core' ? NO_TRIGGER : `\`${declaration.trigger}\``
} |`
```

The fixed prose tells the reader to "read and apply every _relevant_ canonical rule below" and
states the file is generated (`render-rule-projections.ts:50-66`).

**Nothing else is rendered from a rule.** The surface list is closed at three directories plus
the index (`validators/portability/rule-projection-validation.ts:48-52`, `:155-162`). No file
under `.codex/`, `.gemini/`, `.windsurf/` or `.github/` is written from a rule declaration by
this code.

## 3. The skill source and what is rendered from it, per platform

**Canonical file.** `SKILL-CANONICAL.md` (`skills-adapter-generate/discovery.ts:32`), at one of
three depths under `.agent/skills/`: `<id>/`, `<concern>/<id>/`, `<concern>/<domain>/<id>/`
(`skills-adapter-generate/skill-tree-walk.ts:2-7`, `MAX_TIER = 3` at `:33`). The skill's id is
the last path segment (`discovery.ts:160`). Present population: 78 canonicals; 27 at depth 1,
46 at depth 2, 5 at depth 3 (`find .agent/skills -name SKILL-CANONICAL.md | awk -F/ '{print NF-3}' | sort | uniq -c`).

**Frontmatter, as two different readers enforce it.**

| Field | Skills generator and checker (`skills-adapter-generate/canonical-frontmatter.ts:44-51`) | Portability validator (`validators/portability/validate-portability.ts:63-79`) |
| --- | --- | --- |
| `name` | required, string, at least 1 character | not read |
| `description` | required, string, at least 1 character | not read |
| `license`, `compatibility`, `allowed-tools` | optional, string, at least 1 character | not read |
| `metadata` | optional, map of string to string | not read |
| `classification` | stripped as an unknown key (`canonical-frontmatter.ts:15-18`, `:34-37`) | required; `active` or `passive` (`validate-portability.ts:71-78`) |
| any other key (`concern`, `domain`) | stripped, never projected (`canonical-frontmatter.ts:15-18`) | not read |

The schema file states that the specification's numeric and format limits (description at most
1,024, compatibility at most 500, the `name` pattern, `name` matching the directory) are checked
nowhere: "NO such check exists anywhere yet" (`canonical-frontmatter.ts:24-28`). The canonical's
`name` is not used for the output: the adapter name is `<prefix><directory id>`
(`skills-adapter-generate/adapter-render.ts:146-147`). At this commit all 78 `name` values equal
their directory id (shell loop comparing `grep -m1 '^name:'` with `basename $(dirname …)`: 0
mismatches).

The two readers parse differently. The generator parses the block as YAML
(`discovery.ts:194-211`). The portability validator reads `classification` with a line pattern,
`^classification:\s*(.+)$`, and strips one pair of quotes
(`validators/portability/portability-fs.ts:188-192`).

Present keys across the 78 canonicals (awk over each frontmatter block): `name` 78,
`description` 78, `classification` 78 (69 `active`, 9 `passive`), `metadata` 9, `concern` 3,
`domain` 3, `compatibility` 2.

**Adapter template.** Rendered by `adapter-render.ts:93-110` and `:159-172`; the pointer line by
`skills-adapter-generate/adapter-stub.ts:51-53`. Whole file, Claude surface (example
`.claude/skills/oak-cross-fork-integration/SKILL.md`):

```markdown
---
name: oak-cross-fork-integration
description: "<the canonical's description, re-serialised on one line>"
---

# Cross Fork Integration (Claude Code)

Read and follow `.agent/skills/change-custody/cross-fork-integration/SKILL-CANONICAL.md`.
```

The `.agents` file differs in one line, the title's label: `(Cross-tool)` in place of
`(Claude Code)` (`adapter-render.ts:99`; verified with `diff` on that pair). Frontmatter carries
`name`, `description`, then `license`, `compatibility`, `metadata`, `allowed-tools` when the
canonical has them (`adapter-render.ts:141-151`; `canonical-frontmatter.ts:117-126`). The
canonical's body does not reach the adapter; its description does, whole.

**The `--prefix=oak-` behaviour.** `--prefix` is required and must be a plain name fragment
(`skills-adapter-generate/cli-flags.ts:63-74`); the root scripts pin `oak-`
(`package.json:104-105`). The prefix is prepended to the adapter's `name` and to its directory
name (`adapter-render.ts:119`, `:147`). An entry whose stub records a discovered canonical but
whose directory name is not `<prefix><id>` is stale (`skills-adapter-generate/projection-roots.ts:172-174`).

**Which directories get adapters.** Two, and only two:

```ts
// skills-adapter-generate/surface-roots.ts:21
export const PROJECTION_SURFACE_ROOTS = ['.claude/skills', '.agents/skills'] as const;
```

The generator's header comment describes `.agents/skills` as the "cross-tool stub (Codex,
Cursor, Gemini)" (`skills-adapter-generate/generator.ts:8-9`). `.cursor/skills` does not exist
(the census commands).

**"Carriage" in this code.** The copying of a canonical's supporting directories beside each
generated `SKILL.md`. The carried directory names are `assets`, `references`, `scripts`
(`skills-adapter-generate/carriage-walk.ts:16`); `evals/` is not carried
(`skills-adapter-generate/carriage.ts:8-10`). Copies are compared by bytes and executable bit
(`carriage.ts:68-70`; `skills-adapter-generate/carriage-compare.ts:35`). A file in a generated
skill directory that is neither `SKILL.md` nor an expected carried file is an "orphan"
(`carriage.ts:14-17`). A symlink on the canonical side is a refusal (`carriage-walk.ts:162-166`).
82 files are carried per surface (`pnpm -s skills:check`).

**What the checker compares** (`skills-adapter-generate/checker.ts`):

- each expected adapter, rendered in memory, against the file on disk by string equality
  (`checker.ts:227-233`);
- each carried file against its canonical source (`checker.ts:235-239`);
- each directory under the two roots whose `SKILL.md` parses as one of this generator's stubs
  against the set of discovered canonicals (`checker.ts:164-183`; `projection-roots.ts:84-110`).

Membership of "ours" is by content, not by name: a frontmatter block, then exactly two non-empty
body lines, a title matching `^# .+ \(.+\)$` and the pointer line, the pointer ending in
`SKILL-CANONICAL.md` (`adapter-stub.ts:55-56`, `:76-90`, `:94-110`, `:128-130`). Anything else
under the roots is out of jurisdiction for the sweep of each root, which neither reports nor
removes it (`projection-roots.ts:17-30`). One case is reported: a foreign entry that occupies
the name a canonical's adapter should have, `<root>/<prefix><id>`, is classified and added to
the refused stream by the per-canonical check (`skills-adapter-generate/checker.ts:218-226`).

## 4. Commands

| Command | Script | What it does | Writes | Wired at |
| --- | --- | --- | --- | --- |
| `pnpm portability:check` | `package.json:100` → `agent-tools/package.json:84` (tsx on source) | Skill canonical `classification` check; rule declarations read and four projections recomputed; sub-agent adapters recomputed; index byte budget; Claude hook wiring; Claude `Skill()` permission census (`validators/portability/validate-portability.ts:57-149`) | No | CI job `static-checks` (`.github/workflows/ci.yml:177-178`); `pnpm check` (`package.json:115`); `pnpm make` (`package.json:112`); pre-push through `pnpm check` (`.husky/pre-push:69-70`); the `preflight` command of `agent-tools:claude-agent-ops`, which prints PASS or FAIL for it (`agent-tools/src/bin/claude-agent-ops.ts:163-167`) |
| `pnpm portability:fix` | `package.json:103` → `agent-tools/package.json:85` (`--fix`) | The same run with `fixMode` true (`validate-portability.ts:53`): writes missing and drifted projections, removes stale regular files on the generated surfaces (`validators/portability/projection-drift.ts:79-102`) | Yes: `RULES_INDEX.md`, `.claude/rules/`, `.agents/rules/`, `.cursor/rules/`, the sub-agent adapter directories and the Codex registry's blocks (`validate-portability.ts:91-107`) | Nowhere; run by hand |
| `pnpm skills:generate` | `package.json:105` (builds agent-tools, then the built bin with `--prefix=oak-`) | Discovers canonicals, removes stale entries of its own class, syncs carried files, writes both adapters (`skills-adapter-generate/generator.ts:83-130`, `:179-210`) | Yes: `.claude/skills/oak-*/`, `.agents/skills/oak-*/` | Nowhere; run by hand |
| `pnpm skills:check` | `package.json:104` (`--check`) | Read-only comparison described in section 3 (`agent-tools/src/bin/skills-adapter-generate.ts:79-116`) | No tracked file; it runs `pnpm agent-tools:build`, which writes the untracked `agent-tools/dist` | CI job `static-checks` (`ci.yml:187-188`); `pnpm check` (`package.json:115`); pre-push through `pnpm check` |
| `pnpm practice:fitness` | `package.json:107` → `agent-tools/package.json:87` | Report over every Markdown file that declares fitness frontmatter; mode `strict` | No | Nowhere |
| `pnpm practice:fitness:informational` | `package.json:108` | The same report, mode `informational` | No | `pnpm make` only (`package.json:112`) |
| `pnpm practice:fitness:strict-hard` | `package.json:109` | The same report, mode `strict-hard` | No | The commit skill's advisory run: `agent-tools:check-commit-skill-advisories` calls it (`agent-tools/src/commit-advisories/check-commit-skill-advisories.ts:156`), and the commit workflow calls that script (`agent-tools/src/commit-queue/commit-workflow-runtime.ts:82`). The script's own header states that its exit is advisory and not blocking (`check-commit-skill-advisories.ts:12-13`). No CI job or git hook calls it |
| `pnpm subagents:check` | `package.json:99` → `agent-tools/package.json:88` | Validates sub-agent wrappers, Codex adapters and templates (`agent-tools/src/validators/subagents/validate-subagents.ts:21-24`) | No | CI job `static-checks` (`ci.yml:175-176`); `pnpm check`; `pnpm make` |
| `pnpm agent-tools:context-cost` | `package.json:132` → `agent-tools/package.json:32` | For the globs given, prints characters and `ceil(chars / 4)` tokens per file and in total (`context-cost/tokenize-globs.ts:17-54`; `context-cost/tokenizer.ts:5-7`) | No | Nowhere |
| `pnpm --filter @oaknational/agent-tools rule-frontmatter-sweep [--write]` | `agent-tools/package.json:86` | Mints frontmatter from a hand-kept index and adapters; described as a one-time "transplant instrument" (`rule-declarations/README.md:38-44`) | With `--write`: the canonical rule files | Nowhere |

The callers in the last column were first listed from the files the audit read, and two
were missed. The column was then checked by the commissioning seat with one search: `git
grep -F` for each command's script name and for the name of the file it runs, over every
tracked file that is not Markdown, a test or a lockfile, leaving out each tool's own
directory. That search found the two missed callers, now in the table (the commit skill's
advisory run for `practice:fitness:strict-hard`, and `claude-agent-ops preflight` for
`portability:check`), and no other. "Nowhere" means that search finds no caller. Three kinds
of mention are not callers and are not listed: a skill or document that tells an agent to
run a command; `.agent/family/typescript/practice-operations.json`, which names these scripts
as the family's contract (lines 23-33 and 51-53); and `knip.config.ts:146-149`, which names
the entry files.

Further facts on wiring:

- All three fitness modes return 0. The code: "The exit code is always 0; the mode governs
  report framing only" (`practice-fitness/run.ts:187-191`).
- The pre-commit hook runs formatting, markdownlint and lint on changed workspaces; it runs none
  of the commands above (`.husky/pre-commit:17-40`).
- `.github/workflows/ci.yml` contains no step naming `practice:fitness` or `context-cost`
  (`grep -n "fitness\|context-cost" .github/workflows/*.yml`: no match).
- A separate validator asserts that every leg of `pnpm check` has a CI step
  (`agent-tools/src/validators/check-ci-parity/validate-check-ci-parity.ts:11-24`); it runs in
  `repo-validators:check` (`package.json:44`).
- `portability:check` runs TypeScript source through `tsx`; `skills:check` runs the built
  JavaScript (`agent-tools/package.json:84`; `package.json:104`).
- The skills generator takes the repository root from the working directory
  (`agent-tools/src/bin/skills-adapter-generate.ts:191`); the portability validator resolves it
  from its own file location (`validate-portability.ts:52`).

**A disagreement between a document and the code.** ADR-144's table lists `pnpm check` as an
invoker of the `--informational` fitness run
(`docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md:237`). The `check`
script holds no fitness leg (`package.json:115`); `make` does (`package.json:112`). Verified by
reading `package.json`.

## 5. The checks in the audited modules that fail the build today

This inventory covers the portability validator and the skills generator's checker only. It
is not every check in the build. Markdownlint, Prettier, ESLint, `docs-validators:check` and
`repo-validators:check` also run in the build and were not audited (section 9), so nothing
here shows that they refuse nothing about a rule or a skill. What a search shows of them,
without reading their conditions:

- Four other validators name a rule or skill path in their source: `cited-paths`,
  `cited-scripts`, `reference-direction` and `notion-fence` (`grep -rl` over
  `agent-tools/src/validators/` for `.agent/rules`, `.agent/skills`, `SKILL-CANONICAL`,
  `.claude/rules`, `.claude/skills` and `RULES_INDEX`, test files excluded).
- Markdownlint ignores `.claude/**` and `.agents/**` (`.markdownlint-cli2.jsonc:44-45`), and
  Prettier ignores the generated rule and skill adapters and the rules index
  (`.prettierignore:86-95`). The canonical files under `.agent/rules/` and `.agent/skills/`
  are in neither ignore list at those lines.

"Fails the build" means a non-zero exit from a command run by CI job `static-checks` or by
`pnpm check`. Portability collects issues and exits 1 if there is at least one
(`validators/portability/portability-report.ts:39-46`; `validate-portability.ts:167-172`).
`skills:check` exits 1 if any stream is non-empty
(`agent-tools/src/bin/skills-adapter-generate.ts:99-116`).

### 5a. `portability:check`

| Check | What it refuses | Condition at | Size or count threshold |
| --- | --- | --- | --- |
| Skill frontmatter present | A `SKILL-CANONICAL.md` with no frontmatter block | `validate-portability.ts:66-69` | No |
| Skill `classification` | Missing, or not `active` / `passive` | `validate-portability.ts:71-78` | No |
| Canonical rules directory | Absent, unreadable, or holding a non-regular entry | `validators/portability/projection-issues.ts:85-93` | No |
| Canonical rules directory, strays | A regular file there that is not `.md` | `projection-issues.ts:77-83` | No |
| Canonical rules directory, empty | Zero rules | `rule-projection-validation.ts:113-116` | Count: fewer than 1 |
| Rule name | A basename outside the pattern in section 1 | `rule-declarations/rule-name.ts:24`; `rule-projection-validation.ts:136-139` | No |
| Rule declaration | No frontmatter block; invalid YAML; not a mapping | `read-rule-declaration.ts:64`, `:68`, `:70` | No |
| Rule declaration keys | Any key outside the four | `read-rule-declaration.ts:91-94` | No |
| Rule `classification` | Any value but `core` / `situational` | `read-rule-declaration.ts:115-121` | No |
| Rule `description` | Missing, empty, not a string, or multi-line | `read-rule-declaration.ts:108-113` | Lower bound only: length 0 |
| Core rule shape | `trigger` or `globs` on a `core` rule | `read-rule-declaration.ts:128-130` | No |
| Rule `trigger` | Missing or empty on a `situational` rule; a newline, `\|` or backtick | `read-rule-declaration.ts:154-163` | No |
| Rule `globs` | Not a list of strings; an empty or multi-line member; a repeat; a member that does not survive the comma split | `read-rule-declaration.ts:165-184` | No |
| Projection missing | An expected output file absent | `validators/portability/projection-drift.ts:46-48`; wording `projection-issues.ts:117` | No |
| Projection drifted | An output whose LF-normalised text differs from the rendering | `projection-drift.ts:49-54`; normalisation `rule-projection-validation.ts:23-26` | No |
| Projection stale | A regular file on `.claude/rules`, `.agents/rules` or `.cursor/rules` that no declaration renders, whatever its extension | `projection-drift.ts:55-57`; `projection-issues.ts:76-78` | No |
| Projection surface entries | A symlink, directory or special entry on a surface; an unreadable file | `projection-issues.ts:90-93`, `:105-111` | No |
| Sub-agent adapters | Missing, drifted or stale sub-agent adapter files and Codex registry blocks | `validate-portability.ts:105-107` (leg in `subagent-projection-validation.ts`, not read line by line) | Not established |
| **Index byte budget** | `RULES_INDEX.md` larger than the budget | `validators/portability/rules-index-checks.ts:38-40` | **Size: 32,768 bytes** |
| Claude hook wiring | Hook policy, `.claude/settings.json` and the surface matrix out of step | `validate-portability.ts:115-131` (helpers not read line by line) | Not established |
| Claude skill permission | A Practice-class directory under `.claude/skills` with no `Skill(<name>)` entry in `permissions.allow` | `validators/portability/skill-permission-checks.ts:135-141`; root guard `validators/portability/skill-census.ts:59-67` | No |

The one size threshold, verbatim:

```ts
// validators/portability/portability-constants.ts:56-63
/**
 * Maximum allowed byte size for the Codex project-doc rules index.
 * Codex imposes an overall project-document size budget; exceeding this limit
 * risks truncation and silent rule-load failures.
 *
 * Default: 32 KiB (32 × 1 024 bytes).
 */
export const DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES = 32 * 1024;
```

```ts
// validators/portability/rules-index-checks.ts:36-40
const maxBytes = opts.maxBytes ?? DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES;
const byteSize = Buffer.byteLength(opts.rulesIndexContent, 'utf8');
return byteSize > maxBytes
  ? [`${rulesIndexPath}: ${byteSize} bytes exceeds Codex project-doc budget ${maxBytes}`]
  : [];
```

It is compared against the UTF-8 byte length of `RULES_INDEX.md` alone. `AGENTS.md` is not
measured by it. The entry point passes no `maxBytes`, so the default always applies
(`validate-portability.ts:113`). Present value: 11,876 bytes (`wc -c RULES_INDEX.md`). The
constant carries no citation to a vendor page.

### 5b. `skills:check`

| Check | What it refuses | Condition at | Size or count threshold |
| --- | --- | --- | --- |
| Arguments | An unrecognised argument; a missing or path-like `--prefix` (exit 2) | `skills-adapter-generate/cli-flags.ts:45-49`, `:63-74`; `bin/skills-adapter-generate.ts:186-189` | No |
| Zero canonicals | No canonical discovered | `bin/skills-adapter-generate.ts:81-98` | Count: fewer than 1 |
| Skipped directory | A directory with no readable canonical at any of the three depths | `skills-adapter-generate/discovery.ts:128-137`; `skill-tree-walk.ts:55-62` | Depth: `MAX_TIER = 3` (`skill-tree-walk.ts:33`) |
| Canonical frontmatter | No fence; unreadable YAML; `name` or `description` missing or empty; a declared optional field of the wrong type | `discovery.ts:194-211`; `canonical-frontmatter.ts:44-51` | Lower bound only: `.min(1)` |
| Duplicate id | Two canonicals with the same last path segment | `discovery.ts:170-180` | Count: more than 1 per id |
| Adapter missing or drifted | `SKILL.md` absent, or not string-equal to the rendering | `checker.ts:229-233` | No |
| Carried file missing, drifted, orphaned | Section 3 | `carriage.ts:84-104` | No |
| Stale entry | A stub of this generator's shape whose canonical is gone or whose directory name is not `<prefix><id>` | `projection-roots.ts:172-174` | No |
| Foreign occupant | Something at `<root>/<prefix><id>` that is not this generator's stub | `checker.ts:218-226` | No |
| Surface root | `.claude/skills` or `.agents/skills`, or an ancestor, resolving outside the repository | `surface-roots.ts:45-49`; `checker.ts:133-136` | No |
| Canonical-side symlink | A symlink or non-regular entry in a carried tree | `carriage-walk.ts:162-166` | No |

### 5c. The numeric thresholds found in the files read

Not exhaustive: section 9 lists the files of these modules that were not read line by line,
and a threshold in one of them would not be here. The last row was added from a reviewer's
finding and confirmed at its lines.

| Value | Where | Compared against | Fails a build |
| --- | --- | --- | --- |
| `32 * 1024` bytes | `portability-constants.ts:63` | byte length of `RULES_INDEX.md` | Yes |
| `MAX_TIER = 3` | `skill-tree-walk.ts:33` | depth of a skill directory under `.agent/skills/` | Yes (as a skipped directory) |
| `.min(1)` | `canonical-frontmatter.ts:45-50` | length of declared skill frontmatter strings | Yes |
| exactly 2 body lines; at least 2 path segments | `adapter-stub.ts:106`, `:115` | the shape that makes a `SKILL.md` "ours" | Indirectly (membership) |
| `CRITICAL_RATIO = 1.5` | `practice-fitness/model.ts:12` | a file's count over `hard limit × 1.5` | No (`run.ts:187-191`) |
| `chars / 4` | `practice-fitness/model.ts:51-57`; `context-cost/tokenizer.ts:5-7` | token estimate | No |
| per-file `fitness_line_target`, `fitness_line_limit`, `fitness_char_limit`, `fitness_line_length`, `fitness_token_target`, `fitness_token_limit` | read from each file's own frontmatter, `practice-fitness/evaluate.ts:68-84` | that file's lines, characters, longest prose line, estimated tokens | No |
| per-buffer `fitness_item_count_target`, `_soft`, `_hard` and `fitness_item_dwell_target`, `_soft`, `_hard` (dwell in days) | read from a buffer file's own frontmatter, `practice-fitness/decision-debt.ts:94-109`; `.agent/memory/operational/pending-graduations.md:7-12` sets 0, 2, 3 and 2, 4, 7 | the count of live items in that buffer and how long each has waited | No |

Limits named in a comment and checked nowhere: skill description at most 1,024 characters,
`compatibility` at most 500 (`canonical-frontmatter.ts:24-28`).

### 5d. What the fitness validator measures on rule and skill files

It inspects only Markdown files whose frontmatter declares `fitness_line_target`,
`fitness_content_role`, `surface_kind` or `merge_class`
(`practice-fitness/paths.ts:151-173`). No canonical rule declares any of them
(`grep -lE "^(fitness_|surface_kind|merge_class)" .agent/rules/*.md | wc -l`: 0), and the rule
reader refuses any key outside its four (`read-rule-declaration.ts:91-94`). No file under
`.agent/skills` declares them (`grep -rlE … .agent/skills --include=*.md | wc -l`: 0). The
report at this commit contains no path under a `rules/` or `skills/` directory
(`grep -c "rules/\|skills/" fitness-informational.out`: 0). So the fitness validator measures
nothing on any rule or skill file today.

`context-cost` measures whatever globs it is given and compares the result with nothing
(`context-cost/cli.ts:33-44`). No script, hook or workflow calls it with a threshold (section 4).

## 6. What each platform directory holds today

All figures from the census commands in the appendix, run at the repository root (files by
`find <dir> -type f | wc -l`, bytes by `find <dir> -type f -exec cat {} + | wc -c`).

| Path | Files | Bytes | Notes |
| --- | --- | --- | --- |
| `.agent/rules/` | 124 | 1,077,957 | canonical; smallest 456, median 6,839, largest 61,114 bytes |
| `.claude/rules/` | 124 | 9,931 | generated |
| `.agents/rules/` | 124 | 8,143 | generated |
| `.cursor/rules/` | 124 | 56,512 | generated |
| `RULES_INDEX.md` | 1 | 11,876 | generated; 124 rows |
| `.agent/skills/` | 712 | 10,136,076 | 78 `SKILL-CANONICAL.md` totalling 1,115,213 bytes |
| `.claude/skills/` | 160 | 519,827 | 87 entries: 78 `oak-*` directories, 9 symlinks |
| `.agents/skills/` | 213 | 1,007,795 | 87 entries: 78 `oak-*` directories, 9 other real directories |
| `.cursor/skills/` | absent | | |
| `.codex/` | 34 | 47,683 | `config.toml`, `README.md`, `agents/` (30), `hooks/` (1), `rules/` (1, 5,104 bytes) |
| `.gemini/` | 20 | 7,095 | `settings.json` (`{}`), `commands/` (19 `.toml`) |
| `.windsurf/` | 1 | 78 | `rules/generalrules.md` |
| `AGENTS.md` | 1 | 1,975 | |
| `CLAUDE.md` | 1 | 57 | |
| `GEMINI.md` | 1 | 57 | |
| `.github/copilot-instructions.md` | 1 | 1,137 | |
| `.agent/directives/AGENT.md` | 1 | 14,274 | the file the entry files point at |

**`.claude/rules` by kind.** 21 files open with a `paths` block (path-scoped); 103 are the single
pointer line (not scoped). The 103 total 6,780 bytes
(`for f in .claude/rules/*.md; do [ "$(wc -l < $f)" -eq 1 ] && cat $f; done | wc -c`). The 103
are the 75 `core` rules and the 28 `situational` rules without globs.

**`.cursor/rules` by kind.** 75 with `alwaysApply: true` (25,717 bytes together,
`for f in $(grep -l '^alwaysApply: true' .cursor/rules/*.mdc); do cat $f; done | wc -c`); 21 with
`globs` and `alwaysApply: false`; 28 with a description only and `alwaysApply: false`.

**Rule descriptions.** Across the 124 frontmatter `description:` lines: shortest 43, median 268,
longest 1,312, total 42,036 characters. These counts are of the raw line after the key,
including any YAML quoting and the newline (the census commands).

**Skill adapters.** `.claude/skills/*/SKILL.md`: 78 files, 51,649 bytes; all 78 parse as this
generator's stub. `.agents/skills/*/SKILL.md`: 87 files, 200,295 bytes; 78 are this generator's
stubs. The serialised `description:` line of the 78 Claude adapters: shortest 37, median 433,
longest 1,161, total 38,256 characters; 5 exceed 1,024 and none exceeds 1,536 (shell loop over
`.claude/skills/oak-*/SKILL.md`; lengths include YAML quoting). Those are lengths of lines in
the file and not of descriptions. Parsed as YAML, the 78 descriptions have a longest of 1,139
characters and 3 exceed 1,024: `oak-update-dependencies` (1,139), `oak-cross-fork-integration`
(1,077) and `oak-sif` (1,051); a fourth is exactly 1,024 (the second block of the appendix,
run by the commissioning seat). 6 canonicals exceed 500 lines
(`find .agent/skills -name SKILL-CANONICAL.md -exec wc -l {} + | awk '$1>500'`).

**Character totals by the repository's own tool.**
`node agent-tools/dist/src/bin/agent-tools.js context-cost --glob '.agent/rules/*.md'`: 124
files, 1,073,128 chars, 268,327 tokens. The same with `--glob '.agent/skills/**/SKILL-CANONICAL.md'`:
78 files, 1,110,536 chars, 277,662 tokens. Sum: 2,183,664 characters.

**The nine non-`oak-` skills.** `clerk`, `clerk-backend-api`, `clerk-cli`,
`clerk-nextjs-patterns`, `clerk-setup`, `clerk-testing`, `clerk-webhooks`, `mcp-inspector`,
`skill-creator` are real directories under `.agents/skills/` and symlinks under
`.claude/skills/` to `../../.agents/skills/<name>` (`find .claude/skills -maxdepth 1 -type l`).
`skills-lock.json` at the root records sources and hashes for such entries
(`skills-lock.json:1-10`).

**`.claude/settings.json`.** `"skillListingBudgetFraction": 0.03` (`.claude/settings.json:2`);
156 `Skill(` entries in the file (`grep -c '"Skill(' .claude/settings.json`).

## 7. Entry files and hooks that carry guidance

**Entry files.**

- `CLAUDE.md` is a heading and one line: `Read [AGENT.md](.agent/directives/AGENT.md)`
  (`CLAUDE.md:1-3`). `GEMINI.md` is the same with its own heading (`GEMINI.md:1-3`).
- `AGENTS.md` holds: the same pointer (`AGENTS.md:3`); a sentence linking to `RULES_INDEX.md` "for
  the canonical rules list" (`AGENTS.md:5`); a `## Code review` section of 14 lines
  (`AGENTS.md:7-20`); and a block between `CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_START` and
  `…_END` markers (`AGENTS.md:22-35`). That block has its own generator
  (`agent-tools/src/codex/team-alert-bootstrap.ts:42`) and its own validator in
  `repo-validators:check` (`package.json:44`, `validate-codex-team-alert-bootstrap`).
- `.github/copilot-instructions.md` holds the pointer and a `## Code review` section identical to
  the one in `AGENTS.md` (`diff <(sed -n 7,20p AGENTS.md) <(sed -n 5,18p .github/copilot-instructions.md)`:
  no difference).
- `.windsurf/rules/generalrules.md` holds `trigger: always_on` and the pointer.
- `skills.md` at the root (125 bytes) holds the pointer and the index sentence (`skills.md:1-5`).
- `.agent/directives/AGENT.md` (14,274 bytes, 280 lines by the fitness report) has sections
  Grounding, The Practice, First Question, First Principle, Second Question, Decision Lenses,
  Cardinal Rule, Orientation Requests, Project Context, Rules, Reviewers And Tools, Memory And
  Continuity, Essential Links, Commands (`grep -n "^#\+ " .agent/directives/AGENT.md`). Its Rules
  section says: "Claude and Cursor load their adapter tiers automatically; Codex, Gemini, and any
  other non-loader platform MUST read every canonical `.agent/rules/*.md` file listed there at
  session open" (`.agent/directives/AGENT.md:159-161`).

**Session-start hooks.**

| Platform | Configured at | Command | What it prints, as far as the code shows |
| --- | --- | --- | --- |
| Claude Code | `.claude/settings.json:248-264` | `.claude/hooks/practice-session-identity.mjs` (timeout 5) | A `hookSpecificOutput.additionalContext` of six lines: the session identity, its id prefix, an environment-variable note and a suggested `/rename` (`agent-tools/src/claude/session-identity-hook.ts:186-195`) |
| Claude Code | same block | `.claude/hooks/plan-gate-drift-alert.mjs` (timeout 15) | When plan-gate drift exists, the drift report as session context; otherwise `{}` (`.claude/hooks/plan-gate-drift-alert.mjs:5-16`) |
| Codex | `.codex/config.toml:13-20`, matcher `startup\|resume` | `.codex/hooks/practice-session-identity.mjs` (timeout 10) | An identity block, a preflight command, and two lines pointing at the `AGENTS.md` bootstrap block and one rule (`agent-tools/src/codex/session-identity-hook.ts:105-123`) |
| Cursor | `.cursor/hooks.json` (`sessionStart`) | `node .cursor/hooks/oak-session-identity.mjs` | JSON with `env` and `additional_context` from the built adapter; an empty `additional_context` when the build is absent (`.cursor/hooks/oak-session-identity.mjs:10-14`) |
| Gemini | `.gemini/settings.json` | none | The file is `{}` |

No session-start hook prints a rule, a rule description, a skill or the rules index. Claude Code
also has `PreToolUse` hooks on Bash, Edit, Write and Read, a `UserPromptSubmit` hook and a
`PreCompact` hook (`.claude/settings.json:265-331`); their output was not traced.

**Codex configuration touching guidance.** `project_doc_fallback_filenames = ["RULES_INDEX.md"]`
(`.codex/config.toml:4`). `.codex/rules/seat-landing.rules` is an execution-policy file allowing
landing commands (`.codex/rules/seat-landing.rules:1-5`); it carries no guidance text for the
model.

## 8. Seams and gaps, as facts only

**Fields declared, and where they stop.**

1. A rule's `trigger` reaches the index row only (section 1).
2. A rule's `description` reaches the Cursor file only. It is in no file under `.claude/`,
   `.agents/` or the index (section 2).
3. A rule's body reaches no generated file (section 2).
4. A rule's `classification` has no effect on its Claude adapter separate from the presence of
   globs (`render-rule-projections.ts:123`).
5. A skill's `classification` (`active` / `passive`) is required by the portability validator
   and read by nothing else in `agent-tools/src`
   (`grep -rn "'passive'" agent-tools/src --include=*.ts`, tests excluded: two hits, both
   `validate-portability.ts:74-76`). The generator strips it (`canonical-frontmatter.ts:15-18`).
6. A skill's `concern` and `domain` keys are stripped and read by nothing in the generator
   (`canonical-frontmatter.ts:15-18`).
7. The trigger vocabulary is described in a type comment and a paragraph of the index prose and
   enforced by no reader (`rule-declaration.ts:51-54`; `render-rule-projections.ts:57-61`;
   `read-rule-declaration.ts:156-163`).
8. `rulesIndexBudgetIssues` takes a `maxBytes` parameter that its one caller never passes
   (`rules-index-checks.ts:53`; `validate-portability.ts:113`).

**Outputs and what documentation says reads them.**

1. `.agents/rules/` (124 pointer files): "No documented mechanism reads `.agents/rules/`"
   (from documentation, not observed:
   `.agent/research/agentic-engineering/doing-and-dreaming-2026-11/codex-rules-and-skills-loading.md:30-31`).
   Nothing in `agent-tools/src` reads the directory back except the drift check
   (`rule-projection-validation.ts:48-52`).
2. `RULES_INDEX.md` as a Codex project document: the code comments call it "the project-doc
   resolution path for platforms (such as Codex) that do not auto-load `.agent/rules/`"
   (`render-rule-projections.ts:51-53`) and say Codex reads it "instead"
   (`portability-constants.ts:50-52`). The research note says the fallback setting "does nothing
   here" because a fallback name applies only in a directory with no `AGENTS.md`, and that the
   index reaches Codex only through the sentence in `AGENTS.md` (from documentation, marked
   there as inference: `codex-rules-and-skills-loading.md:70-72`). Neither was observed in a
   running Codex. The root does hold an `AGENTS.md` (verified, `wc -c AGENTS.md`).
3. The 32 KiB figure: the code applies it to the index file alone (section 5a). The research
   note records the Codex limit as applying to the `AGENTS.md` chain, with the vendor pages
   disagreeing on whether it is per file or in total (from documentation:
   `codex-rules-and-skills-loading.md:26`, `:87`).
4. Claude Code, unscoped rules: documentation says rules without `paths` "are loaded at launch"
   and that `paths` is the only frontmatter field read (from documentation:
   `.agent/research/agentic-engineering/doing-and-dreaming-2026-11/claude-code-rules-and-skills-loading.md:105-108`).
   Under that account the 103 unscoped adapters put 103 pointer lines (6,780 bytes) in context
   at launch and no rule text.
5. Claude Code, skill descriptions: documentation gives a per-entry cap of 1,536 characters and
   a listing budget of 1 % of the window by default (from documentation:
   `claude-code-rules-and-skills-loading.md:178-182`); the repository sets the fraction to 0.03
   (`.claude/settings.json:2`). No check in the repository compares a description or the listing
   with either figure.
6. Codex, skills: documentation says Codex reads `.agents/skills` and lists name, description
   and path within 2 % of the window (from documentation:
   `codex-rules-and-skills-loading.md:27`, `:37-39`). `.agents/skills` holds 87 entries, 9 of
   them not generated here.

**Generated files that can change without a check noticing.**

1. Line endings of a rule projection: every read is LF-normalised before comparison
   (`rule-projection-validation.ts:23-26`).
2. The nine non-`oak-` skill entries under both skill roots: they lack this generator's stub
   shape, so no check here adjudicates them (`projection-roots.ts:17-30`). They are listed to
   Claude Code and Codex alongside the 78 (section 6).
3. A regular file placed directly in `.claude/skills/` or `.agents/skills/`: "a stray regular
   FILE at a surface root is outside this sweep's contract" (`projection-roots.ts:35-37`).
4. A directory under a skill root, at a name no canonical maps to, with no recognisable stub:
   left in place and not reported (`projection-roots.ts:37-39`).
5. `CLAUDE.md`, `GEMINI.md`, `skills.md`, `.windsurf/rules/generalrules.md`,
   `.github/copilot-instructions.md`, `.gemini/commands/*.toml` and the part of `AGENTS.md`
   outside the marked block: no module read for this audit generates or compares them
   (`grep -rln "gemini/commands" agent-tools/src`: no match; `grep -rln "copilot-instructions" agent-tools/src`:
   one validator of cited paths).
6. The `## Code review` text is held twice, in `AGENTS.md` and
   `.github/copilot-instructions.md` (section 7).

A hand edit to any file in `.claude/rules/`, `.agents/rules/`, `.cursor/rules/`, to
`RULES_INDEX.md`, or to a generated `oak-*/SKILL.md` or carried file is detected (sections 5a,
5b). An edit to a generated `SKILL.md` that breaks the stub shape is reported as a foreign
occupant and not as drift (`checker.ts:223-226`;
`skills-adapter-generate/emission-target.ts:14-19`).

**Checks that exist for one platform and not another.**

1. The `Skill(<name>)` permission census covers `.claude/settings.json` only
   (`skill-census.ts:53-83`).
2. The hook-wiring check covers Claude Code only (`validate-portability.ts:115-131`).
3. The only size check is the index against the Codex figure (section 5a). There is no size or
   count check on `AGENTS.md`, `CLAUDE.md`, `.claude/rules/`, `.cursor/rules/`, a canonical rule,
   a canonical skill, a skill description or the number of rules or skills.
4. Skill adapters are written for `.claude/skills` and `.agents/skills`; rule adapters for
   `.claude/rules`, `.agents/rules` and `.cursor/rules`. There is no `.cursor/skills`, and no
   rule output for `.codex/`, `.gemini/`, `.windsurf/` or `.github/` (sections 2, 3).

**Two writers on one path or root.**

1. `.claude/skills/` and `.agents/skills/` are shared between this generator and the external
   skills machinery the code names as `pnpx skills` (`projection-roots.ts:17-20`).
2. `.codex/config.toml`: the head is hand-kept and the `[agents."<name>"]` blocks after it are
   written by `portability:fix` (`validate-portability.ts:99-104`). The head holds the fallback
   setting and the session-start hook (`.codex/config.toml:4`, `:13-20`).
3. `AGENTS.md`: hand-kept text and one generated block (`AGENTS.md:22-35`).
4. No path was found that two of the generators read here both write.

**Two generators, two commands.** Rule projections are written by `portability:fix` and skill
adapters by `skills:generate`; `portability:fix` does not write skill adapters, and
`skills:generate` does not write rule projections (`validate-portability.ts:91-107`;
`generator.ts:179-210`). `portability:check` reads skill canonicals for `classification` only
(`validate-portability.ts:57-89`).

**Disagreements between documents and code.**

| Statement | Where | What the code or files show | Verified by |
| --- | --- | --- | --- |
| The declaration is the source for "the Claude and `.agents` adapters", rendered and "recomputed byte for byte" | `rule-declarations/README.md:3-7` | Holds, after LF normalisation of each read (`rule-projection-validation.ts:23-26`) | Reading; `pnpm -s portability:check` |
| `pnpm check` runs the informational fitness report | ADR-144, line 237 | `check` has no fitness leg; `make` has (`package.json:112`, `:115`) | Reading `package.json` |
| `.agents/skills` is the stub for "Codex, Cursor, Gemini" | `generator.ts:8-9` | A comment; no code or check in the modules read concerns Cursor's or Gemini's skill loading | Reading |
| Sub-agent adapters include "Gemini files under each platform's agents directory" | `validate-portability.ts:99-101` | `.gemini/agents` is absent on disk (the census commands) and the check passes | Running; the sub-agent leg was not read |
| Codex reads the index "instead" of adapters | `portability-constants.ts:50-52` | See outputs item 2 above | Documentation only |

## 9. What was not read or could not be verified

- **Not read line by line.** `rule-declarations/`: `reconcile-rule-declaration.ts`,
  `parse-rules-index.ts`, `parse-cursor-trigger.ts`, `parse-claude-rule-adapter.ts`,
  `frontmatter-lines.ts`, `comma-list.ts`, `sweep-fs.ts`, `render-reconciliation-report.ts`, and
  the body of the sweep past its header (the README says the running estate never reads the
  projections back, `rule-declarations/README.md:42-43`). `skills-adapter-generate/`:
  `clear.ts`, `carriage-fs.ts`, `read-regular-file.ts`, and `carriage-walk.ts`,
  `carriage-compare.ts`, `emission-target.ts`, `emission-refusals.ts` beyond their headers and
  code lines. `validators/portability/`: `rule-surface-fs.ts`, `portability-fs.ts`,
  `claude-hook-detection.ts`, `claude-hook-wiring.ts`, `subagent-projection-validation.ts`,
  `subagent-registry-surface.ts`. `practice-fitness/`: `item-count.ts`, `dwell.ts`,
  `decision-debt.ts`, `decision-debt-report.ts`, `format.ts`, `messages.ts`,
  `configuration-findings.ts`, `markdown.ts`. `context-cost/`: `format.ts`, `file-system*.ts`.
  All test files. `validators/subagents/` beyond the first 25 lines of the entry point.
- **Sub-agents.** What `subagents:check` refuses, and why `.gemini/agents` is absent while the
  portability summary speaks of four surfaces, were not established.
- **Whether the `--clear` flag of the skills generator is used by any script.** The root scripts
  do not pass it (`package.json:104-105`); no other caller was searched for.
- **Platform behaviour.** Nothing here was observed in a running Claude Code, Codex, Cursor or
  Gemini session. Every statement about what a platform loads is cited to the two research notes
  and marked as documentation. Whether Cursor reads `.agents/skills`, and what reads
  `.windsurf/`, `.gemini/commands/` or `skills.md`, was not examined.
- **Hooks.** The six `additionalContext` lines for Claude Code and the Codex block were read in
  source; the Cursor adapter's output text and the `PreToolUse`, `UserPromptSubmit` and
  `PreCompact` hooks were not traced. No hook was executed.
- **Checks outside these modules.** Markdownlint, Prettier, ESLint, `docs-validators:check` and
  `repo-validators:check` may refuse things about rule or skill files (links, cited paths,
  formatting); they were not audited. `.prettierignore` excludes `.claude/skills/`,
  `.agents/skills/`, `.claude/rules/`, `.agents/rules/` and `RULES_INDEX.md`
  (`.prettierignore:86-95`) and the whole of `.cursor` (`.prettierignore:14`).
- **Description lengths.** Section 6 gives two sets for the skill adapters: the lengths of
  serialised lines, and the parsed YAML values, which the commissioning seat computed. The
  rule description lengths there are of serialised lines only; their parsed values were not
  computed.
- **CI gating.** `static-checks` was read as a job that runs on `push` and `pull_request` to
  `main` and `engraph` (`.github/workflows/ci.yml:34-37`, `:150-190`); whether the branch ruleset
  makes it a required check was not verifiable from the repository.
- **`pnpm make` and the pre-push hook were not run.**

## 10. Checked at source by the commissioning seat

Read at the cited lines on 12 November 2026, and found as the audit states:

- A rule's Claude and `.agents` adapters are the one-line pointer, and the Claude adapter
  takes a `paths` block only for a situational rule with globs
  (`rule-declarations/render-rule-projections.ts:75-77`, `:122-138`).
- `trigger` reaches the index row and nothing else (`render-rule-projections.ts:148-153`).
- The fitness validator's exit code is always 0 (`practice-fitness/run.ts:187-191`).
- The one size threshold compares the byte length of the rules index with 32 × 1,024
  (`validators/portability/rules-index-checks.ts:35-41`;
  `validators/portability/portability-constants.ts:56-63`).
- The code itself says no check of the skill specification's size limits exists
  (`skills-adapter-generate/canonical-frontmatter.ts:24-28`).
- `.codex/config.toml:4` names the rules index as a fallback project document.
- `portability:check` and `skills:check` run in the `static-checks` job
  (`.github/workflows/ci.yml:177-188`).

Five figures of section 6 were recomputed by this seat and agree: the rules index at 11,876
bytes, the Claude rule adapters at 9,931 bytes, the canonical rules at 1,077,957 bytes, 21
path-scoped Claude adapters, and the parsed skill description lengths, which this seat
computed and which replaced the audit's first count of five over the limit with three.

Not checked by this seat: the other counts in section 6, sections 3 and 7 beyond the lines
above, and everything section 9 lists.

## 11. Where the plan's wording differed from the code

The audit found three sentences in the plan that the code does not bear out. The plan is
corrected in the same change.

- The plan spoke of "the portability and fitness validators and the one threshold check they
  hold". The one build-failing size threshold is in the portability validator. The fitness
  validator holds thresholds read from each file's own frontmatter, fails no build, and
  measures no rule or skill file (section 5d).
- The plan said "Skills have a like generator". The skills generator is a separate command
  run from built JavaScript with a required prefix; it writes to two roots only, copies the
  description into the adapter, carries supporting files, and shares its roots with vendor
  skills (section 3).
- The plan said the estate's guidance reaches a Claude Code session "as a pointer to a
  file". That holds for rules. A skill's adapter carries its whole description (section 3).

## Appendix: the census commands

Run at the repository root with `bash`. They were a throwaway script and are kept here as
text, not as a tracked script. The appendix reproduces the directory counts of section 6. It
does not reproduce the other figures there: the serialised description lengths, the count of
canonicals over 500 lines and the character totals each name their own command beside them.

The parsed description lengths came from the second block, a throwaway Node script run from
the repository root with the `yaml` package resolved from `agent-tools`.

```bash
#!/usr/bin/env bash
# Read-only census of the rule and skill surfaces. Usage: count-surfaces.sh <repo-root>
set -u
cd "$1" || exit 2
count() { if [ -d "$1" ]; then printf '%s\tfiles=%s\tbytes=%s\n' "$1" "$(find "$1" -type f | wc -l)" "$(find "$1" -type f -exec cat {} + | wc -c)"; else printf '%s\tABSENT\n' "$1"; fi; }
echo "## directories (find -type f | wc -l ; cat | wc -c)"
for d in .agent/rules .claude/rules .agents/rules .cursor/rules .agent/skills .claude/skills .agents/skills .cursor/skills .codex .codex/rules .codex/hooks .codex/agents .gemini .gemini/commands .claude/agents .cursor/agents .claude/hooks .cursor/hooks .windsurf .github/instructions; do count "$d"; done
echo "## entry files (wc -c)"
wc -c AGENTS.md CLAUDE.md GEMINI.md RULES_INDEX.md .github/copilot-instructions.md .agent/directives/AGENT.md 2>&1
echo "## canonical rules by classification (grep first classification line)"
grep -h -m1 '^classification:' .agent/rules/*.md | sort | uniq -c
echo "situational with globs: $(grep -l '^globs:' .agent/rules/*.md | wc -l)"
echo "## .claude/rules by kind"
echo "path-scoped (file starts with ---): $(grep -l -m1 '^paths:' .claude/rules/*.md | wc -l)"
echo "plain pointer (single line): $(for f in .claude/rules/*.md; do [ "$(wc -l < "$f")" -eq 1 ] && echo x; done | wc -l)"
echo "## .cursor/rules by kind"
echo "alwaysApply: true: $(grep -l '^alwaysApply: true' .cursor/rules/*.mdc | wc -l)"
echo "alwaysApply: false with globs: $(grep -l '^globs:' .cursor/rules/*.mdc | wc -l)"
echo "alwaysApply: false, description only: $(for f in .cursor/rules/*.mdc; do grep -q '^alwaysApply: false' "$f" && ! grep -q '^globs:' "$f" && echo x; done | wc -l)"
echo "## rules index"
echo "rows: $(grep -c '^| `.agent/rules/' RULES_INDEX.md)  bytes: $(wc -c < RULES_INDEX.md)  budget: $((32*1024))"
echo "## canonical rule sizes (bytes): min / median / max / total"
wc -c .agent/rules/*.md | grep -v total | awk '{print $1}' | sort -n | awk '{a[NR]=$1; s+=$1} END {print a[1], a[int((NR+1)/2)], a[NR], s}'
echo "## canonical rule description lengths (chars): min / median / max / total"
for f in .agent/rules/*.md; do grep -m1 '^description:' "$f" | sed 's/^description: //' | wc -m; done | sort -n | awk '{a[NR]=$1; s+=$1} END {print a[1], a[int((NR+1)/2)], a[NR], s}'
echo "## skills"
echo "SKILL-CANONICAL.md files: $(find .agent/skills -name SKILL-CANONICAL.md | wc -l)  bytes: $(find .agent/skills -name SKILL-CANONICAL.md -exec cat {} + | wc -c)"
echo "other SKILL.md under .agent/skills: $(find .agent/skills -name SKILL.md | wc -l)"
for s in .claude/skills .agents/skills; do
  echo "$s: entries=$(ls "$s" | wc -l) oak-prefixed=$(ls -d "$s"/oak-* 2>/dev/null | wc -l) symlink-entries=$(find "$s" -maxdepth 1 -type l | wc -l) SKILL.md=$(find "$s" -maxdepth 2 -name SKILL.md | wc -l) SKILL.md-bytes=$(find "$s" -maxdepth 2 -name SKILL.md -exec cat {} + | wc -c) practice-stubs=$(grep -l '^Read and follow `.agent/skills/.*SKILL-CANONICAL.md`\.$' "$s"/*/SKILL.md 2>/dev/null | wc -l)"
done
echo "carried files under .agent/skills (assets|references|scripts beside a canonical): $(find .agent/skills -name SKILL-CANONICAL.md | while read -r c; do d=$(dirname "$c"); for k in assets references scripts; do [ -d "$d/$k" ] && find "$d/$k" -type f; done; done | wc -l)"
```

```js
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
const root = '.claude/skills';
const rows = [];
for (const d of readdirSync(root).filter((n) => n.startsWith('oak-'))) {
  const text = readFileSync(`${root}/${d}/SKILL.md`, 'utf8');
  const fm = parse(text.split('---')[1]);
  rows.push([d, [...String(fm.description)].length]);
}
rows.sort((a, b) => b[1] - a[1]);
console.log('adapters', rows.length, 'over 1024:', rows.filter((r) => r[1] > 1024).length, 'longest', rows[0][1]);
console.log(rows.slice(0, 7).map((r) => `${r[0]}=${r[1]}`).join(' '));
```

# Vendor-agnostic Agent Skills with Vendor-specific Adapters

Status: proposed design report  
Last researched: 2026-05-08  
Audience: coding-agent implementers designing a similar system  
Scope: Claude Code, OpenAI Codex, Cursor, Gemini CLI, and the surrounding Agent Skills ecosystem

## 1. Executive summary

We believe a good cross-platform skills system should separate the **canonical skill definition** from **platform discovery surfaces**.

A strong shape appears to be:

```text
.agent/skills/          canonical source of truth, not intended as a vendor discovery path
.agents/skills/         vendor-agnostic adapter path for platforms that support the Agent Skills shared path
.claude/skills/         Claude Code adapter path
```

The adapters should be real `SKILL.md` files with rich frontmatter metadata and a minimal body that reads the canonical skill:

```markdown
---
name: my-skill
description: Rich trigger-oriented description for discovery.
---

Read and follow [the canonical skill definition](../../../.agent/skills/my-skill/SKILL.md), including any supporting files it references.
```

The system should avoid symlinks and avoid copied full skill bodies where possible. This reduces duplicate registrations and keeps the canonical implementation in one place.

The largest unresolved design question is supporting files. The Agent Skills standard expects scripts, references, and assets to live inside the skill directory. In the adapter design above, the activated platform skill lives under `.agents/skills/...` or `.claude/skills/...`, but the real supporting files live under `.agent/skills/...`. Most coding agents can read ordinary workspace files, so this should work in normal repo-local coding-agent sessions. However, some runtimes treat the activated skill directory as a special access boundary. Gemini CLI, for example, documents that activating a skill adds the skill directory to allowed file paths. That makes this a real ADR-worthy compatibility question.

The short version of the industry direction is:

> Custom commands are being subsumed into skills. Slash commands remain as invocation UI. Skills are becoming the reusable, portable capability unit.

## 2. Research basis

This report is based on the current public documentation and ecosystem material for:

- Agent Skills open standard: [agentskills.io overview](https://agentskills.io/) and [Agent Skills specification](https://agentskills.io/specification)
- Agent Skills client implementation guidance: [How to add skills support to your agent](https://agentskills.io/client-implementation/adding-skills-support)
- Claude Code skills: [Claude Code Agent Skills](https://docs.claude.com/en/docs/claude-code/skills), [Extend Claude with skills](https://code.claude.com/docs/en/slash-commands), and [Claude Code SDK slash commands](https://code.claude.com/docs/en/agent-sdk/slash-commands)
- OpenAI/Codex skills: [OpenAI Skills in ChatGPT help article](https://help.openai.com/en/articles/20001066-skills-in-chatgpt), [OpenAI Academy: Codex plugins and skills](https://openai.com/academy/codex-plugins-and-skills/), and [openai/skills](https://github.com/openai/skills)
- Cursor skills/rules: [Cursor Skills docs](https://cursor.com/docs/skills#skill-directories), [Cursor 2.4 changelog: Subagents, Skills, and Image Generation](https://cursor.com/changelog/2-4), and [Cursor rules docs](https://docs.cursor.com/context/rules-for-ai)
- Gemini CLI skills: [Gemini CLI Agent Skills](https://geminicli.com/docs/cli/skills/), [Creating Agent Skills](https://geminicli.com/docs/cli/creating-skills/), [Get started with Agent Skills](https://geminicli.com/docs/cli/tutorials/skills-getting-started/), and [activate_skill tool](https://geminicli.com/docs/tools/activate-skill/)
- Vercel skills ecosystem: [Introducing skills, the open agent skills ecosystem](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem), [Vercel Agent Skills docs](https://vercel.com/docs/agent-resources/skills), and [Agent skills explained: an FAQ](https://vercel.com/blog/agent-skills-explained-an-faq)
- Amp command-to-skill migration: [Slashing Custom Commands](https://ampcode.com/news/slashing-custom-commands), [User Invokable Skills](https://ampcode.com/news/user-invokable-skills), and [Amp manual](https://ampcode.com/manual)
- Other agentic infrastructure: [AGENTS.md](https://agents.md/), [Model Context Protocol intro](https://modelcontextprotocol.io/docs/getting-started/intro), [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools), [Claude Code hooks](https://docs.claude.com/en/docs/claude-code/hooks), [Gemini CLI hooks](https://geminicli.com/docs/hooks/), and [Cursor hooks for security and platform teams](https://cursor.com/blog/hooks-partners)

## 3. Main findings

### 3.1 Commands out, skills in

We believe custom commands are becoming a legacy or transitional abstraction.

Claude Code is the clearest signal. Its current skills docs say custom commands have been merged into skills: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. The legacy command path still works, but the recommended shape is now the skill path.

Amp is even more explicit: it says it is removing custom commands in favour of skills because user-invokable skills remove the old distinction between user-invoked commands and model-invoked skills.

Gemini CLI still has custom TOML commands. Cursor has had commands and rules. But across the ecosystem, the strategic direction appears to be:

```text
Built-in commands:
  Product controls such as /help, /compact, /permissions, /skills.

Custom commands:
  Legacy or lightweight prompt shortcuts.

Skills:
  Reusable, invokable, model-discoverable capability bundles.

Slash menu:
  UI for invoking things; not necessarily a separate command format.
```

### 3.2 Skills are becoming the portable capability unit

The Agent Skills standard defines a skill as a directory containing `SKILL.md`, with YAML frontmatter plus Markdown instructions, and optional supporting files such as scripts, references, and assets.

The standard is intentionally small:

```text
skill-name/
  SKILL.md          required
  scripts/          optional executable code
  references/       optional documentation
  assets/           optional templates/resources
```

This small surface area is why it is becoming a practical interoperability layer across coding agents.

### 3.3 `.agents/skills/` is the shared discovery target

The cross-platform path is `.agents/skills/`, plural `agents`.

For the platforms in scope:

| Platform    |                                                                                                  Shared `.agents/skills/` support | Native vendor path                            | Adapter requirement in this design       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------: | --------------------------------------------- | ---------------------------------------- |
| Claude Code |                                                                                                          Not documented as native | `.claude/skills/`, `~/.claude/skills/`        | Needs `.claude/skills/` adapter          |
| Codex       | Supports or is strongly aligned with `.agents/skills/`; OpenAI’s own installer also uses `$CODEX_HOME/skills` / `~/.codex/skills` | `$CODEX_HOME/skills`, often `~/.codex/skills` | Use `.agents/skills/` after verification |
| Cursor      |                                                          Supports `.agents/skills/` and `.cursor/skills/` per current skills docs | `.cursor/skills/`, `~/.cursor/skills/`        | Use `.agents/skills/`                    |
| Gemini CLI  |                                                             Explicitly supports `.agents/skills/` and `~/.agents/skills/` aliases | `.gemini/skills/`, `~/.gemini/skills/`        | Use `.agents/skills/`                    |

That suggests a good target state:

```text
Keep:
  .agent/skills/
  .agents/skills/
  .claude/skills/

Remove once verified:
  .codex/skills/
  .cursor/skills/
  .gemini/skills/
```

This avoids duplicate skill registrations when tools scan multiple supported locations.

## 4. Suggested repository shape

A good vendor-agnostic system appears to look like this:

```text
repo/
  .agent/
    skills/
      pr-review/
        SKILL.md
        LICENSE.txt
        references/
          rubric.md
          examples.md
        scripts/
          collect-diff.sh
        assets/
          templates/
            review-output.md

  .agents/
    skills/
      pr-review/
        SKILL.md

  .claude/
    skills/
      pr-review/
        SKILL.md
```

The canonical skill is the full implementation. The platform adapters are discovery metadata plus a pointer.

### Why `.agent/skills/` singular?

`.agent/skills/` is not a public discovery convention. That is useful here. It is the private canonical source of truth.

The public adapter paths are:

```text
.agents/skills/   shared Agent Skills path
.claude/skills/   Claude Code path
```

This lets the project avoid having the same skill discovered multiple times by a platform that scans both generic and vendor-specific directories.

## 5. Adapter design

The adapter should not need to say “this is a thin wrapper.” The read instruction makes it true.

A good adapter body is minimal:

```markdown
Read and follow [the canonical skill definition](../../../.agent/skills/my-skill/SKILL.md), including any supporting files it references.
```

The relative path goes up three levels from:

```text
.agents/skills/my-skill/SKILL.md
```

or:

```text
.claude/skills/my-skill/SKILL.md
```

to repo root, then down into:

```text
.agent/skills/my-skill/SKILL.md
```

So the correct relative link is:

```text
../../../.agent/skills/my-skill/SKILL.md
```

## 6. Frontmatter strategy

We believe the system should use as much useful frontmatter as possible, with platform-specific quirks documented in an ADR.

The key distinction is:

```text
Canonical skill frontmatter:
  Useful to humans, generators, validators, and any agent after it reads the canonical file.

Adapter frontmatter:
  Useful to the platform before activation. This is what drives discovery.
```

Because platform discovery initially sees only the adapter, the adapter should duplicate or optimise the discovery-relevant metadata from the canonical skill.

### 6.1 Portable frontmatter fields

The Agent Skills specification defines these fields:

| Field           | Status                  | Notes                                                                                    |
| --------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `name`          | Required                | Lowercase letters, numbers, and hyphens; max 64 chars; should match parent folder        |
| `description`   | Required                | Non-empty; max 1024 chars in the spec; should say what the skill does and when to use it |
| `license`       | Optional                | Short license name or reference to a bundled license file                                |
| `compatibility` | Optional                | Environment or product requirements; max 500 chars in the spec                           |
| `metadata`      | Optional                | Arbitrary key-value mapping; safest place for non-standard annotations                   |
| `allowed-tools` | Optional / experimental | Pre-approved tools; support varies by platform                                           |

We believe shared adapters should use all standard fields where useful:

```yaml
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
license: Proprietary; see ../../../.agent/skills/pr-review/LICENSE.txt
compatibility: Requires workspace file-read access to ../../../.agent/skills/pr-review plus git; optional gh CLI for GitHub PR metadata.
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  canonical-path: '../../../.agent/skills/pr-review/SKILL.md'
  source-of-truth: '.agent/skills/pr-review'
  short-description: 'Review PRs using team standards'
---
```

Caveat: the open spec describes `metadata` as arbitrary key-value data, but the safest interpretation is string keys and string values. Deep nested objects and YAML arrays may work in some clients, but a stricter validator may reject or ignore them. A good compatibility posture is to keep metadata values string-like unless a platform explicitly documents richer values.

### 6.2 Claude Code frontmatter fields

Claude Code supports additional fields in its skills system. The current docs and examples include fields such as:

| Field                      | Purpose                                                                   | Portability                                                  |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `when_to_use`              | Additional trigger context appended to description in Claude’s skill list | Claude-specific                                              |
| `argument-hint`            | Autocomplete hint for slash invocation                                    | Claude-specific                                              |
| `arguments`                | Named positional arguments for `$name` substitution                       | Claude-specific                                              |
| `disable-model-invocation` | User-only skill; prevents automatic loading/model invocation              | Claude-specific, also seen in some Cursor ecosystem material |
| `user-invocable`           | Hide from slash menu when false                                           | Claude-specific                                              |
| `allowed-tools`            | Tools available without per-use approval while skill is active            | Claude Code-specific or experimental in spec                 |
| `context`                  | Example value `fork`; run skill in isolated context                       | Claude-specific                                              |
| `agent`                    | Choose built-in or custom subagent, such as `Explore`                     | Claude-specific                                              |
| `model`                    | Choose model while the skill is active                                    | Claude-specific                                              |

A maximally useful Claude adapter might look like this, if those fields are semantically correct for the skill:

```yaml
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
when_to_use: Use for PR review, branch review, reviewing staged changes, reviewing a pasted diff, or preparing actionable review comments before merge.
argument-hint: '[pr-url|branch|diff-path]'
arguments: target
disable-model-invocation: false
user-invocable: true
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
license: Proprietary; see ../../../.agent/skills/pr-review/LICENSE.txt
compatibility: Requires workspace file-read access to ../../../.agent/skills/pr-review plus git; optional gh CLI for GitHub PR metadata.
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  canonical-path: '../../../.agent/skills/pr-review/SKILL.md'
  source-of-truth: '.agent/skills/pr-review'
---
```

Fields such as `context: fork`, `agent: Explore`, and `model: sonnet` should be included only when the behaviour is actually intended. They are powerful, not just descriptive.

For example, a context-heavy read-only investigation skill might benefit from:

```yaml
context: fork
agent: Explore
model: haiku
```

A deploy or release skill with side effects might benefit from:

```yaml
disable-model-invocation: true
```

But setting `disable-model-invocation: true` removes the skill from Claude’s automatic model discovery. That is correct for user-triggered side-effect workflows such as deploys, but wrong for background expertise that should auto-activate.

### 6.3 Codex-specific metadata

OpenAI’s `openai/skills` repository defines the core skill shape as:

```text
skill-name/
  SKILL.md
  agents/openai.yaml     recommended UI metadata
  scripts/
  references/
  assets/
```

Codex reads `name` and `description` from `SKILL.md` to decide whether a skill applies. The OpenAI skill-creator also recommends `agents/openai.yaml` for UI-facing metadata such as display name, short description, and default prompt.

A useful `.agents/skills/<skill>/agents/openai.yaml` file may be worth generating for Codex-oriented installations, but it is not part of the portable minimum. In the adapter system, this is an open decision:

```text
Option A:
  Put agents/openai.yaml only in canonical .agent/skills/<skill>/agents/openai.yaml.
  Lower duplication, but Codex may not see it during adapter discovery.

Option B:
  Generate a tiny agents/openai.yaml beside the .agents adapter.
  More Codex UI value, but introduces generated adapter support files.

Option C:
  Keep OpenAI UI metadata in SKILL.md metadata.short-description only.
  Simplest, but less rich than agents/openai.yaml.
```

A pragmatic first version might include this in `.agents/skills/<skill>/SKILL.md`:

```yaml
metadata:
  short-description: 'Review PRs using team standards'
```

and defer `agents/openai.yaml` until Codex UI behaviour proves it is worth the extra generated file.

### 6.4 Cursor-specific metadata

Cursor now supports Agent Skills in the editor and CLI and distinguishes skills from rules: skills are better for dynamic context discovery and procedural “how-to” instructions, while rules are always-on or scoped baseline instructions.

Current Cursor docs should be treated as the source of truth for directory support. The important discovery paths in this design are:

```text
.agents/skills/
.cursor/skills/
~/.agents/skills/
~/.cursor/skills/
```

A good shared `.agents/skills` adapter should be enough for Cursor. We would avoid a separate `.cursor/skills` adapter unless a project’s installed Cursor version fails to discover `.agents/skills`.

Some Cursor ecosystem material references optional fields such as `license`, `compatibility`, `metadata`, and `disable-model-invocation`. Because the Agent Skills spec already includes `license`, `compatibility`, and `metadata`, those are good to include. `disable-model-invocation` should be considered cross-client experimental rather than fully portable.

### 6.5 Gemini CLI metadata

Gemini CLI’s skills docs are closely aligned with the open Agent Skills model:

```text
SKILL.md
scripts/
references/
assets/
```

Gemini uses `name` and `description` for discovery, supports `.agents/skills/` as an alias for `.gemini/skills/`, and activates a skill through the `activate_skill` tool. Gemini’s docs emphasise that the description is critical because it decides when the skill should activate.

Gemini also documents these validation and discovery details:

```text
Filename must be exactly SKILL.md.
Frontmatter must be first thing in the file.
Both name and description must be present.
Recommended skill layout is one directory per skill.
Files nested more than one level below the skills directory are not discovered as skills.
```

This reinforces the adapter design: each adapter must be a real one-directory-deep skill containing an exact uppercase `SKILL.md`.

## 7. Canonical skill shape

We believe a maximally useful canonical skill should look like this:

```text
.agent/skills/<skill-name>/
  SKILL.md
  LICENSE.txt
  references/
    README.md
    examples.md
    glossary.md
    edge-cases.md
  scripts/
    helper.py
    validate.sh
  assets/
    templates/
      output-template.md
```

The canonical `SKILL.md` should include a clear skill root convention because it may be read from an adapter:

```markdown
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
license: Proprietary; see LICENSE.txt
compatibility: Requires git; optional gh CLI. Designed for coding agents with workspace read access.
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  canonical: 'true'
---

# PR Review

## Skill root

Treat `.agent/skills/pr-review/` as the skill root. Resolve all supporting files mentioned in this skill relative to that directory, even if this file was reached through an adapter under `.agents/skills/` or `.claude/skills/`.

## Purpose

Review pull requests, diffs, and branches using the team’s review standards.

## Workflow

1. Identify the review target: PR URL, branch, staged changes, or pasted diff.
2. Collect the relevant diff and surrounding code.
3. Read `references/rubric.md` before writing review comments.
4. Use `scripts/collect-diff.sh` when a local branch or PR number is available.
5. Produce review comments using `assets/templates/review-output.md`.

## Supporting files

- `references/rubric.md`: review rubric and severity definitions.
- `references/examples.md`: examples of good and bad review output.
- `scripts/collect-diff.sh`: helper for collecting a structured diff.
- `assets/templates/review-output.md`: output template.
```

The “Skill root” section is important because canonical supporting files live outside the adapter directory.

## 8. Supporting files: open design question

This is the most important unresolved part of the design.

### 8.1 What the standard assumes

The Agent Skills standard assumes supporting files live inside the skill directory:

```text
my-skill/
  SKILL.md
  scripts/
  references/
  assets/
```

Agents can then progressively load:

1. metadata at startup,
2. `SKILL.md` body on activation,
3. supporting files when needed.

### 8.2 What the adapter architecture changes

In the proposed adapter design, the activated skill directory is:

```text
.agents/skills/my-skill/
```

or:

```text
.claude/skills/my-skill/
```

but the real implementation lives in:

```text
.agent/skills/my-skill/
```

Therefore the adapter’s supporting files are not physically inside the activated skill directory.

### 8.3 Why this may still work

Most coding agents can read normal workspace files. If the adapter tells the agent to read:

```text
../../../.agent/skills/my-skill/SKILL.md
```

then the agent should be able to read the canonical definition and any files it references, such as:

```text
.agent/skills/my-skill/references/rubric.md
.agent/skills/my-skill/scripts/collect-diff.sh
.agent/skills/my-skill/assets/templates/review-output.md
```

This should be fine in normal repo-local coding-agent sessions where the whole workspace is readable.

### 8.4 Why this may not always work

Some clients treat activated skill directories specially.

Gemini CLI documents that after skill activation, the skill directory is added to allowed file paths, granting access to bundled assets. If the real assets are outside the adapter directory, they may not get the same special treatment.

This does not necessarily mean the design fails. It means the canonical `.agent/skills/...` files are ordinary workspace files rather than bundled skill files from the platform’s point of view.

### 8.5 ADR-worthy options

We believe an ADR should explicitly choose between these options.

#### Option A: External canonical support files

```text
.agent/skills/<skill>/references/
.agent/skills/<skill>/scripts/
.agent/skills/<skill>/assets/
```

Adapters only link to canonical `SKILL.md`.

Advantages:

- One real source of truth.
- No symlinks.
- No copied support files.
- No duplicate skill registrations.
- Easy to review and version.

Risks:

- Strict clients may not treat canonical supporting files as bundled skill resources.
- Packagers may not include canonical support files when packaging only the adapter.
- Relative paths must be made explicit.

This appears to be the best first design for repo-local coding agents.

#### Option B: Generated adapter materialisation

A build step generates full platform skill directories from canonical source:

```text
.agent/skills/pr-review/          canonical
.agents/skills/pr-review/         generated full copy
.claude/skills/pr-review/         generated full copy or generated Claude-specific variant
```

Advantages:

- Each platform sees a normal complete skill.
- Supporting files are inside the activated skill directory.
- Better for strict runtimes and packaging.

Risks:

- Duplication exists in the working tree.
- Duplicate registration risk returns if multiple directories are scanned.
- Generated files need clear ownership and `.gitattributes`/review hygiene.

This is better for distribution packages than for day-to-day repo source.

#### Option C: Generated distribution packages only

The repo keeps the pointer-adapter architecture, but release/export tooling creates full materialised packages for external distribution:

```text
dist/
  agents/pr-review/
  claude/pr-review/
```

Advantages:

- Source stays clean.
- Distribution packages are platform-normal.
- No duplicate registration in the source repo.

Risks:

- More tooling.
- Developers must know whether they are using source mode or package mode.

This is likely the best long-term answer if skills are shared outside the repo.

#### Option D: Symlinks

Symlink adapter directories or support folders to canonical files.

Advantages:

- Minimal duplication.
- Platform sees a normal-looking directory if it follows symlinks.

Risks:

- Some clients do not follow skill-directory symlinks reliably.
- Cross-platform Windows behaviour is awkward.
- The stated design preference is no symlinks.

This design should not use symlinks.

### 8.6 Suggested ADR position

The likely ADR decision:

```text
We will use pointer adapters in source control.

The canonical skill implementation, including supporting files, lives in .agent/skills/<skill>/.

The adapter body points to the canonical SKILL.md and explicitly says to include supporting files it references.

Every canonical skill must define its skill root and list supporting files with explicit paths.

If a target platform cannot reliably read canonical supporting files outside the activated adapter directory, we will add a packaging/materialisation step for that platform rather than copying files manually.
```

## 9. Compatibility matrix

### 9.1 Discovery paths

| Platform              | Project skill path(s) relevant to this design                                                     | User/global path(s)                                                                                        | Notes                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Agent Skills standard | Not mandated by the spec; `.agents/skills/` is recommended by client implementation guidance      | `~/.agents/skills/`                                                                                        | The spec defines what is inside a skill, not where clients must find skills                                         |
| Claude Code           | `.claude/skills/`                                                                                 | `~/.claude/skills/`                                                                                        | Needs a Claude adapter; `.agents/skills/` is not documented as native Claude Code discovery                         |
| Codex                 | `.agents/skills/` in current ecosystem/CLI usage; `$CODEX_HOME/skills` for installed Codex skills | `$CODEX_HOME/skills`, typically `~/.codex/skills`; also `~/.agents/skills/` in shared-path implementations | Verify in the installed Codex version; OpenAI’s skill installer documents `$CODEX_HOME/skills`                      |
| Cursor                | `.agents/skills/`, `.cursor/skills/`                                                              | `~/.agents/skills/`, `~/.cursor/skills/`                                                                   | Current direction supports `.agents/skills/`; separate `.cursor/skills/` adapter should not be needed once verified |
| Gemini CLI            | `.agents/skills/`, `.gemini/skills/`                                                              | `~/.agents/skills/`, `~/.gemini/skills/`                                                                   | Gemini explicitly says `.agents/skills/` is an alias for cross-tool compatibility                                   |

### 9.2 Frontmatter fields

| Field                        |       Agent Skills spec |                              Claude Code |                                                     Codex |                                        Cursor |                                  Gemini CLI | Design recommendation                                                  |
| ---------------------------- | ----------------------: | ---------------------------------------: | --------------------------------------------------------: | --------------------------------------------: | ------------------------------------------: | ---------------------------------------------------------------------- |
| `name`                       |                Required |                                Supported |                                                 Supported |                                     Supported |                                    Required | Always include                                                         |
| `description`                |                Required |                   Critical for discovery |                                    Critical for discovery |                        Critical for discovery |                      Critical for discovery | Always include; make rich and trigger-oriented                         |
| `license`                    |                Optional |                         Likely tolerated |                                          Likely tolerated |                        Supported or tolerated |                            Likely tolerated | Include when useful                                                    |
| `compatibility`              |                Optional |                         Likely tolerated |                                          Likely tolerated |                        Supported or tolerated |                            Likely tolerated | Include when there are environment requirements                        |
| `metadata`                   |                Optional |                         Likely tolerated | Used in OpenAI catalog, e.g. `metadata.short-description` |                        Supported or tolerated |                            Likely tolerated | Use for extra cross-platform metadata                                  |
| `allowed-tools`              | Optional / experimental | Supported in Claude Code; not SDK skills |                               Not portable as enforcement |   Unclear / likely ignored unless implemented | Unclear / likely ignored unless implemented | Use in adapters only when useful; document as variable support         |
| `when_to_use`                |            Not standard |                                Supported |                                                   Unknown |                                       Unknown |                                     Unknown | Put in `.claude/skills` if useful; otherwise prefer rich `description` |
| `argument-hint`              |            Not standard |                                Supported |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only                                                    |
| `arguments`                  |            Not standard |                                Supported |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only                                                    |
| `disable-model-invocation`   |            Not standard |                                Supported |                                                   Unknown | Claimed in some Cursor ecosystem docs; verify |                                     Unknown | Use carefully; side-effect skills only                                 |
| `user-invocable`             |            Not standard |                                Supported |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only                                                    |
| `context`                    |            Not standard |             Supported in Claude examples |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only; only when isolation is intended                   |
| `agent`                      |            Not standard |             Supported in Claude examples |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only; only when selecting a subagent                    |
| `model`                      |            Not standard |                 Supported in Claude docs |                                                   Unknown |                                       Unknown |                                     Unknown | Claude adapter only                                                    |
| `metadata.short-description` |        Under `metadata` |                                Tolerated |                                     Used in OpenAI skills |                                     Tolerated |                                   Tolerated | Reasonable in `.agents` adapter as string metadata                     |
| `agents/openai.yaml`         |         Not frontmatter |                                  Ignored |                                   Recommended UI metadata |                                       Ignored |                                     Ignored | Optional generated Codex UI file, not portable core                    |

### 9.3 Supporting file structure

| Structure                              |                                Agent Skills spec |                                                   Claude Code |                               Codex |        Cursor |    Gemini CLI | Design recommendation                              |
| -------------------------------------- | -----------------------------------------------: | ------------------------------------------------------------: | ----------------------------------: | ------------: | ------------: | -------------------------------------------------- |
| `scripts/`                             |                                Optional standard |                                                     Supported |                           Supported |     Supported |     Supported | Use for deterministic helpers                      |
| `references/`                          |                                Optional standard | Supported as normal files; Claude examples also use root docs |                           Supported |     Supported |     Supported | Use for long docs, schemas, rubrics, examples      |
| `assets/`                              |                                Optional standard |                                     Supported as normal files |                           Supported |     Supported |     Supported | Use for templates/static resources                 |
| `templates/`                           | Not core standard, but common in Claude examples |                                         Supported in examples |                       Normal folder | Normal folder | Normal folder | Prefer `assets/templates/` for portability         |
| `reference.md` / `examples.md` at root |                                     Normal files |                                       Used in Claude examples |                        Normal files |  Normal files |  Normal files | Fine for small skills; `references/` scales better |
| `agents/openai.yaml`                   |                                     Not standard |                                                       Ignored | Recommended by OpenAI skill-creator |       Ignored |       Ignored | Optional adapter-side Codex UI file                |

## 10. Rules, hooks, MCP, subagents, and other agentic infrastructure

### 10.1 Rules and persistent instruction files

Rules are still important, but their best role is different from skills.

Where they are today:

- Cursor has first-class project rules under `.cursor/rules`, user rules in settings, `AGENTS.md` as a simpler alternative, and `.cursorrules` as legacy.
- Claude Code uses `CLAUDE.md` as its primary memory/instruction file and documents importing `AGENTS.md` from `CLAUDE.md` if a repo already uses `AGENTS.md`.
- Gemini CLI uses `GEMINI.md` by default, but can be configured to use `AGENTS.md`.
- Codex has helped popularise `AGENTS.md` as a repo-level agent instruction format.
- `AGENTS.md` is becoming the broadest cross-agent instruction file. The public `agents.md` site describes it as a README for agents and says it is used across many coding agents.

Where they are heading:

```text
Rules / AGENTS.md / CLAUDE.md / GEMINI.md:
  Stable baseline context, conventions, build/test commands, architecture constraints.

Skills:
  On-demand procedures, workflows, and bundled capability.
```

A good system should not move every rule into a skill. The split should be:

```text
Put this in rules / AGENTS.md:
  "Use pnpm."
  "Tests live under packages/*/__tests__."
  "Do not edit generated files."
  "Prefer server components unless client state is required."

Put this in skills:
  "How to perform a release."
  "How to review a PR using the team rubric."
  "How to add a new database migration safely."
  "How to create a curriculum content audit report."
```

Cross-platform interoperability:

- `AGENTS.md` is the strongest cross-platform instruction-file candidate.
- Vendor-native rule systems remain richer but less portable.
- A good cross-platform system may keep `AGENTS.md` canonical and use vendor-specific files as adapters, similar to skills.

### 10.2 Hooks

Hooks are the deterministic lifecycle layer.

Where they are today:

- Claude Code supports hooks in settings files, with lifecycle events such as `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Notification`, `Stop`, `SubagentStop`, `PreCompact`, `SessionStart`, and `SessionEnd`.
- Gemini CLI supports hooks in `settings.json`, with command hooks and events such as `BeforeTool`, `AfterTool`, `BeforeAgent`, `AfterAgent`, `BeforeModel`, `BeforeToolSelection`, `AfterModel`, `SessionStart`, and `SessionEnd`.
- Cursor has hooks for organisations to observe, control, and extend the agent loop, with a strong emphasis on security, governance, dependency scanning, and secrets management.

Where they are heading:

```text
Hooks are becoming the enforcement and observability layer:
  - block dangerous shell commands
  - detect secrets
  - run policy checks
  - inject dynamic context
  - log agent actions
  - enforce formatting/test gates
```

Cross-platform interoperability:

- There is not yet an obvious cross-platform hook standard equivalent to Agent Skills or MCP.
- Hook concepts are converging, but event names, config files, JSON schemas, and security models differ.
- A good system should share hook scripts where possible, but generate vendor-specific hook config.

Likely shape:

```text
.agent/hooks/
  scripts/
    block-dangerous-shell.sh
    detect-secrets.sh
    collect-context.sh

.claude/settings.json
  Claude hook adapter config

.gemini/settings.json
  Gemini hook adapter config

.cursor/...
  Cursor hook adapter config, if required
```

### 10.3 MCP, tools, plugins, and extensions

MCP is the strongest cross-platform integration mechanism.

Where it is today:

- MCP is an open protocol for connecting AI applications to external systems: tools, data sources, resources, prompts, and workflows.
- MCP tools are model-controlled: models can discover and invoke tools exposed by servers.
- MCP resources are application-controlled or client-mediated context sources.
- MCP prompts can surface reusable prompt templates or workflows.
- OpenAI’s Apps SDK is built on MCP.
- Gemini CLI has detailed MCP server support.
- Claude Code and many IDE agents support MCP integrations.

Where it is heading:

```text
MCP:
  external systems, tools, APIs, data, resources

Skills:
  procedural knowledge about when and how to use those tools

Rules:
  baseline conventions

Hooks:
  enforcement and observability
```

A good skills system should not try to turn every integration into a skill. Skills should teach the agent the workflow. MCP should provide the external capability.

Example:

```text
Skill:
  "How to stage a customer update using our account-review process."

MCP/plugin/tool:
  Google Drive, Slack, CRM, Linear, GitHub, database, browser, etc.

Hook:
  "Block posting externally unless the user confirms."

Rule:
  "Use the company tone guide and never expose internal account IDs."
```

Cross-platform interoperability:

- MCP is the best-supported cross-platform external-tool protocol.
- Skills should reference MCP tools by capability, not by assuming every client names them identically.
- Vendor adapters may be necessary for tool names, trust/permission settings, or plugin installation.

### 10.4 Subagents

Subagents are role delegation and context isolation.

Where they are today:

- Claude Code has strong subagent support, including custom subagents with YAML frontmatter, model selection, tool restrictions, and separate context.
- Cursor’s recent changelog introduced subagents that can work in parallel with their own context.
- Gemini extensions document sub-agents as a preview feature.
- Other platforms increasingly expose some form of agent delegation, worker agents, or background tasks.

Where they are heading:

```text
Subagents:
  isolate noisy or specialised work
  run parallel research
  enforce tool boundaries
  delegate verification
  keep main context clean
```

Cross-platform interoperability:

- There is no mature cross-platform subagent specification comparable to Agent Skills.
- The common conceptual model is clear, but file formats and lifecycle controls vary.
- Skills may refer to subagents abstractly, while platform adapters bind to specific subagent names.

Example:

```text
Canonical skill:
  "For large codebase exploration, prefer a read-only exploration worker if the platform supports one."

Claude adapter:
  agent: Explore
  context: fork
```

### 10.5 Permissions and policy

Permissions are becoming more important as agents become more autonomous.

Where they are today:

- Claude Code has explicit tool permission modes and allow/ask/deny rules.
- Claude skills can use `allowed-tools` to grant specific tools while active.
- Gemini MCP servers have trust and confirmation behaviour.
- Gemini hooks are explicitly described as risky because they execute arbitrary code with user privileges.
- Cursor hooks are being positioned for security and governance teams.

Where they are heading:

```text
Natural-language instructions are not enough for safety.

Good systems increasingly combine:
  - least-privilege tool access
  - human-in-the-loop confirmation
  - hooks
  - policy files
  - CI checks
  - sandboxing
  - MCP server allowlists
```

Cross-platform interoperability:

- There is no universal permission config.
- The portable design principle is least privilege and explicit side-effect control.
- Vendor adapters should encode platform-specific permission controls where available.

## 11. Proposed ADRs

### ADR 001: Canonical skill source and adapter paths

Decision we believe is good:

```text
Canonical source:
  .agent/skills/<skill>/SKILL.md

Discovery adapters:
  .agents/skills/<skill>/SKILL.md
  .claude/skills/<skill>/SKILL.md
```

Rationale:

- `.agent/skills` is private and unlikely to be scanned by vendors.
- `.agents/skills` is the cross-platform discovery path.
- `.claude/skills` is required for Claude Code.
- `.codex`, `.cursor`, and `.gemini` adapters are unnecessary once `.agents/skills` is verified.
- Simple Markdown links avoid symlink issues and reduce duplicate registrations.

Consequences:

- Adapter metadata is duplicated.
- Adapter bodies are intentionally minimal.
- Supporting files live outside the activated adapter directory, which requires an ADR.

### ADR 002: Maximal useful frontmatter

Decision we believe is good:

```text
Use all standard Agent Skills frontmatter fields when useful:
  name
  description
  license
  compatibility
  metadata
  allowed-tools

Use platform-specific fields in platform adapters when semantically useful:
  .claude/skills: Claude-specific fields
  .agents/skills: only fields likely to be tolerated, plus metadata for richer annotations
```

Rationale:

- Discovery depends on metadata.
- Rich descriptions improve automatic activation.
- Platform-specific metadata can improve UX and safety.
- Some fields will be ignored by some platforms; this is acceptable if documented.

Consequences:

- Validators should distinguish strict portable validation from platform-specific validation.
- Unknown top-level fields may be risky in strict parsers.
- Non-standard fields are safest inside `metadata` unless a target platform explicitly documents them.

### ADR 003: Supporting files

Decision to make:

```text
Should supporting files remain only under .agent/skills/<skill>/,
or should adapters be materialised with copied supporting files for strict clients?
```

Preferred initial decision:

```text
Keep supporting files canonical under .agent/skills/<skill>/.

Adapters point to canonical SKILL.md.

Canonical SKILL.md declares its skill root and references all supporting files relative to that root.

Add materialisation tooling only if platform tests show a target agent cannot reliably read canonical supporting files.
```

Consequences:

- Source stays clean.
- No duplicate registrations.
- Strict packaging/export flows may need generated full skill packages.

### ADR 004: Commands migration

Decision we believe is good:

```text
Do not create new custom command files for reusable workflows.

Represent reusable workflows as skills.

Use built-in commands for product controls only.

Use slash invocation as a UI surface for skills, not as a separate custom-command abstraction.
```

Rationale:

- Claude Code has merged custom commands into skills.
- Amp removed custom commands in favour of user-invokable skills.
- Skills support both user invocation and model invocation.
- Skills support supporting files and progressive loading.

### ADR 005: Rules versus skills

Decision we believe is good:

```text
Use AGENTS.md / rules / CLAUDE.md / GEMINI.md for persistent baseline context.

Use skills for on-demand procedures and capabilities.

Do not move stable repo facts into skills unless they are part of an executable workflow.
```

Rationale:

- Rules are always-on or scoped.
- Skills are lazily loaded.
- Long procedural rules waste context and are better as skills.
- Short baseline instructions should remain baseline instructions.

## 12. Validation and compatibility tests

A good system should include automated checks.

Suggested checks:

```text
For every canonical skill:
  - .agent/skills/<name>/SKILL.md exists
  - filename is exactly SKILL.md
  - frontmatter is first thing in file
  - name matches folder name
  - description is present and trigger-oriented
  - standard frontmatter validates against Agent Skills spec
  - supporting files referenced in SKILL.md exist
  - scripts are executable or have documented invocation
  - canonical SKILL.md declares skill root

For every adapter:
  - .agents/skills/<name>/SKILL.md exists
  - .claude/skills/<name>/SKILL.md exists
  - adapter name matches canonical name
  - adapter description is present
  - adapter canonical link resolves
  - adapter body contains exactly the canonical read instruction, or an approved minimal variant

For duplicate registration risk:
  - no .codex/skills, .cursor/skills, or .gemini/skills directories unless explicitly justified
  - no symlinks used for skill discovery
  - no duplicate skill names across adapters for the same platform path
```

Manual or integration checks should verify:

```text
Claude Code:
  - skill appears via .claude/skills
  - /skill-name works
  - automatic invocation works unless disabled
  - canonical .agent files can be read
  - Claude-specific frontmatter behaves as expected

Codex:
  - skill appears via .agents/skills
  - skill can read canonical .agent files
  - optional metadata.short-description or agents/openai.yaml behaviour is verified

Cursor:
  - skill appears via .agents/skills
  - slash invocation works
  - automatic agent application works
  - no duplicate registration from removed .cursor/skills

Gemini CLI:
  - /skills list shows .agents/skills adapter
  - activate_skill flow works
  - canonical .agent files can be read
  - supporting scripts/assets outside adapter dir are accessible or trigger acceptable consent
```

## 13. Suggested generator behaviour

A good implementation probably should not hand-write adapters.

It should generate adapters from canonical skill metadata.

Input:

```text
.agent/skills/<skill>/SKILL.md
```

Generated:

```text
.agents/skills/<skill>/SKILL.md
.claude/skills/<skill>/SKILL.md
```

Potential generator behaviour:

```text
1. Parse canonical frontmatter.
2. Validate canonical name and description.
3. Copy or derive trigger metadata into adapters.
4. Add platform-specific fields from canonical metadata or config.
5. Write minimal adapter body.
6. Validate canonical link.
7. Report any supporting-file references that do not exist.
```

A canonical metadata block could include adapter hints without making them top-level platform fields:

```yaml
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  short-description: 'Review PRs using team standards'
  claude-argument-hint: '[pr-url|branch|diff-path]'
  claude-arguments: 'target'
  claude-disable-model-invocation: 'false'
  claude-user-invocable: 'true'
  claude-context: ''
  claude-agent: ''
  claude-model: ''
```

The generator can then emit true Claude top-level fields into `.claude/skills/<skill>/SKILL.md`.

This keeps canonical source portable while still allowing maximal platform-specific adapters.

## 14. Example complete output

### 14.1 Canonical skill

```markdown
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
license: Proprietary; see LICENSE.txt
compatibility: Requires git; optional gh CLI. Designed for coding agents with workspace read access.
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  short-description: 'Review PRs using team standards'
  canonical: 'true'
  source-path: '.agent/skills/pr-review/SKILL.md'
  claude-argument-hint: '[pr-url|branch|diff-path]'
  claude-arguments: 'target'
  claude-disable-model-invocation: 'false'
  claude-user-invocable: 'true'
---

# PR Review

## Skill root

Treat `.agent/skills/pr-review/` as the skill root. Resolve all supporting files mentioned in this skill relative to that directory, even if this file was reached through an adapter under `.agents/skills/` or `.claude/skills/`.

## Purpose

Review pull requests, diffs, and branches using the team’s review standards.

## Workflow

1. Identify the target: PR URL, branch, staged changes, or pasted diff.
2. Collect the diff and enough surrounding code to understand impact.
3. Read `references/rubric.md`.
4. Use `scripts/collect-diff.sh` when local git context is available.
5. Produce comments using `assets/templates/review-output.md`.

## Supporting files

- `references/rubric.md`: review rubric and severity definitions.
- `references/examples.md`: examples of high-quality review output.
- `scripts/collect-diff.sh`: helper for collecting a structured diff.
- `assets/templates/review-output.md`: output template.
```

### 14.2 Shared `.agents/skills` adapter

```markdown
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
license: Proprietary; see ../../../.agent/skills/pr-review/LICENSE.txt
compatibility: Requires workspace file-read access to ../../../.agent/skills/pr-review plus git; optional gh CLI for GitHub PR metadata.
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  short-description: 'Review PRs using team standards'
  canonical-path: '../../../.agent/skills/pr-review/SKILL.md'
  source-of-truth: '.agent/skills/pr-review'
---

Read and follow [the canonical skill definition](../../../.agent/skills/pr-review/SKILL.md), including any supporting files it references.
```

### 14.3 Claude Code adapter

```markdown
---
name: pr-review
description: Review pull requests, diffs, and branches for correctness, maintainability, security, test coverage, and team conventions. Use when the user asks to review a PR, inspect a diff, prepare review comments, or assess code before merge.
when_to_use: Use for PR review, branch review, reviewing staged changes, reviewing a pasted diff, or preparing actionable review comments before merge.
argument-hint: '[pr-url|branch|diff-path]'
arguments: target
disable-model-invocation: false
user-invocable: true
allowed-tools: Read Grep Glob Bash(git:*) Bash(gh:*)
license: Proprietary; see ../../../.agent/skills/pr-review/LICENSE.txt
compatibility: Requires workspace file-read access to ../../../.agent/skills/pr-review plus git; optional gh CLI for GitHub PR metadata.
metadata:
  version: '0.1.0'
  owner: 'engineering-enablement'
  tags: 'pull-request,code-review,security,testing'
  short-description: 'Review PRs using team standards'
  canonical-path: '../../../.agent/skills/pr-review/SKILL.md'
  source-of-truth: '.agent/skills/pr-review'
---

Read and follow [the canonical skill definition](../../../.agent/skills/pr-review/SKILL.md), including any supporting files it references.
```

## 15. Ecosystem direction and standards adoption

We believe Anthropic and Vercel are among the main drivers of skills standard adoption, with OpenAI/Codex, Gemini, Cursor, Amp, and others accelerating validation.

Anthropic appears to be the originator or primary populariser of the open Agent Skills shape. The Agent Skills site says the format was originally developed by Anthropic and released as an open standard. Claude Code’s implementation is the most fully documented for skill invocation, supporting files, command migration, and platform-specific frontmatter.

Vercel appears to be a major distribution and ecosystem driver. Its `skills` CLI and skills.sh directory are positioned as an open ecosystem for discovering, installing, and ranking agent skills. Vercel says `npx skills add` has been used across many agents, including Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Amp, OpenCode, and others.

OpenAI/Codex is an important adoption signal because OpenAI’s public help docs say OpenAI skills follow the Agent Skills open standard and are supported in Codex and the API. The `openai/skills` repository also provides a concrete catalog and skill-creator implementation.

Gemini CLI is an important adoption signal because it explicitly supports `.agents/skills/` as a compatibility alias.

Cursor is an important adoption signal because it now supports Agent Skills in the editor and CLI and positions skills as the procedural complement to rules.

Amp is an important directional signal because it explicitly removed custom commands in favour of user-invokable skills.

A reasonable industry thesis is:

```text
Agent Skills:
  portable capability package

AGENTS.md:
  portable project instruction file

MCP:
  portable tool/data integration protocol

Hooks:
  converging concept, not yet portable format

Rules:
  still mostly vendor-specific

Subagents:
  converging concept, not yet portable format

Commands:
  product UI and legacy prompt shortcuts; reusable workflows move to skills
```

## 16. Final design position

We believe a good vendor-agnostic skills system with vendor-specific adapters should have these properties:

```text
1. One canonical implementation:
   .agent/skills/<skill>/

2. Two primary adapter surfaces:
   .agents/skills/<skill>/SKILL.md
   .claude/skills/<skill>/SKILL.md

3. No symlinks.

4. No duplicated full skill bodies.

5. No .codex/.cursor/.gemini adapters unless proven necessary.

6. Rich frontmatter in adapters, because adapters are the discovery surface.

7. Full workflow and supporting files in canonical skills.

8. Explicit canonical skill root in every canonical SKILL.md.

9. Platform-specific fields isolated to platform adapters where possible.

10. Unknown or experimental cross-platform metadata placed under metadata with string values where possible.

11. A documented ADR accepting that some metadata may be ignored by some platforms.

12. A separate ADR for supporting files outside activated adapter directories.

13. Automated generation and validation of adapters.

14. Integration tests across Claude Code, Codex, Cursor, and Gemini CLI.
```

This design matches the direction of the industry while preserving source cleanliness and avoiding duplicate registrations.

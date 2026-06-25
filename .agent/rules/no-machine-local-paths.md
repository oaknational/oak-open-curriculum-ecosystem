# No Machine-Local Paths

Operationalises [`principles.md` §Code Design and Architectural Principles](../directives/principles.md)
"No machine-local paths".

Pattern reference: `breadth-as-evasion.md` cross-references previously
embedded a `Users-<user>-code-oak-oak-open-curriculum-ecosystem` flattened-
project-id segment in two reference-style markdown link definitions.
The same architectural class — paths that look portable but resolve
only on the original author's machine — was caught earlier by the
owner in ADR-167's "absolute path" wording (see archived napkin
2026-04-29 §"Surprise 3 — 'absolute path' wording smuggled hard-coded
local paths into a portability ADR").

## Rule

**Every filesystem path in a version-controlled file MUST resolve to
the same meaningful target on every contributor's machine and in CI.**

The principle is reachability and meaning, not relative-vs-absolute
syntax. A path can be relative-shaped and still be machine-local; a
path can be absolute-shaped and still be portable (when rooted at a
platform-provided variable). The test is the destination, not the
syntax.

## Owner ruling 2026-06-12 — expanded scope, whole-repo, retroactive

`/Users/<user>/`, `/tmp/`, `/private/`, `/usr/`, `/Library/`, and every
other machine-local root are forbidden in version-controlled files —
**everywhere in the repo, with no exceptions for any reason, ever**,
including historical records (the comms corpus and archives were swept
2026-06-12). Only repo-root-relative paths are permitted for in-repo
targets. Operational conventions from the sweep:

- **Runnable examples** use the repo-root-relative `tmp/` directory
  (gitignored at the repo root) instead of the OS temp root.
- **Historical prose** that referenced OS-temp artefacts uses the
  `<scratch>/` placeholder (the artefact was host-local and transient;
  the placeholder records that without the forbidden literal).
- **Tilde-templated per-user surfaces** (`~/.claude/...`, `~/.codex/...`)
  remain the permitted shape 2 below (owner-ratified 2026-06-12) — but
  note absolute paths stored INSIDE those local homes tend to
  recontaminate the repo later; prefer repo-relative there too.
- **Teaching and detection content** (this rule's forbidden-shape
  examples, detection regexes, the temp-files rule's ❌ rows) carries
  the literals only in defanged or pattern positions — that machinery
  IS the ban's enforcement surface.
- **Remaining code-class carriers** (logger runtime defaults, test
  fixtures, integration temp usage — enumerable via
  `git grep -lF '/tmp/' -- '*.ts' '*.sh'`) are a named follow-on
  engineering lane with the CI validator below; behaviour changes need
  their own TDD cycles, not a sweep sed.

## The Three Forbidden Shapes

### 1. Literal absolute paths

```text
/Users/<user>/code/oak/...                   ❌ macOS user home
/home/<user>/projects/...                    ❌ Linux user home
C:\Users\<user>\Documents\...                ❌ Windows user home
/opt/local/lib/...                        ❌ machine-specific install
```

These expose usernames and local directory structure and do not
resolve for any other contributor.

### 2. Relative paths that reach outside the repo into per-user surfaces

```text
../../../.claude/projects/<id>/memory/... ❌ reaches ~/.claude/, not in repo
../../../../home/<user>/.cursor/...       ❌ reaches user home via ../
../../../../etc/passwd                    ❌ reaches OS surface
```

**Relative syntax does not redeem a per-user destination.** A `..`
chain that escapes the repo and lands on `~/.claude/`, `~/.cursor/`,
`~/.codex/`, or any other per-user-machine surface is just as broken
as a literal absolute path. It looks repo-relative; it fails for every
reader other than the original author.

### 3. Hardcoded usernames or user-specific path segments

```text
Users-<user>-code-oak-oak-open-curriculum-ecosystem  ❌ Claude flattened ID with username
.../<user>/.../cache                                 ❌ embedded username
~/code/<user>/...                                    ❌ author home assumption
project-<user>-local                                 ❌ author-named artefact
```

Claude Code flattens project paths into IDs of the form
`-Users-<user>-<path-segments>-<repo>` for its per-user memory
directory. Embedding such an ID anywhere — even inside an otherwise-
relative path — couples the file to the original author's machine.
The same applies to any segment derived from a username, employee ID,
or local-only project name.

## The Three Permitted Shapes

### 1. Repo-relative paths for in-repo content

```text
.agent/memory/active/patterns/scope-as-goal.md     ✅ from repo root
../validate-portability.ts                         ✅ from sibling file
docs/architecture/architectural-decisions/168-...md ✅ from repo root
```

### 2. Templated placeholders for prose about per-user surfaces

```text
~/.claude/projects/<project>/memory/                ✅ Claude auto-memory
~/.cursor/chats/                                    ✅ Cursor history
~/.codex/memories/                                  ✅ Codex memory
```

The angle-bracketed placeholder (`<project>`, `<session>`, etc.)
signals that the segment is per-user/per-session and resolves
differently on every machine. **These are prose conventions, not
clickable links.** Do NOT author markdown reference-style links to
templated destinations — they look resolvable but break for every
reader.

### 3. Platform-provided variables for runtime-resolved paths

```text
${CLAUDE_PROJECT_DIR}/.claude/hooks/log-hook-errors.sh  ✅ per ADR-167
${WORKSPACE_FOLDER}/scripts/...                         ✅ Cursor variable
$CODEX_THREAD_ID                                        ✅ Codex variable
```

Used in hook commands, settings files, and scripts that the harness
expands at runtime. Each platform provides the variable; the path
becomes correct on every machine. **Never use a relative pseudo-path
that happens to work in one environment** when a platform-provided
variable is available.

## Detection

Mechanically enforced. The `validate-no-machine-local-paths` repo-validator
scans every tracked file and fails the gate on any machine-local user-home or
machine-temp absolute path (`/Users/<seg>`, `/home/<seg>`, `C:\Users\<seg>`,
`/private/tmp`, `/var/folders`). It is wired into `repo-validators:check`, which
runs in the pre-commit hook AND in CI via `pnpm check` — so a machine-local path
cannot be committed or merged.

The same pattern set lives in `.agent/hooks/policy.json`
(`preToolUseContent` → `machine-local-path`), which blocks such paths at
Edit/Write time through the PreToolUse content hook. The pattern set is the
single source of truth; the validator loads it from the policy.

Two exemptions, by construction, not by allowlist sprawl: **portable system
paths** (`/usr/bin`, `/opt/homebrew/bin`, generic `/tmp`) resolve to the same
target on every machine and are not machine-local, so they are not flagged; and
**placeholder forms** (`/Users/<user>/`, `/Users/<name>/`) used to teach the
pattern are not flagged because the detector requires a concrete segment.

## Forbidden

- `eslint-disable` of any rule because a path "is fine on my machine".
- `// TODO: fix path before merge` comments. The path is wrong now.
- "It works locally" — the principle's whole point is that "locally"
  is not the bar.
- Markdown reference-style link definitions (`[label]: <url>`) that
  point at user-specific destinations. They evade the simpler
  inline-link review by hiding the URL at the bottom of the file.

## Worked Examples

### Example 1 — the bug that prompted this rule

Found in `.agent/memory/active/patterns/breadth-as-evasion.md`
(2026-04-29):

```markdown
[feedback-answer]: ../../../.claude/projects/-Users-<user>-code-oak-oak-open-curriculum-ecosystem/memory/feedback_answer_verification_questions_directly.md
```

Two failure modes at once: relative-out-of-repo (`../../../.claude/`
escapes into the user home where the repo's `.claude/` does not
contain `projects/`) AND embedded flattened-project-id with username
(`Users-<user>-code-oak-oak-open-curriculum-ecosystem`).

Fix: replace the bracketed-link reference with prose that names the
file and acknowledges it lives in per-user auto-memory using the
templated form `~/.claude/projects/<project>/memory/`.

### Example 2 — ADR-167's "absolute path" wording

Original ADR-167 Decision §2 prescribed "MUST use an absolute path
resolved against a platform-provided project-root variable". The
prose used "absolute" to mean "fully-qualified", which would invite
contributors to hardcode literal absolute paths in version control.

Fix: rewrote to "dynamic path rooted at a platform-provided
project-root variable" with explicit rejection of bare-relative paths
(cwd-trap) AND literal-absolute paths (machine-coupling).

### Example 3 — research notes referencing per-user memory

A research note describing how auto-memory works:

```markdown
✅ "Claude auto-memory lives at `~/.claude/projects/<project>/memory/MEMORY.md`."

❌ "Claude auto-memory lives at `~/.claude/projects/-Users-<user>-code-.../memory/MEMORY.md`."

❌ "Claude auto-memory lives at
   [`MEMORY.md`](../../../.claude/projects/-Users-<user>-code-.../memory/MEMORY.md)."
```

Templated-placeholder prose is correct. Embedded usernames and
broken reference-links are forbidden.

## Related

- `.agent/directives/principles.md` §"No machine-local paths" (the
  principle this rule operationalises).
- ADR-167 (hook-execution-failure visibility) — same architectural
  class for runtime hook commands; uses `${CLAUDE_PROJECT_DIR}`.
- ADR-125 (artefact three-layer model) — platform adapters MUST be
  thin pointers using repo-relative paths, never machine-coupled.

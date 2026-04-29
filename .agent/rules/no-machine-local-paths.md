# No Machine-Local Paths

Operationalises [`principles.md` §Code Design and Architectural Principles](../directives/principles.md)
"No machine-local paths".

Pattern reference: `breadth-as-evasion.md` cross-references previously
embedded a `Users-jim-code-oak-oak-open-curriculum-ecosystem` flattened-
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

## The Three Forbidden Shapes

### 1. Literal absolute paths

```text
/Users/jim/code/oak/...                   ❌ macOS user home
/home/jim/projects/...                    ❌ Linux user home
C:\Users\jim\Documents\...                ❌ Windows user home
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
Users-jim-code-oak-oak-open-curriculum-ecosystem  ❌ Claude flattened ID with username
.../jim/.../cache                                 ❌ embedded username
~/code/jim/...                                    ❌ author home assumption
project-jim-local                                 ❌ author-named artefact
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

### Local

Run before commit:

```bash
# Forbidden absolute home segments
grep -rn -E "/Users/[a-z0-9_-]+/|/home/[a-z0-9_-]+/|C:\\\\Users\\\\" \
  --include="*.md" --include="*.ts" --include="*.json" --include="*.yml" \
  --include="*.toml" --include="*.cjs" --include="*.mjs" \
  .agent/ docs/ scripts/ apps/ packages/ \
  2>/dev/null | grep -v "/archive/"

# Claude Code flattened-project-id segments
grep -rn -E "Users-[a-z0-9_-]+-[a-z0-9_-]+|/\\.claude/projects/-[A-Za-z]" \
  --include="*.md" --include="*.json" \
  .agent/ docs/ scripts/ apps/ packages/ \
  2>/dev/null | grep -v "/archive/"
```

Both must produce zero matches outside `archive/` directories.

### CI

A future repo-invariant validator (per the
`scripts-validator-family-workspace-migration` plan) should encode
these greps as a structural test in the validator workspace. Until
then, the discipline is review-time and pre-commit-grep.

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
[feedback-answer]: ../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_answer_verification_questions_directly.md
```

Two failure modes at once: relative-out-of-repo (`../../../.claude/`
escapes into the user home where the repo's `.claude/` does not
contain `projects/`) AND embedded flattened-project-id with username
(`Users-jim-code-oak-oak-open-curriculum-ecosystem`).

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

❌ "Claude auto-memory lives at `~/.claude/projects/-Users-jim-code-.../memory/MEMORY.md`."

❌ "Claude auto-memory lives at
   [`MEMORY.md`](../../../.claude/projects/-Users-jim-code-.../memory/MEMORY.md)."
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

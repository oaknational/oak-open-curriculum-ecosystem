---
fitness_line_target: 200
fitness_line_limit: 240
fitness_char_limit: 16000
fitness_line_length: 100
fitness_rationale: >-
  Sized for the Practice-wide privacy doctrine (PII in the estate, machine-local paths, public
  history) plus the host's own bindings; knowledge preservation outranks fitness warnings.
split_strategy: Split by responsibility — extract PII handling from psychological safety
---

# Privacy

Rules for handling psychologically sensitive and personally identifiable content in this repository,
including the machine-local paths that carry it. These rules apply to all contributors — human and
AI. The Practice-wide doctrine comes first; the host's own categories, rules and authorisations are
in §This host's bindings at the end.

## PII in the repository estate

The never-include-PII policy binds the repository estate itself (paths, test fixtures, docs, memory
files, tool-output dumps), not only runtime payloads:

- **Delete on sight, never narrate.** On finding PII in any versioned or shared artefact, remove it
  immediately and report the removal as done — never present the find as an interesting artefact
  or keep it visible while discussing it.
- **Test fixtures use obviously-fake values via dependency injection** (placeholder names,
  `example.org`) — never a real username, home path, or host, even as a positive-control fixture
  in the very test that guards against such values. A behaviour-proving test proves the same
  behaviour with a fake value passed as data; the `validate-no-machine-local-paths` validator and
  the write hook mechanically catch the user-home and flattened project-id carrier forms.
- **A coarse location tied to a principal (a timezone, a region) is not automatically identifying.**
  Surface borderline references for the data-subject's judgement rather than auto-classifying them
  as must-remove — and rather than shipping them silently.
- **Never ship a "PII-clean" verdict from a regex sweep plus a skim.** A clean verdict needs a real
  read of the surfaces at stake; borderline finds are surfaced, not adjudicated by the scanner.

## PII scrubbing

Payloads that would otherwise leave the process pass through one shared redaction policy before any
sink receives them; the barrier is not bypassable per call site. Redaction covers sensitive keys,
bearer tokens, OAuth fields and IP-like headers. Arbitrary email-like values are scrubbed at the
same barrier; treat that coverage as unproven for any path until a data-flow proof shows such
values cannot enter it or a test shows they are redacted.

Implementation direction:

```typescript
// Pattern only: concrete coverage belongs at the shared redaction barrier.
export function scrubEmailLikeValue(value: string): string {
  // Replace the whole email-like value before it leaves the process.
  return value.replace(/[^@\s]{1,64}@[^@\s]+/g, '[redacted-email]');
}
```

## Machine-local paths

**Every filesystem path in a version-controlled file MUST resolve to the same meaningful target on
every contributor's machine and in CI** ([principles.md §Code Design and Architectural
Principles](./principles.md)). The principle is reachability and meaning, not relative-vs-absolute
syntax: a path can be relative-shaped and still be machine-local, and absolute-shaped yet portable
(rooted at a platform-provided variable). The test is the destination, not the syntax. A user-home
path also leaks a username — the PII carrier form the section above mechanically catches.

Owner ruling 2026-06-12, whole-repo and retroactive: user-home roots, OS temp roots, and every other
machine-local root are forbidden in version-controlled files everywhere in the repo, with no
exceptions for any reason, ever — including historical records (in OCE, the comms corpus and
archives were swept 2026-06-12). Operational conventions from the sweep:

- **Runnable examples** use the repo-root-relative `tmp/` directory (gitignored at the repo root)
  instead of the OS temp root.
- **Historical prose** that referenced OS-temp artefacts uses the `<scratch>/` placeholder — the
  artefact was host-local and transient; the placeholder records that without the forbidden literal.
- **Tilde-templated per-user surfaces** (`~/.claude/...`, `~/.codex/...`) are permitted shape 2
  below (owner-ratified 2026-06-12) — but absolute paths stored INSIDE those local homes tend to
  recontaminate the repo later; prefer repo-relative there too.
- **Teaching and detection content** carries the forbidden literals only in defanged or pattern
  positions — that machinery IS the ban's enforcement surface.
- **Code-class carriers** (logger runtime defaults, test fixtures, integration temp usage —
  enumerable via `git grep -lF '/tmp/' -- '*.ts' '*.sh'`) change behaviour when touched: each gets
  its own TDD cycle, never a sweep sed.

**The three forbidden shapes:**

1. **Literal absolute paths** — user-home roots (`/Users/<user>/...`, `/home/<user>/...`,
   `C:\Users\<user>\...`) and machine-specific installs (`/opt/local/lib/...`). They expose
   usernames and local directory structure and resolve for no other contributor.
2. **Relative paths that escape the repo into per-user surfaces** — a `..` chain that lands on
   `~/.claude/`, `~/.cursor/`, `~/.codex/`, or any OS surface
   (`../../../.claude/projects/<id>/memory/...`, `../../../../etc/passwd`). **Relative syntax does
   not redeem a per-user destination**: it looks repo-relative and fails for every reader other than
   the original author. No detection regex covers this shape — review is the only net.
3. **Hardcoded usernames or user-specific path segments** — platform flattened-project IDs of the
   form `-Users-<user>-...-<repo>` (Claude Code's per-user memory directory naming), embedded
   usernames, and author-home assumptions (`~/code/<user>/...`). Embedding such a segment
   anywhere — even inside an otherwise-relative path — couples the file to the original author's
   machine.

**The three permitted shapes:**

1. **Repo-relative paths** for in-repo content (from the repo root or a sibling file).
2. **Templated placeholders** for prose about per-user surfaces —
   `~/.claude/projects/<project>/memory/`, `~/.cursor/chats/`. The angle-bracketed placeholder
   signals a per-user/per-session segment that resolves differently on every machine. These are
   prose conventions, not clickable links: never author a markdown link to a templated destination,
   and markdown reference-style link definitions (`[label]: <url>`) pointing at user-specific
   destinations are forbidden outright — they evade the simpler inline-link review by hiding the
   URL at the bottom of the file.
3. **Platform-provided variables** for runtime-resolved paths in hook commands, settings files, and
   scripts (`${CLAUDE_PROJECT_DIR}/...`, `${WORKSPACE_FOLDER}/...`): a dynamic path rooted at a
   platform-provided project-root variable, which rejects both the bare-relative path (the cwd trap)
   and the literal absolute path (machine coupling). "Absolute" in this sense means fully-qualified
   at run time, never a literal. Never use a relative pseudo-path that happens to work in one
   environment when a platform variable is available.

**Detection.** Mechanically enforced twice over from one pattern set single-sourced in
`.agent/hooks/policy.json` (`preToolUseContent` → `machine-local-path`): the
`validate-no-machine-local-paths` validator scans every tracked file as a leg of `pnpm check`, and
the PreToolUse content hook blocks such paths at Edit/Write time. The patterns catch user-home roots
on all three OS families, flattened-project-ID segments, and the macOS private-temp and per-user
cache-folder roots (named here in words — the literals live fanged in the policy file only). Two
exemptions by construction, not by allowlist: portable system paths (`/usr/bin`,
`/opt/homebrew/bin`, generic `/tmp`) resolve identically everywhere and are not machine-local;
placeholder forms (`/Users/<user>/`) teach the pattern without the concrete segment the regexes
require. Excuses are not exceptions: no `eslint-disable` because a path "is fine on my machine", no
"fix path before merge" TODOs, no "it works locally" — "locally" is not the bar.

**Worked examples:**

1. **The originating bug (2026-04-29):** an active pattern-library file carried a markdown
   reference-style link into `../../../.claude/projects/-Users-<user>-...-<repo>/memory/...` — two
   failure modes at once: a `..` escape into the user home, and an embedded flattened-project ID
   with a username. Fix: replace the link with prose naming the file via the templated form
   `~/.claude/projects/<project>/memory/`.
2. **Research notes about per-user memory:** templated-placeholder prose
   (`~/.claude/projects/<project>/memory/MEMORY.md`) is correct; the same sentence with an embedded
   flattened ID, or as a clickable relative link into the user home, is forbidden.

## Public-history recovery

If private material reaches public history, stop publication work and conserve before removing
anything. The recovery set covers every local ref, the object database, reflogs and index;
tracked, staged, unstaged, untracked and ignored content; all worktrees and any external local
sources needed to reconstruct the state; pull-request records, synthetic merge refs and checks not
present in the local clone; and checksums, read-back, bundle verification and a fresh private
clone. Quiesce any multi-agent session before the final capture. Build the scrubbed replacement in
an isolated clone against the exact intended parent, scan it for the disclosed path and content
classes, run the complete gates, and sign the replacement commit. Move the public ref only with an
exact `--force-with-lease` naming the observed old head, then verify a fresh public clone, the
live pull request, regenerated CI and the absence of sensitive path families. A history rewrite
reduces ordinary reachability; it is not proof of server-side erasure. The exact recovery
inventory belongs only in a private custody record.

## This host's bindings

None recorded yet; the host records its own here.

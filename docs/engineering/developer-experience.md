# Developer Experience

What a developer sees and feels while working in this estate: the
session surfaces that carry information to you, the feedback loops that
answer your changes, and where each one is documented in depth. This
is the index and the statusline deep-dive; the practical
how-do-I-direct-the-work guide is
[Working with this Repo for Devs](working-with-this-repo-for-devs.md).

## The surfaces you work through

- **Your chat session** — the primary channel. Opening moves, directing
  the work, and what the agents do around your ask:
  [Working with this Repo for Devs](working-with-this-repo-for-devs.md).
- **The statusline** — the always-on glance surface at the bottom of a
  session. Covered in depth below; the Claude Code statusline is by far
  the most capable and the most complex.
- **Owner-attention cards** — decisions and actions that need a human
  land as visible cards at their action moment, never as ambient queue
  items buried in prose.
- **Pull requests and tickets** — the work's outward projection: PRs
  carry the change and its review; Linear tickets carry schedule state
  and point at repository knowledge, never replace it.

## The feedback loops that answer your changes

- **Quality gates** — `pnpm check` and the per-workspace gates;
  reference: [Build System](build-system.md) and
  [Tooling](tooling.md).
- **Hooks** — pre-commit and pre-push run the gate estate; policy hooks
  block known-hazardous operations with an explanation and a citation
  rather than failing silently.
- **Validators** — repo validators (plan corpus, collaboration state,
  design-system consistency, and friends) run in CI and pre-commit;
  reference: [Build System](build-system.md).
- **When something looks wrong** —
  [Troubleshooting](../operations/troubleshooting.md), including the
  statusline payload-diagnosis walkthrough referenced below.

## Statuslines

Statusline support varies widely by platform, and not every platform
renders one of its own: Claude Code runs the full adapter below, Cursor
reuses that same Claude adapter, Codex receives its identity as
SessionStart context rather than a live statusline, and
Gemini/Antigravity hook injection is not wired. The estate's identity
derivation (PDR-027 display names) is platform-shared — the same
session seed derives the same name everywhere — but what each platform
can _display_ ranges from a bare session title to the full Claude Code
glance surface below. The authoritative support matrix lives in
[agent-tools docs/agent-identity.md](../../agent-tools/docs/agent-identity.md).

### The Claude Code statusline

The most complex statusline in the estate: a multi-row glance surface
rendered by the built adapter
`agent-tools/dist/src/claude/statusline-identity.js`, invoked through
the project shim `.claude/scripts/statusline-identity.mjs` (wired in
`.claude/settings.json` `statusLine`, invoked both when the session's
UI state updates and on the fixed `refreshInterval` timer configured
beside it — the timer is what keeps countdowns moving in an idle
session).
Claude Code pipes a JSON payload to the command on every invocation; the
adapter renders what the payload and the repository's coordination
state support, and deliberately drops what is absent.

#### What the rows show

- **Identity row** — the session's derived agent name and join-key
  prefix, e.g. `Panther rides Midnight (7efb00)`, with coordination
  glyphs:
  - 🧭 — this session holds the Director seat (renders while the
    session's director-role claim is fresh in the collaboration
    registry);
  - 👪 / 🤝 / 🧍 — team shape: directed team / peers / confident solo;
  - 👀 — others are active and this session is not registered
    (be collision-aware);
  - 🪶 — a live ArcAngel rapid-comms channel involves this session.
- **Model and usage row** — the model name, then the usage gauges:
  `ctx:` (context-window %), `s:` (session / five-hour usage %), `w:`
  (weekly / seven-day usage %); the two rate-limit gauges append a
  reset countdown where the payload provides one (`ctx:` never carries
  one).
- **Git location rows** — two layouts. In the primary or a solo
  checkout, two rows: the checkout name, then its working branch. In a
  linked-worktree session, three rows: the primary checkout's name,
  the primary's branch prefixed `coord:` (context, non-bold), then the
  worktree's own name and working branch together — so the FIRST row
  in a worktree session names the primary, not the current checkout.
  The branch the session is on is the bold one, and a trailing `*` on
  it marks a dirty tree; a dim `e:<level>` reasoning-effort token
  (when the payload carries one) is appended to the row naming the
  current checkout — its name row in the two-row layout, the combined
  worktree row in the three-row layout.
  Location facts fail LOUD: an unexpected git error renders a visible
  token, never a silent fallback.
- **Owner-jobs segment** — a yellow `🔔` bell followed by the count of
  open owner-attention items, read from the owner-jobs register when
  present; rendered only when the count is non-zero (silence is the
  honest default), and linked only when the register carries a
  `link:` header.
- **The Oak logo column** — the acorn mark on the left (animated for
  the default style; see the controls below).

#### Why a segment may be absent

The adapter drops absent fields rather than rendering stale
placeholders (a genuine `0` is a value and renders as `0%`):

- The **session and weekly usage gauges** render only when the payload
  carries `rate_limits` — Claude Code includes it only for Claude.ai
  subscriber auth, only after the first model response in the session.
  Console API-key billing never populates it.
- The **Director demark and team glyphs** need the collaboration
  registry to be readable from the primary checkout, and the demark
  needs the session's own director-role claim to be fresh.
- **Cosmetic details** (dirty mark, worktree name, glyphs) degrade to
  absent on read failures; only the location facts fail loud.

#### Environment controls

Set per-machine in `.claude/settings.local.json` under `env`:

- `OAK_STATUSLINE_LOGO` — logo style: `braille-sharp` (default),
  `braille-sharp-compact`, `braille`, `quad`, `sextant`, or `none` to
  hide the logo column (the identity, model/usage, and location rows
  all still render).
- `OAK_STATUSLINE_MOTION` — set to `off`, `static`, `none`, or
  `reduce` (case-insensitive) to disable the logo animation cycle;
  other values leave motion on.
- `OAK_STATUSLINE_LOG_FILE` — the diagnosis log: a path ending `.log`
  makes the adapter append one timestamped line per invocation carrying
  the stdin payload as received (terminal line breaks stripped, interior
  line breaks collapsed to spaces, every other byte preserved); unset
  or blank means no logging, any other non-`.log` value renders a loud
  statusline warning even on payloads that otherwise render nothing, and
  write failures are swallowed (the statusline never breaks for its own
  diagnostics). The log grows unbounded and carries session ids and
  paths — delete it after the diagnosis. Walkthrough:
  [Troubleshooting §Statusline Segments Missing](../operations/troubleshooting.md#statusline-segments-missing-or-payload-diagnosis).

Quick reference (same controls, terser):
[agent-tools README §Claude statusline quick reference](../../agent-tools/README.md#claude-statusline-quick-reference).

### Other platforms

Cursor sessions derive the same identity through their platform hook
and can render the full Claude adapter — the same live glance rows —
after a one-time global activation
(`pnpm agent-tools:install-cursor-statusline`). Codex sessions receive
the derived identity as injected context through their SessionStart
hook; the Codex session title and statusline are user-owned host
surfaces the repository tooling does not populate (a user can apply
the name with Codex's own `/rename`). The current per-platform state,
including the Codex statusline item allowlist note, is tracked in
[agent-tools docs/agent-identity.md](../../agent-tools/docs/agent-identity.md).

## Further reading

- [Working with this Repo for Devs](working-with-this-repo-for-devs.md)
  — directing the work day to day.
- [Tooling](tooling.md) and [Build System](build-system.md) — the
  command and gate estate.
- [Troubleshooting](../operations/troubleshooting.md) — when a surface
  disagrees with you.

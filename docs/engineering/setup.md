# Setup

What a machine needs before the repository runs on it, the Windows (via WSL) path, and the
commands used day to day. With the prerequisites in place, continue with
[Install and verify](../../README.md#install-and-verify) in the root README.

## Prerequisites

On Windows, start at [Windows (via WSL)](#windows-via-wsl) — every prerequisite below
is installed inside WSL, never in PowerShell.

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), then run `nvm use` or `fnm use` to activate the version in `.nvmrc`
- **pnpm** — install via pnpm's [standalone script](https://pnpm.io/installation#using-a-standalone-script); it self-switches to the version pinned in `package.json`. The commit hooks resolve pnpm by absolute path from a fixed set of install locations, so a `corepack enable` shim under an nvm-managed Node is not found — if you already run pnpm from corepack, install the standalone launcher as well, and never re-point `PNPM_HOME` to make a gate run (pnpm derives its store root from it, and a re-pointed value rebinds every tree to a second store)
- **bash 5.2 or later** — every bash script this repository owns opens with a guard that stops an older bash with install advice, and the two secrets hooks block until it is met (macOS ships 3.2: `brew install bash` and put it first on `PATH`; Debian 12 or Ubuntu 24.04 and later: `sudo apt-get install bash`; older releases package 5.1 or lower and need a newer release or a source build). The wrapper the hooks run behind hands straight to the hook on an older bash, so the block still lands. Git hooks run under `sh` and carry no floor, and neither do the vendored skill scripts under `.agents/skills/`, which are upstream's bytes.
- **shellcheck 0.11.0** — the shell lint gate (`pnpm lint:shell`, run by pre-commit, pre-push, `pnpm check` and CI) runs the version `.agent/setup/install-shellcheck.sh` pins. `pnpm install` runs that script when it installs a new checkout or linked worktree, and it installs into the ignored `.tools/bin`, which the gate runs before any shellcheck on your `PATH`, on macOS and Linux, x86_64 and arm64. Run it yourself where the install warned that it could not, or in a checkout installed before the install ran it; it does nothing when the pinned version is already there
- **gh** — the [GitHub CLI](https://cli.github.com/), used by the repo's pull-request and agent tooling
- **bun** (optional, for `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:widget-in-host`) — install via [bun.sh](https://bun.sh/docs/installation)
- **lsof** (optional, for `apps/oak-curriculum-mcp-streamable-http/scripts/restart-dev-server.sh`) — pre-installed on macOS; on Debian/Ubuntu use `sudo apt install lsof`; source/build instructions at [github.com/lsof-org/lsof](https://github.com/lsof-org/lsof)
- **GNU `timeout`** (optional, for the agent-collaboration comms watcher's self-termination guard) — the canonical watcher is wrapped in `timeout`/`gtimeout` so a watcher whose agent has gone away cannot linger as an orphan process. macOS: `brew install coreutils` (GNU coreutils; the binary installs as `gtimeout`); Debian/Ubuntu and most Linux ship it with GNU coreutils as `timeout` (`sudo apt install coreutils` if missing). The watcher runs un-guarded if neither binary is on `PATH`, so it is needed only to enforce the dead-watcher cleanup (see [`comms-all-channels-watcher`](../../.agent/rules/comms-all-channels-watcher.md) and friction F-101).
- **sentry** (optional, for dev-time Sentry issue triage, event inspection,
  and Sentry Seer) — install only when you need local Sentry operator tooling;
  see [Sentry CLI usage](../operations/sentry-cli-usage.md) for the
  `sentry-cli` vs dev-`sentry` split and workspace invocation details.
- **Claude Code plugins** (Claude Code users) — the tracked
  [`.claude/settings.json`](../../.claude/settings.json) enables the project's plugins under
  `enabledPlugins`, and enabling a plugin does not install it. Install each one you use once, with
  `claude plugin install <entry> --scope project`, where `<entry>` is the key exactly as it appears
  in `enabledPlugins`. The part after `@` names the marketplace the plugin comes from: most are
  `@claude-plugins-official`, and some (the Elastic and Sentry CLI plugins) are
  `@anthropic-plugin-directory`. If Claude Code reports that it does not know a marketplace, add
  that marketplace first; Claude Code's plugin documentation gives the command.
  [MCP servers for contributors](mcp-servers-for-contributors.md) names the plugin for each
  sanctioned server.
- **MCPJam** (optional, for MCP server development and validation only) —
  inspects, runs conformance checks, and authors/runs evals against the MCP
  server; backs the optional `mcpjam` entry in `.mcp.json`. Installed
  by `pnpm install`; run commands with `pnpm exec mcpjam <command>`, the inspector
  GUI with `pnpm dlx @mcpjam/inspector@latest`, and authenticate for the hosted
  eval and project features with `pnpm exec mcpjam login`. The companion
  `mcp-inspector` skill installs at the machine level via
  `pnpm dlx skills add mcpjam/inspector --skill mcp-inspector`.

## Windows (via WSL)

Windows contributors work through [WSL2](https://learn.microsoft.com/windows/wsl/) —
inside it, every prerequisite above applies as written for Debian/Ubuntu. Steps 1-2
run in Windows PowerShell; steps 3-6 run inside Ubuntu. Requires Windows 11 (or
Windows 10 2004+) with virtualization enabled in firmware — if `wsl --install`
ends in error `0x80370102`, enable virtualization in your BIOS/UEFI first. The
steps below were run end to end on Windows 11 in August 2026.

1. **Install WSL and Ubuntu** — in an administrator PowerShell (right-click
   Start → Terminal (Admin)) run `wsl --install`, approve the elevation prompt,
   and create your Unix account when Ubuntu first launches (a reboot is only
   needed if the installer asks for one). Check: `wsl -l -v` in PowerShell lists
   Ubuntu with VERSION 2. The Ubuntu release must be 24.04 or later
   (`lsb_release -r` inside it): 22.04 packages bash 5.1, which stops at the
   bash 5.2 floor in [Prerequisites](#prerequisites).
2. **Cap the VM if the machine has 16 GB or less** — by default WSL2 may take up
   to half the machine's RAM with only a quarter of that as swap, and this
   repository's whole-tree gates can then be killed when the VM runs out of memory, or starve
   the Windows side (the symptom: Windows becomes unresponsive and `Vmmem`
   dominates Task Manager). Back in PowerShell, create the file
   (`notepad $env:USERPROFILE\.wslconfig`):

   ```ini
   [wsl2]
   memory=8GB
   processors=4
   swap=8GB
   ```

   Scale to your machine: cap `memory` at roughly half your RAM, `processors` at
   no more than your core count, and keep swap at least equal to memory so the
   gates page rather than die. Apply with `wsl --shutdown` (also from
   PowerShell) — this closes any running Ubuntu session; reopen it with `wsl ~`
   (the `~` starts you in the Linux home rather than under `/mnt/c`). Check: inside
   Ubuntu, `free -h` and `nproc` report the caps you set.

3. **Install the toolchain inside Ubuntu** — start with
   `sudo apt update && sudo apt install -y curl git ca-certificates`, then follow
   [Prerequisites](#prerequisites) above; every entry's Debian/Ubuntu
   instructions apply unchanged (for Node, run `nvm install 24` — the version
   `.nvmrc` pins; the repo is not cloned until step 6, so there is no
   `.nvmrc` for a bare `nvm install` to read yet, and `nvm use` inside the
   repo confirms the match after cloning; the shellcheck installer likewise
   waits for the clone, and runs in [Install and verify](../../README.md#install-and-verify)). Install pnpm per
   [Prerequisites](#prerequisites) — `curl -fsSL https://get.pnpm.io/install.sh | sh -`,
   then open a new shell or `source ~/.bashrc`; the standalone install at
   `~/.local/share/pnpm` is one of the trusted locations the hooks resolve pnpm
   from, and a corepack shim under nvm's Node directory is not, so a commit made
   with only that shim fails at the hook's pnpm resolution. Ubuntu's default
   package sources carry neither of the next two tools. First, the pre-push hook requires
   `gitleaks` — install the released
   binary with the same version and content pins CI uses, architecture-aware
   (gitleaks is a security control, so its binary is content-pinned, not just
   version-pinned; both digests below come from the official
   `gitleaks_8.30.0_checksums.txt`, and the x64 value is byte-identical to the
   pin in `.github/workflows/ci.yml`, "Install pinned gitleaks" — CI is where
   version and digest are kept current, so when CI bumps its pin, mirror it
   here):

   ```bash
   version=8.30.0
   case "$(dpkg --print-architecture)" in
     amd64) asset="gitleaks_${version}_linux_x64.tar.gz"
            expected=79a3ab579b53f71efd634f3aaf7e04a0fa0cf206b7ed434638d1547a2470a66e ;;
     arm64) asset="gitleaks_${version}_linux_arm64.tar.gz"
            expected=b4cbbb6ddf7d1b2a603088cd03a4e3f7ce48ee7fd449b51f7de6ee2906f5fa2f ;;
     *)     echo "unsupported architecture: $(dpkg --print-architecture)"; exit 1 ;;
   esac
   curl -sSfL --proto '=https' --proto-redir '=https' -o "$asset" \
     "https://github.com/gitleaks/gitleaks/releases/download/v${version}/${asset}"
   echo "${expected}  ${asset}" | sha256sum -c - &&
     sudo tar -C /usr/local/bin -xzf "$asset" gitleaks && rm "$asset"
   ```

   (The push secret scan runs gitleaks by absolute path and accepts it only at
   `/opt/homebrew/bin`, `/usr/local/bin` or `/usr/bin`, so an install anywhere
   else, such as `go install`'s `~/go/bin`, has to be symlinked into one of
   those.) Second, the repo's PR and agent
   tooling uses `gh` (the GitHub CLI), which installs from
   [GitHub's apt repository](https://github.com/cli/cli/blob/trunk/docs/install_linux.md).

   Check: `node -v && pnpm -v && gitleaks version && gh --version` all answer.

4. **Give pnpm network patience once** — WSL2's NAT (its network translation
   layer) can time out fetching large tarballs (`pnpm install` dies with
   `ETIMEDOUT` or `socket hang up`; you can set this after a failed install and
   simply re-run): `pnpm config set fetch-timeout 300000` and
   `pnpm config set fetch-retries 5`.
5. **Reuse Windows' stored git credentials — only if you already use Git for
   Windows.** The helper lives in one of two install layouts, all-users or per-user, each
   with an x64 and a Windows-on-ARM path, so find the one you have and configure
   that path:

   ```bash
   localappdata=$(wslpath "$(cmd.exe /c "echo %LOCALAPPDATA%" 2>/dev/null | tr -d '\r')" 2>/dev/null)
   helper=""
   for candidate in \
     "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe" \
     "/mnt/c/Program Files/Git/clangarm64/bin/git-credential-manager.exe" \
     "${localappdata}/Programs/Git/mingw64/bin/git-credential-manager.exe" \
     "${localappdata}/Programs/Git/clangarm64/bin/git-credential-manager.exe"; do
     [ -x "$candidate" ] && { helper="$candidate"; break; }
   done
   [ -n "$helper" ] && git config --global credential.helper "${helper// /\\ }"
   echo "${helper:-no Git for Windows credential helper found}"
   ```

   The first pair are all-users installs (x64, then Windows-on-ARM's
   `clangarm64` layout), the second pair per-user ones — resolved from the
   CURRENT user's `%LOCALAPPDATA%` itself (converted with `wslpath`), never
   globbed across every profile and never reconstructed from `%USERNAME%`:
   on a shared machine a glob can configure another user's helper, and an
   account rename can leave the profile directory differing from the
   username. Each candidate is checked executable before it is configured.
   If none exists you do not have Git for Windows: authenticate with
   `gh auth login` instead, and do not configure a helper path that is not
   there.

6. **Continue with [Install and verify](../../README.md#install-and-verify) in the README** from the
   Linux filesystem — `cd ~ && mkdir -p oak && cd oak` first, never under
   `/mnt/c`, where cross-boundary file access is an order of magnitude slower
   and `git clone` would otherwise land in your PowerShell working directory.
   On a capped VM, export the concurrency caps before running and keep them
   exported (in `~/.bashrc`), because every verify leg and the pre-push hook's
   whole-tree run are turbo runs: `export TURBO_CONCURRENCY=1` (add
   `export VITEST_MAX_WORKERS=2` if memory stays tight — the symptom of a
   starved suite: vitest reports 5000 ms timeouts, or the gate exits with no
   error text). After `pnpm install`, run `pnpm exec playwright install --with-deps chromium`
   once: the pre-push hook runs the browser suites, and `pnpm install` does not
   fetch browsers (CI installs them the same way).

## Key Commands

**Daily development:**

```bash
pnpm test           # Unit + integration tests
pnpm type-check     # Type-check all workspaces
pnpm lint           # Read-only lint verification
pnpm build          # Build all workspaces
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
```

**Widget development** (from `apps/oak-curriculum-mcp-streamable-http/`):

```bash
cd apps/oak-curriculum-mcp-streamable-http

pnpm dev:widget          # Standalone widget dev server with token live-reload
pnpm dev:widget-in-host  # Widget rendered inside MCP Apps basic-host (requires bun)
pnpm test:widget         # Widget unit + integration tests
pnpm test:widget:ui      # Playwright visual tests (light + dark themes)
pnpm test:widget:a11y    # Playwright axe-core WCAG 2.2 AA gate
```

**Full verification:**

```bash
pnpm make           # Full convenience pipeline with auto-fix steps; review file changes afterwards
pnpm check          # Canonical full verification gate: clean rebuild + tests + docs + format/lint verification; applies no fixes (repair with pnpm fix)
pnpm fix            # Auto-fix: format + markdownlint + lint
pnpm clean          # Remove build artefacts (dist/, .turbo)
```

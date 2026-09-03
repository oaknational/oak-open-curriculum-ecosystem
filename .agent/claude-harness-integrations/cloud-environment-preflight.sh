#!/bin/bash
# Claude cloud environment PREFLIGHT — read-only probe harness.
#
# Falsifies every external assumption cloud-environment-setup.sh makes, in
# one pass, without installing or mutating anything. Two run modes:
#
#   1. In-session: `bash .agent/claude-harness-integrations/cloud-environment-preflight.sh`
#      — checks the assumptions from inside a running session's network.
#   2. As a TEMPORARY environment script: paste this file in place of the
#      setup script and start a session. Setup-time egress differs from
#      in-session egress (worked instance 2026-08-23: the Trusted network
#      preset worked in-session but 403'd ppa.launchpadcontent.net at
#      setup), so only this mode tests what a real setup run will see.
#
# Every probe runs regardless of earlier failures; the summary lists every
# failed assumption, so one paste returns the complete falsification list
# instead of one finding per round-trip. Exit is non-zero when any probe
# fails — the session-start failure card then carries the list. A clean
# preflight pasted as the environment script exits 0 and starts a session
# on an UNPROVISIONED container: use that only for diagnosis, then paste
# the real setup script back.
#
# Contract: read-only. Probes write nothing outside a private mktemp -d
# directory (removed on exit) and install nothing — fixed predictable
# temp names would be symlink-followable and violate the
# machine-local-path invariant. Every external host the setup script contacts has a probe here;
# adding a host to the setup script without adding its probe in the same
# commit is drift (cloud-environment.md § Validating and diagnosing).
set -uo pipefail # deliberately NOT -e: every probe must run to the summary
shopt -s nullglob

PF_TMP=$(mktemp -d) || exit 1
trap 'rm -rf "${PF_TMP}"' EXIT

# value-synced with cloud-environment-setup.sh (and castr's supply-chain
# single source, .claude/hooks/_lib/gitleaks-pin.env); bump all together
GITLEAKS_VERSION=8.30.0
GITLEAKS_SHA256_LINUX_X64=79a3ab579b53f71efd634f3aaf7e04a0fa0cf206b7ed434638d1547a2470a66e

# every literal-URL fetch refuses a downgrade: the request AND any redirect
# hop must stay on https (Sonar S6506) — probes of operator-supplied URLs
# (apt sources, a custom registry) keep curl's default scheme handling
# because those values may legitimately be plain http. The option names are
# spelled out at every call site and only the value is shared, because the
# analyser matches the command text: an array expansion would hide them
HTTPS_ONLY='=https'

# URL userinfo must never reach the persisted failure card this output
# lands on: an apt source, proxy value, registry, or pre-signed tarball URL
# can embed credentials, and the scheme prefix is optional in proxy values
# (curl accepts user:token@proxy:8080), so strip userinfo with or without one.
# A query string or fragment can carry a token just as userinfo can (a
# pre-signed URL, a registry with ?token=), so both are dropped first — the
# diagnostics only ever need the host and path
USERINFO_STRIP_SED='s|^([a-zA-Z][a-zA-Z0-9+.-]*://)?[^@/]*@|\1|'
strip_userinfo() {
  local value="${1%%[?#]*}"
  echo "$value" | sed -E "$USERINFO_STRIP_SED"
  return 0
}

# repo discovery, shared by every per-repo probe: git checkouts under the
# cloud session's two workspace roots, excluding vendored trees; a Practice
# repo is identified by its committed Practice substrate plus a pnpm
# workspace — a lockfile alone is not identity (a plugin cache or stray
# clone with a pnpm-lock.yaml must not be provisioned or mutated)
list_git_repos() {
  find /home /workspace -maxdepth 4 -type d -name .git \
    -not -path '*/node_modules/*' 2>/dev/null | sed 's|/\.git$||'
  return 0
}
is_practice_repo() {
  local repo="$1"
  if [[ -f "$repo/pnpm-lock.yaml" && -f "$repo/.agent/directives/AGENT.md" ]]; then
    return 0
  fi
  return 1
}
list_practice_repos() {
  local repo
  for repo in $(list_git_repos); do
    is_practice_repo "$repo" && echo "$repo"
  done
  return 0
}
# per-repo probes cannot run without a discovered Practice repo; the skip
# is a FAIL (the discovery probe already named why), never a silent pass
require_practice_repo() {
  if [[ -n "$FIRST_REPO" ]]; then
    return 0
  fi
  echo "skipped: no Practice repo"
  return 1
}

PROBES=0
FAILURES=()
probe() {
  local name="$1"
  shift
  PROBES=$((PROBES + 1))
  echo ""
  echo "--- probe: ${name} ---"
  if "$@"; then
    echo "PASS: ${name}"
  else
    echo "FAIL: ${name}"
    FAILURES+=("${name}")
  fi
  return 0
}

# HTTP reachability with the measured egress discriminator (2026-08-24):
# a proxy denial fails the CONNECT tunnel itself, so curl EXITS NON-ZERO
# ("CONNECT tunnel failed, response 403", exit 56) — while an origin-served
# 403/404 completes the HTTP exchange and curl exits 0. Reachability is
# therefore judged by curl's exit status first; a completed exchange then
# still fails on 403/407/502 because every host_reachable target is a path
# the real setup fetches (a 403 there fails setup identically whoever
# served it). -L follows redirects — the probe invariant counts chains —
# and a failed curl still emits its own 000 via -w before exiting
# non-zero, so the status is captured first and normalised on failure,
# never appended to.
try_url() {
  # sets TRY_CODE; returns curl's own success/failure
  local url="$1"
  TRY_CODE=$(curl -sSL -o /dev/null -m 30 -w '%{http_code}' "$url" 2>/dev/null)
  local rc=$?
  TRY_CODE=${TRY_CODE:-000}
  return $rc
}
host_reachable() {
  local url="$1" display
  # display copy strips URL userinfo — an apt source or proxy URL can embed
  # credentials, and probe output lands on the persisted failure card
  display=$(echo "$url" | sed -E 's|([a-zA-Z][a-zA-Z0-9+.-]*://)?[^@/]*@|\1|')
  if try_url "$url" || {
    # one retry: a single transient transport failure must not falsify a
    # host (observed in-session 2026-08-24: one-off 000 from
    # security.ubuntu.com, 200 on every retry)
    try_url "$url"
  }; then
    echo "HTTP ${TRY_CODE}: ${display}"
    # only a final 2xx passes: every target here is a path the real setup
    # fetches with curl -f (or that apt must be able to consume), so any
    # HTTP error — 403 proxy or 404/500 origin alike — fails setup too
    case "$TRY_CODE" in
    2??) return 0 ;;
    *) return 1 ;;
    esac
  fi
  echo "TRANSPORT FAILURE (proxy CONNECT denial, DNS, or timeout; last code ${TRY_CODE}): ${display}"
  return 1
}

normalise_origin() {
  # corepack compares origins via new URL(...).origin, which lowercases
  # the scheme and host, drops userinfo, and omits a scheme-default port
  # — a raw string comparison would treat HTTPS://HOST:443 and
  # https://host as different origins and mis-scope the Bearer token
  local url="$1" scheme hostport
  scheme=$(echo "$url" | sed -E 's|^([a-zA-Z][a-zA-Z0-9+.-]*)://.*|\1|' | tr '[:upper:]' '[:lower:]')
  hostport=$(echo "$url" | sed -E 's|^[a-zA-Z][a-zA-Z0-9+.-]*://([^@/]*@)?([^/]+).*|\2|' | tr '[:upper:]' '[:lower:]')
  case "${scheme}:${hostport}" in
  https:*:443) hostport=${hostport%:443} ;;
  http:*:80) hostport=${hostport%:80} ;;
  *) ;;
  esac
  echo "${scheme}://${hostport}"
  return 0
}

FIRST_REPO=""
NODE_MAJOR=""

probe_vantage() {
  # informational — records the vantage point so a pasted run's card shows
  # what the builder container actually is
  echo "user: $(id 2>/dev/null || echo unknown)"
  echo "pwd: $(pwd)"
  echo "PATH: ${PATH}"
  # an authenticated proxy's credentials must never reach the persisted
  # failure card this output lands on; an unset value reads as "unset"
  redact_url() {
    local value="${1:-}"
    if [[ -z "$value" ]]; then
      echo "unset"
      return 0
    fi
    strip_userinfo "$value"
    return 0
  }
  # report the EFFECTIVE values under curl's precedence: lowercase wins,
  # and http_proxy exists only in lowercase — a card showing a variable
  # curl is not using would misidentify the network vantage
  echo "proxy (effective): https_proxy=$(redact_url "${https_proxy:-${HTTPS_PROXY:-}}") http_proxy=$(redact_url "${http_proxy:-}") all_proxy=$(redact_url "${all_proxy:-${ALL_PROXY:-}}") no_proxy=${no_proxy:-${NO_PROXY:-unset}}"
  local d
  for d in /opt/node*/bin; do echo "image node dir: ${d}"; done
  command -v node >/dev/null 2>&1 && echo "node on PATH: $(node --version 2>/dev/null)" || echo "no node on PATH"
  command -v git >/dev/null 2>&1 && echo "git on PATH: $(git --version 2>/dev/null)" || echo "no git on PATH"
  command -v curl >/dev/null 2>&1 || {
    echo "curl missing — every network probe below will fail"
    return 1
  }
}

probe_discovery() {
  local repos repo found=0
  repos=$(list_git_repos)
  [[ -n "$repos" ]] || {
    echo "no git repositories under /home or /workspace"
    return 1
  }
  for repo in $repos; do
    if is_practice_repo "$repo"; then
      echo "Practice repo: ${repo}"
      found=1
      [[ -n "$FIRST_REPO" ]] || FIRST_REPO="$repo"
    else
      echo "non-Practice repo (would be skipped): ${repo}"
    fi
  done
  [[ "$found" = 1 ]] || {
    echo "no Practice repo (pnpm-lock.yaml + .agent/directives/AGENT.md) found"
    return 1
  }
}

probe_hook_contract() {
  # exists-but-not-executable is the one hook state the setup script hard-fails on
  require_practice_repo || return 1
  local repo hook ok=0
  for repo in $(list_practice_repos); do
    hook="$repo/.agent/setup/cloud-session-setup.sh"
    if [[ -e "$hook" ]]; then
      if [[ -x "$hook" ]]; then
        echo "hook present and executable: ${hook}"
      else
        echo "hook exists but is NOT executable (setup would exit 1): ${hook}"
        ok=1
      fi
    else
      echo "no hook (benign): ${repo}"
    fi
  done
  return $ok
}

probe_git_origins() {
  # the setup script runs `git fetch --unshallow origin` in shallow Practice
  # repos — a blocked origin or unusable credentials must not hide behind a
  # clean summary; ls-remote is the read-only equivalent contact
  require_practice_repo || return 1
  local repo failed=0
  for repo in $(list_practice_repos); do
    # mirror the setup script's guard: it contacts origin only when the
    # clone is shallow, so probing a full clone's origin would falsify an
    # assumption setup never makes (and false-fail on an absent remote)
    if [[ "$(git -C "$repo" rev-parse --is-shallow-repository 2>/dev/null)" != "true" ]]; then
      echo "not shallow — setup contacts no origin here (skipped): ${repo}"
      continue
    fi
    # bounded and non-interactive: a hung remote or a credential helper
    # waiting for input must not stall the whole falsification pass
    if GIT_TERMINAL_PROMPT=0 timeout 30 git -C "$repo" ls-remote --heads origin >/dev/null 2>&1; then
      echo "origin reachable (shallow clone): ${repo}"
    else
      echo "origin UNREACHABLE (fetch --unshallow would fail): ${repo}"
      failed=1
    fi
  done
  return $failed
}

probe_session_hook_preflights() {
  # the universal preflight cannot know which hosts a repo's session hook
  # contacts (e.g. Playwright's download CDNs), so it delegates that
  # falsification the same way setup delegates the work: a repo whose hook
  # needs extra hosts commits the read-only twin
  # .agent/setup/cloud-session-preflight.sh beside it (the hook-preflight
  # contract); absence is the only benign skip
  require_practice_repo || return 1
  local repo pf failed=0
  for repo in $(list_practice_repos); do
    pf="$repo/.agent/setup/cloud-session-preflight.sh"
    if [[ -e "$pf" ]]; then
      if [[ ! -x "$pf" ]]; then
        echo "hook preflight exists but is NOT executable: ${pf}"
        failed=1
      # subshell rooted at the repo: the setup script cds into the repo
      # before invoking the session hook, so the hook-preflight twin gets
      # the same repo-root working-directory contract. Bounded like every
      # other probe — a hook preflight that hangs must become that repo's
      # failure, not swallow the summary (timeout exit 124 lands in the
      # FAILED branch)
      # the bound exceeds a hook's complete retry budget (two endpoints x
      # (30s attempt + 2s sleep + 30s retry) ~ 124s) plus margin, so a
      # slow-but-succeeding hook is never killed into a false failure
      elif (cd "$repo" && timeout --kill-after=10 180 ./.agent/setup/cloud-session-preflight.sh); then
        echo "hook preflight passed: ${repo}"
      else
        echo "hook preflight FAILED: ${repo}"
        failed=1
      fi
    else
      echo "no hook preflight (benign): ${repo}"
    fi
  done
  return $failed
}

probe_node_major() {
  require_practice_repo || return 1
  NODE_MAJOR=$(grep -o '"node"[: ]*"[^"]*"' "$FIRST_REPO/package.json" | grep -o '[0-9][0-9]*' | head -1 || true)
  NODE_MAJOR=${NODE_MAJOR:-24}
  echo "node major: ${NODE_MAJOR} (from ${FIRST_REPO}/package.json engines; default 24)"
}

probe_nodejs_org() {
  local major="${NODE_MAJOR:-24}" index tgz
  index=$(curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 60 "https://nodejs.org/dist/latest-v${major}.x/") || {
    echo "index fetch failed: https://nodejs.org/dist/latest-v${major}.x/"
    return 1
  }
  tgz=$(echo "$index" | grep -o "node-v${major}[0-9.]*-linux-x64.tar.gz" | head -1)
  [[ -n "$tgz" ]] || {
    echo "index fetched but no linux-x64 tarball name parsed from it"
    return 1
  }
  echo "tarball resolved: ${tgz}"
  curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 60 "https://nodejs.org/dist/latest-v${major}.x/SHASUMS256.txt" -o "${PF_TMP}/shasums.txt" || {
    echo "SHASUMS256.txt fetch failed"
    return 1
  }
  grep -q " ${tgz}\$" "${PF_TMP}/shasums.txt" || {
    echo "resolved tarball missing from SHASUMS256.txt"
    return 1
  }
  # download the archive and recompute its digest against the manifest —
  # the exact check setup performs (validators recompute, never just
  # record): a truncated or drifted archive must fail here, not only at
  # setup's sha256sum -c
  curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 300 "https://nodejs.org/dist/latest-v${major}.x/${tgz}" -o "${PF_TMP}/node.tgz" || {
    echo "tarball download failed"
    return 1
  }
  grep " ${tgz}\$" "${PF_TMP}/shasums.txt" |
    sed "s|  ${tgz}\$|  ${PF_TMP}/node.tgz|" | sha256sum -c -
}

check_repo_pnpm_pin() {
  # one repo's packageManager pin, downloaded and digest-recomputed the
  # way `corepack install` would fetch it in that repo
  local repo="$1" pm envfile="" has_envfile=0
  pm=$(grep -o '"packageManager"[: ]*"[^"]*"' "$repo/package.json" | sed -E 's/.*"packageManager"[: ]*"([^"]*)".*/\1/')
  [[ -n "$pm" ]] || {
    echo "no packageManager pin in ${repo}/package.json"
    return 1
  }
  case "$pm" in
  pnpm@*) ;;
  *)
    echo "unexpected packageManager (not pnpm) in ${repo}: ${pm}"
    return 1
    ;;
  esac
  # corepack resolves a per-project env file before installing (corepack
  # 0.34 source: path.resolve(currCwd, COREPACK_ENV_FILE ?? ".corepack.env");
  # "0" disables it): only COREPACK_* keys load, and the process
  # environment wins over the file
  if [[ "${COREPACK_ENV_FILE:-}" != "0" ]]; then
    case "${COREPACK_ENV_FILE:-}" in
    /*) envfile="${COREPACK_ENV_FILE}" ;;
    *) envfile="${repo}/${COREPACK_ENV_FILE:-.corepack.env}" ;;
    esac
    [[ -f "$envfile" ]] && has_envfile=1
  fi
  # identical pins across repos need verifying once, not re-downloading —
  # but only when the repo carries no corepack env file: an env file can
  # change the registry, auth, or network posture for the same pin, so
  # such a repo is always probed under its own effective environment
  if [[ "$has_envfile" = 0 ]]; then
    case " ${PNPM_PINS_SEEN} " in
    *" ${pm} "*)
      echo "pin already verified (${repo}): $(echo "${pm%%[+#]*}" | sed -E 's|^(pnpm@[a-zA-Z][a-zA-Z0-9+.-]*://)?[^@/]*@|\1|')"
      return 0
      ;;
    *) ;;
    esac
  fi
  # the env-dependent probe runs in a subshell so one repo's env file
  # never leaks into another repo's probe (corepack scopes it per project)
  (
    if [[ "$has_envfile" = 1 ]]; then
      echo "corepack env file loaded: ${envfile} (COREPACK_* keys only; process env wins)"
      corepack_load_repo_env "$envfile"
    fi
    check_repo_pin_download "$repo" "$pm"
  )
  local rc=$?
  # a pin joins the verified set only on SUCCESS — recording it up front
  # would label a failed pin "already verified" in the next repo
  if [[ "$rc" = 0 ]] && [[ "$has_envfile" = 0 ]]; then
    PNPM_PINS_SEEN="${PNPM_PINS_SEEN} ${pm}"
  fi
  return $rc
}

corepack_load_repo_env() {
  # mirror corepack's env-file semantics: parse KEY=VALUE lines, keep only
  # COREPACK_* keys, and let an already-set process variable win (corepack
  # spreads {...fileEntries, ...process.env}); one layer of matching
  # quotes is stripped the way util.parseEnv does
  local envfile="$1" line key val
  while IFS= read -r line || [[ -n "$line" ]]; do
    case "$line" in
    COREPACK_[A-Za-z0-9_]*=*) ;;
    *) continue ;;
    esac
    key=${line%%=*}
    if [[ "${!key+set}" != set ]]; then
      val=${line#*=}
      case "$val" in
      \"*\") val=${val#\"} && val=${val%\"} ;;
      \'*\') val=${val#\'} && val=${val%\'} ;;
      *) ;;
      esac
      export "${key}=${val}"
    fi
  done <"$envfile"
  return 0
}

verify_pin_digest() {
  # argument is "<algo>.<hex>" or empty (no digest declared); corepack
  # pins declare their algorithm (the npm dist.integrity digest
  # re-encoded as hex, or a URL pin's fragment) and the README's
  # canonical example is sha224 — dispatch on the declared algorithm,
  # never assume sha512
  local pin_hash="$1" algo expected computed
  if [[ -z "$pin_hash" ]]; then
    echo "packageManager pin carries no digest — download verified reachable, digest not pinned"
    return 0
  fi
  algo=${pin_hash%%.*}
  expected=${pin_hash#*.}
  if command -v "${algo}sum" >/dev/null 2>&1; then
    computed=$("${algo}sum" "${PF_TMP}/pnpm.tgz" | cut -d' ' -f1)
  elif command -v openssl >/dev/null 2>&1; then
    computed=$(openssl dgst "-${algo}" -r "${PF_TMP}/pnpm.tgz" 2>/dev/null | cut -d' ' -f1)
  else
    echo "no tool available to compute a ${algo} digest — pin cannot be verified"
    return 1
  fi
  [[ -n "$computed" ]] || {
    echo "computing the ${algo} digest failed (unsupported algorithm?)"
    return 1
  }
  if [[ "$computed" = "$expected" ]]; then
    echo "pnpm tarball ${algo} digest matches the packageManager pin"
  else
    echo "pnpm tarball ${algo} digest MISMATCH against the packageManager pin"
    return 1
  fi
}

check_repo_pin_download() {
  local repo="$1" pm="$2" version
  version=${pm#pnpm@}
  version=${version%%+*}
  # an env file can disable corepack's network access for this repo only —
  # the same refusal `corepack install` would hit in setup
  if [[ "${COREPACK_ENABLE_NETWORK:-1}" = "0" ]]; then
    echo "COREPACK_ENABLE_NETWORK=0 in effect for ${repo##*/}: corepack install cannot download the pinned pnpm on a fresh builder"
    return 1
  fi
  # mirror corepack's FINAL auth precedence (httpUtils.fetch, corepack
  # 0.34 source), which is truthiness-based and applied after the
  # metadata request's presence-based headers: a non-empty token wins as
  # Bearer; else a non-empty username OR password wins as Basic (an unset
  # partner interpolates as the literal string "undefined" in corepack's
  # template — mirrored faithfully); presence-only empty credentials
  # survive solely on the metadata request, where the initial
  # presence-based header is never overwritten
  local registry auth=() auth_kind=none meta tarball tarball_auth
  registry=${COREPACK_NPM_REGISTRY:-https://registry.npmjs.org}
  if [[ -n "${COREPACK_NPM_TOKEN:-}" ]]; then
    auth=(-H "Authorization: Bearer ${COREPACK_NPM_TOKEN}")
    auth_kind=bearer
  elif [[ -n "${COREPACK_NPM_USERNAME:-}" ]] || [[ -n "${COREPACK_NPM_PASSWORD:-}" ]]; then
    auth=(-H "Authorization: Basic $(printf '%s:%s' "${COREPACK_NPM_USERNAME-undefined}" "${COREPACK_NPM_PASSWORD-undefined}" | base64 | tr -d '\n')")
    auth_kind=basic
  elif [[ "${COREPACK_NPM_TOKEN+set}" = set ]]; then
    auth=(-H "Authorization: Bearer ")
    auth_kind=bearer-empty
  elif [[ "${COREPACK_NPM_USERNAME+set}" = set ]] && [[ "${COREPACK_NPM_PASSWORD+set}" = set ]]; then
    auth=(-H "Authorization: Basic $(printf ':' | base64 | tr -d '\n')")
    auth_kind=basic-empty
  fi
  # corepack accepts pnpm@<URL>[#<algo>.<hex>] only when the effective
  # environment (env file included) sets COREPACK_ENABLE_UNSAFE_CUSTOM_URLS=1
  # — otherwise `corepack install` rejects the pin with a UsageError, and
  # this probe fails the same way. The fragment is the declared digest,
  # the download URL is the reference minus its fragment, and no registry
  # metadata is involved (corepack 0.34 parseURLReference); download auth
  # follows the same httpUtils rules as the registry path
  case "$pm" in
  pnpm@*://*)
    if [[ "${COREPACK_ENABLE_UNSAFE_CUSTOM_URLS:-}" != "1" ]]; then
      echo "URL packageManager pin in ${repo##*/} without COREPACK_ENABLE_UNSAFE_CUSTOM_URLS=1 — corepack install rejects the pin outright"
      return 1
    fi
    tarball=${pm#pnpm@}
    local url_hash=""
    case "$tarball" in
    *#*)
      url_hash=${tarball#*#}
      tarball=${tarball%%#*}
      ;;
    *) ;;
    esac
    echo "pinned pnpm (${repo##*/}): custom URL pin"
    echo "tarball: $(strip_userinfo "${tarball%%[?#]*}")"
    tarball_auth=()
    case "$auth_kind" in
    basic) tarball_auth=("${auth[@]}") ;;
    bearer)
      if [[ "$(normalise_origin "$tarball")" = "$(normalise_origin "$registry")" ]]; then
        tarball_auth=("${auth[@]}")
      fi
      ;;
    *) ;;
    esac
    curl -fsSL -m 120 "${tarball_auth[@]}" "$tarball" -o "${PF_TMP}/pnpm.tgz" || {
      echo "custom-URL pnpm tarball download failed"
      return 1
    }
    verify_pin_digest "$url_hash"
    return $?
    ;;
  *) ;;
  esac
  echo "pinned pnpm (${repo##*/}): ${version} (registry: $(strip_userinfo "$registry"))"
  if [[ -z "${COREPACK_NPM_REGISTRY:-}" ]]; then
    tarball="https://registry.npmjs.org/pnpm/-/pnpm-${version}.tgz"
    case "$pm" in
    *+*.*)
      # a hashed pin on the default registry is the ONLY corepack path
      # with no metadata request: installVersion takes the static spec
      # URL and the post-download fetchTarballURLAndSignature call is
      # gated on the pin carrying no hash (corepack 0.34: `if (!build[1])`)
      echo "default registry: static tarball URL (hashed pin — corepack makes no metadata request)"
      ;;
    *)
      if [[ "${COREPACK_INTEGRITY_KEYS+set}" = set ]] &&
        { [[ -z "${COREPACK_INTEGRITY_KEYS}" ]] || [[ "${COREPACK_INTEGRITY_KEYS}" = "0" ]]; }; then
        echo "default registry: static tarball URL (hashless pin, integrity checking disabled — no metadata request)"
      else
        # a hashless pin with integrity checking enabled makes corepack
        # request the metadata AFTER the download, to verify the npm
        # registry signature — so the metadata endpoint is a real
        # dependency of this path too and gets the same probe; the
        # integrity presence check covers the one field this path reads
        meta=$(curl -fsSL -m 60 "${auth[@]}" "${registry%/}/pnpm/${version}") || {
          echo "registry metadata fetch failed (hashless pin: corepack requests it post-download for signature verification)"
          return 1
        }
        echo "$meta" | grep -q '"integrity"' || {
          echo "registry metadata carries no dist.integrity (hashless pin: corepack signature verification would fail)"
          return 1
        }
        echo "default registry: hashless pin — metadata probed (corepack verifies the registry signature post-download)"
      fi
      ;;
    esac
  else
    meta=$(curl -fsSL -m 60 "${auth[@]}" "${registry%/}/pnpm/${version}") || {
      echo "registry metadata fetch failed (the request corepack install makes first)"
      return 1
    }
    # parse the response as JSON and take exactly dist.tarball — a regex
    # returns still-escaped text (\/) curl rejects, or an unrelated
    # tarball key. python3 and the image node both predate our toolchain
    # install; the textual fallback is last-resort and unescapes slashes
    if command -v python3 >/dev/null 2>&1; then
      tarball=$(echo "$meta" | python3 -c 'import json,sys; print(json.load(sys.stdin)["dist"]["tarball"])' 2>/dev/null)
    elif command -v node >/dev/null 2>&1; then
      tarball=$(echo "$meta" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).dist.tarball))' 2>/dev/null)
    else
      tarball=$(echo "$meta" | grep -oE '"tarball":[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*"tarball":[[:space:]]*"([^"]+)".*/\1/' | sed 's|\\/|/|g')
    fi
    [[ -n "$tarball" ]] || {
      echo "no dist.tarball URL in registry metadata"
      return 1
    }
    # corepack rewrites a canonical default-registry tarball URL onto the
    # custom registry before downloading (installVersion:
    # url.replace(DEFAULT_NPM_REGISTRY_URL, COREPACK_NPM_REGISTRY), first
    # occurrence) — a proxy registry that returns upstream dist.tarball
    # URLs is downloaded from the proxy, never from registry.npmjs.org,
    # so probing the unrewritten URL would pass on a host corepack never
    # contacts; the rewrite runs before the auth-scoping below so the
    # bearer origin comparison sees the URL corepack actually fetches
    tarball=${tarball/"https://registry.npmjs.org"/${COREPACK_NPM_REGISTRY}}
  fi
  # display strips userinfo AND the query/fragment — a pre-signed tarball
  # URL can carry its credential in the query string
  echo "tarball: $(strip_userinfo "${tarball%%[?#]*}")"
  # mirror corepack's download-auth rules exactly: non-empty Basic
  # credentials go on EVERY request (httpUtils.fetch applies
  # username/password to all input URLs), the non-empty Bearer token is
  # origin-scoped — added only when the tarball origin equals the
  # registry origin — and presence-only empty credentials never reach
  # downloads (they exist only in the metadata request's initial headers)
  tarball_auth=()
  case "$auth_kind" in
  basic) tarball_auth=("${auth[@]}") ;;
  bearer)
    if [[ "$(normalise_origin "$tarball")" = "$(normalise_origin "$registry")" ]]; then
      tarball_auth=("${auth[@]}")
    fi
    ;;
  *) ;;
  esac
  curl -fsSL -m 120 "${tarball_auth[@]}" "$tarball" -o "${PF_TMP}/pnpm.tgz" || {
    echo "pinned pnpm tarball download failed"
    return 1
  }
  local pin_hash=""
  case "$pm" in
  *+*.*) pin_hash=${pm#*+} ;;
  *) ;;
  esac
  verify_pin_digest "$pin_hash"
}

probe_npm_registry() {
  # setup runs `corepack install` in EVERY discovered Practice repo, so
  # every repo's pin is probed (validate the full target estate), and a
  # registry ping proves nothing about the path corepack install takes
  require_practice_repo || return 1
  # corepack refuses all network access under COREPACK_ENABLE_NETWORK=0 —
  # on a fresh builder with an empty corepack cache, setup's
  # `corepack install` then aborts however reachable the tarball is
  if [[ "${COREPACK_ENABLE_NETWORK:-1}" = "0" ]]; then
    echo "COREPACK_ENABLE_NETWORK=0 is set: corepack install cannot download the pinned pnpm on a fresh builder"
    return 1
  fi
  PNPM_PINS_SEEN=""
  local repo failed=0
  for repo in $(list_practice_repos); do
    check_repo_pnpm_pin "$repo" || failed=1
  done
  # this probe proves the corepack/pnpm acquisition path only — setup's
  # `pnpm install` is the first exercise of each lockfile resolution, and
  # probing every dependency URL would download the full graphs here
  echo "bound: the repos' project dependency fetches (pnpm install's lockfile resolutions) are not probed"
  return $failed
}

probe_keyserver() {
  curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 60 "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xA1715D88E1DF1F24" \
    -o "${PF_TMP}/gitcore-key.asc" || {
    echo "key fetch failed from keyserver.ubuntu.com"
    return 1
  }
  grep -q "BEGIN PGP PUBLIC KEY BLOCK" "${PF_TMP}/gitcore-key.asc" || {
    echo "response is not a PGP public key block"
    return 1
  }
  echo "git-core PPA signing key fetched"
}

probe_git_core_ppa() {
  # fetch InRelease and verify its signature against the key the keyserver
  # probe fetched — setup relies on exactly that relationship (the key it
  # writes must verify the metadata apt then fetches), so two independent
  # payload checks would miss a rotated or revoked key
  curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 60 "https://ppa.launchpadcontent.net/git-core/ppa/ubuntu/dists/noble/InRelease" \
    -o "${PF_TMP}/gitcore-inrelease" || {
    echo "git-core PPA InRelease fetch failed"
    return 1
  }
  [[ -s "${PF_TMP}/gitcore-key.asc" ]] || {
    echo "signing key missing (keyserver probe runs first and must pass)"
    return 1
  }
  if command -v gpg >/dev/null 2>&1 && command -v gpgv >/dev/null 2>&1; then
    gpg --dearmor <"${PF_TMP}/gitcore-key.asc" >"${PF_TMP}/gitcore-keyring.gpg" 2>/dev/null || {
      echo "key dearmor failed"
      return 1
    }
    # classify by gpgv's machine-readable --status-fd lines, never by
    # exit code or localised prose: gpgv exits non-zero when ANY of the
    # file's signatures cannot be checked, and Launchpad InRelease files
    # carry a second signature from a key apt does not need
    # (ERRSIG/NO_PUBKEY tolerated — measured in-session 2026-08-24,
    # GOODSIG+VALIDSIG emitted alongside them); "Good signature" prose can
    # also accompany an expired key, which apt classifies as invalid, so
    # require GOODSIG and reject the expiry/revocation/bad statuses apt
    # rejects (EXPKEYSIG, REVKEYSIG, EXPSIG, BADSIG)
    gpgv --status-fd 3 --keyring "${PF_TMP}/gitcore-keyring.gpg" \
      "${PF_TMP}/gitcore-inrelease" >/dev/null 2>&1 3>"${PF_TMP}/gpgv-status" || true
    if grep -q "^\[GNUPG:\] GOODSIG" "${PF_TMP}/gpgv-status" &&
      ! grep -qE "^\[GNUPG:\] (EXPKEYSIG|REVKEYSIG|EXPSIG|BADSIG)" "${PF_TMP}/gpgv-status"; then
      echo "InRelease carries a good, unexpired signature from the fetched key"
    else
      echo "InRelease has NO acceptable signature from the fetched key (rotated, expired, or revoked?):"
      grep "^\[GNUPG:\]" "${PF_TMP}/gpgv-status" | tail -5
      return 1
    fi
  else
    # an unavailable verifier is a failed probe, not a silent downgrade —
    # a clean summary must never claim a relationship it could not check
    echo "gpg/gpgv unavailable — the key-to-metadata relationship setup relies on cannot be verified"
    return 1
  fi
  # metadata and signature only — resolving and fetching the git .deb
  # and its dependency archives would duplicate the install here; setup's
  # `apt-get install -y git` is the first exercise of those downloads
  echo "bound: the git package archives (apt-get install's .deb fetches) are not probed"
}

probe_base_image_apt_sources() {
  # the base image ships its own apt sources; one blocked host there breaks
  # every `apt-get update`, whatever this estate's script adds (worked
  # instance 2026-08-23: Trusted preset 403'd ppa.launchpadcontent.net)
  # parse only ACTIVE entries — `deb`/`deb-src` lines in one-line format and
  # URIs×Suites pairs in deb822 stanzas. A bare URL grep would also probe
  # hosts in comments (e.g. the stock sources file's help.ubuntu.com
  # pointer), which apt never contacts, and misattribute an unrelated block
  # to apt sources. Each pair probes the exact InRelease path `apt-get
  # update` fetches — roots and index pages are not what apt requests.
  local pairs url suite target inrelease_code failed=0
  pairs=$({
    awk '/^[[:space:]]*deb(-src)?[[:space:]]/ {
      for (i = 2; i <= NF; i++)
        if ($i ~ /^https?:\/\//) { print $i, $(i + 1); break }
    }' /etc/apt/sources.list /etc/apt/sources.list.d/*.list 2>/dev/null
    awk -v RS= '{
      uris = ""; suites = ""; enabled = ""; cur = ""
      n = split($0, lines, "\n")
      # deb822 field names are case-insensitive (apt accepts Uris:/URIS:),
      # so match on a lowercased copy and slice the value from the
      # original; an indented line is a folded continuation of the field
      # above it and its values count too
      for (i = 1; i <= n; i++) {
        if (lines[i] ~ /^[ \t]/ && cur != "") {
          val = lines[i]; sub(/^[ \t]+/, "", val)
          if (cur == "uris") uris = uris " " val
          else if (cur == "suites") suites = suites " " val
          continue
        }
        if (match(tolower(lines[i]), /^uris:[[:space:]]*/)) { uris = substr(lines[i], RLENGTH + 1); cur = "uris" }
        else if (match(tolower(lines[i]), /^suites:[[:space:]]*/)) { suites = substr(lines[i], RLENGTH + 1); cur = "suites" }
        else if (match(tolower(lines[i]), /^enabled:[[:space:]]*/)) { enabled = tolower(substr(lines[i], RLENGTH + 1)); cur = "" }
        else cur = ""
      }
      # a stanza with Enabled: no is ignored by apt — probing it would
      # falsify an assumption apt-get update never makes
      if (uris != "" && suites != "" && enabled !~ /^(no|false)/) {
        nu = split(uris, ua, " "); ns = split(suites, sa, " ")
        for (u = 1; u <= nu; u++)
          for (s = 1; s <= ns; s++) print ua[u], sa[s]
      }
    }' /etc/apt/sources.list.d/*.sources 2>/dev/null
  } | sort -u)
  [[ -n "$pairs" ]] || {
    echo "no active apt source entries found on image (unexpected but not a network failure)"
    return 0
  }
  while read -r url suite; do
    [[ -n "$url" ]] && [[ -n "$suite" ]] || continue
    # an exact-path suite (trailing slash) gets no dists/ segment — apt
    # fetches <url>/<suite>InRelease for those, <url>/InRelease for "./"
    case "$suite" in
    ./) target="${url%/}" ;;
    */) target="${url%/}/${suite%/}" ;;
    *) target="${url%/}/dists/${suite}" ;;
    esac
    # apt falls back to Release + Release.gpg when a repository publishes
    # no InRelease — and rejects an unsigned Release, so the fallback is
    # usable only when BOTH fallback files answer.
    # apt-get update's exit then depends on HOW the metadata failed
    # (both cases measured in-session 2026-08-24): a transport-level
    # failure (unreachable host, proxy CONNECT denial) is a W: warning
    # and exit 0 — reported here but never fatal — while a definitive
    # HTTP error response on an active source's metadata is an E: error
    # and exit 100, which aborts provisioning, so that case fails the
    # probe. The InRelease outcome decides the class: a completed
    # exchange with an error code is the fatal shape, code 000 is
    # transport
    if ! host_reachable "${target}/InRelease"; then
      inrelease_code=$TRY_CODE
      if host_reachable "${target}/Release" && host_reachable "${target}/Release.gpg"; then
        echo "no InRelease but signed Release (+ Release.gpg) present — apt's fallback succeeds here"
      elif [[ "$inrelease_code" = "000" ]]; then
        echo "WARNING: source transport-unreachable — apt-get update warns (exit 0) and setup continues"
      else
        echo "active source answers HTTP ${inrelease_code} for its metadata — apt-get update exits non-zero on this and setup aborts"
        failed=1
      fi
    fi
  done <<< "$pairs"
  return $failed
}

probe_gitleaks_release() {
  # release assets redirect to a separate assets host (measured 2026-08-24:
  # release-assets.githubusercontent.com) — the redirect target needs its own
  # egress allowance and never appears in the script text, so always probe
  # the effective URL, never just the named host. The asset is downloaded in
  # full and its digest recomputed against the pin (validators must
  # recompute, not just record): a reachable URL carrying a drifted payload
  # or a stale pin would otherwise pass here and fail setup at sha256sum -c.
  # The fetch carries the same https-only constraint as setup's, so a
  # downgrade hop in the chain fails here first instead of in setup
  local url="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
  local final
  final=$(curl -fsSL --proto "$HTTPS_ONLY" --proto-redir "$HTTPS_ONLY" -m 120 -w '%{url_effective}' "$url" -o "${PF_TMP}/gitleaks.tgz" 2>/dev/null) || {
    echo "download failed (redirect chain or egress): ${url}"
    # curl reports the last URL it attempted even on failure — when the
    # blocked hop is the redirect target, the failure card must name
    # that host (it never appears in the script text), or the reader
    # cannot know what to allow-list
    if [[ -n "$final" ]] && [[ "$final" != "$url" ]]; then
      echo "last attempted URL in the chain (allow-list this host): $(strip_userinfo "${final%%[?#]*}")"
    fi
    return 1
  }
  echo "redirect chain ends at host: $(echo "$final" | sed -E 's|https?://([^/]+).*|\1|')"
  echo "${GITLEAKS_SHA256_LINUX_X64}  ${PF_TMP}/gitleaks.tgz" | sha256sum -c -
}

echo "=== CLOUD ENVIRONMENT PREFLIGHT (read-only) ==="
probe "vantage point" probe_vantage
probe "repo discovery" probe_discovery
probe "session hook contract" probe_hook_contract
probe "git origin remotes (unshallow contact)" probe_git_origins
probe "session hook preflights (repo-declared hosts)" probe_session_hook_preflights
probe "node major resolution" probe_node_major
probe "nodejs.org index + SHASUMS + tarball" probe_nodejs_org
probe "registry.npmjs.org (corepack/pnpm)" probe_npm_registry
probe "keyserver.ubuntu.com (PPA key)" probe_keyserver
probe "ppa.launchpadcontent.net (git-core PPA)" probe_git_core_ppa
probe "base-image apt source hosts" probe_base_image_apt_sources
probe "gitleaks release asset (redirect chain)" probe_gitleaks_release

echo ""
echo "=== PREFLIGHT SUMMARY: $((PROBES - ${#FAILURES[@]}))/${PROBES} probes passed ==="
if [[ ${#FAILURES[@]} -gt 0 ]]; then
  for f in "${FAILURES[@]}"; do echo "FAILED ASSUMPTION: ${f}"; done
  exit 1
fi
echo "every probed assumption holds from this vantage point (each 'bound:' line above names what was deliberately not proven)"

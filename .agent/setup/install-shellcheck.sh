#!/usr/bin/env bash
# Install the shellcheck that the root `lint:shell` gate runs, pinned by
# version and by the sha256 of each host's release asset and of the binary in
# it, into this repository's own .tools/bin (ignored by git). CI
# (.github/workflows/ci.yml), the cloud session hook (cloud-session-setup.sh
# beside this file) and the root postinstall bootstrap outside CI and Vercel
# all install it here. The run is a no-op when .tools/bin/shellcheck already
# has the pinned binary's sha256, and nothing there runs before its sha256 is
# checked. The gate runs .tools/bin/shellcheck
# before any shellcheck on PATH, so a checkout never shares the binary with
# another repository's pin. shellcheck versions differ in what they report, so
# the pin lives here once: the gate reads SHELLCHECK_VERSION from this file and
# fails when the shellcheck it runs is another version. Moving the pin means
# changing the version and every digest together: each archive digest
# recomputed from a download and cross-checked against the `digest` GitHub's
# release API records for that asset, and each binary digest recomputed from
# the binary extracted from that checked archive.
#
# Usage: install-shellcheck.sh

# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian 12 or Ubuntu 24.04 and later) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail

SHELLCHECK_VERSION=0.11.0

if [[ $# -ne 0 ]]; then
  echo "usage: install-shellcheck.sh (it takes no arguments; it installs into .tools/bin)" >&2
  exit 2
fi
repo_root="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
bin_dir="${repo_root}/.tools/bin"

host="$(uname -s) $(uname -m)"
case "$host" in
  "Linux x86_64")
    asset=linux.x86_64
    sha256=b7af85e41cc99489dcc21d66c6d5f3685138f06d34651e6d34b42ec6d54fe6f6
    binary_sha256=4da528ddb3a4d1b7b24a59d4e16eb2f5fd960f4bd9a3708a15baddbdf1d5a55b
    ;;
  "Linux aarch64")
    asset=linux.aarch64
    sha256=68a8133197a50beb8803f8d42f9908d1af1c5540d4bb05fdfca8c1fa47decefc
    binary_sha256=127f13925eadd52c341bca0ebaf9ab0dbd78c6468f30a8f262a528bf8de47546
    ;;
  "Darwin x86_64")
    asset=darwin.x86_64
    sha256=c2c15e08df0e8fbc374c335b230a7ee958c313fa5714817a59aa59f1aa594f51
    binary_sha256=2589be755bb115f4421b8271eb7c08df1e03729f00350c1e4cf53b4a0bf9c2df
    ;;
  "Darwin arm64")
    asset=darwin.aarch64
    sha256=339b930feb1ea764467013cc1f72d09cd6b869ebf1013296ba9055ab2ffbd26f
    binary_sha256=61c17246d69f012cd458ae82f244c46023dac75d1b69733ca1cc7d28fb270fd7
    ;;
  *)
    echo "install-shellcheck: no pinned shellcheck asset for ${host}" >&2
    exit 1
    ;;
esac

# The sha256 of a file, by whichever tool the host has.
sha256_of() {
  if command -v sha256sum > /dev/null 2>&1; then
    sha256sum "$1" | cut -d ' ' -f 1
  else
    shasum --algorithm 256 "$1" | cut -d ' ' -f 1
  fi
}

# Nothing to fetch when the pinned binary is already installed: every
# `pnpm install` runs this. The binary is known by its sha256, never by
# what it says about itself, so nothing at .tools/bin runs unverified.
if [[ -x "${bin_dir}/shellcheck" ]] &&
  [[ "$(sha256_of "${bin_dir}/shellcheck")" == "${binary_sha256}" ]]; then
  echo "install-shellcheck: shellcheck ${SHELLCHECK_VERSION} is already in .tools/bin"
  exit 0
fi

# Anything else at .tools/bin/shellcheck goes before the fetch: a failed
# install then leaves no binary for the gate to accept by its version, so the
# gate refuses and names this script.
rm -f "${bin_dir}/shellcheck"

# The download and the extract live in a directory beside .tools/bin, so the
# checked binary moves into place by rename and nothing half-made is there.
mkdir -p "${repo_root}/.tools"
work="$(mktemp -d "${repo_root}/.tools/install-shellcheck.XXXXXX")"
trap 'rm -f "${work}/archive.tar.gz" "${work}/shellcheck"; rmdir "$work" 2> /dev/null || true' EXIT
archive="${work}/archive.tar.gz"

# https only, on the request and on every redirect hop; the asset redirects
# to release-assets.githubusercontent.com, the host gitleaks' asset uses.
# The connect and retry caps bound a dead network's wait inside `pnpm install`.
curl --fail --location --silent --show-error --max-time 60 --connect-timeout 10 \
  --retry 3 --retry-max-time 90 --retry-connrefused --proto '=https' --proto-redir '=https' \
  "https://github.com/koalaman/shellcheck/releases/download/v${SHELLCHECK_VERSION}/shellcheck-v${SHELLCHECK_VERSION}.${asset}.tar.gz" \
  --output "$archive"

# The digest is checked before anything is extracted.
if [[ "$(sha256_of "$archive")" != "${sha256}" ]]; then
  echo "install-shellcheck: the downloaded ${asset} archive does not match its pinned sha256" >&2
  exit 1
fi

# The binary is owned by whoever runs the install, root included.
tar --extract --gzip --no-same-owner --file "$archive" --directory "$work" \
  --strip-components=1 "shellcheck-v${SHELLCHECK_VERSION}/shellcheck"
if [[ "$(sha256_of "${work}/shellcheck")" != "${binary_sha256}" ]]; then
  echo "install-shellcheck: the extracted shellcheck does not match its pinned binary sha256; recompute the pin" >&2
  exit 1
fi
mkdir -p "$bin_dir"
mv "${work}/shellcheck" "${bin_dir}/shellcheck"
"${bin_dir}/shellcheck" --version

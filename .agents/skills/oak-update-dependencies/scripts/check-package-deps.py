#!/usr/bin/env python3
"""Check or refresh package.json dependencies.

Supports npm, pnpm, and yarn lockfile/commands in a
package-manager-aware way.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Dict, List


ROOT_HELP = "Project root directory. Defaults to the current working directory."

MANAGER_COMMANDS = {
    "npm": {
        "outdated": ["npm", "outdated", "--json", "--depth=0"],
        "apply": ["npm", "update"],
        "apply_major": ["npx", "npm-check-updates", "-u"],
        "post_apply": ["npm", "install"],
    },
    "pnpm": {
        "outdated": ["pnpm", "outdated", "--json"],
        "apply": ["pnpm", "up"],
        "apply_major": ["pnpm", "up", "--latest"],
    },
    "yarn": {
        "outdated": ["yarn", "outdated", "--json"],
        "apply": ["yarn", "upgrade"],
        "apply_major": ["yarn", "upgrade", "--latest"],
    },
}


def run_command(
    command: List[str],
    cwd: Path,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=str(cwd),
        text=True,
        capture_output=True,
        check=False,
    )


def detect_package_manager(project_root: Path, package_json: Dict[str, object]) -> str:
    pm_field = str(package_json.get("packageManager", "")).strip()
    if pm_field:
        base_pm = pm_field.split("@", 1)[0].strip().lower()
        if base_pm in MANAGER_COMMANDS:
            return base_pm

    lock_priority = [
        ("pnpm", project_root / "pnpm-lock.yaml"),
        ("yarn", project_root / "yarn.lock"),
        ("npm", project_root / "package-lock.json"),
        ("npm", project_root / "npm-shrinkwrap.json"),
    ]
    for manager, marker in lock_priority:
        if marker.exists():
            return manager

    for manager in ("pnpm", "yarn", "npm"):
        if shutil.which(manager):
            return manager

    return "npm"


def parse_outdated_payload(manager: str, text: str) -> List[Dict[str, str]]:
    text = (text or "").strip()
    if not text:
        return []

    if manager == "yarn":
        items: List[Dict[str, str]] = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue

            data = obj.get("data")
            if not isinstance(data, list):
                continue

            if obj.get("type") != "table" or len(data) < 2:
                continue

            header = [str(cell).lower() for cell in data[0]]
            for row in data[1:]:
                if not isinstance(row, list) or len(row) < 4:
                    continue
                row_map = {
                    header[idx]: str(row[idx])
                    for idx in range(min(len(header), len(row)))
                }
                name = row_map.get("package") or row_map.get("name")
                if not name:
                    continue
                items.append(
                    {
                        "name": name,
                        "current": row_map.get("current", ""),
                        "wanted": row_map.get("wanted", ""),
                        "latest": row_map.get("latest", ""),
                        "dependencyType": row_map.get(
                            "type", row_map.get("dependencytype", "")
                        ),
                    }
                )
        return items

    try:
        raw = json.loads(text)
    except json.JSONDecodeError:
        return []

    if isinstance(raw, list):
        return [
            {
                "name": str(item.get("name", "")),
                "current": str(item.get("current", "")),
                "wanted": str(item.get("wanted", "")),
                "latest": str(item.get("latest", "")),
                "dependencyType": str(
                    item.get("dependencyType", item.get("type", ""))
                ),
            }
            for item in raw
            if isinstance(item, dict) and item.get("name")
        ]

    if isinstance(raw, dict):
        return [
            {
                "name": name,
                "current": str(info.get("current", "")),
                "wanted": str(info.get("wanted", "")),
                "latest": str(info.get("latest", "")),
                "dependencyType": str(info.get("type", info.get("dependencyType", ""))),
            }
            for name, info in raw.items()
            if isinstance(info, dict)
        ]

    return []


def print_human_report(manager: str, records: List[Dict[str, str]]) -> int:
    if not records:
        print(f"[OK] No outdated dependencies found for {manager}.")
        return 0

    print(f"[WARN] Found {len(records)} outdated dependencies for {manager}.")
    print("name\tcurrent\twanted\tlatest\tdependencyType")
    for item in records:
        print(
            f"{item['name']}\t{item['current']}\t{item['wanted']}\t{item['latest']}\t{item['dependencyType']}"
        )
    return 1


def output_report_json(
    root: Path,
    manager: str,
    records: List[Dict[str, str]],
    apply_mode: bool,
) -> None:
    payload = {
        "path": str(root),
        "manager": manager,
        "applyMode": apply_mode,
        "outdatedCount": len(records),
        "outdated": records,
    }
    print(json.dumps(payload, indent=2))


class OutdatedCommandFailed(RuntimeError):
    """The outdated command itself failed, so no report can be read from it."""


def run_outdated_check(manager: str, root: Path) -> List[Dict[str, str]]:
    command = MANAGER_COMMANDS[manager]["outdated"]
    result = run_command(command, cwd=root)
    # Exit 0 means nothing outdated and exit 1 means something is, for every
    # manager here; any other code (a registry outage, a refused login) is a
    # failed command, never an empty report.
    if result.returncode not in (0, 1):
        sys.stderr.write(result.stderr)
        raise OutdatedCommandFailed(
            f"{' '.join(command)} exited {result.returncode}; the report cannot be read"
        )
    return parse_outdated_payload(manager, result.stdout)


def apply_updates(manager: str, root: Path, major: bool) -> int:
    cmds = (
        MANAGER_COMMANDS[manager]["apply_major"]
        if major
        else MANAGER_COMMANDS[manager]["apply"]
    )

    completed = run_command(cmds, cwd=root)
    if completed.returncode != 0:
        return completed.returncode

    post_cmd = MANAGER_COMMANDS[manager].get("post_apply")
    if post_cmd:
        completed = run_command(post_cmd, cwd=root)
        if completed.returncode != 0:
            return completed.returncode
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", nargs="?", default=".", help=ROOT_HELP)
    parser.add_argument("--json", action="store_true", help="Output JSON report.")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Run safe, semver-constrained updates for the detected package manager.",
    )
    parser.add_argument(
        "--major",
        action="store_true",
        help="Include major updates where supported.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.path).resolve()

    package_json_path = root / "package.json"
    if not package_json_path.exists():
        sys.stderr.write(f"[ERROR] package.json not found at {package_json_path}\n")
        return 2

    package_json = json.loads(package_json_path.read_text(encoding="utf-8"))
    manager = detect_package_manager(root, package_json)
    # Status lines go to stderr so `--json` leaves stdout as the one JSON document.
    sys.stderr.write(f"[INFO] Detected package manager: {manager}\n")

    if not shutil.which(manager):
        sys.stderr.write(f"[ERROR] {manager} CLI not found on PATH.\n")
        return 2

    try:
        records = run_outdated_check(manager, root)
    except OutdatedCommandFailed as failure:
        sys.stderr.write(f"[ERROR] {failure}\n")
        return 2

    if args.json:
        output_report_json(root, manager, records, args.apply)

    exit_code = (
        print_human_report(manager, records) if not args.json else (0 if not records else 1)
    )

    if args.apply:
        if args.major and manager == "npm":
            ncu_path = shutil.which("npx")
            if not ncu_path:
                sys.stderr.write(
                    "[ERROR] npx is required for npm major upgrades in this mode.\n"
                )
                return 2

        if not records:
            sys.stderr.write("[INFO] Nothing to apply.\n")
            return 0

        update_code = apply_updates(manager, root, args.major)
        if update_code != 0:
            sys.stderr.write(f"[ERROR] Update command failed with code {update_code}.\n")
            return update_code
        sys.stderr.write(f"[OK] Applied updates using {manager}.\n")
        # The outdated records were the reason to apply; applied, they are no
        # longer a failure to report.
        return 0

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""The agent tooling's IO census (practice-work-finish, end state 4): every test, helper or setup
file under agent-tools/ at a git ref that touches the filesystem, a process, the network or the
clock, by the no-IO node's own grep categories (the node's census greps raw text, so a file that
carries a banned import as a string fixture counts; the census sizes the conversion and is never
its acceptance proof). Prints a Markdown report with the four category counts and one row per
offender. usage: io_census.py <estate-label> <repo-root> <ref> <out-file>"""
import re
import subprocess
import sys

label, root, ref, out = sys.argv[1:5]

CATS = [
    ("filesystem", re.compile(r"from ['\"]node:fs|node:fs/promises|mkdtemp|tmpdir\(")),
    ("process", re.compile(r"node:child_process|\bspawn\(|execFile|execa")),
    ("network", re.compile(r"node:net|node:http|\blisten\(|fetch\(['\"]https?://(localhost|127\.0\.0\.1)")),
    ("clock", re.compile(r"Date\.now\(|new Date\(\)|performance\.now\(|setTimeout\(|setInterval\(")),
]
# In scope: test files by suffix anywhere under agent-tools/; test helpers and test directories;
# and every TypeScript file directly under agent-tools/smoke-tests/, since the smoke fixtures and
# support modules there carry no .smoke.ts suffix and are part of the conversion.
IN_SCOPE = re.compile(
    r"^agent-tools/.*(\.test\.tsx?|\.smoke\.ts|\.e2e\.test\.ts|\.setup\.ts|test\.setup[^/]*\.ts)$|"
    r"^agent-tools/.*/test-helpers/.*\.tsx?$|^agent-tools/.*/tests?/.*\.tsx?$|"
    r"^agent-tools/smoke-tests/[^/]+\.tsx?$"
)


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, check=True).stdout


head = git("rev-parse", "--short=9", ref).strip()
files = [f for f in git("ls-tree", "-r", "--name-only", ref).split("\n") if IN_SCOPE.match(f)]
rows = []
counts = {c: 0 for c, _ in CATS}
for f in sorted(files):
    text = git("show", f"{ref}:{f}")
    hits = [c for c, rx in CATS if rx.search(text)]
    if hits:
        rows.append((f, hits))
        for c in hits:
            counts[c] += 1

lines = [
    f"## {label} at SHA:{head}",
    "",
    f"Files in scope (tests, smokes, end-to-end tests, setup files, test helpers and the smoke "
    f"fixtures under `agent-tools/`): "
    f"{len(files)}. Offenders: {len(rows)}. By category (a file counts in each it touches): "
    + ", ".join(f"{c} {n}" for c, n in counts.items()) + ".",
    "",
    "| File | filesystem | process | network | clock |",
    "| --- | --- | --- | --- | --- |",
]
for f, hits in rows:
    cells = " | ".join("yes" if c in hits else "" for c, _ in CATS)
    lines.append(f"| `{f}` | {cells} |")
lines.append("")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print(f"{label} {head}: in scope {len(files)}, offenders {len(rows)}, " + ", ".join(f"{c} {n}" for c, n in counts.items()))

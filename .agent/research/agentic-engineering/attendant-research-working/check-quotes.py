"""Fixed-string check of every double-quoted span in a file against the repository.

Usage: python3 check-quotes.py <file> [<file> ...]
A span passes when it occurs, whitespace-normalised, in some tracked file other
than the files being checked. The working folder is excluded, except its
file of sentences copied from external documentation. Spans under 25 characters are skipped as too short
to identify a source. The check shows a span exists somewhere in the sources; it does
not show which source a sentence attributes it to. A source that cannot be read stops the run.
"""
import re
import subprocess
import sys

targets = sys.argv[1:]
tracked = subprocess.run(
    ["git", "ls-files", ".agent", "agent-tools/README.md"], capture_output=True, text=True
).stdout.split("\n")
EXTERNAL = ".agent/research/agentic-engineering/attendant-research-working/external-sources.md"
if EXTERNAL not in tracked:
    tracked.append(EXTERNAL)
skip = set(targets) | {t.lstrip("./") for t in targets}
corpus = {}
for path in tracked:
    if not path or path in skip:
        continue
    if "attendant-research-working" in path and not path.endswith("external-sources.md"):
        continue
    if not path.endswith((".md", ".txt")):
        continue
    try:
        with open(path, encoding="utf-8") as handle:
            corpus[path] = re.sub(r"\s+", " ", handle.read())
    except (OSError, UnicodeDecodeError) as error:
        sys.exit(f"cannot read source {path}: {error}")

failed = 0
for target in targets:
    with open(target, encoding="utf-8") as handle:
        text = re.sub(r"\s+", " ", handle.read())
    for span in re.findall(r'"([^"]*)"', text):
        if len(span) < 25:
            continue
        probe = span.rstrip(".,;:")
        hits = [p for p, body in corpus.items() if probe in body]
        if hits:
            print(f"ok   {probe[:60]!r} <- {hits[0]}")
        else:
            failed += 1
            print(f"FAIL {probe!r}")
print(f"{failed} failed")
sys.exit(1 if failed else 0)

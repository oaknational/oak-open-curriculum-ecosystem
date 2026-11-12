"""Fixed-string check of every double-quoted span in a file against the repository.

Usage: python3 check-quotes.py <file> [<file> ...]
A span passes when it occurs, whitespace-normalised, in some tracked file other
than the files being checked. Spans under 25 characters are skipped as too short
to identify a source.
"""
import re
import subprocess
import sys

targets = sys.argv[1:]
tracked = subprocess.run(["git", "ls-files", ".agent"], capture_output=True, text=True).stdout.split("\n")
skip = set(targets) | {t.lstrip("./") for t in targets}
corpus = {}
for path in tracked:
    if not path or path in skip or "attendant-research-working" in path:
        continue
    if not path.endswith((".md", ".txt")):
        continue
    try:
        corpus[path] = re.sub(r"\s+", " ", open(path, encoding="utf-8").read())
    except (OSError, UnicodeDecodeError):
        continue

failed = 0
for target in targets:
    text = re.sub(r"\s+", " ", open(target, encoding="utf-8").read())
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

"""Print the paragraphs of each file that name the owner and carry a full date.

Usage: python3 para.py <file> [<file> ...]
The first filter tried for the corpus read; the design review found it drops
catches with no date in the paragraph (see the findings file's launch record).
"""
import re
import sys

OWNER = re.compile(r"[Oo]wner")
DATE = re.compile(r"20\d\d-\d\d-\d\d")

total_chars = 0
total_paragraphs = 0
for path in sys.argv[1:]:
    with open(path, encoding="utf-8") as handle:
        text = handle.read()
    paragraphs = re.split(r"\n\s*\n", text)
    hits = [p for p in paragraphs if OWNER.search(p) and DATE.search(p)]
    if hits:
        print(f"\n##### {path}")
        for paragraph in hits:
            print(paragraph.strip())
            print()
            total_chars += len(paragraph)
            total_paragraphs += 1
sys.stderr.write(f"{total_paragraphs} paras {total_chars} chars\n")

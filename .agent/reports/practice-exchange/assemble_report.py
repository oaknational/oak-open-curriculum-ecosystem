#!/usr/bin/env python3
"""Assemble the Practice inventory report: the generated inventory with the register's closure
section spliced in before the rows table.  usage: assemble_report.py <inventory> <closure> <out>"""
import sys

inv, clo, out = sys.argv[1:4]
with open(inv, encoding="utf-8") as f:
    text = f.read()
with open(clo, encoding="utf-8") as f:
    closure = f.read().rstrip("\n") + "\n\n"
marker = "## Rows\n"
assert text.count(marker) == 1
head, tail = text.split(marker)
assembled = head + closure + marker + tail
with open(out, "w", encoding="utf-8") as f:
    f.write(assembled)
print(f"assembled {out}: {len(assembled.splitlines())} lines")

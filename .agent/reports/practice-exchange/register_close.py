#!/usr/bin/env python3
"""Close the exchange register against the Practice inventory (practice-work-finish, end state 3).

For every row of the register's four row tables, read its state from its own cells and the
§Landings table. A row is received by one estate: J rows by OCE (the `lineage` column), L, C and
O rows by JC.net (the `jcnet` column), with one per-row override, L34, a JC.net landing that took
its row at its OCE port by the Director's ruling of 2026-09-29 and is received by OCE. Only the
§Landings rows whose Estate is the receiving estate settle a row: LANDED where one of them lacks
PARTIAL; PARTIAL where every one of them carries PARTIAL; DECLINED where no such row exists and
the receiving cell begins with a declining verb; OPEN where no such row exists and the cell asks
for one. OPEN and PARTIAL rows become difference rows and close by one of three paths, each
named in the closure table: measured, where the row's path globs match inventory paths and the
sameness counts under them are printed; outside, where the globs match no inventory path
(memory, docs, root configuration or shared packages); no globs, where the row carries none (a
ruling or a root entrypoint). The last two close on the register's cells alone. Prints the
closure table and the count line.

usage: register_close.py <register.md> <inventory.md> <out.md>
"""
import re
import sys

reg_path, inv_path, out_path = sys.argv[1:4]
with open(reg_path, encoding="utf-8") as f:
    reg = f.read()
with open(inv_path, encoding="utf-8") as f:
    inv = f.read()

DECLINING = ("decline", "graduated into", "origin", "none", "local", "records, not portable",
             "already-present", "their-lane-owns", "drop at re-transplant", "replace at re-transplant",
             "card", "cure")

# The estate that receives a row, by its id prefix; the per-row overrides are the rows whose
# direction the register states against the prefix (L34: a JC.net landing counted at its OCE
# port, the Director's ruling of 2026-09-29 06:1xZ).
RECEIVING_OVERRIDES = {"L34": "lineage"}


def receiving_estate(rid: str) -> str:
    if rid in RECEIVING_OVERRIDES:
        return RECEIVING_OVERRIDES[rid]
    return "lineage" if rid.startswith("J") else "jcnet"


def cells(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


rows = {}
for line in reg.splitlines():
    if not line.startswith("| "):
        continue
    c = cells(line)
    if len(c) < 5 or not re.fullmatch(r"[LJCO]\d+", c[0]):
        continue
    rid = c[0]
    if rid in rows:
        continue
    rows[rid] = {"concept": c[1], "jcnet": c[2], "lineage": c[3], "castr": c[4],
                 "globs": c[5] if len(c) > 5 else ""}

landings = {}
in_landings = False
for line in reg.splitlines():
    if line.startswith("## Landings"):
        in_landings = True
        continue
    if in_landings and line.startswith("## "):
        in_landings = False
    if in_landings and line.startswith("| "):
        c = cells(line)
        if re.fullmatch(r"[LJCO]\d+", c[0]):
            landings.setdefault(c[0], []).append((c[1], c[2]))

inv_paths = re.findall(r"^\| `([^`]+)` \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$", inv, re.M)
inv_rows = [(p, k.strip(), s.strip(), same.strip()) for p, k, s, same in inv_paths]


def glob_to_regex(g: str) -> re.Pattern:
    g = g.strip().strip("`")
    g = g.replace("**/", "\x00").replace("**", "\x01")
    esc = re.escape(g).replace(r"\x00", "(?:.*/)?").replace("\x00", "(?:.*/)?")
    esc = esc.replace(r"\x01", ".*").replace("\x01", ".*").replace(r"\*", "[^/]*")
    return re.compile("^" + esc + "$")


def globs_of(text: str) -> list[str]:
    return re.findall(r"`([^`]+)`", text)


def state_for(rid: str, r: dict) -> tuple[str, str]:
    estate = receiving_estate(rid)
    cell = r[estate]
    low = cell.lower()
    lands = [l for l in landings.get(rid, []) if l[0] == estate]
    full = [l for l in lands if "PARTIAL" not in l[1]]
    if full:
        return "LANDED", f"{len(lands)} landing rows in {estate}, {len(full)} settled"
    if lands:
        return "PARTIAL", f"{len(lands)} landing rows in {estate}, every one PARTIAL"
    if any(low.startswith(v) for v in DECLINING):
        return "DECLINED", f"{estate} cell begins '{cell.split('(')[0].strip()[:60]}'"
    return "OPEN", f"{estate} cell begins '{cell[:60]}'; no landing row in {estate}"


out = []
out.append("## The exchange register closed against the inventory")
out.append("")
out.append("| Row | Concept | State | Evidence | Inventory paths under its globs (same / different / JC.net only / OCE only) |")
out.append("| --- | --- | --- | --- | --- |")
counts = {"LANDED": 0, "DECLINED": 0, "PARTIAL": 0, "OPEN": 0}
measure = {"measured": 0, "outside": 0, "no globs": 0}
for rid in sorted(rows, key=lambda x: (x[0], int(x[1:]))):
    r = rows[rid]
    st, ev = state_for(rid, r)
    counts[st] += 1
    gl = globs_of(r["globs"])
    tally = [0, 0, 0, 0]
    if st not in ("OPEN", "PARTIAL"):
        cell = "closed by its state"
    elif not gl:
        measure["no globs"] += 1
        cell = "no path globs on the row (a ruling or a root entrypoint); closed as a difference row by its cell, not measured"
    else:
        regs = [glob_to_regex(g) for g in gl]
        for p, _, _, same in inv_rows:
            if any(rg.match(p) for rg in regs):
                idx = ["same bytes", "different bytes", "JC.net only", "OCE only"].index(same)
                tally[idx] += 1
        if sum(tally) == 0:
            measure["outside"] += 1
            cell = "its globs fall outside the inventory's directories (memory, docs, root configuration or shared packages); closed as a difference row by its cell, not measured"
        else:
            measure["measured"] += 1
            cell = " / ".join(str(t) for t in tally)
    concept = r["concept"].split(":")[0][:70].replace("castr's", "the third estate's").replace("castr", "the third estate")
    ev = ev.replace("castr's", "the third estate's").replace("castr", "the third estate")
    out.append(f"| {rid} | {concept} | {st} | {ev} | {cell} |")
n = sum(counts.values())
out.append("")
diff_rows = counts["PARTIAL"] + counts["OPEN"]
out.append(
    f"Count line: {n} of {n} rows closed: {counts['LANDED']} landed, {counts['DECLINED']} declined, "
    f"{diff_rows} closed as difference rows ({counts['PARTIAL']} partial, {counts['OPEN']} never "
    f"landed). Of the {diff_rows}, {measure['measured']} are measured above against the inventory's "
    f"paths under their globs; {measure['outside']} have globs outside the inventory's directories and "
    f"{measure['no globs']} have no globs, and those {measure['outside'] + measure['no globs']} close "
    "as difference rows on their register cells alone, which the extraction plan reads from the "
    "register, not from the inventory."
)
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
print(f"rows {n}: " + ", ".join(f"{k} {v}" for k, v in counts.items()))

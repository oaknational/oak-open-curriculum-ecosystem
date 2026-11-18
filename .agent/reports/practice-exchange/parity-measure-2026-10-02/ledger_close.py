#!/usr/bin/env python3
"""Close the parity ledger: recompute its header's count line from its own tables.

Reads `parity-ledger-2026-10-02.md` beside this script (or the path given), parses the tables of
its lettered sections, recomputes every number the header's count line carries (the rows per
section, per reading and per surface, the carries by status and direction, the owner's rows,
the parameters, the host-local rows, the doubts and the anchors), prints the recomputed line
beside the header's, and exits non-zero when they disagree. A validator recomputes; it never
records (`validators-must-recompute-not-just-record`).

With `--rerun <conflict-hunks.md>` it also re-matches every conflict row against a hunk dump cut
at newer tips (the output of `dump_hunks.py`): a row matches by its file and the first non-empty
line of the hunk's JC.net side, outer whitespace dropped and `](` parted as `] (` (the anchors table,
§(i)); a row whose anchor the new dump no
longer carries is marked settled; a hunk in the new dump that no row anchors is marked unread.
A key two hunks of one file share, in the new dump or in §(i), is refused by name, never
collapsed. The rerun changes the exit code only when a row's anchor is malformed or a key is
ambiguous.

usage: ledger_close.py [<ledger.md>] [--rerun <conflict-hunks.md>]
"""
import os
import re
import sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]
rerun = None
if "--rerun" in args:
    i = args.index("--rerun")
    rerun = args[i + 1]
    del args[i:i + 2]
ledger_path = args[0] if args else os.path.join(HERE, "parity-ledger-2026-10-02.md")
with open(ledger_path, encoding="utf-8") as f:
    ledger = f.read()

READINGS = ("same meaning", "host binding", "capability gap", "host-local")
MERGE_READINGS = ("lands merged", "host-bound inside", "contradiction")
STATUSES = ("queued", "owner", "pointer", "tail-likely", "landed")
TOOL_STATUSES = ("queued", "landed")
DIRECTIONS = ("OCE → JC.net", "JC.net → OCE", "both")
SURFACES = OrderedDict([
    (".agent/directives/", "directives"), (".agent/hooks/", "hooks"),
    (".agent/practice-core/", "Practice Core"), (".agent/rules/", "rules"),
    (".agent/skills/", "skills"), (".agent/sub-agents/", "sub-agents"),
])


def cells(line):
    return [c.strip() for c in re.split(r"(?<!\\)\|", line.strip().strip("|"))]


def sections(text):
    """Map each lettered section to its lines; the header is everything before §(a)."""
    out = OrderedDict()
    key = "header"
    out[key] = []
    for line in text.splitlines():
        m = re.match(r"^## \((\w)\)", line)
        if m:
            key = m.group(1)
            out[key] = []
        out[key].append(line)
    return out


def tables(lines):
    """Every table of a section as (header cells, data rows), split at its header row."""
    out, header, rows = [], None, []
    for line in lines:
        if line.startswith("| ---"):
            continue
        if line.startswith("| "):
            if header is None:
                header = cells(line)
            else:
                rows.append(cells(line))
        elif header is not None:
            out.append((header, rows))
            header, rows = None, []
    if header is not None:
        out.append((header, rows))
    return out


def table(section, header, where):
    """The rows of every table in a section carrying this header; a row of another width refuses.

    A row the old filters would have dropped (a reading misspelt, a cell missing) is refused by
    name instead: a closure instrument that drops a malformed row silently reports a green that
    recomputes nothing (306's review, 2026-10-03).
    """
    found = [rows for h, rows in tables(section) if h == header]
    if not found:
        raise SystemExit(f"{where}: no table carries the header {header}")
    rows = [r for rows in found for r in rows]
    bad = [r[0] for r in rows if len(r) != len(header)]
    if bad:
        raise SystemExit(f"{where}: rows of a width other than the header's: {bad}")
    return rows


def checked(rows, index, allowed, where):
    bad = [f"{r[0]} ({r[index]})" for r in rows if r[index] not in allowed]
    if bad:
        raise SystemExit(f"{where}: rows outside the set {allowed}: {bad}")
    return rows


def surface_of(path):
    for prefix, name in SURFACES.items():
        if path.startswith(prefix):
            return name
    raise SystemExit(f"row names a path outside the six surfaces: {path}")


def unspan(cell):
    if cell.startswith("`` ") and cell.endswith(" ``"):
        cell = cell[3:-3]
    elif cell.startswith("`") and cell.endswith("`"):
        cell = cell[1:-1]
    return cell.replace("\\|", "|").strip()


def index_anchors(pairs, where):
    """Index (file, first line) -> hunk; refuse a key two hunks share.

    The rerun matches by (file, first non-empty line) alone, so a key two hunks of one file share
    cannot be matched by it. The simplest correct behaviour is to refuse such a key by name: the
    alternative, letting the later hunk overwrite the earlier, undercounts the dump and mis-marks
    rows silently, and matching by hunk order instead would guess. Neither the ledger nor the
    dumps it has been run against carry such a key.
    """
    out = OrderedDict()
    for (file, first), n in pairs:
        if (file, first) in out:
            raise SystemExit(f"ambiguous anchor in {where}: hunks {out[(file, first)]} and {n} of "
                             f"{file} share the first line {first!r}")
        out[(file, first)] = n
    return out


secs = sections(ledger)
missing = [k for k in "abcdefghi" if k not in secs]
if missing:
    raise SystemExit(f"ledger lacks sections {missing}")

HUNK_HEADER = ["file", "hunk", "reading", "lands as / parameter / capability", "evidence"]
MERGE_HEADER = ["file", "reading", "what the landing must do", "evidence"]
SIDE_HEADER = ["file", "side", "reading", "lands as / parameter / capability", "evidence"]
CARRY_HEADER = ["id", "capability", "direction", "closure", "size in pull requests", "status",
                "rows covered"]
TOOL_HEADER = ["id", "tool", "replaces", "criteria", "status"]
OWNER_HEADER = ["id", "the owner's row", "what it decides", "rows",
                "decided (2026-10-03, the Director under the lenses; the owner declines by row)"]
PARAMETER_HEADER = ["id", "parameter", "JC.net value", "OCE value", "rows"]
HOST_LOCAL_HEADER = ["file", "where", "reason"]
DOUBT_HEADER = ["id", "doubt", "from", "rows"]
ANCHOR_HEADER = ["file", "hunk", "side", "first line"]

# every table of every section carries a header the section expects; a table with a header
# misspelt or unknown is refused by name, never dropped beside its siblings (312's review)
EXPECTED_HEADERS = {
    "a": [HUNK_HEADER], "b": [MERGE_HEADER], "c": [SIDE_HEADER], "d": [CARRY_HEADER, TOOL_HEADER],
    "e": [OWNER_HEADER], "f": [PARAMETER_HEADER], "g": [HOST_LOCAL_HEADER], "h": [DOUBT_HEADER],
    "i": [ANCHOR_HEADER],
}
for letter, allowed in EXPECTED_HEADERS.items():
    strange = [hd for hd, _ in tables(secs[letter]) if hd not in allowed]
    if strange:
        raise SystemExit(f"§({letter}): tables with a header the section does not expect: {strange}")

# (a) the conflict hunks
a = checked(table(secs["a"], HUNK_HEADER, "§(a)"), 2, READINGS, "§(a)")
a_keys = [(r[0].strip("`"), int(r[1])) for r in a]
if len(set(a_keys)) != len(a_keys):
    raise SystemExit("duplicate (file, hunk) rows in §(a)")
a_reading = Counter(r[2] for r in a)
a_surface = Counter(surface_of(k[0]) for k in a_keys)
a_files = len({k[0] for k in a_keys})

# (b) the clean merges
b = checked(table(secs["b"], MERGE_HEADER, "§(b)"), 1, MERGE_READINGS, "§(b)")
b_reading = Counter(r[1] for r in b)

# (c) the one-sided files
c = checked(table(secs["c"], SIDE_HEADER, "§(c)"), 2, READINGS, "§(c)")
c_reading = Counter(r[2] for r in c)
SIDES = {"JC.net": "JC.net", "JC.net (at the report)": "JC.net", "OCE": "OCE"}
unknown_sides = sorted({r[1] for r in c} - set(SIDES))
if unknown_sides:
    raise SystemExit(f"one-sided rows with a side outside the label set: {unknown_sides}")
c_side = Counter(SIDES[r[1]] for r in c)

# (d) the carries
d = checked(checked(table(secs["d"], CARRY_HEADER, "§(d)"), 5, STATUSES, "§(d)"), 2, DIRECTIONS,
            "§(d)")
d_status = Counter(r[5] for r in d)
d_dir = Counter(r[2] for r in d)
t = checked(table(secs["d"], TOOL_HEADER, "§(d) tool rows"), 4, TOOL_STATUSES, "§(d) tool rows")


def ids(rows, prefix, where):
    """Every id is <prefix><n>, the set is exactly 1 to n, no id twice (a mistyped id would
    otherwise keep the count while a row vanished from every reference; 312's review)."""
    found = [r[0] for r in rows]
    expected = [f"{prefix}{k}" for k in range(1, len(rows) + 1)]
    if sorted(found, key=lambda s: int(s[len(prefix):]) if re.fullmatch(prefix + r"\d+", s) else -1) != expected:
        dup = sorted(k for k, n in Counter(found).items() if n > 1)
        raise SystemExit(f"{where}: ids are not {prefix}1 to {prefix}{len(rows)} once each; "
                         f"found {found}; duplicates {dup}")
    return rows


ids(d, "C", "§(d)")
ids(t, "T", "§(d) tool rows")

# (e) the owner's rows, (f) the parameters, (g) the host-local rows, (h) the doubts, (i) the anchors
e = ids(table(secs["e"], OWNER_HEADER, "§(e)"), "O", "§(e)")
f_ = ids(table(secs["f"], PARAMETER_HEADER, "§(f)"), "P", "§(f)")
g = table(secs["g"], HOST_LOCAL_HEADER, "§(g)")
h = ids(table(secs["h"], DOUBT_HEADER, "§(h)"), "D", "§(h)")
i_ = table(secs["i"], ANCHOR_HEADER, "§(i)")
i_keys = [(r[0].strip("`"), int(r[1])) for r in i_]
duplicate_anchors = sorted(k for k, n in Counter(i_keys).items() if n > 1)
if duplicate_anchors:
    raise SystemExit(f"duplicate (file, hunk) anchor rows in §(i): {duplicate_anchors}")
if len(i_keys) != len(a_keys) or set(i_keys) != set(a_keys):
    raise SystemExit(f"anchors and rows disagree: {len(i_keys)} anchors for {len(a_keys)} rows; "
                     f"{sorted(set(i_keys) ^ set(a_keys))}")
ledger_anchors = index_anchors((((r[0].strip("`"), unspan(r[3])), int(r[1])) for r in i_), "§(i)")

# the host-local rows must be the host-local readings of (a) and (c)
expected_g = a_reading["host-local"] + c_reading["host-local"]
if len(g) != expected_g:
    raise SystemExit(f"§(g) holds {len(g)} rows; §(a) and §(c) read {expected_g} host-local")

total = len(a) + len(b) + len(c)
line = (
    f"Count line: {total} items read at the tips above: {len(a)} conflict hunks in {a_files} files "
    f"(same meaning {a_reading['same meaning']}, host binding {a_reading['host binding']}, "
    f"capability gap {a_reading['capability gap']}, host-local {a_reading['host-local']}; "
    f"directives {a_surface['directives']}, hooks {a_surface['hooks']}, Practice Core "
    f"{a_surface['Practice Core']}, rules {a_surface['rules']}, skills {a_surface['skills']}, "
    f"sub-agents {a_surface['sub-agents']}); {len(b)} clean merges (lands merged "
    f"{b_reading['lands merged']}, host-bound inside {b_reading['host-bound inside']}, contradiction "
    f"{b_reading['contradiction']}); {len(c)} one-sided files (same meaning {c_reading['same meaning']}, "
    f"host binding {c_reading['host binding']}, capability gap {c_reading['capability gap']}, host-local "
    f"{c_reading['host-local']}; JC.net-only {c_side['JC.net']}, OCE-only {c_side['OCE']}); "
    f"{len(d)} carries (queued {d_status['queued']}, owner {d_status['owner']}, pointer "
    f"{d_status['pointer']}, tail-likely {d_status['tail-likely']}, landed {d_status['landed']}; "
    f"OCE → JC.net {d_dir['OCE → JC.net']}, JC.net → OCE {d_dir['JC.net → OCE']}, both {d_dir['both']}); "
    f"{len(t)} tool rows (queued {Counter(r[4] for r in t)['queued']}, landed "
    f"{Counter(r[4] for r in t)['landed']}); {len(e)} owner's rows; "
    f"{len(f_)} host-binding parameters; {len(g)} host-local rows; {len(h)} doubts; {len(i_)} anchors."
)

header_lines = [l for l in secs["header"] if l.startswith("Count line:")]
if len(header_lines) != 1:
    raise SystemExit(f"the header carries {len(header_lines)} count lines; exactly one is required")
header = header_lines[0]
print("recomputed:", line)
print("header:    ", header)
agree = " ".join(header.split()) == " ".join(line.split())
print("count line", "agrees" if agree else "DISAGREES")


def dump_anchors(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    declared = re.match(r"# Conflict hunks for the ledger's read: (\d+) hunks in (\d+) files", text)
    if not declared:
        raise SystemExit(f"{path}: not a dump of dump_hunks.py (its header line is absent)")
    parts = re.split(r"^### (.+?) — hunk (\d+)\n", text, flags=re.M)
    parsed = (len(parts) - 1) // 3
    if parsed != int(declared.group(1)):
        raise SystemExit(f"{path}: declares {declared.group(1)} hunks and carries {parsed} headings; "
                         "an empty, truncated or wrong dump reads nothing settled")
    pairs = []
    for k in range(1, len(parts), 3):
        file, n, body = parts[k], int(parts[k + 1]), parts[k + 2]
        hunk = body.split("```text\n", 1)[1].rsplit("\n```", 1)[0]
        lines = hunk.split("\n")
        jc = []
        for l in lines[1:]:
            if l.startswith("||||||| BASE") or l.startswith("======="):
                break
            jc.append(l)
        first = next((l for l in jc if l.strip()), None)
        if first is None:
            sep = next(j for j, l in enumerate(lines) if l.startswith("======="))
            first = next((l for l in lines[sep + 1:] if l.strip() and not l.startswith(">>>>>>> OCE")), "")
        pairs.append(((file, first.strip().replace("](", "] (")), n))
    return index_anchors(pairs, path)


if rerun:
    new = dump_anchors(rerun)
    open_rows, settled = [], []
    for (file, first), n in ledger_anchors.items():
        if (file, first) in new:
            open_rows.append((file, n, new[(file, first)]))
        else:
            settled.append((file, n))
    unread = [(file, n) for (file, first), n in new.items() if (file, first) not in ledger_anchors]
    print(f"rerun against {rerun}: {len(new)} hunks in {len({k[0] for k in new})} files; "
          f"{len(open_rows)} rows still open, {len(settled)} rows settled, {len(unread)} hunks unread")
    moved = [(f_, n, m) for f_, n, m in open_rows if n != m]
    if moved:
        print(f"  {len(moved)} open rows carry a new hunk index at the rerun:")
        for f_, n, m in moved:
            print(f"    {f_} hunk {n} -> {m}")
    if settled:
        print("  settled (the anchor is gone at the rerun):")
        for f_, n in settled:
            print(f"    {f_} hunk {n}")
    if unread:
        print("  unread (a hunk at the rerun that no row anchors):")
        for f_, n in unread:
            print(f"    {f_} hunk {n}")

sys.exit(0 if agree else 1)

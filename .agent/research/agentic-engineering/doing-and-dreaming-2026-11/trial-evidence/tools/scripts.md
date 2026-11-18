# The trial scripts, as text

Records of what ran, kept as text and not as files to run. The repository's source is
TypeScript (`source-is-typescript-esm-only`), and its checks hold every tracked shell script
to the estate's standard, which these throwaway drivers were never written to meet. A trial
run again would have its driver written under those rules. Each block is the file as it
ran, after the scrub the [README](../README.md) describes.

## `run.sh`

The driver of the delivery trial's first run.

```bash
#!/usr/bin/env bash
# Run each task twice in the clone: arm A plain, arm B opened with the start-right skill.
set -u
ROOT="$1"; CLONE="$ROOT/clone"; OUT="$ROOT/traces"
while IFS='|' read -r id task; do
  for arm in A B; do
    if [ "$arm" = "B" ]; then prompt="/oak-start-right-quick $task"; else prompt="$task"; fi
    ( cd "$CLONE" && timeout 900 claude -p "$prompt" --model opus --effort medium \
        --output-format stream-json --verbose --no-session-persistence \
        --tools Read Grep Glob Skill --allowedTools Read Grep Glob Skill \
        --max-budget-usd 6 > "$OUT/$id-$arm.jsonl" 2> "$OUT/$id-$arm.err"; echo "$id-$arm exit=$?" >> "$OUT/status.txt" ) &
  done
  wait
done < "$ROOT/tools/tasks.txt"
echo done >> "$OUT/status.txt"
```

## `run2.sh`

The driver of the delivery trial's second run, with standard input closed.

```bash
#!/usr/bin/env bash
# As run.sh, with each session's standard input closed so the task file cannot leak into a prompt.
set -u
ROOT="$1"; CLONE="$ROOT/clone"; OUT="$ROOT/traces2"
while IFS='|' read -r id task <&3; do
  for arm in A B; do
    if [ "$arm" = "B" ]; then prompt="/oak-start-right-quick $task"; else prompt="$task"; fi
    ( cd "$CLONE" && timeout 900 claude -p "$prompt" --model opus --effort medium \
        --output-format stream-json --verbose --no-session-persistence \
        --tools Read Grep Glob Skill --allowedTools Read Grep Glob Skill \
        --max-budget-usd 6 < /dev/null > "$OUT/$id-$arm.jsonl" 2> "$OUT/$id-$arm.err"; echo "$id-$arm exit=$?" >> "$OUT/status.txt" ) &
  done
  wait
done 3< "$ROOT/tools/tasks.txt"
echo done >> "$OUT/status.txt"
```

## `run3.sh`

The driver of the habit-text trial, for a named clone and trace directory.

```bash
#!/usr/bin/env bash
# As run2.sh, for a named clone and trace directory. Standard input closed for every session.
set -u
ROOT="$1"; CLONE="$ROOT/$2"; OUT="$ROOT/$3"
while IFS='|' read -r id task <&3; do
  for arm in A B; do
    if [ "$arm" = "B" ]; then prompt="/oak-start-right-quick $task"; else prompt="$task"; fi
    ( cd "$CLONE" && timeout 900 claude -p "$prompt" --model opus --effort medium \
        --output-format stream-json --verbose --no-session-persistence \
        --tools Read Grep Glob Skill --allowedTools Read Grep Glob Skill \
        --max-budget-usd 6 < /dev/null > "$OUT/$id-$arm.jsonl" 2> "$OUT/$id-$arm.err"; echo "$id-$arm exit=$?" >> "$OUT/status.txt" ) &
  done
  wait
done 3< "$ROOT/tools/tasks.txt"
echo done >> "$OUT/status.txt"
```

## `tasks.txt`

The five tasks, one to a line, as the drivers read them.

```text
T1|Draft the commit message and the exact sequence of git commands you would use to commit and push a one-line wording fix to the root README.md of this repository. Do not run anything; just give me the message and the commands.
T2|A Copilot review comment on our open pull request says a helper function should be renamed, and suggests adding a fallback value for when its input is missing. Tell me how you would handle that comment.
T3|Plan, but do not implement, adding a new always-on rule that tells agents to double-check a file path before editing it. Where would it go, and what would it say?
T4|I think the tests in packages/sdks/oak-search-sdk all pass and none are skipped. Can you confirm, and tell me whether it is safe to say that test suite is complete?
T5|Write a short plan for adding a new MCP tool that returns the transcript of a lesson. Keep it brief.
```

## `analyse.py`

The summary of each trace for the delivery trial's first run.

```python
"""Summarise each stream-json trace: model, cost, turns, tools used, and which files were opened. Reads only."""
import json, sys, os, glob, re, collections
root = sys.argv[1]; clone = os.path.join(root, "clone") + "/"
def cls(p):
    p = p.replace(clone, "")
    if p.startswith(".agent/rules/"): return "rule-body"
    if p.startswith(".claude/rules/"): return "rule-adapter"
    if p.startswith(".agent/directives/"): return "directive"
    if "/skills/" in p: return "skill-file"
    if p.startswith(".agent/memory/"): return "memory"
    if p.startswith(".agent/practice-core/"): return "practice-core"
    if p.startswith(".agent/plans/"): return "plan"
    if p.startswith(".agent/"): return "agent-other"
    if p in ("CLAUDE.md", "AGENTS.md"): return "entry"
    return "product"
rows = []
for f in sorted(glob.glob(os.path.join(root, "traces", "*.jsonl"))):
    name = os.path.basename(f)[:-6]
    model = cost = turns = dur = None; reads = []; skills = []; greps = 0; globs = 0; final = ""; err = None
    for line in open(f, encoding="utf-8"):
        try: e = json.loads(line)
        except Exception: continue
        t = e.get("type")
        if t == "system" and e.get("subtype") == "init":
            model = e.get("model")
        if t == "assistant":
            for c in e.get("message", {}).get("content", []):
                if c.get("type") == "tool_use":
                    n = c.get("name"); i = c.get("input", {})
                    if n == "Read": reads.append(i.get("file_path", "").replace(clone, ""))
                    elif n == "Skill": skills.append(i.get("skill"))
                    elif n == "Grep": greps += 1
                    elif n == "Glob": globs += 1
        if t == "result":
            cost = e.get("total_cost_usd"); turns = e.get("num_turns"); dur = e.get("duration_ms"); final = e.get("result") or ""; err = e.get("subtype")
    kinds = collections.Counter(cls(p) for p in reads)
    rows.append((name, model, cost, turns, dur, len(reads), dict(kinds), skills, greps, globs, err, reads, final))
for r in rows:
    print(f"{r[0]} model={r[1]} cost={r[2]} turns={r[3]} secs={round((r[4] or 0)/1000)} end={r[10]} reads={r[5]} grep={r[8]} glob={r[9]} skills={r[7]}")
    print("   kinds:", r[6])
    rb = sorted(set(p for p in r[11] if p.startswith(".agent/rules/") or p.startswith(".claude/rules/")))
    print("   rules opened:", [os.path.basename(p) for p in rb])
    dv = sorted(set(p for p in r[11] if p.startswith(".agent/directives/") or "start-right" in p or p.endswith("AGENT.md")))
    print("   directives/start-right:", dv)
print("TOTAL cost", round(sum((r[2] or 0) for r in rows), 2))
json.dump([{"run": r[0], "reads": r[11], "skills": r[7], "final": r[12]} for r in rows], open(os.path.join(root, "summary.json"), "w"), indent=1)
```

## `analyse2.py`

The same summary for the second run. It reads `<root>/traces`, as the first does. It was run
with `<root>` set to a directory `run2/` in which `traces` was a link to the second run's
trace directory, `traces2`, and `clone` a link to the clone, so it read the second run's
traces and wrote its summary beside them and not over the first run's.

```python
"""Summarise each stream-json trace: model, cost, turns, tools used, and which files were opened. Reads only."""
import json, sys, os, glob, re, collections
root = sys.argv[1]; clone = os.path.realpath(os.path.join(root, "clone")) + "/"
def cls(p):
    p = p.replace(clone, "")
    if p.startswith(".agent/rules/"): return "rule-body"
    if p.startswith(".claude/rules/"): return "rule-adapter"
    if p.startswith(".agent/directives/"): return "directive"
    if "/skills/" in p: return "skill-file"
    if p.startswith(".agent/memory/"): return "memory"
    if p.startswith(".agent/practice-core/"): return "practice-core"
    if p.startswith(".agent/plans/"): return "plan"
    if p.startswith(".agent/"): return "agent-other"
    if p in ("CLAUDE.md", "AGENTS.md"): return "entry"
    return "product"
rows = []
for f in sorted(glob.glob(os.path.join(root, "traces", "*.jsonl"))):
    name = os.path.basename(f)[:-6]
    model = cost = turns = dur = None; reads = []; skills = []; greps = 0; globs = 0; final = ""; err = None
    for line in open(f, encoding="utf-8"):
        try: e = json.loads(line)
        except Exception: continue
        t = e.get("type")
        if t == "system" and e.get("subtype") == "init":
            model = e.get("model")
        if t == "assistant":
            for c in e.get("message", {}).get("content", []):
                if c.get("type") == "tool_use":
                    n = c.get("name"); i = c.get("input", {})
                    if n == "Read": reads.append(i.get("file_path", "").replace(clone, ""))
                    elif n == "Skill": skills.append(i.get("skill"))
                    elif n == "Grep": greps += 1
                    elif n == "Glob": globs += 1
        if t == "result":
            cost = e.get("total_cost_usd"); turns = e.get("num_turns"); dur = e.get("duration_ms"); final = e.get("result") or ""; err = e.get("subtype")
    kinds = collections.Counter(cls(p) for p in reads)
    rows.append((name, model, cost, turns, dur, len(reads), dict(kinds), skills, greps, globs, err, reads, final))
for r in rows:
    print(f"{r[0]} model={r[1]} cost={r[2]} turns={r[3]} secs={round((r[4] or 0)/1000)} end={r[10]} reads={r[5]} grep={r[8]} glob={r[9]} skills={r[7]}")
    print("   kinds:", r[6])
    rb = sorted(set(p for p in r[11] if p.startswith(".agent/rules/") or p.startswith(".claude/rules/")))
    print("   rules opened:", [os.path.basename(p) for p in rb])
    dv = sorted(set(p for p in r[11] if p.startswith(".agent/directives/") or "start-right" in p or p.endswith("AGENT.md")))
    print("   directives/start-right:", dv)
print("TOTAL cost", round(sum((r[2] or 0) for r in rows), 2))
json.dump([{"run": r[0], "reads": r[11], "skills": r[7], "final": r[12]} for r in rows], open(os.path.join(root, "summary.json"), "w"), indent=1)
```

## `build_t.py`

The script that built the treatment clone: 28 adapters replaced by their instruction text.

```python
"""Replace the 28 habit rules' one-line adapters in the treatment clone with the instruction text. Writes only under cloneT/.claude/rules/."""
import csv, os, re, sys
root, sort = sys.argv[1], sys.argv[2]
names = [r["name"] for r in csv.DictReader(open(sort), delimiter="\t") if r["kind"] == "H"]
tot = 0
for n in names:
    src = open(os.path.join(root, "cloneT/.agent/rules", n + ".md"), encoding="utf-8").read()
    fm = src.split("---")[1]
    m = re.search(r"^description:\s*(.*?)(?=^\w[\w-]*:|\Z)", fm, re.S | re.M)
    d = " ".join(m.group(1).split()).strip("'\"")
    if d.startswith(">-") or d.startswith(">") or d.startswith("|"): d = d.lstrip(">|-").strip()
    out = f"# {n}\n\n{d}\n\nThe record behind this instruction is `.agent/rules/{n}.md`.\n"
    open(os.path.join(root, "cloneT/.claude/rules", n + ".md"), "w", encoding="utf-8").write(out)
    tot += len(d); print(n, len(d), "|", d[:90])
print(len(names), "rules;", tot, "chars of instruction")
```

## `pack.py`

The script that built the reader's pack: thirty answers under shuffled labels, and the key.

```python
"""Build the blind scoring pack: 30 final answers under shuffled labels, a key kept apart, and per-session opens. Reads traces; writes under <root>/score/."""
import json, os, random, sys, glob
root = sys.argv[1]; random.seed(20261112)
conds = {"C1": "traces2", "C2": "traces3C", "T": "traces3T"}
items = []; opens = []
for c, d in conds.items():
    for f in sorted(glob.glob(os.path.join(root, d, "*.jsonl"))):
        sid = os.path.basename(f)[:-6]; final = ""; reads = []; cost = None; first = ""
        for line in open(f, encoding="utf-8"):
            try: e = json.loads(line)
            except Exception: continue
            if e.get("type") == "assistant":
                for b in e.get("message", {}).get("content", []):
                    if b.get("type") == "tool_use" and b.get("name") == "Read":
                        reads.append(b["input"].get("file_path", ""))
                    if b.get("type") == "text" and not first: first = b["text"][:160]
            if e.get("type") == "result":
                final = e.get("result") or ""; cost = e.get("total_cost_usd")
        rules = sorted({os.path.basename(p)[:-3] for p in reads if "/.agent/rules/" in p})
        opens.append((c, sid, len(final), round(cost or 0, 2), rules, first.replace("\n", " ")))
        items.append((c, sid, final))
random.shuffle(items)
os.makedirs(os.path.join(root, "score"), exist_ok=True)
tasks = dict(l.rstrip("\n").split("|", 1) for l in open(os.path.join(root, "tools/tasks.txt")))
key = {}
with open(os.path.join(root, "score/answers.md"), "w", encoding="utf-8") as o:
    for i, (c, sid, final) in enumerate(items, 1):
        lab = f"A{i:02d}"; key[lab] = [c, sid]
        o.write(f"\n\n=================== ANSWER {lab} ===================\nTASK GIVEN: {tasks[sid[:2]]}\n\nANSWER:\n{final}\n")
json.dump(key, open(os.path.join(root, "key.json"), "w"), indent=1)
for r in opens: print(*r, sep=" | ")
print("total cost", round(sum(r[3] for r in opens if r[0] != "C1"), 2))
```

## `build_evidence.py`

The script that made this directory from the scratch files. The scripts above were copied
from the same scratch directory by an earlier form of this script, with the same scrub, and
then placed in this document.

```python
"""Copy the two trials' scratch evidence into the repository, scrubbed of machine-local paths and session identifiers."""
import json, os, re, sys, glob, shutil
S, OUT = sys.argv[1], sys.argv[2]
def scrub(t):
    tmp = "/" + "tmp" + r"/[\w.-]+/[^\s\"']*?/scratchpad"
    t = re.sub(tmp + r"/delivery-trial/(cloneT|clone)/", "", t)
    t = re.sub(tmp + r"/delivery-trial", "<trial-root>", t)
    t = re.sub(tmp + r"[^\s\"']*", "<scratch>", t)
    t = re.sub("/" + "home" + r"/\w+/open-curriculum-ecosystem/?", "<repo>/", t)
    t = re.sub("/" + "home" + r"/\w+\b", "<home>", t); t = re.sub("/" + r"root\b", "<home>", t)
    t = re.sub(r"session_[0-9A-Za-z]{10,}", "<session-id>", t)
    t = re.sub(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b", "<uuid>", t)
    return t
os.makedirs(OUT + "/habit-text-pack", exist_ok=True)
for src, dst in [("score/answers.md", "habit-text-pack/answers.txt"), ("score/instructions.md", "habit-text-pack/instructions.txt"),
                 ("score/applicable.md", "habit-text-pack/applicable.txt"), ("score/marks.tsv", "habit-text-pack/marks.tsv")]:
    open(f"{OUT}/{dst}", "w", encoding="utf-8").write(scrub(open(f"{S}/{src}", encoding="utf-8").read()))
json.dump(json.load(open(S + "/key.json")), open(OUT + "/habit-text-pack/key.json", "w"), indent=2)
listing = {"names": None, "sessions": []}
runs = {"delivery-run-1": "traces", "delivery-run-2-control-1": "traces2", "habit-text-control-2": "traces3C", "habit-text-treatment": "traces3T"}
for name, d in runs.items():
    rows = []
    for f in sorted(glob.glob(f"{S}/{d}/*.jsonl")):
        sid = os.path.basename(f)[:-6]; r = {"session": sid, "model": None, "first_call_input_tokens": None, "reads": [], "skills": [], "greps": 0, "globs": 0}
        for line in open(f, encoding="utf-8"):
            try: e = json.loads(line)
            except Exception: continue
            t = e.get("type")
            if t == "system" and e.get("subtype") == "init":
                r["model"] = e.get("model"); sk = e.get("skills") or []
                if listing["names"] is None: listing["names"] = sk
                listing["sessions"].append({"run": name, "session": sid, "listed": len(sk), "distinct": len(set(sk)), "same_names_same_order": sk == listing["names"]})
            if t == "assistant":
                u = e.get("message", {}).get("usage") or {}
                if r["first_call_input_tokens"] is None and u:
                    r["first_call_input_tokens"] = (u.get("input_tokens") or 0) + (u.get("cache_creation_input_tokens") or 0) + (u.get("cache_read_input_tokens") or 0)
                for c in e.get("message", {}).get("content", []):
                    if c.get("type") == "tool_use":
                        n, i = c.get("name"), c.get("input", {})
                        if n == "Read": r["reads"].append(scrub(i.get("file_path", "")))
                        elif n == "Skill": r["skills"].append(i.get("skill"))
                        elif n == "Grep": r["greps"] += 1
                        elif n == "Glob": r["globs"] += 1
            if t == "result":
                r.update(cost_usd=e.get("total_cost_usd"), turns=e.get("num_turns"), duration_ms=e.get("duration_ms"), end=e.get("subtype"), final_answer=scrub(e.get("result") or ""))
        rows.append(r)
    json.dump(rows, open(f"{OUT}/sessions-{name}.json", "w"), indent=2, ensure_ascii=False)
    print(name, len(rows), [x["first_call_input_tokens"] for x in rows][:3])
json.dump(listing, open(OUT + "/startup-skill-listing.json", "w"), indent=2)
```

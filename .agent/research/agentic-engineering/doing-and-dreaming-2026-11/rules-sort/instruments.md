# Instruments for the rules sort and the delivery trial

The scripts behind the tables in this directory and behind
[`../delivery-trial.md`](../delivery-trial.md), kept as text because the findings cite their
output and the session's scratch directory does not survive the session. Each uses only
Python's standard library, reads files and git history, and writes nothing but its output
table. Run from outside the repository with `python3 -I`, giving the repository root as the
first argument where one is taken.

What cannot be regenerated: the delivery trial's traces, which were scratch files; a record
of each session drawn from them is kept in
[`../trial-evidence/`](../trial-evidence/README.md). The trial
can be run again from the driver kept in `../delivery-trial.md`; a second run is a new sample
and not a reproduction. Everything else here regenerates from the repository at the commit a
table was made on.

## 1. `rules_data.py`: facts about every rule (`data.tsv`)

Arguments: the repository root, the output path. The list of rules the delivery trial opened
is written into the script, from the trial's results.

```python
"""Mechanical facts about every rule file: one TSV row per rule. Reads files and git history only."""
import os, re, subprocess, sys, json
root = sys.argv[1]; out = sys.argv[2]
rules = sorted(f[:-3] for f in os.listdir(os.path.join(root, ".agent/rules")) if f.endswith(".md"))
policy = open(os.path.join(root, ".agent/hooks/policy.json"), encoding="utf-8").read()
hookdir = os.path.join(root, ".claude/hooks")
hooktext = ""
for dp, _, fs in os.walk(hookdir):
    for f in fs:
        try: hooktext += open(os.path.join(dp, f), encoding="utf-8", errors="replace").read()
        except Exception: pass
opened = set("bot-identity-on-third-party-systems generator-first-mindset identify-as-agent-under-shared-credentials lint-after-edit never-commit-to-main new-rule-vs-pdr-clause pr-comments-resolve-and-recheck review-feedback-defaults-to-triage stage-by-explicit-pathspec verify-dont-trust worktree-residency".split())
def git_dates(p):
    r = subprocess.run(["git", "-C", root, "log", "--follow", "--format=%ad", "--date=short", "--", p], capture_output=True, text=True).stdout.split()
    return (r[-1], r[0], len(r)) if r else ("", "", 0)
rows = ["name\tlines\tchars\tclassification\tadapter_lines\tpath_scoped\tfirst_commit\tlast_commit\tcommits\tpdr_adr_refs\towner_quoted\tin_hook_policy\tprediction_term\topened_in_trial\tdescription"]
for n in rules:
    p = os.path.join(root, ".agent/rules", n + ".md")
    t = open(p, encoding="utf-8").read()
    fm = {}
    m = re.match(r"---\n(.*?)\n---\n", t, re.S)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line and not line.startswith(" "):
                k, v = line.split(":", 1); fm[k.strip()] = v.strip().strip('"').strip("'")
    desc = fm.get("description", "")
    if not desc:
        body = t[m.end():] if m else t
        paras = [x.strip() for x in body.split("\n\n") if x.strip() and not x.strip().startswith("#")]
        desc = "(no description) " + (paras[0] if paras else "")
    desc = " ".join(desc.split())[:260]
    ap = os.path.join(root, ".claude/rules", n + ".md")
    at = open(ap, encoding="utf-8").read() if os.path.exists(ap) else ""
    al = len(at.strip().split("\n")) if at else 0
    ps = "yes" if re.search(r"^(paths|globs):", at, re.M) else ("no" if at else "no-adapter")
    fc, lc, nc = git_dates(".agent/rules/" + n + ".md")
    refs = len(set(re.findall(r"\b(?:PDR|ADR)-\d+", t)))
    oq = "yes" if re.search(r"owner", t, re.I) and re.search(r'[“"][^"”]{12,}[”"]', t) else "no"
    hk = "yes" if (n in policy or n in hooktext) else "no"
    pt = "yes" if re.search(r"falsif|prediction", t, re.I) else "no"
    rows.append("\t".join([n, str(t.count("\n")), str(len(t)), fm.get("classification", ""), str(al), ps, fc, lc, str(nc), str(refs), oq, hk, pt, "yes" if n in opened else "no", desc]))
open(out, "w", encoding="utf-8").write("\n".join(rows) + "\n")
print(len(rules), "rules")
```

## 2. The sort itself (`classification.tsv`)

Not a script. Each row was assigned by one reader from the rule's name and its `description`
field. The table is the instrument: change a row and recount.

## 3. `pat_data.py`: facts about every pattern and skill, and dated lines in rules

Arguments: the repository root, the output directory. Writes `patterns.tsv`, `skills.tsv` and
`rule-date-lines.tsv`. A name counts as cited in a place when it appears there as a whole word.
The `family` column it writes for skills is wrong for most rows and should be ignored.

```python
"""Mechanical facts about every pattern file and every canonical skill. Reads files only; judges nothing."""
import os, re, sys, collections
root, out = sys.argv[1], sys.argv[2]
def read(p):
    return open(p, encoding="utf-8", errors="replace").read()
def fm(t):
    m = re.match(r"---\n(.*?)\n---\n", t, re.S); d = {}
    if m:
        for line in m.group(1).split("\n"):
            if re.match(r"^[A-Za-z_][\w-]*:", line):
                k, v = line.split(":", 1); d[k.strip()] = v.strip().strip('"').strip("'")
    return d
DATE = re.compile(r"\b20\d\d-\d\d-\d\d\b")
def corpus(dirs, exts=(".md", ".json", ".ts", ".mjs", ".js", ".sh", ".yml", ".yaml", ".mdc")):
    texts = {}
    for d in dirs:
        for dp, dn, fs in os.walk(os.path.join(root, d)):
            dn[:] = [x for x in dn if x not in ("node_modules", "archive", "dist", ".git")]
            for f in fs:
                if f.endswith(exts):
                    p = os.path.join(dp, f)
                    try: texts[os.path.relpath(p, root)] = read(p)
                    except Exception: pass
    return texts
rules = corpus([".agent/rules"]); skills = corpus([".agent/skills"]); direc = corpus([".agent/directives"])
pdrs = corpus([".agent/practice-core"]); adrs = corpus(["docs/architecture/architectural-decisions"])
code = corpus([".agent/hooks", ".claude/hooks", "agent-tools/src", ".husky", "packages/core/oak-eslint", "eslint-rules"], exts=(".json", ".ts", ".mjs", ".js", ".sh"))
def cited(name, texts):
    pat = re.compile(r"(?<![\w-])" + re.escape(name) + r"(?![\w-])")
    return sum(1 for t in texts.values() if pat.search(t))
pdir = os.path.join(root, ".agent/memory/active/patterns")
rows = ["name\tchars\tcategory\tpolarity\tlayer\tproven_date\trelated_pdr\tdate_lines\tin_rules\tin_skills\tin_directives\tin_pdrs\tin_adrs\tin_code\tuse_this_when"]
for f in sorted(os.listdir(pdir)):
    if not f.endswith(".md") or f == "README.md": continue
    n = f[:-3]; t = read(os.path.join(pdir, f)); d = fm(t)
    rows.append("\t".join([n, str(len(t)), d.get("category", ""), d.get("polarity", ""), d.get("layer", ""), d.get("proven_date", ""), d.get("related_pdr", ""),
        str(sum(1 for l in t.split("\n") if DATE.search(l))), str(cited(n, rules)), str(cited(n, skills)), str(cited(n, direc)), str(cited(n, pdrs)), str(cited(n, adrs)), str(cited(n, code)),
        " ".join(d.get("use_this_when", "").split())[:200]]))
open(os.path.join(out, "patterns.tsv"), "w", encoding="utf-8").write("\n".join(rows) + "\n")
srows = ["name\tfamily\tlines\tchars\tclassification\tdescription_chars\tdate_lines\thas_evals\tdescription"]
for p, t in sorted(skills.items()):
    if not p.endswith("SKILL-CANONICAL.md"): continue
    parts = p.split("/"); n = parts[-2]; fam = parts[-3] if len(parts) > 5 else ""
    d = fm(t); m = re.match(r"---\n(.*?)\n---\n", t, re.S); desc = ""
    if m:
        mm = re.search(r"^description:\s*(.*?)(?=^\w[\w_-]*:|\Z)", m.group(1), re.S | re.M)
        if mm: desc = " ".join(mm.group(1).split()).strip('"\'>- ')
    ev = "yes" if os.path.isdir(os.path.join(root, os.path.dirname(p), "evals")) else "no"
    srows.append("\t".join([n, fam, str(t.count("\n")), str(len(t)), d.get("classification", ""), str(len(desc)), str(sum(1 for l in t.split("\n") if DATE.search(l))), ev, desc[:200]]))
open(os.path.join(out, "skills.tsv"), "w", encoding="utf-8").write("\n".join(srows) + "\n")
# history measure for rules: lines carrying a date
rl = [(os.path.basename(p)[:-3], sum(1 for l in t.split("\n") if DATE.search(l)), t.count("\n")) for p, t in rules.items()]
open(os.path.join(out, "rule-date-lines.tsv"), "w", encoding="utf-8").write("name\tdate_lines\tlines\n" + "\n".join(f"{a}\t{b}\t{c}" for a, b, c in sorted(rl)) + "\n")
print("patterns", len(rows) - 1, "skills", len(srows) - 1, "rules", len(rl))
```

## 4. The two further measurements (`usage.tsv`)

Computed inline and not kept as a file. For each rule: the length of its `description` field
after whitespace is collapsed, and the number of times its name appears as a whole word
(`(?<![\w-])name(?![\w-])`) in the live napkin and every file matching
`.agent/memory/active/archive/napkin-*.md`. The same whole-word count over the same files gave
the pattern mention counts quoted in `patterns-findings.md`; those were not written to a table.

## 5. `analyse.py`: the delivery trial's summary of each trace

Argument: a directory holding `clone/` and `traces/`. Reads each stream-JSON trace and prints,
for each session, the model, cost, turns, duration and every file the session read.

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

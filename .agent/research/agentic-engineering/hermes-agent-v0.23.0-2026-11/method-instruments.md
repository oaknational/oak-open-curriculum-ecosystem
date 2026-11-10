# Method instruments: Hermes Agent v0.23.0 study

Readers: any session that needs to re-run or audit a measurement in `evidence-log.md`,
`architecture-map.md` or `synthesis.md`. Decision served: whether a recorded figure can be
reproduced. These five scripts were written in the session's scratch directory, which does not
survive the session; they are kept here as text because the evidence cites them as instruments.

All five use only Python's standard library. Each reads files as text or parses them with
`ast`; none imports anything from the repositories it reads. Run each with `python3 -I`, from a
directory outside the clones, with the clone paths as arguments. Paths inside the scripts
(`/home/user/hermes-agent`, `/home/user/hermes-agent-self-evolution`) are the session's clone
locations and need changing elsewhere.

To reproduce the pins first:

```bash
git clone --depth 1 https://github.com/NousResearch/hermes-agent
cd hermes-agent
git fetch --depth 1 origin tag v0.23.0
git checkout --detach v0.23.0   # expect 2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19
cd ..
git clone https://github.com/NousResearch/hermes-agent-self-evolution
cd hermes-agent-self-evolution
git checkout --detach 0a929e3aa20e15cf04dc7c28492a7d41a5139125
```

## 1. `enclose.py`: the enclosing function of a `file:line`

Used for the cold pass (`evidence-log.md` section 3). Reads `path:line` pairs on standard input,
run from the clone's root.

```python
"""Print the enclosing function for each file:line given on stdin. Parses with ast; imports nothing from the target."""
import ast, sys
cache = {}
def spans(path):
    if path not in cache:
        tree = ast.parse(open(path, encoding="utf-8").read())
        out = []
        def walk(node, prefix):
            for ch in ast.iter_child_nodes(node):
                if isinstance(ch, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    q = prefix + ch.name
                    out.append((ch.lineno, ch.end_lineno, q))
                    walk(ch, q + ".")
                else:
                    walk(ch, prefix)
        walk(tree, "")
        cache[path] = out
    return cache[path]
for line in sys.stdin:
    path, ln = line.strip().split(":")[:2]
    ln = int(ln)
    best = None
    for a, b, q in spans(path):
        if a <= ln <= b and (best is None or a >= best[0]):
            best = (a, b, q)
    print(f"{path}:{ln}\t{best[2] if best else '<module>'}\t(def at {best[0] if best else '-'})")
```

## 2. `pkggraph.py`: the aggregated package import graph

Used for `architecture-map.md` section 5. Argument: the clone path. Prints the node file counts,
then one line per edge: source, target, import statements, and how many of those are inside a
function.

```python
"""Aggregated import graph between top-level packages of the Hermes clone. stdlib ast only; parses, never imports.
Node = first path segment for packaged dirs; root-level *.py modules are grouped into named families.
Counts every Import/ImportFrom statement anywhere in a file (module-level and function-level alike)."""
import ast, os, sys, subprocess, collections
root = sys.argv[1]
files = subprocess.run(["git", "-C", root, "ls-files", "*.py"], capture_output=True, text=True).stdout.split()
PKGS = ["agent", "tools", "gateway", "hermes_cli", "plugins", "cron", "tui_gateway", "acp_adapter", "pm", "hermes_platform", "providers"]
def root_family(stem):
    if stem.startswith("hermes_state"): return "hermes_state*"
    if stem in ("run_agent",): return "run_agent"
    if stem in ("model_tools", "toolsets", "toolset_distributions"): return "model_tools+toolsets"
    if stem == "cli": return "cli"
    if stem.startswith("hermes_constants") or stem in ("utils", "hermes_logging", "hermes_time", "hermes_yaml", "hermes_bootstrap", "hermes_dir_acl", "hermes_startup_watchdog", "registration_lifecycle"): return "root-utils"
    if stem in ("batch_runner", "trajectory_compressor", "mini_swe_runner"): return "root-batch"
    return None
def node_of_path(p):
    seg = p.split("/")
    if len(seg) == 1: return root_family(seg[0][:-3])
    return seg[0] if seg[0] in PKGS else None
def node_of_module(mod):
    top = mod.split(".")[0]
    if top in PKGS: return top
    return root_family(top)
edges = collections.Counter(); lazy = collections.Counter(); nfiles = collections.Counter()
for f in files:
    src = node_of_path(f)
    if src is None: continue
    nfiles[src] += 1
    try: tree = ast.parse(open(os.path.join(root, f), encoding="utf-8").read())
    except SyntaxError: print("SYNTAXERR", f); continue
    toplevel = set(id(n) for n in tree.body)
    for n in ast.walk(tree):
        mods = []
        if isinstance(n, ast.Import): mods = [a.name for a in n.names]
        elif isinstance(n, ast.ImportFrom) and n.level == 0 and n.module: mods = [n.module]
        for m in mods:
            dst = node_of_module(m)
            if dst and dst != src:
                edges[(src, dst)] += 1
                if id(n) not in toplevel: lazy[(src, dst)] += 1
print("NODES", dict(nfiles))
for (s, d), c in sorted(edges.items(), key=lambda x: -x[1]):
    print(f"{s}\t{d}\t{c}\t{lazy[(s,d)]}")
```

## 3. `checkcites.py`: link resolution

Checks that every permalink in the given Markdown files names a path that exists in the pinned
clone with at least the cited number of lines. It cannot see a wrong quotation. Arguments: the
two clone paths, then the Markdown files.

```python
"""Check every permalink in the given Markdown files: the path exists in the clone and has at least that many lines.
Usage: checkcites.py <hermes clone> <selfevo clone> <file.md>...  Imports nothing from the clones."""
import re, sys, os
H, E = sys.argv[1], sys.argv[2]
HB = "https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/"
EB = "https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/"
bad = n = 0
cache = {}
for md in sys.argv[3:]:
    text = open(md, encoding="utf-8").read()
    for base, root in ((HB, H), (EB, E)):
        for m in re.finditer(re.escape(base) + r"([^)#\s>]+)(?:#L(\d+)(?:-L(\d+))?)?", text):
            n += 1
            p = os.path.join(root, m.group(1))
            if not os.path.isfile(p) and not os.path.isdir(p):
                bad += 1; print("NOPATH", md, m.group(1)); continue
            if m.group(2):
                if p not in cache:
                    cache[p] = sum(1 for _ in open(p, encoding="utf-8", errors="replace"))
                hi = int(m.group(3) or m.group(2))
                if hi > cache[p]:
                    bad += 1; print("NOLINE", md, m.group(1), hi, cache[p])
    for m in re.finditer(r"\]\((H|E)/", text):
        bad += 1; print("UNEXPANDED placeholder in", md)
print(f"checked {n} permalinks, {bad} bad")
sys.exit(1 if bad else 0)
```

## 4. `spot.py`: quotation match

Checks that a substring occurs within a cited line range. Argument: a tab-separated file with
one row per check: `H` or `E` (which clone), path, first line, last line, substring. On a miss it
prints the lines where the first forty characters do occur. The session ran six batches (122, 44,
25, 5, 16 and 8 rows); the row files were scratch and are not kept, since each row restates a
citation that is in the research files.

```python
"""Spot-check: each row is repo, path, first line, last line, substring that must occur in that line range. Reads only."""
import sys
H="/home/user/hermes-agent/"; E="/home/user/hermes-agent-self-evolution/"
rows = [l.rstrip("\n").split("\t") for l in open(sys.argv[1], encoding="utf-8") if l.strip() and not l.startswith("#")]
bad = 0
for repo, path, a, b, needle in rows:
    lines = open((H if repo == "H" else E) + path, encoding="utf-8", errors="replace").read().split("\n")
    seg = " ".join(x.strip() for x in lines[int(a)-1:int(b)])
    seg2 = "".join(lines[int(a)-1:int(b)])
    if needle not in seg and needle not in seg2:
        bad += 1
        # find where it actually is
        hits = [i+1 for i, x in enumerate(lines) if needle[:40] in x]
        print(f"MISS {path}:{a}-{b}  {needle[:60]!r}  actual lines: {hits[:5]}")
print(f"{len(rows)} checked, {bad} missed")
```

## 5. `fixcites.py`: rewrite a line fragment for one path

Used to correct the nine citations that were a few lines off. Arguments: the Markdown file, then
one or more `path|old-fragment|new-fragment` triples.

```python
"""Rewrite line fragments for one file path in a Markdown file: both the link target and a link text that repeats the fragment."""
import re, sys
md, fixes = sys.argv[1], sys.argv[2:]
s = open(md, encoding="utf-8").read()
for fx in fixes:
    path, old, new = fx.split("|")
    base = path.split("/")[-1]
    n0 = s.count(f"{path}#{old})")
    # link text forms: `base#old` or `#old` immediately before the target
    s = re.sub(r"\[`(" + re.escape(base) + r")?#" + re.escape(old) + r"`\]\(([^)]*" + re.escape(path) + r")#" + re.escape(old) + r"\)",
               lambda m: f"[`{m.group(1) or ''}#{new}`]({m.group(2)}#{new})", s)
    s = s.replace(f"{path}#{old})", f"{path}#{new})")
    print(fx, "targets:", n0, "left:", s.count(f"{path}#{old})"))
open(md, "w", encoding="utf-8").write(s)
```

## Commands used without a script

- Census: `git ls-files -z '*.py' | xargs -0 wc -l`, grouped by first path segment with `awk`.
- Cold-pass search: the `rg` pattern is quoted in `evidence-log.md` section 3.
- DSPy constructor check: for each release, `pip download "dspy==<version>" --no-deps -d .`,
  then `unzip` of `dspy/teleprompt/gepa/gepa.py` only, then `grep -c max_steps` and
  `grep -c '\*\*kwargs'` on that file. Nothing from the wheel was imported or run.
- A search with `rg` or `git grep` was given an explicit path and `< /dev/null`; without a path,
  inside a compound command, `rg` read standard input and hung.

#!/usr/bin/env python3
"""The strategic node's dry-run merge, made concrete: for every Practice-wide path present in both
default tips, a three-way merge with the transplant pin as the base (both copies descend from it).
Reports: shared, identical, differing, clean merges (files a clean merge would change), conflicts
(files and hunks), and waiting (one-sided). usage: dry_run_merge.py <jc-root> <jc-ref> <oce-root>
<oce-ref> <base-ref-in-oce> <out>"""
import subprocess, sys, tempfile, os
jc, jcref, oce, oceref, base, out = sys.argv[1:7]
PREFIXES = ('.agent/directives/', '.agent/rules/', '.agent/skills/', '.agent/practice-core/', '.agent/sub-agents/', '.agent/hooks/')
def tree(root, ref):
    o = subprocess.run(['git','-C',root,'ls-tree','-r',ref], capture_output=True, text=True, check=True).stdout
    d = {}
    for line in o.splitlines():
        meta, path = line.split('\t',1)
        if path.startswith(PREFIXES) and '/evals/' not in path and '/fixtures/' not in path:
            d[path] = meta.split()[2]
    return d
def blob(root, ref, path):
    return subprocess.run(['git','-C',root,'show',f'{ref}:{path}'], capture_output=True, text=True).stdout
a, b = tree(jc, jcref), tree(oce, oceref)
basetree = tree(oce, base)
shared = sorted(set(a) & set(b)); only_a = sorted(set(a)-set(b)); only_b = sorted(set(b)-set(a))
identical = [p for p in shared if a[p]==b[p]]
differing = [p for p in shared if a[p]!=b[p]]
clean, conflicts, nobase = [], [], []
hunks_total = 0
with tempfile.TemporaryDirectory() as td:
    for p in differing:
        if p not in basetree:
            nobase.append(p); continue
        ours, theirs, bs = [os.path.join(td, n) for n in ('ours','theirs','base')]
        open(ours,'w').write(blob(jc,jcref,p)); open(theirs,'w').write(blob(oce,oceref,p)); open(bs,'w').write(blob(oce,base,p))
        r = subprocess.run(['git','merge-file','-p','-L','jc','-L','base','-L','oce',ours,bs,theirs], capture_output=True, text=True)
        if r.returncode == 0: clean.append(p)
        else:
            n = r.stdout.count('<<<<<<<'); hunks_total += n; conflicts.append((p,n))
lines = [f"# Dry-run merge of the Practice-wide text, JC.net {jcref} against OCE {oceref}, base {base}", "",
         f"shared {len(shared)}; identical {len(identical)}; differing {len(differing)}; waiting (one-sided) {len(only_a)} JC.net-only, {len(only_b)} OCE-only",
         f"of the differing: clean three-way merge {len(clean)}; conflict {len(conflicts)} files, {hunks_total} hunks; no base at the pin {len(nobase)}", "",
         "## Conflicts (file, hunks)", *[f"- `{p}` {n}" for p,n in conflicts], "",
         "## No base at the pin (both sides added after the transplant)", *[f"- `{p}`" for p in nobase], "",
         "## Clean merges", *[f"- `{p}`" for p in clean]]
open(out,'w').write('\n'.join(lines)+'\n'); print('\n'.join(lines[2:4]))

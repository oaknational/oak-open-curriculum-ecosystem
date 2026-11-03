#!/usr/bin/env python3
"""First mechanical pass over the dry-run merge's conflicts: normalise the host-bound tokens on both
sides (estate names, organisation and repository names, package scopes, bot names, product words)
and re-merge; a conflict hunk that disappears under normalisation is a host-binding, every other
hunk is a wording or substance difference for the ledger's read."""
import re, subprocess, sys, tempfile, os
jc, jcref, oce, oceref, base, listing, out = sys.argv[1:8]
SUBS = [(r'jimcresswell\.net|jimCresswell|JC\.net|jcdotnet', 'HOST'), (r'open-curriculum-ecosystem|EngraphCode|@engraph|engraph', 'HOST'),
        (r'oak-open-curriculum|@oaknational|oaknational|Oak National|Oak', 'HOST'), (r'el-graphael|jimbot-of-the-devonshire-jimbots', 'BOT'),
        (r'\bmain\b|\bengraph\b', 'DEFAULT'), (r'castr', 'HOST'), (r'curriculum', 'HOST')]
def norm(t):
    for pat, rep in SUBS: t = re.sub(pat, rep, t)
    return t
def blob(root, ref, path):
    return subprocess.run(['git','-C',root,'show',f'{ref}:{path}'], capture_output=True, text=True).stdout
files = [l[3:].split('`')[0] for l in open(listing) if l.startswith('- `') and l.rstrip().split()[-1].isdigit()]
rows = []; gone = 0; left = 0
with tempfile.TemporaryDirectory() as td:
    for p in files:
        ours, theirs, bs = [os.path.join(td, n) for n in ('o','t','b')]
        open(ours,'w').write(norm(blob(jc,jcref,p))); open(theirs,'w').write(norm(blob(oce,oceref,p))); open(bs,'w').write(norm(blob(oce,base,p)))
        r = subprocess.run(['git','merge-file','-p',ours,bs,theirs], capture_output=True, text=True)
        n = r.stdout.count('<<<<<<<') if r.returncode else 0
        rows.append((p, n))
        if n == 0: gone += 1
        else: left += 1
lines = [f"# Conflicts after host-token normalisation: {gone} files resolve (host binding only), {left} files keep {sum(n for _,n in rows)} hunks (wording or substance)", "",
         "## Still conflicting (file, hunks after normalisation)", *[f"- `{p}` {n}" for p,n in rows if n], "",
         "## Resolved by normalisation (host bindings)", *[f"- `{p}`" for p,n in rows if not n]]
open(out,'w').write('\n'.join(lines)+'\n'); print(lines[0])

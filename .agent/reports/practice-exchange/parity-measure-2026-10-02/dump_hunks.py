#!/usr/bin/env python3
"""Dump every conflict hunk of the dry-run merge (JC.net main vs OCE engraph, base the transplant
pin) into one file for the ledger's read, with the file, the hunk index and the two sides."""
import subprocess, sys, tempfile, os
jc, jcref, oce, oceref, base, listing, out = sys.argv[1:8]
def blob(root, ref, path):
    return subprocess.run(['git','-C',root,'show',f'{ref}:{path}'], capture_output=True, text=True).stdout
files = [l[3:].split('`')[0] for l in open(listing) if l.startswith('- `') and l.rstrip().split()[-1].isdigit()]
chunks = []; total = 0
with tempfile.TemporaryDirectory() as td:
    for p in files:
        ours, theirs, bs = [os.path.join(td, n) for n in ('o','t','b')]
        open(ours,'w').write(blob(jc,jcref,p)); open(theirs,'w').write(blob(oce,oceref,p)); open(bs,'w').write(blob(oce,base,p))
        r = subprocess.run(['git','merge-file','-p','--diff3','-L','JC','-L','BASE','-L','OCE',ours,bs,theirs], capture_output=True, text=True)
        text = r.stdout; i = 0; n = 0
        while True:
            a = text.find('<<<<<<< JC', i)
            if a < 0: break
            e = text.find('>>>>>>> OCE', a); e = text.find('\n', e) + 1 if e >= 0 else len(text)
            n += 1; total += 1
            chunks.append(f"\n### {p} — hunk {n}\n\n```text\n{text[a:e].rstrip()}\n```\n")
            i = e
lines = [f"# Conflict hunks for the ledger's read: {total} hunks in {len(files)} files (JC.net main vs OCE engraph, base {base})"] + chunks
open(out,'w').write('\n'.join(lines)+'\n'); print(lines[0]); print("bytes", os.path.getsize(out))

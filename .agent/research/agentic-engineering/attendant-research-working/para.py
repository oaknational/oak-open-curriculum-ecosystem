import sys,re,glob
pat=re.compile(r'[Oo]wner')
date=re.compile(r'20\d\d-\d\d-\d\d')
tot=0;n=0
for f in sys.argv[1:]:
    t=open(f).read()
    paras=re.split(r'\n\s*\n',t)
    hits=[p for p in paras if pat.search(p) and date.search(p)]
    if hits:
        print(f"\n##### {f}")
        for p in hits:
            print(p.strip()); print()
            tot+=len(p); n+=1
sys.stderr.write(f"{n} paras {tot} chars\n")

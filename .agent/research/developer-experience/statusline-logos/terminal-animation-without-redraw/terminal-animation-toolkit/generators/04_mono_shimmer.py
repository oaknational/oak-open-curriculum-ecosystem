import math
import os
os.makedirs("renders", exist_ok=True)
# ---------- acorn art ----------
ACORN=r"""⠀⠀⠀⠀⠀⠀⢠⣾⠇⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⣿⣇⣀⠀⠀⠀⠀
⠀⢀⣴⡾⠟⢻⣿⠛⠛⢿⣦⡀⠀
⢀⣾⠏⠀⠀⠀⢿⣇⠀⠀⠙⣿⡄
⣾⡏⠀⠀⠀⠀⠈⢿⣧⣄⠀⠸⣿
⠿⣷⡄⠀⠀⠀⠀⠀⠈⠛⠿⠿⠿
⠀⢿⣇⠀⠀⠀⠀⠀⠀⠀⢰⣿⠀
⠀⠘⣿⡄⠀⠀⠀⠀⠀⠀⣼⡏⠀
⠀⠀⠈⢿⣦⡀⠀⠀⣠⣾⠟⠀⠀
⠀⠀⠀⠀⠙⠿⣶⣾⠟⠋⠀⠀⠀"""
BIT={(0,0):0x01,(0,1):0x02,(0,2):0x04,(0,3):0x40,(1,0):0x08,(1,1):0x10,(1,2):0x20,(1,3):0x80}
BLANK={'\u2800',' ','\u3000',''}
PAD=7; RG=12.5          # glow reach (dot units)

# ---------- precomputed green->black palette + perceptual L* ----------
N=48
TOP=(74,240,128)        # brightest green
def s2l(c):
    c/=255.0
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c):
    c=max(0.0,min(1.0,c))
    return 255*(12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055)
TL=[s2l(c) for c in TOP]
def Lstar(Y):
    t=Y
    f=t**(1/3) if t>0.008856 else 7.787*t+16/116
    return 116*f-16
PAL=[]; PALL=[]
for i in range(N):
    f=i/(N-1)
    lin=[TL[k]*f for k in range(3)]
    rgb=tuple(int(round(l2s(v))) for v in lin)
    Y=0.2126*lin[0]+0.7152*lin[1]+0.0722*lin[2]
    PAL.append(rgb); PALL.append(Lstar(Y))
def by_v(v):                         # linear-light fraction -> index
    return max(0,min(N-1,int(round(v*(N-1)))))
def by_L(targetL):                   # nearest perceptual L*
    best=0;bd=1e9
    for i,L in enumerate(PALL):
        d=abs(L-targetL)
        if d<bd:bd=d;best=i
    return best

# ---------- geometry ----------
lines=ACORN.split('\n'); cols=max(len(l) for l in lines); rows=len(lines)
W=cols+2*PAD; H=rows+2*PAD
acorn=[['\u2800']*W for _ in range(H)]
for y,l in enumerate(lines):
    for x,ch in enumerate(l): acorn[y+PAD][x+PAD]=ch
adot=[]; sx=sy=0
for cy in range(H):
    for cx in range(W):
        ch=acorn[cy][cx]
        if ch in BLANK: continue
        m=ord(ch)-0x2800
        for (dx,dy),b in BIT.items():
            if m&b:
                adot.append((cx*2+dx,cy*4+dy)); sx+=cx*2+dx; sy+=cy*4+dy
ax=sx/len(adot); ay=sy/len(adot)
arad=max(math.hypot(px-ax,py-ay) for px,py in adot)
def ndist(px,py):
    return min(math.hypot(px-qx,py-qy) for qx,qy in adot)
def hsh(x,y):
    v=((x*73856093)^(y*19349663))&0xffffffff
    return ((v*2654435761)&0xffffffff)/0xffffffff

# ---------- tuning ----------
BG_TOP=0.24          # bg ambient ceiling (fraction of full glow)
LEG=14.0             # legibility floor for ΔL* (steady inner dots)
SHIM=46.0            # max shimmer ΔL* at outer edge
def smooth(t): t=max(0,min(1,t)); return t*t*(3-2*t)

aset=set(adot)
cells=[[None]*W for _ in range(H)]   # (char,fg,bg,blink, amp)
for cy in range(H):
    for cx in range(W):
        ch=acorn[cy][cx]
        if ch not in BLANK:                                   # ACORN: multi-green rim, static
            cxd,cyd=cx*2+1,cy*4+2
            rim=min(1.0,math.hypot(cxd-ax,cyd-ay)/arad)       # outer dots brighter
            vf=0.58+0.42*rim
            fg=PAL[by_v(vf)]; bg=PAL[by_v(0.06)]
            cells[cy][cx]=(ch,fg,bg,False,0.0); continue
        # glow cell
        Xc,Yc=cx*2+1,cy*4+2
        dC=ndist(Xc,Yc)                                       # distance to acorn surface
        g=max(0.0,1.0-dC/RG)**1.25                            # glow luminance field
        if g<=0.001:
            cells[cy][cx]=(' ',None,PAL[0],False,0.0); continue
        bg=PAL[by_v(g*BG_TOP)]
        bgL=PALL[by_v(g*BG_TOP)]
        # shimmer amplitude A from the falloff: 0 at shell -> 1 outward
        A=smooth((dC-1.5)/(RG-1.5))
        dL = LEG + (SHIM-LEG)*A                               # per-cell ΔL* knob
        fi=by_L(min(100.0,bgL+dL))
        fi=min(fi, by_v(0.50))
        fg=PAL[fi]
        # braille halftone: density tracks glow g
        mask=0; lit=0
        for (dx,dy),b in BIT.items():
            px,py=cx*2+dx,cy*4+dy
            gd=max(0.0,1.0-ndist(px,py)/RG)**1.25
            if gd>0.26+hsh(px,py)*0.44: mask|=b; lit+=1
        blink = A>0.05 and mask!=0
        amp = (lit/8.0)*dL if blink else 0.0                  # perceived swing estimate
        if mask: cells[cy][cx]=(chr(0x2800+mask),fg,bg,blink,amp)
        else:    cells[cy][cx]=(' ',None,bg,False,0.0)

def sgr(fg=None,bg=None,blink=False):
    p=['5'] if blink else []
    if fg is not None:p+=['38','2',*map(str,fg)]
    if bg is not None:p+=['48','2',*map(str,bg)]
    return '\033['+';'.join(p)+'m'
# animate=False strips SGR 5 -> the on-phase (full halftone shown) as a still.
def build(animate):
    return '\n'.join(''.join(sgr(c[1],c[2],c[3] and animate)+c[0] for c in (cells[cy][cx] for cx in range(W)))+'\033[0m' for cy in range(H))
payload=build(True); payload_static=build(False)
def esc(p): return p.replace('\\','\\\\').replace("'","\\'").replace('\033','\\033').replace('\n','\\n')
bash="#!/usr/bin/env bash\n# Monochrome green->black acorn glow. Precomputed perceptual palette; per-cell ΔL*(fg,bg)\n"
bash+="# drives shimmer amplitude = glow falloff (0 at shell, rising outward). Acorn rim-lit, static.\n"
bash+="# Reduce-motion: OAK_STATUSLINE_MOTION=off|static emits the static on-phase frame\n"
bash+="# (SGR 5 stripped). Populate it from the OS setting via a SessionStart hook if wanted\n"
bash+="# (e.g. macOS `defaults read com.apple.universalaccess reduceMotion`); never poll per emission.\n"
bash+="cat > /dev/null 2>&1\n\n"
bash+='case "${OAK_STATUSLINE_MOTION:-auto}" in\n'
bash+="  off|static|none|reduce) printf '%b\\n' $'"+esc(payload_static)+"' ;;\n"
bash+="  *) printf '%b\\n' $'"+esc(payload)+"' ;;\n"
bash+="esac\n"
open('renders/acorn_mono.sh','w').write(bash)
import os; os.chmod('renders/acorn_mono.sh',0o700)

# ---------- previews ----------
from PIL import Image
DOT=6
def render(on):
    img=Image.new('RGB',(W*2*DOT,H*4*DOT),(0,0,0))
    for cy in range(H):
        for cx in range(W):
            ch,fg,bg,bl,amp=cells[cy][cx]
            for X in range(2):
                for Y in range(4):
                    x0=(cx*2+X)*DOT;y0=(cy*4+Y)*DOT
                    for a in range(DOT):
                        for b in range(DOT): img.putpixel((x0+a,y0+b),bg)
            if ch in BLANK or fg is None: continue
            if bl and not on: continue
            m=ord(ch)-0x2800
            for (dx,dy),bit in BIT.items():
                if m&bit:
                    x0=(cx*2+dx)*DOT;y0=(cy*4+dy)*DOT
                    for a in range(DOT-1):
                        for b in range(DOT-1): img.putpixel((x0+a,y0+b),fg)
    return img
on=render(True); off=render(False)
on.save('renders/acorn_mono.gif',save_all=True,append_images=[off],duration=620,loop=0,disposal=2)
on.save('renders/acorn_mono_on.png')
# amplitude map: per-cell perceived shimmer swing
amax=max(c[4] for r in cells for c in r) or 1
amp=Image.new('RGB',(W*2*DOT,H*4*DOT),(0,0,0))
for cy in range(H):
    for cx in range(W):
        v=cells[cy][cx][4]/amax
        col=(int(30*v),int(255*v),int(120*v))
        for X in range(2*DOT):
            for Y in range(4*DOT):
                amp.putpixel((cx*2*DOT+X,cy*4*DOT+Y),col)
amp.save('renders/acorn_mono_amp.png')
print("canvas",W,"x",H,"palette",N,"blink",sum(1 for r in cells for c in r if c[3]),"amax%.1f"%amax)
print("palette L* range: %.1f .. %.1f"%(PALL[0],PALL[-1]))

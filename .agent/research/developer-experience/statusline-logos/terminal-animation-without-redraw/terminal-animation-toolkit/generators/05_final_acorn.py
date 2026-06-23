import math
import os
os.makedirs("renders", exist_ok=True)
from collections import deque
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
PAD=7
def P(cx,cy): return (cx+0.5, 2*(cy+0.5))
# palette
N=48; TOP=(74,240,128)
def s2l(c):
    c/=255.
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c):
    c=max(0.,min(1.,c)); return 255*(12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055)
TL=[s2l(c) for c in TOP]
def Lstar(Y):
    f=Y**(1/3) if Y>0.008856 else 7.787*Y+16/116
    return 116*f-16
PAL=[];PALL=[]
for i in range(N):
    f=i/(N-1);lin=[TL[k]*f for k in range(3)]
    PAL.append(tuple(int(round(l2s(v))) for v in lin))
    PALL.append(Lstar(0.2126*lin[0]+0.7152*lin[1]+0.0722*lin[2]))
def by_v(v):return max(0,min(N-1,int(round(v*(N-1)))))
def by_L(t):
    best=0;bd=1e9
    for i,L in enumerate(PALL):
        d=abs(L-t)
        if d<bd:bd=d;best=i
    return best
def clamp8(x): return max(0,min(255,int(round(x))))
def warmcool(rgb,lit,amt=1.0):
    r,g,b=rgb; warm=max(0.,lit); cool=max(0.,-lit)
    return (clamp8(r+warm*44*amt-cool*12*amt),
            clamp8(g+warm*12*amt+cool*6*amt),
            clamp8(b-warm*18*amt+cool*42*amt))
# masks
lines=ACORN.split('\n');cols=max(len(l) for l in lines);rows=len(lines)
W=cols+2*PAD;H=rows+2*PAD
ink=[[False]*W for _ in range(H)];glyph=[['\u2800']*W for _ in range(H)]
for y,l in enumerate(lines):
    for x,ch in enumerate(l):
        if ch not in BLANK: ink[y+PAD][x+PAD]=True; glyph[y+PAD][x+PAD]=ch
ext=[[False]*W for _ in range(H)];q=deque()
for x in range(W):
    for y in(0,H-1):
        if not ink[y][x]: ext[y][x]=True;q.append((x,y))
for y in range(H):
    for x in(0,W-1):
        if not ink[y][x] and not ext[y][x]: ext[y][x]=True;q.append((x,y))
while q:
    x,y=q.popleft()
    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
        nx,ny=x+dx,y+dy
        if 0<=nx<W and 0<=ny<H and not ink[ny][nx] and not ext[ny][nx]:
            ext[ny][nx]=True;q.append((nx,ny))
interior=[[(not ink[y][x] and not ext[y][x]) for x in range(W)] for y in range(H)]
ink_cells=[(x,y) for y in range(H) for x in range(W) if ink[y][x]]
nonink=[(x,y) for y in range(H) for x in range(W) if not ink[y][x]]
def nearest(cells,px,py):
    bx=by=None;bd=1e9
    for cx,cy in cells:
        sx,sy=P(cx,cy);d=(px-sx)**2+(py-sy)**2
        if d<bd:bd=d;bx,by=sx,sy
    return bx,by,math.sqrt(bd)
def hsh(x,y):
    v=((x*73856093)^(y*19349663))&0xffffffff
    return ((v*2654435761)&0xffffffff)/0xffffffff
# params
RG=5.4;U=1.35;Wt=1.4;BG_TOP=0.26;LEG=14.;SHIM=46.
LIGHT=(-0.6,-0.8); ln=math.hypot(*LIGHT); LIGHT=(LIGHT[0]/ln,LIGHT[1]/ln)
BASE=0.64; AMP=0.17                       # subtle directional shading
def smooth(t):t=max(0.,min(1.,t));return t*t*(3-2*t)
INT_BG=(0,0,0)                            # constant near-black interior
cells=[[None]*W for _ in range(H)]
for cy in range(H):
    for cx in range(W):
        px,py=P(cx,cy)
        if ink[cy][cx]:                                   # RIBBON: original braille halftone, subtle dir light
            bx,by,_=nearest(nonink,px,py)
            nx,ny=(px-bx),(py-by); nl=math.hypot(nx,ny) or 1
            nrm=(-nx/nl,-ny/nl)                           # outward normal ~ toward nearest edge
            lit=nrm[0]*LIGHT[0]+nrm[1]*LIGHT[1]
            v=BASE+AMP*lit
            base=PAL[by_v(min(0.95,v))]                   # ribbon fully static now
            fg=warmcool(base,lit,1.0)                      # warm lit flank / cool shadow flank
            cells[cy][cx]=(glyph[cy][cx],fg,(0,0,0),False,0.0); continue
        if interior[cy][cx]:                              # BOUNDED INTERIOR: constant near-black, dead steady
            cells[cy][cx]=(' ',None,INT_BG,False,0.0); continue
        # EXTERIOR: tight umbra + shimmering glow halftone
        _,_,dC=nearest(ink_cells,px,py)
        Lg=max(0.,1.-dC/RG)*smooth((dC-U)/Wt)
        if Lg<=0.004:
            cells[cy][cx]=(' ',None,PAL[0],False,0.0); continue
        bg=PAL[by_v(Lg*BG_TOP)];bgL=PALL[by_v(Lg*BG_TOP)]
        A=smooth((dC-(U+Wt))/(RG-(U+Wt)));dL=LEG+(SHIM-LEG)*A
        fi=min(by_L(min(100.,bgL+dL)),by_v(0.5))
        mask=0
        for (dx,dy),b in BIT.items():
            sx=cx+(dx+0.5)/2.;sy=2*(cy+(dy+0.5)/4.)
            _,_,d2=nearest(ink_cells,sx,sy)
            lg=max(0.,1.-d2/RG)*smooth((d2-U)/Wt)
            if lg>0.16+hsh(cx*2+dx,cy*4+dy)*0.40:mask|=b
        bl=A>0.05 and mask!=0
        cells[cy][cx]=((chr(0x2800+mask) if mask else ' '),(PAL[fi] if mask else None),bg,bl,0.0)

def sgr(fg=None,bg=None,bl=False):
    p=['5'] if bl else []
    if fg is not None:p+=['38','2',*map(str,fg)]
    if bg is not None:p+=['48','2',*map(str,bg)]
    return '\033['+';'.join(p)+'m'
# animate=False strips SGR 5 -> the on-phase (calm composition) as a still.
def build(animate):
    return '\n'.join(''.join(sgr(c[1],c[2],c[3] and animate)+c[0] for c in (cells[cy][cx] for cx in range(W)))+'\033[0m' for cy in range(H))
payload=build(True); payload_static=build(False)
def esc(p): return p.replace('\\','\\\\').replace("'","\\'").replace('\033','\\033').replace('\n','\\n')
b="#!/usr/bin/env bash\n# Mono acorn: original braille halftone on the curve, subtly side-lit; bounded interior\n# held constant near-black & steady; tight umbra; shimmering glow outside. A few curve glints.\n"
b+="# Reduce-motion: OAK_STATUSLINE_MOTION=off|static emits the static on-phase frame\n"
b+="# (SGR 5 stripped). Populate it from the OS setting via a SessionStart hook if wanted\n"
b+="# (e.g. macOS `defaults read com.apple.universalaccess reduceMotion`); never poll per emission.\n"
b+="cat > /dev/null 2>&1\n\n"
b+='case "${OAK_STATUSLINE_MOTION:-auto}" in\n'
b+="  off|static|none|reduce) printf '%b\\n' $'"+esc(payload_static)+"' ;;\n"
b+="  *) printf '%b\\n' $'"+esc(payload)+"' ;;\n"
b+="esac\n"
open('renders/acorn_final.sh','w').write(b)
import os;os.chmod('renders/acorn_final.sh',0o700)
from PIL import Image
DOT=6
def render(on):
    img=Image.new('RGB',(W*2*DOT,H*4*DOT),(0,0,0))
    for cy in range(H):
        for cx in range(W):
            ch,fg,bg,bl,_=cells[cy][cx]
            for X in range(2*DOT):
                for Y in range(4*DOT):img.putpixel((cx*2*DOT+X,cy*4*DOT+Y),bg)
            if ch in BLANK or fg is None:continue
            if bl and not on:continue
            m=ord(ch)-0x2800
            for (dx,dy),bit in BIT.items():
                if m&bit:
                    x0=(cx*2+dx)*DOT;y0=(cy*4+dy)*DOT
                    for a in range(DOT-1):
                        for bb in range(DOT-1):img.putpixel((x0+a,y0+bb),fg)
    return img
on=render(True);off=render(False)
on.save('renders/acorn_final.gif',save_all=True,append_images=[off],duration=620,loop=0,disposal=2)
on.save('renders/acorn_final_on.png')
print("interior",sum(sum(r) for r in interior),"glints",sum(1 for r in cells for c in r if c[3] and ink[0]),"blink-total",sum(1 for r in cells for c in r if c[3]))

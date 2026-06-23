import math, struct
import os
os.makedirs("renders", exist_ok=True)
frames_raw = [
r"""⠀⠀⠀⠀⣰⠟⠀⠀⠀
⠀⣠⡶⠛⣿⠛⠷⣦⡀
⣼⠋⠀⠀⠹⣧⣀⠘⣷
⢻⣇⠀⠀⠀⠀⠉⢛⡛
⠀⢻⣄⠀⠀⠀⢀⣾⠁
⠀⠀⠙⢷⣤⣴⠟⠁⠀""",
r"""⠀⠀⠀⠀⠀⣠⡿⠂⠀⠀⠀
⠀⠀⢀⣤⣴⣿⣷⣤⣀⠀⠀
⢀⣼⠟⠉⠀⣿⡄⠈⠻⣷⡀
⣾⠇⠀⠀⠀⠘⢿⣄⡀⠘⣷
⠻⣷⠀⠀⠀⠀⠀⠉⠛⢛⠛
⠀⢿⡆⠀⠀⠀⠀⠀⢀⣿⠀
⠀⠈⢿⣆⠀⠀⠀⢀⣾⠏⠀
⠀⠀⠀⠙⠷⣶⣶⠟⠁⠀⠀""",
r"""⠀⠀⠀⠀⠀⠀⢠⣾⠇⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⣿⣇⣀⠀⠀⠀⠀
⠀⢀⣴⡾⠟⢻⣿⠛⠛⢿⣦⡀⠀
⢀⣾⠏⠀⠀⠀⢿⣇⠀⠀⠙⣿⡄
⣾⡏⠀⠀⠀⠀⠈⢿⣧⣄⠀⠸⣿
⠿⣷⡄⠀⠀⠀⠀⠀⠈⠛⠿⠿⠿
⠀⢿⣇⠀⠀⠀⠀⠀⠀⠀⢰⣿⠀
⠀⠘⣿⡄⠀⠀⠀⠀⠀⠀⣼⡏⠀
⠀⠀⠈⢿⣦⡀⠀⠀⣠⣾⠟⠀⠀
⠀⠀⠀⠀⠙⠿⣶⣾⠟⠋⠀⠀⠀""",
]
ACORN = frames_raw[2]            # use the middle swirl as the "acorn"
PAD = 4                          # cells of glow room around it
R1  = 2.4                        # inner radius (dot units): steady glow
RMAX= 7.0                        # outer glow reach (dot units)

# bit layout: (dx,dy)->mask
BIT={(0,0):0x01,(0,1):0x02,(0,2):0x04,(0,3):0x40,
     (1,0):0x08,(1,1):0x10,(1,2):0x20,(1,3):0x80}
BLANK={'\u2800',' ','\u3000',''}

lines=ACORN.split('\n')
cols=max(len(l) for l in lines); rows=len(lines)
W=cols+2*PAD; H=rows+2*PAD
# acorn char grid on padded canvas
acorn=[['\u2800']*W for _ in range(H)]
for y,l in enumerate(lines):
    for x,ch in enumerate(l):
        acorn[y+PAD][x+PAD]=ch

# acorn dot coords (in dot space)
adots=set()
for cy in range(H):
    for cx in range(W):
        ch=acorn[cy][cx]
        if ch in BLANK: continue
        m=ord(ch)-0x2800
        for (dx,dy),bit in BIT.items():
            if m&bit: adots.add((cx*2+dx, cy*4+dy))
adots_list=list(adots)

def nearest(px,py):
    best=1e9
    for (ax,ay) in adots_list:
        d=(ax-px)**2+(ay-py)**2
        if d<best: best=d
    return math.sqrt(best)

def hsh(x,y):
    v=(x*73856093) ^ (y*19349663)
    v&=0xffffffff
    v=(v*2654435761)&0xffffffff
    return v/0xffffffff

# build glow dot bitmap + per-cell band
glowmask=[[0]*W for _ in range(H)]
cellband=[[None]*W for _ in range(H)]   # 'steady' / 'blink' / None
celldist=[[0.0]*W for _ in range(H)]
for cy in range(H):
    for cx in range(W):
        if any((cx*2+dx,cy*4+dy) in adots for (dx,dy) in BIT): 
            continue  # acorn cell, leave for acorn
        mask=0; mind=1e9
        for (dx,dy),bit in BIT.items():
            px,py=cx*2+dx, cy*4+dy
            d=nearest(px,py)
            mind=min(mind,d)
            if d<=RMAX:
                inten=max(0.0,1.0-d/RMAX)        # 1 near ->0 far
                inten=inten**1.3
                if inten> hsh(px,py)*0.95:        # dither -> sparser far
                    mask|=bit
        if mask:
            glowmask[cy][cx]=mask
            celldist[cy][cx]=mind
            cellband[cy][cx]='steady' if mind<R1 else 'blink'

# colors
ACORN_G=(46,204,113)     # green acorn
GLOW_NEAR=(150,255,190)  # light green
GLOW_FAR =(90,200,140)
BLACK=(0,0,0)
def lerp(a,b,t): return tuple(int(round(a[i]+(b[i]-a[i])*t)) for i in range(3))
def glowcol(d):
    t=min(1.0,d/RMAX)
    return lerp(GLOW_NEAR,GLOW_FAR,t)

def sgr(fg=None,bg=None,blink=False):
    p=[]
    if blink:p.append('5')
    if fg is not None:p+=['38','2',*map(str,fg)]
    if bg is not None:p+=['48','2',*map(str,bg)]
    return '\033['+';'.join(p)+'m'

# animate=False strips SGR 5 -> the on-phase (full glow shown) as a still.
def build(animate):
    out=[]
    for cy in range(H):
        s=''
        for cx in range(W):
            ch=acorn[cy][cx]
            if ch not in BLANK:                              # acorn
                s+=sgr(ACORN_G,BLACK)+ch
            elif glowmask[cy][cx]:                           # glow
                g=chr(0x2800+glowmask[cy][cx])
                blink = animate and cellband[cy][cx]=='blink'
                s+=sgr(glowcol(celldist[cy][cx]),BLACK,blink=blink)+g
            else:
                s+=sgr(bg=BLACK)+' '
        s+='\033[0m'
        out.append(s)
    return '\n'.join(out)
payload=build(True); payload_static=build(False)

def esc(p): return p.replace('\\','\\\\').replace("'","\\'").replace('\033','\\033').replace('\n','\\n')
bash="#!/usr/bin/env bash\n# Green acorn on black with a pulsing braille glow (density falls off by distance).\n"
bash+="# Inner glow is steady; outer glow blinks -> the halo breathes. Acorn is static.\n"
bash+="# Reduce-motion: OAK_STATUSLINE_MOTION=off|static emits the static on-phase frame\n"
bash+="# (SGR 5 stripped). Populate it from the OS setting via a SessionStart hook if wanted\n"
bash+="# (e.g. macOS `defaults read com.apple.universalaccess reduceMotion`); never poll per emission.\n"
bash+="cat > /dev/null 2>&1\n\n"
bash+='case "${OAK_STATUSLINE_MOTION:-auto}" in\n'
bash+="  off|static|none|reduce) printf '%b\\n' $'"+esc(payload_static)+"' ;;\n"
bash+="  *) printf '%b\\n' $'"+esc(payload)+"' ;;\n"
bash+="esac\n"
open('renders/acorn_glow.sh','w').write(bash)
import os; os.chmod('renders/acorn_glow.sh',0o700)

# ---- GIF preview at dot resolution ----
from PIL import Image, ImageDraw
DOT=4
def render(on):
    img=Image.new('RGB',(W*2*DOT,H*4*DOT),BLACK)
    px=img.load()
    def putcell(cx,cy,mask,col):
        for (dx,dy),bit in BIT.items():
            if mask&bit:
                X0=(cx*2+dx)*DOT; Y0=(cy*4+dy)*DOT
                for a in range(DOT-1):
                    for b in range(DOT-1):
                        img.putpixel((X0+a,Y0+b),col)
    for cy in range(H):
        for cx in range(W):
            ch=acorn[cy][cx]
            if ch not in BLANK:
                putcell(cx,cy,ord(ch)-0x2800,ACORN_G)
            elif glowmask[cy][cx]:
                if cellband[cy][cx]=='steady' or on:
                    putcell(cx,cy,glowmask[cy][cx],glowcol(celldist[cy][cx]))
    return img
on=render(True); off=render(False)
on.save('renders/acorn_glow.gif',save_all=True,append_images=[off],duration=650,loop=0,disposal=2)
on.save('renders/acorn_glow_on.png')
print("canvas",W,"x",H,"  acorn dots",len(adots_list))
gc=sum(1 for r in cellband for v in r if v)
print("glow cells:",gc," steady:",sum(1 for r in cellband for v in r if v=='steady')," blink:",sum(1 for r in cellband for v in r if v=='blink'))

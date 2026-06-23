import math, colorsys
import os
os.makedirs("renders", exist_ok=True)
frames_raw=[None,None,r"""⠀⠀⠀⠀⠀⠀⢠⣾⠇⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⣿⣇⣀⠀⠀⠀⠀
⠀⢀⣴⡾⠟⢻⣿⠛⠛⢿⣦⡀⠀
⢀⣾⠏⠀⠀⠀⢿⣇⠀⠀⠙⣿⡄
⣾⡏⠀⠀⠀⠀⠈⢿⣧⣄⠀⠸⣿
⠿⣷⡄⠀⠀⠀⠀⠀⠈⠛⠿⠿⠿
⠀⢿⣇⠀⠀⠀⠀⠀⠀⠀⢰⣿⠀
⠀⠘⣿⡄⠀⠀⠀⠀⠀⠀⣼⡏⠀
⠀⠀⠈⢿⣦⡀⠀⠀⣠⣾⠟⠀⠀
⠀⠀⠀⠀⠙⠿⣶⣾⠟⠋⠀⠀⠀"""]
ACORN=frames_raw[2]; PAD=8; NSPOKE=12; RMAX=11.0
BIT={(0,0):0x01,(0,1):0x02,(0,2):0x04,(0,3):0x40,(1,0):0x08,(1,1):0x10,(1,2):0x20,(1,3):0x80}
BLANK={'\u2800',' ','\u3000',''}
lines=ACORN.split('\n'); cols=max(len(l) for l in lines); rows=len(lines)
W=cols+2*PAD; H=rows+2*PAD
acorn=[['\u2800']*W for _ in range(H)]
for y,l in enumerate(lines):
    for x,ch in enumerate(l): acorn[y+PAD][x+PAD]=ch
adset=set(); sx=sy=n=0
for cy in range(H):
    for cx in range(W):
        ch=acorn[cy][cx]
        if ch in BLANK: continue
        m=ord(ch)-0x2800
        for (dx,dy),b in BIT.items():
            if m&b:
                adset.add((cx*2+dx,cy*4+dy)); sx+=(cx*2+dx)*0.5; sy+=(cy*4+dy)*0.5; n+=1
CX,CY=sx/n,sy/n
def hsh(x,y):
    v=((x*73856093)^(y*19349663))&0xffffffff
    return ((v*2654435761)&0xffffffff)/0xffffffff
def field(X,Y):
    dx,dy=X-CX,Y-CY; r=math.hypot(dx,dy)
    g=max(0.0,1.0-r/RMAX)**0.70
    th=math.atan2(dy,dx)
    seg=(th%(2*math.pi))/(2*math.pi)*NSPOKE
    k=int(round(seg))%NSPOKE
    spoke_th=k/NSPOKE*2*math.pi
    ad=abs(((th-spoke_th+math.pi)%(2*math.pi))-math.pi)
    width=(2*math.pi/NSPOKE)*0.34
    s=math.exp(-(ad/width)**2)
    core=math.exp(-r/2.4)
    I=g*(0.06+0.94*s)+0.45*core
    return min(1.0,I),s,k,r
def hue_rgb(k,sat,val):
    h=(k/NSPOKE+0.33)%1.0   # offset so a green ray sits near top
    return tuple(c*255 for c in colorsys.hsv_to_rgb(h,sat,val))
def sgr(fg=None,bg=None,blink=False):
    p=['5'] if blink else []
    if fg is not None:p+=['38','2',*(str(int(max(0,min(255,round(c))))) for c in fg)]
    if bg is not None:p+=['48','2',*(str(int(max(0,min(255,round(c))))) for c in bg)]
    return '\033['+';'.join(p)+'m'
def lerp(a,b,t): return tuple(a[i]+(b[i]-a[i])*t for i in range(3))
ACORN_BG=(6,52,30); ACORN_FG=(80,235,140)
cells=[[None]*W for _ in range(H)]
for cy in range(H):
    for cx in range(W):
        ch=acorn[cy][cx]
        if ch not in BLANK:
            cells[cy][cx]=(ch,ACORN_FG,ACORN_BG,False); continue
        Xc=(cx*2+1)*0.5; Yc=(cy*4+2)*0.5
        I,s,k,r=field(Xc,Yc)
        bg=hue_rgb(k, 0.90-0.42*I, min(1.0,I*1.18))   # static colour field
        mask=0
        for (dx,dy),b in BIT.items():
            Id,sd,kd,rd=field((cx*2+dx)*0.5,(cy*4+dy)*0.5)
            if Id > 0.20 + hsh(cx*2+dx,cy*4+dy)*0.38:  # halftone tracks the rays
                mask|=b
        blink=(s>0.35 and r>0.50*RMAX) or (I>0.30 and hsh(cx+7,cy+3)>0.78)
        if mask:
            spec=lerp(hue_rgb(k,0.45,1.0),(255,255,255),0.30)
            cells[cy][cx]=(chr(0x2800+mask),spec,bg,blink)
        else:
            cells[cy][cx]=(' ',None,bg,False)
# animate=False strips SGR 5 -> the on-phase (rays + glints shown) as a still.
def line_for(cy,animate):
    return ''.join(sgr(fg,bg,bl and animate)+ch for (ch,fg,bg,bl) in (cells[cy][cx] for cx in range(W)))+'\033[0m'
def build(animate): return '\n'.join(line_for(cy,animate) for cy in range(H))
payload=build(True); payload_static=build(False)
def esc(p): return p.replace('\\','\\\\').replace("'","\\'").replace('\033','\\033').replace('\n','\\n')
bash="#!/usr/bin/env bash\n# Polychrome radial-spoke glow. BG = static smooth hue field; FG braille = Ben-Day halftone\n"
bash+="# tracking the rays; outer spoke glints blink (shading drops on alternate frames). Acorn static.\n"
bash+="# Reduce-motion: OAK_STATUSLINE_MOTION=off|static emits the static on-phase frame\n"
bash+="# (SGR 5 stripped). Populate it from the OS setting via a SessionStart hook if wanted\n"
bash+="# (e.g. macOS `defaults read com.apple.universalaccess reduceMotion`); never poll per emission.\n"
bash+="cat > /dev/null 2>&1\n\n"
bash+='case "${OAK_STATUSLINE_MOTION:-auto}" in\n'
bash+="  off|static|none|reduce) printf '%b\\n' $'"+esc(payload_static)+"' ;;\n"
bash+="  *) printf '%b\\n' $'"+esc(payload)+"' ;;\n"
bash+="esac\n"
open('renders/acorn_spokes.sh','w').write(bash)
import os; os.chmod('renders/acorn_spokes.sh',0o700)
from PIL import Image
DOT=5
def render(on):
    img=Image.new('RGB',(W*2*DOT,H*4*DOT),(0,0,0))
    for cy in range(H):
        for cx in range(W):
            ch,fg,bg,bl=cells[cy][cx]
            for X in range(2):
                for Y in range(4):
                    x0=(cx*2+X)*DOT; y0=(cy*4+Y)*DOT
                    for a in range(DOT):
                        for b in range(DOT):
                            img.putpixel((x0+a,y0+b),tuple(int(c) for c in bg))
            if ch in BLANK or fg is None: continue
            if bl and not on: continue
            m=ord(ch)-0x2800
            for (dx,dy),bit in BIT.items():
                if m&bit:
                    x0=(cx*2+dx)*DOT; y0=(cy*4+dy)*DOT
                    for a in range(DOT-1):
                        for b in range(DOT-1):
                            img.putpixel((x0+a,y0+b),tuple(int(c) for c in fg))
    return img
on=render(True); off=render(False)
on.save('renders/acorn_spokes.gif',save_all=True,append_images=[off],duration=600,loop=0,disposal=2)
on.save('renders/acorn_spokes_on.png')
print("canvas",W,"x",H,"blink",sum(1 for r in cells for c in r if c[3]))

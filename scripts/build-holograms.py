"""Real game footage -> Sobel-weighted, spatially stratified point-cloud film.

Sources are local and read-only. Raw review clips remain in work/, never in the
public build. Stable blue-noise candidates keep the film temporally coherent.
"""
from pathlib import Path
import argparse, gzip, hashlib, json, struct, subprocess
import numpy as np
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets/holograms';OUT.mkdir(exist_ok=True)
REVIEW=ROOT/'work/game-review';REVIEW.mkdir(exist_ok=True)
p=argparse.ArgumentParser();p.add_argument('key');p.add_argument('source');p.add_argument('--start',type=float,default=0);p.add_argument('--kind',default='runtime recording');args=p.parse_args()
source=Path(args.source);key=args.key
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
review=REVIEW/f'{key}.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-stream_loop','-1','-i',str(source),'-ss',str(args.start),'-t','8','-an','-vf','scale=640:360,fps=12','-c:v','libx264','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(review)],check=True)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(review),'-vf','scale=320:180','-f','rawvideo','-pix_fmt','gray','-'])
frames=np.frombuffer(raw,np.uint8).reshape(-1,180,320).astype(np.float32)
rng=np.random.default_rng(502); noise=rng.random((180,320))
# Stratified candidate grid: a hard one-pixel separation in each 2x2 cell.
ys,xs=np.mgrid[:90,:160];xs=xs*2+rng.integers(0,2,xs.shape);ys=ys*2+rng.integers(0,2,ys.shape)
films=[]
for im in frames:
    pad=np.pad(im,1,mode='edge')
    gx=pad[:-2,2:]+2*pad[1:-1,2:]+pad[2:,2:]-pad[:-2,:-2]-2*pad[1:-1,:-2]-pad[2:,:-2]
    gy=pad[2:,:-2]+2*pad[2:,1:-1]+pad[2:,2:]-pad[:-2,:-2]-2*pad[:-2,1:-1]-pad[:-2,2:]
    edge=np.hypot(gx,gy); edge/=max(float(np.percentile(edge,97)),1)
    weights=np.clip(edge[ys,xs],0,1)
    # Weighted exponential race, using the SAME blue-noise candidates per frame.
    rank=-np.log(np.maximum(noise[ys,xs],1e-8))/np.maximum(weights,1e-6)
    ids=np.sort(np.argpartition(rank.ravel(),4000)[:4000])
    xy=np.column_stack((xs.ravel()[ids]*65535//319,ys.ravel()[ids]*65535//179)).astype('<u2')
    films.append(xy)
payload=struct.pack('<4sHHHH',b'DARB',len(films),4000,12,1)+np.stack(films).tobytes()
encoded=gzip.compress(payload,compresslevel=9,mtime=0)
dest=OUT/f'{key}.darb';dest.write_bytes(encoded)
assert len(encoded)<=400*1024, (key,len(encoded),'hologram exceeds budget')
poster=Image.new('RGB',(960,540),'#05070d');d=ImageDraw.Draw(poster)
for x,y in films[len(films)//2]:
    xx=int(x)/65535*960;yy=int(y)/65535*540;d.ellipse((xx,yy,xx+1.3,yy+1.3),fill='#dfe8ff')
poster.save(OUT/f'{key}.png',optimize=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(review),'-frames:v','1',str(REVIEW/f'{key}.jpg')],check=True)
manifest=ROOT/'docs/deep-field/r05/sources.json'
entries=json.loads(manifest.read_text()) if manifest.exists() else []
entries=[e for e in entries if e['key']!=key]
entries.append({'key':key,'source':source.name,'source_sha256':sha(source),'kind':args.kind,'raw_allowed':False,'frames':len(films),'fps':12,'points':4000,'bytes_gzip':len(encoded),'binary_sha256':sha(dest),'pipeline':'Sobel / per-frame p97 / deterministic spatially stratified weighted sampling / Uint16 xy / gzip'})
manifest.write_text(json.dumps(entries,indent=2))
print(key,len(films),'frames;',len(encoded),'bytes')

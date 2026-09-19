"""Local audio -> non-reconstructable spectral/envelope shapes. No audio ships."""
from pathlib import Path
import hashlib, json, subprocess
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DATA = Path('C:/Users/GAMING/mk-voice-data')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def pcm(p):
    return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-t','10','-ac','1','-ar','16000','-f','f32le','-']),dtype='<f4')
def envelope(p):
    a=pcm(p); v=np.array([np.sqrt(np.mean(c*c)) for c in np.array_split(a,96)])
    return np.round(v/max(float(v.max()),1e-6),3).tolist()
def spectrum(p):
    a=pcm(p); spec=np.abs(np.fft.rfft(np.stack([a[i:i+512]*np.hanning(512) for i in range(0,len(a)-512,256)])))
    # 12 temporal slices x 24 frequency bands; shape only, separately normalised.
    s=np.array([[np.log1p(c).mean() for c in np.array_split(row.mean(axis=0),24)] for row in np.array_split(spec,12)])
    return np.round(s/max(float(s.max()),1e-6),3).tolist()
score=DATA/'evaluations/2df3ef8cf195f6b76c1cb759/37e15e273ce44db19a034e36a1a0a62b/scorecard.json'
s=json.loads(score.read_text()); c=s['groups']['external']['clips'][0]
reference=Path(c['input']['path']); clone=Path(c['output']['path'])
assert sha(reference)==c['input']['sha256'] and sha(clone)==c['output']['sha256']
sources={
 'hazalqoum':DATA/'conversions/b5482b427f4049479b09c2194d0d1d78/output.wav',
 'daheeh':DATA/'calibration/proof/tune-recovery-20260912/round17-daheeh-preview-r01-media/converted.wav',
 'bayoumi':DATA/'archive/dr-rabie-superseded-20260917/754715b61864462a8627c4ea6d38bccb/preview.wav',
}
env={k:envelope(p) for k,p in sources.items() if p.exists()}
# No substitute waveform for characters without a recoverable clone output.
result={'reference':spectrum(reference),'clone':spectrum(clone),'dialRadians':round(c['target_cosine']['value']*np.pi*1.5,5),'envelopes':env}
out=ROOT/'src/assets/voice'; out.mkdir(exist_ok=True)
portrait_source=Path('C:/Users/GAMING/Downloads/chars site/char1.mp4')
assert sha(portrait_source)=='dbe271050e88343f462d75df2452f8979a3b60f8cb1baa7746b1bf0fa77bb135', 'Owner-approved portrait source changed'
poster=ROOT/'work/voice-shapes-source.png';poster.parent.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(portrait_source),'-frames:v','1',str(poster)],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(poster),'-vf','scale=800:800:force_original_aspect_ratio=decrease,pad=800:800:(ow-iw)/2:(oh-ih)/2:color=0x05070d','-frames:v','1','-c:v','libaom-av1','-crf','35','-still-picture','1',str(out/'daheeh.avif')],check=True)
assert (out/'daheeh.avif').stat().st_size <= 150000
# Sobel edge positions from the approved full-body video poster, never luminance.
im=np.asarray(Image.open(poster).convert('L').resize((180,320)),dtype=float)
p=np.pad(im,1,mode='edge'); gx=p[:-2,2:]+2*p[1:-1,2:]+p[2:,2:]-p[:-2,:-2]-2*p[1:-1,:-2]-p[2:,:-2]; gy=p[2:,:-2]+2*p[2:,1:-1]+p[2:,2:]-p[:-2,:-2]-2*p[:-2,1:-1]-p[:-2,2:]
edge=np.hypot(gx,gy); edge[:8]=0;edge[-8:]=0;edge[:,:8]=0;edge[:,-8:]=0
prob=np.minimum(1,edge/max(np.percentile(edge,97),1)); rng=np.random.default_rng(5)
ids=rng.choice(edge.size,1800,replace=False,p=prob.ravel()/prob.sum()); y,x=np.divmod(ids,180)
result['daheehEdges']=[[round((float(xx)/180-.5)*.5625,4),round(.5-float(yy)/320,4)] for xx,yy in zip(x,y)]
(ROOT/'src/lib/signal/voice-shapes.json').write_text(json.dumps(result,separators=(',',':')))
receipt={'comparison':{'scorecard_sha256':sha(score),'reference_sha256':sha(reference),'clone_sha256':sha(clone),'kind':'Real external held-out LibriSpeech fixture, public-374 model. Shape demonstration, not owner likeness acceptance.'},'envelopes':{k:sha(p) for k,p in sources.items() if p.exists()},'unavailable_clone_outputs':['keeber','lemby'],'illustration':'Owner supplied char1.mp4, confirmed El Daheeh and public portfolio use on 2026-09-19; poster derived from first frame.','missing_illustrations':['keeber','hazalqoum','lemby','bayoumi']}
(ROOT/'docs/deep-field/r05/voice-provenance.json').write_text(json.dumps(receipt,indent=2))
print('Voice shapes and approved Daheeh poster written; no audio copied.')

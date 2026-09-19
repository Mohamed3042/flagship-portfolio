"""Encode read-only owner sources into the isolated landing asset tree.

The public/ and node_modules/ directories are junctions: never write there.
No generation or downloads. Reproducible source hashes accompany every encode.
"""
from pathlib import Path
import hashlib, json, subprocess

ROOT = Path(__file__).resolve().parents[1]
W = ROOT / 'public/worlds'
OUT = ROOT / 'src/assets/darb'
OUT.mkdir(parents=True, exist_ok=True)

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)

sources = [
    ('cake-studio', 'cake-studio/clips/CST-047.mp4', 'cake-studio/manifest.json', 'CST-047.jpg'),
    ('disney', 'disney2/clips/DSN2-019.mp4', 'disney.html', 'kf-19.jpg'),
    ('strings', 'assets/strings/wan-production/accepted/CTS-A-022.mp4', 'strings.html', 'CTS-KF22-the-cut.png'),
    ('academy', 'academy/clips/ACA-001.mp4', 'academy/manifest.json', 'ACA-001.jpg'),
    ('spotify', 'spotify/live/j09-pupil.mp4', 'spotify.html', 'j09-pupil.jpg'),
]
manifest = []
for key, rel, ledger, poster in sources:
    source = W / rel
    text = (W / ledger).read_text(encoding='utf-8')
    assert source.name in text and poster in text, (key, 'clip/poster absent from source ledger')
    dest = OUT / f'{key}.mp4'
    run('-i', source, '-t', '5', '-an', '-vf', 'scale=960:540:force_original_aspect_ratio=increase,crop=960:540,fps=24',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-maxrate', '1500k', '-bufsize', '1500k',
        '-g', '12', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest)
    assert dest.stat().st_size <= 1_200_000, (key, dest.stat().st_size)
    manifest.append(dict(key=key, source=f'public/worlds/{rel}', ledger=f'public/worlds/{ledger}',
                         source_sha256=sha(source), output=str(dest.relative_to(ROOT)), bytes=dest.stat().st_size,
                         sha256=sha(dest), selection='exact existing poster/clip pair'))

# Owner confirmed 2026-09-19 in this task: El Daheeh, approved for public use.
source = Path(r'C:\Users\GAMING\Downloads\chars site\char1.mp4')
dest = OUT / 'daheeh.mp4'
# A five-second reversible idle, first 2.5 seconds then back to its first pose.
# This creates an actual seamless endpoint without inventing intermediate imagery.
run('-i', source, '-filter_complex',
    '[0:v]trim=duration=2.5,setpts=PTS-STARTPTS,fps=24,scale=450:800,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]',
    '-map', '[v]', '-an', '-c:v', 'libx264', '-crf', '26', '-g', '12', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest)
run('-i', source, '-frames:v', '1', '-update', '1', OUT / 'daheeh-source.png')
manifest.append(dict(key='daheeh', source='owner-supplied char1.mp4', source_sha256=sha(source),
                     output=str(dest.relative_to(ROOT)), sha256=sha(dest), bytes=dest.stat().st_size,
                     provenance='Owner confirmed El Daheeh and public portfolio use in this task, 2026-09-19.',
                     edit='Audio removed. First 2.5 seconds followed by reverse, 5 seconds total.'))
(ROOT / 'docs/deep-field/r05/media-provenance.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps([{k: r[k] for k in ('key', 'bytes')} for r in manifest], indent=2))

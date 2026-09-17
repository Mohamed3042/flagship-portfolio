"""Package browser evidence only. No original assets or font binaries are copied."""
from pathlib import Path
from PIL import Image
import hashlib, json, shutil
ROOT=Path(__file__).resolve().parents[1]
review=ROOT/'docs/showroom-review'
review.mkdir(parents=True,exist_ok=True)
shots=['desktop','mobile','desktop-work','desktop-atlas','arabic-mobile','desktop-box','desktop-flow']
provenance=[]
for name in shots:
    source=ROOT/'.impeccable/review/ghpages'/(name+'.png')
    destination=review/(name+'.jpg')
    with Image.open(source) as image:
        image.convert('RGB').save(destination,quality=90,optimize=True)
    provenance.append({'file':destination.name,'source':str(source.relative_to(ROOT)).replace('\\','/'),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),'method':'Playwright screenshot of the actual local GitHub Pages build; JPEG copy, quality 90; no image generation.'})
shutil.copy2(ROOT/'.impeccable/review/ghpages/report.json',review/'browser-report.json')
shutil.copy2(ROOT/'.impeccable/review/final/lifecycle.json',review/'lifecycle-report.json')
(review/'provenance.json').write_text(json.dumps(provenance,indent=2),encoding='utf8')
print('Packaged:',[(p.name,p.stat().st_size) for p in review.iterdir()])

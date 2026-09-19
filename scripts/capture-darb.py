"""R05 strips, from actual settled browser frames. Images never exceed 600 KB."""
from pathlib import Path
import io, json, argparse
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--out', default=str(ROOT / 'docs/deep-field/r05'))
p.add_argument('--only', default='hero')
args=p.parse_args(); OUT=Path(args.out); OUT.mkdir(parents=True,exist_ok=True)

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.goto('http://127.0.0.1:4618/en',wait_until='networkidle'); page.wait_for_timeout(2600)
    chapters=page.evaluate('window.__deepField.chapters')
    def snap(c, local):
        u=c['from']+(c['to']-c['from'])*local
        page.evaluate('u=>{const r=document.querySelector("[data-signal-runway]"), f=document.querySelector("[data-signal-frame]");scrollTo({top:r.getBoundingClientRect().top+scrollY+(r.offsetHeight-f.offsetHeight)*u,behavior:"instant"});window.__deepField.settle();}',u)
        page.evaluate('async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await new Promise(r=>setTimeout(r,260));}')
        return Image.open(io.BytesIO(page.screenshot())).convert('RGB')
    def sheet(name,cells,columns=5):
        w,h=480,324
        result=Image.new('RGB',(w*columns,h*((len(cells)+columns-1)//columns)), '#05070d')
        draw=ImageDraw.Draw(result)
        for i,(label,img) in enumerate(cells):
            x,y=i%columns*w,i//columns*h
            result.paste(img.resize((w,300)),(x,y)); draw.text((x+8,y+307),label,fill='white')
        quality=85
        while True:
            result.save(OUT/name,quality=quality,optimize=True)
            if (OUT/name).stat().st_size<=600*1024 or quality<=25:break
            quality-=5
    if args.only in ('hero','all'):
        c=chapters[0]
        sheet('anamorph-strip.jpg',[(n,snap(c,u)) for n,u in [('scatter',0),('half',.27),('aligned',.61),('half-past',.79),('burst',.97)]])
    if args.only in ('road','all'):
        sheet('road-strip.jpg',[(c['id'],snap(c,.5)) for c in chapters if c['act']=='road'],3)
    if args.only in ('gate','all'):
        c=next(c for c in chapters if c['act']=='worlds')
        sheet('gate-strip.jpg',[(n,snap(c,u)) for n,u in [('approach',.32),('hold',.61),('pass-through',.85),('beyond',.99)]],4)
    if args.only in ('voice','all'):
        cells=[]
        for c in chapters:
            if c['act']!='voice':continue
            for name,u in [('picture',.36),('edges',.6),('stars',.79)]:cells.append((c['id']+' / '+name,snap(c,u)))
        sheet('voice-sheet.jpg',cells,3)
    if args.only in ('workshop','all'):
        sheet('workshop-strip.jpg',[(c['id']+' / '+name,snap(c,u)) for c in chapters if c['id'].startswith('skill-') for name,u in [('input',.18),('output',.82)]],4)
    if args.only in ('games','all'):
        sheet('holograms.jpg',[(c['id']+' / '+str(u),snap(c,u)) for c in chapters if c['act']=='games' for u in [.37,.61,.74]],3)
    browser.close()

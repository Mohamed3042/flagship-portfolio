"""Read DARB's beat distances and full-screen portal interval off the browser."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from signal_probes import SEEK, HOLD_FLOOR, RELEASE_FLOOR, ASSEMBLY_FLOOR

ROOT = Path(__file__).resolve().parents[1]
report = {}
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    for width, height in [(1440, 900), (390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.goto('http://127.0.0.1:4618/en', wait_until='networkidle')
        page.wait_for_timeout(2800)
        data = page.evaluate('''() => {
          const r=document.querySelector('[data-signal-runway]'),f=document.querySelector('[data-signal-frame]');
          const range=r.offsetHeight-f.offsetHeight;
          return {viewport:[innerWidth,innerHeight],runwayViewportHeights:r.offsetHeight/innerHeight,rangePx:range,
            beats:window.__deepField.chapters.map(c=>({id:c.id,beatClass:c.beatClass,
              totalPx:(c.to-c.from)*range,assemblyPx:c.window?(c.window.in1-c.window.in0)*range:0,
              holdPx:c.beatClass==='station'||c.beatClass==='road'?0:(c.window.out0-c.window.in1)*range,
              releasePx:c.window?(c.window.out1-c.window.out0)*range:0}))};
        }''')
        data['classes'] = {}
        for kind in ('reading', 'gate', 'station', 'road'):
            beats = [b for b in data['beats'] if b['beatClass'] == kind]
            data['classes'][kind] = {'count':len(beats),'totalPx':sum(b['totalPx'] for b in beats),
                'minimums':{key:min(b[key] for b in beats) for key in ('totalPx','assemblyPx','holdPx','releasePx')}}
        data['readingFloorsPassed'] = all(b['assemblyPx']>=ASSEMBLY_FLOOR and b['holdPx']>=HOLD_FLOOR and b['releasePx']>=RELEASE_FLOOR
            for b in data['beats'] if b['beatClass'] in ('reading','gate'))
        world = page.evaluate('window.__deepField.chapters.find(c=>c.act==="worlds")')
        samples = []
        for step in range(76, 200):
            local = step / 200
            page.evaluate(SEEK, world['from']+(world['to']-world['from'])*local)
            page.evaluate('async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}')
            plate = page.evaluate('''()=>{
              const e=document.querySelector('[data-active=true] [data-signal-portal]');
              if(!e)return null;
              const r=e.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;
              const corners=[[0,0],[innerWidth,0],[0,innerHeight],[innerWidth,innerHeight]];
              return {opacity:Number(getComputedStyle(e).opacity), covers:corners.every(([x,y])=>
                ((x-cx)/(r.width/2))**2+((y-cy)/(r.height/2))**2<=1)};
            }''')
            samples.append({'local':local,**(plate or {'opacity':0,'covers':False})})
        screen = [s for s in samples if s['covers'] and s['opacity']>.1]
        data['insideWorld'] = {'samplingLocalStep':.005,'samples':samples,
            'coversAllFourViewportCornersAbove10PercentOpacityPx':
            ((screen[-1]['local']-screen[0]['local'])*(world['to']-world['from'])*data['rangePx']) if screen else 0}
        report[f'{width}x{height}'] = data
        page.close()
    browser.close()
(ROOT/'docs/deep-field/r05/timing.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:{q:v[q] for q in ('runwayViewportHeights','rangePx','classes','readingFloorsPassed')} for k,v in report.items()},indent=2))
raise SystemExit(0 if all(v['readingFloorsPassed'] for v in report.values()) else 1)

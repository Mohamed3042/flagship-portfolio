"""Real input rim/plate registration and the required two-frame lag plant."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
from signal_probes import REGISTRATION_RECORD, REGISTRATION_PX, registration_result
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    page=b.new_page(viewport={'width':1440,'height':900})
    page.goto('http://127.0.0.1:4618/en',wait_until='networkidle'); page.wait_for_timeout(2600)
    c=page.evaluate('window.__deepField.chapters.find(c=>c.act==="worlds")')
    page.evaluate('u=>{const r=document.querySelector("[data-signal-runway]"), f=document.querySelector("[data-signal-frame]");scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-f.offsetHeight)*u);window.__deepField.resume();}',c['from'])
    page.wait_for_timeout(600);page.evaluate(REGISTRATION_RECORD)
    for i in range(32):
        page.mouse.wheel(0,70);page.wait_for_timeout(45)
    page.wait_for_timeout(500)
    frames=page.evaluate('()=>{window.__darbRecording=false;return window.__darbRegistration}')
    report=registration_result(frames)
    report['passed']=report['frames']>20 and report['worstPx']<=REGISTRATION_PX and report['lagWorstPx']>REGISTRATION_PX
    report['samples']=frames
    (ROOT/'docs/deep-field/r05/registration.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k!='samples'}))
    b.close()
    raise SystemExit(0 if report['passed'] else 1)

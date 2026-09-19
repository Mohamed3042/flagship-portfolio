from pathlib import Path
import sys,json,hashlib,urllib.request
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from signal_probes import SEEK
from playwright.sync_api import sync_playwright
BASE='https://mohamed3042.github.io/flagship-portfolio-v2'
ROOT=Path(__file__).resolve().parents[1]
report={'url':BASE,'views':{}}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
 for lang,width,height in [('en',1440,900),('ar',390,844)]:
  ctx=b.new_context(viewport={'width':width,'height':height},is_mobile=width<700,has_touch=width<700)
  page=ctx.new_page();errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('requestfailed',lambda r:failed.append({'url':r.url,'failure':r.failure}))
  response=page.goto(BASE+'/'+lang+'/',wait_until='networkidle',timeout=60000)
  page.wait_for_function('window.__deepField && window.__deepField.chapters.length===46',timeout=30000)
  page.wait_for_timeout(1800)
  chapters=page.evaluate('window.__deepField.chapters')
  films=[]
  for c in chapters:
   if c['act']!='games':continue
   page.evaluate(SEEK,c['hold'])
   page.wait_for_function('(id)=>window.__deepField.hologram().loaded.includes(id)',arg=c['id'],timeout=30000)
   films.append(page.evaluate('window.__deepField.hologram()'))
  voice=next(c for c in chapters if c['id']=='voice-daheeh')
  page.evaluate(SEEK,voice['hold']);page.wait_for_function('(()=>{const v=document.querySelector("#signal-voice-daheeh video");return v&&v.readyState>=2&&!v.seeking})()',timeout=30000)
  video=page.locator('#signal-voice-daheeh video').evaluate('(v)=>({ready:v.readyState,policy:v.dataset.policy,muted:v.muted,loop:v.loop})')
  view={'status':response.status,'chapters':len(chapters),'holograms':films,'daheeh':video,
   'rawGameVideos':page.locator('[data-act=games] video').count(),
   'overflow':page.evaluate('document.documentElement.scrollWidth-innerWidth'),'pageErrors':errors,'failedRequests':[r for r in failed if r['failure']!='net::ERR_ABORTED'],'cancelledMediaRequests':[r for r in failed if r['failure']=='net::ERR_ABORTED']}
  report['views'][lang]=view
  ctx.close()
 b.close()
for lang in ('en','ar'):
 data=urllib.request.urlopen(BASE+'/'+lang+'/').read()
 expected=(ROOT/'work/v2-deploy'/lang/'index.html').read_bytes()
 report.setdefault('html',{})[lang]={'sha256':hashlib.sha256(data).hexdigest(),'matchesDeployBytes':data==expected}
cancelled=set(r['url'] for v in report['views'].values() for r in v['cancelledMediaRequests'])
report['cancelledAssetReadback']=[]
for url in cancelled:
 data=urllib.request.urlopen(url).read(); expected=(ROOT/'work/v2-deploy'/url.split('/flagship-portfolio-v2/')[1]).read_bytes()
 report['cancelledAssetReadback'].append({'url':url,'bytes':len(data),'matchesDeployBytes':data==expected})
report['passed']=all(x['matchesDeployBytes'] for x in report['cancelledAssetReadback']) and all(v['status']==200 and v['chapters']==46 and v['rawGameVideos']==0 and not v['pageErrors'] and not v['failedRequests'] and v['overflow']==0 and v['daheeh']['ready']>=2 for v in report['views'].values()) and all(v['matchesDeployBytes'] for v in report['html'].values())
(ROOT/'docs/deep-field/r05/live-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
raise SystemExit(0 if report['passed'] else 1)

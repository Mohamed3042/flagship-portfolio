"""Production-build regression checks for the bilingual Systems in Orbit home."""
from pathlib import Path
import argparse, json, sys, time
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4617')
parser.add_argument('--round', default='initial')
args = parser.parse_args()
OUT = ROOT / '.impeccable' / 'review' / args.round
OUT.mkdir(parents=True, exist_ok=True)
report = {'round': args.round, 'viewports': {}, 'checks': [], 'failures': []}
def check(name, passed, detail=''):
    report['checks'].append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed: report['failures'].append(name + ': ' + str(detail))
def capture(page, name, section=None):
    if section:
        y=page.locator(section).evaluate('(e)=>e.getBoundingClientRect().top+scrollY')
        page.evaluate('(y)=>window.scrollTo({top:y-76,behavior:"instant"})', y)
    else: page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
    page.wait_for_timeout(550)
    page.screenshot(path=str(OUT / (name + '.png')))
def attempt(name, action):
    try: action()
    except Exception as exc: check(name, False, str(exc)[:700])
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=CHROME, headless=True)
    for name,lang,w,h in [('desktop','en',1440,900),('mobile','en',390,844),('arabic-desktop','ar',1440,900),('arabic-mobile','ar',390,844)]:
        ctx=browser.new_context(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=w<700,has_touch=w<700)
        page=ctx.new_page(); page.set_default_timeout(6000)
        errors=[]; bad=[]
        page.on('pageerror',lambda error: errors.append(str(error)))
        page.on('response',lambda r: bad.append(str(r.status)+' '+r.url) if r.status>=400 else None)
        page.goto(args.base_url+'/'+lang,wait_until='networkidle'); page.wait_for_timeout(1200)
        data=page.evaluate('''()=>({height:document.documentElement.scrollHeight,width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,graphics:document.querySelector('[data-showroom]').dataset.graphics,firstProjectY:Math.round(document.querySelector('.sr-card h3').getBoundingClientRect().top+scrollY),workY:Math.round(document.querySelector('#work').getBoundingClientRect().top+scrollY),heroHeight:Math.round(document.querySelector('#intro').getBoundingClientRect().height),atlasHeight:Math.round(document.querySelector('#sky').getBoundingClientRect().height),visibleProjects:document.querySelectorAll('[data-sky-item]:not([hidden])').length,direction:document.documentElement.dir,rendererCount:document.querySelectorAll('[data-showroom-renderer]').length})''')
        report['viewports'][name]=data
        check(name+' no horizontal overflow',data['overflow']<=1,data['overflow'])
        check(name+' one heading and renderer',data['h1']==1 and data['rendererCount']==1,data)
        check(name+' bilingual direction',data['direction']==('rtl' if lang=='ar' else 'ltr'))
        check(name+' initial project count',data['visibleProjects']==12,data['visibleProjects'])
        check(name+' WebGL initialised',data['graphics']=='webgl',data['graphics'])
        capture(page,name)
        capture(page,name+'-work','#work')
        capture(page,name+'-atlas','#sky')
        def filter_tests():
            for group,total in [('public',4),('lab',7),('foundation',9),('all',12)]:
                page.locator('[data-sky-filter="'+group+'"]').click()
                check(name+' filter '+group,page.locator('[data-sky-item]:visible').count()==total)
            page.locator('[data-project-search]').fill('mk voice')
            check(name+' search',page.locator('[data-sky-item]:visible').count()==1)
            page.locator('[data-project-search]').fill('no-such-project-xyz')
            check(name+' empty state',page.locator('[data-project-empty]').is_visible())
            page.locator('[data-reset-search]').click(); page.locator('[data-project-more]').click()
            check(name+' show more 24',page.locator('[data-sky-item]:visible').count()==24)
            page.locator('[data-project-more]').click(); page.locator('[data-project-more]').click()
            check(name+' show all 38',page.locator('[data-sky-item]:visible').count()==38)
            report['viewports'][name]['allProjectsHeight']=page.evaluate('document.documentElement.scrollHeight')
            page.locator('[data-view-toggle]').click()
            check(name+' list view',page.locator('[data-atlas]').get_attribute('data-view')=='list')
            page.locator('[data-view-toggle]').click(); page.locator('[data-sky-filter="all"]').click()
        attempt(name+' directory interactions',filter_tests)
        def preview_tests():
            page.locator('[data-preview="preview-ask-repos"]').click()
            check(name+' quick view opens',page.locator('[data-showroom-dialog]').is_visible())
            check(name+' preview evidence',len(page.locator('[data-showroom-dialog] .sr-preview__boundary').inner_text())>50)
            page.keyboard.press('Escape')
            check(name+' preview closes',not page.locator('[data-showroom-dialog]').is_visible())
            check(name+' focus restored',page.evaluate('document.activeElement.dataset.preview')=='preview-ask-repos')
            card=page.locator('.sr-card').first
            card.locator('[data-shot]').nth(1).click()
            check(name+' screenshot selector',card.locator('[data-card-image]').get_attribute('src').endswith('askrepos-answer.webp'))
            card.locator('[data-zoom]').click()
            check(name+' zoom opens',page.locator('[data-showroom-dialog] img').get_attribute('src').endswith('askrepos-answer.webp'))
            page.keyboard.press('Escape'); card.locator('summary').click()
            check(name+' scope disclosure',card.locator('details').get_attribute('open') is not None)
            card.locator('summary').click()
        attempt(name+' preview interactions',preview_tests)
        def exhibit_tests():
            page.evaluate('window.scrollTo({top:0,behavior:"instant"})');page.wait_for_timeout(250)
            for kind in ['box','flow','truss']:
                page.locator('[data-select-exhibit="'+kind+'"]').click()
                check(name+' exhibit '+kind,page.locator('[data-exhibit]').get_attribute('data-kind')==kind)
                if kind in ['box','flow'] and name in ['desktop','mobile']: capture(page,name+'-'+kind)
            page.locator('[data-assembly]').focus();page.keyboard.press('Home');page.keyboard.press('End')
            page.locator('[data-motion-toggle]').click()
            check(name+' pause motion',page.locator('[data-motion-toggle]').get_attribute('aria-pressed')=='true')
            page.locator('[data-motion-toggle]').click()
            if w<700:
                page.locator('[data-mobile-menu] summary').click()
                check(name+' mobile menu',page.locator('[data-mobile-menu]').get_attribute('open') is not None)
                page.keyboard.press('Escape')
                check(name+' mobile menu Escape',page.locator('[data-mobile-menu]').get_attribute('open') is None)
        attempt(name+' exhibit and navigation',exhibit_tests)
        check(name+' no browser exceptions',not errors,errors)
        check(name+' no failing HTTP responses',not bad,bad)
        report['viewports'][name]['errors']=errors;report['viewports'][name]['httpErrors']=bad
        ctx.close()
    for name,w,lang,theme,motion,query in [('narrow',320,'en','dark','no-preference',''),('tablet',768,'en','dark','no-preference',''),('light',1440,'en','light','no-preference',''),('reduced',390,'en','dark','reduce',''),('static',390,'en','dark','no-preference','?showroom=static')]:
        ctx=browser.new_context(viewport={'width':w,'height':844},reduced_motion=motion)
        ctx.add_init_script('localStorage.setItem("mm-theme",'+json.dumps(theme)+')')
        page=ctx.new_page();page.goto(args.base_url+'/'+lang+query,wait_until='networkidle');page.wait_for_timeout(500)
        check(name+' responsive width',page.evaluate('document.documentElement.scrollWidth-innerWidth')<=1)
        if name=='reduced':check('native reduced motion',page.locator('[data-motion-toggle]').get_attribute('aria-pressed')=='true')
        if name=='static':check('static fallback screenshot',page.locator('[data-exhibit-fallback]').evaluate('(e)=>e.naturalWidth>0 && getComputedStyle(e).opacity!=="0"'))
        capture(page,name);ctx.close()
    ctx=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});page=ctx.new_page()
    page.goto(args.base_url+'/en',wait_until='load')
    check('no JavaScript all projects visible',page.locator('[data-sky-item]:visible').count()==38)
    check('no JavaScript poster available',page.locator('[data-exhibit-fallback]').is_visible())
    ctx.close();browser.close()
(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(report,ensure_ascii=True,indent=2));sys.exit(1 if report['failures'] else 0)

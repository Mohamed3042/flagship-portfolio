"""Check navigation lifecycle, native anchors, and renderer restoration."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
results=[]
def record(name, ok, detail=None): results.append({'name':name,'passed':bool(ok),'detail':detail})
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    for width in [1440,390]:
        ctx=browser.new_context(viewport={'width':width,'height':900},has_touch=width<700,is_mobile=width<700)
        page=ctx.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://127.0.0.1:4617/en',wait_until='networkidle');page.wait_for_timeout(250)
        for slug in ['ask-repos','spaceframe-world']:
            page.locator('.sr-card__title a[href="/en/work/'+slug+'"]').click()
            page.wait_for_url('**/en/work/'+slug);page.wait_for_timeout(300)
            record(str(width)+' story '+slug,page.locator('h1').count()==1)
            page.locator('.nav__brand').click();page.wait_for_url('**/en');page.wait_for_timeout(450)
            record(str(width)+' renderer restored '+slug,page.locator('[data-showroom]').get_attribute('data-graphics')=='webgl' and page.locator('[data-showroom-renderer]').count()==1)
        if width<700:
            page.locator('[data-mobile-menu] summary').click();page.locator('.sr-mobile-menu__links a[href="#lab"]').click()
        else: page.locator('.nav__links a[href="#lab"]').click()
        page.wait_for_timeout(300)
        record(str(width)+' lab navigation',page.locator('[data-sky-item]:visible').count()==7)
        page.locator('a[aria-label][href="/ar"]').click();page.wait_for_url('**/ar');page.wait_for_timeout(350)
        record(str(width)+' mirrored language',page.locator('html').get_attribute('dir')=='rtl' and page.locator('[data-showroom]').get_attribute('data-graphics')=='webgl')
        record(str(width)+' no lifecycle exceptions',not errors,errors);ctx.close()
    browser.close()
(ROOT/'.impeccable/review/final/lifecycle.json').write_text(json.dumps(results,indent=2),encoding='utf8')
print(json.dumps(results));raise SystemExit(1 if any(not r['passed'] for r in results) else 0)

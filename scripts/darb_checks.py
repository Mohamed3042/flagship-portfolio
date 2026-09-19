"""Round-five behavior checks, called by the existing signal suite."""
from signal_probes import REGISTRATION_RECORD, REGISTRATION_PX, registration_result, SEEK, SETTLE

def run_darb(browser, base_url, check, report):
    ctx=browser.new_context(viewport={'width':1440,'height':900})
    page=ctx.new_page(); requests=[]
    page.on('request',lambda r:requests.append(r.url))
    page.goto(base_url+'/en',wait_until='networkidle');page.wait_for_timeout(2800)
    chapters=page.evaluate('window.__deepField.chapters')
    media=page.evaluate('''()=>[...document.querySelectorAll('[data-signal-clip],[data-character-image],[data-hologram]')].map(e=>({url:new URL(e.dataset.src||e.dataset.hologram,location.href).href,id:e.closest('[data-chapter]').dataset.chapter}))''')
    mapping={m['url']:next(i for i,c in enumerate(chapters) if c['id']==m['id']) for m in media}
    early=[u for u in requests if u in mapping]
    check('DARB no dynamic media on the critical path',not early,early)
    check('DARB still document has no repeated eyebrow',page.locator('.signal__kicker').count()==0)
    check('DARB sixteen owner stations',sum(c['id'].startswith('skill-') for c in chapters)==16)
    requests.clear();violations=[]
    for i,c in enumerate(chapters):
        page.evaluate(SEEK,c['hold']);page.evaluate(SETTLE)
        page.wait_for_timeout(120)
        for url in requests:
            if url in mapping and abs(mapping[url]-i)>2:violations.append({'url':url,'chapter':c['id']})
        requests.clear()
    check('DARB actual media requests stay within two beats',not violations,violations)
    # A deliberately early unique request is caught by the same distance rule.
    late=next(m for m in media if m['id']=='voice-daheeh')
    page.evaluate(SEEK,0);requests.clear()
    page.evaluate('url=>fetch(url+"?lazy-plant=1")',late['url']);page.wait_for_timeout(100)
    planted=[url for url in requests if '?lazy-plant=1' in url and abs(mapping[url.split('?')[0]])>2]
    check('DARB early-media plant is rejected',bool(planted),planted)

    samples=[c['from']+(c['to']-c['from'])*t for c in chapters for t in (.18,.55,.82)]
    evaluate='us=>us.map(u=>{const s=window.__deepField.at(u);return [s.clipTime,s.hologramFrame,s.fold]})'
    forward=page.evaluate(evaluate,samples);reverse=page.evaluate(evaluate,list(reversed(samples)))[::-1]
    check('DARB clip frame, hologram frame and every two-pose action reverse exactly',forward==reverse)
    reverse[1][0]+=1
    check('DARB altered clip-time plant is rejected',forward!=reverse)
    moving=[c for c in chapters if c['beatClass']=='station']
    measured=page.evaluate('cs=>cs.map(c=>{const a=window.__deepField.at(c.from+.000001),b=window.__deepField.at(c.to-.000001);return {id:c.id,move:b.dolly-a.dolly,foldA:a.fold,foldB:b.fold}})',moving)
    check('DARB stations continue at road speed without a hold',all(c['move']>0 for c in measured),measured)
    check('DARB all sixteen workshop actions reach both poses',all(c['foldA']==0 and c['foldB']==1 for c in measured if c['id'].startswith('skill-')))

    world=next(c for c in chapters if c['act']=='worlds')
    page.evaluate(SEEK,world['from']);page.wait_for_timeout(500);page.evaluate('window.__deepField.resume()');page.evaluate(REGISTRATION_RECORD)
    for _ in range(29):page.mouse.wheel(0,70);page.wait_for_timeout(45)
    page.wait_for_timeout(300)
    frames=page.evaluate('()=>{window.__darbRecording=false;return window.__darbRegistration}')
    reg=registration_result(frames);report['darbRegistration']=reg
    check('DARB real-wheel rim/plate registration stays within 3px',reg['frames']>20 and reg['worstPx']<=REGISTRATION_PX,reg)
    check('DARB planted two-frame plate lag goes red',reg['lagWorstPx']>REGISTRATION_PX,reg)
    page.wait_for_timeout(2200)  # allow the preceding real wheel's native smooth-scroll tail to end
    page.evaluate(SEEK,world['hold']);page.evaluate(SETTLE);page.wait_for_timeout(600)
    video=page.locator('#signal-'+world['id']+' video')
    page.wait_for_function('''()=>{let v=document.querySelector('[data-chapter][data-active=true] video');return v&&v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-Number(v.dataset.time))<.05}''')
    fine=video.evaluate('(v)=>({policy:v.dataset.policy,time:v.currentTime,wanted:Number(v.dataset.time),paused:v.paused,muted:v.muted})')
    check('DARB fine pointer applies the pure clip time',fine['policy']=='scrub' and fine['paused'] and abs(fine['time']-fine['wanted'])<.05,fine)
    for c in chapters:
        if c['act']!='games':continue
        page.evaluate(SEEK,c['hold']);page.wait_for_timeout(600)
        got=page.evaluate('()=>({film:window.__deepField.hologram(),frame:window.__deepField.at(window.__deepField.state().u).hologramFrame})')
        check('DARB '+c['id']+' applies its real hologram frame',c['id'] in got['film']['loaded'] and got['film']['applied']==got['frame'],got)
    ctx.close()
    ctx=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page=ctx.new_page();page.goto(base_url+'/en',wait_until='networkidle');page.wait_for_timeout(2800)
    page.evaluate(SEEK,world['hold']);page.wait_for_timeout(1000)
    coarse=page.locator('#signal-'+world['id']+' video').evaluate('(v)=>({policy:v.dataset.policy,muted:v.muted,loop:v.loop,inline:v.playsInline,paused:v.paused})')
    check('DARB coarse pointer plays a muted inline loop',coarse['policy']=='loop' and coarse['muted'] and coarse['loop'] and coarse['inline'] and not coarse['paused'],coarse)
    report['darbMedia']={'criticalRequests':early,'lazyViolations':violations,'fine':fine,'coarse':coarse,'stations':measured}
    ctx.close()

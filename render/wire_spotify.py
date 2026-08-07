# -*- coding: utf-8 -*-
"""Weave the fifteen rendered shots into public/worlds/spotify.html.

The page already told its story in code. This puts a Cycles plate next to each
beat, so every claim the DOM makes in CSS is answered in real light a screen
later — and adds the theater button for the master cut.

Idempotent: run it twice and the second run is a no-op.
"""
import io, os, re, sys

HTML = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    '..', 'public', 'worlds', 'spotify.html')

# Technical slates are DERIVED, never transcribed. Hand-maintaining the same
# numbers twice — once in Latin digits, once in Arabic-Indic — is how a page
# ends up advertising a frame count the film does not have, and patching those
# numerals in place afterwards is worse: "٢٤٠" contains "٢٤", so a naive
# replace silently rewrites the wrong shot.
_AR = {'0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
       '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'}


def _ar(text):
    return ''.join(_AR.get(c, c) for c in str(text))


# shot: (frames, focal-from, focal-to, f-stop)  — must match film_spotify.SHOTS
OPTICS = {
    'line': (168, 32, 38, '2.8'),   'pulse': (120, 85, 105, '4'),
    'room': (216, 24, 28, '5.6'),   'arm': (144, 65, 85, '4'),
    'needle': (168, 90, 125, '9'),  'groove': (168, 100, 135, '11'),
    'quantize': (192, 50, 70, '4'), 'lanes': (192, 40, 48, '4'),
    'canyon': (240, 30, 38, '2.8'), 't01': (168, 85, 110, '6.3'),
    't02': (168, 85, 112, '6.3'),   't03': (144, 62, 85, '4'),
    'master': (216, 62, 105, '5.6'), 'chorus': (216, 58, 34, '4'),
    'outro': (192, 92, 52, '4'),
}
PLATE_W, PLATE_H = 1280, 536


def tech(shot):
    f, a, b, N = OPTICS[shot]
    en = '%d FRAMES · %d×%d · %d→%d MM · f/%s' % (f, PLATE_W, PLATE_H, a, b, N)
    ar = '%s إطارًا · %s×%s · %s→%s مم · f/%s' % (
        _ar(f), _ar(PLATE_W), _ar(PLATE_H), _ar(a), _ar(b), N)
    return en, ar


SHOT_TECH = {k: tech(k) for k in OPTICS}

TOTAL_FRAMES = sum(v[0] for v in OPTICS.values())
_secs = TOTAL_FRAMES / 24.0
RUNTIME_EN = '%d:%02d' % (_secs // 60, round(_secs) % 60)
RUNTIME_AR = _ar(RUNTIME_EN)

COPY = {
'line': ('s01-line', 'Shot 1 · the room before anything',
    ('Rendered · before the first bar', 'مُصيَّر · قبل أول مازورة'),
    ('The room, and one green line', 'الغرفة، وخطٌّ أخضر واحد'),
    ('Room 6 at night: concrete, a slat ceiling, a bench, a deck. Nothing is playing yet. '
     'The line on the wall is what silence looks like when something is still listening.',
     'الغرفة ٦ ليلًا: خرسانة، وسقفٌ من الشرائح، وطاولة، وجهاز. لا شيء يُعزف بعد. '
     'والخطُّ على الجدار هو شكلُ الصمت حين يبقى أحدٌ منصتًا.')),

'room': ('s03-room', 'Shot 3 · the room states itself',
    ('Rendered · 24 mm, the whole set', 'مُصيَّر · ٢٤ مم، المشهد كاملًا'),
    ('Everything here is a real object', 'كلُّ شيءٍ هنا جسمٌ حقيقي'),
    ('Bench, monitors, rack, stool, cable — geometry at true metric scale, lit by six practicals '
     'and photographed on a physical camera, so the shadows are solved rather than drawn.',
     'الطاولة، والسمّاعات، والرفّ، والمقعد، والكابل — هندسةٌ بمقياسٍ متريٍّ حقيقي، '
     'يضيئها ستةُ مصادر وتصوّرها كاميرا فيزيائية، فالظلالُ محسوبةٌ لا مرسومة.')),

'pulse': ('s02-pulse', 'Shot 2 · one beat crosses',
    ('Rendered · 105 mm on the wall', 'مُصيَّر · ١٠٥ مم على الجدار'),
    ('One beat crosses the line', 'نبضةٌ واحدة تعبر الخطّ'),
    ('The heartbeat is a moving emitter, not a texture: it lights the concrete it passes and goes '
     'dark again. Everything the wall does is the wall answering a light.',
     'النبضةُ باعثُ ضوءٍ متحرك لا نقشةٌ مرسومة: تُضيء الخرسانةَ التي تمرّ بها ثم تخبو. '
     'وكلُّ ما يفعله الجدارُ هو ردُّه على ضوء.')),

'needle': ('s05-needle', 'Shot 5 · contact at cartridge scale',
    ('Rendered · 125 mm at f/9', 'مُصيَّر · ١٢٥ مم عند f/9'),
    ('Contact, at cartridge scale', 'التلامس، بمقياس الحاملة'),
    ('The arm is solved, not posed: the bearing sits 33.9 mm above the playing surface because that '
     'is where a 0.238 m arm has to sit for the stylus to reach the groove at all.',
     'الذراعُ محسوبةٌ لا موضوعة: المحملُ يعلو سطحَ العزف ٣٣٫٩ مم، لأنّ ذراعًا طولها ٠٫٢٣٨ م '
     'لا تبلغ الأخدودَ إلا من هناك.')),

'quantize': ('s07-quantize', 'Shot 7 · the grid answers',
    ('Rendered · forty-six motes', 'مُصيَّر · ستٌّ وأربعون ذرّة'),
    ('Noise auditions, the grid answers', 'الضجيجُ يتقدّم، والشبكةُ تُجيب'),
    ('Scattered emitters drift over the platter until the beat lands, then take their places in a '
     'ring turning with the record. What resists the grid scales to nothing — on the downbeat, not near it.',
     'بواعثُ متناثرة تسبح فوق القرص حتى تحلَّ النبضة، فتأخذ مواضعها في حلقةٍ تدور مع الأسطوانة. '
     'وما يقاوم الشبكةَ يتلاشى — على النبضة تمامًا، لا قربها.')),

'lanes': ('s08-lanes', 'Shot 8 · one line becomes three',
    ('Rendered · three channels', 'مُصيَّر · ثلاث قنوات'),
    ('One line becomes three', 'خطٌّ واحد يصير ثلاثة'),
    ('Bass, mids, highs: a single strip of light on the bench splits into three, and each one keeps '
     'its own lane and its own colour spill across the wood.',
     'الجهيرُ والوسطُ والحادّ: شريطُ ضوءٍ واحدٍ على الطاولة ينقسم ثلاثةً، '
     'ويحتفظ كلٌّ بمساره وبلونِ انسكابهِ على الخشب.')),

'canyon': ('s09-canyon', 'Shot 9 · inside the groove',
    ('Rendered · forty-six metres', 'مُصيَّر · ستةٌ وأربعون مترًا'),
    ('Sixteen bars in one unbroken take', 'ستَّ عشرة مازورةً في لقطةٍ واحدة'),
    ('The walls are not a picture of a waveform — they are the waveform, built vertex by vertex along '
     'the length so they modulate down the trench and stay flat up its height. A green marker fires on '
     'every downbeat as the lens passes it.',
     'الجدرانُ ليست صورةً لموجة — هي الموجةُ نفسها، مبنيّةً رأسًا رأسًا على امتداد الطول، '
     'فتتموّج في اتجاه المسير وتستوي في اتجاه الارتفاع. وعند كل نبضةٍ أولى تشتعل علامةٌ خضراء لحظةَ مرور العدسة.')),

't01': ('s10-t01', 'Shot 10 · Track 01 · the send fader',
    ('Rendered · Track 01', 'مُصيَّر · المقطع الأول'),
    ('Seven faders ride. The eighth does not.', 'سبعةُ مقابضَ ترتفع. والثامنُ لا.'),
    ('The send fader is welded at zero and its lamp stays red for the whole shot. Nothing on this bench '
     'sends without a human, and the shot refuses to show it happening.',
     'مقبضُ الإرسال ملحومٌ عند الصفر، ومصباحه أحمرُ طوال اللقطة. لا شيءَ على هذه الطاولة '
     'يُرسِل بلا إنسان، واللقطةُ ترفض أن تُظهر عكسَ ذلك.')),

't02': ('s11-t02', 'Shot 11 · Track 02 · the red gate',
    ('Rendered · Track 02', 'مُصيَّر · المقطع الثاني'),
    ('The red gate needs a hand', 'البوابةُ الحمراء تنتظر يدًا'),
    ('One key travels three and a half millimetres. The gate brightens and holds amber — it never turns '
     'green on its own. Discovery is instant here; destruction waits for a typed word.',
     'مفتاحٌ واحد يهبط ثلاثةً ونصفَ مليمتر. تتوهّج البوابةُ وتثبت عند الكهرماني — ولا تصير خضراءَ '
     'من تلقاء نفسها. الاكتشافُ هنا فوريّ، أمّا الهدمُ فينتظر كلمةً تُكتب.')),

't03': ('s12-t03', 'Shot 12 · Track 03 · sixty hertz',
    ('Rendered · Track 03', 'مُصيَّر · المقطع الثالث'),
    ('Sixty hertz, sampled at twenty-four', 'ستون هرتزًا، مُلتقَطةً عند أربعةٍ وعشرين'),
    ('The rack meters step on a fixed 60 Hz clock while the camera runs at 24 fps, so what you see is the '
     'shimmer a real sampled meter gives — the beat between two clocks, not motion eased to look nice.',
     'مؤشراتُ الرفّ تخطو على ساعةٍ ثابتة عند ٦٠ هرتز والكاميرا تدور عند ٢٤ إطارًا، فما تراه هو '
     'ارتعاشُ مقياسٍ حقيقيٍّ مُلتقَط — الفرقُ بين ساعتين، لا حركةٌ مُنعّمة لتبدو جميلة.')),

'chorus': ('s14-chorus', 'Shot 14 · the chorus returns',
    ('Rendered · thirty tracks', 'مُصيَّر · ثلاثون مقطعًا'),
    ('Thirty tracks light in order', 'ثلاثون مقطعًا تُضاء بالترتيب'),
    ('Each bar takes its own beat, the pink and the violet come back with them, and the camera lifts off '
     'the deck into the room it started in.',
     'كلُّ عمودٍ يأخذ نبضته، ويعود معها الورديُّ والبنفسجيّ، '
     'وترتفع الكاميرا عن الجهاز إلى الغرفة التي بدأت منها.')),
}


def block(key):
    tag, slate, kick, title, body = COPY[key]
    ten, tar = SHOT_TECH[key]
    return (
'\n<section class="scene rplate" data-scene="pin" data-slate="%s" style="height:300vh"\n'
'         data-plate="spotify/shots/%s.mp4" data-plate-poster="spotify/shots/%s.jpg"\n'
'         aria-label="Rendered plate — %s">\n'
'  <div class="stage">\n'
'    <p class="rtag"><span class="L en">%s</span><span class="L ar">%s</span></p>\n'
'    <div class="caption">\n'
'      <p class="kick"><span class="L en">%s</span><span class="L ar">%s</span></p>\n'
'      <h2><span class="L en">%s</span><span class="L ar">%s</span></h2>\n'
'      <p><span class="L en">%s</span><span class="L ar">%s</span></p>\n'
'    </div>\n'
'  </div>\n'
'</section>\n' % (slate, tag, tag, slate, ten, tar, kick[0], kick[1],
                  title[0], title[1], body[0], body[1]))


def main():
    s = io.open(HTML, encoding='utf-8').read()
    orig = s

    if 'spotify/shots/' in s:
        print('already wired — nothing to do')
        return 0

    # ── the theater button ────────────────────────────────────────────────
    old_btn = ('  <div class="grp">\n'
               '    <button type="button" data-lang-toggle aria-pressed="false">')
    new_btn = ('  <div class="grp">\n'
               '    <button type="button" data-theater="spotify/spotify-film.mp4">'
               '<span class="L en">▸ The film · %s</span>' % RUNTIME_EN +
               '<span class="L ar">▸ الفيلم · %s</span></button>\n' % RUNTIME_AR +
               '    <button type="button" data-lang-toggle aria-pressed="false">')
    assert s.count(old_btn) == 1, 'chrome button anchor'
    s = s.replace(old_btn, new_btn, 1)

    # ── repoint the four original plates at the film's shots ──────────────
    repoint = [
        ('render/spotify-s1.mp4', 'render/spotify-s1.jpg', 's04-arm',
         'Shot 4 · the needle comes down', tech('arm')),
        ('render/spotify-s2.mp4', 'render/spotify-s2.jpg', 's06-groove',
         'Shot 6 · the groove', tech('groove')),
        ('render/spotify-s3.mp4', 'render/spotify-s3.jpg', 's13-master',
         'Shot 13 · the master fader', tech('master')),
        ('render/spotify-s4.mp4', 'render/spotify-s4.jpg', 's15-outro',
         'Shot 15 · lift off', tech('outro')),
    ]
    for mp4, jpg, tag, slate, _t in repoint:
        assert mp4 in s, mp4
        s = s.replace(mp4, 'spotify/shots/%s.mp4' % tag)
        s = s.replace(jpg, 'spotify/shots/%s.jpg' % tag)

    # every original rtag advertised the old plate's 48 frames at 960×480
    rtags = re.findall(r'<p class="rtag">.*?</p>', s, flags=re.S)
    assert len(rtags) == 4, 'expected the four original rtags, found %d' % len(rtags)
    for tagblock, (_, _, _, _, (ten, tar)) in zip(rtags, repoint):
        s = s.replace(tagblock,
                      '<p class="rtag"><span class="L en">%s</span>'
                      '<span class="L ar">%s</span></p>' % (ten, tar), 1)

    # ── the credits stop claiming there is no footage ─────────────────────
    s = s.replace(
        '<dd><span class="L en">Live — 4 canvases + CSS, no footage, no audio</span>'
        '<span class="L ar">حيًّا — ٤ لوحات وCSS، بلا مشهدٍ مصوَّر وبلا صوت</span></dd>',
        '<dd><span class="L en">Live canvases + CSS, and 15 Cycles plates '
        '(%s frames, path-traced, no AI footage, no audio)</span>'
        '<span class="L ar">لوحاتٌ حيّة وCSS، مع ١٥ لقطة Cycles '
        '(%s إطارًا، تتبُّع مسار، بلا مشاهد مولَّدة بالذكاء الاصطناعي وبلا صوت)</span></dd>'
        % ('{:,}'.format(TOTAL_FRAMES), _ar(TOTAL_FRAMES)), 1)
    s = s.replace(
        '<dd>cinema.js v3 · CSS custom properties</dd>',
        '<dd><span class="L en">cinema.js v4 · CSS custom properties · '
        'Blender Cycles, OptiX, AgX</span><span class="L ar">cinema.js v4 · '
        'خصائص CSS · Blender Cycles وOptiX وAgX</span></dd>', 1)

    # Shot 3's caption was written for a stylus plate; it is the master fader now
    s = s.replace(
        '<h2><span class="L en">Contact, on the downbeat</span>'
        '<span class="L ar">التلامس، على النبضة الأولى</span></h2>',
        '<h2><span class="L en">The colours leave the room</span>'
        '<span class="L ar">الألوانُ تغادر الغرفة</span></h2>', 1)

    # ── weave the eleven new plates in at their beats ─────────────────────
    P = '<section class="scene rplate" data-scene="pin" data-slate="%s"'
    inserts = [
        ('<section class="scene rplate"', ['line', 'room']),          # after the ident
        ('<section class="scene sc-needle"', ['pulse']),
        ('<section class="act" style="--k:var(--vi)">', ['needle']),
        ('<section class="scene sc-lanes"', ['quantize']),
        ('<section class="scene sc-canyon"', ['lanes']),
        (P % 'Shot 2 · the groove', ['canyon']),      # the flight, then the macro
        ('<section class="scene track sc-t2"', ['t01']),
        ('<section class="scene track sc-t3"', ['t02']),
        ('<section class="scene sc-spine"', ['t03']),
        (P % 'Shot 4 · the spin', ['chorus']),        # the chorus, then the lift
    ]
    for anchor, keys in inserts:
        i = s.find(anchor)
        assert i >= 0, 'anchor not found: ' + anchor
        s = s[:i] + ''.join(block(k) for k in keys) + s[i:]

    # the four original slates named plates that no longer exist
    for _, _, tag, slate, _ in repoint:
        old = {'s04-arm': 'Shot 1 · the plate', 's06-groove': 'Shot 2 · the groove',
               's13-master': 'Shot 3 · the stylus', 's15-outro': 'Shot 4 · the spin'}[tag]
        s = s.replace('data-slate="%s"' % old, 'data-slate="%s"' % slate, 1)

    assert s.count('data-plate=') == 15, 'expected 15 plates, got %d' % s.count('data-plate=')
    assert s.count('<span class="L en">') == s.count('<span class="L ar">'), 'EN/AR parity broken'
    io.open(HTML, 'w', encoding='utf-8').write(s)
    print('wired: 15 rendered plates + theater button (%d -> %d bytes)' % (len(orig), len(s)))
    return 0


sys.exit(main())

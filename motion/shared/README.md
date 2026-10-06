# Three-buffer motion film

`film-world.js` adapts the existing Job Orbit engine at
`video-motion-lab/job-orbit-flagship-20261003/media/job-orbit-flight/film-world.js`.
The same three paused HTML video elements, short segment/blob cache, 0.5-second
keyframes, compositor callback and paused-seek fallback form its core. The other
existing engines were compared: `worlds/cinema.js` is a scene driver and
`mk-downloader/scroll-film.js`/`reclaim/story.js` load monolithic films, so Job Orbit
was the closest fit for bounded progressive loading and reverse seeking.

The additions are configuration-driven English/Arabic chapters, real portrait
profiles, orientation re-selection that preserves time and crossfades buffers,
keyboard chapters, chapter hashes, optional paired-world links, chapter posters,
and short explicit-play scenes for reduced motion. Only the current segment and
near neighbours are requested. Save-Data disables the second look-ahead fetch.
There is no dependency or runtime CDN.

## Reuse

Copy the semantic shell from `../mk-voice/index.html`, use `film.css`, and include
`<script id="film-data" type="application/json">…</script>` before loading
`film-world.js` as a module. The native entry auto-initializes. A framework can
instead import `createFilmWorld(data, scope)` without the `#film-data` element.

```json
{
  "schemaVersion": 1,
  "id": "unique-film-id",
  "duration": 240,
  "fps": 30,
  "clipSeconds": 5,
  "clipCount": 48,
  "accent": "#1ed760",
  "title": {"en": "Film title", "ar": "عنوان الفيلم"},
  "gallery": {"en": "../en/motion/", "ar": "../ar/motion/"},
  "profiles": {
    "desktop": {"clips": "./media/desktop/clip-{index}.mp4", "poster": "./media/desktop/poster.jpg", "width": 1920, "height": 1080},
    "mobile": {"clips": "./media/mobile/clip-{index}.mp4", "poster": "./media/mobile/poster.jpg", "width": 1080, "height": 1920}
  },
  "world": {"href": "../../worlds/spotify.html", "label": {"en": "Enter the world", "ar": "ادخل العالم"}},
  "copy": {"chapters": {"en": "Chapters", "ar": "الفصول"}},
  "chapters": [{
    "id": "opening", "start": 0, "previewAt": 3,
    "title": {"en": "Opening", "ar": "البداية"},
    "summary": {"en": "A short description.", "ar": "وصف قصير."},
    "accent": "#1ed760",
    "posters": {"desktop": "./media/desktop/opening.jpg", "mobile": "./media/mobile/opening.jpg"}
  }]
}
```

Chapter starts are seconds, ordered from zero. Filenames use a three-digit index.
All paths resolve relative to the page, preserving an Astro/GitHub Pages base.
Without `pixelsPerSecond` the film walks at the World's pace (`100svh / 6` px per film second), with Lenis
(`./lenis.mjs`) on the wheel, whole-film buffering on computers and chapter buffering on touch screens. A page that sets
`"pixelsPerSecond": {"desktop": 88, "mobile": 72}` (Home's film) keeps that pace and native scrolling.
`?lang=ar` switches HTML direction and copy; `#chapter-id` opens a chapter.
`world` is optional. When present the link adds `from`, `chapter`, and `lang` so a
paired world can return to the same chapter. Page-specific static content stays
in real HTML; keep its article `data-poster-chapter` ids aligned with the JSON.

Required hooks: `data-film-story`, `data-film-stage`, `data-film-poster`, exactly
three `data-film-buffer` videos, `data-film-loading`, `data-load-message`,
`data-retry`, `data-film-scrubber`, `data-film-progress`, `data-chapter-title`,
`data-chapter-summary`, `data-clock`, `data-calm-story`, `data-chapter-dialog`,
`data-watch-dialog`, `data-watch-video`, and `data-watch-title`.
Optional navigation hooks are visible in the Voice shell.

Optional per-chapter actions: add an anchor with `data-chapter-action` and class
`film-chapter-action` inside the caption. A chapter may set
`"action":{"href":"../../en/work/job-orbit/","label":{"en":"Explore Job Orbit","ar":"استكشف Job Orbit"}}`.
The anchor updates from the actually painted chapter, and is hidden on chapters
without an action. `href` can also be an `{en,ar}` object. Keep the matching link
in the static fallback article for use without scripting.
The last segment may be shorter than `clipSeconds` (e.g. 276s uses 56 segments
with a 1s final segment); seeking is clamped to the actual loaded video duration.

For language routes, optional `languageURLs: {en:'/en/',ar:'/ar/'}` replaces
query-only switching while preserving the current chapter hash. An optional
`data-film-contact` region is revealed by the actually painted time at
`contactStart` (default: the final five seconds). It toggles
`html.film-contact-hold` and hides again on reverse. These hooks do not create a
second animation loop or change pages that omit them.
`data-chapter-name` optionally shows a chapter's translated `name` beside its
heading. Explicit `data.lang` takes priority over query language, so a localized
Astro route remains internally consistent; query language still selects the
language on the standalone Voice page.
Optional `hashAliases`, such as `{contact:271,work:20,worlds:210}`, preserves
existing home fragment links by mapping them to film times without inventing
extra chapters. Named chapter hashes continue to take precedence. Optional
`hashRedirects` maps former section hashes to retained Classic URLs. Scroll goals
and segment selection both snap to the nearest encoded frame; fractional CSS
scroll positions cannot hold the preceding segment at an exact boundary.

`window.motionFilm` exposes `seek(seconds)`, `setMode('film'|'posters')`, read-only
`time`, `chapter`, `profile`, `mode`, and a copied `metrics` object for validation.
Keyboard: Left/Right or Page Up/Page Down change chapter; Home/End select the
first/last chapter. The slider remains a native keyboard-accessible range input.
Escape closes native dialogs. The skip link opens the calm chapter list.

## Media

Run `node scripts/motion/encode-voice.mjs` from the portfolio source. The script
checks C: space and keeps a 10 GiB reserve after a 500 MiB working allowance. It preserves both masters,
encodes 18 H.264 clips per profile at 30 fps with a 15-frame GOP and faststart,
extracts chapter posters, and writes an encode report outside the public source.
The portrait source is the authored 1080×1920 cut, encoded at 720×1280. The
desktop source is encoded at 1600×900. Clips are silent because scrolling has no
continuous soundtrack; reduced motion uses explicitly played five-second clips.

## Evidence limits

Media metadata, sampled stills, and browser emulation are separate checks. They
do not establish physical iPhone acceptance or replace watching the complete
interaction. Canvas/frame-sequence fallback is intentionally conditional on
measured video-seek failure; it is not loaded speculatively. Encoding alternatives
and 4× CPU/Fast 4G targets belong to the final film acceptance pass.

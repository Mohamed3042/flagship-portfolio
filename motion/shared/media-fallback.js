/* Safety net for films moved to the media host (scripts/media/finish-dist.mjs writes it into every page of the Pages build,
   right after <meta name="mk-media-base" content="<host>" data-site="<site base>">). When a <video> or <source> fails to load
   a same-site .mp4, it retries once from the same path on the media host (crossOrigin="anonymous" first, so a WebGL texture
   of it stays usable). Nothing fails = nothing happens. No meta (astro dev, local build) = does nothing. */
(() => {
  const meta = document.querySelector('meta[name="mk-media-base"]');
  if (!meta || !/^https?:\/\//.test(meta.content)) return;
  const host = meta.content.replace(/\/+$/, ''), site = (meta.dataset.site || '').replace(/\/+$/, '');
  const moved = href => {
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin || !/\.mp4$/i.test(u.pathname) || !u.pathname.startsWith(`${site}/`)) return null;
      return host + u.pathname.slice(site.length) + u.search + u.hash;   // keeps a #t= start time
    } catch { return null; }
  };
  addEventListener('error', e => {
    const t = e.target;
    const video = t instanceof HTMLSourceElement ? t.parentElement : t;
    if (!(video instanceof HTMLVideoElement) || video.dataset.mkMediaRetry) return;
    const to = moved(t instanceof HTMLSourceElement ? t.src : video.currentSrc || video.src);
    if (!to) return;
    video.dataset.mkMediaRetry = '1';
    const play = !video.paused || video.autoplay, at = video.currentTime;
    video.crossOrigin = 'anonymous';
    video.src = to;
    video.load();
    if (at) video.addEventListener('loadedmetadata', () => { try { video.currentTime = at; } catch {} }, {once: true});
    if (play) video.play().catch(() => {});
  }, true);
})();

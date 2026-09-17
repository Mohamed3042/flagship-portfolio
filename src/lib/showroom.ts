/** Homepage interactions; evidence and story routes stay server-rendered. */
let teardown: (() => void) | undefined;
export function stopShowroom(): void { teardown?.(); teardown = undefined; }
export function initShowroom(): void {
  stopShowroom();
  const root = document.querySelector<HTMLElement>('[data-showroom]');
  if (!root) return;
  const abort = new AbortController();
  const { signal } = abort;
  const ar = document.documentElement.lang === 'ar';
  const n = (v: number) => v.toLocaleString(ar ? 'ar-EG' : 'en-US');
  let destroy3D: (() => void) | undefined;
  let select3D: ((kind: string) => void) | undefined;
  const nativeMedia = (window as Window & { __mmNativeMatchMedia?: typeof window.matchMedia }).__mmNativeMatchMedia ?? window.matchMedia.bind(window);
  const motionQuery = nativeMedia('(prefers-reduced-motion: reduce)');
  let paused = motionQuery.matches;
  const setPaused = (v: boolean) => {
    paused = v;
    document.documentElement.toggleAttribute('data-showroom-paused', v);
    root.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', String(v));
      b.textContent = (v ? b.dataset.play : b.dataset.pause) ?? '';
    });
    root.dispatchEvent(new Event('showroom:motion'));
  };
  setPaused(paused);
  motionQuery.addEventListener('change', e => setPaused(e.matches), { signal });
  const atlas = root.querySelector<HTMLElement>('[data-atlas]')!;
  const items = Array.from(atlas.querySelectorAll<HTMLElement>('[data-sky-item]'));
  const search = atlas.querySelector<HTMLInputElement>('[data-project-search]')!;
  const filters = Array.from(atlas.querySelectorAll<HTMLButtonElement>('[data-sky-filter]'));
  const more = atlas.querySelector<HTMLButtonElement>('[data-project-more]')!;
  const count = atlas.querySelector<HTMLElement>('[data-project-count]')!;
  const empty = atlas.querySelector<HTMLElement>('[data-project-empty]')!;
  let group = 'all', limit = 12;
  const normalize = (value: string) => value.normalize('NFKD').toLocaleLowerCase().trim();
  function updateAtlas() {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    const matches = items.filter(el => (group === 'all' || el.dataset.group === group) && terms.every(term => normalize(el.dataset.search ?? '').includes(term)));
    const shown = new Set(matches.slice(0, limit));
    items.forEach(el => { el.hidden = !shown.has(el); });
    filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.skyFilter === group)));
    count.textContent = (count.dataset.template ?? '{shown} of {total} projects').replace('{shown}', n(shown.size)).replace('{total}', n(matches.length));
    empty.hidden = matches.length > 0;
    more.hidden = shown.size >= matches.length;
  }
  search.addEventListener('input', () => { limit = 12; updateAtlas(); }, { signal });
  filters.forEach(b => b.addEventListener('click', () => { group = b.dataset.skyFilter ?? 'all'; limit = 12; updateAtlas(); }, { signal }));
  more.addEventListener('click', () => {
    const previous = limit; limit += 12; updateAtlas();
    items.filter(i => !i.hidden)[previous]?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
  }, { signal });
  atlas.querySelector('[data-reset-search]')?.addEventListener('click', () => { search.value = ''; group = 'all'; limit = 12; updateAtlas(); search.focus({ preventScroll: true }); }, { signal });
  atlas.querySelector<HTMLButtonElement>('[data-view-toggle]')?.addEventListener('click', e => {
    const b = e.currentTarget as HTMLButtonElement;
    const list = atlas.dataset.view !== 'list';
    atlas.dataset.view = list ? 'list' : 'grid'; b.setAttribute('aria-pressed', String(list));
    b.textContent = (list ? b.dataset.gridLabel : b.dataset.listLabel) ?? '';
  }, { signal });
  function hashFilter() {
    if (location.hash === '#lab' || location.hash === '#foundation') { group = location.hash.slice(1); search.value = ''; limit = 12; updateAtlas(); }
  }
  window.addEventListener('hashchange', hashFilter, { signal });
  document.addEventListener('click', e => {
    const href = (e.target as Element).closest('a')?.getAttribute('href');
    if (href === '#lab' || href === '#foundation') { group = href.slice(1); search.value = ''; limit = 12; updateAtlas(); }
  }, { signal });
  updateAtlas(); hashFilter();
  const dialog = root.querySelector<HTMLDialogElement>('[data-showroom-dialog]')!;
  const content = dialog.querySelector<HTMLElement>('[data-dialog-content]')!;
  let returnFocus: HTMLElement | null = null, previousOverflow = '';
  dialog.setAttribute('data-lenis-prevent', '');
  function openDialog(trigger: HTMLElement) {
    returnFocus = trigger; previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden'; dialog.showModal(); dialog.scrollTop = 0;
    dialog.querySelector<HTMLButtonElement>('[data-close-dialog]')?.focus();
  }
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } }, { signal });
  dialog.addEventListener('close', () => { document.documentElement.style.overflow = previousOverflow; content.replaceChildren(); returnFocus?.focus({ preventScroll: true }); }, { signal });
  root.addEventListener('click', e => {
    const el = e.target as Element;
    const zoom = el.closest<HTMLElement>('[data-zoom]');
    if (zoom) {
      const figure = document.createElement('figure'), img = document.createElement('img'), caption = document.createElement('figcaption');
      img.alt = zoom.dataset.alt ?? ''; caption.textContent = img.alt;
      img.addEventListener('error', () => { caption.textContent = ar ? 'تعذّر تحميل الصورة. أغلق المعاينة وأعد المحاولة.' : 'The image could not load. Close the preview and try again.'; }, { once: true });
      img.src = zoom.dataset.src ?? ''; figure.append(img, caption); content.replaceChildren(figure); openDialog(zoom); return;
    }
    const preview = el.closest<HTMLElement>('[data-preview]');
    if (preview) {
      const template = document.getElementById(preview.dataset.preview ?? '') as HTMLElement | null;
      if (template?.firstElementChild) { content.replaceChildren(template.firstElementChild.cloneNode(true)); openDialog(preview); }
      return;
    }
    const shot = el.closest<HTMLButtonElement>('[data-shot]');
    if (shot) {
      const card = shot.closest<HTMLElement>('.sr-card')!;
      const image = card.querySelector<HTMLImageElement>('[data-card-image]')!;
      const trigger = card.querySelector<HTMLElement>('[data-zoom]')!;
      image.src = shot.dataset.shot!; image.alt = shot.dataset.alt ?? '';
      trigger.dataset.src = image.src; trigger.dataset.alt = image.alt;
      card.querySelectorAll('[data-shot]').forEach(b => b.setAttribute('aria-pressed', String(b === shot)));
      return;
    }
    const select = el.closest<HTMLButtonElement>('[data-select-exhibit]');
    if (select) {
      const host = root.querySelector<HTMLElement>('[data-exhibit]')!;
      host.dataset.kind = select.dataset.selectExhibit;
      root.querySelectorAll('[data-select-exhibit]').forEach(b => b.setAttribute('aria-pressed', String(b === select)));
      root.querySelector<HTMLElement>('[data-exhibit-title]')!.textContent = select.dataset.title ?? '';
      root.querySelector<HTMLAnchorElement>('[data-exhibit-story]')!.href = select.dataset.href ?? '#work';
      const floating = root.querySelector<HTMLElement>('[data-hero-shot]')!;
      floating.dataset.src = select.dataset.src; floating.dataset.alt = select.dataset.alt;
      [floating.querySelector<HTMLImageElement>('img'), host.querySelector<HTMLImageElement>('[data-exhibit-fallback]')].forEach(img => { if (img) { img.src = select.dataset.src!; img.alt = select.dataset.alt ?? ''; } });
      select3D?.(select.dataset.selectExhibit ?? 'truss');
    }
    if (el.closest('[data-motion-toggle]')) setPaused(!paused);
  }, { signal });
  teardown = () => {
    if (dialog.open) { dialog.close(); document.documentElement.style.overflow = previousOverflow; }
    abort.abort(); destroy3D?.(); document.documentElement.removeAttribute('data-showroom-paused');
  };
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!connection?.saveData && new URLSearchParams(location.search).get('showroom') !== 'static') {
    import('./showroom-scene').then(({ createShowroomScenes }) => {
      if (signal.aborted) return;
      const engine = createShowroomScenes(root, () => paused);
      destroy3D = engine?.dispose; select3D = engine?.select;
    }).catch(() => { root.dataset.graphics = 'fallback'; });
  }
}

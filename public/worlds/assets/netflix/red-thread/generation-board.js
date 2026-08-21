(() => {
  const body = document.body;
  const provider = body.dataset.provider;
  const manifestPath = body.dataset.manifest;
  const stateKey = body.dataset.stateKey;
  const cards = document.querySelector('#cards');
  const empty = document.querySelector('#empty');
  const boardError = document.querySelector('#board-error');
  let manifest = null;
  let jobs = [];
  let actFilter = 'all';
  let stateFilter = 'all';
  let done = new Set();

  const actMap = {
    N01: ['I', 'Signal'], N02: ['I', 'Signal'], N03: ['I', 'Signal'],
    N04: ['II', 'Thresholds'], N05: ['II', 'Thresholds'],
    N06: ['III', 'Evidence'], N07: ['III', 'Evidence'],
    N08: ['IV', 'Return'],
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const fileName = path => String(path || '').split('/').pop();

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(stateKey) || '[]');
      const validIds = new Set(jobs.map(job => job.id));
      done = new Set((Array.isArray(parsed) ? parsed : []).filter(id => validIds.has(id)));
    } catch (_) {
      done = new Set();
    }
  }

  function saveState() {
    try { localStorage.setItem(stateKey, JSON.stringify([...done])); } catch (_) {}
  }

  async function copyPrompt(button, prompt) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(prompt);
      copied = true;
    } catch (_) {
      const box = document.createElement('textarea');
      box.value = prompt;
      document.body.appendChild(box);
      box.select();
      try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      finally { box.remove(); }
    }
    button.textContent = copied ? 'Copied exact prompt' : 'Copy failed';
    button.classList.toggle('ok', copied);
    window.setTimeout(() => {
      button.textContent = 'Copy exact prompt';
      button.classList.remove('ok');
    }, 1600);
  }

  function frameFigure(src, label, alt, eager = false) {
    const safeSrc = escapeHtml(src);
    const name = escapeHtml(fileName(src));
    return `
      <figure>
        <span class="frame-label">${escapeHtml(label)}</span>
        <a class="frame-link" href="${safeSrc}" target="_blank" rel="noopener">
          <img src="${safeSrc}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" alt="${escapeHtml(alt)}">
        </a>
        <figcaption>${name}</figcaption>
      </figure>`;
  }

  function pendingFigure() {
    return `
      <figure>
        <span class="frame-label">First frame · bind after N03 acceptance</span>
        <div class="frame-placeholder" role="img" aria-label="N04 first frame pending accepted N03 landing">
          <div><strong>[LOST] until N03 exists</strong><span>Use the decoded final frame from the accepted N03 clip. Do not substitute the storyboard frame.</span></div>
        </div>
        <figcaption>accepted N03 landing · runtime binding</figcaption>
      </figure>`;
  }

  function timelineRows(shot) {
    if (provider === 'wan') {
      return [
        ['0–1s', shot.timeline.setup0to1],
        ['1–4.5s', shot.timeline.action1to4_5],
        ['4.5–5s', shot.timeline.hold4_5to5],
      ];
    }
    return [
      ['0–5s', shot.timeline.setup0to5],
      ['5–12s', shot.timeline.illusion5to12],
      ['12–15s', shot.timeline.landing12to15],
    ];
  }

  function motionPanel(shot) {
    const rows = timelineRows(shot).map(([time, text]) => `
      <div class="timeline-row"><strong>${escapeHtml(time)}</strong><span>${escapeHtml(text)}</span></div>`).join('');
    return `
      <section>
        <span class="motion-label">Exact motion blueprint</span>
        <div class="motion-panel">
          <span class="motion-label">One continuous take</span>
          <h3>${provider === 'wan' ? 'Five-second action map' : 'Fifteen-second action map'}</h3>
          <div class="timeline">${rows}</div>
        </div>
        <figcaption>${provider === 'wan' ? 'settle by 4.5s · hold final 0.5s' : 'predetermined comparison window · 00:05–00:10'}</figcaption>
      </section>`;
  }

  function visualPair(shot, index) {
    if (provider === 'wan' && shot.flf && shot.id === 'N04') {
      return `${pendingFigure()}<div class="arrow" aria-hidden="true">→</div>${frameFigure(shot.lastFrame, 'Last frame · upload right', `${shot.id} last frame`, index < 2)}`;
    }
    if (provider === 'wan' && shot.flf) {
      return `${frameFigure(shot.firstFrame, 'First frame · upload left', `${shot.id} first frame`, index < 2)}<div class="arrow" aria-hidden="true">→</div>${frameFigure(shot.lastFrame, 'Last frame · upload right', `${shot.id} last frame`, index < 2)}`;
    }
    const input = provider === 'wan' ? shot.input720 : shot.input1080;
    const label = provider === 'wan' ? 'Image-to-video input · upload' : 'Exact first frame · upload';
    return `${frameFigure(input, label, `${shot.id} input frame`, index < 2)}<div class="arrow" aria-hidden="true">→</div>${motionPanel(shot)}`;
  }

  function renderCard(shot, index) {
    const [act, actTitle] = actMap[shot.id];
    const mode = provider === 'wan' && shot.flf ? 'Hard FLF' : 'Image-to-video';
    const duration = provider === 'wan' ? '5 seconds' : '15 seconds';
    const seed = provider === 'wan' ? `<span class="badge">Seed ${escapeHtml(shot.seed)}</span>` : '';
    const card = document.createElement('article');
    card.className = 'card';
    card.id = shot.id;
    card.dataset.id = shot.id;
    card.dataset.act = act;
    card.innerHTML = `
      <header class="card-head">
        <div>
          <div class="shot-no">Job ${String(index + 1).padStart(2, '0')} / ${jobs.length} · ${escapeHtml(shot.id)} · Act ${act} · ${actTitle}</div>
          <h2>${escapeHtml(shot.title)}</h2>
        </div>
        <div class="output">
          <div class="badges"><span class="badge ${shot.flf ? 'flf' : ''}">${mode}</span><span class="badge">${duration}</span>${seed}</div>
          <span class="status-label">Output filename</span><code>${escapeHtml(shot.outputName)}</code>
        </div>
      </header>
      <div class="pair">${visualPair(shot, index)}</div>
      <div class="prompt-box">
        <div class="prompt-top">
          <span class="prompt-label">Exact ${provider === 'wan' ? 'WAN 2.7' : 'Grok Imagine 2.0'} prompt · paste unchanged</span>
          <div class="actions">
            <button class="copy" type="button">Copy exact prompt</button>
            <button class="done" type="button" aria-pressed="false">Mark done</button>
          </div>
        </div>
        <p class="prompt"></p>
      </div>`;
    card.querySelector('.prompt').textContent = shot.prompt;
    card.querySelector('.copy').addEventListener('click', event => copyPrompt(event.currentTarget, shot.prompt));
    card.querySelector('.done').addEventListener('click', () => {
      if (done.has(shot.id)) done.delete(shot.id); else done.add(shot.id);
      updateProgress();
    });
    cards.appendChild(card);
  }

  function updateCardState(card) {
    const active = done.has(card.dataset.id);
    const button = card.querySelector('.done');
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Done ✓' : 'Mark done';
    card.classList.toggle('is-done', active);
  }

  function applyFilters() {
    let visible = 0;
    document.querySelectorAll('.card').forEach(card => {
      const actMatch = actFilter === 'all' || card.dataset.act === actFilter;
      const completed = done.has(card.dataset.id);
      const stateMatch = stateFilter === 'all' || (stateFilter === 'done' ? completed : !completed);
      card.hidden = !(actMatch && stateMatch);
      if (!card.hidden) visible += 1;
    });
    document.querySelector('#visible-count').textContent = `${visible} ${visible === 1 ? 'job' : 'jobs'} visible`;
    empty.hidden = visible !== 0;
  }

  function updateProgress() {
    document.querySelector('#done-count').textContent = done.size;
    document.querySelector('#job-count').textContent = jobs.length;
    document.querySelector('#bar-fill').style.width = `${jobs.length ? (done.size / jobs.length) * 100 : 0}%`;
    document.querySelectorAll('.card').forEach(updateCardState);
    saveState();
    applyFilters();
  }

  function selectFilter(selector, button, value) {
    document.querySelectorAll(selector).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    return value;
  }

  function buildFilters() {
    const acts = [...new Map(jobs.map(job => actMap[job.id])).entries()];
    const actFilters = document.querySelector('#act-filters');
    [['all', 'All acts'], ...acts].forEach(([act, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.actFilter = act;
      button.setAttribute('aria-pressed', String(act === 'all'));
      button.textContent = act === 'all' ? label : `Act ${act}`;
      button.title = act === 'all' ? label : label;
      button.addEventListener('click', () => {
        actFilter = selectFilter('[data-act-filter]', button, act);
        applyFilters();
      });
      actFilters.appendChild(button);
    });

    document.querySelectorAll('[data-state-filter]').forEach(button => {
      button.addEventListener('click', () => {
        stateFilter = selectFilter('[data-state-filter]', button, button.dataset.stateFilter);
        applyFilters();
      });
    });
  }

  async function boot() {
    try {
      const response = await fetch(manifestPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
      manifest = await response.json();
      jobs = Array.isArray(manifest.shots) ? manifest.shots : [];
      if (jobs.length !== 8) throw new Error(`expected 8 jobs, received ${jobs.length}`);
      loadState();
      buildFilters();
      jobs.forEach(renderCard);
      updateProgress();
    } catch (error) {
      boardError.hidden = false;
      boardError.textContent = `Board failed to load: ${error.message}`;
      empty.hidden = true;
    }
  }

  document.querySelector('#continue').addEventListener('click', () => {
    const pending = jobs.find(job => !done.has(job.id));
    if (pending) document.getElementById(pending.id)?.scrollIntoView({ block: 'start' });
  });

  document.querySelector('#reset').addEventListener('click', () => {
    if (!done.size || window.confirm('Clear all Red Thread done tracking for this provider?')) {
      done.clear();
      updateProgress();
    }
  });

  boot();
})();

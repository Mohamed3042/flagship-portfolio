/* =====================================================================
   TRANSMISSIONS — body copy received as a signal.

   Every [data-tx] block decodes when it enters the viewport: each word
   arrives as signal blocks in the page accent and settles into the real
   word, staggered along the block, while a thin scan line sweeps down it.
   Words, not letters, so Arabic keeps its joins. A build step marked
   data-tx="gate" decodes again each time it becomes the active gate.
   Idempotent across Astro View Transitions.
   ===================================================================== */

const BLOCKS = '░▒▓▮▯';
const STAGGER = 26; // ms per word
const HOLD = 140; // ms a word shows blocks before it settles

interface Word {
  el: HTMLElement;
  text: string;
}

const words = new WeakMap<HTMLElement, Word[]>();
const running = new WeakMap<HTMLElement, number>();

function split(block: HTMLElement): Word[] {
  const cached = words.get(block);
  if (cached) return cached;
  const list: Word[] = [];
  const walk = (node: Node): void => {
    for (const k of Array.from(node.childNodes)) {
      if (k.nodeType === Node.TEXT_NODE) {
        const text = k.textContent || '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            continue;
          }
          const w = document.createElement('span');
          w.className = 'tx-w';
          w.textContent = part;
          // the real word keeps its box from the first paint; the signal
          // blocks are drawn over it by CSS (::after reads data-blocks), so
          // the decode never re-wraps a line
          w.dataset.blocks = blocksFor(part);
          frag.appendChild(w);
          list.push({ el: w, text: part });
        }
        node.replaceChild(frag, k);
      } else if (k.nodeType === Node.ELEMENT_NODE && k.childNodes.length) {
        walk(k);
      }
    }
  };
  walk(block);
  words.set(block, list);
  return list;
}

function blocksFor(text: string): string {
  let s = '';
  for (let i = 0; i < text.length; i++) s += BLOCKS[(i * 7 + text.length) % BLOCKS.length];
  return s;
}

/** Run the decode on one block (again, if asked). */
export function decode(block: HTMLElement): void {
  const list = split(block);
  if (!list.length) return;
  const prev = running.get(block);
  if (prev) cancelAnimationFrame(prev);
  block.classList.remove('tx-live');
  // force the sweep to restart
  void block.offsetWidth;
  block.classList.add('tx-live');
  const t0 = performance.now();
  for (const w of list) {
    w.el.dataset.on = '0';
    w.el.dataset.blocks = blocksFor(w.text);
  }
  const tick = (now: number) => {
    const t = now - t0;
    let done = true;
    list.forEach((w, i) => {
      const settle = i * STAGGER + HOLD;
      if (w.el.dataset.on === '1') return;
      if (t >= settle) {
        w.el.dataset.on = '1';
      } else {
        done = false;
        // the blocks flicker while they wait
        w.el.dataset.blocks = blocksFor(((t / 60) | 0) % 2 === 0 ? w.text + i : w.text);
      }
    });
    if (done) {
      running.delete(block);
      window.setTimeout(() => block.classList.remove('tx-live'), 900);
      return;
    }
    running.set(block, requestAnimationFrame(tick));
  };
  running.set(block, requestAnimationFrame(tick));
}

let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;

export function initTransmissions(): void {
  io?.disconnect();
  mo?.disconnect();
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-tx]'));
  if (!blocks.length) return;
  blocks.forEach(split);

  // decode on first sight
  const passive = blocks.filter((b) => b.dataset.tx !== 'gate');
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.txDone === '1') continue;
          el.dataset.txDone = '1';
          decode(el);
          io?.unobserve(el);
        }
      },
      { threshold: 0.25 },
    );
    passive.forEach((b) => io?.observe(b));
  } else {
    passive.forEach((b) => (b.dataset.txDone = '1'));
  }

  // a gate decodes each time the camera reaches it
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-build-item]'));
  if (items.length) {
    mo = new MutationObserver((records) => {
      for (const r of records) {
        const item = r.target as HTMLElement;
        if (r.attributeName !== 'data-state' || item.dataset.state !== 'active') continue;
        if (item.dataset.txLast === 'active') continue;
        item.querySelectorAll<HTMLElement>('[data-tx="gate"]').forEach(decode);
      }
      for (const r of records) (r.target as HTMLElement).dataset.txLast = (r.target as HTMLElement).dataset.state || '';
    });
    items.forEach((it) => mo?.observe(it, { attributes: true, attributeFilter: ['data-state'] }));
  }
}

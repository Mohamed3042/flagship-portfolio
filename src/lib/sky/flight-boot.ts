/* =====================================================================
   Story flight — page wiring.

   Mirrors boot.ts for the home: read the payload the page embedded, pass
   the capability gate (never a tier), load the engine after first paint,
   tear it down before Astro swaps the page. `html.flight-live` is the
   switch the CSS uses to hand the hook and proof visuals to the scene.
   ===================================================================== */
import type { FlightData, FlightEngine } from './story';
import { skyCapable } from './boot';

let teardown: (() => void) | null = null;

export function bootFlight(): void {
  teardown?.();
  teardown = null;

  const canvas = document.querySelector<HTMLCanvasElement>('[data-flight-canvas]');
  const dataNode = document.getElementById('flight-data');
  if (!canvas || !dataNode) return;
  const data = JSON.parse(dataNode.textContent || '{}') as FlightData;
  const root = document.documentElement;
  const rtl = root.getAttribute('dir') === 'rtl';

  let engine: FlightEngine | null = null;
  let cancelled = false;
  const onTheme = () => engine?.retheme();
  document.addEventListener('mm:themechange', onTheme);

  if (skyCapable()) {
    const start = () => {
      if (cancelled) return;
      import('./story')
        .then(({ mountFlight }) => mountFlight(canvas, data, { rtl }))
        .then((e) => {
          if (cancelled) {
            e.dispose();
            return;
          }
          engine = e;
          root.classList.add('flight-live');
        })
        .catch((err) => console.warn('[flight] staying on the CSS spine:', err));
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    if (idle) idle(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }

  teardown = () => {
    cancelled = true;
    engine?.dispose();
    engine = null;
    root.classList.remove('flight-live');
    document.removeEventListener('mm:themechange', onTheme);
  };
}

export function stopFlight(): void {
  teardown?.();
  teardown = null;
}

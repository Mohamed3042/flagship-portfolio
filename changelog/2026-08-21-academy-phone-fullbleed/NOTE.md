# Academy of Proven Spells — full-bleed phone cinema
**What:** Fixed the phone reel so the same fourteen-shot Academy film fills portrait and landscape viewports edge to edge while scroll drives one continuous, reversible camera journey.
**Proof:** `ACADEMY_PHONE_GATE_GREEN checks=145` on the live URL at 390×844 and 844×390; stage and frame equal the viewport, zero mattes, fourteen clips forward and reverse, zero runtime/network errors, and 14/14 HTTP 206 range probes.
**Boundary:** The gate covers Chrome mobile emulation at the two owner-named viewports; it does not claim physical-handset GPU performance.
**Shots:** 01-fullbleed-phone-proof.png — Live portrait and landscape act-bridge pixels, boxed at the exact viewport edges to show the cover stage in both orientations.
**LinkedIn paste:** The Academy of Proven Spells now keeps its full scroll-cinema treatment when a phone rotates: full-bleed cover, one monotonic camera journey, reverse-correct scrubbing, and the same fourteen clips with no extra generation. The public release passed 145 browser checks across portrait and landscape.
**Surfaces:** [ ] showcase-pdf [ ] resume [x] website [ ] linkedin [ ] none-needed

Live: <https://mohamed3042.github.io/flagship-portfolio/worlds/academy.html>
Source: `09363fb` · Pages: `eb12233`

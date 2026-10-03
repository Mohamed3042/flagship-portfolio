# MK Downloader — the film is the page

The visitor's scroll is the playhead for the actual 90-second film. Scrolling down advances it; scrolling up reverses it. Every scene uses the real encoded moving image.

The signature is one pinned, full-bleed cinema stage with twelve chapter positions. Overlaid controls fade when idle. Wide screens use the 1920 x 1080 desktop composition; portrait viewports at or below a 4:5 aspect ratio use the dedicated 1080 x 2340 phone composition. Device rotation selects the matching film and preserves progress. A full-screen viewer plays the selected original with music after a user click, and respects the saved Fill setting.

Palette from the product and film: navy #06111F, white #F3F6FF, mint #52F1D2, muted #A3BBD9, border #1D354E, violet #AA99FF. Manrope carries brand and headings; Source Sans 3 carries controls and prose; Cairo supports Arabic controls. The closing section uses the film's mint payoff color.

The default without JavaScript is a normal video with controls and product details. Reduced motion defaults to that player, with an explicit option to enable the scroll experience. Keyboard users can use chapter buttons, a labelled range control, and a skip link.

Short-GOP silent H.264 proxies retain all 90 seconds at 60 fps, with a keyframe every 0.2 seconds and no B-frames. The proxies are 1280 x 720 desktop and 720 x 1560 phone. Direct currentTime seeks maintain timing; one pending target replaces stale requests so reverse scroll remains responsive. Native page scrolling is used. The loading display reports real downloaded bytes and percentage. Versioned media names keep older cached pages working during the update.

The source page lives under public/mk-downloader. The bilingual portfolio project list includes MK Downloader and each work route redirects to the scroll page with its locale. This update publishes only the MK Downloader page and its six new media files, preserving the other portfolio pages and the previous media for cached visitors.

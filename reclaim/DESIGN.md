# Reclaim: scroll the actual film

The user's explicit direction is the complete film viewed through scrolling. The first page used still-image chapters and did not meet that direction. This revision replaces that experience with the actual 90-second film in a pinned viewport.

## Interaction

- Native vertical scroll maps continuously to the video's timeline: downward advances; upward rewinds. The video remains paused, so it stays on the selected frame when scrolling stops.
- The screen contains one video, a quiet header, and a progress control. The full 16:9 picture is contained without cropping its narration. There is no separate chapter slideshow or scrolling text presentation.
- Targets are quantized to the 30 fps timeline. One seek is processed at a time; after decoding, two animation frames allow the paused image to present before draining the latest target. This keeps rapid reversals synchronized with the displayed movie.
- A 1080p, 30 fps, H.264 copy has a keyframe every six frames, no B-frames, no audio, and its MP4 index at the start. It preserves the complete original timeline while making random seeking inexpensive.
- “Watch with sound” switches the same video to the original 1080p/60 fps movie with native controls. Switching back retains the current position. The original movie is also downloadable.
- Reduced motion defaults to the native film player. The user may explicitly choose scroll controls. Without JavaScript, the original movie remains playable with native controls and no long empty scroll region.
- The range control and ordinary Page Up/Page Down provide keyboard access. Scroll events are passive; wheel and touch behavior remain native.
- A separate loading bar and numeric percentage show the sum of buffered time ranges divided by film duration. This measures the portion available to view, not downloaded bytes or scroll position. It remains visible, resets with each video source, and never blocks scrolling while loading. Partial percentages round down; `canplay` does not imply 100%.
- Film settings offer whole-frame fit (the owner's chosen default on phones), optional cropped fill, three scroll speeds, and scroll/native playback. Changing fit does not reload media; changing speed preserves the current frame. Validated choices are stored locally, with a safe session-only fallback when storage is blocked. Restore defaults respects reduced motion and keeps the current film position. The native dialog supports keyboard focus, Escape, and scrolling within short phone screens.
- The route supports English and Arabic, including its controls, errors, and links to the corresponding portfolio case study. Film narration remains the original English text.

## Visual ownership

The film provides all scene motion and composition. `styles.css` owns the minimal surrounding interface: ink `#091116`, parchment `#e8e3d6`, muted paper `#b8c4c9`, mint `#35e0a1`, and rule `#354851`. IM Fell labels the film and Reclaim mark; Inter supports English controls; Cairo supports Arabic. No portfolio-wide tokens are changed.

Settings use native select menus, progress semantics, modal dialog focus, and the browser's dialog-close form. The close form has no data validation. `story.js` owns the three whitelisted preference values and persistence; `premium-ui.json` records these native control choices.

## Acceptance

Check presented frames using `requestVideoFrameCallback` media times and frame pixel hashes, not merely a changing `currentTime` or progress bar. Cover forward and reverse scrolling, rapid changes, idle playback, mouse wheel, Page Up/Page Down, portrait touch scrolling, landscape, Arabic, native playback, reduced motion, JavaScript disabled, and recovery when the scroll asset fails. Save evidence in `production/reclaim/scroll-validation.json`.

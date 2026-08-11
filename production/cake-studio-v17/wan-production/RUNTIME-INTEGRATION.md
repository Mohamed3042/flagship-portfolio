# Runtime integration

Place the 15 unchanged owner downloads in `accepted/` first. They are production inputs, never public files.

Expected filenames:

- `CST17-I01.mp4` through `CST17-I10.mp4`
- `CST17-O01.mp4` through `CST17-O05.mp4`

The normalized web files belong in `public/worlds/cake-studio/v17/clips/`. The page consumes only:

- `public/worlds/cake-studio/v17/manifest.json`
- `public/worlds/cake-studio/v17/clips/CST17-I01.mp4` through `CST17-O05.mp4`
- `public/worlds/cake-studio/v17/stills/` with 17 optimized endpoint stills

Visually accept or reject the unchanged WAN downloads first; their native transport may be 1274×722 with audio and therefore is not expected to satisfy the web-runtime gate.

Run `python scripts/build-cake-studio-v17-media.py`. It keeps the originals unchanged, normalizes into an ignored production staging folder, makes the runtime manifest fail closed before public copies begin, validates every staged clip and join, publishes only hash-equal/resumable files, and flips `ready` only after the complete runtime gate reaches its readiness boundary. Require both `V17_MEDIA_GATE_OK` and `V17_MEDIA_BUILD_OK`.

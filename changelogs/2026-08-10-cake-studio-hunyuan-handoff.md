# Cake Studio World 09 — Hunyuan3D PC handoff

- Date: 2026-08-10
- Branch: `feature/cake-studio-world`
- Current release: `v1.2.0`
- Planned release: `v1.3.0`

## Outcome

The real-asset production pass is prepared for transfer to the owner's RTX 5070 Ti PC. Fourteen isolated, reconstruction-friendly source images are versioned outside the public deploy tree:

- nine distinct finished cake forms;
- one blank selected cake body;
- one removable fondant surface collar;
- one curved edible-image panel;
- one blank bilingual plaque;
- one connected piped topper.

The batch deliberately avoids a contact sheet because image-to-3D generation must receive one object per job. Every source has a stable filename mapped to one expected GLB in `asset-manifest.json`.

## Continuity with v1.2

This does not replace or redesign the existing film. The GLBs are a material upgrade to the dimensional coda that begins after shot 50:

- the nine finished models replace the current procedural cake proxies;
- the five modular models replace the hero assembly proxies;
- `cake-06-two-tier-cocoa` becomes the approved resolved cake and the customer-mockup miniature;
- paper, vitrine glass, lighting and the exact 17 data wafers remain deterministic Three.js objects;
- the procedural implementation remains the loading and failure fallback.

## Return contract

The PC operator generates all assets with Hunyuan 3D Generation V3.1 at 500K faces, textures enabled, PBR/2K when offered, and exports GLB. Raw outputs return to `production/cake-studio/hunyuan3d/generated-glb/` with unchanged basenames.

`npm run verify:cake-studio:glb` verifies the complete cross-machine handoff before integration. The full Windows workflow and subsequent web implementation sequence are recorded in `production/cake-studio/hunyuan3d/PC-HANDOFF.md`.

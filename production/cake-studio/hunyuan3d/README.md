# Cake Studio 3D production pack

This non-public production directory carries the source images and user-returned GLBs for the real-model upgrade to Cake Studio World 09.

- The original PC generation instructions are preserved in [`PC-HANDOFF.md`](PC-HANDOFF.md).
- The manifest now covers 24 independent assets: nine ready cakes, five assembly parts, four data wafers, three chapter wordmarks, and three handoff artifacts.
- Keep the output names defined in [`asset-manifest.json`](asset-manifest.json).
- Keep the untouched returned files in `generated-glb/`; the website loads only the optimized copies in `public/worlds/cake-studio/models/`.
- Validate the complete return batch with `npm run verify:cake-studio:glb`.
- Validate the deployed model budget with `npm run verify:cake-studio:runtime-models`.

The source images live outside `public/` so cloning the feature branch transfers them between machines without adding them to the deployed website.

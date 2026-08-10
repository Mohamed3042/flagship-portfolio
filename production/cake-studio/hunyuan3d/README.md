# Cake Studio Hunyuan3D production pack

This non-public production directory carries the source images and handoff contract for the real-GLB upgrade to Cake Studio World 09.

- Start on the PC with [`PC-HANDOFF.md`](PC-HANDOFF.md).
- Generate from the 14 independent PNG files in [`source-images/`](source-images/).
- Keep the output names defined in [`asset-manifest.json`](asset-manifest.json).
- Put the finished files in `generated-glb/`.
- Validate the complete return batch with `npm run verify:cake-studio:glb`.

The source images live outside `public/` so cloning the feature branch transfers them between machines without adding them to the deployed website.

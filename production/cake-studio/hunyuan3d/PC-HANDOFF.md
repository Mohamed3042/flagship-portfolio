# PC handoff — Cake Studio real GLB pass

> Status: **RETURNED AND INTEGRATED on 2026-08-10.** The original 14-asset instructions below are retained as production history. Ten later user-generated assets expanded the accepted batch to 24. The website now loads the optimized 17.52 MB runtime set while preserving the procedural scene only as a loading/error fallback.

- Date: 2026-08-10
- Source branch: `feature/cake-studio-world`
- Current public release: `v1.2.0`
- Target release after integration: `v1.3.0`
Live page: <https://mohamed3042.github.io/flagship-portfolio/worlds/cake-studio.html>

## What is already finished

- The 50-shot scroll film, bilingual direction, optical bridge, Three.js coda, responsive behavior and GitHub Pages deployment are complete.
- The current coda has three acts: nine ready forms, one controlled assembly, and three production outputs.
- The procedural cakes remain as a safe runtime fallback. Do not delete them on the PC.
- Fourteen isolated reconstruction inputs are committed here: nine finished cakes and five assembly assets.
- The accepted WAN clips, prompts and keyframes are complete and out of scope for this pass.

The runtime that will receive the GLBs is `public/worlds/cake-studio-coda.js`. Do not edit it during generation.

## 1. Get this exact work on the PC

From PowerShell or Git Bash:

```powershell
git clone https://github.com/Mohamed3042/flagship-portfolio.git
cd flagship-portfolio
git switch feature/cake-studio-world
git pull --ff-only origin feature/cake-studio-world
```

If the repository already exists:

```powershell
git fetch origin
git switch feature/cake-studio-world
git pull --ff-only origin feature/cake-studio-world
```

The inputs will be in:

```text
production/cake-studio/hunyuan3d/source-images/
```

## 2. Generate every asset separately

Use these settings for all 14 jobs:

- Model: **3D Generation V3.1**
- Model faces: **500K**
- Texture: **enabled**
- Texture mode: **PBR / 2K**, when offered
- Export: **GLB**
- Animation: off
- One PNG per generation job

Do not upload a collage. Do not use 1M/1.5M, and do not export GIF, MP4, OBJ, FBX, STL or USDZ.

Keep the exact source basename and change only the extension:

```text
cake-01-ivory-spiral.png -> cake-01-ivory-spiral.glb
```

Put every downloaded GLB in:

```text
production/cake-studio/hunyuan3d/generated-glb/
```

## 3. Generation acceptance rule

Keep the raw 500K output even if it is heavy. The integration pass will optimize it.

Regenerate only when one of these is obvious:

- a large part of the object is missing;
- the neutral background became a solid wall or floor fused to the object;
- the mesh is severely torn or hollow;
- textures are entirely absent;
- separate decorations are floating far away from the asset.

Small unwanted floor fragments, wrong scale, rotation, pivot, material roughness and excess polygons are repairable later.

## 4. Verify the batch before pushing

Install the existing project dependencies if needed, then run:

```powershell
npm install
npm run verify:cake-studio:glb
```

The validator requires all 14 expected filenames, GLB v2 headers and non-empty files. It prints every missing or unexpected file and returns a failure code until the handoff is complete.

## 5. Return the generated files through GitHub

When validation is green:

```powershell
git add production/cake-studio/hunyuan3d/generated-glb
git commit -m "Add Cake Studio Hunyuan GLBs"
git push origin feature/cake-studio-world
```

Do not build or deploy from the PC. The generated models are raw production inputs, not web-ready assets.

## 6. Next integration pass

After the GLBs are pushed, the website pass will:

1. inspect every model and remove generated floor/background fragments;
2. normalize orientation, origin, bounding box and relative cake scale;
3. repair PBR material color space and roughness;
4. create desktop and phone mesh/texture budgets;
5. load the nine finished cakes into the ready-form library;
6. animate the five real assembly parts and resolve them into `cake-06-two-tier-cocoa`;
7. reuse the approved cake in the customer vitrine while keeping paper, glass and the 17 exact data wafers as deterministic Three.js objects;
8. preserve the current procedural scene as loading/error/reduced-capability fallback;
9. run structural, browser, phone, sabotage and build checks;
10. publish and live-verify Cake Studio `v1.3.0`.

The important directing rule remains: these models are physical evidence inside the existing film-to-object argument. They must not become a generic turntable gallery.

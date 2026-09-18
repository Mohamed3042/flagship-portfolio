# From Signal to Systems: Director's visual handoff

**Round:** 02 · 18 September 2026  
**Role:** Design direction and review, not a production deployment  
**Target:** The existing bilingual Signal landing implementation  
**Decision:** Preserve the working scroll engine. Raise the composition, material quality and spatial continuity.

## Start here

The four accompanying images are visual reference boards created earlier in this conversation. This pack curates and annotates them; it is not a new image-generation run. They demonstrate lighting, scale, material and spatial ambition. They are **not approved pixel-perfect page layouts, factual product screens, new project identities, or ready-to-deploy runtime assets**.

The owner asked the director to exchange images and instructions with the implementer through GitHub. This handoff authorizes a visual-development collaboration, not an automatic merge, production release, paid generation run, or change to shared dependencies.

The deliverable remains a real scroll-controlled experience. Do not implement the boards as full-page background screenshots, stack their diagram panels as website sections, or replace the particle choreography with a long prerendered video.

## Read the visual references correctly

| Board | Carry into the implementation | Explicitly do not copy |
|---|---|---|
| 01. Horizon | Enormous partially concealed mass; a narrow illuminated rim; quiet readable foreground; deliberate hierarchy. | The invented product called Signal, changed navigation, corner slogans, decorative scroll instructions, rocky clutter, or every bright flare. |
| 02. Star forge | A recognizable broken-arc silhouette; graded particle density; ordered layers; a clear transformation from points into structure. | The fake dashboard, 99% health and other figures, invented capability claims, the human-review portrait, or a three-row static marketing layout. |
| 03. Paperboard | Solid surfaces, hinge relationships, paper thickness, dark material with readable edges, contact and fold shadows. | SIGNAL package branding, invented fulfillment claims, the exact mailer topology unless it matches the actual demonstration, or the unrelated Objects / Environments / People section. |
| 04. Portal | A real threshold, foreground occlusion, visible interior depth, atmosphere that belongs beyond the opening, and a clear arrival in project browsing. | The astronaut and alien landscape as evidence of Cake Studio, fabricated projects such as Tide/Atlas/Lumen/Horizon/Field, invented archive counts, or unrelated archive categories. |

Use the cropped studies to discuss material and silhouette. Use the full boards only as broad composition references. Their generated text is not the content source. Source every visible project name, status, number, screenshot and destination from the current verified repository data.

The existing brand is Mohamed Mahmoud. “From Signal to Systems” is the creative direction, not authorization to invent a separate Signal software product or rebrand Medmac as the owner’s company.

## What was actually inspected this round

Read-only inspection covered the active local Signal worktree, its homepage composition, chapter evaluator, artifact stages, stylesheet, product and design documents, and its review assets. GitHub's showroom source and branch state were also read through the connector.

At inspection, the local implementation was on `feature/signal-to-systems`, with HEAD `9e89e3185bf48114d1beb3ef67a1d49ace95c3d8` and uncommitted Signal changes. That SHA identifies the committed showroom base, **not** the current uncommitted cinematic code. A later status check also showed a newly written `docs/signal-review/` directory. The implementer was changing files during this review, so re-read before editing.

The GitHub branch listing at that time did not include `feature/signal-to-systems`. The director has not published the implementer’s uncommitted source. This documentation branch is based on `design/visual-showroom-20260917` and is not a replacement implementation branch.

There are two different review records:

- `.impeccable/review/finish-review.md` describes the older showroom extension. Its `ship` disposition is not approval of the current Signal replacement.
- `docs/signal-review/README.md` describes the new Signal implementation and reports tests and two review rounds. It explicitly records three open issues: the violet Email tile, the horizon missing at 390px, and clipped limitation text. Its statement about owner acceptance is the implementer’s report, not an independent confirmation by this director.

The director read the current code and the newer intro, carton, portal and portrait captures. No fresh browser run, physical-iPhone test, benchmark rerun or independent verification of the reported 125 tests was performed in this packaging round. Full-page screenshots of a sticky scene are not sufficient evidence about the intermediate animation; blank runway in such a capture is not by itself proof that the live scene is blank.

## The creative decision

**The space gets quieter. The transformation gets stronger. The work remains real.**

A visitor should see a meaningful sequence of changing spatial relationships, not the same left-hand text block beside a different wireframe in every chapter.

Use the shared alignment datum at reading stops. During a major transformation, let the narration recede and let the artifact use the stage. Continuity comes from one camera language, recurring points, common illumination, and a shared edge between scenes. It does not require a permanent vertical divider.

Keep the native scroll path, stable point identities, pure progress evaluator and direct navigation where they work. Do not rebuild the architecture to satisfy a picture. Recompose the scene, materials and transitions on that foundation.

## Priority A: A complete opening, on desktop and portrait

The current desktop intro is dominated by a large white ask-repos screenshot. The portrait capture shows a heavily enlarged crop and does not reveal the horizon. Source inspection found the phone image rule `width:auto; max-width:none; min-width:150%` and desktop outward expansion of the artifact container. Those rules explain part of the composition problem; another arbitrary rim offset will not solve the complete layout.

Keep the factual headline and direct actions. Design three clear spatial zones together: readable copy, actions, and the primary horizon form. Use an intentionally subordinate, named actual-project preview. It should be useful, but the white screenshot should not erase the cosmic thesis before the first scroll.

Protect the copy and action region as a composition constraint. Define camera framing around that protected region for desktop and portrait instead of repeatedly adjusting a single drop multiplier. The rim may leave the viewport for scale, but it must not pass through button text or make an action difficult to perceive.

The portrait camera needs its own horizon composition. Do not compensate by forcing an oversized desktop screenshot into a small viewport. Useful content must fit; atmospheric geometry can crop deliberately.

**Exit:** At the initial viewport, both editions show identity, a named project, both actions, and an unmistakable immense rim-lit form. No screenshot overflow, clipped interface fragment pretending to be a full preview, or missing phone horizon.

## Priority B: The first continuous transformation

Prove `horizon → settled star form → hidden-depth reveal → real automation screen` before polishing all seven chapters.

Formation has an authored order: anchors settle, the main arcs connect, detail arrives, the completed form rests. Prioritize silhouette over count. The broken-arc form is worth keeping. It should not turn into an opaque white rail or a noisy cloud that only the caption explains.

At the alignment camera, the form reads flat. As the camera shifts, near and far points separate while the recognizable form remains traceable. The viewer should discover the depth without needing the explanatory heading.

The workflow should visibly distinguish input, a human-review boundary, and an output example. A travelling record stops at the boundary. Scrolling changes the explanation; it does not grant approval or submit an action.

At the proof stop, the screen becomes the principal object. Match its projected corners, aspect ratio, crop and scale before replacing it with the crisp HTML image. Supporting geometry and particle guides recede. Keep the screenshot’s own color and text outside atmospheric distortion.

**Exit:** The reveal is understandable with the caption hidden; the handoff is seamless enough that the screenshot does not appear to jump, stretch or double-render; the proof stop is steady and readable in both orientations.

## Priority C: The carton must become matter

The current artifact source already defines a panel thickness, rough paper material, hinges, dust flaps, lids and crease shading. Do not claim a physical model is absent. The captured result is nevertheless dominated by the large bright particle cuboid and framing, which hides the intended object.

Let the scaffolding release its visual priority as the panels acquire surfaces. At the final pose the visitor should see a carton, not a container made of bright construction lines with a small product screenshot floating inside it.

Use the paperboard study for roughness, edge definition, thickness and contact light. Preserve a plausible connected dieline matching the demonstration. The reference’s dark mailer is not an instruction to swap the underlying carton model or invent a product output.

Choose a close folding moment and a final recognition pose. The final pose must show enough seam, flap, wall and depth to read without its title. Use approved packaging artwork only where appropriate; do not wrap a whole application screenshot around a face solely because that is the existing handoff surface.

**Exit:** With narration hidden, a viewer recognizes folded packaging; the guides no longer dominate; the object and its actual software evidence remain distinct but connected.

## Priority D: A portal whose interior matches its destination

The source currently uses a genuine Cake Studio frame as a DOM image while the portal stage builds separate generic landscape layers and an expanding frame. The reviewed capture shows the two competing: a floating kitchen image over an unrelated spatial background.

A correctly labelled authorized image is valuable provenance, but it is not a spatial portal by itself.

Build one coherent aperture/interior relationship around the selected World. Use a near rim that occludes the interior and depth layers or geometry that belong to the same environment as the destination. A Cake Studio entrance should lead into a matching patisserie or production space, not into the generated astronaut landscape.

During approach, the interior responds to the camera. At crossing, the frame passes outside the viewport and the interior occupies the stage. The large paragraph recedes so the event is visible. Preserve navigation and an explicit World-entry action. Scrolling only previews; it must not navigate away.

Do not merely duplicate the same image across depth planes or enlarge border rectangles around a stationary picture. If the chosen frame cannot supply a coherent shallow interior, select another approved frame before inventing scenery inconsistent with the World.

**Exit:** With the title hidden, forward/back and a bounded lateral move near the threshold read as entering a space, not zooming a bordered photo.

## Priority E: Arrive in work, not another promise

The current route places selected public work, a method section and private work between the cinema and `ProjectAtlas` at `#sky`. Therefore a chapter named Archive is not yet a demonstrated direct constellation-to-archive handoff.

Resolve that deliberately. Either make the end land on an actual first project row with an obvious route to the full archive, or implement the intended immediate archive arrival with a reviewed section reordering. Preserve existing anchor aliases and complete project access; do not duplicate the catalogue or silently break navigation.

At the handoff, use current project entries for representative nodes and align them with real HTML entries. Then release the sticky scene. The next scroll must reveal useful content, not another empty hold.

**Exit:** The next delivery visibly includes the initial real project rows after the scene, with working links, search/filter access where intended, and predictable Back restoration.

## Priority F: Reading, themes and evidence cannot be collateral damage

The current cinematic limitation rule hides content after a three-line maximum height. Replace it with an accurate short visible boundary plus a clear full-scope disclosure/link, or a correctly sized readable disclosure. Never truncate a qualifier mid-sentence with no indication that more text exists.

Evidence categories must remain explicit words. Weight, line and dash treatments may reinforce “Actual screenshot”, “Illustration”, “Synthetic example” and “World preview”; they are not a secret legend visitors must decode.

Inspect computed styles where `.sr-contact`, `.sr-projects` and `.sr-atlas` reference `--signal-*` variables declared only inside `.signal`. The archive/contact are outside that wrapper. This is a source-level scoping concern to test, not a license to declare every color broken or move global tokens indiscriminately.

Fix the known violet Email tile at the actual owning selector. Preserve six-theme behavior and keep changes local to the landing route. An artistic one-accent rule must not remove visible keyboard focus, warnings, true product states or approved World color.

## How to use generated artwork in production

These boards and their crops are **reference material**. They are not texture maps, alpha-separated layers, approved scene renders, or final product screenshots.

Use them to author camera poses, material studies and lightweight geometry. Derive the point targets from known curves or surfaces. Keep editable sources and provenance outside the public runtime payload. Real interfaces remain approved screenshots or functioning components, not generated dashboard pictures.

A still opening poster may be produced later from the actual scene, so its camera matches the first live frame. Do not crop a busy concept board and call it a clean background plate. Do not start paid image/video jobs as an unstated side effect of this pack.

The original board prompts are recorded separately for provenance. They are not the next implementation prompt; they contained general image-generation wording that allowed content drift. The director’s exclusions here control that drift.

## The next delivery

First deliver the complete opening-to-proof sequence on desktop and portrait. Then extend the material and portal work in a second coherent batch. Do not ask for a new broad direction vote; the direction is pinned. Escalate only actual scope, asset-rights, destructive-operation or approval blockers.

Capture eight poses: entry, aligned form, separated depth, readable automation screen, recognizable carton, media alignment, portal threshold and first real project rows. Capture EN and AR at relevant poses, reduced motion, and narrow-screen composition.

Record a normal-paced forward/reverse pass from the true entry through the real project section. A six-second diagnostic sweep is useful separately, but cannot demonstrate reading pace or ordinary interaction. Mark device/emulation accurately.

Keep technical and visual checks separate. Repeatability can validate a wrong frame. Freeze ambient time for the deterministic comparison; independently assert intended chapter, visible artifact, camera checkpoint, screenshot bounds, portal alignment and usable archive arrival. Do not explain all mid-transition image differences as ambient breath without controlling that variable.

Post the reply using `replies/IMPLEMENTER_REPLY_TEMPLATE.md`. Include the exact implementation commit and, while dirty, a scoped diff hash. State what was tested, merely inspected, not tested, and still open. A verdict must name its source version and evidence set.

## Safety and completion

Use the existing active implementation worktree, but do not reset, stash, switch, clean, or stage unrelated work. Re-read current files before editing. Both `public/` and `node_modules` are shared junctions in the inspected setup; do not install packages or overwrite shared media through them. Establish an isolated dependency/asset destination when genuinely required.

The director’s branch contains documentation and reference assets only. Do not merge it wholesale as a replacement application, deploy it, or publish private captures. The owner remains the release authority.

**The next milestone is not a higher test count. It is a clear horizon, a perceptible depth surprise, a tangible object, a convincing threshold, and a useful arrival in the work.**

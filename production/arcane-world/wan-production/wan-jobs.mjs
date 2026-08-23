export const STYLE_LOCK = "painterly graphic-novel realism, visible brushstrokes, art-deco gold-teal above, neon green-magenta undercity, hand-drawn smoke, hard rim light";

export const SHARED_NEGATIVE = "low resolution, worst quality, blur, compression artifacts, watermark, captions, subtitles, readable text, letters, numbers, logos, duplicate objects, extra limbs, deformed hands, face distortion, morphing, warping, flicker, jitter, frame jump, temporal inconsistency, sudden exposure shift, sudden color shift, unintended cut, split screen, franchise character, champion likeness, known city, rune, gore, child, slum, suffering, horror, photoreal glow, generated letterbox bars";

export const SETTINGS = Object.freeze({
  model: "WAN 2.7",
  mode: "First + Last Frame",
  resolution: "720P",
  durationSeconds: 5,
  outputs: 1,
  promptExtend: false,
  audio: false,
  creditsPerClip: 10,
  zeroRetakeCredits: 400,
  plannedCredits: 600,
  stopReportCredits: 660
});

const seedByFamily = Object.freeze({
  UPPER_CITY: 173201,
  DESCENT: 284302,
  CORE: 395403,
  DISTRICTS: 416504,
  BRIDGE: 527605
});

const actByShot = (shot) => {
  if (shot <= 8) return ["I", "THE CITY ABOVE", "UPPER_CITY"];
  if (shot <= 16) return ["II", "THE DESCENT", "DESCENT"];
  if (shot <= 24) return ["III", "THE CORE", "CORE"];
  if (shot <= 34) return ["IV", "THE DISTRICTS WAKE", "DISTRICTS"];
  return ["V", "THE BRIDGE", "BRIDGE"];
};

const endpointSentence = (firstId, lastId) =>
  `Treat the supplied ${firstId} FIRST frame and ${lastId} LAST frame as immutable exact endpoints.`;

const finishPrompt = (firstId, lastId, core) =>
  `Generate single shot. ${endpointSentence(firstId, lastId)} ${core} Complete the dominant action by 4.5 seconds, match the supplied ${lastId} LAST frame exactly, and hold motionless through 5.0 seconds. ${STYLE_LOCK}. No dialogue. No background music.`;

const descriptors = [
  {
    shot: 1,
    title: "The Gilded Dawn → Gallery Avenue",
    core: "One continuous dawn event lays the existing clouds into visible brushstrokes and carries their warm light down the central avenue until the streets and five monument plinths reach the supplied morning state. Make one slow 35 mm aerial push forward eighty metres toward the city along the avenue axis, preserving the exact skyline, central tower, cliff, ocean, airship lanes, gold-teal architecture, and centered sun as the painted clouds settle."
  },
  {
    shot: 2,
    title: "Gallery Avenue → Arena Globe",
    core: "Each of the five complete plinths keeps its built monument rigid while its existing long shadow coherently reshapes into a small crowd using that monument, then settles in the original sun-cast direction as the brass globe becomes the destination. Make one slow 45 mm lateral track right twelve metres past all five complete plinths, preserving the globe, mask, cannon, dome, statue, their spacing, avenue symmetry, and warm upper-city daylight."
  },
  {
    shot: 3,
    title: "Arena Globe → Mask Plinth",
    core: "The emerald-teal ocean inside the existing brass globe completes one gentle circulating swell while the glass carries a live reflection of one athlete's long leap toward the neighboring mask plinth. Make one slow 60 mm clockwise orbit of eight degrees around the globe, preserving the floating-island positions, moving water, glass reflections, gold gallery daylight, and rigid globe geometry as its real brass meridian crosses the lens as natural foreground occlusion."
  },
  {
    shot: 4,
    title: "Mask Plinth → Atelier Dome",
    core: "The carved leaves around the existing mask perform one coherent rearrangement into a second readable face, then the same leaf forms finish as settled petals while the neighboring dome gleams beyond the gold frame. Make one slow 50 mm lateral track right four metres across the mask, preserving the rigid jungle-king features, bright inlays, gallery daylight, and carved material as the real frame passes close to the lens as physical occlusion."
  },
  {
    shot: 5,
    title: "Atelier Dome → Statue Hall",
    core: "The existing printed picture completes one visible repaint stroke as its sheet settles onto the cake and dissolves cleanly into frosting; the resulting warm steam rises as a single coherent veil toward the statue hall. Make one slow 70 mm macro push forward one metre over the settling sheet, preserving the glass dome, brass arms, porcelain cake, warm window light, and painterly materials as the real steam passes across the lens as physical occlusion."
  },
  {
    shot: 6,
    title: "Statue Hall → Clock of Checks",
    core: "The painted half of the existing statue completes one shallow breath while the marble half remains rigid; one gold clock reflection catches both eyes and travels down the central sternum seam. Make one slow 85 mm push forward 1.5 metres toward that seam, preserving the two material halves, stern identity, hard side light, statue proportions, and hall architecture as the real gold reflection expands across the lens into the supplied clock composition."
  },
  {
    shot: 7,
    title: "Clock of Checks → The Grate",
    core: "Each existing green-gold window in the clock ring holds one minute machine scene completing its check; the full ring then reaches one steady illumination whose reflection descends along the tower brass toward the street grate. Make one slow 40 mm crane upward fifteen metres along the clock face, preserving the exact circular geometry, brass ribs, window count, warm sky, and architectural axis as the real outer rim passes across the lens as physical occlusion."
  },
  {
    shot: 8,
    title: "The Grate → The Lift",
    core: "The same adult faceless engineer lifts the existing street grate as green undercity glow paints the coat's shadow upward across the wall, then completes the action by stepping down into the waiting brass cage lift. Make one controlled 50 mm push forward one metre behind the engineer's shoulder, preserving the navy coat, gold seams, parapet, city light direction, rigid grate, and vertical shaft geometry as the grate rim becomes natural foreground occlusion."
  },
  {
    shot: 9,
    title: "The Lift → Smog Sea",
    core: "The occupied brass cage lift performs one steady descent while the existing masonry strata scroll past like frames of an old film reel, each era remaining a finished architectural layer before the cage enters the green smog sea. Keep one locked 35 mm camera riding with the cage downward thirty metres at a constant speed, preserving the faceless engineer silhouette, cage proportions, shaft rails, mosaic strata, green-magenta lights, and deep workshop geography."
  },
  {
    shot: 10,
    title: "Smog Sea → Decompiler Bench",
    core: "The descending cage breaks through one coherent smog layer while the existing abstract neon sign-shapes bend their light around the smog instead of through it; the vapor parts around the rigid cage and the workshop lane brightens ahead. Make one controlled 30 mm crane forward fifteen metres through the opening, preserving the iron and verdigris catwalks, magenta shapes, distant city scale, atmospheric density, and pipe geography as one real pipe supplies natural foreground occlusion."
  },
  {
    shot: 11,
    title: "Decompiler Bench → Recovered Ladder",
    core: "The existing golden reel unspools one final measured length into the punched-glass rack while its wall shadow shows tiny figures dancing the data being read; the last plate clicks into place and steadies. Make one patient 65 mm macro track right 1.5 metres along the reel path, preserving the exact machine, bench, plate edges, rear-view engineer, green workshop light, and real wall projection as the completed rack becomes the supplied landing composition."
  },
  {
    shot: 12,
    title: "Recovered Ladder → Character Forge",
    core: "The existing backlight travels once from the lowest punched plate to the highest and casts their reflection onto the wall as an actual staircase of light, where the top step steadies at the open character-forge bay. Keep one locked 60 mm camera with zero translation and zero orbit, preserving the illuminated plates, etched marks, walls, catwalks, and centered engineer as the brightest real plate fills the lens as physical occlusion."
  },
  {
    shot: 13,
    title: "Character Forge → Export Tree",
    core: "The existing brass armatures lift the blank mannequin through one continuous sheet of paint until the finished body clears the surface; the mirror already shows that finished result while the gauge needle settles inside its thin green band. Make one slow 55 mm lateral track right six metres past the forge and mirror, preserving mannequin proportions, armature count, paint surface, workshop palette, rear-view engineer, and rigid machinery as the connected copper trunk becomes the destination."
  },
  {
    shot: 14,
    title: "Export Tree → Transport Loom",
    core: "Exactly four identical droplets leave exactly four existing valves at the same instant and land in exactly four visible copper channels leading toward the transport loom. Make one slow 45 mm push upward six metres along the single copper trunk to its four-way split, preserving the exact valve count, four door colors, droplet identity, trunk geometry, rear-view engineer, rigid pipes, and undercity light as the four channels carry the action toward the supplied loom bed."
  },
  {
    shot: 15,
    title: "Transport Loom → Gantry Wide",
    core: "One coherent pulse travels from near to far across the existing woven light net; its knots brighten and dim in sequence like one living wave before the pulse reaches the ocean chart's distant edge. Make one slow 50 mm clockwise orbit of eighteen degrees above the loom bed, preserving every net knot, chart, brass frame, faceless engineer, green haze, magenta accents, and continuous workshop geography as the high gantry enters the supplied landing composition."
  },
  {
    shot: 16,
    title: "Gantry Wide → Raw Vat",
    core: "The same adult faceless engineer walks ten metres along the high gantry toward the existing magenta vat while every visible steam plume leans in the same direction toward that destination and holds its coherent flow. Make one patient 35 mm track forward eight metres behind the engineer at walking speed, preserving the navy coat, gold seams, rail height, machine layout, green atmospheric light, rigid workshop geography, and consistent screen direction until the vat dominates the supplied frame."
  },
  {
    shot: 17,
    title: "Raw Vat → The Gathering",
    core: "One existing magenta arc rises from the iron vat, freezes for one readable blink into glyph-like hand-drawn shapes, resumes its fluid path, and reaches the gantry rail as a single continuous energy event. Make one controlled 58 mm push forward five metres toward the vat rim, preserving the vessel, drawn-magenta energy, gantry, rear-view engineer, green workshop light, rigid pipe geography, and painterly arc thickness as the real rail crosses the lens as foreground occlusion."
  },
  {
    shot: 18,
    title: "The Gathering → The Press",
    core: "The existing pneumatic tubes release one coordinated flight of brass cards toward the central hopper while each card shadow shows a tiny scene of the machine that sent it; the full hopper closes its lid once. Make one steady 40 mm lateral track right ten metres beneath the tubes, preserving card count continuity, tube paths, real shadows, rear-view engineer, green-magenta workshop palette, and hopper geometry as the closed lid supplies the landing surface."
  },
  {
    shot: 19,
    title: "The Press → Facet Lathe",
    core: "The existing screw press completes one measured compression of the loaded cards into a single rough dark gem; at the strike, the room's light stamps down as one coherent plane and the opened press holds the steaming result. Keep one locked 50 mm camera with zero translation and zero orbit on the press bed, preserving the screw, hopper, bright work-light rectangle, engineer silhouette, iron floor, green-magenta machinery, and centered vertical mechanism."
  },
  {
    shot: 20,
    title: "Facet Lathe → Ignition Chamber",
    core: "The existing brass lathe cuts the rough gem facet by facet through one continuous rotation while each new facet shows a different machine scene as a stable embedded image; the final facet catches the vat's magenta glow. Make one slow 85 mm macro track forward 1.2 metres along the cutting head, preserving the gem's polygon count, brass cradle, rear-view engineer, rigid assembly, work light, and distinct facet boundaries as the completed gem fills the supplied landing composition."
  },
  {
    shot: 21,
    title: "Ignition Chamber → The Ignition",
    core: "The existing magenta arcs crawl from the two opposing coils toward the suspended faceted gem while each coil shadow lengthens and both shadows join into one tower silhouette on the chamber wall. Make one slow 45 mm clockwise orbit of ninety degrees around the chamber at constant speed, preserving the upper and lower coils, centered gem, rear-view engineer, rigid machinery, magenta energy, hard rim light, and real wall shadow as the arcs reach the supplied ignition position."
  },
  {
    shot: 22,
    title: "The Ignition → The Climb",
    core: "The existing magenta arcs strike the suspended gem and turn blue as they pass through it; one coherent blue shockwave then repaints the chamber surfaces in brighter brushstrokes from the gem outward. Make one controlled 40 mm push forward six metres into the flood of light, preserving the faceted core, opposing coils, rear-view engineer, rigid iron pipes, chamber geometry, and hand-drawn energy as the supplied blue ignition state becomes stable."
  },
  {
    shot: 23,
    title: "The Climb → Arrival Above",
    core: "The stable blue light runs upward through the existing pipe network floor by floor, and each architectural era wakes in its own palette only as the physical light front reaches it before arriving at the street grates. Make one steady 35 mm vertical rise thirty-five metres alongside the light, preserving every masonry stratum, rigid pipe axis, centered composition, era boundaries, and causal illumination as the upper-city direction enters the supplied frame."
  },
  {
    shot: 24,
    title: "Arrival Above → District Table",
    core: "The blue light reaches the upper street one beat before it finishes leaving below, then the existing lamps, monuments, and clock ring bloom in one causal street-level sequence until the city stands fully lit. Make one slow 40 mm push forward two metres at street level, preserving the tower axis, gold-teal architecture, open grate, streetlamp spacing, blue central thread, and consistent light direction as the last real brass reflection fills the lens."
  },
  {
    shot: 25,
    title: "District Table → Arena District",
    core: "The exactly five existing district pools wake together and fuse through the engraved channels into one continuous gradient; the arena pool expands within that same physical light path until its globe becomes the destination. Make one slow 40 mm lateral track right three metres past the brass model, preserving exactly five pools, two observer silhouettes, tabletop geometry, blue connecting lines, and city layout as the real arena globe and glass rim fill the lens."
  },
  {
    shot: 26,
    title: "Arena District → The Match",
    core: "One arena match streak travels between the existing floating islands while every island shadow on the emerald-teal ocean remains the exact shape of its district-map counterpart and the distant sport action stays coherent. Make one steady 35 mm track forward twenty metres in a flythrough between islands, preserving their positions, brass rings, ocean scale, upper-city daylight, blue paths, and rigid map correspondence as the active platform becomes the supplied destination."
  },
  {
    shot: 27,
    title: "The Match → Mask District",
    core: "One foreground athlete completes a single long sport leap between the existing islands while the brass ring unfurls heraldic banners as the score; the banners settle as the athlete reaches the landing platform. Make one steady 35 mm tracking move forward ten metres beside the athlete at matching speed, preserving the floating-island positions, emerald-teal ocean, blue light trail, distant participants, gold architecture, and safe athletic staging as the real fabric supplies a foreground wipe."
  },
  {
    shot: 28,
    title: "Mask District → Artillery District",
    core: "The existing flat painted mask mural performs one continuous peel away from the stone wall, becoming a rigid 3D carved king who completes the motion by placing one foot onto the terrace. Make one slow 50 mm push forward four metres as the peel completes, preserving the same face, leaf silhouette, warm jungle inlays, terrace masonry, material colors, and upper-city daylight as the newly physical figure fills the supplied landing composition."
  },
  {
    shot: 29,
    title: "Artillery District → Atelier District",
    core: "The existing artillery arcs rise above the dusk hill, freeze once into a readable dotted diagram when the carved king looks upward, resume their coherent paths, and let one arc land as a soft distant firework. Make one slow 45 mm crane upward sixteen metres from the hill toward the sky, preserving the king from behind, brass cannon park, amber dusk, safe public space, crowd scale, and exact arc spacing as the warm smoke supplies natural foreground occlusion."
  },
  {
    shot: 30,
    title: "Atelier District → The One Face",
    core: "The final edible sheet completes one gentle settling action onto the existing cake while every cake reflection in the polished brass counter shows its stable source picture and the last reflection aligns with the statue-hall archway. Make one slow 55 mm lateral track right eight metres along the counter, preserving the bakers from behind, floral cakes, glass dome, carousel, warm daylight, brass surfaces, and distinct source pictures as the real final reflection fills the lens."
  },
  {
    shot: 31,
    title: "The One Face → Film District",
    core: "One style seam travels steadily across the same face through the four existing archways—painted naturalism, toon, faceted form, and dusk—while both eyes remain aligned and the fourth arch completes the transformation. Make one slow 85 mm push forward two metres on the face mid-cross, preserving one identity, four stable presentations, arch geometry, marble-brass materials, gaze direction, and centered facial proportions as the fourth real arch fills the supplied landing composition."
  },
  {
    shot: 32,
    title: "Film District → Six Desks",
    core: "The existing giant brass crank performs one deliberate half-turn in reverse, making the projected film run backward while it remains contained inside the screen behind its rigid brass frame; the crank stops and the frame holds. Make one slow 40 mm track forward eight metres from behind the crank toward the screen, preserving the audience silhouettes, curved film path, projector light, wheel geometry, theater scale, and screen surface as the held image fills the supplied landing composition."
  },
  {
    shot: 33,
    title: "Six Desks → Two Cities",
    core: "The walking adult completes one circuit to the empty chair and rests one hand on it while the lamps at exactly six desks cast one shared shadow direction across the round chamber floor. Make one patient 50 mm clockwise orbit of one hundred twenty degrees inside the circle, preserving exactly six desks, five seated workers, one empty chair, six different crafts, warm lamp pools, circular spacing, and stable adult silhouettes as the shared shadow points toward the supplied destination."
  },
  {
    shot: 34,
    title: "Two Cities → City Ledger",
    core: "The gold-teal upper-city palette and green-magenta undercity palette meet at the horizon as one seamless painted gradient while both cities complete one slow breath of light and the existing blue thread keeps them joined. Make one slow 30 mm crane upward twenty metres and hold, preserving the bridge tower, faceless engineer, city geometry, night haze, palette identities, horizon, and continuous blue connection as the real tower window becomes the supplied transition surface."
  },
  {
    shot: 35,
    title: "City Ledger → Heliograph",
    core: "The existing brass rule lines rise from the ledger page one half-beat before the blue stylus reaches each position, then the completed page turns once to a blank spread as one continuous bookkeeping action. Make one slow 85 mm macro track forward 1.5 metres down the page, preserving the paper fibers, abstract seals, inlaid borders, stylus shape, warm desk light, and rigid brass geometry as the raised final rule supplies physical foreground occlusion."
  },
  {
    shot: 36,
    title: "Heliograph → Bridge Walk",
    core: "The existing heliograph performs one patient light exchange across the dark ocean: the far shore answers the same rhythm in reverse and both rhythms interleave once before becoming steady. Keep one patient held 50 mm camera with zero translation and zero orbit aimed past the signal lamp toward the horizon, preserving the paired light path, tower geometry, blue bridge lamps, ocean darkness, restrained dawn edge, and exact far-shore position as the real lens remains the foreground anchor."
  },
  {
    shot: 37,
    title: "Bridge Walk → Empty Plinth",
    core: "The same adult faceless engineer walks twelve metres toward the gallery while the existing single shadow splits into one gold twin and one magenta twin that remain separated and move in step beside the coat. Make one steady 40 mm retreat ten metres ahead of the engineer at matching speed, preserving the bridge rail, both city lights, dawn direction, navy coat, gold seams, adult silhouette, and two colored shadows until the gallery end becomes the supplied destination."
  },
  {
    shot: 38,
    title: "Empty Plinth → Public Core",
    core: "The existing half-pulled dust sheet keeps its real fabric shape while its folds hint at the next monument's silhouette and one band of morning light climbs from the empty plinth base to its top. Make one slow 50 mm push forward two metres and settle on the waiting plinth, preserving the clearly empty stone, gallery avenue, teal cloth, gold daylight, rigid pedestal, and benign atmosphere as the illuminated folds become the supplied transition surface."
  },
  {
    shot: 39,
    title: "Public Core → Last Dawn",
    core: "One small facet of the stable blue public core shows this exact camera move as it recurs inside its own image while the surrounding facets show the living districts and settle into steady light as dawn rises. Make one slow 60 mm push forward two metres into the facet field, preserving the core housing, clockwork, gathered citizens, blue geometry, gold hall, district identities, and sunrise direction as the recursive real facet fills the supplied composition."
  },
  {
    shot: 40,
    title: "Last Dawn → Gilded Dawn Loop",
    core: "The same city performs one continuous predawn-to-sunrise light change: streetlamps dim into honest daylight while the final visible cloud brushstroke lays itself in the exact opening shape and then settles. Keep one held 35 mm aerial camera with zero translation and zero orbit, preserving the skyline, central tower, avenue, cliff, ocean, airship lanes, horizon, and composition until the supplied gilded opening frame is matched exactly."
  }
];

export function discoverKeyframes(files) {
  const frames = new Map();
  for (const file of files) {
    const match = /^ARC-KF(\d{2})-[a-z0-9-]+\.png$/.exec(file);
    if (match) frames.set(`ARC-KF${match[1]}`, file);
  }
  return frames;
}

export function buildJobs(files) {
  const byId = discoverKeyframes(files);
  const hardAnchors = new Set([1, 8, 16, 22, 25, 34, 40]);

  return descriptors.map((descriptor) => {
    const firstId = `ARC-KF${String(descriptor.shot).padStart(2, "0")}`;
    const lastId = descriptor.shot === 40
      ? "ARC-KF01"
      : `ARC-KF${String(descriptor.shot + 1).padStart(2, "0")}`;
    const firstName = byId.get(firstId);
    const lastName = byId.get(lastId);
    if (!firstName || !lastName) throw new Error(`missing endpoint ${firstId} -> ${lastId}`);
    const [act, actTitle, seedFamily] = actByShot(descriptor.shot);

    return {
      id: `ARC-${String(descriptor.shot).padStart(3, "0")}`,
      position: descriptor.shot,
      act,
      actTitle,
      title: descriptor.title,
      output: `ARC-${String(descriptor.shot).padStart(3, "0")}.mp4`,
      firstId,
      lastId,
      firstName,
      lastName,
      first: `../../../public/worlds/assets/arcane/keyframes/${firstName}`,
      last: `../../../public/worlds/assets/arcane/keyframes/${lastName}`,
      seedFamily,
      seed: seedByFamily[seedFamily],
      hardAnchor: hardAnchors.has(descriptor.shot),
      promptExtend: false,
      prompt: finishPrompt(firstId, lastId, descriptor.core),
      negative: SHARED_NEGATIVE
    };
  });
}

export const STYLE_LOCK = "photoreal IMAX space realism, practical-model hulls, hull-mounted camera, vacuum blacks, warm amber accretion glow, dust-earth naturals, film grain";

export const SHARED_NEGATIVE = "low resolution, worst quality, blur, compression artifacts, watermark, captions, subtitles, readable text, letters, numbers, logos, duplicate objects, extra limbs, deformed hands, face distortion, morphing, warping, flicker, jitter, frame jump, temporal inconsistency, sudden exposure shift, sudden color shift, unintended cut, split screen, nebula candy, fantasy color, horror, generated letterbox bars";

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
  DUST: 101101,
  CROSSING: 202202,
  WORLDS: 303303,
  LATTICE: 404404,
  RETURN: 505505
});

const actByShot = (shot) => {
  if (shot <= 8) return ["I", "THE DUST", "DUST"];
  if (shot <= 16) return ["II", "THE CROSSING", "CROSSING"];
  if (shot <= 26) return ["III", "THE WORLDS", "WORLDS"];
  if (shot <= 34) return ["IV", "THE LATTICE", "LATTICE"];
  return ["V", "THE RETURN", "RETURN"];
};

const endpointSentence = (firstId, lastId) =>
  `Treat the supplied ${firstId} FIRST frame and ${lastId} LAST frame as immutable exact endpoints.`;

const finishPrompt = (firstId, lastId, core) =>
  `Generate single shot. ${endpointSentence(firstId, lastId)} ${core} Complete the dominant action by 4.5 seconds, match the supplied ${lastId} LAST frame exactly, and hold motionless through 5.0 seconds. ${STYLE_LOCK}. No dialogue. No background music.`;

const descriptors = [
  {
    shot: 1,
    title: "The Dust Front → The Bench",
    core: "The grey dust front advances steadily toward the lone workshop and its airflow carries one coherent ribbon of fine dust through the warm open window, where that same dust settles onto the glass plate as one clean standing waveform beneath the horn speaker. Make one slow straight 35 mm push forward eight metres through the window and down toward the plate, using the window frame as natural occlusion, never a cut. Preserve the exact barn, mast, warm window, workbench geometry, earth-tone palette, and centered action."
  },
  {
    shot: 2,
    title: "The Bench → The Relic Shelf",
    core: "The clean dust waveform gives one patient pulse and its moving shadow travels across the exact workshop wall until one shadow-star on the relic projection brightens. Make one slow 50 mm lateral truck right by 1.5 metres from the glass plate to the existing relic shelf, keeping the workbench physically continuous in foreground parallax. Preserve every cartridge, reel, board, dust sheet, and unlabeled projection; add no readable marks or people."
  },
  {
    shot: 3,
    title: "The Relic Shelf → The Decode",
    core: "The single bright shadow-star sends one narrow mechanical cue across the existing bench and the pen plotter draws one elegant course curve on blank paper, advancing only when the real mast blinks through the window. Make one patient 45 mm lateral track left by 1.2 metres from the relic shelf to the plotter while keeping shelf, bench, and window in one continuous room. Preserve all relic counts and blank surfaces; the curve remains abstract geometry with no text, coordinates, ticks, or numerals."
  },
  {
    shot: 4,
    title: "The Decode → The Tarp",
    core: "As the plotter completes its single course curve, one pair of stable gloved hands pulls the existing grey tarp upward and backward from the compact matte-white spacecraft, exposing the unchanged blank-marked hull while a restrained sheet of dust cascades in the plotted curve. Make one slow 40 mm crane back and upward by two metres from the plotter to the craft, with the bench crossing foreground as natural occlusion. Preserve workshop geometry, craft scale, blank hull, one pair of hands, and realistic cloth and dust physics."
  },
  {
    shot: 5,
    title: "The Tarp → The Suit",
    core: "The exposed craft remains fixed while the same faceless pilot enters the already open cockpit and performs one deliberate preparation sweep: both correct gloved hands seal one cuff and continue across the worn toggle row so amber instruments wake bank by bank. Make one slow 70 mm push forward 2.5 metres through the open cockpit rim to the supplied over-shoulder cabin framing; the rim creates the only natural occlusion. Preserve the exact hull, narrow cold-grey cabin, charcoal suit, dark blank visor, and workshop reflection; never reveal a face."
  },
  {
    shot: 6,
    title: "The Suit → The Launch",
    core: "The last amber instrument bank reaches full steady light and the same craft performs one vertical launch, accelerating upward through the brown dust front until brown boil yields to a thin blue band and then still black space. Keep one rigid hull-mounted camera with zero operator movement; the craft travels straight upward roughly two kilometres, fast at first and easing as atmosphere falls away. Preserve the sharp centered hull edge, blank utilitarian materials, pilot identity, and one craft only; nothing flutters in vacuum."
  },
  {
    shot: 7,
    title: "The Launch → The Marble",
    core: "The same ascent continues as the dust and blue atmosphere recede beneath the hull until the home world resolves into one restrained dust-marbled sphere, its night-side beacon blinking and its terminator clouds forming the bench waveform. Keep one hull-mounted backward-looking camera and let the craft move away from the planet at a steady physical speed, with no free-camera drift; the visible hull edge shifts only ten percent toward the frame edge. Preserve one planet, one beacon, pin-sharp stars, and the distant plain ring station."
  },
  {
    shot: 8,
    title: "The Marble → The Relay Ring",
    core: "The same tiny craft approaches the distant utilitarian relay ring and performs one slow clockwise roll of about thirty degrees until its orientation matches the station rotation; as alignment completes, the station and craft appear still while the starfield wheels behind them. Make one slow 40 mm track forward along the craft flank by thirty metres toward the ring. Preserve the dust-marbled home world receding behind, one craft, one ring station, practical grey truss geometry, blank surfaces, and vacuum black."
  },
  {
    shot: 9,
    title: "The Relay Ring → The Capture",
    core: "The aligned craft performs one controlled docking drift straight into the relay port until the mechanical latch petals close around the matching collar and one small frost cloud jumps outward. Make one slow 85 mm push forward twenty metres along the craft flank into the latch macro, reducing speed continuously as contact nears. Preserve station rotation, rigid hull geometry, one amber port light, exact latch count, pin stars, and vacuum behavior; no atmosphere, collision, or camera shake."
  },
  {
    shot: 10,
    title: "The Capture → The Message Corridor",
    core: "The closed docking petals complete one firm locking action; the released frost particles briefly organize into a perfect ring, scatter, and reveal the open relay passage beyond. Make one patient 45 mm dolly forward eight metres through the now-open pressure passage and into the humane archive corridor, using the circular port as natural occlusion without any cut. Preserve the hard dock, one amber light, blank slates, warm hand-shaped light shadows, open shelves, wire globe at the far end, and library calm."
  },
  {
    shot: 11,
    title: "The Message Corridor → The Thread Globe",
    core: "As the camera passes the blank physical slates, their existing amber light-shadows write in sequence and the many real threads connected to the distant wire globe tighten into one strong tactile braid aimed through the viewport. Make one patient centered 45 mm dolly forward twelve metres down the corridor, ending in the supplied 55 mm globe framing without an orbit. Preserve all shelf geometry, abstract seal lights, blank surfaces, warm humane tone, and one open wire globe; create no bodies, text, labels, or magic glow."
  },
  {
    shot: 12,
    title: "The Thread Globe → The Departure Burn",
    core: "The single tightened braid points through the viewport and the same docked craft performs one clean departure burn away from the relay ring toward that glint, twin recessed thrusters producing restrained pale exhaust. Make one slow 55 mm quarter-orbit of ninety degrees around the wire globe until the viewport fills the frame and the exterior pursuit composition is reached through the glass, never by a cut. Preserve the globe, braid, one ring, one craft, blank hull, pin stars, and vacuum black; the craft stays needle-sharp."
  },
  {
    shot: 13,
    title: "The Departure Burn → The Sphere",
    core: "The same craft continues one long straight burn toward the glint until it resolves physically into a perfect transparent sphere of lensed starlight; surrounding star streaks bend around the craft while its matte hull stays needle-sharp. Make one locked 35 mm pursuit move that advances fifty metres behind the craft at constant speed, with the relay ring shrinking on axis. Preserve one craft, twin pale exhausts, the exact surrounding starfield mirrored continuously inside the sphere, vacuum black, and zero nebula color."
  },
  {
    shot: 14,
    title: "The Sphere → The Crossing",
    core: "The same craft performs one steady forward ingress through the transparent lensed sphere; the unchanged surrounding stars wrap continuously across the rim and the matte hull reflections stretch into physical ribbons as the hull edge begins to elongate. Keep one locked hull-mounted 40 mm camera moving forward roughly two hundred metres with no roll or free-camera motion. Preserve the one gravitational lens, rigid utilitarian hull, real starfield continuity, restrained amber instruments, and black vacuum; never form a portal, tunnel, or colorful energy."
  },
  {
    shot: 15,
    title: "The Crossing → The New Sky",
    core: "The same craft completes one continuous transit through the lensed field: wrapped hull reflections pull taut, a restrained amber instrument reflection briefly doubles the cabin, then the stretch releases into a clean new sky containing exactly five distinct worlds on one natural bright arc and one distant dark mass with a thin amber ring. Keep one rigid hull-mounted camera advancing straight ahead roughly three hundred metres at constant speed. Preserve the craft and reflections with no free camera, tunnel, extra planets, moons, nebulae, or fantasy color."
  },
  {
    shot: 16,
    title: "The New Sky → The Floating Sea",
    core: "The same craft performs one slow measured descent toward the first of exactly five worlds, entering its thin cloud deck until steel-blue ocean and enormous weathered floating stone islands appear below, each with one matching shadow directly on the sea. Keep one hull-mounted 30 mm camera and pitch it downward fifteen degrees slowly while the craft descends about one kilometre; the other four worlds leave frame only through the cloud occlusion. Preserve one craft, exactly five initial worlds, no moons, natural atmosphere, centered hull edge, and landing skids approaching one island."
  },
  {
    shot: 17,
    title: "The Floating Sea → The Arena Bones",
    core: "The same craft completes one landing approach onto a floating stone island and the same faceless pilot advances from the already open hatch to plant one plain survey pylon beside the half-buried circular arena, its amber lamp waking as its shadow climbs onto the island above. Keep one hull-height 45 mm camera moving forward six metres behind the pilot at a steady walking speed, using the hatch rim as natural occlusion. Preserve the steel-blue sea, floating-island shadows, one pilot, one pylon, exact suit, and calm natural wind."
  },
  {
    shot: 18,
    title: "The Arena Bones → The Green Lagoons",
    core: "The planted pylon emits one narrow steady survey pulse and the same craft follows that direction into a low flight over the next wet-green world, where a chain of dark lagoons and monumental moss-covered king masks fills the route ahead. Make one continuous 35 mm forward flight of roughly three hundred metres, rising through a low cloud band that naturally occludes the island before descending over the jungle; never cut or dissolve. Preserve one pylon at departure, one craft viewpoint, natural humid daylight, moving water with perfectly still reflections, and no readable symbols."
  },
  {
    shot: 19,
    title: "The Green Lagoons → The Mask Survey",
    core: "The same pilot performs one slow deliberate wipe across the nearest carved king mask, removing a single strip of moss so natural mineral inlays emerge while the lagoon reflection below remains a flat two-dimensional painted version of the fully three-dimensional stone. Make one 70 mm push forward by seventy centimetres from the low flyover framing to the stable hand macro, with foliage crossing the lens as natural occlusion. Preserve one anatomically correct gloved hand, one mask, one amber pylon in soft background, exact water behavior, and no face."
  },
  {
    shot: 20,
    title: "The Mask Survey → The Glass Arcs",
    core: "Sunlight travels once along the newly exposed mineral inlay and continues as a restrained warm line across the terrain toward the next dusk-ochre ridge, revealing large dead fossil-glass arcs overhead with one faint frozen tracer inside each. Make one patient 40 mm lateral track right by ten metres, passing behind the stone mask and a dark rock face as natural occlusions before settling behind the same walking pilot and one pylon. Preserve natural mineral color, rigid glass, one pilot, no weapons, no combat, and no readable symbols."
  },
  {
    shot: 21,
    title: "The Glass Arcs → The Re-Ignition",
    core: "The same pilot plants the single survey pylon and its amber lamp triggers one clear sequential re-ignition: the existing fossil-glass arcs light end-to-end in a readable firing order across the whole dusk-ochre sky, then hold as one vast constellation diagram. Make one slow 40 mm crane upward six metres from the pilot's boots to the full sky, keeping the tiny faceless pilot centered at the bottom for scale. Preserve every arc position, one pylon, natural ochre atmosphere, and recovered-system awe; no battle, explosion, extra lights, or fantasy color."
  },
  {
    shot: 22,
    title: "The Re-Ignition → The Ice Gallery",
    core: "The ordered glass arcs complete their single light sequence and their pale reflection travels across a natural cloud veil that clears onto the next glacier-white world, revealing exactly three mannequin-like clothed figures preserved mid-stride inside one broad blue-ice wall. Make one slow 50 mm lateral track right by eight metres, letting the bright cloud and ice ridge create continuous natural occlusion rather than a cut. Preserve the same pilot's approaching glove, exactly three featureless figures, calm gallery presentation, dark face planes, and a hairline of melt only around their silhouettes."
  },
  {
    shot: 23,
    title: "The Ice Gallery → The Thaw",
    core: "Exactly one featureless mannequin-like clothed shell performs one measured step forward out of the blue ice while a fine curtain of frost dust rises around it in backlight; the other preserved figures remain still and safe behind. Keep one locked 55 mm camera with no operator motion, allowing only a subtle five-centimetre focus settle toward the emerging shell. Preserve exactly three initial figures, empty dark face planes, elegant cloth physics, one approaching glove, calm gallery geometry, and one amber pylon waking softly; no living face or peril."
  },
  {
    shot: 24,
    title: "The Thaw → The Greenhouse Moon",
    core: "The single empty shell's lifted frost curtain continues upward into a pale steam veil that clears inside the next practical greenhouse dome, where blank edible sheets settle one by one onto pale geometric confections on a slow carousel. Make one controlled 60 mm lateral track right by six metres through the steam and along the carousel, with the veil providing physical occlusion and no cut. Preserve the empty shell receding behind, clean ration lab, one dome, blank sheets, warm humane work light, black sky, and no readable image or text."
  },
  {
    shot: 25,
    title: "The Greenhouse Moon → The Five Beams",
    core: "The final blank edible sheet performs one gentle settling action onto its confection as its last pigment disappears with the steam; the camera continues outward until the greenhouse moon joins exactly four other distinct worlds, each emitting exactly one separate narrow amber survey beam toward one blinking convergence point. Make one slow centered 30 mm pullback of roughly one thousand kilometres, keeping all five worlds and all five beams countable. Preserve exactly five worlds, exactly five beams, no moons or extras, one turning craft, no additional rays, lens flares, or star streaks."
  },
  {
    shot: 26,
    title: "The Five Beams → The Ring",
    core: "The same craft performs one slow turn toward the single blinking convergence point and follows it until the distant dark massive object and its thin warm amber accretion disc fill the cabin viewport, casting sunset-like amber light across the worn mechanical switches. Make one patient 45 mm push forward one metre from the orbit tableau into the exact cold-grey cabin, using the craft hull and viewport rim as continuous natural occlusion. Preserve exactly five departing beams before occlusion, one craft, one faceless pilot from behind, one dark mass, one thin ring, and scientific restraint."
  },
  {
    shot: 27,
    title: "The Ring → The Slip",
    core: "The same craft performs one steady pass across the warm amber rim; physically lensed starlight wraps around the rigid matte hull and reflections draw into long restrained ribbons while the cabin light bends like the workshop window. Keep one locked hull-mounted 45 mm camera moving forward about three hundred metres at constant speed, with the viewport rim naturally leaving frame. Preserve the one thin accretion disc, exact craft, rigid hull edge, pin stars, and scientific lensing; no tunnel, portal, horror, colorful glow, or free camera."
  },
  {
    shot: 28,
    title: "The Slip → The Lattice",
    core: "The wrapped starlight performs one controlled release into perfect stillness; its orthogonal ribbons resolve physically into an infinite grid of open lamplit archive cells, each containing the exact same workshop workbench at a different calm moment. Make one slow weightless 35 mm drift forward ten metres along a single honest corridor, preserving continuous perspective as the hull edge passes behind a dark lattice beam for natural occlusion. Preserve warm amber lamps, vacuum black, sparse dust motes, repeated exact bench geometry, and a welcoming library mood; no prison, crypt, hospital, or horror."
  },
  {
    shot: 29,
    title: "The Lattice → The Shelf Of Years",
    core: "The nearest archive cell performs one gentle approach until its open shelves of blank physical slates become legible in depth, with one identical plain slate repeated at near, middle, and far distances and one centered bare cell softly unlit. Make one patient 50 mm dolly forward eight metres that continuously slows but never reaches the repeated slate. Preserve the infinite orthogonal lattice, exact workshop benches in neighboring cells, honest perspective, warm lamps, blank surfaces, and humane library tone; no writing, bars, or sinister shadows."
  },
  {
    shot: 30,
    title: "The Shelf Of Years → The Touch-Back",
    core: "One bare lattice cell performs a single soft illumination reveal, exposing the exact workshop glass dust plate beneath the horn speaker as the same pilot's one anatomically correct gloved index finger reaches into center and touches the dust. Make one slow 85 mm push forward by 1.5 metres through the open cell toward the plate and glove, keeping the full hand and dust inside the phone-safe center. Preserve blank slates at near, middle, and far distance, exact bench geometry, warm humane light, and no text or face."
  },
  {
    shot: 31,
    title: "The Touch-Back → The Slate Set Forward",
    core: "The same pilot performs one causal handoff: after the index finger's single gentle nudge completes the clean standing waveform, both correct gloved hands lift one new blank physical slate and rack it into the adjacent bare cell facing outward, where its small abstract seal-shaped lamp wakes amber. Make one slow centered 55 mm lateral settle left by one metre from the dust plate to the slate rack. Preserve the waveform, exact workbench repeated behind, one new slate, blank surfaces, correct hand anatomy, and neighboring lamp direction; no symbols or face."
  },
  {
    shot: 32,
    title: "The Slate Set Forward → The Release",
    core: "The same two gloved hands perform one clean release of the newly racked slate; as the fingers open and withdraw, neighboring cell lamps lean their existing amber light toward it and the surrounding lattice begins a restrained backward slide while the new slate remains centered and sharp. Keep one locked 40 mm camera with no orbit, allowing the environment to accelerate gently away by about five metres. Preserve one blank slate, exact cell and workbench geometry, correct gloves, warm humane light, and no body, face, symbols, or new objects."
  },
  {
    shot: 33,
    title: "The Release → The Ejection",
    core: "The sliding lattice performs one continuous acceleration until its warm cell lamps stretch into restrained star streaks and then thin into open vacuum, ejecting the same small craft with the amber ring far behind and one small warm blink traveling ahead toward home. Keep one locked 35 mm stern camera aligned with the craft and move straight backward twenty metres as the lattice recedes. Preserve the central new slate only until natural occlusion, one craft, one thin ring, one blink, pin stars, and no beam, nebula, or extra craft."
  },
  {
    shot: 34,
    title: "The Ejection → The Many Lights",
    core: "The same craft performs one steady homeward approach following the single warm blink until the dust-marbled planet's night side fills the frame and many small warm beacons appear widely scattered, pulsing in one phase-shifted wave without forming text or a map. Make one slow center-safe 50 mm orbital drift right by twenty degrees while closing roughly one thousand kilometres. Preserve one craft, natural earth-tone sphere, many separate pinpricks, pin stars, and no labels, lines, lens flares, or nebulae."
  },
  {
    shot: 35,
    title: "The Many Lights → The Landing",
    core: "The same craft performs one controlled descent from the night side into the exact farm's grey-brown dust front, where the dust parts around the hull in the exact reverse geometry of launch and falls outward as the skids near the ground. Keep one rigid hull-mounted 50 mm camera pitching downward only ten degrees while the craft descends about one kilometre at decreasing speed. Preserve the natural planet, scattered beacons before cloud occlusion, exact barn, one warm window, centered hull edge, one craft, and no people."
  },
  {
    shot: 36,
    title: "The Landing → The Workshop Now",
    core: "The same craft completes one gentle touchdown beside the exact workshop and the settling dust flows through the open doorway, revealing clean benches, uncovered machines quietly running, the glass dust plate framed on the wall, and open slate racks by the door. Make one patient 45 mm dolly forward eight metres from the hull past the doorway into the room, using the door frame as natural occlusion without a cut. Preserve the exact barn, skids, warm window, workbench geometry, framed plate, blank racks, machine shadows in waveform rhythm, and no people or text."
  },
  {
    shot: 37,
    title: "The Workshop Now → The Five Suits",
    core: "The running machines perform one synchronized shadow cycle in the exact standing-wave rhythm and their moving shadows lead toward the door-side rail holding exactly five complete empty pressure suits, each visor dark and reflecting a different surveyed world. Make one slow symmetric 50 mm lateral truck right by four metres from the framed plate to the suit rail. Preserve exactly five suits and no sixth, all five complete bodies and helmets inside the center-safe band, visibly unoccupied visors, distinct utilitarian builds, clean benches, blank slate racks, and no person."
  },
  {
    shot: 38,
    title: "The Five Suits → The Two Masts",
    core: "A warm reflection performs one sequential travel across exactly five dark visors, ending on the fifth as the workshop door opens onto dusk and reveals the exact near radio mast plus one distant answering mast on the horizon. Make one slow 40 mm lateral track right by five metres along the suit rail and through the open doorway, using the fifth helmet edge as natural occlusion. Preserve exactly five empty suits until they leave frame, all five different world reflections, one workshop, exactly two masts, one warm window, earth-tone dusk, and no people."
  },
  {
    shot: 39,
    title: "The Two Masts → The Long Signal",
    core: "The two real masts perform one patient interleaved blink sequence until their rhythms lock into a single abstract waveform in the underlit grey clouds and the workshop window begins blinking in exact time with the near mast. Make one slow 40 mm crane upward four metres from the near mast to the horizon, then settle naturally into the held 35 mm farm framing without a cut. Preserve exactly two masts, the lone workshop, one warm window, flat farmland, rolling grey dust front, abstract non-text waveform, and restrained dusk."
  },
  {
    shot: 40,
    title: "The Long Signal → Loop",
    core: "The workshop window and near mast perform one final synchronized blink cycle while the rolling grey dust front advances only a few metres, returning the landscape to the exact opening KF01 composition and horizon so the loop closes cleanly. Keep one held 35 mm camera with zero translation, zero orbit, and only a slow one-percent physical focus settle toward the warm window. Preserve the lone workshop, one mast, one window, flat farmland, dust-front shape, earth-tone dusk, and exact opening geometry; add no people, craft, second mast, text, or new light."
  }
];

export function buildJobs(keyframes) {
  const byId = new Map(keyframes.map((frame) => [frame.id, frame]));
  const hardAnchors = new Set([1, 8, 16, 22, 26, 34, 40]);

  return descriptors.map((descriptor) => {
    const firstId = `KF${String(descriptor.shot).padStart(2, "0")}`;
    const lastId = descriptor.shot === 40
      ? "KF01"
      : `KF${String(descriptor.shot + 1).padStart(2, "0")}`;
    const firstFrame = byId.get(firstId);
    const lastFrame = byId.get(lastId);
    if (!firstFrame || !lastFrame) throw new Error(`missing endpoint ${firstId} -> ${lastId}`);
    const [act, actTitle, seedFamily] = actByShot(descriptor.shot);

    return {
      id: `SIG-${String(descriptor.shot).padStart(3, "0")}`,
      position: descriptor.shot,
      act,
      actTitle,
      title: descriptor.title,
      output: `SIG-${String(descriptor.shot).padStart(3, "0")}.mp4`,
      firstId,
      lastId,
      firstName: firstFrame.file,
      lastName: lastFrame.file,
      first: `../../../public/worlds/assets/signal/keyframes/${firstFrame.file}`,
      last: `../../../public/worlds/assets/signal/keyframes/${lastFrame.file}`,
      seedFamily,
      seed: seedByFamily[seedFamily],
      hardAnchor: hardAnchors.has(descriptor.shot),
      promptExtend: false,
      prompt: finishPrompt(firstId, lastId, descriptor.core),
      negative: SHARED_NEGATIVE
    };
  });
}

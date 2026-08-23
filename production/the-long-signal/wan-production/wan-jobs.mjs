export const STYLE_LOCK = "photoreal IMAX realism, practical-model materials, vacuum blacks, warm amber light, dust-earth naturals, restrained film grain";

export const SHARED_NEGATIVE = "low resolution, worst quality, blur, compression artifacts, watermark, captions, subtitles, readable text, letters, numbers, logos, duplicate objects, extra limbs, deformed hands, face distortion, morphing, warping, flicker, jitter, frame jump, temporal inconsistency, sudden exposure shift, sudden color shift, unintended cut, crossfade, dissolve, camera teleportation, subject swap, split screen, nebula candy, fantasy color, horror, generated letterbox bars";

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

const finishPrompt = (motion, camera) =>
  `Generate single shot. Begin on Image 1. ${motion} ${camera} End on Image 2 by 4.5 seconds and hold. ${STYLE_LOCK}. No dialogue. No background music.`;

const descriptors = [
  {
    shot: 1,
    title: "The Dust Front → The Bench",
    motion: "The advancing dust front drives one dense dust curtain across the lens, then that same dust clears inside the workshop and settles into the standing waveform on the glass plate.",
    camera: "Camera pushes forward eight metres slowly on one straight axis toward the warm window.",
    bridge: "dust curtain"
  },
  {
    shot: 2,
    title: "The Bench → The Relic Shelf",
    motion: "The standing waveform gives one patient pulse whose moving shadow travels across the continuous workbench and brightens the matching relic projection.",
    camera: "Camera trucks right 1.5 metres slowly from the glass plate to the relic shelf."
  },
  {
    shot: 3,
    title: "The Relic Shelf → The Decode",
    motion: "The bright relic shadow triggers the pen plotter, which draws one smooth course curve in sync with the patient mast blink through the workshop window.",
    camera: "Camera tracks left 1.2 metres slowly along the workbench to the plotter."
  },
  {
    shot: 4,
    title: "The Decode → The Tarp",
    motion: "One pair of gloved hands lifts the grey tarp from the compact craft as a single sheet of dust falls in the completed course curve.",
    camera: "Camera cranes backward and upward two metres slowly from the plotter to the full craft."
  },
  {
    shot: 5,
    title: "The Tarp → The Suit",
    motion: "The rising tarp crosses the lens as one tarp wipe, then clears behind the seated pilot as one gloved hand completes a preparation sweep across the cuff and amber switch bank.",
    camera: "Camera pushes forward 2.5 metres slowly through the open cockpit rim.",
    bridge: "tarp wipe"
  },
  {
    shot: 6,
    title: "The Suit → The Launch",
    motion: "The pilot's visor reflection expands to fill the frame, then the visor reflection clears as the same craft accelerates upward through brown dust, a thin blue atmosphere, and black space.",
    camera: "Camera pushes forward forty centimetres slowly into the dark visor on one axis.",
    bridge: "visor reflection"
  },
  {
    shot: 7,
    title: "The Launch → The Marble",
    motion: "The same craft continues its ascent while dust and blue atmosphere recede until the home world becomes a restrained sphere and the distant relay ring aligns ahead.",
    camera: "Camera remains fixed to the hull as the planet shrinks fifteen percent slowly."
  },
  {
    shot: 8,
    title: "The Marble → The Relay Ring",
    motion: "The craft approaches the relay ring and rolls clockwise thirty degrees until its orientation matches the station rotation and both appear momentarily steady.",
    camera: "Camera tracks forward thirty metres slowly along the craft flank toward the ring."
  },
  {
    shot: 9,
    title: "The Relay Ring → The Capture",
    motion: "The aligned craft drifts into the relay port until the latch petals close once around the collar and release one compact frost ring.",
    camera: "Camera pushes forward twenty metres slowly along the craft flank toward the latch."
  },
  {
    shot: 10,
    title: "The Capture → The Message Corridor",
    motion: "The closed docking petals rotate across the lens as one iris wipe, then reopen from the inner side onto the continuous archive corridor and its distant wire globe.",
    camera: "Camera pushes forward eight metres slowly through the circular relay port.",
    bridge: "iris wipe"
  },
  {
    shot: 11,
    title: "The Message Corridor → The Thread Globe",
    motion: "Amber light travels along the blank slates as their physical threads tighten into one tactile braid aimed through the distant wire globe.",
    camera: "Camera dollies forward twelve metres slowly down the center of the archive corridor."
  },
  {
    shot: 12,
    title: "The Thread Globe → The Departure Burn",
    motion: "The tightened braid pulls toward the viewport while its solid rim crosses the lens as one viewport-rim wipe, clearing onto the same craft beginning its departure burn.",
    camera: "Camera orbits clockwise thirty degrees slowly around the wire globe.",
    bridge: "viewport-rim wipe"
  },
  {
    shot: 13,
    title: "The Departure Burn → The Sphere",
    motion: "The craft continues one straight departure burn as the distant glint grows into a transparent sphere of lensed starlight and the relay ring recedes on axis.",
    camera: "Camera tracks forward fifty metres steadily behind the centered craft."
  },
  {
    shot: 14,
    title: "The Sphere → The Crossing",
    motion: "The craft enters the transparent sphere once as continuous starlight wraps around its rim and rigid hull reflections stretch along the direction of travel.",
    camera: "Camera pushes forward two hundred metres steadily on the craft axis."
  },
  {
    shot: 15,
    title: "The Crossing → The New Sky",
    motion: "The craft completes the crossing as stretched reflections release into a clear sky containing five distinct worlds along one bright natural arc.",
    camera: "Camera pushes forward three hundred metres steadily on the craft axis."
  },
  {
    shot: 16,
    title: "The New Sky → The Floating Sea",
    motion: "The first world expands ahead and its bright cloud deck fills the frame as one cloud-deck wipe, clearing above the steel-blue ocean and one floating stone island.",
    camera: "Camera pitches downward fifteen degrees slowly as the craft descends toward the island.",
    bridge: "cloud-deck wipe"
  },
  {
    shot: 17,
    title: "The Floating Sea → The Arena Bones",
    motion: "The craft completes its approach as the landing hatch passes across the lens in one hatch wipe, clearing behind the pilot during one pylon planting beside the arena.",
    camera: "Camera tracks forward six metres slowly at the pilot's walking speed.",
    bridge: "hatch wipe"
  },
  {
    shot: 18,
    title: "The Arena Bones → The Green Lagoons",
    motion: "The craft follows the planted pylon's single survey pulse while its hatch crosses the lens as one hatch wipe and clears above the chain of green lagoons.",
    camera: "Camera pushes forward three hundred metres steadily along the pulse direction.",
    bridge: "hatch wipe"
  },
  {
    shot: 19,
    title: "The Green Lagoons → The Mask Survey",
    motion: "The craft approaches the nearest king mask as one broad leaf crosses the lens in a foliage wipe, clearing on the pilot's gloved hand wiping one strip of moss.",
    camera: "Camera pushes forward three metres slowly on one axis toward the mask.",
    bridge: "foliage wipe"
  },
  {
    shot: 20,
    title: "The Mask Survey → The Glass Arcs",
    motion: "Sunlight travels once along the exposed mineral inlay and continues across the ridge, waking a restrained warm line inside the fossil-glass arcs above the walking pilot.",
    camera: "Camera trucks right ten metres slowly behind the stone mask and dark ridge."
  },
  {
    shot: 21,
    title: "The Glass Arcs → The Re-Ignition",
    motion: "The planted pylon triggers one ordered ignition that travels end to end through the existing fossil-glass arcs and holds as a vast sky diagram.",
    camera: "Camera cranes upward six metres slowly from the pilot's boots to the full sky."
  },
  {
    shot: 22,
    title: "The Re-Ignition → The Ice Gallery",
    motion: "The final arc light drives a dense pale cloud across the lens as one cloud wipe, clearing onto the blue-ice gallery with three preserved clothed figures.",
    camera: "Camera trucks right eight metres slowly along the shared horizon.",
    bridge: "cloud wipe"
  },
  {
    shot: 23,
    title: "The Ice Gallery → The Thaw",
    motion: "One preserved clothed shell takes a single measured step from the blue ice while a fine frost curtain rises behind it and the other two remain still.",
    camera: "Camera holds the 55 mm framing with a slow five-centimetre focus settle."
  },
  {
    shot: 24,
    title: "The Thaw → The Greenhouse Moon",
    motion: "The lifted frost curtain becomes one opaque vapor wipe, then clears inside the greenhouse dome as one blank edible sheet settles onto the nearest confection.",
    camera: "Camera tracks right six metres slowly along the carousel.",
    bridge: "vapor wipe"
  },
  {
    shot: 25,
    title: "The Greenhouse Moon → The Five Beams",
    motion: "The settled sheet and greenhouse dome remain centered as the dome glass fills the lens in one dome-glass wipe, clearing when the moon joins four other worlds and five beams converge.",
    camera: "Camera pulls straight backward rapidly until all five worlds fit the frame.",
    bridge: "dome-glass wipe"
  },
  {
    shot: 26,
    title: "The Five Beams → The Ring",
    motion: "The craft turns toward the blinking convergence point and its matte flank crosses the lens as one hull wipe, clearing inside the cockpit with the amber ring ahead through glass.",
    camera: "Camera pushes forward one metre slowly toward the centered craft.",
    bridge: "hull wipe"
  },
  {
    shot: 27,
    title: "The Ring → The Slip",
    motion: "The amber ring bends across the cockpit glass while the solid viewport rim crosses the lens as one viewport-rim wipe, clearing onto the same rigid hull beside the ring.",
    camera: "Camera tracks right one metre slowly along the cockpit axis.",
    bridge: "viewport-rim wipe"
  },
  {
    shot: 28,
    title: "The Slip → The Lattice",
    motion: "Lensed starlight releases around the craft as its dark hull edge crosses the lens in one hull wipe, clearing onto the first open corridor of the amber lattice.",
    camera: "Camera pushes forward ten metres slowly on one straight axis.",
    bridge: "hull wipe"
  },
  {
    shot: 29,
    title: "The Lattice → The Shelf Of Years",
    motion: "The nearest lattice cell approaches until its open shelves reveal one blank slate repeated at near, middle, and far depth around a centered bare cell.",
    camera: "Camera dollies forward eight metres slowly along the honest corridor."
  },
  {
    shot: 30,
    title: "The Shelf Of Years → The Touch-Back",
    motion: "The bare cell illuminates once, revealing the familiar dust plate as one gloved index finger reaches center and touches the standing waveform.",
    camera: "Camera pushes forward 1.5 metres slowly through the open cell toward the plate."
  },
  {
    shot: 31,
    title: "The Touch-Back → The Slate Set Forward",
    motion: "The same two gloved hands lift one blank slate after the waveform settles and rack it into the adjacent bare cell facing outward.",
    camera: "Camera trucks left one metre slowly from the dust plate to the slate rack."
  },
  {
    shot: 32,
    title: "The Slate Set Forward → The Release",
    motion: "The same hands release the newly racked slate once as neighboring amber lamps lean their light toward it and the surrounding lattice slides backward.",
    camera: "Camera holds the 40 mm framing with a steady centered view."
  },
  {
    shot: 33,
    title: "The Release → The Ejection",
    motion: "The released slate advances until its blank surface fills the frame as one slate wipe, then withdraws into vacuum as the same craft travels homeward with the amber ring behind.",
    camera: "Camera pulls backward twenty metres steadily on the craft axis.",
    bridge: "slate wipe"
  },
  {
    shot: 34,
    title: "The Ejection → The Many Lights",
    motion: "The craft follows the warm blink toward home until the dust-marbled planet fills the frame and many small beacons pulse across its night side in one traveling wave.",
    camera: "Camera orbits right twenty degrees slowly while closing the distance."
  },
  {
    shot: 35,
    title: "The Many Lights → The Landing",
    motion: "The craft descends through the cloud deck toward the farm as brown dust parts around the hull and settles outward while the landing skids approach the ground.",
    camera: "Camera pitches downward ten degrees slowly along the hull axis."
  },
  {
    shot: 36,
    title: "The Landing → The Workshop Now",
    motion: "The craft touches down beside the workshop and drives one dense dust curtain across the lens, clearing through the open doorway onto the clean workbench and framed plate.",
    camera: "Camera pushes forward eight metres slowly along the doorway axis.",
    bridge: "dust curtain"
  },
  {
    shot: 37,
    title: "The Workshop Now → The Five Suits",
    motion: "The workshop machines complete one synchronized shadow cycle whose moving waveform leads across the room to the rail of five empty pressure suits.",
    camera: "Camera trucks right four metres slowly from the framed plate to the suit rail."
  },
  {
    shot: 38,
    title: "The Five Suits → The Two Masts",
    motion: "A warm reflection travels once across the five dark visors and reaches the fifth as the open doorway frames the near mast and its distant answering mast.",
    camera: "Camera tracks right five metres slowly along the suit rail through the doorway."
  },
  {
    shot: 39,
    title: "The Two Masts → The Long Signal",
    motion: "The two masts blink in one interleaved sequence until their rhythms align and the warm workshop window joins the same pulse beneath the rolling dust front.",
    camera: "Camera cranes upward four metres slowly and ends in the held farm framing."
  },
  {
    shot: 40,
    title: "The Long Signal → Loop",
    motion: "The workshop window and near mast complete one synchronized blink while the dust front advances a few metres and returns the landscape to the opening composition.",
    camera: "Camera holds the 35 mm framing with a slow one-percent focus settle."
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
      bridgeRequired: Boolean(descriptor.bridge),
      bridge: descriptor.bridge || null,
      motion: descriptor.motion,
      camera: descriptor.camera,
      promptExtend: false,
      prompt: finishPrompt(descriptor.motion, descriptor.camera),
      negative: SHARED_NEGATIVE
    };
  });
}

/* =====================================================================
   The one channel between the scroll pins and the story flight.

   storyscroll.ts writes the Build and Proof scrub progress here on every
   ScrollTrigger update; story.ts reads it every frame to fly the camera
   gate to gate and to sweep the proof array. No DOM round-trip, no events.
   ===================================================================== */
export const flightState = {
  /** Build pin progress 0 → 1 (gate to gate). */
  build: 0,
  /** Proof pin progress 0 → 1 (the array charges up). */
  proof: 0,
  buildActive: false,
  proofActive: false,
  /** Bumps whenever ScrollTrigger (re)creates the pins: layouts moved. */
  layoutVersion: 0,
};

// Frozen Grok Imagine single-image contract for The Academy of Proven Spells.
// The destination still is a human reference only and must not be attached.
window.ACADEMY_GROK_JOBS = [
  {
    id: "ACA-GROK-001", position: 1, act: "I", actTitle: "The Invitation", title: "The Owl Descends",
    output: "ACA-GROK-001-R2.mp4", regenerate: true,
    firstName: "ACA-KF01-owl-letter.png", lastName: "ACA-KF02-gates-admit.png",
    first: "../keyframes/ACA-KF01-owl-letter.png", last: "../keyframes/ACA-KF02-gates-admit.png",
    shotClass: "subject shot", facing: "frontal toward camera", orientation: "needs-recompose",
    recompose: "ACA-KF01-R2: show the same barn owl from rear or three-quarter-rear, already aimed at the gate, with the sealed letter fixed in its beak. Keep the owl and gate on one clear travel axis.",
    prompt: "Flies straight away toward the open iron gate, the same barn owl seen from a rear three-quarter view, sealed letter fixed in its beak. Camera slowly follows directly behind. Moonlit academy, warm candle-gold gate, deep slate shadow, soft film grain. Ends inside the open gate, stair-hall glowing ahead."
  },
  {
    id: "ACA-GROK-002", position: 2, act: "I", actTitle: "The Invitation", title: "The Gates Admit",
    output: "ACA-GROK-002-R2.mp4", regenerate: true,
    firstName: "ACA-KF02-gates-admit.png", lastName: "ACA-KF03-moving-staircases.png",
    first: "../keyframes/ACA-KF02-gates-admit.png", last: "../keyframes/ACA-KF03-moving-staircases.png",
    shotClass: "camera-only", facing: "foreground owl dominates the gate motion", orientation: "needs-recompose",
    recompose: "ACA-KF02-R2: remove the foreground owl or reduce it to a tiny rear-facing silhouette beyond the partly open gate. Keep both iron leaves dominant and fully visible.",
    prompt: "Swings outward, both wrought-iron gate leaves opening wider while the owl stays small and motionless beyond them. Camera slowly cranes upward through the gateway. Candlelit stair-hall, warm candle-gold, deep slate shadow, soft film grain. Ends framed on the aligned upper staircase and closed library doors."
  },
  {
    id: "ACA-GROK-003", position: 3, act: "I", actTitle: "The Invitation", title: "The Highest Landing",
    output: "ACA-GROK-003.mp4",
    firstName: "ACA-KF03-moving-staircases.png", lastName: "ACA-KF04-library-grimoires.png",
    first: "../keyframes/ACA-KF03-moving-staircases.png", last: "../keyframes/ACA-KF04-library-grimoires.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Pivots upward, the highest stone staircase aligning with the upper library landing. Camera slowly cranes toward the doors. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on a library aisle with ten glowing spines in two rows."
  },
  {
    id: "ACA-GROK-004", position: 4, act: "I", actTitle: "The Invitation", title: "The Reflectionless Grimoire",
    output: "ACA-GROK-004.mp4",
    firstName: "ACA-KF04-library-grimoires.png", lastName: "ACA-KF05-self-writing-quill.png",
    first: "../keyframes/ACA-KF04-library-grimoires.png", last: "../keyframes/ACA-KF05-self-writing-quill.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Slides rightward from the shelf, the reflectionless chained grimoire moving alone toward its brass stand. Camera slowly tracks right. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on a blank grimoire page beneath one hovering quill."
  },
  {
    id: "ACA-GROK-005", position: 5, act: "II", actTitle: "Six Disciplines", title: "Ink Finds the Mirror",
    output: "ACA-GROK-005.mp4",
    firstName: "ACA-KF05-self-writing-quill.png", lastName: "ACA-KF06-sorting-mirror.png",
    first: "../keyframes/ACA-KF05-self-writing-quill.png", last: "../keyframes/ACA-KF06-sorting-mirror.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Rises from the page, the fresh ink curling upward as gold motes toward the mirror. Camera slowly pushes in. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the arched sorting mirror with six separated light threads."
  },
  {
    id: "ACA-GROK-006", position: 6, act: "II", actTitle: "Six Disciplines", title: "The Six Threads",
    output: "ACA-GROK-006.mp4",
    firstName: "ACA-KF06-sorting-mirror.png", lastName: "ACA-KF07-six-portraits.png",
    first: "../keyframes/ACA-KF06-sorting-mirror.png", last: "../keyframes/ACA-KF07-six-portraits.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Streams outward from the mirror, six colored light threads traveling toward the corridor. Camera slowly pushes in behind them. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on six brass portraits, three on each side."
  },
  {
    id: "ACA-GROK-007", position: 7, act: "II", actTitle: "Six Disciplines", title: "The Portrait Masters",
    output: "ACA-GROK-007.mp4",
    firstName: "ACA-KF07-six-portraits.png", lastName: "ACA-KF08-potion-lab.png",
    first: "../keyframes/ACA-KF07-six-portraits.png", last: "../keyframes/ACA-KF08-potion-lab.png",
    shotClass: "camera-only", facing: "n/a — painted figures remain static", orientation: "ok",
    prompt: "Travels rightward across the six portraits, one candle-gold thread moving toward the central door. Camera slowly tracks right past the frames. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the copper potion lab and central cauldron."
  },
  {
    id: "ACA-GROK-008", position: 8, act: "II", actTitle: "Six Disciplines", title: "The First Cast Fails",
    output: "ACA-GROK-008.mp4",
    firstName: "ACA-KF08-potion-lab.png", lastName: "ACA-KF09-failed-cast.png",
    first: "../keyframes/ACA-KF08-potion-lab.png", last: "../keyframes/ACA-KF09-failed-cast.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Drops downward into the miniature tower, one proof-crimson wand pulse cracking it apart above the cauldron. Camera not moving. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the broken miniature beneath one incomplete crimson ring."
  },
  {
    id: "ACA-GROK-009", position: 9, act: "III", actTitle: "Proof Before Prestige", title: "The Proven Cast",
    output: "ACA-GROK-009.mp4",
    firstName: "ACA-KF09-failed-cast.png", lastName: "ACA-KF10-proven-cast.png",
    first: "../keyframes/ACA-KF09-failed-cast.png", last: "../keyframes/ACA-KF10-proven-cast.png",
    shotClass: "camera-only", facing: "n/a — hand remains static", orientation: "ok",
    prompt: "Reassembles upward, the cracked miniature drawing its pieces together inside the green-gold proof ring. Camera not moving. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the repaired tower floating above the illuminated brass inlay."
  },
  {
    id: "ACA-GROK-010", position: 10, act: "III", actTitle: "Proof Before Prestige", title: "Current to the Great Hall",
    output: "ACA-GROK-010.mp4",
    firstName: "ACA-KF10-proven-cast.png", lastName: "ACA-KF11-standing-lights.png",
    first: "../keyframes/ACA-KF10-proven-cast.png", last: "../keyframes/ACA-KF11-standing-lights.png",
    shotClass: "camera-only", facing: "n/a — hand remains static", orientation: "ok",
    prompt: "Runs forward along the illuminated brass inlay, one green-gold current leading toward the great-hall doors. Camera slowly follows the light. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on ten floating candle clusters in two rows of five."
  },
  {
    id: "ACA-GROK-011", position: 11, act: "III", actTitle: "Proof Before Prestige", title: "The Standing Lights",
    output: "ACA-GROK-011.mp4",
    firstName: "ACA-KF11-standing-lights.png", lastName: "ACA-KF12-owl-post.png",
    first: "../keyframes/ACA-KF11-standing-lights.png", last: "../keyframes/ACA-KF12-owl-post.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Leans forward in one shared current, ten floating candle clusters bending toward the open arch. Camera slowly pushes through the hall. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the pre-dawn owl-post window above the courtyard."
  },
  {
    id: "ACA-GROK-012", position: 12, act: "III", actTitle: "Proof Before Prestige", title: "The Barred Window",
    output: "ACA-GROK-012.mp4",
    firstName: "ACA-KF12-owl-post.png", lastName: "ACA-KF13-restricted-section.png",
    first: "../keyframes/ACA-KF12-owl-post.png", last: "../keyframes/ACA-KF13-restricted-section.png",
    shotClass: "subject shot", facing: "three-quarter-right, traveling outward", orientation: "needs-recompose",
    recompose: "ACA-KF12: owl faces outward/right but motion travels inward/left; recompose facing into the barred window, rear or three-quarter-rear, with the sealed scroll in its beak.",
    prompt: "Banks left through the barred window into the restricted alcove, the same barn owl carrying the sealed scroll in its beak. Camera slowly follows behind. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on chained books, an outside lantern, and pinned shelf shadows."
  },
  {
    id: "ACA-GROK-013", position: 13, act: "IV", actTitle: "The Permanent Record", title: "The Hidden Ledger",
    output: "ACA-GROK-013.mp4",
    firstName: "ACA-KF13-restricted-section.png", lastName: "ACA-KF14-ledger-casts.png",
    first: "../keyframes/ACA-KF13-restricted-section.png", last: "../keyframes/ACA-KF14-ledger-casts.png",
    shotClass: "camera-only", facing: "n/a — hand remains static", orientation: "ok",
    prompt: "Slides rightward from beneath the chained books, the hidden ledger moving into lantern light. Camera slowly tracks right. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on a blank ruled ledger page beneath one quill and one plain seal."
  },
  {
    id: "ACA-GROK-014", position: 14, act: "IV", actTitle: "The Permanent Record", title: "Ink Becomes Brass",
    output: "ACA-GROK-014.mp4",
    firstName: "ACA-KF14-ledger-casts.png", lastName: "ACA-KF15-astronomy-tower.png",
    first: "../keyframes/ACA-KF14-ledger-casts.png", last: "../keyframes/ACA-KF15-astronomy-tower.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Hardens rightward across the blank ledger page, one wet ink line turning to brass beneath the quill. Camera slowly cranes upward. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the astronomy platform, star field, and centered brass telescope."
  },
  {
    id: "ACA-GROK-015", position: 15, act: "IV", actTitle: "The Permanent Record", title: "The Telescope Turns",
    output: "ACA-GROK-015.mp4",
    firstName: "ACA-KF15-astronomy-tower.png", lastName: "ACA-KF16-through-lens.png",
    first: "../keyframes/ACA-KF15-astronomy-tower.png", last: "../keyframes/ACA-KF16-through-lens.png",
    shotClass: "camera-only", facing: "n/a — no traveling subject", orientation: "ok",
    prompt: "Rotates clockwise on its brass mount, the telescope keeping its circular lens centered. Camera slowly pushes into the lens. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the moonlit academy through the telescope lens, with the approaching owl centered."
  },
  {
    id: "ACA-GROK-016", position: 16, act: "IV", actTitle: "The Permanent Record", title: "The Proven Loop",
    output: "ACA-GROK-016.mp4",
    firstName: "ACA-KF16-through-lens.png", lastName: "ACA-KF01-owl-letter.png",
    first: "../keyframes/ACA-KF16-through-lens.png", last: "../keyframes/ACA-KF01-owl-letter.png",
    shotClass: "subject shot", facing: "frontal toward camera", orientation: "ok",
    prompt: "Approaches through the circular telescope view, the same barn owl carrying the sealed letter in its beak. Camera slowly pulls backward beyond the brass lens. Candlelit wizarding academy storybook, parchment and brass, warm candle-gold against deep slate shadow, soft film grain. Ends framed on the moonlit academy with the owl centered beneath the moon."
  }
];

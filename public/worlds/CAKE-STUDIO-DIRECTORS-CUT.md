# CAKE STUDIO — director's cut

Status: **v1.1 direction locked / implementation source of truth**.

This is not a shot list. It records the argument of the film, the role of the visitor's hand,
why the rhythm changes, and how the generated motion and live browser scenes serve Cake Studio's
actual use case.

## The product truth

The problem is not that bakeries cannot make cakes. The problem is that the design often lives in
one experienced person's head: a conversation becomes a sketch, revisions scatter through
messages, and the kitchen must interpret a picture that carries no measured production contract.

Cake Studio moves that expertise upstream into a reusable visual system. A shop operator can begin
with a ready cake form, adapt its surfaces and bilingual details, approve one exact revision, then
hand the kitchen a customer mockup, baker sheet and true-size plaque. It does not claim to bake the
cake or replace physical craft. It removes the need to reinvent the design from a pastry chef's
blank sketch every time.

## The film sentence

> **The cake is made twice: first as a decision in software, then as an object in the kitchen.**

That sentence decides the title, pacing, captions and ending. The edible sheet is the shared object
between both worlds. At the opening it is an empty brief. Through the middle it becomes a surface,
a colour target, a measured print and a revision proof. At the end it enters the physical room.
When it returns to the opening pose, it is no longer blank: it carries reusable production
knowledge into the next order.

## The visitor's role

The visitor is not watching a demo. The scroll hand is the operator.

- Forward scroll makes a decision travel from brief to kitchen.
- Reverse scroll proves every transformation can be reconsidered without losing the chain.
- No video autoplays. Nothing happens until the operator moves.
- The same directed map runs on desktop and phone; the phone is not given a lesser edit.

The page therefore does not allocate equal scroll distance to every clip. Equal pacing would imply
that browsing a form and approving a production revision cost the same attention. That is the
opposite of the product.

## The dramatic shape

```text
QUESTION     blank brief → edible sheet → impossible cake world
POSSIBILITY  ready forms move quickly; changing direction is cheap
DECISION     one form holds; the surface becomes controllable
CRAFT        image, type and decoration follow the real cake surface
PROTECTION   colour is corrected before edible ink is spent
PROOF        pixels become millimetres; one revision is sealed
GATE         expensive mistakes leave before the kitchen receives them
RELEASE      the approved design enters production and returns as reusable knowledge
```

The generated chain remains in its endpoint-locked order. Direction comes from interpretation and
duration, not from pretending the footage contains a different event.

## Eight chapters and their reason

| Chapter | Shots | What the picture does | What the product argument says | Rhythm |
|---|---:|---|---|---|
| The brief | 01–07 | A sheet stands, becomes a cake, and opens the patisserie. | A blank order becomes a visual specification before the kitchen touches it. | Patient; the audience learns the material. |
| Ready forms | 08–13 | One cake form changes rapidly into the next. | Starting from reusable forms makes early choices cheap and reversible. | Fastest run in the film. |
| Flexible design | 14–19 | Finished forms gather; one is chosen; its surface becomes a map. | Change the design without rebuilding the cake's geometry. | Fast, then a long hold on shots 16–17. |
| Place exactly | 20–25 | Decoration, wrap and type follow the mapped surface. | Flexibility means controlled placement, not improvisation. | Tactile, one action per gesture. |
| Protect colour | 26–31 | A twenty-patch field exposes and corrects a cast before the press. | Slow down before spending edible ink. | Deliberate; shot 27 holds on the visible error. |
| Make it measurable | 32–37 | The sheet exits, a rule becomes a bridge, and a proof is sealed. | A picture becomes a true-size, version-bound production handoff. | Slowest proof movement. |
| Catch mistakes | 38–43 | A stale layer leaves; inspection reveals and corrects nine forms. | Let the system catch the expensive mistake before the baker does. | Gate, reject, release. |
| Make it real | 44–50 | Approved material enters the print room and folds back into the sheet. | Software ends where physical craft begins, then saves the result for reuse. | Warm release followed by a held loop closure. |

## The weighted scroll score

Each shot still owns its full five seconds of media time, but it receives a different amount of
scroll. The browser normalizes the score so the scene height stays fixed.

- Shots 08–15 receive `0.55–0.60` weight: options should feel quick to explore.
- Shot 16 receives `1.65`: the whole ready-form library must register.
- Shot 17 receives `1.85`: choice is the first decisive act.
- Shot 27 receives `1.65`: the colour error must be seen before it is corrected.
- Shot 38 receives `1.65`: rejection is a feature, not a transitional frame.
- Shot 50 receives `1.65`: the loop closes slowly enough to become the thesis.

The page exposes the active chapter key, rhythm, weight and reason as DOM state. The pacing is
therefore testable rather than an undocumented easing curve.

## The live-browser coda

The film provides the feeling. Three browser-rendered scenes state the operating logic plainly:

1. **Ready form, not blank canvas** — nine abstract production forms become one selected starting
   point. Reusable pastry knowledge is visible as structure.
2. **Flexible change, controlled geometry** — surface, image, bilingual plaque and decoration move
   around one retained cake body. Flexibility changes the design without destroying the contract.
3. **One decision, three production documents** — one CakeDocument resolves into the customer
   mockup, baker sheet and true-size plaque. The kitchen receives decisions, not a screenshot.

These are diagrams of the product logic, not fabricated interface screenshots.

## Visual grammar

- Optical patisserie: black marble, deep-teal glass, ivory edible paper and rose-gold proof metal.
- Generated footage remains fully contained at 16:9. Live words never cover generated pixels.
- The frame is warm and fluid during possibility, cooler and more measured during proof, then warm
  again at release.
- Typography behaves like a luxury production dossier, not a dashboard.
- The recurring hands are the operator, never an anonymous decorative model.
- Arabic and English state the same argument; neither language is summary copy.

## Truth boundaries

- The nine forms, twenty-patch calibration, true-size print and revision/inspection concepts are
  grounded in the Cake Studio project records and generated production plan.
- Generated imagery illustrates the workflow; it is not evidence of the application interface.
- Cake Studio supports design and handoff. The baker, printer, edible ink, material and final
  physical approval remain real production responsibilities.
- The 50-shot chain, 250-second runtime and media specifications describe this world, not product
  performance.

## Two rules held throughout

**Ease is expressed as speed, not claimed as a metric.** The ready-form run moves quickly because
changing direction should feel inexpensive. No invented time-saving percentage appears.

**Proof earns the physical reveal.** The print room cannot arrive directly after the catalogue.
The film must pass through placement, colour, scale, revision and inspection first; otherwise the
ending is magic instead of a production system.

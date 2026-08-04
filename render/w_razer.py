"""RAZER — "System Ascension".
Hero shot: a matte-black keyboard in a lightless room. One key travels, the
contact closes, and green light spreads down the row. Every photon has a cause.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
GREEN = (0.09, 0.72, 0.06)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 128)),
       look='AgX - High Contrast', exposure=0.25)
H.world_sky(top=(0.004, 0.005, 0.006), bottom=(0.002, 0.002, 0.003), strength=1.0)
H.world_haze(density=0.006, color=(0.30, 0.85, 0.28), anisotropy=0.55)

deck = H.pbr('Deck', base=(0.014, 0.015, 0.016), rough=0.42)
H.rough_variation(deck, scale=90, low=0.30, high=0.58, bump=0.35)
cap = H.pbr('Keycap', base=(0.020, 0.021, 0.023), rough=0.52)
H.rough_variation(cap, scale=160, low=0.42, high=0.66, bump=0.6)
alu = H.pbr('Alu', base=(0.055, 0.057, 0.060), rough=0.30, metal=1.0)
H.brushed(alu, strength=0.30, scale=(300, 4, 300))

# ── the deck ──
body = H.cube(loc=(0, 0, -0.30), scale=(6.2, 2.35, 0.30), name='Body')
H.assign(body, alu)
H.bevel(body, width=0.035, segments=4)
floor = H.plane(loc=(0, 0, -0.62), size=60)
fm = H.pbr('Desk', base=(0.018, 0.018, 0.020), rough=0.28)
H.rough_variation(fm, scale=45, low=0.16, high=0.42, bump=0.25)
H.assign(floor, fm)

# ── key field: 13 x 4, one hero key that travels ──
HERO = (6, 1)
lit_mats = {}
for r in range(4):
    for c in range(13):
        x = (c - 6) * 0.92
        y = (1.5 - r) * 0.92
        k = H.cube(loc=(x, y, 0.0), scale=(0.40, 0.40, 0.11), name=f'K{r}_{c}')
        H.assign(k, cap)
        H.bevel(k, width=0.045, segments=4)
        # the wave: distance from the hero key decides when this key lights
        d = math.hypot(c - HERO[0], (r - HERO[1]) * 1.1)
        on_at = 0.30 + d * 0.052
        if d < 0.01:
            H.keyframe(k, 'location',
                       [(1, 0.0), (int(FRAMES * 0.22), -0.085),
                        (int(FRAMES * 0.34), -0.055), (FRAMES, -0.055)], index=2)
        # under-key emissive slab, brought up on schedule
        g = H.cube(loc=(x, y, -0.135), scale=(0.36, 0.36, 0.012), name=f'G{r}_{c}')
        gm = H.emissive(f'GK{r}_{c}', GREEN, 0.0)
        H.assign(g, gm)
        e = gm.node_tree.nodes['Emission']
        f_on = max(1, int(FRAMES * on_at))
        H.keyframe(e.inputs['Strength'], 'default_value',
                   [(1, 0.0), (f_on, 0.0), (min(FRAMES, f_on + 7), 26.0),
                    (FRAMES, 16.0)])

# the hero contact point: a hard green core under the pressed key
core = H.sphere(loc=((HERO[0] - 6) * 0.92, (1.5 - HERO[1]) * 0.92, -0.10), r=0.055,
                segs=16, rings=8, name='Contact')
cm = H.emissive('Core', (0.55, 1.0, 0.5), 0.0)
H.assign(core, cm)
H.keyframe(cm.node_tree.nodes['Emission'].inputs['Strength'],
           'default_value', [(1, 0.0), (int(FRAMES * 0.22), 0.0),
                             (int(FRAMES * 0.27), 260.0), (FRAMES, 60.0)])

# ── light: almost nothing until the key answers ──
# cold room ambience: enough to read the deck as a shape from the first frame,
# never enough to look "lit" — the green still has to earn every photon
H.area(loc=(-7, -6, 6), rot=(math.radians(52), 0, math.radians(-42)),
       size=6, energy=900, color=(0.55, 0.66, 0.85))
H.area(loc=(6.5, 3.0, 1.4), rot=(math.radians(80), 0, math.radians(128)),
       size=0.2, size_y=9.0, energy=220, color=(0.62, 0.72, 0.95), shape='RECTANGLE')
key_l = H.point(loc=((HERO[0] - 6) * 0.92, (1.5 - HERO[1]) * 0.92, 0.6),
                energy=0.0, color=GREEN, radius=0.4)
H.keyframe(key_l.data, 'energy',
           [(1, 0.0), (int(FRAMES * 0.22), 0.0), (int(FRAMES * 0.30), 220.0), (FRAMES, 130.0)])
row_l = H.area(loc=(0, 1.4, 0.5), rot=(0, 0, 0), size=10, size_y=1.2,
               energy=0.0, color=GREEN, shape='RECTANGLE')
H.keyframe(row_l.data, 'energy', [(1, 0.0), (int(FRAMES * 0.5), 0.0), (FRAMES, 60.0)])

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['razer'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.dressing('razer', [(6.4, (0.4, 2.6, -0.62), 0)])

H.grade(hi=(0.99, 1.05, 0.99), mid=(1.0, 1.0, 1.0), lo=(0.002, 0.006, 0.003),
        glare=0.14, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/razer'))

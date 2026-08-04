"""DISNEY — "The Kingdom of Running Things".
Hero shot: the candlelit workshop the 32 real WAN shots came from, rebuilt as
geometry — a gilded book, a quill, brass instruments, and paper fireflies
lifting off the page. Rendered, so the code-takeover thesis holds in 3D too.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
GOLD = (0.68, 0.47, 0.13)
PARCH = (0.74, 0.66, 0.47)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 140)),
       look='AgX - Medium High Contrast', exposure=0.75)
H.world_sky(top=(0.020, 0.017, 0.012), bottom=(0.008, 0.006, 0.004), strength=1.0)
H.world_haze(density=0.016, color=(0.95, 0.72, 0.42), anisotropy=0.60)

oak = H.pbr('Oak', base=(0.055, 0.032, 0.018), rough=0.62)
H.rough_variation(oak, scale=22, low=0.44, high=0.80, bump=1.0)
gold = H.pbr('Gilt', base=GOLD, rough=0.22, metal=1.0)
H.brushed(gold, strength=0.16, scale=(160, 8, 160))
leather = H.pbr('Leather', base=(0.055, 0.070, 0.140), rough=0.66)
H.rough_variation(leather, scale=120, low=0.50, high=0.82, bump=1.4)
paper = H.pbr('Parchment', base=PARCH, rough=0.82, sheen=0.5)
H.rough_variation(paper, scale=200, low=0.70, high=0.92, bump=0.5)

# ── the workbench ──
bench = H.cube(loc=(0, 0, -0.10), scale=(3.6, 2.2, 0.10), name='Bench')
H.assign(bench, oak)
H.bevel(bench, width=0.02, segments=3)
H.assign(H.plane(loc=(0, 3.2, 1.4), size=14, rot=(math.radians(90), 0, 0)),
         H.pbr('BackWall', base=(0.030, 0.022, 0.015), rough=0.95))

# ── the book: two covers, a gilt spine, a fanned page block ──
for sgn in (-1, 1):
    cov = H.cube(loc=(sgn * 0.86, 0, 0.045), scale=(0.84, 1.10, 0.035),
                 rot=(0, math.radians(sgn * 3.5), 0), name=f'Cover{sgn}')
    H.assign(cov, leather)
    H.bevel(cov, width=0.014, segments=3)
    trim = H.cube(loc=(sgn * 0.86, 0, 0.082), scale=(0.79, 1.05, 0.004), name=f'Trim{sgn}')
    H.assign(trim, gold)

spine = H.cyl(loc=(0, 0, 0.055), r=0.075, depth=2.2, rot=(math.radians(90), 0, 0),
              verts=32, name='Spine')
H.assign(spine, leather)

for i in range(16):                       # the page block, fanned
    t = i / 15
    pg = H.cube(loc=(0, 0, 0.075 + i * 0.0016), scale=(0.80, 1.04, 0.0008),
                rot=(0, math.radians((t - 0.5) * 2.4), 0), name=f'Page{i}')
    H.assign(pg, paper)

# ── the quill, drawing a cause ──
shaft = H.cyl(loc=(1.05, -0.55, 0.42), r=0.014, depth=1.15,
              rot=(math.radians(58), 0, math.radians(-24)), verts=12, name='Quill')
H.assign(shaft, H.pbr('Feather', base=(0.62, 0.58, 0.50), rough=0.72, sheen=0.9))
vane = H.cube(loc=(1.36, -0.13, 0.86), scale=(0.012, 0.10, 0.30),
              rot=(math.radians(58), 0, math.radians(-24)), name='Vane')
H.assign(vane, H.pbr('Vane', base=(0.70, 0.66, 0.58), rough=0.80, sheen=1.0))
H.keyframe(shaft, 'location', [(1, -0.72), (FRAMES, -0.34)], index=1)
H.keyframe(vane, 'location', [(1, -0.30), (FRAMES, 0.08)], index=1)

# ink pot + brass dividers: the maker's real tools
pot = H.cyl(loc=(-1.55, -0.62, 0.14), r=0.17, depth=0.28, verts=48, name='InkPot')
H.assign(pot, H.pbr('PotGlass', base=(0.10, 0.10, 0.13), rough=0.08,
                    transmission=0.85, ior=1.5))
H.bevel(pot, width=0.012, segments=3)
H.assign(H.cyl(loc=(-1.55, -0.62, 0.20), r=0.14, depth=0.14, verts=32, name='Ink'),
         H.pbr('Ink', base=(0.006, 0.005, 0.010), rough=0.08))
for sgn in (-1, 1):
    leg = H.cyl(loc=(-1.05 + sgn * 0.10, 0.72, 0.10), r=0.012, depth=0.62,
                rot=(math.radians(74), 0, math.radians(sgn * 9)), verts=10, name=f'Div{sgn}')
    H.assign(leg, gold)

# ── the fireflies: ink becoming light, lifting off the page ──
for i in range(22):
    a = (i * 2.399963)
    r = 0.25 + (i % 7) * 0.16
    x = math.cos(a) * r * 1.6
    y = math.sin(a) * r
    ff = H.sphere(loc=(x, y, 0.13), r=0.017 + (i % 3) * 0.004, segs=10, rings=6,
                  name=f'FF{i}')
    fm = H.emissive(f'FFm{i}', (1.0, 0.80, 0.38), 0.0)
    H.assign(ff, fm)
    lift_at = 0.22 + (i % 9) * 0.055
    H.keyframe(ff, 'location',
               [(1, 0.10), (max(2, int(FRAMES * lift_at)), 0.12),
                (FRAMES, 0.55 + (i % 5) * 0.22)], index=2)
    H.keyframe(ff, 'location',
               [(1, x), (FRAMES, x * 1.35 + math.sin(a * 3) * 0.25)], index=0)
    H.keyframe(fm.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
               [(1, 0.0), (max(2, int(FRAMES * lift_at)), 0.0),
                (min(FRAMES, int(FRAMES * lift_at) + 6), 55.0), (FRAMES, 26.0)])

# ── the candle: the only motivated source in the room ──
stick = H.cyl(loc=(-2.25, 0.42, 0.28), r=0.085, depth=0.56, verts=32, name='Candle')
H.assign(stick, H.pbr('Wax', base=(0.68, 0.62, 0.48), rough=0.45))
flame = H.sphere(loc=(-2.25, 0.42, 0.63), r=0.045, segs=14, rings=8, name='Flame')
flame.scale = (0.7, 0.7, 1.8)
fl_m = H.emissive('Flame', (1.0, 0.66, 0.26), 320.0)
H.assign(flame, fl_m)
H.keyframe(fl_m.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
           [(1, 280.0), (int(FRAMES * 0.35), 360.0), (int(FRAMES * 0.7), 250.0), (FRAMES, 340.0)])
cand = H.point(loc=(-2.25, 0.42, 0.66), energy=95, color=(1.0, 0.60, 0.24), radius=0.05)
H.keyframe(cand.data, 'energy',
           [(1, 82.0), (int(FRAMES * 0.35), 105.0), (int(FRAMES * 0.7), 74.0), (FRAMES, 100.0)])

# a cold window rake, so the warm has something to be warm against
H.area(loc=(4.2, -2.6, 3.4), rot=(math.radians(56), 0, math.radians(62)),
       size=3.0, energy=90, color=(0.42, 0.55, 0.95))
H.area(loc=(0, -1.0, 3.0), rot=(0, 0, 0), size=5, energy=30, color=(1.0, 0.80, 0.55))

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['disney'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.dressing('disney', [(0.62, (-2.05, -1.25, 0.0), 24), (0.42, (1.72, 0.55, 0.0), -14),
                      (1.05, (2.55, 1.45, 0.0), -62)])

H.grade(hi=(1.06, 1.0, 0.94), mid=(1.0, 1.0, 0.99), lo=(0.012, 0.007, 0.003),
        glare=0.24, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/disney'))

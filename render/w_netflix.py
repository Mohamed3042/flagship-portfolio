"""NETFLIX — "The Anthology".
Hero shot: a projection booth wakes. A red filament heats, the aperture opens,
and one dustless cone carves a screening hall out of the dark.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
RED = (0.72, 0.055, 0.075)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 128)),
       look='AgX - High Contrast', exposure=0.5)
H.world_sky(top=(0.004, 0.004, 0.005), bottom=(0.002, 0.002, 0.002), strength=1.0)
H.world_haze(density=0.022, color=(0.86, 0.84, 0.80), anisotropy=0.66)

wall = H.pbr('Wall', base=(0.030, 0.029, 0.028), rough=0.92)
H.rough_variation(wall, scale=14, low=0.80, high=0.99, bump=0.8)
metal = H.pbr('BoothMetal', base=(0.048, 0.047, 0.046), rough=0.34, metal=1.0)
H.brushed(metal, strength=0.28, scale=(260, 5, 260))

# ── the hall: floor, side walls, and the screen the beam lands on ──
H.assign(H.plane(loc=(0, 8, 0), size=70), wall)
for sx in (-1, 1):
    w = H.plane(loc=(sx * 7.5, 8, 5), size=40, rot=(math.radians(90), 0, math.radians(90)))
    H.assign(w, wall)
H.assign(H.plane(loc=(0, 8, 10.5), size=70), wall)

screen = H.plane(loc=(0, 22.0, 5.0), size=1, rot=(math.radians(90), 0, 0), name='Screen')
screen.scale = (13.0, 5.45, 1)
sm = H.pbr('ScreenFabric', base=(0.72, 0.71, 0.68), rough=0.86, sheen=0.4)
H.rough_variation(sm, scale=380, low=0.74, high=0.94, bump=0.5)
H.assign(screen, sm)
frame = H.cube(loc=(0, 22.15, 5.0), scale=(6.7, 0.06, 2.85), name='ScreenFrame')
H.assign(frame, H.pbr('Masking', base=(0.008, 0.008, 0.009), rough=1.0))

# seat backs in silhouette, the near parallax layer
for r in range(4):
    for c in range(9):
        s = H.cube(loc=((c - 4) * 1.35, -2.0 - r * 1.9, 0.55 - r * 0.06),
                   scale=(0.52, 0.30, 0.55), name=f'Seat{r}{c}')
        H.assign(s, H.pbr('Velvet', base=(0.020, 0.012, 0.013), rough=0.95, sheen=0.7))
        H.bevel(s, width=0.06, segments=3)

# ── the projector head ──
booth = H.cube(loc=(0, -9.0, 3.1), scale=(1.15, 1.6, 0.85), name='Booth')
H.assign(booth, metal)
H.bevel(booth, width=0.045, segments=4)
lens = H.cyl(loc=(0, -7.3, 3.1), r=0.38, depth=0.9, rot=(math.radians(90), 0, 0),
             verts=48, name='Lens')
H.assign(lens, metal)
H.bevel(lens, width=0.02, segments=3)
for i, r in enumerate((0.46, 0.42)):
    ring = H.torus(loc=(0, -7.72 + i * 0.34, 3.1), major=r, minor=0.035,
                   rot=(math.radians(90), 0, 0), name=f'LensRing{i}')
    H.assign(ring, metal)

# the filament — the thing that wakes
fil = H.cyl(loc=(0, -8.6, 3.1), r=0.018, depth=0.5, rot=(0, math.radians(90), 0),
            verts=12, name='Filament')
fm = H.emissive('Filament', (1.0, 0.30, 0.24), 0.0)
H.assign(fil, fm)
H.keyframe(fm.node_tree.nodes['Emission'].inputs['Strength'],
           'default_value', [(1, 2.0), (int(FRAMES * 0.45), 900.0), (FRAMES, 2600.0)])

# the aperture disc that opens in front of it
ap = H.cyl(loc=(0, -8.05, 3.1), r=0.40, depth=0.02, rot=(math.radians(90), 0, 0),
           verts=48, name='Aperture')
H.assign(ap, H.pbr('ApBlade', base=(0.02, 0.02, 0.02), rough=0.5, metal=1.0))
H.keyframe(ap, 'scale', [(1, 1.0), (int(FRAMES * 0.55), 1.0), (FRAMES, 0.06)], index=0)
H.keyframe(ap, 'scale', [(1, 1.0), (int(FRAMES * 0.55), 1.0), (FRAMES, 0.06)], index=1)

# ── light ──
beam, bt = H.spot(loc=(0, -8.4, 3.1), target=(0, 22.0, 5.0),
                  energy=0.0, color=(1.0, 0.985, 0.96),
                  spot_size=math.radians(30), blend=0.06, radius=0.06)
H.keyframe(beam.data, 'energy',
           [(1, 0.0), (int(FRAMES * 0.45), 120.0), (int(FRAMES * 0.62), 9000.0),
            (FRAMES, 26000.0)])
red = H.point(loc=(0, -8.6, 3.1), energy=0.0, color=RED, radius=0.12)
H.keyframe(red.data, 'energy', [(1, 24.0), (int(FRAMES * 0.45), 140.0), (FRAMES, 40.0)])
# house lights: a hall before the show still has aisle light in it
H.area(loc=(-5.5, -3.0, 8.0), rot=(math.radians(58), 0, math.radians(-40)),
       size=5, energy=420, color=(0.55, 0.62, 0.85))
for sx in (-1, 1):
    H.point(loc=(sx * 6.6, -1.0, 1.1), energy=90, color=(1.0, 0.62, 0.30), radius=0.25)
    H.point(loc=(sx * 6.6, -7.0, 1.1), energy=70, color=(1.0, 0.62, 0.30), radius=0.25)

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['netflix'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.dressing('netflix', [(0.95, (-1.35, -2.0, 0.0), 4)])

H.grade(hi=(1.05, 1.0, 0.99), mid=(1.0, 1.0, 1.0), lo=(0.010, 0.003, 0.004),
        glare=0.18, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/netflix'))

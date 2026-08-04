"""SAMSUNG — "The Fold in Space".
Hero shot: nested glass panes in the dark, folding on one violet crease
until distance becomes order. Refraction, edge light, nothing else.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
VIOLET = (0.36, 0.30, 0.90)
SKY = (0.42, 0.72, 1.0)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 140)),
       look='AgX - Medium High Contrast', exposure=0.5)
H.world_sky(top=(0.010, 0.011, 0.026), bottom=(0.003, 0.003, 0.008), strength=1.0)
H.world_stars(density=0.955, scale=1600, strength=18.0,
              sky_top=(0.010, 0.011, 0.026), sky_bottom=(0.003, 0.003, 0.008))
H.world_haze(density=0.011, color=(0.55, 0.52, 0.95), anisotropy=0.55)

glass = H.pbr('Pane', base=(0.72, 0.76, 0.92), rough=0.045, metal=0.0,
              transmission=0.96, ior=1.47, coat=0.3)
edge = H.pbr('Edge', base=(0.55, 0.62, 0.95), rough=0.18, metal=1.0)
darkmetal = H.pbr('Hinge', base=(0.035, 0.036, 0.044), rough=0.30, metal=1.0)
H.brushed(darkmetal, strength=0.28, scale=(280, 5, 280))

# ── three nested pane pairs, each hinged on the same violet crease ──
crease_x = 0.0
for i, (w, h, z, gap) in enumerate(((3.4, 1.9, 0.0, 0.0),
                                    (2.6, 1.45, 0.55, 0.05),
                                    (1.8, 1.0, 1.05, 0.10))):
    for sgn in (-1, 1):
        piv = bpy.data.objects.new(f'Piv{i}{sgn}', None)
        piv.location = (crease_x, 0, z)
        bpy.context.collection.objects.link(piv)
        # the fold: flat at the start, closed toward the crease at the end
        H.keyframe(piv, 'rotation_euler',
                   [(1, 0.0),
                    (int(FRAMES * 0.30), 0.0),
                    (FRAMES, math.radians(sgn * -34 + sgn * i * 4))], index=1)

        p = H.cube(loc=(sgn * (w / 2 + gap), 0, 0), scale=(w / 2, h / 2, 0.022),
                   name=f'Pane{i}{sgn}')
        p.parent = piv
        H.assign(p, glass)
        H.bevel(p, width=0.012, segments=3)

        rim = H.cube(loc=(sgn * (w / 2 + gap), 0, 0), scale=(w / 2 + 0.012, h / 2 + 0.012, 0.006),
                     name=f'Rim{i}{sgn}')
        rim.parent = piv
        H.assign(rim, edge)
        H.bevel(rim, width=0.004, segments=2)

    hinge = H.cyl(loc=(crease_x, 0, z), r=0.030, depth=h + 0.10,
                  rot=(math.radians(90), 0, 0), verts=24, name=f'Hinge{i}')
    H.assign(hinge, darkmetal)

# the crease itself — one violet line, the only saturated thing on set
crease = H.cyl(loc=(0, 0, 0.5), r=0.012, depth=3.4, rot=(math.radians(90), 0, 0),
               verts=16, name='Crease')
cm = H.emissive('Crease', VIOLET, 0.0)
H.assign(crease, cm)
H.keyframe(cm.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
           [(1, 3.0), (int(FRAMES * 0.30), 9.0), (FRAMES, 26.0)])

# the proof core the folds are protecting
core = H.sphere(loc=(0, 0, 0.55), r=0.09, segs=32, rings=16, name='Core')
km = H.emissive('Core', (0.92, 0.96, 1.0), 0.0)
H.assign(core, km)
H.keyframe(km.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
           [(1, 3.0), (FRAMES, 13.0)])

# far motes: depth cues drifting behind the assembly
for i in range(90):
    x = ((i * 37) % 100) / 100 * 22 - 11
    y = ((i * 61) % 100) / 100 * 16 + 4
    z = ((i * 83) % 100) / 100 * 9 - 3
    m = H.sphere(loc=(x, y, z), r=0.012 + (i % 4) * 0.004, segs=8, rings=4, name=f'Mote{i}')
    H.assign(m, H.emissive('Mote', SKY if i % 3 else VIOLET, 5.0))

# ── light: rim only. Glass is drawn by what is behind and beside it ──
H.area(loc=(-6.5, -3.0, 4.5), rot=(math.radians(50), 0, math.radians(-52)),
       size=5, energy=900, color=(0.55, 0.66, 1.0))
H.area(loc=(6.8, 2.5, 1.2), rot=(math.radians(84), 0, math.radians(112)),
       size=0.18, size_y=8.0, energy=700, color=SKY, shape='RECTANGLE')
H.area(loc=(0, 7.5, 2.0), rot=(math.radians(96), 0, 0),
       size=9, energy=260, color=VIOLET)
H.point(loc=(0, 0, 0.55), energy=45, color=(0.85, 0.9, 1.0), radius=0.12)

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['samsung'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.import_assets('samsung')

H.grade(hi=(1.0, 1.0, 1.06), mid=(1.0, 1.0, 1.0), lo=(0.004, 0.004, 0.014),
        glare=0.20, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/samsung'))

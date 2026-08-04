"""APPLE — "Crafted".
Hero shot: a titanium blank on a white cyclorama, milled down to a measured
profile under a single large softbox. Studio product cinema, nothing warm
except the machined chamfer catching the key.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 140)),
       look='AgX - Base Contrast', exposure=0.9)
H.world_sky(top=(0.30, 0.30, 0.32), bottom=(0.16, 0.16, 0.17), strength=0.55)

# ── infinity cyclorama: a floor that curves up into the back wall ──
cyc = H.plane(loc=(0, 3.0, 0), size=26)
H.assign(cyc, H.pbr('Cyc', base=(0.62, 0.62, 0.63), rough=0.62))
sub = cyc.modifiers.new('Sub', 'SUBSURF')
sub.levels = sub.render_levels = 4
bpy.ops.object.select_all(action='DESELECT')
cyc.select_set(True)
bpy.context.view_layer.objects.active = cyc
simple = cyc.modifiers.new('Bend', 'SIMPLE_DEFORM')
simple.deform_method = 'BEND'
simple.angle = math.radians(78)
simple.deform_axis = 'X'

ti = H.pbr('Titanium', base=(0.58, 0.585, 0.575), rough=0.24, metal=1.0)
H.brushed(ti, strength=0.26, scale=(340, 5, 340))
tool = H.pbr('ToolSteel', base=(0.045, 0.046, 0.050), rough=0.22, metal=1.0)

# ── the blank: a bar that thins as the head passes ──
blank = H.cube(loc=(0, 0, 0.22), scale=(3.1, 0.62, 0.22), name='Blank')
H.assign(blank, ti)
H.bevel(blank, width=0.028, segments=5)
H.keyframe(blank, 'scale', [(1, 0.22), (FRAMES, 0.125)], index=2)
H.keyframe(blank, 'location', [(1, 0.22), (FRAMES, 0.125)], index=2)

# the milled shoulder that survives the pass — the chamfer that catches light
shoulder = H.cube(loc=(0, 0, 0.30), scale=(3.1, 0.66, 0.035), name='Shoulder')
shoulder.rotation_euler = (math.radians(6), 0, 0)
H.assign(shoulder, ti)
H.bevel(shoulder, width=0.012, segments=4)
H.keyframe(shoulder, 'location', [(1, 0.46), (FRAMES, 0.265)], index=2)

# ── the tool head travelling the length of the bar ──
head = H.cube(loc=(-3.0, 0, 0.95), scale=(0.26, 0.30, 0.24), name='Head')
H.assign(head, tool)
H.bevel(head, width=0.02, segments=3)
H.keyframe(head, 'location', [(1, -3.1), (FRAMES, 3.1)], index=0)
bit = H.cyl(loc=(-3.0, 0, 0.60), r=0.10, depth=0.44, verts=32, name='Bit')
H.assign(bit, tool)
H.keyframe(bit, 'location', [(1, -3.1), (FRAMES, 3.1)], index=0)
H.keyframe(bit, 'rotation_euler', [(1, 0.0), (FRAMES, math.radians(2600))], index=2)

# a fine spray of chips thrown behind the cut
for i in range(26):
    a = (i / 26) * math.tau
    ch = H.cube(loc=(-3.0 - 0.05 * i, 0.16 * math.sin(a * 3), 0.42 + 0.02 * i),
                size=0.018, scale=(1.8, 0.5, 0.5), rot=(a, a * 0.7, 0), name=f'Chip{i}')
    H.assign(ch, ti)
    H.keyframe(ch, 'location',
               [(1, -3.1 + 0.02 * i), (FRAMES, 3.1 + 0.02 * i)], index=0)

# ── light: one big softbox, one strip for the chamfer, one negative fill ──
H.area(loc=(-1.6, -3.4, 6.2), rot=(math.radians(28), 0, math.radians(-12)),
       size=9, energy=2600, color=(1.0, 0.99, 0.98))
H.area(loc=(4.6, -1.6, 1.5), rot=(math.radians(84), 0, math.radians(74)),
       size=0.22, size_y=7.0, energy=340, color=(0.96, 0.98, 1.0), shape='RECTANGLE')
neg = H.plane(loc=(-7.6, 2.2, 2.2), size=6, rot=(math.radians(90), 0, math.radians(-16)))
H.assign(neg, H.pbr('Flag', base=(0.01, 0.01, 0.01), rough=1.0))

# ── camera: slow push down the bar, focus riding the tool ──
cam, tgt = H.camera(loc=(-3.9, -6.2, 1.9), target=(0, 0.1, 0.35), focal=58, fstop=2.2)
H.cam_move(cam, tgt,
           keys=[(1,           (-4.3, -6.6, 2.05), (-1.9, 0.1, 0.42)),
                 (FRAMES // 2, (-1.1, -5.4, 1.55), (0.20, 0.1, 0.34)),
                 (FRAMES,      (2.40, -4.9, 1.25), (2.10, 0.1, 0.28))],
           focal_keys=[(1, 52), (FRAMES, 76)],
           focus_keys=[(1, 7.2), (FRAMES, 5.2)])

H.grade(hi=(1.0, 1.0, 1.01), mid=(1.0, 1.0, 1.0), lo=(0.0, 0.0, 0.002),
        glare=0.10, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/apple'))

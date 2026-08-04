"""ASTRONOMY — "The Observatory".
Hero shot: a desert-ridge station under a real star field; the dome cracks
its slit, a shaft of starlight cuts the haze, the instrument answers cyan.
Moonlight is the key, the shaft is the story, brass is the only warmth.
"""
import bpy, bmesh, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 96))
CYAN = (0.10, 0.72, 0.68)
BRASS = (0.58, 0.42, 0.17)

H.setup_gpu()
sc = H.init(res=(1280, 640), frames=FRAMES,
            samples=int(os.environ.get('SAMPLES', 128)),
            look='AgX - Medium High Contrast', exposure=0.6)
H.world_stars(density=0.945, scale=1400, strength=26.0,
              sky_top=(0.016, 0.024, 0.055), sky_bottom=(0.003, 0.004, 0.011))
H.world_haze(density=0.0065, color=(0.62, 0.74, 0.98), anisotropy=0.60)


def dome(radius=3.0, gap_deg=17.0, thickness=0.07):
    """Swept profile arc, stopped short of 360° — the gap is the slit."""
    me = bpy.data.meshes.new('DomeProfile')
    ob = bpy.data.objects.new('Dome', me)
    bpy.context.collection.objects.link(ob)
    bm = bmesh.new()
    prev = None
    steps = 26
    for i in range(steps + 1):
        a = (math.pi / 2) * (i / steps)
        v = bm.verts.new((radius * math.cos(a), 0.0, radius * math.sin(a)))
        if prev:
            bm.edges.new((prev, v))
        prev = v
    bm.to_mesh(me)
    bm.free()
    scr = ob.modifiers.new('Screw', 'SCREW')
    scr.angle = math.radians(360 - gap_deg)
    scr.steps = scr.render_steps = 96
    scr.axis = 'Z'
    scr.use_smooth_shade = True
    sol = ob.modifiers.new('Solidify', 'SOLIDIFY')
    sol.thickness, sol.offset = thickness, -1
    return ob


# ── terrain ──
ground = H.plane(loc=(0, 6, 0), size=400)
gm = H.pbr('Basalt', base=(0.045, 0.046, 0.052), rough=0.9)
H.rough_variation(gm, scale=11, low=0.70, high=0.97, bump=1.2)
H.assign(ground, gm)
gs = ground.modifiers.new('Sub', 'SUBSURF')
gs.levels = gs.render_levels = 5
gt = bpy.data.textures.new('rock', 'CLOUDS')
gt.noise_scale, gt.noise_depth = 5.0, 6
gd = ground.modifiers.new('Disp', 'DISPLACE')
gd.texture, gd.strength, gd.mid_level = gt, 2.2, 0.52

# foreground boulders — the near parallax plane
for i, (x, y, s) in enumerate(((-6.4, -9.0, 1.5), (5.9, -10.6, 1.15), (-2.2, -12.4, 0.8))):
    b = H.sphere(loc=(x, y, s * 0.30), r=s, segs=24, rings=12, name=f'Rock{i}')
    b.scale = (1.0, 0.85, 0.55)
    bt = bpy.data.textures.new(f'bt{i}', 'CLOUDS')
    bt.noise_scale = 1.6
    bs = b.modifiers.new('Sub', 'SUBSURF')
    bs.levels = bs.render_levels = 3
    bd = b.modifiers.new('Disp', 'DISPLACE')
    bd.texture, bd.strength, bd.mid_level = bt, 0.55, 0.5
    H.assign(b, gm)

# far ridge — silhouette that separates ground from sky
ridge = H.plane(loc=(0, 62, 2.0), size=240, rot=(math.radians(90), 0, 0))
rm = H.pbr('Ridge', base=(0.020, 0.022, 0.028), rough=1.0)
H.assign(ridge, rm)
rs = ridge.modifiers.new('Sub', 'SUBSURF')
rs.levels = rs.render_levels = 4
rt = bpy.data.textures.new('ridgeN', 'CLOUDS')
rt.noise_scale = 16.0
rd = ridge.modifiers.new('Disp', 'DISPLACE')
rd.texture, rd.strength, rd.mid_level = rt, 11.0, 0.60

# ── the station ──
base = H.cyl(loc=(0, 0, 1.15), r=3.05, depth=2.3, verts=96, name='Base')
cm = H.pbr('Concrete', base=(0.115, 0.117, 0.125), rough=0.85)
H.rough_variation(cm, scale=24, low=0.62, high=0.94, bump=0.7)
H.assign(base, cm)
H.bevel(base, width=0.03, segments=3)

brass = H.pbr('Brass', base=BRASS, rough=0.28, metal=1.0)
H.brushed(brass, strength=0.22, scale=(220, 6, 220))
H.assign(H.torus(loc=(0, 0, 2.3), major=3.06, minor=0.075, name='Ring'), brass)

d_ob = dome(radius=3.0, gap_deg=18.0)
d_ob.location = (0, 0, 2.3)
dm = H.pbr('DomeShell', base=(0.085, 0.088, 0.096), rough=0.38, metal=0.9)
H.brushed(dm, strength=0.32, scale=(6, 260, 6))
H.assign(d_ob, dm)
# the slit rotates open across the shot — the whole reason for the scene
H.keyframe(d_ob, 'rotation_euler',
           [(1, math.radians(26)), (FRAMES, math.radians(-6))], index=2)

# telescope leaning into the opening
tube = H.cyl(loc=(0.10, -0.15, 3.05), r=0.46, depth=3.5,
             rot=(math.radians(64), 0, math.radians(6)), verts=64, name='Tube')
tm = H.pbr('TubeSteel', base=(0.16, 0.165, 0.178), rough=0.3, metal=1.0)
H.brushed(tm, strength=0.25, scale=(240, 5, 240))
H.assign(tube, tm)
H.bevel(tube, width=0.012, segments=2)
for z in (3.9, 2.5):
    c = H.cyl(loc=(0.10 + (z - 3.05) * 0.06, -0.15 - (z - 3.05) * 0.30, z),
              r=0.50, depth=0.13, rot=(math.radians(64), 0, math.radians(6)),
              verts=64, name='Collar')
    H.assign(c, brass)
    H.bevel(c, width=0.01, segments=2)
H.assign(H.cyl(loc=(0.28, -0.86, 4.35), r=0.42, depth=0.04,
               rot=(math.radians(64), 0, math.radians(6)), verts=48, name='Eye'),
         H.emissive('EyeGlow', CYAN, 42.0))
for sx in (-1, 1):
    y = H.cube(loc=(sx * 1.25, 0.35, 2.95), scale=(0.13, 0.42, 0.95), name='Yoke')
    H.assign(y, tm)
    H.bevel(y, width=0.02, segments=2)

# distant dish field — depth, and the world's own iconography
for i, (x, y, s) in enumerate(((-13, 26, 1.0), (14, 31, 0.9), (25, 22, 0.75), (-24, 34, 0.8))):
    mast = H.cyl(loc=(x, y, 1.4 * s), r=0.18 * s, depth=2.8 * s, verts=16, name=f'Mast{i}')
    H.assign(mast, rm)
    d2 = H.sphere(loc=(x, y, 3.0 * s), r=1.5 * s, segs=20, rings=10, name=f'Dish{i}')
    d2.scale = (1, 1, 0.32)
    d2.rotation_euler = (math.radians(-32), 0, math.radians(12 * i))
    H.assign(d2, rm)

# ── light ──
# key: a low moon — hard enough to rim the dome and read the basalt
H.area(loc=(-26, -16, 17), rot=(math.radians(56), 0, math.radians(-56)),
       size=10, energy=4200, color=(0.55, 0.68, 1.0))
# the shaft: a tight spot punching down through the slit, seen because of haze
sl, slt = H.spot(loc=(2.2, -2.6, 19.0), target=(0.15, -0.35, 2.4),
                 energy=9000, color=(0.80, 0.89, 1.0),
                 spot_size=0.20, blend=0.34, radius=0.45)
H.keyframe(sl.data, 'energy', [(1, 900), (int(FRAMES * 0.55), 7000), (FRAMES, 11000)])
# cyan bounce off the instrument, small warm service lamp on the base wall
H.point(loc=(0.3, -1.0, 4.2), energy=120, color=CYAN, radius=0.35)
lamp = H.point(loc=(2.55, -1.95, 1.70), energy=18, color=(1.0, 0.66, 0.30), radius=0.05)
fixture = H.cyl(loc=(2.70, -2.05, 1.70), r=0.07, depth=0.16,
                rot=(math.radians(90), 0, math.radians(38)), verts=16, name='Fixture')
H.assign(fixture, H.emissive('LampGlass', (1.0, 0.68, 0.33), 5.0))
# sky fill so basalt never crushes to pure black
H.area(loc=(4, -30, 22), rot=(math.radians(30), 0, 0), size=46,
       energy=520, color=(0.30, 0.42, 0.72))

# a dense pocket for the shaft through the slit. It sits ABOVE the dome on
# purpose: at 0.075 density any camera inside it sees only milk, and the
# close shots in this sequence work at z ≈ 6-7.
H.atmosphere(density=0.075, color=(0.70, 0.80, 1.0), anisotropy=0.74,
             size=8, loc=(0.2, -0.5, 12.0))

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['astronomy'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.dressing('astronomy', [(2.6, (-6.4, -9.0, 0.0), 22), (5.5, (12.5, 9.0, 0.0), -40)])

H.grade(hi=(1.03, 1.05, 1.12), mid=(1.00, 1.00, 1.02), lo=(0.004, 0.008, 0.018),
        glare=0.10, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/astronomy'))

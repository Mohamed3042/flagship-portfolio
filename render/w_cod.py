"""COD — "Operation Clockwork".
Hero shot: 02:00, a stalled city block in the rain. One amber junction box
where process goes to die, sodium haze, a specialist's work light raking in.
The adversary is entropy; nothing is aimed at anyone.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
AMBER = (1.0, 0.52, 0.13)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 128)),
       look='AgX - High Contrast', exposure=0.55)
H.world_sky(top=(0.020, 0.024, 0.030), bottom=(0.006, 0.007, 0.009), strength=1.0)
H.world_haze(density=0.020, color=(0.72, 0.66, 0.55), anisotropy=0.62)

asphalt = H.pbr('Asphalt', base=(0.020, 0.021, 0.022), rough=0.34)   # wet = glossy
H.rough_variation(asphalt, scale=30, low=0.16, high=0.52, bump=1.1)
concrete = H.pbr('Concrete', base=(0.070, 0.070, 0.072), rough=0.88)
H.rough_variation(concrete, scale=18, low=0.72, high=0.97, bump=0.9)
olive = H.pbr('Olive', base=(0.055, 0.060, 0.040), rough=0.62, metal=0.6)
H.rough_variation(olive, scale=40, low=0.45, high=0.78, bump=0.7)
steel = H.pbr('Steel', base=(0.060, 0.062, 0.066), rough=0.36, metal=1.0)
H.brushed(steel, strength=0.3, scale=(250, 4, 250))

# ── street ──
road = H.plane(loc=(0, 10, 0), size=200)
H.assign(road, asphalt)
rs = road.modifiers.new('Sub', 'SUBSURF')
rs.levels = rs.render_levels = 4
rt = bpy.data.textures.new('puddle', 'CLOUDS')
rt.noise_scale = 3.2
rd = road.modifiers.new('Disp', 'DISPLACE')
rd.texture, rd.strength, rd.mid_level = rt, 0.055, 0.5

# building faces left and right — the corridor
for sx in (-1, 1):
    b = H.cube(loc=(sx * 7.4, 14, 6.0), scale=(2.2, 16.0, 6.0), name=f'Bldg{sx}')
    H.assign(b, concrete)
    H.bevel(b, width=0.05, segments=2)
    for i in range(7):          # dead windows, no one home
        w = H.cube(loc=(sx * 5.18, 2.0 + i * 4.2, 4.4 + (i % 3) * 2.6),
                   scale=(0.03, 0.75, 1.05), name=f'Win{sx}{i}')
        H.assign(w, H.pbr('Glass', base=(0.010, 0.012, 0.016), rough=0.10,
                          metal=0.0, spec=0.8))

# ── the junction box: the amber square the whole film points at ──
box = H.cube(loc=(1.9, 4.2, 1.15), scale=(0.62, 0.36, 1.15), name='Junction')
H.assign(box, olive)
H.bevel(box, width=0.03, segments=3)
door = H.cube(loc=(1.28, 4.05, 1.30), scale=(0.03, 0.30, 0.80), name='Door')
door.rotation_euler = (0, 0, math.radians(38))
H.assign(door, olive)
H.bevel(door, width=0.015, segments=2)
lamp_face = H.cube(loc=(1.30, 4.20, 1.72), scale=(0.02, 0.16, 0.16), name='Lens')
lm = H.emissive('AmberLens', AMBER, 0.0)
H.assign(lamp_face, lm)
H.keyframe(lm.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
           [(1, 6.0), (int(FRAMES * 0.45), 26.0), (int(FRAMES * 0.55), 9.0), (FRAMES, 34.0)])

# conduit runs feeding it — the routing that keeps failing
for i, (x0, y0, z0, ln, rot) in enumerate((
        (1.9, 4.55, 2.35, 3.4, (math.radians(90), 0, 0)),
        (1.9, 4.55, 2.05, 2.6, (math.radians(90), 0, math.radians(28))),
        (5.2, 6.0, 2.35, 4.2, (0, math.radians(90), math.radians(12))))):
    c = H.cyl(loc=(x0, y0 + ln * 0.35, z0), r=0.055, depth=ln, rot=rot, verts=16,
              name=f'Conduit{i}')
    H.assign(c, steel)

# inert clutter: pallets and drums, the block stopped mid-task
for i, (x, y, rz) in enumerate(((-3.1, 2.4, 0.2), (-2.4, 3.3, -0.5), (4.3, 8.6, 0.9))):
    p = H.cube(loc=(x, y, 0.13), scale=(0.62, 0.48, 0.13), rot=(0, 0, rz), name=f'Pallet{i}')
    H.assign(p, H.pbr('Wood', base=(0.055, 0.040, 0.026), rough=0.9))
    H.bevel(p, width=0.012, segments=2)
for i, (x, y) in enumerate(((-4.6, 6.2), (-4.0, 7.0), (5.6, 3.4))):
    d = H.cyl(loc=(x, y, 0.44), r=0.30, depth=0.88, verts=32, name=f'Drum{i}')
    H.assign(d, olive)
    H.bevel(d, width=0.02, segments=2)

# a mast lamp far down the street — sodium, the only other light in the city
mast = H.cyl(loc=(-5.6, 24.0, 4.0), r=0.09, depth=8.0, verts=12, name='Mast')
H.assign(mast, steel)
head = H.cube(loc=(-5.0, 24.0, 7.9), scale=(0.5, 0.22, 0.09), name='MastHead')
H.assign(head, H.emissive('Sodium', (1.0, 0.66, 0.30), 24.0))

# ── rain: thin instanced streaks, motion implied by length ──
for i in range(90):
    a = (i * 2.399963)                       # golden-angle scatter, no clumping
    rx = ((i * 37) % 100) / 100 * 16 - 8
    ry = ((i * 53) % 100) / 100 * 22 - 2
    rz = ((i * 71) % 100) / 100 * 9 + 0.4
    st = H.cyl(loc=(rx, ry, rz), r=0.006, depth=0.34 + (i % 5) * 0.06,
               rot=(math.radians(4), math.radians(2), a), verts=5, name=f'Rain{i}')
    # emissive, not refractive: 90 glass cylinders would triple the trace
    # cost for streaks that are two pixels wide on screen
    H.assign(st, H.emissive('RainDrop', (0.62, 0.72, 0.88), 2.2))
    H.keyframe(st, 'location', [(1, rz + 1.6), (FRAMES, rz - 1.4)], index=2)

# ── light ──
H.area(loc=(-9, -4, 14), rot=(math.radians(46), 0, math.radians(-52)),
       size=8, energy=1100, color=(0.42, 0.52, 0.78))          # cold night sky
work, wt = H.spot(loc=(-2.6, -1.6, 2.4), target=(1.7, 4.2, 1.4),
                  energy=1500, color=(0.96, 0.94, 0.88),
                  spot_size=math.radians(46), blend=0.5, radius=0.25)
H.keyframe(work.data, 'energy', [(1, 220), (int(FRAMES * 0.5), 700), (FRAMES, 1050)])
amb = H.point(loc=(1.45, 4.2, 1.72), energy=0.0, color=AMBER, radius=0.10)
H.keyframe(amb.data, 'energy',
           [(1, 12.0), (int(FRAMES * 0.45), 55.0), (int(FRAMES * 0.55), 18.0), (FRAMES, 70.0)])
H.point(loc=(-5.0, 24.0, 7.7), energy=900, color=(1.0, 0.66, 0.30), radius=0.4)

# ── camera: a low handheld-feeling push toward the junction ──
cam, tgt = H.camera(loc=(-3.4, -6.0, 1.75), target=(1.6, 4.0, 1.5), focal=30, fstop=2.8)
H.cam_move(cam, tgt,
           keys=[(1,           (-4.40, -8.60, 2.10), (1.50, 4.0, 1.60)),
                 (FRAMES // 2, (-3.20, -6.00, 1.90), (1.60, 4.1, 1.55)),
                 (FRAMES,      (-2.05, -3.60, 1.70), (1.70, 4.2, 1.50))],
           focal_keys=[(1, 30), (FRAMES, 40)],
           focus_keys=[(1, 14.5), (FRAMES, 9.0)])

H.grade(hi=(1.04, 1.0, 0.97), mid=(1.0, 1.0, 1.0), lo=(0.006, 0.006, 0.012),
        glare=0.16, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/cod'))

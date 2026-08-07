# -*- coding: utf-8 -*-
"""SPOTIFY PULSE — "THE ALBUM".  A 2.39:1 rendered short, not a scroll plate.

Fifteen shots covering the six acts the world page tells in code:

    Prologue   silence has a line          s1  line      s2  pulse
    (place)    the room states itself      s3  room
    Prologue   needle down                 s4  arm       s5  needle
    Act I      map / find the groove       s6  groove    s7  quantize
                                           s8  lanes     s9  canyon
    Act II     build / the visual mixtape  s10 t01       s11 t02      s12 t03
    Act III    gate / master               s13 master
    Prove      the chorus is data-lit      s14 chorus
    Outro      silence, reconstructed      s15 outro

One set: Room 6, a small mastering room at night — concrete, parquet, a slat
ceiling, a bench, a deck, two monitors, a rack. Built at true metric scale
(the LP is 0.152 m in radius) so the physical camera behaves like a camera.
Shot 9 flies inside the groove and gets its own set.

    SHOT=1..15  RES_X=1920  SAMPLES=112  SMOKE=1  blender --background \
        --factory-startup --python film_spotify.py -- <outdir>
"""
import bpy, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H
import filmlib as F

TAU = math.pi * 2
GREEN = (0.06, 0.78, 0.32)
PINK = (1.0, 0.16, 0.52)
VIOLET = (0.38, 0.26, 1.0)
AMBER = (1.0, 0.62, 0.26)
RED = (1.0, 0.10, 0.12)

# ── room, in metres ──
RW, RD, RH = 6.2, 8.4, 3.00           # width (x), depth (y), height (z)
BENCH_Y, BENCH_Z = 1.62, 0.90         # bench face plane, top surface
DECK = (-0.05, 1.42, BENCH_Z)         # where the deck sits on the bench
LP_R = 0.152                          # a 12" LP, for real


# ═══════════════════════════════ shot table ═══════════════════════════════
# keys are (t, cam_xyz, target_xyz) with t in 0..1; focal in mm; focus in m.

SHOTS = [
    dict(name='line', ev=0.85, frames=168, set='room', fstop=2.8, shutter=0.4,
         keys=[(0.0, (0.62, -3.45, 1.42), (0.0, 3.9, 1.30)),
               (1.0, (0.44, -2.55, 1.36), (0.0, 3.9, 1.30))],
         focal=[(0, 32), (1, 38)], focus=[(0, 7.4), (1, 6.5)]),

    dict(name='pulse', ev=0.8, frames=120, set='room', fstop=4.0, shutter=0.4,
         keys=[(0.0, (0.30, 1.05, 1.40), (-0.55, 4.12, 1.30)),
               (1.0, (0.16, 1.55, 1.36), (-0.15, 4.12, 1.30))],
         focal=[(0, 85), (1, 105)], focus=[(0, 3.2), (1, 2.6)]),

    dict(name='room', ev=0.35, frames=216, set='room', fstop=5.6, shutter=0.35,
         keys=[(0.0, (-2.05, -3.55, 2.34), (0.10, 1.55, 1.05)),
               (0.5, (-1.72, -3.00, 1.92), (0.10, 1.55, 1.02)),
               (1.0, (-1.38, -2.45, 1.52), (0.10, 1.55, 1.00))],
         focal=[(0, 24), (1, 28)], focus=[(0, 5.6), (1, 4.4)]),

    # From here the framings are solved against the solved rig: the stylus
    # plays the lead-in groove at (-0.127, 1.541, 0.993), so that is what the
    # macro lenses are pointed at — not the arm post they were aimed at before.
    dict(name='arm', ev=0.45, frames=144, set='room', fstop=4.0, shutter=0.5,
         keys=[(0.0, (-0.62, 0.52, 1.10), (0.02, 1.50, 1.005)),
               (1.0, (-0.40, 0.72, 1.06), (-0.02, 1.51, 1.000))],
         focal=[(0, 65), (1, 85)], focus=[(0, 1.18), (1, 0.88)],
         roll=[(0, -0.5), (1, 0.4)]),

    dict(name='needle', ev=1.2, frames=168, set='room', fstop=9.0, shutter=0.5,
         keys=[(0.0, (0.085, 1.140, 1.058), (-0.115, 1.532, 1.000)),
               (1.0, (0.020, 1.245, 1.022), (-0.127, 1.541, 0.9935))],
         focal=[(0, 90), (1, 125)], focus=[(0, 0.444), (1, 0.332)]),

    # 4 cm above a glossy disc is the exact angle that mirrors every practical
    # straight into the lens; sit up and look down the groove instead
    dict(name='groove', ev=-0.7, frames=168, set='room', fstop=11.0, shutter=0.5,
         keys=[(0.0, (-0.46, 1.20, 1.118), (-0.175, 1.50, 0.9932)),
               (1.0, (-0.36, 1.27, 1.084), (-0.170, 1.50, 0.9932))],
         focal=[(0, 100), (1, 135)], focus=[(0, 0.492), (1, 0.348)]),

    dict(name='quantize', ev=0.35, frames=192, set='room', fstop=4.0, shutter=0.45,
         keys=[(0.0, (-0.72, 0.62, 1.26), (-0.05, 1.43, 1.03)),
               (1.0, (-0.46, 0.82, 1.16), (-0.05, 1.43, 1.01))],
         focal=[(0, 50), (1, 70)], focus=[(0, 1.09), (1, 0.75)]),

    dict(name='lanes', ev=0.55, frames=192, set='room', fstop=4.0, shutter=0.45,
         keys=[(0.0, (-1.72, -0.52, 1.26), (0.10, 1.83, 0.96)),
               (1.0, (-0.62, -0.18, 1.18), (0.06, 1.83, 0.94))],
         focal=[(0, 40), (1, 48)], focus=[(0, 2.60), (1, 1.98)],
         roll=[(0, 0.8), (1, -0.6)]),

    dict(name='canyon', ev=0.35, frames=240, set='canyon', fstop=2.8, shutter=0.6,
         keys=[(0.0, (0.0, -13.0, 0.42), (0.0, -6.0, 0.20)),
               (0.5, (0.06, -4.0, 0.30), (0.0, 3.0, 0.16)),
               (1.0, (-0.05, 5.0, 0.24), (0.0, 12.0, 0.14))],
         focal=[(0, 30), (1, 38)], focus=[(0, 7.0), (1, 6.0)],
         roll=[(0, -1.4), (1, 1.2)]),

    dict(name='t01', ev=0.75, frames=168, set='room', fstop=6.3, shutter=0.45,
         keys=[(0.0, (-0.92, 0.72, 1.10), (-1.24, 1.44, 0.945)),
               (1.0, (-1.06, 0.98, 1.03), (-1.28, 1.46, 0.940))],
         focal=[(0, 85), (1, 110)], focus=[(0, 0.86), (1, 0.62)]),

    dict(name='t02', ev=0.4, frames=168, set='room', fstop=6.3, shutter=0.45,
         keys=[(0.0, (0.98, 0.66, 1.12), (1.30, 1.46, 0.950)),
               (1.0, (1.14, 0.94, 1.04), (1.34, 1.48, 0.944))],
         focal=[(0, 85), (1, 112)], focus=[(0, 0.90), (1, 0.64)]),

    dict(name='t03', ev=0.55, frames=144, set='room', fstop=4.0, shutter=0.4,
         keys=[(0.0, (1.15, 0.10, 1.05), (2.06, 1.24, 0.74)),
               (1.0, (1.42, 0.44, 0.96), (2.06, 1.24, 0.66))],
         focal=[(0, 62), (1, 85)], focus=[(0, 1.50), (1, 1.04)]),

    dict(name='master', ev=0.7, frames=216, set='room', fstop=5.6, shutter=0.45,
         keys=[(0.0, (-0.80, 0.42, 1.24), (-1.20, 1.46, 0.960)),
               (0.5, (-0.90, 0.72, 1.12), (-1.24, 1.46, 0.950)),
               (1.0, (-1.00, 1.00, 1.02), (-1.26, 1.47, 0.944))],
         focal=[(0, 62), (1, 105)], focus=[(0, 1.20), (1, 0.60)]),

    dict(name='chorus', ev=0.4, frames=216, set='room', fstop=4.0, shutter=0.5,
         keys=[(0.0, (-0.30, 0.10, 1.16), (-0.05, 1.44, 1.00)),
               (0.5, (0.55, -0.55, 1.44), (-0.05, 1.46, 1.00)),
               (1.0, (1.55, -1.35, 1.86), (-0.05, 1.48, 0.99))],
         focal=[(0, 58), (1, 34)], focus=[(0, 1.6), (1, 3.1)]),

    dict(name='outro', ev=0.9, frames=192, set='room', fstop=4.0, shutter=0.4,
         keys=[(0.0, (0.34, 0.68, 1.06), (0.10, 1.52, 0.998)),
               (1.0, (0.90, -0.55, 1.32), (0.05, 1.52, 1.00))],
         focal=[(0, 92), (1, 52)], focus=[(0, 0.95), (1, 2.25)]),
]


# ═══════════════════════════════ the room ═══════════════════════════════

def build_room():
    """Room 6 — concrete shell, slat ceiling, parquet, and the gear in it.
    Returns the handles the shot dressers animate."""
    R = {}

    concrete = F.tex_pbr('Concrete', 'concrete', tile=2.6, rough_mul=0.85,
                         rough_add=0.10, tint=(0.52, 0.52, 0.55), normal_strength=1.2)
    concrete_b = F.tex_pbr('ConcreteB', 'concrete_old', tile=3.1, rough_mul=0.9,
                           rough_add=0.06, tint=(0.44, 0.44, 0.48), normal_strength=1.0)
    parquet = F.tex_pbr('Parquet', 'parquet', tile=1.15, rough_mul=0.60,
                        rough_add=0.08, tint=(0.66, 0.55, 0.46), normal_strength=0.9)
    woodc = F.tex_pbr('WoodCeil', 'wood_ceiling', tile=1.4, rough_mul=0.7,
                      rough_add=0.14, tint=(0.44, 0.36, 0.30), normal_strength=0.8)

    # shell ────────────────────────────────────────────────────────────────
    floor = H.plane(loc=(0, 0, 0), size=14.0, name='Floor')
    H.assign(floor, parquet)
    ceil = H.plane(loc=(0, 0, RH), size=14.0, rot=(math.pi, 0, 0), name='Ceil')
    H.assign(ceil, concrete_b)

    t = 0.12
    F.box(loc=(0, RD / 2 + t / 2, RH / 2), dims=(RW + 2 * t, t, RH), name='WallBack', mat=concrete)
    F.box(loc=(0, -RD / 2 - t / 2, RH / 2), dims=(RW + 2 * t, t, RH), name='WallFront', mat=concrete)
    F.box(loc=(RW / 2 + t / 2, 0, RH / 2), dims=(t, RD, RH), name='WallRight', mat=concrete)

    # left wall carries a window into the dark live room — four panels round
    # the hole, because a boolean on a textured wall is a seam waiting to show
    wx = -RW / 2 - t / 2
    F.box(loc=(wx, 0, 0.50), dims=(t, RD, 1.00), name='WallL_lo', mat=concrete)
    F.box(loc=(wx, 0, 2.60), dims=(t, RD, 0.80), name='WallL_hi', mat=concrete)
    F.box(loc=(wx, -2.15, 1.60), dims=(t, 4.10, 1.20), name='WallL_a', mat=concrete)
    F.box(loc=(wx, 3.15, 1.60), dims=(t, 2.10, 1.20), name='WallL_b', mat=concrete)
    glass = H.pbr('Glass', base=(0.9, 0.9, 0.92), rough=0.03, transmission=1.0, ior=1.46)
    F.box(loc=(wx, 0.55, 1.60), dims=(0.012, 2.0, 1.20), name='Window', mat=glass)

    F.slat_ceiling(RH - 0.02, RW - 0.2, RD - 0.6, woodc)

    # acoustic panels on the back wall — fabric, so they eat the specular and
    # give the green line something matte to sit against
    # they flank the line rather than share its wall band: two solids sitting
    # 8 cm proud of a 1.4 cm light bar would intersect it, and an intersection
    # is the one artifact a still frame always finds
    fab = H.pbr('Fabric', base=(0.055, 0.058, 0.065), rough=0.94, sheen=0.35)
    for i, x in enumerate((-2.02, 2.02)):
        F.box(loc=(x, RD / 2 - 0.05, 1.62), dims=(1.10, 0.075, 1.86),
              name='Panel%d' % i, mat=fab, bevel=0.008, segments=2)

    # bench ────────────────────────────────────────────────────────────────
    benchwood = H.pbr('BenchWood', base=(0.052, 0.043, 0.036), rough=0.34)
    H.rough_variation(benchwood, scale=90, low=0.22, high=0.44, bump=0.25)
    F.box(loc=(0, BENCH_Y, BENCH_Z - 0.028), dims=(3.10, 0.74, 0.056),
          name='BenchTop', mat=benchwood, bevel=0.006, segments=3)
    steel = H.pbr('Steel', base=(0.085, 0.088, 0.095), rough=0.30, metal=1.0)
    H.brushed(steel, strength=0.18, scale=(220, 3, 220))
    for x in (-1.44, 1.44):
        F.box(loc=(x, BENCH_Y, (BENCH_Z - 0.056) / 2), dims=(0.05, 0.62, BENCH_Z - 0.056),
              name='BenchLeg', mat=steel, bevel=0.004, segments=2)
    F.box(loc=(0, BENCH_Y + 0.30, 0.30), dims=(2.90, 0.035, 0.06), name='BenchBrace', mat=steel)

    # ── the deck ───────────────────────────────────────────────────────────
    dx, dy, dz = DECK
    plinth_h = 0.062
    plinth = F.box(loc=(dx, dy, dz + plinth_h / 2), dims=(0.44, 0.365, plinth_h),
                   name='Plinth', bevel=0.006, segments=4)
    pm = H.pbr('PlinthM', base=(0.020, 0.019, 0.020), rough=0.34)
    H.rough_variation(pm, scale=150, low=0.24, high=0.46, bump=0.30)
    H.assign(plinth, pm)
    for sx in (-1, 1):
        for sy in (-1, 1):
            H.assign(H.cyl(loc=(dx + sx * 0.185, dy + sy * 0.148, dz - 0.008),
                           r=0.016, depth=0.018, verts=24, name='Foot'), steel)

    top = dz + plinth_h
    platter = H.cyl(loc=(dx, dy, top + 0.013), r=0.155, depth=0.026, verts=192, name='Platter')
    plat_m = H.pbr('PlatterAlu', base=(0.115, 0.116, 0.120), rough=0.26, metal=1.0)
    H.brushed(plat_m, strength=0.22, scale=(500, 6, 500))
    H.assign(platter, plat_m)
    H.bevel(platter, width=0.0018, segments=3)

    mat_r = H.cyl(loc=(dx, dy, top + 0.0272), r=0.153, depth=0.0025, verts=160, name='Slipmat')
    H.assign(mat_r, H.pbr('Felt', base=(0.020, 0.021, 0.024), rough=0.96, sheen=0.5))

    rec = H.cyl(loc=(dx, dy, top + 0.0295), r=LP_R, depth=0.0022, verts=256, name='Record')
    H.assign(rec, _vinyl())
    R['record'] = rec

    # a real LP label is 100 mm across — keep the size honest and let the paper
    # carry the value, or it disappears against the vinyl in every wide
    label = H.cyl(loc=(dx, dy, top + 0.0308), r=0.0505, depth=0.0004, verts=96, name='Label')
    lm = H.pbr('Label', base=(0.46, 0.085, 0.17), rough=0.86)
    H.rough_variation(lm, scale=400, low=0.78, high=0.92, bump=0.15)
    H.assign(label, lm)
    H.assign(H.cyl(loc=(dx, dy, top + 0.0310), r=0.0182, depth=0.0002, verts=64,
                   name='LabelRing'), H.pbr('LabelRing', base=(0.16, 0.030, 0.065), rough=0.9))
    R['label'] = label
    H.assign(H.cyl(loc=(dx, dy, top + 0.037), r=0.0036, depth=0.020, verts=20, name='Spindle'),
             H.pbr('Spindle', base=(0.62, 0.62, 0.64), rough=0.16, metal=1.0))

    R.update(_tonearm(dx, dy, top, steel))

    # deck pilot: the one green light that is allowed to mean something
    pil, pilm = F.led((dx - 0.175, dy - 0.150, top + 0.004), 0.0038, GREEN, 34.0, 'Pilot')
    R['pilot_mat'] = pilm
    R['pilot_lamp'] = H.point(loc=(dx - 0.175, dy - 0.150, top + 0.02), energy=0.35,
                              color=GREEN, radius=0.02)

    R.update(_console(steel))
    R.update(_gate_panel(steel))
    R.update(_monitors(steel))
    R.update(_rack(steel))
    R.update(_life(steel))

    # cable from the deck's back edge down behind the bench
    cbl = H.pbr('Cable', base=(0.010, 0.010, 0.012), rough=0.62)
    F.cable([(dx + 0.10, dy + 0.185, dz + 0.02), (dx + 0.32, BENCH_Y + 0.34, 0.66),
             (dx + 0.30, BENCH_Y + 0.31, 0.16), (dx + 0.60, BENCH_Y + 0.26, 0.012)],
            radius=0.0042, name='DeckCable', mat=cbl)
    F.cable([(-1.30, BENCH_Y + 0.33, 0.88), (-1.05, BENCH_Y + 0.40, 0.52),
             (-0.55, BENCH_Y + 0.36, 0.14), (0.10, BENCH_Y + 0.30, 0.011)],
            radius=0.0038, name='RunCable', mat=cbl)

    # ── the flat line: silence, drawn ─────────────────────────────────────
    lm = H.emissive('LineM', GREEN, 7.0)
    F.box(loc=(0, RD / 2 - 0.011, 1.34), dims=(2.34, 0.014, 0.0085), name='Line', mat=lm)
    R['line_mat'] = lm
    beat = F.box(loc=(-1.10, RD / 2 - 0.014, 1.34), dims=(0.055, 0.012, 0.010),
                 name='Beat', mat=H.emissive('BeatM', (0.72, 1.0, 0.80), 0.0))
    R['beat'] = beat
    R['beat_mat'] = beat.data.materials[0]
    R['line_lamp'] = H.point(loc=(0, RD / 2 - 0.14, 1.34), energy=1.6, color=GREEN, radius=0.30)

    _lights(R)
    return R


def _vinyl():
    """Groove as real relief: a sine of the radius on the surface normal.

    The first pass shipped this at roughness 0.135 with a 60-micron bump, and
    every macro frame blew out — because a near-mirror disc under a pink
    practical is a pink mirror, and the groove was too shallow to break the
    highlight. Real vinyl reads glossy but never mirrored: the modulation
    shreds the specular into a fine radial streak. That is a deeper groove and
    a higher roughness, not a dimmer light.
    """
    m = H.pbr('Vinyl', base=(0.0055, 0.0055, 0.0062), rough=0.27, spec=0.32)
    nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    ln = nt.nodes.new('ShaderNodeVectorMath')
    ln.operation = 'LENGTH'
    mul = nt.nodes.new('ShaderNodeMath')
    mul.operation = 'MULTIPLY'
    mul.inputs[1].default_value = 20000.0            # ≈ 3.2 grooves per mm
    sin = nt.nodes.new('ShaderNodeMath')
    sin.operation = 'SINE'
    bmp = nt.nodes.new('ShaderNodeBump')
    bmp.inputs['Strength'].default_value = 1.0
    bmp.inputs['Distance'].default_value = 0.00022
    nt.links.new(tc.outputs['Object'], ln.inputs[0])
    nt.links.new(ln.outputs['Value'], mul.inputs[0])
    nt.links.new(mul.outputs['Value'], sin.inputs[0])
    nt.links.new(sin.outputs['Value'], bmp.inputs['Height'])
    nt.links.new(bmp.outputs['Normal'], b.inputs['Normal'])
    # pressing is never perfectly uniform; the wide shots need that variance
    noi = nt.nodes.new('ShaderNodeTexNoise')
    noi.inputs['Scale'].default_value = 26.0
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (0.250, 0.250, 0.250, 1)
    ramp.color_ramp.elements[1].color = (0.330, 0.330, 0.330, 1)
    nt.links.new(noi.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Roughness'])
    return m


def _tonearm(dx, dy, top, steel):
    """Pivot at the back right, 0.238 m effective length — an S-arm's numbers,
    so the descent arc across the lead-in groove is the real one.

    Pivot height is SOLVED, not guessed: the stylus tip hangs 33.5 mm below the
    bearing, and the playing surface is 30.6 mm above the plinth deck, so the
    bearing has to sit at deck + 64.1 mm or the needle renders buried inside
    the record — which is exactly what the first pass did.
    """
    surface = top + 0.0295 + 0.0011                 # top of the vinyl
    px, py, pz = dx + 0.175, dy + 0.126, surface + 0.03385   # stylus tip drop
    piv = bpy.data.objects.new('ArmPivot', None)
    piv.location = (px, py, pz)
    bpy.context.collection.objects.link(piv)

    arm_m = H.pbr('ArmM', base=(0.13, 0.13, 0.135), rough=0.22, metal=1.0)
    H.brushed(arm_m, strength=0.16, scale=(400, 5, 400))
    tube = H.cyl(loc=(-0.119, 0, 0), r=0.0055, depth=0.238,
                 rot=(0, math.radians(90), 0), verts=28, name='ArmTube')
    tube.parent = piv
    H.assign(tube, arm_m)
    hs = F.box(loc=(-0.247, 0, -0.011), dims=(0.030, 0.019, 0.017), name='Headshell',
               mat=H.pbr('HS', base=(0.026, 0.026, 0.028), rough=0.38), bevel=0.0022, segments=3)
    hs.parent = piv
    cart = F.box(loc=(-0.247, 0, -0.022), dims=(0.017, 0.013, 0.010), name='Cart',
                 mat=H.pbr('CartM', base=(0.085, 0.012, 0.022), rough=0.38), bevel=0.0012, segments=2)
    cart.parent = piv
    cant = H.cyl(loc=(-0.2555, 0, -0.0272), r=0.00055, depth=0.0115,
                 rot=(0, math.radians(28), 0), verts=8, name='Cantilever')
    cant.parent = piv
    H.assign(cant, H.pbr('CantM', base=(0.78, 0.78, 0.80), rough=0.18, metal=1.0))
    sty = H.cyl(loc=(-0.2585, 0, -0.0316), r=0.0007, depth=0.0045, verts=8, name='Stylus')
    sty.parent = piv
    H.assign(sty, H.pbr('StylusM', base=(0.80, 0.80, 0.83), rough=0.05, metal=1.0))
    cw = H.cyl(loc=(0.052, 0, 0), r=0.019, depth=0.034, rot=(0, math.radians(90), 0),
               verts=28, name='Counterweight')
    cw.parent = piv
    H.assign(cw, arm_m)
    H.assign(H.cyl(loc=(px, py, (top + pz) / 2), r=0.017, depth=pz - top + 0.010,
                   verts=28, name='ArmPost'), steel)
    H.assign(H.cyl(loc=(px, py, top + 0.0025), r=0.026, depth=0.005, verts=32, name='ArmBase'),
             steel)
    # the rest, where the arm parks
    H.assign(H.cyl(loc=(dx + 0.196, dy - 0.052, top + 0.012), r=0.008, depth=0.030,
                   verts=16, name='ArmRest'), steel)
    return dict(pivot=piv, stylus=sty, headshell=hs, surface=surface, pivot_xy=(px, py))


def _console(steel):
    """An eight-fader strip on the left of the bench: Track 01's consent gate.
    The send fader is the one at the end, and it never leaves zero."""
    out = {}
    cx, cy = -1.26, 1.46
    panel = F.box(loc=(cx, cy, BENCH_Z + 0.011), dims=(0.30, 0.235, 0.022),
                  name='Console', mat=H.pbr('ConsoleM', base=(0.030, 0.031, 0.034), rough=0.44),
                  bevel=0.0025, segments=3)
    F.box(loc=(cx, cy, BENCH_Z + 0.0225), dims=(0.275, 0.205, 0.002), name='ConsoleFace',
          mat=H.pbr('Face', base=(0.016, 0.017, 0.019), rough=0.62))
    caps, mats = [], []
    for i in range(8):
        x = cx - 0.119 + i * 0.034
        F.box(loc=(x, cy, BENCH_Z + 0.0235), dims=(0.0055, 0.115, 0.0012), name='Track%d' % i,
              mat=H.pbr('TrackM%d' % i, base=(0.006, 0.006, 0.007), rough=0.8))
        cap = F.box(loc=(x, cy - 0.050, BENCH_Z + 0.029), dims=(0.016, 0.020, 0.010),
                    name='Cap%d' % i, mat=H.pbr('CapM%d' % i, base=(0.05, 0.05, 0.055), rough=0.5),
                    bevel=0.0012, segments=2)
        caps.append(cap)
        m = H.emissive('FLed%d' % i, GREEN, 0.0)
        o = F.box(loc=(x, cy + 0.088, BENCH_Z + 0.0242), dims=(0.010, 0.004, 0.0012),
                  name='FLed%d' % i, mat=m)
        mats.append(m)
    out['faders'] = caps
    out['fader_leds'] = mats
    out['console_xy'] = (cx, cy)
    # the send fader, welded at zero, with its own red-then-green consent lamp
    sm = H.emissive('SendM', RED, 0.0)
    F.box(loc=(cx + 0.126, cy + 0.088, BENCH_Z + 0.0242), dims=(0.013, 0.005, 0.0014),
          name='SendLed', mat=sm)
    out['send_mat'] = sm
    out['send_lamp'] = H.point(loc=(cx + 0.126, cy + 0.088, BENCH_Z + 0.05),
                               energy=0.0, color=GREEN, radius=0.02)
    return out


def _gate_panel(steel):
    """Track 02: destruction is not instant. A red bar, and one key."""
    out = {}
    gx, gy = 1.30, 1.46
    F.box(loc=(gx, gy, BENCH_Z + 0.010), dims=(0.24, 0.185, 0.020), name='Gate',
          mat=H.pbr('GateM', base=(0.028, 0.028, 0.031), rough=0.46), bevel=0.0022, segments=3)
    gm = H.emissive('GateBarM', RED, 6.0)
    F.box(loc=(gx, gy + 0.062, BENCH_Z + 0.0215), dims=(0.170, 0.010, 0.0016),
          name='GateBar', mat=gm)
    out['gate_mat'] = gm
    out['gate_lamp'] = H.point(loc=(gx, gy + 0.062, BENCH_Z + 0.06), energy=1.1,
                               color=RED, radius=0.03)
    keym = H.pbr('KeyM', base=(0.045, 0.045, 0.050), rough=0.52)
    keys = []
    for r in range(2):
        for c in range(5):
            k = F.box(loc=(gx - 0.070 + c * 0.035, gy - 0.020 - r * 0.034,
                           BENCH_Z + 0.0265), dims=(0.026, 0.026, 0.009),
                      name='Key%d%d' % (r, c), mat=keym, bevel=0.0016, segments=2)
            keys.append(k)
    out['keys'] = keys
    return out


def _monitors(steel):
    """Two near-fields on stands, toed in at the listening position."""
    out = {}
    cabm = H.pbr('CabM', base=(0.024, 0.024, 0.027), rough=0.55)
    H.rough_variation(cabm, scale=180, low=0.42, high=0.66, bump=0.20)
    cones = []
    for sx in (-1, 1):
        x = sx * 1.24
        stand = H.cyl(loc=(x, 2.28, 0.44), r=0.030, depth=0.88, verts=24, name='Stand')
        H.assign(stand, steel)
        H.assign(H.cyl(loc=(x, 2.28, 0.012), r=0.13, depth=0.024, verts=32, name='StandBase'),
                 steel)
        yaw = math.radians(-16 * sx)
        cab = F.box(loc=(x, 2.28, 1.06), dims=(0.205, 0.255, 0.335), rot=(0, 0, yaw),
                    name='Monitor', mat=cabm, bevel=0.010, segments=3)
        fy = 2.28 - 0.128 * math.cos(yaw)
        fx = x + 0.128 * math.sin(yaw)
        w = H.cyl(loc=(fx, fy, 1.005), r=0.062, depth=0.030,
                  rot=(math.radians(90), 0, yaw), verts=40, name='Woofer')
        H.assign(w, H.pbr('ConeM', base=(0.014, 0.014, 0.016), rough=0.86))
        cones.append(w)
        tw = H.cyl(loc=(fx, fy, 1.148), r=0.021, depth=0.024,
                   rot=(math.radians(90), 0, yaw), verts=28, name='Tweeter')
        H.assign(tw, H.pbr('DomeM', base=(0.42, 0.42, 0.45), rough=0.24, metal=1.0))
        m = H.emissive('MonLed%d' % sx, GREEN, 3.0)
        H.assign(H.sphere(loc=(fx, fy - 0.004, 0.905), r=0.0034, segs=12, rings=6,
                          name='MonLed'), m)
        out.setdefault('mon_leds', []).append(m)
    out['cones'] = cones
    return out


def _rack(steel):
    """A short 19" rack against the right wall, eight units of meters — the
    only surface in the room that is allowed to be busy."""
    out = {}
    rx, ry = 2.36, 1.22
    F.box(loc=(rx, ry, 0.55), dims=(0.56, 0.60, 1.10), name='RackShell',
          mat=H.pbr('RackM', base=(0.020, 0.020, 0.023), rough=0.50),
          bevel=0.006, segments=3)
    seg_mats = []
    faceplate = H.pbr('Face19', base=(0.032, 0.033, 0.036), rough=0.40)
    for u in range(8):
        z = 0.20 + u * 0.088
        F.box(loc=(rx - 0.276, ry, z), dims=(0.022, 0.52, 0.080), name='RackU%d' % u,
              mat=faceplate, bevel=0.003, segments=2)
        for s in range(9):
            m = H.emissive('Seg%d_%d' % (u, s), GREEN if s < 6 else AMBER, 0.0)
            F.box(loc=(rx - 0.289, ry - 0.20 + s * 0.042, z + 0.018),
                  dims=(0.004, 0.030, 0.008), name='Seg%d_%d' % (u, s), mat=m)
            seg_mats.append((u, s, m))
    out['segs'] = seg_mats
    out['rack_xy'] = (rx, ry)
    # a small warm practical on top of the rack: the room's only friendly light
    H.assign(H.cyl(loc=(rx, ry - 0.05, 1.14), r=0.055, depth=0.08, verts=24, name='LampBody'),
             H.pbr('LampM', base=(0.10, 0.09, 0.085), rough=0.5, metal=1.0))
    H.assign(H.sphere(loc=(rx, ry - 0.05, 1.20), r=0.026, segs=16, rings=8, name='Bulb'),
             H.emissive('BulbM', (1.0, 0.72, 0.40), 95.0))
    out['practical'] = H.point(loc=(rx, ry - 0.05, 1.21), energy=15.0,
                               color=(1.0, 0.70, 0.40), radius=0.03)
    return out


def _life(steel):
    """A stool, a pair of cans, a mug. Three props, and the room stops being a
    render of a room and starts being somewhere a person just left."""
    seat = H.pbr('Seat', base=(0.052, 0.046, 0.042), rough=0.72, sheen=0.3)
    H.assign(H.cyl(loc=(-0.55, 0.55, 0.585), r=0.155, depth=0.045, verts=40, name='Stool'), seat)
    H.assign(H.cyl(loc=(-0.55, 0.55, 0.285), r=0.030, depth=0.560, verts=24, name='StoolPost'),
             steel)
    H.assign(H.cyl(loc=(-0.55, 0.55, 0.011), r=0.175, depth=0.022, verts=36, name='StoolFoot'),
             steel)
    H.assign(H.torus(loc=(-0.55, 0.55, 0.185), major=0.125, minor=0.010, name='StoolRing'), steel)

    # headphones, resting where they were put down
    cans = H.pbr('Cans', base=(0.028, 0.028, 0.031), rough=0.58)
    pad = H.pbr('Pad', base=(0.020, 0.020, 0.023), rough=0.92, sheen=0.6)
    hx, hy = 0.52, 1.44
    for sx in (-1, 1):
        H.assign(H.cyl(loc=(hx + sx * 0.072, hy, BENCH_Z + 0.038),
                       r=0.048, depth=0.030, rot=(0, math.radians(90), 0),
                       verts=32, name='Cup'), cans)
        H.assign(H.cyl(loc=(hx + sx * 0.089, hy, BENCH_Z + 0.038),
                       r=0.046, depth=0.014, rot=(0, math.radians(90), 0),
                       verts=32, name='Ear'), pad)
    band = H.torus(loc=(hx, hy, BENCH_Z + 0.038), major=0.072, minor=0.007,
                   rot=(math.radians(90), 0, 0), name='Band')
    H.assign(band, cans)

    mug = H.cyl(loc=(-0.62, 1.36, BENCH_Z + 0.046), r=0.041, depth=0.092, verts=40, name='Mug')
    H.assign(mug, H.pbr('MugM', base=(0.30, 0.29, 0.28), rough=0.36))
    H.assign(H.torus(loc=(-0.545, 1.36, BENCH_Z + 0.050), major=0.028, minor=0.006,
                     rot=(math.radians(90), 0, 0), name='Handle'),
             H.pbr('MugM2', base=(0.30, 0.29, 0.28), rough=0.36))
    return {}


def _lights(R):
    """Night in a room lit by its own gear.

    Watts, not vibes: a 24 W area three metres above a 0.4 m deck delivers
    about half a watt per square metre at the record — which is why the first
    pass rendered a black box with a green line in it. These are the levels a
    real practical rig actually runs at for this stop.
    """
    dx, dy, _ = DECK
    # the pool on the deck: a hard-ish downlight, the shot's real key
    R['pool'], _t = H.spot(loc=(dx + 0.05, dy - 0.22, RH - 0.10), target=(dx, dy, BENCH_Z),
                           energy=88.0, color=(1.0, 0.90, 0.78),
                           spot_size=math.radians(54), blend=0.72, radius=0.22)
    # soft ceiling wash so the bench and the room read either side of the pool
    # OFF the mirror axis. A 1.6 m softbox hung over a glossy disc is not a
    # room light, it is a reflection the size of the record — which is what the
    # first macro passes were actually photographing.
    R['key'] = H.area(loc=(-1.62, 0.55, RH - 0.16), rot=(math.radians(22), 0, 0),
                      size=1.25, energy=125.0, color=(1.0, 0.87, 0.72))
    # pink accent grazing the back wall from behind the monitors
    R['accent'] = H.area(loc=(1.85, 3.55, 1.10), rot=(math.radians(74), 0, math.radians(170)),
                         size=1.10, energy=90.0, color=PINK)
    F.strip_light((1.85, 3.94, 1.02), (1.30, 0.020, 0.014), PINK, 9.0, 'PinkStrip')
    # violet from the live room through the window
    R['violet'] = H.area(loc=(-3.34, 0.55, 1.60), rot=(math.radians(90), 0, math.radians(-90)),
                         size=1.15, size_y=1.9, energy=210.0, color=VIOLET, shape='RECTANGLE')
    # negative-fill side eye light: the lens side of an object should not be
    # solid black, it should be dark
    R['fill'] = H.area(loc=(-1.20, -3.10, 1.85), rot=(math.radians(66), 0, math.radians(-24)),
                       size=2.2, energy=26.0, color=(0.60, 0.64, 0.82))
    # a small book light for the macro shots, dark until a shot asks for it —
    # at 100 mm the pool alone is all top light and the front of the headshell
    # is a silhouette
    # Grazing, at record height: a raking light is the only thing that makes
    # a 0.3 mm groove relief show up as anything but a smooth gloss.
    R['macro'], _mt = H.spot(loc=(dx + 0.62, dy - 0.62, BENCH_Z + 0.145),
                             target=(dx - 0.02, dy + 0.03, BENCH_Z + 0.093),
                             energy=52.0, color=(1.0, 0.94, 0.88),
                             spot_size=math.radians(26), blend=0.55, radius=0.05)
    H.world_sky(top=(0.0060, 0.0055, 0.0078), bottom=(0.0026, 0.0024, 0.0034), strength=1.0)
    # HAZE is a speed knob, not just a look knob. A World volume is an INFINITE
    # participating medium: every camera ray and every shadow ray marches it,
    # in a room lit by six sources, and it dominates the frame cost.
    haze = float(os.environ.get('HAZE', '0.014'))
    if haze > 0:
        H.world_haze(density=haze, color=(0.82, 0.64, 0.80), anisotropy=0.45)
    # Shots ride the rig in RELATIVE terms from here on. Absolute watts in a
    # dresser is how a lighting change in one place silently re-lights fifteen
    # shots the next time the rig is balanced.
    R['_base'] = {k: R[k].data.energy for k in
                  ('pool', 'key', 'accent', 'violet', 'fill', 'macro', 'practical',
                   'line_lamp', 'pilot_lamp', 'gate_lamp', 'send_lamp') if k in R}
    R['macro'].data.energy = 0.0


def _lite(R, name, mul):
    """Hold a lamp at `mul` times its rig level for the whole shot."""
    if name in R:
        R[name].data.energy = R['_base'][name] * mul


def _litek(R, name, keys):
    """Ride a lamp: keys are (frame, multiplier-of-rig-level)."""
    if name in R:
        b = R['_base'][name]
        H.keyframe(R[name].data, 'energy', [(f, b * m) for f, m in keys])


# ═══════════════════════════════ the canyon ═══════════════════════════════

def build_canyon():
    """Shot 9 lives inside the groove. Two modulated walls and a floor, forty
    metres long — the only honest way to fly a lens down a 0.1 mm trench."""
    R = {}
    vin = H.pbr('CanyonVinyl', base=(0.0090, 0.0090, 0.0098), rough=0.20)
    nt = vin.node_tree
    b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1.0, 0.02, 1.0)
    n1 = nt.nodes.new('ShaderNodeTexNoise')
    n1.inputs['Scale'].default_value = 9.0
    n1.inputs['Detail'].default_value = 6.0
    bmp = nt.nodes.new('ShaderNodeBump')
    bmp.inputs['Strength'].default_value = 0.35
    bmp.inputs['Distance'].default_value = 0.004
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], n1.inputs['Vector'])
    nt.links.new(n1.outputs['Fac'], bmp.inputs['Height'])
    nt.links.new(bmp.outputs['Normal'], b.inputs['Normal'])

    # The walls ARE the waveform. Built vertex by vertex rather than displaced
    # by a procedural texture: a groove wall has to vary along its length and
    # stay constant up its height, and no noise texture does only that.
    L, HGT, SEG = 46.0, 1.15, 900
    for sx in (-1, 1):
        verts, faces = [], []
        for i in range(SEG + 1):
            t = i / float(SEG)
            y = -L / 2 + t * L
            a = (0.052 * math.sin(y * 2.4 + sx * 0.7)
                 + 0.030 * math.sin(y * 6.1 + sx * 2.1)
                 + 0.016 * math.sin(y * 15.3 + sx * 4.4)
                 + 0.008 * math.sin(y * 37.0))
            x = sx * (0.44 + a)
            verts += [(x - sx * 0.006, y, -0.06), (x + sx * 0.20, y, HGT)]
            if i:
                b = 2 * (i - 1)
                faces.append((b, b + 2, b + 3, b + 1) if sx > 0 else (b + 1, b + 3, b + 2, b))
        me = bpy.data.meshes.new('GrooveWall%d' % sx)
        me.from_pydata(verts, [], faces)
        me.update()
        for p in me.polygons:
            p.use_smooth = True
        w = bpy.data.objects.new('GrooveWall%d' % sx, me)
        bpy.context.collection.objects.link(w)
        w.data.materials.append(vin)
        sol = w.modifiers.new('Solid', 'SOLIDIFY')
        sol.thickness = 0.16
        sol.offset = 1.0 if sx > 0 else -1.0
    floor = F.box(loc=(0, 0, -0.062), dims=(1.05, L, 0.06), name='GrooveFloor', mat=vin)
    R['floor'] = floor

    # green downbeat markers every four metres — sixteen bars, one take
    R['markers'] = []
    for i in range(14):
        y = -20.0 + i * 3.2
        m = H.emissive('Mk%d' % i, GREEN, 9.0)
        F.box(loc=(0, y, -0.028), dims=(0.62, 0.055, 0.006), name='Mk%d' % i, mat=m)
        R['markers'].append((i, m))
        H.point(loc=(0, y, 0.16), energy=0.9, color=GREEN, radius=0.10)

    H.area(loc=(0, -8.0, 3.2), rot=(math.radians(30), 0, 0), size=3.0,
           energy=90.0, color=(0.95, 0.80, 0.92))
    H.area(loc=(2.6, 6.0, 1.6), rot=(math.radians(72), 0, math.radians(120)),
           size=2.4, energy=70.0, color=PINK)
    H.area(loc=(-2.6, 14.0, 1.6), rot=(math.radians(72), 0, math.radians(-120)),
           size=2.4, energy=60.0, color=VIOLET)
    H.world_sky(top=(0.010, 0.006, 0.012), bottom=(0.002, 0.002, 0.004), strength=1.0)
    H.world_haze(density=0.030, color=(0.85, 0.60, 0.80), anisotropy=0.55)
    return R


# ═══════════════════════════════ shot dressing ═══════════════════════════════
# Each shot animates only what it needs; everything else holds its rest state.

BPM = 84.0


def _beats(F_):
    """Frame numbers of the downbeats at 84 BPM over this shot."""
    per = 24.0 * 60.0 / BPM
    return [1 + int(round(i * per)) for i in range(int(F_ / per) + 1)]


def rest(R, F_):
    """The state every shot starts from: arm parked, record turning, pilot on."""
    if 'pivot' in R:
        R['pivot'].rotation_euler = (0, math.radians(-1.4), math.radians(26))
    if 'record' in R:
        # 33⅓ rpm, exactly, and linear — an eased platter is an instant tell
        for ob in (R['record'], R['label']):
            H.keyframe(ob, 'rotation_euler',
                       [(1, 0.0), (F_, -TAU * (33.333 / 60.0) * (F_ / 24.0))], index=2)
            F.linear(ob)
    for m in R.get('fader_leds', []):
        m.node_tree.nodes['Emission'].inputs['Strength'].default_value = 1.6
    for _u, _s, m in R.get('segs', []):
        m.node_tree.nodes['Emission'].inputs['Strength'].default_value = 0.9 if _s < 4 else 0.0


def _emit(mat, keys):
    H.keyframe(mat.node_tree.nodes['Emission'].inputs['Strength'], 'default_value', keys)


def d_line(R, F_):
    """Silence has a line: the line holds, one heartbeat crosses it, once."""
    _emit(R['line_mat'], [(1, 5.0), (int(F_ * 0.55), 5.6), (F_, 6.4)])
    b = R['beat']
    H.keyframe(b, 'location', [(1, -1.16), (F_, 1.16)], index=0)
    _emit(R['beat_mat'], [(1, 0.0), (int(F_ * 0.42), 0.0), (int(F_ * 0.50), 190.0),
                          (int(F_ * 0.60), 0.0), (F_, 0.0)])
    _litek(R, 'line_lamp', [(1, 1.0), (int(F_ * 0.50), 5.0), (int(F_ * 0.62), 1.0), (F_, 1.0)])
    _lite(R, 'pool', 0.22)
    _lite(R, 'key', 0.30)
    _lite(R, 'accent', 0.30)
    _lite(R, 'violet', 0.55)
    _lite(R, 'practical', 0.55)


def d_pulse(R, F_):
    """The heartbeat, held at 105 mm: the line is the whole frame."""
    _emit(R['line_mat'], [(1, 6.0), (F_, 7.4)])
    b = R['beat']
    H.keyframe(b, 'location', [(1, -0.62), (F_, 0.30)], index=0)
    H.keyframe(b, 'scale', [(1, 1.0), (int(F_ * 0.44), 1.0), (int(F_ * 0.52), 3.4),
                            (int(F_ * 0.66), 1.0), (F_, 1.0)], index=2)
    _emit(R['beat_mat'], [(1, 26.0), (int(F_ * 0.46), 26.0), (int(F_ * 0.53), 260.0),
                          (int(F_ * 0.70), 26.0), (F_, 26.0)])
    _litek(R, 'line_lamp', [(1, 1.4), (int(F_ * 0.53), 6.0), (int(F_ * 0.70), 1.4), (F_, 1.4)])
    _lite(R, 'pool', 0.20)
    _lite(R, 'key', 0.26)
    _lite(R, 'accent', 0.42)
    _lite(R, 'violet', 0.6)


def d_room(R, F_):
    """The room states itself. Everything at working level, nothing shouting."""
    _emit(R['line_mat'], [(1, 6.2), (F_, 6.6)])
    for i, (u, s, m) in enumerate(R.get('segs', [])):
        m.node_tree.nodes['Emission'].inputs['Strength'].default_value = \
            2.6 if s < 3 + (u % 4) else 0.0
    _lite(R, 'pool', 1.0)
    _lite(R, 'key', 0.85)
    _lite(R, 'accent', 0.80)
    _lite(R, 'violet', 0.90)


def d_arm(R, F_):
    """The arm crosses the dark. Lift, swing in over the lead-in, hold."""
    p = R['pivot']
    H.keyframe(p, 'rotation_euler',
               [(1, math.radians(26)), (int(F_ * 0.78), math.radians(2.2)),
                (F_, math.radians(2.0))], index=2)
    H.keyframe(p, 'rotation_euler',
               [(1, math.radians(-7.5)), (int(F_ * 0.80), math.radians(-3.2)),
                (F_, math.radians(-2.6))], index=1)
    _lite(R, 'pool', 1.05)
    _lite(R, 'key', 0.62)
    _lite(R, 'accent', 1.15)
    _lite(R, 'macro', 0.35)


def d_needle(R, F_):
    """Contact, on the downbeat: the descent lands and the pilot blooms once."""
    p = R['pivot']
    H.keyframe(p, 'rotation_euler', [(1, math.radians(2.0)), (F_, math.radians(1.4))], index=2)
    H.keyframe(p, 'rotation_euler',
               [(1, math.radians(-3.0)), (int(F_ * 0.70), math.radians(-0.15)),
                (F_, math.radians(-0.15))], index=1)
    _emit(R['pilot_mat'], [(1, 30.0), (int(F_ * 0.68), 30.0), (int(F_ * 0.74), 420.0),
                           (F_, 120.0)])
    _litek(R, 'pilot_lamp', [(1, 1.0), (int(F_ * 0.68), 1.0), (int(F_ * 0.75), 16.0), (F_, 5.5)])
    _lite(R, 'pool', 1.15)
    _lite(R, 'key', 0.7)
    _lite(R, 'accent', 1.0)
    _lite(R, 'macro', 0.60)


def d_groove(R, F_):
    """Close enough to see the relief. Let the specular do the acting."""
    p = R['pivot']
    p.rotation_euler = (0, math.radians(-0.15), math.radians(1.2))
    _lite(R, 'pool', 1.30)
    _lite(R, 'key', 0.80)
    _lite(R, 'accent', 1.20)
    _lite(R, 'violet', 1.15)
    _lite(R, 'macro', 0.30)


def d_quantize(R, F_):
    """Noise auditions for the beat: motes drift, then the grid answers and
    what is left is a ring turning with the record."""
    p = R['pivot']
    p.rotation_euler = (0, math.radians(-0.15), math.radians(1.2))
    dx, dy, dz = DECK
    z0 = dz + 0.062 + 0.031
    lock = int(F_ * 0.52)
    import random
    random.seed(84)
    m = H.emissive('MoteM', GREEN, 22.0)
    for i in range(46):
        a = TAU * i / 46.0
        r = 0.052 + (i % 7) * 0.0135
        sx = dx + math.cos(a) * r
        sy = dy + math.sin(a) * r
        jx = sx + random.uniform(-0.075, 0.075)
        jy = sy + random.uniform(-0.075, 0.075)
        jz = z0 + random.uniform(0.010, 0.115)
        o = H.sphere(loc=(jx, jy, jz), r=0.0016, segs=8, rings=5, name='Mote%d' % i)
        H.assign(o, m)
        keep = (i % 5) != 0
        H.keyframe(o, 'location', [(1, jx), (lock, sx), (F_, sx)], index=0)
        H.keyframe(o, 'location', [(1, jy), (lock, sy), (F_, sy)], index=1)
        H.keyframe(o, 'location',
                   [(1, jz), (lock, z0 + 0.012), (F_, z0 + 0.012)], index=2)
        if not keep:                      # what resists the grid is gone
            H.keyframe(o, 'scale', [(1, 1.0), (int(lock * 0.9), 1.0),
                                    (lock, 0.001), (F_, 0.001)], index=0)
            H.keyframe(o, 'scale', [(1, 1.0), (int(lock * 0.9), 1.0),
                                    (lock, 0.001), (F_, 0.001)], index=1)
            H.keyframe(o, 'scale', [(1, 1.0), (int(lock * 0.9), 1.0),
                                    (lock, 0.001), (F_, 0.001)], index=2)
    keys = [(1, 12.0)]
    for f in _beats(F_):
        if f > lock:
            keys += [(max(1, f - 2), 12.0), (f, 90.0), (min(F_, f + 5), 12.0)]
    _emit(m, keys)
    _lite(R, 'pool', 1.0)
    _lite(R, 'key', 0.72)


def d_lanes(R, F_):
    """Bass, mids, highs: one tangle pulls apart into three clean channels."""
    p = R['pivot']
    p.rotation_euler = (0, math.radians(-0.15), math.radians(1.2))
    cols = [(0.10, 0.42, 1.0), GREEN, (1.0, 0.42, 0.22)]
    split = int(F_ * 0.46)
    # behind the deck, not through it — the bench band in front of the plinth
    # is already occupied by the thing the whole film is about
    y0 = 1.83
    for li, col in enumerate(cols):
        m = H.emissive('LaneM%d' % li, col, 30.0)
        y_end = y0 + (li - 1) * 0.11
        o = F.box(loc=(0.0, y0, BENCH_Z + 0.0035), dims=(2.30, 0.009, 0.003),
                  name='Lane%d' % li, mat=m)
        H.keyframe(o, 'location', [(1, y0), (split, y_end), (F_, y_end)], index=1)
        _emit(m, [(1, 3.0), (split, 20.0), (F_, 15.0)])
        H.point(loc=(0.0, y_end, BENCH_Z + 0.06), energy=2.4, color=col, radius=0.15)
    _lite(R, 'pool', 0.85)
    _lite(R, 'key', 0.65)
    _lite(R, 'accent', 1.0)


def d_canyon(R, F_):
    """Sixteen bars in one unbroken take: every marker fires on its downbeat
    as the lens passes it."""
    for i, m in R['markers']:
        t = i / float(max(1, len(R['markers']) - 1))
        f = max(1, int(t * F_))
        _emit(m, [(1, 3.0), (max(1, f - 6), 3.0), (f, 55.0), (min(F_, f + 10), 3.0), (F_, 3.0)])


def d_t01(R, F_):
    """Consent downbeat: seven faders ride, the send fader never moves, and the
    consent lamp only goes green when a hand is implied — never on its own."""
    cx, cy = R['console_xy']
    for i, cap in enumerate(R['faders'][:7]):
        y0 = cy - 0.050
        y1 = cy - 0.050 + 0.030 + (i % 3) * 0.018
        H.keyframe(cap, 'location', [(1, y0), (int(F_ * 0.55), y1), (F_, y1)], index=1)
    keys = [(1, 1.4)]
    for f in _beats(F_):
        keys += [(max(1, f - 2), 1.4), (f, 26.0), (min(F_, f + 4), 1.4)]
    for m in R['fader_leds'][:7]:
        _emit(m, keys)
    _emit(R['send_mat'], [(1, 14.0), (F_, 14.0)])       # red, welded, all shot
    _lite(R, 'pool', 0.90)
    _lite(R, 'key', 0.62)
    _lite(R, 'macro', 0.9)
    _lite(R, 'accent', 0.85)
    _lite(R, 'macro', 0.9)


def d_t02(R, F_):
    """Delete is a word: the red gate holds until a key is pressed, and even
    then it only turns amber — nothing here opens by itself."""
    press = int(F_ * 0.58)
    k = R['keys'][6]
    z = k.location[2]
    H.keyframe(k, 'location',
               [(1, z), (press, z - 0.0035), (min(F_, press + 9), z), (F_, z)], index=2)
    _emit(R['gate_mat'], [(1, 6.0), (press, 6.0), (press + 4, 30.0), (F_, 16.0)])
    _litek(R, 'gate_lamp', [(1, 1.0), (press, 1.0), (press + 4, 4.6), (F_, 2.4)])
    _lite(R, 'pool', 0.90)
    _lite(R, 'key', 0.62)


def d_t03(R, F_):
    """Sixty hertz of truth: the meters step on a fixed clock, not on the art.
    At 24 fps a 60 Hz tick lands every 0.4 frames, so the visible truth is the
    two-and-a-half-per-frame shimmer of a real sampled meter."""
    for u, s, m in R['segs']:
        keys = []
        for f in range(1, F_ + 1, 2):
            phase = (f / 24.0) * 60.0 + u * 0.7
            lvl = 0.5 + 0.5 * math.sin(phase * 0.55 + s * 0.35)
            on = lvl * 9 > s
            keys.append((f, (3.5 if s < 6 else 6.0) if on else 0.0))
        _emit(m, keys)
    _lite(R, 'practical', 1.5)
    _lite(R, 'pool', 0.45)
    _lite(R, 'key', 0.50)


def d_master(R, F_):
    """Suspense by subtraction: the colours drain out of the room and one
    fader rides to unity under a single lamp."""
    _litek(R, 'accent', [(1, 0.95), (int(F_ * 0.55), 0.07), (F_, 0.03)])
    _litek(R, 'violet', [(1, 0.90), (int(F_ * 0.55), 0.08), (F_, 0.04)])
    _litek(R, 'practical', [(1, 1.0), (int(F_ * 0.6), 0.18), (F_, 0.10)])
    _litek(R, 'key', [(1, 0.85), (int(F_ * 0.5), 0.55), (F_, 0.42)])
    _litek(R, 'pool', [(1, 1.0), (int(F_ * 0.5), 0.95), (F_, 0.90)])
    _lite(R, 'macro', 0.8)
    cx, cy = R['console_xy']
    cap = R['faders'][3]
    y0 = cy - 0.050
    H.keyframe(cap, 'location', [(1, y0), (int(F_ * 0.82), y0 + 0.072), (F_, y0 + 0.072)], index=1)
    for i, m in enumerate(R['fader_leds']):
        _emit(m, [(1, 2.0 if i == 3 else 1.4), (int(F_ * 0.55), 2.0 if i == 3 else 0.0),
                  (F_, 0.0 if i != 3 else 2.4)])
    _emit(R['send_mat'], [(1, 14.0), (int(F_ * 0.86), 14.0), (int(F_ * 0.90), 2.0), (F_, 2.0)])
    H.keyframe(R['send_lamp'].data, 'energy',
               [(1, 0.0), (int(F_ * 0.88), 0.0), (int(F_ * 0.93), 5.5), (F_, 3.8)])
    for _u, _s, m in R['segs']:
        _emit(m, [(1, 1.6), (int(F_ * 0.6), 0.0), (F_, 0.0)])


def d_chorus(R, F_):
    """The chorus is data-lit: thirty tracks return around the platter, each
    one lighting on its own beat, and the room comes back with them."""
    dx, dy, dz = DECK
    z0 = dz + 0.062 + 0.032
    _litek(R, 'accent', [(1, 0.05), (int(F_ * 0.4), 0.85), (F_, 1.15)])
    _litek(R, 'violet', [(1, 0.06), (int(F_ * 0.45), 1.00), (F_, 1.25)])
    _litek(R, 'key', [(1, 0.42), (F_, 0.95)])
    _litek(R, 'pool', [(1, 0.85), (F_, 1.10)])
    for i in range(30):
        a = TAU * i / 30.0
        r = 0.198
        h = 0.020 + 0.052 * (0.35 + 0.65 * abs(math.sin(i * 1.7)))
        col = GREEN if i % 3 else (0.28, 0.92, 0.50)
        m = H.emissive('Ch%d' % i, col, 0.0)
        F.box(loc=(dx + math.cos(a) * r, dy + math.sin(a) * r, z0 + h / 2),
              dims=(0.0075, 0.0075, h), name='Ch%d' % i, mat=m)
        f = max(1, int(F_ * (0.06 + 0.80 * i / 30.0)))
        _emit(m, [(1, 0.0), (max(1, f - 3), 0.0), (f, 30.0), (min(F_, f + 14), 9.0),
                  (F_, 9.0)])
    _litek(R, 'pilot_lamp', [(1, 2.3), (F_, 9.0)])
    _emit(R['pilot_mat'], [(1, 60.0), (F_, 180.0)])


def d_outro(R, F_):
    """Silence, reconstructed: the arm lifts, the room drains, one green line
    is the last thing left."""
    p = R['pivot']
    H.keyframe(p, 'rotation_euler',
               [(1, math.radians(-0.15)), (int(F_ * 0.34), math.radians(-6.5)),
                (F_, math.radians(-7.0))], index=1)
    H.keyframe(p, 'rotation_euler',
               [(1, math.radians(1.2)), (int(F_ * 0.42), math.radians(20.0)),
                (F_, math.radians(26.0))], index=2)
    _litek(R, 'accent', [(1, 1.05), (int(F_ * 0.7), 0.16), (F_, 0.05)])
    _litek(R, 'violet', [(1, 1.00), (int(F_ * 0.7), 0.14), (F_, 0.05)])
    _litek(R, 'key', [(1, 0.80), (int(F_ * 0.75), 0.18), (F_, 0.08)])
    _litek(R, 'pool', [(1, 1.00), (int(F_ * 0.72), 0.22), (F_, 0.06)])
    _litek(R, 'practical', [(1, 1.0), (int(F_ * 0.8), 0.15), (F_, 0.07)])
    _emit(R['line_mat'], [(1, 5.0), (int(F_ * 0.6), 6.6), (F_, 8.4)])
    _litek(R, 'line_lamp', [(1, 1.0), (F_, 1.9)])
    _emit(R['pilot_mat'], [(1, 120.0), (int(F_ * 0.8), 40.0), (F_, 30.0)])
    for _u, _s, m in R['segs']:
        _emit(m, [(1, 1.4), (int(F_ * 0.55), 0.0), (F_, 0.0)])
    for m in R.get('fader_leds', []):
        _emit(m, [(1, 1.6), (int(F_ * 0.5), 0.0), (F_, 0.0)])


DRESS = {'line': d_line, 'pulse': d_pulse, 'room': d_room, 'arm': d_arm,
         'needle': d_needle, 'groove': d_groove, 'quantize': d_quantize,
         'lanes': d_lanes, 'canyon': d_canyon, 't01': d_t01, 't02': d_t02,
         't03': d_t03, 'master': d_master, 'chorus': d_chorus, 'outro': d_outro}


# ═══════════════════════════════ render ═══════════════════════════════

def main():
    n = H.shot_no()
    spec = SHOTS[n - 1]
    frames = F.shot_frames(spec)

    H.setup_gpu()
    # Exposure is per shot, like a stop pull on the day. One rig cannot serve a
    # 24 mm wide of a dark room and a 135 mm macro of a glossy disc under the
    # same practical — the wide wants two stops the macro would blow out on.
    sc = F.cine_init(frames=frames, samples=int(os.environ.get('SAMPLES', 112)),
                     width=1920, look='AgX - High Contrast', exposure=spec.get('ev', 0.35))
    # Bounce depth is the third lever. Twelve bounces in a concrete box lit by
    # six sources buys almost nothing a viewer can name and costs real minutes.
    b = int(os.environ.get('BOUNCE', '12'))
    sc.cycles.max_bounces = b
    sc.cycles.diffuse_bounces = min(b, 4)
    sc.cycles.glossy_bounces = min(b, 4)
    sc.cycles.transmission_bounces = min(b, 4)

    if spec['set'] == 'canyon':
        R = build_canyon()
    else:
        R = build_room()
        rest(R, frames)
    dress = DRESS.get(spec['name'])
    if dress:
        dress(R, frames)

    cam, tgt = H.camera(loc=spec['keys'][0][1], target=spec['keys'][0][2],
                        focal=spec.get('focal', [(0, 50)])[0][1],
                        fstop=spec.get('fstop', 2.8))
    F.hold(cam, tgt, spec, frames)

    # No compositor vignette: harness builds it from an EllipseMask through a
    # Blur whose size does not take on 5.x, so instead of a falloff it stamps a
    # hard-edged oval across the middle of the frame. The real lens shading
    # comes from the Lensdist fit and the rig, which is where it belongs.
    H.grade(hi=(1.02, 0.995, 1.03), mid=(1.0, 1.0, 1.0), lo=(0.004, 0.001, 0.006),
            glare=0.13, vignette=0.0, dispersion=0.007)

    out = H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/spot-film-s%d' % n)
    print('FILM_SHOT %d %s frames=%d' % (n, spec['name'], frames))
    H.render(out)


main()

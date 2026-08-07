# -*- coding: utf-8 -*-
"""THE SPOTIFY ROOM — the listening lounge, built to the six Wan keyframes.

The keyframes are an art direction, not a blueprint, and they do not agree with
each other: the ceiling is a black grid in one frame and bright slats in
another, the guitar is in three of six, and every frame re-invents the shelf
contents. So this builds the room all six are approximations OF, once, and then
the camera can move through it without the set changing underneath the cut.

What is stable across all six, and therefore load-bearing here:

    back wall     vertical fluted slats, green wash on top fading violet
    the mark      one big emissive Spotify disc, centred, ~0.95 m
    flanks        two tall open shelf columns, LED under every shelf,
                  alternating green / violet
    below         a long low media console, turntable on top, vinyl beneath
    left wall     wall TV over a desk run: ultrawide, keys, monitors, mic
    right wall    two framed posters, neon script, neon headphones
    centre        charcoal sectional, low table with a lit logo inlay, shag rug
    ceiling       dark coffer with a violet perimeter cove
    floor         warm oak plank

True metric throughout: a 12" LP is 0.152 m in radius, the desk is 0.745 m
high, the ceiling is 2.95 m. The camera is a physical camera, so the room has
to be the size it claims or the depth of field lies.

    CHECK=1 blender --background --factory-startup --python lounge.py
"""
import bpy, math, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H
import filmlib as F

TAU = math.pi * 2

# ── palette, measured off the keyframes ──
GREEN = (0.055, 0.760, 0.290)      # Spotify green, the only saturated green
VIOLET = (0.480, 0.110, 0.980)     # shelf + cove wash
MAGENTA = (0.820, 0.120, 0.760)
AMBER = (1.000, 0.620, 0.260)      # the two practical orbs
CYAN = (0.180, 0.680, 0.900)       # gear displays

# ── room, in metres ──
RW, RD, RH = 6.00, 7.60, 2.95
LX, RX = -RW / 2, RW / 2           # left / right wall inner faces
BY, FY = RD / 2, -RD / 2           # back (hero) wall, front wall

SLAT_W = 3.40                      # the fluted panel between the shelf columns
SLAT_H = 2.72
COL_W = 1.12                       # each flanking shelf column
DISC_R = 0.475                     # the mark: 0.95 m across
DISC_Z = 1.98
CONSOLE = (3.30, 0.46, 0.58)       # w, d, h
DESK_Z = 0.745
LP_R = 0.152


# ═══════════════════════════════ materials ═══════════════════════════════

def mats():
    M = {}
    M['wall'] = H.pbr('Wall', base=(0.030, 0.030, 0.034), rough=0.88)
    M['ceil'] = H.pbr('Ceil', base=(0.022, 0.022, 0.026), rough=0.82)
    M['slat'] = H.pbr('Slat', base=(0.045, 0.040, 0.036), rough=0.55)
    M['oak'] = H.pbr('Oak', base=(0.190, 0.112, 0.058), rough=0.38, spec=0.5)
    M['black'] = H.pbr('Black', base=(0.016, 0.016, 0.018), rough=0.40)
    M['steel'] = H.pbr('Steel', base=(0.055, 0.055, 0.060), rough=0.34, metal=1.0)
    M['fabric'] = H.pbr('Fabric', base=(0.030, 0.032, 0.036), rough=0.94)
    M['rug'] = H.pbr('Rug', base=(0.020, 0.019, 0.021), rough=0.98)
    M['glass'] = H.pbr('Glass', base=(0.85, 0.88, 0.90), rough=0.06,
                       transmission=1.0, ior=1.45)
    M['screen'] = H.pbr('ScreenBez', base=(0.012, 0.012, 0.014), rough=0.35)
    # Emissives. Strength is what the camera meters, so these are the real
    # light sources in the room — there is no key light in here at all.
    M['green'] = H.emissive('EGreen', GREEN, 9.0)
    M['greenSoft'] = H.emissive('EGreenSoft', GREEN, 3.4)
    M['violet'] = H.emissive('EViolet', VIOLET, 3.0)
    # The shelf strips are the second-brightest thing in every keyframe and
    # they are what makes the flanking towers read as depth rather than as two
    # dark rectangles, so they run hotter than the cove.
    M['ledG'] = H.emissive('ELedG', GREEN, 22.0)
    M['ledV'] = H.emissive('ELedV', VIOLET, 16.0)
    # The bay glow is a WASH, not a source: at 1.5 the bays clipped to pastel
    # and ate the gear silhouettes that are the point of the towers.
    M['bayMat'] = H.pbr('BayBack', base=(0.085, 0.085, 0.092), rough=0.78)
    M['greenLo'] = H.emissive('EGreenLo', GREEN, 2.2)
    # A logo printed on a cushion is ink, not a light. Emissive marks on the
    # sofa read as two floating green discs.
    M['ink'] = H.pbr('InkGreen', base=(0.045, 0.290, 0.115), rough=0.86)
    M['magenta'] = H.emissive('EMagenta', MAGENTA, 5.0)
    M['amber'] = H.emissive('EAmber', AMBER, 14.0)
    M['cyan'] = H.emissive('ECyan', CYAN, 6.0)
    M['neon'] = H.emissive('ENeon', GREEN, 26.0)
    return M


# ═══════════════════════════════ set pieces ═══════════════════════════════

def _shell(M):
    """Floor, four walls, ceiling. Walls are boxes not planes: the camera gets
    close enough to the slat panel that a zero-thickness wall shows its edge."""
    t = 0.12
    F.box(loc=(0, 0, -t / 2), dims=(RW + 2 * t, RD + 2 * t, t), name='Floor', mat=M['oak'])
    F.box(loc=(0, 0, RH + t / 2), dims=(RW + 2 * t, RD + 2 * t, t), name='Ceil', mat=M['ceil'])
    F.box(loc=(LX - t / 2, 0, RH / 2), dims=(t, RD, RH), name='WallL', mat=M['wall'])
    F.box(loc=(RX + t / 2, 0, RH / 2), dims=(t, RD, RH), name='WallR', mat=M['wall'])
    F.box(loc=(0, BY + t / 2, RH / 2), dims=(RW, t, RH), name='WallB', mat=M['wall'])
    F.box(loc=(0, FY - t / 2, RH / 2), dims=(RW, t, RH), name='WallF', mat=M['wall'])
    _planks(M)


def _planks(M):
    """Plank seams. A single flat oak plane reads as lino under a raking LED —
    the seams are what tell the eye the floor is wood before the grain does."""
    n, w = int(RW / 0.19), 0.19
    first = F.box(loc=(-RW / 2 + w / 2, 0, 0.0015), dims=(0.004, RD, 0.003),
                  name='Seam', mat=M['black'])
    m = first.modifiers.new('Array', 'ARRAY')
    m.count, m.use_relative_offset, m.use_constant_offset = n, False, True
    m.constant_offset_displace = (w, 0, 0)
    return first


def _coffer(M):
    """Dark coffered ceiling with the violet perimeter cove. The cove is the
    only thing lighting the upper third of the room, so it is a real emitter."""
    for (x, y, dx, dy) in ((0, BY - 0.30, RW - 1.0, 0.10),
                           (0, FY + 0.30, RW - 1.0, 0.10),
                           (LX + 0.30, 0, 0.10, RD - 1.0),
                           (RX - 0.30, 0, 0.10, RD - 1.0)):
        F.box(loc=(x, y, RH - 0.055), dims=(dx, dy, 0.045), name='Cove',
              mat=M['violet'])
    # the coffer grid itself, shallow and near-black
    beam = F.box(loc=(0, FY + 0.9, RH - 0.09), dims=(RW - 1.4, 0.07, 0.09),
                 name='Beam', mat=M['ceil'])
    m = beam.modifiers.new('Array', 'ARRAY')
    m.count, m.use_relative_offset, m.use_constant_offset = 9, False, True
    m.constant_offset_displace = (0, 0.62, 0)


def _slatwall(M):
    """The hero wall: vertical battens with a real gap, so the green wash from
    the strip above rakes down them and every slat casts its own shadow."""
    slat, gap, depth = 0.046, 0.034, 0.055
    pitch = slat + gap
    n = int(SLAT_W / pitch)
    x0 = -SLAT_W / 2 + slat / 2
    first = F.box(loc=(x0, BY - depth / 2 - 0.002, SLAT_H / 2 + 0.04),
                  dims=(slat, depth, SLAT_H), name='Batten', mat=M['slat'],
                  bevel=0.003, segments=2)
    m = first.modifiers.new('Array', 'ARRAY')
    m.count, m.use_relative_offset, m.use_constant_offset = n, False, True
    m.constant_offset_displace = (pitch, 0, 0)
    # dark backing so the gaps read as depth, not as holes to the wall colour
    F.box(loc=(0, BY - 0.004, SLAT_H / 2 + 0.04), dims=(SLAT_W, 0.02, SLAT_H),
          name='SlatBack', mat=M['black'])
    # wash strip along the top edge of the panel
    F.box(loc=(0, BY - 0.10, SLAT_H + 0.055), dims=(SLAT_W - 0.06, 0.05, 0.028),
          name='SlatWash', mat=M['green'])


def _arc_band(name, cz, r, t, half, mat, segs=56, depth=0.016, base=-math.pi / 2):
    """One bar of the mark, as a filled arc band in the local XZ plane facing
    -Y.

    First attempt used a bevelled NURBS circle trimmed with bevel_factor_start
    / bevel_factor_end. Blender will not trim a CYCLIC spline — the factors are
    silently ignored — so all three bars came out as closed rings and the mark
    rendered as an eye. Explicit geometry has no such opinion.
    """
    import bmesh
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    ri, ro = r - t / 2.0, r + t / 2.0
    a0, a1 = base - half, base + half
    rows = []
    for i in range(segs + 1):
        a = a0 + (a1 - a0) * i / segs
        c, s = math.cos(a), math.sin(a)
        rows.append((bm.verts.new((ri * c, 0.0, cz + ri * s)),
                     bm.verts.new((ro * c, 0.0, cz + ro * s))))
    for i in range(segs):
        bm.faces.new((rows[i][0], rows[i + 1][0], rows[i + 1][1], rows[i][1]))
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    sol = ob.modifiers.new('Solid', 'SOLIDIFY')
    sol.thickness, sol.offset = depth, 0.0
    ob.data.materials.append(mat)
    return ob


# (centre z, radius, thickness, half-angle), all as fractions of the disc
# radius. MEASURED off the reference frame, not recalled: the bars SAG — ends
# high, middle low, struck from a centre ABOVE the disc. Built the other way up
# they are a wifi symbol, which is what the second check render produced.
# Half-widths come out at 0.70 / 0.64 / 0.51 R and each bar dips about 0.10 R.
BARS = ((2.740, 2.280, 0.115, 0.312),
        (2.190, 2.100, 0.105, 0.310),
        (1.240, 1.490, 0.095, 0.349))


def _mark(M, loc, r, mat_disc, mat_bar, name='Mark', rot=(0, 0, 0)):
    """Disc plus three bars, parented to one empty so the whole mark can be
    aimed at a wall, a screen, a cushion or the table top with one rotation.
    Built facing -Y (the back wall case), which is the room's default."""
    parts = []
    d = H.cyl(loc=(0, 0, 0), r=r, depth=0.030, rot=(math.pi / 2, 0, 0),
              verts=96, name=name + 'Disc')
    H.assign(d, mat_disc)
    parts.append(d)
    for k, (cz, rf, tf, half) in enumerate(BARS):
        b = _arc_band('%sBar%d' % (name, k), cz * r, rf * r, tf * r, half,
                      mat_bar, depth=min(0.016, r * 0.09))
        b.location = (0, -0.020 - r * 0.02, 0)
        parts.append(b)
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.location, e.rotation_euler = loc, rot
    for p in parts:
        p.parent = e
    return e


def _shelf_column(M, cx):
    """One flanking tower: four shelves, an LED strip under each, alternating
    green and violet exactly as the frames do."""
    inner, side = 0.030, 0.028
    H_COL = 2.62
    for sx in (cx - COL_W / 2, cx + COL_W / 2):
        F.box(loc=(sx, BY - 0.19, H_COL / 2 + 0.04), dims=(side, 0.38, H_COL),
              name='ColPost', mat=M['steel'])
    for i, z in enumerate((0.46, 1.06, 1.66, 2.26)):
        F.box(loc=(cx, BY - 0.19, z), dims=(COL_W, 0.36, inner),
              name='Shelf', mat=M['black'])
        # The strip goes on the FRONT lip, pointing back into the bay. First
        # pass buried it at y = BY-0.355 — behind the shelf front AND under the
        # shelf — so the towers rendered as two dark rectangles at 22 strength.
        F.box(loc=(cx, BY - 0.352, z - 0.026), dims=(COL_W - 0.08, 0.020, 0.014),
              name='ShelfLed',
              mat=M['ledG'] if i % 2 == 0 else M['ledV'])
        # The bay back is an ORDINARY dark surface that the strip above lights.
        # It was an emissive panel first, which is why the towers read as flat
        # saturated rectangles: a uniform emitter has no falloff, and the
        # gradient down the back of each bay is the whole look in the
        # reference. Let Cycles do it and the gradient comes for free.
        F.box(loc=(cx, BY - 0.045, z + 0.29), dims=(COL_W - 0.05, 0.010, 0.50),
              name='BayBack', mat=M['bayMat'])
        _shelf_gear(M, cx, z + inner / 2, i)
    # Against the wall. This was at BY-0.375 — the NEAREST face, not the
    # furthest — so a black panel sat in front of every glowing bay and the
    # towers rendered dark no matter how hot the strips ran.
    F.box(loc=(cx, BY - 0.012, H_COL / 2 + 0.04), dims=(COL_W, 0.02, H_COL),
          name='ColBack', mat=M['black'])


def _shelf_gear(M, cx, z, i):
    """What stands on the shelves. Every keyframe puts different objects here,
    so none of them is canon — what IS canon is that the towers are occupied
    and that the silhouettes break the LED line. Deliberately generic: boxes,
    discs, a slab, a plant, sized like real gear."""
    seed = (int(cx * 7) + i * 3) % 4
    if seed == 0:
        F.box(loc=(cx - 0.26, BY - 0.20, z + 0.085), dims=(0.30, 0.24, 0.17),
              name='GearBox', mat=M['black'], bevel=0.004)
        F.box(loc=(cx - 0.26, BY - 0.325, z + 0.085), dims=(0.10, 0.006, 0.018),
              name='GearLed', mat=M['cyan'])
        d = H.cyl(loc=(cx + 0.22, BY - 0.21, z + 0.150), r=0.145, depth=0.006,
                  rot=(math.pi / 2, 0, 0.2), verts=48, name='ShelfLP')
        H.assign(d, M['black'])
    elif seed == 1:
        F.box(loc=(cx + 0.20, BY - 0.20, z + 0.115), dims=(0.36, 0.26, 0.23),
              rot=(0, 0, 0.12), name='GearAmp', mat=M['steel'], bevel=0.004)
        _plant(M, (cx - 0.28, BY - 0.19, z), 0.30)
    elif seed == 2:
        for k, dx in enumerate((-0.30, -0.06, 0.20)):
            F.box(loc=(cx + dx, BY - 0.21, z + 0.105), dims=(0.15, 0.15, 0.21),
                  rot=(0, 0, 0.1 * k), name='GearCan', mat=M['black'],
                  bevel=0.006)
        F.box(loc=(cx + 0.20, BY - 0.33, z + 0.105), dims=(0.07, 0.006, 0.05),
              name='GearLed2', mat=M['green'])
    else:
        F.box(loc=(cx, BY - 0.20, z + 0.055), dims=(0.62, 0.28, 0.11),
              name='GearSlab', mat=M['black'], bevel=0.005)
        _plant(M, (cx + 0.30, BY - 0.19, z + 0.11), 0.26)


def _plant(M, loc, h):
    """A pot and a few blades. Real foliage is not worth the geometry at this
    distance; the silhouette and the green bounce are the whole contribution."""
    x, y, z = loc
    leaf = H.pbr('Leaf%d' % int((x * 100 + z * 10)), base=(0.045, 0.135, 0.050),
                 rough=0.62)
    F.box(loc=(x, y, z + h * 0.13), dims=(h * 0.30, h * 0.30, h * 0.26),
          name='Pot', mat=M['steel'], bevel=0.004)
    for k in range(7):
        a = TAU * k / 7.0
        F.box(loc=(x + math.cos(a) * h * 0.16, y + math.sin(a) * h * 0.16,
                   z + h * 0.58),
              dims=(h * 0.055, h * 0.055, h * 0.70),
              rot=(math.sin(a) * 0.45, math.cos(a) * 0.45, 0),
              name='Blade', mat=leaf)


def _console(M):
    """The long low media unit under the mark: a top deck, an open vinyl bay."""
    w, d, h = CONSOLE
    y = BY - 0.28
    F.box(loc=(0, y, h), dims=(w, d, 0.038), name='ConTop', mat=M['black'],
          bevel=0.004)
    F.box(loc=(0, y, 0.035), dims=(w, d, 0.07), name='ConPlinth', mat=M['black'])
    for x in (-w / 2 + 0.02, 0, w / 2 - 0.02):
        F.box(loc=(x, y, h / 2), dims=(0.04, d, h - 0.10), name='ConRib',
              mat=M['black'])
    F.box(loc=(0, y + d / 2 - 0.02, h / 2), dims=(w, 0.03, h - 0.10),
          name='ConBack', mat=M['black'])
    # vinyl stored spine-out in the two open bays
    for sx in (-0.82, 0.82):
        rec = F.box(loc=(sx - 0.30, y - 0.03, 0.30), dims=(0.006, 0.31, 0.31),
                    name='Spine', mat=M['slat'])
        m = rec.modifiers.new('Array', 'ARRAY')
        m.count, m.use_relative_offset, m.use_constant_offset = 62, False, True
        m.constant_offset_displace = (0.0098, 0, 0)
    # the gear that glows in the centre bay
    F.box(loc=(0, y - 0.02, 0.22), dims=(0.92, 0.34, 0.11), name='Amp',
          mat=M['black'], bevel=0.003)
    F.box(loc=(0, y - 0.20, 0.22), dims=(0.30, 0.006, 0.030), name='AmpVU',
          mat=M['cyan'])
    F.box(loc=(-0.62, y - 0.20, 0.235), dims=(0.16, 0.006, 0.012), name='AmpG',
          mat=M['green'])


def _deck(M):
    """Turntable on the console top: plinth, platter, an LP, a tonearm."""
    top = CONSOLE[2] + 0.038 / 2
    y = BY - 0.30
    F.box(loc=(-0.46, y, top + 0.048), dims=(0.46, 0.38, 0.058), name='DeckBase',
          mat=M['black'], bevel=0.005)
    plat = H.cyl(loc=(-0.50, y - 0.01, top + 0.086), r=0.158, depth=0.020,
                 verts=72, name='Platter')
    H.assign(plat, M['steel'])
    lp = H.cyl(loc=(-0.50, y - 0.01, top + 0.098), r=LP_R, depth=0.002,
               verts=96, name='LP')
    H.assign(lp, M['black'])
    lbl = H.cyl(loc=(-0.50, y - 0.01, top + 0.0995), r=0.048, depth=0.0016,
                verts=48, name='LPLabel')
    H.assign(lbl, M['greenSoft'])
    F.box(loc=(-0.30, y + 0.13, top + 0.104), dims=(0.012, 0.26, 0.012),
          rot=(0, 0, -0.42), name='Tonearm', mat=M['steel'])
    # the receiver beside it
    F.box(loc=(0.42, y, top + 0.055), dims=(0.72, 0.34, 0.072), name='Recv',
          mat=M['black'], bevel=0.004)
    F.box(loc=(0.42, y - 0.172, top + 0.058), dims=(0.26, 0.006, 0.022),
          name='RecvVFD', mat=M['cyan'])


def _orb(M, x, mat):
    """The two practical globe lamps on the console — the only warm light."""
    y, z = BY - 0.34, CONSOLE[2] + 0.14
    F.box(loc=(x, y, CONSOLE[2] + 0.045), dims=(0.055, 0.055, 0.055),
          name='OrbBase', mat=M['steel'])
    o = H.sphere(loc=(x, y, z), r=0.058, segs=24, rings=12, name='Orb')
    H.assign(o, mat)
    return o


def _desk(M):
    """Left wall: the workstation run. Desk, ultrawide, keys, two monitors."""
    y0, y1 = -1.15, 2.15
    ln = y1 - y0
    cy = (y0 + y1) / 2
    x = LX + 0.40
    F.box(loc=(x, cy, DESK_Z), dims=(0.78, ln, 0.038), name='DeskTop',
          mat=M['black'], bevel=0.004)
    for yy in (y0 + 0.10, y1 - 0.10):
        F.box(loc=(x + 0.24, yy, DESK_Z / 2), dims=(0.06, 0.06, DESK_Z),
              name='DeskLeg', mat=M['steel'])
    # under-desk green spill (the PC), which is what lights the floor there
    F.box(loc=(x + 0.02, y0 + 0.55, 0.30), dims=(0.30, 0.44, 0.42),
          name='PC', mat=M['black'])
    F.box(loc=(x - 0.14, y0 + 0.55, 0.30), dims=(0.008, 0.36, 0.34),
          name='PCGlow', mat=M['green'])
    # curved ultrawide: a bent plane, not a flat one — the curve catches the
    # room's green on one end and violet on the other, which is the whole look
    scr = _curved_screen(M, (x - 0.08, cy + 0.15, DESK_Z + 0.29), 1.12, 0.30)
    F.box(loc=(x + 0.04, cy + 0.15, DESK_Z + 0.055), dims=(0.20, 0.24, 0.030),
          name='MonFoot', mat=M['steel'])
    F.box(loc=(x + 0.04, cy + 0.15, DESK_Z + 0.16), dims=(0.05, 0.05, 0.22),
          name='MonStem', mat=M['steel'])
    # keyboard, backlit
    F.box(loc=(x - 0.18, cy - 0.30, DESK_Z + 0.033), dims=(0.16, 0.44, 0.024),
          name='Keys', mat=M['black'], bevel=0.002)
    F.box(loc=(x - 0.18, cy - 0.30, DESK_Z + 0.021), dims=(0.19, 0.47, 0.006),
          name='KeyGlow', mat=M['greenSoft'])
    # Near-field monitors: the real cut-out prop if it is on disk, otherwise
    # the built box. The room has always had to render undressed.
    if not F.prop_path('lounge', 'monitor'):
        for yy, sc in ((y0 + 0.28, 1.15), (y1 - 0.55, 0.80)):
            _speaker(M, (x - 0.02, yy, DESK_Z + 0.038), sc)
    _boom(M, (x + 0.16, cy + 0.62, DESK_Z))


def _curved_screen(M, loc, w, h, segs=14, bow=0.10):
    """An ultrawide that is actually curved. Built from a strip of quads so it
    bends in plan; a flat card here reads as a poster of a monitor."""
    import bmesh
    me = bpy.data.meshes.new('Ultrawide')
    bm = bmesh.new()
    ring = []
    for i in range(segs + 1):
        t = i / segs - 0.5
        yy = t * w
        xx = bow * (1 - (2 * t) ** 2)
        ring.append((bm.verts.new((xx, yy, -h / 2)), bm.verts.new((xx, yy, h / 2))))
    for i in range(segs):
        bm.faces.new((ring[i][0], ring[i + 1][0], ring[i + 1][1], ring[i][1]))
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new('Ultrawide', me)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    mat = H.emissive('ScreenGlow', (0.155, 0.100, 0.340), 1.2)
    ob.data.materials.append(mat)
    H.shade_smooth(ob)
    return ob


def _speaker(M, loc, s=1.0):
    x, y, z = loc
    w, d, h = 0.19 * s, 0.24 * s, 0.31 * s
    F.box(loc=(x, y, z + h / 2), dims=(w, d, h), name='Spk', mat=M['black'],
          bevel=0.006)
    for dz, r in ((h * 0.16, 0.062 * s), (-h * 0.14, 0.085 * s)):
        c = H.cyl(loc=(x - w / 2 - 0.004, y, z + h / 2 + dz), r=r, depth=0.012,
                  rot=(0, math.pi / 2, 0), verts=32, name='Cone')
        H.assign(c, M['slat'])
    return None


def _boom(M, base):
    """Mic on a boom. Thin repeating structure is exactly what image-to-3D
    fails at, so it is built, not imported."""
    x, y, z = base
    F.box(loc=(x, y, z + 0.02), dims=(0.09, 0.09, 0.04), name='BoomFoot',
          mat=M['steel'])
    F.box(loc=(x, y, z + 0.30), dims=(0.032, 0.032, 0.56), name='BoomPost',
          mat=M['steel'])
    F.box(loc=(x - 0.26, y - 0.05, z + 0.56), dims=(0.52, 0.026, 0.026),
          rot=(0, 0.16, 0), name='BoomArm', mat=M['steel'])
    mic = H.cyl(loc=(x - 0.50, y - 0.05, z + 0.50), r=0.030, depth=0.15,
                rot=(0.5, 0, 0), verts=24, name='Mic')
    H.assign(mic, M['black'])


def _tv(M):
    """The wall screen over the desk. Emissive, because it lights the desk."""
    x = LX + 0.055
    F.box(loc=(x - 0.02, 1.42, 1.88), dims=(0.045, 1.86, 1.05), name='TVBez',
          mat=M['screen'], bevel=0.004)
    scr = F.box(loc=(x + 0.006, 1.42, 1.88), dims=(0.006, 1.80, 0.99),
                name='TVScreen')
    # Near-black, not a green field: in every keyframe the wall screen is a
    # dark panel carrying a bright mark, which is why the mark reads at all.
    H.assign(scr, H.emissive('TVGlow', (0.012, 0.040, 0.022), 1.1))
    # Left wall faces +X, so its reading direction is +Y: the mark goes at the
    # LOWER y and the text runs away from it. Getting this backwards mirrors
    # every glyph, which is exactly what the first check render did.
    _mark(M, (x + 0.026, 0.86, 1.94), 0.150, M['green'], M['black'],
          name='TVMark', rot=(0, 0, math.pi / 2))
    _text(M, 'The Spotify Room', (x + 0.026, 1.72, 1.92), 0.150, M['greenSoft'],
          rot=(math.pi / 2, 0, math.pi / 2), name='TVText')


def _text(M, body, loc, size, mat, rot=(math.pi / 2, 0, 0), name='Text',
          extrude=0.006, align='CENTER'):
    cu = bpy.data.curves.new(name, 'FONT')
    cu.body = body
    cu.size = size
    cu.extrude = extrude
    cu.align_x = align
    cu.align_y = 'CENTER'
    ob = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = rot
    ob.data.materials.append(mat)
    return ob


def _right_wall(M):
    """Posters, the neon script, the neon headphones."""
    x = RX - 0.03
    _poster_wave(M, x, 1.34, 1.74)
    _poster_vinyl(M, x, 0.40, 1.74)
    # "Listening is everything" — a real neon, so it lights the sofa. Right
    # wall faces -X, so its reading direction is -Y: the mirror of the TV.
    _text(M, 'Listening is everything', (x - 0.02, -0.30, 1.46), 0.150,
          M['neon'], rot=(math.pi / 2, 0, -math.pi / 2), name='NeonScript',
          extrude=0.012)
    _headphone_neon(M, (x - 0.03, 2.45, 2.02))


def _frame(M, x, y, z, w=0.72, h=1.02, b=0.028):
    """A BORDER, not a slab, and it returns the depth the artwork goes at.

    Built as one solid 30 mm box the first time, with the art and every wave
    rule and groove drawn inside that box — so the frame swallowed all of it
    and both posters rendered as blank rectangles.
    """
    fx = x - 0.014
    for (dy, dz, dw, dh) in ((0, h / 2 - b / 2, w, b),
                             (0, -h / 2 + b / 2, w, b),
                             (-w / 2 + b / 2, 0, b, h - 2 * b),
                             (w / 2 - b / 2, 0, b, h - 2 * b)):
        F.box(loc=(fx, y + dy, z + dz), dims=(0.028, dw, dh), name='FrameBar',
              mat=M['black'], bevel=0.003)
    back = F.box(loc=(x - 0.005, y, z), dims=(0.006, w - 2 * b, h - 2 * b),
                 name='ArtBack')
    H.assign(back, H.emissive('EArtBack%d' % int(y * 100), (0.012, 0.014, 0.020), 0.6))
    return x - 0.012


def _poster_wave(M, x, y, z):
    """The DISCOVER WEEKLY poster: a stack of green wave rules whose length is
    modulated, plus the title. Flat emissive rectangles read as nothing."""
    ax = _frame(M, x, y, z)
    ink = H.emissive('EWave', GREEN, 4.2)
    n = 26
    for i in range(n):
        t = i / (n - 1.0)
        w = 0.56 * (0.30 + 0.70 * abs(math.sin(t * 5.4)) ** 0.8)
        F.box(loc=(ax, y, z + 0.30 - t * 0.62), dims=(0.005, w, 0.009),
              name='WaveRule', mat=ink)
    _text(M, 'DISCOVER', (ax, y + 0.24, z + 0.415), 0.052, ink,
          rot=(math.pi / 2, 0, -math.pi / 2), name='PWk1', extrude=0.003,
          align='LEFT')
    _text(M, 'WEEKLY', (ax, y + 0.24, z + 0.355), 0.052, ink,
          rot=(math.pi / 2, 0, -math.pi / 2), name='PWk2', extrude=0.003,
          align='LEFT')


def _poster_vinyl(M, x, y, z):
    """The record poster: concentric magenta grooves around a green label."""
    ax = _frame(M, x, y, z)
    ink = H.emissive('EGroove', MAGENTA, 3.4)
    for i in range(9):
        r = 0.072 + i * 0.028      # outermost 0.296 < the 0.332 half-opening
        t = H.torus(loc=(ax, y, z + 0.02), major=r, minor=0.0042,
                    rot=(0, math.pi / 2, 0), name='Groove')
        H.assign(t, ink)
    lab = H.cyl(loc=(ax, y, z + 0.02), r=0.072, depth=0.004,
                rot=(0, math.pi / 2, 0), verts=48, name='PLabel')
    H.assign(lab, H.emissive('EPLabel', GREEN, 3.0))


def _headphone_neon(M, loc):
    """The headphone sign: a half-ring band and two cups. Green band, magenta
    cups, exactly as the frames have it."""
    x, y, z = loc
    # base=+pi/2 so the band arcs OVER (a headband). The Spotify bars sag, so
    # _arc_band defaults to -pi/2; sharing the default made this a U.
    band = _arc_band('HpBand', 0.0, 0.30, 0.030, math.pi / 2, M['neon'],
                     depth=0.028, base=math.pi / 2)
    band.location = loc
    band.rotation_euler = (0, 0, -math.pi / 2)
    mag = H.emissive('EHp', MAGENTA, 22.0)
    for dy in (-0.30, 0.30):
        c = H.torus(loc=(x, y + dy, z - 0.055), major=0.085, minor=0.016,
                    rot=(0, math.pi / 2, 0), name='HpCup')
        H.assign(c, mag)


def _sofa(M):
    """L-sectional along the right wall with a chaise return toward camera."""
    seat_z = 0.40
    # A recessed plinth so the sofa sits ON the floor instead of growing out of
    # it, then the frame above it. One slab reads as a bench.
    F.box(loc=(2.05, 0.55, 0.055), dims=(0.92, 3.16, 0.11), name='SofaPlinth',
          mat=M['black'], bevel=0.01)
    F.box(loc=(2.05, 0.55, 0.265), dims=(1.05, 3.30, 0.31), name='SofaFrame',
          mat=M['fabric'], bevel=0.03)
    F.box(loc=(2.46, 0.55, 0.72), dims=(0.22, 3.30, 0.60), name='SofaBackRest',
          mat=M['fabric'], bevel=0.03)
    for yy in (2.06, -1.00):                                     # arms
        F.box(loc=(2.08, yy, 0.56), dims=(1.00, 0.24, 0.28), name='SofaArm',
              mat=M['fabric'], bevel=0.06, segments=4)
    # separate seat cushions with a real gap between them, and back cushions
    # that lean — the gaps are what make it read as upholstery at 24 mm
    for yy in (-0.42, 0.54, 1.50):
        F.box(loc=(2.00, yy, 0.475), dims=(0.94, 0.90, 0.14), name='SeatCush',
              mat=M['fabric'], bevel=0.045, segments=4)
        F.box(loc=(2.34, yy, 0.755), dims=(0.20, 0.88, 0.42), rot=(0.13, 0, 0),
              name='BackCush', mat=M['fabric'], bevel=0.05, segments=4)
    # chaise return
    F.box(loc=(1.20, -1.42, 0.055), dims=(2.44, 0.92, 0.11), name='ChaisePlinth',
          mat=M['black'], bevel=0.01)
    F.box(loc=(1.20, -1.42, 0.265), dims=(2.60, 1.05, 0.31), name='ChaiseFrame',
          mat=M['fabric'], bevel=0.03)
    for dx in (-0.62, 0.62):
        F.box(loc=(1.20 + dx, -1.42, 0.475), dims=(1.16, 0.98, 0.14),
              name='ChaiseCush', mat=M['fabric'], bevel=0.045, segments=4)
    # the green throw over the chaise — the one soft warm-ish note
    F.box(loc=(0.55, -1.55, 0.565), dims=(0.62, 0.86, 0.055), rot=(0, 0.05, 0),
          name='Throw', mat=M['ink'], bevel=0.03, segments=3)
    # logo cushions
    for yy in (1.30, 0.15):
        # in FRONT of the back cushions (which now occupy x 2.24-2.44), not
        # buried inside them
        c = F.box(loc=(2.14, yy, 0.68), dims=(0.16, 0.46, 0.46), rot=(0.16, 0, 0),
                  name='Pillow', mat=M['fabric'], bevel=0.05, segments=4)
        _mark(M, (2.048, yy, 0.70), 0.115, M['ink'], M['fabric'],
              name='PillowMark%d' % int(yy * 100), rot=(0, 0, -math.pi / 2))


def _table(M):
    """Low table with the lit logo inlay — the brightest thing at floor level
    and the reason the rug reads at all."""
    x, y = 0.45, 0.30
    F.box(loc=(x, y, 0.345), dims=(1.52, 0.78, 0.042), name='TableTop',
          mat=M['black'], bevel=0.005)
    for (dx, dy) in ((-0.62, -0.28), (0.62, -0.28), (-0.62, 0.28), (0.62, 0.28)):
        F.box(loc=(x + dx, y + dy, 0.16), dims=(0.05, 0.05, 0.32), name='TableLeg',
              mat=M['black'])
    ring = H.cyl(loc=(x + 0.10, y, 0.3665), r=0.30, depth=0.003, verts=72,
                 name='TableRing')
    H.assign(ring, H.emissive('ERing', GREEN, 1.1))
    _mark(M, (x + 0.10, y, 0.368), 0.155, M['greenLo'], M['black'],
          name='TableMark', rot=(-math.pi / 2, 0, 0))
    # the three candle glasses
    for i, dx in enumerate((-0.46, -0.30, -0.15)):
        g = H.cyl(loc=(x + dx, y + 0.06, 0.415), r=0.038, depth=0.10, verts=28,
                  name='Glass%d' % i)
        H.assign(g, M['glass'])
        if i == 1:
            fl = H.sphere(loc=(x + dx, y + 0.06, 0.395), r=0.014, segs=12,
                          rings=8, name='Flame')
            H.assign(fl, H.emissive('EFlame', (1.0, 0.55, 0.20), 90.0))


def _rug(M):
    """Shag pile as a real array of tufts. A flat slab reads as a painted
    rectangle on the floor; the pile is what catches the table's green inlay
    and the only soft silhouette at floor level."""
    F.box(loc=(0.45, 0.28, 0.008), dims=(3.55, 2.60, 0.016), name='RugBase',
          mat=M['rug'], bevel=0.004)
    tuft = H.cyl(loc=(0.45 - 1.72, 0.28 - 1.26, 0.030), r=0.011, depth=0.030,
                 verts=6, name='Tuft')
    H.assign(tuft, M['rug'])
    a = tuft.modifiers.new('AX', 'ARRAY')
    a.count, a.use_relative_offset, a.use_constant_offset = 78, False, True
    a.constant_offset_displace = (0.0445, 0, 0)
    b = tuft.modifiers.new('AY', 'ARRAY')
    b.count, b.use_relative_offset, b.use_constant_offset = 57, False, True
    b.constant_offset_displace = (0, 0.0445, 0)


def _chair(M, at=(-1.82, 0.98), turn=-0.62):
    """The gaming chair. It is the foreground subject in four of the six
    keyframes, so it is built rather than left to a prop that does not exist:
    5-star base, gas lift, bolstered seat, winged back, headrest, arms, and the
    mark on the backrest."""
    x, y = at
    ct, st = math.cos(turn), math.sin(turn)

    def place(dx, dy, dz, dims, rot=(0, 0, 0), mat=None, name='Chair', bev=0.008):
        """Chair-local (dx forward, dy left) into room space."""
        return F.box(loc=(x + dx * ct - dy * st, y + dx * st + dy * ct, dz),
                     dims=dims, rot=(rot[0], rot[1], rot[2] + turn),
                     name=name, mat=mat or M['black'], bevel=bev)

    for k in range(5):
        a = TAU * k / 5.0
        F.box(loc=(x + math.cos(a) * 0.17, y + math.sin(a) * 0.17, 0.045),
              dims=(0.34, 0.055, 0.030), rot=(0, 0, a), name='Star',
              mat=M['steel'], bevel=0.004)
        c = H.cyl(loc=(x + math.cos(a) * 0.32, y + math.sin(a) * 0.32, 0.028),
                  r=0.028, depth=0.022, rot=(math.pi / 2, 0, a), verts=16,
                  name='Caster')
        H.assign(c, M['black'])
    gas = H.cyl(loc=(x, y, 0.20), r=0.036, depth=0.30, verts=20, name='GasLift')
    H.assign(gas, M['steel'])

    place(0, 0, 0.435, (0.54, 0.56, 0.085), name='SeatPan')          # seat
    for dy in (-0.235, 0.235):                                        # bolsters
        place(0.02, dy, 0.470, (0.46, 0.10, 0.085), name='SeatBolster')
    # backrest, reclined ~11 degrees
    place(-0.235, 0, 0.845, (0.13, 0.54, 0.72), rot=(0, -0.19, 0), name='Back')
    for dy in (-0.225, 0.225):
        place(-0.185, dy, 0.845, (0.11, 0.10, 0.66), rot=(0, -0.19, 0),
              name='BackWing')
    place(-0.345, 0, 1.235, (0.12, 0.30, 0.17), rot=(0, -0.19, 0),
          name='Headrest')
    for dy in (-0.30, 0.30):                                          # arms
        place(0.0, dy, 0.60, (0.06, 0.06, 0.20), name='ArmPost',
              mat=M['steel'], bev=0.004)
        place(0.02, dy, 0.715, (0.30, 0.10, 0.045), name='ArmPad')
    # the mark, proud of the backrest and tilted with it
    mx, my = -0.305, 0.0
    _mark(M, (x + mx * ct - my * st, y + mx * st + my * ct, 0.90), 0.115,
          M['ink'], M['black'], name='ChairMark',
          rot=(0, -0.19, turn + math.pi))


# Props cut out of the fused image-to-3D plates by tools/split_plate.py.
# `rot` is in radians XYZ because the pieces are not reliably Z-up — the
# orientation follows whatever the reference photo implied, not a convention.
LOUNGE_PROPS = [
    dict(names=('monitor',), size=0.33, loc=(-2.58, -0.62, DESK_Z + 0.019)),
    dict(names=('monitor',), size=0.33, loc=(-2.58, 1.62, DESK_Z + 0.019)),
    dict(names=('lamp',), size=0.44, loc=(-2.62, 2.02, DESK_Z + 0.019)),
]


def _props(M):
    """Place the cut-out props. A missing file is not an error: the room
    renders with its built stand-ins, which is the state it shipped in."""
    placed = []
    for p in LOUNGE_PROPS:
        path = F.prop_path('lounge', *p['names'])
        if not path:
            continue
        ob = F.place_prop(path, p['size'], p['loc'], tris=p.get('tris', 40000),
                          rot=p.get('rot'))
        if ob:
            placed.append(ob)
    print('PROPS placed=%d' % len(placed), flush=True)
    return placed


def _guitar(M):
    """The electric leaning against the right wall. Present in three of the six
    keyframes, and the only warm-toned object in the room — which is exactly
    why it is worth the geometry: it stops the right wall going all green."""
    x, y = RX - 0.20, 3.05
    lean = 0.13
    wood = H.pbr('GuitarWood', base=(0.230, 0.105, 0.042), rough=0.24, spec=0.7)
    body = F.box(loc=(x, y, 0.34), dims=(0.34, 0.11, 0.46), rot=(0, lean, 0),
                 name='GtrBody', mat=wood, bevel=0.05, segments=5)
    F.box(loc=(x - 0.115, y, 0.94), dims=(0.07, 0.022, 0.78), rot=(0, lean, 0),
          name='GtrNeck', mat=wood, bevel=0.006)
    F.box(loc=(x - 0.208, y, 1.36), dims=(0.09, 0.026, 0.19), rot=(0, lean, 0),
          name='GtrHead', mat=M['black'], bevel=0.006)
    for k in range(6):
        F.box(loc=(x - 0.115, y - 0.021 + k * 0.0084, 0.94),
              dims=(0.0016, 0.0016, 0.80), rot=(0, lean, 0), name='GtrString',
              mat=M['steel'], bevel=0.0)
    F.box(loc=(x - 0.03, y - 0.058, 0.40), dims=(0.16, 0.012, 0.05),
          rot=(0, lean, 0), name='GtrPickup', mat=M['steel'], bevel=0.003)


def _mark_disc(M):
    """The hero mark on the slat wall, and the soft green area it throws."""
    _mark(M, (0, BY - 0.075, DISC_Z), DISC_R, M['green'], M['black'], name='Hero')


def _lights(M):
    """Almost everything here is emissive geometry. These four are the only
    non-visible lights, and they exist because a room lit purely by strips
    converges into noise long before it converges into an image."""
    H.area(loc=(0, BY - 0.9, DISC_Z), rot=(math.pi / 2, 0, 0), size=1.6,
           energy=42.0, color=GREEN)
    H.area(loc=(LX + 0.9, 1.42, 1.95), rot=(0, math.pi / 2, 0), size=1.5,
           energy=26.0, color=(0.35, 0.55, 1.0))
    H.area(loc=(RX - 0.7, 0.2, 1.55), rot=(0, -math.pi / 2, 0), size=1.8,
           energy=20.0, color=GREEN)
    H.point(loc=(0.55, 0.30, 0.55), energy=6.0, color=(1.0, 0.62, 0.30))
    H.area(loc=(0, 0.4, RH - 0.2), rot=(0, 0, 0), size=3.0, energy=9.0,
           color=VIOLET)


def build():
    M = mats()
    _shell(M)
    _coffer(M)
    _slatwall(M)
    _mark_disc(M)
    _shelf_column(M, -(SLAT_W / 2 + COL_W / 2 + 0.03))
    _shelf_column(M, +(SLAT_W / 2 + COL_W / 2 + 0.03))
    _console(M)
    _deck(M)
    _orb(M, -1.30, M['amber'])
    _orb(M, +1.18, M['magenta'])
    _desk(M)
    _tv(M)
    _right_wall(M)
    _rug(M)
    _sofa(M)
    _table(M)
    _chair(M)
    _guitar(M)
    # floor plants: both back corners, and one beside the sofa where the
    # keyframes put a tall leafy thing against the right wall
    _plant(M, (-2.55, 2.62, 0.0), 1.15)
    _plant(M, (2.52, 2.72, 0.0), 1.05)
    _plant(M, (2.40, -2.15, 0.0), 0.95)
    _props(M)
    _lights(M)
    return dict(mats=M)


# ═══════════════════════════════ check render ═══════════════════════════════
# One frame from roughly where the reference wide was shot, so the build can be
# graded against the keyframe instead of against its own source text.

# A single oblique wide cannot grade a wall: at a glancing angle a mirrored
# glyph and a foreshortened one look identical, which cost a whole iteration.
# Each wall therefore gets a head-on camera of its own.
CHECKS = {
    1: dict(cam=(-2.34, -3.05, 1.62), tgt=(0.55, 2.15, 1.30), focal=21.0),  # wide
    2: dict(cam=(0.00, -1.30, 1.55), tgt=(0.00, 3.80, 1.55), focal=38.0),   # back
    3: dict(cam=(1.30, 1.40, 1.60), tgt=(-3.00, 1.40, 1.60), focal=40.0),   # left
    4: dict(cam=(-1.30, 0.60, 1.60), tgt=(3.00, 0.60, 1.60), focal=40.0),   # right
    5: dict(cam=(0.40, 0.87, 1.74), tgt=(3.00, 0.87, 1.74), focal=30.0),    # posters
}


def main():
    n = int(os.environ.get('CHECK', 1))
    c = CHECKS[n]
    H.setup_gpu()
    F.cine_init(frames=1, samples=int(os.environ.get('SAMPLES', 64)),
                width=int(os.environ.get('RES_X', 1280)),
                look='AgX - High Contrast', exposure=0.55, ratio=16 / 9.0)
    build()
    H.camera(loc=c['cam'], target=c['tgt'],
             focal=float(os.environ.get('FOCAL', c['focal'])), fstop=5.6)
    H.grade(hi=(1.02, 0.995, 1.03), lo=(0.004, 0.001, 0.006), glare=0.14,
            vignette=0.0, dispersion=0.006)
    out = H.out_arg(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 'out', 'lounge-check%d' % n))
    print('LOUNGE_CHECK %d frames=1' % n, flush=True)
    H.render(out)


main()

# -*- coding: utf-8 -*-
"""Cinema extensions on top of harness.py — the difference between a plate and a film.

harness.py builds scroll plates: 960x480, a lit object on an infinite floor.
This module adds what a *film* needs:

  * a 2.39:1 anamorphic frame and a per-shot frame count
  * real photographed surfaces (4K PBR sets read from the machine's library)
  * rooms — walls, ceilings, slats, cable, so a lens has somewhere to be
  * a lens-flaw pass (dispersion + vignette) and encode-time grain

Everything is built at TRUE METRIC SCALE. A 12" LP is 0.152 m in radius, not
2.0 — which is what makes a physical 85 mm at f/1.8 fall off the way it does on
a real macro rig instead of looking like a toy shot with a tilt-shift.

The PBR library at `MIX` is READ-ONLY (owner's standing rule): load from it,
never write into it.
"""
import bpy, math, os, glob
from mathutils import Vector

import harness as H

# The owner's PBR library, READ-ONLY. `prep_tex.sh` mirrors the four sets this
# film uses into render/assets/spotify/tex at 2048 — at a 1280-wide delivery a
# 4K map cannot be resolved, and box projection samples every map THREE times
# per shading event, so the 4K set is paid for on every ray and seen on none.
MIX = 'C:/Users/GAMING/Downloads/mix'
_LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'spotify', 'tex')

# Texture sets used by this film, by role.
TEX = {
    'concrete': 'damaged_concrete_wall_vdcnfcd_4k',
    'concrete_old': 'old_concrete_rm4kshp0_4k',
    'parquet': 'basket_weave_parquet_tjxmceco_4k',
    'wood_ceiling': 'stained_wooden_ceiling_vjogaco_4k',
}


# ───────────────────────────── frame + camera ─────────────────────────────

def cine_init(frames=96, samples=128, width=1920, look='AgX - Medium High Contrast',
              exposure=0.0, ratio=2.39, fps=24):
    """A 2.39:1 scope frame. RES_X overrides width for a cheap look-check pass."""
    width = int(os.environ.get('RES_X', width))
    height = int(round(width / ratio / 2) * 2)
    os.environ['RES_X'] = str(width)
    os.environ['RES_Y'] = str(height)
    sc = H.init(res=(width, height), frames=frames, samples=samples, fps=fps,
                look=look, exposure=exposure)
    # A film can afford the bounces a plate cannot; the room is lit almost
    # entirely by bounce off concrete, so starving it reads as a black box.
    sc.cycles.max_bounces = 12
    sc.cycles.diffuse_bounces = 6
    sc.cycles.glossy_bounces = 6
    sc.cycles.volume_bounces = 3
    sc.cycles.adaptive_threshold = 0.012
    sc.cycles.use_fast_gi = False
    sc.render.use_persistent_data = True
    return sc


def shot_frames(spec, default=96):
    """FRAMES env wins; otherwise the shot's own length. SMOKE renders 1."""
    if os.environ.get('FRAMES'):
        return int(os.environ['FRAMES'])
    return int(spec.get('frames', default))


# ───────────────────────────── photographed surfaces ─────────────────────────────

def _find(folder, suffix):
    hits = glob.glob(os.path.join(folder, '*_%s.jpg' % suffix))
    hits += glob.glob(os.path.join(folder, '*_%s.png' % suffix))
    return hits[0] if hits else None


def _img(nt, path, non_color, project, blend):
    n = nt.nodes.new('ShaderNodeTexImage')
    n.image = bpy.data.images.load(path, check_existing=True)
    if non_color:
        n.image.colorspace_settings.name = 'Non-Color'
    if project == 'BOX':
        n.projection = 'BOX'
        n.projection_blend = blend
    n.extension = 'REPEAT'
    return n


def tex_pbr(name, role, tile=2.0, rough_mul=1.0, rough_add=0.0, tint=(1, 1, 1),
            project='BOX', blend=0.25, normal_strength=1.0, metal=0.0, spec=0.5):
    """Build a Principled from one of the library's 4K PBR sets.

    `tile` is the real-world size in metres that one texture repeat covers, so
    a 2 m concrete tile on a 6 m wall repeats three times — the mapping is in
    metres because the geometry is, which is the only way two different objects
    can share a material and still look like the same wall.
    """
    name_dir = TEX.get(role, role)
    folder = os.path.join(_LOCAL, name_dir)
    if os.environ.get('TEX4K') == '1' or not os.path.isdir(folder):
        folder = os.path.join(MIX, name_dir)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Metallic'].default_value = metal
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = spec

    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    s = 1.0 / max(tile, 1e-4)
    mp.inputs['Scale'].default_value = (s, s, s)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])

    base = _find(folder, 'BaseColor')
    if base:
        bc = _img(nt, base, False, project, blend)
        nt.links.new(mp.outputs['Vector'], bc.inputs['Vector'])
        src = bc.outputs['Color']
        ao = _find(folder, 'AO')
        if ao:
            an = _img(nt, ao, True, project, blend)
            nt.links.new(mp.outputs['Vector'], an.inputs['Vector'])
            mixn = nt.nodes.new('ShaderNodeMix')
            mixn.data_type = 'RGBA'
            mixn.blend_type = 'MULTIPLY'
            mixn.inputs['Factor'].default_value = 0.6
            rgba = [i for i in mixn.inputs if i.type == 'RGBA']
            nt.links.new(src, rgba[0])
            nt.links.new(an.outputs['Color'], rgba[1])
            src = next(o for o in mixn.outputs if o.type == 'RGBA')
        if tint != (1, 1, 1):
            tn = nt.nodes.new('ShaderNodeMix')
            tn.data_type = 'RGBA'
            tn.blend_type = 'MULTIPLY'
            tn.inputs['Factor'].default_value = 1.0
            rgba = [i for i in tn.inputs if i.type == 'RGBA']
            nt.links.new(src, rgba[0])
            rgba[1].default_value = (*tint, 1)
            src = next(o for o in tn.outputs if o.type == 'RGBA')
        nt.links.new(src, b.inputs['Base Color'])

    rgh = _find(folder, 'Roughness')
    if rgh:
        rn = _img(nt, rgh, True, project, blend)
        nt.links.new(mp.outputs['Vector'], rn.inputs['Vector'])
        mr = nt.nodes.new('ShaderNodeMath')
        mr.operation = 'MULTIPLY_ADD'
        mr.inputs[1].default_value = rough_mul
        mr.inputs[2].default_value = rough_add
        mr.use_clamp = True
        nt.links.new(rn.outputs['Color'], mr.inputs[0])
        nt.links.new(mr.outputs['Value'], b.inputs['Roughness'])

    nrm = _find(folder, 'Normal')
    if nrm:
        nn = _img(nt, nrm, True, project, blend)
        nt.links.new(mp.outputs['Vector'], nn.inputs['Vector'])
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(nn.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m


def apply_scale(ob):
    """Object texture coordinates are only in metres if the object's own scale
    is 1 — otherwise a 6 m wall built as a scaled 1 m cube tiles six times too
    coarsely. Bake the scale in before texturing."""
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects:
        o.select_set(False)
    ob.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.select_set(False)
    return ob


def box(loc=(0, 0, 0), dims=(1, 1, 1), rot=(0, 0, 0), name='Box', mat=None,
        bevel=0.0, segments=3):
    """A real-metres box: dims are the finished size, scale is applied."""
    o = H.cube(loc=loc, size=1.0, scale=dims, rot=rot, name=name)
    apply_scale(o)
    if bevel > 0:
        H.bevel(o, width=bevel, segments=segments)
    if mat:
        H.assign(o, mat)
    return o


# ───────────────────────────── set pieces ─────────────────────────────

def slat_ceiling(z, span_x, span_y, mat, slat=0.055, gap=0.045, depth=0.09):
    """A real acoustic slat ceiling: an array of battens, not a texture of one.
    Costs almost nothing and buys the single most cinematic thing a room has —
    a hard shadow ladder that moves when the camera does."""
    pitch = slat + gap
    n = int(span_y / pitch)
    first = box(loc=(0, -span_y / 2, z - depth / 2), dims=(span_x, slat, depth),
                name='Slat', mat=mat, bevel=0.004, segments=2)
    m = first.modifiers.new('Array', 'ARRAY')
    m.count = n
    m.use_relative_offset = False
    m.use_constant_offset = True
    m.constant_offset_displace = (0, pitch, 0)
    return first


def cable(points, radius=0.004, name='Cable', mat=None, res=12):
    """A drooping cable from a bezier — the detail that says a room is used."""
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = 4
    cu.resolution_u = res
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(points) - 1)
    for i, p in enumerate(points):
        bp = sp.bezier_points[i]
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    ob = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(ob)
    if mat:
        ob.data.materials.append(mat)
    return ob


def strip_light(loc, dims, color, strength, name='Strip'):
    """A visible emissive bar plus the area light that actually does the work —
    an emissive plane alone is a terrible light source and takes forever to
    converge, while an area light alone leaves nothing in frame to explain it."""
    bar = box(loc=loc, dims=dims, name=name, mat=H.emissive(name + 'E', color, strength))
    return bar


def led(loc, r, color, strength, name='LED'):
    o = H.sphere(loc=loc, r=r, segs=16, rings=8, name=name)
    m = H.emissive(name + 'M', color, strength)
    H.assign(o, m)
    return o, m


# ───────────────────────────── look ─────────────────────────────

def linear(ob):
    """Constant-rate animation. harness.keyframe eases everything, which is
    right for a dolly and wrong for a platter — a record that slows down at
    the end of the shot is the loudest possible tell."""
    ad = getattr(ob, 'animation_data', None)
    if not (ad and ad.action):
        return ob
    for fc in H._fcurves(ad.action):
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'
    return ob


def place_prop(path, size, loc, rot_z=0.0, tris=60000, shade_smooth=False):
    """Import ONE model file and stand it in the set at real size.

    harness.dressing() places a whole folder by index order, which is fine for
    a plate world where anything dropped in is decoration. A film cannot work
    that way: a prop belongs at a specific mark in a specific shot, and the
    order files happen to sort in is not that. This takes one path.

    `size` is the real-world size in metres on the longest axis. `loc` is where
    the prop's BASE CENTRE goes, so a crate at z=0 sits on the floor rather
    than half-sunk in it. Missing file is not an error — the shot renders
    undressed, which is the state the film is in today.
    """
    if not path or not os.path.isfile(path):
        return None
    before = set(bpy.data.objects)
    low = path.lower()
    try:
        if low.endswith(('.glb', '.gltf')):
            bpy.ops.import_scene.gltf(filepath=path)
        elif low.endswith('.fbx'):
            bpy.ops.import_scene.fbx(filepath=path)
        elif low.endswith('.obj'):
            bpy.ops.wm.obj_import(filepath=path)
        else:
            return None
    except Exception as e:
        print('PROP_FAILED %s: %s' % (os.path.basename(path), str(e)[:80]))
        return None

    added = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in added if o.type == 'MESH']
    if not meshes:
        return None

    # Parent everything to one empty so the group scales and rotates as a unit
    # — a multi-part import scaled per-object comes apart.
    root = bpy.data.objects.new('Prop_' + os.path.basename(path)[:16], None)
    bpy.context.collection.objects.link(root)
    for o in added:
        if o.parent is None:
            o.parent = root
            o.matrix_parent_inverse = root.matrix_world.inverted()

    if tris:
        for m in meshes:
            H.decimate_to(m, tris)
    if shade_smooth:
        for m in meshes:
            for p in m.data.polygons:
                p.use_smooth = True

    dg = bpy.context.evaluated_depsgraph_get()
    bpy.context.view_layer.update()

    def world_bb():
        pts = []
        for m in meshes:
            for c in m.evaluated_get(dg).bound_box:
                pts.append(m.matrix_world @ Vector(c))
        return pts

    pts = world_bb()
    dims = [max(p[k] for p in pts) - min(p[k] for p in pts) for k in range(3)]
    longest = max(dims) or 1.0
    f = size / longest
    root.scale = (f, f, f)
    root.rotation_mode = 'XYZ'
    root.rotation_euler = (0, 0, math.radians(rot_z))
    bpy.context.view_layer.update()

    pts = world_bb()
    cx = (max(p[0] for p in pts) + min(p[0] for p in pts)) / 2
    cy = (max(p[1] for p in pts) + min(p[1] for p in pts)) / 2
    zmin = min(p[2] for p in pts)
    root.location = (loc[0] - cx, loc[1] - cy, loc[2] - zmin)
    bpy.context.view_layer.update()
    print('PROP %s -> %.3fm at %s' % (os.path.basename(path)[:28], size, loc))
    return root


def prop_path(world, *names):
    """First existing file in render/assets/<world>/ matching any of `names`
    (case-insensitive substring). Lets the set reference a prop by what it IS
    while the file on disk keeps whatever name the generator gave it."""
    folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', world)
    if not os.path.isdir(folder):
        return None
    files = [f for f in sorted(os.listdir(folder))
             if f.lower().endswith(('.glb', '.gltf', '.fbx', '.obj'))]
    for want in names:
        for f in files:
            if want.lower() in f.lower():
                return os.path.join(folder, f)
    return None


def hold(cam, tgt, spec, frames):
    """stage_shot, with MB=0 to strip motion blur — the second-largest lever on
    frame cost after the world volume, and worth measuring separately."""
    if os.environ.get('MB') == '0':
        spec = dict(spec, shutter=0.0)
    return H.stage_shot(cam, tgt, spec, frames)

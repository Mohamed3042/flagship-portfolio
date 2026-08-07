"""Shared Blender render harness for the Worlds rendered-cinema layer.

Every world script imports this, builds its set, and calls render().
Physical camera, area lights with real size, volumetric atmosphere, AgX,
OptiX denoise, GPU. Output is a numbered PNG sequence; encode.py turns it
into the scroll-scrubbed mp4 the cinema engine seeks by --p.
"""
import bpy, math, os, sys
from mathutils import Vector

TAU = math.pi * 2


# ───────────────────────────── device + scene ─────────────────────────────

def setup_gpu():
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for backend in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = backend
        except TypeError:
            continue
        prefs.get_devices()
        if any(d.type == backend for d in prefs.devices):
            break
    # OptiX devices only; leave CPU and the iGPU out (mixing slows the tile queue)
    for d in prefs.devices:
        d.use = (d.type == 'OPTIX')
    if not any(d.use for d in prefs.devices):
        for d in prefs.devices:
            d.use = (d.type == 'CUDA')
    return [d.name for d in prefs.devices if d.use]


def init(res=(1280, 640), frames=96, samples=128, fps=24,
         look='AgX - Medium High Contrast', exposure=0.0, transparent=False):
    """Wipe the factory scene and configure the render.

    read_factory_settings() resets the PREFERENCES too, which puts
    cycles.preferences.compute_device_type back to NONE — and with no backend,
    `scene.cycles.device = 'GPU'` silently renders on the CPU. Every world
    script calls setup_gpu() before this, so every plate this pipeline shipped
    was a CPU render wearing an OptiX label. Re-apply the device AFTER the
    reset, and never trust a setup_gpu() that ran before it.
    """
    bpy.ops.wm.read_factory_settings(use_empty=True)
    setup_gpu()
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'GPU'
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.01
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPTIX'
    sc.cycles.denoising_use_gpu = True
    sc.cycles.max_bounces = 8
    sc.cycles.transmission_bounces = 8
    sc.cycles.volume_bounces = 2
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.cycles.film_exposure = 1.0

    # RES_X lets the batch trade resolution for wall-clock without touching
    # any world script; the plate is a full-bleed background, so 960 wide is
    # indistinguishable from 1280 once it is scaled to cover and graded.
    res = (int(os.environ.get('RES_X', res[0])), int(os.environ.get('RES_Y', res[1])))
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.render.fps = fps
    sc.frame_start, sc.frame_end = 1, frames
    sc.render.film_transparent = transparent
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.image_settings.compression = 15

    sc.view_settings.view_transform = 'AgX'
    try:
        sc.view_settings.look = look
    except TypeError:
        sc.view_settings.look = 'None'
    sc.view_settings.exposure = exposure

    # a touch of real optical bloom, done in the compositor (cheap, filmic)
    sc.use_nodes = True
    return sc


def _comp_tree():
    """Blender 5.x runs the compositor as a node group on the scene, entered
    through a Group Input and left through a Group Output; 4.x uses
    scene.node_tree with Render Layers → Composite. Return (tree, src, dst)."""
    sc = bpy.context.scene
    sc.use_nodes = True
    if hasattr(sc, 'compositing_node_group'):
        ng = bpy.data.node_groups.new('Grade', 'CompositorNodeTree')
        ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
        sc.compositing_node_group = ng
        ng.nodes.clear()
        # source must be a Render Layers node: a group whose output does not
        # depend on one makes Blender skip the render entirely (black frame)
        rl = ng.nodes.new('CompositorNodeRLayers')
        go = ng.nodes.new('NodeGroupOutput')
        return ng, rl.outputs['Image'], go.inputs[0]
    nt = sc.node_tree
    nt.nodes.clear()
    rl = nt.nodes.new('CompositorNodeRLayers')
    out = nt.nodes.new('CompositorNodeComposite')
    return nt, rl.outputs['Image'], out.inputs['Image']


def _mix_node(nt, blend, fac):
    """MixRGB in 4.x, the unified Mix node in 5.x."""
    for kind in ('CompositorNodeMixRGB', 'ShaderNodeMix'):
        try:
            n = nt.nodes.new(kind)
        except RuntimeError:
            continue
        if kind == 'ShaderNodeMix':
            n.data_type = 'RGBA'
            n.blend_type = blend
            n.inputs['Factor'].default_value = fac
            ins = [s for s in n.inputs if s.type == 'RGBA']
            return n, ins[0], ins[1], n.outputs[next(i for i, o in enumerate(n.outputs) if o.type == 'RGBA')]
        n.blend_type = blend
        n.inputs['Fac'].default_value = fac
        return n, n.inputs[1], n.inputs[2], n.outputs['Image']
    return None, None, None, None


def _put(node, name, value, nth=0):
    """Blender 5.x turned most compositor node options into input sockets;
    4.x kept them as properties. Try socket first, then property, then shrug."""
    hits = [s for s in node.inputs if s.name == name]
    if len(hits) > nth:
        s = hits[nth]
        try:
            if isinstance(value, (tuple, list)) and len(s.default_value) == 4 and len(value) == 3:
                s.default_value = (*value, 1.0)
            else:
                s.default_value = value
            return True
        except (TypeError, ValueError, AttributeError):
            pass
    prop = name.lower().replace(' ', '_')
    cands = ['glare_type', 'correction_method'] if name == 'Type' else [prop]
    for attr in cands:
        p = node.bl_rna.properties.get(attr)
        if p is None or p.is_readonly:
            continue
        try:
            setattr(node, attr, value)
            return True
        except (TypeError, ValueError, AttributeError):
            pass
    return False


def grade(hi=(1, 1, 1), mid=(1, 1, 1), lo=(1, 1, 1), glare=0.0, vignette=0.0,
          dispersion=0.0):
    """Per-world colour grade + optional glare, in the compositor.

    `dispersion` adds the chromatic fringe real glass has at the frame edge.
    It has to live here rather than in a second pass because _comp_tree()
    builds a fresh node group every call — a caller that ran it first would
    silently have its work discarded by this one."""
    nt, src, dst = _comp_tree()

    if dispersion > 0:
        try:
            ld = nt.nodes.new('CompositorNodeLensdist')
            _put(ld, 'Dispersion', dispersion)
            _put(ld, 'Fit', True)
            nt.links.new(src, ld.inputs['Image'])
            src = ld.outputs['Image']
        except Exception:
            pass

    if glare > 0:
        g = nt.nodes.new('CompositorNodeGlare')
        # 5.x menu sockets take the UI label, not the old enum identifier —
        # and default to 'Streaks', which stamps a fake anamorphic cross on
        # every highlight. Bloom is the only honest choice for a real lens.
        for label in ('Bloom', 'Fog Glow', 'BLOOM', 'FOG_GLOW'):
            if _put(g, 'Type', label):
                break
        _put(g, 'Quality', 'HIGH')
        _put(g, 'Threshold', 0.85)
        _put(g, 'Size', 8.0)
        _put(g, 'Strength', glare)
        if 'Strength' not in [s.name for s in g.inputs] and hasattr(g, 'mix'):
            g.mix = -1.0 + glare
        nt.links.new(src, g.inputs['Image'])
        src = g.outputs['Image']

    cb = nt.nodes.new('CompositorNodeColorBalance')
    _put(cb, 'Type', 'LIFT_GAMMA_GAIN')
    _put(cb, 'Lift', lo)
    _put(cb, 'Gamma', mid)
    _put(cb, 'Gain', hi)
    if hasattr(cb, 'correction_method'):
        cb.correction_method = 'LIFT_GAMMA_GAIN'
    nt.links.new(src, cb.inputs['Image'])
    src = cb.outputs['Image']

    if vignette > 0:
        el = nt.nodes.new('CompositorNodeEllipseMask')
        _put(el, 'Width', 1.25)
        _put(el, 'Height', 1.35)
        bl = nt.nodes.new('CompositorNodeBlur')
        _put(bl, 'Size X', 220)
        _put(bl, 'Size Y', 220)
        _put(bl, 'Size', 0.35)
        _put(bl, 'Relative', False)
        nt.links.new(el.outputs['Mask'], bl.inputs['Image'])
        mx, a_in, b_in, m_out = _mix_node(nt, 'MULTIPLY', vignette)
        if mx:
            nt.links.new(src, a_in)
            nt.links.new(bl.outputs['Image'], b_in)
            src = m_out

    nt.links.new(src, dst)


# ───────────────────────────── camera ─────────────────────────────

def camera(loc, target, focal=50.0, fstop=2.8, focus_dist=None, shift=(0, 0)):
    cam_d = bpy.data.cameras.new('Cam')
    cam_d.lens = focal
    cam_d.sensor_width = 36
    cam_d.shift_x, cam_d.shift_y = shift
    cam_d.dof.use_dof = True
    cam_d.dof.aperture_fstop = fstop
    cam = bpy.data.objects.new('Cam', cam_d)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    tgt = bpy.data.objects.new('CamTarget', None)
    tgt.location = target
    bpy.context.collection.objects.link(tgt)
    trk = cam.constraints.new('TRACK_TO')
    trk.target = tgt
    trk.track_axis = 'TRACK_NEGATIVE_Z'
    trk.up_axis = 'UP_Y'

    cam.location = loc
    cam_d.dof.focus_distance = focus_dist or (Vector(loc) - Vector(target)).length
    cam.data.dof.focus_object = None
    cam['target'] = tgt.name
    return cam, tgt


def cam_move(cam, tgt, keys, focal_keys=None, focus_keys=None):
    """keys: [(frame, cam_loc, target_loc), ...] — linear-eased dolly."""
    for f, cloc, tloc in keys:
        cam.location = cloc
        cam.keyframe_insert('location', frame=f)
        tgt.location = tloc
        tgt.keyframe_insert('location', frame=f)
    for ob in (cam, tgt):
        if ob.animation_data and ob.animation_data.action:
            for fc in _fcurves(ob.animation_data.action):
                for kp in fc.keyframe_points:
                    kp.interpolation = 'BEZIER'
                    kp.easing = 'EASE_IN_OUT'
    for f, val in (focal_keys or []):
        cam.data.lens = val
        cam.data.keyframe_insert('lens', frame=f)
    for f, val in (focus_keys or []):
        cam.data.dof.focus_distance = val
        cam.data.dof.keyframe_insert('focus_distance', frame=f)


def _fcurves(action):
    """Blender 4.4+ moved fcurves into slotted layers; support both."""
    if hasattr(action, 'fcurves') and len(action.fcurves):
        return action.fcurves
    out = []
    for layer in getattr(action, 'layers', []):
        for strip in layer.strips:
            for bag in getattr(strip, 'channelbags', []):
                out.extend(bag.fcurves)
    return out


def keyframe(ob, path, keys, index=-1):
    """keys: [(frame, value), ...]. Works on objects, light data and node
    sockets — a socket's animation lives on the node tree that owns it, so
    the smoothing pass has to look there instead of on the socket."""
    for f, v in keys:
        if index >= 0:
            getattr(ob, path)[index] = v
        else:
            setattr(ob, path, v)
        ob.keyframe_insert(path, frame=f, index=index)
    owner = ob if hasattr(ob, 'animation_data') else getattr(ob, 'id_data', None)
    ad = getattr(owner, 'animation_data', None)
    if ad and ad.action:
        for fc in _fcurves(ad.action):
            for kp in fc.keyframe_points:
                kp.interpolation = 'BEZIER'
                kp.easing = 'EASE_IN_OUT'


# ───────────────────────────── lights + world ─────────────────────────────

def area(loc, rot=(0, 0, 0), size=2.0, energy=200.0, color=(1, 1, 1), shape='RECTANGLE', size_y=None):
    d = bpy.data.lights.new('Area', 'AREA')
    d.shape = shape
    d.size = size
    if size_y:
        d.size_y = size_y
    d.energy = energy
    d.color = color
    o = bpy.data.objects.new('Area', d)
    o.location, o.rotation_euler = loc, rot
    bpy.context.collection.objects.link(o)
    return o


def spot(loc, target, energy=500.0, color=(1, 1, 1), spot_size=0.6, blend=0.4, radius=0.05):
    d = bpy.data.lights.new('Spot', 'SPOT')
    d.energy, d.color = energy, color
    d.spot_size, d.spot_blend = spot_size, blend
    d.shadow_soft_size = radius
    o = bpy.data.objects.new('Spot', d)
    o.location = loc
    bpy.context.collection.objects.link(o)
    t = bpy.data.objects.new('SpotTgt', None)
    t.location = target
    bpy.context.collection.objects.link(t)
    c = o.constraints.new('TRACK_TO')
    c.target, c.track_axis, c.up_axis = t, 'TRACK_NEGATIVE_Z', 'UP_Y'
    return o, t


def point(loc, energy=100.0, color=(1, 1, 1), radius=0.1):
    d = bpy.data.lights.new('Point', 'POINT')
    d.energy, d.color, d.shadow_soft_size = energy, color, radius
    o = bpy.data.objects.new('Point', d)
    o.location = loc
    bpy.context.collection.objects.link(o)
    return o


def world_sky(top=(0.02, 0.03, 0.06), bottom=(0.005, 0.005, 0.01), strength=1.0):
    w = bpy.data.worlds.new('W')
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    bg = nt.nodes.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = strength
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (*bottom, 1)
    ramp.color_ramp.elements[1].color = (*top, 1)
    grad = nt.nodes.new('ShaderNodeTexGradient')
    grad.gradient_type = 'EASING'
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value = (math.radians(90), 0, 0)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], grad.inputs['Vector'])
    nt.links.new(grad.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
    nt.links.new(bg.outputs['Background'], out.inputs['Surface'])
    return w


def world_stars(density=0.9, scale=900.0, color=(1, 0.97, 0.92), strength=6.0,
                sky_top=(0.012, 0.018, 0.04), sky_bottom=(0.002, 0.003, 0.008)):
    """Procedural star field: sharp noise threshold on the world sphere."""
    world_sky(sky_top, sky_bottom, 1.0)
    nt = bpy.context.scene.world.node_tree
    bg_star = nt.nodes.new('ShaderNodeBackground')
    bg_star.inputs['Strength'].default_value = strength
    bg_star.inputs['Color'].default_value = (*color, 1)
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = 2.0
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.interpolation = 'CONSTANT'
    ramp.color_ramp.elements[0].position = density
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = min(0.999, density + 0.004)
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    # Stars must be VISIBLE, not ILLUMINATING: a bright emissive world sphere
    # is a giant dome light and will blow the whole set out. Gate the star
    # layer behind Is Camera Ray so it only ever shows up in the lens.
    out = next(n for n in nt.nodes if n.type == 'OUTPUT_WORLD')
    old = out.inputs['Surface'].links[0].from_node
    nt.links.new(ramp.outputs['Color'], bg_star.inputs['Color'])
    add = nt.nodes.new('ShaderNodeAddShader')
    nt.links.new(old.outputs['Background'], add.inputs[0])
    nt.links.new(bg_star.outputs['Background'], add.inputs[1])
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
    nt.links.new(old.outputs['Background'], mix.inputs[1])   # bounce: sky only
    nt.links.new(add.outputs['Shader'], mix.inputs[2])       # lens: sky + stars
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    return nt


def world_haze(density=0.005, color=(0.6, 0.72, 0.95), anisotropy=0.5):
    """Global participating medium on the World itself — infinite, so it can
    never show a container edge the way a volume cube does."""
    w = bpy.context.scene.world
    nt = w.node_tree
    out = next(n for n in nt.nodes if n.type == 'OUTPUT_WORLD')
    vs = nt.nodes.new('ShaderNodeVolumeScatter')
    vs.inputs['Density'].default_value = density
    vs.inputs['Color'].default_value = (*color, 1)
    vs.inputs['Anisotropy'].default_value = anisotropy
    nt.links.new(vs.outputs['Volume'], out.inputs['Volume'])
    return vs


def atmosphere(density=0.004, color=(0.6, 0.7, 0.9), anisotropy=0.35, size=60.0, loc=(0, 0, 0)):
    """A big volume-scatter cube: real god rays and haze depth."""
    bpy.ops.mesh.primitive_cube_add(size=size, location=loc)
    ob = bpy.context.object
    ob.name = 'Atmosphere'
    m = bpy.data.materials.new('Atmo')
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    vs = nt.nodes.new('ShaderNodeVolumeScatter')
    vs.inputs['Density'].default_value = density
    vs.inputs['Color'].default_value = (*color, 1)
    vs.inputs['Anisotropy'].default_value = anisotropy
    nt.links.new(vs.outputs['Volume'], out.inputs['Volume'])
    ob.data.materials.append(m)
    ob.visible_shadow = False
    return ob


# ───────────────────────────── materials ─────────────────────────────

def _principled(m):
    return next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')


def _set(bsdf, name, value):
    if name in bsdf.inputs:
        bsdf.inputs[name].default_value = value


def pbr(name, base=(0.5, 0.5, 0.5), rough=0.5, metal=0.0, spec=0.5,
        emit=None, emit_strength=0.0, transmission=0.0, ior=1.45,
        coat=0.0, sheen=0.0, alpha=1.0, aniso=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = _principled(m)
    _set(b, 'Base Color', (*base, 1))
    _set(b, 'Roughness', rough)
    _set(b, 'Metallic', metal)
    _set(b, 'IOR', ior)
    _set(b, 'Transmission Weight', transmission)
    _set(b, 'Coat Weight', coat)
    _set(b, 'Sheen Weight', sheen)
    _set(b, 'Anisotropic', aniso)
    _set(b, 'Alpha', alpha)
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = spec
    if emit is not None:
        _set(b, 'Emission Color', (*emit, 1))
        _set(b, 'Emission Strength', emit_strength)
    if alpha < 1.0:
        m.blend_method = 'BLEND' if hasattr(m, 'blend_method') else m.blend_method
    return m


def emissive(name, color=(1, 1, 1), strength=8.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*color, 1)
    e.inputs['Strength'].default_value = strength
    nt.links.new(e.outputs['Emission'], out.inputs['Surface'])
    return m


def rough_variation(mat, scale=40.0, low=0.18, high=0.55, bump=0.0):
    """Break up a flat roughness with procedural noise; optional micro-bump.
    Real surfaces are never uniform — this is what sells metal and plastic."""
    nt = mat.node_tree
    b = _principled(mat)
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = 6.0
    noise.inputs['Roughness'].default_value = 0.6
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (low, low, low, 1)
    ramp.color_ramp.elements[1].color = (high, high, high, 1)
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Roughness'])
    if bump > 0:
        bmp = nt.nodes.new('ShaderNodeBump')
        bmp.inputs['Strength'].default_value = bump
        bmp.inputs['Distance'].default_value = 0.002
        n2 = nt.nodes.new('ShaderNodeTexNoise')
        n2.inputs['Scale'].default_value = scale * 6
        n2.inputs['Detail'].default_value = 8.0
        nt.links.new(n2.outputs['Fac'], bmp.inputs['Height'])
        nt.links.new(bmp.outputs['Normal'], b.inputs['Normal'])
    return mat


def brushed(mat, strength=0.35, scale=(300.0, 3.0, 300.0)):
    """Anisotropic-looking brushed metal via stretched noise on the normal."""
    nt = mat.node_tree
    b = _principled(mat)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = scale
    n = nt.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = 12.0
    n.inputs['Detail'].default_value = 4.0
    bmp = nt.nodes.new('ShaderNodeBump')
    bmp.inputs['Strength'].default_value = strength
    bmp.inputs['Distance'].default_value = 0.001
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], n.inputs['Vector'])
    nt.links.new(n.outputs['Fac'], bmp.inputs['Height'])
    nt.links.new(bmp.outputs['Normal'], b.inputs['Normal'])
    return mat


def assign(ob, mat):
    ob.data.materials.clear()
    ob.data.materials.append(mat)
    return ob


def shade_smooth(ob, angle=math.radians(35)):
    for p in ob.data.polygons:
        p.use_smooth = True
    mod = ob.modifiers.new('SmoothByAngle', 'WEIGHTED_NORMAL') if False else None
    ob.data.use_auto_smooth = True if hasattr(ob.data, 'use_auto_smooth') else False
    if hasattr(ob.data, 'auto_smooth_angle'):
        ob.data.auto_smooth_angle = angle
    return ob


def bevel(ob, width=0.004, segments=3, angle=math.radians(40)):
    """Nothing in reality has a zero-radius edge; this is the single biggest
    realism win on hard-surface geometry."""
    m = ob.modifiers.new('Bevel', 'BEVEL')
    m.width = width
    m.segments = segments
    m.limit_method = 'ANGLE'
    m.angle_limit = angle
    m.harden_normals = True
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob


def subsurf(ob, levels=2, render=2):
    m = ob.modifiers.new('Subsurf', 'SUBSURF')
    m.levels, m.render_levels = levels, render
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob


# ───────────────────────────── primitives ─────────────────────────────

def cube(loc=(0, 0, 0), size=1.0, scale=(1, 1, 1), rot=(0, 0, 0), name='Cube'):
    bpy.ops.mesh.primitive_cube_add(size=size, location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = scale
    o.name = name
    return o


def cyl(loc=(0, 0, 0), r=1.0, depth=1.0, rot=(0, 0, 0), verts=64, name='Cyl'):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc,
                                        rotation=rot, vertices=verts)
    o = bpy.context.object
    o.name = name
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def sphere(loc=(0, 0, 0), r=1.0, segs=48, rings=24, name='Sphere'):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc,
                                         segments=segs, ring_count=rings)
    o = bpy.context.object
    o.name = name
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def plane(loc=(0, 0, 0), size=10.0, rot=(0, 0, 0), name='Plane'):
    bpy.ops.mesh.primitive_plane_add(size=size, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    return o


def torus(loc=(0, 0, 0), major=1.0, minor=0.1, rot=(0, 0, 0), name='Torus'):
    bpy.ops.mesh.primitive_torus_add(location=loc, rotation=rot,
                                     major_radius=major, minor_radius=minor,
                                     major_segments=64, minor_segments=24)
    o = bpy.context.object
    o.name = name
    for p in o.data.polygons:
        p.use_smooth = True
    return o


# ───────────────────────────── render ─────────────────────────────

def render(outdir):
    """SMOKE=<n> renders only n frames (spread across the shot) for a fast
    look-check; SMOKE unset renders the whole sequence."""
    os.makedirs(outdir, exist_ok=True)
    sc = bpy.context.scene
    sc.render.filepath = os.path.join(outdir, 'f_')
    smoke = os.environ.get('SMOKE')
    if smoke:
        n = max(1, int(smoke))
        last = sc.frame_end
        picks = [1] if n == 1 else [1 + round(i * (last - 1) / (n - 1)) for i in range(n)]
        for f in picks:
            sc.frame_set(f)
            sc.render.filepath = os.path.join(outdir, f'smoke_{f:04d}')
            bpy.ops.render.render(write_still=True)
            print(f'SMOKE_FRAME {f}')
    else:
        bpy.ops.render.render(animation=True)
    print('RENDER_DONE ' + outdir)


def out_arg(default):
    """--  <outdir> from the CLI."""
    if '--' in sys.argv:
        rest = sys.argv[sys.argv.index('--') + 1:]
        if rest:
            return rest[0]
    return default


# ───────────────────────── sequence direction ─────────────────────────

def shot_no():
    """Which shot of this world's sequence to render (SHOT=1..n)."""
    return int(os.environ.get('SHOT', '1'))


def stage_shot(cam, tgt, spec, frames):
    """Apply one shot's camera language. spec keys:
         keys   [(t, cam_loc, target_loc)] with t in 0..1 across the shot
         focal  [(t, mm)]      focus [(t, metres)]
         fstop  float          shutter float (motion blur, 0 = off)
         roll   [(t, degrees)] — a hand-held or dutch tilt on the lens axis
    """
    n = frames
    f = lambda t: max(1, round(1 + t * (n - 1)))
    cam.data.dof.aperture_fstop = spec.get('fstop', cam.data.dof.aperture_fstop)
    cam_move(cam, tgt,
             keys=[(f(t), a, b) for t, a, b in spec['keys']],
             focal_keys=[(f(t), v) for t, v in spec.get('focal', [])],
             focus_keys=[(f(t), v) for t, v in spec.get('focus', [])])
    if spec.get('roll'):
        keyframe(cam, 'rotation_euler',
                 [(f(t), math.radians(v)) for t, v in spec['roll']], index=2)
    sh = spec.get('shutter', 0.0)
    sc = bpy.context.scene
    sc.render.use_motion_blur = sh > 0
    if sh > 0:
        sc.render.motion_blur_shutter = sh
    return cam


def import_assets(world, root=None, scale=1.0, at=(0, 0, 0)):
    """Append/import anything the owner dropped in render/assets/<world>/.
    Returns the objects added, so a world script can place or hide them.
    Missing folder is not an error — the set simply renders as authored."""
    root = root or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', world)
    if not os.path.isdir(root):
        return []
    before = set(bpy.data.objects)
    for name in sorted(os.listdir(root)):
        p = os.path.join(root, name)
        low = name.lower()
        try:
            if low.endswith('.blend'):
                with bpy.data.libraries.load(p, link=False) as (src, dst):
                    dst.objects = src.objects
                for ob in dst.objects:
                    if ob is not None:
                        bpy.context.collection.objects.link(ob)
            elif low.endswith('.fbx'):
                bpy.ops.import_scene.fbx(filepath=p)
            elif low.endswith(('.glb', '.gltf')):
                bpy.ops.import_scene.gltf(filepath=p)
            elif low.endswith('.obj'):
                bpy.ops.wm.obj_import(filepath=p)
            else:
                continue
            print('ASSET_IMPORTED ' + name)
        except Exception as e:
            print('ASSET_FAILED %s: %s' % (name, str(e)[:90]))
    added = [o for o in bpy.data.objects if o not in before]
    for o in added:
        o.scale = (o.scale[0] * scale, o.scale[1] * scale, o.scale[2] * scale)
        o.location = (o.location[0] + at[0], o.location[1] + at[1], o.location[2] + at[2])
    return added


def _roots(objs):
    """Top-level mesh objects — the things worth placing individually."""
    s = set(objs)
    return [o for o in objs if o.type == 'MESH' and (o.parent is None or o.parent not in s)]


def decimate_to(ob, tris):
    """Collapse an object (and its mesh children) down to roughly `tris`.

    Image-to-3D output lands at a fixed budget — every model out of Hunyuan is
    ~1.5M triangles whether it is a dish antenna or a book. Six of those is 9M
    triangles of *background dressing*, which costs BVH build time and memory
    on every frame to resolve detail no lens in the shot can see. Decimating a
    prop that occupies 200px is free quality.
    """
    for o in [ob] + list(ob.children_recursive):
        if o.type != 'MESH' or not o.data.polygons:
            continue
        have = len(o.data.polygons)
        if have <= tris:
            continue
        m = o.modifiers.new('Decimate', 'DECIMATE')
        m.decimate_type = 'COLLAPSE'
        m.ratio = max(0.002, tris / float(have))
        m.use_collapse_triangulate = True
    return ob


def dressing(world, slots, hide_extra=True, tris=None):
    """Import render/assets/<world>/ and dress the set with it.

    slots: [(size_m, (x, y, z), rot_z_deg), ...] — each imported root is
    normalised to `size_m` on its longest axis, dropped so its base sits on z,
    and placed. Library models arrive at wildly different scales and origins;
    measuring the bounds is the only reliable way to make them share a set
    with hand-built geometry. Anything past the last slot is hidden rather
    than left floating at the origin.

    tris: optional per-prop triangle budget, see decimate_to(). Left at None
    the geometry is untouched, so this stays a no-op for existing worlds.
    """
    objs = import_assets(world)
    if not objs:
        return []
    roots = _roots(objs)
    placed = []
    dg = bpy.context.evaluated_depsgraph_get()
    for i, ob in enumerate(roots):
        if i >= len(slots):
            if hide_extra:
                ob.hide_render = True
                for c in ob.children_recursive:
                    c.hide_render = True
            continue
        size_m, loc, rz = slots[i]
        ob.rotation_mode = 'XYZ'
        bpy.context.view_layer.update()
        ev = ob.evaluated_get(dg)
        bb = [ob.matrix_world @ Vector(c) for c in ev.bound_box]
        dims = [max(v[k] for v in bb) - min(v[k] for v in bb) for k in range(3)]
        longest = max(dims) or 1.0
        f = size_m / longest
        ob.scale = tuple(s * f for s in ob.scale)
        bpy.context.view_layer.update()
        bb = [ob.matrix_world @ Vector(c) for c in ob.evaluated_get(dg).bound_box]
        cx = (max(v[0] for v in bb) + min(v[0] for v in bb)) / 2
        cy = (max(v[1] for v in bb) + min(v[1] for v in bb)) / 2
        zmin = min(v[2] for v in bb)
        ob.location = (ob.location[0] + loc[0] - cx,
                       ob.location[1] + loc[1] - cy,
                       ob.location[2] + loc[2] - zmin)
        ob.rotation_euler = (ob.rotation_euler[0], ob.rotation_euler[1],
                             ob.rotation_euler[2] + math.radians(rz))
        placed.append(ob)
        print('DRESSED %s -> %.2fm at %s' % (ob.name[:28], size_m, loc))
    return placed

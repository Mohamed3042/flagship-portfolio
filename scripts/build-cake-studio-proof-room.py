"""Author Cake Studio's connected proof room, hero sheet rig and camera tracks."""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path.cwd()
OUTPUT_DIR = ROOT / "public" / "worlds" / "cake-studio" / "set"
OUTPUT_GLB = OUTPUT_DIR / "cake-studio-proof-room.glb"
OUTPUT_MANIFEST = OUTPUT_DIR / "manifest.json"
FRAME_END = 240
FPS = 24


def material(name: str, color: tuple[float, float, float, float], *, metallic=0.0, roughness=0.5,
             emission: tuple[float, float, float, float] | None = None, emission_strength=0.0,
             transmission=0.0, alpha=1.0) -> bpy.types.Material:
    value = bpy.data.materials.new(name)
    value.diffuse_color = color
    value.use_nodes = True
    principled = value.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = color
    principled.inputs["Metallic"].default_value = metallic
    principled.inputs["Roughness"].default_value = roughness
    if "Coat Weight" in principled.inputs:
        principled.inputs["Coat Weight"].default_value = 0.32 if metallic else 0.12
    if emission:
        principled.inputs["Emission Color"].default_value = emission
        principled.inputs["Emission Strength"].default_value = emission_strength
    if transmission:
        principled.inputs["Transmission Weight"].default_value = transmission
    if alpha < 1:
        principled.inputs["Alpha"].default_value = alpha
        value.surface_render_method = "DITHERED"
    return value


def empty(name: str, parent=None) -> bpy.types.Object:
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.empty_display_type = "CUBE"
    obj.empty_display_size = 0.35
    obj.parent = parent
    return obj


def box(name: str, size, location, mat, parent, *, bevel=0.05) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    obj.parent = parent
    if bevel:
        modifier = obj.modifiers.new("Architectural edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def cylinder(name: str, radius: float, depth: float, location, mat, parent, *, vertices=64) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    obj.parent = parent
    bevel = obj.modifiers.new("Turntable edge", "BEVEL")
    bevel.width = 0.055
    bevel.segments = 2
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return obj


def torus(name: str, major: float, minor: float, location, rotation, mat, parent) -> bpy.types.Object:
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major,
        minor_radius=minor,
        major_segments=64,
        minor_segments=10,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    obj.parent = parent
    return obj


def set_auto_clamped(action: bpy.types.Action) -> None:
    """Keep authored scroll animation reversible without spline overshoot."""
    if hasattr(action, "fcurves"):
        fcurves = list(action.fcurves)
    else:
        fcurves = [
            fcurve
            for layer in action.layers
            for strip in layer.strips
            for channelbag in strip.channelbags
            for fcurve in channelbag.fcurves
        ]
    for fcurve in fcurves:
        for point in fcurve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def create_hero_sheet(parent, ivory, rose_gold) -> dict[str, bpy.types.Object]:
    """Create a real 11-bone skinned edible sheet matching shot 50's ivory/copper form."""
    width = 5.75
    height = 3.24
    columns = 55
    rows = 28
    bone_count = 11

    vertices = []
    faces = []
    for row in range(rows + 1):
        z = -height / 2 + height * row / rows
        for column in range(columns + 1):
            x = -width / 2 + width * column / columns
            vertices.append((x, 0.0, z))
    stride = columns + 1
    for row in range(rows):
        for column in range(columns):
            a = row * stride + column
            b = a + 1
            d = (row + 1) * stride + column
            c = d + 1
            faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new("HeroSheet_Mesh_Geometry")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    sheet = bpy.data.objects.new("HeroSheet_Mesh", mesh)
    bpy.context.collection.objects.link(sheet)
    sheet.data.materials.append(ivory)
    sheet.data.materials.append(rose_gold)
    sheet["heroRole"] = "shot-50-edible-sheet"
    sheet["physicalSize"] = [width, height]

    # Preserve the copper edge from the final film frame as actual geometry/material,
    # not a screen-space decorative border.
    for polygon in mesh.polygons:
        edge_face = False
        for vertex_index in polygon.vertices:
            row = vertex_index // stride
            column = vertex_index % stride
            if row in (0, rows) or column in (0, columns):
                edge_face = True
                break
        polygon.material_index = 1 if edge_face else 0

    uv_layer = mesh.uv_layers.new(name="HeroSheet_UV")
    for loop in mesh.loops:
        vertex = mesh.vertices[loop.vertex_index].co
        uv_layer.data[loop.index].uv = (
            vertex.x / width + 0.5,
            vertex.z / height + 0.5,
        )

    armature_data = bpy.data.armatures.new("HeroSheet_Rig_Armature")
    rig = bpy.data.objects.new("HeroSheet_Rig", armature_data)
    bpy.context.collection.objects.link(rig)
    rig.parent = parent
    rig["heroRole"] = "scroll-scrubbed-sheet-carrier"
    rig["boneCount"] = bone_count
    rig.show_in_front = True

    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    segment = width / bone_count
    previous = None
    for index in range(bone_count):
        bone = armature_data.edit_bones.new(f"SheetBone_{index:02d}")
        bone.head = (-width / 2 + index * segment, 0, 0)
        bone.tail = (-width / 2 + (index + 1) * segment, 0, 0)
        bone.use_deform = True
        if previous:
            bone.parent = previous
            bone.use_connect = True
        previous = bone
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.select_set(False)

    sheet.parent = rig
    modifier = sheet.modifiers.new("HeroSheet skin", "ARMATURE")
    modifier.object = rig
    modifier.use_deform_preserve_volume = True

    # Smooth two-bone weights across every column so bending remains edible-sheet soft.
    groups = [sheet.vertex_groups.new(name=f"SheetBone_{index:02d}") for index in range(bone_count)]
    for vertex in mesh.vertices:
        normalized = (vertex.co.x + width / 2) / width * bone_count - 0.5
        left = max(0, min(bone_count - 1, math.floor(normalized)))
        right = max(0, min(bone_count - 1, left + 1))
        blend = max(0.0, min(1.0, normalized - math.floor(normalized)))
        if left == right:
            groups[left].add([vertex.index], 1.0, "REPLACE")
        else:
            groups[left].add([vertex.index], 1.0 - blend, "REPLACE")
            groups[right].add([vertex.index], blend, "REPLACE")

    rig.animation_data_create()
    action = bpy.data.actions.new("HeroSheet_Journey_Action")
    rig.animation_data.action = action
    journey = [
        (1, (-9.2, -0.05, 1.2), (0.03, 0.0, -0.02), 1.00, 0.26),
        (18, (-9.2, 0.12, 1.2), (0.02, 0.0, -0.01), 0.98, 0.18),
        (54, (-8.8, 0.82, 1.42), (0.08, 0.10, -0.08), 0.72, 0.42),
        (82, (-4.3, 0.35, 1.52), (0.04, -0.18, 0.08), 0.58, 0.56),
        (112, (0.0, 0.54, 1.18), (0.0, 0.0, 0.0), 0.67, 0.12),
        (158, (0.55, 1.05, 1.68), (-0.07, 0.18, -0.05), 0.55, 0.70),
        (181, (5.55, 0.48, 1.35), (0.03, -0.16, 0.06), 0.62, 0.46),
        (214, (9.2, 3.46, 1.64), (0.0, 0.0, 0.0), 0.88, 0.20),
        (228, (9.2, 5.72, 1.64), (0.0, 0.0, 0.0), 0.98, 0.08),
        (240, (9.2, 8.35, 1.64), (0.0, 0.0, 0.0), 1.16, 0.03),
    ]
    for frame, location, rotation, scale, curl in journey:
        rig.location = location
        rig.rotation_mode = "XYZ"
        rig.rotation_euler = rotation
        rig.scale = (scale, scale, scale)
        rig.keyframe_insert("location", frame=frame, group="HeroSheet_Journey")
        rig.keyframe_insert("rotation_euler", frame=frame, group="HeroSheet_Journey")
        rig.keyframe_insert("scale", frame=frame, group="HeroSheet_Journey")
        for index, pose_bone in enumerate(rig.pose.bones):
            phase = index / max(1, bone_count - 1)
            pose_bone.rotation_mode = "XYZ"
            wave = math.sin(phase * math.tau + frame * 0.035) * curl
            arch = (phase - 0.5) * curl * 0.34
            pose_bone.rotation_euler = (wave, 0.0, arch)
            pose_bone.keyframe_insert("rotation_euler", frame=frame, group="HeroSheet_Journey")

    set_auto_clamped(action)
    track = rig.animation_data.nla_tracks.new()
    track.name = "HeroSheet_Journey"
    strip = track.strips.new("HeroSheet_Journey", 1, action)
    strip.name = "HeroSheet_Journey"
    rig.animation_data.action = None
    return {"rig": rig, "mesh": sheet}


def create_room() -> dict[str, bpy.types.Object]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = FRAME_END
    scene.render.fps = 24

    deep_green = material("Atelier deep green", (0.018, 0.065, 0.052, 1), roughness=0.42)
    green_plaster = material("Archive green plaster", (0.028, 0.13, 0.105, 1), roughness=0.64)
    black_stone = material("Assembly black stone", (0.012, 0.019, 0.018, 1), metallic=0.16, roughness=0.22)
    ivory = material("Handoff ivory", (0.72, 0.61, 0.48, 1), roughness=0.53)
    rose_gold = material("Rose gold datum", (0.62, 0.25, 0.15, 1), metallic=0.78, roughness=0.2)
    teal_light = material(
        "Teal practical light", (0.08, 0.56, 0.45, 1), roughness=0.26,
        emission=(0.04, 0.9, 0.68, 1), emission_strength=4.2,
    )
    amber_light = material(
        "Warm practical light", (0.76, 0.37, 0.2, 1), roughness=0.24,
        emission=(1.0, 0.35, 0.16, 1), emission_strength=3.1,
    )
    smoked_glass = material(
        "Smoked glass", (0.035, 0.18, 0.15, 0.25), roughness=0.13,
        transmission=0.74, alpha=0.28,
    )

    proof = empty("ProofRoom")
    archive = empty("Zone_Archive", proof)
    assembly = empty("Zone_Assembly", proof)
    handoff = empty("Zone_Handoff", proof)
    spine = empty("ProofRoom_ContinuousSpine", proof)
    foreground = empty("Layer_Foreground", proof)
    midground = empty("Layer_Midground", proof)
    background = empty("Layer_Background", proof)
    anchor_forms = empty("Anchor_Forms_Content", proof)
    anchor_forms.location.x = -9.2
    anchor_assembly = empty("Anchor_Assembly_Content", proof)
    anchor_handoff = empty("Anchor_Handoff_Content", proof)
    anchor_handoff.location.x = 9.2

    # One continuous architecture: floor, back wall, ceiling datum and luminous runway.
    box("Continuous_Floor", (29.5, 16.0, 0.32), (0, 0.2, -1.35), black_stone, midground, bevel=0.08)
    # The back wall is physically segmented around the customer-frame opening.
    # This leaves a genuine camera passage instead of a dark rectangle pretending
    # to be an aperture.
    box("Continuous_BackWall_Left", (21.2, 0.36, 8.8), (-4.15, 5.2, 2.9), deep_green, background, bevel=0.06)
    box("Continuous_BackWall_Right", (2.9, 0.36, 8.8), (13.3, 5.2, 2.9), deep_green, background, bevel=0.06)
    box("Continuous_BackWall_PortalHeader", (5.4, 0.36, 2.55), (9.2, 5.2, 6.03), deep_green, background, bevel=0.06)
    box("Continuous_CeilingDatum", (29.0, 0.42, 0.34), (0, 2.3, 6.75), rose_gold, background, bevel=0.08)
    box("Continuous_Runway", (27.5, 0.12, 0.055), (0, -2.15, -1.12), teal_light, foreground, bevel=0.02)
    for x in (-4.35, 4.35):
        box(f"Passage_{x:+.2f}_Left", (0.26, 1.0, 7.2), (x - 1.75, 3.7, 2.3), rose_gold, spine, bevel=0.06)
        box(f"Passage_{x:+.2f}_Right", (0.26, 1.0, 7.2), (x + 1.75, 3.7, 2.3), rose_gold, spine, bevel=0.06)
        box(f"Passage_{x:+.2f}_Lintel", (3.75, 1.0, 0.27), (x, 3.7, 5.78), rose_gold, spine, bevel=0.06)

    # Archive: nine bays physically justify the first act's library layout.
    box("Archive_Alcove", (8.0, 0.68, 7.2), (-9.2, 4.68, 2.25), green_plaster, archive, bevel=0.18)
    for column in range(3):
        x = -11.75 + column * 2.55
        for row in range(3):
            z = -0.18 + row * 1.92
            form_anchor = empty(f"Anchor_Form_{row * 3 + column + 1:02d}", archive)
            form_anchor.location = (x, 3.15, z)
            box(f"Archive_Shelf_{column}_{row}", (2.16, 1.35, 0.12), (x, 3.96, z - 0.77), rose_gold, archive, bevel=0.025)
            box(f"Archive_Glass_{column}_{row}", (2.12, 0.06, 1.48), (x, 3.28, z), smoked_glass, archive, bevel=0.025)
    box("Archive_HeaderLight", (7.45, 0.15, 0.11), (-9.2, 3.83, 5.35), teal_light, archive, bevel=0.03)
    box("Archive_ForegroundBlade", (0.18, 3.6, 6.3), (-5.15, 0.9, 2.0), smoked_glass, foreground, bevel=0.05)

    # Assembly: a black-stone island, a measured halo and calibration marks.
    box("Assembly_Backdrop", (7.9, 0.52, 7.2), (0, 4.78, 2.25), deep_green, assembly, bevel=0.2)
    cylinder("Assembly_Dais", 3.15, 0.42, (0, 0.3, -0.96), black_stone, assembly, vertices=96)
    cylinder("Assembly_Turntable", 2.25, 0.16, (0, 0.3, -0.66), rose_gold, assembly, vertices=96)
    torus("Assembly_MeasureHalo", 2.82, 0.065, (0, 4.38, 2.45), (math.pi / 2, 0, 0), teal_light, assembly)
    for index in range(9):
        angle = index / 9 * math.tau
        box(
            f"Assembly_Calibration_{index:02d}", (0.055, 0.12, 0.42),
            (math.cos(angle) * 2.82, 4.28, 2.45 + math.sin(angle) * 2.82),
            ivory, assembly, bevel=0.015,
        ).rotation_euler.y = -angle
    box("Assembly_LightKnife", (0.12, 0.15, 6.15), (3.35, 4.35, 2.25), amber_light, assembly, bevel=0.03)
    box("Assembly_ForegroundBlade", (0.16, 3.2, 5.7), (4.05, 0.6, 1.7), smoked_glass, foreground, bevel=0.05)

    # Handoff: a destination, not another prop lineup. The portal is the composition.
    box("Handoff_Alcove_Left", (1.18, 0.64, 7.2), (5.95, 4.7, 2.25), ivory, handoff, bevel=0.2)
    box("Handoff_Alcove_Right", (1.18, 0.64, 7.2), (12.45, 4.7, 2.25), ivory, handoff, bevel=0.2)
    box("Handoff_Alcove_Header", (5.35, 0.64, 1.24), (9.2, 4.7, 5.98), ivory, handoff, bevel=0.18)
    box("Handoff_Portal_Left", (0.28, 0.72, 5.9), (6.55, 4.22, 1.65), rose_gold, handoff, bevel=0.08)
    box("Handoff_Portal_Right", (0.28, 0.72, 5.9), (11.85, 4.22, 1.65), rose_gold, handoff, bevel=0.08)
    box("Handoff_Portal_Header", (5.58, 0.72, 0.3), (9.2, 4.22, 4.6), rose_gold, handoff, bevel=0.08)
    aperture = empty("CustomerFrame_Aperture", handoff)
    aperture.location = (9.2, 4.22, 1.65)
    aperture["width"] = 5.1
    aperture["height"] = 5.45
    aperture["planeY"] = 4.22
    aperture["cameraCrossing"] = True
    semantic_plane = empty("Portal_SemanticPlane", handoff)
    semantic_plane.location = (9.2, 8.35, 1.65)
    semantic_plane["surface"] = "order-fulfilment-workflow"
    semantic_plane["presentation"] = "semantic-dom"
    # A shallow portal tunnel makes the plane crossing visible in parallax.
    box("Portal_Tunnel_Left", (0.12, 4.15, 5.4), (6.72, 6.28, 1.65), deep_green, handoff, bevel=0.025)
    box("Portal_Tunnel_Right", (0.12, 4.15, 5.4), (11.68, 6.28, 1.65), deep_green, handoff, bevel=0.025)
    box("Portal_Tunnel_Header", (5.08, 4.15, 0.12), (9.2, 6.28, 4.30), rose_gold, handoff, bevel=0.025)
    box("Handoff_Counter", (7.2, 2.4, 0.46), (9.2, 0.8, -0.83), black_stone, handoff, bevel=0.12)
    box("Handoff_CounterEdge", (6.8, 0.12, 0.09), (9.2, -0.42, -0.54), amber_light, handoff, bevel=0.025)
    for x in (6.85, 9.2, 11.55):
        box(f"Handoff_OutputDatum_{x:.2f}", (1.78, 0.08, 0.055), (x, -0.28, -0.54), rose_gold, handoff, bevel=0.015)
    box("Handoff_ForegroundBlade", (0.16, 3.7, 6.25), (13.18, 0.8, 1.98), smoked_glass, foreground, bevel=0.05)
    box("Handoff_HeaderLight", (5.05, 0.12, 0.1), (9.2, 3.8, 4.22), teal_light, handoff, bevel=0.025)

    hero = create_hero_sheet(proof, ivory, rose_gold)
    return {
        "proof": proof,
        "archive": archive,
        "assembly": assembly,
        "handoff": handoff,
        "heroRig": hero["rig"],
        "heroMesh": hero["mesh"],
        "aperture": aperture,
        "semanticPlane": semantic_plane,
    }


DESKTOP_KEYS = [
    (1, (-9.4, -13.0, 3.3), (-9.2, 0.0, 0.65), 35.0),
    (54, (-8.25, -10.6, 2.7), (-9.2, 0.7, 0.45), 32.0),
    (82, (-4.7, -11.4, 3.05), (-3.7, 0.5, 0.65), 36.0),
    (112, (-0.7, -10.5, 2.55), (0.0, 0.35, 0.65), 34.0),
    (158, (0.75, -9.15, 2.35), (0.0, 0.45, 0.75), 31.0),
    (181, (5.45, -10.8, 2.8), (6.4, 0.35, 0.65), 36.0),
    (200, (8.6, -6.4, 2.62), (9.2, 2.4, 1.12), 35.0),
    (214, (9.1, -2.15, 2.42), (9.2, 4.6, 1.42), 33.0),
    (225, (9.2, 3.35, 2.15), (9.2, 7.3, 1.58), 32.0),
    (232, (9.2, 4.82, 2.0), (9.2, 8.0, 1.62), 31.0),
    (240, (9.2, 6.42, 1.92), (9.2, 8.75, 1.64), 30.0),
]

PHONE_KEYS = [
    (1, (-9.2, -33.5, 4.0), (-9.2, 0.0, -8.2), 43.0),
    (18, (-9.25, -16.4, 4.45), (-9.2, 0.1, 1.3), 43.0),
    (54, (-8.7, -14.1, 3.8), (-9.2, 0.55, 1.05), 41.0),
    (82, (-4.45, -15.2, 4.15), (-3.55, 0.35, 1.25), 44.0),
    (112, (-0.35, -14.0, 3.65), (0.0, 0.3, 1.05), 42.0),
    (158, (0.4, -12.7, 3.5), (0.0, 0.4, 1.05), 40.0),
    (181, (5.7, -14.8, 4.0), (6.55, 0.3, 1.15), 44.0),
    (200, (8.75, -8.4, 3.8), (9.2, 2.6, 1.45), 43.0),
    (214, (9.15, -3.15, 3.25), (9.2, 4.8, 1.58), 42.0),
    (225, (9.2, 3.2, 2.9), (9.2, 7.4, 1.62), 41.0),
    (232, (9.2, 4.72, 2.72), (9.2, 8.05, 1.64), 40.0),
    (240, (9.2, 6.25, 2.48), (9.2, 8.8, 1.64), 39.0),
]


def camera_with_track(name: str, keys, parent) -> bpy.types.Object:
    data = bpy.data.cameras.new(name)
    data.sensor_fit = "VERTICAL"
    data.sensor_height = 32
    data.lens = 32 / (2 * math.tan(math.radians(keys[0][3]) / 2))
    data.sensor_width = 36
    data.clip_start = 0.1
    data.clip_end = 100
    camera = bpy.data.objects.new(name, data)
    camera["fovCurve"] = json.dumps(
        [[round(frame / FPS, 6), fov] for frame, _position, _target, fov in keys],
        separators=(",", ":"),
    )
    bpy.context.collection.objects.link(camera)
    camera.parent = parent
    camera.animation_data_create()
    action = bpy.data.actions.new(f"{name}_Action")
    camera.animation_data.action = action
    for frame, position, target, fov in keys:
        camera.location = position
        direction = Vector(target) - camera.location
        camera.rotation_mode = "QUATERNION"
        camera.rotation_quaternion = direction.to_track_quat("-Z", "Y")
        camera.keyframe_insert("location", frame=frame, group="ProofRoom_Cameras")
        camera.keyframe_insert("rotation_quaternion", frame=frame, group="ProofRoom_Cameras")
    set_auto_clamped(action)
    track = camera.animation_data.nla_tracks.new()
    track.name = "ProofRoom_Cameras"
    strip = track.strips.new("ProofRoom_Cameras", 1, action)
    strip.name = "ProofRoom_Cameras"
    camera.animation_data.action = None
    return camera


def export() -> None:
    nodes = create_room()
    camera_with_track("Camera_Desktop", DESKTOP_KEYS, nodes["proof"])
    camera_with_track("Camera_Phone", PHONE_KEYS, nodes["proof"])
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    bpy.context.scene.frame_set(1)
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_GLB),
        export_format="GLB",
        use_selection=False,
        export_apply=False,
        export_cameras=True,
        export_animations=True,
        export_animation_mode="NLA_TRACKS",
        export_frame_range=True,
        export_force_sampling=True,
        export_image_format="AUTO",
        export_extras=True,
        export_yup=True,
    )
    manifest = {
        "schemaVersion": 1,
        "release": "1.5.0",
        "asset": OUTPUT_GLB.name,
        "generator": "Blender 5.1 original procedural proof-room authoring",
        "license": "Original work for Mohamed Mahmoud",
        "bytes": OUTPUT_GLB.stat().st_size,
        "sha256": hashlib.sha256(OUTPUT_GLB.read_bytes()).hexdigest(),
        "zones": ["Zone_Archive", "Zone_Assembly", "Zone_Handoff"],
        "depthLayers": ["Layer_Foreground", "Layer_Midground", "Layer_Background"],
        "cameras": ["Camera_Desktop", "Camera_Phone"],
        "animation": "ProofRoom_Cameras",
        "animations": ["ProofRoom_Cameras", "HeroSheet_Journey"],
        "heroSheet": {
            "rig": "HeroSheet_Rig",
            "mesh": "HeroSheet_Mesh",
            "bones": 11,
            "bonePrefix": "SheetBone_",
            "animation": "HeroSheet_Journey",
            "sourceShot": "CST-050",
        },
        "portal": {
            "aperture": "CustomerFrame_Aperture",
            "semanticPlane": "Portal_SemanticPlane",
            "planeY": 4.22,
            "cameraCrossing": True,
        },
        "fovCurves": {
            "Camera_Desktop": [[frame, fov] for frame, _position, _target, fov in DESKTOP_KEYS],
            "Camera_Phone": [[frame, fov] for frame, _position, _target, fov in PHONE_KEYS],
        },
        "frames": [1, FRAME_END],
        "fps": FPS,
        "zoneCenters": {"forms": -9.2, "assembly": 0.0, "handoff": 9.2},
    }
    OUTPUT_MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"CAKE_STUDIO_PROOF_ROOM_OK bytes={manifest['bytes']} zones=3 cameras=2 "
        f"bones=11 animations=2 aperture=crossed output={OUTPUT_GLB}",
        flush=True,
    )


if __name__ == "__main__":
    export()

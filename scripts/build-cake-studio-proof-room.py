"""Author Cake Studio's connected proof room and two scroll-scrub camera tracks."""

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
    box("Continuous_BackWall", (29.5, 0.36, 8.8), (0, 5.2, 2.9), deep_green, background, bevel=0.06)
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
    box("Handoff_Alcove", (8.0, 0.64, 7.2), (9.2, 4.7, 2.25), ivory, handoff, bevel=0.2)
    box("Handoff_Portal_Left", (0.28, 0.72, 5.9), (6.55, 4.22, 1.65), rose_gold, handoff, bevel=0.08)
    box("Handoff_Portal_Right", (0.28, 0.72, 5.9), (11.85, 4.22, 1.65), rose_gold, handoff, bevel=0.08)
    box("Handoff_Portal_Header", (5.58, 0.72, 0.3), (9.2, 4.22, 4.6), rose_gold, handoff, bevel=0.08)
    box("Handoff_PortalVoid", (5.1, 0.12, 5.45), (9.2, 4.12, 1.72), deep_green, handoff, bevel=0.16)
    box("Handoff_Counter", (7.2, 2.4, 0.46), (9.2, 0.8, -0.83), black_stone, handoff, bevel=0.12)
    box("Handoff_CounterEdge", (6.8, 0.12, 0.09), (9.2, -0.42, -0.54), amber_light, handoff, bevel=0.025)
    for x in (6.85, 9.2, 11.55):
        box(f"Handoff_OutputDatum_{x:.2f}", (1.78, 0.08, 0.055), (x, -0.28, -0.54), rose_gold, handoff, bevel=0.015)
    box("Handoff_ForegroundBlade", (0.16, 3.7, 6.25), (13.18, 0.8, 1.98), smoked_glass, foreground, bevel=0.05)
    box("Handoff_HeaderLight", (5.05, 0.12, 0.1), (9.2, 3.8, 4.22), teal_light, handoff, bevel=0.025)

    return {"proof": proof, "archive": archive, "assembly": assembly, "handoff": handoff}


DESKTOP_KEYS = [
    (1, (-9.4, -13.0, 3.3), (-9.2, 0.0, 0.65), 35.0),
    (54, (-8.25, -10.6, 2.7), (-9.2, 0.7, 0.45), 32.0),
    (82, (-4.7, -11.4, 3.05), (-3.7, 0.5, 0.65), 36.0),
    (112, (-0.7, -10.5, 2.55), (0.0, 0.35, 0.65), 34.0),
    (158, (0.75, -9.15, 2.35), (0.0, 0.45, 0.75), 31.0),
    (181, (5.45, -10.8, 2.8), (6.4, 0.35, 0.65), 36.0),
    (214, (9.0, -10.1, 2.55), (9.2, 0.35, 0.55), 33.0),
    (240, (9.2, -7.55, 2.2), (9.2, 1.9, 0.72), 30.0),
]

PHONE_KEYS = [
    (1, (-9.2, -33.5, 4.0), (-9.2, 0.0, -8.2), 43.0),
    (18, (-9.25, -16.4, 4.45), (-9.2, 0.1, 1.3), 43.0),
    (54, (-8.7, -14.1, 3.8), (-9.2, 0.55, 1.05), 41.0),
    (82, (-4.45, -15.2, 4.15), (-3.55, 0.35, 1.25), 44.0),
    (112, (-0.35, -14.0, 3.65), (0.0, 0.3, 1.05), 42.0),
    (158, (0.4, -12.7, 3.5), (0.0, 0.4, 1.05), 40.0),
    (181, (5.7, -14.8, 4.0), (6.55, 0.3, 1.15), 44.0),
    (214, (9.15, -13.8, 3.65), (9.2, 0.3, 1.0), 42.0),
    (240, (9.2, -10.6, 3.15), (9.2, 1.9, 1.05), 40.0),
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
        "release": "1.4.0",
        "asset": OUTPUT_GLB.name,
        "generator": "Blender 5.1 original procedural proof-room authoring",
        "license": "Original work for Mohamed Mahmoud",
        "bytes": OUTPUT_GLB.stat().st_size,
        "sha256": hashlib.sha256(OUTPUT_GLB.read_bytes()).hexdigest(),
        "zones": ["Zone_Archive", "Zone_Assembly", "Zone_Handoff"],
        "depthLayers": ["Layer_Foreground", "Layer_Midground", "Layer_Background"],
        "cameras": ["Camera_Desktop", "Camera_Phone"],
        "animation": "ProofRoom_Cameras",
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
        f"animation={manifest['animation']} output={OUTPUT_GLB}",
        flush=True,
    )


if __name__ == "__main__":
    export()

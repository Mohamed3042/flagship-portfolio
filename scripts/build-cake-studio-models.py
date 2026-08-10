"""Build the Cake Studio source GLBs into bounded, self-contained web assets."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path.cwd()
SOURCE_MANIFEST = ROOT / "production" / "cake-studio" / "hunyuan3d" / "asset-manifest.json"
SOURCE_DIR = ROOT / "production" / "cake-studio" / "hunyuan3d" / "generated-glb"
OUTPUT_DIR = ROOT / "public" / "worlds" / "cake-studio" / "models"
OUTPUT_MANIFEST = OUTPUT_DIR / "manifest.json"
TEXTURE_MAX_EDGE = 1024

TARGET_TRIANGLES = {
    "cake-01": 100_000,
    "cake-02": 85_000,
    "cake-03": 80_000,
    "cake-04": 80_000,
    "cake-05": 80_000,
    "cake-06": 120_000,
    "cake-07": 85_000,
    "cake-08": 100_000,
    "cake-09": 140_000,
    "assembly-10": 100_000,
    "assembly-11": 60_000,
    "assembly-12": 60_000,
    "assembly-13": 60_000,
    "assembly-14": 80_000,
    "wafer-a": 45_000,
    "wafer-b": 45_000,
    "wafer-c": 45_000,
    "wafer-d": 45_000,
    "wordmark-choose": 75_000,
    "wordmark-assemble": 75_000,
    "wordmark-handoff": 75_000,
    "handoff-frame": 70_000,
    "handoff-sheet": 45_000,
    "handoff-plaque": 45_000,
}


def world_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    minimum = Vector(tuple(min(point[axis] for point in points) for axis in range(3)))
    maximum = Vector(tuple(max(point[axis] for point in points) for axis in range(3)))
    return minimum, maximum


def triangle_count(objects: list[bpy.types.Object]) -> int:
    total = 0
    for obj in objects:
        obj.data.calc_loop_triangles()
        total += len(obj.data.loop_triangles)
    return total


def remove_unstable_normal_maps() -> None:
    """Generated tangent-space normals break after aggressive topology reduction."""
    for material in bpy.data.materials:
        if not material.use_nodes or not material.node_tree:
            continue
        principled = material.node_tree.nodes.get("Principled BSDF")
        if not principled:
            continue
        normal_input = principled.inputs.get("Normal")
        if normal_input and normal_input.is_linked:
            for link in list(normal_input.links):
                material.node_tree.links.remove(link)
        roughness = principled.inputs.get("Roughness")
        if roughness:
            roughness.default_value = max(0.4, roughness.default_value)


def resize_textures() -> None:
    for image in bpy.data.images:
        if image.source == "VIEWER" or image.size[0] < 2 or image.size[1] < 2:
            continue
        maximum = max(image.size)
        if maximum > TEXTURE_MAX_EDGE:
            scale = TEXTURE_MAX_EDGE / maximum
            image.scale(max(1, round(image.size[0] * scale)), max(1, round(image.size[1] * scale)))
        image.pack()


def decimate(objects: list[bpy.types.Object], target: int) -> None:
    before = triangle_count(objects)
    ratio = min(1.0, target / max(1, before))
    if ratio >= 0.999:
        return
    for obj in objects:
        modifier = obj.modifiers.new(name="Cake Studio web decimation", type="DECIMATE")
        modifier.decimate_type = "COLLAPSE"
        modifier.ratio = ratio
        modifier.use_collapse_triangulate = True
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        obj.select_set(False)


def normalize(asset_id: str, objects: list[bpy.types.Object]) -> list[float]:
    minimum, maximum = world_bounds(objects)
    dimensions = maximum - minimum
    longest = max(dimensions)
    scale = 2.0 / max(longest, 1e-6)
    center = (minimum + maximum) * 0.5
    root = bpy.data.objects.new(asset_id, None)
    bpy.context.collection.objects.link(root)
    for obj in [item for item in bpy.context.scene.objects if item is not root and item.parent is None]:
        world = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = world
    root.scale = (scale, scale, scale)
    root.location = (-center.x * scale, -center.y * scale, -minimum.z * scale)
    return [round(value * scale, 6) for value in dimensions]


def export_glb(output_path: Path) -> None:
    bpy.ops.export_scene.gltf(
        filepath=str(output_path),
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_animations=False,
        export_image_format="JPEG",
        export_image_quality=78,
        export_use_gltfpack=False,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=12,
        export_draco_texcoord_quantization=12,
    )


def build_asset(asset: dict) -> dict:
    source_path = SOURCE_DIR / asset["output"]
    output_path = OUTPUT_DIR / asset["output"]
    if not source_path.is_file():
        raise FileNotFoundError(source_path)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source_path))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError(f"{asset['id']} contains no mesh objects")

    source_triangles = triangle_count(meshes)
    target = TARGET_TRIANGLES[asset["id"]]
    decimate(meshes, target)
    remove_unstable_normal_maps()
    resize_textures()
    normalized_dimensions = normalize(asset["id"], meshes)
    triangles = triangle_count(meshes)
    export_glb(output_path)

    record = {
        "id": asset["id"],
        "file": asset["output"],
        "role": asset["role"],
        "sourceBytes": source_path.stat().st_size,
        "bytes": output_path.stat().st_size,
        "sourceTriangles": source_triangles,
        "triangles": triangles,
        "normalizedDimensions": normalized_dimensions,
        "sha256": hashlib.sha256(output_path.read_bytes()).hexdigest(),
    }
    print(
        f"MODEL_OK {asset['id']} triangles={source_triangles}->{triangles} "
        f"bytes={record['sourceBytes']}->{record['bytes']}",
        flush=True,
    )
    return record


def main() -> None:
    source_manifest = json.loads(SOURCE_MANIFEST.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    records = [build_asset(asset) for asset in source_manifest["assets"]]
    manifest = {
        "schemaVersion": 1,
        "release": "1.3.0",
        "generator": "Blender 5.1 Cake Studio web pipeline",
        "compression": "KHR_draco_mesh_compression",
        "texturePolicy": "JPEG quality 78, max edge 1024, generated normal map removed",
        "normalization": "longest axis 2 units, horizontal center, base at zero",
        "totalSourceBytes": sum(record["sourceBytes"] for record in records),
        "totalBytes": sum(record["bytes"] for record in records),
        "totalTriangles": sum(record["triangles"] for record in records),
        "assets": records,
    }
    OUTPUT_MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"CAKE_STUDIO_MODELS_OK assets={len(records)} bytes={manifest['totalBytes']} "
        f"triangles={manifest['totalTriangles']} manifest={OUTPUT_MANIFEST}",
        flush=True,
    )


if __name__ == "__main__":
    main()

"""GPU probe: enumerate Cycles devices, render one small frame, report timing."""
import bpy, time, sys

prefs = bpy.context.preferences.addons['cycles'].preferences
report = []
for backend in ('OPTIX', 'CUDA', 'NONE'):
    try:
        prefs.compute_device_type = backend
    except TypeError:
        report.append(f'{backend}: unsupported')
        continue
    prefs.get_devices()
    names = [(d.name, d.type, d.use) for d in prefs.devices]
    report.append(f'{backend}: {names}')
    if backend != 'NONE':
        break

# enable every non-CPU device
for d in prefs.devices:
    d.use = (d.type != 'CPU')

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 64
scene.render.resolution_x = 640
scene.render.resolution_y = 320
scene.render.filepath = sys.argv[-1]
scene.render.image_settings.file_format = 'PNG'

# minimal scene: default cube exists in the startup file
t0 = time.time()
bpy.ops.render.render(write_still=True)
dt = time.time() - t0

print('PROBE_DEVICES ' + ' | '.join(report))
print(f'PROBE_ENGINE {scene.render.engine} device={scene.cycles.device}')
print(f'PROBE_TIME {dt:.2f}s for 64spp @640x320')
print(f'PROBE_VIEW {scene.view_settings.view_transform}')

"""SPOTIFY — "The Album".
Hero shot: the needle comes down. A record turning under practical stage
colour, groove detail at macro, and contact landing on the downbeat.
"""
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as H

FRAMES = int(os.environ.get('FRAMES', 72))
GREEN = (0.09, 0.72, 0.30)
PINK = (1.0, 0.20, 0.55)
VIOLET = (0.42, 0.30, 1.0)

H.setup_gpu()
H.init(res=(1280, 640), frames=FRAMES, samples=int(os.environ.get('SAMPLES', 128)),
       look='AgX - High Contrast', exposure=0.55)
H.world_sky(top=(0.010, 0.008, 0.008), bottom=(0.004, 0.003, 0.003), strength=1.0)
H.world_haze(density=0.010, color=(0.85, 0.55, 0.75), anisotropy=0.5)

# ── the deck ──
plinth = H.cube(loc=(0, 0, -0.20), scale=(3.4, 2.7, 0.20), name='Plinth')
pm = H.pbr('Plinth', base=(0.030, 0.026, 0.025), rough=0.36)
H.rough_variation(pm, scale=70, low=0.26, high=0.52, bump=0.4)
H.assign(plinth, pm)
H.bevel(plinth, width=0.03, segments=4)
H.assign(H.plane(loc=(0, 0, -0.41), size=50),
         H.pbr('Floor', base=(0.014, 0.012, 0.013), rough=0.30))

platter = H.cyl(loc=(0, 0, 0.02), r=2.05, depth=0.10, verts=128, name='Platter')
H.assign(platter, H.pbr('PlatterAlu', base=(0.10, 0.10, 0.105), rough=0.28, metal=1.0))
H.bevel(platter, width=0.012, segments=3)

# ── the record: real concentric groove relief, not a texture cheat ──
rec = H.cyl(loc=(0, 0, 0.085), r=2.0, depth=0.022, verts=256, name='Record')
vm = H.pbr('Vinyl', base=(0.0075, 0.0075, 0.0080), rough=0.16)
nt = vm.node_tree
b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
tc = nt.nodes.new('ShaderNodeTexCoord')
sep = nt.nodes.new('ShaderNodeVectorMath')
sep.operation = 'LENGTH'
wav = nt.nodes.new('ShaderNodeMath')
wav.operation = 'MULTIPLY'
wav.inputs[1].default_value = 2200.0
sine = nt.nodes.new('ShaderNodeMath')
sine.operation = 'SINE'
bmp = nt.nodes.new('ShaderNodeBump')
bmp.inputs['Strength'].default_value = 0.55
bmp.inputs['Distance'].default_value = 0.0008
nt.links.new(tc.outputs['Object'], sep.inputs[0])
nt.links.new(sep.outputs['Value'], wav.inputs[0])
nt.links.new(wav.outputs['Value'], sine.inputs[0])
nt.links.new(sine.outputs['Value'], bmp.inputs['Height'])
nt.links.new(bmp.outputs['Normal'], b.inputs['Normal'])
H.assign(rec, vm)
H.keyframe(rec, 'rotation_euler', [(1, 0.0), (FRAMES, math.radians(-140))], index=2)

label = H.cyl(loc=(0, 0, 0.098), r=0.62, depth=0.004, verts=96, name='Label')
H.assign(label, H.pbr('Label', base=(0.36, 0.055, 0.14), rough=0.72))
H.keyframe(label, 'rotation_euler', [(1, 0.0), (FRAMES, math.radians(-140))], index=2)
H.assign(H.cyl(loc=(0, 0, 0.13), r=0.035, depth=0.09, verts=24, name='Spindle'),
         H.pbr('Spindle', base=(0.55, 0.55, 0.56), rough=0.2, metal=1.0))

# ── tonearm descending onto the lead-in groove ──
pivot = bpy.data.objects.new('ArmPivot', None)
pivot.location = (2.55, 1.55, 0.42)
bpy.context.collection.objects.link(pivot)
H.keyframe(pivot, 'rotation_euler',
           [(1, math.radians(15)), (int(FRAMES * 0.72), math.radians(-2.5)),
            (FRAMES, math.radians(-2.5))], index=1)
H.keyframe(pivot, 'rotation_euler',
           [(1, math.radians(26)), (int(FRAMES * 0.72), math.radians(3)),
            (FRAMES, math.radians(3))], index=2)

arm_mat = H.pbr('Arm', base=(0.14, 0.14, 0.145), rough=0.24, metal=1.0)
H.brushed(arm_mat, strength=0.2, scale=(300, 4, 300))
arm = H.cyl(loc=(-1.25, 0, 0), r=0.045, depth=2.6, rot=(0, math.radians(90), 0),
            verts=32, name='Arm')
arm.parent = pivot
H.assign(arm, arm_mat)
hs = H.cube(loc=(-2.52, 0, -0.10), scale=(0.16, 0.10, 0.09), name='Headshell')
hs.parent = pivot
H.assign(hs, H.pbr('Headshell', base=(0.030, 0.030, 0.032), rough=0.42))
H.bevel(hs, width=0.014, segments=3)
sty = H.cyl(loc=(-2.52, 0, -0.21), r=0.006, depth=0.10, verts=10, name='Stylus')
sty.parent = pivot
H.assign(sty, H.pbr('Stylus', base=(0.75, 0.75, 0.78), rough=0.08, metal=1.0))
cw = H.cyl(loc=(0.42, 0, 0), r=0.16, depth=0.30, rot=(0, math.radians(90), 0),
           verts=32, name='Counterweight')
cw.parent = pivot
H.assign(cw, arm_mat)
post = H.cyl(loc=(2.55, 1.55, 0.16), r=0.13, depth=0.55, verts=32, name='Post')
H.assign(post, arm_mat)

# the downbeat: contact blooms green exactly when the stylus lands
blip = H.sphere(loc=(0.06, 1.55, 0.10), r=0.05, segs=16, rings=8, name='Contact')
bm2 = H.emissive('Downbeat', (0.55, 1.0, 0.72), 0.0)
H.assign(blip, bm2)
H.keyframe(bm2.node_tree.nodes['Emission'].inputs['Strength'], 'default_value',
           [(1, 0.0), (int(FRAMES * 0.70), 0.0), (int(FRAMES * 0.76), 95.0),
            (FRAMES, 34.0)])

# ── light: stage practicals, one per accent ──
H.area(loc=(-4.6, -3.2, 4.4), rot=(math.radians(46), 0, math.radians(-46)),
       size=4.5, energy=520, color=(1.0, 0.96, 0.94))
H.area(loc=(4.8, 2.6, 2.2), rot=(math.radians(72), 0, math.radians(118)),
       size=3.0, energy=460, color=PINK)
H.area(loc=(-4.2, 4.0, 2.0), rot=(math.radians(74), 0, math.radians(-140)),
       size=3.0, energy=380, color=VIOLET)
g_l = H.point(loc=(0.06, 1.55, 0.35), energy=0.0, color=GREEN, radius=0.25)
H.keyframe(g_l.data, 'energy',
           [(1, 0.0), (int(FRAMES * 0.70), 0.0), (int(FRAMES * 0.77), 140.0), (FRAMES, 55.0)])

# ── camera: this shot's coverage, from the sequence table ──
import shots as SH
_spec = SH.SHOTS['spotify'][H.shot_no() - 1]
cam, tgt = H.camera(loc=_spec['keys'][0][1], target=_spec['keys'][0][2],
                    focal=_spec.get('focal', [(0, 45)])[0][1],
                    fstop=_spec.get('fstop', 2.8))
H.stage_shot(cam, tgt, _spec, FRAMES)
H.import_assets('spotify')

H.grade(hi=(1.02, 1.0, 1.02), mid=(1.0, 1.0, 1.0), lo=(0.006, 0.002, 0.006),
        glare=0.16, vignette=0.0)

H.render(H.out_arg('C:/Users/GAMING/Downloads/flagship-portfolio-git/render/out/spotify'))

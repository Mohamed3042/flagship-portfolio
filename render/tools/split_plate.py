#!/usr/bin/env python3
"""Cut a fused image-to-3D "plate" back into its individual props.

Hunyuan reconstructs ONE image into ONE mesh. Fed a contact sheet of eight
props it returns a single mesh containing all eight, spatially laid out. This
finds the subjects and writes each one as its own GLB.

Lifted from ARTILLERY3D/tools/split_plate.py, which does the same job for 3x3
DDTank sheets. Two things are dropped here because they do not apply:

  - the 3x3 grid and reading-order cell numbering. Those sheets always held
    exactly nine subjects in a known order and a manifest named them. These
    plates hold anywhere from four to eight and there is no manifest, so the
    subject COUNT is discovered rather than asserted, and pieces are numbered
    by size. Naming happens afterwards, by looking at them.
  - the sheet-identification step, for the same reason.

What is kept is the part that matters: find the subjects FIRST, by voxelising
and taking spatially connected lumps, instead of cutting the bounding box into
fixed fractions. An unevenly packed plate defeats a fixed cut.

Also reports, per piece, the fraction of its own bounding box depth against its
width — the number that says whether a piece is a real object or a shallow
relief with no back. Measured per PIECE, because measuring it on the whole
plate is meaningless: a grid of fully-3D props laid out in a plane has a flat
overall bounding box no matter how solid each prop is.

    python split_plate.py <plate.glb> [-o outdir] [--min-frac 0.02]
                          [--max-parts 12] [--voxel 128]
"""
from __future__ import annotations

import argparse
import os
import sys

import numpy as np
import trimesh


def load_plate(path):
    m = trimesh.load(path, process=False, force='mesh')
    if not isinstance(m, trimesh.Trimesh):
        raise SystemExit('%s did not load as a single mesh' % path)
    return m


def find_subjects(mesh, n=128, min_frac=0.02, max_parts=12, verbose=True):
    """Label every vertex with the subject it belongs to.

    Returns (labels, n_subjects). Labels index 0..n_subjects-1, ordered by
    descending vertex count so piece 0 is always the biggest thing on the
    plate.
    """
    from scipy import ndimage
    from scipy.spatial import cKDTree

    v = np.asarray(mesh.vertices, np.float32)
    lo, hi = v.min(0), v.max(0)
    g = np.clip(((v - lo) / np.maximum(hi - lo, 1e-9) * (n - 1)).astype(int),
                0, n - 1)
    occ = np.zeros((n, n, n), bool)
    occ[g[:, 0], g[:, 1], g[:, 2]] = True
    lab, count = ndimage.label(occ, np.ones((3, 3, 3)))
    vlab = lab[g[:, 0], g[:, 1], g[:, 2]]

    sizes = np.bincount(vlab, minlength=count + 1)
    sizes[0] = 0
    order = np.argsort(sizes)[::-1]
    keep = [int(i) for i in order[:max_parts] if sizes[i] > sizes.max() * min_frac]
    if verbose:
        print('  %d connected lumps, %d are subjects (%s verts)'
              % (count, len(keep), ', '.join(str(int(sizes[i])) for i in keep)))

    # Stray shards — a floating knob, a bit of base — join their nearest
    # subject rather than becoming a piece of their own.
    cent = np.array([v[vlab == i].mean(0) for i in keep])
    labels = cKDTree(cent).query(v)[1]
    return labels, len(keep)


def face_owner(mesh, labels):
    """Which subject owns each face: the majority of its three corners.

    Vectorised deliberately. The obvious np.bincount(...).argmax() per face is
    a Python-level loop over ~1.7M faces and does not finish in five minutes.
    For exactly three values the majority is decidable with two comparisons:
    if any two corners agree that value is the majority, otherwise all three
    differ and any of them will do.
    """
    a, b, c = labels[np.asarray(mesh.faces)].T
    return np.where(a == b, a, np.where(a == c, a, np.where(b == c, b, a)))


def submesh(mesh, own, k):
    """Extract subject k with its UVs and material intact."""
    sel = np.flatnonzero(own == k)
    if not len(sel):
        return None
    return mesh.submesh([sel], append=True, repair=False)


def depth_ratio(piece):
    """Shortest bbox side over longest, for ONE piece. Below about 0.08 the
    thing really is a flat relief; a normal prop lands 0.25-0.9."""
    e = piece.bounds[1] - piece.bounds[0]
    return float(e.min() / max(e.max(), 1e-9)), e


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('plate')
    ap.add_argument('-o', '--outdir', default=None)
    ap.add_argument('--min-frac', type=float, default=0.02)
    ap.add_argument('--max-parts', type=int, default=12)
    ap.add_argument('--voxel', type=int, default=128)
    a = ap.parse_args()

    tag = os.path.splitext(os.path.basename(a.plate))[0][:8]
    out = a.outdir or os.path.join(os.path.dirname(os.path.abspath(a.plate)),
                                   'split', tag)
    os.makedirs(out, exist_ok=True)

    m = load_plate(a.plate)
    print('%s: %d verts, %d faces' % (tag, len(m.vertices), len(m.faces)))
    labels, k = find_subjects(m, n=a.voxel, min_frac=a.min_frac,
                              max_parts=a.max_parts)

    own = face_owner(m, labels)
    wrote = 0
    for i in range(k):
        p = submesh(m, own, i)
        if p is None or len(p.faces) < 200:
            print('  piece %02d: too small, skipped' % i)
            continue
        r, e = depth_ratio(p)
        path = os.path.join(out, '%s_p%02d.glb' % (tag, i))
        p.export(path)
        wrote += 1
        print('  piece %02d: %7d faces  dims %.3f %.3f %.3f  depth_ratio %.3f  %s'
              % (i, len(p.faces), e[0], e[1], e[2], r,
                 'FLAT-RELIEF' if r < 0.08 else 'solid'))
    print('wrote %d pieces to %s' % (wrote, out))
    return 0


if __name__ == '__main__':
    sys.exit(main())

"""Watermark gate for the Wan clips that illustrate worlds/spotify.html.

Every clip Wan returns carries a burned-in "Wan" mark in the bottom-right.
It is burned into the SAME pixels of every clip, so it is the only thing that
is bright in ALL of them at once. That is the instrument: decode one frame per
file over a region, and keep the pixels that are bright in every single file.
Scene content differs per clip and cancels out; the mark does not. Nothing has
to be tuned against one plate's highlights — measured on the 25 source clips,
this reports the identical box (1748, 1011)-(1887, 1063) for the 7-clip room
set and the 18-clip mix set independently, which is the control proving it is
reading the mark and not the room.

Because the test is defined over a SET, run it on three or more files.

  probe <w:h:x:y> <frame> <files...>   report the common-bright bbox
  gate  <w:h:x:y> <frame> <files...>   same test on shipped files; a hit is RED

The gate must be shown to fail before it is believed: encode a few clips with
`scale` instead of `crop` (which keeps the mark) and run `gate` on those.
"""
import sys
import os
import subprocess

BRIGHT = 118        # the mark is drawn well above these plates' black level
MINPIX = 30         # fewer common pixels than this is noise, not a logo


def region_frame(path, n, cw, ch, cx, cy):
    """Decode frame n of one file, cropped to the region, as 8-bit grey."""
    cmd = ['ffmpeg', '-v', 'error', '-i', path,
           '-vf', rf'select=eq(n\,{n}),crop={cw}:{ch}:{cx}:{cy}',
           '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    out = subprocess.run(cmd, capture_output=True, check=True).stdout
    if len(out) != cw * ch:
        raise SystemExit(f'{os.path.basename(path)}: got {len(out)} bytes, want {cw * ch} '
                         f'— is the frame index past the end of the clip?')
    return out


def common_bright(files, n, cw, ch, cx, cy):
    mask = None
    for p in files:
        cur = bytes(1 if v > BRIGHT else 0 for v in region_frame(p, n, cw, ch, cx, cy))
        mask = cur if mask is None else bytes(a & b for a, b in zip(mask, cur))
    idx = [i for i, v in enumerate(mask) if v]
    if len(idx) < MINPIX:
        return None, len(idx)
    xs = [i % cw + cx for i in idx]
    ys = [i // cw + cy for i in idx]
    return (min(xs), min(ys), max(xs), max(ys)), len(idx)


def main(argv):
    if len(argv) < 4:
        raise SystemExit(__doc__)
    mode = argv[0]
    cw, ch, cx, cy = (int(v) for v in argv[1].split(':'))
    n = int(argv[2])
    files = argv[3:]
    if len(files) < 3:
        raise SystemExit('the test is defined over a SET — pass three or more files')
    box, count = common_bright(files, n, cw, ch, cx, cy)
    scope = f'{len(files)} files, region {cw}x{ch}+{cx}+{cy}, frame {n}'
    if mode == 'probe':
        print(f'common-bright: {count} px   bbox: {box}   [{scope}]')
        return 0
    if box:
        print(f'RED — the mark survived: {count} px at {box}   [{scope}]')
        return 1
    print(f'GREEN — no common-bright cluster ({count} px, floor {MINPIX})   [{scope}]')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

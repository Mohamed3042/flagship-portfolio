#!/usr/bin/env bash
set -u
BL="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="/c/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/render"
mkdir -p "$DEST"
F=${FRAMES:-48}; S=${SAMPLES:-36}
for w in astronomy razer disney cod netflix spotify apple samsung; do
  for n in 1 2 3 4; do
    tag="${w}-s${n}"
    if [ -f "$DEST/$tag.mp4" ]; then echo "### HAVE $tag"; continue; fi
    echo "### RENDER $tag $(date +%T)"
    rm -rf "$R/out/$tag"
    SHOT=$n RES_X=960 RES_Y=480 FRAMES=$F SAMPLES=$S "$BL" --background --factory-startup \
      --python "$R/w_$w.py" -- "$R/out/$tag" 2>&1 | grep -E "RENDER_DONE|Error:" | head -2
    # See batch.sh: grade against the requested count, not a fixed floor. This
    # one matters most — it deletes the frames after encoding, so a plate that
    # slipped through short could not be re-cut without a full re-render.
    c=$(ls "$R/out/$tag"/f_*.png 2>/dev/null | wc -l)
    if [ "$c" -ne "$F" ]; then echo "### SKIP $tag — $c of $F frames"; continue; fi
    ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$tag/f_%04d.png" \
      -c:v libx264 -pix_fmt yuv420p -crf 21 -g 4 -keyint_min 4 -sc_threshold 0 \
      -preset slow -movflags +faststart -an "$DEST/$tag.mp4"
    ffmpeg -y -loglevel error -i "$R/out/$tag/f_0001.png" -q:v 4 "$DEST/$tag.jpg"
    rm -rf "$R/out/$tag"
    echo "### ENCODED $tag $(du -h "$DEST/$tag.mp4" | cut -f1)"
  done
done
echo "### SEQUENCE COMPLETE $(date +%T)"

#!/usr/bin/env bash
set -u
BL="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="/c/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/render"
for w in samsung spotify; do
  echo "### RENDER $w $(date +%T)"
  rm -rf "$R/out/$w"
  RES_X=960 RES_Y=480 FRAMES=48 SAMPLES=40 "$BL" --background --factory-startup \
    --python "$R/w_$w.py" -- "$R/out/$w" 2>&1 | grep -E "RENDER_DONE|Error:" | head -2
  n=$(ls "$R/out/$w"/f_*.png 2>/dev/null | wc -l)
  [ "$n" -lt 8 ] && { echo "### SKIP $w ($n)"; continue; }
  ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$w/f_%04d.png" \
    -c:v libx264 -pix_fmt yuv420p -crf 21 -g 4 -keyint_min 4 -sc_threshold 0 \
    -preset slow -movflags +faststart -an "$DEST/$w.mp4"
  ffmpeg -y -loglevel error -i "$R/out/$w/f_0001.png" -q:v 4 "$DEST/$w.jpg"
  echo "### ENCODED $w"
done
echo "### RERENDER COMPLETE"

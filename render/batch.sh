#!/usr/bin/env bash
# Render every world hero shot, then encode each to a scroll-scrubbable mp4.
# One GPU, so the worlds run in sequence; ffmpeg is cheap and follows each.
set -u
BL="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="/c/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/render"
mkdir -p "$DEST"

for w in astronomy razer disney cod netflix spotify apple samsung; do
  echo "### RENDER $w $(date +%T)"
  rm -rf "$R/out/$w"
  FRAMES=${FRAMES:-72} SAMPLES=${SAMPLES:-110} "$BL" --background --factory-startup \
    --python "$R/w_$w.py" -- "$R/out/$w" 2>&1 | grep -E "RENDER_DONE|Error:|Traceback" | head -3

  n=$(ls "$R/out/$w"/f_*.png 2>/dev/null | wc -l)
  echo "### FRAMES $w = $n"
  [ "$n" -lt 8 ] && { echo "### SKIP-ENCODE $w"; continue; }

  # h264, dense keyframes so scroll-seeking lands frame-accurately and fast
  ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$w/f_%04d.png" \
    -c:v libx264 -pix_fmt yuv420p -crf 21 -g 4 -keyint_min 4 -sc_threshold 0 \
    -preset slow -movflags +faststart -an "$DEST/$w.mp4"
  # poster = the frame the scene opens on
  ffmpeg -y -loglevel error -i "$R/out/$w/f_0001.png" -q:v 4 "$DEST/$w.jpg"
  echo "### ENCODED $w $(du -h "$DEST/$w.mp4" | cut -f1)"
done
echo "### BATCH COMPLETE $(date +%T)"

#!/usr/bin/env bash
# SPOTIFY PULSE — "THE ALBUM": render 15 shots, encode each, cut the master.
#
#   ./film_batch.sh              render everything missing, then assemble
#   SHOTS="6 9" ./film_batch.sh  re-do just those shots
#   RES_X=1280 SAMPLES=64 ./film_batch.sh
#
# Per-shot mp4s are kept as well as the master: the page scrubs shots, the
# theater plays the film, and a bad shot can be re-rendered without paying for
# the other fourteen.
set -u
BL="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="C:/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/spotify"
mkdir -p "$DEST/shots"

RES_X=${RES_X:-1280}
SAMPLES=${SAMPLES:-40}
SHOTS=${SHOTS:-"1 2 3 4 5 6 7 8 9 10 11 12 13 14 15"}
NAMES=(line pulse room arm needle groove quantize lanes canyon t01 t02 t03 master chorus outro)

for n in $SHOTS; do
  nm=${NAMES[$((n-1))]}
  tag=$(printf "s%02d-%s" "$n" "$nm")
  out="$DEST/shots/$tag.mp4"
  if [ -f "$out" ] && [ -z "${FORCE:-}" ]; then echo "### HAVE $tag"; continue; fi
  echo "### RENDER $tag  $(date +%T)"
  rm -rf "$R/out/$tag"
  SHOT=$n RES_X=$RES_X SAMPLES=$SAMPLES BOUNCE=${BOUNCE:-6} HAZE=${HAZE:-0.010} "$BL" --background --factory-startup \
    --python "$R/film_spotify.py" -- "$R/out/$tag" 2>&1 \
    | grep -E "FILM_SHOT|RENDER_DONE|Error:" | head -4
  c=$(ls "$R/out/$tag"/f_*.png 2>/dev/null | wc -l)
  if [ "$c" -lt 8 ]; then echo "### SKIP $tag (only $c frames)"; continue; fi
  # Grain at encode, not in the compositor: it costs nothing, it lands after the
  # grade where real grain lives, and it hides the last of the denoiser's wax.
  ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$tag/f_%04d.png" \
    -vf "noise=alls=4:allf=t" \
    -c:v libx264 -pix_fmt yuv420p -crf 19 -preset slow -movflags +faststart -an \
    "$out"
  ffmpeg -y -loglevel error -i "$R/out/$tag/f_0001.png" -q:v 3 "$DEST/shots/$tag.jpg"
  rm -rf "$R/out/$tag"
  echo "### ENCODED $tag  $c frames  $(du -h "$out" | cut -f1)"
done

# ── the cut ────────────────────────────────────────────────────────────────
have=""
for n in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  nm=${NAMES[$((n-1))]}
  f="$DEST/shots/$(printf "s%02d-%s" "$n" "$nm").mp4"
  [ -f "$f" ] && have="$have$f\n"
done
cnt=$(printf "$have" | grep -c . || true)
echo "### ASSEMBLE  $cnt / 15 shots"
if [ "$cnt" -lt 15 ]; then echo "### PARTIAL CUT — missing shots are simply absent from the master"; fi
: > "$R/out/cut.txt"
printf "$have" | while read -r f; do [ -n "$f" ] && echo "file '$f'" >> "$R/out/cut.txt"; done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$R/out/cut.txt" -c copy \
  -movflags +faststart "$DEST/spotify-film.mp4"
ffmpeg -y -loglevel error -ss 3 -i "$DEST/spotify-film.mp4" -frames:v 1 -q:v 3 \
  "$DEST/spotify-film.jpg"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DEST/spotify-film.mp4")
echo "### MASTER $DEST/spotify-film.mp4  ${dur}s  $(du -h "$DEST/spotify-film.mp4" | cut -f1)"

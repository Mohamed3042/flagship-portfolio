#!/usr/bin/env bash
# SPOTIFY PULSE — "THE ALBUM": render 15 shots, encode each, cut the master.
#
#   ./film_batch.sh              render everything missing, then assemble
#   SHOTS="6 9" ./film_batch.sh  re-do just those shots
#   FORCE=1 ./film_batch.sh      re-render even shots that already have an mp4
#   RES_X=1280 SAMPLES=40 ./film_batch.sh
#
# Two encodes per shot, both straight from the PNG sequence so neither is a
# second generation:
#
#   shots/<tag>.mp4   -g 4   the scroll-scrubbed plate. The page drives
#                            video.currentTime from a scroll position, so a
#                            seek that lands between keyframes has to decode
#                            forward from the last one. At the x264 default
#                            (one keyframe per 250 frames) a five-second shot
#                            has exactly ONE, and every scrub decodes from
#                            frame 0. Dense keyframes cost bytes and buy the
#                            entire interaction.
#   master pieces     -g 48  played start to finish in the theater, where a
#                            short GOP is only wasted bytes.
set -u
BL="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="C:/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/spotify"
MP="$R/out/_master"
mkdir -p "$DEST/shots" "$MP"

# Render high, deliver right-sized. Downscaling 1920 -> 1280 at encode is also
# free supersampling — cleaner edges than a native 1280 render — while the
# master keeps the full scope frame for the theater.
RES_X=${RES_X:-1920}
SAMPLES=${SAMPLES:-128}
PLATE_W=${PLATE_W:-1280}
MASTER_W=${MASTER_W:-1920}
SHOTS=${SHOTS:-"1 2 3 4 5 6 7 8 9 10 11 12 13 14 15"}
NAMES=(line pulse room arm needle groove quantize lanes canyon t01 t02 t03 master chorus outro)

for n in $SHOTS; do
  nm=${NAMES[$((n-1))]}
  tag=$(printf "s%02d-%s" "$n" "$nm")
  out="$DEST/shots/$tag.mp4"
  if [ -f "$out" ] && [ -z "${FORCE:-}" ]; then echo "### HAVE $tag"; continue; fi
  echo "### RENDER $tag  $(date +%T)"
  rm -rf "$R/out/$tag"
  log="$R/out/$tag.log"
  SHOT=$n RES_X=$RES_X SAMPLES=$SAMPLES BOUNCE=${BOUNCE:-12} HAZE=${HAZE:-0.014} \
    TEX4K=${TEX4K:-1} "$BL" \
    --background --factory-startup --python "$R/film_spotify.py" -- "$R/out/$tag" \
    > "$log" 2>&1
  grep -E "FILM_SHOT|Error:" "$log" | head -3

  # A partial render must never encode. The old guard was `-lt 8`, a fixed
  # floor over a variable population: when the render was killed at frame 11 of
  # 96 the guard passed it and shipped an eleven-frame shot as a finished one.
  # Grade against what this shot actually declared it would render.
  want=$(grep -oE 'frames=[0-9]+' "$log" | head -1 | cut -d= -f2)
  have=$(ls "$R/out/$tag"/f_*.png 2>/dev/null | wc -l)
  if [ -z "$want" ] || [ "$have" -ne "$want" ]; then
    echo "### INCOMPLETE $tag — ${have} of ${want:-?} frames, not encoding"
    continue
  fi

  # Grain at encode, not in the compositor: it costs nothing, it lands after the
  # grade where real grain lives, and it hides the last of the denoiser's wax.
  ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$tag/f_%04d.png" \
    -vf "scale=${PLATE_W}:-2:flags=lanczos,noise=alls=3:allf=t" \
    -c:v libx264 -pix_fmt yuv420p -crf ${PLATE_CRF:-22} -preset slow \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart -an "$out"
  ffmpeg -y -loglevel error -framerate 24 -i "$R/out/$tag/f_%04d.png" \
    -vf "scale=${MASTER_W}:-2:flags=lanczos,noise=alls=3:allf=t" \
    -c:v libx264 -pix_fmt yuv420p -crf ${MASTER_CRF:-21} -preset slow \
    -g 48 -movflags +faststart -an "$MP/$tag.mp4"
  ffmpeg -y -loglevel error -i "$R/out/$tag/f_0001.png" \
    -vf "scale=${PLATE_W}:-2:flags=lanczos" -q:v 3 "$DEST/shots/$tag.jpg"
  # Keep the frames by default. Re-encoding to trade size against quality is
  # seconds; re-rendering to get them back is hours. KEEP_PNG=0 to reclaim
  # the ~5 GB once the cut is signed off.
  [ "${KEEP_PNG:-1}" = "0" ] && rm -rf "$R/out/$tag"
  echo "### ENCODED $tag  $have frames  plate $(du -h "$out" | cut -f1)  master $(du -h "$MP/$tag.mp4" | cut -f1)"
done

# ── the cut ────────────────────────────────────────────────────────────────
: > "$R/out/cut.txt"
cnt=0
for n in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  f="$MP/$(printf "s%02d-%s" "$n" "${NAMES[$((n-1))]}").mp4"
  if [ -f "$f" ]; then echo "file '$f'" >> "$R/out/cut.txt"; cnt=$((cnt+1)); fi
done
echo "### ASSEMBLE  $cnt / 15 shots"
if [ "$cnt" -eq 0 ]; then echo "### NOTHING TO CUT"; exit 1; fi
[ "$cnt" -lt 15 ] && echo "### PARTIAL CUT — the missing shots are absent from the master, not padded"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$R/out/cut.txt" -c copy \
  -movflags +faststart "$DEST/spotify-film.mp4"
ffmpeg -y -loglevel error -ss 3 -i "$DEST/spotify-film.mp4" -frames:v 1 -q:v 3 \
  "$DEST/spotify-film.jpg"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DEST/spotify-film.mp4")
echo "### MASTER  ${dur}s  $(du -h "$DEST/spotify-film.mp4" | cut -f1)"

#!/usr/bin/env bash
# Re-encode the shipped plates and master pieces from the kept PNG sequences.
# No re-render: this is the reason film_batch.sh keeps them (KEEP_PNG=1).
#
#   ./film_reencode.sh                 plates at g=12, master pieces at g=48
#   PLATE_G=24 PLATE_CRF=23 ./film_reencode.sh
#
# Why g=12 and not g=4:
#
# The page drives video.currentTime from scroll position, so the instinct is to
# pack keyframes densely and make every seek land on one. Measured in Chrome on
# these actual files, that instinct is wrong. Seek cost across g=4, 8, 12, 24
# and a single-keyframe encode was 3.9-9.9 ms max and 0.5-1.6 ms average, with
# NO correlation to keyframe density — a seven-second 1280x536 clip is small
# enough that the browser buffers and decodes it faster than the difference
# shows up.
#
# Size correlates, and steeply: for the same shot, g=4 is 1930 KB against
# 1043 KB at g=12 and 560 KB with one keyframe. Paying 3.4x the bytes for an
# unmeasurable seek win is a bad trade on a page a visitor downloads.
#
# g=12 is the middle: a keyframe every half second, which bounds the decode
# work for any seek on a cold cache or a weak mobile decoder — the case this
# test cannot reproduce — at roughly half the cost of g=4.
set -u
R="C:/Users/GAMING/Downloads/flagship-portfolio-git/render"
DEST="C:/Users/GAMING/Downloads/flagship-portfolio-git/public/worlds/spotify"
MP="$R/out/_master"
mkdir -p "$DEST/shots" "$MP"

PLATE_W=${PLATE_W:-1280}
MASTER_W=${MASTER_W:-1920}
PLATE_G=${PLATE_G:-12}
PLATE_CRF=${PLATE_CRF:-22}
MASTER_CRF=${MASTER_CRF:-21}
NAMES=(line pulse room arm needle groove quantize lanes canyon t01 t02 t03 master chorus outro)

done_n=0
for n in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  tag=$(printf "s%02d-%s" "$n" "${NAMES[$((n-1))]}")
  src="$R/out/$tag"
  [ -d "$src" ] || { echo "### NO FRAMES $tag — leaving its mp4 alone"; continue; }
  have=$(ls "$src"/f_*.png 2>/dev/null | wc -l)
  # Same guard as film_batch.sh, and for the same reason. A fixed floor here
  # (`-lt 2`) is not a completeness test: run while the batch is still working,
  # it happily encoded 18 of shot 4's 144 frames and shipped them as a finished
  # plate. Grade against what the shot declared it would render, so a directory
  # that is still filling up is skipped rather than published.
  want=$(grep -oE 'frames=[0-9]+' "$R/out/$tag.log" 2>/dev/null | head -1 | cut -d= -f2)
  if [ -z "$want" ] || [ "$have" -ne "$want" ]; then
    echo "### INCOMPLETE $tag — ${have} of ${want:-?} frames, leaving its mp4 alone"
    continue
  fi
  ffmpeg -y -loglevel error -framerate 24 -i "$src/f_%04d.png" \
    -vf "scale=${PLATE_W}:-2:flags=lanczos,noise=alls=3:allf=t" \
    -c:v libx264 -pix_fmt yuv420p -crf $PLATE_CRF -preset slow \
    -g $PLATE_G -keyint_min $PLATE_G -sc_threshold 0 \
    -movflags +faststart -an "$DEST/shots/$tag.mp4"
  ffmpeg -y -loglevel error -framerate 24 -i "$src/f_%04d.png" \
    -vf "scale=${MASTER_W}:-2:flags=lanczos,noise=alls=3:allf=t" \
    -c:v libx264 -pix_fmt yuv420p -crf $MASTER_CRF -preset slow \
    -g 48 -movflags +faststart -an "$MP/$tag.mp4"
  echo "### RE-ENCODED $tag  $have frames  plate $(du -h "$DEST/shots/$tag.mp4" | cut -f1)"
  done_n=$((done_n+1))
done

echo "### $done_n shots re-encoded"
[ "$done_n" -eq 0 ] && exit 1

: > "$R/out/cut.txt"
cnt=0
for n in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  f="$MP/$(printf "s%02d-%s" "$n" "${NAMES[$((n-1))]}").mp4"
  if [ -f "$f" ]; then echo "file '$f'" >> "$R/out/cut.txt"; cnt=$((cnt+1)); fi
done
[ "$cnt" -lt 15 ] && echo "### PARTIAL CUT — $cnt of 15, missing shots are absent not padded"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$R/out/cut.txt" -c copy \
  -movflags +faststart "$DEST/spotify-film.mp4"
ffmpeg -y -loglevel error -ss 3 -i "$DEST/spotify-film.mp4" -frames:v 1 -q:v 3 \
  "$DEST/spotify-film.jpg"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DEST/spotify-film.mp4")
echo "### MASTER  ${dur}s  $(du -h "$DEST/spotify-film.mp4" | cut -f1)"
echo "### PLATES TOTAL  $(du -sh "$DEST/shots" | cut -f1)"

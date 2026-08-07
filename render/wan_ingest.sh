#!/usr/bin/env bash
# wan_ingest.sh — bring the Wan footage into worlds/spotify.html.
#
# The source folder is a READ-ONLY vault: this script only ever reads from it.
# Every shipped clip is centre-cropped 1920x1080 -> 1920x804 (2.39:1, the
# aspect the rest of the film already ships) and then delivered at 1600x670.
# The crop is not only a framing choice: the burned-in "Wan" mark measures
# (1748,1011)-(1887,1063) in all 25 source clips, and the 138 px bottom band
# the scope crop removes starts at row 942 — 69 px of margin. `render/tools/
# wan_gate.py` is the check, and `--fail-first` proves the check can go red.
#
#   bash render/wan_ingest.sh              encode everything
#   bash render/wan_ingest.sh --fail-first build the uncropped control set
#
# Encode: g=12 was measured for this page in pass 5 (seek cost is flat across
# keyframe density, size is not), so half-second keyframes at half the bytes.
#
# Every ffmpeg call passes -nostdin. Without it ffmpeg eats bytes from the
# heredoc feeding the loop below, and the NEXT slug is read starting a few
# characters in — the first run of this script produced `om02-contact.mp4` and
# `listener.mp4` and still exited 0.
set -u

VAULT="/c/Users/GAMING/Downloads/some assets/wan 6 keyframe ideas"
MIX="$VAULT/wan mix keyframes"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/worlds/spotify/live"
CAP_KB=2600          # hard per-clip ceiling; CRF steps up until a clip fits
CRF0=26

# slug|source-file  — the cut, in the order the page plays it.
# Side A: one room clip per act of The Album.
# Side B: the flight, sequenced so each clip's last frame hands over to the
# next clip's first (see public/worlds/spotify-DIRECTORS-CUT.md).
CUT=$(cat <<LIST
room01-silence|$VAULT/Wan_Video_Reference_@Image1 is the immutable room geometry and art-direction (1).mp4
room02-contact|$VAULT/Wan_Video_Reference_@Image1 Start exactly from Image 1.__Execute one slow 85.mp4
room03-runway|$VAULT/Wan_Video_Reference_@Image1 is the immutable room geometry and art-direction (2).mp4
room04-build|$VAULT/Wan_Video_Reference__@Image1 is the immutable room geometry and art-directio.mp4
room05-lounge|$VAULT/Wan_Video_Reference_@Image1 is the immutable room geometry and art-direction (3).mp4
room06-chorus|$VAULT/Wan_Video_Reference_@Image1 is the immutable room geometry and art-direction (4).mp4
j01-portal|$MIX/Wan_Video_Reference_Image-to-video. Use @Image1 as the exact opening frame._.mp4
j02-equalizer|$MIX/Wan_Video_Reference_Image-to-video. Begin from @Image1 symmetrical equalizer.mp4
j03-playlist|$MIX/Wan_Video_Reference_Image-to-video. Use @Image1 as frame one.__One uninterru.mp4
j04-city|$MIX/Wan_Video_Reference_@Image1 The green point becomes a giant luminous sound b.mp4
j05-parallax|$MIX/Wan_Video_Reference_@Image1 Dive into the glowing avenue and reveal an impos.mp4
j06-vinyl|$MIX/Wan_Video_Reference_Image-to-video. Preserve @Image1 giant turntable and vin.mp4
j07-highway|$MIX/Wan_Video_Reference_@Image1 The bright groove transforms into a futuristic h.mp4
j08-listener|$MIX/Wan_Video_Reference_@Image1 Pass through the opening into an extreme cinemat.mp4
j09-pupil|$MIX/Wan_Video_Reference_@Image1 Emerge from the pupil into deep space where an e.mp4
j10-pullback|$MIX/Wan_Video_Reference_@Image1 Exit into a vast black landscape beneath a green.mp4
j11-return|$MIX/Wan_Video_Reference_Image-to-video. Preserve @Image1 floating-island dreamsc.mp4
j12-line|$MIX/Wan_Video_Reference_@Image1 Inside the tunnel, reveal a monumental glass hou.mp4
LIST
)

encode () {           # encode <src> <dst> <vf>
  local src=$1 dst=$2 vf=$3 crf=$CRF0 kb=0
  for attempt in 1 2 3; do
    ffmpeg -nostdin -v error -y -i "$src" -an -vf "$vf" \
      -c:v libx264 -profile:v high -preset slow -crf "$crf" \
      -g 12 -keyint_min 12 -sc_threshold 0 \
      -pix_fmt yuv420p -movflags +faststart "$dst" || return 1
    kb=$(( $(stat -c%s "$dst") / 1024 ))
    [ "$kb" -le "$CAP_KB" ] && break
    crf=$(( crf + 2 ))
  done
  echo "$kb $crf"
}

mkdir -p "$OUT"
fail=0
total=0
n=0

if [ "${1:-}" = "--fail-first" ]; then
  # The control set: SQUASH instead of crop, so the mark is still in frame.
  # The gate must go RED on these before its GREEN on the shipped files means
  # anything. Written to a scratch folder — these never ship.
  CTRL="$(cd "$(dirname "$0")" && pwd)/out/_wan_control"   # gitignored; never ships
  mkdir -p "$CTRL"
  echo "$CUT" | head -3 | while IFS='|' read -r slug src; do
    ffmpeg -nostdin -v error -y -i "$src" -an -vf "scale=1600:670:flags=lanczos" \
      -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p "$CTRL/$slug.mp4" \
      && echo "control: $slug.mp4 (uncropped, mark intact)"
  done
  echo "control set at $CTRL"
  exit 0
fi

while IFS='|' read -r slug src; do
  [ -z "$slug" ] && continue
  n=$(( n + 1 ))
  if [ ! -f "$src" ]; then
    echo "MISSING source for $slug: $src"; fail=1; continue
  fi
  read -r kb crf < <(encode "$src" "$OUT/$slug.mp4" \
      "crop=1920:804:0:138,scale=1600:670:flags=lanczos") || { fail=1; continue; }
  [ "$kb" -gt "$CAP_KB" ] && { echo "OVER CAP $slug ${kb}KB"; fail=1; }
  # poster: the clip's own first frame, so the still and the plate agree
  ffmpeg -nostdin -v error -y -i "$OUT/$slug.mp4" -frames:v 1 -vf "scale=1280:536:flags=lanczos" \
    -q:v 5 "$OUT/$slug.jpg" || fail=1
  total=$(( total + kb ))
  printf '%-16s %5d KB  crf%-3s poster %4d KB\n' "$slug" "$kb" "$crf" \
    "$(( $(stat -c%s "$OUT/$slug.jpg") / 1024 ))"
done <<< "$CUT"

echo "----"
echo "$n clips, ${total} KB video ($(( total / 1024 )) MB)"
[ "$fail" -eq 0 ] && echo "encode OK" || echo "encode FAILED"
exit $fail

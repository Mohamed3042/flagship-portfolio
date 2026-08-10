#!/bin/zsh
set -euo pipefail

PACK_DIR="${0:A:h}"
CLIP_ID="${1:-}"

if [[ -z "$CLIP_ID" ]]; then
  printf 'Accepted clip ID (example CST-A-001): '
  read -r CLIP_ID
fi

CLIP_ID="${(U)CLIP_ID}"
if [[ ! "$CLIP_ID" =~ '^CST-A-[0-9]{3}$' ]]; then
  print -u2 "Invalid clip ID: $CLIP_ID"
  read -k 1 '?Press any key to close.'
  exit 2
fi

INPUT="$PACK_DIR/accepted/$CLIP_ID.mp4"
OUTPUT="$PACK_DIR/endframes/$CLIP_ID-end.png"

if [[ ! -f "$INPUT" ]]; then
  print -u2 "Accepted clip not found: $INPUT"
  read -k 1 '?Press any key to close.'
  exit 3
fi

ffmpeg -hide_banner -loglevel error -y -nostdin -sseof -0.04 -i "$INPUT" -frames:v 1 "$OUTPUT"
print "Saved: $OUTPUT"
open -R "$OUTPUT"
read -k 1 '?Press any key to close.'

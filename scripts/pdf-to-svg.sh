#!/usr/bin/env bash
# Convert PDF or .ai (PDF-based) to SVG for the logo.
# Usage: ./scripts/pdf-to-svg.sh <input.pdf|input.ai> [output.svg]
# Requires: Inkscape (brew install inkscape) or Poppler (brew install poppler)

set -e
INPUT="${1:?Usage: $0 <input.pdf|input.ai> [output.svg]}"
OUTPUT="${2:-}"

# If input is .ai, we'll pass it as-is (Inkscape can open it; pdftocairo needs .pdf)
BASE="${INPUT%.*}"
EXT="${INPUT##*.}"
if [[ -z "$OUTPUT" ]]; then
  OUTPUT="public/rips-logo.svg"
  # If input has a name, use it: e.g. rips-logo.pdf -> public/rips-logo.svg
  if [[ "$(basename "$BASE")" != "rips-logo" ]]; then
    OUTPUT="public/$(basename "$BASE").svg"
  fi
fi

# Ensure output dir exists
mkdir -p "$(dirname "$OUTPUT")"

if command -v inkscape &>/dev/null; then
  echo "[pdf-to-svg] Using Inkscape: $INPUT -> $OUTPUT"
  # Inkscape 1.x: open PDF/.ai and export as SVG
  if inkscape "$INPUT" -o "$OUTPUT" --export-type=svg 2>/dev/null; then
    echo "[pdf-to-svg] Done: $OUTPUT"
    exit 0
  fi
fi

if command -v pdftocairo &>/dev/null; then
  # .ai is PDF-based; pdftocairo expects .pdf. Copy to temp .pdf if needed.
  SRC="$INPUT"
  if [[ "$EXT" == "ai" ]]; then
    SRC="/tmp/rips-logo-temp.pdf"
    cp "$INPUT" "$SRC"
  fi
  echo "[pdf-to-svg] Using pdftocairo: $INPUT -> $OUTPUT"
  # pdftocairo -svg produces output-1.svg, output-2.svg, ...
  TEMP_DIR="$(mktemp -d)"
  pdftocairo -svg "$SRC" "$TEMP_DIR/page"
  if [[ -f "$TEMP_DIR/page-1.svg" ]]; then
    mv "$TEMP_DIR/page-1.svg" "$OUTPUT"
    echo "[pdf-to-svg] Done: $OUTPUT (page 1)"
  fi
  rm -rf "$TEMP_DIR"
  [[ "$EXT" == "ai" ]] && rm -f "$SRC"
  exit 0
fi

echo "No converter found. Install one of:"
echo "  brew install inkscape   # preferred for vector quality"
echo "  brew install poppler    # provides pdftocairo"
exit 1

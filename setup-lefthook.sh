#!/bin/bash
# Left Hook Communications — Local Project Setup
# Run this on your Mac: bash setup-lefthook.sh

set -e

PROJECT_DIR="$HOME/lefthook-site"
SHELL_RC="$HOME/.zshrc"

echo "═══════════════════════════════════════"
echo "  Left Hook Communications — Setup"
echo "═══════════════════════════════════════"
echo ""

# Create project directory structure
echo "→ Creating project at $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"/{assets,videos,thumbs}

echo "→ Project structure:"
echo "  lefthook-site/"
echo "  ├── HANDOFF.md          ← Download from Claude chat"
echo "  ├── CLAUDE_CODE_PROMPT.md ← Download from Claude chat"  
echo "  ├── index.html          ← Download from Claude chat"
echo "  ├── about.html          ← Download from Claude chat"
echo "  ├── assets/"
echo "  │   └── brandon_hall.jpg ← Download from Claude chat"
echo "  ├── videos/             ← Drop your 6 video files here"
echo "  └── thumbs/             ← Video thumbnails"
echo ""

# Add alias to shell config
if grep -q "alias lefthook=" "$SHELL_RC" 2>/dev/null; then
  echo "→ Alias 'lefthook' already exists in $SHELL_RC — skipping"
else
  echo "" >> "$SHELL_RC"
  echo "# Left Hook Communications — Claude Code launcher" >> "$SHELL_RC"
  echo "alias lefthook='cd $PROJECT_DIR && claude --model sonnet --dangerously-skip-permissions'" >> "$SHELL_RC"
  echo "→ Added 'lefthook' alias to $SHELL_RC"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Setup complete!"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Download all files from Claude chat into ~/lefthook-site/"
echo "  2. Drop your 6 video files into ~/lefthook-site/videos/"
echo "  3. Run: source ~/.zshrc"
echo "  4. Run: lefthook"
echo "  5. Paste the contents of CLAUDE_CODE_PROMPT.md as your first message"
echo ""

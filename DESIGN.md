# Design System — Left Hook Communications

## Theme

Dark. Near-black background (#0A0A0A) with warm white text (#F0EEE9). Single blue accent (#6B8FC7 light / #4A6FA5 base). The surface is a cinema screen — everything else is negative space and contrast.

## Color Palette

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0A0A0A` | Page background |
| `--bg-surface` | `#111111` | Card / surface background |
| `--blue` | `#4A6FA5` | Base brand blue (button text, accents) |
| `--blue-light` | `#6B8FC7` | Display accent (hero "LEFT", nav underline, scan line) |
| `--text` | `#F0EEE9` | Primary text |
| `--text-sec` | `#C8C5BC` | Secondary text (body, contact desc) |
| `--text-muted` | `#706D64` | Muted text (footer, labels) |
| `--border` | `rgba(255,255,255,0.06)` | Hairline borders |

Color strategy: **Restrained**. The blue accent appears at ≤10% of any surface area. Everything else is in the warm-neutral scale.

## Typography

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display | Bebas Neue | clamp(56px–100px) | 400 | Hero, contact title, bio name |
| Section label | DM Sans | 16px | 700 | "OUR WORK", uppercase + 3px letter-spacing |
| Video card title | Bebas Neue | 26px | 400 | Campaign name on card |
| Body | DM Sans | 19–20px | 300–400 | Bio text, contact desc |
| Editorial | Source Serif 4 | 19–21px | 300 italic | Bio text, pull quote, press quotes |
| UI | DM Sans | 13–15px | 500–700 | Nav, tags, footer, buttons |

No Inter. No system-ui. No generic sans.

## Spacing

Page horizontal padding: 48px (desktop) → 32px (tablet) → 20px (mobile). No max-width container on most sections — content lives at full bleed within padding. The video grid has 16px gaps.

## Components

### Nav
Fixed. 68px tall. Transparent on homepage, darkens + blurs on scroll (`rgba(10,10,10,0.94)` + `blur(16px)`). Always solid on inner pages. Logo: `LEFT` in `--blue-light`, `HOOK` in `--text`. About link underlines with a 1px `--blue-light` line when active.

### Video Card
`border-radius: 6px`. Hover: thumbnail scales 1.06, brightness+saturation lifts, blue scan line sweeps top→bottom, 1px blue inner frame fades in, play button appears, label slides up 6px, category tag fades in. On mobile, all hover states are visible by default.

### Video Modal
Full-viewport overlay. `rgba(0,0,0,0.95)` + `blur(24px)`. Plyr player at max-width 1000px, scale-up entry animation. Campaign name (Bebas) + ad title below player. Close: X button (rotates 90° on hover), backdrop click, Escape.

### Play Button
66px circle. `rgba(255,255,255,0.08)` fill, `blur(8px)`, `1.5px rgba(255,255,255,0.2)` border. Hover: fill to 0.15, border to 0.45.

## Motion

Scroll reveal: `opacity 0→1, translateY 20px→0` via `IntersectionObserver`. Entry easing: `cubic-bezier(0.16,1,0.3,1)` (expo-out). Hero title/subtitle: CSS animation `fadeUp` on load with 0.15s / 0.35s delays. Scan line: 0.6s keyframe sweep.

## Thumbnail Treatment (video grid)

Base CSS on `.video-thumb`: `filter: brightness(0.85) saturate(0.9)`. On hover: `brightness(1.0) saturate(1.15)`. A `linear-gradient` shade overlay sits above for text legibility. See thumbnail design implementation for the unified color-grade approach applied at the image level.

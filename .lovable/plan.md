
# Plan: Update App Color Scheme to Deep Black Monochromatic Theme

## Reference Analysis
The uploaded image shows an iPhone with a **deep pure black** aesthetic with **dark gray** UI elements and **white text**. Minimal color accents — very muted, monochromatic dark theme.

## What Changes

**Only CSS variables in `src/index.css`** — no functionality changes. The goal is to shift from the current violet/blue neon palette to a **pure black + dark charcoal** palette with subtle gray accents.

### Color Variable Updates
| Variable | Current | New |
|----------|---------|-----|
| `--background` | `240 10% 8%` (dark blue-gray) | `0 0% 4%` (near black) |
| `--card` | `240 8% 12%` | `0 0% 8%` (pure dark gray) |
| `--primary` | `252 87% 64%` (violet) | `0 0% 85%` (light gray) |
| `--secondary` | `240 8% 18%` | `0 0% 12%` |
| `--muted` | `240 6% 20%` | `0 0% 15%` |
| `--muted-foreground` | `240 5% 55%` | `0 0% 45%` |
| `--accent` | `210 100% 56%` (blue) | `0 0% 75%` (muted gray) |
| `--border` | `240 6% 20%` | `0 0% 14%` |
| `--input` | `240 6% 20%` | `0 0% 14%` |
| `--ring` | `252 87% 64%` | `0 0% 60%` |
| `--neon-*` colors | Various vibrant | Desaturated gray tones |
| `--card-glass` | Blue-tinted | `0 0% 10%` |
| Sidebar vars | Blue-tinted | Matching pure black/gray |

### Gradient & Glow Updates
- `.gradient-primary` → subtle dark gray gradient
- `.gradient-warm` → muted gray gradient  
- `.glow-violet`, `.glow-blue`, `.glow-hero` → very subtle white/gray glows
- `.text-gradient` → light gray to white gradient

### Files Modified
- `src/index.css` — only file changed

### What Stays the Same
- All component logic, routing, hooks, pages
- All functionality (meals, auth, groups, progress, thesis, PDF)
- Layout structure and typography
- The destructive color stays red for error states

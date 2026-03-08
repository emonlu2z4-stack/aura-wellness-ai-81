

## Water Intake Tracker with Animated Glass Fill

### What we'll build
A visually engaging water tracker row on the home dashboard, placed between the macro cards and "Today's Meals" section. Features an animated SVG glass that fills up as users tap to add water, with a daily goal of 8 glasses (2L).

### Components

**1. New `WaterTracker` component** (`src/components/WaterTracker.tsx`)
- SVG glass/cup shape with animated fill level using framer-motion
- Displays current intake vs goal (e.g., "5/8 glasses")
- Quick-add buttons: +1 glass (250ml), custom amount
- Tap the glass itself to add one glass with a satisfying bounce animation
- Water ripple/wave effect inside the glass using CSS animation
- Color transitions: light blue → deeper blue as it fills

**2. State management** — Local state with `useState` for now (no DB table needed initially). Water resets daily. We can persist to localStorage for session survival.

**3. Integration into `Index.tsx`**
- Insert the water tracker as a new `motion.div` section between macro cards (line ~334) and "Today's Meals" (line ~336)
- Matches existing design: `glass-card-elevated` styling, `motion` entrance animation

### Design details
- Glass SVG: ~80px tall rounded rectangle with wave animation inside
- Fill uses `clipPath` + animated height via framer-motion `animate={{ height }}`
- Wave effect: CSS keyframe sine-wave at the water line
- Quick-add buttons styled as pill-shaped with 💧 emoji
- Progress text: "5/8 glasses 💧" with percentage ring or linear bar

### Files to create/edit
- **Create**: `src/components/WaterTracker.tsx`
- **Edit**: `src/pages/Index.tsx` (import + place component)
- **Edit**: `src/index.css` (wave animation keyframe)


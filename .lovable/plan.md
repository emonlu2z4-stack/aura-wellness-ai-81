

## Recreate Aura Wellness AI

Your original project is a **premium AI-powered wellness & nutrition tracker** with a dark glassmorphic UI. Here's everything we'll build:

### 1. Backend Setup (Lovable Cloud / Supabase)
- **Database tables**: `profiles` (user settings, macro targets), `meals` (daily food logs with macros), `weight_logs` (weight tracking), `groups` & `group_members` (social wellness groups with invite codes)
- **Storage**: Photo bucket for meal photos
- **RLS policies**: Row-level security so users can only access their own data
- **Auth**: Google OAuth sign-in
- **Edge function**: `analyze-meal` — uses AI (Gemini) to analyze food photos and estimate calories, protein, carbs, fats, fiber, sugar, sodium

### 2. Dark Glassmorphic Theme
- Space Grotesk + Inter fonts
- Dark purple/blue color scheme with neon accents (violet, blue, green, orange, pink, cyan)
- Glass card effects with backdrop blur, glow shadows, gradient accents

### 3. Pages & Features

**Auth Page** — Google sign-in with branded landing screen

**Home Dashboard** (/)
- Greeting with user name and time of day
- Streak banner (weekly activity dots)
- Hero calorie card with circular progress ring showing calories remaining vs goal
- Swipeable macro cards (protein, carbs, fats + fiber, sugar, sodium)
- Today's meal log with expandable items
- Floating "+" button to log meals (manual entry or AI photo analysis)

**Progress Page** (/progress)
- Current weight vs goal weight with progress bar
- Weight trend line chart (filterable: 90 days, 6 months, 1 year, all time)
- Progress photos section
- Weekly calorie & macro bar charts (filterable by week)
- BMI calculator card with color-coded scale

**Groups Page** (/groups)
- Create groups with auto-generated invite codes
- Join groups via 8-character invite code
- Share/copy invite codes, leave groups

**Profile Page** (/profile)
- User card with avatar initial, invite friends button
- Settings links: Personal details, Macronutrients targets, Goal & weight, Weight history

**Profile Settings** (/settings/*)
- Personal details form (name, age, height, activity level)
- Macro targets form (calories, protein, carbs, fats, fiber, sugar, sodium)
- Goal weight form
- Weight history list

### 4. Animations
- Framer Motion for page transitions, card entrances, and swipe gestures on macro cards
- Scanning animation overlay when AI analyzes food photos

### 5. Bottom Navigation
- 4-tab nav: Home, Progress, Groups, Profile with active glow effect


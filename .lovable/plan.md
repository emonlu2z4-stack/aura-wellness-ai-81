

# Redesign Use Case Diagram — Professional University-Grade Quality

## Overview
Completely rebuild the `/use-case-diagram` page to produce a clean, professional UML Use Case Diagram suitable for university submission. The current version has cramped layout, small text, and lacks the polished academic formatting expected for a CSE assignment.

## Design Approach

**Layout**: Full A4 portrait page layout (matching the Thesis page style) with proper margins, clear spacing, and professional typography using Times New Roman throughout.

**Visual improvements**:
- Larger SVG canvas (1200×900+) with well-spaced elements — no overlapping
- Properly sized ellipses with readable 11-12pt text
- Clean stick figures with proper proportions
- System boundary box with solid border and "NutriTrack AI System" title inside top
- Color-coded group separator lines/backgrounds for each functional area
- Thicker, cleaner association lines with proper arrowheads for include/extend
- Professional legend box with border

**Academic formatting**:
- Leading University header with logo, department name, course info
- Team members, IDs, batch, section, supervisor name
- Page styled like the Thesis page (A4, white background, shadows, proper margins)
- "Figure 1: Use Case Diagram" caption below the diagram

**PDF export**:
- High-resolution A3 landscape PDF (scale: 3) for print quality
- White background forced for clean print output

## Technical Plan

### Single file change: `src/pages/UseCaseDiagram.tsx`

1. **Add university header block** above the SVG — Leading University logo, department, course, team details (reuse the logo from `src/assets/leading-university-logo.png`)

2. **Restructure SVG layout**:
   - Expand viewBox to ~1200×950
   - Reposition actors: User (left, y=350), Admin (left, y=700), AI System (right, y=350), Weather API (right, y=650)
   - Space use cases in clear horizontal rows per functional group with ~100px vertical gaps
   - Add subtle colored background rectangles behind each group section
   - Group labels as bold section headers inside the system boundary

3. **Improve visual elements**:
   - Larger ellipses (rx=90, ry=30) with subtle gradient fills
   - Stick figures with slightly larger proportions
   - Association lines: 1.5px solid gray
   - Include/extend arrows: proper dashed lines with filled arrowheads and italic labels
   - System boundary: solid 2.5px black rectangle with rounded corners

4. **Add figure caption**: "Figure 1: Use Case Diagram of NutriTrack AI Health & Fitness Application"

5. **Improve legend**: Bordered box with clear symbols and labels

6. **Keep existing PDF download** logic but ensure the header/caption are included in the captured area

No routing changes needed — the page already exists at `/use-case-diagram`.


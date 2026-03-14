

# Redesign Use Case Diagram — Professional University-Grade

## What's changing

Completely rewrite `src/pages/UseCaseDiagram.tsx` to produce a clean, professional, academic-quality UML Use Case Diagram matching the Thesis page styling.

## Key improvements

1. **A4 page layout** matching the Thesis page style (210mm width, white background, box shadow, 1-inch margins, Times New Roman font throughout)

2. **University header** — Leading University logo, department name, course title, team members with IDs, supervisor name, batch/section info (reusing data from Thesis page)

3. **Larger, cleaner SVG diagram** (~1100×900 viewBox):
   - Bigger ellipses (rx=95, ry=32) with readable 12pt text
   - Larger stick figures with proper proportions
   - Clean system boundary rectangle with "NutriTrack AI System" label
   - Color-coded group section backgrounds (subtle fills) with bold group headers
   - Thicker association lines (1.5px) and properly styled dashed include/extend arrows
   - Better spacing — no overlapping elements

4. **Professional legend** with bordered box below the diagram

5. **Figure caption**: "Figure 1: Use Case Diagram of NutriTrack AI Health & Fitness Application"

6. **PDF export** — A3 landscape, scale 3, white background, includes header and caption in the captured area

## Technical approach

- Single file change: `src/pages/UseCaseDiagram.tsx`
- Reuse the Leading University logo import from `src/assets/leading-university-logo.png`
- Keep same `html2canvas` + `jsPDF` approach but wrap the entire content (header + SVG + legend + caption) in the captured ref
- Use inline styles matching the Thesis page conventions (Times New Roman, proper sizing)
- Reposition all use cases with more vertical spacing (~120px between groups) and horizontal centering
- Back button and Download button stay outside the captured area


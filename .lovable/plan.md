

## Plan: Style Thesis Page as A4 Paper Pages

### Problem
The thesis page currently renders as a continuous scroll without visual A4 page boundaries. The screenshot shows a dark bar cutting through content between team member names, likely caused by the app's dark theme CSS bleeding into the thesis content or `page-break-after` classes not creating visual separation.

### Root Cause
- The `page-break-after` class is only meaningful for print/PDF — it doesn't create visual page breaks on screen
- The app's dark background (`bg-background` = dark) may bleed through despite the white `bg-white` on the container
- No visual A4 page separation (shadows, gaps) between sections

### Changes (all in `src/pages/Thesis.tsx`)

1. **Wrap each section in an A4-styled container** — Give each `page-break-after` div explicit A4 dimensions with white background, box shadow, and margin between pages so they look like stacked paper sheets on screen:
   - `min-height: 297mm`, `width: 210mm`, `padding` for margins, `box-shadow` for paper effect
   - Gap between pages to visually separate them

2. **Force white background isolation** — Add explicit inline `background: #fff` on every section div to prevent dark theme bleed-through

3. **Outer container styling** — Change the outer wrapper to a neutral gray background (`#e5e7eb` or similar) so the white A4 pages stand out like paper on a desk

4. **Fix the content overflow** — Ensure the `contentRef` wrapper and its children all have `overflow: visible` and no clipping that could cause the dark bar artifact

### Technical Approach
- Create a reusable inline style object for A4 page styling
- Apply it to each section (cover, permission, dedication, acknowledgement, abstract, TOC, chapters, references)
- Keep `page-break-after` class for PDF generation compatibility
- All changes confined to `src/pages/Thesis.tsx` — no other files affected


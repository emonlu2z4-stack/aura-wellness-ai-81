

## Add Figures and Diagrams to Thesis Proposal

Add three SVG-based diagrams directly inline in `src/pages/Thesis.tsx` within the relevant chapter sections. These will be rendered as styled boxes/arrows using HTML+CSS (no external images needed), ensuring they export cleanly to PDF via html2pdf.js.

### Diagrams to Add

1. **System Architecture Diagram (Figure 3.1)** — Insert after the System Architecture text (after line ~320, in section 3.2). A three-tier architecture diagram showing:
   - Presentation Layer (React, Tailwind, Framer Motion)
   - Application Layer (Edge Functions, Auth, Storage)
   - Data Layer (PostgreSQL, RLS)
   - External: Gemini AI API
   - Arrows showing data flow between layers

2. **Data Flow Diagram (Figure 3.2)** — Insert after the Data Flow text (after line ~340, in section 3.4). A horizontal flow diagram:
   - User → Camera/Photo → Edge Function → Gemini AI → JSON Response → Database → UI Display

3. **Use Case Diagram (Figure 3.3)** — Insert in Chapter 1 after Scope (after line ~240) or as a new section. Shows actors (User, AI System) and use cases:
   - User: Sign Up, Log In, Capture Meal Photo, View Nutrition, Track Weight, Join Groups, View Progress
   - AI System: Analyze Food Image, Estimate Nutrients

### Technical Approach
- All diagrams built with pure HTML/CSS (div boxes, borders, arrows using CSS triangles/borders)
- Styled with inline styles for consistent PDF rendering
- Each diagram wrapped in a `<div>` with a centered "Figure X.X" caption below
- No external dependencies or images required

### TOC Update
- Add "List of Figures" entries or figure references within existing sections (no TOC restructuring needed since figures are within existing chapters)


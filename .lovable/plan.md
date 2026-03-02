

## Thesis Proposal PDF Generator

I'll create a dedicated page in your app (`/thesis`) that renders a professionally formatted thesis proposal following the Leading University template exactly, with a "Download PDF" button using `html2pdf.js`.

### Content Structure (following template)

**Cover Page**: Leading University header, Department of CSE, Thesis Title: "Aura Wellness AI: An AI-Powered Nutrition and Wellness Tracking App", Submitted To: Kazi Md. Jahid Hasan (Assistant Professor), Submitted By: all 3 members with IDs, Submission Date.

**Page 2**: Permission application letter with all member names.

**Page 3**: Thesis name + motto page.

**Page 4**: Table of Contents.

**Chapters 1-7** filled with actual content about the Aura Wellness AI app:
- **Ch1 Introduction**: About the app, motivations (rising health awareness, AI in nutrition), research objectives
- **Ch2 Literature Review**: Existing apps (MyFitnessPal, Lose It!, etc.), their limitations, how Aura differs with AI photo analysis
- **Ch3 Methodology**: Agile development, AI-based food recognition via Gemini, real-time macro tracking, cloud backend
- **Ch4 Resources & Tools**: React, TypeScript, Tailwind CSS, Supabase, Gemini AI, Framer Motion, Recharts
- **Ch5 Work Plan**: Gantt-style table with monthly breakdown
- **Ch6 Expected Outcomes**: Accurate AI meal analysis, improved health tracking, social wellness groups
- **Ch7 Conclusion**: Summary and significance

**References**: Relevant academic and technical sources.

### Technical Approach
1. Add `html2pdf.js` dependency
2. Create `/thesis` page with print-optimized CSS (A4 sizing, page breaks, Times New Roman for academic style)
3. "Download as PDF" button that generates a multi-page PDF
4. All content refers to the app as "app" (not "web app") per your request

### Group Members
1. Emon Ahmed — ID: 0182320012101356
2. MD Rayhan Akhand — ID: 0182320012101320
3. Md Sams Uddin Emon — ID: 0182310012101144


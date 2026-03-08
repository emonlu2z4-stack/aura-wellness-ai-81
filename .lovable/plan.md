

## Problem Analysis

The current `window.open()` approach fails because the new print window doesn't have access to:
1. **Tailwind CSS classes** (`text-center`, `page-break-after`, etc.) — these render as nothing
2. **Vite-bundled image URLs** — the logo import resolves to a hashed URL that may not load in the new window context
3. The `padding: 0 !important` override in the print window CSS strips all content spacing

This is why the PDF appears blank — the content is there but unstyled and collapsed.

## Solution: Use `@media print` on the current page

Instead of opening a new window (which loses all styles), use `window.print()` directly on the current page with `@media print` CSS rules. This is the most reliable browser-based PDF approach because all styles, images, and fonts are already loaded.

### Changes to `src/pages/Thesis.tsx`:

1. **Simplify `handleDownload`** to just call `window.print()` directly — no cloning, no new windows
2. **Add a `<style>` block** (or update `src/index.css`) with `@media print` rules that:
   - Hide the download button and any non-thesis UI (bottom nav, etc.)
   - Reset A4 screen styles (shadows, fixed width) for print
   - Set `@page { size: A4; margin: 20mm 18mm; }`
   - Ensure `page-break-after` works via CSS `break-after: page`
   - Set body background to white, proper font

### Changes to `src/index.css`:
- Add `@media print` rules to hide app chrome (bottom nav, button) and style the thesis content for clean PDF output

This approach guarantees all Tailwind classes, images, and fonts work because we're printing the actual rendered page.




## Add Dedication & Acknowledgement Pages

Insert two new pages in `src/pages/Thesis.tsx` between the motto page (ends at line 118) and the Table of Contents (starts at line 120):

1. **Dedication Page** (line ~119): Centered text dedicating the work to parents, teachers, and well-wishers, styled with italic quote formatting.

2. **Acknowledgement Page**: Formal acknowledgement thanking the supervisor (Kazi Md. Jahid Hasan), the CSE department, family, and peers for their support.

3. **Update Table of Contents** (lines 125-146): Add entries for "Dedication" and "Acknowledgement" pages and shift page numbers accordingly.

Both pages will use the same styling conventions (Times New Roman, A4 sizing, `page-break-after` class) as the existing pages.


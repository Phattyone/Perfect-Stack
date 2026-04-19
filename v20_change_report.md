# The Perfectly Erect Plan — v19 to v20 Change Report
Generated: April 2026

## Source Integrity Note
The v19 source file (`The_Perfectly_Erect_Plan_v19.docx`) was corrupt — the ZIP archive was truncated with no end-of-central-directory record and the last file entry (`word/footer4.xml`) was incomplete. All 13 recoverable parts (including the full `word/document.xml`) were extracted via raw local file header walking. The remaining structural parts (`styles.xml`, `numbering.xml`, `settings.xml`, `webSettings.xml`, `fontTable.xml`, `theme/theme1.xml`, `footer4.xml`, `customXml/*`, `docProps/*`) were taken from `The_Perfectly_Erect_Plan_v18.docx`, which matches v19's `[Content_Types].xml` manifest and `word/_rels/document.xml.rels` byte-for-byte. The rebuild is structurally sound and faithful to v19's document content.

## Part 1: Supplement Dose Corrections

### Boron (3mg correction)
| Location | Before | After |
|---|---|---|
| Chapter 11 — Stack A Foundation Stack table (Boron row, Recommended Dose cell) | `6 mg once daily. Take AM with a meal.` | `3mg once daily with a meal` |
| Chapter 19 — Interactions, Safety, and What to Tell Your Doctor / Supplement Side-Effect table (Boron row, dose column) | `6 mg` | `3mg` |

Note: The Phase 4 row of the 8-week roadmap and the bulleted daily schedule already stated "Boron 3mg" in v19, so no change was required there.

### CoQ10 Ubiquinol (100mg correction)
| Location | Before | After |
|---|---|---|
| Chapter 13 — Stack C Nitric Performance Stack table (CoQ10 (Ubiquinol) row, Recommended Dose cell) | `100-200 mg daily. Take AM with a fat-containing meal.` | `100mg once daily with a fat-containing meal` |
| Chapter 19 — Supplement Side-Effect table (CoQ10 (Ubiquinol) row, dose column) | `100-200 mg` | `100mg` |
| Chapter 19 — Statin interaction recommendation cell | `CoQ10 supplementation (100-200 mg of ubiquinol) is strongly recommended…` | `CoQ10 supplementation (100mg of ubiquinol) is strongly recommended…` |

All other dose mentions of 100-200 mg (L-Theanine, Pine Bark Extract, Tongkat Ali, etc.) and of 200 mg (Magnesium Glycinate, Ashwagandha, etc.) were left untouched as they are not Boron or CoQ10.

## Part 2: Multivitamin Safety Note
- **Inserted as a single styled callout block** (title paragraph + body paragraph + six bullets + closing paragraph) matching the existing EEF3F8-shaded, EAB308-top/bottom, 2E6DA4-thick-left-border callout style used elsewhere in the supplement chapters.
- **Inserted after:** the existing `Note on Stack A multivitamins and B vitamins` callout (the one that ends "…Both supplements serve distinct roles. Take them together.").
- **Location:** Chapter 11 — Stack A: Foundation Stack, immediately after the multivitamin/B-vitamin explainer callout, before the existing `Timing shown is the general recommendation…` app reference callout.
- The callout title reads "Important: Multivitamin and Stack Supplement Interactions" (bold); bullets use &#x2019; XML entities for apostrophes so Word renders smart quotes.

## Part 3: App and Spreadsheet Reference Notes
All three placements use the same lighter-chapter callout style (EEF3F8 shading, blue thick left border, yellow top/bottom hairline) and the exact note text specified.

- **Placement 1:** Chapter 11 — Stack A: Foundation Stack. Inserted immediately after the chapter's introductory paragraph ("These are the non-negotiable baseline supplements…") and before the Stack A foundation supplement table.
- **Placement 2:** Chapter 27 — The Standard 8-Week Roadmap. Inserted immediately after the existing clinical-evidence callout (ending "…push the results further.") and before the four-phase roadmap table, so it precedes the first week content.
- **Placement 3:** Chapter 16 — Daily Supplement Timing Guide. Inserted immediately after the chapter's two introductory paragraphs (ending "…the supplements that apply to you at the window indicated.") and before the first timing window ("Morning, With Breakfast").

## Part 4: Version Updates
- v19 contained no explicit "v19", "V19", "Version 19", "March 2026", or "February 2026" strings in `word/document.xml`, any header/footer, or `docProps/app.xml`, so no in-document version text changes were needed — matching the noted expectation from v19.
- `docProps/core.xml` `dcterms:modified` updated from `2026-04-18T13:18:00Z` to `2026-04-19T00:00:00Z` (current date).
- `dcterms:created` preserved at `2026-04-13T18:19:00Z`.

## Build Integrity
- Paragraph count before: 4083
- Paragraph count after: 4095 (+12 from the Part 2 multivitamin callout block + 3 single-paragraph app/spreadsheet notes, minus run-merge artifacts)
- XML validation: PASSED (final `pack.py` reports "All validations PASSED!")
- Output file: `/sessions/compassionate-youthful-fermat/mnt/phatw--Perfect Stack/The_Perfectly_Erect_Plan_v20.docx` (199,786 bytes)

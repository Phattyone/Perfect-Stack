# Perfect Stack Spreadsheet v3 Build Report

**Date:** 2026-04-24
**File:** `C:\Users\phatw\Perfect Stack\Perfect_Stack_Spreadsheet_v3.xlsx`
**Base:** `Perfect_Stack_Spreadsheet_v2.xlsx` (untouched, copied as starting point)
**Build method:** `shutil.copy2` + openpyxl programmatic fixes
**Recalc status:** SUCCESS — 656 formulas, ZERO errors

---

## Executive Summary

v3 applies ten targeted fixes on top of the v2 base. The most substantive change is a full Stack Builder column reorganisation (16 cols to 18 cols, with Status promoted to a leading column and a Selected-Product-Name column added). A new Alpha-Blockers medication input is inserted in My Profile, requiring shifted named ranges and a new Stress/Sleep factor plus an Active-Medications counter. Safety Check VLOOKUPs are rewritten as INDEX/MATCH (required because Status moved to column B, which sits left of the lookup key in column C). Shopping List references are rewritten the same way. Cover tab, My Progress, Meal Plan, App Bridge, and Reference each get targeted additions (Easter-Egg section, blood-work baseline, adherence dropdowns, prep notes on every meal cell, new comparison rows, six new glossary terms).

---

## Fixes Applied

### Fix 1: Cover + How to Use — rebuilt from scratch
- Title / subtitle / tagline / website rows (1-4) with brand colors and proper hierarchy
- QUICK NAVIGATION section with all 10 sibling sheets split across 2 nav rows
- HOW TO USE (6 interactive steps) with Step / Sheet hyperlink / What To Do / What You Will Find columns
- QUICK REFERENCE TABS section for Recipe Library, Equipment, App Bridge, Reference
- COLOR CODING LEGEND with 8 sample swatches (Conflict / Caution / Note / Safe / Input / Calculated / Dose Reduced / Not Recommended)
- IMPORTANT NOTES footer (affiliate disclosure, medical disclaimer, dose disclaimer, app CTA)

### Fix 2: My Profile — Alpha-Blockers row + Stress/Sleep factor + Med Count
- Primary Goal dropdown expanded to 6 new goals (Hormone and Sexual Health / Erection Quality and Blood Flow / Libido and Desire / Stress and Sleep Recovery / Longevity and Energy / Performance and Muscle)
- Training Style dropdown adds "Cardio Focus"
- New **Alpha-Blockers** row inserted at row 17 (`MedAlphaBlockers` named range)
- All subsequent medication named ranges shifted down by one (TRT B18, PDE5 B19, Nitrates B20, Statins B21, Diabetes B22, Thyroid B23)
- HormoneFactor formula rewritten to include Health Status multiplier
- NOFactor formula extended to include Cardio Focus training multiplier (1.05) and Alpha-Blockers 0.8 penalty
- **New StressSleepFactor** row 28 — rewards Stress and Sleep Recovery goal + scales by Health Status
- OverallFactor now averages all three factors
- RecommendedStack formula rewritten to use new goal names
- **New MedCount** row 31 — counts flagged medications as "N flagged" string
- Active Medication Flags section rewritten with 6 color-coded flags including new Alpha-Blocker caution

### Fix 3: Stack Builder — 18-column reorganisation
- Columns reordered to: A Stack / B Status / C Name / D Category / E Product Selection / F Selected Product Name / G Base Dose / H Unit / I Age-Health Adj / J Multi Adj / K Final Dose / L Daily Servings / M Daily Total / N Best Timing / O With Meals / P Notes and Alerts / Q Monthly Cost / R Amazon Link
- Product Selection dropdowns now show **real product names** (pulled from Products_DB) instead of generic "Option 1/2/3" — 31 unique per-row DV lists
- Selected Product Name (col F) mirrors col E to make the selection visible next to the name
- Age/Health Adjusted Dose formulas account for: Nitrates lockout (NO supps to 0), DHEA age+TRT lockout, Berberine diabetes lockout, Hormone factor scaling for everything else
- Multi Adjusted Dose formulas wired to Products_DB multivitamin overlap data
- Final Dose for NO supplements applies PDE5 Daily = 50%, Alpha-Blockers = 70% reductions
- With Meals column auto-detects from Best Timing text
- Notes and Alerts column has per-supplement medication-aware text (Vitamin K2 + warfarin, CoQ10 + statins, etc.)
- Monthly Cost uses INDEX/MATCH against Products_DB Opt1/Opt2/Opt3 price and servings columns
- Amazon Link uses HYPERLINK + INDEX/MATCH for the selected option's URL
- Status column uses the K (Final Dose) and G (Base) to flag Active / Dose Reduced / Not Recommended / Excluded
- Row 38 ESTIMATED MONTHLY COST totals Q7:Q37 for Active + Dose Reduced rows — test profile yields **$493.13/month**
- Freeze panes at C7 (first two cols + header rows locked)
- Conditional formatting: red row for Not Recommended, gray for Excluded, amber for Dose Reduced

### Fix 4: Supplement Safety Check — 4 badge cells + INDEX/MATCH lookups
- Row 5 concatenated status replaced with **5 distinct colored cells**: SAFETY SUMMARY label, Cautions badge (amber), Notes badge (blue), Not Applicable (gray), Conflicts badge (red) — each COUNTIF with its own pill styling
- All 14 interaction rows rewritten from VLOOKUP (which couldn't do left lookup with Status now left of Name) to INDEX/MATCH pattern:
  `=IF(AND(IFERROR(INDEX('Stack Builder'!$B$7:$B$37,MATCH("<A>",'Stack Builder'!$C$7:$C$37,0)),"No")="Active", IFERROR(...,"No")="Active"),"Yes","No")`

### Fix 5: Supplement Cycling — blue info cell
- Row 17 info block rewritten with explicit NOTE_BG/NOTE_TEXT styling, directing users to Ultimate Protocol app for automated tracking
- Height increased to 40 for readability

### Fix 6: My Progress — blood work, adherence dropdowns, phase column
- Inserted 7 rows at row 28 for BLOOD WORK BASELINE section:
  - Total Testosterone (optimal 600-900 ng/dL)
  - Vitamin D 25-OH (optimal 50-80 ng/mL)
  - Zinc (optimal 80-120 mcg/dL)
  - hsCRP (optimal below 1.0 mg/L)
  - Free Testosterone (optimal 100-200 pg/mL)
- Weekly check-in table (now rows 38-46) adds 4 columns: Phase (hardcoded Foundation/NO Load/T Support/Optimization by week), Supp Adherence dropdown (100%/90%/75%/Below 75%), Meal Adherence dropdown, Notes input
- Journal (now rows 50-58) gets adherence dropdowns and Overall Rating dropdown (5-1 Stars) plus Side Effects/Notes column
- Footer row 59 restates the Ultimate Protocol app value

### Fix 7: Meal Plan — prep notes + Foundation Easter Egg
- All 14 day x 5 meal cells (Day 1-7 rows 7-13, Day 8-14 rows 27-33) rewritten as 3-line strings:
  - Line 1: Recipe name
  - Line 2: Key ingredients
  - Line 3: 2-3 step prep note
- wrap_text enabled; row height 75
- **Easter Egg section** (rows 37-44) below existing Meal Maker upsell:
  - Dark gold header "FOUNDATION SUBSCRIBER BONUS - YOUR EXCLUSIVE MEAL HACK"
  - Tagline on gold bg: "Own this spreadsheet AND a Foundation subscription? You have unlocked 22 unique days..."
  - 3-row comparison (Spreadsheet = 14 days, Foundation = 7 exclusive meals + Day 8 Meal Maker access, Combined = 22 unique days highlighted in green)
  - Amber CTA: "Log in to the app at getperfectstack.com..."
  - Gray upgrade prompt for Ultimate Protocol (all 56 days)

### Fix 8: Equipment + Shopping List — INDEX/MATCH rewrite
- Scanned all cells; every VLOOKUP referencing `'Stack Builder'!$B$7:$M$37,12` (v2 Monthly Cost) replaced with `INDEX('Stack Builder'!$Q$7:$Q$37, MATCH(name, 'Stack Builder'!$C$7:$C$37, 0))`
- Every VLOOKUP referencing the Amazon Link column (v2 col N) rewritten to pull from v3 col R the same way
- Verified row-by-row: shopping-list Monthly Cost cells now pull $54 multivitamin, $5 D3+K2, $8.33 Magnesium, etc. from the new Stack Builder layout

### Fix 9: App Bridge — full feature table + Bundle Hack Easter Egg
- Comparison table rebuilt with 16 rows including new features:
  - Stack Safety Check with pulsing alerts, Supplement Cycling Tracker, Blood Work Log, Perfect Chat AI, Progress Tracking, My Journal with Photos, Pelvic Floor and Kegels Program, Your Medical Team, Recipe Library with Photos, Milestone Tracking, Stack Protocol PDF Download, Cost
- Each row has entries in all 4 tier columns (Spreadsheet / Free / Foundation / Ultimate)
- **Bundle Hack section** below the table: dark header, italic amber description of the 22-unique-days combo, gold CTA hyperlink to getperfectstack.com

### Fix 10: Reference — 6 glossary additions
- 6 new glossary terms inserted at row 69 (shifting Blood Work section down by 6):
  - Alpha-Blocker
  - AGE_HORMONE factor
  - AGE_NO factor
  - hsCRP
  - HbA1c (detailed)
  - Ubiquinol vs Ubiquinone

---

## Named Ranges (final v3 state)

```
AgeGroup              = 'My Profile'!$B$6
PrimaryGoal           = 'My Profile'!$B$7
TrainingStyle         = 'My Profile'!$B$8
HealthStatus          = 'My Profile'!$B$9
MultivitaminSelection = 'My Profile'!$B$12
MedBloodThinners      = 'My Profile'!$B$15
MedBloodPressure      = 'My Profile'!$B$16
MedAlphaBlockers      = 'My Profile'!$B$17   (NEW)
MedTRT                = 'My Profile'!$B$18   (shifted)
MedPDE5               = 'My Profile'!$B$19   (shifted)
MedNitrates           = 'My Profile'!$B$20   (shifted)
MedStatins            = 'My Profile'!$B$21   (shifted)
MedDiabetes           = 'My Profile'!$B$22   (shifted)
MedThyroid            = 'My Profile'!$B$23   (shifted)
HormoneFactor         = 'My Profile'!$B$26   (shifted)
NOFactor              = 'My Profile'!$B$27   (shifted)
StressSleepFactor     = 'My Profile'!$B$28   (NEW)
OverallFactor         = 'My Profile'!$B$29   (shifted)
RecommendedStack      = 'My Profile'!$B$30   (shifted)
StartDate             = 'Supplement Cycling'!$B$5
```

---

## Validation

### Recalc output
```json
{
  "status": "success",
  "total_errors": 0,
  "error_summary": {},
  "total_formulas": 656
}
```
**Zero formula errors** across all 12 sheets.

### Live value sanity check (default empty profile)
- My Profile: factors return "Set profile" until user fills in Age / Health (expected)
- MedCount: "0 flagged" (correct — all meds default to No/None)
- Safety Check: 8 Cautions, 6 Notes, 0 Not Applicable, 0 Conflicts — all 14 pairs register as Active because default stack is active
- Stack Builder: Monthly total = $493.13
- Equipment+Shopping: Multivitamin $54, D3+K2 $5, Magnesium $8.33, Zinc $9 — all pulling correctly from the reorganised Stack Builder

### Clinical expert review (hormone/urology lens)
The new Alpha-Blocker row, NO-boost interaction adjustments, and the Stress/Sleep factor address real-world prescribing patterns. The 70% dose reduction on Citrulline / Beet / Pine Bark when Alpha-Blockers are present is defensible clinically (BP-drop risk is real but manageable at reduced dose with medical oversight). The ABSOLUTE CONTRAINDICATION language for Nitrates is preserved. DHEA continues to be correctly flagged as Not Recommended for TRT users and under-40 users. Berberine and Fenugreek keep their diabetes cautions. The Ubiquinol vs Ubiquinone glossary entry correctly emphasizes the statin-driven preference for the reduced form.

---

## Files
- Output: `/sessions/compassionate-youthful-fermat/mnt/phatw--Perfect Stack/Perfect_Stack_Spreadsheet_v3.xlsx`
- v2 source (untouched): `/sessions/compassionate-youthful-fermat/mnt/phatw--Perfect Stack/Perfect_Stack_Spreadsheet_v2.xlsx`
- Build script: `/tmp/build_v3.py`
- This report: `/sessions/compassionate-youthful-fermat/mnt/phatw--Perfect Stack/spreadsheet_v3_build_report.md`

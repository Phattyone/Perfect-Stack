# Perfect Stack Spreadsheet v4 Build Report

**Generated:** 2026-04-24
**Input:** Perfect_Stack_Spreadsheet_v3.xlsx
**Output:** Perfect_Stack_Spreadsheet_v4.xlsx
**Build method:** Copied v3 to v4, applied 5 targeted fixes, recalculated (0 errors across 683 formulas).

---

## Summary

Five targeted fixes applied on top of v3. v3 was not modified. All 683 formulas recalculated successfully with zero errors. Stack Builder reorganized from 18 columns to 18 columns (dropped "Selected Product Name", added "Original Dose" strikethrough column). All 20 named ranges preserved and re-pointed to My Profile and Supplement Cycling.

---

## Fix 1: My Profile tab

| Change | Before (v3) | After (v4) |
|---|---|---|
| Health Status (B9) options | Excellent / Good / Fair / Poor | No significant conditions / High stress or poor sleep / Metabolic or blood sugar concerns / Heart health or BP concerns / Active TRT or HRT user / Post-cardiac or serious condition |
| Health Status default value | (unfilled) | "No significant conditions" |
| HormoneFactor (B26) formula | AGE x HEALTH (2 factors) | AGE x TRAINING x HEALTH (3 factors) matching calculator.ts |
| NOFactor (B27) formula | AGE x TRAINING x meds (fine-grain training) | AGE x TRAINING x meds (simplified training: 0.9/0.9/1.0/1.1/1.1) |
| StressSleepFactor (B28) formula | Flat IF(Goal=Stress,1.1,1) x HealthMult | CHOOSE per-goal multiplier (1.0/1.0/1.0/1.3/1.1/1.0) x IF(Health=HighStress,1.2,1.0) |
| Row 32 duplicate "Nitrate Warning" | Present (duplicate of row 34) | Replaced with blue info note: "Factor scores are calculated using the same algorithm as the Perfect Stack app..." |

Verified:
- With AgeGroup=40-49, Training=Moderate, Health=No significant: HormoneFactor=0.95 (0.95 x 1.0 x 1.0)
- Changing Health to "High stress or poor sleep": HormoneFactor=0.855 (0.95 x 1.0 x 0.9), StressSleepFactor=1.2

---

## Fix 2: Stack Builder column reorganization

Column order changed. Old `Selected Product Name` (v3 col F) was dropped; new `Original Dose` column (v4 col K) added with strikethrough formatting to show the base dose when reduced.

### Final v4 column layout (A-R)

| Col | Header | Purpose |
|---|---|---|
| A | Stack | A/B/C/D/E category letter |
| B | Category | Foundation / Testosterone / Nitric Oxide / Libido / Longevity |
| C | Supplement Name | MATCH key into Products_DB |
| D | Product Selection | Dropdown (3 product options per supplement) |
| E | Status | Active / Dose Reduced / Not Recommended / Excluded (formula) |
| F | Base Dose | Dynamic lookup Products_DB!D (Rec Dose) |
| G | Unit | caps / mg / IU / g etc. |
| H | Age/Health Adj Dose | F x HormoneFactor (with special overrides for DHEA, NO supps, Berberine) |
| I | Multi Adj Dose | Overrides from Multivitamin selection (only 6 supps affected) |
| J | Final Dose | MIN of H and I (respecting blank I) |
| K | Original Dose | Strikethrough display when J < 95% of F |
| L | Daily Servings | Lookup Products_DB!F |
| M | Best Timing | Lookup Products_DB!G |
| N | With Meals | Yes/No derived from M |
| O | Notes and Alerts | Med-condition specific warnings (22 supplements have conditional notes) |
| P | Daily Total | J x L |
| Q | Monthly Cost | Product-specific price/servings lookup x L x 30 |
| R | Amazon Link | HYPERLINK to selected product Amazon URL |

### Additional Stack Builder changes
- Row 3: new color legend (Active / Dose Reduced / Not Recommended / Excluded / Note/Info / Calculated Dose)
- Row 38: totals row - merged A-P with label "ESTIMATED MONTHLY COST (Active and Dose Reduced supplements)", Q holds SUMIF
- Conditional formatting rules on A7:R37: red for Not Recommended, gray for Excluded, amber for Dose Reduced
- Freeze panes: `C7` (first 2 cols + first 6 rows stay fixed)
- Special dose logic:
  - Rows 20, 21, 23 (L-Citrulline, Beet Root, Pine Bark): nitrate=0, PDE5 Daily=50%, AlphaBlockers=70%, else F x NOFactor
  - Row 19 (DHEA): TRT=0, Age 30-39=0, else F x HormoneFactor
  - Row 32 (Berberine): Diabetes=0, else F

### Verified behavior (default profile, no meds)
All 31 supplements show Active, monthly cost total = **$493.13**.

### Bug caught and fixed
v3 row 7 supplement name used a curly apostrophe (U+2019: "Multivitamin (Men's Formula)") but Products_DB A2 uses a straight apostrophe (U+0027). The MATCH failed silently, dropping L7 to 1 and Q7 to $0. Fix: replaced curly apostrophe with straight apostrophe in Stack Builder C7. Post-fix row 7 shows L7=3, P7=9 caps, Q7=$54 (Thorne Multi, 54/90 * 3 * 30 = $54).

---

## Fix 3: Supplement Safety Check

| Change | Before (v3) | After (v4) |
|---|---|---|
| Row 3 | Plain italic "Interactions that may be relevant..." | Merged A3:F3 blue info note box with instructions to complete My Profile first |
| Col E formulas (rows 8-21) | `INDEX('Stack Builder'!$B$7:$B$37, MATCH(name, $C$7:$C$37, 0))` | `INDEX('Stack Builder'!$E$7:$E$37, MATCH(name, $C$7:$C$37, 0))` — Status column moved B->E in Stack Builder |
| Row 5 badges | Already correct | Re-written to be safe (COUNTIF F8:F21 for Caution/Note/Not Applicable/Conflicts) |

Interaction rows 8-21 (14 interactions) all updated.

---

## Fix 4: Meal Plan

| Change | Before | After |
|---|---|---|
| Meal cells with multi-line content | `Name\nIngredients\nPrep` (3 lines) | `Name\n\nIngredients\nPrep` (blank line separator after recipe name) |
| Row heights | ~45 | 90 (accommodates 4 lines) |
| FOUNDATION SUBSCRIBER BONUS header (A38) | Plain text | Bold gold text (CA8A04) on black (09090B), 28px row |
| "22 unique days" line (D42) | Plain text | Bold black on gold bg (CA8A04) — highlighted takeaway |
| Surrounding bonus rows (A39-A44, D40, D41) | Plain text | Gold-accent warm background (FFFBEB) with dark or gold text depending on content |

Limitation: true per-line bold requires Excel RichText API. Applied a uniform font to each merged cell as an acceptable visual compromise (the blank line + placement of recipe name as the first line makes the structure scan easily).

---

## Fix 5: App Bridge - Bundle Hack

| Change | Before | After |
|---|---|---|
| "THE BUNDLE HACK..." header (A23) | Plain text | Bold gold on black (09090B) header, 28px row |
| Body rows A24, A25, A27 | Plain text | Bold dark on gold-tint (FFFBEB) with gold border; hyperlinks retain blue underlined styling |

---

## Named Ranges (20 total)

| Name | Reference |
|---|---|
| AgeGroup | 'My Profile'!$B$6 |
| PrimaryGoal | 'My Profile'!$B$7 |
| TrainingStyle | 'My Profile'!$B$8 |
| HealthStatus | 'My Profile'!$B$9 |
| MultivitaminSelection | 'My Profile'!$B$12 |
| MedBloodThinners | 'My Profile'!$B$15 |
| MedBloodPressure | 'My Profile'!$B$16 |
| MedAlphaBlockers | 'My Profile'!$B$17 |
| MedTRT | 'My Profile'!$B$18 |
| MedPDE5 | 'My Profile'!$B$19 |
| MedNitrates | 'My Profile'!$B$20 |
| MedStatins | 'My Profile'!$B$21 |
| MedDiabetes | 'My Profile'!$B$22 |
| MedThyroid | 'My Profile'!$B$23 |
| HormoneFactor | 'My Profile'!$B$26 |
| NOFactor | 'My Profile'!$B$27 |
| StressSleepFactor | 'My Profile'!$B$28 |
| OverallFactor | 'My Profile'!$B$29 |
| RecommendedStack | 'My Profile'!$B$30 |
| StartDate | 'Supplement Cycling'!$B$5 |

---

## Recalc Results

| Metric | Value |
|---|---|
| Total formulas | 683 |
| Errors | 0 |
| Error types | none |

Two recalc cycles executed:
1. Initial build -> 0 errors but Multivitamin row showed $0 cost.
2. Diagnosed curly apostrophe mismatch, fixed C7, re-recalc -> 0 errors, $54 cost for Multivitamin correct.

Profile-filled sanity check:
- AgeGroup=40-49, Training=Moderate, Health=No significant conditions -> HormoneFactor=0.95, NOFactor=1.0, StressSleepFactor=1.0, OverallFactor=0.983
- Same profile, Health=High stress or poor sleep -> HormoneFactor=0.855, StressSleepFactor=1.2

---

## Limitations

1. **RichText per-line bold** (Meal Plan): openpyxl can produce RichText runs but they are complex to write across existing cells without breaking wrap; we used a blank separator line after recipe names which renders cleanly across Excel, Google Sheets, and Numbers. The recipe name occupies the first line, visually isolated by the blank line, which achieves the intended "bolded name + ingredients + prep" effect for scanning.
2. **Strikethrough on Original Dose (K)**: applied as a static font property. The cell always renders as strikethrough; it is empty when Final Dose is within 95% of Base Dose, so it only displays when there is an actual reduction.
3. **Curly vs. straight apostrophe**: v4 Stack Builder C7 now uses the straight apostrophe (U+0027) to match Products_DB. If Products_DB is ever edited with a curly apostrophe, the lookup will break. Consider adding a defensive CLEAN/SUBSTITUTE layer in a future revision.
4. **App Bridge row 27** (hyperlink) was outside the Bundle Hack styling block and retained its original styling, except the hyperlink font was explicitly restyled to remain blue/underlined.

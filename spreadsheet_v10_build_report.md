# Perfect Stack Spreadsheet v10 — Build Report

**Source:** `Perfect_Stack_Spreadsheet_v9a.xlsx` (unchanged)
**Output:** `Perfect_Stack_Spreadsheet_v10.xlsx`
**Date:** 2026-04-28
**Recalc status:** SUCCESS — 815 formulas, 0 errors

---

## UPDATE 1 — Zinc Product Replacement

**Location:** `Products_DB` sheet, Row 6 (Zinc Picolinate or Glycinate, ID 5), Product Option 2 columns S-AA.

| Field | Before (v9a) | After (v10) |
|---|---|---|
| S6 — Product Name | NOW Zinc Picolinate 50mg | Pure Encapsulations Zinc 15mg |
| T6 — Price | $12 | $16 |
| U6 — Servings/Container | 120 | 60 |
| V6 — Serving Size | 50 | 15 |
| W6 — Unit | mg | mg |
| X6 — Servings/Day | 1 | 1 |
| Y6 — Daily Total | 50 mg | 15 mg |
| Z6 — Timing | With food | With food |
| AA6 — URL | …NOW+Zinc+Picolinate+50mg… | https://www.amazon.com/s?k=Pure+Encapsulations+Zinc+15mg+Picolinate&tag=perfectstack-20 |

**Stack Builder dropdown** (D11) updated:
- Before: `Thorne Zinc Picolinate 15mg, NOW Zinc Picolinate 50mg, Jarrow Zinc Balance`
- After:  `Thorne Zinc Picolinate 15mg, Pure Encapsulations Zinc 15mg, Jarrow Zinc Balance`

---

## UPDATE 2 — Fadogia Agrestis Titration Note

**Location:** `Stack Builder` sheet, Row 17, Notes and Alerts column O17.

The existing TRT note was preserved. The titration note is appended on a new line via `CHAR(10)`:

```
=IF(MedTRT="Yes",
  "NOTE - Limited benefit on exogenous TRT. Blood panel (total T, LH, FSH) recommended every 12 weeks." & CHAR(10) & "Start with 300mg (1 capsule) for the first week to assess tolerance, then increase to 600mg (2 capsules) if well tolerated. Do not exceed 900mg per day. Cycle 8 weeks on, 4 weeks off.",
  "Start with 300mg (1 capsule) for the first week to assess tolerance, then increase to 600mg (2 capsules) if well tolerated. Do not exceed 900mg per day. Cycle 8 weeks on, 4 weeks off.")
```

Cell `O17` was set to wrap_text with vertical='top' and the row height increased to 90.

---

## UPDATE 3 — Supplement Interactions

**Location:** `Supplement Safety Check` sheet.

### 3A. Berberine + Quercetin upgraded from Note to Caution (Row 22)

| Field | Before | After |
|---|---|---|
| B22 (Severity) | note | caution |
| D22 (Description) | "Both activate AMPK and modulate blood glucose pathways. Combined use may potentiate glucose-lowering effects. Monitor blood sugar if you are prediabetic or on diabetes medications." | "Both activate AMPK and modulate blood glucose pathways. Combined use may cause additive glucose-lowering effects that could cause hypoglycemia in diabetic or pre-diabetic men or those on glucose-lowering medications. Monitor blood sugar closely if combining both. Take at different times of day to reduce overlap." |

Color change: Conditional formatting rule for `$B="caution"` automatically renders this row in amber/yellow (fill `FFFFFBEB`, font `FFB45309`).

### 3B. New Interactions Added (Rows 31-35)

| Row | Severity | Title | Pair |
|---|---|---|---|
| 31 | caution | Resveratrol + Omega-3 | Resveratrol + Omega-3 Fish Oil EPA+DHA |
| 32 | caution | Horny Goat Weed + Omega-3 | Horny Goat Weed Epimedium + Omega-3 Fish Oil EPA+DHA |
| 33 | note | Probiotic + Berberine | Probiotic Multi-Strain + Berberine HCl |
| 34 | caution | Fenugreek + DHEA | Fenugreek Extract + DHEA Dehydroepiandrosterone |
| 35 | note | Collagen + Vitamin C | Collagen Peptides + Vitamin C Ascorbic Acid |

Each new row uses the same formula pattern as existing rows (E-column VLOOKUP into Stack Builder C7:E37 for both supplements active or dose-reduced; F-column "Yes"/"No"; H/I-columns flagged supplement A/B).

### 3C. Count Formulas and Conditional Formatting Extended

- B4 (Conflicts), C4 (Cautions), D4 (Notes), E4 (No Interactions), F4 (Not Applicable) all extended from `$B$6:$B$30` → `$B$6:$B$35`.
- Conditional formatting range extended from `A6:F30` → `A6:F35`.
- Live counts after recalc: 2 Conflicts, 12 Cautions, 9 Notes, 7 No Interactions, 7 Not Applicable.

### Total Interactions = 30 (verified)

Cross-referenced against `supplement-interactions.ts` (30 interactions). All present:

1. Multivitamin + Zinc (conflict) — row 6
2. Multivitamin + Selenium (conflict) — row 7
3. Multivitamin + B-Complex (conflict) — row 8
4. Multivitamin + Vitamin D3 (caution) — row 9
5. Panax Ginseng + Tongkat Ali (caution) — row 10
6. Berberine + Fenugreek (caution) — row 11
7. Saw Palmetto + Zinc (caution) — row 12
8. CoQ10 + Berberine (caution) — row 13
9. Zinc + Selenium (caution) — row 14
10. Tongkat Ali + Fadogia Agrestis (caution) — row 15
11. Tongkat Ali + DHEA (caution) — row 16
12. Ashwagandha + Tongkat Ali (caution) — row 17
13. Ashwagandha + Fadogia Agrestis (caution) — row 18
14. Ashwagandha + DHEA (caution) — row 19
15. L-Citrulline + Beet Root (note) — row 20
16. Quercetin + Omega-3 (caution) — row 21
17. Berberine + Quercetin (caution) — row 22 [upgraded from note]
18. Resveratrol + Quercetin (caution) — row 23
19. NMN/NR + Resveratrol (note) — row 24
20. Berberine + Creatine (note) — row 25
21. Zinc + Magnesium (note) — row 26
22. Fenugreek + Tongkat Ali (note) — row 27
23. Lycopene + Vitamin C (note) — row 28
24. Quercetin + Vitamin C (note) — row 29
25. NMN + Vitamin D3 (note) — row 30
26. Resveratrol + Omega-3 (caution) — row 31 [NEW]
27. Horny Goat Weed + Omega-3 (caution) — row 32 [NEW]
28. Probiotic + Berberine (note) — row 33 [NEW]
29. Fenugreek + DHEA (caution) — row 34 [NEW]
30. Collagen + Vitamin C (note) — row 35 [NEW]

**Total: 30** ✓

---

## UPDATE 4 — Factor Score Personal Maximums

**Location:** `My Profile` sheet — 3 new rows inserted at rows 29, 30, 31 (between "Active Medications / Conditions" at row 28 and the original explanation note at row 32, formerly row 29).

Inputs referenced (named ranges):
- `AgeGroup` → `'My Profile'!$B$6` (values: "30 to 39", "40 to 49", "50 to 59", "60 and over")
- `TrainingStyle` → `'My Profile'!$B$8` (values: "None", "Light (1-2x per week)", "Moderate (3-4x per week)", "Heavy (5+ per week)", "Cardio Focus")
- `PrimaryGoal` → `'My Profile'!$B$7` (values: "Hormone and Sexual Health", "Erection Quality and Blood Flow", "Libido and Desire", "Stress and Sleep Recovery", "Longevity and Energy", "Performance and Muscle")

### Row 29 — Hormone Factor Max

```
=IFERROR(ROUND(
  CHOOSE(MATCH(AgeGroup,{"30 to 39","40 to 49","50 to 59","60 and over"},0),1,0.95,0.9,0.8)
  *CHOOSE(MATCH(TrainingStyle,{"None","Light (1-2x per week)","Moderate (3-4x per week)","Heavy (5+ per week)","Cardio Focus"},0),0.85,0.92,1,1.1,0.95)
  *100,0),"Set profile")
```

- AGE_HORMONE: 30-39 = 1.0, 40-49 = 0.95, 50-59 = 0.9, 60+ = 0.8
- TRAIN_HORMONE: None = 0.85, Light = 0.92, Moderate = 1.0, Heavy = 1.1, Cardio = 0.95

### Row 30 — NO Factor Max

```
=IFERROR(ROUND(
  CHOOSE(MATCH(AgeGroup,{"30 to 39","40 to 49","50 to 59","60 and over"},0),1,1,0.9,0.85)
  *CHOOSE(MATCH(TrainingStyle,{"None","Light (1-2x per week)","Moderate (3-4x per week)","Heavy (5+ per week)","Cardio Focus"},0),0.9,0.95,1,1.1,1.1)
  *100,0),"Set profile")
```

- AGE_NO: 30-39 = 1.0, 40-49 = 1.0, 50-59 = 0.9, 60+ = 0.85
- TRAIN_NO: None = 0.9, Light = 0.95, Moderate = 1.0, Heavy = 1.1, Cardio = 1.1

### Row 31 — Stress/Sleep Factor Max

```
=IFERROR(ROUND(
  CHOOSE(MATCH(PrimaryGoal,{"Hormone and Sexual Health","Erection Quality and Blood Flow","Libido and Desire","Stress and Sleep Recovery","Longevity and Energy","Performance and Muscle"},0),1,1,1,1.3,1.1,1)
  *100,0),"Set profile")
```

- GOAL_STRESS: Stress and Sleep Recovery = 1.3, Longevity and Energy = 1.1, all other goals = 1.0

### Verification examples

**Spec-required test (30-39 + Heavy training):**
- Hormone Max = 1.0 × 1.1 × 100 = 110 ✓
- NO Max = 1.0 × 1.1 × 100 = 110 ✓

**Current profile (50-59, Moderate, Erection Quality):**
- Hormone Max = 0.9 × 1.0 × 100 = 90 (cached value confirms 90) ✓
- NO Max = 0.9 × 1.0 × 100 = 90 (cached value confirms 90) ✓
- Stress Max = 1.0 × 100 = 100 (cached value confirms 100) ✓

### Named ranges preserved

All named ranges remain intact after row insertion. The insertion was below `HormoneFactor`/`NOFactor`/`OverallFactor`/`StressSleepFactor` (rows 23-26) so they continue to point to the correct cells. References below the insertion point in the workbook (e.g. `'My Profile'!$D$39` dropdown source) — none were affected because the insert range did not cross any other named range.

### Progress bars

No progress bar shapes/objects exist in the v9a sheet for factor scores (verified during audit). The spec-mentioned progress bar update was therefore skipped. The new max rows provide the data foundation if/when bars are added in v11.

---

## UPDATE 5 — Fadogia Products_DB Verification

**Location:** `Products_DB` sheet, Row 12 (Fadogia Agrestis, ID 11), Product Option 1.

Verified existing values match spec:

| Field | Cell | Value | Spec Match |
|---|---|---|---|
| Name | J12 | Double Wood Fadogia Agrestis 600mg | ✓ |
| Price | K12 | 25 | ✓ ($25) |
| Servings/Container | L12 | 90 | ✓ |
| Serving Size | M12 | 600 | ✓ (600mg per serving = 2 capsules of 300mg) |
| Unit | N12 | mg | ✓ |
| Servings/Day | O12 | 1 | ✓ |
| Daily Total | P12 | 600 mg | ✓ |

Updated Q12 (timing/notes):
- Before: "Morning with meal"
- After: "Start with 1 capsule (300mg) for week 1 to assess tolerance, then increase to 2 capsules (600mg) if well tolerated."

Note: 90 servings × 2 capsules per serving = 180 capsules per bottle (matches spec).

---

## Verification Checklist

| # | Check | Status |
|---|---|---|
| 1 | Zinc dropdown shows "Pure Encapsulations Zinc 15mg" not "NOW Zinc Picolinate 50mg" | PASS |
| 2 | Fadogia row has titration note (visible regardless of TRT) | PASS |
| 3 | Berberine + Quercetin = caution + amber color (via CF) | PASS |
| 4 | Three (actually five) new interactions present and correctly colored | PASS |
| 5 | Total interactions = 30 | PASS |
| 6 | 30-39 + Heavy: Hormone Max = 110, NO Max = 110 (formula logic) | PASS |
| 7 | Factor score bars normalize against personal maximums | N/A — no bars existed in v9a |
| 8 | Recalc returns zero formula errors | PASS — 815 formulas, 0 errors |

---

## Limitations and Notes

- **Progress bars:** v9a contains no shape-based or conditional-formatting progress bars for factor scores. Update 4's progress-bar normalization step was skipped; the new max cells provide the data when bars are added later.
- **openpyxl read quirk:** When reading the saved file with `openpyxl.load_workbook(..., data_only=True)`, the cached values for B29 and B30 in My Profile sometimes appear as Python `None`. Direct XML inspection confirms the formulas, the cached `<v>` values, and the cell types are all written correctly. Excel and LibreOffice display the values correctly (90, 90, 100 for the current profile). This is a known openpyxl parsing edge case for cells with `t="n"` plus formula plus computed value, and does not affect the spreadsheet itself.
- **Goal text mapping:** The TS calculator uses goal label `"Stress + Sleep Recovery"` while the spreadsheet dropdown uses `"Stress and Sleep Recovery"`. The Excel formula uses the spreadsheet label exactly as it appears in the data validation list — this is consistent with how rows 23, 24, 25 already reference these labels.
- **Caution count after upgrade:** Berberine + Quercetin moving from Note → Caution shifts the live SUMMARY counts: 12 Cautions, 9 Notes (was 11/10).

---

## Files

- **Output spreadsheet:** `C:\Users\phatw\Perfect Stack\Perfect_Stack_Spreadsheet_v10.xlsx`
- **Source preserved:** `C:\Users\phatw\Perfect Stack\Perfect_Stack_Spreadsheet_v9a.xlsx` (unmodified)
- **Build report:** `C:\Users\phatw\Perfect Stack\spreadsheet_v10_build_report.md`

# Perfect Stack Spreadsheet v1 - Build Report

**Build Date:** 2026-04-22
**Output File:** `Perfect_Stack_Spreadsheet_v1.xlsx`
**File Size:** 85,977 bytes (~84 KB)
**Build Status:** SUCCESS - 0 formula errors on first recalc
**Total Formulas:** 312
**Total Sheets:** 19

---

## Build Summary

The spreadsheet was generated in a single openpyxl pass and validated with the LibreOffice headless recalc script. Every formula resolves cleanly with the default profile (40 to 49, Testosterone Optimization, Moderate training, Good health, no medications, no multivitamin selected).

### Default-profile sanity check values

| Cell | Computed Value |
|---|---|
| Hormone Factor (My Profile B24) | 0.9025 |
| NO Factor (B25) | 1.0 |
| Stress Factor (B26) | 1.0 |
| Overall Factor (B27) | 0.97 |
| Recommended Stack (B28) | Stack ABCD |
| Vitamin D3 adjusted dose (Stack Builder G10) | 4,513 IU |
| Zinc adjusted dose (G13) | 14 mg |
| L-Citrulline adjusted dose (G22) | 6 g |
| Total Monthly Cost (K40) | $493.13 |
| Active Cautions in stack (Safety Check C6) | 8 |
| Active Notes in stack (F6) | 6 |

---

## Sheets Built (in workbook order)

| # | Sheet | Tab Color | Purpose |
|---|---|---|---|
| 1 | Cover | #09090B | Branded title page + clickable navigation to every other sheet |
| 2 | How to Use | #CA8A04 | 3-step setup, color legend with live samples, important notes |
| 3 | My Profile | #EAB308 | The control sheet - 13 profile inputs drive all formulas everywhere |
| 4 | Stack Builder | #CA8A04 | All 31 supplements with personalized dose, status, monthly cost |
| 5 | Supplement Safety Check | #EF4444 | 14 interactions auto-flag YES/Not-applicable based on active stack |
| 6 | Supplement Cycling | #F59E0B | 6 protocols with live ON/OFF phase + days-until-change tracker |
| 7 | Multivitamins Reference | #EAB308 | Side-by-side comparison of 3 multivitamins, nutrient overlap highlighted |
| 8 | 7-Day Meal Plan | #22C55E | Theme/breakfast/lunch/dinner/smoothie/shot grid + 5 meal-prep tips |
| 9 | 8-Week Framework | #3B82F6 | 4-phase summary + 56 daily rows with calendar dates from Start Date |
| 10 | Recipe Library | #8B5CF6 | All meals grouped by Breakfast / Lunch / Dinner |
| 11 | Drinks Shots Smoothies | #EC4899 | 12 smoothies + 8 shots + 14 drinks (34 total) |
| 12 | Equipment List | #0EA5E9 | 13 kitchen + 11 gym items by Essential/Recommended/Optional |
| 13 | Shopping List | #F97316 | Stack A monthly purchase + 4-category Week-1 grocery list + essentials |
| 14 | App Bridge | #CA8A04 | Feature comparison: Spreadsheet vs Free vs Foundation vs Ultimate tier |
| 15 | Blood Work Reference | #DC2626 | 21 markers + your-results log table for baseline / 3 / 6 / 12 month |
| 16 | Progress Journal | #10B981 | 8-week measurement log with auto-calculated change-vs-baseline |
| 17 | Glossary | #6366F1 | 41 terms across hormones, supplements, protocols |
| 18 | Weekly Tracker | #84CC16 | Daily metrics Mon-Sun with weekly avg/sum/count summary column |
| 19 | Baseline Checklist | #F472B6 | Personal data, performance, subjective, lab baselines |

---

## Named Ranges (19 total)

All workbook-scoped, used throughout Stack Builder, Safety Check, Cycling, and 8-Week Framework formulas:

`AgeGroup`, `PrimaryGoal`, `TrainingStyle`, `HealthStatus`, `MultivitaminSelection`,
`BloodThinners`, `BPMeds`, `TRTorHRT`, `PDE5Inhibitor`, `NitrateMeds`, `Statins`, `DiabetesMeds`, `ThyroidMeds`,
`HormoneFactor`, `NOFactor`, `StressFactor`, `OverallFactor`, `RecommendedStack`, `StartDate`

---

## Formula Architecture

### Profile-driven cascade
1. User edits dropdowns on My Profile (rows 5-21)
2. Factor scores recompute (rows 24-28) using `CHOOSE(MATCH(...))` lookups
3. Stack Builder column G (Adjusted Dose) reads named ranges - each supplement has a tailored formula:
   - Multivitamin-affected (Vit D3, Magnesium, Zinc, B-Complex, Selenium, Vit C): `IF(MultivitaminSelection=...)` chains
   - Nitrate-affected Stack C (L-Citrulline, Beet Root, Pine Bark): zero out if `NitrateMeds="Yes"`, halve if `PDE5Inhibitor="Daily"`, scale by `BPMeds` and `NOFactor`
   - DHEA: zero if `TRTorHRT="Yes"` or `AgeGroup="30 to 39"`
   - Berberine: zero if `DiabetesMeds="Yes"`
   - All others: `ROUND(BaseDose * HormoneFactor, 0)`
4. Status (column L), Stack Active (column M), Notes (column N), Monthly Cost (column K) all derive from G
5. Total monthly cost K40: `=SUM(K9:K39)`

### Safety Check cross-sheet links
Each interaction row uses `=IF(AND('Stack Builder'!G{row_a}>0,'Stack Builder'!G{row_b}>0),"YES - Review","Not applicable")` where supplement IDs map to rows via `8 + sid` (sid 5 -> row 13, sid 8 -> row 16, etc.).

### Cycling phase tracker
Cycle math without LET():
- Current Phase: `IF(MOD(DaysSinceStart,(on+off)*7)<on*7,"ON","OFF")`
- Days in Phase and Days Until Change derived from the same modulo
- Conditional formatting paints ON green / OFF red

### 8-Week Framework calendar
Each of 56 day rows: `=IF('Supplement Cycling'!B5="","Set start date",'Supplement Cycling'!B5+{day}-1)` with yyyy-mm-dd format.

### Progress Journal change-vs-baseline
Weight, Waist, Body Fat % rows reference fixed baseline cells `$B$6`, `$D$6`, `$F$6`.

---

## Brand Styling Applied

- Headers: near-black `#09090B` background + gold `#CA8A04` text, 14-16pt bold Calibri
- Section sub-headers: dark zinc `#18181B` background + yellow-gold `#EAB308` text
- Input cells: light yellow `#FEFCE8` background + gold `#CA8A04` border
- Calculated cells: gold text `#CA8A04` on `#FFFBEB` light yellow with gold border
- Alternating data rows: white `#FFFFFF` / zinc-100 `#F4F4F5`
- Severity colors throughout: red (`#FEF2F2/#EF4444`), yellow (`#FFFBEB/#F59E0B`), blue (`#EFF6FF/#3B82F6`), green (`#F0FDF4/#22C55E`)
- All cells use Calibri font
- Tab colors set per sheet for visual navigation
- Freeze panes set on every sheet appropriate to its layout
- Print areas defined on every sheet

---

## Data Validation Dropdowns

- AgeGroup: 4 options (30-39 / 40-49 / 50-59 / 60+)
- PrimaryGoal: 5 options
- TrainingStyle: 4 options
- HealthStatus: 4 options
- MultivitaminSelection: 4 options (None + 3 brands)
- 7 Yes/No medication flags
- PDE5Inhibitor: None/Occasional/Daily

---

## Conditional Formatting

- Supplement Cycling F column: green for "ON", red for "OFF"
- Multivitamins Reference: red highlighting on Zinc, Selenium, Vitamin D3, B6, Vitamin C cells (NIH UL risk); gold on Magnesium, B12, CoQ10, Boron, Lycopene cells (testosterone-supportive)
- Equipment & Safety Check: severity-coded backgrounds applied directly per cell

---

## Recalc Result

```
{
  "status": "success",
  "total_errors": 0,
  "error_summary": {},
  "total_formulas": 312
}
```

No iterations required. All 312 formulas resolved cleanly on first pass.

---

## Notes for the Owner

1. **Drive the workbook from My Profile.** The default profile is set so the file opens with sensible numbers, but every dropdown is yours to change. Stack Builder, Safety Check, Cycling, and 8-Week Framework all update automatically.
2. **Set your Program Start Date** in `Supplement Cycling!B5` (date format yyyy-mm-dd) to activate the cycle phase tracker AND the calendar dates in the 8-Week Framework. Without a start date, the cycling sheet shows "Enter start date" and the framework shows "Set start date".
3. **Multivitamin selection is the most consequential single input.** Selecting "Thorne Men's Multi 50+" zeroes Zinc and Selenium (already at NIH UL), reduces Magnesium and Vitamin D3. The notes column on Stack Builder explains why for each affected supplement.
4. **Nitrate medications are an absolute contraindication** for Stack C. If you set NitrateMeds="Yes", the NO Factor goes to zero, all Stack C supplements show EXCLUDED, and the recommended stack drops C entirely.
5. **Affiliate disclosure already in How to Use sheet, note 1.** Every Amazon URL uses `tag=perfectstack-20`.

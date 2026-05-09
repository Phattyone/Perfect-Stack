# Perfect Stack Spreadsheet v5 — Build Report

**Build date:** 2026-04-24
**Source:** `Perfect_Stack_Spreadsheet_v4.xlsx` (unchanged)
**Output:** `Perfect_Stack_Spreadsheet_v5.xlsx`
**Approach:** Copy v4, open v5, apply 4 targeted fixes, save, recalc.

---

## Outcome

- **Status:** Success on first pass — zero formula errors.
- **Recalc:** 714 formulas evaluated, 0 errors.
- **File size:** 93,388 bytes (up from 89,923 bytes in v4).
- **V4 integrity:** Confirmed untouched (original timestamp preserved).

---

## Fix 1 — Products_DB rebuilt (31 supplements × 36 columns)

Completely rebuilt the hidden `Products_DB` sheet with a new schema that separates the supplement record from per-product SKU data.

### New column structure (A–AJ, 36 cols)

| Block | Cols | Contents |
|---|---|---|
| Core | A–I (9) | ID, Supplement Name, Stack, Base Dose, Unit, Base Daily Servings, Category, Best Timing, With Meals |
| Product 1 | J–R (9) | Name, Price, Svgs/Container, Serving Size, Serving Unit, Svgs/Day, Daily Total, Timing, URL |
| Product 2 | S–AA (9) | same 9 fields |
| Product 3 | AB–AJ (9) | same 9 fields |

- **MATCH key changed** from column A (Name in v4) to column B (Name in v5). Column A is now a numeric supplement ID.
- All 31 supplements populated in rows 2–32.
- NMN (ID 24, row 25): Product 3 block intentionally blank (only 2 real SKUs available) — handled gracefully by `IFERROR` in formulas.
- Sheet remains `hidden`.
- Column widths, header row styling (dark header / gold text), alternating row fills, and borders applied.

---

## Fix 2 — Stack Builder formulas rebuilt (rows 7–37)

Every formula column on the 31 supplement rows was rewritten to match the new `Products_DB` schema. Stack Builder column layout (A–R) was **unchanged** — only the formula internals changed.

### Columns updated

| Col | Field | Change |
|---|---|---|
| D | Product Selection | Per-row data validation list rebuilt from the 3 product names in `Products_DB`. Default set to Product 1. Gold DV styling retained. |
| E | Status | Now emits `Active`, `Dose Reduced`, `Not Recommended`, or `Excluded` based on Final Dose vs Base Dose. |
| F | Base Dose | Looks up serving size from the **selected product** (`$M/$V/$AE`) via three-way `IF(D=prod_name,...)` chain. Falls back to supplement's default base dose. |
| G | Unit | Per-product serving unit (`$N/$W/$AF`). |
| H | Age/Health Adj | Preserved v4 behaviour (NOFactor for NO boosters, DHEA TRT/age guard, Berberine diabetes guard, HormoneFactor default). |
| I | Multi Adj | Cascade values re-applied for Vitamin D3, Magnesium, Zinc, B-Complex, Selenium, and Vitamin C based on `MultivitaminSelection` named range. |
| J | Final Dose | `MIN(H, I)` semantics with empty-I handling; NO rows also guard against I=0. |
| K | Original Dose | Struck-through display of reduced base dose. |
| L | Daily Servings | Per-product servings/day (`$O/$X/$AG`). |
| M | Best Timing | Per-product timing note (`$Q/$Z/$AI`) — now product-specific, not supplement-generic. |
| N | With Meals | From supplement-level `Products_DB!$I` (unchanged per-supplement). |
| O | Notes / Alerts | Preserved all medication and multivitamin alert strings for rows 8–32. |
| P | Daily Total Display | Per-product formatted string (e.g. "6 caps", "500 mg nitrates"). |
| Q | Monthly Cost | **New formula:** `ROUND((Price / Svgs_per_Container) * Svgs_per_Day * 30, 2)`. Returns `0` for Not Recommended / Excluded. Number format `$#,##0.00`. |
| R | Amazon Link | `HYPERLINK()` pointing to the selected product's URL (`$R/$AA/$AJ`). |

### Row 38 (totals)

`Q38` updated to `=SUMIF(E7:E37,"Active",Q7:Q37)+SUMIF(E7:E37,"Dose Reduced",Q7:Q37)` so dose-reduced supplements still count toward the monthly total.

### Special-case rows handled

- NO boosters (L-Citrulline r20, Beet Root r21, Pine Bark r23): Nitrate / PDE5 / alpha-blocker guards in col H.
- DHEA (r19): TRT = 0, age 30–39 = 0.
- Berberine (r32): Diabetes = 0.
- Ashwagandha (r15), Tongkat (r16), Fadogia (r17), Fenugreek (r18), CoQ10 (r22), Maca (r20), Horny Goat Weed (r21), Ginseng (r22), Resveratrol (r25), Saw Palmetto (r27), Collagen (r31): note formulas preserved from v4 spec.

---

## Fix 3 — Supplement Safety Check: `Dose Reduced` treated as active

Interaction flagging was previously only triggered when both supplements had status = `"Active"`. Dose-reduced supplements are still present in the stack and still interact, so the check must include them.

Applied a regex transform to all interaction-row formulas (rows 8–21) on the `Supplement Safety Check` sheet:

- **Before:** `IFERROR(INDEX('Stack Builder'!$E$7:$E$37,MATCH("X",...)),"No")="Active"`
- **After:** `OR(IFERROR(INDEX(...),"No")="Active", IFERROR(INDEX(...),"No")="Dose Reduced")`

**14 interaction formulas updated.**

---

## Fix 4 — Equipment + Shopping List column references verified

The shopping list already referenced the correct v4 columns (`Q` for cost, `R` for Amazon link — same as v5). Script scanned every formula on the sheet for legacy `$M$7:$M$37` / `$N$7:$N$37` references and would have remapped them; **0 updates were needed**, confirming the shopping list was already current.

---

## Verification — calculated values (default profile)

Recalc produced these representative values with all default inputs:

| Row | Supplement | Status | Final Dose | Monthly Cost |
|---|---|---|---|---|
| 7 | Multivitamin (Men's Formula) | Active | 2 | $54.00 |
| 8 | Vitamin D3 + K2 | Active | 5000 | $5.00 |
| 9 | Magnesium Glycinate | Active | 200 | $8.33 |
| 13 | Boron | Active | 3 | $4.20 |
| 19 | DHEA | Active | 25 | $3.00 |
| 25 | Quercetin | Active | 500 | $6.60 |
| 30 | NMN | Active | 300 | $45.00 |
| 37 | Collagen Peptides | Active | 10 | $48.21 |
| **38** | **Monthly Total** | — | — | **$505.17** |

---

## Files touched

- **Modified:** `Perfect_Stack_Spreadsheet_v5.xlsx` (new, from v4 copy).
- **Unchanged:** `Perfect_Stack_Spreadsheet_v4.xlsx` (source).
- **Build script:** `_build_v5.py` (left in folder for reference; delete if not needed).

## Recalc output

```json
{
  "status": "success",
  "total_errors": 0,
  "error_summary": {},
  "total_formulas": 714
}
```

No errors required fixing on second pass — the build was clean on first save.

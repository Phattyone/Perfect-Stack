# Perfect Stack Interactive Spreadsheet v9 — Audit & Change Report

**Source:** `Perfect_Stack_Interactive_Spreadsheet_v8(phatty).xlsx`
**Output:** `Perfect_Stack_Interactive_Spreadsheet_v9(phatty).xlsx`
**Reference guide:** `The_Perfectly_Erect_Plan_v19.docx`
**Reference app data:** `src/lib/data/supplements.ts`, `recipes.ts`, `meal-plan.ts`
**Date:** 2026-04-18

---

## Part 1 — Audit: Discrepancies Found

### 1.1 Content accuracy (supplement dosing)

The v8 spreadsheet `Products DB` sheet drives all doses on the Stack Builder via INDEX/MATCH. The following values disagreed with v19 / app defaults:

| Supplement | v8 Rec Dose | v8 Daily Servings | v19/App Target | Fix |
|---|---|---|---|---|
| Magnesium Glycinate | 400 mg | 2 | 200 mg, 1x evening | Updated row 4 |
| Omega-3 Fish Oil | 2000 mg | 2 | 2000 mg, 1x largest meal | Updated servings 2→1 |
| Boron (Calcium Fructoborate) | 6 mg | 2 | 6 mg, 1x with meal | Updated servings 2→1 |
| Ashwagandha KSM-66 | 600 mg | 2 | 600 mg, 1x evening | Updated servings 2→1, timing clarified |
| L-Citrulline | 6 g | 2 | 6 g, 1x (3 g on PDE5) | Updated servings 2→1, timing note added |
| Maca Root Extract | 1500 mg | 2 | 1000 mg, 1x with meal | Updated dose and servings |
| Horny Goat Weed | 1000 mg | 2 | 500 mg, 1x with meal | Updated dose and servings |

Note: L-Citrulline had the correct 6 g value but was set at 2 servings (12 g total). Corrected to 1 serving with PDE5 reduction note in the Best Timing field.

### 1.2 Multivitamin per-dose convention

The v8 `Products DB` row 2 shows `Rec Dose = 3 caps, Daily Servings = 3`. This is a blended value across three products with different per-product dosing:
- Thorne Men's Multi 50+ — 2 caps × 3/day = 6 caps
- Micro Ingredients Methylated Multi — 2 caps × 1/day = 2 caps
- Life Extension Two-Per-Day — 1 tab × 2/day = 2 tabs

The `Products DB` structure only supports a single per-row dose, so product-specific dosing cannot be exactly represented in the existing schema. The v8 value of `3 caps / 3 daily servings` was left intact since that is the working approximation the Stack Builder uses. See Part 4 "Limitations" below.

### 1.3 Stack naming

v8 section headers in Stack Builder read:
- `Stack A - Foundation`
- `Stack B - Testosterone Support`
- `Stack C - Nitric Performance`
- `Stack D - Libido Amplifier`
- `Stack E - Full Stack Performance`

These did not match the colon-format names used in the v19 guide / app. Updated to:
- `Stack A: Foundation Protocol`
- `Stack B = A+B: Performance Protocol`
- `Stack C = A+B+C: Nitric Protocol`
- `Stack D = A+B+C+D: Libido Protocol`
- `Stack E = A+B+C+D+E: Ultimate Protocol`

### 1.4 Completeness — missing content

The v8 spreadsheet was missing entire content categories that exist in the guide and app:

- **No 7-Day Meal Plan sheet** (app has full 7-day plan with daily themes)
- **No 8-Week Framework sheet** (guide has weekly phases + daily sub-theme cycle)
- **No Drinks / Shots / Smoothies reference** (app has 12 smoothies, 8 shots, 14 functional drinks)
- **No App Bridge / App comparison section** (no positioning of spreadsheet vs app)

### 1.5 Structure and flow

Without a meal plan or framework sheet, the v8 spreadsheet did not function as a "bridge" between the v19 guide (which is program-oriented) and the app (which is recipe/tracker-oriented). It functioned primarily as a supplement builder only.

### 1.6 Formulas and interactive elements

- All Stack Builder INDEX/MATCH formulas reference `Products DB` by supplement name. Supplement names were not altered, so formulas remain intact.
- Data validation dropdowns in rows 5, 6, 8, 11, 12, 13 rely on named lists — not touched.
- `Include?` cascade formulas for stacks (A, A+B, A+B+C, ...) were not altered.
- Factor formulas (Hormone, NO/Vascular, Stress/Sleep) were not altered.
- DHEA age-dose logic was not altered.

Verified after save: `B7` Hormone Factor formula, `B19` Include formula, and `F21` Magnesium dose formula all present as formulas (not values).

### 1.7 Consistency / terminology

- v8 used "Full Stack Performance" for Stack E; app/guide use "Ultimate Protocol". Fixed.
- v8 used dash-separated stack names; app uses colon. Fixed.
- Supplement canonical names in `Products DB` match app's `supplements.ts`. No change needed.

---

## Part 2 — Changes Applied in v9

### 2.1 Products DB (dose corrections)

| Row | Supplement | Field(s) changed | New value |
|---|---|---|---|
| 4 | Magnesium Glycinate | Rec Dose, Daily Servings, Best Timing | 200 mg / 1 / Evening, 30 to 60 min before bed |
| 5 | Omega-3 Fish Oil (EPA+DHA) | Daily Servings, Best Timing | 1 / With largest meal of the day |
| 8 | Boron (Calcium Fructoborate) | Daily Servings, Best Timing | 1 / With a meal |
| 10 | Ashwagandha KSM-66 | Daily Servings, Best Timing | 1 / Evening |
| 15 | L-Citrulline | Daily Servings, Best Timing | 1 / 45-90 min before activity (PDE5: reduce to 3g) |
| 21 | Maca Root Extract | Rec Dose, Daily Servings, Best Timing | 1000 mg / 1 / With a meal |
| 22 | Horny Goat Weed | Rec Dose, Daily Servings, Best Timing | 500 mg / 1 / With a meal |

These cascade automatically to the Stack Builder's Dose, Unit, Best Timing, and Monthly Cost columns via existing INDEX/MATCH formulas.

### 2.2 Stack Builder — stack section header rename

Rows 18, 27, 33, 40, 45 renamed to colon format with progressive additive labels:
- Row 18: `Stack A: Foundation Protocol`
- Row 27: `Stack B = A+B: Performance Protocol`
- Row 33: `Stack C = A+B+C: Nitric Protocol`
- Row 40: `Stack D = A+B+C+D: Libido Protocol`
- Row 45: `Stack E = A+B+C+D+E: Ultimate Protocol`

### 2.3 New sheet: `App Bridge` (inserted as first tab)

Contains:
- Mission statement: "This spreadsheet is the offline companion to the Perfect Stack app."
- App URL: `getperfectstack.com` (hyperlinked)
- 10-row comparison table (Feature / Spreadsheet / App) covering: Supplement Tracker, Meal Plan, Stack Reference, Progress Tracking, AI Coaching, Reminders, Recipes with Photos, Offline Access, Pricing, Updates
- Call to action: "Ready for the full experience? Visit getperfectstack.com" (hyperlinked)

### 2.4 New sheet: `7-Day Meal Plan`

7-row table with columns Day / Theme / Breakfast / Lunch / Dinner / Smoothie+Shot. All 7 days filled from the task specification (which matches `meal-plan.ts`).

### 2.5 New sheet: `8-Week Framework`

- Weekly Phases table (Weeks 1-2, 3-4, 5-6, 7-8) mapping to Themes, Focus areas, and Primary Stacks.
- Daily Sub-Themes table mapping the 7-day cycle across all 56 days (Day 1/8/15/22/29/36/43/50 = Energize & Circulate, etc.).

### 2.6 New sheet: `Drinks Shots Smoothies`

Three sections:
- **SMOOTHIES (12):** NO Rocket, Testosterone Power, Watermelon Pump, Berry Testosterone Blend, Ginger Warrior, Chocolate Power, Morning Drive, Sleep Optimizer, Citrus Sunrise, Green Machine, Watermelon and Maca, Banana and Spinach Power.
- **SHOTS (8):** NO Rocket, Testosterone Igniter, Anti-Inflammation Blast, Morning Testosterone, Circulation Kick, Energy Surge, The Cleaner, The Warrior.
- **FUNCTIONAL DRINKS (14):** Nitric Oxide Performance Water, Testosterone Support Water, Turmeric Golden Milk, Pomegranate Green Tea, Electrolyte Recovery Drink, Beet and Ginger Recovery Brew, Ashwagandha Tea, Pomegranate Performance Juice, Testosterone Water, Anti-Inflammatory Infusion, Blood Flow Boost, Detox Blend, Berry Antioxidant Infusion, Citrus Zing.

Each row includes a `getperfectstack.com` reference for the full recipe.

---

## Part 3 — Final Sheet List

1. App Bridge (new — front tab)
2. Stack Builder (updated headers)
3. Products DB (7 rows of dose corrections)
4. Factor Reference (unchanged)
5. Baseline Checklist (unchanged)
6. Doctor's Checklist (unchanged)
7. Progress Journal (unchanged)
8. Glossary (unchanged)
9. Weekly Tracker (unchanged)
10. 7-Day Meal Plan (new)
11. 8-Week Framework (new)
12. Drinks Shots Smoothies (new)

---

## Part 4 — Items Not Changed / Structural Limitations

- **Multivitamin per-product dosing (Thorne 6 caps, Micro Ingredients 2 caps, Life Extension 2 tabs):** The `Products DB` schema has a single Rec Dose / Daily Servings per row. Representing three different product dosings within one supplement row would require a schema redesign. The existing `3 / 3` approximation was kept. Recommendation in Part 5.
- **LibreOffice recalc could not run** on this Windows machine (`socket.AF_UNIX` not available in Windows Python). Formulas are preserved as formula strings and will recalculate automatically the next time the file opens in Excel. No formulas were modified.
- **Existing color scheme / layout / borders / fonts** on original sheets (Stack Builder, Products DB, etc.) were preserved. New sheets use a consistent navy `#1F4E78` header with white text and a light-blue `#D9E1F2` sub-header, in Arial, to blend with the existing style.
- **Stack Selection dropdown list** in cell `B8` still uses the old values (`Stack A`, `A + B`, `A + B + C`, ...). The Include? cascade formulas reference these exact strings, so renaming the dropdown values would break `B19:B53` unless all 35 formulas are rewritten. The dropdown values were left alone; only the section headers were renamed to colon format. Recommendation in Part 5.

---

## Part 5 — Recommendations for Future Versions

1. **Redesign Products DB to support per-product dosing** for the Multivitamin row (and any other supplement with product-specific dose differences). Either split into three Multivitamin rows (one per product) or add `Opt1 Dose`, `Opt2 Dose`, `Opt3 Dose` columns and update the Stack Builder `F` column to pick by Option.
2. **Update Stack Selection dropdown values** to match the colon-format names, and rewrite the 35 Include? formulas on the Stack Builder to reference the new strings. Best done in one pass.
3. **Add a Recipes sheet** that lists the full 68 app recipes with their category, primary benefit, and key ingredients — a natural complement to the Drinks Shots Smoothies sheet.
4. **Add a Meal Builder sheet** that lets the user pick Day 1-7 from a dropdown and auto-displays the breakfast/lunch/dinner/smoothie/shot — would mirror the app's Meal Maker experience.
5. **Link Weekly Tracker supplements** to the user's Stack Selection via INDEX/MATCH so the supplement list updates dynamically instead of being a fixed subset.
6. **Add an 8-Week daily log page** that combines the 7-day rotating theme with the 4 weekly phase contexts so a user can print one page per week with every daily sub-theme pre-filled.
7. **Consider consolidating** the `Baseline Checklist` blood work section and `Doctor's Checklist` core hormone panel — currently they overlap.

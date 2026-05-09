# Perfect Stack Spreadsheet v2 - Build Report

**Build Date:** 2026-04-23
**Output:** `/sessions/compassionate-youthful-fermat/mnt/phatw--Perfect Stack/Perfect_Stack_Spreadsheet_v2.xlsx`
**Build Script:** Python / openpyxl 3.1.5 (modular)
**Recalc Status:** SUCCESS (0 errors, 581 formulas evaluated)

---

## 1. Overview

Perfect Stack Spreadsheet v2 merges V1's brand system (gold-on-near-black, severity color coding, branded hero rows) with V9's proven formula engine (INDEX/MATCH into a hidden `Products_DB`, per-row factor-adjusted dosing, and status-aware conditional formatting). It ships with 11 user-visible sheets plus a hidden `Products_DB` backbone.

- **Total sheets:** 12 (11 visible + 1 hidden)
- **Total formulas:** 581
- **Named ranges:** 18
- **Brand:** Perfect Stack (gold `#CA8A04` on near-black `#09090B`)
- **Supplements in database:** 31 across 5 stacks (A-E)
- **Interactions tracked:** 14
- **Cycled supplements:** 6
- **Meal plan days:** 14 (Week 1 + Week 2 preview)
- **Recipes:** 21 meals + 8 smoothies + 5 shots + 6 drinks
- **Equipment items:** 24
- **Grocery items:** 48
- **Glossary terms:** 30
- **Blood work markers:** 21
- **App-bridge comparison rows:** 12

---

## 2. Sheet Inventory

| # | Sheet | Tab Color | Freeze | Purpose |
|---|-------|-----------|--------|---------|
| 1 | Cover + How to Use | `#CA8A04` | - | Branded cover, navigation, 6-step how-to, color legend |
| 2 | My Profile | `#EAB308` | A4 | 12 dropdown inputs + 4 calculated factors + 5 flag messages |
| 3 | Stack Builder | `#18181B` | B7 | 31-supplement engine with 10 formula columns per row |
| 4 | Supplement Safety Check | `#EF4444` | A8 | 14 interactions with severity badges and live applicability |
| 5 | Supplement Cycling | `#3B82F6` | A10 | 6 cycled supplements, automatic ON/OFF phase from StartDate |
| 6 | My Progress | `#22C55E` | A3 | Baseline + 8-week check-ins + 8-week journal |
| 7 | Meal Plan | `#F59E0B` | A7 | 7-day Week 1 plan + 7-day Week 2 Meal Maker preview |
| 8 | Recipe + Drinks Library | `#CA8A04` | A3 | Breakfasts, lunches, dinners, smoothies, shots, drinks |
| 9 | Equipment + Shopping List | `#27272A` | A3 | 24 equipment items + 18-supp shopping list + 48-item grocery |
| 10 | App Bridge | `#09090B` | A6 | 12-row feature comparison (Spreadsheet vs Free/Foundation/Ultimate) |
| 11 | Reference | `#27272A` | A3 | 24-nutrient multi comparison + 30-term glossary + 21 blood markers |
| 12 | Products_DB (hidden) | `#09090B` | - | 31-row x 22-col backbone data |

---

## 3. Named Ranges (18 total)

All workbook-scoped, used by Stack Builder, Safety Check, Cycling, and Profile:

```
AgeGroup             = 'My Profile'!$B$6
PrimaryGoal          = 'My Profile'!$B$7
TrainingStyle        = 'My Profile'!$B$8
HealthStatus         = 'My Profile'!$B$9
MultivitaminSelection= 'My Profile'!$B$12
MedBloodThinners     = 'My Profile'!$B$15
MedBloodPressure     = 'My Profile'!$B$16
MedTRT               = 'My Profile'!$B$17
MedPDE5              = 'My Profile'!$B$18
MedNitrates          = 'My Profile'!$B$19
MedStatins           = 'My Profile'!$B$20
MedDiabetes          = 'My Profile'!$B$21
MedThyroid           = 'My Profile'!$B$22
HormoneFactor        = 'My Profile'!$B$25
NOFactor             = 'My Profile'!$B$26
OverallFactor        = 'My Profile'!$B$27
RecommendedStack     = 'My Profile'!$B$28
StartDate            = 'Supplement Cycling'!$B$5
```

---

## 4. Formula Highlights

### Stack Builder (core engine, ~16 formulas x 31 rows = 496 formulas)

Per-row columns:
- **F (Hormone Adj Dose):** `=IFERROR(ROUND($D7*IFERROR(HormoneFactor*1,1),2),$D7)` - NO supps use `NOFactor`, DHEA has TRT/age gates, Berberine has diabetes gate.
- **G (Multi Adj Dose):** Per-supplement multivitamin offset table (D3, Mg, Zn, B-Complex, Se, Vit C).
- **H (Final Dose):** `=IFERROR(IF(G7="",F7,IF(G7<F7,G7,F7)),$D7)` - takes the more-restrictive of age-adjusted vs multivitamin-adjusted. Stack C nitrate supps prepend a nitrate/PDE5 guard.
- **I (Daily Servings):** `=IFERROR(INDEX(Products_DB!$F:$F,MATCH($B7,Products_DB!$A:$A,0)),1)`
- **M (Monthly Cost):** Option-picker (`L` = Option 1/2/3) drives INDEX column offsets (2/6/10 price, 3/7/11 servings) across the 12-col `K:V` product block, multiplied by Daily Servings x 30 days.
- **N (Amazon Link):** Same INDEX pattern returns the URL and wraps in `HYPERLINK`.
- **O (Status):** `=IF(H7=0,IF(MedNitrates="Yes","Excluded","Not Recommended"),IF(H7<D7*0.95,"Dose Reduced","Active"))`
- **P (Notes):** Per-supplement string concatenation built from medication flags.

Row 38 totals: `=SUMIF(O7:O37,"Active",M7:M37)+SUMIF(O7:O37,"Dose Reduced",M7:M37)`

### My Profile (4 main calculations)

```
HormoneFactor =IFERROR(
  CHOOSE(MATCH(AgeGroup,{"30 to 39","40 to 49","50 to 59","60 and over"},0),1,0.95,0.9,0.8) *
  CHOOSE(MATCH(HealthStatus,{"Excellent","Good","Fair","Poor"},0),1,0.95,0.85,0.75),
  "Set profile")

NOFactor      =IFERROR(
  IF(MedNitrates="Yes",0,
    CHOOSE(MATCH(AgeGroup,{"30 to 39","40 to 49","50 to 59","60 and over"},0),1,1,0.9,0.85) *
    CHOOSE(MATCH(TrainingStyle,{"None","Light (1-2x per week)","Moderate (3-4x per week)","Heavy (5+ per week)"},0),0.7,0.85,1,1.1) *
    IF(MedPDE5="Daily",0.5,1) *
    IF(MedBloodPressure="Yes",0.8,1)),
  "Set profile")
```

### Supplement Safety Check (14 interactions x 2 formulas)

Each row's live applicability:
```
E (Both In Stack?) =IF(AND(
  IFERROR(VLOOKUP("<Supp A>",'Stack Builder'!$B$7:$O$37,14,0),"No")="Active",
  IFERROR(VLOOKUP("<Supp B>",'Stack Builder'!$B$7:$O$37,14,0),"No")="Active"),
  "Yes","No")

F (Status)         =IF(E8="Yes","Caution","Not Applicable")
```

Row 5 summary:
```
="Active Cautions: "&COUNTIF(F8:F21,"Caution")&
 "   |   Active Notes: "&COUNTIF(F8:F21,"Note")&
 "   |   Not Applicable: "&COUNTIF(F8:F21,"Not Applicable")
```

### Supplement Cycling (6 supplements x 3 date formulas)

```
Current Phase    =IF($B$5="","Set start date",
                    IF($B$7<=0,"Not started",
                    IF(MOD($B$7,(C10+D10)*7)<C10*7,"ON","OFF")))

Days Until Change=IF(MOD($B$7,(C10+D10)*7)<C10*7,
                    C10*7-MOD($B$7,(C10+D10)*7),
                    (C10+D10)*7-MOD($B$7,(C10+D10)*7))
```

CF rules color ON=green / OFF=red for the Phase column.

---

## 5. Errors Encountered and Fixes

### Issue: 150 `#VALUE!` errors on first recalc
- **Root cause:** `HormoneFactor` and `NOFactor` return the text `"Set profile"` until My Profile is filled. Multiplying a number by that text in formulas like `=ROUND($D7*HormoneFactor,2)` cascades as `#VALUE!` across F, H, J, M, and O columns (5 errors x 31 rows = 150).
- **Fix:** Wrapped every Stack Builder dose formula in `IFERROR(..., $D<row>)` with an inner `IFERROR(HormoneFactor*1,1)` guard. Multiplying the factor by 1 forces numeric coercion; if the factor is text, inner IFERROR returns 1 (no adjustment); outer IFERROR falls back to the base dose. This keeps the sheet functional and meaningful whether or not the user has completed their profile.
- **After fix:** 0 errors, 581 formulas pass recalc.

No other errors encountered. Safety Check, Cycling, Progress, and Reference formulas all evaluated cleanly on first recalc.

---

## 6. Key Differences from V1 and V9

**Carried over from V1 (brand system):**
- Cover sheet with dark hero, gold title, navigation table, how-to steps, legend
- Severity color system (conflict/caution/note/safe) uniformly applied across Safety Check, Stack Builder CF, Reference overlap table
- Tab colors following the brand palette
- Recipe library with 3 sections (meals / smoothies / shots / drinks)
- Equipment + Shopping List with kitchen/gym split and priority badges
- App Bridge 4-column comparison (Spreadsheet / Free / Foundation / Ultimate)

**Carried over from V9 (formula engine):**
- Hidden `Products_DB` with 22-column layout (Name, Stack, Category, Dose, Unit, Servings, Timing, Supports, TTN, Cautions, then 3x (Name/Price/Servings/URL) option blocks)
- Per-row INDEX/MATCH into `Products_DB` for Daily Servings, Best Timing, Monthly Cost, Amazon Link
- Product Selection dropdown (Option 1/2/3) drives cost and link via dynamic column offset
- Monthly cost formula: `(Price/Servings) * DailyServings * 30`
- Status-aware conditional formatting coloring entire rows (red for Not Recommended, amber for Dose Reduced, gray for Excluded)
- VLOOKUP bridges from Safety Check and Equipment+Shopping List back into Stack Builder

**New in V2:**
- `IFERROR` guardrails on every dose formula - sheet works meaningfully before profile is completed
- Named ranges expanded to 18 (from 14 in V9)
- Medication strip in Row 5 of Stack Builder surfaces all active med flags in a single concatenated red banner
- Days 8-14 Meal Maker preview inside the Meal Plan sheet (was app-only in V1)
- 21-marker Blood Work Reference section inside Reference (was app-only in V1/V9)
- Phase-aware Supplement Cycling CF (ON=green, OFF=red) driven by `MOD((days),(on+off)*7)` math

---

## 7. Recommendations for V3

1. **Two-way data validation for Product Selection:** currently the Option 1/2/3 dropdown doesn't show the actual product name on hover. V3 could swap to named product strings and use `XLOOKUP` to resolve price/servings/URL, which is more readable.
2. **Auto-filtering "Not in stack" supplements:** V3 could use dynamic arrays (`FILTER` in modern Excel) to show only supplements where the user's recommended stack includes the letter, instead of always showing 31 rows.
3. **Progress charts:** Add a hidden `Progress_Charts` sheet with sparkline formulas linked to My Progress Section 2 for quick visual trendline without opening the app.
4. **Cost-tier toggle:** Add a single dropdown in My Profile ("Budget / Standard / Premium") that auto-selects Option 3 / Option 2 / Option 1 across the entire Stack Builder via a driver formula, so users don't have to click 31 dropdowns.
5. **Conditional product recommendations:** For supplements where multiple options map to different efficacy tiers (Ashwagandha KSM-66 vs generic), add a recommendation column that surfaces the most clinically validated option.
6. **Cycling sync groups:** Tongkat Ali + Fadogia + Horny Goat Weed are all B-stack cycled supplements that should cycle together. V3 could add a "Cycle Group" column so users see one unified schedule.
7. **Blood work log integration:** Add a hidden column on the Blood Work Reference table where the user enters their most recent value, with status (optimal / normal / out-of-range) calculated vs the optimal band.
8. **Print areas per sheet:** Currently only Stack Builder has a print area. V3 should set print areas on all sheets for clean PDF export.
9. **Data bars on Weekly Score:** My Progress Section 2 could benefit from inline data bars via CF rule, showing the climb from baseline visually.
10. **Mobile viewport:** The spreadsheet is desktop-oriented. A V3 mobile-friendly layout (narrower columns, stacked sections) could be shipped as a companion file for iPad users.

---

## 8. Technical Notes

- **Python / openpyxl 3.1.5** used for all generation. Modular build: 8 partition files totaling ~2100 LOC, merged via `build_master.py`.
- **No em-dashes anywhere** - all punctuation uses hyphens or commas per Perfect Stack style guide.
- **All Amazon URLs** use `tag=perfectstack-20` affiliate.
- **Recalc performed via LibreOffice headless** using the project's bundled `recalc.py`, which runs `ThisComponent.calculateAll()` and saves the cached values back into the xlsx.
- **Sheet ordering** enforced by reassigning `wb._sheets` to the desired list at the end of the build.
- **Products_DB** is hidden via `ws.sheet_state = "hidden"` so users never see the backbone data.

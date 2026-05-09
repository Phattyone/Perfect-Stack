# Perfect Stack Spreadsheet Comparison Report
*Generated: April 2026*
*Files compared: Perfect_Stack_Spreadsheet_v1.xlsx vs Perfect_Stack_Interactive_Spreadsheet_v9(phatty).xlsx*

---

## PART 1 - INVENTORY: V1 (Perfect_Stack_Spreadsheet_v1.xlsx)

V1 contains 19 sheets and 19 workbook-level named ranges (AgeGroup, PrimaryGoal, RecommendedStack, etc.). The brand palette (#09090B, #18181B, #F4F4F5, #FFFFFF, plus status bands #FEF2F2, #FFFBEB, #EFF6FF, #F0FDF4) is used consistently across every sheet.

### Sheet: Cover
- **Purpose:** Navigation hub with jump-links to every tab.
- **Size:** 31 rows x 14 cols, 64 non-empty cells.
- **Key features:** 19 internal hyperlinks, one per sheet.
- **Formula count:** 0. **Dropdowns:** 0.
- **Quality rating:** Excellent.
- **Reason:** Clean dark header, legible navigation table, fully on-brand colors.

### Sheet: How to Use
- **Purpose:** 3-step setup and the color legend explaining every status color.
- **Size:** 23 rows x 4 cols, 45 non-empty cells.
- **Key features:** Uses all six brand status colors as live swatches.
- **Formula count:** 0. **Dropdowns:** 0.
- **Quality rating:** Excellent.
- **Reason:** Best in-file onboarding across either workbook.

### Sheet: My Profile
- **Purpose:** Single source of truth for every other sheet's formulas.
- **Size:** 37 rows x 3 cols, 77 non-empty cells, 10 formulas, 13 dropdowns.
- **Key features:** 13 data validations feeding 19 named ranges that cascade through the workbook.
- **Quality rating:** Excellent.
- **Reason:** This is the architectural spine of V1 and it works. V9 has no equivalent dedicated profile tab.

### Sheet: Stack Builder
- **Size:** 46 rows x 16 cols, 536 cells, 161 formulas, 31 hyperlinks.
- **Key features:** Pulls directly from named ranges. Per-supplement row with base dose, unit, cost, and Amazon link.
- **Quality rating:** Good.
- **Reason:** Solid logic, but less sophisticated than V9's Option 1/2/3 product picker and INDEX/MATCH pulls.

### Sheet: Supplement Safety Check
- **Size:** 21 rows x 7 cols, 114 cells, 31 formulas.
- **Key features:** Live COUNTIFS for active cautions and notes. Each row fires only when both flagged supplements are present in the user's stack.
- **Quality rating:** Excellent.
- **Reason:** Uniquely valuable. No equivalent tab in V9 (V9 buries safety text inside Stack Builder rows).

### Sheet: Supplement Cycling
- **Size:** 15 rows x 9 cols, 72 cells, 20 formulas, 2 conditional formatting rules.
- **Key features:** TODAY() driven phase tracker for Ashwagandha, Tongkat Ali, Fadogia, DHEA, Berberine, Horny Goat Weed.
- **Quality rating:** Excellent.
- **Reason:** Rare feature that most stack spreadsheets skip. Drives the 8-Week Framework calendar.

### Sheet: Multivitamins Reference
- **Size:** 62 rows x 7 cols, 264 cells, 3 Amazon links.
- **Key features:** Side-by-side nutrient comparison for Thorne, Micro Ingredients, and Life Extension.
- **Quality rating:** Good.
- **Reason:** Complete but long; could collapse to a compare grid in a consolidated build.

### Sheet: 7-Day Meal Plan
- **Size:** 18 rows x 9 cols, 85 cells.
- **Key features:** Day, theme, breakfast, lunch, dinner, smoothie, and meal prep tips.
- **Quality rating:** Good.
- **Reason:** Richer than V9's version (85 vs 50 cells) and includes the meal prep tips section V9 dropped.

### Sheet: 8-Week Framework
- **Size:** 70 rows x 6 cols, 321 cells, 56 formulas.
- **Key features:** Phase summary plus full 56-day log whose dates auto-compute from Supplement Cycling start date.
- **Quality rating:** Excellent.
- **Reason:** This is the workhorse calendar. V9's framework sheet is a 19-row summary only.

### Sheet: Recipe Library
- **Size:** 28 rows x 6 cols, 125 cells.
- **Purpose:** Breakfast/lunch/dinner recipes cross-referenced to the guide with phase tags.
- **Quality rating:** Good.
- **Reason:** Useful static reference, but recipes are name + benefit notes, no quantities.

### Sheet: Drinks Shots Smoothies
- **Size:** 45 rows x 6 cols, 227 cells.
- **Purpose:** Full beverage library with theme, ingredients, benefits, timing.
- **Quality rating:** Excellent.
- **Reason:** Almost 2x the content of V9 (227 vs 116 cells) and includes actual ingredient lists rather than name-only rows.

### Sheet: Equipment List
- **Size:** 47 rows x 6 cols, 190 cells, 24 hyperlinks.
- **Purpose:** Essential/Recommended/Optional kitchen and home-gym gear.
- **Quality rating:** Excellent.
- **Reason:** No equivalent in V9. Amazon links make it immediately actionable.

### Sheet: Shopping List
- **Size:** 66 rows x 6 cols, 149 cells, 19 hyperlinks.
- **Purpose:** Month-1 supplement shopping plus week-1 grocery list.
- **Quality rating:** Good.
- **Reason:** Static; could be made formula-driven against Stack Builder's Include column.

### Sheet: App Bridge
- **Size:** 19 rows x 5 cols, 65 cells.
- **Purpose:** Spreadsheet vs Free vs Foundation vs Ultimate plan comparison.
- **Quality rating:** Excellent.
- **Reason:** Better pricing tier breakdown than V9's 2-column App Bridge.

### Sheet: Blood Work Reference
- **Size:** 50 rows x 7 cols, 226 cells.
- **Purpose:** Biomarker table with Normal vs OPTIMAL ranges and "why it matters" notes.
- **Quality rating:** Excellent.
- **Reason:** More reader-friendly than V9's Doctor's Checklist (reference first, action second).

### Sheet: Progress Journal
- **Size:** 94 rows x 8 cols, 170 cells, 24 formulas.
- **Purpose:** 8-week logbook with change-vs-baseline formulas.
- **Quality rating:** Good.
- **Reason:** Shorter than V9's 227-row journal but formula-driven.

### Sheet: Glossary
- **Size:** 45 rows x 2 cols, 86 cells.
- **Quality rating:** Fair.
- **Reason:** Functional but thinner than V9's 58-row version with category headers.

### Sheet: Weekly Tracker
- **Size:** 17 rows x 9 cols, 35 cells, 10 formulas.
- **Purpose:** Mon-Sun daily metric grid with AVERAGE/COUNTIF rollups.
- **Quality rating:** Good.
- **Reason:** Tight and useful, but V9's 37-row Weekly Tracker is far richer.

### Sheet: Baseline Checklist
- **Size:** 39 rows x 4 cols, 73 cells.
- **Purpose:** Pre-start measurements and subjective baseline ratings.
- **Quality rating:** Fair.
- **Reason:** Valid but V9's version has Baseline/Wk4/Wk8 columns built in.

---

## PART 1B - INVENTORY: V9 (Perfect_Stack_Interactive_Spreadsheet_v9)

V9 contains 12 sheets and zero workbook-level named ranges. Color palette is off-brand: the signature gold is #C9952C (close but not the brand #CA8A04 / #EAB308), black is #0D0D0D (not #09090B), and cream #F9F3E8 replaces the brand's #F4F4F5. Two sheets still use Excel defaults #1F4E78 and #D9E1F2.

### Sheet: App Bridge
- **Size:** 20 rows x 3 cols, 40 cells, 2 hyperlinks.
- **Quality rating:** Fair.
- **Reason:** Uses Excel default blues (#1F4E78, #D9E1F2), not brand colors. Less detailed than V1's tiered version.

### Sheet: Stack Builder
- **Size:** 82 rows x 14 cols, 544 cells, 345 formulas, 10 dropdowns, 6 conditional formatting rules.
- **Key features:** Profile + goal + medication flags at top, factor math exposed, Option 1/2/3 product picker with INDEX/MATCH pulls against Products DB, dynamic dose reductions for TRT and diabetes meds, nitrate-medication kill-switch for NO supplements, built-in interaction alert legend.
- **Quality rating:** Excellent.
- **Reason:** Formula count is more than 2x V1's Stack Builder. The Products DB lookup pattern is the single best engineering idea in either file.

### Sheet: Products DB
- **Size:** 32 rows x 22 cols, 704 cells.
- **Purpose:** Normalized supplement master table (Stack, Category, Dose, Unit, Daily Servings, Best Timing, Mechanism, Cautions, Option 1/2/3 names and prices).
- **Quality rating:** Excellent.
- **Reason:** Proper database pattern. V1 has no equivalent and scatters this data inline.

### Sheet: Factor Reference
- **Size:** 39 rows x 4 cols, 85 cells.
- **Purpose:** Explains the hormone, NO, and stress/sleep multipliers by age, training, and goal.
- **Quality rating:** Good.
- **Reason:** Shows the math the user cannot see inside formulas.

### Sheet: Baseline Checklist
- **Size:** 49 rows x 7 cols, 97 cells.
- **Quality rating:** Good.
- **Reason:** Has Baseline/Wk4/Wk8 columns and self-rated markers. Better structure than V1's version.

### Sheet: Doctor's Checklist
- **Size:** 60 rows x 7 cols, 192 cells.
- **Purpose:** Printable lab-request checklist with checkboxes, why it matters, optimal ranges, frequency.
- **Quality rating:** Excellent.
- **Reason:** Action-oriented in a way V1's Blood Work Reference is not.

### Sheet: Progress Journal
- **Size:** 227 rows x 13 cols, 385 cells.
- **Quality rating:** Good.
- **Reason:** Far longer than V1's (227 vs 94 rows) with per-week spread, but zero formulas so nothing auto-calculates.

### Sheet: Glossary
- **Size:** 58 rows x 3 cols, 102 cells.
- **Quality rating:** Good.
- **Reason:** Category-grouped (Hormones, Vascular, Supplements). Beats V1's flat list.

### Sheet: Weekly Tracker
- **Size:** 37 rows x 11 cols, 160 cells, 9 formulas.
- **Quality rating:** Good.
- **Reason:** Includes a full supplement checklist section with daily tick boxes. V1's version is more rollup-focused.

### Sheet: 7-Day Meal Plan
- **Size:** 11 rows x 6 cols, 50 cells.
- **Quality rating:** Fair.
- **Reason:** Missing V1's meal prep tips. Only the default Excel blue (#1F4E78) for headers.

### Sheet: 8-Week Framework
- **Size:** 19 rows x 4 cols, 39 cells.
- **Quality rating:** Poor.
- **Reason:** Summary only. No 56-day calendar, no date formulas, no phase-by-phase nutrient or training column. This is the single biggest regression from V1.

### Sheet: Drinks Shots Smoothies
- **Size:** 45 rows x 3 cols, 116 cells.
- **Quality rating:** Fair.
- **Reason:** Name-only list that links back to getperfectstack.com. Lost the ingredients, benefits, and timing that V1 carries.

---

## PART 2 - COMPARATIVE ANALYSIS

### Sheets present in BOTH files

#### Stack Builder
| Dimension | V1 | V9 | Winner |
|---|---|---|---|
| Data completeness | 536 cells, 161 formulas | 544 cells, 345 formulas | V9 |
| Formula logic | Pulls from 19 named ranges on My Profile | INDEX/MATCH against Products DB, factor math exposed, medication-aware dose reductions | V9 |
| Color consistency | On-brand #09090B, #CA8A04, status bands | Off-brand #C9952C, #0D0D0D, plus stray pastels | V1 |
| Usability | One profile sheet, clean table, Amazon links per row | Profile + meds on same sheet, Option 1/2/3 picker, 6 conditional formats | V9 |
| **Recommended action** | **Merge both: V9 engine, V1 paint and hyperlinks** | | |

#### 7-Day Meal Plan
| Dimension | V1 | V9 | Winner |
|---|---|---|---|
| Content | 85 cells, meal prep tips, brand colors | 50 cells, names only, default blue header | V1 |
| **Recommended action** | **Keep V1 verbatim** | | |

#### 8-Week Framework
| Dimension | V1 | V9 | Winner |
|---|---|---|---|
| Content | 70 rows, 56-day log with live dates | 19 rows, summary only | V1 |
| Formula logic | 56 formulas driving calendar dates | 0 formulas | V1 |
| **Recommended action** | **Keep V1; fold V9's daily sub-theme table into it** | | |

#### App Bridge
| Dimension | V1 | V9 | Winner |
|---|---|---|---|
| Tier granularity | Free / Foundation / Ultimate split | Single spreadsheet vs app column | V1 |
| Color | Brand palette | Default Excel blue | V1 |
| **Recommended action** | **Keep V1** | | |

#### Drinks Shots Smoothies
| Dimension | V1 | V9 | Winner |
|---|---|---|---|
| Content depth | 227 cells with ingredients, benefits, timing | 116 cells, name only | V1 |
| **Recommended action** | **Keep V1** | | |

#### Progress Journal, Weekly Tracker, Glossary, Baseline Checklist
- Glossary: V9 wins on category grouping.
- Baseline Checklist: V9 wins on Baseline/Wk4/Wk8 columns.
- Weekly Tracker: Tie. V1 has rollups, V9 has the supplement checklist grid.
- Progress Journal: V9 has more rows but no formulas. V1 has formulas but fewer weeks. Merge.

### Sheets only in V1 (keep or merge)
- **Cover** — keep. Essential navigation.
- **How to Use** — keep. Onboarding legend.
- **My Profile** — keep. Architectural spine and the only place the 19 named ranges live.
- **Supplement Safety Check** — keep. Formula-driven interaction table.
- **Supplement Cycling** — keep. TODAY()-driven phase tracker.
- **Multivitamins Reference** — merge into Stack Builder or keep as compact comparison.
- **Recipe Library** — merge into a single Recipes + Drinks library.
- **Equipment List** — keep (or merge with Shopping List).
- **Shopping List** — merge with Equipment List.
- **Blood Work Reference** — merge with V9's Doctor's Checklist.

### Sheets only in V9 (keep, merge, eliminate)
- **Products DB** — keep. This is V9's crown jewel.
- **Factor Reference** — keep as a collapsed help section at bottom of Stack Builder.
- **Doctor's Checklist** — merge with V1's Blood Work Reference.

---

## PART 3 - RECOMMENDED FINAL SHEET STRUCTURE (max 10 sheets)

| Priority | Sheet Name | Source | What to keep | What to eliminate |
|---|---|---|---|---|
| Must Have | 1. Cover + How to Use | Merged V1+V9 | V1 navigation + V1 color legend + V9 app bridge summary | Nothing critical |
| Must Have | 2. My Profile | V1 | All 13 dropdowns, 19 named ranges | Multivitamin selector (move into Stack Builder) |
| Must Have | 3. Stack Builder | Merged | V9 formula engine + Products DB lookups + factor math; V1 brand palette + Amazon hyperlinks per row | V9 off-brand pastels, V9 duplicated interaction text rows |
| Must Have | 4. Safety + Cycling | Merged V1 | V1 Safety Check COUNTIFS table + V1 Supplement Cycling phase tracker | Redundant cycling text |
| Must Have | 5. Products DB | V9 | Full 32-row normalized supplement table | Nothing |
| Must Have | 6. 7-Day Meal Plan + 8-Week Framework | Merged V1 | V1 meal table + V1 56-day calendar + V9 daily sub-themes | V9's 19-row summary |
| Nice to Have | 7. Recipe + Drinks Library | Merged V1 | All 28 recipe rows + all 45 drink rows with ingredients | V9's link-only beverage list |
| Nice to Have | 8. Equipment + Shopping | Merged V1 | Both V1 lists with Amazon links | Duplicated categories |
| Nice to Have | 9. Progress + Tracker + Baseline | Merged V1+V9 | V9 Baseline/Wk4/Wk8 structure + V1 formula rollups + V9 supplement checklist grid | Duplicate weekly rating grids |
| Optional | 10. Labs + Glossary + App Bridge | Merged | V1 Blood Work Reference + V9 Doctor's Checklist + V9 category glossary + V1 tiered App Bridge | V9 flat glossary, V1 plain biomarker notes |

---

## PART 4 - SPECIFIC RECOMMENDATIONS

### 1. Which sheets should be combined to reduce tab count?
Cover and How to Use collapse into one. Supplement Safety Check and Supplement Cycling combine into a single Safety sheet with a phase tracker on top and the interaction table below. Recipe Library and Drinks Shots Smoothies merge into one Food Library. Equipment List and Shopping List merge into one Shopping sheet with two sections. Blood Work Reference, Doctor's Checklist, Glossary, and App Bridge merge into one Reference tab. That drops 19 tabs to 10 without losing any data.

### 2. Which sheets add the least value and should be eliminated entirely?
V9's 8-Week Framework (19 rows of summary already inside V1's richer version) and V9's Drinks Shots Smoothies (just a name-and-URL list). Also the Multivitamins Reference in V1 is an entire 62-row sheet that could be a 12-row block at the bottom of Stack Builder.

### 3. Most important sheets for offline guide users?
My Profile, Stack Builder, Products DB, Safety + Cycling, 7-Day Meal Plan + 8-Week Framework, and Progress + Tracker + Baseline. Those six cover "who am I, what do I take, is it safe, what do I eat, and am I improving."

### 4. Where does V9 do something better than V1?
The Products DB as a normalized lookup table is the right architectural pattern and V1 does not have one. V9's Stack Builder has 345 formulas versus V1's 161 and handles medication-aware dose reductions (TRT = 0.75x LH herbs, nitrates = 0 for NO stack, diabetes meds = 0 for berberine, alpha-blockers = halve L-Citrulline). V9's Doctor's Checklist is printable and action-oriented. V9's Glossary is category-grouped. V9's Baseline Checklist has Baseline/Wk4/Wk8 built in. V9's Weekly Tracker has a supplement checklist grid V1 is missing.

### 5. Where does V1 do something better than V9?
V1's on-brand colors are consistent across all 19 sheets, while V9 uses off-brand gold #C9952C and leaves two sheets on Excel defaults. V1 has a dedicated Supplement Safety Check with live COUNTIFS, a live Supplement Cycling phase tracker, a full 56-day 8-Week Framework log with date formulas, a richer 7-Day Meal Plan with prep tips, a richer Drinks library with ingredients, an Equipment List with 24 Amazon links, a Shopping List with 19 Amazon links, and 31 hyperlinks directly in Stack Builder. V1 also has 19 named ranges versus V9's zero, which is what makes cross-sheet formulas readable.

### 6. What is missing from both that would add genuine value?
A dynamic shopping list that auto-populates only the supplements where Include = Yes. A training log sheet (both guides talk about resistance training but neither workbook tracks sets and reps). A PDE5 inhibitor dose-and-timing planner since the guide has a full chapter on it. An actual sleep tracker since sleep is called "the most underrated performance drug" in Chapter 24. A quick-glance dashboard sheet that pulls the top-10 numbers (current phase, current day, this week's supplement adherence, last labs, weekly subjective score).

### 7. Is a static Meal Maker (7-14 additional pre-planned meals) feasible?
Yes and it is easy. The guide already contains 28 recipes in V1's Recipe Library plus 45 drinks. Build a Meal Library tab with a hidden index column, add a new Meal Maker tab with 14 slots, and use INDEX/MATCH plus a theme dropdown per slot to pull breakfast, lunch, dinner, and smoothie. Swap the seed value (or a "variation" dropdown) to reshuffle. This reuses the same INDEX/MATCH pattern V9 already uses for its Products DB, so there is no new technique to learn. Keep it static (no randomization) so the file stays deterministic across Excel, Numbers, and Google Sheets.

---

## PART 5 - COLOR AND BRAND CONSISTENCY AUDIT

### V1 Color Audit
| Sheet | On-Brand? | Colors Used | Notes |
|---|---|---|---|
| Cover | Yes | #09090B, #18181B, #F4F4F5, #FFFFFF | Perfect |
| How to Use | Yes | #09090B, #18181B, #EFF6FF, #FFFBEB, #F0FDF4, #FEF2F2, #FEFCE8 | All six status bands |
| My Profile | Yes | #09090B, #18181B, #FFFBEB, #F4F4F5, #FEFCE8 | Input yellow applied correctly |
| Stack Builder | Yes | #09090B, #18181B, #FFFFFF, #F4F4F5, #FFFBEB, #FEF2F2, #F0FDF4 | Safety-color overlay on rows |
| Supplement Safety Check | Yes | #09090B, #18181B, #EFF6FF, #FFFBEB, #F4F4F5 | On-brand |
| Supplement Cycling | Yes | #09090B, #EFF6FF, #FFFBEB, #F4F4F5 | Clean |
| Multivitamins Reference | Partial | Includes #FEF9C3 and #F3F4F6 (Tailwind yellow-100, gray-100) | Close but not exact brand set |
| 7-Day Meal Plan | Partial | Adds #FCE7F3, #DCFCE7, #E0E7FF, #FEF3C7 | Day-theme color chips stray from palette |
| 8-Week Framework | Yes | Brand palette | Clean |
| Recipe Library | Yes | Core palette only | Clean |
| Drinks Shots Smoothies | Yes | Core palette only | Clean |
| Equipment List | Yes | Brand palette | Clean |
| Shopping List | Yes | Brand palette | Clean |
| App Bridge | Yes | #09090B, #FFFFFF, #FEF9C3, #FEFCE8 | Gold accent correct |
| Blood Work Reference | Partial | Adds #FEF9C3, #DBEAFE, #F3F4F6 | Category chips off-brand |
| Progress Journal | Yes | Brand palette | Clean |
| Glossary | Yes | Core palette | Clean |
| Weekly Tracker | Yes | Core palette | Clean |
| Baseline Checklist | Yes | Core palette | Clean |

### V9 Color Audit
| Sheet | On-Brand? | Colors Used | Notes |
|---|---|---|---|
| App Bridge | No | #1F4E78, #D9E1F2 | Excel default theme blues |
| Stack Builder | No | #C9952C, #0D0D0D, #F9F3E8, #FFE8D0, #FBF7EE, #F5EEF7, #D4EDDA, #D0E8FF plus more | Off-brand gold, off-brand black, pastels unrelated to brand |
| Products DB | No | #000000, #FBF7EE, #F5EEF7, #EEF4FB, #EEF7EE, #FFF4EE | Category-stripe pastels, not brand status colors |
| Factor Reference | No | #FFFFFF, #FBF7EE | Cream, not brand gray |
| Baseline Checklist | No | #C9952C, #0D0D0D, #F9F3E8 | Off-brand gold |
| Doctor's Checklist | No | #C9952C, #C4A882, #0D0D0D, #F9F3E8 | Off-brand gold and tan |
| Progress Journal | No | #C9952C, #C4A882, #0D0D0D, #F9F3E8 | Same off-brand set |
| Glossary | No | #C9952C, #0D0D0D, #F9F3E8 | Off-brand gold |
| Weekly Tracker | No | #C9952C, #FFF3CD, #E8F5E9, #0D0D0D, #F9F3E8 | Introduces additional pastels |
| 7-Day Meal Plan | No | #1F4E78 | Excel default blue only |
| 8-Week Framework | No | #1F4E78, #D9E1F2 | Excel default theme |
| Drinks Shots Smoothies | No | #1F4E78, #D9E1F2 | Excel default theme |

### Summary
Overall on-brand score: V1 = 16 Yes / 3 Partial / 0 No out of 19 sheets. V9 = 0 Yes / 0 Partial / 12 No out of 12 sheets. V1 is effectively 100% on-brand, V9 is effectively 0%. Any merge must inherit V1's color system, not V9's.

---

## PART 6 - EXECUTIVE SUMMARY

1. **Recommended sheet count:** 10 sheets total, down from 19 in V1 and 12 in V9.
2. **Recommended tab order:** Cover+How, My Profile, Stack Builder, Products DB, Safety+Cycling, Meal Plan+8-Week Framework, Recipe+Drinks Library, Equipment+Shopping, Progress+Tracker+Baseline, Labs+Glossary+App Bridge.
3. **Most important single improvement:** Port V9's Products DB and INDEX/MATCH Stack Builder engine into V1, because it unlocks medication-aware dosing that V1 simply does not do.
4. **Build strategy:** Build on V1. Keep V1's color system, named ranges, and sheet inventory as the base. Port V9's Products DB, V9's Stack Builder formulas, V9's Doctor's Checklist, V9's category Glossary, and V9's Baseline Wk4/Wk8 structure into that base.
5. **Biggest V1 weakness to fix:** Stack Builder does not dynamically reduce or zero out doses for TRT, nitrate meds, diabetes meds, or alpha blockers. V9 does this in one IF per row.
6. **Biggest V9 weakness to fix:** Complete absence of brand colors and zero named ranges. Every formula references hard-coded cells which is hostile to future edits.
7. **Sheets to eliminate outright:** V9's 8-Week Framework (regression vs V1), V9's Drinks Shots Smoothies (regression vs V1), and V1's standalone Multivitamins Reference (collapse into Stack Builder bottom section).
8. **Missing feature worth building:** A Meal Maker tab with 14 INDEX/MATCH slots, reusing V9's lookup pattern against an expanded Recipe Library.
9. **Safety-critical retention:** V1's Supplement Safety Check sheet must be preserved. It is the only place in either file where interaction logic is surfaced as a COUNTIFS-driven summary the user can read at a glance.
10. **Final call:** One merged V10 workbook at 10 tabs, V1 paint over V9 engine, Products DB added, Meal Maker added, is the highest-leverage next step.

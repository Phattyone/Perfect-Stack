# Perfect Stack Spreadsheet v5 - Analysis Report
*Generated: April 2026*
*File analyzed: Perfect_Stack_Spreadsheet_v5.xlsx*

Workbook sheets: `Cover + How to Use, My Profile, Stack Builder, Supplement Safety Check, Supplement Cycling, My Progress, Meal Plan, Recipe + Drinks Library, Equipment + Shopping List, App Bridge, Reference, Products_DB`

Named ranges referenced by formulas: `AgeGroup, HealthStatus, HormoneFactor, MedAlphaBlockers, MedBloodPressure, MedBloodThinners, MedDiabetes, MedNitrates, MedPDE5, MedStatins, MedThyroid, MedTRT, MultivitaminSelection, NOFactor, OverallFactor, PrimaryGoal, RecommendedStack, StartDate, StressSleepFactor, TrainingStyle`.

---

## ANALYSIS 1 - Stack Builder Conditional Formatting Audit

### 1.1 Current Conditional Formatting Rules

The Stack Builder sheet has **one CF rule group** (range `A7:R37`) containing five expression rules:

| # | Priority | Formula | Background | Font color |
|---|----------|---------|------------|------------|
| 1 | 2 | `$B7="Not Recommended"` | `#FEF2F2` (red-50) | `#EF4444` (red-500) |
| 2 | 3 | `$B7="Excluded"` | `#F4F4F5` (zinc-100) | `#A1A1AA` (zinc-400) |
| 3 | 4 | `$E7="Not Recommended"` | `#FEF2F2` (red-50) | `#EF4444` (red-500) |
| 4 | 5 | `$E7="Excluded"` | `#F4F4F5` (zinc-100) | `#A1A1AA` (zinc-400) |
| 5 | 6 | `$E7="Dose Reduced"` | `#FFFBEB` (amber-50) | (font color not set in dxf) |

### 1.2 Inconsistencies Found

1. **Wrong column reference (rules 1 and 2).** Rules 1 and 2 fire on `$B7`, but column `B` in row 7+ is `Category` (literal values: `Foundation`, `Testosterone`, `Nitric Oxide`, `Libido`, `Longevity`). Column `B` will never equal `"Not Recommended"` or `"Excluded"`, so rules 1 and 2 are dead code. The intended status column is `E`. Rules 3 and 4 already cover that correctly, making rules 1 and 2 fully redundant.
2. **No CF rule for `Active`.** There is no rule for the normal/active state. Today the "Active" appearance is just the default cell formatting. That is acceptable but means the legend swatch at `A3` ("Active") is purely cosmetic and not driven from the same source of truth as the rule set.
3. **Missing strikethrough on `Excluded` / `Not Recommended`.** Neither the `Excluded` nor `Not Recommended` rule applies a strikethrough font, even though those rows represent supplements the user should not be taking. Visually they only look "muted." For a safety-critical sheet, struck-through text is much clearer.
4. **`Dose Reduced` rule has no font color.** Only the amber background is set; the font color falls back to the default `#18181B`. That technically works but is inconsistent with the red and gray rules which set both fill and font.
5. **`Note/Info` (legend cell I3) has no matching CF rule.** The legend includes `Note/Info` as a status color, but no CF rule produces that look anywhere on rows 7-37. Either the legend entry is aspirational or column `O` ("Notes and Alerts") was supposed to drive a rule that was never written.
6. **The legend background colors do not match the CF rules.** The legend swatches in row 3 use a single fill of `#FEF9C3` (yellow-100, in `D3`) and `#FFFBEB` (amber-50, in `F3/H3/J3`); none of them visually match the actual `#FEF2F2` red background or the `#F4F4F5` muted gray background that the CF rules paint. Users see one palette in the legend and a different palette in the data.
7. **Static yellow on column D (`Product Selection`).** Every cell in `D7:D37` has a hard-coded `#FEF9C3` fill regardless of the `Status` value. That makes an Excluded or Not Recommended supplement still look "important / highlighted" even after the row turns red or gray. The product cell should follow the row state.
8. **Static amber on columns F, H, J (`Base Dose`, `Age/Health Adj Dose`, `Final Dose`).** Same issue: hard-coded `#FFFBEB` background and `#CA8A04` font on every row. Even when `E7="Excluded"` (zero dose), the dose columns still display in "active amber." The CF should override these dose columns too — or the static amber should be removed and recreated as a CF rule limited to `E="Active"` rows.
9. **Static blue font on column R (`Amazon Link`).** Font color `#1D4ED8` is set per-cell, not via CF. When `Excluded`/`Not Recommended` overrides only the background, the link still reads as bright blue, undermining the visual mute. The CF rule for Excluded/Not Recommended should also override the link color (or strike through it).
10. **Striped row formatting is hard-coded, not generated.** Alternating rows 7/9/11... are `#FFFFFF` and 8/10/12... are `#F4F4F5`. The Excluded CF rule's gray fill (`#F4F4F5`) is identical to the even-row stripe color, so an Excluded supplement on an even row is visually indistinguishable from a normal even row. Either the stripe color or the Excluded fill needs to change.
11. **CF range stops at column R but the dimensions go to column S.** `ws.max_column = 19` (column S), but the rule range is `A7:R37`. If anything ever populates column S on a Status-flagged row, it won't be styled. Minor, but worth tightening up.
12. **No rule for `Dose Reduced` font color.** Per inconsistency 4, the amber fill is paired with default near-black text, which has lower contrast than the bright `#CA8A04` already in use elsewhere on the sheet.

### 1.3 Required Rules for v6

Recommended rule set to apply to range `A7:S37` (priority shown ascending = first wins):

| Priority | Trigger | Background | Font color | Other |
|----------|---------|------------|------------|-------|
| 1 | `$E7="Excluded"` | `#F1F5F9` (slate-100) | `#94A3B8` (slate-400) | Strikethrough on |
| 2 | `$E7="Not Recommended"` | `#FEF2F2` (red-50) | `#B91C1C` (red-700) | Strikethrough on |
| 3 | `$E7="Dose Reduced"` | `#FFFBEB` (amber-50) | `#B45309` (amber-700) | Bold off |
| 4 | `$E7="Active"` | `#FFFFFF` | `#18181B` (zinc-900) | (overrides static amber on F/H/J) |
| 5 | `MOD(ROW(),2)=0` | `#FAFAFA` (zinc-50) | inherit | (zebra striping moved into CF so it can be suppressed by higher-priority rules) |

Notes:
- Drop the two `$B7=` rules entirely — column B is Category, not Status.
- Pick a stripe color (`#FAFAFA`) that is visibly distinct from the Excluded color (`#F1F5F9`).
- Remove the per-cell static `#FFFBEB` fill on F/H/J and the per-cell static `#FEF9C3` fill on D so that the Status-driven rules can win cleanly. If you want to keep dose columns visually distinct from the rest, do it inside the `Active` rule (priority 4) by using a slight background shift like `#FFFBEB` only on `F`, `H`, `J` via a separate rule keyed on `AND($E7="Active",COLUMN()=6/8/10)` or equivalent per-column rules.
- Add a rule that retints the column R link to `#94A3B8` and strikethrough when `$E7="Excluded"` or `$E7="Not Recommended"`.

---

## ANALYSIS 2 - Supplement Safety Check Formula Audit

### 2.1 Column Structure

The Safety Check sheet (`max_row = 21`, `max_column = 11`) uses these columns starting at row 7:

| Col | Header | Purpose |
|-----|--------|---------|
| A | `Pair` | Human-readable pair label, e.g. `Zinc Picolinate or Glycinate + Selenium Selenomethionine` |
| B | `Severity` | Static label `Caution` or `Note` (no `Conflict` rows present) |
| C | `Title` | Short title used by the UI/badge text |
| D | `Description` | Long-form explanation |
| E | `Both In Stack?` | Formula: `Yes` if both supplements are `Active` or `Dose Reduced` in the Stack Builder, else `No` |
| F | `Status` | Formula: maps Yes/No -> `Caution`/`Note`/`Not Applicable` |
| G-K | empty | Columns G-K only carry the navigation hyperlink strip in row 2 |

### 2.2 Exact Formulas (3+ examples each)

**Active Flag formulas (Stack Builder column E `Status` formula, copied across rows):**

```
Row 7  E:  =IF(J7=0,IF(MedNitrates="Yes","Excluded","Not Recommended"),IF(J7<F7*0.95,"Dose Reduced","Active"))
Row 8  E:  =IF(J8=0,IF(MedNitrates="Yes","Excluded","Not Recommended"),IF(J8<F8*0.95,"Dose Reduced","Active"))
Row 9  E:  =IF(J9=0,IF(MedNitrates="Yes","Excluded","Not Recommended"),IF(J9<F9*0.95,"Dose Reduced","Active"))
Row 11 E:  =IF(J11=0,IF(MedNitrates="Yes","Excluded","Not Recommended"),IF(J11<F11*0.95,"Dose Reduced","Active"))
```

Comments on this formula:
- It only treats `Excluded` as "nitrates are Yes." All other zero-dose paths emit `Not Recommended`. There is no path that produces `Excluded` for, e.g., `MedTRT="Yes"` removing Tongkat Ali / Fadogia / DHEA. Those will land in `Not Recommended` instead. That mismatches the textual warning in `My Profile!B36` ("TRT/HRT: Tongkat Ali and Fadogia have limited benefit. DHEA is not recommended").
- The "Excluded" label is therefore a near-singleton tied to `MedNitrates`. Any other exclusion path must be added explicitly.

**Both In Stack formulas (Safety Check column E):**

```
Row 8  E:  =IF(AND(
              OR(IFERROR(INDEX('Stack Builder'!$E$7:$E$37,MATCH("Zinc Picolinate or Glycinate",'Stack Builder'!$C$7:$C$37,0)),"No")="Active",
                 IFERROR(INDEX('Stack Builder'!$E$7:$E$37,MATCH("Zinc Picolinate or Glycinate",'Stack Builder'!$C$7:$C$37,0)),"No")="Dose Reduced"),
              OR(IFERROR(INDEX('Stack Builder'!$E$7:$E$37,MATCH("Selenium Selenomethionine",'Stack Builder'!$C$7:$C$37,0)),"No")="Active",
                 IFERROR(INDEX('Stack Builder'!$E$7:$E$37,MATCH("Selenium Selenomethionine",'Stack Builder'!$C$7:$C$37,0)),"No")="Dose Reduced")
           ),"Yes","No")

Row 9  E:  =IF(AND(OR(...MATCH("Tongkat Ali Eurycoma Longifolia"...) = "Active",
                     ...="Dose Reduced"),
                  OR(...MATCH("Fadogia Agrestis"...)="Active",
                     ...="Dose Reduced")),"Yes","No")

Row 14 E:  =IF(AND(OR(...MATCH("L-Citrulline Pure Powder"...)="Active",
                     ...="Dose Reduced"),
                  OR(...MATCH("Beet Root Dietary Nitrates"...)="Active",
                     ...="Dose Reduced")),"Yes","No")
```

Both lookups read column `E` of Stack Builder (Status) with `C` (Supplement Name) as the match key. Fallback `"No"` is supplied via `IFERROR`, so missing supplements are treated as not-in-stack.

**Status (column F) formulas:**

```
Row 8  F:  =IF(E8="Yes","Caution","Not Applicable")
Row 14 F:  =IF(E14="Yes","Note","Not Applicable")
Row 21 F:  =IF(E21="Yes","Note","Not Applicable")
```

The hard-coded severity `"Caution"`/`"Note"` is duplicated between the static `B` column and the formula in `F`. If you ever change `B`, you must remember to change `F` too — they are not linked.

**Applies to Multivitamin formulas:**

There is **no `Applies to Multivitamin` column or formula** in the Safety Check sheet. The closest element is:
- The named range `MultivitaminSelection` -> `My Profile!$B$12`.
- Stack Builder row 7 (`Multivitamin (Men's Formula)`) is itself a regular row in the stack with the same Status logic as everything else.
- Stack Builder column `I` (`Multi Adj Dose`) is a placeholder formula `=""` on every data row — i.e. the multivitamin overlap dose-reduction logic is not wired up. The `Final Dose` formula in column `J` reads `=IFERROR(IF(I7="",H7,IF(I7<H7,I7,H7)),F7)` which means whenever a multivitamin is selected, the overlap reduction never fires because `I` is empty.

### 2.3 Column Reference Verification

The Stack Builder column layout (row 6 headers) is:

| Col | Header |
|-----|--------|
| A | Stack |
| B | Category |
| C | Supplement Name |
| D | Product Selection |
| E | Status |
| F | Base Dose |
| G | Unit |
| H | Age/Health Adj Dose |
| I | Multi Adj Dose |
| J | Final Dose |
| K | Original Dose |
| L | Daily Servings |
| M | Best Timing |
| N | With Meals |
| O | Notes and Alerts |
| P | Daily Total |
| Q | Monthly Cost |
| R | Amazon Link |

**The Safety Check formulas correctly reference `'Stack Builder'!$C$7:$C$37` for names and `'Stack Builder'!$E$7:$E$37` for status.** That is consistent with the actual layout.

**However**, the *Stack Builder* CF rules (Analysis 1) reference `$B7` for Status checks, which is wrong (column B is Category). This is the core bug: the Safety Check sheet uses the right column, but the Stack Builder's own conditional formatting partly uses the wrong column.

### 2.4 Test Case: Zinc + Multivitamin Interaction

Step-by-step trace assuming the user selected `Thorne Men's Multi 50+` as their multivitamin and is taking zinc:

1. `My Profile!B12` (`MultivitaminSelection`) = `Thorne Men's Multi 50+`.
2. Stack Builder row 7 `Multivitamin (Men's Formula)` is `Active` because the product was selected. Its Status (E7) becomes `Active`.
3. Stack Builder row 11 `Zinc Picolinate or Glycinate` is also `Active`.
4. Multivitamin overlap logic: column `I7` (`Multi Adj Dose`) is `=""` for every row including zinc (row 11). Therefore no dose reduction is applied to zinc to compensate for zinc that may already be in the multivitamin.
5. There is no Safety Check row for `Zinc + Multivitamin`. The 14 interactions defined in the sheet (matching the 14 in `supplement-interactions.ts`) cover supplement-supplement antagonisms (`Zinc + Selenium`, `Zinc + Magnesium`), but no supplement-vs-multivitamin overlap rule.
6. Result: a user taking a methylated men's multivitamin AND a separate 30 mg zinc supplement may exceed the upper tolerable intake for zinc with no warning surfaced anywhere in the workbook.

This is both a **missing data row** (no Multivitamin overlap entries in Safety Check) and a **missing formula** (column `I` of Stack Builder is a stub).

### 2.5 Interaction Count vs Source

- Interaction rows in `Supplement Safety Check` (rows 8-21): **14**.
- Interaction objects in `src/lib/data/supplement-interactions.ts`: **14**.

Pair-by-pair comparison:

| # | Source `id` | Source `title` | Source `severity` | Sheet row | Sheet `Title` (col C) | Sheet `Severity` (col B) | Match |
|---|-------------|----------------|-------------------|-----------|------------------------|--------------------------|-------|
| 1 | `zinc-selenium` | Zinc + Selenium | caution | 8 | Zinc + Selenium | Caution | OK |
| 2 | `tongkat-fadogia` | Tongkat Ali + Fadogia Agrestis | caution | 9 | Tongkat Ali + Fadogia Agrestis | Caution | OK |
| 3 | `tongkat-dhea` | Tongkat Ali + DHEA | caution | 10 | Tongkat Ali + DHEA | Caution | OK |
| 4 | `ashwagandha-tongkat` | Ashwagandha + Tongkat Ali | caution | 11 | Ashwagandha + Tongkat Ali | Caution | OK |
| 5 | `ashwagandha-fadogia` | Ashwagandha + Fadogia Agrestis | caution | 12 | Ashwagandha + Fadogia Agrestis | Caution | OK |
| 6 | `ashwagandha-dhea` | Ashwagandha + DHEA | caution | 13 | Ashwagandha + DHEA | Caution | OK |
| 7 | `citrulline-beet` | L-Citrulline + Beet Root | note | 14 | L-Citrulline + Beet Root | Note | OK |
| 8 | `quercetin-omega3` | Quercetin + Omega-3 | caution | 15 | Quercetin + Omega-3 | Caution | OK |
| 9 | `berberine-quercetin` | Berberine + Quercetin | note | 16 | Berberine + Quercetin | Note | OK |
| 10 | `resveratrol-quercetin` | Resveratrol + Quercetin | caution | 17 | Resveratrol + Quercetin | Caution | OK |
| 11 | `nmn-resveratrol` | NMN/NR + Resveratrol | note | 18 | NMN/NR + Resveratrol | Note | OK |
| 12 | `berberine-creatine` | Berberine + Creatine | note | 19 | Berberine + Creatine | Note | OK |
| 13 | `zinc-magnesium` | Zinc + Magnesium | note | 20 | Zinc + Magnesium | Note | OK |
| 14 | `fenugreek-tongkat` | Fenugreek + Tongkat Ali | note | 21 | Fenugreek + Tongkat Ali | Note | OK |

**Counts and titles match 1:1 with the source.** No missing or extra rows.

Additional content gaps that are missing from BOTH the source and the sheet but should arguably exist (clinical recommendation, not currently encoded):
- Multivitamin overlap with Zinc, B-Complex, Vitamin D3, Selenium, Boron, Magnesium (all common multi ingredients).
- Saw Palmetto + Finasteride / 5-AR inhibitors (additive 5-AR inhibition with Fenugreek already covered, but not with prescription drugs). The workbook does not capture any prescription drug except via the named medication ranges.
- Berberine + Diabetes meds (Metformin / GLP-1) -- additive glucose lowering. `MedDiabetes` named range exists but no Safety Check row consumes it.
- L-Citrulline / Beet Root / Pine Bark + PDE5 / Alpha-Blockers / BP meds -- additive vasodilation. The dose reduction is implied via the Stack Builder formulas but no explicit Safety Check row tells the user *why*.
- DHEA + TRT -- redundant exogenous androgen substrate. `MedTRT` exists; no Safety Check row.

### 2.6 Badge Formula Audit

Row 5 badge formulas:

```
B5: =COUNTIF(F8:F21,"Caution")&" Cautions"
C5: =COUNTIF(F8:F21,"Note")&" Notes"
D5: =COUNTIF(F8:F21,"Not Applicable")&" Not Applicable"
E5: =COUNTIF(F8:F21,"Active - Conflict")&" Conflicts"
```

Audit findings:

1. **`E5` is dead.** The Status formula in column `F` only ever produces `"Caution"`, `"Note"`, or `"Not Applicable"`. No row has the string `"Active - Conflict"`. The "Conflicts" badge will always read `0 Conflicts`. Either:
   - rename a severity tier to `Conflict` and have specific rows produce it, or
   - drop the badge.
2. **The badges count by status, not severity, which is fine** - because `F` already conflates "in stack AND severity" into a single label. So `B5` correctly counts only Cautions that are *both in stack*. Same for Notes and Not Applicable.
3. **`D5` will dominate.** With a typical user not having every supplement Active, "Not Applicable" will be the largest count. That is fine but visually it may bury the actual cautions. Consider re-ordering so `Cautions` is leftmost (it already is) and color-coding the badges via CF on `B5:E5` (none currently exist).
4. **No CF on the badge cells.** Only one CF range exists on this sheet (`A8:F21` for the `Not Applicable` muting). The badges in row 5 are unstyled apart from default text, so the user gets a count without a color cue.
5. **Consistency with severity column B.** There is no formula tying the static `B` column ("Caution" / "Note") to the badge counts; everything is hard-coded. If a future severity tier is added (e.g., `Critical`), all of: `B`, `F` (per-row formula), and `B5:E5` badges must be edited by hand. Driving the badge count from the `B` column instead of `F` would be brittle differently (it would count even when not in stack), so a more robust pattern is `=COUNTIFS($B$8:$B$21,"Caution",$E$8:$E$21,"Yes")&" Cautions"` -- which makes the dependency on severity explicit and removes the magic strings from `F`.

---

## ANALYSIS 3 - Stack Builder Header Area

### 3.1 Current Rows 1-6 Content

| Row | Height | Contents |
|-----|--------|----------|
| 1 | 31.5 | Merged `A1:R1`. Title: `PERFECT STACK BUILDER - PERSONALIZED SUPPLEMENT SYSTEM`. |
| 2 | 18.0 | `A2 = "GO TO:"` followed by hyperlinks to every other tab (B2-K2). |
| 3 | 15.75 | Status legend: `A3 Active`, `C3 Dose Reduced`, `E3 Not Recommended`, `G3 Excluded`, `I3 Note/Info`, `K3 Calculated Dose`, `M3 ="Stack: "&IFERROR(RecommendedStack,"Set profile")`. |
| 4 | default | Empty spacer row. |
| 5 | 21.75 | Merged `A5:R5`. Medication strip formula: `=IF(MedNitrates="Yes","NITRATE WARNING - Stack C excluded  \|  ","") & IF(MedTRT="Yes","TRT ACTIVE  \|  ","") & IF(MedBloodThinners="Yes","BLOOD THINNERS  \|  ","") & IF(MedAlphaBlockers="Yes","ALPHA-BLOCKERS  \|  ","") & IF(MedStatins="Yes","STATINS  \|  ","") & "Personalized doses for your profile"`. |
| 6 | 36.0 | Column headers (Stack, Category, Supplement Name, Product Selection, Status, Base Dose, Unit, Age/Health Adj Dose, Multi Adj Dose, Final Dose, Original Dose, Daily Servings, Best Timing, With Meals, Notes and Alerts, Daily Total, Monthly Cost, Amazon Link). |

### 3.2 Recommended Stack Display

The recommended stack appears in **`M3`** as `="Stack: "&IFERROR(RecommendedStack,"Set profile")`. This places the recommendation in the same row as the status legend (row 3, col M), which makes it easy to miss because:
- The cell sits in the middle of the legend, not adjacent to a label.
- It uses the standard zinc-900 font with white background -- nothing visually distinguishes it from the legend swatches around it.
- The single-cell `M3` is not merged or boxed, so on narrower viewports the text can clip into N3/O3 with no padding.

The recommended stack is the most important *output* on this sheet (it tells the user which letters - A, B, C, D, E - they should actually be looking at), and it currently has the same visual weight as a legend item.

### 3.3 Placement Recommendation for Stack Preference Dropdown

Recommended placement: **Row 4, columns A-E**, with the dropdown in `B4` and a label in `A4`. Rationale:

- Row 4 is currently empty (a spacer between the legend and the medication strip), so adding a control there does not displace anything else.
- Putting the user-controllable input (`Stack Preference`) directly above the medication strip (row 5, which is the auto-generated warning/output) keeps inputs and outputs vertically adjacent and aligned with the existing input-then-output rhythm of the sheet (`My Profile` -> `Stack Builder`).
- Columns A-E in row 4 are wide enough for `A4 = "Stack Preference:"` and a `B4` data-validation dropdown with options like `Auto (Use Recommended)`, `Foundation Only (A)`, `A + B`, `A + B + C`, `A + B + C + D`, `Full Stack (A-E)`.
- Move the recommended-stack readout from `M3` to `B4` *next to* the dropdown -- e.g. `C4 = "(Auto = " & RecommendedStack & ")"` so the user sees both their override choice and the system's recommendation in one glance.
- Alternatively, if you want to keep row 4 free, the next-best slot is `M5` (currently inside the merged medication strip). That would require unmerging `A5:R5` and splitting the strip into `A5:L5` for warnings and `M5:R5` for the dropdown -- more disruptive.

A second supporting placement: add a CF rule on rows 7-37 that grays out (`#F4F4F5` / `#A1A1AA`) any row whose `A` column (`Stack` letter) is not present in the user's chosen preference. That gives the dropdown a visible effect on the sheet body without rewriting any of the dose formulas.

---

## Summary of Issues Found

1. CF rules `$B7="Not Recommended"` and `$B7="Excluded"` reference the wrong column (B is Category, not Status). They are dead code.
2. CF has no `Active` rule -- the legend's `Active` swatch is purely decorative.
3. CF for `Excluded` and `Not Recommended` is missing strikethrough.
4. CF for `Dose Reduced` does not set a font color.
5. CF has no rule for `Note/Info`, even though the legend includes one.
6. Legend swatch fills (D3 yellow, F/H/J amber) do not match the actual CF rule fills (red, gray) -- two color systems live side by side.
7. Column D `Product Selection` has hard-coded yellow fill on every row, overriding the row's status.
8. Columns F/H/J (`Base Dose`, `Age/Health Adj Dose`, `Final Dose`) have hard-coded amber fill on every row.
9. Column R `Amazon Link` has hard-coded blue font on every row, even when Excluded.
10. Even-row stripe color (`#F4F4F5`) is identical to the Excluded fill, making Excluded rows on even lines indistinguishable from normal even rows.
11. CF range `A7:R37` stops short of column S even though `max_column=19`.
12. Stack Builder Status formula treats only `MedNitrates="Yes"` as a path to `Excluded`. TRT/HRT removal of Tongkat/Fadogia/DHEA falls into `Not Recommended` instead, contradicting the Profile sheet warnings.
13. Safety Check `F` column status formula and `B` severity column duplicate the `Caution`/`Note` strings (no link between them).
14. Safety Check badge `E5 "Active - Conflict"` will always be 0 because no formula in `F` ever emits `Active - Conflict`.
15. Safety Check badge cells (`B5:E5`) have no CF -- counts are uncolored.
16. No "Multivitamin overlap" interaction rows exist in either Safety Check or `supplement-interactions.ts`. The Stack Builder column `I` (`Multi Adj Dose`) is a stub `=""`, so multi-overlap dose reduction never happens.
17. No Safety Check rows surface medication-vs-supplement interactions even though named ranges (`MedDiabetes`, `MedTRT`, `MedPDE5`, `MedAlphaBlockers`, `MedBloodThinners`) exist for it.
18. `Recommended Stack` readout sits in `M3` with no visual prominence -- it has the same styling as a legend swatch label.
19. There is no `Stack Preference` user control on the Stack Builder sheet at all; the user is given a recommendation but no place to override it.
20. Safety Check sheet has only 14 rows; `supplement-interactions.ts` also has only 14. Both should be expanded for the multivitamin overlap and medication-interaction cases listed in 2.5.

## Recommended Fixes for v6 (priority order)

1. **(Critical safety)** Add multivitamin overlap detection. Wire up Stack Builder column `I` to look up overlapping nutrient amounts from a small `Multivitamin_Composition` table on `Reference` keyed by `MultivitaminSelection`, and reduce `Final Dose` accordingly. Add corresponding Safety Check rows for `Multivitamin + Zinc`, `Multivitamin + B-Complex`, `Multivitamin + D3+K2`, `Multivitamin + Selenium`, `Multivitamin + Magnesium`, `Multivitamin + Boron` -- minimum severity `Note`.
2. **(Critical safety)** Add medication-vs-supplement interaction rows to Safety Check using the existing named ranges:
   - `Berberine + MedDiabetes`
   - `Quercetin / Omega-3 / Resveratrol + MedBloodThinners` (in addition to the supplement-supplement rows already present)
   - `L-Citrulline / Beet Root / Pine Bark + MedPDE5 / MedAlphaBlockers / MedBloodPressure`
   - `DHEA + MedTRT`, `Tongkat / Fadogia + MedTRT`
3. **(Critical safety)** Update the Stack Builder Status formula so `Excluded` fires for the *actual* exclusion conditions (TRT/HRT excluding DHEA, etc.) -- not only `MedNitrates="Yes"`. Move the exclusion lookup table into `Reference` so it can be edited without touching formulas.
4. **(Bug)** Delete the two `$B7=...` CF rules (priorities 2 and 3). They never fire.
5. **(Bug)** Replace the badge formula in `Supplement Safety Check!E5` with one that counts a real status, or rename a tier to `Conflict` and emit it from at least one Status formula. Otherwise drop the badge.
6. **(Visual)** Rebuild the CF rule set on Stack Builder per Analysis 1.3: priority order Excluded -> Not Recommended -> Dose Reduced -> Active -> zebra stripe. Apply strikethrough on Excluded and Not Recommended. Apply font color on Dose Reduced.
7. **(Visual)** Strip the static yellow fill from column D and the static amber fill from columns F/H/J on data rows 7-37; recreate via CF rules keyed on `Active` status so the dose columns mute correctly when the row is Excluded/Not Recommended.
8. **(Visual)** Recolor the even-row stripe to `#FAFAFA` so it does not collide with the Excluded fill.
9. **(Visual)** Add a CF rule on column R to recolor and strikethrough the `Buy Now` link when the row is Excluded or Not Recommended.
10. **(UX)** Add a `Stack Preference` dropdown at `A4:B4` on Stack Builder with options `Auto (Use Recommended)`, `Foundation Only (A)`, `A + B`, `A + B + C`, `A + B + C + D`, `Full Stack (A-E)`. Show the auto recommendation alongside (`C4 = "(Auto: " & RecommendedStack & ")"`).
11. **(UX)** Move the "Stack: ..." readout out of `M3` and into the new row 4 area, formatted as a callout cell (background `#FEF9C3`, bold, larger font).
12. **(UX)** Add a CF rule on rows 7-37 that grays a row when its `A` (Stack letter) is not in the chosen preference, so the dropdown has visible effect without rewriting any dose formulas.
13. **(Maintenance)** Drive the `B5:E5` badges from a `COUNTIFS` over the `B` (Severity) and `E` (Both In Stack?) columns instead of magic strings in `F`. Then `F` can be simplified to just `Yes/No` or removed entirely.
14. **(Maintenance)** Tighten the CF rule range to `A7:S37` (or to a named range like `StackBody`) so future column additions stay styled.
15. **(Maintenance)** Add `consts` for severity labels (one cell on `Reference` like `Sev_Caution = "Caution"`) and reference them throughout the formulas, removing the duplicated string literals across `B`, `F`, and the badge formulas.

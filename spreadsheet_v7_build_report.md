# Perfect Stack Spreadsheet v7 - Build Report
*Build Date: April 2026*
*Base: v6 | No modifications to v6*
*Recalc: success | 722 formulas | 0 errors*

## Summary of Fixes

### Fix 1 + 2: Stack C Exclusion Bug and Dropdown Update

**Root Cause:** The v6 Status formula used SEARCH(A7, StackSelection) where StackSelection is the full dropdown label string (e.g. "Stack A = A (Foundation only)"). The letter "C" appears in the word "Stack" (S-t-a-c-k), so SEARCH("C","Stack A...") always returns a number, meaning Stack C supplements were never excluded regardless of stack selection.

**Solution:** Created a StackInclusionTable (2-column lookup table) in Products_DB columns AM-AN rows 2-6:

| Stack Selection Label | Included Stacks |
|---|---|
| Stack A = Foundation Only | A |
| Stack B = A+B | A,B |
| Stack C = A+B+C | A,B,C |
| Stack D = A+B+C+D | A,B,C,D |
| Stack E = A+B+C+D+E (Full Stack) | A,B,C,D,E |

**Updated Status formula (all 31 rows):**
- Old: `=IF(NOT(ISNUMBER(SEARCH(A7,StackSelection))),"Excluded",...)`
- New: `=IF(NOT(ISNUMBER(SEARCH(A7,IFERROR(VLOOKUP(StackSelection,StackInclusionTable,2,0),"A,B,C,D,E")))),"Excluded",...)`

**Logic verification:**
- Stack A selected -> VLOOKUP returns "A" -> SEARCH("C","A") = error -> Stack C = Excluded (correct)
- Stack C selected -> VLOOKUP returns "A,B,C" -> SEARCH("C","A,B,C") = 5 -> Stack C = Active (correct)
- Stack E selected -> VLOOKUP returns "A,B,C,D,E" -> all letters found -> all Active (correct)
- IFERROR fallback "A,B,C,D,E" means if StackInclusionTable is unavailable, all supplements show as Active (fail-safe)

**Dropdown options updated (Fix 2):**
- Stack A = Foundation Only (was "Stack A = A (Foundation only)")
- Stack B = A+B
- Stack C = A+B+C
- Stack D = A+B+C+D
- Stack E = A+B+C+D+E (Full Stack)

**Named range added:** StackInclusionTable = Products_DB!$AM$2:$AN$6

### Fix 3: Color Legend Visual Improvement

The legend was already on row 3 in the correct position. Improved visual appearance:
- Each status now shows its actual brand color (Active=green text, Dose Reduced=amber, Not Recommended=red, Excluded=slate, Note=blue, Calculated=gold)
- "STATUS:" label at left makes purpose clear
- Row height set to 18pt for clean compact display

### Fix 4: 3 Conflict Interactions Added to Safety Check

**Inserted at rows 8-10** (before existing 14 interactions which shifted to rows 11-24):

| Row | Title | Severity | Condition |
|---|---|---|---|
| 8 | Multivitamin + Zinc | conflict | Multivitamin Active AND Thorne Men's Multi 50+ selected |
| 9 | Multivitamin + Selenium | conflict | Multivitamin Active AND ANY multivitamin selected (not None) |
| 10 | Multivitamin + B-Complex | conflict | Multivitamin Active AND Life Extension Two-Per-Day selected |

**Both-In-Stack formula pattern for conflicts:**
Each conflict uses VLOOKUP on Stack Builder to confirm Multivitamin (Men's Formula) is Active or Dose Reduced, then checks the appropriate MultivitaminSelection condition. This fires even when the conflicting supplement was already automatically zeroed out by the Stack Builder, correctly explaining WHY it was removed.

**Badge formulas updated to rows 8-24:**
- Cautions: `=COUNTIFS($B$8:$B$24,"caution",$F$8:$F$24,"Yes")`
- Notes: `=COUNTIFS($B$8:$B$24,"note",$F$8:$F$24,"Yes")`
- Not Applicable: `=COUNTIF($F$8:$F$24,"No")`
- Conflicts: `=COUNTIFS($B$8:$B$24,"conflict",$F$8:$F$24,"Yes")`

**CF rules rebuilt for A8:F24 (now includes conflict rule):**
1. AND($F8="Yes",$B8="conflict"): bg #FEF2F2, text #EF4444 (red)
2. AND($F8="Yes",$B8="caution"): bg #FFFBEB, text #B45309 (amber)
3. AND($F8="Yes",$B8="note"): bg #EFF6FF, text #3B82F6 (blue)
4. $F8="No": bg #F9F9F9, text #A1A1AA (muted)

**Expected badge behavior:**
- Thorne selected + Multivitamin Active: Conflicts = 2 (Zinc + Selenium both fire)
- Micro Ingredients selected: Conflicts = 1 (Selenium only)
- Life Extension selected: Conflicts = 2 (Selenium + B-Complex)
- None selected: Conflicts = 0

## Named Ranges (22 total)
- AgeGroup: 'My Profile'!$B$6
- PrimaryGoal: 'My Profile'!$B$7
- TrainingStyle: 'My Profile'!$B$8
- HealthStatus: 'My Profile'!$B$9
- MultivitaminSelection: 'My Profile'!$B$12
- MedBloodThinners: 'My Profile'!$B$15
- MedBloodPressure: 'My Profile'!$B$16
- MedAlphaBlockers: 'My Profile'!$B$17
- MedTRT: 'My Profile'!$B$18
- MedPDE5: 'My Profile'!$B$19
- MedNitrates: 'My Profile'!$B$20
- MedStatins: 'My Profile'!$B$21
- MedDiabetes: 'My Profile'!$B$22
- MedThyroid: 'My Profile'!$B$23
- HormoneFactor: 'My Profile'!$B$26
- NOFactor: 'My Profile'!$B$27
- StressSleepFactor: 'My Profile'!$B$28
- OverallFactor: 'My Profile'!$B$29
- RecommendedStack: 'My Profile'!$B$30
- StartDate: 'Supplement Cycling'!$B$5
- StackSelection: 'Stack Builder'!$F$4
- StackInclusionTable: Products_DB!$AM$2:$AN$6

## Limitations
- Stack Builder CF rules are driven by $E7 (Status column) using priority-ordered FormulaRules. The VLOOKUP-based exclusion formula adds ~50 chars per row but remains well under Excel's 8192-char cell limit.
- The conflict row "Both In Stack?" formula checks Multivitamin status via VLOOKUP but not the second supplement's status (since the Stack Builder already removes it). This is intentional - the conflict row explains WHY the supplement was removed.
- No data rows shifted in Stack Builder (rows still 7-37). Only Safety Check rows shifted (existing interactions moved from rows 8-21 to rows 11-24).

## Recommendations for v8
1. Add medication-vs-supplement conflict rows (Berberine + MedDiabetes, DHEA + MedTRT, etc.)
2. Wire up the Stack Builder's Multi Adj Dose column (I) for full multivitamin overlap calculation
3. Add a "why is this flagged?" tooltip column to Safety Check

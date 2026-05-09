# Perfect Stack Spreadsheet v6 - Build Report
*Build Date: April 2026*
*Base file: v5 | Output: v6*

## Build Summary
- Recalc status: success
- Total formulas: 716
- Formula errors: 0
- Named ranges: 21 (including new StackSelection)

## FIX 1 - Stack Builder Conditional Formatting
### Before
- 5 CF rules, 2 of which referenced wrong column ($B7 = Category instead of $E7 = Status) -- dead code
- No strikethrough, no font color on Dose Reduced, no Active rule, no Note/Info rule
- Hardcoded amber fills on columns F/H/J competed with CF rules
- Even-row stripe color #F4F4F5 identical to Excluded fill
### After
- All existing CF deleted and rebuilt from scratch
- 6 new CF rules applied to A7:R37:
  1. $E7="Not Recommended": bg #FEF2F2, text #EF4444 (red)
  2. $E7="Excluded": bg #F1F5F9, text #94A3B8 (slate gray)
  3. $E7="Dose Reduced": bg #FFFBEB, text #B45309 (amber)
  4. AND($E7="Active",MOD(ROW(),2)=1): bg #FFFFFF, text #18181B (white odd rows)
  5. AND($E7="Active",MOD(ROW(),2)=0): bg #FAFAFA, text #18181B (zebra even rows)
  6. Fallback zebra stripe for edge cases
- Hardcoded fills removed from all data rows 7-37
- Excluded stripe color changed to #F1F5F9 (clearly distinct from Active even rows #FAFAFA)
- Rules implemented via openpyxl Rule(type='expression', dxf=...) since FormulaRule did not accept dxf kwarg in this openpyxl version

## FIX 2 - Stack Preference Dropdown
### New named range: StackSelection = 'Stack Builder'!$F$4
### Row 4 layout:
- A4: 'Recommended:' label (dark bg, gold text)
- B4:D4: Formula =IFERROR(RecommendedStack,'Set profile in My Profile') -- merged
- E4: 'Your Selection:' label
- F4:H4: Dropdown with 5 options from Stack A to Stack E (merged, DV attached to F4)
- I4:L4: Active stacks readout formula
### Status formula update (all 31 supplement rows):
- Old: =IF(J{r}=0, IF(MedNitrates='Yes','Excluded','Not Recommended'), IF(J{r}<F{r}*0.95,'Dose Reduced','Active'))
- New: =IF(NOT(ISNUMBER(SEARCH(A{r},StackSelection))),'Excluded', [previous logic])
- Stack letters not in StackSelection now show 'Excluded' (grayed out by CF Rule 2)

## FIX 3 - Safety Check Formula Rebuild
### Both-In-Stack formula (col E, rows 8-21):
- OLD: Complex INDEX/MATCH with OR(Active, Dose Reduced) -- potentially broken on name mismatch
- NEW: VLOOKUP(name,'Stack Builder'!$C$7:$E$37,3,0) - cleaner, column offset 3 = Status
  Pattern: AND(NOT(ISERROR(VLOOKUP(suppA,...))), OR(VLOOKUP(suppA,...)='Active',VLOOKUP(...)='Dose Reduced'), same for suppB)
### Active Flag (col F):
- Simplified to: =IF(E{r}='Yes','Yes','No')
- No requiresMultivitamin filter needed (none of the 14 source interactions use this field)
### Severity column (col B):
- Changed to lowercase ('caution'/'note') for COUNTIFS badge matching

## FIX 4 - Safety Check Badge Formulas
### OLD badge formulas (broken):
  B5: =COUNTIF(F8:F21,'Caution')  -- counted old Status col which mixed severity+applicability
  E5: =COUNTIF(F8:F21,'Active - Conflict')  -- string never emitted, always 0
### NEW badge formulas:
  B5 (Cautions): =COUNTIFS($B$8:$B$21,'caution',$F$8:$F$21,'Yes')
  C5 (Notes):    =COUNTIFS($B$8:$B$21,'note',$F$8:$F$21,'Yes')
  D5 (Not Applicable): =COUNTIF($F$8:$F$21,'No')
  E5 (Conflicts): =COUNTIFS($B$8:$B$21,'conflict',$F$8:$F$21,'Yes') -- shows 0 until conflict-level interactions added
### CF Rules on Safety Check (A8:F21):
  1. AND($F8='Yes',$B8='caution'): bg #FFFBEB, text #B45309
  2. AND($F8='Yes',$B8='note'): bg #EFF6FF, text #3B82F6
  3. $F8='No': bg #F9F9F9, text #A1A1AA

## Named Ranges (21 total)
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

## Limitations
- requiresMultivitamin is defined in supplement-interactions.ts interface but used by ZERO of the 14 actual interactions. The 'Applies to Multivitamin' column concept is moot for this dataset. All 14 interactions apply to all users regardless of multivitamin selection.
- The Conflicts badge (E5) will always show 0 because 'conflict' severity does not exist in supplement-interactions.ts. All 14 interactions are 'caution' or 'note'. A future v7 could add conflict-level entries for absolute contraindications like Nitrate meds + L-Citrulline.
- StackSelection default is 'Stack E = A+B+C+D+E (Full Stack)'. On first open, all supplements show as Active unless the user changes it. This is the expected behavior.

## Recommendations for v7
1. Add conflict-level interaction rows for absolute contraindications (Nitrate meds + L-Citrulline, etc.) so the Conflicts badge activates.
2. Add multivitamin overlap interaction rows (Zinc + Multivitamin, Selenium + Multivitamin, D3 + Multivitamin) with 'note' or 'caution' severity.
3. Add medication-specific Safety Check rows consuming MedDiabetes, MedTRT, MedPDE5, MedBloodThinners named ranges.
4. Wire up Stack Builder col I (Multi Adj Dose) for all supplements that have multivitaminAdjustment data in supplements.ts.
# Perfect Stack Spreadsheet v9 - Build Report
*Build Date: April 2026*
*Single fix: Safe badge formula in Supplement Safety Check*
*Base: v8 (unchanged) | Recalc: success | 789 formulas | 0 errors*

## Fix Applied: Safe Badge Count

### Problem with v8 Safe Formula
The v8 formula used `MAX(0, TotalActive - (conflicts+cautions+notes)*2)` which subtracts
2 supplements per interaction. Supplements appearing in multiple interactions were
subtracted multiple times, producing 0 or near-0 even when most supplements are safe.

### New Formula Approach
Created two hidden helper columns (H and I) in the interaction table rows 8-32:
- Column H: =IF(F{row}="Yes", LEFT(A{row}, FIND(" + ",A{row})-1), "")
  - Extracts Supplement A name from Pair column only for ACTIVE interactions
- Column I: =IF(F{row}="Yes", MID(A{row}, FIND(" + ",A{row})+3, 200), "")
  - Extracts Supplement B name from Pair column only for ACTIVE interactions

Both columns are hidden (column_dimensions.hidden=True) so they don't clutter the sheet.

### New Safe Badge Formula (E5)
=SUMPRODUCT(
  (('Stack Builder'!$E$7:$E$37="Active")+('Stack Builder'!$E$7:$E$37="Dose Reduced")>0)*
  ((COUNTIF($H$8:$H$32,'Stack Builder'!$C$7:$C$37)+COUNTIF($I$8:$I$32,'Stack Builder'!$C$7:$C$37))=0)
)&" Safe"

**Logic:**
1. For each of the 31 supplements in Stack Builder rows 7-37:
   - Check if Status (col E) is "Active" OR "Dose Reduced" -> first SUMPRODUCT factor
   - Check if name (col C) appears in either helper col H or I -> COUNTIF sum =0 means NOT flagged
2. SUMPRODUCT multiplies: only counts supplements that are BOTH active AND not flagged
3. Result = count of active supplements with no active interaction

**Why this is correct:**
- A supplement in 3 active interactions is still only counted ONCE in COUNTIF (not 3x)
- An "Excluded" supplement is not counted (first factor is 0)
- An "Active" supplement with no active interactions contributes 1 to the sum
- If all 31 supplements are Active and none have interactions: Safe = 31

### Edge Case Handling
Pair column (A) FIND(" + ") approach handles:
- "Multivitamin (Men's Formula) + Vitamin D3 + K2": FIND gets FIRST " + " -> correct split
- "NMN or NR NAD+ Precursor + Vitamin D3 + K2": "NAD+" has no spaces -> FIND skips it
- Empty or blank rows: IFERROR wrapper prevents #VALUE! errors

### Named Ranges: 22 (unchanged from v8)

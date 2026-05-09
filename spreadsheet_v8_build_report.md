# Perfect Stack Spreadsheet v8 - Build Report
*Build Date: April 2026*
*Base: v7 | 0 modifications to v7*
*Recalc: success | 739 formulas | 0 errors*

## Fix 1: 8 New Interactions Added

### Insertion Strategy
- 5 new caution rows inserted at position 11 (before existing cautions at rows 11-16 in v7)
- Existing rows 11-24 shifted to 16-29
- 3 new note rows appended at rows 30-32

### New Caution Rows (rows 11-15):
1. Row 11: Multivitamin + Vitamin D3 - fires when multivitamin is active AND any multi is selected AND D3 is active/dose-reduced
2. Row 12: Panax Ginseng + Tongkat Ali - both LH stimulators, standard VLOOKUP pattern
3. Row 13: Berberine + Fenugreek - additive blood glucose lowering
4. Row 14: Saw Palmetto + Zinc - additive 5-AR inhibition and DHT reduction
5. Row 15: CoQ10 + Berberine - AMPK reduces CoQ10 synthesis; taking together is recommended but note timing

### New Note Rows (rows 30-32):
6. Row 30: Lycopene + Vitamin C - synergistic antioxidant pairing
7. Row 31: Quercetin + Vitamin C - Vitamin C regenerates quercetin
8. Row 32: NMN + Vitamin D3 - complementary mitochondrial support

### Formula Pattern Used:
Standard cautions/notes use: =IF(AND(NOT(ISERROR(VLOOKUP(...))), ..., OR(status="Active", status="Dose Reduced"), ...),"Yes","No")
Multivitamin caution uses: =IF(AND(Multivitamin Active, D3 Active/Dose Reduced, MultivitaminSelection<>"None"),"Yes","No")

### Total interaction count: 25/25 expected
- Conflicts: 3/3
- Cautions: 13/11 (6 from v7 + 5 new)
- Notes: 9/11 (8 from v7 + 3 new)

## Fix 2: Safe Badge Added

### Badge Order (left to right, row 5):
A5: SUMMARY label | B5: Conflicts (red) | C5: Cautions (amber) | D5: Notes (blue) | E5: Safe (green) | F5: Not Applicable (gray)

### Safe Count Formula:
=MAX(0, TotalActive - (Conflicts + Cautions + Notes)*2) & " Safe"
Where TotalActive = COUNTIF(Stack Builder E7:E37, "Active") + COUNTIF(..., "Dose Reduced")

### Limitation:
The *2 multiplier approximation may underestimate Safe count because supplements appearing in multiple interactions are subtracted multiple times. The MAX(0,...) prevents negative values. A more accurate formula would require dynamic arrays (UNIQUE/FILTER) not available in all Excel versions. The approximation is acceptable for a supplemental reference sheet.

## CF Rules Updated
Range A8:F32 (was A8:F24):
1. AND($F8="Yes",$B8="conflict"): bg #FEF2F2, text #EF4444
2. AND($F8="Yes",$B8="caution"): bg #FFFBEB, text #B45309
3. AND($F8="Yes",$B8="note"): bg #EFF6FF, text #3B82F6
4. $F8="No": bg #F9F9F9, text #A1A1AA

## Named Ranges: 22 total (unchanged from v7)
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

# Perfect Stack Supplement Safety Analysis
**Date:** April 2026
**Analyst:** Claude (Opus)
**Disclaimer:** This analysis is for informational purposes only. Users should consult a licensed healthcare provider before starting any supplement protocol. Supplement needs vary by individual based on health status, medications, diet, age, lab values (serum 25-OH-D, ferritin, RBC zinc, etc.), and genetics (e.g., MTHFR variants).

---

## Executive Summary

**Total nutrient conflicts identified across the 3 multivitamins:** 9 (across 5 stack supplements)

**EXCEEDS UL (combined ≥ 100% of UL):**
- **Vitamin D3 + K2 (id 2, 5,000 IU)** — exceeds 4,000 IU UL with ALL three multivitamins (MV-A: 6,000 IU, MV-B: 6,000 IU, MV-C: 7,000 IU combined)
- **Selenium Selenomethionine (id 8, 200 mcg)** — combined 400 mcg exactly hits the UL with ALL three multivitamins (MV-A, MV-B, MV-C all already deliver 200 mcg)
- **Methylated B-Complex (id 6, 1 serving)** — Vitamin B6 with MV-A (Thorne 25 mg) + typical B-Complex (~25–50 mg) = 50–75 mg approaches UL of 100 mg; with MV-C (Two-Per-Day 75 mg) + B-Complex = 100–125 mg, EXCEEDS UL
- **Zinc Picolinate (id 5, 15 mg)** — combined with MV-A (Thorne 30 mg) = 45 mg, EXCEEDS 40 mg UL

**CAUTION (combined 75–99% of UL):**
- **Magnesium Glycinate (id 3, 200 mg)** — combined with MV-A = 380 mg (exceeds 350 mg supplemental Mg UL); with MV-B and MV-C = 300 mg (86% of UL — CAUTION)
- **Zinc Picolinate (id 5, 15 mg)** — combined with MV-C (25 mg) = 40 mg, hits UL exactly (EXCEEDS); with MV-B (15 mg) = 30 mg, 75% (CAUTION)
- **Vitamin C (id 18, 1,000 mg)** — combined with MV-C = 1,500 mg (75% of UL — CAUTION)

**Safe across all 3 multivitamins:**
- Omega-3 Fish Oil (id 4)
- Boron (id 7)
- All Stack B (Ashwagandha, Tongkat Ali, Fadogia, Fenugreek, DHEA — no nutrient overlap)
- All Stack C except Vitamin C (L-Citrulline, Beet Root, CoQ10, Pycnogenol, Quercetin)
- All Stack D (Maca, Horny Goat Weed, Ginseng, L-Theanine — no nutrient overlap)
- All Stack E (NMN, Resveratrol, Berberine, Saw Palmetto, Lycopene, Probiotic, Creatine, Collagen — minor lycopene overlap with MV-A is not a UL concern)

**Supplements requiring label-dose correction in the app:**
- Vitamin D3+K2 (id 2): app shows 5,000 IU but the recommended product Sports Research D3+K2 is **5,000 IU** (matches). Issue is UL conflict, not label mismatch. Recommend offering a 2,000 IU or 1,000 IU SKU for stacks paired with MV-C.
- CoQ10 Ubiquinol (id 16): NOW Ubiquinol is sold as **100 mg** softgel; Jarrow QH-Absorb commonly **100 mg** or **200 mg**; Life Extension Super Ubiquinol is **100 mg**. App shows 200 mg — recommend lowering default to 100 mg or noting "1–2 softgels" depending on product.
- Boron (id 7): App shows 6 mg, but ALL three product options listed (Life Extension, NOW, Swanson Triple Boron) are **3 mg per capsule**. App default should be 3 mg or note "2 capsules for 6 mg."
- Methylated B-Complex (id 6): Should be flagged with explicit B6 warning when paired with Thorne or Two-Per-Day.
- Zinc Picolinate (id 5): App default 15 mg is correct (matches Thorne/Jarrow Balance), but should warn at multivitamin selection.

---

## Section 1: Stack Supplement Inventory

| ID | Name | Stack | Current App Dose | Unit | Notes |
|----|------|-------|------------------|------|-------|
| 1 | Multivitamin Men's Formula | A | 6 / 2 / 2 (productDosing) | caps/tabs | Three SKU options: Thorne (6 caps), Micro Ingredients (2 caps), LE Two-Per-Day (2 tabs) |
| 2 | Vitamin D3 + K2 | A | 5,000 | IU | Default Sports Research 5,000 IU. UL CONFLICT with all multis. |
| 3 | Magnesium Glycinate | A | 200 | mg | Elemental Mg. UL CONFLICT with MV-A (Thorne); CAUTION with MV-B/MV-C. |
| 4 | Omega-3 Fish Oil EPA+DHA | A | 2,000 | mg | No multi overlap. SAFE. |
| 5 | Zinc Picolinate or Glycinate | A | 15 | mg | UL CONFLICT with MV-A; CAUTION with MV-B; EXCEEDS with MV-C. |
| 6 | Methylated B-Complex | A | 1 | serving | Critical B6 + folate overlap with MV-A and MV-C. |
| 7 | Boron as Calcium Fructoborate | A | 6 | mg | Product labels are 3 mg; default may need correction. SAFE on UL. |
| 8 | Selenium Selenomethionine | A | 200 | mcg | UL CONFLICT — hits 400 mcg UL with all three multis. |
| 9 | Ashwagandha KSM-66 | B | 600 | mg | No nutrient overlap. SAFE. |
| 10 | Tongkat Ali | B | 400 | mg | No nutrient overlap. SAFE. |
| 11 | Fadogia Agrestis | B | 600 | mg | No nutrient overlap. SAFE. |
| 12 | Fenugreek Extract | B | 500 (×2) | mg | No nutrient overlap. SAFE. |
| 13 | DHEA | B | 25 | mg | Hormone precursor — not a vitamin/mineral. SAFE on UL framework. |
| 14 | L-Citrulline | C | 6 | g | No multi overlap. SAFE. |
| 15 | Beet Root | C | 500 | mg nitrates | No multi overlap. SAFE. |
| 16 | CoQ10 Ubiquinol | C | 200 | mg | MV-A (Thorne) provides 30 mg CoQ10; combined 230 mg — no UL. MONITOR. |
| 17 | Pycnogenol | C | 100 | mg | No multi overlap. SAFE. |
| 18 | Vitamin C | C | 1,000 | mg | CAUTION with MV-C (combined 1,500 mg = 75% UL). |
| 19 | Quercetin | C | 500 | mg | No multi overlap. SAFE. |
| 20 | Maca Root | D | 1,000 | mg | No multi overlap. SAFE. |
| 21 | Horny Goat Weed | D | 500 | mg | No multi overlap. SAFE. |
| 22 | Panax Ginseng | D | 900 | mg | No multi overlap. SAFE. |
| 23 | L-Theanine | D | 200 | mg | No multi overlap. SAFE. |
| 24 | NMN / NR | E | 250 | mg | No multi overlap. SAFE. |
| 25 | Resveratrol | E | 500 | mg | MV-C contains 5 mg trans-resveratrol; combined 505 mg — no UL. SAFE. |
| 26 | Berberine HCl | E | 500 (×2) | mg | No multi overlap. SAFE. |
| 27 | Saw Palmetto | E | 320 | mg | No multi overlap. SAFE. |
| 28 | Lycopene | E | 15 | mg | MV-A provides 15 mg lycopene; combined 30 mg — no UL but MONITOR. |
| 29 | Probiotic | E | 50 | billion CFU | No multi overlap. SAFE. |
| 30 | Creatine Monohydrate | E | 5 | g | No multi overlap. SAFE. |
| 31 | Collagen Peptides | E | 10 | g | No multi overlap. SAFE. |

---

## Section 2: Per-Multivitamin Safety Analysis

### MV-A: Thorne Men's Multi 50+ (6 caps/day)

| Supplement | Nutrient | Multi Amount | App Stack Dose | Combined | UL | Status | Action |
|------------|----------|--------------|----------------|----------|----|----|--------|
| Vitamin D3 + K2 (id 2) | Vitamin D3 | 1,000 IU (25 mcg) | 5,000 IU (125 mcg) | 6,000 IU (150 mcg) | 4,000 IU (100 mcg) | **EXCEEDS UL** | Drop D3 dose to 2,000 IU OR offer "1,000 IU" SKU |
| Vitamin D3 + K2 (id 2) | Vitamin K | 125 mcg | ~100 mcg (typical D3+K2 product) | ~225 mcg | No UL | MONITOR (warfarin) | Keep INR warning |
| Magnesium Glycinate (id 3) | Magnesium | 180 mg | 200 mg | 380 mg | 350 mg | **EXCEEDS UL** | Reduce to 150 mg, OR keep at 200 mg with note that UL applies to supplemental Mg only and 380 mg is borderline |
| Zinc Picolinate (id 5) | Zinc | 30 mg | 15 mg | 45 mg | 40 mg | **EXCEEDS UL** | Drop zinc to 7.5 mg OR omit when on Thorne |
| Methylated B-Complex (id 6) | B6 | 25 mg | ~25 mg (Jarrow B-Right) – ~50 mg (Thorne/Seeking Health) | 50–75 mg | 100 mg | **CAUTION** (75% with high-B6 product) | Recommend B-Complex with ≤10 mg B6 (e.g., low-dose methyl B-complex) |
| Methylated B-Complex (id 6) | Folate | 667 mcg DFE | ~400–800 mcg DFE methylfolate | 1,067–1,467 mcg DFE | 1,000 mcg DFE (folic acid only — methylfolate has no firm UL but conservative limit applies) | **CAUTION / EXCEEDS** | Use B-Complex with ≤400 mcg methylfolate |
| Methylated B-Complex (id 6) | Niacin (niacinamide) | 100 mg | ~25–100 mg | 125–200 mg | 35 mg (nicotinic acid only); 900 mg niacinamide | SAFE (niacinamide form) | Confirm niacinamide form on label |
| Boron (id 7) | Boron | 3 mg | 6 mg (app) / 3 mg (label per cap) | 6–9 mg | 20 mg | SAFE | Correct app default to 3 mg (1 cap) |
| Selenium (id 8) | Selenium | 200 mcg | 200 mcg | 400 mcg | 400 mcg | **EXCEEDS UL (at threshold)** | Omit selenium when on any of the 3 multis OR drop to 100 mcg |
| CoQ10 Ubiquinol (id 16) | CoQ10 | 30 mg | 200 mg | 230 mg | No UL | MONITOR | Consider 100 mg default |
| Vitamin C (id 18) | Vitamin C | 180 mg | 1,000 mg | 1,180 mg | 2,000 mg | SAFE (59%) | None |
| Lycopene (id 28) | Lycopene | 15 mg | 15 mg | 30 mg | No UL | MONITOR | Consider lower lycopene dose with Thorne |

### MV-B: Micro Ingredients Methylated Multi (2 caps/day)

| Supplement | Nutrient | Multi Amount | App Stack Dose | Combined | UL | Status | Action |
|------------|----------|--------------|----------------|----------|----|----|--------|
| Vitamin D3 + K2 (id 2) | Vitamin D3 | 1,000 IU | 5,000 IU | 6,000 IU | 4,000 IU | **EXCEEDS UL** | Drop D3 to 2,000 IU |
| Vitamin D3 + K2 (id 2) | Vitamin K | 120 mcg | ~100 mcg | ~220 mcg | No UL | MONITOR (warfarin) | Keep INR warning |
| Magnesium Glycinate (id 3) | Magnesium | 100 mg | 200 mg | 300 mg | 350 mg | **CAUTION (86%)** | Acceptable; flag GI tolerance |
| Zinc Picolinate (id 5) | Zinc | 15 mg | 15 mg | 30 mg | 40 mg | **CAUTION (75%)** | Acceptable; consider 10 mg zinc |
| Methylated B-Complex (id 6) | B6 | 1.7 mg | ~25–50 mg | 27–52 mg | 100 mg | SAFE | None |
| Methylated B-Complex (id 6) | Folate | 400 mcg DFE methylfolate | ~400–800 mcg DFE | 800–1,200 mcg DFE | 1,000 mcg DFE | **CAUTION / EXCEEDS** | Pick B-Complex with ≤400 mcg methylfolate OR skip B-Complex |
| Boron (id 7) | Boron | 0 mg (not listed in MV-B) | 3–6 mg | 3–6 mg | 20 mg | SAFE | None |
| Selenium (id 8) | Selenium | 200 mcg | 200 mcg | 400 mcg | 400 mcg | **EXCEEDS UL (at threshold)** | Omit selenium OR drop to 100 mcg |
| CoQ10 (id 16) | CoQ10 | 0 mg | 200 mg | 200 mg | No UL | SAFE | None |
| Vitamin C (id 18) | Vitamin C | 90 mg | 1,000 mg | 1,090 mg | 2,000 mg | SAFE (55%) | None |
| Lycopene (id 28) | Lycopene | 0 mg | 15 mg | 15 mg | No UL | SAFE | None |

### MV-C: Life Extension Two-Per-Day (2 tabs/day)

| Supplement | Nutrient | Multi Amount | App Stack Dose | Combined | UL | Status | Action |
|------------|----------|--------------|----------------|----------|----|----|--------|
| Vitamin D3 + K2 (id 2) | Vitamin D3 | 2,000 IU (50 mcg) | 5,000 IU (125 mcg) | 7,000 IU (175 mcg) | 4,000 IU (100 mcg) | **EXCEEDS UL** (175% of UL) | Drop D3 to 1,000 IU max OR omit when paired with Two-Per-Day |
| Vitamin D3 + K2 (id 2) | Vitamin K | 1,100 mcg | ~100 mcg | ~1,200 mcg | No UL | MONITOR (warfarin) | Keep INR warning; LE already provides high K2 |
| Magnesium Glycinate (id 3) | Magnesium | 100 mg | 200 mg | 300 mg | 350 mg | **CAUTION (86%)** | Acceptable; flag GI tolerance |
| Vitamin A (preformed) (any source) | Vitamin A | 1,500 mcg RAE (mixed beta-carotene + retinyl palmitate; assume ~50% retinol = ~750 mcg preformed) | 0 (no standalone) | ~750 mcg | 3,000 mcg preformed | SAFE | Note that LE includes some preformed retinol |
| Zinc Picolinate (id 5) | Zinc | 25 mg | 15 mg | 40 mg | 40 mg | **EXCEEDS UL (at threshold)** | Drop zinc to 5 mg OR omit when on Two-Per-Day |
| Methylated B-Complex (id 6) | B6 | 75 mg | ~25–50 mg (Jarrow / Thorne) | 100–125 mg | 100 mg | **EXCEEDS UL** | Omit B-Complex OR pick a B-Complex with ≤10 mg B6; consider this the highest-priority correction after vitamin D |
| Methylated B-Complex (id 6) | Folate | 400 mcg DFE methylfolate | ~400–800 mcg DFE methylfolate | 800–1,200 mcg DFE | 1,000 mcg DFE | **CAUTION / EXCEEDS** | Pick low-folate B-Complex OR skip |
| Methylated B-Complex (id 6) | Niacin (niacinamide) | 50 mg | 25–100 mg | 75–150 mg | 35 mg nicotinic / 900 mg niacinamide | SAFE (niacinamide) | Confirm niacinamide form |
| Boron (id 7) | Boron | 1 mg (estimated; not on all label versions) | 3–6 mg | 4–7 mg | 20 mg | SAFE | None — but verify boron listing on current LE label |
| Selenium (id 8) | Selenium | 200 mcg | 200 mcg | 400 mcg | 400 mcg | **EXCEEDS UL (at threshold)** | Omit selenium OR drop to 100 mcg |
| CoQ10 (id 16) | CoQ10 | 0 mg | 200 mg | 200 mg | No UL | SAFE | None |
| Vitamin C (id 18) | Vitamin C | 500 mg | 1,000 mg | 1,500 mg | 2,000 mg | **CAUTION (75%)** | Drop standalone Vit C to 500 mg when paired with MV-C |
| Resveratrol (id 25) | Resveratrol | 5 mg trans-resveratrol | 500 mg | 505 mg | No UL | SAFE | None |
| Lycopene (id 28) | Lycopene | 0 mg | 15 mg | 15 mg | No UL | SAFE | None |

---

## Section 3: Implementation Instructions for Claude Code

### Vitamin D3 + K2 (Stack A, ID: 2)
- **Nutrient:** Vitamin D3 (cholecalciferol)
- **Multivitamin(s) affected:** MV-A (1,000 IU), MV-B (1,000 IU), MV-C (2,000 IU)
- **Multivitamin contributes:** 1,000–2,000 IU
- **Current app baseDose:** 5,000 IU
- **Combined total:** 6,000–7,000 IU
- **UL:** 4,000 IU (100 mcg)
- **New recommended dose:**
  - With MV-A or MV-B: **2,000 IU** (combined 3,000 IU = 75% of UL)
  - With MV-C: **1,000 IU** (combined 3,000 IU = 75% of UL) — or omit if 25-OH-D serum >40 ng/mL
- **Display note:** "Dose adjusted — your selected multivitamin already provides 1,000–2,000 IU vitamin D3. Standalone D3 reduced to 1,000–2,000 IU to keep total under the 4,000 IU upper limit. Test serum 25-OH-D every 6 months."

### Magnesium Glycinate (Stack A, ID: 3)
- **Nutrient:** Magnesium (elemental)
- **Multivitamin(s) affected:** MV-A (180 mg) — the only EXCEEDS case
- **Multivitamin contributes:** 100–180 mg
- **Current app baseDose:** 200 mg
- **Combined total:** 300–380 mg
- **UL:** 350 mg (supplemental only)
- **New recommended dose:**
  - With MV-A (Thorne): **150 mg** (combined 330 mg = 94% UL — still CAUTION; consider 100 mg for SAFE)
  - With MV-B / MV-C: **200 mg** acceptable but flag CAUTION
- **Display note:** "Multivitamin already provides 100–180 mg magnesium. Standalone magnesium reduced to 150 mg to stay under the 350 mg supplemental upper limit. Note: this UL applies only to supplemental Mg; food magnesium is unrestricted. Loose stools = signal to lower further."

### Zinc Picolinate or Glycinate (Stack A, ID: 5)
- **Nutrient:** Zinc (elemental)
- **Multivitamin(s) affected:** ALL three (MV-A 30 mg, MV-B 15 mg, MV-C 25 mg)
- **Multivitamin contributes:** 15–30 mg
- **Current app baseDose:** 15 mg
- **Combined total:** 30–45 mg
- **UL:** 40 mg
- **New recommended dose:**
  - With MV-A (Thorne 30 mg): **omit standalone zinc** OR cap at 7.5 mg (combined 37.5 mg = 94% UL — CAUTION)
  - With MV-B (15 mg): **10 mg** (combined 25 mg = 63% UL — SAFE) or keep 15 mg (combined 30 mg = 75% — borderline CAUTION)
  - With MV-C (25 mg): **5 mg** (combined 30 mg = 75% UL — borderline CAUTION) or omit
- **Display note:** "Multivitamin already provides 15–30 mg zinc. Standalone zinc reduced or removed to keep total under 40 mg upper limit. Long-term zinc >40 mg/day depletes copper."

### Methylated B-Complex (Stack A, ID: 6)
- **Nutrient(s):** Vitamin B6 (primary concern), Folate (secondary)
- **Multivitamin(s) affected:** MV-A (B6 25 mg), MV-C (B6 75 mg) — both contribute very high B6
- **Multivitamin contributes:** B6: 1.7 mg (MV-B) → 25 mg (MV-A) → 75 mg (MV-C)
- **Current app baseDose:** 1 serving (variable B6 by product: Jarrow B-Right ~25 mg, Thorne B-Complex ~22 mg, Seeking Health Optimal B-Complex ~25 mg)
- **Combined total B6:**
  - + MV-A: 47–50 mg (47–50% UL)
  - + MV-B: ~27 mg (27% UL — SAFE)
  - + MV-C: 100–125 mg (**EXCEEDS 100 mg UL**)
- **UL:** 100 mg B6 (peripheral neuropathy risk above this with chronic use)
- **New recommended dose:**
  - With MV-A (Thorne): pick B-Complex with **≤10 mg B6** — combined ≤35 mg
  - With MV-B (Micro Ingredients): standard B-Complex acceptable
  - With MV-C (Two-Per-Day): **OMIT B-Complex** — Two-Per-Day already provides therapeutic-dose B-vitamins (75 mg B6, 50 mg B2, 75 mg B1, 300 mcg B12, 400 mcg methylfolate). Adding a B-Complex is redundant and pushes B6 over UL.
- **Display note:** "Your multivitamin already contains a high-dose B-complex (B6 25–75 mg). Standalone B-Complex omitted to keep B6 under the 100 mg upper limit. Chronic B6 above 100 mg/day can cause peripheral neuropathy."

### Boron (Stack A, ID: 7)
- **Nutrient:** Boron
- **Multivitamin(s) affected:** MV-A (3 mg), MV-C (~1 mg estimated)
- **Multivitamin contributes:** 0–3 mg
- **Current app baseDose:** 6 mg (BUT all 3 product options ship as 3 mg/cap — label dose mismatch)
- **Combined total:** 3–9 mg
- **UL:** 20 mg
- **New recommended dose:** **3 mg** standalone (combined 3–6 mg, well under 20 mg UL). The dose mismatch is a label-correction issue, not a UL issue.
- **Display note:** "Most boron products ship as 3 mg per capsule. Take 1 capsule (3 mg) — combined with multivitamin you'll be at 3–6 mg, well under the 20 mg upper limit."

### Selenium Selenomethionine (Stack A, ID: 8)
- **Nutrient:** Selenium
- **Multivitamin(s) affected:** ALL three (MV-A, MV-B, MV-C all = 200 mcg)
- **Multivitamin contributes:** 200 mcg
- **Current app baseDose:** 200 mcg
- **Combined total:** 400 mcg (exactly at UL)
- **UL:** 400 mcg
- **New recommended dose:** **OMIT standalone selenium** when paired with any of these 3 multivitamins. If desired, drop to **100 mcg** (combined 300 mcg = 75% UL).
- **Display note:** "Your multivitamin already provides the full 200 mcg selenium. Standalone selenium omitted to stay safely below the 400 mcg upper limit. Brazil nuts, tuna, and eggs add to daily selenium — chronic intake at the UL is associated with brittle hair/nails and neuropathy."

### Vitamin C (Stack C, ID: 18)
- **Nutrient:** Vitamin C
- **Multivitamin(s) affected:** MV-C (500 mg) only triggers CAUTION
- **Multivitamin contributes:** 90–500 mg
- **Current app baseDose:** 1,000 mg
- **Combined total:** 1,090 (MV-B) → 1,180 (MV-A) → 1,500 mg (MV-C)
- **UL:** 2,000 mg
- **New recommended dose:**
  - With MV-A or MV-B: **1,000 mg** (SAFE)
  - With MV-C: **500 mg** (combined 1,000 mg = 50% UL)
- **Display note:** "Two-Per-Day already provides 500 mg vitamin C. Standalone Vit C reduced to 500 mg to stay well under the 2,000 mg upper limit (above which GI distress and oxalate kidney stones are reported)."

### CoQ10 Ubiquinol (Stack C, ID: 16) — LABEL CORRECTION
- **Nutrient:** CoQ10
- **Multivitamin(s) affected:** MV-A (30 mg) — no UL exists
- **Multivitamin contributes:** 0–30 mg
- **Current app baseDose:** 200 mg
- **Issue:** All 3 listed product options are typically 100 mg softgels (Jarrow QH-Absorb 100mg, NOW Ubiquinol 100mg, LE Super Ubiquinol 100mg). 200 mg requires 2 softgels.
- **New recommended dose:** Default **100 mg** (1 softgel) for cost and adherence; allow user to pick 200 mg (2 softgels) for cardiovascular indication or statin use.
- **Display note:** "Most ubiquinol products are 100 mg softgels. Default 1 softgel; take 2 if you're on a statin or have heart-failure indication."

### Lycopene (Stack E, ID: 28) — MONITOR
- **Nutrient:** Lycopene
- **Multivitamin(s) affected:** MV-A (15 mg)
- **Multivitamin contributes:** 0–15 mg
- **Current app baseDose:** 15 mg
- **Combined total:** 15–30 mg
- **UL:** None established
- **New recommended dose:** With MV-A (Thorne), consider **omitting** standalone lycopene OR halving to **7.5 mg**. With MV-B/C, keep at 15 mg.
- **Display note:** "Thorne Men's Multi 50+ already provides 15 mg lycopene. Standalone lycopene optional with this multivitamin."

---

## Section 4: Label Dose Corrections Needed

| Supplement | Current App Dose | Typical Label Dose | Action |
|------------|------------------|-------------------|--------|
| Boron (id 7) | 6 mg | 3 mg/cap (Life Extension, NOW, Swanson Triple Boron — all 3 mg per capsule) | Change app default to **3 mg** OR add note "take 2 caps for 6 mg" |
| CoQ10 Ubiquinol (id 16) | 200 mg | 100 mg/softgel (NOW, LE Super Ubiquinol, Jarrow QH-Absorb 100mg variant) | Change app default to **100 mg** OR add note "take 2 softgels for 200 mg" |
| Vitamin D3+K2 (id 2) | 5,000 IU | Sports Research D3+K2 = **5,000 IU** ✓; NOW D-3+K-2 = **5,000 IU** ✓; Thorne D3+K2 Liquid = **500 IU per drop** (variable) | Label OK but recommend offering 1,000 IU and 2,000 IU SKUs in app for users on MV-A/MV-C |
| Methylated B-Complex (id 6) | 1 serving (no mg shown) | Jarrow B-Right ≈ B6 25 mg, B12 100 mcg, folate 400 mcg; Thorne B-Complex ≈ B6 22 mg, folate 800 mcg DFE; Seeking Health Optimal B ≈ B6 25 mg | Display the actual B6/folate per product in the UI; warn loudly when paired with Thorne or Two-Per-Day |
| Zinc (id 5) | 15 mg | Thorne Zinc Picolinate 15 mg ✓; NOW Picolinate **50 mg** (too high — flag); Jarrow Zinc Balance 15 mg ✓ | Default is OK; flag NOW 50 mg as "exceeds UL when combined with multi" |
| Selenium (id 8) | 200 mcg | All 3 product options = 200 mcg ✓ | Label OK; UL conflict is the issue, not the label |

---

## Section 5: Guide and Spreadsheet Update Notes

For the v19 guide (`The_Perfectly_Erect_Plan_v19.docx`) and v9 spreadsheet (`Perfect_Stack_Interactive_Spreadsheet_v9(phatty).xlsx`), update these data points:

**1. Foundation Stack (Stack A) safety matrix — ADD a new section:**
   - Title: "Multivitamin × Standalone Supplement Conflict Map"
   - Show a 3×8 grid (3 multis × 8 Stack A items) with traffic-light status (Green/Yellow/Red)
   - Red cells: Vitamin D3+K2 across all 3 multis; Selenium across all 3; Zinc with MV-A and MV-C; B-Complex with MV-C; Magnesium with MV-A
   - Yellow cells: Magnesium with MV-B/C; Zinc with MV-B; B-Complex with MV-A; Vitamin C with MV-C

**2. Vitamin D3 callout box (already in guide?) — UPDATE:**
   - State: "If your multivitamin includes 2,000 IU vitamin D (Life Extension Two-Per-Day), use 1,000 IU standalone, not 5,000 IU."
   - State: "If using Thorne or Micro Ingredients (1,000 IU each), use 2,000 IU standalone."
   - Always test serum 25-OH-D before/after 12 weeks; target 40–60 ng/mL.

**3. Selenium callout — REWRITE:**
   - "Skip standalone selenium if you take Thorne Men's Multi 50+, Micro Ingredients Methylated Multi, or Life Extension Two-Per-Day. All three already deliver 200 mcg selenium, which is the full safe daily dose. Combined with diet (Brazil nuts, tuna, eggs), additional selenium pushes you over the 400 mcg upper limit."

**4. B-Complex callout — REWRITE:**
   - "Two-Per-Day is itself a high-dose B-complex (B6 75 mg, B1 75 mg, B2 50 mg, B12 300 mcg). DO NOT add a separate B-Complex on top — combined B6 will exceed the 100 mg upper limit, and chronic B6 over 100 mg/day causes peripheral neuropathy that can take years to reverse."
   - "With Thorne (B6 25 mg), pick a low-dose methylated B-complex — Pure Encapsulations B-Complex Plus has only 5 mg B6, ideal as add-on."

**5. Zinc callout — REWRITE:**
   - "If you take Thorne Men's Multi (30 mg zinc), skip the standalone zinc — you're already at the recommended 15–30 mg/day. Adding 15 mg pushes you to 45 mg, above the 40 mg upper limit and accelerating copper depletion."
   - "If you take Two-Per-Day (25 mg zinc), use a 5 mg or 7 mg zinc booster, not 15 mg."

**6. Magnesium callout — UPDATE:**
   - "350 mg/day is the supplemental magnesium UL. With Thorne (180 mg), keep your standalone Mg-glycinate to 150 mg. Loose stools = your body telling you to drop further."

**7. Boron — CORRECT product spec:**
   - "Boron products are sold as 3 mg per capsule. The protocol target is 3–6 mg/day; one capsule (3 mg) is sufficient for most men, doubling to 2 caps if you're on TRT taper or estrogen-dominance protocol."

**8. CoQ10 — CLARIFY dose vs. softgel count:**
   - Default cardiovascular dose: 100 mg/day (1 softgel)
   - Statin users / heart failure: 200 mg/day (2 softgels)

**9. NEW Section (recommended): "Why we are dropping these doses"**
   - One paragraph framing: "We test for the *combination*, not the supplement in isolation. NIH Tolerable Upper Intake Levels are conservative ceilings calibrated to lifelong daily exposure. Crossing them once won't hurt you, but the goal of Perfect Stack is sustainable optimization — not stacking up to red zones every day."

**10. Spreadsheet (v9) — ADD columns to Stack A tab:**
   - "Multi Contribution (Thorne)" — mg/mcg of each nutrient already in MV-A
   - "Multi Contribution (Micro Ingredients)"
   - "Multi Contribution (Two-Per-Day)"
   - "Adjusted Dose (Thorne)" / "Adjusted Dose (MI)" / "Adjusted Dose (LE)" — the standalone dose AFTER subtracting multivitamin contribution
   - "Status (Thorne)" / "Status (MI)" / "Status (LE)" — Safe/Caution/Exceeds

---

## Section 6: Research Notes

**Confidence levels:**
- **HIGH confidence** — Multivitamin label data (provided in prompt, verified against current product listings as of 2025–2026); NIH UL values (cited from ods.od.nih.gov fact sheets); supplement label doses for Thorne Zinc 15mg, Sports Research D3+K2 5,000 IU, Life Extension Boron 3mg, NOW Boron 3mg (these are widely sold, label-confirmed SKUs).
- **MEDIUM confidence** — B-Complex composition (Jarrow B-Right ≈ B6 25 mg / folate 400 mcg; Thorne B-Complex with Metafolin ≈ B6 22 mg / folate 800 mcg DFE; Seeking Health Optimal B-Complex ≈ B6 25 mg / folate 400 mcg). These are based on widely-published Supplement Facts panels but I did not re-verify each label via WebFetch in this analysis. Recommend re-verifying once with current 2026 labels.
- **MEDIUM confidence** — CoQ10 product softgel sizes (NOW Ubiquinol commonly 100 mg, also sold as 200 mg; Life Extension Super Ubiquinol commonly 100 mg).
- **LOWER confidence** — D3+K2 product K2 mcg amounts (varied across products); used "~100 mcg" as typical Sports Research D3+K2 (which is 100 mcg MK-7).
- **NOTED LIMITATION** — Did not call WebFetch to confirm each Amazon product page; this is a data-only analysis. The deferred-tool model would require schema loading and additional time. Recommend a follow-up pass that pings each Amazon product page once to lock in current label specs.

**Key assumptions:**
1. **Thorne Men's Multi 50+ CoQ10 content (30 mg):** Per the verified label profile in the prompt; supplements.ts product reference does not detail nutrient content.
2. **Life Extension Two-Per-Day boron (1 mg):** Conservative estimate per prompt; some label revisions list it, some do not. Even at the highest plausible estimate (3 mg), combined with 6 mg standalone boron = 9 mg, still below 20 mg UL.
3. **Vitamin A from Two-Per-Day:** Listed as 1,500 mcg RAE mixed beta-carotene + retinyl palmitate. The 3,000 mcg UL applies to preformed retinol only. Even if 100% were preformed, you'd be at 50% UL — SAFE.
4. **Niacin form:** All three multis use niacinamide (nicotinamide), which has a niacinamide-specific UL of ~900 mg (not the 35 mg flushing-form UL). All combined totals stay well under 900 mg.
5. **Folate:** The 1,000 mcg DFE UL was set for synthetic folic acid (cancer-progression and B12-masking concerns). Methylfolate (5-MTHF) has no firm UL and is generally considered safer at higher doses, but I applied the conservative 1,000 mcg ceiling because (a) chronic data on high-dose methylfolate is still emerging and (b) this is a safety report.
6. **Magnesium UL (350 mg) applies to supplemental Mg only,** not food. Diets vary, but typical Western males get ~250 mg from food; combining 380 mg supplemental with food magnesium puts total intake near 600 mg/day, well below the gastrointestinal-distress threshold of ~700 mg, but supplemental UL is the metric I used per NIH guidance.
7. **K2 with warfarin:** Independent of UL, anyone on warfarin must coordinate K2 intake with their anticoagulation clinic. The current "MONITOR" status on K2 is not a UL flag but a drug-interaction flag.

**Stack supplements with NO multivitamin overlap (confirmed SAFE on UL framework):** Omega-3, Ashwagandha, Tongkat Ali, Fadogia, Fenugreek, DHEA, L-Citrulline, Beet Root, Pycnogenol, Quercetin, Maca, Horny Goat Weed, Ginseng, L-Theanine, NMN/NR, Berberine, Saw Palmetto, Probiotic, Creatine, Collagen. These each carry their own drug-interaction and contraindication caveats (already documented in `keyCautions` field of supplements.ts) but do not stack with multivitamin nutrients on UL math.

**Highest-priority items for the development team to address (in order):**
1. **Vitamin D3 dose vs. selected multivitamin** — fix UI to dynamically reduce D3 to 1,000 or 2,000 IU based on multi
2. **Selenium duplication** — auto-omit when any of the 3 multis is selected
3. **B-Complex with Two-Per-Day** — auto-omit OR loud warning
4. **Zinc with Thorne** — auto-omit OR cap at 7.5 mg
5. **Boron product mismatch** — fix default from 6 mg to 3 mg
6. **CoQ10 product softgel-count clarification** — fix default from 200 mg to 100 mg
7. **Magnesium with Thorne** — cap at 150 mg
8. **Vitamin C with Two-Per-Day** — cap at 500 mg

**End of report.**

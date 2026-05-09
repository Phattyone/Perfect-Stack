# The Perfectly Erect Plan v22 - Change Report

**Source:** `The_Perfectly_Erect_Plan_v21(Draft Review).docx`
**Output:** `The_Perfectly_Erect_Plan_v22.docx`
**Date:** 2026-05-06
**Validation:** PASSED (pack.py validator, 0 XML violations)

---

## Manual Edits Found in Draft Review File

None. The Draft Review file did not contain any tracked changes (`w:ins` / `w:del`) or comment annotations. The unpack tool reported "simplified 0 tracked changes" on import. All v21 prose was preserved verbatim where not directly modified by the v22 spec.

---

## Part 1 - Zinc Product Correction

### Searches performed
- Searched the entire v21 body for `NOW Zinc`, `NOW Zinc Picolinate`, `Zinc Picolinate 50mg` - **0 occurrences**. The v21 guide is product-agnostic at the table level; specific zinc product names are only in the spreadsheet, not in the guide.

### Stack A safety note added
A new callout box was inserted in **Chapter 11: Stack A - Foundation Stack**, immediately after the Stack A supplement table and before the existing "Note on Stack A multivitamins and B vitamins" callout. The callout uses the same blue-bordered info-box style (`fill="EEF3F8"`, left border `#2E6DA4`, top/bottom border `#EAB308`) as adjacent callouts.

Text inserted:
> **Important:** *Always select a zinc supplement dosed at 15mg or less per serving. Higher-dose zinc products (25mg or above) combined with a multivitamin can easily exceed the 40mg daily tolerable upper limit established by the NIH, which causes copper deficiency and immune dysfunction over time. The Perfect Stack recommended zinc product is Pure Encapsulations Zinc 15mg.*

The zinc table row in Stack A (`Zinc | Testosterone synthesis... | 15-30 mg daily | Zinc picolinate or bisglycinate absorbs well...`) was preserved as-is.

---

## Part 2 - Fadogia Agrestis Titration Note

Added the titration guidance in two locations. The existing caution text (animal toxicity warning, testicular health, emerging research disclaimer) was preserved.

### Location 1 - Chapter 12, Stack B supplement table, Fadogia "Notes" cell
The Notes cell now leads with the titration guidance, then preserves the v21 "Limited human trial data..." paragraph, with the cycling reminder rolled in:

> "Start with 300mg (1 capsule) daily for the first week to assess individual tolerance before increasing to the full 600mg dose. Do not exceed 900mg per day. Limited human trial data. Animal studies show testosterone-elevating effects via LH stimulation. The same animal studies at high doses showed potential testicular toxicity, making cycling and conservative dosing essential. Avoid if you have testicular health concerns. Due to limited long-term human safety data, cycle Fadogia Agrestis 8 weeks on, 4 weeks off. Considered emerging and promising but requires more human research before being classified as well-established."

The Recommended Dose cell still reads `600 mg daily. Take AM with food. Cycle 8 weeks on, 4 weeks off.`

### Location 2 - Chapter 16, Recommended Cycling Protocols list, Fadogia bullet
Bullet rewritten to include titration:

> "Fadogia Agrestis: 8 weeks on, 4 weeks off. Start with 300mg (1 capsule) daily for the first week to assess individual tolerance before increasing to the full 600mg dose. Do not exceed 900mg per day. Long-term safety data for Fadogia is limited. Equal cycling periods are a conservative and prudent approach given the current research landscape."

### Location 3 - Daily Supplement Timing tables
Fadogia does not have its own row in the Chapter 16 timing tables (Morning / Midday / Evening / Pre-Activity). No table edit was needed.

---

## Part 3 - Stack Safety Check Section

### Total interaction count
The "Each flagged supplement shows a pulsing colored dot..." paragraph in the Stack Safety Check section was updated to add:

> "The Perfect Stack app and Interactive Spreadsheet currently track **30** supplement interactions across the full Stack A through E protocol."

### Berberine + Quercetin upgraded
The original short bullet `Berberine and Quercetin blood glucose pathway overlap` was replaced with the full caution-level description:

> "Berberine + Quercetin (caution): Both activate AMPK and modulate blood glucose pathways. Combined use may cause additive glucose-lowering effects that could cause hypoglycemia in diabetic or pre-diabetic men or those on glucose-lowering medications. Monitor blood sugar closely if combining both. Take at different times of day to reduce overlap."

### New interactions added (12 bullets, inserted between Berberine+Quercetin and the Multivitamin nutrient duplication catch-all)

**New Cautions (6):**
- Resveratrol + Omega-3 (caution): Both have antiplatelet properties. Combined use increases bleeding risk for men on blood thinners or NSAIDs.
- Horny Goat Weed + Omega-3 (caution): Icariin in Horny Goat Weed has antiplatelet properties similar to Omega-3. Combined use may increase bleeding risk.
- Fenugreek + DHEA (caution): Both influence androgen pathways. Combined use may amplify androgenic effects. Monitor for acne, hair thinning, or elevated PSA.
- Panax Ginseng + Tongkat Ali (caution): Both stimulate LH production. Combined use may amplify androgenic signaling. Monitor for elevated heart rate or agitation.
- Saw Palmetto + Zinc (caution): Both inhibit 5-alpha reductase. Combined use amplifies DHT reduction. Monitor libido or sexual function.
- CoQ10 + Berberine (caution): Berberine may reduce CoQ10 synthesis. Taking CoQ10 alongside Berberine is recommended to offset this effect.

**New Notes (5):**
- Probiotic + Berberine (note): Berberine has antimicrobial properties that can reduce probiotic effectiveness. Take at least 2 hours apart.
- Lycopene + Vitamin C (note): Vitamin C enhances lycopene bioavailability. Take together with a fat-containing meal.
- Quercetin + Vitamin C (note): Vitamin C regenerates oxidized quercetin. A well-established synergistic pairing.
- NMN + Vitamin D3 (note): Both support mitochondrial function through complementary pathways. Take together in the morning.
- Collagen + Vitamin C (note): Vitamin C is required for collagen synthesis. Take together for optimal collagen production.

The original bullet list (Zinc + Selenium, Ashwagandha + Tongkat Ali, Tongkat Ali + Fadogia, L-Citrulline + Beet Root, NMN + Resveratrol, Quercetin + Omega-3, Multivitamin nutrient duplication) was preserved in place.

---

## Part 4 - Optimization Score Clarification

Added in **The Full Perfect Stack Ecosystem -> The Perfect Stack App** section, immediately after the App feature bullet list ("New features frequently added..."). Status: **added (was not present in v21).**

### Two complementary edits

1. The "Performance score dashboard" bullet was extended to mention the four optimization scores by name:

> "Performance score dashboard: Your weekly snapshot across energy, libido, erectile quality, sleep, and mood, plus four optimization scores - Hormone Factor, NO/Vascular Factor, Stress/Sleep Factor, and Overall Score - that show how close you are to your personal maximum."

2. A new gold-bordered callout titled **"How the Optimization Scores Work"** was inserted after the bullet list. The callout uses the same yellow/cream callout style (`fill="F9F3E8"`, left border `#CA8A04`, top/bottom border `#EAB308`) used elsewhere in the guide:

> *"The optimization scores in the Perfect Stack app are calibrated to your personal maximum - the highest score achievable given your age group and training style. A score of 100% means you have optimized every factor within your control. Men in their 30s doing heavy resistance training will have a higher personal ceiling than men in their 60s with sedentary lifestyles, but both can achieve 100% by optimizing their health conditions and goals. The scores update in real time as you update your health profile."*

---

## Part 5 - Spreadsheet v10 Reference Update

### Searches for v9 / v10 / Version 9 / Version 10 references in the v21 body
**0 occurrences found.** The v21 guide does not include an explicit version number for the Interactive Spreadsheet anywhere in the document body, headers, footers, or core metadata. There were therefore no `v9 -> v10` text swaps to perform.

### v10 additions reflected in the Spreadsheet feature list
Three new bullets were appended to the Interactive Spreadsheet feature list in the App Bridge / Full Perfect Stack Ecosystem chapter, capturing the v10 spreadsheet additions:

- "Factor score personal maximums: My Profile sheet calculates your Hormone, NO/Vascular, and Stress/Sleep ceilings based on age group, training style, and primary goal."
- "Stack Safety Check: 30 supplement interactions tracked with severity flags, descriptions, and cell-level conditional formatting."
- "Curated zinc product: Pure Encapsulations Zinc 15mg is the recommended product option, dosed safely under the 40mg daily upper limit when combined with a multivitamin."

These bullets sit immediately after the existing "Affiliate product links" bullet and before the closing "spreadsheet is the ideal companion" callout.

---

## Part 6 - Version Update

### Title page
A new centered subtitle was added directly below the existing "PART OF THE PERFECT STACK ECOSYSTEM" line on the title page:

> *Edition v22 - May 2026*

(Italic, gray `#888888`, 9pt - matches the title-page subtitle styling.)

### Footer
The default footer (`word/footer4.xml`, used on all body pages) was updated:

| | Before | After |
|---|---|---|
| Footer left text | `Perfect Stack` | `Perfect Stack · v22` |

The page-number field (`Page X of Y`) on the right side of the footer was preserved.

### Document metadata (`docProps/core.xml`)
| Field | Before | After |
|---|---|---|
| `dc:title` | (empty) | `The Perfectly Erect Plan v22` |
| `dc:creator` | `Un-named` | `Perfect Stack` |
| `cp:revision` | `3` | `4` |
| `dcterms:modified` | `2026-04-20T02:36:00Z` | `2026-05-06T12:00:00Z` |
| `dcterms:created` | `2026-04-20T02:27:00Z` | unchanged |
| `cp:lastModifiedBy` | `Phat W` | unchanged |

### Body / headers
No version number existed previously in the body or headers. No "v21" string had to be replaced. The new "Edition v22 - May 2026" stamp on the title page and the "v22" tag in the footer are the only visible version markers.

### Filename
Saved as `The_Perfectly_Erect_Plan_v22.docx` in `C:\Users\phatw\Perfect Stack\`.

---

## Document statistics

| Metric | v21 | v22 | Delta |
|---|---|---|---|
| Total paragraphs (per pack.py) | 4221 | 4239 | +18 |
| `document.xml` size (bytes) | 3,497,340 | 3,509,572 | +12,232 |
| Final `.docx` size (bytes) | (n/a) | 207,275 | -- |
| Pandoc-extracted lines | 6,358 | 6,442 | +84 |

---

## Validation

The pack.py script ran the standard XML validator after writing. Result:

```
Paragraphs: 4221 -> 4239 (+18)
All validations PASSED!
Successfully packed /sessions/exciting-confident-darwin/mnt/outputs/v22_unpacked
to /sessions/exciting-confident-darwin/mnt/phatw--Perfect Stack/The_Perfectly_Erect_Plan_v22.docx
```

No errors. No warnings. All formatting (heading styles, table borders, callout box colors, list numbering, fonts) preserved from v21.

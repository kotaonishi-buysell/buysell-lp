# Implementation scope

このデザインシステムは `/home-value` LP専用です。他のLPにはそれぞれ独立した仕様書を用意し、この仕様を自動適用しません。Downsizingの仕様は `docs/design/downsizing/DESIGN_SYSTEM.md` にあります。

実装は `src/styles/home-value.css` と `src/components/home-value/` の専用部品に限定します。既存LPのCSS基盤・フォーム・ダミー情報は読み込みません。

文言・事業情報・フォーム要件・セクション順は `docs/requirements/home-value.en.md` を優先します。この仕様のCTA例やカテゴリー例、3段階の流れは見た目の参考であり、要件の電話主体の導線、10カテゴリー、4段階の流れ、7セクション構成を上書きしません。仮素材は明示したオリジナルイラストを使用し、承認済み写真に差し替えます。

以下は参照会話「デザインシステム作成」のMarkdown仕様を保存したものです。元のロゴ画像からの色の再測定は未実施です。初期実装は指定されたフォールバックフォントを使用します。DM Sans、写真、正式なロゴは公開前に用意してください。

---

# BuySell America Website Design System

## 0. Purpose

This document is the source of truth for the BuySell America Home Value LP design only.

When implementing or modifying UI, follow this design system unless explicitly instructed otherwise.

Reference inspiration:
- Pestie: https://pestie.com/

Important:
- Do NOT copy Pestie's website directly.
- Use its friendly, bold, approachable, consumer-focused visual language as inspiration.
- The final website should feel unique to BuySell America.
- The BuySell America brand green must be used as the primary brand color.

---

# 1. Brand Direction

## Core Concept

**Friendly Discovery**

The website should make users feel:

- "I can casually ask about the things in my home."
- "Maybe something I was going to throw away has value."
- "I don't need to know exactly what I own."
- "I can decide whether to sell after hearing the appraisal."

The service should feel approachable and trustworthy rather than luxury-focused or aggressive.

## Brand Personality

The visual design should combine:

- Friendly
- Simple
- Bold
- Warm
- Trustworthy
- Calm
- Respectful
- Slightly playful

### Inspiration balance

Think:

**Pestie friendliness**
+
**modern American consumer brand**
+
**BuySell professional trust**

Avoid looking like:

- luxury auction house
- pawn shop
- junk removal company
- financial services company
- generic SaaS landing page

---

# 2. Design Principles

## 2.1 Friendly before luxurious

The website may feature watches, jewelry, designer bags, etc., but should not feel exclusive.

Users should feel comfortable asking:

> "I'm not sure if this is worth anything. Can you take a look?"

---

## 2.2 Large, simple messaging

Prefer:

- short headlines
- large typography
- simple layouts
- large photography
- clear CTA buttons

Avoid long paragraphs above the fold.

---

## 2.3 Use color blocks

Sections and cards should use soft background colors to create visual rhythm.

Do not build the entire website using white cards with gray borders.

---

## 2.4 Lifestyle first

Whenever possible, show items inside normal homes.

Preferred imagery:

- shelves
- closets
- drawers
- dining rooms
- living rooms
- collections
- everyday storage

Avoid excessive studio photography of isolated luxury products.

---

## 2.5 Make uncertainty feel okay

The interface and copy should communicate:

- Users do not need to know the product name.
- Users do not need to know the value.
- Users can show multiple item categories.
- Users do not have to sell everything.

---

# 3. Color System

## Primary

### Brand Green

HEX:

`#01472F`

Usage:

- primary CTA
- headings
- footer
- important icons
- selected UI states
- large dark-green sections

This color comes from the BuySell America logo and must remain the main brand color.

---

## Neutral Background

### Warm Cream

`#FFF8EC`

Primary page background.

Use this instead of pure white for many large sections.

---

## Secondary Colors

### Soft Green / Mint

`#D9E8E0`

Use for:

- information cards
- How It Works
- light branded areas

### Butter Yellow

`#F4C95D`

Use for:

- small highlights
- badges
- icon backgrounds
- occasional CTA variation

### Soft Peach

`#F3A66A`

Use sparingly for:

- highlights
- illustrations
- accent elements

### Soft Pink

`#F3D6CF`

Use for:

- lifestyle cards
- category backgrounds

### Powder Blue

`#E8F1F8`

Use for:

- FAQ
- information sections
- secondary cards

---

## Text

### Charcoal

`#20231F`

Default body text.

### White

`#FFFFFF`

Use on dark green backgrounds.

---

# 4. CSS Design Tokens

Use CSS variables whenever possible.

```css
:root {
  /* Brand */
  --color-brand: #01472F;
  --color-brand-dark: #003B28;

  /* Background */
  --color-cream: #FFF8EC;
  --color-white: #FFFFFF;

  /* Accent */
  --color-mint: #D9E8E0;
  --color-yellow: #F4C95D;
  --color-peach: #F3A66A;
  --color-pink: #F3D6CF;
  --color-blue: #E8F1F8;

  /* Text */
  --color-text: #20231F;
  --color-text-muted: #62665F;

  /* Border */
  --color-border: rgba(32, 35, 31, 0.12);

  /* Radius */
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-xl: 36px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-card: 0 6px 20px rgba(0, 0, 0, 0.06);

  /* Layout */
  --container-width: 1200px;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 64px;
  --space-2xl: 96px;
  --space-3xl: 128px;
}
```

---

# 5. Typography

Preferred font:

**DM Sans**

Fallback:

```css
font-family:
  "DM Sans",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

## Font Weights

Body:
- 400
- 500

Headings:
- 700
- 800

Avoid thin font weights.

---

## Desktop Typography

### Hero H1

```css
font-size: clamp(56px, 6vw, 76px);
font-weight: 800;
line-height: 0.98;
letter-spacing: -0.04em;
```

### H2

```css
font-size: clamp(42px, 4vw, 56px);
font-weight: 750;
line-height: 1.05;
letter-spacing: -0.03em;
```

### H3

```css
font-size: 28px;
font-weight: 700;
line-height: 1.15;
```

### Large Body

```css
font-size: 20px;
line-height: 1.55;
```

### Body

```css
font-size: 17px;
line-height: 1.6;
```

---

# 6. Layout

## Main Container

Maximum width:

`1200px`

Desktop horizontal padding:

`32px`

Tablet:

`24px`

Mobile:

`20px`

---

## Section Spacing

Desktop:

`96px–128px`

Mobile:

`64px–80px`

Sections should feel spacious.

Avoid tightly stacked sections.

---

# 7. Buttons

## Primary CTA

Use:

- Brand Green background
- White text
- Large pill shape
- Strong typography

Example:

```css
.btn-primary {
  background: #01472F;
  color: white;

  min-height: 60px;

  padding: 0 28px;

  border: none;
  border-radius: 999px;

  font-size: 17px;
  font-weight: 700;
}
```

Recommended CTA text:

**Book an in-home appraisal**

Alternative:

**See what your items may be worth**

---

## Hover

Primary CTA hover should be subtle.

Example:

```css
background: #003B28;
transform: translateY(-1px);
```

Do not use exaggerated animations.

---

## CTA on Green Background

Use:

- Cream background
- Green text

or

- Yellow background
- Green text

---

# 8. Cards

Cards should feel soft and approachable.

## Style

Preferred:

- border-radius: 24px–32px
- colored backgrounds
- minimal borders
- minimal shadow
- generous padding

Example:

```css
.card {
  border-radius: 28px;
  padding: 32px;
  background: #FFFFFF;
}
```

Avoid:

- heavy shadows
- 1px gray borders everywhere
- small square cards
- SaaS dashboard aesthetics

---

# 9. Photography

Photography is a major part of the brand.

## Preferred

Show:

- bags
- jewelry
- watches
- tableware
- collectibles
- home objects

inside realistic homes.

Preferred environments:

- shelves
- dining table
- closets
- storage spaces
- drawers
- living room

Lighting:

- natural
- warm
- soft

People should feel natural rather than posed.

---

## Avoid

Avoid:

- black luxury backgrounds
- dramatic watch closeups everywhere
- overly polished luxury studio photography
- cluttered junk-removal imagery
- depressing before/after cleanup imagery

---

# 10. Category Cards

Create visual category cards for items the company may appraise.

Suggested categories:

- Jewelry
- Watches
- Designer Bags
- Precious Metals
- Tableware
- Collectibles

Card structure:

1. Large photograph
2. Category name
3. Optional one-line supporting copy

Example:

**Watches**

> Old, new, or unsure? Show us.

Cards can use different soft background colors.

Suggested rotation:

- Mint
- Yellow
- Pink
- Blue
- Peach

Do not use all cards with identical white backgrounds.

---

# 11. Icons

Icons should be:

- simple
- friendly
- slightly bold
- rounded

Recommended stroke:

`2.5px–3px`

Possible icon themes:

- house
- bag
- jewelry
- magnifying glass
- check
- phone
- vehicle
- calendar

Avoid extremely thin technical icons.

---

# 12. Hero Section

Recommended structure:

LEFT:

Eyebrow / optional small label

Main H1:

**Before you clear it out,<br />
see what it might be worth.**

Supporting text:

Explain that users can show multiple items during an in-home appraisal and decide what to sell after learning their value.

Primary CTA:

**Book an in-home appraisal**

Optional trust message:

**No obligation to sell everything.**

RIGHT:

Lifestyle photography showing multiple item categories inside a home.

Possible floating badge:

**Not sure what it is? That's okay.**

Hero background:

`#FFF8EC`

---

# 13. Section: Relatable Situations

Purpose:

Help visitors recognize items in their own homes.

Suggested headline:

**Things you haven't used in years?<br />
You're not alone.**

Three visual cards:

### Bought years ago

Items purchased in the past but rarely used.

### Received as a gift

Nice objects that never found a place in everyday life.

### Used to collect

Old hobby or collection items stored away.

Possible section background:

Brand Green.

If using dark green:

- white text
- bright photography
- soft-colored cards

---

# 14. Section: What We Can Look At

Use a visual grid of category cards.

Headline idea:

**Start with what you already have at home.**

Use approximately 6 category cards.

This should be one of the most colorful sections on the page.

---

# 15. Section: Appraise First, Decide Later

This is an important trust-building section.

Main message:

**Find out what it's worth.<br />
Then decide what stays and what goes.**

Three-step flow:

### 1. We take a look

Show us the items you'd like to ask about.

### 2. We explain the value

We explain the appraisal and available offer.

### 3. You decide

You choose what, if anything, you want to sell.

Visually emphasize:

**You decide.**

This is one of the most important messages on the website.

---

# 16. Consultation Examples

Instead of traditional testimonials, show realistic customer situations.

Example:

> “I have a few bags, some old tableware,
> and jewelry I don't really use anymore.”

Purpose:

Visitors should think:

**"I can ask them something this casually."**

Use:

- lifestyle photography
- large quote text
- colored cards

---

# 17. How It Works

Keep this section extremely simple.

## Step 1

**Tell us what you have**

## Step 2

**We visit your home**

## Step 3

**You decide what to sell**

Each step should contain:

- large step number
- image or illustration
- short headline
- maximum 2–3 lines of copy

Do not over-explain.

---

# 18. FAQ

Recommended background:

`#E8F1F8`

Use accordion UI.

Border radius:

`20px–24px`

Suggested questions:

- What if I don't know what my items are worth?
- Can I show you different types of items at the same time?
- Do I have to sell everything you appraise?
- What if the items are old?
- What if I don't know the brand or product name?
- Is there a fee for the appraisal?
- What areas do you serve?

Keep answers concise and reassuring.

---

# 19. Final CTA

Use a full-width dark green section.

Background:

`#01472F`

Headline:

**Before you throw it away,<br />
find out what it's worth.**

Supporting text should remain short.

CTA:

**Book an in-home appraisal**

CTA color:

Cream or yellow.

This section should visually feel like the conclusion of the page.

---

# 20. Navigation

Navigation should be minimal.

Suggested:

- What We Buy
- How It Works
- FAQ
- About Us

Primary CTA on right:

**Book an Appraisal**

Header should not feel corporate.

Prefer:

- transparent / cream background
- spacious layout
- large logo
- pill CTA

---

# 21. Responsive Design

The website must be mobile-first friendly.

On mobile:

- Stack Hero content vertically.
- Place copy before image.
- Category cards must use a 2-column grid on mobile (two items per row), and a 3-column grid from 1024px.
- Below 720px, category cards use 12px gaps/padding, 20px corners, and 16–20px labels so all ten fit comfortably in five rows.
- Keep the mobile brand and request button on the same header row; navigation sits on a separate row.
- Reduce nested FAQ/form padding on mobile and let date/time fields shrink to the available width.
- Complex layouts should become single-column.
- Maintain large CTA touch areas.
- Minimum button height: 52px.
- Minimum horizontal page padding: 20px.

Hero headline mobile target:

`42px–48px`

H2 mobile:

`34px–40px`

---

# 22. Animation

Animations should feel friendly but not flashy.

Allowed:

- subtle image reveal
- fade + slight vertical movement
- card hover elevation
- button hover
- gentle badge movement

Typical duration:

`180ms–400ms`

Avoid:

- aggressive parallax
- constant bouncing
- complex scroll effects
- excessive motion

---

# 23. Accessibility

Maintain sufficient contrast.

Brand Green:

`#01472F`

works well with white text.

Do not place low-contrast text on pastel backgrounds.

Body text should remain:

`#20231F`

or similarly dark.

Interactive elements must have clear:

- hover
- focus
- active states

Use semantic HTML.

---

# 24. Copy Style

Copy should sound:

- conversational
- reassuring
- simple
- respectful

Avoid language such as:

- "Get top dollar!"
- "Instant cash!"
- "We buy everything!"
- "Guaranteed highest price!"
- "Turn your junk into cash!"

Preferred style:

**Not sure what it's worth? That's okay.**

**Show us what you have.**

**Find out the value before deciding what to do with it.**

**You decide what you want to sell.**

---

# 25. Important Service Communication Rules

Do NOT imply:

- everything will be purchased
- every item has monetary value
- every appraisal leads to an offer
- the company provides general junk removal
- the company will remove unrelated household waste
- high prices are guaranteed

Clearly distinguish:

**appraisal / resale service**

from:

**junk removal / home cleanout service**

---

# 26. UI Dos and Don'ts

## DO

- Use large typography.
- Use warm cream backgrounds.
- Use the BuySell green prominently.
- Mix pastel-colored sections/cards.
- Use realistic lifestyle photography.
- Use rounded cards.
- Keep copy short.
- Make CTAs visually obvious.
- Emphasize ease and choice.
- Make the service feel accessible.

## DON'T

- Make the whole site dark green.
- Use black + gold luxury styling.
- Make it look like a pawn shop.
- Make it look like a junk removal company.
- Use corporate stock photography everywhere.
- Use excessive borders.
- Use small typography.
- Overload sections with text.
- Copy Pestie layouts exactly.

---

# 27. Brand Color Distribution

Approximate visual balance:

- Cream / White: 50%
- Brand Green: 25%
- Accent Colors: 25%

Brand Green should anchor the experience.

Pastel colors create friendliness and visual rhythm.

---

# 28. Overall Visual Test

Before approving any page or component, ask:

1. Does this feel approachable to a 40–60 year-old homeowner?
2. Does it look trustworthy enough to invite someone into the home?
3. Does it make it clear that users can ask about multiple items?
4. Does it avoid looking like a junk-removal company?
5. Does it avoid looking too luxury-focused?
6. Does it communicate that the customer can decide after the appraisal?
7. Does it feel visually simple and friendly?
8. Is the BuySell America green clearly part of the identity?

If the answer to several of these is "no", revise the design.

---

# 29. Codex Implementation Rule

When implementing UI:

1. Reuse the design tokens defined in this document.
2. Avoid introducing arbitrary colors.
3. Avoid introducing arbitrary border radii.
4. Prefer reusable components over one-off styling.
5. Maintain consistent spacing.
6. Maintain the photography and copy direction described above.
7. Treat mobile behavior as part of the initial implementation.
8. Do not copy Pestie assets, code, illustrations, or exact layouts.
9. Use Pestie only as visual inspiration.
10. Treat this document as the design source of truth.

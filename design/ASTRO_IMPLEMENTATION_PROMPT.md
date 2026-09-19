# Implementation Prompt — Roll out the complyTech design system across the Astro site

> Paste everything below this line into a fresh Claude Code session opened **in the Astro repo root**.
> Attach or copy `Main.dc.html` into the repo first (suggested: `design/Main.dc.html`) so the agent can read it.

---

## 0. Role and objective

You are implementing a finished visual design system into an existing production **Astro** site. The design was produced in a visual design tool and exported as a single standalone artboard. Your job is to turn that one-off mockup into a real, reusable, token-driven design system in the Astro codebase, rebuild the homepage on it, and then migrate **every** existing page and component onto it so the site is visually and structurally consistent end to end.

This is a full-site rollout, not a homepage experiment. When you are done, there should be no page left rendering the old styling.

**Critical context:** this site sells ADA / WCAG 2.2 accessibility auditing. The site itself must be exemplary — WCAG 2.2 Level AA conformant, keyboard operable, screen-reader sane. A contrast failure or a broken focus ring on this site is a credibility failure, not just a bug. Section 10 lists defects that exist *in the mockup itself* which you must fix rather than reproduce.

---

## 1. Source of truth

**File:** `design/Main.dc.html` (the artboard). Read it in full before writing any code.

Treat it as a **reference mockup, not production code.** Specifically:

- The authoritative values — colors, font sizes, line heights, letter spacing, spacing, radii, shadows, grid ratios — live in its inline `style="…"` attributes and the `<helmet><style>` block. Replicate those values faithfully.
- **Do not** copy the markup or inline styles wholesale into `.astro` files. Every value becomes a token or a component style. Zero inline `style` attributes in the shipped code except for genuinely dynamic values (e.g. a progress bar width driven by a prop).
- Ignore `support.js` and `vendor/react*.js` entirely. They are the mockup's rendering runtime and are not part of the design. Do not add React to the project.
- Ignore the `<x-dc>` wrapper, the `<script type="text/x-dc">` block, and the `{{accent}}` template syntax as *mechanisms* — but see §4 for how `accent` maps into the token system.
- The artboard is fixed at `width:1440px` and is **desktop-only**. It defines no responsive behavior. §9 tells you how to derive it. Do not ship a 1440px fixed-width site.

---

## 2. Non-negotiable constraints

1. **Astro-idiomatic.** `.astro` components with scoped `<style>` blocks. Keep the site zero-JS by default — no framework island unless a component genuinely cannot work without one. (Nothing in this design does: the FAQ is native `<details>`.)
2. **No new UI dependency.** Do not introduce Tailwind, a component library, or a CSS-in-JS runtime if the repo does not already use one. If the repo *already* uses Tailwind or a CSS framework, adapt: express the tokens in that system's config and keep the component API described in §6, and say so in your Phase 0 report.
3. **No visual regressions elsewhere.** Migration is per-page and verifiable. Do not delete an old stylesheet until nothing references it.
4. **Semantic HTML first.** `<header>`, `<nav>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`, `<figure>`/`<figcaption>`, `<blockquote>`, `<details>`/`<summary>`. The mockup already gets most of this right — preserve it.
5. **Content is not yours to invent.** Where the mockup contains placeholder or unverified content, follow §11. Do not silently ship placeholder text, and do not fabricate statistics, client names, or certifications.
6. **Small, reviewable commits**, one per phase or per migrated page.

---

## 3. Phase 0 — Recon (do this first, report before changing anything)

Explore the repo and report back a short written summary covering:

- Astro version, integrations in `astro.config.*`, package manager, Node version.
- Whether Tailwind / UnoCSS / Sass / CSS Modules / vanilla CSS is in use, and where global styles currently live.
- The full page inventory: every route under `src/pages/` (including dynamic routes and content collections), so the §8 rollout has a concrete checklist.
- The existing component inventory under `src/components/` and layouts under `src/layouts/` — which are reusable, which are one-off, which are dead.
- How fonts are currently loaded, and whether any of the design's fonts are already present.
- Existing color/spacing variables, if any, and whether they are referenced widely enough to be worth aliasing rather than replacing.
- Any existing test / lint / build commands, and whether the build currently passes.
- Whether the site has analytics, CMS content, or forms whose markup you must not break.

Then propose a concrete phase-by-phase plan with the page-migration order, and **wait for approval before Phase 1.**

---

## 4. Phase 1 — The token layer

Create `src/styles/tokens.css` (imported once from the base layout) defining every value below as a CSS custom property on `:root`. Name them exactly as given so later phases are unambiguous.

### 4.1 Color

The mockup exposes `accent` as a themeable prop with default `#1c3a2a` and alternates `#144a3a`, `#2a4d1a`, `#3a2a5a`. Model this as a single `--color-accent` custom property so the whole site can be re-themed from one declaration. Everywhere the mockup writes `{{accent}}`, emit `var(--color-accent)`.

**Brand / accent**
| Token | Value | Used for |
|---|---|---|
| `--color-accent` | `#1c3a2a` | Logo mark bg, logo "Tech" text, primary buttons, eyebrow labels, the hero h1 italic line |
| `--color-accent-ink` | `#1c3a2a` | Icon/text on mint tints, "Explore" link text, "100%" figure |
| `--color-accent-deep` | `#12281c` | Hero audit card bg, CTA panel bg |
| `--color-accent-darker` | `#14251c` | Stats panel bg, all heading text |
| `--color-accent-hover` | `#12281c` | Link hover (from the helmet `a:hover`) |

**Surfaces**
| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#faf8f3` | Page background; also text on dark panels |
| `--color-surface` | `#ffffff` | Service cards, coverage card, FAQ items |
| `--color-surface-muted` | `#f2f1ee` | Progress-bar track, neutral badge bg |
| `--color-surface-mint` | `#e8f0ea` | Hero pill, icon tiles, "MOST POPULAR" badge, process section panel |
| `--color-surface-amber` | `#fbeedd` | "28 issues found" chip, "HEALTHCARE" badge |
| `--color-track` | `#e8e7e2` | Unfilled arc of the score ring |

**Text**
| Token | Value | Used for |
|---|---|---|
| `--color-ink` | `#14251c` | All headings, strong emphasis, stat values in lists |
| `--color-body` | `#3c443e` | Default body text, nav links, issue-list rows |
| `--color-body-strong` | `#4a524b` | Hero paragraph, hero trust-badge row |
| `--color-muted` | `#5a615a` | Card body copy, footer links, figcaption |
| `--color-muted-2` | `#6b726b` | Section decks, source note, micro-labels, footer copy |
| `--color-on-dark` | `#faf8f3` | Text on dark panels |
| `--color-on-dark-mint` | `#c9e8d4` | "WCAG 2.2 AA" chip text, the underlined `.u-link` |
| `--color-on-dark-sage` | `#a9c4b3` | Stat captions, CTA deck copy |

**Status / data**
| Token | Value | Used for |
|---|---|---|
| `--color-critical` | `#b42318` | Severity dots for critical issues |
| `--color-warn` | `#b4530a` | Severity dots for serious issues, "30–40%" figure, star rating fill |
| `--color-warn-ink` | `#8a3f08` | Text on amber tint |
| `--color-warn-bar` | `#e39a52` | Automated-tools progress fill — **see §10.2, this value must change** |
| `--color-warn-on-dark` | `#f3b878` | The highlighted "30–40%" stat on the dark panel |
| `--color-score-ring` | `#b4530a` | Filled arc of the 72-score conic gradient |

**Borders / overlays** (all derived from the ink color at low alpha)
| Token | Value |
|---|---|
| `--border-subtle` | `rgba(20, 37, 28, 0.08)` — header bottom, hairline dividers |
| `--border-card` | `rgba(20, 37, 28, 0.09)` — card and FAQ borders |
| `--border-footer` | `rgba(20, 37, 28, 0.10)` — footer top rule |
| `--border-button` | `rgba(20, 37, 28, 0.22)` — secondary button outline |
| `--border-on-dark` | `rgba(250, 248, 243, 0.30)` — outline button on dark |
| `--border-stat-rule` | `rgba(201, 232, 212, 0.30)` — 2px left rule on stat items |
| `--surface-on-dark-chip` | `rgba(250, 248, 243, 0.12)` — chip bg on dark |

### 4.2 Typography

| Token | Value |
|---|---|
| `--font-display` | `'Fraunces', Georgia, 'Times New Roman', serif` |
| `--font-body` | `'Public Sans', system-ui, -apple-system, 'Segoe UI', sans-serif` |

Weights in use — Fraunces: 400, 500, 600, 700. Public Sans: 400, 500, 600, 700.

**Display scale** (Fraunces; all headings use `--color-ink` unless on a dark panel)
| Token | Size / line-height / tracking / weight | Where |
|---|---|---|
| `--type-h1` | 58px / 1.08 / -0.02em / 600 | Hero headline |
| — h1 emphasis line | same size, weight **500**, `font-style: italic`, color `--color-accent`, `display:block` | "We find and fix every one." |
| `--type-h2` | 40px / -0.02em / 600 | Section headings (Services, Why) |
| `--type-h2-cta` | 42px / 1.15 / -0.02em / 600 | CTA panel heading, `max-width: 720px`, centered |
| `--type-h2-sm` | 36px / -0.02em / 600 | FAQ heading |
| `--type-h2-xs` | 34px / -0.02em / 600 | Process heading (centered) |
| `--type-quote` | 30px / 1.35 / -0.01em / 500 | Testimonial blockquote |
| `--type-h3` | 21px / 600 | Service card titles |
| `--type-h3-sm` | 19px / 600 | Process step titles |
| `--type-stat` | 40px / 1.0 / 600 | Stat panel figures |
| `--type-logo` | 22px / 600 / -0.01em | Wordmark (20px in footer) |

**Body scale** (Public Sans)
| Token | Size / line-height / weight | Where |
|---|---|---|
| `--type-lead` | 18px / 1.65 / 400 | Hero paragraph, `max-width: 520px` |
| `--type-lead-cta` | 17px / 1.6 / 400 | CTA deck, `max-width: 560px` |
| `--type-body` | 16px / 1.65 / 400 | Section decks, Why paragraph |
| `--type-body-list` | 15.5px / 400 | Checklist items |
| `--type-body-sm` | 15px / 500 | Nav links, button labels (sm), coverage row labels |
| `--type-card` | 14.5px / 1.6 / 400 | Card body copy |
| `--type-sm` | 14px / 500 | Trust badges, footer links, figcaption |
| `--type-xs` | 13px / 400 | Source note, footer legal, micro copy |
| `--type-issue-row` | 13.5px / 400 | Audit-card issue rows |

**Label / eyebrow scale**
| Token | Spec | Where |
|---|---|---|
| `--type-eyebrow` | 13px / 700 / `uppercase` / `letter-spacing: 0.12em` / `--color-accent` | "WHAT WE DO", "WHY COMPLYTECH", "FAQ" |
| `--type-label` | 13px / 700 / `uppercase` / `0.02em` | "DETECTION COVERAGE", footer column headings |
| `--type-pill` | 13px / 600 / `0.02em` | Hero certification pill |
| `--type-badge` | 11px / 700 / `0.03em` / `uppercase` | Card corner badges |
| `--type-chip` | 12px / 600 | "WCAG 2.2 AA", "28 issues found" |
| `--type-micro` | 9px / `0.04em` | "SCORE" under the ring |

### 4.3 Space, radius, shadow, layout

| Token | Value |
|---|---|
| `--layout-max` | `1200px` (1440 artboard − 2 × 120 gutter) |
| `--gutter` | `120px` at ≥1440, fluid below — see §9 |
| `--section-y` | `96px` (standard section vertical padding) |
| `--section-y-hero` | `80px` top / `96px` bottom |
| `--radius-panel` | `24px` (process panel, CTA panel) |
| `--radius-lg` | `20px` (stats panel, hero audit card, coverage card) |
| `--radius-card` | `18px` (service cards) |
| `--radius-md` | `16px` (process step cards) |
| `--radius-sm` | `14px` (FAQ items, inner white card of hero visual) |
| `--radius-tile` | `13px` (52px icon tiles) |
| `--radius-logo` | `10px` (38px nav logo mark) / `9px` (34px footer mark) |
| `--radius-btn` | `9px` (hero/CTA buttons) / `8px` (nav button) |
| `--radius-step` | `9px` (numbered step tile) |
| `--radius-chip` | `6px` (issues-found chip) |
| `--radius-pill` | `999px` |
| `--shadow-card-float` | `0 30px 60px rgba(18, 40, 28, 0.28)` (hero audit card) |
| `--shadow-card-soft` | `0 16px 40px rgba(20, 37, 28, 0.06)` (coverage card) |

**Grid ratios to preserve** (desktop):
- Hero: `minmax(0, 1.05fr) minmax(0, 0.95fr)`, gap `72px`, `align-items: center`
- Stats: `repeat(4, minmax(0, 1fr))`, gap `40px`, panel padding `44px 56px`
- Services: `repeat(3, minmax(0, 1fr))`, gap `24px`, top margin `44px`, card padding `30px`
- Why: `1fr 1fr`, gap `72px`, card padding `36px`
- Process: `repeat(3, minmax(0, 1fr))`, gap `28px`, panel padding `56px`, card padding `28px`
- FAQ: `minmax(0, 0.8fr) minmax(0, 1.2fr)`, gap `64px`, `align-items: start`, item gap `14px`, item padding `20px 24px`
- Footer: `1.4fr 1fr 1fr 1fr`, gap `40px`, padding `56px 120px 44px`
- CTA panel padding `64px`, centered

---

## 5. Phase 2 — Fonts

The mockup loads Fraunces and Public Sans from Google Fonts via a render-blocking `<link>`. **Do not ship that.** Self-host instead:

```
npm i @fontsource-variable/fraunces @fontsource-variable/public-sans
```

Import them once in the base layout. Requirements:

- `font-display: swap`.
- Preload only the weights actually used above the fold (Fraunces 600, Public Sans 400/500/600).
- Subset to `latin` unless the Phase 0 recon finds non-Latin content.
- Fraunces is an optical-size variable font (`opsz 9..144`). Set `font-optical-sizing: auto` so large display text renders with the intended high-contrast cut; verify the 58px hero headline visually matches the mockup.
- Define matched fallback metrics (`size-adjust` / `ascent-override`) or otherwise confirm CLS is ~0 on a cold load.

If self-hosting is rejected for some repo-specific reason, keep Google Fonts but add `<link rel="preconnect">` to both `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) and preload the CSS.

---

## 6. Phase 3 — Primitives and components

Build these as `.astro` components with scoped styles, each consuming tokens only. Every one needs a clear prop API and sensible defaults. Put shared primitives in `src/components/ui/` and page sections in `src/components/sections/`.

### Primitives
1. **`Button.astro`** — variants: `primary` (accent bg, `--color-bg` text, 15px/28px padding, radius 9), `secondary` (transparent, 1.5px `--border-button`, ink text, 15px/26px), `on-dark-solid` (`--color-bg` bg, `--color-accent-deep` text, weight 700, 15px/30px), `on-dark-outline` (transparent, 1.5px `--border-on-dark`, 15px/28px), `nav` (accent bg, 11px/20px, radius 8, 15px). Props: `href`, `variant`, `size`, optional leading/trailing icon slot, gap `9px` (8px at nav size). Must render as `<a>` when `href` is present, `<button>` otherwise. Needs hover, active, **and** `:focus-visible` states (§10.1).
2. **`Badge.astro`** — variants `mint` (`--color-surface-mint` / `--color-accent-ink`), `amber` (`--color-surface-amber` / `--color-warn-ink`), `neutral` (`--color-surface-muted` / `--color-body-strong`), `on-dark` (`--surface-on-dark-chip` / `--color-on-dark-mint`). Sizes: `badge` (11px, 5px/10px) and `chip` (12–13px). Radius `--radius-pill`, or `--radius-chip` for the square-ish issues chip.
3. **`Eyebrow.astro`** — the uppercase accent label.
4. **`SectionHeader.astro`** — eyebrow + h2 + optional right-aligned deck paragraph, supporting both the Services layout (`display:flex; align-items:flex-end; justify-content:space-between; gap:40px`, deck `max-width:360px`) and the stacked/centered variants.
5. **`Icon.astro`** — a single icon component. Every icon in the design is a 24×24 Lucide-style stroke icon (`fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round`) at varying sizes and stroke widths: `shield-check` (nav/footer logo, hero trust line), `shield` (hero pill), `arrow-right` (`stroke-width` 2.2 in buttons, 2.3 in card links), `check` (`stroke-width` 2.4), `search`, `hospital`, `book`, `alert-triangle` (2.4), `info` (2.0), `star` (filled `--color-warn`, no stroke), and the WhatsApp glyph (a filled brand path, `fill:currentColor` — keep it distinct from the stroke set). Default `aria-hidden="true"` and `focusable="false"`; allow an optional `title`/`label` prop for the rare meaningful case. Do not pull in a runtime icon library — inline the paths.
6. **`Card.astro`** — white surface, `--border-card`, configurable radius/padding; a `clickable` mode that renders the whole card as a link with the corner-badge slot positioned `top:24px; right:24px`.

### Section components
7. **`SiteHeader.astro`** — logo lockup (38px accent tile + wordmark where "Tech" is accent-colored), primary nav (`gap:30px`), right cluster (`margin-left:auto`, text link + CTA button), `padding:20px 120px`, bottom `--border-subtle`. Needs a real mobile pattern (§9) and a skip link (§10.1).
8. **`Hero.astro`** — pill, h1 with the italic accent second line, lead paragraph, dual CTA row (`gap:14px`, `margin-top:34px`), trust-badge row (`flex-wrap`, `gap:14px 26px`, `margin-top:30px`).
9. **`AuditReportCard.astro`** — the hero visual. Dark `--color-accent-deep` panel, `padding:26px`, `--shadow-card-float`; header row with title + on-dark chip; inner `--color-bg` card (`radius:14px; padding:20px`) containing the **score ring** (76px outer, `conic-gradient(var(--color-score-ring) 0 72%, var(--color-track) 72% 100%)`, 56px inner cutout showing the score and "SCORE" micro-label), the site meta block, the amber issues chip, a hairline divider (`margin:18px 0`), and the issue list (rows: severity dot 9px, label `flex-grow:1`, count bold ink, `gap:11px`); then a footer line with a mint shield icon. **Drive this entirely from props** — `score`, `domain`, `issueCount`, and an `issues[]` array of `{ label, count, severity }` — not hard-coded markup. See §10.3: severity must not be conveyed by color alone.
10. **`StatPanel.astro`** — dark `--color-accent-darker` panel, 4 items each with a 2px `--border-stat-rule` left rule and `padding-left:22px`; figure in Fraunces 40px, caption 14px `--color-on-dark-sage` with `margin-top:8px; line-height:1.5`. Accept a `highlight` flag per item for the `--color-warn-on-dark` treatment. See §11 — every figure needs a citation.
11. **`ServiceCard.astro`** — corner badge, 52px mint icon tile (`--radius-tile`), h3 (`margin:20px 0 8px`), body, and a bottom "Explore →" affordance (14px/600/`--color-accent-ink`, `margin-top:18px`).
12. **`CheckList.astro`** — `list-style:none`, `gap:14px`, each row a 20px check icon (`stroke-width:2.4`, `flex:none`, `margin-top:1px`) + 15.5px text, `gap:12px`.
13. **`CoverageCard.astro`** — label, then meter rows: label row (`space-between`, 15px/600, value colored) above a 16px `--radius-pill` track (`--color-surface-muted`) with a fill of the given width; source note below a hairline with an info icon. Props `{ label, value, percent, tone }`. Each meter must expose `role="meter"` (or an equivalent accessible label) with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` and visible text — not a bare styled `<div>`.
14. **`ProcessSteps.astro`** — mint `--color-surface-mint` panel with centered heading and three `--color-bg` cards, each with a 34px accent numbered tile (Fraunces 700/15px, `--color-bg` text).
15. **`Testimonial.astro`** — `<figure>` with a star row (`gap:3px`), Fraunces 30px blockquote, `<figcaption>`, `max-width:900px`. Star ratings need an accessible text equivalent (e.g. a visually-hidden "5 out of 5"). See §11 — the mockup's quote is an explicit placeholder.
16. **`Faq.astro`** — native `<details>`/`<summary>` accordion. The mockup sets `list-style:none` on the summary, which removes the disclosure triangle: you must supply a visible custom indicator (chevron that rotates on `[open]`), hide the native marker in all engines (`summary::-webkit-details-marker { display:none }` and `summary::marker { content:"" }`), and give `summary` a visible focus ring. First item `open` by default is fine. Accept a `faqs[]` prop; also emit valid `FAQPage` JSON-LD from the same data so the copy and the structured data cannot drift.
17. **`CtaPanel.astro`** — dark `--color-accent-deep` panel, `radius:24px`, `padding:64px`, centered heading/deck/buttons.
18. **`SiteFooter.astro`** — 4-column grid, footer logo lockup (34px mark, 20px wordmark), blurb (`max-width:280px`), three link columns with uppercase labels, then the bottom bar (`margin-top:40px`, `padding-top:24px`, top hairline, `space-between`, 13px `--color-muted-2`). Footer nav columns should sit in `<nav>` landmarks with accessible names.
19. **`BaseLayout.astro`** — html lang, `<meta charset>`, viewport, token + font imports, `body { margin:0; background: var(--color-bg); color: var(--color-body); font-family: var(--font-body) }`, a skip link, `<main>`, header/footer slots, and per-page SEO props (title, description, canonical, OG/Twitter).

Global link styles from the mockup's helmet: default link color `--color-accent`, hover `--color-accent-hover`, `text-decoration:none`; plus a `.u-link` utility (`--color-on-dark-mint`, underlined, `text-underline-offset:3px`, hover `--color-on-dark`) for links on dark panels. Underline removal is acceptable only where the link is unambiguously a button or a nav item — inline links inside body copy must stay underlined (see §10.1).

---

## 7. Phase 4 — Homepage

Assemble `src/pages/index.astro` from the section components, in the mockup's order:

`SiteHeader → Hero (+ AuditReportCard) → StatPanel → Services → Why/Coverage → ProcessSteps → Testimonial → Faq → CtaPanel → SiteFooter`

Section shells: `padding: var(--section-y) var(--gutter)`, content constrained to `--layout-max`. Note the mockup's exact deviations — the stats section has `padding: 0 120px` (it sits flush under the hero), Services is `96px 120px 20px`, and Process/Testimonial/FAQ/CTA are `0 120px 96px`. Preserve that rhythm rather than applying a uniform value everywhere.

Content should come from a data file or content collection (e.g. `src/content/home/`), not be hard-coded in the template, since §8 will reuse several of these sections on other pages.

Fix the anchor/ID wiring, which is broken in the mockup (§10.4).

---

## 8. Phase 5 — Full-site rollout

Using the page inventory from Phase 0, migrate every remaining route. For each page:

1. Swap it onto `BaseLayout.astro` with the new header and footer.
2. Replace bespoke markup with the §6 primitives wherever the page is doing something the design system already covers (cards, buttons, badges, headings, accordions, CTA panels).
3. Where a page needs a pattern the homepage doesn't have (pricing table, blog post body, contact form, 404), **extend the system** — derive the new pattern from existing tokens and add it to `src/components/ui/`. Do not invent new hex values, font sizes, or radii. If a genuinely new value is unavoidable, add it to `tokens.css` with a comment explaining why, and list it in your final report.
4. Re-check the page against the §12 checklist before moving on.
5. Commit per page.

Long-form content pages (blog posts, the "What is ADA compliance?" guide, legal pages) need a prose style block: Fraunces for headings using the display scale, Public Sans 16–18px/1.65 body, `--color-body` text, `max-width` around 68–72ch, underlined inline links in `--color-accent`, and styled lists, blockquotes, tables, and code blocks built from the same tokens.

After every page is migrated: delete the orphaned stylesheets, components, and assets; confirm with a repo-wide search that nothing references them; and confirm the build still passes.

---

## 9. Responsive behavior (you must design this — the mockup does not)

The artboard is a fixed 1440px desktop board. Derive a mobile-first implementation:

- **Container:** `width: 100%; max-width: var(--layout-max); margin-inline: auto;` with fluid gutters — roughly `20px` under 480px, `32px` to 768px, `48px` to 1024px, `80px` to 1280px, `120px` at 1440+. Use `clamp()` rather than a stack of media queries where it reads cleanly.
- **Type:** fluid-scale the display sizes with `clamp()` so the 58px h1 lands around 34–38px on a 375px screen, 40px h2s around 28px, the 42px CTA heading around 30px, and the 30px blockquote around 22px. Body sizes stay fixed. Never go below 16px for body copy. Keep the tracking and line-height ratios from §4.2 at every size.
- **Grid collapse points:** hero 2-col → 1-col at `<1024px` (audit card moves below the copy, and consider capping its width so it doesn't dominate); stats 4-up → 2-up at `<900px` → 1-up at `<560px` (keep the left rules); services 3-up → 2-up at `<1024px` → 1-up at `<680px`; why 2-col → 1-col at `<960px`; process 3-up → 1-up at `<820px`; FAQ 2-col → 1-col at `<900px`; footer 4-col → 2-col at `<820px` → 1-col at `<520px`, with the bottom bar stacking and left-aligning.
- **Panel padding** scales down proportionally (CTA `64px → 32px`, process `56px → 28px`, stats `44px/56px → 28px/24px`).
- **Header:** the desktop nav must become a real mobile pattern below ~900px. Prefer a `<details>`-based or checkbox-based disclosure so it stays zero-JS; if you use JS, it must be a tiny inline script, keyboard operable, `aria-expanded` wired up, focus trapped or not at your discretion but Escape must close it, and the toggle must have an accessible name.
- **Buttons:** the hero's side-by-side CTA pair stacks full-width on narrow screens. Every interactive target must be at least 44×44px effective (WCAG 2.2 SC 2.5.8 requires 24×24 minimum — meet 44 anyway).
- Verify no horizontal scroll at 320px, and verify the layout at 200% browser zoom and at 400% zoom / 320px reflow (SC 1.4.10).
- Respect `prefers-reduced-motion` for any transition you add. Keep motion minimal — the design has none.

**Dark mode:** the design defines no dark theme. Do not invent one unless the repo already ships one; if it does, flag it in Phase 0 and we will spec the dark palette separately.

---

## 10. Accessibility — requirements and mockup defects to fix

The site must conform to **WCAG 2.2 Level AA**. The following are defects *in the mockup* — fix them, do not faithfully reproduce them.

### 10.1 Missing throughout — add
- **Focus indicators.** The mockup defines none. Add a consistent, clearly visible `:focus-visible` treatment on every link, button, summary, and details toggle — e.g. a 2–3px outline in `--color-accent` with a 2px offset, plus a light-colored ring variant for dark panels so it remains visible there. Never `outline: none` without a replacement. Must satisfy SC 2.4.11/2.4.13 (focus not obscured, adequate focus appearance).
- **Skip link** to `#main`, visually hidden until focused.
- **Underlined inline links.** The helmet sets `a { text-decoration: none }` globally. In body copy — e.g. the FAQ's "Message us on WhatsApp" link — removing the underline leaves color as the only distinguishing cue, failing SC 1.4.1. Underline inline links inside prose.
- **`<summary>` marker.** `list-style:none` strips the disclosure triangle with no replacement; add a custom rotating chevron (see §6.16).
- **Visible page `<h1>`** on every page, exactly one, with a correct descending heading order. The homepage is fine; verify each migrated page.
- **Accessible names** for the header/footer `<nav>` landmarks (the mockup labels the primary nav correctly — do the same for the footer columns).
- **`lang` attribute** on `<html>`, set per page if any content is non-English.
- **Reduced-motion** handling for anything you animate.

### 10.2 Confirmed contrast failure — must change
The "Automated tools" meter fill `#e39a52` sits on the `#f2f1ee` track at roughly **2.1:1**, below the **3:1** minimum for non-text contrast (SC 1.4.11). The bar's length is the information, so it is a meaningful graphic, not decoration. Darken the fill (something around `#b4530a`, which measures ~4.7:1 against the page background, is a safe starting point and is already in the palette) or darken/outline the track — then re-measure and report the number. Keep the visual distinction from the dark-green "Manual expert audit" bar.

Also re-measure, and report actual ratios for, every text/background pair you ship. Two to watch: `--color-muted-2` (`#6b726b`) on `--color-bg` measures ~4.66:1 — it passes AA for normal text but has no margin, so do not use it at any size below 16px where it might be re-tinted, and never for anything that must reach AAA. The star rating `#b4530a` on cream is fine at ~4.7:1.

### 10.3 Color-only meaning
The audit card's issue list encodes severity purely as a red vs amber dot (SC 1.4.1). Add a text or shape cue — a visible severity word, differing icon shapes, or at minimum a visually-hidden "Critical"/"Serious" label per row so screen-reader users get the same information.

The score ring is a decorative rendering of a number that is already shown as text — that part is fine. Give the ring `aria-hidden="true"` so the number isn't announced twice, and make sure the "72" and "SCORE" text are the accessible source of truth.

### 10.4 Broken anchors and mislabeled sections
- `#scan` is linked twice (header "Free scan", CTA "Run a free scan") but **no element with `id="scan"` exists**. Either build the scan section/page or repoint both links.
- The nav's "Industries" link points at `#industries`, but that ID is attached to the **Process** section ("From scan to certified in three steps"). Either rename the nav item to "Process" / "How it works", or build a real Industries section and give the process section its own ID.
- "How it works" in the hero points at `#why`, which is the "Why complyTech" section — arguably wrong; it more naturally belongs on the process section. Resolve the information architecture deliberately rather than copying the mockup's wiring.
- Several footer links are `href="#"` dead ends (Compliance checklist, WCAG 2.1 vs 2.2, About, Testimonials, Privacy policy). Point each at a real route or remove it. A privacy policy link in particular should not be a dead `#`.

### 10.5 Verification
Run, and report results from: `axe` (or Pa11y / Lighthouse a11y) on every route; keyboard-only traversal of the homepage and one representative migrated page; and at least a smoke test with a real screen reader (NVDA or VoiceOver) on the nav, the FAQ accordion, and the audit card. Automated tools catch roughly a third of issues — which this site's own copy says, so do not treat a clean axe run as done.

---

## 11. Content integrity

The mockup contains content that must not ship as-is:

- **The testimonial is an explicit placeholder** — it literally contains `[PLACEHOLDER — replace with a real client quote.]`, `[Client Name]`, `[Title], [Company]`. Do not ship it. Either wire the component to a real, permissioned client quote, or leave the section out of the page until one exists. Never fabricate a client, a name, or a review.
- **The five-star rating** is decorative in the mockup. Only show a rating that reflects real collected reviews.
- **The statistics** — "4,000+ ADA federal lawsuits in 2024", "$75K average settlement", "30–40% caught by automated tools", "82% of targets are small businesses", "automated tools miss 60–70%" — are presented as fact. The coverage card cites Deque Systems for the automated-detection figure; the others are uncited. Before shipping, get a source for each from the site owner and add a visible citation or footnote. For a company selling legal-risk compliance, an unsourced legal statistic is a liability. Flag any you cannot source and ask rather than guessing.
- **"IAAP-Certified Accessibility Specialists"** appears in the hero pill and footer. Confirm the certification is current before publishing it.
- **Sample audit data** in the hero card (`example-clinic.com`, score 72, 28 issues) is illustrative. Keep it obviously illustrative, or label it as a sample — do not imply it is a real client's audit.
- Preserve the copy's typographic details: curly quotes, en dashes in ranges (`5–14`, `30–40%`, `60–70%`), and the non-breaking space in `WCAG 2.2`.
- The footer reads "© 2026 complyTech" — make the year dynamic.

---

## 12. Definition of done

Per component and per page:

- [ ] Renders pixel-faithfully against the mockup at 1440px — spot-check headline sizes, panel paddings, radii, and the two shadows side by side with the artboard.
- [ ] Zero inline `style` attributes except genuinely dynamic values.
- [ ] Zero hard-coded hex values, font sizes, radii, or shadows outside `tokens.css`.
- [ ] Reflows correctly at 1280 / 1024 / 768 / 480 / 375 / 320px with no horizontal scroll.
- [ ] Readable and operable at 200% zoom and at 400% zoom / 320px reflow.
- [ ] Full keyboard traversal works; focus is always visible and never trapped or obscured.
- [ ] axe reports zero violations.
- [ ] Every text pair meets 4.5:1 (3:1 for large text); every meaningful graphic meets 3:1 — with measured numbers reported, not assumed.
- [ ] No placeholder content, no dead `href="#"`, no anchor pointing at a nonexistent ID.
- [ ] `astro build` passes; `astro check` (or the repo's type/lint commands) passes.
- [ ] Lighthouse: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO ≥ 95 on the homepage. CLS ~0 on a cold load with fonts.

---

## 13. Deliverables

1. `src/styles/tokens.css` — the complete token layer.
2. `src/components/ui/*` — primitives.
3. `src/components/sections/*` — section components.
4. `src/layouts/BaseLayout.astro`.
5. A rebuilt homepage plus every other route migrated.
6. `docs/design-system.md` — a short usage guide: the token tables, each component's props with an example, the responsive breakpoint map, the accessibility rules that must hold, and the rule that new patterns must be composed from existing tokens.
7. A final report listing: every deviation you made from the mockup and why, every new token you had to add, every measured contrast ratio, every unresolved content question from §11, and anything you found in the existing repo that you deliberately left alone.

---

## 14. Do not

- Do not copy the mockup's inline styles into production components.
- Do not import `support.js`, the vendored React files, or anything else from the design export into the app.
- Do not ship a fixed-width desktop-only layout.
- Do not add Tailwind, a component library, or a client-side framework the repo doesn't already use.
- Do not reproduce the mockup's accessibility defects listed in §10 out of fidelity to the design — fidelity to the *values*, correction of the *defects*.
- Do not ship the placeholder testimonial, fabricate client quotes, or invent sources for the statistics.
- Do not delete existing styles or components until you have verified nothing references them.
- Do not start Phase 1 before the Phase 0 recon is reported and approved.

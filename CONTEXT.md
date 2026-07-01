# SouthPay Website — Project Context

Static marketing website for SouthPay, deployed on Vercel. Three products (Commerce, Ledger, Invoice), 14 industry pages, pricing, about, legal. Pure static HTML + CSS + a small JS snippet — no framework, no build step, no `npm install`.

---

## Live URLs

- **Production alias**: https://southpay-eta.vercel.app
- **Custom domain**: https://southpay.io (Vercel project)

## Deploy

Every deploy is a single command from the repo root:

```
vercel deploy --prod --yes --scope albertodgc-8647s-projects
```

- `--scope` is required — the Vercel account has multiple teams.
- `vercel.json` sets `cleanUrls: true` (strips `.html`) and `trailingSlash: false`.
- Preview deploys work the same way without `--prod`.

---

## Brand

- **Name**: **SouthPay** — always one word, PascalCase.
- **Company**: SouthPay is a brand of **ALC Media** (`https://alc.media/`).
- **Product names never translated**: `Commerce`, `Ledger`, `Invoice` — English in every locale, on every page, including logo slots and titles.
- **In Portuguese**, treat *SouthPay* as feminine (`a SouthPay`, `da SouthPay`, `na SouthPay`) but the full product names as masculine (`o SouthPay Ledger`).

## Voice & tone

- Direct, no jargon, informal `tu` in Spanish and Portuguese (never `usted` or `você`).
- **No em dashes (`—`)** anywhere on the site. Use two hyphens or restructure the sentence.
- **No `<br>`** inside `<h1>` / `<h2>`. Let the CSS clamp handle line breaks.
- **External links** always open in a new tab: `target="_blank" rel="noopener"` — enforced site-wide.
- Product-family callouts use "SouthPay Commerce", "SouthPay Ledger", "SouthPay Invoice" — never lowercase, never localized.

## Products & pricing

| Product   | What it is                                | Price                                                 |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| Commerce  | Crypto checkout for stores                | 1.99% flat / transaction. Custom for high volume.     |
| Ledger    | Double-entry API for fintechs             | Starter $97/mo · Growth $497/mo · Enterprise custom.  |
| Invoice   | Get paid in crypto, settle in cash / EUR  | 1.99% flat / paid invoice. Custom for high volume.    |

Prices are USD in EN. In PT (currently hidden) prices render as EUR (`€97/mês`, `€497/mês`).

---

## Site structure

```
/                                    → index.html (homepage)
/commerce, /ledger, /invoice         → product pages
/pricing                             → unified pricing page (single 3-col table)
/about
/industries                          → hub
/industries/{slug}                   → 14 industry landing pages
/privacy-policy, /terms-and-conditions, /aml-policy, /merchant-services-agreement
/es/*                                → Spanish mirror (hidden, redirected to EN)
/pt/*                                → European Portuguese mirror (hidden, redirected to EN)
/assets/img/                         → images, coin icons, phone mockup, OG image
/southpay.css                        → one CSS file for the entire site
/vercel.json                         → routing, redirects, cache headers
/sitemap.xml, /robots.txt
```

---

## Design system

Everything lives in **`southpay.css`** as CSS custom properties.

### Colors

| Token                    | Value       | Use                                    |
| ------------------------ | ----------- | -------------------------------------- |
| `--brand`                | `#374bec`   | Primary CTA, links, brand accents      |
| `--brand-deep`           | `#2934d0`   | CTA hover                              |
| `--brand-glow`           | rgba brand  | CTA drop-shadow                        |
| `--mint`                 | `#2ecc8b`   | Success, "balanced", "posted" badges   |
| `--accent-pink`          | (see CSS)   | Warm accents in gradients              |
| `--ink`                  | `#0e1726`   | Main text                              |
| `--ink-soft`             | `~#4a5568`  | Secondary text                         |
| `--ink-mute`             | `~#6b7280`  | Muted meta text, footer                |
| `--line`                 | `#e6e8f0`   | Card borders                           |
| `--line-soft`            | lighter     | Row dividers                           |
| `--bg-lavender`          | `#eef1fb`   | Light backdrop tint                    |
| `--bg-lavender-soft`     | `#f4f6fc`   | Softer backdrop tint                   |
| `--surface`              | `#ffffff`   | Card surface                           |

### Typography

- **Display font**: `Inter` (headings, h1/h2/h3; italic emphasis on the accent word).
- **Body font**: `Geist`.
- **Mono font**: `Geist Mono` — used for section eyebrows, meta labels, code blocks, ticker labels, price units.

### Shape tokens

- `--r-pill`: 999px (buttons, badges).
- `--r-xl`: card corners.
- `--r-2xl`: larger blocks (hero cards, pricing teaser).

### Buttons

- `.btn-primary` — solid brand-purple with drop-shadow, `translateY(-2px)` lift on hover.
- `.btn-secondary` — outline pill. Hover: border/text turn brand-purple, 1px lift.
- `.nav-cta` — brand-purple pill in nav.
- `.tier-cta` — dark outline pill inside pricing cards.

### Motifs

Each product has an SVG "motif" mark (24px viewBox):
- `.motif-ecom` — cart/basket outline (Commerce)
- `.motif-ledger` — bars + circle (Ledger)
- `.motif-invoice` — sheet with lines (Invoice)

---

## Analytics

- **Google Analytics 4**: `G-G1YWDRHW8T`. Snippet lives between `<!-- GA_BEGIN -->` / `<!-- GA_END -->` markers on every page.
- **Amplitude (EU region)**: `30b70e5e6ec2360a6c262a482628baf0`
  - `serverZone: 'EU'`
  - `serverUrl: 'https://api.eu.amplitude.com/2/httpapi'`
  - Snippet between `<!-- AMPLITUDE_BEGIN -->` / `<!-- AMPLITUDE_END -->`.
- If either needs updating, use `scripts/inject_analytics.py` (idempotent, markers-based).

---

## Social share / SEO

- **OG image**: `/assets/img/og-image.png` at 1200×630 (Facebook/LinkedIn/Twitter recommended).
- **Meta blocks** (`og:*` / `twitter:*`) live between `<!-- OG_BEGIN -->` / `<!-- OG_END -->` on every page. Auto-populated per page from `<title>` and `<meta name="description">`.
- **Sitemap**: `/sitemap.xml` (24 URLs, EN only currently).
- **robots.txt** at root allows all crawlers and declares the sitemap.

**When the OG image needs a refresh**, drop a new screenshot into a session and run the equivalent of `/tmp/og_setup.py` (extracts latest attached image, fits to 1200×630 with lavender backdrop, saves to `assets/img/og-image.png`). Social platforms cache OG for ~7 days — force a re-scrape via LinkedIn Post Inspector / Facebook Sharing Debugger after changing.

---

## i18n

Currently **English-only in production.**

- `/es/*` and `/pt/*` are **hidden** — `vercel.json` 307-redirects them to their EN equivalents (`/es/commerce` → `/commerce`).
- The Spanish (`/es/`) and European Portuguese (`/pt/`) HTML files still exist on disk with their translations intact.
- The language switcher block (`<!-- LANG_BEGIN --> ... <!-- LANG_END -->`) is preserved but emptied on every EN page — so re-enabling just means re-running the switcher injector.
- `hreflang` link tags have been removed from EN pages so search engines don't index alternates.

### Translation conventions (for when we bring locales back)

- **Portuguese specifics** (European): use `tu` form, `SouthPay` feminine, `Commerce/Ledger/Invoice` in English, `crypto` (not `criptografia`), `chargebacks` (not `estornos`), prices in `€`, "receber em euros" (not "liquidar em dinheiro").
- **Spanish**: use `tú` form, industry-name terms mostly stay Spanish, brand + product names always English.
- **Mockup content** (Posted / Balanced / `Madison & Vine` / `Selvedge denim jacket` / `THIS MONTH` / `SETTLED IN USD` / `curl "api.southpay.io/v1/tx"`) stays English in **every** locale — it represents a product UI, not marketing copy.

---

## Footer as source of truth

`index.html`'s `<footer>…</footer>` is canonical. To propagate a footer change:

```
python3 scripts/sync_footer.py           # rewrite footer on every EN page
python3 scripts/sync_footer.py --check   # exit 1 if any page has drifted (CI gate)
```

---

## Scripts

Long-lived, in `scripts/`:

- `scripts/sync_footer.py` — footer canonicalization from `index.html`.
- `scripts/inject_analytics.py` — GA + Amplitude idempotent inject.

Ad-hoc utilities that lived in `/tmp/` during translation, OG image regeneration, external-link sweeping, product-name restoration, etc. should be consolidated into `scripts/` when team collaboration starts.

---

## Conventions summary

1. **Product names**: `Commerce`, `Ledger`, `Invoice` — never translated.
2. **Brand**: `SouthPay` one word, `ALC Media` two words.
3. **No em dashes** anywhere.
4. **No `<br>`** in headings.
5. **External links** → `target="_blank" rel="noopener"`.
6. **Analytics blocks are marker-delimited** — never hand-edit; use the inject scripts.
7. **Footer is canonical from `index.html`** — sync after every edit.
8. **Prices**: USD in EN; EUR in PT (currently hidden).
9. **Mockup content stays English** in every locale.

---

## Versioning

No semantic versioning yet. Continuous deploy from `main` via Vercel CLI. Consider tagging meaningful releases once team collaboration begins.

## Suggested team workflow

- Branch off `main` for changes.
- Vercel creates preview deploys automatically for pushed branches / PRs.
- Merge to `main` after review → auto-deploys to production.
- Wire `scripts/sync_footer.py --check` into a CI check so footer drift is caught before merge.

---

## Contact

- **Technical**: tech@southpay.io
- **Support** (linked in footer): support@southpay.io
- **Docs**: https://docs.southpay.io/
- **App**: https://app.southpay.io/
- **Ledger app**: https://ledger.southpay.io/

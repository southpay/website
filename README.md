# SouthPay marketing site

Static HTML, one shared stylesheet, one shared interactions script. No build step. Deploys to Vercel as-is.

## Structure

```
.
├── index.html         Homepage (landing + commerce-led hero)
├── commerce.html     /commerce  Crypto checkout product page
├── ledger.html        /ledger     Double-entry ledger API
├── invoice.html       /invoice    Invoice + payment links
├── southpay.css       Shared design system (Inter + Geist + Geist Mono)
├── assets/
│   └── southpay.js    Hex background + FAQ accordion
├── vercel.json        Clean URLs, asset cache headers
└── package.json
```

## Deploying to Vercel

### Option A: Vercel CLI (fastest)

```bash
npm i -g vercel
cd southpay
vercel --prod
```

Accept the defaults. Vercel detects the static project from `vercel.json` and serves the HTML files directly. `/ledger`, `/commerce`, `/invoice` resolve to their respective HTML files thanks to `cleanUrls: true`.

### Option B: GitHub → Vercel

1. Push this directory to a new GitHub repo.
2. On vercel.com, **New Project → Import** the repo.
3. Framework preset: **Other**. Build command: leave empty. Output directory: leave empty.
4. Deploy.

## Local preview

```bash
cd southpay
npm start            # or: python3 -m http.server 3000
```

Then open http://localhost:3000.

The hex-background interaction needs JS, so file:// double-clicks work but the inline anchors and `/ledger`-style clean URLs don't. Use the local server.

## What's here vs what's a placeholder

**Real, ready to ship:**
- All four pages with full copy
- Design system tokens (colors, radius, typography, shadows)
- Interactive hex background (mouse + touch)
- FAQ accordion with single-open behavior
- Hover and reveal animations
- Mobile breakpoints down to 540px

**Linked but not present in this repo:**
- `/pricing` page (linked from nav, build separately)
- `/about`, `/docs`, `/contact` (linked from nav and footer)
- `/aml-policy`, `/merchant-services-agreement`, `/privacy`, `/terms`, `/security`, `/dpa` (legal pages)
- Logo asset - the nav and footer use an inline `<span class="logo-mark">S</span>` purple square. Drop a real SVG/PNG into `/assets` and swap the markup if you want a custom mark.

**External URLs preserved:**
- `https://app.southpay.io/` - main app signup
- `https://app.southpay.io/ledger` - product-specific signup
- `https://calendly.com/daniel-southpay/intro-call` - sales call
- `mailto:hello@southpay.io`

## Design system at a glance

- **Display font**: Inter (700 for h1, 600 for h2/h3/cards/quotes)
- **Body font**: Geist (400/500/600)
- **Mono font**: Geist Mono (used for refs, ledger amounts, eyebrows, code blocks)
- **Brand color**: `#374bec` (purple-blue, extracted from the logo)
- **Italic accent**: one phrase per heading in italic + brand color - the signature move
- **Lavender wash**: `#e7e9ff`, used for full-section "how it works" backgrounds
- **Hex background**: SVG honeycomb with mouse-proximity glow, fixed position, low opacity

Full token reference is in the design-system.html file (delivered separately).

## Customization quick map

| Want to change… | Edit… |
|---|---|
| Brand color | `:root --brand` in `southpay.css` |
| Display font | `:root --display` in `southpay.css` + Google Fonts `<link>` in each HTML head |
| Nav links | `.nav-links` in each HTML file |
| Footer | `<footer>` at the bottom of each HTML file |
| Hex background density | `hexSize` constant in `assets/southpay.js` (default 38) |
| Hex glow radius | `radius` constant in `assets/southpay.js` (default 200) |

Footers and nav are inlined per page rather than partialed because there's no build step. When you change one, change all four. There's not many.

## License

Private. SouthPay is an ALC Media brand.

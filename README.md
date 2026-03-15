# Shonowear — Anime Streetwear Platform

A fully static fashion discovery platform for anime-inspired streetwear, built with vanilla HTML, CSS, and JavaScript. Deployed on GitHub Pages.

**Live site:** [kavin-js.github.io/Shonowear-Ver3.0](https://kavin-js.github.io/Shonowear-Ver3.0)

---

## Overview

Shonowear is not just a product catalog — it's a style discovery experience. Every page is built to feel like a fashion editorial. Users explore curated collections, build complete outfits by anime universe, browse an editorial lookbook, and manage a persistent cart — all without a backend.

---

## Pages (13 HTML files)

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Full startup narrative: hero, problem, solution, how it works, drop countdown, collections, product grid, lookbook, outfit builder, platform preview, community, roadmap, founder, newsletter |
| Collection | `collection.html` | 120 products, 5 simultaneous filters (type, category, anime, price, sort), live search, result count, active filter chips |
| New Arrivals | `new-arrivals.html` | Filtered new items with page hero, type filters, sort |
| Product Detail | `product.html` | Image gallery, zoom lightbox, size selector, qty, add to cart, wishlist, Complete the Look, related products, share |
| About | `about.html` | Brand story, values, stats, founder section |
| Cart | `cart.html` | Item management, size display, promo codes, checkout gate |
| Contact | `contact.html` | Contact form with mailto, FAQ accordion |
| Login | `login.html` | Session login, forgot password |
| Sign Up | `signup.html` | Account creation with validation |
| 404 | `404.html` | Custom branded not-found page |
| Privacy | `privacy.html` | Privacy policy |
| Returns | `returns.html` | Returns and exchange policy |
| Shipping | `shipping.html` | Shipping tiers and delivery info |

---

## JavaScript (7 files)

| File | Purpose |
|------|---------|
| `main.js` | Shared: nav state, cart badge, `renderProductCard`, `addToCart`, `toggleWishCard` |
| `app.js` | Homepage: live search, product grid, lookbook filter, proof counters, outfit builder, drop countdown, analytics events, scroll-to-top |
| `collection.js` | Filters (5 simultaneous), anime dropdown (auto-built from data), URL params, live search respecting filters, active filter chips, result count |
| `new-arrivals.js` | Sort helper for new arrivals page |
| `cart.js` | Cart load, qty management, item removal, checkout, promo code discount |
| `product.js` | Product page: gallery, zoom lightbox, size selector, add to cart with size, wishlist, Complete the Look, related products, share, smart breadcrumb |
| `wishlist.js` | Slide-in sidebar, localStorage persistence, add/remove, move to cart, badge count |

---

## Key Features

**Discovery**
- Style-first collections: Street Ninja, Minimal Anime, Tokyo Casual, Cyberpunk Tokyo, Collector's Edit
- Editorial lookbook with 6 outfit cards, universe filter tabs, and item-level chips
- Outfit Builder — pick a universe, get a curated 3-piece look, add all to cart in one click
- Live search with match highlighting in navbar dropdown

**Product**
- 120 products across 13 anime universes (Naruto, JJK, AoT, Demon Slayer, One Piece, and more)
- XS–XXL size selection with size guide modal
- Image gallery with zoom lightbox and keyboard navigation
- "Complete the Look" recommendations on every product page
- Wishlist with localStorage persistence — hearts restore state on every render

**Cart & Commerce**
- Persistent cart (localStorage) — handles both card quick-add and product-page add with size
- Total quantity badge (not item count)
- Promo codes: `ANIME10` (10%), `CULTURE15` (15%), `SW25` (25%)
- Checkout gate requiring login

**UX**
- Active filter chips — see and dismiss individual filters
- Drop countdown timer
- Scroll progress bar
- Page fade-in animation
- Staggered card entrance on grid render
- Skeleton loader before product grid
- `:focus-visible` accessibility styles
- Scroll-to-top button on all pages

**Brand**
- Roadmap section (4 phases)
- Founder section with `profile.jpg`
- FAQ accordion on contact page
- Policy pages (privacy, returns, shipping) — all real content

---

## File Structure

```
Shonowear/
├── index.html            # Homepage (16 sections)
├── collection.html       # Product collection with full filters
├── new-arrivals.html     # New arrivals with filters/sort
├── about.html            # About + founder
├── cart.html             # Cart + promo codes
├── contact.html          # Contact + FAQ
├── login.html            # Login + forgot password
├── signup.html           # Signup
├── product.html          # Product detail
├── 404.html              # Custom 404
├── privacy.html          # Privacy policy
├── returns.html          # Returns policy
├── shipping.html         # Shipping policy
├── style.css             # All styles (676 lines, 3 breakpoints)
├── main.js               # Shared functions
├── app.js                # Homepage logic
├── collection.js         # Collection page logic
├── new-arrivals.js       # New arrivals helper
├── cart.js               # Cart logic
├── product.js            # Product page logic
├── wishlist.js           # Wishlist sidebar
├── data.js               # 120 products
├── products.json         # Product data (JSON)
├── profile.jpg           # Founder photo
└── README.md
```

---

## Tech Stack

- **HTML5** — semantic markup, no frameworks
- **CSS3** — CSS variables, Grid, Flexbox, clamp(), 3 breakpoints (1100/900/600px)
- **Vanilla JavaScript** — ES6+, no libraries, no build tools
- **localStorage** — cart, wishlist, auth session
- **Unsplash** — product and editorial photography
- **Google Fonts** — Bebas Neue, Poppins, DM Serif Display
- **Font Awesome 6** — icons

---

## Promo Codes

| Code | Discount |
|------|---------|
| `ANIME10` | 10% off |
| `CULTURE15` | 15% off |
| `SW25` | 25% off |

---

## How to Run Locally

No build step. Open any HTML file directly or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

---

## Deploy to GitHub Pages

1. Push all files including `profile.jpg` to repository root
2. Settings → Pages → Deploy from branch → main → / (root)
3. `404.html` in root is automatically used by GitHub Pages for not-found routes

---

## Contact

Built by **Kavin J.S**

- Instagram: [@kavin.j.s](https://www.instagram.com/kavin.j.s)
- Support: [support@shonowear.com](mailto:support@shonowear.com)
- Business: [kavin.js@outlook.com](mailto:kavin.js@outlook.com)

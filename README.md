# Shonowear — Anime Streetwear Platform

A fully static fashion discovery platform for anime-inspired streetwear, built with vanilla HTML, CSS, and JavaScript. Deployed on GitHub Pages.

**Live site:** [kavin-js.github.io/Shonowear-Ver3.0](https://kavin-js.github.io/Shonowear-Ver3.0)

---

## Overview

Shonowear is not just a product catalog — it's a style discovery experience. Every page is built to feel like a fashion editorial, not a spreadsheet. Users can explore curated collections, filter by anime universe, browse a lookbook, and manage a persistent cart — all without a backend.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero, collections reel, product grid, lookbook, testimonials, newsletter |
| Collection | `collection.html` | Full product grid with filters (type, category, anime, price, sort) |
| New Arrivals | `new-arrivals.html` | Products marked `isNew: true` |
| About | `about.html` | Brand story, values, stats |
| Cart | `cart.html` | localStorage cart with qty management and checkout |
| Contact | `contact.html` | Contact form with mailto, phone, email links |
| Login | `login.html` | localStorage-based session login |
| Sign Up | `signup.html` | Account creation |
| 404 | `404.html` | Custom not-found page for GitHub Pages |

---

## Features

- **Dynamic product grid** — renders 120 products from `data.js`, no backend required
- **Multi-filter system** — filter by category, type, anime universe, price range, and sort order simultaneously
- **Live search** — instant search as you type, respects all active filters
- **URL param filtering** — `collection.html?type=hoodie`, `?anime=Naruto`, `?q=search` all work
- **Persistent cart** — localStorage cart survives page refreshes, tracks quantity per item
- **Cart badge** — shows total item quantity, not just unique items
- **Real product images** — Unsplash fashion photography keyed by product type
- **Lookbook** — 6-card editorial masonry with universe filter tabs
- **Style collections** — expandable card reel linking to filtered collection
- **Scroll-to-top button** — appears after scrolling 400px
- **Scroll progress bar** — red/gold gradient bar across top of navbar
- **Page fade-in** — smooth body load animation on every page
- **Staggered card entrance** — products animate in with delay cascade
- **Wishlist hearts** — toggle save on any product card
- **Social proof counters** — animated number count-up on homepage
- **Newsletter** — email validation with loading state and success feedback
- **Contact form** — builds mailto: link with form data, opens email client
- **Responsive** — works on 320px mobile through 1440px+ desktop
- **Active nav links** — current page highlighted in navbar on every page
- **Sticky navbar** — glass morphism with scroll-triggered opacity change
- **Mobile menu** — slide-in drawer with search bar
- **Meta tags** — description, OG tags, and SVG favicon on every page
- **Custom 404** — branded not-found page for GitHub Pages

---

## File Structure

```
Shonowear/
├── index.html          # Homepage
├── collection.html     # Full product collection
├── new-arrivals.html   # New arrivals
├── about.html          # About page
├── cart.html           # Shopping cart
├── contact.html        # Contact page
├── login.html          # Login
├── signup.html         # Sign up
├── 404.html            # Custom 404
├── style.css           # All styles (single file)
├── main.js             # Shared: nav, cart, renderProductCard, addToCart
├── app.js              # Homepage: search, filters, counters, lookbook
├── collection.js       # Collection page: filters, anime dropdown, result count
├── new-arrivals.js     # New arrivals: render, wishlist, scroll
├── cart.js             # Cart: load, qty change, remove, checkout
├── data.js             # Product data (120 products)
└── products.json       # Product data (JSON format)
```

---

## Tech Stack

- **HTML5** — semantic markup, no frameworks
- **CSS3** — CSS variables, Grid, Flexbox, clamp(), custom animations
- **Vanilla JavaScript** — ES6+, no libraries or build tools
- **localStorage** — cart persistence and auth session
- **Unsplash** — product and editorial photography (free tier URLs)
- **Google Fonts** — Bebas Neue, Poppins, DM Serif Display
- **Font Awesome 6** — icons

---

## How to Run Locally

No build step required. Just open any HTML file directly in a browser, or use a local server:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node
npx serve .

# Option 3 — VS Code
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` in your browser.

---

## Deploy to GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. GitHub Pages will serve `index.html` automatically
5. For the custom 404 page to work, `404.html` must be in the root — GitHub Pages picks it up automatically

---

## Contact

Built by **Kavin J.S** — Computer Science Engineering Student

- Instagram: [@kavin.j.s](https://www.instagram.com/kavin.j.s)
- Support: [support@shonowear.com](mailto:support@shonowear.com)
- Business: [kavin.js@outlook.com](mailto:kavin.js@outlook.com)

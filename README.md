# Shonowear — Improved Edition
### Full codebase audit applied — March 2026

## Critical Bugs Fixed
- Removed placeholder G-XXXXXXXXXX analytics (firing bad requests on every page)
- Fixed Twitter/Discord social links (all pointed to Instagram)
- Flagged placeholder WhatsApp number — search YOUR_NUMBER to replace
- Replaced all 50+ generic product names in data.js ("Otaku Hoodie 1" etc.)
- Corrected fake social proof numbers to honest early-stage metrics

## Brand Changes
- Replaced pitch-deck Problem/Solution sections with manifesto strip: "NOT MERCH. A MOVEMENT."
- Replaced Phase 1-4 Roadmap with AW25 Next Drop teaser + email capture
- Added breadcrumb + Size Guide button to collection page

## New Files
- nav.js — shared navbar (one file to update, reflects on all pages)
- footer.js — shared footer (same principle)
- shared-ui.js — Size Guide Modal, Sticky Add-to-Cart (mobile), Link loading indicator

## CSS Improvements
Two patches appended to style.css:
- Consistent border-radius tokens
- Manifesto strip styles
- Size Guide Modal (full measurement tables)
- Trust strip for cart
- Testimonial card improvements
- Lookbook card hover animations
- Why-card accent underline animation
- Footer full redesign
- Announce bar shimmer
- prefers-reduced-motion accessibility
- focus-visible accessibility
- scroll-padding-top for fixed navbar

## Before Going Live
1. Replace YOUR_NUMBER with real WhatsApp Business number
2. Add real Google Analytics + Meta Pixel IDs
3. Replace profile.jpg with your own photo
4. Replace Unsplash hero + product images with real product shots
5. Verify social proof numbers match reality

# Hyara Unisex Salon — Website

A luxury, single-page website for **Hyara Unisex Salon** (Indore | Mumbai), built from the authentic brand identity pulled from their Instagram profile — **[@hyaraunisexsalon](https://www.instagram.com/hyaraunisexsalon/)**.

> *"Luxury salon for him & her ✨ Hair • Skin • Grooming • Beauty rituals 💎"* — 809+ Instagram followers, Packages ✨ · Academy · Makeup 🧿 · Nails 💅 · Reviews 💌.

## ✨ Features

- Elegant **blush-rose luxury** aesthetic (cream · blush rose · taupe) with Playfair Display + Great Vibes + Jost
- Interactive: preloader, custom cursor, scroll-progress bar, 3D tilt cards, animated counters, marquee ticker, tabbed services (Her / Him / Signature), auto-playing testimonial carousel, FAQ accordion, image lightbox with keyboard/swipe navigation
- **Live Instagram gallery** — `js/main.js` tries to fetch the real @hyaraunisexsalon feed through public endpoints + CORS relays (allorigins → corsproxy.io → codetabs). If Instagram blocks anonymous access (which it usually does), it gracefully falls back to a curated showcase with the same look and every tile links out to the real profile.
- Fully responsive (desktop / tablet / mobile) + respects `prefers-reduced-motion`
- Booking form with inline validation → success state + prefilled WhatsApp confirmation link

## 🎨 Palette

The theme colours were extracted from the client's colour-palette image:

| Role | Hex | Source |
| --- | --- | --- |
| Background | `#FAF6F1` | warm cream |
| Panels / cards | `#FFFFFF`, `#F8F2EA` | white / warm cream |
| Headings / text | `#2A211C` | warm ink / espresso |
| Muted text | `#7D6D5C` | warm taupe |
| Primary accent | `#C47779` | rose pink |
| Accent light | `#AB5D60` | deep blush (script, stars, marquee) |
| Accent deep | `#B25E60` | deep rose (buttons gradient) |
| Warm secondary | `#967A5C` | taupe / sand |

To tweak any shade, edit the `:root { ... }` block at the top of `css/style.css`.

## 🚀 Run it

No build step. Either:

```bash
# 1) open directly
start index.html

# or 2) serve locally (recommended so IG fetch + Google fonts are crisp)
npx serve .
# then open http://localhost:3000
```

## 📁 Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content & structure |
| `css/style.css` | Theme, layout, animations, responsive rules |
| `js/main.js` | Interactions + Instagram live loader |

## 🔧 Before going live — replace these placeholders

Search the code for these and update with real salon details:

- Phone / WhatsApp number — in `index.html` (tel:+91…) and `js/main.js` (`WA_NUMBER = "919800000000"`)
- Address (`index.html`, in the Contact, Booking & Footer sections) — currently Vijay Nagar, Indore
- Email — `hello@hyarasalon.in`
- Real Instagram photo URLs — if you get Meta's official Instagram API token, wire it into `fetchIGProfile()` in `js/main.js` (it already parses `web_profile_info` response)
- Gallery images currently use curated Unsplash salon photography as a fallback; replace with the salon's own photos at any time

## 🛠 JSON you can customise

`IG_FALLBACK` inside `js/main.js` — an array of `{img, cap, tag}` used when Instagram denies the live fetch. Swap `img` for the salon's own CDN URLs (e.g., from `https://www.instagram.com/hyaraunisexsalon/` or a Facebook/IG Graph API token).# Hayara

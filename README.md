# ◈ ThemeForge — Dynamic Theme Engine

A fully interactive, real-time CSS theme engine built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — just open `index.html` and go.

---

## 🚀 Features

| Feature | Description |
|---|---|
| **Live Color Editing** | 5 color pickers (Primary, Accent, Background, Surface, Text) update the UI instantly |
| **Typography Controls** | Font family selector (7 fonts), size, line-height, letter-spacing sliders |
| **Shape & Space** | Border radius, spacing scale, and shadow depth controls |
| **6 Presets** | Midnight, Arctic, Forest, Sunset, Candy, Monochrome |
| **Export JSON** | Downloads complete theme configuration as `.json` |
| **Export CSS** | Downloads ready-to-use `:root { }` CSS variables block |
| **Copy CSS Vars** | Copies the CSS `:root` block to clipboard |
| **Live Preview** | Full component showcase: hero, stats, article, form, alerts, progress bars, toggles |

---

## 📁 Project Structure

```
dynamic-theme-engine/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles + CSS custom properties
├── js/
│   ├── presets.js      ← Preset theme definitions
│   └── engine.js       ← Core JS: apply theme, exports, events
└── README.md
```

---

## 🎨 How It Works

1. All visual values are stored as **CSS custom properties** in `:root`
2. JavaScript reads input values and calls `root.style.setProperty()`
3. Every element in the preview uses `var(--color-primary)` etc., so changes ripple instantly
4. Export functions collect current values and write them to JSON or CSS

---

## 💡 CSS Architecture

```css
:root {
  --color-primary:   #6c63ff;
  --color-accent:    #ff6584;
  --color-bg:        #0f0f17;
  --color-surface:   #1a1a2e;
  --color-text:      #e8e8f0;

  --font-family:     'Syne', sans-serif;
  --font-size-base:  16px;
  --line-height:     1.6;
  --letter-spacing:  0px;

  --radius:   12px;
  --spacing:  1;
  --shadow:   0 8px 32px rgba(0,0,0,0.4);
}
```

---

## 🏃 Running the Project

Just open `index.html` in any modern browser. No server needed.

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, grid, flexbox, `color-mix()`, transitions
- **Vanilla JS** — ES6+, no dependencies
- **Google Fonts** — Syne, DM Sans, Space Mono, Cormorant, Bebas Neue, Nunito, Playfair

---

Made with ◈ ThemeForge

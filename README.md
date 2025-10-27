# Crossword React App (Dark Premium Theme)

This project is a minimal Vite + React app that embeds a CrosswordLabs puzzle inside a premium, glassy dark theme. The first page is a translucent login box. After signing in, users land on the home page with two sections: Crossword (iframe) and Flowcharts (empty placeholder).

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173).

Credentials

- Demo users are in `users.json` (user1..user50 with passwords pass1..pass50).

Notes

- Each user receives a per-user iframe URL (query params appended). This may not guarantee server-side isolation depending on the embed provider.
- The Flowcharts section is intentionally left empty for later work.
# Crossword — Dark Theme Solver

This is a simple single-page site designed to present a CrosswordLabs puzzle inside a comfortable dark-themed layout.

Files:
- `index.html` — main page with embedded iframe and controls
- `styles.css` — dark theme styling and responsive layout
- `script.js` — minimal interactions: open, copy link, fullscreen (F)

How to use:
1. Open `index.html` in your browser (double-click or serve with a simple static server).
2. Use the buttons above the puzzle to open the puzzle in a new tab, copy the puzzle link, or toggle fullscreen.

Notes:
- The iframe embeds the provided puzzle at `https://crosswordlabs.com/embed/temp1-11`.
- The site is intentionally minimal and works offline as a static HTML page.


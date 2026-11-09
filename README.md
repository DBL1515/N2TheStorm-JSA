# N2TheStorm Job Safety Analysis (JSA) App

A mobile-friendly Progressive Web App (PWA) for employees to create digital Job Safety Analyses.

## Features
- Mobile-first design optimized for phones
- Create multi-step JSAs with hazards, controls, and risk ratings
- Required PPE checklist
- Digital signature (typed name)
- Save drafts locally on the device
- Preview professional report
- Print or Save as PDF (browser print dialog)
- Works offline after first load (PWA)
- Can be "installed" to home screen (looks like a native app)
- Company branded for **N2TheStorm**

## How Employees Use It

### Option 1: Host it (Recommended)
1. Host the folder contents on any web server (Netlify, Vercel, GitHub Pages, your own server, etc.).
2. Share the URL with employees.
3. On phone: Open the link → browser menu → **Add to Home Screen** / **Install App**.
4. It will open full-screen like a regular app.

### Option 2: Local / Offline use
- Open `index.html` in any modern browser.
- For best experience, host it.

## Data Storage
All data is stored **locally** on the employee's phone (localStorage). Nothing is sent to a server. This keeps it simple and private. Employees can export/print PDFs and share them as needed (email, messaging, etc.).

## Files
- `index.html` — Main app
- `styles.css` — Styling
- `app.js` — Logic
- `manifest.json` + `service-worker.js` — PWA support
- `icon-*.png` — App icons

## Customization Ideas
- Add company logo image
- Connect to a backend / Google Sheets / email for central collection
- Add photo upload capability
- Multi-user signatures
- Risk matrix calculator

Built for N2TheStorm.

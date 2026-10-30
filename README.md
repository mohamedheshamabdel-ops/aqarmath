# AqarMath — Real estate, by the numbers

Static site on Vercel (no build step). Every push to `main` deploys to https://aqarmath.vercel.app.

## Files
- `index.html` — page markup (English + Arabic, switched in the page).
- `styles.css` — design tokens and layout (light and dark).
- `engine.js` — the calculation engine: payment plan, cash value, rent, resale, fees, IRR, NPV, break-even, beats-the-certificate check. No DOM.
- `app.js` — the interface: inputs, story, charts, WhatsApp, PDF, share links, saved state.
- `tests/engine.test.js` — run `node tests/engine.test.js`.
- `og.png`, `favicon.svg`, `vercel.json`.

## Analytics
`index.html` loads Vercel Web Analytics. Turn it on in Vercel → Project → Analytics → Enable.

## Defaults to confirm with an investment expert
Resale discount 10%, transfer fee 3%, vacancy 8%, owner costs 5%, rent negotiation 5%, months to sell 3, price growth 4/10/16%.
All are editable on the site under "Assumptions and sources".

# sovereignquant.com.au sales site

Repo: https://github.com/jmorganegypt-source/sovereignquant

## Live Stripe (account SOVEREIGN. QUANT)
- PDF A$29: https://buy.stripe.com/3cIcN5dZIg0EdWog3Oes001
- CSV tearsheet A$199: https://buy.stripe.com/cNibJ108S6q4aKc9Fqes002
- Professional US$499/yr: https://buy.stripe.com/14A8wPdZI7u86tW18Ues003

## Put this on the real domain
1. GitHub → Settings → Pages → Deploy from branch `main` / root.
2. In Cloudflare / registrar, point `sovereignquant.com.au` A/CNAME at GitHub Pages (or replace the current JS app root with this `index.html`).
3. After a tearsheet payment: customer emails CSV; you run reporting and send HTML back.

Do not ship `generate_licence.py` or the licence secret to buyers.

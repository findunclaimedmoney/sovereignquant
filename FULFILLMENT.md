# After a Stripe payment

## A$29 PDF
If Stripe file download is already attached to the product, do nothing.

## A$199 tearsheet
1. Confirm payment in Stripe dashboard.
2. Ask for CSV: date, OHLC, optional volume or fills.
3. Run the local reporting / backtest on that file only.
4. Email the HTML. Do not give buy/sell instructions.

## US$499 Professional
1. Confirm payment.
2. Generate a named Professional key with `generate_licence.py` (keep the script private).
3. Send zip + key. Change SOVEREIGN_LICENCE_SECRET first if you have not.

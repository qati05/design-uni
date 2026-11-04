# Lighthouse – final (Commit f6036f7)

Lighthouse 13.6.0 (npx, cached), mobile form factor (default throttling), headless Chrome.
Built `dist/` served locally at http://127.0.0.1:4391 with the CSP from `dist/_headers`. Measured on 4 Nov 2026.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 89 | 97 | 96 | 58 | 3.3 s | 0 | 180 ms |
| `/schaden-melden/` | 97 | 97 | 96 | 58 | 1.7 s | 0 | 160 ms |

FCP is 1.7 s and Speed Index is 1.7 s on both pages.

## Why points were lost
- **SEO 58:** `<meta name="robots" content="noindex">` (intended for the preview) and no meta description.
- **Accessibility 97:** colour contrast on `<span>` / `<span class="nr">`.
- **Best Practices 96:** a 404 for `/favicon.ico`, which is missing in dist and logged as a console error.
- **Performance `/`:** LCP 3.3 s, from the hero image under mobile throttling.

These are local numbers with no CDN or HTTP/2, so they are only a guide.

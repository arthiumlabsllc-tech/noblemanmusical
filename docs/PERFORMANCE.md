# Performance

## Targets

| Metric | Mobile | Desktop |
|--------|--------|---------|
| Lighthouse | >= 90 | >= 95 |
| LCP | < 2.0s (4G) | — |
| INP | < 200ms | < 200ms |
| CLS | < 0.05 | < 0.05 |
| First-load JS | < 150KB gzip | < 150KB gzip |

## Strategies

- All images via `next/image`, AVIF/WebP, correct sizes, priority on hero
- Fonts subset + display swap
- Route-level code splitting
- ISR for product/category pages (revalidate 60s)

## Auditing

```bash
pnpm lighthouse       # Run Lighthouse
pnpm audit:size       # Check bundle size
```

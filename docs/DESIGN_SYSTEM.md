# Design System

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy-deep` | #060F24 | Utility bar background |
| `--navy` | #0B1B3B | Primary dark |
| `--gold` | #D4AF37 | Primary accent |
| `--gold-light` | #E8C766 | Gold hover state |
| `--cream` | #F5F0E6 | Page background |
| `--bronze` | #B08D57 | Secondary accent |
| `--kente-red` | #C1272D | Sale badges, error state |
| `--kente-green` | #0A7B3E | In-stock, success state |
| `--charcoal` | #1A1A1A | Body text |

**Color rule:** Navy 60% · Cream 30% · Gold 10%. Kente red/green only as state indicators.

## Typography

| Role | Font | Weights |
|------|------|---------|
| Display | Playfair Display | 400, 700, 900 |
| Accent | Cormorant Garamond (italic) | 400 |
| UI/Body | Inter | 300, 400, 500, 600, 700 |
| Prices | Inter + `font-variant-numeric: tabular-nums` | — |

Loaded via `next/font/google` with `display: "swap"`.

## Spacing

Based on Tailwind's default scale (4px base).

## Focus States

Gold ring on all interactive elements: `outline: 2px solid var(--gold); outline-offset: 2px;`

## Reduced Motion

Respects `prefers-reduced-motion`: disables Ken Burns, auto-advance, shimmer. Keeps fades.

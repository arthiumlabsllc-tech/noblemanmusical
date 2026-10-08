# POS System

## Overview

Full-featured point-of-sale system for in-store sales at Nobleman Musical Center.

## Pages

- `/pos` — Terminal (main POS screen)
- `/pos/sales` — Sales history
- `/pos/sales/[id]` — Sale detail with receipt preview
- `/pos/shift` — Shift management
- `/pos/returns` — Process returns
- `/pos/receipts/[id]` — Receipt view

## Terminal Layout

- **Left (60%):** Product search + grid
- **Right (40%):** Cart + payment actions
- **Top bar:** Shift info, cashier name, navigation

## Shift Management

- One open shift per terminal at a time
- Open shift: enter opening cash
- Close shift: enter actual cash, system shows discrepancy

## Receipt

- Printable via browser print (A5/A4)
- Send via WhatsApp
- Save to Vercel Blob

## Offline Mode

- Sales queue in IndexedDB when offline
- Flush to server on reconnect
- Documented in `docs/adr/0006-pos-offline-strategy.md`

<!-- To be expanded in Phase 15 -->

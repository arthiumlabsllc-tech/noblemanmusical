# Scripts

Utility scripts for the Nobleman v2 project.

## Available Scripts

| Script | Description | Status |
|--------|-------------|--------|
| `verify.mjs` | CDP verification harness | Phase 21 |
| `audit.mjs` | Site-wide audit (links, size, contrast, env-leaks) | Phase 21 |
| `lighthouse.mjs` | Lighthouse performance audit | Phase 21 |
| `build.mjs` | Build helper | Phase 22 |
| `dev.mjs` | Dev helper | Phase 22 |
| `db-push.mjs` | Database push helper | Phase 4 |
| `db-seed.mjs` | Database seed helper | Phase 4 |

## Usage

```bash
pnpm verify          # Run verification
pnpm audit           # Run all audits
pnpm audit:links     # Check for broken links
pnpm audit:size      # Check bundle sizes
pnpm audit:contrast  # Check color contrast
pnpm audit:env       # Check for env variable leaks
pnpm lighthouse      # Run Lighthouse
```

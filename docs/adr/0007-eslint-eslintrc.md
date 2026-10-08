# ADR-0007: @eslint/eslintrc for ESLint Flat Config

## Status
Accepted

## Context
The `eslint.config.mjs` uses `FlatCompat` from `@eslint/eslintrc` to bridge the `eslint-config-next` config (which uses the legacy format) into ESLint 9's flat config system. This package was not in the original `package.json` but is required for the ESLint setup to work.

## Decision
Add `@eslint/eslintrc` as a devDependency.

## Rationale
- Required by `eslint.config.mjs` for `FlatCompat`
- Bridges `eslint-config-next` (legacy config) into ESLint 9 flat config
- Official migration path recommended by ESLint

## Consequences
- One additional devDependency
- When `eslint-config-next` migrates to flat config natively, this can be removed

# Layout System

## Overview

Full-bleed layout system with responsive containers. No `max-w-7xl mx-auto` anywhere.

## Container Classes

Defined in `src/styles/globals.css`:

| Class | Max Width | Usage |
|-------|-----------|-------|
| `.container-full` | 1920px | Homepage |
| `.container-wide` | 1600px | Shop, PDP |
| `.container-content` | 1280px | General content |
| `.container-narrow` | 720px | Blog, policies |

## Gutters

| Breakpoint | Gutter |
|-----------|--------|
| < 640px | 16px |
| >= 640px | 20px |
| >= 1024px | 24px |
| >= 1536px | 32px |

## Rules

1. Every page section uses one of the container classes
2. Homepage uses `container-full`
3. Shop/PDP use `container-wide`
4. Blog/policies use `container-narrow`
5. No `max-w-7xl mx-auto` anywhere

## Header Architecture

3-tier header (Musician's Friend style):
1. **TopUtilityBar** (36px) — Phone, trust claims, currency
2. **Main Header** (80px desktop / 64px mobile) — Logo, search, contact, account, cart
3. **Category Nav Row** (48px desktop only) — Category links, mega menus

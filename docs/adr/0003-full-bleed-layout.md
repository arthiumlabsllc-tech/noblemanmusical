# ADR-0003: Full-Bleed Layout System

## Status
Accepted

## Context
The reference design (Musician's Friend) uses a full-bleed layout that spans the viewport with dense information architecture. We need a layout system that:
- Avoids the narrow `max-w-7xl mx-auto` pattern
- Supports different container widths for different content types
- Is mobile-first with responsive gutters
- Is simple to use consistently

## Decision
Define CSS container classes with responsive gutters. Every page section uses one of four container classes.

## Container Classes
- `.container-full` (1920px) — Homepage
- `.container-wide` (1600px) — Shop, PDP
- `.container-content` (1280px) — General content
- `.container-narrow` (720px) — Blog, policies (prose)

## Gutters
- Mobile (< 640px): 16px
- SM (>= 640px): 20px
- LG (>= 1024px): 24px
- 2XL (>= 1536px): 32px

## Rationale
- **Dense Information Architecture:** Full-bleed allows more products per row, more content visible
- **Premium Feel:** Edge-to-edge imagery and content feels more immersive
- **Consistency:** Four container classes are easy to remember and enforce
- **Mobile-First:** Gutters scale with viewport, ensuring readability on all devices
- **No max-w-7xl:** Explicitly banning the narrow container pattern prevents drift

## Consequences
- Must audit every section to use the correct container class
- Backgrounds (colors, images) must extend beyond the container
- Testing at 5 breakpoints (375, 768, 1024, 1440, 1920) is required
- Large screens (> 1920px) will have cream-colored margins

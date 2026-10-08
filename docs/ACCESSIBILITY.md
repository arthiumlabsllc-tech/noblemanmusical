# Accessibility

## Target

WCAG 2.1 AA compliance.

## Practices

- Semantic HTML, one h1 per page
- Focus-visible gold ring on all interactive elements
- Keyboard navigation complete (modals trap focus, ESC closes)
- aria-labels on all icon-only buttons
- Contrast: body text >= 4.5:1, large text >= 3:1
- Reduced motion: disable Ken Burns, auto-advance, shimmer — keep fades

## Auditing

```bash
pnpm audit:contrast   # Check color contrast
```

## Testing

- Keyboard navigation testing in E2E
- Screen reader testing (manual)
- Automated contrast checking via audit script

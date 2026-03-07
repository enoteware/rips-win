---
name: svg-animation
description: Applies SVG animation best practices for rips-win—CSS keyframes, stroke-dash drawing, transform/origin, and a11y. Use when animating SVGs (logos, icons, infographics), adding line-draw effects, or implementing SVG motion in components.
---

# SVG Animation (rips-win)

Follow these practices when adding or editing SVG animations in this project.

## Approach

- **CSS** — Default: hover, transitions, loading states, keyframe sequences. Prefer `transform` and `opacity` (GPU-accelerated).
- **JavaScript** — Use only for complex sequences, scroll-triggered, or interactive; prefer `requestAnimationFrame` or a library (GSAP, Framer Motion).
- **SMIL** — Avoid for production; use CSS or JS instead.

## Required setup

1. **Inline SVG** — SVG in JSX/HTML with classes or IDs on elements to animate.
2. **transform-origin** — Set explicitly (e.g. `center center`); SVG defaults to canvas top-left.
3. **Classes on shapes** — Add to `<path>`, `<circle>`, `<g>` so CSS/JS can target them.

## Animatable SVG properties

| Property | Use |
|----------|-----|
| `fill`, `stroke` | Color transitions |
| `stroke-dasharray`, `stroke-dashoffset` | Line-draw / reveal |
| `opacity` | Fade |
| `transform` | Move, scale, rotate (prefer over layout props) |

## Line-draw (stroke reveal) pattern

```css
path {
  stroke-dasharray: 100;   /* or path length / pathLength */
  stroke-dashoffset: 100;
  animation: draw 2s ease forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

Use `pathLength="100"` on `<path>` for normalized values, or `getTotalLength()` in JS.

## Performance

- Animate only `transform` and `opacity` when possible.
- Use `will-change: transform, opacity` only on elements that actually animate.
- Prefer simpler paths; test on target devices.

## Accessibility

Always include reduced-motion support:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-svg,
  .animated-svg * {
    animation: none !important;
    transition: none !important;
  }
}
```

For continuous loops, consider a pause control (`animation-play-state: paused`). Do not convey critical info by animation alone.

## Workflow checklist

- [ ] Plan what moves and when (hover / load / loop).
- [ ] Export/optimize SVG; add classes to elements to animate.
- [ ] Inline SVG in component so it can be targeted.
- [ ] Use CSS transitions/keyframes first; add JS only if needed.
- [ ] Add `prefers-reduced-motion` override and test.

## Reference

Full reference (properties, keyframe tips, external links): [docs/svg-animation-best-practices.md](../../../docs/svg-animation-best-practices.md).

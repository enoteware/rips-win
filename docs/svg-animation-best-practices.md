# SVG Animation Best Practices & How-To

Reference doc compiled from CSS-Tricks, MDN, and SVG Genie (Dec 2025). Use for SVG animation in this project (e.g. logos, icons, infographics).

**Project skill:** `.cursor/skills/svg-animation/SKILL.md` — agents use it when animating SVGs in rips-win.

---

## Three Ways to Animate SVGs

| Approach | Best for | Notes |
|----------|----------|--------|
| **CSS** | Hover, transitions, loading states, simple keyframe sequences | Most common; no JS; GPU-friendly when using `transform`/`opacity`. |
| **JavaScript** (GSAP, Anime.js, vanilla) | Complex sequences, scroll-triggered, interactive | Full control; use `requestAnimationFrame`. |
| **SMIL** (`<animate>`, `<animateTransform>`) | Self-contained icons, simple loops | Limited support (no IE); prefer CSS/JS for production. |

---

## CSS Animation Fundamentals

### 1. Use inline SVG and target with CSS

- Put SVG markup in the HTML (or include as partial) so you can add **classes/IDs** to shapes.
- Target those classes in CSS like any other element.

### 2. Set `transform-origin` explicitly

SVG elements default to the **top-left of the SVG canvas**, not the element center:

```css
.svg-element {
  transform-origin: center center;
  transition: transform 0.3s ease;
}
```

### 3. Animatable SVG properties

| Property | Use |
|----------|-----|
| `fill`, `stroke` | Color transitions |
| `stroke-width` | Emphasis |
| `stroke-dasharray`, `stroke-dashoffset` | **Drawing / line-reveal effects** |
| `opacity` | Fade in/out |
| `r`, `cx`, `cy` | Circles: pulse, move |
| `transform` | Move, scale, rotate (prefer over `left`/`top`) |

### 4. Prefer `transform` and `opacity`

These are GPU-accelerated. Avoid animating `left`, `top`, or layout-triggering properties when you can use `transform`/`opacity`.

---

## Line Drawing (Stroke Reveal) Effect

Classic “path draws itself” effect:

1. **One long dash** — set dash length to total path length:
   ```css
   path {
     stroke-dasharray: 500;   /* total path length */
     stroke-dashoffset: 500; /* start hidden */
   }
   ```

2. **Animate offset to 0**:
   ```css
   @keyframes draw {
     to { stroke-dashoffset: 0; }
   }
   path {
     animation: draw 2s ease forwards;
   }
   ```

3. **Get path length**: `path.getTotalLength()` in JS, or use the **`pathLength`** attribute for normalized values:
   ```html
   <path d="..." pathLength="100" />
   ```
   Then use `stroke-dasharray: 100` and `stroke-dashoffset: 100` → `0`.

---

## Keyframe Tips (from CSS-Tricks)

- Use **percentages** (e.g. `0%`, `10%`, `100%`) or `from`/`to` in `@keyframes`.
- **Stagger** multiple elements with `animation-delay` (e.g. per letter or shape).
- For **one-shot then hold**: use `animation-fill-mode: forwards`.
- Long timelines: define one long `animation-duration` (e.g. 10s) and use keyframe % so each “scene” happens in a slice of that duration.

---

## Performance

- Animate **`transform`** and **`opacity`** when possible.
- Use **`will-change: transform, opacity`** sparingly on elements that actually animate.
- Simplify paths (fewer nodes = faster).
- Test on real devices; desktop smoothness ≠ mobile.

---

## Accessibility

- **Respect reduced motion**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animated-svg,
    .animated-svg * {
      animation: none !important;
      transition: none !important;
    }
  }
  ```
- For looping animations: consider a **pause control** (`animation-play-state: paused`).
- Don’t rely on animation alone for critical information; provide static/text alternatives.

---

## Quick Reference Links

- [Animating SVG with CSS](https://css-tricks.com/animating-svg-css/) — CSS-Tricks (workflow, cleanup, timeline)
- [Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) — MDN (properties, keyframes, shorthand)
- [How to Animate SVG (CSS, JS, SMIL)](https://www.svggenie.com/blog/svg-animations-complete-guide) — SVG Genie (examples, line drawing, morphing, tools)
- [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) — MDN

---

## Workflow Summary

1. **Design** — Plan what moves and when (hover, load, loop).
2. **Export SVG** — From Illustrator/Figma; keep structure clean.
3. **Clean / optimize** — Run through SVGO; add **classes** (or IDs) to elements you’ll animate.
4. **Inline** — Include SVG in HTML so CSS/JS can target it.
5. **Animate** — Prefer CSS `transition`/`@keyframes`; use JS only when you need sequences or interaction.
6. **Test** — Reduced motion, real devices, and pause controls where appropriate.

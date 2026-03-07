# RIPS Logo Animation Plan (Home Page)

Fun, on-brand animation for the logo on the home page without changing the existing SVG asset.

---

## Current state

- **Asset:** `public/rips-logo-ai.svg` (RIPS script wordmark, green gradients).
- **Usage:** `<Image src="/rips-logo-ai.svg" />` in `app/page.tsx` — static, no DOM access to internal SVG elements.
- **Theme:** Lime primary (`#b2fc15`), green secondary; light background. Casino leaderboard vibe.

Because the logo is loaded via `next/image`, we can only animate the **wrapper** (and optional overlay). No stroke-draw or per-letter stagger unless we later inline an SVG.

---

## Recommended: “Pop in + shine” (wrapper animation)

**Idea:** Logo feels like it “lands” on the page, then gets a quick “win” shine. Optional subtle hover. All CSS, no SVG edits.

### 1. Entrance — “Pop in”

- Start: `opacity: 0`, `transform: scale(0.88)`.
- End: `opacity: 1`, `transform: scale(1)`.
- Timing: ~0.5–0.6s with a slight overshoot (e.g. `cubic-bezier(0.34, 1.56, 0.64, 1)` or Tailwind `ease-out-back` if available).
- Single run on load (`forwards`), no loop.

### 2. One-time “shine” sweep (optional)

- After entrance (e.g. 0.3s delay), a diagonal light stripe sweeps across the logo once.
- Implement with a wrapper `position: relative` and an `::after` pseudo-element: narrow diagonal gradient (e.g. transparent → white/primary 20% → transparent), animated with `transform: translateX(-100%)` → `translateX(100%)` over ~0.6s.
- Mask the shine to the logo area (wrapper `overflow: hidden` and same aspect/size as the image).

### 3. Hover (optional)

- Slight scale up (e.g. `scale(1.04)`) and smooth transition (~0.25s).
- Kept subtle so it doesn’t compete with the CTA buttons.

### 4. Implementation approach

- Add a **client component** (e.g. `components/AnimatedLogo.tsx`) that:
  - Wraps `next/image` for `/rips-logo-ai.svg`.
  - Applies a class for entrance animation (and optional shine/hover).
- Define keyframes and transitions in `globals.css` or a scoped CSS module, using `transform` and `opacity` only (GPU-friendly).
- **A11y:** Respect `prefers-reduced-motion: reduce` — disable or greatly simplify animations (e.g. only fade, no scale/shine).

### 5. Checklist

- [ ] Create `AnimatedLogo` client component wrapping the Image.
- [ ] Add entrance keyframes (scale + opacity) and apply to wrapper.
- [ ] Optionally add shine pseudo-element and keyframes; clip to logo.
- [ ] Optionally add hover scale on wrapper.
- [ ] Add `@media (prefers-reduced-motion: reduce)` overrides.
- [ ] Replace raw `<Image>` in `app/page.tsx` with `<AnimatedLogo />`.
- [ ] Test on a real device and with reduced motion on.

---

## Alternative (future): Letter-by-letter reveal

If you want a stronger “reveal” (e.g. R → I → P → S in sequence):

- Use **inline SVG** (e.g. from `rips-logo.svg`, which is lighter than the AI export).
- Add classes to the four letter regions (each is a `<g>` with clipPath + path; give each `<g>` a class like `letter-r`, `letter-i`, etc.).
- Stagger `opacity: 0` → `1` (or a small scale-in) with `animation-delay` per letter.
- Requires a one-time SVG edit and inlining the SVG in a client component instead of using `next/image`.

This is more work and a larger DOM payload; the wrapper “pop + shine” is the recommended first step.

---

## Summary

| Approach              | Effort | Impact   | SVG change |
|-----------------------|--------|----------|------------|
| Pop in + shine + hover| Low    | High     | No         |
| Letter stagger        | Medium | Very high| Yes (inline + classes) |

Recommendation: implement **Pop in + shine** (and optional hover) in `AnimatedLogo` with reduced-motion support, then consider letter stagger only if you want a more dramatic reveal later.

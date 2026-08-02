---
name: design-direction
description: Portfolio visual direction is "research instrument" — precision over ambient effects; rationale for rejecting glow/particles
metadata:
  type: project
---

As of 2026-08-02 the portfolio was restyled from the common dark + teal-glow +
particle-field developer-portfolio look to a **research-instrument** aesthetic:
hairline engineering grid, near-black surfaces, a real token system, and
JetBrains Mono carrying every figure, label, and identifier against Inter prose.

**Why:** Mohamed asked to "add special effects" to look senior. The site already
had six ambient effects (constellation canvas, ambient pulse, blur glow,
gradient text, floating particles, rotating cube) and that abundance was the
cause of the generic feel, not the cure. The credibility signal for an AI
researcher/engineer is precision and evidence, not glow. Effects were kept only
where they encode real information: an attention-matrix canvas substrate,
pipeline stage diagrams on service cards, metric readouts on case studies, and a
⌘K command palette.

**How to apply:** When adding anything visual here, ask what information it
encodes. Decorative motion, gradient-clipped headings, and emoji icons were all
deliberately removed — don't reintroduce them. All colour goes through tokens in
`src/styles/theme.css`; no raw hex in component stylesheets. Never fabricate
time-series data to draw a chart on this site — a sparkline idea was dropped for
exactly this reason and replaced with meters that render only genuinely
proportional values. See [[user_profile]].

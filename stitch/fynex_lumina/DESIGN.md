# Design System Strategy: The Neon Academic

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Pulse"**
This design system moves away from the static, "boxy" nature of traditional Educational Platforms. Instead, it adopts the persona of a high-performance dashboard—merging the urgency of a gaming interface with the precision of a premium editorial journal. 

We break the "template" look through **Intentional Asymmetry**. Large, bold headings are often offset, and cards utilize varying heights to create a rhythmic vertical flow. The experience should feel like a living organism: glowing, breathing, and reacting to the user’s progress. We are not just building a PWA; we are building a high-tech mentor.

---

## 2. Colors & Surface Architecture

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. 
In this system, boundaries are defined by **Tonal Shifts**. To separate a lesson module from the background, use a shift from `surface` (#0e0e0e) to `surface_container_low` (#131313). 

### Surface Hierarchy & Nesting
We treat the UI as a series of physical layers. Depth is achieved through the following tiers:
*   **Base:** `surface_container_lowest` (#000000) for the deepest background layers.
*   **The Floor:** `surface` (#0e0e0e) for the main application canvas.
*   **The Plate:** `surface_container` (#1a1919) for primary content cards.
*   **The Float:** `surface_bright` (#2c2c2c) for interactive elements that need to pop.

### The "Glass & Gradient" Rule
To achieve a "signature" feel, floating navigation bars and modal overlays must use **Backdrop-Blur-XL**. Use `surface` at 60% opacity combined with a 24px blur. 
*   **Signature Textures:** For high-value CTAs, use a linear gradient from `primary` (#c3ff2d) to `primary_container` (#b2ed12) at a 135-degree angle. This adds "visual soul" and prevents the neon lime from looking flat or "cheap."

---

## 3. Typography: Editorial Authority
We utilize **Inter** with a specific focus on weight and density to convey a sense of high-tech urgency.

*   **Display & Headlines:** Use `ExtraBold` (800) or `Black` (900). 
    *   **Tracking:** Set to `-0.04em` for `display-lg` and `headline-lg`. The letters should almost touch, creating a singular visual block.
*   **Titles:** Use `SemiBold` (600). This provides a clear anchor for lesson titles and module names.
*   **Body:** Use `Regular` (400) for long-form Uzbek text. Ensure line height is set to `1.5` for readability against the dark background.
*   **Uzbek Context:** Given the length of some Uzbek words, avoid forced justification. Use left-alignment to maintain the "editorial" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Do not use shadows to define a card. Use the **Surface Stack**.
*   *Correct:* `surface_container_high` card sitting on a `surface_dim` section.
*   *Incorrect:* A black card with a grey shadow on a black background.

### Ambient Shadows
When an element must float (e.g., a "Start Lesson" FAB), use a **Colored Ambient Glow**. 
*   **Color:** Use `primary` (#c3ff2d) at 12% opacity.
*   **Blur:** 40px to 60px.
*   **Spread:** -5px. 
This creates a "neon underglow" rather than a traditional drop shadow, mimicking a light-emitting screen.

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use a **Ghost Border**: `outline_variant` (#494847) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (The "Action Triggers")
*   **Primary:** `primary` background, `on_primary` text. `xl` roundedness (3rem). No border.
*   **Secondary:** `surface_container_highest` background, `primary` text.
*   **Tertiary/Ghost:** Transparent background, `primary` text, no border.

### Interactive Chips
*   Used for lesson tags (e.g., "Matematika," "Dasturlash"). 
*   Style: `surface_container_low` background with a `sm` (0.5rem) radius. When selected, switch to `primary` background with `on_primary` text.

### Input Fields
*   **Style:** `surface_container_lowest` background. 
*   **Bottom Indicator:** Instead of a full border, use a 2px `primary` line only on the bottom during the `focus` state.
*   **Error State:** Use `error` (#ff7351) for the label and a subtle `error_container` glow.

### Cards (The "Learning Modules")
*   **Constraint:** Forbid divider lines. 
*   **Separation:** Use `md` (1.5rem) spacing between elements within the card.
*   **Edge-to-Edge:** On mobile, cards should touch the screen edges with `0px` radius on the sides if they are part of a vertical scroll list, or use `lg` (2rem) radius if floating.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use the `tertiary` (#ff734a) "Streak" gradient for gamification elements like daily streaks or fire icons.
*   **Do** respect the `safe-area-inset-bottom`. Navigation bars must be padded to avoid overlapping the iOS home indicator.
*   **Do** use **Smooth Spring Animations** (stiffness: 300, damping: 20) for all scale transitions.
*   **Do** ensure the status bar is set to `black-translucent` to allow the background gradient to bleed into the top of the notch.

### Don’t
*   **Don’t** use pure white (#FFFFFF) for body text. Use `Text Primary` (#f4f7df) to reduce eye strain in dark mode.
*   **Don’t** use standard "Material Blue" for links. Every interactive element must be `primary` (Lime) or `tertiary` (Orange).
*   **Don’t** use 1px dividers to separate list items. Use 16px of vertical whitespace or a 2% shift in background tone.
*   **Don’t** use sharp corners. Everything must feel "molded" with a minimum of `1rem` (16px) radius.
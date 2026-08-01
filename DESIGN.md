---
name: HALFSPACE
description: A sharp, street-court design system for mobile-first football commerce.
colors:
  court-cobalt: "#174ba6"
  court-cobalt-deep: "#0d3478"
  action-orange: "#b84320"
  action-orange-hover: "#973116"
  chalk-paper: "#f2f4f5"
  raised-paper: "#e7eaed"
  clean-surface: "#f9faf9"
  floodlight-ink: "#12161c"
  soft-ink: "#3f4752"
  muted-ink: "#66707c"
  boundary-line: "#cbd1d6"
  success: "#287454"
  warning: "#a85b19"
  danger: "#a7362b"
typography:
  display:
    fontFamily: "Bebas Neue, Arial Narrow, sans-serif"
    fontSize: "clamp(4rem, 16vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Bebas Neue, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 8vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.005em"
  body:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Manrope Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1.25
rounded:
  square: "0px"
spacing:
  compact: "8px"
  base: "16px"
  control: "24px"
  section: "72px"
  section-wide: "96px"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.clean-surface}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.action-orange-hover}"
    textColor: "{colors.clean-surface}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.floodlight-ink}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
    height: "48px"
  field:
    backgroundColor: "{colors.clean-surface}"
    textColor: "{colors.floodlight-ink}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
    height: "46px"
---

# Design System: HALFSPACE

## Overview

**Creative North Star: "The Painted Half-Space"**

HALFSPACE feels like a product drop staged on a hard street court: decisive, tactile, and focused on the next touch. Editorial campaign scale and cage-shadow imagery create energy, while square controls and strict boundaries keep the commerce path legible.

The world is bold without becoming noisy. Cobalt owns the atmosphere, chalk neutrals carry information, charcoal supplies authority, and orange appears only where action matters. Product photography is treated as material, not decoration.

**Key Characteristics:**

- Condensed campaign headlines paired with calm, highly legible body copy.
- Court paint, chalk wear, hard light, and directional shadow as recurring material cues.
- Square corners, visible rules, and compact tactile controls.
- One dominant action per decision point.
- Mobile rails that expose the next item and invite a swipe.

## Colors

The palette combines saturated court pigment with chalked neutrals and a rare safety-orange signal.

### Primary

- **Court Cobalt:** Owns hero atmosphere, branded focus, selected states, and large campaign fields.
- **Deep Court Cobalt:** Adds contrast within imagery and supports dark-on-court layering.

### Secondary

- **Action Orange:** Reserved for purchase, submit, and other irreversible forward actions.

### Neutral

- **Chalk Paper:** The default page ground.
- **Clean Surface:** Product cards, fields, and information surfaces that must read clearly.
- **Floodlight Ink:** Primary text, dark navigation, and high-authority controls.
- **Soft and Muted Ink:** Supporting copy and low-priority metadata.
- **Boundary Line:** Dividers, card edges, and field outlines.

**The One-Flare Rule.** Orange identifies the primary forward action; never use it as general decoration or for several competing actions in one viewport.

**The Court Owns the Atmosphere Rule.** Use cobalt in large fields or decisive states, not as a sprinkling of unrelated blue accents.

## Typography

**Display Font:** Bebas Neue (with Arial Narrow fallback)  
**Body Font:** Manrope Variable (with system sans-serif fallbacks)

**Character:** Bebas Neue gives campaigns the compressed urgency of painted venue lettering. Manrope keeps product facts, forms, and administrative work calm and trustworthy.

### Hierarchy

- **Display:** Tight, oversized, and usually uppercase; reserved for hero statements and major product narratives.
- **Headline:** Condensed section titles that create strong scan landmarks.
- **Title:** Heavy Manrope for product names, totals, and card-level hierarchy.
- **Body:** Regular Manrope with generous leading and a readable measure near 65 characters.
- **Label:** Heavy Manrope for buttons, filters, stock, and field labels; sentence case unless a compact campaign label benefits from uppercase.

**The Campaign/Commerce Rule.** Bebas Neue speaks for the brand; Manrope carries every operational detail.

**The Chalk Wear Rule.** Texture may appear inside a single campaign headline, but never on prices, product names, forms, or administrative text.

## Layout

Pages sit in a centered container capped at 1400px with 16px mobile gutters, 24px tablet gutters, and 32px desktop gutters. Section rhythm expands from 72px on compact screens to 96px on large screens. The desktop home page uses an asymmetric 12-column category mosaic; mobile converts the same categories into an edge-to-edge snap rail with the next card visibly peeking in.

Product listings begin at two columns on mobile and grow to three or four columns as space permits. Dense administrative views prefer stacked cards on mobile and tabular alignment only when a wider viewport can support it. Interactive targets stay at least 44px high.

**The Visible-Next Rule.** A horizontal mobile rail must reveal part of its next item; never make swipeable content look like a closed single card.

## Elevation & Depth

The system is flat by default. Borders, tonal separation, hard photographic light, and controlled overlap create depth; the ambient court shadow is reserved for rare lifted surfaces. Glass blur is not part of the material language.

### Shadow Vocabulary

- **Court Shadow:** A broad, low-opacity ambient shadow for genuinely elevated overlays or hero-adjacent feature surfaces.

**The Flat-by-Default Rule.** If a border or tonal step can explain hierarchy, do not add a shadow.

## Shapes

HALFSPACE uses square corners throughout. Cards are hard-edged crops, controls are rectangular and tactile, and borders behave like painted court boundaries. Circles are reserved for semantic objects such as avatars, rating dots, or naturally circular product imagery—not general containers.

## Components

### Buttons

- **Shape:** Square, solid, and at least 48px high.
- **Primary:** Action-orange field with chalk text and heavy Manrope label.
- **Hover / Focus:** Darken the field on hover; use the global orange focus ring with a clear offset.
- **Secondary:** Transparent or surface-filled with an ink border; it must not compete with a nearby primary action.

### Chips

- **Style:** Square filter controls with compact heavy labels and a visible boundary.
- **State:** Unselected chips use a clean surface; selected chips invert to floodlight ink and chalk text.

### Cards / Containers

- **Corner Style:** Square.
- **Background:** Clean surface or chalk paper, chosen for tonal separation.
- **Shadow Strategy:** Flat at rest.
- **Border:** Use boundary lines to connect imagery and product information.
- **Internal Padding:** Compact on mobile, increasing one spacing step on larger screens.

### Inputs / Fields

- **Style:** Clean surface, one-pixel boundary, square corners, and a minimum 46px height.
- **Focus:** Shift the border to cobalt and add a restrained cobalt halo.
- **Error / Disabled:** Use semantic danger at the boundary; disabled controls reduce opacity but retain readable copy.

### Navigation

Navigation uses a floodlight-ink bar with chalk labels and square 44px icon controls. On the smallest screens, search may yield space, but menu, brand, admin access, and bag remain reachable. Active desktop links become brighter rather than acquiring decorative pills.

### Product Rails

Cards snap on mobile, expose the next item, and become a strict grid at medium widths. Imagery carries the atmosphere; names, categories, pricing, stock, and demo disclosure remain clean and direct.

## Do's and Don'ts

### Do:

- **Do** lead major campaign moments with one short, compressed headline.
- **Do** keep the primary action unmistakable and preserve at least 44px touch targets.
- **Do** use authentic product crops, court paint, chalk, and cage shadows to build the world.
- **Do** disclose demonstration products and prices beside the catalog content they describe.
- **Do** preserve square controls and visible boundaries across storefront and admin surfaces.

### Don't:

- **Don't** introduce rounded pill cards, soft gradient blobs, or generic glass panels.
- **Don't** place textured type on operational or data-heavy content.
- **Don't** use multiple orange calls to action at the same hierarchy level.
- **Don't** hide essential mobile destinations behind viewport assumptions.
- **Don't** add motion that delays shopping or ignores reduced-motion preferences.

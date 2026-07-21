# Recipe: Strain Reference Carousel

A three-slide educational reference that never presents a strain name as proof of a specific product's genetics, potency, or effects.

## Required Inputs

- `$Strain`
- `$Source`: the saved reference used for review

## Optional Inputs

- `$Type`
- `$Genetics`
- `$Effects`
- `$Flavors`
- `$THC`: only when copied from an identified source or visible product label
- `$World`

## Slides

1. WIZL finds the name in The Book.
2. Reference profile with explicit "reported" labels and the footer "Names vary by producer and batch."
3. "Read the label. Keep a field note."

Do not render cannabis consumption, seller branding, menus, prices, purchase calls, medical claims, or a realistic product that could be mistaken for an endorsement.

## Command

```powershell
npm run factory:plan -- --recipe strain-carousel --strain "Blue Dream" --source "https://source.example/reference" --type "Hybrid" --world secret-garden
```

The generated caption must retain its source line, adult/legal line, and producer/batch disclaimer. A human must verify every value before generation and again before publishing.

# Recipe: WIZL Wisdom Card

A square editorial card that gives adults one useful, sourceable idea. It should feel like a page from WIZL's Book, not an advertisement.

## Variables

- `$Quote`
- `$World`: `rooftop`, `study`, or `hideaway`
- `$Action`: a quiet character action
- `$Source`: URL or citation saved with the brief

## Outputs

- `card.png`: 1080 x 1080
- `card-vertical.png`: 1080 x 1920
- `caption.md`
- source note in the post manifest or brief

## Image Brief

Use GPT Image 2 with the canonical WIZL reference.

```text
Square editorial storybook poster for an adult educational brand.
Deep navy background, cream typography, emerald accent, subtle paper grain.
Canonical illustrated WIZL occupies the left third in the selected world.
Reserve the right two-thirds for this exact quote:

"$Quote"

- WIZL

Keep the quote large, correctly spelled, and readable on a phone.
No photorealism, product packaging, seller branding, price, smoke cloud,
medical symbol, consumption, or decorative drug iconography.
```

Generate the vertical version as a separate composition. Do not rely on cropping the square card.

## Approved Quote Bank

1. The label starts the story. Your notes finish it.
2. A strain name is a clue, not a guarantee.
3. Producer and batch matter. Write them down.
4. Notice more than the highest number.
5. Your experience is data. Treat it with curiosity.
6. Tolerance is feedback, not a contest.
7. A break can be part of a healthy relationship.
8. If cannabis stops serving you, asking for help is a strong move.
9. Never drive impaired. The Book can wait.
10. Different people can respond differently to the same label.
11. Hydration, food, setting, and timing belong in the field note.
12. The wisest choice is sometimes not today.
13. Curiosity is safer than certainty.
14. The Book remembers what hype forgets.
15. With love, not pressure.

## Caption Pattern

```markdown
[Quote]

[Two or three sentences explaining the idea without medical claims.]

Save this for later, or add your own observation to The Book.

wizl.space
```

Use only age-appropriate platform tags. Avoid sales, intoxication, and location-based shopping tags.

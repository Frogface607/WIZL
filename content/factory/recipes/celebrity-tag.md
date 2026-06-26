# Recipe: Celebrity Tag (Wizl wonders about ___)

**Goal:** Tag celebrities through Wizl's curiosity, never directly. 1× per week. Targets: Snoop Dogg, Berner, Wiz Khalifa, B-Real, Joe Rogan, Seth Rogen, Action Bronson, Method Man, Tommy Chong, Willie Nelson, Eminem (alliteration joke), Hendrix (legacy).

**Variables:** `$Celebrity` (handle), `$Question` (the curiosity), `$Pose` (watching TV | reading book | with headphones | thinking | cooking), `$World` (rooftop | hideaway | study)

**Output:** `content/posts/{Date}-tag-{celeb-slug}/`
- `image.png` — 1:1 square
- `caption.md`

---

## Image (model: `nano_banana_2`, aspect `1:1`)

**Prompt template:**
```
[CHARACTER] WIZL is $Pose in [WORLD]. The scene suggests gentle curiosity, never aggressive — he's daydreaming, wondering, thinking aloud. The orange cat in his satchel matches his mood. Cozy intimate composition.

[STYLE]
```

**Command:**
```bash
higgsfield generate create nano_banana_2 \
  --prompt "$(cat nodes/character.txt) WIZL is $Pose in $(cat nodes/worlds/$World.txt) Composition: cozy intimate scene, golden lamp glow, smoke wisps drifting. $(cat nodes/style.txt)" \
  --image public/mascot.png \
  --aspect_ratio 1:1 \
  --wait
```

---

## Caption template

```markdown
# Main caption (IG / X)
$Question

Tag $Celebrity for me — WIZL is curious 🧙‍♂️🌿

wizl.space

# Hashtags
#wizl #cannabis #celebritytag #${CelebrityHashtag}
```

---

## Examples (from content plan)

| Pose | Celebrity | Question |
|---|---|---|
| watching TV | @snoopdogg | Hmm... I wonder what Uncle Snoop's top 3 strains are right now? |
| reading book | @baboreal | Hey Berner, what's the most unusual strain you've ever tried? |
| with headphones | @eminem | WIZL the Weasel Wizard sharing Weed Wisdom With Love — sounds like Marshall wrote it, no? 😄 |
| thinking | @joerogan | I bet Joe has strong opinions on terpenes. Someone tag him 🧪 |
| cooking | @sethrogen | What would Seth be smoking while making pottery? WIZL needs to know |
| with guitar | @williesneverstop | Willie has been smoking for longer than most of us have been alive. What would he tell young me? |
| in lab coat | @action.bronson | Action — landrace or designer hybrid? WIZL needs your hot take. |

---

## Rules

- Never beg for a follow / mention. Just ask a *real* question.
- Wizl is the curious one, Сергей is invisible.
- One celebrity per post. Don't spam tags.
- If the celebrity replies → frame as community moment, never "look who replied!"
- Don't tag cannabis brands of competitors (Cookies, Stiizy, etc.) directly. Tag people, not businesses.

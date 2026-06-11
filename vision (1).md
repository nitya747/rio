# whisper — UI Vision

---

## The Feel

whisper is a chat app that feels like a hug. Every screen should feel like you're touching something soft and real — not pixels on a flat screen, but actual little clay objects sitting in space, casting shadows, pushing back when you press them. The aesthetic is **claymorphism**: everything is inflated, rounded, tactile, and playful. Nothing is sharp. Nothing feels corporate. It's warm, it's cozy, it's made for friends.

The overall emotion the UI should evoke: *stepping into a friend's bedroom that's been decorated with care.*

---

## Color Palette

The entire app lives in a world of soft lavender and warm cream.

| Role | Color | Description |
|---|---|---|
| Background | `#C4B0EC` | Muted, dusty lavender — warm, not cold |
| Background top wash | `#D0BDEE` | Slightly lighter dome at the top of screens |
| Main card surface | `#F2EDE4` | Warm off-white, like parchment or fresh cream |
| Input / secondary surfaces | `#EAE4F5` | Pale lavender tint for fields and inner cards |
| Primary purple | `#9B7FE8` | The action color — buttons, icons, tab selections |
| Primary purple shadow | `#7459C2` | The thick bottom shadow under primary elements |
| Card shadow | `#A98FD4` | The pressed-clay shadow beneath main cards |
| Hover state | `#DDD5F0` | Light lavender — all hover interactions |
| Heading text | `#4A3580` | Deep purple, not black — warm and themed |
| Muted text / labels | `#9B8EC4` | Softer purple for subtitles and metadata |
| Hint / placeholder | `#C0B4E0` | Very light lavender for placeholder copy |
| Sparkle / accent gold | `#E9B84A` | Used sparingly for star accents and sparkles |
| Online green | `#4ADE80` | Status dot for active users |
| Idle yellow | `#FACC15` | Status dot for idle users |

No blacks. No grays. Every shade of "dark" in this app is a deep purple. Every shadow is a purple. The world is consistently, fully lavender.

---

## Typography

**Font: Nunito**

Nunito is the only typeface used throughout. It's rounded, friendly, and has just enough personality without being childish. The weights used:

- **900 (Black)** — Screen titles, room names, button labels, tab text. This is the workhorse weight.
- **800 (ExtraBold)** — Card headings, usernames, key labels.
- **700 (Bold)** — Body copy, subtitles, metadata.
- **400 (Regular)** — Long-form text if needed in chat bubbles.

Type is never black. Headings are `#4A3580`, body is `#9B8EC4`, placeholders are `#C0B4E0`.

Letter-spacing on section labels: `1px`, all uppercase, tiny — these act as quiet wayfinding, not headlines.

---

## The Mascot Character

The heart of Bubbly's visual identity is its chibi character — a small, soft girl rendered in 3D clay style.

**Her design:**
- Round clay face with warm skin tone (`#FDE8D0`)
- Big, dark, round eyes — expressive but not oversized anime eyes. Warm brown irises, white highlight dot.
- Rosy pink blush circles on both cheeks, with tiny subtle freckles
- Brown hair, side-swept with a soft wave — a flower clip accessory on the left side
- Hair flows into two loose pigtail sections at the sides
- Lavender hoodie matching the app's color — with a small heart badge and drawstring detail
- Light blue jeans, purple-tipped sneakers
- Holding a small white mug with a star on it
- Bracelet detail on her wrist

**How she appears in the UI:**
- She always **peeks from above** the main card — arms resting on the card's top edge, body hidden behind it, face and hair fully visible above
- She never floats freely — she is always anchored to a surface, giving her physical presence
- She is the first thing you see on every main screen

Her role is not decoration. She is the emotional anchor of the app. She makes the interface feel inhabited, like someone lives here.

---

## Surface & Depth System

The claymorphism depth system works on one principle: **every element casts a thick, solid, colored bottom shadow** — like a physical object sitting on a table.

### The Rules of Depth

**Primary buttons** sit highest. They have:
- A `7–8px` solid bottom shadow in a darker shade of their fill color
- A subtle spread shadow below that for air beneath them
- When pressed, they travel *down* — shadow shrinks, button translates downward. It physically depresses.

**Cards** are the mid layer. They have:
- A `10–12px` solid bottom shadow in `#A98FD4`
- They feel like thick slabs of clay sitting on the background

**Input fields and secondary surfaces** are recessed. They use:
- An inward `inset` shadow — they feel pressed *into* the card, not sitting on it
- Background slightly darker than the card (`#EAE4F5` inside `#F2EDE4`)

**The background** is the floor. It never has shadows. It just exists as the lavender world everything else lives on.

---

## Decorative World Elements

Floating around the main card on every screen are soft 3D clay world elements. These live on the background, outside the card, and give the screen a sense of being inside a scene rather than a flat interface.

**Clouds** — two or three soft white puffy clouds float near the top of the screen. They overlap slightly, have a faint lavender underside shadow, and vary in size. They are present on every screen.

**The Plant** — a leafy green potted plant in a warm terracotta pot sits at the bottom left of most screens. Leaves are simple rounded shapes, layered for depth. The pot is clay-textured with a warm brown tone.

**The Pink Flower** — a pink flower in a small terracotta pot sits at the bottom right. Petals are rounded ovals arranged radially, with a yellow center circle. Both the plant and flower are partially off-screen — they peek in from the edges, not centered.

These elements are not interactive. They are the scenery of Bubbly's world.

---

## Screen Anatomy

Every screen in Bubbly follows the same structural logic:

```
[ Background — soft lavender ]
    [ Clouds — floating top left and right ]
    [ Main Card — cream white, tall, rounded 36px corners ]
        [ Chibi — peeking above the card top edge ]
        [ Screen title + sparkle accents ]
        [ Subtitle ]
        [ Primary UI content ]
    [ Plant — bottom left, partially off-screen ]
    [ Flower — bottom right, partially off-screen ]
```

The card is always centered with `18px` margin on each side. It always has a `12px` solid purple-toned shadow beneath it. It always has `36px` border radius.

---

## Interactive States

**Hover:** All hover states use lavender tints — `#EAE4F5` for surfaces, `#DDD5F0` for deeper hover, `#A98FEC` for primary colored elements. Nothing ever goes gray or black on hover.

**Active / Pressed:** Elements physically move downward by `3–4px` and their bottom shadow reduces to match. This simulates the clay being pushed down.

**Selected chips and tabs:** Selected state uses the primary purple `#9B7FE8` fill with white text and a hard bottom shadow. Unselected is the recessed lavender surface.

**Tab switcher:** Sits inside a recessed pill container with inset shadow. The active tab floats up slightly above the container — selected tabs live above, unselected tabs live in the recess.

---

## The Join / Create Room Screen

This is the first screen friends encounter when they open Bubbly.

**Join tab:** Minimal and focused. A friendly icon, a short line of copy inviting the user to enter their code, and a single input field with a key icon. One primary action button. One ghost button for browsing public rooms. No clutter.

**Create tab:** A form inside a card with fields for room name, description, an emoji picker (tappable clay tiles), and a privacy selector (Public / Private / Invite Only). Two buttons at the bottom — a primary Create Room and a ghost Surprise Me for random generation.

**The emoji picker** tiles are small clay squares. Unselected: lavender recessed. Selected: purple, floating up, slightly scaled up.

**The privacy chips** behave identically — selected floats up in purple, unselected rests in the lavender recess.

---

## Voice & Tone of Copy

The words in the UI match the visual warmth.

- "Find Your Room" — not "Search"
- "Join a cozy room or create one for your squad" — not "Enter a room code or create a new room"
- "Pop it in below" — casual, friendly
- "Surprise me" — playful
- "What's this room about?" — conversational placeholder, not "Description"

Every label, placeholder, and button should sound like a friend texting you — not a product manager writing requirements.

---

## What Bubbly Is Not

- It is not dark mode (the world is always soft and warm)
- It is not minimal or cold — whitespace exists but everything in it is expressive
- It is not sharp — 36px card radius, 18px button radius, 14px chip radius, everything is round
- It is not gray — gray does not exist in this palette
- It is not corporate — no san-serif neutrality, no flat icon sheets, no generic UI kit

---

---

## Inside a Room — The Chat Conversation Screen

This is where Bubbly lives and breathes. It is the screen users will spend the most time on, so it has to feel effortlessly comfortable — like a cozy corner you never want to leave.

### The Atmosphere

The chat screen does not follow the full card-on-background layout. Here, the lavender background IS the screen. The conversation floats directly on it, no wrapping card. The clouds remain at the top — they are always present, the sky of Bubbly's world. The plant and flower are gone here; the space is given entirely to conversation.

### The Top Bar

A soft cream pill-shaped header floats at the top of the screen with a thick purple shadow beneath it — it feels like a clay name tag pinned to the top. It contains:

- A back arrow on the left, inside its own small lavender clay circle button
- The room's chosen emoji in a small colored clay tile
- The room name in bold deep purple (`#4A3580`, weight 900)
- A small member count below the name in muted purple — "12 members" — with a tiny green dot if anyone is online
- A settings icon button on the right, same lavender clay circle style as the back button

The header never disappears. It is always visible, always grounding.

### Message Bubbles

Message bubbles are the main clay elements of this screen. They are thick, soft, rounded — not flat chat rectangles.

**Received messages** (from others):
- Cream white (`#F2EDE4`) bubble, sitting on the left
- `20px` border radius on all corners except the bottom-left which has `6px` — giving the "speech tail" impression through shape alone, no literal triangle tail
- A `4px` solid bottom shadow in `#C8BAEB` — they sit just above the background
- The sender's name appears above in tiny muted purple, weight 800
- A small clay avatar circle sits to the left of the bubble — the sender's initial or emoji in a lavender circle with a purple shadow

**Sent messages** (the user's own):
- Primary purple (`#9B7FE8`) bubble, sitting on the right
- Same radius logic but the bottom-right corner is `6px`
- Bottom shadow in `#7459C2`
- No name label — it's yours, you know who you are
- White text inside, weight 700

**Timestamps** appear centered between message clusters — tiny, muted, uppercase, `10px`. They feel like small clay stamps pressed lightly into the screen.

**Emoji-only messages** are displayed larger — the emoji sits alone, no bubble behind it, just floating with a subtle drop and the slight scale-up that makes it feel like a real sticker placed on the conversation.

### The Input Area

At the bottom of the screen lives the message composer. It is a floating cream clay bar — same material as the main card — with a thick purple shadow lifting it off the background. It never feels stuck to the bottom; it floats just above it.

Inside the bar:
- A lavender recessed input field (`#EAE4F5`) with inset shadow, placeholder text in `#C0B4E0` that reads "Say something cozy..."
- To the left of the input: a small purple clay circle button with an emoji/sticker icon
- To the right of the input: a purple clay send button — a rounded square, not a circle — with a paper plane icon in white and a hard `5px` shadow beneath it. When pressed, it depresses and springs back.

The input bar has `16px` rounded corners on the outer container and `12px` on the input field itself.

### Reactions

Tapping and holding a message reveals a floating reaction bar — a small cream clay pill that rises above the message with six emoji options inside lavender circle tiles. Selecting one attaches a small reaction bubble beneath the message, showing the emoji and a count. Reaction bubbles are tiny clay chips in cream with a purple count label.

### The Scroll Experience

The conversation scrolls freely. As the user scrolls up through history, the header remains pinned. A very subtle lavender gradient at the very top and bottom of the message area softly fades older content — like the edges of a notepad.

---

## Room Settings / Info Screen

This screen is the room's identity card. It feels more still and organized than the chat — less about movement, more about place.

### Layout

Unlike the chat screen, Room Settings returns to the full card-on-lavender-background layout. The main cream card fills most of the screen. The chibi does not appear here — instead, the room's chosen emoji is displayed large and centered at the top of the card, inside a big lavender clay tile with a deep shadow, like a badge of identity. It is the room's face.

### Room Identity Section

At the very top of the card:
- The large emoji badge — `72px` tile, `24px` border radius, `#EAE4F5` background, `8px` shadow in `#C8BAEB`
- The room name below it in large bold deep purple, centered, weight 900
- The room description in muted purple below that, centered, weight 700
- A small privacy chip (Public / Private / Invite Only) — a tiny clay pill in the appropriate color sitting centered below the description
- The room's invite code displayed in a recessed clay field with a copy icon on the right — tapping the copy icon gives a brief press animation

### Settings Rows

Below the identity section, settings are displayed as a vertical stack of cream clay rows, each with:
- A left-aligned purple icon circle (same style as input field icons)
- A label in deep purple, weight 800
- A right-side value or toggle
- A `5px` bottom shadow separating each row from the next — they stack like physical cards in a pile

Settings include: room name, description, privacy type, notification preference, and room color/emoji.

Toggles are clay-style — a lavender track with a white thumb pill that slides with a slight bounce. When on, the track fills to primary purple.

### Danger Zone

At the bottom of the card, separated by a faint lavender divider, sits a single ghost-style button in a warm muted red: "Leave Room." It uses the same clay button style but with a warm rose tint (`#F5C0C0` fill, `#E8A0A0` shadow) rather than purple. It is small and unobtrusive — present but never calling attention to itself.

---

## Notifications Screen

Notifications in Bubbly feel like little gift tags — each one is a soft clay card carrying a small piece of news.

### Layout

Full card-on-lavender layout. The chibi does not appear on this screen. Instead, a large clay bell icon — in the same lavender tile style as the room emoji badge — sits at the top of the card. A small golden sparkle orbits it if there are unread notifications, adding a tiny pulse of life.

The title reads "What's New ✦" in the same sparkle-flanked style as other screen titles.

### Notification Cards

Each notification is its own small clay card inside the main card:
- `#EAE4F5` background, `18px` border radius, `5px` bottom shadow in `#C8BAEB`
- On the left: a colored emoji tile representing the room the notification is from — same small clay tile style used throughout
- Center: the notification text — sender name in deep purple weight 900, action text in muted purple weight 700 on the line below. e.g. "Priya 🌙" on top, "sent a message in Music Vibes" below
- Right: a tiny timestamp in muted purple, and a small lavender dot if unread

**Unread notifications** have a thin left border in primary purple `#9B7FE8` — not a full highlight, just a quiet signal on the left edge of the card.

**Read notifications** appear identical but without the left border and dot, and their background is slightly more transparent — `#F2EDE4` rather than `#EAE4F5`.

### Empty State

When there are no notifications, the chibi appears — this time sitting fully visible (not peeking), holding a small sign that reads "All caught up! 🌸" in her handwriting-style. The sign is a cream clay card she holds in both hands. This is one of the few places she appears in full body.

### Grouping

Notifications are grouped by day. Day labels ("Today", "Yesterday", "Monday") appear as small centered clay chips — lavender background, muted purple text, weight 900 — floating between groups like gentle section markers.

---

## Members List Screen

The members list is the most social screen in Bubbly after the chat itself. It should feel like looking at a group photo — warm, personal, full of personality.

### Layout

Full card-on-lavender layout. No chibi at the top. Instead, a row of overlapping member avatar circles peeks above the card top edge — three to four of them, each slightly offset, each with a white border and a purple shadow beneath. They replace the chibi as the "above the card" element on this screen, giving the card a social, communal energy.

The title inside the card reads "Who's Here 💜" in the standard sparkle style.

A small member count chip — lavender clay pill, muted purple text — sits just below the title: "14 members."

### The Members

Each member is displayed as a horizontal clay row inside the card:
- A circular avatar on the left — if the user has set a custom chibi emoji or color, it shows here. Otherwise it's their initial in a lavender circle with a deeper purple letter
- Online status dot overlaid on the bottom-right corner of the avatar — green for online, yellow for idle, no dot for offline
- Name in deep purple, weight 900
- Role label below — "Room Owner," "Member" — in muted purple, weight 700
- If the member is the room owner, a small golden crown emoji sits to the right of their name — not a badge, just the crown, lightly placed

The rows themselves are not bordered cards — they are simply spaced entries with a very faint lavender divider line between them. The list feels open and airy, not boxed.

### Sections

Members are grouped into two quiet sections:
- **Online now** — members currently active, listed first
- **Offline** — members not currently in the room

Section labels follow the same small uppercase, `1px` letter-spacing, muted lavender style used throughout. No visual drama — just quiet wayfinding.

### The Room Owner

The room owner's row has one extra touch: their avatar circle has a faint golden ring around it — a `2px` border in `#E9B84A`. Subtle. Like a quiet crown without the weight.

---

## The Create / Join Room Screen *(Already Built — Reference)*

Documented here for completeness. See the interactive prototype for the full visual reference.

**Join tab:** Lavender background, cream card, chibi peeking above. Single invite code input with purple key icon circle. One primary Join Room button, one ghost Browse Public Rooms button. Minimal, focused, warm.

**Create tab:** Room name field, description field, emoji picker tiles, privacy type chips. Two action buttons — primary Create Room, ghost Surprise Me. All inside the same cream card, same chibi above.

The character on this screen holds a star mug and wears her lavender hoodie. She peeks with arms resting on the card edge — curious and welcoming, like she's waiting to see what room you'll create.

---

## Emotional Arc Across Screens

Each screen in Bubbly has an emotional role:

| Screen | Emotional Role |
|---|---|
| Join / Create Room | Anticipation — something new is beginning |
| Inside a Room | Belonging — you're here, with your people |
| Room Settings | Ownership — this is your space, shape it |
| Notifications | Being remembered — your friends thought of you |
| Members List | Community — look at everyone who showed up |

Every design decision — the clay depth, the lavender world, the chibi, the warm copy — should serve these emotional roles. A screen that looks right but feels wrong has missed the point.

---

*whisper is a place. Design every screen like you're decorating a room your friends will love coming back to.*

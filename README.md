# Rio 🌸 — A Cozy Claymorphic Real-Time Chat Application

### 🔗 Live Demo: [rio-gilt.vercel.app](https://rio-gilt.vercel.app/)

Rio is a real-time, squad-based chat application designed to feel like a warm hug. Stepping into Rio feels like entering a friend's decorated room — inflated shapes, rounded clay elements, soft shadows, and comforting interactions replace the sharp, cold, corporate feel of modern messaging tools.

Built with **Next.js 16**, **React 19**, and **Supabase**, Rio combines a premium hand-crafted visual design system with robust, real-time messaging, emoji/text-based kaomoji composers, threaded replies, status presence syncing, and customizable chat spaces.

---

## 🎨 Design System & Aesthetics

Rio's design language is built on the principles of **Claymorphism**: everything is thick, soft, tactile, and playful.

- **Warm Lavender Palette**: The application lives in a world of soft lavender and warm cream. It uses a curated palette of cream white surfaces (`#F2EDE4`), dusty lavender backgrounds (`#C4B0EC`), pale lavender inputs (`#EAE4F5`), and primary purple action tones (`#9B7FE8`). Pure black and gray do not exist.
- **Tactile Shadows**: Interactive elements sit raised like clay blocks, casting a thick solid bottom shadow. When hovered or pressed, elements physically translate downwards, and their shadows shrink to provide realistic micro-mechanical feedback.
- **Organic Scenery**: SVGs of floating puffy clouds, potted leafy plants, and pink flowers peek in from screen edges to surround the main interface card.
- **Mascot Companion**: A cozy chibi mascot peeks curiously from the top of onboarding cards, holding a mug and adding warmth to the user experience.

---

## ✨ Features

### 1. Cozy Lobby & Onboarding
- **Multi-Step Onboarding**: A user setup card guiding users through choosing a username, selecting an avatar emoji (out of 16 cozy options), and choosing whether to create a new room or join an existing one.
- **Surprise Me `✨`**: Automatically generates creative cozy room names and matching descriptions (e.g. *Tea Corner*, *Study Sanctuary*, *Cloud Watching*) at the tap of a button.
- **Customizable Room Spaces**: Configure the room name, description, privacy mode (Public, Private, Invite), and select a matching category icon from a clay tile selector grid.
- **Public Room Browser**: Browse and instantly join active public rooms fetched in real-time from the database.

### 2. Real-Time Chat Experience
- **Supabase Real-Time Engine**: Fully synchronous message delivery, updates, and deletions with zero page refresh.
- **Room Info & Shareable Codes**: A tag-like header pins room metadata, alongside a room code badge. Clicking the badge copies the invite code to the clipboard with an instant checkmark feedback animation.
- **Cozy Chat Bubbles**: Received messages appear in cream bubbles with a custom speech-tail border on the left; sent messages appear on the right in primary purple.
- **Sticker-Mode Emojis**: Messages containing only emojis are automatically styled larger and borderless, floating directly on the message feed like physical stickers.
- **Active Squad Sidebar**: A slide-out panel displays the list of users currently in the room.

### 3. Dynamic Message Interactions
- **Quick Likes**: Double-tap/double-click any message bubble to instantly trigger a heart-pop animation and increment its like count.
- **Reactions Drawer**: Tap/click a message to reveal a floating clay bar featuring 6 express reaction emojis (❤️, 👍, 😂, 😮, 😢, 🎉) that display dynamically grouped below the message.
- **Threaded Replies**: Reply to messages to create visual threads. Clicking a reply preview smoothly scrolls and flashes the original parent message in the chat history.
- **Typing Indicators**: Real-time broadcasts show when room members are typing, showing an animated typing bubble that automatically disappears.
- **Jump-to-Latest Alert**: A floating button appears when older history is scrolled, alerting users to new messages and letting them scroll to the bottom instantly.

### 4. Interactive Composer
- **Dual-Tab Emoji Picker**: A popover panel featuring two tabs:
  - **Emojis**: A quick-select grid of over 150 emoticons.
  - **Kaomojis**: Cute Japanese character emoticons (e.g., `(❁´◡`❁)`, `(=^･^=)`, `(っ.❛ ᴗ ❛.)っ`).
- **Cursor Injection**: Automatically inserts selected emoticons at the input field's active cursor position.

### 5. Squad Directory Page (`/room/[id]/members`)
- A dedicated squad list page showing everyone who has ever participated in the room.
- Users are grouped by online status (*Online Now* vs. *Offline*).
- The **Room Owner** is highlighted with a custom golden ring around their avatar and a golden crown emoji next to their name.
- Displays overlapping avatars peeking from the top of the card.

### 6. Room Settings & Preferences (`/room/[id]/settings`)
- Dedicated administration panel to view room privacy, description, and created-by metadata.
- Interactive toggle sliders to adjust local preferences: **Mute Notifications** and **Sound Effects**. Preferences are persisted in the browser's local storage.
- A styled danger zone with a "Leave Room" option.

### 7. Global Notifications Inbox (`/notifications`)
- A centralized dashboard tracking recent messages across all of your active rooms.
- Grouped neatly by time headers (*Today*, *Yesterday*, *Earlier*) inside clay chips.
- Unread notifications are highlighted with a purple left border and status dot.
- Features a full-body mascot empty state when there are no new notifications.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Backend & Sync**: [Supabase](https://supabase.com/) (Database, Realtime channels, Presence)
- **Styling**: Vanilla CSS with Custom Properties (Design Tokens)
- **Icons**: [@hugeicons/react](https://hugeicons.com/) (Hugeicons Core Free set)
- **Utilities**: `nanoid` (for short-code room IDs)
- **Type Safety**: TypeScript

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/nitya747/rio.git
cd rio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Schema Setup
Execute the SQL code found in [schema.sql](file:///c:/Users/Nitya/OneDrive/Desktop/chat-app/schema.sql) in your Supabase SQL Editor. This will:
1. Create the `rooms` and `messages` tables.
2. Setup Row Level Security (RLS) policies allowing public read, insert, and update actions.
3. Configure the PostgreSQL Realtime replication channel for the `messages` table.

> [!IMPORTANT]
> Make sure to explicitly enable **Realtime** replication for the `messages` table in your Supabase console (*Database -> Replication -> supabase_realtime*) if you run into any replication syncing issues.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience Rio!

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   └── rooms/
│   │       └── route.ts         # Room creation endpoint (nanoid generation)
│   ├── room/
│   │   └── [id]/
│   │       ├── members/
│   │       │   └── page.tsx     # Room members squad list page
│   │       ├── settings/
│   │       │   └── page.tsx     # Room configurations & local preferences
│   │       ├── RoomPageClient.tsx # Real-time chat workspace
│   │       └── page.tsx         # Server wrapper for room page
│   ├── notifications/
│   │   └── page.tsx             # Global notifications inbox
│   ├── layout.tsx               # Next.js Root layout
│   ├── page.tsx                 # Lobby/onboarding main page
│   └── globals.css              # Custom claymorphism styling stylesheet
├── lib/
│   ├── supabase.ts              # Supabase Client instantiation
│   └── safeStorage.ts           # Safe localStorage wrapper for Next SSR
├── public/
│   ├── rio_mascot.png           # Peeking chibi mascot image
│   └── chibi_full.png           # Full body empty state mascot image
├── schema.sql                   # Database setup instructions
└── package.json                 # Dependency list
```

---

## 📄 License
This project is open-source and available under the MIT License.

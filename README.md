<div align="center">

# 🧱 Brick by Brick

### Learn to build, publish and *monetize* a Roblox game — with Claude Code as your pair programmer.

A free, self-paced course website. **52 lessons · 14 modules · a 12-week roadmap · 23 copy-ready AI prompts · quizzes, checklists and an earnings calculator.** Your progress saves itself in the browser — no account, no sign-up, no tracking.

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Roblox](https://img.shields.io/badge/Roblox-Luau-00A2FF?style=for-the-badge&logo=roblox&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)

<br/>

[**▶ Run it locally**](#-quick-start) · [**📚 What you'll learn**](#-the-curriculum) · [**🗂 Project structure**](#-project-structure) · [**➕ Add a lesson**](#-authoring-adding-your-own-lessons)

</div>

---

## ✨ Why this exists

Most "learn Roblox" content stops at `print("Hello world")`. **Brick by Brick** takes you from installing Studio to **cashing out real money through DevEx** — and it teaches you to do it *alongside an AI coding assistant* instead of pretending AI doesn't exist.

It is opinionated, project-driven, and honest about the parts that make money and the rules that protect it.

| | |
|---|---|
| 🎯 **Ship, don't just study** | Two full games you actually publish: a themed **obby** and a **coin simulator** — each with a working monetization hook. |
| 🤖 **AI-native workflow** | A safe, repeatable way to direct **Claude Code** inside Roblox Studio through Studio's built-in MCP server. |
| 💰 **Follows the money** | Game passes vs. developer products, a *correct* `ProcessReceipt`, fair pricing, the paid-random-items rule, and the DevEx cash-out step by step. |
| 🧠 **Prompts that teach** | 23 reusable prompts written so you *learn while you build* instead of blindly pasting code. |
| 💾 **Zero friction** | Pure front-end. Progress, quiz answers and per-lesson notes live in `localStorage`. Open a link, start learning. |
| ♿ **Built properly** | Keyboard skip-links, ARIA labels, screen-reader text, light/dark/system themes, mobile-first navigation. |

---

## 🚀 Quick start

> Requires [**Node.js 18+**](https://nodejs.org).

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev
```

Then open the URL it prints (usually **http://localhost:5173**).

### Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run build` | Produce an optimized static site in `dist/`. |
| `npm run preview` | Serve the production build locally to sanity-check it. |

---

## 🌐 Deploy it anywhere

The build is fully static — host the `dist/` folder on any static host.

**Vercel** · **Netlify** · **GitHub Pages** · **Cloudflare Pages** · any S3 bucket.

This repo ships a [`vercel.json`](./vercel.json) with an SPA rewrite so page reloads and deep links never 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> 💡 The app also uses hash routes (`#/...`), so it works even on hosts with **no** rewrite support — just drop `dist/` and go.

---

## 📚 The curriculum

**14 modules → 52 lessons**, ordered so each one builds on the last. Every module ends with you a little closer to a published, earning game.

| # | Module | What you walk away with |
|---|--------|-------------------------|
| 00 | 🔵 **Start here** | How the course works, how Roblox pays creators, and the ship-it mindset. |
| 01 | 🔴 **Setup your workshop** | Roblox Studio + Claude Code installed and talking through Studio's MCP server. |
| 02 | 🟡 **Roblox Studio basics** | The editor, parts & properties, core services, and staying safe with free models. |
| 03 | 🟢 **Luau, the language** | Values, logic, loops, functions, tables, modules, events and errors — enough to read *and* write scripts. |
| 04 | 🔵 **How Roblox games work** | Server vs. client, RemoteEvents, never trusting the client, characters and touch events. |
| 05 | 🔴 **Saving player data** | `DataStoreService` done right: load, save, autosave, shutdown saves, and when to use a library. |
| 06 | 🟡 **Making UI** | Phone-friendly `ScreenGui`s, a live coin counter, and a shop panel that slides in. |
| 07 | 🟢 **Game design that earns** | Core loops, the first 60 seconds, retention, picking a genre you can finish, and a one-page design doc. |
| 08 | 🔵 **Building with Claude Code** | A safe, repeatable AI workflow inside Studio — and the mistakes AI code makes. |
| 09 | 🔴 **Project 1 — Themed obby** | A *published* game: stages, lava, saved checkpoints, a stage counter and a Skip-Stage product. |
| 10 | 🟡 **Project 2 — Coin simulator** | A collect → upgrade loop, server-checked purchases, a 2× Coins pass, plus rebirth/pet ideas. |
| 11 | 🟢 **Monetization & cash-out** | Passes vs. products, a correct `ProcessReceipt`, fair pricing, and DevEx step by step. |
| 12 | 🔵 **Publishing & growth** | A convincing game page, reading analytics, update rhythm, and first players for free. |
| 13 | 🔴 **Rules that protect your income** | What gets games removed and DevEx rejected — and the habits that keep your account safe. |

### Beyond the lessons

- 🗺️ **12-Week Roadmap** — a realistic week-by-week plan that maps the modules onto a schedule.
- 🧰 **Prompt Library** — every AI prompt in the course, collected and searchable in one place.
- 📖 **Glossary** — plain-English definitions plus links to official Roblox & Claude Code docs.
- ✅ **Checklists & quizzes** — check your understanding and track what's done, lesson by lesson.
- 🧮 **Earnings Calculator** — play with Robux → USD assumptions to set expectations honestly.

---

## 🧩 Tech stack

| Layer | Choice | Why |
|---|---|---|
| **UI** | React 18 | Component-driven lesson/block rendering. |
| **Build** | Vite 6 | Instant dev server, tiny optimized output. |
| **Routing** | Custom hash router (`src/lib/router.js`) | Zero-dependency, host-anywhere deep links. |
| **State** | React hooks + `localStorage` (`src/lib/progress.js`) | Progress, notes and quiz results with no backend. |
| **Content** | Plain JS data modules (`src/content/*.js`) | Lessons are data, not markup — trivial to edit and extend. |
| **Styling** | One hand-written `styles.css` | Light / dark / system themes, fully responsive. |
| **Code blocks** | Custom Luau highlighter (`src/lib/highlight.js`) | Readable code samples without a heavy dependency. |

No UI framework, no state library, no CSS framework — just a lean, legible front end.

---

## 🗂 Project structure

```
roblox-dev-academy/
├─ index.html              # app shell + fonts + favicon
├─ vite.config.js          # base: './' so it runs from any folder/host
├─ vercel.json             # SPA rewrite (no 404 on reload)
├─ public/                 # static assets copied as-is
└─ src/
   ├─ main.jsx             # React entry point
   ├─ App.jsx              # layout, routing, theme + progress wiring
   ├─ styles.css           # the entire theme (light/dark/system)
   │
   ├─ content/             # 👉 ALL course text, code & quizzes live here
   │  ├─ index.js          #    module order + derived lists (lessons, prompts…)
   │  ├─ m00-start.js …    #    one file per module (m00 → m13)
   │  ├─ roadmap.js        #    the 12-week plan
   │  └─ glossary.js       #    glossary + official links
   │
   ├─ components/          # page & block components
   │  ├─ Pages.jsx         #    Home, Lesson, Roadmap, Prompts, Glossary
   │  ├─ Blocks.jsx        #    renders each content block type
   │  ├─ Sidebar.jsx       #    module/lesson navigation
   │  ├─ Quiz.jsx          #    interactive quizzes
   │  ├─ EarningsCalculator.jsx
   │  └─ BrickTower.jsx    #    the brick-by-brick progress visual
   │
   └─ lib/                 # the small amount of plumbing
      ├─ router.js         #    hash router hook
      ├─ progress.js       #    localStorage progress/notes
      ├─ theme.js          #    light/dark/system theme hook
      ├─ highlight.js      #    Luau syntax highlighter
      └─ inline.jsx        #    inline **bold**, `code`, [links]
```

---

## ➕ Authoring: adding your own lessons

Lessons are **data**, not components. Open any module file in `src/content/` and add an object to its `lessons` array:

```js
{
  id: 'my-lesson',
  title: 'My lesson',
  minutes: 10,
  blocks: [
    { type: 'p', text: 'Text with **bold**, `code` and [links](https://create.roblox.com).' },
    { type: 'code', title: 'ServerScriptService/Example', code: 'print("hi")' },
    { type: 'prompt', text: 'A prompt for Claude Code' },
    { type: 'callout', tone: 'tip', text: 'tone can be tip, warn, info, money or godot' },
    { type: 'checklist', id: 'unique-id', items: ['Step one', 'Step two'] },
    { type: 'quiz', id: 'quiz-id', questions: [
      { q: 'Question?', options: ['A', 'B'], answer: 0, why: 'Because…' },
    ]},
    { type: 'notes' },
  ],
}
```

**Available block types:** `p` · `h` · `h3` · `list` · `olist` · `steps` · `code` · `prompt` · `callout` · `checklist` · `quiz` · `table` · `calculator` · `notes`

Prompts and quizzes are picked up automatically — a new `prompt` block appears in the Prompt Library with no extra wiring.

---

## 🧮 Reality check on the money

Roblox payout rates, DevEx rules and the Studio MCP setup were verified against official **Roblox** and **Claude Code** documentation in **October 2026**. These numbers change over time — **re-check the links on the Glossary page before making any money decisions.** This course sets honest expectations; it doesn't promise overnight riches.

---

## 🤝 Contributing

Found a typo, an outdated rate, or want to add a lesson? PRs welcome. Because content is plain JS data, most contributions are a few lines in a `src/content/*.js` file — no React knowledge required.

---

## 📄 License

Released under the **MIT License** — use it, fork it, teach with it.

<div align="center">
<br/>

**Built brick by brick. 🧱 Now go ship a game.**

</div>

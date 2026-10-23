export default {
  id: 'design',
  title: 'Game design that earns',
  color: 'green',
  summary: 'Core loops, the first 60 seconds, retention, picking a genre you can actually finish, and writing a one-page design doc.',
  lessons: [
    {
      id: 'core-loop',
      title: 'The core loop',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'A **core loop** is the action players repeat over and over. If the loop feels good for 10 minutes, players stay, Creator Rewards pay you, and some players buy things. If it does not, nothing else saves the game.' },
        { type: 'table', head: ['Genre', 'Core loop', 'Why it monetizes'], rows: [
          ['Obby', 'Jump → fail → retry → reach checkpoint', 'Skip-stage products, cosmetic trails, VIP areas'],
          ['Simulator', 'Collect → sell → upgrade → collect faster', 'Multipliers, pets, auto-collect passes'],
          ['Tycoon', 'Earn → buy a building piece → earn more', 'Faster income passes, exclusive buildings'],
          ['Co-op horror', 'Explore → hide → escape together', 'Revives, cosmetics, private servers for friends'],
          ['Hangout / roleplay', 'Customize → socialize', 'Private servers, cosmetics, VIP perks'],
        ] },
        { type: 'h', text: 'Make the loop feel good' },
        { type: 'list', items: [
          '**Feedback on every action**: a sound, a particle burst, a number popping up (“+5”).',
          '**Visible progress**: bars, counters, a bigger character, a new area unlocked.',
          '**Short goals inside long goals**: the next upgrade is 30 seconds away; the next world is 20 minutes away.',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'first-minute',
      title: 'The first 60 seconds and retention',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'Players decide in seconds whether to stay. Roblox notices when players leave fast and shows your game less. Design the first minute on purpose.' },
        { type: 'olist', items: [
          '**0–5 s**: the player understands what to do with no text wall. An arrow, a glowing path, one clear goal.',
          '**5–30 s**: the first reward. Coins, a checkpoint, a level up. Something happens.',
          '**30–60 s**: they see something they want later (a bigger area, a cool pet, a leaderboard).',
        ] },
        { type: 'h', text: 'Numbers to watch after you publish' },
        { type: 'table', head: ['Metric', 'Meaning', 'What to do if it is bad'], rows: [
          ['Average session time', 'How long a visit lasts', 'Under ~5 min: the loop or onboarding is weak'],
          ['Day-1 retention', 'Share of new players who come back the next day', 'Add daily rewards, longer-term goals'],
          ['Day-7 retention', 'Who is still playing a week later', 'Add content updates, social features'],
          ['Payer conversion', 'Share of players who buy anything', 'Make offers visible and worth it, not pushy'],
        ] },
        { type: 'callout', tone: 'tip', text: 'Creator Rewards pay per qualifying player who stays 10+ minutes in a day. Designing for a 10-minute session is designing for money.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'pick-idea',
      title: 'Pick an idea you can finish',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'The best first idea is a **popular genre plus one twist**. Copying a game is against the rules and players notice; a fresh twist on a proven loop is how most hits start.' },
        { type: 'h', text: 'Scope ladder' },
        { type: 'table', head: ['Size', 'Example', 'Time (5 h/week)'], rows: [
          ['Tiny', '30-stage obby with a theme', '1–2 weeks'],
          ['Small', 'Simulator with 1 world, 5 upgrades, 1 rebirth', '3–5 weeks'],
          ['Medium', 'Tycoon with 2 bases and 40 buyable pieces', '2–3 months'],
          ['Large', 'Co-op horror with AI monster, 3 maps, rounds', '4+ months'],
        ] },
        { type: 'callout', tone: 'warn', text: 'Your Godot horror game idea is a great *third* Roblox game. Build tiny and small first so you learn Roblox networking and publishing on cheap mistakes.' },
        { type: 'h', text: 'Find your twist' },
        { type: 'list', items: [
          'Play the top 10 games in your chosen genre for 15 minutes each. Write what kept you playing and what annoyed you.',
          'Pick a **theme** players in your region would love (Filipino food, jeepney racing, typhoon survival, school life).',
          'Combine: “simulator, but you are a street-food vendor upgrading your cart”.',
        ] },
        { type: 'prompt', text: 'Help me brainstorm Roblox game ideas. Constraints: I am a solo beginner, 5 hours per week, first game must ship in 2 weeks. Genres: obby or simple simulator. Give me 10 ideas, each with a one-line core loop, one twist, and two fair ways to monetize. Then ask me which 3 I like and help me pick one.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'design-doc',
      title: 'A one-page design doc',
      minutes: 10,
      blocks: [
        { type: 'p', text: 'Write this in `DESIGN.md` in your project folder before you build. It keeps you and Claude Code focused, and stops “just one more feature”.' },
        { type: 'code', lang: 'text', title: 'DESIGN.md template', code: `# <Game name>

## One sentence
<Who> does <core action> to <goal> in a <theme> world.

## Core loop
1. ...
2. ...
3. ... (back to 1)

## First 60 seconds
- 0-5s:
- 5-30s:
- 30-60s:

## Version 1 features (must ship)
- [ ]
- [ ]
- [ ]

## NOT in version 1 (later)
-

## Monetization (fair)
- Pass:
- Developer product:

## Done when
- Published, public, icon + thumbnails, 3 friends played 10+ minutes` },
        { type: 'notes' },
      ],
    },
  ],
}

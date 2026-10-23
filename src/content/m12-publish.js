export default {
  id: 'publish',
  title: 'Publishing and growth',
  color: 'blue',
  summary: 'Make the game page convincing, read analytics, update on a rhythm, and get your first players without spending money.',
  lessons: [
    {
      id: 'game-page',
      title: 'Publish and set up the game page',
      minutes: 20,
      blocks: [
        { type: 'p', text: 'Players decide to click from the **icon, the name and the thumbnails**. Spend real effort here; it matters more than an extra feature.' },
        { type: 'steps', items: [
          { title: 'File → Publish to Roblox.', text: 'Create a new experience or overwrite your existing one.' },
          { title: 'Creator Hub → your game → Configure.', text: 'Set the name, description, genre and supported devices (phone, tablet, computer, console).' },
          { title: 'Upload an icon and thumbnails.', text: 'Icon: square, bold, readable at tiny size, one clear subject. Thumbnails: real gameplay moments, bright, with the core action visible.' },
          { title: 'Fill in the maturity and compliance questionnaire.', text: 'It is required, and an honest answer protects your game.' },
          { title: 'Set the game to Public.' },
        ] },
        { type: 'h', text: 'Description template' },
        { type: 'code', lang: 'text', code: `<One exciting sentence about what you do in the game>

⭐ Features
• <core loop in 5 words>
• <second hook>
• <social / competitive hook>

🎮 Controls: <phone + PC>
🆕 Update <date>: <what is new>

Like the game to get updates faster!` },
        { type: 'prompt', text: 'Using the Studio MCP tools, set up a nice camera angle of the most exciting part of my game and take 3 screen_captures I can use as thumbnail drafts. Suggest how to frame each one.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'analytics',
      title: 'Read your analytics',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'Creator Hub shows dashboards for engagement, retention, monetization and Creator Rewards. After launch, check them every few days and change **one thing at a time**.' },
        { type: 'table', head: ['If you see', 'Likely cause', 'Try'], rows: [
          ['Many visits, very short sessions', 'Confusing start, or the thumbnail promised something else', 'Clearer first 30 seconds; honest thumbnails'],
          ['Good sessions, low Day-1 retention', 'No reason to come back', 'Daily reward, unfinished goals, saved progress shown on join'],
          ['Good retention, almost no sales', 'Offers hidden or not worth it', 'Visible shop button, one cheap starter item'],
          ['Very few visits', 'Nobody finds it', 'Better icon, share clips, small ad test later'],
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'growth',
      title: 'Get players without a budget',
      minutes: 12,
      blocks: [
        { type: 'list', items: [
          '**Short videos**: post 15–30 second clips of the funniest or most satisfying moment on TikTok, YouTube Shorts and Facebook Reels. Your devlog.md is your content calendar.',
          '**Build in public**: “I’m a teacher building a Roblox game with AI. Day 12” style posts get attention and attract testers.',
          '**Community**: a Roblox group and a small Discord for update news and bug reports.',
          '**Friends and students’ siblings first**: watch them play. Do not explain anything. Where they get stuck is your next fix.',
          '**Update rhythm**: a small update every 1–2 weeks beats one big update every 3 months. Put the date in the description.',
          '**Ads later**: only spend Robux on sponsored ads when sessions are long and retention is decent; otherwise you pay for players who leave.',
        ] },
        { type: 'callout', tone: 'warn', text: 'Never buy fake visits, likes or bots. Roblox detects artificial engagement, and it can remove you from Creator Rewards and get your account terminated.' },
        { type: 'notes' },
      ],
    },
  ],
}

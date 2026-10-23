export default {
  id: 'rules',
  title: 'Rules that protect your income',
  color: 'red',
  summary: 'What gets games removed and DevEx requests rejected, and the habits that keep your account safe.',
  lessons: [
    {
      id: 'rules',
      title: 'Stay on the right side of the rules',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Your Roblox account is your business. One serious violation can remove your game or block DevEx, which means months of work lost. These are the rules creators break most often.' },
        { type: 'table', head: ['Never do this', 'Why'], rows: [
          ['Use other people’s IP (characters, logos, music, brand names)', 'Copyright takedowns; moderated content does not count as Earned Robux'],
          ['Sell Robux, items or accounts for real money outside DevEx', 'Listed as a reason for DevEx rejection and account action'],
          ['Use bots, alts or paid services for visits, likes or playtime', 'Artificial engagement is removed from Creator Rewards and can end your account'],
          ['Paid random items without odds', 'Violates the paid random items policy'],
          ['Misleading thumbnails or fake “free Robux” promises', 'Scam rules; players report it'],
          ['Content beyond your maturity rating', 'Moderation; answer the questionnaire honestly'],
          ['Keep scripts from unknown free models', 'Backdoors can insert banned content into your game'],
        ] },
        { type: 'h', text: 'Account safety habits' },
        { type: 'checklist', id: 'account-safety', items: [
          'Two-step verification on Roblox and on the email account',
          'Never paste your .ROBLOSECURITY cookie or password anywhere, including into any AI tool',
          'Only install Studio plugins from creators you trust',
          'Keep your DevEx legal name consistent on every request',
          'Read the [Community Standards](https://about.roblox.com/community-standards) once',
        ] },
        { type: 'quiz', id: 'quiz-rules', questions: [
          { q: 'A buyer offers you ₱5,000 for 50,000 Robux from your game. What do you do?', options: ['Accept, it is more than DevEx pays', 'Decline: selling Robux outside DevEx breaks the rules', 'Accept but only via GCash', 'Ask for more'], answer: 1, why: 'Exchanging Robux for real money outside the DevEx program is a listed reason for rejection and account action.' },
          { q: 'Your egg costs 50 Robux and gives a random pet. What must you show?', options: ['Nothing', 'Only the rarest pet', 'Every possible pet and its exact odds', 'The total number of pets'], answer: 2 },
        ] },
        { type: 'notes' },
      ],
    },
  ],
}

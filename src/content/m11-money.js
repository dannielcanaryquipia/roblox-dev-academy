export default {
  id: 'money',
  title: 'Monetization and cash-out',
  color: 'green',
  summary: 'Passes vs developer products, a correct ProcessReceipt, fair pricing, the paid-random-items rule, and the DevEx cash-out step by step.',
  lessons: [
    {
      id: 'what-to-sell',
      title: 'What to sell, and at what price',
      minutes: 15,
      blocks: [
        { type: 'table', head: ['Type', 'Bought', 'Examples', 'Code you need'], rows: [
          ['Pass', 'Once, owned forever', '2x Coins, VIP room, extra inventory, special trail', '`UserOwnsGamePassAsync` on join + `PromptGamePassPurchaseFinished`'],
          ['Developer product', 'Any number of times', 'Coin pack, skip stage, revive, 15-min boost', '`ProcessReceipt` (exactly one handler for the whole game)'],
          ['Private server', 'Monthly', 'Your own server for friends', 'Turn on in Creator Hub; little or no code'],
          ['Subscription', 'Monthly', 'Daily bonus gems, VIP badge', 'Advanced, for later'],
        ] },
        { type: 'h', text: 'Pricing that feels fair' },
        { type: 'list', items: [
          '**Small first purchase**: one cheap item (around 25–50 Robux) lowers the barrier to a first purchase.',
          '**Convenience, not power**, especially in competitive games. Speed and cosmetics feel fair; buying wins does not.',
          '**Show value**: “2x Coins” is clearer than “Coin Boost Pro”.',
          '**Test prices**: Roblox offers price optimization tests for products and passes. Once you have steady sales, try them in Creator Hub.',
        ] },
        { type: 'calculator' },
        { type: 'callout', tone: 'warn', title: 'Paid random items have strict rules', text: 'Eggs, crates, spins and loot boxes bought directly or indirectly with Robux must show **all possible outcomes and their exact odds** before purchase, and items that boost odds must explain the new odds. Some players are not allowed to buy them at all; Roblox gives you an API (PolicyService) to check. Read the official policy before you build any paid random item.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'process-receipt',
      title: 'ProcessReceipt done right',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'You already used this pattern in the obby. The rules again, because getting them wrong loses players’ money and gets your game reported:' },
        { type: 'olist', items: [
          'Only **one** script in the whole game sets `MarketplaceService.ProcessReceipt`.',
          'Look up the handler by `receiptInfo.ProductId`.',
          'Return `PurchaseGranted` **only after** the item was really given.',
          'If anything fails, return `NotProcessedYet`. Roblox retries the next time the player joins.',
          'Never use `PromptProductPurchaseFinished` to grant products.',
        ] },
        { type: 'code', title: 'Adding a coin pack to the handlers table', code: `local COIN_PACK_ID = 0 -- your product ID

handlers[COIN_PACK_ID] = function(_receipt, player: Player)
	local coins = player.leaderstats.Coins
	coins.Value += 1000
	return true
end` },
        { type: 'callout', tone: 'info', title: 'Going further: never double-grant', text: 'Each receipt has a unique `PurchaseId`. Bigger games save the IDs they already granted inside the player’s data, so a purchase is never given twice even if a save fails at the wrong moment. Ask Claude Code to add this once you have regular sales.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'cash-out',
      title: 'Cashing out with DevEx',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'When your **Earned** Robux reach 30,000, you can request your first payout. Here is the official process.' },
        { type: 'steps', items: [
          { title: 'Check eligibility.', text: '13+, verified email, account in good standing, at least 30,000 Earned Robux. The DevEx dashboard in Creator Hub shows an estimate (it can lag by up to 24 hours).' },
          { title: 'Creator Hub → Finances → Cash Out.', text: 'Fill in the DevEx form with your **legal name** exactly as on your ID. Nicknames get requests rejected or delayed.' },
          { title: 'Submit.', text: 'The Robux are held while Roblox reviews. If rejected, they come back to you. A request cannot be cancelled.' },
          { title: 'Register on the DevEx portal (Tipalti) within one week.', text: 'You get an email invitation. Add your payment method and the tax form. As a non-U.S. creator, that is a **W-8** form. Miss the week and the request is declined.' },
          { title: 'Wait for payment.', text: 'First-time requests take around 10 business days to process, then your bank adds its own time. You can cash out once per calendar month.' },
        ] },
        { type: 'callout', tone: 'money', title: 'Rates (checked October 2026)', items: [
          'Standard: **$0.0038** per Earned Robux, so 30,000 R$ = $114.',
          'Higher: **$0.0054** for some purchases by age-checked U.S. players 18+ in eligible games (R15 avatars required).',
          'Robux earned before 5 September 2025 cash out first at the older $0.0035 rate.',
          'Rates can change. Always check the official DevEx page before you plan around a number.',
        ] },
        { type: 'callout', tone: 'warn', text: 'Payouts are income. Keep records of every cash-out and ask a local accountant how to declare it in the Philippines. This course is not tax or financial advice.' },
        { type: 'notes' },
      ],
    },
  ],
}

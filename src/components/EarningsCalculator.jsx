import React, { useState } from 'react'

// Rough estimate only. Rates come from the Roblox DevEx page (checked Oct 2026):
// standard 0.0038 USD per Earned Robux, minimum cash-out 30,000 Earned Robux.
// Creators keep about 70% of a pass / developer product sale after the marketplace fee.
const fmt = (n, d = 0) => n.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d })

export default function EarningsCalculator() {
  const [price, setPrice] = useState(99)
  const [sales, setSales] = useState(5)
  const [share, setShare] = useState(70)
  const [rate, setRate] = useState(0.0038)
  const [php, setPhp] = useState(58)

  const robuxPerSale = (price * share) / 100
  const monthlyRobux = robuxPerSale * sales * 30
  const monthlyUsd = monthlyRobux * rate
  const daysToCashout = monthlyRobux > 0 ? Math.ceil(30000 / (monthlyRobux / 30)) : Infinity

  const field = (label, value, set, step, hint) => (
    <label className="calc-field">
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step={step}
        value={value}
        onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
      />
      {hint && <small>{hint}</small>}
    </label>
  )

  return (
    <section className="calc" aria-label="Earnings calculator">
      <h3>Earnings calculator</h3>
      <p className="calc-intro">Change the numbers to see what one item could earn. This is an estimate, not a promise.</p>
      <div className="calc-grid">
        {field('Item price (Robux)', price, setPrice, 1)}
        {field('Sales per day', sales, setSales, 1)}
        {field('Your share after fee (%)', share, setShare, 1, 'About 70% for passes and products')}
        {field('DevEx rate (USD per Robux)', rate, setRate, 0.0001, 'Standard rate, Oct 2026')}
        {field('PHP per 1 USD', php, setPhp, 0.1, 'Edit to today’s rate')}
      </div>
      <dl className="calc-out">
        <div><dt>You earn per sale</dt><dd>{fmt(robuxPerSale, 1)} R$</dd></div>
        <div><dt>Earned Robux per month</dt><dd>{fmt(monthlyRobux)} R$</dd></div>
        <div><dt>Per month in USD</dt><dd>${fmt(monthlyUsd, 2)}</dd></div>
        <div><dt>Per month in PHP</dt><dd>₱{fmt(monthlyUsd * php, 0)}</dd></div>
        <div className="wide">
          <dt>Days to reach the 30,000 R$ cash-out minimum</dt>
          <dd>{Number.isFinite(daysToCashout) ? `${fmt(daysToCashout)} days` : 'Never at zero sales'}</dd>
        </div>
      </dl>
    </section>
  )
}

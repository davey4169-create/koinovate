'use client'
import { useState } from 'react'
import Link from 'next/link'

const games = [
  { id: 'slots',    name: 'Mega Slots',      icon: '🎰', desc: 'Spin to win up to 100x your bet',        maxWin: '₦1,000,000', minBet: '₦500',  category: 'Slots',   hot: true,  tier: 'spark'    },
  { id: 'roulette', name: 'Live Roulette',   icon: '🎡', desc: 'Place your bets on the wheel',            maxWin: '₦500,000',   minBet: '₦1,000', category: 'Table',   hot: true,  tier: 'pulse'    },
  { id: 'crash',    name: 'Crash Game',      icon: '📈', desc: 'Cash out before the market crashes',      maxWin: 'Unlimited',  minBet: '₦200',  category: 'Crash',   hot: true,  tier: 'spark'    },
  { id: 'dice',     name: 'Lucky Dice',      icon: '🎲', desc: 'Roll the dice and multiply your balance', maxWin: '₦200,000',   minBet: '₦100',  category: 'Dice',    hot: false, tier: 'spark'    },
  { id: 'poker',    name: 'Video Poker',     icon: '🃏', desc: 'Classic 5-card draw with AI dealer',      maxWin: '₦750,000',   minBet: '₦2,000', category: 'Cards',   hot: false, tier: 'pulse'    },
  { id: 'mines',    name: 'Mines',           icon: '💣', desc: 'Uncover gems and avoid the mines',        maxWin: '₦300,000',   minBet: '₦500',  category: 'Skill',   hot: true,  tier: 'spark'    },
  { id: 'wheel',    name: 'Fortune Wheel',   icon: '🎪', desc: 'Daily fortune wheel with cash prizes',    maxWin: '₦5,000',    minBet: 'FREE',  category: 'Daily',   hot: false, tier: 'spark'    },
  { id: 'keno',     name: 'Keno Jackpot',    icon: '🏆', desc: 'Pick your numbers — jackpot awaits',      maxWin: '₦1,000,000', minBet: '₦1,000', category: 'Lottery', hot: false, tier: 'momentum' },
]

const recentWins = [
  { user: 'Ade***', game: 'Mega Slots',   amount: '₦450,000', time: '2m ago' },
  { user: 'Chi***', game: 'Crash Game',   amount: '₦180,000', time: '5m ago' },
  { user: 'Fat***', game: 'Live Roulette', amount: '₦950,000', time: '8m ago' },
  { user: 'Olu***', game: 'Mines',        amount: '₦720,500',  time: '11m ago' },
  { user: 'Kem***', game: 'Lucky Dice',   amount: '₦55,000',  time: '15m ago' },
]

const tierLimits = [
  { tier: 'SPARK', color: '#a8b2d8', limit: '₦100,000', games: 'Slots, Dice, Crash, Wheel' },
  { tier: 'PULSE', color: '#64ffda', limit: '₦500,000', games: '+ Roulette, Poker' },
  { tier: 'MOMENTUM', color: '#00b4d8', limit: '₦1,000,000', games: '+ Keno Jackpot + VIP Tables' },
]

// Slots mini-game
function SlotsGame() {
  const symbols = ['🍒', '7️⃣', '💎', '🔔', '⭐', '🎰']
  const [reels, setReels] = useState(['🍒', '🎰', '⭐'])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [bet, setBet] = useState(500)

  const spin = () => {
    if (spinning) return
    setSpinning(true); setResult(null)
    const total = 1200
    const intv = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ])
    }, 100)
    setTimeout(() => {
      clearInterval(intv)
      const final = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]
      setReels(final)
      if (final[0] === final[1] && final[1] === final[2]) setResult({ win: true, amount: bet * 10 })
      else if (final[0] === final[1] || final[1] === final[2]) setResult({ win: true, amount: bet * 2 })
      else setResult({ win: false, amount: bet })
      setSpinning(false)
    }, total)
  }

  return (
    <div style={{ padding: '28px', background: 'rgba(17,34,64,0.8)', border: '1px solid rgba(100,255,218,0.15)', borderRadius: 20, maxWidth: 380, margin: '0 auto' }}>
      <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>🎰 Mega Slots — Demo</h3>

      {/* Reels */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        {reels.map((sym, i) => (
          <div key={i} style={{
            width: 80, height: 80, borderRadius: 14,
            background: 'rgba(10,25,47,0.8)',
            border: '2px solid rgba(100,255,218,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
            animation: spinning ? 'slotSpin 0.1s linear infinite' : 'none',
            boxShadow: spinning ? '0 0 20px rgba(100,255,218,0.2)' : 'none',
          }}>{sym}</div>
        ))}
        <style>{`@keyframes slotSpin { 0%{transform:scaleY(1)}50%{transform:scaleY(0.8)}100%{transform:scaleY(1)} }`}</style>
      </div>

      {result && (
        <div style={{
          padding: '12px', borderRadius: 12, marginBottom: 16, textAlign: 'center',
          background: result.win ? 'rgba(100,255,218,0.1)' : 'rgba(255,80,80,0.1)',
          border: `1px solid ${result.win ? 'rgba(100,255,218,0.3)' : 'rgba(255,80,80,0.3)'}`,
        }}>
          <p style={{ color: result.win ? '#64ffda' : '#ff8080', fontSize: 16, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>
            {result.win ? `🎉 You Won ₦${result.amount.toLocaleString()}!` : `💸 Lost ₦${result.amount.toLocaleString()}`}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>Bet:</label>
        <select value={bet} onChange={e => setBet(Number(e.target.value))} style={{ flex: 1, padding: '9px 12px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 8, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
          {[500, 1000, 2000, 5000, 10000, 20000].map(v => <option key={v} value={v}>₦{v.toLocaleString()}</option>)}
        </select>
      </div>

      <button onClick={spin} disabled={spinning} style={{
        width: '100%', padding: '14px', borderRadius: 12, border: 'none',
        background: spinning ? 'rgba(100,255,218,0.3)' : 'linear-gradient(135deg, #64ffda, #00b4d8)',
        color: '#0a192f', fontWeight: 800, fontSize: 16,
        fontFamily: '"DM Sans", sans-serif', cursor: spinning ? 'not-allowed' : 'pointer',
        boxShadow: spinning ? 'none' : '0 0 25px rgba(100,255,218,0.25)',
      }}>
        {spinning ? '🎰 Spinning...' : '🎰 SPIN'}
      </button>
    </div>
  )
}

export default function CasinoPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [playGame, setPlayGame] = useState(null)
  const categories = ['All', 'Slots', 'Table', 'Crash', 'Dice', 'Cards', 'Skill', 'Daily', 'Lottery']
  const filtered = activeCategory === 'All' ? games : games.filter(g => g.category === activeCategory)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <section style={{
        padding: '60px 28px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span style={{ color: '#f59e0b', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Live Casino · Real Payouts</span>
        </div>

        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, marginBottom: 16 }}>
          🎰 KOINOVATE{' '}
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Casino</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 17, maxWidth: 520, margin: '0 auto 16px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7 }}>
          High-stakes gaming with real NGN payouts. Casino potential up to <strong style={{ color: '#f59e0b' }}>₦1,000,000</strong> for Momentum members.
        </p>

        {/* Live wins ticker */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
          {recentWins.slice(0, 3).map((w, i) => (
            <div key={i} style={{ padding: '8px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>🏆</span>
              <span style={{ color: '#e6f1ff', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{w.user} won <strong style={{ color: '#f59e0b' }}>{w.amount}</strong> on {w.game}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tier limits */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px 32px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {tierLimits.map(t => (
          <div key={t.tier} style={{ flex: 1, minWidth: 200, padding: '18px 20px', background: 'rgba(17,34,64,0.6)', border: `1px solid ${t.color}25`, borderRadius: 16 }}>
            <p style={{ fontFamily: '"Orbitron", monospace', color: t.color, fontSize: 11, letterSpacing: '0.15em', marginBottom: 6 }}>{t.tier}</p>
            <p style={{ color: '#e6f1ff', fontSize: 20, fontWeight: 700, fontFamily: '"Syne", sans-serif', marginBottom: 4 }}>{t.limit}</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Max potential · {t.games}</p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px 80px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        {/* Left */}
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                padding: '8px 16px', borderRadius: 20,
                border: `1px solid ${activeCategory === c ? 'rgba(245,158,11,0.4)' : 'rgba(100,100,100,0.2)'}`,
                background: activeCategory === c ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: activeCategory === c ? '#f59e0b' : '#8892b0',
                fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
              }}>{c}</button>
            ))}
          </div>

          {/* Demo Slots */}
          {activeCategory === 'All' && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎮 Try Now — Free Demo</h3>
              <SlotsGame />
            </div>
          )}

          {/* Game grid */}
          <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>All Games</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filtered.map(g => (
              <div key={g.id} style={{
                padding: '22px', background: 'rgba(17,34,64,0.7)',
                border: g.hot ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(100,255,218,0.07)',
                borderRadius: 18, position: 'relative', transition: 'all 0.3s', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              onClick={() => setPlayGame(g)}
              >
                {g.hot && <div style={{ position: 'absolute', top: 12, right: 12, background: '#f59e0b', color: '#0a192f', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, fontFamily: '"DM Sans", sans-serif' }}>🔥 HOT</div>}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{g.icon}</div>
                <h4 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{g.name}</h4>
                <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6, marginBottom: 14 }}>{g.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>Min Bet</p>
                    <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{g.minBet}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>Max Win</p>
                    <p style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{g.maxWin}</p>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a192f', fontWeight: 700, fontSize: 13, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
                  Play Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Leaderboard & Wins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Balance */}
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(17,34,64,0.8))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 18 }}>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Casino Balance</p>
            <p style={{ fontFamily: '"Orbitron", monospace', color: '#f59e0b', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>₦3,420,500</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginBottom: 16 }}>MOMENTUM tier · Max: ₦500,000</p>
            <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
              + Add Funds
            </Link>
          </div>

          {/* Recent big wins */}
          <div style={{ padding: '20px', background: 'rgba(17,34,64,0.7)', border: '1px solid rgba(100,255,218,0.07)', borderRadius: 18, flex: 1 }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏆 Recent Big Wins</h3>
            {recentWins.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(100,255,218,0.05)' }}>
                <div>
                  <p style={{ color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>{w.user}</p>
                  <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{w.game} · {w.time}</p>
                </div>
                <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>{w.amount}</p>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div style={{ padding: '20px', background: 'rgba(17,34,64,0.5)', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 18, textAlign: 'center' }}>
            <p style={{ fontSize: 28, marginBottom: 10 }}>💎</p>
            <p style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Unlock ₦1M Potential</p>
            <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginBottom: 14 }}>Upgrade to Momentum for VIP tables and maximum casino potential.</p>
            <Link href="/membership" style={{ display: 'block', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg, #64ffda, #00b4d8)', color: '#0a192f', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
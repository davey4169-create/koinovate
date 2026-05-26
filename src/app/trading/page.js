'use client'
import { useState, useEffect, useRef } from 'react'

// ── Generate initial chart data ────────────────────────────────
function generateData(count = 60) {
  const pts = []
  let y = 100
  for (let i = 0; i < count; i++) {
    y = Math.max(20, Math.min(180, y + (Math.random() - 0.47) * 10))
    pts.push({ x: i, y: Math.round(y * 100) / 100 })
  }
  return pts
}

function pointsToSVG(data, w = 700, h = 200) {
  if (!data.length) return ''
  const xs = data.map(d => d.x)
  const ys = data.map(d => d.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const pad = 10
  const scaleX = x => ((x - minX) / (maxX - minX || 1)) * (w - pad * 2) + pad
  const scaleY = y => h - pad - ((y - minY) / (maxY - minY || 1)) * (h - pad * 2)
  return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.x)} ${scaleY(d.y)}`).join(' ')
}

function pointsToArea(data, w = 700, h = 200) {
  const line = pointsToSVG(data, w, h)
  if (!line) return ''
  const pad = 10
  const xs = data.map(d => d.x)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const scaleX = x => ((x - minX) / (maxX - minX || 1)) * (w - pad * 2) + pad
  return `${line} L ${scaleX(data[data.length - 1].x)} ${h - pad} L ${scaleX(data[0].x)} ${h - pad} Z`
}

const pairs = [
  { symbol: 'BTC/USDT', name: 'Bitcoin',    price: '$67,420', change: '+2.4%', pos: true,  color: '#f59e0b' },
  { symbol: 'ETH/USDT', name: 'Ethereum',   price: '$3,841',  change: '+1.8%', pos: true,  color: '#8b5cf6' },
  { symbol: 'BNB/USDT', name: 'BNB',        price: '$598',    change: '-0.6%', pos: false, color: '#f59e0b' },
  { symbol: 'SOL/USDT', name: 'Solana',     price: '$182',    change: '+4.2%', pos: true,  color: '#64ffda' },
  { symbol: 'ADA/USDT', name: 'Cardano',    price: '$0.592',  change: '-1.1%', pos: false, color: '#00b4d8' },
]

const signals = [
  { pair: 'BTC/USDT', action: 'BUY',  confidence: 94, reason: 'Bullish divergence on RSI',          time: '2m ago',  color: '#64ffda' },
  { pair: 'ETH/USDT', action: 'BUY',  confidence: 87, reason: 'Golden cross on 1H chart',            time: '5m ago',  color: '#64ffda' },
  { pair: 'BNB/USDT', action: 'SELL', confidence: 78, reason: 'Resistance rejection at $600',        time: '12m ago', color: '#ff8080' },
  { pair: 'SOL/USDT', action: 'BUY',  confidence: 91, reason: 'Strong volume breakout detected',     time: '18m ago', color: '#64ffda' },
  { pair: 'ADA/USDT', action: 'HOLD', confidence: 65, reason: 'Consolidating — await confirmation',  time: '25m ago', color: '#f59e0b' },
]

export default function TradingPage() {
  const [chartData, setChartData] = useState(generateData(60))
  const [activePair, setActivePair] = useState('BTC/USDT')
  const [livePrice, setLivePrice] = useState(67420)
  const [priceUp, setPriceUp] = useState(true)
  const [isLive, setIsLive] = useState(true)
  const [chartW, setChartW] = useState(700)
  const chartRef = useRef(null)

  // Live chart update
  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1]
        const change = (Math.random() - 0.47) * 10
        const newY = Math.max(20, Math.min(180, last.y + change))
        const newPts = [...prev.slice(1), { x: last.x + 1, y: newY }]
        return newPts.map((p, i) => ({ ...p, x: i }))
      })
      setLivePrice(prev => {
        const delta = (Math.random() - 0.47) * 80
        const next = Math.max(60000, prev + delta)
        setPriceUp(delta > 0)
        return Math.round(next)
      })
    }, 700)
    return () => clearInterval(interval)
  }, [isLive])

  // Chart width
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setChartW(entries[0].contentRect.width)
    })
    if (chartRef.current) obs.observe(chartRef.current)
    return () => obs.disconnect()
  }, [])

  const lastPt = chartData[chartData.length - 1]
  const prevPt = chartData[chartData.length - 2]
  const trending = lastPt?.y >= (prevPt?.y || 0)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* ── HEADER ───────────────────────────────────────── */}
      <section style={{ padding: '40px 28px 20px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(100,255,218,0.08)', border: '1px solid rgba(100,255,218,0.2)', marginBottom: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#64ffda', display: 'inline-block', boxShadow: '0 0 8px #64ffda', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ color: '#64ffda', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>LIVE MARKET</span>
              <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
            </div>
            <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800 }}>
              🤖 AI Trading Hub
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setIsLive(!isLive)} style={{
              padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: isLive ? 'rgba(100,255,218,0.1)' : 'rgba(255,80,80,0.1)',
              color: isLive ? '#64ffda' : '#ff8080',
              fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
              border: `1px solid ${isLive ? 'rgba(100,255,218,0.3)' : 'rgba(255,80,80,0.3)'}`,
            }}>{isLive ? '⏸ Pause Feed' : '▶ Resume Feed'}</button>
          </div>
        </div>

        {/* Trading pair tabs */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
          {pairs.map(p => (
            <button key={p.symbol} onClick={() => setActivePair(p.symbol)} style={{
              padding: '12px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: activePair === p.symbol ? `${p.color}15` : 'rgba(17,34,64,0.6)',
              border: `1px solid ${activePair === p.symbol ? p.color + '40' : 'rgba(100,255,218,0.07)'}`,
              transition: 'all 0.2s',
            }}>
              <p style={{ color: activePair === p.symbol ? p.color : '#a8b2d8', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>{p.symbol}</p>
              <p style={{ color: p.pos ? '#64ffda' : '#ff8080', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{p.price} <span>{p.change}</span></p>
            </button>
          ))}
        </div>
      </section>

      {/* ── MAIN LAYOUT ──────────────────────────────────── */}
      <section style={{ padding: '0 28px 60px', maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

        {/* LEFT — Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Live price */}
          <div style={{ padding: '24px 28px', background: 'rgba(17,34,64,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 4 }}>
              <span style={{ fontFamily: '"Orbitron", monospace', color: trending ? '#64ffda' : '#ff8080', fontSize: 40, fontWeight: 700, transition: 'color 0.3s' }}>
                ${livePrice.toLocaleString()}
              </span>
              <span style={{ color: trending ? '#64ffda' : '#ff8080', fontSize: 18, transition: 'color 0.3s' }}>
                {trending ? '▲' : '▼'} {trending ? '+' : '-'}$80
              </span>
            </div>
            <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{activePair} · Updated live · {new Date().toLocaleTimeString()}</p>
          </div>

          {/* Live chart */}
          <div ref={chartRef} style={{ padding: '24px', background: 'rgba(17,34,64,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700 }}>
                📈 Live Price Chart — {activePair}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64ffda', display: 'inline-block', animation: 'pulse 1s ease-in-out infinite' }} />
                <span style={{ color: '#64ffda', fontSize: 11, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>LIVE</span>
              </div>
            </div>

            <svg width="100%" height="220" viewBox={`0 0 ${chartW} 220`} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trending ? '#64ffda' : '#ff8080'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={trending ? '#64ffda' : '#ff8080'} stopOpacity="0" />
                </linearGradient>
                {/* Grid lines */}
              </defs>

              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75].map(t => (
                <line key={t} x1="10" y1={220 * t} x2={chartW - 10} y2={220 * t} stroke="rgba(100,255,218,0.06)" strokeWidth="1" strokeDasharray="4 4" />
              ))}

              {/* Area fill */}
              <path d={pointsToArea(chartData, chartW, 200)} fill="url(#chartGrad)" />

              {/* Main line */}
              <path
                d={pointsToSVG(chartData, chartW, 200)}
                fill="none"
                stroke={trending ? '#64ffda' : '#ff8080'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.3s' }}
              />

              {/* Live dot */}
              {chartData.length > 0 && (() => {
                const last = chartData[chartData.length - 1]
                const xs = chartData.map(d => d.x)
                const ys = chartData.map(d => d.y)
                const minX = Math.min(...xs), maxX = Math.max(...xs)
                const minY = Math.min(...ys), maxY = Math.max(...ys)
                const pad = 10
                const cx = ((last.x - minX) / (maxX - minX || 1)) * (chartW - pad * 2) + pad
                const cy = 200 - pad - ((last.y - minY) / (maxY - minY || 1)) * (200 - pad * 2)
                return (
                  <g>
                    <circle cx={cx} cy={cy} r="8" fill={trending ? 'rgba(100,255,218,0.2)' : 'rgba(255,128,128,0.2)'} />
                    <circle cx={cx} cy={cy} r="4" fill={trending ? '#64ffda' : '#ff8080'} />
                  </g>
                )
              })()}
            </svg>

            {/* Chart controls */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['1m','5m','15m','1H','4H','1D'].map(t => (
                <button key={t} style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(100,255,218,0.1)',
                  background: t === '1m' ? 'rgba(100,255,218,0.1)' : 'transparent',
                  color: t === '1m' ? '#64ffda' : '#8892b0',
                  fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Trade box */}
          <div style={{ padding: '24px', background: 'rgba(17,34,64,0.7)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18 }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Quick Trade</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ color: '#a8b2d8', fontSize: 11, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 6 }}>Amount (USDT)</label>
                <input type="number" defaultValue="100" style={{ width: '100%', padding: '11px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 9, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#a8b2d8', fontSize: 11, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 6 }}>Leverage</label>
                <select style={{ width: '100%', padding: '11px 14px', background: 'rgba(10,25,47,0.8)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 9, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                  {['1x','2x','5x','10x','25x'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: '#64ffda', color: '#0a192f', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', boxShadow: '0 0 20px rgba(100,255,218,0.2)' }}>▲ LONG (Buy)</button>
              <button style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: '#ff6b6b', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,107,107,0.2)' }}>▼ SHORT (Sell)</button>
            </div>
          </div>
        </div>

        {/* RIGHT — Signals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Portfolio */}
          <div style={{ padding: '20px', background: 'rgba(17,34,64,0.7)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18 }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>AI Portfolio</h3>
            {[
              { label: 'AI Trade Balance', value: '₦2,644,400', color: '#a855f7' },
              { label: 'Daily P&L',         value: '+$840.20',  color: '#64ffda' },
              { label: 'Win Rate',          value: '94%',      color: '#64ffda' },
              { label: 'Open Positions',    value: '3',        color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{s.label}</span>
                <span style={{ color: s.color, fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* AI Signals */}
          <div style={{ padding: '20px', background: 'rgba(17,34,64,0.7)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 15, fontWeight: 700 }}>🤖 AI Signals</h3>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: 'rgba(100,255,218,0.1)', color: '#64ffda', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>LIVE</span>
            </div>
            {signals.map((sig, i) => (
              <div key={i} style={{ marginBottom: 12, padding: '14px', background: 'rgba(10,25,47,0.5)', borderRadius: 12, border: `1px solid ${sig.color}15` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#e6f1ff', fontSize: 12, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>{sig.pair}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: `${sig.color}20`, color: sig.color, fontSize: 10, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>{sig.action}</span>
                  </div>
                  <span style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>{sig.time}</span>
                </div>
                <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginBottom: 8 }}>{sig.reason}</p>
                <div style={{ height: 4, background: 'rgba(100,255,218,0.08)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${sig.confidence}%`, background: `linear-gradient(90deg, ${sig.color}, ${sig.color}80)`, borderRadius: 2 }} />
                </div>
                <p style={{ color: sig.color, fontSize: 10, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>Confidence: {sig.confidence}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ── INVESTMENT PLANS ─────────────────────────────────── */}
      <section style={{ maxWidth: 1300, margin: '0 auto', padding: '0 28px 60px' }}>
        <div style={{ padding: '24px', background: 'rgba(17,34,64,0.7)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700 }}>💼 AI Investment Plans</h3>
            <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Fixed daily returns · Auto-managed by AI</span>
          </div>
          <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 24, lineHeight: 1.6 }}>
            Choose an investment plan. Your capital is managed by our AI engine and generates daily profits credited to your AI Trade wallet. 👑 = Momentum only.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { name: 'Starter',   invest: '₦10,000',   daily: '₦2,000',   roi: '20%',  days: 30, tier: 'spark',    color: '#a8b2d8', icon: '🌱' },
              { name: 'Basic',     invest: '₦30,000',   daily: '₦5,000',   roi: '16.7%',days: 30, tier: 'spark',    color: '#a8b2d8', icon: '📈' },
              { name: 'Standard',  invest: '₦50,000',   daily: '₦8,000',   roi: '16%',  days: 30, tier: 'pulse',    color: '#64ffda', icon: '⚡' },
              { name: 'Growth',    invest: '₦100,000',  daily: '₦18,000',  roi: '18%',  days: 30, tier: 'pulse',    color: '#64ffda', icon: '🚀' },
              { name: 'Premium',   invest: '₦250,000',  daily: '₦50,000',  roi: '20%',  days: 30, tier: 'momentum', color: '#00b4d8', icon: '💎' },
              { name: 'Elite',     invest: '₦500,000',  daily: '₦120,000', roi: '24%',  days: 30, tier: 'momentum', color: '#00b4d8', icon: '👑' },
              { name: 'VIP',       invest: '₦1,000,000',daily: '₦250,000', roi: '25%',  days: 30, tier: 'momentum', color: '#f59e0b', icon: '🏆' },
            ].map(plan => {
              const isMomentumPlan = plan.tier === 'momentum'
              const tierOrder = { spark: 0, pulse: 1, momentum: 2 }
              const userTierLevel = 1 // pulse = 1; change to 2 for momentum
              const accessible = tierOrder[plan.tier] <= userTierLevel
              return (
                <div key={plan.name} style={{
                  padding: '20px 16px',
                  background: isMomentumPlan ? 'rgba(0,180,216,0.05)' : 'rgba(10,25,47,0.6)',
                  border: `1px solid ${accessible ? plan.color + '25' : 'rgba(100,100,100,0.15)'}`,
                  borderRadius: 16, opacity: accessible ? 1 : 0.6,
                  position: 'relative', transition: 'all 0.3s',
                }}
                onMouseEnter={e => accessible && (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => accessible && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {isMomentumPlan && !accessible && (
                    <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 14 }}>🔒</div>
                  )}
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{plan.icon}</div>
                  <p style={{ fontFamily: '"Orbitron", monospace', color: plan.color, fontSize: 11, letterSpacing: '0.1em', marginBottom: 8 }}>{plan.name.toUpperCase()}</p>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>Invest</p>
                    <p style={{ color: '#e6f1ff', fontSize: 15, fontWeight: 700, fontFamily: '"Syne", sans-serif' }}>{plan.invest}</p>
                  </div>
                  <div style={{ marginBottom: 12, padding: '10px', background: `${plan.color}10`, borderRadius: 10, border: `1px solid ${plan.color}20` }}>
                    <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>Daily Profit</p>
                    <p style={{ fontFamily: '"Orbitron", monospace', color: plan.color, fontSize: 16, fontWeight: 700 }}>{plan.daily}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <p style={{ color: '#8892b0', fontSize: 9, fontFamily: '"DM Sans", sans-serif' }}>ROI</p>
                      <p style={{ color: '#64ffda', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{plan.roi}/day</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#8892b0', fontSize: 9, fontFamily: '"DM Sans", sans-serif' }}>Duration</p>
                      <p style={{ color: '#e6f1ff', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{plan.days} days</p>
                    </div>
                  </div>
                  <button style={{
                    width: '100%', padding: '9px', borderRadius: 9, border: 'none',
                    background: accessible ? `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)` : 'rgba(100,100,100,0.2)',
                    color: accessible ? '#0a192f' : '#666',
                    fontWeight: 700, fontSize: 11, fontFamily: '"DM Sans", sans-serif',
                    cursor: accessible ? 'pointer' : 'not-allowed',
                  }}>
                    {accessible ? 'Invest Now →' : '🔒 Momentum Only'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
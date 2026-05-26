'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const USER_TIER = 'momentum'

function useAnimatedPrice(base, volatility = 0.002) {
  const [price, setPrice] = useState(base)
  const [prev,  setPrev]  = useState(base)
  useEffect(() => {
    const id = setInterval(() => {
      setPrice(p => {
        const next = p * (1 + (Math.random() - 0.5) * volatility)
        setPrev(p)
        return Math.round(next * 100) / 100
      })
    }, 1800)
    return () => clearInterval(id)
  }, [])
  return { price, up: price >= prev }
}

const globalIndices = [
  { name: 'S&P 500',   base: 5318,   symbol: 'SPX',   flag: '🇺🇸', vol: 0.001 },
  { name: 'NASDAQ',    base: 16820,  symbol: 'COMP',  flag: '🇺🇸', vol: 0.0015 },
  { name: 'DOW JONES', base: 39150,  symbol: 'DJI',   flag: '🇺🇸', vol: 0.001 },
  { name: 'NGX ASI',   base: 99240,  symbol: 'NGXASI',flag: '🇳🇬', vol: 0.002 },
  { name: 'FTSE 100',  base: 8380,   symbol: 'FTSE',  flag: '🇬🇧', vol: 0.001 },
  { name: 'DAX',       base: 18420,  symbol: 'DAX',   flag: '🇩🇪', vol: 0.0012 },
]

const stocks = [
  { symbol: 'AAPL',  name: 'Apple Inc.',        base: 187.50,  sector: 'Technology', flag: '🇺🇸', vol: 0.003, tier: 'spark'    },
  { symbol: 'MSFT',  name: 'Microsoft',          base: 420.20,  sector: 'Technology', flag: '🇺🇸', vol: 0.002, tier: 'spark'    },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',       base: 175.80,  sector: 'Technology', flag: '🇺🇸', vol: 0.0025,tier: 'spark'    },
  { symbol: 'TSLA',  name: 'Tesla Inc.',          base: 175.30,  sector: 'Auto/EV',    flag: '🇺🇸', vol: 0.005, tier: 'spark'    },
  { symbol: 'AMZN',  name: 'Amazon.com',          base: 195.40,  sector: 'E-Commerce', flag: '🇺🇸', vol: 0.003, tier: 'pulse'    },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',        base: 875.40,  sector: 'Semiconductors',flag: '🇺🇸',vol: 0.004, tier: 'pulse'   },
  { symbol: 'META',  name: 'Meta Platforms',      base: 510.20,  sector: 'Social Media',flag: '🇺🇸', vol: 0.003, tier: 'pulse'    },
  { symbol: 'DANGCEM','name': 'Dangote Cement',   base: 650.00,  sector: 'Materials',  flag: '🇳🇬', vol: 0.003, tier: 'spark'    },
  { symbol: 'GTCO',  name: 'GT Co. Holding',      base: 52.40,   sector: 'Banking',    flag: '🇳🇬', vol: 0.004, tier: 'spark'    },
  { symbol: 'KNV',   name: 'KOINOVATE Stock',     base: 1250.00, sector: 'Fintech',    flag: '🇳🇬', vol: 0.002, tier: 'spark', isKoinovate: true },
  { symbol: 'BRK.A', name: 'Berkshire Hathaway',  base: 635200,  sector: 'Finance',    flag: '🇺🇸', vol: 0.001, tier: 'momentum' },
  { symbol: 'SPX500I','name': 'S&P 500 ETF',      base: 531.80,  sector: 'Index Fund', flag: '🇺🇸', vol: 0.001, tier: 'momentum' },
]

function IndexCard({ index }) {
  const { price, up } = useAnimatedPrice(index.base, index.vol)
  const change = ((price - index.base) / index.base * 100).toFixed(2)
  return (
    <div style={{
      padding: '16px 18px', background: 'rgba(17,34,64,0.7)', border: `1px solid ${up ? 'rgba(100,255,218,0.12)' : 'rgba(255,128,128,0.1)'}`,
      borderRadius: 14, minWidth: 160, transition: 'all 0.4s', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>{index.flag}</span>
        <span style={{ color: up ? '#64ffda' : '#ff8080', fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{up ? '▲' : '▼'} {Math.abs(change)}%</span>
      </div>
      <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginBottom: 4 }}>{index.symbol}</p>
      <p style={{ fontFamily: '"Orbitron", monospace', color: up ? '#64ffda' : '#ff8080', fontSize: 15, fontWeight: 700, transition: 'color 0.3s' }}>{price.toLocaleString()}</p>
      <p style={{ color: '#8892b0', fontSize: 10, fontFamily: '"DM Sans", sans-serif' }}>{index.name}</p>
    </div>
  )
}

function StockCard({ stock }) {
  const { price, up } = useAnimatedPrice(stock.base, stock.vol)
  const change = ((price - stock.base) / stock.base * 100).toFixed(2)
  const accessible = stock.tier === 'spark' || (stock.tier === 'pulse' && ['pulse','momentum'].includes(USER_TIER)) || (stock.tier === 'momentum' && USER_TIER === 'momentum')
  const tierColors = { spark: '#a8b2d8', pulse: '#64ffda', momentum: '#00b4d8' }

  return (
    <div style={{
      padding: '22px', background: stock.isKoinovate ? 'rgba(100,255,218,0.05)' : 'rgba(17,34,64,0.6)',
      border: `1px solid ${stock.isKoinovate ? 'rgba(100,255,218,0.2)' : accessible ? 'rgba(100,255,218,0.07)' : 'rgba(100,100,100,0.1)'}`,
      borderRadius: 18, opacity: accessible ? 1 : 0.6, transition: 'all 0.3s', position: 'relative',
    }}
    onMouseEnter={e => accessible && (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={e => accessible && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {stock.isKoinovate && (
        <div style={{ position: 'absolute', top: 12, right: 12, background: '#64ffda', color: '#0a192f', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, fontFamily: '"Orbitron", monospace' }}>⚡ KOINOVATE</div>
      )}
      {!accessible && (
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 16 }}>🔒</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{stock.flag}</span>
            <span style={{ fontFamily: '"Orbitron", monospace', color: stock.isKoinovate ? '#64ffda' : '#e6f1ff', fontSize: 14, fontWeight: 700 }}>{stock.symbol}</span>
          </div>
          <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{stock.name}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: up ? '#64ffda' : '#ff8080', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', transition: 'color 0.3s' }}>{up ? '▲' : '▼'} {Math.abs(change)}%</p>
          <span style={{ padding: '2px 8px', borderRadius: 6, background: `${tierColors[stock.tier]}15`, color: tierColors[stock.tier], fontSize: 9, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>{stock.tier.toUpperCase()}</span>
        </div>
      </div>

      <p style={{ fontFamily: '"Orbitron", monospace', color: up ? '#64ffda' : '#ff8080', fontSize: 20, fontWeight: 700, marginBottom: 4, transition: 'all 0.4s' }}>
        {stock.symbol === 'BRK.A' ? `$${Math.round(price).toLocaleString()}` : stock.flag === '🇳🇬' ? `₦${price.toFixed(2)}` : `$${price.toFixed(2)}`}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{stock.sector}</span>
        {stock.isKoinovate && USER_TIER === 'momentum' && (
          <span style={{ color: '#64ffda', fontSize: 11, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Priority Dividends ✓</span>
        )}
      </div>
    </div>
  )
}

export default function StocksPage() {
  const [filter, setFilter] = useState('All')
  const sectors = ['All', 'Technology', 'Banking', 'Fintech', 'Materials', 'Auto/EV', 'Finance', 'Index Fund', 'Social Media', 'Semiconductors', 'E-Commerce']

  const filtered = filter === 'All' ? stocks : stocks.filter(s => s.sector === filter)

  return (
    <div style={{ background: '#0a192f', minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <section style={{ padding: '50px 24px 30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 'clamp(30px, 5vw, 54px)', fontWeight: 800, marginBottom: 14, position: 'relative' }}>
          📈 Stocks{' '}
          <span style={{ background: 'linear-gradient(135deg, #34d399, #64ffda)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tracker</span>
        </h1>
        <p style={{ color: '#8892b0', fontSize: 16, maxWidth: 520, margin: '0 auto 24px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7, position: 'relative' }}>
          Live global stock market indices and KOINOVATE stocks. Momentum members get priority dividends on KNV stock.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          <span style={{ color: '#34d399', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Live Prices · Updates every 1.8s</span>
        </div>
      </section>

      {/* Global Indices ticker */}
      <div style={{ padding: '16px 0', borderTop: '1px solid rgba(100,255,218,0.06)', borderBottom: '1px solid rgba(100,255,218,0.06)', marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 16, padding: '0 24px', overflowX: 'auto', paddingBottom: 8 }}>
          {globalIndices.map(idx => <IndexCard key={idx.symbol} index={idx} />)}
        </div>
      </div>

      {/* KOINOVATE Stock Featured */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{
          padding: '28px 32px', background: 'linear-gradient(135deg, rgba(100,255,218,0.08), rgba(17,34,64,0.9))',
          border: '1px solid rgba(100,255,218,0.2)', borderRadius: 22, position: 'relative', overflow: 'hidden',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24,
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,255,218,0.06), transparent)', pointerEvents: 'none' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 18, fontWeight: 700 }}>⚡ KNV</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(100,255,218,0.1)', color: '#64ffda', fontSize: 10, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>KOINOVATE STOCK</span>
            </div>
            <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', maxWidth: 400, lineHeight: 1.6 }}>
              KOINOVATE's own fintech stock. Momentum members receive <strong style={{ color: '#64ffda' }}>priority dividends</strong> and early access to stock issuances.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['Current Price', '₦1,250.00'],['7d Change', '+2.4%'],['Dividend Yield', '8.2% PA'],['Market Cap', '₦12.5B']].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: '"Orbitron", monospace', color: '#64ffda', fontSize: 14, fontWeight: 700 }}>{val}</p>
              </div>
            ))}
          </div>
          {USER_TIER === 'momentum' ? (
            <div style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
              ✅ Priority Dividends Active
            </div>
          ) : (
            <Link href="/membership" style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: '#00b4d8', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none' }}>
              Upgrade for Priority →
            </Link>
          )}
        </div>
      </div>

      {/* Stock grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {sectors.slice(0, 8).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 14px', borderRadius: 20,
              border: `1px solid ${filter === s ? 'rgba(52,211,153,0.4)' : 'rgba(100,255,218,0.1)'}`,
              background: filter === s ? 'rgba(52,211,153,0.1)' : 'transparent',
              color: filter === s ? '#34d399' : '#8892b0',
              fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filtered.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
        </div>
      </section>
    </div>
  )
}
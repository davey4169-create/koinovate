'use client'
import { useState, useEffect } from 'react'

function useCount(target, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0; const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) } else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return val
}

const streams = [
  { label: 'Membership Fees',      value: 4200000, pct: 50, color: '#64ffda' },
  { label: 'Casino House Edge',    value: 2100000, pct: 25, color: '#f59e0b' },
  { label: 'AI Trading Fees',      value: 1260000, pct: 15, color: '#a855f7' },
  { label: 'Survey Commissions',   value: 840000,  pct: 10, color: '#00b4d8' },
]

const daily = [
  { day: 'Mon', revenue: 280000, users: 410 },
  { day: 'Tue', revenue: 320000, users: 520 },
  { day: 'Wed', revenue: 195000, users: 380 },
  { day: 'Thu', revenue: 410000, users: 680 },
  { day: 'Fri', revenue: 360000, users: 590 },
  { day: 'Sat', revenue: 520000, users: 820 },
  { day: 'Sun', revenue: 290000, users: 430 },
]

const maxRev = Math.max(...daily.map(d => d.revenue))

export default function AdminAnalyticsPage() {
  const totalRev = useCount(8420000)
  const totalUsers = useCount(10)
  const dau = useCount(12440)
  const payouts = useCount(2400000)

  return (
    <div style={{ padding: '28px 24px' }}>
      <style>{`@keyframes barGrow { from{height:0;opacity:0} to{opacity:1} }`}</style>
      <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📈 Platform Analytics</h1>
      <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Real-time platform performance and revenue overview</p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '💰', label: 'Total Revenue',   value: `₦${totalRev.toLocaleString()}`,     sub: 'All time',    color: '#64ffda' },
          { icon: '👥', label: 'Total Users',      value: `${totalUsers}`,                      sub: 'Registered',  color: '#00b4d8' },
          { icon: '📱', label: 'Daily Active',     value: `${dau.toLocaleString()}`,            sub: 'Today',       color: '#a855f7' },
          { icon: '💳', label: 'Total Payouts',    value: `₦${payouts.toLocaleString()}`,       sub: 'Processed',   color: '#f59e0b' },
          { icon: '🤖', label: 'AI Trade Vol',     value: '$142,000',                           sub: 'This week',   color: '#64ffda' },
          { icon: '🎰', label: 'Casino Revenue',   value: '₦1,240,000',                        sub: 'This month',  color: '#f59e0b' },
          { icon: '📊', label: 'Survey Earnings',  value: '₦840,000',                          sub: 'Paid out',    color: '#00b4d8' },
          { icon: '🤝', label: 'Referrals',        value: '2,847',                             sub: 'Total',       color: '#a855f7' },
        ].map(s => (
          <div key={s.label} style={{ padding: '20px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ color: s.color, fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${s.color}15` }}>{s.sub}</span>
            </div>
            <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"DM Sans", sans-serif', marginBottom: 4 }}>{s.label}</p>
            <p style={{ color: '#e6f1ff', fontSize: 20, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>

        {/* Bar chart */}
        <div style={{ padding: '24px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 20 }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Weekly Revenue</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, marginBottom: 12 }}>
            {daily.map(d => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <p style={{ color: '#64ffda', fontSize: 9, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>₦{Math.round(d.revenue/1000)}k</p>
                <div style={{ width: '100%', height: `${(d.revenue / maxRev) * 140}px`, background: 'linear-gradient(180deg, #64ffda, #00b4d8)', borderRadius: '4px 4px 0 0', animation: 'barGrow 0.8s ease forwards', minHeight: 10 }} />
                <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{d.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue streams */}
        <div style={{ padding: '24px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 20 }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Revenue by Stream</h3>
          {streams.map(s => (
            <div key={s.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#a8b2d8', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{s.label}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: s.color, fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>₦{s.value.toLocaleString()}</span>
                  <span style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{s.pct}%</span>
                </div>
              </div>
              <div style={{ height: 7, background: 'rgba(100,100,100,0.15)', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User tier breakdown */}
      <div style={{ padding: '24px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 20 }}>
        <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>User Distribution by Tier</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[['SPARK','#a8b2d8',3,30],['PULSE','#64ffda',5,50],['MOMENTUM','#00b4d8',2,20]].map(([tier, color, count, pct]) => (
            <div key={tier} style={{ padding: '20px', background: 'rgba(6,15,30,0.6)', border: `1px solid ${color}20`, borderRadius: 16 }}>
              <p style={{ fontFamily: '"Orbitron", monospace', color, fontSize: 12, letterSpacing: '0.12em', marginBottom: 8 }}>{tier}</p>
              <p style={{ color: '#e6f1ff', fontSize: 28, fontWeight: 800, fontFamily: '"Syne", sans-serif', marginBottom: 8 }}>{count}</p>
              <div style={{ height: 5, background: 'rgba(100,100,100,0.15)', borderRadius: 3, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
              </div>
              <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{pct}% of total users</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
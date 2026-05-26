'use client'
import { useState } from 'react'
import Link from 'next/link'

const users = [
  { id: 1, name: 'David Johnson',  email: 'david@mail.com',  tier: 'PULSE',    status: 'Active',    joined: 'May 20',  balance: '₦342,500', kyc: 'Skipped' },
  { id: 2, name: 'Adaeze Obi',     email: 'adaeze@mail.com', tier: 'MOMENTUM', status: 'Active',    joined: 'May 18',  balance: '₦891,200', kyc: 'Skipped' },
  { id: 3, name: 'Emeka Nwachukwu',email: 'emeka@mail.com',  tier: 'SPARK',    status: 'Active',    joined: 'May 15',  balance: '₦42,000',  kyc: 'Skipped' },
  { id: 4, name: 'Fatima Hassan',  email: 'fatima@mail.com', tier: 'PULSE',    status: 'Suspended', joined: 'May 10',  balance: '₦180,500', kyc: 'Skipped' },
  { id: 5, name: 'Chidi Eze',      email: 'chidi@mail.com',  tier: 'MOMENTUM', status: 'Active',    joined: 'May 8',   balance: '₦1,240,000',kyc: 'Skipped' },
  { id: 6, name: 'Ngozi Okonkwo', email: 'ngozi@mail.com',  tier: 'SPARK',    status: 'Active',    joined: 'May 5',   balance: '₦28,000',  kyc: 'Skipped' },
  { id: 7, name: 'Yusuf Abdullahi',email: 'yusuf@mail.com',  tier: 'PULSE',    status: 'Active',    joined: 'Apr 30',  balance: '₦215,000', kyc: 'Skipped' },
  { id: 8, name: 'Amaka Obi',      email: 'amaka@mail.com',  tier: 'SPARK',    status: 'Suspended', joined: 'Apr 28',  balance: '₦5,000',   kyc: 'Skipped' },
]

const tierColors = { SPARK: '#a8b2d8', PULSE: '#64ffda', MOMENTUM: '#00b4d8' }
const statusColors = { Active: '#64ffda', Suspended: '#ff8080', Pending: '#f59e0b' }

function StatCard({ icon, label, value, sub, color = '#64ffda' }) {
  return (
    <div style={{ padding: '22px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.08)', borderRadius: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${color}15`, color, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{sub}</span>
      </div>
      <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"DM Sans", sans-serif', marginBottom: 6 }}>{label}</p>
      <p style={{ color: '#e6f1ff', fontSize: 24, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [userList, setUserList] = useState(users)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState(null)
  const [creditForm, setCreditForm] = useState({ amount: '', type: 'credit' })
  const [creditMsg, setCreditMsg] = useState(null)
  const [activeTab, setActiveTab] = useState('users')

  const [packages, setPackages] = useState([
    { name: 'SPARK',    price: 8000,  color: '#a8b2d8', starterReward: 5000, referral: 5100, tasks: 5 },
    { name: 'PULSE',    price: 15000, color: '#64ffda', starterReward: 11000, referral: 8000, tasks: 12 },
    { name: 'MOMENTUM', price: 25000, color: '#00b4d8', starterReward: 20000, referral: 10000, tasks: 999 },
  ])
  const [editPkg, setEditPkg] = useState(null)
  const [pkgMsg, setPkgMsg] = useState(null)

  const toggleSuspend = id => {
    setUserList(list => list.map(u => u.id === id ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u))
  }

  const handleCredit = e => {
    e.preventDefault()
    setCreditMsg({ type: 'success', text: `✅ ${creditForm.type === 'credit' ? 'Credited' : 'Debited'} ₦${Number(creditForm.amount).toLocaleString()} ${creditForm.type === 'credit' ? 'to' : 'from'} ${selectedUser.name}'s wallet.` })
    setTimeout(() => { setCreditMsg(null); setSelectedUser(null) }, 2500)
  }

  const savePkg = () => {
    setPackages(ps => ps.map(p => p.name === editPkg.name ? editPkg : p))
    setPkgMsg('✅ Package updated successfully!')
    setTimeout(() => { setPkgMsg(null); setEditPkg(null) }, 2000)
  }

  const filtered = userList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = filterTier === 'ALL' || u.tier === filterTier
    const matchStatus = filterStatus === 'ALL' || u.status === filterStatus
    return matchSearch && matchTier && matchStatus
  })

  return (
    <div style={{ padding: '32px 24px', minHeight: 'calc(100vh - 56px)' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          ⚡ Admin Control Center
        </h1>
        <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>
          Full platform control · {userList.length} total users · {userList.filter(u => u.status === 'Active').length} active
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Users"     value={userList.length}                              sub="+12 today"   />
        <StatCard icon="💰" label="Platform Revenue" value="₦28.9M"                                     sub="This month"  color="#f59e0b" />
        <StatCard icon="💎" label="Momentum"          value={userList.filter(u=>u.tier==='MOMENTUM').length} sub="Members"   color="#00b4d8" />
        <StatCard icon="⚡" label="Pulse"             value={userList.filter(u=>u.tier==='PULSE').length}  sub="Members"    color="#64ffda" />
        <StatCard icon="🌱" label="Spark"             value={userList.filter(u=>u.tier==='SPARK').length}  sub="Members"    color="#a8b2d8" />
        <StatCard icon="🚫" label="Suspended"         value={userList.filter(u=>u.status==='Suspended').length} sub="Users" color="#ff8080" />
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['users','👥 Users'],['packages','💎 Packages'],['analytics','📈 Analytics']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: activeTab === id ? 'rgba(255,107,107,0.15)' : 'rgba(8,18,36,0.8)',
            color: activeTab === id ? '#ff6b6b' : '#8892b0',
            fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
            border: `1px solid ${activeTab === id ? 'rgba(255,107,107,0.3)' : 'rgba(100,100,100,0.2)'}`,
            transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {/* ── USERS TAB ──────────────────────────────────── */}
      {activeTab === 'users' && (
        <div style={{ background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.08)', borderRadius: 20, overflow: 'hidden' }}>
          {/* Filters */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,107,107,0.06)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text" placeholder="🔍 Search users..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
            />
            <select value={filterTier} onChange={e => setFilterTier(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
              {['ALL','SPARK','PULSE','MOMENTUM'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
              {['ALL','Active','Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
            <span style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{filtered.length} users</span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'rgba(6,15,30,0.5)' }}>
                  {['User','Email','Tier','Status','Balance','Joined','Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid rgba(255,107,107,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,107,107,0.04)', background: i % 2 === 0 ? 'rgba(8,18,36,0.3)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${tierColors[u.tier]}30, transparent)`, border: `1px solid ${tierColors[u.tier]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tierColors[u.tier], fontSize: 13, fontWeight: 700, fontFamily: '"Syne", sans-serif', flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <span style={{ color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 6, background: `${tierColors[u.tier]}15`, color: tierColors[u.tier], fontSize: 11, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>{u.tier}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[u.status] }} />
                        <span style={{ color: statusColors[u.status], fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{u.balance}</td>
                    <td style={{ padding: '14px 16px', color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.joined}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelectedUser(u)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(100,255,218,0.2)', background: 'rgba(100,255,218,0.06)', color: '#64ffda', fontSize: 11, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>💰 Credit</button>
                        <button onClick={() => toggleSuspend(u.id)} style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${u.status === 'Active' ? 'rgba(255,107,107,0.2)' : 'rgba(100,255,218,0.2)'}`, background: u.status === 'Active' ? 'rgba(255,107,107,0.06)' : 'rgba(100,255,218,0.06)', color: u.status === 'Active' ? '#ff8080' : '#64ffda', fontSize: 11, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                          {u.status === 'Active' ? '🚫 Suspend' : '✅ Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PACKAGES TAB ───────────────────────────────── */}
      {activeTab === 'packages' && (
        <div>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Membership Package Editor</h2>
          <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Edit pricing, rewards, and limits for each membership tier.</p>
          {pkgMsg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{pkgMsg}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {packages.map(pkg => (
              <div key={pkg.name} style={{ padding: '24px', background: 'rgba(8,18,36,0.8)', border: `1px solid ${pkg.color}25`, borderRadius: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontFamily: '"Orbitron", monospace', color: pkg.color, fontSize: 13, letterSpacing: '0.15em' }}>{pkg.name}</p>
                  <button onClick={() => setEditPkg({ ...pkg })} style={{ padding: '5px 14px', borderRadius: 7, border: `1px solid ${pkg.color}30`, background: `${pkg.color}10`, color: pkg.color, fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>✏️ Edit</button>
                </div>
                {editPkg?.name === pkg.name ? (
                  <div>
                    {[['Monthly Price (₦)','price','number'],['Starter Reward (₦)','starterReward','number'],['Referral Bonus (₦)','referral','number'],['Daily Tasks Limit','tasks','number']].map(([label, key, type]) => (
                      <div key={key} style={{ marginBottom: 12 }}>
                        <label style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', display: 'block', marginBottom: 5 }}>{label}</label>
                        <input
                          type={type} value={editPkg[key]}
                          onChange={e => setEditPkg(p => ({ ...p, [key]: Number(e.target.value) }))}
                          style={{ width: '100%', padding: '9px 12px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 8, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={savePkg} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: pkg.color, color: '#0a192f', fontWeight: 700, fontSize: 13, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Save Changes</button>
                      <button onClick={() => setEditPkg(null)} style={{ padding: '10px 16px', borderRadius: 9, border: '1px solid rgba(100,100,100,0.2)', background: 'transparent', color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[['Monthly Price', `₦${pkg.price.toLocaleString()}`], ['Starter Reward', `₦${pkg.starterReward.toLocaleString()}`], ['Referral Bonus', `₦${pkg.referral.toLocaleString()}`], ['Daily Tasks', pkg.tasks === 999 ? 'Unlimited' : pkg.tasks]].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{label}</span>
                        <span style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALYTICS TAB ──────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div>
          <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Platform Analytics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '💰', label: 'Total Platform Revenue', value: '₦8,420,000', sub: 'All time' },
              { icon: '💳', label: 'Total Payouts',           value: '₦7,890,000', sub: 'Processed' },
              { icon: '📊', label: 'Active Surveys',          value: '6',          sub: 'Live now' },
              { icon: '🤖', label: 'AI Trade Volume',         value: '$142,000',   sub: 'This week' },
              { icon: '🎰', label: 'Casino Revenue',          value: '₦1,240,000', sub: 'This month' },
              { icon: '📚', label: 'Courses Completed',       value: '3,421',      sub: 'Total' },
              { icon: '🤝', label: 'Total Referrals',         value: '2,847',      sub: 'Processed' },
              { icon: '📱', label: 'Daily Active Users',      value: '12,440',     sub: 'Today' },
            ].map(s => (
              <div key={s.label} style={{ padding: '20px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 16 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"DM Sans", sans-serif', margin: '10px 0 4px' }}>{s.label}</p>
                <p style={{ color: '#e6f1ff', fontSize: 22, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{s.value}</p>
                <p style={{ color: '#64ffda', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Revenue breakdown */}
          <div style={{ padding: '24px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 20 }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Revenue by Stream</h3>
            {[
              { label: 'Membership Fees', value: '₦4,200,000', pct: 50, color: '#64ffda' },
              { label: 'Casino House Edge', value: '₦2,100,000', pct: 25, color: '#f59e0b' },
              { label: 'AI Trading Fees',  value: '₦1,260,000', pct: 15, color: '#a855f7' },
              { label: 'Survey Commissions',value: '₦840,000',  pct: 10, color: '#00b4d8' },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{r.label}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: r.color, fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{r.value}</span>
                    <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{r.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(100,100,100,0.15)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CREDIT/DEBIT MODAL ──────────────────────────── */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={e => e.target === e.currentTarget && setSelectedUser(null)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 420, width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 800 }}>💳 Credit / Debit Wallet</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.1)', borderRadius: 12, marginBottom: 24 }}>
              <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>
                User: <strong style={{ color: '#e6f1ff' }}>{selectedUser.name}</strong><br />
                Current Balance: <strong style={{ color: '#64ffda' }}>{selectedUser.balance}</strong>
              </p>
            </div>
            {creditMsg && <div style={{ padding: '11px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{creditMsg.text}</div>}
            <form onSubmit={handleCredit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif' }}>Transaction Type</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['credit','✅ Credit'],['debit','💸 Debit']].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setCreditForm(f => ({ ...f, type: val }))} style={{
                      flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: creditForm.type === val ? (val === 'credit' ? 'rgba(100,255,218,0.12)' : 'rgba(255,107,107,0.12)') : 'rgba(20,35,60,0.8)',
                      color: creditForm.type === val ? (val === 'credit' ? '#64ffda' : '#ff8080') : '#8892b0',
                      fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
                      border: `1px solid ${creditForm.type === val ? (val === 'credit' ? 'rgba(100,255,218,0.3)' : 'rgba(255,107,107,0.3)') : 'rgba(100,100,100,0.2)'}`,
                    }}>{label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif' }}>Amount (₦)</label>
                <input type="number" placeholder="Enter amount" value={creditForm.amount} onChange={e => setCreditForm(f => ({ ...f, amount: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1px solid rgba(100,255,218,0.3)'}
                onBlur={e => e.target.style.border = '1px solid rgba(100,100,100,0.2)'}
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: creditForm.type === 'credit' ? 'linear-gradient(135deg, #64ffda, #00b4d8)' : 'linear-gradient(135deg, #ff6b6b, #ff4040)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
                {creditForm.type === 'credit' ? '✅ Credit Wallet' : '💸 Debit Wallet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
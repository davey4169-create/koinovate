'use client'
import { useState } from 'react'

const allUsers = [
  { id:1,  name:'David Johnson',    email:'david@mail.com',   tier:'PULSE',    status:'Active',    balance:342500,  joined:'May 20, 2025', referrals:17, tasks:9  },
  { id:2,  name:'Adaeze Obi',       email:'adaeze@mail.com',  tier:'MOMENTUM', status:'Active',    balance:891200,  joined:'May 18, 2025', referrals:42, tasks:12 },
  { id:3,  name:'Emeka Nwachukwu',  email:'emeka@mail.com',   tier:'SPARK',    status:'Active',    balance:42000,   joined:'May 15, 2025', referrals:3,  tasks:5  },
  { id:4,  name:'Fatima Hassan',    email:'fatima@mail.com',  tier:'PULSE',    status:'Suspended', balance:180500,  joined:'May 10, 2025', referrals:8,  tasks:0  },
  { id:5,  name:'Chidi Eze',        email:'chidi@mail.com',   tier:'MOMENTUM', status:'Active',    balance:1240000, joined:'May 8, 2025',  referrals:61, tasks:12 },
  { id:6,  name:'Ngozi Okonkwo',    email:'ngozi@mail.com',   tier:'SPARK',    status:'Active',    balance:28000,   joined:'May 5, 2025',  referrals:1,  tasks:4  },
  { id:7,  name:'Yusuf Abdullahi',  email:'yusuf@mail.com',   tier:'PULSE',    status:'Active',    balance:215000,  joined:'Apr 30, 2025', referrals:14, tasks:11 },
  { id:8,  name:'Amaka Obi',        email:'amaka@mail.com',   tier:'SPARK',    status:'Suspended', balance:5000,    joined:'Apr 28, 2025', referrals:0,  tasks:2  },
  { id:9,  name:'Tunde Adeyemi',    email:'tunde@mail.com',   tier:'MOMENTUM', status:'Active',    balance:560000,  joined:'Apr 25, 2025', referrals:29, tasks:12 },
  { id:10, name:'Kemi Olatunji',    email:'kemi@mail.com',    tier:'PULSE',    status:'Active',    balance:98000,   joined:'Apr 20, 2025', referrals:6,  tasks:10 },
]

const tc = { SPARK:'#a8b2d8', PULSE:'#64ffda', MOMENTUM:'#00b4d8' }
const sc = { Active:'#64ffda', Suspended:'#ff8080' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState(allUsers)
  const [search, setSearch] = useState('')
  const [tierF, setTierF] = useState('ALL')
  const [statF, setStatF] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modal, setModal] = useState(null) // 'credit'|'tier'|'detail'
  const [creditAmt, setCreditAmt] = useState('')
  const [creditType, setCreditType] = useState('credit')
  const [newTier, setNewTier] = useState('')
  const [actionMsg, setActionMsg] = useState(null)

  const filtered = users.filter(u => {
    const s = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const t = tierF === 'ALL' || u.tier === tierF
    const st = statF === 'ALL' || u.status === statF
    return s && t && st
  })

  const toggleSuspend = id => setUsers(l => l.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))

  const doCredit = () => {
    if (!creditAmt) return
    setUsers(l => l.map(u => u.id === selectedUser.id ? { ...u, balance: creditType === 'credit' ? u.balance + Number(creditAmt) : Math.max(0, u.balance - Number(creditAmt)) } : u))
    setActionMsg(`✅ ${creditType === 'credit' ? 'Credited' : 'Debited'} ₦${Number(creditAmt).toLocaleString()} ${creditType === 'credit' ? 'to' : 'from'} ${selectedUser.name}`)
    setModal(null); setCreditAmt('')
    setTimeout(() => setActionMsg(null), 3000)
  }

  const doTier = () => {
    if (!newTier) return
    setUsers(l => l.map(u => u.id === selectedUser.id ? { ...u, tier: newTier } : u))
    setActionMsg(`✅ ${selectedUser.name}'s tier changed to ${newTier}`)
    setModal(null); setNewTier('')
    setTimeout(() => setActionMsg(null), 3000)
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>👥 User Management</h1>
      <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Manage all {users.length} KOINOVATE members</p>

      {actionMsg && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{actionMsg}</div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Users',  value: users.length,                                color: '#64ffda' },
          { label: 'Active',       value: users.filter(u=>u.status==='Active').length,  color: '#64ffda' },
          { label: 'Suspended',    value: users.filter(u=>u.status==='Suspended').length,color: '#ff8080'},
          { label: 'Momentum',     value: users.filter(u=>u.tier==='MOMENTUM').length,  color: '#00b4d8' },
          { label: 'Pulse',        value: users.filter(u=>u.tier==='PULSE').length,     color: '#64ffda' },
          { label: 'Spark',        value: users.filter(u=>u.tier==='SPARK').length,     color: '#a8b2d8' },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14 }}>
            <p style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"DM Sans", sans-serif', marginBottom: 6 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, padding: '16px 20px', background: 'rgba(8,18,36,0.6)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14 }}>
        <input type="text" placeholder="🔍 Search name or email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }} />
        <select value={tierF} onChange={e => setTierF(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
          {['ALL','SPARK','PULSE','MOMENTUM'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statF} onChange={e => setStatF(e.target.value)} style={{ padding: '9px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
          {['ALL','Active','Suspended'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'rgba(6,15,30,0.6)' }}>
                {['User','Tier','Status','Balance','Referrals','Tasks','Joined','Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,107,107,0.06)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,107,107,0.04)', background: i % 2 === 0 ? 'rgba(8,18,36,0.3)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${tc[u.tier]}30, transparent)`, border: `1px solid ${tc[u.tier]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc[u.tier], fontSize: 14, fontWeight: 700, fontFamily: '"Syne", sans-serif', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                      <div>
                        <p style={{ color: '#e6f1ff', fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{u.name}</p>
                        <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 6, background: `${tc[u.tier]}15`, color: tc[u.tier], fontSize: 10, fontFamily: '"Orbitron", monospace', fontWeight: 700 }}>{u.tier}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc[u.status] }} />
                      <span style={{ color: sc[u.status], fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>₦{u.balance.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', textAlign: 'center' }}>{u.referrals}</td>
                  <td style={{ padding: '14px 16px', color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', textAlign: 'center' }}>{u.tasks}</td>
                  <td style={{ padding: '14px 16px', color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{u.joined}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button onClick={() => { setSelectedUser(u); setModal('credit') }} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(100,255,218,0.2)', background: 'rgba(100,255,218,0.06)', color: '#64ffda', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>💰</button>
                      <button onClick={() => { setSelectedUser(u); setNewTier(u.tier); setModal('tier') }} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.06)', color: '#a855f7', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>💎</button>
                      <button onClick={() => toggleSuspend(u.id)} style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${u.status === 'Active' ? 'rgba(255,107,107,0.2)' : 'rgba(100,255,218,0.2)'}`, background: u.status === 'Active' ? 'rgba(255,107,107,0.06)' : 'rgba(100,255,218,0.06)', color: u.status === 'Active' ? '#ff8080' : '#64ffda', fontSize: 10, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                        {u.status === 'Active' ? '🚫' : '✅'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Modal */}
      {modal === 'credit' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 400, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700 }}>💰 Credit / Debit Wallet</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>
              User: <strong style={{ color: '#e6f1ff' }}>{selectedUser.name}</strong><br />
              Current: <strong style={{ color: '#64ffda' }}>₦{selectedUser.balance.toLocaleString()}</strong>
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[['credit','✅ Credit'],['debit','💸 Debit']].map(([val, label]) => (
                <button key={val} onClick={() => setCreditType(val)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: `1px solid ${creditType === val ? (val === 'credit' ? 'rgba(100,255,218,0.3)' : 'rgba(255,107,107,0.3)') : 'rgba(100,100,100,0.2)'}`, background: creditType === val ? (val === 'credit' ? 'rgba(100,255,218,0.1)' : 'rgba(255,107,107,0.1)') : 'rgba(20,35,60,0.8)', color: creditType === val ? (val === 'credit' ? '#64ffda' : '#ff8080') : '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
            <input type="number" placeholder="Amount in ₦" value={creditAmt} onChange={e => setCreditAmt(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
            <button onClick={doCredit} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: creditType === 'credit' ? 'linear-gradient(135deg,#64ffda,#00b4d8)' : 'linear-gradient(135deg,#ff6b6b,#ff4040)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              {creditType === 'credit' ? '✅ Credit Wallet' : '💸 Debit Wallet'}
            </button>
          </div>
        </div>
      )}

      {/* Tier Change Modal */}
      {modal === 'tier' && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 380, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700 }}>💎 Change Tier</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#a8b2d8', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>Changing tier for: <strong style={{ color: '#e6f1ff' }}>{selectedUser.name}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {['SPARK','PULSE','MOMENTUM'].map(t => (
                <button key={t} onClick={() => setNewTier(t)} style={{
                  padding: '14px', borderRadius: 12, border: `1px solid ${newTier === t ? tc[t] + '40' : 'rgba(100,100,100,0.2)'}`,
                  background: newTier === t ? `${tc[t]}15` : 'rgba(20,35,60,0.8)',
                  color: newTier === t ? tc[t] : '#8892b0',
                  fontSize: 14, fontFamily: '"Orbitron", monospace', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                }}>{t} {newTier === t && '← Selected'}</button>
              ))}
            </div>
            <button onClick={doTier} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              ✅ Update Tier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
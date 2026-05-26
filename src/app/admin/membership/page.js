'use client'
import { useState } from 'react'

const defaultPkgs = [
  {
    name: 'SPARK', color: '#a8b2d8', price: 8000,
    fields: { starterReward: 5000, referral: 5100, surveyMax: 5, taskLimit: 5, taskReward: 2000, casinoMax: 100000, withdrawalFreq: 'Monthly', aiTrading: false, workWithUs: false, learningHub: false },
  },
  {
    name: 'PULSE', color: '#64ffda', price: 15000,
    fields: { starterReward: 11000, referral: 8000, surveyMax: 10, taskLimit: 12, taskReward: 8000, casinoMax: 500000, withdrawalFreq: 'Bi-Weekly', aiTrading: true, workWithUs: false, learningHub: false },
  },
  {
    name: 'MOMENTUM', color: '#00b4d8', price: 25000,
    fields: { starterReward: 20000, referral: 10000, surveyMax: 50, taskLimit: 999, taskReward: 16000, casinoMax: 1000000, withdrawalFreq: 'Weekly', aiTrading: true, workWithUs: true, learningHub: true },
  },
]

const fieldLabels = {
  starterReward: 'Starter Reward (₦)', referral: 'Referral Bonus (₦)', surveyMax: 'Max Survey Earn ($)',
  taskLimit: 'Daily Task Limit', taskReward: 'Max Task Reward (₦)', casinoMax: 'Casino Potential (₦)',
  withdrawalFreq: 'Withdrawal Frequency', aiTrading: 'AI Trading Access', workWithUs: 'Work With KOINOVATE', learningHub: 'Learning Hub Access',
}

export default function AdminMembershipPage() {
  const [packages, setPackages] = useState(defaultPkgs)
  const [editIdx, setEditIdx] = useState(null)
  const [editData, setEditData] = useState(null)
  const [msg, setMsg] = useState(null)

  const startEdit = i => { setEditIdx(i); setEditData({ ...packages[i], fields: { ...packages[i].fields } }) }

  const save = () => {
    setPackages(ps => ps.map((p, i) => i === editIdx ? editData : p))
    setMsg(`✅ ${editData.name} package updated successfully!`)
    setEditIdx(null); setEditData(null)
    setTimeout(() => setMsg(null), 3000)
  }

  const updateField = (key, val) => setEditData(d => ({ ...d, fields: { ...d.fields, [key]: typeof d.fields[key] === 'boolean' ? !d.fields[key] : val } }))

  return (
    <div style={{ padding: '28px 24px' }}>
      <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>💎 Membership Editor</h1>
      <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>Edit pricing, features, and limits for all membership tiers</p>

      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {packages.map((pkg, i) => (
          <div key={pkg.name} style={{ padding: '28px', background: 'rgba(8,18,36,0.8)', border: `1px solid ${pkg.color}25`, borderRadius: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={{ fontFamily: '"Orbitron", monospace', color: pkg.color, fontSize: 14, letterSpacing: '0.15em', marginBottom: 4 }}>{pkg.name}</p>
                <p style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800 }}>₦{pkg.price.toLocaleString()}<span style={{ fontSize: 14, color: '#8892b0', fontFamily: '"DM Sans", sans-serif' }}>/mo</span></p>
              </div>
              <button onClick={() => startEdit(i)} style={{ padding: '8px 18px', borderRadius: 9, border: `1px solid ${pkg.color}30`, background: `${pkg.color}10`, color: pkg.color, fontSize: 13, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>✏️ Edit</button>
            </div>

            {editIdx === i && editData ? (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ color: '#a8b2d8', fontSize: 11, display: 'block', marginBottom: 6, fontFamily: '"DM Sans", sans-serif' }}>Monthly Price (₦)</label>
                  <input type="number" value={editData.price} onChange={e => setEditData(d => ({ ...d, price: Number(e.target.value) }))}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                </div>
                {Object.entries(editData.fields).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ color: '#a8b2d8', fontSize: 11, display: 'block', marginBottom: 5, fontFamily: '"DM Sans", sans-serif' }}>{fieldLabels[key]}</label>
                    {typeof val === 'boolean' ? (
                      <button onClick={() => updateField(key, null)} style={{
                        padding: '8px 16px', borderRadius: 8, border: `1px solid ${val ? 'rgba(100,255,218,0.3)' : 'rgba(255,107,107,0.3)'}`,
                        background: val ? 'rgba(100,255,218,0.1)' : 'rgba(255,107,107,0.1)',
                        color: val ? '#64ffda' : '#ff8080', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer',
                      }}>{val ? '✅ Enabled' : '❌ Disabled'}</button>
                    ) : (
                      <input type={key === 'withdrawalFreq' ? 'text' : 'number'} value={val} onChange={e => updateField(key, e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 8, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button onClick={save} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: pkg.color, color: '#0a192f', fontWeight: 700, fontSize: 13, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>💾 Save</button>
                  <button onClick={() => { setEditIdx(null); setEditData(null) }} style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(100,100,100,0.2)', background: 'transparent', color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(pkg.fields).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(100,100,100,0.1)' }}>
                    <span style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>{fieldLabels[key]}</span>
                    <span style={{ color: typeof val === 'boolean' ? (val ? '#64ffda' : '#ff8080') : '#e6f1ff', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                      {typeof val === 'boolean' ? (val ? '✅' : '❌') : (key === 'taskLimit' && val === 999 ? '∞ Unlimited' : val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── Currency config ────────────────────────────────────────────
const CURRENCIES = [
  { code: 'NGN', symbol: '₦', rate: 1,    flag: '🇳🇬' },
  { code: 'USD', symbol: '$', rate: 1300,  flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 1650,  flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 2000,  flag: '🇬🇧' },
]

const WALLETS = [
  { id:'total',   icon:'💰', label:'Total Wallet',    color:'#64ffda', ngn:342500, change:'+₦12,500', pct:'+3.8%', desc:'Master sum of all earnings'   },
  { id:'revenue', icon:'🤝', label:'Revenue Share',    color:'#00b4d8', ngn:98100,  change:'+₦8,000',  pct:'+8.9%', desc:'Affiliate & referral earnings' },
  { id:'ai',      icon:'🤖', label:'AI Trade Balance', color:'#a855f7', ngn:244400, change:'+₦4,500',  pct:'+1.9%', desc:'AI trading engine returns'     },
]

const TRANSACTIONS = [
  { icon:'💰', name:'Wallet Top-up',    type:'Deposit',      amount:50000,  pos:true,  date:'Today 10:32 AM'    },
  { icon:'🤖', name:'AI Signal Profit', type:'Trading',      amount:12500,  pos:true,  date:'Today 09:15 AM'    },
  { icon:'📋', name:'Daily Tasks',      type:'Task Reward',  amount:8000,   pos:true,  date:'Today 08:00 AM'    },
  { icon:'📊', name:'Survey Done',      type:'Survey',       amount:13000,  pos:true,  date:'Yesterday 5:20 PM' },
  { icon:'🎰', name:'Casino Win',       type:'Casino',       amount:25000,  pos:true,  date:'Yesterday 3:10 PM' },
  { icon:'💎', name:'Pulse Membership', type:'Subscription', amount:15000,  pos:false, date:'May 22'            },
]

const NOTIFICATIONS = [
  { icon:'🤖', msg:'AI signal: BTC/USDT breakout. Check Trading Hub.', time:'2m ago',   unread:true  },
  { icon:'🎉', msg:'Account activated. All features now unlocked.',    time:'1hr ago',  unread:true  },
  { icon:'📚', msg:'New course: "Advanced DeFi" available.',           time:'3hrs ago', unread:true  },
  { icon:'💰', msg:'₦50,000 top-up confirmed.',                        time:'Today',    unread:false },
  { icon:'🏆', msg:'You ranked #24 on this week\'s leaderboard!',      time:'Yesterday',unread:false },
]

// Desktop nav groups
const DESKTOP_NAV = [
  {
    group: 'EARN',
    items: [
      { id:'overview', icon:'📊', label:'Overview',    href:null          },
      { id:'trading',  icon:'🤖', label:'AI Trading',  href:'/trading'    },
      { id:'tasks',    icon:'📋', label:'Daily Tasks',  href:'/tasks'      },
      { id:'surveys',  icon:'📊', label:'Surveys',      href:'/surveys'    },
      { id:'casino',   icon:'🎰', label:'Casino',       href:'/casino'     },
    ]
  },
  {
    group: 'INVEST',
    items: [
      { id:'stocks',   icon:'📈', label:'Stocks',       href:'/stocks'     },
      { id:'learning', icon:'📚', label:'Learning',     href:'/learning'   },
      { id:'work',     icon:'🤝', label:'Work With Us', href:'/work-with-us'},
    ]
  },
  {
    group: 'ACCOUNT',
    items: [
      { id:'membership',icon:'💎',label:'Membership',   href:'/membership' },
      { id:'support',   icon:'🎧',label:'Support',      href:'/support'    },
    ]
  },
]

// Mobile nav items (flat list for grid)
const MOBILE_NAV = [
  { label:'Overview',   icon:'📊', id:'overview', href:null              },
  { label:'AI Trading', icon:'🤖', id:'trading',  href:'/trading'       },
  { label:'Daily Tasks',icon:'📋', id:'tasks',    href:'/tasks'         },
  { label:'Surveys',    icon:'📊', id:'surveys',  href:'/surveys'       },
  { label:'Casino',     icon:'🎰', id:'casino',   href:'/casino'        },
  { label:'Stocks',     icon:'📈', id:'stocks',   href:'/stocks'        },
  { label:'Learning',   icon:'📚', id:'learning', href:'/learning'      },
  { label:'Work',       icon:'🤝', id:'work',     href:'/work-with-us'  },
  { label:'Membership', icon:'💎', id:'member',   href:'/membership'    },
  { label:'Support',    icon:'🎧', id:'support',  href:'/support'       },
]

// ─────────────────────────────────────────────────────────────────
// FORMAT AMOUNT
// ─────────────────────────────────────────────────────────────────
function fmt(ngn, curr) {
  const n = ngn / curr.rate
  return `${curr.symbol}${n.toLocaleString('en', { maximumFractionDigits: curr.code==='NGN'?0:2 })}`
}

// ─────────────────────────────────────────────────────────────────
// WALLET FLIP CARD
// ─────────────────────────────────────────────────────────────────
function WalletCard({ currIdx }) {
  const [idx,       setIdx]      = useState(0)
  const [flipping,  setFlipping] = useState(false)
  const [animClass, setAnim]     = useState('')
  const curr = CURRENCIES[currIdx]

  const switchTo = (newIdx) => {
    if (flipping || newIdx === idx) return
    setFlipping(true)
    setAnim('card-flip-out')
    setTimeout(() => {
      setIdx(newIdx)
      setAnim('card-flip-in')
      setTimeout(() => { setFlipping(false); setAnim('') }, 260)
    }, 260)
  }

  const flip = () => switchTo((idx + 1) % 3)
  const w = WALLETS[idx]

  return (
    <div className={animClass} style={{
      padding: '24px 22px',
      background: `linear-gradient(135deg, ${w.color}12, rgba(8,20,40,0.95))`,
      border: `1px solid ${w.color}28`,
      borderRadius: 20, position: 'relative', overflow: 'hidden',
      boxShadow: `0 4px 40px ${w.color}08`,
      minHeight: 170,
      willChange: 'transform',
      transition: 'background 0.4s',
    }}>
      <div style={{ position:'absolute', top:-24, right:-24, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${w.color}10, transparent)`, pointerEvents:'none' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ fontSize:16 }}>{w.icon}</span>
            <p style={{ color:'#8892b0', fontSize:10, fontFamily:'"DM Sans", sans-serif', letterSpacing:'0.07em', textTransform:'uppercase' }}>{w.label}</p>
          </div>
          <p style={{ fontFamily:'"Orbitron", monospace', color:w.color, fontSize:'clamp(22px,5vw,34px)', fontWeight:700, marginBottom:6, textShadow:`0 0 24px ${w.color}40`, transition:'all 0.3s' }}>
            {fmt(w.ngn, curr)}
          </p>
          <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans", sans-serif' }}>
            ↑ <span style={{ color:w.color }}>{w.change} ({w.pct})</span> this week
          </p>
          <p style={{ color:'#4a5568', fontSize:10, fontFamily:'"DM Sans", sans-serif', marginTop:4 }}>{w.desc}</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginLeft:12 }}>
          <button onClick={flip} style={{
            width:40, height:40, borderRadius:'50%',
            background:`${w.color}15`, border:`1.5px solid ${w.color}35`,
            color:w.color, fontSize:18, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.3s', boxShadow:`0 0 12px ${w.color}15`,
          }} title="Switch wallet">⇄</button>
          <div style={{ display:'flex', gap:5 }}>
            {WALLETS.map((_, i) => (
              <button key={i} onClick={() => switchTo(i)} style={{
                width: i===idx ? 16 : 6, height:6, borderRadius:3,
                background: i===idx ? w.color : 'rgba(100,255,218,0.2)',
                border:'none', cursor:'pointer', transition:'all 0.3s', padding:0,
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:6, marginTop:18 }}>
        {WALLETS.map((wal, i) => (
          <button key={wal.id} onClick={() => switchTo(i)} style={{
            flex:1, padding:'7px 4px', borderRadius:20, border:'none', cursor:'pointer',
            background: i===idx ? `${wal.color}18` : 'rgba(100,255,218,0.04)',
            color: i===idx ? wal.color : '#8892b0',
            fontSize:10, fontFamily:'"DM Sans", sans-serif', fontWeight:600,
            border:`1px solid ${i===idx ? wal.color+'28' : 'transparent'}`,
            transition:'all 0.2s',
          }}>{wal.icon} {wal.id==='total'?'Total':wal.id==='revenue'?'Revenue':'AI'}</button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PROFILE SETTINGS MODAL
// ─────────────────────────────────────────────────────────────────
function ProfileModal({ onClose }) {
  const [tab,       setTab]      = useState('profile')
  const [saving,    setSaving]   = useState(false)
  const [msg,       setMsg]      = useState(null)
  const [profile,   setProfile]  = useState({ username:'David', email:'david@gmail.com' })
  const [security,  setSecurity] = useState({ current:'', newPass:'', confirm:'' })
  const [payout,    setPayout]   = useState({ bank:'', account:'', name:'' })
  const [showPass,  setShowPass] = useState({})
  const REFERRAL_CODE = 'KNV-DAVID08'
  const REFERRAL_LINK = `https://koinovate.com/ref/${REFERRAL_CODE}`
  const [copied, setCopied] = useState(false)

  const tabs = [
    { id:'profile',  icon:'👤', label:'Profile'   },
    { id:'security', icon:'🔐', label:'Security'  },
    { id:'payout',   icon:'💳', label:'Payout'    },
    { id:'referral', icon:'🤝', label:'Referral'  },
    { id:'plan',     icon:'💎', label:'My Plan'   },
  ]

  const showMsg = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3500)
  }

  const save = async (section) => {
    if (section === 'security') {
      if (security.newPass !== security.confirm) return showMsg('error','Passwords do not match.')
      if (security.newPass.length < 8) return showMsg('error','Password must be at least 8 characters.')
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    showMsg('success', section === 'profile' ? 'Profile updated!' : section === 'security' ? 'Password changed!' : 'Payout details saved!')
    if (section === 'security') setSecurity({ current:'', newPass:'', confirm:'' })
  }

  const copy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const inputStyle = {
    width:'100%', padding:'12px 14px',
    background:'rgba(6,14,28,0.85)',
    border:'1px solid rgba(100,255,218,0.1)',
    borderRadius:10, color:'#e6f1ff', fontSize:14,
    fontFamily:'"DM Sans", sans-serif', outline:'none',
    boxSizing:'border-box', transition:'border 0.2s',
  }

  const Field = ({ label, children }) => (
    <div style={{ marginBottom:18 }}>
      <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans", sans-serif', display:'block', marginBottom:7, fontWeight:600 }}>{label}</label>
      {children}
    </div>
  )

  const PassField = ({ label, k, val, onChange }) => (
    <Field label={label}>
      <div style={{ position:'relative' }}>
        <input
          type={showPass[k] ? 'text' : 'password'}
          value={val} onChange={onChange}
          style={{ ...inputStyle, paddingRight:44 }}
          onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
          onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
        />
        <button type="button" onClick={() => setShowPass(p=>({...p,[k]:!p[k]}))} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:15, color:'#8892b0' }}>
          {showPass[k] ? '🙈' : '👁️'}
        </button>
      </div>
    </Field>
  )

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.82)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{
        background:'rgba(8,18,38,0.98)',
        border:'1px solid rgba(100,255,218,0.14)',
        borderRadius:24, width:'100%', maxWidth:520,
        maxHeight:'92vh', overflow:'hidden',
        boxShadow:'0 30px 80px rgba(0,0,0,0.7)',
        animation:'profilePopIn 0.3s cubic-bezier(0.4,0,0.2,1)',
        display:'flex', flexDirection:'column',
      }}>

        {/* Header */}
        <div style={{ padding:'20px 24px 0', borderBottom:'1px solid rgba(100,255,218,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#64ffda,#00b4d8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0a192f', fontWeight:800, fontSize:16, fontFamily:'"Syne",sans-serif' }}>D</div>
              <div>
                <p style={{ color:'#e6f1ff', fontSize:15, fontWeight:700, fontFamily:'"Syne",sans-serif' }}>David</p>
                <p style={{ color:'#64ffda', fontSize:11, fontFamily:'"DM Sans",sans-serif' }}>PULSE Member · 19 days left</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(100,255,218,0.07)', border:'1px solid rgba(100,255,218,0.15)', borderRadius:10, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', color:'#a8b2d8', fontSize:16, cursor:'pointer' }}>✕</button>
          </div>

          {/* Tabs — horizontal scroll */}
          <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:0 }}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'9px 14px', borderRadius:'10px 10px 0 0',
                border:'none', cursor:'pointer', flexShrink:0,
                background: tab===t.id ? 'rgba(100,255,218,0.1)' : 'transparent',
                color: tab===t.id ? '#64ffda' : '#8892b0',
                fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600,
                borderBottom: tab===t.id ? '2px solid #64ffda' : '2px solid transparent',
                transition:'all 0.2s',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'24px', overflowY:'auto', flex:1 }}>

          {/* Message */}
          {msg && (
            <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:18, background: msg.type==='error'?'rgba(255,80,80,0.1)':'rgba(100,255,218,0.1)', border:`1px solid ${msg.type==='error'?'rgba(255,80,80,0.35)':'rgba(100,255,218,0.35)'}`, color: msg.type==='error'?'#ff8080':'#64ffda', fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>
              {msg.type==='error'?'⚠️':'✅'} {msg.text}
            </div>
          )}

          {/* ── PROFILE TAB ───────────────────────────────── */}
          {tab==='profile' && (
            <div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:16, fontWeight:700, marginBottom:20 }}>Edit Profile</h3>

              {/* Avatar */}
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#64ffda,#00b4d8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0a192f', fontWeight:800, fontSize:28, fontFamily:'"Syne",sans-serif', margin:'0 auto 10px', boxShadow:'0 0 30px rgba(100,255,218,0.25)' }}>
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>Your avatar is auto-generated from your username initial</p>
              </div>

              <Field label="Username / Display Name">
                <input type="text" value={profile.username} onChange={e=>setProfile(p=>({...p,username:e.target.value}))}
                style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </Field>

              <Field label="Email Address">
                <input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}
                style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
                <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginTop:5 }}>⚠️ Changing email requires re-verification.</p>
              </Field>

              <Field label="Phone Number">
                <input type="tel" placeholder="+234 800 000 0000" style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </Field>

              <button onClick={()=>save('profile')} disabled={saving} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:saving?'rgba(100,255,218,0.4)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:800, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:saving?'not-allowed':'pointer' }}>
                {saving ? '⏳ Saving...' : '💾 Save Profile'}
              </button>
            </div>
          )}

          {/* ── SECURITY TAB ──────────────────────────────── */}
          {tab==='security' && (
            <div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:16, fontWeight:700, marginBottom:20 }}>Change Password</h3>
              <div style={{ padding:'14px 16px', background:'rgba(100,255,218,0.04)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:12, marginBottom:22 }}>
                <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', lineHeight:1.6 }}>🔒 For your security, use a strong password with at least 8 characters, including numbers and symbols.</p>
              </div>
              <PassField label="Current Password"  k="current" val={security.current} onChange={e=>setSecurity(p=>({...p,current:e.target.value}))} />
              <PassField label="New Password"       k="new"     val={security.newPass} onChange={e=>setSecurity(p=>({...p,newPass:e.target.value}))} />
              <PassField label="Confirm New Password" k="confirm" val={security.confirm} onChange={e=>setSecurity(p=>({...p,confirm:e.target.value}))} />
              <button onClick={()=>save('security')} disabled={saving} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:saving?'rgba(100,255,218,0.4)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:800, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:saving?'not-allowed':'pointer' }}>
                {saving ? '⏳ Updating...' : '🔐 Change Password'}
              </button>
            </div>
          )}

          {/* ── PAYOUT TAB ────────────────────────────────── */}
          {tab==='payout' && (
            <div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:16, fontWeight:700, marginBottom:8 }}>Payout Details</h3>
              <p style={{ color:'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', marginBottom:20, lineHeight:1.6 }}>Set your bank details for withdrawals. These details are used when you request a payout from your wallet.</p>

              <Field label="Bank Name">
                <input type="text" placeholder="e.g. First Bank, GTBank, Access, Zenith..." value={payout.bank} onChange={e=>setPayout(p=>({...p,bank:e.target.value}))}
                style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </Field>

              <Field label="Account Number (10 digits)">
                <input type="number" placeholder="Your 10-digit account number" value={payout.account} onChange={e=>setPayout(p=>({...p,account:e.target.value}))}
                style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </Field>

              <Field label="Account Name (as it appears on bank)">
                <input type="text" placeholder="Exact name on bank account" value={payout.name} onChange={e=>setPayout(p=>({...p,name:e.target.value}))}
                style={inputStyle}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </Field>

              <div style={{ padding:'12px 14px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:12, marginBottom:20 }}>
                <p style={{ color:'#f59e0b', fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>
                  ⚠️ Make sure these details are correct. Incorrect bank details may result in failed withdrawals.
                </p>
              </div>

              <button onClick={()=>save('payout')} disabled={saving} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:saving?'rgba(100,255,218,0.4)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:800, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:saving?'not-allowed':'pointer' }}>
                {saving ? '⏳ Saving...' : '💳 Save Payout Details'}
              </button>
            </div>
          )}

          {/* ── REFERRAL TAB ──────────────────────────────── */}
          {tab==='referral' && (
            <div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:16, fontWeight:700, marginBottom:8 }}>Your Referral Program</h3>
              <p style={{ color:'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', marginBottom:20, lineHeight:1.6 }}>
                Earn referral bonuses every time someone joins KOINOVATE using your link and activates a membership.
              </p>

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:22 }}>
                {[['17', 'Total Referrals','#64ffda'],['14','Converted','#00b4d8'],['₦119,000','Earned','#a855f7']].map(([val,label,color])=>(
                  <div key={label} style={{ padding:'14px 10px', background:'rgba(100,255,218,0.04)', border:'1px solid rgba(100,255,218,0.08)', borderRadius:14, textAlign:'center' }}>
                    <p style={{ fontFamily:'"Orbitron",monospace', color, fontSize:16, fontWeight:700, marginBottom:4 }}>{val}</p>
                    <p style={{ color:'#8892b0', fontSize:10, fontFamily:'"DM Sans",sans-serif' }}>{label}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:7, fontWeight:600 }}>Your Referral Code</label>
                <div style={{ padding:'12px 14px', background:'rgba(100,255,218,0.06)', border:'1px solid rgba(100,255,218,0.2)', borderRadius:10, fontFamily:'"Orbitron",monospace', color:'#64ffda', fontSize:15, fontWeight:700, letterSpacing:'0.1em', textAlign:'center' }}>
                  {REFERRAL_CODE}
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:7, fontWeight:600 }}>Your Referral Link</label>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ flex:1, padding:'11px 14px', background:'rgba(6,14,28,0.8)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:10, color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {REFERRAL_LINK}
                  </div>
                  <button onClick={copy} style={{ padding:'11px 18px', borderRadius:10, border:'none', background: copied?'rgba(100,255,218,0.15)':'rgba(100,255,218,0.1)', color: copied?'#64ffda':'#a8b2d8', fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight:600, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>

              <div style={{ padding:'14px', background:'rgba(100,255,218,0.04)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:14 }}>
                <p style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', marginBottom:10, fontWeight:600 }}>Your referral bonuses by tier:</p>
                {[['Spark',  'You earn ₦5,100','#a8b2d8'],['Pulse',  'You earn ₦8,000','#64ffda'],['Momentum','You earn ₦10,000','#00b4d8']].map(([t,e,c])=>(
                  <div key={t} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>Referral joins <span style={{ fontFamily:'"Orbitron",monospace', color:c, fontSize:10 }}>{t.toUpperCase()}</span></span>
                    <span style={{ color:c, fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAN TAB ──────────────────────────────────── */}
          {tab==='plan' && (
            <div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:16, fontWeight:700, marginBottom:20 }}>My Membership Plan</h3>

              {/* Current plan card */}
              <div style={{ padding:'22px', background:'linear-gradient(135deg,rgba(100,255,218,0.08),rgba(17,34,64,0.9))', border:'1px solid rgba(100,255,218,0.2)', borderRadius:18, marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <div>
                    <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:4 }}>Current Plan</p>
                    <p style={{ fontFamily:'"Orbitron",monospace', color:'#64ffda', fontSize:22, fontWeight:700 }}>PULSE</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:4 }}>Monthly Price</p>
                    <p style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:20, fontWeight:700 }}>₦15,000</p>
                  </div>
                </div>

                <div style={{ height:6, background:'rgba(100,255,218,0.1)', borderRadius:3, marginBottom:8 }}>
                  <div style={{ height:'100%', width:'65%', background:'linear-gradient(90deg,#64ffda,#00b4d8)', borderRadius:3 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif' }}>65% of billing cycle used</p>
                  <p style={{ color:'#64ffda', fontSize:11, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>19 days remaining</p>
                </div>
              </div>

              {/* Plan benefits */}
              <div style={{ marginBottom:20 }}>
                <p style={{ color:'#a8b2d8', fontSize:13, fontWeight:600, fontFamily:'"DM Sans",sans-serif', marginBottom:12 }}>Your PULSE Benefits:</p>
                {[['12 Daily Tasks','₦8,000 max/task'],['AI Trading Access','Up to $100/day'],['12 Referral Bonus','₦8,000/referral'],['5GB Data Freebie','Included'],['Bi-Weekly Withdrawals','Every 14 days'],['Casino Potential','Up to ₦500k']].map(([label,val])=>(
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(100,255,218,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'#64ffda', fontSize:13 }}>✓</span>
                      <span style={{ color:'#a8b2d8', fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{label}</span>
                    </div>
                    <span style={{ color:'#e6f1ff', fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>{val}</span>
                  </div>
                ))}
              </div>

              <Link href="/membership" onClick={onClose} style={{ display:'block', textAlign:'center', padding:'14px', borderRadius:12, background:'linear-gradient(135deg,#00b4d8,#a855f7)', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none', fontFamily:'"DM Sans",sans-serif', boxShadow:'0 0 25px rgba(0,180,216,0.2)' }}>
                👑 Upgrade to Momentum →
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PAYOUT MODAL
// ─────────────────────────────────────────────────────────────────
function PayoutModal({ onClose }) {
  const [form,    setForm]    = useState({ bank:'', account:'', name:'', amount:'' })
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState(null)

  const submit = async e => {
    e.preventDefault()
    if (!form.bank||!form.account||!form.name||!form.amount) return setError('Please fill all fields.')
    if (form.account.length !== 10) return setError('Account number must be exactly 10 digits.')
    setError(null); setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setDone(true); setLoading(false)
  }

  const inp = { width:'100%', padding:'12px 14px', background:'rgba(6,14,28,0.85)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:10, color:'#e6f1ff', fontSize:14, fontFamily:'"DM Sans",sans-serif', outline:'none', boxSizing:'border-box' }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.78)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'rgba(8,18,38,0.99)', border:'1px solid rgba(100,255,218,0.15)', borderRadius:24, padding:'32px 28px', maxWidth:440, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,0.6)', animation:'profilePopIn 0.3s ease' }}>
        {done ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
            <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#64ffda', fontSize:20, fontWeight:700, marginBottom:10 }}>Submitted!</h3>
            <p style={{ color:'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', lineHeight:1.7 }}>Your withdrawal request is being processed per your PULSE bi-weekly schedule.</p>
            <button onClick={onClose} style={{ marginTop:20, padding:'11px 28px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:700, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div>
                <h2 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:18, fontWeight:800 }}>💳 Withdraw Funds</h2>
                <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', marginTop:3 }}>Available: <strong style={{ color:'#64ffda' }}>₦342,500</strong></p>
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', color:'#8892b0', fontSize:20, cursor:'pointer' }}>✕</button>
            </div>
            {error && <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:14, background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff8080', fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>⚠️ {error}</div>}
            <form onSubmit={submit}>
              {[['Bank Name','text','bank','e.g. First Bank, GTBank...'],['Account Number','number','account','10-digit account number'],['Account Name','text','name','Name on bank account'],['Amount (₦)','number','amount','Minimum ₦5,000']].map(([label,type,key,ph])=>(
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:6, fontWeight:600 }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                  style={inp}
                  onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                  onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:loading?'rgba(100,255,218,0.4)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:800, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:loading?'not-allowed':'pointer', marginTop:4 }}>
                {loading ? '⏳ Processing...' : '↑ Submit Withdrawal'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [showPayout,    setShowPayout]    = useState(false)
  const [showProfile,   setShowProfile]   = useState(false)
  const [activeNav,     setActiveNav]     = useState('overview')
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [toast,         setToast]         = useState(null)
  const [isMobile,      setIsMobile]      = useState(false)
  const [currIdx,       setCurrIdx]       = useState(0)
  const [showCurrPicker,setShowCurrPicker]= useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 3000) }

  const handleNav = (item) => {
    if (item.href) return
    setActiveNav(item.id)
    if (isMobile) setSidebarOpen(false)
  }

  // ── DESKTOP SIDEBAR ─────────────────────────────────────────
  const DesktopSidebar = () => (
    <aside className="dashboard-sidebar sidebar-scroll" style={{
      width: 230,
      background: 'linear-gradient(180deg, rgba(6,14,30,0.99) 0%, rgba(4,10,22,0.99) 100%)',
      borderRight: '1px solid rgba(100,255,218,0.07)',
      position: 'sticky', top: 70,
      height: 'calc(100vh - 70px)',
      overflowY: 'auto', flexShrink: 0,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Profile section — clickable */}
      <div
        onClick={() => setShowProfile(true)}
        style={{
          padding: '20px 16px',
          background: 'linear-gradient(135deg, rgba(100,255,218,0.07) 0%, rgba(0,180,216,0.03) 100%)',
          borderBottom: '1px solid rgba(100,255,218,0.07)',
          cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e=>e.currentTarget.style.background='linear-gradient(135deg,rgba(100,255,218,0.1),rgba(0,180,216,0.05))'}
        onMouseLeave={e=>e.currentTarget.style.background='linear-gradient(135deg,rgba(100,255,218,0.07),rgba(0,180,216,0.03))'}
      >
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#64ffda,#00b4d8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0a192f', fontWeight:800, fontSize:15, fontFamily:'"Syne",sans-serif', flexShrink:0, boxShadow:'0 0 16px rgba(100,255,218,0.2)' }}>
            D
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <p style={{ color:'#e6f1ff', fontSize:13, fontWeight:700, fontFamily:'"DM Sans",sans-serif', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>David</p>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#64ffda', display:'inline-block', boxShadow:'0 0 5px #64ffda' }} />
              <span style={{ color:'#64ffda', fontSize:10, fontFamily:'"DM Sans",sans-serif' }}>PULSE · 19d left</span>
            </div>
          </div>
          <span style={{ color:'#4a5568', fontSize:14 }}>›</span>
        </div>
      </div>

      {/* Grouped navigation */}
      <nav style={{ flex:1, padding:'8px 8px', overflowY:'auto' }}>
        {DESKTOP_NAV.map(group => (
          <div key={group.group} style={{ marginBottom:4 }}>
            <p style={{ color:'#2d3748', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', padding:'10px 10px 5px', fontFamily:'"DM Sans",sans-serif', fontWeight:700, userSelect:'none' }}>{group.group}</p>
            {group.items.map(item => {
              const isActive = activeNav === item.id
              return item.href ? (
                <Link key={item.id} href={item.href} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:10, marginBottom:2,
                  textDecoration:'none',
                  background:'transparent',
                  color:'#8892b0',
                  fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight:500,
                  transition:'all 0.18s',
                  position:'relative',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(100,255,218,0.06)'; e.currentTarget.style.color='#e6f1ff' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#8892b0' }}
                >
                  <span style={{ fontSize:16, opacity:0.85 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <button key={item.id} onClick={()=>handleNav(item)} className={`nav-item-glow ${isActive?'active':''}`} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:10, marginBottom:2,
                  border:'none', cursor:'pointer', width:'100%', textAlign:'left',
                  background: isActive ? 'linear-gradient(90deg,rgba(100,255,218,0.12),rgba(100,255,218,0.04))' : 'transparent',
                  color: isActive ? '#64ffda' : '#8892b0',
                  fontSize:13, fontFamily:'"DM Sans",sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  transition:'all 0.18s',
                }}>
                  <span style={{ fontSize:16, opacity: isActive ? 1 : 0.85 }}>{item.icon}</span>
                  {item.label}
                  {isActive && <span style={{ marginLeft:'auto', width:5, height:5, borderRadius:'50%', background:'#64ffda', boxShadow:'0 0 6px #64ffda' }} />}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(100,255,218,0.06)', flexShrink:0 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, color:'#8892b0', textDecoration:'none', fontSize:13, fontFamily:'"DM Sans",sans-serif', transition:'all 0.2s' }}
        onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,107,107,0.06)'; e.currentTarget.style.color='#ff8080' }}
        onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#8892b0' }}
        >
          <span style={{ fontSize:16 }}>🚪</span> Sign Out
        </Link>
      </div>
    </aside>
  )

  // ── MOBILE SIDEBAR — COMPLETELY DIFFERENT DESIGN ─────────────
  const MobileSidebar = () => (
    <>
      {/* Dark overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:800, background:'rgba(0,5,15,0.75)', backdropFilter:'blur(8px)' }}
      onClick={()=>setSidebarOpen(false)} />

      {/* Slide-in panel — different from desktop */}
      <div style={{
        position:'fixed', top:0, left:0, bottom:0, zIndex:850,
        width:'82%', maxWidth:320,
        background:'radial-gradient(ellipse at top left, rgba(10,25,50,0.99) 0%, rgba(4,10,22,0.99) 100%)',
        borderRight:'1px solid rgba(100,255,218,0.1)',
        display:'flex', flexDirection:'column',
        animation:'slideInFromLeft 0.32s cubic-bezier(0.4,0,0.2,1)',
        boxShadow:'8px 0 40px rgba(0,0,0,0.6)',
      }}>

        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderBottom:'1px solid rgba(100,255,218,0.07)', flexShrink:0 }}>
          <img src="/koinovate-logo.png" alt="KOINOVATE" style={{ height:32, objectFit:'contain', filter:'drop-shadow(0 0 6px rgba(100,255,218,0.2))' }} />
          <button onClick={()=>setSidebarOpen(false)} style={{ width:32, height:32, borderRadius:9, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.15)', color:'#a8b2d8', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Profile Card — large, prominent, different from desktop */}
        <div
          onClick={()=>{ setSidebarOpen(false); setShowProfile(true) }}
          style={{
            margin:'14px 14px 10px',
            padding:'16px',
            background:'linear-gradient(135deg, rgba(100,255,218,0.1), rgba(0,180,216,0.06))',
            border:'1px solid rgba(100,255,218,0.18)',
            borderRadius:18,
            cursor:'pointer',
            transition:'all 0.2s',
            position:'relative',
            overflow:'hidden',
          }}
        >
          <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle,rgba(100,255,218,0.07),transparent)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#64ffda,#00b4d8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0a192f', fontWeight:800, fontSize:18, fontFamily:'"Syne",sans-serif', boxShadow:'0 0 20px rgba(100,255,218,0.25)', flexShrink:0 }}>D</div>
            <div>
              <p style={{ color:'#e6f1ff', fontSize:15, fontWeight:700, fontFamily:'"Syne",sans-serif' }}>David</p>
              <p style={{ color:'#64ffda', fontSize:11, fontFamily:'"DM Sans",sans-serif' }}>PULSE Member</p>
            </div>
            <span style={{ marginLeft:'auto', color:'#64ffda', fontSize:16 }}>›</span>
          </div>
          {/* Mini wallet display */}
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid rgba(100,255,218,0.1)' }}>
            <div>
              <p style={{ color:'#8892b0', fontSize:9, fontFamily:'"DM Sans",sans-serif', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Balance</p>
              <p style={{ fontFamily:'"Orbitron",monospace', color:'#64ffda', fontSize:14, fontWeight:700 }}>₦342,500</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ color:'#8892b0', fontSize:9, fontFamily:'"DM Sans",sans-serif', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Expires</p>
              <p style={{ color:'#e6f1ff', fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>19 days</p>
            </div>
          </div>
          <p style={{ color:'#64ffda', fontSize:10, fontFamily:'"DM Sans",sans-serif', textAlign:'center', marginTop:10, opacity:0.8 }}>Tap to edit profile →</p>
        </div>

        {/* Navigation — 2-column TILE grid (completely different from desktop) */}
        <div style={{ flex:1, overflowY:'auto', padding:'4px 14px 14px' }}>
          <p style={{ color:'#2d3748', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', padding:'8px 4px 6px', fontFamily:'"DM Sans",sans-serif', fontWeight:700 }}>NAVIGATION</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {MOBILE_NAV.map(item => {
              const isActive = activeNav === item.id && !item.href
              return item.href ? (
                <Link key={item.id} href={item.href} onClick={()=>setSidebarOpen(false)} style={{
                  padding:'16px 10px',
                  background: 'rgba(12,26,50,0.8)',
                  border:`1px solid rgba(100,255,218,0.07)`,
                  borderRadius:14, textDecoration:'none',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:7,
                  transition:'all 0.2s',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(100,255,218,0.06)'; e.currentTarget.style.border='1px solid rgba(100,255,218,0.15)' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(12,26,50,0.8)'; e.currentTarget.style.border='1px solid rgba(100,255,218,0.07)' }}
                >
                  <span style={{ fontSize:26 }}>{item.icon}</span>
                  <span style={{ color:'#a8b2d8', fontSize:11, fontFamily:'"DM Sans",sans-serif', fontWeight:500, textAlign:'center' }}>{item.label}</span>
                </Link>
              ) : (
                <button key={item.id} onClick={()=>handleNav(item)} style={{
                  padding:'16px 10px',
                  background: isActive ? 'rgba(100,255,218,0.1)' : 'rgba(12,26,50,0.8)',
                  border:`1px solid ${isActive?'rgba(100,255,218,0.25)':'rgba(100,255,218,0.07)'}`,
                  borderRadius:14, cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:7,
                  transition:'all 0.2s',
                }}>
                  <span style={{ fontSize:26, filter: isActive?'drop-shadow(0 0 8px #64ffda)':'' }}>{item.icon}</span>
                  <span style={{ color: isActive?'#64ffda':'#a8b2d8', fontSize:11, fontFamily:'"DM Sans",sans-serif', fontWeight: isActive?700:500, textAlign:'center' }}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(100,255,218,0.07)', flexShrink:0 }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:12, background:'rgba(255,107,107,0.07)', border:'1px solid rgba(255,107,107,0.15)', color:'#ff8080', textDecoration:'none', fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight:600, transition:'all 0.2s' }}>
            🚪 Sign Out
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a192f', paddingTop: isMobile?0:70, display:'flex' }}>

      {/* Modals */}
      {showProfile && <ProfileModal onClose={()=>setShowProfile(false)} />}
      {showPayout  && <PayoutModal  onClose={()=>setShowPayout(false)} />}
      {toast       && <div className="toast">✅ {toast}</div>}

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && <MobileSidebar />}

      {/* Desktop sidebar */}
      {!isMobile && <DesktopSidebar />}

      {/* Main content */}
      <main style={{ flex:1, padding: isMobile?'14px 14px':'28px 24px', overflowX:'hidden', paddingTop: isMobile?70:28, paddingBottom: isMobile?90:40 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(6,14,28,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(100,255,218,0.07)', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button onClick={()=>setSidebarOpen(true)} style={{ width:38, height:38, borderRadius:10, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#64ffda', fontSize:18, cursor:'pointer' }}>☰</button>
            <img src="/koinovate-logo.png" alt="K" style={{ height:28, objectFit:'contain' }} />
            <button onClick={()=>setShowProfile(true)} style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#64ffda,#00b4d8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0a192f', fontWeight:800, fontSize:15, fontFamily:'"Syne",sans-serif', border:'none', cursor:'pointer', boxShadow:'0 0 12px rgba(100,255,218,0.25)' }}>D</button>
          </div>
        )}

        {/* Page header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize: isMobile?20:26, fontWeight:800, marginBottom:4 }}>Good morning, David 👋</h1>
            <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>Your financial hub is active.</p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {/* Currency picker */}
            <div style={{ position:'relative' }}>
              <button onClick={()=>setShowCurrPicker(!showCurrPicker)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', borderRadius:20, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.2)', color:'#64ffda', fontSize:11, cursor:'pointer', fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>
                {CURRENCIES[currIdx].flag} {CURRENCIES[currIdx].code} ▾
              </button>
              {showCurrPicker && (
                <div style={{ position:'absolute', top:'115%', right:0, zIndex:50, background:'rgba(6,14,28,0.99)', backdropFilter:'blur(20px)', border:'1px solid rgba(100,255,218,0.15)', borderRadius:14, padding:'6px', minWidth:170, boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}>
                  <p style={{ color:'#8892b0', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 10px 8px', fontFamily:'"DM Sans",sans-serif' }}>Display Currency</p>
                  {CURRENCIES.map((c,i)=>(
                    <button key={c.code} onClick={()=>{ setCurrIdx(i); setShowCurrPicker(false) }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', background: i===currIdx?'rgba(100,255,218,0.1)':'transparent', color: i===currIdx?'#64ffda':'#a8b2d8', fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight: i===currIdx?600:400, textAlign:'left' }}>
                      <span>{c.flag}</span><span>{c.code}</span>
                      <span style={{ color:'#8892b0', fontSize:10, marginLeft:'auto' }}>{c.symbol}</span>
                      {i===currIdx && <span style={{ color:'#64ffda' }}>✓</span>}
                    </button>
                  ))}
                  <div style={{ borderTop:'1px solid rgba(100,255,218,0.07)', margin:'5px 0 2px', padding:'5px 12px 2px' }}>
                    <p style={{ color:'#8892b0', fontSize:9, fontFamily:'"DM Sans",sans-serif' }}>$1=₦1,300 · €1=₦1,650 · £1=₦2,000</p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={()=>showToast('Add funds coming soon!')} style={{ padding:'9px 14px', borderRadius:9, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.2)', color:'#64ffda', fontSize:12, fontWeight:600, fontFamily:'"DM Sans",sans-serif', cursor:'pointer' }}>+ Funds</button>
            <button onClick={()=>setShowPayout(true)} style={{ padding:'9px 14px', borderRadius:9, background:'linear-gradient(135deg,#64ffda,#00b4d8)', border:'none', color:'#0a192f', fontSize:12, fontWeight:700, fontFamily:'"DM Sans",sans-serif', cursor:'pointer' }}>↑ Withdraw</button>
          </div>
        </div>

        {/* Wallet flip card */}
        <div style={{ marginBottom:18 }}>
          <WalletCard currIdx={currIdx} />
        </div>

        {/* Stats */}
        <div className="stat-row" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:12, marginBottom:18 }}>
          {[
            { icon:'📈', label:'Total Profit',  value:'₦87,500', badge:'+12.4%' },
            { icon:'🎯', label:'Active Trades', value:'3',       badge:'Live'   },
            { icon:'📋', label:'Tasks Done',    value:'9/12',    badge:'75%'    },
            { icon:'🏆', label:'Rank',          value:'#24',     badge:'↑ 6'    },
          ].map(s=>(
            <div key={s.label} style={{ padding:'16px 14px', background:'rgba(10,22,44,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(100,255,218,0.06)', borderRadius:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:18 }}>{s.icon}</span>
                <span style={{ fontSize:9, padding:'2px 8px', borderRadius:20, background:'rgba(100,255,218,0.08)', color:'#64ffda', fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>{s.badge}</span>
              </div>
              <p style={{ color:'#8892b0', fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:'"DM Sans",sans-serif', marginBottom:4 }}>{s.label}</p>
              <p style={{ color:'#e6f1ff', fontSize:18, fontWeight:700, fontFamily:'"Syne",sans-serif' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 290px', gap:14 }}>

          {/* Transactions */}
          <div style={{ padding:'18px', background:'rgba(10,22,44,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(100,255,218,0.06)', borderRadius:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:14, fontWeight:700 }}>Transactions</h3>
              <button style={{ background:'none', border:'none', color:'#64ffda', fontSize:11, cursor:'pointer', fontFamily:'"DM Sans",sans-serif' }}>View All →</button>
            </div>
            {TRANSACTIONS.map((tx,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(100,255,218,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'rgba(100,255,218,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{tx.icon}</div>
                  <div>
                    <p style={{ color:'#e6f1ff', fontSize:12, fontWeight:500, fontFamily:'"DM Sans",sans-serif' }}>{tx.name}</p>
                    <p style={{ color:'#8892b0', fontSize:10, fontFamily:'"DM Sans",sans-serif' }}>{tx.date}</p>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ color: tx.pos?'#64ffda':'#ff8080', fontSize:12, fontWeight:600, fontFamily:'"DM Sans",sans-serif' }}>{tx.pos?'+':'-'}₦{tx.amount.toLocaleString()}</p>
                  <p style={{ color:'#8892b0', fontSize:10, fontFamily:'"DM Sans",sans-serif' }}>{tx.type}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          {!isMobile && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {/* Membership */}
              <div style={{ padding:'16px', background:'linear-gradient(135deg,rgba(100,255,218,0.07),rgba(10,22,44,0.95))', border:'1px solid rgba(100,255,218,0.15)', borderRadius:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:13, fontWeight:700 }}>My Plan</h3>
                  <span style={{ background:'rgba(100,255,218,0.12)', color:'#64ffda', fontSize:9, padding:'3px 10px', borderRadius:20, fontFamily:'"Orbitron",monospace', fontWeight:700 }}>PULSE</span>
                </div>
                <div style={{ height:5, background:'rgba(100,255,218,0.08)', borderRadius:3, marginBottom:6 }}>
                  <div style={{ height:'100%', width:'65%', background:'linear-gradient(90deg,#64ffda,#00b4d8)', borderRadius:3 }} />
                </div>
                <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:12 }}>19 days remaining</p>
                <Link href="/membership" style={{ display:'block', textAlign:'center', padding:'9px', borderRadius:9, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.18)', color:'#64ffda', textDecoration:'none', fontSize:11, fontWeight:600, fontFamily:'"DM Sans",sans-serif' }}>
                  Upgrade to Momentum →
                </Link>
              </div>

              {/* Notifications */}
              <div style={{ padding:'16px', background:'rgba(10,22,44,0.7)', border:'1px solid rgba(100,255,218,0.06)', borderRadius:18, flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:13, fontWeight:700 }}>Alerts</h3>
                  <span style={{ background:'#64ffda', color:'#0a192f', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, fontFamily:'"DM Sans",sans-serif' }}>3</span>
                </div>
                {NOTIFICATIONS.map((n,i)=>(
                  <div key={i} style={{ display:'flex', gap:8, padding:'8px 9px', background: n.unread?'rgba(100,255,218,0.03)':'transparent', borderRadius:9, marginBottom:3, borderLeft: n.unread?'2px solid rgba(100,255,218,0.35)':'2px solid transparent' }}>
                    <span style={{ fontSize:13, flexShrink:0 }}>{n.icon}</span>
                    <div>
                      <p style={{ color: n.unread?'#e6f1ff':'#a8b2d8', fontSize:10, fontFamily:'"DM Sans",sans-serif', lineHeight:1.5, marginBottom:2 }}>{n.msg}</p>
                      <p style={{ color:'#8892b0', fontSize:9, fontFamily:'"DM Sans",sans-serif' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
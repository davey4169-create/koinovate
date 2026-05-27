'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SUPPORT_EMAIL    = 'koinovate0@gmail.com'
const DEFAULT_TELEGRAM = '@koinovate_official'

const faqs = [
  { q:'How long do withdrawals take?',              a:'SPARK: up to 30 days | PULSE: up to 14 days | MOMENTUM: up to 7 days. All withdrawals go to your registered bank account.' },
  { q:'I cannot access my account. What do I do?',  a:'Use "Forgot Password" on the login page. If that fails, email us at koinovate0@gmail.com with your registered email and we will assist you.' },
  { q:'How do I upgrade my membership tier?',       a:'Go to the Membership page, select your new plan, and complete payment. Your new benefits activate immediately after payment.' },
  { q:'Why haven\'t I received my starter reward?', a:'Starter rewards are credited within 24 hours. If it has been longer, contact support with your payment reference.' },
  { q:'How does AI trading work?',                   a:'Our AI engine analyses global markets 24/7 and executes trades automatically. PULSE and MOMENTUM members earn up to $100/day.' },
  { q:'Can I have multiple accounts?',              a:'No. One account per person is strictly enforced. Multiple accounts result in permanent suspension and forfeiture of all balances.' },
  { q:'Is my money safe?',                          a:'Yes. All funds are held in segregated accounts with bank-grade encryption. We use industry-standard security to protect every user.' },
  { q:'How does the referral bonus work?',          a:'Share your referral link. When someone activates a paid membership using it, your referral bonus is automatically credited to your Revenue Share wallet.' },
]

const categories = [
  { icon:'💳', title:'Payments & Withdrawals', desc:'Wallet top-up, withdrawal issues, bank transfers',  color:'#64ffda' },
  { icon:'🔐', title:'Account & Security',     desc:'Login issues, password reset, account access',       color:'#00b4d8' },
  { icon:'🤖', title:'AI Trading',             desc:'Signal errors, trade positions, AI profits',          color:'#a855f7' },
  { icon:'💎', title:'Membership & Upgrades',  desc:'Plan changes, billing, tier benefits',               color:'#f59e0b' },
  { icon:'🎰', title:'Casino & Games',          desc:'Game issues, winnings, casino balance',              color:'#fb923c' },
  { icon:'📚', title:'Learning Hub',           desc:'Course access, progress, certifications',             color:'#f472b6' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border:`1px solid ${open?'rgba(100,255,218,0.18)':'rgba(100,255,218,0.07)'}`, borderRadius:14, marginBottom:10, overflow:'hidden', transition:'all 0.3s' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%', padding:'17px 20px', background: open?'rgba(100,255,218,0.05)':'rgba(15,30,58,0.6)', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
        <span style={{ color:'#e6f1ff', fontSize:14, fontWeight:600, fontFamily:'"DM Sans",sans-serif', textAlign:'left' }}>{q}</span>
        <span style={{ color:'#64ffda', fontSize:20, transition:'transform 0.3s', transform: open?'rotate(45deg)':'rotate(0)', flexShrink:0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding:'14px 20px 18px', background:'rgba(15,30,58,0.3)' }}>
          <p style={{ color:'#8892b0', fontSize:13, lineHeight:1.75, fontFamily:'"DM Sans",sans-serif' }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [form,       setForm]       = useState({ name:'', email:'', category:'', message:'' })
  const [sent,       setSent]       = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [telegram,   setTelegram]   = useState(DEFAULT_TELEGRAM)

  // Fetch Telegram handle from site settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r=>r.json())
      .then(d=>{ if(d.settings?.telegram_handle) setTelegram(d.settings.telegram_handle) })
      .catch(()=>{})
  }, [])

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r=>setTimeout(r,1500))
    // In production: send to your email via an API route
    setSent(true); setLoading(false)
  }

  const telegramUrl = `https://t.me/${telegram.replace('@','')}`

  return (
    <div style={{ background:'#0a192f', minHeight:'100vh', paddingTop:80 }}>

      {/* Hero */}
      <section style={{ padding:'60px 24px 44px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.07) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(100,255,218,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(100,255,218,0.03) 1px,transparent 1px)', backgroundSize:'50px 50px', pointerEvents:'none' }} />

        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:100, background:'rgba(100,255,218,0.08)', border:'1px solid rgba(100,255,218,0.2)', marginBottom:22, position:'relative' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#64ffda', display:'inline-block', boxShadow:'0 0 8px #64ffda' }} />
          <span style={{ color:'#64ffda', fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>24/7 Support · Average response under 2 hours</span>
        </div>

        <h1 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:'clamp(30px,6vw,58px)', fontWeight:800, marginBottom:16, position:'relative' }}>
          🎧 How Can We{' '}
          <span style={{ background:'linear-gradient(135deg,#64ffda,#00b4d8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Help?</span>
        </h1>
        <p style={{ color:'#8892b0', fontSize:16, maxWidth:520, margin:'0 auto 36px', fontFamily:'"DM Sans",sans-serif', lineHeight:1.7, position:'relative' }}>
          Browse help categories, check our FAQ, or reach us directly via email or Telegram.
        </p>

        {/* Direct Contact Buttons */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'13px 24px', borderRadius:14,
            background:'linear-gradient(135deg,#64ffda,#00b4d8)',
            color:'#0a192f', fontWeight:700, fontSize:14,
            textDecoration:'none', fontFamily:'"DM Sans",sans-serif',
            boxShadow:'0 0 25px rgba(100,255,218,0.25)',
            transition:'all 0.3s',
          }}>
            <span style={{ fontSize:18 }}>📧</span>
            Email Us
          </a>

          <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'13px 24px', borderRadius:14,
            background:'rgba(0,136,204,0.12)',
            border:'1px solid rgba(0,136,204,0.35)',
            color:'#4fc3f7', fontWeight:700, fontSize:14,
            textDecoration:'none', fontFamily:'"DM Sans",sans-serif',
            transition:'all 0.3s',
          }}>
            <span style={{ fontSize:18 }}>✈️</span>
            Telegram: {telegram}
          </a>
        </div>
      </section>

      {/* Contact info bar */}
      <div style={{ background:'rgba(15,30,58,0.5)', borderTop:'1px solid rgba(100,255,218,0.06)', borderBottom:'1px solid rgba(100,255,218,0.06)', padding:'20px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(100,255,218,0.1)', border:'1px solid rgba(100,255,218,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📧</div>
            <div>
              <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:2 }}>Email Support</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color:'#64ffda', fontSize:14, fontFamily:'"DM Sans",sans-serif', fontWeight:600, textDecoration:'none' }}>{SUPPORT_EMAIL}</a>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(0,136,204,0.1)', border:'1px solid rgba(0,136,204,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✈️</div>
            <div>
              <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:2 }}>Telegram Support</p>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color:'#4fc3f7', fontSize:14, fontFamily:'"DM Sans",sans-serif', fontWeight:600, textDecoration:'none' }}>{telegram}</a>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⏰</div>
            <div>
              <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:2 }}>Response Time</p>
              <p style={{ color:'#e6f1ff', fontSize:14, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>Under 2 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'56px 24px 40px' }}>
        <h2 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:22, fontWeight:700, marginBottom:24 }}>Browse by Topic</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {categories.map(cat=>(
            <div key={cat.title} style={{ padding:'22px', background:'rgba(15,30,58,0.6)', backdropFilter:'blur(12px)', border:'1px solid rgba(100,255,218,0.07)', borderRadius:18, cursor:'pointer', transition:'all 0.3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.border=`1px solid ${cat.color}30`; e.currentTarget.style.transform='translateY(-4px)' }}
            onMouseLeave={e=>{ e.currentTarget.style.border='1px solid rgba(100,255,218,0.07)'; e.currentTarget.style.transform='translateY(0)' }}>
              <div style={{ width:46, height:46, borderRadius:13, background:`${cat.color}14`, border:`1px solid ${cat.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:14 }}>{cat.icon}</div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:14, fontWeight:700, marginBottom:7 }}>{cat.title}</h3>
              <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', lineHeight:1.6 }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + Form */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 80px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:28, flexWrap:'wrap' }}>

        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:20, fontWeight:700, marginBottom:22 }}>Frequently Asked Questions</h2>
          {faqs.map((f,i)=><FAQItem key={i} {...f} />)}
        </div>

        {/* Contact form */}
        <div style={{ padding:'28px 24px', background:'rgba(15,30,58,0.7)', backdropFilter:'blur(18px)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:22, height:'fit-content', position:'sticky', top:100 }}>
          <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:18, fontWeight:800, marginBottom:6 }}>Send a Message</h3>
          <p style={{ color:'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', marginBottom:22 }}>Response within 2 hours via email.</p>

          {sent ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontSize:46, marginBottom:14 }}>✅</div>
              <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#64ffda', fontSize:18, fontWeight:700, marginBottom:8 }}>Message Sent!</h3>
              <p style={{ color:'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', marginBottom:6 }}>We'll reply to <strong style={{ color:'#e6f1ff' }}>{form.email}</strong> within 2 hours.</p>
              <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', marginBottom:20 }}>Or reach us faster on Telegram:</p>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:10, background:'rgba(0,136,204,0.1)', border:'1px solid rgba(0,136,204,0.3)', color:'#4fc3f7', textDecoration:'none', fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight:600 }}>✈️ {telegram}</a>
              <button onClick={()=>setSent(false)} style={{ display:'block', margin:'16px auto 0', background:'none', border:'none', color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif', cursor:'pointer' }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              {[
                { label:'Full Name',    key:'name',    type:'text',  ph:'Your full name'    },
                { label:'Email',        key:'email',   type:'email', ph:'your@email.com'    },
              ].map(f=>(
                <div key={f.key} style={{ marginBottom:14 }}>
                  <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:6, fontWeight:600 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  style={{ width:'100%', padding:'11px 13px', background:'rgba(6,14,28,0.85)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:10, color:'#e6f1ff', fontSize:13, fontFamily:'"DM Sans",sans-serif', outline:'none', boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                  onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                  />
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:6, fontWeight:600 }}>Topic</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{ width:'100%', padding:'11px 13px', background:'rgba(6,14,28,0.85)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:10, color: form.category?'#e6f1ff':'#8892b0', fontSize:13, fontFamily:'"DM Sans",sans-serif', outline:'none', boxSizing:'border-box' }}>
                  <option value="">Select a topic...</option>
                  {categories.map(c=><option key={c.title} value={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ color:'#a8b2d8', fontSize:12, fontFamily:'"DM Sans",sans-serif', display:'block', marginBottom:6, fontWeight:600 }}>Message</label>
                <textarea rows={4} placeholder="Describe your issue in detail..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                style={{ width:'100%', padding:'11px 13px', background:'rgba(6,14,28,0.85)', border:'1px solid rgba(100,255,218,0.1)', borderRadius:10, color:'#e6f1ff', fontSize:13, fontFamily:'"DM Sans",sans-serif', outline:'none', boxSizing:'border-box', resize:'vertical' }}
                onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.4)'}
                onBlur={e=>e.target.style.border='1px solid rgba(100,255,218,0.1)'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:loading?'rgba(100,255,218,0.4)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:800, fontSize:14, fontFamily:'"DM Sans",sans-serif', cursor:loading?'not-allowed':'pointer' }}>
                {loading ? '⏳ Sending...' : '📨 Send Message'}
              </button>
            </form>
          )}

          {/* Quick contact options */}
          <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid rgba(100,255,218,0.07)' }}>
            <p style={{ color:'#8892b0', fontSize:11, fontFamily:'"DM Sans",sans-serif', marginBottom:10, textAlign:'center' }}>Or contact us directly:</p>
            <div style={{ display:'flex', gap:10 }}>
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(100,255,218,0.06)', border:'1px solid rgba(100,255,218,0.15)', color:'#64ffda', textDecoration:'none', fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                📧 Email
              </a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(0,136,204,0.07)', border:'1px solid rgba(0,136,204,0.2)', color:'#4fc3f7', textDecoration:'none', fontSize:12, fontFamily:'"DM Sans",sans-serif', fontWeight:600, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                ✈️ Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
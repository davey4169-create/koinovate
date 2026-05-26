'use client'
import { useState, useEffect } from 'react'

const SETTING_ICONS = {
  telegram_handle:   '📱',
  support_email:     '📧',
  whatsapp_number:   '💬',
  site_announcement: '📢',
  maintenance_mode:  '🔧',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(null)
  const [msg,      setMsg]      = useState(null)
  const [vals,     setVals]     = useState({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        setSettings(d.raw || [])
        const v = {}
        d.raw?.forEach(s => { v[s.key] = s.value })
        setVals(v)
        setLoading(false)
      })
  }, [])

  const save = async (key) => {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 'ADMIN_USER_ID', key, value: vals[key] }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type:'success', text:`✅ ${key.replace(/_/g,' ')} updated!` })
      } else {
        setMsg({ type:'error', text:`⚠️ ${data.error}` })
      }
    } catch {
      setMsg({ type:'error', text:'⚠️ Failed to save.' })
    }
    setSaving(null)
    setTimeout(() => setMsg(null), 3000)
  }

  if (loading) return (
    <div style={{ padding:'28px 24px', display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid rgba(100,255,218,0.3)', borderTopColor:'#64ffda', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'#8892b0', fontFamily:'"DM Sans",sans-serif' }}>Loading settings...</p>
    </div>
  )

  return (
    <div style={{ padding:'28px 24px' }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      <h1 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:24, fontWeight:800, marginBottom:4 }}>⚙️ Site Settings</h1>
      <p style={{ color:'#8892b0', fontSize:14, fontFamily:'"DM Sans",sans-serif', marginBottom:28 }}>Manage global platform settings. Changes take effect immediately.</p>

      {msg && (
        <div style={{ padding:'12px 16px', borderRadius:12, marginBottom:24, background: msg.type==='error'?'rgba(255,80,80,0.1)':'rgba(100,255,218,0.1)', border:`1px solid ${msg.type==='error'?'rgba(255,80,80,0.3)':'rgba(100,255,218,0.3)'}`, color: msg.type==='error'?'#ff8080':'#64ffda', fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {settings.map(s => (
          <div key={s.key} style={{ padding:'22px 24px', background:'rgba(8,18,36,0.8)', border:'1px solid rgba(255,107,107,0.07)', borderRadius:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:8 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:18 }}>{SETTING_ICONS[s.key] || '⚙️'}</span>
                  <h3 style={{ fontFamily:'"Syne",sans-serif', color:'#e6f1ff', fontSize:15, fontWeight:700 }}>{s.label}</h3>
                </div>
                {s.description && <p style={{ color:'#8892b0', fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>{s.description}</p>}
              </div>
              {s.updated_at && <p style={{ color:'#4a5568', fontSize:11, fontFamily:'"DM Sans",sans-serif' }}>Last updated: {new Date(s.updated_at).toLocaleDateString()}</p>}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              {s.key === 'maintenance_mode' ? (
                <div style={{ display:'flex', gap:10 }}>
                  {['true','false'].map(opt => (
                    <button key={opt} onClick={() => setVals(v=>({...v,[s.key]:opt}))} style={{
                      padding:'9px 20px', borderRadius:9, border:`1px solid ${vals[s.key]===opt?(opt==='true'?'rgba(255,80,80,0.4)':'rgba(100,255,218,0.4)'):'rgba(100,100,100,0.2)'}`,
                      background: vals[s.key]===opt?(opt==='true'?'rgba(255,80,80,0.1)':'rgba(100,255,218,0.1)'):'rgba(20,35,60,0.8)',
                      color: vals[s.key]===opt?(opt==='true'?'#ff8080':'#64ffda'):'#8892b0',
                      fontSize:13, fontFamily:'"DM Sans",sans-serif', fontWeight:600, cursor:'pointer',
                    }}>{opt==='true'?'🔧 ON (maintenance)':'✅ OFF (live)'}</button>
                  ))}
                </div>
              ) : (
                <input
                  type={s.key==='support_email'?'email':'text'}
                  value={vals[s.key]||''}
                  onChange={e=>setVals(v=>({...v,[s.key]:e.target.value}))}
                  placeholder={s.key==='telegram_handle'?'@your_telegram_handle':s.key==='whatsapp_number'?'+234xxxxxxxxxx':s.key==='site_announcement'?'Announcement text (leave empty to hide)':''}
                  style={{ flex:1, padding:'11px 14px', background:'rgba(6,14,28,0.85)', border:'1px solid rgba(100,100,100,0.2)', borderRadius:10, color:'#e6f1ff', fontSize:14, fontFamily:'"DM Sans",sans-serif', outline:'none' }}
                  onFocus={e=>e.target.style.border='1px solid rgba(100,255,218,0.3)'}
                  onBlur={e=>e.target.style.border='1px solid rgba(100,100,100,0.2)'}
                />
              )}
              <button onClick={()=>save(s.key)} disabled={saving===s.key} style={{ padding:'11px 22px', borderRadius:10, border:'none', background: saving===s.key?'rgba(100,255,218,0.3)':'linear-gradient(135deg,#64ffda,#00b4d8)', color:'#0a192f', fontWeight:700, fontSize:13, fontFamily:'"DM Sans",sans-serif', cursor:saving===s.key?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
                {saving===s.key ? '⏳' : '💾 Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
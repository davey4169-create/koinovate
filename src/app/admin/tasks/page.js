'use client'
import { useState } from 'react'

const defaultTasks = [
  { id:1,  icon:'▶️',  title:'Watch Brand Video',          category:'Content',  reward:500,  duration:'3 min',  tier:'spark',    status:'Active'   },
  { id:2,  icon:'📘',  title:'Follow on Facebook',          category:'Social',   reward:300,  duration:'1 min',  tier:'spark',    status:'Active'   },
  { id:3,  icon:'🐦',  title:'Follow on Twitter/X',         category:'Social',   reward:300,  duration:'1 min',  tier:'spark',    status:'Active'   },
  { id:4,  icon:'📸',  title:'Follow on Instagram',         category:'Social',   reward:300,  duration:'1 min',  tier:'spark',    status:'Active'   },
  { id:5,  icon:'🔔',  title:'Subscribe on YouTube',        category:'Content',  reward:500,  duration:'2 min',  tier:'spark',    status:'Active'   },
  { id:6,  icon:'📝',  title:'Daily Finance Quiz',          category:'Learning', reward:1000, duration:'5 min',  tier:'spark',    status:'Active'   },
  { id:7,  icon:'🔗',  title:'Share Referral Link',         category:'Referral', reward:2000, duration:'2 min',  tier:'pulse',    status:'Active'   },
  { id:8,  icon:'💬',  title:'Leave a Review',              category:'Content',  reward:3000, duration:'5 min',  tier:'pulse',    status:'Active'   },
  { id:9,  icon:'📊',  title:'Complete Market Survey',      category:'Survey',   reward:2500, duration:'10 min', tier:'pulse',    status:'Active'   },
  { id:10, icon:'🎥',  title:'Watch Trading Tutorial',      category:'Learning', reward:3500, duration:'15 min', tier:'pulse',    status:'Active'   },
  { id:11, icon:'📰',  title:'Share KOINOVATE Article',     category:'Social',   reward:4000, duration:'3 min',  tier:'pulse',    status:'Draft'    },
  { id:12, icon:'🤝',  title:'Refer a Friend',              category:'Referral', reward:5000, duration:'5 min',  tier:'pulse',    status:'Active'   },
  { id:13, icon:'🏆',  title:'Complete Platform Tour',      category:'Learning', reward:8000, duration:'20 min', tier:'momentum', status:'Active'   },
  { id:14, icon:'💎',  title:'VIP Community Post',          category:'Social',   reward:6000, duration:'5 min',  tier:'momentum', status:'Active'   },
  { id:15, icon:'📈',  title:'Execute a Live Trade',        category:'Trading',  reward:10000,'duration':'10 min',tier:'momentum', status:'Active'  },
]

const emptyForm = { icon: '📋', title: '', category: 'Social', reward: '', duration: '', tier: 'spark', status: 'Active' }
const categories = ['Social', 'Content', 'Learning', 'Referral', 'Survey', 'Trading', 'Challenge']
const tiers = ['spark', 'pulse', 'momentum']
const tc = { spark: '#a8b2d8', pulse: '#64ffda', momentum: '#00b4d8' }

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState(defaultTasks)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterTier, setFilterTier] = useState('all')

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = t => { setForm({ icon: t.icon, title: t.title, category: t.category, reward: String(t.reward), duration: t.duration, tier: t.tier, status: t.status }); setEditId(t.id); setShowForm(true) }

  const save = () => {
    if (!form.title || !form.reward) return
    if (editId) {
      setTasks(ts => ts.map(t => t.id === editId ? { ...t, ...form, reward: Number(form.reward) } : t))
      setMsg(`✅ "${form.title}" updated!`)
    } else {
      setTasks(ts => [...ts, { id: Date.now(), ...form, reward: Number(form.reward) }])
      setMsg(`✅ "${form.title}" added to task list!`)
    }
    setShowForm(false); setEditId(null)
    setTimeout(() => setMsg(null), 3000)
  }

  const deleteTask = id => {
    const task = tasks.find(t => t.id === id)
    setTasks(ts => ts.filter(t => t.id !== id))
    setMsg(`🗑️ "${task.title}" removed.`)
    setDeleteConfirm(null)
    setTimeout(() => setMsg(null), 3000)
  }

  const toggleStatus = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Draft' : 'Active' } : t))

  const filtered = filterTier === 'all' ? tasks : tasks.filter(t => t.tier === filterTier)

  return (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📋 Task Manager</h1>
          <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>{tasks.length} tasks · {tasks.filter(t=>t.status==='Active').length} active · {tasks.filter(t=>t.status==='Draft').length} draft</p>
        </div>
        <button onClick={openAdd} style={{ padding: '11px 22px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>+ Add New Task</button>
      </div>

      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{msg}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[['📋',tasks.length,'Total Tasks'],['✅',tasks.filter(t=>t.status==='Active').length,'Active'],['🌱',tasks.filter(t=>t.tier==='spark').length,'Spark'],['⚡',tasks.filter(t=>t.tier==='pulse').length,'Pulse'],['👑',tasks.filter(t=>t.tier==='momentum').length,'Momentum']].map(([icon,val,label]) => (
          <div key={label} style={{ padding: '16px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, marginBottom: 4 }}>{icon}</p>
            <p style={{ color: '#a855f7', fontSize: 20, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{val}</p>
            <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tier filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all','All'],['spark','Spark'],['pulse','Pulse'],['momentum','Momentum']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterTier(val)} style={{
            padding: '8px 16px', borderRadius: 20, border: `1px solid ${filterTier === val ? 'rgba(168,85,247,0.4)' : 'rgba(100,100,100,0.2)'}`,
            background: filterTier === val ? 'rgba(168,85,247,0.1)' : 'transparent',
            color: filterTier === val ? '#a855f7' : '#8892b0',
            fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
          }}>{label}</button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(task => (
          <div key={task.id} style={{ padding: '16px 20px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tc[task.tier]}15`, border: `1px solid ${tc[task.tier]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{task.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ color: '#e6f1ff', fontSize: 14, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{task.title}</p>
                  <span style={{ padding: '2px 8px', borderRadius: 6, background: task.status === 'Active' ? 'rgba(100,255,218,0.1)' : 'rgba(245,158,11,0.1)', color: task.status === 'Active' ? '#64ffda' : '#f59e0b', fontSize: 9, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{task.status}</span>
                </div>
                <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>
                  {task.category} · {task.duration} · <span style={{ color: tc[task.tier] }}>{task.tier.toUpperCase()}</span> · <span style={{ color: '#a855f7', fontWeight: 600 }}>+₦{task.reward.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button onClick={() => toggleStatus(task.id)} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${task.status === 'Active' ? 'rgba(245,158,11,0.3)' : 'rgba(100,255,218,0.3)'}`, background: task.status === 'Active' ? 'rgba(245,158,11,0.1)' : 'rgba(100,255,218,0.1)', color: task.status === 'Active' ? '#f59e0b' : '#64ffda', fontSize: 11, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                {task.status === 'Active' ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => openEdit(task)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: 11, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>✏️</button>
              <button onClick={() => setDeleteConfirm(task.id)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.1)', color: '#ff8080', fontSize: 11, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 24, padding: '36px 32px', maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700 }}>{editId ? '✏️ Edit Task' : '+ Add New Task'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {[['Task Icon (emoji)','icon','text','e.g. 📋'],['Task Title','title','text','e.g. Watch Tutorial Video'],['Duration','duration','text','e.g. 5 min'],['Reward (₦)','reward','number','e.g. 2000']].map(([label, key, type, placeholder]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]} onChange={upd(key)}
                style={{ width: '100%', padding: '11px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[['Category','category',categories],['Tier','tier',tiers],['Status','status',['Active','Draft']]].map(([label,key,opts]) => (
                <div key={key}>
                  <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{label}</label>
                  <select value={form[key]} onChange={upd(key)} style={{ width: '100%', padding: '10px 12px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 9, color: '#e6f1ff', fontSize: 12, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button onClick={save} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              {editId ? '💾 Save Changes' : '+ Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 24, padding: '36px 32px', maxWidth: 360, width: '90%', textAlign: 'center' }}>
            <p style={{ fontSize: 38, marginBottom: 14 }}>🗑️</p>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Delete this task?</h3>
            <p style={{ color: '#8892b0', fontSize: 13, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>This will remove the task for all users immediately.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid rgba(100,100,100,0.2)', background: 'transparent', color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => deleteTask(deleteConfirm)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#ff6b6b,#ff4040)', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState } from 'react'

const defaultCourses = [
  { id: 1, title: 'Trading Fundamentals Masterclass', instructor: 'Dr. Emeka Okafor', category: 'Trading Basics', duration: '6h 30m', lessons: 24, level: 'Beginner',  students: 12400, status: 'Published', rating: 4.9 },
  { id: 2, title: 'AI-Powered Crypto Trading',         instructor: 'Fatima Al-Hassan', category: 'AI & Crypto',   duration: '8h 15m', lessons: 32, level: 'Intermediate',students: 9800,  status: 'Published', rating: 4.8 },
  { id: 3, title: 'Building a ₦1M Monthly Income',     instructor: 'Chidi Nwachukwu', category: 'Wealth Building',duration: '5h 45m', lessons: 20, level: 'Beginner',  students: 18700, status: 'Published', rating: 4.9 },
  { id: 4, title: 'Advanced DeFi Strategies',           instructor: 'Yusuf Abdullahi', category: 'DeFi',          duration: '7h 00m', lessons: 28, level: 'Advanced',   students: 5600,  status: 'Draft',     rating: 0   },
  { id: 5, title: 'Nigerian Stock Exchange Mastery',    instructor: 'Adaeze Obi',      category: 'Stock Market',  duration: '4h 20m', lessons: 16, level: 'Beginner',  students: 7200,  status: 'Published', rating: 4.8 },
  { id: 6, title: 'Wealth Psychology & Mindset',       instructor: 'Dr. Ngozi Eze',   category: 'Mindset',       duration: '3h 50m', lessons: 14, level: 'All Levels', students: 22100, status: 'Published', rating: 5.0 },
]

const emptyForm = { title: '', instructor: '', category: '', duration: '', lessons: '', level: 'Beginner', status: 'Draft' }

export default function AdminLearningPage() {
  const [courses, setCourses] = useState(defaultCourses)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = c => { setForm({ title: c.title, instructor: c.instructor, category: c.category, duration: c.duration, lessons: String(c.lessons), level: c.level, status: c.status }); setEditId(c.id); setShowForm(true) }

  const save = () => {
    if (!form.title || !form.instructor) return
    if (editId) {
      setCourses(cs => cs.map(c => c.id === editId ? { ...c, ...form, lessons: Number(form.lessons) } : c))
      setMsg(`✅ "${form.title}" updated successfully!`)
    } else {
      const newCourse = { id: Date.now(), ...form, lessons: Number(form.lessons), students: 0, rating: 0 }
      setCourses(cs => [...cs, newCourse])
      setMsg(`✅ "${form.title}" added to Learning Hub!`)
    }
    setShowForm(false); setEditId(null)
    setTimeout(() => setMsg(null), 3000)
  }

  const deleteCourse = id => {
    const course = courses.find(c => c.id === id)
    setCourses(cs => cs.filter(c => c.id !== id))
    setMsg(`🗑️ "${course.title}" removed from Learning Hub.`)
    setDeleteConfirm(null)
    setTimeout(() => setMsg(null), 3000)
  }

  const toggleStatus = id => setCourses(cs => cs.map(c => c.id === id ? { ...c, status: c.status === 'Published' ? 'Draft' : 'Published' } : c))

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>📚 Learning Hub Control</h1>
          <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>{courses.length} courses · {courses.filter(c=>c.status==='Published').length} published · {courses.filter(c=>c.status==='Draft').length} draft</p>
        </div>
        <button onClick={openAdd} style={{ padding: '11px 22px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#64ffda,#00b4d8)', color: '#0a192f', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>+ Add New Course</button>
      </div>

      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.3)', color: '#64ffda', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{msg}</div>}

      <input type="text" placeholder="🔍 Search courses..." value={search} onChange={e => setSearch(e.target.value)}
      style={{ width: '100%', padding: '11px 16px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.08)', borderRadius: 12, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[['📚',courses.length,'Total Courses'],['✅',courses.filter(c=>c.status==='Published').length,'Published'],['📝',courses.filter(c=>c.status==='Draft').length,'Drafts'],['👥',courses.reduce((s,c)=>s+c.students,0).toLocaleString(),'Total Students']].map(([icon,val,label]) => (
          <div key={label} style={{ padding: '16px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 20, marginBottom: 4 }}>{icon}</p>
            <p style={{ color: '#64ffda', fontSize: 20, fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>{val}</p>
            <p style={{ color: '#8892b0', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Course list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ padding: '20px 24px', background: 'rgba(8,18,36,0.8)', border: '1px solid rgba(255,107,107,0.06)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h3 style={{ color: '#e6f1ff', fontSize: 15, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{c.title}</h3>
                <span style={{ padding: '2px 8px', borderRadius: 6, background: c.status === 'Published' ? 'rgba(100,255,218,0.1)' : 'rgba(245,158,11,0.1)', color: c.status === 'Published' ? '#64ffda' : '#f59e0b', fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{c.status}</span>
              </div>
              <p style={{ color: '#8892b0', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>
                by {c.instructor} · {c.category} · {c.level} · {c.duration} · {c.lessons} lessons
                {c.students > 0 && ` · 👥 ${c.students.toLocaleString()} students`}
                {c.rating > 0 && ` · ⭐ ${c.rating}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleStatus(c.id)} style={{ padding: '7px 14px', borderRadius: 9, border: `1px solid ${c.status === 'Published' ? 'rgba(245,158,11,0.3)' : 'rgba(100,255,218,0.3)'}`, background: c.status === 'Published' ? 'rgba(245,158,11,0.1)' : 'rgba(100,255,218,0.1)', color: c.status === 'Published' ? '#f59e0b' : '#64ffda', fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                {c.status === 'Published' ? '📝 Unpublish' : '✅ Publish'}
              </button>
              <button onClick={() => openEdit(c)} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>✏️ Edit</button>
              <button onClick={() => setDeleteConfirm(c.id)} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.1)', color: '#ff8080', fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(100,255,218,0.15)', borderRadius: 24, padding: '36px 32px', maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 20, fontWeight: 700 }}>{editId ? '✏️ Edit Course' : '+ Add New Course'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {[['Course Title','title','text','e.g. Advanced Crypto Trading'],['Instructor Name','instructor','text','e.g. Dr. Emeka Okafor'],['Category','category','text','e.g. Trading Basics'],['Duration','duration','text','e.g. 6h 30m'],['Number of Lessons','lessons','number','e.g. 24']].map(([label, key, type, placeholder]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]} onChange={upd(key)}
                style={{ width: '100%', padding: '11px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[['Level','level',['Beginner','Intermediate','Advanced','All Levels']],['Status','status',['Draft','Published']]].map(([label,key,opts]) => (
                <div key={key}>
                  <label style={{ color: '#a8b2d8', fontSize: 12, display: 'block', marginBottom: 7, fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>{label}</label>
                  <select value={form[key]} onChange={upd(key)} style={{ width: '100%', padding: '11px 14px', background: 'rgba(6,15,30,0.8)', border: '1px solid rgba(100,100,100,0.2)', borderRadius: 10, color: '#e6f1ff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={save} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#64ffda,#00b4d8)', color: '#0a192f', fontWeight: 800, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              {editId ? '💾 Update Course' : '+ Add Course'}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(8,18,36,0.99)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 24, padding: '36px 32px', maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
            <h3 style={{ fontFamily: '"Syne", sans-serif', color: '#e6f1ff', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Delete Course?</h3>
            <p style={{ color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', marginBottom: 24 }}>This action cannot be undone. All student progress will be lost.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid rgba(100,100,100,0.2)', background: 'transparent', color: '#8892b0', fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => deleteCourse(deleteConfirm)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#ff6b6b,#ff4040)', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
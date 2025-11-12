import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { BarChart3, LineChart, FileText, Bot, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { apiGet, apiPost } from './api'

// Simple layout with dark theme
function Layout({ children }) {
  const location = useLocation()
  const menu = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/interview-prep', label: 'Interview Preparation', icon: <LineChart size={18} /> },
    { to: '/resume-builder', label: 'Resume Builder', icon: <FileText size={18} /> },
    { to: '/cover-letter', label: 'Cover Letter', icon: <Bot size={18} /> },
    { to: '/industry-insights', label: 'Industry Insights', icon: <BarChart3 size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* top bar */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex size-6 items-center justify-center rounded bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-amber-400" />
            SENSAI
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-300">Hi, Guest</div>
            <button className="inline-flex items-center gap-1 rounded-md bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl flex">
        {/* sidebar */}
        <aside className="hidden md:block w-60 border-r border-white/10 p-4">
          <nav className="space-y-1">
            {menu.map((m) => (
              <Link key={m.to} to={m.to} className={`group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition ${location.pathname===m.to?'bg-white/10':''}`}>
                <span className="opacity-80 group-hover:opacity-100">{m.icon}</span>
                <span>{m.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="relative h-[300px] md:h-[420px] overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/60" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="text-2xl md:text-3xl font-semibold">Welcome to SENSAI</motion.h1>
        <motion.p initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="text-neutral-300">Your AI-powered career prep and growth copilot</motion.p>
      </div>
    </div>
  )
}

function StatCard({title, value, hint}){
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-neutral-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-neutral-400 mt-2">{hint}</div>}
    </div>
  )
}

function Dashboard(){
  return (
    <div className="space-y-6">
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Average Score" value="72%" hint="Across your recent quizzes" />
        <StatCard title="Total Questions" value="145" />
        <StatCard title="Latest Score" value="80%" />
      </div>
    </div>
  )
}

function InterviewPrep(){
  const userId = 'guest'
  const [stats, setStats] = useState({average_score:0,total_questions:0,latest_score:0})
  const [recent, setRecent] = useState([])

  useEffect(()=>{
    apiGet('/api/quiz/stats', {user_id: userId}).then(setStats).catch(()=>{})
    apiGet('/api/quiz/recent', {user_id: userId}).then(setRecent).catch(()=>{})
  },[])

  async function startMock(){
    const score = Math.floor(60 + Math.random()*40)
    const total = 10
    const correct = Math.round((score/100)*total)
    await apiPost('/api/quiz', {user_id:userId, score, total_questions: total, correct_answers: correct, feedback: 'Keep practicing data structures and systems design.'})
    const s = await apiGet('/api/quiz/stats', {user_id: userId})
    setStats(s)
    const r = await apiGet('/api/quiz/recent', {user_id: userId})
    setRecent(r)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Average Score" value={`${stats.average_score}%`} />
        <StatCard title="Total Questions" value={stats.total_questions} />
        <StatCard title="Latest Score" value={`${stats.latest_score}%`} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Performance Trend</div>
          <button onClick={startMock} className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">Start New Quiz</button>
        </div>
        <div className="text-sm text-neutral-400 mt-2">Recent Quizzes</div>
        <ul className="mt-2 space-y-2">
          {recent.map((q,idx)=> (
            <li key={idx} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
              <div>
                <div className="font-medium">Score: {q.score}%</div>
                <div className="text-xs text-neutral-400">{q.feedback || 'Good job! Keep it up.'}</div>
              </div>
              <div className="text-sm text-neutral-300">{q.total_questions} Qs</div>
            </li>
          ))}
          {recent.length === 0 && <div className="text-neutral-400 text-sm">No quizzes yet. Start one!</div>}
        </ul>
      </div>
    </div>
  )
}

function ResumeBuilder(){
  const userId = 'guest'
  const [form, setForm] = useState({user_id:userId, email:'', linkedin:'', twitter:'', summary:'', skills:'', experiences:[], education:[], projects:[]})

  useEffect(()=>{
    apiGet('/api/resume', {user_id: userId}).then((d)=>{
      if(d && Object.keys(d).length){
        setForm({...form, ...d, skills: (d.skills||[]).join(', ')})
      }
    }).catch(()=>{})
  },[])

  function update(k, v){ setForm((f)=> ({...f, [k]: v})) }

  function addItem(key, item){ setForm(f=> ({...f, [key]: [...f[key], item]})) }

  async function save(){
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean),
    }
    await apiPost('/api/resume', payload)
    alert('Saved!')
  }

  function downloadPDF(){
    import('jspdf').then(({default: jsPDF})=>{
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Resume', 10, 14)
      doc.setFontSize(12)
      doc.text(`Email: ${form.email}`, 10, 24)
      doc.text(`LinkedIn: ${form.linkedin}`, 10, 32)
      doc.text(`Summary: ${form.summary}`, 10, 40)
      doc.save('resume.pdf')
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input value={form.email} onChange={e=>update('email', e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-neutral-400">LinkedIn</label>
            <input value={form.linkedin} onChange={e=>update('linkedin', e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-neutral-400">Twitter</label>
            <input value={form.twitter} onChange={e=>update('twitter', e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-neutral-400">Professional Summary</label>
            <textarea value={form.summary} onChange={e=>update('summary', e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 min-h-[100px]" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-neutral-400">Skills (comma separated)</label>
            <input value={form.skills} onChange={e=>update('skills', e.target.value)} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={save} className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">Save</button>
          <button onClick={downloadPDF} className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">Download PDF</button>
        </div>
      </div>
    </div>
  )
}

function CoverLetter(){
  const [form, setForm] = useState({company_name:'', job_title:'', job_description:''})
  const [text, setText] = useState('')

  async function generate(){
    try {
      const res = await apiPost('/api/cover-letter', form)
      setText(res.text)
    } catch (e) {
      setText('Error generating cover letter. Make sure the API key is set on the server.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-400">Company</label>
            <input value={form.company_name} onChange={e=>setForm({...form, company_name:e.target.value})} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-neutral-400">Job Title</label>
            <input value={form.job_title} onChange={e=>setForm({...form, job_title:e.target.value})} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-neutral-400">Job Description</label>
            <textarea value={form.job_description} onChange={e=>setForm({...form, job_description:e.target.value})} className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 min-h-[120px]" />
          </div>
        </div>
        <button onClick={generate} className="rounded-md bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm">Generate Cover Letter</button>
      </div>

      {text && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 whitespace-pre-wrap">{text}</div>
      )}
    </div>
  )
}

function Insights(){
  const [data, setData] = useState(null)
  useEffect(()=>{ apiGet('/api/insights').then(setData).catch(()=>{}) },[])
  if(!data) return <div className="text-neutral-400">Loading insights...</div>
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Market Outlook" value={data.market_outlook} />
        <StatCard title="Industry Growth" value={`${data.industry_growth}%`} />
        <StatCard title="Demand Level" value={data.demand_level} />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="font-medium">Top Skills</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.top_skills.map((s, i)=> (
            <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm">{s}</span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="font-medium">Salary Ranges (USD, thousands)</div>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {data.salary_ranges.map((r,i)=> (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 text-sm text-neutral-300">{r.role}</div>
              <div className="flex-1 h-2 rounded bg-white/10">
                <div className="h-2 rounded bg-gradient-to-r from-violet-500 to-amber-400" style={{width: `${(r.max/220)*100}%`}} />
              </div>
              <div className="w-24 text-right text-sm text-neutral-400">{r.min}-{r.max}k</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="font-medium">Key Industry Trends</div>
        <ul className="mt-2 list-disc pl-5 text-neutral-300">
          {data.trends.map((t,i)=> <li key={i}>{t}</li>)}
        </ul>
        <div className="font-medium mt-4">Recommended Skills</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.recommended_skills.map((s, i)=> (
            <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsPage(){
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-neutral-300">
      Preferences coming soon.
    </div>
  )
}

function AppRoutes(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/industry-insights" element={<Insights />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRoutes

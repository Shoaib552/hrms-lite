import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '👥', title: 'Employee Management',  desc: 'Add, view, and remove employee records. Track name, department, email and unique ID all in one place.' },
  { icon: '📅', title: 'Attendance Tracking',  desc: 'Mark daily attendance as Present or Absent. Update records anytime — no duplicates ever created.' },
  { icon: '📊', title: 'Live Dashboard',        desc: "See today's present/absent counts and total employees updated in real time." },
  { icon: '🔐', title: 'Secure Auth',           desc: 'JWT-based login keeps your HR data protected. Sessions auto-expire for security.' },
  { icon: '🔍', title: 'Date Filtering',        desc: 'Filter attendance records by date to audit who was present on any given day.' },
  { icon: '☁️', title: 'Cloud Database',        desc: 'All data lives in MongoDB Atlas — fully managed cloud database, no local setup.' },
]

const STEPS = [
  { n: '01', title: 'Create your account', desc: 'Register as admin with your name, email and password in seconds.' },
  { n: '02', title: 'Add your employees',  desc: "Enter each employee's ID, name, department and email. Saved instantly." },
  { n: '03', title: 'Mark attendance',     desc: 'Each day pick an employee, pick a date, mark Present or Absent.' },
  { n: '04', title: 'Track performance',   desc: 'View total present days per employee directly from the employee list.' },
]

const STACK = [
  { icon: '⚡', name: 'FastAPI',         desc: 'Python async backend' },
  { icon: '🍃', name: 'MongoDB Atlas',   desc: 'Cloud NoSQL database' },
  { icon: '⚛️', name: 'React + Vite',    desc: 'Fast frontend' },
  { icon: '🔐', name: 'JWT Auth',        desc: 'Secure sessions' },
  { icon: '🎨', name: 'Custom CSS',      desc: 'No UI library needed' },
  { icon: '🚀', name: 'Render + Vercel', desc: 'Free deployment' },
]

export default function LandingPage({ onNavigate }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <span className="brand-icon">⬡</span>
            {/* <span className="brand-name">HRMS <em>Lite</em></span> */}
          </div>
          <div className="landing-nav-actions">
            {isAuthenticated ? (
              <button className="lbtn lbtn-primary" onClick={() => onNavigate('dashboard')}>
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button className="lbtn lbtn-ghost" onClick={() => onNavigate('login')}>Sign In</button>
                <button className="lbtn lbtn-primary" onClick={() => onNavigate('register')}>Get Started</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="l-hero">
        <div className="l-hero-glow" />
        <div className="l-hero-content">
          <div className="l-badge">
            <span className="l-badge-dot" />
            Full-Stack Assignment Project
          </div>
          <h1 className="l-title">
            Human Resource<br />
            <span className="l-title-accent">Management</span><br />
            Made Simple
          </h1>
          <p className="l-desc">
            A lightweight, production-ready HRMS built with FastAPI, MongoDB and React.
            Manage employees and track attendance with a clean, fast admin interface.
          </p>
          <div className="l-hero-btns">
            <button className="lbtn lbtn-primary lbtn-lg" onClick={() => onNavigate('register')}>
              Start for Free →
            </button>
            <button className="lbtn lbtn-outline lbtn-lg" onClick={() => onNavigate('login')}>
              Sign In
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="l-stats">
          {[
            { value: '2',         label: 'Core Modules' },
            { value: '7+',        label: 'API Endpoints' },
            { value: '100% Free', label: 'To Deploy' },
          ].map(({ value, label }) => (
            <div className="l-stat" key={label}>
              <span className="l-stat-val">{value}</span>
              <span className="l-stat-lbl">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="l-section">
        <h2 className="l-section-title">Everything you need</h2>
        <p className="l-section-sub">Built to cover all core requirements — clean, stable, production-ready.</p>
        <div className="l-features">
          {FEATURES.map(({ icon, title, desc }) => (
            <div className="l-feature-card" key={title}>
              <span className="l-feature-icon">{icon}</span>
              <h3 className="l-feature-title">{title}</h3>
              <p className="l-feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="l-section l-section-alt">
        <h2 className="l-section-title">How it works</h2>
        <p className="l-section-sub">Get up and running in under 2 minutes</p>
        <div className="l-steps">
          {STEPS.map(({ n, title, desc }) => (
            <div className="l-step-card" key={n}>
              <div className="l-step-num">{n}</div>
              <h3 className="l-step-title">{title}</h3>
              <p className="l-step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────── */}
      <section className="l-section">
        <h2 className="l-section-title">Tech stack</h2>
        <p className="l-section-sub">Modern, production-grade and 100% free to deploy</p>
        <div className="l-stack">
          {STACK.map(({ icon, name, desc }) => (
            <div className="l-stack-card" key={name}>
              <span className="l-stack-icon">{icon}</span>
              <div>
                <p className="l-stack-name">{name}</p>
                <p className="l-stack-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="l-cta">
        <h2 className="l-cta-title">Ready to get started?</h2>
        <p className="l-cta-desc">Create your free admin account and manage your team in seconds.</p>
        <button className="lbtn lbtn-primary lbtn-lg" onClick={() => onNavigate('register')}>
          Create Free Account →
        </button>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="l-footer">
        <span>⬡ HRMS Lite — Full-Stack Assignment</span>
        <span>FastAPI · MongoDB · React</span>
      </footer>
    </div>
  )
}
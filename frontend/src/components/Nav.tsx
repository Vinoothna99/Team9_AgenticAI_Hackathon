import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Chat' },
  { to: '/upload', label: 'Upload CSV' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Nav() {
  return (
    <nav className="border-b border-slate-800 px-6 py-3 flex gap-6 items-center">
      <span className="font-bold text-emerald-400 mr-4 text-lg">VaultAI</span>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            isActive
              ? 'text-emerald-400 font-medium text-sm'
              : 'text-slate-400 hover:text-slate-200 text-sm'
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

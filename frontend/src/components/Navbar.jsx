
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logOutThunk } from '../redux/features/authSlice'
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const linkBase =
    'rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition'
  const linkActive = 'bg-slate-200 text-slate-900'
  const linkIdle = 'text-slate-600 hover:text-slate-900'

  const handleLogout = async () => {
    await dispatch(logOutThunk())
    navigate('/login')
  }

  return (
    <header
      className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            N
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Notex</p>
            <p className="text-sm text-slate-600">Notes dashboard</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/Notes"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          >
            All Notes
          </NavLink>
          <NavLink
            to="/Archieve"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          >
            Archieve
          </NavLink>
          <NavLink
            to="/Important"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          >
            Important
          </NavLink>
          <NavLink
            to="/Bin"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
          >
            Bin
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}



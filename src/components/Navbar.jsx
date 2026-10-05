import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm tracking-wide transition-colors ${
          isActive ? 'text-paper' : 'text-muted hover:text-paper'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { stop } = usePlayer()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    setMenuOpen(false)
    stop()
    await logout()
    navigate('/login')
  }

  const userLinks =
    user?.role === 'user'
      ? [
          { to: '/browse', label: 'Browse' },
          { to: '/albums', label: 'Albums' },
          { to: '/playlists', label: 'Playlists' },
          { to: '/liked', label: 'Liked' },
        ]
      : user?.role === 'artist'
      ? [{ to: '/dashboard', label: 'Dashboard' }]
      : []

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-paper">Reel</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-dim">
            deck
          </span>
        </div>

        {user && (
          <nav className="hidden items-center gap-6 sm:flex">
            {userLinks.map((link) => (
              <NavItem key={link.to} to={link.to}>
                {link.label}
              </NavItem>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <span className="hidden font-mono text-xs text-muted sm:inline">
                {user.username} · {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="press hidden rounded-full border border-hairline px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:border-amber hover:text-amber sm:block"
              >
                Log out
              </button>
              {/* mobile hamburger — only shows on small screens, replaces the hidden nav above */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="press grid h-9 w-9 place-items-center rounded-full border border-hairline text-paper sm:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 top-0 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                      menuOpen ? 'top-1.5 rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition-opacity duration-200 ${
                      menuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-3 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                      menuOpen ? 'top-1.5 -rotate-45' : ''
                    }`}
                  />
                </span>
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Log in</NavItem>
              <NavLink
                to="/register"
                className="press rounded-full bg-amber px-4 py-1.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* mobile dropdown menu */}
      {user && (
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out sm:hidden ${
            menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 border-t border-hairline px-4 py-3">
            {userLinks.map((link) => (
              <NavItem key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                <span className="block rounded-lg px-2 py-2 hover:bg-surface-raised">{link.label}</span>
              </NavItem>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-hairline px-2 pt-3">
              <span className="font-mono text-xs text-muted">
                {user.username} · {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="press rounded-full border border-hairline px-4 py-1.5 text-xs font-medium text-paper hover:border-amber hover:text-amber"
              >
                Log out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

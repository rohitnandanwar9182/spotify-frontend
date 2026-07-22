import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
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

  async function handleLogout() {
    stop()
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-paper">Reel</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-dim">deck</span>
        </div>

        {user && (
          <nav className="hidden items-center gap-6 sm:flex">
            {user.role === 'user' && (
              <>
                <NavItem to="/browse">Browse</NavItem>
                <NavItem to="/albums">Albums</NavItem>
                <NavItem to="/playlists">Playlists</NavItem>
                <NavItem to="/liked">Liked</NavItem>
              </>
            )}
            {user.role === 'artist' && <NavItem to="/dashboard">Dashboard</NavItem>}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden font-mono text-xs text-muted sm:inline">
                {user.username} · {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-hairline px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:border-amber hover:text-amber"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Log in</NavItem>
              <NavLink
                to="/register"
                className="rounded-full bg-amber px-4 py-1.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}





// import { NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { usePlayer } from '../context/PlayerContext'

// function NavItem({ to, children }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `text-sm tracking-wide transition-colors ${
//           isActive ? 'text-paper' : 'text-muted hover:text-paper'
//         }`
//       }
//     >
//       {children}
//     </NavLink>
//   )
// }

// export default function Navbar() {
//   const { user, logout } = useAuth()
//   const { stop } = usePlayer()
//   const navigate = useNavigate()

//   async function handleLogout() {
//     stop()
//     await logout()
//     navigate('/login')
//   }

//   return (
//     <header className="sticky top-0 z-40 border-b border-hairline bg-ink/90 backdrop-blur">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//         <div className="flex items-center gap-2">
//           <span className="font-display text-xl font-semibold tracking-tight text-paper">Reel</span>
//           <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-dim">deck</span>
//         </div>

//         {user && (
//           <nav className="hidden items-center gap-6 sm:flex">
//             {user.role === 'user' && (
//               <>
//                 <NavItem to="/browse">Browse</NavItem>
//                 <NavItem to="/albums">Albums</NavItem>
//               </>
//             )}
//             {user.role === 'artist' && <NavItem to="/dashboard">Dashboard</NavItem>}
//           </nav>
//         )}

//         <div className="flex items-center gap-4">
//           {user ? (
//             <>
//               <span className="hidden font-mono text-xs text-muted sm:inline">
//                 {user.username} · {user.role}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="rounded-full border border-hairline px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:border-amber hover:text-amber"
//               >
//                 Log out
//               </button>
//             </>
//           ) : (
//             <>
//               <NavItem to="/login">Log in</NavItem>
//               <NavLink
//                 to="/register"
//                 className="rounded-full bg-amber px-4 py-1.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
//               >
//                 Sign up
//               </NavLink>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }
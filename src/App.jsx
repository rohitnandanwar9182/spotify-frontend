import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Deck from './components/Deck'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import Liked from './pages/Liked'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'
import ArtistDashboard from './pages/ArtistDashboard'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'
import { usePlayer } from './context/PlayerContext'

export default function App() {
  const { user, ready } = useAuth()
  const location = useLocation()
  const { current } = usePlayer()

  if (!ready) return null

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main
        className={`mx-auto w-full max-w-6xl flex-1 px-4 pt-6 sm:px-6 sm:pt-8 ${
          current ? 'pb-32 sm:pb-28' : 'pb-10'
        }`}
      >
        {/* key={pathname} re-triggers the fade-in-up animation on every route change */}
        <div key={location.pathname} className="page-transition">
          <Routes location={location}>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={user.role === 'artist' ? '/dashboard' : '/browse'} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/browse"
              element={
                <ProtectedRoute role="user">
                  <Browse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/albums"
              element={
                <ProtectedRoute role="user">
                  <Albums />
                </ProtectedRoute>
              }
            />
            <Route
              path="/albums/:albumId"
              element={
                <ProtectedRoute role="user">
                  <AlbumDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked"
              element={
                <ProtectedRoute role="user">
                  <Liked />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute role="user">
                  <Playlists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists/:playlistId"
              element={
                <ProtectedRoute role="user">
                  <PlaylistDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="artist">
                  <ArtistDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Deck />
    </div>
  )
}

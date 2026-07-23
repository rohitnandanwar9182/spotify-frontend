import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Playlists() {
  const [playlists, setPlaylists] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  async function load() {
    try {
      const { data } = await api.get('/api/playlists')
      setPlaylists(data.playlists || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load playlists.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    try {
      await api.post('/api/playlists', { title })
      setTitle('')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create playlist.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">your mixtapes</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Playlists</h1>

      <form onSubmit={handleCreate} className="mt-6 flex max-w-sm gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber"
        />
        <button
          type="submit"
          disabled={creating}
          className="press shrink-0 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </form>

      {error && <p className="animate-fade-in mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {loading && <p className="text-sm text-muted">Loading playlists…</p>}
        {!loading && playlists.length === 0 && (
          <p className="animate-fade-in text-sm text-muted">No playlists yet — create one above.</p>
        )}
        {playlists.map((p, i) => (
          <Link
            key={p._id}
            to={`/playlists/${p._id}`}
            style={{ '--stagger-index': i }}
            className="stagger-in group flex flex-col gap-3 rounded-xl border border-hairline bg-surface p-3 transition-all duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-lg hover:shadow-black/20 active:translate-y-0 sm:p-4"
          >
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-surface-raised">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-teal transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div>
              <p className="truncate font-display text-sm font-semibold text-paper transition-colors group-hover:text-teal">
                {p.title}
              </p>
              <p className="font-mono text-xs text-muted">{p.musics?.length || 0} tracks</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

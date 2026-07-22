import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import TrackRow from '../components/TrackRow'
import { usePlayer } from '../context/PlayerContext'

export default function PlaylistDetail() {
  const { playlistId } = useParams()
  const { playSingle } = usePlayer()
  const [playlist, setPlaylist] = useState(null)
  const [allMusics, setAllMusics] = useState([])
  const [selectedToAdd, setSelectedToAdd] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  async function loadPlaylist() {
    const { data } = await api.get(`/api/playlists/${playlistId}`)
    setPlaylist(data.playlist)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        await loadPlaylist()
        const { data } = await api.get('/api/music/')
        if (!cancelled) setAllMusics(data.musics || [])
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load this playlist.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId])

  async function handleAddTrack(e) {
    e.preventDefault()
    setAddError('')
    if (!selectedToAdd) return
    setAdding(true)
    try {
      await api.post(`/api/playlists/${playlistId}/tracks`, { musicId: selectedToAdd })
      await loadPlaylist()
      setSelectedToAdd('')
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not add track.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading playlist…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!playlist) return null

  const list = (playlist.musics || []).map((m) => ({ id: m._id, ...m }))
  const alreadyInIds = new Set(list.map((t) => t.id))
  const addableMusics = allMusics.filter((m) => !alreadyInIds.has(m._id))

  return (
    <div>
      <Link to="/playlists" className="font-mono text-xs text-muted hover:text-paper">
        ← back to playlists
      </Link>

      <div className="mt-4 flex items-end gap-6">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-surface-raised">
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-teal" />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal">playlist</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-paper">{playlist.title}</h1>
          {list.length > 0 && (
            <button
              onClick={() => playSingle(list[0], list)}
              className="mt-4 rounded-full bg-amber px-5 py-2 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
            >
              ▶ Play playlist
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleAddTrack} className="mt-8 flex max-w-md gap-2">
        <select
          value={selectedToAdd}
          onChange={(e) => setSelectedToAdd(e.target.value)}
          className="flex-1 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
        >
          <option value="">Add a track…</option>
          {addableMusics.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title} — {m.artist?.username}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={adding || !selectedToAdd}
          className="rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {adding ? 'Adding…' : 'Add'}
        </button>
      </form>
      {addError && <p className="mt-2 text-sm text-danger">{addError}</p>}

      <div className="mt-8 flex flex-col">
        {list.length === 0 && <p className="text-sm text-muted">No tracks in this playlist yet.</p>}
        {list.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} list={list} />
        ))}
      </div>
    </div>
  )
}
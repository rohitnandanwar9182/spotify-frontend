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
  if (error) return <p className="animate-fade-in text-sm text-danger">{error}</p>
  if (!playlist) return null

  const list = (playlist.musics || []).map((m) => ({ id: m._id, ...m }))
  const alreadyInIds = new Set(list.map((t) => t.id))
  const addableMusics = allMusics.filter((m) => !alreadyInIds.has(m._id))

  return (
    <div>
      <Link to="/playlists" className="press inline-block font-mono text-xs text-muted transition-colors hover:text-paper">
        ← back to playlists
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-raised sm:h-32 sm:w-32">
          <div className="h-11 w-11 rounded-full border-2 border-dashed border-teal sm:h-14 sm:w-14" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal">playlist</p>
          <h1 className="mt-1 truncate font-display text-2xl font-semibold text-paper sm:text-3xl">
            {playlist.title}
          </h1>
          {list.length > 0 && (
            <button
              onClick={() => playSingle(list[0], list)}
              className="press mt-4 rounded-full bg-amber px-5 py-2 text-xs font-semibold text-ink shadow-md shadow-amber/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-amber/30"
            >
              ▶ Play playlist
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleAddTrack} className="mt-8 flex flex-col gap-2 sm:max-w-md sm:flex-row">
        <select
          value={selectedToAdd}
          onChange={(e) => setSelectedToAdd(e.target.value)}
          className="flex-1 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber"
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
          className="press shrink-0 rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {adding ? 'Adding…' : 'Add'}
        </button>
      </form>
      {addError && <p className="animate-fade-in mt-2 text-sm text-danger">{addError}</p>}

      <div className="mt-8 flex flex-col">
        {list.length === 0 && <p className="text-sm text-muted">No tracks in this playlist yet.</p>}
        {list.map((track, i) => (
          <div key={track.id} style={{ '--stagger-index': i }} className="stagger-in">
            <TrackRow track={track} index={i} list={list} />
          </div>
        ))}
      </div>
    </div>
  )
}

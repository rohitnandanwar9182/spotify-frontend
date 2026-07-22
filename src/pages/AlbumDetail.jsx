import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import TrackRow from '../components/TrackRow'
import { usePlayer } from '../context/PlayerContext'

export default function AlbumDetail() {
  const { albumId } = useParams()
  const { playSingle } = usePlayer()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get(`/api/music/albums/${albumId}`)
        if (!cancelled) setAlbum(data.album)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load this album.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [albumId])

  if (loading) return <p className="text-sm text-muted">Loading album…</p>
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!album) return null

  const list = (album.musics || []).map((m) => ({ id: m._id, ...m }))

  return (
    <div>
      <Link to="/albums" className="font-mono text-xs text-muted hover:text-paper">
        ← back to albums
      </Link>

      <div className="mt-4 flex items-end gap-6">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-surface-raised">
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-amber-dim" />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">album</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-paper">{album.title}</h1>
          <p className="mt-1 text-sm text-muted">{album.artist?.username}</p>
          {list.length > 0 && (
            <button
              onClick={() => playSingle(list[0], list)}
              className="mt-4 rounded-full bg-amber px-5 py-2 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
            >
              ▶ Play album
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        {list.length === 0 && <p className="text-sm text-muted">This album has no tracks yet.</p>}
        {list.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} list={list} />
        ))}
      </div>
    </div>
  )
}

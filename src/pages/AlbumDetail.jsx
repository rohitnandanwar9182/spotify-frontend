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
  if (error) return <p className="animate-fade-in text-sm text-danger">{error}</p>
  if (!album) return null

  const list = (album.musics || []).map((m) => ({ id: m._id, ...m }))

  return (
    <div>
      <Link to="/albums" className="press inline-block font-mono text-xs text-muted transition-colors hover:text-paper">
        ← back to albums
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-raised sm:h-32 sm:w-32">
          <div className="h-11 w-11 rounded-full border-2 border-dashed border-amber-dim sm:h-14 sm:w-14" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">album</p>
          <h1 className="mt-1 truncate font-display text-2xl font-semibold text-paper sm:text-3xl">
            {album.title}
          </h1>
          <p className="mt-1 text-sm text-muted">{album.artist?.username}</p>
          {list.length > 0 && (
            <button
              onClick={() => playSingle(list[0], list)}
              className="press mt-4 rounded-full bg-amber px-5 py-2 text-xs font-semibold text-ink shadow-md shadow-amber/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-amber/30"
            >
              ▶ Play album
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        {list.length === 0 && <p className="text-sm text-muted">This album has no tracks yet.</p>}
        {list.map((track, i) => (
          <div key={track.id} style={{ '--stagger-index': i }} className="stagger-in">
            <TrackRow track={track} index={i} list={list} />
          </div>
        ))}
      </div>
    </div>
  )
}

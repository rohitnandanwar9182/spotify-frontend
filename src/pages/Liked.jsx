import { useEffect, useState } from 'react'
import api from '../api/axios'
import TrackRow from '../components/TrackRow'
import SkeletonRow from '../components/Skeleton'

export default function Liked() {
  const [musics, setMusics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get('/api/music/liked')
        if (!cancelled) setMusics(data.musics || [])
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load liked tracks.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleUnlike(track) {
    setMusics((prev) => prev.filter((m) => m._id !== track.id))
    try {
      await api.post(`/api/music/${track.id}/like`)
    } catch {
      // worst case it just reappears next time this page loads
    }
  }

  const list = musics.map((m) => ({ id: m._id, ...m }))

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">favorites</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Liked</h1>
      <p className="mt-2 text-sm text-muted">Tracks you've hearted.</p>

      <div className="mt-8">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ '--stagger-index': i }} className="stagger-in">
              <SkeletonRow />
            </div>
          ))}
        {error && <p className="animate-fade-in text-sm text-danger">{error}</p>}
        {!loading && !error && list.length === 0 && (
          <p className="animate-fade-in text-sm text-muted">
            Nothing liked yet — hit the heart on any track in Browse.
          </p>
        )}
        <div className="flex flex-col">
          {list.map((track, i) => (
            <div key={track.id} style={{ '--stagger-index': i }} className="stagger-in">
              <TrackRow track={track} index={i} list={list} liked onToggleLike={handleUnlike} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

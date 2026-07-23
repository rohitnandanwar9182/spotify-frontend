import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import SkeletonRow from '../components/Skeleton'

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get('/api/music/albums')
        if (!cancelled) setAlbums(data.albums || [])
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load albums.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">the shelf</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Albums</h1>
      <p className="mt-2 text-sm text-muted">Collections, grouped by the artists who made them.</p>

      <div className="mt-8">
        {loading && (
          <div className="col-span-full flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ '--stagger-index': i }} className="stagger-in">
                <SkeletonRow />
              </div>
            ))}
          </div>
        )}
        {error && <p className="animate-fade-in text-sm text-danger">{error}</p>}
        {!loading && !error && albums.length === 0 && (
          <p className="animate-fade-in text-sm text-muted">No albums yet.</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {albums.map((album, i) => (
            <Link
              key={album._id}
              to={`/albums/${album._id}`}
              style={{ '--stagger-index': i }}
              className="stagger-in group flex flex-col gap-3 rounded-xl border border-hairline bg-surface p-3 transition-all duration-200 hover:-translate-y-1 hover:border-amber hover:shadow-lg hover:shadow-black/20 active:translate-y-0 sm:p-4"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-surface-raised">
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-amber-dim transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <div>
                <p className="truncate font-display text-sm font-semibold text-paper transition-colors group-hover:text-amber">
                  {album.title}
                </p>
                <p className="truncate font-mono text-xs text-muted">{album.artist?.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


import { useEffect, useState } from 'react'
import api from '../api/axios'
import TrackRow from '../components/TrackRow'
import SkeletonRow from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'

export default function Browse() {
  const { user } = useAuth()
  const [musics, setMusics] = useState([])
  const [likedIds, setLikedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await api.get('/api/music/')
        if (!cancelled) {
          const all = data.musics || []
          setMusics(all)
          const mineLiked = all.filter((m) => (m.likedBy || []).includes(user.id)).map((m) => m._id)
          setLikedIds(new Set(mineLiked))
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not load tracks.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user.id])

  async function handleToggleLike(track) {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(track.id)) next.delete(track.id)
      else next.add(track.id)
      return next
    })
    try {
      await api.post(`/api/music/${track.id}/like`)
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev)
        if (next.has(track.id)) next.delete(track.id)
        else next.add(track.id)
        return next
      })
    }
  }

  const term = search.trim().toLowerCase()
  const filtered = musics.filter((m) => {
    if (!term) return true
    return (
      m.title.toLowerCase().includes(term) || (m.artist?.username || '').toLowerCase().includes(term)
    )
  })

  const list = filtered
    .slice()
    .reverse()
    .map((m) => ({ id: m._id, ...m }))

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">now spinning</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Browse</h1>
      <p className="mt-2 text-sm text-muted">Every track uploaded to the deck, newest first.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or artist…"
        className="mt-6 w-full max-w-sm rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
      />

      <div className="mt-8">
        {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        {error && <p className="text-sm text-danger">{error}</p>}
        {!loading && !error && list.length === 0 && (
          <p className="text-sm text-muted">
            {term ? 'No tracks match your search.' : 'No tracks yet. Check back once an artist uploads something.'}
          </p>
        )}
        <div className="flex flex-col">
          {list.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              list={list}
              liked={likedIds.has(track.id)}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


// import { useEffect, useState } from 'react'
// import api from '../api/axios'
// import TrackRow from '../components/TrackRow'

// export default function Browse() {
//   const [musics, setMusics] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     let cancelled = false
//     async function load() {
//       try {
//         const { data } = await api.get('/api/music/')
//         if (!cancelled) setMusics(data.musics || [])
//       } catch (err) {
//         if (!cancelled) setError(err.response?.data?.message || 'Could not load tracks.')
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }
//     load()
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   return (
//     <div>
//       <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">now spinning</p>
//       <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Browse</h1>
//       <p className="mt-2 text-sm text-muted">Every track uploaded to the deck, newest first.</p>

//       <div className="mt-8">
//         {loading && <p className="text-sm text-muted">Loading tracks…</p>}
//         {error && <p className="text-sm text-danger">{error}</p>}
//         {!loading && !error && musics.length === 0 && (
//           <p className="text-sm text-muted">No tracks yet. Check back once an artist uploads something.</p>
//         )}
//         <div className="flex flex-col">
//           {musics
//             .slice()
//             .reverse()
//             .map((track, i) => (
//               <TrackRow key={track._id} track={{ id: track._id, ...track }} index={i} list={musics.map((m) => ({ id: m._id, ...m }))} />
//             ))}
//         </div>
//       </div>
//     </div>
//   )
// }

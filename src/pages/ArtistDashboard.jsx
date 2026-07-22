import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function ArtistDashboard() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedTracks, setUploadedTracks] = useState([])
  const [loadingMine, setLoadingMine] = useState(true)

  const [albumTitle, setAlbumTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [creatingAlbum, setCreatingAlbum] = useState(false)
  const [albumError, setAlbumError] = useState('')
  const [albumSuccess, setAlbumSuccess] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadMine() {
      try {
        const { data } = await api.get('/api/music/mine')
        if (!cancelled) {
          const mine = (data.musics || []).map((m) => ({
            id: m._id,
            uri: m.uri,
            title: m.title,
            artist: m.artist,
          }))
          setUploadedTracks(mine.reverse())
        }
      } catch {
        // if /api/music/mine isn't deployed on the backend yet, we just fall
        // back to tracking uploads made during this session only
      } finally {
        if (!cancelled) setLoadingMine(false)
      }
    }
    loadMine()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleUpload(e) {
    e.preventDefault()
    setUploadError('')
    if (!file) {
      setUploadError('Choose an audio file first.')
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('music', file)
      const { data } = await api.post('/api/music/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUploadedTracks((prev) => [data.music, ...prev])
      setTitle('')
      setFile(null)
      e.target.reset()
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  function toggleSelected(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function handleCreateAlbum(e) {
    e.preventDefault()
    setAlbumError('')
    setAlbumSuccess('')
    if (selectedIds.length === 0) {
      setAlbumError('Select at least one track.')
      return
    }
    setCreatingAlbum(true)
    try {
      const { data } = await api.post('/api/music/album', {
        title: albumTitle,
        musics: selectedIds,
      })
      setAlbumSuccess(`Album "${data.album.title}" created.`)
      setAlbumTitle('')
      setSelectedIds([])
    } catch (err) {
      setAlbumError(err.response?.data?.message || 'Could not create album.')
    } finally {
      setCreatingAlbum(false)
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">artist deck</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Upload a track, then group any of your uploads into an album.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-hairline bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-paper">Upload a track</h2>
          <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Title</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
                placeholder="Track title"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Audio file</span>
              <input
                type="file"
                accept="audio/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper file:mr-4 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-semibold file:text-ink"
              />
            </label>

            {uploadError && <p className="text-sm text-danger">{uploadError}</p>}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Upload track'}
            </button>
          </form>

          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">your uploads</p>
            {loadingMine && <p className="mt-2 text-sm text-muted">Loading your tracks…</p>}
            {!loadingMine && uploadedTracks.length === 0 && (
              <p className="mt-2 text-sm text-muted">Nothing uploaded yet.</p>
            )}
            <ul className="mt-2 flex flex-col gap-1">
              {uploadedTracks.map((t) => (
                <li key={t.id} className="truncate text-sm text-paper">
                  {t.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-paper">Create an album</h2>
          <p className="mt-1 text-xs text-muted">Pick from any track you've uploaded.</p>

          <form onSubmit={handleCreateAlbum} className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Album title</span>
              <input
                type="text"
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
                placeholder="Album title"
              />
            </label>

            <div>
              <span className="text-xs font-medium text-muted">Tracks</span>
              {uploadedTracks.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Upload a track first to add it here.</p>
              ) : (
                <div className="mt-2 flex flex-col gap-1">
                  {uploadedTracks.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-raised"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(t.id)}
                        onChange={() => toggleSelected(t.id)}
                        className="accent-amber"
                      />
                      <span className="truncate text-sm text-paper">{t.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {albumError && <p className="text-sm text-danger">{albumError}</p>}
            {albumSuccess && <p className="text-sm text-teal">{albumSuccess}</p>}

            <button
              type="submit"
              disabled={creatingAlbum}
              className="rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {creatingAlbum ? 'Creating…' : 'Create album'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}





// import { useState } from 'react'
// import api from '../api/axios'

// export default function ArtistDashboard() {
//   const [title, setTitle] = useState('')
//   const [file, setFile] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [uploadError, setUploadError] = useState('')
//   const [uploadedTracks, setUploadedTracks] = useState([]) // tracks uploaded this session

//   const [albumTitle, setAlbumTitle] = useState('')
//   const [selectedIds, setSelectedIds] = useState([])
//   const [creatingAlbum, setCreatingAlbum] = useState(false)
//   const [albumError, setAlbumError] = useState('')
//   const [albumSuccess, setAlbumSuccess] = useState('')

//   async function handleUpload(e) {
//     e.preventDefault()
//     setUploadError('')
//     if (!file) {
//       setUploadError('Choose an audio file first.')
//       return
//     }
//     setUploading(true)
//     try {
//       const form = new FormData()
//       form.append('title', title)
//       form.append('music', file)
//       const { data } = await api.post('/api/music/upload', form, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       setUploadedTracks((prev) => [data.music, ...prev])
//       setTitle('')
//       setFile(null)
//       e.target.reset()
//     } catch (err) {
//       setUploadError(err.response?.data?.message || 'Upload failed. Try again.')
//     } finally {
//       setUploading(false)
//     }
//   }

//   function toggleSelected(id) {
//     setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
//   }

//   async function handleCreateAlbum(e) {
//     e.preventDefault()
//     setAlbumError('')
//     setAlbumSuccess('')
//     if (selectedIds.length === 0) {
//       setAlbumError('Select at least one track uploaded this session.')
//       return
//     }
//     setCreatingAlbum(true)
//     try {
//       const { data } = await api.post('/api/music/album', {
//         title: albumTitle,
//         musics: selectedIds,
//       })
//       setAlbumSuccess(`Album "${data.album.title}" created.`)
//       setAlbumTitle('')
//       setSelectedIds([])
//     } catch (err) {
//       setAlbumError(err.response?.data?.message || 'Could not create album.')
//     } finally {
//       setCreatingAlbum(false)
//     }
//   }

//   return (
//     <div>
//       <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-dim">artist deck</p>
//       <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Dashboard</h1>
//       <p className="mt-2 text-sm text-muted">Upload a track, then group your uploads into an album.</p>

//       <div className="mt-8 grid gap-8 lg:grid-cols-2">
//         {/* Upload track */}
//         <section className="rounded-xl border border-hairline bg-surface p-5">
//           <h2 className="font-display text-lg font-semibold text-paper">Upload a track</h2>
//           <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-4">
//             <label className="flex flex-col gap-1.5">
//               <span className="text-xs font-medium text-muted">Title</span>
//               <input
//                 type="text"
//                 required
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
//                 placeholder="Track title"
//               />
//             </label>

//             <label className="flex flex-col gap-1.5">
//               <span className="text-xs font-medium text-muted">Audio file</span>
//               <input
//                 type="file"
//                 accept="audio/*"
//                 required
//                 onChange={(e) => setFile(e.target.files?.[0] || null)}
//                 className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper file:mr-4 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-semibold file:text-ink"
//               />
//             </label>

//             {uploadError && <p className="text-sm text-danger">{uploadError}</p>}

//             <button
//               type="submit"
//               disabled={uploading}
//               className="rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
//             >
//               {uploading ? 'Uploading…' : 'Upload track'}
//             </button>
//           </form>

//           {uploadedTracks.length > 0 && (
//             <div className="mt-6">
//               <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
//                 uploaded this session
//               </p>
//               <ul className="mt-2 flex flex-col gap-1">
//                 {uploadedTracks.map((t) => (
//                   <li key={t.id} className="truncate text-sm text-paper">
//                     {t.title}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </section>

//         {/* Create album */}
//         <section className="rounded-xl border border-hairline bg-surface p-5">
//           <h2 className="font-display text-lg font-semibold text-paper">Create an album</h2>
//           <p className="mt-1 text-xs text-muted">
//             The API only lets an album reference tracks you know the ID of, so pick from what you've
//             uploaded this session below.
//           </p>

//           <form onSubmit={handleCreateAlbum} className="mt-4 flex flex-col gap-4">
//             <label className="flex flex-col gap-1.5">
//               <span className="text-xs font-medium text-muted">Album title</span>
//               <input
//                 type="text"
//                 required
//                 value={albumTitle}
//                 onChange={(e) => setAlbumTitle(e.target.value)}
//                 className="rounded-lg border border-hairline bg-surface-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-amber"
//                 placeholder="Album title"
//               />
//             </label>

//             <div>
//               <span className="text-xs font-medium text-muted">Tracks</span>
//               {uploadedTracks.length === 0 ? (
//                 <p className="mt-2 text-sm text-muted">Upload a track first to add it here.</p>
//               ) : (
//                 <div className="mt-2 flex flex-col gap-1">
//                   {uploadedTracks.map((t) => (
//                     <label
//                       key={t.id}
//                       className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-raised"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(t.id)}
//                         onChange={() => toggleSelected(t.id)}
//                         className="accent-amber"
//                       />
//                       <span className="truncate text-sm text-paper">{t.title}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {albumError && <p className="text-sm text-danger">{albumError}</p>}
//             {albumSuccess && <p className="text-sm text-teal">{albumSuccess}</p>}

//             <button
//               type="submit"
//               disabled={creatingAlbum}
//               className="rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
//             >
//               {creatingAlbum ? 'Creating…' : 'Create album'}
//             </button>
//           </form>
//         </section>
//       </div>
//     </div>
//   )
// }

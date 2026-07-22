import { usePlayer } from '../context/PlayerContext'

export default function TrackRow({ track, index, list, liked, onToggleLike }) {
  const { current, isPlaying, playSingle } = usePlayer()
  const isCurrent = current?.id === track.id

  return (
    <div
      className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-raised ${
        isCurrent ? 'bg-surface-raised' : ''
      }`}
    >
      <button onClick={() => playSingle(track, list)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        <span
          className={`w-8 shrink-0 font-mono text-xs ${
            isCurrent ? 'text-amber' : 'text-muted group-hover:text-paper'
          }`}
        >
          {isCurrent && isPlaying ? '▶' : String(index + 1).padStart(3, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate font-medium ${isCurrent ? 'text-amber' : 'text-paper'}`}>
            {track.title}
          </span>
          <span className="block truncate font-mono text-xs text-muted">
            {track.artist?.username || 'unknown artist'}
          </span>
        </span>
      </button>

      {onToggleLike && (
        <button
          onClick={() => onToggleLike(track)}
          className={`shrink-0 px-2 text-lg leading-none transition-colors ${
            liked ? 'text-amber' : 'text-muted hover:text-paper'
          }`}
          aria-label={liked ? 'Unlike this track' : 'Like this track'}
        >
          {liked ? '♥' : '♡'}
        </button>
      )}
    </div>
  )
}




// import { usePlayer } from '../context/PlayerContext'

// export default function TrackRow({ track, index, list }) {
//   const { current, isPlaying, playSingle } = usePlayer()
//   const isCurrent = current?.id === track.id

//   return (
//     <button
//       onClick={() => playSingle(track, list)}
//       className={`group flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-raised ${
//         isCurrent ? 'bg-surface-raised' : ''
//       }`}
//     >
//       <span
//         className={`w-8 shrink-0 font-mono text-xs ${
//           isCurrent ? 'text-amber' : 'text-muted group-hover:text-paper'
//         }`}
//       >
//         {isCurrent && isPlaying ? '▶' : String(index + 1).padStart(3, '0')}
//       </span>
//       <span className="min-w-0 flex-1">
//         <span className={`block truncate font-medium ${isCurrent ? 'text-amber' : 'text-paper'}`}>
//           {track.title}
//         </span>
//         <span className="block truncate font-mono text-xs text-muted">
//           {track.artist?.username || 'unknown artist'}
//         </span>
//       </span>
//     </button>
//   )
// }

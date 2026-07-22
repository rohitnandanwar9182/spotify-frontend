import { usePlayer } from '../context/PlayerContext'

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Deck() {
  const { current, isPlaying, progress, duration, volume, setVolume, togglePlay, next, prev, seek } = usePlayer()

  if (!current) return null

  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <div className="relative h-11 w-11 shrink-0 rounded-full border-2 border-hairline bg-ink">
          <div
            className={`absolute inset-1 rounded-full border-[3px] border-dashed border-amber-dim ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          />
          <div className="absolute inset-[14px] rounded-full bg-amber" />
        </div>

        <div className="min-w-0 flex-1 sm:flex-none sm:w-48">
          <p className="truncate font-display text-sm font-medium text-paper">{current.title}</p>
          <p className="truncate font-mono text-[11px] text-muted">
            {current.artist?.username || 'unknown artist'}
          </p>
        </div>

        <button
          onClick={prev}
          className="hidden text-muted transition-colors hover:text-paper sm:block"
          aria-label="Previous track"
        >
          ◀◀
        </button>

        <button
          onClick={togglePlay}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber text-ink transition-opacity hover:opacity-90"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={next}
          className="hidden text-muted transition-colors hover:text-paper sm:block"
          aria-label="Next track"
        >
          ▶▶
        </button>

        <div className="hidden flex-1 items-center gap-2 sm:flex">
          <span className="font-mono text-[11px] text-muted">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-hairline accent-amber"
            style={{
              background: `linear-gradient(to right, var(--color-amber) ${pct}%, var(--color-hairline) ${pct}%)`,
            }}
          />
          <span className="font-mono text-[11px] text-muted">{formatTime(duration)}</span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs text-muted" aria-hidden="true">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-hairline accent-amber"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}





// import { usePlayer } from '../context/PlayerContext'

// function formatTime(sec) {
//   if (!sec || Number.isNaN(sec)) return '0:00'
//   const m = Math.floor(sec / 60)
//   const s = Math.floor(sec % 60)
//   return `${m}:${s.toString().padStart(2, '0')}`
// }

// export default function Deck() {
//   const { current, isPlaying, progress, duration, togglePlay, next, prev, seek } = usePlayer()

//   if (!current) return null

//   const pct = duration ? (progress / duration) * 100 : 0

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 backdrop-blur">
//       <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
//         {/* spinning reel — the signature element */}
//         <div className="relative h-11 w-11 shrink-0 rounded-full border-2 border-hairline bg-ink">
//           <div
//             className={`absolute inset-1 rounded-full border-[3px] border-dashed border-amber-dim ${
//               isPlaying ? 'animate-spin-slow' : ''
//             }`}
//           />
//           <div className="absolute inset-[14px] rounded-full bg-amber" />
//         </div>

//         <div className="min-w-0 flex-1 sm:flex-none sm:w-48">
//           <p className="truncate font-display text-sm font-medium text-paper">{current.title}</p>
//           <p className="truncate font-mono text-[11px] text-muted">
//             {current.artist?.username || 'unknown artist'}
//           </p>
//         </div>

//         <button
//           onClick={prev}
//           className="hidden text-muted transition-colors hover:text-paper sm:block"
//           aria-label="Previous track"
//         >
//           ◀◀
//         </button>

//         <button
//           onClick={togglePlay}
//           className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber text-ink transition-opacity hover:opacity-90"
//           aria-label={isPlaying ? 'Pause' : 'Play'}
//         >
//           {isPlaying ? '❚❚' : '▶'}
//         </button>

//         <button
//           onClick={next}
//           className="hidden text-muted transition-colors hover:text-paper sm:block"
//           aria-label="Next track"
//         >
//           ▶▶
//         </button>

//         <div className="hidden flex-1 items-center gap-2 sm:flex">
//           <span className="font-mono text-[11px] text-muted">{formatTime(progress)}</span>
//           <input
//             type="range"
//             min={0}
//             max={duration || 0}
//             value={progress}
//             onChange={(e) => seek(Number(e.target.value))}
//             className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-hairline accent-amber"
//             style={{
//               background: `linear-gradient(to right, var(--color-amber) ${pct}%, var(--color-hairline) ${pct}%)`,
//             }}
//           />
//           <span className="font-mono text-[11px] text-muted">{formatTime(duration)}</span>
//         </div>
//       </div>
//     </div>
//   )
// }

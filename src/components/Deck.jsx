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
    <div className="animate-slide-up-deck pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 backdrop-blur">
      {/* seek bar — full width, always visible on every screen size */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-none bg-hairline accent-amber transition-[background] sm:h-1"
        style={{
          background: `linear-gradient(to right, var(--color-amber) ${pct}%, var(--color-hairline) ${pct}%)`,
        }}
        aria-label="Seek"
      />

      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        {/* spinning reel — the signature element */}
        <div className="relative h-10 w-10 shrink-0 rounded-full border-2 border-hairline bg-ink transition-transform duration-300 sm:h-11 sm:w-11">
          <div
            className={`absolute inset-1 rounded-full border-[3px] border-dashed border-amber-dim transition-transform ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          />
          <div
            className={`absolute inset-[13px] rounded-full bg-amber transition-transform duration-300 sm:inset-[14px] ${
              isPlaying ? 'animate-pulse-ring' : ''
            }`}
          />
        </div>

        <div className="min-w-0 flex-1 sm:flex-none sm:w-40 md:w-48">
          <p className="truncate font-display text-sm font-medium text-paper">{current.title}</p>
          <p className="truncate font-mono text-[11px] text-muted">
            {current.artist?.username || 'unknown artist'}
          </p>
        </div>

        <button
          onClick={prev}
          className="press hidden text-muted transition-colors hover:text-paper sm:block"
          aria-label="Previous track"
        >
          ◀◀
        </button>

        <button
          onClick={togglePlay}
          className="press grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-ink shadow-md shadow-amber/20 transition-transform hover:opacity-90 hover:shadow-lg hover:shadow-amber/30 sm:h-9 sm:w-9"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={next}
          className="press hidden text-muted transition-colors hover:text-paper sm:block"
          aria-label="Next track"
        >
          ▶▶
        </button>

        <div className="hidden shrink-0 items-center gap-2 font-mono text-[11px] text-muted md:flex">
          <span className="w-9 text-right tabular-nums">{formatTime(progress)}</span>
          <span>/</span>
          <span className="w-9 tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
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

        {/* compact time readout for phones, since the full one is hidden below md */}
        <span className="font-mono text-[10px] tabular-nums text-muted md:hidden">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

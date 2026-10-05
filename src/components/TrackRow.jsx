import { usePlayer } from '../context/PlayerContext'

export default function TrackRow({ track, index, list, liked, onToggleLike }) {
  const { current, isPlaying, playSingle } = usePlayer()
  const isCurrent = current?.id === track.id

  return (
    <div
      className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2.5 transition-all duration-200 hover:bg-surface-raised sm:px-3 ${
        isCurrent ? 'bg-surface-raised' : ''
      }`}
    >
      <button
        onClick={() => playSingle(track, list)}
        className="press flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
      >
        <span
          className={`w-7 shrink-0 font-mono text-xs transition-colors sm:w-8 ${
            isCurrent ? 'text-amber' : 'text-muted group-hover:text-paper'
          }`}
        >
          {isCurrent && isPlaying ? (
            <span className="inline-flex items-end gap-[2px]">
              <span className="h-2 w-[3px] animate-pulse bg-amber [animation-duration:0.6s]" />
              <span className="h-3 w-[3px] animate-pulse bg-amber [animation-delay:150ms] [animation-duration:0.6s]" />
              <span className="h-1.5 w-[3px] animate-pulse bg-amber [animation-delay:300ms] [animation-duration:0.6s]" />
            </span>
          ) : (
            String(index + 1).padStart(3, '0')
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate font-medium transition-colors ${
              isCurrent ? 'text-amber' : 'text-paper'
            }`}
          >
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
          className={`press shrink-0 px-2 text-lg leading-none transition-all duration-200 ${
            liked ? 'scale-110 text-amber' : 'text-muted hover:scale-110 hover:text-paper'
          }`}
          aria-label={liked ? 'Unlike this track' : 'Like this track'}
        >
          {liked ? '♥' : '♡'}
        </button>
      )}
    </div>
  )
}

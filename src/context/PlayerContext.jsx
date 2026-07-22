import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio())
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)

  const current = currentIndex >= 0 ? queue[currentIndex] : null

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  const setVolume = useCallback((v) => {
    setVolumeState(v)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => next()
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex])

  const playTrackAt = useCallback((list, index) => {
    setQueue(list)
    setCurrentIndex(index)
    const track = list[index]
    if (!track) return
    const audio = audioRef.current
    audio.src = track.uri
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [])

  const playSingle = useCallback((track, list = null) => {
    const source = list || [track]
    const idx = source.findIndex((t) => t.id === track.id)
    playTrackAt(source, idx === -1 ? 0 : idx)
  }, [playTrackAt])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!current) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [current, isPlaying])

  const next = useCallback(() => {
    setCurrentIndex((idx) => {
      const nextIdx = idx + 1
      if (nextIdx >= queue.length) return idx
      const track = queue[nextIdx]
      const audio = audioRef.current
      audio.src = track.uri
      audio.play().catch(() => {})
      setIsPlaying(true)
      return nextIdx
    })
  }, [queue])

  const prev = useCallback(() => {
    setCurrentIndex((idx) => {
      const prevIdx = idx - 1
      if (prevIdx < 0) return idx
      const track = queue[prevIdx]
      const audio = audioRef.current
      audio.src = track.uri
      audio.play().catch(() => {})
      setIsPlaying(true)
      return prevIdx
    })
  }, [queue])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setProgress(time)
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentIndex(-1)
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        current,
        isPlaying,
        progress,
        duration,
        volume,
        setVolume,
        playSingle,
        togglePlay,
        next,
        prev,
        seek,
        stop,
        queue,
        currentIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}




// import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

// const PlayerContext = createContext(null)

// export function PlayerProvider({ children }) {
//   const audioRef = useRef(new Audio())
//   const [queue, setQueue] = useState([]) // array of music objects {id, uri, title, artist}
//   const [currentIndex, setCurrentIndex] = useState(-1)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [duration, setDuration] = useState(0)

//   const current = currentIndex >= 0 ? queue[currentIndex] : null

//   useEffect(() => {
//     const audio = audioRef.current
//     const onTime = () => setProgress(audio.currentTime)
//     const onMeta = () => setDuration(audio.duration || 0)
//     const onEnd = () => next()
//     audio.addEventListener('timeupdate', onTime)
//     audio.addEventListener('loadedmetadata', onMeta)
//     audio.addEventListener('ended', onEnd)
//     return () => {
//       audio.removeEventListener('timeupdate', onTime)
//       audio.removeEventListener('loadedmetadata', onMeta)
//       audio.removeEventListener('ended', onEnd)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [queue, currentIndex])

//   const playTrackAt = useCallback((list, index) => {
//     setQueue(list)
//     setCurrentIndex(index)
//     const track = list[index]
//     if (!track) return
//     const audio = audioRef.current
//     audio.src = track.uri
//     audio.play().catch(() => {})
//     setIsPlaying(true)
//   }, [])

//   const playSingle = useCallback((track, list = null) => {
//     const source = list || [track]
//     const idx = source.findIndex((t) => t.id === track.id)
//     playTrackAt(source, idx === -1 ? 0 : idx)
//   }, [playTrackAt])

//   const togglePlay = useCallback(() => {
//     const audio = audioRef.current
//     if (!current) return
//     if (isPlaying) {
//       audio.pause()
//       setIsPlaying(false)
//     } else {
//       audio.play().catch(() => {})
//       setIsPlaying(true)
//     }
//   }, [current, isPlaying])

//   const next = useCallback(() => {
//     setCurrentIndex((idx) => {
//       const nextIdx = idx + 1
//       if (nextIdx >= queue.length) return idx
//       const track = queue[nextIdx]
//       const audio = audioRef.current
//       audio.src = track.uri
//       audio.play().catch(() => {})
//       setIsPlaying(true)
//       return nextIdx
//     })
//   }, [queue])

//   const prev = useCallback(() => {
//     setCurrentIndex((idx) => {
//       const prevIdx = idx - 1
//       if (prevIdx < 0) return idx
//       const track = queue[prevIdx]
//       const audio = audioRef.current
//       audio.src = track.uri
//       audio.play().catch(() => {})
//       setIsPlaying(true)
//       return prevIdx
//     })
//   }, [queue])

//   const seek = useCallback((time) => {
//     audioRef.current.currentTime = time
//     setProgress(time)
//   }, [])

//   const stop = useCallback(() => {
//     const audio = audioRef.current
//     audio.pause()
//     audio.currentTime = 0
//     setIsPlaying(false)
//     setCurrentIndex(-1)
//   }, [])

//   return (
//     <PlayerContext.Provider
//       value={{ current, isPlaying, progress, duration, playSingle, togglePlay, next, prev, seek, stop, queue, currentIndex }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   )
// }

// export function usePlayer() {
//   const ctx = useContext(PlayerContext)
//   if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
//   return ctx
// }
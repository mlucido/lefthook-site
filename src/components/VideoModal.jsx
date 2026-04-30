import { useEffect, useRef, useCallback } from 'react'
import Plyr from 'plyr'

const PLYR_CONFIG = {
  controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
  hideControls: true,
  resetOnEnd: true,
  tooltips: { controls: false, seek: true },
  keyboard: { focused: true, global: false },
}

export default function VideoModal({ video, onClose }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const isOpen = video !== null

  // Initialize Plyr once, bypassing StrictMode double-invocation
  const initPlayer = useCallback((container) => {
    if (!container || playerRef.current) return
    const videoEl = container.querySelector('video')
    if (!videoEl) return
    playerRef.current = new Plyr(videoEl, PLYR_CONFIG)
  }, [])

  useEffect(() => {
    initPlayer(containerRef.current)
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    if (isOpen && video) {
      player.source = {
        type: 'video',
        sources: [{ src: video.video_url, type: 'video/mp4' }],
      }
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        playerRef.current?.play().catch(() => {})
      }, 400)
    } else {
      player.pause()
      document.body.style.overflow = ''
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.source = { type: 'video', sources: [] }
        }
      }, 500)
    }
  }, [isOpen, video])

  const handleClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleClose])

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <button className="modal-close-btn" onClick={handleClose} aria-label="Close video">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
      <div className="modal-player-wrap" ref={containerRef}>
        <video playsInline />
      </div>
      <div className="modal-info">
        <div className="modal-campaign">{video?.campaign ?? ''}</div>
        <div className="modal-ad-title">{video?.title ?? ''}</div>
      </div>
    </div>
  )
}

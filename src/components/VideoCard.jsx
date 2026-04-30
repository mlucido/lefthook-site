export default function VideoCard({ video, onPlay, revealDelay }) {
  const thumbStyle = video.thumbnail_url
    ? { backgroundImage: `url(${video.thumbnail_url})` }
    : { background: 'linear-gradient(160deg,#1a2535,#0f1a2a 40%,#1e2d42)' }

  return (
    <div
      className={`video-card reveal${video.is_tall ? ' tall' : ''}`}
      style={{ transitionDelay: `${revealDelay}s` }}
      onClick={() => onPlay(video)}
    >
      <div className="video-thumb" style={thumbStyle} />
      <div className="video-tint" />
      <div className="video-shade" />
      <div className="video-tag">{video.category}</div>
      <div className="play-btn">
        <svg viewBox="0 0 24 24"><polygon points="8,5 20,12 8,19" /></svg>
      </div>
      <div className="video-label">
        <div className="video-client-name">{video.campaign}</div>
        <div className="video-spot-title">{video.title}</div>
      </div>
    </div>
  )
}

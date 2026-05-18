import { useState } from 'react'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import { videos } from '../data/videos'
import { useReveal } from '../hooks/useReveal'

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(null)
  useReveal()

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">
            HIT 'EM WITH THAT <span style={{ color: 'var(--blue-light)' }}>LEFT</span> HOOK
          </h1>
          <p className="hero-sub">Strategy that wins. Creative that hits.</p>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="work-label reveal">Our Work</div>
        <div className="video-grid">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={setActiveVideo}
              revealDelay={(i + 1) * 0.05}
            />
          ))}
        </div>
      </section>

      <ContactSection />

      <section className="closing-band">
        <p className="closing-band__stmt">
          Political media without strategy is just expensive art.
          <span className="closing-band__attr">— Left Hook Communications</span>
        </p>
      </section>

      <Footer />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  )
}

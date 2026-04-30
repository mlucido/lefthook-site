import { useEffect, useRef } from 'react'

export default function ContactSection() {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('split-visible')
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('split-visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="contact-section" id="contact">
      <div ref={titleRef} className="contact-title-wrap">
        <h2 className="contact-title">
          <span className="t-lets">LET'S</span>
          <br />
          <span className="t-talk">TALK</span>
        </h2>
      </div>
      <div className="contact-right reveal">
        <p className="contact-desc">
          Running for public office or advancing a ballot measure? We'd love to hear about your race.
        </p>
        <a href="mailto:info@lefthookcomms.com" className="contact-btn">
          Get in touch
        </a>
      </div>
    </section>
  )
}

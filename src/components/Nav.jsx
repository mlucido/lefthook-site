import { useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const isHome = !!useMatch('/')
  const isAbout = !!useMatch('/about')

  useEffect(() => {
    if (!isHome) return
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const navClass = ['nav', !isHome ? 'always-solid' : scrolled ? 'scrolled' : ''].filter(Boolean).join(' ')

  return (
    <nav className={navClass} id="nav">
      <Link to="/" className="nav-logo">
        <span className="left">LEFT</span>
        <span className="hook">HOOK</span>
      </Link>
      <Link
        to="/about"
        className={`nav-about${isAbout ? ' active' : ''}`}
      >
        About
      </Link>
    </nav>
  )
}

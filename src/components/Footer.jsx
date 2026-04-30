import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-copy">&copy; 2026 Left Hook Communications</div>
      <div className="footer-privacy">
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  )
}

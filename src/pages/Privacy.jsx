import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <>
      <div className="privacy-page">
        <Link to="/" className="privacy-back">&larr; Back to home</Link>
        <h1>PRIVACY POLICY</h1>
        <p className="privacy-updated">Last updated: April 30, 2026</p>

        <p>
          Left Hook Strategy ("Left Hook," "we," "us," or "our") operates the website
          lefthookstrategy.com (the "Site"). This Privacy Policy explains how we collect, use,
          and protect information about visitors to our Site.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          <strong>Personal information you provide:</strong> When you contact us via email or
          contact form, we may collect your name, email address, and any information you choose
          to share about your campaign or organization.
        </p>
        <p>
          <strong>Usage data:</strong> We may automatically collect certain information when you
          visit our Site, including your IP address, browser type, pages visited, time spent on
          pages, and referring URLs. This data is collected through standard web server logs and
          analytics tools.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries and communications</li>
          <li>Provide information about our services</li>
          <li>Improve the content and functionality of our Site</li>
          <li>Understand how visitors use our Site</li>
          <li>Comply with applicable laws and regulations</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>
          We do not sell, trade, rent, or otherwise transfer your personal information to third
          parties. We may share information with trusted service providers who assist us in
          operating our Site, provided those parties agree to keep this information confidential.
          We may also disclose information when required by law or to protect our rights.
        </p>

        <h2>4. Cookies and Tracking</h2>
        <p>
          Our Site may use cookies and similar tracking technologies to enhance your browsing
          experience and analyze Site traffic. Cookies are small files stored on your device
          that help us remember your preferences and understand how you use our Site.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate when a cookie is
          being sent. However, some portions of our Site may not function properly without cookies.
        </p>

        <h2>5. Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information from
          unauthorized access, disclosure, or destruction. However, no method of transmission
          over the Internet or electronic storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal
          information, including the right to access, correct, or delete information we hold
          about you. To exercise these rights, please contact us at{' '}
          <a href="mailto:brandon@lefthookstrategy.com">brandon@lefthookstrategy.com</a>.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by posting the new policy on this page and updating the "Last updated" date. We
          encourage you to review this policy periodically.
        </p>

        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:brandon@lefthookstrategy.com">brandon@lefthookstrategy.com</a>.
        </p>
      </div>
      <Footer />
    </>
  )
}

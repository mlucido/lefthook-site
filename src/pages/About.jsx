import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  useReveal()

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-label">About Left Hook</div>
        <h1 className="about-hero-title">AWARD-WINNING POLITICAL STRATEGY &amp; MEDIA</h1>
      </section>

      <section className="bio-section">
        <div className="bio-photo reveal">
          <img
            className="bio-photo-img"
            src={`${import.meta.env.BASE_URL}assets/brandon_hall.jpg`}
            alt="Brandon Hall, Founder of Left Hook"
          />
        </div>

        <div className="bio-content reveal" style={{ transitionDelay: '0.1s' }}>
          <h2 className="bio-name">BRANDON HALL</h2>
          <div className="bio-role">Founder &amp; Partner</div>

          <div className="bio-text">
            <p>
              Brandon Hall has spent more than 25 years on the front lines of American politics,
              helping win some of the toughest races in the country. In 2010, he managed Senate
              Majority Leader Harry Reid's hard-fought re-election in Nevada—one of the cycle's
              most consequential victories.
            </p>

            <div className="bio-pullquote">
              <blockquote>
                "A top-to-bottom machine that will never be reproduced again in this state —
                research, media relations, rapid response, television ads, voter targeting,
                polling. This campaign left nothing to chance because it knew it couldn't afford to."
              </blockquote>
              <cite>Jon Ralston, Nevada political reporter — on the Reid campaign</cite>
            </div>

            <p>
              Since then, Brandon has become an award-winning strategist and media consultant,
              crafting ad campaigns for Senators Martin Heinrich, Mark Kelly, Jon Tester, and
              other high-profile candidates. He specializes in high-stakes contests across the
              Western United States and has worked on 11 U.S. Senate races, winning 8.
            </p>

            <p>
              Brandon is also the co-founder of Public Land Warriors, built around a simple
              mandate: If you take our land, we take your seat.
            </p>

            <p>Brandon lives in Venice, CA with his partner Jessica and two children, Ollie and Laney.</p>
          </div>
        </div>
      </section>

      <section className="press-section">
        <div className="press-label reveal">What They're Saying</div>
        <div className="press-grid">
          <div className="press-item reveal">
            <p className="press-quote-text">"One of the election's most striking ads."</p>
            <div className="press-source">Politico</div>
          </div>
          <div className="press-item reveal" style={{ transitionDelay: '0.05s' }}>
            <p className="press-quote-text">"A welcome oasis in a sea of mud."</p>
            <div className="press-source">The New York Times</div>
          </div>
          <div className="press-item reveal" style={{ transitionDelay: '0.1s' }}>
            <p className="press-quote-text">
              "The first grand-slam, out of the park, absolutely perfect Democratic campaign ad of the entire year."
            </p>
            <div className="press-source">Rachel Maddow</div>
          </div>
          <div className="press-item reveal" style={{ transitionDelay: '0.15s' }}>
            <p className="press-quote-text">"Powerful, personal video... emotional storytelling."</p>
            <div className="press-source">Adweek</div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </>
  )
}

import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="aboutPage">
      <section className="aboutOne">
        <div className="aboutIntro">
          <h1>Dounts! Dounts everywhere!</h1>
          <p className="aboutLead">
            Shalev&apos;s Bakery is built around simple ingredients, careful craft,
            and a storefront that feels just as refined as what comes out of the oven.
          </p>
        </div>
      </section>

      <section className="aboutStoryGrid">
        <div className="aboutStoryCard">
          <h2>What we believe</h2>
          <p>
            At Shalev&apos;s Bakery, we believe the best bakeries feel effortless:
            warm service, clean presentation, and food that speaks for itself.
          </p>
          <p>
            Our journey began when Shalev turned a love of baking into a place
            people could come back to again and again for their favorite sweet ritual.
          </p>
        </div>

        <div className="aboutStoryCard">
          <h2>Why people return</h2>
          <p>
            We focus on quality ingredients, balanced flavors, and a menu that
            feels playful without losing that premium bakery touch.
          </p>
          <p>
            Donuts are our signature, but the real goal is simple: create a space
            that makes everyday cravings feel a little more special.
          </p>
        </div>
      </section>

              <section className="aboutDetailsPanel">
        <div className="aboutDetailsText">
          <span className="aboutEyebrow">Behind the project</span>
          <h2>Built from frontend to backend.</h2>
          <p>
            This full-stack web application was built using React,
            TypeScript, Node.js, Express, and MySQL. It combines a
            responsive storefront with backend services for product
            management, authentication, and orders.
          </p>

          <div className="aboutRepositories">
            <span className="contactLabel">Explore the code</span>
            <a
              href="https://github.com/shalevp-1/Donuts_front"
              target="_blank"
              rel="noreferrer"
            >
              Frontend Repository
              <span aria-hidden="true"> ↗</span>
            </a>
            <a
              href="https://github.com/shalevp-1/Donuts_Backend"
              target="_blank"
              rel="noreferrer"
            >
              Backend Repository
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <div className="contactInfo">
          <span className="aboutEyebrow">Get in touch</span>

          <div className="contactItem">
            <span className="contactLabel">Business</span>
            <strong>Shalev&apos;s Bakery</strong>
          </div>

          <div className="contactItem">
            <span className="contactLabel">Phone</span>
            <a href="tel:+972502336023">050-233-6023</a>
          </div>

          <div className="contactItem">
            <span className="contactLabel">Email</span>
            <a href="mailto:Shalevpecksp@hotmail.com">
              Shalevpecksp@hotmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

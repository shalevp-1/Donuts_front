import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll('.revealOnScroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('isVisible');
          }
        });
      },
      { threshold: 0.22 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className='homePage'>
      <section className='homeHero'>
        <div className='homeHeroCopy'>
          <h1>Donuts that look as good as they taste!</h1>
          <p className='homeLead'>
             warm and fresh, just like you like them.
          </p>
          <div className='homeActions'>
            <Link to='/donuts' className='primaryHomeAction'>Browse Donuts</Link>
            <Link to='/aboutus' className='secondaryHomeAction'>About The Bakery</Link>
          </div>
        </div>
        <div className='homeHeroVisual'>
          <img
            src="https://as2.ftcdn.net/v2/jpg/01/76/75/93/1000_F_176759374_kcm45VGAkoqILGSAwE8mhTbn3IuaoB8P.jpg"
            alt="Assorted donuts on display"
            className="homeHeroImage"
          />
          <div className='heroGlassCard'>
            <strong>Freshly glazed favorites</strong>
            <p>Light, smooth, and easier on the eyes.</p>
          </div>
        </div>
      </section>

      <section className='specialsSection revealOnScroll'>
        <div className='sectionHeading'>
          <h2>Today&apos;s specials</h2>
          <p>Two flavors worth noticing first, with more waiting further down.</p>
        </div>

        <div className='specialsGrid'>
          <Link to='/donuts' className='specialCard'>
            <img
              src='https://www.thecomfortofcooking.com/wp-content/uploads/2014/06/1.jpg'
              alt='Lemon Poppyseed Donut'
              className='specialImage'
            />
            <div className='specialCopy'>
              <h3>Lemon Poppyseed Donut</h3>
              <p>Fresh citrus notes with a clean finish and soft bakery texture.</p>
            </div>
          </Link>

          <Link to='/donuts' className='specialCard'>
            <img
              src='https://betterwithcake.com/wp-content/uploads/IMG_6551....jpg'
              alt='Strawberry Cream Donut'
              className='specialImage'
            />
            <div className='specialCopy'>
              <h3>Strawberry Cream Donut</h3>
              <p>A sweeter, creamier choice for anyone chasing dessert-first energy.</p>
            </div>
          </Link>
        </div>
      </section>

      <section className='storySection revealOnScroll'>
        <div className='storyVisual'>
          <img
            src='https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
            alt='Fresh donuts on a bakery counter'
            className='storyImage'
          />
        </div>
        <div className='storyCopy'>
          <h2>Donuts that feel like a treat, not a rush.</h2>
          <p>
            Instead of a busy, crowded design, we went for more space and a calmer vibe that lets the food speak for itself.
          </p>
          <p>
            Fresh, simple, and just a little bit elevated — the way a good bakery should feel
          </p>
        </div>
      </section>

      <section className='storySection reverse revealOnScroll'>
        <div className='storyVisual'>
          <img
            src='https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80'
            alt='Box of colorful donuts'
            className='storyImage'
          />
        </div>
        <div className='storyCopy'>
          <h2>Home made quality with a polished presentation.</h2>
          <p>
           A taste that will remind you of the best local spots, with a look that feels just as good as what comes out of the oven.
          </p>
          <p>
            That gives the bakery more personality while keeping the polished feel.
          </p>
        </div>
      </section>

      <section className='homePromo revealOnScroll'>
        <div>
          <h2>See every donut in our Gallery!</h2>
        </div>
        <Link to='/donuts' className='promoLink'>Open donuts page</Link>
      </section>
    </div>
  );
}

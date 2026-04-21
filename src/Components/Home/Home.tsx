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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className='homePage'>
      <div className='homeBackdrop' aria-hidden='true' />

      <section className='homeOne'>
        <div className='homeOneCard'>
          <div className='homeOneCopy'>
            <p className='homeOneTitle'>Daily fresh donuts</p>
            <h1>Donuts that look as good as they taste.</h1>
            <p className='homeLead'>
              Fresh favorites, bright flavors, and a cleaner bakery feel built around the donuts themselves.
            </p>
            <div className='homeActions'>
              <Link to='/donuts' className='primaryHomeAction homeBrowseAction'>Browse Donuts</Link>
              <Link to='/aboutus' className='secondaryHomeAction'>About The Bakery</Link>
            </div>
          </div>
        </div>
      </section>

      <section className='specialsSection revealOnScroll'>
        <div className='sectionHeading'>
          <h2>Today&apos;s specials</h2>
        </div>

        <div className='specialsGrid'>
          <article className='specialCard'>
            <Link to='/donuts' className='specialImageLink' aria-label='View Lemon Poppyseed Donut'>
              <img
                src='https://www.thecomfortofcooking.com/wp-content/uploads/2014/06/1.jpg'
                alt='Lemon Poppyseed Donut'
                className='specialImage'
              />
            </Link>
            <div className='specialCopy'>
              <h3>Lemon Poppyseed Donut</h3>
              <p>Fresh citrus notes with a clean finish and soft bakery texture.</p>
            </div>
          </article>

          <article className='specialCard'>
            <Link to='/donuts' className='specialImageLink' aria-label='View Strawberry Cream Donut'>
              <img
                src='https://betterwithcake.com/wp-content/uploads/IMG_6551....jpg'
                alt='Strawberry Cream Donut'
                className='specialImage'
              />
            </Link>
            <div className='specialCopy'>
              <h3>Strawberry Cream Donut</h3>
              <p>A sweeter, creamier choice for anyone chasing dessert-first energy.</p>
            </div>
          </article>
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

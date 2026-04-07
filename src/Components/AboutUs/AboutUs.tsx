
import React from 'react';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="aboutPage">
      <section className="aboutHero">
        <div className="aboutIntro">
          <h1>Dounts! Dounts everywhere!</h1>
          <p className="aboutLead">
            Shalev&apos;s Bakery is built around simple ingredients, careful craft,
            and a storefront that feels just as refined as what comes out of the oven.
          </p>
        </div>
        <div className="aboutHeroImageWrap">
          <img src="https://i.insider.com/5ba398469c888d0f2c8b4567?width=700" alt="Bakery Interior" className="aboutHeroImage" />
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
          <p>
            This site uses React, TypeScript, and a Node/Express backend MySQL database 
          </p>
        </div>
        <div className="contactInfo">
          <div>
            <strong>Shalev Bakery</strong>
          </div>
          <div>
            <strong>(050) 233-6023</strong>
          </div>
        </div>
      </section>
    </div>
  )};



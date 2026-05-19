'use client';
import TodaysEvents from './TodaysEvents';
import FeaturedEvents from './FeaturedEvents';

export default function Events() {


  return (
    <section className="mb-10 mt-10">
      <TodaysEvents />
      <FeaturedEvents />
    </section>
  );
}
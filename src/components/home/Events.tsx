'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

import TodaysEvents from './TodaysEvents';
import FeaturedEvents from './FeaturedEvents';

export default function Events() {


  return (
    <section className="mb-10 mt-10">
      <TodaysEvents />
      <FeaturedEvents />
      <div className="flex justify-center mt-12">
        <Link
          href="/events"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>View All Events</span>
          <FaArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </section>
  );
}
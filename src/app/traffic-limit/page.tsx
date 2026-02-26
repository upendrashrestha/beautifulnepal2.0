"use client";

import { useEffect, useState } from "react";

function getNextMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
}

function getTimeRemaining(target: Date) {
  const total = target.getTime() - new Date().getTime();

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { total, days, hours, minutes, seconds };
}

export default function TrafficLimitPage() {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeRemaining(getNextMonthStart())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(getNextMonthStart()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          🚦 Traffic Is Higher Than Usual
        </h1>

        <p className="text-gray-300 mb-6">
          We’re currently experiencing very high traffic and have temporarily
          reached our content delivery limit.
        </p>

        <p className="text-gray-400 mb-8">
          Our content quota resets at the beginning of next month.
          Please check back soon — we’ll be fully operational again.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Time Until Reset
          </h2>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-sm text-gray-400">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm text-gray-400">Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-400">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-400">Seconds</div>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Thank you for your patience 💛
        </p>
      </div>
    </div>
  );
}
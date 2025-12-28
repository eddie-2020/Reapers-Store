// components/CountdownBanner.jsx
import { useState, useEffect } from 'react';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-700 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="bg-white/20 p-1 rounded-full">
            ⏰
          </span>
          <span className="text-sm font-medium">
            Flash Sale Ends In:
          </span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm font-mono">
          <div className="text-center">
            <div className="bg-white/20 px-2 py-1 rounded font-bold">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs opacity-80">HRS</div>
          </div>
          <div>:</div>
          <div className="text-center">
            <div className="bg-white/20 px-2 py-1 rounded font-bold">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs opacity-80">MIN</div>
          </div>
          <div>:</div>
          <div className="text-center">
            <div className="bg-white/20 px-2 py-1 rounded font-bold">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs opacity-80">SEC</div>
          </div>
        </div>

        <button className="text-sm bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
}
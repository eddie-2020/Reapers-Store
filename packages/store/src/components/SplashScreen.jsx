import { useState, useEffect } from 'react';
import logo from '../assets/logo2.png';

export default function SplashScreen({ onFinish }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar over 2.5 seconds
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 2; // Increment by 2 every 50ms -> 100 in 2.5s
            });
        }, 40);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => {
            clearInterval(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center w-screen h-screen">
            <div className="mb-8 flex flex-col items-center">
                <img src={logo} alt="REAPERS" className="h-32 md:h-64 object-contain" />
                <p className="text-gray-500 text-sm tracking-widest text-center mt-0 uppercase">
                    Premium Fashion
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gray-900 transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-500 min-w-[3ch]">
                    {progress}%
                </span>
            </div>
        </div>
    );
}

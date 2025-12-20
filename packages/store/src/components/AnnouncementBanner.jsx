import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AnimatedBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const bannerRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/core/announcements/');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleMouseEnter = () => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Use Web Animations API to smoothly change speed
    const animations = banner.getAnimations();
    if (animations.length > 0) {
      animations[0].updatePlaybackRate(0.2); // Slow down to 20% speed
    }
  };

  const handleMouseLeave = () => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Return to normal speed
    const animations = banner.getAnimations();
    if (animations.length > 0) {
      animations[0].updatePlaybackRate(1);
    }
  };

  if (loading || announcements.length === 0) return null;

  // Create the base string with unique separator and extra spacing
  const separator = '   \u00A0\u00A0✦\u00A0\u00A0   ';
  const text = announcements.map(a => a.text).join(separator) + separator;

  // Repeat the text to ensure it's long enough for smooth scrolling on large screens.
  // We want at least enough content to fill ~2-3x the screen width to be safe.
  // Heuristic: Ensure roughly 200 characters or repeats.
  const idealLength = 200;
  const repeatCount = Math.ceil(idealLength / text.length) || 1;
  const content = text.repeat(repeatCount); // This is ONE "unit"

  // We need TWO units for the seamless 0 -> -50% animation.
  // The animation moves the container by -50%, which corresponds to one full "content" width.

  // Calculate duration for consistent speed.
  // Base speed: e.g., 5 seconds for 100 characters.
  const speedFactor = 0.1; // seconds per character
  const duration = content.length * speedFactor;

  return (
    <div className="bg-linear-to-r from-rose-500 to-pink-600 text-white py-3 overflow-hidden relative">
      <div
        ref={bannerRef}
        className="animate-marquee whitespace-nowrap inline-block"
        style={{ animationDuration: `${Math.max(duration, 10)}s` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="mx-0">{content}</span>
        <span className="mx-0">{content}</span>
      </div>
    </div>
  );
}
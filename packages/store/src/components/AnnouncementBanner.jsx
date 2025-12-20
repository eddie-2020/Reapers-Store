import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AnimatedBanner() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const bannerRef = useRef(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/core/announcements/`);
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


        const animations = banner.getAnimations();
        if (animations.length > 0) {
            animations[0].updatePlaybackRate(0.2);
        }
    };

    const handleMouseLeave = () => {
        const banner = bannerRef.current;
        if (!banner) return;


        const animations = banner.getAnimations();
        if (animations.length > 0) {
            animations[0].updatePlaybackRate(1);
        }
    };

    if (loading || announcements.length === 0) return null;

    const separator = '   \u00A0\u00A0✦\u00A0\u00A0   ';
    const text = announcements.map(a => a.text).join(separator) + separator;

    const idealLength = 200;
    const repeatCount = Math.ceil(idealLength / text.length) || 1;
    const content = text.repeat(repeatCount);

    const speedFactor = 0.1;
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
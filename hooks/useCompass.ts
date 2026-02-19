import { useState, useEffect } from 'react';

export const useCompass = () => {
    const [heading, setHeading] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            let compass = 0;
            // iOS
            if ((event as any).webkitCompassHeading) {
                compass = (event as any).webkitCompassHeading;
            }
            // Android / Non-iOS
            else if (event.alpha) {
                compass = 360 - event.alpha;
            }

            setHeading(compass);
        };

        if (window.DeviceOrientationEvent) {
            // Listener
            window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
            setError('Device orientation not supported');
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return { heading, error };
};

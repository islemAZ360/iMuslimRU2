import { useState, useEffect } from 'react';

export const useCompassHeading = () => {
    const [heading, setHeading] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            let newHeading = 0;

            // key fix here: cast to any because webkitCompassHeading is non-standard
            const e = event as any;

            if (e.webkitCompassHeading) {
                // iOS
                newHeading = e.webkitCompassHeading;
            } else if (event.alpha) {
                // Android / Non-iOS
                // alpha is 0 when pointing North in some implementations, but generally:
                // We need to invert it for CSS rotation to match compass behavior (0 is North)
                // Actually, for compass map, 0 should be North.
                // device orientation 'alpha' is counter-clockwise?
                // Standard: alpha enters 0 at North.
                newHeading = 360 - event.alpha;
            }

            setHeading(newHeading);
        };

        const startCompass = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const response = await (DeviceOrientationEvent as any).requestPermission();
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        setError('Permission denied');
                    }
                } catch (e) {
                    setError('Error requesting permission');
                }
            } else {
                window.addEventListener('deviceorientation', handleOrientation, true);
            }
        };

        startCompass();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return { heading, error };
};

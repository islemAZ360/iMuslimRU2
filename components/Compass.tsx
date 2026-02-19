import * as React from 'react';

interface CompassProps {
    heading: number;
    qiblaDirection: number | null;
    distanceToKaaba: string;
}

const Compass: React.FC<CompassProps> = ({ heading, qiblaDirection, distanceToKaaba }) => {
    // Determine the needle rotation. 
    // IF the dial rotates by {-heading}, then North is at -heading.
    // Qibla is at {qiblaDirection} relative to North.
    // So Qibla relative to screen top is {qiblaDirection - heading}.
    // We rotate the needle wrapper to this angle.
    const needleRotation = (qiblaDirection || 0) - heading;

    return (
        <div className="relative flex flex-col items-center">
            {/* Outer Decorative Container */}
            <div className="relative rounded-full p-2 bg-gradient-to-br from-[#8A6E24] via-[#D4AF37] to-[#5c4008] shadow-2xl">
                <div className="bg-[#050301] p-1 rounded-full">

                    {/* THE COMPASS */}
                    <div className="relative size-72 sm:size-80 flex items-center justify-center rounded-full ancient-compass-rim overflow-hidden">

                        {/* The Rotating Dial (Simulates the plate rotating with Heading) */}
                        {/* If heading is 0 (North), dial is 0. If facing East (90), dial rotates -90 so North on dial is at 12 o'clock relative to world, but 9 o'clock relative to phone top. Wait.
                           Standard phone compass: top of phone is heading.
                           If I face East (90), I want 'E' at top. 
                           So dial should rotate -90. 'N' will be at Left.
                           Correct.
                        */}
                        <div
                            className="absolute inset-0 rounded-full ancient-dial-plate transition-transform duration-500 ease-out will-change-transform"
                            style={{ transform: `rotate(${-heading}deg)` }}
                        >
                            {/* Degree Markings (simplified) */}
                            <div className="absolute inset-2 border border-white/5 rounded-full opacity-30"></div>

                            {/* Qibla Indicator ON THE DIAL */}
                            {/* This is fixed at the Qibla angle relative to North */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ transform: `rotate(${qiblaDirection || 0}deg)` }}
                            >
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                                    {/* Kaaba Icon - now distinct */}
                                    <div className="kaaba-icon-css transform scale-75"></div>
                                    <div className="text-[8px] text-gold font-bold mt-1 tracking-widest uppercase">Qibla</div>
                                </div>
                            </div>

                            {/* Cardinal Points */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="absolute top-4 font-royal font-bold text-xl text-[#F9E496] drop-shadow-lg">N</span>
                                <span className="absolute bottom-4 font-royal text-sm text-[#8A6E24]">S</span>
                                <span className="absolute left-4 font-mono text-sm text-[#8A6E24]">W</span>
                                <span className="absolute right-4 font-mono text-sm text-[#8A6E24]">E</span>
                            </div>
                        </div>

                        {/* Center decorative hub */}
                        <div className="absolute size-20 rounded-full bg-gradient-to-br from-[#5c4008] to-[#1a1205] border-[4px] border-[#8A6E24] shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30 flex items-center justify-center">
                            <div className="size-8 rounded-full bg-[#050301] shadow-inner flex items-center justify-center">
                                <div className="size-2 bg-gold rounded-full shadow-[0_0_8px_#D4AF37]"></div>
                            </div>
                        </div>

                        {/* The Needle (Points to Qibla) */}
                        <div
                            className="absolute inset-0 z-40 pointer-events-none compass-needle-wrapper transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
                            style={{ transform: `rotate(${needleRotation}deg)` }}
                        >
                            {/* North/Qibla Needle Tip */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 h-1/2 w-6 flex flex-col items-center justify-start">
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[45px] border-b-[#8B0000] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></div>
                                <div className="w-[2px] h-full bg-[#8B0000] opacity-80"></div>
                            </div>
                            {/* Counterweight */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-1/2 w-6 flex flex-col items-center justify-end opacity-40">
                                <div className="w-[2px] h-full bg-white opacity-50"></div>
                                <div className="size-3 rounded-full bg-white"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Info Text */}
            <div className="mt-6 flex flex-col items-center gap-1">
                <h3 className="text-xl font-royal font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E496]">
                    {qiblaDirection?.toFixed(0)}° Qibla
                </h3>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1a1505] rounded-full border border-[#8A6E24]/30 shadow-inner">
                    <span className="material-symbols-outlined text-[12px] text-[#8A6E24]">near_me</span>
                    <span className="text-[10px] text-[#8A6E24] uppercase tracking-widest font-bold">
                        {distanceToKaaba} KM
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Compass;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#10B981", // Emerald 500
                "emerald": {
                    DEFAULT: "#046b46",
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                    950: "#022c22",
                    deep: "#064e3b",
                    royal: "#0B3B2D",
                    black: "#020f0a",
                    light: "#0f966a",
                    glow: "#00ff9d"
                },
                "gold": {
                    DEFAULT: "#D4AF37",
                    50: "#fefce8",
                    100: "#fef9c3",
                    200: "#fde047",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                    950: "#451a03",
                    light: "#F9E496",
                    dim: "#aa8c2c",
                    dark: "#8A6E24",
                    metallic: "#C5A059"
                },
                "luxury-black": "#020402",
                "brass": "#B5A642",
            },
            fontFamily: {
                display: ["Cinzel", "serif"],
                royal: ["Cinzel", "serif"],
                sans: ["Manrope", "sans-serif"],
                serif: ["Playfair Display", "serif"],
                arabic: ["Amiri", "serif"],
            },
            backgroundImage: {
                'luxury-gradient': 'linear-gradient(180deg, #022c1e 0%, #00120b 40%, #000000 100%)',
                'gold-metallic': 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa8c2c 100%)',
                'gold-foil': "linear-gradient(45deg, #C5A059 0%, #FFD700 20%, #FDB931 40%, #C5A059 60%, #FFD700 80%, #C5A059 100%)",
            },
            boxShadow: {
                'gold-glow': '0 0 16px rgba(212, 175, 55, 0.2)',
                'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.15)',
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'spin-reverse-slow': 'spin-reverse 15s linear infinite',
                'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float-particle': 'float 10s ease-in-out infinite',
                'scan': 'scan 2s ease-in-out infinite',
                'shimmer-border': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'spin-reverse': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(-360deg)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 14px rgba(234,179,8,0.3)' },
                    '50%': { opacity: '.9', boxShadow: '0 0 8px rgba(234,179,8,0.15)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
                    '50%': { transform: 'translateY(-20px) translateX(10px)', opacity: '0.8' },
                },
                'scan': {
                    '0%': { top: '0%', opacity: '0' },
                    '20%': { opacity: '1' },
                    '80%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                }
            }
        }
    },
    plugins: [],
}
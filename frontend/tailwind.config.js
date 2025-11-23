/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neo-bg': '#FFDEE9', // Soft pink gradient start
                'neo-bg-2': '#B5FFFC', // Soft blue gradient end
                'neo-black': '#000000',
                'neo-white': '#FFFFFF',
                'neo-primary': '#FF90E8', // Hot Pink
                'neo-secondary': '#23A6F0', // Bright Blue
                'neo-accent': '#FFC900', // Bright Yellow
                'neo-green': '#3BF6FF', // Cyan/Green
                'neo-purple': '#9D4EDD',
            },
            boxShadow: {
                'neo': '8px 8px 0px 0px #000000',
                'neo-sm': '4px 4px 0px 0px #000000',
                'neo-lg': '12px 12px 0px 0px #000000',
                'neo-hover': '10px 10px 0px 0px #000000',
            },
            borderWidth: {
                '3': '3px',
                '5': '5px',
            },
            fontFamily: {
                'mono': ['"Space Mono"', 'monospace'],
                'sans': ['"Outfit"', 'sans-serif'],
                'display': ['"Black Ops One"', 'cursive'], // Adding a display font if needed, or just stick to heavy weights
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
            }
        },
    },
    plugins: [],
}

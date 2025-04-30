import { Config } from "tailwindcss"

/** @type {import('tailwindcss').Config} */
const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },

            colors: {
                'bg': '#202020',
                'bg-dark': '#191919',
                'bg-light': "#2D2D2D",
                'hl': '#3D3D3D',
                'hl-dark': '#474747',
                'white': '#D3D3D3',
                'semantic-red': "#F64646",
                'semantic-green': "#6BDF85",
            },
            fontSize: {
                xs: '1.083rem',
                sm: '1rem',
                base: '1.167rem',
                md: '1.5rem',
                'lg': '3rem',
                'xl': '4.5rem',
            },
            gridTemplateColumns: {
                'auto-fill': "repeat(auto-fill, minmax(150px, 1fr))",
            }
        },
        plugins: [],
    }
};

export default config;

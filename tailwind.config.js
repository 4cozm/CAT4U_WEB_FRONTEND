/** @type {import('tailwindcss').Config} */
export const content = ['./app/**/*.{js,jsx,mdx}', './components/**/*.{js,jsx,mdx}'];
export const theme = {
    extend: {
        colors: {
            background: '#f5f7fb',
            primary: '#0a84ff', // iOS Blue
            secondary: '#34c759', // iOS Green
            accent: '#ff9f0a', // iOS Orange
            text: '#0b1220',
            muted: '#6b7280',
        },
        boxShadow: {
            neu: '0 1px 0 rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.06)',
            neuinset: 'inset 0 1px 3px rgba(0,0,0,0.08)',
        },
    },
};
export const plugins = [
    function ({ addUtilities }) {
        addUtilities({
            '.glass': {
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 1px 0 rgba(0,0,0,0.03), 0 12px 30px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(20px)',
            },
            '.glass-strong': {
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.6)',
                backdropFilter: 'blur(24px)',
            },
        });
    },
];

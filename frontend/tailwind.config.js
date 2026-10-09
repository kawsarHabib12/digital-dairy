/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4ECE0',
          300: '#EADBC6',
          400: '#DCC3A4',
          500: '#C7A780',
          600: '#A8855F',
          700: '#8A6A4B',
          800: '#6C5139',
          900: '#4D3827',
        },
        diary: {
          cream: '#FAF7F2',
          paper: '#FFFFFF',
          ink: '#1F1E1D',
          muted: '#686561',
          border: '#E8E2D8',
          accent: '#A85A32',
          gold: '#D97706',
        },
        mood: {
          happy: '#F59E0B',
          sad: '#64748B',
          excited: '#F43F5E',
          calm: '#10B981',
          angry: '#EF4444',
          nostalgic: '#8B5CF6',
          grateful: '#059669',
          neutral: '#78716C',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Lora', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'diary': '0 4px 20px -2px rgba(45, 35, 20, 0.05), 0 2px 6px -1px rgba(45, 35, 20, 0.03)',
        'diary-lg': '0 10px 30px -4px rgba(45, 35, 20, 0.08), 0 4px 12px -2px rgba(45, 35, 20, 0.04)',
      }
    },
  },
  plugins: [],
}

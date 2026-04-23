/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        writespace: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#4c6ef5',
          700: '#4263eb',
          800: '#3b5bdb',
          900: '#364fc7',
          950: '#2b3fa0',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          850: '#303030',
          900: '#212121',
          950: '#121212',
        },
        accent: {
          green: '#51cf66',
          red: '#ff6b6b',
          amber: '#fcc419',
          teal: '#20c997',
        },
      },
      backgroundImage: {
        'gradient-writespace': 'linear-gradient(135deg, #4c6ef5 0%, #5c7cfa 50%, #748ffc 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2b3fa0 0%, #364fc7 50%, #3b5bdb 100%)',
        'gradient-surface': 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
        'gradient-surface-dark': 'linear-gradient(180deg, #212121 0%, #121212 100%)',
        'gradient-hero': 'linear-gradient(135deg, #4c6ef5 0%, #20c997 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'editor': ['1.125rem', { lineHeight: '1.8' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        'editor': '720px',
        'content': '960px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        'focus-ring': '0 0 0 3px rgba(76, 110, 245, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '720px',
            color: '#424242',
            a: {
              color: '#4c6ef5',
              '&:hover': {
                color: '#4263eb',
              },
            },
            h1: {
              fontFamily: 'Merriweather, Georgia, serif',
            },
            h2: {
              fontFamily: 'Merriweather, Georgia, serif',
            },
            h3: {
              fontFamily: 'Merriweather, Georgia, serif',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
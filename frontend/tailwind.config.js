/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'all': 'all',
        'opacity-transform': 'opacity, transform',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' }
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in'
      },

      colors: {
        text: '#8794a1',
        accent: '#4db2ff',
        dropdown: '#dde4eb',
        'dropdown-bg': '#2e3a47',
        'dropdown-hover': '#384553',
        'dropdown-secondary': '#8c9aa9',
        article: '#fff',
        field: '#fff',
        'field-bg': '#242e38',
        'field-placeholder': '#8a98a6',
        'field-accent': '#248bda',
        btn: {
          primary: '#fff',
          'primary-bg': 'rgb(36, 139, 218)',
          'primary-hover': '#207cc2',
          default: '#fff',
          'default-bg': '#242e38',
          'default-hover': '#293440',
        },
        table: {
          bg: 'rgb(33, 42, 51)',
          header: '#293440',
          hover: '#293440',
          text: '#8c9aa9',
        },
        footer: {
          bg: '#111417',
        },
        bg: {
          DEFAULT: 'rgb(26, 32, 38)',
          hover: '#212a33',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        min: '3px',
        popup: '12px',
      },
      transitionDuration: {
        DEFAULT: '0.2s',
      },
    },
  },
  plugins: [],
};
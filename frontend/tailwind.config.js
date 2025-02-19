/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Паттерны для динамических классов
    { pattern: /bg-(dark|lavender)-(bg|text|accent|dropdown|dropdown-bg|dropdown-hover|dropdown-secondary|article|field|field-bg|field-placeholder|field-accent|btn-primary-bg|btn-primary-hover|btn-default-bg|btn-default-hover|table-bg|table-header|table-hover|table-text|footer-bg)/ },
    { pattern: /text-(dark|lavender)-(text|accent|rich-text)/ },
    { pattern: /border-(dark|lavander)-border/ },
    { pattern: /hover:bg-(dark|lavender)-(btn-primary-bg|btn-primary-hover|btn-default-bg|btn-default-hover|table-bg|table-header|table-hover|table-text)/ },
    { pattern: /hover:text-(dark|lavender)-(text|accent|rich-text)/ },
  ],
  theme: {
    extend: {
      transitionProperty: {
        'all': 'all',
        'opacity-transform': 'opacity, transform',
        '200': '200ms'
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
        dark: {
          text: '#a8b3bd',
          'rich-text': '#e4e4e4',
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
          border: {
            DEFAULT: '#293440',
          },
          footer: {
            bg: '#111417',
          },
          bg: {
            DEFAULT: 'rgb(26, 32, 38)',
            hover: '#212a33',
          },
        },
        lavender: {
          text: '#525252', // Темно-серый текст
          'rich-text': '#1c1c1c',
          accent: '#b8c0ff', // Мягкий лавандовый акцент
          dropdown: '#fafafa', // Очень светлый фон выпадающего меню
          'dropdown-bg': '#eaeaea', // Матовый серый фон выпадающего меню
          'dropdown-hover': '#dcdcdc', // Наведение на элемент выпадающего меню
          'dropdown-secondary': '#a0aec0', // Вторичный цвет для выпадающего меню
          article: '#ffffff', // Белый фон для статей
          field: '#ffffff', // Белый фон для полей ввода
          'field-bg': '#f6f6f6', // Очень светлый фон для полей ввода
          'field-placeholder': '#a0aec0', // Цвет плейсхолдера
          'field-accent': '#b8c0ff', // Акцент для полей ввода
          btn: {
            primary: '#ffffff', // Белый текст кнопки
            'primary-bg': '#b8c0ff', // Лавандовый фон основной кнопки
            'primary-hover': '#a3b1ff', // Наведение на основную кнопку
            default: '#525252', // Темно-серый текст кнопки по умолчанию
            'default-bg': '#fafafa', // Очень светлый фон кнопки по умолчанию
            'default-hover': '#eaeaea', // Наведение на кнопку по умолчанию
          },
          table: {
            bg: '#fafafa', // Фон таблицы
            header: '#f3f3f3', // Фон заголовка таблицы
            hover: '#eaeaea', // Наведение на строку таблицы
            text: '#718096', // Цвет текста в таблице
          },
          footer: {
            bg: '#fafafa', // Фон футера
          },
          bg: {
            DEFAULT: '#ffffff', // Основной фон страницы
            hover: '#fafafa', // Наведение на элементы фона
          },
          border: {
            DEFAULT: '#2363a8',
          },
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
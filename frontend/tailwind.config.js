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
          text: '#525252',                      // Темно-серый текст
          'text-rich': '#1c1c1c',
          accent: '#7885e6',                    // Мягкий лавандовый акцент
          dropdown: '#fafafa',                  // Очень светлый фон выпадающего меню
          'dropdown-bg': '#eaeaea',             // Матовый серый фон выпадающего меню
          'dropdown-hover': '#dcdcdc',          // Наведение на элемент выпадающего меню
          'dropdown-secondary': '#a0aec0',      // Вторичный цвет для выпадающего меню
          article: '#ffffff',                   // Белый фон для статей
          field: '#ffffff',                     // Белый фон для полей ввода
          'field-bg': '#f6f6f6',                // Очень светлый фон для полей ввода
          'field-placeholder': '#a0aec0',       // Цвет плейсхолдера
          'field-accent': '#b8c0ff',            // Акцент для полей ввода
          btn: {
            primary: '#ffffff',                 // Белый текст кнопки
            'primary-bg': '#b8c0ff',            // Лавандовый фон основной кнопки
            'primary-hover': '#a3b1ff',         // Наведение на основную кнопку
            default: '#525252',                 // Темно-серый текст кнопки по умолчанию
            'default-bg': '#fafafa',            // Очень светлый фон кнопки по умолчанию
            'default-hover': '#eaeaea',         // Наведение на кнопку по умолчанию
          },
          table: {
            bg: '#fafafa',                      // Фон таблицы
            header: '#f3f3f3',                  // Фон заголовка таблицы
            hover: '#eaeaea',                   // Наведение на строку таблицы
            text: '#718096',                    // Цвет текста в таблице
          },
          footer: {
            bg: '#f1f1f4',                      // Фон футера
          },
          bg: {
            DEFAULT: '#ffffff',                 // Основной фон страницы
            hover: '#fafafa',                   // Наведение на элементы фона
          },
          border: {
            DEFAULT: '#2363a8',
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
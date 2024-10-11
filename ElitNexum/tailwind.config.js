const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, 
  theme: {
    extend: {
      colors: {
        violet: '#6D33A6', // Roxo
        deepviolet: '#3C308C', // Roxo Escuro
        darkestviolet: '#201E59', // Roxo super escuro
        ultradeepviolet: '#1A1840', // Roxo ultra escuro
        blackelit: '#252525', // Preto
        deepgrayelit: '#505050', // Cinza escuro
        grayelit: '#B5B5B5', // Cinza
        lightgray: '#E1E1E1', // Cinza claro
        whiteelit: '#F4F4F4', // Branco
        yellowstar: '#F28B0C', // Amarelo da estrela
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        inconsolata: ['Inconsolata', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(290px, 1fr))',
      },
      spacing: {
        chat: '88vh',
        fullscreen: '80vh',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          'scrollbar-width': 'none',         // Firefox
          '-ms-overflow-style': 'none',      // IE 10+
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none'                    // Chrome, Safari
        }
      });
    }
  ]
};

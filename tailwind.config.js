module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "danger-red": "#FF3030",
        // "theme-green": "#30FF83",
        // "theme-color": "#F8F0FB",
        "theme-color": "#08415C",
        // "theme-color": "#75B8C8",
        // "theme-color": "#EEE5E9",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

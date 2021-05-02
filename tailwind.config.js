module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        colors: {
            'danger-red': '#FF3030',
            'theme-green': '#30FF83'
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}

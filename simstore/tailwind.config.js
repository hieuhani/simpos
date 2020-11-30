module.exports = {
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      'primary-1': '#5533EA',
      'primary-2': '#4426CA',
      accent: '#EC456B',
      'neutral-1': '#FFFFFF',
      'neutral-2': '#858B9A',
      'neutral-3': '#636A79',
      'neutral-4': '#5D5F69',
      'semantic-1': '#F8C734',
      'semantic-2': '#714FF0',
      'semantic-3': '#1AB4E3',
      'semantic-4': '#27CC69',
      'background-1': '#131417',
      'background-2': '#212227',
      'background-3': '#2B2C32',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

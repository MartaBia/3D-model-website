import autoprefixer from 'autoprefixer';

const isDev = process.env.HUGO_ENVIRONMENT === 'development';

export default {
  plugins: [
    !isDev ? autoprefixer : null
  ],
  map: isDev ? { inline: true } : false
};
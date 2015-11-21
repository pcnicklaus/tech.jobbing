module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'my-precious',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mean-social-token-auth',
  SALT_WORK_FACTOR: 2,
  GITHUB_SECRET: process.env.GITHUB_SECRET || '5d78a50fc94f603fea3e5e3b4da5f7f2afacb5bc',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'RaP6OLELTChynVp2UrIhVqbP',
  INSTAGRAM_SECRET: process.env.INSTAGRAM_SECRET || '',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '66b0a69af945182a601f8e0e311217e6',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'Ah5ZM7ZJ5I2fOq0Hrvrf7tXBdLFqoQpkf466vrDZG3fGip3FLj'
};

const config = require('./config');
const { omit, assign } = require ('lodash');

module.exports = assign(omit(config, 'externals'), {
  entry: {
    index: ['./webpack/test.js'],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: 'webpack',
    hotOnly: true,
    port: 3000
  },
});

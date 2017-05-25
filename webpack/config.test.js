const config = require('./config.test.browser');
const { omit, assign } = require('lodash');
const webpack = require('webpack');

module.exports = assign(omit(config, 'entry'), {
  target: 'node',
  devServer: omit(config.devServer, 'host', 'port'),
  devtool: 'source-map',
  plugins: config.plugins.concat(new webpack.DefinePlugin({
    'window': 'global'
  })),
  output: {
    devtoolModuleFilenameTemplate:         '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
});

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: ['./src/index.ts'],
  },
  output: {
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve('./src'), path.resolve('.'), 'node_modules']
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        declaration: true
      }
    }],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devtool: 'cheap-module-eval-source-map'
};

const path = require('path');
const webpack = require('webpack');

function absPath(filePath) {
  return path.join(__dirname, '../', filePath)
}

module.exports = {
  entry: {
    index: ['src/index.ts'],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      absPath('src'),
      absPath('.'),
      "node_modules"
    ]
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

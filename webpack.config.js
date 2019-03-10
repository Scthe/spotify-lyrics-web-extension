const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    popup: './src/popup.js',
  },

  output: {
    path: path.join(path.resolve(__dirname), 'extension', 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/, },
      { test: /\.svg$/, use: ['svg-inline-loader'], exclude: /node_modules/, },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
    alias: {
      images: path.resolve( __dirname, 'extension', 'images' ),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  devtool: 'sourcemap',
};

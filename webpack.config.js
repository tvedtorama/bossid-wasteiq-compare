const path = require('path');
const webpack = require('webpack');

const commons = require("./webpack_common")

module.exports = env => ({
  devtool: 'eval-source-map',
  entry: {
    index: [
      'webpack-hot-middleware/client?noInfo=false',
      './adminGui/index.tsx'
    ], 
    vendor: commons.vendorLibList,
  },
  mode: "development",
  output: commons.output,
  optimization: {
    splitChunks: commons.splitChunks,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|nb)$/),
  ],
  resolve: commons.resolve,
  module: {
    rules: commons.rules, 
  },
});

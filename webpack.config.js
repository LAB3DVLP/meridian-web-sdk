"use strict";

const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const common = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  node: {
    __dirname: true,
    fs: "empty"
  },
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "mws.js",
    library: "MeridianWebSDK",
    libraryTarget: "var",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    filename: "mws.js",
    clientLogLevel: "error",
    contentBase: path.resolve(__dirname, "demo"),
    overlay: true,
    port: 3011,
    stats: "errors-only"
  }
};

const development = {
  ...common
};

const production = {
  ...common
};

const analyze = {
  ...common,
  plugins: [new BundleAnalyzerPlugin()]
};

const configs = {
  development,
  production,
  analyze
};

module.exports = env => configs[env];

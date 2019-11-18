const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config.json');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const buildInfo = require('./util/buildInfo');

const baseConfig = require('./webpack.config.base.js');

const path = require('path');
const ROOT_PATH = path.resolve(process.env.PWD);

baseConfig.module.rules.push({
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'sass-loader',
  ]
});

const finalConfig = Object.assign({
  mode: 'production',
  devtool: 'eval-source-map',
  output: {
    path: path.join(ROOT_PATH, 'dist/'),
    filename: config.artifactRoot + '.[name].[hash].js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      title: config.applicationName,
      template: path.resolve(ROOT_PATH, 'app/src/templates/index.ejs'),
      inject: false
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
}, baseConfig);

module.exports = new Promise(resolve => {
  buildInfo((build) => {
    finalConfig.plugins.unshift(new webpack.DefinePlugin({
      __DEV__: false,
      __BUILD__: JSON.stringify(build),
      __BUILD_EPOCH__: new Date().getTime(),
      RINGA_CURRENT_WHITELIST: JSON.stringify(require('./uglifyMangleWhitelist.json')),
      PASSWORD_RESET_REDIRECT_URI: "'https://www.gamepen.io/account/password/validate-reset'",
      API_ROOT: `'https://gamepen.joshjung.com/api'`,
      'process.env': {
        NODE_ENV: '"production"'
      }
    }));

    resolve(finalConfig);
  })
});


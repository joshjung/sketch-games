const webpack = require('webpack');
const path = require('path');
const build = require('./util/buildInfo');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildInfo = require('./util/buildInfo');

const config = require('./config.json');

const ROOT_PATH = path.resolve(process.env.PWD);

const baseConfig = require('./webpack.config.base.js');

baseConfig.module.rules.push({
  test: /\.s?css$/,
  loaders: [
    'style-loader',
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        outputStyle: 'expanded',
        includePaths: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'app'),
          __dirname
        ]
      }
    }
  ]
});

const finalConfig = Object.assign({
  mode: 'development',
  devtool: 'eval',
  output: {
    path: path.join(ROOT_PATH, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(ROOT_PATH, 'dist'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: "0.0.0.0",
    port: 8080,
    disableHostCheck: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: config.applicationName,
      template: path.resolve(ROOT_PATH, 'app/src/templates/index.ejs'),
      filename: 'index.html',
      inject: false,
      cache: true
    })
  ]
}, baseConfig);

module.exports = new Promise(resolve => {
  buildInfo((build) => {
    finalConfig.plugins.unshift(new webpack.DefinePlugin({
      __DEV__: true,
      __BUILD__: JSON.stringify(build),
      __BUILD_EPOCH__: new Date().getTime(),
      RINGA_CURRENT_WHITELIST: JSON.stringify(require('./uglifyMangleWhitelist.json')),
      PASSWORD_RESET_REDIRECT_URI: "'http://localhost:8080/account/password/validate-reset'",
      API_ROOT: `'http://localhost:9000'`,
      'process.env': {
        NODE_ENV: '"development"'
      }
    }));

    resolve(finalConfig);
  })
});

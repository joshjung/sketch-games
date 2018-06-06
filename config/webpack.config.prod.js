const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require('./config.json');

const buildInfo = require('./util/buildInfo');

const baseConfig = require('./webpack.config.base.js');

const path = require('path');
const ROOT_PATH = path.resolve(process.env.PWD);

baseConfig.module.rules.push({
  test: /\.s?css$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary
    use: ['css-loader', 'sass-loader']
  })
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
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'editor',
          test: 'editor',
          enforce: true
        },
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HtmlWebpackPlugin({
      title: config.applicationName,
      template: path.resolve(ROOT_PATH, 'app/src/templates/index.ejs'),
      inject: false
    }),
    new ExtractTextPlugin({
      filename: config.artifactRoot + '.css',
      allChunks: true
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
      PASSWORD_RESET_REDIRECT_URI: "'https://www.supermini.games/account/password/validate-reset'",
      API_ROOT: `'https://www.supermini.games/api'`,
      'process.env': {
        NODE_ENV: '"production"'
      }
    }));

    resolve(finalConfig);
  })
});


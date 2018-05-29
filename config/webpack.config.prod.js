const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const config = require('./config.json');

const buildInfo = require('./util/buildInfo');

const baseConfig = require('./webpack.config.base.js');

const path = require('path');
const ROOT_PATH = path.resolve(process.env.PWD);

baseConfig.module.loaders.push({
  test: /\.s?css$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary
    use: ['css-loader', 'sass-loader']
  })
});

const finalConfig = Object.assign({
  mode: 'production',
  devtool: false,
  output: {
    path: path.join(ROOT_PATH, 'dist/'),
    filename: config.artifactRoot + '.[name].[hash].js',
    publicPath: '/'
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
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: new RegExp(config.artifactRoot + '.css$'),
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    new UglifyJSPlugin({
      sourceMap: false,
      uglifyOptions: {
        mangle: {
          keep_classnames: true,
          keep_fnames: true,
          reserved: require('./uglifyMangleWhitelist.json')
        }
      }
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}, baseConfig);

module.exports = new Promise(resolve => {
  buildInfo((build) => {
    finalConfig.plugins.unshift(new webpack.DefinePlugin({
      __DEV__: false,
      __BUILD__: JSON.stringify(build),
      __BUILD_EPOCH__: new Date().getTime(),
      'process.env': {
        NODE_ENV: '"production"'
      }
    }));

    resolve(finalConfig);
  })
});


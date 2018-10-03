const path = require('path')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.config')

const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-eval-source-map',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:8].js'),
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css'],
    alias: {
      '@': resolve('src'),
      'api': resolve('src/api'),
      'utils': resolve('src/utils'),
      'components': resolve('src/components'),
      'css': resolve('src/css'),
      'views': resolve('src/views'),
      'assets': resolve('src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        exclude: [resolve('src/assets/svg')],
        options: {
          limit: 10000,
          name: utils.assetsPath('image/[name].[hash:8].[ext]')
        }
      },
      {
        test: /\.svg$/,
        include: [resolve('src/assets/svg')],
        use: [{
          loader: "svg-sprite-loader",
          options: {
            name: "[name]",
            prefixze: true
          }
        }, {
          loader: "svgo-loader",
          options: {
            plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: true } },
                { convertPathData: true },
                { cleanupAttrs: true },
                { removeComments: true },
                { removeDesc: true },
                { removeUselessDefs: true },
                { removeEmptyAttrs: true },
                { removeHiddenElems: true },
                { removeEmptyText: true }
            ]
          }
        }]
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              use: ['css-loader?minimize', 'postcss-loader'],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),
        new webpack.HashedModuleIdsPlugin(),
      ]
    : [
        new FriendlyErrorsPlugin()
      ]
}

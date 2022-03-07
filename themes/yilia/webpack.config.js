const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


const htmlPluginConfig = {
  inject: false,
  cache: false,
  minify: {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyJS:true
  }
}

module.exports = function(env, argv) {
  // 是否是生产环境
  let isProd = argv.mode === 'production'
  return {
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
      })]
    },
    entry: {
      main: ['babel-polyfill', './source-src/js/main.js'],
      slider: './source-src/js/slider.js',
      mobile: './source-src/js/mobile.js',
      viewer: './source-src/js/viewer.js'
    },
    output: {
      publicPath: '/',
      path: __dirname + '/source',
      filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
          exclude: /node_modules/
        },{
          test: /\.(scss|sass)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },{
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },{
          test: /\.(png|jpe?g|gif|ico)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:6].[ext]',
              outputPath: 'images',
              esModule: false  // 不使用es6的模块语法
            }
          }
        },{
          test: /\.(svg|eot|ttf|woff2?|otf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:6].[ext]',
              outputPath: 'fonts',
              esModule: false  // 不使用es6的模块语法
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(Object.assign({
        template: './source-src/template/script.html',
        filename: '../layout/_partial/script.ejs'
      }, htmlPluginConfig)),
      new HtmlWebpackPlugin(Object.assign({
        template: './source-src/template/css.html',
        filename: '../layout/_partial/css.ejs'
      }, htmlPluginConfig)),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['js/*','css/*','fonts/*','images/*'],
        verbose: true,
        dry: false,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:6].css'
      })
    ],
    mode: argv.mode,
    watch: !isProd
  }
}
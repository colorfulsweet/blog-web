const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


const minifyHTML = {
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyJS:true
}

module.exports = function(env, argv) {
  // 是否是生产环境
  let isProd = argv.mode === 'production'
  return {
    entry: {
      main: ['babel-polyfill', './source-src/js/main.js'],
      slider: './source-src/js/slider.js',
      mobile: './source-src/js/mobile.js',
      viewer: './source-src/js/viewer.js'
    },
    output: {
      publicPath: '/',
      path: __dirname+'/source',
      filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader', 
            options:{cacheDirectory: true}
          },
          exclude: /node_modules/
        },{
          test: /\.(scss|sass)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },{
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },{
          test: /\.(png|jpe?g|gif|ico)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1000,
              publicPath: '../',
              name: 'images/[name].[ext]'
            }
          }
        },{
          test: /\.(svg|eot|ttf|woff2?|otf)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1000,
              publicPath: '../',
              name: 'fonts/[name].[hash:6].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? 'css/[name].[contenthash].css' : 'css/[name].css',
        chunkFilename: '[id].css'
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /viewer\..*?\.css$/g,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      }),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        minify: minifyHTML,
        template: './source-src/template/script.html',
        filename: '../layout/_partial/script.ejs'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        minify: minifyHTML,
        template: './source-src/template/css.html',
        filename: '../layout/_partial/css.ejs'
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['js/*.js','css/*.css','fonts/*'],
        verbose: true,
        dry: false,
      })
    ],
    mode: argv.mode,
    watch: !isProd
  }
}
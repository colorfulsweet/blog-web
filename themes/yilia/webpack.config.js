const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


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
      main: './source-src/js/main.js',
      slider: './source-src/js/slider.js',
      mobile: './source-src/js/mobile.js',
      viewer: './source-src/js/viewer.js'
    },
    output: {
      publicPath: '/',
      path: __dirname + '/source',
      filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
      clean: isProd ? { keep: (asset) => !/^(js|css|fonts|images)\//.test(asset) } : false
    },
    module: {
      rules: [{
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },{
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
        },{
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },{
          test: /\.(png|jpe?g|gif|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[contenthash:6][ext]'
          }
        },{
          test: /\.(svg|eot|ttf|woff2?|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash:6][ext]'
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
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:6].css'
      })
    ],
    mode: argv.mode,
    watch: !isProd
  }
}
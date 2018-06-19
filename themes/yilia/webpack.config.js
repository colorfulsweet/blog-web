const webpack = require("webpack")
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

// 模板压缩
// 详见：https://github.com/kangax/html-minifier#options-quick-reference

const minifyHTML = {
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyJS:true
}

const mainCss = new ExtractTextPlugin("css/main.css")
const extraCss = new ExtractTextPlugin("css/extra.css")

module.exports = {
  entry: {
    main: "./source-src/js/main.js",
    slider: "./source-src/js/slider.js",
    mobile: ["babel-polyfill", "./source-src/js/mobile.js"]
  },
  output: {
    path: __dirname+"/source",
    filename: "js/[name].[chunkhash].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: /node_modules/
    },{
      test: /\.html$/,
      loader: 'html'
    },{
      test: /\.(scss|sass)$/,
      loader: mainCss.extract({fallback:"style-loader",use:["css-loader","postcss-loader","sass-loader?outputStyle=compact"]})
    },{
      test: /\.css$/, 
      loaders: extraCss.extract({fallback:"style-loader",use:["css-loader?minimize=true","postcss-loader"]})
    },{
      test: /\.(png|jpe?g|gif|ico)$/,
      loader: "url-loader",
      options: {
        limit: 1000,
        publicPath: "../",
        name: "images/[name].[ext]"
      }
    },{
      test: /\.(svg|eot|ttf|woff2?|otf)$/,
      loader: "url-loader",
      options: {
        limit: 1000,
        publicPath: "../",
        name: "fonts/[name].[hash:6].[ext]"
      }
    }]
  },
  plugins: [
    mainCss,
    extraCss,
    new HtmlWebpackPlugin({
      inject: false,
      cache: false,
      minify: minifyHTML,
      template: './source-src/script.ejs',
      filename: '../layout/_partial/script.ejs'
    }),
    new CleanPlugin(['source/js/*.js'],{
      verbose: true,
      dry: false,
    })
  ],
  // watch: true
}
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

const mainCss = new ExtractTextPlugin("css/main.[contenthash:8].css")
const extraCss = new ExtractTextPlugin("css/extra.[contenthash:8].css")

module.exports = {
  entry: {
    main: "./source-src/js/main.js",
    slider: "./source-src/js/slider.js",
    mobile: ["babel-polyfill", "./source-src/js/mobile.js"],
    comment: "./source-src/js/comment.js",
    waifu: "./source-src/js/waifu.js"
  },
  output: {
    path: __dirname+"/source",
    filename: "js/[name].[chunkhash:8].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: /node_modules/
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
    new CleanPlugin(['source/js/*.js','source/css/*.css'],{
      verbose: true,
      dry: false,
    })
  ],
  // watch: true
}
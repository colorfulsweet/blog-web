---
title: webpack4升级踩坑
date: 2019-4-30 15:03:10
tags: 
  - 前端
  - webpack
categories: 
  - 前端杂烩
---

最近要对博客主题做些改造, 一方面是整合上看板娘
一方面是一些周边的功能, 计划加上夜间模式
期间可能需要频繁打包更新
借此机会, 升级一下主题包的webpack版本, 换用webpack4, 准备好再次被淹没在前端的汪洋大海之中
<!-- more -->

在还没升级之前, 处理几个遗留问题
### 移除已加入到git版本库的文件
如果一个文件已经加入到git的版本库跟踪, 那么直接把它写入到`.gitignore`文件当中是无效的
应该先执行`git rm --cached`把目标文件从版本库移除
--cached参数的作用是在本地仍然保留这几个文件, 如果不加的话会同时在本地执行删除

主题包里面**source/js/**当中的所有js文件由webpack打包生成, 从版本库移除
```
git rm --cached themes/yilia/source/js/*.js
```
之后在.gitignore当中加入
`themes/yilia/source/js/`
这样之后打包生成的文件在提交时就会被忽略

所有目标文件在服务器端执行打包生成即可
如果有其他目录也同样处理

### 加载器参数问题
webpack的加载器大多都有可以指定的参数
之前的打包过程一直在报一个警告
![parseQuery](/images/前端杂烩/webpack/parseQuery.jpg)
parseQuery函数会在下一个主要版本当中被替换为getOptions函数

应该是源于现在的webpack的加载器配置
比如babel-loader的配置
```javascript
{
  test: /\.js$/,
  loader: 'babel-loader?cacheDirectory',
  exclude: /node_modules/
}
```
早期的webpack在指定loader时可以按照类似URL当中的模式, 在`?`后面对该加载器指定配置项
webpack3版本仍然支持这种写法, 但是已经不推荐
所以更换为如下写法
```javascript
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader', 
    options:{cacheDirectory: true}
  },
  exclude: /node_modules/
}
```
如果需要多个加载器进行链式处理, `use`部分可以使用数组形式
比如scss文件的打包处理, 首先需要sass-loader, 然后为了兼容性需要用postcss-loader处理, 最后使用css-loader处理
写作如下格式
```javascript
{
  test: /\.(scss|sass)$/,
  use: [
    "css-loader",
    "postcss-loader",
    "sass-loader"
  ]
}
```
如果其中的加载器需要参数, 其中的每一项都可以写作对象的形式, 指定options

再次执行打包时, 该警告已消除

### 升级webpack
目前最新的webpack版本是**4.30.0**, 先执行npm install安装新版的webpack
之后依次解决带来的一系列问题

#### webpack-cli
webpack4版本应该是把API和命令行工具做了分离, 所以要在命令行执行webpack, 需要安装`webpack-cli`
提示还是非常友好的
![webpack-cli](/images/前端杂烩/webpack/webpack-cli.jpg)
按照提示把webpack-cli加入到依赖

#### 升级各个加载器和插件
webpack4的一些api因为变动较大, 与之配合使用的加载器和插件已经不能完全适配
所以需要升级各个加载器和插件的版本
总之根据报错信息来就好

##### html-webpack-plugin
首先是`html-webpack-plugin`的报错
![html-webpack-plugin报错](/images/前端杂烩/webpack/html-webpack-plugin报错.jpg)

这个插件是用来根据模板文件生成目标html文件的, 基本类似于java web当中从jsp到html文本的转化过程
当然在主题里面, 可以灵活运用为生成需要的ejs文件
升级这个插件到最新版, 目前的最新版是**3.2.0**

##### file-loader
然后是file-loader插件的报错
![file-loader报错](/images/前端杂烩/webpack/file-loader报错.jpg)
目前配置的是对于图片、字体文件的打包
文件体积小于1000byte的使用url-loader处理, 这个加载器会直接把文件转化为base64编码嵌入到css和js文件当中
体积大于这个值的, 直接保留原文件
加载器配置如下
```javascript
{
  test: /\.(png|jpe?g|gif|ico)$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 1000,
      publicPath: "../",
      name: "images/[name].[ext]"
    }
  }
},{
  test: /\.(svg|eot|ttf|woff2?|otf)$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 1000,
      publicPath: "../",
      name: "fonts/[name].[hash:6].[ext]"
    }
  }
}
```

#### css文件单独打包
如果不做特殊处理, css的代码会被打包到js文件当中, 导致js文件臃肿不堪
所以通常的做法是使用插件将css代码单独输出到文件

在webpack3之前, 使用的是`extract-text-webpack-plugin`, 该插件在webpack4已被废弃
之前的做法如下
```javascript
// webpack.config.js文件

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const mainCss = new ExtractTextPlugin("css/main.[contenthash:8].css")

module.exports = {
  // 省略其他配置项
  module: {
    loaders: [
      {
        test: /\.(scss|sass)$/,
        loader: mainCss.extract({
          fallback:"style-loader",
          use:["css-loader","postcss-loader","sass-loader?outputStyle=compact"]
        })
      }
    ]
  },
  plugins: [
    mainCss
  ]
}
```
现在需要更换为`mini-css-extract-plugin`, 该加载器适配webpack4.4以上, 自带css压缩输出
安装之后
修改webpack配置文件如下
```javascript
// webpack.config.js文件

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // 省略其他配置项
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "[id].css"
    })
  ]
}
```
但是引发了一个问题就是, 我本来可以创建多个ExtractTextPlugin对象实现输出到不同的css文件当中的
现在这个mini-css-extract-plugin似乎不支持这种功能
只能把不同的css引入放进不同的entry, 从而才能输出到不同的css文件
这样倒是也行, 于是又分出了一个entry
虽然能正常输出到另一个css文件, 但是另一个css并没有压缩, 文件里面的注释也都带着
这就不太好, 为了解决这个问题, 引入`optimize-css-assets-webpack-plugin`插件

这插件的用法就很简单了
```javascript
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /viewer\..*?\.css$/g,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]
}
```
因为我把需要单独输出的css放在了名为**viewer**的模块当中
所以输出的名称按照MiniCssExtractPlugin当中的配置
就是`viewer.8位hash.css`, 所以这里的正则才这样写, 只处理这一个即可


---
至此终于宣告完工, 打包可以正常运作
附: [webpack.config.js文件](https://github.com/sookie2010/hexo_blog/blob/master/themes/yilia/webpack.config.js)
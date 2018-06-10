---
title: webpack(2)-进阶
date: 2018-6-10 18:26:54
tags: 
  - webpack
categories: 
  - 前端杂烩
---

#### 开发工具
使用`webpack-dev-server`可以在本地启动一个服务 , 用来访问和调试构建出的页面
首先执行全局安装
```bash
$ npm install -g webpack-dev-server
```
<!-- more -->
使用方法
在项目目录下首先使用`webpack --progress`进行打包
![webpack progress](/images/前端杂烩/webpack/webpack_progress.png)

然后使用`webpack-dev-server --progress`启动服务
![webpack server](/images/前端杂烩/webpack/webpack_server.png)

为了方便 , 我们也可以把这两个命令配置为npm的脚本
在package.json当中
```json
{
  "name": "webpack_demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack --progress",
    "start":"webpack-dev-server --progress"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "css-loader": "^0.26.1",
    "style-loader": "^0.13.1",
    "webpack": "^1.14.0"
  }
}
```
之后执行`npm run build`和`npm run start` , 就相当于是直接执行这两个命令


#### 加载器
上一节当中有用到了css加载器 , 将.css文件的内容直接嵌入到页面当中
还有很多第三方的加载器 , 可以给开发提供方便

##### 资源文件加载器 file-loader
用于加载项目中用到的静态资源文件 , 例如图片 字体等
```bash
$ npm install file-loader --save-dev
```
webpack.config.js
```javascript
module.exports = {
  entry: {
    index : './src/entry.js'
  },
  output: {
    path: __dirname+"/dist",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    { test: /\.css$/, loaders: ["style-loader","css-loader"] },
    //配置资源文件所对应的文件类型(正则)
    { test: /\.(png|jpg|gif|svg|woff|woff2|ttf|eot)$/, loader: "file-loader" }
    ]
  }
};
```
比如在css文件当中引用了一个图片文件
```css
body {
  background-color: #ccc;
}
#testImg {
  width:200px;
  height:200px;
  background-image: url("../images/test.png");
}
```
执行打包之后就会根据图片的哈希码作为命名在输出目录下生成一个图片文件
![image output](/images/前端杂烩/webpack/image_output.png)

并且对应的css样式也会被替换
![css output](/images/前端杂烩/webpack/css_output.png)

##### 图片加载器 url-loader
图片加载器是用于把项目中用到的图片转化为base64编码
( 这个编码在img元素的src 或者 css样式当中都是可用的 )

```bash
$ npm install url-loader --save-dev
```
同样使用上面的例子当中css样式里面对图片的引用
加载器的配置修改为
```javascript
module: {
  loaders: [
  { test: /\.css$/, loaders: ["style-loader","css-loader"] },
  { test: /\.(png|jpg|gif)$/, loader: "url-loader" }
  ]
}
```
执行打包和发布运行后
![base64 output](/images/前端杂烩/webpack/base64_output.png)

---
**补充 : **
在项目当中 , 我们通常把较小的图片文件转化为base64编码 , 较大的图片文件则直接保留原文件
避免js文件太过臃肿  , 加载缓慢
`url-loader`提供了一个`limit`参数 , 可以对图片的大小进行限制 ( 单位是字节 ) , 小于该值的由url-loader处理
大于这个值的 , 则直接交给`file-loader`处理

```javascript
module.exports = {
//...(其他配置项)
  module: {
    loaders: [
    { test: /\.css$/, loaders: ["style-loader","css-loader","postcss-loader"]},
    { test: /\.(png|jpg|jpeg|gif)$/, loader: "url-loader" , query :{limit:20000,name:"[name]-[hash:8].[ext]",publicPath:"../images/",outputPath:"images/"}}, 
    //会将图片转化为base64编码直接写入到js文件当中
  //  { test: /\.(png|jpg|jpeg|gif|svg|eot)$/, loader: "file-loader", query :{name:"images/[name]-[hash:8].[ext]"}},
    { test: /\.(svg|eot)$/, loader: "file-loader", query :{name:"[name]-[hash:8].[ext]",publicPath:"../fonts/",outputPath:"fonts/"}},
//注意 : file-loader配置的文件类型匹配不要和url-loader冲突
  ]
  }
};
```
此时传递给url-loader的参数 , 如果资源文件被交给了file-loader来处理 , 这些参数也会传给file-loader
name就属于给file-loader去用的参数 , 代表打包以后文件的命名规则
打包后的结果如下

![build result](/images/前端杂烩/webpack/build_result.png)

---
其他常用的加载器还有
+ json处理  - `json-loader`
+ html处理 - `raw-loader`

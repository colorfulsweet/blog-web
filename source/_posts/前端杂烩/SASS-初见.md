---
title: SASS-初见
date: 2018-5-11 22:38:32
tags: 
	- 前端
	- sass
categories: 
	- 前端杂烩
---


CSS本身并不算是一种编程语言 , 它没有变量 , 也没有条件语句
只是作为单纯的描述 , 写起来比较费事 , 同时也需要考虑很多的兼容性问题
很自然地 , 有人开始为CSS加入编程元素 , 这类工具就叫做`CSS预处理器` 
这类工具使用编程的风格去编写类似CSS的代码 , 然后通过工具的处理生成浏览器可以识别的CSS文件
<!-- more -->
#### SASS与SCSS
这两者其实是同一种东西 , 都可以称之为SASS
+ 文件的扩展名不同 , 分别是sass和scss
+ sass以严格的缩进式语法规则来编写 , 不带大括号和分号 , 而scss的语法与css的语法非常类似

下面是最简单的例子 , 运用了变量的定义和调用
sass语法
```scss
$font-stack: Helvetica, sans-serif  //定义变量
$primary-color: #333 //定义变量

body
  font: 100% $font-stack
  color: $primary-color
```

scss语法
```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
最终编译出来的css都是
```
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```
---
#### sass编译工具
sass本身是类似ruby的语法的 , 使用ruby去编译sass是最直接的
可以使用`ruby -v` 查看是否安装ruby ( Mac系统自带 )
使用ruby的包管理工具`gem`安装sass模块
```bash
$ gem install sass
```
> 如果需要进行卸载 , 执行 gem uninstall sass 即可

执行`sass -v` 正常显示版本号代表安装成功
执行编译的操作非常简单
```bash
#sass 源文件名:目标文件名
$ sass test.scss:test.css
```
> + 添加`--watch`参数可以启动一个程序监控该scss文件的变化 , 一旦发生变化则重新执行编译
> + 添加`--style`参数可以使用不同风格的输出方式 ( 通常可以用于压缩css代码 )
> 例如`sass test.scss:test.css --style compressed`
> nested  - 嵌套输出
> expanded - 展开输出
> compact - 紧凑输出
> compressed - 压缩输出


---
#### node-sass
这个模块是nodejs的一个第三方模块 , 用于编译sass代码 , 为了方便 , 我们配合webpack来进行使用
```bash
$ npm install node-sass sass-loader --save-dev
```

为了查看编译过后的文件 , 我们需要把编译过后的css代码放入一个独立的文件当中
需要使用`extract-text-webpack-plugin`模块
这是一个webpack的插件
安装之后
在webpack.config.js当中
```javascript
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	entry: {
		entry : './src/entry.js'
	},
	output: {
		path: __dirname+"/dist",
		filename: 'js/[name].bundle.js'
	},
	module: {
		loaders: [
		{ test: /\.css$/, loaders: ["style-loader","css-loader"]},
		{ test: /\.scss$/, loaders : ExtractTextPlugin.extract({fallback:"style-loader",use:["css-loader","postcss-loader","sass-loader?outputStyle=compact"]})}
	]
	},
	plugins : [
	//压缩打包之后的js
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
	//写入的文件
		new ExtractTextPlugin("css/[name][contenthash].css")
	]
};
```
> 上面为sass-loader加的参数`outputStyle`作用与ruby当中的--style相同

在src/entry.js当中引入scss文件
```javascript
require("./style/test.scss");
```


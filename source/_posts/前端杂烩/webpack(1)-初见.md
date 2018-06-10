---
title: webpack(1)-初见
date: 2018-6-10 18:08:07
tags: 
  - webpack
categories: 
  - 前端杂烩
---

现在越来越多的JS代码被用在页面上 , 如何去很好地组织这些代码 , 成为了一个必须要解决的问题
不止有JS需要被模块化管理 , 前端当中很多的图片 css样式 , 都是需要被统一管理 , 方便进行扩展和维护的
<!-- more -->

所以webpack有如下几个目标 : 
+ 将依赖树拆分
+ 保证初始加载的速度
+ 所有静态资源可以被模块化
+ 可以整合第三方的库和模块
+ 可以构造大型项目
![示意图](/images/前端杂烩/webpack/示意图.png)

#### 使用方法 : 

##### 安装
1. 全局安装 `npm install webpack -g`
2. 项目初始化
`npm init` - 生成一个package.json文件
`npm install webpack --save-dev` - 添加webpack依赖

##### webpack的配置
每个项目下都必须有一个`webpack.config.js` , 它就相当于webpack的一个配置文件 , 告诉webpack该做什么

这里先写一个最基本的可用配置
其实还有很多的配置项 , 具体可以查看官方文档

```javascript
module.exports = {
  //页面入口文件配置
  //相当于执行这个JS文件可以直接或间接找到项目中用到的所有模块
  entry: {
    index : './src/entry.js'
  },
  //入口文件输出配置
  //最终要打包生成什么名字的文件, 放在哪里
  output: {
    path: __dirname,//表示当前目录
    filename: 'bundle.js'
  },
  module: {
    //加载器配置
    //告诉webpack每一种类型文件都需要使用什么加载器来处理
    loaders: [
      { test: /\.css$/, loaders: ["style-loader","css-loader"] }
    ]
  }
};
```

现在可以在项目当中创建`src`目录 , 并在其中创建entry.js文件和content.js文件

content.js
```javascript
//这个文件相当于项目中所用到的一个模块
module.exports = "现在的内容来自于content.js文件";
```
entry.js
```javascript
//这是我们定义的入口文件, 引用content模块
document.write(require("./content.js"));
```

在项目目录下执行`webpack`命令
可以看到在项目目录下生成了打包后的bundle.js

编写页面html文件
```xml
<html>
<head>
	<meta charset="utf-8"/>
</head>
<body>
	<script src="bundle.js"></script>
</body>
</html>
```
然后可以访问页面 , 看到JS被正确执行了

##### 使用加载器
可以使用加载器去加载一个CSS文件 , 在页面中就不需要对这个样式文件进行引入了
打包后的JS会执行把这个文件中包含的样式加入到页面当中的动作
需要安装`css-loader`和`style-loader`这两个模块

```bash
$ npm install css-loader style-loader --save-dev
```
然后编写自己的css文件
![目录结构](/images/前端杂烩/webpack/目录结构.png)
```css
body {
	background-color : #ccc;
}
```
修改entry.js文件 , 引入这个css文件
```javascript
require("!style!css!./style/style.css");
document.write(require("./content.js"));
```
> 这里因为已经在配置文件中指定了.css文件所使用的加载器 , 所以也可以直接写`require("./style/style.css")`


css-loader是用于在JS当中加载CSS文件
style-loader是用于将CSS文件的样式加载到页面当中

重新执行webpack命令即可
![output](/images/前端杂烩/webpack/output.png)
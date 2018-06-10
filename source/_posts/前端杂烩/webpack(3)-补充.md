---
title: webpack(3)-补充
date: 2018-6-10 18:29:17
tags: 
  - webpack
categories: 
  - 前端杂烩
---

#### 文件变更监控
在开发过程中通常需要对代码进行频繁的修改
并且同时查看效果
在webpack命令加入`--watch`参数可以启动一个进程执行文件的监控
如果文件发生改变会自动再次执行打包
比如
```bash
webpack hello.js bundle.js --watch
```
<!-- more -->
#### 分装打包
对于不同的功能模块 , 如果我们不希望将其打包在一起 , 可以去指定多个入口文件
```javascript
//...
entry: {
  bundle1 : './src/entry.js',
  bundle2 : "./src/entry2.js"
},
output: {
  path: __dirname+"/dist",
  filename: '[name].js'
},
// ...
```
为了避免打包后输出的目标文件互相覆盖 , 我们需要对打包后的目标文件名进行动态命名
`[name]` 代表以入口文件的名称命名 , 例如上面的配置打包之后获得的就是 bundle1.js和 bundle2.js两个文件
`[chunkhash]`代表文件模块快照的hash值进行命名 , 例如bundle.[chunkhash].js
![webpack entry](/images/前端杂烩/webpack/webpack_entry.png)
> 如果**只是**使用`[hash]`则不会进行分装打包 , 最终的结果还是一个文件

---
### 使用插件
webpack提供了丰富的扩展机制 , 除了各种加载器之外 , 还有就是插件
我们可以使用丰富的第三方插件扩展webpack的功能
#### html-webpack-plugin
这是一个html文件的自动生成插件
在打包当中 , 如果在文件命名当中加入了hash值 , 那么每次打包产生的文件名都会不同
如果要每次都去复制文件名 , 然后手动修改html文件就太过繁琐了 , 而且也容易出错
这个插件的作用就是自动完成这件事
首先是安装
```bash
npm install html-webpack-plugin --save-dev
```
简单应用一下
在webpack.config.js当中
```javascript
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
//(其他配置项)...
  plugins : [
    new HtmlWebpackPlugin()
  ]
};
```
这种情况下使用的是插件的默认配置项 , 会在目标文件目录下生成一个index.html文件
这个文件中自动引入了打包产生的若干js文件

但是在实际的应用当中 , 这个html文件通常需要复杂得多 , 我们需要指定一个预定义的模板
```javascript
//....
new HtmlWebpackPlugin({
  filename : "assert/index.html" //文件输出的路径
  template : "template.html"
})
```
其他常用参数
+ inject : 可以取值 true | "body" | "head" | false , 代表js是否被引入到页面中 , 以及放在body底部还是在head当中
+ title : 页面的标题
+ favicon : 页面的图标文件
+ chunks : 需要引入的模块名称 , 使用数组形式 , 比如["entity1", "entity2"]
+ excludeChunks : 需要排除掉的模块名称 , 与chunks的格式一样 , 使用数组形式
+ minify : 是否对生成的html文件内容进行压缩 , 包含许多子选项 , 可以参考[官方文档](https://github.com/kangax/html-minifier#options-quick-reference)


##### 模板语法
html-webpack-plugin使用了ejs的模板语法
也就是在模板当中使用`<%=  %>`可以引用变量
例如在配置参数中自定义的属性
```javascript
new HtmlWebpackPlugin({
  title : "My App",
  filename : "assert/index.html",
  template : "test.html",
  inject : "head",
  now : new Date()
})
```
在模板当中可以以如下方式使用
```
<p><%=htmlWebpackPlugin.options.now %></p>
```

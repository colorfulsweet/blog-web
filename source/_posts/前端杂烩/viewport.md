---
title: viewport
date: 2017-9-9 11:01:56
tags: 
  - 前端
categories: 
  - 前端杂烩
---

在移动设备上的页面开发 , 首先需要搞清楚的就是`viewport` , 这是适配和响应各种不同分辨率的移动设备的前提条件

#### 概念
通俗地讲 , 移动设备上的viewport是指设备的屏幕上能用来显示网页的那块区域
<!-- more -->
> 关于**像素(px)**
> 这是css当中常见的定义像素值的单位
> 但是这个值并不能完全等同于设备的物理像素
> 因为页面是可以被缩放的 , 如果缩放到2倍
> 那么1px在页面上就会占用2个物理像素的距离

#### 移动设备的3个viewport
##### layout viewport
![layout viewport](/images/前端杂烩/viewport1.png)
它的宽度是大于浏览器可视区域的宽度的
宽度值可以通过`document.documentElement.clientWidth`来获取
还需要一个viewport来代表浏览器可视区域的大小

##### visual viewport
![visual viewport](/images/前端杂烩/viewport2.png)
它的宽度可以通过`window.innerWidth`来获取

现在已经有两个viewport了 , 但是浏览器还觉得不够 , 因为越来越多的网站都会为移动设备进行单独的设计 , 所以还必须要有一个能完美适配移动设备的viewport
> 完美适配指的是 : 
> 1. 不需要用户缩放和横向滚动条就能正常地查看网页的所有内容
> 2. 显示的文字大小合适 , 不会因为在高密度像素的屏幕里显示得太小而无法看清 . 当然不只是文字 , 其他元素的大小也是同样的道理

##### ideal viewport
这是移动设备的理想viewport , 它并没有一个固定的尺寸 , 不同的设备有不同的尺寸
例如所有iphone设备的ideal viewport的宽度都是320px , 无论它的屏幕宽度是320还是640
安卓设备则比较复杂 , 有很多不同的值
页面中元素大小如果根据ideal viewport来适配 , 则不会出现在像素密度太高的屏幕上 , 元素显示太小的问题了

#### 利用meta标签对viewport进行控制
移动设备默认的viewport是layout viewport , 但是在进行移动设备网站的开发时 , 我们需要的是ideal viewport
通常需要在head标签当中添加
```xml
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```
属性说明 : 
+ `width` - 控制viewport宽度 , 可以指定一个值 , 或者特殊的值 , **device-width**为设备的宽度
+ `height` - 与width相对应 , 指定高度 , 这个属性并不重要 , 很少使用
+ `initial-scale` - 初始缩放比例 , 比如1.0
+ `maximum-scale` - 允许用户缩放到的最大比例
+ `minimum-scale` - 允许用户缩放到的最小比例
+ `user-scalable` - 用户是否可以手动缩放 , 值为yes或者no

要得到ideal viewport只需要把width设置为**device-width**即可
需要说明的是 , 有关缩放的属性都是相对于ideal viewport进行缩放的
所以如果只写
```xml
<meta name="viewport" content="initial-scale=1" />
```
也可以达到ideal viewport的效果

---
#### 视区的相关单位
+ `vw` - 相对于视区的宽度 , 视区总的宽度为100vw
+ `vh` - 相对于视区的高度 , 视区总的高度为100vh
+ `vmin` - 相对于视区的宽度与高度当中较小的一个
+ `vmax` - 相对于视区的宽度与高度当中较大的一个

比如某种情况下视区的宽度为1000px
div的width为2vw , 那么这个div的实际显示宽度就是20px
高度同理

##### 实际应用
1. 弹性布局

实践当中 , 如果我们需要把两个元素横向并排布局
设置浮动之后 , 分别指定宽度为25%与75%
与指定宽度为 25vw和75vw
相比并没有什么优势 , 实际的作用也是一样的

在布局方面要发挥更大的作用 , 需要结合一个CSS的函数`calc`
就是calculate的缩写
这个函数的作用是**执行表达式的计算**

如果不使用这个函数 , 我们通常是需要使用一些预处理工具 , 比如sass , 才能在css当中编写表达式
让预处理工具在打包css代码的过程中完成这个计算
但是这样终究比较局限 , 因为视区的宽度高度是页面实际渲染的时候才确定的
如果涉及到视区的计算 , 则无法完成

回到最初的问题 , 按照宽度的百分比横向排列两个div
直接用百分比当然是可以的 , 但是如果这个元素有 **border margin padding**当中的任意一个 , 右边的div就会被挤到下一行
( 如果是单个元素宽度100%的话 , 盒子会被撑破 , 超出父元素的宽度 )

这时候我们就可以用calc函数配合vw来解决这个问题
```css
.left,.right {
  height : 600px;
  border : 3px solid black;
}
.left {
  background : blue;
  width : calc(25vw - 6px);
}
.right {
  background : pink;
  width : calc(75vw - 6px);
}
```
> 出于兼容性的考虑 , 最好给calc加上`-webkit-`和`-moz-`的前缀


2. 弹性字体

在响应式布局中 , 字体的大小最好是能跟随视区的大小进行自动调整
才能达到比较好的体验
可以采用如下方式
```css
:root {
  font-size: calc(1vw + 1vh + .5vmin);
}
```
`:root`伪类匹配DOM文档树的根元素 

> **补充说明**
> 使用视区的相关单位的值对应的属性 , 不会跟随页面的缩放变化
> 比如第二个例子当中的字号
> 在放大页面的时候 , 文字的大小是不会改变的

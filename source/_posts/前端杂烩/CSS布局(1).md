---
title: CSS布局(1)
date: 2017-9-14 22:38:32
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

#### 常用的居中方法
1. **水平居中**
```xml
<div class="parent">
  <div class="child"></div>
</div>
```
对于子元素的不同情况 , 需要进行不同的处理
<!-- more -->
+ 行内元素 : 对父元素设置`text-align:center`
+ 定宽的块元素 : 对子元素设置`margin-left:auto`以及`margin-right:auto`
+ 不定宽的块元素 : 可以把子元素转化为行内元素 , 然后使用行内元素的方案 , 对子元素设置`display: inline` , 对父元素设置`text-align:center`

> **通用方案**
>  使用flex布局 , 对父元素设置
```css
.parent {
  display : flex;
  justify-content : center;
}
```

2. **垂直居中**
垂直居中的情况通常是父元素的高度固定 , 以下是在此前提下实现的
+ 子元素为块元素 : 设置子元素`position:absolute` , 然后`margin:auto`
+ 子元素为单行内联文本 : 父元素的`height`与`line-height`相同即可
+ 子元素为多行内联文本 : 父元素`display:table-cell` , 再设置`vertical-align:middle`
例如
```html
<div class="parent">
  <p>123456</p>
  <p>123456</p>
  <p>123456</p>
</div>
<style>
.parent {
  height:200px;
  width:300px;
  display:table-cell;
  vertical-align:middle;
}
</style>
```

> **通用方案**
> 使用flex布局 , 父元素
```css
.parent {
  display:flex;
  align-items:center;
}
```
---
#### 单列布局
![single_column](/images/前端杂烩/single_column.png)
第一种布局方式DOM结构
```html
<div class="layout">
  <div class="header">头部</div>
  <div class="content">内容</div>
  <div class="footer">尾部</div>
</div>
```
第二种布局方式DOM结构
```html
<div class="header">
  <div class="layout">头部</div>
</div>
<div class="layout content">内容</div>
<div class="footer">
  <div class="layout">尾部</div>
</div>
```

样式
```css
.layout {
  max-width:960px;
  margin:0 auto;
}
```
---
#### 多列布局
可能有以下各种情况 , 当然如果更多列的话也是类似的
![many_columns](/images/前端杂烩/many_columns.png)

##### 实现方式1 : float+margin
DOM结构
```xml
<div class="content">
  <div class="sub">侧边栏1</div>
  <div class="extra">侧边栏2</div>
  <div class="main">内容区域</div>
</div>
```
CSS样式
```css
.sub,.extra,.main {
  height : 300px;
}
.sub {
  width : 100px;
  float : left;
  background-color: pink;
}
.extra {
  width : 200px;
  float : right;
  background-color: green;
}
.main {
  margin:0 200px 0 100px;
  background-color: blue;
}
```
实际效果如下
![many_columns2](/images/前端杂烩/many_columns2.png)
> **注意** : DOM文档的书写顺序，先写两侧栏，再写主面板，更换后则侧栏会被挤到下一列
> 这种布局方式比较简单明了 , 缺点是渲染时首先渲染了侧边栏 , 而不是重要的内容区域

##### 实现方式2 : position+margin
1. 对两个侧边栏分别设置宽度
2. 将两个侧边栏设置为绝对定位 , 需要位于左侧的left值为0 , 位于右侧的right值为0
3. 内容区域设置左外边距和右外边距
```css
.sub,.extra,.main {
  height : 300px;
}
.sub,.extra {
  position: absolute;
  top : 0;
  width : 200px;
}
.sub {
  left : 0;
  background-color: pink;
}
.extra {
  right : 0;
  background-color: green;
}

.main {
  margin:0 200px;
  backgroun-color: blue;
}
```
> 如果中间栏有最小宽度限制 , 或者其中包含有宽度的元素 , 那么当窗口宽度压缩到一定程度 , 中间栏与侧栏将会发生重叠

##### 实现方式3 : 圣杯布局(float + 负margin + padding + position)

DOM结构
```xml
<div id="content">
  <div class="main">内容区域</div>
  <div class="sub">侧边栏1</div>
  <div class="extra">侧边栏2</div>
</div>
```
布局步骤:

1. 三者都设置向左浮动。
2. 设置main宽度为100%，设置两侧栏的宽度。
3. 设置 负边距，sub设置负左边距为100%，extra设置负左边距为负的自身宽度。
4. 设置main的padding值给左右两个子面板留出空间。
5. 设置两个子面板为相对定位，sub的left值为负的sub宽度，extra的right值为负的extra宽度。

CSS样式
```css
.sub , .extra, .main {
  float :left;
  height : 300px;
}
.main {
  width : 100%;
  background-color: red;
}
.sub {
  width : 100px;
  margin-left: -100%;
  position: relative;
  left : -100px;
  background-color: pink;
}
.extra {
  width : 200px;
  margin-left: -200px;
  position: relative;
  right: -200px;
  background-color: blue;
}
#content {
  padding : 0 200px 0 100px;
}
```

> 这种布局方式仍然存在一个缺陷 : 当main的实际宽度比侧边栏的宽度小的时候 , 布局就会乱掉

##### 实现方式4 : 双飞翼布局(float + 负margin + margin)
双飞翼布局实际上是在圣杯布局的基础上做了改进 , 在main部分的外层套上了一层div
并设置margin,由于两侧栏的负边距都是相对于main-wrap而言，main的margin值变化便不会影响两个侧栏，因此省掉了对两侧栏设置相对布局的步骤
DOM结构
```xml
<div class="main-wrap" >
  <div class="main">内容区域</div>
</div>
<div class="sub">侧边栏1</div>
<div class="extra">侧边栏2</div>
```
布局步骤
1. 三者都设置向左浮动。
2. 设置main-wrap宽度为100%，设置两个侧栏的宽度。
3. 设置 负边距，sub设置负左边距为100%，extra设置负左边距为负的自身宽度。
4. 设置main的margin值给左右两个子面板留出空间。

CSS样式
```css
.main-wrap, .sub, .extra {
  float : left;
  height:300px;
}
.main-wrap {
  width : 100%;
}
.sub {
  width : 100px;
  margin-left: -100%;
  background-color: red;
}
.extra {
  width : 200px;
  margin-left: -200px;
  background-color: green;
}
.main {
  margin:0 200px 0 100px;
  background-color: pink;
  height:300px;
}
```
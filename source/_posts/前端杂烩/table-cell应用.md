---
title: table-cell应用
date: 2018-6-15 09:23:57
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

`table-cell`元素让该元素以表格单元格的形式呈现，类似于td标签
单元格有一些比较特别的属性，例如元素的垂直居中对齐，关联伸缩等

> table-cell并不是必须和`table`父元素配套使用 , 但是通常习惯于这样做
<!-- more -->

table-cell会被某些css样式破坏 , 比如float 绝对定位
对`width height padding`**有反应** , 对`margin`**无反应**
```css
.box {
  display:table;
}
.box > .child {
  display:table-cell;
  background-color:pink;
  padding:3px;
  width:200px;
  height:50px;
  margin:6px; /* 不生效 */
}
```

### 应用场景
#### 多行文字垂直居中
单行文字的居中十分简单, line-height与父元素的高度相同即可
```css
.box {
  height: 50px;
  line-height: 50px;
}
```
> 这里准确地说应该是文字或者全部为内联元素均在一行内

但是如果其中的文字可能有多行并且行数不确定 , 这种办法就不可行了
使用table-cell配合`vertical-align: middle`就可以很方便做到
```html
<div class="box">
  <div class="child">我是单行文字</div>
  <div class="child">
    <div>我是多行文字</div>
    <div>我是第二行</div>
  </div>
</div>
```

```css
.box > .child {
  display:table-cell;
  vertical-align: middle;
  text-align:center;
  border: 1px solid red;
  padding:3px;
  width:200px;
  height:80px;
}
```
![多行文字垂直居中](/images/前端杂烩/vertical-align.jpg)
当然水平居中和单行没什么差别 , 都是`text-align:center`

#### 多列等高布局
对于多列布局 , 当然存在很多的实现方法
但是如果想要让所有列的高度适应于内容最高的一列的高度
源于表格当中 **td** 的特性
使用table-cell实现起来就更为方便
```html
<div class="box">
  <div class="child left">我是单行文字</div>
  <div class="child middle">
    <div>我是多行文字</div>
    <div>我是多行文字</div>
  </div>
  <div class="child right">
    <div>我是多行文字</div>
    <div>我是多行文字</div>
    <div>我是多行文字</div>
    <div>我是多行文字</div>
  </div>
</div>
```
```css
.box {
  display:table;
  width: 760px;
  margin: auto;
}
.box > .child {
  display:table-cell;
  text-align:center;
  border: 1px solid red;
  padding:3px;
  width:200px;
}
.box > .left, .box > .right {
  width:20%;
}
```
![多列等高布局](/images/前端杂烩/height_auto.jpg)
可以看到整体的高度适应于内容最高的右边一列

### 兼容性
table相关的布局方式在主流浏览器当中都是兼容的

|Chrome|Firefox (Gecko)|Internet Explorer|Opera|Safari (WebKit)|
|---|---|
|1.0 | 1.0 (1.7 or earlier) | 8.0 | 7.0 | 1.0 (85) |
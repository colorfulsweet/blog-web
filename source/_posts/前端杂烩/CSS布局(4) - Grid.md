---
title: CSS布局(4)-grid
date: 2018-5-17 22:38:32
tags: 
	- 前端
	- css
categories: 
	- 前端杂烩
---

Grid布局是网站设计的基础
是创建网格布局最强大和最简单的工具

### FlexBox与Grid
FlexBox是一维布局系统 , 适合做局部布局 , 比如导航栏组件
Grid是二维布局系统 , 通常用于整个页面的规划
二者从应用场景来说并不冲突
虽然FlexBox也可以用于大的页面布局 , 但是没有Grid强大和灵活
二者结合使用更加轻松
<!-- more -->
### 应用指南

#### HelloWorld
要把某个元素变成一个网格(grid) , 只需要把`display`属性设置为`grid`即可
DOM结构
```xml
<div class="wrapper">
	<div>1</div>
	<div>2</div>
	<div>3</div>
	<div>4</div>
	<div>5</div>
	<div>6</div>
</div>
```
CSS
```css
.wrapper {
	display : grid;
}
/* 这里为了清晰看到效果,给子元素添加了一些样式,不过与grid无关 */
.wrapper div {
	background: pink;
	margin:2px;
	text-align:center;
	padding:3px 0;
}
```
![Alt text](/images/前端杂烩/grid/grid1.png)
当然此时还没有什么特别的表现 , 只是6个div简单地堆叠在一起

#### Columns与Rows
为了使其成为二维的网格容器 , 我们需要定义这个网格的`列`和`行`
分别对应`grid-template-columns`和`grid-template-rows`属性
```css
.wrapper {
	display : grid;
	grid-template-rows: 60px 40px;
	grid-template-columns: 120px 60px 80px;
}
```
**grid-template-columns** 属性的值当中有几个数值 , 就代表有几列 , 每个数值对应每一列的宽度
**grid-template-rows** 属性的值当中有几个数值 , 就代表有几行 , 每个数值对应每一行的高度

所以在上面的例子里面 , 是定义了一个3行×2列的网格

现在的效果是这样了
![Alt text](/images/前端杂烩/grid/grid2.png)
当然 , grid容器中的子元素会依次填充每个网格
如果不够 , 那就留空
![Alt text](/images/前端杂烩/grid/grid3.png)
如果多了 , 也会继续往后排 , 但是新的一行已经没有高度值可用 , 所以就是这个div的默认高度(根据div的内容而定)
但是仍然被第一列的宽度约束
![Alt text](/images/前端杂烩/grid/grid4.png)

#### 子元素
与以往使用的`<table>`元素一样 , 我们常常需要某个单元格来横跨多列 , 或者纵跨多行
体现在grid当中 , 就是对子元素添加css属性进行控制了
但是需要首先了解grid布局当中的一个参照 , 就是网格线
![Alt text](/images/前端杂烩/grid/grid5.png)
这里有4条纵向的网格线 , 也就是columns的网格线
以及3条横向的网格线 , 也就是rows的网格线

```xml
<div class="wrapper">
	<div class="item1">1</div>
	<div class="item2">2</div>
	<div class="item3">3</div>
	<div class="item4">4</div>
</div>
```
现在我们要让item1横跨3列 , 也就是从第一条纵向网格线 , 到第四条纵向网格线
那么需要对其定义css属性如下
```css
.wrapper > .item1 {
	grid-column-start: 1;
	grid-column-end: 4;
}
```
![Alt text](/images/前端杂烩/grid/grid6.png)
这个元素实际占据了3个网格 , 把之后的元素都推到了下一行

> 到这里grid布局比起传统的table元素 , 优势就体现出来了
grid本身虽是二维布局 , 但是内部的元素却是以一维方式去定义的 , 在网格当中顺序填充 , 在页面中表现为二维结构
而传统的table元素 , 则必须要在其中以二维的方式去定义tr和td
灵活性相比就差了很多

我们还可以用更简洁的写法
```css
.wrapper > .item1 {
	grid-column: 1 / 4;
}
```

#### 再复杂一些
理解了子元素的控制是以网格线为参照之后
我们就可以实现出更加复杂的布局了
```css
.wrapper {
	display : grid;
	grid-template-rows: 60px 40px 60px;
	grid-template-columns: 120px 60px 80px;
}
.wrapper > .item1 {
	grid-column-start: 1;
	grid-column-end: 3;
}
.wrapper > .item3 {
	grid-row-start: 2;
	grid-row-end: 4;
}
.wrapper > .item4 {
	grid-column-start: 2;
	grid-column-end: 4;
}
```
实际效果如下
![Alt text](/images/前端杂烩/grid/grid7.png)

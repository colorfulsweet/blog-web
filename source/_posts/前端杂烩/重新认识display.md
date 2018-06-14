---
title: 重新认识display
date: 2018-6-14 15:10:38
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

html元素可以分为`块级元素`和`内联元素`两类
我们可以通过设置display来进行改变
( 每个元素都有默认的display属性 , 它们都必须是这两类其中之一 )
但是块级元素并不仅仅是指`display:block`的元素 , 它的范围更广

<!-- more -->

块级元素具备这个基本特点:
> 在一个水平流上只能单独显示一个元素 , 多个块级元素则换行显示

只要具备这个特点的都是块级元素
比如`<li>`默认的是`display:list-item` , `<table>`默认的是`display:table`

### list-item
最初设计的display简单只有block和inline两种
他们能够表现的效果十分简单

但是在处理项目符号的时候 , 这两种盒子模型都无法满足要求了
因为需要一个附加盒子来放置圆点 数字这些项目符号
所以对于`display:list-item`来说
除了主块级盒子 , 还需要有这样一个`标记盒子`

```html
<ul>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>
```

### inline-block
最初对于块级元素和内联元素的定义 , 其实是这些元素的 **外在**表现
也就是是否能在一行当中排布 , 还是必须独占一行
`inline-block`则是更加细化了盒子模型
将盒子模型分为 **外在盒子**以及 **内在盒子**
当然这么说只是为了方便理解 , 内在盒子官方的称呼应该是`容器盒子`

所以这个值的意思应该是
> 外在具备内联元素的特点 , 可以在一行中有多个
内在具备块元素的特点 , 可以设置width和height来指定它的大小

那么block其实可以理解为block-block
inline可以理解为inline-inline

{% jsfiddle sookie/hLu81xet html,css,result dark %}

#### width与height
width和height是作用在哪个盒子上的 , 根据上面设置height和width属性的表现可以看出
显然是作用在 **内在盒子**上面的

width的默认值是`auto`
它至少包含以下不同的宽度表现
+ **充分利用可用空间** : 这种表现之下 , 横向占满父容器 , 见于外在块级元素 , 比如`<div>`, `<p>`
+ **收缩与包裹** : 代表是浮动 绝对定位 inline-block元素或table元素
+ **收缩到最小** : 容易出现在table-layout为auto的表格中 ( 表现为表格中的文字呈竖排被压缩为一列 )
+ **超出父容器限制** : 内容为很长的连续英文或数字 ( 汉字可以在任意位置截断 ) , 或者内联元素被设置了`white-space:nowrap`

##### 关于100%
对于display为block的元素 , 它的宽度如果是auto , 那么自然会表现为 **充分利用可用空间**
但是并不意味着指定width为100%会有同样的表现

比如这种情况
```html
<div class="box">
  <div class="cell">123</div>
  <div class="cell">456</div>
</div>
```
```css
.box {
  width: 150px;
  height: 100px;
  background: pink;
  
}
.box > .cell {
  background: orange;
  padding: 5px;
  margin: 5px;
  width: 100%;
}
```
子元素具备padding margin
设置了宽度100% , 反而会溢出父容器之外
![no width layout](/images/前端杂烩/no_width_layout.jpg)
更好的办法是借助流动性无宽度布局

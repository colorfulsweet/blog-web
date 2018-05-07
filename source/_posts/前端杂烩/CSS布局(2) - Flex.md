---
title: CSS布局(2)-Flex
date: 2018-5-15 22:38:32
tags: 
	- 前端
	- css
categories: 
	- 前端杂烩
---

Flex是`Flexible Box`的缩写，意为`弹性布局`，用来为盒状模型提供最大的灵活性。
目前，它已经得到了所有浏览器的支持
Flex布局将成为未来布局的首选方案
<!-- more -->
任何一个容器都可以指定为flex布局
```css
/*对于块元素*/
.box {
	display : flex;
}
/*对于行内元素*/
.inline-box {
	display : inline-flex;
}
```
为了兼容性的需要 , 通常可以加上`display:-webkit-flex;`
> 设为Flex布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效

### Flex容器的基本模型
采用了flex布局的元素 , 可以称之为`Flex容器` , 它的子元素自动成为这个容器的成员 , 被称为`Flex项目`
![Alt text](/images/前端杂烩/flex/Flex容器.png)
容器默认存在两根轴：水平的`主轴（main axis）`和竖直的`交叉轴（cross axis）`。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。
项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

### Flex容器的属性
#### flex-direction
决定主轴的方向 , 也就是项目的排列方向
<pre>row(默认) | row-reverse | column | column-reverse</pre>
![flex-direction](/images/前端杂烩/flex/flex-direction.png)

#### flex-wrap
默认情况下 , 项目都排列在一条轴线上 , 该属性定义了当一条轴线排列不下的时候 , 如何换行
<pre>nowrap(默认) | wrap | wrap-reverse</pre>
![flex-wrap](/images/前端杂烩/flex/flex-wrap.jpg)

#### flex-flow
这个属性是上面两个属性的简写形式 , 例如
flex-flow : column wrap , 就相当于 flex-direction:column;flex-wrap:wrap;

#### justify-content
项目在主轴上的对其方式
<pre>flex-start(默认) | flex-end | center | space-between | space-around</pre>
( 假设主轴为从左到右 ↓ )
![justify-content](/images/前端杂烩/flex/justify-content.png)

#### align-items
定义项目在交叉轴上如何对齐
<pre>flex-start | flex-end | center | baseline | stretch(默认)</pre>
![align-items](/images/前端杂烩/flex/align-items.png)

#### align-content
定义了多根轴线的对齐方式 , 如果项目只形成了一条轴线 , 那么该属性不起作用
<pre>flex-start | flex-end | center | space-between | space-around | stretch(默认)</pre>
![align-content](/images/前端杂烩/flex/align-content.png)


### 项目的属性

#### order
定义项目的排列顺序 , 升序排列 , 默认值为0

#### flex-grow
定义项目的放大比例 , 默认为0 , 即为即使有剩余的空间 , 也不放大
> 这个值定义的是不同项目之间的放大比值
> 比如共有3个项目 , 一个项目的flex-grow为2 , 其余的为1 , 如果有剩余可供放大的空间为400px , 那个flex-grow为2的项目将多占据200px , 其余2个各自多占据100px

#### flex-shrink
定义项目的缩小比例 , 默认为1 , 即空间不足时 , 该项目将被压缩
与flex-grow类似 , 这个属性也是不同项目之间的一个比例
如果定义为0 , 则不会被压缩 , 负值无效

#### flex-basis
定义了在分配多余空间之前 , 项目占据的主轴空间
<pre> &lt;length&gt; | auto(默认)</pre>
它可以设为像width height类似的值 , 比如100px , 项目将占据固定的主轴空间

#### flex
是flex-grow flex-shrink flex-basis的简写形式
默认 0 1 auto , 后两个值可选

#### align-self
允许单个项目与其他项目在交叉轴上有不同的对齐方式
也就是Flex容器定义的align-items在该项目上不会生效 , 而会被这个项目自身的align-self覆盖
<pre>auto(默认) | flex-start | flex-end | center | baseline | stretch</pre>
默认值auto表示继承父元素的align-items属性 , 除了auto以外 , 可以取的值与align-items完全一致
![Alt text](/images/前端杂烩/flex/align-self.png)


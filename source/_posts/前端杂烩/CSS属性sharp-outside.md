---
title: CSS属性sharp-outside
date: 2020-7-4 10:47:49
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

`shape-outside`的CSS属性定义了一个可以是非矩形的形状，相邻的内联内容应围绕该形状进行包装。默认情况下，内联内容包围其边距框

<!-- more -->
### 基本用法
#### 关键字值
+ margin-box
+ content-box
+ border-box
+ padding-box

这几个关键字值就是表示该形状的边界是盒子模型的哪一层
如果使用`box-sizing`属性也可以达到相同的目的

#### 图形函数值
可以使用**图形函数**
+ `circle([<shape-radius>]? [at <position>]?)` - 圆形，这个函数接受两个参数，均为可选
第一个参数表示圆的半径（负值无效），第二个参数表示圆心的定位（注意圆心定位前需要加**at**关键字）
```css
.container {
  background: #ccc;
  overflow: auto;
  font-size: 12px;
}
.container > .inner {
  background-color: white;
  height: 100px;
  width: 100px;
  float: left;
  shape-outside: circle(50% at 20px 30px);
}
```
![circle](/images/前端杂烩/sharp-outside/circle.png)

+ `ellipse([<shape-radius>{2}]? [at <position>]?)` - 椭圆形
这个函数与circle非常类似，差别就是shape-radius如果指定，需要指定两个值，分别表示X轴方向的半径和Y轴方向的半径

+ `inset(<shape-arg>{1,4} [round <border-radius>]?)` - 矩形
前四个参数分别代表了插进的长方形与相关盒模型的上，右，下与左边界和顶点的偏移量。这些参数遵循边际速记语法（the syntax of the margin shorthand），所以给予一个、两个、或四个值都能设置四个偏移量。
round后跟随的值表示圆角弧度
> 边际速记语法：1个值表示上下左右；2个值分别表示上下、左右；3个值表示上、左右、下，4个值表示上、右、下、左。
比如margin和padding的值使用的都是这种规则

+ `polygon([<fill-rule>,]? [<shape-arg> <shape-arg>]#)` - 多边形
fill-rule有`nonzero | evenodd`两个值，用于指定确定点在内部和外部的规则，每一对sharp-arg的值代表一个多边形顶点坐标
例如
```css
.container > .inner {
  /* 省略其他无关属性 */
  shape-outside: polygon(10px 10px, 20px 20px, 30px 30px);
}
```
![polygon](/images/前端杂烩/sharp-outside/polygon.png)

#### 使用图片形状
通常使用PNG图片，因为这种图片允许透明像素，如果是JPG这种只能是矩形的，也就没有什么意义了
根据图片的非透明区域进行包裹
```css
.container > .inner {
  shape-outside: url(/example/demo.png);
}
```
![url](/images/前端杂烩/sharp-outside/url.png)
实际使用的是该图片的轮廓，这个属性并不会使图片显示出来，如果要看到图片，还需要配合background属性


### 用于盒子内部
该属性是用于指定当前元素外部的形状，如果要在内部使用，就需要进行一些变通
在内部添加DOM结构进行占位，可以使用实体DOM，也可以使用伪元素
```html
<div class="circle">
  <div class="before"></div>
  <div class="after"></div>
  这里是内部的文字...
</div>
```

```css
.circle {
  border-radius: 50%;
  width: 207px;
  height: 250px;
  color: white;
  background-color: deepskyblue;
  padding: 10px;
  text-align: justify;
}
.before {
  float: left;
  width: 50%; height: 100%;
  shape-outside: radial-gradient(farthest-side ellipse at right, transparent 100%, red);
}
.after {
  float: right;
  width: 50%; height: 100%;
  shape-outside: radial-gradient(farthest-side ellipse at left, transparent 100%, red);
}

```
![circle-inner](/images/前端杂烩/sharp-outside/circle-inner.png)
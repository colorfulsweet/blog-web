---
title: CSS动画(1)-transform
date: 2018-5-12 18:10:10
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

CSS3当中与动画有关的属性有 : 
+ transform - 变形
+ transition - 转换
+ animation - 动画
<!-- more -->
> **准备知识 :** 
网页中对于元素所定义的坐标系
通常所关注的网页是一个平面
所以有X轴和Y轴
X轴是水平的 , 向右为正方向
Y轴是竖直的 , 向下为正方向
但是在元素动画相关的属性当中 , 存在3D变换
所以还需要一个Z轴
这个Z轴是垂直于平面 , 向外为正方向
![3d_axes](/images/前端杂烩/animation/3d_axes.png)
z-index属性值大小影响元素在Z轴方向上的排布与此同理


### transform
> 该属性只对block级元素生效

语法格式
<pre>
transform:  &lt;transform-function&gt; [&lt;transform-function&gt;]* | none
</pre>
也就是说这个属性对应的值可以是none , 代表不进行任何变形
也可以使用一个或多个**变形函数**
多个函数之间是以**空格**进行分割
函数有以下几类 ( 每一类都有若干个分功能的函数 , 类似于margin与margin-top的关系 )
+ translate - 转换
+ rotate - 旋转
+ scale - 缩放
+ skew - 倾斜

#### rotate - 旋转
直接使用同名的函数表示2D旋转
参数是旋转的角度
```css
.rotate_div {
  transform : rotate(30deg);
}
```
![rotate](/images/前端杂烩/animation/rotate.png)

deg是旋转的角度 , 正数表示顺时针旋转 , 负数表示逆时针旋转
也可以使用`trun`作为单位 , 表示一周 , 比如0.25turn实际就是90度

+ rotateX - 绕X轴旋转 ( 视觉效果上会在竖直方向上压缩 )
+ rotateY - 绕Y轴旋转 ( 视觉效果上会在水平方向上压缩 )
+ rotateZ - 绕Z轴旋转 , 实际上rotate本身执行的就是绕Z轴旋转

#### translate - 移动
同名函数接受2个参数 , 分别表示在X轴和Y轴上的移动距离 , 正数代表向该轴的正方向移动 , 负数代表向负方向移动
```css
.translate_div {
  tranform : translate(100px, 20px);
}
```
![translate-x-y](/images/前端杂烩/animation/translate-x-y.png)
+ translateX - 在X轴方向移动
+ translateY - 在Y轴方向移动
+ translateZ - 在Z轴方向移动
( 父元素需要有perspective属性的设置才能生效 这个属性代表透视点在Z轴上的位置 )

#### scale - 缩放
同名函数接受两个参数 , 分别表示在X轴和Y轴上的缩放比例 , 大于1是放大 , 小于1是缩小
```css
.scale_div {
  transform : scale(2, 1.5);
}
```
![scale-x-y](/images/前端杂烩/animation/scale-x-y.png)
+ scaleX - 在X轴方向缩放
+ scaleY - 在Y轴方向缩放
+ scaleZ - 在Z轴方向缩放 ( 当然需要其他的效果 , 比如绕X轴旋转 , 使元素在Z轴方向上有一定的纵深 , 才会有效果 )
+ scale3d - 包含3个参数 , 分别是在XYZ轴上的缩放比例

#### skew - 倾斜

同名函数可以提供1或者2个参数 , 如果只提供1个参数 , 代表在X轴方向的倾斜角度
如果提供两个参数 , 分别代表在X轴和Y轴方向的倾斜角度
```css
.skew_div {
  transform : skew(30deg, 10deg);
}
```
![skew-x-y](/images/前端杂烩/animation/skew-x-y.png)

同样有 skewX 与 skewY , 与上面的几个函数类似 , 不过没有Z轴方向的

> 旋转与倾斜 , 都与元素的基点有关系 , 默认情况下这个基点位于元素的中心
> 可以使用`transform-origin`属性来改变该元素的基点
> 这个属性的值可以是1~3个 , 可以使用长度值 百分比 关键字( 如top left等 )


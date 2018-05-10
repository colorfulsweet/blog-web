---
title: SASS-语法(1)
date: 2018-5-12 22:38:32
tags: 
  - 前端
  - sass
categories: 
  - 前端杂烩
---

### 变量
在scss当中定义变量的语法如下
<pre>
$变量名 : 变量值;
</pre>
代码块外部定义的变量可以在全局范围内使用
<!-- more -->
在代码块内部定义的变量是局部变量
例如
```scss
.box {
  $color:red;
  a{
    color:$color;
  }
}
```
如果该变量的值需要嵌入到字符串当中 , 需要加`#{ }`
```scss
$side : left;
.box {
  border-#{$side}-radius:5px;
}
```
#### 默认变量
sass的默认变量一般用来设置默认值 , 然后根据需求来进行覆盖
例如
```scss
$a_padding : 20px !default;
$a_padding : 6px;
```
如果对默认变量的值进行了覆盖 , 那么实际输出的就是覆盖之后的值 , 否则输出的就是默认值

如果是在一个单文件当中 , 并没有必要这样做
默认变量在`组件化开发`的时候会非常有用

> 什么时候需要声明变量
> + 该值至少重复出现了两次
> + 该值至少可能会被更新一次
> + 该值所有的表现都与变量有关

### 嵌套

使用嵌套的方式来编写css代码 , 可以使元素之间的层级关系更清晰 , 代码的可读性更强

#### 选择器嵌套
```scss
div {
  h1 {
    color :red;
  }
}
```
编译后的结果为
```
div h1 {
  color : red;
}
```
前面如果加上 `>`可以作为父子选择器

在嵌套的代码块内 , 可以使用`&`引用父元素
比如
```scss
a {
  &:hover{color:red;}
  &:visited{color:gray;}
}
```
#### 属性嵌套
有一些复合属性可以使用嵌套的方式来写
比如border
```scss
p {
  border : {
    color:red;
    width:2px;
  }
}
```
**注意** : border的后面必须要加上冒号

### 注释
SCSS可以有两种风格的注释
一种是标准的css注释 `/*  */`
编译会保留
另一种是单行注释 `//` , 编译过程不保留

### Mixin

Mixin有点像C语言的宏定义 , 是可以重用的代码块
```scss
//使用@mixin命令,定义一个代码块
@mixin left {
  float : left;
  margin-left : 10px;
}
//使用@include调用这个mixin
.box {
  @include left;
}
```
mixin的强大之处 , 在于可以去指定参数和缺省值
```scss
@mixin left($value:10px) {
  float : left;
  margin-left : $value;
}
.box {
  @include left(20px);
}
```
如果引入的时候不传参数 , 则使用缺省值
实例 : 生成浏览器前缀
```scss
@mixin rounded($vert, $horz, $radius: 10px) {
　border-#{$vert}-#{$horz}-radius: $radius;
　-moz-border-radius-#{$vert}#{$horz}: $radius;
　-webkit-border-#{$vert}-#{$horz}-radius: $radius;
}

#navbar li {
  @include rounded(top,left);
}
#footer {
  @include rounded(top,left,5px);
}
```

### 颜色函数
颜色函数是基于某个颜色进行的色彩调整
利用这些函数 , 可以很方便完成界面上风格统一的色彩搭配
涉及色彩的部分 , 可以很方便修改 , 完成主题风格的切换
```scss
$base_color : chocolate;

@mixin size {
  width:200px;
  height:100px;
}

.div1 {
  @include size;
  background:{
    color: darken($base_color, 10%);
  }
}
.div2 {
  @include size;
  background:{
    color: $base_color;
  }
}
.div3 {
  @include size;
  background:{
    color: lighten($base_color, 10%);
  }
}
```
效果图
![color_function](/images/前端杂烩/color_function.png)

常用的颜色函数
+ `darken` , `lighten` - 调整亮度 , 变暗/变亮
+ `sturate` , `desaturate` - 增加/减小 饱和度
+ `adjust-hue` - 调整 色相
+ `grayscale` - 灰度处理
+ `complement` - 色彩反相

### 文件引入
使用`@import` 引入另一个样式文件 , 可以是scss文件 , 也可以是css文件
```scss
@import "path/filename.scss"
@import "path/base.css"
```

### 继承
SASS允许一个选择器 , 继承另一个选择器
```scss
.class1 {
  border : 1px solid #ddd;
}
.class2 {
  @extend .class1;
  font-size : 120%;
}
```
在编译过后 , 会生成
```css
.class1, .class2 {
  border : 1px solid #ddd;
}
.class2 {
  font-size:120%;
}
```
相比于mixin会生成很多重复的代码 , 这种方式能够对代码进行复用 , 有利于提高css解析的效率

### 流程控制
#### 条件语句
使用`@if`和`@else`可以进行判断
```scss
@if lightness($color) > 30% {
　background-color: #000;
} @else {
　background-color: #fff;
}
```
#### 循环语句
for循环
```scss
@for $i from 1 to 10 {
  .border-#{$i} {
    border: #{$i}px solid blue;
  }
}
```
while循环
```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
```
each循环 , 类似于迭代器
```scss
@each $member in a, b, c, d {
  .#{$member} {
    background-image: url("/image/#{$member}.jpg");
  }
}
```
![each循环](/images/前端杂烩/each循环.png)

### 自定义函数

使用`@function`可以自定义一个函数
```scss
@function double($n) {
  @return $n * 2;
}
#sidebar {
  width : double(5px);
}
```

附 : 知识结构梳理
![Sass知识结构梳理](/images/前端杂烩/Sass知识结构梳理.png)


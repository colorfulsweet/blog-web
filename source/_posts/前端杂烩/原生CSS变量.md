---
title: 原生CSS变量
date: 2020-10-23 15:10:46
updateDate: 2021-04-26 11:51:23
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

多数时候我们要在CSS当中使用变量，都是使用`Less/Scss`等预处理工具来实现
现在原生CSS也同样是支持变量功能的

<!-- more -->

```css
:root {
  --text-color: red;
}
.box {
  color: var(--text-color);
}
```
+ `:root` - 这是一个CSS的伪类，匹配文档树的根元素
对于html文档，当然就是html元素，除了优先级更高，与html选择器相同
+ 自定义变量以`--`作为开头
+ 自定义变量是大小写敏感的

使用自定义变量可以有效减少代码的冗余，方便页面风格的统一

### 变量的继承性
子元素当中引用变量，如果在当前元素没有定义这个变量的值，会追溯父元素
所以上面的例子当中，直接在根元素上定义的变量，是在各处都可以使用的。

```css
.box1 {
  --text-color: red;
}
.child1 {
  color: var(--text-color);
}
.child2 {
  --text-color: blue;
  color: var(--text-color);
}
```
HTML结构
```html
<div class="box1">
  <div class="child1">这里是红色的文字</div>
  <div class="child2">这里是蓝色的文字</div>
</div>
```

### 变量的备用值
`var()`本身是一个函数，用它来引用变量时，可以指定一个或多个备用值
如果该变量未定义，就逐个使用备用值

```css
.child1 {
  color: var(--text-color, green);
  background-color: var(--bg-color2, var(--bg-color1, pink));
  border-color: var(--bd-color1, --bd-color2, gray);
}
```
如果text-color变量未定义，那么就使用green值
var作为一个函数，也是支持嵌套的

> 如果所有值都无效（未定义或该值用在指定CSS属性上是无效的），会使用继承值或初始值代替

### JS中获取CSS变量

```javascript
const box = document.querySelector('.box1')
// 行内样式
let value1 = box.style.getPropertyValue('--text-color')
// 独立的CSS样式
let value2 = getComputedStyle(box).getPropertyValue('--text-color')
```
其实就是可以把这个变量当做一个CSS属性，获取的方式没有什么不同

### 变量值类型
如果变量值是数字，是无法与单位进行拼接的，需要使用`calc`函数
```css
.box1 {
  --box-width: 300;
  width: calc(var(--box-width) * 1px);
}
```



### 区分于编程语言中的变量
原生CSS的变量，将其称为**自定义属性**更为合理
因为它和编程语言中的变量有很大不同
比如

#### important
```css
.box1 {
  --text-color: red !important;
  color: var(--text-color);
  color: blue;
}
.box2 {
  --text-color: red !important;
  --text-color: blue;
  color: var(--text-color);
}
```
如果在变量上加`!important`，是作用在这个变量(自定义属性)上，而不属于变量的值
所以上述代码实际效果是box1是blue，box2是red

#### 属性的覆盖
```css
.box {
  --s: 10px;
  margin: var(--s);
  --s: 20px;
  padding: var(--s);
}
```
上述代码的实际效果，margin和padding都会是20px
因为后一次自定义属性的定义覆盖了第一次，与常规编程语言中的变量先定义后使用的逻辑不同
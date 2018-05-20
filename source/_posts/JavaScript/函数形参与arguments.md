---
title: 函数形参与arguments
date: 2017-10-14 00:28:25
tags: 
  - JavaScript
  - 函数
categories: 
  - JavaScript
---

在之前我们知道 , 在JS当中函数的形参与调用时传入的实参并不需要必须对应
在函数的内部有一个对象`arguments` , 这是一个类数组 , 其中包含调用时传入的实参
当然函数在调用的时候 , 会按照形参的位置给形参赋值
<!-- more -->
但是如果我们在函数内部对形参进行赋值 , 或者对arguments当中的元素进行赋值 , 会出现怎样的情况呢

这在一般模式和严格模式下会有不同的行为
### 一般模式
调用时对于没有对应到实参的形参进行赋值
```javascript
function func1(arg0, arg1) {
  arg1 = 10;
  console.log(arg1, arguments[1]);
}
func1(19);// 10 undefined

function func2(arg0, arg1) {
  arguments[1] = 10;
  console.log(arg1, arguments[1]);
}
func2(21);// undefined 10
```
上面两个函数都有两个形参 , 实际调用时传入了一个实参 , **arg1**是没有与实参对应的
这时候对形参赋值 , 或者对arguments当中对应的元素赋值 , 各自的行为都是**独立**的 , 彼此不会产生影响

形参与实参有对应的情况
```javascript
function func1(arg0) {
  arg0 = 10;
  console.log(arg0, arguments[0]);
}
func1(19);// 10 10

function func2(arg0) {
  arguments[0] = 10;
  console.log(arg0, arguments[0]);
}
func2(21);// 10 10
```
可以看到 , 在这种情况下 , 形参与arguments当中的元素是双向绑定的 , 修改一个会自动影响另一个

### 严格模式
在严格模式下同样执行与上面类似的代码
```javascript
"use strict";
function func1(arg0) {
  arg0 = 10;
  console.log(arg0, arguments[0]);
}
func1(19);// 10 19

function func2(arg0) {
  arguments[0] = 10;
  console.log(arg0, arguments[0]);
}
func2(21);// 21 10

function func3(arg0) {
  arguments[0] = 10;
  console.log(arg0, arguments[0]);
}
func3();// undefined 10

function func4(arg0) {
  arg0 = 10;
  console.log(arg0, arguments[0]);
}
func4();// 10 undefined
```
可见严格模式之下 , 无论是哪种情况 , arguments与形参都是独立的 , 不会进行绑定 , 之间互不影响
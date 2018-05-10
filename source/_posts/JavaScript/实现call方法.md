---
title: 实现call方法
date: 2018-4-14 00:56:44
tags: 
  - JavaScript
  - prototype
categories: 
  - JavaScript
---

> call方法在使用一个指定的this值和若干个指定参数值的前提下调用某个函数
<!-- more -->
常规调用方式
```javascript
var obj = {
  name : "Sookie",
  func : function(msg) {
    console.log(this.name + " : " + msg);
  }
}
var fn1 = obj.func;
fn1.call(obj, "Hello");
```

现在如果要尝试实现一个call方法

#### 雏形
```javascript
Function.prototype.call2 = function(context) {
  context.fn = this;
  context.fn();
  delete context.fn;
}
```
初步实现了不传参情况下的函数调用
但是还有不少缺陷

#### 对参数的处理

由于需要处理实际参数 , 而且实际参数的数量又是不确定的
所以我们可以考虑使用`eval`来执行这个函数

```javascript
Function.prototype.call2 = function(context) {
  context.fn = this;
  var args = [];
  for(let i=1 ; i<arguments.length ; i++) {
    args.push("arguments[" + i + "]");
  }
  eval("context.fn(" + args + ")");
  delete context.fn;
};
```
比如实际调用函数的时候需要传入2个参数 , 包括前面的context , 所以arguments当中就有3个元素

那么就相当于执行 
context.fn(arguments[1], arguments[2])

#### 返回值与完善

还需要处理函数的返回值
另外 , 在我们的call方法当中 , 对上下文对象添加了fn属性 , 最后又删除了它
如果这个对象上原本就有这个属性 , 那么就对这个对象产生了破坏
可以预先把这个对象保存下来
```javascript
Function.prototype.call2 = function(context) {
  var _fn = null;
  var flag = false;
  if("fn" in context) {
    _fn = context.fn;
  }
  _fn = context.fn;
  context.fn = this;
  var args = [];
  for(let i=1 ; i<arguments.length ; i++) {
    args.push("arguments[" + i + "]");
  }
  var result = eval("context.fn(" + args + ")");
  if(flag) {
    context.fn = _fn;
  } else {
    delete context.fn;
  }
  return result;
};
```

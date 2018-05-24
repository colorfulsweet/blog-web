---
title: Symbol
date: 2018-5-6 20:09:40
tags: 
  - JavaScript
  - ECMAScript6
categories: 
  - JavaScript
---
在ES6标准当中 , 新引入了一种基本数据类型 , 就是`Symbol`
<!-- more -->
在此之前的基本数据类型有
+ undefined
+ null
+ object
+ number
+ boolean
+ string

通常我们可以使用`typeof`来判断一个对象的类型
但是存在一些特例
1. 对于一个函数对象 , 对其执行typeof操作 , 获得的是`"function"`
2. 对于null , 对其执行typeof操作 , 获得的是`"object"`

---
Symbol对象可以认为是一个**唯一标识**
我们可以采用如下的方式来构造出一个Symbol对象
+ Symbol() - 这种方式每次调用 , 返回的对象都不同
+ Symbol.for(string) - 这种方式会试图访问已经存在的Symbol对象 , 如果不存在则创建一个新的
Symbol.for("aa") == Symbol.for("aa")  会获得**true**
+ 使用预定义的Symbol对象 , 比如Symbol.iterator
+ 使用typeof Symbol对象 , 返回"symbol"

### 应用场景

#### 构造一个对象当中的私有属性
JavaScript的对象属性默认是可以被外界访问和修改的
通常我们对于不希望被访问的变量 , 以下划线开头明明
但是这只是一种约定 , 并不具有强制作用
如果我们开发的第三方模块当中 , 需要有只提供给模块内方法访问的私有属性
那么就可以借助Symbol来实现
```javascript
const p = (function(){
  const [_x, _y] = [Symbol(), Symbol()];

  function Point(x,y) {
    this[_x] = x;
    this[_y] = y;
  }
  Point.prototype.length = function() {
    const x = this[_x],
    y = this[_y];

    return Math.sqrt(x * x + y * y);
  }
  return new Point(3, 4);
})();

console.log(p.length()); //5
```
在上面提到过 , 每次调用Symbol()返回的对象都是不同的
所以在自动执行的函数内部 , _x 和 _y其实是不同的对象
或者我们也可以用`Symbol("x")`和`Symbol("y")`来进行区分 , 这不是必须的

这种情况下 , 内部的两个属性就真正成为了私有属性 , 无法在外部访问到它的值
因为在外部再次调用Symbol()产生的是不同的对象

#### 避免命名冲突
对于相对复杂的模块 , 暴露出的对象内部的私有变量可能需要很多
如果这些私有变量没有被完全私有化
那么这个模块的兼容性和可扩展性就会很差
因为在扩展时十分容易出现命名的冲突问题

或者可以用一个十分冗长的字符串作为属性名 , 那么源代码的可读性就基本不存在了

使用Symbol可以解决这个问题 , 与上面的类似的
变量私有化 , 则不会产生同名的冲突
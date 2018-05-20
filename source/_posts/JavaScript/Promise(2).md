---
title: Promise(2)
date: 2018-4-20 19:45:09
tags: 
  - JavaScript
  - Promise
categories: 
  - JavaScript
---

如果只是执行一次单步回调 , 那么传统的回调函数执行的方式其实并没有什么问题

Promise的主要意义是在于解决多重回调的多层嵌套问题
如果回调的嵌套层级太多 , 会造成代码可读性很差 , 难以维护
<!-- more -->
例如
```javascript
var test = function(num, func) {
  console.log(num);
  func(num);
};
test(1, function(a){
  test(2, function(b){
    test(3, function(c){
      console.log("回调成功");
    });
  });
});
```
使用Promise可以将上述的代码改造成线性的模式 , 可读性增强 , 同时也更便于调试
```javascript
var pro = new Promise(function(resolve, reject){
  resolve(1);
}).then(function(val){
  console.log(val);
  return new Promise(function(resolve, reject){
    resolve(2);
  });
}).then(function(val){
  console.log(val);
  return new Promise(function(resolve, reject){
    resolve(3);
  });
}).then(function(val){
  console.log(val);
});
```
让then方法的函数每次都是返回不同的Promise实例 , 再去指定这个实例的回调函数即可

并且对于Promise对象 , 它的回调执行是异步的
例如 :
```javascript
new Promise(function(resolve, reject){
  resolve("AA");
}).then(function(msg){
  console.log(msg);
});
console.log("BB");
/* output:
BB
AA
*/
```
对于异步操作实现的原理 , 可以参考JS的事件驱动模型
JS引擎会将回调函数的执行加入到事件队列当中
从而实现在单线程的条件下 , 代码的异步执行

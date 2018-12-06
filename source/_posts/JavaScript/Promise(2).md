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
如果我们要使用setTimeout来构造一个顺序异步执行的过程
需要这样做
```javascript
function test(num, func) {
  setTimeout(function(){
    console.log(num)
    func(num)
  }, 0)
}
test(1, function(a){
  test(2, function(b){
    test(3, function(c){
      console.log("回调成功")
    })
  })
})
```
使用Promise可以将上述的代码改造成线性的模式 , 可读性增强 , 同时也更便于调试
```javascript
new Promise(function(resolve, reject){
  resolve(1)
}).then(function(val){
  console.log(val)
  return new Promise(function(resolve, reject){
    resolve(2)
  })
}).then(function(val){
  console.log(val)
  return new Promise(function(resolve, reject){
    resolve(3)
  })
}).then(function(val){
  console.log(val)
})
```
让then方法的函数每次都是返回不同的Promise实例 , 再去指定这个实例的回调函数即可

并且对于Promise对象 , 它对于resolve和reject的执行是异步的
例如 :
```javascript
new Promise(function(resolve, reject){
  console.log("AA");
  resolve("BB");
}).then(function(msg){
  console.log(msg);
});
console.log("CC");
/* output:
AA
CC
BB
*/
```

---
#### Promise.resolve 和 Promise.reject
`Promise.resolve`方法会返回一个Promise实例
分为下面几种情况
1. 参数是一个Promise实例
将不做任何修改, 直接返回这个Promise实例

2. 参数是一个thenable对象
thenable对象意思是这个对象当中带有then属性, 值是一个函数, 接收参数resolve和reject两个函数
```javascript
const p1 = Promise.resolve({
  then: (resolve, reject) => {
    resolve('异步回调执行')
  }
})
// 等价于如下写法
const p2 = new Promise((resolve, reject) => {
  resolve('异步回调执行')
})
```

3. 参数是不具有then方法的对象
```javascript
const p1 = Promise.resolve('Hello')
// 等价于如下写法
new Promise((resolve, reject) => {
  resolve('Hello')
})
```

4. 没有任何参数
```javascript
const p1 = Promise.resolve()
// 等价于如下写法
new Promise((resolve, reject) => {
  resolve()
})
```
其实实际效果可以归为到第三类

---
`Promise.reject`方法就相对比较简单了
只有这一种情况
```javascript
Promise.reject('Error')
// 等价于如下写法
new Promise((resolve, reject) => {
  reject('Error')
})
```
不论传入什么参数, 都会传递给reject
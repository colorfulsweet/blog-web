---
title: Promise(1)
date: 2018-4-20 19:43:20
tags: 
  - JavaScript
  - Promise
categories: 
  - JavaScript
---

在JavaScript当中 , 不存在真正的多线程 , 从而导致所有需要异步执行的操作都需要使用回调函数实现
<!-- more -->
例如 : 使用定时器去执行一个回调函数
```javascript
function callback(){
    console.debug("Time Out!");
}
console.log("before");
setTimeout(callback,1000);
console.log("after");
```
定时器会在1秒之后去执行callback这个回调函数
这就实现了一个简单的异步操作
异步操作会在将来的某个时间点触发一个函数调用
Ajax的异步请求也是一种异步操作

类似这种**承诺将来会执行**的对象 , 在ES6当中被统一规范为`Promise对象`

这个对象的最大作用就是将执行代码和处理结果的回调函数进行了分离 , 从而在存在多重回调的情境当中 , 代码的可读性更强

一个简单的例子
```javascript
var status = true;
function test(resolve, reject) {
    if (status) {
        resolve('success');
    } else {
        reject('failed');
    }
}
var p1 = new Promise(test);
//then传入的是resolve的实现
//catch传入的是reject的实现
p1.then(console.log).catch(console.error);
/*
也可以用如下的方式, 实际效果同上
p1.then(console.log, console.log);
*/
```
Promise对象在创建的时候 , 传入的这个函数当中并不关心成功与失败具体的回调是什么 , 而只是关心何时去执行该回调函数

Promise对象有3种状态
1. `Fulfilled` 成功的状态
2. `Rejected` 失败的状态
3. `Pending` Promise 对象实例创建时候的初始状态

可以由初始状态转换到成功状态 , 或者由初始状态转换到失败状态 , 并且不可逆
我们可以在初始化函数里面自己编写逻辑来确定何种情况下执行成功的回调函数( resolve ) 或者失败的函数( reject )
如果抛出错误而且没有进行捕获 , 则一定会执行失败的函数( reject )

如果对于某种状态 , 要执行多个回调函数
可以进行链式调用 , 也就是连缀多个`then`方法
前一个then方法中的返回值会作为下一个回调函数的参数
```javascript
var status = true;
function test(resolve, reject) {
    if (status) {
        resolve('success');
    } else {
        reject('failed');
    }
}
var p1 = new Promise(test);
p1
.then(function(msg){
  console.log("我是第一个回调函数:" + msg);
  return msg;
})
.then(function(msg){
  console.log("我是第二个回调函数:" + msg);
})
.catch(console.error);
```
当然上面这种方式只能适用于多重回调函数中只有一个参数的情况
如果要传多个参数
必须使用数组的形式传递
比如参数中是`function([msg1, msg2])`
前一个回调函数中`return ["AA","BB"]`

---
#### Promise.all 和 Promise.race
`Promise.all`方法可以接收一个Promise对象构成的数组作为参数 , 返回一个Promise对象
当数组中的这些Promise对象**全部**转换为成功状态的时候 , 这个对象才转换为成功状态 , 否则就转换为失败状态
```javascript
var status = [true, true];
function test1(resolve, reject){
  if(status[0]) {
    resolve("success");
  } else {
    reject("failed");
  }
}
function test2(resolve, reject){
  if(status[1]) {
    resolve("success");
  } else {
    reject("failed");
  }
}
var p1 = new Promise(test1);
var p2 = new Promise(test2);
p1.then((msg)=>console.log("成功" + msg))
.catch((msg)=>console.error("失败" + msg));

p2.then((msg)=>console.log("成功" + msg))
.catch((msg)=>console.error("失败" + msg));

Promise.all([p1,p2])
.then(function(msgs){
  console.log(msgs instanceof Array);//true
  console.log(msgs);//[ 'success', 'success' ]
});
//注意 : 这里的回调函数的参数就是所有Promise对象成功回调函数传入参数的数组
//(如果只有一个参数,则不构成数组)
```

`Promise.race`方法的用法与all类似 , 它返回的Promise对象是当数组中**存在**Promise对象转为成功状态的时候 , 它就转为成功状态 , 如果全是失败状态 , 它才是失败状态 
```javascript
status[1] = false;
var p3 = new Promise(test1);
var p4 = new Promise(test2);
p3.then((msg)=>console.log("成功" + msg))
.catch((msg)=>console.error("失败" + msg));

p4.then((msg)=>console.log("成功" + msg))
.catch((msg)=>console.error("失败" + msg));
Promise.race([p3,p4])
.then(function(msgs){
  //参数规则同Promise.all
  console.log(msgs);
});
```

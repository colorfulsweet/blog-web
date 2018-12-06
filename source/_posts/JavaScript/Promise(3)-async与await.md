---
title: Promise(3)-async与await
date: 2018-12-6 15:29:07
tags: 
  - JavaScript
  - Promise
categories: 
  - JavaScript
---

### async的作用
首先`async`关键字是用来修饰函数的
带有async的函数, 调用的返回值必定是一个Promise对象
1. 如果本身返回的就是Promise对象, 则不会做任何处理
2. 如果本身返回的不是Promise对象, 则会用`Promise.resolve`包装后再返回

```javascript
async function test1() {
  return '123'
}
const p1 = test1()
// 等价于如下写法
function test2() {
  return '123'
}
const p2 = Promise.resolve(test2())
```

### await的作用
`await`是用来修饰**表达式**的
表示**等待这个表达式的执行结果**
限制就是必须使用在async函数当中, 否则就会报错
![await](/images/JavaScript/await.png)

表达式的结果可以是Promise对象, 也可以不是

+ 不是promise对象 : await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果
例如
```javascript
console.log(1);
(async function(){
  /* 存在await导致该函数异步执行, 所以会先输出之后的3 */
  console.log(await 4); //阻塞之后的2
  console.log(2);
})();
console.log(3);
/* output: 1 3 4 2 */
```
正因为await会阻塞之后的代码, 所以才必须放在async函数当中

+ 是promise对象 : await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果。


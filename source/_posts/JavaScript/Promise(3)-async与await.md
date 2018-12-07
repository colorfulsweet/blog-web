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
<!-- more -->

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

+ 不是promise对象 : await会阻塞后面的代码，先执行await所在的async函数调用之后的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果
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

+ 是promise对象 : await 也会阻塞async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果。
例如
```javascript
async function test() {
  console.log(4)
  return 1
}

(async function(){
  // 因为test函数是async修饰的, 所以返回的是Promise对象
  console.log(await test())
  console.log(2)
})()
console.log(3)
/* output: 4 3 1 2 */
```

### setTimeout与Promise
Promise是一个`micro task`,我们的主线程是一个`task`。micro task会在task后面执行，然后才会接着执行下一个task。
而setTimeout的返回函数是一个新的task,所以这里**Promise的执行会先于新task执行**

简单来说就是
setTimeout的队列与promise的队列不是同一个队列，执行的优先级低于promise

---
### 综合运用
```javascript
async function async1() {
  console.log( 'async1 start' ) // (3)
  await async2() // (4)
  console.log( 'async1 end' ) // (5)
}

async function async2() {
  console.log( 'async2' ) // (6)
}

console.log( 'script start' ) // (1)

setTimeout( function () {
  console.log( 'setTimeout' ) // (2)
}, 0 )

async1()

new Promise( function ( resolve ) {
  console.log( 'promise1' ) // (7)
  resolve();
} ).then( function () {
  console.log( 'promise2' ) // (8)
} )
console.log( 'script end' ) // (9)
```

执行过程分析:
1. 开始是async1和async2两个函数定义, 但是没有调用, 所以先跳过, 首先执行的肯定是(1), 输出**script start**
2. 然后是一个定时器, 那么此时会吧定时器的回调函数加入到任务队列当中
> 此时的task队列 _[ (2) ]_

3. 然后是async1的调用, 会先执行(3), 输出**async1 start**
4. 执行到(4)时, 会阻塞之后的内容, 也就是(5), 并加入任务队列
但是async2函数内部的内容不会阻塞, 还是同步执行, 执行(6), 输出**async2**
> 此时的micro task队列 _[ (5) ]_

5. 之后创建Promise对象, 构造方法传入的函数是立即执行的, 执行(7), 输出**promise1**

6. resolve的执行加入到任务队列, 也就是(8)
> 此时的micro task队列 _[ (5) (8) ]_

7. 最后的(9)属于主线, 所以直接执行, 输出**script end**

8. 主线执行完毕, 开始执行任务队列当中的内容, 首先会执行micro task队列的内容
依次输出**async1 end**和**promise2**

9. micro task队列出队执行完毕, 开始执行新的task队列(由setTimeout创建的)
所以输出**setTimeout**

> 最终的输出结果是:
```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```
说明: 不同的js引擎的实现, async1 end和promise2的顺序可能有差别, 其他的顺序都是一样的
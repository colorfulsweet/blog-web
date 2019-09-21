---
title: Web-Workers
date: 2019-09-21 19:22:06
tags: 
  - JavaScript
  - Web Worker
categories: 
  - JavaScript
---

在较早的时候，JavaScript本身是没有多线程的，如果执行耗时长的同步操作会造成页面假死影响用户体验
HTML5提供了`Web Workers API`，可以解决这个问题

<!-- more -->
并非所有耗时操作都可以用异步解决
比如密集的计算或者一些高延迟的任务

简单来说，Web Workers可以在一个子线程当中运行一个js脚本，这个js脚本当中可能有一些耗时的操作
从而保证主线程不会被阻塞
并且提供了一些机制在主子线程之间进行通信

### 基本用法
```javascript
var wk = new Worker('./worker.js'， {})
```
> 第一个参数是worker将执行的脚本的URL，它必须遵守同源策略。
第二个参数是配置项(可选)，有以下三个有效项
+ type：指定要创建的工作进程类型的名称。如果未指定，则默认使用classic。
+ credentials：指定要用于工作进程的凭据类型的名称。如果未指定，或者类型为classic，则使用的默认值为省略（不需要凭据）。
+ name：一个字符串，指定表示工作进程作用域的专用WorkerGlobalScope的标识名称，主要用于调试。


### 线程通信
不同的线程之间的通信是采用事件机制触发的，使用`message`事件进行通信
```javascript
// main.js
console.log('这里是主线程')
var wk = new Worker('./js/worker.js', {})
wk.onmessage = event => {
  // 这里用来接收子线程发过来的消息
  console.log(event.data)
}
wk.onerror = err => {
  // 子线程抛出的错误
  wk.terminate() // 立即终止worker
  console.error(err)
}
let btn = document.getElementById('send-msg')
btn.addEventListener('click', function(){
  // 向子线程发送消息
  wk.postMessage({msg: 'HOHO~'}) // 可以是任意的对象
})
console.log('这里还是主线程')
```
子线程对应的js代码
```javascript
// worker.js
console.log('这里是子线程')
let i = 1
function simpleCount() {
  self.postMessage(++i)
  if(i>100) {
    self.close() // 子线程关闭自己
  }
  setTimeout(simpleCount, 1000)
}
simpleCount()
self.onmessage = event => {
  console.log(event.data)
}
```
+ 子线程中的`self`代表线程自身，如同非严格模式下主线程中this指向window
非严格模式下的子线程this指向这个self
+ 子线程无法读取主线程所在网页的DOM对象，也无法使用document、window、parent这些对象。
但是，子线程可以`navigator`对象和`location(只读)`对象
+ postMessage的对象传递是`值拷贝`，而且是深拷贝，并非地址拷贝
(实际实现的方式是先进行序列化，再进行反序列化)
+ 子线程中有可以加载脚本的函数 **importScripts('script1.js', 'script2.js')**
+ 子线程中不能执行诸如**alert confirm**等阻塞性的函数
+ 子线程执行**close**或者主线程对worker执行**terminate**会结束子线程
Worker对象如果没有引用指向，则会被JavaScript的垃圾回收器回收
其他情况下子线程即使空闲也不会停止，随时可以响应主线程的通信
+ `wk.onmessage`同样也可以使用`wk.addEventListener('message', function(){...})`

### 数据转移
主线程与子线程之间可以交换二进制数据，比如ArrayBuffer对象
但是拷贝方式发送数据会造成严重的性能问题
因此postMessage可以接受第二个参数，用来把二进制数据直接转移给子线程
(一旦转移，主线程将无法再使用这些数据)
```javascript
let obj = {
  ab: new ArrayBuffer(10)
}
console.log('转交前长度', obj.ab.byteLength) // 10
wk.postMessage(obj,[obj.ab])
console.log('转交后长度', obj.ab.byteLength) // 0
```
在子线程当中同样通过event.data拿到该对象
```javascript
self.onmessage = function(event) {
  console.log(event.data.ab)
}
```
> 可以这样转移的对象须实现`Transferable`接口，这只是一个标记接口
实现该接口的类型有`ArrayBuffer`、`MessagePort`、`ImageBitmap`

### 可能的错误
+ 如果文档不允许启动worker，则会引发`SecurityError`
+ 如果脚本之一的MIME类型为 text/csv, image/*, video/*,或 audio/*, 则会引发`NetworkError`。它应该始终是 text/javascript。
+ 如果url无法解析，则引发`SyntaxError`。

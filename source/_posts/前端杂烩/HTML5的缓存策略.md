---
title: HTML5的缓存策略
date: 2017-11-10 13:01:24
tags: 
  - HTML5
categories: 
  - 前端杂烩
---

HTML5当中新增了两种浏览器端的缓存方式
分别是`sessionStorage`和`localStorage`

+ **sessionStorage** - 用于会话级别数据的缓存 , 这些数据只有在同一个会话中的页面才能访问 , 当会话结束后数据就会随之销毁
+ **localStorage** - 用于持久化的本地存储 , 除非主动删除数据 , 否则数据是永远不会过期的
<!-- more -->
在此之前 , 本地缓存的方式主要就是cookie
但是cookie有很多弊端 , 比如
+ 存储容量是受限的
+ 每次请求一个新的页面 , cookie都会被带过去 , 浪费了带宽
+ 无法跨域调用
+ 明文存储 , 安全性很差

当然有了web storage , 也并不能完全取代cookie , 因为cookie的作用是与服务器进行交互 , 作为HTTP规范的一部分而存在 , 而Web Storage仅仅是为了在本地存储数据而已

---
在支持web storage的浏览器当中 , `sessionStorage`和`localStorage`都是window当中的全局对象 , 可以直接使用
用法都很简单
![localstorage](/images/前端杂烩/localstorage.png)
可以直接使用继承自原型对象的这几个方法 , 添加 获取 移除 键值对 , 也可以当做普通的JS对象来使用 , 直接给对象属性赋值

```javascript
localStorage.setItem("name","Sookie");
//或者 localStorage.name = "Sookie";
localStorage.getItem("name");
//或者 localStorage.name;
localStorage.removeItem("name");
//或者 delete localStorage.name
```
除此之外 , `key()`方法可以获取到Storage当中指定索引的键 , 与length配合可以用于遍历所有缓存的数据

```javascript
for(let index=0 ; index<localStorage.length ; index++) {
  let key = localStorage.key(index);
  let value = localStorage.getItem(key);
  console.log(key + " = " + value);
}
```

---
####事件
浏览器提供了`storage`事件 , 用于监听**localStorage**的变化
> 需要注意的是 , 在某一个页面设置这个事件的回调函数之后 , 在本页面对localStorage进行操作 , 是不会触发这个事件的 , 在另外一个标签中打开该页面 , 才会触发这个事件

```javascript
window.addEventListener("storage",function(e){
  console.log(e);
});
```
![storage_event](/images/前端杂烩/storage_event.png)
---
title: 重新认识JSON.stringify
date: 2019-12-11 21:18:56
categories: 
  - JavaScript
tags: 
  - JavaScript
---

`JSON.stringify`方法用于将对象进行序列化
但是对于不同的对象，该方法有不同的表现，并且也可以巧妙利用它去优雅地达到一些目的

<!-- more -->
### 对于不同对象的处理

```javascript
const data = {
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn: function() {
    return true
  },
  arr: [1, undefined, Symbol("ee"), function(){}]
}
JSON.stringify(data) // {"a":"aaa","arr":[1,null,null,null]}
```
undefined、任意的函数以及symbol作为对象属性值时 JSON.stringify() 将**跳过**（忽略）对它们进行序列化
如果上述几种对象是数组当中的元素，将被序列化为 **null**
如果上述几种对象单独执行序列化，得到的结果都是 **undefined**

```javascript
const data = {
  a: NaN,
  b: Infinity,
  c: null
}
JSON.stringify(data) //{"a":null,"b":null,"c":null}
```
`NaN`、`Infinity`和`null`都会被序列化为null
对其单独执行也都是null

### toJSON
如果转换的对象当中包含`toJSON`函数
转换的结果将是该函数的返回值
```javascript
const data = {
  a: "aaa",
  toJSON() {
    return "Hello"
  }
}
JSON.stringify(data) // "Hello"
```
> 对于其中的每一个嵌套的对象，同样符合该特点

基于上述特性，对于Date对象，是可以正常序列化为UTC时间的字符串的
因为Date对象本身实现了该方法

### 深拷贝
如果可以不在意对特殊对象的处理，我们可以利用 JSON.stringify 来简单实现深拷贝
但是如果对象当中出现循环引用
就会抛出错误

```javascript
const data = {
  a: 10
}
data.loopData = data

JSON.stringify(data)
/* 
Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'loopData' closes the circle
    at JSON.stringify (<anonymous>)
    at <anonymous>:6:18
*/
```

### 另外两个参数
JSON.stringify 还有另外两个可选参数`replacer`和`space`

replacer可以是一个函数，接收key和value两个参数，分别是对象中成员的键和值
该函数的返回值将被作为序列化的结果

所以我们可以利用这个函数，来改变上面提到的一些默认行为
```javascript
const data = {
  a: '11',
  b: undefined
}
JSON.stringify(data, (key, value)=>{
  if(typeof value === 'undefined') {
    return null
  }
  return value
}) // {"a":"11","b":null}

```

replacer参数也可以是一个数组
含义就是只有在这个数组当中包含的元素作为的key才会被序列化，其余会被忽略
```javascript
const data = {
  a: '11',
  b: '22'
}
JSON.stringify(data, ['b']) // {"b":"22"}
```
> 当然，按照开头提到的规则，该被忽略的还是会被忽略，哪怕它存在于这个数组当中

space这个参数用于美化输出

指定缩进用的空白字符串；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。